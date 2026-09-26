# Conselho 26/09/2026 — Compliance de plataformas, marca e privacidade

Alvo: `docs/plano-capi-lingo.md`. Pesquisa feita em 26/09/2026 com WebSearch/WebFetch e consultas diretas (RDAP de domínios, páginas públicas do YouTube e do TikTok).
Rótulos: **verificado** (fonte oficial ou página primária aberta), **autodeclarado** (a própria empresa diz), **terceiros** (blog/imprensa), **estimativa**.
Bloqueios: a busca de marcas do INPI (busca.inpi.gov.br) deu *connection reset*/503 e o Planalto deu 503. **Nenhuma consulta ao INPI foi feita.** Tudo sobre marca abaixo vem da web, não da base oficial.

---

## 1. Diagnóstico em 3 linhas

1. **O nome "Capi Lingo" tem conflito real em duas frentes.** Já existe o **Capilingo**, app de inglês de um desenvolvedor brasileiro (App Store), com perfis @capilingo no TikTok e no Instagram, canal no YouTube e o domínio capilingo.com registrado em 23/05/2026. Além disso, a CAMBI Gestão de Idiomas vende o **"Teste de Proficiência CAPI®"**, um teste de nível A1–C2 que cobre inclusive **português para estrangeiros**, que é exatamente o seu quadro 2 e os canais ES/EN.
2. **O plano de plataforma está bem desenhado** (animação irreal dispensa o rótulo de IA, rodízio de 12 quadros, humor adulto). Mas há três buracos: a voz inglesa do Piper tem **licença só para pesquisa**; o TikTok **proíbe postagem automática** mesmo depois da auditoria; e o quadro Hype, com música, BBB, jogadores e marcas, pede regras escritas no roteirista.
3. **O funil de WhatsApp ainda não tem base legal desenhada.** Faltam consentimento LGPD, opt-in no padrão Meta e filtro de idade. O público de quiz com mascote atrai menores, e o ECA Digital (Lei 15.211/2025) está em vigor desde 17/03/2026.

---

## 2. Mapa de riscos (probabilidade × impacto)

| # | Risco | Probabilidade | Impacto | Política / fonte | Correção mais barata |
|---|---|---|---|---|---|
| R1 | **Conflito de nome "Capi Lingo" × Capilingo** (app de inglês + perfis + domínio). Na grafia e no som os nomes são praticamente idênticos e o ramo é o mesmo (ensino de idiomas, classe 41/9) | **Alta** que alguém confunda; **média** que haja oposição/notificação quando você crescer | **Alto**: rebrand depois de 10 mil seguidores custa o canal. Os handles @capilingo já estão ocupados | App: [apps.apple.com/…/capilingo/id6758455620](https://apps.apple.com/ng/app/capilingo/id6758455620) (dev "Matheus Estoque", inglês, assinaturas de US$0,99–9,99) — verificado. Perfis: [tiktok.com/@capilingo](https://www.tiktok.com/@capilingo), [instagram.com/capilingo](https://www.instagram.com/capilingo/), [YouTube Capilingo](https://www.youtube.com/channel/UCNCDnwjVNiQK2AP3ldTWmsQ) (espanhol, 165 inscritos, capilingocol@gmail.com) — verificado. RDAP: capilingo.com registrado em 23/05/2026 — verificado | **Trocar o nome guarda-chuva antes de criar qualquer conta** (custo R$0 hoje) |
| R2 | **"CAPI®" da CAMBI** (teste de proficiência de idiomas A1–C2 com "português para estrangeiros", mais de 150 mil avaliações) | Média | Alto no quadro "Qual seu nível?" e no teste de nível do funil: vira "teste de nível CAPI" contra "Teste CAPI®" | Posts da CAMBI com ® ([Facebook](https://www.facebook.com/cambigestaodeidiomas/posts/teste-de-profici%C3%AAncia-capi%EF%B8%8F/4041632749193858/), [cambi.com.br](http://www.cambi.com.br/)) — **autodeclarado**. O status no INPI **não foi verificado** | Não usar "Capi" no nome do **produto/teste** nem no nome da marca. O personagem pode continuar Capi (ver seção 3.1) |
| R3 | **Voz inglesa do Piper sem licença comercial.** `canal-idiomas/voices/en_US-lessac-medium` foi treinada no dataset Lessac/Blizzard 2013 | **Certa**: a violação já existe se for publicado | Médio/alto: licença de terceiro violada em canal monetizado | Model card: licença = [Blizzard 2013 Lessac](https://www.cstr.ed.ac.uk/projects/blizzard/2013/lessac_blizzard2013/license.html): *"excludes… using the Materials for any commercial purpose"* — verificado. Já o `pt_BR-faber` é **CC0** ([model card](https://huggingface.co/rhasspy/piper-voices/raw/main/pt/pt_BR/faber/medium/MODEL_CARD)), liberado | Trocar a voz EN por uma de licença livre (conferir o MODEL_CARD de cada voz Piper) ou usar ElevenLabs pago |
| R4 | **ElevenLabs no plano gratuito** | Média (tentação de economizar) | Alto: saída sem direito comercial e com atribuição obrigatória | [Help ElevenLabs](https://help.elevenlabs.io/hc/en-us/articles/13313564601361-Can-I-publish-the-content-I-generate-on-the-platform); resumo em [terms.law](https://terms.law/ai-output-rights/elevenlabs/): conteúdo gerado **fora** de assinatura paga não pode ser usado comercialmente — terceiros + página oficial | Só gerar o áudio da Capi com o plano pago ativo (Starter ~US$6). O direito comercial fica com o que foi gerado enquanto você pagava |
| R5 | **Postagem automática no TikTok** (etapa 4 do pipeline: GitHub Actions posta sozinho) | **Certa**, se implementado como está no plano | Médio: app rejeitado na auditoria ou acesso revogado | [Content Sharing Guidelines](https://developers.tiktok.com/doc/content-sharing-guidelines): cliente não auditado → `SELF_ONLY` e no máximo 5 usuários/24h; o app precisa mostrar prévia, deixar o usuário escolher a privacidade sem valor padrão e só enviar *"after the user has expressly consent"* — verificado | Desenhar desde já o **"Felipe aperta publicar"** como modo permanente no TikTok: tela simples com prévia, privacidade e toggle de conteúdo comercial |
| R6 | **YouTube via API fica privado sem auditoria** (o plano só cita auditoria para o TikTok) | Certa | Baixo/médio: vídeos saem privados | [videos.insert](https://developers.google.com/youtube/v3/docs/videos/insert): *"unverified API projects created after 28 July 2020 will be restricted to private viewing mode"* — verificado | Pedir a auditoria do projeto Google no dia 1, ou subir como privado e agendar a publicação no Studio |
| R7 | **"Conteúdo inautêntico"** (YPP): 12 quadros, mas tudo gerado por template + IA | Média | Alto: desmonetização (aviso → 90 dias → saída do YPP, segundo terceiros) | [answer/1311392](https://support.google.com/youtube/answer/1311392): não monetiza *"AI-generated content made with generic or unoriginal templates"* nem conteúdo *"similar or repetitive… with low educational value"*. Permitido: série com enredos distintos, mesma vinheta com o grosso diferente — verificado. Esclarecimento de 16/07/2026 ([TechCrunch](https://techcrunch.com/2026/07/20/youtube-clarifies-policies-around-ai-slop-and-upsetting-videos/)): 3 categorias (template de baixa variação; conteúdo angustiante; persona de IA em temas sensíveis) — imprensa | Registrar a **autoria humana por vídeo** (ver melhoria 4). O rodízio de quadros do plano já ajuda |
| R8 | **Classificação "feito para crianças"** (capivara fofa + quiz + cores fortes) | Média | Alto: recursos cortados, alcance em nicho infantil, RPM mediano de US$0,33 (pesquisa interna, AIR) | [answer/9528076](https://support.google.com/youtube/answer/9528076): fatores incluem *"animated characters or cartoon figures"*, linguagem para crianças, *"simple songs or games, or early education"* — verificado | Marcar "não é para crianças" no canal **e** em cada upload via API (`selfDeclaredMadeForKids=false`) e manter o humor adulto do plano. Nada de musiquinha nem de "vamos aprender as cores" |
| R9 | **Quadro Hype / música**: áudio de música, trecho de série ou novela, letra traduzida | Alta, se o roteirista puxar do radar sem filtro (o radar de 26/09 já traz "Stranger Things… Netflix" e "Bella Lisa Show") | Médio: Content ID tira a receita ou bloqueia. Shorts de 1–3 min com reivindicação ativa são **bloqueados** | Reutilizado ([1311392](https://support.google.com/youtube/answer/1311392)): não pode *"clips of moments from your favorite show edited together with little or no narrative"*. Citação BR: Lei 9.610, art. 46, III (trecho, para estudo/crítica, *"na medida justificada"*, com autor e origem) — via [LegJur](https://www.legjur.com/legislacao/art/lei_00096101998-46). Shorts >1 min com claim ([terceiros](https://subscribr.ai/youtube-strategy/youtube-shorts-copyright-guide)) | Regra dura no roteirista: **zero áudio de terceiros, zero frame de série/TV**; letra no máximo 1 verso, citado com autor; trilha só da Biblioteca de Áudio do YouTube ou gerada com licença comercial |
| R10 | **Pessoas reais no Hype** (jogador, BBB): caricatura, "frase do jogador", imitação de voz | Média | Alto: direito de imagem (Código Civil, art. 20) em conteúdo monetizado; frase inventada = desinformação/difamação; imitação de voz real exige o rótulo de IA | YouTube exige divulgação quando o conteúdo *"makes a real person appear to say or do something they didn't do"* ([answer/14328491](https://support.google.com/youtube/answer/14328491)) — verificado. TikTok: rótulo para voz clonada ou pessoa realista; novas diretrizes desde 24/09/2026 ([terceiros](https://www.cinerads.com/blog/tiktok-ai-content-policy); [Creator Academy](https://www.tiktok.com/creator-academy/en/article/ai-generated-content-label)) | Pessoa real só **por nome, em texto**, com frase **real e com fonte**. Sem desenho, sem voz e sem foto dela |
| R11 | **Marcas no "Para de pagar mico"** (Nike, Adidas, Levi's) e "BBB" (marca da Globo) | Baixa | Baixo/médio | LPI 9.279, art. 132, IV: o titular não pode impedir a citação da marca *"desde que sem conotação comercial e sem prejuízo para seu caráter distintivo"* ([LegJur](https://www.legjur.com/legislacao/art/lei_00092791996-132)) — em canal monetizado a "conotação comercial" é zona cinza | **Só o nome em texto e o som**. Sem logo, sem produto, sem thumbnail com a marca e sem "patrocinado por" implícito |
| R12 | **Trade dress do Duolingo** | Baixa (o plano já proíbe ave/verde/Duo) | Alto se acontecer | Pesquisa interna, seção 6.3 ([canais-conteudo-tendencias](../../pesquisas/2026-09-26-canais-conteudo-tendencias.md)); o Duolingo venceu a UDRP [D2016-2104](https://www.wipo.int/amc/en/domains/decisions/text/2016/d2016-2104.html) contra `duolingo-chinese.com`, que usava "Duolingo-style" — verificado. **Contradição:** essa mesma pesquisa recomendou evitar "lingo" no nome, e o plano adotou "Capi Lingo". Não achei oposição do Duolingo contra marcas "-lingo" (busca sem resultado; "lingo" é palavra comum) | Resolvido junto com R1: nome sem "lingo". **Tirar do brief** a frase "Referência… Duolingo" que vai para o ilustrador |
| R13 | **Lead no WhatsApp sem base LGPD e sem opt-in** | Alta (o funil ainda não foi desenhado) | Alto: ANPD, bloqueio do número na Meta, qualidade do número | Meta: só contatar quem deu o número **e** um opt-in; o método é responsabilidade sua; é obrigatório atender o pedido de saída *"either on or off WhatsApp"*; automação na janela de 24h exige *"escalation paths"* ([whatsappbusiness.com/policy](https://whatsappbusiness.com/policy/), atualizada em 23/09/2026) — verificado | Checkbox de consentimento separado (não pré-marcado), texto com finalidade + nome do controlador, "responda SAIR" em toda mensagem de marketing, política de privacidade de 1 página |
| R14 | **Menores no funil** (quiz de nível atrai adolescentes) | Média/alta | Alto | LGPD art. 14 + Enunciado CD/ANPD nº 1/2023 (qualquer base legal serve, sempre no melhor interesse do menor) ([gov.br/anpd](https://www.gov.br/anpd/pt-br/assuntos/noticias/anpd-divulga-enunciado-sobre-o-tratamento-de-dados-pessoais-de-criancas-e-adolescentes)). ECA Digital em vigor desde 17/03/2026 para serviços com "acesso provável" de menores, com restrição a perfilamento para publicidade ([Machado Meyer](https://www.machadomeyer.com.br/pt/inteligencia-juridica/publicacoes-ij/direito-digital/estatuto-digital-da-crianca-e-do-adolescente-lei-n-15-211-2025-entra-em-vigor-em-17-de-marco-de-2026)) | Pergunta obrigatória "Tenho 18 anos ou mais" antes do WhatsApp. Menor recebe o resultado na tela, sem captura |
| R15 | **Afiliado sem identificação** | Alta | Médio (CONAR, Procon) | Novo Guia CONAR de influenciadores, em vigor desde 01/06/2026, passa a cobrir **modelos de afiliado** e pede identificação mais clara com público jovem ([Meio & Mensagem](https://www.meioemensagem.com.br/midia/conar-atualiza-guia-para-influenciadores-digitais)) — imprensa. No YouTube: marcar "promoção paga"; no TikTok, o toggle de conteúdo comercial é obrigatório na postagem via API ([guidelines](https://developers.tiktok.com/doc/content-sharing-guidelines)) | "#publi / link de afiliado" no CTA falado e escrito + toggle em cada upload com CTA de afiliado |
| R16 | **Conta TikTok errada para o CRP** | Média (marca costuma abrir "conta comercial") | Médio: a monetização do TikTok morre | CRP: só **conta pessoal**, 18+, 10 mil seguidores, 100 mil views em 30 dias, vídeo ≥1 min e original ([Creator Academy](https://www.tiktok.com/creator-academy/article/eligibility); termos BR na pesquisa interna) — verificado + terceiros | Abrir o @ da marca como **conta pessoal** no CPF do Felipe |
| R17 | **Rótulo de IA** | Baixa | Baixo | YouTube: não precisa para *"animation in fully animated videos"*, roteiro/thumbnail com IA nem voz clonada da própria pessoa ([answer/14328491](https://support.google.com/youtube/answer/14328491)) — verificado. TikTok: rótulo só para conteúdo realista | Nada a fazer com a Capi animada. Rotular apenas se algum vídeo tiver cena ou voz realista |
| R18 | **Instagram (originalidade 2026)** | Baixa (conteúdo autoral) | Médio se repostar com marca d'água do TikTok | Desde 30/04/2026 contas que postam na maior parte conteúdo não transformado, numa janela de 30 dias, perdem a recomendação ([Tubefilter](https://www.tubefilter.com/2026/04/30/instagram-removes-algorithm-recommendations-repost-content-aggregator/)) — imprensa | Exportar o arquivo limpo do Remotion para cada rede, nunca baixar do TikTok |

---

## 3. Top 5 melhorias (ordem de impacto ÷ esforço)

### 1) Trocar o nome guarda-chuva ANTES de criar as contas (impacto máximo, ~1 h, R$0 agora)
Por quê: R1 + R2 + R12. Hoje trocar custa zero. Depois de 3 meses custa o canal: rebrand, perda de busca e @ ocupado.
Como fazer:
1. Manter **Capi** como nome do **personagem**. Nome de personagem pesa menos, e o "Capi" registrado pela UFMS (mascote capivara) cobre só papelaria, vestuário, couro, metais e utensílios ([UFMS](https://www.ufms.br/capi-tem-marca-registrada-no-inpi/), 2020 — imprensa institucional). Atenção a isso se um dia vender camiseta ou caneca: classes 16/25.
2. Criar 5 candidatos para o **nome do canal** sem "Capi" colado em "teste/nível", sem "lingo" e sem "Duo". Os submarcas "Adiós Portuñol" e "Gringo Detox" são bons e podem virar o nome principal de cada canal.
3. Para cada candidato, em 30 min:
   - (a) busca no INPI em [busca.inpi.gov.br](https://busca.inpi.gov.br), "radical" + classes 41, 9 e 35. **Rodar do seu navegador**, porque daqui está bloqueado;
   - (b) @ livre no TikTok, YouTube e Instagram;
   - (c) domínio .com/.com.br (RDAP);
   - (d) busca no Google com "+ idioma".
4. Registrar no INPI o vencedor como **marca mista** (nome + Capi), na classe 41: R$440 como pessoa física com 50% de desconto e especificação pré-aprovada, pagamento único que já cobre 10 anos ([terceiros sobre a tabela de 2026](https://contaja.com.br/blog/quanto-custa-registrar-uma-marca/); [tabela oficial](https://www.gov.br/inpi/pt-br/inpi-data/precificacao-dos-servicos/tabela-de-retribuicoes-inpi_portaria-mdic-no110_2025-e-portaria-inpi-no-10_2025.pdf)). Classe 9 (app) só quando existir o app. **Impacto financeiro:** R$440 agora (~US$80, pagamento único) contra o risco de perder o nome. Dá para esperar o 1º mês de validação, mas o **depósito cria prioridade**, então não passar de 60 dias.

### 2) Consertar as licenças de voz (impacto alto, 20 min, US$0–6/mês)
- Apagar/parar de usar `en_US-lessac-medium` (licença só para pesquisa). Escolher outra voz EN do Piper cujo MODEL_CARD diga CC0, CC-BY ou MIT e **salvar o MODEL_CARD junto** em `canal-idiomas/voices/` como prova de licença.
- `pt_BR-faber` (CC0): ok.
- ElevenLabs: gerar a voz da Capi (Voice Design, não clonada) **só com o plano pago ativo** e guardar o recibo do mês junto dos áudios. Não gerar lote no plano gratuito "para testar e usar depois".

### 3) Escrever as "regras de terceiros" dentro do `roteirista.py` (impacto alto, 1 h de Claude)
O prompt atual já diz "Nada de marcas/personagens de terceiros no visual". Falta um validador que **bloqueie** o JSON do episódio quando houver:
- áudio ou trecho de música, série, novela ou TV;
- mais de 1 verso de letra, ou letra sem autor;
- pessoa real com imagem, voz ou frase sem `fonte_url`;
- logo ou nome de marca em thumbnail;
- menção a "teste CAPI", "Duolingo" ou "Duo" fora de comparação.

O quadro Hype passa a usar pessoas e programas **só como texto e contexto** ("como se diz 'paredão' em inglês"), que é o que o plano quer de qualquer jeito. Frase de jogador só se for real e com link.

### 4) Blindagem contra "inautêntico" que dá para provar (impacto alto, 15 min/dia do Felipe)
- Cada vídeo leva 1 elemento humano **registrado no JSON** (`autoria_humana`): o gancho reescrito pelo Felipe, **ou** a pergunta vinda de comentário real, **ou** 1 fala gravada pelo Felipe (nos canais ES/EN ele é o nativo). Se um dia o YPP questionar, você tem o log.
- Limite: 1 Short/dia por canal (como no plano). Nunca postar o mesmo roteiro em 2 canais só trocando a língua de explicação sem mudar os exemplos.
- No upload via API: `selfDeclaredMadeForKids=false`, descrição escrita (não template fixo) e playlist por quadro, que sinaliza "série com enredos distintos", categoria que a política permite.

### 5) Funil do WhatsApp em conformidade desde o 1º lead (impacto alto no dia em que ligar, 2 h)
- Página do teste: checkbox não pré-marcado com o texto *"Quero receber meu resultado e dicas de [marca] no WhatsApp. Posso sair quando quiser respondendo SAIR."* + link da política de privacidade + pergunta "tenho 18+".
- Guardar o log do consentimento (data, texto aceito, origem = vídeo X).
- Pelo modelo de preço da Cloud API (no CLAUDE.md), o fluxo é mais barato e mais seguro com o **usuário iniciando**. A página abre `wa.me/…?text=MEU NÍVEL`: é opt-in claro e janela de 24h grátis, e as mensagens de marketing depois (R$0,3217 cada) só vão para quem aceitou.
- Afiliado: "#publi / link de afiliado" falado e escrito + toggle de conteúdo comercial no TikTok e "promoção paga" no YouTube.

---

## 4. Erro oculto

**A voz em inglês já instalada no projeto (`en_US-lessac-medium`, do Piper) proíbe uso comercial.** O plano chama as falas de apoio com Piper de "grátis", e o custo é zero mesmo. O problema é a licença: é de pesquisa, e canal monetizado é exatamente o uso que ela exclui ("any commercial purpose"). Ninguém perceberia até um vídeo estourar.

Segundo erro oculto, mais caro: o plano chama o quadro 2 de "teste de nível" e o funil de "teste completo". **"Teste de nível Capi" colide de frente com o "Teste de Proficiência CAPI®"** da CAMBI, do mesmo setor, que também cobre português para estrangeiros (o ® é autodeclarado; o INPI não foi consultado).

## Oportunidade despercebida

O **"Felipe aperta publicar"** que o TikTok exige (R5) pode virar a sua prova de autoria humana (melhoria 4). É uma única tela diária que mostra os 3 vídeos do dia, pede o gancho reescrito em 1 linha e registra aprovação, horário e edição. Com isso se resolvem de uma vez a auditoria do TikTok, a do YouTube e a defesa contra "inautêntico", sem trabalho extra.

---

## 5. Nota do estado atual na minha área: **5/10**

O que já está certo: mascote original sem ave/verde, animação irreal (sem rótulo de IA), rodízio de 12 quadros, humor adulto e voz desenhada em vez de clonada.

Falta para 10:
1. Nome guarda-chuva verificado no INPI e com os handles livres, e depósito da marca feito (+2).
2. Licenças de voz limpas e documentadas (+1).
3. Validador de regras de terceiros no roteirista: música, TV, pessoas reais e marcas (+1).
4. Funil com consentimento LGPD, opt-in Meta, filtro 18+ e identificação de afiliado (+0,5).
5. Log de autoria humana por vídeo + fluxo de publicação manual aprovado nas duas APIs (+0,5).

---

## Próximo passo
Escolher 5 nomes candidatos para o canal. Eu checo handles e domínios, e o Felipe roda a busca no INPI no navegador (daqui está bloqueada).

---

## Fontes

**Oficiais / primárias (verificado)**
- YouTube, monetização (inautêntico/reutilizado): https://support.google.com/youtube/answer/1311392
- YouTube, divulgação de conteúdo sintético: https://support.google.com/youtube/answer/14328491
- YouTube, conteúdo para crianças: https://support.google.com/youtube/answer/9528076
- YouTube Data API, videos.insert (projetos não verificados → privado): https://developers.google.com/youtube/v3/docs/videos/insert
- TikTok, Content Sharing Guidelines (API): https://developers.tiktok.com/doc/content-sharing-guidelines
- TikTok, Creator Rewards (elegibilidade): https://www.tiktok.com/creator-academy/article/eligibility
- TikTok, rótulo de IA: https://www.tiktok.com/creator-academy/en/article/ai-generated-content-label
- WhatsApp Business Messaging Policy (atualizada em 23/09/2026): https://whatsappbusiness.com/policy/
- ANPD, Enunciado CD/ANPD nº 1/2023: https://www.gov.br/anpd/pt-br/assuntos/noticias/anpd-divulga-enunciado-sobre-o-tratamento-de-dados-pessoais-de-criancas-e-adolescentes
- INPI, tabela de retribuições: https://www.gov.br/inpi/pt-br/inpi-data/precificacao-dos-servicos/tabela-de-retribuicoes-inpi_portaria-mdic-no110_2025-e-portaria-inpi-no-10_2025.pdf
- Licença Lessac/Blizzard 2013: https://www.cstr.ed.ac.uk/projects/blizzard/2013/lessac_blizzard2013/license.html
- Piper, model cards: https://huggingface.co/rhasspy/piper-voices/raw/main/en/en_US/lessac/medium/MODEL_CARD · https://huggingface.co/rhasspy/piper-voices/raw/main/pt/pt_BR/faber/medium/MODEL_CARD
- ElevenLabs, publicação de conteúdo: https://help.elevenlabs.io/hc/en-us/articles/13313564601361-Can-I-publish-the-content-I-generate-on-the-platform
- WIPO UDRP D2016-2104 (Duolingo × duolingo-chinese.com): https://www.wipo.int/amc/en/domains/decisions/text/2016/d2016-2104.html
- Capilingo: https://apps.apple.com/ng/app/capilingo/id6758455620 · https://www.tiktok.com/@capilingo · https://www.instagram.com/capilingo/ · https://www.youtube.com/channel/UCNCDnwjVNiQK2AP3ldTWmsQ · RDAP capilingo.com (registrado em 23/05/2026)

**Legislação (via bases secundárias; o Planalto deu 503)**
- Lei 9.610/98, art. 46, III: https://www.legjur.com/legislacao/art/lei_00096101998-46
- Lei 9.279/96, art. 132, IV: https://www.legjur.com/legislacao/art/lei_00092791996-132
- ECA Digital (Lei 15.211/2025): https://www.machadomeyer.com.br/pt/inteligencia-juridica/publicacoes-ij/direito-digital/estatuto-digital-da-crianca-e-do-adolescente-lei-n-15-211-2025-entra-em-vigor-em-17-de-marco-de-2026

**Imprensa / terceiros**
- TechCrunch (16–20/07/2026), esclarecimento do YouTube: https://techcrunch.com/2026/07/20/youtube-clarifies-policies-around-ai-slop-and-upsetting-videos/
- Instagram, originalidade (30/04/2026): https://www.tubefilter.com/2026/04/30/instagram-removes-algorithm-recommendations-repost-content-aggregator/
- CONAR, novo guia de influenciadores (2026): https://www.meioemensagem.com.br/midia/conar-atualiza-guia-para-influenciadores-digitais
- CAMBI, "Teste CAPI®" (autodeclarado): https://www.facebook.com/cambigestaodeidiomas/posts/teste-de-profici%C3%AAncia-capi%EF%B8%8F/4041632749193858/ · http://www.cambi.com.br/
- UFMS, mascote "Capi" registrado no INPI: https://www.ufms.br/capi-tem-marca-registrada-no-inpi/
- Shorts e Content ID (2026): https://subscribr.ai/youtube-strategy/youtube-shorts-copyright-guide
- TikTok, rótulo de IA 2026: https://www.cinerads.com/blog/tiktok-ai-content-policy
- ElevenLabs, direitos comerciais: https://terms.law/ai-output-rights/elevenlabs/
- Custo INPI 2026: https://contaja.com.br/blog/quanto-custa-registrar-uma-marca/
