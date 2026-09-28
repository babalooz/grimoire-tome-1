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
import time
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
# Teste cego pede 2 vozes candidatas de estilo diferente por personagem (pedido do Felipe, teste-voz.md).
# Rótulo A = escolha original do script; B = 2ª candidata de timbre contrastante (docs do Gemini TTS).
GEMINI_VOZ = {
    "capy": [("A", "Kore"), ("B", "Sulafat")],      # A firme · B calorosa (warm)
    "hank": [("A", "Charon"), ("B", "Algenib")],    # A informativo · B grave/áspera ("Hank grave")
    "lazy": [("A", "Algieba"), ("B", "Umbriel")],   # A suave · B tranquila — ambas com a instrução "fale devagar"
    "poppy": [("A", "Leda"), ("B", "Zephyr")],      # A jovem · B brilhante/enérgica
}

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
_ULTIMA_CHAMADA_GEMINI = 0.0


def http(url: str, body: bytes | None, headers: dict, metodo: str = "POST") -> bytes:
    global _ULTIMA_CHAMADA_GEMINI
    if "generativelanguage.googleapis.com" in url:
        # free tier: 3 req/min por modelo — espaça em 22s (margem sobre os 20s teóricos)
        falta = _ULTIMA_CHAMADA_GEMINI + 22 - time.monotonic()
        if falta > 0:
            time.sleep(falta)
        _ULTIMA_CHAMADA_GEMINI = time.monotonic()
    req = urllib.request.Request(url, data=body, method=metodo, headers=headers)
    for tentativa in range(6):
        try:
            with urllib.request.urlopen(req, timeout=120) as r:
                return r.read()
        except urllib.error.HTTPError as e:  # sem headers no erro: a chave nunca aparece
            corpo = e.read()
            if e.code == 429 and tentativa < 5:  # free tier: poucas req/min por modelo — respeita o retryDelay
                espera = 15.0
                m = re.search(rb'"retryDelay":\s*"(\d+(?:\.\d+)?)s"', corpo)
                if m:
                    espera = float(m.group(1)) + 2
                print(f"  429 (limite de taxa), esperando {espera:.0f}s…")
                time.sleep(espera)
                continue
            raise SystemExit(f"HTTP {e.code} em {url.split('?')[0]}: {corpo[:300].decode(errors='replace')}")
    raise SystemExit(f"HTTP 429 repetido em {url.split('?')[0]}: limite de taxa não liberou a tempo")


def gemini_req(f: dict, modelo: str, voz: str) -> tuple[str, dict]:
    url = f"{GEMINI_API}/models/{modelo}:generateContent"
    body = {"contents": [{"parts": [{"text": ESTILO[f["quem"]] + f["texto"]}]}],
            "generationConfig": {"responseModalities": ["AUDIO"],
                                 "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": voz}}}}}
    return url, body


def gemini(f: dict, modelo: str, voz: str):
    import io
    import numpy as np
    import soundfile as sf
    url, body = gemini_req(f, modelo, voz)
    d = json.loads(http(url, json.dumps(body).encode(), {"Content-Type": "application/json"}))
    parte = d["candidates"][0]["content"]["parts"][0]["inlineData"]
    bruto = base64.b64decode(parte["data"])
    mime = parte.get("mimeType", "")
    if "wav" in mime:  # gemini-3.8-flash-tts devolve um WAV completo, não mais PCM cru
        pcm, taxa = sf.read(io.BytesIO(bruto), dtype="float32")
    else:  # modelos antigos (preview): PCM cru com a taxa no mimeType, ex. audio/L16;rate=24000
        taxa = int(re.search(r"rate=(\d+)", mime or "rate=24000").group(1))
        pcm = np.frombuffer(bruto, dtype="<i2").astype("float32") / 32768
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
def _motores_reais(motores: list[str]) -> list[tuple[str, str | None]]:
    """Expande 'gemini' nas 2 vozes candidatas (A/B); 'kokoro' e 'azure' seguem como estão hoje."""
    reais = []
    for motor in motores:
        if motor == "gemini":
            reais += [("gemini-A", "A"), ("gemini-B", "B")]
        else:
            reais.append((motor, None))
    return reais


def gerar(motores: list[str], repeticoes: int, modelo: str, modelo_b: str | None = None) -> None:
    import soundfile as sf
    OUT.mkdir(exist_ok=True)
    linhas = []
    for motor, rotulo in _motores_reais(motores):
        pasta = OUT / "brutos" / motor
        pasta.mkdir(parents=True, exist_ok=True)
        modelo_motor = modelo_b if (rotulo == "B" and modelo_b) else modelo
        for f in FALAS:
            n_rep = repeticoes if f["n"] == 2 else 1  # métrica D: consistência na fala 2, gerada várias vezes
            voz = dict(GEMINI_VOZ[f["quem"]]).get(rotulo) if rotulo else None
            for k in range(1, n_rep + 1):
                arq = pasta / f"f{f['n']}_r{k}.wav"
                if arq.exists():  # retomada após 429/queda: não regera o que já está pronto
                    audio, taxa = sf.read(arq, dtype="float32")
                    print(f"-- {motor} fala {f['n']} r{k}: já existe, pulando")
                else:
                    if motor.startswith("gemini"):
                        audio, taxa = gemini(f, modelo_motor, voz)
                    elif motor == "azure":
                        audio, taxa = azure(f)
                    else:
                        audio, taxa = kokoro(f)
                    sf.write(arq, audio, taxa)
                m = medir(audio, taxa, f)
                linhas.append({"motor": motor, "voz": voz or "",
                               "modelo": modelo_motor if motor.startswith("gemini") else "",
                               "fala": f["n"], "rep": k,
                               "arquivo": str(arq.relative_to(OUT)), **m,
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
    ap.add_argument("--motores", nargs="+", choices=["gemini", "azure", "kokoro"],
                     default=["gemini", "kokoro"],
                     help="azure fica de fora por padrão (sem assinatura no ambiente atual)")
    ap.add_argument("--modelo-gemini", default=GEMINI_MODELOS[0])
    ap.add_argument("--modelo-gemini-b", default=None,
                     help="modelo p/ a voz candidata B, se precisar fugir da cota diária do modelo principal")
    ap.add_argument("--repeticoes", type=int, default=5, help="vezes que a fala 2 é gerada (consistência)")
    ap.add_argument("--embaralhar", action="store_true")
    a = ap.parse_args()

    if a.dry_run:
        chars_por_voz = sum(len(f["texto"]) for f in FALAS) + 4 * len(FALAS[1]["texto"])
        print(f"modelo Gemini: {a.modelo_gemini} · ~{chars_por_voz} caracteres por voz candidata "
              f"× 2 vozes × {a.repeticoes - 1} reps extras na fala 2 (centavos)\n")
        for f in FALAS:
            print(f"[fala {f['n']} · {f['quem']}] {f['texto']}")
            for rotulo, voz in GEMINI_VOZ[f["quem"]]:
                url, body = gemini_req(f, a.modelo_gemini, voz)
                print(f"  GEMINI [{rotulo}={voz}] POST {url}\n    {json.dumps(body, ensure_ascii=False)[:260]}")
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
        gerar(a.motores, a.repeticoes, a.modelo_gemini, a.modelo_gemini_b)
        return
    ap.print_help()


if __name__ == "__main__":
    main()
