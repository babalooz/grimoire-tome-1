"""Timings da Sitcom do Café SÓ com a voz que já está no cache (zero pedido ao TTS).

Para re-render (ex.: versão horizontal 16:9, composição CafeWide): procura cada fala no cache por hash
(tts._gemini_key), tentando os modelos/pastas na ordem abaixo, e escreve public/audio/<id>/c<n>.wav + timings.json
+ mix.json exatamente como o tts.py. Se UMA fala não estiver no cache, para com código 2 e lista o que falta
(nunca chama a API: a rede fica bloqueada dentro deste script).

Uso: .venv/bin/python scripts/tts_cache.py episodes/cafe-t1e01-hi-im-capy-v2.json
"""
import json
import sys
from pathlib import Path

import numpy as np
import soundfile as sf

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "scripts"))
import teste_voz  # noqa: E402
import tts  # noqa: E402

# assunto 1 foi gravado com o flash-lite (antes de 28/10); assunto 2 com o flash-tts em pasta própria
BUSCA = [
    ("gemini-3.8-flash-lite-tts", tts.GEMINI_CACHE),
    ("gemini-3.8-flash-tts", tts.GEMINI_CACHE),
    ("gemini-3.8-flash-tts", ROOT / "public/audio/flash-tts/assunto2"),
]


class FaltaNoCache(RuntimeError):
    pass


def _sem_rede(*_a, **_k):
    raise FaltaNoCache("tts_cache.py não pede voz nova")


def synth_cache(text: str, lang: str, speaker: str, speed: float, **_k):
    speaker = tts.ALIAS.get(speaker, speaker)
    voice = tts.GEMINI_VOICE.get(speaker, tts.GEMINI_VOICE["capi"])
    for model, pasta in BUSCA:
        f = pasta / f"{tts._gemini_key(speaker, lang, 'fala', speed, text, voice, model)}.wav"
        if f.exists():
            return sf.read(f, dtype="float32")
    raise FaltaNoCache(f"{speaker}/{lang}: {text!r}")


def main(ep_path: str) -> int:
    teste_voz.http = _sem_rede
    tts.synth_gemini = synth_cache
    tts.LOTE = False  # o lote (tts_lote.preencher) só confere o cache no modelo ATUAL (GEMINI_MODEL_CAFE),
    # ignorando o fallback multi-modelo do BUSCA acima; em episódios gravados num modelo antigo (ex.: assunto 1,
    # flash-lite-tts, antes do padrão virar flash-tts em 28/10) ele julga tudo "faltando" e pede rede sem necessidade.
    # Sem lote, cada fala passa por synth_cache (BUSCA completo) e só falta de verdade vira FaltaNoCache.
    episode = json.loads(Path(ep_path).read_text())
    out_dir = ROOT / "public/audio" / episode["id"]
    out_dir.mkdir(parents=True, exist_ok=True)
    try:
        timings = tts.render_cafe(episode, out_dir, engine="gemini")
    except FaltaNoCache as e:
        print(f"FALTA NO CACHE ({episode['id']}): {e}", file=sys.stderr)
        return 2
    (out_dir / "timings.json").write_text(json.dumps(timings, ensure_ascii=False, indent=2))
    import pyloudnorm as pyln
    voice = np.concatenate([sf.read(ROOT / "public" / t["audio"])[0] for t in timings if t])
    lufs = round(float(pyln.Meter(tts.SR).integrated_loudness(voice)), 2)
    (out_dir / "mix.json").write_text(json.dumps({"voiceLufs": lufs}))
    print(f"ok (só cache, 0 pedidos): {sum(1 for t in timings if t)} falas, voz {lufs} LUFS -> {out_dir}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1]))
