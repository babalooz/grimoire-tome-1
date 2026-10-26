#!/usr/bin/env python3
"""Radar do canal de notícias: as notícias leves/curiosas do dia, já filtradas.

Uso:
  python3 canal-noticias/scripts/radar.py          -> gera canal-noticias/radar/AAAA-MM-DD.md + .json
  python3 canal-noticias/scripts/radar.py --top 8  -> quantas pautas sair (padrão 5)

Sem chave de API. Fontes (grátis):
  - Google Notícias RSS (busca das últimas 24h por palavras de "notícia curiosa")
  - Google Trends RSS BR: pauta que bate com um termo em alta ganha bônus

Filtro de segurança: o mesmo do CapyFala (canal-idiomas/scripts/radar.py) — sem política, crime,
violência, morte, saúde grave, drogas, sexo e apostas. Bloqueado vai para "descartados" com o motivo.
"""
import argparse
import datetime as dt
import html
import json
import re
import sys
import urllib.parse
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT.parent / "canal-idiomas" / "scripts"))
from radar import fonte_trends, get, motivo_bloqueio, norm, tokens  # noqa: E402

# Palavras que puxam notícia leve/curiosa. Cada uma vira uma busca "when:1d" no Google Notícias.
BUSCAS = [
    "curioso", "curiosa", "inusitado", "inusitada", "bizarro", "viraliza", "viralizou",
    "inacreditável", "recorde mundial", "Guinness", "cientistas descobrem", "descoberta curiosa",
    "nunca visto", "flagra engraçado", "animal inusitado",
]
MIN_PALAVRAS_EM_COMUM = 2   # duas manchetes com >=2 palavras-chave iguais = mesma história

# Sinais de "dá pra explicar" (bloco "por que isso acontece?" do molde) -> bônus.
CURIOSIDADE = re.compile(r"\b(?:por que|porque|cientistas?|estudo|descobr\w*|revela\w*|explica\w*|recorde\w*|"
                         r"guinness|inusitad\w*|curios\w*|bizarr\w*|misterio\w*|animal|animais|gato|cachorro|"
                         r"viraliz\w*|flagr\w*|nunca visto|inacreditavel)\b")
# Notícia que não cabe no formato (divulgação de novela/filme/produto) -> descartada, não é perigo.
FORA_DO_FORMATO = re.compile(r"\b(?:novela|resumo|capitulo|trailer|estreia|temporada|episodio|filme|serie|anime|"
                             r"lancamento|lanca|apresenta oficialmente|especificac\w*|mah|horoscopo|signos?|"
                             r"cupom|promocao|oferta|desconto|review)\b")


def google_noticias(busca: str) -> list[dict]:
    q = urllib.parse.quote(f"{busca} when:1d")
    xml = get(f"https://news.google.com/rss/search?q={q}&hl=pt-BR&gl=BR&ceid=BR:pt-419", lang="pt-BR")
    out = []
    for it in ET.fromstring(xml).iter("item"):
        bruto = html.unescape(it.findtext("title", ""))
        # Google Notícias devolve "Manchete - Veículo"
        titulo, _, veiculo = bruto.rpartition(" - ")
        out.append({
            "titulo": titulo or bruto, "veiculo": veiculo, "url": it.findtext("link", ""),
            "data": it.findtext("pubDate", ""), "busca": busca,
        })
    return out


def agrupar(itens: list[dict]) -> list[dict]:
    """Junta manchetes da mesma história; quanto mais veículos cobrindo, mais forte a pauta."""
    grupos: list[dict] = []
    for it in itens:
        tk = tokens(it["titulo"])
        for g in grupos:
            if len(tk & g["tokens"]) >= MIN_PALAVRAS_EM_COMUM:
                g["itens"].append(it)
                g["tokens"] |= tk
                break
        else:
            grupos.append({"tokens": set(tk), "itens": [it]})
    return grupos


def pontuar(g: dict, termos_alta: list[tuple[set, dict]]) -> dict:
    veiculos = sorted({i["veiculo"] for i in g["itens"] if i["veiculo"]})
    buscas = sorted({i["busca"] for i in g["itens"]})
    em_alta = next((t for tk, t in termos_alta if tk and tk <= g["tokens"]), None)
    curioso = any(CURIOSIDADE.search(norm(i["titulo"])) for i in g["itens"])
    nota = len(veiculos) * 2 + len(buscas) + (5 if em_alta else 0) + (4 if curioso else 0)
    principal = g["itens"][0]
    return {
        "manchete": principal["titulo"], "nota": nota, "veiculos": veiculos,
        "fontes": [{"titulo": i["titulo"], "veiculo": i["veiculo"], "url": i["url"]} for i in g["itens"][:5]],
        "em_alta_no_trends": em_alta["termo"] if em_alta else None,
    }


def markdown(data: dict) -> str:
    l = [f"# Radar de notícias curiosas — {data['data']}", "",
         f"{data['total_manchetes']} manchetes lidas · {len(data['pautas'])} pautas · "
         f"{len(data['descartados'])} descartadas pelo filtro", "", "## Pautas (melhor primeiro)"]
    for i, p in enumerate(data["pautas"], 1):
        alta = f" · 🔥 em alta: {p['em_alta_no_trends']}" if p["em_alta_no_trends"] else ""
        l += [f"{i}. **{p['manchete']}** — nota {p['nota']} · {len(p['veiculos'])} veículo(s){alta}",
              f"   - fonte: [{p['fontes'][0]['veiculo'] or 'link'}]({p['fontes'][0]['url']})"]
    l += ["", "## Descartadas (segurança ou fora do formato)"]
    l += [f"- {d['manchete']} → {d['motivo']}" for d in data["descartados"][:20]]
    return "\n".join(l) + "\n"


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--top", type=int, default=5)
    args = ap.parse_args()

    itens, vistos = [], set()
    for b in BUSCAS:
        try:
            for it in google_noticias(b):
                chave_txt = re.sub(r"\W+", " ", it["titulo"].lower()).strip()
                if chave_txt not in vistos:
                    vistos.add(chave_txt)
                    itens.append(it)
        except Exception as e:  # uma busca falhar não derruba o radar
            print(f"aviso: busca '{b}' falhou: {e}", file=sys.stderr)

    try:
        termos_alta = [(tokens(t["termo"]), t) for t in fonte_trends("BR")]
    except Exception as e:
        print(f"aviso: Google Trends falhou: {e}", file=sys.stderr)
        termos_alta = []

    pautas, descartados = [], []
    for g in agrupar(itens):
        p = pontuar(g, termos_alta)
        motivo = motivo_bloqueio(*[f["titulo"] for f in p["fontes"]])
        if not motivo and FORA_DO_FORMATO.search(norm(p["manchete"])):
            motivo = "fora do formato (divulgação de novela/filme/produto)"
        if motivo:
            descartados.append({"manchete": p["manchete"], "motivo": motivo})
        else:
            pautas.append(p)
    pautas.sort(key=lambda p: p["nota"], reverse=True)

    hoje = dt.date.today().isoformat()
    data = {"data": hoje, "total_manchetes": len(itens), "pautas": pautas[: args.top],
            "descartados": descartados}
    pasta = ROOT / "radar"
    pasta.mkdir(exist_ok=True)
    (pasta / f"{hoje}.json").write_text(json.dumps(data, ensure_ascii=False, indent=2))
    (pasta / f"{hoje}.md").write_text(markdown(data))
    print(markdown(data))


if __name__ == "__main__":
    main()
