"""Voz da série de VOCABULÁRIO (formato `vocab`, composição Vocab) com Gemini TTS, gastando o mínimo de pedidos.

Cota grátis do Gemini TTS ~10 pedidos/dia por modelo. Em vez de 1 pedido por fala, vai 1 pedido por PACOTE
(personagem + idioma): as palavras (ou as falas em PT) separadas por linha em branco. O áudio volta inteiro e é
cortado nos N-1 silêncios mais longos (N = itens esperados). Cada corte é conferido de 2 jeitos:
  1. margem do silêncio: o menor silêncio escolhido tem de ser bem maior que o maior silêncio que ficou dentro de um item;
  2. transcrição: os cortes vão, na ordem, para um modelo de texto do Gemini (cota separada da do TTS), que devolve
     o que ouviu em cada um; o texto tem de bater com o esperado.
Texto puro (instrução de estilo é lida em voz alta: docs/vozes-gemini.md); a voz de cada personagem é a de tts.GEMINI_VOICE.

Cache: public/<tema.audio>/raw/<speaker>-<lang>-<hash>.wav (resposta crua do Gemini; o hash inclui modelo, voz e texto)
       public/<tema.audio>/<speaker>-<lang>-<item>.wav + clips.json (cortes, duração, início da fala, transcrição).
O cache vai para o branch voz-cache (mesmo caminho), e uma rodada nova só pede o que falta.

Uso: .venv/bin/python scripts/tts_vocab.py vocab/numeros-1a10.json [--modelo gemini-3.8-flash-lite-tts] [--so-cortar]
Sai com código 3 se a cota acabou antes do fim (o que já veio fica no cache) e imprime "voz do vocabulário X de Y".
"""
import argparse
import base64
import hashlib
import io
import json
import re
import sys
import unicodedata
from pathlib import Path

import numpy as np
import soundfile as sf

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "scripts"))
import tts  # noqa: E402  (GEMINI_VOICE, speech_text, GeminiQuotaError)
from teste_voz import GEMINI_API, http  # noqa: E402

MODELO_PADRAO = "gemini-3.8-flash-lite-tts"  # cota própria, separada da Sitcom do Café (que usa flash-tts desde 28/10)
MODELO_OUVIDO = "gemini-3.5-flash"  # confere os cortes (modelo de texto: cota separada da do TTS)
HEAD, TAIL = 0.04, 0.08  # folga antes/depois da fala em cada corte (não come consoante final: five, eight)
SILENCIO_MIN = 0.12  # s: silêncio menor que isso nunca é fronteira


def pacotes(tema: dict) -> list[dict]:
    """Todos os pedidos necessários: 1 por (personagem, idioma). EN = as palavras do tema; PT = falas e dicas."""
    en = {tema["apresenta"], tema["revisao"], tema["final"], *tema["desafio"]["vozes"]}
    for b in tema["blocos"]:
        en.update(b["ecos"])
    out = []
    for sp in sorted(en):
        out.append({"speaker": sp, "lang": "en",
                    "itens": [(f"w{i}", p["en"].capitalize() + ".") for i, p in enumerate(tema["palavras"])]})
    pt: dict[str, list] = {}
    for k, f in tema["falas"].items():
        pt.setdefault(f["speaker"], []).append((k, f["text"]))
    for p in tema["palavras"]:
        if p.get("armadilha"):
            pt.setdefault(tema["dicas"], []).append((p["armadilha"]["id"], p["armadilha"]["dica"]))
    for sp, itens in pt.items():
        out.append({"speaker": sp, "lang": "pt", "itens": itens})
    return out


def texto_pedido(pac: dict) -> str:
    return "\n\n".join(tts.speech_text(t, pac["lang"]) for _, t in pac["itens"])


def chave(pac: dict, modelo: str) -> str:
    voz = tts.GEMINI_VOICE[pac["speaker"]]
    return hashlib.sha256("|".join([modelo, voz, pac["lang"], texto_pedido(pac)]).encode()).hexdigest()[:12]


def pedir(pac: dict, modelo: str) -> tuple[np.ndarray, int]:
    url = f"{GEMINI_API}/models/{modelo}:generateContent"
    body = {"contents": [{"parts": [{"text": texto_pedido(pac)}]}],
            "generationConfig": {"responseModalities": ["AUDIO"],
                                 "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {
                                     "voiceName": tts.GEMINI_VOICE[pac["speaker"]]}}}}}
    try:
        resp = http(url, json.dumps(body).encode(), {"Content-Type": "application/json"})
    except SystemExit as e:
        raise tts.GeminiQuotaError(str(e)) from e
    parte = json.loads(resp)["candidates"][0]["content"]["parts"][0]["inlineData"]
    bruto = base64.b64decode(parte["data"])
    mime = parte.get("mimeType", "")
    if "wav" in mime:
        return sf.read(io.BytesIO(bruto), dtype="float32")
    sr = int(re.search(r"rate=(\d+)", mime or "rate=24000").group(1))
    return np.frombuffer(bruto, dtype="<i2").astype("float32") / 32768, sr


def silencios(audio: np.ndarray, sr: int) -> tuple[list[tuple[float, float]], float, float]:
    """Trechos de silêncio internos (início, fim em s), início e fim da fala. Limiar = pico − 38 dB (janela de 10 ms)."""
    hop = int(0.01 * sr)
    n = len(audio) // hop
    rms = np.sqrt(np.mean(audio[: n * hop].reshape(n, hop) ** 2, axis=1) + 1e-12)
    db = 20 * np.log10(rms)
    voz = db > max(db.max() - 38, -55)
    idx = np.flatnonzero(voz)
    ini, fim = idx[0], idx[-1] + 1
    runs, k = [], ini
    while k < fim:
        if not voz[k]:
            j = k
            while j < fim and not voz[j]:
                j += 1
            runs.append((k * 0.01, j * 0.01))
            k = j
        else:
            k += 1
    return runs, ini * 0.01, fim * 0.01


def cortar(audio: np.ndarray, sr: int, textos: list[str]) -> tuple[list[tuple[float, float]], dict]:
    """Escolhe N-1 silêncios como fronteiras. Nem sempre a linha em branco do pedido vira o silêncio mais longo
    (o Gemini às vezes pausa mais entre 2 frases da MESMA fala), então a escolha casa a duração de cada pedaço com o
    tamanho do texto esperado (programação dinâmica) e dá bônus a silêncio longo. A transcrição confere depois."""
    n = len(textos)
    runs, ini, fim = silencios(audio, sr)
    cands = [r for r in runs if r[1] - r[0] >= SILENCIO_MIN]
    if len(cands) < n - 1:
        raise ValueError(f"só {len(cands)} silêncios para {n} itens")
    letras = [max(1, len(re.findall(r"\w", t))) for t in textos]
    fala = (fim - ini) - sum(b - a for a, b in runs)
    seg_por_letra = fala / sum(letras)
    m = len(cands)
    # custo[k][j] = melhor custo com o item k terminando no silêncio j (j = m: fim do áudio)
    INF = float("inf")
    custo = [[INF] * (m + 1) for _ in range(n)]
    volta = [[-1] * (m + 1) for _ in range(n)]

    def c_seg(ini_s: float, fim_s: float, k: int) -> float:
        interno = sum(max(0.0, min(b, fim_s) - max(a, ini_s)) for a, b in runs)
        d = max(0.05, fim_s - ini_s - interno)
        return float(np.log(d / (letras[k] * seg_por_letra)) ** 2)

    bonus = lambda j: -0.6 * float(np.log(cands[j][1] - cands[j][0]))  # noqa: E731  silêncio longo = fronteira provável
    for j in range(m + 1):
        if n == 1 and j != m:
            continue
        f = cands[j][0] if j < m else fim
        custo[0][j] = c_seg(ini, f, 0) + (bonus(j) if j < m else 0)
    for k in range(1, n):
        for j in range(k, m + 1):
            if (k == n - 1) != (j == m):
                continue
            f = cands[j][0] if j < m else fim
            for i in range(k - 1, j):
                if custo[k - 1][i] == INF:
                    continue
                v = custo[k - 1][i] + c_seg(cands[i][1], f, k) + (bonus(j) if j < m else 0)
                if v < custo[k][j]:
                    custo[k][j], volta[k][j] = v, i
    fronteiras, j = [], m
    for k in range(n - 1, 0, -1):
        j = volta[k][j]
        fronteiras.append(j)
    escolhidos = [cands[j] for j in sorted(fronteiras)]
    bordas = [ini] + [x for a, b in escolhidos for x in (a, b)] + [fim]
    segs = [(bordas[2 * i], bordas[2 * i + 1]) for i in range(n)]
    menor = min((b - a for a, b in escolhidos), default=9)
    sobra = max((b - a for a, b in runs if (a, b) not in escolhidos), default=0)
    return segs, {"menor_silencio_corte": round(menor, 3), "maior_silencio_interno": round(sobra, 3),
                  "margem": round(menor / max(sobra, 0.01), 2)}


def norm(t: str) -> str:
    t = unicodedata.normalize("NFKD", t.lower())
    t = "".join(c for c in t if not unicodedata.combining(c))
    return " ".join(re.sub(r"[^a-z0-9 ]+", " ", t).split())


NUM_EN = {"1": "one", "2": "two", "3": "three", "4": "four", "5": "five", "6": "six", "7": "seven", "8": "eight",
          "9": "nine", "10": "ten"}


def bate(esperado: str, ouvido: str, lang: str) -> bool:
    e, o = norm(esperado), norm(ouvido)
    if lang == "en":
        o = " ".join(NUM_EN.get(w, w) for w in o.split())
        return e == o
    we, wo = e.split(), o.split()
    # as duas direções: falta palavra (corte comeu) e sobra palavra (corte pegou pedaço da fala vizinha)
    return (sum(w in set(wo) for w in we) / max(1, len(we)) >= 0.75
            and sum(w in set(we) for w in wo) / max(1, len(wo)) >= 0.75)


def ouvir(clipes: list[Path], lang: str) -> list[str]:
    """Transcreve os cortes (na ordem) num pedido só ao modelo de texto. Devolve 1 texto por corte."""
    idioma = "English" if lang == "en" else "Brazilian Portuguese"
    partes = [{"text": f"You will receive {len(clipes)} short audio clips in order ({idioma}). Transcribe exactly what is "
                       f"spoken in EACH clip, word for word, numbers written as words. Answer ONLY a JSON array of "
                       f"{len(clipes)} strings, one per clip, in the same order."}]
    for c in clipes:
        partes.append({"inlineData": {"mimeType": "audio/wav", "data": base64.b64encode(c.read_bytes()).decode()}})
    url = f"{GEMINI_API}/models/{MODELO_OUVIDO}:generateContent"
    body = {"contents": [{"parts": partes}], "generationConfig": {"temperature": 0}}
    d = json.loads(http(url, json.dumps(body).encode(), {"Content-Type": "application/json"}))
    txt = "".join(p.get("text", "") for p in d["candidates"][0]["content"]["parts"])
    return json.loads(txt[txt.index("["): txt.rindex("]") + 1])


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("tema")
    ap.add_argument("--modelo", default=MODELO_PADRAO)
    ap.add_argument("--so-cortar", action="store_true", help="não pede nada ao TTS: só corta/confere o que está no cache")
    ap.add_argument("--sem-ouvido", action="store_true", help="não confere os cortes por transcrição")
    a = ap.parse_args()
    tema = json.loads(Path(a.tema).read_text())
    pasta = ROOT / "public" / tema["audio"]
    (pasta / "raw").mkdir(parents=True, exist_ok=True)
    clips_f = pasta / "clips.json"
    clips = json.loads(clips_f.read_text()) if clips_f.exists() else {}
    pacs = pacotes(tema)
    pedidos, prontos, parou = 0, 0, None
    for pac in pacs:
        raw = pasta / "raw" / f"{pac['speaker']}-{pac['lang']}-{chave(pac, a.modelo)}.wav"
        if not raw.exists():
            if a.so_cortar or parou:
                continue
            try:
                audio, sr = pedir(pac, a.modelo)
            except tts.GeminiQuotaError as e:
                parou = str(e)
                continue
            pedidos += 1
            sf.write(raw, audio, sr)
            print(f"pedido {pedidos}: {pac['speaker']}/{pac['lang']} ({len(audio) / sr:.1f} s)")
        audio, sr = sf.read(raw, dtype="float32")
        segs, conf = cortar(audio, sr, [t for _, t in pac["itens"]])
        saidas = []
        for (item, texto), (s0, s1) in zip(pac["itens"], segs):
            a0, a1 = max(0, int((s0 - HEAD) * sr)), min(len(audio), int((s1 + TAIL) * sr))
            f = pasta / f"{pac['speaker']}-{pac['lang']}-{item}.wav"
            sf.write(f, audio[a0:a1], sr)
            saidas.append(f)
            k_ = f"{pac['speaker']}|{pac['lang']}|{item}"
            antes = clips.get(k_, {})
            clips[k_] = {
                "audio": f"{tema['audio']}/{f.name}", "duration": round((a1 - a0) / sr, 3),
                "onset": round(s0 - a0 / sr, 3), "fala": round(s1 - s0, 3), "text": texto,
                "modelo": a.modelo, "voz": tts.GEMINI_VOICE[pac["speaker"]], "raw": f"raw/{raw.name}"}
            if antes.get("raw") == f"raw/{raw.name}" and "confere" in antes:  # mesmo áudio: vale a conferência anterior
                clips[k_].update(ouvido=antes.get("ouvido"), confere=antes["confere"])
        ouvidos = None
        for tentativa in range(3):  # o ouvido às vezes desalinha a lista inteira: ouve de novo antes de reprovar o corte
            if a.sem_ouvido or all(clips[f"{pac['speaker']}|{pac['lang']}|{i}"].get("confere") for i, _ in pac["itens"]):
                break
            try:
                ouvidos = ouvir(saidas, pac["lang"])
            except (Exception, SystemExit) as e:  # sem o ouvido, o corte fica marcado como não conferido
                print(f"  aviso: conferência por transcrição falhou ({type(e).__name__}: {str(e)[:120]})")
                continue
            for k, (item, texto) in enumerate(pac["itens"]):
                c = clips[f"{pac['speaker']}|{pac['lang']}|{item}"]
                if len(ouvidos) == len(pac["itens"]) and not c.get("confere"):
                    c["ouvido"] = ouvidos[k]
                    c["confere"] = bate(texto, ouvidos[k], pac["lang"])
        ok = sum(1 for i, _ in pac["itens"] if clips[f"{pac['speaker']}|{pac['lang']}|{i}"].get("confere"))
        print(f"  {pac['speaker']}/{pac['lang']}: {len(segs)} cortes · margem de silêncio {conf['margem']}× "
              f"(corte ≥ {conf['menor_silencio_corte']} s, interno ≤ {conf['maior_silencio_interno']} s) · "
              f"transcrição confere {ok}/{len(segs)}")
        for i, _ in pac["itens"]:
            c = clips[f"{pac['speaker']}|{pac['lang']}|{i}"]
            if not c.get("confere"):
                print(f"    ✗ {i}: esperado {c['text']!r}, ouvido {c.get('ouvido')!r}")
        prontos += 1
    clips_f.write_text(json.dumps(clips, ensure_ascii=False, indent=2))
    print(f"voz do vocabulário {prontos} de {len(pacs)} pacotes · {pedidos} pedidos TTS novos ({a.modelo})")
    if parou:
        print(f"PAROU (cota): {parou[:200]}", file=sys.stderr)
        sys.exit(3)
    if prontos < len(pacs):
        sys.exit(3)


if __name__ == "__main__":
    main()
