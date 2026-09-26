# Conselho 26/09/2026 — Analista de dados

Alvo: `docs/plano-capi-lingo.md` (teste de 14 dias + regra "a cada 14 dias saem os 3 quadros com pior retenção") e `canal-idiomas/`.
Rótulos: **verificado** (doc oficial lida hoje) · **autodeclarado** · **estimativa** (minha conta/inferência — calibrar com dado real).

---

## 1. Diagnóstico (3 linhas)

1. **Nada está instrumentado.** O pipeline gera o vídeo e para. Não guarda quadro, ID do vídeo na plataforma nem data de postagem. Sem isso, não existe "retenção por quadro".
2. **A regra de corte, do jeito que está escrita, é sorteio.** São 14 Shorts para 6 quadros, ~2 vídeos por quadro, cada quadro preso ao mesmo dia da semana. Cortar 3 de 6 com n=2 é cortar metade do banco por ruído.
3. **As métricas certas existem e são grátis via API no YouTube.** No TikTok e no Instagram só existem em parte. O YouTube Shorts tem que ser o "laboratório" do teste, e TikTok/IG entram como sinal secundário.

---

## 2. Métricas-norte

### 2.1 Norte do canal (1 número por semana)
**Views engajadas de Shorts + inscritos ganhos, por semana, no YouTube.**
- É a moeda do YPP. A elegibilidade e a divisão de receita de Shorts usam `engagedViews`, não `views` (**verificado**: desde 31/03/2025 `views` conta todo início/replay e `engagedViews` segue o método antigo. [Revision history](https://developers.google.com/youtube/analytics/revision_history), [Sprout](https://support.sproutsocial.com/hc/en-us/articles/35874991211533-YouTube-Shorts-View-Count-Update-March-2025)).
- Meta de janela: YPP antes de 01/02/2027 (1.000 inscritos + 10M views de Shorts em 90 dias, pela régua antiga — ver `docs/pesquisas/2026-09-26-canais-conteudo-tendencias.md`). O relatório semanal mostra o **ritmo necessário × o ritmo atual**.

### 2.2 Métricas por vídeo/quadro (para decidir corte)
| Papel | Métrica | Fonte API | Por quê |
|---|---|---|---|
| **Primária (qualidade)** | **Retenção relativa**: média de `relativeRetentionPerformance` na curva do vídeo | YouTube Analytics, relatório de retenção (**verificado**, [channel_reports](https://developers.google.com/youtube/analytics/channel_reports)) | Compara com "todos os vídeos do YouTube de duração parecida" (0–1; 0,5 = mediana). **Neutraliza a duração.** A "Capi errou" (25 s) não ganha da "Nível" (40 s) só por ser curta. |
| Primária (crescimento) | **Inscritos por 1.000 views engajadas** (`subscribersGained` / `engagedViews` × 1000) | YouTube Analytics, dimensão `video` | Um quadro que retém mas não converte em inscrito não ajuda o YPP. |
| Gancho | **Retenção aos ~3 s**: `audienceWatchRatio` no ponto `elapsedVideoTimeRatio` ≈ 3 s / duração | YouTube Analytics | O "Assistido vs. deslizado" do Studio **não existe na API** (não consta na lista de métricas — **verificado** por ausência em [metrics](https://developers.google.com/youtube/analytics/metrics)). Isto é o proxy. |
| Gancho (IG) | `reels_skip_rate` (% que pula nos 3 primeiros s) | Instagram Graph API (**verificado**, [media insights](https://developers.facebook.com/docs/instagram-platform/reference/instagram-media/insights)) | Única métrica de "deslizou" exposta por API nas três plataformas. |
| Loop | `averageViewPercentage` | YouTube Analytics | Acima de 100% = replay. Importa no quadro "Nível" (placar/replay). |
| Específica do quadro | Comentários por 1.000 views engajadas | YouTube + TikTok Display API | Mede se a isca funciona. **Métrica principal da "Capi errou"**, cujo objetivo é comentário e não retenção. |
| Específica do quadro | Compartilhamentos por 1.000 | YouTube `shares`, TikTok `share_count`, IG `shares` | "Ao pé da letra" e "Brasileiro vs Nativo" vivem de compartilhamento. |
| Funil (depois) | Cliques no link / leads do teste de nível | UTM + planilha/WhatsApp | Só para o quadro "Qual seu nível?". Sem funil ativo, não avaliar esse quadro por retenção. |

**Não usar** `views` cru de Shorts para comparar quadros: replays inflam o número e ele varia com a loteria do algoritmo.

---

## 3. Limiares de corte por quadro

Os valores iniciais são **estimativas**. Não há benchmark público confiável de retenção de Shorts: guias sérios recomendam comparar com vídeos de duração parecida, e é isso que a `relativeRetentionPerformance` faz ([Shortimize](https://www.shortimize.com/blog/youtube-shorts-retention-rate)). Recalibrar no dia 28 com os dados do próprio canal.

### 3.1 Condições para um vídeo contar
- Medido em **D+7** após a postagem. O Analytics tem atraso de ~2–3 dias e o Short recebe a maior parte da distribuição nos primeiros dias (**estimativa**).
- **≥ 300 views engajadas** (**estimativa**; abaixo disso a curva de retenção é ruído). Vídeo abaixo do piso entra no relatório como "sem distribuição", não como "ruim". Se o quadro inteiro fica abaixo do piso, o problema é o gancho/título, não a retenção.

### 3.2 Semáforo por vídeo (retenção relativa média)
| Faixa | Leitura |
|---|---|
| ≥ 0,60 | verde: melhor que ~60% dos vídeos de mesma duração |
| 0,40–0,59 | amarelo |
| < 0,40 | vermelho |

### 3.3 Regra de decisão por quadro (substitui "os 3 piores saem")
Compare cada vídeo com a **mediana do canal** no período (todos os quadros juntos):

- **CORTAR**: quadro com **≥ 4 vídeos válidos**, **todos** abaixo da mediana do canal em retenção relativa **e** inscritos/1k abaixo da mediana. É um teste de sinal: se o quadro fosse igual à média, a chance de 4 de 4 caírem abaixo por acaso é 1/16 ≈ 6%. Com 3 de 3, a chance é 12,5%: vira **"em observação"**, não corte.
- **ESCALAR** (ganha um 2º slot na semana): ≥ 4 vídeos, todos acima da mediana em pelo menos uma das duas primárias, e nenhum vermelho.
- **INCONCLUSIVO** (o caso mais comum no início): mantém por mais um ciclo. **No máximo 1 corte por ciclo**, nunca 3.
- **Exceções por quadro:**
  | Quadro | Primária própria | Corte se… |
  |---|---|---|
  | Capi errou | comentários/1k | ≥4 vídeos com comentários/1k abaixo da mediana do canal (retenção vira secundária) |
  | Hype em inglês | views engajadas vs mediana do canal | a variância é alta por natureza; avaliar só com ≥6 vídeos |
  | Qual seu nível? | cliques/leads | só avaliar depois que o funil existir |
  | Nível 1→5 | retenção relativa + `averageViewPercentage` | regra geral |
  | Demais | regra geral | regra geral |
- **Trava de desgaste** (vale depois do teste): a pesquisa de campeões sugeriu "assistido vs. deslizado < 50% em 10 vídeos seguidos → trocar formato" (`docs/pesquisas/2026-09-26-campeoes-shorts-quiz-idiomas.md`). Esse número não sai por API. Usar o equivalente: **10 vídeos seguidos de um quadro vermelhos → aposentar**.

---

## 4. Desenho do teste de 14 dias

### 4.1 O problema com o desenho atual
| Problema | Efeito |
|---|---|
| 14 Shorts / 6 quadros = ~2 por quadro | Nenhuma conclusão possível (Shorts têm distribuição muito assimétrica: 1 vídeo pode fazer 50× o outro) |
| Quadro fixo no dia da semana | Quadro fica **confundido** com o dia. Se a sexta vai mal, é culpa do "Hype" ou da sexta? |
| Canal novo "esquenta" com o tempo | Os quadros do fim do teste levam vantagem sobre os do começo |
| Vídeos dos dias 8–14 não maduram até o dia 14 | Decidir no dia 14 usa dado incompleto de metade dos vídeos |
| `roteirista.py` tem 6 quadros e o plano tem 12 | 6 quadros do plano nunca entram no teste |

### 4.2 Desenho recomendado
- **Menos quadros, mais repetições.** Testar **4 quadros** no ciclo 1: Nível 1→5, Capi errou, Pegadinha, Você sabia (os três primeiros já estão no roteirista e são os de maior retenção esperada na pesquisa). O Hype roda à parte, 2×/semana, e é avaliado separado.
- **Volume: 2 Shorts/dia no YouTube** por 14 dias = 28 vídeos ≈ **6 por quadro** + 4 Hype. O custo marginal é ~US$0,10/vídeo em API (**estimativa**, pesquisa de tendências) e ~2–3 min de aprovação do Felipe. **Se o Felipe não tiver 5 min/dia**, ficar em 1/dia: 14 vídeos ≈ 3 por quadro, e o ciclo 1 só produz "em observação", nenhum corte.
- **Rodízio balanceado (quadrado latino):** cada quadro passa por dias da semana e horários diferentes. Exemplo para 4 quadros A–D, manhã/noite:
  | Dia | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
  |---|---|---|---|---|---|---|---|
  | Manhã | A | B | C | D | Hype | A | B |
  | Noite | C | D | A | B | C | D | Hype |
  A semana 2 inverte manhã/noite. Isso mantém a regra do plano "nunca o mesmo formato 2 dias seguidos" no mesmo horário.
- **Linha do tempo:** dias 1–14 postam; **dia 21** sai o relatório de decisão (todo vídeo com D+7); o ciclo 2 começa no dia 15 sem esperar. Os longos de domingo são avaliados à parte (retenção média + CTR de thumbnail) e não entram na regra de Shorts.
- **Mesma versão para todos:** Short de 30–45 s no YouTube. As versões de 61–75 s do TikTok são outro produto (duração diferente) e não se comparam com as do YouTube.
- **Uma variável por vez:** durante o ciclo 1, não mudar voz, mascote nem horário. Se a arte nova da Capi chegar no meio, anotar a data no ledger (coluna `mudanca`) e comparar antes × depois.

### 4.3 Limitações que o relatório tem que dizer em voz alta
- Com ~6 vídeos por quadro, só se detecta diferença **grande**. Diferença pequena entre quadros é invisível; tratar como empate.
- O YouTube distribui pouco um canal com dias de vida. As primeiras semanas medem mais "o algoritmo testando o canal" do que "o quadro".
- 1 viral distorce médias → usar **mediana** e contagem acima/abaixo, nunca média de views.
- A escolha dos 4 quadros e a trava de 300 views são julgamentos (**estimativa**), não fatos.

---

## 5. Coleta automática (APIs, permissões, custo)

### 5.1 Pré-requisito no código (falta hoje)
1. **Chave estável de quadro.** Hoje `roteirista.py` salva `format` como texto livre gerado pelo modelo (o episódio 002 tem `"format": "desafio-niveis"`). Gravar também `"quadro": quadro` (a chave do dict `QUADROS`) no JSON do episódio, **fora** do schema do modelo, direto no `main()`.
2. **Ledger de postagens** `canal-idiomas/metrics/posts.csv`: `episode_id, quadro, plataforma, versao (short/61s/longo), video_id, publicado_em, duracao_s, mudanca`. A etapa de postagem (item 6 do pipeline) escreve uma linha por upload. Sem o `video_id`, nenhuma métrica volta para o quadro.
3. **Coletor** `scripts/metricas.py` + GitHub Action diária (cron) → `metrics/videos.csv` (snapshot D+1, D+3, D+7) → `metrics/relatorio-AAAA-MM-DD.md` semanal.

### 5.2 Por plataforma
| Plataforma | API / endpoint | Métricas que vêm | Permissão / conta | Custo |
|---|---|---|---|---|
| **YouTube** (laboratório) | **Analytics API** `reports.query`: `ids=channel==MINE`, `dimensions=video`, `filters=creatorContentType==SHORTS`, `metrics=engagedViews,views,averageViewDuration,averageViewPercentage,subscribersGained,likes,comments,shares`. **Retenção:** 1 chamada por vídeo com `dimensions=elapsedVideoTimeRatio`, `filters=video==ID`, `metrics=audienceWatchRatio,relativeRetentionPerformance` (o filtro aceita **1 vídeo por chamada** — verificado) | tudo da seção 2.2 | OAuth 2.0 (app "Desktop" no Google Cloud), escopos `yt-analytics.readonly` + `youtube.readonly`. Refresh token em GitHub Secret | US$0 |
| YouTube (longos) | **Reporting API**, relatório de alcance com `video_thumbnail_impressions` e `video_thumbnail_impressions_ctr` (novo em 15/01/2026 — **verificado**, revision history) | CTR da thumbnail do "Prova da Semana" | mesmo OAuth. É job em lote: **criar o job antes do 1º longo** | US$0 |
| YouTube (postagem) | Data API `videos.insert` | — | **Projeto não auditado → todo upload fica privado** (**verificado**, [videos.insert](https://developers.google.com/youtube/v3/docs/videos/insert)). Pedir a auditoria já, ou o Felipe publica manualmente no Studio (1 clique) | US$0 |
| **TikTok** (pessoal) | Display API `POST /v2/video/list/` (escopos `user.info.basic`, `video.list`; `user.info.stats` para seguidores) | só `view_count, like_count, comment_count, share_count` — **sem tempo assistido/retenção** (**verificado**, [video object](https://developers.tiktok.com/doc/tiktok-api-v2-video-object)) | app no TikTok for Developers + review | US$0 |
| TikTok (business) | API for Business / Accounts: `business/video/list` com `average_time_watched`, `full_video_watched_rate` (**estimativa/autodeclarado por terceiros**; a doc oficial não carregou) | retenção de verdade | exige **conta Business** + acesso ao portal Business API | US$0 |
| **Instagram** Reels | Graph API `/{media-id}/insights`: `views, reach, reels_skip_rate, ig_reels_avg_watch_time, shares, saved, follows` (**verificado**) | melhor métrica de gancho por API | conta profissional (Criador serve) + Instagram Login com `instagram_business_basic`, `instagram_business_manage_insights` | US$0 |
| Relatório | Python gera o markdown. Opcional: Claude escreve 5 linhas de leitura | — | `ANTHROPIC_API_KEY` já prevista | ~US$0,05/semana (**estimativa**) |
| Execução | GitHub Actions cron diário | — | secrets no repo | US$0 (cabe no free tier; repo público = ilimitado) |

**Custo total da coleta: US$0/mês** (+ centavos se usar o Claude no texto do relatório). Tempo do Felipe: ~30 min uma vez (criar os 3 apps e autorizar OAuth), depois 0.

### 5.3 Relatório semanal (formato)
1. Norte: views engajadas e inscritos da semana; ritmo necessário para o YPP até 31/01/2027 × ritmo atual.
2. Tabela por quadro: nº de vídeos válidos, mediana de retenção relativa, inscritos/1k, comentários/1k, compartilhamentos/1k, veredito (cortar / em observação / manter / escalar).
3. Top 3 e bottom 3 vídeos, com o gancho (1ª fala) ao lado. É daí que sai o aprendizado de roteiro.
4. Alertas: vídeo sem distribuição (<300 engajadas), uploads privados por falta de auditoria, dias sem postagem.

---

## 6. Top 5 melhorias (impacto ÷ esforço)

| # | Melhoria | Impacto | Esforço | Como fazer |
|---|---|---|---|---|
| 1 | **Gravar `quadro` + ledger `posts.csv`** | crítico: sem isso, zero análise | 20 min Claude | em `roteirista.py` → `episode["quadro"] = quadro` antes de salvar; a etapa de postagem faz append em `metrics/posts.csv` |
| 2 | **Trocar a regra de corte** pela regra da seção 3.3 (sinal ≥4 vídeos, máx. 1 corte/ciclo, decisão em D+21) | evita matar quadro bom por ruído | 5 min (editar o plano) | substituir a linha "Regra de corte" do `plano-capi-lingo.md` |
| 3 | **Coletor YouTube Analytics + Action diária** | painel sem trabalho manual | 2–3 h Claude, 15 min Felipe (OAuth) | `scripts/metricas.py` com `google-api-python-client`; secrets `YT_CLIENT_ID/SECRET/REFRESH_TOKEN`; cron `0 9 * * *` |
| 4 | **Teste com 4 quadros × rodízio balanceado, 2/dia no YouTube** | ~3× mais poder estatístico no mesmo prazo | 30 min (ajustar `GRADE` para uma lista de rodízio) | trocar o dict `GRADE` por dia da semana por uma sequência pré-gerada (quadrado latino) em `metrics/grade-ciclo1.csv` |
| 5 | **Pedir já a auditoria da YouTube API e a review do app TikTok** | desbloqueia a postagem automática; a auditoria pode levar semanas | 30 min Felipe | formulário de auditoria da YouTube API Services; TikTok for Developers → Content Posting + Display API |

---

## 7. Erro oculto
**No TikTok, a retenção por API e a monetização puxam em direções opostas.** Tempo assistido e taxa de vídeo completo só saem pela API for Business, com **conta Business**. O Creator Rewards exige **conta pessoal** e não aceita Business ([TikTok Creator Academy](https://www.tiktok.com/creator-academy/article/eligibility); rótulo: verificado via página oficial + terceiros). Se o Felipe planejar "tudo automático no TikTok", vai ter que escolher.
**Oportunidade despercebida que resolve isso:** o CRP só é alcançável com 10 mil seguidores, que não existem no teste. **Começar o TikTok como Business**, coletar retenção por API na fase de teste e **mudar para pessoal** perto dos 10 mil. Até lá, o laboratório de verdade é o YouTube (API completa e grátis), e o Instagram dá o `reels_skip_rate`, a única medida de "deslizou" exposta por API.

---

## 8. Nota do estado atual (área: dados)
**2/10.** Hoje há um plano com uma regra de corte e nenhuma métrica coletada, nenhum ID guardado e nenhum relatório.
Para virar 10: (1) chave `quadro` + ledger (2 pts); (2) coletor YouTube + Action diária (2); (3) regra de corte estatística no plano (1); (4) teste com 4 quadros balanceados e decisão em D+21 (1); (5) TikTok Display/Business e IG insights no mesmo CSV (1); (6) relatório semanal automático com ritmo do YPP (1).

**Próximo passo:** autorizar o Claude a fazer a melhoria #1 (quadro + ledger) e a #2 (reescrever a regra de corte no plano).
