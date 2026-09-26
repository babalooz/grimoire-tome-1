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
| 12 | Bíblia da série: elenco (Capy, Tuca, Dona Jaca), piadas recorrentes, cenários, 10 episódios | Claude | 29/09 |
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
