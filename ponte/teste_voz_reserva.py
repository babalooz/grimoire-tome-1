"""Teste da VOZ RESERVA da Sitcom do Café: as mesmas falas reais em 3 modelos Gemini TTS, para escuta cega.

Por que existe: a cota diária do gemini-3.8-flash-tts estourou em 29/10/2026 (168 de 100) e o longo parou. Cada modelo
tem cota própria; se a reserva soar igual (mesma voz por personagem), a fábrica troca de modelo quando a principal acabar.

Entrada: episodes/cafe-t1e01-hi-im-capy.json (as primeiras N falas, todos os personagens, PT e EN).
Saída: teste-voz-reserva/
  fala<n>-<A|B|C>.wav   ordem dos modelos sorteada por fala (escuta cega)
  gabarito.json         letra -> modelo (abrir só depois de escolher)
  relatorio.md          por modelo: duração, transcrição do "ouvido" (gemini-3.5-flash) e se bate com o roteiro
Gasto: N pedidos por modelo de TTS + 1 pedido de texto por áudio. Se um modelo der cota, anota e segue.

Uso: .venv/bin/python scripts/teste_voz_reserva.py [--falas 8]
"""
import argparse
import json
import random
import shutil
import sys
from pathlib import Path

import soundfile as sf

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "scripts"))
import tts  # noqa: E402
from tts_vocab import bate, ouvir  # noqa: E402

EP = ROOT / "episodes/cafe-t1e01-hi-im-capy.json"
OUT = ROOT / "teste-voz-reserva"
MODELOS = ["gemini-3.8-flash-tts", "gemini-3.8-flash-lite-tts", "gemini-2.5-flash-preview-tts"]


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--falas", type=int, default=8)
    a = ap.parse_args()
    falas = [b for b in json.loads(EP.read_text(encoding="utf-8"))["beats"] if b.get("text")][: a.falas]
    OUT.mkdir(exist_ok=True)
    rng = random.Random(29102026)
    gabarito, linhas = {}, []
    for n, b in enumerate(falas, 1):
        texto = b["text"].replace("…", "...")
        letras = dict(zip("ABC", rng.sample(MODELOS, len(MODELOS))))
        gabarito[f"fala{n}"] = letras
        linhas.append(f"\n## Fala {n} · {b['speaker']} ({b['lang']}): {texto}\n")
        for letra, modelo in letras.items():
            cache = ROOT / "public/audio/_teste_reserva" / modelo
            try:
                audio, sr = tts.synth_gemini(texto, b["lang"], b["speaker"], 1.0, model=modelo, cache_dir=cache)
            except tts.GeminiQuotaError as e:
                linhas.append(f"- {modelo}: SEM ÁUDIO (cota ou erro): {str(e)[:120]}\n")
                continue
            f = OUT / f"fala{n}-{letra}.wav"
            sf.write(f, audio, sr)
            try:
                ouvido = ouvir([f], b["lang"])[0]
                confere = "bate" if bate(texto, ouvido, b["lang"]) else "NÃO BATE"
            except (Exception, SystemExit) as e:
                ouvido, confere = f"(ouvido falhou: {type(e).__name__})", "?"
            linhas.append(f"- {modelo}: {len(audio) / sr:.2f} s · ouvido: \"{ouvido}\" · {confere}\n")
            print(f"fala {n} {modelo}: {len(audio) / sr:.2f} s, {confere}", flush=True)
    (OUT / "gabarito.json").write_text(json.dumps(gabarito, indent=1), encoding="utf-8")
    (OUT / "relatorio.md").write_text("# Teste da voz reserva (Sitcom do Café)\n\nMesma voz por personagem "
                                      f"({EP.name}); só o modelo muda.\n" + "".join(linhas), encoding="utf-8")
    shutil.rmtree(ROOT / "public/audio/_teste_reserva", ignore_errors=True)
    print(f"pronto: {OUT}")


if __name__ == "__main__":
    main()
