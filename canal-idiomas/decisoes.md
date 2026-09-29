# Log de decisões da fábrica (AI-driven + data-driven)

Formato: data · decisão · métrica/evidência que sustenta · se for teste: prazo + critério de corte definido ANTES.

| Data | Decisão | Evidência / métrica | Teste? prazo · critério de corte |
|---|---|---|---|
| 2026-09-26 | Formato = lição em vídeo com storytelling | Esquete rende 5–69x a mediana de dica nos canais de inglês (playbook, yt-dlp 26/09) | Sim · 14 dias de postagem · manter se retenção média ≥ mediana dos quizzes e swipe-away < 50% |
| 2026-09-26 | Público = adultos iniciante/médio (A1–B1) | 60% do currículo A1–A2; kids = COPPA e RPM ~US$0,33 | Não (restrição) |
| 2026-09-26 | Série longa de domingo "Estudar inglês sozinho" | vidIQ: 11.101 buscas/mês, concorrência 15, +164% | Sim · 4 domingos · cortar se views/vídeo < mediana dos Shorts |
| 2026-09-26 | Cadência inicial 1 Short/dia + 1 longo/semana | Analista de dados: n mínimo ≥4 vídeos/quadro para decidir | Sim · até 02/11 · reavaliar com retenção relativa |
| 2026-09-26 | Horários iniciais TikTok 19:07/12:37 · Shorts 12:10 · Reels 18:40 | Estimativa de blogs (sem dado próprio) | Sim · dia 15 e 45 · trocar o pior quartil de horário |
| 2026-09-26 | 80% dobrar o que funciona / 20% explorar | Regra do Felipe | Não |
| 2026-09-26 | Elenco: Capy, Lazy (preguiça), Hank (panda-gigante), Duda (panda-vermelho), Poppy (axolote), Bolinha (hamster), Dona Jaca | Pesquisa docs/pesquisas/2026-09-26-elenco-animais.md (animais com mais apelo em redes); aprovado pelo Felipe | Sim · por personagem: cortar/reduzir quem tiver retenção < mediana em ≥4 episódios até 02/11 |
| 2026-09-26 | Bio: "Inglês pra quem trava na hora de falar. 1 minuto por dia com a Capy" | Dor nº1 do público A1–B1 (travar ao falar); sem dado próprio | Sim · 30 dias · comparar seguidores/1.000 views com a bio antiga não é possível → reavaliar com taxa de follow do perfil |
| 2026-09-26 | TikTok em 2 faixas: esquete 8–20 s (alcance) + episódio "EP N" 60–100 s (salvamento/CRP) | Duolingo BR 21,7 mi c/ 6 s; Pablo Marcus EP 1 2,1 mi e 6,3% salvamento (pesquisa tiktok-campeoes) | Sim · teste A/B 1 abaixo |
| 2026-09-26 | Regra fixa (sem teste): som original, sem marca d'água, capivara protagonista, nada de "ninguém:" | 35/41 vídeos de mascote com som original; #ninguem ~4,6 mil views/vídeo vs #pov 24 mil | Não |
| 2026-09-26 | Hashtags de bicho: #capybara sempre; #sloth (não #preguiça) quando o Lazy é foco | #capybara ~33,6 mil views/vídeo = 2,2x #cat; #sloth ~17,5 mil | Não |
| 2026-09-26 | ~~A/B 1~~ substituído pelo "Teste Duas faixas" abaixo (decisão do Felipe) | — | — |
| 2026-09-26 | A/B 2: frame 0 com erro escrito × cena sem texto até 1,5 s (roda só nas esquetes, dias ímpares × pares, 7/7) | Retenção no s3 | Sim · 12/10–25/10, 7 pares · +25% vira padrão do render |
| 2026-09-26 | A/B 3: capítulos "parte N" com gancho × avulsos | Views N+1/N e seguidores/mil views | Sim · 26/10–08/11 · +25% nos dois → capítulos no sábado; senão vira compilado |
| 2026-09-26 | A/B 4: CTA escolha A/B × erro de propósito × sem CTA (adiado para não misturar com o teste de faixas) | Comentários/mil views | Sim · 26/10–08/11, 5 de cada · vencedor vira CTA padrão; nenhum +25% sobre controle → CTA sai |
| 2026-09-26 | A/B 5: gíria do TikTok que é inglês × situação útil | Compartilhamentos/mil views | Sim · 26/10–08/11, 5 pares · A vence → quadro fixo 2x/semana; empate cruzado → A na faixa curta, B na longa |

Regras comuns dos A/B: métricas do TikTok Studio 72 h após postar; mínimo 5 vídeos por braço; compara MEDIANA; vence com +25% e em ≥4 de 5 pares; empate = opção mais barata; 1 variável por teste.

### Teste Duas faixas (decisão do Felipe, 26/09) — 12/10 a 25/10/2026, decisão em 28/10
- **Faixas:** (A) esquete 5–20 s: 1 piada do elenco, som original, 1 palavra/frase em inglês, gancho no 1º segundo, CTA "aula completa no EP 0N". (B) episódio 60–140 s (≥61 s no TikTok): lição completa "T1 E0N" com selo visível. Cada episódio gera 1–3 esquetes do mesmo render (custo marginal ~0).
- **Cadência fixa durante o teste** (`config/grade.json`): 1 EP/dia em cada rede (T1 E01→E14) + esquetes: TikTok 2/dia (A = chama pro EP do dia, B = revisão do EP anterior), YouTube 1/dia (com link "vídeo relacionado" pro EP), Instagram 1/dia.
- **Métricas por post, lidas 72 h depois:** views, % assistido até o fim, salvamentos/mil, seguidores novos/mil, compartilhamentos/mil. Compara MEDIANAS por rede e faixa (n = 14 EP; 14–27 esquetes).
- **Critérios de corte (definidos antes):**
  1. Esquete não entrega alcance: mediana de views da esquete < 1,5× a do EP → esquetes caem para 1/dia no TikTok e 0 no YouTube/Instagram.
  2. Esquete entrega: views ≥ 3× o EP **e** seguidores/mil ≥ 50% do EP → TikTok 3 esquetes/dia, YouTube e Instagram 2/dia.
  3. EP salva: salvamentos/mil do EP ≥ 20 → EP diário mantido. Se < 10 **e** views do EP < 50% da esquete → EP 3×/semana (seg/qua/sex).
  4. Nenhuma regra dispara → mantém a grade atual.
  5. O freio automático tem prioridade sobre tudo.
- **Pré-requisito:** o E14 (25/10) promete o E15 → roteirizar o Cap. 4 (E15–19) antes de 25/10.

### Decisões de 27/09 (Claude, sem aprovação humana — regra da fábrica autônoma)
| Data | Decisão | Evidência | Teste? |
|---|---|---|---|
| 2026-09-27 | REPITA: pausa depois de cada cartão sobe de ~0,6 s para 1,5 s (+0,3 s por palavra além de 2), regra no motor (`src/lesson/timeline.ts`, `repitaHold`) | Shadowing exige pausa ≥ duração da fala + tempo de reação; 0,6 s não dá para repetir nem "good morning" (≈0,8 s de fala). Custo: +4 a 8 s por episódio, todos seguem ≤ 140 s | Sim · até 02/11 · se a retenção cair > 10% no trecho de cartões (curva do YouTube) versus os exercícios vizinhos, voltar para 1,0 s |
| 2026-09-27 | Hospedagem dos vídeos: branch órfão `midia` no repo público + jsDelivr fixado no commit | Custo zero, sem conta nova; jsDelivr serve `video/mp4` (raw do GitHub serve `application/octet-stream`); testado 27/09 com HTTP 200 | Não (troca só se o Buffer recusar a URL) |
| 2026-09-27 | Compressão crf 26 no render | E01 com crf 22 = 18,2 MB, perto do limite de 20 MB do jsDelivr; desenho chapado não perde qualidade visível | Não |
| 2026-09-27 | Portão com juiz em 2 modos (API ou o próprio Claude da rotina) | API da Anthropic sem acesso nesta nuvem (401); a rotina de produção já é Claude — custo zero extra | Não |
| 2026-09-27 | Métricas pela API do Buffer (`scripts/metricas.py`, rotina das 23:00) | Mesma credencial; sem OAuth do YouTube. LIMITE: a doc do Buffer só fornece `saves` e `follows` para Instagram/Pinterest → no TikTok e no YouTube os critérios de salvamento/seguidores do "Teste Duas faixas" dependem de leitura do TikTok Studio/YouTube Studio pelo PC (ponte), 1x antes da decisão de 28/10 | Não |

### Decisões de 27/09 — formato novo (Felipe + estudos da ponte)
| Data | Decisão | Evidência | Teste? |
|---|---|---|---|
| 2026-09-27 | Formato "app" abandonado; espinha = Sitcom do Café (F1) | Feedback do Felipe (acelerado, sem interação); Peters & Webb 2018 (+5 aparições = chance 3×); Extra English 10,5 mi | Sim · A/B F1 × F4 abaixo |
| 2026-09-27 | "Teste Duas faixas" SUBSTITUÍDO: esquete 20–35 s (seg–sex) + EP 60–90 s (sáb) | formato-ensino-video.md §4 | — |
| 2026-09-27 | A/B espinha F1 Sitcom × F4 Brasileiro×Nativo, 4 pares (12/10–25/10), leitura 72 h | Critério: vence mediana de "assistiu até o fim" ≥ 15% maior, sem salvamentos/mil > 20% abaixo; empate → F1; aprendizado (comentários com a frase no vídeo do Bolinha) pior pela metade → os dois viram quadros e repete com +4 pares | Sim |
| 2026-09-27 | Testes F5 Repete no Ritmo (18/10, 29/10), F3 Adivinha (22/10, 04/11), F6 Novela (31/10, 07/11) | Critérios da tabela "Métrica e corte de cada teste" em formato-ensino-video.md §7 | Sim |
| 2026-09-27 | A/B visuais: legenda PT só no alvo × em toda fala; cena limpa × cheia; gesto+metáfora × ícone | didatica-visual.md §5 (cortes 10%, 15%, 20% relativos) | Sim · 1 por vez no mesmo quadro |
| 2026-09-27 | Voz: teste cego Gemini 3.8 / ElevenLabs v3 / Azure (Kokoro como âncora) antes de trocar | voz-audio-didatico.md §4 (pronúncia 100% nos alvos, MOS ≥ 4, consistência ≥ 0,80) | Sim · custo < US$5 |
| 2026-09-27 | Marca CapyFala e personagem Capy mantidas apesar do app Comigo (capivara "Capy") | INPI: CapyFala 0 registros; decisão do Felipe | Não · bio sem "trava na hora de falar" |

### Rotina diária de análise (23:00, automática — sem aprovação humana)

| Data | Resultado |
|---|---|
| 2026-09-27 | **Sem dados ainda.** `canal-idiomas/publicados.csv` sem nenhuma linha (só cabeçalho); `metricas/posts.csv` e `metricas/resumo.json` vazios. Motivo: formato ainda não aprovado pelo Felipe (regra 27/09 — sem render/TTS/protótipo antes da decisão dele), então nenhum vídeo foi publicado. Rodada barata: não chamei a API do Buffer (nada com 48h de publicado), nenhuma decisão tomada, freio não avaliado (nada a avaliar). Próxima rodada repete o mesmo teste. |
| 2026-09-28 | **Sem dados ainda** (mesma situação de ontem). `publicados.csv` continua só com cabeçalho; `metricas/posts.csv` e `resumo.json` vazios; sem `canal-idiomas/FREIO`. Motivo: formato (Sitcom do Café) ainda não aprovado pelo Felipe — meta de início de postagem é 12/10. Rodada barata: não chamei Buffer/YouTube (nada publicado, logo nada com 48h+), nenhuma decisão nem freio a avaliar. Repete até haver 1º post. |
| 2026-09-29 | **Sem dados ainda** (mesma situação dos dois dias anteriores). `publicados.csv` continua só com cabeçalho; `metricas/posts.csv` e `resumo.json` vazios (`resumo.json` ainda com timestamp de 26/09); sem `canal-idiomas/FREIO`. Motivo: formato (Sitcom do Café) ainda não aprovado pelo Felipe — meta de início de postagem é 12/10. Rodada barata: não chamei Buffer/YouTube (nada publicado, logo nada com 48h+), nenhuma decisão nem freio a avaliar. Repete até haver 1º post. |
