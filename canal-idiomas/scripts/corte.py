"""Produz um CORTE (15-25 s) a partir de um vídeo JÁ APROVADO e já no branch `midia` (sitcom ou vocabulário), sem
voz nova: um recorte direto (ffmpeg) de um trecho que se sustenta sozinho (pegadinha de pronúncia, desafio com
pausa+resposta, piada da cena). Ver CLAUDE.md "Fábrica autônoma" e a rotina "CapyFala — cortes diários".

Só ffmpeg/ffprobe do sistema (não depende do node_modules do Remotion: não há render aqui, só recorte do MP4 final).

Camada 1 (código, reprova sozinha): duração 15-25 s, gancho com movimento nos 2 primeiros segundos (diff quadro 0 vs
quadro 1 s >= GANCHO_DIF_MIN, mesmo critério do portão principal), loudness -14 LUFS +-1 e pico verdadeiro <= -1 dBTP
(mesmos alvos do portão principal, LUFS_ALVO/LUFS_TOL/TP_MAX importados de scripts/portao.py), sem termo proibido no
texto do post (GATILHO_PROIBIDO/PROIBIDO, também importados do portão).
Camada 2 (juiz, nota >= 8, régua do mestre: "o corte ensina algo sozinho?"): sem API nesta nuvem -> `--pedido-juiz`
imprime o roteiro do trecho; o Claude da rotina avalia e grava com `--juiz NOTA --motivos "..."`.

Uso (a partir de canal-idiomas/):
  python3 scripts/corte.py --extrair --origem <arquivo.mp4 no branch midia> --inicio S --fim S --saida <nome>.mp4
      Baixa o arquivo de origin/midia, recorta [inicio, fim), roda a camada 1, grava out/<nome>.portao.json
      (aprovado só se a camada 1 também passar) e imprime o pedido pro juiz.
  python3 scripts/corte.py --juiz 8.4 --motivos "..." out/<nome>.mp4
      Grava a nota do juiz da rotina; se nota >= 8 e camada 1 ok, marca aprovado=true.
"""
import argparse
import datetime as dt
import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(Path(__file__).resolve().parent))
from portao import GATILHO_PROIBIDO, LUFS_ALVO, LUFS_TOL, NOTA_MIN, PROIBIDO, TP_MAX  # noqa: E402
import publicar as pub  # noqa: E402

FFMPEG, FFPROBE = "ffmpeg", "ffprobe"
DURACAO_MIN, DURACAO_MAX = 15.0, 25.0
GANCHO_DIF_MIN = 0.10


def probe(mp4: Path) -> dict:
    r = subprocess.run([FFPROBE, "-v", "error", "-select_streams", "v:0",
                        "-show_entries", "format=duration:stream=width,height", "-of", "json", str(mp4)],
                       capture_output=True, text=True, check=True)
    d = json.loads(r.stdout)
    return {"duracao": round(float(d["format"]["duration"]), 2),
            "largura": d["streams"][0]["width"], "altura": d["streams"][0]["height"]}


def frame_gray(mp4: Path, t: float, w: int = 108, h: int = 192) -> bytes:
    r = subprocess.run([FFMPEG, "-y", "-i", str(mp4), "-ss", str(t), "-frames:v", "1",
                        "-vf", f"scale={w}:{h}", "-pix_fmt", "gray", "-f", "rawvideo", "-"],
                       capture_output=True, check=True)
    return r.stdout


def movimento_gancho(mp4: Path, t: float = 1.0) -> float:
    """Diferença média (0-1) entre o quadro 0 e o quadro de t s: mede se há corte/zoom/ação no começo."""
    a, b = frame_gray(mp4, 0.0), frame_gray(mp4, t)
    if not a or not b or len(a) != len(b):
        return 0.0
    return round(sum(abs(x - y) for x, y in zip(a, b)) / (255 * len(a)), 3)


def loudness(mp4: Path) -> tuple[float, float]:
    r = subprocess.run([FFMPEG, "-i", str(mp4), "-af", "loudnorm=I=-14:TP=-1:print_format=json", "-f", "null", "-"],
                       capture_output=True, text=True)
    bloco = r.stderr[r.stderr.rindex("{"):r.stderr.rindex("}") + 1]
    m = json.loads(bloco)
    return round(float(m["input_i"]), 2), round(float(m["input_tp"]), 2)


def checar_camada1(mp4: Path) -> tuple[list[str], dict]:
    falhas = []
    medidas = probe(mp4)
    if (medidas["largura"], medidas["altura"]) != (1080, 1920):
        falhas.append(f"resolução {medidas['largura']}x{medidas['altura']} (esperado 1080x1920)")
    if not (DURACAO_MIN <= medidas["duracao"] <= DURACAO_MAX):
        falhas.append(f"duração {medidas['duracao']} s (faixa do corte: {DURACAO_MIN}-{DURACAO_MAX} s)")
    medidas["gancho_diff"] = movimento_gancho(mp4)
    if medidas["gancho_diff"] < GANCHO_DIF_MIN:
        falhas.append(f"gancho parado: diferença {medidas['gancho_diff']} no 1º segundo (mín. {GANCHO_DIF_MIN})")
    medidas["lufs"], medidas["true_peak"] = loudness(mp4)
    if abs(medidas["lufs"] - LUFS_ALVO) > LUFS_TOL:
        falhas.append(f"loudness {medidas['lufs']} LUFS (alvo {LUFS_ALVO} +-{LUFS_TOL})")
    if medidas["true_peak"] > TP_MAX:
        falhas.append(f"pico verdadeiro {medidas['true_peak']} dBTP (> {TP_MAX})")
    return falhas, medidas


def checar_texto(*textos: str) -> list[str]:
    falhas = []
    for t in textos:
        if GATILHO_PROIBIDO.search(t) or PROIBIDO.search(t):
            falhas.append(f"texto proibido: {t[:80]!r}")
    return falhas


def gravar(mp4: Path, c1: dict, juiz: dict | None) -> dict:
    aprovado = c1["ok"] and juiz is not None and juiz["nota"] >= NOTA_MIN
    v = {"aprovado": aprovado, "camada1": c1, "juiz": juiz, "nota_minima": NOTA_MIN,
         "data": dt.datetime.now(dt.timezone.utc).isoformat(timespec="seconds")}
    mp4.with_suffix(".portao.json").write_text(json.dumps(v, ensure_ascii=False, indent=2))
    return v


def extrair(origem: str, inicio: float, fim: float, saida: str) -> None:
    out = ROOT / "out"
    out.mkdir(exist_ok=True)
    pub._git("fetch", "-q", "origin", "midia")
    if origem not in pub._git("ls-tree", "--name-only", "origin/midia").splitlines():
        raise SystemExit(f"{origem} não está em origin/midia (nunca recorte de vídeo ainda não publicado)")
    bruto = subprocess.run(["git", "show", f"origin/midia:{origem}"], cwd=pub.GIT_ROOT,
                           check=True, capture_output=True).stdout
    fonte = out / f"_fonte-{origem}"
    fonte.write_bytes(bruto)
    mp4 = out / saida
    subprocess.run([FFMPEG, "-y", "-i", str(fonte), "-ss", str(inicio), "-to", str(fim),
                    "-c:v", "libx264", "-preset", "medium", "-crf", "20", "-pix_fmt", "yuv420p",
                    "-c:a", "aac", "-b:a", "256k", "-movflags", "+faststart", str(mp4)],
                   check=True, capture_output=True)
    fonte.unlink()
    falhas, medidas = checar_camada1(mp4)
    c1 = {"ok": not falhas, "falhas": falhas, "medidas": medidas, "origem": origem, "inicio": inicio, "fim": fim}
    v = gravar(mp4, c1, None)
    print(f"{'CAMADA 1 OK' if c1['ok'] else 'CAMADA 1 REPROVADA'}: {mp4.name} "
          f"({medidas['duracao']} s, gancho {medidas['gancho_diff']}, {medidas['lufs']} LUFS, pico {medidas['true_peak']} dBTP)")
    for f in falhas:
        print(f"   - {f}")
    if not falhas:
        print("\nJuiz do CORTE (régua do mestre, git show origin/ponte:ponte/saida/mestre-ingles.md): "
              "pergunta central = este corte ENSINA ALGO SOZINHO, sem o resto do episódio? nota 0-10 em: (1) 1 "
              "objetivo claro no corte; (2) frase/palavra útil pra quem começa do zero; (3) repetição em 3+ bocas "
              "e/ou pausa+resposta real; (4) pronúncia ensinada onde o brasileiro erra; (5) inglês natural e "
              "correto; (6) cultura certa; (7) encanto sem infantilizar; (8) cabe nos 15-25 s sem parecer cortado "
              "no meio de uma fala. nota final >= 8 e nenhum critério < 8.")
        print(f"Depois grave: python3 scripts/corte.py --juiz <nota> --motivos \"...\" out/{mp4.name}")


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("mp4", nargs="?")
    ap.add_argument("--extrair", action="store_true")
    ap.add_argument("--origem")
    ap.add_argument("--inicio", type=float)
    ap.add_argument("--fim", type=float)
    ap.add_argument("--saida")
    ap.add_argument("--juiz", type=float)
    ap.add_argument("--motivos", default="")
    args = ap.parse_args()

    if args.extrair:
        if not (args.origem and args.inicio is not None and args.fim is not None and args.saida):
            raise SystemExit("--extrair precisa de --origem --inicio --fim --saida")
        extrair(args.origem, args.inicio, args.fim, args.saida)
        return

    if args.juiz is None or not args.mp4:
        raise SystemExit("uso: corte.py extrair --origem ... --inicio S --fim S --saida nome.mp4"
                         "  |  corte.py --juiz NOTA --motivos \"...\" out/nome.mp4")
    mp4 = Path(args.mp4).resolve()
    v_anterior = json.loads(mp4.with_suffix(".portao.json").read_text())
    c1 = v_anterior["camada1"]
    juiz = {"nota": args.juiz, "motivos": [m.strip() for m in args.motivos.split(";") if m.strip()], "fonte": "rotina"}
    v = gravar(mp4, c1, juiz)
    print(f"{'APROVADO' if v['aprovado'] else 'REPROVADO'}: {mp4.name} (camada 1 {'ok' if c1['ok'] else 'falhou'}, juiz {args.juiz})")
    sys.exit(0 if v["aprovado"] else 1)


if __name__ == "__main__":
    main()
