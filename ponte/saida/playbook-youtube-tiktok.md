# Playbook YouTube + TikTok do CapyFala: o que dá dinheiro · 29/10/2026

Estudo pedido pelo Felipe em 29/10 ("bora ficar ninja em YouTube e TikTok"). **Nada foi publicado, nenhum código mudou e
nenhuma rotina mudou.** As ações abaixo são propostas, e o Felipe decide quais ligar.

**Como ler as fontes:**
- **(oficial)**: Central de Ajuda do YouTube, blog.youtube, doc da Data API, TikTok Support, termos ou Diretrizes. Data = a
  da página ou "lida 29/10" quando a página não mostra data.
- **(terceiro)**: blog, agregador ou página de canal. Serve só como apoio.
- **não verificado**: não achei na fonte oficial.
- **estimativa minha**: conta feita por mim, com as premissas à mostra.

Para não repetir o que já existe: este documento só repete, de `docs/pesquisas/2026-09-26-canais-conteudo-tendencias.md`,
`youtube-longo.md` e `serie-vocabulario.md`, o necessário para a conta. O que é novo vem marcado com 🆕.

---

## Resumo em 10 linhas

1. **O dinheiro de anúncio do YouTube está no vídeo LONGO.** As horas que contam para o YPP são só as de vídeo longo, porque as do
   feed de Shorts não contam (oficial, answer/72851). O longo diário de 3–4 min **não tem mid-roll**: o mid-roll só existe
   em vídeo com 8 min ou mais (oficial, answer/6175006). Quem rende anúncio é a revisão de domingo de 10–12 min.
2. 🆕 **Régua de 01/02/2027 (oficial, blog.youtube 10/08/2026):** para entrar com anúncios, 1.000 inscritos + **8.000 h** ou
   20M de Shorts. Quem já está dentro não é afetado. **Não existe regra de transição publicada** para candidatura
   pendente. A revisão humana leva **cerca de 1 mês** (oficial, answer/72851). Então a meta real seria estar **aprovado**
   antes de 01/02, e pela conta do §(c) isso é improvável.
3. 🆕 **O nível de entrada (fan funding) não muda em 01/02:** 500 inscritos + 3 envios em 90 dias + 3.000 h ou 3M de Shorts
   (oficial, answer/13429240; o Brasil está na lista). Libera Membros, Super Thanks e Shopping, com 70% para o criador.
   Mas **o Hype só vale para quem já está no YPP** (oficial, answer/15509925).
4. 🆕 **Quase tudo que faz crescer exige os "recursos avançados" do Studio, e isso só o Felipe libera:**
   - vídeo relacionado no Short (Short → longo), capítulos, teste A/B de título e miniatura, comentário fixado,
     links clicáveis e playlist "série oficial";
   - miniatura personalizada pede telefone verificado; sem isso o `thumbnails.set` do `subir_longo.py` dá **403**.
   - Fontes (oficial): answer/9890437 e doc da `thumbnails.set` (15/10/2026).
5. 🆕 **A dublagem automática do YouTube vem LIGADA.** Ela gera faixas EN e ES a partir do áudio original, e numa aula que
   mistura PT e EN isso estraga a lição (oficial, answer/15569972). E o `subir_longo.py` declara o áudio como **inglês**
   (`defaultAudioLanguage: "en"`), quando a explicação é em português. Detalhe no §(b).
6. **TikTok paga no Brasil (Creator Rewards):**
   - requisitos: **conta pessoal**, 10 mil seguidores, 100 mil views em 30 dias e vídeo **≥ 1 min**;
   - 🆕 cada vídeo só começa a render depois de 1.000 views qualificadas, que são as do For You com mais de 5 s;
   - 🆕 o valor por mil sobe com retenção, **tráfego da busca**, 1080p e nicho fixo (oficial, TikTok Support);
   - os cortes de 5–28 s **nunca** rendem.
7. 🆕 **TikTok Shop não serve para vender curso:** produto digital e serviço são proibidos no Shop BR (oficial, política de
   17/08/2026). O caminho é o link na bio, que exige 1.000 seguidores, com o aviso de conteúdo comercial ligado.
8. 🆕 **Afiliado que encaixa:** **Cambly Ambassador**, "a partir de US$30" por conversão, pago por PayPal (oficial,
   cambly.com/ambassador). Os grandes canais BR de inglês usam o Cambly em vídeo de review perto da Black Friday (terceiro).
   Open English **proíbe divulgação em vídeo** (terceiro). Wizard, Fisk e CNA não têm programa público.
9. 🆕 **A política do YouTube aprova com todas as letras** "série com os mesmos personagens em que cada episódio tem história
   própria" e "IA para dar forma a um personagem que você inventou". Mas **reprova**:
   - "personagens na mesma situação, com o mesmo desfecho", que é o nosso maior risco;
   - "baixo valor educativo";
   - "animais em sofrimento exagerado".
   - Fonte (oficial): answer/1311392.
10. **A brecha de mercado continua aberta:** nenhum canal BR junta animação + pré-A1 na ordem CEFR + elenco adulto fixo +
    série numerada. Os animados que crescem (Window English, Merry English) são só em inglês (terceiro, páginas dos canais).

---

## (a) As 10 ações de maior retorno em R$, ranqueadas

Câmbio usado: US$1 = R$5,12 (terceiro, Upload-Post 09/2026).

RPM de vídeo longo com público brasileiro: **US$0,8–1,5 por mil views (R$4–8)**. Essa é uma estimativa minha, apoiada em
dois terceiros: TubeAnalytics (27/06/2026) dá RPM de educação BR de US$1,50 e diz que o número é "ilustrativo";
Upgrowth (17/09/2026) dá CPM médio BR de US$1,64. O YouTube não publica RPM (oficial, answer/72902).

| # | Ação | Por que dá dinheiro | Custo | Prazo | Já fazemos? | Fonte |
|---|---|---|---|---|---|---|
| 1 | **Felipe libera os recursos avançados e verifica o telefone** no Studio (Configurações > Canal > Qualificação para recursos) | É o cadeado de 7 alavancas: miniatura via API, vídeo relacionado, capítulos, A/B, comentário fixado, série oficial e links. Também é **pré-requisito do YPP**, junto com a verificação em 2 etapas e o AdSense | R$0, ~15 min do Felipe | hoje | **Não confirmado** (plano-de-acao: "verificar telefone" ⏳ desde 28/09) | answer/9890437 · answer/72851 (oficial, lidas 29/10) |
| 2 | **Upload automático do longo funcionando de verdade.** O `subir_longo.py` já existe; faltam o `--autorizar` do Felipe e **1 teste** de que o vídeo não fica "Privado (bloqueado)" | Sem o longo no ar não existe hora de YPP. A doc da API se contradiz: em 2020 dizia que projeto não auditado sobe vídeo privado; a página de 15/10/2026 diz que "não é restrito". Como o script usa `publishAt` (privado → público), um bloqueio prenderia **todos** os longos no privado | R$0; 10 min do Felipe + 1 teste | esta semana | Script pronto, OAuth pendente | developers.google.com/youtube/v3/docs/videos/insert (15/10/2026) e revision_history (28/07/2020) (oficial) |
| 3 | **Episódio completo semanal de 20–30 min** ("Ep. N completo", com as 3 partes, revisão e prática), além ou no lugar da revisão de domingo | Rende **mid-roll e anúncio em sequência**, porque passa de 8 min, e muitas horas por view. O Window English mostra que a "Full Series" de 1 h fez ~5× as views de cada parte. Conta: 10 mil views/mês × 6 min médios = 1.000 h/mês, ¼ da meta do YPP | ~8 min de render por semana, R$0 de voz (reaproveita cache) | 2 semanas (decisão de formato = Felipe) | Parcial: a revisão de domingo de 10–12 min está planejada | answer/6175006 e answer/2467968 (oficial); youtube.com/@WindowEnglish (terceiro, 29/10) |
| 4 | **Afiliado Cambly** na descrição do longo, no comentário fixado e em 1 capítulo "dica do café" por semana; campanha de Black Friday em 27/11. Marcar "promoção paga" quando houver menção falada | Encaixa no público "com medo de falar": conversar com nativo. Conta: 1.000 cliques/mês × 0,3% = 3 conversões × US$30 = **~R$460/mês**. Funciona **antes** do YPP | R$0; cadastro do Felipe | 1 semana (cadastro); Black Friday em 4 semanas | Não | cambly.com/ambassador (oficial, 29/10) · answer/154235 (oficial) |
| 5 | **Isca grátis + produto próprio no Kiwify (PIX):** PDF "as frases da T1, com áudio" grátis em troca do WhatsApp ou e-mail, depois "Apostila T1 + áudios" a R$27–47 | O produto próprio é a renda que **não depende de RPM baixo**. Faixa de mercado: e-book R$10, curso gravado R$297 (terceiros). Conta: 100 mil views/mês × 0,2% = 200 leads × 3% = 6 vendas × R$37 = **~R$220/mês** no começo, crescendo com a base | ~1 sessão para montar o PDF a partir dos JSONs; taxa do Kiwify | 3–4 semanas | Não (já mapeado como ideia em set/26) | renda-reversa §A2 (terceiros); regra de venda BR do CLAUDE.md |
| 6 | **Todo Short com "vídeo relacionado" → o longo do mesmo assunto** (Studio > Conteúdo > Short) | É a única ponte clicável do Short para o longo, que é onde estão as horas. O YouTube avisa que trocar de formato "não é comum", então o efeito é moderado, mas o custo é quase zero. **A API não tem esse campo**: precisa de clique no Studio | 1 min por Short do Felipe (ou do Claude do PC, se o Felipe autorizar) | depois da ação 1 | Não | answer/14075157 e answer/16559651 (oficial, lidas 29/10); doc `videos` (15/10/2026) |
| 7 | **TikTok pago desde o 1º vídeo:** conta **pessoal** confirmada; sitcom e vocab sempre **≥ 61 s, 1080p**, tema fixo; palavra-chave de busca **falada, na tela e na legenda** (ex.: "inglês do zero", "como dizer oi em inglês") | O CRP só paga vídeo postado depois da aprovação e com mais de 1 min. O bônus "Additional Reward" premia 1080p, mais de 1 min e nicho fixo, e o valor por mil inclui o "search value". Conta (terceiro, RPM de US$0,36–1,04): 1M views qualificadas/mês ≈ **R$1,8–5,3 mil/mês** depois de 10 mil seguidores | R$0 (os vídeos já têm 61–75 s) | já; a palavra-chave é ajuste de legenda | Parcial: as durações já cumprem; conta pessoal sem confirmação escrita | tiktok.com/support/faq_detail?id=7581821550694013452 e id=7543897461245450808 (oficial, lidas 29/10) · termos CRP BR (abr/2025) |
| 8 | **Teste A/B (Test & Compare) em todo longo:** 3 títulos ou 3 miniaturas | O vencedor é escolhido por **tempo de exibição**, que é exatamente o que conta para o YPP. Não funciona em Shorts. Grátis | R$0; 3 variações geradas pela rotina, a ativação é no Studio desktop | depois da ação 1 | Não | answer/13861714 (oficial, lida 29/10) |
| 9 | **Playlist por temporada como "série oficial"** + capítulos em todo longo + tela final apontando para a próxima parte | A série oficial faz o YouTube destacar e recomendar os outros vídeos da playlist, o que aumenta as views seguidas e as horas. `playlistItems.insert` custa 50 unidades na API | R$0 | depois da ação 1 | Capítulos sim (pacote do longo); playlist não | answer/6084043, /9884579 e /6388789 (oficial, lidas 29/10) |
| 10 | **Preparar a entrada no fan funding (500 inscritos + 3.000 h):** W-8BEN, AdSense e "não é para crianças" já marcados, e a seção "Sobre" com a autoria humana (quem cria, o método CEFR, o elenco) | No dia da régua a candidatura entra na fila na hora. A seção "Sobre" é lida pelo revisor do YPP. Sem W-8BEN a retenção é de **24% de tudo**; com ele, de até 30% só da receita vinda de espectadores dos EUA | R$0, ~30 min do Felipe | antes de 500 inscritos | Não | answer/13429240, /1311392 e /10391362 (oficial, lidas 29/10) |

**Fora do top 10, de propósito:**
- TikTok Shop afiliado: exige 1.000 seguidores e só vende produto físico (5–20% de comissão, terceiro). Rende pouco e
  não combina com o canal.
- LIVE com presentes: exige 1.000 seguidores, e LIVE em loop automático fica fora do For You.
- Series pago no TikTok: tira o vídeo do CRP e a ativação no BR não foi verificada.
- Membros do YouTube: só depois do YPP.
- Shopping do YouTube: entrada por convite.

---

## (b) Regras que podem DESMONETIZAR ou derrubar a conta, aplicadas a nós

| # | Regra (texto oficial resumido) | Onde nos pega | Risco | Como evitar | Fonte |
|---|---|---|---|---|---|
| 1 | **YouTube, conteúdo inautêntico:** não monetiza "personagens na mesma situação, com o mesmo desfecho", "baixo valor educativo", pouca variação entre vídeos e "IA com templates genéricos que parecem produção em massa" | **Sitcom:** "Capy trava e consegue" em todo episódio. **Vocab:** 10 ciclos iguais de ~4 s, que o próprio juiz já apontou | **ALTO**: é reprovação no YPP ou desmonetização do canal inteiro | Cada episódio com história e desfecho **próprios**: quem resolve muda, às vezes a Capy erra e fica com o erro, gancho diferente. O portão deveria checar "desfecho repetido nos últimos 10" (proposta, não implementada) | answer/1311392 (oficial, lida 29/10; mudança de 15/07/2025) |
| 2 | **YouTube:** a mesma página **aprova** "série com o mesmo elenco em que cada vídeo tem história, foco ou conceito próprio" e "IA para dar forma a um personagem e uma história que você inventou", desde que o resultado mostre "sua visão criativa" | É exatamente o nosso modelo. É a defesa a escrever na seção "Sobre" e na descrição | — | Deixar a autoria visível: currículo CEFR, bordões, café Bean There, temporadas | answer/1311392 (oficial) |
| 3 | **YouTube:** não monetiza "cenas repetidas de animais em sofrimento ou perigo exagerado" | Elenco 100% animal | Médio | Nunca usar "Capy em apuros" como fórmula de gancho; o erro é cômico, não sofrimento | answer/1311392 (oficial) |
| 4 | **YouTube, conteúdo reutilizado / pouca variação:** o canal é avaliado como um todo | O longo "Dia N" junta 3 peças que já foram ao ar como Shorts. O próprio conteúdo não é "reutilizado" (a regra é sobre material de terceiros), mas um longo que só cola Shorts pode parecer "pouco valor novo" (inferência minha) | Médio | Todo longo com material **novo**: aula falada, exercício "sua vez" exclusivo, revisão. O episódio completo da ação 3 também precisa de bloco inédito | answer/1311392 (oficial) |
| 5 | **YouTube, "feito para crianças":** personagens animados, linguagem simples e "educação infantil" são 3 fatores oficiais | Batemos nos 3 | **ALTO**: comentários, sininho, membros, telas finais, playlist e anúncio personalizado somem | Canal declarado "não é para crianças" (Configurações > Canal > Avançadas); `selfDeclaredMadeForKids: false` (já no `subir_longo.py` e no `publicar.py`); temas adultos; **nunca** "kids" em título, descrição ou tag. O exemplo oficial "animação que agrada a todos" é público geral | answer/9528076 e /9527654 (oficial, lidas 29/10) |
| 6 | 🆕 **YouTube, dublagem automática ligada por padrão** | Aula PT+EN dublada estraga a lição. E o `subir_longo.py` declara `defaultAudioLanguage: "en"`, embora a voz que explica seja em português. Isso também afeta as legendas automáticas e a busca. Erro oculto: **não mexi no código** | Médio (qualidade) | Felipe desliga a dublagem automática ou liga "revisar antes de publicar" (Configurações > Canal > Avançadas). Trocar para `pt-BR` é decisão do Felipe, numa sessão de código | answer/15569972, /6304325 e /13338784 (oficial, lidas 29/10) |
| 7 | **YouTube, divulgação de IA:** obrigatória só para conteúdo **realista**. Animação irreal dispensa, e divulgar não afeta alcance nem dinheiro. **Música de IA que é o foco do vídeo exige divulgação** | A capivara animada dispensa. Mas um vídeo-**música** feito com Lyria (estudo de música autoral) **exige** a marcação. Hoje o `subir_longo.py` manda `containsSyntheticMedia: True` em todo longo, o que não é obrigatório nem proibido. Deixar ligado só põe o selo | Baixo / médio (vídeo-música) | Vídeo em que a música é o centro → marcar sempre. Longo sem música de IA em destaque → opcional | answer/14328491 (oficial) · doc `videos` `status.containsSyntheticMedia` (desde 30/10/2024) |
| 8 | **YouTube, strike ativo bloqueia a candidatura ao YPP.** Reprovação: recurso em 21 dias, nova tentativa em 30 dias (90 dias a partir da 2ª) | Música de terceiros, imagem de marca (Oscar, NBA) em miniatura | Médio | Só trilha própria ou CC0; hype de marca só no texto, nunca com logo | answer/72851 e /9235730 (oficial) |
| 9 | **TikTok, conta Business não entra no Creator Rewards** | @acapyfala | **ALTO se estiver errado** | Felipe confere: Configurações > Conta > tipo = **Pessoal**. Já é a decisão, mas falta a confirmação escrita (tarefas-navegador.md) | termos CRP BR (abr/2025); faq id=7581821550694013452 (oficial) |
| 10 | **TikTok, "não original" no CRP:** "looping videos, single or multiple photos, or only text overlays" e "fixed texts" não contam | Vocab com cara de slide de texto, carrossel de fotos | Médio | Vocab sempre com cena animada, voz e personagens se mexendo (já é assim); carrossel só para alcance, nunca contando com o CRP | faq id=7581821550694013452 (oficial, lida 29/10) |
| 11 | 🆕 **TikTok, spam por automação:** "using automation to run many accounts or **send repetitive content**" e "scripts para burlar o sistema" podem tirar a conta do For You **e da busca** | Fábrica 100% automática postando pelo Buffer | Médio | 1 conta só, posts diferentes entre si, nunca o mesmo vídeo repostado, sem engajamento automático (curtir ou comentar por robô). Que postar pelo Buffer seja permitido: **não verificado**, porque a regra não fala de agendador | community-guidelines/integrity-authenticity (oficial, versão de 25/08/2026) |
| 12 | **TikTok, fora do For You:** "afirmações enganosas para inflar views", "segue que eu sigo" e incentivo falso | Gatilhos de legenda | Baixo (o portão já proíbe "fluente em X dias", urgência inventada) | Manter a lista PROIBIDO do `portao.py` | community-guidelines/fyf-standards (oficial, 25/08/2026) |
| 13 | **TikTok, rótulo de IA:** obrigatório só para pessoa ou cena realista. TTS genérico e estilo artístico dispensam. Rotular "não afeta a distribuição". Se o arquivo tiver C2PA, o rótulo entra sozinho e não sai | Hoje `AI_LABEL tiktok = True` | Nenhum | Manter (decisão do Felipe). Nada a fazer | community-guidelines/integrity-authenticity; faq id=7636670084747893268 (oficial) |
| 14 | **TikTok, divulgar produto próprio** (PDF, curso) sem ligar o "content disclosure" pode derrubar o alcance ou restringir a conta | Ações 4 e 5 | Médio quando começar a vender | Toda legenda com oferta → disclosure ligado | community-guidelines/regulated-commercial-activities (oficial, 25/08/2026) |
| 15 | **TikTok, vídeo ligado a uma Series pago sai do CRP** | Se um dia o Series for usado | Baixo | Não usar o Series agora | faq id=7581821550694013452 (oficial) |

---

## (c) Metas mensais até 01/02/2027, com a conta

**Ponto de partida:** os 1os posts saíram em 28/10/2026. Ainda **não há nenhum dado**: `metricas/posts.csv` vazio e
`resumo.json` de 26/09.

**A conta das horas de YPP** (só vídeo longo; o feed de Shorts não conta):
```
horas = views do longo × duração média assistida (min) ÷ 60
```

**Premissas** (estimativa minha; corrigir com o dado real a partir da semana 2):
- longo de 3–4 min → ~1,5 min médio assistido (≈ 40%);
- domingo ou episódio completo (10–30 min) → ~4–6 min;
- Short → inscrito: ~1 a cada 1.000 views (0,1%). Hipótese sem fonte oficial, a medir.

**Cenário A, "corrida pelo YPP antigo" (4.000 h aprovadas antes de 01/02):** a revisão leva cerca de 1 mês, então seria
preciso bater 1.000 inscritos e 4.000 h até ~31/12, ou seja, em **63 dias**.
- 4.000 h ÷ 63 dias = **63 h/dia** = 3.800 min/dia.
- Com 1,5 min médio, isso dá **~2.500 views de longo por dia (~76 mil/mês) já em novembro**.
- Para um canal que começou ontem, minha estimativa é de **menos de 10%** de chance. Não planejar em cima disso, mas
  tentar não custa: as ações 1, 2, 3, 6 e 9 são as mesmas dos dois cenários.

**Cenário B, "base" (o plano):** fan funding em fev–mar/2027 e anúncios pela régua nova (8.000 h em 365 dias ≈ 22 h/dia ≈
880 views de longo por dia com 1,5 min, ou bem menos com o episódio completo) no 2º–3º trimestre de 2027.

| Mês (fim) | YouTube inscritos | Horas de longo (acumuladas, 12 meses) | Views de Shorts no mês | Views de longo no mês | TikTok seguidores | TikTok views no mês | Como chegar (a conta) |
|---|---|---|---|---|---|---|---|
| **nov/26** | 250 | 250 h | 250 mil | 10 mil | 1.500 | 300 mil | 60 Shorts × ~4 mil views = 240 mil → ~250 inscritos a 0,1%. 10 mil views de longo × 1,5 min = 250 h |
| **dez/26** | 700 | 900 h | 600 mil | 25 mil | 5.000 | 800 mil | Longo diário + 4 domingos (10–12 min, ~4 min médios): 22 mil × 1,5 + 3 mil × 4 = ~750 h. A Black Friday do Cambly (27/11) mede o 1º clique |
| **jan/27** | 1.200 | 2.000 h | 1 milhão | 45 mil | 10.000 | 1,5 milhão | Episódio completo semanal (ação 3): 4 × 5 mil × 6 min = 2.000 h só nele. Com 10 mil seguidores e 100 mil views em 30 dias no TikTok → **pedir o Creator Rewards** |
| **01/02/27** | — | — | — | — | — | — | Régua nova. Se o cenário A não aconteceu: alvo seguinte = **500 inscritos + 3.000 h → fan funding** (fev–mar) e **8.000 h → anúncios** (~jun–set/2027) |

**Receita esperada até 01/02 (estimativa minha):**
- anúncio do YouTube: **R$0**, porque não haverá YPP;
- Creator Rewards: R$0 até a aprovação (só paga vídeo postado depois dela);
- Cambly: **R$0–460/mês**;
- produto próprio: **R$0–220/mês**.

Ou seja: **até fevereiro o dinheiro vem só de afiliado e produto**, e é por isso que as ações 4 e 5 estão no top 5,
mesmo valendo menos que o anúncio no longo prazo.

**Regra de recalibrar:** se na semana 4 (25/11) as views de longo estiverem abaixo de 50% da meta de novembro, cortar o
longo diário para 3 por semana e pôr o esforço no episódio completo semanal. É mais hora por view com menos render.
O corte precisa de dado e vai para o `decisoes.md`.

---

## (d) O que medir toda semana e onde ler

| Métrica | Meta / alerta | Onde ler | Fonte |
|---|---|---|---|
| **Horas de exibição do longo** (públicas, 12 meses) | ver §(c) | Studio > Ganhar dinheiro (barra do YPP) e Análises > Visão geral, filtro "Vídeos" | answer/72851 (oficial) |
| **Inscritos ganhos por vídeo** | ≥ 1 a cada 1.000 views de Short (hipótese) | Studio > Análises > Conteúdo > "Inscritos" por vídeo | Studio (oficial) |
| **Duração média e % assistido do longo** + curva de retenção | ≥ 40% no longo de 3–4 min | Studio > vídeo > Análises > Engajamento | answer/16559651 (oficial) |
| **"Ficaram para assistir"** (Shorts) e views engajadas | sem meta oficial; comparar com a mediana do canal | Studio > Análises > Conteúdo > Shorts | answer/12220281 (oficial) |
| **Fontes de tráfego do longo** (Shorts / vídeo relacionado / busca / sugeridos) | % vinda de "Shorts" deve subir depois da ação 6 | Studio > Análises > Conteúdo > Fontes de tráfego | Studio (oficial) |
| **CTR de impressões + vencedor do A/B** | vencedor = tempo de exibição | Studio > vídeo > Test & Compare | answer/13861714 (oficial) |
| **Quando o público está online** | trocar o horário só com 28 dias de dado (o YouTube diz que o horário "não tem impacto conhecido" no longo prazo) | Studio > Análises > Público | answer/9314416 e /141805 (oficial) |
| **TikTok: tempo médio assistido, % que viu até o fim, origem (For You x Busca), seguidores** | % de busca subindo (ação 7) | TikTok Studio > Analytics | creator-academy tool-analytics-intro (oficial, só pela busca) |
| **TikTok: progresso do Creator Rewards** (10 mil seguidores + 100 mil views em 30 dias) | jan/27 | TikTok Studio > Monetização | termos CRP BR (oficial) |
| **TikTok: horários mais ativos dos seguidores** | — | TikTok Studio > Analytics > Seguidores ("Most active times", últimos 7 dias) | creator-academy (oficial, só pela busca); aba exata = terceiro |
| **Cliques e conversões do afiliado** (Cambly) e leads da isca | 0,3% conversão / 0,2% lead (hipótese) | painel do Cambly Ambassador; Kiwify | cambly.com/ambassador (oficial) |
| **Saúde:** strikes, aviso de "feito para crianças" alterado pelo YouTube, vídeo fora do For You | zero | Studio > Restrições do canal; TikTok > Status da conta | answer/9527654 (oficial); fyf-standards (oficial) |

**Erro oculto na medição:** a rotina de métricas grava em `metricas/posts.csv`, que está vazio. O 1º painel semanal só
sai depois que alguém conectar a leitura do Studio e do TikTok Studio. Isso é decisão e sessão à parte.

---

## (e) Engenharia reversa: 5 grandes BR + 4 sem rosto/animados

Dados da página pública de cada canal, lida em 29/10/2026 (terceiro). O vidIQ estava sem créditos e a chamada foi recusada.

| Canal | Inscritos / vídeos | Formato e cadência | Como ganha | Copiar (só a estrutura) | Brecha para o CapyFala |
|---|---|---|---|---|---|
| Mairo Vergara | 3,45 mi / 1,2 mil | Voltou em out/26 com aulas de ~55 min, depois de ~1 ano parado | Curso próprio por lista de espera, "20 aulas grátis" | Capítulo do produto no meio do vídeo + isca grátis | Ninguém grande faz pré-A1 diário em episódios |
| English in Brazil (Carina Fragozo) | 2,2 mi / 1,1 mil | ~1 por semana, 9–21 min; série numerada "Slow English Ep.01–03"; hype gringo (BTS) | Lançamento ("Super Black" nov/26), membros, Cambly, livro | Série numerada + hype gringo + Black Friday com afiliado | Rosto e lançamento; falta sitcom com elenco |
| Teacher Elza | 1,64 mi / 1 mil | ~2 por semana, 3–19 min; Harry Potter; quiz de nível | Curso + clube mensal, captação por WhatsApp | Quiz "qual seu nível" → WhatsApp | Ela é intermediário; o iniciante com medo fica de fora |
| Small Advantages | 2,51 mi / 588 | **Parou em 2026** | Livro (afiliado Amazon), publis | Comparação cultural BR × EUA | Público órfão desse tom leve |
| Inglês do Zero | 97 mil / 813 | Sem rosto, livro capítulo a capítulo, compilações de até 10 h | Não verificado | Compilação longa "para ouvir trabalhando" | Sem personagem, sem apego |
| Duolingo (TikTok/YT) | 18,4 mi / 7,05 mi | Mascote em trend, 10–30 s | Leva para o app | Legenda-meme, mascote em trend | Não ensina dentro do vídeo |
| Window English | 172 mil / 237 | Novela animada adulta em partes de 8–12 min + "Full Series" de 1 h | AdSense | **Partes + compilação completa** (≈5× as views) | Só em inglês |
| Merry English Stories | 80 mil / 60 | Personagens fixos, A1–A2, 10–25 min, 1 por semana | AdSense | Título "…Then This Happened!", elenco fixo | Infantilizado ("for kids" nas descrições, risco de feito para crianças) |
| Inglês em alguns minutos | 393 mil / 2,4 mil | "#AULA 618" numerada, 12–16 min, 2–3 por semana | Curso no Kiwify | Numeração visível (confirma a regra Ep. / Palavras #N) | Texto estático; animação e elenco ganham |

URLs: youtube.com/@MairoVergara, /@CarinaFragozo, /@teacherelza, /@SmallAdvantages, /@inglesdozero, /@Duolingo,
tiktok.com/@duolingo, youtube.com/@WindowEnglish, /@MerryEnglishStories, /@inglesemalgunsminutos (todas lidas em 29/10).

**Afiliados de idiomas, situação em 29/10/2026:**

| Programa | Comissão | Fonte |
|---|---|---|
| Cambly | "a partir de US$30" por conversão | oficial, cambly.com/ambassador |
| italki | "pelo menos US$10" por aluno novo | oficial, italki.com/en/affiliate-program |
| Coursera | 15–45% | oficial, coursera.org/about/affiliates |
| Amazon BR (livros) | 10% | oficial, associados.amazon.com.br |
| Babbel | até €75 (programa UK; Brasil não confirmado) | oficial, uk.babbel.com/babbel-partner-program |
| Preply | £15 por cliente | terceiro, Awin; a página oficial deu 403 |
| Busuu | ~10% | terceiro |
| Open English | proíbe vídeo no YouTube | terceiro |
| EF English Live BR | pausado | terceiro |
| Wizard, Fisk, CNA | sem programa público | — |

**Quem aparece nos canais BR:** o Cambly domina, em vídeos de review com cupom na Black Friday (Carina, 05/11/2024, 62,8
mil views: youtu.be/KT9dJADKbgQ). Não achei patrocínio pago e marcado dos 5 grandes.

---

## Fontes oficiais principais (todas lidas em 29/10/2026)

**YouTube**
- YPP 2027, blog oficial (10/08/2026): https://blog.youtube/news-and-events/youtube-partner-program-updates-2027-new-opportunities-earn/
- Central de Ajuda:
  - https://support.google.com/youtube/answer/12843009
  - https://support.google.com/youtube/answer/72851
  - https://support.google.com/youtube/answer/13429240
  - https://support.google.com/youtube/answer/1311392
  - https://support.google.com/youtube/answer/14328491
  - https://support.google.com/youtube/answer/6175006
  - https://support.google.com/youtube/answer/2467968
  - https://support.google.com/youtube/answer/72902
  - https://support.google.com/youtube/answer/9528076
  - https://support.google.com/youtube/answer/9527654
  - https://support.google.com/youtube/answer/9890437
  - https://support.google.com/youtube/answer/14075157
  - https://support.google.com/youtube/answer/13861714
  - https://support.google.com/youtube/answer/15509925
  - https://support.google.com/youtube/answer/6084043
  - https://support.google.com/youtube/answer/15569972
  - https://support.google.com/youtube/answer/16089387
  - https://support.google.com/youtube/answer/16559651
  - https://support.google.com/youtube/answer/141805
  - https://support.google.com/youtube/answer/11914225
  - https://support.google.com/youtube/answer/13376398
  - https://support.google.com/youtube/answer/10391362
- Sistema de recomendação, blog oficial (15/09/2021): https://blog.youtube/inside-youtube/on-youtubes-recommendation-system/
- Data API:
  - https://developers.google.com/youtube/v3/docs/videos/insert (15/10/2026)
  - https://developers.google.com/youtube/v3/determine_quota_cost (cota nova de 01/06/2026: 100 uploads por dia)
  - https://developers.google.com/youtube/v3/revision_history

**TikTok**
- Termos do Creator Rewards no Brasil: https://www.tiktok.com/legal/page/global/tiktok-creator-rewards-program-br/en (abr/2025)
- Suporte:
  - https://www.tiktok.com/support/faq_detail?id=7581821550694013452 (requisitos e originalidade do CRP)
  - https://www.tiktok.com/support/faq_detail?id=7543897461245450808 (como o valor é calculado)
  - https://www.tiktok.com/support/faq_detail?id=7636670084747893268 (rótulo de IA)
  - https://www.tiktok.com/support/faq_detail?id=7655285288050104852 (como o For You recomenda)
- Diretrizes da Comunidade (versão de 25/08/2026):
  - https://www.tiktok.com/community-guidelines/en/integrity-authenticity
  - https://www.tiktok.com/community-guidelines/en/fyf-standards
- Política de produtos do TikTok Shop BR (17/08/2026): https://seller-br.tiktok.com/university/essay?knowledge_id=6483182812481296&lang=pt-BR

Notas completas das 4 pesquisas, com cada linha e URL: anexadas como `ponte/saida/playbook-notas/*.md`.

---

**Nota: 7,5/10.** Para chegar a 10 faltam:
1. dado real do canal, para trocar as premissas do §(c) pelo que acontece;
2. a taxa do Cambly para o Brasil, vista no painel depois do cadastro;
3. o teste de 1 upload público pela API (privado bloqueado ou não);
4. a confirmação da regra de transição do YPP para candidatura pendente em 01/02.

**Próximo passo:** Felipe decide quais ações ligar. As ações 1 e 2 (recursos avançados e OAuth) custam 25 min dele e
destravam o resto.
