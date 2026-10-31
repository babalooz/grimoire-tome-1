#!/usr/bin/env bash
# AULA LONGA 16:9 (YouTube, 8 a 12 min): as partes de aulas/<slug>.json viram um vídeo só na composição DiaWide.
# Voz: scripts/tts.py pede só o que não está no cache. Saída: out/aula-<slug>.mp4 (H.264, yuv420p/tv/bt709, −14 LUFS),
# out/aula-<slug>.capitulos.txt, out/aula-<slug>.miniatura.png e, acima de 95 MB (limite por arquivo do GitHub é 100 MB),
# out/aula-<slug>.mp4.part-* para o ramo midia (juntar com cat).
# Depois: scripts/portao.py --dia out/props-aula-<slug>.json --juiz <nota>. Nunca sobe nem publica.
# Uso: scripts/make-aula-wide.sh <slug> [--max-pedidos N] [--no-video]
set -euo pipefail
cd "$(dirname "$0")/.."
SLUG="$1"; shift
MAX=60; VIDEO=1
while [ $# -gt 0 ]; do case "$1" in --max-pedidos) MAX="$2"; shift ;; --no-video) VIDEO=0 ;; esac; shift; done
AULA="aulas/$SLUG.json"; ID="aula-$SLUG"
BROWSER=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
BROWSER_FLAG=$([ -x "$BROWSER" ] && echo "--browser-executable=$BROWSER" || true)
mkdir -p out

for EP in $(node -e "require('./$AULA').partes.forEach(x=>console.log(x.ep))"); do
  .venv/bin/python scripts/tts.py "$EP" --motor gemini --max-pedidos "$MAX"
done

JS=$(mktemp --suffix=.cjs)
trap 'rm -f "$JS"' EXIT
npx esbuild scripts/aula-wide.ts --bundle --platform=node --log-level=warning > "$JS"
node "$JS" montar "$AULA" >/dev/null
node "$JS" capitulos "out/props-$ID.json" > "out/$ID.capitulos.txt"
cat "out/$ID.capitulos.txt"
node "$JS" pacote "$AULA" "out/props-$ID.json"
node -e "const a=require('./$AULA');require('fs').writeFileSync('out/props-$ID-miniatura.json',JSON.stringify(a.miniatura))"
npx remotion still src/index.ts MiniaturaWide "out/$ID.miniatura.png" --props="out/props-$ID-miniatura.json" $BROWSER_FLAG >/dev/null

if [ "$VIDEO" = 1 ]; then
  npx remotion render src/index.ts DiaWide "out/$ID.mp4" --props="out/props-$ID.json" --audio-bitrate=320k --crf=22 --pixel-format=yuv420p --color-space=bt709 $BROWSER_FLAG
  .venv/bin/python scripts/loudnorm.py "out/$ID.mp4"
  rm -f "out/$ID.mp4.part-"*
  [ "$(stat -c %s "out/$ID.mp4")" -le 95000000 ] || split -b 90M "out/$ID.mp4" "out/$ID.mp4.part-"
  ls -l "out/$ID.mp4"*
fi
