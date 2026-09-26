# Produtos que vendem sozinhos via busca de marketplace (26/09/2026)

**Resultado em 1 linha:** o melhor encaixe para o Felipe é **add-on de Google Sheets para nichos brasileiros** (busca do Workspace Marketplace praticamente vazia em PT-BR), seguido de **extensão Chrome para contador/fiscal BR** (demanda provada, cobra em PIX) e **extensão Chrome global de nicho** (USD, receita verificada, mas busca já saturada).

**Transparência de coleta**
- WebFetch funcionou na maioria dos sites. **Etsy bloqueou (HTTP 403 no WebFetch e no curl)** → não consegui contar concorrentes no Etsy.
- Contagens de concorrência foram feitas por mim via `curl` em 26/09/2026:
  - **Google Workspace Marketplace:** a página de busca devolve a lista completa renderizada no servidor (validação: "mail merge" = 105 apps, "invoice" = 101).
  - **Chrome Web Store:** o servidor só devolve os **10 primeiros** resultados → "10" significa "≥10". Os números de usuários foram lidos em cada página de detalhe.
  - **Apify Store:** API pública `api.apify.com/v2/store?search=` (a busca é "fuzzy", então o total vem inflado; o dado útil é o nº de usuários dos líderes).
- **Números que vieram só de trechos de busca (página não aberta/confirmada):** RevenueCat 17,3% (2026), Freemius/WordPress 97,6%, Email Love (Figma) US$3k MRR, custo do CASA US$500–4.500, Etsy Payments no Brasil via Payoneer, TikTok Shop BR (lançado em 08/05/2025, 11× vendedores), mudança do limite de US$1M da Shopify para "vitalício" (changelog não aberto; a doc que abri ainda diz "anual").

---

## 1. Tabela comparativa

| Modelo | Exemplo real + faturamento (fonte) | Custo inicial | Tempo até 1º R$ | Automação 0–10 | Carga de suporte | Originalidade/saturação | Risco | Fit Felipe 0–10 |
|---|---|---|---|---|---|---|---|---|
| **A. Add-on Google Sheets para nicho BR** | Jaguar Sheet (Mercado Livre→Sheets): R$91/mês, 791 instalações, sem receita pública (**estimativa**: dezenas de pagantes). O mesmo dev fez o Sync2Sheets: US$9k MRR, 400+ pagantes, ~150k instalações (**autodeclarado**). Hotmart for Sheets: 3K+ instalações (listing) | ~R$0 (Apps Script) + Kiwify/Hotmart | 4–8 semanas (review do Google + OAuth) | 9 | Baixa ("superfície pequena", segundo o BudgetSheet) | **Muito baixa**: cnpj 0, receita federal 0, kiwify 0, tabela fipe 0, tesouro direto 0, nfse 0, mercado livre 1 (vs "stock price" 43, "amazon seller" 30) | Demanda baixa (busca em PT é pequena); verificação OAuth; escopo restrito → CASA pago | **8** |
| **B. Extensão Chrome p/ fiscal-contábil ou vendedor BR** | NFSe Downloader: 10.000 usuários, R$89,99/mês ou R$849,99/ano, PIX dentro da extensão (listing + site; receita **estimativa** R$9–27k/mês com 1–3% de conversão). Avantpro ML: 100.000 usuários, R$59,90/mês (receita não pública) | US$5 (conta de dev) + Stripe BR/Kiwify | 3–6 semanas | 8 | Média (portais do governo mudam, certificado digital) | **Média**: "nfs-e nacional" ≥10 extensões; "mercado livre" ≥10; mas "pgdas" 0, "certidao negativa" 0, "ecac" 2 (9 e 61 usuários), "enjoei" 0 | Portal do governo muda e quebra; suspensão na CWS (1 recurso só) | **7** |
| **C. Extensão Chrome global (USD)** | Subtitle Downloader: **US$1.397 nos últimos 30 dias**, MRR US$566, fundada em dez/2025, canal = ASO (**verificado**, Stripe/TrustMRR). Resellify (automação p/ Depop): **US$553/30d** (**verificado**). Easy Folders: US$3,7k MRR em ago/2024 (**autodeclarado**) | US$5 + ExtensionPay (5%) | 4–10 semanas | 8 | Baixa a média | **Alta**: todo nicho testado tinha ≥10 extensões (vinted, skool, whop, substack, grailed, tiktok shop seller) | Saturação; clones; política da CWS | **6** |
| D. Actors no Apify Store | Apify paga US$1,6M/mês a 4.500 devs (**doc oficial**, página de parceiros); em amostra de 829 actors de terceiros, só 35 passam de US$1k/mês e a **mediana dos lucrativos é US$14/mês** (análise independente, **estimativa**) | ~US$0 | 2–6 semanas | 9 | Média (scraper quebra; resposta em <12h virou diferencial) | Alta: "google maps" 12.985 resultados; nichos BR já ocupados (mercadolivre: líder com 1.958 usuários; cnpj: 289) | Contas da própria Apify ficam com 44% da receita dos top 900; site-alvo bloqueia | 5 |
| E. Planilha "inteligente" no Etsy | SimplyOrganizedPro: ~US$160k, 37k vendas a US$1–2,50 (**estimativa** de terceiro, template estático). Better Sheets: US$56k em 14 meses, 92% via AppSumo (**autodeclarado, vende curso**) | US$0,20/listing + taxas | 2–4 semanas | 9 | Baixa | Não medido (Etsy 403); templates de orçamento são sabidamente lotados | Preço de US$1–10 esmagado; o Apps Script assusta comprador leigo | 5 |
| F. App Shopify | Picture It: US$3,5k MRR (**autodeclarado**); RotateProduct: US$6,5k MRR em mai/2026, ~50% do crescimento via Meta Ads (**autodeclarado**) | US$19 de registro | 2–3 meses | 6 | **Alta** (lojista cobra suporte rápido) | Alta | "Built for Shopify", avaliações, suporte | 4 |

---

## 2. Detalhe por modelo

### A. Add-on Google Sheets para nicho brasileiro
- **Mecanismo:** o usuário busca no Workspace Marketplace ou no Google ("mercado livre planilha") → instala → recebe trial de 14 dias → paga fora do Google (o Marketplace não cobra nada; Stripe/Paddle/Gumroad/Kiwify). O Jaguar Sheet usa trial sem cartão e plano a partir de R$91/mês. Sincroniza por hora, sem ação humana.
- **Prova do modelo em LatAm:** Leandro Zubrezki (Argentina) chegou a US$9k MRR com Sync2Sheets usando Paddle, com MVP de 2 semanas, e agora replica o modelo para o Mercado Livre em PT-BR (Jaguar Sheet). É prova de que funciona, e também um concorrente direto em e-commerce.
- **O que o Claude Code monta na semana 1:** add-on em Apps Script (menu + sidebar + funções personalizadas `=CNPJ()`), chamada a uma API pública, gatilho por hora, verificação de licença via webhook da Kiwify/Hotmart gravado num Cloudflare Worker ou numa planilha-mestre, e o listing do Marketplace em PT.
- **90 dias (conservador):** 100–300 instalações, 2–4% de conversão → 3–10 pagantes × R$49 = **R$150–500 MRR**.
- **Risco fatal:** zero concorrente pode significar zero demanda. Mesmo sendo o único integrador de Mercado Livre, o Jaguar tem só 791 instalações. Por isso, validar a demanda antes de polir. Técnico: usar só escopos mínimos (`spreadsheets.currentonly`, `drive.file`). Escopo restrito exige auditoria CASA de US$500–4.500/ano (trecho de busca).

### B. Extensão Chrome para contador/fiscal ou vendedor BR
- **Mecanismo:** a extensão roda na sessão do próprio usuário (certificado A1/A3, e-CAC, Portal Nacional NFS-e) e automatiza o trabalho repetitivo: baixar em lote, preencher, organizar PDFs. O NFSe Downloader cobra R$89,99/mês **por PIX dentro da extensão** e tem 10.000 usuários; a busca da CWS por "nfse" entrega o cliente.
- **Semana 1:** extensão MV3 com content script no portal-alvo, fila de download, exportação para Excel, paywall com licença (Kiwify/Stripe BR), página de destino e listing em PT com palavras-chave.
- **90 dias (conservador):** 200–1.000 usuários, 1–2% pagantes × R$49–89 → **R$100–1.000 MRR**.
- **Risco fatal:** o portal do governo muda o HTML e quebra a extensão (suporte em pico). A CWS permite **um único recurso** por violação. Nada de burlar captcha.

### C. Extensão Chrome global (USD)
- **Mecanismo:** utilitário de 1 função em plataforma grande (Netflix/YouTube, Depop), com freemium e paywall via ExtensionPay (5%, Stripe) ou Dodo. O Subtitle Downloader lista ASO como canal e chegou a US$1,4k/30d em ~10 meses (verificado).
- **Semana 1:** MVP + paywall ExtensionPay + 5 idiomas no listing.
- **90 dias (conservador):** **US$0–300 MRR**. A busca da CWS está lotada: nenhum nicho testado ficou abaixo de 10 extensões.
- **Risco fatal:** um clone copia em semanas. Automação em marketplaces (Depop/Vinted/Poshmark) viola ToS e dá ban no usuário. O CheatMate (US$5.048/30d, verificado) é "cola em prova": dá dinheiro, mas é risco de política e reputação. **Não copiar.**

### D. Apify Store
- **Mecanismo:** scraper/API cobrado por evento (pay-per-event obrigatório; o aluguel mensal acaba em 01/10/2026). A página da Apify rankeia no Google ("ziprecruiter scraper"). Repasse de 80% menos custo de plataforma, pago por banco/PayPal.
- **Semana 1:** 5–10 actors de nicho.
- **90 dias:** US$0–100/mês.
- **Risco fatal:** a concentração é brutal (mediana de US$14/mês), os nichos BR já estão tomados e o site-alvo bloqueia.

### E. Planilha inteligente no Etsy
- **Mecanismo:** o SEO interno do Etsy vende o template. O ticket é de US$1–10.
- **Risco:** preço baixo, saturação que não consegui medir (403) e repasse via Payoneer no BR (trecho de busca).
- **Serve para:** ser canal secundário da mesma planilha do modelo A, e não produto principal.

### F. App Shopify
- **Por que perde:** receita boa, mas os casos vêm com ads, suporte a lojista e exigências do "Built for Shopify". Não é "vende sozinho com suporte leve".

---

## 3. Descartados e por quê
- **Apps iOS/Android:** só 17,3% dos apps novos chegam a US$1k MRR em 2 anos (RevenueCat 2026, trecho de busca). Além disso: comissão de 15–30%, review e ASO disputado.
- **Plugins WordPress:** 97,6% ganham menos de US$1k/mês (estudo antigo da Freemius, trecho de busca). É um mercado maduro e em queda.
- **Figma / Obsidian / Raycast / VS Code:** Obsidian e Raycast não têm monetização de plugin, e o VS Code não tem marketplace pago. No Figma, o único caso achado (Email Love, US$3k MRR) é autodeclarado e de nicho de design.
- **Actors Apify como carro-chefe:** a mediana é irrisória (ver D). Serve como bônus, não como aposta.
- **RapidAPI, bots de Telegram com Stars, sites de calculadora:** sem evidência de receita verificada nesta rodada. Sites de calculadora não têm descoberta via marketplace.
- **App Shopify:** suporte pesado + ads (ver F).
- **Nuvemshop App Store (BR):** a cobrança é feita pela própria Nuvemshop (doc de parceiros, trecho de busca). É promissora, mas o suporte a lojista é pesado. Fica para uma 2ª rodada.

---

## 4. Top 3 para o Felipe + impacto financeiro

| # | Modelo | 90 dias (conservador) | 12 meses (realista) | Custo/mês |
|---|---|---|---|---|
| 1 | Add-on Sheets nicho BR | R$150–500 MRR | R$1–4k MRR | ~R$0 + taxa Kiwify/Hotmart (conferir tabela atual) |
| 2 | Extensão Chrome fiscal/vendedor BR | R$100–1.000 MRR | R$2–8k MRR (benchmark: NFSe Downloader, **estimativa** R$9–27k/mês com 10k usuários) | US$5 uma vez |
| 3 | Extensão Chrome global USD | US$0–300 MRR | US$300–1,5k MRR (benchmark: Subtitle Downloader, US$566 MRR verificado em ~10 meses) | US$5 + 5% ExtensionPay |

Tudo cabe nos US$110/mês. O custo real é o tempo do Felipe para validar.

### Ideias específicas (contagem feita em 26/09/2026)

**#1 Add-on Google Sheets (Workspace Marketplace)**
1. **"Vendas Kiwify + Hotmart + Eduzz no Sheets"**: sincroniza vendas, reembolsos e comissões de afiliado por hora. Busca "kiwify" = **0 apps**; "hotmart" = 1 app (Hotmart for Sheets, 3K+ instalações, que prova a demanda). O Felipe é usuário do nicho, o que dá vantagem de produto.
2. **"CNPJ no Sheets"**: função `=CNPJ(A2;"situacao")` + enriquecimento em lote (razão social, CNAE, sócios, Simples/MEI) via API pública. Busca "cnpj" = **0**, "consulta cnpj" = **0**, "receita federal" = **0**. Na Chrome Web Store, o gerador de CPF/CNPJ tem 10.000 usuários, o que indica demanda.
3. **"TikTok Shop Brasil / Shopee Brasil no Sheets"** (modelo Jaguar, mas fora do Mercado Livre): "tiktok shop" = 0 apps BR (só genéricos); "shopee" = 6 apps, todos do Sudeste Asiático. TikTok Shop BR foi lançado em 08/05/2025, com 11× vendedores (trecho). **Risco:** o acesso à API de parceiro precisa de aprovação. Confirmar antes de construir.

**#2 Extensão Chrome BR**
1. **"PGDAS-D / DAS em lote"** para contador baixar guias e declarações de N clientes no portal do Simples: CWS "pgdas" = **0**; "simples nacional" = 9 (maior: 3.000 usuários, e é de NFS-e, não de PGDAS).
2. **"Certidões negativas em lote"** (federal, FGTS, trabalhista) com organização de PDF por CNPJ, sem burlar captcha: "certidao negativa" = **0** na CWS e 0 no Workspace.
3. **"Enjoei Turbo"** (relistar, organizar e precificar), análogo ao Resellify (US$553/30d verificado) e ao Closet Tools (US$42k/mês, autodeclarado, Poshmark): CWS "enjoei" = **0**. **Risco:** automação que viole o ToS do Enjoei. Limitar a ações assistidas.

**#3 Extensão Chrome global (USD)**
1. **Ferramenta de vendedor TikTok Shop (EUA/Reino Unido)**: "tiktok shop seller" ≥10 extensões, mas **todas com menos de 300 usuários** (16, 38, 18, 268, 51). O nicho está lotado de listings e vazio de líder.
2. **Organizador/CRM para comunidades Skool**: "skool" ≥10, maior com 2.000 usuários (downloader). Um CRM (Wingman) tem 1.000 usuários, o que mostra que existe pagante B2B.
3. **Kit de produtividade para quem vende no Kajabi**: "kajabi" = 8 extensões, a maior com 258 usuários. É B2B, com ticket maior.

**Oportunidade despercebida:** o único dev que já provou esse modelo no BR (Jaguar Sheet) é argentino e cobra R$91/mês com 791 instalações. Ou seja, a barreira não é técnica, é de nicho. Quem ocupar primeiro "kiwify", "cnpj" e "tiktok shop" no Workspace fica com a busca para si.

**Erro oculto:** "0 concorrentes" no Workspace também pode significar "0 buscas". Por isso a validação tem de ser barata: publicar o listing mínimo e medir as instalações em 30 dias antes de construir o produto completo.

**Nota da recomendação: 7/10.** Para virar 10, falta: (a) volume de busca real das palavras-chave (Google Keyword Planner ou Search Console da página de destino); (b) confirmar o acesso à API do TikTok Shop, Shopee e Kiwify; (c) 30 dias de dados de instalação de um MVP.

**Próximo passo:** escolher 1 ideia do #1 (sugiro "Vendas Kiwify + Hotmart no Sheets") para o Claude Code montar o MVP e publicar o listing nesta semana.

---

## 5. Fontes (abertas, salvo indicação)
- https://trustmrr.com/startup/subtitle-downloader.md (verificado Stripe)
- https://trustmrr.com/startup/resellify.md (verificado Stripe)
- https://trustmrr.com/startup/cheatmate.md (verificado)
- https://trustmrr.com/startup/supercharge-all-ai-x-foldermate.md (verificado; US$1.033 no total)
- https://trustmrr.com/startup/cookie-editor-chrome-extension (verificado; US$6.128 no total, inativo)
- https://trustmrr.com/llms.txt (método de verificação)
- https://extensionpay.com/articles/browser-extensions-make-money (lista de exemplos, autodeclarados)
- https://extensionpay.com/ (taxa de 5%, Stripe)
- https://www.indiehackers.com/product/easy-folders/6-months-post-launch-my-chrome-extension-has-hit-3-700-in-mrr-and-42-000-in-total-revenue--O3qs28VAnAkcJw0j--M
- https://www.founderclub.com/notion2sheets/
- https://www.starterstory.com/stories/sync2sheets-give-notion-the-superpowers-of-google-sheets
- https://superframeworks.com/blog/sync2sheets
- https://www.indiehackers.com/post/how-i-built-a-google-sheets-extension-making-1-6k-mrr-b42d845e6a (BudgetSheet, 2022, fora da janela 2024–26)
- https://workspace.google.com/marketplace/app/jaguar_sheet_mercado_livre_no_sheets/1026696630724
- https://jaguarsheet.com/pt/precos
- https://workspace.google.com/marketplace/search/{termo} (contagens próprias via curl)
- https://chromewebstore.google.com/search/{termo} e /detail/... (contagens próprias via curl)
- https://chromewebstore.google.com/detail/nfse-download-em-lote/hhjcokejmbodkmlijplclmaliakpkgdd
- https://nfsedownloader.com.br/
- https://avantpro.com.br/
- https://chromewebstore.google.com/detail/avantpro-ml/jdefnfmbnchmnjkcknaadaddgjbgephh
- https://apify.com/partners/actor-developers
- https://help.apify.com/en/articles/8684010-make-money-publishing-your-actors-on-apify-store
- https://blog.apify.com/building-98-actors-on-apify-store/
- https://dev.to/nikita_iakovlev_415524c19/i-measured-900-apify-actors-and-got-the-price-wrong-by-100x-heres-the-corrected-data-3418
- https://api.apify.com/v2/store?search={termo} (contagens próprias)
- https://www.goodreads.com/author_blog_posts/24510163-160k-in-2-years-selling-spreadsheet-templates
- https://www.indiehackers.com/post/56-000-revenue-in-14-months-making-google-sheets-661c6c8e13
- https://startupfounderstories.com/stories/lorik-morina-rotateproduct-6k-mrr-shopify-ai-videos
- https://startupfounderstories.com/stories/picture-it-shopify-app-acquisition-3500-mrr
- https://shopify.dev/docs/apps/launch/distribution/revenue-share
- https://docs.lemonsqueezy.com/help/getting-started/supported-countries (Brasil só via PayPal)
- https://developerwithacat.com/blog/052025/google-workspace-marketplace-startups-part1/
- Só trecho de busca: https://www.revenuecat.com/state-of-subscription-apps · https://freemius.com/blog/how-wordpress-plugin-developers-make-money/ · https://deepstrike.io/blog/google-casa-security-assessment-2025 · https://help.etsy.com/hc/en-us/articles/115015710408-Countries-Eligible-for-Etsy-Payments · https://newsroom.tiktok.com/tiktok-shop-cresce-102-vezes-em-seu-primeiro-ano-no-brasil?lang=pt-BR · https://shopify.dev/changelog/update-to-shopifys-app-developer-revenue-share · https://www.linkedin.com/posts/akingkiwi_in-2025-we-grew-the-email-love-figma-plugin-activity-7407125582154469376-uyJy · https://atendimento.nuvemshop.com.br/pt_BR/parceiros-tecnologicos/como-eu-recebo-pelo-uso-do-meu-aplicativo-criado-na-nuvemshop
