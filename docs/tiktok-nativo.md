# TikTok nativo — CapyFala (versão 26/09/2026)

**Regra-mãe (decisão do Felipe):** o TikTok NÃO recebe o Short repostado. Mesma lição e mesmo chunk em inglês, mas
gancho, falas em português, texto na tela, legenda e comentário fixado próprios, no idioma da comunidade TikTok BR.
O adaptador é o bloco `tiktok` dentro do JSON do episódio-lição (spec na §7). Episódios 1–3 já têm o bloco.

Rótulos: **verificado** (fonte oficial ou página primária lida hoje) · **terceiros** (blog/imprensa, não confirmado pela
plataforma) · **estimativa** (conta ou julgamento meu).

Status da pesquisa do PC (`ponte/saida/pesquisa-tiktok-campeoes.md`): **ainda não publicada** em 26/09 (checado no início
e no fim desta tarefa). Quando sair, cruzar com as §2–§4 e atualizar este arquivo.

---

## 1. O que muda do Short para o TikTok (resumo)

| Item | Short (YouTube) | TikTok |
|---|---|---|
| Gancho | Missão ("MISSÃO: PEDIR UM CAFÉ") | Começa **no erro** (cold open) + moldura nativa na tela (POV / ninguém: / eu: também eu:) |
| Voz da Capy | Simpática, didática | Ironia seca e autodepreciação ("Pronto. Vergonha junto, mas certa.") |
| Repita em voz alta | Exercício | **Isca de dueto** ("faz dueto e repete comigo") |
| Final | Card "comenta" | Card + **corte seco para o gancho** (loop, conta replay) |
| Legenda | Título | Frase de busca primeiro ("Como pedir café em inglês…") |
| Hashtags | 4–5 | 3–5 (o TikTok só considera 5) |
| Comentário fixado | Pergunta | Frase da lição por escrito + pedido de salvar/comentar |
| Duração | 25–75 s | **61–75 s** (Creator Rewards exige > 1 min) |
| Áudio | Som próprio | Som original (voz + trilha CC0). Som em alta só em post manual |

## 2. Linguagem TikTok BR 2026 — gírias e memes (com validade)

Gíria envelhece rápido. Toda gíria usada num episódio vai para `tiktok.memeRefs` com `validoAte` e `fallback`;
o portão troca o texto pelo fallback se a data de publicação passar da validade (§7). Revisar esta tabela todo mês.

| Termo | Sentido | Fonte · data da fonte | Validade (estimativa) | Usar na Capy? |
|---|---|---|---|---|
| "é um nervosismo surreal" | bordão de vídeo viral de nervosismo | [Tediado](https://www.tediado.com.br/08/memes-2026-os-virais/) · ago/2026 (terceiros; "mais de 1 mi de views" segundo o site) | **até 31/10/2026** | Sim, ep. 1 (pânico da Capy) |
| buffado | forte demais, em vantagem (gamer) | [HBR](https://hbrbr.com.br/10-girias-mais-usadas.html) · 21/11/2025 (terceiros) | até 31/12/2026 | Sim, ep. 2 ("essa porta tá buffada") |
| flopou / flopado | fracassou | HBR · 21/11/2025 (terceiros) | até 31/12/2026 (gíria estável) | Sim, ep. 3 ("minha ficha flopou") |
| amassou | mandou muito bem | HBR · 21/11/2025 (terceiros) | até 31/12/2026 | Sim, para acerto no exercício |
| hypeado / estourado | em alta / viralizou | HBR · 21/11/2025 (terceiros) | até 31/12/2026 | Com moderação |
| comeu | fez algo excelente | [Conversar com Adolescente](https://www.conversarcomadolescente.com.br/post/dicion%C3%A1rio-de-g%C3%ADrias-da-gera%C3%A7%C3%A3o-z-e-gera%C3%A7%C3%A3o-alpha-atualizado-2026) · mar/2026, atualizado set/2026 (terceiros) | até 31/12/2026 | Sim ("o Hank comeu nessa") |
| farmar aura | construir presença/estilo | idem + HBR (terceiros) | até 31/12/2026 | Só texto de tela, com ironia ("farmando aura no balcão") |
| "Tu, finish" | pt+en do Jorge Jesus sobre Neymar | [Exame](https://exame.com/esporte/copa-do-mundo-2026-os-memes-que-dominaram-as-redes-e-marcaram-o-torneio/) · 13/07/2026 (verificado na matéria) | **vencido** (Copa acabou) | **Não**: pessoa real + vencido |
| "Neysexual", ratos de "Bichos Escrotos" | memes de jul–ago/2026 | Tediado · ago/2026 (terceiros) | vencendo | **Não**: pessoa real / música de terceiros |
| skibidi, 6 7 (67), brain rot | nonsense geração Alpha | Conversar com Adolescente (terceiros) | — | **Não**: puxa para "feito para crianças" |
| cringe, rizz, "chat", IYKYK | gírias em inglês | idem | — | Só em texto de tela. **Nunca em fala `pt`** (a voz pt pronuncia errado e quebra a regra "inglês só em fala `en`") |

**Moldura de humor que não envelhece** (usar mais que gíria): ironia seca, frase curta de 2–6 palavras, autodepreciação
("Pelo menos sou coerente"), Hank como "homem sério" que não ri, contraste sério × absurdo.

## 3. Formatos nativos (com timing para 61–75 s)

Esqueleto comum (todos): **0–2,5 s** gancho (erro já acontecendo + moldura na tela) · **2,5–10 s** consequência (desmaio,
Hank seco) · **10–55 s** os 4 exercícios da lição (timer 3–4 s, mic 3 s) · **55–70 s** volta + card · **corte seco** para o
frame 1 (loop). Keyword da busca **falada ou escrita nos 3 primeiros segundos** (terceiros, ver §6).

| `formato` | Tela no gancho | Quando usar | Exemplo |
|---|---|---|---|
| `pov` | "POV: seu 1º pedido em inglês nos EUA" (fixo no topo) | Situação que o público reconhece como sua | Ep. 1 |
| `ninguem` | "ninguém:" (0,8 s) → "eu preenchendo a ficha em inglês:" | Erro espontâneo e sem motivo | Ep. 3 |
| `eu-tambem-eu` | "eu: vou arrasar" → "também eu:" + tombo | Expectativa × realidade | Ep. 2 |
| `quando-voce` | "quando você fala 'I have 26 years' e o gringo trava" | Reação do outro personagem | Eps. com Hank reagindo |
| `resposta-comentario` | Balão "Responder @usuário" com o comentário real | Comentário real com erro ou pergunta | Plano em `respostaComentario` |
| `dueto-isca` | "faz dueto e repete comigo" | Sempre no exercício "repetir" | Eps. 1–3 |
| `costura` (stitch) | Outro vídeo 1–5 s + Capy reage | Só manual, no app | Nunca automático |

Notas: dueto e costura são feitos no app. Pelos termos do Creator Rewards, dueto/stitch **não contam** como conteúdo
original para quem os faz (verificado nos termos BR, ver `docs/pesquisas/2026-09-26-canais-conteudo-tendencias.md`).
Para nós o dueto é isca de engajamento, não fonte de receita.

## 4. O que NÃO fazer

- **Cringe de marca:** "E aí, galera!", "sextou", "bora aprender?", "segue pra parte 2" sem parte 2, explicar a piada,
  empilhar 3 gírias na mesma frase, emoji em toda fala.
- **Gíria vencida:** meme com mais de ~2 meses sem ter virado bordão estável. Na dúvida, fallback neutro.
- **Pessoa real:** nome, rosto, voz ou bordão atrelado a pessoa real (Neymar, Jorge Jesus, BBB). Regra do projeto:
  nada de rosto/marca de terceiros.
- **Infantil:** skibidi, 67, voz fina, "amiguinhos", cores de desenho de bebê. Risco de "feito para crianças".
- **Repost:** subir o arquivo do Short com marca d'água ou o mesmo gancho. O Creator Rewards exige conteúdo original
  e as fontes citam marca d'água de outra plataforma como desclassificante (terceiros: [Gemlist](https://www.gemlist.io/blog/tiktok-creator-rewards-requirements)).
- **Número inventado:** "só 7% acertam" só com dado real (votos do nosso site). Idade "26" é da personagem, não estatística.
- **Inglês em fala `pt`:** qualquer palavra em inglês vai em fala `en` separada; no texto de tela pode (POV, cringe).

## 5. Áudio em alta sem violar direito

Fatos:
- Conta **pessoal** acessa a biblioteca geral de músicas para uso **não comercial**; conta **comercial (business)** só
  vê a Commercial Music Library (CML) (terceiros: [Soundstripe](https://www.soundstripe.com/blogs/tiktok-music-licensing-rules)).
- Termos da CML: sons comerciais são os únicos liberados para uso comercial; não podem ser usados fora do TikTok nem
  separados do vídeo (**verificado**: [CML User Terms](https://www.tiktok.com/legal/page/global/commercial-music-library-user-terms/en)).
- Creator Rewards exige **conta pessoal** (verificado, termos BR) → @acapyfala fica **pessoal**.
- Vídeo que promove produto/serviço próprio (ex.: "faz o teste de nível no link") é uso comercial mesmo em conta
  pessoal (terceiros: Soundstripe) → nesses, **só som original ou CML**.
- A Content Posting API (e o Buffer, que usa ela) **não anexa sons da biblioteca**; o áudio precisa estar embutido no
  arquivo (terceiros: [TokPortal](https://www.tokportal.com/learn/tiktok-sounds-api); o doc oficial de
  [Direct Post](https://developers.tiktok.com/docs/en/content-posting-api-get-started) não lista parâmetro de música).

Regra do CapyFala:
1. **Padrão (automático):** som original = voz + `public/music/cafe-loop.wav` (gerado por `scripts/music.py`, CC0).
   Zero risco de direito autoral. O som vira "som original" da conta e quem fizer dueto espalha o som da Capy.
2. **Som em alta (opcional, manual):** só se o Felipe postar pelo app. Escolher na aba de sons do app, volume quase
   zero sob a voz, só em vídeo sem CTA comercial. Ganho de alcance por som em alta = **prática comum, sem confirmação
   oficial** (estimativa). Não vale tempo do Felipe na fase 1.
3. **Nunca:** baixar música/áudio de meme e embutir no render; recortar áudio de outro criador.

## 6. Legenda, hashtags, comentário fixado, busca

- O TikTok indexa fala (transcrição), texto na tela (OCR), legenda e comentário fixado para a busca (terceiros:
  [ALM Corp](https://almcorp.com/blog/tiktok-seo/), [Outfame](https://www.outfame.com/blog/tiktok-seo-2026-how-to-rank-in-search-keywords-captions-hooks)).
  Por isso cada episódio tem `palavrasChave` e a primeira delas aparece na legenda e no fixado.
- **Legenda:** frase de busca primeiro ("Como falar a idade em inglês: …"), chunk em inglês por escrito, "Dia N da Capy
  nos EUA" (série), 1 emoji no fim. Sem hashtag no meio do texto.
- **Hashtags: 3–5.** O TikTok passou a limitar a 5 por post em ago/2025 (terceiros:
  [Social Media Today, 17/08/2025](https://www.socialmediatoday.com/news/tiktok-implements-five-hashtag-limit-per-post/757857/)).
  Fórmula: `#capyfala` + `#inglês` + 1 de busca (`#aprenderingles`) + 1 de nível (`#inglesparainiciantes`) + 1 do tema
  (`#falsocognato`, `#errosdeingles`, `#morarnoseua`). Nada de #fyp/#foryou.
- **Comentário fixado:** a frase da lição escrita + pedido de ação que gera sinal forte: salvar ("Salva pra próxima
  porta") ou comentar algo que prova aprendizado ("Escreve sua idade em inglês aqui").
- **Resposta em vídeo a comentário:** o plano fica em `respostaComentario` (gatilho = comentário **real**; nunca
  inventar comentário). Resposta em vídeo é feita no app → manual/opcional. O plano de ação atual diz "TikTok: não
  responde"; se o Felipe liberar 10 min/semana, este é o melhor uso deles.

## 7. Adaptador TikTok — spec do campo `tiktok`

Fica no JSON do episódio-lição, ao lado de `cena`/`licao`/`volta` (que continuam sendo o Short). Passos usam o mesmo
formato dos passos do Short (`speaker`, `lang`, `emotion`, `text`, `pausa`, `sfx`, `react`, `shot`, `mode`, `pre`,
`hold`, `card`, `speed`, `evento`) + o campo novo `tela`.

| Campo | Tipo | Obrigatório | Regra |
|---|---|---|---|
| `versao` | int | sim | 1 |
| `formato` | enum | sim | `pov` · `ninguem` · `eu-tambem-eu` · `quando-voce` · `resposta-comentario` |
| `duracaoAlvo` | [min, max] | sim | [61, 75]. Portão reprova render < 61 s |
| `cabecalho` | string | sim | Texto fixo no topo durante o gancho (moldura do formato). ≤ 45 caracteres, dentro da zona segura (`src/theme.ts`) |
| `gancho.ate_s` | número | sim | Fim do gancho (≤ 2,5 s) |
| `gancho.passos` | passos | sim | 1–2 falas. O erro do episódio acontece aqui (cold open) |
| `cena.passos` | passos | sim | Consequência. Pode ter gíria (registrar em `memeRefs`) |
| `licao.exercicios[]` | `{ref, passos}` | sim | `ref` = índice em `licao.exercicios` do Short. **Herda** tipo, título, opções, tiles, resposta, xp; só as falas mudam. Garante "mesma lição" |
| `volta.passos` | passos | sim | Último passo com `card: true` (CTA de comentário) |
| `passo.tela` | string | não | Texto na tela durante aquele passo (moldura, ironia: "ele nem piscou"). ≤ 40 caracteres |
| `loop` | string | sim | Como o fim emenda no frame 1 (corte seco, sem fade) |
| `legendaPost` | string | sim | Começa pela `palavrasChave[0]` (ou variação), contém o chunk em inglês. ≤ 150 caracteres |
| `hashtags` | string[] | sim | 3–5, começa com `#capyfala`, contém `#inglês` |
| `comentarioFixado` | string | sim | Contém o chunk escrito + 1 pedido (salvar/comentar) |
| `palavrasChave` | string[] | sim | 2–3 termos de busca em português |
| `audio` | objeto | sim | `tipo: "original"` (padrão), `trilha`, `nomeSomSugerido`, `somEmAlta` (null no automático) |
| `dueto` | objeto | sim | `permitir: true`, `trecho` = exercício "repetir" |
| `respostaComentario` | objeto | não | `gatilho` (tipo de comentário real), `roteiro`, `automatico: false` |
| `memeRefs[]` | objeto | se houver gíria | `termo`, `onde` (caminho do passo), `fonte` (URL), `visto` (AAAA-MM), `validoAte` (AAAA-MM-DD), `fallback` (texto completo substituto) |

Checagens do portão para o bloco `tiktok` (a implementar no roteirista/portão, fora desta tarefa):
1. Nenhuma fala `pt` contém palavra em inglês (lista de stopwords en + chunk); inglês só em fala `en`.
2. Todas as falas `en` de exercício = `chunk.en` (mesma lição) ou fala de personagem revisada pelo LanguageTool.
3. `memeRefs`: se data de publicação > `validoAte`, troca `text` do passo em `onde` por `fallback`; se `fonte` vazia, reprova.
4. `hashtags` 3–5; `legendaPost` começa por palavra-chave; `comentarioFixado` contém o chunk.
5. Render final 61–75 s; texto de tela e cabeçalho dentro da zona segura; nenhum "%" sem fonte.
6. `gancho` e `legendaPost` diferentes do `title`/`hookTitle` do Short (anti-repost).

Duração estimada dos eps. 1–3 (versão TikTok), calibrada pelo render real do ep. 1 (70,8 s), **estimativa** ±10%:
ep. 1 ≈ 72 s · ep. 2 ≈ 74 s · ep. 3 ≈ 68 s. Confirmar no render.

## 8. Próximos passos técnicos (não feitos aqui: `src/` e `scripts/` fora do escopo)

1. `Licao.tsx`: composição `LicaoTikTok` que lê `tiktok` (gancho → cena → exercícios herdados por `ref` → volta),
   desenha `cabecalho` e `tela`, e emenda o loop.
2. `roteirista.py`: gerar o bloco `tiktok` junto com o episódio (few-shot = eps. 1–3) + checagens da §7.
3. `publicar.py`: usar `tiktok.legendaPost`/`hashtags` no TikTok; `comentarioFixado` exige ação no app (a API não fixa
   comentário) → entra na lista manual do Felipe ou fica fora.

## Fontes

- Gírias: https://hbrbr.com.br/10-girias-mais-usadas.html (21/11/2025) · https://www.conversarcomadolescente.com.br/post/dicion%C3%A1rio-de-g%C3%ADrias-da-gera%C3%A7%C3%A3o-z-e-gera%C3%A7%C3%A3o-alpha-atualizado-2026 (mar/2026, atualizado set/2026)
- Memes 2026: https://www.tediado.com.br/08/memes-2026-os-virais/ (ago/2026) · https://exame.com/esporte/copa-do-mundo-2026-os-memes-que-dominaram-as-redes-e-marcaram-o-torneio/ (13/07/2026)
- Música: https://www.tiktok.com/legal/page/global/commercial-music-library-user-terms/en · https://www.soundstripe.com/blogs/tiktok-music-licensing-rules
- API: https://developers.tiktok.com/docs/en/content-posting-api-get-started · https://www.tokportal.com/learn/tiktok-sounds-api
- Hashtags: https://www.socialmediatoday.com/news/tiktok-implements-five-hashtag-limit-per-post/757857/
- Busca/SEO: https://almcorp.com/blog/tiktok-seo/ · https://www.outfame.com/blog/tiktok-seo-2026-how-to-rank-in-search-keywords-captions-hooks
- Creator Rewards: https://www.tiktok.com/legal/page/global/tiktok-creator-rewards-program-br/en · https://www.gemlist.io/blog/tiktok-creator-rewards-requirements
