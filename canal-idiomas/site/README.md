# Funil CapyFala — Teste de nível

Página estática (1 arquivo: `index.html`, sem build). Link na bio de todas as redes → teste de 15 perguntas A1→B2 → resultado → WhatsApp / seguir / afiliado.

Arquivos: `index.html` · `capi.svg` (favicon, exportado de `../src/Capi.tsx`) · `fonts/` (Lilita One + Rubik, OFL, hospedadas aqui: zero requisição a terceiros) · `screens/` (prints do teste, pode apagar antes de publicar).

## Configurar (bloco `CONFIG` no topo do `<script>` em index.html)
| Campo | O que pôr |
|---|---|
| `whatsapp` | Número com DDI+DDD, só dígitos (ex.: `5511999999999`). Enquanto for `5500000000000`, o botão avisa "não configurado". |
| `redes.tiktok/youtube/instagram` | URLs dos perfis @capyfala. Vazio = ícone some. |
| `oferta.url` | Link de afiliado (Hotmart) ou produto (Kiwify). Vazio = bloco escondido. Preenchido = aparece com a etiqueta **"Publi · link de afiliado"** (CONAR). Para produto próprio troque `etiqueta` para "Produto CapyFala" e `aviso` para "". |
| `controlador` / `contatoPrivacidade` | Nome do responsável pelos dados (LGPD) e e-mail de contato. |

Perguntas: array `Q` (currículo `docs/conselho/2026-09-26/didatica-linguistica.md`). Nível = faixa mais alta acertada em sequência com ≥75% (A1 3/4, A2 3/4, B1 3/4, B2 2/3).

## Rastreio por quadro
Use no link da bio / descrição: `https://SEU-SITE/?q=pegadinha` (só `a-z 0-9 - _`, até 40 caracteres).
O `q` vai na mensagem do WhatsApp: `... deu B1 (11/15 acertos). Quero receber meu plano de estudo. [quadro: pegadinha]` → conte no WhatsApp quantos leads vieram de cada quadro.

## Publicar grátis
- **Netlify Drop (1 min):** app.netlify.com/drop → arraste a pasta `site/` → pronto (dá para trocar o subdomínio em Site settings).
- **Vercel:** vercel.com/new → "Deploy" arrastando a pasta, ou `npx vercel canal-idiomas/site`.
- **GitHub Pages:** repositório público → Settings → Pages → Source: branch `main`, pasta `/docs` ou `/` (copie o conteúdo de `site/` para lá) → URL `usuario.github.io/repo/`.

Testar local: `python3 -m http.server -d canal-idiomas/site 8000` → http://localhost:8000/?q=teste

## Privacidade (LGPD/ECA)
- Nenhum dado coletado, nenhum cookie, nenhum script de terceiros. Respostas só na memória da página.
- WhatsApp só com as 2 caixas marcadas (18+ e opt-in, ambas desmarcadas por padrão). O usuário inicia a conversa → janela de 24h grátis na Cloud API. Menor vê o resultado na tela, sem captura.
- Analytics depois: função `track()` no script (comentário indica onde plugar GoatCounter/Plausible/Cloudflare Web Analytics, que não usam cookie). Não usar Google Analytics/Meta Pixel.
