#!/usr/bin/env bash
# Episódio JSON -> narração (Piper) -> vídeo 9:16 com legenda (Remotion).
# Uso: scripts/make.sh episodes/001-looking-forward.json
set -euo pipefail
cd "$(dirname "$0")/.."
EP="$1"
ID=$(node -e "console.log(require('./$EP').id)")

.venv/bin/python scripts/tts.py "$EP"
node -e "
const ep=require('./$EP');
const timings=require('./public/audio/'+ep.id+'/timings.json');
require('fs').writeFileSync('out/props.json', JSON.stringify({format: ep.format, scenes: ep.scenes, timings}));
"
npx remotion render src/index.ts Episode "out/$ID.mp4" --props=out/props.json \
  --browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
echo "vídeo: out/$ID.mp4"
