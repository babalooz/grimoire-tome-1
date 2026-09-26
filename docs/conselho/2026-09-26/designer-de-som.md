# Conselho — Designer de Som · 26/09/2026

Alvo: áudio atual de `canal-idiomas/` (Piper `pt_BR-faber-medium` + `en_US-lessac-medium`, sem SFX nem música) e a etapa "Voz" do `docs/plano-capi-lingo.md`.

## Resultado em 1 linha
**Capi com voz desenhada no ElevenLabs Starter (US$6/mês, v3, PT e EN com a mesma voz) + pacote de SFX CC0 da Kenney + "cama" de tique-taque no timer + mixagem com ducking a -14 LUFS.** Custo novo: US$6/mês. Tira ~35% de silêncio morto do vídeo.

---

## 1. Diagnóstico (3 linhas)
1. **Medido no `out/002-desafio-5-niveis.mp4`:** 48,8 s de vídeo, **17,3 s de silêncio absoluto (35%)** — 5 buracos de ~3,5 s, exatamente nos timers do quiz. É o ponto onde o público arrasta (medido com `silencedetect -45 dB`, ffmpeg do Remotion).
2. Voz = Piper faber (masculina, neutra, "GPS"), sem personagem; o inglês troca para outra voz (lessac), então **a Capi soa como duas pessoas**. Loudness do vídeo **-15,7 LUFS** (ok, perto de -14), mas os WAVs saem com **pico em 0,0 dBFS** (sem margem; o AAC já comeu até -2,96).
3. Zero SFX e zero música: nada marca ritmo (pergunta → timer → acerto/erro). Todo campeão de quiz citado em `docs/pesquisas/2026-09-26-campeoes-shorts-quiz-idiomas.md` usa som como pontuação.

---

## 2. Voz da Capi — opções com custo

Consumo real (medido): ep. 001 = 334 caracteres, ep. 002 = 452. Estimativa de uso: 30 Shorts/mês × ~600 car. (versão ≥61 s do TikTok incluída) ≈ **18 mil car./mês**; 4 longos de 10–15 min ≈ 40 mil car./mês (estimativa: ~150 palavras/min).

| Opção | Custo/mês | Personagem | PT-BR | EN com mesma voz | Automação | Fonte / rótulo |
|---|---|---|---|---|---|---|
| **A. ElevenLabs Starter + Voice Design v3** ✅ | **US$6** (30 mil créditos; TTS = 1 crédito/car.; Flash = 0,5–1) | Alta: voz desenhada por prompt, 3 opções por geração, suporta *audio tags* no v3 ([suspira], [sussurra], [grita]) | Sim (v3 e Multilingual v2) | **Sim** — mesma voz fala os dois idiomas | API com `seed` + endpoint *with-timestamps* (tempo por caractere → legenda exata e lip sync) | verificado — elevenlabs.io/pricing, docs/overview/models, docs/product-guides/voices/voice-design, docs/api-reference/text-to-speech/convert-with-timestamps |
| B. ElevenLabs Creator | US$22 (US$11 no 1º mês), 121 mil créditos | igual A | igual | igual | igual | verificado — elevenlabs.io/pricing |
| C. Google Chirp 3 HD | US$0 até 1M car./mês; depois US$30/1M | Média: vozes prontas, sem desenho de personagem | Sim (pt-BR listado) | Voz diferente por idioma | API simples, sem timestamps por palavra | verificado — cloud.google.com/text-to-speech/pricing e /docs/chirp3-hd |
| D. Azure Neural TTS | US$0 até 0,5M car./mês (F0) | Média: SSML com estilos em algumas vozes | Sim | Voz diferente (ou multilíngue) | API + SSML | verificado (franquia) — azure.microsoft.com/.../speech-services |
| E. Kokoro-82M (local) | US$0 (Apache-2.0) | Baixa: 3 vozes pt-BR (`pf_dora`, `pm_alex`, `pm_santa`), sem nota de qualidade | Sim | Sim (EN tem vozes boas) | Local, igual ao Piper | verificado — huggingface.co/hexgrad/Kokoro-82M |
| F. Piper (atual) | US$0 | Nenhuma | Sim (faber) | Não | Pronto | — |

**Recomendação: A (Starter, US$6).** Cobre os Shorts com folga (18 mil de 30 mil). Quando os longos de domingo entrarem, subir para Creator (US$22) **ou** manter Starter e narrar o longo com Chirp 3 HD grátis, com a Capi só nos "cortes" de personagem. O plano Free **não** tem licença comercial — não publicar nada gerado nele (verificado, pricing).
Impacto no orçamento: +US$6/mês (de ~US$110). Dentro da estimativa de US$5–22 do plano.

**Prompt de Voice Design (colar no ElevenLabs, modelo v3):**
> Brazilian Portuguese speaker, young adult woman (late 20s), warm low-mid voice, very calm and slow, almost sleepy zen delivery, slightly nasal and friendly, with sudden dramatic outbursts; sounds like a relaxed Brazilian comedian doing deadpan humor; clear diction; no accent in Portuguese; speaks English with a light, charming Brazilian accent but correct pronunciation.

Texto de preview (usa os bordões e testa o contraste zen→drama):
> "Calma... respira... [suspira] ERROU! Capivara não julga. Capivara corrige. Olha só: I am twenty years old. Não é 'I have twenty years', tá?"

Gerar 3–4 rodadas (cada rodada custa só os caracteres do preview, ~200 créditos), escolher 1, salvar como "Capi", anotar `voice_id` + `seed`. Critério de escolha: ouvir no celular, no alto-falante, sem fone.

Decisão de gênero da voz: a bíblia não define. Feminina zen-dramática diferencia do "professor homem" dominante no nicho BR — mas é decisão do Felipe (1 pergunta).

**Elenco de apoio (grátis, Piper/Kokoro):** Tuca = voz EN `en_US-lessac` com `length_scale` 0,85 (fala rápido, gringo); Dona Jaca = Piper pt-BR com pitch -2 semitons via ffmpeg `asetrate`/`atempo`. Custo zero, dá contraste.

---

## 3. Efeitos sonoros e música livres de direitos

| Uso no vídeo | Fonte | Licença | Atribuição | Rótulo |
|---|---|---|---|---|
| Clique, pop de opção, acerto/erro, confirmação | **Kenney Interface Sounds** (100 arquivos) — kenney.nl/assets/interface-sounds | CC0 | Não | verificado |
| UI extra, "blip" de legenda | Kenney UI Audio / Digital Audio — kenney.nl/assets/ui-audio, /digital-audio | CC0 | Não | verificado (página e selo CC0) |
| Vinheta de abertura/fechamento, "fanfarra" de nível 5 | **Kenney Music Jingles** — kenney.nl/assets/music-jingles | CC0 | Não | verificado |
| Impacto no "ERROU!", tombo | Kenney Impact Sounds — kenney.nl/assets/impact-sounds | CC0 (padrão Kenney) | Não | verificado (página existe) |
| Whoosh, tique-taque, riser, estúdio de TV | **Sonniss GDC Game Audio Bundle** — sonniss.com/gameaudiogdc | Royalty-free, uso comercial, **sem atribuição**; proibido redistribuir os arquivos soltos | Não | verificado — sonniss.com/gdc-bundle-license |
| Buscas pontuais (buzzer de game show, plateia rindo) | **Freesound** com filtro de licença **CC0** | CC0 (evitar CC BY-NC; CC BY exige crédito) | Só se CC BY | verificado — freesound.org/help/faq |
| Complemento | Pixabay Sound Effects | Pixabay Content License: comercial ok, sem atribuição | Não | verificado — pixabay.com/service/license-summary |
| Música de fundo (YouTube) | **YouTube Audio Library** (filtrar "atribuição não necessária") | Não recebe Content ID em vídeo monetizado | Algumas faixas CC BY | verificado — support.google.com/youtube/answer/3376882 |
| SFX sob medida (ex.: "capivara mastigando", "suspiro dramático") | ElevenLabs Sound Effects (mesmo plano pago) | Comercial nos planos pagos | Não | autodeclarado (pricing) |

**Evitar para música:** Pixabay Music — faixas "grátis" às vezes estão registradas no Content ID por distribuidores; resolve com o certificado, mas é trabalho manual e o Short fica retido (autodeclarado por usuários + blog oficial da Pixabay ensinando a contestar). Lembrando da pesquisa: música licenciada em Short divide a receita (verificado — answer/12504220). **Para Shorts, a melhor música é nenhuma**: uma cama rítmica de tique-taque/pulso durante o timer e jingles CC0 de 1–2 s nas transições. Música contínua só no longo de domingo, e só da Audio Library.
**Sem músicas infantis** (xilofone fofinho, ukulele "kids") — reforça a classificação "feito para crianças" (verificado na pesquisa, answer/9528076). Preferir sons de game show/TV.

### Kit mínimo (12 arquivos em `public/sfx/`)
`whoosh.wav` (entrada de cena) · `pop.wav` (cada opção aparece) · `tick.wav` (1 por segundo do timer) · `tick-last.wav` (último segundo, mais agudo) · `ding-certo.wav` · `buzz-errado.wav` · `level-up.wav` (barra de nível sobe) · `riser.wav` (antes do nível 5) · `drama-hit.wav` (o "ERROU!") · `jingle-in.wav` (0–1 s, assinatura sonora da Capi) · `jingle-out.wav` (CTA) · `blip.wav` (palavra EN em destaque). Tudo CC0 Kenney + Sonniss; escolher uma vez, versionar no repo (CC0 permite; Sonniss **não** permite redistribuir — se o repo for público, deixar Sonniss fora do git e baixar no `setup.sh`).

---

## 4. Top 5 melhorias (impacto/esforço)

### 1) Preencher o timer com som — impacto ALTO, esforço 1 h
Os 17 s mortos viram tensão. Em `SceneView` (src/Episode.tsx), dentro do intervalo `timing.duration → revealAt`:
```tsx
{scene.timerSeconds && Array.from({ length: scene.timerSeconds }, (_, k) => (
  <Sequence key={k} from={Math.round((timing.duration + k) * fps)} durationInFrames={fps}>
    <Audio src={staticFile(k === scene.timerSeconds! - 1 ? "sfx/tick-last.wav" : "sfx/tick.wav")} volume={0.6} />
  </Sequence>
))}
{timing.reveal && (
  <Sequence from={Math.round(revealAt(scene, timing) * fps)}>
    <Audio src={staticFile("sfx/ding-certo.wav")} volume={0.8} />
  </Sequence>
)}
```
Mais: `pop.wav` no mesmo `delay` de cada `<Pop>` de opção (10 + i×12 frames), `whoosh.wav` no frame 0 de cada cena, `level-up.wav` quando `LevelBar` muda, `riser.wav` 1,5 s antes do nível 5.
Melhor ainda (automatizável): o roteiro ganha um campo opcional `sfx: [{at: "reveal"|"start"|"timer", id: "drama-hit"}]` e o Episode toca o que vier — o roteirista (Claude) escolhe o efeito por cena.

### 2) Trocar a voz da Capi para ElevenLabs — impacto ALTO, esforço 2–3 h
Novo `scripts/tts_eleven.py` (ou flag `--engine eleven` no `tts.py`):
- `POST /v1/text-to-speech/{voice_id}/with-timestamps`, `model_id="eleven_v3"`, `output_format="pcm_44100"` (ou `wav_44100`), `seed` fixo, `voice_settings` salvos em `voices/capi.json`.
- **Mesma voz para `pt` e `en`**; a divisão por `lang` continua só para legenda (🇺🇸) — não troca mais de voz.
- Guardar o alinhamento por caractere em `timings.json` (`segments[].words[] = {text,start,end}`) → a `Caption` destaca a palavra **no tempo real**, não por divisão proporcional (hoje `progress * words.length` erra em palavra longa).
- **Cache por hash** (`sha1(text+voice_id+seed+model)` → `cache/tts/<hash>.wav`): re-render não gasta crédito.
- Fallback automático para Piper se a API falhar/sem crédito (pipeline diário não quebra).
- Rhubarb continua funcionando: roda sobre o WAV da ElevenLabs igual.

### 3) Mixagem e loudness no final do `make.sh` — impacto MÉDIO, esforço 30 min
- Normalizar cada fala na geração: `ffmpeg -af loudnorm=I=-16:TP=-1.5:LRA=7` (ou pyloudnorm) → acaba o pico em 0 dBFS.
- Após o render, passe final no MP4 (sem re-encodar vídeo): `ffmpeg -i out/X.mp4 -c:v copy -af loudnorm=I=-14:TP=-1:LRA=9 -c:a aac -b:a 192k out/X.final.mp4`. O ffmpeg do Remotion em `node_modules/@remotion/compositor-linux-x64-gnu/` **não tem** `ebur128`/`loudnorm` (testado) → adicionar `ffmpeg` do sistema no `setup.sh` (`apt-get install -y ffmpeg`) ou usar `pyloudnorm` em Python.
- Hierarquia de volume: voz 1,0 · SFX 0,5–0,8 · cama/música 0,12 com **ducking** (Remotion aceita `volume={(f) => ...}` por frame — docs remotion.dev/docs/audio/volume): música cai para 0,06 enquanto `talking` é true.
- Gate de qualidade no pipeline: se LUFS fora de -15…-13 ou true peak > -1 dBTP, o script avisa e não publica.

### 4) Assinatura sonora da Capi — impacto MÉDIO (marca/memória), esforço 1 h
Jingle de 0,8 s no início (antes do hook) + o bordão "Calma... respira... ERROU." gravado **uma vez** com a voz final e reutilizado como *stinger* no erro (quadros "Capi errou" e "Nível"). Repetição sonora = reconhecimento no feed sem ver a tela. Cuidado: o hook precisa começar a falar em ≤0,5 s — o jingle fica por baixo da primeira fala, não antes dela.

### 5) Pronúncia e ritmo no roteiro — impacto MÉDIO, esforço 30 min (prompt)
Adicionar em `REGRAS` do `scripts/roteirista.py`:
- "Palavra inglesa **nunca** dentro de fala `lang=pt`; isolar: `[{pt:'Nível dois.'},{en:'Pretend'},{pt:'significa...'}]`."
- "Cena de revelação começa com reação curta da Capi (Aaah!, ERROU!, Boa!) antes da resposta" → ritmo de game show.
- Com ElevenLabs v3: permitir 1 audio tag por fala (`[sighs]`, `[whispers]`, `[shouts]`) só nos bordões.
- `GAP_SECONDS` de 0,25 → 0,12 e respiro final de 0,4 → 0,2 s: Short bom não tem ar parado (≈ -2 s por vídeo).

---

## 5. Erro oculto
**O inglês já está sendo pronunciado errado hoje, e a revisão "professor nativo" não pega.** No ep. 002, "Nível dois. **Pretend** significa..." e "Nível quatro. **Actually** significa..." e "Atualmente é **currently**" são falas `lang: "pt"` → o Piper faber lê as palavras inglesas com fonética portuguesa ("pre-tên-di", "ac-tu-a-li"). O roteirista valida o **texto**, nunca o **som**. Num canal de inglês, uma pronúncia errada no áudio vira comentário de correção e mata a credibilidade (o próprio README diz isso). Correção dupla: (a) regra de isolar palavra inglesa em segmento `en` (item 5); (b) com ElevenLabs a mesma voz lê as duas línguas e o problema some mesmo quando o roteiro escorregar. Bônus: checagem automática no `tts.py` — se um segmento `pt` contém palavra que está em `options`/título em inglês, quebrar o segmento sozinho.

Segundo ponto (oportunidade despercebida): o endpoint *with-timestamps* da ElevenLabs entrega tempo por caractere — isso resolve **de graça** a legenda palavra a palavra exata e alimenta o lip sync sem depender só do Rhubarb.

---

## 6. Mudanças concretas no pipeline (checklist)
1. `scripts/setup.sh`: instalar `ffmpeg` do sistema; baixar kit SFX (Kenney CC0 zips) para `public/sfx/`; `pip install elevenlabs pyloudnorm`.
2. `scripts/tts.py`: engine `eleven` (padrão para a Capi) + `piper` (Tuca/Dona Jaca/fallback); campo `speaker` no segmento (`capi|tuca|jaca`); cache por hash; loudnorm -16 LUFS/-1,5 dBTP por arquivo; saída 44,1 kHz (hoje 22,05 kHz mono); timestamps por palavra no `timings.json`.
3. `src/Episode.tsx`: SFX por evento (whoosh/pop/tick/ding/buzz/level-up/riser); `Caption` usando `words[]` reais; cama opcional com ducking por `talking`.
4. `scripts/roteirista.py`: regras de pronúncia/reação/audio tags; campo opcional `sfx` e `speaker` no schema.
5. `scripts/make.sh`: passe final `loudnorm I=-14 TP=-1` + gate de LUFS antes da postagem.
6. Segredo: `ELEVENLABS_API_KEY` no ambiente/GitHub Actions (nunca no repo).

Ordem sugerida: 1 → 3 (SFX) → 5 → 2 → 4. SFX e mixagem já melhoram o vídeo **antes** de pagar qualquer coisa.

---

## 7. Nota do estado atual (áudio): **3/10**
Funciona e é automatizado (por isso não é 1), mas: voz sem personagem e dividida em duas, 35% de silêncio, zero SFX, pico sem margem, inglês pronunciado em fonética PT.
**Para 10:** voz única da Capi aprovada pelo Felipe no celular · kit de 12 SFX tocando por evento · timer sem silêncio · -14 LUFS/-1 dBTP com gate automático · legenda por timestamp real · jingle + bordão recorrentes · teste A/B de 14 dias mostrando retenção maior no trecho do timer (curva de retenção do YouTube Studio nos segundos 7–10, 14–17 etc.).

## Fontes
- https://elevenlabs.io/pricing — planos, créditos, licença comercial (verificado 26/09/2026)
- https://elevenlabs.io/docs/product-guides/voices/voice-design — Voice Design v3, cobrança só do preview
- https://elevenlabs.io/docs/overview/models — v3/Multilingual v2 com português do Brasil; Flash 50% mais barato
- https://elevenlabs.io/docs/api-reference/text-to-speech/convert-with-timestamps — alinhamento por caractere, `seed`, formatos PCM/WAV 44,1 kHz
- https://cloud.google.com/text-to-speech/pricing · https://cloud.google.com/text-to-speech/docs/chirp3-hd — Chirp 3 HD US$30/1M, 1M grátis; pt-BR listado
- https://azure.microsoft.com/en-us/pricing/details/cognitive-services/speech-services/ — 0,5M car./mês grátis (F0)
- https://huggingface.co/hexgrad/Kokoro-82M/blob/main/VOICES.md — Kokoro Apache-2.0, vozes pt-BR
- https://kenney.nl/assets/interface-sounds · /ui-audio · /digital-audio · /music-jingles · /impact-sounds — CC0
- https://sonniss.com/gdc-bundle-license/ — royalty-free, sem atribuição
- https://freesound.org/help/faq/ — CC0 / CC BY / CC BY-NC, filtro por licença
- https://pixabay.com/service/license-summary/ · https://pixabay.com/blog/posts/how-to-clear-a-youtube-content-id-claim-with-a-pix-190/ — licença e caso de Content ID
- https://support.google.com/youtube/answer/3376882 — YouTube Audio Library
- https://www.remotion.dev/docs/audio/volume — volume por frame (ducking)
- Medições locais: `out/002-desafio-5-niveis.mp4` (silencedetect, pyloudnorm), WAVs de `public/audio/002-desafio-5-niveis/`.
