# Radar semanal — 2026-W43 (semana de 19/10 a 25/10)

Gerado em 2026-10-18 (domingo), a partir dos radares diários disponíveis de 2026-10-12 a 2026-10-18
(`canal-idiomas/radar/2026-10-{12,14,15,16,17,18}.json`). **Falta o radar de 2026-10-13** (arquivo não existe na
pasta — não medido esse dia; contagens abaixo são sobre 6 dias, não 7). Sem FREIO ativo.

**Contexto operacional (não é do radar, mas relevante pra leitura desta semana):** a fábrica não publicou nenhum
vídeo ainda. Os 3 vídeos do assunto 1 (V1/V2/V3) estão aprovados no portão e no branch `midia` desde 14/10; a
decisão de publicar/ajustar é só do Felipe (regra 27/09) e `canal-idiomas/decisoes.md` registra alertas urgentes
em 16/10 e 17/10 sem resposta ainda em `ponte/RESPOSTAS.md`. Isso não muda o conteúdo deste radar, mas significa
que a "instrução pro roteirista" abaixo segue valendo só quando a publicação for destravada.

## 1. Tema da semana (persistência nos radares diários)

Ranking por nº de dias em que o termo apareceu em `hype_seguro` nos 6 radares diários disponíveis (12,14,15,16,17,18/10),
já filtrados pelo filtro de segurança do radar (política/crime/tragédia descartados automaticamente). Todos os 3 abaixo
já passaram pelo filtro (nenhum está na lista de descartados de nenhum dia).

| # | Tema | Dias com aparição | Fonte(s) | Volume (medido) |
|---|---|---|---|---|
| 1 | **BTS – SWIM** (K-pop/catálogo) | 6/6 dias (12,14,15,16,17,18/10) | spotify-br (kworb.net) | streams/dia entre 244.907 (12/10) e 275.718 (16/10); posição Spotify BR entre #61 e #121 |
| 2 | **Futebol internacional / Libertadores** (Clarence Seedorf + jogos reais) | 5/6 dias (12,14,15,16,17/10) — Seedorf no topo do hype; evento real da Libertadores presente no calendário de todos os 6 radares | wikipedia (Seedorf) + verificado (Conmebol, jogos) | Seedorf: 83.624 → 9.102 views na Wikipédia (caindo); jogos de volta confirmados 21–22/10 |
| 3 | **NBA temporada 2026-27** | 5/6 dias (12,14,15,17,18/10 — ausente só em 16/10) | manual (TikTok) + verificado (Band/Dunkest) | score fixo 3,0 (entrada manual, não API); abertura confirmada 20/10 |

**Aviso importante pro roteirista (repete a nota da semana passada):** BTS é K-pop (coreano, mesmo com trechos em
inglês) — **serve só pra V1/vocabulário**, não cumpre a regra do Felipe (27/09) de "hype do V2 TEM que puxar o
inglês" com assunto do mundo anglófono. Os temas #2 (futebol/Libertadores) e #3 (NBA) **cumprem a regra** e caem
dentro desta própria semana (jogos em 21–22/10, abertura da NBA em 20/10) — são os bons candidatos pra abertura de
esquete V2 (storytelling).

**Fora do top 3 (4º lugar, registrado por transparência):** ADÉLA – Nicole Kidman apareceu em 4/6 dias (12,14,17,18/10),
inclusive #1 no radar de 17/10 (score 5,62) — mesma ressalva do BTS (música internacional, não claramente anglófona,
só V1).

## 2. Calendário da semana (19/10 a 25/10)

| Data | Dia | Evento | Bloqueio? | Fonte |
|---|---|---|---|---|
| 19/10 (seg) | — | Sem evento específico encontrado | Não | busca própria desta rotina — não medido |
| 20/10 (ter) | — | **Abertura da temporada NBA 2026-27**: Celtics @ Pistons (15h ET / 16h BRT), 76ers @ Knicks (19h ET / 20h BRT — estreia de LeBron James pelo Philadelphia contra o Knicks, atual campeão), Thunder @ Spurs (21h30 ET / 22h30 BRT) | Não | [Dunkest — NBA 2026/27 Schedule, Opening Night and Key Dates](https://www.dunkest.com/en/nba/news/244243/nba-schedule-opening-night-key-dates) |
| 21/10 (qua) | — | Libertadores semifinal, jogo de volta: **Palmeiras x Fluminense**, 21h30, Nubank Parque (SP) | Não | [Gazeta Esportiva — Libertadores 2026: semifinais](https://www.gazetaesportiva.com/campeonatos/libertadores-da-america/libertadores-tudo-sobre-as-semifinais/) |
| 22/10 (qui) | — | Libertadores semifinal, jogo de volta: **Flamengo x Estudiantes**, 21h30, Maracanã (RJ) | Não | [idem Gazeta Esportiva](https://www.gazetaesportiva.com/campeonatos/libertadores-da-america/libertadores-tudo-sobre-as-semifinais/) |
| 25/10 (dom) | — | **Eleições, 2º turno** (presidente + governadores) | **SIM — bloqueio** | [Correio Braziliense — feriados nacionais 2026](https://www.correiobraziliense.com.br/cbradar/feriados-nacionais-calendario-2026-folgas/) |

Não encontrei feriado nacional nem evento de TikTok for Business confirmado com data nesta semana — **não medido**
(mesma limitação já registrada em `canal-idiomas/radar/manual.txt`: o endpoint de hashtag/challenge não responde
da nuvem; só o PC mede). 28/10 (BTS "Arirang" no MorumBIS) e 31/10 (Halloween) ficam fora desta semana, mas perto
do fim dela — ver `canal-idiomas/radar/2026-10-17.md` e `2026-10-18.md`.

## 3. Gírias (revisão de `docs/tiktok-nativo.md` §2)

| Termo | Validade atual | Situação |
|---|---|---|
| "é um nervosismo surreal" | até 31/10/2026 | **Vencendo em 13 dias** (dentro da janela desta rotina). Faltam 6 dias pro fim da semana (25/10); fallback já pronto no exemplo A do JSON: "Respondi o que ninguém perguntou. Deu branco." |
| buffado, flopou/flopado, amassou, hypeado/estourado, comeu, farmar aura | até 31/12/2026 | Seguem válidas, sem mudança |
| "Tu, finish" | **vencido** (Copa acabou) | Mantém reprovado |
| "Neysexual", memes de "Bichos Escrotos" | vencendo/vencido | Mantém reprovado (pessoa real / música de terceiros) |
| skibidi, 67 (six seven), brain rot | sem validade (regra permanente) | Mantém reprovado — risco de "feito para crianças" |
| cringe, rizz, "chat", IYKYK | sem validade (regra permanente) | Só em texto de tela; nunca em fala `pt` |

**Novas gírias propostas (vêm do inglês), com prova de uso:**

| Termo | Origem | Prova de uso (URL) | Views | Usar na Capy? |
|---|---|---|---|---|
| "gag" / "fiquei gagada" | do inglês "to gag" (choque/surpresa, origem na cultura drag) | [O Povo — "gag", "aura" e "camp" estão por toda parte nas redes](https://opovo.com.br/trends/as-girias-gag-aura-e-camp-estao-por-toda-parte-nas-redes-sociais-e-a-maioria-das-pessoas-que-usa-nao-sabe-exatamente-o-que-cada-uma-significa/) (mai/2026, terceiros) | **não medido** (matéria não traz views por vídeo) | Sim, com moderação (choque exagerado da Capy/Hank) |
| "tankar" | do inglês "tank" (gíria gamer, aguentar/suportar) | [Correio 24 Horas — gag, tankar e old](https://www.correio24horas.com.br/em-alta/gag-tankar-e-old-o-que-significam-as-girias-usadas-pela-geracao-z-na-internet-0426) (2026, terceiros) | **não medido** | Sim ("o Hank tankou o pedido errado") |
| "locked in" / #LockedIn | direto do inglês, trend que sucedeu "delulu" | [Band — "Fim da era delulu: a tendência locked in que domina o TikTok em 2026"](https://www.band.com.br/lifestyle/noticias/fim-da-era-delulu-a-tendencia-locked-in-que-domina-o-tiktok-em-2026-202602021711) (fev/2026, terceiros) | matéria cita "centenas de milhões" de views **agregadas na hashtag** (terceiros, não é view de 1 vídeo — tratar como estimativa, não medido com precisão) | Sim, pra foco nos exercícios ("hora de ficar locked in nessa frase") |

Nenhuma tem view count por vídeo confirmado — registrando como `não medido` por honestidade (regra do CLAUDE.md:
nunca inventar número). Ficam propostas pro roteirista decidir se usa; se usar, registrar em `decisoes.md` como teste
sem dado prévio (critério de corte: comentários/mil citando a gíria).

## 4. Instrução pro roteirista (dia a dia, 19–25/10)

Regra: o currículo (T1, assunto por assunto) não muda. O hype só contextualiza a esquete V2 (storytelling) ou dá um
gancho de abertura; nunca entra na frase-alvo. **Vale só quando a publicação for destravada pelo Felipe** (ver nota
no topo deste arquivo).

| Data | Contexto do episódio (V1/V3) | Hype pra esquete V2 |
|---|---|---|
| 19/10 (seg) | Currículo segue conforme a grade (T1 E0N do dia) | Sem evento do dia; opção segura: contagem regressiva pra abertura da NBA (amanhã) ou reserva atemporal (turista gringo no café) |
| 20/10 (ter) | Currículo segue | **Abertura da NBA 2026-27** — ângulo "comentarista gringo de basquete" (buzzer beater, slam dunk, "he's on fire"); já tem roteiro pronto em `ponte/saida/roteiros-tema03.md`/`roteiros-tema04.md` usando esse hype (Felipe ainda não decidiu) |
| 21/10 (qua) | Currículo segue | Libertadores semis volta — **Palmeiras x Fluminense**, Nubank Parque — ângulo narrador gringo (What a goal!, beat, win — já aprovado em radares anteriores) |
| 22/10 (qui) | Currículo segue | Libertadores semis volta — **Flamengo x Estudiantes**, Maracanã — mesmo ângulo, variar o corte pra não repetir |
| 23/10 (sex) | Currículo segue | Sem evento do dia; opção segura: vocabulário de pós-jogo (final score, highlights, "who's going to the final") citando quem se classificou |
| 24/10 (sáb) | Compilação longa da semana (YouTube), conforme grade | Sem hype novo; fechar citando quem vai pra final da Libertadores e a 1ª semana completa de NBA |
| 25/10 (dom) | **BLOQUEIO — eleições, 2º turno.** Nenhum tema do dia; publicar só quadros neutros/atemporais | Nenhum hype — regra de bloqueio de eleição (já registrada em CLAUDE.md e nos radares anteriores) |

## 5. Resumo

- **Tema mais persistente da semana**: BTS – SWIM (6/6 dos radares disponíveis) — bom pra V1 de vocabulário, não
  cumpre a regra de hype anglófono do Felipe pra V2/storytelling.
- **Hype real aprovado pra esquete (cumpre a regra anglófona) e cai dentro desta semana**: Libertadores semis volta
  (21–22/10, Palmeiras x Fluminense e Flamengo x Estudiantes) e abertura da NBA 2026-27 (20/10).
- **Gíria vencendo**: "é um nervosismo surreal" vence em 31/10 (dentro de 13 dias) — fallback já pronto.
- **3 gírias novas propostas** (gag, tankar, locked in), todas do inglês, com fonte mas **sem view count por vídeo
  confirmado** — marcadas "não medido" em vez de inventar número.
- **Dia de bloqueio nesta semana**: 25/10 (eleições, 2º turno) — sem hype, só currículo neutro.
- **Gap de dados**: falta o radar diário de 2026-10-13 (arquivo não existe); contagens de persistência são sobre
  6 dias, não 7.
- **Fora do escopo deste radar, mas relevante**: a fábrica não publicou nenhum vídeo ainda; o gargalo é a decisão
  do Felipe sobre os 3 vídeos do assunto 1 no branch `midia` (aprovados desde 14/10, alertas urgentes em 16 e 17/10
  sem resposta registrada em `ponte/RESPOSTAS.md`).
