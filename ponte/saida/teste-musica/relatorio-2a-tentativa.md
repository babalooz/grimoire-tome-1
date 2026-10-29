# CapyFala · teste de música Lyria 3.5 · 2ª tentativa (29/10/2026) — BLOQUEADO, parado dentro do teto

Tarefa: `ponte/AVISOS.md` (aviso "teste de música travou", 28/10) pedia retestar com 3 hipóteses, 1 chamada cada,
teto de US$ 0,32 (máx. 4 chamadas). **Resultado: as 3 primeiras chamadas (hipóteses a, b, c, todas no estilo
bossa/café) voltaram `HTTP 400 content_blocked` idêntico. Parei aí, sem usar a 4ª chamada, sem tentar o estilo
arena, sem gerar nenhum áudio, sem publicar nada.**

## O que foi tentado (nesta ordem, 1 chamada cada)

Script: `canal-idiomas/scripts/teste_musica_2.py` (novo; roda `.venv/bin/python scripts/teste_musica_2.py --dry-run`
para ver os prompts sem chamar nada). Modelo: `lyria-3.5`, endpoint `v1beta/interactions` (API de Interações, não
`generateContent`). Letra: só inglês, igual nas 3 chamadas (números + refrão de `musica-numeros-1a10.md` §2.1;
nenhuma fala em português entrou no prompt do gerador).

| # | Hipótese | O que mudou no prompt de estilo | Resultado |
|---|---|---|---|
| 1 | (a) estilo mínimo | só gênero ("smooth jazz ballad"), andamento (96 BPM), voz (mulher, contralto grave) e instrumentos (violão de nylon, piano elétrico, contrabaixo, vassourinha) — **sem** "bossa", "café", "lo-fi", "coffee-shop" nem qualquer palavra que lembrasse país/artista/década | `HTTP 400 content_blocked` |
| 2 | (b) letra só EN | voltei ao estilo rico original de `musica-numeros-1a10.md` §4 ("Lo-fi bossa café song...", com todos os adjetivos) + mesma letra 100% inglês (igual à #1, nada mudou na letra — já não tinha português) | `HTTP 400 content_blocked` |
| 3 | (c) duração 30 s | mesmo prompt da #2 + frase adicional "Make this a short song, about 30 seconds long in total." | `HTTP 400 content_blocked` |

**Texto exato do erro, igual nas 3 chamadas:**
```
HTTP 400 em https://generativelanguage.googleapis.com/v1beta/interactions:
{"error":{"message":"Request blocked for an unspecified policy reason. Please modify your input and retry.","code":"content_blocked"}}
```

## Por que parei em 3 (dentro do teto de 4)

A instrução era parar se continuasse bloqueando em todas as hipóteses, sem passar do teto. Três prompts
estruturalmente bem diferentes (estilo mínimo × estilo rico × estilo rico+duração), com a mesma letra limpa em
inglês, deram o **mesmo erro sem motivo especificado**. Isso não parece ser uma palavra ou adjetivo específico da
letra ou do estilo — é o padrão esperado se o bloqueio for do **lado da conta/chave/política do modelo**, não do
conteúdo do prompt (reforça a suspeita já registrada no aviso de 28/10, quando a mesma chave gerou 1 música boa e
depois passou a bloquear tudo, inclusive repetindo o prompt que tinha funcionado). Gastar a 4ª chamada repetindo a
mesma família de causa não parecia vir a dar um resultado diferente; guardei o restante do teto.

## Custo

3 chamadas × US$ 0,08 = **US$ 0,24** (dentro do teto de US$ 0,32). Nenhum áudio foi gerado, então não há arquivo
`musica-A/B/C.mp3`, nem `gabarito.json`, nem `COMO-OUVIR.md` nesta rodada — não tinha o que nomear.

## O que não foi tentado (para a 3ª tentativa, se o Felipe decidir)

- O estilo arena (torcida de ginásio) e o pop não foram chamados — parei no bloqueio do bossa/café antes de gastar
  com os outros 2 estilos.
- Não troquei de modelo (`lyria-3-clip-preview`, US$ 0,04, sempre 30 s) nem testei uma letra totalmente diferente
  (sem números) como diagnóstico — ambos ficam de sugestão, não de ação, para não estourar o teto desta rodada.

## Sugestão para o Felipe

1. Confira no Google AI Studio / Cloud Console se o **projeto da chave usada aqui** tem algum aviso de
   política/abuso ou restrição de conteúdo específica para `lyria-3.5` (o estudo já achava isso mais provável que
   erro de prompt — `estudo-musica-autoral.md` §1.4).
2. Se não houver aviso visível, pode ser bloqueio temporário da mesma chave (como no episódio de 28/10, que gerou 1
   música boa e travou nas seguintes): vale tentar de novo mais tarde, ou testar 1 chamada com uma letra qualquer
   sem os números (diagnóstico mais barato que repetir os 3 estilos).
3. Alternativa sem gerador cantado: `estudo-musica-autoral.md` §3 (melodia por código + voz da Capy falada no
   ritmo) — custo zero, mas não é canto; fica de plano B se o Lyria continuar bloqueado.
