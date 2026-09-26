"""Radar v2 do CapyFala: hype seguro + evento do dia + dúvidas de inglês em alta.

Uso:
  python3 scripts/radar.py                 -> gera radar/AAAA-MM-DD.md + .json
  python3 scripts/radar.py --so-hype       -> pula a pesquisa de demanda no YouTube (rápido, ~1 min)
  python3 scripts/radar.py --data 2026-10-04   -> simula outra data (calendário/bloqueio)
  python3 scripts/radar.py --semanal       -> radar/semana-AAAA-MM-DD.md + .json (tema da semana = assunto seguro
                                             que apareceu em 3+ dos últimos 7 radares diários; calendário dos próximos 7 dias)
  python3 scripts/radar.py --testar-filtro "tortura" "vice-prefeito" ...  -> só testa o filtro de segurança

Sem chave de API. Fontes (todas grátis):
  - Google Trends RSS BR (termo + volume aproximado + manchetes de contexto)
  - Wikipédia PT: artigos mais vistos de ontem (API pageviews) + descrição/resumo de cada um
  - Spotify Brasil diário (kworb.net): só faixas que também estão no global e não são em PT/ES
  - TikTok BR automático: Google Notícias (busca "trend/viralizou/meme no TikTok", últimas 48 h) -> termos entre
    aspas e #hashtags das manchetes. O Creative Center sem login só mostra top 3 dos EUA e o endpoint público
    /api/challenge/detail não responde a partir da nuvem (testado 26/09: resposta vazia), então a medição de views
    das hashtags fica para o PC (ponte). radar/manual.txt continua aceito como reforço opcional.
  - calendario.json: evento-âncora do dia e dias de bloqueio (block_hype)
  - Autocomplete Google/YouTube + busca do YouTube (demanda de aula e teste "vira aula?")

Saída JSON (lida pelo roteirista): evento_do_dia, hype_seguro, duvidas_em_alta, descartados.
Cada dúvida traz `infantil: true/false` (trava de conteúdo infantil); o roteirista do canal adulto ignora as `true`.
Todo termo de tendência passa pelo filtro de segurança ANTES de sair; o bloqueado vai para
"descartados" com o motivo e nunca chega ao roteirista.
"""
import argparse
import datetime as dt
import html
import json
import math
import re
import statistics
import sys
import time
import unicodedata
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126 Safari/537.36"
WIKI_UA = "CapyFalaRadar/2.0 (radar de tendencias educativo; python-urllib)"

# Público -> (idioma da busca, país, sementes). hl agora acompanha o público (antes era sempre "en").
PAIRS = {
    "en-para-brasileiros": ("pt", "BR", [
        "como se fala em ingles", "como falar em ingles", "girias em ingles",
        "erros de ingles", "ingles para iniciantes",
    ]),
    "pt-para-hispanofalantes": ("es", "MX", [
        "como se dice en portugues", "aprender portugues", "portugues brasileño",
        "frases en portugues", "palabras en portugues", "portugues vs español",
    ]),
    "pt-para-anglofonos": ("en", "US", [
        "how to say in portuguese", "learn brazilian portuguese", "portuguese phrases",
        "brazilian slang", "portuguese vs spanish",
    ]),
}
QUERIES_PER_PAIR = 15
MAX_VIEWS_AULA = 50_000_000   # acima disso é clipe/viral, não aula
MIN_VIDEOS_AULA = 5           # menos que isso = amostra fraca, score 0
TOP_HYPE = 10
VIRA_AULA_TESTES = 14         # quantos candidatos passam pelo teste de autocomplete


# ---------------------------------------------------------------- utilidades
def get(url: str, lang: str = "en", ua: str = UA, tries: int = 3) -> str:
    for i in range(tries):
        req = urllib.request.Request(url, headers={
            "User-Agent": ua, "Accept-Language": lang, "Cookie": "CONSENT=YES+1; SOCS=CAI",
        })
        try:
            with urllib.request.urlopen(req, timeout=30) as r:
                return r.read().decode("utf-8", "replace")
        except urllib.error.HTTPError as e:
            if e.code == 429 and i < tries - 1:
                time.sleep(int(e.headers.get("retry-after") or 5) + 1)
                continue
            raise
    raise RuntimeError("inalcançável")


def norm(text: str) -> str:
    """minúsculas, sem acento, '_' -> espaço."""
    t = unicodedata.normalize("NFKD", (text or "").replace("_", " ")).encode("ascii", "ignore").decode()
    return re.sub(r"\s+", " ", t.lower()).strip()


GENERIC = {
    "brasil", "brasileiro", "brasileira", "futebol", "clube", "cantor", "cantora", "sport", "club", "copa",
    "jogo", "serie", "filme", "temporada", "sao", "paulo", "santa", "the", "and", "com", "para", "pela",
    "pelo", "dos", "das", "de", "do", "da", "vs", "x", "fc", "ao", "vivo", "feat", "mc", "dj", "novo", "nova",
    "estados", "unidos", "rio", "janeiro", "lista", "2025", "2026", "campeonato", "selecao",
}


def tokens(text: str) -> set[str]:
    return {w for w in re.findall(r"[a-z0-9]+", norm(text)) if len(w) >= 4 and w not in GENERIC}


def chave(c: dict) -> set[str]:
    return tokens(c.get("chave") or c["termo"])


def mesmo_assunto(a: set[str], b: set[str]) -> bool:
    """Um conjunto de palavras contido no outro ('renner' ⊂ 'rick renner'); 'harry' ≠ 'harry kane'."""
    return bool(a and b) and (a <= b or b <= a)


# ---------------------------------------------------------------- filtro de segurança
# Padrões aplicados ao texto normalizado (sem acento). "\w*" = qualquer terminação.
BLOQUEIO = {
    "política/eleição": [
        r"eleic\w*", r"eleitor\w*", r"urnas?", r"candidat\w*", r"prefeit\w*", r"vereador\w*", r"deputad\w*",
        r"senador\w*", r"senado", r"governador\w*", r"governo\w*", r"president\w*", r"ministr\w*", r"stf", r"tse",
        r"stj", r"congresso", r"camara (?:dos deputados|municipal)", r"partido\w*", r"pt", r"pl", r"psol", r"mdb",
        r"psdb", r"pdt", r"psd", r"uniao brasil", r"republicanos", r"politic\w*", r"impeachment", r"cpi",
        r"datafolha", r"quaest", r"ipec", r"atlasintel", r"debate\w*", r"horario eleitoral", r"(?:primeiro|segundo|1o|2o) turno",
        r"mbl", r"bolsonar\w*", r"lula", r"tarcisio", r"caiado", r"ratinho junior",
        r"zema", r"haddad", r"alckmin", r"marcal", r"boulos", r"moraes", r"flavio dino", r"ciro gomes",
        r"tebet", r"marina silva", r"renan santos", r"trump", r"biden", r"kamala", r"milei", r"maduro",
        r"putin", r"netanyahu", r"zelensk\w*", r"hamas", r"hezbollah", r"gaza", r"israel\w*",
    ],
    "crime/polícia": [
        r"crime\w*", r"crimino\w*", r"tortur\w*", r"presos?", r"presas?", r"prisao", r"prisoes", r"prend\w*",
        r"polici\w*", r"sargento\w*", r"delegad\w*", r"pm", r"assassin\w*", r"homicid\w*", r"feminicid\w*",
        r"latrocin\w*", r"matou", r"roub\w*", r"assalt\w*", r"furto\w*", r"sequestr\w*", r"faccao", r"faccoes",
        r"pcc", r"milicia\w*", r"golpe\w*", r"fraud\w*", r"estelionat\w*", r"investiga\w*", r"indiciad\w*",
        r"suspeit\w*", r"acusad\w*", r"condenad\w*", r"julgament\w*", r"serial killer", r"mafia\w*",
        r"operacao", r"mandado\w*", r"foragid\w*", r"detid\w*",
    ],
    "violência": [
        r"tiroteio\w*", r"baleado\w*", r"disparo\w*", r"facada\w*", r"esfaque\w*", r"agress\w*", r"espanc\w*",
        r"violen\w*", r"guerra\w*", r"ataque\w*", r"bomba\w*", r"terroris\w*", r"atentado\w*", r"massacre\w*",
        r"chacina\w*", r"briga\w*", r"armas?", r"arma de fogo",
    ],
    "tragédia/morte": [
        r"morte\w*", r"mortos?", r"mortas?", r"morre\w*", r"morreu", r"falec\w*", r"obito\w*", r"velorio\w*",
        r"enterro\w*", r"sepult\w*", r"luto", r"acidente\w*", r"tragedi\w*", r"tragic\w*", r"desastre\w*",
        r"incendio\w*", r"enchente\w*", r"desabamento\w*", r"vitima\w*", r"ferid[oa]s?", r"suicid\w*",
        r"desaparecid\w*", r"queda de aviao", r"terremoto\w*", r"furacao", r"corpos?",
    ],
    "saúde grave": [r"cancer", r"tumor\w*", r"internad\w*", r"hospitaliz\w*", r"uti", r"avc", r"infarto\w*"],
    "drogas": [r"droga\w*", r"cocaina", r"maconha", r"crack", r"overdose", r"entorpecente\w*", r"narcotrafic\w*", r"trafic\w*"],
    "sexo": [
        r"sexo", r"sexual\w*", r"estupr\w*", r"abus\w*", r"porn\w*", r"nudes?", r"onlyfans", r"privacy",
        r"prostitu\w*", r"pedofil\w*", r"assedi\w*", r"vazad\w*",
    ],
    "apostas/marcas de risco": [
        r"bets?", r"aposta\w*", r"cassino\w*", r"tigrinho", r"fortune tiger", r"blaze", r"betano", r"bet365",
        r"superbet", r"esportes da sorte", r"jogo do bicho", r"loteria\w*", r"mega[ -]?sena", r"lotofacil",
        r"piramide financeira", r"banco master", r"vorcaro",
    ],
}
_BLOQ_RE = {cat: re.compile(r"\b(?:" + "|".join(p) + r")\b") for cat, p in BLOQUEIO.items()}
# "(1966–2026)" na descrição ou "– Cidade, 21 de setembro de 2026)" no resumo = morte recente.
_MORTE_RECENTE = re.compile(r"\b(?:1[89]\d\d|200\d|201[0-5])\s*[-–]\s*(?:2025|2026)\s*\)"
                            r"|[-–]\s*[^()\d]{0,40}\d{1,2}\S{0,2} de [a-zç]+ de (?:2025|2026)\s*\)")


def motivo_bloqueio(*textos: str) -> str | None:
    """Devolve 'categoria: "trecho"' se algum texto bate num padrão proibido; None se seguro."""
    for t in textos:
        n = norm(t)
        for cat, rx in _BLOQ_RE.items():
            m = rx.search(n)
            if m:
                return f'{cat}: "{m.group(0)}" em "{t[:90]}"'
    for t in textos:
        if t and _MORTE_RECENTE.search(t):
            return f'tragédia/morte: morte recente em "{t[:90]}"'
    return None


# ---------------------------------------------------------------- fontes de hype
def parse_traffic(s: str) -> int:
    s = (s or "").replace(",", "").replace(".", "").replace("+", "").strip().upper()
    mult = 1
    if s.endswith("K"):
        mult, s = 1_000, s[:-1]
    elif s.endswith("M"):
        mult, s = 1_000_000, s[:-1]
    return int(s) * mult if s.isdigit() else 0


def fonte_trends(geo: str = "BR") -> list[dict]:
    ns = {"ht": "https://trends.google.com/trending/rss"}
    root = ET.fromstring(get(f"https://trends.google.com/trending/rss?geo={geo}"))
    out = []
    for it in root.iter("item"):
        vol = parse_traffic(it.findtext("ht:approx_traffic", "", ns))
        news = [n.findtext("ht:news_item_title", "", ns) for n in it.findall("ht:news_item", ns)]
        urls = [n.findtext("ht:news_item_url", "", ns) for n in it.findall("ht:news_item", ns)]
        out.append({
            "termo": it.findtext("title", ""), "fonte": "google-trends", "volume": vol,
            "volume_txt": f"{vol:,}+ buscas".replace(",", "."), "forca": math.log10(max(vol, 10)),
            "contexto": html.unescape(news[0]) if news else "", "manchetes": [html.unescape(n) for n in news],
            "url": urls[0] if urls else "",
        })
    return out


def fonte_wikipedia(hoje: dt.date, n: int = 40) -> list[dict]:
    data = None
    for back in (1, 2):
        d = hoje - dt.timedelta(days=back)
        try:
            data = json.loads(get("https://wikimedia.org/api/rest_v1/metrics/pageviews/top/pt.wikipedia/"
                                  f"all-access/{d:%Y/%m/%d}", ua=WIKI_UA))
            break
        except urllib.error.HTTPError:
            continue
    if not data:
        return []
    arts = [a for a in data["items"][0]["articles"]
            if ":" not in a["article"] and a["article"] not in ("Brasil",)][:n]
    # Descrição + 2 frases de resumo: é o que revela "político", "assassina", "(1966–2026)".
    info = {}
    titles = [a["article"].replace("_", " ") for a in arts]
    for i in range(0, len(titles), 20):
        q = urllib.parse.urlencode({
            "action": "query", "format": "json", "prop": "description|extracts", "exintro": 1,
            "explaintext": 1, "exsentences": 2, "exlimit": 20, "redirects": 1, "titles": "|".join(titles[i:i + 20]),
        })
        res = json.loads(get(f"https://pt.wikipedia.org/w/api.php?{q}", ua=WIKI_UA))["query"]
        alias = {r["to"]: r["from"] for r in res.get("normalized", []) + res.get("redirects", [])}
        for p in res.get("pages", {}).values():
            info[alias.get(p["title"], p["title"])] = (p.get("description", ""), p.get("extract", ""))
            info[p["title"]] = (p.get("description", ""), p.get("extract", ""))
        time.sleep(0.5)
    out = []
    for a, t in zip(arts, titles):
        desc, ext = info.get(t, ("", ""))
        out.append({
            "termo": re.sub(r"\s*\(.*?\)\s*$", "", t), "fonte": "wikipedia", "volume": a["views"],
            "volume_txt": f"{a['views']:,} views na Wikipédia".replace(",", "."),
            "forca": math.log10(max(a["views"], 10)), "contexto": desc, "resumo": ext,
            "url": "https://pt.wikipedia.org/wiki/" + urllib.parse.quote(a["article"]),
        })
    return out


_PT_ES = re.compile(r"[ãõçñ]|\b(?:ao vivo|eu|de|que|pra|meu|minha|voce|te|amor|saudade|nao|do|da|el|la|mi|tu|con|y)\b")


def _kworb(pais: str) -> list[dict]:
    t = get(f"https://kworb.net/spotify/country/{pais}_daily.html")
    rows = re.findall(r'<tr><td class="np">(\d+)</td>.*?<div>(.*?)</div>.*?<td>(\d+)</td>\s*<td>\d+</td>'
                      r'<td[^>]*>[^<]*</td>\s*<td>([\d,]+)</td>', t, re.S)
    out = []
    for pos, div, dias, streams in rows:
        txt = html.unescape(re.sub(r"<[^>]+>", "", div))
        artista, _, faixa = txt.partition(" - ")
        out.append({"pos": int(pos), "artista": artista.strip(), "faixa": faixa.strip(), "dias": int(dias),
                    "streams": int(streams.replace(",", ""))})
    return out


def fonte_spotify() -> list[dict]:
    br = _kworb("br")
    glob = {(norm(r["artista"]), norm(r["faixa"])) for r in _kworb("global")}
    out = []
    for r in br:
        if (norm(r["artista"]), norm(r["faixa"])) not in glob:
            continue  # só o que também é hit global: o topo BR é sertanejo/funk, sem gancho de inglês
        if _PT_ES.search(norm(r["faixa"]).replace("ç", "c")) or re.search(r"[ãõçñ]", r["faixa"].lower()):
            continue
        s = r["streams"]
        novo = r["dias"] <= 60
        out.append({
            "termo": f"{r['artista']} - {r['faixa']}", "chave": r["artista"], "fonte": "spotify-br", "volume": s,
            "novo": novo, "volume_txt": f"#{r['pos']} Spotify BR, {s:,} streams/dia, {r['dias']} dias no chart".replace(",", "."),
            "forca": math.log10(max(s / 50, 10)), "contexto": f"música em inglês/K-pop no top 200 do Brasil (#{r['pos']})",
            "url": "https://kworb.net/spotify/country/br_daily.html",
        })
    return out


def fonte_manual() -> list[dict]:
    f = ROOT / "radar" / "manual.txt"
    if not f.exists():
        return []
    out = []
    for line in f.read_text().splitlines():
        line = line.strip().lstrip("#").strip()
        if line and not line.startswith("//"):
            out.append({"termo": line, "fonte": "manual (TikTok)", "volume": 0, "volume_txt": "colado à mão",
                        "forca": 3.0, "contexto": "", "url": ""})
    return out


TIKTOK_QUERIES = ["trend tiktok", "viralizou tiktok", "meme tiktok", "trend do momento", "bordão viral"]
_ASPAS = re.compile(r"[\"“”‘’'«]([^\"“”‘’'«»]{3,40})[\"“”‘’'»]")
_HASHTAG = re.compile(r"#([\wÀ-ÿ]{3,30})")
_TT_GENERICO = {"tiktok", "trend", "viral", "meme", "fyp", "foryou", "brasil"}


def fonte_tiktok(horas: int = 48) -> list[dict]:
    """Trends do TikTok BR pela imprensa: termo entre aspas ou #hashtag em manchete que cita o TikTok."""
    out, vistos = [], set()
    agora = dt.datetime.now(dt.timezone.utc)
    for q in TIKTOK_QUERIES:
        url = ("https://news.google.com/rss/search?q=" + urllib.parse.quote(f"{q} when:2d")
               + "&hl=pt-BR&gl=BR&ceid=BR:pt-419")
        root = ET.fromstring(get(url, lang="pt-BR"))
        for it in root.iter("item"):
            titulo = html.unescape(it.findtext("title") or "")
            try:
                quando = dt.datetime.strptime(it.findtext("pubDate") or "", "%a, %d %b %Y %H:%M:%S %Z").replace(tzinfo=dt.timezone.utc)
                if (agora - quando).total_seconds() > horas * 3600:
                    continue
            except ValueError:
                pass
            manchete = titulo.rsplit(" - ", 1)[0]
            termos = [m.strip() for m in _ASPAS.findall(manchete)] + ["#" + h for h in _HASHTAG.findall(manchete)]
            for t in termos:
                k = norm(t.lstrip("#"))
                if not k or k in vistos or k in _TT_GENERICO or len(k.split()) > 6:
                    continue
                vistos.add(k)
                out.append({"termo": t, "fonte": "tiktok (notícias)", "volume": 0, "volume_txt": "citado na imprensa",
                            "forca": 2.5, "contexto": manchete, "url": it.findtext("link") or ""})
    return out


# ---------------------------------------------------------------- score de hype
ENCAIXE = [  # (peso, padrões) — o primeiro que bater vale
    (0.6, r"sertanej\w*|funk|pagode|forro|piseiro|gospel|cantor brasileiro|cantora brasileira|dupla"),
    (1.0, r"futebol\w*|partida|gol|libertadores|brasileirao|clube|f1|formula 1|grande premio|gp|piloto|tenis|nba|nfl"
          r"|volei|atleta|rodada|placar|estadio|amistoso|eliminatoria\w*|\w+ x \w+|\w+ vs\.? \w+"),
    (1.0, r"filme|cinema|serie|netflix|prime video|disney|hbo|trailer|estreia|temporada|episodio|banda|album|show"
          r"|turne|single|rapper|k-?pop|ator|atriz|game|videogame|jogo eletronico|playstation|xbox|nintendo|anime"
          r"|marvel|oscar|grammy|emmy|spotify|musica em ingles"),
    (0.8, r"reality|a fazenda|bbb|big brother|novela|programa|apresentador\w*|globo|record|sbt|peao|roca"),
]
_ENCAIXE_RE = [(w, re.compile(r"\b(?:" + p + r")\b")) for w, p in ENCAIXE]


def encaixe(c: dict) -> tuple[float, str]:
    txt = norm(" ".join([c["termo"], c.get("contexto", ""), " ".join(c.get("manchetes", [])[:3])]))
    if c["fonte"] == "spotify-br":  # lançamento sobe; clássico de catálogo (Oasis, Police) não é hype
        return (1.0, "música internacional") if c.get("novo") else (0.5, "música de catálogo")
    nomes = {0.6: "música BR", 0.8: "TV/reality"}
    for w, rx in _ENCAIXE_RE:
        if rx.search(txt):
            if w == 1.0:
                return w, "esporte" if rx is _ENCAIXE_RE[1][1] else "cultura pop"
            return w, nomes[w]
    return 0.3, "outro"


_AULA_SUG = re.compile(r"em ingles|in english|traduc\w*|como se (?:diz|fala|escreve)|significado")


def vira_aula(termo: str) -> list[str]:
    """Autocomplete Google BR para '<termo> em inglês' e 'como se diz <termo> em inglês'."""
    achados = []
    t = norm(re.sub(r"\s*-\s*.*$", "", termo) if " - " in termo else termo)
    nucleo = sorted(tokens(t), key=len, reverse=True)[:1] or [t]
    for seed in (f"{t} em inglês", f"como se diz {t} em inglês"):
        q = urllib.parse.urlencode({"client": "firefox", "hl": "pt-BR", "gl": "BR", "q": seed})
        try:
            sug = json.loads(get(f"https://suggestqueries.google.com/complete/search?{q}", "pt-BR"))[1]
        except Exception:
            sug = []
        for s in sug:
            n = norm(s)
            # exige o termo na sugestão: o Google "corrige" (vozinha -> cozinha) e isso não conta
            if _AULA_SUG.search(n) and nucleo[0] in n and " e ingles" not in n and s not in achados:
                achados.append(s)
        time.sleep(0.3)
    return achados


def sugestao_aula(c: dict) -> str:
    cat, t = c["categoria"], c["termo"]
    if c["fonte"] == "spotify-br":
        return f"'{t}': o que o título quer dizer + 2 expressões ligadas (sem letra longa nem áudio original)."
    if cat == "esporte":
        return f"Vocabulário do jogo em inglês a partir de '{t}' (score, draw, extra time, penalty) + 1 pergunta."
    if cat == "cultura pop":
        return f"Gírias/expressões em inglês ligadas a '{t}' (título original, bordões) + 1 pergunta."
    if cat == "TV/reality":
        return f"Como se diz o vocabulário de '{t}' em inglês (eviction, to be voted out, challenge)."
    if c.get("aula"):
        return f"Responder a busca real: '{c['aula'][0]}'."
    return f"Como se diz '{t}' em inglês + 2 palavras ligadas (só se o contexto for leve)."


def juntar_duplicados(cands: list[dict]) -> list[dict]:
    """Mesmo assunto em 2+ fontes vira 1 item com fontes somadas (bônus de cruzamento)."""
    out: list[dict] = []
    for c in cands:
        tk = chave(c)
        alvo = next((o for o in out if o["fonte"] != c["fonte"] and mesmo_assunto(tk, o["_tk"])), None)
        if alvo:
            alvo["fontes"] = sorted(set(alvo["fontes"]) | {c["fonte"]})
            alvo["forca"] = max(alvo["forca"], c["forca"])
            alvo["volume_txt"] += f" · {c['volume_txt']}"
            if not alvo.get("contexto"):
                alvo["contexto"] = c.get("contexto", "")
        else:
            out.append({**c, "fontes": [c["fonte"]], "_tk": tk})
    return out


def filtrar(cands: list[dict]) -> tuple[list[dict], list[dict]]:
    seguros, fora = [], []
    for c in cands:
        m = motivo_bloqueio(c["termo"], c.get("contexto", ""), *c.get("manchetes", [])[:3], c.get("resumo", ""))
        (fora if m else seguros).append({**c, "motivo": m} if m else c)
    # Contágio: se "Rick Sollo" caiu por morte, "Rick & Renner" e "Renner" caem junto.
    mudou = True
    while mudou:
        mudou = False
        for c in list(seguros):
            ref = next((f for f in fora if mesmo_assunto(chave(c), chave(f))), None)
            if ref:
                seguros.remove(c)
                fora.append({**c, "motivo": f"ligado a assunto descartado ('{ref['termo']}')"})
                mudou = True
    return seguros, fora


def hype(hoje: dt.date, bloqueado: bool, log: list[str]) -> tuple[list[dict], list[dict], list[str]]:
    cands, coletados = [], []
    for nome, fn in (("google-trends", fonte_trends), ("wikipedia", lambda: fonte_wikipedia(hoje)),
                     ("spotify-br", fonte_spotify), ("tiktok", fonte_tiktok), ("manual", fonte_manual)):
        try:
            got = fn()
            log.append(f"{nome}: {len(got)} itens")
            cands += got
        except Exception as e:  # uma fonte fora do ar não derruba o radar
            log.append(f"{nome}: FALHOU ({e})")
    coletados = sorted({norm(c["termo"]) for c in cands})

    seguros, fora = filtrar(cands)
    seguros = juntar_duplicados(seguros)

    ontem = anterior(hoje)
    ontem_tk = [tokens(t) for t in ontem] if ontem is not None else None
    for c in seguros:
        c["encaixe"], c["categoria"] = encaixe(c)
        c["subindo"] = bool(ontem_tk is not None and not any(mesmo_assunto(c["_tk"], o) for o in ontem_tk))
        c["pre"] = c["forca"] * c["encaixe"] * (1 + 0.5 * (len(c["fontes"]) > 1)) * (1 + 0.5 * c["subindo"])
    seguros.sort(key=lambda c: c["pre"], reverse=True)
    for c in seguros[:VIRA_AULA_TESTES]:
        c["aula"] = vira_aula(c["termo"])
    for c in seguros:
        aula = c.get("aula") or []
        c["score"] = round(c["pre"] * (1 + 0.5 * min(len(aula), 2) / 2), 2)
        c["sugestao_aula"] = sugestao_aula(c)
    seguros.sort(key=lambda c: c["score"], reverse=True)
    campos = ("termo", "score", "fontes", "volume_txt", "categoria", "subindo", "aula", "contexto", "sugestao_aula", "url")
    top = [{k: c.get(k) for k in campos} for c in seguros[:TOP_HYPE]]
    if bloqueado:
        top = []
    desc = [{"termo": f["termo"], "fonte": f["fonte"], "motivo": f["motivo"]} for f in fora]
    return top, desc, coletados


def anterior(hoje: dt.date) -> list[str] | None:
    files = sorted(p for p in (ROOT / "radar").glob("20??-??-??.json") if p.stem < hoje.isoformat())
    if not files:
        return None
    d = json.loads(files[-1].read_text())
    return d.get("coletados") or d.get("trends", {}).get("BR") or []


# ---------------------------------------------------------------- calendário
def calendario(hoje: dt.date) -> dict:
    f = ROOT / "calendario.json"
    if not f.exists():
        return {"hoje": [], "preparar": [], "proximos": [], "block_hype": False}
    evs = json.loads(f.read_text())["eventos"]
    res = {"hoje": [], "preparar": [], "proximos": [], "block_hype": False}
    for e in evs:
        ini, fim = dt.date.fromisoformat(e["data_inicio"]), dt.date.fromisoformat(e["data_fim"])
        item = {k: e.get(k) for k in ("id", "evento", "data_inicio", "data_fim", "categoria", "seguro",
                                      "block_hype", "tema_aula", "ganchos_ingles", "status")}
        if ini <= hoje <= fim:
            res["hoje"].append(item)
            res["block_hype"] |= bool(e.get("block_hype"))
        elif ini - dt.timedelta(days=e.get("antecedencia_dias", 0)) <= hoje < ini:
            res["preparar"].append({**item, "faltam_dias": (ini - hoje).days})
        elif hoje < ini <= hoje + dt.timedelta(days=14):
            res["proximos"].append({**item, "faltam_dias": (ini - hoje).days})
    return res


# ---------------------------------------------------------------- radar semanal
PERSISTE_DIAS = 3  # assunto em 3+ radares diários da semana = tema da semana


def semanal(hoje: dt.date) -> dict:
    ini = hoje - dt.timedelta(days=6)
    dias = []
    for i in range(7):
        f = ROOT / "radar" / f"{(ini + dt.timedelta(days=i)).isoformat()}.json"
        if f.exists():
            dias.append(json.loads(f.read_text()))
    grupos: list[dict] = []
    for d in dias:
        for h in d.get("hype_seguro", []):
            tk = tokens(h["termo"])
            g = next((g for g in grupos if mesmo_assunto(tk, g["_tk"])), None)
            if g is None:
                g = {"termo": h["termo"], "_tk": tk, "dias": set(), "score_total": 0.0, "categoria": h.get("categoria"),
                     "contexto": h.get("contexto"), "sugestao_aula": h.get("sugestao_aula"), "fontes": set()}
                grupos.append(g)
            g["dias"].add(d["date"])
            g["score_total"] += h.get("score") or 0
            g["fontes"].update(h.get("fontes") or [])
    temas = [{"termo": g["termo"], "dias": len(g["dias"]), "datas": sorted(g["dias"]), "score_total": round(g["score_total"], 2),
              "categoria": g["categoria"], "fontes": sorted(g["fontes"]), "contexto": g["contexto"],
              "sugestao_aula": g["sugestao_aula"]}
             for g in grupos if len(g["dias"]) >= PERSISTE_DIAS]
    temas.sort(key=lambda t: (t["dias"], t["score_total"]), reverse=True)
    prox = calendario(hoje + dt.timedelta(days=1))
    semana_que_vem = [e for e in prox["hoje"] + prox["preparar"] + prox["proximos"]
                      if dt.date.fromisoformat(e["data_inicio"]) <= hoje + dt.timedelta(days=7)]
    bloqueios = [e["data_inicio"] for e in semana_que_vem if e.get("block_hype")]
    return {"version": 1, "date": hoje.isoformat(), "janela": [ini.isoformat(), hoje.isoformat()],
            "radares_lidos": len(dias), "tema_da_semana": temas[0] if temas else None, "temas_persistentes": temas[:5],
            "calendario_proxima_semana": semana_que_vem, "dias_bloqueados": bloqueios,
            "fallback": None if temas else "sem tema persistente: episódios contextualizam com o calendário da semana"}


def markdown_semanal(d: dict) -> str:
    L = [f"# Radar semanal CapyFala — {d['janela'][0]} a {d['janela'][1]}", "",
         f"Radares diários lidos: {d['radares_lidos']}/7. Tema da semana = assunto seguro em {PERSISTE_DIAS}+ dias.", ""]
    t = d["tema_da_semana"]
    L += ["## Tema da semana", f"**{t['termo']}** — {t['dias']} dias ({', '.join(t['datas'])}) · {t.get('categoria')}",
          f"Aula: {t.get('sugestao_aula')}", ""] if t else ["## Tema da semana", d["fallback"], ""]
    if d["temas_persistentes"][1:]:
        L += ["## Outros persistentes"] + [f"- {x['termo']} ({x['dias']} dias)" for x in d["temas_persistentes"][1:]] + [""]
    L += ["## Calendário da próxima semana"]
    L += [f"- {e['data_inicio']}: {e['evento']}{' — BLOQUEIO DE HYPE' if e.get('block_hype') else ''} · aula: {e.get('tema_aula')}"
          for e in d["calendario_proxima_semana"]] or ["- (nada no calendário)"]
    return "\n".join(L) + "\n"


# ---------------------------------------------------------------- demanda (dúvidas de aula)
def autocomplete(seed: str, hl: str, gl: str) -> list[str]:
    q = urllib.parse.urlencode({"client": "firefox", "ds": "yt", "hl": hl, "gl": gl, "q": seed})
    return json.loads(get(f"https://suggestqueries.google.com/complete/search?{q}"))[1]


def age_days(text: str) -> float:
    """'5y ago' / '3 months ago' / 'há 2 semanas' / 'hace 4 días' -> dias."""
    t = norm(text)
    m = re.search(r"(\d+)\s*(mo|mes|y|ano|an|w|sem|d|dia|h|m|s)", t)
    if not m:
        return 9999
    mult = {"s": 0, "m": 0, "h": 0, "d": 1, "dia": 1, "w": 7, "sem": 7, "mo": 30, "mes": 30, "y": 365, "ano": 365, "an": 365}
    return int(m.group(1)) * mult[m.group(2)]


AULA_RX = {
    "pt": r"ingl\w*|english|aula\w*|aprend\w*|curso|como (?:se )?(?:diz|fala\w*|escreve|pronuncia)|pronuncia\w*|vocabul\w*"
          r"|frases?|girias?|expresso\w*|gramatica|verbo\w*|dicas?|erros?|fluen\w*|conversa\w*|iniciante\w*|teacher|professor\w*",
    "es": r"portugu\w*|aprend\w*|clases?|curso|como se dice|pronunci\w*|frases?|vocabul\w*|palabras?|gramatic\w*|verbos?",
    "en": r"portuguese|learn\w*|lesson\w*|course|how to (?:say|speak|pronounce)|pronunc\w*|phrases?|vocab\w*|words?"
          r"|grammar|slang|verbs?",
}
RUIDO = re.compile(r"\b(?:trailer|clipe|clip|official (?:music )?video|video oficial|videoclip\w*|lyrics?|letra|erros de gravacao"
                   r"|bloopers?|react\w*|reacao|cenas?|ao vivo|live|audio oficial|remix|cover|karaoke|full movie"
                   r"|filme completo|episodio completo|canciones|cancion|musica|song|songs|asmr)\b")


def search(query: str, hl: str, gl: str) -> list[dict]:
    q = urllib.parse.urlencode({"search_query": query, "gl": gl, "hl": hl})
    page = get(f"https://www.youtube.com/results?{q}", hl)
    m = re.search(r"var ytInitialData = (\{.*?\});</script>", page)
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


def score(videos: list[dict], hl: str) -> dict:
    aula = re.compile(r"\b(?:" + AULA_RX[hl] + r")\b")
    ok = [v for v in videos if v["views"] and v["views"] <= MAX_VIEWS_AULA
          and aula.search(norm(v["title"])) and not RUIDO.search(norm(v["title"]))]
    if len(ok) < MIN_VIDEOS_AULA:
        return {"score": 0, "validos": len(ok)}
    med = statistics.median(v["views"] for v in ok)
    stale = sum(v["age"] > 365 for v in ok) / len(ok)
    recent = sum(v["age"] <= 90 for v in ok)
    return {
        "score": round(math.log10(med + 1) * (0.5 + stale) / (1 + recent), 2), "validos": len(ok),
        "median_views": int(med), "stale_pct": round(stale * 100), "recent": recent,
        "top": max(ok, key=lambda v: v["views"]),
    }


def demanda(log: list[str]) -> tuple[dict, list[dict]]:
    pairs, desc = {}, []
    for pair, (hl, gl, seeds) in PAIRS.items():
        queries = []
        for s in seeds:
            try:
                sug = autocomplete(s, hl, gl)
            except Exception as e:
                log.append(f"autocomplete '{s}': FALHOU ({e})")
                sug = []
            for q in sug:
                if q in queries:
                    continue
                m = motivo_bloqueio(q)
                if m:
                    desc.append({"termo": q, "fonte": f"autocomplete-{gl}", "motivo": m})
                elif RUIDO.search(norm(q)):
                    desc.append({"termo": q, "fonte": f"autocomplete-{gl}", "motivo": "ruído: busca de clipe/série/música, não de aula"})
                else:
                    queries.append(q)
            time.sleep(0.3)
        rows = []
        for q in queries[:QUERIES_PER_PAIR * 2]:
            try:
                rows.append({"query": q, **score(search(q, hl, gl), hl)})
            except Exception as e:
                rows.append({"query": q, "score": 0, "error": str(e)})
            time.sleep(1)
        rows.sort(key=lambda r: r["score"], reverse=True)
        pairs[pair] = rows
        log.append(f"demanda {pair}: {len(rows)} buscas, {sum(r['score'] > 0 for r in rows)} com amostra válida")
    return pairs, desc


# ---------------------------------------------------------------- trava de conteúdo infantil
# Dúvida com cara de aula infantil (cores, animais, números...) empurra o roteiro para "feito para crianças"
# (made for kids) -> no canal adulto isso derruba comentários/recomendação. Marcamos `infantil: true` e o
# roteirista ignora. Fica aqui (e não no BLOQUEIO) porque é tema válido para o futuro CapyKids.
INFANTIL = re.compile(r"\b(?:" + "|".join([
    r"cores?", r"colou?rs?", r"animais", r"animal", r"animals?", r"bichos?", r"numeros?", r"numbers?",
    r"contar de", r"de 1 a (?:10|20|100)", r"alfabeto", r"abc", r"alphabet", r"letras do alfabeto",
    r"frutas?", r"fruits?", r"legumes", r"partes do corpo", r"corpo humano", r"body parts?",
    r"formas geometricas", r"shapes", r"brinquedos?", r"desenhos?", r"musica infantil",
    r"para (?:as )?criancas", r"pra criancas", r"criancas?", r"infantil", r"infantis", r"kids?", r"children",
    r"nursery", r"toddlers?", r"baby", r"bebes?",
]) + r")\b")


def cara_de_infantil(*textos: str) -> bool:
    """True se a busca (ou o título do vídeo-topo dela) tem cara de conteúdo infantil."""
    return any(INFANTIL.search(norm(t or "")) for t in textos)


def marcar_infantil(duvidas: list[dict]) -> list[dict]:
    for r in duvidas:
        r["infantil"] = cara_de_infantil(r.get("query", ""), (r.get("top") or {}).get("title", ""))
    return duvidas


# ---------------------------------------------------------------- saída
def markdown(data: dict) -> str:
    ev = data["evento_do_dia"]
    L = [f"# Radar CapyFala v2 — {data['date']}", ""]
    L += ["## Evento do dia", ""]
    if ev["block_hype"]:
        L += ["**BLOQUEIO DE HYPE HOJE** (dia de eleição): seção de hype vazia. Só quadros neutros/atemporais.", ""]
    for rot, key in (("Hoje", "hoje"), ("Preparar (dentro da antecedência)", "preparar"), ("Próximos 14 dias", "proximos")):
        L.append(f"**{rot}:**")
        if not ev[key]:
            L.append("- nada")
        for e in ev[key]:
            falta = f" (faltam {e['faltam_dias']} d)" if "faltam_dias" in e else ""
            L.append(f"- {e['data_inicio']} · {e['evento']}{falta} — aula: {e['tema_aula']} [{e['status']}]")
        L.append("")

    L += ["## Hype seguro (top 10)", "",
          "Score = força do volume (log10) × encaixe (esporte/pop 1,0 · TV 0,8 · música BR 0,6 · outro 0,3)"
          " × 1,5 se em 2+ fontes × 1,5 se subindo (não estava no radar anterior) × até 1,5 se o autocomplete"
          " mostra busca de aula (\"<termo> em inglês\"). Pesos = estimativa; recalibrar com a retenção real.", ""]
    if not data["hype_seguro"]:
        L.append("_vazio_" + (" (bloqueio de hype)" if ev["block_hype"] else ""))
    else:
        L += ["| # | Termo | Score | Fontes | Volume | Tipo | Vira aula? | Sugestão de aula | Contexto |",
              "|---|---|---|---|---|---|---|---|---|"]
        for i, h in enumerate(data["hype_seguro"], 1):
            aula = "; ".join((h.get("aula") or [])[:2]) or "não"
            sub = " ↑" if h["subindo"] else ""
            L.append(f"| {i} | {h['termo']}{sub} | {h['score']} | {', '.join(h['fontes'])} | {h['volume_txt']} | "
                     f"{h['categoria']} | {aula} | {h['sugestao_aula']} | {(h.get('contexto') or '')[:90]} |")
    L.append("")

    L += ["## Dúvidas de inglês em alta (YouTube BR, só vídeos que são aula)", ""]
    if not data["duvidas_em_alta"]:
        L.append("_não rodou (--so-hype) ou sem amostra válida_")
    else:
        L += ["Infantil = cara de conteúdo infantil (cores, animais, números...): o roteirista do canal adulto ignora.", "",
              "| # | Busca | Score | Mediana views | Topo >1 ano | Recentes | Vídeos-aula válidos | Infantil |",
              "|---|---|---|---|---|---|---|---|"]
        for i, r in enumerate(data["duvidas_em_alta"], 1):
            L.append(f"| {i} | {r['query']} | {r['score']} | {r.get('median_views', 0):,} | {r.get('stale_pct', 0)}% | "
                     f"{r.get('recent', 0)} | {r.get('validos', 0)} | {'SIM (ignorada)' if r.get('infantil') else 'não'} |")
    L.append("")
    for pair, rows in data.get("demanda", {}).items():
        if pair == "en-para-brasileiros":
            continue
        top = [f"{r['query']} ({r['score']})" for r in rows[:5] if r["score"] > 0]
        L.append(f"- **{pair}** (futuros canais): " + (" · ".join(top) or "sem amostra válida"))
    L.append("")

    L += ["## Descartados (nunca vão para o roteirista)", "", "| Termo | Fonte | Motivo |", "|---|---|---|"]
    for d in data["descartados"]:
        L.append(f"| {d['termo']} | {d['fonte']} | {d['motivo'].replace('|', '/')} |")
    L += ["", "## Log das fontes", ""] + [f"- {x}" for x in data["log"]] + [""]
    return "\n".join(L)


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--so-hype", action="store_true", help="pula a demanda do YouTube")
    ap.add_argument("--data", help="AAAA-MM-DD (simula outra data para calendário/bloqueio)")
    ap.add_argument("--testar-filtro", nargs="+", metavar="TERMO")
    ap.add_argument("--semanal", action="store_true", help="gera o radar semanal a partir dos diários")
    args = ap.parse_args()

    if args.semanal:
        hoje = dt.date.fromisoformat(args.data) if args.data else dt.date.today()
        d = semanal(hoje)
        out = ROOT / "radar"
        out.mkdir(exist_ok=True)
        (out / f"semana-{hoje.isoformat()}.json").write_text(json.dumps(d, ensure_ascii=False, indent=2))
        (out / f"semana-{hoje.isoformat()}.md").write_text(markdown_semanal(d))
        tema = d["tema_da_semana"]["termo"] if d["tema_da_semana"] else "nenhum (usa calendário)"
        print(f"ok: radar/semana-{hoje.isoformat()}.md  (tema: {tema}; radares lidos: {d['radares_lidos']})")
        return

    if args.testar_filtro:
        for t in args.testar_filtro:
            print(f"{t!r:40} -> {motivo_bloqueio(t) or 'SEGURO'}{'  [infantil]' if cara_de_infantil(t) else ''}")
        return

    hoje = dt.date.fromisoformat(args.data) if args.data else dt.date.today()
    log: list[str] = []
    ev = calendario(hoje)
    top, desc, coletados = hype(hoje, ev["block_hype"], log)
    pairs, desc_dem = ({}, []) if args.so_hype else demanda(log)
    duvidas = marcar_infantil([r for r in pairs.get("en-para-brasileiros", []) if r["score"] > 0][:10])

    data = {
        "version": 2, "date": hoje.isoformat(),
        "evento_do_dia": ev, "hype_seguro": top, "duvidas_em_alta": duvidas,
        "descartados": desc + desc_dem, "demanda": pairs, "coletados": coletados, "log": log,
    }
    out = ROOT / "radar"
    out.mkdir(exist_ok=True)
    (out / f"{hoje.isoformat()}.md").write_text(markdown(data))
    (out / f"{hoje.isoformat()}.json").write_text(json.dumps(data, ensure_ascii=False, indent=2))
    print(f"ok: radar/{hoje.isoformat()}.md  (hype seguro: {len(top)}, descartados: {len(data['descartados'])})")
    for x in log:
        print("  ", x)


if __name__ == "__main__":
    sys.exit(main())
