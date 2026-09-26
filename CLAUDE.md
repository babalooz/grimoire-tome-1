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
- Direção ATUAL (escolhida pelo Felipe): **canais de vídeo curto (TikTok/Shorts/Reels) de idiomas**, estilo quiz
  viciante com mascote original + assuntos do hype local, produção 100% automatizada. Código em `canal-idiomas/`.
  Felipe rejeitou: agência WhatsApp, vender skills, add-ons/extensões (retorno pequeno/pouco original).
  Mascote atual (SVG no código) e formato v1/v2 foram reprovados — refazer com base em referências + pesquisa de campeões.
- Pesquisas em `docs/pesquisas/`. Pontos-chave de canais: Shorts pagam 3–14% do vídeo longo; YPP endurece em 01/02/2027
  (entrar antes); TikTok CRP exige vídeo ≥1 min; evitar "conteúdo inautêntico" e classificação "feito para crianças";
  brecha forte = português para hispanofalantes/anglófonos.

## Decisões de marca (Felipe, 26/09)
- Marca **CapyFala** — handle **@acapyfala** (TikTok criado 26/09; usar o mesmo no YouTube e Instagram) — confirmada 26/09. Família: CapyFala (inglês p/ brasileiros), CapyHabla (português p/ hispanofalantes),
  CapyParla (futuro). Personagem: **Capy** (com y, decisão do Felipe 26/09 — nunca "Capi"), voz feminina. Keywords do canal no Studio: CapyFala, Capy, capivara, aprender inglês, inglês para brasileiros, inglês do dia a dia, inglês fácil, falar inglês, erros em inglês, frases em inglês, inglês americano, inglês para viagem, morar nos EUA, vocabulário em inglês, pronúncia em inglês, inglês básico, curso de inglês grátis. 'Capi Lingo' descartado (app 'Capilingo' na App Store BR desde 03/2026).

## Integrações ativas (26/09)
- Conectores: Gmail, Google Drive, Google Calendar, **vidIQ** (Free: 150 créditos/mês, renova dia 25 — usar só em pesquisa semanal).
- Agenda Google **CapyFala** (id `ac285cc7e8ab6ec1a05993c3a2a0a7c6c92a4cd6ec54bca0b7b9e72c36eb56d8@group.calendar.google.com`):
  calendário editorial até 05/11, eleições bloqueadas (04/10, 25/10), longo aos domingos. (Aprovação diária REMOVIDA: fábrica autônoma.)

## Ponte com o PC do Felipe
- Branch `ponte`: pedidos em `ponte/PEDIDOS.md` (push no branch ponte), respostas em `ponte/RESPOSTAS.md`
  (`git fetch origin ponte && git show origin/ponte:ponte/RESPOSTAS.md`). O Claude local tem navegador, Drive, Railway, arquivos.
  Não faz login/senha/código/chave nem publica/altera conta sem o Felipe no teclado. Ver ponte/README.md.
- YouTube: canal existente "Felipe Pazini" (UCE46GzcE1XXYcn0y1O0i3JA), 3 Shorts antigos de futebol a tornar privados.

## Fábrica autônoma (decisão do Felipe, 26/09)
- Felipe NÃO aprova vídeos. Portão automático em 3 camadas (código → juiz LLM nota ≥8, máx. 2 reescritas → publica).
  Freio automático (strike, remoção, 3 vídeos seguidos < 50% da mediana) pausa tudo e avisa o Felipe. Detalhes em docs/plano-de-acao.md.
- AI-driven + data-driven: toda decisão cita métrica e vai para `canal-idiomas/decisoes.md`; sem dado = teste com prazo e
  critério de corte prévios. 80% explorar o que funciona / 20% explorar novo.
- Comentários: resposta automática no personagem só no YouTube; TikTok não responde.
- Elenco completo liberado para criar: Duda, Poppy, Dona Jaca.

## Decisões técnicas já tomadas
- WhatsApp: usar **API oficial (Cloud API)** para clientes pagantes. Evolution/Baileys = risco de banimento.
  Meta proíbe chatbot "de uso geral" desde 15/01/2026, mas no Brasil o CADE suspendeu (mantido em 04/03/2026);
  aqui IA de uso geral é aceita a R$0,3217/msg. Bot de atendimento/agendamento/vendas segue tabela normal.
- Preço Cloud API BR (01/07/2026): marketing R$0,3217 · utilidade R$0,0350 · autenticação R$0,0350 ·
  resposta na janela de 24h grátis · 72h grátis via anúncio click-to-WhatsApp. Desenhar fluxos com o cliente iniciando.
- Stack alvo: WhatsApp Cloud API + n8n + Claude API + planilha/CRM.
- Venda BR: Kiwify/Hotmart (PIX). Internacional: Gumroad (repasse só via PayPal, 2%) ou GitHub Sponsors.
  Polar NÃO paga para o Brasil (verificado 26/09/2026).
- Meta lançou MCP oficial do WhatsApp Business (15/09/2026) — só configuração/onboarding; usar no `/novo-cliente`.

## Pesquisa de mercado
Usar a skill `pesquisa-mercado` (`.claude/skills/pesquisa-mercado/SKILL.md`).
Limitação conhecida: a rede do ambiente bloqueia a maioria dos sites (só a busca passa).
Para verificar números, liberar Network access no ambiente ou usar claude.ai Research.
