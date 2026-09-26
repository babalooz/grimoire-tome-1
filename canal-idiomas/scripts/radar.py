"""Radar de demanda: acha perguntas de idioma muito buscadas e mal atendidas + assuntos em alta.

Uso: python3 scripts/radar.py            -> gera radar/AAAA-MM-DD.md
Sem chave de API: autocompletar do YouTube + página de busca do YouTube + RSS do Google Trends.
"""
import datetime as dt
import json
import math
import re
import statistics
import time
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126 Safari/537.36"

# Público -> (idioma da busca, país, sementes)
PAIRS = {
    "pt-para-hispanofalantes": ("es", "MX", [
        "como se dice en portugues", "aprender portugues", "portugues brasileño",
        "frases en portugues", "palabras en portugues", "portugues vs español",
    ]),
    "pt-para-anglofonos": ("en", "US", [
        "how to say in portuguese", "learn brazilian portuguese", "portuguese phrases",
        "brazilian slang", "portuguese vs spanish",
    ]),
    "en-para-brasileiros": ("pt", "BR", [
        "como se fala em ingles", "como falar em ingles", "girias em ingles",
        "erros de ingles", "ingles para iniciantes",
    ]),
}
TREND_GEOS = ["BR", "MX", "US"]
QUERIES_PER_PAIR = 15


def get(url: str, lang: str = "en") -> str:
    req = urllib.request.Request(url, headers={
        "User-Agent": UA, "Accept-Language": lang, "Cookie": "CONSENT=YES+1; SOCS=CAI",
    })
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read().decode("utf-8", "replace")


def autocomplete(seed: str, hl: str, gl: str) -> list[str]:
    q = urllib.parse.urlencode({"client": "firefox", "ds": "yt", "hl": hl, "gl": gl, "q": seed})
    return json.loads(get(f"https://suggestqueries.google.com/complete/search?{q}"))[1]


def age_days(text: str) -> float:
    """'5y ago' / '3mo ago' / '2 weeks ago' / 'Streamed 4d ago' -> dias."""
    m = re.search(r"(\d+)\s*(mo|y|w|d|h|m|s)", text or "")
    if not m:
        return 9999
    mult = {"s": 0, "m": 0, "h": 0, "d": 1, "w": 7, "mo": 30, "y": 365}
    return int(m.group(1)) * mult[m.group(2)]


def search(query: str, gl: str) -> list[dict]:
    q = urllib.parse.urlencode({"search_query": query, "gl": gl, "hl": "en"})
    html = get(f"https://www.youtube.com/results?{q}")
    m = re.search(r"var ytInitialData = (\{.*?\});</script>", html)
    if not m:
        return []
    results = []

    def walk(node):
        if isinstance(node, dict):
            if "videoRenderer" in node:
                v = node["videoRenderer"]
                views = re.sub(r"\D", "", v.get("viewCountText", {}).get("simpleText", "")) or "0"
                results.append({
                    "title": "".join(r.get("text", "") for r in v.get("title", {}).get("runs", [])),
                    "views": int(views),
                    "age": age_days(v.get("publishedTimeText", {}).get("simpleText", "")),
                    "id": v.get("videoId"),
                })
            for x in node.values():
                walk(x)
        elif isinstance(node, list):
            for x in node:
                walk(x)

    walk(json.loads(m.group(1)))
    return results[:20]


def score(videos: list[dict]) -> dict:
    views = [v["views"] for v in videos if v["views"]]
    if not views:
        return {"score": 0}
    med = statistics.median(views)
    stale = sum(v["age"] > 365 for v in videos) / len(videos)
    recent = sum(v["age"] <= 90 for v in videos)
    # muita demanda (views) x topo envelhecido / pouca oferta recente
    return {
        "score": round(math.log10(med + 1) * (0.5 + stale) / (1 + recent), 2),
        "median_views": int(med), "stale_pct": round(stale * 100), "recent": recent,
        "top": max(videos, key=lambda v: v["views"]),
    }


def trends(geo: str) -> list[str]:
    xml = get(f"https://trends.google.com/trending/rss?geo={geo}")
    return re.findall(r"<title>([^<]*)</title>", xml)[1:21]


def main() -> None:
    today = dt.date.today().isoformat()
    lines = [f"# Radar de demanda — {today}", "",
             "Score = log10(mediana de views do topo) × (0,5 + % do topo com >1 ano) ÷ (1 + vídeos <90 dias no topo).",
             "Quanto maior, mais demanda com oferta velha/fraca.", ""]
    data = {"date": today, "pairs": {}, "trends": {}}

    for pair, (hl, gl, seeds) in PAIRS.items():
        queries = []
        for s in seeds:
            for q in autocomplete(s, hl, gl):
                if q not in queries:
                    queries.append(q)
            time.sleep(0.3)
        rows = []
        for q in queries[:QUERIES_PER_PAIR * 2]:
            try:
                rows.append({"query": q, **score(search(q, gl))})
            except Exception as e:  # uma busca que falha não derruba o radar
                rows.append({"query": q, "score": 0, "error": str(e)})
            time.sleep(1)
        rows.sort(key=lambda r: r["score"], reverse=True)
        data["pairs"][pair] = rows
        lines += [f"## {pair} ({gl})", "", "| # | Busca | Score | Mediana views | Topo >1 ano | Recentes | Maior vídeo |",
                  "|---|---|---|---|---|---|---|"]
        for i, r in enumerate(rows[:QUERIES_PER_PAIR], 1):
            top = r.get("top") or {}
            lines.append(f"| {i} | {r['query']} | {r['score']} | {r.get('median_views', 0):,} | {r.get('stale_pct', 0)}% | "
                         f"{r.get('recent', 0)} | {top.get('views', 0):,} views |")
        lines.append("")

    lines += ["## Assuntos em alta hoje (Google Trends)", ""]
    for geo in TREND_GEOS:
        t = trends(geo)
        data["trends"][geo] = t
        lines.append(f"- **{geo}:** " + " · ".join(t))
    lines.append("")

    out = ROOT / "radar"
    out.mkdir(exist_ok=True)
    (out / f"{today}.md").write_text("\n".join(lines))
    (out / f"{today}.json").write_text(json.dumps(data, ensure_ascii=False, indent=2))
    print(f"ok: radar/{today}.md")


if __name__ == "__main__":
    main()
