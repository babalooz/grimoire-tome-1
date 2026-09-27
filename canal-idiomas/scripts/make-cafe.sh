#!/usr/bin/env bash
# Formato "SITCOM DO CAFÉ" (CapyFala, passivo): JSON `format: "cafe"` -> vozes por beat (Kokoro, scripts/tts.py)
# -> vídeo 9:16 (Remotion, composição Cafe) com trilha CC0 e ducking (−22 dB sob a voz, zero na pergunta/repita/alvo)
# -> master −14 LUFS / ≤ −1 dBTP (scripts/loudnorm.py). Cada item de `esquetes` vira out/<id>-esquete-<X>.mp4
# (composição CafeEsquete: beats de..ate + card "aula completa no EP N" de 2 s), com a mesma masterização.
# Mesmas flags de cor/qualidade do make-licao.sh (o portão exige yuv420p/tv/bt709).
# Uso: scripts/make-cafe.sh episodes/cafe-t1e01-can-i-get.json [--stills] [--auditoria] [--no-video] [--no-esquetes] [--no-tts]
#   --stills     quadros-chave em out/<id>-stills/ e out/<id>-esquete-<X>-stills/ (agenda de src/cafe/timeline.ts)
#   --auditoria  os mesmos quadros no modo auditoria (fundo preto, só interface) em out/<id>-auditoria/
#   --no-video   pula o render dos MP4 · --no-esquetes só o episódio · --no-tts reaproveita o áudio já gerado
set -euo pipefail
cd "$(dirname "$0")/.."
EP="$1"; shift
STILLS=0; AUDIT=0; VIDEO=1; ESQ=1; TTS=1
for a in "$@"; do
  case "$a" in
    --stills) STILLS=1 ;;
    --auditoria) AUDIT=1 ;;
    --no-video) VIDEO=0 ;;
    --no-esquetes) ESQ=0 ;;
    --no-tts) TTS=0 ;;
  esac
done
ID=$(node -e "console.log(require('./$EP').id)")
BROWSER=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
BROWSER_FLAG=$([ -x "$BROWSER" ] && echo "--browser-executable=$BROWSER" || true)
RENDER_FLAGS="--audio-bitrate=320k --crf=26 --pixel-format=yuv420p --color-space=bt709 $BROWSER_FLAG"

[ "$TTS" = 1 ] && .venv/bin/python scripts/tts.py "$EP"
[ -f public/music/cafe-loop.wav ] || .venv/bin/python scripts/music.py
mkdir -p out
node -e "
const ep=require('./$EP');
const timings=require('./public/audio/'+ep.id+'/timings.json');
const mix=require('./public/audio/'+ep.id+'/mix.json');
require('fs').writeFileSync('out/props-$ID.json', JSON.stringify({...ep, timings, ...mix}));
"

# agenda (mesma conta da composição): durações, ritmo da frase-alvo e plano de câmera (1,5–3 s por plano)
FRAMES_JS=$(mktemp --suffix=.cjs)
trap 'rm -f "$FRAMES_JS"' EXIT
npx esbuild scripts/cafe-frames.ts --bundle --platform=node --log-level=warning > "$FRAMES_JS"
node "$FRAMES_JS" "out/props-$ID.json" duracoes
node "$FRAMES_JS" "out/props-$ID.json" ritmo
node "$FRAMES_JS" "out/props-$ID.json" camera || echo "AVISO: plano de câmera fora de 1,5–3 s (ver acima)" >&2

ESQUETES=()
[ "$ESQ" = 1 ] && mapfile -t ESQUETES < <(node -e "(require('./$EP').esquetes||[]).forEach(e=>console.log(e.id))")
for X in "${ESQUETES[@]}"; do
  node -e "const p=require('./out/props-$ID.json'); require('fs').writeFileSync('out/props-$ID-esquete-$X.json', JSON.stringify({...p, esquete:'$X'}))"
done

duration() { npx remotion ffprobe -v error -show_entries format=duration -of csv=p=0 "$1" 2>/dev/null | tail -1; }

if [ "$VIDEO" = 1 ]; then
  npx remotion render src/index.ts Cafe "out/$ID.mp4" --props="out/props-$ID.json" $RENDER_FLAGS
  .venv/bin/python scripts/loudnorm.py "out/$ID.mp4"
  echo "vídeo: out/$ID.mp4 ($(duration "out/$ID.mp4") s)"
  for X in "${ESQUETES[@]}"; do
    OUT="out/$ID-esquete-$X.mp4"
    npx remotion render src/index.ts CafeEsquete "$OUT" --props="out/props-$ID-esquete-$X.json" $RENDER_FLAGS
    .venv/bin/python scripts/loudnorm.py "$OUT"
    echo "esquete $X: $OUT ($(duration "$OUT") s)"
  done
fi

if [ "$STILLS" = 1 ] || [ "$AUDIT" = 1 ]; then
  FRAMES=$(node "$FRAMES_JS" "out/props-$ID.json")
  if [ "$STILLS" = 1 ]; then
    mkdir -p "out/$ID-stills"; rm -f "out/$ID-stills"/*.png
    node scripts/stills.mjs Cafe "out/props-$ID.json" "out/$ID-stills" $FRAMES >/dev/null
    echo "stills: out/$ID-stills/ ($FRAMES)"
  fi
  if [ "$AUDIT" = 1 ]; then
    mkdir -p "out/$ID-auditoria"; rm -f "out/$ID-auditoria"/*.png
    node -e "const p=require('./out/props-$ID.json'); require('fs').writeFileSync('out/props-$ID-auditoria.json', JSON.stringify({...p, auditoria:true}))"
    node scripts/stills.mjs Cafe "out/props-$ID-auditoria.json" "out/$ID-auditoria" $FRAMES >/dev/null
    echo "auditoria: out/$ID-auditoria/ ($FRAMES)"
  fi
  for X in "${ESQUETES[@]}"; do
    [ "$STILLS" = 1 ] || continue
    mkdir -p "out/$ID-esquete-$X-stills"; rm -f "out/$ID-esquete-$X-stills"/*.png
    FRAMES=$(node "$FRAMES_JS" "out/props-$ID-esquete-$X.json" esquete "$X")
    node scripts/stills.mjs CafeEsquete "out/props-$ID-esquete-$X.json" "out/$ID-esquete-$X-stills" $FRAMES >/dev/null
    echo "stills esquete $X: out/$ID-esquete-$X-stills/ ($FRAMES)"
  done
fi
