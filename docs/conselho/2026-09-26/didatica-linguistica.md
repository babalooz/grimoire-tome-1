# Conselho — Didática e Linguística aplicada (26/09/2026)

Alvos revisados: `docs/plano-capi-lingo.md`, `canal-idiomas/episodes/001-looking-forward.json`,
`canal-idiomas/episodes/002-desafio-5-niveis.json`, `canal-idiomas/scripts/roteirista.py` (e `tts.py`, que decide a pronúncia).
Entregável extra: **currículo-base de 60 tópicos** (seção 6), em JSON pronto para o roteirista consumir.

---

## 1. Diagnóstico (3 linhas)

1. **O inglês dos 2 episódios está correto, mas o vídeo ensina pouco.** Os reveals dão a resposta sem o porquê, o 002 junta 5 assuntos soltos e os ganchos inventam estatísticas ("90%", "só 3%").
2. **Não existe currículo.** O roteirista escolhe o tema "de cabeça" a cada dia. Resultado: sem nível, sem progressão, sem revisão espaçada e sem registro do que já foi ensinado (ele só compara nomes de arquivo).
3. **A pronúncia, que é a credibilidade do canal, está quebrada no motor.** Palavras-alvo em inglês saem na voz portuguesa, e a voz inglesa (Piper/espeak) erra marcas e pares mínimos. A "2ª passada professor nativo" não pega nada disso, porque lê o texto e não ouve o áudio.

---

## 2. Revisão item a item

### 2.1 Episódio 001 — "looking forward to + ing"
| Ponto | Situação | Correção |
|---|---|---|
| Inglês ("I'm looking forward to seeing you" / "…watching the World Cup!") | correto e natural | manter |
| Hook "Noventa por cento dos brasileiros erram" | número inventado. Viola a regra do próprio roteirista e o CLAUDE.md | "Esse erro entrega que você é brasileiro." (gancho de identidade, sem número) |
| Regra "depois de looking forward to vem ING" | certa, mas é decoreba de 1 expressão só | "Esse **to** é preposição, e depois de preposição o verbo vem com -ing." Assim a regra vale também para *used to*, *get used to* e *object to* |
| Áudio: forma errada lida pela voz nativa EN, forma certa ouvida 2× | a errada tem o mesmo peso sonoro da certa | ouvir a forma certa por último e ≥3×. A errada aparece 1× só, riscada na tela |
| "Depois de looking forward to…" dito pela **voz PT** | **erro grave**. O espeak-pt lê `lˌookˈĩŋɡ fˈɔrwˌərd tˌeˈɔ` ("lukíngui fórward tê-ó") | termo em inglês sempre num segmento `lang:"en"` separado |
| Tradução "Tô ansioso pra assistir a Copa" | ok. Mais natural: "Tô doido pra ver a Copa" | opcional |

### 2.2 Episódio 002 — Desafio 5 níveis
| Nível | Item | Nível real (estimativa, EGP/EVP) | Problema |
|---|---|---|---|
| 1 | I have 20 years → I am 20 years old | A1 | ok. Acrescentar que "I'm 20" é o mais natural |
| 2 | pretend = fingir | A2 | "**Pretend** significa…" é dito pela voz PT, que lê `pɾetˈẽndʒ` ("pretêndi") |
| 3 | I'm agree → I agree | A1 | está **mais fácil que o nível 2**, então a escada quebra. Falta o porquê ("agree já é verbo") |
| 4 | actually = na verdade | B1 | "Actually" e "currently" são ditos pela voz PT: `aktuˈali`, `kuxˈẽntli` ("curRRRêntli") |
| 5 | If I **were** rich | B1 | "o mais difícil" é só B1. Ok marcar *am* como errado, mas o revisor não pode tratar "If I was" como erro, porque é aceito no inglês falado |
| Hook | "Só 3% chegam no nível 5" | — | número inventado |

Resumo: **3 das 7 falas que ensinam alguma coisa pronunciam o próprio alvo com fonética portuguesa.** Os 5 níveis também não ensinam 1 coisa memorável. O formato Nível funciona melhor **com tema** ("5 falsos amigos do fácil ao impossível"), com a escada de dificuldade presa ao CEFR (A1→A2→B1→B2→C1).

### 2.3 Plano (`plano-capi-lingo.md`)
- **"Capi errou — resposta só no próximo vídeo"**: quem vê um só Short (a maioria) sai com a forma errada na cabeça, dita com confiança pela "professora". A pesquisa mostra que as opções erradas de um teste viram conhecimento falso quando não há feedback, e que o feedback anula esse efeito ([Butler & Roediger 2008, *Memory & Cognition*](https://link.springer.com/article/10.3758/MC.36.3.604), verificado). Correção: congelar 2–3 s com "comenta o erro" e **revelar no final do mesmo vídeo**. O gancho de série fica para o *próximo erro* ("amanhã a Capi erra de novo").
- **"Qual seu nível? (A1→C2)" com 1 pergunta por nível**: 1 item por nível não mede nível, então prometer "descubra seu nível" é falso. Chamar de "**Até onde você chega?**" e mandar para o teste completo (≥24 itens, 4 por nível, tirados do banco da seção 6) no funil.
- **"Para de pagar mico" (pronúncia de marcas)**: com o TTS atual o vídeo *ensina o mico*. Teste próprio (espeak en-us, o mesmo fonemizador que o Piper usa): **Nike → `naɪk`** (o certo é /ˈnaɪki/), **Levi's → `lɛviz`** (o certo é /ˈliːvaɪz/), **Adidas → `ædɪdəz`** (nos EUA é /əˈdiːdəs/, na Alemanha /ˈadidas/, e as duas estão certas). Não lançar esse quadro sem o léxico da melhoria 2. Também não chamar de "errado" uma pronúncia aceita no país de origem da marca.
- **"Brasileiro vs Nativo" e "Ao pé da letra"**: ótimos para ensinar (contraste com o português = *noticing*). Regra: a forma literal ("pay the duck") aparece **rotulada como piada** e a certa ("take the blame / take the fall") é a que fica em áudio no final.
- **"Você sabia? OK nasceu em 1839"**: fato correto. *Boston Morning Post*, 23/03/1839, "oll korrect", documentado por Allen Walker Read ([Smithsonian](https://www.smithsonianmag.com/smart-news/how-one-man-discovered-the-obscure-origins-of-the-word-ok-180953258/), verificado). Esse quadro precisa de uma lista de fatos com fonte. O LLM não pode gerar etimologia livremente, porque etimologia popular falsa é o erro nº 1 desse gênero.
- **Falta um currículo por trás da grade.** A grade define *formato*, mas nada define *o que* se ensina, em que nível e quando revisar.

### 2.4 Roteirista (`scripts/roteirista.py`)
| # | Problema | Efeito |
|---|---|---|
| a | Tema livre. O modelo escolhe sozinho e `recentes` só compara nomes de arquivo | repetição de temas, nada de progressão, "pretend/actually" a cada 5 dias |
| b | A regra diz que "**frases** em inglês usam lang='en'", mas palavras soltas dentro da fala PT passam | é a causa do erro de pronúncia acima |
| c | O revisor é o mesmo modelo e **reescreve** o episódio | a mudança entra sem ser revisada. No quadro capi-errou ele tende a "corrigir" o erro proposital |
| d | Não existe checagem determinística (índice da resposta, número inventado, termo EN na fala PT, léxico de pronúncia) | toda a confiança fica no LLM |
| e | O schema não tem `nivel`, `topico_id`, `regra` nem `fonte` | não dá para auditar nem medir retenção por tópico |
| f | Quadro "qual-seu-nivel" (o mais viral, segundo a pesquisa de campeões) e "mico" ainda não existem no `QUADROS` | — |
| g | "Inglês americano" sem exceção. No quadro Hype de futebol, o vocabulário padrão é britânico (*pitch*, *nil*, *draw*) | o revisor pode "corrigir" o que está certo. Regra: variante US por padrão e termos de futebol UK/US aceitos, sempre rotulados |

---

## 3. Top 5 melhorias (impacto ÷ esforço)

### 1) Ligar o roteirista ao currículo: 1 tópico-alvo por vídeo (impacto alto · ~1–2 h Claude)
Como fazer:
1. Extrair o bloco JSON da seção 6 para `canal-idiomas/curriculo/en-br.json`. Criar `canal-idiomas/curriculo/uso.json` (registro: `{topico_id: [datas]}`).
2. No `roteirista.py`, escolher o tópico **antes** de chamar o Claude. Critérios: compatível com o quadro do dia, não usado nos últimos 30 dias, e mistura de níveis na semana (60% A1–A2, 30% B1, 10% B2+).
3. Passar o tópico no prompt como **fonte da verdade** (`erro`, `certo`, `regra`, `ex_en`). O LLM só roteiriza (piada, gancho, cena) e não decide o conteúdo linguístico.
4. Acrescentar `topico_id` e `nivel` ao schema `EPISODE`.

```python
def escolher_topico(quadro, hoje):
    cur = json.loads((ROOT/"curriculo/en-br.json").read_text())
    uso = json.loads((ROOT/"curriculo/uso.json").read_text()) if (ROOT/"curriculo/uso.json").exists() else {}
    def dias(t): return min(((hoje - dt.date.fromisoformat(d)).days for d in uso.get(t["id"], [])), default=999)
    cands = [t for t in cur if quadro in t["quadros"] and dias(t) >= 30]
    alvo = sorted(cands, key=lambda t: (len(uso.get(t["id"], [])), t["id"]))[0]      # menos usado primeiro
    revisao = [t for t in cur if 2 <= dias(t) <= 10] or [t for t in cur if 20 <= dias(t) <= 40]  # espaçamento
    return alvo, (revisao[0] if revisao else None)
```

### 2) Pronúncia blindada: termo EN nunca na voz PT + léxico IPA (impacto altíssimo · ~1 h)
1. **Regra no prompt e no lint:** toda palavra ou expressão inglesa, mesmo solta ("Pretend significa…"), vira segmento próprio: `[{pt:"O que significa"}, {en:"pretend"}, {pt:"?"}]`.
2. **Léxico** `canal-idiomas/curriculo/lexico-en.json` com IPA para palavras que o espeak erra. O Piper 1.8 instalado aceita fonemas crus com `[[ ... ]]` (verificado em `.venv/.../piper/voice.py`). No `tts.py`, antes do `synth`, trocar a palavra por `[[ ipa ]]`.
   Entradas obrigatórias, com base no teste próprio: `Nike [[nˈaɪki]]`, `Levi's [[lˈiːvaɪz]]`, `live` (verbo) `[[lˈɪv]]` (**o espeak lê "live" como `laɪv`**, o que destrói o par mínimo live × leave), `Adidas [[ədˈiːdəs]]`.
3. **Bloqueio:** marca, nome próprio ou palavra do quadro "mico" sem entrada no léxico impede o render.
4. **Opcional, US$0:** transcrever de volta o áudio EN com `faster-whisper` (modelo tiny/base, CPU) e comparar com o texto. Se a diferença de palavras (WER) passar de 20%, alertar. Isso pega a pronúncia que o revisor de texto nunca vê.

### 3) Todo reveal ensina: feedback imediato + porquê + forma certa por último (impacto alto · 30 min de prompt)
Regras novas no `REGRAS`:
- Cada `question` tem `revealSpeech` com: resposta → **regra em até 12 palavras** → forma certa em EN de novo.
- Forma errada: no máximo 1× em áudio. Forma certa: ≥2× em áudio e sempre a última frase EN da cena.
- A última cena antes do CTA é **"repete comigo"**: 1 frase EN com pausa de 2 s. Isso é produção ativa e aumenta o tempo assistido.
- Capi-errou revela no fim do mesmo vídeo (ver 2.3).
Base: tentar responder antes de ver a resposta melhora o aprendizado, desde que venha feedback ([Kornell, Hays & Bjork 2009](https://sites.williams.edu/nk2/files/2011/08/Kornell.Hays_.Bjork_.2009.pdf), verificado). Ou seja, o formato quiz é bom para ensinar **desde que a correção venha logo**.

### 4) Controle de qualidade linguística automático em 3 camadas (impacto alto · ~2 h)
1. **Lint determinístico** (sem custo, roda antes de tudo):
```python
def lint(ep, topico):
    erros = []
    termos_en = {w.lower().strip(".,!?'\"") for s in (topico["certo"], topico["erro"]) for w in s.split() if len(w) > 3}
    for i, s in enumerate(ep["scenes"]):
        if s.get("options") is not None:
            if not (2 <= len(s["options"]) <= 4) or s.get("answer") not in range(len(s["options"])): erros.append(f"cena {i}: answer inválido")
            if not s.get("revealSpeech"): erros.append(f"cena {i}: reveal sem explicação")
        for seg in s["speech"] + (s.get("revealSpeech") or []):
            if seg["lang"] == "pt" and any(t in seg["text"].lower() for t in termos_en):
                erros.append(f"cena {i}: termo inglês na voz PT → '{seg['text']}'")
        if s["type"] == "hook" and re.search(r"\d|%|por cento", s["title"] + " ".join(x["text"] for x in s["speech"])):
            erros.append("hook com número/porcentagem sem fonte")
    return erros
```
2. **LanguageTool** (API pública grátis: 20 requisições/min e 75 mil caracteres/min, [doc oficial](https://dev.languagetool.org/public-http-api.html), verificado). Toda frase marcada como *certa* precisa ter 0 alertas. Teste próprio com 10 erros típicos de brasileiro: o LT pegou 5 (*looking forward to see*, *I'm agree*, *explained me*, *she work*, *if I would have known*) e deixou passar *I have 20 years*, *I have a doubt*, *I'm here since 2020*, *very funny* e *arrived at home*. Serve de rede de segurança para as frases certas, mas **não substitui o currículo** na hora de definir o que é errado.
3. **Revisor como juiz, não como reescritor**: a 2ª passada devolve `{aprovado: bool, problemas: [...]}` e recebe o tópico do currículo como gabarito. Se reprovar, a 1ª passada é refeita com os problemas no prompt (máx. 2 tentativas). Se reprovar de novo, vai para a fila de aprovação do Felipe.

### 5) Repetição espaçada dentro do feed (impacto médio-alto · ~1 h, depende da melhoria 1)
- **Quadro Nível:** o nível 1 ou 2 é sempre um tópico ensinado **2–10 dias antes**, e um nível do meio usa um tópico de **~30 dias antes** (`escolher_topico` já devolve `revisao`).
- **Domingo "Prova da Semana":** reapresenta os 6 alvos da semana como perguntas, em outra ordem e com outros exemplos (intercalar).
- Base: o intervalo ideal de revisão fica em ~20–40% do prazo de retenção desejado para 1 semana e cai para 5–10% quando o prazo é 1 ano ([Cepeda et al. 2008, *Psychological Science*](https://laplab.ucsd.edu/articles/Cepeda%20et%20al%202008_psychsci.pdf), verificado). Na prática: revisar em ~3 dias, depois em ~10 e depois em ~30.
- **Bônus de retenção:** o espectador que reconhece o tópico ("esse eu sei!") acerta, se sente bem e fica mais tempo no vídeo.

---

## 4. Erro oculto

**O motor de voz ensina a pronúncia errada justamente nas palavras-alvo, e nenhuma checagem do pipeline detecta isso.**
- O `tts.py` manda cada segmento para uma única voz. Tudo o que está em `lang:"pt"` passa pelo fonemizador português, e isso inclui "Pretend", "Actually", "currently" e "looking forward to" nos episódios atuais.
- Teste feito agora com o próprio fonemizador do Piper instalado: `looking forward to` → `lˌookˈĩŋɡ fˈɔrwˌərd tˌeˈɔ` (o "to" sai como "tê-ó").
- E a voz EN erra `Nike`→`naɪk`, `Levi's`→`lɛviz` e `live`→`laɪv`.
- Um canal que se vende como "corrige brasileiro" e pronuncia o alvo com sotaque de robô brasileiro perde credibilidade no primeiro comentário. A revisão por LLM é só texto e nunca vai pegar isso.
- Correção: melhoria 2 (segmentação obrigatória + léxico IPA + bloqueio + Whisper opcional).

---

## 5. Nota da área: **4/10**

Os pontos a favor são 3: o inglês de hoje está correto, o formato quiz com timer é bom para ensinar, e já existe uma 2ª passada.
Para chegar a 10, faltam:
1. Currículo ligado ao roteirista, com registro de uso (melhoria 1). Leva a nota para 6.
2. Pronúncia blindada: segmentação, léxico e bloqueio (melhoria 2). Leva a 7,5.
3. Reveal com porquê, forma certa por último e "repete comigo" (melhoria 3). Leva a 8,5.
4. QA em 3 camadas com o revisor como juiz (melhoria 4). Leva a 9.
5. Espaçamento e Prova da Semana como revisão, mais uma checagem mensal de 10 episódios por um professor nativo humano (Preply/italki, ~US$15–25 por 1 h, estimativa), para calibrar o léxico e o revisor. Leva a 10.

---

## 6. Currículo-base EN→BR: 60 tópicos (v1)

**Critérios:**
- Foco em **erros de interferência do português** (Swan & Smith, *Learner English*, cap. "Portuguese speakers", [Cambridge](https://www.cambridge.org/core/books/abs/learner-english/portuguese-speakers/1215C7A32B1B1B0D1DE31893B572E4B8)) e no que a pesquisa de campeões mostrou que viraliza: erro de brasileiro, falso amigo, pronúncia e nível.
- Distribuição: A1 12 · A2 17 · B1 15 · B2 10 · C1 6. C2 ficou de fora de propósito: quase não tem erro típico de brasileiro e vira pouco vídeo.
- O **nível de cada tópico é estimativa** baseada na English Grammar/Vocabulary Profile ([englishprofile.org](https://englishprofile.org/), grátis). Conferir lá antes de usar o tópico no quadro "Até onde você chega?".
- Variante: inglês americano.

**Campos:**
- `erro` / `certo`: pares prontos para `options`. O `erro` vira o distrator.
- `regra`: fala do reveal, com no máximo 12–15 palavras.
- `ex_en` / `ex_pt`: cena `example`.
- `quadros`: quadros compatíveis, com os ids do `roteirista.py` mais `qual-nivel`, `mico`, `ao-pe-da-letra` e `capi-no-mundo`.
- `tts`: palavras que exigem conferir ou fixar no léxico IPA antes do render.
- `rel`: tópicos para intercalar ou revisar juntos.

<!-- CURRICULO-EN-BR:INICIO -->
```json
[
{"id":"A1-01","nivel":"A1","cat":"gramatica","alvo":"idade com BE","erro":"I have 20 years.","certo":"I'm 20 years old.","regra":"Idade em inglês usa BE: I am, nunca I have.","ex_en":"My brother is 25.","ex_pt":"Meu irmão tem 25 anos.","quadros":["nivel","qual-nivel","capi-errou","br-vs-nativo"],"tts":[],"rel":["A1-05"]},
{"id":"A1-02","nivel":"A1","cat":"gramatica","alvo":"agree é verbo","erro":"I'm agree.","certo":"I agree.","regra":"Agree já é verbo: não precisa de am.","ex_en":"I totally agree with you.","ex_pt":"Concordo totalmente com você.","quadros":["nivel","qual-nivel","capi-errou","br-vs-nativo"],"tts":[],"rel":["A1-05"]},
{"id":"A1-03","nivel":"A1","cat":"gramatica","alvo":"people é plural","erro":"People is crazy.","certo":"People are crazy.","regra":"People já é plural: people are, people have.","ex_en":"People are so nice here.","ex_pt":"As pessoas são muito legais aqui.","quadros":["nivel","capi-errou","qual-nivel"],"tts":[],"rel":["A1-04"]},
{"id":"A1-04","nivel":"A1","cat":"gramatica","alvo":"-s da 3ª pessoa","erro":"She work from home.","certo":"She works from home.","regra":"He, she, it: o verbo ganha -s no presente.","ex_en":"My mom works on Saturdays.","ex_pt":"Minha mãe trabalha aos sábados.","quadros":["nivel","capi-errou","qual-nivel"],"tts":[],"rel":["A1-03"]},
{"id":"A1-05","nivel":"A1","cat":"gramatica","alvo":"fome/sede/frio com BE","erro":"I have hungry.","certo":"I'm hungry.","regra":"Fome, sede, frio, sono: I'm hungry, thirsty, cold, sleepy.","ex_en":"I'm so hungry right now.","ex_pt":"Tô morrendo de fome agora.","quadros":["nivel","br-vs-nativo","capi-errou","capi-no-mundo"],"tts":[],"rel":["A1-01","A1-02"]},
{"id":"A1-06","nivel":"A1","cat":"gramatica","alvo":"tem = there is/are","erro":"Have a lot of people here.","certo":"There are a lot of people here.","regra":"'Tem' de existir é there is ou there are.","ex_en":"There's a great bar near the beach.","ex_pt":"Tem um bar ótimo perto da praia.","quadros":["nivel","br-vs-nativo","capi-errou","qual-nivel"],"tts":[],"rel":["A1-09"]},
{"id":"A1-07","nivel":"A1","cat":"gramatica","alvo":"adjetivo antes do nome","erro":"a car red","certo":"a red car","regra":"Em inglês o adjetivo vem antes: red car.","ex_en":"She bought a red car.","ex_pt":"Ela comprou um carro vermelho.","quadros":["nivel","capi-errou","qual-nivel"],"tts":[],"rel":["A1-08"]},
{"id":"A1-08","nivel":"A1","cat":"gramatica","alvo":"adjetivo sem plural","erro":"the reds shoes","certo":"the red shoes","regra":"Adjetivo nunca vai para o plural em inglês.","ex_en":"I love those red shoes.","ex_pt":"Amo aqueles sapatos vermelhos.","quadros":["nivel","capi-errou"],"tts":[],"rel":["A1-07"]},
{"id":"A1-09","nivel":"A1","cat":"gramatica","alvo":"sujeito obrigatório","erro":"Is raining.","certo":"It's raining.","regra":"Frase em inglês precisa de sujeito: it's raining, it's late.","ex_en":"It's late, let's go home.","ex_pt":"Tá tarde, bora pra casa.","quadros":["nivel","capi-errou","br-vs-nativo"],"tts":[],"rel":["A1-06","A2-01"]},
{"id":"A1-10","nivel":"A1","cat":"falso-cognato","alvo":"push ≠ puxar","erro":"Push = puxar","certo":"Push = empurrar; pull = puxar","regra":"Push empurra, pull puxa. Olha a placa da porta!","ex_en":"Push the door, don't pull it.","ex_pt":"Empurra a porta, não puxa.","quadros":["pegadinha","nivel","capi-no-mundo"],"tts":[],"rel":["A2-10"]},
{"id":"A1-11","nivel":"A1","cat":"pronuncia","alvo":"TH /θ/","erro":"tank you / fank you","certo":"thank you /θæŋk juː/","regra":"TH: ponta da língua entre os dentes e sopra.","ex_en":"Thank you, I think so.","ex_pt":"Obrigado, acho que sim.","quadros":["mico","nivel","br-vs-nativo"],"tts":["thank","think","three"],"rel":["A1-12"]},
{"id":"A1-12","nivel":"A1","cat":"pronuncia","alvo":"sem 'i' no final","erro":"bigui, Facebooki, hot dogui","certo":"big, Facebook, hot dog","regra":"Termina na consoante: não acrescente 'i' no final.","ex_en":"I want a big hot dog.","ex_pt":"Quero um cachorro-quente grande.","quadros":["mico","br-vs-nativo"],"tts":["Facebook"],"rel":["A1-11","A2-15"]},

{"id":"A2-01","nivel":"A2","cat":"gramatica","alvo":"objeto obrigatório (like it)","erro":"Do you like?","certo":"Do you like it?","regra":"Like, love e want precisam de objeto: like it.","ex_en":"I made pão de queijo. Do you like it?","ex_pt":"Fiz pão de queijo. Você gosta?","quadros":["nivel","capi-errou","br-vs-nativo"],"tts":[],"rel":["A1-09"]},
{"id":"A2-02","nivel":"A2","cat":"preposicao","alvo":"married to","erro":"She's married with a Canadian.","certo":"She's married to a Canadian.","regra":"Casado COM em inglês é married TO.","ex_en":"He's married to my cousin.","ex_pt":"Ele é casado com minha prima.","quadros":["nivel","capi-errou","pegadinha"],"tts":[],"rel":["A2-03"]},
{"id":"A2-03","nivel":"A2","cat":"preposicao","alvo":"depend on","erro":"It depends of the weather.","certo":"It depends on the weather.","regra":"Depende DE em inglês é depends ON.","ex_en":"It depends on the traffic.","ex_pt":"Depende do trânsito.","quadros":["nivel","capi-errou"],"tts":[],"rel":["A2-02"]},
{"id":"A2-04","nivel":"A2","cat":"vocabulario","alvo":"ask a question","erro":"Can I make a question?","certo":"Can I ask a question?","regra":"Pergunta a gente ASK, não make.","ex_en":"Can I ask you something?","ex_pt":"Posso te perguntar uma coisa?","quadros":["nivel","capi-errou","br-vs-nativo","capi-no-mundo"],"tts":[],"rel":["A2-05","B1-06"]},
{"id":"A2-05","nivel":"A2","cat":"vocabulario","alvo":"doubt vs question","erro":"Teacher, I have a doubt.","certo":"Teacher, I have a question.","regra":"Dúvida na aula é question. Doubt é desconfiança.","ex_en":"Quick question: is the meeting at three?","ex_pt":"Dúvida rápida: a reunião é às três?","quadros":["nivel","capi-errou","br-vs-nativo","pegadinha"],"tts":[],"rel":["A2-04"]},
{"id":"A2-06","nivel":"A2","cat":"vocabulario","alvo":"lend vs borrow","erro":"Can you borrow me your charger?","certo":"Can you lend me your charger?","regra":"Lend: emprestar PARA alguém. Borrow: pegar emprestado.","ex_en":"Can I borrow your charger?","ex_pt":"Posso pegar teu carregador emprestado?","quadros":["nivel","capi-errou","pegadinha"],"tts":[],"rel":["A2-04"]},
{"id":"A2-07","nivel":"A2","cat":"gramatica","alvo":"sem 'the' no genérico","erro":"The life is hard.","certo":"Life is hard.","regra":"Falando em geral, sem the: life, love, Brazilians.","ex_en":"Brazilians love soccer.","ex_pt":"Os brasileiros amam futebol.","quadros":["nivel","capi-errou","br-vs-nativo"],"tts":[],"rel":["A1-03"]},
{"id":"A2-08","nivel":"A2","cat":"preposicao","alvo":"get home (sem preposição)","erro":"I arrived at home late.","certo":"I got home late.","regra":"Com home não vai preposição: go home, get home.","ex_en":"Text me when you get home.","ex_pt":"Me manda mensagem quando chegar em casa.","quadros":["nivel","br-vs-nativo","capi-errou"],"tts":[],"rel":["A2-02"]},
{"id":"A2-09","nivel":"A2","cat":"falso-cognato","alvo":"parents ≠ parentes","erro":"Parents = parentes","certo":"Parents = pais; relatives = parentes","regra":"Parents são pai e mãe. Parentes são relatives.","ex_en":"My parents live in Recife.","ex_pt":"Meus pais moram em Recife.","quadros":["pegadinha","nivel","qual-nivel"],"tts":["relatives"],"rel":["A2-10","A2-11"]},
{"id":"A2-10","nivel":"A2","cat":"falso-cognato","alvo":"pretend ≠ pretender","erro":"Pretend = pretender","certo":"Pretend = fingir; pretender = intend / plan to","regra":"Pretend é fingir. Pretender é plan to ou intend.","ex_en":"He pretended to be sick.","ex_pt":"Ele fingiu que estava doente.","quadros":["pegadinha","nivel","qual-nivel"],"tts":["pretend"],"rel":["A2-09","B1-02"]},
{"id":"A2-11","nivel":"A2","cat":"falso-cognato","alvo":"college ≠ colégio","erro":"College = colégio","certo":"College = faculdade; colégio = high school","regra":"College é faculdade. Colégio é school ou high school.","ex_en":"I met her in college.","ex_pt":"Conheci ela na faculdade.","quadros":["pegadinha","nivel"],"tts":[],"rel":["A2-12"]},
{"id":"A2-12","nivel":"A2","cat":"falso-cognato","alvo":"library ≠ livraria","erro":"Library = livraria","certo":"Library = biblioteca; livraria = bookstore","regra":"Library é biblioteca. Livraria é bookstore.","ex_en":"You can borrow books at the library.","ex_pt":"Dá pra pegar livro emprestado na biblioteca.","quadros":["pegadinha","nivel"],"tts":["library"],"rel":["A2-11","A2-06"]},
{"id":"A2-13","nivel":"A2","cat":"vocabulario","alvo":"fun vs funny","erro":"The party was so funny.","certo":"The party was so fun.","regra":"Fun é divertido. Funny é engraçado, que faz rir.","ex_en":"The trip was fun, and my uncle is so funny.","ex_pt":"A viagem foi divertida, e meu tio é muito engraçado.","quadros":["nivel","capi-errou","pegadinha"],"tts":[],"rel":["B1-07"]},
{"id":"A2-14","nivel":"A2","cat":"vocabulario","alvo":"What do you call / How do you say","erro":"How do you call this in English?","certo":"What do you call this in English?","regra":"Nome de coisa: What do you call. Tradução: How do you say.","ex_en":"How do you say 'saudade' in English?","ex_pt":"Como se fala 'saudade' em inglês?","quadros":["nivel","capi-errou","voce-sabia"],"tts":[],"rel":["A2-04"]},
{"id":"A2-15","nivel":"A2","cat":"pronuncia","alvo":"-ED do passado","erro":"work-ed /ˈwɝːkɪd/","certo":"worked /wɝːkt/","regra":"-ED só vira 'id' depois de T ou D: wanted, needed.","ex_en":"I worked, I played, and I wanted more.","ex_pt":"Eu trabalhei, joguei e quis mais.","quadros":["mico","nivel","br-vs-nativo"],"tts":["worked","played","wanted"],"rel":["A1-12"]},
{"id":"A2-16","nivel":"A2","cat":"pronuncia","alvo":"/ɪ/ vs /iː/ (live × leave)","erro":"live = leave (mesma vogal)","certo":"live /lɪv/ × leave /liːv/","regra":"Live: vogal curta e solta. Leave: longa, com sorriso.","ex_en":"I live here, but I leave at six.","ex_pt":"Eu moro aqui, mas saio às seis.","quadros":["mico","nivel","br-vs-nativo"],"tts":["live","leave"],"rel":["A1-11"]},
{"id":"A2-17","nivel":"A2","cat":"falso-cognato","alvo":"assist ≠ assistir","erro":"I assisted the game.","certo":"I watched the game.","regra":"Assistir TV ou jogo é watch. Assist é ajudar.","ex_en":"Did you watch the game last night?","ex_pt":"Você assistiu o jogo ontem?","quadros":["pegadinha","nivel","hype"],"tts":[],"rel":["A2-10"]},

{"id":"B1-01","nivel":"B1","cat":"gramatica","alvo":"to preposição + -ing","erro":"I'm looking forward to see you.","certo":"I'm looking forward to seeing you.","regra":"Esse to é preposição: depois vem verbo com -ing.","ex_en":"I'm looking forward to watching the World Cup.","ex_pt":"Tô doido pra ver a Copa.","quadros":["nivel","capi-errou","qual-nivel"],"tts":[],"rel":["B1-11"]},
{"id":"B1-02","nivel":"B1","cat":"falso-cognato","alvo":"actually ≠ atualmente","erro":"Actually = atualmente","certo":"Actually = na verdade; atualmente = currently / nowadays","regra":"Actually é na verdade. Atualmente é currently.","ex_en":"Actually, I'm currently living in Lisbon.","ex_pt":"Na verdade, atualmente eu moro em Lisboa.","quadros":["pegadinha","nivel","qual-nivel"],"tts":["actually","currently"],"rel":["B1-09","A2-10"]},
{"id":"B1-03","nivel":"B1","cat":"gramatica","alvo":"present perfect + since/for","erro":"I'm here since 2020.","certo":"I've been here since 2020.","regra":"Começou no passado e continua: have been + since ou for.","ex_en":"I've lived here for five years.","ex_pt":"Moro aqui há cinco anos.","quadros":["nivel","capi-errou","qual-nivel","br-vs-nativo"],"tts":[],"rel":["B2-04"]},
{"id":"B1-04","nivel":"B1","cat":"gramatica","alvo":"explain to me","erro":"Can you explain me?","certo":"Can you explain it to me?","regra":"Explica algo PARA alguém: explain it to me.","ex_en":"Can you explain the rules to me?","ex_pt":"Você me explica as regras?","quadros":["nivel","capi-errou"],"tts":[],"rel":["B1-05"]},
{"id":"B1-05","nivel":"B1","cat":"vocabulario","alvo":"tell vs say","erro":"He said me the truth.","certo":"He told me the truth.","regra":"Tell + pessoa: told me. Say sem pessoa: he said that.","ex_en":"She told me she was tired.","ex_pt":"Ela me disse que estava cansada.","quadros":["nivel","capi-errou"],"tts":[],"rel":["B1-04"]},
{"id":"B1-06","nivel":"B1","cat":"vocabulario","alvo":"make a mistake","erro":"I did a mistake.","certo":"I made a mistake.","regra":"Erro a gente MAKE: make a mistake.","ex_en":"Everybody makes mistakes.","ex_pt":"Todo mundo erra.","quadros":["nivel","capi-errou"],"tts":[],"rel":["A2-04"]},
{"id":"B1-07","nivel":"B1","cat":"vocabulario","alvo":"bored vs boring","erro":"I'm boring. (querendo dizer entediado)","certo":"I'm bored.","regra":"-ED é como você se sente. -ING é o que causa.","ex_en":"The movie was boring, so I was bored.","ex_pt":"O filme era chato, então fiquei entediado.","quadros":["nivel","capi-errou","pegadinha"],"tts":["bored","boring"],"rel":["A2-13"]},
{"id":"B1-08","nivel":"B1","cat":"falso-cognato","alvo":"discuss vs argue","erro":"We discussed all night. (querendo dizer brigamos)","certo":"We argued all night.","regra":"Brigar é argue. Discuss é conversar sobre um assunto.","ex_en":"They argued about money again.","ex_pt":"Eles discutiram por causa de dinheiro de novo.","quadros":["pegadinha","nivel"],"tts":["argue"],"rel":["B1-09"]},
{"id":"B1-09","nivel":"B1","cat":"falso-cognato","alvo":"eventually ≠ eventualmente","erro":"Eventually = eventualmente","certo":"Eventually = no fim, com o tempo; eventualmente = occasionally","regra":"Eventually é no fim das contas. Eventualmente é occasionally.","ex_en":"Eventually, she got the job.","ex_pt":"No fim, ela conseguiu o emprego.","quadros":["pegadinha","nivel","qual-nivel"],"tts":["eventually"],"rel":["B1-02","B1-10"]},
{"id":"B1-10","nivel":"B1","cat":"falso-cognato","alvo":"realize ≠ realizar","erro":"I realized my dream.","certo":"I achieved my dream. / I realized I was late.","regra":"Realize é perceber. Realizar sonho é achieve a dream.","ex_en":"I realized I left my phone at home.","ex_pt":"Percebi que esqueci o celular em casa.","quadros":["pegadinha","nivel","qual-nivel"],"tts":["realize"],"rel":["B1-09"]},
{"id":"B1-11","nivel":"B1","cat":"gramatica","alvo":"used to vs be used to","erro":"I'm used to play soccer when I was a kid.","certo":"I used to play soccer when I was a kid.","regra":"Used to + verbo: costumava. Be used to + -ing: estar acostumado.","ex_en":"I'm used to waking up early.","ex_pt":"Tô acostumado a acordar cedo.","quadros":["nivel","capi-errou","qual-nivel"],"tts":[],"rel":["B1-01"]},
{"id":"B1-12","nivel":"B1","cat":"pragmatica","alvo":"pedido educado","erro":"I want a coffee. (no balcão)","certo":"Could I get a coffee, please?","regra":"'I want' soa grosso no pedido. Use Can I get ou Could I get.","ex_en":"Could I get the check, please?","ex_pt":"Me traz a conta, por favor?","quadros":["capi-no-mundo","br-vs-nativo","nivel"],"tts":[],"rel":["B2-10"]},
{"id":"B1-13","nivel":"B1","cat":"pronuncia","alvo":"letras mudas","erro":"Wed-nes-day, is-land, sal-mon","certo":"Wednesday /ˈwɛnzdeɪ/, island /ˈaɪlənd/, salmon /ˈsæmən/","regra":"Algumas letras não se falam: WEDnesday, Island, SAlmon.","ex_en":"We're having salmon on Wednesday.","ex_pt":"Vamos comer salmão na quarta.","quadros":["mico","nivel","voce-sabia"],"tts":["Wednesday","island","salmon"],"rel":["B1-14"]},
{"id":"B1-14","nivel":"B1","cat":"pronuncia","alvo":"sílabas engolidas","erro":"com-for-ta-ble, cho-co-la-te","certo":"comfortable /ˈkʌmftɚbəl/, chocolate /ˈtʃɑːklət/","regra":"Nativo engole sílaba: COMF-ter-ble, CHOC-lit.","ex_en":"This chair is really comfortable.","ex_pt":"Essa cadeira é muito confortável.","quadros":["mico","nivel","br-vs-nativo"],"tts":["comfortable","chocolate","vegetable"],"rel":["B1-13","B2-09"]},
{"id":"B1-15","nivel":"B1","cat":"gramatica","alvo":"2ª condicional","erro":"If I am rich, I would travel.","certo":"If I were rich, I'd travel.","regra":"Hipótese: If + passado, would + verbo. (If I was também se ouve.)","ex_en":"If I had more time, I'd learn to surf.","ex_pt":"Se eu tivesse mais tempo, aprenderia a surfar.","quadros":["nivel","qual-nivel","capi-errou"],"tts":[],"rel":["B2-04"]},

{"id":"B2-01","nivel":"B2","cat":"preposicao","alvo":"despite (sem of)","erro":"Despite of the rain, we went.","certo":"Despite the rain, we went.","regra":"Despite não leva of. In spite of leva.","ex_en":"In spite of the traffic, we made it.","ex_pt":"Apesar do trânsito, a gente chegou.","quadros":["nivel","capi-errou","qual-nivel"],"tts":[],"rel":["B2-02"]},
{"id":"B2-02","nivel":"B2","cat":"gramatica","alvo":"suggest + -ing / that","erro":"I suggest you to take the train.","certo":"I suggest taking the train.","regra":"Suggest não aceita 'pessoa + to': suggest taking.","ex_en":"I suggest (that) you take the train.","ex_pt":"Sugiro que você pegue o trem.","quadros":["nivel","capi-errou","qual-nivel"],"tts":[],"rel":["B2-03"]},
{"id":"B2-03","nivel":"B2","cat":"gramatica","alvo":"stop + -ing vs stop + to","erro":"I stopped to smoke last year. (querendo dizer parei de fumar)","certo":"I stopped smoking last year.","regra":"Stop + -ing: parar de. Stop + to: parar para.","ex_en":"We stopped to get gas.","ex_pt":"A gente parou pra abastecer.","quadros":["nivel","pegadinha","qual-nivel"],"tts":[],"rel":["B2-02"]},
{"id":"B2-04","nivel":"B2","cat":"gramatica","alvo":"3ª condicional","erro":"If I would have known, I would have gone.","certo":"If I had known, I would have gone.","regra":"Depois do if vai had + particípio, não would have.","ex_en":"If I had studied, I would have passed.","ex_pt":"Se eu tivesse estudado, teria passado.","quadros":["nivel","qual-nivel","capi-errou"],"tts":[],"rel":["B1-15"]},
{"id":"B2-05","nivel":"B2","cat":"falso-cognato","alvo":"exquisite ≠ esquisito","erro":"Exquisite = esquisito","certo":"Exquisite = requintado; esquisito = weird","regra":"Exquisite é elogio: requintado. Esquisito é weird.","ex_en":"The food was exquisite.","ex_pt":"A comida estava requintada.","quadros":["pegadinha","nivel","qual-nivel"],"tts":["exquisite"],"rel":["B2-06","B2-07"]},
{"id":"B2-06","nivel":"B2","cat":"falso-cognato","alvo":"sensible ≠ sensível","erro":"Sensible = sensível","certo":"Sensible = sensato; sensível = sensitive","regra":"Sensible é sensato. Sensível é sensitive.","ex_en":"That's a sensible decision.","ex_pt":"É uma decisão sensata.","quadros":["pegadinha","nivel"],"tts":[],"rel":["B2-05"]},
{"id":"B2-07","nivel":"B2","cat":"falso-cognato","alvo":"deception ≠ decepção","erro":"What a deception!","certo":"What a disappointment!","regra":"Decepção é disappointment. Deception é enganação.","ex_en":"The final was a huge disappointment.","ex_pt":"A final foi uma decepção enorme.","quadros":["pegadinha","nivel","hype"],"tts":["disappointment"],"rel":["B2-05"]},
{"id":"B2-08","nivel":"B2","cat":"colocacao","alvo":"heavy rain / heavy traffic","erro":"strong rain","certo":"heavy rain","regra":"Chuva e trânsito fortes são heavy: heavy rain, heavy traffic.","ex_en":"There was heavy traffic because of the rain.","ex_pt":"Tinha trânsito pesado por causa da chuva.","quadros":["nivel","br-vs-nativo","qual-nivel"],"tts":[],"rel":["C1-02"]},
{"id":"B2-09","nivel":"B2","cat":"pronuncia","alvo":"acento que muda (photograph)","erro":"pho-to-GRAPH / pho-to-gra-PHY","certo":"PHOtograph, phoTOgraphy, photoGRAPHic","regra":"A sílaba forte muda de lugar com o sufixo.","ex_en":"She's a photographer; photography is her life.","ex_pt":"Ela é fotógrafa; a fotografia é a vida dela.","quadros":["mico","nivel","voce-sabia"],"tts":["photograph","photography","photographer","photographic"],"rel":["B1-14"]},
{"id":"B2-10","nivel":"B2","cat":"pragmatica","alvo":"Do you mind…? → No = pode","erro":"Do you mind if I sit here? — Yes! (querendo dizer pode)","certo":"Do you mind if I sit here? — No, go ahead.","regra":"Mind é 'se importa'. Responder no quer dizer pode.","ex_en":"Do you mind if I open the window? — Not at all.","ex_pt":"Posso abrir a janela? — Claro, fica à vontade.","quadros":["capi-no-mundo","pegadinha","nivel"],"tts":[],"rel":["B1-12"]},

{"id":"C1-01","nivel":"C1","cat":"falso-cognato","alvo":"sympathetic ≠ simpático","erro":"Your mom is very sympathetic. (querendo dizer simpática)","certo":"Your mom is really nice.","regra":"Simpático é nice ou friendly. Sympathetic é compreensivo, solidário.","ex_en":"My boss was sympathetic when I got sick.","ex_pt":"Meu chefe foi compreensivo quando fiquei doente.","quadros":["pegadinha","nivel","qual-nivel"],"tts":["sympathetic"],"rel":["B2-06"]},
{"id":"C1-02","nivel":"C1","cat":"expressao","alvo":"pagar o pato","erro":"pay the duck","certo":"take the blame / take the fall","regra":"Pagar o pato é take the blame. Pato não entra!","ex_en":"He broke it, but I took the blame.","ex_pt":"Ele quebrou, mas eu paguei o pato.","quadros":["ao-pe-da-letra","br-vs-nativo","capi-errou"],"tts":[],"rel":["C1-03"]},
{"id":"C1-03","nivel":"C1","cat":"expressao","alvo":"os olhos da cara","erro":"It cost the eyes of the face.","certo":"It cost an arm and a leg.","regra":"Custar os olhos da cara é cost an arm and a leg.","ex_en":"Tickets for the final cost an arm and a leg.","ex_pt":"O ingresso da final custou os olhos da cara.","quadros":["ao-pe-da-letra","br-vs-nativo","hype"],"tts":[],"rel":["C1-02"]},
{"id":"C1-04","nivel":"C1","cat":"vocabulario","alvo":"hard ≠ hardly","erro":"I work hardly. (querendo dizer trabalho muito)","certo":"I work hard.","regra":"Hard é com esforço. Hardly é quase não!","ex_en":"I work hard, but I hardly sleep.","ex_pt":"Trabalho muito, mas quase não durmo.","quadros":["pegadinha","capi-errou","nivel"],"tts":[],"rel":["B1-07"]},
{"id":"C1-05","nivel":"C1","cat":"escuta","alvo":"gonna / wanna / gotta","erro":"não reconhecer 'gonna' na fala rápida","certo":"going to → gonna; want to → wanna; got to → gotta","regra":"Na fala rápida: going to vira gonna, want to vira wanna.","ex_en":"I'm gonna grab lunch. Wanna come?","ex_pt":"Vou pegar um almoço. Quer vir?","quadros":["br-vs-nativo","voce-sabia","nivel"],"tts":["gonna","wanna","gotta"],"rel":["B1-14"]},
{"id":"C1-06","nivel":"C1","cat":"gramatica","alvo":"inversão com not only","erro":"Not only I speak English, but also Spanish.","certo":"Not only do I speak English, but I also speak Spanish.","regra":"Frase começando com not only inverte: not only DO I…","ex_en":"Not only did we win, but we also scored five goals.","ex_pt":"Não só ganhamos, como fizemos cinco gols.","quadros":["nivel","qual-nivel","hype"],"tts":[],"rel":["B2-04"]}
]
```
<!-- CURRICULO-EN-BR:FIM -->

**Como o roteirista consome (sem editar à mão):**
```bash
python3 - <<'EOF'
import re, pathlib
md = pathlib.Path("docs/conselho/2026-09-26/didatica-linguistica.md").read_text()
bloco = re.search(r"CURRICULO-EN-BR:INICIO -->\s*```json\n(.*?)```", md, re.S).group(1)
out = pathlib.Path("canal-idiomas/curriculo/en-br.json"); out.parent.mkdir(exist_ok=True); out.write_text(bloco)
EOF
```

**Conferido antes de entregar:**
- Pronúncia pelo fonemizador do Piper (espeak en-us), em 26/09/2026. Corretos: *three* `θɹiː`, *worked* `wɜːkt`, *Wednesday* `wɛnzdeɪ`, *island* `aɪlənd`, *salmon* `sæmən`, *chocolate* `tʃɑːklət`, *photography* `fətɑːɡɹəfi`.
- **Precisam de léxico**: *live* (sai `laɪv`), *Nike*, *Levi's* e *Adidas*.
- *Comfortable* sai `kʌmftəbəl`, sem o r americano: aceitável, mas vale fixar `kˈʌmftɚbəl`.

**Próximos 40 tópicos (v2):**
- Priorizar o que o radar mostrar como busca ("como se fala X em inglês").
- Completar a família das preposições: *in/on/at* com tempo, *good at*, *afraid of*.
- Mais pares mínimos: *ship/sheep*, *full/fool*, *bad/bed*, *walk/work*.
- Pronúncia de marcas, só com IPA conferido.

---

## 7. Sementes para os canais PT (Adiós Portuñol / Gringo Detox)

Mesmo esquema de JSON, com `alvo` em português. Ideias iniciais (níveis são estimativa):
- **Hispanofalantes (portunhol):**
  - *embaraçada* ≠ *embarazada* (grávida)
  - *esquisito* (raro) ≠ *exquisito* (delicioso)
  - *polvo* (PT pulpo) ≠ ES *polvo* (pó)
  - *borracha* (goma de borrar) ≠ ES *borracha* (bêbada)
  - *oficina* (taller) ≠ ES *oficina* (escritório)
  - vogais nasais *pão/mãe*
  - *avô* × *avó* (vogal aberta/fechada)
  - *de/te* → "dji/tchi"
  - *s* entre vogais = /z/ (*casa*)
  - *lh/nh*
- **Anglófonos:**
  - vogais nasais e *ão*
  - *r* inicial = /h/ (*Rio* "Hio")
  - *ser × estar*
  - gênero
  - *a gente* = nós
  - *pretender* = intend (espelho do A2-10)
  - *puxar* = pull (espelho do A1-10)
  - *saudade*
  - *tchau/valeu/beleza*
- **Regra de voz:** a voz PT deve ser a do Felipe ou uma voz nativa BR revisada por ele. Nos canais PT, o Felipe é o "professor nativo" que os canais EN não têm.

---

## Fontes
- Butler & Roediger (2008), feedback e testes de múltipla escolha: https://link.springer.com/article/10.3758/MC.36.3.604 (verificado)
- Kornell, Hays & Bjork (2009), tentativa de resposta antes do feedback: https://sites.williams.edu/nk2/files/2011/08/Kornell.Hays_.Bjork_.2009.pdf (verificado)
- Cepeda et al. (2008), intervalo ideal de revisão: https://laplab.ucsd.edu/articles/Cepeda%20et%20al%202008_psychsci.pdf (verificado)
- English Profile (EGP/EVP, níveis CEFR, grátis): https://englishprofile.org/ (verificado)
- Swan & Smith, *Learner English*, cap. Portuguese speakers: https://www.cambridge.org/core/books/abs/learner-english/portuguese-speakers/1215C7A32B1B1B0D1DE31893B572E4B8 (verificado)
- LanguageTool, limites da API pública: https://dev.languagetool.org/public-http-api.html (verificado) · teste próprio de 10 frases em 26/09/2026
- Origem do "OK" (1839): https://www.smithsonianmag.com/smart-news/how-one-man-discovered-the-obscure-origins-of-the-word-ok-180953258/ (verificado)
- Fonemas: teste próprio com `piper.phonemize_espeak` do `.venv` do projeto, em 26/09/2026 (verificado)
- Custo de professor nativo por hora (Preply/italki): estimativa, não verificado

**Próximo passo:** extrair o currículo para `canal-idiomas/curriculo/en-br.json` e aplicar as melhorias 2 e 3 (segmentação EN obrigatória + léxico IPA + reveal com porquê) antes de gerar qualquer episódio novo.
