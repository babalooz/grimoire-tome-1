# Correções do mestre de inglês · 27/10/2026

**Aprovado pelo Felipe em 27/10/2026 (todas as recomendações do mestre)**

Este arquivo é a fonte para aplicar as correções nos roteiros dos assuntos 2, 3, 4 e 5. Cada correção diz o vídeo, a cena (ou o beat do JSON), o personagem e o texto exato. Aplicar literalmente; nada aqui pede interpretação. Onde diz "trocar", o texto antigo sai inteiro e entra o novo.

---

## 1. As 5 decisões (aprovadas)

1. **Basquete nos assuntos 3 e 4: mantém**, sem data de estreia. O hype passa a ser "noite de jogo de basquete americano (temporada regular)". "NBA" só na legenda do post, nunca na tela.
2. **Mike = figurante recorrente** dos V2 dos assuntos 3, 4 e 5 (urso, voz Orus, speaker `turista`). Não entra no elenco fixo.
3. **Dona Jaca no assunto 5: só no V1 e no V2.** Sai do V3 (cena 18b passa para o Lazy).
4. **Hank "do Brasil": aprovado**, com a fala de desmentido trocada para "Kidding.".
5. **Halloween/Saci guardado para outubro de 2027.** O V2 do assunto 5 passa a ser a reserva "o turista do mapa", com o Mike no lugar do turista. A camada de Thanksgiving (26/11/2026) entra só se o V2 for ao ar entre 23 e 26/11.

---

## 2. Assunto 2 · "Bye! See you!" (episódios em `canal-idiomas/episodes/`)

**Motivo:** o V2 do assunto 1 que foi ao ar é a versão do turista no café (`cafe-t1e01-hi-im-capy-v2.json`: o Rick entra, se apresenta, ganha café do Hank, e a Capy pensa "e como eu me despeço dele depois?"). O V2 do assunto 2 continuava outra história (saída do cinema, fila da estreia de 15/10). Agora ele continua o café: o Rick termina o café e vai embora, e dá tchau várias vezes (o "tchau que não acaba", hábito real de americano). A Poppy está no café gravando para a trend dela, o que mantém o gancho do comentário "what's your name?".

**Também corrigido:** nos 3 vídeos a Capy dizia a última frase-alvo, o que quebra a regra "a Capy nunca é a última". O conserto reaproveita falas já gravadas (mesmo speaker, mesmo texto, mesma emotion), sem voz nova.

### 2.1 `cafe-t1e02-bye-see-you-v2.json` (V2)

Campos de texto (sem voz):
```
"title": "T1 E02 · parte 2/3 · o tchau que não acaba ☕"
"hookTitle": "o gringo do café já vai embora"
```

Beat 1, trocar (VOZ NOVA, Poppy):
```
ANTES: { "speaker": "poppy", "lang": "pt", "emotion": "happy",
  "text": "Melhor noite do ano! E agora todo mundo vai embora..." }
DEPOIS: { "speaker": "poppy", "lang": "pt", "emotion": "happy",
  "text": "O gringo do café de graça já vai embora..." }
```

Depois do beat `{ "speaker": "capi", ... "alvo": true, "text": "Bye! See you!" }` que vem logo após a pausa "SUA VEZ: de novo, você é a Capy", inserir (reaproveita voz já gravada no mesmo arquivo):
```
{ "speaker": "turista", "lang": "en", "emotion": "neutral", "alvo": true, "text": "Bye! See you!" },
```

Beat da Poppy "Você se despediu de metade da fila!", trocar (VOZ NOVA, Poppy):
```
ANTES: { "speaker": "poppy", "lang": "pt", "emotion": "happy",
  "text": "Você se despediu de metade da fila!" }
DEPOIS: { "speaker": "poppy", "lang": "pt", "emotion": "happy",
  "text": "Gringo dá tchau mil vezes. E você respondeu todas!" }
```

Card da vitória, trocar só o `cardTexto` (a fala falada fica igual, sem voz nova):
```
ANTES: "cardTexto": "você se despediu de 3 gringos · CONSIGO ✓"
DEPOIS: "cardTexto": "você se despediu do Rick · CONSIGO ✓"
```

Gatilhos, trocar o 1º e o 5º itens:
```
"continua o V2 do assunto 1 que foi ao ar: o Rick, turista do café de graça, vai embora; hype anglófono = turista americano no café (atemporal)"
"o Hank não fala neste vídeo: quem conduz é a Poppy gravando a trend e o Rick dando tchau várias vezes (o 'tchau que não acaba')"
```

Cena para o render (descrição visual, sem voz): o vídeo abre no Bean There, o Rick terminando o café no balcão e a Poppy filmando com o celular. "Bye, guys!" é para o Hank e a Capy. Na 2ª rodada ("Bye!"), o Rick já está na porta e volta a cabeça para acenar de novo. No beat inserido, ele acena uma terceira vez, já do lado de fora, pelo vidro. Sem cinema, sem fila, sem fantasia, sem título de filme.

Todo o resto do V2 fica igual, palavra por palavra (Poppy "Hoje você vai se despedir de gringo de verdade. Tá gravando!", as falas do Rick, do Lazy e da Capy, "Olha! Um gringo perguntou seu nome!" e "Perguntar o nome... isso eu ainda não sei.").

Contagem nova da frase-alvo no V2: 6× (Rick, Lazy, Capy, Poppy, Capy, Rick). A última é do Rick. O aluno fala 2×.

### 2.2 `cafe-t1e02-bye-see-you.json` (V1): a Capy não pode ser a última

Depois do beat `{ "speaker": "capi", "lang": "en", "emotion": "happy", "alvo": true, "text": "Bye! See you!" }` que é o último antes de `{ "tipo": "pausa", "s": 0.6, "react": { "hank": "smile" } }`, inserir (reaproveita a voz do Lazy já gravada neste arquivo):
```
{ "speaker": "lazy", "lang": "en", "emotion": "smile", "alvo": true, "text": "Bye! See you!" },
```
Cena: o Lazy acena do sofá, devagar, enquanto a Capy está na porta. Depois vem o Hank, "See you, Capy.", como já estava.

### 2.3 `cafe-t1e02-bye-see-you-v3.json` (V3): falta a resposta da última SUA VEZ, e a Capy era a última

Depois do último beat `{ "tipo": "pausa", "s": 2.5, "text": "SUA VEZ: Bye! See you!" }` e antes do card "Dois assuntos. Uma conversa inteira: chegar e sair.", inserir (reaproveita a voz da Duda já gravada neste arquivo):
```
{ "speaker": "duda", "lang": "en", "emotion": "neutral", "alvo": true, "text": "Bye! See you!" },
```
Cena: a Duda, saindo pela porta dos fundos, responde para conferir. A última frase-alvo passa a ser da Duda.

### 2.4 Roteiro em papel (`roteiros-tema02.md`)

Na seção do V2: o título vira "o tchau que não acaba"; o hype de exemplo vira "turista americano no café (continua o V2 do assunto 1 que foi ao ar)"; e saem as menções a cinema, Street Fighter e fila. As cenas acompanham o JSON acima.

### 2.5 Voz nova exigida pelo assunto 2: **2 falas** (as duas da Poppy, em PT)

---

## 3. Assunto 3 · "What's your name?" (`roteiros-tema03.md`)

### V2 (bar do basquete)

Cabeçalho, trocar o parágrafo "Hype de exemplo" inteiro por:
```
Hype de exemplo: noite de jogo de basquete americano (temporada regular). Sem data de estreia. Na tela, "basquete americano"; "NBA" só na legenda do post.
```
Trocar também a linha "Continua o capítulo do assunto 2 (o vídeo da Poppy bombou e um gringo comentou)." por:
```
Continua o capítulo: a Poppy leva a Capy a um bar numa noite de basquete americano. O Mike lê o crachá CAPY que o Hank fez no assunto 1.
```

Cenas:
```
Cena 1 · texto na tela: "noite de basquete americano: bar cheio de gringo"
Cena 2 · Poppy PT: "Noite de basquete americano! O bar tá cheio de gringo!"
Cena 4 · Um urso grandão de camisa lisa lê o crachá da Capy (CAPY) e abre os braços | Mike EN: "Hi, Capy!"
Cena 5 · Capy (pensa) PT: "Ele leu meu crachá. Eu não sei o nome dele."
Cena 21 · Intervalo. O telão anuncia o desafio dos 10 arremessos; o bar começa a contar as cestas junto (só burburinho, sem número falado). A Capy trava | Capy (pensa) PT: "Eles vão contar. E eu não sei contar em inglês."
Cena 22 · texto na tela: "a Capy sabe contar até 10 em inglês? próximo assunto: os números de 1 a 10"
```

### V2 reserva ("a fila do ônibus de turismo")
```
Cena 18 · O Hank volta da cozinha. O Bob pergunta para ele também. O Hank bate no nome bordado no avental | Hank EN: "Hank. Right here."
```

### V3 ("pergunta ou resposta?")

Na lista de exercícios, a 2ª rodada de "Ouça e reconheça" passa a ser:
```
"pergunta ou resposta? agora rápido": a Poppy diz uma de duas frases em velocidade nativa, sem mostrar a boca; o aluno decide se é pergunta ou resposta.
```
Cenas:
```
Cena 9 · Rodada 2, rápido como na rua: a Poppy diz UMA de duas frases, sem mostrar a boca | Voz (Poppy) EN: ⭐ "What's your name?" (velocidade nativa)
Cena 10 · "pergunta ou resposta? agora rápido" + contador | ⏸ 3 s | trilha em zero
Cena 11 · Resposta: a Poppy aparece de caneta levantada | Poppy PT: "Pergunta! Rapidinho, mas é a mesma."
Cena 20 · card: trocar "próximo assunto: One, two, three!" por "próximo assunto: os números de 1 a 10"
```

---

## 4. Assunto 4 · números de 1 a 10 (`roteiros-tema04.md`)

### V2 ("o desafio dos 10 arremessos")

Cabeçalho, trocar o parágrafo "Hype de exemplo" (da abertura de 20/10 até "1ª semana da temporada") por:
```
Hype de exemplo: noite de jogo de basquete americano (temporada regular). Continua do intervalo anunciado no fim do V2 do assunto 3.
```
Manter o resto do cabeçalho ("O que aparece", "Sem", "NBA só na legenda do post").

Cenas:
```
Cena 14 · Poppy EN: "TEN!" · Hank EN: "Too soon."
Cena 17 · Mike EN: "Nice, Capy! Hands in!" · Mike EN: ⭐ "One, two, three!"
Cena 19 · O Mike grita algo no meio da barulheira; só aparece o balão dele, em texto: "where are you from?" | Poppy PT: "Ele quer saber de onde você é!"
```
(Na cena 19 sai o celular: o Mike está ao lado da Capy.)

---

## 5. Assunto 5 · "I'm from Brazil." (`roteiros-tema05.md`)

### V2: a reserva vira o V2 principal

- A seção "o Saci na festa de Halloween" sai do assunto 5 e fica guardada para outubro de 2027, sem produção.
- "V2 RESERVA ATEMPORAL · o turista do mapa" passa a ser o V2 do assunto 5, com o título "o gringo do bar voltou".
- Em todas as cenas do V2, o personagem "Turista" vira "Mike" (urso, voz Orus, speaker `turista`), e "a esposa do turista" vira "a amiga do Mike" (sem voz).

Cenas:
```
Cena 1 · Abre num chapéu de caubói entrando pela porta: é o Mike, o urso do bar, com um mapa de papel aberto. Texto: "o gringo do bar voltou. ele quer a resposta."
Cena 3 · O Mike pede o café apontando o cardápio e repara no mapa de adesivos da parede | Mike EN: "Where are you from?"
Cena 9 · O Mike abre um sorriso e cola o adesivo dele no Texas | Mike EN: "Cool! I'm from Texas."
Cena 11 · O Mike acena para a tela, encantado | Mike EN: "Hi, Mom!"
Cena 12 · 2ª rodada: a amiga do Mike (sem voz) entra; a pergunta dela vem só em texto: "where are you from?". Tela: "de novo: você é a Capy" | ⏸ 0,6 s
Cena 15 · O Mike vira para o Hank, por educação | Mike EN: "And you?"
Cena 17 · ⏸ 0,6 s. O Mike olha o panda de cima a baixo | Hank EN: "Kidding."
Cena 19 · A amiga do Mike aponta a Duda e mostra um balão só em texto: "and she?" | Dona Jaca PT: "E como fala de onde ELA é, filha?"
```
Na lista "Regras para os 3 vídeos" do topo, trocar `("It's a costume." / "No. Joke.")` por `("Kidding.")`.

Camada opcional de Thanksgiving, **só se o V2 for ao ar entre 23 e 26/11/2026** (Thanksgiving = quinta, 26/11/2026):
```
Cena 1 · texto na tela: "semana de Thanksgiving: gringo longe de casa"; torta de abóbora no balcão; #Thanksgiving só na legenda do post. Nenhuma fala muda.
```

### V3 (decisão 3: Dona Jaca sai do V3)
```
Cena 18b · Para conferir: o Lazy, de longe | Lazy EN: ⭐ "I'm from Brazil."
```
Atualizar a contagem do V3: "Frase-alvo: 5× no áudio (Lazy ×3, Capy, Bolinha), em 3 bocas; a última é do Bolinha." Tirar "Dona Jaca" da tabela de vozes do V3.

Contingência da cena 7 (conferir de ouvido no render):
```
Se o TTS disser "Brazil" certo onde deveria sair "I'm from Brasiu.", a rodada 2 vira "Canadá ou Brasil?": Voz (Lazy) EN: ⭐ "I'm from Brazil." · dois adesivos piscando (Canadá e Brasil) · resposta: o Brasil acende · Lazy PT: "Brasil. A língua encostou no fim." Sem forma errada.
```

---

## 6. Resumo para a rotina que aplica

| Assunto | Arquivo | Voz nova |
|---|---|---|
| 2 | `cafe-t1e02-bye-see-you-v2.json` (+ V1 e V3 com 1 beat reaproveitado cada) | **2** (Poppy PT ×2) |
| 3 | `roteiros-tema03.md` (ainda sem voz gravada) | tudo novo na produção normal |
| 4 | `roteiros-tema04.md` (ainda sem voz gravada) | tudo novo na produção normal |
| 5 | `roteiros-tema05.md` (ainda sem voz gravada) | tudo novo na produção normal |

Os assuntos 3, 4 e 5 continuam com as notas dadas em 27/10 e ficam aprovados depois de aplicadas estas correções. Os 3 vídeos do assunto 2 sobem para 8 ou mais em todos os critérios depois do item 2.
