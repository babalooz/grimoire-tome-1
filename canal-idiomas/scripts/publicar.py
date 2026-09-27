"""Publicador CapyFala via Buffer API (GraphQL, https://api.buffer.com). Só biblioteca padrão.

Chave: "Credencial de API" do ambiente Default (nome "Buffer", Bearer, site api.buffer.com). O proxy do ambiente injeta
o header Authorization sozinho: o script NÃO lê nem vê a chave. (Fallback local: BUFFER_TOKEN/BUFFER_API_KEY, se existir.)
Teste de acesso = consulta de leitura (listar canais) responde 200 e contém TikTok "acapyfala" e YouTube "CapyFala".

Uso (a partir de canal-idiomas/):
  python3 scripts/publicar.py --listar
      Só leitura: lista organizações e canais, grava os IDs em config/buffer-canais.json e diz se o acesso está OK
      (sai com código 0 = OK; 1 = sem acesso ou canais faltando). É o teste que as rotinas usam.
  python3 scripts/publicar.py --data 2026-10-12 --dry-run
      Monta os posts do dia a partir de config/grade.json e mostra o que seria enviado. Não envia nada.
  python3 scripts/publicar.py --data 2026-10-12
      Agenda os posts do dia (mode=customScheduled, schedulingType=automatic, horário da grade em BRT).
  python3 scripts/publicar.py --teste-rascunho out/<id>.mp4
      Teste real SEM publicar: cria rascunho no YouTube e no TikTok com o vídeo, mostra se carregou e apaga.

Um post só é enviado se TUDO for verdade (docs/plano-de-acao.md §4):
  data >= 2026-10-12 · acesso ao Buffer OK (--listar) · MP4 existe · portão aprovou (out/<arquivo>.portao.json com "aprovado": true)
  · canal da rede conectado no Buffer. O vídeo é hospedado no branch órfão "midia" (repo público) e servido pelo jsDelivr.
Se algo faltar, o post vai para fila/<data>_<rede>_<faixa>_<episodio>.json com o motivo. Arquivo FREIO existe = não faz nada.
Enviado com sucesso -> linha nova em publicados.csv.
"""
import argparse
import csv
import datetime as dt
import json
import os
import shutil
import subprocess
import tempfile
import sys
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
API = "https://api.buffer.com"
INICIO = dt.date(2026, 10, 12)
BRT = dt.timezone(dt.timedelta(hours=-3))
CANAIS = ROOT / "config" / "buffer-canais.json"
GRADE = ROOT / "config" / "grade.json"
PUBLICADOS = ROOT / "publicados.csv"
FILA = ROOT / "fila"
SERVICO = {"youtube": "youtube", "tiktok": "tiktok", "instagram": "instagram"}
# Rótulo de IA: TikTok exige para conteúdo gerado por IA com voz realista (docs/pesquisas/2026-09-26-tiktok-campeoes.md §7).
AI_LABEL = {"tiktok": True, "youtube": False, "instagram": False}


# ---------------------------------------------------------------- API
ESPERADOS = {"tiktok": "acapyfala", "youtube": "capyfala"}  # canais que precisam aparecer no teste de acesso


class SemAcesso(Exception):
    pass


def token() -> str | None:
    """Só para rodar fora da nuvem. Na nuvem a credencial é injetada pelo proxy e isto é None."""
    return os.environ.get("BUFFER_TOKEN") or os.environ.get("BUFFER_API_KEY") or None


def gql(query: str, variables: dict | None = None) -> dict:
    body = json.dumps({"query": query, "variables": variables or {}}).encode()
    headers = {"Content-Type": "application/json"}
    if token():
        headers["Authorization"] = f"Bearer {token()}"
    req = urllib.request.Request(API, data=body, method="POST", headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            data = json.loads(r.read())
    except urllib.error.HTTPError as e:  # sem cabeçalhos no erro: a chave nunca aparece
        raise SemAcesso(f"Buffer API HTTP {e.code}: {e.read()[:200].decode(errors='replace')}")
    if data.get("errors"):
        raise SystemExit(f"Buffer API erro: {json.dumps(data['errors'], ensure_ascii=False)[:500]}")
    return data["data"]


Q_ORGS = "query { account { organizations { id name } } }"
Q_CANAIS = """query Canais($organizationId: OrganizationId!) {
  channels(input: { organizationId: $organizationId }) { id name displayName service isQueuePaused }
}"""
M_POST = """mutation Post($input: CreatePostInput!) {
  createPost(input: $input) {
    ... on PostActionSuccess { post { id dueAt status } }
    ... on MutationError { message }
  }
}"""


def listar() -> dict:
    orgs = gql(Q_ORGS)["account"]["organizations"]
    out = {"_sobre": "IDs dos canais no Buffer (sem segredo). Gerado por scripts/publicar.py --listar.",
           "atualizado": dt.datetime.now(BRT).isoformat(timespec="minutes"), "organizacoes": []}
    for o in orgs:
        canais = gql(Q_CANAIS, {"organizationId": o["id"]})["channels"]
        out["organizacoes"].append({"id": o["id"], "nome": o["name"], "canais": canais})
        print(f"organização: {o['name']} ({o['id']})")
        for c in canais:
            pausa = "  [FILA PAUSADA]" if c.get("isQueuePaused") else ""
            print(f"  - {c['service']:10} {c.get('displayName') or c['name']:25} {c['id']}{pausa}")
    CANAIS.write_text(json.dumps(out, ensure_ascii=False, indent=2))
    print(f"ok: {CANAIS.relative_to(ROOT)}")
    return out


def acesso_ok() -> tuple[bool, str]:
    """Teste das rotinas: leitura em api.buffer.com responde e lista TikTok acapyfala + YouTube CapyFala."""
    try:
        d = listar()
    except SemAcesso as e:
        return False, str(e)
    canais = [c for o in d["organizacoes"] for c in o["canais"]]
    faltam = [f"{srv} {nome}" for srv, nome in ESPERADOS.items()
              if not any(c["service"] == srv and nome in f"{c.get('name', '')} {c.get('displayName', '')}".lower()
                         for c in canais)]
    return (not faltam), ("acesso OK" if not faltam else "faltam canais: " + ", ".join(faltam))


def canal_id(rede: str) -> str | None:
    if not CANAIS.exists():
        return None
    d = json.loads(CANAIS.read_text())
    for o in d["organizacoes"]:
        for c in o["canais"]:
            if c["service"] == SERVICO[rede]:
                return c["id"]
    return None


# ---------------------------------------------------------------- hospedagem do vídeo (branch órfão "midia")
# O repo é público. Cada publicação reescreve o branch "midia" como 1 commit órfão só com os vídeos ainda úteis
# (novos + publicados há menos de MIDIA_DIAS dias): o histórico não cresce e o GitHub descarta os blobs antigos.
# URL: jsDelivr fixado no SHA do commit (serve Content-Type video/mp4 e não sofre cache de branch);
# se o arquivo passar do limite do jsDelivr, usa raw.githubusercontent.com (serve application/octet-stream).
REPO = "babalooz/grimoire-tome-1"
MIDIA_DIAS = 7
JSDELIVR_MAX = 20 * 1024 * 1024
GIT_ROOT = ROOT.parent


def _git(*args: str, cwd: Path = GIT_ROOT) -> str:
    return subprocess.run(["git", *args], cwd=cwd, check=True, capture_output=True, text=True).stdout.strip()


def midia_manter(hoje: dt.date) -> set[str]:
    """Arquivos que continuam no branch: publicados há menos de MIDIA_DIAS dias."""
    if not PUBLICADOS.exists():
        return set()
    manter = set()
    for row in csv.DictReader(PUBLICADOS.open()):
        if row.get("arquivo") and (hoje - dt.date.fromisoformat(row["data"])).days < MIDIA_DIAS:
            manter.add(row["arquivo"])
    return manter


def hospedar(mp4s: list[Path], hoje: dt.date) -> dict[str, str]:
    """Sobe os MP4 para o branch midia e devolve {nome: url pública}."""
    tmp = Path(tempfile.mkdtemp(prefix="midia-"))
    wt = tmp / "wt"
    antigos = tmp / "antigos"
    antigos.mkdir()
    manter = midia_manter(hoje) - {m.name for m in mp4s}
    try:
        _git("fetch", "-q", "origin", "midia")
        for nome in manter:  # recupera do branch atual os vídeos que ainda precisam ficar no ar
            try:
                blob = subprocess.run(["git", "show", f"origin/midia:{nome}"], cwd=GIT_ROOT, check=True,
                                      capture_output=True).stdout
                (antigos / nome).write_bytes(blob)
            except subprocess.CalledProcessError:
                pass
    except subprocess.CalledProcessError:
        pass  # branch ainda não existe
    _git("worktree", "add", "-q", "--detach", str(wt))
    try:
        _git("checkout", "-q", "--orphan", "midia-novo", cwd=wt)
        _git("rm", "-rqf", "--cached", ".", cwd=wt)
        for f in wt.iterdir():
            if f.name != ".git":
                shutil.rmtree(f) if f.is_dir() else f.unlink()
        (wt / "README.md").write_text("Vídeos temporários do CapyFala para o Buffer buscar. Branch reescrito a cada "
                                      f"publicação (scripts/publicar.py); vídeos saem {MIDIA_DIAS} dias depois de publicados.\n")
        for f in list(antigos.iterdir()) + list(mp4s):
            shutil.copy2(f, wt / f.name)
        _git("add", "-A", cwd=wt)
        _git("-c", "user.name=CapyFala", "-c", "user.email=capyfala@users.noreply.github.com",
             "commit", "-qm", f"midia {hoje.isoformat()}", cwd=wt)
        sha = _git("rev-parse", "HEAD", cwd=wt)
        _git("push", "-q", "-f", "origin", "HEAD:midia", cwd=wt)
    finally:
        _git("worktree", "remove", "--force", str(wt))
        subprocess.run(["git", "branch", "-D", "midia-novo"], cwd=GIT_ROOT, capture_output=True)
        shutil.rmtree(tmp, ignore_errors=True)
    urls = {}
    for m in mp4s:
        if m.stat().st_size <= JSDELIVR_MAX:
            urls[m.name] = f"https://cdn.jsdelivr.net/gh/{REPO}@{sha}/{m.name}"
        else:
            urls[m.name] = f"https://raw.githubusercontent.com/{REPO}/{sha}/{m.name}"
    return urls


# ---------------------------------------------------------------- montagem dos posts
def episodios() -> dict:
    """'T1 E01' -> JSON do episódio."""
    out = {}
    for f in sorted((ROOT / "episodes").glob("licao-*.json")):
        ep = json.loads(f.read_text())
        cod = (ep.get("serie") or {}).get("codigo")
        if cod:
            out[cod] = ep
    return out


def arquivo_video(ep: dict, p: dict) -> Path:
    if p["faixa"] == "esquete":
        return ROOT / "out" / f"{ep['id']}-esquete-{p.get('corte', 'A')}.mp4"
    return ROOT / "out" / f"{ep['id']}.mp4"


def textos(ep: dict, p: dict) -> dict:
    cod = ep["serie"]["codigo"]
    tags = " ".join(ep.get("hashtags") or ["#capyfala", "#inglês"])
    if p["rede"] == "tiktok" and "#capybara" not in tags:
        tags += " #capybara"
    ctx = ep.get("contexto") or {}
    if p["faixa"] == "episodio":
        titulo = f"{cod} · {ep['title']}"[:100]
        legenda = ctx.get("legenda") or ep.get("canDo") or ep["title"]
        texto = f"{titulo}\n\n{legenda}\n\n{tags}" if p["rede"] != "tiktok" else f"{cod} | {legenda.lower()} {tags}"
    else:
        esq = next((e for e in ep.get("esquetes") or [] if e.get("id") == p.get("corte")), {})
        cta = esq.get("cta") or f"aula completa no {cod.split()[-1].replace('E', 'EP ')}"
        gancho = esq.get("gancho") or ep.get("hookTitle") or ep["title"]
        titulo = f"{gancho} · {cod}"[:100]
        texto = f"{gancho.lower()} · {cta} {tags}"
    return {"titulo": titulo, "texto": texto[:2200]}


def metadata(rede: str, t: dict) -> dict:
    if rede == "youtube":
        return {"youtube": {"title": t["titulo"], "categoryId": "27", "madeForKids": False, "privacy": "public",
                            "notifySubscribers": True, "isAiGenerated": AI_LABEL["youtube"]}}
    if rede == "tiktok":
        return {"tiktok": {"isAiGenerated": AI_LABEL["tiktok"]}}
    return {"instagram": {"type": "reel", "shouldShareToFeed": True, "isAiGenerated": AI_LABEL["instagram"]}}


def para_fila(dia: str, p: dict, motivo: list[str], extra: dict) -> None:
    FILA.mkdir(exist_ok=True)
    nome = f"{dia}_{p['rede']}_{p['faixa']}_{p['episodio'].replace(' ', '')}{('-' + p['corte']) if p.get('corte') else ''}"
    (FILA / f"{nome}.json").write_text(json.dumps({**p, "data": dia, "motivo": motivo, **extra}, ensure_ascii=False, indent=2))
    print(f"  FILA {p['hora']} {p['rede']:9} {p['faixa']:8} {p['episodio']}: {'; '.join(motivo)}")


CAMPOS_PUB = ["data", "hora", "rede", "faixa", "episodio", "corte", "post_id", "url", "status", "arquivo", "midia_url"]


def registrar(dia: str, p: dict, post: dict, arquivo: str, midia_url: str) -> None:
    novo = not PUBLICADOS.exists() or not PUBLICADOS.read_text().strip()
    with PUBLICADOS.open("a", newline="") as f:
        w = csv.writer(f)
        if novo:
            w.writerow(CAMPOS_PUB)
        w.writerow([dia, p["hora"], p["rede"], p["faixa"], p["episodio"], p.get("corte", ""), post["id"], "",
                    post.get("status", "scheduled"), arquivo, midia_url])


def publicar_dia(dia: dt.date, dry: bool) -> int:
    grade = {g["data"]: g for g in json.loads(GRADE.read_text())["grade"]}
    if dia.isoformat() not in grade:
        print(f"{dia}: sem posts na grade (config/grade.json).")
        return 0
    eps = episodios()
    acesso, acesso_msg = acesso_ok()
    prontos = []  # (post da grade, mp4, entrada GraphQL)
    for p in grade[dia.isoformat()]["posts"]:
        if p["faixa"] == "longo":
            para_fila(dia.isoformat(), p, ["vídeo longo: sem render nem publicador ainda"], {})
            continue
        ep = eps.get(p["episodio"])
        if ep is None:
            para_fila(dia.isoformat(), p, [f"episódio {p['episodio']} não encontrado em episodes/"], {})
            continue
        mp4 = arquivo_video(ep, p)
        t = textos(ep, p)
        hh, mm = map(int, p["hora"].split(":"))
        due = dt.datetime(dia.year, dia.month, dia.day, hh, mm, tzinfo=BRT).astimezone(dt.timezone.utc)
        motivo = []
        if dia < INICIO:
            motivo.append(f"antes de {INICIO}")
        if not acesso:
            motivo.append(f"sem acesso ao Buffer ({acesso_msg})")
        if not mp4.exists():
            motivo.append(f"MP4 não renderizado ({mp4.relative_to(ROOT)})")
        portao = mp4.with_suffix(".portao.json")
        if not (portao.exists() and json.loads(portao.read_text()).get("aprovado") is True):
            motivo.append("portão não aprovou (rode scripts/portao.py)")
        cid = canal_id(p["rede"])
        if not cid:
            motivo.append(f"canal {p['rede']} não conectado no Buffer")
        if due <= dt.datetime.now(dt.timezone.utc):
            motivo.append("horário já passou")
        entrada = {"input": {"channelId": cid or "?", "text": t["texto"], "schedulingType": "automatic",
                             "mode": "customScheduled", "dueAt": due.isoformat().replace("+00:00", "Z"),
                             "aiAssisted": True, "metadata": metadata(p["rede"], t),
                             "assets": [{"video": {"url": "<url do branch midia>", "metadata": {"thumbnailOffset": 0}}}]}}
        if dry:
            print(f"\n[dry-run] {p['hora']} {p['rede']} {p['faixa']} {p['episodio']} -> {mp4.name}")
            print("  bloqueios: " + ("; ".join(motivo) or "nenhum"))
            print("  " + json.dumps(entrada, ensure_ascii=False)[:700])
            continue
        if motivo:
            para_fila(dia.isoformat(), p, motivo, {"titulo": t["titulo"], "texto": t["texto"]})
            continue
        prontos.append((p, mp4, entrada))
    if dry or not prontos:
        return 0
    urls = hospedar(sorted({m for _, m, _ in prontos}), dia)
    enviados = 0
    for p, mp4, entrada in prontos:
        entrada["input"]["assets"][0]["video"]["url"] = urls[mp4.name]
        r = gql(M_POST, entrada)["createPost"]
        if "post" not in r:
            para_fila(dia.isoformat(), p, [f"Buffer recusou: {r.get('message')}"], {"url": urls[mp4.name]})
            continue
        registrar(dia.isoformat(), p, r["post"], mp4.name, urls[mp4.name])
        enviados += 1
        print(f"  OK   {p['hora']} {p['rede']:9} {p['faixa']:8} {p['episodio']} -> post {r['post']['id']}")
    return enviados


M_DRAFT = """mutation P($input: CreatePostInput!) { createPost(input: $input) {
  ... on PostActionSuccess { post { id status assets { mimeType source thumbnail type } } }
  ... on MutationError { message } } }"""
M_DELETE = """mutation D($input: DeletePostInput!) { deletePost(input: $input) {
  ... on DeletePostSuccess { id } ... on VoidMutationError { message } } }"""


def teste_rascunho(mp4: Path) -> None:
    """Teste real sem publicar: hospeda o MP4, cria RASCUNHO no YouTube e no TikTok, mostra se o vídeo carregou, apaga."""
    url = hospedar([mp4], dt.datetime.now(BRT).date())[mp4.name]
    print(f"vídeo hospedado: {url}")
    for rede in ("youtube", "tiktok"):
        t = {"titulo": "TESTE rascunho CapyFala (apagar)", "texto": "TESTE rascunho CapyFala (apagar)"}
        meta = metadata(rede, t)
        if rede == "youtube":
            meta["youtube"]["privacy"] = "private"
        inp = {"channelId": canal_id(rede), "text": t["texto"], "schedulingType": "automatic", "mode": "addToQueue",
               "saveToDraft": True, "metadata": meta, "assets": [{"video": {"url": url}}]}
        r = gql(M_DRAFT, {"input": inp})["createPost"]
        if "post" not in r:
            print(f"{rede}: RECUSADO -> {r.get('message')}")
            continue
        post = r["post"]
        print(f"{rede}: rascunho {post['id']} status={post['status']} assets={json.dumps(post['assets'], ensure_ascii=False)}")
        d = gql(M_DELETE, {"input": {"id": post["id"]}})["deletePost"]
        print(f"{rede}: apagado -> {d}")


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--listar", action="store_true", help="só leitura: organizações e canais do Buffer")
    ap.add_argument("--data", help="AAAA-MM-DD (padrão: hoje em BRT)")
    ap.add_argument("--dry-run", action="store_true", help="mostra os posts do dia sem enviar nada")
    ap.add_argument("--teste-rascunho", metavar="MP4", help="teste real sem publicar: rascunho no Buffer + apaga")
    args = ap.parse_args()

    if (ROOT / "FREIO").exists():
        print("FREIO ativo (canal-idiomas/FREIO existe): nada publicado.")
        return
    if args.listar:
        ok, msg = acesso_ok()
        print(("OK: " if ok else "FALHOU: ") + msg)
        sys.exit(0 if ok else 1)
    dia = dt.date.fromisoformat(args.data) if args.data else dt.datetime.now(BRT).date()
    if args.teste_rascunho:
        teste_rascunho(Path(args.teste_rascunho).resolve())
        return
    n = publicar_dia(dia, args.dry_run)
    if not args.dry_run:
        print(f"{dia}: {n} post(s) agendado(s) no Buffer.")


if __name__ == "__main__":
    main()
