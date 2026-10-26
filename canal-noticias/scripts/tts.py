"""Narração de cada cena do episódio com Kokoro (local, grátis, Apache-2.0).

Voz por editoria: o episódio pode trazer "kit_editorias" {editoria: {voz, velocidade}} e cada cena um
"editoria". Sem kit, usa o locutor padrão (pm_alex). Vozes PT do Kokoro: pf_dora, pm_alex, pm_santa.
Uso: .venv/bin/python scripts/tts.py episodios/<id>.json
Saída: public/audio/<id>/<n>.wav + public/audio/<id>/timings.json
"""
import json
import sys
from pathlib import Path

import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

ROOT = Path(__file__).resolve().parent.parent
VOZ, IDIOMA, VELOCIDADE = "pm_alex", "pt-br", 0.93  # padrão (ritmo de locutor; fecha 60s+)


def main(ep_path: str) -> None:
    ep = json.loads(Path(ep_path).read_text())
    k = Kokoro(str(ROOT / "voices/kokoro-v1.0.onnx"), str(ROOT / "voices/voices-v1.0.bin"))
    out = ROOT / "public/audio" / ep["id"]
    out.mkdir(parents=True, exist_ok=True)
    timings = []
    for i, cena in enumerate(ep["cenas"]):
        kit = ep.get("kit_editorias", {}).get(cena.get("editoria", ""), {})
        audio, sr = k.create(cena["narracao"], voice=kit.get("voz", VOZ), speed=kit.get("velocidade", VELOCIDADE), lang=IDIOMA)
        sf.write(out / f"{i}.wav", audio, sr)
        timings.append({"audio": f"audio/{ep['id']}/{i}.wav", "duration": len(audio) / sr})
    (out / "timings.json").write_text(json.dumps(timings, indent=2))
    print(f"ok: {len(timings)} cenas, {sum(t['duration'] for t in timings):.1f}s de fala -> {out}")


if __name__ == "__main__":
    main(sys.argv[1])
