#!/usr/bin/env bash
# Episódio sitcom ("Capi no Exterior") JSON -> vozes por personagem (Kokoro) -> vídeo 9:16 (Remotion, composição Sitcom).
# Uso: scripts/make-sitcom.sh episodes/s01e01-can-i-get.json [--stills]
#   --stills  também gera 6 quadros-chave em out/<id>-stills/ (gancho, Hank, pânico, quiz/timer, revelação, caderninho)
set -euo pipefail
cd "$(dirname "$0")/.."
EP="$1"
ID=$(node -e "console.log(require('./$EP').id)")
BROWSER=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
BROWSER_FLAG=$([ -x "$BROWSER" ] && echo "--browser-executable=$BROWSER" || true)

.venv/bin/python scripts/tts.py "$EP"
mkdir -p out
node -e "
const ep=require('./$EP');
const timings=require('./public/audio/'+ep.id+'/timings.json');
require('fs').writeFileSync('out/props-$ID.json', JSON.stringify({...ep, timings}));
"
npx remotion render src/index.ts Sitcom "out/$ID.mp4" --props="out/props-$ID.json" $BROWSER_FLAG
echo "vídeo: out/$ID.mp4"

if [ "${2:-}" = "--stills" ]; then
  mkdir -p "out/$ID-stills"
  # mesma agenda de src/Sitcom.tsx (schedule): áudio + timer do último 'ask' + pausa 0,1 s + hold
  FRAMES=$(node -e "
const p=require('./out/props-$ID.json'), fps=30;
const lastAsk=p.beats.map(b=>b.quiz).lastIndexOf('ask');
let from=0; const s=p.beats.map((b,i)=>{const a=Math.ceil(p.timings[i].duration*fps);
  const tm=(i===lastAsk&&p.quiz)?p.quiz.timerSeconds*fps:0; const d=a+tm+Math.ceil(0.1*fps)+Math.ceil((b.hold||0)*fps);
  const r={from,a,tm,d}; from+=d; return r;});
const at=(pred)=>p.beats.findIndex(pred);
const hankQ=at(b=>b.speaker==='hank'&&b.emotion==='eyebrow'), panic=at(b=>b.mode==='pensamento'&&b.emotion==='panic');
const rev=at(b=>b.quiz==='reveal'), card=at(b=>b.card);
console.log([0, s[hankQ].from+14, s[panic].from+30, s[lastAsk].from+s[lastAsk].a+40, s[rev].from+24, s[card].from+s[card].d-2].join(' '));
")
  n=1
  for f in $FRAMES; do
    npx remotion still src/index.ts Sitcom "out/$ID-stills/$n-f$f.png" --frame="$f" --props="out/props-$ID.json" $BROWSER_FLAG >/dev/null
    n=$((n+1))
  done
  echo "stills: out/$ID-stills/"
fi
