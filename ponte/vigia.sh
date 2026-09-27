#!/bin/sh
# Vigia da ponte: a cada 60s busca o GitHub e imprime UMA linha quando a nuvem
# muda ponte/PEDIDOS.md, ponte/AVISOS.md (branch ponte) ou docs/tarefas-*.md (main).
# Silêncio = nada novo (zero token).
W="/c/Users/felip/.claude/grimoire-ponte"
sig() {
  a=$(git -C "$W" rev-parse -q --verify origin/ponte:ponte/PEDIDOS.md 2>/dev/null)
  v=$(git -C "$W" rev-parse -q --verify origin/ponte:ponte/AVISOS.md 2>/dev/null)
  b=$(git -C "$W" ls-tree origin/main docs/ 2>/dev/null | grep 'tarefas-' | awk '{print $3}' | tr '\n' ' ')
  echo "$a|$v|$b"
}
git -C "$W" fetch -q origin ponte main 2>/dev/null
last=$(sig)
while true; do
  sleep 60
  git -C "$W" fetch -q origin ponte main 2>/dev/null || continue
  now=$(sig)
  if [ "$now" != "$last" ]; then
    echo "PONTE: novidade da nuvem $(date '+%H:%M') — ler origin/ponte:ponte/AVISOS.md, PEDIDOS.md e docs/tarefas-*.md"
    last="$now"
  fi
done
