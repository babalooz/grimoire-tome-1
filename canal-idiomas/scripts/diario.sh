#!/usr/bin/env bash
# Pipeline diário: radar -> roteiro (Claude, 2 passadas) -> narração -> vídeo.
# Uso: scripts/diario.sh [quadro]
set -euo pipefail
cd "$(dirname "$0")/.."
python3 scripts/radar.py
BEFORE=$(ls episodes/*.json | sort)
.venv/bin/python scripts/roteirista.py ${1:+--quadro "$1"}
NEW=$(comm -13 <(echo "$BEFORE") <(ls episodes/*.json | sort) | tail -1)
scripts/make.sh "$NEW"
