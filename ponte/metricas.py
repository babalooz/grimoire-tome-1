"""Coleta as métricas do canal CapyFala no YouTube e grava no branch ponte, para a nuvem aprender com elas.

Por que existe: sem número, nenhuma decisão de formato, horário ou tema passa de chute (29/10/2026).
Onde roda: no PC do Felipe, por tarefa agendada do Windows (a nuvem não guarda o token OAuth).

Saída (branch ponte):
  ponte/saida/metricas/youtube-videos.csv  — 1 linha por vídeo, valores acumulados desde a estreia
  ponte/saida/metricas/youtube-diario.csv  — 1 linha por dia e tipo (Shorts, longo), dos últimos 28 dias
O Analytics do YouTube atrasa 2 a 3 dias: o número de ontem ainda vai crescer.

Segredos (fora do repositório): ~/.capyfala/client_secret.json e ~/.capyfala/token_metricas.json
(só leitura; separado do token de upload para um não derrubar o outro). Nunca imprime nem copia esses arquivos.

Uso:
  python metricas.py --autorizar   # uma vez: o dono do canal permite a leitura no navegador
  python metricas.py               # coleta e publica (a tarefa agendada roda isto)
"""
import csv
import datetime as dt
import io
import subprocess
import sys
from pathlib import Path

CASA = Path.home() / ".capyfala"
CLIENTE = CASA / "client_secret.json"
TOKEN = CASA / "token_metricas.json"
REPO = Path(__file__).resolve().parent.parent
PASTA = REPO / "ponte" / "saida" / "metricas"
ESCOPOS = ["https://www.googleapis.com/auth/youtube.readonly",
           "https://www.googleapis.com/auth/yt-analytics.readonly"]
CANAL_ESPERADO = "UCXnc9jimA8PogcbNIcemMPw"  # CapyFala (@ACapyFala)
ESTREIA = "2026-09-26"
POR_VIDEO = ["views", "engagedViews", "estimatedMinutesWatched", "averageViewDuration",
             "averageViewPercentage", "subscribersGained", "likes", "shares", "comments"]


def git(*a):
    return subprocess.run(["git", "-C", str(REPO), *a], capture_output=True, text=True).stdout


def autorizar():
    from google_auth_oauthlib.flow import InstalledAppFlow
    if not CLIENTE.exists():
        sys.exit(f"falta o arquivo do cliente OAuth em {CLIENTE}")
    flow = InstalledAppFlow.from_client_secrets_file(str(CLIENTE), ESCOPOS)
    cred = flow.run_local_server(port=0, prompt="consent", access_type="offline")
    TOKEN.write_text(cred.to_json())
    canal = servicos(cred)[0].channels().list(part="snippet", mine=True).execute()["items"][0]
    print(f"autorizado no canal: {canal['snippet']['title']} ({canal['id']})")
    if canal["id"] != CANAL_ESPERADO:
        print("ATENÇÃO: não é o canal CapyFala. Rode de novo e escolha a conta/canal CapyFala.")


def credenciais():
    from google.auth.transport.requests import Request
    from google.oauth2.credentials import Credentials
    if not TOKEN.exists():
        sys.exit("sem token: rode `python metricas.py --autorizar` uma vez")
    cred = Credentials.from_authorized_user_file(str(TOKEN), ESCOPOS)
    if not cred.valid:
        cred.refresh(Request())
        TOKEN.write_text(cred.to_json())
    return cred


def servicos(cred):
    from googleapiclient.discovery import build
    return (build("youtube", "v3", credentials=cred, cache_discovery=False),
            build("youtubeAnalytics", "v2", credentials=cred, cache_discovery=False))


def videos_do_canal(yt):
    """Todos os vídeos do canal (inclusive privados/agendados): id, título, data, duração, privacidade."""
    uploads = yt.channels().list(part="contentDetails", mine=True).execute()[
        "items"][0]["contentDetails"]["relatedPlaylists"]["uploads"]
    ids, token = [], None
    while True:
        r = yt.playlistItems().list(part="contentDetails", playlistId=uploads, maxResults=50,
                                    pageToken=token).execute()
        ids += [i["contentDetails"]["videoId"] for i in r["items"]]
        token = r.get("nextPageToken")
        if not token:
            break
    info = {}
    for i in range(0, len(ids), 50):
        r = yt.videos().list(part="snippet,contentDetails,status,statistics", id=",".join(ids[i:i + 50])).execute()
        for v in r["items"]:
            info[v["id"]] = {
                "titulo": v["snippet"]["title"],
                "publicado": v["status"].get("publishAt") or v["snippet"]["publishedAt"],
                "privacidade": v["status"]["privacyStatus"],
                "duracao": v["contentDetails"]["duration"],
                "views_publico": v["statistics"].get("viewCount", ""),
            }
    return info


def relatorio(ya, **q):
    r = ya.reports().query(ids="channel==MINE", startDate=q.pop("inicio"), endDate=q.pop("fim"), **q).execute()
    nomes = [c["name"] for c in r.get("columnHeaders", [])]
    return [dict(zip(nomes, linha)) for linha in r.get("rows", [])]


def tabela(linhas, campos):
    buf = io.StringIO()
    w = csv.DictWriter(buf, fieldnames=campos, extrasaction="ignore", lineterminator="\n")
    w.writeheader()
    w.writerows(linhas)
    return buf.getvalue()


def main():
    if "--autorizar" in sys.argv:
        return autorizar()
    yt, ya = servicos(credenciais())
    hoje = dt.date.today()
    info = videos_do_canal(yt)
    por_video = {l["video"]: l for l in relatorio(
        ya, inicio=ESTREIA, fim=hoje.isoformat(), metrics=",".join(POR_VIDEO),
        dimensions="video", sort="-views", maxResults=200)}
    linhas = []
    for vid, i in sorted(info.items(), key=lambda x: x[1]["publicado"]):
        linhas.append({"coletado": hoje.isoformat(), "video": vid, **i, **{m: por_video.get(vid, {}).get(m, 0)
                                                                         for m in POR_VIDEO}})
    diario = relatorio(ya, inicio=(hoje - dt.timedelta(days=28)).isoformat(), fim=hoje.isoformat(),
                       metrics="views,engagedViews,estimatedMinutesWatched,subscribersGained,averageViewPercentage",
                       dimensions="day,creatorContentType", sort="day")

    git("fetch", "-q", "origin", "ponte")
    git("checkout", "-q", "ponte")
    git("rebase", "-q", "origin/ponte")
    PASTA.mkdir(parents=True, exist_ok=True)
    (PASTA / "youtube-videos.csv").write_text(tabela(linhas, ["coletado", "video", "titulo", "publicado",
                                                              "privacidade", "duracao", "views_publico", *POR_VIDEO]),
                                              encoding="utf-8")
    (PASTA / "youtube-diario.csv").write_text(tabela(diario, list(diario[0]) if diario else ["day"]),
                                              encoding="utf-8")
    git("add", str(PASTA))
    if not git("diff", "--cached", "--name-only").strip():
        print("métricas sem mudança")
        return
    git("commit", "-q", "-m", f"métricas YouTube {hoje}: {len(linhas)} vídeos")
    for _ in range(4):  # a nuvem também escreve no ponte: rebase e tenta de novo
        if subprocess.run(["git", "-C", str(REPO), "push", "-q", "origin", "ponte"]).returncode == 0:
            break
        git("fetch", "-q", "origin", "ponte"); git("rebase", "-q", "origin/ponte")
    total = sum(int(l["views"] or 0) for l in linhas)
    print(f"métricas publicadas: {len(linhas)} vídeos, {total} views no Analytics")


if __name__ == "__main__":
    main()
