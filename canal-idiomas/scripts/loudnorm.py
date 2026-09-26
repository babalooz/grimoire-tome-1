"""Masteriza o áudio de um MP4 para celular: -14 LUFS integrado, pico verdadeiro <= -1 dBTP (ITU-R BS.1770 / EBU R128).

Fluxo: extrai o áudio (ffmpeg do Remotion) -> mede (pyloudnorm) -> ganho -> limitador com lookahead medindo o pico
verdadeiro em 4x oversampling -> repete até cravar o alvo -> AAC 256k -> remux com o vídeo copiado (sem re-encode)
-> decodifica o MP4 final e mede de novo (o AAC mexe um pouco no pico; por isso o teto interno é -1,5 dBTP).

Uso: .venv/bin/python scripts/loudnorm.py out/<id>.mp4   (substitui o arquivo; imprime antes/depois)
"""
import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np
import pyloudnorm as pyln
import soundfile as sf
from scipy.ndimage import minimum_filter1d
from scipy.signal import resample_poly

ROOT = Path(__file__).resolve().parent.parent
TARGET_LUFS = -14.0
MAX_TP = -1.0
CEILING = -1.5  # teto do limitador (margem para o AAC)
SR = 48000


def ffmpeg(*args: str) -> None:
    subprocess.run(["npx", "remotion", "ffmpeg", "-hide_banner", "-loglevel", "error", "-y", *args], cwd=ROOT, check=True)


def true_peak_db(x: np.ndarray) -> float:
    return 20 * np.log10(np.abs(resample_poly(x, 4, 1, axis=0)).max() + 1e-12)


def measure(x: np.ndarray) -> tuple[float, float]:
    return pyln.Meter(SR).integrated_loudness(x), true_peak_db(x)


def limit(x: np.ndarray, ceiling_db: float, lookahead: float = 0.005, release: float = 0.08) -> np.ndarray:
    """Limitador de pico com lookahead (pico verdadeiro 4x). Garantia: ganho[i] <= necessário[i] em toda amostra.
    m = mínimo do necessário nas próximas `la` amostras -> soltura exponencial (só sobe devagar) -> média móvel de
    `la` amostras (ataque suave, sem clique): cada termo da média já cobre a amostra i, então nunca passa do teto."""
    thr = 10 ** (ceiling_db / 20)
    over = np.abs(resample_poly(x, 4, 1, axis=0)).max(axis=1)[: 4 * len(x)].reshape(-1, 4).max(axis=1)
    need = np.minimum(1.0, thr / np.maximum(over, 1e-12))
    la = 2 * max(1, int(lookahead * SR / 2))  # par
    m = minimum_filter1d(need, size=la + 1, origin=-(la // 2), mode="nearest")  # janela [i, i+la]
    a = np.exp(-1 / (release * SR))
    r = np.empty_like(m)
    cur = 1.0
    for i, v in enumerate(m):
        cur = v if v < cur else min(v, a * cur + (1 - a) * v)
        r[i] = cur
    g = np.convolve(np.pad(r, (la - 1, 0), mode="edge"), np.ones(la) / la, mode="valid")
    return x * g[:, None]


def master(x: np.ndarray, ceiling: float) -> tuple[np.ndarray, float]:
    """Ganho + limitador, iterando (o limitador tira um pouco de loudness)."""
    y, gr = x, 0.0
    for _ in range(6):
        lufs, _ = measure(y)
        y = y * 10 ** ((TARGET_LUFS - lufs) / 20)
        pre = y
        y = limit(y, ceiling)
        loud = np.abs(pre).max(axis=1) > 0.01
        gr = max(gr, -20 * np.log10((np.abs(y).max(axis=1)[loud] / np.abs(pre).max(axis=1)[loud]).min()))
        lufs, tp = measure(y)
        if abs(lufs - TARGET_LUFS) < 0.1 and tp <= ceiling + 0.05:
            break
    return y, gr


def main(mp4: str) -> None:
    mp4 = Path(mp4).resolve()
    with tempfile.TemporaryDirectory() as tmp:
        raw, mastered, out = Path(tmp) / "raw.wav", Path(tmp) / "master.wav", Path(tmp) / "out.mp4"
        ffmpeg("-i", str(mp4), "-vn", "-ac", "2", "-ar", str(SR), "-c:a", "pcm_s16le", str(raw))
        x, _ = sf.read(raw)
        l0, tp0 = measure(x)
        ceiling = CEILING
        for _ in range(3):  # o AAC sobe o pico verdadeiro ~0,5 dB: se passar de -1 dBTP, baixa o teto e refaz
            y, gr = master(x, ceiling)
            sf.write(mastered, y.astype(np.float32), SR, subtype="FLOAT")
            ffmpeg("-i", str(mp4), "-i", str(mastered), "-map", "0:v:0", "-map", "1:a:0", "-c:v", "copy",
                   "-c:a", "libfdk_aac", "-b:a", "256k", "-ar", str(SR), "-movflags", "+faststart", "-shortest", str(out))
            ffmpeg("-i", str(out), "-vn", "-ac", "2", "-ar", str(SR), "-c:a", "pcm_s16le", str(raw))
            l1, tp1 = measure(sf.read(raw)[0])
            if tp1 <= MAX_TP:
                break
            ceiling -= tp1 - MAX_TP + 0.2
        out.replace(mp4)
    ok = abs(l1 - TARGET_LUFS) <= 0.5 and tp1 <= MAX_TP
    ref = np.abs(x * 10 ** ((TARGET_LUFS - l0) / 20)).max(axis=1)  # só ganho, sem limitador
    loud = ref > 0.01
    lim = np.zeros(len(x))
    lim[loud] = 20 * np.log10(np.abs(y).max(axis=1)[loud] / ref[loud])
    busy = (lim[loud] < -3).mean() * 100
    hot = sorted({round(float(i) / SR, 1) for i in np.argsort(lim)[:4000] if lim[i] < -3})[:10]
    print(f"limitador: >3 dB em {busy:.1f}% do tempo com som; trechos mais limitados (s): {hot}")
    print(f"loudness: antes {l0:.1f} LUFS / {tp0:.1f} dBTP -> depois {l1:.1f} LUFS / {tp1:.1f} dBTP "
          f"(limitador máx. {gr:.1f} dB) {'OK' if ok else 'FORA DO ALVO'}")
    if not ok:
        sys.exit(1)


if __name__ == "__main__":
    main(sys.argv[1])
