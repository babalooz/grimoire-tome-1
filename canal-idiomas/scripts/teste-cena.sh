#!/usr/bin/env bash
# Teste do QUADRO DE CENA (src/vocab/cena.tsx) sem gastar voz: monta props com cortes FALSOS (duração pelo tamanho do
# texto, sem áudio) a partir de um tema com `cena` e renderiza um trecho curto + 1 still por palavra.
# Falha se a agenda não fechar, se algum still sair vazio ou se o render quebrar.
# Uso: bash scripts/teste-cena.sh [vocab/cumprimentos.json] [frames, padrão 0-149]
set -euo pipefail
cd "$(dirname "$0")/.."
TEMA="${1:-vocab/cumprimentos.json}"; FRAMES="${2:-0-149}"
mkdir -p out/teste-cena
node - "$TEMA" > out/teste-cena/props.json <<'JS'
const t = require(require("path").resolve(process.argv[2]));
const clips = {};
const add = (sp, lang, item, text) => {
  const fala = Math.max(0.35, text.length * (lang === "en" ? 0.07 : 0.055));
  clips[`${sp}|${lang}|${item}`] = { audio: "music/cafe-loop.wav", duration: fala + 0.12, onset: 0.04, fala, text };
};
const en = new Set([t.apresenta, t.revisao, t.final, ...(t.desafio?.vozes ?? []), ...t.blocos.flatMap((b) => b.ecos)]);
en.forEach((sp) => t.palavras.forEach((p, i) => add(sp, "en", `w${i}`, p.en)));
Object.entries(t.falas).forEach(([k, f]) => add(f.speaker, "pt", k, f.text));
t.palavras.forEach((p) => p.armadilha && add(t.dicas, "pt", p.armadilha.id, p.armadilha.dica));
console.log(JSON.stringify({ ...t, clips, voiceLufs: -20, semAudio: true, semTrilha: true }));
JS
FRAMES_JS=$(mktemp --suffix=.cjs); trap 'rm -f "$FRAMES_JS"' EXIT
npx esbuild scripts/vocab-frames.ts --bundle --platform=node --log-level=warning > "$FRAMES_JS"
node "$FRAMES_JS" out/teste-cena/props.json duracao
# 1 still por palavra: quadro em que a voz da Capy começa + 10 (cena montada, adesivo colado)
STILLS=$(node "$FRAMES_JS" out/teste-cena/props.json cenas)
BROWSER=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
BROWSER_FLAG=$([ -x "$BROWSER" ] && echo "--browser-executable=$BROWSER" || true)
rm -f out/teste-cena/*.png
node scripts/stills.mjs Vocab out/teste-cena/props.json out/teste-cena $STILLS >/dev/null
npx remotion render src/index.ts Vocab out/teste-cena/trecho.mp4 --props=out/teste-cena/props.json --frames="$FRAMES" \
  --pixel-format=yuv420p --color-space=bt709 $BROWSER_FLAG --log=error
.venv/bin/python - <<'PY'
from pathlib import Path
from PIL import Image, ImageStat
pngs = sorted(Path("out/teste-cena").glob("*.png"))
assert pngs, "nenhum still"
for p in pngs:
    st = ImageStat.Stat(Image.open(p).convert("L"))
    assert st.stddev[0] > 20, f"{p.name}: quadro sem conteúdo"
print(f"teste-cena OK: {len(pngs)} stills + trecho.mp4")
PY
