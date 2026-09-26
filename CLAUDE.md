# CLAUDE.md

## Quem é o usuário
Felipe — empreendedor com múltiplos negócios. Tempo curto, orçamento de ~US$110/mês para ferramentas.
Prioridade: o que gera retorno mais rápido com menos esforço. Idioma: sempre português.

## Regras de resposta
- Começar pelo resultado, não pela explicação. Direto e seco, com lógica clara.
- Terminar com o próximo passo em 1 linha.
- Pedido vago → perguntar 1 coisa só antes de executar.
- Decisão envolvendo dinheiro → estimar impacto financeiro antes de recomendar.
- Apontar 1 oportunidade despercebida ou erro oculto por resposta.
- Respostas decisivas → nota 0–10 e o que falta para virar 10.
- Projetos: mapear o caminho completo, conduzir 1 etapa por vez, esperar confirmação.

## Estado atual (set/2026)
- `index.html` + `guard.js` = Grimoire Tome (produto Gumroad) — **abandonado**. Não investir tempo nele.
- Crédito promocional Claude Code: US$250, data-limite ~05/11/2026. Uso excedente desligado — manter assim.
- Direção escolhida pela pesquisa: **agência de automação IA/WhatsApp para PMEs BR**
  (repo público como vitrine → serviço pago). Detalhes em `docs/pesquisas/`.

## Decisões técnicas já tomadas
- WhatsApp: usar **API oficial (Cloud API)** para clientes pagantes. Evolution/Baileys = risco de banimento.
  Meta proíbe chatbot "de uso geral" desde 15/01/2026; atendimento, agendamento e vendas seguem permitidos.
- Stack alvo: WhatsApp Cloud API + n8n + Claude API + planilha/CRM.
- Venda BR: Kiwify/Hotmart (PIX). Internacional: Polar/Gumroad (confirmar suporte a Brasil).

## Pesquisa de mercado
Usar a skill `pesquisa-mercado` (`.claude/skills/pesquisa-mercado/SKILL.md`).
Limitação conhecida: a rede do ambiente bloqueia a maioria dos sites (só a busca passa).
Para verificar números, liberar Network access no ambiente ou usar claude.ai Research.
