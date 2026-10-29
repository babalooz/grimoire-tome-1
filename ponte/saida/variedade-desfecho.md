# Variedade de desfecho da sitcom e dos ciclos do vocab (29/10/2026)

Pedido: diretor, 29/10 (playbook-youtube-tiktok.md §(b) regra 1). Base: política do YouTube answer/1311392
("personagens na mesma situação, com o mesmo desfecho"; "pouca variação entre vídeos"). Tudo abaixo foi MEDIDO
por código sobre os JSONs do main (portão: main 0a45363). Nenhum pedido de voz foi feito.

## Resultado em 4 linhas
- **T1 escrita: 45 roteiros** (assuntos 1, 2, 3, 6, 7, 11–20 × V1/V2/V3). Assuntos **4, 5, 8, 9, 10 não têm JSON** — não medidos.
- **(Capy, consegue) = 26/45 = 58%** pela regra do portão (cena depois do último treino). Pela regra larga
  ("a Capy diz a frase-alvo certa em qualquer ponto", incluindo o "vamos juntos") = **41/45 = 91%**. Nas duas, > 50%.
- **Na sequência da T1, 22 de 45 seriam reprovados** pelo par repetido (4+ dos 10 anteriores). Contando só os 16
  já aprovados/publicados como janela (o que o portão faz hoje): **21 avisos**. Nenhum por gancho ou 1ª fala idêntica.
- V2 e V1 são o problema: **todos os 30 V1+V2 menos 4** fecham em (capi, consegue). Os V3 variam (Duda/Poppy dão a resposta do exercício).

## Como o portão mede (camada 1c, sem IA, sem voz)
- `canal-idiomas/scripts/portao.py`: `checar_variedade`. Compara com os **10 episódios aprovados anteriores na ordem da
  série** (estoque.csv aprovado/publicado_midia + publicados.csv + episodes/*.json). Reprova se o par (resolve, desfecho)
  já aparece em **mais de 3** deles, ou se o **gancho** (hookTitle) ou a **1ª fala** for igual à de um deles.
- Campos novos **opcionais** no JSON: `"resolve"` (speaker) e `"desfecho"` (consegue | erra_e_fica | outro_resolve |
  vira_piada | aberto). Com os campos, o portão usa os campos. Sem eles, deduz do texto e só o que dá para ver:
  - só a cena **depois do último treino** (pausa "SUA VEZ"/repita) conta; o "vamos juntos" não é desfecho;
  - Capy diz a frase-alvo certa em inglês → (capi, consegue); a última fala dela em inglês é a forma errada → (capi, erra_e_fica);
  - a Capy não diz e outro diz → (quem mais disse, outro_resolve); empate → **desconhecido (não conta)**;
  - vira_piada e aberto **não são deduzidos** (piada/fim aberto não se mede por regra) — só via campo.
- **Limite da dedução:** "outro_resolve" nos V3 = quem dá a resposta do exercício de escuta, não um desfecho de história.
  O JSON antigo não foi alterado.
- **Na T1 a checagem só AVISA** (`VARIEDADE_DESDE = (2, 0, 0)`): reprovar agora barraria 15 roteiros ainda não
  aprovados (4 nao_iniciado, 3 pendente_cota, 2 bloqueado_cota, 6 bloqueado_roteiro; + 6 já aprovados levariam aviso) e obrigaria reescrever roteiro aprovado, que é decisão do Felipe. A partir da T2, reprova.
  Para reprovar a T1 também: trocar para `(1, 0, 0)`.
- Testes: `scripts/teste_variedade.py` (novo) ok; `_check_roteiro.py` em todos os cafe-*.json: falhas idênticas antes/depois;
  `teste_publicar_longo.py` ok.

## Placar por (resolve, desfecho) — 45 roteiros da T1
| par | episódios |
|---|---|
| (capi, consegue) | 26 |
| (duda, outro_resolve) | 7 (todos V3) |
| desconhecido (não conta) | 6 |
| (hank, outro_resolve) | 2 (E02 V1, E03 V1) |
| (poppy, outro_resolve) | 2 (V3) |
| (lazy, outro_resolve) | 1 (E11 V3) |
| (donajaca, outro_resolve) | 1 (E19 V3) |
| erra_e_fica / vira_piada / aberto | **0** |

Nenhum episódio termina com a Capy errando e ficando assim, nem com o desfecho virando piada às custas do plano.

## Episódio por episódio
"sequência completa" = cada roteiro comparado com os 10 anteriores já escritos. "só aprovados" = o que o portão faz hoje.

| ep | V | arquivo | estoque | resolve | desfecho | sequência completa | só aprovados (portão hoje) |
|---|---|---|---|---|---|---|---|
| E01 | V1 | cafe-t1e01-hi-im-capy | publicado | capi | consegue | passa | passa |
| E01 | V2 | cafe-t1e01-hi-im-capy-v2 | publicado | capi | consegue | passa | passa |
| E01 | V3 | cafe-t1e01-hi-im-capy-v3 | publicado | desconhecido | desconhecido | passa | passa |
| E02 | V1 | cafe-t1e02-bye-see-you | publicado | hank | outro_resolve | passa | passa |
| E02 | V2 | cafe-t1e02-bye-see-you-v2 | publicado | capi | consegue | passa | passa |
| E02 | V3 | cafe-t1e02-bye-see-you-v3 | publicado | duda | outro_resolve | passa | passa |
| E03 | V1 | cafe-t1e03-whats-your-name | bloqueado_cota | hank | outro_resolve | passa | passa |
| E03 | V2 | cafe-t1e03-whats-your-name-v2 | bloqueado_cota | capi | consegue | passa | passa |
| E03 | V3 | cafe-t1e03-whats-your-name-v3 | bloqueado_cota | duda | outro_resolve | passa | passa |
| E06 | V1 | cafe-t1e06-shes-from-italy | aprovado | capi | consegue | REPROVA variedade | passa |
| E06 | V2 | cafe-t1e06-shes-from-italy-v2 | aprovado | capi | consegue | REPROVA variedade | REPROVA variedade |
| E06 | V3 | cafe-t1e06-shes-from-italy-v3 | aprovado | poppy | outro_resolve | passa | passa |
| E07 | V1 | cafe-t1e07-im-fine-thanks | bloqueado_cota | capi | consegue | REPROVA variedade | REPROVA variedade |
| E07 | V2 | cafe-t1e07-im-fine-thanks-v2 | bloqueado_cota | capi | consegue | REPROVA variedade | REPROVA variedade |
| E07 | V3 | cafe-t1e07-im-fine-thanks-v3 | bloqueado_cota | duda | outro_resolve | passa | passa |
| E11 | V1 | cafe-t1e11-im-brazilian | bloqueado_roteiro | capi | consegue | REPROVA variedade | REPROVA variedade |
| E11 | V2 | cafe-t1e11-im-brazilian-v2 | bloqueado_roteiro | capi | consegue | REPROVA variedade | REPROVA variedade |
| E11 | V3 | cafe-t1e11-im-brazilian-v3 | bloqueado_roteiro | lazy | outro_resolve | passa | passa |
| E12 | V1 | cafe-t1e12-my-number-is | bloqueado_roteiro | capi | consegue | REPROVA variedade | REPROVA variedade |
| E12 | V2 | cafe-t1e12-my-number-is-v2 | publicado_midia | capi | consegue | REPROVA variedade | REPROVA variedade |
| E12 | V3 | cafe-t1e12-my-number-is-v3 | publicado_midia | duda | outro_resolve | passa | passa |
| E13 | V1 | cafe-t1e13-how-old-are-you | bloqueado_roteiro | capi | consegue | REPROVA variedade | REPROVA variedade |
| E13 | V2 | cafe-t1e13-how-old-are-you-v2 | pendente_cota | capi | consegue | REPROVA variedade | REPROVA variedade |
| E13 | V3 | cafe-t1e13-how-old-are-you-v3 | bloqueado_roteiro | duda | outro_resolve | passa | passa |
| E14 | V1 | cafe-t1e14-this-is-my-friend | bloqueado_roteiro | capi | consegue | REPROVA variedade | REPROVA variedade |
| E14 | V2 | cafe-t1e14-this-is-my-friend-v2 | pendente_cota | capi | consegue | REPROVA variedade | REPROVA variedade |
| E14 | V3 | cafe-t1e14-this-is-my-friend-v3 | bloqueado_roteiro | desconhecido | desconhecido | passa | passa |
| E15 | V1 | cafe-t1e15-its-a-phone | bloqueado_roteiro | capi | consegue | REPROVA variedade | REPROVA variedade |
| E15 | V2 | cafe-t1e15-its-a-phone-v2 | pendente_cota | capi | consegue | REPROVA variedade | REPROVA variedade |
| E15 | V3 | cafe-t1e15-its-a-phone-v3 | bloqueado_roteiro | duda | outro_resolve | passa | passa |
| E16 | V1 | cafe-t1e16-im-tired | aprovado | capi | consegue | REPROVA variedade | REPROVA variedade |
| E16 | V2 | cafe-t1e16-im-tired-v2 | aprovado | capi | consegue | REPROVA variedade | REPROVA variedade |
| E16 | V3 | cafe-t1e16-im-tired-v3 | aprovado | poppy | outro_resolve | passa | passa |
| E17 | V1 | cafe-t1e17-how-much-is-it | aprovado | capi | consegue | REPROVA variedade | REPROVA variedade |
| E17 | V2 | cafe-t1e17-how-much-is-it-v2 | aprovado | capi | consegue | REPROVA variedade | REPROVA variedade |
| E17 | V3 | cafe-t1e17-how-much-is-it-v3 | bloqueado_cota | duda | outro_resolve | passa | passa |
| E18 | V1 | cafe-t1e18-this-is-my-mother | nao_iniciado | capi | consegue | REPROVA variedade | REPROVA variedade |
| E18 | V2 | cafe-t1e18-this-is-my-mother-v2 | nao_iniciado | capi | consegue | REPROVA variedade | REPROVA variedade |
| E18 | V3 | cafe-t1e18-this-is-my-mother-v3 | nao_iniciado | desconhecido | desconhecido | passa | passa |
| E19 | V1 | cafe-t1e19-im-a-doctor | nao_iniciado | desconhecido | desconhecido | passa | passa |
| E19 | V2 | cafe-t1e19-im-a-doctor-v2 | nao_iniciado | desconhecido | desconhecido | passa | passa |
| E19 | V3 | cafe-t1e19-im-a-doctor-v3 | nao_iniciado | donajaca | outro_resolve | passa | passa |
| E20 | V1 | cafe-t1e20-its-three-oclock | nao_iniciado | capi | consegue | REPROVA variedade | REPROVA variedade |
| E20 | V2 | cafe-t1e20-its-three-oclock-v2 | nao_iniciado | capi | consegue | REPROVA variedade | REPROVA variedade |
| E20 | V3 | cafe-t1e20-its-three-oclock-v3 | nao_iniciado | desconhecido | desconhecido | passa | passa |

## (3) T1 tem > 50% "Capy consegue": 5 roteiros AINDA SEM VOZ/RENDER que mais ajudam (só proposta)
Escolhidos entre os que o estoque.csv marca como **não tentados** no TTS (nao_iniciado, ou cota "não tentado").
Cada um muda 1–2 falas da cena **depois** do treino; a Capy continua dizendo a frase-alvo no treino (a aula fica igual).
Todos passam no `checar_roteiro_cafe` com a mudança (frase-alvo ≥ 5×, ≥ 3 bocas, inglês ≥ 35%) — simulado, não gravado.

| # | roteiro (estoque) | fala de hoje | proposta | novo par |
|---|---|---|---|---|
| 1 | E07 V2 cafe-t1e07-im-fine-thanks-v2 (bloqueado_cota, não tentado) | beat 13 capi: "Eu respondi pra ELA." | capi: "Ele já tinha ido. Respondi pra porta." (responde certo, tarde demais: o tema é "o gringo que não espera") | (capi, vira_piada) |
| 2 | E14 V2 cafe-t1e14-this-is-my-friend-v2 (pendente_cota, não tentado) | beats 12–13 capi: "This is my friend." / "Lazy." | duda: "This is my friend." (alvo) / duda: "Lazy. He's sleeping." (a Capy trava; a Duda apresenta o Lazy dormindo) | (duda, outro_resolve) |
| 3 | E15 V2 cafe-t1e15-its-a-phone-v2 (pendente_cota, não tentado) | beat 14 capi: "It's a phone." | capi: "It's a... a..." (trava; o Hank resolve no beat 15 que já existe: "...It's a phone.") | (hank, outro_resolve) |
| 4 | E18 V1 cafe-t1e18-this-is-my-mother (nao_iniciado) | beats 13–14: capi "Mike, this is my mother." / donajaca "Hi, Mike! Nice to meet you!" | capi: "Mike, this is... uh..." / donajaca: "I'm her mother! Hi, Mike!" (a mãe se apresenta sozinha) | (donajaca, outro_resolve) |
| 5 | E20 V1 cafe-t1e20-its-three-oclock (nao_iniciado) | beat 15 capi: "It's three o'clock!" | capi: "It's three... three what?" (trava; o Lazy resolve no beat 18 que já existe) | (lazy, outro_resolve) |

Gravar também `"resolve"`/`"desfecho"` nesses 5 JSONs. **Efeito medido (simulação):** (capi, consegue) cai de **58% → 47%**
(21/45) e os reprovados na sequência, de **22 → 16**. **Não basta para cumprir a regra** (≤ 3 de cada 10): os assuntos 6–17
já aprovados/rodados formam um bloco longo de (capi, consegue). Cumprir de verdade exige mexer em ~1 de cada 2 V1/V2 ou
começar a regra na T2.

## (4) Vocab: sequência de ciclos
Medido nos **65** `canal-idiomas/vocab/*.json` (a ordem dos ciclos vem do código, `src/vocab/timeline.ts`; o JSON só muda quantidades):
- **57/65 (88%)** com a mesma sequência: gancho → bloco+revisão → bloco+revisão → desafio → final rápido → fecho. Os outros 8 só têm 1 bloco a mais.
- Sequência fina (tamanho dos blocos, nº de ecos, onde cai a dica, itens do desafio): a mais comum se repete em **29/65**; 12 variantes no total, todas com 2 ecos por palavra.
- **Mesma fala nos 65/65**: "Agora sem a palavra. Qual é?" e "Agora tudo, cada vez mais rápido."
- **Mesmo elenco de papéis em 61/65**: apresenta Capy, dica Lazy, revisão Bolinha, final Hank.

Duas variações de estrutura (só proposta; precisam de mudança em `timeline.ts` + campo `estrutura` no JSON):
- **A — "Teste antes da aula":** abre com 1 objeto sem palavra + pergunta 3 s ("sabe qual é?"), resposta só depois; o desafio
  sai do fim e vira 1 item logo após cada bloco (recuperação imediata); final em ordem embaralhada. Muda o gancho e o miolo.
- **B — "Cena no balcão":** as palavras entram num pedido de cliente (cliente pede → Hank serve → palavra cola); quem
  apresenta gira por tema (Hank/Duda/Poppy, não só Capy); a revisão da Bolinha devolve 2 palavras de um tema antigo
  (revisão espaçada cruzada); falas de desafio/final saem de um banco de 4–5 versões. Muda papéis, falas fixas e o fim.
Alternar 1 tema A, 1 B, 1 atual (sem dado ainda: teste de 3 semanas, corte = retenção média do formato < mediana dos atuais).

## Decisão do Felipe
1. Aplicar as 5 mudanças acima nos roteiros aprovados? (sim/não, uma por uma)
2. A regra reprova a partir da T2 (hoje) ou já na T1 (`VARIEDADE_DESDE = (1, 0, 0)`, para a fábrica até reescrever)?
3. Vocab: testar A e B?
