"""Roteirista v2 do CapyFala: currículo + radar + quadro da grade -> episódio JSON pronto para scripts/make.sh.

Uso:
  .venv/bin/python scripts/roteirista.py                          # quadro do dia pela grade semanal
  .venv/bin/python scripts/roteirista.py --quadro nivel           # força um quadro
  .venv/bin/python scripts/roteirista.py --dry-run                # mostra tópicos escolhidos + prompts (sem API)
  .venv/bin/python scripts/roteirista.py --data 2026-10-12        # simula outra data (seleção/espaçamento)
  .venv/bin/python scripts/roteirista.py --validar episodes/*.json   # só roda os validadores (sem API)
Requer ANTHROPIC_API_KEY (ou `ant auth login`) fora do --dry-run/--validar.

Fluxo (spec: docs/conselho/2026-09-26/didatica-linguistica.md, roteirista-shorts.md, retencao-psicologia.md):
  1. O CÓDIGO escolhe o tópico do currículo (curriculo/en-br.json) antes da IA: não usados primeiro, foco A1–B1,
     B2/C1 só de vez em quando, e um tópico de revisão espaçada (~3/10/30 dias) quando houver. Registro em curriculo/uso.json.
  2. A IA só roteiriza (gancho, cena, piada, fala da Capy) em cima do conteúdo linguístico do tópico.
  3. Validadores em código (gancho, 1ª pergunta até ~2 s, "%" sem fonte, promessa sem episódio, inglês na voz PT,
     duração, CTA). Reprovou -> volta à IA com os problemas (até 2 novas tentativas).
  4. Revisor (2ª passada) só APROVA/REPROVA e aponta erro de inglês/fato/gabarito; não reescreve nada.
     Reprovou -> volta ao roteirista com os problemas (mesmo limite de tentativas).
  5. Memória de série: promessa de continuação (answerTomorrow) vai para curriculo/serie.json com o id do próximo
     episódio (nextEpisodeId); o próximo episódio recebe a pendência no prompt e é obrigado a responder.
Esgotadas as tentativas, o rascunho vai para episodes/_reprovados/ (fila de aprovação do Felipe) e sai com código 1.
"""
import argparse
import datetime as dt
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CUR_DIR = ROOT / "curriculo"
CURRICULO = CUR_DIR / "en-br.json"
USO = CUR_DIR / "uso.json"
SERIE = CUR_DIR / "serie.json"
MODEL = "claude-opus-5"
MAX_RETRIES = 2  # novas tentativas depois da 1ª (total = 3 rascunhos)

# Grade semanal (0 = segunda). Domingo = vídeo longo, sem Short do roteirista (roteirista-shorts.md, melhoria #4).
GRADE = {0: "nivel", 1: "capi-errou", 2: "qual-seu-nivel", 3: "pegadinha", 4: "hype", 5: "mico"}

# ---------------------------------------------------------------- quadros (textos da seção 6 do roteirista-shorts.md)
QUADROS = {
    "nivel": "Nível 1→4 (versão curta): 4 questions (level 1..4, 2 opções, timer 2 s nos níveis 1–2 e 3 s nos 3–4). "
             "Cada nível testa um TIPO diferente, em escalada real (ex.: vocabulário → falso cognato → preposição → tempo "
             "verbal), usando SÓ os tópicos do currículo abaixo, do mais fácil ao mais difícil. A Capy fica mais nervosa a "
             "cada nível. Re-gancho (campo rehook) no nível 3, ex.: 'Agora complica 😬'. Gancho de personagem: "
             "'nível 4 me fez suar'. CTA pedindo o placar (0 a 4) nos comentários.",
    "qual-seu-nivel": "Qual seu nível? (versão TikTok, 61–75 s): 6 questions (level 1..6, subtitle com o nível CEFR do "
                      "tópico), uma por tópico do currículo abaixo, em ordem de dificuldade. Gancho: 'teu nível em um "
                      "minuto'. CTA: 'parou em qual? comenta teu nível'.",
    "capi-errou": "Capy errou, corrige aí: a Capy, presunçosa, apresenta 3 frases numa situação adulta (aeroporto, trabalho, "
                  "date). Exatamente 1 está errada (o erro_do_brasileiro do tópico-alvo) e as outras 2 são CERTAS (use a "
                  "forma_certa dos tópicos de apoio); pelo menos 1 das certas PARECE errada (isca de debate). question "
                  "SEM answer. Não revele. Preencha answerTomorrow {wrong, correction, why, trap}. "
                  "CTA: 'comenta A, B ou C — amanhã eu conto'.",
    "mico": "Para de pagar mico: 3 palavras em inglês que brasileiro pronuncia diferente (use as palavras_pronuncia dos "
            "tópicos abaixo). Para cada uma: a Capy fala confiante do jeito brasileiro (lang=pt, grafia aportuguesada, ex.: "
            "'uêdinesdei'), timer 2 s, e a pronúncia certa (lang=en). Só pronúncias de dicionário (Cambridge/Merriam-Webster).",
    "pegadinha": "Pegadinha (falso amigo/confusão clássica): 3 questions com 2 opções, uma por tópico abaixo. Revelação com "
                 "a palavra certa em inglês (fala en) + o porquê em até 1 linha.",
    "br-vs-nativo": "Brasileiro vs Nativo: 3 situações, uma por tópico abaixo; em cada uma, como o brasileiro fala (erro) × "
                    "como o nativo fala (forma certa). Use type=example com example=frase nativa e "
                    "translation='🇧🇷 jeito brasileiro: ...'.",
    "voce-sabia": "Você sabia?: pergunta ANTES do fato (2 opções) sobre o tópico-alvo, depois o porquê e 1 exemplo de uso. "
                  "Nada de curiosidade que não esteja no tópico.",
    "hype": "Hype em inglês: use UM assunto em alta de hoje (lista abaixo) como cenário e ensine o tópico-alvo dentro dele "
            "+ 1 question. Nada de política, tragédia ou crime. Se nenhum assunto combinar, use uma situação do dia a dia.",
}
QUESTOES = {"nivel": 4, "qual-seu-nivel": 6, "capi-errou": 3, "mico": 3, "pegadinha": 3, "br-vs-nativo": 3,
            "voce-sabia": 1, "hype": 1}  # nº de tópicos (alvo + apoio) que o quadro consome
DURACAO = {"qual-seu-nivel": (61, 75)}  # versão longa TikTok (CRP ≥ 1 min)
DURACAO_CURTA = (25, 40)

# ---------------------------------------------------------------- personagem e regras (seção 6, adaptados à marca)
PERSONAGEM = (
    "Capy é uma capivara brasileira, professora de inglês do canal CapyFala (@acapyfala). TODAS as falas são da Capy, em "
    "primeira pessoa. Zen por fora, dramática por dentro: fala pouco e calma, mas sua no nível difícil, fica presunçosa "
    "quando acha que acertou e desmorona quando cai na armadilha. Humor adulto-leve de brasileiro (trabalho, "
    "segunda-feira, viagem, término, boleto, memes) — nunca infantil, nunca palavrão, nunca política. Bordões (usar NO "
    "MÁXIMO 1 por vídeo, de preferência no CTA ou na armadilha): \"Calma... respira... ERROU.\" · \"Capivara não julga. "
    "Capivara corrige.\"\nPúblico: brasileiros adultos, 18–35, que \"sabem um pouco\" de inglês (canal adulto: nada de "
    "cores, animais, números, alfabeto ou tema infantil)."
)

REGRAS = """Estrutura obrigatória:
- Cena 1 type=hook: fala ≤ 8 palavras e título na tela ≤ 6 palavras (emoji não conta). A 1ª pergunta precisa começar
  até ~2 s: na prática a fala do gancho tem 5–6 palavras. Gancho de desafio, identidade ou personagem sob pressão.
  PROIBIDO porcentagem, estatística ou "X% dos brasileiros" — não temos dado real.
- O CONTEÚDO LINGUÍSTICO vem do currículo (tópico-alvo e tópicos de apoio): erro, forma certa, regra e exemplo. Você NÃO
  inventa outro erro nem outra regra; você escreve gancho, cena, piada e a fala da Capy em volta deles.
- Perguntas: a opção errada é o erro_do_brasileiro do tópico. Nunca duas opções que possam estar certas em algum registro.
- Revelação: frase correta em inglês (lang=en, fala separada) + no máximo 1 linha em português com o PORQUÊ (regra_curta,
  pode enxugar). A forma certa é sempre a última frase em inglês da cena.
- Em cada vídeo: pelo menos 1 piada da Capy (reação, comparação com a vida adulta) e 1 momento de emoção (suor, choque).
- A fala da pergunta NÃO repete o que está escrito na tela: é reação/tensão ("Nível três. Começou o suor.").
- Última cena type=cta: fala ≤ 12 palavras, pede placar ou escolha nos comentários (A/B/C, 0–4). Nunca prometa
  "parte 2", "amanhã" ou "próximo vídeo", a não ser que o quadro mande (capi-errou, com answerTomorrow preenchido).
- Falas ≤ 14 palavras. TODA palavra ou expressão em inglês, mesmo solta ("pretend", "present perfect", "mall"), vai em
  fala separada com lang=en: [{pt:"O que significa"}, {en:"pretend?"}]. Dentro de fala pt, zero palavra inglesa.
- Números por extenso nas falas ("vinte", não "20").
- Inglês 100% correto e natural (americano; termos de futebol UK/US são aceitos). Nada de fatos inventados.
- Preencha pinnedComment: uma pergunta que obrigue a responder (ex.: "Parei no ___. E você?").
- hashtags: 4–5, sempre com #capyfala e #inglês.
- topico_id = id do tópico-alvo; topicos_extra = ids dos outros tópicos do currículo que você usou."""

# Playbook dos campeões do TikTok (docs/pesquisas/2026-09-26-tiktok-campeoes.md, dados de 26/09/2026).
TIKTOK_NATIVO = """Versão TikTok (nativa, NÃO repost do Short):
- A Capy AGE e a aula vem de carona: a palavra em inglês nasce de uma reação dela (vergonha, pânico, "perdendo aura").
- Frame 0 = erro ou piada já na tela, sem vinheta, logo ou "olá pessoal". Texto de tela em minúsculas, 1 frase.
- Moldura que funciona hoje: "pov: ...", autodepreciação, ironia seca, hype do dia (até 24 h). PROIBIDO "ninguém:" (gasto).
- Gírias do TikTok que vêm do inglês são aula pronta: rizz, mid, cooked, sus, delulu, NPC, sigma, aura, farm. Elas vão
  em fala lang=en (nunca dentro de fala pt). Nada de skibidi/67/brainrot (puxa para infantil).
- Palavra-chave de busca em português dita E escrita nos primeiros 5 s ("como se diz ... em inglês").
- Legenda do post: minúscula, irônica, 1 frase; 3–5 hashtags de nicho, com #capyfala e #capybara; preguiça = #sloth.
- Nada de promessa de prazo ou "método"; CTA = escolha nos comentários ou "link no perfil" (teste de nível)."""

# Gatilhos mentais permitidos (só os verdadeiros; regra do Felipe, 27/09) — o portão reprova os proibidos.
GATILHOS = """Gatilhos (use só estes, sempre verdadeiros):
1. 0–2 s: erro REAL da Capy acontecendo + texto de tela "tá errado. sabe por quê?"; a resposta vem no mesmo vídeo.
2. Pergunta de 3 s com contador: "pensa aí... ou chuta nos comentários".
3. Selo com progresso real: "T1 E07 · você já sabe 7 frases" (número = frases já ensinadas de verdade).
4. Revisão espaçada do Bolinha abre com "lembra dessa?".
5. Laço aberto ("amanhã: ... EP 08") SÓ se o EP 08 já existe e está agendado; senão, nenhuma promessa.
6. Pertencimento pelo elenco: "#TimeLazy ou #TimeHank?".
PROIBIDO: "fluente em X dias", "método secreto", urgência inventada ("só hoje", "últimas vagas"), mostrar número
zerado de seguidores/views, e a frase "trava na hora de falar" (é chamada de concorrente)."""

# Contexto por faixa (decisão do Felipe, 26/09): todo vídeo é contextualizado com tendência.
#   esquete  -> 1 hype do DIA que passou no filtro de segurança; sem hype seguro -> calendário; sem nada -> atemporal.
#   episódio -> a lição do currículo NÃO muda; o TEMA DA SEMANA (radar semanal) vira cenário, fala de apoio
#               (Dona Jaca, Poppy...) ou exemplo em português; sem tema -> calendário da semana.
REGRA_CONTEXTO = """Contexto de tendência (obrigatório):
- Use o CONTEXTO abaixo como cenário, piada ou exemplo. Ele NUNCA troca a lição: erro, forma certa e frases em inglês
  do currículo ficam iguais. Cite o assunto, não a pessoa: nada de nome, rosto, voz ou bordão de pessoa real.
- Nada de política, crime, tragédia, morte, religião, aposta ou conteúdo infantil (o radar já filtrou; na dúvida, ignore).
- Se o contexto não couber naturalmente em 1 fala, use-o só no texto de tela/legenda. Forçar é pior que não usar."""
MAX_FALAS_CONTEXTO = 3  # episódio: no máximo 3 falas pt reescritas pelo contexto

# ---------------------------------------------------------------- 3 roteiros-modelo (seção 7), limpos:
# sem números inventados, marca CapyFala, inglês separado em fala en e ganchos dentro dos validadores.
MODELOS = {
    "nivel": {
        "topic": "4 armadilhas clássicas de brasileiro, da mais fácil à mais cruel",
        "title": "Nível 1 é fácil. Nível 4 fez a Capy suar 😰",
        "hashtags": ["#inglês", "#quiz", "#capyfala", "#aprenderingles", "#desafio"],
        "pinnedComment": "Placar da Capy: nível 4 eu errei na primeira vez. Qual foi o teu?",
        "scenes": [
            {"type": "hook", "title": "Nível 4 me fez suar 😰",
             "speech": [{"lang": "pt", "text": "Nível quatro me fez suar."}]},
            {"type": "question", "level": 1, "title": "\"Estou com fome\"", "options": ["I have hunger", "I'm hungry"],
             "answer": 1, "timerSeconds": 2, "speech": [{"lang": "pt", "text": "Nível um. Tô com fome."}],
             "revealSpeech": [{"lang": "en", "text": "I'm hungry."},
                              {"lang": "pt", "text": "Fome você não tem. Você está."}]},
            {"type": "question", "level": 2, "title": "I'm good ___ English.", "subtitle": "bom EM = good AT",
             "options": ["in", "at"], "answer": 1, "timerSeconds": 2,
             "speech": [{"lang": "pt", "text": "Nível dois. Começou o suor."}],
             "revealSpeech": [{"lang": "en", "text": "I'm good at English."}]},
            {"type": "question", "level": 3, "rehook": "Agora complica 😬", "title": "\"A gente terminou\" 💔",
             "options": ["We broke down", "We broke up"], "answer": 1, "timerSeconds": 3,
             "speech": [{"lang": "pt", "text": "Nível três. A gente terminou."}],
             "revealSpeech": [{"lang": "en", "text": "Broke down"},
                              {"lang": "pt", "text": "é o carro quebrando. Ou você, depois."},
                              {"lang": "en", "text": "We broke up."}]},
            {"type": "question", "level": 4, "title": "\"Moro aqui há dois anos\"",
             "options": ["I live here for two years", "I've lived here for two years"], "answer": 1, "timerSeconds": 3,
             "speech": [{"lang": "pt", "text": "Nível quatro. Calma... respira..."}],
             "revealSpeech": [{"lang": "pt", "text": "Começou e continua? Usa o"},
                              {"lang": "en", "text": "present perfect. I've lived here for two years."}]},
            {"type": "cta", "title": "Teu placar: _/4 👇",
             "speech": [{"lang": "pt", "text": "Comenta teu placar. Errou o um? Capivara não julga. Capivara corrige."}]},
        ],
    },
    "capi-errou": {
        "topic": "since × for no present perfect (com isca: married to)",
        "title": "A Capy disse 3 frases. UMA tá errada 🤨",
        "hashtags": ["#inglês", "#capyfala", "#achaoerro", "#aprenderingles", "#quiz"],
        "pinnedComment": "Resposta no fim do vídeo de amanhã. Até lá: A, B ou C?",
        "answerTomorrow": {
            "wrong": 0, "correction": "I've been here since Monday.",
            "why": "Começou no passado e continua até agora: present perfect. 'I'm here since' é tradução direta do português.",
            "trap": "C está CERTA: em inglês é 'married to', não 'married with'.",
        },
        "scenes": [
            {"type": "hook", "title": "Meu inglês é perfeito. Confia 😌",
             "speech": [{"lang": "pt", "text": "Meu inglês é perfeito. Confia."}]},
            {"type": "question", "title": "Uma dessas tá ERRADA. Qual?", "subtitle": "Capy no aeroporto de Miami ✈️",
             "options": ["I'm here since Monday.", "I'm looking forward to seeing you.", "She's married to a Canadian."],
             "timerSeconds": 3,
             "speech": [{"lang": "pt", "text": "Cheguei em Miami e mandei essas três pro gringo. A:"},
                        {"lang": "en", "text": "I'm here since Monday."}, {"lang": "pt", "text": "B:"},
                        {"lang": "en", "text": "I'm looking forward to seeing you."}, {"lang": "pt", "text": "C:"},
                        {"lang": "en", "text": "She's married to a Canadian."}]},
            {"type": "example", "title": "O gringo me olhou assim 😐", "example": "Uma está errada.",
             "translation": "E não, eu não vou contar qual.",
             "speech": [{"lang": "pt", "text": "O gringo me olhou estranho. Uma tá errada. E eu não vou contar qual."}]},
            {"type": "cta", "title": "A, B ou C? Resposta amanhã 👇",
             "speech": [{"lang": "pt", "text": "Comenta A, B ou C. Amanhã eu conto. Valendo meu respeito."}]},
        ],
    },
    "qual-seu-nivel": {
        "topic": "teste A1→C2 em 1 minuto (versão TikTok ≥61 s)",
        "title": "Descubra teu nível de inglês em 1 minuto 🎯",
        "hashtags": ["#inglês", "#testedeingles", "#qualseunivel", "#capyfala", "#aprenderingles"],
        "pinnedComment": "Parei no ___. Comenta o teu (sem mentir, a Capy tá vendo 👀)",
        "scenes": [
            {"type": "hook", "title": "Teu nível em 1 minuto 🎯", "subtitle": "Onde você parar de acertar = teu nível",
             "speech": [{"lang": "pt", "text": "Teu nível em um minuto."}]},
            {"type": "question", "level": 1, "title": "My sister ___ 30 years old.", "subtitle": "A1",
             "options": ["has", "is"], "answer": 1, "timerSeconds": 3,
             "speech": [{"lang": "pt", "text": "A um. Minha irmã tem trinta anos."}],
             "revealSpeech": [{"lang": "pt", "text": "Idade em inglês é com o verbo ser."},
                              {"lang": "en", "text": "My sister is thirty years old."}]},
            {"type": "question", "level": 2, "title": "\"Ontem eu fui ao shopping\"", "subtitle": "A2",
             "options": ["Yesterday I went to the mall", "Yesterday I go to the mall"], "answer": 0, "timerSeconds": 3,
             "speech": [{"lang": "pt", "text": "A dois. Ontem eu fui ao shopping."}],
             "revealSpeech": [{"lang": "pt", "text": "Passado, e shopping em inglês é"},
                              {"lang": "en", "text": "mall. Yesterday I went to the mall."}]},
            {"type": "question", "level": 3, "title": "\"Moro aqui há três anos\"", "subtitle": "B1",
             "options": ["I'm living here for three years", "I've been living here for three years"], "answer": 1,
             "timerSeconds": 3, "speech": [{"lang": "pt", "text": "B um. Aqui muita gente cai."}],
             "revealSpeech": [{"lang": "pt", "text": "Começou lá atrás e continua:"},
                              {"lang": "en", "text": "present perfect. I've been living here for three years."}]},
            {"type": "question", "level": 4, "rehook": "Aqui a Capy começou a suar 😬",
             "title": "\"Se eu tivesse estudado, teria passado\"", "subtitle": "B2",
             "options": ["If I studied, I would pass", "If I had studied, I would have passed"], "answer": 1,
             "timerSeconds": 3, "speech": [{"lang": "pt", "text": "B dois. Se eu tivesse estudado, teria passado."}],
             "revealSpeech": [{"lang": "pt", "text": "Arrependimento do passado:"},
                              {"lang": "en", "text": "had, then would have. If I had studied, I would have passed."}]},
            {"type": "question", "level": 5, "title": "\"Tô por um fio\"", "subtitle": "C1",
             "options": ["I'm hanging by a thread", "I'm hanging on a wire"], "answer": 0, "timerSeconds": 3,
             "speech": [{"lang": "pt", "text": "C um. Segunda, oito da manhã."}],
             "revealSpeech": [{"lang": "pt", "text": "Igualzinho ao português."},
                              {"lang": "en", "text": "I'm hanging by a thread."}]},
            {"type": "question", "level": 6, "title": "Hardly ___ arrived when it started to rain.", "subtitle": "C2",
             "options": ["I had", "had I"], "answer": 1, "timerSeconds": 3,
             "speech": [{"lang": "pt", "text": "C dois. Calma... respira... Complete a frase."}],
             "revealSpeech": [{"lang": "pt", "text": "Começou com"}, {"lang": "en", "text": "hardly?"},
                              {"lang": "pt", "text": "Inverte."},
                              {"lang": "en", "text": "Hardly had I arrived when it started to rain."}]},
            {"type": "cta", "title": "Parou em qual? Comenta 👇",
             "speech": [{"lang": "pt", "text": "Parou em qual nível? Comenta aí. Acertou o C dois? Me ensina."}]},
        ],
    },
}

# ---------------------------------------------------------------- schema de saída da IA
SPEECH = {
    "type": "array",
    "items": {
        "type": "object",
        "properties": {"lang": {"type": "string", "enum": ["pt", "en"]}, "text": {"type": "string"}},
        "required": ["lang", "text"], "additionalProperties": False,
    },
}
SCENE = {
    "type": "object",
    "properties": {
        "type": {"type": "string", "enum": ["hook", "question", "reveal", "example", "cta"]},
        "title": {"type": "string"},
        "subtitle": {"type": ["string", "null"]},
        "rehook": {"type": ["string", "null"]},
        "level": {"type": ["integer", "null"]},
        "options": {"type": ["array", "null"], "items": {"type": "string"}},
        "answer": {"type": ["integer", "null"]},
        "timerSeconds": {"type": ["integer", "null"]},
        "example": {"type": ["string", "null"]},
        "translation": {"type": ["string", "null"]},
        "speech": SPEECH,
        "revealSpeech": {"anyOf": [SPEECH, {"type": "null"}]},
    },
    "required": ["type", "title", "subtitle", "rehook", "level", "options", "answer", "timerSeconds",
                 "example", "translation", "speech", "revealSpeech"],
    "additionalProperties": False,
}
ANSWER_TOMORROW = {
    "type": "object",
    "properties": {"wrong": {"type": "integer"}, "correction": {"type": "string"}, "why": {"type": "string"},
                   "trap": {"type": "string"}},
    "required": ["wrong", "correction", "why", "trap"], "additionalProperties": False,
}
EPISODE = {
    "type": "object",
    "properties": {
        "topic": {"type": "string"},
        "title": {"type": "string", "description": "título do post (máx. 60 caracteres, com gancho)"},
        "hashtags": {"type": "array", "items": {"type": "string"}},
        "pinnedComment": {"type": "string"},
        "topico_id": {"type": "string"},
        "topicos_extra": {"type": "array", "items": {"type": "string"}},
        "answerTomorrow": {"anyOf": [ANSWER_TOMORROW, {"type": "null"}]},
        "scenes": {"type": "array", "items": SCENE},
    },
    "required": ["topic", "title", "hashtags", "pinnedComment", "topico_id", "topicos_extra", "answerTomorrow", "scenes"],
    "additionalProperties": False,
}
VEREDITO = {
    "type": "object",
    "properties": {"aprovado": {"type": "boolean"}, "problemas": {"type": "array", "items": {"type": "string"}}},
    "required": ["aprovado", "problemas"], "additionalProperties": False,
}

REVISOR = (
    "Você é professor(a) nativo(a) de inglês americano e checador(a) de fatos de Shorts. Você é JUIZ, não editor: "
    "NÃO reescreve nada e NÃO opina sobre piadas, tom ou ritmo. Reprove SOMENTE por: inglês errado ou pouco natural nas "
    "frases apresentadas como certas; gabarito ('answer') errado; opções ambíguas (as duas aceitáveis em algum registro); "
    "erro 'de brasileiro' que não é comum de verdade; fato falso; regra explicada de forma errada; conteúdo que contradiz o "
    "tópico do currículo (gabarito abaixo); porcentagem/estatística. Termos de futebol UK/US são aceitos. No quadro "
    "capi-errou a frase errada é PROPOSITAL (é o erro do tópico) — não aponte isso como problema; confira só se "
    "answerTomorrow está certo. Cada problema: cena + o que está errado + a forma certa, em 1 linha."
)


# ---------------------------------------------------------------- currículo, uso e série
def load_json(path: Path, default):
    return json.loads(path.read_text()) if path.exists() else default


def save_json(path: Path, data) -> None:
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n")


def load_curriculo() -> list[dict]:
    return load_json(CURRICULO, {"topicos": []})["topicos"]


def datas_uso(uso: dict, tid: str) -> list[dt.date]:
    return sorted({dt.date.fromisoformat(u["data"]) for u in uso.get("usos", {}).get(tid, [])})


INTERVALOS_REVISAO = (3, 10, 30)  # dias depois do 1º, 2º e 3º uso (Cepeda et al. 2008, via didatica-linguistica.md)
# Mistura de níveis por episódio (60% A1–A2, 30% B1, 10% B2+), ciclo de 10.
CICLO_NIVEIS = ["A1", "A2", "B1", "A2", "A1", "B1", "A2", "A1", "B1", "ocasional"]
ORDEM_NIVEL = {"A1": 0, "A2": 1, "B1": 2, "B2": 3, "C1": 4}


def revisao_devida(uso: dict, t: dict, hoje: dt.date) -> int | None:
    """Dias de atraso da próxima revisão (≥0) ou None se não é hora (nunca usado, cedo demais ou já revisado 3×)."""
    datas = [d for d in datas_uso(uso, t["id"]) if d < hoje]
    if not datas or len(datas) > len(INTERVALOS_REVISAO):
        return None
    atraso = (hoje - datas[-1]).days - INTERVALOS_REVISAO[len(datas) - 1]
    return atraso if atraso >= 0 else None


def escolher_topicos(quadro: str, hoje: dt.date, cur: list[dict], uso: dict) -> dict:
    """Escolhe, sem IA: alvo (1 tópico novo), revisao (espaçada, opcional) e apoio (para quadros com várias perguntas)."""
    def dias(t):
        ds = datas_uso(uso, t["id"])
        return (hoje - ds[-1]).days if ds else 10_000

    def usos(t):
        return len(datas_uso(uso, t["id"]))

    compat = [t for t in cur if quadro in t["quadros"]] or cur
    episodios = {u["episodio"] for us in uso.get("usos", {}).values() for u in us}
    faixa = CICLO_NIVEIS[len(episodios) % len(CICLO_NIVEIS)]

    def na_faixa(t):
        return t["foco"] == "ocasional" if faixa == "ocasional" else t["nivel"] == faixa

    # alvo: não usado > faixa do ciclo > foco principal (A1–B1) > menos usado > mais tempo sem uso
    alvo = sorted(compat, key=lambda t: (usos(t) > 0, not na_faixa(t), t["foco"] != "principal",
                                         usos(t), -dias(t), t["id"]))[0]

    # revisão: tópico já ensinado, compatível com o quadro, cuja revisão (3/10/30 dias) venceu; o mais atrasado primeiro
    devidos = [(revisao_devida(uso, t, hoje), t) for t in compat if t["id"] != alvo["id"]]
    devidos = [(a, t) for a, t in devidos if a is not None]
    revisao = sorted(devidos, key=lambda x: (x[1]["foco"] != "principal", -x[0]))[0][1] if devidos else None

    # apoio: completa as perguntas do quadro com tópicos compatíveis, de categoria diferente, sem uso nos últimos 10 dias
    n_apoio = QUESTOES.get(quadro, 1) - 1 - (1 if revisao and QUESTOES.get(quadro, 1) > 1 else 0)
    usados = {alvo["id"]} | ({revisao["id"]} if revisao else set())
    cats = {alvo["categoria"]} | ({revisao["categoria"]} if revisao else set())
    apoio = []
    # pronúncia só rende no quadro mico (precisa de áudio comparado); nos demais fica fora do apoio
    pool = [t for t in compat if t["id"] not in usados and dias(t) >= 10
            and (t["categoria"] == "pronuncia") == (quadro == "mico")]
    if quadro == "qual-seu-nivel":  # 1 tópico por nível CEFR, subindo
        for nivel in ["A1", "A2", "B1", "B2", "C1", "C1"]:
            if len(apoio) >= n_apoio:
                break
            ja = {x["id"] for x in apoio} | usados
            niveis_ja = [x["nivel"] for x in apoio] + [alvo["nivel"]] + ([revisao["nivel"]] if revisao else [])
            if niveis_ja.count(nivel) >= (2 if nivel == "C1" else 1):
                continue
            cand = sorted((t for t in pool if t["nivel"] == nivel and t["id"] not in ja), key=lambda t: (usos(t), t["id"]))
            if cand:
                apoio.append(cand[0])
    while len(apoio) < n_apoio:
        ja = {x["id"] for x in apoio} | usados
        cand = [t for t in pool if t["id"] not in ja] or [t for t in cur if t["id"] not in ja]
        if not cand:
            break
        niveis = {alvo["nivel"]} | {x["nivel"] for x in apoio}
        # foco A1–B1 (B2/C1 só na vez "ocasional") > categoria nova > nível ainda não representado > menos usado
        melhor = sorted(cand, key=lambda t: (t["foco"] != "principal" and faixa != "ocasional", t["categoria"] in cats,
                                             t["nivel"] in niveis, usos(t), t["id"]))[0]
        apoio.append(melhor)
        cats.add(melhor["categoria"])
    apoio.sort(key=lambda t: ORDEM_NIVEL[t["nivel"]])
    return {"alvo": alvo, "revisao": revisao, "apoio": apoio, "faixa": faixa}


def registrar_uso(uso: dict, ep: dict, hoje: dt.date, escolha: dict) -> None:
    papeis = {escolha["alvo"]["id"]: "alvo"}
    if escolha["revisao"]:
        papeis[escolha["revisao"]["id"]] = "revisao"
    for t in escolha["apoio"]:
        papeis.setdefault(t["id"], "apoio")
    validos = {t["id"] for t in load_curriculo()}
    for tid in dict.fromkeys([ep.get("topico_id")] + list(ep.get("topicos_extra") or [])):
        if tid in validos:
            uso.setdefault("usos", {}).setdefault(tid, []).append(
                {"data": hoje.isoformat(), "episodio": ep["id"], "papel": papeis.get(tid, "apoio")})


def proximo_dia_de_postagem(hoje: dt.date) -> dt.date:
    d = hoje + dt.timedelta(days=1)
    while d.weekday() not in GRADE:
        d += dt.timedelta(days=1)
    return d


def pendencia_da_serie(serie: dict, hoje: dt.date) -> dict | None:
    """Promessa em aberto mais antiga cujo dia de cumprir já chegou."""
    abertas = [p for p in serie.get("pendentes", []) if dt.date.fromisoformat(p["cumprir_em"]) <= hoje]
    return sorted(abertas, key=lambda p: p["cumprir_em"])[0] if abertas else None


# ---------------------------------------------------------------- radar
def load_radar() -> dict:
    """Radar v2 mais recente. Só lê as seções já filtradas (hype_seguro, evento_do_dia, duvidas_em_alta);
    a lista crua de tendências e a seção 'descartados' nunca entram no prompt."""
    files = sorted((ROOT / "radar").glob("20??-??-??.json"))
    radar = json.loads(files[-1].read_text()) if files else {}
    if radar.get("version") != 2:  # radar antigo = lista crua sem filtro de segurança: não usar
        return {"hype_seguro": [], "evento_do_dia": {}, "duvidas_em_alta": []}
    return radar


def hype_seguro(radar: dict) -> list[dict]:
    descartados = {d["termo"].lower() for d in radar.get("descartados", [])}
    return [h for h in radar.get("hype_seguro", []) if h["termo"].lower() not in descartados]


def duvidas_adultas(radar: dict) -> list[str]:
    """Trava de conteúdo infantil: ignora dúvidas marcadas `infantil` pelo radar. Radar antigo (sem a marca) passa
    pelo mesmo detector aqui."""
    try:
        from radar import cara_de_infantil
    except Exception:  # radar.py indisponível: confia só na marca
        def cara_de_infantil(*_):
            return False
    out = []
    for r in radar.get("duvidas_em_alta", []):
        infantil = r.get("infantil")
        if infantil is None:
            infantil = cara_de_infantil(r.get("query", ""), (r.get("top") or {}).get("title", ""))
        if not infantil:
            out.append(r["query"])
    return out


def fmt_eventos(ev: dict) -> str:
    linhas = [f"- HOJE: {e['evento']} -> aula sugerida: {e['tema_aula']}" for e in ev.get("hoje", []) if e.get("seguro")]
    linhas += [f"- em {e['faltam_dias']} dia(s): {e['evento']} -> aula sugerida: {e['tema_aula']}"
               for e in ev.get("preparar", []) if e.get("seguro")]
    return "\n".join(linhas) or "nenhum"


# ---------------------------------------------------------------- validadores (determinísticos, sem custo)
PT_WPS_GANCHO = 2.6          # estimativa do manual de retenção para "1ª pergunta até 2 s"
LIMITE_Q1_S = 2.3            # "até ~2 s": 2,0 s + folga de 15% da estimativa
# Duração: calibrado com o Kokoro nos timings reais do ep. 003 (fala = base + palavras/taxa) + pausas do tts/template.
SEG_BASE = {"pt": 0.40, "en": 0.50}
SEG_WPS = {"pt": 3.4, "en": 3.5}
GAP_S, BREATH_S = 0.12, 0.15  # tts.py GAP_SECONDS e Episode.tsx BREATH

PCT_RE = re.compile(r"\d+(?:[.,]\d+)?\s?%|\bpor\s?cento\b", re.I)
PROMESSA_RE = re.compile(r"\bamanh[ãa]\b|\bparte\s+(?:2|dois|ii)\b|\bpr[óo]xim[oa]\s+(?:v[íi]deo|epis[óo]dio|parte)\b", re.I)
DIGITO_RE = re.compile(r"\d")
WORD_RE = re.compile(r"[A-Za-zÀ-ÿ]+(?:'[A-Za-z]+)?")

# Inglês comum que nunca é palavra portuguesa (grafia sem acento). Somado às palavras dos exemplos do currículo.
EN_COMUNS = set("""
the is are was were be been being am i'm you're he's she's it's we're they're i've you've we've they've i'd i'll
you'll don't doesn't didn't can't won't isn't aren't wasn't weren't let's that's there's what's
you he she it we they my your his her its our their this that these those what where when why how who which whose
and or but with without from to of in on at by about into over after before because if than then
have has had having get gets got getting make makes made making take took taken go goes went gone going
came say says said tell tells told know knew think thought want wants wanted like likes liked love loves loved
need needs see saw seen look looks looking forward watch watched watching play played playing work works worked
live lives lived living leave leaves left will would could should can may might must not yes very really
just also only too here there now today yesterday tomorrow always never sometimes sorry please thanks thank
hello sure well good great nice bad fine happy sad tired hungry thirsty sleepy cold hot big small old new young
people friend friends family parents relatives brother sister mom dad boss job money day night week year years
home house school college library bookstore mall store water coffee food beer party trip movie check
pretend pretended actually currently nowadays eventually occasionally realize realized achieve assist assisted
argue argued agree borrow lend depends depend married doubt question questions mistake mistakes fun funny bored boring
sensible sensitive exquisite weird sympathetic deception disappointment since ago used stop stopped smoking suggest
despite spite heavy traffic rain raining blame arm leg hard hardly gonna wanna gotta broke break up down out off
present perfect past simple continuous tense verb verbs phrasal false friend english speak spoken ask asked answer
explain explained say sorry excuse me way right wrong because thing something nothing everything everybody anybody
""".split())
# Palavras que também são português (come = comer, late = latir, for = ir...) ou empréstimos lidos em PT
# (shopping, show, site...) — nunca contam como inglês solto.
PT_HOMOGRAFOS = set("""
a as o os e i do no nos me se for come time real late bar top ok okay show site game games online shopping fan total
normal social hotel legal mal pop rock net sale pro pra tem test mais nada dia via era sofa ate grande prove fake crush
hobby internet email playlist spoiler delivery vale pane fina fino gel gol gas sim um uma de da
""".split())


def _palavras_en_do_curriculo(cur: list[dict]) -> set[str]:
    """Tokens dos exemplo_en (sempre inglês), menos nomes próprios e palavras que aparecem nas traduções PT."""
    pt = {w.lower() for t in cur for w in WORD_RE.findall(t["traducao"])}
    out = set()
    for t in cur:
        for i, w in enumerate(WORD_RE.findall(t["exemplo_en"])):
            if (i > 0 and w[0].isupper() and w != "I") or not w.isascii():
                continue
            out.add(w.lower())
        out |= {w.lower() for w in t["palavras_pronuncia"]}
    return out - pt


def vocab_en(cur: list[dict], topicos: list[dict] | None = None) -> set[str]:
    base = EN_COMUNS | _palavras_en_do_curriculo(cur)
    for t in topicos or cur:
        base |= {w.lower() for w in t.get("palavras_pronuncia", [])}
    return {w for w in base if len(w) > 1 and w not in PT_HOMOGRAFOS}


def falas(scene: dict) -> list[dict]:
    return list(scene.get("speech") or []) + list(scene.get("revealSpeech") or [])


def n_palavras(texto: str) -> int:
    """Palavras 'de verdade' (ignora emoji, reticências e pontuação solta)."""
    return len([w for w in texto.split() if re.search(r"[0-9A-Za-zÀ-ÿ]", w)])


def estimar_fala(segs: list[dict]) -> float:
    return sum(SEG_BASE[s["lang"]] + n_palavras(s["text"]) / SEG_WPS[s["lang"]] + GAP_S for s in segs)


def estimar_duracao(ep: dict) -> float:
    return sum(estimar_fala(s.get("speech") or []) + (s.get("timerSeconds") or 0)
               + estimar_fala(s.get("revealSpeech") or []) + BREATH_S for s in ep["scenes"])


def inicio_primeira_pergunta(ep: dict) -> float | None:
    t = 0.0
    for s in ep["scenes"]:
        if s.get("options"):
            return t
        t += sum(n_palavras(x["text"]) for x in s.get("speech") or []) / PT_WPS_GANCHO
    return None


def textos(ep: dict) -> list[tuple[str, str]]:
    """(onde, texto) de tudo que vira tela, fala ou post."""
    out = [("título do post", ep.get("title") or ""), ("pinnedComment", ep.get("pinnedComment") or "")]
    for i, s in enumerate(ep["scenes"]):
        for campo in ("title", "subtitle", "rehook", "example", "translation"):
            if s.get(campo):
                out.append((f"cena {i} {campo}", s[campo]))
        out += [(f"cena {i} fala {x['lang']}", x["text"]) for x in falas(s)]
        out += [(f"cena {i} opção", o) for o in s.get("options") or []]
    return out


def validar(ep: dict, quadro: str | None, vocab: set[str], pendencia: dict | None = None) -> list[str]:
    """Lista de problemas (vazia = aprovado). Regras de retencao-psicologia.md 3.4 + didatica-linguistica.md 3.4."""
    erros: list[str] = []
    cenas = ep.get("scenes") or []
    if not cenas or cenas[0].get("type") != "hook":
        erros.append("estrutura: a 1ª cena precisa ser type=hook")
    if not cenas or cenas[-1].get("type") != "cta":
        erros.append("estrutura: a última cena precisa ser type=cta")
    if not cenas:
        return erros

    hook = cenas[0]
    n_hook = sum(n_palavras(x["text"]) for x in hook.get("speech") or [])
    if n_hook > 8:
        erros.append(f"gancho: {n_hook} palavras faladas (máx. 8)")
    n_tit = n_palavras(hook.get("title") or "")
    if n_tit > 6:
        erros.append(f"gancho: título na tela com {n_tit} palavras (máx. 6): \"{hook.get('title')}\"")
    q1 = inicio_primeira_pergunta(ep)
    if q1 is None:
        erros.append("estrutura: nenhuma pergunta (cena com options)")
    elif q1 > LIMITE_Q1_S:
        erros.append(f"1ª pergunta começa em ~{q1:.1f} s (máx. ~2 s; a {PT_WPS_GANCHO} palavras/s) — encurte o gancho falado")

    fonte = ep.get("source") or any(s.get("source") for s in cenas)
    for onde, txt in textos(ep):
        if PCT_RE.search(txt) and not fonte:
            erros.append(f"porcentagem sem campo source ({onde}): \"{txt}\"")
        if PROMESSA_RE.search(txt) and not ep.get("nextEpisodeId"):
            erros.append(f"promessa de continuação sem nextEpisodeId ({onde}): \"{txt}\"")

    for i, s in enumerate(cenas):
        opts = s.get("options")
        if opts is not None:
            if not 2 <= len(opts) <= 4:
                erros.append(f"cena {i}: {len(opts)} opções (use 2–4)")
            if s.get("answer") is not None and s["answer"] not in range(len(opts)):
                erros.append(f"cena {i}: answer {s['answer']} fora das opções")
            if s.get("answer") is None and quadro != "capi-errou":
                erros.append(f"cena {i}: pergunta sem answer (só o capi-errou deixa sem resposta)")
            proxima_revela = i + 1 < len(cenas) and cenas[i + 1].get("type") == "reveal"
            if s.get("answer") is not None and not s.get("revealSpeech") and not proxima_revela:
                erros.append(f"cena {i}: revelação sem fala (precisa da forma certa + porquê)")
        for x in falas(s):
            if DIGITO_RE.search(x["text"]):
                erros.append(f"cena {i}: número em algarismo na fala ({x['text']!r}) — escreva por extenso")
            if x["lang"] == "pt":
                achadas = [w for w in WORD_RE.findall(x["text"]) if w.lower() in vocab]
                if achadas:
                    erros.append(f"cena {i}: inglês dentro de fala pt {achadas} em \"{x['text']}\" — mover para fala en separada")
            if n_palavras(x["text"]) > 14:
                erros.append(f"cena {i}: fala com {n_palavras(x['text'])} palavras (máx. 14)")

    n_cta = sum(n_palavras(x["text"]) for x in cenas[-1].get("speech") or []) if cenas[-1].get("type") == "cta" else 0
    if n_cta > 12:
        erros.append(f"CTA com {n_cta} palavras faladas (máx. 12)")

    lo, hi = DURACAO.get(quadro or "", DURACAO_CURTA)
    dur = estimar_duracao(ep)
    if not lo <= dur <= hi:
        erros.append(f"duração estimada {dur:.1f} s fora de {lo}–{hi} s")

    if ep.get("answerTomorrow") and not ep.get("nextEpisodeId"):
        erros.append("answerTomorrow sem nextEpisodeId")
    if pendencia:
        antes_cta = [s for s in cenas[1:-1] if s.get("type") == "reveal"]
        if not antes_cta:
            erros.append("série: faltou a cena type=reveal 'Resposta de ontem' antes do CTA (pendência de "
                         f"{pendencia['de']})")
    return erros


# ---------------------------------------------------------------- prompts
def fmt_topico(t: dict, papel: str) -> str:
    return (f"[{papel}] {t['id']} ({t['nivel']}, {t['categoria']}) — {t['alvo']}\n"
            f"  erro_do_brasileiro: {t['erro_do_brasileiro']}\n  forma_certa: {t['forma_certa']}\n"
            f"  regra_curta: {t['regra_curta']}\n  exemplo_en: {t['exemplo_en']} = {t['traducao']}\n"
            f"  palavras_pronuncia: {', '.join(t['palavras_pronuncia']) or '-'}")


def montar_system(quadro: str) -> str:
    lo, hi = DURACAO.get(quadro, DURACAO_CURTA)
    ordem = [quadro] + [q for q in MODELOS if q != quadro] if quadro in MODELOS else list(MODELOS)
    exemplos = "\n".join(f'<exemplo quadro="{q}">\n{json.dumps(MODELOS[q], ensure_ascii=False)}\n</exemplo>' for q in ordem)
    extra = f"\n\n{TIKTOK_NATIVO}" if quadro in DURACAO else ""  # quadros com duração própria = versão TikTok
    return (f"{PERSONAGEM}\n\n{REGRAS}\n\n{GATILHOS}{extra}\nDuração-alvo deste quadro: {lo}–{hi} s. A duração é conferida por código "
            "(fala + timer + revelação); roteiro fora da faixa volta para você.\n\n"
            "Roteiros-modelo abaixo: copie ritmo, tamanho de fala, tipo de piada e a separação pt/en; NUNCA copie as "
            f"perguntas nem os temas (o conteúdo vem do currículo).\n{exemplos}")


def montar_prompt(quadro: str, hoje: dt.date, escolha: dict, radar: dict, pendencia: dict | None,
                  recentes: list[str]) -> str:
    ev = radar.get("evento_do_dia", {})
    hype = hype_seguro(radar)
    trends = "\n".join(f"- {h['termo']} (contexto: {h.get('contexto') or 's/ manchete'}; ideia: {h['sugestao_aula']})"
                       for h in hype[:10])
    if ev.get("block_hype"):
        trends = "BLOQUEADO HOJE (dia de eleição): não use nenhum assunto em alta; faça um tema atemporal e neutro."
    topicos = [fmt_topico(escolha["alvo"], "ALVO")]
    if escolha["revisao"]:
        topicos.append(fmt_topico(escolha["revisao"], "REVISÃO — já ensinado; use como pergunta fácil (nível 1 ou 2) "
                                                        "ou reforço rápido"))
    topicos += [fmt_topico(t, "APOIO") for t in escolha["apoio"]]
    serie = "nenhuma"
    if pendencia:
        a = pendencia["answerTomorrow"]
        serie = (f"PROMESSA DO EPISÓDIO {pendencia['de']} (cumprir HOJE): insira, ANTES do CTA, uma cena type=reveal de "
                 f"≤ 4 s: 'Resposta de ontem: {'ABCD'[a['wrong']]}.' + a correção em fala en ({a['correction']}) + o porquê "
                 f"em 1 linha ({a['why']}). Pegadinha: {a['trap']}")
    return (
        f"Data: {hoje.isoformat()}. Crie o episódio do quadro '{quadro}'.\n\n"
        f"Formato do quadro: {QUADROS[quadro]}\n\n"
        "CURRÍCULO — fonte da verdade do conteúdo linguístico (use SÓ estes tópicos nas perguntas):\n"
        + "\n".join(topicos) + "\n\n"
        f"Memória de série: {serie}\n\n"
        f"Evento do calendário (pode virar cenário do tópico):\n{fmt_eventos(ev)}\n"
        f"Assuntos em alta hoje no Brasil (já filtrados por segurança; use como cenário/piada se combinar):\n"
        f"{trends or 'nenhum'}\n"
        f"Dúvidas de inglês mais buscadas (YouTube, sem as infantis): {', '.join(duvidas_adultas(radar)[:15]) or 'nenhuma'}\n"
        f"Episódios recentes (não repetir cenário/piada): {', '.join(recentes) or 'nenhum'}"
    )


def load_radar_semanal() -> dict:
    files = sorted((ROOT / "radar").glob("semana-20??-W??.json"))
    return json.loads(files[-1].read_text()) if files else {}


def contexto(faixa: str, radar: dict, semanal: dict) -> dict:
    """Escolhe o contexto de tendência do vídeo. faixa = 'esquete' | 'episodio'."""
    ev = radar.get("evento_do_dia", {})
    if ev.get("block_hype"):
        return {"tipo": "nenhum", "motivo": "dia de bloqueio (eleição): tema atemporal"}
    if faixa == "esquete":
        hype = hype_seguro(radar)
        if hype:
            h = hype[0]
            return {"tipo": "hype-do-dia", "termo": h["termo"], "detalhe": h.get("contexto") or "",
                    "ideia": h.get("sugestao_aula") or ""}
    else:
        t = semanal.get("tema_da_semana")
        if t:
            return {"tipo": "tema-da-semana", "termo": t["termo"], "detalhe": t.get("contexto") or "",
                    "ideia": t.get("sugestao_aula") or "", "dias": t["dias"]}
        cal = semanal.get("calendario_proxima_semana") or []
        cal = [e for e in cal if e.get("seguro", True) and not e.get("block_hype")]
        if cal:
            return {"tipo": "calendario", "termo": cal[0]["evento"], "detalhe": cal[0].get("tema_aula") or "",
                    "ideia": ", ".join(cal[0].get("ganchos_ingles") or [])}
    evs = [e for e in ev.get("hoje", []) + ev.get("preparar", []) if e.get("seguro", True)]
    if evs:
        return {"tipo": "calendario", "termo": evs[0]["evento"], "detalhe": evs[0].get("tema_aula") or "",
                "ideia": ", ".join(evs[0].get("ganchos_ingles") or [])}
    return {"tipo": "nenhum", "motivo": "sem hype seguro nem calendário: tema atemporal"}


CONTEXTUALIZA = {
    "type": "object", "additionalProperties": False, "required": ["usou", "alteracoes", "textoTela", "legenda"],
    "properties": {
        "usou": {"type": "boolean"},
        "alteracoes": {"type": "array", "items": {
            "type": "object", "additionalProperties": False, "required": ["bloco", "indice", "text"],
            "properties": {"bloco": {"type": "string", "enum": ["cena", "volta"]}, "indice": {"type": "integer"},
                           "text": {"type": "string"}}}},
        "textoTela": {"type": "string"}, "legenda": {"type": "string"},
    },
}


def contextualizar(client, ep: dict, ctx: dict) -> dict:
    """Reescreve até MAX_FALAS_CONTEXTO falas em PORTUGUÊS de cena/volta com o contexto. Inglês e lição intocados."""
    if ctx["tipo"] == "nenhum":
        return {**ep, "contexto": ctx}
    linhas = [f"{b}[{i}] {x.get('speaker', 'capi')} ({x['lang']}): {x['text']}"
              for b in ("cena", "volta") for i, x in enumerate(ep[b]["passos"])]
    system = f"{PERSONAGEM}\n\n{REGRA_CONTEXTO}"
    prompt = (f"Episódio {ep.get('serie', {}).get('codigo', ep['id'])} — objetivo: {ep.get('canDo', '')}\n"
              f"CONTEXTO ({ctx['tipo']}): {ctx['termo']} — {ctx.get('detalhe', '')} (ideia: {ctx.get('ideia', '')})\n\n"
              f"Falas atuais:\n" + "\n".join(linhas) + "\n\n"
              f"Reescreva no máximo {MAX_FALAS_CONTEXTO} falas com lang=pt (NUNCA as en) para amarrar o contexto, mantendo "
              "o mesmo tamanho (±3 palavras) e a mesma função na cena. Dê também textoTela (≤ 6 palavras) e legenda do post "
              "(1 frase, minúscula). Se não couber, usou=false e alteracoes=[].")
    r = ask(client, system, prompt, CONTEXTUALIZA)
    novo = json.loads(json.dumps(ep))
    feitas = 0
    for a in r["alteracoes"]:
        passos = novo.get(a["bloco"], {}).get("passos", [])
        if 0 <= a["indice"] < len(passos) and passos[a["indice"]]["lang"] == "pt" and feitas < MAX_FALAS_CONTEXTO:
            if abs(n_palavras(a["text"]) - n_palavras(passos[a["indice"]]["text"])) <= 3:
                passos[a["indice"]]["text"] = a["text"]
                feitas += 1
    novo["contexto"] = {**ctx, "usou": r["usou"] and feitas > 0, "falas": feitas,
                        "textoTela": r["textoTela"], "legenda": r["legenda"]}
    return novo


# ---------------------------------------------------------------- API
def ask(client, system: str, prompt: str, schema: dict) -> dict:
    response = client.beta.messages.create(
        model=MODEL,
        max_tokens=16000,
        betas=["server-side-fallback-2026-07-01"],
        fallbacks="default",
        system=system,
        messages=[{"role": "user", "content": prompt}],
        output_config={"effort": "medium", "format": {"type": "json_schema", "schema": schema}},
    )
    if response.stop_reason == "refusal":
        raise RuntimeError(f"recusado: {response.stop_details}")
    text = next(b.text for b in response.content if b.type == "text")
    u = response.usage
    print(f"  tokens: in={u.input_tokens} out={u.output_tokens}")
    return json.loads(text)


def clean(episode: dict) -> dict:
    """Remove campos nulos para o formato que o Remotion espera."""
    episode["scenes"] = [{k: v for k, v in s.items() if v is not None} for s in episode["scenes"]]
    return {k: v for k, v in episode.items() if v is not None}


def id_do_dia(hoje: dt.date, quadro: str) -> str:
    base = f"{hoje.isoformat()}-{quadro}"
    n, eid = 2, base
    while (ROOT / "episodes" / f"{eid}.json").exists():
        eid, n = f"{base}-{n}", n + 1
    return eid


def completar(draft: dict, eid: str, quadro: str, hoje: dt.date, escolha: dict) -> dict:
    """Campos que o código decide (a IA não inventa id, nível nem episódio seguinte)."""
    ep = {"id": eid, "format": quadro, "nivel": escolha["alvo"]["nivel"], **clean(draft)}
    if ep.get("answerTomorrow"):
        prox = proximo_dia_de_postagem(hoje)
        ep["nextEpisodeId"] = f"{prox.isoformat()}-{GRADE[prox.weekday()]}"
    return ep


# ---------------------------------------------------------------- CLI
def validar_arquivos(paths: list[str]) -> int:
    cur = load_curriculo()
    vocab = vocab_en(cur)
    falhas = 0
    for p in paths:
        ep = json.loads(Path(p).read_text())
        quadro = ep.get("format")
        erros = validar(ep, quadro, vocab)
        status = "REPROVADO" if erros else "APROVADO"
        print(f"\n== {Path(p).name}  [{status}]  (duração estimada {estimar_duracao(ep):.1f} s, "
              f"1ª pergunta em ~{(inicio_primeira_pergunta(ep) or 0):.1f} s)")
        for e in erros:
            print(f"  - {e}")
        falhas += bool(erros)
    return 1 if falhas else 0


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--quadro", choices=list(QUADROS))
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--data", help="AAAA-MM-DD (simula outra data)")
    ap.add_argument("--validar", nargs="+", metavar="EPISODIO.json", help="só roda os validadores")
    ap.add_argument("--contexto", choices=["esquete", "episodio"], help="só mostra o contexto de tendência escolhido")
    ap.add_argument("--contextualizar", metavar="EPISODIO.json",
                    help="amarra o tema da semana num episódio-lição pronto (falas pt; lição intocada)")
    args = ap.parse_args()

    if args.contexto:
        print(json.dumps(contexto(args.contexto, load_radar(), load_radar_semanal()), ensure_ascii=False, indent=2))
        return
    if args.contextualizar:
        import anthropic
        path = Path(args.contextualizar)
        ep = json.loads(path.read_text())
        ctx = contexto("episodio", load_radar(), load_radar_semanal())
        novo = contextualizar(anthropic.Anthropic(), ep, ctx)
        en_antes = [x["text"] for b in ("cena", "volta") for x in ep[b]["passos"] if x["lang"] == "en"]
        en_depois = [x["text"] for b in ("cena", "volta") for x in novo[b]["passos"] if x["lang"] == "en"]
        assert en_antes == en_depois and ep.get("licao") == novo.get("licao"), "contexto mexeu na lição: descartado"
        path.write_text(json.dumps(novo, ensure_ascii=False, indent=2))
        print(f"ok: {path.name} · contexto {ctx['tipo']}: {ctx.get('termo', '-')} · falas trocadas: {novo['contexto'].get('falas', 0)}")
        return

    if args.validar:
        sys.exit(validar_arquivos(args.validar))

    hoje = dt.date.fromisoformat(args.data) if args.data else dt.date.today()
    if not args.quadro and hoje.weekday() not in GRADE:
        print("Domingo: dia do vídeo longo, sem Short do roteirista. Use --quadro para forçar um quadro.")
        sys.exit(0)
    quadro = args.quadro or GRADE[hoje.weekday()]

    cur = load_curriculo()
    uso = load_json(USO, {"usos": {}})
    serie = load_json(SERIE, {"pendentes": [], "cumpridas": []})
    radar = load_radar()
    escolha = escolher_topicos(quadro, hoje, cur, uso)
    pendencia = pendencia_da_serie(serie, hoje)
    recentes = sorted(p.stem for p in (ROOT / "episodes").glob("*.json"))[-20:]
    eid = pendencia["nextEpisodeId"] if pendencia else id_do_dia(hoje, quadro)
    vocab = vocab_en(cur, [escolha["alvo"]] + escolha["apoio"] + ([escolha["revisao"]] if escolha["revisao"] else []))

    system = montar_system(quadro)
    prompt = montar_prompt(quadro, hoje, escolha, radar, pendencia, recentes)
    print(f"quadro: {quadro} · id: {eid} · faixa do ciclo: {escolha['faixa']}")
    print(f"alvo: {escolha['alvo']['id']} ({escolha['alvo']['alvo']}) · revisão: "
          f"{escolha['revisao']['id'] if escolha['revisao'] else '-'} · apoio: {[t['id'] for t in escolha['apoio']]}")
    if args.dry_run:
        print("\n===== SYSTEM =====\n" + system + "\n\n===== PROMPT =====\n" + prompt)
        return

    import anthropic
    client = anthropic.Anthropic()
    problemas: list[str] = []
    draft = ep = None
    for tentativa in range(1 + MAX_RETRIES):
        p = prompt
        if problemas:
            p += ("\n\nA versão anterior foi REPROVADA. Corrija exatamente isto e mantenha o resto (piadas incluídas):\n"
                  + "\n".join(f"- {x}" for x in problemas)
                  + f"\n\nVersão anterior:\n{json.dumps(draft, ensure_ascii=False)}")
        print(f"roteiro ({quadro}), tentativa {tentativa + 1}/{1 + MAX_RETRIES}...")
        draft = ask(client, system, p, EPISODE)
        ep = completar(draft, eid, quadro, hoje, escolha)
        problemas = validar(ep, quadro, vocab, pendencia)
        if problemas:
            print("  validadores reprovaram:\n" + "\n".join(f"    - {x}" for x in problemas))
            continue
        print("  revisor (juiz)...")
        gabarito = "\n".join(fmt_topico(t, "gabarito") for t in
                             [escolha["alvo"]] + escolha["apoio"] + ([escolha["revisao"]] if escolha["revisao"] else []))
        veredito = ask(client, REVISOR,
                       f"Quadro: {quadro}\n\nTópicos do currículo (gabarito):\n{gabarito}\n\n"
                       f"Episódio:\n{json.dumps(ep, ensure_ascii=False)}", VEREDITO)
        if veredito["aprovado"] and not veredito["problemas"]:
            break
        problemas = [f"revisor: {x}" for x in veredito["problemas"]] or ["revisor reprovou sem detalhar"]
        print("  revisor reprovou:\n" + "\n".join(f"    - {x}" for x in problemas))

    if problemas:
        fila = ROOT / "episodes" / "_reprovados"
        fila.mkdir(exist_ok=True)
        save_json(fila / f"{eid}.json", {**ep, "_problemas": problemas})
        print(f"REPROVADO após {1 + MAX_RETRIES} tentativas -> {(fila / f'{eid}.json').relative_to(ROOT)} (aprovação manual)")
        sys.exit(1)

    out = ROOT / "episodes" / f"{eid}.json"
    save_json(out, ep)
    registrar_uso(uso, ep, hoje, escolha)
    save_json(USO, uso)
    if pendencia:
        serie["pendentes"] = [x for x in serie["pendentes"] if x is not pendencia and x["de"] != pendencia["de"]]
        serie.setdefault("cumpridas", []).append({**pendencia, "cumprida_em": eid})
    if ep.get("answerTomorrow"):
        serie.setdefault("pendentes", []).append({
            "de": eid, "nextEpisodeId": ep["nextEpisodeId"], "cumprir_em": ep["nextEpisodeId"][:10],
            "answerTomorrow": ep["answerTomorrow"],
        })
    save_json(SERIE, serie)
    print(f"ok: {out.relative_to(ROOT)} (duração estimada {estimar_duracao(ep):.1f} s)")


if __name__ == "__main__":
    main()
