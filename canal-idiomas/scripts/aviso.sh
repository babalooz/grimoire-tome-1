#!/usr/bin/env bash
# Acrescenta 1 linha em ponte/AVISOS.md no branch 'ponte' e faz push (o PC vigia a cada 60 s).
# Uso: bash canal-idiomas/scripts/aviso.sh "o que terminou" "resultado" "próximo passo"
set -euo pipefail
GIT_ROOT=$(git -C "$(dirname "$0")" rev-parse --show-toplevel)
WT=$(mktemp -d)/ponte
LINHA="- $(date -u +%Y-%m-%dT%H:%MZ) · $1 · $2 · $3"
for i in 1 2 3 4; do
  git -C "$GIT_ROOT" fetch -q origin ponte
  git -C "$GIT_ROOT" worktree add -q --detach "$WT" origin/ponte
  echo "$LINHA" >> "$WT/ponte/AVISOS.md"
  git -C "$WT" add ponte/AVISOS.md
  git -C "$WT" -c user.name="Claude (nuvem)" -c user.email=noreply@anthropic.com commit -qm "aviso: $1"
  if git -C "$WT" push -q origin HEAD:ponte; then ok=1; else ok=0; fi
  git -C "$GIT_ROOT" worktree remove --force "$WT"
  [ "$ok" = 1 ] && { echo "aviso enviado: $LINHA"; exit 0; }
  sleep $((2 ** i))
done
echo "falhou ao enviar aviso" >&2; exit 1
