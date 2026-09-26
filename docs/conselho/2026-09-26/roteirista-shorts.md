# Conselho 26/09/2026 — Roteirista de Shorts (Capi Lingo)

Alvo: `docs/plano-capi-lingo.md`, `canal-idiomas/episodes/001|002`, prompts de `canal-idiomas/scripts/roteirista.py`.
Base: `docs/pesquisas/2026-09-26-campeoes-shorts-quiz-idiomas.md` (citada como "Pesquisa"). Durações medidas por mim
rodando o Piper local nas falas (mesma fórmula do `Episode.tsx`: fala + timer + revelação + 0,4 s; bateu com o
`timings.json` real do 002: 48,3 s medido × 48,6 s renderizado) — **verificado**.

## 1. Diagnóstico (3 linhas)
1. O motor funciona, mas **a Capi não existe no roteiro**: as falas são de narrador neutro ("Nível um. Como se diz..."), zero piada, zero bordão, zero reação — é exatamente o "template genérico" que a política de inautêntico pega (Pesquisa, seção D).
2. Os dois episódios prontos **mentem número** ("90%", "3%") e **prometem o que o pipeline não entrega** ("parte 2 amanhã"); o 002 dura 48 s contra a meta de 30–40 s.
3. O `roteirista.py` tem boa estrutura (2 passadas, JSON schema), mas gera **sem nenhum exemplo** e sem regra de roteiro (gancho, escalada, piada, callback) — vai produzir 002 genéricos para sempre.

**Nota do estado atual (roteiro): 4/10.** Para 10: voz da Capi escrita em toda cena (1 piada + reação por vídeo), exemplos-modelo no prompt, portão de duração por código, memória de série (callback "resposta de ontem"), e 14 dias de retenção por quadro para calibrar.

---

## 2. Top 5 melhorias (ordem = impacto ÷ esforço)

### #1 — Colocar os 3 roteiros-modelo + regras de roteiro no prompt (impacto altíssimo, esforço 30 min)
Sem exemplo, o modelo copia o tom "professor de apostila". Com exemplo, copia ritmo, piada e tamanho de fala.
**Como fazer:**
- Salvar os 3 JSON da seção 7 em `canal-idiomas/episodes/modelos/` (fora do glob `episodes/*.json`, para não entrarem como "recentes" nem serem renderizados).
- No `main()`, carregar o modelo do mesmo quadro (ou os 3) e anexar ao `system` como `<exemplo>...</exemplo>` com a instrução "copie ritmo, tamanho de fala e tipo de piada; NUNCA copie as perguntas".
- Trocar `PERSONAGEM` e `REGRAS` pelos textos da seção 6 (prontos para colar).
- Custo extra: ~3–4 mil tokens de entrada por chamada ≈ US$0,02/chamada no Opus 5 (US$5/1M entrada) → ~US$1,2/mês (**estimativa**). Com cache de prompt cai mais.

### #2 — Portão de duração por código, não por pedido (impacto alto, esforço 1 h)
O prompt pede "30–45 s", mas o modelo não sabe quanto o Piper demora. Medido: 002 = **48,3 s**; um Nível 1→5 com 5 revelações faladas não fica abaixo de ~45 s.
**Como fazer:** depois da revisão, estimar a duração com as taxas medidas do Piper (PT ≈ 2,9 palavras/s, EN ≈ 3,5 palavras/s, +0,25 s por fala, +0,4 s por cena, + `timerSeconds`). Se passar do alvo do quadro, 3ª chamada curta: "corte X s; corte falas de transição, nunca a piada nem a explicação". Alvos por quadro (em vez de 30–45 fixo):

| Quadro | Alvo |
|---|---|
| capi-errou, pegadinha, mico | 22–35 s |
| nivel | 40–50 s (aceitar; 5 níveis com timer não cabem em 35 s) |
| qual-seu-nivel (TikTok/CRP) | 61–75 s (piso duro de 61 s — CRP exige ≥1 min, Pesquisa B3) |

```python
def estimate_seconds(ep):
    wps = {"pt": 2.9, "en": 3.5}
    def track(sp): return sum(len(s["text"].split()) / wps[s["lang"]] + 0.25 for s in sp or [])
    return sum(track(s["speech"]) + (s.get("timerSeconds") or 0) + track(s.get("revealSpeech")) + 0.4
               for s in ep["scenes"])
```

### #3 — Memória de série: cumprir o "amanhã" (impacto alto, esforço 1 h)
Ver seção 3 (erro oculto). **Como fazer:**
- Adicionar `answerTomorrow` (objeto opcional) ao schema do `capi-errou`; o script grava em `episodes/_pendente.json`.
- No dia seguinte, qualquer quadro recebe no prompt: "insira, ANTES do CTA, uma cena type=reveal de ≤4 s: 'Resposta de ontem: A. …'". Fica no fim de propósito: vira motivo para assistir até o final (retenção), e o CTA do capi-errou passa a dizer "resposta no fim do vídeo de amanhã".
- Remover a promessa "parte 2 amanhã" de qualquer quadro que não tenha continuação real.

### #4 — Grade e quadros: trocar os fracos pelos comprovados (impacto alto, esforço 20 min)
- **Bug:** `GRADE[6] = "nivel"` e `GRADE[0] = "nivel"` → domingo e segunda com o mesmo formato, violando a regra do próprio plano ("nunca o mesmo formato 2 dias seguidos") e o domingo é do vídeo longo.
- Faltam no `QUADROS` justamente os de maior evidência: **qual-seu-nivel** (Brian Wiles 7,3 mi, Lucy 6,1 mi, Carla 2,3 mi — Pesquisa B1, verificado) e **mico/pronúncia** (Elza 4,1 mi). Sobra o "Você sabia?", que é curiosidade sem aposta — e a Pesquisa mostra que vocabulário solto não viraliza (Geek Quiz, 1,8 mil).
- Proposta: `GRADE = {0:"nivel", 1:"capi-errou", 2:"qual-seu-nivel", 3:"pegadinha", 4:"hype", 5:"mico", 6:None}` (domingo = longo). "Você sabia?" e "BR vs Nativo" vão para o banco da regra de corte.
- Textos novos de `QUADROS` na seção 6.

### #5 — Deixar o roteiro controlar a Capi + blindar a 2ª passada (impacto médio-alto, esforço 1 h)
- Schema: adicionar `mood` por cena (`normal|happy|shock|sweat|smug`) — o `Mascot` já recebe `mood`, hoje derivado do tipo da cena. Com isso o roteirista escreve "suando no nível 5", "smug no capi-errou". Adicionar também `pinnedComment` (comentário fixado = isca de comentário grátis).
- Revisor ("professor nativo") hoje pode reescrever tudo e matar a piada. Trocar a instrução por: "corrija SÓ inglês, fatos, gabarito e ambiguidade; preserve piadas e falas em português palavra por palavra, a menos que estejam erradas". E dois checks que faltam: **(a)** a opção errada é um erro que brasileiro realmente comete? **(b)** as duas opções podem estar certas em algum registro (ex.: "If I was" é aceito no inglês informal)? Se sim, trocar.
- Filtrar o radar antes do LLM: hoje entram "tortura" e "vice-prefeito" nos trends e, nas dúvidas, "animais", "cores", "números", "roblox", "boa noite" (radar 26/09, verificado no `radar/2026-09-26.json`). Isso empurra o roteiro para vocabulário infantil → risco de "feito para crianças" e é o tipo de conteúdo que não viraliza. Lista de bloqueio simples (`crime|tortura|morte|eleição|prefeito|roblox|cores|animais|números`) antes de montar o prompt.

---

## 3. Erro oculto
**O pipeline promete continuação e não tem memória.** O 001 fecha com "Amanhã tem a parte dois. Segue pra não perder" — não existe parte 2. O quadro `capi-errou` manda dizer "resposta sai amanhã", mas: (1) o script só passa ao modelo os *nomes* dos episódios recentes, não a resposta pendente; (2) o dia seguinte (quinta) é "br-vs-nativo", que não tem onde encaixar a resposta. Resultado: toda quarta o canal quebra uma promessa em público. No formato de série, isso mata exatamente o que o quadro deveria gerar (comentário e retorno), e o comentário "cadê a resposta?" vira prova social negativa fixada no topo. Correção na melhoria #3.

---

## 4. Revisão dos episódios existentes

| Ep. | Problema | Correção |
|---|---|---|
| 001 | "90% dos brasileiros erram" — número inventado. Pesquisa B2: porcentagem só com dado real | "Quase todo brasileiro erra essa" ou desafio sem número |
| 001 | "Parte 2 amanhã" sem parte 2 | Tirar; CTA de placar ou pergunta |
| 001 | Exemplo com "watching the World Cup" em set/2026 — a Copa terminou em julho; soa velho | Hype atual do radar ou atemporal |
| 001 | "Tô ansioso pra" como tradução de *looking forward to* carrega ansiedade | "Tô contando os dias pra…" |
| 001 | Formato "1 pergunta" com a pergunta lida inteira (6,5 s de fala) antes do timer | Só a pergunta na tela; fala = reação da Capi |
| 002 | "Só 3%" inventado | "Nível 5 me fez suar" (gancho de personagem, sem dado falso) |
| 002 | 48 s (meta 30–40) | Ver melhoria #2; o modelo A abaixo fica em 50 s com 5 níveis e explicação — decidir: aceitar ~50 s ou cortar para 4 níveis |
| 002 | Escalada falsa: nível 2 (pretend) e nível 4 (actually) são o mesmo tipo de pergunta (falso cognato); o 4 é mais fácil que o 2 | Um tipo diferente por nível: vocabulário → falso cognato → preposição → phrasal verb → tempo verbal |
| 002 | Revelação sem "porquê" em 3 de 5 níveis (só repete a frase certa) | 1 linha de explicação = valor educacional (defesa contra "inautêntico") |
| 002 | Nenhuma fala tem voz da Capi; o CTA é genérico | Bordão 1× no CTA ("Capivara não julga. Capivara corrige.") e 1 piada no meio |
| 002 | Gancho falado de 3,9 s | Gancho ≤2,5 s falado (medido: "Nível um é fácil. O nível cinco me fez suar." = 3,1 s; "Meu inglês é perfeito. Confia." = 2,2 s) |

---

## 5. Revisão do plano (ótica de roteiro)
- **Fortes (priorizar):** Capi errou (personagem no quiz — SuPaBoo 42,9 mi, brecha 9), Nível 1→5 (MOOMOO 30 mi), Qual seu nível (formato de inglês mais viral da Pesquisa + funil), Mico de pronúncia (Elza 4,1 mi), Ao pé da letra (absurdo, reaproveita nos canais ES/EN). Todos com números **verificados** na Pesquisa.
- **Fracos para começar:** "Você sabia?" (sem aposta; risco de virar fato inventado — o próprio exemplo do plano sobre "OK" em 1839 é real, mas o gerador diário vai esgotar curiosidades verificáveis rápido), "Gíria da semana" (3 situações estoura o tempo), "Capi no mundo" (esquete exige animação que o rig ainda não tem), "Capi em 3 idiomas" (não há voz ES no `voices/`).
- **Bíblia da Capi:** "desmorona quando alguém erra" não funciona em quiz — o erro do espectador é invisível. O drama tem que vir do conteúdo: Capi **sua** a cada nível, fica **presunçosa** quando erra (capi-errou), **desmorona** na armadilha. Regra: 1 bordão por vídeo, no máximo (bordão repetido em toda cena cansa e soa template).
- **Falta no plano:** regra de gancho (≤2,5 s falado + texto na tela em ≤8 palavras), comentário fixado por vídeo, e a promessa de série com memória (melhoria #3).
- Handle no vídeo é `@capi.english` (`Episode.tsx`), marca é "Capi Lingo" — alinhar antes de criar as contas.

---

## 6. Textos prontos para o `roteirista.py`

**PERSONAGEM**
```
Capi é uma capivara brasileira, professora de inglês do canal Capi Lingo. TODAS as falas são da Capi, em primeira pessoa.
Zen por fora, dramática por dentro: fala pouco e calma, mas sua no nível difícil, fica presunçosa quando acha que acertou
e desmorona quando cai na armadilha. Humor adulto-leve de brasileiro (trabalho, segunda-feira, viagem, término, boleto,
memes) — nunca infantil, nunca palavrão, nunca política. Bordões (usar NO MÁXIMO 1 por vídeo, de preferência no CTA ou
na armadilha): "Calma... respira... ERROU." · "Capivara não julga. Capivara corrige."
Público: brasileiros adultos, 18–35, que "sabem um pouco" de inglês.
```

**REGRAS**
```
Estrutura obrigatória:
- Cena 1 type=hook: fala ≤ 9 palavras (≤ 2,5 s) + título ≤ 8 palavras. Gancho de desafio, identidade ou personagem sob pressão.
  PROIBIDO porcentagem, estatística ou "X% dos brasileiros" — não temos dado real.
- Perguntas: a opção errada é SEMPRE um erro que brasileiro realmente comete (tradução literal, falso cognato,
  preposição, tempo verbal). Nunca duas opções que possam estar certas em algum registro.
- Revelação: frase correta em inglês (lang=en, fala separada) + no máximo 1 linha em português com o PORQUÊ.
- Em cada vídeo: pelo menos 1 piada da Capi (reação, comparação com a vida adulta) e 1 momento de emoção (suor, choque).
- A fala da pergunta NÃO repete o que está escrito na tela: é reação/tensão ("Nível três. Começou o suor.").
- Última cena type=cta: pede placar ou escolha nos comentários (A/B/C, 0–5). Nunca prometa "parte 2" ou "amanhã"
  a não ser que o quadro diga para fazer isso.
- Falas ≤ 14 palavras. Inglês sempre em fala separada (lang=en). Números por extenso nas falas.
- Inglês 100% correto e natural (americano). Nada de fatos inventados. Marcas só quando o quadro pedir (mico).
- Preencha pinnedComment: uma pergunta que obrigue a responder (ex.: "Parei no ___. E você?").
Duração-alvo: {alvo do quadro}. A duração é conferida por código; cortes serão pedidos se passar.
```

**QUADROS (substituir/adicionar)**
```python
"nivel": "Nível 1→5: 5 questions (level 1..5, 2 opções, timer 2 s nos níveis 1–2 e 3 s nos 3–5). Cada nível testa um TIPO "
         "diferente, em escalada real: vocabulário → falso cognato → preposição → phrasal verb/expressão → tempo verbal. "
         "A Capi fica mais nervosa a cada nível (mood sweat a partir do 3). Gancho de personagem: 'nível 5 me fez suar'.",
"qual-seu-nivel": "Qual seu nível? A1→C2 (versão TikTok, 61–75 s): 6 questions (level 1..6, subtitle com o nível CEFR), "
                  "uma por nível, dificuldade coerente com o CEFR. Gancho: 'Em um minuto eu descubro teu nível'. CTA: "
                  "'parou em qual? comenta teu nível'.",
"capi-errou": "Capi errou, corrige aí: a Capi, presunçosa (mood smug), apresenta 3 frases numa situação adulta (aeroporto, "
              "trabalho, date). Exatamente 1 está errada (erro clássico de brasileiro) e 1 das certas PARECE errada "
              "(isca de debate). question SEM answer. Não revele. Preencha answerTomorrow {wrong, correction, why, trap}. "
              "CTA: 'comenta A, B ou C — resposta no fim do vídeo de amanhã'.",
"mico": "Para de pagar mico: 3 marcas/palavras em inglês que brasileiro pronuncia diferente. Para cada uma: a Capi fala "
        "confiante do jeito brasileiro (lang=pt, grafia aportuguesada), timer 2 s, e a pronúncia certa (lang=en). "
        "Só use pronúncias com fonte de dicionário (Cambridge/Merriam-Webster); na dúvida, troque a palavra.",
```

**Revisor (2ª passada)**
```
Você é professor(a) nativo(a) de inglês americano e editor(a) de Shorts. Corrija SOMENTE: inglês errado ou pouco natural,
gabarito ('answer') errado, fatos falsos, opções ambíguas (as duas aceitáveis em algum registro), erro "de brasileiro" que
não é comum de verdade, porcentagens/estatísticas (remova). Preserve piadas, bordões e falas em português palavra por
palavra, a menos que contenham erro. Não alongue falas.
```

---

## 7. Três roteiros-modelo (JSON no formato dos episódios)
Durações **medidas** com o Piper local. Os campos extras (`pinnedComment`, `answerTomorrow`) são ignorados pelo `make.sh`
(que só passa `scenes`) — renderizam hoje sem mudar código. Gramática conferida por mim; o revisor automático deve passar por cima igual.

### 7.1 Nível 1→5 — "Nível 5 me fez suar" (YouTube Shorts/Reels · 50,0 s medido)
Por que funciona: gancho de personagem sob pressão (fórmula 5 da Pesquisa) sem número falso; 5 tipos diferentes de erro em escalada; piada adulta no nível 4 ("ou você, depois do término"); bordão só no CTA. Se quiser ≤40 s, corte o nível 2.
```json
{
  "id": "modelo-nivel-1a5",
  "format": "nivel",
  "topic": "5 armadilhas clássicas de brasileiro, da mais fácil à mais cruel",
  "title": "Nível 1 é fácil. Nível 5 fez a Capi suar 😰",
  "hashtags": [
    "#inglês",
    "#quiz",
    "#capilingo",
    "#aprenderingles",
    "#desafio"
  ],
  "pinnedComment": "Placar da Capi: nível 5 eu errei na primeira vez. Qual foi o teu?",
  "scenes": [
    {
      "type": "hook",
      "title": "Nível 1 é fácil. Nível 5 me fez suar 😰",
      "speech": [
        {
          "lang": "pt",
          "text": "Nível um é fácil. O nível cinco me fez suar."
        }
      ]
    },
    {
      "type": "question",
      "level": 1,
      "title": "\"Estou com fome\"",
      "options": [
        "I have hunger",
        "I'm hungry"
      ],
      "answer": 1,
      "timerSeconds": 2,
      "speech": [
        {
          "lang": "pt",
          "text": "Nível um. Tô com fome."
        }
      ],
      "revealSpeech": [
        {
          "lang": "en",
          "text": "I'm hungry."
        },
        {
          "lang": "pt",
          "text": "Fome você não tem. Você está."
        }
      ]
    },
    {
      "type": "question",
      "level": 2,
      "title": "\"Library\" é...",
      "options": [
        "Livraria",
        "Biblioteca"
      ],
      "answer": 1,
      "timerSeconds": 2,
      "speech": [
        {
          "lang": "pt",
          "text": "Nível dois. Library é..."
        }
      ],
      "revealSpeech": [
        {
          "lang": "pt",
          "text": "Biblioteca. Livraria é"
        },
        {
          "lang": "en",
          "text": "bookstore."
        }
      ]
    },
    {
      "type": "question",
      "level": 3,
      "title": "I'm good ___ English.",
      "options": [
        "in",
        "at"
      ],
      "answer": 1,
      "timerSeconds": 3,
      "speech": [
        {
          "lang": "pt",
          "text": "Nível três. Começou o suor."
        }
      ],
      "revealSpeech": [
        {
          "lang": "en",
          "text": "I'm good at English."
        }
      ],
      "subtitle": "bom EM = good AT"
    },
    {
      "type": "question",
      "level": 4,
      "title": "\"A gente terminou\" 💔",
      "options": [
        "We broke down",
        "We broke up"
      ],
      "answer": 1,
      "timerSeconds": 3,
      "speech": [
        {
          "lang": "pt",
          "text": "Nível quatro. A gente terminou."
        }
      ],
      "revealSpeech": [
        {
          "lang": "en",
          "text": "We broke up."
        },
        {
          "lang": "pt",
          "text": "Broke down é o carro quebrando. Ou você, depois."
        }
      ]
    },
    {
      "type": "question",
      "level": 5,
      "title": "\"Moro aqui há dois anos\"",
      "options": [
        "I live here for two years",
        "I've lived here for two years"
      ],
      "answer": 1,
      "timerSeconds": 3,
      "speech": [
        {
          "lang": "pt",
          "text": "Nível cinco. Calma... respira..."
        }
      ],
      "revealSpeech": [
        {
          "lang": "en",
          "text": "I've lived here for two years."
        },
        {
          "lang": "pt",
          "text": "Começou e continua? Present perfect."
        }
      ]
    },
    {
      "type": "cta",
      "title": "Teu placar: _/5 👇",
      "speech": [
        {
          "lang": "pt",
          "text": "Comenta teu placar. Errou o um? Capivara não julga. Capivara corrige."
        }
      ]
    }
  ]
}
```

### 7.2 Capi errou, corrige aí — "Meu inglês é perfeito. Confia." (Shorts/Reels/TikTok curto · 25,9 s medido)
Por que funciona: personagem fazendo o quiz e errando (SuPaBoo 42,9 mi, brecha 9); a opção C (*married to*) parece errada para brasileiro (que diria *married with*) → briga nos comentários; gancho falado de 2,2 s; `answerTomorrow` alimenta a memória de série (melhoria #3). Resposta: A está errada (*I've been here since Monday*).
```json
{
  "id": "modelo-capi-errou",
  "format": "capi-errou",
  "topic": "since × for no present perfect (com isca: married to)",
  "title": "A Capi disse 3 frases. UMA tá errada 🤨",
  "hashtags": ["#inglês", "#capilingo", "#achaoerro", "#aprenderingles", "#quiz"],
  "pinnedComment": "Resposta amanhã no começo do próximo vídeo. Até lá: A, B ou C?",
  "answerTomorrow": {
    "wrong": 0,
    "correction": "I've been here since Monday.",
    "why": "Começou no passado e continua até agora: present perfect. 'I'm here since' é tradução direta do português.",
    "trap": "C está CERTA: em inglês é 'married to', não 'married with'."
  },
  "scenes": [
    {
      "type": "hook",
      "title": "Meu inglês é perfeito. Confia 😌",
      "speech": [{ "lang": "pt", "text": "Meu inglês é perfeito. Confia." }]
    },
    {
      "type": "question",
      "title": "Uma dessas tá ERRADA. Qual?",
      "subtitle": "Capi no aeroporto de Miami ✈️",
      "options": ["I'm here since Monday.", "I'm looking forward to seeing you.", "She's married to a Canadian."],
      "timerSeconds": 3,
      "speech": [
        { "lang": "pt", "text": "Cheguei em Miami e mandei essas três. A:" },
        { "lang": "en", "text": "I'm here since Monday." },
        { "lang": "pt", "text": "B:" },
        { "lang": "en", "text": "I'm looking forward to seeing you." },
        { "lang": "pt", "text": "C:" },
        { "lang": "en", "text": "She's married to a Canadian." }
      ]
    },
    {
      "type": "example",
      "title": "O gringo me olhou assim 😐",
      "example": "Uma está errada.",
      "translation": "E não, eu não vou contar qual.",
      "speech": [{ "lang": "pt", "text": "O gringo me olhou estranho. Uma tá errada. E eu não vou contar qual." }]
    },
    {
      "type": "cta",
      "title": "A, B ou C? Resposta amanhã 👇",
      "speech": [{ "lang": "pt", "text": "Comenta A, B ou C. Amanhã eu conto. Quem acertar ganha meu respeito. Só isso mesmo." }]
    }
  ]
}

```

### 7.3 Qual seu nível? A1→C2 — "Teu nível em 1 minuto" (TikTok ≥61 s para o CRP · 70,6 s medido)
Por que funciona: formato de inglês mais viral da Pesquisa (Brian Wiles 7,3 mi, Lucy 6,1 mi — verificado) virado em série diária; cada erro "para" o espectador num nível → comentário de identidade ("parei no B1"); 70,6 s dá folga sobre o piso de 61 s do CRP. Quando o teste completo existir, o CTA vira o funil de WhatsApp.
```json
{
  "id": "modelo-qual-seu-nivel",
  "format": "qual-seu-nivel",
  "topic": "teste A1→C2 em 1 minuto (versão TikTok ≥61 s)",
  "title": "Descubra teu nível de inglês em 1 minuto 🎯",
  "hashtags": [
    "#inglês",
    "#testedeingles",
    "#qualseunivel",
    "#capilingo",
    "#aprenderingles"
  ],
  "pinnedComment": "Parei no ___. Comenta o teu (sem mentir, a Capi tá vendo 👀)",
  "scenes": [
    {
      "type": "hook",
      "title": "Teu nível de inglês em 1 minuto 🎯",
      "subtitle": "Onde você parar de acertar = teu nível",
      "speech": [
        {
          "lang": "pt",
          "text": "Em um minuto eu descubro teu nível de inglês."
        }
      ]
    },
    {
      "type": "question",
      "level": 1,
      "title": "My sister ___ 30 years old.",
      "subtitle": "A1",
      "options": [
        "has",
        "is"
      ],
      "answer": 1,
      "timerSeconds": 3,
      "speech": [
        {
          "lang": "pt",
          "text": "A um. Minha irmã tem trinta anos."
        }
      ],
      "revealSpeech": [
        {
          "lang": "en",
          "text": "My sister is thirty years old."
        },
        {
          "lang": "pt",
          "text": "Idade em inglês é com is."
        }
      ]
    },
    {
      "type": "question",
      "level": 2,
      "title": "\"Ontem eu fui ao shopping\"",
      "subtitle": "A2",
      "options": [
        "Yesterday I went to the mall",
        "Yesterday I go to the mall"
      ],
      "answer": 0,
      "timerSeconds": 3,
      "speech": [
        {
          "lang": "pt",
          "text": "A dois. Ontem eu fui ao shopping."
        }
      ],
      "revealSpeech": [
        {
          "lang": "en",
          "text": "Yesterday I went to the mall."
        },
        {
          "lang": "pt",
          "text": "Shopping, em inglês, é mall."
        }
      ]
    },
    {
      "type": "question",
      "level": 3,
      "title": "\"Moro aqui há três anos\"",
      "subtitle": "B1",
      "options": [
        "I'm living here for three years",
        "I've been living here for three years"
      ],
      "answer": 1,
      "timerSeconds": 3,
      "speech": [
        {
          "lang": "pt",
          "text": "B um. Aqui muita gente cai."
        }
      ],
      "revealSpeech": [
        {
          "lang": "en",
          "text": "I've been living here for three years."
        },
        {
          "lang": "pt",
          "text": "Começou lá atrás e continua. Present perfect."
        }
      ]
    },
    {
      "type": "question",
      "level": 4,
      "title": "\"Se eu tivesse estudado, teria passado\"",
      "subtitle": "B2",
      "options": [
        "If I studied, I would pass",
        "If I had studied, I would have passed"
      ],
      "answer": 1,
      "timerSeconds": 3,
      "speech": [
        {
          "lang": "pt",
          "text": "B dois. Se eu tivesse estudado, teria passado."
        }
      ],
      "revealSpeech": [
        {
          "lang": "en",
          "text": "If I had studied, I would have passed."
        },
        {
          "lang": "pt",
          "text": "Arrependimento do passado: had mais would have."
        }
      ]
    },
    {
      "type": "question",
      "level": 5,
      "title": "\"Tô por um fio\"",
      "subtitle": "C1",
      "options": [
        "I'm hanging by a thread",
        "I'm hanging on a wire"
      ],
      "answer": 0,
      "timerSeconds": 3,
      "speech": [
        {
          "lang": "pt",
          "text": "C um. Segunda, oito da manhã."
        }
      ],
      "revealSpeech": [
        {
          "lang": "en",
          "text": "I'm hanging by a thread."
        },
        {
          "lang": "pt",
          "text": "Igualzinho ao português."
        }
      ]
    },
    {
      "type": "question",
      "level": 6,
      "title": "Hardly ___ arrived when it started to rain.",
      "subtitle": "C2",
      "options": [
        "I had",
        "had I"
      ],
      "answer": 1,
      "timerSeconds": 3,
      "speech": [
        {
          "lang": "pt",
          "text": "C dois. Calma... respira... Complete a frase."
        }
      ],
      "revealSpeech": [
        {
          "lang": "en",
          "text": "Hardly had I arrived when it started to rain."
        },
        {
          "lang": "pt",
          "text": "Começou com hardly? Inverte."
        }
      ]
    },
    {
      "type": "cta",
      "title": "Parou em qual? Comenta 👇",
      "speech": [
        {
          "lang": "pt",
          "text": "Parou em qual nível? Comenta aí. Acertou o C dois? Então me ensina, porque eu suei."
        }
      ]
    }
  ]
}
```

---

## 8. Custo
Roteirista no `claude-opus-5` (US$5 entrada / US$25 saída por 1M tokens — tabela da skill claude-api, 06/2026): 2–3 chamadas/dia,
~8 mil tokens de entrada e ~10 mil de saída (com raciocínio) → **~US$0,30/dia ≈ US$9/mês** (**estimativa**; o próprio script
imprime `tokens:` por chamada — conferir na 1ª semana). Cabe no orçamento de US$10–40/mês do plano. Se passar, baixar `effort` da
2ª passada para `low` antes de trocar de modelo.

## 9. Oportunidade despercebida
O `capi-errou` + `answerTomorrow` cria um **gancho de retenção diário de graça**: a cena "Resposta de ontem" no fim de qualquer
vídeo do dia seguinte dá motivo para assistir até o fim — e os comentários de ontem ("eu disse A!") viram prova social. Nenhum
concorrente da Pesquisa faz callback entre Shorts.

**Próximo passo:** colar os textos da seção 6 no `roteirista.py`, salvar os 3 modelos em `episodes/modelos/` e renderizar o 7.2 (capi-errou) como primeiro teste.
