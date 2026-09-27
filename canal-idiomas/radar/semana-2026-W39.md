# Radar semanal CapyFala — 2026-09-21 a 2026-09-27

Gerado por `scripts/radar.py --semanal` (base) + pesquisa manual desta rotina (calendário, gírias). Rótulos: **verificado** (fonte oficial/primária lida hoje) · **terceiros** (blog/imprensa) · **estimativa**.

**Radares diários lidos: 2/7** (`2026-09-26.json`, `2026-09-27.json` — a fábrica só começou a girar 26/09; ainda não há 7 dias de histórico). Isso é uma limitação de dado, não um resultado: com só 2 dias, nenhum termo pode atingir o limiar de 3+ dias exigido para "tema da semana" — mesmo que um termo se repetisse nos 2 dias disponíveis, o correto é reportar **não medido**, não "sem tema".

## 1. Tema da semana

**Não medido (dado insuficiente: 2/7 radares diários).**
- Nenhum termo de hype se repete entre os 2 dias disponíveis (09-26: Evanescence, EUA×Peru, Floresta×Santa Cruz, Mauro Júnior… · 09-27: Lionel Messi, A Hipótese do Amor, ADÉLA-Nicole Kidman… — zero overlap).
- Os eventos de calendário (amistosos, eleição, show do Zayn) aparecem nos 2/2 dias, mas são datas fixas do `calendario.json`, não tendência emergente — não contam como "tema".
- Fallback (igual à semana anterior): episódios contextualizam pelo calendário abaixo.

## 2. Calendário da semana que começa amanhã (28/09 a 04/10/2026)

| Data | Dia | Evento | Fonte | Bloqueio? |
|---|---|---|---|---|
| 29/09 (ter) | — | Amistoso Brasil x Austrália, Suncorp Stadium (Brisbane), 07h de Brasília. Transmissão: TV Globo, SporTV, Globoplay, GE TV (YouTube). | **verificado hoje**: [Exame](https://exame.com/esporte/brasil-x-australia-onde-assistir-horario-e-escalacao/) · [Olympics.com](https://www.olympics.com/pt/noticias/brasil-australia-convocados-programacao-onde-assistir) · [Band](https://www.band.com.br/esportes/futebol/selecao-brasileira/australia-x-brasil-horario-escalacoes-e-onde-assistir-ao-amistoso) | não |
| 03/10 (sáb) | — | Amistoso Brasil x Índia, Calcutá (fonte única no `calendario.json`, ainda não reconfirmada por uma 2ª fonte hoje). | [Diário de Pernambuco](https://www.diariodepernambuco.com.br/esportes-dp/selecao-brasileira/2026/09/11722982-amistosos-da-selecao-brasileira-em-2026-cbf-confirma-adversarios.html) (terceiros, 11/09) | não |
| 01/10 (qui) | — | Último dia de propaganda eleitoral paga/impulsionada na internet. | [TRE-SP](https://www.tre-sp.jus.br/comunicacao/noticias/2026/Maio/eleicoes-2026-outubro-tem-datas-do-1o-e-do-2o-turnos-definidas-pela-constituicao) (verificado) | não (não é dia de tematizar, mas não é bloqueio de hype) |
| 03/10 (sáb) | — | Último dia para distribuição de material gráfico eleitoral. | [TRE-SP](https://www.tre-sp.jus.br/comunicacao/noticias/2026/Maio/eleicoes-2026-outubro-tem-datas-do-1o-e-do-2o-turnos-definidas-pela-constituicao) (verificado) | não |
| **04/10 (dom)** | — | **Eleições, 1º turno** — votação 8h–17h (Brasília). Presidente, governadores, senadores, deputados. | [TSE](https://www.tse.jus.br/comunicacao/noticias/2026/Marco/eleicoes-2026-confira-as-principais-datas-do-calendario-eleitoral) (verificado) | **SIM — `block_hype` no `calendario.json`**: só quadros neutros/atemporais |

- **Feriados BR/EUA na janela (28/09–04/10):** nenhum encontrado (verificado por busca; próximo feriado BR é Dia das Crianças/N. Sra. Aparecida, 12/10, fora da janela).
- **Estreias de cinema:** os grandes lançamentos de outubro citados na imprensa (Street Fighter, "A Queda 2", "O Outro Lado das Redes", volta de "Jogos Vorazes", BTS "Arirang" ao vivo nos cinemas) aparecem nas matérias de calendário do mês, mas nenhuma tem confirmada exatamente 28/09–04/10; a data que dá para confirmar é Street Fighter em 15/10 (já no `calendario.json`). **Não medido** para esta semana especificamente — não inventar dia.
- **Eventos "de TikTok" (challenge oficial, sound em alta):** busca não retornou nenhum evento específico e verificável com URL para esta semana (só descrições genéricas de trends antigas). **Não medido.**

## 3. Gírias (revisão de `docs/tiktok-nativo.md` §2)

**Vencidas nesta checagem:** nenhuma nova. A tabela já reporta "Tu, finish" como **vencido** (Copa acabou) — mantém.
**Vencendo em breve (fora desta janela, só aviso):** "é um nervosismo surreal" vence 31/10/2026 — ainda tem 1 mês, não precisa de fallback ainda. As gírias "até 31/12/2026" (buffado, flopou, amassou, hypeado/estourado, comeu, farmar aura) seguem válidas.

**Propostas novas (vêm do inglês, com prova de uso):**

| Termo | Sentido | Prova de uso | Usar na Capy? |
|---|---|---|---|
| **delulu** (de "delusional") | otimismo irrealista assumido de propósito ("delulu is solulu") | Hashtag com **2,6 bilhões de views** no TikTok, migrou do universo K-pop para o mainstream — [CNN Brasil](https://www.cnnbrasil.com.br/entretenimento/ser-delusional-ou-delulu-e-a-nova-onda-do-momento-entenda-viral-do-tiktok/) (terceiros) | Sim, texto de tela/fala `pt` só na ironia da Capy ("tô delulu, mas com plano"); nunca prometer resultado irreal (bate na regra "sem promessa inventada") |
| **NPC** (de "non-playable character") | agir de forma robótica/repetitiva, sem reação própria | Vídeo do trend "NPC live" ultrapassou **100 milhões de views**; virou fonte de renda para criadores — [Forbes Brasil](https://forbes.com.br/forbes-tech/2023/09/o-que-e-npc-a-nova-lucrativa-e-perigosa-febre-do-tiktok/) / [Nota Alta ESPM](https://notaalta.espm.br/o-melhor-de-hoje/npc-a-nova-febre-do-tiktok-que-movimenta-muitos-milhoes/) (terceiros) | Sim, ótimo pra série "a gíria que vem do inglês" — Hank fazendo cara de NPC quando repete a mesma frase |
| ~~rizz~~ | carisma/charme | Achado (Oxford Word of the Year 2023), mas **sem número de views/BR verificável hoje** | **Não proposta** (falta prova numérica; já está na lista existente só para texto de tela) |

Só 2 propostas novas com prova numérica real — não inventei a 3ª.

## 4. Instrução pro roteirista (por dia, 28/09–04/10)

**Aviso de bloqueio:** o formato novo (Sitcom do Café) continua **sem aprovação do Felipe** (regra 27/09) — nenhuma rotina de produção renderiza, roda TTS ou publica esta semana. As instruções abaixo são o contexto que o roteirista usaria **quando** a produção for liberada; a lição do currículo nunca muda, só o cenário/fala de apoio.

| Data | Dia | Contextualiza o EPISÓDIO (lição intocada) | Hype pra ESQUETE |
|---|---|---|---|
| 28/09 | seg | Sem tema/evento seguro do dia → contexto neutro/atemporal (calendário sem entrada seguro para esta data) | A definir pelo radar diário de 28/09 (ainda não existe) |
| 29/09 | ter | Amistoso Brasil x Austrália: gírias australianas x americanas ("mate", "arvo", "no worries", "g'day") como fala de apoio da Dona Jaca/Poppy — é esporte/mundo anglófono, serve pro V2 storytelling | Mesmo evento — hype anglófono forte, prioridade sobre o hype genérico do radar diário |
| 30/09 | qua | Sem evento seguro do dia → contexto neutro/atemporal | A definir pelo radar diário de 30/09 |
| 01/10 | qui | Sem evento seguro do dia (é dia de corte de propaganda paga, não de tematizar) → contexto neutro/atemporal | A definir pelo radar diário de 01/10 |
| 02/10 | sex | Sem evento seguro do dia → contexto neutro/atemporal | A definir pelo radar diário de 02/10 |
| 03/10 | sáb | Amistoso Brasil x Índia (Calcutá): pronúncia de nomes/"Kolkata", vocabulário de jogo (score, draw) — status "fonte única", ainda a confirmar antes de usar como gancho de peso | Mesmo evento, se confirmado; senão cair no hype genérico do dia |
| **04/10** | **dom** | **BLOQUEIO** (`block_hype` no calendário — eleição, 1º turno): **zero hype**, zero menção a política. Só quadros neutros/atemporais (Nível, Pegadinha) | **Nenhum** — dia de bloqueio vale para episódio E esquete |

**Oportunidade despercebida:** nenhum dos 2 amistosos tem 2ª fonte hoje confirmando data/hora além do que já constava no `calendario.json` (Austrália: agora confirmado por 3 fontes de hoje; Índia: continua com 1 fonte só, de 11/09) — se o jogo Brasil x Índia mudar de data, o gancho do 03/10 cai; vale o Felipe (ou o radar diário de 01–02/10) reconfirmar antes de comprometer o roteiro daquele dia.

## 5. Registro

`radar/semana-2026-W39.json` tem os mesmos campos (schema do `radar.py`) + `girias` e `instrucao_roteirista` como campos extras (não lidos pelo `roteirista.py` hoje; documentação para o Felipe e para uma extensão futura do script).
