"""Sobe os vídeos LONGOS do CapyFala (16:9) no YouTube pela API, sem ninguém clicar.

Por que existe: o Buffer não publica vídeo longo do YouTube (só Shorts); verificado em 28/10/2026.
Onde roda: no PC do Felipe, por tarefa agendada do Windows (a nuvem não guarda o token OAuth).

Entrada: branch `midia` do repo grimoire-tome-1, pasta longo/<AAAA-MM-DD>/ com
  video.mp4, miniatura.png e pacote.json {"titulo", "descricao", "publicar_em" (ISO com fuso), "categoria"}.
Saída: vídeo agendado no canal (privado com publishAt; vira público sozinho na hora marcada),
  linha em ponte/LONGOS.md (branch ponte) e registro local em ~/.capyfala/longos.json.

Segredos (fora do repositório): ~/.capyfala/client_secret.json (cliente OAuth "App para computador")
e ~/.capyfala/token.json (criado no `--autorizar`). Nunca imprime nem copia esses arquivos.

Uso:
  python subir_longo.py --autorizar      # uma vez: abre o navegador para o dono do canal permitir
  python subir_longo.py                  # sobe o que estiver pendente (a tarefa agendada roda isto)
  python subir_longo.py --simular        # mostra o que subiria, sem tocar no YouTube
"""
import datetime as dt
import json
import subprocess
import sys
import tempfile
from pathlib import Path

CASA = Path.home() / ".capyfala"
CLIENTE = CASA / "client_secret.json"
TOKEN = CASA / "token.json"
FEITOS = CASA / "longos.json"
REPO = Path(r"C:\Users\felip\.claude\grimoire-ponte")
ESCOPOS = ["https://www.googleapis.com/auth/youtube.upload", "https://www.googleapis.com/auth/youtube"]
CANAL_ESPERADO = "UCXnc9jimA8PogcbNIcemMPw"  # CapyFala (@ACapyFala)


def git(*a, binario=False):
    r = subprocess.run(["git", "-C", str(REPO), *a], capture_output=True, text=not binario)
    return r.stdout


def credenciais():
    from google.auth.transport.requests import Request
    from google.oauth2.credentials import Credentials
    if not TOKEN.exists():
        sys.exit("sem token: rode `python subir_longo.py --autorizar` uma vez")
    cred = Credentials.from_authorized_user_file(str(TOKEN), ESCOPOS)
    if not cred.valid:
        cred.refresh(Request())
        TOKEN.write_text(cred.to_json())
    return cred


def autorizar():
    from google_auth_oauthlib.flow import InstalledAppFlow
    if not CLIENTE.exists():
        sys.exit(f"falta o arquivo do cliente OAuth em {CLIENTE}")
    flow = InstalledAppFlow.from_client_secrets_file(str(CLIENTE), ESCOPOS)
    cred = flow.run_local_server(port=0, prompt="consent", access_type="offline")
    TOKEN.write_text(cred.to_json())
    yt = servico(cred)
    canal = yt.channels().list(part="snippet", mine=True).execute()["items"][0]
    print(f"autorizado no canal: {canal['snippet']['title']} ({canal['id']})")
    if canal["id"] != CANAL_ESPERADO:
        print("ATENÇÃO: não é o canal CapyFala. Rode de novo e escolha a conta/canal CapyFala.")


def servico(cred):
    from googleapiclient.discovery import build
    return build("youtube", "v3", credentials=cred, cache_discovery=False)


def pendentes():
    git("fetch", "-q", "origin", "midia", "ponte")
    nomes = git("ls-tree", "-r", "--name-only", "origin/midia", "longo/").split()
    feitos = json.loads(FEITOS.read_text()) if FEITOS.exists() else {}
    datas = sorted({n.split("/")[1] for n in nomes if n.count("/") == 2})
    return [d for d in datas if d not in feitos
            and {f"longo/{d}/video.mp4", f"longo/{d}/pacote.json"} <= set(nomes)], feitos


def subir(d, yt, tmp):
    from googleapiclient.http import MediaFileUpload
    pac = json.loads(git("show", f"origin/midia:longo/{d}/pacote.json"))
    mp4 = tmp / f"{d}.mp4"
    mp4.write_bytes(git("show", f"origin/midia:longo/{d}/video.mp4", binario=True))
    agora = dt.datetime.now(dt.timezone.utc)
    quando = dt.datetime.fromisoformat(pac["publicar_em"])
    status = {"selfDeclaredMadeForKids": False, "containsSyntheticMedia": True}
    if quando > agora + dt.timedelta(minutes=15):
        status |= {"privacyStatus": "private", "publishAt": quando.astimezone(dt.timezone.utc).isoformat()}
    else:
        status |= {"privacyStatus": "public"}
    corpo = {"snippet": {"title": pac["titulo"][:100], "description": pac["descricao"][:5000],
                         "categoryId": str(pac.get("categoria", "27")), "defaultLanguage": "pt-BR",
                         "defaultAudioLanguage": "pt-BR"},  # a aula explica em português; "en" ligava dublagem e legenda erradas
             "status": status}
    req = yt.videos().insert(part="snippet,status", body=corpo,
                             media_body=MediaFileUpload(str(mp4), chunksize=-1, resumable=True))
    resp = None
    while resp is None:
        _, resp = req.next_chunk()
    vid = resp["id"]
    nomes = git("ls-tree", "-r", "--name-only", "origin/midia", f"longo/{d}/").split()
    if f"longo/{d}/miniatura.png" in nomes:
        png = tmp / f"{d}.png"
        png.write_bytes(git("show", f"origin/midia:longo/{d}/miniatura.png", binario=True))
        try:
            yt.thumbnails().set(videoId=vid, media_body=MediaFileUpload(str(png))).execute()
        except Exception as e:  # miniatura personalizada exige canal verificado por telefone
            print(f"  miniatura não aplicada ({e.__class__.__name__}): {str(e)[:160]}")
    return vid, status.get("publishAt", "agora")


def registrar(linhas):
    log = REPO / "ponte" / "LONGOS.md"
    git("checkout", "-q", "ponte")
    git("fetch", "-q", "origin", "ponte"); git("rebase", "-q", "origin/ponte")
    texto = log.read_text(encoding="utf-8") if log.exists() else "# Longos do YouTube subidos pela API (PC)\n\n"
    log.write_text(texto + "".join(linhas), encoding="utf-8")
    git("add", str(log)); git("commit", "-q", "-m", "longos: subidos pela API do YouTube (PC)")
    for _ in range(4):
        if subprocess.run(["git", "-C", str(REPO), "push", "-q", "origin", "HEAD:ponte"]).returncode == 0:
            break
        git("fetch", "-q", "origin", "ponte"); git("rebase", "-q", "origin/ponte")


def main():
    if "--autorizar" in sys.argv:
        return autorizar()
    datas, feitos = pendentes()
    if not datas:
        print("nada pendente")
        return
    if "--simular" in sys.argv:
        for d in datas:
            print("subiria:", d, json.loads(git("show", f"origin/midia:longo/{d}/pacote.json"))["titulo"])
        return
    yt = servico(credenciais())
    linhas = []
    with tempfile.TemporaryDirectory() as t:
        for d in datas:
            try:
                vid, quando = subir(d, yt, Path(t))
            except Exception as e:
                print(f"LONGO FALHOU {d}: {e.__class__.__name__}: {str(e)[:200]}", flush=True)
                continue
            feitos[d] = {"video": vid, "publica": quando}
            FEITOS.write_text(json.dumps(feitos, indent=1))
            linhas.append(f"- {d} · https://youtu.be/{vid} · publica {quando}\n")
            print(f"subiu {d}: https://youtu.be/{vid} (publica {quando})")
    if linhas:
        registrar(linhas)


if __name__ == "__main__":
    main()
