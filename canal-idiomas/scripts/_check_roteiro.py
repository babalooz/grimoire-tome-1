"""Checagem rápida de roteiro (camada 1b do portao.py) sem render nem TTS. Uso: .venv/bin/python scripts/_check_roteiro.py episodes/<ep>.json [...]"""
import sys, json
sys.path.insert(0, "scripts")
import portao

for path in sys.argv[1:]:
    ep = json.load(open(path))
    falhas = portao.checar_roteiro_cafe(ep)
    falas = [b for b in ep["beats"] if "text" in b and "lang" in b]
    en = sum(len(b["text"].split()) for b in falas if b["lang"] == "en")
    pt = sum(len(b["text"].split()) for b in falas if b["lang"] == "pt")
    tot = en + pt
    dur_min = ep.get("serie", {}).get("episodio")
    print(f"=== {path} (en {en}w pt {pt}w ratio {en/tot:.0%}) ===")
    for f in falhas:
        print("  -", f)
    if not falhas:
        print("  OK")
