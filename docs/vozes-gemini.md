# Vozes do motor Gemini (Sitcom do Café) — 03/10/2026

Kokoro aposentado no formato `cafe`. Motor: `gemini-3.8-flash-lite-tts` (o `gemini-3.8-flash-tts` normal só libera
10 pedidos/dia no plano grátis; o lite não tem esse limite registrado, mas trate como escasso — cache por hash em
`public/audio/_cache_gemini/`, reaproveitado entre V1/V2/V3 e entre re-renders).

## Capy — decidida pelo Felipe (teste cego, 03/10)

| Personagem | Voz Gemini | Por quê |
|---|---|---|
| **Capy** | **Sulafat** | Felipe escolheu no teste cego (era a fala1-A do gabarito; `canal-idiomas/teste-voz/gabarito.json`) |

## Outros personagens — escolhidas agora (Claude, 03/10), critério = distinguibilidade máxima entre si

| Personagem | Voz Gemini | Instrução de estilo (sem SSML; o Gemini só obedece ritmo/pausa por texto) |
|---|---|---|
| **Hank** | **Algenib** | grave e seco, "gruff, deadpan, low male voice... never mocking" |
| **Lazy** | **Umbriel** | bem devagar, "real pause of about 600 ms between each word or block (never stretch the sounds)" |
| **Duda** | **Autonoe** | animada, confiante, "lively female voice... upbeat" |
| **Poppy** | **Zephyr** | jovem e rápida, "casual Gen Z influencer" |
| **Bolinha** | **Despina** | leve, pequena, "light, small, slightly high... cheerful and quick" |
| Dona Jaca (ainda não usada nos 3 vídeos do assunto 1) | Gacrux | madura e calorosa — filtro de telefone continua no pós (scripts/tts.py, já existia) |
| Narrador (idem, sem uso ainda) | Enceladus | tom neutro |
| **Turista** (figurante do V2, nunca elenco fixo) | **Orus** | "generic American tourist voice, casual" |

Tabela completa em `canal-idiomas/scripts/tts.py` (`GEMINI_VOICE` / `GEMINI_STYLE`). Pronúncia de "Capy"/"Lazy"
continua corrigida no texto antes de mandar pro Gemini (mesma tabela `PRONUNCIA` que já existia pro Kokoro).

## Ritmo (regras 1–2 do estudo `docs/pesquisas/formato-novo/voz-audio-didatico.md`)

Sem SSML real, o "devagar" vira instrução de texto (nunca time-stretch): `_gemini_pace()` em `tts.py` manda
"speak slowly, with clear pauses, never stretching the vowels" quando a velocidade do personagem/beat é ≤ 0,82, e
"calm, clear pace" até 0,95; senão "natural, clear pace". A trilha ainda zera na palavra-alvo e na pausa do aluno
(mecanismo já existente em `src/cafe/timeline.ts`, não mudou).

## Cache e cota

Cada fala (texto + personagem + idioma + velocidade + voz) vira 1 chamada no máximo — gravada em
`public/audio/_cache_gemini/<hash>.wav` e reaproveitada sempre que o mesmo beat aparecer de novo (ex.: "Hi! I'm
Capy." repete nos 3 vídeos do assunto 1 com o mesmo personagem/velocidade → só a 1ª chamada gasta cota). Em vez de
1 chamada por PEDAÇO (como o Kokoro fazia para separar pausas), o Gemini recebe 1 chamada por FALA inteira (as
reticências do roteiro já pedem a pausa por instrução) — "junte falas do mesmo personagem num pedido" na prática
virou "não fatie a mesma fala em várias chamadas".

Se a API devolver 429 (cota diária esgotada), `scripts/tts.py` PARA (não volta pro Kokoro em silêncio) e imprime
quantas falas já tinham áudio pronto e quantas faltaram — ver `GeminiQuotaError` em `scripts/tts.py`.
