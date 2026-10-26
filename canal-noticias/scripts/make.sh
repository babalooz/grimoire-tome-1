#!/usr/bin/env bash
# Episódio JSON -> narração (Kokoro) -> vídeo 9:16 (Remotion).
# Imagens: public/img/<id>/<n>.jpg (geradas por scripts/imagem.py). Faltando, a cena usa fundo provisório.
# Uso: scripts/make.sh episodios/001-dedos-enrugados.json
set -euo pipefail
cd "$(dirname "$0")/.."
EP="$1"
ID=$(node -e "console.log(require('./$EP').id)")
.venv/bin/python scripts/tts.py "$EP"
mkdir -p out
node -e "
const fs=require('fs'), ep=require('./$EP');
const timings=require('./public/audio/'+ep.id+'/timings.json');
const imagens=ep.cenas.map((_,i)=>fs.existsSync('public/img/'+ep.id+'/'+i+'.jpg')?'img/'+ep.id+'/'+i+'.jpg':null);
fs.writeFileSync('out/props.json', JSON.stringify({...ep, timings, imagens}));
"
npx remotion render src/index.ts Noticia "out/$ID.mp4" --props=out/props.json \
  --browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
echo "vídeo: out/$ID.mp4"
