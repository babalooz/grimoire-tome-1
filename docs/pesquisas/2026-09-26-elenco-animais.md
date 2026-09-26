# Elenco CapyFala: quais animais as pessoas amam (dados de 26/09/2026)

**Resultado:** o elenco fica com **capivara, preguiça, panda-gigante, panda-vermelho, axolote e hamster**. Saem o bisão (espécie do Hank), o quati (Duda) e o gambá (Poppy). A Dona Jaca continua capivara. Os 14 roteiros **não mudam nenhuma linha**, porque só usam os ids `capi`, `hank` e `leo` e não citam a espécie em lugar nenhum.

Confirmado: o **Léo já é bicho-preguiça** (playbook, seção 4.2). Ele fica.

---

## 1. Método e fontes (coleta em 26/09/2026)

| Métrica | Como foi medida | Fonte |
|---|---|---|
| **YT cute US** | Mediana de views dos 20 primeiros resultados (vídeos e Shorts) da busca "cute &lt;animal&gt;" com `gl=US`, lida do `ytInitialData` | youtube.com/results |
| **YT fofo BR** | Igual, com a busca "&lt;animal&gt; fofo" e `gl=BR`, `hl=pt` | youtube.com/results |
| **Shorts BR** | Igual, com a busca "&lt;animal&gt; shorts" e `gl=BR` | youtube.com/results |
| **TikTok** | Total de views da hashtag em inglês | tiktokhashtags.com (HashtagRadar, página "2026"; data exata do snapshot não informada) |
| **Wiki en / Wiki pt** | Soma de pageviews de usuários de set/2025 a ago/2026 (12 meses) | API REST Wikimedia per-article |

**Índice composto (0–100):**

- Cada uma das 6 métricas vai para log10. Views seguem lei de potência, então o log evita que um viral isolado domine.
- Depois, cada métrica é normalizada de 0 a 100 entre os 24 candidatos.
- O índice é a média simples das 6 notas.
- Dado ausente (n/d) recebe a nota mínima, para ser conservador.

**Bloqueios e ajustes:**

- **TikTok direto:** a página `/tag/` é renderizada no cliente e não traz contagem. Usei o agregador acima como proxy.
- **Reddit:** retornou 403.
- **Wikimedia via curl:** bloqueada por rate limit. Busquei via WebFetch.
- **Títulos pt:** usei o artigo real, não o redirecionamento: Folivora (preguiça), Lutrinae (lontra), Ambystoma mexicanum (axolote), Tamanduá-bandeira, Setonix brachyurus (quokka), Bisonte.
- **Gambá:** no TikTok usei a hashtag #possum, porque #opossum não tem página.
- **Foca:** no en.wiki usei "Earless seal", que subconta.

## 2. Ranking (24 candidatos)

| # | Animal | Índice | YT cute US (med.) | YT fofo BR (med.) | Shorts BR (med.) | TikTok (views #) | Wiki en 12m | Wiki pt 12m | Observação |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Gato | **99,9** | 19,0 M | 5,57 M | 5,25 M | 462 B | 3,21 M | 160 k | Genérico. Não diferencia a marca |
| 2 | Panda-gigante | **79,8** | 3,21 M | 1,70 M | 5,38 M | 18,8 B | 1,09 M | 57 k | Maior animal "não pet" |
| 3 | **Capivara** | **75,4** | 2,73 M | 44,5 k | 2,60 M | 8,9 B | 1,39 M | **134 k** (2º pt) | Protagonista confirmada |
| 4 | Hamster | **73,2** | 2,87 M | **1,49 M** | 4,60 M | 16,3 B | 676 k | 29 k | Pet muito amado no BR |
| 5 | Axolote | **70,9** | 961 k | 174 k | 1,15 M | 3,6 B | **1,57 M** (2º en) | 83 k | Puxado pelo Minecraft |
| 6 | Panda-vermelho | **57,3** | 524 k | 16 k | 620 k | 2,0 B | 760 k | 46 k | Filme *Red: Crescer é uma Fera* (Pixar) |
| 7 | Pinguim ⚠ ave | 55,8 | 2,50 M | 43,5 k | 25 k | 4,5 B | 836 k | 38 k | Pesto viralizou em 2024. **Excluído** |
| 8 | Lontra | 51,1 | 2,30 M | 23,5 k | 36 k | 4,4 B | 478 k | 26 k | Forte nos EUA, fraca no BR |
| 9 | Shiba inu | 50,5 | 424 k | 23,5 k | 154 k | 4,9 B | 620 k | 18 k | Memes (doge) |
| 10 | Bisão (Hank atual) | 49,0 | 360 k | 184 k | 20 k | 1,3 B | 592 k | 25 k | Não é "fofo" |
| 11 | Guaxinim | 48,7 | 809 k | 9,8 k | 1,9 k | 6,1 B | 1,02 M | 52 k | Quase nulo no BR |
| 12 | Gambá (Poppy atual) | 48,4 | 355 k | 115 k | 10 k | 1,2 B | 216 k | 83 k | No BR, "gambá" tem má fama (fedor) |
| 13 | **Bicho-preguiça** | 48,3 | 515 k | 39,5 k | 37 k | 1,8 B | 458 k | 28 k | *Zootopia 2*: US$1,867 bi |
| 14 | Coala | 45,1 | 425 k | **579** | 143 k | 1,6 B | 618 k | 34 k | Fraco no BR |
| 15 | Foca | 42,8 | 1,30 M | 1,8 k | 83 k | 6,8 B | 133 k* | 27 k | |
| 16 | Quokka | 39,2 | 110 k | 11 k | 112 k | 0,32 B | 711 k | 10 k | |
| 17 | Ouriço | 37,7 | 921 k | 6,4 k | 15 k | 3,5 B | 507 k | n/d | |
| 18 | Tucano ⚠ ave | 37,5 | 295 k | 1,1 k | 36 k | 0,32 B | 295 k | 37 k | Excluído (ave e fraco) |
| 19 | Tamanduá | 37,2 | 63 k | 7,5 k | 20 k | 0,24 B | 268 k | 47 k | |
| 20 | Raposa-do-ártico | 37,1 | 365 k | 14 k | 11 k | 0,60 B | 366 k | 14 k | |
| 21 | Alpaca | 36,8 | 56 k | 2 k | 36 k | 1,8 B | 420 k | 20 k | |
| 22 | Quati (Duda atual) | 29,4 | 10,5 k | 745 | 20 k | 0,02 B (#quati) | 566 k | 51 k | 2º pior |
| 23 | Hipopótamo-pigmeu | 26,6 | 920 k | 8,7 k | 2,2 k | 0,61 B | 166 k | 6 k | O hype da Moo Deng acabou (en.wiki "Moo Deng": 186 k em 12 meses) |
| 24 | Mico-leão-dourado | 14,9 | 1,3 k | 3,5 k | 2,1 k | n/d | 61 k | 56 k | Só a Wikipédia pt sustenta |

Cachorrinho e coelho também foram medidos no YouTube (puppy: 17 M de mediana US; bunny: 2,1 M), mas ficaram fora do índice. São genéricos, como o gato.

**Autocomplete do YouTube BR** (suggestqueries, `hl=pt`, `gl=BR`):

- "bicho preguiça" → 2ª sugestão: **"bicho preguiça zootopia"**.
- "capivara" → "capivara musica", "capivara zumbi", "capivara do roblox".
- "axolote" → **"axolote minecraft"**.
- "panda vermelho" → "panda vermelho filme completo dublado".
- "quati" e "gambá" → só conteúdo de natureza ou nojo ("gambá soltando pum", "quati come galinha").

**Personagens de sucesso por espécie:**

- **Capivara:** Kapibara-san (Bandai, 2005), com mais de 5 mil produtos licenciados.
- **Preguiça:** Flash, de *Zootopia 2* (US$1,867 bi, maior animação de Hollywood da história; Variety, 2026).
- **Panda-vermelho:** *Red: Crescer é uma Fera* (Pixar).
- **Axolote:** mob do Minecraft.
- **Pinguim:** Pesto (Sea Life Melbourne, 2024, até 2,6 M de likes por vídeo).
- **Hipopótamo-pigmeu:** Moo Deng.

## 3. Proposta de elenco (Capy + 6)

| Personagem | Espécie | Função na história | Traço ligado ao aprendizado | Número que justifica |
|---|---|---|---|---|
| **Capi** | Capivara | Protagonista, barista que trava | "Calma… respira… ERROU." Pré-teste | Índice 75,4. 8,9 B views no TikTok. 2ª mais lida na Wikipédia pt (134 k) |
| **Léo** (fica) | Bicho-preguiça | Lava a louça, sabe tudo e não fala | **Fala devagar, então a pronúncia sai em câmera lenta.** É o "repita comigo" do episódio | 1,8 B no TikTok. "bicho preguiça zootopia" é a 2ª sugestão do autocomplete. Pedido explícito do Felipe |
| **Hank** (troca de espécie) | Panda-gigante | Dono rabugento do Bean There | Leva tudo ao pé da letra, e a tela mostra a imagem literal. Mastiga bambu devagar: "Say that again… slowly." | **Índice 79,8**, o maior entre os não-pets. Shorts BR com mediana de 5,38 M |
| **Duda** (troca de espécie) | Panda-vermelho | O "fluente" confiante que fala errado | **Falsos cognatos**. Jura que é primo do Hank ("somos pandas"), mas não é: panda-vermelho não é parente do panda-gigante. Na defensiva, fica de pé sobre as patas traseiras para parecer maior (comportamento real). É a hipercorreção | Índice 57,3. Shorts BR com mediana de 620 k (quati: 20 k). 2,0 B no TikTok (quati: 0,02 B) |
| **Poppy** (troca de espécie) | Axolote | Colega americana Gen Z, só fala gíria | **Regenera**: quando passa vergonha, "renasce" e tenta de novo. É a prática de recuperação (errou → tenta outra vez) | **Índice 70,9**. 1,57 M de leituras no en.wiki, acima da capivara. Mediana "fofo" BR de 174 k (gambá: 115 k, com fama de fedido) |
| **Bolinha** (nova) | Hamster | Colega de apê 3B, "caçula" | **Enche as bochechas de frases.** Guarda os chunks e cospe de volta dias depois (repetição espaçada, Caderninho) | Índice 73,2. **"hamster fofo" BR com mediana de 1,49 M**, o 3º maior do BR. 16,3 B no TikTok |
| **Dona Jaca** (fica) | Capivara | Mãe da Capi, por videochamada | Traz as palavras intraduzíveis e o hype do BR | A mesma espécie da protagonista mantém a família coerente. Índice 75,4 |

**O que fica de fora:**

- **Pinguim** (55,8): ficaria em 7º, mas é ave. A evidência não é forte o bastante para quebrar a regra anti-Duolingo, porque no BR ele é fraco (Shorts BR com mediana de 25 k).
- **Tucano:** fraco (37,5) e ave.
- **Gato** (99,9): lidera, mas é genérico. Todo canal usa, e o gato não cria identidade de marca.
- **Coala:** fraco no BR ("coala fofo" com mediana de 579).

## 4. Impacto nos 14 roteiros e no código

- **`canal-idiomas/episodes/licao-s01e01…e14.json`:**
  - Os falantes são `capi` (242 falas), `hank` (40) e `leo` (2).
  - Nenhum roteiro cita bisão, chifre ou corcova.
  - **Mudanças de texto: 0.** Mantendo o nome Hank, os áudios e o `timings.json` também não mudam.
- **O que muda:**
  - É preciso redesenhar os componentes `canal-idiomas/src/chars/Hank.tsx`, `Duda.tsx` e `Poppy.tsx`, e criar `Bolinha.tsx`.
  - Revisar `CastSheet.tsx` e as paletas e silhuetas da seção 4.5 do playbook.
  - Hank: o "bloco com corcova" vira "bloco preto e branco com olheiras".
  - Duda: a "cauda anelada em pé" continua, porque o panda-vermelho também tem.
  - Poppy: as "guelras em leque" viram a silhueta dela.
- **Custo:** zero de roteiro. A folha de personagem do ilustrador já estava prevista (US$300–900), então a troca de espécie antes da encomenda não custa nada extra.

## 5. Risco oculto

**O axolote puxa público infantil** ("axolote minecraft"). Isso aumenta o risco de o canal ser classificado como "feito para crianças", o que derruba a monetização. Para mitigar: a Poppy sempre em temas adultos (trabalho, aluguel, visto, date). Também não usar Minecraft nem a paleta rosa-bebê como tema principal.
