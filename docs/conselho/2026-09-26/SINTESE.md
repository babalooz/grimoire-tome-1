# Síntese do Conselho — 26/09/2026

11 especialistas revisaram `docs/plano-capi-lingo.md` + `canal-idiomas/`. Relatórios completos nesta pasta.

## Notas por área (estado atual)
| Área | Nota | Maior problema |
|---|---|---|
| Duolingo (estratégia) | 3 | Capi é enfeite; narrador neutro; personagem não tem vontade própria |
| Monetização | 3 | Nada gera dinheiro; funil só "depois" (após o crédito acabar) |
| Arte | 2,5 | Capi parece urso; fonte cai para fallback; texto sob a interface das plataformas |
| Roteiro | 4 | Sem voz da Capi, números inventados, promessa de "parte 2" sem memória |
| Didática | 4 | Ensina pouco, sem currículo; voz pronuncia errado o que ensina |
| Retenção | 4 | 1º frame vazio, pergunta só aos 4,4 s, 35% de silêncio, 48 s |
| Tendências | 4 | Radar manda crime/política; outubro tem eleição |
| Som | 3 | Duas vozes diferentes, sem efeitos, voz EN com licença não-comercial |
| Compliance | 5 | Conflito de nome (app "Capilingo" na App Store BR desde 09/03/2026) |
| Growth | 2 | APIs do YouTube/TikTok publicam só privado sem auditoria |
| Dados | 2 | Nada é medido; regra de corte com n≈2 é sorteio |
| **Geral** | **~3,5** | Plano bom no papel; execução atual não publicável |

## Conflitos e decisões
1. **Nome** — 4 especialistas contra "Capi Lingo"; compliance achou app homônimo de inglês na App Store BR. → Felipe está escolhendo família **Capy** (CapyFala / CapyHabla / CapyParla). Pendente: confirmar.
2. **"Capi errou" com resposta no dia seguinte** — roteiro/retenção querem o gancho de série; didática alerta que fixa o erro em quem vê só 1 vídeo. → **Revelar no fim do mesmo vídeo** + comentário fixado; série continua via placar/comentários.
3. **Duração do Nível 1→5** — ~50 s vs meta 30–40 s. → Cortar para **4 níveis (~35 s)** nos Shorts; versão 5 níveis ≥61 s para o TikTok.
4. **Publicação 100% automática** — TikTok exige prévia/consentimento; YouTube sem auditoria = privado. → **Buffer** (API no plano grátis) + tela de aprovação diária do Felipe (vira prova de autoria humana).
5. **Números no gancho** ("só 3%") — proibido sem dado real. → Validador no roteirista bloqueia "%" sem fonte.

## Top 10 ações (ordem de execução)
| # | Ação | Dono | Prazo | Custo |
|---|---|---|---|---|
| 1 | Fechar nome + reservar @ nas 3 redes | Felipe | hoje | 0 |
| 2 | Encomendar Capi (brief novo do diretor de arte: 3/4, focinho longo, tangerina na cabeça, 8 expressões, 9 bocas) | Felipe | 27/09 | US$150–300 |
| 3 | Template v3: 1º frame completo, pergunta até 2 s, safe zones, fontes Lilita One/Rubik, Calma-ômetro, Capi no centro falando em 1ª pessoa | Claude | 29/09 | 0 |
| 4 | Som: 12 efeitos CC0 (Kenney), tique no timer, loudness −14 LUFS; trocar voz EN do Piper (licença) | Claude | 29/09 | 0 |
| 5 | Voz feminina da Capi no ElevenLabs Starter (PT+EN mesma voz) + dicionário de pronúncia | Felipe (conta) + Claude | 30/09 | US$6/mês |
| 6 | Roteirista v2: currículo 60 tópicos, 3 roteiros-modelo, validadores (duração, %, marcas, música, pessoa real), memória de série, grade corrigida | Claude | 01/10 | ~US$9/mês |
| 7 | Radar v2: calendário de eventos (eleições bloqueadas 04/10 e 25/10), filtro de segurança, score de hype | Claude | 01/10 | 0 |
| 8 | Funil: página "Teste de nível" (GitHub Pages) + afiliado Hotmart + produto R$27 Kiwify + LGPD/18+ | Claude + Felipe | 10/10 | 0 |
| 9 | Publicação via Buffer + bloco `publish` por rede + `madeForKids=false` + W-8BEN | Claude + Felipe | 10/10 | US$0–15/mês |
| 10 | Coleta de métricas (YouTube Analytics API) + `posts.csv` + regra de corte nova (≥4 vídeos/quadro) | Claude | 15/10 | 0 |

**Teste:** estoque de 14 episódios até ~12/10; publicar 1–2/dia; decisão de corte no dia 21 com ≥4 vídeos por quadro.

## Impacto financeiro (estimativa do conselho)
- Custo recorrente: ~US$15–35/mês (ElevenLabs 6 + Claude API ~9 + Buffer 0–15) + arte US$150–300 uma vez.
- Receita mês 4–6 (1 mi views/mês, público BR): **R$2,5–4,6 mil/mês**, ~70–80% vindo do funil (afiliado + produto), não de anúncio.
- YPP: meta de elegibilidade até ~20/12/2026 exige 3 vídeos longos/semana (chance 15–25% no ritmo atual).

## O que falta para 10
Ações 1–10 executadas + 2 ciclos de 14 dias com retenção medida (<35% de swipe-away) + 1 h/mês de revisão por professor nativo humano.
