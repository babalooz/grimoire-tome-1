"""Gera o áudio de cada cena de um episódio com Kokoro (TTS local, grátis, licença Apache-2.0).

Voz da Capi: feminina — pf_dora (português) e af_heart (inglês).
Uso: .venv/bin/python scripts/tts.py episodes/<id>.json
Saída: public/audio/<id>/<n>.wav (+ <n>_reveal.wav) + public/audio/<id>/timings.json
"""
import json
import sys
from pathlib import Path

import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

ROOT = Path(__file__).resolve().parent.parent
VOICES = {"pt": ("pf_dora", "pt-br", 1.08), "en": ("af_heart", "en-us", 0.95)}  # voz, idioma, velocidade
GAP_SECONDS = 0.12  # pausa entre falas da mesma cena (manual de retenção: ≤ 0,12 s)

_kokoro = None


def synth(text: str, lang: str) -> tuple[np.ndarray, int]:
    global _kokoro
    _kokoro = _kokoro or Kokoro(str(ROOT / "voices/kokoro-v1.0.onnx"), str(ROOT / "voices/voices-v1.0.bin"))
    voice, code, speed = VOICES[lang]
    return _kokoro.create(text, voice=voice, speed=speed, lang=code)


def render_track(speech: list, out_dir: Path, name: str) -> dict:
    """Sintetiza uma lista de falas num único .wav e devolve os tempos de cada fala."""
    chunks, segments, cursor, sr = [], [], 0.0, 24000
    for seg in speech:
        audio, sr = synth(seg["text"], seg["lang"])
        dur = len(audio) / sr
        chunks += [audio, np.zeros(int(GAP_SECONDS * sr), dtype=audio.dtype)]
        segments.append({**seg, "start": cursor, "end": cursor + dur})
        cursor += dur + GAP_SECONDS
    sf.write(out_dir / f"{name}.wav", np.concatenate(chunks), sr)
    return {"audio": f"audio/{out_dir.name}/{name}.wav", "duration": cursor, "segments": segments}


def main(episode_path: str) -> None:
    episode = json.loads(Path(episode_path).read_text())
    out_dir = ROOT / "public/audio" / episode["id"]
    out_dir.mkdir(parents=True, exist_ok=True)
    timings = []

    for i, scene in enumerate(episode["scenes"]):
        timing = render_track(scene["speech"], out_dir, str(i))
        if scene.get("revealSpeech"):
            timing["reveal"] = render_track(scene["revealSpeech"], out_dir, f"{i}_reveal")
        timings.append(timing)

    (out_dir / "timings.json").write_text(json.dumps(timings, ensure_ascii=False, indent=2))
    print(f"ok: {len(timings)} cenas -> {out_dir}")


if __name__ == "__main__":
    main(sys.argv[1])
