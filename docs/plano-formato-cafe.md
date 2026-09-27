# Plano do formato novo: Sitcom do Café (27/09/2026)

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
