# Playbook dos campeões infantis → CapyKids (26/09/2026)

## Resultado (leia só isto se tiver 1 minuto)

1. **Os campeões brasileiros ganham com poucos hits, não com volume.** Galinha Pintadinha: 67 vídeos no canal principal e 44,2 bi de views, uma média de **660 mi por vídeo**. Bento e Totó: 42 vídeos, 16,6 bi, média de **396 mi por vídeo**. Cocomelon precisou de 2.133 vídeos para chegar a 107 mi por vídeo. *(verificado, páginas /about em 26/09/2026)*
2. **A música é folclore de domínio público com arranjo próprio e clipe de ~2 min. A receita vem de compilações longas.** Estes são os vídeos mais vistos de cada canal: Galinha, "Upa Cavalinho" com 3,73 bi. Cocomelon, "Bath Song" com 7,6 bi e "Wheels on the Bus" com 9,5 bi. Super Simple, "Twinkle Twinkle" com 2,44 bi. Todos são melodias tradicionais. *(verificado, vidIQ)*
3. **Chegar a 1 milhão de inscritos exige cerca de 0,4 a 1,5 bi de views**, porque os campeões fazem entre 365 e 1.580 views por inscrito (conta minha sobre os dados verificados). Com RPM de canal infantil no Brasil de US$0,15–0,45 *(terceiros)*, isso rende **US$60 mil a US$675 mil acumulados até lá**. Nenhum deles vive só de AdSense: licenciamento, shows e streaming chegam a ser metade ou mais da receita.
4. **A dor escondida: "inglês para criança brasileira" hoje é um nicho pequeno.** Leo & Lully tem 251 mil inscritos e 1.214 vídeos (~94 mil views/vídeo). Amigo Mumu tem 1,01 mi e 124 vídeos. Quem domina o Brasil infantil são as **dublagens em PT de IP estrangeira**: Pinkfong PT tem 12,8 mi, Bebefinn PT 8,92 mi em 3,5 anos e Cocomelon PT 4,42 mi. *(verificado)* → O CapyKids precisa nascer **em inglês com camada bilíngue**. Assim cada música serve ao Brasil (versão bilíngue) e ao mundo (versão só em inglês), com custo marginal quase zero por ser feito em código.
5. **O risco nº 1 em 2026 é ser tratado como "AI slop".** Desde 15/07/2025 conteúdo "em massa/repetitivo" e "IA com template genérico" não monetiza. Em jan/2026 o YouTube derrubou 16 canais (35 mi de inscritos), e 200+ organizações pediram a proibição de vídeo infantil feito por IA (01/04/2026). A automação tem que ficar **invisível**: melodia, letra pedagógica, personagem e acabamento autorais.

**Nota do plano CapyKids hoje: 6,5/10.** Para chegar a 10 faltam:
- (a) cantar com **voz controlada por MIDI** (Synthesizer V ou cantora), em vez de text-to-song;
- (b) versão EN global + versão bilíngue BR de cada música;
- (c) lançar com 8 a 10 músicas e 2 compilações prontas, não uma por vez;
- (d) um checklist de qualidade infantil do YouTube aprovado por uma pedagoga antes de cada upload.

---

## Metodologia e rótulos

- **verificado**: número coletado por mim hoje, 26/09/2026. Fontes: página /about do YouTube (inscritos, views, nº de vídeos, data de criação), abas /videos e /shorts (título, duração, views, data relativa) e vidIQ (vídeos mais populares com views exatas; gastei 20 créditos). Também entram textos legais lidos na fonte: termos da ElevenLabs e da Suno, e a Ajuda do YouTube.
- **autodeclarado**: dito pela própria empresa (press release, entrevista do fundador).
- **imprensa**: Forbes, Exame, Time, Bloomberg, Variety, MBW e similares.
- **terceiros/estimativa**: blogs e agregadores, ou conta minha (sempre marcada).
- **Não medido**: BPM exato das músicas. Não baixei áudio. Os valores de andamento abaixo são **faixas de referência de mercado (estimativa)**. No piloto, medir com `librosa.beat.beat_track` em 10 faixas de cada campeão.
- **Limitações**: a Wikipedia limitou a taxa de requisições, então parte da verificação de domínio público veio de WebFetch das páginas. Não consegui reverificar hoje os "códigos internos vazados" da Maya and Mary, que foram vistos na pesquisa anterior de 26/09.

---

## 1) Teardown dos campeões

### 1a. Números e história

| Canal | Inscritos / views / vídeos (verificado 26/09/26) | Views por vídeo (conta) | Fundação e tempo até estourar | Equipe |
|---|---|---|---|---|
| **Galinha Pintadinha** (BR) | 39,5 mi / 44,2 bi / 67 · + Gallina Pintadita (ES) 15,3 mi / 11,8 bi · + Galinha Pintadinha Mini 7,45 mi / 4,4 bi | **660 mi** | Juliano Prado e Marcos Luporini (Campinas). O clipe era um piloto para a TV, que recusou. Subiram ao YouTube em 28/12/2006 e esqueceram lá. **500 mil views em 6 meses** *(imprensa: Forbes 2015; Wikipedia)* | 12 pessoas (2015), 15 na Bromélia Produções (2021) *(imprensa)* |
| **Cocomelon** (EUA) | 203 mi / 227,8 bi / 2.133 · + CoComelon PT 4,42 mi | 107 mi | Jay Jeon (ex-diretor de comerciais) e a esposa. Canal "ABC Kid TV" desde 2006. **Estourou só em 2017** (11 anos depois), ao trocar 2D por 3D e criar o JJ: as views mensais quase dobraram para 238 mi em dez/2017 *(imprensa: Time)* | O casal sozinho por uma década, depois ~20 pessoas anônimas *(imprensa: Bloomberg 2020)* |
| **Pinkfong / Baby Shark** (Coreia) | 85,2 mi / 57,5 bi / 3.981 · + Pinkfong PT 12,8 mi / 9,5 bi | 14,5 mi | Empresa de 2010. Canal de 2011. "Baby Shark Dance" saiu em 17/06/2016, virou o vídeo mais visto do YouTube em nov/2020 e passou de **16 bi** *(imprensa/IPO)*. O canal fez 1 mi de inscritos em 71 dias *(autodeclarado, prospecto)* | n/d |
| **Bebefinn** (Pinkfong) | 36,9 mi / 24,5 bi / 1.050 (criado 29/03/2022) · + Bebefinn PT 8,92 mi / 7,4 bi (criado 03/2023) | 23 mi | 100 mil inscritos em 3 semanas *(autodeclarado)*. **~37 mi em 4,5 anos** usando a audiência da Pinkfong | n/d |
| **Super Simple Songs** (Canadá/Japão) | 47 mi / 64,2 bi / 904 · + Super Simple Español 4,27 mi | 71 mi | Professores de inglês numa escola em Tóquio (2005–06), que criaram músicas porque as existentes eram "rápidas e complexas demais". Começaram a monetizar só **4 anos depois (2010)** *(Wikipedia/imprensa)* | 40–50 funcionários + freelas na Skyship *(imprensa: C21)* |
| **Little Baby Bum** (UK) | 41,6 mi / 44,6 bi / 3.482 · + LBB em Português 3,9 mi | 12,8 mi | Casal Derek e Cannis Holder, 2011, projeto caseiro. **Cresceu com compilações** ("pais não precisam apertar play após cada vídeo"). Vendido à Moonbug em 2018 por ~US$8–11 mi com 16 mi de inscritos *(imprensa: Tubefilter)* | Casal + pequena equipe. Postava 2 vídeos/semana antes da venda |
| **Lingokids** (Espanha) | 3,37 mi / 2,36 bi / 1.639 | 1,4 mi | App desde 2015. O YouTube é vitrine do app | Startup: US$186 mi captados, 185 mi de famílias *(autodeclarado)* |
| **Maya and Mary** (EUA) | 27,1 mi / 9,88 bi / 1.054 | 9,4 mi | Desde 2013. Família real (Daddy Alex, Mommy Anna, 3 filhas) + animação *(autodeclarado, PR 2021)*. **Pico em 2019–21**: "Bug Catching" 402 mi, "We Are in the Car" 380 mi. Hoje os longos fazem **3–795 mil** e os Shorts 57–152 mil *(verificado)* | n/d. Indício de pipeline por template (títulos com código interno "LEG Animais IA 4 n1 d", vistos na pesquisa anterior) |
| **Mundo Bita** (BR) | 14,5 mi / 22,9 bi / 645 | 35,6 mi | Chaps Melo e 3 sócios (Mr. Plot, Recife, 2011). Nasceu desenhado na parede do quarto da filha. 2 bi de views em 2018 e indicação ao Grammy Latino *(imprensa)* | Estúdio de música próprio em Recife *(imprensa: Exame 03/2026)* |
| **Bento e Totó** (BR) | 10,9 mi / 16,6 bi / **42** (desde 2016) | **396 mi** | "Funk do Patinho" com **2,1 bi**, "Bola Bolinha" 848 mi *(verificado)*. Produtora não identificada nas fontes | n/d |
| *Referência do nicho:* **Leo & Lully** (BR, inglês para crianças) | 251 mil / 114 mi / 1.214 (2018) | 0,09 mi | Hit "Color Family Song \| Família das Cores \| Música em Inglês" com 8,6 mi. Hoje virou quizzes de 1–8 mil views | n/d |
| *Referência do nicho:* **Amigo Mumu** (BR) | PT 1,01 mi / 106 mi / 124 · ES 1,75 mi / 204 mi | 0,85 mi | "Inglês infantil" em aulas longas de 35–58 min, com 36–126 mil views recentes | n/d |

### 1b. Como produzem (formato, música, visual)

| Canal | Produção | Música (fonte, estrutura) | Duração e compilações (verificado) | Cadência recente (verificado, contada nas 12 últimas) | Títulos e thumbnails |
|---|---|---|---|---|---|
| Galinha | 2D vetorial chapado (estilo Flash), fundo azul, personagem simples e reaproveitado | **Cancioneiro popular em domínio público** com arranjo novo ("Pintinho Amarelinho", "Ciranda", "Borboletinha") + composições do Luporini + parcerias (Gilberto Gil, Vinicius) | Clipes de 1:08–3:36 (a maioria 2:00–2:40). "Álbum Completo" de 29:36 com 830 mi | Rara: o canal principal lança 1 clipe a cada meses. O volume fica nos canais Mini/ES e no filme (2026) | "Nome da Música – Galinha Pintadinha N – OFICIAL". A thumb é a galinha + 1 personagem |
| Cocomelon | 3D (desde 2017), família JJ, cenários de rotina (banho, escola, comida) | Nursery rhymes PD ("Wheels on the Bus", "Baa Baa", "Twinkle") + originais de rotina ("Bath Song", "Yes Yes Vegetables"). Letra na tela com palavra destacada | Singles de 2:05–4:52. **Compilações "+ More" de 31–38 min com 1,2–1,9 bi cada** | ~4 vídeos por semana + Shorts de "toy play" (0,3–1,5 mi) | "Música \| CoComelon Nursery Rhymes & Kids Songs" + tema sazonal (Halloween) |
| Pinkfong | 2D/3D, mascote + universos (Hogi, Super Rescue Team) | "Baby Shark" é canção de acampamento tradicional. A Suprema Corte da Coreia (08/2025) rejeitou o plágio porque a base era tradicional *(imprensa)* | Episódios de 6–16 min. **"Best of the Best" de 1h23–3h01** | ~4/semana | Selos "[🎃NEW]" e "[Best of the Best]" + emoji + tema |
| Bebefinn | 3D família (bebês + pais), episódios "EP2xx" | Nursery rhymes + músicas de hábitos e sentimentos ("Use Your Words") | Episódio de 3:40, **mixes de 16–31 min, 1h22 e 5h49 (ninar)**. "Walking Walking & More" 30:57 com 6,6 mi em 3 semanas | ~3/semana | "[NEW⭐]", "[TOP 5⭐]", "EPxxx", tema + emoji |
| Super Simple | 2D limpo + fantoches (Tobee), spin-offs (Noodle & Pals, Finny) | **Andamento lento, linguagem simples, gestos** (filosofia declarada: "simplicity, fun, effectiveness"). Mistura PD e originais ("Do You Like Broccoli Ice Cream?" 1,1 bi) | Singles de 1:19–3:37. **"Top 20 …" de 47–57 min** (hoje) e "+ More" de 50–80 min | ~1,5/semana (cadência baixa, qualidade alta) | "Música \| Tema for Kids \| Super Simple Songs" |
| Little Baby Bum | 3D, personagem Mia + animais | PD + originais, com repetição para linguagem | Hoje singles de 1:33–6:30. Antes, vídeos de ~1h | ~4/semana. Views recentes baixas (3–114 mil) no canal principal pós-Moonbug | "Tema 🎈 \| Little Baby Bum" |
| Lingokids | 2D com mascote Baby Bot | Originais educativos | Compilações de ~20 min por tema sazonal + Shorts de 30s | Irregular. Os longos pararam há ~10 meses | CAIXA ALTA + emoji + "SONGS FOR KIDS" |
| Maya and Mary | Começou live-action familiar. Hoje animação/IA com vocabulário por tema | Originais e covers ("Boo Boo Song", "Finger Family") | Hoje longos de 21–41 min | ~3/semana | Tendência do momento (KPop Demon Hunters): **risco de "uso estranho de personagens"** |
| Mundo Bita | 2D autoral, estética de livro ilustrado | **100% original**, com consultoria pedagógica e estúdio próprio. Parcerias (Tiago Iorc, Turma da Mônica, Milton Nascimento) | Clipes de 2:23–3:22. "Músicas de Ninar" de 3h03. "Mundo Bita em Libras" de 2h08 | ~1/mês | "Mundo Bita – Nome" + parceiro |
| Bento e Totó | 2D simples, 2 personagens | Originais com ritmo brasileiro (**funk infantil**) | Clipes de 2:03–2:43 + 1 coletânea de 21:55 (249 mi) | Muito rara | "Bento e Totó – Nome (Desenho Infantil)" |

**Paleta e design de personagem (observação minha dos vídeos e thumbs; é inferência, não medição):**
- cores primárias saturadas sobre fundo claro ou azul;
- personagem com cabeça grande, olhos enormes e poucos traços;
- silhueta legível em miniatura;
- 1 personagem "âncora" repetido em tudo (Galinha, JJ, Baby Shark, Bita).

### 1c. Como ganham dinheiro além de anúncio

| Canal | Fontes de receita com números |
|---|---|
| Galinha | **~Metade do faturamento vinha de licenciamento**: 60 licenciados e 600+ itens no Brasil, com mais de US$300 mi em produtos vendidos até 2015 *(imprensa: Forbes 2015)*. "Movimentou R$3,5 bi em 2020" é **valor de varejo + digital, não receita da empresa** *(imprensa: Forbes 2021)*. 2,5 mi de DVDs, app com 55 mi de downloads, Netflix (2013), versão EN "Lottie Dottie Chicken", filme no cinema em 2026 |
| Cocomelon/Moonbug | Moonbug: receita de £39,6 mi (US$53,8 mi) em 2020 → **~US$240 mi em 2022**, puxada por licenciamento, com projeção de US$1,2 bi em varejo *(terceiros/Wikipedia)*. Vendida por **US$3 bi** (11/2021, Candle/Blackstone). Netflix (show mais visto de 2024: 231 mi de views), turnês ao vivo, livros com a Simon & Schuster, filme em produção *(imprensa)* |
| Pinkfong | Receita de **KRW 97,4 bi (US$71,4 mi) e lucro operacional de US$13,8 mi em 2024**. IPO no Kosdaq em 11/2025, avaliada em ~US$372 mi. No 1º semestre de 2025: 68% conteúdo, 15% merch, 10% licenciamento. **Bebefinn já fatura mais conteúdo que Baby Shark** *(imprensa: MBW, Music Ally)*. 496 mi de downloads de apps, Netflix (Bebefinn chegou ao top 10 infantil dos EUA) |
| Super Simple | O YouTube "banca todo o resto" *(autodeclarado, C21)*. App, livros, turnê, podcast, acordo com a Warner Music (2020), Amazon Prime. Produtos físicos "abaixo do esperado" |
| Mundo Bita | **R$100 mi de faturamento em 2025** (20x em 10 anos): licenciamento ~R$23 mi (20%), shows R$65 mi acumulados, parques temporários R$40 mi acumulados, 10 mi de produtos com 50 parceiros. Netflix, HBO, Globoplay, Prime *(imprensa: Exame 18/03/2026)* |
| Lingokids | Assinatura do app (Lingokids Plus ≈85% da receita, *terceiros*). YouTube é aquisição |
| LBB | Vendido por US$8–11 mi em 2018. Netflix, Amazon, Hulu e 40+ plataformas, 13 idiomas *(Wikipedia)* |

### 1d. Localização (o motor escondido)

- Galinha: ES, EN, IT, FR, DE, JP e ZH. O canal em espanhol sozinho tem 15,3 mi de inscritos *(verificado)*.
- Pinkfong: apps em 7 idiomas. **Canal PT com 12,8 mi** *(verificado)*.
- Bebefinn PT chegou a 8,92 mi em 3,5 anos. Cocomelon foi para 10 idiomas depois da Moonbug *(imprensa: Time)*. LBB está em 13 idiomas.
- **O padrão dos campeões é 1 canal por idioma, não faixa de áudio.** Criança pequena não troca faixa, e o canal local rankeia na busca local.
- Novidade útil: desde set/2025 a faixa de áudio multilíngue está liberada para todos os criadores, e a dublagem automática para todos os elegíveis desde fev/2026 *(imprensa: TechCrunch e terceiros)*. Serve como bônus, não como substituto do canal local.

---

## 2) O playbook: 15 coisas que os campeões fazem

| # | O que fazem | Evidência |
|---|---|---|
| 1 | **Melodia que o pai já conhece (PD) + arranjo e visual próprios** | Os top vídeos de Galinha (Upa Cavalinho 3,73 bi, Dona Aranha 2,19 bi), Cocomelon (Wheels on the Bus 9,5 bi, Baa Baa 4,97 bi) e SSS (Twinkle 2,44 bi) são todos tradicionais *(verificado)* |
| 2 | **1 personagem-âncora, simples, repetido em tudo** | Galinha, JJ, Baby Shark e Bita viram produto licenciado. A Galinha chegou ao 89º lugar entre as maiores marcas licenciadas do mundo (2015) |
| 3 | **Single de ~2–3 min** | Mediana de ~2:15 na Galinha e 2:40–3:50 na Cocomelon *(verificado)* |
| 4 | **Compilações longas (30 min a 6 h) reaproveitando singles** | Cocomelon "+ More" de 31–38 min com 1,2–1,9 bi cada. Bebefinn com mix de 5h49 de ninar. Pinkfong com 3h01. LBB cresceu com compilações ("pais não precisam apertar play") |
| 5 | **Temas de rotina da criança** (banho, dormir, comer, escola, dodói) | Bath Song 7,6 bi, Sick Song 2,1 bi, Boo Boo Song 1,49 bi, "Put On Your Shoes" 1,05 bi |
| 6 | **Repetição e call-and-response** (a criança completa ou repete) | "Os Pintinhos Dizem" (480 mi), BINGO, "Yes Yes Vegetables" (3,47 bi). Filosofia declarada da SSS: simples, lento, com gesto |
| 7 | **Música que pede movimento/gesto** | "Head Shoulders" 1,29 bi, "Walking Walking" 415 mi, a própria "Baby Shark Dance". Mundo Bita tem versão em Libras (2h08) |
| 8 | **Andamento mais lento que música pop e letra curta** | Declarado pela SSS: as músicas nasceram porque as existentes eram rápidas e complexas demais. *BPM não medido* |
| 9 | **Sazonalidade como pauta fixa** (Halloween, Natal, volta às aulas, aniversário) | 7 dos 12 últimos vídeos da Pinkfong e 2 dos 12 da Cocomelon eram Halloween em set/2026. A SSS roda "Top 20 Back to School/Summer" |
| 10 | **Título padronizado "Música \| Tema \| Marca"** + emoji e selo [NEW] | Padrão em todos. Nada de clickbait |
| 11 | **Canal separado por idioma e dublagem da IP** | Gallina Pintadita 15,3 mi. Pinkfong PT 12,8 mi. Bebefinn PT 8,92 mi |
| 12 | **Spin-off e novo personagem usando a audiência existente** | Bebefinn fez 100 mil em 3 semanas e já fatura mais que Baby Shark. Galinha Mini tem 7,45 mi. A SSS tem Noodle & Pals, Finny e Bumble Nums |
| 13 | **Anos de paciência antes do estouro** | Cocomelon levou 11 anos (2006→2017). SSS levou 4 anos até monetizar. Mundo Bita, 7 anos até 2 bi. Galinha estourou em 6 meses, mas com a melodia mais conhecida do país |
| 14 | **Do YouTube para licenciamento, show, streaming e filme** | Mundo Bita: R$100 mi (2025). Pinkfong: US$71 mi com 25% de merch e licenciamento. Moonbug: US$3 bi. A Galinha tirava ~50% do licenciamento |
| 15 | **Pesquisa de atenção e qualidade de produção** (sem cortes aleatórios, história completa) | Moonbug testa episódios com crianças usando o "Distractatron" (imprensa, criticado por especialistas). O YouTube premia "complete narrative" nos princípios de qualidade *(Ajuda do YouTube)* |

---

## 3) Regras do jogo em 2026 (YouTube infantil)

| Tema | Regra | Fonte e rótulo |
|---|---|---|
| "Made for kids" (MFK) | Obrigatório marcar se o público-alvo é criança. O YouTube também classifica sozinho (tema, animação, personagens infantis) | Ajuda do YouTube, FAQ MFK *(verificado)* |
| O que desliga no MFK | Anúncio personalizado, comentários, sininho, cards, end screens, membros, Super Chat/Thanks, miniplayer | Ajuda do YouTube, "How ads work… made for kids" *(verificado)* + terceiros |
| Anúncios permitidos | **Só contextuais**, com bumper antes/depois. Proibidos: comida e bebida (qualquer uma), jogos 13+, beleza, namoro, política, religião | Ajuda do YouTube 9713557 *(verificado)* |
| RPM | Contextual paga 50–80% menos. Canais infantis: **RPM de US$1–3 global** e CPM de **US$0,15–0,45 no Brasil** | terceiros (vidIQ, Animar Estúdio) → **estimativa** |
| Princípios de qualidade (afetam monetização, YouTube Kids e recomendação) | **Premia**: cuidar de si e dos outros, aprender e despertar curiosidade, criatividade e brincadeira, habilidades de vida com **narrativa completa**, mostrar o mundo e a diversidade. **Pune**: conteúdo promocional, mau comportamento, **"falsamente educativo"**, **"difícil de acompanhar"** (áudio ruim, sem história), sensacionalista com **keyword stuffing**, **uso estranho de personagens infantis**. Canal focado em baixa qualidade pode ser **suspenso do YPP**, e o vídeo recebe anúncio limitado ou nenhum | Ajuda do YouTube 10774223 *(verificado)* |
| Conteúdo inautêntico (desde 15/07/2025) | "Repetitivo ou produzido em massa" e "**IA com templates genéricos** sem perspectiva autoral" não monetizam. Template só vale se o conteúdo variar de verdade | Política de monetização do YouTube *(verificado)* |
| Fiscalização de "AI slop" infantil | Jan/2026: 16 canais encerrados (35 mi de inscritos, 4,7 bi de views). 01/04/2026: carta de 200+ organizações pedindo a proibição de vídeo de IA para crianças. Mar/2026: +7 canais derrubados | imprensa (Bloomberg, Fortune) e terceiros |
| YouTube Kids | O conteúdo MFK é elegível. Entra por filtro automático (título, thumb, vídeo). **A home tem revisão humana**. A qualidade decide | Ajuda do YouTube Kids *(verificado via busca)* |
| COPPA (EUA) | Multa de US$170 mi ao YouTube (2019). Disney pagou US$10 mi (09/2025) por marcar mal vídeos infantis. As novas regras da COPPA têm **compliance obrigatório desde 22/04/2026** | FTC *(imprensa oficial)* |
| ECA Digital (BR, Lei 15.211/2025) | Em vigor desde **17/03/2026**. Proíbe perfilamento publicitário de criança. A ANPD fiscaliza, com sanções a partir de jan/2027 | escritórios de advocacia (Machado Meyer, Demarest) *(imprensa jurídica)* |
| Consequência prática | O CapyKids não coleta dado, não tem link para WhatsApp e não vai para o TikTok. Monetiza em volume, licenciamento e canais pagos (streaming, apps) | — |

---

## 4) Música para um time "code-first"

### 4a. Melodias de domínio público (com evidência)

Regra: nos EUA, obra publicada **antes de 1931** está em domínio público em 2026. No Brasil, a obra entra em DP 70 anos após a morte do autor (Lei 9.610/98), e **folclore anônimo** é domínio público. **Só a melodia e a letra antiga são livres. Arranjos e letras modernas de terceiros (Cocomelon, Galinha, Pinkfong) NÃO são.**

| Melodia | Evidência de domínio público | Status para o CapyKids |
|---|---|---|
| Twinkle Twinkle / ABC / Baa Baa (melodia "Ah! vous dirai-je, maman") | Melodia publicada em 1761. Poema de Jane Taylor de 1806. Baa Baa impresso em ~1744 | ✅ livre |
| Frère Jacques ("Are You Sleeping") | Manuscrito de ~1775–85. Primeira publicação da melodia em 1811 | ✅ livre |
| BINGO | Primeira versão datada em 1778 (The Scots Nightingale) | ✅ livre |
| Mulberry Bush ("This is the way…") | Melodia de meados do século XVIII (Nancy Dawson). É a melodia **real** de "Wheels on the Bus" | ✅ livre |
| London Bridge | Letra impressa em meados do século XVIII | ✅ livre |
| Mary Had a Little Lamb | Publicada por Sarah J. Hale em 1830 | ✅ livre |
| Row Row Row Your Boat | Letra de 1852. Melodia atual registrada em 1881 | ✅ livre |
| Head Shoulders Knees & Toes | Documentada em 1912. Melodia "There Is a Tavern in the Town" (século XIX) | ✅ livre (EUA: pré-1931) |
| Old MacDonald | Raiz em d'Urfey (1706). Melodia atual gravada em 1925 | ✅ livre nos EUA (pré-1931) |
| Itsy Bitsy Spider | Publicada em 1910 | ✅ livre (EUA). A melodia tem origem incerta |
| Pop Goes the Weasel · Oh! Susanna (Foster, 1848) · Farmer in the Dell · Humpty Dumpty (melodia de 1870) | Todas do século XIX | ✅ livre |
| Canção de Ninar de Brahms (Wiegenlied, 1868) | Brahms morreu em 1897 | ✅ livre (ideal para compilações de dormir) |
| Folclore BR: Ciranda Cirandinha, Borboletinha, Pirulito que Bate Bate, Escravos de Jó*, Sapo Cururu | Cancioneiro popular de autoria anônima, usado pela Galinha como domínio público *(imprensa: Forbes)* | ✅ melodia livre. **Conferir no ECAD** antes. *Escravos de Jó: evitar pelo tema |
| ⚠️ **Wheels on the Bus** (letra) | Letra de Verna Hills, publicada em **1937** (morreu em 1990) | ❌ **Evitar a letra**. Status incerto nos EUA e protegida no BR até ~2060 pela regra de 70 anos. Usar só a melodia Mulberry Bush com letra nossa |
| ⚠️ **If You're Happy and You Know It** | Registrada em 1971 pela Jonico Music, creditada a Joe Raposo | ❌ evitar |
| ❌ Baby Shark (versão Pinkfong), Happy Birthday* | A versão da Pinkfong é protegida. *Happy Birthday está em DP nos EUA desde a decisão de 2015–16, mas é arriscada fora dos EUA | ❌ evitar |

### 4b. Voz cantada: opções e termos exatos

| Opção | Custo | Termos (lidos na fonte hoje) | Controle da melodia PD | Veredito |
|---|---|---|---|---|
| **Synthesizer V Studio 2 Pro** (Dreamtonics) | US$99 uma vez + vozes (~US$69–79 cada) *(imprensa/loja)* | Vozes oficiais Dreamtonics com **uso comercial ilimitado, sem teto de receita** *(autodeclarado)*. Vozes de terceiros (ex.: SOLARIA/Eclipsed Sounds) têm licença própria: conferir | **Total**: entra MIDI + letra, sai voz exata. Cruza 6 idiomas (**PT não confirmado**) | **Melhor encaixe para código**. Arranjo, letra e MIDI são nossos, então o direito autoral é defensável |
| **ElevenLabs Music** (v1/v2) | Starter US$6, Creator US$22, Pro US$99/mês | Termos de 26/05/2026. **Grátis: download proibido e atribuição obrigatória.** Starter: 30 min de download/mês e **streaming proibido**. **Creator+**: streaming permitido, 250 min/mês. Todos os planos self-serve: uso comercial online e offline, **exceto cinema, TV, rádio e games**. "Individual use only" até o Pro. **Sem exclusividade**: a saída pode ser igual à de outro usuário | Fraco: gera a música inteira a partir de prompt, sem garantir fidelidade à melodia PD | Serve para trilha de fundo e vinhetas. **Bloqueia Netflix e TV** sem Enterprise |
| **Suno** (v6, licenciado desde 09/09/2026) | Pro ~US$10/mês (20 downloads/mês), Premier ~US$30 (60/mês) *(terceiros)* | Termos em vigor desde 03/09/2026. Pro/Premier: a Suno **cede** a titularidade da saída, mas **"não garante que haja copyright"**. Grátis: só uso pessoal e não comercial, sem download | Fraco: mesma limitação | Bom para esboço e demo. Arriscado como master: sem copyright, não dá para registrar no Content ID nem defender o catálogo |
| **ACE-Step 1.5** (open source) | US$0 + GPU | **Licença MIT** (verificado no GitHub) | Médio: aceita letra, a melodia é parcialmente controlável | Plano B sem custo recorrente. Exige GPU |
| **Cantora humana no Brasil** | R$100–300 por faixa no marketplace (Vintepila) · piso do sindicato MG 2025: **R$400/faixa músico, R$600 solo** *(verificado/terceiros)* | Contrato com **cessão de direitos conexos** e de voz para todos os idiomas e mídias | Total | Melhor para a **voz-assinatura da Capi** nas 10 primeiras. 10 faixas ≈ R$1–6 mil |

**Recomendação:**
- Canto em inglês com Synthesizer V (voz feminina) guiado por MIDI gerado por código.
- As falas em PT ("Vermelho!", "Agora você!") com a voz falada da Capi na ElevenLabs.
- Uma cantora humana só para o **tema de abertura** e o hit principal.

Motivo: nos EUA, música 100% IA não tem proteção (Copyright Office, relatório de 2025, parte 2: "prompts alone" não bastam). Com melodia em domínio público, letra, arranjo e MIDI nossos, o catálogo vira **ativo licenciável**, que é onde está o dinheiro (item 1c).

---

## 5) Aplicação ao CapyKids

### 5a. Posicionamento

- **Público**: 2–6 anos. Quem decide é o pai ou mãe brasileiro que quer "inglês desde cedo".
- **Formato**: música de 2–2:30 em que Capi canta em inglês, diz a palavra em PT **uma vez**, e a criança repete (call-and-response).
- **Dois masters por música, gerados pelo mesmo código**:
  - **CapyKids Brasil (bilíngue)**: título em PT com busca de pai ("Cores em Inglês | Música…"). O padrão comprovado é o de Leo & Lully, "Color Family Song | Família das Cores | Música em Inglês", com 8,6 mi *(verificado)*;
  - **CapyKids (EN global)**: só inglês, concorrendo com a SSS no mercado de ESL (Japão, LatAm, Europa). Custo marginal quase zero.
- **Oportunidade despercebida:** **melodias folclóricas brasileiras com letra em inglês**. "Ciranda Cirandinha" tem 717 mi na Galinha e "Borboletinha" 851 mi. Ninguém usa esse folclore para ensinar inglês. O pai reconhece a música na hora, e a versão EN leva a cultura brasileira para fora.

### 5b. As 10 primeiras músicas

| # | Título (BR / EN) | Melodia PD | Ensina | Gancho |
|---|---|---|---|---|
| 1 | **"Hello, Capi!" — Bom dia em Inglês** | Frère Jacques | Hello / Good morning / How are you? / I'm fine | Cânone: Capi canta, as crianças respondem em eco. Serve de abertura de todas as compilações |
| 2 | **"C-A-P-I" — Soletrando em Inglês** | BINGO | Letras do alfabeto e soletração do nome | "C-A-P-I, and Capi is her name-o!" com palmas substituindo letras. Viral pelo nome da marca |
| 3 | **"Colors with Capi" — Cores em Inglês** | London Bridge | red, blue, yellow, green, orange, purple | Capi pinta frutas brasileiras; o objeto muda de cor no beat. A palavra em PT é dita 1x e a criança responde |
| 4 | **"Capi Had a Farm" — Animais do Brasil em Inglês** | Old MacDonald | capybara, toucan, jaguar, monkey, parrot + sons | Fauna brasileira em inglês (diferencial). "With a *squeak squeak* here" (som real da capivara) |
| 5 | **"Head, Shoulders, Capi Toes" — Corpo em Inglês** | Head Shoulders Knees & Toes | head, shoulders, knees, toes, eyes, ears, mouth, nose | Acelera a cada volta (1x, 2x, turbo). É dança obrigatória, e a criança perde e ri |
| 6 | **"This Is the Way We Eat the Mango" — Frutas em Inglês** | Mulberry Bush | mango, banana, pineapple, watermelon, açaí → "eat, cut, peel" | Rotina de lanche + verbos de ação com gesto. Sem marca nem alimento industrializado (MFK e anúncios) |
| 7 | **"Brush, Brush, Brush Your Teeth" — Escovar os Dentes em Inglês** | Row Row Row Your Boat | brush, teeth, up, down, spit, rinse | Música de rotina real para os pais usarem no banheiro (o tema da "Bath Song", 7,6 bi) |
| 8 | **"Count with Capi 1 to 10" — Números em Inglês** | Ciranda Cirandinha (folclore BR) | one → ten | O pai reconhece a ciranda na hora. Roda de 10 bichos que entram um por um |
| 9 | **"Happy, Sad, Capi!" — Sentimentos em Inglês** | Twinkle Twinkle | happy, sad, angry, scared, sleepy + "It's OK!" | A Capi zen acalma: respira fundo contando "one, two, three". Atende o princípio "cuidar de si" |
| 10 | **"Good Night, Capi" — Canção de Ninar em Inglês** | Canção de Ninar de Brahms | good night, moon, stars, sleep, I love you | Base das compilações de 1–3 h para dormir (Bebefinn: 5h49; Mundo Bita: 3h03; SSS "Sweet Dreams" com 252 mi) |

Reserva: "Borboletinha → Butterfly, Butterfly" (cores e cozinha), "Itsy Bitsy Capi" (clima: rain, sun), "Mary Had a Little Tuca" (família: mommy, daddy, baby), "Rain Rain" (tempo), "Five Little Capis" (subtração).

**Checklist de cada música:**
- 1 conceito;
- ≤ 8 palavras novas;
- cada palavra repetida ≥ 4x;
- 1 gesto por palavra;
- estrutura verso–refrão–verso–refrão–"agora você!" (pausa para a criança cantar);
- andamento de referência 90–110 BPM, **estimativa a validar** medindo SSS e Cocomelon;
- nada de corte a menos de 2 s;
- narrativa com início, problema e solução (princípio "narrativa completa").

### 5c. Pipeline (Felipe só aprova)

| Etapa | Ferramenta | Saída |
|---|---|---|
| 1. Pauta | Banco dos 10 + calendário sazonal (Halloween/Natal/volta às aulas) | JSON da música |
| 2. Letra | Claude API → 2ª passada "professor nativo" → checklist pedagógico automático (contagem de repetições e palavras novas) | letra EN + falas PT |
| 3. Melodia | Transcrição manual única de cada melodia PD para MIDI, versionada no git | `melodia.mid` |
| 4. Arranjo | Código (music21/pretty_midi): tom, andamento, baixo e percussão por "estilo" (ciranda, funk infantil leve, pop) → FluidSynth com soundfont de licença livre (**conferir licença**) | `instrumental.wav` |
| 5. Canto | Synthesizer V (script por projeto `.svp` gerado do MIDI + letra) | `voz_en.wav` |
| 6. Falas PT | ElevenLabs (voz desenhada da Capi, plano pago) | `falas_pt.wav` |
| 7. Mix | ffmpeg/pydub + normalização a −14 LUFS | master BR e master EN |
| 8. Animação | Remotion: rig da Capi em camadas, **ações sincronizadas pelas notas do MIDI** (o tempo de cada sílaba já é conhecido, então dispensa o Rhubarb no canto), palavra destacada na tela, 4 cenários | single 16:9 + Short 9:16 |
| 9. Compilação | Script monta 30 min, 60 min e 1–3 h (ninar) a partir dos singles, com abertura "Hello, Capi!" | compilações |
| 10. QA | Checklist dos princípios de qualidade + revisão de 10 min de uma pedagoga (freela) | aprovado ou reprovado |
| 11. Upload | YouTube Data API com **MFK = sim**, título padrão, playlist por tema | publicado |

**Custo:**
- **Uma vez**: SynthV US$99 + 1 voz ~US$79 + cantora do tema R$1–2 mil + arte da Capi (já prevista) → **≈ R$2,5–3,5 mil**.
- **Mensal**: ElevenLabs Creator US$22 (para ter streaming no Spotify) + Claude API ~US$10 + pedagoga ~R$300 → **≈ US$90/mês**. Cabe no teto de US$110, mas **aperta junto com o CapyFala**. Alternativa: ElevenLabs Starter US$6 até lançar no Spotify.

### 5d. Cadência e compilação

- **Pré-lançamento**: produzir 8 músicas antes de publicar.
- **Lançamento (semana 1)**: 3 singles + 1 compilação de 15–20 min.
- **Ritmo depois**: **2 singles por semana** (terça e sexta) + **1 compilação por semana** (sábado; 30 min no início, 60 min a partir da música 16) + 1 Short por dia cortado dos singles.
- **Mês 3**: primeira compilação de ninar de 1 h. **Mês 6**: de 3 h.
- **Sazonal**: Halloween (outubro) e Natal (novembro) têm que estar prontos 3 semanas antes da data.
- **Regra de corte**: a cada 30 dias, o tema/melodia de melhor retenção ganha a "parte 2", como a SSS fez com "Do You Like…?" (Broccoli, Lasagna, Spaghetti: 3 hits).

### 5e. Números conservadores (estimativa, cenário base sem viralização)

**Premissas:**
- benchmark do nicho BR (Leo & Lully ~94 mil views/vídeo em 8 anos; Amigo Mumu PT ~850 mil/vídeo);
- ~1.000 views por inscrito nos campeões;
- RPM MFK de US$0,15–0,40;
- US$1 ≈ R$5,5.

| Marco | Vídeos no ar | Views acumuladas | Inscritos (BR + EN) | Receita de anúncio | Observação |
|---|---|---|---|---|---|
| **90 dias** | ~24 singles + 10 compilações + ~60 Shorts | 50 mil – 400 mil | 300 – 3.000 | **R$0** (provavelmente ainda fora do YPP: exige 1.000 inscritos + 4.000 h ou 10 mi de views em Shorts) | O indicador que importa é a **retenção média > 50% nos singles** e as compilações crescendo |
| **12 meses** | ~100 singles + 45 compilações | 2 – 10 mi | 5 mil – 40 mil | US$300 – 4.000 no ano (**≈ R$1,6–22 mil**) | Com 1 hit (1 música > 5 mi), o topo da faixa. Sem hit, o piso |
| Cenário de hit (não conservador) | — | 50 – 200 mi | 100 – 300 mil | US$10 – 60 mil | Exige 1 música do nível "Color Family Song" (8,6 mi) repetida algumas vezes |

**Leitura**: no ano 1 o AdSense do CapyKids **não paga a operação**. O retorno está no catálogo licenciável:
- Spotify/streaming de áudio infantil (ElevenLabs Creator ou SynthV);
- licença para escolas de inglês e apps;
- depois, produtos com a Capi.

É um projeto de 2–4 anos, como mostram os casos de 11 anos (Cocomelon) e 4 anos (SSS). **Vale como "ativo que compõe", não como caixa rápido.** Isso bate com a prioridade do Felipe de retorno rápido: CapyFala primeiro, CapyKids em paralelo leve.

---

## 6) O que NÃO fazer

1. **Não usar letra de "Wheels on the Bus", "If You're Happy", "Baby Shark" (versão Pinkfong) nem arranjos da Galinha, Cocomelon ou Mundo Bita.** Só a melodia PD + letra e arranjo nossos.
2. **Não publicar template repetido em massa.** Cada música precisa de ideia, cenário e narrativa próprios. Foi isso que derrubou 16 canais em jan/2026, e a Maya and Mary despencou de centenas de milhões para ~3–60 mil por vídeo.
3. **Não usar personagem famoso alheio** (KPop Demon Hunters, Bluey, Peppa): "uso estranho de personagens infantis" + marca registrada.
4. **Não fazer título falsamente educativo nem keyword stuffing** ("INGLÊS PARA CRIANÇAS CORES NÚMEROS ABC ANIMAIS…"). Usar "Música | Tema em Inglês | CapyKids".
5. **Não desmarcar o MFK para ganhar RPM maior.** A Disney pagou US$10 mi por isso (09/2025), e o compliance da COPPA é obrigatório desde 04/2026.
6. **Não colocar link de WhatsApp, captação, TikTok nem comentários** no CapyKids (ECA Digital, COPPA). O funil fica no CapyFala adulto, em canal separado.
7. **Não usar text-to-song (Suno/ElevenLabs Music) como master do catálogo principal.** Sem copyright garantido e sem exclusividade, o ativo não é licenciável, e a ElevenLabs self-serve **proíbe TV** (bloqueia Netflix e TV depois).
8. **Não usar plano grátis de nenhuma IA**: sem direito comercial (Suno e ElevenLabs).
9. **Não hiperestimular** (cortes a cada 1 s, flashes, sons altos). Isso contraria o princípio "difícil de acompanhar" e a crítica pública à Cocomelon.
10. **Não lançar 1 música por vez esperando feedback.** Os campeões cresceram com catálogo + compilação. Lançar com 8 prontas.
11. **Não mostrar comida industrializada, marca ou brinquedo à venda** (princípio "promocional"; anúncios de comida são proibidos em MFK).
12. **Não esperar dinheiro do AdSense no ano 1** nem gastar acima de ~US$90/mês nisso enquanto o CapyFala não gera caixa.

---

## Fontes

**Dados de canal (verificado 26/09/2026):**
- youtube.com/@GalinhaPintadinha, @Cocomelon, @Pinkfong, @Bebefinn, @SuperSimpleSongs, @Lingokids, @MayaandMary, @LittleBabyBum, @MundoBita, @BentoeToto, @GallinaPintadita, @GalinhaPintadinhaMini, @LeoeLully, @AmigoMumu, @CoComelonBR, @Pinkfong_Portuguese, @Bebefinn_Portuguese, @LittleBabyBumBrasil, @SuperSimpleEspanol, @EnglishSingsing (páginas /about, /videos e /shorts);
- vidIQ `channel_videos` (populares longos): Galinha Pintadinha, Cocomelon, Super Simple Songs, Maya and Mary.

**Empresas:**
- [Forbes BR 2015 – Galinha Pintadinha US$300 mi](https://forbes.com.br/negocios/2015/11/ovos-de-ouro-como-dois-brasileiros-transformaram-a-galinha-pintadinha-em-um-imperio-de-us-300-milhoes/)
- [Forbes BR 2021 – R$3,5 bi](https://forbes.com.br/forbes-money/2021/09/galinha-pintadinha-faz-15-anos-movimenta-r-35-bilhoes-anuais-e-mira-novos-mercados/)
- [Wikipedia – Galinha Pintadinha](https://en.wikipedia.org/wiki/Galinha_Pintadinha)
- [Time – CoComelon](https://time.com/6157797/cocomelon-success-children-entertainment/)
- [Deadline – Moonbug US$3 bi](https://deadline.com/2021/11/cocomelon-blippi-moonbug-entertainment-acquired-kevin-mayer-tom-staggs-blackstone-1234868432/)
- [Bloomberg 2020 – Cocomelon merch](https://www.bloomberg.com/news/articles/2020-02-10/popular-youtube-kids-channel-cocomelon-gets-into-merch-and-toys)
- [Wikipedia – Moonbug](https://en.wikipedia.org/wiki/Moonbug_Entertainment)
- [MBW – Pinkfong IPO](https://www.musicbusinessworldwide.com/baby-shark-creator-pinkfongs-shares-soar-fall-back-to-earth-in-stock-market-debut/)
- [Music Ally – Pinkfong IPO](https://musically.com/2025/11/18/baby-shark-creator-pinkfong-goes-public-with-372m-valuation/)
- [Douglas Research – Pinkfong IPO preview](https://douglasresearch.substack.com/p/the-pinkfong-company-ipo-preview)
- [CNN – Baby Shark copyright](https://www.cnn.com/2025/08/14/asia/baby-shark-copyright-court-pinkfong-intl-hnk)
- [Licensing International – Bebefinn](https://licensinginternational.org/news/the-pinkfong-companys-new-3d-animated-family-series-bebefinn-makes-a-splash-on-youtube/)
- [C21 – Skyship](https://www.c21media.net/department/thought-leadership/skyship-keeps-it-super-simple/)
- [Wikipedia – Super Simple Songs](https://en.wikipedia.org/wiki/Super_Simple_Songs)
- [supersimple.com](https://supersimple.com/super-simple-songs/)
- [Tubefilter – LBB](https://www.tubefilter.com/2018/09/14/little-baby-bum-purchased/)
- [Wikipedia – Little Baby Bum](https://en.wikipedia.org/wiki/Little_Baby_Bum)
- [Lingokids – US$120 mi](https://lingokids.com/press/linogkids-raises-120m-in-funding-to-expand-its-position)
- [PR Newswire – Maya and Mary](https://www.prnewswire.com/news-releases/vlogbox-partners-with-maya-and-mary-give-a-way-to-kids-vloggers-on-tv-screens-301267995.html)
- [Exame 03/2026 – Mundo Bita R$100 mi](https://exame.com/negocios/mundo-bita-nasceu-num-quarto-virou-fenomeno-com-20-bilhoes-de-visualizacoes-e-fatura-r-100-milhoes/)

**Regras:**
- [YouTube – Princípios de qualidade infantil](https://support.google.com/youtube/answer/10774223?hl=en)
- [YouTube – Anúncios em MFK](https://support.google.com/youtube/answer/9713557?hl=en)
- [YouTube – Políticas de monetização](https://support.google.com/youtube/answer/1311392?hl=en)
- [YouTube Kids – vídeos disponíveis](https://support.google.com/youtubekids/answer/6172307?hl=en)
- [FTC – Disney US$10 mi](https://www.ftc.gov/news-events/news/press-releases/2025/09/disney-pay-10-million-settle-ftc-allegations-company-enabled-unlawful-collection-childrens-personal)
- [Federal Register – COPPA 2025](https://www.federalregister.gov/documents/2025/04/22/2025-05904/childrens-online-privacy-protection-rule)
- [Machado Meyer – ECA Digital](https://www.machadomeyer.com.br/pt/inteligencia-juridica/publicacoes-ij/direito-digital/estatuto-digital-da-crianca-e-do-adolescente-lei-n-15-211-2025-entra-em-vigor-em-17-de-marco-de-2026)
- [Fortune – carta das 200 organizações](https://www.fortune.com/2026/04/01/ai-slop-200-organizations-letter-youtube-google)
- [TheNextWeb – purge AI slop](https://thenextweb.com/news/youtube-ai-slop-crackdown-faceless-creators-collateral-damage)
- [TechCrunch – multi-language audio](https://techcrunch.com/2025/09/10/youtubes-multi-language-audio-feature-for-dubbing-videos-rolls-out-to-all-creators/)
- [Animar Estúdio – CPM infantil BR](https://animarestudio.com.br/quanto-ganha-um-canal-infantil-no-youtube/)

**Música:**
- [ElevenLabs – Music Model-Specific Terms (26/05/2026)](https://elevenlabs.io/eleven-music-model-specific-terms)
- [ElevenLabs – Music Terms](https://elevenlabs.io/music-terms)
- [Suno – Terms of Service (vigentes em 03/09/2026)](https://suno.com/terms)
- [Suno v6 licenciado](https://www.soundstock.com/news/2026-09-11-suno-launches-v6-ai-music-models-with-industry-partnerships-and-new-editing-features)
- [Dreamtonics – SynthV 2 Pro](https://dreamtonics.com/announcing-synthesizer-v-studio-2-pro/)
- [Dreamtonics – licença das vozes](https://twitter.com/dreamtonics_en/status/1507273000793821190)
- [ACE-Step 1.5 (MIT)](https://github.com/ace-step/ACE-Step-1.5)
- [Copyright Office – relatório de IA, parte 2](https://www.jonesday.com/en/insights/2025/02/copyrightability-of-ai-outputs-us-copyright-office-analyzes-human-authorship-requirement)
- [SindMusi-MG – tabela 2025](https://sindmusimg.org.br/content/files/2025/01/TABELA-SINDIMUSI-2025.pdf)
- [Vintepila – gravação de vocais](https://www.vintepila.com.br/servicos/cantores-e-compositores/eu-vou-vou-gravar-os-vocais-da-sua-musica/)
- Wikipedia: [Twinkle](https://en.wikipedia.org/wiki/Twinkle,_Twinkle,_Little_Star), [Frère Jacques](https://en.wikipedia.org/wiki/Fr%C3%A8re_Jacques), [Bingo](https://en.wikipedia.org/wiki/Bingo_(folk_song)), [Mulberry Bush](https://en.wikipedia.org/wiki/Here_We_Go_Round_the_Mulberry_Bush), [Mary Had a Little Lamb](https://en.wikipedia.org/wiki/Mary_Had_a_Little_Lamb), [Row Row](https://en.wikipedia.org/wiki/Row,_Row,_Row_Your_Boat), [Head Shoulders](https://en.wikipedia.org/wiki/Head,_Shoulders,_Knees_and_Toes), [Old MacDonald](https://en.wikipedia.org/wiki/Old_MacDonald_Had_a_Farm), [Itsy Bitsy](https://en.wikipedia.org/wiki/Itsy_Bitsy_Spider), [Wheels on the Bus](https://en.wikipedia.org/wiki/The_Wheels_on_the_Bus), [If You're Happy](https://en.wikipedia.org/wiki/If_You%27re_Happy_and_You_Know_It), [Baa Baa](https://en.wikipedia.org/wiki/Baa,_Baa,_Black_Sheep), [London Bridge](https://en.wikipedia.org/wiki/London_Bridge_Is_Falling_Down), [Humpty Dumpty](https://en.wikipedia.org/wiki/Humpty_Dumpty), [Oh! Susanna](https://en.wikipedia.org/wiki/Oh!_Susanna)

**Próximo passo:** Felipe aprova a lista das 10 músicas e a stack de voz (SynthV + cantora no tema). Em seguida o Claude transcreve a música 1, "Hello, Capi!" (Frère Jacques), para MIDI e gera o primeiro instrumental por código.
