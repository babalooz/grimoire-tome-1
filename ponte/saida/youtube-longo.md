# YouTube longo em tela cheia (16:9) · protótipo do dia 29/10/2026

Feito em 28/10/2026 pela rotina da nuvem, a partir da sua decisão de 28/10. **Nada foi publicado nem agendado.**

## Resultado
- **Vídeo:** branch `midia`, arquivo `dia-2026-10-29-wide.mp4` (commit `3114826`):
  https://raw.githubusercontent.com/babalooz/grimoire-tome-1/3114826501ab7c66767df74799306607f3a888e3/dia-2026-10-29-wide.mp4
- **Duração 2:59** (179,2 s), 1920x1080, 30 fps, H.264, yuv420p/tv/bt709, **−14,07 LUFS**, pico **−1,44 dBTP**.
- **Portão aprovado.** Camada 1 sem nenhuma falha. Movimento no início: 0,23 (0→1 s) e 0,28 (0→2 s), o mínimo é 0,10.
  O juiz deu **8,3** com a régua do mestre.
- **Voz nova: zero.** O motor bloqueia a rede e só usa o cache (`scripts/tts_cache.py`). A sitcom e o corte usam as 37
  falas de `_cache_gemini`; o vocabulário usa os cortes de `voz-cache`.
- **Sincronia palavra-fala:** conferi as 72 falas no MP4 final, correlacionando o áudio de cada fala do cache com o vídeo.
  Todas ficaram dentro de ±3 quadros. O desvio é sempre +1,3 quadro, que é o atraso fixo do AAC.
- **O vertical não mudou.** O Cafe vertical saiu idêntico pixel a pixel antes e depois do código novo.
- **Miniatura 1280x720:** `ponte/saida/youtube-longo/miniatura-dia-2026-10-29.png`.
  Quadros do vídeo: `ponte/saida/youtube-longo/quadros-dia-2026-10-29.jpg`.
- **O Buffer NÃO publica vídeo longo do YouTube.** Detalhes no §3. O longo vai precisar de upload no YouTube Studio
  ou da YouTube Data API.

## 1. O que entrou no protótipo (ordem do vídeo)
| Tempo | Bloco | Origem (os MESMOS JSONs) |
|---|---|---|
| 0:00–0:06 | Abertura: a câmera abre do close na Capy para o café inteiro, a placa "CapyFala · quinta, 29/10" cai e aparece a lista "hoje no café" | sem voz, trilha CC0 do café |
| 0:06 | Cartão "1 de 3 · SITCOM" + **Ep. 1 (parte 2/3), um gringo de verdade no café** | `episodes/cafe-t1e01-hi-im-capy-v2.json` |
| 1:12 | Cartão "2 de 3" + **Palavras #02, 9 palavras de Halloween** | `vocab/halloween.json` |
| 2:27 | Cartão "3 de 3" + **corte do Ep. 1** (beats 13–18, 16,8 s): "Hi! I'm Capy." → "Com sotaque? Tudo bem. Deu pra entender." → "Hi! I'm... Capy." → "Hi, Capy." → "Ele escreveu meu nome. Eu falei inglês." → Bolinha: "Hi! I'm Capy." | `cafe-t1e01-hi-im-capy.json`. O V1 já tem post no YouTube em 28/10 (`publicados.csv`) |
| 2:47 | Cartão "episódio completo: T1 E01 no canal" | |
| 2:49–2:59 | Encerramento: "hoje você viu" (Hi! I'm Capy. + 9 palavras), "próximo episódio: T1 E01 · parte 3/3 · sábado, 31/10" (**já está agendado**: YouTube 31/10 12:10) e "inscreva-se no CapyFala para acompanhar a série", sem urgência | |

Estendi o corte até o Bolinha (beat 18) por causa da régua do mestre: "3 bocas ou mais, a Capy nunca a última".
Sem isso, a última boca a dizer a frase-alvo no longo seria a Capy.

## 2. Layout em 16:9 (redesenhado, não é o vertical com moldura)
- **Cenário** (`src/sets/CafeSetWide.tsx`): o Bean There em 1920x1080 com as mesmas peças e cores do vertical
  (menu com S/M/L, letreiro BEAN THERE, luminárias, varal de luzinhas, prateleira de canecas, máquina de espresso,
  pote TIPS). O balcão vai de ponta a ponta, com o tampo em y=640.
- **Elenco lado a lado** (`src/wide/geo.ts`), da esquerda para a direita:
  - Capy (cliente, primeiro plano);
  - Bolinha sentado no balcão;
  - Hank atrás do balcão, no centro;
  - Lazy atrás do balcão;
  - cliente da vez (Duda, Poppy ou Rick) em primeiro plano à direita.

  A Dona Jaca aparece em videochamada no alto, à direita.
- **Câmera:** os mesmos cortes do vertical, calculados pela mesma agenda. Só a geometria muda:
  - close médio com zoom de 1,3 a 1,5;
  - plano de dois;
  - plano aberto;
  - punch de 15% nos planos longos.
- **Legenda de programa** no terço de baixo:
  - chip com o nome de quem fala ("Hank · EN") e karaokê;
  - inglês com 70 px e a frase-alvo com 84 px em marca-texto amarelo;
  - português com 60 px, linha PT só na 1ª vez, risco vermelho na forma errada.

  70 px é cerca de 6,5% da altura: lê no celular deitado e na TV.
- **"Frase de hoje":** fica fixa no canto de cima à direita depois da 1ª vez que a frase-alvo aparece, para quem
  entra no meio. É o único outro amarelo, e é a própria frase-alvo.
- **Blocos de aprender:**
  - "sua vez" com microfone e contador, e "pensa aí" com contador, centralizados com o fundo escurecido;
  - no vocabulário, a fileira das palavras ocupa a largura toda em cima e "sua vez" / "qual é?" ficam no terço de baixo;
  - a palavra cola no objeto no mesmo quadro da voz.
- **Zona segura do YouTube:** nada de texto fora de x 110–1810 e y 64–950. A faixa y>960 fica livre para a barra
  e os botões do player. O portão confere isso em modo auditoria (só interface sobre preto).
- **Encerramento:** a metade direita fica livre para os elementos da tela final do YouTube, que são colocados no Studio.
- **Já funciona para o VOCAB 03 (cumprimentos, 30/10):** portei o "quadro de cena" que entrou no main hoje.
  Testei em quadro estático.

Código (main, commit `ad60914`):
- composições `CafeWide`, `VocabWide`, `DiaWide` e `MiniaturaWide`;
- `scripts/make-dia-wide.sh` e `scripts/dia-wide.ts` (props, capítulos e pacote de texto);
- `scripts/tts_cache.py`;
- `portao.py --dia`;
- `publicar.py` (faixa "longo");
- `scripts/teste_publicar_longo.py`.

## 3. Buffer: o que ele aceita (só documentação oficial e o publicar.py)
| Pergunta | Resposta | Fonte (lida em 28/10/2026) |
|---|---|---|
| Publica vídeo NORMAL (não Short) no YouTube? | **Não.** "We do not support long-form YouTube videos at this time." Só Shorts 1:1 ou 9:16, "Up to 3 minutes". Acima disso vira notificação para postar à mão | https://support.buffer.com/article/562-using-youtube-shorts-with-buffer |
| Título e descrição | Título até 100 caracteres (campo `title`). A descrição é o texto do post, até 5.000 caracteres | mesmo artigo e https://developers.buffer.com/types/CreatePostInput.html |
| Categoria | O schema tem `categoryId` (o publicar.py já manda "27" = Educação). Mas a ajuda diz que o Buffer não muda a categoria dos Shorts; ela se troca no Studio. Esta contradição foi apontada pelo agente de pesquisa e **eu não reconferi** | https://developers.buffer.com/types/YoutubePostMetadataInput.html e o artigo 562 |
| Miniatura personalizada | **Não.** `thumbnailUrl`: "Do not use: social networks do not accept custom video thumbnail images, and the API rejects video assets that set this field." `thumbnailOffset` vale só para Instagram, TikTok e Pinterest | https://developers.buffer.com/types/VideoAssetInput.html |
| Tamanho máximo | Shorts: "10GB or less". Fonte: artigo 562, que eu conferi. "1GB" para a maioria das outras redes e o reencode H.264 até 1920x1080 vêm do agente de pesquisa (**não reconferi**) | artigo 562 e https://support.buffer.com/article/616-uploading-and-sharing-links-to-videos |
| Capítulos | O Buffer não fala de capítulos. Capítulos são regra do YouTube: o 1º em 00:00, pelo menos 3 e cada um com pelo menos 10 s. Funcionaria só se o vídeo fosse publicado, e o longo não é | não verificado no Buffer |

**O que faltava no `publicar.py` (já implementado e testado em simulação, sem tocar no Buffer):**
1. A faixa `"longo"` caía na fila com "sem render nem publicador". Agora cai na fila **com o pacote pronto**:
   - arquivo, título, descrição com capítulos, categoria 27, miniatura e "não é para crianças";
   - se o portão aprovou;
   - o motivo, com a URL da doc oficial.

   Assim, o upload no Studio é copiar e colar.
2. **Erro oculto achado:** um Short do YouTube com mais de 3 min iria para o Buffer e viraria só notificação, sem ir
   ao ar. Agora vai para a fila antes de chegar ao Buffer.

O teste simulado `scripts/teste_publicar_longo.py` passa com 0 chamadas ao Buffer e 0 uploads.

## 4. Texto do protótipo (regras do pacote do assunto 1 + numeração de 28/10; sem "travar")
**Título** (73 caracteres; o termo de busca "inglês do zero" vem logo depois do número):
```
Dia 1 · Inglês do zero: Hi! I'm Capy + 9 palavras de Halloween | CapyFala
```
**Descrição** (808 caracteres, sem linha "anterior:" porque é o Dia 1):
```
Episódio do dia do CapyFala em tela cheia: a sitcom do café Bean There, Ep. 1 (parte 2/3); Palavras #02, 9 palavras de Halloween; e um trecho do Ep. 1.

Consigo cumprimentar alguém e dizer meu nome de um jeito simples.
Frase do dia: Hi! I'm Capy. = Oi! Eu sou a Capy.
Palavras: pumpkin (abóbora), candy (doce), ghost (fantasma), bat (morcego), mask (máscara), spider (aranha), witch (bruxa), skeleton (esqueleto), monster (monstro)

Capítulos:
00:00 Ep. 1 (parte 2/3): um gringo de verdade no café
01:12 Palavras #02: 9 palavras de Halloween
02:27 Do Ep. 1: o primeiro "oi" da Capy
02:49 Revisão do dia e próximo episódio

Próximo episódio: Ep. 1 (parte 3/3) · sábado, 31/10.

Inglês do básico, em episódios, com a Capy e a turma do café. Inscreva-se para acompanhar a série.

#capyfala #inglês #inglesdozero
```
Configuração no Studio: categoria **Educação**, "não é conteúdo para crianças", miniatura do PNG acima e tela final
nos últimos 10 s, à direita.

## 5. Plano da rotina diária (só depois que você aprovar o formato)
1. **Onde entra:** no fim da rotina de produção do dia, quando os 3 vídeos do dia já passaram no portão. Comando:
   ```
   scripts/make-dia-wide.sh <data> <sitcom.json> <vocab.json> <corte.json> <de> <ate> "<frase>" "<tag>" "<extra>"
   ```
   - O corte só pode vir de um episódio com post no YouTube **antes** da data (o script recusa os outros).
   - "Próximo episódio" só aparece se já estiver agendado no `publicados.csv`.
   - O "Dia N" é contado sozinho.
2. **Custo por dia:** 0 voz nova e cerca de 8 min de render na nuvem. Ferramenta paga: nenhuma.
3. **Portão:** `portao.py --dia` com o juiz usando a régua do mestre (nota ≥ 8).
4. **Publicação:** como o Buffer não publica longo, há 2 caminhos:
   - **(a) Upload no Studio**, cerca de 3 min por dia seus, copiando o pacote da fila;
   - **(b) YouTube Data API**: `videos.insert` + `thumbnails.set`. Precisa de OAuth feito por você no teclado e de 1 sessão
     minha para implementar. Depois disso fica 100% automático, com miniatura e capítulos. Os nomes dos métodos vêm do
     agente de pesquisa; **não abri a doc da API do YouTube**.
5. **Horário sugerido: 15:10 BRT** (quarta a sexta são os dias mais fortes nas fontes). Fontes de terceiros, não
   medidas no nosso canal:
   - SocialPilot, 301 mil vídeos, vídeo longo às 14h–16h na hora local e 2–3 h antes do pico da noite:
     https://www.socialpilot.co/pt/insights/best-time-to-post-on-youtube
   - pesquisa HubSpot citada pela Vozo, engajamento às 15h–18h e às 18h–21h:
     https://www.vozo.ai/pt/blogs/best-time-to-post-on-youtube
   - o Tecnoblog recomenda testar no próprio canal: https://tecnoblog.net/356202/qual-o-melhor-horario-para-postar-no-youtube/

   15:10 também não colide com os Shorts (YouTube 12:10 e 17:10). Corte: depois de 14 dias, trocar pelo pico real do
   YouTube Analytics do canal.

## 6. Decisões que são suas (máximo 3)
1. **Aprovar ou não o formato** depois de assistir. **Recomendo aprovar.** Ele junta os 3 do dia sem gastar voz nem
   ferramenta, e vídeo longo paga mais que Short (pela pesquisa do CLAUDE.md, Shorts pagam 3–14% do longo).
2. **Como publicar:** upload no Studio (a) ou YouTube Data API (b). **Recomendo (b).** Custa 1 sessão de código e o
   seu OAuth uma vez, e evita depender de você todo dia.
3. **Horário:** 15:10 BRT por 14 dias, ou outro que você preferir.

## 7. Nota e o que falta
**Nota 8/10.** Para chegar a 10:
1. Você assistir e aprovar a cara de programa.
2. O caminho de publicação automático (Data API).
3. O roteiro do V2 trocar "Nice, Capy!" por "Nice to meet you, Capy!". Quem pediu foi o juiz do portão, eu mesmo
   aplicando a régua do mestre; o mestre não revisou este vídeo. Isso é mudança de roteiro e cabe a você.
4. Medir a retenção real do primeiro longo publicado.

**Próximo passo:** você assiste o MP4 e decide aprovar o formato e o caminho de publicação.
