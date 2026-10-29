# CapyFala · Série PALAVRAS · banco 2 (6 meses, temas 61–180) · 29/10/2026

Pedido do Felipe (29/10): ampliar o banco de vocabulário para ~6 meses, do zero ao A2, com fonte de frequência aberta,
cenários e paletas variados, nada infantil, temas de data marcados até abril/2027, e os JSONs dos próximos 60 temas
prontos. **Tudo no papel: nenhuma voz, música ou vídeo foi gerado; nada foi publicado nem agendado.**

Continua `serie-vocabulario.md` (banco 1, temas 1–60). Numeração dos posts = regra de CLAUDE.md (28/10):
**`Palavras #N · `** no começo do título/legenda, N = ordem em que vai ao ar (= VOCAB NN do `publicados.csv`),
e a descrição termina com `anterior: Palavras #N−1`.

## 1. Resultado

- **Fila de 176 temas, 1 por dia: Palavras #06 (02/11/2026) → #181 em 26/04/2027 (seg)**. Somando os 5 que já existem
  (#01 números, #02 Halloween, #03 cumprimentos, #04 bebidas, #05 pronomes), são 181 vídeos ≈ 6 meses.
- **Banco 2 = 120 temas novos (61–180)**: 10 de DATA (61–70) + 40 de A1 de vida real (71–110) + 70 de A2 (111–180).
- **JSONs escritos para #06–#65** (02/11 → 31/12): `canal-idiomas/vocab/vocab-NN-tema.json` (temas 5–60 do banco 1 +
  Thanksgiving, Black Friday, Natal e Ano-Novo). Posts já com `Palavras #N · ` e `anterior:`.
- **Erro oculto (bloqueia a rotina):** só **1 dos 60** (#50, descrever pessoas) renderiza com o motor de hoje. Os outros 59 citam
  **182 desenhos** que ainda não existem em `src/vocab/objetos.tsx` e **25 ações** de cena que
  `src/vocab/cena.tsx` não tem. E `src/Vocab.tsx:144` faz `LAYOUT[pal.objeto!].h` sem checar: objeto sem desenho **derruba o
  render** (não sai vídeo vazio, sai erro). Cada JSON lista o que falta no campo `precisa`. Ver §6.

## 2. Fonte de frequência (aberta e citada)

- **OpenSubtitles 2018 · lista de Hermit Dave** (`github.com/hermitdave/FrequencyWords`, arquivo `content/2018/en/en_50k.txt`,
  conteúdo CC-BY-SA 4.0), baixada nesta tarefa em 29/10/2026. Frequência de palavra **falada** (legendas de filme e série).
- **Posto mediano** = mediana do posto das palavras do tema entre as 50 mil mais frequentes (1 = mais frequente), calculado por
  script nesta tarefa. Expressão de 2+ palavras ou contração = posto da palavra mais rara dela (a lista separa `don't` em `don` + `t`).
  ">50 mil" = fora da lista.
- **NGSL 1.2** (Browne, Culligan e Phillips, CC BY-SA 4.0) segue como checagem de lema do banco 1; **não** foi recalculada aqui.
- Nenhuma lista proprietária (sem Oxford 3000, sem English Vocabulary Profile). A ORDEM segue o consenso já aprovado
  (`sequencia-oxford-cambridge.md`): sobrevivência e A1 primeiro, passado/comparativo/futuro no A2.

## 3. Temas de DATA (até abril/2027)

| Banco | Tema | Data do evento | Vai ao ar | Post | Palavras | Fonte da data |
|---|---|---|---|---|---|---|
| 61 | **Thanksgiving** | 26/11/2026 | **24/11/2026 (ter)** | Palavras #28 | turkey, pie, dinner, family, thankful, corn, potato | 4ª quinta de novembro |
| 62 | **Black Friday** | 27/11/2026 | **26/11/2026 (qui)** | Palavras #30 | sale, deal, discount, price, cheap, store, line, buy | dia seguinte ao Thanksgiving |
| 63 | **Natal (Christmas)** | 25/12/2026 | **22/12/2026 (ter)** | Palavras #56 | Christmas, tree, gift, lights, star, snow, Santa, party | fixo |
| 64 | **Ano-Novo (New Year's Eve)** | 31/12/2026 | **30/12/2026 (qua)** | Palavras #64 | midnight, party, fireworks, countdown, wish, goal, cheers | fixo |
| 65 | **Carnaval explicado pro gringo** | 06–09/02/2027 | **05/02/2027 (sex)** | Palavras #101 | parade, costume, dance, drum, crowd, street, glitter | Carnaval: terça 09/02/2027 (Páscoa 28/03 − 47 dias) |
| 66 | **Super Bowl** | 14/02/2027 | **11/02/2027 (qui)** | Palavras #107 | game, team, ball, score, win, lose, fan, halftime | Super Bowl LXI, SoFi Stadium (NFL; fontes: Fox LA, fbschedules, acesso 29/10/2026) |
| 67 | **Valentine's Day** | 14/02/2027 | **13/02/2027 (sáb)** | Palavras #109 | love, heart, date, flowers, chocolate, card, kiss | Valentine's Day, mesmo dia do Super Bowl |
| 68 | **Oscar** | 14/03/2027 | **12/03/2027 (sex)** | Palavras #136 | movie, actor, actress, director, award, winner, best | 99º Oscar (Academia/ABC; TheWrap e Wikipedia, acesso 29/10/2026; 'sujeito a mudança') |
| 69 | **St. Patrick's Day** | 17/03/2027 | **16/03/2027 (ter)** | Palavras #140 | green, lucky, luck, gold, Irish, parade, hat | fixo |
| 70 | **Páscoa** | 28/03/2027 | **26/03/2027 (sex)** | Palavras #150 | Easter, egg, chocolate, bunny, spring, holiday | Páscoa 2027 (computus) |

- Halloween (31/10) já saiu como Palavras #02. **Super Bowl e Valentine's caem no mesmo domingo (14/02/2027)**: Super Bowl na
  quinta 11/02, Valentine's no sábado 13/02, Carnaval na sexta 05/02 (antes do feriado). Oscar 14/03 → sexta 12/03.
- Carnaval não é data do mundo anglófono: o tema é "explicar o Carnaval para um gringo" (turista no bloco), assim puxa o inglês.
- Páscoa sem cara de criança: brunch de adultos, chocolate, feriado ("bunny" só como a marca do chocolate na vitrine).

## 4. Calendário completo da fila (#06 → #181)

JSON = já escrito em `canal-idiomas/vocab/`. Posto = posto mediano no OpenSubtitles. ⭐ = data.

| Post | Vai ao ar | Banco | Tema | Palavras | Posto | JSON |
|---|---|---|---|---|---|---|
| #06 | 02/11/2026 (seg) | 5 | família | mother, father, sister, brother, son, daughter | 275 | ✓ |
| #07 | 03/11/2026 (ter) | 6 | números de 11 a 20 | eleven, twelve, thirteen, fourteen, fifteen, sixteen, seventeen, eighteen, nineteen, twenty | 7.693 | ✓ |
| #08 | 04/11/2026 (qua) | 7 | dias da semana | Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday | 2.144 | ✓ |
| #09 | 05/11/2026 (qui) | 8 | coisas do bolso | phone, key, wallet, money, card, bag | 842 | ✓ |
| #10 | 06/11/2026 (sex) | 9 | comida do café | bread, egg, cake, sandwich, cookie, cheese | 2.102 | ✓ |
| #11 | 07/11/2026 (sáb) | 10 | países | Brazil, Canada, Mexico, Italy, Japan, China | 2.709 | ✓ |
| #12 | 08/11/2026 (dom) | 11 | nacionalidades | Brazilian, American, Mexican, Italian, Japanese, Canadian | 3.235 | ✓ |
| #13 | 09/11/2026 (seg) | 12 | profissões | doctor, teacher, student, waiter, driver, nurse | 1.431 | ✓ |
| #14 | 10/11/2026 (ter) | 13 | letras que o brasileiro troca | A, E, I, G, J, H, R, Y | 1.610 | ✓ |
| #15 | 11/11/2026 (qua) | 14 | cores | red, blue, green, black, white, yellow | 699 | ✓ |
| #16 | 12/11/2026 (qui) | 15 | opostos 1 | big, small, hot, cold, new, old | 373 | ✓ |
| #17 | 13/11/2026 (sex) | 16 | dezenas | twenty, thirty, forty, fifty, sixty, seventy, eighty, ninety, hundred | 5.513 | ✓ |
| #18 | 14/11/2026 (sáb) | 17 | partes do dia | morning, afternoon, evening, night, today, tonight | 292 | ✓ |
| #19 | 15/11/2026 (dom) | 18 | como você está | happy, sad, tired, hungry, angry, bored | 944 | ✓ |
| #20 | 16/11/2026 (seg) | 19 | lugares da cidade | bank, hotel, airport, station, hospital, supermarket | 861 | ✓ |
| #21 | 17/11/2026 (ter) | 20 | verbos do dia | eat, drink, sleep, work, go, come | 262 | ✓ |
| #22 | 18/11/2026 (qua) | 21 | cômodos da casa | kitchen, bathroom, bedroom, door, window, room | 1.054 | ✓ |
| #23 | 19/11/2026 (qui) | 22 | roupas | shirt, pants, shoes, jacket, dress, hat | 1.391 | ✓ |
| #24 | 20/11/2026 (sex) | 23 | transporte | car, bus, train, plane, bike, taxi | 1.083 | ✓ |
| #25 | 21/11/2026 (sáb) | 24 | meses de janeiro a junho | January, February, March, April, May, June | 2.621 | ✓ |
| #26 | 22/11/2026 (dom) | 25 | meses de julho a dezembro | July, August, September, October, November, December | 4.104 | ✓ |
| #27 | 23/11/2026 (seg) | 26 | dinheiro | dollar, cent, price, cheap, expensive, change | 1.925 | ✓ |
| #28 | 24/11/2026 (ter) | 61 | ⭐ Thanksgiving | turkey, pie, dinner, family, thankful, corn, potato | 3.152 | ✓ |
| #29 | 25/11/2026 (qua) | 27 | palavras de pergunta | what, where, who, when, how, why | 72 | ✓ |
| #30 | 26/11/2026 (qui) | 62 | ⭐ Black Friday | sale, deal, discount, price, cheap, store, line, buy | 1.106 | ✓ |
| #31 | 27/11/2026 (sex) | 28 | família 2 e amigos | husband, wife, friend, boyfriend, girlfriend, kid | 421 | ✓ |
| #32 | 28/11/2026 (sáb) | 29 | verbos do querer | like, love, want, need, have, know | 54 | ✓ |
| #33 | 29/11/2026 (dom) | 30 | corpo | head, hand, eye, mouth, leg, back | 539 | ✓ |
| #34 | 30/11/2026 (seg) | 31 | tempo lá fora | sun, rain, hot, cold, wind, snow | 965 | ✓ |
| #35 | 01/12/2026 (ter) | 32 | almoço | rice, beans, chicken, meat, fish, salad | 1.937 | ✓ |
| #36 | 02/12/2026 (qua) | 33 | frutas | apple, banana, orange, lemon, grape, strawberry | 4.308 | ✓ |
| #37 | 03/12/2026 (qui) | 34 | onde está | in, on, under, behind, between, next to | 315 | ✓ |
| #38 | 04/12/2026 (sex) | 35 | móveis | table, chair, bed, sofa, lamp, shelf | 3.117 | ✓ |
| #39 | 05/12/2026 (sáb) | 36 | tempo livre | music, movie, game, book, sport, travel | 669 | ✓ |
| #40 | 06/12/2026 (dom) | 37 | esportes | soccer, basketball, swimming, running, gym, tennis | 3.490 | ✓ |
| #41 | 07/12/2026 (seg) | 38 | verbos 2 | read, write, listen, speak, watch, play | 413 | ✓ |
| #42 | 08/12/2026 (ter) | 39 | ordinais | first, second, third, fourth, fifth, last | 676 | ✓ |
| #43 | 09/12/2026 (qua) | 40 | celular | password, email, charger, battery, message, photo | 4.716 | ✓ |
| #44 | 10/12/2026 (qui) | 41 | frequência | always, usually, often, sometimes, never, every day | 371 | ✓ |
| #45 | 11/12/2026 (sex) | 42 | trabalho | meeting, boss, computer, desk, office, break | 599 | ✓ |
| #46 | 12/12/2026 (sáb) | 43 | aeroporto | passport, ticket, gate, flight, seat, luggage | 1.744 | ✓ |
| #47 | 13/12/2026 (dom) | 44 | hotel | room, key, reservation, breakfast, towel, elevator | 1.897 | ✓ |
| #48 | 14/12/2026 (seg) | 45 | restaurante | menu, table, order, waiter, bill, tip | 1.566 | ✓ |
| #49 | 15/12/2026 (ter) | 46 | opostos 2 | good, bad, easy, hard, fast, slow | 366 | ✓ |
| #50 | 16/12/2026 (qua) | 47 | descrever pessoas | tall, short, young, smart, nice, funny | 705 | ✓ |
| #51 | 17/12/2026 (qui) | 48 | rotina da manhã | wake up, shower, breakfast, work, lunch, home | 811 | ✓ |
| #52 | 18/12/2026 (sex) | 49 | supermercado | cart, cash, bag, receipt, line, sale | 1.739 | ✓ |
| #53 | 19/12/2026 (sáb) | 50 | saúde | sick, headache, fever, pharmacy, medicine, doctor | 2.299 | ✓ |
| #54 | 20/12/2026 (dom) | 51 | direções | left, right, straight, corner, street, block | 653 | ✓ |
| #55 | 21/12/2026 (seg) | 52 | o que eu sei fazer (can) | swim, drive, cook, sing, dance, fix | 861 | ✓ |
| #56 | 22/12/2026 (ter) | 63 | ⭐ Natal | Christmas, tree, gift, lights, star, snow, Santa, party | 1.073 | ✓ |
| #57 | 23/12/2026 (qua) | 53 | o passado que mais aparece | was, were, went, had, did, saw | 90 | ✓ |
| #58 | 24/12/2026 (qui) | 54 | quando | today, tomorrow, yesterday, now, later, soon | 338 | ✓ |
| #59 | 25/12/2026 (sex) | 55 | tamanhos e provar | small, medium, large, size, try, fit | 1.272 | ✓ |
| #60 | 26/12/2026 (sáb) | 56 | passeio | park, beach, museum, mall, church, square | 1.653 | ✓ |
| #61 | 27/12/2026 (dom) | 57 | redes sociais | post, like, follow, share, comment, video | 1.119 | ✓ |
| #62 | 28/12/2026 (seg) | 58 | números grandes | hundred, thousand, million, billion, half, dozen | 1.077 | ✓ |
| #63 | 29/12/2026 (ter) | 59 | verbos de movimento | walk, run, drive, fly, ride, jump | 690 | ✓ |
| #64 | 30/12/2026 (qua) | 64 | ⭐ Ano-Novo | midnight, party, fireworks, countdown, wish, goal, cheers | 2.166 | ✓ |
| #65 | 31/12/2026 (qui) | 60 | falsos amigos | parents, push, pull, exit, library, college | 1.033 | ✓ |
| #66 | 01/01/2027 (sex) | 71 | horas | o'clock, half, quarter, past, to, minute, hour | 575 | — |
| #67 | 02/01/2027 (sáb) | 72 | rotina da noite | cook, dinner, dishes, relax, bed, alarm | 1.155 | — |
| #68 | 03/01/2027 (dom) | 73 | tarefas de casa | clean, wash, laundry, trash, dishes, floor | 2.110 | — |
| #69 | 04/01/2027 (seg) | 74 | utensílios de cozinha | knife, fork, spoon, plate, glass, cup, pan | 2.105 | — |
| #70 | 05/01/2027 (ter) | 75 | legumes da feira | tomato, onion, potato, carrot, garlic, lettuce | 7.474 | — |
| #71 | 06/01/2027 (qua) | 76 | comprando na feira | fresh, ripe, kilo, pound, bag, cash | 2.654 | — |
| #72 | 07/01/2027 (qui) | 77 | café da manhã americano | toast, butter, bacon, pancakes, cereal, jam | 4.059 | — |
| #73 | 08/01/2027 (sex) | 78 | fast food | burger, fries, pizza, soda, ketchup, napkin | 5.069 | — |
| #74 | 09/01/2027 (sáb) | 79 | sabores | sweet, salty, sour, spicy, bitter, delicious | 5.190 | — |
| #75 | 10/01/2027 (dom) | 80 | como é o lugar | clean, dirty, quiet, noisy, crowded, empty | 1.202 | — |
| #76 | 11/01/2027 (seg) | 81 | praia | sand, wave, towel, sunscreen, umbrella, ocean | 3.472 | — |
| #77 | 12/01/2027 (ter) | 82 | cumprimentos 2 | how are you, what's up, nice to meet you, see you, take care, good night | 208 | — |
| #78 | 13/01/2027 (qua) | 83 | estações do ano | spring, summer, fall, autumn, winter, season | 1.778 | — |
| #79 | 14/01/2027 (qui) | 84 | tempo 2 | cloudy, windy, rainy, foggy, storm, degrees | 10.407 | — |
| #80 | 15/01/2027 (sex) | 85 | academia | weights, mat, stretch, push-up, rest, trainer | 8.162 | — |
| #81 | 16/01/2027 (sáb) | 86 | corpo 2 | arm, foot, knee, shoulder, neck, stomach, finger | 1.762 | — |
| #82 | 17/01/2027 (dom) | 87 | hospital | emergency, appointment, patient, pain, blood, insurance | 1.293 | — |
| #83 | 18/01/2027 (seg) | 88 | sintomas | cough, cold, flu, sore throat, stomachache, dizzy | 5.506 | — |
| #84 | 19/01/2027 (ter) | 89 | farmácia | pill, cream, bandage, prescription, drops, vitamins | 5.126 | — |
| #85 | 20/01/2027 (qua) | 90 | cabeleireiro | haircut, short, long, curly, straight, beard | 2.355 | — |
| #86 | 21/01/2027 (qui) | 91 | aparência | hair, blonde, curly, glasses, beard, tattoo | 3.633 | — |
| #87 | 22/01/2027 (sex) | 92 | personalidade | kind, shy, smart, lazy, friendly, rude, honest | 2.483 | — |
| #88 | 23/01/2027 (sáb) | 93 | sentimentos 2 | excited, nervous, scared, worried, proud, surprised | 1.037 | — |
| #89 | 24/01/2027 (dom) | 94 | família 3 | grandma, grandpa, uncle, aunt, cousin, baby | 1.277 | — |
| #90 | 25/01/2027 (seg) | 95 | eventos da vida | birthday, wedding, anniversary, graduation, gift, guest | 1.344 | — |
| #91 | 26/01/2027 (ter) | 96 | festa | invite, guest, dance, music, snacks, host | 1.797 | — |
| #92 | 27/01/2027 (qua) | 97 | pedido no café 2 | iced, decaf, oat milk, latte, to go, for here | 10.409 | — |
| #93 | 28/01/2027 (qui) | 98 | alugar apartamento | rent, apartment, neighbor, bills, deposit, building | 2.436 | — |
| #94 | 29/01/2027 (sex) | 99 | casa por dentro | fridge, stove, sink, mirror, closet, carpet | 3.726 | — |
| #95 | 30/01/2027 (sáb) | 100 | mudança | box, move, truck, heavy, carry, pack | 1.047 | — |
| #96 | 31/01/2027 (dom) | 101 | coisas do escritório | pen, paper, printer, folder, screen, keyboard | 5.755 | — |
| #97 | 01/02/2027 (seg) | 102 | computador e internet | Wi-Fi, laptop, download, click, link, website, app | 5.356 | — |
| #98 | 02/02/2027 (ter) | 103 | ligações | call, answer, busy, voicemail, ring, text | 790 | — |
| #99 | 03/02/2027 (qua) | 104 | e-mail de trabalho | send, reply, attach, subject, deadline, inbox | 6.258 | — |
| #100 | 04/02/2027 (qui) | 105 | reunião online | mute, camera, screen, share, join, link | 1.746 | — |
| #101 | 05/02/2027 (sex) | 65 | ⭐ Carnaval explicado pro gringo | parade, costume, dance, drum, crowd, street, glitter | 3.232 | — |
| #102 | 06/02/2027 (sáb) | 106 | procurando emprego | job, interview, salary, resume, hire, apply | 3.036 | — |
| #103 | 07/02/2027 (dom) | 107 | profissões 2 | lawyer, engineer, chef, cashier, manager, mechanic | 2.732 | — |
| #104 | 08/02/2027 (seg) | 108 | banco | account, ATM, withdraw, deposit, balance, card | 3.773 | — |
| #105 | 09/02/2027 (ter) | 109 | pagar | cash, credit card, debit, pay, split, total | 1.620 | — |
| #106 | 10/02/2027 (qua) | 110 | entregas | package, delivery, address, mail, zip code, doorbell | 2.811 | — |
| #107 | 11/02/2027 (qui) | 66 | ⭐ Super Bowl | game, team, ball, score, win, lose, fan, halftime | 743 | — |
| #108 | 12/02/2027 (sex) | 111 | passado com -ed som de t | worked, walked, talked, liked, watched, stopped | 969 | — |
| #109 | 13/02/2027 (sáb) | 67 | ⭐ Valentine's Day | love, heart, date, flowers, chocolate, card, kiss | 751 | — |
| #110 | 14/02/2027 (dom) | 112 | passado com -ed som de d | played, called, lived, loved, opened, cleaned | 1.097 | — |
| #111 | 15/02/2027 (seg) | 113 | passado com -ed som de id | wanted, needed, started, waited, visited, decided | 731 | — |
| #112 | 16/02/2027 (ter) | 114 | passado irregular 1 | ate, drank, slept, came, got, made | 988 | — |
| #113 | 17/02/2027 (qua) | 115 | passado irregular 2 | bought, said, told, took, gave, found | 274 | — |
| #114 | 18/02/2027 (qui) | 116 | passado irregular 3 | thought, felt, left, met, paid, sent | 533 | — |
| #115 | 19/02/2027 (sex) | 117 | marcadores de passado | ago, last, already, before, after, yesterday | 225 | — |
| #116 | 20/02/2027 (sáb) | 118 | futuro | will, going to, next, someday, maybe, plan | 200 | — |
| #117 | 21/02/2027 (dom) | 119 | at, on, in (tempo) | at, on, in, until, since, during | 182 | — |
| #118 | 22/02/2027 (seg) | 120 | quantidades | some, any, much, many, a lot, a little, few | 135 | — |
| #119 | 23/02/2027 (ter) | 121 | palavras que ligam frases | and, but, because, so, or, then | 64 | — |
| #120 | 24/02/2027 (qua) | 122 | comparar | bigger, smaller, better, worse, cheaper, faster | 1.323 | — |
| #121 | 25/02/2027 (qui) | 123 | o melhor e o pior | biggest, best, worst, cheapest, most, least | 783 | — |
| #122 | 26/02/2027 (sex) | 124 | verbos de 2 palavras em casa | wake up, get up, turn on, turn off, put on, take off | 261 | — |
| #123 | 27/02/2027 (sáb) | 125 | verbos de 2 palavras na rua | get in, get out, pick up, drop off, come back, go out | 66 | — |
| #124 | 28/02/2027 (dom) | 126 | dar opinião | think, agree, disagree, sure, really, maybe | 146 | — |
| #125 | 01/03/2027 (seg) | 127 | respostas curtas | of course, no problem, exactly, never mind, no way, sure | 238 | — |
| #126 | 02/03/2027 (ter) | 128 | educação | excuse me, pardon, you're welcome, my bad, no worries, after you | 914 | — |
| #127 | 03/03/2027 (qua) | 129 | aeroporto 2 | check-in, boarding, delay, departure, arrival, terminal | 5.938 | — |
| #128 | 04/03/2027 (qui) | 130 | imigração | customs, visa, declare, purpose, stay, border | 3.955 | — |
| #129 | 05/03/2027 (sex) | 131 | dentro do avião | window, aisle, seatbelt, blanket, landing, takeoff | 5.852 | — |
| #130 | 06/03/2027 (sáb) | 132 | problemas no hotel | front desk, checkout, upgrade, noisy, broken, housekeeping | 9.387 | — |
| #131 | 07/03/2027 (dom) | 133 | turismo | tour, guide, souvenir, view, sightseeing, landmark | 5.587 | — |
| #132 | 08/03/2027 (seg) | 134 | câmbio | exchange, rate, fee, currency, coins, bills | 3.738 | — |
| #133 | 09/03/2027 (ter) | 135 | metrô e trem | subway, platform, stop, transfer, schedule, fare | 3.993 | — |
| #134 | 10/03/2027 (qua) | 136 | carro de aplicativo | ride, pickup, traffic, destination, trunk, rating | 4.195 | — |
| #135 | 11/03/2027 (qui) | 137 | carro e posto | gas, tire, oil, parking, license, speed | 1.884 | — |
| #136 | 12/03/2027 (sex) | 68 | ⭐ Oscar | movie, actor, actress, director, award, winner, best | 2.141 | — |
| #137 | 13/03/2027 (sáb) | 138 | cidade 2 | bridge, traffic light, crosswalk, sidewalk, downtown, neighborhood | 2.762 | — |
| #138 | 14/03/2027 (dom) | 139 | emergência | help, police, fire, lost, stolen, ambulance | 402 | — |
| #139 | 15/03/2027 (seg) | 140 | documentos | ID, form, sign, last name, date of birth, copy | 1.375 | — |
| #140 | 16/03/2027 (ter) | 69 | ⭐ St. Patrick's Day | green, lucky, luck, gold, Irish, parade, hat | 1.023 | — |
| #141 | 17/03/2027 (qua) | 141 | compras online | cart, checkout, shipping, refund, review, order | 5.735 | — |
| #142 | 18/03/2027 (qui) | 142 | na loja de roupas | fitting room, try on, return, exchange, discount, tag | 3.376 | — |
| #143 | 19/03/2027 (sex) | 143 | roupas 2 | sweater, jeans, socks, sneakers, coat, shorts | 5.355 | — |
| #144 | 20/03/2027 (sáb) | 144 | acessórios | watch, glasses, ring, necklace, belt, backpack | 2.362 | — |
| #145 | 21/03/2027 (dom) | 145 | cinema | ticket, seat, popcorn, screen, trailer, subtitles | 2.652 | — |
| #146 | 22/03/2027 (seg) | 146 | séries | show, episode, season, spoiler, binge, remote | 3.146 | — |
| #147 | 23/03/2027 (ter) | 147 | show de música | concert, band, singer, song, stage, fan | 1.527 | — |
| #148 | 24/03/2027 (qua) | 148 | games | level, player, controller, online, save, quit | 1.653 | — |
| #149 | 25/03/2027 (qui) | 149 | basquete | court, shot, point, foul, coach, rebound | 1.138 | — |
| #150 | 26/03/2027 (sex) | 70 | ⭐ Páscoa | Easter, egg, chocolate, bunny, spring, holiday | 2.303 | — |
| #151 | 27/03/2027 (sáb) | 150 | futebol em inglês | goal, field, referee, penalty, match, kick | 1.820 | — |
| #152 | 28/03/2027 (dom) | 151 | redes sociais 2 | profile, followers, story, live, hashtag, viral | 5.364 | — |
| #153 | 29/03/2027 (seg) | 152 | gírias que dá pra usar | cool, awesome, chill, vibe, cringe, legit | 5.449 | — |
| #154 | 30/03/2027 (ter) | 153 | internet com problema | slow, crash, update, login, reset, signal | 4.013 | — |
| #155 | 31/03/2027 (qua) | 154 | celular 2 | notification, screenshot, volume, ringtone, storage, airplane mode | 11.128 | — |
| #156 | 01/04/2027 (qui) | 155 | natureza | river, lake, mountain, forest, island, sky | 1.441 | — |
| #157 | 02/04/2027 (sex) | 156 | adjetivos de opinião | great, amazing, terrible, boring, interesting, weird | 761 | — |
| #158 | 03/04/2027 (sáb) | 157 | cores 2 | pink, purple, orange, brown, gray, gold | 2.816 | — |
| #159 | 04/04/2027 (dom) | 158 | pets | dog, cat, pet, vet, leash, feed | 2.400 | — |
| #160 | 05/04/2027 (seg) | 159 | supermercado 2 | aisle, frozen, dairy, bakery, organic, coupon | 8.054 | — |
| #161 | 06/04/2027 (ter) | 160 | verbos de cozinha | cut, boil, fry, bake, mix, add | 4.008 | — |
| #162 | 07/04/2027 (qua) | 161 | receita | recipe, ingredients, oven, bowl, cup, pinch | 5.046 | — |
| #163 | 08/04/2027 (qui) | 162 | restaurante 2 | starter, main course, dessert, check, leftovers, refill | 7.728 | — |
| #164 | 09/04/2027 (sex) | 163 | reclamar com educação | wrong, missing, late, broken, complaint, fix | 827 | — |
| #165 | 10/04/2027 (sáb) | 164 | pedir favor | borrow, lend, favor, help, mind, hold | 740 | — |
| #166 | 11/04/2027 (dom) | 165 | hobbies | hobby, painting, cooking, reading, gardening, yoga | 4.089 | — |
| #167 | 12/04/2027 (seg) | 166 | frequência 2 | once, twice, daily, weekend, rarely, every week | 1.303 | — |
| #168 | 13/04/2027 (ter) | 167 | estudando inglês | word, sentence, mean, spell, repeat, practice | 1.743 | — |
| #169 | 14/04/2027 (qua) | 168 | curso | course, class, test, grade, notes, question | 796 | — |
| #170 | 15/04/2027 (qui) | 169 | dinheiro 3 | save, spend, earn, owe, budget, afford | 1.388 | — |
| #171 | 16/04/2027 (sex) | 170 | horário | early, late, on time, schedule, hurry, wait | 453 | — |
| #172 | 17/04/2027 (sáb) | 171 | lugares 2 | post office, police station, gas station, parking lot, laundromat, drugstore | 2.128 | — |
| #173 | 18/04/2027 (dom) | 172 | trabalho 2 | coworker, shift, overtime, day off, promotion, raise | 3.369 | — |
| #174 | 19/04/2027 (seg) | 173 | falsos amigos 2 | actually, pretend, attend, eventually, assist, sensible | 2.539 | — |
| #175 | 20/04/2027 (ter) | 174 | falsos amigos 3 | novel, lecture, notice, mayor, data, fabric | 2.903 | — |
| #176 | 21/04/2027 (qua) | 175 | o som do th | think, thing, this, that, weather, birthday | 102 | — |
| #177 | 22/04/2027 (qui) | 176 | o h soprado | house, hot, happy, hair, hotel, hospital | 580 | — |
| #178 | 23/04/2027 (sex) | 177 | i curto e i longo | ship, sheep, live, leave, sit, seat | 564 | — |
| #179 | 24/04/2027 (sáb) | 178 | contrações | I'm, you're, don't, can't, it's, let's | 769 | — |
| #180 | 25/04/2027 (dom) | 179 | frases de sobrevivência | I don't understand, slowly, again, louder, how do you say, what does it mean | 477 | — |
| #181 | 26/04/2027 (seg) | 180 | as 10 palavras mais faladas | you, I, the, to, a, it, and, that, is, what | 6 | — |

## 5. Banco 2 em detalhe (temas 61–180)

Cenário e paleta = pedido para o diretor de arte (fundo, destaque). **O motor hoje só tem o café Bean There**: cenário novo é
trabalho de arte antes do tema ir ao ar (ou o tema roda no café com o objeto do cenário no balcão, que é o padrão).

| Banco | Nível | Tema | Palavras (n) | Cenário | Paleta (fundo · destaque) | Posto | Vai ao ar |
|---|---|---|---|---|---|---|---|
| 61 | A1 | ⭐ Thanksgiving | turkey, pie, dinner, family, thankful, corn, potato (7) | sala de jantar (mesa posta) | #F6EADB linho · #A0522D canela | 3.152 | #28 · 24/11/2026 |
| 62 | A1 | ⭐ Black Friday | sale, deal, discount, price, cheap, store, line, buy (8) | loja (vitrine de promoção) | #F7EEF0 rosado · #1D1D1F preto | 1.106 | #30 · 26/11/2026 |
| 63 | A1 | ⭐ Natal (Christmas) | Christmas, tree, gift, lights, star, snow, Santa, party (8) | café decorado de Natal | #F3E3C7 creme · #C8552B terracota | 1.073 | #56 · 22/12/2026 |
| 64 | A1 | ⭐ Ano-Novo (New Year's Eve) | midnight, party, fireworks, countdown, wish, goal, cheers (7) | terraço (virada) | #14213D azul-noite · #FCA311 dourado | 2.166 | #64 · 30/12/2026 |
| 65 | A1 | ⭐ Carnaval explicado pro gringo | parade, costume, dance, drum, crowd, street, glitter (7) | rua (bloco de Carnaval) | #E9E6DF calçada · #F2B134 amarelo-táxi | 3.232 | #101 · 05/02/2027 |
| 66 | A1 | ⭐ Super Bowl | game, team, ball, score, win, lose, fan, halftime (8) | bar do esporte (TV) | #1F2A24 verde-escuro · #F2F2F2 branco-placar | 743 | #107 · 11/02/2027 |
| 67 | A1 | ⭐ Valentine's Day | love, heart, date, flowers, chocolate, card, kiss (7) | restaurante (jantar a dois) | #3B1F22 vinho · #E9C46A mostarda | 751 | #109 · 13/02/2027 |
| 68 | A2 | ⭐ Oscar | movie, actor, actress, director, award, winner, best (7) | cinema (tapete vermelho) | #1A1423 preto-roxo · #D4AF37 ouro | 2.141 | #136 · 12/03/2027 |
| 69 | A1 | ⭐ St. Patrick's Day | green, lucky, luck, gold, Irish, parade, hat (7) | pub | #20331F verde-pub · #C9A227 dourado | 1.023 | #140 · 16/03/2027 |
| 70 | A1 | ⭐ Páscoa | Easter, egg, chocolate, bunny, spring, holiday (6) | brunch de domingo | #F7F1FA lilás-claro · #F2D16B amarelo-gema | 2.303 | #150 · 26/03/2027 |
| 71 | A1 | horas | o'clock, half, quarter, past, to, minute, hour (7) | estação de trem (relógio) | #E4E6EA concreto · #2F6FB0 azul | 575 | #66 · 01/01/2027 |
| 72 | A1 | rotina da noite | cook, dinner, dishes, relax, bed, alarm (6) | casa (noite) | #F6EBDD bege · #7A9E7E sálvia | 1.155 | #67 · 02/01/2027 |
| 73 | A1 | tarefas de casa | clean, wash, laundry, trash, dishes, floor (6) | apartamento | #F3E3C7 creme · #C8552B terracota | 2.110 | #68 · 03/01/2027 |
| 74 | A1 | utensílios de cozinha | knife, fork, spoon, plate, glass, cup, pan (7) | cozinha | #FBEFE3 pêssego · #B5562E cobre | 2.105 | #69 · 04/01/2027 |
| 75 | A1 | legumes da feira | tomato, onion, potato, carrot, garlic, lettuce (6) | feira | #E8F1DA verde-claro · #F08A2B laranja | 7.474 | #70 · 05/01/2027 |
| 76 | A1 | comprando na feira | fresh, ripe, kilo, pound, bag, cash (6) | feira | #E8F1DA verde-claro · #F08A2B laranja | 2.654 | #71 · 06/01/2027 |
| 77 | A1 | café da manhã americano | toast, butter, bacon, pancakes, cereal, jam (6) | lanchonete de estrada | #FFF4DE creme · #D62828 vermelho | 4.059 | #72 · 07/01/2027 |
| 78 | A1 | fast food | burger, fries, pizza, soda, ketchup, napkin (6) | lanchonete | #FFF4DE creme · #D62828 vermelho | 5.069 | #73 · 08/01/2027 |
| 79 | A1 | sabores | sweet, salty, sour, spicy, bitter, delicious (6) | cozinha | #FBEFE3 pêssego · #B5562E cobre | 5.190 | #74 · 09/01/2027 |
| 80 | A1 | como é o lugar | clean, dirty, quiet, noisy, crowded, empty (6) | cidade | #E9E6DF calçada · #5C80BC azul-placa | 1.202 | #75 · 10/01/2027 |
| 81 | A1 | praia | sand, wave, towel, sunscreen, umbrella, ocean (6) | praia | #FFF1D6 areia · #1FA7A5 turquesa | 3.472 | #76 · 11/01/2027 |
| 82 | A1 | cumprimentos 2 | how are you, what's up, nice to meet you, see you, take care, good night (6) | café (balcão) | #F3E3C7 creme · #C8552B terracota | 208 | #77 · 12/01/2027 |
| 83 | A1 | estações do ano | spring, summer, fall, autumn, winter, season (6) | parque (4 estações) | #EAF4E1 grama · #E7A33E outono | 1.778 | #78 · 13/01/2027 |
| 84 | A1 | tempo 2 | cloudy, windy, rainy, foggy, storm, degrees (6) | janela do café | #F3E3C7 creme · #C8552B terracota | 10.407 | #79 · 14/01/2027 |
| 85 | A1 | academia | weights, mat, stretch, push-up, rest, trainer (6) | academia | #2A2D34 grafite · #C6F432 lima | 8.162 | #80 · 15/01/2027 |
| 86 | A1 | corpo 2 | arm, foot, knee, shoulder, neck, stomach, finger (7) | academia | #2A2D34 grafite · #C6F432 lima | 1.762 | #81 · 16/01/2027 |
| 87 | A1 | hospital | emergency, appointment, patient, pain, blood, insurance (6) | hospital | #F4F8FA branco-azulado · #3AA0C8 azul-hospital | 1.293 | #82 · 17/01/2027 |
| 88 | A1 | sintomas | cough, cold, flu, sore throat, stomachache, dizzy (6) | farmácia | #F1F7F2 branco-verde · #2E9E5B verde-cruz | 5.506 | #83 · 18/01/2027 |
| 89 | A1 | farmácia | pill, cream, bandage, prescription, drops, vitamins (6) | farmácia | #F1F7F2 branco-verde · #2E9E5B verde-cruz | 5.126 | #84 · 19/01/2027 |
| 90 | A1 | cabeleireiro | haircut, short, long, curly, straight, beard (6) | barbearia | #EFE9E1 couro-claro · #2E4057 azul-barbeiro | 2.355 | #85 · 20/01/2027 |
| 91 | A1 | aparência | hair, blonde, curly, glasses, beard, tattoo (6) | café (clientes) | #F3E3C7 creme · #C8552B terracota | 3.633 | #86 · 21/01/2027 |
| 92 | A1 | personalidade | kind, shy, smart, lazy, friendly, rude, honest (7) | café (elenco) | #F3E3C7 creme · #C8552B terracota | 2.483 | #87 · 22/01/2027 |
| 93 | A1 | sentimentos 2 | excited, nervous, scared, worried, proud, surprised (6) | café (elenco) | #F3E3C7 creme · #C8552B terracota | 1.037 | #88 · 23/01/2027 |
| 94 | A1 | família 3 | grandma, grandpa, uncle, aunt, cousin, baby (6) | casa da Dona Jaca | #F6EBDD bege · #7A9E7E sálvia | 1.277 | #89 · 24/01/2027 |
| 95 | A1 | eventos da vida | birthday, wedding, anniversary, graduation, gift, guest (6) | salão de festas | #FBF3EE pérola · #C2185B framboesa | 1.344 | #90 · 25/01/2027 |
| 96 | A1 | festa | invite, guest, dance, music, snacks, host (6) | festa em casa | #2B1E3F berinjela · #F2C14E dourado | 1.797 | #91 · 26/01/2027 |
| 97 | A1 | pedido no café 2 | iced, decaf, oat milk, latte, to go, for here (6) | café (balcão) | #F3E3C7 creme · #C8552B terracota | 10.409 | #92 · 27/01/2027 |
| 98 | A1 | alugar apartamento | rent, apartment, neighbor, bills, deposit, building (6) | prédio | #ECE8E1 mármore · #5C80BC azul | 2.436 | #93 · 28/01/2027 |
| 99 | A1 | casa por dentro | fridge, stove, sink, mirror, closet, carpet (6) | apartamento | #F3E3C7 creme · #C8552B terracota | 3.726 | #94 · 29/01/2027 |
| 100 | A1 | mudança | box, move, truck, heavy, carry, pack (6) | rua (caminhão de mudança) | #E9E6DF calçada · #F2B134 amarelo-táxi | 1.047 | #95 · 30/01/2027 |
| 101 | A1 | coisas do escritório | pen, paper, printer, folder, screen, keyboard (6) | escritório | #ECEAE4 papel · #3D5A80 azul-caneta | 5.755 | #96 · 31/01/2027 |
| 102 | A1 | computador e internet | Wi-Fi, laptop, download, click, link, website, app (7) | escritório | #ECEAE4 papel · #3D5A80 azul-caneta | 5.356 | #97 · 01/02/2027 |
| 103 | A1 | ligações | call, answer, busy, voicemail, ring, text (6) | escritório | #ECEAE4 papel · #3D5A80 azul-caneta | 790 | #98 · 02/02/2027 |
| 104 | A1 | e-mail de trabalho | send, reply, attach, subject, deadline, inbox (6) | escritório | #ECEAE4 papel · #3D5A80 azul-caneta | 6.258 | #99 · 03/02/2027 |
| 105 | A1 | reunião online | mute, camera, screen, share, join, link (6) | home office | #F2EFEA linho · #3D5A80 azul | 1.746 | #100 · 04/02/2027 |
| 106 | A1 | procurando emprego | job, interview, salary, resume, hire, apply (6) | escritório (RH) | #ECEAE4 papel · #3D5A80 azul-caneta | 3.036 | #102 · 06/02/2027 |
| 107 | A1 | profissões 2 | lawyer, engineer, chef, cashier, manager, mechanic (6) | cidade (trabalhadores) | #E9E6DF calçada · #5C80BC azul-placa | 2.732 | #103 · 07/02/2027 |
| 108 | A1 | banco | account, ATM, withdraw, deposit, balance, card (6) | banco | #EDF2EC menta-pálido · #2F6B4F verde-dinheiro | 3.773 | #104 · 08/02/2027 |
| 109 | A1 | pagar | cash, credit card, debit, pay, split, total (6) | loja (caixa) | #F7EEF0 rosado · #1D1D1F preto | 1.620 | #105 · 09/02/2027 |
| 110 | A1 | entregas | package, delivery, address, mail, zip code, doorbell (6) | portaria do prédio | #ECE8E1 mármore · #8A6E4B latão | 2.811 | #106 · 10/02/2027 |
| 111 | A2 | passado com -ed som de t | worked, walked, talked, liked, watched, stopped (6) | café (segunda-feira) | #F3E3C7 creme · #C8552B terracota | 969 | #108 · 12/02/2027 |
| 112 | A2 | passado com -ed som de d | played, called, lived, loved, opened, cleaned (6) | café (segunda-feira) | #F3E3C7 creme · #C8552B terracota | 1.097 | #110 · 14/02/2027 |
| 113 | A2 | passado com -ed som de id | wanted, needed, started, waited, visited, decided (6) | café (segunda-feira) | #F3E3C7 creme · #C8552B terracota | 731 | #111 · 15/02/2027 |
| 114 | A2 | passado irregular 1 | ate, drank, slept, came, got, made (6) | casa | #F6EBDD bege · #7A9E7E sálvia | 988 | #112 · 16/02/2027 |
| 115 | A2 | passado irregular 2 | bought, said, told, took, gave, found (6) | loja | #F7EEF0 rosado · #1D1D1F preto | 274 | #113 · 17/02/2027 |
| 116 | A2 | passado irregular 3 | thought, felt, left, met, paid, sent (6) | aeroporto | #E6EEF5 cinza-azulado · #2F6FB0 azul-pista | 533 | #114 · 18/02/2027 |
| 117 | A2 | marcadores de passado | ago, last, already, before, after, yesterday (6) | café (agenda) | #F3E3C7 creme · #C8552B terracota | 225 | #115 · 19/02/2027 |
| 118 | A2 | futuro | will, going to, next, someday, maybe, plan (6) | café (agenda) | #F3E3C7 creme · #C8552B terracota | 200 | #116 · 20/02/2027 |
| 119 | A2 | at, on, in (tempo) | at, on, in, until, since, during (6) | calendário | #F3E3C7 creme · #C8552B terracota | 182 | #117 · 21/02/2027 |
| 120 | A2 | quantidades | some, any, much, many, a lot, a little, few (7) | supermercado | #FFF6E5 creme · #E04B3A vermelho-oferta | 135 | #118 · 22/02/2027 |
| 121 | A2 | palavras que ligam frases | and, but, because, so, or, then (6) | café | #F3E3C7 creme · #C8552B terracota | 64 | #119 · 23/02/2027 |
| 122 | A2 | comparar | bigger, smaller, better, worse, cheaper, faster (6) | loja | #F7EEF0 rosado · #1D1D1F preto | 1.323 | #120 · 24/02/2027 |
| 123 | A2 | o melhor e o pior | biggest, best, worst, cheapest, most, least (6) | loja | #F7EEF0 rosado · #1D1D1F preto | 783 | #121 · 25/02/2027 |
| 124 | A2 | verbos de 2 palavras em casa | wake up, get up, turn on, turn off, put on, take off (6) | casa (manhã) | #F6EBDD bege · #7A9E7E sálvia | 261 | #122 · 26/02/2027 |
| 125 | A2 | verbos de 2 palavras na rua | get in, get out, pick up, drop off, come back, go out (6) | rua (carro) | #E9E6DF calçada · #F2B134 amarelo-táxi | 66 | #123 · 27/02/2027 |
| 126 | A2 | dar opinião | think, agree, disagree, sure, really, maybe (6) | café (conversa) | #F3E3C7 creme · #C8552B terracota | 146 | #124 · 28/02/2027 |
| 127 | A2 | respostas curtas | of course, no problem, exactly, never mind, no way, sure (6) | café (conversa) | #F3E3C7 creme · #C8552B terracota | 238 | #125 · 01/03/2027 |
| 128 | A2 | educação | excuse me, pardon, you're welcome, my bad, no worries, after you (6) | café (balcão) | #F3E3C7 creme · #C8552B terracota | 914 | #126 · 02/03/2027 |
| 129 | A2 | aeroporto 2 | check-in, boarding, delay, departure, arrival, terminal (6) | aeroporto | #E6EEF5 cinza-azulado · #2F6FB0 azul-pista | 5.938 | #127 · 03/03/2027 |
| 130 | A2 | imigração | customs, visa, declare, purpose, stay, border (6) | aeroporto (imigração) | #E6EEF5 cinza-azulado · #2F6FB0 azul-pista | 3.955 | #128 · 04/03/2027 |
| 131 | A2 | dentro do avião | window, aisle, seatbelt, blanket, landing, takeoff (6) | avião | #E6EEF5 cinza-azulado · #2F6FB0 azul | 5.852 | #129 · 05/03/2027 |
| 132 | A2 | problemas no hotel | front desk, checkout, upgrade, noisy, broken, housekeeping (6) | hotel (recepção) | #EFE7DA marfim · #8C5E3C nogueira | 9.387 | #130 · 06/03/2027 |
| 133 | A2 | turismo | tour, guide, souvenir, view, sightseeing, landmark (6) | cidade turística | #FDF0D5 pergaminho · #C1121F vermelho-postal | 5.587 | #131 · 07/03/2027 |
| 134 | A2 | câmbio | exchange, rate, fee, currency, coins, bills (6) | casa de câmbio | #EDF2EC menta · #2F6B4F verde | 3.738 | #132 · 08/03/2027 |
| 135 | A2 | metrô e trem | subway, platform, stop, transfer, schedule, fare (6) | metrô | #E4E6EA concreto · #D7263D vermelho-linha | 3.993 | #133 · 09/03/2027 |
| 136 | A2 | carro de aplicativo | ride, pickup, traffic, destination, trunk, rating (6) | carro de aplicativo | #EDEDED cinza · #111111 preto | 4.195 | #134 · 10/03/2027 |
| 137 | A2 | carro e posto | gas, tire, oil, parking, license, speed (6) | posto de gasolina | #F0EEE9 concreto · #E63946 vermelho-bomba | 1.884 | #135 · 11/03/2027 |
| 138 | A2 | cidade 2 | bridge, traffic light, crosswalk, sidewalk, downtown, neighborhood (6) | centro da cidade | #F3E3C7 creme · #C8552B terracota | 2.762 | #137 · 13/03/2027 |
| 139 | A2 | emergência | help, police, fire, lost, stolen, ambulance (6) | rua (emergência) | #E9E6DF calçada · #F2B134 amarelo-táxi | 402 | #138 · 14/03/2027 |
| 140 | A2 | documentos | ID, form, sign, last name, date of birth, copy (6) | repartição | #EEEDEA papel · #4A4E69 cinza-azul | 1.375 | #139 · 15/03/2027 |
| 141 | A2 | compras online | cart, checkout, shipping, refund, review, order (6) | celular (loja online) | #F0F0F5 tela · #7B61FF roxo-app | 5.735 | #141 · 17/03/2027 |
| 142 | A2 | na loja de roupas | fitting room, try on, return, exchange, discount, tag (6) | loja de roupas | #F7EEF0 rosado · #1D1D1F preto | 3.376 | #142 · 18/03/2027 |
| 143 | A2 | roupas 2 | sweater, jeans, socks, sneakers, coat, shorts (6) | loja de roupas | #F7EEF0 rosado · #1D1D1F preto | 5.355 | #143 · 19/03/2027 |
| 144 | A2 | acessórios | watch, glasses, ring, necklace, belt, backpack (6) | loja de acessórios | #F7EEF0 rosado · #B08D57 ouro-velho | 2.362 | #144 · 20/03/2027 |
| 145 | A2 | cinema | ticket, seat, popcorn, screen, trailer, subtitles (6) | cinema | #1A1423 preto-roxo · #D4AF37 ouro | 2.652 | #145 · 21/03/2027 |
| 146 | A2 | séries | show, episode, season, spoiler, binge, remote (6) | sala (sofá) | #EDE6F2 lilás-claro · #6C4AB6 roxo | 3.146 | #146 · 22/03/2027 |
| 147 | A2 | show de música | concert, band, singer, song, stage, fan (6) | show (palco) | #120E1F palco · #FF4D8D magenta | 1.527 | #147 · 23/03/2027 |
| 148 | A2 | games | level, player, controller, online, save, quit (6) | sala (videogame) | #EDE6F2 lilás-claro · #6C4AB6 roxo | 1.653 | #148 · 24/03/2027 |
| 149 | A2 | basquete | court, shot, point, foul, coach, rebound (6) | ginásio (NBA) | #3A2A1A madeira · #F07C1B laranja-bola | 1.138 | #149 · 25/03/2027 |
| 150 | A2 | futebol em inglês | goal, field, referee, penalty, match, kick (6) | estádio | #1E5631 gramado · #FFFFFF branco | 1.820 | #151 · 27/03/2027 |
| 151 | A2 | redes sociais 2 | profile, followers, story, live, hashtag, viral (6) | café (Poppy no celular) | #F3E3C7 creme · #C8552B terracota | 5.364 | #152 · 28/03/2027 |
| 152 | A2 | gírias que dá pra usar | cool, awesome, chill, vibe, cringe, legit (6) | café (Poppy) | #F3E3C7 creme · #C8552B terracota | 5.449 | #153 · 29/03/2027 |
| 153 | A2 | internet com problema | slow, crash, update, login, reset, signal (6) | home office | #F2EFEA linho · #3D5A80 azul | 4.013 | #154 · 30/03/2027 |
| 154 | A2 | celular 2 | notification, screenshot, volume, ringtone, storage, airplane mode (6) | café (celular) | #F3E3C7 creme · #C8552B terracota | 11.128 | #155 · 31/03/2027 |
| 155 | A2 | natureza | river, lake, mountain, forest, island, sky (6) | estrada (paisagem) | #E3EEF3 céu · #4E7D5B pinheiro | 1.441 | #156 · 01/04/2027 |
| 156 | A2 | adjetivos de opinião | great, amazing, terrible, boring, interesting, weird (6) | café (conversa) | #F3E3C7 creme · #C8552B terracota | 761 | #157 · 02/04/2027 |
| 157 | A2 | cores 2 | pink, purple, orange, brown, gray, gold (6) | café | #F3E3C7 creme · #C8552B terracota | 2.816 | #158 · 03/04/2027 |
| 158 | A2 | pets | dog, cat, pet, vet, leash, feed (6) | casa (pet) | #F6EBDD bege · #7A9E7E sálvia | 2.400 | #159 · 04/04/2027 |
| 159 | A2 | supermercado 2 | aisle, frozen, dairy, bakery, organic, coupon (6) | supermercado | #FFF6E5 creme · #E04B3A vermelho-oferta | 8.054 | #160 · 05/04/2027 |
| 160 | A2 | verbos de cozinha | cut, boil, fry, bake, mix, add (6) | cozinha | #FBEFE3 pêssego · #B5562E cobre | 4.008 | #161 · 06/04/2027 |
| 161 | A2 | receita | recipe, ingredients, oven, bowl, cup, pinch (6) | cozinha | #FBEFE3 pêssego · #B5562E cobre | 5.046 | #162 · 07/04/2027 |
| 162 | A2 | restaurante 2 | starter, main course, dessert, check, leftovers, refill (6) | restaurante | #3B1F22 vinho · #E9C46A mostarda | 7.728 | #163 · 08/04/2027 |
| 163 | A2 | reclamar com educação | wrong, missing, late, broken, complaint, fix (6) | restaurante | #3B1F22 vinho · #E9C46A mostarda | 827 | #164 · 09/04/2027 |
| 164 | A2 | pedir favor | borrow, lend, favor, help, mind, hold (6) | café | #F3E3C7 creme · #C8552B terracota | 740 | #165 · 10/04/2027 |
| 165 | A2 | hobbies | hobby, painting, cooking, reading, gardening, yoga (6) | café (conversa) | #F3E3C7 creme · #C8552B terracota | 4.089 | #166 · 11/04/2027 |
| 166 | A2 | frequência 2 | once, twice, daily, weekend, rarely, every week (6) | café (agenda) | #F3E3C7 creme · #C8552B terracota | 1.303 | #167 · 12/04/2027 |
| 167 | A2 | estudando inglês | word, sentence, mean, spell, repeat, practice (6) | café (aula da Capy) | #F3E3C7 creme · #C8552B terracota | 1.743 | #168 · 13/04/2027 |
| 168 | A2 | curso | course, class, test, grade, notes, question (6) | curso noturno | #F4F1E8 giz · #2D6A4F verde-lousa | 796 | #169 · 14/04/2027 |
| 169 | A2 | dinheiro 3 | save, spend, earn, owe, budget, afford (6) | banco | #EDF2EC menta-pálido · #2F6B4F verde-dinheiro | 1.388 | #170 · 15/04/2027 |
| 170 | A2 | horário | early, late, on time, schedule, hurry, wait (6) | estação | #E4E6EA concreto · #2F6FB0 azul | 453 | #171 · 16/04/2027 |
| 171 | A2 | lugares 2 | post office, police station, gas station, parking lot, laundromat, drugstore (6) | cidade | #E9E6DF calçada · #5C80BC azul-placa | 2.128 | #172 · 17/04/2027 |
| 172 | A2 | trabalho 2 | coworker, shift, overtime, day off, promotion, raise (6) | escritório | #ECEAE4 papel · #3D5A80 azul-caneta | 3.369 | #173 · 18/04/2027 |
| 173 | A2 | falsos amigos 2 | actually, pretend, attend, eventually, assist, sensible (6) | café (placas) | #F3E3C7 creme · #C8552B terracota | 2.539 | #174 · 19/04/2027 |
| 174 | A2 | falsos amigos 3 | novel, lecture, notice, mayor, data, fabric (6) | café (placas) | #F3E3C7 creme · #C8552B terracota | 2.903 | #175 · 20/04/2027 |
| 175 | A2 | o som do th | think, thing, this, that, weather, birthday (6) | café (aula do Lazy) | #F3E3C7 creme · #C8552B terracota | 102 | #176 · 21/04/2027 |
| 176 | A2 | o h soprado | house, hot, happy, hair, hotel, hospital (6) | café (aula do Lazy) | #F3E3C7 creme · #C8552B terracota | 580 | #177 · 22/04/2027 |
| 177 | A2 | i curto e i longo | ship, sheep, live, leave, sit, seat (6) | café (aula do Lazy) | #F3E3C7 creme · #C8552B terracota | 564 | #178 · 23/04/2027 |
| 178 | A2 | contrações | I'm, you're, don't, can't, it's, let's (6) | café (conversa) | #F3E3C7 creme · #C8552B terracota | 769 | #179 · 24/04/2027 |
| 179 | A2 | frases de sobrevivência | I don't understand, slowly, again, louder, how do you say, what does it mean (6) | café (turista) | #F3E3C7 creme · #C8552B terracota | 477 | #180 · 25/04/2027 |
| 180 | A2 | as 10 palavras mais faladas | you, I, the, to, a, it, and, that, is, what (10) | café (6 meses) | #F3E3C7 creme · #C8552B terracota | 6 | #181 · 26/04/2027 |

**Avisos do banco 2:**
- 40 dos 120 temas do banco 2 têm posto mediano acima de 3.000 (mediana geral do banco 2: 2.105): Palavras #70 legumes da feira (7.474); Palavras #72 café da manhã americano (4.059); Palavras #73 fast food (5.069); Palavras #74 sabores (5.190); Palavras #76 praia (3.472); Palavras #79 tempo 2 (10.407); Palavras #80 academia (8.162); Palavras #83 sintomas (5.506); Palavras #84 farmácia (5.126); Palavras #86 aparência (3.633); Palavras #92 pedido no café 2 (10.409); Palavras #94 casa por dentro (3.726); Palavras #96 coisas do escritório (5.755); Palavras #97 computador e internet (5.356); Palavras #99 e-mail de trabalho (6.258); Palavras #101 Carnaval explicado pro gringo (3.232); Palavras #102 procurando emprego (3.036); Palavras #104 banco (3.773); Palavras #127 aeroporto 2 (5.938); Palavras #128 imigração (3.955); Palavras #129 dentro do avião (5.852); Palavras #130 problemas no hotel (9.387); Palavras #131 turismo (5.587); Palavras #132 câmbio (3.738); Palavras #133 metrô e trem (3.993); Palavras #134 carro de aplicativo (4.195); Palavras #141 compras online (5.735); Palavras #142 na loja de roupas (3.376); Palavras #143 roupas 2 (5.355); Palavras #146 séries (3.146); Palavras #152 redes sociais 2 (5.364); Palavras #153 gírias que dá pra usar (5.449); Palavras #154 internet com problema (4.013); Palavras #155 celular 2 (11.128); Palavras #160 supermercado 2 (8.054); Palavras #161 verbos de cozinha (4.008); Palavras #162 receita (5.046); Palavras #163 restaurante 2 (7.728); Palavras #166 hobbies (4.089); Palavras #173 trabalho 2 (3.369).
  Ficam porque a situação é de alta utilidade (viagem, saúde, trabalho) mesmo com palavra rara em legenda; são os primeiros a
  sair se a retenção mandar. Os de data (Thanksgiving, Super Bowl…) ficam pela data, não pela frequência.
- 4 temas de pronúncia (175–178) e o 180 (as 10 palavras mais faladas do inglês, direto da lista) são revisão de A2:
  o 180 fecha os 6 meses com uma promessa verdadeira ("as 10 palavras que mais aparecem em filme e série", conferido).
- Palavras repetidas entre temas são de propósito (revisão espaçada): price/cheap (dinheiro → Black Friday), breakfast
  (hotel → rotina), party (Natal → Ano-Novo). O motor não liga para repetição; a regra D−4/D−12 do banco 1 continua valendo.
- Temas de 5 palavras do banco 1 (34, 37, 41, 48, 52, 58, 59) ganharam a 6ª palavra no JSON: pela conta do protótipo
  (~26 s fixos + ~4,7 s por palavra), 5 palavras ficariam perto de 59 s, abaixo dos 61 s do Creator Rewards.
  (34 +next to · 37 +tennis · 41 +every day · 48 wake→wake up, +lunch · 52 +fix · 58 +billion · 59 +jump; 47 trocou old→smart
  para não repetir o tema 15 e usar só o elenco.)

## 6. O que falta no motor para a rotina "só gerar voz e renderizar"

**Prontos hoje:** #50 (descrever pessoas: só `aponta` com o elenco). **Os outros 59 precisam de arte/código antes.**

### 6.1 Ações de cena novas (25) · `src/vocab/cena.tsx` + `CENA_ACOES` em `timeline.ts`

| Ação | Usada em | O que mostra |
|---|---|---|
| `sente` | #19, #32, #53 | rosto do personagem com a emoção (feliz, triste, cansado, com fome, bravo, entediado, doente, gosta, ama) |
| `come` | #21 | come um croissant |
| `bebe` | #21 | bebe do copo |
| `dorme` | #21 | dorme no balcão (zzz) |
| `trabalha` | #21, #51 | trabalha atrás do balcão |
| `pergunta` | #29 | personagem com balão "?" e o chip de contexto com a lacuna (— ___ is your name?) |
| `mostra` | #33 | Lazy aponta a parte do próprio corpo (seta + brilho no lugar) |
| `le` | #41 | lê o jornal |
| `escreve` | #41 | escreve num cartão |
| `ouve` | #41 | ouve com fone |
| `fala` | #41 | fala com o cliente (balão) |
| `assiste` | #41 | olha a TV |
| `joga` | #41 | joga com controle |
| `acorda` | #51 | despertador toca e ele acorda |
| `nada` | #55 | braçada (ondas) |
| `dirige` | #55, #63 | volante |
| `cozinha` | #55 | mexe a panela |
| `canta` | #55 | microfone e notas |
| `danca` | #55 | passo de dança adulto, curto |
| `conserta` | #55 | chave inglesa na máquina |
| `lembra` | #57 | balão de lembrança (foto do fim de semana) sobre o personagem |
| `prova` | #59 | segura a roupa na frente do corpo (provador) |
| `anda` | #63 | anda pela calçada |
| `corre` | #63 | corre (linhas de velocidade) |
| `pula` | #63 | pula uma poça |

### 6.2 Desenhos novos (182) · `src/vocab/objetos.tsx` (1 desenho + 1 entrada em `LAYOUT`)

Ordem = ordem em que vão ao ar (o primeiro da lista é o que trava antes). Mesmo traço do protótipo (contorno #3A2213, 8 px).

| Post | Desenhos que faltam |
|---|---|
| #06 família | `fotoFilha`, `fotoFilho`, `fotoIrma`, `fotoIrmao`, `fotoPai` |
| #07 números de 11 a 20 | `senha` |
| #08 dias da semana | `calendarioDia` |
| #09 coisas do bolso | `bolsa`, `cartao`, `carteira`, `celular`, `chave`, `notas` |
| #10 comida do café | `bolo`, `ovo`, `pao`, `queijo`, `sanduiche` |
| #11 países | `etiquetaMala` |
| #12 nacionalidades | `cracha` |
| #13 profissões | `bandeja`, `estetoscopio`, `mochila`, `quadroGiz`, `termometro`, `volante` |
| #14 letras que o brasileiro troca | `letreiro` |
| #15 cores | `copoAmarelo`, `copoAzul`, `copoBranco`, `copoPreto`, `copoVerde`, `copoVermelho` |
| #16 opostos 1 | `cafeGelado`, `cafeQuente`, `celularNovo`, `celularVelho`, `copoGrande`, `copoPequeno` |
| #17 dezenas | `etiquetaPreco` |
| #18 partes do dia | `calendarioDia`, `janelaFim`, `janelaManha`, `janelaNoite`, `janelaTarde` |
| #20 lugares da cidade | `aviao`, `carrinho`, `placaEstacao`, `predioBanco`, `predioHospital`, `predioHotel` |
| #22 cômodos da casa | `cama`, `chuveiro`, `fogao`, `janela`, `planta`, `porta` |
| #23 roupas | `calca`, `camisa`, `chapeu`, `jaqueta`, `sapato`, `vestido` |
| #24 transporte | `aviao`, `bike`, `carro`, `onibus`, `taxi`, `trem` |
| #25 meses de janeiro a junho | `folhaCalendario` |
| #26 meses de julho a dezembro | `folhaCalendario` |
| #27 dinheiro | `etiquetaPreco`, `moeda`, `notaDolar` |
| #28 Thanksgiving | `batata`, `fotoFamilia`, `milho`, `peru`, `pratoJantar`, `torta` |
| #30 Black Friday | `etiquetaPreco`, `placaSale`, `sacola` |
| #31 família 2 e amigos | `fotoCrianca`, `fotoEsposa`, `fotoMarido`, `fotoNamorada`, `fotoNamorado` |
| #34 tempo lá fora | `floco`, `folhasVento`, `nuvemChuva`, `sol`, `termometroAlto`, `termometroBaixo` |
| #35 almoço | `arroz`, `carne`, `feijao`, `frango`, `peixe`, `salada` |
| #36 frutas | `banana`, `laranja`, `limao`, `maca`, `morango`, `uva` |
| #37 onde está | `posAtras`, `posCima`, `posDentro`, `posEmbaixo`, `posEntre`, `posLado` |
| #38 móveis | `cadeira`, `cama`, `luminaria`, `mesa`, `prateleira`, `sofa` |
| #39 tempo livre | `bola`, `controle`, `fone`, `livro`, `mala`, `pipoca` |
| #40 esportes | `bolaBasquete`, `bolaFutebol`, `halter`, `oculosNatacao`, `raquete`, `tenis` |
| #42 ordinais | `senha` |
| #43 celular | `balaoMensagem`, `bateria`, `cadeado`, `carregador`, `envelope`, `foto` |
| #44 frequência | `agendaSemana` |
| #45 trabalho | `mesaReuniao`, `mesaTrabalho`, `notebook`, `predioEscritorio` |
| #46 aeroporto | `aviao`, `mala`, `passagem`, `passaporte`, `placaPortao`, `poltronaAviao` |
| #47 hotel | `bandejaCafe`, `cartaoChave`, `elevador`, `portaQuarto`, `prancheta`, `toalha` |
| #48 restaurante | `bandeja`, `cardapio`, `conta`, `mesa`, `moeda` |
| #49 opostos 2 | `cafeteira`, `quebraCabeca` |
| #51 rotina da manhã | `bandejaCafe`, `chuveiro`, `marmita` |
| #52 supermercado | `carrinho`, `notaFiscal`, `notas`, `placaSale`, `sacola` |
| #53 saúde | `cruzFarmacia`, `estetoscopio`, `remedio`, `termometro` |
| #54 direções | `placaRua`, `quarteirao`, `seta` |
| #56 Natal | `arvoreNatal`, `confete`, `estrela`, `floco`, `gorroNoel`, `pisca`, `presente` |
| #58 quando | `ampulheta`, `calendarioDia`, `relogio` |
| #59 tamanhos e provar | `copoGrande`, `copoMedio`, `copoPequeno`, `etiquetaTamanho` |
| #60 passeio | `arvore`, `fonte`, `guardaSol`, `predioIgreja`, `predioMuseu`, `sacola` |
| #61 redes sociais | `balaoMensagem`, `iconeCompartilhar`, `iconeCoracao`, `iconePlay`, `iconePost`, `iconeSeguir` |
| #62 números grandes | `bolo`, `etiquetaPreco`, `ovo` |
| #63 verbos de movimento | `aviao`, `bike` |
| #64 Ano-Novo | `confete`, `estrela`, `fogos`, `placar`, `prancheta`, `relogio`, `tacas` |
| #65 falsos amigos | `capelo`, `fotoFamilia`, `livro`, `placaPorta`, `placaSaida` |

**Reaproveitamento que já está no JSON:** 1 desenho com rótulo diferente serve vários: `senha` (11–20 e ordinais), `calendarioDia`,
`etiquetaMala`, `cracha`, `etiquetaPreco`, `folhaCalendario`, `agendaSemana`, `letreiro`, `seta`. Por isso 60 temas pedem 182 e não ~370.

**Recomendação (custo e prazo):** a fila de vocabulário hoje cobre até #05 (01/11). Para #06 sair em 02/11, o desenho do tema do dia
tem que entrar na rotina diária antes da voz (6 a 8 desenhos por dia ≈ o que a rotina de 28/10 fez com o quadro de cena). Custo de
voz por tema continua 5–7 pedidos de TTS; desenho é código (crédito da nuvem, sem custo de API). Proteção barata que vale já:
`Vocab.tsx:144` pular a palavra com aviso em vez de quebrar (ou o portão reprovar antes do render), para 1 desenho faltando não
travar a fila inteira.

## 7. Como cada JSON foi montado (molde do tema 01 + regras dos temas 02–05)

- 1 palavra = `objeto` + `qtd` (quantidade aparece antes da palavra) ou `cena` (quem, ação, contexto em PT que não traduz).
- Armadilha só onde o brasileiro erra (th, h soprado, consoante final sem i, vogal longa, tônica, letra muda); `voz: true` no
  máximo 3 por tema de 6, 2 de 7–8, 1 de 9–10 (cabe em 61–75 s); `enfase` só quando a sílaba forte é o começo da palavra
  (o motor só aumenta prefixo). Campo extra `pron` = como soa para o brasileiro (o motor ignora; serve para legenda e música).
- Blocos de 3 (2 a 4), ecos girando entre Lazy, Hank e Duda (Poppy nas redes sociais), Capy apresenta e nunca é a última,
  Bolinha revisa, Hank fecha; desafio com 2 palavras (1 em temas de 9–10), sempre uma com armadilha.
- Gancho em PT, verdadeiro e curto; acima de 58 caracteres ganha `dividir` (como o tema 03). Fecho = pergunta real de comentário.
- Post: `Palavras #NN · …` (TikTok e título do YouTube) e a descrição termina com `anterior: Palavras #NN−1`.
  **Atenção:** `scripts/publicar_vocab.py` cola as hashtags DEPOIS da descrição, então no YouTube a última linha vira a das
  hashtags, não o `anterior:`. Ajuste de 1 linha no script (hashtags antes do `anterior:`) — corrigido nesta tarefa.
- `data_ar` e `banco` são campos novos de controle (o motor ignora); `publicar_vocab.py --data` continua mandando.

## 8. Decisões que são do Felipe

1. **Desenhar os 182 objetos na rotina diária (recomendo) ou simplificar** temas abstratos para o quadro de cena com as 9 ações
   de hoje. Recomendação: desenhar; o objeto colado na palavra é o que o protótipo tem de melhor (codificação dupla).
2. **Carnaval entra?** (não é data anglófona; está como "explicar o Carnaval ao gringo"). Recomendo sim: é o maior hype de
   fevereiro no Brasil e o tema ensina parade/costume/crowd, úteis o ano todo.
3. **Ordem A1→A2**: o A2 começa em 20/02/2027 (#112 passado com -ed). Se as métricas mostrarem público mais avançado, dá
   para adiantar o bloco 111–128.

**Próximo passo:** rotina diária desenha os objetos de #06 (família: 5 fotos) e gera a voz de #06 para 02/11.
