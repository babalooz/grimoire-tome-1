"""Teste SIMULADO (não toca no Buffer nem na rede): na grade, TikTok vai ao Buffer e YouTube vira pacote yt-*.json no
branch midia, com o mesmo título e horário, sem post_id. Uso: python scripts/teste_publicar_youtube.py"""
import csv
import datetime as dt
import json
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import publicar  # noqa: E402


def main() -> None:
    tmp = Path(tempfile.mkdtemp())
    dia = dt.date(2026, 10, 29)
    (tmp / "out").mkdir()
    (tmp / "episodes").mkdir()
    ep = {"id": "cafe-teste", "format": "cafe", "serie": {"codigo": "T9 E99"}, "title": "T9 E99 · olá", "canDo": "dizer olá"}
    (tmp / "episodes" / "cafe-teste.json").write_text(json.dumps(ep), encoding="utf-8")
    (tmp / "out" / "cafe-teste.mp4").write_bytes(b"x")
    (tmp / "out" / "cafe-teste.portao.json").write_text(json.dumps({"aprovado": True}))
    grade = {"grade": [{"data": dia.isoformat(), "posts": [
        {"hora": "18:00", "rede": "youtube", "faixa": "episodio", "episodio": "T9 E99"},
        {"hora": "19:00", "rede": "tiktok", "faixa": "episodio", "episodio": "T9 E99"}]}]}
    (tmp / "grade.json").write_text(json.dumps(grade))
    publicar.ROOT, publicar.GRADE, publicar.FILA = tmp, tmp / "grade.json", tmp / "fila"
    publicar.PUBLICADOS = tmp / "publicados.csv"
    publicar.INICIO = dt.date(2026, 1, 1)
    publicar.acesso_ok = lambda: (True, "simulado")
    publicar.canal_id = lambda rede: {"tiktok": "canal-tt"}[rede]
    publicar.duracao = lambda mp4: 40.0
    buffer, subidos = [], {}

    def gql(_q, v):
        buffer.append(v["input"]["channelId"])
        return {"createPost": {"post": {"id": "post-tt", "status": "scheduled"}}}

    def hospedar(arqs, _hoje):
        subidos.update({a.name: a.read_bytes() for a in arqs if a.suffix == ".json"})
        return {a.name: f"https://x/{a.name}" for a in arqs}

    publicar.gql, publicar.hospedar = gql, hospedar
    agora = dt.datetime(2026, 10, 29, 10, 0, tzinfo=dt.timezone.utc)

    class DT(dt.datetime):
        @classmethod
        def now(cls, tz=None):
            return agora
    publicar.dt.datetime = DT
    n = publicar.publicar_dia(dia, dry=False)
    assert n == 2, n
    assert buffer == ["canal-tt"], buffer
    nome, cru = next(iter(subidos.items()))
    assert nome.startswith("yt-2026-10-29-1800-") and publicar.pacote_yt_vivo(nome, dia)
    assert not publicar.pacote_yt_vivo(nome, dia + dt.timedelta(days=publicar.MIDIA_DIAS))
    pac = json.loads(cru.decode("utf-8"))
    assert pac["arquivo"] == "cafe-teste.mp4" and pac["titulo"] and pac["ia"] is False
    assert dt.datetime.fromisoformat(pac["publicar_em"]) == dt.datetime(2026, 10, 29, 21, 0, tzinfo=dt.timezone.utc)
    linhas = {r["rede"]: r for r in csv.DictReader(publicar.PUBLICADOS.open())}
    assert linhas["youtube"]["post_id"] == "" and linhas["tiktok"]["post_id"] == "post-tt"
    print("ok: TikTok -> Buffer; YouTube -> pacote no midia, sem post_id; pacote expira junto com o vídeo")


if __name__ == "__main__":
    main()
