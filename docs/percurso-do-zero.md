# Percurso do zero — CapyFala (inglês para brasileiros adultos)

Versão 1 · 26/09/2026 · dados: `canal-idiomas/curriculo/do-zero.json` (fonte da verdade; este arquivo é a leitura humana).

## Decisão

- **Palavra antes da frase.** Cada episódio apresenta 5 palavras ou blocos prontos com áudio lento, treina reconhecimento e só no fim pede uma frase curtíssima.
- **1 episódio = 1 objetivo "Consigo…"** (can-do do CEFR, com o valor GSE da Pearson). O erro de brasileiro entra como tempero dentro desse objetivo e não comanda mais a ordem.
- **Série para maratonar.** A temporada corresponde ao nível (T1 = A1 com Pre-A1, T2 = A2, T3 = B1), o capítulo é um bloco temático de 4 a 5 episódios e o episódio é uma unidade.
- **Adulto sempre.** Número aparece como preço, telefone ou hora. O alfabeto serve para soletrar nome e e-mail, cor aparece como roupa na loja e comida como pedido no café. Nada de alfabeto cantado nem animal ou cor soltos, porque isso puxa a classificação "feito para crianças".

## De onde veio a ordem (fontes e rótulos)

| Fonte | Usada para | Rótulo |
|---|---|---|
| [CEFR-CV](https://rm.coe.int/cefr-companion-volume-with-new-descriptors-2020/16809ea0d4) Council of Europe, CEFR Companion Volume (2020) | espinha A0→Pre-A1→A1→A2; formato "Consigo…" | verificado (documento existe e cria o Pre-A1); usado para a espinha A0→A1→A2 e para os 'Consigo…' |
| [GSE-ADULT](https://www.pearson.com/content/dam/one-dot-com/one-dot-com/pearson-languages/en-gb/pdfs/gse/gse-resources/gse-learning-objectives-adult-general-english.pdf) Pearson, GSE Learning Objectives for Adult Learners (set/2022) | valor GSE e descritor literal de cada unidade (conferidos por script contra o texto do PDF) | verificado (texto extraído do PDF em 26/09/2026); fonte dos valores GSE e dos descritores citados literalmente. Faixas: 10–21 abaixo de A1, 22–29 A1, 30–35 A2, 36–42 A2+ |
| [NGSL-S](https://www.newgeneralservicelist.com/s/NGSL-Spoken_12_stats.csv) NGSL-Spoken 1.2 (Browne, Culligan & Phillips), 721 lemas = 90% da fala do Cambridge English Corpus | frequência na fala: escolha das palavras-alvo (rank em `freq.ngslSpoken`) | verificado (CSV baixado; o rank de cada palavra-alvo foi lido dele, campo freq.ngslSpoken) |
| [NGSL](https://www.newgeneralservicelist.com/new-general-service-list) New General Service List 1.2 (2.809 palavras, ~92% de cobertura de texto geral) | frequência geral (`freq.ngsl`) | verificado (campo freq.ngsl = SFI rank do CSV oficial) |
| [OX3000](https://www.oxfordlearnersdictionaries.com/external/pdf/wordlists/oxford-3000-5000/American_Oxford_3000_by_CEFR_level.pdf) The Oxford 3000 by CEFR level (American English) | nível CEFR de cada palavra (`freq.oxford3000`) | verificado (PDF baixado; campo freq.oxford3000 = nível CEFR que a Oxford atribui à palavra) |
| [EVP-EGP](https://www.englishprofile.org/) Cambridge English Profile | princípio de nível por sentido; conferência item a item pendente | não consultado item a item (site fora do alcance da rede do ambiente). Usado só como princípio: nível por SENTIDO da palavra, não pela palavra. O nível de cada palavra aqui vem do Oxford 3000; conferir no EVP quando a rede permitir |
| [EF-BEG](https://elt.oup.com/catalogue/items/global/adult_courses/english_file_fourth_edition/english_file_fourth_edition_beginner/) English File Beginner, 4ª ed. (OUP) | ordem da gramática A1 (be I/you → he/she/it → we/they → a/an, plurais, this/that → possessivos → presente simples → horas/rotina → can) | títulos das lições verificados via busca; a gramática de cada lição (be I/you → he/she/it → we/they → a/an, plurais, this/that → possessivos → presente simples → horas/rotina → frequência → can) é de memória do livro: a conferir no sumário |
| [HW-BEG](https://elt.oup.com/catalogue/items/global/adult_courses/headway/beginner/9780194523929) Headway Beginner, 5ª ed. (OUP), Unit 1 'Hello!' | confirma o início: am/is/are, my/your, This is…, números | livro (14 unidades) verificado no catálogo OUP; conteúdo da Unit 1 verificado via busca (fonte secundária) |
| [IC-INTRO](https://www.cambridge.org/us/files/6615/0366/5047/Interchange_Intro_Level_Scope_and_Sequence.pdf) Interchange Intro, 5ª ed. (Cambridge) | confirma o bloco nome → soletrar → telefone → de onde é logo no começo | verificado via busca (o PDF oficial não abriu daqui: 404/timeout) |
| [BC-A1A2](https://learnenglish.britishcouncil.org/free-resources/grammar/a1-a2) British Council LearnEnglish, gramática A1–A2 (lista de tópicos) | lista de tópicos A1–A2 (there is/are, possessive 's, artigos, contáveis, comparativos, passado) | verificado (página lida em 26/09/2026) |
| EN-BR Currículo de erros do canal (canal-idiomas/curriculo/en-br.json) | erros de brasileiro (tempero) | interno; usado como TEMPERO (erroBrasileiro), não como espinha |

O que as fontes concordam e o percurso segue:
1. **Pre-A1 (GSE 10–21):** o aluno começa com fórmulas fixas: cumprimentos, por favor e obrigado, dizer e soletrar o nome, telefone. O GSE põe *Can say their name* em 10, *greet* e *politeness* em 12, *read out phone numbers* em 13 e *spell out their own name* em 14. Por isso os episódios 1 a 5 são blocos prontos, ainda sem gramática.
2. **A1 (GSE 22–29):** entra o verbo be (I/you → he/she/it → we/they e negativo), depois objetos com a/an e this/that, preço, possessivos e there is/are. É a ordem de English File Beginner, Headway Beginner e Interchange Intro.
3. **Fim do A1:** presente simples (gosto, pergunto, ele/ela + -s, rotina), pedidos, imperativo, can e presente contínuo como ponte para o A2.
4. **A2 (GSE 30–42):** passado (was/were → regular → irregular → did), planos, convites, obrigação, cidade, quantidade, comparação, saúde, telefone e experiências.

Frequência: as palavras-alvo foram escolhidas entre as mais frequentes que servem para a situação. Todos os pronomes, be, this/that, there, here, can, get, like, want, good, time e thank estão entre os 160 lemas mais frequentes da fala (NGSL-Spoken: it 5, that 12, he 16, get 18, this 21, like 29, there 30, can 49, want 59, good 63, time 65, here 73, thank 158). Quando uma palavra fica fora das listas (*Brazil*, *Brazilian*, *supermarket* fora do NGSL), é porque a situação adulta pede aquela palavra, e o JSON registra isso.

## Mapa das temporadas

### T1 · Sobreviver · A1 (inclui Pre-A1) · GSE 10–29
- **Cap. 1 — Primeiro contato** (E01–E05): E01 Cumprimentar e se despedir · E02 Por favor, obrigado, desculpa · E03 Dizer e perguntar o nome · E04 Soletrar nome e e-mail · E05 Números 0–10 e telefone
- **Cap. 2 — Eu, você e o verbo be** (E06–E10): E06 Como você está? (be: I / you) · E07 De onde você é · E08 Apresentar alguém (be: he / she / it) · E09 Sensações com be (fome, sede, frio) · E10 Não é, não está (be negativo; we / they)
- **Cap. 3 — Coisas, preços e lugares** (E11–E14): E11 O que é isso? (a/an, this/that) · E12 Números 11–100: preço e idade · E13 De quem é? (my, your, his, her, 's) · E14 Tem … aqui perto? (there is / there are)
- **Cap. 4 — Minha rotina** (E15–E19): E15 Horas e dias · E16 Gosto / não gosto (presente simples I/you) · E17 Perguntas do presente (Do you…?) · E18 Ele e ela no presente (-s) · E19 Rotina e frequência
- **Cap. 5 — Pedir e resolver** (E20–E24): E20 Pedir comida e bebida · E21 Placas e instruções (imperativo) · E22 Can / can't (habilidade e permissão) · E23 Roupa e cor na loja (adjetivo antes do nome) · E24 O que está acontecendo agora (presente contínuo)

### T2 · Se virar · A2 · GSE 30–42
- **Cap. 1 — O que aconteceu** (E01–E05): E01 Onde você estava? (was / were) · E02 Passado regular (-ed) · E03 Passado irregular mais frequente · E04 Perguntas e negativas no passado (did) · E05 Quando foi (ago, last, in, on)
- **Cap. 2 — Planos e convites** (E06–E09): E06 Planos (be going to / plan to) · E07 Convidar, aceitar, recusar · E08 Obrigação (have to / need to) · E09 Pedir emprestado e pedir favor
- **Cap. 3 — Na cidade** (E10–E13): E10 Direções · E11 Quantidade (some/any, much/many) · E12 Comparar (cheaper, more expensive) · E13 O melhor, o mais (superlativo)
- **Cap. 4 — Resolver problemas** (E14–E17): E14 Na farmácia e no médico · E15 No telefone e tirando dúvidas · E16 Experiências (present perfect) · E17 Reclamar e resolver

### T3 · Conversar (esboço) · B1 · GSE 43–58
Esboço: opinião e razão (because, I think), futuro com will, first conditional, present perfect com for/since, relato de problemas no trabalho, contar histórias com past continuous, used to, entrevista de emprego. O detalhamento fica para depois do 1º ciclo de dados da T1.

## Unidades (41)

Legenda de frequência na tabela completa do JSON: `S123` = rank no NGSL-Spoken; `A1/A2/B1` = nível Oxford 3000.

| Código | Unidade | Consigo… | GSE | Estrutura mínima | Palavras-alvo | Pronúncia | Erro de brasileiro (tempero) | Pré-requer |
|---|---|---|---|---|---|---|---|---|
| T1 E01 (U01) | Cumprimentar e se despedir | Consigo cumprimentar e me despedir com expressões fixas. | 12–19 | Fórmulas fixas, sem gramática: Hi! / Good morning! / Bye! | hi, hello, good morning, good evening, good night, bye, see you | morning /ˈmɔːrnɪŋ/ | ~~Good night! (ao chegar num lugar à noite)~~ → Good evening! | — |
| T1 E02 (U02) | Por favor, obrigado, desculpa | Consigo ser educado: pedir por favor, agradecer, responder 'de nada' e pedir licença ou desculpa. | 12 | Fórmulas fixas: ___, please. / Thank you. — You're welcome. | please, thank you, thanks, you're welcome, sorry, excuse me, yes, no | thank /θæŋk/ | ~~Thank you! — Nothing!~~ → Thank you! — You're welcome! | U01 |
| T1 E03 (U03) | Dizer e perguntar o nome | Consigo dizer meu nome, perguntar o nome de alguém e responder 'prazer'. | 10–12 | I'm + nome (contração pronta, sem analisar o verbo ainda) | I'm …, my name's …, What's your name?, Nice to meet you., And you? | I'm /aɪm/ | ~~I call myself Capy.~~ → I'm Capy. / My name's Capy. | U01 |
| T1 E04 (U04) | Soletrar nome e e-mail | Consigo soletrar meu nome e entender quando alguém pergunta como se escreve. | 11–22 | How do you spell ___? — C, A, P, Y. | How do you spell that?, A, E, I, Y, at, dot | A /eɪ/, E /iː/, I /aɪ/ | ~~soletrar E como 'é' e I como 'i'~~ → E = 'í', I = 'ái' | U03 |
| T1 E05 (U05) | Números 0–10 e telefone | Consigo dar e pedir um número de telefone. | 13–17 | What's your number? — It's five five five… | What's your number?, one, two, three, four, five, six, seven, eight, nine, oh, ten | three /θriː/ | ~~tree (para 3)~~ → three | U04 |
| T1 E06 (U06) | Como você está? (be: I / you) | Consigo perguntar como alguém está e dizer como eu estou. | 24–28 | be com I / you: I'm, you're, Are you…? — Yes, I am. | How are you?, I'm good., I'm tired., Are you …?, Yes, I am., No, I'm not. | you're /jʊr/ | ~~Yes, I'm.~~ → Yes, I am. | U03 |
| T1 E07 (U07) | De onde você é | Consigo dizer de onde sou e perguntar a origem de alguém. | 12–23 | I'm from + país / I'm + nacionalidade | Where are you from?, I'm from Brazil., Brazilian, the US, American | Brazil /brəˈzɪl/ | ~~I'm from Brazilian. / I'm Brazil.~~ → I'm from Brazil. I'm Brazilian. | U06 |
| T1 E08 (U08) | Apresentar alguém (be: he / she / it) | Consigo apresentar uma pessoa e dizer uma coisa simples sobre ela. | 26–27 | This is + nome. He's / She's / It's + … | This is …, he's, she's, it's, my friend, my boss | he's /hiːz/ | ~~Is my friend. / Is good.~~ → He's my friend. / It's good. | U06, U07 |
| T1 E09 (U09) | Sensações com be (fome, sede, frio) | Consigo dizer como estou me sentindo agora: fome, sede, frio, calor. | 28 | I'm + adjetivo (be, não have) | I'm hungry., thirsty, cold, hot, so | hungry /ˈhʌŋɡri/ × angry /ˈæŋɡri/ | ~~I have hungry.~~ → I'm hungry. | U06 |
| T1 E10 (U10) | Não é, não está (be negativo; we / they) | Consigo dizer que algo não está aberto, não está pronto, não é aqui. | 25 | sujeito + be + not: It isn't / We aren't / They aren't | open, closed, It isn't …, We aren't …, not yet, we're / they're | aren't /ɑːrnt/ | ~~It's no open. / No is open.~~ → It isn't open. | U08 |
| T1 E11 (U11) | O que é isso? (a/an, this/that) | Consigo perguntar o nome de um objeto e dizer o que é. | 12–16 | It's a / an + objeto. (an antes de som de vogal) | What's this?, that, a key, a card, an umbrella, a phone | this /ðɪs/ | ~~It's a umbrella.~~ → It's an umbrella. | U08 |
| T1 E12 (U12) | Números 11–100: preço e idade | Consigo perguntar e dizer o preço de algo, e dizer minha idade. | 18–26 | How much is it? — It's + preço. / I'm + idade. | How much is it?, fifteen, fifty, dollars, How old are you?, twenty | fifTEEN × FIFty | ~~How much costs? / I have 26 years.~~ → How much is it? / I'm 26. | U05, U09 |
| T1 E13 (U13) | De quem é? (my, your, his, her, 's) | Consigo dizer de quem é uma coisa. | 29 | my / your / his / her + coisa · nome + 's + coisa | my, your, his, her, Lazy's, Whose … is this? | his /hɪz/ × he's /hiːz/ | ~~the phone of Lazy / her phone (para o celular de um homem)~~ → Lazy's phone / his phone | U11 |
| T1 E14 (U14) | Tem … aqui perto? (there is / there are) | Consigo perguntar se existe um lugar perto e entender a resposta. | 28–29 | Is there a … near here? — Yes, there's … / No, there isn't. | Is there …?, There's …, near here, a supermarket, a bathroom, a bank | there's /ðerz/ | ~~Have a supermarket near here?~~ → Is there a supermarket near here? | U10, U11 |
| T1 E15 (U15) | Horas e dias | Consigo perguntar e dizer a hora e o dia de um compromisso. | 16–24 | It's + hora. / at + hora. | What time is it?, It's six o'clock., six thirty, at, today, tomorrow, Monday | thirty /ˈθɝːɾi/ | ~~What hours are they?~~ → What time is it? | U12 |
| T1 E16 (U16) | Gosto / não gosto (presente simples I/you) | Consigo dizer do que gosto e do que não gosto. | 28 | I + verbo / I don't + verbo | I like …, I don't like …, I love …, coffee, tea, it | don't /doʊnt/ | ~~I no like coffee.~~ → I don't like coffee. | U10 |
| T1 E17 (U17) | Perguntas do presente (Do you…?) | Consigo perguntar o que a pessoa faz, gosta ou onde mora. | 27–28 | Do you + verbo …? — Yes, I do. / No, I don't. | Do you …?, Yes, I do., No, I don't., live, work, speak | live /lɪv/ | ~~Do you like? (sem objeto)~~ → Do you like it? | U16 |
| T1 E18 (U18) | Ele e ela no presente (-s) | Consigo dizer onde alguém trabalha, mora e o que faz. | 27–29 | he / she / it + verbo com -s | works, lives, has, doesn't, goes, in the afternoon | -s /s/ /z/ /ɪz/ | ~~She work in the afternoon.~~ → She works in the afternoon. | U17 |
| T1 E19 (U19) | Rotina e frequência | Consigo descrever minha rotina com sempre, normalmente, nunca. | 28–31 | sujeito + always/usually/never + verbo | get up, go to work, have breakfast, always, usually, never, every day | usually /ˈjuːʒuəli/ | ~~I go always to work.~~ → I always go to work. | U18, U15 |
| T1 E20 (U20) | Pedir comida e bebida | Consigo pedir comida e bebida com educação. | 24–31 | Can I get / have + coisa, please? | Can I get …?, Can I have …?, I'd like …, for here, to go, small, large | Can I /kən aɪ/ | ~~I want a coffee.~~ → Can I get a coffee, please? | U02, U12 |
| T1 E21 (U21) | Placas e instruções (imperativo) | Consigo entender e dar instruções curtas: empurre, espere, entre. | 26 | verbo sem sujeito = ordem/instrução; Don't + verbo | push, pull, wait, come in, don't …, sit down | push /pʊʃ/ × pull /pʊl/ | ~~push = puxar~~ → push = empurrar; pull = puxar | U10 |
| T1 E22 (U22) | Can / can't (habilidade e permissão) | Consigo dizer o que sei ou não sei fazer e pedir permissão. | 27 | can + verbo (sem to, sem -s) | I can …, I can't …, Can you help me?, Can I pay by card?, drive, ask | can /kən/ × can't /kænt/ | ~~Can I make a question?~~ → Can I ask a question? | U21 |
| T1 E23 (U23) | Roupa e cor na loja (adjetivo antes do nome) | Consigo pedir uma roupa pela cor e pelo tamanho. | 30–31 | adjetivo + nome (sem plural no adjetivo) | a black jacket, a white shirt, blue, size, too big, small | shirt /ʃɝːt/ | ~~a jacket black / blacks shoes~~ → a black jacket / black shoes | U12, U20 |
| T1 E24 (U24) | O que está acontecendo agora (presente contínuo) | Consigo dizer o que está acontecendo agora. | 33 | be + verbo-ing | It's raining., I'm working., What are you doing?, now, right now, waiting | -ing /ɪŋ/ | ~~Is raining.~~ → It's raining. | U08, U18 |
| T2 E01 (U25) | Onde você estava? (was / were) | Consigo dizer onde eu estava e como estava. | 33 | was / were + lugar/adjetivo | I was …, you were, yesterday, at home, at work, last night | was /wʌz/ fraco | ~~I was in home.~~ → I was at home. | U24 |
| T2 E02 (U26) | Passado regular (-ed) | Consigo contar o que fiz ontem com verbos regulares. | 40 | verbo + -ed | worked, called, asked, needed, watched, stayed | -ed /t/ /d/ /ɪd/ | ~~work-ÊD (pronunciar sempre 'êd')~~ → worked /wɝːkt/ | U25 |
| T2 E03 (U27) | Passado irregular mais frequente | Consigo contar o que fiz com os verbos irregulares mais usados. | 40 | formas irregulares (decorar em bloco com contexto) | went, had, got, did, said, made, bought | said /sed/ | ~~Yesterday I go to the store.~~ → Yesterday I went to the store. | U26 |
| T2 E04 (U28) | Perguntas e negativas no passado (did) | Consigo perguntar o que alguém fez e negar o que não fiz. | 40 | Did + sujeito + verbo base / didn't + verbo base | Did you …?, I didn't …, Yes, I did., see, call, finish | didn't /ˈdɪdənt/ | ~~I didn't went.~~ → I didn't go. | U27 |
| T2 E05 (U29) | Quando foi (ago, last, in, on) | Consigo situar um fato no tempo. | 25 | número + ago / last + período / in + ano / on + dia | ago, last week, in 2024, on Monday, two days ago, When …? | ago /əˈɡoʊ/ | ~~since two days / the last week~~ → two days ago / last week | U28 |
| T2 E06 (U30) | Planos (be going to / plan to) | Consigo dizer o que vou fazer e o que pretendo fazer. | 38–39 | be going to + verbo | I'm going to …, plan to, this weekend, next week, take the test, maybe | going to → gonna | ~~I pretend to take the test.~~ → I plan to take the test. | U24 |
| T2 E07 (U31) | Convidar, aceitar, recusar | Consigo convidar alguém e aceitar ou recusar com educação. | 31–32 | Would you like to + verbo? / I'd love to. | Would you like to …?, Are you free …?, Sure!, I'd love to., Sorry, I can't., I agree. | Would you /wʊdʒə/ | ~~I'm agree.~~ → I agree. | U30 |
| T2 E08 (U32) | Obrigação (have to / need to) | Consigo dizer o que preciso ou tenho que fazer. | 33 | have to / need to + verbo | I have to …, I need to …, I don't have to …, go, leave, early | have to /ˈhæftə/ | ~~I need go.~~ → I need to go. | U31 |
| T2 E09 (U33) | Pedir emprestado e pedir favor | Consigo pedir algo emprestado e pedir um favor. | 30–34 | Can I borrow + coisa? / Could you lend me + coisa? | Can I borrow …?, lend, Could you …?, a pen, Of course., a favor | borrow /ˈbɑːroʊ/ | ~~Can you borrow me your pen?~~ → Can I borrow your pen? | U32 |
| T2 E10 (U34) | Direções | Consigo pedir e dar direções simples. | 32–34 | imperativo + preposição de lugar | turn left, turn right, go straight, next to, across from, on the corner | straight /streɪt/ | ~~in the corner (de rua)~~ → on the corner | U14, U21 |
| T2 E11 (U35) | Quantidade (some/any, much/many) | Consigo perguntar e dizer quantidades. | 33 | many + contável / much + incontável | How many …?, How much …?, some, any, money, a lot of | money /ˈmʌni/ | ~~How many money?~~ → How much money? | U34 |
| T2 E12 (U36) | Comparar (cheaper, more expensive) | Consigo comparar duas coisas. | 37 | adjetivo-er + than / more + adjetivo longo + than | cheaper, bigger, better, more expensive, than, worse | than /ðæn/ | ~~more cheap / more better~~ → cheaper / better | U35 |
| T2 E13 (U37) | O melhor, o mais (superlativo) | Consigo dizer qual é o melhor, o mais barato, o mais perto. | 37 | the + adjetivo-est / the most + adjetivo longo | the best, the cheapest, the closest, the most expensive, in town, the worst | best /best/ | ~~the more good~~ → the best | U36 |
| T2 E14 (U38) | Na farmácia e no médico | Consigo dizer o que estou sentindo e entender um conselho simples. | 36–39 | I have a + sintoma / You should + verbo | I have a headache., a cold, It hurts., sick, You should …, medicine | headache /ˈhedeɪk/ | ~~I'm with a headache.~~ → I have a headache. | U09, U32 |
| T2 E15 (U39) | No telefone e tirando dúvidas | Consigo marcar horário por telefone e pedir para repetir. | 30–42 | Could you + verbo? / I'd like to make an appointment. | Could you repeat that?, I have a question., appointment, Can I speak to …?, slowly, Hold on. | question /ˈkwestʃən/ | ~~I have a doubt.~~ → I have a question. | U33 |
| T2 E16 (U40) | Experiências (present perfect) | Consigo perguntar e contar se já fiz algo na vida. | 35–36 | have + particípio (experiência, sem data) | Have you ever …?, I've been to …, never, driven, tried, once | I've /aɪv/ | ~~I have been there last year.~~ → I went there last year. | U27, U29 |
| T2 E17 (U41) | Reclamar e resolver | Consigo explicar um problema simples e pedir troca ou reembolso. | 35 | It doesn't + verbo / Can I + verbo? | There's a problem with …, It doesn't work., broken, Can I get a refund?, exchange, receipt | receipt /rɪˈsiːt/ | ~~It's not functioning.~~ → It doesn't work. | U40 |

### Frequência das palavras da T1 parte 1 (E01–E14)

- **U01**: hi (A1); hello (A1); good morning (S228 · A1); good evening (S678 · A1); good night (S199 · A1); bye (A1); see you (S54 · A1)
- **U02**: please (S298 · A1); thank you (S158 · A1); thanks (S158 · A1); you're welcome (A1); sorry (S254 · A1); excuse me (B2); yes (S56 · A1); no (S50 · A1)
- **U03**: I'm … (S1 · A1); my name's … (S223 · A1); What's your name? (S223 · A1); Nice to meet you. (S159 · A1); And you? (S4 · A1)
- **U04**: How do you spell that? (A1); A (S454 · A1); E (S454 · A1); I (S454 · A1); Y (S454 · A1); at (S40 · A1); dot (fora das listas)
- **U05**: What's your number? (S162 · A1); one, two, three (S95 · A1); four, five, six (S116 · A1); seven, eight, nine (S234 · A1); oh (A2); ten (S210 · A1)
- **U06**: How are you? (S84 · A1); I'm good. (S63 · A1); I'm tired. (A1); Are you …? (S1 · A1); Yes, I am. (S56 · A1); No, I'm not. (S11 · A1)
- **U07**: Where are you from? (S64 · A1); I'm from Brazil. (S64 · A1); Brazilian (fora das listas); the US (A1); American (fora das listas)
- **U08**: This is … (S21 · A1); he's (S16 · A1); she's (S33 · A1); it's (S5 · A1); my friend (S272 · A1); my boss (A2)
- **U09**: I'm hungry. (A1); thirsty (A1); cold (S622 · A1); hot (S675 · A1); so (S20 · A1)
- **U10**: open (S288 · A1); closed (A2); It isn't … (S1 · A1); We aren't … (S14 · A1); not yet (S282 · A2); we're / they're (S13 · A1)
- **U11**: What's this? (S21 · A1); that (S12 · A1); a key (A1); a card (S457 · A1); an umbrella (A1); a phone (S325 · A1)
- **U12**: How much is it? (S96 · A1); fifteen (S484 · A1); fifty (S278 · A1); dollars (S437 · A1); How old are you? (S171 · A1); twenty (S188 · A1)
- **U13**: my (S25 · A1); your (S3 · A1); his (S16 · A1); her (S33 · A1); Lazy's (fora das listas); Whose … is this? (A2)
- **U14**: Is there …? (S30 · A1); There's … (S30 · A1); near here (S559 · A1); a supermarket (A1); a bathroom (A1); a bank (A1)

## Estrutura nova do episódio (60–70 s)

| Bloco | Seção no JSON | Tempo aprox. | Função didática |
|---|---|---|---|
| Gancho | `cena` (3–4 falas) | 7–10 s | a Capy trava ou erra numa situação adulta real: cria a NECESSIDADE da palavra |
| (a) Apresentar | `licao.exercicios[0]` tipo **cartoes** | 11–14 s | 5 cartões: inglês + emoji + tradução na tela, áudio lento, pausa para repetir |
| (b) Reconhecer | tipo **ligar** | ~6 s | ligar 3 pares inglês ↔ português (recuperação imediata) |
| (b) Reconhecer pelo ouvido | tipo `ouvir` (já existe) | ~7 s | discriminação: par mínimo ou forma errada, com chute da Capy |
| (c) Usar | tipo `montar` (já existe) ou **completar** | 8–11 s | a frase curtíssima, só com palavras já apresentadas; o erro de brasileiro vira a peça que sobra ou a opção errada |
| (e) Revisão espaçada | tipo **revisao** | 5–7 s | 2–3 itens de episódios anteriores (n−1, n−3, n−7): tradução na tela, 3 s para lembrar, áudio revela |
| (d) Mini-cena | `volta` | 8–12 s | a Capy usa as palavras na história; o card do Caderninho fecha com a CTA |

A revisão fica antes da volta para que o vídeo termine na história, que é o gancho para o próximo episódio. O intervalo n−1, n−3, n−7 expande o espaçamento, como recomendam Cepeda et al. 2008 (já citado em `docs/conselho/2026-09-26/didatica-linguistica.md`).

## Schema dos exercícios novos (para o renderer `src/lesson/*` e `src/Licao.tsx`)

Compatível com o formato atual: `Exercicio.tipo` ganha 4 valores e `Line` ganha 1 campo (`alvo`) mais 3 valores de `evento`. Os tipos antigos (`traducao`, `montar`, `ouvir`, `repetir`) continuam iguais.

```ts
// timeline.ts
export type Speaker = "capi" | "hank" | "lazy" | "duda" | "poppy" | "bolinha" | "donajaca" | "narrador";
export type Line = { /* campos atuais */
  evento?: "som" | "modelo" | "cartao" | "par" | "lembra";
  alvo?: number; // índice do cartão / par / item que esta fala acende
};
export type Pause = { pausa: "timer" | "mic" | "respiro"; s: number; evento?: "desmaio" | "ligar"; sfx?: string[] };
export type Exercicio = {
  tipo: "traducao" | "montar" | "ouvir" | "repetir" | "cartoes" | "ligar" | "completar" | "revisao";
  titulo: string; xp?: number; passos: Passo[];
  // já existentes: enunciado, opcoes, resposta, chute, tiles, ordem, frase
  cartoes?: { en: string; pt: string; emoji?: string }[]; // cartoes
  repita?: boolean;                                      // cartoes: ícone de microfone no cartão durante o hold
  pares?: { en: string; pt: string }[];                 // ligar
  direita?: number[];                                   // ligar: ordem da coluna PT (permutação de índices de pares)
  lacuna?: string;                                      // completar: marcador dentro de `frase` (padrão "___")
  itens?: { en: string; pt: string; emoji?: string; de: string }[]; // revisao (de = "T1 E03")
  mascote?: "bolinha";                                  // revisao: o Bolinha tira as frases da bochecha (visual; não fala)
};
```

### `cartoes`: APRESENTAR
```json
{ "tipo": "cartoes", "titulo": "PALAVRAS NOVAS", "repita": true, "xp": 0,
  "cartoes": [ { "en": "good morning", "pt": "bom dia", "emoji": "☀️" } ],
  "passos": [
    { "speaker": "capi", "lang": "pt", "emotion": "happy", "text": "Antes da frase, a palavra. Ouve e repete." },
    { "speaker": "capi", "lang": "en", "emotion": "zen", "speed": 0.75, "evento": "cartao", "alvo": 0, "hold": 0.3, "text": "good morning" } ] }
```
- Renderizar 1 cartão grande por vez: `emoji` (≥160 px), `en` (fonte TITLE, ≥90 px) e `pt` embaixo, menor e em cinza. O cartão entra quando começa a fala com `evento:"cartao"` e `alvo:i`. Os anteriores viram uma pilha pequena no topo, que é o progresso visual.
- A fala pode ser diferente do cartão (ex.: cartão `A`, fala `The letter A.`; cartão `he's`, fala `He's my friend.`). Na tela fica sempre o `en` do cartão, e a fala aparece como legenda.
- Com `repita: true`, o `hold` depois de cada fala mostra um microfone pulsando no cartão (o mesmo `MicPanel` pequeno).
- XP 0 e nenhum timer: `exerciseMarks` devolve `kind:"none"`, e o progresso conta no fim do exercício. Hoje isso já acontece com `doneAt = m.reveal = end`.

### `ligar`: RECONHECER (pares)
```json
{ "tipo": "ligar", "titulo": "LIGUE OS PARES", "xp": 10,
  "pares": [ { "en": "good morning", "pt": "bom dia" }, { "en": "bye", "pt": "tchau" }, { "en": "hello", "pt": "olá" } ],
  "direita": [2, 0, 1],
  "passos": [ { "pausa": "timer", "s": 4 }, { "pausa": "respiro", "s": 1.65, "evento": "ligar" } ] }
```
- Duas colunas: à esquerda os `pares[i].en` na ordem, à direita os `pares[direita[k]].pt`. Durante o `timer`, só o relógio corre.
- No `reveal` (fim do timer), uma linha curva é desenhada de cada par, um por vez, a cada 0,45 s (`respiro` com `evento:"ligar"` reserva esse tempo; sfx `pop` por linha, depois `correct`). O XP entra quando a última linha termina.
- `direita` precisa ser uma permutação diferente da identidade (o script de checagem já barra isso).

### `completar`: USAR (lacuna)
```json
{ "tipo": "completar", "titulo": "COMPLETE", "enunciado": "Chegando no café às oito da noite:",
  "frase": "___!", "lacuna": "___", "opcoes": ["Good night", "Good evening", "Good morning"], "resposta": 1, "chute": 0, "xp": 10,
  "passos": [ { "pausa": "timer", "s": 3 },
    { "speaker": "capi", "lang": "en", "emotion": "happy", "text": "Good evening!" },
    { "speaker": "capi", "lang": "pt", "emotion": "panic", "text": "A outra boa noite é só pra ir embora ou dormir." } ] }
```
- Layout do `traducao`: `PromptCard` com `enunciado` (a situação em português) e, logo abaixo, a `frase` com a lacuna em destaque. Embaixo vêm as `Options`.
- `chute` funciona igual ao do `ouvir`: a Capy marca a opção errada durante o timer e perde 1 coração. No `reveal`, a lacuna é preenchida com `opcoes[resposta]`.
- A primeira fala `en` depois do timer deve conter a frase completa (a checagem compara as duas).

### `revisao`: REVISÃO ESPAÇADA (quadro do Bolinha)
```json
{ "tipo": "revisao", "titulo": "LEMBRA?", "mascote": "bolinha", "xp": 10,
  "itens": [ { "en": "please", "pt": "por favor", "emoji": "🙏", "de": "T1 E02" } ],
  "passos": [ { "pausa": "timer", "s": 3 },
    { "speaker": "capi", "lang": "en", "emotion": "happy", "evento": "lembra", "alvo": 0, "text": "please" } ] }
```
- 2 ou 3 cartões pequenos, cada um com `emoji`, `pt` e um selo `de` ("do T1 E02"). O inglês fica escondido (borrado).
- Durante o timer, o Bolinha aparece com as bochechas cheias (desenho a fazer; enquanto não existir, mostrar só o selo "BOLINHA LEMBRA"). A cada fala com `evento:"lembra"` e `alvo:i`, o cartão i revela o `en` e toca `pop`.
- O Bolinha não fala nesta versão, porque `scripts/tts.py` ainda não tem voz para ele. A voz é da Capy.

### Campos novos no nível do episódio (metadados; o renderer pode ignorar)
`serie {temporada, capitulo, episodio, codigo, tituloCapitulo}`, `unidade`, `canDo`, `gse [{valor, descritor, fonte}]`, `gramatica`, `vocabulario []`, `erroBrasileiro {errado, certo, porque}`, `pronuncia {foco, dica}`, `revisaoDe [{codigo, en []}]`, `topicoId` (quando existe em `en-br.json`).
Sugestão de uso na tela: selo "T1 E03 · Cap. 1" no canto durante a `cena` (reforça a ideia de série e de maratonar do começo).

