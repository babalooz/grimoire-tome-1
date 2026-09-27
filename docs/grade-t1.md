# Grade da T1: 20 assuntos × 3 vídeos + reaproveitamento (papel, 27/09/2026)

**Foco (decisão do Felipe):** views e seguidores ganhos por vídeo. Essas são as métricas prioritárias do analista.

## O que é longo e o que é curto
- **Longo:** o Vídeo 1 APRENDER de cada assunto (60–90 s, aula, ≥ 61 s no TikTok) e a compilação semanal do YouTube (4–6 min, com capítulos).
- **Curto:** o Vídeo 2 PRATICAR, o Vídeo 3 FIXAR e os cortes C1/C2 do longo (até ~35 s, feitos para alcance, terminando com convite verdadeiro para seguir e ver a aula completa).
- **Produção nova por semana:** só 2 assuntos × 3 vídeos. Cortes e compilação saem do mesmo render, sem cena nova.

## Semana-tipo (2 assuntos por semana)

| Dia | Post principal | Extra (reaproveitado) | Redes |
|---|---|---|---|
| seg | **A · V1 APRENDER (LONGO)** | — | TikTok, YouTube, Instagram |
| ter | A · V2 PRATICAR (curto) | — | TikTok, Shorts, Reels |
| qua | **B · V1 APRENDER (LONGO)** | A · corte C1 (curto) | TikTok, YouTube, Instagram |
| qui | A · V3 FIXAR (curto) · é o dia 4 do A (volta espaçada) | B · V2 PRATICAR (curto) | TikTok, Shorts, Reels |
| sex | B · corte C1 (curto) | A · corte C2 (curto) | TikTok, Shorts, Reels |
| sáb | B · V3 FIXAR (curto) · dia 4 do B | — | TikTok, Shorts, Reels |
| dom | **Compilação da semana (YouTube, LONGA, capítulos A + B)** | B · corte C2 (curto) | YouTube (compilação); TikTok e Reels (corte) |

**Contas da semana:**
- TikTok: ~11 posts (2 longos + 4 curtos + 4 cortes + 1 corte no domingo).
- YouTube: 1 vídeo longo de verdade (a compilação) + ~10 Shorts.

A referência do Buffer (11 ou mais posts por semana = +34% de views por post) está em `docs/pesquisas/2026-09-26-tiktok-campeoes.md` §5 regra 11.

**Horários:** os mesmos da grade anterior (`docs/conselho/2026-09-26/growth-algoritmo.md` §3):
- TikTok: 19:07 (seg–sex), 12:07 (sáb–dom);
- Shorts: 12:10;
- Reels: 18:40;
- extra do dia: 12:37 no TikTok;
- compilação: domingo, 10:00, no YouTube.

**Plano Free do Buffer:** no máximo 10 posts agendados por canal. A rotina agenda um dia de cada vez, então a grade cabe.

## A T1 inteira

| Semana | Assunto A | Assunto B |
|---|---|---|
| 1 | 1 · Hi! I'm Capy. | 2 · Bye! See you! |
| 2 | 3 · What's your name? | 4 · One, two, three! |
| 3 | 5 · I'm from Brazil. | 6 · She's from Italy. |
| 4 | 7 · How are you? I'm fine, thanks. | 8 · How do you spell it? |
| 5 | 9 · We're friends. | 10 · Are you Brazilian? Yes, I am. |
| 6 | 11 · I'm Brazilian. | 12 · My number is… |
| 7 | 13 · How old are you? | 14 · This is my friend. |
| 8 | 15 · It's a phone. | 16 · I'm tired. / I'm happy. |
| 9 | 17 · A coffee, please. / How much is it? | 18 · This is my mother. |
| 10 | 19 · I'm a doctor. | 20 · What time is it? |

- **Quantidades:** 60 vídeos de aula + ~80 cortes + 10 compilações.
- **Revise & Check** (English File, a cada ~5 assuntos): entra na compilação das semanas 3, 5, 8 e 10, sem vídeo novo.

## Teste de cadência (critério definido antes)

| | |
|---|---|
| **Pergunta** | 2 assuntos por semana (base) ou 3 assuntos por semana? |
| **Quando** | semanas 3–4 com 3 assuntos, comparadas com as semanas 1–2 |
| **Métrica** | mediana de views por post e seguidores ganhos por 1.000 views (72 h depois de cada post) |
| **Corte** | 3 por semana só vira regra se as views por post não caírem mais de 15% **e** os seguidores por 1.000 views não caírem |
| **Caso contrário** | volta para 2 por semana (menos custo de produção) |

## Dependências para esta grade funcionar
1. **Formato aprovado pelo Felipe** e **render liberado.** Até lá, nada é gerado.
2. **`config/grade.json`:** refazer com esta grade (hoje ainda está com a do formato antigo).
3. **Compilação com capítulos:** composição nova no Remotion que junta renders prontos e escreve os capítulos na descrição. É só código, sem cena nova.
4. **Cortes C1/C2:** o mecanismo de cortar trechos do longo já existe (`CafeEsquete`); falta marcar os trechos em cada roteiro.
