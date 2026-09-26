#!/usr/bin/env bash
# Formato "LIÇÃO EM VÍDEO" (CapyFala): JSON -> vozes por personagem (Kokoro) -> vídeo 9:16 (Remotion, composição Licao)
# com trilha CC0 gerada (public/music/cafe-loop.wav, ducking por frame) -> master -14 LUFS / <= -1 dBTP (scripts/loudnorm.py).
# Faixa ESQUETE (Teste Duas faixas): cada item de `esquetes` vira out/<id>-esquete-<X>.mp4 (composição LicaoEsquete,
# mesmo áudio/render do episódio, 5–20 s), com a mesma masterização.
# Uso: scripts/make-licao.sh episodes/licao-s01e01-hi-hello.json [--stills] [--no-video] [--no-esquetes] [--esquete=A]
#   --stills       também gera quadros-chave em out/<id>-stills/ (a partir da agenda de src/lesson/timeline.ts)
#                  e da(s) esquete(s) em out/<id>-esquete-<X>-stills/
#   --no-video     pula o render dos MP4 (útil para iterar só nos stills)
#   --no-esquetes  só o episódio
#   --esquete=A    só essa esquete (repetível)
set -euo pipefail
cd "$(dirname "$0")/.."
EP="$1"; shift
STILLS=0; VIDEO=1; ESQ=1; ONLY=()
for a in "$@"; do
  case "$a" in
    --stills) STILLS=1 ;;
    --no-video) VIDEO=0 ;;
    --no-esquetes) ESQ=0 ;;
    --esquete=*) ONLY+=("${a#--esquete=}") ;;
  esac
done
ID=$(node -e "console.log(require('./$EP').id)")
BROWSER=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
BROWSER_FLAG=$([ -x "$BROWSER" ] && echo "--browser-executable=$BROWSER" || true)
TIKTOK_MIN=61 # TikTok Creator Rewards: episódio precisa de >= 1 min (61 s de folga)

.venv/bin/python scripts/tts.py "$EP"
[ -f public/music/cafe-loop.wav ] || .venv/bin/python scripts/music.py
mkdir -p out
node -e "
const ep=require('./$EP');
const timings=require('./public/audio/'+ep.id+'/timings.json');
const mix=require('./public/audio/'+ep.id+'/mix.json');
require('fs').writeFileSync('out/props-$ID.json', JSON.stringify({...ep, timings, ...mix}));
"

# agenda (mesma conta da composição): durações do episódio e das esquetes; falha aqui se uma esquete sair de 5–20 s
FRAMES_JS=$(mktemp --suffix=.cjs)
trap 'rm -f "$FRAMES_JS"' EXIT
npx esbuild scripts/licao-frames.ts --bundle --platform=node --log-level=warning > "$FRAMES_JS"
node "$FRAMES_JS" "out/props-$ID.json" duracoes

ESQUETES=()
if [ "$ESQ" = 1 ]; then
  if [ ${#ONLY[@]} -gt 0 ]; then ESQUETES=("${ONLY[@]}")
  else mapfile -t ESQUETES < <(node -e "(require('./$EP').esquetes||[]).forEach(e=>console.log(e.id))"); fi
fi
for X in "${ESQUETES[@]}"; do
  node -e "const p=require('./out/props-$ID.json'); require('fs').writeFileSync('out/props-$ID-esquete-$X.json', JSON.stringify({...p, esquete:'$X'}))"
done

duration() { npx remotion ffprobe -v error -show_entries format=duration -of csv=p=0 "$1" 2>/dev/null | tail -1; }

if [ "$VIDEO" = 1 ]; then
  npx remotion render src/index.ts Licao "out/$ID.mp4" --props="out/props-$ID.json" --audio-bitrate=320k $BROWSER_FLAG
  .venv/bin/python scripts/loudnorm.py "out/$ID.mp4"
  D=$(duration "out/$ID.mp4")
  echo "vídeo: out/$ID.mp4 (${D} s)"
  if awk -v d="$D" -v m="$TIKTOK_MIN" 'BEGIN{exit !(d < m)}'; then
    echo "AVISO: episódio com ${D} s < ${TIKTOK_MIN} s — no TikTok fica fora do Creator Rewards (precisa de >= 1 min). Alongue a volta ou a revisão." >&2
  fi
  for X in "${ESQUETES[@]}"; do
    OUT="out/$ID-esquete-$X.mp4"
    npx remotion render src/index.ts LicaoEsquete "$OUT" --props="out/props-$ID-esquete-$X.json" --audio-bitrate=320k $BROWSER_FLAG
    .venv/bin/python scripts/loudnorm.py "$OUT"
    D=$(duration "$OUT")
    echo "esquete $X: $OUT (${D} s)"
    if awk -v d="$D" 'BEGIN{exit !(d < 5 || d > 20)}'; then echo "AVISO: esquete $X com ${D} s fora da faixa 5–20 s" >&2; fi
  done
fi

if [ "$STILLS" = 1 ]; then
  mkdir -p "out/$ID-stills"
  rm -f "out/$ID-stills"/*.png
  # quadros-chave calculados pela MESMA agenda da composição (sem duplicar a conta aqui); 1 bundle para todos
  FRAMES=$(node "$FRAMES_JS" "out/props-$ID.json")
  node scripts/stills.mjs Licao "out/props-$ID.json" "out/$ID-stills" $FRAMES >/dev/null
  echo "stills: out/$ID-stills/ ($FRAMES)"
  for X in "${ESQUETES[@]}"; do
    mkdir -p "out/$ID-esquete-$X-stills"
    rm -f "out/$ID-esquete-$X-stills"/*.png
    FRAMES=$(node "$FRAMES_JS" "out/props-$ID-esquete-$X.json" esquete "$X")
    node scripts/stills.mjs LicaoEsquete "out/props-$ID-esquete-$X.json" "out/$ID-esquete-$X-stills" $FRAMES >/dev/null
    echo "stills esquete $X: out/$ID-esquete-$X-stills/ ($FRAMES)"
  done
fi
