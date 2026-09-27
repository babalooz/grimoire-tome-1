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
- **REGRA DO FELIPE (vale sempre): a nuvem é ATIVA.** Ao terminar QUALQUER tarefa/bloco de trabalho, ou ao travar,
  acrescentar 1 linha em `ponte/AVISOS.md` no branch `ponte` e dar push: `data-hora UTC · o que terminou · resultado ·
  próximo passo`. Comando: `bash canal-idiomas/scripts/aviso.sh "o que" "resultado" "próximo passo"`. O PC vigia a cada 60 s.
- YouTube: canal existente "Felipe Pazini" (UCE46GzcE1XXYcn0y1O0i3JA), 3 Shorts antigos de futebol a tornar privados.

## Estrutura de série (decisão do Felipe, 26/09)
- Temporadas = níveis CEFR (T1=A1, T2=A2, T3=B1…), capítulos temáticos de 4–6 episódios, episódios numerados ("T1 E03")
  visíveis no vídeo e no título; playlists do YouTube por temporada. Ordem do conteúdo: English Profile/Cambridge (EVP/EGP),
  Pearson GSE, Oxford 3000 e progressão Headway/English File/Interchange. Cada episódio = 1 objetivo "Consigo…" (can-do);
  erro de brasileiro é tempero dentro do objetivo. Ensinar palavras ANTES de frases (apresentar → reconhecer → usar → mini-cena).
  Sempre em contexto adulto (evitar classificação "feito para crianças"). Percurso em canal-idiomas/curriculo/do-zero.json.

## REGRA DO FELIPE (27/09): formato, elenco, marca e voz são decisão DELE
- Nada de gerar vídeo (render, TTS pago, protótipo) antes de o Felipe decidir o formato. Fluxo: plano → Felipe decide →
  só então render. A autonomia da fábrica vale só para a produção diária DEPOIS do formato aprovado. Mudança de formato,
  elenco, marca ou voz = decisão do Felipe (apresentar plano e esperar).

## Fábrica autônoma (decisão do Felipe, 26/09)
- Felipe NÃO aprova vídeos. Portão automático em 3 camadas (código → juiz LLM nota ≥8, máx. 2 reescritas → publica).
  Freio automático (strike, remoção, 3 vídeos seguidos < 50% da mediana) pausa tudo e avisa o Felipe. Detalhes em docs/plano-de-acao.md.
- AI-driven + data-driven: toda decisão cita métrica e vai para `canal-idiomas/decisoes.md`; sem dado = teste com prazo e
  critério de corte prévios. 80% explorar o que funciona / 20% explorar novo.
- Comentários: resposta automática no personagem só no YouTube; TikTok não responde.

## Elenco aprovado (Felipe, 26/09) — só animais queridos; cada um = 1 mecânica de ensino
- **Capy** (capivara, protagonista) · **Lazy** (preguiça; NUNCA "Léo"; nome = lição "lazy = preguiçoso"; fala lenta =
  pronúncia/"repita comigo"; bordão "não sou preguiçoso, sou... eficiente") · **Hank** (panda-gigante rabugento, dono do
  café Bean There; traduções literais) · **Duda** (panda-vermelho, falsos cognatos, diz ser prima do Hank) · **Poppy**
  (axolote influencer, gírias; só temas adultos) · **Bolinha** (hamster, guarda frases nas bochechas e devolve = revisão
  espaçada) · **Dona Jaca** (capivara, mãe da Capy, por videochamada).
- Speakers no JSON/TTS: capi, lazy, hank, duda, poppy, bolinha, donajaca, narrador ("leo" = alias antigo de lazy).
- ~~Bio "Inglês pra quem trava na hora de falar"~~ — DESCARTADA 27/09: é a chamada do app Comigo. Bio nova (proposta): "O café mais
  confuso dos EUA ☕ / 1 frase de inglês por dia com a Capy 🐹".
- **Comigo (usecomigo.com/pt)** tem uma capivara chamada "Capy" que ensina inglês a brasileiros (verificado 27/09). Decisão do
  Felipe (27/09): marca CapyFala e personagem Capy continuam. INPI (base 22/09): "CapyFala" 0 registros; "Capy" 42 (classe 41:
  CAPY BOX em vigor; CAPY, I-CAPY, Mr. Capy em exame). Regras: nunca citar nem imitar o Comigo; diferenciar pelo visual, pelo
  elenco, pelo Café Bean There e pelas temporadas; NÃO usar "trava na hora de falar" como chamada principal.

## Público (Felipe, 27/09): quem NÃO sabe inglês e tem MEDO de inglês
- Série começa do ZERO (pré-A1): 10 primeiros episódios com cognatos e palavras que o brasileiro já usa, frases de 1–3 palavras,
  explicação em PT, ritmo bem lento, 1 vitória celebrada por episódio. Gancho: "você já sabe mais inglês do que pensa".
  A Capy é o espelho do medo (trava e consegue); o Hank nunca humilha; errar é normal e engraçado. Lista em
  `docs/plano-formato-cafe.md` §0 (rumo aprovado; lista não final).
- **Currículo (Felipe, 27/09): COPIAR a sequência dos métodos consagrados**, não inventar: consenso da ordem de temas e
  gramática de English File Beginner, Headway Beginner (Oxford), Empower Starter, Evolve Starter (Cambridge) + descritores CEFR
  Pre-A1/A1 (só a ordem; nunca copiar texto dos livros). Cognatos = apoio dentro dessa ordem, não espinha. Mapa: PC em
  `ponte/saida/sequencia-oxford-cambridge.md`. Roteiros dos 10 (`docs/roteiros/roteiros-t1-zero.md`) SUSPENSOS até o mapa.
  Episódio "ção vira tion" descartado.
- **APROVADO (27/09): T1 = 20 ASSUNTOS na ordem de consenso** (`docs/pesquisas/sequencia-oxford-cambridge.md` §4) + lista
  "COPIAR JÁ" (§9). **Cada assunto = 3 VÍDEOS**, cada um em volta de 1 exercício feito para vídeo (pausa → aluno fala em voz
  alta/na cabeça → resposta logo depois): V1 APRENDER (cena no café + repita comigo, coro → sozinho), V2 PRATICAR (você é a
  Capy: a fala some e você responde ao Hank, ou complete falando), V3 FIXAR (ouça e reconheça + personalize). Pode trocar o
  exercício de um vídeo se outro servir melhor ao assunto, justificando. Frase-alvo ≥ 10× somando os 3. T1 = 60 vídeos.
  Roteiros no papel, 1 assunto por vez, Felipe aprova antes do próximo (assunto 1: `docs/roteiros/roteiros-tema01.md`).
- **Foco (Felipe, 27/09): VIEWS e SEGUIDORES por vídeo.** Os 3 vídeos de cada assunto têm **≥ 61 s** (Creator Rewards; ensinar
  com calma): V1 APRENDER (aula), V2 PRATICAR = **STORYTELLING com o hype** (Dona Jaca liga do Brasil comentando o assunto em
  alta do radar filtrado; a Capy usa a frase na história; "você é a Capy" no enredo; gancho verdadeiro pro próximo capítulo),
  V3 FIXAR. **Hype do V2 TEM que puxar o inglês (Felipe, 27/09):** só assuntos do mundo anglófono (filme/série gringa, show/turnê
  internacional no Brasil, NBA/NFL, trend gringa do TikTok, turista gringo, lançamento de jogo, Oscar/Grammy, Halloween,
  Thanksgiving, Black Friday); quem traz é quem faz sentido (Poppy = trend; cliente gringo; Dona Jaca só quando couber);
  reserva atemporal = turista gringo no café. Selos: "T1 E0N", "parte 2/3", "parte 3/3". Assunto 1 v5 APROVADO (v6 = V2 novo).
  O ALCANCE fica com os **CORTES curtos (5–28 s)** tirados dos 3 (C1–C5) + 1 compilação longa semanal no YouTube com
  capítulos. Grade: `docs/grade-t1.md` (2 assuntos/semana, ~15 posts/semana no TikTok; teste 3/semana nas semanas 3–4).

## Formato atual (27/09): SITCOM DO CAFÉ (passivo, sem interação)
- O formato "app" (exercícios A/B/C, ligar, lacuna, corações, XP) foi ABANDONADO (Felipe: acelerado + vídeo não é interativo).
- Plano: `docs/plano-formato-cafe.md`. Estudos: `docs/pesquisas/formato-novo/`. Regras-chave: 1 frase-alvo nova por vídeo,
  ≥ 5 vezes em ≥ 3 bocas, legenda EN sempre e PT só na 1ª vez, erro dito 1× e riscado, 1 pergunta com pausa e resposta no
  mesmo vídeo, pausa de repetição = fala + 1 s, inglês 120→170 palavras/min, hype só no cenário, nunca na frase-alvo.
- Gatilhos (só verdadeiros, 27/09): erro real 0–2 s + "tá errado. sabe por quê?"; pergunta 3 s "pensa aí... ou chuta nos
  comentários"; selo com progresso real ("você já sabe N frases"); Bolinha "lembra dessa?"; laço "amanhã: EP N" só se o EP
  existe e está agendado; #TimeLazy/#TimeHank. PROIBIDO (portão reprova): "fluente em X dias", "método secreto", urgência
  inventada, número zerado de seguidores/views, "trava na hora de falar". Bio "inglês do básico em episódios, na ordem do
  padrão CEFR. grátis." só depois que a T1 no ar seguir o CEFR (constantes em `scripts/roteirista.py` GATILHOS e `portao.py`).

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
