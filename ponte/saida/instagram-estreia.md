# Instagram na estreia — CapyFala (preparado 11/10/2026)

Tarefa da nuvem (pedido do Felipe, 11/10): deixar o Instagram pronto para entrar na postagem automática junto com
TikTok e YouTube Shorts, pelo mesmo Buffer, **sem publicar, agendar, criar conta ou religar a fábrica**. Nada disso
foi feito. Não existe arquivo `FREIO` (continua não existindo); a fábrica segue parada pelo motivo já registrado em
`docs/plano-de-acao.md` (formato ainda não aprovado pelo Felipe).

Fontes lidas: `CLAUDE.md`, `canal-idiomas/scripts/publicar.py`, `docs/tiktok-nativo.md`,
`origin/ponte:ponte/saida/pacote-postagem-assunto1.md`, `canal-idiomas/scripts/portao.py`,
`canal-idiomas/scripts/make-cafe.sh`, os 3 JSONs do assunto 1 (`episodes/cafe-t1e01-hi-im-capy*.json`), além da
documentação oficial do Buffer e da Meta linkada na §1.

Rótulos: **verificado** (fonte primária/oficial, lida hoje) · **terceiros** (blog/imprensa, não confirmado pela
plataforma) · **estimativa** (julgamento) · **não verificado** (busquei e não encontrei confirmação oficial).

---

## 1. O que o Buffer (GraphQL) exige para publicar Reels no Instagram

### 1.1 Tipo de conta

**Verificado**, suporte oficial do Buffer: a publicação automática no Instagram só funciona com conta **Profissional
(Business OU Creator)** — conta Pessoal só recebe lembrete no celular (publicação manual). Citação: *"switch your
account to a Professional (Business or Creator) account"* para *"publish automatically"*; *"Publish posts
automatically to Instagram"* aparece como limitação de contas Pessoais.
Fonte: [Connecting your Instagram account to Buffer](https://support.buffer.com/en-us/articles/connecting-your-instagram-account-to-buffer-n9Ad6veXsu)
(consultado 11/10/2026) e [Scheduling Instagram posts, Reels, Stories and notifications](https://support.buffer.com/articles/scheduling-instagram-posts-reels-stories-and-notifications-3XA98S9Q5p)
(consultado 11/10/2026): *"Automatic publishing is only available for Instagram professional accounts"* (Business
ou Creator).

Um guia de terceiros (postproxy.dev, não confirmado pela Meta nem pelo Buffer) afirma que a API de Reels da Meta só
aceita conta **Business**, não Creator — **isso conflita** com o que o próprio Buffer declara. Não consegui resolver
o conflito lendo a documentação oficial da Meta (ver §1.3). Para não arriscar, a recomendação é **Business**, que
satisfaz os dois lados e já é o que o `docs/plano-de-acao.md` linha 9 previa desde 28/09.

### 1.2 Página do Facebook vinculada

**Verificado**, mesmo artigo do Buffer: **não é obrigatória**. *"you can still connect, publish, and see your
analytics in Insights without a Facebook Page"* — a vinculação só passa a ser exigida para 3 recursos específicos:
localização em posts, colaboradores, e música em Reels publicados automaticamente (a trilha teria que vir embutida
no próprio arquivo, que é o que já fazemos — ver §3). Conectar sem Facebook Page (login direto pelo Instagram) já
dá publicação automática em todos os planos do Buffer, inclusive o Free.

### 1.3 Campos obrigatórios do post (schema oficial do Buffer)

**Verificado**, lido direto em `developers.buffer.com/reference.html` (schema GraphQL oficial, consultado
11/10/2026) — tipo `InstagramPostMetadataInput`, usado em `PostInputMetaData.instagram`:

| Campo | Tipo | Obrigatório | Descrição oficial |
|---|---|---|---|
| `type` | `PostType!` | sim | "the channel-specific type of the post, eg, post, story, reel for Instagram" |
| `shouldShareToFeed` | `Boolean!` | sim | "indicates whether post should be shared to feed" |
| `isAiGenerated` | `Boolean` | não | "whether the post discloses AI-generated content" |
| `firstComment` | `String` | não | comentário fixado do post |
| `geolocation` | `InstagramGeolocationInput` | não | exige Facebook Page (§1.2) |
| `stickerFields` | `InstagramStickerFieldsInput` | não | só pra publicação por lembrete (celular) |

`VideoAssetInput.url` (obrigatório) é a mesma URL pública que já usamos para TikTok/YouTube (branch `midia` +
jsDelivr); `metadata.thumbnailOffset` (ms) é opcional. **O código do `publicar.py` já mandava exatamente
`type: "reel"` e `shouldShareToFeed: true`** antes desta tarefa (função `metadata()`) — bate com o schema oficial, não
precisou mudar.

### 1.4 Limites de duração/proporção/tamanho para Reels

**Verificado**, suporte oficial do Buffer ([Scheduling Instagram posts, Reels, Stories and notifications](https://support.buffer.com/articles/scheduling-instagram-posts-reels-stories-and-notifications-3XA98S9Q5p),
11/10/2026):

| Limite | Valor (Buffer) | Nosso vídeo (make-cafe.sh/portao.py) | Cabe? |
|---|---|---|---|
| Proporção | entre 4:5 e 9:16, largura máx. 1920 px | 1080×1920 = exatamente 9:16, largura 1080 px | ✅ |
| Duração | 3 s a 15 min (fora disso vira lembrete manual) | episódio 61–95 s, esquete 20–35 s (`FAIXA_CAFE`) | ✅ |
| Tamanho do arquivo | até 300 MB | não medido agora (nenhum MP4 renderizado — fábrica pausada); o próprio `publicar.py` já assume vídeos pequenos (usa jsDelivr até 20 MB, só passa para `raw.githubusercontent.com` acima disso) | ✅ por margem, mas **não medido no arquivo real** |
| Formato | sem exigência de contêiner/codec específica para Reels; a única dica do doc é exportar em MP4 + H.264 quando a miniatura falhar | MP4, H.264 (`--crf=26`, Remotion), 30 fps | ✅ |

A Meta (documentação oficial em `developers.facebook.com/docs/instagram-platform/content-publishing`, consultada
hoje) **não publica esses números na própria página** — ela só descreve os campos da chamada (`media_type=REELS`,
`video_url`, `creation_id`) e remete a um exemplo no GitHub que não consegui abrir daqui. Por isso os números acima
são do **Buffer**, não da Meta direto; terceiros divergem bastante entre si (alguns citam 4 GB/180 s, outros 300
MB/15 min) — fico com o número que o Buffer afirma sobre o próprio limite de publicação, porque é o que importa pra
nós (publicamos pelo Buffer, não direto na API da Meta).

### 1.5 Publica direto ou só manda lembrete pro celular?

**Verificado**, mesma fonte: publica **direto**, automaticamente, desde que a conta seja Profissional e o Reel
esteja dentro dos limites da tabela acima. Fora desses limites (ou com recurso que a API não aceita — música da
biblioteca do Instagram, adesivo, link na legenda, localização sem Page), o Buffer manda **lembrete no celular** em
vez de publicar — o post fica pendente até o Felipe tocar manualmente no app do Buffer. Como nosso vídeo usa só som
próprio embutido (voz + `cafe-loop.wav`, sem música da biblioteca do Instagram) e não usa adesivo/localização, ele
deve publicar automaticamente — mas isso só se confirma com um Reel real (ver `--teste-rascunho`, §2).

### 1.6 O plano Free permite?

**Verificado** por fontes convergentes (socialchamp, napoleoncat, socialbu — todas 11/10/2026, terceiros mas
concordam no número, e bate com o que o Felipe já via na própria conta): plano Free = **3 canais, 10 posts na fila
por canal**, sem restrição documentada por tipo de rede (TikTok/YouTube/Instagram todos contam como "canal"
igualmente). O recurso de publicação automática do Instagram via login direto (sem Facebook Page) está listado como
disponível **"on all plans"** no artigo de agendamento do Buffer — ou seja, **sim, o Free permite**, só consome 1
dos 3 canais (hoje: 2 de 3 usados por TikTok + YouTube; o Instagram seria o 3º e último).

### Fontes (§1)

- [Connecting your Instagram account to Buffer](https://support.buffer.com/en-us/articles/connecting-your-instagram-account-to-buffer-n9Ad6veXsu) — verificado, 11/10/2026
- [Scheduling Instagram posts, Reels, Stories and notifications](https://support.buffer.com/articles/scheduling-instagram-posts-reels-stories-and-notifications-3XA98S9Q5p) — verificado, 11/10/2026
- [developers.buffer.com — Getting Started](https://developers.buffer.com/guides/getting-started.html) · [GraphQL for REST Developers](https://developers.buffer.com/guides/graphql-intro.html) · [Posts & Scheduling](https://developers.buffer.com/guides/posts-and-scheduling.html) · [API Reference / schema](https://developers.buffer.com/reference.html) (`InstagramPostMetadataInput`, `VideoAssetInput`) — verificado, 11/10/2026
- [Meta — Instagram Platform, Content Publishing](https://developers.facebook.com/docs/instagram-platform/content-publishing) — verificado (mas sem números de limite), 11/10/2026
- Preço do plano Free (terceiros, convergente): [SocialChamp](https://www.socialchamp.com/blog/?p=44200) · [NapoleonCat](https://napoleoncat.com/blog/buffer-pricing/) · [SocialBu](https://socialbu.com/blog/buffer-pricing) — 11/10/2026
- Terceiro que conflita com o Buffer sobre tipo de conta: [postproxy.dev — Instagram Reels API Publishing Guide](https://postproxy.dev/blog/instagram-reels-api-publishing-guide/) — **não confirmado**, usado só para registrar o conflito

---

## 2. Código: `publicar.py` ganhou o Instagram como 3º canal opcional

**Antes desta tarefa**, o código já tinha boa parte da base pronta (de uma pesquisa anterior,
`docs/conselho/2026-09-26/growth-algoritmo.md`): `SERVICO`, `AI_LABEL` e `metadata()` já citavam `instagram` com
`type: "reel"` e `shouldShareToFeed: true` — confirmei na §1.3 que isso bate com o schema oficial do Buffer, sem
precisar corrigir nada aí. O que faltava, e que fiz agora:

1. **Aviso no `--listar` sem derrubar nada.** `acesso_ok()` já exigia só TikTok + YouTube (`ESPERADOS`), então o
   Instagram sempre foi opcional por baixo — mas o `--listar` não dizia nada sobre ele. Adicionei `status_instagram()`
   e uma linha extra no `--listar`: `Instagram: ainda não conectado (opcional; TikTok + YouTube seguem normal)` sem
   mudar o código de saída (que continua 0/OK baseado só nos dois canais obrigatórios).
2. **Legenda própria pro Instagram.** Antes, `textos()` só diferenciava TikTok do resto — YouTube e Instagram
   caíam no mesmo template (`"{título}\n\n{legenda}\n\n{tags}"`, pensado pro YouTube, com o título do vídeo
   repetido). Agora o Instagram tem o próprio formato (sem o prefixo "cod |" do TikTok nem o título duplicado do
   YouTube), tanto pra episódio quanto pra esquete.
3. **Nenhum ID fixo no código.** `canal_id("instagram")` já buscava o canal pelo campo `service` no JSON gerado
   pelo `--listar` (igual TikTok/YouTube) — continua assim; quando o Felipe conectar o Instagram no Buffer, o
   próximo `--listar` grava o ID dele em `config/buffer-canais.json` e o `publicar_dia()` já passa a enviar pra lá
   sem precisar tocar no código de novo (é o mesmo mecanismo genérico que já valia pra TikTok/YouTube).

**Commit em `main`:** [`45141bd`](https://github.com/babalooz/grimoire-tome-1/commit/45141bd) —
`publicar: Instagram como 3º canal opcional (legenda própria, sem ID fixo)`. Só mexi em `scripts/publicar.py` e
criei `scripts/teste_instagram.py`.

### Teste simulado (sem publicar nada), cobrindo os 2 casos pedidos

`scripts/teste_instagram.py` troca `publicar.CANAIS` por um arquivo temporário com canais inventados e chama
direto `canal_id()`/`status_instagram()`/`textos()`/`metadata()` — **nunca** chama `acesso_ok()`/`listar()` (essas
duas sempre fazem uma leitura real no Buffer, então ficariam fora de um teste 100% simulado) nem `gql()`/
`publicar_dia()` (que são as únicas funções que de fato enviam algo).

```
Caso A — Instagram NÃO conectado no Buffer:
  OK   canal_id('tiktok') resolvido
  OK   canal_id('youtube') resolvido
  OK   canal_id('instagram') é None (não conectado)
  OK   status_instagram() avisa 'ainda não conectado' sem travar
  OK   textos() não quebra montando legenda de instagram mesmo sem canal
Caso B — Instagram CONECTADO no Buffer:
  OK   canal_id('instagram') resolvido sem ID fixo no código (vem do fixture)
  OK   status_instagram() mostra 'conectado'
  OK   TikTok/YouTube continuam resolvendo junto
  OK   legenda do Instagram é diferente da do TikTok (legenda própria)
  OK   legenda do Instagram é diferente da do YouTube (legenda própria)
  OK   legenda do Instagram não tem o prefixo 'cod |' do TikTok
  OK   legenda do Instagram contém as hashtags do episódio
  OK   metadata() do Instagram usa type=reel (schema oficial InstagramPostMetadataInput)
  OK   metadata() do Instagram manda shouldShareToFeed (campo obrigatório no schema)
  OK   legenda de esquete do Instagram também é própria (diferente do TikTok)

RESULTADO: todas as checagens passaram. Nada foi publicado, agendado ou enviado à rede.
```

### `--listar` real, depois da mudança (só leitura — é o teste que as rotinas usam)

```
organização: My Organization (6a1599888465779c73b3235d)
  - tiktok     acapyfala                 6ab84f02ea19ca0bdefbf095
  - youtube    CapyFala                  6ab84ddbea19ca0bdefbd32a
ok: config/buffer-canais.json
OK: acesso OK
Instagram: ainda não conectado (opcional; TikTok + YouTube seguem normal)
```
TikTok e YouTube continuam respondendo normalmente (código de saída 0); não precisei ver nem imprimir a chave — o
proxy do ambiente injeta o `Authorization` sozinho, como o próprio script já documenta.

---

## 3. O vídeo que já produzimos serve pro Reels sem reencode?

**Sim, pelas regras do Buffer (§1.4): sim, com folga** — 1080×1920 (9:16 exato, dentro de 4:5–9:16) · 61–95 s
(dentro de 3 s–15 min) · MP4/H.264 (formato aceito). **Ressalva:** não há nenhum MP4 renderizado agora (pasta
`out/` vazia — gitignored, e a fábrica está pausada), então não medi o tamanho de arquivo de um Reel real; a conta
que dá é indireta (o próprio código já assume vídeos abaixo de 20 MB pra decidir entre jsDelivr e
raw.githubusercontent.com — bem abaixo do limite de 300 MB do Buffer). Quando o primeiro MP4 for renderizado, vale
checar `ls -la out/*.mp4` uma vez para confirmar.

### A zona segura do TikTok também protege a interface do Reels?

**Não verificado — e provavelmente não, pelo menos não igual.** O `ZONAS` do `portao.py` (coluna de botões
`x>920`, abas do topo `y<260`, legenda do app `y>1500`) vem de uma **auditoria real da interface do TikTok**, feita
pelo PC em 27/09 (`docs/tiktok-nativo.md`). Eu **não tenho** uma auditoria equivalente da interface do Reels — só
achei o guia de **zona segura para ANÚNCIOS** em Reels da própria Meta, que é um contexto diferente (anúncio tem
botão de CTA e disclaimer que o Reels orgânico não tem) e cujo próprio número é contestado entre fontes de
terceiros (14% topo / 35% rodapé / 6% laterais numa fonte; 13%/23,4% noutra) — não é o mesmo problema que a zona
segura "qual pedaço a interface cobre no feed normal do Reels".

**O que sei com razoável confiança, comparando os dois layouts por conhecimento geral de app (não medido em
pixel):** o Reels orgânico tem menos cromo no topo que o TikTok (zona de topo do TikTok, `y<260` = 13,5% da altura,
deve sobrar), a coluna de botões da direita do Reels fica um pouco mais pra baixo e mais estreita que a do TikTok
(então a zona `x>920` = 14,8% da largura do TikTok provavelmente cobre também a do Reels, com folga), mas a
**legenda/nome de usuário/música na base do Reels tende a ocupar uma faixa maior** que os 22% (`y>1500`) que o
TikTok reserva — os números de zona de anúncio (terceiros) sugerem algo em torno de 30–35% no rodapé.

**O que muda no portão, se/quando o Felipe quiser aprovar vídeo também pra Instagram:** antes de confiar na mesma
`ZONAS`, pedir uma auditoria real da interface do Reels (mesmo método usado no TikTok: screenshot real do app,
27/09) e, até isso existir, tratar a zona da legenda do Instagram como maior que a do TikTok por precaução — por
exemplo, testar o texto/selo de tela dentro de `y<1250` (68% da altura) em vez de `y<1500` (78%) só quando o vídeo
também for pro Instagram. Isso é so uma recomendação por enquanto; não toquei no `portao.py` porque é código de
aprovação automática e qualquer mudança nele merece a mesma auditoria empírica que a do TikTok teve, não uma
estimativa minha.

---

## 4. Legendas do Instagram — assunto 1 "Hi! I'm Capy." (3 vídeos × 2 variantes)

Mesma base do pacote de TikTok/YouTube (`origin/ponte:ponte/saida/pacote-postagem-assunto1.md`), com legenda
**própria** pro Instagram (não é cópia do TikTok nem do YouTube — ver §2). Nenhum gatilho proibido (sem "fluente em
X dias", método secreto, urgência inventada, "trava na hora de falar"); sem citar o app Comigo; sem cara de
anúncio; português correto. Hashtags ≤5, dentro do limite do Instagram desde dez/2025
(`docs/conselho/2026-09-26/growth-algoritmo.md`).

⚠️ **Mesmo aviso do pacote original vale aqui:** o Vídeo 2 abaixo descreve a versão que **está hoje** no JSON
(`cafe-t1e01-hi-im-capy-v2.json`, "um gringo de verdade no café" — reserva atemporal), não a versão "fila da
estreia" do roteiro v6 aprovado. Se o roteirista atualizar o JSON antes do render, revisar este texto.

### Vídeo 1 · APRENDER · "o primeiro oi da Capy" (T1 E01)
Frase-alvo: **Hi! I'm Capy.** Can-do: cumprimentar e dizer o nome.

| Variante | Legenda |
|---|---|
| **A · recomendada** | `Travei no "oi" no meu primeiro dia de trabalho num café americano. Capivara também passa vergonha. Hi! I'm Capy. 👋` |
| B | `Três palavras resolveram meu primeiro dia: Hi! I'm Capy. Como você se apresentaria? ☕` |

Hashtags: `#capyfala #capybara #inglês #aprenderingles #inglesdozero`

*Por que A:* conta o que realmente acontece no vídeo (erro real + recuperação), tem o chunk escrito e fecha com
emoji — sem prometer nada que o vídeo não entrega. B funciona como variante de pergunta/CTA pra teste A/B de
engajamento.

### Vídeo 2 · PRATICAR · "um gringo de verdade no café" (T1 E01 · parte 2/3)
Frase-alvo repetida: **Hi! I'm Capy.**

| Variante | Legenda |
|---|---|
| **A · recomendada** | `Apareceu um cliente de verdade, gringo mesmo, e foi a hora de testar o "Hi! I'm Capy" fora da aula. Rolou. 😅 parte 2/3` |
| B | `Treinei com o Hank. Usei com um turista de verdade. A frase: Hi! I'm Capy. ☕` |

Hashtags: `#capyfala #capybara #inglês #inglesdozero #morarnoseua`

*Por que A:* é a virada real do episódio (sair da bolha da aula pra vida real) e dá contexto sem precisar ter visto
o Vídeo 1; "parte 2/3" sinaliza a série sem exigir a numeração "T1 E0N" (menos natural numa legenda de Reels do que
numa lauda de TikTok).

### Vídeo 3 · FIXAR · "você ouve o H?" (T1 E01 · parte 3/3)

| Variante | Legenda |
|---|---|
| **A · recomendada** | `Treino de ouvido: "Hi" com H ou sem H? Eu também confundia. Conta aí o que você ouviu. 👂 parte 3/3` |
| B | `3 vídeos, 1 frase: Hi! I'm Capy. Hoje só escuta e repete comigo. ☕` |

Hashtags: `#capyfala #capybara #inglês #aprenderingles #inglesdozero`

*Por que A:* vira pergunta real (gatilho verdadeiro, não inventado — o exercício do vídeo É sobre reconhecer o som
do H) que convida comentário, igual ao gatilho "pergunta 3 s" já aprovado em `docs/plano-formato-cafe.md`. B reforça
a série pra quem já viu os 2 primeiros.

---

## 5. Passo a passo para o Felipe — criar @acapyfala e conectar no Buffer (~10 min)

> **Atenção:** `docs/tarefas-navegador.md` §2 está desatualizado — pede conta "de Criador" e usa a bio antiga
> ("Inglês pra quem trava na hora de falar", descartada 27/09 por ser a chamada do app Comigo). Siga o passo a
> passo abaixo, não aquele arquivo, para o Instagram.

### Passo 1 — Criar a conta
1. No celular, abra o app do Instagram e toque em **criar nova conta** (ou, se já tiver uma pessoal e não quiser
   misturar, crie uma do zero — recomendo conta nova, só para o CapyFala).
2. Usuário: **`acapyfala`** (mesmo handle do TikTok). Nome de exibição: **CapyFala**.
3. Você vai ver a tela de perfil vazio, com a engrenagem de **Configurações** no canto.

### Passo 2 — Virar conta profissional (Business)
1. Toque em **Configurações e privacidade** → desça até **Tipo de conta e ferramentas** (ou "Conta") →
   **Mudar para conta profissional**.
2. O app vai perguntar a categoria — escolha algo como **"Criador de conteúdo"** ou **"Educação"** na tela de
   categoria (a categoria em si não trava automação; é só exibida no perfil).
3. Quando perguntar **Criador ou Empresa (Business)**, escolha **Empresa/Business**. (O suporte do próprio Buffer
   aceita os dois para publicação automática, mas um guia técnico separado só confirma a API de Reels da Meta para
   contas Business — Business cobre as duas exigências sem risco, ver §1.1.)
4. Ele vai pedir um contato (e-mail ou telefone) — pode usar o mesmo e-mail do canal. Pular "conectar com Facebook"
   se aparecer nessa etapa (não precisa de Página do Facebook — ver §1.2); se insistir, procure a opção "pular" ou
   "fazer isso depois".

### Passo 3 — Preencher foto e bio
1. Toque em **Editar perfil**.
2. **Foto do perfil:** envie o arquivo `docs/arte/perfil-800.png` deste repositório (baixe do GitHub, branch
   `main`, se não estiver no seu computador/celular).
3. **Nome:** `CapyFala`.
4. **Bio** (proposta em `CLAUDE.md`, ainda não testada em produção — pode ajustar se quiser):
   ```
   O café mais confuso dos EUA ☕
   1 frase de inglês por dia com a Capy 🐹
   ```
5. Salve.

### Passo 4 — Conectar no Buffer
1. No computador, acesse **buffer.com** e entre na conta que já tem TikTok e YouTube conectados (plano Free, 2 de
   3 canais usados).
2. Vá em **Channels** (ou "Canais") → **Connect Channel** → escolha **Instagram**.
3. Vai aparecer uma escolha entre "Personal" e "Professional" — escolha **Professional** → **"Connect to
   Instagram"** (login direto, sem precisar de Página do Facebook).
4. Você verá a tela de login do Instagram (ou já estará logado) — entre com a conta `@acapyfala` criada no Passo 1.
5. O Instagram vai mostrar uma lista de permissões para o Buffer — **marque todas** e toque em **Permitir/Allow**.
6. Volta pro Buffer: a tela deve mostrar "Instagram conectado" com o `@acapyfala` na lista de canais (3 de 3 usados
   no plano Free).

### Passo 5 — Avisar a nuvem
Quando terminar, me avise (aqui mesmo ou no próximo `AVISOS.md`) que o Instagram está conectado. Na próxima vez que
a rotina rodar `publicar.py --listar`, ele vai aparecer automaticamente na lista (sem eu precisar mudar nada no
código) e a legenda própria da §4 (ou a que o roteirista gerar depois para os próximos assuntos) já sai pronta.
**A postagem automática em si continua esperando sua aprovação do formato/protótipo** (regra do CLAUDE.md,
27/09) — conectar o canal não liga a fábrica.

---

## 6. O que fica para depois (fora do pedido de hoje)

- `config/grade.json` continua desatualizado (grade do teste antigo "Duas faixas"), como já registrado no pacote
  de 11/10 anterior — a grade de 3 vídeos/assunto da §2.3 daquele pacote ainda não foi convertida pro formato de
  máquina. Não toquei nisso agora (mesma razão de antes: depende de decisão de formato/cortes que não é desta
  tarefa).
- Auditoria real da zona segura do Reels (§3) — precisa de screenshot do app, como a do TikTok em 27/09; é tarefa
  do PC/Felipe, não da nuvem.
- Medir o tamanho de arquivo de um MP4 real assim que a fábrica renderizar o primeiro vídeo (§3).
