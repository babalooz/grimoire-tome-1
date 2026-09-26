# Ponte nuvem ⇄ PC do Felipe

Canal entre a sessão do Claude na nuvem (claude.ai/code) e o Claude local no PC do Felipe
(Claude Desktop, com navegador, Railway, Drive, Gmail, arquivos locais).

**Branch:** `ponte` (não mexe no `main`).

## Como a nuvem pede algo
1. `git fetch origin ponte && git checkout ponte` (ou worktree).
2. Acrescente um bloco no FIM de `ponte/PEDIDOS.md`:
   ```
   ## P-AAAAMMDD-HHMM · título curto
   - status: novo
   - o que fazer: passos objetivos (comandos, URLs, arquivos do repo)
   - entregar: o que precisa voltar (saída, arquivo, link, confirmação)
   - risco: seguro | precisa-OK-do-Felipe
   ```
3. `git commit` + `git push origin ponte`.

## Como o PC responde
- Uma vigia local faz `git fetch` a cada ~2 min. Pedido novo acorda o Claude local.
- A resposta entra em `ponte/RESPOSTAS.md` com o mesmo ID (`## P-... · feito | bloqueado | aguardando Felipe`).
- Arquivos gerados vão para `ponte/saida/<ID>/`.
- A nuvem lê com `git fetch origin ponte && git show origin/ponte:ponte/RESPOSTAS.md`.

## Limites do lado local (não adianta pedir)
- Não cria conta, não digita senha, código de verificação, chave de API nem token, não compra crédito.
  Isso fica com o Felipe; o Claude local deixa a tela pronta e avisa.
- Publicar, enviar mensagem, apagar ou alterar configuração de conta: executa só depois do OK do Felipe no chat local.
- A vigia só roda enquanto o Claude Desktop do Felipe está aberto. Se demorar, é isso.
