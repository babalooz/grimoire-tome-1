# Plano de ação — CapyFala (adultos) · início 26/09/2026

Meta: **postar a partir de 12/10** com funil no ar; teste de 14 dias; decisão de corte em 02/11; tudo que depende de
construir código pronto antes do fim do crédito (05/11). CapyKids = fase 2 (depois do 1º ciclo de dados).

## Fase 1 — Fundação (26/09 → 03/10)
| # | Ação | Dono | Prazo | Status |
|---|---|---|---|---|
| 1 | Criar @capyfala no TikTok (conta pessoal), YouTube (verificar telefone) e Instagram (conta criador) | Felipe | 28/09 | ⏳ |
| 2 | Chave da API Anthropic (console.anthropic.com, ~US$10 de crédito) — salvar nas variáveis do ambiente | Felipe | 28/09 | ⏳ |
| 3 | Conta Buffer Free conectada às 3 redes | Felipe | 30/09 | ⏳ |
| 4 | Radar v2 (filtro de segurança, calendário, score de hype) | Claude | 26/09 | ✅ |
| 5 | Capy v2 vetorial, sem acessórios, 6 expressões | Claude | 26/09 | ✅ |
| 6 | Trava de conteúdo infantil no radar (evitar "made for kids" no canal adulto) | Claude | 27/09 | 🔄 |
| 7 | Currículo-base (60 tópicos por nível, foco iniciante/médio) lido pelo roteirista | Claude | 28/09 | 🔄 |
| 8 | Validadores do roteirista: gancho ≤8 palavras, pergunta até 2 s, sem "%" sem fonte, sem promessa sem episódio, inglês só em fala `en`, duração 25–40 s | Claude | 28/09 | 🔄 |
| 9 | Funil: página "Teste de nível CapyFala" (grátis, sem login) → resultado por nível → WhatsApp/lista, com LGPD e 18+ | Claude | 03/10 | 🔄 |
| 10 | Manuais dos campeões (personagem/shorts e infantil) | Claude | 26/09 | 🔄 |

## Fase 2 — Formato e piloto (27/09 → 05/10)
| # | Ação | Dono | Prazo |
|---|---|---|---|
| 11 | ✅ Formato: lição em vídeo + storytelling (26/09) | Felipe | 26/09 |
| 12 | Bíblia da série: elenco aprovado (Capy, Lazy, Hank, Duda, Poppy, Bolinha, Dona Jaca — ver CLAUDE.md), piadas recorrentes, cenários, 10 episódios | Claude | 29/09 |
| 13 | Template do formato escolhido no Remotion (cenários, 2º personagem, cortes, lip sync Rhubarb) | Claude | 02/10 |
| 14 | Piloto renderizado + revisão pelo conselho (`/conselho`) | Claude | 03/10 |
| 15 | Aprovação do piloto | Felipe | 04/10 |

## Fase 3 — Estoque e publicação (05/10 → 12/10)
| # | Ação | Dono | Prazo |
|---|---|---|---|
| 16 | Roteirista gera 14 episódios (fila) + versão ≥61 s para TikTok | Claude | 10/10 |
| 17 | `publicar.py` via Buffer: título/legenda/hashtags por rede, `madeForKids=false`, horário | Claude | 10/10 |
| 18 | GitHub Actions diário: radar → roteiro → vídeo → **portão automático** → publica (sem aprovação humana) | Claude | 11/10 |
| 19 | W-8BEN no AdSense + categoria Educação no YouTube | Felipe | 12/10 |
| 20 | **Início das postagens (automático)** | fábrica | 12/10 |

## Fase 4 — Medir e decidir (12/10 → 05/11)
| # | Ação | Dono | Prazo |
|---|---|---|---|
| 21 | Coletor de métricas (YouTube Analytics API) + `posts.csv` + relatório semanal por e-mail (Gmail) | Claude | 15/10 |
| 22 | Vídeo longo de domingo "Estudar inglês sozinho com a Capy" (achado vidIQ) | automático | todo domingo |
| 23 | Decisão de corte de quadros (≥4 vídeos por quadro) | Felipe + Claude | 02/11 |
| 24 | Documentar tudo para rodar sem o crédito (custo recorrente ~US$15–35/mês) | Claude | 04/11 |

## Fase 5 — CapyKids (depois de 02/11)
Músicas didáticas (melodia de domínio público + letra própria), canal separado "made for kids". Ver `docs/plano-capi-lingo.md`.

## Decisão 26/09 — formato oficial: LIÇÃO EM VÍDEO com storytelling
- Estrutura: cena (problema na história) → mini-lição estilo app (4 exercícios, XP, corações, "repita em voz alta") → volta à cena → Caderninho #N.
- Storytelling contínuo (aprovado pelo Felipe): cada episódio avança o arco da temporada ("Dia N nos EUA").
  T1 "Sobreviver" (A1): chegar, pedir café, período de experiência no Bean There, conquistar o Hank, final = prova do DMV (vídeo longo).
  Callbacks: o chunk de episódios anteriores volta dito por outro personagem (repetição espaçada dentro da história).

## Decisão 26/09 (Felipe) — FÁBRICA 100% AUTÔNOMA, AI-driven e data-driven
Felipe não aprova vídeo. Ele só faz setup único (contas/tokens) e age se o FREIO disparar.

**Portão automático (do barato ao caro)** — vídeo só sai se passar nas 3 camadas:
1. *Checagens por código (reprovam sozinhas):* duração na faixa; −14 LUFS ±1 e pico ≤ −1 dBTP; legenda = áudio
   (transcrição Whisper local × roteiro); marca Capy + @acapyfala presente; zero texto cortado/embaralhado (OCR dos stills);
   frase em inglês da lição confere com fonte (dicionário/corpus + LanguageTool); nada de marca/música/rosto de terceiros.
2. *Juiz LLM com rubrica 0–10* (inglês correto, lição útil, história contínua, humor, nada infantil, nada "inautêntico").
   Nota < 8 → reescreve (máx. 2x) → descarta.
3. *Publica sozinho* via Buffer/API. YouTube: responde comentários no personagem (API). TikTok: não responde.

**Loop de aprendizado:** métricas de 48 h (retenção, % assistido até o fim, comentários, inscritos/1.000 views) voltam
para o roteirista; a régua do portão sobe com o que performa.

**FREIO automático** (pausa tudo e só então avisa o Felipe por e-mail): aviso/strike, vídeo removido,
ou 3 vídeos seguidos muito abaixo da média (< 50% da mediana de views engajadas em 48 h).

**Princípio:** toda decisão (formato, quadro, horário, cadência, gancho, corte) cita a métrica que a sustenta e é gravada em
`canal-idiomas/decisoes.md`. Sem dado = teste com prazo e critério de corte definidos ANTES. Produção: 80% dobra o que o dado
mostra, 20% explora novidade.

**Riscos de plataforma a resolver (não dependem de vontade):**
- TikTok Content Posting API: sem auditoria o vídeo sai só privado, e as regras exigem prévia/consentimento do usuário no app
  → caminho: Buffer (app já auditado) — confirmar se publica direto no TikTok sem toque humano; se não, TikTok fica semi-manual.
- YouTube Data API: projeto não verificado publica como privado → publicar via Buffer ou pedir auditoria do projeto.

## Decisão 26/09 (Felipe) — série do zero
- Temporadas = CEFR, capítulos, episódios "T1 E03" (selo no vídeo + título); playlists por temporada no YouTube (publicador cria/atribui).
- Episódio: apresentar palavras → reconhecer → usar → mini-cena da Capy → revisão espaçada. 1 objetivo can-do por episódio.
- Renderer: novos exercícios (cartões de vocabulário, ligar pares) + selo de série. Roteiros T1 reescritos do zero antes do render.

---

# OPERAÇÃO DIÁRIA — fonte da verdade das rotinas (atualizado 26/09)

As rotinas da nuvem leem esta seção + `CLAUDE.md` + `docs/tiktok-nativo.md`. Caminhos relativos à raiz do repo.
**Regra de ouro: só executar etapa marcada ✅ EXISTE. Etapa ⛔ NÃO EXISTE AINDA = pular e registrar "pendente" no commit.**

## 1. Rotinas (criadas pelo Felipe no claude.ai — não criar outras)
| Rotina | Quando (BRT) | Modelo | Faz |
|---|---|---|---|
| CapyFala - radar diário | todo dia 06:00 | Sonnet | §5.2 radar diário → commit em main |
| radar semanal | domingo 07:00 | Sonnet | §5.3 → `canal-idiomas/radar/semana-AAAA-Www.md/.json` |
| produção, portão e publicação | todo dia 08:00 | Opus 5.5 | §5.4 a §5.8 para os posts do dia na grade |
| métricas e aprendizado | todo dia 23:00 | Sonnet | §5.9 |

**FREIO:** se o arquivo `canal-idiomas/FREIO` existir, TODAS as rotinas param no início (só registram "freio ativo").
Quem cria o FREIO: a rotina de métricas (strike/aviso, vídeo removido, 3 vídeos seguidos < 50% da mediana de views em 48 h)
ou o Felipe. Quem remove: só o Felipe.

## 2. Grade (dia · faixa · rede · horário)
Arquivo lido por máquina: **`canal-idiomas/config/grade.json`** (12/10–25/10, 1 entrada por post com `data`, `hora`, `rede`,
`faixa`, `episodio`, `corte`, `papel`, `frame0`). Versão legível: `docs/grade-semana-1.md`.
| Rede | Faixa | Seg–Sex | Sáb–Dom |
|---|---|---|---|
| YouTube | episódio (T1 E0N do dia) | 12:10 | 10:10 (dom 12:10) |
| TikTok | esquete A (chama pro EP do dia) | 12:37 | 10:37 |
| Instagram | esquete A | 12:40 | 17:40 |
| YouTube | esquete A (link "vídeo relacionado" pro EP) | 18:10 | 16:10 |
| Instagram | episódio | 18:40 | 11:40 |
| TikTok | episódio | 19:07 | 12:07 |
| TikTok | esquete B (revisão do EP de ontem) | 21:37 | 18:37 |
| YouTube | longo (compilação da semana) | — | dom 10:00 |
Dia N do teste = T1 E0N (12/10 = E01 … 25/10 = E14). Depois de 25/10 a grade é regerada pelo resultado do teste (§6).

## 3. Arquivos de estado
| O quê | Caminho | Formato |
|---|---|---|
| Log de decisões (toda decisão com métrica) | `canal-idiomas/decisoes.md` | tabela + seções de teste |
| Fila (pronto, não publicado) | `canal-idiomas/fila/` | `<data>_<rede>_<faixa>_<episodio>.json` com metadados + motivo de estar na fila. O MP4 não vai pro git (é regerado: render determinístico) |
| Publicados | `canal-idiomas/publicados.csv` | `data,hora,rede,faixa,episodio,corte,post_id,url,status` |
| Radar diário / semanal | `canal-idiomas/radar/AAAA-MM-DD.json` · `canal-idiomas/radar/semana-AAAA-Www.json` | JSON v2 |
| Episódios | `canal-idiomas/episodes/licao-s01eNN-*.json` | formato lição (`docs/percurso-do-zero.md`) |
| Freio | `canal-idiomas/FREIO` | existe = pausa |

## 4. Condição para publicar (rotina de produção)
Publica só se **as 3** forem verdade: data ≥ **2026-10-12** · **acesso ao Buffer OK**: `python3 scripts/publicar.py --listar`
sai com código 0 (a leitura GraphQL em `api.buffer.com` responde 200 e lista TikTok **acapyfala** e YouTube **CapyFala**) · o post
passou no **portão** (§5.6).
**Buffer (testado pelo PC em sessão nova, 26/09 23:57 UTC: HTTP 200 nas duas consultas, filas ativas):**
- Endpoint `POST https://api.buffer.com` (GraphQL). O código NÃO manda header Authorization: a credencial do ambiente injeta.
- `organizationId` **6a1599888465779c73b3235d** · TikTok **acapyfala** = `6ab84f02ea19ca0bdefbf095` · YouTube **CapyFala** =
  `6ab84ddbea19ca0bdefbd32a` (cópia em `canal-idiomas/config/buffer-canais.json`). Instagram: não conectado.
- Consultas: `query { account { organizations { id name } } }` e `channels(input: { organizationId })`.
- Post: `createPost` com `assets: [{ video: { url } }]`, `schedulingType: automatic` (TikTok sem notificação),
  `mode: customScheduled`, `dueAt` UTC; YouTube com `metadata.youtube` (título, categoria 27, madeForKids false).
- Sessão aberta ANTES da credencial recebe 401: só sessões novas (as rotinas) têm acesso. 401 numa rotina = problema real.
A chave do Buffer NÃO é variável de ambiente: é a "Credencial de API" **Buffer** do ambiente Default (Bearer, site
`api.buffer.com`), injetada pelo proxy. Nenhuma rotina lê, imprime ou pede a chave. Qualquer uma falsa → grava em `canal-idiomas/fila/` com o motivo e segue.

## 5. Comandos exatos
Container novo a cada rotina: rodar o setup antes de render/TTS. Todos a partir de `canal-idiomas/`.
| # | Etapa | Comando | Status |
|---|---|---|---|
| 5.1 | Setup (Node + Python + modelo Kokoro ~340 MB) | `bash scripts/setup.sh` | ✅ EXISTE |
| 5.2 | Radar diário | `python3 scripts/radar.py` (fallback rápido: `--so-hype`) | ✅ EXISTE |
| 5.3 | Radar semanal | `python3 scripts/radar.py --semanal` | ✅ EXISTE |
| 5.4 | Contexto do episódio (tema da semana; lição intocada) | `.venv/bin/python scripts/roteirista.py --contextualizar episodes/<ep>.json` (precisa `ANTHROPIC_API_KEY`) | ✅ EXISTE (sem chave = pular, episódio sai sem contexto) |
| 5.4b | Contexto da esquete (hype do dia) | `.venv/bin/python scripts/roteirista.py --contexto esquete` (mostra o hype escolhido) | ✅ EXISTE só a escolha; a geração da `abertura` da esquete ⛔ NÃO EXISTE AINDA |
| 5.5 | Render do episódio (+ esquetes) | `bash scripts/make-licao.sh episodes/<ep>.json` → `out/<id>.mp4` (−14 LUFS) | 🔄 EM IMPLEMENTAÇÃO: tipos de exercício novos, selo "T1 E0N" e esquetes (`out/<id>-esquete-A.mp4`). Até terminar, NÃO renderizar os episódios novos |
| 5.6 | Portão automático (código + juiz LLM ≥ 8) | `scripts/portao.py` | ⛔ NÃO EXISTE AINDA → tudo vai para a fila |
| 5.7 | Publicar via Buffer (TikTok + YouTube conectados; Instagram ainda não) | teste de acesso: `python3 scripts/publicar.py --listar` (código 0 = OK) · simular: `python3 scripts/publicar.py --data AAAA-MM-DD --dry-run` · agendar: `python3 scripts/publicar.py --data AAAA-MM-DD` | ✅ EXISTE. Envia só com token + portão aprovado + MP4 + URL pública (Cloudinary: variáveis `CLOUDINARY_CLOUD` + `CLOUDINARY_PRESET` de um upload preset unsigned — nenhum segredo); faltando algo, grava em `fila/` com o motivo |
| 5.8 | Registrar publicado | automático no `publicar.py` (append em `publicados.csv`) | ✅ EXISTE |
| 5.9 | Métricas 72 h + freio | `scripts/metricas.py` | ⛔ NÃO EXISTE AINDA (precisa OAuth do YouTube Analytics) → rotina só registra "sem coletor" |

## 6. Critérios de corte dos testes (definidos antes; detalhe em `canal-idiomas/decisoes.md`)
Regras comuns: métricas 72 h após postar · compara MEDIANA · mínimo 5 vídeos por braço · vence com +25% e em ≥4 de 5 pares
· empate = opção mais barata · 1 variável por teste · o freio tem prioridade.
- **Duas faixas (12/10–25/10, decisão 28/10):** esquete < 1,5× views do EP → esquete 1/dia no TikTok e 0 em YT/IG ·
  esquete ≥ 3× views do EP e seguidores/mil ≥ 50% do EP → TikTok 3/dia, YT/IG 2/dia · EP com salvamentos/mil ≥ 20 → EP
  diário; < 10 e views < 50% da esquete → EP 3×/semana · nada dispara → mantém.
- **A/B 2 frame 0 (12/10–25/10, só esquetes, ímpar × par):** +25% de retenção no s3 vira padrão.
- **A/B 3 capítulos (26/10–08/11):** views N+1/N e seguidores/mil +25% → capítulos no sábado.
- **A/B 4 CTA (26/10–08/11):** mais comentários/mil vira padrão; nenhum +25% sobre controle → sem CTA.
- **A/B 5 gíria × situação (26/10–08/11):** compartilhamentos/mil; gíria vence → quadro fixo 2×/semana.
- **Domingo longo (4 domingos):** views/vídeo < mediana dos Shorts → cortar.
- **Elenco:** personagem com retenção < mediana em ≥ 4 episódios até 02/11 → reduzir.
