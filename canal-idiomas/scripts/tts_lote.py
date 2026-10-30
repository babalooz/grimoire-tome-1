"""Voz da Sitcom do Café EM LOTE: 1 pedido Gemini TTS por (personagem, idioma) num episódio, em vez de 1 por fala.

Por quê: a cota do gemini-3.8-flash-tts é 100 pedidos/dia por modelo e o modo antigo gasta 1 por fala (16–22 por vídeo);
em 29/10 a cota acabou e a sitcom do dia ficou sem voz.

Como (mesma técnica do vocabulário, scripts/tts_vocab.py):
  - junta as falas únicas (fora do cache) do mesmo (speaker, lang), separadas por linha em branco (instrução de pausa
    em texto é lida em voz alta: docs/vozes-gemini.md, por isso a pausa vem só da quebra de parágrafo);
  - corta o áudio nos N-1 silêncios escolhidos por tts_vocab.cortar (casa duração com tamanho do texto + bônus de
    silêncio longo);
  - confere: (1) os N-1 silêncios de corte têm de ser claramente mais longos que qualquer pausa interna (margem ≥
    MARGEM_MIN) = achou exatamente N trechos; (2) transcrição dos cortes (modelo de texto, cota separada da do TTS)
    bate com o texto esperado. Se não conferir, o grupo volta ao modo antigo (1 pedido por fala) e fica registrado.
  - cada corte é gravado no cache com a MESMA chave do modo antigo (tts._gemini_key): o resto do motor (synth_cafe,
    filtro de telefone da Dona Jaca, parts/wpm do timings.json) não muda, e falas já no cache não gastam pedido.
`mode`/`speed` não vão no pedido do Gemini (nem no modo antigo: só entram na chave do cache e nos timings), então o
lote agrupa só por (speaker, lang) sem mudar o som; cada fala mantém a própria chave com o próprio speed.

Uso: chamado por tts.render_cafe quando engine="gemini" e lote ligado (padrão); `--sem-lote` volta ao modo antigo.
"""
import hashlib
import json
from pathlib import Path

import numpy as np
import soundfile as sf

import tts

MARGEM_MIN = 1.3  # menor silêncio de corte ÷ maior pausa interna: abaixo disso o nº de trechos é ambíguo
MARGEM_SEM_OUVIDO = 2.0  # se a transcrição falhar (rede/cota do modelo de texto), só aceita corte muito claro
# Separador: linha em branco + marcação de pausa do Gemini-TTS. Só linha em branco deu pausa de 0,4–0,6 s entre falas
# (prova de 30/10, T1 E03 V1), igual às pausas internas ("...", ponto) -> corte ambíguo em 3 de 5 grupos.
SEP = "\n\n[long pause]\n\n"
LIDO_EM_VOZ_ALTA = ("pause", "pausa")  # se a marcação for falada, o corte é reprovado


def falas(episode: dict, model: str) -> list[dict]:
    """Mesma conta de tts.render_cafe por beat: speaker/lang/speed/texto final mandado ao Gemini e a chave do cache."""
    alvo = episode.get("alvo") or {}
    beats = episode["beats"]
    first = next((i for i, b in enumerate(beats) if b.get("alvo") is True), -1)
    out = []
    for i, b in enumerate(beats):
        if b.get("tipo") in ("pausa", "pergunta") or "text" not in b:
            continue
        speaker = tts.ALIAS.get(b.get("speaker", "capi"), b.get("speaker", "capi"))
        lang, mode = b["lang"], b.get("mode", "fala")
        speed = b.get("speed")
        if speed is None:
            speed = tts.CAFE_SPEED.get((speaker, lang), 1.0) * (tts.CAFE_THOUGHT if mode == "pensamento" else 1.0)
        pieces = tts._cafe_pieces(b, i == first, alvo.get("nucleo"))
        texto = " ".join(p.rstrip(" ,") + ("..." if j < len(pieces) - 1 and not p.rstrip().endswith("...") else "")
                         for j, p in enumerate(pieces))
        voice = tts.GEMINI_VOICE.get(speaker, tts.GEMINI_VOICE["capi"])
        out.append({"beat": i, "speaker": speaker, "lang": lang, "mode": mode, "speed": speed, "texto": texto,
                    "voice": voice, "key": tts._gemini_key(speaker, lang, "fala", speed, texto, voice, model)})
    return out


def _pedir(textos: list[str], lang: str, voice: str, model: str) -> tuple[np.ndarray, int]:
    import base64
    import io
    import re
    from teste_voz import GEMINI_API, http
    corpo = SEP.join(tts.speech_text(t, lang) for t in textos)
    body = {"contents": [{"parts": [{"text": corpo}]}],
            "generationConfig": {"responseModalities": ["AUDIO"],
                                 "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": voice}}}}}
    tts._conta_pedido()
    try:
        resp = http(f"{GEMINI_API}/models/{model}:generateContent", json.dumps(body).encode(),
                    {"Content-Type": "application/json"})
    except SystemExit as e:
        raise tts.GeminiQuotaError(str(e)) from e
    parte = json.loads(resp)["candidates"][0]["content"]["parts"][0]["inlineData"]
    bruto = base64.b64decode(parte["data"])
    mime = parte.get("mimeType", "")
    if "wav" in mime:
        return sf.read(io.BytesIO(bruto), dtype="float32")
    sr = int(re.search(r"rate=(\d+)", mime or "rate=24000").group(1))
    return np.frombuffer(bruto, dtype="<i2").astype("float32") / 32768, sr


def _ouvir(cortes: list, sr: int, lang: str, pasta: Path, tag: str) -> list[str] | None:
    """Transcreve cada corte num pedido próprio ao modelo de texto (cota separada do TTS). Vários clipes num pedido só
    não serve: o ouvido redistribui o texto entre eles e até inventa frase (medido em 30/10). None se algum falhar."""
    import tts_vocab
    pasta.mkdir(exist_ok=True)
    ouvidos = []
    for k, c in enumerate(cortes):
        arq = pasta / f"{tag}-{k}.wav"
        sf.write(arq, c, sr)
        ouvido = None
        for _ in range(2):
            try:
                o = tts_vocab.ouvir([arq], lang)
                if len(o) == 1:
                    ouvido = o[0]
                    break
            except (Exception, SystemExit) as e:
                print(f"  aviso: transcrição falhou ({type(e).__name__}: {str(e)[:100]})")
        arq.unlink()
        if ouvido is None:
            return None
        ouvidos.append(ouvido)
    return ouvidos


def preencher(episode: dict, model: str = tts.GEMINI_MODEL_CAFE, cache_dir: Path | None = None) -> dict:
    """Gera em lote as falas do episódio que faltam no cache. Devolve o registro (vai para public/audio/<id>/lote.json).
    O que não conferir fica fora do cache e render_cafe gera no modo antigo, fala a fala."""
    import tts_vocab  # import tardio: tts_vocab importa tts
    cache = cache_dir or tts.GEMINI_CACHE
    (cache / "lote").mkdir(parents=True, exist_ok=True)
    grupos: dict[tuple, dict] = {}
    for f in falas(episode, model):
        if (cache / f"{f['key']}.wav").exists():
            continue
        g = grupos.setdefault((f["speaker"], f["lang"]), {})
        g.setdefault(f["key"], f)  # fala repetida (mesma chave) = 1 item só
    reg = {"episodio": episode["id"], "modelo": model, "grupos": []}
    for (speaker, lang), itens in grupos.items():
        itens = list(itens.values())
        r = {"speaker": speaker, "lang": lang, "falas": len(itens), "beats": [f["beat"] for f in itens]}
        reg["grupos"].append(r)
        if len(itens) == 1:  # 1 fala só: é o próprio pedido do modo antigo (render_cafe faz)
            r["modo"] = "unico"
            continue
        textos = [f["texto"] for f in itens]
        voice = itens[0]["voice"]
        h = hashlib.sha256("|".join([model, voice, lang, SEP.join(textos)]).encode()).hexdigest()[:12]
        raw = cache / "lote" / f"{speaker}-{lang}-{h}.wav"
        if raw.exists():
            audio, sr = sf.read(raw, dtype="float32")
            r["pedido"] = "cache"
        else:
            audio, sr = _pedir(textos, lang, voice, model)  # GeminiQuotaError sobe: a rotina para no 1º 429
            sf.write(raw, audio, sr)
            r["pedido"] = "novo"
        try:
            segs, conf = tts_vocab.cortar(audio, sr, textos)
        except ValueError as e:  # menos silêncios que falas
            r.update(modo="antigo", motivo=f"corte: {e}")
            print(f"  lote {speaker}/{lang}: {e} -> modo antigo")
            continue
        r.update(conf)
        corta = lambda segs: [tts._trim(audio[max(0, int((s0 - tts_vocab.HEAD) * sr)):  # noqa: E731
                                              min(len(audio), int((s1 + tts_vocab.TAIL) * sr))]) for s0, s1 in segs]
        cortes = corta(segs)
        alvo = [tts.speech_text(t, lang) for t in textos]  # o que foi FALADO (ex. "Capy" sai "Cappy" em EN)
        ouvidos = _ouvir(cortes, sr, lang, cache / "lote" / "_conf", h)
        if ouvidos:
            confere = [tts_vocab.bate(t, o, lang) and not any(w in o.lower() for w in LIDO_EM_VOZ_ALTA)
                       for t, o in zip(alvo, ouvidos)]
            r["ouvido"] = ouvidos
            ok = conf["margem"] >= MARGEM_MIN and all(confere)
            motivo = None if ok else (f"margem {conf['margem']}× < {MARGEM_MIN}" if conf["margem"] < MARGEM_MIN
                                      else f"transcrição não bate em {confere.count(False)} de {len(textos)}")
        else:
            ok = conf["margem"] >= MARGEM_SEM_OUVIDO
            motivo = None if ok else f"sem transcrição e margem {conf['margem']}× < {MARGEM_SEM_OUVIDO}"
        metodo = "silencio"
        r["metodo"] = metodo
        print(f"  lote {speaker}/{lang}: {len(textos)} falas, margem {conf['margem']}× "
              f"(corte ≥ {conf['menor_silencio_corte']} s, interno ≤ {conf['maior_silencio_interno']} s)"
              f"{'' if ouvidos is None else ', ouvido ' + json.dumps(ouvidos, ensure_ascii=False)}"
              f" -> {('ok por ' + metodo) if ok else 'MODO ANTIGO: ' + motivo}")
        if not ok:
            r.update(modo="antigo", motivo=motivo)
            continue
        r["modo"] = "lote"
        r["duracoes"] = [round(len(c) / sr, 3) for c in cortes]
        for f, c in zip(itens, cortes):
            sf.write(cache / f"{f['key']}.wav", c, sr)
    return reg
