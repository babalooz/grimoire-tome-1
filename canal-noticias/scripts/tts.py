"""Narração de cada cena do episódio — voz Thalita (Microsoft, neural, pt-BR), escolhida pelo Felipe em 26/10.

Motores (escolha automática):
  - azure : oficial, licença comercial, nível grátis de 500 mil caracteres/mês. Usado quando o ambiente tem
            AZURE_SPEECH_KEY e AZURE_SPEECH_REGION. É o motor para PUBLICAR.
  - edge  : mesma voz pela leitura do navegador Edge, sem chave. Só para PRÉVIA (não é licenciado para uso comercial).
  - kokoro: local e grátis, mas soa artificial (reprovado). Só com TTS_MOTOR=kokoro.

Uso: .venv/bin/python scripts/tts.py episodios/<id>.json
Saída: public/audio/<id>/<n>.(wav|mp3) + public/audio/<id>/timings.json
       (no motor edge, cada cena traz "palavras" com o tempo de cada palavra -> legenda sincronizada)
"""
import asyncio
import json
import os
import ssl
import sys
import urllib.request
from pathlib import Path
from xml.sax.saxutils import escape

import soundfile as sf

ROOT = Path(__file__).resolve().parent.parent
VOZ = "pt-BR-ThalitaMultilingualNeural"
VELOCIDADE = "+8%"   # um pouco acima do normal: ritmo de vídeo curto sem atropelar
CA_PROXY = "/root/.ccr/ca-bundle.crt"  # proxy do ambiente de nuvem (se existir)


def motor() -> str:
    if os.environ.get("TTS_MOTOR"):
        return os.environ["TTS_MOTOR"]
    return "azure" if os.environ.get("AZURE_SPEECH_KEY") and os.environ.get("AZURE_SPEECH_REGION") else "edge"


def azure(texto: str, saida: Path) -> dict:
    regiao, chave = os.environ["AZURE_SPEECH_REGION"], os.environ["AZURE_SPEECH_KEY"]
    ssml = (f'<speak version="1.0" xml:lang="pt-BR"><voice name="{VOZ}">'
            f'<prosody rate="{VELOCIDADE}">{escape(texto)}</prosody></voice></speak>')
    req = urllib.request.Request(
        f"https://{regiao}.tts.speech.microsoft.com/cognitiveservices/v1", ssml.encode(),
        {"Ocp-Apim-Subscription-Key": chave, "Content-Type": "application/ssml+xml",
         "X-Microsoft-OutputFormat": "riff-24khz-16bit-mono-pcm", "User-Agent": "sabia-nao"})
    with urllib.request.urlopen(req, timeout=60) as r:
        saida.write_bytes(r.read())
    return {}


async def _edge(texto: str, saida: Path) -> dict:
    import edge_tts
    import edge_tts.communicate as com
    if Path(CA_PROXY).exists():
        com._SSL_CTX = ssl.create_default_context(cafile=CA_PROXY)
    palavras, audio = [], bytearray()
    async for parte in edge_tts.Communicate(texto, VOZ, rate=VELOCIDADE, boundary="WordBoundary").stream():
        if parte["type"] == "audio":
            audio += parte["data"]
        elif parte["type"] == "WordBoundary":  # offset/duração em unidades de 100 ns
            palavras.append({"w": parte["text"], "t": parte["offset"] / 1e7,
                             "fim": (parte["offset"] + parte["duration"]) / 1e7})
    saida.write_bytes(bytes(audio))
    return {"palavras": palavras}


def kokoro(texto: str, saida: Path) -> dict:
    from kokoro_onnx import Kokoro
    k = Kokoro(str(ROOT / "voices/kokoro-v1.0.onnx"), str(ROOT / "voices/voices-v1.0.bin"))
    audio, sr = k.create(texto, voice="pm_alex", speed=0.93, lang="pt-br")
    sf.write(saida, audio, sr)
    return {}


def main(ep_path: str) -> None:
    ep = json.loads(Path(ep_path).read_text())
    m = motor()
    ext = "mp3" if m == "edge" else "wav"
    out = ROOT / "public/audio" / ep["id"]
    out.mkdir(parents=True, exist_ok=True)
    timings = []
    for i, cena in enumerate(ep["cenas"]):
        arq = out / f"{i}.{ext}"
        extra = (asyncio.run(_edge(cena["narracao"], arq)) if m == "edge"
                 else azure(cena["narracao"], arq) if m == "azure" else kokoro(cena["narracao"], arq))
        timings.append({"audio": f"audio/{ep['id']}/{i}.{ext}", "duration": sf.info(str(arq)).duration, **extra})
    (out / "timings.json").write_text(json.dumps(timings, ensure_ascii=False, indent=2))
    aviso = "  (PRÉVIA: para publicar, configure AZURE_SPEECH_KEY/AZURE_SPEECH_REGION)" if m == "edge" else ""
    print(f"ok [{m}]: {len(timings)} cenas, {sum(t['duration'] for t in timings):.1f}s de fala{aviso}")


if __name__ == "__main__":
    main(sys.argv[1])
