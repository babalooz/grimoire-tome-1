"""Teste SIMULADO de ponta a ponta (repositório git local no lugar do GitHub, YouTube falso, sem rede): longo aprovado ->
longo/<data>/ no branch midia -> sobrevive à reescrita de outra publicação -> ponte/subir_longo.py (o real, lido do branch
ponte) agenda com publishAt -> segunda rodada não repete. Não prova o agendamento no YouTube de verdade.
Uso: python scripts/teste_entregar_longo.py"""
import datetime as dt
import importlib.util
import json
import shutil
import subprocess
import sys
import tempfile
import types
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import publicar  # noqa: E402

REPO_REAL = publicar.GIT_ROOT
DIA = dt.date(2026, 10, 31)
PASTA = f"longo/{DIA}"
VIDEO, MINI = b"video-do-longo", b"png-do-longo"


def git(cwd: Path, *a: str) -> str:
    return subprocess.run(["git", "-c", "user.name=t", "-c", "user.email=t@t", *a], cwd=cwd, check=True,
                          capture_output=True, text=True).stdout.strip()


def arvore(clone: Path) -> set[str]:
    git(clone, "fetch", "-q", "origin", "+refs/heads/midia:refs/remotes/origin/midia")
    return set(git(clone, "ls-tree", "-r", "--name-only", "origin/midia").splitlines())


def recusa(trecho: str) -> None:
    try:
        publicar.entregar_longo(DIA)
    except SystemExit as e:
        assert trecho in str(e), e
    else:
        raise AssertionError(f"devia recusar: {trecho}")


class YouTubeFalso:
    def __init__(self):
        self.envios, self.miniaturas = [], []

    def channels(self):
        return types.SimpleNamespace(list=lambda **k: types.SimpleNamespace(
            execute=lambda: {"items": [{"id": self.canal}]}))

    def videos(self):
        def insert(part, body, media_body):
            self.envios.append((body, Path(media_body).read_bytes()))
            return types.SimpleNamespace(next_chunk=lambda: (None, {"id": f"falso{len(self.envios)}"}))
        return types.SimpleNamespace(insert=insert)

    def thumbnails(self):
        def set_(videoId, media_body):
            self.miniaturas.append((videoId, Path(media_body).read_bytes()))
            return types.SimpleNamespace(execute=lambda: None)
        return types.SimpleNamespace(set=set_)


def carregar_subir_longo(tmp: Path):
    """O script real roda no notebook e mora no branch ponte: testa ele, não uma cópia."""
    fonte = subprocess.run(["git", "show", "origin/ponte:ponte/subir_longo.py"], cwd=REPO_REAL, check=True,
                           capture_output=True).stdout
    (tmp / "subir_longo.py").write_bytes(fonte)
    spec = importlib.util.spec_from_file_location("subir_longo", tmp / "subir_longo.py")
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def main() -> None:
    tmp = Path(tempfile.mkdtemp(prefix="longo-"))
    remoto, clone, notebook, proj = tmp / "remoto.git", tmp / "clone", tmp / "notebook", tmp / "proj"
    git(tmp, "init", "-q", "--bare", str(remoto))
    git(tmp, "clone", "-q", str(remoto), str(clone))
    (clone / "main.txt").write_text("main")  # o main real nunca é vazio; hospedar() parte de uma árvore com arquivos
    git(clone, "add", "-A")
    git(clone, "commit", "-q", "-m", "main")
    git(clone, "push", "-q", "origin", "HEAD:refs/heads/main")
    # branch midia como está em produção + uma pasta vencida
    git(clone, "checkout", "-q", "--orphan", "m")
    (clone / "corte.mp4").write_bytes(b"corte")
    (clone / "longo" / "2026-10-20").mkdir(parents=True)
    (clone / "longo" / "2026-10-20" / "video.mp4").write_bytes(b"vencido")
    git(clone, "add", "-A")
    git(clone, "commit", "-qm", "midia")
    git(clone, "push", "-q", "origin", "HEAD:refs/heads/midia")
    git(clone, "checkout", "-q", "--detach", git(clone, "rev-parse", "origin/main"))
    git(clone, "branch", "-D", "m")

    (proj / "out").mkdir(parents=True)
    base = proj / "out" / f"dia-{DIA}-wide"
    base.with_suffix(".mp4").write_bytes(VIDEO)
    base.with_suffix(".miniatura.png").write_bytes(MINI)
    pac = {"titulo": "Aula 2 · Inglês do zero: olá", "descricao": "Capítulos\n00:00 a", "categoriaId": "27",
           "miniatura": "x", "arquivo": f"dia-{DIA}-wide.mp4", "capitulos": ["00:00 a"]}
    base.with_suffix(".youtube.json").write_text(json.dumps(pac, ensure_ascii=False), encoding="utf-8")
    portao = base.with_suffix(".portao.json")
    grade = {"grade": [{"data": DIA.isoformat(), "posts": [{"hora": "18:00", "rede": "youtube", "faixa": "longo", "episodio": "DIA"}]}]}
    (proj / "grade.json").write_text(json.dumps(grade))

    publicar.ROOT, publicar.GRADE, publicar.FILA = proj, proj / "grade.json", proj / "fila"
    publicar.PUBLICADOS = proj / "publicados.csv"
    publicar.GIT_ROOT = clone
    # trava: este teste faz force push; se o remoto não for o repositório temporário, para antes de tocar em qualquer coisa
    assert Path(publicar._git("remote", "get-url", "origin")).resolve() == remoto.resolve(), "origin não é o remoto de teste"
    publicar.acesso_ok = lambda: (True, "simulado")
    publicar.gql = lambda *a, **k: (_ for _ in ()).throw(AssertionError("NÃO pode chamar o Buffer"))
    agora = dt.datetime(2026, 10, 30, 19, 30, tzinfo=dt.timezone.utc)

    class DT(dt.datetime):
        @classmethod
        def now(cls, tz=None):
            return agora
    publicar.dt.datetime = DT

    # 1. portão: reprovado ou ausente não sobe nada
    antes = arvore(clone)
    recusa("faltam")
    portao.write_text(json.dumps({"aprovado": False}))
    recusa("portão não aprovou")
    portao.write_text(json.dumps({"aprovado": True}))
    limite, publicar.MIDIA_MAX = publicar.MIDIA_MAX, 1
    recusa("passa do limite")
    publicar.MIDIA_MAX = limite
    assert arvore(clone) == antes
    print("ok: reprovado, sem portão ou grande demais não toca no branch")

    # 2. aprovado chega ao branch; a pasta vencida é podada e o resto da raiz fica
    publicar.entregar_longo(DIA)
    t = arvore(clone)
    assert {f"{PASTA}/video.mp4", f"{PASTA}/miniatura.png", f"{PASTA}/pacote.json", "corte.mp4"} <= t, t
    assert "longo/2026-10-20/video.mp4" not in t, t
    print("ok: aprovado -> longo/<data>/ no midia; pasta vencida podada; corte da raiz preservado")

    # 3. outra publicação reescreve o branch: o longo continua, byte a byte
    outro = tmp / "short.mp4"
    outro.write_bytes(b"short")
    publicar.hospedar([outro], agora.date())
    t = arvore(clone)
    assert {f"{PASTA}/video.mp4", "short.mp4", "corte.mp4"} <= t, t
    blob = subprocess.run(["git", "show", f"origin/midia:{PASTA}/video.mp4"], cwd=clone, capture_output=True, check=True).stdout
    assert blob == VIDEO
    print("ok: reescrita de outra publicação não apaga o longo (bytes iguais)")

    # 4. sem rede: aborta em vez de reescrever o branch vazio
    url = git(clone, "remote", "get-url", "origin")
    git(clone, "remote", "set-url", "origin", str(tmp / "nao-existe.git"))
    for tentativa in (publicar.buscar_midia, lambda: publicar.hospedar([outro], agora.date())):  # buscar_midia direto: o push também falharia e esconderia a leitura errada
        try:
            tentativa()
        except subprocess.CalledProcessError:
            pass
        else:
            raise AssertionError("sem rede devia abortar")
    git(clone, "remote", "set-url", "origin", url)
    assert f"{PASTA}/video.mp4" in arvore(clone)
    print("ok: falha de rede aborta, branch intacto")

    # 5. entrega repetida não duplica; a grade reconhece e não cai na fila
    sha = git(clone, "rev-parse", "origin/midia")
    publicar.entregar_longo(DIA)
    assert git(clone, "rev-parse", "origin/midia") == sha
    assert publicar.publicar_dia(DIA, dry=False) == 0
    assert not (proj / "fila").exists()
    print("ok: entrega repetida não reescreve; longo entregue não cai na fila")

    # 6. o notebook: subir_longo real agenda, com título/miniatura certos, e não repete
    git(tmp, "clone", "-q", str(remoto), str(notebook))
    s = carregar_subir_longo(tmp)
    http = types.ModuleType("googleapiclient.http")
    http.MediaFileUpload = lambda caminho, **k: caminho
    sys.modules["googleapiclient"] = types.ModuleType("googleapiclient")
    sys.modules["googleapiclient.http"] = http
    yt = YouTubeFalso()
    yt.canal = s.CANAL_ESPERADO
    log = []
    s.REPO, s.FEITOS, s.FEITOS_SHORTS = notebook, tmp / "longos.json", tmp / "shorts.json"
    s.credenciais, s.servico, s.registrar = (lambda: None), (lambda c: yt), log.extend
    sys.argv = ["subir_longo.py"]
    s.main()
    assert len(yt.envios) == 1, yt.envios
    corpo, bytes_video = yt.envios[0]
    assert bytes_video == VIDEO
    assert corpo["snippet"]["title"] == pac["titulo"] and corpo["snippet"]["categoryId"] == "27"
    assert corpo["status"]["privacyStatus"] == "private"
    assert corpo["status"]["publishAt"] == "2026-10-31T21:00:00+00:00", corpo["status"]  # 18:00 em Brasília
    assert yt.miniaturas == [("falso1", MINI)]
    assert len(log) == 1 and "falso1" in log[0]
    s.main()
    assert len(yt.envios) == 1, "segunda rodada repetiu o envio"
    print(f"ok: notebook agendou ({corpo['status']['privacyStatus']}, publishAt {corpo['status']['publishAt']}), com miniatura; "
          "segunda rodada não repete")

    # 7. horário passado não entrega (o notebook publicaria na hora)
    agora = dt.datetime(2026, 10, 31, 22, 0, tzinfo=dt.timezone.utc)
    recusa("já passou")
    print("ok: horário já passado é recusado")
    shutil.rmtree(tmp, ignore_errors=True)


if __name__ == "__main__":
    main()
