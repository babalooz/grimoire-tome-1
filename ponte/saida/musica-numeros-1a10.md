# CapyFala · Música do assunto 4 · "One to Ten" (papel, 11/10/2026)

Letra 100% autoral (melodia nenhuma de terceiros; quem compõe a melodia é o gerador, a partir de estilo genérico, sem
citar artista nem música). Nada foi gerado, cantado, sintetizado ou publicado. É o **V4 · A MÚSICA DO ASSUNTO** do
assunto 4 (`roteiros-tema04.md` v2) e o material do **teste de 3 estilos** que o Felipe escolhe de ouvido.

Ferramenta, preço e conta: `estudo-musica-autoral.md` §7 (Lyria 3.5, US$ 0,08 por música; teste dos 3 estilos de US$ 0,48 a US$ 0,72).

---

## 1. Decisões de desenho (por que a letra é assim)

| Decisão | Por quê |
|---|---|
| **Só números + 1 frase-alvo.** Nada de verso narrativo | 1 coisa só por vídeo (regra do Felipe, 27/09). Cada palavra cantada é palavra ensinada |
| **Chamada e eco:** a voz canta um bloco e o compasso seguinte fica **sem voz** (só baixo e bateria) para quem assiste repetir | É o "repita comigo" do V1 virado música. Estudo de canto com adultos usou ouvir e repetir (Ludke, Ferreira e Overy 2014; ver estudo §4) |
| **Mesmos blocos da aula:** 1-3, 4-6, 7-10 | A música revisa exatamente o que o V1 ensinou, na mesma ordem (o aluno reconhece) |
| **Refrão = a contagem inteira + a frase-alvo ⭐ "One, two, three!"** | O refrão é o que gruda; tem que ser o conteúdo, não enfeite |
| **Português só falado, por cima, na voz da Capy (Gemini, já aprovada)**, nunca cantado pelo gerador | O canto em português não está confirmado na API do gerador recomendado (estudo §2); a voz da Capy mantém a marca; o PT fica curto e só de apoio |
| **Cada número numa nota longa o bastante para a consoante final** (five, eight, ten) | A armadilha do brasileiro está no fim da palavra (vogal de apoio "faivi", "eiti"); cantar corrido engole o fim. Na letra cantada, 3/4 dos erros de quem ouve estão nas consoantes (Collister e Huron 2008; estudo §4) |
| **Melodia de poucas notas, repetida, em região média (nada de agudo)** | Melodia simples e repetida é condição para o canto ajudar a lembrar (Wallace 1994); vogal cantada em nota aguda perde inteligibilidade (estudo §4) |
| **Sem rima infantil, sem "vamos aprender", sem palmas de berçário, sem voz fina** | Selo "feito para crianças" (estudo §6) |
| **Duração 24–34 s conforme o estilo; núcleo de 12 compassos** | Cabe nos 20–40 s pedidos. O gerador recomendado (Lyria 3.5) controla a duração pelo prompt; a versão de 12 compassos também cabe nos 30 s fixos do Lyria 3 Clip, a reserva mais barata (estudo §7) |

---

## 2. A letra (núcleo de 12 compassos de 4 tempos)

Legenda: **MAIÚSCULA** = sílaba tônica · `( eco )` = compasso sem voz, para quem assiste repetir · ⭐ = frase-alvo ·
🗣 PT = fala da Capy por cima (TTS Gemini, voz Sulafat), mixada no pós, não é do gerador.

| Compasso | Parte | Voz cantada (inglês) | Na tela (legenda) | 🗣 PT por cima |
|---|---|---|---|---|
| 1 | Intro | — (só o instrumental entra; 1 batida de colher na xícara) | "canta junto · você repete" | Capy: "Do one ao ten. Você repete." |
| 2 | Bloco 1 · chamada | **ONE**, **TWO**, **THREE** | ONE · TWO · THREE (1 · 2 · 3) | — |
| 3 | Bloco 1 · eco | `( eco )` | 🎤 SUA VEZ | — |
| 4 | Bloco 2 · chamada | **FOUR**, **FIVE**, **SIX** | FOUR · FIVE · SIX (4 · 5 · 6) | — |
| 5 | Bloco 2 · eco | `( eco )` | 🎤 SUA VEZ | — |
| 6 | Bloco 3 · chamada | **SEV**-en, **EIGHT**, **NINE**, **TEN** | SEVEN · EIGHT · NINE · TEN (7 · 8 · 9 · 10) | — |
| 7 | Bloco 3 · eco | `( eco )` | 🎤 SUA VEZ | — |
| 8 | Refrão | **ONE**, **TWO**, **THREE**, **FOUR**, **FIVE** | 1 2 3 4 5 acendendo | — |
| 9 | Refrão | **SIX**, **SEV**-en, **EIGHT**, **NINE**, **TEN** | 6 7 8 9 10 acendendo | — |
| 10 | Refrão · grito | ⭐ **ONE**, **TWO**, **THREE**! | ⭐ ONE, TWO, THREE! | — |
| 11 | Refrão · eco | `( eco )` | 🎤 SUA VEZ ⭐ | — |
| 12 | Fim | **ONE** to **TEN**! (última nota longa no "ten", corte seco) | "one to ten ✓" | Capy (depois do corte): "Dez números. Na cabeça." |

**Contagem:** cada número é cantado **2×** (bloco + refrão) e falado pelo espectador **2×** (eco do bloco + eco do refrão
para one-three; one-ten no refrão inteiro se ele cantar junto). ⭐ "One, two, three!" cantada **2×** (compassos 2 e 10)
+ 2 ecos.

**Versão longa (só no estilo A, se o gerador permitir > 30 s):** repete os compassos 8–11 uma vez antes do 12
(16 compassos). Mais 1 passada do refrão é o que mais gruda; nos outros estilos ficaria acima de 40 s.

### 2.1 A letra como texto puro (o que vai no campo de letra do gerador)

```
[Intro]
(instrumental, one bar)

[Verse - call and echo]
One, two, three
(instrumental, one bar, no vocals)
Four, five, six
(instrumental, one bar, no vocals)
Seven, eight, nine, ten
(instrumental, one bar, no vocals)

[Chorus]
One, two, three, four, five
Six, seven, eight, nine, ten
One, two, three!
(instrumental, one bar, no vocals)

[Outro]
One to ten!
```

---

## 3. Armadilhas de pronúncia (o que a voz tem que cantar certo e o vídeo mostra)

| Número | Som-alvo (IPA, inglês americano) | O que o brasileiro costuma fazer | Instrução para a voz cantada | O que aparece no vídeo |
|---|---|---|---|---|
| one | /wʌn/ | "uâni" com vogal no fim; ou "on" | curto, sem vogal depois do n | — |
| two | /tuː/ | "tu" curto | "u" comprido | — |
| **three** | /θriː/ | "tri" ou "fri"; "i" curto | ponta da língua entre os dentes no começo; **"ee" longo** (nota longa) | close da língua no "th" + **bocejo comprido do Lazy** (som /iː/ do assunto 2, já ensinado) |
| four | /fɔːr/ | "fór" com r carioca ou r batido | r final dobrado para trás (americano), sem vogal depois | — |
| **five** | /faɪv/ | "**faivi**" (vogal de apoio no fim) | **v final vibrando, sem "i"**; a nota termina no v | lábio de baixo encostando nos dentes de cima, ícone de vibração |
| six | /sɪks/ | "síkis" ou "seis" | "ks" seco no fim | — |
| **seven** | /ˈSEV.ən/ | tônica no fim ("se-VÉN") ou "sevem" | tônica no **SEV**; fim com n, boca aberta, não "em" | sílaba **SEV** maior na legenda |
| **eight** | /eɪt/ | "**eiti**" ou "ait" | ditongo "ei" + t curto e solto, **sem "i" depois** | dedo cortando o ar no t |
| nine | /naɪn/ | "naini" | n final, sem vogal | — |
| ten | /tɛn/ | "tchen" ou "tem" (nasal de "tem") | t limpo, "é" aberto, fecha no n com a língua | — |

As 4 marcadas (three, five, seven, eight) são as do pedido e as de maior risco. A regra da casa continua: **sotaque não
é erro; o objetivo é ser entendido.** O vídeo mostra o som certo; ninguém é corrigido em vermelho (E01–E10 sem risco).

**Checagem de ouvido antes de aceitar uma geração (vale para os 3 estilos):**
1. Dá para escrever os 10 números ouvindo só o áudio, sem a tela? (se não, descarta);
2. "five" e "eight" terminam sem vogal de apoio;
3. "seven" com tônica no começo;
4. os compassos de eco estão **sem voz nenhuma** (nem coro, nem "ad-lib");
5. nenhuma letra inventada a mais (gerador às vezes improvisa "yeah", "come on": aceitar só no estilo C, e só no fim).

---

## 4. Os 3 estilos (mesma letra, mesma estrutura)

Os 3 são de adulto e bem diferentes entre si: um é de dançar, um é de cafeteria, um é de ginásio. Nenhum cita artista,
banda, música ou gênero com nome de pessoa.

### Estilo A · "pop chiclete brasileiro" (dançante, refrão de grudar)

**Para quê:** o mais "grudento" dos três; testa se o gancho pop segura o feed.
**Andamento:** 118 BPM, 4/4 → 12 compassos = **24,4 s**; versão longa (16 compassos) = **32,5 s**.
**Voz:** feminina adulta, meio-soprano, timbre limpo e confiante, dicção nítida, sem voz infantil, sem vibrato exagerado.
**Instrumentos:** baixo de sintetizador encorpado, bumbo reto suave, estalo de dedos no 2 e no 4, guitarra funkeada abafada,
sintetizador brilhante só no refrão. Nos compassos de eco: **só baixo e bumbo**.

Texto para colar no campo de estilo/prompt do gerador:
```
Adult Brazilian-influenced dance-pop, 118 BPM, 4/4, catchy and confident, polished modern production.
Lead vocal: adult female mezzo-soprano, clear and confident, very crisp English diction, every word intelligible,
final consonants clearly pronounced (five, eight, ten), no vibrato, not childlike, not cute.
Instruments: warm synth bass, soft four-on-the-floor kick, finger snaps on 2 and 4, muted funky electric guitar,
bright synth lead only in the chorus. Echo bars: vocals completely silent, only bass and kick keep the groove.
Melody: very simple, few notes, repeated, mid vocal range only (no high notes).
Structure: 1-bar intro, call-and-echo verse (sing one bar, leave the next bar instrumental), chorus, short outro ending
on a sustained "ten" with a hard stop. No children's choir, no nursery-rhyme melody, no clapping game feel,
no extra lyrics or ad-libs.
```

### Estilo B · "bossa lo-fi de cafeteria" (calmo, a cara do Bean There)

**Para quê:** combina com o café e com a trilha que o canal já tem (`music.py`, lo-fi de café, 96 BPM); testa se o
"calmo e bonito" retém mais adulto que o dançante.
**Andamento:** 96 BPM, 4/4 com balanço de bossa → 12 compassos = **30,0 s**.
**Voz:** feminina adulta, contralto quente, perto do microfone, quase falada mas afinada, articulação muito clara.
**Instrumentos:** violão de nylon com batida de bossa, piano elétrico suave, contrabaixo acústico, bateria de vassourinha,
chiado leve de vinil. Nos compassos de eco: violão e contrabaixo, sem voz.

```
Lo-fi bossa café song, 96 BPM, 4/4 with a gentle bossa groove, warm, relaxed, adult, intimate coffee-shop mood.
Lead vocal: adult female contralto, warm, close-mic, almost spoken but in tune, extremely clear English
articulation, every number intelligible, long "ee" in "three", crisp "v" at the end of "five", no breathy mumbling,
not childlike.
Instruments: nylon-string guitar with bossa rhythm, soft electric piano, upright acoustic bass, brushed drums,
light vinyl crackle. Echo bars: vocals completely silent, guitar and bass only.
Melody: very simple, few notes, repeated, mid vocal range only (no high notes).
Structure: 1-bar intro, call-and-echo verse (sing one bar, leave the next bar instrumental), chorus, short outro
ending on a soft sustained "ten". No children's choir, no nursery-rhyme melody, no extra lyrics or ad-libs.
```

### Estilo C · "torcida de ginásio" (chant de arena, chamada e resposta) — o 3º, defendido com dado

**Por que este (o dado):**
- Nos radares diários de 01 a 11/10 (`canal-idiomas/radar/2026-10-*.json`), dos 100 itens de hype seguro, **28 são
  esporte**, a 2ª maior categoria. As duas maiores somadas de música (59 itens) são faixas de terceiros: dão gosto, não
  dão formato (não podemos usar a música nem imitar artista).
- O único hype do mundo que fala inglês que se repete no radar semanal W42 é a **NBA** (4 de 7 dias; temporada abre
  em **20/10/2026**, fonte no `semana-2026-W42.md`), e o V2 do assunto 4 se passa justamente no bar do basquete. Contagem
  é nativa de esporte: "three, two, one" do relógio, "one, two, three" da roda do time.
- Chamada e resposta é a forma natural do grito de torcida: o eco do espectador vira o "responde a arquibancada", sem
  precisar explicar. A pesquisa de formato já apontava o refrão como grito de torcida (`formato-ensino-video.md`, F5).
- É o estilo mais longe de "música de criança": percussão pesada, voz grave, cara de ginásio.

**Andamento:** 100 BPM, 4/4 → 12 compassos = **28,8 s**.
**Voz:** líder masculina adulta, grave, falado-cantado com energia (tipo locutor de ginásio), e no refrão um **coro
adulto misto** gritando junto. Nos compassos de eco: **só bumbo e pisada**, nada de voz.
**Instrumentos:** pisada-pisada-palma de arena (stomp-stomp-clap), caixa de fanfarra, surdo grave, metais curtos e graves
(stabs), apito no último compasso.

```
Stadium arena chant, 100 BPM, 4/4, stomp-stomp-clap groove, sports-arena energy, adult and powerful.
Lead vocal: adult male, low and punchy, half-sung half-shouted like an arena hype man, perfectly clear English
diction, every number intelligible. Chorus: adult mixed crowd shouting in unison.
Instruments: stomps and claps, marching snare drumline, deep floor toms, short low brass stabs, one referee
whistle on the final bar. Echo bars: no vocals at all, only stomps and kick drum, leaving space for the
audience to shout back.
Melody: very simple, few notes, repeated, mid-low vocal range only.
Structure: 1-bar intro, call-and-echo verse (shout one bar, next bar instrumental), chorus shouted by the crowd,
outro ending on a huge "ten!" with a hard stop. No children's choir, no nursery-rhyme melody, no extra lyrics.
```

### Resumo do teste

| | A · pop chiclete BR | B · bossa lo-fi de café | C · torcida de ginásio |
|---|---|---|---|
| BPM | 118 | 96 | 100 |
| Duração (12 compassos) | 24,4 s (longa 32,5 s) | 30,0 s | 28,8 s |
| Voz | mulher, meio-soprano, limpa | mulher, contralto, perto do microfone | homem grave + coro adulto |
| Eco | baixo + bumbo | violão + contrabaixo | pisada + bumbo |
| Risco de soar infantil | médio (pop alegre) → mitigado pela voz adulta e pelo baixo pesado | baixo | muito baixo |
| Liga com o assunto | refrão de grudar | cara do café Bean There | V2 no bar do basquete (NBA 20/10) |

**Como o Felipe escolhe (igual ao teste cego de voz):** 3 arquivos sem nome de estilo (X, Y, Z), ordem embaralhada,
gabarito guardado à parte. Ele ouve no celular, com o som do próprio celular, e responde 2 coisas: (1) qual ficou na
cabeça 10 minutos depois; (2) qual ele postaria no canal dele. Para cada estilo, gerar **2 tentativas** e mandar a melhor
pela checagem de ouvido do §3 (custo das 6 gerações no estudo §7).

---

## 5. Roteiro de imagem do V4 (vídeo da música)

**Cenário:** o café Bean There, de manhã, ainda fechado. A música toca na **vitrola/caixa de som do café** ("Rádio Bean
There"): por isso a voz cantada não é a da Capy, e ninguém estranha. O elenco "dubla" só com a boca nos refrões; quem
canta é o rádio.

**Regra visual:** cada número aparece **colado no objeto** (adesivo de preço do café, com o dígito e a palavra), e a
**quantidade fica visível antes** do número (o objeto aparece, depois o adesivo cola). 1 elemento amarelo por quadro: o
número que está sendo cantado. Fundo parado e dessaturado; no máximo 3 coisas mexendo ao mesmo tempo.

**Zona segura (1080 × 1920, a mesma do motor, `src/theme.ts` SAFE):** todo texto e todo adesivo dentro de **x 60–920,
y 260–1436**. Nada importante embaixo de y 1436 (legenda e nome da conta do TikTok) nem à direita de x 920 entre y 900 e
1700 (coluna de botões). O selo "T1 E04 · a música" fica no topo da zona segura.

| Compasso | Tempo (B, 96 BPM) | O que aparece | Número colado em | Quem faz o quê |
|---|---|---|---|---|
| 1 · intro | 0,0–2,5 s | O Hank liga o rádio do café. Texto: **"canta junto · você repete"** | — | Hank bate a colher na xícara no tempo 1; Capy (PT por cima): "Do one ao ten. Você repete." |
| 2 · one, two, three | 2,5–5,0 s | Balcão: **1 xícara**, **2 croissants**, **3 sementes** (o Bolinha cospe, como no V1) | xícara (1), prato (2), sementes (3) | o adesivo cola no tempo exato de cada número |
| 3 · eco | 5,0–7,5 s | Mesma imagem, os 3 adesivos piscam em sequência, sem voz. **🎤 SUA VEZ** + barra de tempo | — | a Capy aponta para a câmera |
| 4 · four, five, six | 7,5–10,0 s | **4 cubos de açúcar** caindo no café; **5 dedos** (high five da Duda); **6 muffins** na forma | açucareiro (4), mão (5), forma (6) | a Duda faz o "high five" no "five" (o v final vira a vibração da mão) |
| 5 · eco | 10,0–12,5 s | Os 3 adesivos piscam. **🎤 SUA VEZ** | — | a Duda aponta para a câmera |
| 6 · seven, eight, nine, ten | 12,5–15,0 s | **7 copos** empilhados; **8 cookies** no pote; **9 canudos** no copo; **10 dedos** (o Hank levanta as duas patas, com a cara de sempre) | copos (7), pote (8), copo de canudos (9), patas do Hank (10) | o Lazy chega atrasado e cola o 7 devagar: a sílaba **SEV** aparece maior |
| 7 · eco | 15,0–17,5 s | Os 4 adesivos piscam. **🎤 SUA VEZ** | — | o Hank, de patas levantadas, espera, sério |
| 8–9 · refrão (1 a 10) | 17,5–22,5 s | Câmera passa pelo balcão da esquerda para a direita; os 10 objetos acendem um por um, em amarelo, no tempo | todos | elenco no fundo, mexendo a cabeça no ritmo (adulto, nada de dancinha coreografada) |
| 10 · ⭐ one, two, three! | 22,5–25,0 s | Capy e Hank seguram a **caixa de grãos** do V1 e levantam no "three" | caixa | **a caixa sobe no three** (é a piada do V1; o aluno reconhece) |
| 11 · eco ⭐ | 25,0–27,5 s | Caixa de novo no chão. **🎤 SUA VEZ** "One, two, three!" | — | os dois esperam o espectador contar |
| 12 · one to ten! | 27,5–30,0 s | A caixa sobe sozinha no "ten" (o espectador contou). Card: **"one to ten ✓ · T1 E04"** | — | Capy (PT, depois do corte seco): "Dez números. Na cabeça." |

**Fim do vídeo (depois da música, ≤ 2 s, só texto):** "aula completa no perfil · T1 E04" (verdadeiro: V1, V2 e V3
publicados antes, na grade). Sem pedido de "segue" no meio da música.

**Legenda de tela:** número em dígito grande + palavra embaixo (ONE / 1); no eco, só o dígito (o espectador tem que lembrar
a palavra: recuperação ativa). PT nenhum na tela, além do "você repete" do início.

**Título e legenda do post (regra anti-infantil):** sem "música", "infantil", "criança", "aprender a contar". Exemplos
(gatilhos verdadeiros):
- "os números de 1 a 10 que você vai cantar no banho · T1 E04"
- "conta comigo até ten" é **proibido** (lembra o nome do app concorrente; ver CLAUDE.md).

**Som original:** o arquivo vai como som do próprio vídeo, com o nome **"One to Ten · CapyFala"**. No TikTok o som vira
"som original" da conta e outros podem usar (é alcance de graça). Regras e riscos: estudo §5.
