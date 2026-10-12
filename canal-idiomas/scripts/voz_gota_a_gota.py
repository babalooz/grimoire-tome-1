"""Rotina gota a gota: gera, sem gastar além da cota diária grátis, as falas que faltam de um grupo de episódios
formato "cafe" no motor Gemini TTS. Reaproveita o cache por hash (scripts/tts.py); para no primeiro 429 e não
insiste. Uso: .venv/bin/python scripts/voz_gota_a_gota.py
  --episodios <json...>  : lista de episódios (default = protótipo assunto 1)
  --modelo <nome>         : modelo Gemini TTS (default = tts.GEMINI_MODEL_CAFE, gemini-3.8-flash-lite-tts)
  --cache-dir <pasta>     : pasta de cache, relativa a este repo (default = tts.GEMINI_CACHE)
  --resumo <arquivo.json> : onde salvar o resumo (default = voz-gota-resumo.json)
Cada combinação (episódios + modelo + cache-dir) tem cota própria no Gemini: um outro roteiro/modelo nunca
reaproveita nem gasta a cota deste aqui, porque o hash da fala já inclui o modelo (scripts/tts.py:_gemini_key).
"""
import argparse
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


def falas_do_episodio(ep_path: str, model: str) -> list[dict]:
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
        key = tts._gemini_key(speaker, lang, "fala", speed, texto, voice, model)
        falas.append({"episodio": ep_path, "beat": i, "speaker": speaker, "lang": lang, "speed": speed,
                       "texto": texto, "key": key})
    return falas


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--episodios", nargs="+", default=EPISODIOS)
    ap.add_argument("--modelo", default=tts.GEMINI_MODEL_CAFE)
    ap.add_argument("--cache-dir", default=None, help="pasta de cache relativa a este repo (default = GEMINI_CACHE)")
    ap.add_argument("--resumo", default="voz-gota-resumo.json", help="arquivo de resumo (relativo a este repo)")
    a = ap.parse_args()

    cache_dir = (ROOT / a.cache_dir) if a.cache_dir else tts.GEMINI_CACHE

    todas: list[dict] = []
    for ep in a.episodios:
        todas += falas_do_episodio(ep, a.modelo)

    tinha_audio_antes = cache_dir.exists() and any(cache_dir.glob("*.wav"))
    cache_dir.mkdir(parents=True, exist_ok=True)
    for f in todas:
        f["pronta"] = (cache_dir / f"{f['key']}.wav").exists()

    total_unico = len({f["key"] for f in todas})
    prontas_antes = len({f["key"] for f in todas if f["pronta"]})

    # ordem: Capy primeiro (prioridade dela), depois o resto; preserva a ordem V1->V2->V3 dentro de cada grupo
    pendentes = [f for f in todas if not f["pronta"]]
    pendentes.sort(key=lambda f: 0 if f["speaker"] == "capi" else 1)

    novas_hoje = 0
    parou_em_cota = None
    primeira_fala_capy = None
    vistas: set[str] = set()

    # 1ª rodada (pasta ainda vazia): mede a 1ª fala da Capy isolada, pra comparar com a voz já aprovada.
    if not tinha_audio_antes and pendentes:
        alvo_inicial = next((f for f in pendentes if f["speaker"] == "capi" and f["lang"] == "en"),
                             next((f for f in pendentes if f["speaker"] == "capi"), pendentes[0]))
        print(f"-- (1ª rodada) medindo fala isolada: {alvo_inicial['texto']!r}")
        try:
            audio, sr = tts.synth_gemini(alvo_inicial["texto"], alvo_inicial["lang"], alvo_inicial["speaker"],
                                          alvo_inicial["speed"], model=a.modelo, cache_dir=cache_dir)
            novas_hoje += 1
            vistas.add(alvo_inicial["key"])
            dur = len(audio) / sr
            palavras = len(tts.WORD.findall(alvo_inicial["texto"]))
            wpm = round(palavras / dur * 60) if dur > 0 else 0
            primeira_fala_capy = {"episodio": alvo_inicial["episodio"], "speaker": alvo_inicial["speaker"],
                                   "lang": alvo_inicial["lang"], "texto": alvo_inicial["texto"],
                                   "duracao_s": round(dur, 2), "wpm": wpm}
            print(f"   duração {dur:.2f}s · {wpm} palavras/min")
        except tts.GeminiQuotaError as e:
            parou_em_cota = str(e)

    for f in pendentes:
        if parou_em_cota:
            break
        if f["key"] in vistas:
            continue  # já coberta por uma fala igual mais acima na fila (mesmo hash)
        vistas.add(f["key"])
        if (cache_dir / f"{f['key']}.wav").exists():
            continue  # outra fala da fila gerou o mesmo hash nesta mesma rodada
        print(f"-- gerando {f['episodio']} beat {f['beat']} ({f['speaker']}/{f['lang']}): {f['texto']!r}")
        try:
            tts.synth_gemini(f["texto"], f["lang"], f["speaker"], f["speed"], model=a.modelo, cache_dir=cache_dir)
            novas_hoje += 1
        except tts.GeminiQuotaError as e:
            parou_em_cota = str(e)
            break

    prontas_agora = len({f["key"] for f in todas if (cache_dir / f"{f['key']}.wav").exists()})
    resumo = {
        "modelo": a.modelo,
        "cache_dir": str(cache_dir.relative_to(ROOT)),
        "total_falas_unicas": total_unico,
        "prontas_antes_de_hoje": prontas_antes,
        "novas_hoje": novas_hoje,
        "prontas_agora": prontas_agora,
        "faltam": total_unico - prontas_agora,
        "parou_em_cota": parou_em_cota,
        "primeira_fala_capy": primeira_fala_capy,
    }
    print(json.dumps(resumo, ensure_ascii=False, indent=2))
    (ROOT / a.resumo).write_text(json.dumps(resumo, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
