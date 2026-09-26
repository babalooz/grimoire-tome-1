#!/usr/bin/env bash
# Formato "LIÇÃO EM VÍDEO" (CapyFala): JSON -> vozes por personagem (Kokoro) -> vídeo 9:16 (Remotion, composição Licao)
# com trilha CC0 gerada (public/music/cafe-loop.wav, ducking por frame) -> master -14 LUFS / <= -1 dBTP (scripts/loudnorm.py).
# Uso: scripts/make-licao.sh episodes/licao-s01e01-can-i-get.json [--stills] [--no-video]
#   --stills    também gera 8 quadros-chave em out/<id>-stills/ (a partir da agenda de src/lesson/timeline.ts)
#   --no-video  pula o render do MP4 (útil para iterar só nos stills)
set -euo pipefail
cd "$(dirname "$0")/.."
EP="$1"; shift
STILLS=0; VIDEO=1
for a in "$@"; do
  case "$a" in --stills) STILLS=1 ;; --no-video) VIDEO=0 ;; esac
done
ID=$(node -e "console.log(require('./$EP').id)")
BROWSER=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
BROWSER_FLAG=$([ -x "$BROWSER" ] && echo "--browser-executable=$BROWSER" || true)

.venv/bin/python scripts/tts.py "$EP"
[ -f public/music/cafe-loop.wav ] || .venv/bin/python scripts/music.py
mkdir -p out
node -e "
const ep=require('./$EP');
const timings=require('./public/audio/'+ep.id+'/timings.json');
const mix=require('./public/audio/'+ep.id+'/mix.json');
require('fs').writeFileSync('out/props-$ID.json', JSON.stringify({...ep, timings, ...mix}));
"

if [ "$VIDEO" = 1 ]; then
  npx remotion render src/index.ts Licao "out/$ID.mp4" --props="out/props-$ID.json" $BROWSER_FLAG
  .venv/bin/python scripts/loudnorm.py "out/$ID.mp4"
  echo "vídeo: out/$ID.mp4"
fi

if [ "$STILLS" = 1 ]; then
  mkdir -p "out/$ID-stills"
  rm -f "out/$ID-stills"/*.png
  # quadros-chave calculados pela MESMA agenda da composição (sem duplicar a conta aqui)
  FRAMES=$(npx esbuild scripts/licao-frames.ts --bundle --platform=node --log-level=warning | node - "out/props-$ID.json")
  n=1
  for f in $FRAMES; do
    npx remotion still src/index.ts Licao "out/$ID-stills/$n-f$f.png" --frame="$f" --props="out/props-$ID.json" $BROWSER_FLAG >/dev/null
    n=$((n+1))
  done
  echo "stills: out/$ID-stills/ ($FRAMES)"
fi
