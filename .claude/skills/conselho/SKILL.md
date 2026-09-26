---
name: conselho
description: Convoca o conselho de especialistas do Capi Lingo (agentes em .claude/agents/) para revisar o plano, um episódio, um formato ou uma decisão, e consolida num plano de ação priorizado. Use quando Felipe pedir "conselho", "especialistas", "revisão completa" ou quiser melhorar o projeto como um todo.
---

# Conselho de especialistas — Capi Lingo

1. Defina o alvo (padrão: `docs/plano-capi-lingo.md` + estado de `canal-idiomas/`). Se for um episódio, passe o caminho do JSON/MP4.
2. Escolha os especialistas relevantes em `.claude/agents/` (padrão: todos). Rode em paralelo, em background, um subagente
   por especialista. Se o tipo não estiver carregado na sessão, use `general-purpose` com o prompt:
   "Leia `.claude/agents/<nome>.md` e atue exatamente como esse especialista. Alvo: <alvo>. Pesquise na web quando precisar.
   Salve sua análise em `docs/conselho/<AAAA-MM-DD>/<nome>.md` e devolva o resumo."
3. Ao receber todos: consolide em `docs/conselho/<AAAA-MM-DD>/SINTESE.md`:
   - conflitos entre especialistas e a decisão recomendada;
   - top 10 ações priorizadas (impacto × esforço), cada uma com dono (Felipe ou Claude) e prazo;
   - impacto financeiro estimado; nota geral 0–10 e o que falta para 10.
4. Atualize `docs/plano-capi-lingo.md` com o que for aprovado pelo Felipe (não antes) e faça commit/push.
5. No chat: resultado primeiro, só as 5 ações mais importantes, próximo passo em 1 linha.
