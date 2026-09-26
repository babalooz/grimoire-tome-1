# Conselho 26/09/2026 — Retenção e psicologia do engajamento

Alvo: `docs/plano-capi-lingo.md`, 12 quadros, `canal-idiomas/episodes/001` e `002`, `canal-idiomas/src/Episode.tsx`.
Método: li plano, pesquisas, roteirista, TTS e template; medi a linha do tempo real dos 2 episódios (timings.json) e renderizei o frame 0 do ep. 002.

## 1. Diagnóstico (3 linhas)
1. O quadro certo (Nível 1→5) está embalado errado: o frame 0 sai **sem título e com a Capi de olhos fechados**, a 1ª pergunta só aparece em **4,4 s** e o vídeo dura **48,6 s** (o plano pede 30–40 s).
2. Não há som além da voz: o timer de 3 s é **silêncio**, o acerto não tem "ding" e o erro não tem reação. É aí que a curva vai cair, 5 vezes por vídeo.
3. Os ganchos usam **números inventados** ("90% erram", "Só 3% chegam"). Isso quebra a regra ética, contradiz o próprio `roteirista.py` e vira arma em comentário ("fonte?").

## 2. Linha do tempo real medida (ep. 002, verificado via `public/audio/.../timings.json`)

| Trecho | Tempo | Problema de retenção |
|---|---|---|
| Hook | 0,0–4,4 s | 4 s de fala antes de qualquer pergunta. Frame 0 vazio (título entra com `spring` a partir de escala 0). Legenda de 3 linhas dentro da zona coberta pela UI |
| Nível 1 | 4,4–12,4 s | 3 s de timer mudo. Pergunta fácil demais para 8 s |
| Níveis 2–5 | 12,4–43,9 s | Mesmo ritmo 5× (fala → 3 s mudo → revela). Sem escalada audiovisual além da barra. Sem placar |
| CTA | 43,9–48,6 s | 4,7 s de tela parada pedindo comentário. É o pico clássico de saída e ainda come a taxa de "assistido até o fim" |

Ep. 001: 26,5 s. Hook 3,8 s, CTA "Segue pra parte 2 amanhã" promete uma parte 2 que **não existe** (loop aberto falso gera desconfiança; se virar hábito, o público aprende que a promessa não vale).

Frame 0 renderizado (ep. 002): 60% superior da tela roxo vazio, Capi piscando (`frame % 90 < 4` é verdadeiro no frame 0), legenda em y≈1450–1650 px. Na zona segura do TikTok (130 px no topo, **484 px embaixo**, 140 px à direita, terceiros: [Cadenus](https://cadenus.io/resources/blog/tiktok-safe-zone/), [Kreatli](https://kreatli.com/guides/tiktok-safe-zone)) a legenda fica **inteira sob a descrição do post**, e o `@capi.english` (bottom 90) some.

---

## 3. MANUAL DE RETENÇÃO — regras segundo a segundo (valem para os 12 quadros)

### 3.1 Princípios (por que funciona, com fonte)
- **Lacuna de curiosidade**: a curiosidade surge quando a pessoa percebe que falta um pedaço *pequeno* de informação; ela cai se a pessoa souber pouco demais ou demais. ([Loewenstein 1994, Psychological Bulletin 116:75–98](https://www.researchgate.net/publication/232440476_The_Psychology_of_Curiosity_A_Review_and_Reinterpretation), verificado). Consequência: pergunta **com 2 opções visíveis** > pergunta aberta. Mostrar a pergunta antes de explicar.
- **Efeito pré-teste**: tentar responder, mesmo errando, melhora o aprendizado posterior em relação a só estudar ([Richland, Kornell & Kao 2009](https://pubmed.ncbi.nlm.nih.gov/19751074/), verificado). Consequência: **pergunta primeiro, explicação depois**, em todo quadro. Isso também é "valor educacional", a defesa contra a política de conteúdo inautêntico.
- **Hipercorreção**: erro cometido com alta confiança é corrigido *melhor* depois do feedback, porque a surpresa prende a atenção ([Butterfield & Metcalfe 2001](https://www.researchgate.net/publication/11641193_Errors_Committed_with_High_Confidence_Are_Hypercorrected); [Metcalfe et al., PMC4036076](https://pmc.ncbi.nlm.nih.gov/articles/PMC4036076), verificado). Consequência: escolher itens em que o brasileiro **tem certeza e erra** (pretend, actually, "I have 20 years"). Isso sustenta os quadros Pegadinha, Capi errou e Ao pé da letra.
- **Métrica-alvo**: Shorts mostra "Visualizado vs. deslizado" na aba Conteúdo → Shorts do Studio ([YouTube Help 12942217](https://support.google.com/youtube/answer/12942217?hl=en-GB&co=YOUTUBE._YTVideoType%3Dshorts), verificado). Benchmarks de terceiros: <30% de deslizados = forte, >50% = fraco ([ReelRise](https://reelrise.app/guide/viewed-vs-swiped-away-the-only-youtube-shorts-metric-that-matters/), [vidIQ](https://vidiq.com/blog/post/youtube-shorts-algorithm/), estimativa/terceiros). TikTok Studio mostra tempo médio, "assistiu ao vídeo completo" e curva por vídeo (autodeclarado pela plataforma nas páginas de ajuda).

### 3.2 Regras por segundo (versão curta 25–35 s)

| Janela | Regra | Implementação |
|---|---|---|
| **Frame 0** | A tela já está **completa**: pergunta/tese legível, Capi de olhos abertos com expressão forte, nada entrando do zero. O frame 0 é a "capa" no feed e o que o polegar julga | `Pop` com `from` 0,85 e opacidade 1 na 1ª cena; piscar nunca nos 30 primeiros frames |
| **0–1,5 s** | Gancho falado **≤ 8 palavras**, texto na tela **≤ 6 palavras**, as duas coisas ao mesmo tempo. Fórmulas: nível ("Nível 1 é fácil. Nível 5…"), identidade ("Brasileiro sempre erra essa"), proibição ("Para de falar 'I have 20 years'"), personagem sob pressão ("A Capi aposta que você erra a 5") | Validador no roteirista (3.4) |
| **≤ 2,0 s** | **A 1ª pergunta já está na tela** (pré-teste). Nunca apresentar o canal, a Capi ou "hoje vamos ver" | Hook + Q1 fundidos na mesma cena, ou hook ≤ 1,5 s |
| **A cada 2–3 s** | Uma **mudança perceptível** (interrupção de padrão): opção entrando, zoom, troca de expressão, SFX, cor. Nenhum trecho > 3 s com imagem e som parados | Checagem automática: nenhuma cena > 3 s sem evento visual |
| **Timer** | 3 s com **tique audível** e barra encolhendo. No último segundo o tique acelera e a Capi sua. Silêncio só funciona se for intencional e curto (≤ 0,5 s antes do "ding") | SFX `tick` a cada 1 s + barra, e o número muda de cor em 1 |
| **Revelação** | Em ≤ 0,2 s depois do timer: "ding" + verde + a Capi reage. A explicação cabe em **≤ 1,5 s / ≤ 10 palavras** | SFX `correct`/`wrong` + `mood` por resultado |
| **Recompensa** | Placar do espectador visível ("marca 1 ponto se acertou") e contador "X/5" que sobe sozinho. Dá progresso e completude e alimenta o comentário do final | Componente `Score` |
| **~40–50% do vídeo** | **Re-gancho** (2º loop aberto) antes da queda do meio: "Agora complica", "A 4 é a que a Capi errou na 1ª vez". Nada de número inventado | Campo `rehook` na cena do meio |
| **Última pergunta** | É a mais difícil e fica **visível desde o início** (teaser de 0,6 s no começo ou miniatura borrada no canto). Quem quer ver a 5 fica | Cena `teaser` ou `LevelBar` mostrando "5 = ???" |
| **Final (≤ 2 s)** | Um CTA de uma frase, **pergunta de resposta curta** ("Placar: comenta 3/5, 4/5…"). O vídeo **acaba antes de o CTA "respirar"**: corte seco para o frame que casa com o frame 0 (loop). Nada de "segue o canal" por 3 s | CTA ≤ 2 s, sem o respiro de 0,4 s |
| **Loop** | A última fala emenda com a primeira ("…e se você errou a um, volta que…" → corta para "Nível 1 é fácil"). Desde 31/03/2025 replay conta view no Shorts (já na pesquisa) | Última cena com o mesmo fundo e a mesma pose do frame 0 |

**Duração**: versão curta de 25–35 s (não 48 s). Versão TikTok de 61–75 s = mesmo roteiro **com mais níveis** (7–8), nunca com mais tempo morto.

### 3.3 Regras fixas de áudio, texto e tela
1. **Três camadas de áudio** sempre: voz, SFX (tique, pop, ding, buzz, whoosh na troca de cena) e trilha de fundo a −24 dB que **sobe um degrau a cada nível**. Tudo de biblioteca CC0 ou royalty-free (Pixabay, freesound CC0; confirmar a licença de cada arquivo). Custo US$0.
2. **Legenda em blocos de 2–4 palavras**, 1 linha, entre y=1000 e y=1400. Nunca a frase inteira em 3 linhas.
3. **Zona segura**: nada importante acima de y=130, abaixo de y=1436 ou à direita de x=940. O handle vai para o topo, dentro da zona.
4. **Pausa entre falas ≤ 0,12 s** (hoje 0,25 s) e **respiro entre cenas ≤ 0,15 s** (hoje 0,4 s). Somando a pausa entre falas, o respiro e o CTA longo, o ep. 002 gasta **~6–7 s de tempo morto** (estimativa minha pelos timings).
5. **Capi reage a tudo**: `mood` por evento (pergunta = desconfiada, timer = suando cada vez mais por nível, acerto = feliz, a 5ª = chocada). Personagem sob pressão é o gatilho que a pesquisa liga a SuPaBoo/Duolingo.
6. **Honestidade**: porcentagem só com dado real (votos do próprio quiz ou pesquisa citada). Na falta dele, usar formulação sem número: "quase ninguém acerta a 5", "a Capi errou essa", "brasileiro erra muito isso". Nada de "parte 2 amanhã" sem a parte 2 já roteirizada na fila.

### 3.4 Validador automático (entra no `roteirista.py` antes de salvar)
Rejeita e manda regerar se:
- hook > 8 palavras faladas ou > 6 palavras no título;
- a 1ª cena `question` começa depois de 2,0 s (estimativa: 2,6 palavras/s em PT);
- existe `\d+ ?%` em fala ou título sem `source` no JSON;
- o CTA tem > 12 palavras, ou o total estimado passa de 35 s na versão curta;
- aparece "parte 2"/"amanhã" sem `nextEpisodeId`.

### 3.5 Aplicação por quadro (0–2 s / re-gancho / fim)

| Quadro | 0–2 s (frame 0 já com isso) | Re-gancho no meio | Fim + loop |
|---|---|---|---|
| 1 Nível 1→5 | Barra com 5 níveis + Q1 na tela, "Nível 1 é fácil…" | Nível 3: "Agora complica" + trilha sobe | "Comenta teu placar: X/5" → corta para a barra vazia |
| 2 Qual seu nível A1→C2 | "Em que nível você trava?" + escada A1–C2 | B1: "Metade para aqui?" (só com dado) ou "Aqui a Capi começou a suar" | "Parou em qual? Teste completo no link" (≤ 2 s) |
| 3 Você sabia? | Pergunta antes do fato: "De onde veio o OK?" + 2 opções | Pista falsa desmentida ("não é o que você pensa…") | Pergunta final de 1 palavra para comentar |
| 4 Capi errou | Capi fala a frase errada **com confiança total** no frame 0 (hipercorreção) | "Tem MAIS um erro escondido" | "Achou os 2? Resposta no próximo" (+ `nextEpisodeId` real) |
| 5 Brasileiro vs Nativo | Split-screen já dividido, lado BR falando | 3ª situação = a mais constrangedora | "Qual você fala?" A ou B nos comentários |
| 6 Para de pagar mico | Logo/nome grande + "Você fala errado" + timer | Marca mais famosa por último | "Qual você errava?" |
| 7 Hype | Imagem desenhada do assunto + pergunta em inglês ligada a ele | Termo mais engraçado guardado para o meio | Pergunta de opinião sobre o hype (comentário fácil) |
| 8 Pegadinha | "Push NÃO é…" com as 2 opções no frame 0 | A 3ª palavra é a que "até professor erra" (só se for verdade) | Placar X/3 |
| 9 Gíria | Gíria grande + "Você sabe usar?" | Situação 3 = uso errado e engraçado | "Manda uma frase com ela" (comentário de produção, o mais valioso) |
| 10 Capi no mundo | Cena já no conflito (Capi travada no guichê) | Complicação no meio (o atendente responde rápido) | Cliffhanger ou pergunta "o que ela devia dizer?" |
| 11 Ao pé da letra | Frase literal absurda na tela ("pay the duck") + Capi confusa | 2ª expressão mais absurda | "Traduz uma ao pé da letra aí" |
| 12 3 idiomas | Mesma frase em 3 bandeiras, primeira já tocando | Idioma "surpresa" no fim | "Qual soou melhor?" |

---

## 4. Top 5 melhorias (impacto × esforço)

| # | Melhoria | Impacto | Esforço | Como fazer |
|---|---|---|---|---|
| 1 | **Frame 0 completo + hook ≤ 1,5 s + Q1 até 2 s** | Muito alto (decide "visualizado vs. deslizado") | 1 h | Ver 5.1. No roteirista: hook de ≤ 8 palavras e regra "Q1 até 2 s" |
| 2 | **Camada de SFX + trilha + tique no timer** | Alto (tira os 5 buracos mudos) | 2–3 h | Ver 5.2. Baixar 6 SFX CC0 para `public/sfx/` |
| 3 | **Cortar tempo morto e encurtar o CTA** (48,6 s → ~32 s no ep. 002) | Alto (sobe % média assistida e "assistido até o fim") | 30 min | `GAP_SECONDS=0.12`, respiro de 0,15, CTA ≤ 2 s, Piper `--length_scale 0.9` |
| 4 | **Layout na zona segura + legenda de 2–4 palavras** | Médio-alto (hoje a legenda fica sob a UI) | 1 h | Ver 5.3 |
| 5 | **Remover porcentagens inventadas + validador (3.4)** | Alto em risco (reputação, comentários "fonte?", regra ética) | 1 h | Trocar "90%"/"3%" por formulações honestas; regex no roteirista. Depois o quiz do site gera o dado real para usar "só X%" com verdade |

Depois das 5: placar do espectador (`Score`), `mood` por evento, teaser do nível 5, re-gancho no meio e loop no final (seção 5.4).

---

## 5. Mudanças concretas no template (`canal-idiomas/src/Episode.tsx`)

### 5.1 Frame 0 nunca vazio
```tsx
const Pop: React.FC<{ children: React.ReactNode; delay?: number; instant?: boolean }> = ({ children, delay = 0, instant }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 12 } });
  const scale = instant ? interpolate(s, [0, 1], [0.92, 1]) : s;   // 1ª cena: já visível
  return <div style={{ transform: `scale(${scale})`, opacity: instant ? 1 : s }}>{children}</div>;
};
// Episode: passar `first={i === 0}` para SceneView e usar <Pop instant={first}>.
// Mascot: const blink = frame > 30 && frame % 90 < 4;
```

### 5.2 Camada de som (Remotion `<Audio>` e `<Sequence>`, sem dependência nova)
```tsx
const Sfx: React.FC<{ at: number; name: string; vol?: number }> = ({ at, name, vol = 0.6 }) => {
  const { fps } = useVideoConfig();
  return <Sequence from={Math.round(at * fps)}><Audio src={staticFile(`sfx/${name}.mp3`)} volume={vol} /></Sequence>;
};
// Em SceneView:
//  - whoosh no frame 0 de cada cena; pop em cada opção (delay 10 + i*12 frames)
//  - tick em timing.duration + 0,1,2 (último tick mais agudo: tick2)
//  - correct em revealAt(); wrong opcional quando o quadro mostra o erro
// Em Episode: <Audio src={staticFile("sfx/bed.mp3")} volume={0.08} loop /> (a trilha sobe por nível via volume por Sequence)
```

### 5.3 Layout na zona segura
- `Caption`: `bottom: 520` (fica acima da faixa de 484 px), `fontSize: 64` e mostrar só a **janela de 3 palavras** ao redor da palavra ativa (`words.slice(active-1, active+2)`).
- Handle `@capi.english` para o `top: 140`, pequeno, ou fora (o nome já aparece na UI).
- Conteúdo com `padding: "0 140px 0 60px"` (livra os ícones da direita).
- Mascote no meio (`bottom: 560`, 360 px). O contador vira **barra de tempo** sob as opções, não um número sobre a cabeça da Capi.
- Fonte: hoje `Arial Black` **não existe** no ambiente de render (`fc-match` devolve DejaVu Sans Book, peso normal). Usar `@remotion/google-fonts` com uma fonte grossa de licença livre (ex.: Lilita One ou Baloo 2 800). Custo US$0.

### 5.4 Novos campos no schema (roteirista e template)
```ts
type Scene = {
  // ...atuais
  sfx?: ("whoosh" | "tick" | "correct" | "wrong" | "drumroll")[]; // default por type, o LLM não precisa preencher
  rehook?: string;           // texto de 1 linha que entra no meio (cena do meio)
  teaser?: boolean;          // cena de 0,6 s mostrando o nível 5 borrado
  source?: string;           // obrigatório se houver % no texto
  nextEpisodeId?: string;    // obrigatório se prometer continuação
};
type EpisodeMeta = { beats: { hook: number; firstQuestion: number; rehook?: number; cta: number } }; // gerado no make.sh
```
- `beats` vai no JSON de saída junto do mp4. No relatório semanal, cruzar as quedas da curva de retenção com os beats ("a queda em 4 s = hook fraco", "queda no CTA = CTA longo"). É o que transforma a regra de corte de 14 dias em diagnóstico, não em chute.
- Componente `Score`: canto superior esquerdo, "✅ 0/5" que sobe no `revealAt` de cada nível, com SFX `correct`. Texto fixo "conta teus pontos" na Q1.
- `mood` por evento: `thinking` na pergunta, `sweat` com intensidade = nível no timer, `happy` no acerto, `shock` no nível 5. (Depende do rig novo da etapa 2 do plano; com o SVG atual dá para fazer suor com gotas e olhos arregalados.)

### 5.5 Correções nos episódios existentes
- 001: hook "Brasileiro sempre erra essa frase 😬" (sem 90%). CTA: "Acertou de primeira? Comenta ✅ ou ❌". Tirar "parte 2" até haver `nextEpisodeId`.
- 002: hook "Nível 1 é fácil. Nível 5… duvido." (≤ 1,5 s) e Q1 no mesmo frame. Re-gancho no nível 3: "Agora complica." CTA: "Placar? Comenta 3/5, 4/5…", ≤ 2 s. Resultado: ~32 s.

---

## 6. Erro oculto
**O frame 0, que é o que o feed mostra e o que o polegar julga, está vazio.** O título entra com `spring` a partir de escala 0, a Capi está no meio da piscada (`0 % 90 < 4`) e a legenda fica dentro dos 484 px de baixo, que a UI do TikTok e do Shorts cobre. Some a isso a fonte que cai para DejaVu (sem peso Black) e **todo vídeo sai com a pior capa possível**, independente do roteiro. Conferi renderizando o frame 0 do ep. 002 (`npx remotion still --frame=0`). A correção custa 3 linhas.

## 7. Oportunidade despercebida
O quadro **Capi errou** é o mais forte do plano por um motivo científico, não só de engajamento: hipercorreção. O erro de alta confiança, corrigido, é o que mais se fixa. Dá para colocar isso como promessa explícita da marca ("a Capi erra por você") e usar a mecânica em todo quadro: a Capi escolhe a opção errada com convicção **antes** do timer. O espectador sente superioridade (ego), fica para ver se a Capi errou (lacuna) e comenta (isca), e ainda aprende melhor (valor educacional, defesa contra a política de "inautêntico").

## 8. Nota do estado atual: **4/10** (retenção)
Ganha pontos pela escolha dos formatos (nível, falso cognato, placar) e pela barra de progresso. Perde por frame 0 vazio, silêncio, tempo morto, CTA longo, layout fora da zona segura e números inventados.
Para chegar a **10**:
1. Aplicar as seções 5.1–5.3 (vai para 7).
2. Placar, mood por evento, re-gancho e loop, com o validador no roteirista (vai para 8).
3. Rig novo da Capi com expressões e voz própria (vai para 9).
4. Dois ciclos de 14 dias lendo a curva contra os `beats`, com "deslizados" < 35% e "assistido até o fim" subindo semana a semana (vai para 10). Sem dado real, 10 não existe.

## Fontes
- Loewenstein (1994): https://www.researchgate.net/publication/232440476_The_Psychology_of_Curiosity_A_Review_and_Reinterpretation
- Richland, Kornell & Kao (2009): https://pubmed.ncbi.nlm.nih.gov/19751074/
- Butterfield & Metcalfe (2001): https://www.researchgate.net/publication/11641193_Errors_Committed_with_High_Confidence_Are_Hypercorrected · https://pmc.ncbi.nlm.nih.gov/articles/PMC4036076
- YouTube Help, analytics de Shorts: https://support.google.com/youtube/answer/12942217?hl=en-GB&co=YOUTUBE._YTVideoType%3Dshorts · https://support.google.com/youtube/community-video/273390203/new-youtube-shorts-metric-viewed-vs-swiped-away
- Benchmarks de deslizados (terceiros): https://reelrise.app/guide/viewed-vs-swiped-away-the-only-youtube-shorts-metric-that-matters/ · https://vidiq.com/blog/post/youtube-shorts-algorithm/
- Zona segura do TikTok (terceiros): https://cadenus.io/resources/blog/tiktok-safe-zone/ · https://kreatli.com/guides/tiktok-safe-zone
- Dados internos: `canal-idiomas/public/audio/*/timings.json`, frame 0 renderizado localmente, `fc-match "Arial Black"`.

**Próximo passo:** aplicar 5.1 + 5.3 + os cortes de tempo morto (itens 1, 3 e 4, ~2 h) e re-renderizar o ep. 002 para comparar o frame 0 e a duração.
