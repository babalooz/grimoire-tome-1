---
name: pesquisa-mercado
description: Pesquisa de modelo de negócio / oportunidade de lucro com exemplos reais e fontes. Use quando Felipe pedir para pesquisar um mercado, nicho, modelo de negócio, "quem está ganhando com X" ou comparar oportunidades.
---

# Pesquisa de mercado — padrão Felipe

Delegar a um subagente `general-purpose` (em background) com as regras abaixo coladas no prompt,
mais o tema pedido. Ao receber o resultado, resumir no chat e salvar o relatório completo em
`docs/pesquisas/AAAA-MM-DD-<tema>.md` (o container é efêmero — o que não for commitado se perde).

## Contexto fixo do cliente
Felipe, brasileiro, múltiplos negócios, pouco tempo, ~US$110/mês para ferramentas, sem capital grande.
Usa Claude Code para construir. Vende em BRL (Kiwify/Hotmart/PIX) e USD. Fraqueza conhecida: distribuição/tráfego.

## Regras obrigatórias
- Cada modelo: 2–3 exemplos REAIS nomeados (2024–2026) com faturamento e URL da fonte.
- Marcar cada número: **verificado** (Stripe/TrustMRR, doc oficial, imprensa que viu dados, processo judicial)
  / **autodeclarado** / **autodeclarado (vende curso)** / **estimativa**. Nunca inventar nome, número ou URL.
- Explicar o mecanismo: produto, preço, canal de tráfego, o que é automatizado vs manual.
- Riscos que matam iniciante: políticas de plataforma, saturação, impostos/pagamento para brasileiro.
- Declarar se o WebFetch foi bloqueado e quais números vieram só de trechos de busca.

## Formato de saída (português, sem enrolação)
1. Tabela: Modelo | Exemplo real + faturamento (fonte) | Custo inicial | Tempo até 1º R$ | Automação 0–10 | Risco | Fit Felipe 0–10.
2. Detalhe por modelo (5–8 linhas): mecanismo, o que o Claude Code monta na semana 1, números conservadores de 90 dias, risco fatal.
3. Descartados e por quê.
4. Top 3 para Felipe + impacto financeiro estimado.
5. Lista de fontes (URLs).
