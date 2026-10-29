"""Teste da camada 1c do portão (variedade de desfecho/abertura, YouTube answer/1311392). Sem voz, sem render, sem rede.
Uso: .venv/bin/python scripts/teste_variedade.py"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import portao


def ep(n: int, quem: str, hook: str, abre: str, temp: int = 2, **campos) -> dict:
    beats = [{"speaker": quem, "lang": "pt", "text": abre}, {"tipo": "pausa", "s": 3},
             {"speaker": quem, "lang": "en", "alvo": True, "text": "I'm fine."}]
    return {"id": f"cafe-t{temp}e{n:02d}", "format": "cafe", "serie": {"temporada": temp, "episodio": n},
            "hookTitle": hook, "beats": beats, **campos}


antes = [ep(n, "capi", f"gancho {n}", f"abertura {n}") for n in range(1, 5)]
assert portao.desfecho_de(antes[0])[:2] == ("capi", "consegue")
novo = ep(5, "capi", "gancho novo", "abertura nova")
assert any("(capi, consegue) já em 4" in f for f in portao.checar_variedade(novo, antes)), "4 de 10 iguais tem que reprovar"
assert not portao.checar_variedade(novo, antes[1:]), "3 de 10 iguais passa"
assert not portao.checar_variedade(ep(5, "hank", "gancho novo", "abertura nova"), antes), "outro_resolve passa"
assert not portao.checar_variedade({**novo, "resolve": "capi", "desfecho": "vira_piada"}, antes), "campo vence o texto"
assert any("gancho igual" in f for f in portao.checar_variedade(ep(5, "hank", "Gancho 2!", "x"), antes))
assert any("abertura (1ª fala) igual" in f for f in portao.checar_variedade(ep(5, "hank", "y", "abertura 3"), antes))
assert any("desfecho inválido" in f for f in portao.checar_variedade({**novo, "desfecho": "ganha"}, []))
assert not portao.checar_variedade(ep(1, "capi", "gancho 1", "abertura 1"), antes), "só compara com episódios ANTES"
treino = {**novo, "beats": [{"speaker": "capi", "lang": "en", "alvo": True, "repita": True, "text": "I'm fine."},
                            {"speaker": "duda", "lang": "en", "alvo": True, "text": "I'm fine."}]}
assert portao.desfecho_de(treino)[:2] == ("duda", "outro_resolve"), "fala do treino não é desfecho"
assert portao.checar_variedade({"format": "vocab"}, antes) == []
print("ok: variedade reprova 4/10 iguais, gancho e 1ª fala repetidos, desfecho inválido; campo vence texto; treino não conta")
