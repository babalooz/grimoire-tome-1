"""Gera o áudio de cada cena de um episódio com Piper (TTS local, grátis).

Uso: .venv/bin/python scripts/tts.py episodes/001-looking-forward.json
Saída: public/audio/<id>/<n>.wav + public/audio/<id>/timings.json
"""
import json
import subprocess
import sys
import wave
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
VOICES = {
    "pt": ROOT / "voices/pt_BR-faber-medium.onnx",
    "en": ROOT / "voices/en_US-lessac-medium.onnx",
}
PIPER = ROOT / ".venv/bin/piper"
GAP_SECONDS = 0.25  # pausa entre falas da mesma cena


def synth(text: str, lang: str, out: Path) -> None:
    subprocess.run(
        [str(PIPER), "-m", str(VOICES[lang]), "-f", str(out)],
        input=text.encode(), check=True, capture_output=True,
    )


def render_track(speech: list, out_dir: Path, name: str) -> dict:
    """Sintetiza uma lista de falas num único .wav e devolve os tempos de cada fala."""
    frames, params, segments, cursor = [], None, [], 0.0
    for j, seg in enumerate(speech):
        part = out_dir / f"{name}_{j}.wav"
        synth(seg["text"], seg["lang"], part)
        with wave.open(str(part)) as w:
            params = params or w.getparams()
            data = w.readframes(w.getnframes())
            dur = w.getnframes() / w.getframerate()
        part.unlink()
        silence = b"\x00" * int(GAP_SECONDS * params.framerate) * params.sampwidth
        frames += [data, silence]
        segments.append({**seg, "start": cursor, "end": cursor + dur})
        cursor += dur + GAP_SECONDS

    with wave.open(str(out_dir / f"{name}.wav"), "wb") as w:
        w.setparams(params)
        w.writeframes(b"".join(frames))
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
