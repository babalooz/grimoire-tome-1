# Conselho 26/09/2026 — Monetização de redes (Capi Lingo)

Alvo: `docs/plano-capi-lingo.md` + estado de `canal-idiomas/` (commit b75ad3f).
Rótulos: **verificado** (página oficial lida hoje) · **terceiros** · **estimativa** (conta minha, premissas explícitas).

## Resultado
**Nota da monetização hoje: 3/10.** O motor de conteúdo está bem encaminhado. A camada de dinheiro não existe: não há funil, afiliado, produto, metadados de upload nem plano para o YPP. O plano deixa tudo o que paga para a etapa 6 ("depois"), que cai depois do fim do crédito (~05/11).

## 1. Diagnóstico em 3 linhas
1. O plano lança primeiro o público que menos paga por view: inglês para brasileiros. Shorts BR rendem ~US$0,04/mil views. O funil, que é onde está ~80% da receita possível, ficou para o fim.
2. Há uma janela real e com data: quem **entrar** no YPP até 31/01/2027 fica na régua antiga. Com 1 longo por semana, a meta de 4.000 h fica apertada.
3. O nome "Capi **Lingo**" contradiz a própria pesquisa do repo ("evitar 'lingo' no nome"). Trocar agora custa zero. Depois de criar handles e audiência, custa caro.

## Quanto isso pode render (estimativa, mês 4–6, 1 mi de views/mês somando as redes, público BR)
| Fonte | Premissa | R$/mês |
|---|---|---|
| Pool de Shorts do YouTube | US$0,04/mil (terceiros, air.io) → US$40. **A partir de 01/02/2027: zero** abaixo de 10 mi views qualificadas em 90 dias (verificado) | 0–220 |
| TikTok CRP | 300 mil views qualificadas (só vídeos ≥1 min) × US$0,27–0,42/mil (terceiros, BR) | 450–700 |
| Vídeo longo (AdSense) | 20 mil views × RPM BR R$3–10 (terceiros) | 60–200 |
| Afiliado Hotmart (curso de inglês) | 0,2% clicam → 2.000 fazem o teste de nível; 1% compra curso de ~R$1.300 com 33–50% de comissão | 1.500–2.600 |
| Produto próprio (R$27, Kiwify) | 2% dos 2.000 que fazem o teste compram | ~950 líquido |
| **Total** | | **~R$2,5–4,6 mil/mês**, sendo ~70–80% do funil |

A mesma conta com público EN (Gringo Detox): o pool de Shorts dos EUA paga ~US$0,33/mil (terceiros), 8× o do BR, e o longo de Educação ~US$10 (mediana AIR). Menos 30% de retenção sobre a receita vinda dos EUA. Afiliados: Babbel até €75/venda (verificado, programa UK), italki ≥US$10.

## 2. Top 5 melhorias (por impacto ÷ esforço)

### 1) Funil pronto no dia 1 (sai da etapa 6 e entra junto da etapa 4) — impacto: +R$1,5–3,5 mil/mês a 1 mi views · esforço: ~1 dia de Claude
Como fazer:
- **Página "Teste de nível da Capi":** HTML estático no GitHub Pages (grátis), 12 perguntas A1→C2 e resultado com o nível.
- **O que o resultado mostra:**
  - (a) botão de afiliado Hotmart de um curso de inglês. Escolher no marketplace o que tiver comissão ≥40%, ticket ≥R$197 e página de vendas boa. Existe produtor de inglês pagando 33% do líquido (terceiros: sparkenglish.com.br/en/ganhe-comissoes/).
  - (b) produto próprio de R$27 na Kiwify: "Kit Anti-Mico: 150 falsos amigos + pronúncia de marcas". O Claude gera o PDF/Anki a partir do banco de quadros já planejado.
  - (c) botão "receber meu plano de estudo no WhatsApp", via link `wa.me` com texto pré-preenchido ("Meu nível é B1").
- **Custo do WhatsApp:** como o usuário inicia a conversa, a janela de 24h é grátis. Nunca disparar mensagem de marketing iniciada pela empresa (R$0,3217/msg).
- **Rastreio:** link na bio de todas as redes + `sub_id`/UTM **por quadro**, para saber qual quadro vende.

### 2) Corrida do YPP antes de 01/02/2027 — impacto: RPM de longo liberado para sempre (a régua nova dobra para 8.000 h) · esforço: baixo (mesmo motor)
- **A regra (verificado, answer/12843009):**
  - "If you are already in YPP, your status is not impacted".
  - O que conta é **estar dentro**. A revisão leva até ~1 mês (terceiros), então a meta prática é ficar elegível até **~20/12/2026**.
- **A conta (estimativa):**
  - 4.000 h = 240 mil minutos. Um longo de 12 min com 35% de retenção dá ~4,2 min por view, ou seja, ~57 mil views de longo.
  - Com 1 longo/semana (~12 longos até 20/12) seriam necessárias ~4.800 views por vídeo. É improvável para um canal novo: chance de 15–25% (estimativa).
- **Como fazer:**
  - Longo **3×/semana** (~33 vídeos → ~1.700 views cada). Formatos: "Teste de nível completo A1–C2" (Brian Wiles fez 7,3 mi), "Prova da Semana" e "100 falsos amigos".
  - Perguntas novas em cada longo, e não só colagem dos Shorts. Evita a política de "reutilizado/inautêntico".
  - Em todo Short, ativar "vídeo relacionado" apontando para o longo da semana. É o que converte view de Short em hora de exibição.
- **O que não funciona:** as horas de Shorts não contam para as 4.000 h (verificado, answer/72851). E 10 mi views de Shorts em 90 dias é irreal para quem está começando.

### 3) Configuração de monetização no upload (etapa 4) — impacto: evita perder 24% da receita e o rebaixamento para "infantil" (RPM US$0,33) · esforço: 1 hora
- YouTube Data API:
  - `status.selfDeclaredMadeForKids=false`;
  - `snippet.categoryId=27` (Educação);
  - `snippet.defaultLanguage` / `defaultAudioLanguage=pt-BR`.
- AdSense: preencher as informações fiscais (W-8BEN) no **dia 1**. Sem elas o Google pode reter até 24% da receita **mundial**. Com elas, retém só 30% da parte vinda dos EUA (verificado, answer/10391362).
- TikTok: **conta pessoal**, porque o CRP exige conta pessoal. Toda versão TikTok com ≥61 s. Nada de dueto/stitch como conteúdo principal.

### 4) Colocar o Gringo Detox (PT para anglófonos) no teste de 14 dias, e não "depois" — impacto: 5–8× receita por view · esforço: médio (roteiro localizado + as falas em PT pela voz do Felipe)
- Só 2 quadros (Pegadinha e Nível), só YouTube + TikTok, 1 vídeo/dia. O mesmo motor, com `lang` invertido no `roteirista.py`.
- Afiliados: Babbel (via PerformCB nas Américas) e italki. Produto: "Brazilian Portuguese survival kit" a US$9–19 no Gumroad, com repasse via PayPal.
- Decidir no dia 14 com **R$ por 1.000 views**, e não com views brutas.

### 5) Relatório semanal com dinheiro, não só retenção — impacto: a regra de corte passa a otimizar receita · esforço: baixo
- Colunas por quadro: views, retenção, cliques no teste, leads no WhatsApp, vendas de afiliado e de produto, R$/1.000 views.
- Regra de corte nova: sai o quadro com pior retenção **e** o com pior R$/1.000 views. Um quadro de retenção média que vende (ex.: "Qual seu nível?") nunca sai.

## 3. Erro oculto
**O nome "Capi Lingo".**
- A pesquisa do próprio repo (`canais-conteudo-tendencias.md` §6.3) manda evitar "lingo" em nome, handle e título, por risco de trade dress do Duolingo.
- Não achei oposição do Duolingo contra marcas com "lingo" (busca sem resultado; muitos apps usam "Lingo"). Por isso o risco jurídico é **moderado, não comprovado**.
- O risco comercial é certo:
  - a marca fica "parecida com o Duolingo" num nicho em que o próprio Duolingo é o gigante;
  - o registro no INPI de uma marca com um termo tão comum tende a ser fraco;
  - patrocinadores (Babbel, Busuu, Praktika) evitam associar a marca a um "quase-Duo".
- Trocar custa zero hoje e caro depois dos handles.
- Sugestões para checar no INPI e nos handles: **Capi Fala**, **Capivara Fluente**, **Capi Talks**.

Erro menor: `episodes/002-desafio-5-niveis.json` promete "Só 3% dos brasileiros chegam no nível 5". O número foi inventado, e o próprio `roteirista.py` proíbe isso. Trocar por "Poucos chegam no nível 5" até existir dado real vindo da página de teste. A página de teste, aliás, gera esse dado.

## 4. Nota: 3/10. O que falta para 10
1. Página do teste de nível + afiliado + produto de R$27 no ar antes do 1º vídeo público (+3).
2. Cadência de longo de 3×/semana, com meta de elegibilidade ao YPP até ~20/12 (+2).
3. Metadados de upload e informações fiscais configurados (+1).
4. Receita por quadro medida no relatório semanal (+1).
5. Nome sem "Lingo" e canal EN no teste (+1 cada; somam para chegar ao 10).

## Fontes
- YPP 2027, grandfathering e pool de Shorts: https://support.google.com/youtube/answer/12843009 (verificado 26/09)
- Elegibilidade YPP (horas de Shorts não contam): https://support.google.com/youtube/answer/72851
- Retenção fiscal: https://support.google.com/youtube/answer/10391362
- RPM do CRP no Brasil (terceiros): https://www.elev8or.io/blog/tiktok-creator-rewards-rpm-2026 · https://cut.pro/en/blog/tiktok-creator-rewards-how-much-it-pays-2026
- Comissão de afiliado de inglês na Hotmart (exemplo de produtor): https://sparkenglish.com.br/en/ganhe-comissoes/ · faixas gerais (terceiros): https://ganheextra.com.br/hotmart-vale-a-pena/
- Babbel: https://uk.babbel.com/babbel-partner-program (via pesquisa do repo)
- Marcas Duolingo (sem oposição a "lingo" encontrada): https://trademarks.justia.com/887/18/n-88718551.html
- RPM de Shorts por país e nicho: pesquisas em `docs/pesquisas/2026-09-26-*.md` (AIR/air.io)

**Próximo passo:** decidir o nome (manter ou trocar "Lingo") antes de criar qualquer conta, e em seguida construir a página do teste de nível.
