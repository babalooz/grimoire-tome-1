"""Teste SIMULADO (não toca no Buffer nem na rede): faixa "longo" vai para a fila com o pacote do YouTube, e Short do
YouTube com mais de 3 min também cai na fila. Uso: .venv/bin/python scripts/teste_publicar_longo.py"""
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
    pac = {"titulo": "Inglês do zero: teste | CapyFala", "descricao": "00:00 a\n01:00 b\n02:00 c", "categoriaId": "27",
           "miniatura": "out/x.png", "arquivo": f"dia-{dia}-wide.mp4", "capitulos": ["00:00 a", "01:00 b", "02:00 c"]}
    (tmp / "out" / f"dia-{dia}-wide.youtube.json").write_text(json.dumps(pac))
    (tmp / "out" / f"dia-{dia}-wide.portao.json").write_text(json.dumps({"aprovado": True}))
    ep = {"id": "cafe-teste", "format": "cafe", "serie": {"codigo": "T9 E99"}, "title": "T9 E99 · teste", "canDo": "teste"}
    (tmp / "episodes" / "cafe-teste.json").write_text(json.dumps(ep))
    (tmp / "out" / "cafe-teste.mp4").write_bytes(b"x")
    (tmp / "out" / "cafe-teste.portao.json").write_text(json.dumps({"aprovado": True}))
    grade = {"grade": [{"data": dia.isoformat(), "posts": [
        {"hora": "18:00", "rede": "youtube", "faixa": "longo", "episodio": "DIA"},
        {"hora": "23:59", "rede": "youtube", "faixa": "episodio", "episodio": "T9 E99"}]}]}
    (tmp / "grade.json").write_text(json.dumps(grade))
    publicar.ROOT, publicar.GRADE, publicar.FILA = tmp, tmp / "grade.json", tmp / "fila"
    publicar.INICIO = dt.date(2026, 1, 1)
    publicar.acesso_ok = lambda: (True, "simulado")
    publicar.canal_id = lambda rede: "canal-simulado"
    publicar.duracao = lambda mp4: 200.0  # "Short" de 3:20
    publicar.gql = lambda *a, **k: (_ for _ in ()).throw(AssertionError("NÃO pode chamar o Buffer"))
    publicar.hospedar = lambda *a, **k: (_ for _ in ()).throw(AssertionError("NÃO pode subir mídia"))
    agora = dt.datetime(2026, 10, 29, 10, 0, tzinfo=dt.timezone.utc)

    class DT(dt.datetime):
        @classmethod
        def now(cls, tz=None):
            return agora
    publicar.dt.datetime = DT
    n = publicar.publicar_dia(dia, dry=False)
    assert n == 0, n
    fila = {f.name: json.loads(f.read_text()) for f in (tmp / "fila").glob("*.json")}
    longo = next(v for k, v in fila.items() if "_longo_" in k)
    assert longo["pacote"]["categoriaId"] == "27" and longo["pacote"]["portao_aprovado"] is True
    assert publicar.BUFFER_SEM_LONGO in longo["motivo"][0]
    short = next(v for k, v in fila.items() if "_episodio_" in k)
    assert any("Short com 200 s" in m for m in short["motivo"]), short["motivo"]
    print("ok: longo -> fila com pacote (sem Buffer); Short > 3 min -> fila; 0 chamadas ao Buffer")


if __name__ == "__main__":
    main()
