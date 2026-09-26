# Conselho Capi Lingo: growth e algoritmo (26/09/2026)

Especialista: `growth-algoritmo`. Alvo: `docs/plano-capi-lingo.md` e o pipeline em `canal-idiomas/`.
Rótulos: **verificado** (documento oficial lido hoje) · **autodeclarado** (plataforma ou executivo disse) · **estimativa** (blog, ferramenta ou terceiro) · **inferência** (li no código ou calculei).

---

## Resultado

- **Postagem:** hoje o pipeline, sozinho, **não consegue publicar nada em público**. A API do YouTube e a do TikTok deixam privado todo vídeo enviado por projeto sem auditoria. A saída é publicar pelo **Buffer**, que é parceiro oficial das 3 redes e tem API inclusive no plano grátis. Custa US$0 no Free ou US$15/mês no Essentials (3 canais).
- **Metadados:** o roteirista gera 1 título e 1 lista de hashtags iguais para tudo. Precisa gerar **um bloco `publish` por plataforma**: título com a palavra-chave no começo, legenda, hashtags, comentário fixado, capa e horário. A especificação está na seção 4.
- **Vídeo:** 3 defeitos no render tiram alcance:
  - o gancho **não aparece no frame 0**;
  - a legenda fica **embaixo da interface** do TikTok e do Reels;
  - o episódio 002 tem **48,6 s**, longo demais para Short e curto demais para o CRP do TikTok.
- **90 dias:** começam no 1º post (alvo 26/10/2026) e vão até 23/01/2027, antes da régua nova do YPP (01/02/2027). São 3 fases:
  - 1–30: descobrir os formatos que funcionam, 1 post por dia em cada rede;
  - 31–60: dobrar os vencedores, com TikTok 2x/dia e Trial Reels;
  - 61–90: funil para o vídeo longo e empurrão para o YPP.
- **Nota da distribuição hoje: 2/10.** Ainda não existe nenhuma peça de distribuição. O motor de conteúdo está bem encaminhado.

---

## 1. Diagnóstico (3 linhas)

1. **O conteúdo tem boa base.** Tem quadros variados, radar de demanda e revisão por um "professor nativo" na IA. Mas **a distribuição não existe**: faltam contas, metadados por rede, horários, regras de comentário, métricas e uma postagem que funcione.
2. **O plano parte de um fato errado.** Ele supõe que a YouTube Data API publica em público e que só o TikTok exige auditoria. **Os dois travam em privado** (verificado). Sem isso resolvido, "Felipe só aprova" e o GitHub Actions diário não funcionam.
3. **O render ignora 3 sinais que os algoritmos medem.** O 1º frame fica vazio, o texto fica fora da zona segura e a duração cai na faixa morta de 41–60 s. O que o Felipe acha que é "o formato não pegou" pode ser defeito de distribuição.

---

## 2. Plano de distribuição: 90 dias

**Premissas:**
- D1 = 1º post público. O alvo é segunda, 26/10/2026, pela etapa 5 do plano, e D90 cai em 23/01/2027.
- A marca, o público (inglês para brasileiros) e o conteúdo são os mesmos nas 3 redes. **Cada rede recebe o arquivo limpo e nativo**, nunca um vídeo baixado de outra.
- Tempo do Felipe: no máximo 20 min/dia, sendo 10 para aprovar a fila e 10 para responder comentários na 1ª hora.

### D-14 a D0: preparação (1 vez, cerca de 2 h do Felipe)

| # | Ação | Por quê | Rótulo |
|---|---|---|---|
| 1 | **Mesmo @ nas 3 redes e no domínio.** Decidir agora entre `capilingo` e um nome sem "lingo" (ver alerta na seção 6). O vídeo hoje traz a marca d'água `@capi.english`, que é diferente | Busca por nome, cross-promoção e credibilidade | inferência |
| 2 | **TikTok: conta pessoal**, não comercial | O CRP exige conta pessoal | verificado ([termos CRP BR](https://www.tiktok.com/legal/page/global/tiktok-creator-rewards-program-br/en)) |
| 3 | **Instagram: conta de criador** (profissional) | É o que libera a API de publicação, os Insights e os Trial Reels | verificado ([Graph API / trial_params](https://postproxy.dev/blog/instagram-reels-api-publishing-guide/), terceiros confirmam o campo) |
| 4 | **YouTube:** verificar o telefone para liberar os recursos avançados | Sem isso não dá para usar o "Vídeo relacionado" no Short, que é o link Short → longo | verificado ([YouTube Help 14075157](https://support.google.com/youtube/answer/14075157)) |
| 5 | **YouTube:** marcar o público do canal como "não é conta para crianças". Na API, mandar `selfDeclaredMadeForKids=false` em todo upload | Conteúdo infantil tem RPM mediano de US$0,33 e perde recursos | verificado ([videos resource](https://developers.google.com/youtube/v3/docs/videos); [9528076](https://support.google.com/youtube/answer/9528076)) |
| 6 | **Buffer:** conectar as 3 contas e gerar a chave de API | É a postagem pública sem auditoria própria | verificado ([preços](https://buffer.com/pricing), [API](https://support.buffer.com/article/859-does-buffer-have-an-api)) |
| 7 | **Estoque de 14 episódios renderizados antes do D1** | O algoritmo premia constância. 1 dia sem post é pior que 1 post médio | estimativa |
| 8 | **Criar as séries:** playlist no YouTube e Série/Playlist no TikTok, uma por quadro ("Nível da Capi #001…") | Série numerada gera maratona e replay (Detona "Teste de Intuição \| 01") | verificado na pesquisa de campeões |

### Fase 1, D1–D30: descobrir quais formatos funcionam

- **Cadência:** 1 Short por dia em cada rede, seguindo a grade do plano (Seg Nível · Ter Você sabia · Qua Capi errou · Qui BR vs Nativo · Sex Hype · Sáb rodízio).
- **Longo:** 1 por semana no domingo, a partir do D7, "Prova da Semana", 10–15 min, só no YouTube.
- **Duração:** **só a versão curta de 25–40 s nas 3 redes.** A versão ≥61 s só serve para o CRP, que exige 10 mil seguidores. No mês 1 a meta é a taxa de conclusão, não a elegibilidade.
- **Mesmo vídeo, mesmo dia, 3 redes.** Os horários estão na seção 3. Sem marca d'água de outra rede.
- **Comentários:**
  - O comentário fixado é gerado pelo pipeline (seção 4).
  - O Felipe responde **todo comentário na 1ª hora**, cerca de 10 min.
  - No TikTok, responder 1 comentário por dia **em vídeo**, direto no app: é conteúdo extra de graça.
- **Loop "Capi errou" (quarta):** o vídeo termina sem resposta ("resposta amanhã"). A quinta abre com "ontem 73% de vocês acharam o erro". **Esse número precisa vir dos comentários reais**, nunca inventado.
- **Corte no D14 e no D28:** tirar os 3 quadros com pior retenção (regra do plano) usando a tabela da seção 5.
- **Meta do D30** (estimativa conservadora, a partir da faixa de 90 dias da pesquisa de canais): 300–1.500 seguidores somados e 1 vídeo acima de 20 mil views em alguma rede.

### Fase 2, D31–D60: dobrar os vencedores

- **TikTok passa para 2 posts por dia**, no modelo TriviawithIbiza "2 quizzes everyday", verificado na pesquisa:
  - post A: o quadro do dia;
  - post B: a **versão de 61–75 s do quadro vencedor** da fase 1, com mais níveis.
  - Assim já se acumula histórico ≥1 min para o CRP quando chegar a 10 mil seguidores.
- **Instagram: Trial Reels via API.**
  - O Reel do dia sai normal.
  - O quadro vencedor ganha **uma 2ª versão com outro gancho** (só a 1ª cena muda), publicada como Trial com `graduation_strategy=SS_PERFORMANCE`.
  - Ela só vai para não seguidores e o Instagram promove sozinho se performar. É um teste A/B de gancho de graça. Verificado que o campo existe na Graph API (fontes de terceiros que implementam; confirmar na doc da Meta ao codar).
- **YouTube:**
  - todo Short ganha como "Vídeo relacionado" o longo da semana. É manual no Studio, cerca de 1 min por Short;
  - o título do longo é testado no "Testar e comparar".
- **Colabs e stitches:** 2 por semana, cerca de 10 min cada, feitos no app.
  - Stitch de vídeos virais de "erro de inglês" com a Capi corrigindo.
  - Post em collab no Instagram com 1 criador pequeno de intercâmbio ou viagem.
  - Stitch e dueto **não contam para o CRP** (verificado, termos BR), então isso é só para crescer.
- **Hype:** o radar marca 1 assunto de futebol, BBB ou novela por semana para postar **no mesmo dia** em que ele sobe no Trends. Hype de ontem não serve.
- **Meta do D60** (estimativa): 1.500–6.000 seguidores somados.

### Fase 3, D61–D90: funil e YPP

- Continua 1/dia no YouTube e no Instagram e 2/dia no TikTok.
- **Longo semanal com 12–15 min e capítulos.** Conta para as 4.000 h do YPP.
  - A régua antiga do YPP vale até 31/01/2027 (verificado, pesquisa de canais).
  - Conta: 4.000 h = 240 mil minutos. Com cerca de 5 min de retenção média, são **~48 mil views de longo**, em 12 meses.
  - Realista só se 1 longo estourar (estimativa).
  - **Não distorcer o plano por isso**: é um bônus.
- **Link na bio:** trocar para o teste de nível (funil WhatsApp da etapa 6) assim que ele existir.
  - Links em descrição e comentário de Short **não são clicáveis** desde ago/2023 (verificado, [YouTube Help 13748639](https://support.google.com/youtube/answer/13748639)).
  - O CTA falado deve ser "link no perfil" e, no YouTube, "vídeo relacionado aqui embaixo".
- **Decisão no D90:**
  - se o melhor quadro passa de 60% de assistidos (sem deslizar) e alguma rede passa de 5 mil seguidores, **clonar o pipeline para Adiós Portuñol**, porque o código é o mesmo;
  - se não passa, trocar o ângulo, não o idioma.
- **Meta do D90** (estimativa conservadora; a pesquisa de canais dá 5–50 mil seguidores somados): 5–15 mil seguidores somados e 0,5–3 mi de views.

---

## 3. Horários (BRT)

Não achei estudo público com dados auditados para Brasil + educação. Os blogs de 2026 convergem em **almoço (12–14h) e noite (19–22h)**, e no Reels também **manhã (7–9h)**. Tudo isso é **estimativa** ([Stone](https://conteudo.stone.com.br/melhores-horarios-para-postar-no-tiktok/), [Metricool](https://metricool.com/best-time-post-tiktok/), [cut.pro Reels BR](https://cut.pro/en/blog/best-time-to-post-reels-brazil)).

| Rede | Seg–Sex | Sáb–Dom | Por quê |
|---|---|---|---|
| TikTok (post A) | **19:07** | **12:07** | Pico da noite. Minuto quebrado para fugir da fila das horas cheias (estimativa) |
| TikTok (post B, a partir do D31) | **12:37** | **18:37** | 2º pico, ~6 h de distância do A |
| YouTube Shorts | **12:10** | **10:10** | O Short tem cauda longa de busca e depende menos da 1ª hora (inferência) |
| Instagram Reels | **18:40** | **11:40** | Início da noite |
| YouTube longo | — | **Dom 10:00** | Janela de fim de semana para vídeo longo (estimativa) |

**Regra de ajuste:**
- No D15 e no D45, o pipeline troca o horário se a aba "seguidores ativos" (TikTok e Instagram) mostrar outro pico.
- O relatório semanal compara as views nas primeiras 6 h por horário.
- Os horários ficam em `config/horarios.json`, não no código.

---

## 4. O que o pipeline deve gerar por plataforma

### 4.1 Novo bloco no JSON do episódio (`roteirista.py`, schema `EPISODE`)

Hoje o schema tem só `title` (≤60) e `hashtags`, os mesmos para tudo. Proposta:

```json
"publish": {
  "keyword": "como se diz eu tenho 20 anos em inglês",
  "series": "Nível da Capi",
  "series_number": 12,
  "pinned_comment": "Placar honesto: quantas de 5? Eu (Capi) errei a 4 no começo 😅",
  "youtube": {
    "title": "Como se diz \"eu tenho 20 anos\" em inglês? Nível 1→5 #12",
    "description": "Teste de 5 níveis: idade, falsos amigos, 'I agree', 'actually' e o famoso 'if I were'.\nComenta teu placar 👇\n\n#inglês #aprenderinglês #quizdeinglês",
    "tags": ["inglês", "aprender inglês", "quiz de inglês", "falsos cognatos", "teste de nível inglês"],
    "playlist": "Nível da Capi",
    "defaultLanguage": "pt-BR", "defaultAudioLanguage": "pt-BR",
    "selfDeclaredMadeForKids": false, "containsSyntheticMedia": false
  },
  "tiktok": {
    "caption": "Como se diz \"eu tenho 20 anos\" em inglês? Só chega no nível 5 quem não cai no \"actually\" 😳 Comenta teu placar #inglês #quizdeinglês #inglêsparabrasileiros #falsoscognatos #capilingo",
    "cover_timestamp_ms": 0, "is_aigc": false,
    "disable_duet": false, "disable_stitch": false
  },
  "instagram": {
    "caption": "Nível 1→5 de inglês: até onde você chega? 😳\nComenta teu placar 👇\n#inglês #aprenderinglês #quizdeinglês #falsoscognatos #capilingo",
    "trial": false, "share_to_feed": true
  },
  "slots": {"youtube": "12:10", "tiktok": "19:07", "instagram": "18:40"}
}
```

### 4.2 Regras que o prompt do roteirista deve seguir

| Campo | YouTube Shorts | TikTok | Instagram Reels |
|---|---|---|---|
| **Palavra-chave** | Sai do radar (`pairs.en-para-brasileiros[].query`), com a frase exata que as pessoas buscam | igual | igual |
| **Título / 1ª linha** | Até 60 caracteres, **palavra-chave nos primeiros 40**, número da série no fim. Limite técnico 100 (verificado) | A 1ª frase da legenda é a palavra-chave em linguagem natural. Limite de 2.200 caracteres (verificado); usar ≤150 | 1ª linha é o gancho (≤125 caracteres aparecem antes do "mais", estimativa) |
| **Legenda** | 2–3 linhas de descrição com palavras-chave secundárias. Sem link (não é clicável no Short) | Gancho + pergunta que provoca comentário | Gancho + pergunta. Sem link |
| **Hashtags** | **3** no fim da descrição, porque só 3 aparecem e mais de 60 anula todas (verificado, [6390658](https://support.google.com/youtube/answer/6390658)). Não precisa de #shorts (inferência: o vertical de até 3 min já é Short) | **3–5**: 1 ampla (#inglês) + 1 de subnicho (#inglêsparabrasileiros) + 1 de formato (#quizdeinglês) + 1 de tema + #marca. Sem #fyp, porque não achei evidência de efeito | **Máx. 5**, porque o Instagram ignora o excesso desde dez/2025 (verificado/autodeclarado, [Social Media Today](https://www.socialmediatoday.com/news/instagram-implements-new-limits-on-hashtag-use/808309/)) |
| **Texto na tela** | A palavra-chave aparece na cena `hook` **e é falada nos 5 primeiros segundos** | igual. O TikTok indexa texto na tela e fala (estimativa, [Metricool](https://metricool.com/tiktok-seo/)) | igual |
| **Comentário fixado** | Gerado pelo pipeline e fixado na mão ou via `commentThreads` (a API não fixa) | Fixar no app | Primeiro comentário (o Buffer Essentials agenda o "primeiro comentário") |
| **Capa** | 1º frame = card do gancho | `video_cover_timestamp_ms` = 0 (verificado, campo da Direct Post API) | 1º frame |
| **Rótulo de IA** | `containsSyntheticMedia=false`, porque animação irreal não precisa (verificado) | `is_aigc=false` para desenho. **Rever se a voz da Capi ficar indistinguível de humana** | Nenhum |
| **Duração** | 25–40 s | 25–40 s (fase 1). 61–75 s no post B (fase 2+) | 25–40 s |

**Proibido no prompt** (em complemento às REGRAS atuais):
- porcentagem sem fonte;
- "link na descrição" em Short;
- a mesma hashtag de tema 2 dias seguidos;
- título igual ao de um episódio dos últimos 30 dias.

### 4.3 Correções no render (`src/Episode.tsx`), todas baratas

| Problema (inferência, li o código) | Correção |
|---|---|
| O `Pop` começa em escala 0: **no frame 0 o título do gancho está invisível**. O 1º frame é a capa e é o que decide a deslizada | Cena `hook` sem animação de entrada: título 100% visível no frame 0 e fala começando em ≤0,2 s |
| `Caption` fica em `bottom: 260` e a marca d'água em `bottom: 90`, **dentro da faixa que a legenda e os botões do TikTok e do Reels cobrem**. Guias de terceiros indicam ~20% de baixo e ~12% da direita como área insegura (estimativa) | Legenda entre y≈1150 e 1400 (de 1920). Marca d'água no topo, à esquerda. Nada importante a menos de 130 px da borda direita |
| `LevelBar` em `top: 70`, embaixo das abas "Seguindo / Para você" do TikTok | `top: 200` |
| O episódio 002 tem **48,6 s** (calculado com o `timings.json`): fora da faixa de 25–40 s e abaixo dos 61 s do CRP | Criar um **portão de duração no `make.sh`**: se o curto passar de 42 s, reprovar e pedir menos falas; o longo precisa de ≥61 s |
| O CTA final dura cerca de 5 s ("Quantas você acertou? Comenta aí… volta e tenta de novo") | CTA ≤2,5 s. A última imagem deve encaixar com a 1ª, para o replay parecer contínuo (loop) |

### 4.4 Novo `scripts/publicar.py` (substitui "YouTube Data API + TikTok API" do plano)

1. Lê `episodes/<id>.json` → bloco `publish` + `out/<id>.mp4`.
2. Envia o mp4 para uma URL pública temporária. O Buffer recebe mídia por URL (confirmar na doc da API ao codar). Opção grátis: release do GitHub ou bucket R2 no plano free.
3. Chama a **API do Buffer**: 1 post por canal, com legenda e horário (`slots`) próprios de cada rede.
4. O Felipe aprova no app do Buffer (fila) → publica em público nas 3 redes.
5. **Plano:** Free (3 canais × 10 posts na fila) basta na fase 1, com a fila reabastecida 1x por semana. Na fase 2 o TikTok passa de 10 por semana, então Essentials a US$5/canal = **US$15/mês** (verificado, [buffer.com/pricing](https://buffer.com/pricing)).
6. **Impacto:** US$15/mês economiza cerca de 21 uploads manuais × 4 min = ~1,4 h/semana do Felipe (~6 h/mês). Cabe no orçamento (US$10–40 recorrentes do plano + 15 = US$25–55).

A auditoria própria nas APIs do YouTube e do TikTok continua como plano B, em paralelo e sem pressa (leva semanas, estimativa).

---

## 5. Métricas e regra de corte por rede (relatório semanal automático)

| Rede | Métrica principal | Corte (10 vídeos seguidos do mesmo quadro) | Fonte dos dados |
|---|---|---|---|
| YouTube Shorts | "Assistido vs. deslizado" + % médio assistido | Assistido abaixo de 50% (regra da pesquisa de campeões) | YouTube Analytics API (grátis) |
| TikTok | Tempo médio assistido ÷ duração + % que assistiu inteiro | Abaixo de 40% de vídeo completo (estimativa, ajustar com os próprios dados no D14) | Display API (views/likes/comments/shares); retenção no app, 5 min/semana |
| Instagram | Tempo médio assistido + compartilhamentos + salvamentos | Compartilhamento + salvamento abaixo de 1% das views (estimativa) | Insights da Graph API |

O relatório (etapa 8 do plano) junta tudo **por quadro, não por vídeo**, porque a regra de corte é por quadro.

---

## 6. Top 5 melhorias (impacto ÷ esforço)

| # | Melhoria | Impacto | Esforço | Como fazer |
|---|---|---|---|---|
| 1 | **Postar via API do Buffer** | Destrava 100% da distribuição automática | 1 dia (Claude) + 15 min (Felipe conecta as contas) | Seção 4.4. Felipe cria a conta Buffer Free e conecta TikTok (pessoal), YouTube e Instagram (criador); Claude escreve `publicar.py` |
| 2 | **Bloco `publish` por plataforma no roteirista**, com palavra-chave do radar | Busca + CTR + comentário. Tudo sai pronto | 2–3 h | Seção 4.1/4.2: estender o `EPISODE` schema e o prompt, e a revisão do "professor" também valida o limite de caracteres e as hashtags |
| 3 | **Frame 0 + zonas seguras + portão de duração** | Menos deslizada no 1º segundo; legenda legível | 2 h | Seção 4.3 (`Episode.tsx`, `make.sh`) |
| 4 | **Motor de comentários**: comentário fixado gerado + loop "Capi errou → resposta amanhã" com número real | Comentário é sinal forte nas 3 redes e vira pauta de graça | 3 h | O roteirista lê os top comentários do YouTube (`commentThreads.list`, 1 unidade de cota) do vídeo de quarta e escreve o gancho da quinta. TikTok e Instagram ficam manuais (10 min/dia) |
| 5 | **Trial Reels A/B de gancho + TikTok 2x/dia com a versão ≥61 s** a partir do D31 | Testa gancho sem queimar seguidores; prepara o CRP | 3 h | Flag `instagram.trial=true` + render de variante só da cena hook; `make.sh --long` gera a versão de 61–75 s |

---

## 7. Erro oculto

**O plano diz "YouTube Data API + TikTok Content Posting API (publicação pública só após auditoria)" como se só o TikTok travasse. Os dois travam.**
- YouTube: *"All videos uploaded via the videos.insert endpoint from unverified API projects created after 28 July 2020 will be restricted to private viewing mode"* (verificado, [videos.insert](https://developers.google.com/youtube/v3/docs/videos/insert)).
- TikTok: *"All content posted by unaudited clients will be restricted to private viewing mode"* (verificado, [Content Posting API](https://developers.tiktok.com/doc/content-posting-api-get-started)).

Se isso não for tratado agora, a etapa 4 (sem 3) termina com um pipeline "pronto" que sobe tudo em privado. O teste de 14 dias (etapa 5) começaria atrasado ou com upload manual, e o crédito de US$250 acaba em ~05/11. **Solução: Buffer (seção 4.4).**

**Dois alertas menores:**
- O episódio 002 abre com **"Só 3% dos brasileiros chegam no nível 5"**. É um número inventado, que viola a regra do próprio roteirista e o que diz a pesquisa. Apagar antes de publicar qualquer coisa.
- A marca **"Capi Lingo"** contém "lingo". A pesquisa (`...canais-conteudo-tendencias.md`, seção 6.3) mandou evitar "lingo" no nome e no @ por causa do Duolingo. Não é problema de algoritmo, mas trocar o @ depois de 10 mil seguidores custa caro. **Decidir antes do D-14.**

## 8. Oportunidade que ninguém está usando

O radar já descobre **as frases exatas que o brasileiro digita** ("como se fala … em inglês") e mede se o topo da busca é velho. Nenhum concorrente da pesquisa usa isso em título de Short. A pesquisa mostra que os Shorts dos professores fazem 2–54 mil views e que nenhum tem título de busca, mas isso é inferência pelos títulos. Usar a query do radar como `keyword` (título + texto na tela + fala nos 5 primeiros segundos) põe a Capi na **busca**, que é tráfego que não depende de viralizar e se acumula por meses.

## 9. Nota

**Distribuição hoje: 2/10.** Para chegar a 10 faltam:
1. postagem pública automática (Buffer);
2. bloco `publish` por rede;
3. frame 0, zona segura e portão de duração;
4. motor de comentários;
5. relatório semanal por quadro com corte automático;
6. o @ definido e reservado nas 3 redes;
7. 14 episódios em estoque antes do D1.

Os itens 1–3 levam a nota a 6.

**Próximo passo:** Felipe decide o @ definitivo (com ou sem "lingo") e cria a conta Buffer Free com as 3 redes. Eu escrevo `publicar.py` + o bloco `publish`.

---

## Fontes

- YouTube `videos.insert` (privado sem verificação): https://developers.google.com/youtube/v3/docs/videos/insert
- YouTube cotas (bucket de upload de 100/dia): https://developers.google.com/youtube/v3/determine_quota_cost
- YouTube recurso `videos` (madeForKids, containsSyntheticMedia, limites de título): https://developers.google.com/youtube/v3/docs/videos
- YouTube hashtags: https://support.google.com/youtube/answer/6390658
- YouTube vídeo relacionado em Shorts: https://support.google.com/youtube/answer/14075157
- YouTube links em Shorts: https://support.google.com/youtube/answer/13748639 · https://www.tubefilter.com/2023/08/10/youtube-shorts-comments-spam/
- YouTube conteúdo para crianças: https://support.google.com/youtube/answer/9528076
- TikTok Content Posting API (auditoria): https://developers.tiktok.com/doc/content-posting-api-get-started
- TikTok Direct Post (campos, 6 req/min): https://developers.tiktok.com/doc/content-posting-api-reference-direct-post
- TikTok CRP Brasil: https://www.tiktok.com/legal/page/global/tiktok-creator-rewards-program-br/en
- Instagram 5 hashtags: https://www.socialmediatoday.com/news/instagram-implements-new-limits-on-hashtag-use/808309/
- Instagram Trial Reels via API (terceiros): https://postproxy.dev/blog/instagram-reels-api-publishing-guide/ · https://www.ayrshare.com/docs/apis/post/social-networks/instagram
- Instagram, logo próprio ok / de outras apps não: https://www.socialmediatoday.com/news/instagram-clarifies-including-your-own-logo-on-a-reel-is-ok/730852/
- Buffer preços e API: https://buffer.com/pricing · https://support.buffer.com/article/859-does-buffer-have-an-api · https://buffer.com/resources/best-social-media-apis/
- SEO TikTok (estimativa): https://metricool.com/tiktok-seo/
- Horários BR (estimativa): https://conteudo.stone.com.br/melhores-horarios-para-postar-no-tiktok/ · https://metricool.com/best-time-post-tiktok/ · https://cut.pro/en/blog/best-time-to-post-reels-brazil
- Pesquisas internas: `docs/pesquisas/2026-09-26-campeoes-shorts-quiz-idiomas.md`, `docs/pesquisas/2026-09-26-canais-conteudo-tendencias.md`
