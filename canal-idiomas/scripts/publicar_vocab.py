"""Agenda 1 vídeo da série de VOCABULÁRIO no Buffer: TikTok 16:07 e YouTube Shorts 17:10 (BRT), horários fixos da série.

Textos do post = campo `post` do tema (padrão de ponte/saida/serie-vocabulario.md §d):
  "post": {"tiktok": "<legenda>", "youtube_titulo": "<título>", "youtube_descricao": "<descrição>",
           "hashtags_tiktok": "#capyfala #capybara ...", "hashtags_youtube": "#capyfala #inglês ..."}
Rótulo de IA ligado no TikTok (publicar.AI_LABEL). Mesmas travas do publicar.py: FREIO, portão aprovado, vídeo no branch
midia (o portão sobe ao aprovar), canal conectado, horário no futuro, e nada duplicado em publicados.csv.
Uso (a partir de canal-idiomas/): python3 scripts/publicar_vocab.py vocab/<tema>.json --data 2026-10-30 [--dry-run]
"""
import argparse
import csv
import datetime as dt
import json
import re
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import publicar as pub  # noqa: E402

HORAS = {"tiktok": "16:07", "youtube": "17:10"}
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
    ap.add_argument("tema")
    ap.add_argument("--data", required=True)
    ap.add_argument("--dry-run", action="store_true")
    a = ap.parse_args()
    tema = json.loads(Path(a.tema).read_text())
    dia = dt.date.fromisoformat(a.data)
    cod = tema["serie"]["codigo"]
    nome = f"{tema['id']}.mp4"
    post = tema["post"]
    textos = {
        "tiktok": {"titulo": "", "texto": f"{post['tiktok']} {post['hashtags_tiktok']}"},
        # regra de CLAUDE.md (28/10): a descrição TERMINA com "anterior: …" → hashtags entram antes dessa linha
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
    portao = pub.ROOT / "out" / f"{tema['id']}.portao.json"
    if not (portao.exists() and json.loads(portao.read_text()).get("aprovado") is True):
        falhas.append("portão não aprovou")
    ja = set()
    if pub.PUBLICADOS.exists():
        for row in csv.DictReader(pub.PUBLICADOS.open()):
            ja.add((row["rede"], row["episodio"]))
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
        if (rede, cod) in ja or (rede, a.data, HORAS[rede]) in ja:
            print(f"  já existe em publicados.csv: {rede} {cod} / {a.data} {HORAS[rede]} — pulei")
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
        pub.registrar(a.data, {"hora": HORAS[rede], "rede": rede, "faixa": "vocab", "episodio": cod}, r["post"], nome, url)
        print(f"  OK {rede} {a.data} {HORAS[rede]} BRT -> post {r['post']['id']} (midia {sha[:7]})")


if __name__ == "__main__":
    main()
