# CapyFala: didática visual e lúdica

Estudo de 27/09/2026. Foco: como a imagem e o movimento ensinam num vídeo vertical de 1080x1920, sem interação, para brasileiro adulto. Formatos e temas ficam com o outro estudo.
Cores citadas usam os tokens que já existem em `canal-idiomas/src/theme.ts` (amarelo `#FFCC00`, certo `#16C79A`, errado `#FF4D5E`, creme `#FFF4E0`, tinta `#1A0B45`). O exemplo do pedido (`#FFD23F`) foi trocado pelo amarelo que já está no código, para não criar duas cores de destaque.
Obs.: o CLAUDE.md do projeto chama a personagem de "Capi"; este texto segue o pedido e usa "Capy". Vale fechar a grafia antes do primeiro render.

---

## 1. Resumo

1. O que mais ensina em vídeo é juntar palavra e imagem no mesmo lugar e no mesmo instante: contiguidade espacial d = 1,10 e temporal d = 1,22 nos testes do Mayer.
2. Para quem aprende outra língua, legenda no idioma-alvo ajuda muito (g = 0,87 em vocabulário). Aqui a regra "não repita a fala na tela" não vale.
3. Destaque funciona se for pouco: uma palavra amarela por vez. Quem destaca tudo aprende menos.
4. Gesto que imita o significado ("drink" com a mão levando o copo à boca) faz a palavra durar mais na memória. A capivara precisa agir, só estar na tela não basta (efeito da imagem do instrutor: d = 0,20).
5. Humor ajuda quando a piada é a própria palavra. Enfeite engraçado que não tem a ver com a aula atrapalha (detalhes sedutores: g = −0,16).
6. A mesma metáfora visual volta em todo episódio (caixa para "in", alfinete para "at"). Assim o espectador reconhece o conceito em meio segundo e a série vira um vocabulário de imagens.

---

## 2. As 10 regras visuais do CapyFala

Formato de cada regra: o que fazer, a evidência e como fica no Remotion (30 fps).

### Regra 1. Uma palavra-alvo por vez, sempre amarela

**O quê.** A palavra que o vídeo ensina é a única coisa amarela na tela. Todo o resto do texto fica em creme ou branco.

**Evidência.**
- Sinalização (pistas que mostram o que importa): 24 de 28 testes a favor, d mediano = 0,41 (Mayer & Fiorella, *Cambridge Handbook of Multimedia Learning*, 2014, cap. 12). [PDF](https://edtechuvic.ca/wp-content/uploads/sites/11/2022/09/principles-for-reducing-extraneous-processing-in-multimedia-learning-coherence-signaling-redundancy-spatial-contiguity-and-temporal-contiguity-principles.pdf)
- Meta-análise de Schneider et al. (2018), 103 estudos e 12.201 pessoas: retenção g = 0,52, transferência g = 0,31. [Educational Research Review](https://www.sciencedirect.com/science/article/abs/pii/S1747938X17300581)
- O mesmo capítulo do Mayer registra que a sinalização funciona melhor quando é usada com parcimônia e para quem sabe pouco do assunto (nosso caso: A1).
- Fowler & Barker (1974): quanto mais texto marcado, pior o desempenho no teste. [ResearchGate](https://www.researchgate.net/publication/232539495_Effectiveness_of_highlighting_for_retention_of_text_material)

**No código.**
```tsx
// <Target word="drink" at={f}/>  — só pode existir 1 <Target> visível por frame
const s = spring({ frame: frame - at, fps, config: { damping: 12, stiffness: 180 } }); // 0 -> ~1.1 -> 1 em ~300 ms (9 frames)
style={{ color: C.amarelo, transform: `scale(${s})`, fontSize: 120, ...outline(10) }}
// duração mínima na tela: 75 frames (2,5 s). Guarda no render: se houver 2 <Target> no mesmo frame, falha.
```

### Regra 2. A palavra nasce colada no objeto, no mesmo frame da fala

**O quê.** Quando a Capy diz "cup", a palavra "cup" aparece a menos de um palmo do copo, no instante em que o áudio diz "cup". Nada de glossário no rodapé enquanto o objeto está lá em cima.

**Evidência.**
- Contiguidade espacial: 22 de 22 testes, d = 1,10. Contiguidade temporal: 9 de 9 testes, d = 1,22 (Mayer & Fiorella, 2014, mesmo PDF acima).
- A meta-meta-análise de Noetel et al. (2022), 29 revisões, 1.189 estudos e 78.177 participantes, põe contiguidade entre os maiores efeitos de todo o design multimídia. [Review of Educational Research](https://journals.sagepub.com/doi/abs/10.3102/00346543211052329) / [ERIC](https://eric.ed.gov/?id=EJ1338120)

**No código.**
- Gerar o TTS com marcação de tempo por palavra (as legendas karaokê já precisam disso) e usar esse tempo como `at` do `<Target>`. Tolerância: ±3 frames (100 ms).
- Âncora: `label.x/y = objeto.bbox` + deslocamento de no máximo 120 px. Uma linha fina (4 px, creme) liga palavra e objeto quando os dois não cabem colados.

### Regra 3. Legenda em inglês sempre ligada, karaokê, curta, com tempo de leitura

**O quê.** Toda fala em inglês aparece escrita em inglês, palavra acendendo junto com o áudio. A tradução em português aparece só para a frase-alvo, menor e embaixo.

**Evidência.**
- Na regra geral do Mayer, repetir a narração na tela atrapalha (16 de 16 testes, d = 0,86). Mas o próprio capítulo lista as exceções: texto curto, e aprendiz de segunda língua.
- Montero Perez et al. (2013), meta-análise: legenda no idioma-alvo dá efeito grande em vocabulário (g = 0,87, 10 estudos) e em compreensão oral. [ScienceDirect](https://www.sciencedirect.com/science/article/abs/pii/S0346251X13001012)
- Noetel et al. (2022): "legendar vídeo de segunda língua" está no topo da lista de efeitos.
- Wang & Pellicer-Sánchez (2022), 112 aprendizes com rastreamento ocular: legenda bilíngue ajudou a guardar o significado, mas foi pior que a legenda só em inglês para reconhecer a forma escrita. [Language Learning](https://onlinelibrary.wiley.com/doi/10.1111/lang.12495) Por isso o português entra só na frase-alvo, e não o vídeo todo.
- Frase longa repetida na tela prejudica aprendiz de segunda língua (Diao & Sweller, 2006, citado no cap. 12 do Mayer). Legenda curta, então.
- Tempo de leitura: Netflix usa no mínimo 5/6 s (833 ms) por legenda e no máximo 17 caracteres por segundo para adulto. [Netflix Partner Help](https://partnerhelp.netflixstudios.com/hc/en-us/articles/215758617-Timed-Text-Style-Guide-General-Requirements)

**No código.**
```ts
const holdFrames = (txt: string) => Math.max(25, Math.ceil((txt.length / 17) * 30)); // >= 833 ms e <= 17 cps
// Linha EN: Rubik 800, 64 px, creme; palavra falada no momento vira branco puro + sublinhado 6 px.
// Linha PT: 40 px, opacidade 0.7, entra 12 frames (400 ms) depois da EN. Só na frase-alvo.
// Máx 2 linhas EN, ~32 caracteres por linha. Tudo dentro de SAFE (y 200–1436).
```

### Regra 4. O personagem faz o gesto do significado

**O quê.** Verbo, preposição e adjetivo vêm com um gesto que imita o sentido. "Drink": copo à boca. "Big": braços abrindo. "In": Capy entra na caixa. O gesto começa junto com a palavra falada.

**Evidência.**
- Kelly, McDevitt & Esch (2009): adultos aprendendo verbos em japonês lembraram mais quando viram gestos que imitavam a ação; testes com 5 minutos, 2 dias e 1 semana. Só ver o gesto já ajudou. [ERIC](https://eric.ed.gov/?id=EJ826795)
- Macedonia et al. (2011): 33 adultos, 92 palavras; gestos icônicos melhoraram a retenção ao longo do tempo, gestos sem sentido não. [Human Brain Mapping](https://onlinelibrary.wiley.com/doi/abs/10.1002/hbm.21084)
- Davis (2018), meta-análise de agentes pedagógicos que gesticulam, 20 experimentos, N = 3.841: retenção g = 0,28, transferência g = 0,39. [Educational Research Review](https://www.sciencedirect.com/science/article/abs/pii/S1747938X18302343)
- Mayer (princípio da corporificação): agente com gesto, olhar e expressão rende mais, 11 de 11 testes, d = 0,36. Já a simples presença da imagem do apresentador dá d = 0,20, e metade dos testes foi nula ou negativa. [Cambridge, cap. 14](https://www.cambridge.org/core/books/abs/cambridge-handbook-of-multimedia-learning/principles-based-on-social-cues-in-multimedia-learning-personalization-voice-image-and-embodiment-principles/3841340D8AD820C26DBCD39AE664BCEC) Personagem parado não ensina nada.

**No código.**
- Biblioteca `chars/gestures.ts` com poses nomeadas (`drink`, `eat`, `big`, `small`, `in`, `on`, `at`, `can`, `have`...). Cada gesto dura de 18 a 30 frames, com `Easing.out(Easing.back(1.4))`.
- O gesto dispara no mesmo `at` da palavra-alvo. Guarda: palavra-alvo que é verbo ou preposição sem gesto associado gera aviso no render.

### Regra 5. Boca visível na palavra-alvo (pronúncia)

**O quê.** Quando a palavra-alvo é dita, zoom na boca da Capy (1,0 para 1,6 em 400 ms), com a forma da boca certa para cada som. Para sons que o brasileiro erra (th, -ed, h aspirado), a boca aparece em câmera lenta.

**Evidência.**
- Hazan et al. (2005): treino com áudio e imagem do rosto melhorou mais a percepção e a produção de consoantes do inglês (japoneses aprendendo /l/ e /r/) do que treino só com áudio. [Speech Communication](https://www.sciencedirect.com/science/article/abs/pii/S0167639305000701)
- Rachel's English monta a aula inteira em close da boca, em vários ângulos, com câmera lenta comparando o erro provável com o som certo. Canal com mais de 2 milhões de inscritos (número de fonte secundária, [tubevocab](https://www.tubevocab.com/blog/en/rachels-english-review); não verificado no YouTube).
- Duolingo desenhou mais de 20 formas de boca por personagem para sincronizar lábio e fala nas lições (fonte secundária, [dev.to](https://dev.to/uianimation/how-duolingo-uses-rive-for-their-character-animation-and-how-you-can-build-a-similar-rive-mascot-5d19); o post oficial é o [blog da Duolingo sobre visemas](https://blog-duolingo-com.translate.goog/world-character-visemes/?_x_tr_sl=en&_x_tr_tl=es&_x_tr_hl=es&_x_tr_pto=tc), número não conferido nele).

**No código.**
- Mapear fonema para visema a partir do TTS (ex.: 9 bocas básicas: repouso, A, E/I, O, U, M/B/P, F/V, TH, L). A tabela sai do alinhamento fonético do TTS.
- `<MouthZoom at={f}>`: `interpolate(frame, [at-6, at+6], [1, 1.6])`, segura por toda a palavra e volta em 9 frames.
- TH: língua visível entre os dentes, em amarelo claro por 1 frame de destaque. É a boca que o brasileiro nunca viu.

### Regra 6. Cena limpa: no máximo 3 coisas se mexendo

**O quê.** Fundo parado e dessaturado. No máximo três elementos em movimento ao mesmo tempo (ex.: personagem, palavra-alvo, legenda). Sem confete, sem emoji voando e sem música por cima da fala.

**Evidência.**
- Coerência: 23 de 23 testes, d = 0,86. Tirar ilustração que não ensina deu d = 0,83. No mesmo capítulo, música de fundo e efeitos sonoros pioraram a transferência (Mayer & Fiorella, 2014).
- Detalhes sedutores (coisa interessante mas fora do assunto): 50 estudos, 177 efeitos, g = −0,16. O dano vem pela carga cognitiva extra (Sundararajan & Adesope, 2020). [Educational Psychology Review](https://link.springer.com/article/10.1007/s10648-020-09522-4)

**No código.**
- Toda camada animada se registra com `useAnimatedLayer(id)`. Um teste de render percorre os frames e falha se houver mais de 3 camadas com posição, escala ou opacidade mudando no mesmo frame.
- Fundo: cor do quadro (`BG_BY_FORMAT`) com textura estática. Parallax só em transição de cena, nunca durante a palavra-alvo.
- Trilha: −24 LUFS sob voz; zero trilha nos 2,5 s da palavra-alvo.

### Regra 7. Uma ideia por vídeo, em blocos curtos

**O quê.** Um conceito por vídeo. Estrutura fixa em blocos de 3 a 6 s: gancho, conceito, 2 ou 3 exemplos, a volta da Bolinha. Cada bloco termina num corte seco.

**Evidência.**
- Segmentação: 10 de 10 testes, d = 0,79 (Mayer & Pilegard, 2014). [Cambridge, cap. 13](https://www.cambridge.org/core/books/abs/cambridge-handbook-of-multimedia-learning/principles-for-managing-essential-processing-in-multimedia-learning-segmenting-pretraining-and-modality-principles/DD24C2F48B9B1277CE59F78276110258) Meta-análise de Rey et al. (2019): 56 investigações e 88 comparações, efeito pequeno a médio, e vale também quando o sistema, e não o aluno, controla o ritmo (nosso caso). [Springer](https://link.springer.com/article/10.1007/s10648-018-9456-4)
- Efeito da informação transitória: animação e fala somem da tela, e trechos longos sobrecarregam a memória; trechos curtos resolvem (Leahy & Sweller, 2011). [Applied Cognitive Psychology](https://onlinelibrary.wiley.com/doi/abs/10.1002/acp.1787)
- Guo, Kim & Rubin (2014), 6,9 milhões de sessões no edX: o tempo mediano assistido nunca passa de 6 min, qualquer que seja a duração do vídeo, e vídeo mais curto prende mais. [PDF](https://www.cs.rochester.edu/hci/pubs/pdfs/edX-MOOC-video-production-and-engagement_LAS-2014.pdf)
- Nas Daily fez escola com "uma ideia, uma mensagem, um minuto" e cortes no ritmo da fala; mais de 60 milhões de seguidores somando as redes (fonte secundária, [Medium](https://medium.com/@rusydi.arsyraf/7-steps-to-go-viral-how-nas-daily-garnered-14-million-followers-and-counting-14b2bd66ca47), não verificado).

**No código.**
```ts
// episodes/*.json
{ "conceito": "in/on/at", "blocos": [
  { "tipo": "gancho",   "max_s": 3 },
  { "tipo": "conceito", "max_s": 6 },
  { "tipo": "exemplo",  "max_s": 5, "n": 3 },
  { "tipo": "bolinha",  "max_s": 4 } ] }
// Validador recusa episódio com 2 conceitos ou bloco acima do max_s.
```
Obs. sobre ritmo de fala: no Guo, professor que fala rápido prende mais, mas lá o público é nativo. Para A1, a fala-alvo vai devagar (é o papel do Lazy) e o resto do vídeo anda rápido.

### Regra 8. Uma metáfora fixa por conceito, que volta em toda a série

**O quê.** Cada conceito ganha um desenho que nunca muda (seção 3). Toda vez que "in" aparece, em qualquer episódio, a caixa aparece junto. A Bolinha devolve palavras antigas dias depois, sempre com o mesmo desenho da primeira vez.

**Evidência.**
- Codificação dupla (Paivio): palavra concreta ativa um código verbal e um de imagem, e os dois somam na hora de lembrar. [ScienceDirect Topics](https://www.sciencedirect.com/topics/neuroscience/dual-coding-theory)
- Preposições com desenho esquemático: Tyler, Mueller & Ho (2011) acharam ganho significativo em to/for/at (p < 0,0003), mas com só 14 alunos avançados e sem grupo de controle. [ResearchGate](https://www.researchgate.net/publication/286985008_Applying_Cognitive_Linguistics_to_Learning_the_Semantics_of_English_to_for_and_at_An_Experimental_Investigation) Um estudo iraniano com 60 alunos de nível pré-intermediário, com controle, também viu o grupo de esquemas de imagem superar o de repetição e drill. [academia.edu](https://www.academia.edu/65662156/Effect_of_Using_Image_Schemas_on_Learning_L2_Prepositions_and_Enhancing_Learner_Autonomy_A_Dynamic_System_Theory_and_Cognitive_Linguistics_Inspired_Approach) Um estudo com tutor por computador achou o ganho maior justamente em quem tinha nível mais baixo. [SSLA](https://www.cambridge.org/core/journals/studies-in-second-language-acquisition/article/abs/schematic-diagrams-in-second-language-learning-of-english-prepositions/3A9FAD7F733CED6C5C683082931DF243)
- Revisão espaçada: 317 experimentos, 839 medições; quanto mais longe o teste, maior deve ser o intervalo entre revisões (Cepeda et al., 2006). [Resumo](https://www.yorku.ca/ncepeda/publications/CPVWR2006.html) É o trabalho da Bolinha.

**No código.**
- Pasta `public/metaforas/` com um SVG por conceito e ID estável (`in.svg`, `on.svg`, `at.svg`, `third-s.svg`...). Proibido redesenhar: mudou o desenho, muda o ID e o velho vai para o arquivo.
- `calendario.json` ganha o campo `devolve: ["cup", "in"]`. A cena da Bolinha puxa o SVG e a palavra do episódio de origem, com D+2, D+7 e D+21 como intervalos iniciais (intervalos crescentes, a acertar com dado).

### Regra 9. O humor é a palavra, e a reação tem tempo

**O quê.** A piada nasce do erro de inglês ou do significado da palavra: Lazy termina "I walked" tão devagar que já virou passado; Hank se recusa a ser pintado na aula de cores. Depois da piada, uma pausa curta e a cara do personagem reagindo. Nenhuma piada fora do assunto.

**Evidência.**
- Schmidt (1994): frases engraçadas foram mais lembradas que as versões sem graça, em recordação livre e com pista, mas o efeito aparece quando o engraçado está misturado com o normal (em lista só de piadas ele some). [ResearchGate](https://www.researchgate.net/publication/15135502_Effects_of_Humor_on_Sentence_Memory) Tradução prática: um momento engraçado por vídeo, não trinta.
- Ziv (1988): dois experimentos (161 e 132 alunos), humor ligado à matéria deu nota maior na prova final; o ótimo ficou em 3 a 4 piadas por aula. [ERIC](https://eric.ed.gov/?id=EJ383255)
- O limite vem dos detalhes sedutores (g = −0,16, regra 6): piada solta, que não carrega a palavra, cobra atenção e não devolve nada.
- Duolingo no TikTok: o tom "passivo-agressivo" do mascote levou a conta de 50 mil a mais de 16 milhões de seguidores, quase sem mídia paga (fontes secundárias, [Sprout Social](https://sproutsocial.com/insights/duolingo-tiktok-success/), [Brand24](https://brand24.com/blog/duolingo-social-media-strategy/); número não verificado no perfil).

**No código.**
- `<Beat pause={15} react="hank_eyeroll" />`: 15 frames (500 ms) de silêncio antes da reação e reação segurada por 12 a 20 frames. Esses números são prática de animação, não saem de estudo: calibrar no teste A/B.
- Campo obrigatório no roteiro: `piada_ancora: "<palavra-alvo>"`. Se vier vazio, o validador recusa.

### Regra 10. Errado e certo lado a lado, o errado primeiro

**O quê.** Tela dividida na horizontal (em cima o erro, embaixo o certo). O erro que o brasileiro comete entra primeiro, leva um risco vermelho, e depois o certo aparece em turquesa. Só a diferença entre os dois fica em amarelo.

**Evidência.**
- Comparar casos: meta-análise de 57 experimentos e 336 testes mostrou que aprender comparando exemplos funciona melhor que ver um por vez (Alfieri, Nokes-Malach & Schunn, 2013). [PDF](https://www.lrdc.pitt.edu/schunn/papers/ContrastingCasesMeta-AlfieriEtAl2013.pdf) O tamanho de efeito exato não foi conferido no texto.
- Rachel's English faz exatamente isso com o som: o erro provável em câmera lenta ao lado do som certo (ver regra 5).
- O projeto já decidiu que certo = turquesa, nunca verde-limão (`theme.ts`, regra anti-Duolingo).

**No código.**
```tsx
<SplitCompare wrong="I have 30 years" right="I am 30 years old" diff={["have→am", "old"]} />
// t0: errado entra (y 300–800), 12 frames; t0+45: risco C.errado 8 px desenhado da esquerda p/ direita em 9 frames
// t0+60: certo entra (y 900–1400) com borda C.certo; só os trechos de `diff` em C.amarelo
// Hank balança a cabeça no errado; Capy acena no certo (regra 4).
```

---

## 3. Dicionário visual inicial (12 conceitos A1)

Regra da casa: a metáfora é a mesma em todo episódio. Coluna "quem" diz quem faz o quê. Cada linha vira um SVG em `public/metaforas/`.

| # | Conceito | Metáfora visual (fixa) | Quem faz o quê | Momento "aha" |
|---|---|---|---|---|
| 1 | **Cores** | A palavra da cor é a única exceção à regra do amarelo: "red" é escrito em vermelho, "blue" em azul. Objetos mergulham num balde e saem pintados. | **Duda** pinta tudo. **Hank** (preto e branco) recusa: "I'm black and white. It's a style." | Hank leva uma gota de pink e fica furioso. A palavra "pink" gruda nele. |
| 2 | **Números** | Quantidade visível antes do número: a Bolinha cospe as coisas da bochecha uma a uma, e o dígito nasce em cima de cada item. Números acima de 10 viram pilhas de 10. | **Bolinha** conta cuspindo sementes. **Capy** diz o número. | Em "thirteen" e "thirty", a Bolinha cospe 13 sementes num caso e 3 pilhas de 10 no outro. O som parecido ganha dois tamanhos bem diferentes. |
| 3 | **In / On / At** (lugar e tempo) | **In** = caixa (dentro do contorno). **On** = superfície (contato por cima). **At** = alfinete de mapa (um ponto). Para tempo: mês e ano são caixas grandes (in September), dia é um quadradinho do calendário onde se pisa (on Monday), hora é alfinete (at 3 pm). | **Capy** entra na caixa, sobe na caixa, espera no ponto de ônibus. **Lazy** fica "at the bus stop" para sempre. | O mesmo desenho encolhe de mês para dia e de dia para hora: caixa, depois quadrado, depois alfinete. As três preposições viram três tamanhos de lugar. |
| 4 | **Am / Is / Are** | Tomadas: "I" é um plugue que só encaixa em "am". He/she/it encaixa em "is". You/we/they, em "are". Encaixe certo acende a luz. | **Lazy** tenta enfiar "I" em "is" bem devagar e leva choque. **Capy** faz o encaixe certo. | A luz acende no encaixe certo e só nele. |
| 5 | **Can / Can't** | Interruptor: "can" = ligado, com brilho. "Can't" = desligado, com um cadeado. O verbo depois de can nunca muda (fica cinza, travado). | **Poppy** tenta manobra de skate: "I can!". **Lazy**: "I can't... yet". | O cadeado do "can't" abre quando aparece o "yet". |
| 6 | **Have / Has** | Posse = o objeto gruda na mão ou na bochecha. "Has" ganha o **rabinho S** da 3ª pessoa: um S amarelo com cauda que pula para o verbo quando entra he/she/it. | **Bolinha** guarda coisas na bochecha: "I have seeds". Quando falam dela: "She has seeds", e o rabinho S pula no verbo. | O rabinho S é o mesmo ícone do conceito 8. O espectador reconhece nos dois. |
| 7 | **There is / There are** | Holofote que varre o cenário e para no que existe. Um item = feixe fino ("there is"). Vários itens = feixe largo ("there are"). | **Dona Jaca**, em chamada de vídeo do Brasil, mostra a geladeira: "There is a jaca. There are... three jacas." | O feixe engorda quando a quantidade passa de um. |
| 8 | **Do / Does** | O **rabinho S** de novo: em "She plays", o S está no verbo. Na pergunta, o S salta de "plays" para "do", que vira "does", e "play" fica pelado. | **Hank** pergunta de mau humor: "Does she play?". **Duda** responde. | O S muda de lugar diante do olho. É a regra inteira sem nenhuma explicação falada. |
| 9 | **Passado -ed** | Linha do tempo horizontal fixa no rodapé da cena: esquerda = passado, centro = agora. O verbo desliza para a esquerda e leva um carimbo "-ed". A boca mostra os 3 sons do -ed (/t/, /d/, /ɪd/) em close (regra 5). | **Lazy** diz "I... walk..." tão devagar que a linha do tempo anda e, quando ele termina, já é "walked". | O tempo passa por causa da lentidão dele, e isso é o passado. |
| 10 | **Plural -s** | A palavra se clona: um "cat" vira três, e cai um S no fim de cada clone. Bochecha da Bolinha vazia = singular; cheia = plural. | **Bolinha** enche as bochechas: "one seed... two seeds!". | A bochecha incha junto com o S. |
| 11 | **Horas** | Relógio desenhado como pizza: "half past" = meia pizza comida; "quarter" = uma fatia de 1/4. Hora cheia leva o alfinete do "at" (conceito 3). | **Lazy**, sempre atrasado. **Hank** olhando o relógio: "It's half past five. You said five." | A pizza some fatia por fatia enquanto Lazy chega. |
| 12 | **Preços** | Etiqueta de preço que se parte em blocos coloridos: "$4.99" vira [four] [ninety-nine]. "How much" é uma balança; "cheap" e "expensive" pesam para lados opostos. | **Poppy** no caixa da loja nos EUA. **Dona Jaca** converte para reais e reclama: "Four ninety-nine? For a jaca?!" | A etiqueta se abre em dois pedaços, igual se fala. Chega de ler "quatro ponto noventa e nove". |

**Ícones recorrentes da série** (mesma forma em todo vídeo): caixa, superfície, alfinete, rabinho S, linha do tempo, holofote, cadeado. Com o tempo eles viram o "alfabeto visual" do CapyFala, e o espectador passa a ler a gramática pelo desenho.

---

## 4. O que NÃO fazer

| Não fazer | Por quê (evidência) | Regra no código |
|---|---|---|
| **Encher a tela** (emoji voando, confete, fundo animado, 5 personagens falando ao mesmo tempo) | Coerência d = 0,86 em 23 de 23 testes; detalhes sedutores g = −0,16 (Mayer & Fiorella 2014; Sundararajan & Adesope 2020) | Máx 3 camadas animadas por frame (regra 6) |
| **Destacar tudo** (cinco palavras amarelas, tudo em caixa alta com contorno) | Sinalização só funciona usada com parcimônia (Mayer, cap. 12); mais marcação, pior teste (Fowler & Barker 1974) | 1 `<Target>` por frame |
| **Legenda longa repetindo tudo em inglês e português ao mesmo tempo** | Repetição longa prejudica aprendiz de segunda língua (Diao & Sweller 2006, no cap. 12 do Mayer); legenda bilíngue perde para a inglesa na forma escrita (Wang & Pellicer-Sánchez 2022) | PT só na frase-alvo; EN com no máximo 2 linhas |
| **Texto que some rápido** | Informação transitória sobrecarrega a memória (Leahy & Sweller 2011); padrão Netflix: mínimo 833 ms, máximo 17 caracteres/s | `holdFrames()` e palavra-alvo com no mínimo 2,5 s |
| **Personagem enfeite** (Capy parada num canto enquanto o texto ensina) | Imagem do apresentador sozinha: d = 0,20, metade dos testes nula ou negativa; com gesto e expressão: d = 0,36 (Mayer, cap. 14) | Todo verbo e preposição com gesto (regra 4) |
| **Gesto aleatório** (pular e dançar em toda frase) | O ganho vem do gesto que imita o sentido; gesto sem sentido não ajudou (Macedonia 2011) | Gesto só da biblioteca, ligado à palavra |
| **Música por cima da fala** | Música de fundo e efeitos pioraram a transferência nos testes do Mayer (cap. 12) | Trilha a −24 LUFS e silêncio na palavra-alvo |
| **Cara de conteúdo infantil**: cantiga, voz aguda de desenho, paleta pastel de berçário, bichos "fofinhos" sem atitude, tema de escola primária | Risco de classificação "feito para crianças" (nota do CLAUDE.md do projeto) e perda do adulto. O personagem fofo em si não é o problema: Kurzgesagt tem mais de 25 milhões de inscritos com mitocôndria de carinha e tema adulto ([Wikipedia](https://en.wikipedia.org/wiki/Kurzgesagt), jun/2026), e rosto antropomórfico com cor agradável até aumenta retenção (d = 0,39; Brom, Stárková & D'Mello 2018, [ScienceDirect](https://www.sciencedirect.com/science/article/abs/pii/S1747938X18302148)) | Personagem fofo com **assunto de adulto**: aluguel, chefe, boleto, date, aeroporto, sarcasmo. Voz com ironia. Lilita One só em título curto; texto corrido em Rubik |
| **Voz robótica** | Voz humana vs. voz de máquina: d = 0,74 em 5 de 6 testes (Mayer, cap. 14). Esses testes usaram TTS antigo; a diferença para TTS neural moderno não foi verificada | Usar TTS neural com emoção; se o A/B de voz perder, gravar só a frase-alvo com voz humana |
| **Texto fora da zona segura** | Interface do TikTok cobre topo, rodapé (~484 px) e lado direito (~140 px) em 1080x1920 ([guia Cadenus](https://cadenus.io/resources/blog/tiktok-safe-zone/), fonte secundária) | Já existe `SAFE` no `theme.ts` (y 200–1436, x 60–940). Guarda falha se `<Target>` ou legenda sair dela |
| **Mnemônico por som ("keyword") sem imagem nem revisão** | Funciona muito na hora: 72% contra 46% (Atkinson & Raugh 1975, [ERIC](https://eric.ed.gov/?id=EJ113586)). Mas 2 dias depois quem usou o mnemônico esqueceu quase o dobro de quem decorou; a figura pronta e a revisão reduzem a perda (Wang & Thomas, [memory-key](https://www.memory-key.com/archive/research/Wang95)) | Todo mnemônico sonoro (ex.: "bread" parece "brede") vem com desenho próprio e entra na fila de devolução da Bolinha |

---

## 5. Três testes A/B visuais para os primeiros 30 dias

Regras comuns, definidas antes de rodar:
- Mesmo formato e dificuldade nos dois braços, publicação alternada no mesmo horário, **5 vídeos por braço**. Só entra na conta vídeo com ≥ 1.000 views em 72 h.
- A métrica é lida em 72 h no painel da plataforma (TikTok: tempo médio assistido e % que assistiu inteiro; YouTube Shorts: % visualizado e "viewed vs swiped away").
- **Empate** (diferença abaixo do corte): fica o braço mais barato de produzir. Ninguém muda o corte depois de ver o dado.
- Com 5 vídeos por braço o teste é grosseiro: pega diferença grande e deixa passar a pequena. É de propósito, porque o corte alto evita decidir no ruído.

| # | Pergunta | Braço A | Braço B | Métrica principal | Corte (definido antes) |
|---|---|---|---|---|---|
| 1 | **Legenda**: português ajuda ou só pesa? | Karaokê EN + PT **só na frase-alvo** (regra 3) | Karaokê EN + PT **em toda fala** | % médio assistido (72 h) | B só vence se tiver **≥ 10% relativo** a mais de % assistido **e** não perder em salvamentos por mil views. Senão fica A |
| 2 | **Limpeza**: cena enxuta retém mais que cena cheia? | ≤ 3 camadas animadas, fundo parado (regra 6) | Fundo animado + stickers + emojis reativos (estilo "TikTok cheio") | Retenção aos 3 s **e** % que assistiu inteiro | B só vence se ganhar **≥ 15% relativo nas duas** métricas. Ganhar só nos 3 s (gancho) e perder no inteiro conta como derrota: cena cheia que prende no começo e perde no fim não ensina |
| 3 | **Gesto + metáfora fixa** vale o custo de animação? | Capy faz o gesto e a metáfora do dicionário aparece (regras 4 e 8) | Mesma fala, palavra-alvo + ícone parado, sem gesto | **Salvamentos por mil views** (melhor proxy de "quero lembrar disso" sem interação). Secundária: comentários que usam a palavra-alvo corretamente, por mil views | A vence se tiver **≥ 20% relativo** a mais de salvamentos/mil. Se empatar, fica B só para conceitos abstratos que não têm gesto natural; verbos e preposições seguem com gesto por causa da evidência de laboratório |

Janela sugerida: dentro do calendário editorial já marcado (aprovação diária a partir de 12/10), testes 1 e 2 entre 12/10 e 25/10 e teste 3 entre 26/10 e 08/11, fugindo dos dias de eleição (04/10 e 25/10) que já estão bloqueados. Um teste por vez no mesmo quadro, para um não contaminar o outro.

---

## 6. Referências de mercado: o que cada uma faz na imagem que ensina

| Referência | Número | O que faz que ensina | Para o CapyFala |
|---|---|---|---|
| **Kurzgesagt** | mais de 25 mi inscritos (jun/2026, [Wikipedia](https://en.wikipedia.org/wiki/Kurzgesagt)); vídeo passa de 1.200 h de produção ([10 Studio](https://10.studio/the-incredible-amount-of-work-behind-kurzgesagts-beautiful-animated-videos/), secundária) | Flat design, uma metáfora visual por ideia, personagem fofo com assunto de adulto, e a narração dita o tempo da animação | Metáfora fixa (regra 8); fofo com tema adulto |
| **TED-Ed** | mais de 20 mi inscritos, 5 bi views ([Forbes, jun/2025](https://www.forbes.com/sites/eshachhabra/2025/06/30/how-ted-ed-became-a-global-learning-phenomenon/)) | Roteiro de educador e animador diferente a cada lição; a imagem traduz o conceito, não enfeita | Cada conceito ganha seu desenho próprio antes de animar |
| **Duolingo** | TikTok de 50 mil para mais de 16 mi seguidores ([Sprout Social](https://sproutsocial.com/insights/duolingo-tiktok-success/), secundária); mais de 20 bocas por personagem (secundária) | Personagem com personalidade forte e reação exagerada; boca sincronizada com a fala na lição | Reação com tempo (regra 9); visemas (regra 5); certo em turquesa para não parecer cópia |
| **English with Lucy** | ~13,7 a 14 mi inscritos ([vidIQ](https://vidiq.com/youtube-stats/channel/UCz4tgANd4yy8Oe0iXCdSWfA/) / [Social Blade](https://socialblade.com/youtube/handle/englishwithlucy), não conferido ao vivo) | Apresentadora em cena com cartões de texto limpos: palavra, pronúncia, exemplo | Cartão da palavra-alvo com o mínimo de elementos |
| **Rachel's English** | mais de 2 mi inscritos (secundária) | Close da boca em vários ângulos, câmera lenta e comparação erro × certo | Regras 5 e 10 |
| **Nas Daily** | mais de 60 mi seguidores somando as redes (secundária) | Um minuto, uma ideia; texto na tela que reforça em vez de repetir; corte no ritmo da voz | Regra 7; corte sincronizado ao TTS |
| **Khan Academy Kids** | não verificado | (só técnica) o personagem aponta e olha para o que importa, e o olhar funciona como sinalização | Capy olha para a palavra-alvo quando ela aparece (reforça as regras 1 e 4) |
| **Canais de mnemônico / criadores de TikTok de idioma com texto cinético** | não verificado: a busca não trouxe canal com número conferível | — | Levantar à mão na próxima pesquisa semanal do vidIQ |

---

## Fontes principais

- Mayer & Fiorella (2014), cap. 12, coerência, sinalização, redundância e contiguidade: [PDF](https://edtechuvic.ca/wp-content/uploads/sites/11/2022/09/principles-for-reducing-extraneous-processing-in-multimedia-learning-coherence-signaling-redundancy-spatial-contiguity-and-temporal-contiguity-principles.pdf)
- Mayer & Pilegard (2014), segmentação e modalidade (d = 0,76, 53 de 61 testes): [Cambridge](https://www.cambridge.org/core/books/abs/cambridge-handbook-of-multimedia-learning/principles-for-managing-essential-processing-in-multimedia-learning-segmenting-pretraining-and-modality-principles/DD24C2F48B9B1277CE59F78276110258)
- Mayer (2014), pistas sociais: personalização d = 0,79 (14 de 17), voz d = 0,74, imagem d = 0,20, corporificação d = 0,36: [Cambridge](https://www.cambridge.org/core/books/abs/cambridge-handbook-of-multimedia-learning/principles-based-on-social-cues-in-multimedia-learning-personalization-voice-image-and-embodiment-principles/3841340D8AD820C26DBCD39AE664BCEC)
- Noetel et al. (2022), meta-meta-análise: [SAGE](https://journals.sagepub.com/doi/abs/10.3102/00346543211052329)
- Schneider et al. (2018), sinalização: [ScienceDirect](https://www.sciencedirect.com/science/article/abs/pii/S1747938X17300581)
- Montero Perez et al. (2013), legenda em L2: [ScienceDirect](https://www.sciencedirect.com/science/article/abs/pii/S0346251X13001012)
- Wang & Pellicer-Sánchez (2022), legenda bilíngue: [Wiley](https://onlinelibrary.wiley.com/doi/10.1111/lang.12495)
- Kelly, McDevitt & Esch (2009), gesto: [ERIC](https://eric.ed.gov/?id=EJ826795) · Macedonia et al. (2011): [Wiley](https://onlinelibrary.wiley.com/doi/abs/10.1002/hbm.21084) · Davis (2018): [ScienceDirect](https://www.sciencedirect.com/science/article/abs/pii/S1747938X18302343)
- Höffler & Leutner (2007), animação vs. imagem parada: d = 0,37 no geral e 1,06 para conhecimento procedural-motor: [ScienceDirect](https://www.sciencedirect.com/science/article/abs/pii/S0959475207001077)
- Atkinson & Raugh (1975): [ERIC](https://eric.ed.gov/?id=EJ113586) · Wang & Thomas (1995): [memory-key](https://www.memory-key.com/archive/research/Wang95)
- Schmidt (1994), humor: [ResearchGate](https://www.researchgate.net/publication/15135502_Effects_of_Humor_on_Sentence_Memory) · Ziv (1988): [ERIC](https://eric.ed.gov/?id=EJ383255)
- Sundararajan & Adesope (2020), detalhes sedutores: [Springer](https://link.springer.com/article/10.1007/s10648-020-09522-4)
- Brom, Stárková & D'Mello (2018), design emocional: [ScienceDirect](https://www.sciencedirect.com/science/article/abs/pii/S1747938X18302148)
- Leahy & Sweller (2011), informação transitória: [Wiley](https://onlinelibrary.wiley.com/doi/abs/10.1002/acp.1787)
- Guo, Kim & Rubin (2014), engajamento em vídeo: [PDF](https://www.cs.rochester.edu/hci/pubs/pdfs/edX-MOOC-video-production-and-engagement_LAS-2014.pdf)
- Hazan et al. (2005), treino audiovisual de pronúncia: [ScienceDirect](https://www.sciencedirect.com/science/article/abs/pii/S0167639305000701)
- Alfieri et al. (2013), comparação de casos: [PDF](https://www.lrdc.pitt.edu/schunn/papers/ContrastingCasesMeta-AlfieriEtAl2013.pdf)
- Tyler, Mueller & Ho (2011), preposições: [ResearchGate](https://www.researchgate.net/publication/286985008_Applying_Cognitive_Linguistics_to_Learning_the_Semantics_of_English_to_for_and_at_An_Experimental_Investigation)
- Cepeda et al. (2006), revisão espaçada: [resumo](https://www.yorku.ca/ncepeda/publications/CPVWR2006.html)
- Netflix, padrão de legenda: [Partner Help](https://partnerhelp.netflixstudios.com/hc/en-us/articles/215758617-Timed-Text-Style-Guide-General-Requirements)

**Limites deste estudo.** Os tamanhos de efeito do Mayer vêm de laboratório, com estudante universitário e aula de ciência de alguns minutos. Nenhum estudo aqui mediu vídeo vertical de 30 a 60 s no TikTok. As regras são a melhor aposta com base em evidência, e os testes da seção 5 servem para confirmar ou derrubar cada uma no nosso público. Números de seguidores marcados como "secundária" não foram conferidos no perfil oficial.
