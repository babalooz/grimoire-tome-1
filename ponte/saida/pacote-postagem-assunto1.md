# Pacote de postagem · Assunto 1 "Hi! I'm Capy." · CapyFala

Preparado em 11/10/2026 pela rotina da nuvem, a pedido do Felipe: deixar tudo pronto para que, no dia em que ele
aprovar o protótipo, a postagem automática seja só religar. **Nada foi publicado, agendado, renderizado ou
sintetizado nesta tarefa.** A rotina de produção (render/TTS/portão/publicação) continua PAUSADA — o bloqueio é o de
`docs/plano-de-acao.md` linha 91 ("formato novo ainda não aprovado pelo Felipe"); não existe arquivo `FREIO` (não
existia antes, não foi criado agora).

Fontes lidas: `CLAUDE.md`, `docs/plano-de-acao.md`, `docs/tiktok-nativo.md`, `docs/plano-formato-cafe.md`,
`docs/grade-t1.md`, `canal-idiomas/scripts/publicar.py`, `canal-idiomas/scripts/portao.py`,
`canal-idiomas/calendario.json`, `canal-idiomas/radar/2026-10-11.md`, `canal-idiomas/config/grade.json`, os 3 JSONs
do assunto 1 (`canal-idiomas/episodes/cafe-t1e01-hi-im-capy*.json`) e o roteiro aprovado
`origin/ponte:ponte/saida/roteiros-tema01.md` (v6, aprovado por Felipe).

---

## 1. Texto do post — 3 vídeos × 2 redes × 2 variantes

Base: roteiro aprovado v6 (não o texto do protótipo antigo). Nenhum gatilho proibido (sem "fluente em X dias",
método secreto, urgência inventada, promessa de episódio inexistente, "trava na hora de falar"); sem citar o app
Comigo; sem cara de criança. Contagem de caracteres verificada por script (abaixo de cada bloco).

### Vídeo 1 · APRENDER · "o primeiro 'oi' da Capy" (T1 E01)
Frase-alvo: **Hi! I'm Capy.** Can-do: cumprimentar e dizer o nome.

**TikTok — legenda (até ~150 caracteres úteis) + hashtags**

| Variante | Texto | Caracteres |
|---|---|---|
| **A · recomendada** | `como se apresentar em inglês sem travar (eu travei no 1º dia). hi! i'm capy 👋` | 77 |
| B | `você já sabe essa. sério: hi! i'm capy. dia 1 da capy nos eua ☕` | 63 |

Hashtags (ambas): `#capyfala #capybara #inglês #aprenderingles #inglesdozero`

*Por que A:* segue a fórmula de busca do TikTok (`docs/tiktok-nativo.md` §6) — a frase de busca
("como se apresentar em inglês") vem primeiro, o chunk em inglês aparece escrito, 1 emoji no fim, sem hashtag no
meio do texto. B reaproveita o gancho verdadeiro do roteiro ("você já sabe essa. sério.") e serve como variante de
teste A/B de abertura.

**YouTube Shorts — título (≤60 car., palavra-chave no início) + descrição + hashtags**

| Variante | Título | Caracteres |
|---|---|---|
| **A · recomendada** | `Como se apresentar em inglês sem travar \| CapyFala` | 50 |
| B | `Hi! I'm Capy — seu 1º oi em inglês \| T1 E01` | 43 |

Descrição curta: `Consigo cumprimentar alguém e dizer meu nome em inglês, de um jeito simples. Hi! I'm Capy. T1 E01 · CapyFala.`
Hashtags: `#capyfala #inglês #inglesdozero`

*Por que A:* "como se apresentar em inglês" é o termo de busca que o vídeo responde; "inglês do zero" e
"inglês para iniciantes" medem 38.360 e 50.008 buscas/mês no Brasil (vidIQ, 11/10/2026 — ver §2), então a família de
busca "como se apresentar/dizer X em inglês" tem demanda real para ancorar o título.

### Vídeo 2 · PRATICAR · storytelling (T1 E01 · parte 2/3)
Frase-alvo repetida: **Hi! I'm Capy.**

⚠️ **Aviso antes de usar este texto:** o roteiro aprovado v6 (`ponte/saida/roteiros-tema01.md`) reescreveu o V2 como
"a fila da estreia" (hype anglófono — Street Fighter, Poppy, fã guaxinim Rick). Mas o JSON que existe hoje
(`cafe-t1e01-hi-im-capy-v2.json`) ainda tem a versão **anterior** ("reserva atemporal"): um turista avulso entra no
café, sem Poppy e sem a cena da fila. Os textos abaixo descrevem a versão que **está no JSON agora** (a que vai
renderizar se nada mudar). Se o roteirista atualizar o JSON para a versão v6 antes do render, estes textos precisam
ser revistos — ver §5.

**TikTok — legenda + hashtags**

| Variante | Texto | Caracteres |
|---|---|---|
| **A · recomendada** | `o que fazer quando um gringo se apresenta pra você (aconteceu hoje no café). hi! i'm capy 👋` | 91 |
| B | `um turista de verdade entrou no café e eu tive que responder em inglês na hora ☕` | 80 |

Hashtags (ambas): `#capyfala #capybara #inglês #inglesdozero #morarnoseua`

*Por que A:* pergunta real ("o que fazer quando...") puxa comentário e é frase de busca plausível; mantém o
chunk escrito e 1 emoji no fim.

**YouTube Shorts — título + descrição + hashtags**

| Variante | Título | Caracteres |
|---|---|---|
| **A · recomendada** | `Inglês do zero: um gringo de verdade no café` | 44 |
| B | `Hi! I'm Capy pra um gringo de verdade` | 37 |

Descrição curta: `Um turista de verdade entra no café e a Capy usa o "Hi! I'm Capy" na vida real. T1 E01 · parte 2/3 · CapyFala.`
Hashtags: `#capyfala #inglês #inglesdozero`

*Por que A:* abre com "inglês do zero", termo medido em 38.360 buscas/mês no Brasil (vidIQ, 11/10/2026).

### Vídeo 3 · FIXAR · "ouviu? agora é você" (T1 E01 · parte 3/3)

**TikTok — legenda + hashtags**

| Variante | Texto | Caracteres |
|---|---|---|
| **A · recomendada** | `como saber se tem H ou não em inglês (treina o ouvido comigo). hi! i'm capy 👂` | 77 |
| B | `3 vídeos, 1 frase: hi! i'm capy. hoje só treino de ouvido e repetição ☕` | 71 |

Hashtags (ambas): `#capyfala #capybara #inglês #aprenderingles #inglesdozero`

*Por que A:* "como saber se tem H" é a dúvida real do exercício (reconhecer o /h/) e funciona como busca; B é mais
forte para quem já viu os 2 primeiros (reforça a série "3 vídeos, 1 frase").

**YouTube Shorts — título + descrição + hashtags**

| Variante | Título | Caracteres |
|---|---|---|
| **A · recomendada** | `Inglês do zero: você ouve o H? \| CapyFala` | 41 |
| B | `Hi! I'm Capy — agora é você \| T1 E01` | 37 |

Descrição curta: `Treine o ouvido e repita com a Capy: "Hi! I'm Capy", agora com o seu nome. T1 E01 · parte 3/3 · CapyFala.`
Hashtags: `#capyfala #inglês #inglesdozero`

*Por que A:* mesma lógica do V2 — abre com "inglês do zero" (keyword medida).

---

## 2. Hashtags e horários por dado (pesquisa de 11/10/2026)

**Rótulos:** verificado (fonte primária/oficial) · terceiros (blog, não confirmado pela plataforma) · estimativa
(julgamento) · **não medido** (busquei e não achei número).

### 2.1 Hashtags

| Termo | Onde medi | Número | Fonte · data |
|---|---|---|---|
| "inglês para iniciantes" | YouTube, busca BR | **50.008** buscas/mês (volume no país) | vidIQ (`vidiq_keyword_research`, country_search BR), consultado 11/10/2026 — **terceiros** (ferramenta paga, não é o Google oficial) |
| "inglês do zero" | YouTube, busca BR | **38.360** buscas/mês | idem, 11/10/2026 |
| "aprender inglês" | YouTube, busca BR | **28.587–75.997** (varia entre os 2 modos do vidIQ; usar 28.587 como mais conservador) | idem, 11/10/2026 |
| "curso de inglês" | YouTube, busca BR | **54.666** buscas/mês | idem, 11/10/2026 |
| `#aprenderingles`, `#inglesparainiciantes` (TikTok) | TikTok | **não medido** — não achei nenhuma fonte com contagem de visualizações por hashtag no TikTok; o único número que apareceu foi contagem de **posts no Instagram** (≈528 mil em `#aprenderingles`), que não serve de proxy para o TikTok | busca na web, 11/10/2026 — ver fontes no rodapé |
| `#capybara` rende ~2,2× `#cat` por vídeo | TikTok | já registrado em `docs/tiktok-nativo.md` §0.3 | terceiros, citado no doc existente (não remedido agora) |
| Nº ideal de hashtags por post | TikTok | **3 a 5** (consenso de vários blogs de marketing 2026; TikTok não publica um número oficial) | terceiros, 11/10/2026 |

**Conclusão prática:** não existe fonte que meça volume de hashtag de inglês no TikTok Brasil (nem a API pública do
TikTok nem ferramentas de terceiros trazem isso). O vidIQ mede demanda de busca no **YouTube**, que uso como proxy
de interesse pelo tema (não é o mesmo algoritmo do TikTok, mas confirma que "inglês para iniciantes" e "inglês do
zero" têm demanda real no Brasil) — por isso entraram nos títulos do YouTube Shorts acima. Mantenho a fórmula de
hashtags já decidida em `docs/tiktok-nativo.md` §6 (`#capyfala` + `#capybara` + `#inglês` + 1 de busca + 1 de
nível/tema), por falta de dado melhor específico de hashtag no TikTok.

### 2.2 Horários

| Rede | O que as fontes dizem (BRT) | Fonte · data | Rótulo |
|---|---|---|---|
| TikTok Brasil, geral | picos divergem entre fontes: 16h–21h (ter/qua/qui) · 19h–22h dias de semana · 14h–16h | Loggi, JivoChat, TimeToPost, Tokportal — todas 2026 | terceiros, divergente |
| TikTok, nicho educação | sem hora específica; só "melhores dias: segunda e quinta" | guia genérico (não BR), 2026 | terceiros, dado fraco |
| TikTok Brasil, faixa 25–44 anos | **não medido** — não achei horário de pico por faixa de idade no Brasil; achei só % de usuários por idade (Start.io, 2026: 25–34 = 17,5%, 35–44 = 5,9%, sem metodologia clara) | Start.io, Opinion Box mar/2026 | terceiros, fraco |
| YouTube Shorts Brasil | 12h–15h e 19h–22h (ClickAnalytic) · sexta 15h–16h (Elementor) · 20h–meia-noite (TimeToPost BR) | 3 fontes, 2026 | terceiros, divergente |

**Conclusão prática:** nenhuma fonte nova bate martelo melhor do que a grade já decidida em `docs/grade-t1.md` /
`docs/plano-de-acao.md` §2 (TikTok principal 19:07 seg–sex / 12:07 sáb–dom; YouTube Shorts 12:10), que também veio de
fontes genéricas (`docs/conselho/2026-09-26/growth-algoritmo.md` §3, mesma classe de fonte: Stone, Metricool,
Cut.pro). A pesquisa de hoje **confirma a mesma janela** (tarde/início de noite) sem justificar mudança. Mantenho os
horários já aprovados; a forma correta de melhorar isso é o teste real com o TikTok/YouTube Analytics da própria
conta (como o `docs/plano-de-acao.md` já prevê no D15/D45), não mais pesquisa de blog.

### 2.3 Grade proposta da primeira semana

Só o assunto 1 está pronto (3 vídeos). Sigo a "Ordem de publicação sugerida" do próprio roteiro aprovado (Dia 1 / Dia
2 / Dia 4 — Dia 3 fica livre, a última volta fica espaçada). **Dia 1 = dia em que Felipe aprovar o protótipo e a
rotina publicar de fato** (não travei uma data de calendário, porque não sei quando isso vai acontecer); os horários
exatos dependem do dia da semana que cair:

| Dia relativo | Vídeo | TikTok (seg–sex 19:07 · sáb–dom 12:07) | YouTube Shorts (12:10) | Instagram |
|---|---|---|---|---|
| Dia 1 | V1 · APRENDER | ✅ | ✅ | não conectado no Buffer ainda (ver §3) |
| Dia 2 | V2 · PRATICAR | ✅ | ✅ | idem |
| Dia 3 | (nada — vazio de propósito) | — | — | — |
| Dia 4 | V3 · FIXAR | ✅ | ✅ | idem |

Cortes curtos (C1–C5) e a compilação de domingo **não entram** nesta grade: nenhum dos 3 JSONs tem o campo
`esquetes` preenchido ainda (confirmei lendo os 3 arquivos); são parte do mecanismo de reaproveitamento do
`docs/grade-t1.md`/`docs/tiktok-nativo.md` §7 ainda não implementada neste assunto. Ver gap em §5.

---

## 3. Fila do Buffer — teste de acesso e checklist do `publicar.py`

**Teste de acesso (só leitura):** `python3 canal-idiomas/scripts/publicar.py --listar` → **OK, código de saída 0**.
Os dois canais respondem: TikTok `acapyfala` (`6ab84f02ea19ca0bdefbf095`) e YouTube `CapyFala`
(`6ab84ddbea19ca0bdefbd32a`). Instagram **não está conectado** no Buffer (não aparece na lista de canais).

**Checklist pedido (só lendo o código, sem rodar nada que publique):**

| Item | Resultado | Onde |
|---|---|---|
| Agenda com data/hora | **sim** | `publicar.py` linhas 293–294 (monta `due` a partir de `p["hora"]` em BRT) e linha 311 (`dueAt` no `createPost`) |
| Manda legenda diferente por rede | **sim** | `textos()`, linha 239: o TikTok usa `f"{cod} \| {legenda.lower()} {tags}"`; YouTube/Instagram usam o template com título+legenda+tags em várias linhas |
| Manda título do YouTube | **sim** | `metadata()`, linha 248: `{"youtube": {"title": t["titulo"], ...}}` |
| Liga o rótulo de conteúdo gerado por IA no TikTok | **sim** | linha 47: `AI_LABEL = {"tiktok": True, ...}` + linha 251: `{"tiktok": {"isAiGenerated": AI_LABEL["tiktok"]}}` |
| Grava em `publicados.csv` | **sim** | função `registrar()`, linhas 265–272 (só roda depois de um post aceito pelo Buffer, nunca em `--dry-run`) |

**Os 5 itens pedidos já existem no código.** Mas, testando com `--dry-run` (sem publicar nada) para o dia 2026-10-12
pela grade atual, achei **2 bugs reais** que eu não esperava achar e já corrigi (comentado no código, com teste
sem publicação, e enviado para `main`):

1. **`episodios()` ignorava todo o formato aprovado.** A função só lia `episodes/licao-*.json` (o formato antigo
   "lição de app", abandonado por decisão do Felipe em 27/09) e nunca olhava para `episodes/cafe-*.json` (o formato
   "Sitcom do Café", o único aprovado hoje). Resultado: pedir o episódio "T1 E01" devolvia
   `licao-s01e01-hi-hello.json` (texto e título do formato abandonado) em vez de
   `cafe-t1e01-hi-im-capy.json` (o V1 do assunto 1). Se a fábrica fosse religada sem esse conserto, ela teria
   publicado com o texto errado (ou caído na fila por "episódio não encontrado" conforme o caso). **Corrigido:**
   agora lê `licao-*` e depois `cafe-*`, então o formato aprovado vence em caso de colisão de código de série.
2. **Título do YouTube duplicava o código.** `textos()` montava o título como `f"{cod} · {ep['title']}"`, mas o
   campo `title` dos episódios "cafe" já vem com o código embutido (ex.: `"T1 E01 · o primeiro \"oi\" da Capy"`),
   então o título final saía `"T1 E01 · T1 E01 · o primeiro..."`. O formato "licao" não tem esse prefixo, então o
   bug só aparecia no formato novo (por isso não tinha sido visto: o bug 1 impedia o formato novo de ser lido).
   **Corrigido:** só adiciona o prefixo se o título ainda não começar com o código.

Teste feito (nenhuma publicação real, confirmado pelo próprio `--dry-run`): antes do conserto, `--dry-run` para
2026-10-12 mostrava `licao-s01e01-hi-hello.mp4` e título duplicado; depois, mostra `cafe-t1e01-hi-im-capy.mp4` com
título correto (`"T1 E01 · o primeiro \"oi\" da Capy ☕"`). Em ambos os casos nada foi publicado — faltam o MP4
(não renderizado, como deveria estar agora) e a aprovação do portão, então tudo cai em `fila/` com o motivo, como o
próprio script já faz.

**Commit em `main`:** [`029074a`](https://github.com/babalooz/grimoire-tome-1/commit/029074a4fc30992a6a26211e8bac1e4497252e09)
— `fix(publicar): ler episódios formato cafe e evitar título duplicado`. Só mexi em `scripts/publicar.py`
(+ `config/buffer-canais.json`, atualizado automaticamente pelo `--listar`, sem segredo).

---

## 4. O que só o Felipe pode fazer

1. **Aprovar o protótipo/formato** (o bloqueio atual, `docs/plano-de-acao.md` linha 91). Isso é o que libera render,
   TTS e portão — eu não tenho esse gatilho e não devo religar nada.
2. **Decidir a versão do Vídeo 2** antes do render: a que está no JSON hoje ("turista avulso", reserva atemporal) ou
   reescrever para a versão v6 do roteiro aprovado ("fila da estreia" com Poppy/hype anglófono) — ver aviso em §1 e
   gap em §5. É decisão de roteiro/elenco, que o CLAUDE.md reserva para o Felipe.
3. **W-8BEN no AdSense + categoria "Educação" no YouTube** (`docs/plano-de-acao.md` fase 3, item 19, prazo 12/10 —
   não verifiquei se já foi feito; precisa de login, então é tarefa do PC/Felipe, não da nuvem).
4. **Conectar o Instagram no Buffer**, se quiser essa rede na estreia (hoje só TikTok e YouTube aparecem no
   `--listar`); senão a grade da semana 1 fica só com as 2 redes conectadas.
5. **Comentário fixado no TikTok**: a API do Buffer não fixa comentário (`docs/tiktok-nativo.md` §7), então isso é
   manual, pelo app, depois de cada post — só se o Felipe quiser gastar esses minutos.
6. **3 Shorts antigos de futebol do canal "Felipe Pazini"**: tornar privados (`CLAUDE.md`, ainda pendente).
7. Qualquer login, senha, código de verificação ou 2FA — a regra da ponte proíbe a nuvem de fazer isso.

---

## 5. Gaps conhecidos (não corrigidos agora — fora do pedido de hoje ou exigem decisão do Felipe)

- **`config/grade.json` está desatualizado.** Ainda é a grade do teste antigo "Duas faixas" (1 episódio/dia, código
  `T1 E02`...`T1 E14` que não existem como arquivo `cafe-*`), não a grade de 3 vídeos por assunto do
  `docs/grade-t1.md`. Isso já está anotado como dependência pendente no próprio `docs/grade-t1.md` §"Dependências"
  item 2. Não toquei nele porque também depende do item abaixo (cortes) e de uma decisão de formato que ainda não é
  minha para tomar hoje; a grade da §2.3 deste documento é a proposta em texto, não o arquivo de máquina.
- **Cortes C1–C5 (campo `esquetes`) não existem em nenhum dos 3 JSONs do assunto 1.** Mecanismo de corte já existe
  no motor (`CafeEsquete`), só falta marcar os trechos nos roteiros — tarefa do roteirista, não desta tarefa.
- **Vídeo 2: JSON desalinhado com o roteiro v6 aprovado** (detalhe em §1). Preciso que o roteirista confirme qual
  versão vai ao ar antes do render, e ajuste os textos de post se for a versão "fila da estreia".
- **`cafe-t1e01-can-i-get.json` ainda usa o código "T1 E01"**, o mesmo do V1 do assunto 1 — colisão de código
  dentro do próprio formato "cafe" (não só entre "cafe" e "licao"). O conserto de hoje faz o V1 do assunto 1 vencer
  (processado depois, por ordem alfabética), mas o arquivo antigo continua com o código errado até ser renomeado
  para "T1 E11" como o `docs/plano-formato-cafe.md` já prevê.
- **Bloco `tiktok` nativo (gancho/legenda/hashtags próprios por vídeo, `docs/tiktok-nativo.md` §7) não está
  implementado em nenhum JSON.** Hoje o TikTok receberia o mesmo corte/gancho do Short, o que viola a "regra-mãe" do
  doc. Os textos de legenda do §1 deste pacote já são escritos no estilo nativo do TikTok (separados do YouTube),
  mas o vídeo em si seria idêntico até esse bloco ser implementado.
