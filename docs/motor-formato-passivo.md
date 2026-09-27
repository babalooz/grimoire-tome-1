# Motor Remotion → formato passivo (sem interação) · levantamento 27/09

Pedido do Felipe (via PC): o formato "app" (ouça e escolha, ligar pares, lacuna, corações, XP) não funciona em vídeo —
o espectador não interage — e o ritmo está acelerado. Aqui: o que do motor serve para um formato passivo e quanto custa mudar.
Nada foi apagado.

## 1. Serve como está (≈ 70% do código)
| Peça | Arquivo | Uso no formato passivo |
|---|---|---|
| Elenco com 10 emoções, piscar, boca falando | `src/Capi.tsx`, `src/chars/*` | Igual |
| Cenário do café | `src/sets/CafeSet.tsx` | Igual (1 cenário; novela pede +2–3) |
| Motor de diálogo com câmera (plano geral/close/reação, balão, entrada do Lazy, efeitos) | `src/Sitcom.tsx` (412 linhas) | **Base da mini-novela.** Já é passivo: falas em sequência, reação de quem ouve, cortes |
| Palco com câmera/zoom/tremor | `src/lesson/CafeStage.tsx` | Igual |
| Gancho em ação no 1º segundo (close → corte → volta) | `hookPlan` em `src/Licao.tsx` | Mover para o motor novo (regra geral) |
| Legenda karaokê | `src/lesson/Caption.tsx` | Base da **legenda bilíngue** (falta a 2ª linha PT) |
| Agenda por fala com áudio real, pausas, `hold`, `speed` | `src/lesson/timeline.ts` | Igual — é onde se controla o ritmo |
| Selo "T1 E0N", marca @acapyfala, zona segura TikTok, modo auditoria | `Licao.tsx`, `Watermark.tsx`, `theme.ts`, `audit.ts` | Igual |
| Vozes por personagem, velocidade por fala, pronúncia | `scripts/tts.py` | Igual |
| Trilha CC0 com ducking, −14 LUFS | `src/lesson/music.ts`, `scripts/loudnorm.py` | Igual |
| Corte de esquete por referência (5–20 s) + card "aula completa no EP" | `src/LicaoEsquete.tsx` | Igual, apontando para as cenas novas |
| Portão camada 1 (duração, cor, movimento 0–1 s, zona segura, roteiro), juiz, `midia`, Buffer, métricas | `scripts/portao.py`, `publicar.py`, `metricas.py` | Igual; só a rubrica do juiz troca "lição útil de app" por "input compreensível" |

## 2. Serve adaptado
| Peça | Hoje | Vira |
|---|---|---|
| `cartoes` + selo "REPITA!" com microfone | cartão + 1,5 s de pausa | **Shadowing com pausa:** frase alvo grande (EN + PT), Capy fala devagar, contagem visual e silêncio de 1× a duração da frase para repetir |
| `revisao` com o Bolinha | cartões revelados | **Recapitulação passiva** no fim: Bolinha "devolve" as 2–3 frases da semana, cada uma em 1 contexto novo |
| Caderninho da Capy | card final | Igual (resumo da frase do dia) |

## 3. Sai do formato (fica no código, sem uso)
`src/lesson/LessonUI.tsx` (barra, corações, XP, opções A/B/C, montar) e os tipos `ligar`, `completar`, `ouvir`, `traducao`,
`montar` de `ExerciseBoards.tsx`. Continuam compilando; o portão passa a reprovar esses tipos no formato novo.

## 4. O que é novo
1. **Legenda bilíngue**: linha EN (karaokê) + linha PT menor embaixo, dentro da zona segura. ~1 componente.
2. **Composição "Novela"**: Sitcom + legenda bilíngue + blocos de shadowing entre cenas + recap do Bolinha; frase alvo
   repetida em 3–5 contextos dentro do mesmo episódio (é roteiro, não código).
3. **Ritmo** (queixa "acelerado"): hoje a lição usa GAP ≈ 0,12 s entre falas, Capy PT 1,0 / EN 0,9 e cortes a cada ~0,5 s
   no gancho. Proposta de partida: pausa ≥ 0,5 s entre falas, EN 0,8 na frase alvo (1ª vez) e 1,0 nas repetições, 1 corte só
   no gancho, cena mínima de 2 s por plano. Tudo são constantes em `timeline.ts`/`tts.py` — sem retrabalho de arte.
4. **Roteiros**: os 14 da T1 mantêm objetivo, vocabulário e erro de brasileiro (currículo intacto); muda a forma —
   de 5 exercícios para ~3 cenas + 2 shadowings + recap.

## 5. Custo estimado (dinheiro = crédito promocional do Claude Code, não sai do bolso)
| Etapa | Tempo | Crédito estimado |
|---|---|---|
| Legenda bilíngue + composição Novela + ritmo + shadowing (1 agente, com stills e auditoria) | 2–3 h | US$8–15 |
| Reescrever os 14 roteiros no formato novo (1 agente, currículo mantido) | 1–2 h | US$5–10 |
| Render + portão dos 14 (máquina da nuvem) | ~1 h 30 | ~US$1–3 |
| **Total** | **1 dia** | **≈ US$15–30** |
Nenhuma ferramenta paga nova. Arte, elenco, voz, portão, publicação e hospedagem: custo zero de mudança.

## 6. Aguardando
Estudo do PC em `ponte/saida/formato-ensino-video.md`. Com ele: escolher a estrutura do episódio (duração, nº de cenas,
posição dos shadowings) e registrar como teste em `canal-idiomas/decisoes.md` antes de codar.
