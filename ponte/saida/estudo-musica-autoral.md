# Estudo: música autoral no CapyFala (papel, 11/10/2026)

Pedido do Felipe (11/10): música autoral com efeito de "grudar e decorar cantando", mas **100% nossa** e com **som de
adulto**; 4º vídeo por assunto (20–40 s, frase-alvo no refrão); estilo escolhido de ouvido num teste de 3 estilos; **ver
o preço antes de gerar**.

Nada foi gerado, cantado, publicado ou comprado. Nenhuma conta foi criada. Todas as páginas foram acessadas em
**11/10/2026**. Rótulos: **[V]** = abri a página do fornecedor · **[B]** = só o trecho da busca (a rede do ambiente
bloqueia muitos sites) · **[NV]** = não verificado.

---

## 1. Resultado (5 linhas)

1. **Recomendação: Google Lyria 3.5 pela API Gemini que o canal já usa para as vozes.** US$ 0,08 por música, canta com
   letra nossa, sai com marca d'água SynthID, o Google não reivindica a música [V]. Os modelos aparecem na chave do
   projeto hoje (consulta à lista de modelos, sem gerar nada).
2. **Teste de 3 estilos: US$ 0,48** (3 estilos × 2 tentativas × US$ 0,08), teto de **US$ 0,72** com 3 tentativas.
3. **Produção: ~US$ 2,16 por mês** (9 assuntos × 3 tentativas × US$ 0,08). Cabe com folga nos ~US$ 110/mês.
4. **Erro oculto:** o Lyria **não tem nível grátis**. A chave precisa de **faturamento ativo no Google**, e a cobrança
   sai da conta Google, não do crédito do Claude. Se a chave hoje roda no plano grátis (as vozes usam o
   `gemini-3.8-flash-lite-tts` grátis, ver `docs/vozes-gemini.md`), ligar o faturamento passa a cobrar **também as
   vozes**. Isso pede uma decisão do Felipe antes do teste (§7.3).
5. **Maior risco não é jurídico, é o selo "feito para crianças"**: o YouTube lista "simple songs", "songs for children" e
   "animated characters" como sinais [V]. Bicho animado + música simples = 2 sinais. A defesa está no §6.

---

## 2. Geradores de música cantada por IA (out/2026)

| Ferramenta | Preço | Uso comercial | API | Duração máx. | Canta letra própria? EN / PT | Riscos |
|---|---|---|---|---|---|---|
| **Google Lyria 3.5** (`lyria-3.5`) | **US$ 0,08/música**, sem nível grátis [V] | Google "won't claim ownership"; usuário responde pelo uso [V] | **Sim**, Gemini API (a mesma chave do TTS) [V] | "a couple of minutes", controlável no prompt [V] | Sim: vocais e letra cronometrada [V]. "Generates lyrics in the language of your prompt" [V]. PT: listado no app Gemini [B], não listado na doc da API [NV] | SynthID em todo áudio [V]; filtro bloqueia voz de artista e letra protegida [V] |
| **Google Lyria 3 Clip** (`lyria-3-clip-preview`) | US$ 0,04/música [V] | Igual [V] | Sim [V] | **sempre 30 s** [V] | Aceita letra no prompt [V]; a doc **não deixa claro se o Clip canta** (único exemplo é sem voz) [V] | *preview*: pode mudar ou sumir [B] |
| Google Lyria 3 Pro (`lyria-3-pro-preview`) | US$ 0,08/música [V] | Igual [V] | Sim [V] | música inteira [V] | Sim [B] | marcado como "legacy" na página de preços [V] |
| **ElevenLabs Music** | Free US$ 0 (sem download); **Starter US$ 6/mês**; Creator US$ 22; Pro US$ 99 [V] | Free: download "Not permitted" e atribuição obrigatória. **Starter+: uso comercial online permitido** ("All online and offline commercial use permitted, except film, TV, radio, and Studio Games"); Starter proíbe só distribuir em streaming (Spotify etc.) [V] | Sim, US$ 0,15/min, só para pagantes [V] | 5 min [V] | Sim. Inglês confirmado [V]; português só por terceiros [B] | §4.4 dos termos: o usuário cumpre as regras de rótulo de IA de cada plataforma [V] |
| **Suno** (v6, desde 09/09/2026) | Free; Pro US$ 8; Premier US$ 24 (mensal na página) [V] | Free: "only… personal and non-commercial purposes". Pagos: "Suno hereby assigns to you all of its right, title and interest"; mas "You may not commercially exploit Output that has not been downloaded by you" [V] | Sem API oficial pública [B] | 8 min [B] | Inglês sim; português [NV] | **Downloads limitados: Pro 20/mês, Premier 60/mês** [V]. "Rights holders may also have the right to collect revenue… on third party platforms" [V]. UMG e Sony ainda processam [B] |
| Udio | página não abriu [NV] | **downloads desligados desde 29–30/10/2025**, após acordo com a UMG; sem volta até set/2026 [B] | Não | — | — | inviável |
| MiniMax Music | API US$ 0,03–0,15 [V] | — | **fechada a novos usuários desde 20/08/2026** [V] | 5 min [V] | Sim [B] | inviável |
| Mureka | Basic US$ 8/mês; Pro US$ 24/mês [V] | "full commercial rights" [V]; termos deram 404 [NV] | existe [B], sem preço oficial | [NV] | idiomas não informados | treino não divulgado [B] |
| Producer.ai (ex-Riffusion) | US$ 0/6/18/48 [V] | não informado na página [V] | [NV] | [NV] | Sim, usa modelos Lyria [V] | distribuidoras sinalizam as faixas [B] |
| Stable Audio 3.0 | app US$ 12–199 [V] | licença Community grátis < US$ 1 mi/ano [V] | Sim | 6 min 20 s [V] | **Não canta** [V] | só instrumental |
| Soundraw / Beatoven | ~US$ 3–20 [B] | royalty-free [B] | — | — | **só instrumental** [B] | não serve para cantada |

**Fontes primárias:**
- Preços Gemini/Lyria: https://ai.google.dev/gemini-api/docs/pricing (atualizada em 09/10/2026) [V]
- Lyria, doc: https://ai.google.dev/gemini-api/docs/music-generation ("The Lyria 3 Clip model always generates a 30-second
  clip"; "You can write your own lyrics and include them in the prompt"; "All generated audio includes a SynthID audio
  watermark"; "Iterative editing … is not supported") [V]
- Termos da Gemini API: https://ai.google.dev/gemini-api/terms (28/04/2026): "Google won't claim ownership over that
  content"; "You're responsible for your use of generated content"; nos serviços não pagos, revisores humanos podem ler
  entrada e saída; 18+ [V]. **Não há cláusula específica sobre música nem sobre YouTube/TikTok/Instagram.**
- ElevenLabs: https://elevenlabs.io/pricing · https://elevenlabs.io/music-terms (09/10/2026; §2.2 "you retain any and all
  rights in and to your Input and Output") · https://elevenlabs.io/docs/overview/capabilities/music [V]
- Suno: https://suno.com/pricing · https://suno.com/terms (revisão 10/08/2026, vigência 03/09/2026) [V]. Acordo com a WMG
  (25/11/2025), saída da WMG do processo (31/01/2026), limite de download valendo para a biblioteca inteira (03/09/2026),
  v6 com WMG/BMG/Believe (09/09/2026): [B], via Music Business Worldwide e outros.
- Udio: acordo UMG e fim dos downloads (out/2025), acordo WMG (19/11/2025): [B], via The Verge e Digital Music News.
- MiniMax: https://platform.minimax.io/docs/guides/pricing-paygo.md ("starting August 20, 2026, the paid music and lyrics
  APIs will no longer be available to new users") [V]
- Mureka: https://www.mureka.ai/ [V] · Producer.ai: https://www.flowmusic.app/pricing [V] · Stable Audio:
  https://stability.ai/explainers/stable-audio-vs-competitors-licensing-export-rights-and-self-hosting-compared [V]

**Leitura:**
- Nenhum termo cita YouTube, TikTok ou Instagram pelo nome. Quem permite uso comercial permite de forma geral, e isso
  cobre monetização em rede social. Exceção: o Starter do ElevenLabs proíbe só a distribuição em streaming de música, o
  que não usamos.
- O Suno ficou caro em processo: só vale o que foi **baixado** (20/mês no Pro) e os termos deixam o detentor de direitos
  coletar receita na plataforma de terceiros. Para canal monetizado, é risco desnecessário.
- **Udio e MiniMax estão fora** (sem download / sem acesso novo).

---

## 3. Alternativa sem gerador: melodia sintetizada + voz do Gemini falada no ritmo

**Como seria:** o `scripts/music.py` (que já gera a trilha lo-fi do café por código, CC0, sem Content ID) ganha uma
batida de 96–100 BPM com espaço de eco; a Capy/Lazy (Gemini TTS) **fala** os números no tempo da batida, e o pós
encaixa cada fala no compasso. É o quadro F5 "Repete no ritmo" da pesquisa de formato.

| O que dá | O que perde |
|---|---|
| Custo zero e nenhuma conta nova | **Não é canto.** No único estudo com adultos que separou os grupos, quem **falou com ritmo** se saiu pior que quem **cantou** (Ludke, Ferreira e Overy 2014, §4) |
| Voz da Capy, já aprovada pelo Felipe | O Gemini TTS não tem SSML: encaixar a fala no tempo exato é trabalho de pós (cortar e alinhar cada número) |
| Zero risco jurídico, sem marca d'água de IA de música, sem rótulo de "música de IA" | Soa como "chant de professor", mais perto de aula do que de música; perde o efeito "grudar" que o Felipe pediu (referência de efeito) |
| Pode virar o **plano B** se o selo infantil aparecer ou se o faturamento Google não for ligado | Melodia por código fica simples demais; risco de soar "brinquedo" (infantil) se mal feita |

**Uso recomendado:** não como V4, e sim como trilha dos "repete comigo" dentro dos V1 (já existe a trilha do café).

---

## 4. O que ensina de verdade (música e memória de vocabulário em adultos)

| Estudo | Amostra | Resultado | Rótulo |
|---|---|---|---|
| **Ludke, Ferreira e Overy (2014)**, *Memory & Cognition* 42:41–52 | 60 adultos, frases em húngaro, 15 min de ouvir e repetir; 3 grupos: falar, falar com ritmo, cantar | Cantar foi melhor; diferença significativa nos testes de lembrar e produzir a frase falada. Ajuda a **memória literal**; mede só o curto prazo | [V] [PDF](https://ferreiralab.faculty.ucdavis.edu/wp-content/uploads/sites/222/2015/05/Ludke-et-al.-2014_SingingForeignLanguage_Mem-Cog.pdf) |
| **Schön et al. (2008)**, *Cognition* 106 | adultos, língua artificial | Sílabas cantadas: acharam as fronteiras das palavras em 7 min; fala monótona ficou no acaso. Uma tese da Univ. de Liège **não replicou** | resultado via Ludke [V]; tese [B] |
| **Salcedo (2010)**, *J. College Teaching & Learning* | 4 turmas universitárias de espanhol iniciante | Lembrança **imediata** melhor com música; **tardia sem diferença**; mais repetição mental involuntária (o "chiclete") | [B] https://clutejournals.com/index.php/TLC/article/view/126 |
| **Racette e Peretz (2007)**, *Memory & Cognition* | 36 universitários | Cantar **não** melhorou a lembrança da letra | [B] https://link.springer.com/article/10.3758/BF03193445 |
| **Wallace (1994)**, *JEP: LMC* 20 | adultos | Melodia **fácil e repetida** ajuda a lembrar o texto; melodia difícil ou que não se repete perde a vantagem | [B] resumo secundário |
| **Murphy Odo (2022)**, meta-análise, *Language, Culture and Curriculum* 35(4) | 28 estudos, 1.864 participantes | Efeito grande de músicas em inglês sobre vocabulário de L2; valor do efeito e diferença adulto × criança **não verificados** | [B] https://www.tandfonline.com/doi/abs/10.1080/07908318.2021.2022684 |
| Meta-análise de ensino de vocabulário L2 (2018) | — | Música rendeu efeito **menor** que outros recursos (pôster, leitura, CALL) | [B] https://link.springer.com/article/10.1186/s40862-018-0062-2 |
| **Collister e Huron (2008)**; Fine e Ginsborg (2014) | ouvintes | Letra cantada: muito mais palavras mal entendidas que na fala; ~3/4 dos erros nas **consoantes**; vogal em nota aguda perde inteligibilidade | [B] https://pmc.ncbi.nlm.nih.gov/articles/PMC4155173/ |
| Good, Russo e Sullivan (2015) | 38 crianças (só contraste) | Canto melhorou lembrança literal e pronúncia de vogais; tradução baixa nos dois grupos | [B] |
| Andamento × aprendizagem de L2; earworm × vocabulário | — | Não achei estudo que isole isso | [NV] |

**O que a evidência sustenta:** em adulto, cantar ajuda a **guardar e repetir a frase exata** logo depois, e faz a frase
voltar sozinha na cabeça. **O que não sustenta:** retenção de longo prazo garantida, entender o significado, nem que
música seja melhor que os outros métodos. Por isso a música é o **4º vídeo** (decorar), e não substitui a aula (V1) nem
a história (V2).

**Regras práticas para a letra (já aplicadas em `musica-numeros-1a10.md`):**
1. **1 frase-alvo** + o vocabulário do assunto; nada de verso narrativo (cada palavra cantada é palavra ensinada).
2. **Refrão repetido**, melodia de **poucas notas**, a mesma a cada volta (Wallace 1994).
3. **Pronúncia clara:** região média da voz, nada de agudo; nota longa o bastante para a **consoante final** (five,
   eight, ten); pedir "crisp final consonants" no prompt (Collister e Huron 2008).
4. **Andamento 96–118 BPM**, 1 bloco por compasso, poucas palavras por compasso. (Andamento escolhido por
   inteligibilidade, não por estudo de L2, que não achei.)
5. **Eco:** compasso inteiro **sem voz nenhuma** depois de cada chamada, para o espectador repetir (é o "ouvir e repetir"
   do Ludke).
6. **Falar antes e depois:** a frase-alvo é falada (V1–V3) antes de ser cantada (V4); a música revisa, não apresenta.
7. **Legenda EN sempre**, com dígito grande; no eco, só o dígito (o aluno tem que lembrar a palavra).

---

## 5. Como a música convive com as regras das plataformas

### TikTok
- **Som original:** vídeo público com áudio próprio (sem faixa da biblioteca) vira "som original" da conta, e outros
  podem usar ("Use this sound"). Não encontrei opção para impedir o reuso em som público. O nome do som só se define
  antes de salvar [B] (castellamedia.com, soundstripe.com). **Para nós é bom:** reuso = alcance de graça com o nome
  "One to Ten · CapyFala".
- **Rótulo de IA:** o TikTok exige rótulo em conteúdo **realista** gerado por IA, inclusive áudio; existe a opção
  "AI-generated" no post; lê C2PA para imagem e vídeo; conteúdo sem rótulo pode ser removido [B] (NBC, Maginative, Music
  Business Worldwide). Voz cantada de IA soa realista → **marcar o rótulo**.
- **Creator Rewards:** vídeo original **com mais de 1 minuto** [B]. **O V4 (20–40 s) não entra**, e foi desenhado para
  isso: é corte de alcance; quem monetiza são os V1–V3. Se música de IA conta como "original" no CRP: fontes se
  contradizem, nada oficial [NV].
- "Conteúdo não original" (Para Você): definição oficial não aberta [NV].

### YouTube
- **Divulgação de conteúdo sintético** (https://support.google.com/youtube/answer/14328491) [V]: é preciso declarar IA
  que "Creates music that's the main focus of the video"; ao mesmo tempo, "Creators don't need to disclose non-realistic
  content that's made with AI" (animação). Uma música cantada por voz de IA num vídeo animado fica em zona cinzenta →
  **marcar** (não custa nada; segundo cobertura de imprensa de 27/05/2026, o rótulo "não afeta monetização nem
  recomendações" [B]).
- **Content ID** (https://support.google.com/youtube/answer/2605065) [V]: para registrar é preciso "exclusive rights to
  the material"; não se qualificam licenças não exclusivas, domínio público, "sound-alike recordings", loops. A página não
  fala de IA. **Não registrar** a nossa música. O risco real é o contrário: alguém registrar uma faixa parecida e
  reivindicar o nosso vídeo; com o Lyria isso é menos provável (filtro contra imitação de artista e letra protegida, e a
  letra é nossa), mas não é zero [NV quanto à frequência].
- **YPP, "conteúdo inautêntico"** (https://support.google.com/youtube/answer/1311392) [V]: desde 15/07/2025 não monetiza
  "AI-generated content made with generic or unoriginal templates giving the impression of mass production"; com IA,
  "the final product must still demonstrate your creative vision". **Implicação:** cada música tem letra própria do
  assunto, roteiro de imagem próprio e o elenco; nunca o mesmo instrumental com letra trocada em série.

### Instagram (Meta)
- Rótulo "AI info" por autodeclaração ou detecção de sinal técnico no arquivo; voz de IA realista pede rótulo [B]
  (help.instagram.com abriu vazio). A API de publicação ganhou o parâmetro `is_ai_generated` em 22/06/2026 [B] (changelog
  da plataforma de desenvolvedor) → **a fábrica pode marcar automaticamente**.
- Áudio original de Reels: reuso não desligável [B].

**SynthID:** todo áudio do Lyria sai com marca d'água SynthID [V]. Combina com marcar o rótulo de IA nas 3 redes: o
rótulo deixa de ser surpresa.

---

## 6. Como NÃO parecer infantil (o selo "feito para crianças")

O YouTube lista como sinais [V] (https://support.google.com/youtube/answer/9528076): personagens que atraem criança,
**"including animated characters"**; **"simple songs or games, or early education"**; **"songs, stories, or poems for
children"**; linguagem para criança; metadados de público infantil. Com o selo, o YouTube desliga [V]
(https://support.google.com/youtube/answer/9632097): **comentários**, anúncios personalizados, notificações, salvar em
playlist, cards e telas finais, memberships, posts do canal, entre outros.

| Evitar | Usar |
|---|---|
| Coro infantil, voz fina, voz "de desenho" | Voz adulta em região média/grave (mulher meio-soprano/contralto; homem grave) |
| Melodia de cantiga, rima de berçário ("one, two, buckle my…"-like), palminha de roda | Gêneros de adulto: pop dançante, bossa lo-fi de café, chant de ginásio |
| Instrumento de brinquedo (xilofone de brinquedo, sininho, apito de festa) | Baixo encorpado, violão de nylon, piano elétrico, bateria de vassourinha, metais graves, pisada de arena |
| Cenário de escola, sala de aula, quarto de criança, cores primárias chapadas | Café, bar de basquete, trabalho, turista; paleta do canal |
| "Vamos aprender a contar!", "musiquinha", "para crianças", "infantil" no título, legenda ou hashtag | Título de adulto ("os números que você vai cantar no banho"); hashtags de adulto (#inglesparaadultos, #inglesparaviagem) |
| Dancinha coreografada do elenco | Elenco mexendo a cabeça no ritmo, o Hank sério de patas para cima (humor seco) |
| Contar brinquedos, bichinhos, balas | Contar cafés, copos, cestas, turistas |
| Pedir para "pais" ou "crianças" cantarem | "Você repete", "canta no banho", "no trânsito" |
| Marcar o canal/vídeo como "para crianças" por precaução | **Marcar "não é para crianças"** em todo upload (definição da fábrica, `publicar.py`) |

Regra de corte (vale para o V4 como para o F5 da pesquisa de formato): **qualquer** sinal de classificação infantil
(aviso do YouTube, comentários desligados) pausa os V4 até o Felipe decidir.

---

## 7. Recomendação única

### 7.1 Ferramenta: **Google Lyria 3.5 pela Gemini API**

**Por quê:**
- **mais barata com direito de uso:** US$ 0,08 por música, sem mensalidade [V]; o Google não reivindica a música [V];
- **canta com letra nossa** e controla a duração [V] (o Clip, a US$ 0,04, sempre faz 30 s e a doc não confirma que
  canta: fica de reserva, 1 tentativa no teste para tirar a dúvida, se o Felipe quiser);
- **já está na chave do projeto** (lista de modelos consultada em 11/10; nada gerado): sem conta nova, sem cartão novo
  num fornecedor novo, entra no mesmo `scripts/` da fábrica;
- **sem processo de gravadora** contra o fornecedor, filtro contra imitação de artista, SynthID [V];
- o português do V4 é **falado** pela Capy no TTS (já aprovado), então não dependemos do Lyria cantar em português (que
  não está confirmado na API).

**Reserva:** ElevenLabs Music no plano Starter (US$ 6/mês, uso comercial online explícito na tabela de termos [V]), se o
Lyria cantar mal os números ou se o Felipe não quiser ligar o faturamento no Google.

### 7.2 A conta

**Teste de 3 estilos (decisão de ouvido):**

| | Conta | Total |
|---|---|---|
| Base | 3 estilos × 2 tentativas × US$ 0,08 | **US$ 0,48** |
| Teto | 3 estilos × 3 tentativas × US$ 0,08 | **US$ 0,72** |
| Opcional | + 1 tentativa no Lyria 3 Clip (tirar a dúvida se canta) × US$ 0,04 | + US$ 0,04 |

**Produção (V4 de cada assunto):**
- grade: 2 assuntos por semana → 2 × 52 / 12 ≈ **8,7 assuntos por mês**, arredondado para **9**;
- 3 tentativas por música (o portão escolhe a melhor pela checagem de ouvido de `musica-numeros-1a10.md` §3);
- 9 × 3 × US$ 0,08 = **US$ 2,16 por mês**;
- se a cadência subir para 3 assuntos por semana (teste das semanas 3–4): 13 × 3 × 0,08 = **US$ 3,12 por mês**;
- a voz da Capy no V4 (2 falas curtas) sai do TTS que já está na conta de voz.

**No orçamento de ~US$ 110/mês:** a música soma **~2% do orçamento** (US$ 2,16). Na reserva (ElevenLabs Starter), seriam
US$ 6/mês, ~5%.

### 7.3 Antes de gerar (decisões do Felipe)

1. **Autorizar o teste de até US$ 0,72** no Lyria 3.5 (3 estilos, `musica-numeros-1a10.md` §4), entregue como teste
   cego (X, Y, Z), igual ao teste de voz.
2. **Faturamento da chave Gemini.** O Lyria não tem nível grátis [V]. Se a chave hoje roda no grátis:
   - ligar o faturamento passa a cobrar as vozes também (o `flash-lite-tts` deixaria de ser grátis): pela estimativa do
     estudo de voz, **~US$ 3/mês até dez/2026, ~US$ 6/mês depois** (`voz-audio-didatico.md`);
   - **alternativa:** um **projeto Google separado, só para música**, com faturamento e limite de gasto baixo
     (ex.: US$ 5/mês), e a chave atual das vozes continua grátis. Recomendo esta.
   - Ligar faturamento e criar chave é login e cartão: **só com o Felipe no teclado** (regra da ponte).
3. Nos serviços **não pagos** da Gemini API, revisores humanos podem ler entrada e saída [V]: com faturamento ligado,
   isso deixa de valer para a música (bom para a letra inédita).

**Nota da recomendação: 8/10.** O que falta para 10: (1) ouvir se o Lyria 3.5 canta "five", "seven" e "eight" com o fim
certo (só o teste mostra); (2) abrir no PC as páginas oficiais de IA do TikTok e do Instagram e o regulamento do Creator
Rewards (aqui só via busca).
