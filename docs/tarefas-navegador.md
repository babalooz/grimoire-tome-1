# Tarefas de navegador — para o Claude no PC do Felipe (Claude in Chrome)

> Cole no Claude do seu computador: **"Faça as tarefas de docs/tarefas-navegador.md do repo grimoire-tome-1."**
> Regras: o Felipe faz login e digita códigos/senhas; o agente nunca pede nem guarda senha. Pare e pergunte antes de publicar
> algo público ou apagar qualquer coisa.

Arquivos de marca: `docs/arte/perfil-800.png` (foto de perfil) e `docs/arte/banner-youtube-2560x1440.png` (banner).
Baixe do GitHub (branch main) se não estiverem no PC.

## 1. YouTube (canal existente "fpazini") — studio.youtube.com → Personalização
- [ ] Antes de tudo: liste os vídeos públicos antigos e pergunte ao Felipe se deve torná-los **privados** (não apagar).
- [ ] Informações básicas → **Nome:** `CapyFala`
- [ ] **Identificador:** `acapyfala`
- [ ] **Descrição:**
  ```
  Aprenda inglês com a Capy, uma capivara brasileira tentando sobreviver nos EUA. 🇧🇷➡️🇺🇸
  Um erro real por episódio, a frase certa e muita vergonha alheia. Episódio novo todo dia!
  📝 Descubra seu nível de inglês grátis: (link do teste — em breve)
  ```
- [ ] Branding → **Foto:** perfil-800.png · **Banner:** banner-youtube-2560x1440.png
- [ ] Configurações → Canal → Configurações avançadas → **Público: "Não, o canal não é conteúdo para crianças"**
- [ ] Configurações → Padrões de upload → Categoria **Educação**, idioma **Português**
- [ ] Verificar telefone: youtube.com/verify (Felipe digita o código)

## 2. Instagram — criar @acapyfala
- [ ] Criar conta **@acapyfala**, nome **CapyFala**, foto perfil-800.png
- [ ] Mudar para **conta de criador** (Configurações → Tipo de conta)
- [ ] Bio:
  ```
  🐹 Capy, capivara brasileira nos EUA
  Inglês de verdade, um mico por dia 🇧🇷➡️🇺🇸
  👇 Teste seu nível grátis
  ```

## 3. TikTok @acapyfala (já existe) — editar perfil
- [ ] Nome **CapyFala**, foto perfil-800.png, bio igual à do Instagram
- [ ] Confirmar que é **conta pessoal** (não Business) — exigência do programa de criadores

## 4. Buffer — buffer.com (plano Free)
- [ ] Criar conta e conectar **YouTube (CapyFala), TikTok e Instagram**
- [ ] Em Settings → API/Developers: gerar **token de acesso** e entregar ao Felipe para salvar nas variáveis do ambiente
  do Claude Code na nuvem como `BUFFER_TOKEN` (não colar no chat)

## 5. Anthropic — console.anthropic.com
- [ ] Criar chave de API "capyfala-roteirista", colocar ~US$10 de crédito
- [ ] Felipe salva nas variáveis do ambiente da nuvem como `ANTHROPIC_API_KEY` (não colar no chat)

Ao terminar: mande para a sessão da nuvem "tarefas de navegador concluídas" + o que ficou pendente.
