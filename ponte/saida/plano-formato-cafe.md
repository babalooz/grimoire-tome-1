# Plano do formato novo: Sitcom do Café — v2 (27/09/2026, público DO ZERO)

## 0. Ajuste do Felipe (27/09): quem NÃO sabe inglês e tem MEDO de inglês
Vale acima de tudo o que está abaixo. Nada renderizado; plano para decisão do Felipe.

### 0.1 Princípios
1. **Começar antes do A1 (pré-A1, GSE 10–21):** os 10 primeiros episódios são vitória garantida e zero vergonha, a partir de
   **cognatos e palavras que o brasileiro já usa** (coffee, Wi-Fi, delivery, taxi, airport, chocolate, Brazil...). Cognato
   tem chance 8× maior de ser aprendido (Peters e Webb 2018, em `pesquisas/formato-novo/formato-ensino-video.md` P1).
   Gancho verdadeiro da série: **"você já sabe mais inglês do que pensa"**.
2. **A Capy é o espelho do medo:** ela também tem medo, trava, respira e consegue. Filtro afetivo baixo: errar é normal e
   engraçado, nunca vergonhoso. **O Hank nunca humilha** (seco sim, debochado nunca; ele espera, e no fim dá um "Good."). Ninguém
   ri DA Capy; a piada é a situação.
3. **Mais português no começo:** explicação em PT; inglês só na frase-alvo (e em reações de 1 palavra: "Sure.", "OK.").
4. **Frases de 1 a 3 palavras nos E01–E05**, até 5 palavras nos E06–E10.
5. **Ritmo ainda mais lento:** frase-alvo 1ª vez ~100 palavras/min (era 120), com pausas de 600–800 ms entre blocos; última
   vez ≤ 150; pausa entre falas ≥ 0,6 s; pausa de repetir = fala + 1,5 s (mín. 2 s).
6. **1 vitória por episódio, celebrada:** card "vitória do dia" + som de acerto + selo de progresso real ("T1 E03 · você já
   sabe 3 frases"). Sem XP, sem corações, sem ranking.
7. **Sem "forma errada riscada" nos E01–E10:** o contraste errado × certo (vermelho) só volta a partir do E11. Até lá, quando a
   Capy trava, alguém ajuda com calma e ela repete e consegue.

### 0.2 Os 10 primeiros episódios (capítulo 0: "Você já fala inglês")
| EP | Título (post) | Frase-alvo | Por que é fácil | Vitória do dia |
|---|---|---|---|---|
| T1 E01 | você já sabe mais inglês do que pensa ☕ | **Coffee, please.** | coffee ≈ café; "please" o brasileiro já conhece | a Capy pede o 1º café da vida nos EUA com 2 palavras e recebe |
| T1 E02 | a primeira coisa que todo brasileiro pede nos EUA | **Wi-Fi password?** | Wi-Fi é igual; password aparece em todo app | a Capy consegue a senha e manda "cheguei" pra Dona Jaca |
| T1 E03 | a palavra que salva qualquer esbarrão | **Sorry!** | todo mundo já ouviu em filme | esbarra no Hank, derruba o copo, diz "Sorry!" e ele responde "It's OK." — errar é normal |
| T1 E04 | você usa essa palavra todo dia no Brasil | **Delivery for Capy.** | delivery é palavra de app brasileiro; for = pra | a Capy pega a encomenda na porta sem travar |
| T1 E05 | taxi e airport: você já sabe | **Airport, please.** | airport ≈ aeroporto; please de novo (revisão) | chega ao aeroporto pra buscar a Duda |
| T1 E06 | como dizer seu nome sem pânico | **My name is Capy.** | name ≈ nome; "my" aparece em "my love" | se apresenta pra Duda e ganha um abraço |
| T1 E07 | "Brazil" em inglês é quase igual | **I'm from Brazil.** | Brazil ≈ Brasil; "I'm" = "eu sou" (1 bloco) | o Hank diz "Brazil? I love Brazil." |
| T1 E08 | chocolate: a palavra mais fácil do inglês | **Hot chocolate, please.** | chocolate é igual; hot = quente (ouvido em "hot dog") | troca o café por chocolate quente e acerta de primeira |
| T1 E09 | a pergunta que evita susto no caixa | **How much?** | 2 palavras; "much" em "thank you very much" | pergunta o preço e entende "five dollars" com a ajuda do dedo do Hank |
| T1 E10 | 10 frases: olha o que você já sabe | **Thank you! Bye!** | todo brasileiro fala "thank you" e "bye" | o Bolinha devolve as 10 frases; card "você já sabe 10 frases" |
- Revisão espaçada: cada frase volta com o Bolinha ("lembra dessa?") 3 e 10 dias depois (E04 devolve E01, E07 devolve E04...).
- **"Can I get a coffee?" vira o T1 E11**: é o upgrade natural de "Coffee, please." (E01). O roteiro protótipo
  `episodes/cafe-t1e01-can-i-get.json` fica guardado para ser reescrito como E11 (com o contraste suave).
- Depois do E10, a série segue o percurso `canal-idiomas/curriculo/do-zero.json` (A1: cumprimentos, verbo be, números...).

### 0.3 Estrutura do episódio do zero (E01–E10, 45–70 s)
| Bloco | Tempo | O quê |
|---|---|---|
| Gancho | 0–3 s | a Capy com medo diante do balcão/da porta + texto "você já sabe mais inglês do que pensa" (ou "você já usa essa palavra") |
| Medo | 3–10 s | pensamento da Capy em PT ("e se eu travar?") — o espectador se reconhece |
| Descoberta | 10–20 s | Lazy (PT): "Calma. Você já conhece essa palavra." Mostra o cognato (café → coffee) com a legenda EN + PT |
| Pergunta | 20–24 s | "pensa aí... como se pede?" + contador 3 s |
| Frase-alvo | 24–40 s | a frase dita 5× em 3+ bocas, devagar (Lazy), depois normal (Duda/Hank); 1 pausa "sua vez" de fala + 1,5 s |
| Vitória | 40–55 s | a Capy tenta, trava 1 s, respira, consegue; o Hank serve/ajuda; card "vitória do dia" + som |
| Fecho | 55–65 s | Bolinha guarda ("devolvo em 3 dias"); selo "você já sabe N frases"; "#TimeLazy ou #TimeHank?" |
Esquete (seg–sex, 20–30 s): Gancho → Descoberta → Frase-alvo → Vitória, com "aula completa no EP 0N".

### 0.4 O que muda no portão (código, sem vídeo)
- E01–E05: fala em inglês ≤ 3 palavras; E06–E10: ≤ 5. Inglês mínimo 20% das palavras (era 35%) até o E10.
- Proibido nos E01–E10: bloco `errado` (risco vermelho) e fala do Hank com deboche (lista de expressões de humilhação).
- Obrigatório: 1 beat `vitoria` por episódio e selo com progresso.

### 0.5 Custo do ajuste
Só roteiro e regra: ~US$3–6 do crédito para escrever os 10 roteiros quando o Felipe aprovar. Motor: +2 elementos pequenos
(card "vitória do dia" e velocidade mais lenta), dentro do custo já estimado. Nenhum custo novo de ferramenta.

---

# (v1) Plano do formato novo: Sitcom do Café (27/09/2026)

Base: `docs/pesquisas/formato-novo/` (formato-ensino-video, didatica-visual, voz-audio-didatico) + `docs/motor-formato-passivo.md`.
Substitui o formato "lição de app" (exercícios, corações, XP), abandonado por decisão do Felipe em 27/09.

## 1. Estrutura de 1 EPISÓDIO (sábado, 60–90 s, "T1 E0N")
Protótipo: `canal-idiomas/episodes/cafe-t1e01-can-i-get.json` (T1 E01, "Can I get a coffee?").

| Bloco | Tempo | O que acontece | Regra de ensino |
|---|---|---|---|
| 1. Gancho | 0–3 s | A Capy já errou no balcão ("Give me a coffee."), close + corte seco para o Hank imóvel. Texto de tela ≤ 6 palavras | movimento antes de 1 s; erro dito 1 vez, riscado e nunca mais |
| 2. Contraste | 3–12 s | Outro personagem (Duda) pede certo, devagar (~120 palavras/min). Hank serve na hora. **1ª aparição da frase-alvo: legenda EN + PT** | cena explica o sentido; legenda dupla só na 1ª vez |
| 3. Pergunta | 12–16 s | "qual foi a diferença?" + contador de 3 s, trilha muda | 1 pergunta por vídeo, resposta no mesmo vídeo |
| 4. Explicação | 16–26 s | Lazy responde devagar, em blocos ("Can... I get... a coffee?"), 1 linha de PT (≤ 14 palavras) | pausa > esticar a fala |
| 5. Repete comigo | 26–31 s | Frase grande, "sua vez", silêncio = duração da frase + 1 s | shadowing com pausa do próprio vídeo |
| 6. Uso real | 31–50 s | Poppy na velocidade nativa (variação), Capy acerta, Hank faz a pergunta seguinte (subtrama: Dona Jaca liga) | 3+ bocas, velocidade subindo até ~170 |
| 7. Piada/volta | 50–60 s | Hank devolve a frase de outro jeito ("Can I get your name?") → "Got it. Happy." | humor = a palavra |
| 8. Bolinha + card | 60–70 s | Bolinha guarda a frase ("devolvo em 3 dias"), Caderninho, pergunta de comentário | revisão espaçada D+3 e D+10 |
**Frase-alvo ≥ 5 vezes em ≥ 3 bocas** (no protótipo: 5 exatas + 2 variações, 6 bocas).

## 2. Estrutura de 1 ESQUETE (seg–sex, 20–35 s)
Mesma cena, blocos 1–2 + 4 + 6 (sem Dona Jaca), terminando no acerto da Capy e no card "aula completa no EP 0N".
No protótipo: beats 0–13 do EP → `...-esquete-A.mp4`. Quadros de esquete (grade §7 do estudo): F1 Sitcom, F2 Devagar→Nativo,
F4 Brasileiro×Nativo; testes: F3 Adivinha Antes, F5 Repete no Ritmo, F6 Novela.

## 3. O que muda no motor
| Muda | Como |
|---|---|
| Nova composição `Cafe` + `CafeEsquete` | a partir de `Sitcom.tsx` (beats, câmera, reações) + gancho do `Licao.tsx` |
| Legenda | karaokê EN sempre; PT só na 1ª ocorrência da frase-alvo; ≤ 32 caracteres/linha, ≥ 833 ms |
| Destaque | 1 elemento amarelo por quadro (a frase-alvo) |
| Beats novos | `pausa` (reação muda), `pergunta` (contador 3 s, trilha zero), `repita` (silêncio = fala + 1 s), `errado` (risco vermelho 1×), `bolinha` (revisão) |
| Ritmo | pausa entre falas ≥ 0,45 s (era 0,1), plano de câmera 1,5–3 s, EN-alvo 120 → 170 palavras/min, nunca > 190 |
| Dona Jaca | moldura de videochamada + filtro de telefone |
| Portão | novas checagens: frase-alvo ≥ 5× em ≥ 3 bocas; fala EN ≤ 8 palavras (A1); PT ≤ 14; errado 1×; ≤ 1 pergunta; nenhum tipo de exercício de app; velocidade ≤ 190 palavras/min |
| Sai | UI de app (corações, XP, opções) — fica no código, sem uso |
| Voz | protótipo ainda em Kokoro. Troca para Gemini 3.8 Flash TTS (+ Azure no Lazy) só depois do teste cego do estudo de voz |

## 4. Custo
| Item | Custo |
|---|---|
| Motor novo + protótipo (1 agente, render e auditoria) | ~US$8–15 do crédito promocional |
| Reescrever os roteiros das 4 semanas (1 agente) | ~US$5–10 do crédito |
| Teste cego de voz (Gemini + Azure + ElevenLabs Starter 1 mês) | < US$5 (US$6 do ElevenLabs Starter, cancelar depois) |
| Voz em produção (Gemini + Azure grátis) | ~US$3/mês até dez/2026, ~US$6/mês depois; +US$22–40 se o ElevenLabs ganhar na Capy |
| Todo o resto (Remotion, Buffer Free, midia/jsDelivr, rotinas) | sem custo novo |

## 5. Grade e testes
Grade de 4 semanas (12/10–08/11) e testes com critério de corte: §4 e §7 de `formato-ensino-video.md`, registrados em
`canal-idiomas/decisoes.md`. O teste "Duas faixas" antigo foi substituído.

## 6. Protótipo para auditar
`out/cafe-t1e01-can-i-get.mp4` + `out/cafe-t1e01-can-i-get-esquete-A.mp4` → portão → branch `midia` → aviso com o commit.
