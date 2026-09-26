"""Roteirista automático: radar do dia + quadro da grade -> episódio JSON pronto para scripts/make.sh.

Uso:
  .venv/bin/python scripts/roteirista.py                 # quadro do dia pela grade semanal
  .venv/bin/python scripts/roteirista.py --quadro nivel  # força um quadro
  .venv/bin/python scripts/roteirista.py --dry-run       # só mostra o prompt (sem chamar a API)
Requer ANTHROPIC_API_KEY (ou `ant auth login`).

Duas passadas: (1) roteirista cria o episódio; (2) "professor nativo" revisa inglês, fatos e duração
e devolve a versão corrigida. Só a versão revisada é salva.
"""
import argparse
import datetime as dt
import json
import sys
from pathlib import Path

import anthropic

ROOT = Path(__file__).resolve().parent.parent
MODEL = "claude-opus-5"

# Grade semanal (0 = segunda). Domingo (6) fica de fora: é o dia do vídeo longo, sem Short do roteirista.
GRADE = {0: "nivel", 1: "voce-sabia", 2: "capi-errou", 3: "br-vs-nativo", 4: "hype", 5: "pegadinha"}

QUADROS = {
    "nivel": "Nível 1→5: 5 perguntas de dificuldade crescente (type=question com level 1..5, 2 opções, timerSeconds=3). "
             "Hook com desafio ('só X% chegam no nível 5' — use 'poucos', nunca invente porcentagem). CTA pedindo o placar nos comentários.",
    "voce-sabia": "Você sabia?: 1 curiosidade REAL e verificável sobre uma palavra/expressão em inglês (origem, uso curioso), "
                  "depois 1 pergunta (type=question) testando o que foi ensinado, e um exemplo de uso.",
    "capi-errou": "Capi errou, corrige aí: Capi afirma com confiança total uma frase ERRADA comum de brasileiro. "
                  "Pergunta 'qual o erro?'. NÃO revele a resposta: o CTA manda comentar e diz que a resposta sai amanhã.",
    "br-vs-nativo": "Brasileiro vs Nativo: 3 situações; em cada uma, como o brasileiro fala (tradução literal) × como o nativo fala. "
                    "Use type=example com example=frase nativa e translation='🇧🇷 jeito brasileiro: ...'.",
    "hype": "Hype em inglês: use UM assunto em alta de hoje (lista abaixo) que tenha a ver com o Brasil/cultura pop. "
            "Ensine 2–3 palavras/expressões em inglês ligadas ao assunto + 1 pergunta. Nada de política, tragédia ou crime.",
    "pegadinha": "Pegadinha (falso amigo): 3 falsos cognatos (ex.: pretend ≠ pretender). Cada um vira uma question com 2 opções.",
}

PERSONAGEM = (
    "Capi é uma capivara brasileira, professora de inglês do canal Capi Lingo. Zen por fora, dramática por dentro: "
    "calma absurda que desmorona quando alguém erra inglês. Bordões: 'Calma... respira... ERROU.' e "
    "'Capivara não julga. Capivara corrige.' Humor adulto-leve (trabalho, viagem, namoro, memes), nunca infantil. "
    "Público: brasileiros adultos aprendendo inglês."
)

REGRAS = (
    "Regras: vídeo vertical de 30–45 s. Primeira cena type=hook com gancho forte em até 8 palavras. Última cena type=cta. "
    "Falas curtas (máx. 20 palavras por fala). Falas em português usam lang='pt'; frases em inglês usam lang='en' "
    "e são SEMPRE ditas separadamente para a pronúncia sair correta. Números por extenso nas falas ('vinte', não '20'). "
    "Inglês 100% correto e natural (americano). Nada de fatos inventados. Nada de marcas/personagens de terceiros no visual."
)

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
        "level": {"type": ["integer", "null"]},
        "options": {"type": ["array", "null"], "items": {"type": "string"}},
        "answer": {"type": ["integer", "null"]},
        "timerSeconds": {"type": ["integer", "null"]},
        "example": {"type": ["string", "null"]},
        "translation": {"type": ["string", "null"]},
        "speech": SPEECH,
        "revealSpeech": {"anyOf": [SPEECH, {"type": "null"}]},
    },
    "required": ["type", "title", "subtitle", "level", "options", "answer", "timerSeconds",
                 "example", "translation", "speech", "revealSpeech"],
    "additionalProperties": False,
}
EPISODE = {
    "type": "object",
    "properties": {
        "id": {"type": "string", "description": "slug curto: AAAA-MM-DD-quadro-tema"},
        "format": {"type": "string"},
        "topic": {"type": "string"},
        "title": {"type": "string", "description": "título do post (máx. 60 caracteres, com gancho)"},
        "hashtags": {"type": "array", "items": {"type": "string"}},
        "scenes": {"type": "array", "items": SCENE},
    },
    "required": ["id", "format", "topic", "title", "hashtags", "scenes"],
    "additionalProperties": False,
}
REVIEW = {
    "type": "object",
    "properties": {
        "problems_found": {"type": "array", "items": {"type": "string"}},
        "episode": EPISODE,
    },
    "required": ["problems_found", "episode"],
    "additionalProperties": False,
}


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


def fmt_eventos(ev: dict) -> str:
    linhas = [f"- HOJE: {e['evento']} -> aula sugerida: {e['tema_aula']}" for e in ev.get("hoje", []) if e.get("seguro")]
    linhas += [f"- em {e['faltam_dias']} dia(s): {e['evento']} -> aula sugerida: {e['tema_aula']}"
               for e in ev.get("preparar", []) if e.get("seguro")]
    return "\n".join(linhas) or "nenhum"


def ask(client: anthropic.Anthropic, system: str, prompt: str, schema: dict) -> dict:
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
    return episode


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--quadro", choices=list(QUADROS))
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    today = dt.date.today()
    if not args.quadro and today.weekday() not in GRADE:
        print("Domingo: dia do vídeo longo, sem Short do roteirista. Use --quadro para forçar um quadro.")
        sys.exit(0)
    quadro = args.quadro or GRADE[today.weekday()]
    radar = load_radar()
    ev = radar.get("evento_do_dia", {})
    hype = hype_seguro(radar)
    trends = "\n".join(f"- {h['termo']} (contexto: {h.get('contexto') or 's/ manchete'}; ideia: {h['sugestao_aula']})"
                        for h in hype[:10])
    if ev.get("block_hype"):
        trends = "BLOQUEADO HOJE (dia de eleição): não use nenhum assunto em alta; faça um tema atemporal e neutro."
    duvidas = [r["query"] for r in radar.get("duvidas_em_alta", [])[:15]]
    recentes = sorted(p.stem for p in (ROOT / "episodes").glob("*.json"))[-20:]

    system = f"{PERSONAGEM}\n\n{REGRAS}"
    prompt = (
        f"Data: {today.isoformat()}. Crie o episódio do quadro '{quadro}'.\n\n"
        f"Formato do quadro: {QUADROS[quadro]}\n\n"
        f"Evento do calendário (prioridade como tema do dia):\n{fmt_eventos(ev)}\n"
        f"Assuntos em alta hoje no Brasil (já filtrados por segurança):\n{trends or 'nenhum'}\n"
        f"Dúvidas de inglês mais buscadas (YouTube): {', '.join(duvidas) or 'nenhuma'}\n"
        f"Episódios recentes (não repetir tema): {', '.join(recentes) or 'nenhum'}\n\n"
        "Se algum assunto em alta combinar naturalmente com o quadro, use-o como gancho; se não, ignore."
    )
    if args.dry_run:
        print(system, "\n\n", prompt)
        return

    client = anthropic.Anthropic()
    print(f"1/2 roteiro ({quadro})...")
    draft = ask(client, system, prompt, EPISODE)
    print("2/2 revisão de professor nativo...")
    review = ask(
        client,
        "Você é professor(a) nativo(a) de inglês americano e editor(a) de vídeos curtos. Revise com rigor.",
        "Revise este episódio: (1) inglês correto e natural, (2) resposta marcada em 'answer' é de fato a certa, "
        "(3) fatos verdadeiros, (4) falas curtas e dentro de 30–45 s, (5) regras abaixo. Liste os problemas e devolva "
        f"o episódio corrigido (ou igual, se estiver perfeito).\n\nRegras: {REGRAS}\n\nEpisódio:\n{json.dumps(draft, ensure_ascii=False)}",
        REVIEW,
    )
    for p in review["problems_found"]:
        print(f"  corrigido: {p}")
    episode = clean(review["episode"])
    out = ROOT / "episodes" / f"{episode['id']}.json"
    out.write_text(json.dumps(episode, ensure_ascii=False, indent=2))
    print(f"ok: {out.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
