#!/usr/bin/env bash
# LONGO DO DIA em tela cheia 16:9 (YouTube, decisão do Felipe 28/10): sitcom + vocabulário + corte de episódio já
# publicado, com abertura, cartões e encerramento (composição DiaWide). ZERO voz nova: a sitcom e o corte usam
# scripts/tts_cache.py (só cache, rede bloqueada) e o vocabulário usa os cortes de public/audio/<tema.audio>/ (voz-cache).
# Saída: out/dia-<data>-wide.mp4 (H.264, yuv420p/tv/bt709, −14 LUFS, pico ≤ −1 dBTP), out/dia-<data>-wide.capitulos.txt,
#        out/dia-<data>-wide.miniatura.png (1280x720).
# Depois: scripts/portao.py --dia out/props-dia-<data>-wide.json --juiz <nota> e scripts/publicar.py --entregar-longo <data>.
# Uso: scripts/make-dia-wide.sh 2026-10-29 episodes/cafe-t1e01-hi-im-capy-v2.json vocab/halloween.json \
#        episodes/cafe-t1e01-hi-im-capy.json 13 17 "Hi! I'm Capy." "INGLÊS DO ZERO · T1 E01" "+ 9 palavras de Halloween" [--stills] [--no-video]
# SITCOM "-" = sem sitcom novo pra amanhã (publicados.csv sem episódio nesse dia): monta só vocabulário + corte.
set -euo pipefail
cd "$(dirname "$0")/.."
DATA="$1"; SITCOM="$2"; TEMA="$3"; CORTE="$4"; DE="$5"; ATE="$6"; FRASE="$7"; TAG="$8"; EXTRA="${9:-}"
shift 9 || shift $#
STILLS=0; VIDEO=1
for x in "$@"; do case "$x" in --stills) STILLS=1 ;; --no-video) VIDEO=0 ;; esac; done
ID="dia-$DATA-wide"
BROWSER=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
BROWSER_FLAG=$([ -x "$BROWSER" ] && echo "--browser-executable=$BROWSER" || true)
RENDER_FLAGS="--audio-bitrate=320k --crf=22 --pixel-format=yuv420p --color-space=bt709 $BROWSER_FLAG"
mkdir -p out

[ "$SITCOM" = "-" ] || .venv/bin/python scripts/tts_cache.py "$SITCOM"
.venv/bin/python scripts/tts_cache.py "$CORTE"
TID=$(node -e "console.log(require('./$TEMA').id)")
AUDIO=$(node -e "console.log(require('./$TEMA').audio)")
.venv/bin/python - "$TEMA" "$AUDIO" "out/props-$TID.json" <<'PY'
import json, sys
import numpy as np, pyloudnorm as pyln, soundfile as sf
tema, audio, out = sys.argv[1:]
clips = json.load(open(f"public/{audio}/clips.json"))
xs = [sf.read("public/" + c["audio"]) for c in clips.values()]  # falha aqui = falta voz no cache (não pede nada)
lufs = round(float(pyln.Meter(xs[0][1]).integrated_loudness(np.concatenate([x for x, _ in xs]))), 2)
json.dump({**json.load(open(tema)), "clips": clips, "voiceLufs": lufs}, open(out, "w"), ensure_ascii=False)
PY

DIA_JS=$(mktemp --suffix=.cjs)
trap 'rm -f "$DIA_JS"' EXIT
npx esbuild scripts/dia-wide.ts --bundle --platform=node --log-level=warning > "$DIA_JS"
node "$DIA_JS" montar "$DATA" "$SITCOM" "out/props-$TID.json" "$CORTE" "$DE" "$ATE" >/dev/null
node "$DIA_JS" capitulos "out/props-$ID.json" > "out/$ID.capitulos.txt"
cat "out/$ID.capitulos.txt"
node "$DIA_JS" pacote "out/props-$ID.json"
# roteiro linear do vocabulário (mesma agenda) para o portão
VF_JS=$(mktemp --suffix=.cjs)
npx esbuild scripts/vocab-frames.ts --bundle --platform=node --log-level=warning > "$VF_JS"
node "$VF_JS" "out/props-$TID.json" roteiro > "out/$TID.roteiro.json"; rm -f "$VF_JS"

node -e "require('fs').writeFileSync('out/props-$ID-miniatura.json', JSON.stringify({frase: process.argv[1], tag: process.argv[2], extra: process.argv[3] || undefined}))" "$FRASE" "$TAG" "$EXTRA"
npx remotion still src/index.ts MiniaturaWide "out/$ID.miniatura.png" --props="out/props-$ID-miniatura.json" $BROWSER_FLAG >/dev/null
echo "miniatura: out/$ID.miniatura.png"

if [ "$VIDEO" = 1 ]; then
  npx remotion render src/index.ts DiaWide "out/$ID.mp4" --props="out/props-$ID.json" $RENDER_FLAGS
  .venv/bin/python scripts/loudnorm.py "out/$ID.mp4"
  echo "vídeo: out/$ID.mp4 ($(npx remotion ffprobe -v error -show_entries format=duration -of csv=p=0 "out/$ID.mp4" 2>/dev/null | tail -1) s)"
fi
if [ "$STILLS" = 1 ]; then
  FRAMES=$(node "$DIA_JS" quadros "out/props-$ID.json")
  mkdir -p "out/$ID-stills"; rm -f "out/$ID-stills"/*.png
  node scripts/stills.mjs DiaWide "out/props-$ID.json" "out/$ID-stills" $FRAMES >/dev/null
  echo "stills: out/$ID-stills/ ($FRAMES)"
fi
