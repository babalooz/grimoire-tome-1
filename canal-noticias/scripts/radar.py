#!/usr/bin/env python3
"""Radar do portal "Sabia Não?": as notícias mais importantes do dia (e da semana), só pauta segura.

Uso:
  python3 canal-noticias/scripts/radar.py            -> radar do dia: canal-noticias/radar/AAAA-MM-DD.md + .json
  python3 canal-noticias/scripts/radar.py --semana   -> junta os radares dos últimos 7 dias: radar/semana-AAAA-MM-DD.md + .json

Sem chave de API. Fonte: Google Notícias RSS BR (destaques + editorias). A ordem do Google e o número de
veículos cobrindo a mesma história medem a importância. Filtro de segurança: o mesmo do CapyFala
(canal-idiomas/scripts/radar.py) — sem política, crime, violência, morte, saúde grave, drogas, sexo e apostas.
Escolha final: 1 notícia por editoria (variedade = retenção), as melhores primeiro.
"""
import argparse
import datetime as dt
import html
import json
import re
import sys
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT.parent / "canal-idiomas" / "scripts"))
from radar import get, motivo_bloqueio, norm, tokens  # noqa: E402

GN = "https://news.google.com/rss{caminho}?hl=pt-BR&gl=BR&ceid=BR:pt-419"
EDITORIAS = {
    "destaques": "",
    "bolso": "/headlines/section/topic/BUSINESS",
    "tecnologia": "/headlines/section/topic/TECHNOLOGY",
    "ciencia": "/headlines/section/topic/SCIENCE",
    "saude": "/headlines/section/topic/HEALTH",
    "esporte": "/headlines/section/topic/SPORTS",
    "cultura": "/headlines/section/topic/ENTERTAINMENT",
}
MIN_SEMELHANCA = 0.34   # palavras-chave em comum / palavras-chave da menor manchete -> mesma história
# Não é notícia, é venda ou passatempo.
FORA_DO_FORMATO = re.compile(r"\b(?:cupom|promocao|oferta|desconto|black friday|horoscopo|signos?|"
                             r"palpite\w*|onde assistir|ao vivo|resumo da novela|review)\b")


def ler_editoria(nome: str, caminho: str) -> list[dict]:
    xml = get(GN.format(caminho=caminho), lang="pt-BR")
    itens = list(ET.fromstring(xml).iter("item"))
    out = []
    for pos, it in enumerate(itens):
        bruto = html.unescape(it.findtext("title", ""))
        titulo, _, veiculo = bruto.rpartition(" - ")  # "Manchete - Veículo"
        desc = html.unescape(it.findtext("description", ""))
        out.append({
            "titulo": titulo or bruto, "veiculo": veiculo, "url": it.findtext("link", ""),
            "data": it.findtext("pubDate", ""), "editoria": nome,
            # topo da lista do Google = mais importante; <li> = veículos agrupados pelo Google (máx. 5)
            "peso": 5 * (1 - pos / max(len(itens), 1)) + 2 * desc.count("<li>"),
            "relacionadas": re.findall(r"<a [^>]*>([^<]+)</a>", desc)[1:5],
        })
    return out


def mesma_historia(a: set, b: set) -> bool:
    # Compara com a manchete-semente do grupo (sem acumular palavras: acumular junta histórias diferentes).
    return bool(a and b) and len(a & b) >= 2 and len(a & b) / min(len(a), len(b)) >= MIN_SEMELHANCA


def agrupar(itens: list[dict]) -> list[dict]:
    """Junta a mesma história vinda de editorias diferentes."""
    grupos: list[dict] = []
    for it in itens:
        tk = tokens(it["titulo"])
        g = next((g for g in grupos if mesma_historia(tk, g["tokens"])), None)
        if g:
            g["itens"].append(it)
        else:
            grupos.append({"tokens": tk, "itens": [it]})
    return grupos


def pauta(g: dict) -> dict:
    principal = max(g["itens"], key=lambda i: i["peso"])
    editorias = {i["editoria"] for i in g["itens"]}
    # editoria própria vale mais que "destaques" (diz do que se trata)
    # editoria que mais apareceu no grupo (sem contar "destaques"), não a primeira da lista
    contagem = {e: sum(i["editoria"] == e for i in g["itens"]) for e in editorias if e != "destaques"}
    editoria = max(contagem, key=contagem.get) if contagem else "destaques"
    return {
        "manchete": principal["titulo"], "editoria": editoria,
        "nota": round(sum(i["peso"] for i in g["itens"]) + 3 * (len(editorias) - 1), 1),
        "veiculos": sorted({i["veiculo"] for i in g["itens"] if i["veiculo"]}),
        "contexto": principal["relacionadas"],
        "fontes": [{"titulo": i["titulo"], "veiculo": i["veiculo"], "url": i["url"]} for i in g["itens"][:5]],
    }


def escolher(pautas: list[dict], n: int) -> list[dict]:
    """As n melhores, no máximo 1 por editoria; completa com as próximas se faltar editoria."""
    pautas = sorted(pautas, key=lambda p: p["nota"], reverse=True)
    escolhidas, usadas = [], set()
    for p in pautas:
        if p["editoria"] not in usadas:
            escolhidas.append(p)
            usadas.add(p["editoria"])
    escolhidas += [p for p in pautas if p not in escolhidas]
    return escolhidas[:n]


def markdown(titulo: str, data: dict) -> str:
    l = [f"# {titulo}", "", f"{data['total_manchetes']} manchetes lidas · {len(data['descartados'])} descartadas", "",
         "## Pautas (melhor primeiro, 1 por editoria)"]
    for i, p in enumerate(data["pautas"], 1):
        l += [f"{i}. [{p['editoria']}] **{p['manchete']}** — nota {p['nota']} · {len(p['veiculos'])} veículo(s)",
              f"   - fonte: [{p['fontes'][0]['veiculo'] or 'link'}]({p['fontes'][0]['url']})"]
    l += ["", "## Reservas"]
    l += [f"- [{p['editoria']}] {p['manchete']} — nota {p['nota']}" for p in data.get("reservas", [])]
    l += ["", "## Descartadas (segurança ou fora do formato)"]
    l += [f"- {d['manchete']} → {d['motivo']}" for d in data["descartados"][:25]]
    return "\n".join(l) + "\n"


def radar_do_dia(n: int) -> dict:
    itens = []
    for nome, caminho in EDITORIAS.items():
        try:
            itens += ler_editoria(nome, caminho)
        except Exception as e:  # uma editoria falhar não derruba o radar
            print(f"aviso: editoria '{nome}' falhou: {e}", file=sys.stderr)
    pautas, descartados = [], []
    for g in agrupar(itens):
        p = pauta(g)
        # Só as manchetes da própria história: as "relacionadas" do Google trazem assunto vizinho
        # (ex.: "dólar dispara" vinha com uma relacionada citando ministro e era barrada à toa).
        # Manchete principal: filtro completo. Vizinhas: só barram por crime/tragédia/etc. — citar
        # "eleição" ao lado de "dólar dispara" é o efeito no bolso (pauta segura), não política.
        motivo = motivo_bloqueio(p["manchete"]) or next(
            (m for f in p["fontes"][1:] if (m := motivo_bloqueio(f["titulo"])) and not m.startswith("política")), None)
        if not motivo and FORA_DO_FORMATO.search(norm(p["manchete"])):
            motivo = "fora do formato (venda/passatempo)"
        (descartados.append({"manchete": p["manchete"], "motivo": motivo}) if motivo else pautas.append(p))
    escolhidas = escolher(pautas, n)
    reservas = [p for p in sorted(pautas, key=lambda p: p["nota"], reverse=True) if p not in escolhidas][:8]
    return {"data": dt.date.today().isoformat(), "total_manchetes": len(itens), "pautas": escolhidas,
            "reservas": reservas, "descartados": descartados}


def radar_da_semana(n: int) -> dict:
    hoje = dt.date.today()
    pautas, total = [], 0
    for d in range(7):
        f = ROOT / "radar" / f"{(hoje - dt.timedelta(days=d)).isoformat()}.json"
        if f.exists():
            dia = json.loads(f.read_text())
            total += dia["total_manchetes"]
            pautas += [{**p, "dia": dia["data"]} for p in dia["pautas"] + dia.get("reservas", [])]
    # mesma história em vários dias = assunto da semana: soma as notas
    grupos: list[dict] = []
    for p in pautas:
        tk = tokens(p["manchete"])
        g = next((g for g in grupos if mesma_historia(tk, g["tokens"])), None)
        if g:
            g["nota"] += p["nota"]
            g["dias"].add(p["dia"])
        else:
            grupos.append({**p, "tokens": set(tk), "dias": {p["dia"]}})
    for g in grupos:
        g["nota"] = round(g["nota"], 1)
        g["dias"] = sorted(g.pop("dias"))
        g.pop("tokens")
    return {"data": hoje.isoformat(), "total_manchetes": total, "pautas": escolher(grupos, n), "descartados": []}


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--semana", action="store_true", help="junta os últimos 7 dias")
    ap.add_argument("--top", type=int, default=None, help="quantas pautas (padrão: 3 no dia, 5 na semana)")
    args = ap.parse_args()
    pasta = ROOT / "radar"
    pasta.mkdir(exist_ok=True)
    if args.semana:
        data = radar_da_semana(args.top or 5)
        nome, titulo = f"semana-{data['data']}", f"Radar da semana — até {data['data']}"
    else:
        data = radar_do_dia(args.top or 3)
        nome, titulo = data["data"], f"Radar do dia — {data['data']}"
    (pasta / f"{nome}.json").write_text(json.dumps(data, ensure_ascii=False, indent=2))
    (pasta / f"{nome}.md").write_text(markdown(titulo, data))
    print(markdown(titulo, data))


if __name__ == "__main__":
    main()
