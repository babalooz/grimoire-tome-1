# Conselho 26/09/2026 — Estrategista Duolingo

Alvo: `docs/plano-capi-lingo.md` + estado atual de `canal-idiomas/` (v1 `001-looking-forward`, v2 `002-desafio-5-niveis`, `src/Mascot.tsx`, `src/Episode.tsx`, `scripts/roteirista.py`).
Rótulos: **verificado** (fonte primária ou medição direta) · **imprensa** · **autodeclarado** · **estimativa** · **medição própria** (curl nas páginas públicas em 26/09/2026).

---

## 1. Diagnóstico em 3 linhas

1. O Duolingo venceu no TikTok com um **personagem com vontade própria**, e não com aula: "Duo + trends + tom engraçado/ameaçador". No v1/v2 a Capi é **enfeite**. Ela fica parada no rodapé enquanto um narrador neutro lê um quiz em slides.
2. O plano acerta na intenção (bíblia, bordões, elenco, rodízio de quadros). Mas **nada disso chegou ao código**. O `Mascot.tsx` é uma cabeça redonda que parece urso, com 3 humores, boca senoidal e sem sobrancelha, corpo ou braços. O roteirista escreve falas de apresentador ("Nível um. Como se diz…"), não da Capi.
3. Dá para copiar do Duolingo, **em princípio**: (a) personagem como protagonista, com algo em jogo; (b) rig modular com estados (parado / acertou / errou) e boca independente; (c) gamificação levada para fora do app (sequência, liga, aversão à perda); (d) processo rápido de reagir a trends e responder comentários no personagem. Tudo isso é automatizável dentro do orçamento.

---

## 2. O que o Duolingo faz, com fonte (o que interessa ao Capi)

| Fato | Rótulo | Fonte |
|---|---|---|
| TikTok do Duolingo foi de 50 mil (set/2021) para ~16 mi de seguidores, sob a Zaria Parvez | imprensa/autodeclarado | https://goldhouse.org/people/zaria-parvez/ |
| A equipe começou com 1 pessoa (2020) e tinha 6 em 2023. O núcleo de criação são 2 funcionários + terceirizados | imprensa | https://www.contagious.com/en/article/news-and-views/duolingo-social-media-marketing · https://technical.ly/company-culture/duolingo-viral-marketing-strategy-lessons/ |
| Processo: brainstorm semanal a partir de áudios em alta, **ciclo de 2 dias** (ideia → gravação → finalização), aprovação só interna e jurídico apenas para trend arriscada | imprensa | technical.ly (acima) |
| "Duo é tratado como **influenciador, não como mascote**." "Não dá para planejar viralização, dá para planejar mentalidade." Começaram **comentando nos vídeos dos outros** antes de postar | imprensa (citação da Parvez) | contagious.com (acima) |
| Fórmula "Duo + trends + tom engraçado/ameaçador". "Entreter primeiro, mensagem depois." Uso do modelo Flicker/Flash/Flare do TikTok: trend reativa + episódio planejado + campanha interativa | terceiros | https://sproutsocial.com/insights/duolingo-tiktok-success/ |
| Campanha "Morte do Duo" (1º tri/2025): mistério narrativo nas redes, **1,7 bi de impressões orgânicas** e aumento de usuários novos e reativados | verificado (carta ao acionista, SEC) | https://www.sec.gov/Archives/edgar/data/1562088/000156208825000098/q1fy25duolingo3-31x25share.htm |
| Redesign do Duo (2019): corpo desmontado em **formas geométricas simples e padronizadas** (curvatura, tamanho do olho, posição da asa), pensado para virar rig de animação. Sem gradiente | verificado (blog oficial) + imprensa | https://blog.duolingo.com/reshaping-duo/ · https://www.creativebloq.com/news/duolingos-redesigned-mascot-is-a-hoot |
| Arte: "o mínimo de detalhe necessário", silhueta clara e **exagero quase caricato** nos traços-chave | verificado (blog oficial) | https://blog.duolingo.com/shape-language-duolingos-art-style/ |
| Personagens do app: **20+ bocas (visemas) por personagem**. Uma máquina de estados roda dois sistemas em paralelo: boca, e corpo (parado → acertou/errou), com piscar, aceno e sobrancelha no estado parado | verificado (blog oficial) | https://blog.duolingo.com/world-character-visemes/ |
| Sequência (streak): a aposta de sequência deu **+14% de retenção no dia 7**. O "Weekend Amulet" deixou o usuário 4% mais propenso a voltar e 5% menos propenso a perder a sequência | verificado (blog oficial, testes A/B) | https://blog.duolingo.com/how-streaks-keep-duolingo-learners-committed-to-their-language-goals/ |
| Placar de ligas: +17% de tempo de estudo e **3x** mais usuários muito engajados. A fatia dos DAU com sequência de 7+ dias quase triplicou (>50%). DAU 4,5x em 4 anos | autodeclarado (ex-VP de Growth) | https://www.lennysnewsletter.com/p/how-duolingo-reignited-user-growth |
| Memorando "AI-first" (28/04/2025) gerou revolta: perdeu centenas de milhares de seguidores no TikTok e **apagou todos os posts** do TikTok e do Instagram em 17/05/2025 | imprensa | https://www.fastcompany.com/91338068/duolingo-deletes-tiktok-ai-backlash-returns-with-strange-message · https://adage.com/social-media/aa-duolingo-wipes-tiktok-instagram-ai-backlash/ |
| Duolingo Brasil no TikTok: 9,1 mi de seguidores, ~338 mil curtidas por vídeo, Duo feito por **pessoa fantasiada** | verificado (pesquisa interna 26/09) | `docs/pesquisas/2026-09-26-campeoes-shorts-quiz-idiomas.md` |

**Leitura:** o TikTok do Duolingo quase **não ensina**, porque quem ensina é o app. O Capi não tem app, então o vídeo precisa ensinar **e** ser personagem. O erro do v1/v2 foi ficar só com a metade "ensina".

---

## 3. Top 5 melhorias (impacto ÷ esforço)

### #1 — Capi vira protagonista com algo em jogo: o "Calma-ômetro" · impacto altíssimo · esforço 1–2 dias de código · US$0
**Princípio copiado:** Duo tem personalidade e ameaça. O espectador assiste para ver a **reação** do personagem, não a pergunta.
**Adaptação:** a piada da bíblia ("zen por fora, dramática por dentro") tem que **aparecer na tela**. Cada vídeo tem uma barra de calma da Capi que cai a cada nível ou erro, até ela explodir no nível 5. É a assinatura visual da marca, como a cara de ameaça do Duo.
**Como fazer:**
- `Episode.tsx`: trocar o `LevelBar` genérico por um `CalmMeter` (termômetro 100→0 com rótulos "zen / hmm / respira / ERROU"). A Capi sobe para o **centro-superior** e fica 2x maior. Pergunta e opções descem para o terço de baixo.
- Novo campo por cena: `capi: { state: "zen"|"desconfiada"|"suando"|"surtando"|"orgulhosa"|"julgando", line: "…" }`. Sai o narrador neutro. **Toda fala é da Capi, em 1ª pessoa**: "Nível um. Isso aqui até a Dona Jaca acerta." → revelação → "…respira. I AM twenty years old. Você não TEM anos, você É."
- `roteirista.py`: a regra do PERSONAGEM passa a exigir 1 reação da Capi por revelação e 1 bordão por vídeo, com proibição explícita de "fala de apresentador". A 2ª passada ganha um item: "cada fala soa como a Capi? Se soar como locutor, reescreva".
- Hook do v2: "Só 3% dos brasileiros chegam no nível 5" é **número inventado**. O próprio roteirista já proíbe isso. Trocar por algo como "A Capi aposta o boné que você não passa do nível 4."

### #2 — Refazer o mascote com a "engenharia" do Duo (e não com o visual dele) · impacto altíssimo · esforço 1 semana (terceirizado) · US$150–300 uma vez (estimativa)
**Problemas no `Mascot.tsx` atual:** orelhas redondas no topo de cabeça redonda ficam lidas como **urso ou hamster**. Não tem sobrancelha, que é a peça que mais carrega expressão. Não tem corpo nem braços, então não gesticula. A boca é uma elipse que abre e fecha em seno, sem lip sync. Os olhos são grandes e "fofos" o tempo todo, e isso mata a piada do zen e ainda empurra o canal para "feito para crianças".
**Adendos ao brief do plano (seção "Brief do personagem"):**
1. **Teste de silhueta:** preenchida de preto a 64 px, tem que ler "capivara" em 1 segundo. Para isso: cabeça **retangular e comprida**, focinho quadrado e rombudo, orelhinhas minúsculas, olhos **altos e pequenos**, corpo de "pão de forma" sentado.
2. **Cara padrão = deadpan** (pálpebra a meio mastro, boca reta). É o meme global da capivara impassível. A explosão (olhos arregalados, pelo arrepiado, óculos tortos) vira o gag por contraste.
3. **Sobrancelhas separadas** (5 posições) + 9 bocas Rhubarb + 3 olhos. Isso cobre o equivalente a 20 visemas do Duo com um terço do custo.
4. **Corpo inteiro com 2 braços articulados** (ombro, cotovelo) e 4 poses: sentada zen, apontando, facepalm, "surto" (braços para cima).
5. **Grupos SVG com nome** (`#head`, `#brow_L`, `#mouth_A`…), para o Remotion trocar peças por código sem retrabalho.
6. **Tirar "Duolingo" da linha de referência do brief.** Mandar Duolingo como referência para ilustrador ou IA aumenta o risco de sair derivado. Usar Headspace, Pocoyo (acabamento de forma) e o próprio meme da capivara.

**Rig no código (princípio da máquina de estados do Duo):** três camadas independentes em `Mascot.tsx`:
- (a) camada parada: respiração, piscada aleatória, microtique de sobrancelha;
- (b) camada de reação: estado da cena, com transição por `spring`;
- (c) camada de boca: visemas do Rhubarb lidos do `timings.json`.

Não usar Rive: exportar exige plano pago (a partir de US$9/mês, https://rive.app/docs/account-admin/pricing) e a máquina de estados não anima no `@remotion/rive` (https://github.com/remotion-dev/remotion/issues/5147). SVG em camadas no Remotion faz o mesmo de graça.

### #3 — Levar a gamificação do Duolingo para fora do app: sequência + liga + aversão à perda · impacto alto · esforço 2–3 dias · US$0
Sequência e ligas são as alavancas de retenção mais comprovadas do Duolingo (+14% no dia 7; 3x usuários engajados, ver tabela). No canal, o equivalente é **fazer o espectador voltar amanhã**:
- **Série numerada "Dia 001, 002…"** no título e na tela. A CTA fixa é "comenta 'dia 12 ✅' + teu placar". Quem comenta todo dia está fazendo a sequência dele.
- **"Liga da Capi" no vídeo longo de domingo:** um script lê os comentários da semana pela YouTube Data API (`commentThreads.list`, cota gratuita) e monta o top 10 de quem mais comentou placar. Os nomes aparecem na tela (dá para gerar no Remotion). Isso é reconhecimento público, o mesmo motor da liga.
- **Aversão à perda com a Capi como refém**, o equivalente ao "Duo triste quando você quebra a sequência": "Se a maioria errar o nível 5, a Capi perde o boné até sexta." O boné sumir de verdade nos vídeos seguintes é continuidade barata e gera comentário.
- **CTA de fim no tom de cobrança passiva do Duo, em versão zen:** "Amanhã tem. Capivara não cobra… capivara **espera**." (Capi olhando fixo, 1 s parada.)

### #4 — Processo Flicker/Flash/Flare: trend em até 48 h + 1 arco narrativo por mês · impacto alto · esforço médio · ~US$0
- **Flash (reativo):** 1 a cada 5 vídeos é **só personagem** reagindo a um hype do radar (BBB, futebol, meme), com no máximo 1 palavra em inglês. O Duolingo publica sobre qualquer meme em alta e anda em ciclo de 2 dias. `radar.py` já existe. Falta um quadro "hype-puro" no `roteirista.py`, com teto de 20 s.
- **Flicker (episódico):** o plano já tem "Capi errou, resposta amanhã". Está certo, e é o formato mais Duo do plano. Colocar na quarta **e** puxar a resposta no gancho de quinta.
- **Flare (campanha):** 1 arco de 5 episódios por mês, na versão barata da "Morte do Duo" (1,7 bi de impressões). Exemplo: "Tuca roubou o boné da Capi" → pistas em inglês nos vídeos → espectadores votam no culpado nos comentários → revelação no longo de domingo. O roteirista recebe o arco como contexto fixo durante o mês.
- **Tom:** humor adulto (trabalho, crush, chefe, aeroporto) e nada de musiquinha. Na publicação, marcar "não é conteúdo para crianças".

### #5 — Comentários como canal: responder no personagem · impacto médio-alto · esforço 10 min/dia do Felipe · ~US$1–3/mês de API (estimativa)
O Duolingo **começou comentando** antes de postar, e as respostas no personagem são metade da marca.
- Script diário: puxa os 20 comentários do dia (YouTube Data API) → Claude escreve a resposta como Capi → Felipe aprova em lote → publica via `comments.insert`.
- No TikTok não achei endpoint público de resposta a comentário na Content Posting API. Lá o Felipe responde à mão, 5 por dia, usando os rascunhos. Nos comentários mais engraçados, usar o recurso de responder com vídeo: 1 por semana vira episódio.
- Bônus: isso é a "autoria humana visível" que protege contra a política de conteúdo inautêntico (ver `docs/pesquisas/2026-09-26-canais-conteudo-tendencias.md`).

**Ordem de execução:** #1 (código, já) → #2 (encomendar arte em paralelo) → #3 → #4 → #5. O #1 dá para testar com o mascote atual antes da arte nova chegar.

---

## 4. Erro oculto: o nome "Capi Lingo"

- **Contradiz a própria pesquisa do projeto.** `docs/pesquisas/2026-09-26-canais-conteudo-tendencias.md` §6.3 diz: evitar "'lingo', 'Duo' ou 'Duolingo' no nome, handle ou título". O plano adotou "Lingo" como marca guarda-chuva. Mascote animal + app de idioma + sufixo "-lingo" = leitura imediata de "Duolingo genérico". Isso atrai o problema de marca (trade dress + nome) que o plano tenta evitar, e passa ideia de cópia justamente para o público que conhece o Duo. Não achei processo do Duolingo contra "-lingo" (Dinolingo e Lingokids existem), então o risco jurídico é **moderado (estimativa)**. O risco de percepção é alto.
- **Os handles já estão ocupados** (medição própria, 26/09/2026): YouTube `@capilingo` existe (canal em espanhol, 203 inscritos, 80 vídeos, desde 2020) e TikTok `@capilingo` existe (10 seguidores). A busca também aponta um `capilingo.com` ligado a espanhol com capivara (não verificado: o site deu 502).
- **Custo de trocar agora:** zero. **Custo de trocar depois** que a arte, o logo e 30 vídeos tiverem o nome: refazer tudo.
- **Ação:** decidir o nome **antes** de encomendar a arte. Um candidato ligado ao bordão, com handle livre em YouTube e TikTok (medição própria, calibrada com um handle inexistente): **`@capicorrige`** ("Capivara não julga. Capivara corrige."). Ocupados ou com dono: capifala, capiensina, capizen, capidrama. Para os canais ES/EN, dá para manter "Capi" como personagem e usar nomes locais ("Adiós Portuñol", "Gringo Detox") sem guarda-chuva "-lingo".

**Erro secundário:** o hook do v2 ("Só 3% dos brasileiros…") é estatística inventada, justamente o que a pesquisa diz para não fazer ("precisa ser dado real… senão é mentira"). O script novo já proíbe isso. O episódio 002 salvo, não.

**Lição do Duolingo que vale ouro:** a revolta contra o "AI-first" custou ao Duolingo centenas de milhares de seguidores e fez a marca apagar o TikTok inteiro. **Nunca anunciar "canal 100% feito por IA"** em bio, título ou post. A automação fica nos bastidores. Na frente aparecem autoria e personagem.

---

## 5. Nota do estado atual (marca, personagem e gamificação): **3/10**

- Plano no papel: 6/10 (bíblia, elenco, rodízio e série com cliffhanger estão certos).
- Execução em `canal-idiomas/`: 2/10 (mascote-enfeite, narrador neutro, 1 template, número inventado no gancho, nenhuma mecânica de retorno).

**O que falta para 10:**
1. Calma-ômetro + Capi falando em 1ª pessoa, no centro da tela, em todo vídeo (#1).
2. Mascote novo que passe no teste de silhueta, com cara padrão deadpan e rig de 3 camadas com lip sync Rhubarb (#2).
3. Série numerada + Liga da Capi no longo de domingo + boné como refém (#3).
4. 1 vídeo em 5 de trend pura em até 48 h + 1 arco narrativo por mês (#4).
5. Respostas no personagem todo dia (#5).
6. Nome sem "-lingo", com handles garantidos antes da arte.
7. Prova: 14 vídeos com retenção média ≥ 70% e comentários/views ≥ 1% (estimativa de meta, não benchmark verificado).

**Próximo passo:** Felipe decide o nome (ex.: `@capicorrige`) e reserva os handles hoje. Em seguida, implementar o Calma-ômetro + as falas da Capi no v3 com o mascote atual.
