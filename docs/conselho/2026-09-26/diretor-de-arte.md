# Diretor de arte: revisão do visual Capi Lingo (26/09/2026)

Alvo: `docs/plano-capi-lingo.md` (seções Personagem, Cenários e Brief), `canal-idiomas/src/Mascot.tsx` e `canal-idiomas/src/Episode.tsx`.
Evidência: stills renderizados do episódio 002 em `canal-idiomas/out/da-40.png` (hook), `da-200.png`/`da-250.png` (pergunta + timer) e `da-345.png` (revelação).

---

## 1. Diagnóstico (3 linhas)

1. **A Capi não parece capivara.** É uma cabeça redonda de frente com orelhas nas laterais. No celular lê como urso ou hamster. Não tem corpo, mãos nem poses, então não consegue "suar, desmaiar, apontar". O plano depende exatamente disso.
2. **O template é um slide de PowerPoint.** Fundo roxo chapado, 40% da tela vazia no meio do hook, texto em peso regular e nenhum cenário. Não há mudança visual entre 3 s e 8 s. E 4 dos 6 elementos importantes estão embaixo da interface do TikTok/Shorts.
3. **O plano está certo na direção** (mascote em camadas + Rhubarb + cenários + rodízio de quadros). Mas o brief do ilustrador é genérico demais para dar um resultado "de app": falta silhueta, proporção, vista padrão, especificação de rig e critérios de aceite.

---

## 2. O que os stills mostram (medido em 1080×1920)

| Elemento | Posição atual | Zona bloqueada | Problema |
|---|---|---|---|
| Barra de nível | y 70–96 | TikTok: topo 130 px · Shorts: topo ~180 px | Fica embaixo de "Seguindo / Para você" e da busca |
| Legenda karaokê | `bottom: 260` → y ~1480–1660 | TikTok: base 484 px (y > 1436) · Shorts: ~350–400 px | **Fica 100% embaixo do nome do perfil e da descrição** |
| `@capi.english` | `bottom: 90` | idem | Invisível na prática. O handle também contradiz a marca "Capi Lingo" |
| Mascote | y ~1120–1540, 420 px (39% da largura) | parte de baixo na zona | Pequena demais para ser a protagonista |
| Timer | y 1020, número solto de 150 px | ok | Sem anel nem tensão, parece página de livro |
| Meio da tela no hook | y 330–1120 vazio | — | ~40% do primeiro frame (o que decide o swipe) sem nada |

Safe zones usadas (fontes de terceiros, **estimativa**, convergentes):
TikTok: topo 130, base 484, direita 140, esquerda 44 px ([Kreatli](https://kreatli.com/guides/tiktok-safe-zone), [Quso](https://quso.ai/blog/tiktok-dimensions), [Zeely](https://zeely.ai/blog/tiktok-safe-zones/)).
Shorts: topo ~180, base ~350–400, direita ~120 px ([Pod2Reels](https://www.pod2reels.com/blog/youtube-shorts-safe-zone-guide), [YouTubeToolkit](https://youtubetoolkit.com/blog/youtube-shorts-dimensions)).
**Zona única a usar (a mais restritiva das duas): x 60–940, y 200–1436.**

---

## 3. Top 5 melhorias (impacto ÷ esforço)

### #1. Fonte real + safe zone + layout novo (impacto alto, esforço 2 h, US$0)

**Erro ligado a isto:** `FONT = "Arial Black"` não existe na máquina (`fc-match "Arial Black"` → DejaVu Sans) nem no runner do GitHub Actions. Por isso tudo sai em **peso regular**, fino e amador. Nenhum `fontWeight` é definido.

**Tipografia** (fontes gratuitas, não arredondadas como a Feather do Duolingo):
- **Títulos, número do nível, timer e legenda:** *Lilita One* (display pesado, com personalidade e bom suporte a acentos PT/ES).
- **Opções e textos de apoio:** *Rubik* 700/800.
- Carregar localmente para não depender da rede no render: baixar os `.woff2` para `public/fonts/` e usar `@remotion/fonts` (`loadFont({family, url: staticFile(...)})`). Alternativa: `@remotion/google-fonts/LilitaOne` ([docs](https://www.remotion.dev/docs/google-fonts/load-font)).
- Tamanhos em 1080 px: título 84–96 (máx. 3 linhas, ~22 caracteres por linha) · opção 60–64 · legenda 68 · nível/timer 120–160.
- Contorno em vez de sombra rala: `WebkitTextStroke: "10px #1A0B45"` com `paintOrder: "stroke fill"` + sombra dura `0 8px 0 #1A0B45`. Isso lê em cima de qualquer cenário.

**Grade nova (cena de pergunta), tudo dentro de x 60–940 / y 200–1436:**
```
y 200–300   [NÍVEL ▮▮▮▯▯  3/5]            [anel do timer 120px, x 800–920]
y 320–700   CARTÃO DA PERGUNTA (creme #FFF4E0, raio 40, contorno 8px tinta, título Lilita 88)
y 730–1110  OPÇÕES: 2–3 pílulas de 116 px de altura, gap 24, letra em bolinha à esquerda
y 1060–1436 CAPI da cintura para cima, ~560 px de altura, à esquerda (x 80–620), sobrepondo
            a base do cartão (profundidade); balão de fala/legenda à direita da cabeça (x 560–930)
y >1436     só o corpo/pés da Capi e cenário (nada legível)
```
**Hook (frame 0 = thumbnail):** Capi grande (~900 px) no centro (y 520–1436) com a expressão do gancho (chocada/suando). O título fica num balão ou faixa em y 220–500. Proibido fundo vazio.
**Legenda:** vira **balão de fala da Capi**, não barra de rodapé. Máx. 5 palavras por vez, palavra ativa em amarelo com escala 1,08. Na cena de pergunta, **esconder a legenda** (o texto já está no cartão, e a duplicação polui).
**Handle/marca:** tirar o `@capi.english` do rodapé. Colocar um selo pequeno "CAPI • DESAFIO #007" no topo do cartão (a série numerada também é gatilho, ver a pesquisa B2).

### #2. Capi profissional com brief novo (impacto máximo, esforço 1 semana, ~US$150–300 uma vez, estimativa)

O brief do plano pede "corpo arredondado e simples", e sem direção de silhueta isso vira o SVG atual. Brief completo na **seção 5** (pronto para colar no Fiverr/99freelas). Mudanças-chave em relação ao brief atual:
- **Vista padrão 3/4, não frontal.** A capivara se reconhece pelo **focinho longo, retangular e achatado no topo** e pelas **orelhas pequenas em cima da cabeça**. De frente ela vira urso. Essa é a causa nº 1 do "fraco".
- **Corpo de barril + braços curtos e expressivos** (sem corpo não há pose de "suando", "facepalm", "desmaio").
- **Assinatura de silhueta**: óculos redondos grandes (mantém) + **tangerina/yuzu na cabeça** no lugar do boné virado. O boné é genérico. A fruta na cabeça é o ícone mais reconhecível da "cultura capivara" na internet: vira meme, figurinha e avatar legível a 64 px. O laranja #FF8A1F também é quase complementar ao roxo.
- **Olhos semicerrados como expressão neutra** (o "zen"). O contraste com os olhos arregalados do "ERROU" é a piada visual da marca.
- **Método barato e seguro:** (1) gerar 3 conceitos com IA de imagem só como referência (US$0), (2) Felipe escolhe 1, (3) ilustrador redesenha **em vetor do zero** com o rig especificado. Nunca publicar o PNG de IA como está: o traço é inconsistente, não tem camadas e parece "AI slop" (risco de inautenticidade citado na pesquisa D).

### #3. Rig em camadas + lip sync de verdade (impacto alto, esforço 1–2 dias de código, US$0)

- Importar o SVG em camadas como componentes React (grupos com `id` padronizado, ver o brief). Um `<Capi pose expression viseme sweat />` troca grupos por estado.
- **Rhubarb Lip Sync** gera `mouthCues` (A–F básicas + G, H, X opcionais; [repo](https://github.com/DanielSWolf/rhubarb-lip-sync)). Mapear `viseme = cue no tempo t` e trocar a camada da boca. Isso substitui o `Math.sin(frame/2.2)` atual, que abre a boca no ritmo errado e denuncia o "robô".
- Movimento ocioso (o Duolingo faz o mesmo: piscar, sobrancelha, aceno de cabeça; [blog Duolingo](https://blog.duolingo.com/world-character-visemes/)):
  - piscar em intervalo **aleatório com semente** de 2–5 s (`random(seed)` do Remotion), não `frame % 90`;
  - respiração `scaleY 1→1,015` a cada 2,5 s no corpo;
  - orelha com "twitch" de 4 frames de vez em quando;
  - substituir o `bob` senoidal constante, que parece boia.
- Reações ligadas ao roteiro: gota de suor = nº do nível (1 a 5 gotas), "desmaio" no erro do nível 5, comemoração no CTA.
- **Não usar Rive agora.** Exportar `.riv` exige plano pago (a partir de US$9/mês, [Rive](https://community.rive.app/c/announcements/rive-s-new-9-mo-plan)). SVG + Remotion faz o mesmo de graça e com render determinístico.

### #4. Motion e ritmo: mudança visual a cada 1,5–3 s (impacto alto, esforço 1 dia, US$0)

| Momento | Hoje | Mudar para |
|---|---|---|
| Entrada da pergunta | pop de escala | **carimbo "NÍVEL 3!"** 12 frames (escala 2→1 com overshoot + shake de 4 px na câmera), depois o cartão desliza de baixo (spring damping 14) |
| Opções | pop em sequência | slide lateral alternado (A da esquerda, B da direita), 6 frames de intervalo |
| Timer | número pulsando | **anel que esvazia** (stroke-dashoffset) + tique por segundo; no último segundo o fundo pulsa para coral e a Capi troca para "suando" |
| Revelação | verde/vermelho estático | errada: **shake horizontal ±14 px × 3** + ✗ carimbado, opacidade 0,45. Certa: spring 1→1,08 + ✓ + burst de 12 partículas amarelas + punch-in de câmera 1,00→1,05 em 8 frames. Capi reage (feliz/desmaio) |
| Troca de cena | corte seco no mesmo fundo | wipe diagonal de 8 frames com a cor da próxima cena ou whip-pan do cenário |
| Fundo | chapado | cenário com parallax lento (2–3 camadas, 20 px/s) + padrão sutil de balões/letras a 6% de opacidade |
| Som | só voz | SFX curtos: whoosh (entrada), tique (timer), ding (certo), buzz (errado), pop (opções). Bancos CC0 (ex.: Kenney, freesound CC0) |

Regra de ritmo: **nenhum trecho de 2 s sem movimento de câmera, troca de expressão ou elemento novo.**

### #5. Sistema de cor e cenários por quadro (impacto médio-alto, esforço 1 dia + cenários do ilustrador, ~US$0–80)

Tokens (substituem `BG`/`ACCENT` soltos):
```ts
export const C = {
  noite:   "#1E0F4D", // fundo base / sombras de cenário
  roxo:    "#3D1F8F", // marca
  lilas:   "#8C6CFF", // realces, barra de nível vazia (em vez de branco 20%)
  amarelo: "#FFCC00", // destaque, palavra ativa, nível cheio
  tangerina:"#FF8A1F",// assinatura da Capi / CTA
  creme:   "#FFF4E0", // cartões (branco puro estoura e parece app genérico)
  tinta:   "#1A0B45", // contornos e texto em cartão
  certo:   "#16C79A", // turquesa, não verde-limão (regra anti-Duolingo)
  errado:  "#FF4D5E", // coral
};
```
- Certo/errado **nunca só por cor**: sempre ✓/✗ + movimento, porque cerca de 8% dos homens têm daltonismo vermelho-verde (dado clássico de oftalmologia, **estimativa amplamente citada**).
- **Cor de fundo por quadro** (reconhecimento de série no feed): Nível = roxo · Você sabia = azul-petróleo #0F4C75 · Capi errou = coral escuro #7A1F2B · Brasileiro vs Nativo = split roxo/tangerina · Hype = preto + amarelo "breaking news" · Pegadinha = lilás. O fundo é o que o dedo vê no swipe. Variar por quadro também ajuda contra a percepção de "template repetitivo" (pesquisa D, YouTube "inautêntico").
- **Cenários:** encomendar 4 no mesmo pedido do personagem (estúdio de quiz, sala de aula, aeroporto, cozinha da Dona Jaca), em 3 camadas (fundo / meio / primeiro plano) e saturação 60–70% para a Capi e o cartão saltarem.

---

## 4. Erro oculto

**O nome "Capi Lingo" contradiz a própria pesquisa do projeto.** `docs/pesquisas/2026-09-26-canais-conteudo-tendencias.md` (linha 212) diz: **evitar "lingo", "Duo" ou "Duolingo" no nome e no handle**, porque o Duolingo protege marca e trade dress (coruja registrada no USPTO, verde, fonte Feather). Mascote de app + fundo colorido + sufixo "-lingo" monta exatamente a associação que a regra quer evitar. Isso trava o registro no INPI e pode forçar um rebrand depois que a Capi tiver tração (refazer logo, handles, arte e vídeos).
- Status: **não achei processo público do Duolingo contra nomes "-lingo"** (busca feita em 26/09/2026, sem resultado). O risco é de marca/registro, não um caso verificado.
- Correção barata agora (antes da arte final): trocar para algo sem "lingo", por exemplo **"Capi Fala"**, **"Capivara Fluente"** ou **"Capi Challenge"**, e checar disponibilidade no INPI e nos handles antes de encomendar o logo.
- Relacionado: o código usa `@capi.english` e o README diz "Capi English". Definir **um** nome antes do ilustrador, porque o nome entra no boné, na camiseta ou no selo.

**Oportunidade despercebida:** a **tangerina na cabeça** (seção 3, #2) funciona ao mesmo tempo como assinatura de silhueta, gancho de meme e sistema de "power-up" visual (tangerina muda de cor/objeto por quadro: fone no Gíria, apito no Nível). Troca o acessório sem redesenhar a Capi.

---

## 5. Brief de ilustração v2 (colar no pedido)

> **Projeto:** mascote 2D vetorial para canal de vídeos curtos de idiomas (TikTok/Shorts 9:16), animado por código (React/SVG). Público adulto jovem. Humor, não infantil.
>
> **Personagem: Capi**, capivara brasileira jovem-adulta. Zen por fora, dramática por dentro.
>
> **Anatomia (obrigatório, é o que faz ler como capivara):**
> - Vista padrão **3/4** (não frontal). Cabeça = retângulo arredondado grande, com **focinho longo, largo e reto no topo** (cerca de 45% do comprimento da cabeça). Narinas no alto do focinho.
> - **Orelhas pequenas e arredondadas no topo da cabeça** (não nas laterais, senão vira urso).
> - Olhos pequenos no alto da cabeça, ampliados para expressividade, mas mantendo a posição alta. Expressão neutra = **pálpebras a meio-mastro** (cara zen).
> - Corpo em **barril**, sem pescoço visível, pernas curtas, **sem cauda**. Braços curtos, mas com mãos de 4 dedos capazes de apontar e segurar objetos.
> - Proporção: cabeça ≈ 45% da altura total (mais "cartoon" que realista).
>
> **Estilo:** flat vetorial, contorno de espessura única (≈ 6 px numa figura de 1000 px de altura) em marrom-tinta #2B1A12 (não preto). 1 tom de sombra cel por cor, sem gradiente, sem textura. Formas de retângulo arredondado + círculo; **sem pontas agudas**. Máximo 6 cores.
> **Paleta:** pelagem caramelo #C98B54 · barriga/focinho #E3B888 · sombra #9A6438 · óculos amarelo #FFCC00 com contorno · tangerina #FF8A1F com folha #2F9E6B (pequena) · fundo de apresentação roxo #3D1F8F.
> **Assinatura:** óculos redondos grandes + **uma tangerina equilibrada na cabeça** (objeto separado, trocável).
> **Proibido:** aves, coruja, verde como cor principal, qualquer semelhança com Duolingo/Duo, estilo infantil de bebê, gradientes, 3D.
>
> **Entregáveis (SVG editável + fonte AI/Figma), camadas nomeadas exatamente assim:**
> `body`, `head`, `snout`, `ear_l`, `ear_r`, `arm_l`, `arm_r` (cada braço com 3 variantes: `rest`, `point`, `up`), `eyes_open`, `eyes_half`, `eyes_closed`, `eyes_wide`, `eyes_x`, `brow_l`, `brow_r`, `mouth_A` … `mouth_H`, `mouth_X` (9 bocas padrão Rhubarb Lip Sync), `glasses`, `fruit`, `sweat_1..3`, `tear`, `blush`.
> Cada parte móvel com um **ponto de pivô marcado** (círculo de 2 px com id `pivot_<parte>`), sobreposição suficiente nas juntas para girar ±20° sem abrir buraco.
>
> **Expressões (8):** zen/neutra · pensando · suando (nervosa) · chocada · decepcionada "ERROU" · comemorando · rindo · desmaiada (olhos X, deitada de lado).
> **Poses (5):** 3/4 parada · apontando para cima (para o cartão) · facepalm · braços para cima (comemoração) · desmaio.
> **Turnaround:** frente, 3/4 e perfil (perfil vira avatar e thumbnail).
> **Extras:** avatar 1:1 legível a 64 px; 4 cenários 1080×1920 em 3 camadas (estúdio de quiz, sala de aula, aeroporto, cozinha); **2 personagens secundários em esboço** (Tuca: tucano azul/laranja, não verde; Dona Jaca: vó).
>
> **Critérios de aceite:** (1) reconhecível como capivara em silhueta preta a 120 px; (2) expressão legível a 200 px; (3) funciona em fundo roxo e em fundo claro; (4) todas as bocas encaixam na mesma posição da cabeça sem ajuste; (5) direitos comerciais totais cedidos por escrito.
>
> **Referência de acabamento:** mascotes de app (clareza de forma, poucos detalhes; ver princípios em [design.duolingo.com/illustration](https://design.duolingo.com/illustration)), **não copiar estilo nem personagem**.

Orçamento: pedir 2 orçamentos (Fiverr "mascot vector layered for animation" e 99freelas). Faixa US$150–300 para personagem + 4 cenários (**estimativa**, a mesma do plano). Pedir 1 rodada de rascunho em preto e branco (silhueta + 3 expressões) antes da cor, porque é onde se corrige barato.

---

## 6. Mudanças concretas no código (ordem de execução)

1. `src/theme.ts`: tokens `C` (acima) + fontes via `@remotion/fonts` com `.woff2` em `public/fonts/`.
2. `src/safe.ts`: `SAFE = {x0:60, x1:940, y0:200, y1:1436}`. Todo elemento legível posicionado por essas constantes. Em dev, `<SafeOverlay/>` desenha as zonas bloqueadas em vermelho (ativado por prop `debugSafe`).
3. `Episode.tsx`: layout da grade da seção 3 #1. Legenda vira `<SpeechBubble/>` ancorado na cabeça da Capi. Esconder a legenda durante a pergunta. Remover o handle do rodapé.
4. `Timer`: anel SVG + fundo pulsando no último segundo.
5. `Reveal`: shake/✓✗/partículas/punch-in (seção 3 #4).
6. `Mascot.tsx` → `Capi.tsx`: por enquanto, com o SVG provisório, ao menos **corrigir a vista para 3/4 com focinho longo e orelhas em cima**. Quando a arte chegar, trocar por camadas + Rhubarb.
7. `Background.tsx`: cor/cenário por `episode.format` + parallax.
8. `sfx/`: 5 sons CC0 com `<Audio volume={0.5}/>` nos eventos.
9. Thumbnail/frame 0: garantir que o frame 0 já tem Capi + texto do gancho (sem pop de 0→1, que deixa o primeiro frame vazio). Hoje o `Pop` começa em escala 0.

---

## 7. Nota

**Estado atual na área visual: 2,5/10.** Funciona tecnicamente (render, timer, karaokê), mas o personagem não lê como capivara, as fontes caem para o peso regular, o texto crítico fica embaixo da interface e não há ritmo visual.

**O que falta para 10:**
- Capi vetorial em camadas com as 8 expressões e as 9 bocas, com lip sync Rhubarb (→ 6)
- Grade na safe zone + Lilita/Rubik + cartão creme + legenda em balão (→ 7,5)
- Motion de revelação/timer + SFX + cenário por quadro (→ 8,5)
- Nome definitivo sem "lingo", avatar a 64 px testado, e um teste A/B de 2 thumbnails/hooks medido em retenção dos 3 primeiros segundos (→ 10)

Fontes adicionais: [Rhubarb Lip Sync](https://github.com/DanielSWolf/rhubarb-lip-sync) · [Duolingo: animação dos personagens (Rive, 20+ bocas)](https://blog.duolingo.com/world-character-visemes/) · [Duolingo: shape language](https://blog.duolingo.com/shape-language-duolingos-art-style/) · [Remotion google-fonts](https://www.remotion.dev/docs/google-fonts/load-font) · [Rive: plano de US$9](https://community.rive.app/c/announcements/rive-s-new-9-mo-plan).
