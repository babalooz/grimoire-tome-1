# Plano CapyFala (ex-Capi Lingo) — 26/09/2026

Marca guarda-chuva **Capi Lingo** (mascote: Capy, a capivara). Três públicos, um motor:
1. **Capi Lingo** — inglês para brasileiros (começo)
2. **Adiós Portuñol by Capi Lingo** — português para hispanofalantes
3. **Gringo Detox by Capi Lingo** — português para anglófonos

Base: `docs/pesquisas/2026-09-26-campeoes-shorts-quiz-idiomas.md` e `...canais-conteudo-tendencias.md`.

## Personagem (bíblia)
- **Capy**: capivara brasileira (**voz feminina** — decidido 26/09), zen por fora e dramática por dentro. Calma absurda que desmorona quando alguém erra inglês.
- Bordões: "Calma... respira... ERROU." · "Capivara não julga. Capivara corrige."
- Acessórios fixos: óculos redondos + boné virado (troca por quadro: fone no "Gíria", apito no "Nível", microfone no "Hype").
- Elenco de apoio (aparece em cenas, dá variedade): **Tuca** (tucano gringo que fala português errado — ótimo para os canais ES/EN) e **Dona Jaca** (vó brasileira que resolve tudo em português).
- Humor adulto-leve (trabalho, viagem, namoro, memes) → evita a classificação "feito para crianças".
- Proibido: coruja/ave verde, verde-limão dominante, "Duo", tipografia estilo Duolingo.

## Quadros (rodízio — nunca o mesmo formato 2 dias seguidos)
| # | Quadro | Estrutura (≈30–40s; versão TikTok 61–75s) | Gatilho |
|---|---|---|---|
| 1 | **Nível 1→5** | 5 perguntas de dificuldade crescente, Capy suando mais a cada nível | progresso + ego |
| 2 | **Qual seu nível? (A1→C2)** | 1 pergunta por nível, CTA para o teste completo (lead WhatsApp) | identidade + funil |
| 3 | **Você sabia?** | curiosidade de palavra/origem ("OK nasceu de uma piada de jornal em 1839") + pergunta final | curiosidade |
| 4 | **Capy errou, corrige aí** | Capy fala errado com confiança total; resposta só no próximo vídeo | comentário + série |
| 5 | **Brasileiro vs Nativo** | como a gente fala × como eles falam, split-screen | identificação + humor |
| 6 | **Para de pagar mico** | pronúncia de marcas/famosos (Nike, Adidas, Levi's) com timer | vergonha evitada |
| 7 | **Hype em inglês** | assunto do dia (futebol, BBB, novela, meme) via radar | novidade |
| 8 | **Pegadinha (falso amigo)** | "push não é puxar", "actually não é atualmente" | erro comum |
| 9 | **Gíria da semana** | 1 gíria real + 3 situações de uso | pertencimento |
| 10 | **Capy no mundo** | mini-esquete: aeroporto, restaurante, entrevista de emprego | narrativa |
| 11 | **Ao pé da letra** | expressão BR traduzida literal ("pay the duck") e a certa | absurdo (viral também nos canais ES/EN) |
| 12 | **Capy em 3 idiomas** | mesma frase PT/EN/ES | testa novos públicos |

**Grade semanal (1 Short/dia + 1 longo):** Seg Nível · Ter Você sabia · Qua Capy errou · Qui Brasileiro vs Nativo · Sex Hype · Sáb Mico/Pegadinha/Gíria (rodízio) · Dom vídeo longo 10–15 min "Prova da Semana".
**Regra de corte:** a cada 14 dias, os 3 quadros com pior retenção saem e entram outros do banco.

## Cenários (variedade visual)
Sala de aula, aeroporto, praia, estádio, cozinha da Dona Jaca, estúdio de TV (quiz), rua à noite. Cada quadro tem cenário padrão; o hype troca o cenário.

## Pipeline (meta: Felipe só aprova)
1. **Radar** (`scripts/radar.py`, pronto) → temas do dia + hype.
2. **Roteiro** — Claude API gera JSON do quadro do dia + 2ª passada "professor nativo" que valida o inglês.
3. **Voz** — Capy com voz própria (ElevenLabs, voz desenhada, não clonada) · falas de apoio com Piper (grátis).
4. **Animação** — Remotion + personagem em camadas (corpo, olhos, boca, braços) + Rhubarb Lip Sync (boca sincronizada).
5. **Render** — versão curta + versão ≥61s + thumbnail.
6. **Postagem** — YouTube Data API + TikTok Content Posting API (publicação pública só após auditoria; até lá, Felipe aperta "publicar").
7. **Agendamento** — GitHub Actions diário.
8. **Métricas** — relatório semanal: retenção, views, comentários por quadro → regra de corte.

## Etapas até o fim do crédito (~05/11)
| Etapa | Quando | Entrega | Quem |
|---|---|---|---|
| 1. Personagem profissional | sem 1 | Capy em vetor com 6 expressões + 4 poses + bocas (visemas) | Felipe encomenda/gera com o brief abaixo; Claude revisa |
| 2. Rig e cenários | sem 2 | Capy animada no Remotion + 4 cenários + voz da Capy | Claude |
| 3. Motor de quadros + roteiro automático | sem 2–3 | quadros 1–6 prontos, roteiro via Claude API a partir do radar | Claude |
| 4. Postagem + agendamento | sem 3 | pipeline diário rodando | Claude + Felipe (contas/chaves) |
| 5. Teste de 14 dias | sem 4–5 | 14 Shorts + 2 longos, relatório de retenção | automático |
| 6. Funil + canais ES/EN | depois | teste de nível → WhatsApp → afiliado; clonar para Adiós Portuñol / Gringo Detox | Claude |

## Orçamento
| Item | Custo |
|---|---|
| Arte do personagem (ilustrador Fiverr/99freelas, vetor em camadas) | ~US$100–300 uma vez (estimativa) |
| ElevenLabs (voz da Capy) | ~US$5–22/mês (confirmar plano) |
| Claude API (roteiros) | ~US$5–15/mês (estimativa) |
| Remotion, Piper, Rhubarb, APIs YouTube/TikTok, GitHub Actions | US$0 |
| **Recorrente** | **~US$10–40/mês** |

## Brief do personagem (enviar ao ilustrador ou usar no gerador de imagem)
> Mascote 2D vetorial para marca de ensino de idiomas "Capi Lingo". Uma capivara brasileira jovem-adulta,
> corpo arredondado e simples (estilo flat, contorno grosso, poucas cores), olhos grandes e muito expressivos,
> óculos redondos amarelos, boné virado para trás. Paleta: marrom-caramelo, amarelo #FFCC00, roxo #3D1F8F (fundo da marca),
> sem verde dominante, sem aves. Personalidade: zen por fora, dramática por dentro.
> Entregar em camadas separadas (SVG ou PSD): cabeça, corpo, 2 braços, 2 olhos (aberto/fechado/arregalado),
> sobrancelhas, 9 bocas para lip sync (A, B, C, D, E, F, G, H, X — padrão Rhubarb), acessórios soltos.
> Expressões: neutra, feliz, chocada, suando/nervosa, brava, rindo. Poses: frente, 3/4, apontando, facepalm.
> Referência de nível de acabamento: mascotes de apps (Duolingo, Headspace), mas visual 100% original.

## Linhas por nível (Felipe, 26/09)
- **CapyFala (adultos)** — foco iniciante + médio; avançado ocasional. Comentários, funil, afiliados, produto.
- **CapyKids (canal separado, fase 2)** — "feito para crianças" obrigatório (COPPA): sem comentários, sem anúncio
  personalizado (~US$0,33/mil views), sem TikTok (<13), sem captação de dados (ECA Digital/LGPD). Ganha no volume + licenciamento.
  **Cereja do bolo: músicas didáticas viciantes** (estilo Galinha Pintadinha): melodias de domínio público (as mesmas que os
  campeões infantis usam) + letras originais que ensinam inglês + Capy animada. Instrumental gerado por código (MIDI);
  voz cantada: serviço com licença comercial paga (ElevenLabs Music/Suno Pro — conferir termos) ou cantora humana.
  Risco: música 100% IA não tem direito autoral protegido (EUA) → melodia de domínio público + letra nossa + arranjo nosso.
