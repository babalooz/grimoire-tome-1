"""Auditoria independente do PC para os vídeos do branch midia.

Mede cada mp4 ainda não auditado (duração, cor, volume, pico, movimento 0→1 s),
grava 1 linha por vídeo em ponte/AUDITORIA.md (branch ponte) e faz push.
Imprime no stdout SÓ as reprovações (é isso que acorda o Claude local).
Uso: python ponte/auditar.py
"""
import re
import subprocess
import sys
import tempfile
from pathlib import Path

import imageio_ffmpeg
from PIL import Image, ImageChops, ImageStat

W = Path(__file__).resolve().parent.parent
LOG = W / "ponte" / "AUDITORIA.md"
FF = imageio_ffmpeg.get_ffmpeg_exe()
MIN_MOV = 0.10


def git(*a):
    return subprocess.run(["git", "-C", str(W), *a], capture_output=True, text=True).stdout


def medir(mp4: Path, tmp: Path):
    info = subprocess.run([FF, "-hide_banner", "-i", str(mp4)], capture_output=True, text=True).stderr
    dur = re.search(r"Duration: (\d+):(\d+):([\d.]+)", info)
    seg = int(dur[1]) * 3600 + int(dur[2]) * 60 + float(dur[3]) if dur else 0.0
    vid = re.search(r"Video: .*", info)
    vid = vid[0] if vid else ""
    loud = subprocess.run([FF, "-hide_banner", "-nostats", "-i", str(mp4), "-af", "ebur128=peak=true",
                           "-f", "null", "-"], capture_output=True, text=True).stderr
    i_lufs = re.findall(r"I:\s+(-?[\d.]+) LUFS", loud)
    peak = re.findall(r"Peak:\s+(-?[\d.]+) dBFS", loud)
    frames = []
    for t in ("0", "1"):
        out = tmp / f"{mp4.stem}-{t}.png"
        subprocess.run([FF, "-v", "error", "-y", "-ss", t, "-i", str(mp4), "-frames:v", "1", str(out)])
        frames.append(Image.open(out).convert("L"))
    mov = ImageStat.Stat(ImageChops.difference(*frames)).mean[0] / 255
    return {
        "dur": seg,
        "res": "1080x1920" in vid,
        "cor": "yuv420p(tv, bt709" in vid,
        "lufs": float(i_lufs[-1]) if i_lufs else None,
        "peak": float(peak[-1]) if peak else None,
        "mov": mov,
    }


def veredito(nome: str, m: dict):
    falhas = []
    esquete = "esquete" in nome
    if not m["res"]:
        falhas.append("não é 1080x1920")
    if not m["cor"]:
        falhas.append("cor fora de yuv420p/tv/bt709")
    if m["lufs"] is None or abs(m["lufs"] + 14) > 1:
        falhas.append(f"volume {m['lufs']} LUFS (alvo -14±1)")
    if m["peak"] is None or m["peak"] > -1.0:
        falhas.append(f"pico {m['peak']} dBFS (máx -1)")
    if m["mov"] < MIN_MOV:
        falhas.append(f"movimento 0-1s {m['mov']:.3f} (mín {MIN_MOV})")
    if esquete and not (5 <= m["dur"] <= 20):
        falhas.append(f"esquete com {m['dur']:.1f} s (5-20)")
    if not esquete and not (61 <= m["dur"] <= 140):
        falhas.append(f"episódio com {m['dur']:.1f} s (61-140)")
    return falhas


def main():
    git("fetch", "-q", "origin", "midia", "ponte")
    git("checkout", "-q", "ponte")
    git("fetch", "-q", "origin", "ponte"); git("rebase", "-q", "origin/ponte")
    commit = git("rev-parse", "--short", "origin/midia").strip()
    feitos = LOG.read_text(encoding="utf-8") if LOG.exists() else "# Auditoria do PC (branch midia)\n\n"
    nomes = [n for n in git("ls-tree", "-r", "--name-only", "origin/midia").split() if n.endswith(".mp4")]
    novos = [n for n in nomes if f"`{n}`" not in feitos]
    if not novos:
        return
    linhas, reprovados = [], []
    with tempfile.TemporaryDirectory() as t:
        tmp = Path(t)
        for n in novos:
            mp4 = tmp / n
            mp4.write_bytes(subprocess.run(["git", "-C", str(W), "show", f"origin/midia:{n}"],
                                           capture_output=True).stdout)
            m = medir(mp4, tmp)
            falhas = veredito(n, m)
            status = "REPROVADO: " + "; ".join(falhas) if falhas else "ok"
            linhas.append(f"- `{n}` · midia {commit} · {m['dur']:.1f} s · {m['lufs']} LUFS · pico {m['peak']} · "
                          f"mov {m['mov']:.3f} · {status}\n")
            if falhas:
                reprovados.append(f"{n}: {'; '.join(falhas)}")
    LOG.write_text(feitos + "".join(linhas), encoding="utf-8")
    git("add", str(LOG))
    git("commit", "-q", "-m", f"auditoria PC: {len(novos)} vídeo(s) do midia {commit}")
    for _ in range(4):  # a nuvem também escreve no ponte: rebase e tenta de novo
        if subprocess.run(["git", "-C", str(W), "push", "-q", "origin", "ponte"]).returncode == 0:
            break
        git("fetch", "-q", "origin", "ponte"); git("rebase", "-q", "origin/ponte")
    for r in reprovados:
        print(f"AUDITORIA REPROVOU {r}", flush=True)


if __name__ == "__main__":
    sys.exit(main())
