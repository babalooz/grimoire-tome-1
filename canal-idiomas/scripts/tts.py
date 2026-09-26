"""Gera o áudio de um episódio com Kokoro (TTS local, grátis, licença Apache-2.0).

Vozes por personagem (campo `speaker`; sem speaker = Capy, compatível com os episódios antigos):
  capi      pt pf_dora  · en af_heart   (feminina)
  hank      pt pm_santa · en am_onyx    (panda-gigante: a voz masculina mais grave do Kokoro, ~93 Hz medidos)
  lazy      pt pm_alex  · en am_puck    (preguiça: mais lento, sussurrado = ganho menor; "leo" = apelido antigo)
  duda      pt pf_dora  · en af_bella   (panda-vermelho: falsos cognatos, rápida)
  poppy     pt pf_dora  · en af_nicole  (axolote influencer: gírias)
  bolinha   pt pm_alex  · en am_echo    (hamster: agudo e rápido, guarda frases nas bochechas)
  donajaca  pt pf_dora  · en af_sarah   (mãe da Capy, videochamada: calma)
  narrador  pt pm_alex  · en am_michael
Monólogo interno (`mode: "pensamento"`) acelera a voz (regra 2 do mundo).

Uso: .venv/bin/python scripts/tts.py episodes/<id>.json
Saída (formato quiz, `scenes`): public/audio/<id>/<n>.wav (+ <n>_reveal.wav) + timings.json
Saída (formato sitcom, `beats`): public/audio/<id>/b<n>.wav (1 por fala) + timings.json
Saída (formato lição, `format: "licao"`): public/audio/<id>/l<hash>.wav (1 por fala única) + timings.json
  = {chave: {audio, duration}}, chave = line_key() (mesma conta de src/lesson/timeline.ts: lineKey).
  Velocidades mais calmas (feedback do piloto: "muito rápido"): Capy PT 1.0 · EN 0.9; `speed` na fala sobrescreve.
"""
import hashlib
import json
import re
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
    ("lazy", "pt"): ("pm_alex", 0.86, 0.8),
    ("lazy", "en"): ("am_puck", 0.8, 0.8),
    ("duda", "pt"): ("pf_dora", 1.12, 1.0),
    ("duda", "en"): ("af_bella", 1.05, 1.0),
    ("poppy", "pt"): ("pf_dora", 1.15, 1.0),
    ("poppy", "en"): ("af_nicole", 1.05, 1.0),
    ("bolinha", "pt"): ("pm_alex", 1.2, 1.0),
    ("bolinha", "en"): ("am_echo", 1.1, 1.0),
    ("donajaca", "pt"): ("pf_dora", 0.95, 1.0),
    ("donajaca", "en"): ("af_sarah", 0.92, 1.0),
    ("narrador", "pt"): ("pm_alex", 1.05, 1.0),
    ("narrador", "en"): ("am_michael", 1.0, 1.0),
}
# Formato lição: fala natural, sem pressa (sobrescreve só a velocidade de VOICES).
LICAO_SPEED = {
    ("capi", "pt"): 1.0,
    ("capi", "en"): 0.9,
    ("hank", "pt"): 0.92,
    ("hank", "en"): 0.92,
    ("lazy", "pt"): 0.86,
    ("lazy", "en"): 0.8,
}
ALIAS = {"leo": "lazy"}  # episódios antigos
# Pronúncia SÓ no áudio (legenda/timings continuam com o texto original). Testado pelos fonemas do Kokoro (espeak):
#   pt-br "Capy" -> kˈapi ("CÁ-pi", certo; já "Capi" sai kapˈi = "ca-PÍ", errado) -> nada a corrigir em PT.
#   en-us "Capy" -> kˈeɪpi ("KÊI-pi", errado)  ·  "Cappy" -> kˈæpi ("KÁ-pi", como em capybara) -> corrige em EN.
#   en-us conferidos sem ajuste: coffee kˈɔfi · cookie kˈʊki · copy kˈɑːpi · "Can I get" kæn aɪ ɡɛt.
PRONUNCIA = {
    "pt": {},
    "en": {"Capy": "Cappy", "CapyFala": "Cappy Fala"},
}
ELLIPSIS = re.compile(r"(?<=\.\.\.)\s*")  # corta DEPOIS das reticências: o pedaço mantém a entonação suspensa
ELLIPSIS_PAUSE = 0.4  # "..." vira pausa real (o Kokoro faz só ~0,08 s)
SILENCE_THR = 0.01  # abaixo disso é "silêncio" nas bordas de cada pedaço


def speech_text(text: str, lang: str) -> str:
    for word, say in PRONUNCIA.get(lang, {}).items():
        text = re.sub(rf"\b{re.escape(word)}\b", say, text)
    return text


def _trim(audio: np.ndarray, head: bool = True, tail: bool = True) -> np.ndarray:
    idx = np.flatnonzero(np.abs(audio) > SILENCE_THR)
    if not len(idx):
        return audio[:0]
    pad = int(0.03 * SR)  # 30 ms de folga para não cortar consoante
    return audio[max(0, idx[0] - pad) if head else 0: idx[-1] + pad if tail else len(audio)]


THOUGHT_SPEED = 1.12  # pensamento acelera
GAP_SECONDS = 0.12  # pausa entre falas da mesma cena (manual de retenção: ≤ 0,12 s)
SR = 24000

_kokoro = None


def synth(text: str, lang: str, speaker: str = "capi", mode: str = "fala", speed_override: float | None = None) -> tuple[np.ndarray, int]:
    global _kokoro
    _kokoro = _kokoro or Kokoro(str(ROOT / "voices/kokoro-v1.0.onnx"), str(ROOT / "voices/voices-v1.0.bin"))
    speaker = ALIAS.get(speaker, speaker)
    voice, speed, gain = VOICES.get((speaker, lang), VOICES[("capi", lang)])
    if speed_override is not None:
        speed = speed_override
    elif mode == "pensamento":
        speed *= THOUGHT_SPEED
    parts = [t for t in ELLIPSIS.split(speech_text(text, lang).replace("…", "...")) if re.search(r"\w", t)]
    if len(parts) <= 1:
        audio, sr = _kokoro.create(speech_text(text, lang), voice=voice, speed=speed, lang=LANG_CODE[lang])
    else:  # reticências: sintetiza cada pedaço e junta com silêncio real
        chunks = []
        for i, part in enumerate(parts):
            a, sr = _kokoro.create(part, voice=voice, speed=speed, lang=LANG_CODE[lang])
            a = _trim(a, head=i > 0, tail=i < len(parts) - 1)  # corta só as bordas coladas na pausa
            chunks += [a, np.zeros(int(ELLIPSIS_PAUSE * sr), dtype=a.dtype)]
        audio = np.concatenate(chunks[:-1])
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


def _num(v) -> str:
    """Número como o JavaScript imprime (1.0 -> "1", 0.7 -> "0.7")."""
    return str(int(v)) if float(v).is_integer() else repr(float(v))


def line_key(line: dict) -> str:
    speed = "" if line.get("speed") is None else _num(line["speed"])
    return "|".join([line.get("speaker", "capi"), line["lang"], line.get("mode", "fala"), speed, line["text"]])


def iter_lines(node):
    """Toda fala do episódio-lição: qualquer objeto com `text` + `lang` (cena, exercícios, volta)."""
    if isinstance(node, dict):
        if "text" in node and "lang" in node:
            yield node
        for v in node.values():
            yield from iter_lines(v)
    elif isinstance(node, list):
        for v in node:
            yield from iter_lines(v)


def render_licao(episode: dict, out_dir: Path) -> dict:
    """Formato lição: 1 .wav por fala única (falas repetidas reaproveitam o mesmo áudio)."""
    timings = {}
    for line in iter_lines({k: episode[k] for k in ("cena", "licao", "volta") if k in episode}):
        key = line_key(line)
        if key in timings:
            continue
        speaker, lang, mode = line.get("speaker", "capi"), line["lang"], line.get("mode", "fala")
        speed = line.get("speed")
        if speed is None:
            speed = LICAO_SPEED.get((ALIAS.get(speaker, speaker), lang))
            if speed is not None and mode == "pensamento":
                speed *= 1.05  # monólogo interno um pouco mais rápido, sem correria
        audio, sr = synth(line["text"], lang, speaker, mode, speed)
        audio = np.trim_zeros(audio, "b") if len(audio) else audio
        name = "l" + hashlib.md5(key.encode()).hexdigest()[:10]
        sf.write(out_dir / f"{name}.wav", audio, sr)
        timings[key] = {"audio": f"audio/{out_dir.name}/{name}.wav", "duration": len(audio) / sr}
    return timings


def main(episode_path: str) -> None:
    episode = json.loads(Path(episode_path).read_text())
    out_dir = ROOT / "public/audio" / episode["id"]
    out_dir.mkdir(parents=True, exist_ok=True)

    if episode.get("format") == "licao":
        timings = render_licao(episode, out_dir)
        (out_dir / "timings.json").write_text(json.dumps(timings, ensure_ascii=False, indent=2))
        total = sum(t["duration"] for t in timings.values())
        # loudness da voz (referência da trilha de fundo em src/lesson/music.ts)
        import pyloudnorm as pyln
        voice = np.concatenate([sf.read(ROOT / "public" / t["audio"])[0] for t in timings.values()])
        voice_lufs = round(float(pyln.Meter(SR).integrated_loudness(voice)), 2)
        (out_dir / "mix.json").write_text(json.dumps({"voiceLufs": voice_lufs}))
        print(f"ok: {len(timings)} falas únicas, {total:.1f}s de fala, voz {voice_lufs} LUFS -> {out_dir}")
        return
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
