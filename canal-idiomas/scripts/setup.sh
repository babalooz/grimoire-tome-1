#!/usr/bin/env bash
# Instala tudo do zero (Remotion + Kokoro TTS (Apache-2.0, voz feminina PT/EN)).
set -euo pipefail
cd "$(dirname "$0")/.."
npm install
python3 -m venv .venv && .venv/bin/pip install -q kokoro-onnx soundfile anthropic
mkdir -p voices out
for f in kokoro-v1.0.onnx voices-v1.0.bin; do [ -f "voices/$f" ] || curl -sSL -o "voices/$f" "https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/$f"; done
for v in; do
  n=$(basename "$v")
  for ext in onnx onnx.json; do
    [ -f "voices/$n.$ext" ] || curl -sSL -o "voices/$n.$ext" "https://huggingface.co/rhasspy/piper-voices/resolve/main/$v.$ext"
  done
done
echo "setup ok"
