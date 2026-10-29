# YouTube: algoritmo, recursos e Data API, só fontes primárias (lidas em 29/10/2026)

Legenda: "lida 29/10" = página oficial sem data visível, lida hoje. "(terceiro)" = apoio não oficial. "não verificado" = sem fonte oficial.

## 0. ALERTAS QUE MUDAM O PLANO
- **YPP sobe em 01/02/2027 para quem ainda não entrou:** 1.000 inscritos + **8.000 h** qualificadas em 365 dias OU **20 mi** de views de Shorts em 90 dias. Quem já está no YPP não é afetado. https://support.google.com/youtube/answer/12843009 (lida 29/10)
  - Hoje vale 1.000 inscritos + 4.000 h em 12 meses OU 10 mi de views de Shorts em 90 dias, e depois há uma **revisão manual** (não entra na hora). https://support.google.com/youtube/answer/72851 (lida 29/10)
  - Consequência: as 4.000 h só servem se o canal for **aprovado** antes de 01/02. O prazo real é bater 1.000 inscritos e 4.000 h algumas semanas antes, porque a revisão leva tempo (o prazo da revisão não foi verificado).
  - Fan funding, Creator Partnerships e Shopping continuam com 500 inscritos + 3.000 h ou 3 mi de views de Shorts. https://support.google.com/youtube/answer/12843009 (lida 29/10)
  - A partir de 01/02/2027, o Shorts Creator Pool só paga a quem tiver ≥10 mi de views qualificadas em 90 dias. https://support.google.com/youtube/answer/12843009 (lida 29/10)
- **Muitos recursos pedidos exigem os "recursos avançados" (verificar identidade com documento/vídeo ou ter histórico de canal):** vídeo relacionado no Short, fixar comentário, capítulos, teste A/B, multi-idioma e links clicáveis na descrição. Miniatura personalizada e vídeos com mais de 15 min exigem os "intermediários" (verificar o telefone). Só o Felipe pode fazer isso. Caminho: Studio > Configurações > Canal > Qualificação para recursos. https://support.google.com/youtube/answer/9890437 (lida 29/10)
  - Impacto: a revisão de domingo (10–12 min) não passa dos 15 min, mas sem o telefone verificado o `thumbnails.set` dá 403 ("doesn't have permissions to upload and set custom video thumbnails"). https://developers.google.com/youtube/v3/docs/thumbnails/set (atualizada 15/10/2026)
- **Dublagem automática:** é ligada por padrão para quem é elegível. Áudio original em português gera dub em **inglês e espanhol**. Num vídeo que mistura PT e EN para ensinar, o dub pode estragar a aula. Recomendação: marcar "Revisar dubs manualmente antes de publicar" ou desligar (Studio > Configurações > Canal > Avançado). https://support.google.com/youtube/answer/15569972 e https://support.google.com/youtube/answer/6304325 (lidas 29/10)

## 1. Como o YouTube recomenda (oficial)
- Sinais de satisfação: cliques, tempo de exibição (entrou em 2012 e derrubou as views em 20%), pesquisas, compartilhamentos, likes e dislikes. https://blog.youtube/inside-youtube/on-youtubes-recommendation-system/ (Cristos Goodrow, 15/09/2021)
- "Valued watchtime" = tempo que o espectador considera valioso, medido por pesquisa de 1 a 5 estrelas (nota 1–2 pede o motivo). Um modelo prevê a resposta de quem não respondeu à pesquisa. Mesma URL (15/09/2021).
- Sinais principais hoje: histórico de exibição e de busca, inscrições, likes/dislikes, "Não tenho interesse", "Não recomendar canal" e pesquisas de satisfação ("não só tempo de exibição"). "Vídeos feitos com IA podem ser recomendados tão amplamente quanto os sem IA." https://support.google.com/youtube/answer/16089387 (lida 29/10)
- Não existe duração ideal: não encher linguiça e acompanhar a curva de retenção. Um vídeo fraco não penaliza o canal, mas o canal perde se o espectador para de assistir quando recebe a recomendação. https://support.google.com/youtube/answer/16559651 (lida 29/10)
- **Atravessar formatos é raro:** o sistema liga interesses entre Shorts, vídeo longo e posts, mas "não é um comportamento comum" o espectador mudar de formato. Experimentar formatos não confunde o algoritmo. Mesma URL (lida 29/10). Impacto: não contar com o Short alimentando o longo sozinho.
- Tags "não são importantes" (servem para erros de grafia). A localização do canal não é usada para recomendar. Likes contam "um pouco". Mudar de não listado para público não prejudica. https://support.google.com/youtube/answer/141805 (lida 29/10)
- Retorno do espectador: o objetivo do Shorts é "que voltem ao YouTube regularmente". https://support.google.com/youtube/answer/11914225 (lida 29/10)

### Shorts
- Ranking por desempenho e personalização. Sinais: o espectador escolhe assistir, ignora ou clica em "não tenho interesse"; **% que escolheu ver, duração média e % médio assistido**; depois likes e pesquisa pós-exibição. https://support.google.com/youtube/answer/11914225 (lida 29/10)
- O feed de Shorts "pode dar peso à recência". https://support.google.com/youtube/answer/16559651 (lida 29/10)
- A métrica atual do Studio é "Ficaram para assistir" (% que passou dos segundos iniciais) mais "views engajadas" (sem loops). https://support.google.com/youtube/answer/12220281 (lida 29/10). O nome antigo era "Visto vs. deslizado", da comunidade oficial de 2022: https://support.google.com/youtube/community-video/273390203 (lida 29/10). Se a métrica antiga ainda aparece com esse nome: não verificado.
- **Contagem de views de Shorts:** desde 31/03/2025, conta cada início ou repetição, sem tempo mínimo. https://developers.google.com/youtube/v3/revision_history (entrada de 26/03/2025)
- **Desde 24/08/2026, todos os formatos** (Shorts, longo e live) contam a view no 1º quadro. YPP e ganhos continuam baseados em "views engajadas" e "horas engajadas". https://support.google.com/youtube/answer/12220281 (lida 29/10) e revision_history (27/08/2026)
- Player de Shorts (25/06/2026): modo tela limpa, velocidade 2×, mudo com toque, coração no lugar do joinha, timer de Shorts que pode ir a zero. https://blog.youtube/news-and-events/youtube-shorts-experience-updates-features/ (25/06/2026)

## 2. Do Short para o vídeo longo
- **Vídeo relacionado:** em Studio > Conteúdo > Short, escolher um vídeo do próprio canal (público ou não listado). Vira um link clicável abaixo do @ do canal. **Exige recursos avançados.** https://support.google.com/youtube/answer/14075157 (lida 29/10)
- Short criado no Studio a partir de um longo (ferramenta "Clipes e Shorts") recebe o longo como vídeo relacionado automaticamente, exceto se for privado, não listado ou feito para crianças. https://support.google.com/youtube/answer/15824265 (lida 29/10)
- **Data API:** o recurso `videos` não tem campo de vídeo relacionado. Partes existentes: snippet, status, recordingDetails, localizations, brandPartner etc. https://developers.google.com/youtube/v3/docs/videos (atualizada 15/10/2026). Conclusão: só manual no Studio, ou pelo atalho da ferramenta de clipes (inferência a partir da doc, não testado).
- **Horas de Shorts NÃO contam para as 4.000 h** ("qualified watch hours from Shorts views in the Shorts Feed won't count"). https://support.google.com/youtube/answer/72851 (lida 29/10)

## 3. Recursos do canal
- **Playlist de série:** Configurações da playlist > "Definir como série oficial". Os outros vídeos da playlist passam a ser destacados e recomendados. Exige conta verificada. 1 vídeo só pode estar em 1 série. https://support.google.com/youtube/answer/6084043 (lida 29/10)
- Playlists públicas têm limite diário (inclusive via API), maior com recursos avançados. https://support.google.com/youtube/answer/57792 (lida 29/10)
- **Capítulos:** 1º marcador em 00:00, ≥3 marcadores em ordem crescente, cada capítulo com ≥10 s. Exige recursos avançados. Ficam indisponíveis com strike ativo. https://support.google.com/youtube/answer/9884579 (lida 29/10)
- **Telas finais:** últimos 5–20 s, até 4 elementos em 16:9, vídeo com ≥25 s; não existem em vídeo "feito para crianças". Link externo só no YPP. https://support.google.com/youtube/answer/6388789 (lida 29/10)
- **Cards:** até 5 por vídeo; não existem em vídeo "feito para crianças". https://support.google.com/youtube/answer/6140493 (lida 29/10)
- **Teste A/B (Test & Compare):** até 3 **títulos**, 3 miniaturas ou 3 combinações. Só no Studio desktop, só com recursos avançados, **não funciona em Shorts** nem em vídeo para crianças. O vencedor é decidido por **tempo de exibição**, não por CTR, e o teste leva até 2 semanas. Miniatura abaixo de 1280×720 é rebaixada para 480p. **Título já liberado.** https://support.google.com/youtube/answer/13861714 (lida 29/10)
- **Hype:** canais **no YPP** com 500–500.000 inscritos. **Brasil incluso** (39 países). Vale só para vídeo longo nos primeiros 7 dias; não vale para Shorts nem vídeo para crianças. https://support.google.com/youtube/answer/15509925 (lida 29/10). Para a CapyFala, só depois de entrar no YPP.
- **Posts:** a página não exige mínimo de inscritos. Não funcionam em canal "feito para crianças" nem na Alemanha. Há limite diário, maior com telefone verificado. Post de imagem pode aparecer no feed de Shorts. https://support.google.com/youtube/answer/9409631 e /9890437 (lidas 29/10)
- **Comentário fixado:** Studio > Comunidade > Fixar, 1 por vídeo (fixar outro desfaz o anterior). Exige recursos avançados. https://support.google.com/youtube/answer/9482367 e /9890437 (lidas 29/10)
- **Idioma do vídeo:** em "Idioma e certificação de legendas" define o idioma do vídeo, do título e da descrição; serve de base para legendas e para a busca. https://support.google.com/youtube/answer/6304325 (lida 29/10). Na API: `snippet.defaultLanguage` e `snippet.defaultAudioLanguage`. https://developers.google.com/youtube/v3/docs/videos (15/10/2026)
- **Áudio multi-idioma:** faixas próprias e miniaturas por idioma; exige recursos avançados. Dado oficial: canais que usam têm >25% do tempo de exibição vindo do idioma não principal. https://support.google.com/youtube/answer/13338784 (lida 29/10)
- **Hashtags:** com mais de 60, todas são ignoradas; até 3 das "mais engajadoras" aparecem junto do título. https://support.google.com/youtube/answer/6390658 (lida 29/10)
- **Melhor horário:** Studio > Análises > Público > "Quando seus espectadores estão no YouTube" (últimos 28 dias). https://support.google.com/youtube/answer/9314416 (lida 29/10)
  - O próprio YouTube diz que **o horário de publicação não tem impacto conhecido no desempenho de longo prazo** (só importa em live/estreia). https://support.google.com/youtube/answer/141805 (lida 29/10)
  - Rene Ritchie: depois de 2 a 4 semanas os vídeos "terminam no mesmo lugar" seja qual for a hora. https://blog.youtube/culture-and-trends/renes-top-five-on-youtube-april-11-2024-edition/ (11/04/2024)
- **Divulgação de IA:** animação irreal não precisa ser divulgada ("animation... in a fully animated video" consta como exemplo que não precisa). Divulgar não reduz alcance nem monetização. https://support.google.com/youtube/answer/14328491 (lida 29/10)

## 4. Data API (doc atualizada em 15/10/2026)
- **Cota (mudou em 01/06/2026):** `videos.insert` e `search.list` têm baldes próprios de **100 chamadas/dia, 1 unidade cada**. O resto divide **10.000 unidades/dia**. O "1.600 por upload" é antigo. https://developers.google.com/youtube/v3/determine_quota_cost e https://developers.google.com/youtube/v3/revision_history (01/06/2026)
- Custos de outras chamadas: `thumbnails.set` 50 · `playlistItems.insert` 50 · `captions.insert` 400 · `videos.update` 50 · `commentThreads.insert` 50. https://developers.google.com/youtube/v3/determine_quota_cost
- `thumbnails.set`: limite de arquivo subiu para 50 MB em 14/09/2026; JPEG ou PNG; 403 se o usuário não tiver permissão de miniatura personalizada. https://developers.google.com/youtube/v3/docs/thumbnails/set
- `status.selfDeclaredMadeForKids` (bool) em insert/update; `status.madeForKids` é o resultado. Desde 15/10/2026: se omitido, o campo não é sobrescrito. https://developers.google.com/youtube/v3/docs/videos e revision_history (15/10/2026)
- `status.containsSyntheticMedia` (bool) **existe** desde 30/10/2024 e vale para insert/update, mas é só para conteúdo **realista** alterado ou sintético. Animação de capivara não exige. https://developers.google.com/youtube/v3/docs/videos e revision_history (30/10/2024)
- `status.publishAt` só funciona com `privacyStatus=private` e agenda a publicação. https://developers.google.com/youtube/v3/docs/videos
- **Auditoria / privado (CONFLITO na doc oficial):**
  - Histórico (28/07/2020): vídeos enviados por projeto de API **não verificado** criado depois de 28/07/2020 "ficam restritos a privado" até passar pela auditoria. https://developers.google.com/youtube/v3/revision_history
  - A página atual do `videos.insert` (15/10/2026) diz o contrário: "Videos uploaded from unverified API projects are **not restricted** to private viewing mode". https://developers.google.com/youtube/v3/docs/videos/insert
  - Não há entrada no histórico revogando a regra de 2020. **Não verificado na prática.** Teste: subir 1 vídeo com `privacyStatus=public` (ou `publishAt`) e conferir no Studio se ficou "Privado (bloqueado)". Se ficar, pedir a auditoria (formulário de conformidade).

## 5. Frequência
- FAQ oficial: "Preciso postar todo dia ou 1×/semana? **Não**. O crescimento de views por upload não tem correlação com o intervalo entre uploads." Pausas também não têm correlação com perda de views, mas pode levar um tempo para "reaquecer" o público. https://support.google.com/youtube/answer/141805 (lida 29/10)
- Dica oficial de agenda: "uma agenda consistente e **sustentável** é crítica" para criar expectativa no público; pesar custo e tempo de cada formato contra o retorno; agendar e produzir em lote. https://support.google.com/youtube/answer/13616979 (lida 29/10)
- Rene Ritchie (Creator Liaison): canal que posta muito agrupa os uploads numa prateleira do feed de inscrições (teste de 2023), então postar mais não "empurra" mais. https://blog.youtube/culture-and-trends/renes-top-five-august-24-2023-edition/ (24/08/2023)
- Rene Ritchie: "pense em público de Shorts, não em algoritmo de Shorts". https://blog.youtube/culture-and-trends/renes-top-five-on-youtube-april-11-2024-edition/ (11/04/2024)
- (terceiro) Estudo com 53 canais não achou efeito do intervalo entre uploads na chance de viralizar. https://www.overseeros.com/blog/youtube-upload-frequency-study
