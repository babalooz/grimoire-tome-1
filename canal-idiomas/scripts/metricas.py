"""Coletor de métricas do CapyFala pela API do Buffer (mesma credencial do publicar.py; sem OAuth do YouTube).

Uso (a partir de canal-idiomas/):  python3 scripts/metricas.py [--data AAAA-MM-DD]
1. Para cada post de publicados.csv com 72 h ou mais (e até 30 dias), lê as métricas do post no Buffer
   (o Buffer atualiza 1x/dia) e grava/atualiza metricas/posts.csv (1 linha por post, última leitura).
2. Gera metricas/resumo.json: medianas por rede × faixa (views, comentários/mil, salvamentos/mil, compart./mil,
   seguidores/mil, tempo médio assistido) — é o que os critérios de corte de canal-idiomas/decisoes.md usam.
3. FREIO automático: se os 3 posts mais recentes de uma rede (com 72 h) tiverem views < 50% da mediana dos
   anteriores daquela rede (mínimo 6 anteriores), cria canal-idiomas/FREIO com o motivo. Post que sumiu do
   Buffer ou voltou com status de erro também entra no FREIO (possível remoção pela plataforma).
Métricas que a rede não fornece ficam vazias (ex.: salvamentos só no Instagram, segundo a doc do Buffer).
"""
import argparse
import csv
import datetime as dt
import json
import statistics
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from publicar import BRT, PUBLICADOS, ROOT, SemAcesso, gql  # noqa: E402

DIR = ROOT / "metricas"
POSTS = DIR / "posts.csv"
RESUMO = DIR / "resumo.json"
FREIO = ROOT / "FREIO"
TIPOS = ["views", "impressions", "reach", "reactions", "comments", "shares", "saves", "follows", "averageTimeWatched"]
Q_POST = """query P($id: PostId!) { post(input: { id: $id }) {
  id status sentAt: dueAt metricsUpdatedAt metrics { type value unit } } }"""


def ler_publicados() -> list[dict]:
    if not PUBLICADOS.exists():
        return []
    return [r for r in csv.DictReader(PUBLICADOS.open()) if r.get("post_id")]


def postado_em(r: dict) -> dt.datetime:
    hh, mm = map(int, r["hora"].split(":"))
    d = dt.date.fromisoformat(r["data"])
    return dt.datetime(d.year, d.month, d.day, hh, mm, tzinfo=BRT)


def coletar(agora: dt.datetime) -> tuple[list[dict], list[str]]:
    linhas, alertas = [], []
    for r in ler_publicados():
        idade_h = (agora - postado_em(r)).total_seconds() / 3600
        if idade_h < 72 or idade_h > 30 * 24:
            continue
        try:
            post = gql(Q_POST, {"id": r["post_id"]}).get("post")
        except (SemAcesso, SystemExit) as e:
            alertas.append(f"erro lendo post {r['post_id']}: {e}")
            continue
        if not post:
            alertas.append(f"post {r['post_id']} ({r['rede']} {r['episodio']}) sumiu do Buffer")
            continue
        if str(post.get("status", "")).lower() == "error":
            alertas.append(f"post {r['post_id']} ({r['rede']} {r['episodio']}) com status de erro")
        m = {x["type"]: x["value"] for x in post.get("metrics") or []}
        linhas.append({**{k: r[k] for k in ("data", "hora", "rede", "faixa", "episodio", "corte", "post_id")},
                       "idade_h": round(idade_h), "metricsUpdatedAt": post.get("metricsUpdatedAt") or "",
                       **{t: m.get(t, "") for t in TIPOS}})
    return linhas, alertas


def gravar(linhas: list[dict]) -> None:
    DIR.mkdir(exist_ok=True)
    antigas = {r["post_id"]: r for r in csv.DictReader(POSTS.open())} if POSTS.exists() else {}
    antigas.update({r["post_id"]: r for r in linhas})
    campos = ["data", "hora", "rede", "faixa", "episodio", "corte", "post_id", "idade_h", "metricsUpdatedAt"] + TIPOS
    with POSTS.open("w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=campos)
        w.writeheader()
        for r in sorted(antigas.values(), key=lambda r: (r["data"], r["hora"])):
            w.writerow({k: r.get(k, "") for k in campos})


def num(v) -> float | None:
    try:
        return float(v)
    except (TypeError, ValueError):
        return None


def views(r: dict) -> float | None:
    return num(r.get("views")) if num(r.get("views")) is not None else num(r.get("impressions"))


def resumo() -> dict:
    rows = list(csv.DictReader(POSTS.open())) if POSTS.exists() else []
    out = {}
    for rede in sorted({r["rede"] for r in rows}):
        for faixa in sorted({r["faixa"] for r in rows}):
            g = [r for r in rows if r["rede"] == rede and r["faixa"] == faixa]
            if not g:
                continue
            vs = [v for v in (views(r) for r in g) if v]

            def por_mil(tipo):
                xs = [num(r.get(tipo)) / views(r) * 1000 for r in g if num(r.get(tipo)) is not None and views(r)]
                return round(statistics.median(xs), 2) if xs else None
            tempo = [num(r.get("averageTimeWatched")) for r in g if num(r.get("averageTimeWatched")) is not None]
            out[f"{rede}/{faixa}"] = {
                "n": len(g), "views_mediana": statistics.median(vs) if vs else None,
                "comentarios_por_mil": por_mil("comments"), "compart_por_mil": por_mil("shares"),
                "salvamentos_por_mil": por_mil("saves"), "seguidores_por_mil": por_mil("follows"),
                "tempo_medio_s": round(statistics.median(tempo), 1) if tempo else None}
    return out


def checar_freio(alertas: list[str]) -> str | None:
    rows = list(csv.DictReader(POSTS.open())) if POSTS.exists() else []
    motivos = [a for a in alertas if "sumiu" in a or "erro" in a.split(":")[0]]
    for rede in {r["rede"] for r in rows}:
        g = [views(r) for r in rows if r["rede"] == rede and views(r) is not None]
        if len(g) >= 9:
            base, ult = g[:-3], g[-3:]
            med = statistics.median(base)
            if med > 0 and all(v < 0.5 * med for v in ult):
                motivos.append(f"{rede}: 3 posts seguidos com views < 50% da mediana ({ult} vs {med})")
    return "; ".join(motivos) or None


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--data", help="AAAA-MM-DD (simula 'agora' às 23:00 BRT desse dia)")
    args = ap.parse_args()
    agora = (dt.datetime.fromisoformat(f"{args.data}T23:00").replace(tzinfo=BRT) if args.data
             else dt.datetime.now(BRT))
    linhas, alertas = coletar(agora)
    gravar(linhas)
    r = resumo()
    DIR.mkdir(exist_ok=True)
    RESUMO.write_text(json.dumps({"atualizado": agora.isoformat(timespec="minutes"), "grupos": r},
                                 ensure_ascii=False, indent=2))
    print(f"ok: {len(linhas)} post(s) lido(s) -> metricas/posts.csv · resumo: {len(r)} grupo(s)")
    for a in alertas:
        print("  alerta:", a)
    motivo = checar_freio(alertas)
    if motivo and not FREIO.exists():
        FREIO.write_text(f"{agora.isoformat(timespec='minutes')} FREIO automático (scripts/metricas.py): {motivo}\n"
                         "Tudo pausado. Só o Felipe remove este arquivo.\n")
        print("FREIO CRIADO:", motivo)


if __name__ == "__main__":
    main()
