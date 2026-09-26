"""Trilha de fundo 100% gerada por código (sem samples de terceiros) -> public/music/cafe-loop.wav.

Estilo: café lo-fi alegre e calmo. Ukulele (Karplus-Strong), marimba (síntese aditiva), baixo redondo,
bumbo macio + shaker. 96 BPM, 8 compassos 4/4 = exatamente 20,0 s = 600 frames a 30 fps = 960.000 amostras a 48 kHz,
então o loop fecha em fronteira de frame no Remotion. Emenda sem clique: tudo é renderizado num buffer maior e a
"cauda" que passa do fim é somada de volta no começo (loop circular), como se a música já estivesse tocando antes.

Licença: gerado pelo próprio projeto -> CC0 1.0 (domínio público). Sem risco de Content ID (não há gravação de
terceiros). Determinístico (semente fixa): rodar de novo gera o mesmo arquivo.

Uso: .venv/bin/python scripts/music.py   (grava public/music/cafe-loop.wav, ~-16 LUFS, pico < -1 dBFS)
"""
from pathlib import Path

import numpy as np
import pyloudnorm as pyln
import soundfile as sf
from scipy.signal import butter, sosfilt

ROOT = Path(__file__).resolve().parent.parent
SR = 48000
BPM = 96
BEAT = 60 / BPM  # 0,625 s
BARS = 8
LOOP = int(round(BARS * 4 * BEAT * SR))  # 960000
TAIL = 4 * SR
TARGET_LUFS = -16.0
rng = np.random.default_rng(7)

A4 = 440.0


def hz(midi: float) -> float:
    return A4 * 2 ** ((midi - 69) / 12)


# I - vi - ii - V com sétimas (C maior, alegre sem ser infantil). Notas MIDI.
CHORDS = [
    ("Cmaj7", 48, [60, 64, 67, 71]),
    ("Am7", 45, [60, 64, 67, 69]),
    ("Dm7", 50, [60, 62, 65, 69]),
    ("G7", 43, [59, 62, 65, 67]),
] * 2

# Melodia da marimba (compasso, tempo em batidas, nota MIDI). Pergunta nos compassos 1-4, resposta nos 5-8;
# frases curtas com espaço (não compete com a voz). Registro médio-agudo (C5-A5).
MELODY = [
    (0, 0.0, 76), (0, 1.5, 79), (0, 2.5, 83), (1, 0.0, 81), (1, 1.5, 79), (1, 2.5, 76),
    (2, 0.0, 77), (2, 1.0, 81), (2, 2.5, 79), (3, 1.0, 74), (3, 2.0, 77), (3, 3.0, 79),
    (4, 0.0, 76), (4, 1.5, 79), (4, 2.5, 84), (5, 0.0, 83), (5, 1.5, 81), (5, 2.5, 79),
    (6, 0.0, 77), (6, 1.5, 76), (6, 2.5, 74), (7, 0.0, 79), (7, 2.0, 74), (7, 3.0, 72),
]

SWING = 0.07  # atraso das colcheias "e" (feel lo-fi)


def t_of(bar: int, beat: float) -> float:
    frac = beat % 1
    swing = SWING * BEAT if abs(frac - 0.5) < 1e-6 else 0.0
    return (bar * 4 + beat) * BEAT + swing


def pluck(freq: float, dur: float, bright: float = 0.5) -> np.ndarray:
    """Karplus-Strong: corda de nylon (ukulele). Processa em blocos de 1 período (vetorizado)."""
    n = int(dur * SR)
    period = max(2, int(round(SR / freq)))
    buf = rng.uniform(-1, 1, period)
    # excitação mais macia (dedo, não palheta): passa-baixa simples no ruído inicial
    for _ in range(int(3 - 2 * bright)):
        buf = 0.5 * (buf + np.roll(buf, 1))
    out = np.empty(n + period)
    out[:period] = buf
    decay = 0.996
    for i in range(period, n + period, period):
        prev = out[i - period:i]
        blk = decay * 0.5 * (prev + np.concatenate(([out[i - period - 1] if i - period - 1 >= 0 else 0.0], prev[:-1])))
        m = min(period, n + period - i)
        out[i:i + m] = blk[:m]
    y = out[:n]
    y *= np.minimum(1, np.arange(n) / (0.002 * SR))
    return y * np.exp(-np.arange(n) / (SR * 0.9))


def marimba(freq: float, dur: float = 1.4) -> np.ndarray:
    n = int(dur * SR)
    t = np.arange(n) / SR
    y = (np.sin(2 * np.pi * freq * t) * np.exp(-t / 0.55)
         + 0.35 * np.sin(2 * np.pi * freq * 3.99 * t) * np.exp(-t / 0.09)
         + 0.08 * np.sin(2 * np.pi * freq * 9.2 * t) * np.exp(-t / 0.03))
    return y * np.minimum(1, t / 0.003)


def bass(freq: float, dur: float) -> np.ndarray:
    n = int(dur * SR)
    t = np.arange(n) / SR
    y = np.sin(2 * np.pi * freq * t) + 0.25 * np.sin(2 * np.pi * 2 * freq * t)
    env = np.minimum(1, t / 0.01) * np.exp(-t / 0.8) * np.minimum(1, (dur - t) / 0.05).clip(0)
    return np.tanh(1.4 * y * env) / np.tanh(1.4)


def kick() -> np.ndarray:
    n = int(0.35 * SR)
    t = np.arange(n) / SR
    f = 48 + 70 * np.exp(-t / 0.03)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.12)


def shaker(dur: float = 0.09) -> np.ndarray:
    n = int(dur * SR)
    t = np.arange(n) / SR
    noise = sosfilt(butter(2, [5000, 9000], "bandpass", fs=SR, output="sos"), rng.standard_normal(n))
    return noise * np.minimum(1, t / 0.01) * np.exp(-t / 0.025)


def add(track: np.ndarray, sig: np.ndarray, at: float, gain: float, pan: float = 0.0) -> None:
    """Soma `sig` em `track` (estéreo) no tempo `at` (s). pan -1 esquerda, +1 direita (lei de potência constante)."""
    i = int(round(at * SR))
    j = min(len(track), i + len(sig))
    a = (pan + 1) * np.pi / 4
    track[i:j, 0] += sig[: j - i] * gain * np.cos(a)
    track[i:j, 1] += sig[: j - i] * gain * np.sin(a)


def render() -> np.ndarray:
    mix = np.zeros((LOOP + TAIL, 2))
    for bar, (_, root, notes) in enumerate(CHORDS):
        # ukulele: batida calma (1, 2e, 3, 4e), acordes arpejados 12 ms por corda, alternando pra baixo/pra cima
        for k, (beat, vel) in enumerate([(0, 1.0), (1.5, 0.55), (2, 0.8), (3.5, 0.5)]):
            order = notes if k % 2 == 0 else notes[::-1]
            t0 = t_of(bar, beat) + rng.uniform(-0.006, 0.006)
            for s, note in enumerate(order):
                add(mix, pluck(hz(note), 1.6, 0.4 + 0.3 * vel), t0 + s * 0.012, 0.22 * vel * rng.uniform(0.9, 1.05), pan=-0.35)
        # baixo: tônica no 1, quinta no 3
        add(mix, bass(hz(root), BEAT * 1.9), t_of(bar, 0), 0.36)
        add(mix, bass(hz(root + 7), BEAT * 1.9), t_of(bar, 2), 0.27)
        # bateria lo-fi bem macia
        add(mix, kick(), t_of(bar, 0), 0.4)
        add(mix, kick(), t_of(bar, 2.5), 0.25)
        for e in range(8):
            add(mix, shaker(), t_of(bar, e / 2), (0.10 if e % 2 else 0.06) * rng.uniform(0.8, 1.1), pan=0.3)
    for bar, beat, note in MELODY:
        add(mix, marimba(hz(note)), t_of(bar, beat), 0.30 * rng.uniform(0.9, 1.05), pan=0.3)

    # loop circular: a cauda depois do fim entra no começo
    loop = mix[:LOOP].copy()
    loop[:TAIL] += mix[LOOP:]
    return loop


def tone(loop: np.ndarray) -> np.ndarray:
    """Tom quente de lo-fi + espaço para a voz: corta grave sujo e agudo, e cava ~3 dB em 1,2–4 kHz.
    Filtros IIR têm memória: filtra 2 voltas seguidas e fica com a 2ª (estado estável = emenda sem clique)."""
    two = np.concatenate([loop, loop])
    two = sosfilt(butter(2, 40, "highpass", fs=SR, output="sos"), two, axis=0)
    two = sosfilt(butter(2, 6500, "lowpass", fs=SR, output="sos"), two, axis=0)
    two = two - 0.3 * sosfilt(butter(2, [1200, 4000], "bandpass", fs=SR, output="sos"), two, axis=0)
    return two[LOOP:]


def main() -> None:
    y = tone(render())
    meter = pyln.Meter(SR)
    y = y * 10 ** ((TARGET_LUFS - meter.integrated_loudness(np.concatenate([y, y]))) / 20)
    peak = np.abs(y).max()
    if peak > 10 ** (-1.5 / 20):
        y = y * 10 ** (-1.5 / 20) / peak
    out = ROOT / "public/music/cafe-loop.wav"
    out.parent.mkdir(parents=True, exist_ok=True)
    sf.write(out, y.astype(np.float32), SR, subtype="PCM_16")
    jump = np.abs(y[0] - y[-1]).max()
    print(f"ok: {out} {len(y)/SR:.2f}s {BPM} BPM, {meter.integrated_loudness(y):.1f} LUFS, "
          f"pico {20*np.log10(np.abs(y).max()):.1f} dBFS, salto na emenda {jump:.4f}")


if __name__ == "__main__":
    main()
