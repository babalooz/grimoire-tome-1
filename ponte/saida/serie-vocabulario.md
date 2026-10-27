# CapyFala · Série de VOCABULÁRIO (estilo app, em vídeo) · v1 · 27/10/2026

Decisão do Felipe (27/10/2026): a sitcom do café fica como prática de conversa (3× por semana) e nasce esta série
diária de vocabulário: 1 tema por vídeo, 5 a 10 palavras, 61 a 75 s, repetição alta. Música entra depois (Lyria).

**Protótipo:** `vocab-numeros-1a10.mp4` no branch `midia` (commit `186fbee`), 73,4 s, portão APROVADO
(camada 1 ok: 1080×1920, yuv420p/tv/bt709, movimento 0–1 s = 0,231, −14,05 LUFS, pico −1,46 dBTP, zona segura ok;
juiz 8,2). Código em `main` (commit `8ba771d`). **Nada publicado nem agendado.**

---

## (a) O formato em 1 página

**Cenário e elenco:** o balcão do Bean There vira a vitrine. Hank atrás do balcão, Bolinha sentado no balcão,
Capy na frente à esquerda, 1 convidado na frente à direita (Lazy ou Duda, troca por bloco). Mesma arte, cores,
tipografia (Lilita One + Rubik) e zona segura (x 60–920, y 260–1436) da sitcom. Sem botão, sem A/B/C, sem XP, sem
corações, sem ranking. Nada de canção, palminha ou voz fina.

| Parte | Tempo (protótipo) | O que acontece | Regra que cumpre |
|---|---|---|---|
| Gancho | 0–3,5 s | close na Capy → corte seco no Hank (movimento 0,23 no 1º s) → plano aberto; a Capy fala em PT uma frase verdadeira ("Quatro números têm pegadinha"); a fileira 1–10 se monta no topo e as 4 armadilhas ganham "!" | movimento < 1 s; voz no frame 1; sem card parado (o título fica sobre a cena em movimento) |
| Palavra (×N) | ~4 s cada | os objetos entram 1 a 1 com a quantidade (a quantidade aparece ANTES da palavra) → a Capy diz → o adesivo de preço (dígito + palavra) cola no objeto NO QUADRO em que a voz começa → **sua vez!** (microfone + contador, pausa = fala + 1,0 s, mín. 1,5 s; trilha a zero; a cena não escurece) → eco de 2 outros personagens | palavra colada no objeto (±3 quadros, conferido por código); devagar = pausa, nunca fala esticada; 1 só amarelo por quadro (a palavra que está sendo dita) |
| Armadilha | dentro da palavra | chip lilás embaixo do adesivo ("th: língua entre os dentes · iii longo", "termina no v, sem i", "SEV-en", "termina no t, sem i"); "SEV" maior na palavra; a do three também é falada pelo Lazy em PT | português só de apoio; sem vermelho/risco (E01–E10) |
| Mini-revisão | fim de cada bloco | o Bolinha devolve as palavras do bloco; os objetos trocam a cada palavra e a fileira acende a da vez | blocos curtos (1-3, 4-6, 7-10) |
| Desafio | ~4 s | "Agora sem a palavra. Qual é?" → objeto sem a palavra (adesivo "?") + contador → a resposta | 1 pergunta, resposta no mesmo vídeo |
| Revisão final | ~7 s | as N palavras em ritmo crescente (respiro de 0,3 s caindo até 0,03 s), objetos trocando no tempo da voz | — |
| Fecho | ~4 s | "você já sabe 10 palavras ✓ · one → ten" + "qual foi o mais difícil? comenta aí" (Capy fala) | gatilho só verdadeiro; pergunta real de comentário |

**Contas do protótipo:** cada número em 5 bocas (Capy, 2 ecos, Bolinha, Hank) — mínimo pedido 3; a Capy nunca é a
última; 10 pausas "sua vez"; 51 falas em inglês, todas de 1 palavra. Selo "VOCAB 01 · você já sabe N palavras"
(N = palavras já apresentadas naquele segundo, conta real).

**1 tema novo = 1 JSON** (`canal-idiomas/vocab/<tema>.json`): palavras (en, pt, dígito/rótulo, objeto, quantidade,
armadilha opcional), blocos e quem ecoa cada bloco, quem apresenta/revisa/fecha, falas de apoio em PT, desafio, card,
trilha. Rodar: `bash scripts/make-vocab.sh vocab/<tema>.json` → `python3 scripts/portao.py vocab/<tema>.json`.
Objeto novo = 1 desenho em `src/vocab/objetos.tsx` (o resto do motor não muda).

**Voz (Gemini TTS, texto puro):** 1 pedido por personagem e idioma, palavras separadas por linha em branco; o áudio é
cortado nos silêncios (escolha casada com o tamanho de cada fala) e **cada corte é conferido por transcrição** num
modelo de texto do Gemini (cota separada). Protótipo: **7 pedidos** no `gemini-3.8-flash-lite-tts` (o mesmo modelo
da sitcom aprovada; o `gemini-3.8-flash-tts` não foi usado), 54 cortes, 54/54 conferidos. Vozes de
`docs/vozes-gemini.md` (Capy = Sulafat, Hank = Algenib, Lazy = Umbriel, Duda = Autonoe, Bolinha = Despina).
Cache no branch `voz-cache` em `public/audio/vocab/numeros/` (commit `fd26aad`).

**Música (pronto para receber):** `trilha` do JSON = `{src, lufs, loop_s}`. Hoje é o loop lo-fi do café que já
existia; a faixa do Lyria entra trocando só esse campo (ducking automático: −22 dB sob a voz, −18 nos respiros, zero
no "sua vez" e no desafio). `trilha: null` = sem música. A estrutura do vídeo não muda.

**Pontos fracos que o juiz anotou (para a v2, decisão do Felipe):** (1) os 10 ciclos de ~4 s são iguais demais no
meio — testar variar câmera/ordem dos ecos por bloco; (2) a revisão final acelera pouco (0,8 → 0,5 s por palavra);
(3) a Capy é o 1º modelo de pronúncia (pedido do formato), quando a regra 5 do estudo de voz prefere Hank/Lazy;
(4) five, seven e eight têm a armadilha só na tela (a dica falada do five foi cortada para caber em 75 s: com ela o
vídeo passava de 76 s).

---

## (b) Banco de temas · 60 dias · do zero ao A1

**Fonte de frequência (aberta e citada):**
- **OpenSubtitles 2018, lista de frequência de Hermit Dave** (`github.com/hermitdave/FrequencyWords`, conteúdo
  CC-BY-SA 4.0): frequência de palavra **falada** em legendas (perto da conversa da sitcom). A coluna "posto mediano"
  é a mediana do posto das palavras do tema nas 50 mil mais frequentes (1 = mais frequente). Calculado nesta tarefa.
- **NGSL 1.2 — New General Service List** (Browne, Culligan e Phillips, `newgeneralservicelist.com`, CC BY-SA 4.0):
  checagem por lema. Ela não traz números, dias, meses, países nem formas flexionadas (was, went), por isso não é a
  coluna principal.
- Sem Oxford 3000, English Vocabulary Profile ou qualquer lista proprietária. A **ordem** segue o consenso de
  sequência já aprovado (`docs/pesquisas/sequencia-oxford-cambridge.md`, só a ordem dos temas) e a grade da sitcom
  (`docs/grade-t1.md`): o tema de vocabulário vem **antes** do assunto da sitcom que usa aquelas palavras.
- Nada de tema infantil: sem animais de fazenda, brinquedos, formas geométricas ou "aprender a contar"; tudo
  acontece no café, no trabalho, na viagem, na cidade.

| Dia | Tema | Palavras (n) | Cena/objeto no café | Liga com a sitcom (assunto) | Posto mediano no OpenSubtitles |
|---|---|---|---|---|---|
| 1 | números 1–10 (protótipo) | one, two, three, four, five, six, seven, eight, nine, ten (10) | balcão: xícara…patas do Hank | 4 · One, two, three! | 487 |
| 2 | cumprimentos de balcão | hi, hello, bye, please, thanks, sorry, yes, no (8) | clientes entrando e saindo | 1 · Hi! I'm Capy. / 2 · Bye! | 165 |
| 3 | bebidas do café | coffee, tea, water, juice, milk, sugar (6) | copos no balcão | 17 · A coffee, please. | 1200 |
| 4 | quem é quem (pronomes) | I, you, he, she, we, they (6) | Capy aponta para o elenco | 5–6 · from Brazil / Italy | 18 |
| 5 | família 1 | mother, father, sister, brother, son, daughter (6) | porta-retratos da Dona Jaca | 18 · This is my mother. | 275 |
| 6 | números 11–20 | eleven, twelve, thirteen, fourteen, fifteen, sixteen, seventeen, eighteen, nineteen, twenty (10) | pedidos grandes, fila | 12 · My number is… | 7693 |
| 7 | dias da semana | monday, tuesday, wednesday, thursday, friday, saturday, sunday (7) | quadro de turnos do café | grade semanal | 2144 |
| 8 | coisas do bolso | phone, key, wallet, money, card, bag (6) | achados e perdidos do café | 15 · It's a phone. | 842 |
| 9 | comida do café | bread, egg, cake, sandwich, cookie, cheese (6) | vitrine | 17 · A coffee, please. | 2102 |
| 10 | países | brazil, canada, mexico, italy, japan, china (6) | bandeirinhas genéricas, malas | 5 · I'm from Brazil. | 2709 |
| 11 | nacionalidades | brazilian, american, mexican, italian, japanese, canadian (6) | clientes de vários países | 10–11 · Brazilian | 3235 |
| 12 | profissões | doctor, teacher, student, waiter, driver, nurse (6) | crachás de clientes | 19 · I'm a doctor. | 1431 |
| 13 | letras que o brasileiro troca | a, e, i, g, j, h, r, y (8) | letreiro do café | 8 · How do you spell it? | 1610 |
| 14 | cores (roupa e copo) | red, blue, green, black, white, yellow (6) | copos/camisetas | — | 699 |
| 15 | opostos 1 | big, small, hot, cold, new, old (6) | copos P/G, café quente/gelado | — | 373 |
| 16 | dezenas | twenty, thirty, forty, fifty, sixty, seventy, eighty, ninety, hundred (9) | preço na caixa | 13 · How old are you? | 5513 |
| 17 | partes do dia | morning, afternoon, evening, night, today, tonight (6) | janela do café | 20 · What time is it? | 292 |
| 18 | como você está | happy, sad, tired, hungry, angry, bored (6) | caras do elenco | 16 · I'm tired. | 944 |
| 19 | lugares da cidade | bank, hotel, airport, station, hospital, supermarket (6) | mapa na parede | — | 861 |
| 20 | verbos do dia 1 | eat, drink, sleep, work, go, come (6) | Capy faz a ação | — | 262 |
| 21 | cômodos da casa | kitchen, bathroom, bedroom, door, window, room (6) | videochamada da Dona Jaca | — | 1054 |
| 22 | roupas | shirt, pants, shoes, jacket, dress, hat (6) | cabideiro | — | 1391 |
| 23 | transporte | car, bus, train, plane, bike, taxi (6) | Capy indo trabalhar | — | 1083 |
| 24 | meses 1 | january, february, march, april, may, june (6) | calendário do café | — | 2621 |
| 25 | meses 2 | july, august, september, october, november, december (6) | calendário do café | — | 4104 |
| 26 | dinheiro | dollar, cent, price, cheap, expensive, change (6) | caixa registradora | 17 · How much is it? | 1925 |
| 27 | palavras de pergunta | what, where, who, when, how, why (6) | clientes perguntando | 3 · What's your name? | 72 |
| 28 | família 2 e amigos | husband, wife, friend, boyfriend, girlfriend, kid (6) | fotos no celular | 14 · This is my friend. | 421 |
| 29 | verbos do querer | like, love, want, need, have, know (6) | pedidos no balcão | — | 54 |
| 30 | corpo | head, hand, eye, mouth, leg, back (6) | Lazy se espreguiçando | — | 539 |
| 31 | tempo lá fora | sun, rain, hot, cold, wind, snow (6) | janela do café | — | 965 |
| 32 | almoço | rice, beans, chicken, meat, fish, salad (6) | prato do dia | — | 1937 |
| 33 | frutas | apple, banana, orange, lemon, grape, strawberry (6) | cesta de frutas | — | 4308 |
| 34 | onde está (lugar) | in, on, under, behind, between (5) | grãos e xícaras | — | 385 |
| 35 | móveis | table, chair, bed, sofa, lamp, shelf (6) | café e casa | — | 3117 |
| 36 | tempo livre | music, movie, game, book, sport, travel (6) | conversa no balcão | — | 669 |
| 37 | esportes | soccer, basketball, swimming, running, gym (5) | TV do bar | — | 2992 |
| 38 | verbos 2 | read, write, listen, speak, watch, play (6) | clientes no café | — | 413 |
| 39 | ordinais | first, second, third, fourth, fifth, last (6) | fila do café | — | 676 |
| 40 | celular | password, email, charger, battery, message, photo (6) | clientes no Wi-Fi | — | 4716 |
| 41 | frequência | always, usually, sometimes, never, often (5) | rotina do Hank | — | 529 |
| 42 | trabalho | meeting, boss, computer, desk, office, break (6) | cliente de escritório | 19 · I'm a doctor. | 599 |
| 43 | aeroporto | passport, ticket, gate, flight, seat, luggage (6) | viagem da Duda | — | 1744 |
| 44 | hotel | room, key, reservation, breakfast, towel, elevator (6) | viagem | — | 1897 |
| 45 | restaurante | menu, table, bill, tip, order, waiter (6) | jantar fora | — | 1566 |
| 46 | opostos 2 | good, bad, easy, hard, fast, slow (6) | — | — | 366 |
| 47 | descrever pessoas | tall, short, young, old, nice, funny (6) | clientes | — | 461 |
| 48 | rotina da manhã | wake, shower, breakfast, work, home (5) | manhã da Capy | — | 746 |
| 49 | supermercado | cart, cash, bag, receipt, line, sale (6) | compra do café | — | 1739 |
| 50 | saúde | sick, headache, fever, pharmacy, medicine, doctor (6) | Hank resfriado | — | 2299 |
| 51 | direções | left, right, straight, corner, street, block (6) | turista perdido | — | 653 |
| 52 | o que eu sei fazer (can) | swim, drive, cook, sing, dance (5) | — | — | 798 |
| 53 | passado que mais aparece | was, were, went, had, did, saw (6) | fim de semana | — | 90 |
| 54 | quando | today, tomorrow, yesterday, now, later, soon (6) | agenda | — | 338 |
| 55 | tamanhos e provar | small, medium, large, size, try, fit (6) | loja | — | 1272 |
| 56 | passeio | park, beach, museum, mall, church, square (6) | fim de semana | — | 1653 |
| 57 | redes sociais | post, like, follow, share, comment, video (6) | Poppy | — | 1119 |
| 58 | números grandes | hundred, thousand, million, half, dozen (5) | preços e placar | — | 1061 |
| 59 | verbos de movimento | walk, run, drive, fly, ride (5) | caminho do trabalho | — | 612 |
| 60 | falsos amigos da Duda | parents, push, pull, exit, library, college (6) | placas e conversa | — | 1033 |

**Avisos do banco:** 7 temas têm posto mediano acima de 3.000 (números 11–20, nacionalidades, dezenas, meses 2,
frutas, móveis, celular). Os de número e mês ficam porque o A1 exige (preço, idade, data); frutas, móveis e celular
são os primeiros a sair se o dado de retenção mandar. Temas com 5 palavras (onde está, esportes, frequência, rotina,
can, números grandes, movimento) cabem com folga; o motor aceita 5–10 sem mudança. Hoje só existem os 10 objetos dos números: cada tema concreto
pede 5–10 desenhos novos em `objetos.tsx`. Temas sem objeto (cumprimentos, pronomes, como você está, palavras de
pergunta, frequência, quando, verbos) precisam de um "quadro de cena" no lugar do objeto (personagem fazendo a ação):
o motor ainda não tem isso — é trabalho de código antes do dia 2.

---

## (c) Como encaixa na grade

| Dia | Vocabulário (todo dia) | Sitcom (3× por semana) |
|---|---|---|
| seg | tema do dia | **V1 APRENDER** do assunto da semana |
| ter | tema do dia | — |
| qua | tema do dia | **V2 PRATICAR** (história com o hype) |
| qui | tema do dia | — |
| sex | tema do dia | **V3 FIXAR** |
| sáb | tema do dia | — |
| dom | tema do dia | (compilação longa no YouTube, como já está na grade) |

- **Ordem:** o tema de vocabulário que alimenta um assunto da sitcom sai **2 a 5 dias antes** do V1 daquele assunto
  (ex.: números 1–10 antes do assunto 4; bebidas e comida do café antes do assunto 17). Na sitcom, a palavra já vista
  vira reconhecimento, não novidade.
- **Revisão espaçada (palavra volta no 3º–6º dia e no 10º–14º dia):** o desafio de cada vídeo ganha 2 objetos do
  Bolinha ("lembra dessa?"): 1 palavra do tema de **D−4** e 1 do tema de **D−12** (ex.: o vídeo do dia 16 pergunta
  1 palavra do dia 12 e 1 do dia 4). Custo de voz zero: a resposta já está no cache daquele tema. Custo de tempo
  ~3,5 s por objeto: para caber em 75 s, o tema do dia passa a ter 1 objeto no desafio e no máximo 8 palavras quando
  houver as 2 revisões (temas de 10 palavras ficam sem a revisão de D−12 e ela vai para a compilação de domingo).
  Isso ainda não está no motor (`desafio.itens` aceita só palavras do próprio tema): é o próximo passo de código.
- **Cortes:** cada vídeo rende 1 corte de 15–25 s (1 bloco inteiro), sem custo de voz.
- **Voz por dia:** 1 tema = 5 a 7 pedidos de TTS (1 por personagem/idioma). Com a cota grátis de ~10 pedidos/dia por
  modelo, o vocabulário diário ocupa quase toda a cota do `flash-lite-tts` e disputa com a sitcom. Opções para o
  Felipe decidir: (1) passar o vocabulário para 4 vozes por tema (Capy, Hank, 1 convidado, Bolinha) e PT só da Capy
  = 5 pedidos; (2) testar se o `gemini-3.8-flash-tts` soa igual (teste cego como o de 03/10) e dar a ele a sitcom;
  (3) plano pago do Gemini (preço não consultado nesta tarefa).

---

## (d) Texto de post do protótipo (regras do pacote do assunto 1)

Sem gatilho proibido, sem "música", "infantil", "criança", "aprender a contar", sem citar app concorrente, sem
"conta comigo". Contagem de caracteres feita por script.

**TikTok — legenda**

| Variante | Texto | Caracteres |
|---|---|---|
| **A · recomendada** | `números de 1 a 10 em inglês: 4 deles têm pegadinha pro brasileiro. fala junto em voz alta ☕` | 91 |
| B | `você fala "faivi" ou five? os números de 1 a 10 em inglês, devagar e sem pressa 🔢` | 81 |

Hashtags (ambas): `#capyfala #capybara #inglês #aprenderingles #inglesdozero`
*Por que A:* abre com a frase de busca ("números de 1 a 10 em inglês"), a promessa é verdadeira (são 4 armadilhas
marcadas no vídeo) e pede a ação que o vídeo ensina (falar em voz alta). B testa a abertura pela dor (o "faivi").

**YouTube Shorts — título + descrição**

| Variante | Título | Caracteres |
|---|---|---|
| **A · recomendada** | `Números de 1 a 10 em inglês (e as 4 pegadinhas) \| CapyFala` | 58 |
| B | `One to ten: números em inglês do zero \| VOCAB 01` | 48 |

Descrição: `Os números de one a ten em inglês, com o objeto na tela, pausa para você repetir e as 4 pegadinhas do brasileiro (three, five, seven, eight). VOCAB 01 · CapyFala.`
Hashtags: `#capyfala #inglês #inglesdozero`
*Por que A:* palavra-chave no começo ("números de 1 a 10 em inglês") e "inglês do zero" na hashtag (termo já medido
no pacote do assunto 1, vidIQ 11/10/2026).

---

**Próximo passo:** Felipe assiste `vocab-numeros-1a10.mp4` e decide (formato ok? Capy como 1ª voz? dica falada nas
4 armadilhas, mesmo passando de 75 s?).
