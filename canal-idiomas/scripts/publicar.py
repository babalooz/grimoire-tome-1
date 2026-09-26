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

Um post só é enviado se TUDO for verdade (docs/plano-de-acao.md §4):
  data >= 2026-10-12 · acesso ao Buffer OK (--listar) · MP4 existe · portão aprovou (out/<arquivo>.portao.json com "aprovado": true)
  · URL pública do vídeo (Cloudinary via CLOUDINARY_URL, ou --url-base) · canal da rede conectado no Buffer.
Se algo faltar, o post vai para fila/<data>_<rede>_<faixa>_<episodio>.json com o motivo. Arquivo FREIO existe = não faz nada.
Enviado com sucesso -> linha nova em publicados.csv.
"""
import argparse
import csv
import datetime as dt
import hashlib
import json
import os
import sys
import time
import urllib.error
import urllib.request
import uuid
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


# ---------------------------------------------------------------- hospedagem do vídeo (URL pública e estável)
def subir_cloudinary(mp4: Path) -> str:
    """Upload assinado para o Cloudinary (CLOUDINARY_URL=cloudinary://KEY:SECRET@CLOUD). URL de entrega pública."""
    cred = os.environ["CLOUDINARY_URL"].split("://", 1)[1]
    chave, resto = cred.split(":", 1)
    segredo, nuvem = resto.split("@", 1)
    public_id = f"capyfala/{mp4.stem}"
    ts = str(int(time.time()))
    assinatura = hashlib.sha1(f"overwrite=true&public_id={public_id}&timestamp={ts}{segredo}".encode()).hexdigest()
    campos = {"public_id": public_id, "timestamp": ts, "overwrite": "true", "api_key": chave, "signature": assinatura}
    limite = uuid.uuid4().hex
    corpo = b""
    for k, v in campos.items():
        corpo += f"--{limite}\r\nContent-Disposition: form-data; name=\"{k}\"\r\n\r\n{v}\r\n".encode()
    corpo += (f"--{limite}\r\nContent-Disposition: form-data; name=\"file\"; filename=\"{mp4.name}\"\r\n"
              "Content-Type: video/mp4\r\n\r\n").encode() + mp4.read_bytes() + f"\r\n--{limite}--\r\n".encode()
    req = urllib.request.Request(f"https://api.cloudinary.com/v1_1/{nuvem}/video/upload", data=corpo, method="POST",
                                 headers={"Content-Type": f"multipart/form-data; boundary={limite}"})
    with urllib.request.urlopen(req, timeout=300) as r:
        return json.loads(r.read())["secure_url"]


def url_publica(mp4: Path, url_base: str | None) -> str | None:
    if url_base:
        return url_base.rstrip("/") + "/" + mp4.name
    if os.environ.get("CLOUDINARY_URL"):
        return subir_cloudinary(mp4)
    return None


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


def registrar(dia: str, p: dict, post: dict) -> None:
    novo = not PUBLICADOS.exists()
    with PUBLICADOS.open("a", newline="") as f:
        w = csv.writer(f)
        if novo:
            w.writerow(["data", "hora", "rede", "faixa", "episodio", "corte", "post_id", "url", "status"])
        w.writerow([dia, p["hora"], p["rede"], p["faixa"], p["episodio"], p.get("corte", ""), post["id"], "",
                    post.get("status", "scheduled")])


def publicar_dia(dia: dt.date, dry: bool, url_base: str | None) -> int:
    grade = {g["data"]: g for g in json.loads(GRADE.read_text())["grade"]}
    if dia.isoformat() not in grade:
        print(f"{dia}: sem posts na grade (config/grade.json).")
        return 0
    eps = episodios()
    enviados = 0
    acesso, acesso_msg = acesso_ok()
    for p in grade[dia.isoformat()]["posts"]:
        if p["faixa"] == "longo":
            para_fila(dia.isoformat(), p, ["vídeo longo: sem render nem publicador ainda"], {})
            continue
        ep = eps.get(p["episodio"])
        motivo = []
        if ep is None:
            para_fila(dia.isoformat(), p, [f"episódio {p['episodio']} não encontrado em episodes/"], {})
            continue
        mp4 = arquivo_video(ep, p)
        t = textos(ep, p)
        hh, mm = map(int, p["hora"].split(":"))
        due = dt.datetime(dia.year, dia.month, dia.day, hh, mm, tzinfo=BRT).astimezone(dt.timezone.utc)
        if dia < INICIO:
            motivo.append(f"antes de {INICIO}")
        if not acesso:
            motivo.append(f"sem acesso ao Buffer ({acesso_msg})")
        if not mp4.exists():
            motivo.append(f"MP4 não renderizado ({mp4.relative_to(ROOT)})")
        portao = mp4.with_suffix(".portao.json")
        if not (portao.exists() and json.loads(portao.read_text()).get("aprovado") is True):
            motivo.append("portão não aprovou (scripts/portao.py ainda não existe)")
        cid = canal_id(p["rede"])
        if not cid:
            motivo.append(f"canal {p['rede']} não conectado/listado (rode --listar)")
        if due <= dt.datetime.now(dt.timezone.utc):
            motivo.append("horário já passou")
        if not os.environ.get("CLOUDINARY_URL") and not url_base:
            motivo.append("sem hospedagem pública do vídeo (CLOUDINARY_URL ou --url-base)")
        entrada = {"input": {"channelId": cid or "?", "text": t["texto"], "schedulingType": "automatic",
                             "mode": "customScheduled", "dueAt": due.isoformat().replace("+00:00", "Z"),
                             "aiAssisted": True, "metadata": metadata(p["rede"], t),
                             "assets": [{"video": {"url": "<url pública do mp4>", "metadata": {"thumbnailOffset": 0}}}]}}
        if dry:
            print(f"\n[dry-run] {p['hora']} {p['rede']} {p['faixa']} {p['episodio']} -> {mp4.name}")
            print("  bloqueios: " + ("; ".join(motivo) or "nenhum"))
            print("  " + json.dumps(entrada, ensure_ascii=False)[:700])
            continue
        if motivo:
            para_fila(dia.isoformat(), p, motivo, {"titulo": t["titulo"], "texto": t["texto"]})
            continue
        entrada["input"]["assets"][0]["video"]["url"] = url_publica(mp4, url_base)
        r = gql(M_POST, entrada)["createPost"]
        if "post" not in r:
            para_fila(dia.isoformat(), p, [f"Buffer recusou: {r.get('message')}"], {"titulo": t["titulo"]})
            continue
        registrar(dia.isoformat(), p, r["post"])
        enviados += 1
        print(f"  OK   {p['hora']} {p['rede']:9} {p['faixa']:8} {p['episodio']} -> post {r['post']['id']}")
    return enviados


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--listar", action="store_true", help="só leitura: organizações e canais do Buffer")
    ap.add_argument("--data", help="AAAA-MM-DD (padrão: hoje em BRT)")
    ap.add_argument("--dry-run", action="store_true", help="mostra os posts do dia sem enviar nada")
    ap.add_argument("--url-base", help="URL pública onde os MP4 já estão hospedados (alternativa ao Cloudinary)")
    args = ap.parse_args()

    if (ROOT / "FREIO").exists():
        print("FREIO ativo (canal-idiomas/FREIO existe): nada publicado.")
        return
    if args.listar:
        ok, msg = acesso_ok()
        print(("OK: " if ok else "FALHOU: ") + msg)
        sys.exit(0 if ok else 1)
    dia = dt.date.fromisoformat(args.data) if args.data else dt.datetime.now(BRT).date()
    n = publicar_dia(dia, args.dry_run, args.url_base)
    if not args.dry_run:
        print(f"{dia}: {n} post(s) agendado(s) no Buffer.")


if __name__ == "__main__":
    main()
