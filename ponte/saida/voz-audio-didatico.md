# CapyFala — voz e áudio didático

Pesquisa feita em 26–27/09/2026. Preço e ranking mudam toda semana; tudo tem URL e data. O que não conferi na fonte está marcado "não verificado".

---

## 1. Resumo em 6 linhas

1. O Kokoro está mesmo na parte de baixo da tabela: Elo 1063, 49º lugar no ranking cego da Artificial Analysis (25/09/2026). A "qualidade mediana" que vocês ouvem aparece medida.
2. Para ensinar pronúncia, a nota de naturalidade importa menos do que a de pronúncia certa. No teste de pronúncia da Artificial Analysis, o Gemini 3.1 Flash TTS acertou 88,1%, o ElevenLabs v3 85,6% e o Cartesia Sonic 3.6 só 74,5%, mesmo sendo o nº 1 em naturalidade.
3. Recomendação: Gemini 3.8 Flash TTS como motor principal de todos os personagens (sai por uns US$3 a 6 por mês). O Azure Neural fica como ferramenta de precisão para IPA, soletrar e pausas exatas (cabe no plano grátis). O ElevenLabs v3 só entra para a Capy se ganhar o teste cego. Total estimado: US$6 a 30 por mês.
4. A ciência diz: frase-alvo lenta na 1ª vez, porque 128 palavras/min rendeu mais compreensão que 188 (Griffiths 1992). É melhor pôr pausa do que esticar a fala, porque pausas inseridas ganharam de fala desacelerada (Blau 1990). Várias vozes dizendo a mesma palavra também ajudam (HVPT, efeito médio a grande).
5. Música de fundo com fala ensinando prejudica a retenção (Moreno & Mayer 2000). Por isso a trilha fica pelo menos 20 dB abaixo da voz e zera na palavra-alvo e na pausa de repetição.
6. Riscos reais: a OpenAI exige avisar que a voz é IA, o YouTube corta monetização de conteúdo "produzido em massa" (desde 15/07/2025), e as vozes da biblioteca do ElevenLabs podem ser clones de gente real. Use só vozes prontas ou desenhadas e rotule sempre.

---

## 2. As 8 regras de áudio do CapyFala

Cada regra traz o parâmetro, a evidência e o grau de certeza. "Parâmetro de partida" quer dizer que não há estudo que fixe esse número exato. É o nosso chute calibrado, e o teste do item 4 confirma ou troca.

### Regra 1 — Frase-alvo em inglês em três passadas: lenta, picada, nativa

- **1ª vez:** ~120 palavras/min, com prosódia natural (Lazy ou Hank "falando claro"). **2ª vez:** na velocidade nativa, com pausa entre os blocos de sentido. **3ª vez:** nativa corrida, ~160–170 palavras/min (Hank).
- **Evidência:** Griffiths (1992, TESOL Quarterly 26(2)) testou 128, 188 e 250 palavras/min com alunos pré-intermediários. A compreensão foi bem maior a 128 do que a 188, e entre 188 e 250 não houve diferença. A fala normal em inglês fica em ~150–180 palavras/min. Fontes: https://onlinelibrary.wiley.com/doi/pdf/10.2307/3587015 e o resumo em https://www.researchgate.net/publication/371830992 (consultados em 26/09/2026).
- **Por que terminar na nativa:** o aluno precisa reconhecer a frase na vida real. Canais grandes fazem o mesmo, lento primeiro e rápido depois (item 3).
- **Certeza:** alta para "lento ajuda o A1/A2". Os valores exatos 120 e 165 são parâmetro de partida.

### Regra 2 — Desacelerar com PAUSA, não esticando o som

- A "lentidão" do Lazy vem de pausas de 400–700 ms entre blocos e de um ritmo de fala só um pouco reduzido (rate −15% a −25%). Nunca use time-stretch no pós (tipo `atempo 0.6` no ffmpeg), porque ele deforma as vogais e ensina o som errado.
- **Evidência:** Blau (1990, TESOL Quarterly) comparou fala normal, fala desacelerada e fala normal com pausas de 3 s em pontos escolhidos. O melhor resultado veio das pausas; a fala desacelerada foi a pior. https://onlinelibrary.wiley.com/doi/10.2307/3587129 (resumo lido via busca, 26/09/2026)
- **Certeza:** alta na direção (pausa > esticar). A duração de 400–700 ms dentro da frase é parâmetro de partida, porque 3 s não cabem num Short.
- **Consequência técnica:** o motor tem de controlar pausa. Azure (`<break time="500ms"/>`) e Cartesia (`<break time="…"/>`) controlam de verdade. Gemini e OpenAI só obedecem a instrução em texto, com resultado menos exato. Para os trechos de pronúncia, a pausa é inserida no código: gera cada bloco separado e cola com silêncio medido.

### Regra 3 — Pausa de repetição (shadowing) = duração da frase + 1,0 s

- Depois da frase-alvo vem um silêncio com contagem visual na tela, do tamanho da frase mais 1,0 s. O mínimo é 1,5 s e o máximo 3,5 s. A trilha fica muda nesse intervalo.
- **Evidência:** o "princípio da antecipação" do Pimsleur usa a pausa para o aluno produzir antes de ouvir a resposta (https://www.pimsleur.com/the-pimsleur-method/, 26/09/2026). A revisão sistemática sobre shadowing (Taylor & Francis, 2025) aponta ganho em inteligibilidade e prosódia, mas registra que muitos estudos misturam shadowing com repetição (https://www.tandfonline.com/doi/full/10.1080/29984475.2025.2546827).
- **Certeza:** baixa quanto ao número exato. Não achei estudo que fixe a duração da pausa em vídeo curto. Existe um conflito real com a retenção do Short, porque silêncio faz o público sair. Por isso a pausa é cronometrada e acompanhada de contagem visual, e o teste de retenção decide.

### Regra 4 — A mesma palavra-alvo em pelo menos 3 vozes diferentes

- Em cada episódio, a palavra ou frase-alvo aparece na voz de pelo menos 3 personagens (ex.: Hank, Lazy, Poppy). Pelo menos um deles é homem grave e outro é mulher ou voz aguda.
- **Evidência:** o treino fonético de alta variabilidade (HVPT) expõe o aluno a vários falantes para ele aprender o som, e não a voz de uma pessoa. Uma meta-análise em Studies in Second Language Acquisition (Uchihara et al., 79 estudos) encontrou g = 0,92 entre pré e pós-teste e g = 0,67 contra o grupo controle, efeito médio a grande na percepção. Outra meta-análise achou g = 0,77 na pronúncia. Thomson (2018) revisou 32 estudos. Fontes: https://www.cambridge.org/core/journals/studies-in-second-language-acquisition/article/high-variability-phonetic-training-hvpt-a-metaanalysis-of-l2-perceptual-training-studies/6ABB8C1F32D88D53EA8D05A4565E76F6 e https://files.eric.ed.gov/fulltext/EJ1425175.pdf (os números vêm dos resumos; o artigo completo deu erro 429 e não li a íntegra).
- **Certeza:** alta no princípio. "3 vozes num Short" é uma adaptação nossa, porque os estudos usam sessões inteiras de treino.
- **Bônus:** o elenco já é uma máquina de HVPT. Nenhum curso de inglês para brasileiro no TikTok explora isso de propósito (não verificado, é impressão da busca).

### Regra 5 — Quem serve de modelo de pronúncia é Hank ou Lazy, nunca a Capy

- A Capy fala inglês com sotaque de brasileira aprendendo, e isso é ótimo para criar identificação. Mas o erro dela vem sempre seguido do contraste certo: Capy erra → Lazy mostra devagar → Hank fala natural. Ela nunca é a última voz a dizer a palavra-alvo.
- **Evidência:** a pesquisa atual põe a inteligibilidade à frente do sotaque nativo (Levis, "princípio da inteligibilidade"), e professor não nativo ensina pronúncia tão bem quanto nativo, porque o que conta é a expertise (https://iastate.pressbooks.pub/teachingpronunciation/chapter/chapter-2-pronunciation-in-language-teaching/, 26/09/2026). Então o sotaque da Capy não é problema de credibilidade. O contraste "erro provável × alvo" é justamente o método do Rachel's English (item 3).
- **Cuidado técnico:** pedir "sotaque brasileiro" ao TTS pode virar caricatura. Nas instruções, mande algo como "leve sotaque brasileiro, vogais um pouco abertas, sem exagero" e aprove de ouvido.
- **Certeza:** média. É inferência apoiada em literatura, não um estudo com vídeo curto.

### Regra 6 — Ênfase na palavra-alvo: micro-pausa antes e acento marcado

- Coloque 300 ms de silêncio antes da palavra-alvo, e a palavra sai com ênfase (Azure `<emphasis level="strong">` ou `<prosody pitch="+8%" volume="+3dB">`; no Gemini e no ElevenLabs, tag de áudio ou instrução "stress the word X"). Na legenda, a mesma palavra aparece em cor no mesmo instante.
- **Evidência:** quando a entonação anterior prevê acento forte na palavra, o tempo de resposta cai, ou seja, o ouvinte processa mais rápido. A proeminência prosódica ajuda a segmentar e a guardar expressões ouvidas (resumos em https://www.researchgate.net/publication/359634462 e https://onlinelibrary.wiley.com/doi/10.1111/modl.70029, 26/09/2026). O realce de input em áudio tem literatura própria (Cho & Reinders 2013, https://innovationinteaching.org/docs/book-chapter-2013-Cho-and-Reinders-Input-Enhancement.pdf).
- **Certeza:** média na direção. Os 300 ms e o +8% são parâmetro de partida.

### Regra 7 — Trilha pelo menos 20 dB abaixo da voz e muda nos momentos de aprender

- Trilha a **−22 dB** em relação à fala (RMS/LUFS de curto prazo), com ducking automático (sidechain). Nos trechos de frase-alvo, soletração e pausa de repetição, a trilha vai a **zero** (fade de 150 ms). Mix final em torno de −14 LUFS integrado, que é a referência comum de plataforma (não verificado em documento oficial do TikTok/YouTube).
- **Evidência:** Moreno & Mayer (2000) mostraram que música de fundo junto com efeitos sonoros piorou retenção e transferência em comparação com nenhum dos dois, com efeito grande (https://tecfa.unige.ch/tecfa/teaching/methodo/Moreno_Mayer00.pdf). A literatura posterior é mista: há estudo com música ajudando a transferência (Lehmann 2019, https://onlinelibrary.wiley.com/doi/full/10.1002/acp.3509), com efeito dependendo da memória de trabalho e do perfil do aluno. A regra de acessibilidade do W3C manda som não verbal pelo menos 20 dB abaixo da fala (https://www.w3.org/TR/WCAG20-TECHS/G56.html, 26/09/2026).
- **Leitura:** a música ajuda a segurar atenção no feed, mas atrapalha no instante de aprender o som. Daí "trilha baixa no resto e zero na hora da palavra".
- **Certeza:** alta para "baixa e muda no alvo". O −22 dB é parâmetro de partida dentro da faixa de −20 a −25 dB usada por quem mixa voz.

### Regra 8 — Marca sonora curta e sons de feedback que não pisem na fala

- Três sons fixos, iguais em todos os episódios: (a) **sting de abertura** da Capy, ≤ 1,0 s, sempre o mesmo; (b) **"acertou"**, ≤ 0,6 s, agudo e ascendente; (c) **"errou"**, ≤ 0,6 s, grave e curto, cômico e não punitivo. Nenhum deles toca por cima de uma fala. Entre o som e a fala seguinte, 150 ms de silêncio.
- **Evidência:** o "ding" de acerto do Duolingo virou marca: ficou associado a progresso e é reaproveitado por criadores em quizzes (https://soundcy.com/article/what-does-duolingo-sound-like e https://propersounds.co/Duolingo, 26/09/2026). Isso é fonte de mercado, não estudo. O limite de "não pisar na fala" vem do princípio de coerência de Mayer: som extra concorrendo com a fala custa memória de trabalho.
- **Detalhe de personagem:** a Dona Jaca na videochamada passa por um filtro de telefone (passa-banda 300–3.400 Hz). O público identifica "é a mãe no celular" sem precisar de legenda, e ela nunca fala a frase-alvo com esse filtro, porque ele corta as consoantes.
- **Certeza:** média. Faz sentido de marca e bate com a teoria, mas não há estudo com Shorts de idioma.

### Sobre voz sintética × humana (base para usar TTS sem culpa)

- Craig & Schroeder (2017, Computers & Education): uma voz TTS moderna produziu **mais** aprendizagem de transferência que um motor antigo e foi avaliada no **mesmo nível** da voz humana em credibilidade (https://www.sciencedirect.com/science/article/abs/pii/S0360131517301653).
- Um estudo na Costa Rica (2023) com alunos de inglês achou compreensão e ditado parecidos com TTS e com voz humana, mas nota pior de naturalidade para o TTS (https://www.scielo.sa.cr/scielo.php?script=sci_arttext&pid=S1659-38202023000200041).
- Conclusão: o problema não é "ser TTS", é "ser TTS velho". Trocar o Kokoro é o que importa.
- A afirmação vista em blog de que "a compreensão cai 23% após 12 minutos de voz sintética" está **não verificada**, e para vídeo de 70 s não faz diferença.

---

## 3. Mercado de TTS (setembro/2026)

### Volume estimado

- 2 vídeos/dia × 70 s × 30 dias = **70 min de vídeo por mês**. A fala ocupa ~55 min, o resto é pausa e música.
- Com regravações, variantes e o teste cego, conte **~3× isso gerado: ~200 min/mês**, o que dá **~170 mil caracteres/mês** (estimativa de ~850 caracteres por minuto falado, somando fala lenta e fala normal).

### Tabela

| Motor | PT-BR | EN americano | Controle (velocidade/pausa/ênfase/IPA/soletrar) | Troca PT↔EN na frase | Custo/mês estimado (~200 min / ~170 mil caracteres) | Licença comercial | API na nuvem |
|---|---|---|---|---|---|---|---|
| **Gemini 3.8 Flash TTS** (Google, GA em 22/09/2026) | Boa (130+ idiomas, dito pelo fornecedor; PT-BR não testado por mim) | Muito boa: nº 2 no ranking geral, Elo 1265 | Médio: estilo e ritmo por instrução, 200+ tags de áudio, até 2 falantes por chamada; **sem SSML** (pausa e IPA não são garantidos) | Sim, o modelo é multilíngue | **US$0,0135/min até 31/12/2026 → ~US$2,70**; **US$0,027/min a partir de 01/01/2027 → ~US$5,40** | Sim no plano pago; áudio sai com marca d'água SynthID | Sim |
| **Gemini 3.1 Flash TTS** (preview) | idem | Melhor pronúncia medida: 88,1% | idem | Sim | US$1/1M tokens de entrada + US$20/1M de saída (~US$0,03/min) → ~US$6 | Sim | Sim (preview pode mudar) |
| **ElevenLabs v3** | Muito boa (top 3 em 7 dos 9 idiomas do ranking multilíngue) | Boa: Elo 1169; v3 Conversational 1196; pronúncia 85,6% | Alto em emoção (tags [laughs], [whispers]…); **IPA nativo entre barras no v3**, dicionário de pronúncia; pausa menos exata | Sim | Creator **US$22/mês** (121 mil créditos, 1 crédito = 1 caractere) não cobre 170 mil → Creator + excedente ≈ **US$35–45**, ou Pro US$99 | Sim a partir do Starter (US$6); saída do plano pago é sua | Sim |
| **Azure Neural / HD** | Boa (várias vozes pt-BR e vozes multilíngues) | Boa; MAI-Voice-2 a partir de US$22/1M | **O mais fino**: SSML completo (`prosody rate/pitch`, `break`, `emphasis`, `phoneme` com IPA, `say-as` para soletrar) e estilos por voz | Sim, com `<lang xml:lang="pt-BR">` nas vozes Multilingual/DragonHD | US$16/1M (Neural) ou US$22/1M (HD) → **US$2,70–3,70**; plano grátis de 500 mil caracteres/mês (segundo TextToLab, não conferido na página oficial) → provável **US$0** | Sim | Sim |
| **OpenAI gpt-4o-mini-tts** | Razoável a boa (40+ idiomas, "segue o Whisper") | Boa; o tts-1 antigo tem Elo 1101 | Médio: `instructions` para sotaque, emoção e ritmo; **sem SSML** | Sim | ~US$0,015/min → **~US$3** | Sim, mas a política **exige avisar o ouvinte que a voz é IA** | Sim |
| **Google Chirp 3 HD** | Boa | Boa | Médio (velocidade, pausas básicas) | Limitado (voz por idioma) | US$30/1M, com **1M de caracteres grátis/mês** → **US$0** | Sim | Sim |
| **Cartesia Sonic 3.6 / 3.5** | **nº 1 no ranking de português (Sonic 3.5)**; variante PT-BR ou PT-PT não verificada | nº 1 geral, Elo 1279 | Alto em pausa (`break`), velocidade 0,6–1,5, `spell`, emoção, dicionário; mas pronúncia em **74,5%**, 11º lugar | Sim (42–44 idiomas) | Pro US$5 (~133 min, pouco) → Startup **US$49** | Sim a partir do Pro | Sim |
| **Hume Octave 2** | Suporta português (11 idiomas) | Boa, forte em emoção | Emoção por instrução; pouco controle fonético | Não verificado | Creator US$14 → ~US$14–20 | Sim no pago; o grátis não é comercial | Sim |
| **Kokoro 82M** (atual) | Fraca a média (3 vozes pt; a própria análise diz que o inglês americano é o ponto forte) | Média: Elo 1063, 49º lugar | Baixo | Não (uma voz por idioma) | US$0 + CPU | Apache-2.0 | Local |
| **Chatterbox Multilingual** (aberto) | Tem finetune PT-BR dedicado | Boa (comparável a ElevenLabs segundo a Resemble, **não verificado** de forma independente) | Emoção por controle de exagero; clonagem | Não verificado | US$0 + GPU | MIT, com marca d'água | Local/GPU |

Fontes da tabela, todas consultadas em 26/09/2026:
- Ranking e preços derivados: https://www.digitalapplied.com/blog/best-text-to-speech-models-september-2026-ranked-priced (dados de 25/09/2026) e https://artificialanalysis.ai/text-to-speech/leaderboard
- Teste de pronúncia (454 frases, 701 trechos, julgamento humano, publicado em 22/09/2026): https://alphasignal.ai/news/artificial-analysis-benchmark-reveals-gemini-3-1-flash-tts-beats-sonic-3-6-on
- Ranking multilíngue (Sonic 3.5 lidera português): https://alphasignal.ai/news/cartesia-s-sonic-3-6-dominates-eight-of-nine-global-voice-ai-leaderboards
- Preços Gemini, com aviso de "price increase on Jan 1, 2027": https://ai.google.dev/gemini-api/docs/pricing
- Gemini 3.8 GA e preço por minuto: https://www.digitalapplied.com/blog/gemini-3-8-flash-tts-voice-cloning-price-doubles-january
- ElevenLabs: https://elevenlabs.io/pricing; IPA no v3: https://elevenlabs.io/docs/eleven-api/guides/how-to/text-to-speech/pronunciation-dictionaries; excedente: https://flexprice.io/blog/elevenlabs-pricing-breakdown (o valor do excedente vem de terceiros e não está verificado)
- OpenAI, preço: https://developers.openai.com/api/docs/pricing
- OpenAI, instruções e aviso obrigatório: https://developers.openai.com/api/docs/guides/text-to-speech
- Azure, preço: https://azure.microsoft.com/en-us/pricing/details/speech/ e https://texttolab.com/blog/azure-text-to-speech-pricing
- Azure, troca de idioma: https://learn.microsoft.com/en-us/azure/ai-services/speech-service/speech-synthesis-markup-voice e https://learn.microsoft.com/en-us/azure/ai-services/speech-service/high-definition-voices
- Google Chirp 3 HD: https://texttolab.com/blog/google-cloud-tts-pricing (a página oficial veio truncada)
- Cartesia: https://www.cartesia.ai/pricing e https://docs.cartesia.ai/build-with-cartesia/sonic-3/ssml-tags
- Hume: https://www.hume.ai/blog/octave-2-launch
- Chatterbox: https://www.resemble.ai/learn/models/chatterbox-multilingual

### Recomendação por personagem

| Personagem | Motor | Por quê |
|---|---|---|
| **Hank** (panda americano, grave, modelo nativo) | **Gemini 3.8 Flash TTS**, voz masculina grave pronta, instrução fixa "gruff, deadpan, General American" | Melhor família em pronúncia medida e barato. Ele é o modelo final da frase, então a pronúncia certa vale mais do que tudo |
| **Lazy** (preguiça que ensina pronúncia devagar) | **Azure Neural (en-US)** com SSML: `prosody rate="-20%"`, `break`, `phoneme` IPA, `say-as` para soletrar | É o único que garante pausa em milissegundos, fonema exato e soletração. É o personagem que mais precisa de precisão |
| **Capy** (PT-BR + inglês com sotaque) | **Gemini 3.8 Flash TTS** como padrão. Se perder o teste cego em emoção ou PT-BR, **ElevenLabs v3 Creator (US$22)** | Troca PT↔EN na mesma frase e aceita a instrução "leve sotaque brasileiro". O ElevenLabs costuma ganhar em emoção, e o teste decide se vale a mensalidade |
| **Poppy** (gíria jovem) | Gemini 3.8 Flash TTS, voz jovem, instrução "casual Gen Z, fast" | Gíria soa natural por instrução |
| **Duda, Bolinha** | Gemini 3.8 Flash TTS, vozes prontas distintas (Bolinha mais aguda) | Custo quase zero e timbres bem separados |
| **Dona Jaca** (mãe, videochamada) | Gemini 3.8 Flash TTS em PT-BR, voz madura, com filtro de telefone no pós | Só fala português, sem necessidade de controle fino |

**Custo mensal total estimado:**
- Até dezembro/2026: Gemini ~US$3 + Azure US$0 (plano grátis) = **~US$3/mês**.
- A partir de janeiro/2027: ~US$6/mês.
- Com o ElevenLabs para a Capy: **+US$22 a 40 → teto de ~US$45/mês**. Fica bem dentro dos US$110.

**Consistência entre episódios** (a voz não pode mudar de um vídeo para outro):
- Use sempre voz pronta ou desenhada, com ID fixo, e a mesma instrução de estilo guardada num arquivo `vozes.yaml` versionado.
- Motores guiados por instrução (Gemini, OpenAI, ElevenLabs v3) variam mais de uma geração para outra do que o SSML do Azure. Por isso a consistência entra como métrica no teste do item 4.
- Nada de clonar voz de ninguém.

**Plano B grátis:**
1. **Google Chirp 3 HD** (1M de caracteres grátis/mês, uns 6× o nosso uso) para todos, mais **Azure plano grátis** para o Lazy.
2. Último recurso offline: **Kokoro** (atual) ou **Chatterbox Multilingual** com finetune PT-BR (MIT, precisa de GPU). Só depois de passar no mesmo teste cego.

**Atenção:** o Gemini 3.8 saiu em 22/09/2026, há 5 dias. Modelo novo muda de comportamento e de preço (o preço já dobra em janeiro). Deixe o motor de cada personagem numa linha de configuração, para trocar sem mexer no código.

---

## 4. Teste cego para decidir com dados

Regras definidas **antes** de ouvir qualquer áudio. Grave este bloco com data e não mexa depois.

**Motores:** Gemini 3.8 Flash TTS, ElevenLabs v3 e Azure (Neural ou HD). O Kokoro entra como âncora: se algum motor perder para ele, o teste está errado.

**As 5 falas fixas:**
1. Capy, PT com inglês no meio: "Gente, eu pedi um *coffee to go* e a moça me deu um *cup of tea*… de novo!"
2. Hank, inglês natural com redução: "What do you wanna do this weekend? I'm kinda tired."
3. Lazy, par mínimo lento com IPA: "Ship… /ʃɪp/. Sheep… /ʃiːp/. Ship. Sheep." (com pausa de 600 ms entre as palavras)
4. Lazy, soletração e número: "Through. T-H-R-O-U-G-H. Thirteen, not thirty."
5. Poppy, gíria: "No cap, that pizza was bussin'. Lowkey the best in town."

**Métricas e critério de aprovação:**

| # | Métrica | Como medir | Critério de aprovação |
|---|---|---|---|
| A | **Pronúncia do alvo** | Um nativo americano (ou dois brasileiros C1/C2) marca certo ou errado em cada palavra-alvo (ship/sheep, through, thirteen/thirty, wanna, bussin'). Conferência automática: transcrever com Whisper large-v3 e medir WER nas falas 2–5 | **100% certo nos alvos** (reprova se errar um) e WER ≤ 5% |
| B | **Naturalidade** | MOS de 1 a 5, cego e em ordem aleatória, com ≥ 8 brasileiros adultos do público (A1–B1) nas falas 1 e 5, e o nativo nas falas 2–5. Formulário simples, arquivos com nome aleatório | MOS ≥ 4,0 |
| C | **Obediência ao controle** | Medir no áudio (librosa/praat) a pausa pedida (600 ms) e a velocidade (palavras/min) | Pausa dentro de ±150 ms e velocidade dentro de ±10% do pedido |
| D | **Consistência de voz** | Gerar a fala 2 cinco vezes em dias diferentes. Similaridade de falante por embedding ECAPA (SpeechBrain), cosseno médio par a par | ≥ 0,80 (parâmetro de partida; calibrar com o próprio Azure, que deve dar perto de 1) |
| E | **Custo** | US$ por minuto real gerado, com a fatura do teste | Registro apenas |

**Regra de decisão por personagem:**
- O motor precisa passar em A e em D.
- Entre os que passam, ganha o de maior MOS (B).
- Se a diferença de MOS for menor que 0,3, ganha o mais barato.
- Para o Lazy, C também é obrigatório.

**Custo do teste:** menos de US$5 (Azure e Gemini com uso grátis, mais um mês de ElevenLabs Starter a US$6).

**Depois do lançamento:** fazer A/B de retenção no Short (tempo médio assistido e % que chega ao fim) só entre os dois finalistas da Capy. O placar de verdade é a retenção, somada a um mini-quiz de "qual palavra você ouviu" no comentário fixado.

---

## 5. Riscos

| Risco | O que pode dar errado | Defesa |
|---|---|---|
| **Licença** | Plano grátis do ElevenLabs e do Hume **não permite uso comercial**. O Kokoro é Apache-2.0 (ok). Modelos abertos melhores muitas vezes são não comerciais: "as melhores abertas não podem ser usadas comercialmente" (digitalapplied, 25/09/2026) | Só gerar episódio publicado em plano pago ou em motor com licença comercial clara. Guardar comprovante do plano no mês de cada vídeo |
| **Rotulagem: OpenAI** | A política exige **avisar o ouvinte** que a voz é IA | Se usar OpenAI, pôr "vozes geradas por IA" na bio e na legenda. Vale fazer isso em qualquer motor |
| **Rotulagem: YouTube** | Animação e conteúdo claramente irreal **não precisam** de aviso (blog do YouTube, 18/03/2024: https://blog.youtube/news-and-events/disclosing-ai-generated-content/). Mas desde **15/07/2025** a regra de "conteúdo inautêntico" desmonetiza canal produzido em massa, com narração sintética genérica e pouca mudança entre vídeos (https://support.google.com/youtube/answer/1311392) | Cada episódio precisa de roteiro e valor didático próprios, sem template com só a palavra trocada. Manter revisão humana registrada, por amostragem |
| **Rotulagem: TikTok** | A página oficial não abriu (redirecionamento sem conteúdo), então **não verificado na fonte**. Fontes secundárias dizem que o rótulo é obrigatório para conteúdo realista, que TTS genérico não exige, e que o TikTok detecta C2PA e marca d'água sozinho. O Gemini põe SynthID em todo áudio, o que pode gerar rótulo automático | Ligar o selo "conteúdo gerado por IA" do TikTok em todo post. Custa pouco e evita punição. Efeito no alcance: não verificado |
| **Voz parecida com pessoa real** | Vozes da biblioteca comunitária do ElevenLabs são enviadas por usuários e podem ser clones. Uma instrução do tipo "fale como [ator famoso]" gera imitação | Proibir no código as vozes da biblioteca comunitária: só vozes prontas do fornecedor ou criadas por Voice Design. Nenhum nome real nas instruções de estilo. Registrar o ID e a origem de cada voz em `vozes.yaml` |
| **Bloqueio de conta** | ElevenLabs bane por mau uso de clonagem. Google e Azure têm limite de taxa e modelos "preview" que somem (Gemini 2.5 preview). Conta nova no TikTok com postagem 100% automática pode cair em revisão | Dois motores configurados sempre (principal + plano B grátis), troca por configuração. Nunca depender de modelo "preview" sem substituto. Postagem com ritmo humano (lei da plataforma, fora do escopo de áudio) |
| **Preço sobe** | O Gemini 3.8 já dobra em 01/01/2027. O ElevenLabs mudou o modelo de excedente em 2026 | Orçar o áudio já a 2× o preço atual. Mesmo assim fica abaixo de US$50/mês |

---

## Referências de canais (o que dá para copiar no áudio)

- **Rachel's English:** câmera lenta na boca e comparação lado a lado entre "seu erro provável" e o som certo. O contraste é a lição. https://www.tubevocab.com/blog/en/rachels-english-review (26/09/2026). Para nós, vira a sequência Capy erra → Lazy devagar → Hank natural.
- **Speak English with Vanessa:** ouvir 3 vezes, primeiro lento e depois rápido, escrevendo o que ouviu. https://speakenglishwithvanessa.com/new-listening/. Base da Regra 1.
- **Pimsleur:** pausa para o aluno responder antes da resposta (antecipação) e retorno da palavra em intervalos crescentes (5 s, 25 s, 2 min). https://www.pimsleur.com/blog/why-graduated-interval-recall-is-the-key-to-mastering-a-new-language/. Para nós: repetir a palavra-alvo aos ~5 s, ~25 s e no fim do vídeo de 70 s.
- **Duolingo:** som de acerto curto e sempre igual virou marca e meme. Base da Regra 8.
- Canais brasileiros de inglês e canais de IA com personagem: não achei análise de áudio com fonte. **Não verificado.** Fica para o agente de formato.
