# Caçador de Tendências — Capi Lingo (26/09/2026)

Alvo: `docs/plano-capi-lingo.md` + `canal-idiomas/scripts/radar.py` (e como o radar alimenta `scripts/roteirista.py`).
Rede liberada: datas checadas na web hoje; fontes do radar testadas com `curl` hoje.
Rótulos: **verificado** (fonte oficial ou 2+ fontes de imprensa concordando) · **fonte única** · **divergente** · **estimativa**.

---

## (1) Diagnóstico em 3 linhas

1. O radar só enxerga o **hoje** (10 termos do Google Trends RSS, sem volume nem contexto) e manda a lista crua para o roteirista, e o hype cai **só às sextas**. Resultado: 5 dos 7 grandes ganchos da janela caem fora da sexta e se perdem.
2. A janela 26/09–05/11 é rica e **previsível**: Libertadores com 3 brasileiros nas semis, BTS em SP, Halloween, Dia do Professor, ENEM (tem inglês!) e F1 em Interlagos. Dá para **pré-produzir** 70% do hype com dias de antecedência, que é o ponto forte de um pipeline automático.
3. Outubro de 2026 é **mês de eleição** (04/10 e 25/10). O feed de tendências vai encher de política e crime, e hoje não existe filtro nenhum no código.

---

## Datas verificadas (base do calendário)

| Data | Evento | Status | Fonte |
|---|---|---|---|
| 29/09 (ter) | Brasil x Austrália (amistoso, Brisbane) | fonte única | [Diario de Pernambuco](https://www.diariodepernambuco.com.br/esportes-dp/selecao-brasileira/2026/09/11722982-amistosos-da-selecao-brasileira-em-2026-cbf-confirma-adversarios.html) |
| 03/10 (sáb) | Brasil x Índia (Calcutá) | fonte única (mesma matéria) | idem |
| 04/10 (dom) | Eleições, 1º turno | verificado | [TSE](https://www.tse.jus.br/comunicacao/noticias/2026/Marco/eleicoes-2026-confira-as-principais-datas-do-calendario-eleitoral) |
| 10/10 (sáb) | Zayn Malik, SP (Nubank Parque) | fonte única | [CNN Brasil](https://www.cnnbrasil.com.br/pop/musica/confira-a-agenda-de-shows-internacionais-no-brasil-em-2026/) |
| 12/10 (seg) | Dia das Crianças + N. Sra. Aparecida (feriado) | fixo | — |
| 14/10 (qua) | Libertadores semi (ida): Fluminense x Palmeiras | verificado | [CNN Brasil](https://www.cnnbrasil.com.br/esportes/futebol/futebol-internacional/libertadores-da-america/conmebol-define-datas-e-horarios-das-semifinais-da-libertadores-2026/) · [Conmebol](https://gol.conmebol.com/libertadores/en/news/dates-confirmed-conmebol-libertadores-semi-final-schedule-announced) |
| 15/10 (qui) | Libertadores semi (ida): Estudiantes x Flamengo · **Dia do Professor** · estreia de *Street Fighter* nos cinemas + relançamento de *Jogos Vorazes* | verificado / fixo / fonte única | idem · [Showmetech](https://www.showmetech.com.br/lancamentos-do-cinema-em-outubro-de-2026/) |
| 21–22/10 | Libertadores semis (volta), Nubank Parque e Maracanã | verificado | idem |
| 23/10 (sex) | *Lupin* T4 (Netflix) | fonte única | [Metrópoles](https://www.metropoles.com/entretenimento/netflix-divulga-lancamentos-de-outubro-veja-a-lista-completa) |
| 25/10 (dom) | Eleições, 2º turno | verificado | TSE |
| 28, 30 e 31/10 | **BTS "Arirang", MorumBIS** | **divergente** (CNN: 28/29/31; Rio Times e Showmetech, com o *live viewing* SP em 30/10: 28/30/31). Usar 28/30/31. | [Rio Times](https://www.riotimesonline.com/bts-sao-paulo-brazil-concerts-october-28-30-31-2026-morumbis-arirang-tour/) · [Ticketmaster](https://www.ticketmaster.com.br/event/bts-world-tour-arirang) |
| 30/10 (sex) | Pussycat Dolls, SP | fonte única | CNN Brasil |
| 31/10 (sáb) | **Halloween** / Dia do Saci | fixo | — |
| 02/11 (seg) | Finados (feriado; tom respeitoso, sem piada de morte) | fixo | — |
| 06–08/11 | F1 GP São Paulo, Interlagos (corrida dom 08/11, 14h) | verificado | [Exame](https://exame.com/esporte/gp-de-sao-paulo-2026-horario-ingressos-e-tudo-o-que-voce-precisa-saber/) · [Eventim](https://www.eventim.com.br/campaign/f1saopaulo) |
| 08/11 (dom) | **ENEM dia 1: Linguagens, com 5 questões de língua estrangeira** | verificado | [Agência Brasil](https://agenciabrasil.ebc.com.br/educacao/noticia/2026-05/enem-2026-inscricoes-comecam-na-segunda-provas-serao-em-novembro) |
| 14/11 | Brasil x Japão (Singapura) | fonte única | Diario de Pernambuco |
| 19/11 | GTA VI | verificado (Take-Two reafirma) | [Game Rant](https://gamerant.com/gta-6-release-date-november-2026-rockstar-north-assurances/) |
| 20/11 | *Jogos Vorazes: Amanhecer na Colheita* | verificado (uma fonte diz 19/11) | [Rolling Stone BR](https://rollingstone.com.br/cinema/quando-estreia-amanhecer-na-colheita-novo-filme-de-jogos-vorazes/) |
| 28/11 | Final da Libertadores (Centenario, Montevidéu) | verificado | [Wikipédia](https://pt.wikipedia.org/wiki/Final_da_Copa_Libertadores_da_Am%C3%A9rica_de_2026) · [Lance](https://www.lance.com.br/libertadores/uruguai-e-anunciado-como-sede-da-final-da-libertadores-2026.html) |
| contínuo | A Fazenda 18 (Record, estreou 14/09) · Brasileirão volta em outubro e vai até 02/12 | verificado | [O Tempo](https://www.otempo.com.br/entretenimento/2026/7/6/quando-estreia-a-fazenda-2026-adriane-galisteu-revela-a-data-oficial) · [Brasil 247](https://www.brasil247.com/tendencias/2026/09/23/brasileirao-so-volta-em-outubro-apos-a-28a-rodada-entenda-o-intervalo-e-veja-os-proximos-jogos/) |

O que **não** entra: política/eleição (todo o mês), a Copa (já passou, eliminação do Brasil = assunto amargo), crime e tragédia (o Trends de hoje já trouxe "tortura", "sargento" e "vice-prefeito").
Também fica fora a música do topo do Spotify BR (sertanejo e funk): não há gancho de inglês, e a letra tem direitos.

---

## Calendário editorial 26/09 → 05/11

Regra-mãe: **o evento-âncora troca o TEMA do quadro do dia, não o formato.** Assim a grade de rodízio continua valendo e o hype sai no dia certo, e não só na sexta.
Grade do plano: Seg Nível · Ter Você sabia · Qua Capi errou · Qui BR vs Nativo · Sex Hype · Sáb Mico/Pegadinha/Gíria · Dom longo.
Realidade do plano: a postagem só roda a partir da semana 3 (~12/10). Por isso as semanas 1–2 viram **banco pré-produzido**: os episódios dos eventos de data fixa já saem renderizados e agendados.

### Semana 0–1 (26/09–04/10): produção do banco, sem depender de hype
| Dia | Quadro | Tema/gancho | Inglês ensinado |
|---|---|---|---|
| 26–28/09 | — | Montar o `calendario.json` (melhoria nº 1) e pré-roteirizar os ~15 episódios de data fixa abaixo | — |
| 29/09 ter | Você sabia | Brasil x Austrália: "por que australiano fala *mate* e *arvo*?" | gírias AU vs US (mate, arvo, no worries) |
| 30/09 qua | Capi errou | "I have 30 years" | idade com *to be* |
| 01/10 qui | BR vs Nativo | Brasileiro no estádio × narrador gringo | *score, draw, penalty shootout, stoppage time* |
| 02/10 sex | Hype (**sem política**) | A Fazenda: "como se diz *roça, peão, prova de fogo*" | *reality show, eviction, to be voted out* |
| 03/10 sáb | Mico | Brasil x Índia: pronúncia de nomes de jogadores e de *Kolkata* | pronúncia |
| 04/10 dom | **Longo evergreen** | Dia de eleição: nada de hype. "Prova da Semana" genérica | — |

### Semana 2 (05–11/10)
| Dia | Quadro | Tema/gancho | Inglês |
|---|---|---|---|
| 05/10 seg | Nível 1→5 | Vocabulário de futebol (Brasileirão voltando) | *foul, offside, header, nutmeg (caneta!)* |
| 06/10 ter | Você sabia | "*Soccer* nasceu na Inglaterra, não nos EUA" (checar a etimologia na 2ª passada) | soccer × football |
| 07/10 qua | Capi errou | "I'm agree" | *I agree* |
| 08/10 qui | BR vs Nativo | Pedindo comida em show/estádio | *Can I get…*, *to go* |
| 09/10 sex | Hype | Zayn em SP (10/10): "Zayn saiu do One Direction. E você sabe usar *quit, leave, drop out*?" | quit/leave/drop out |
| 10/10 sáb | Gíria | *fanboy/fangirl, stan, bias* (já aquece o BTS) | gírias de fandom |
| 11/10 dom | Longo | "Inglês para ir a show internacional" (ingresso, fila, merch, encore) | vocabulário de show, perene |

### Semana 3 (12–18/10): início da postagem, semana mais forte
| Dia | Quadro | Tema/gancho | Inglês |
|---|---|---|---|
| 12/10 seg | Nível 1→5 | Dia das Crianças: "palavras que criança gringa sabe e você não" (humor adulto, **sem visual infantil**, por causa do risco "feito para crianças") | *toddler, tantrum, sippy cup* |
| 13/10 ter | Você sabia | "*Teacher's pet*": origem e uso (esquenta o Dia do Professor) | expressão |
| 14/10 qua | Capi errou | **Libertadores semi** (Flu x Palmeiras): "The match was very emotioned" | *exciting/thrilling* × *emotional* |
| 15/10 qui | BR vs Nativo | **Dia do Professor**: Capi homenageia; "como o aluno BR chama o professor × como o nativo chama" | *Teacher!* × *Mr./Ms. + sobrenome* |
| 16/10 sex | Hype | *Street Fighter* nos cinemas (15/10): "Hadouken, *K.O.*, *Round 1, Fight!*: o que significam?" | *knockout, round, combo* |
| 17/10 sáb | Pegadinha | Futebol: *pretend* (simular falta) ≠ pretender; *push* ≠ puxar | falsos amigos |
| 18/10 dom | Longo | "Narração de futebol em inglês: 20 frases" | perene; reaproveitar na final de 28/11 |

### Semana 4 (19–25/10): 2º turno no fim da semana
| Dia | Quadro | Tema/gancho | Inglês |
|---|---|---|---|
| 19/10 seg | Nível 1→5 | Jogos Vorazes relançado: níveis "Distrito 12 → Capitólio" | *tribute, arena, to volunteer* |
| 20/10 ter | Você sabia | "*Checkmate*" e "*deadline*": origens curiosas (checar os fatos) | etimologia |
| 21/10 qua | Capi errou | **Semi de volta**: "Palmeiras won Fluminense" | *beat* × *win* |
| 22/10 qui | BR vs Nativo | **Semi de volta** (Flamengo): "Brasileiro comemorando × gringo comemorando" | *Let's go!, What a goal!* |
| 23/10 sex | Hype (**sem política**) | Resultado das semis → "Final em Montevidéu: como se diz *final única, prorrogação, pênaltis*" | *one-legged final, extra time* |
| 24/10 sáb | Gíria | *ARMY, comeback, era* (BTS chegando) | gíria de fandom |
| 25/10 dom | **Longo evergreen** | Dia de eleição. "Prova da Semana" | — |

### Semana 5 (26/10–01/11): BTS + Halloween (pico do teste de 14 dias)
| Dia | Quadro | Tema/gancho | Inglês |
|---|---|---|---|
| 26/10 seg | Nível 1→5 | Halloween: *trick or treat* → *jack-o'-lantern* → *haunted* → *eerie* → *uncanny* | vocabulário de terror |
| 27/10 ter | Você sabia | "Halloween vem de *All Hallows' Eve*" | origem |
| 28/10 qua | Capi errou | **BTS dia 1**: "I'm fan of BTS since 2015" | *I've been a fan… since* |
| 29/10 qui | BR vs Nativo | Fã BR na fila × fã gringo | *line up, merch, sold out* |
| 30/10 sex | Hype | **BTS + Pussycat Dolls** no mesmo dia: "Don't Cha: o que quer dizer?" (só a letra curta, sem áudio original) | contrações informais (*don't cha, gonna, wanna*) |
| 31/10 sáb | Hype extra | **Halloween × Dia do Saci**: "Saci em inglês?" (quadro 11, Ao pé da letra) | *one-legged imp* + expressões de susto |
| 01/11 dom | Longo | "Inglês que caiu no ENEM: 10 palavras que mais aparecem" (conferir nas provas anteriores do INEP) | abre o funil ENEM |

### Semana 6 (02–05/11): ENEM + F1
| Dia | Quadro | Tema/gancho | Inglês |
|---|---|---|---|
| 02/11 seg | Nível (tom leve) | Finados: **não** tematizar. Usar "Falsos cognatos que o ENEM ama" | *actually, eventually, pretend* |
| 03/11 ter | Você sabia | "O ENEM tem 5 questões de inglês. Dá para acertar sem saber inglês? Cognatos" | estratégia de cognatos |
| 04/11 qua | Capi errou | F1: "Colapinto did a great career" (o Trends de hoje já mostra Colapinto/Norris em alta) | *make/do* |
| 05/11 qui | BR vs Nativo | Interlagos: narrador BR × narrador inglês | *pole position, pit stop, overtake, box box* |

Depois da janela (já roteirizar em 05/11): ENEM 08/11 · F1 08/11 · Brasil x Japão 14/11 · GTA VI 19/11 (enorme: "inglês do GTA", gírias) · Jogos Vorazes 20/11 · Final da Libertadores 28/11.

**Canais ES/EN (depois):** Libertadores e F1 servem direto para o Adiós Portuñol (hispanofalantes vivem a Libertadores), com o gancho "como o narrador brasileiro grita gol".

---

## (2) Top 5 melhorias no radar (impacto ÷ esforço)

Custo de todas: **US$0** (fontes grátis). Tempo estimado para o Claude implementar: 2–4 h no total. Impacto financeiro: nenhum gasto; o ganho vem de acertar o timing dos maiores picos de busca do ano.

### 1. `radar/calendario.json` + "evento-âncora do dia" (impacto ALTO, esforço BAIXO)
- Arquivo versionado com `{data, evento, categoria, seguro: true/false, antecedencia_dias, ganchos_ingles[]}`, preenchido com a tabela acima.
- `radar.py` inclui no JSON do dia `"ancoras": [eventos com data−antecedência ≤ hoje ≤ data]` e `"bloqueio": true` em 04/10 e 25/10.
- `roteirista.py`: se houver âncora, ela vira o TEMA do quadro da grade (qualquer dia, não só sexta). Se houver bloqueio, o quadro sai evergreen.
- Na prática, é o que tira o hype da sexta e permite **pré-render D−3** (os vídeos já saem agendados).

### 2. Filtro de segurança + contexto do Trends (impacto ALTO, esforço BAIXO)
- O RSS já traz `ht:approx_traffic` (ex.: "2000+") e `ht:news_item_title` (ex.: "Norris pede suspensão de Colapinto…"). Testei hoje e os dois vêm no feed. O `trends()` joga fora os dois.
- Parsear título + tráfego + 1 manchete. Bloquear por palavra na manchete e no título: eleição, candidato, prefeito, deputado, governador, presidente, STF, PT/PL, morte, morre, tortura, assassinato, preso, polícia, sargento, acidente, tragédia, estupro, aposta/bet.
- Passar a manchete ao roteirista: sem ela o LLM chuta o que o termo significa (ex.: "antonio fagundes" pode ser novela ou notícia ruim).

### 3. Score de hype (novo), separado do score de demanda
```
hype = log10(tráfego_BR) × seguro × encaixe × (1 + 0,5·em_2+_fontes) × (1 + 0,5·subindo)
encaixe: esporte/música internacional/cinema/série/game = 1,0 · TV/reality = 0,8 · resto = 0,3
subindo: aparece hoje e não aparecia no radar de ontem (salvar histórico já existe em radar/*.json)
```
- **Teste de "vira aula?"**: para os 5 melhores, rodar o `autocomplete()` que já existe com `"{termo} em inglês"` e `"como se diz {termo}"` (hl=pt, gl=BR). Se voltarem sugestões, há demanda de aprendizado. Custa 5 chamadas.

### 4. Três fontes novas, grátis e testadas hoje
| Fonte | Endpoint | Status hoje | Por quê |
|---|---|---|---|
| Wikipédia PT, top artigos do dia | `https://wikimedia.org/api/rest_v1/metrics/pageviews/top/pt.wikipedia/all-access/AAAA/MM/DD` (User-Agent obrigatório) | **funcionou** (JSON) | Pega séries, filmes e famosos que o Trends ignora. Precisa do filtro (veio "Fotos dos Mamonas Assassinas mortos") |
| Spotify BR diário via kworb | `https://kworb.net/spotify/country/br_daily.html` (+ `global_daily.html`) | **funcionou** (HTML simples) | Usar só as faixas em **inglês/K-pop** do top 50 como gancho de letra curta. O topo BR é sertanejo/funk, sem gancho |
| YouTube Data API `videos.list?chart=mostPopular&regionCode=BR` | chave grátis, 1 unidade por chamada (cota padrão 10 mil/dia) | a configurar (doc oficial) | A página "Em alta" do YouTube **acabou em jul/2025** ([TechCrunch](https://techcrunch.com/2025/07/10/youtube-is-getting-rid-of-its-trending-page-and-trending-now-list), [Variety](https://variety.com/2025/digital/news/youtube-trending-page-shutting-down-1236452150/)). Testei: a página não traz mais vídeos. A API é a via oficial |

Não funcionou (não gastar tempo): Reddit JSON (sem resposta), Apple Music RSS (vazio), TikTok Creative Center (redireciona e exige JS/login). O TikTok continua **manual**: 5 min na segunda de manhã, e o Felipe cola 3 hashtags em `radar/manual.txt`, que o radar lê.

### 5. Corrigir o score de demanda (hoje ele mede ruído)
- Evidência no radar de hoje: o topo "en-para-brasileiros" é "erros de gravação stranger things ingles" (mediana de 2,8M) e o topo MX é "portugues brasileño canciones" (maior vídeo com **1,28 bi** de views = clipe de música, não aula). Esses dois são ruído, não demanda de aula.
- Como corrigir: (a) no `search()` com `gl=BR`, usar `hl=pt`, porque hoje é sempre `hl=en`; (b) só contar vídeos cujo título tenha termo de aula (inglês/english/aprender/como se diz/pronúncia/aula) e descartar os com >50M; (c) exigir ≥5 vídeos válidos, senão score 0.
- `TREND_GEOS` MX/US não serve ao canal atual (inglês para BR). Deixar só BR até os canais ES/EN existirem, o que economiza tempo de execução.

---

## (3) Erro oculto

**O pipeline manda tendências cruas, incluindo crime e política, direto para o roteirista em pleno mês de eleição, e a única trava é uma frase no prompt.**
O radar de hoje já entregou "tortura", "sargento" e "vice-prefeito" na lista BR. Nas semanas de 1º turno (28/09–04/10) e de 2º turno (19–25/10) a maioria dos termos em alta será política. Uma sexta de Hype em 02/10 ou 23/10 com a IA "escolhendo o assunto mais natural" pode render um vídeo de "vocabulário da eleição" com cara de lado político. Isso gera derrubada de alcance, comentários tóxicos e risco de marca no canal novo, justo no teste de 14 dias.
Correção: melhoria nº 2 (bloqueio no código, não no prompt) + `bloqueio: true` nas datas de eleição (nº 1).
Achado extra, pequeno: a `GRADE` do `roteirista.py` não bate com o plano (sábado = só "pegadinha" e domingo = "nivel", quando no plano domingo é o vídeo longo). Alinhar ao ligar o agendamento.

---

## (4) Nota do estado atual (tendências/timing): **4/10**

- Tem: radar diário funcionando, a demanda de busca (autocomplete + busca YouTube) é uma boa ideia, e o roteirista já recebe o hype.
- Falta para 10:
  1. calendário de eventos com antecedência e pré-render (nº 1);
  2. filtro de segurança no código (nº 2);
  3. score de hype com volume, "subindo" e "vira aula?" (nº 3);
  4. 3+ fontes cruzadas (nº 4);
  5. demanda sem ruído de clipe e de série (nº 5);
  6. fechar o ciclo: a retenção de cada vídeo de hype volta para o radar e ajusta os pesos de `encaixe` (depende da etapa 8 do plano, Métricas).

**Próximo passo:** autorizar o Claude a implementar as melhorias 1 e 2 (`calendario.json` + filtro) antes de 02/10, a primeira sexta de Hype em semana de eleição.
