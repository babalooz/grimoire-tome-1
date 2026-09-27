#!/bin/sh
# Vigia da ponte (a cada 60 s):
#  - vídeo novo no branch midia -> roda auditar.py em silêncio; só imprime se REPROVAR
#  - mudança em ponte/PEDIDOS.md ou ponte/AVISOS.md -> imprime 1 linha (acorda o Claude local)
# Silêncio = nada que exija ação (zero token).
W="/c/Users/felip/.claude/grimoire-ponte"
sig() {
  a=$(git -C "$W" rev-parse -q --verify origin/ponte:ponte/PEDIDOS.md 2>/dev/null)
  v=$(git -C "$W" rev-parse -q --verify origin/ponte:ponte/AVISOS.md 2>/dev/null)
  echo "$a|$v"
}
git -C "$W" fetch -q origin ponte main midia 2>/dev/null
last=$(sig)
lastm=""
while true; do
  git -C "$W" fetch -q origin ponte main midia 2>/dev/null || { sleep 60; continue; }
  m=$(git -C "$W" rev-parse -q --verify origin/midia 2>/dev/null)
  if [ "$m" != "$lastm" ]; then
    python "$W/ponte/auditar.py" 2>&1 | grep --line-buffered -E "REPROVOU|Traceback|Error"
    lastm="$m"
  fi
  e=$(git -C "$W" rev-parse -q --verify origin/main 2>/dev/null)$(git -C "$W" rev-parse -q --verify origin/ponte 2>/dev/null)
  if [ "$e" != "$laste" ]; then
    python "$W/ponte/espelhar.py" >/dev/null 2>&1
    laste="$e"
  fi
  now=$(sig)
  if [ "$now" != "$last" ]; then
    if git -C "$W" diff "${last#*|}" "${now#*|}" 2>/dev/null | grep -qiE "trav|falh|erro|bloque|pedido|PC fa|conclu|termin|todos os|fim d|Felipe"; then
      echo "PONTE: aviso da nuvem pede atenção $(date '+%H:%M') — ler origin/ponte:ponte/AVISOS.md e PEDIDOS.md"
    fi
    a_old=${last%%|*}; a_new=${now%%|*}
    [ "$a_old" != "$a_new" ] && echo "PONTE: pedido novo da nuvem $(date '+%H:%M') — ler origin/ponte:ponte/PEDIDOS.md"
    last="$now"
  fi
  sleep 60
done
