#!/usr/bin/env bash
# SÉRIE DE VOCABULÁRIO: tema JSON (vocab/<tema>.json, `format: "vocab"`) -> voz Gemini por pacote (scripts/tts_vocab.py,
# cache em public/<tema.audio>/, branch voz-cache) -> vídeo 9:16 (Remotion, composição Vocab) com a trilha do tema e
# ducking (−22 dB sob a voz, zero na pausa "sua vez" e no desafio) -> master −14 LUFS / ≤ −1 dBTP (scripts/loudnorm.py).
# Mesmas flags de cor/qualidade do make-cafe.sh (o portão exige yuv420p/tv/bt709).
# Uso: scripts/make-vocab.sh vocab/numeros-1a10.json [--stills] [--no-video] [--no-tts]
#   --no-tts  usa só o áudio que já está no cache (não pede nada ao Gemini)
set -euo pipefail
cd "$(dirname "$0")/.."
TEMA="$1"; shift
STILLS=0; VIDEO=1; TTS=1
while [ $# -gt 0 ]; do
  case "$1" in
    --stills) STILLS=1 ;;
    --no-video) VIDEO=0 ;;
    --no-tts) TTS=0 ;;
  esac
  shift
done
ID=$(node -e "console.log(require('./$TEMA').id)")
AUDIO=$(node -e "console.log(require('./$TEMA').audio)")
BROWSER=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
BROWSER_FLAG=$([ -x "$BROWSER" ] && echo "--browser-executable=$BROWSER" || true)
RENDER_FLAGS="--audio-bitrate=320k --crf=26 --pixel-format=yuv420p --color-space=bt709 $BROWSER_FLAG"

if [ "$TTS" = 1 ]; then .venv/bin/python scripts/tts_vocab.py "$TEMA"; else .venv/bin/python scripts/tts_vocab.py "$TEMA" --so-cortar --sem-ouvido; fi
mkdir -p out
# loudness da voz (referência da trilha) = todos os cortes usados, juntos
VOICE_LUFS=$(.venv/bin/python - "$AUDIO" <<'PY'
import json, sys
import numpy as np, pyloudnorm as pyln, soundfile as sf
d = "public/" + sys.argv[1]
clips = json.load(open(d + "/clips.json"))
xs = [sf.read("public/" + c["audio"]) for c in clips.values()]
print(round(float(pyln.Meter(xs[0][1]).integrated_loudness(np.concatenate([x for x, _ in xs]))), 2))
PY
)
node -e "
const t=require('./$TEMA'); const clips=require('./public/$AUDIO/clips.json');
require('fs').writeFileSync('out/props-$ID.json', JSON.stringify({...t, clips, voiceLufs: $VOICE_LUFS}));
"
FRAMES_JS=$(mktemp --suffix=.cjs)
trap 'rm -f "$FRAMES_JS"' EXIT
npx esbuild scripts/vocab-frames.ts --bundle --platform=node --log-level=warning > "$FRAMES_JS"
node "$FRAMES_JS" "out/props-$ID.json" roteiro > "out/$ID.roteiro.json"
node "$FRAMES_JS" "out/props-$ID.json" checar || echo "AVISO: regra do formato falhou (ver acima); o portão reprova" >&2

duration() { npx remotion ffprobe -v error -show_entries format=duration -of csv=p=0 "$1" 2>/dev/null | tail -1; }
if [ "$VIDEO" = 1 ]; then
  npx remotion render src/index.ts Vocab "out/$ID.mp4" --props="out/props-$ID.json" $RENDER_FLAGS
  .venv/bin/python scripts/loudnorm.py "out/$ID.mp4"
  echo "vídeo: out/$ID.mp4 ($(duration "out/$ID.mp4") s, voz $VOICE_LUFS LUFS)"
fi
if [ "$STILLS" = 1 ]; then
  FRAMES=$(node "$FRAMES_JS" "out/props-$ID.json")
  mkdir -p "out/$ID-stills"; rm -f "out/$ID-stills"/*.png
  node scripts/stills.mjs Vocab "out/props-$ID.json" "out/$ID-stills" $FRAMES >/dev/null
  echo "stills: out/$ID-stills/ ($FRAMES)"
fi
