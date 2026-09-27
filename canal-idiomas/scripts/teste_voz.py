"""Teste cego de voz do CapyFala (estudo: docs/pesquisas/formato-novo/voz-audio-didatico.md §4).

Gera as 5 falas fixas do estudo em Gemini TTS, Azure Neural e Kokoro (âncora), embaralha os arquivos para a escuta cega
e mede o que dá para medir por código (duração, palavras/min, pausas). Só biblioteca padrão + numpy/soundfile (já no .venv).

CHAVES: nenhuma chave no código nem no ambiente da sessão. Elas entram como "Credencial de API" do ambiente e o proxy
injeta o header sozinho:
  - Gemini: header x-goog-api-key em generativelanguage.googleapis.com
  - Azure : header Ocp-Apim-Subscription-Key em <regiao>.tts.speech.microsoft.com (região recomendada: eastus)

Uso (a partir de canal-idiomas/):
  .venv/bin/python scripts/teste_voz.py --dry-run                 # mostra o que seria enviado; NÃO chama nada
  .venv/bin/python scripts/teste_voz.py --listar-modelos          # Gemini: lista modelos com "tts" no nome (leitura)
  .venv/bin/python scripts/teste_voz.py --listar-vozes            # Azure: confere se as vozes escolhidas existem (leitura)
  .venv/bin/python scripts/teste_voz.py --motores gemini azure kokoro   # gera tudo (depois de ter as credenciais)
  .venv/bin/python scripts/teste_voz.py --embaralhar              # monta teste-voz/cego/ + gabarito + planilha de notas

Saídas (fora do git): teste-voz/brutos/<motor>/f<N>_r<k>.wav · teste-voz/medidas.csv · teste-voz/cego/<id>.wav ·
teste-voz/gabarito.json (NÃO mostrar aos ouvintes) · teste-voz/notas.csv (formulário de MOS e pronúncia).
"""
import argparse
import base64
import csv
import json
import os
import random
import re
import sys
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "teste-voz"
SR = 24000
REGIAO = os.environ.get("AZURE_TTS_REGIAO", "eastus")
GEMINI_API = "https://generativelanguage.googleapis.com/v1beta"
# Modelos candidatos (o estudo cita "Gemini 3.8 Flash TTS" GA em 22/09/2026 e "3.1 Flash TTS" preview). Os IDs exatos
# não foram verificados: rode --listar-modelos e passe --modelo-gemini se o nome for outro.
GEMINI_MODELOS = ["gemini-3.8-flash-tts", "gemini-3.1-flash-tts-preview", "gemini-2.5-flash-preview-tts"]

# As 5 falas FIXAS do estudo (§4). Não editar depois de ouvir (regra do teste).
FALAS = [
    {"n": 1, "quem": "capy", "texto": "Gente, eu pedi um coffee to go e a moça me deu um cup of tea… de novo!",
     "alvos": ["coffee to go", "cup of tea"], "idioma": "pt-BR+en"},
    {"n": 2, "quem": "hank", "texto": "What do you wanna do this weekend? I'm kinda tired.",
     "alvos": ["wanna", "kinda"], "idioma": "en-US"},
    {"n": 3, "quem": "lazy", "texto": "Ship… Sheep… Ship. Sheep.", "alvos": ["ship", "sheep"], "idioma": "en-US",
     "pausa_ms": 600, "wpm_alvo": 100},
    {"n": 4, "quem": "lazy", "texto": "Through. T-H-R-O-U-G-H. Thirteen, not thirty.",
     "alvos": ["through", "T-H-R-O-U-G-H", "thirteen", "thirty"], "idioma": "en-US", "wpm_alvo": 100},
    {"n": 5, "quem": "poppy", "texto": "No cap, that pizza was bussin'. Lowkey the best in town.",
     "alvos": ["no cap", "bussin'", "lowkey"], "idioma": "en-US"},
]

# Instrução de estilo por personagem (Gemini: vai no próprio texto; nenhum nome de pessoa real).
ESTILO = {
    "capy": "Read in Brazilian Portuguese, warm young adult female voice; say the English words with a light Brazilian "
            "accent, vowels slightly open, not exaggerated: ",
    "hank": "Say in a gruff, deadpan, low male voice, General American, natural conversational speed: ",
    "lazy": "Say very slowly and clearly, relaxed male voice, General American, with a clear pause of about 600 "
            "milliseconds between each word or block: ",
    "poppy": "Say casually and fast like a young Gen Z influencer, General American: ",
}
GEMINI_VOZ = {"capy": "Kore", "hank": "Charon", "lazy": "Algieba", "poppy": "Leda"}  # vozes prontas (conferir no --dry-run)

# Azure: vozes prontas do catálogo (conferidas com --listar-vozes antes de gerar).
AZURE_VOZ = {"capy": "pt-BR-ThalitaMultilingualNeural", "hank": "en-US-GuyNeural", "lazy": "en-US-DavisNeural",
             "poppy": "en-US-AriaNeural"}

KOKORO = {"capy": ("capi", "pt"), "hank": ("hank", "en"), "lazy": ("lazy", "en"), "poppy": ("poppy", "en")}


# ---------------------------------------------------------------- SSML (Azure)
def ssml(f: dict) -> str:
    voz = AZURE_VOZ[f["quem"]]
    if f["n"] == 1:
        corpo = ('Gente, eu pedi um <lang xml:lang="en-US">coffee to go</lang> e a moça me deu um '
                 '<lang xml:lang="en-US">cup of tea</lang>… de novo!')
        lang = "pt-BR"
    elif f["n"] == 3:
        corpo = ('<prosody rate="-20%"><phoneme alphabet="ipa" ph="ʃɪp">ship</phoneme><break time="600ms"/>'
                 '<phoneme alphabet="ipa" ph="ʃiːp">sheep</phoneme><break time="600ms"/>'
                 '<phoneme alphabet="ipa" ph="ʃɪp">ship</phoneme><break time="600ms"/>'
                 '<phoneme alphabet="ipa" ph="ʃiːp">sheep</phoneme></prosody>')
        lang = "en-US"
    elif f["n"] == 4:
        corpo = ('<prosody rate="-20%">Through.<break time="500ms"/><say-as interpret-as="characters">THROUGH</say-as>'
                 '<break time="500ms"/><emphasis level="strong">Thirteen</emphasis>, not '
                 '<emphasis level="strong">thirty</emphasis>.</prosody>')
        lang = "en-US"
    else:
        corpo = f["texto"]
        lang = "en-US"
    return (f'<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="{lang}">'
            f'<voice name="{voz}">{corpo}</voice></speak>')


# ---------------------------------------------------------------- chamadas
def http(url: str, body: bytes | None, headers: dict, metodo: str = "POST") -> bytes:
    req = urllib.request.Request(url, data=body, method=metodo, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=120) as r:
            return r.read()
    except urllib.error.HTTPError as e:  # sem headers no erro: a chave nunca aparece
        raise SystemExit(f"HTTP {e.code} em {url.split('?')[0]}: {e.read()[:300].decode(errors='replace')}")


def gemini_req(f: dict, modelo: str) -> tuple[str, dict]:
    url = f"{GEMINI_API}/models/{modelo}:generateContent"
    body = {"contents": [{"parts": [{"text": ESTILO[f["quem"]] + f["texto"]}]}],
            "generationConfig": {"responseModalities": ["AUDIO"],
                                 "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": GEMINI_VOZ[f["quem"]]}}}}}
    return url, body


def gemini(f: dict, modelo: str):
    import numpy as np
    url, body = gemini_req(f, modelo)
    d = json.loads(http(url, json.dumps(body).encode(), {"Content-Type": "application/json"}))
    parte = d["candidates"][0]["content"]["parts"][0]["inlineData"]
    taxa = int(re.search(r"rate=(\d+)", parte.get("mimeType", "rate=24000")).group(1))
    pcm = np.frombuffer(base64.b64decode(parte["data"]), dtype="<i2").astype("float32") / 32768
    return pcm, taxa


def azure(f: dict):
    import io
    import soundfile as sf
    url = f"https://{REGIAO}.tts.speech.microsoft.com/cognitiveservices/v1"
    wav = http(url, ssml(f).encode("utf-8"), {"Content-Type": "application/ssml+xml",
                                              "X-Microsoft-OutputFormat": "riff-24khz-16bit-mono-pcm",
                                              "User-Agent": "capyfala-teste-voz"})
    audio, taxa = sf.read(io.BytesIO(wav), dtype="float32")
    return audio, taxa


def kokoro(f: dict):
    sys.path.insert(0, str(ROOT / "scripts"))
    from tts import synth
    speaker, lang = KOKORO[f["quem"]]
    texto = f["texto"].replace("…", "...")
    if f["n"] == 1:  # Kokoro tem 1 idioma por fala: só dá para ler tudo com a voz pt (limitação registrada)
        lang = "pt"
    return synth(texto, lang, speaker)


# ---------------------------------------------------------------- medidas
def medir(audio, taxa: int, f: dict) -> dict:
    import numpy as np
    x = np.abs(audio if audio.ndim == 1 else audio.mean(axis=1))
    janela = int(0.02 * taxa)
    energia = np.array([x[i:i + janela].mean() for i in range(0, len(x), janela)])
    voz = energia > max(energia.max() * 0.05, 1e-4)
    idx = np.flatnonzero(voz)
    if not len(idx):
        return {"duracao_s": 0, "wpm": 0, "pausas_ms": ""}
    util = voz[idx[0]: idx[-1] + 1]
    pausas, cont = [], 0
    for v in util:
        if not v:
            cont += 1
        elif cont:
            if cont * 20 >= 200:
                pausas.append(cont * 20)
            cont = 0
    dur = (idx[-1] - idx[0] + 1) * 0.02
    palavras = len(re.findall(r"[A-Za-zÀ-ÿ']+", f["texto"]))
    return {"duracao_s": round(dur, 2), "wpm": round(palavras / dur * 60) if dur else 0,
            "pausas_ms": " ".join(map(str, pausas))}


# ---------------------------------------------------------------- execução
def gerar(motores: list[str], repeticoes: int, modelo: str) -> None:
    import soundfile as sf
    OUT.mkdir(exist_ok=True)
    linhas = []
    for motor in motores:
        pasta = OUT / "brutos" / motor
        pasta.mkdir(parents=True, exist_ok=True)
        for f in FALAS:
            n_rep = repeticoes if f["n"] == 2 else 1  # métrica D: consistência na fala 2, gerada várias vezes
            for k in range(1, n_rep + 1):
                audio, taxa = gemini(f, modelo) if motor == "gemini" else azure(f) if motor == "azure" else kokoro(f)
                arq = pasta / f"f{f['n']}_r{k}.wav"
                sf.write(arq, audio, taxa)
                m = medir(audio, taxa, f)
                linhas.append({"motor": motor, "fala": f["n"], "rep": k, "arquivo": str(arq.relative_to(OUT)), **m,
                               "wpm_alvo": f.get("wpm_alvo", ""), "pausa_alvo_ms": f.get("pausa_ms", "")})
                print(f"ok {motor} fala {f['n']} r{k}: {m}")
    with (OUT / "medidas.csv").open("w", newline="") as fh:
        w = csv.DictWriter(fh, fieldnames=list(linhas[0]))
        w.writeheader()
        w.writerows(linhas)
    print(f"medidas: {OUT / 'medidas.csv'}")


def embaralhar() -> None:
    import shutil
    brutos = sorted(p for p in (OUT / "brutos").rglob("*_r1.wav"))
    random.seed()
    ids = random.sample(range(1000, 9999), len(brutos))
    cego = OUT / "cego"
    cego.mkdir(parents=True, exist_ok=True)
    gabarito, notas = {}, []
    for i, p in zip(ids, brutos):
        nome = f"{i}.wav"
        shutil.copy2(p, cego / nome)
        motor, fala = p.parent.name, int(p.stem[1])
        gabarito[nome] = {"motor": motor, "fala": fala}
        notas.append({"arquivo": nome, "fala": fala, "texto": FALAS[fala - 1]["texto"],
                      "alvos": " | ".join(FALAS[fala - 1]["alvos"]), "naturalidade_1a5": "",
                      "alvos_certos_s_n": "", "ouvinte": ""})
    random.shuffle(notas)
    (OUT / "gabarito.json").write_text(json.dumps(gabarito, ensure_ascii=False, indent=2))
    with (OUT / "notas.csv").open("w", newline="") as fh:
        w = csv.DictWriter(fh, fieldnames=list(notas[0]))
        w.writeheader()
        w.writerows(notas)
    print(f"cego: {len(notas)} arquivos em {cego} · notas.csv pronto · gabarito.json NÃO vai para os ouvintes")


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--listar-modelos", action="store_true")
    ap.add_argument("--listar-vozes", action="store_true")
    ap.add_argument("--motores", nargs="+", choices=["gemini", "azure", "kokoro"])
    ap.add_argument("--modelo-gemini", default=GEMINI_MODELOS[0])
    ap.add_argument("--repeticoes", type=int, default=5, help="vezes que a fala 2 é gerada (consistência)")
    ap.add_argument("--embaralhar", action="store_true")
    a = ap.parse_args()

    if a.dry_run:
        chars = sum(len(f["texto"]) for f in FALAS) + 4 * len(FALAS[1]["texto"])
        print(f"Região Azure: {REGIAO} · modelo Gemini: {a.modelo_gemini} · ~{chars} caracteres por motor (centavos)\n")
        for f in FALAS:
            url, body = gemini_req(f, a.modelo_gemini)
            print(f"[fala {f['n']} · {f['quem']}] {f['texto']}")
            print(f"  GEMINI POST {url}\n    {json.dumps(body, ensure_ascii=False)[:260]}")
            print(f"  AZURE  POST https://{REGIAO}.tts.speech.microsoft.com/cognitiveservices/v1\n    {ssml(f)[:260]}")
            print(f"  KOKORO local {KOKORO[f['quem']]}\n")
        return
    if a.listar_modelos:
        d = json.loads(http(f"{GEMINI_API}/models?pageSize=200", None, {}, "GET"))
        for m in d.get("models", []):
            if "tts" in m["name"].lower():
                print(m["name"], "·", m.get("displayName", ""))
        return
    if a.listar_vozes:
        vozes = json.loads(http(f"https://{REGIAO}.tts.speech.microsoft.com/cognitiveservices/voices/list", None, {}, "GET"))
        nomes = {v["ShortName"] for v in vozes}
        for quem, v in AZURE_VOZ.items():
            print(f"{quem:6} {v:34} {'OK' if v in nomes else 'NÃO EXISTE nesta região'}")
        return
    if a.embaralhar:
        embaralhar()
        return
    if a.motores:
        gerar(a.motores, a.repeticoes, a.modelo_gemini)
        return
    ap.print_help()


if __name__ == "__main__":
    main()
