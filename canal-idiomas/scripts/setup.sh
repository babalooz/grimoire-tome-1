#!/usr/bin/env bash
# Instala tudo do zero (Remotion + Piper TTS + vozes PT/EN).
set -euo pipefail
cd "$(dirname "$0")/.."
npm install
python3 -m venv .venv && .venv/bin/pip install -q piper-tts anthropic
mkdir -p voices out
for v in pt/pt_BR/faber/medium/pt_BR-faber-medium en/en_US/lessac/medium/en_US-lessac-medium; do
  n=$(basename "$v")
  for ext in onnx onnx.json; do
    [ -f "voices/$n.$ext" ] || curl -sSL -o "voices/$n.$ext" "https://huggingface.co/rhasspy/piper-voices/resolve/main/$v.$ext"
  done
done
echo "setup ok"
