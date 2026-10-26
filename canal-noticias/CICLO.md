# Ciclo diário do canal de notícias (IA + dados)

Meta: 1 vídeo/dia sem trabalho manual, com cada vídeo ensinando o próximo.
Marca provisória: Plantão Absurdo. Molde: `docs/pesquisas/2026-09-26-campeoes-noticia-ludica-sem-rosto.md`.

## O ciclo (horário de Brasília)
| Hora | Etapa | Quem | Status |
|---|---|---|---|
| 06:00 | **Radar**: pautas curiosas do dia + pedidos "PARTE 2" dos comentários | `scripts/radar.py` | pronto (falta ler comentários) |
| 06:10 | **Roteirista**: escolhe a pauta, escreve 2 versões de gancho, checa o molde e os fatos na fonte | Claude API + `playbook.json` | a fazer (chave API) |
| 06:20 | **Imagens**: 1 por cena, realistas, selo SIMULAÇÃO | `scripts/imagem.py` (Cloudflare) | pronto (falta chave) |
| 06:25 | **Voz**: locutor de plantão | Kokoro (já instalado no CapyFala) | reaproveitar |
| 06:30 | **Edição**: Remotion monta tarja, legenda palavra a palavra, zoom a cada 6s e SFX | novo `src/Plantao.tsx` | a fazer |
| 11:30 | **Aprovação**: Felipe recebe o vídeo no celular, 1 toque aprova ou veta | e-mail/Drive | a fazer |
| 12:00 | **Postagem** TikTok (+ Shorts e Reels com o mesmo arquivo) | TikTok Content Posting API | a fazer |
| 12:00–13:00 | **Comunicação**: comentário fixado com pergunta e respostas aos primeiros comentários | roteirista gera o texto | a fazer |
| +24h / +72h | **Métricas** do vídeo | API do TikTok + YouTube Analytics | a fazer |
| domingo | **Analista**: compara a semana, atualiza `playbook.json` | Claude API | a fazer |
| 1x/semana | **Radar de formatos**: outliers no vidIQ (5–10 créditos) | vidIQ | manual por enquanto |

## O ciclo virtuoso (como melhora sozinho)
1. Cada vídeo sai com **etiquetas**: tipo de gancho, tema, objeto, duração, horário, versão A/B.
2. Métricas por vídeo: **% que passa dos 3s** (gancho), retenção média, % que assiste até o fim, replays,
   compartilhamentos/1k views, comentários/1k, seguidores/1k, pedidos de "PARTE 2".
3. Domingo o analista cruza etiquetas × métricas e reescreve o `playbook.json`:
   ganchos vencedores, temas proibidos por baixa retenção, duração ideal, horário.
4. O roteirista lê o playbook **todo dia** antes de escrever. O que performou vira regra e o que falhou some.
5. **Testar 1 variável por vez** (ex.: gancho com pergunta × com afirmação). Mudar tudo junto = não aprende nada.
6. Regra de corte: tipo de gancho com retenção < média por 3 vídeos seguidos sai do playbook.
7. Os comentários alimentam o radar: "PARTE 2" e perguntas viram a pauta de amanhã (série "Respondendo a @").

## Como se comunicar (tom e comunidade)
- **Personagem da voz:** locutor de plantão que trata o banal como fim do mundo. Nunca debocha de pessoa real.
- **Comentário fixado** sempre com uma pergunta de resposta fácil ("você sabia ou caiu?").
- **Primeira hora:** responder 5–10 comentários (o algoritmo mede conversa cedo).
- **Parte 2 = vídeo-resposta** a um comentário real ("Respondendo a @…"): o público vira coautor.
- **Fonte no fim de todo vídeo** + selo SIMULAÇÃO nas imagens + rótulo de IA do TikTok ligado.

## Custos estimados (mês, 1 vídeo/dia)
| Item | Custo |
|---|---|
| Radar, voz (Kokoro), render (GitHub Actions) | US$0 |
| Imagens (Cloudflare, cota grátis) | US$0 |
| Roteirista + analista (Claude API, ~US$0,02–0,05/dia) | ~US$1–2 |
| **Total** | **~US$1–2/mês** |

## Riscos
- **TikTok Content Posting API**: app ainda não auditado pelo TikTok só publica em modo privado.
  Até a auditoria: o robô sobe como privado/rascunho e Felipe troca para público (10s).
- Conteúdo em massa repetitivo → variar ganchos, imagens e temas (playbook ajuda).
- Fato errado mata a credibilidade: o roteirista checa na fonte e usa "cientistas acham" quando não é consenso.
