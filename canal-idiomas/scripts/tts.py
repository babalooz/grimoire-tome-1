"""Gera o áudio de um episódio com Kokoro (TTS local, grátis, licença Apache-2.0).

Vozes por personagem (campo `speaker`; sem speaker = Capi, compatível com os episódios antigos):
  capi      pt pf_dora  · en af_heart   (feminina)
  hank      pt pm_santa · en am_onyx    (bisão: a voz masculina mais grave do Kokoro, ~93 Hz medidos)
  leo       pt pm_alex  · en am_puck    (preguiça: mais lento, sussurrado = ganho menor)
  narrador  pt pm_alex  · en am_michael
Monólogo interno (`mode: "pensamento"`) acelera a voz (regra 2 do mundo).

Uso: .venv/bin/python scripts/tts.py episodes/<id>.json
Saída (formato quiz, `scenes`): public/audio/<id>/<n>.wav (+ <n>_reveal.wav) + timings.json
Saída (formato sitcom, `beats`): public/audio/<id>/b<n>.wav (1 por fala) + timings.json
"""
import json
import sys
from pathlib import Path

import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

ROOT = Path(__file__).resolve().parent.parent
LANG_CODE = {"pt": "pt-br", "en": "en-us"}
# (speaker, lang) -> (voz, velocidade, ganho)
VOICES = {
    ("capi", "pt"): ("pf_dora", 1.08, 1.0),
    ("capi", "en"): ("af_heart", 0.95, 1.0),
    ("hank", "pt"): ("pm_santa", 0.95, 1.0),
    ("hank", "en"): ("am_onyx", 1.0, 1.0),
    ("leo", "pt"): ("pm_alex", 0.86, 0.8),
    ("leo", "en"): ("am_puck", 0.8, 0.8),
    ("narrador", "pt"): ("pm_alex", 1.05, 1.0),
    ("narrador", "en"): ("am_michael", 1.0, 1.0),
}
THOUGHT_SPEED = 1.12  # pensamento acelera
GAP_SECONDS = 0.12  # pausa entre falas da mesma cena (manual de retenção: ≤ 0,12 s)
SR = 24000

_kokoro = None


def synth(text: str, lang: str, speaker: str = "capi", mode: str = "fala") -> tuple[np.ndarray, int]:
    global _kokoro
    _kokoro = _kokoro or Kokoro(str(ROOT / "voices/kokoro-v1.0.onnx"), str(ROOT / "voices/voices-v1.0.bin"))
    voice, speed, gain = VOICES.get((speaker, lang), VOICES[("capi", lang)])
    if mode == "pensamento":
        speed *= THOUGHT_SPEED
    audio, sr = _kokoro.create(text, voice=voice, speed=speed, lang=LANG_CODE[lang])
    return (audio * gain).astype(audio.dtype), sr


def render_track(speech: list, out_dir: Path, name: str) -> dict:
    """Sintetiza uma lista de falas num único .wav e devolve os tempos de cada fala (formato quiz)."""
    chunks, segments, cursor, sr = [], [], 0.0, SR
    for seg in speech:
        audio, sr = synth(seg["text"], seg["lang"], seg.get("speaker", "capi"), "pensamento" if seg.get("inner") else "fala")
        dur = len(audio) / sr
        chunks += [audio, np.zeros(int(GAP_SECONDS * sr), dtype=audio.dtype)]
        segments.append({**seg, "start": cursor, "end": cursor + dur})
        cursor += dur + GAP_SECONDS
    sf.write(out_dir / f"{name}.wav", np.concatenate(chunks), sr)
    return {"audio": f"audio/{out_dir.name}/{name}.wav", "duration": cursor, "segments": segments}


def render_beats(beats: list, out_dir: Path) -> list:
    """Formato sitcom: 1 .wav por beat; o motor (src/Sitcom.tsx) cuida das pausas."""
    timings = []
    for i, b in enumerate(beats):
        audio, sr = synth(b["text"], b["lang"], b.get("speaker", "capi"), b.get("mode", "fala"))
        audio = np.trim_zeros(audio, "b") if len(audio) else audio
        sf.write(out_dir / f"b{i}.wav", audio, sr)
        timings.append({"audio": f"audio/{out_dir.name}/b{i}.wav", "duration": len(audio) / sr})
    return timings


def main(episode_path: str) -> None:
    episode = json.loads(Path(episode_path).read_text())
    out_dir = ROOT / "public/audio" / episode["id"]
    out_dir.mkdir(parents=True, exist_ok=True)

    if "beats" in episode:
        timings = render_beats(episode["beats"], out_dir)
    else:
        timings = []
        for i, scene in enumerate(episode["scenes"]):
            timing = render_track(scene["speech"], out_dir, str(i))
            if scene.get("revealSpeech"):
                timing["reveal"] = render_track(scene["revealSpeech"], out_dir, f"{i}_reveal")
            timings.append(timing)

    (out_dir / "timings.json").write_text(json.dumps(timings, ensure_ascii=False, indent=2))
    total = sum(t["duration"] for t in timings)
    print(f"ok: {len(timings)} trechos, {total:.1f}s de fala -> {out_dir}")


if __name__ == "__main__":
    main(sys.argv[1])
