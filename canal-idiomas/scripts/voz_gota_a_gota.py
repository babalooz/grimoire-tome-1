"""Rotina gota a gota: gera, sem gastar além da cota diária grátis, as falas que faltam do protótipo do
assunto 1 (3 episódios formato "cafe") no motor Gemini TTS. Reaproveita o cache por hash (scripts/tts.py);
para no primeiro 429 e não insiste. Uso: .venv/bin/python scripts/voz_gota_a_gota.py
"""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "scripts"))

import tts  # noqa: E402

EPISODIOS = [
    "episodes/cafe-t1e01-hi-im-capy.json",
    "episodes/cafe-t1e01-hi-im-capy-v2.json",
    "episodes/cafe-t1e01-hi-im-capy-v3.json",
]


def falas_do_episodio(ep_path: str) -> list[dict]:
    """Reproduz a mesma conta de render_cafe (tts.py) pra cada beat: speaker/lang/speed/texto final
    mandado ao Gemini, sem sintetizar nada ainda."""
    episode = json.loads((ROOT / ep_path).read_text())
    alvo = episode.get("alvo") or {}
    beats = episode["beats"]
    first = next((i for i, b in enumerate(beats) if b.get("alvo") is True), -1)
    falas = []
    for i, b in enumerate(beats):
        if b.get("tipo") in ("pausa", "pergunta") or "text" not in b:
            continue
        speaker = tts.ALIAS.get(b.get("speaker", "capi"), b.get("speaker", "capi"))
        lang, mode = b["lang"], b.get("mode", "fala")
        speed = b.get("speed")
        if speed is None:
            speed = tts.CAFE_SPEED.get((speaker, lang), 1.0) * (tts.CAFE_THOUGHT if mode == "pensamento" else 1.0)
        pieces = tts._cafe_pieces(b, i == first, alvo.get("nucleo"))
        texto = " ".join(p.rstrip(" ,") + ("..." if j < len(pieces) - 1 and not p.rstrip().endswith("...") else "")
                         for j, p in enumerate(pieces))
        voice = tts.GEMINI_VOICE.get(speaker, tts.GEMINI_VOICE["capi"])
        key = tts._gemini_key(speaker, lang, "fala", speed, texto, voice)
        falas.append({"episodio": ep_path, "beat": i, "speaker": speaker, "lang": lang, "speed": speed,
                       "texto": texto, "key": key})
    return falas


def main() -> None:
    todas: list[dict] = []
    for ep in EPISODIOS:
        todas += falas_do_episodio(ep)

    tts.GEMINI_CACHE.mkdir(parents=True, exist_ok=True)
    for f in todas:
        f["pronta"] = (tts.GEMINI_CACHE / f"{f['key']}.wav").exists()

    total_unico = len({f["key"] for f in todas})
    prontas_antes = len({f["key"] for f in todas if f["pronta"]})

    # ordem: Capy primeiro (prioridade dela), depois o resto; preserva a ordem V1->V2->V3 dentro de cada grupo
    pendentes = [f for f in todas if not f["pronta"]]
    pendentes.sort(key=lambda f: 0 if f["speaker"] == "capi" else 1)

    novas_hoje = 0
    parou_em_cota = None
    vistas: set[str] = set()
    for f in pendentes:
        if f["key"] in vistas:
            continue  # já coberta por uma fala igual mais acima na fila (mesmo hash)
        vistas.add(f["key"])
        if (tts.GEMINI_CACHE / f"{f['key']}.wav").exists():
            continue  # outra fala da fila gerou o mesmo hash nesta mesma rodada
        print(f"-- gerando {f['episodio']} beat {f['beat']} ({f['speaker']}/{f['lang']}): {f['texto']!r}")
        try:
            tts.synth_gemini(f["texto"], f["lang"], f["speaker"], f["speed"])
            novas_hoje += 1
        except tts.GeminiQuotaError as e:
            parou_em_cota = str(e)
            break

    prontas_agora = len({f["key"] for f in todas if (tts.GEMINI_CACHE / f"{f['key']}.wav").exists()})
    resumo = {
        "total_falas_unicas": total_unico,
        "prontas_antes_de_hoje": prontas_antes,
        "novas_hoje": novas_hoje,
        "prontas_agora": prontas_agora,
        "faltam": total_unico - prontas_agora,
        "parou_em_cota": parou_em_cota,
    }
    print(json.dumps(resumo, ensure_ascii=False, indent=2))
    (ROOT / "voz-gota-resumo.json").write_text(json.dumps(resumo, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
