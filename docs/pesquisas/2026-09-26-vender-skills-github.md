# Vender skills/plugins/automações do Claude Code pelo GitHub — 26/09/2026

> Verificado em 26/09/2026: fontes abertas via curl (páginas oficiais, TrustMRR, docs) e GitHub API (estrelas).
> Rótulos: **verificado** = TrustMRR (receita conectada via API de pagamento), doc oficial ou GitHub API ·
> **autodeclarado** = o próprio criador/plataforma afirma · **autodeclarado (vende curso)** = quem afirma lucra ensinando ·
> **estimativa** = cálculo nosso ou de terceiros · **NÃO CONFIRMADO** = fonte não abriu ou não contém o número.

## O que mudou após verificação
- **Polar NÃO paga para o Brasil** (Brasil ausente da lista de payout Stripe Connect Express). Antes: "confirmar".
- **Gumroad → Brasil: só PayPal**, em USD, taxa de 2% no saque (Brasil fora da tabela de depósito bancário).
- **GitHub Sponsors aceita Brasil** (lista oficial de regiões) — confirmado.
- **ClaudeKit caiu**: US$1.747/30d (antes US$2.546), MRR US$11; receita total US$79.792 (não "TTM US$60.843").
- **Claude Fast sumiu do TrustMRR** (página 404, fora do sitemap). O número US$2.025/30d virou NÃO CONFIRMADO.
- **ShipFast pior do que o relatado**: US$1.992/30d (antes US$3.537). Pico real ~US$135k/mês (autodeclarado), não 140k. Queda ~-98%.
- **Apify atualizou**: US$1,6M pagos no último mês a ~4.500 devs (antes 1,4M/3.000). Repasse 80% **após custos de plataforma**.
- **Ryan Doser**: agora diz US$18k+ desde fevereiro (antes "10k+").
- **SkillsMP**: 3.263.695 SKILL.md indexados (antes ">900k"). anthropics/skills: **178.527** estrelas (antes ~135k).
- **Sindre Sorhus**: os US$27k/ano são estimativa de 2020; estimativas de 2021–2024 falam em ~US$10k/mês.
- **Novo e relevante**: Meta lançou em 15/09/2026 o **WhatsApp Business Tools MCP** oficial (configuração de conta, número, templates, webhooks). Não é um agente de atendimento — é ferramenta de setup. Ver "Concorrentes".
- **Política da Anthropic**: nada proíbe serviço pago por trás do plugin, mas o diretório **barra software que executa transações financeiras** (MCP de PIX que paga não entra) e software com anúncios.

## Modelos

| Modelo | Exemplo real + faturamento (status) | Fit |
|---|---|---|
| Kit pago de skills Claude Code | ClaudeKit: US$1.747/30d, MRR US$11, total US$79.792 (Polar API) — **verificado**. Claude Fast: US$2.025/30d — **NÃO CONFIRMADO** (removido do TrustMRR). Ryan Doser (US$99, preço verificado): US$18k+ desde fev/2026 — **autodeclarado** | 5 |
| Marketplace de skills (Agensi) | Skill US$7, 89 instalações = US$436 (conta bate com repasse de 70%) — **autodeclarado pela plataforma**. Repasse 70% — **autodeclarado plataforma**. Top skills US$500–3.000/mês, mediana <US$50/mês — **autodeclarado plataforma** | 2 |
| MCP pago (MCPize, freemium) | Repasse 80% (85% p/ fundadores até 10/06/2026) — **autodeclarado plataforma**. "<5% dos servidores faturam" — **estimativa** (repetida em blogs, sem fonte primária). "US$500–5.000/mês no 1º ano" — **autodeclarado (plataforma vende o serviço)**. Smithery/mcp.so/PulseMCP não pagam dev — **autodeclarado** (dev.to) | 4 |
| Apify Store (actors/MCP) | US$1,6M pagos no último mês, ~4.500 devs, "muitos acima de US$3k" — **autodeclarado plataforma**. Média ~US$355/dev — **estimativa**. Repasse 80% após custos de infra — **verificado (doc oficial)**. Top criadores >US$10k/mês — **autodeclarado plataforma** | 5 |
| Templates n8n/Make | US$500–1.500/mês após 3–4 meses — **estimativa** (fonte não reaberta). Afiliado n8n 30% por 12 meses — **verificado (página oficial)** | 4 |
| Comunidade + agência (Nate Herk) | AI Automation Society Plus: 3.400+ membros × US$99/mês ≈ US$336k/mês bruto — **estimativa** sobre dado **autodeclarado (vende curso)**. Base: 325k membros grátis, 30M+ views | 3 |
| GPT Store | Programa de receita só por convite, só EUA, não aceita novos — **autodeclarado (FAQ OpenAI, via busca)**. "~US$0,03/conversa" — **NÃO CONFIRMADO** | 0 |
| Packs de prompts / Cursor rules | ~US$1k em 2 meses — **NÃO CONFIRMADO** (sem fonte na lista) | 1 |
| GitHub Sponsors | Caleb Porzio >US$1M acumulado (ago/2024) — **autodeclarado**. Sindre Sorhus ~US$27k/ano (2020) → ~US$10k/mês (2021–2024) — **estimativa** de terceiros | 1 |
| GitHub Marketplace | Repasse 95% (GitHub retém 5% desde 01/01/2021), pagamento só com ≥US$500 de receita no mês — **verificado (doc oficial)** | 1 |
| Open-core | Sidekiq: "mais perto de US$10M que de US$1M/ano" (2023) — **autodeclarado**. Tailwind: receita caiu ~80%, demitiu 75% da engenharia (3 pessoas), jan/2026 — **autodeclarado** (CEO, via DevClass) | 2 |
| Boilerplates | ShipFast: pico ~US$135k/mês (2023) — **autodeclarado**; ~US$20k/mês no fim de 2025 — **autodeclarado**; hoje US$1.992/30d, total US$1.271.198 — **verificado** (Stripe). Queda ~-98% do pico | 2 |
| Repo isca → agência WhatsApp PME BR | Mensal R$500–1.400 (custo total do agente p/ PME) — **autodeclarado (vende o serviço)**. Setup R$700–1.200 simples / R$1.500–3.000 intermediário / R$3.500–8.000 avançado; manutenção R$150–500/mês — **autodeclarado (vende curso)** | 9 |

## Veredito
Vender skills/loops isolados = negócio ruim, e piorou desde a primeira versão. Oferta grátis enorme
(anthropics/skills **178.527 estrelas**, SkillsMP **3,26M** SKILL.md indexados — ambos verificados).
Teto real dos melhores kits: ~US$1,7–2,5k/mês (ClaudeKit verificado US$1.747; Doser autodeclarado ~US$2,5k/mês médio), e em queda.
Nichos BR já têm MCPs grátis (fiscal/NF-e, 70 APIs públicas, PIX/NF-e LATAM, Hotmart, Kiwify, Evolution API — ver Fontes).
Anthropic não proíbe plugin ligado a serviço pago; o diretório não processa pagamento, exige conta de teste e barra
software que move dinheiro ou exibe anúncio — o bloqueio é o mercado, não a política. Esperado: US$0–300/mês.

## 3 jogadas
1. **Repo público "agente-whatsapp-pme"** (Cloud API oficial + n8n + Claude) com plugin Claude Code (`/novo-cliente`, `/deploy-vps`,
   `/relatorio-semanal`), vídeo de 90s e CTA para WhatsApp. Preço: R$1.500–2.500 setup + R$600–900/mês. 90 dias: 2–4 clientes (**estimativa**).
   Ajuste pós-verificação: `/novo-cliente` pode chamar o **MCP oficial da Meta** para criar conta/número/templates/webhook,
   em vez de reimplementar o onboarding. R$600–900/mês fica acima da faixa de "manutenção" (R$150–500) — justificar com IA + relatório.
2. **Kit open-core PT-BR na Kiwify** (R$197 ou R$47/mês) empacotando a jogada 1. 90 dias: R$2–6k bruto (**estimativa**).
3. **Actor Apify de CNPJ em lote** (US$2–5/1.000 resultados) — renda baixa, mas vira ferramenta de prospecção da agência.
   Atenção: mcp-fiscal-brasil (312★) já faz CNPJ grátis — diferencial tem que ser volume/lote + enriquecimento.

Não fazer: GPT Store, packs de prompts, GitHub Marketplace, boilerplate Next.js.

## Concorrentes do repo agente-whatsapp-pme
Estrelas via GitHub API em 26/09/2026 (**verificado**).

**Oficial Meta:** WhatsApp Business Tools MCP (anúncio 15/09/2026) — conecta Claude/Codex/Cursor à plataforma para configurar
conta, número (OTP), templates, webhooks e mensagem de teste. **Não** atende cliente final; é ferramenta de setup → complemento, não concorrente.

**Top 3 concorrentes diretos (agente de atendimento WhatsApp para PME, open source):**
1. **melgarafael/DeskcommCRM — 3.980★** (criado abr/2026). BR, CRM de vendas com agentes IA + WhatsApp, LGPD, Nuvemshop, MCP-ready.
   Usa WAHA (API não oficial) → risco de banimento; nosso diferencial é Cloud API oficial.
2. **santifer/jacobo-workflows — 166★**. 7 workflows n8n de produção (WhatsApp + voz, multi-agente). Espanhol, não é template PME.
3. **fazer-ai (BR) — agents 112★ + n8n-workflows 7★ + plugin Claude Code "fazer-ai-atendimento"**. Mesmo conceito da jogada 1
   (plugin Claude Code + packs n8n + Chatwoot). Usa Baileys (não oficial). Concorrente mais próximo em formato.

**Contexto (infra, não concorrem de frente):** Chatwoot 37.213★ · awesome-n8n-templates 25.594★ · Typebot 10.369★ ·
Evolution API 9.694★ · WAHA 7.486★ · lharries/whatsapp-mcp 6.316★ (WhatsApp pessoal, não oficial) · open-bsp-api 601★ (BSP open source na Cloud API).
MCPs comunitários da Cloud API oficial são nanicos: FredShred7/whatsapp-mcp-server 23★, delltrak/wamcp 23★, tkhattar14/whatsapp-business-mcp 3★.
Templates BR de "agente WhatsApp n8n" têm 1–25★ (ex.: JeffersonMFti/agente-dra-julia-advocacia 25★).

**Leitura:** não existe template open source **na Cloud API oficial** + n8n + Claude para PME BR com tração. Os que têm estrelas usam API não oficial.
A vaga "oficial, anti-banimento, pronto para PME" está aberta.

## Recebimento no Brasil
- GitHub Sponsors: **Brasil suportado** (banco via Stripe Connect ou fiscal host) — verificado.
- Polar: **Brasil NÃO suportado para payout** — verificado. Taxas Polar: 5% + US$0,50 no plano grátis.
- Gumroad: Brasil fora do depósito bancário → **só PayPal**, em USD, 2% por saque — verificado.
- Apify: PayPal (mín. US$20) ou transferência (mín. US$100), mensal — verificado.
- MCPize: Stripe Connect, dia 15 — autodeclarado. GitHub Marketplace: pagamento com ≥US$500/mês — verificado.
- Comprador BR: Kiwify **8,99% + R$2,49** — verificado (site oficial). Hotmart **9,9% + R$2,49**, decrescente com faturamento — verificado (site oficial).

## Fontes
Kits e marketplaces de skills
- https://trustmrr.com/startup/claudekit (US$1.747/30d, lido 26/09/2026)
- https://trustmrr.com/startup/claude-fast (404 em 26/09/2026)
- https://trustmrr.com/startup/shipfast (US$1.992/30d, lido 26/09/2026)
- https://newsletter.marclou.com/p/i-made-1-032-000-in-2025
- https://streakr.co/playbook/marc-lou
- https://skills.ryandoser.com/
- https://x.com/ryan_doser13/status/2085445795277385821
- https://www.agensi.io/learn/how-to-monetize-skill-md-skills-developer-guide-2026
- https://skillsmp.com/
- https://github.com/anthropics/skills

MCP e Apify
- https://mcpize.com/blog/make-money-with-mcp
- https://dev.to/kirothebot/the-state-of-mcp-monetization-in-2026-where-builders-actually-get-paid-34k9
- https://help.apify.com/en/articles/8684010-make-money-publishing-your-actors-on-apify-store
- https://help.apify.com/en/articles/10057167-how-developer-payouts-work
- https://apify.com/partners/actor-developers

n8n, comunidades, GPT Store
- https://n8n.io/affiliates/
- https://skoolmakers.com/creators/nate-herk/
- https://gptstorerevenueprogram.com/how-the-gpt-store-revenue-program-works-in-2026/

GitHub Sponsors, Marketplace, open-core
- https://docs.github.com/en/sponsors/getting-started-with-github-sponsors/about-github-sponsors
- https://docs.github.com/en/apps/github-marketplace/selling-your-app-on-github-marketplace/receiving-payment-for-app-purchases
- https://github.blog/news-insights/company-news/github-reduces-marketplace-transaction-fees-revamps-technology-partner-program/
- https://calebporzio.com/i-just-cracked-1-million-on-github-sponsors-heres-my-playbook
- https://news.ycombinator.com/item?id=35566768 (Sidekiq)
- https://changelog.com/posts/a-proposal-for-open-source-sustainability (Sindre, estimativa 2020)
- https://devclass.com/2026/01/08/tailwind-labs-lays-off-75-percent-of-its-engineers-thanks-to-brutal-impact-of-ai/
- https://www.indiehackers.com/post/tech/hitting-12k-mo-with-a-boilerplate-j2n9ECQvdJBw9Gvf4TKA (Supastarter US$12k/mês, não ShipFast)

Recebimento
- https://polar.sh/docs/merchant-of-record/supported-countries
- https://polar.sh/docs/merchant-of-record/fees
- https://gumroad.com/help/article/13-getting-paid
- https://kiwify.com.br/
- https://hotmart.com/pt-br
- https://www.cakto.com.br/blog/taxas-kiwify

Política Anthropic
- https://code.claude.com/docs/en/plugins/publish
- https://claude.com/docs/directory/publish
- https://support.claude.com/en/articles/13145358-anthropic-software-directory-policy
- https://github.com/anthropics/claude-plugins-official (37.048★)

MCPs brasileiros (estrelas 26/09/2026)
- https://github.com/Mcp-Brasil/mcp-brasil (1.788★, 70 APIs públicas)
- https://github.com/DeHor-Labs/mcp-fiscal-brasil (312★; URL antiga filipefrazao/… não verificável)
- https://github.com/codespar/mcp-dev-latam (271★, PIX/NF-e LATAM)
- https://github.com/IntuitivePhella/mcp-evolution-api (24★)
- https://github.com/thaleslaray/hotmart-mcp (13★)
- https://github.com/pauloFroes/mcp-kiwify (3★)
- https://github.com/rodrigo-do-carmo/mcp-nota-fiscal (1★)
- https://github.com/serversmx/mcp-evolution-api (0★)

WhatsApp: oficial e concorrentes
- https://thenewstack.io/meta-mcp-whatsapp-business-claude/
- https://techcrunch.com/2026/09/15/meta-now-lets-ai-agents-handle-the-boring-parts-of-whatsapp-business-setup/
- https://github.com/melgarafael/DeskcommCRM
- https://github.com/santifer/jacobo-workflows
- https://github.com/fazer-ai/agents
- https://github.com/fazer-ai/n8n-workflows
- https://github.com/hesreallyhim/awesome-claude-code (54.638★)

Preços de agência BR
- https://zaptrend.com.br/blog/quanto-custa-agente-ia-atendimento-whatsapp/
- https://horadecodar.com.br/quanto-cobrar-automacao-whatsapp-n8n/
