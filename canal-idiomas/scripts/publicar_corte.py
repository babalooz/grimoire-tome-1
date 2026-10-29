"""Agenda 1 CORTE no Buffer: TikTok 12:37 e YouTube Shorts 20:10 (BRT), horários fixos da faixa "corte"
(decisão do Felipe, 28/10). Mesmo padrão de scripts/publicar_vocab.py, lendo o JSON em canal-idiomas/cortes/.

Textos do post = campo `post` do corte (canal-idiomas/cortes/<id>.json):
  "post": {"tiktok": "<legenda>", "youtube_titulo": "<título>", "youtube_descricao": "<descrição>",
           "hashtags_tiktok": "#capyfala ...", "hashtags_youtube": "#capyfala #inglês"}
Rótulo de IA ligado no TikTok (publicar.AI_LABEL). Mesmas travas do publicar.py: FREIO, portão aprovado
(out/<arquivo>.portao.json com aprovado:true), vídeo no branch midia, canal conectado, horário no futuro, nada
duplicado em publicados.csv. Numeração CLAUDE.md (28/10): legenda/título já vêm com "do Ep. N ·"/"das Palavras #N ·"
prontos no JSON do corte; 1º corte da série não leva linha "anterior:".
Uso (a partir de canal-idiomas/): python3 scripts/publicar_corte.py cortes/<id>.json --data 2026-10-30 [--dry-run]
"""
import argparse
import csv
import datetime as dt
import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import publicar as pub  # noqa: E402

HORAS = {"tiktok": "12:37", "youtube": "20:10"}
PROIBIDO_TEXTO = re.compile(r"travar|trava\b|comigo|duolingo|fluente em|m[eé]todo secreto|s[oó] hoje|[uú]ltimas vagas", re.I)


def url_midia(nome: str) -> tuple[str, str] | None:
    pub._git("fetch", "-q", "origin", "midia")
    sha = pub._git("rev-parse", "origin/midia")
    if nome not in pub._git("ls-tree", "--name-only", "origin/midia").splitlines():
        return None
    return f"https://cdn.jsdelivr.net/gh/{pub.REPO}@{sha}/{nome}", sha


def anterior_por_ultimo(desc: str, hashtags: str) -> str:
    corpo, sep, ant = desc.rpartition("\n\nanterior:")
    return f"{corpo}\n\n{hashtags}\n\nanterior:{ant}" if sep else f"{desc}\n\n{hashtags}"


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("corte")
    ap.add_argument("--data", required=True)
    ap.add_argument("--dry-run", action="store_true")
    a = ap.parse_args()
    corte = json.loads(Path(a.corte).read_text())
    dia = dt.date.fromisoformat(a.data)
    cod = corte["origem"]["episodio"]
    nome = corte["arquivo"]
    post = corte["post"]
    textos = {
        "tiktok": {"titulo": "", "texto": f"{post['tiktok']} {post['hashtags_tiktok']}"},
        "youtube": {"titulo": post["youtube_titulo"], "texto": anterior_por_ultimo(post["youtube_descricao"], post["hashtags_youtube"])},
    }
    falhas = []
    if (pub.ROOT / "FREIO").exists():
        falhas.append("FREIO ativo")
    for r, t in textos.items():
        for campo in (t["titulo"], t["texto"]):
            if PROIBIDO_TEXTO.search(campo):
                falhas.append(f"{r}: termo proibido no texto ({PROIBIDO_TEXTO.search(campo).group(0)!r})")
    if len(textos["youtube"]["titulo"]) > 100:
        falhas.append("título do YouTube passa de 100 caracteres")
    portao = pub.ROOT / "out" / f"{Path(nome).stem}.portao.json"
    if not (portao.exists() and json.loads(portao.read_text()).get("aprovado") is True):
        falhas.append(f"portão não aprovou ({portao.relative_to(pub.ROOT)})")
    ja = set()
    if pub.PUBLICADOS.exists():
        for row in csv.DictReader(pub.PUBLICADOS.open()):
            if row["faixa"] == "corte":
                ja.add((row["rede"], row["corte"]))
            ja.add((row["rede"], row["data"], row["hora"]))
    midia = url_midia(nome)
    if not midia:
        falhas.append(f"{nome} não está no branch midia")
    ok, msg = pub.acesso_ok()
    if not ok:
        falhas.append(f"sem acesso ao Buffer ({msg})")
    for r, t in textos.items():
        print(f"[{r}] {HORAS[r]} {t['titulo'] + ' | ' if t['titulo'] else ''}{t['texto']!r} ({len(t['texto'])} caracteres)")
    if falhas:
        raise SystemExit("NÃO agendado: " + "; ".join(falhas))
    url, sha = midia
    for rede in ("tiktok", "youtube"):
        if (rede, corte["id"]) in ja or (rede, a.data, HORAS[rede]) in ja:
            print(f"  já existe em publicados.csv: {rede} {corte['id']} / {a.data} {HORAS[rede]} — pulei")
            continue
        hh, mm = map(int, HORAS[rede].split(":"))
        due = dt.datetime(dia.year, dia.month, dia.day, hh, mm, tzinfo=pub.BRT).astimezone(dt.timezone.utc)
        if due <= dt.datetime.now(dt.timezone.utc):
            raise SystemExit(f"{rede}: horário já passou")
        entrada = {"input": {"channelId": pub.canal_id(rede), "text": textos[rede]["texto"], "schedulingType": "automatic",
                             "mode": "customScheduled", "dueAt": due.isoformat().replace("+00:00", "Z"), "aiAssisted": True,
                             "metadata": pub.metadata(rede, textos[rede]),
                             "assets": [{"video": {"url": url, "metadata": {"thumbnailOffset": 0}}}]}}
        if a.dry_run:
            print(f"  [dry-run] {json.dumps(entrada, ensure_ascii=False)[:600]}")
            continue
        r = pub.gql(pub.M_POST, entrada)["createPost"]
        if "post" not in r:
            raise SystemExit(f"{rede}: Buffer recusou: {r.get('message')}")
        pub.registrar(a.data, {"hora": HORAS[rede], "rede": rede, "faixa": "corte", "episodio": cod, "corte": corte["id"]},
                      r["post"], nome, url)
        print(f"  OK {rede} {a.data} {HORAS[rede]} BRT -> post {r['post']['id']} (midia {sha[:7]})")


if __name__ == "__main__":
    main()
