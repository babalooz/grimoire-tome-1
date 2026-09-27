"""Portão automático do CapyFala: substitui a aprovação humana (o Felipe não aprova vídeo).

Camada 1 (código, reprova sozinha): arquivo, resolução 1080x1920, duração da faixa (episódio 61–140 s · esquete 5–20 s),
  loudness −14 LUFS ±1 e pico verdadeiro ≤ −1 dBTP, e checagens do roteiro (selo da série, gancho ≤ 6 palavras,
  nada de "%"/estatística, nada de marca de terceiros, inglês só em fala `en`, promessa de episódio que existe).
Camada 2 (juiz com rubrica 0–10, aprova com nota ≥ 8): inglês correto, lição útil, história, humor, adulto (não infantil),
  autoral (não "conteúdo inautêntico"). Dois modos:
    - API: se houver acesso à API da Anthropic (ANTHROPIC_API_KEY ou credencial do ambiente), o juiz roda aqui.
    - Rotina: sem API, `--pedido-juiz` imprime rubrica + roteiro; o Claude da rotina avalia e grava com `--juiz`.
Camada 3 (publicar) é o scripts/publicar.py, que só envia se existir <mp4>.portao.json com "aprovado": true.

Uso (a partir de canal-idiomas/, com .venv/bin/python):
  portao.py episodes/<ep>.json                 -> avalia episódio + esquetes renderizados (out/<id>*.mp4)
  portao.py episodes/<ep>.json --pedido-juiz   -> imprime o pedido para o juiz da rotina
  portao.py episodes/<ep>.json --juiz 8.5 --motivos "..."   -> grava a nota do juiz da rotina e fecha o veredito
Saída: out/<arquivo>.portao.json por MP4 = {aprovado, camada1: {ok, falhas, medidas}, juiz: {nota, motivos, fonte}, data}.
"""
import argparse
import warnings
import datetime as dt
import json
import os
import re
import subprocess
import sys
import tempfile
from pathlib import Path

warnings.filterwarnings("ignore", category=DeprecationWarning)
ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(Path(__file__).resolve().parent))
FFPROBE = ROOT / "node_modules/@remotion/compositor-linux-x64-gnu/ffprobe"
FFMPEG = FFPROBE.parent / "ffmpeg"
GANCHO_DIF_MIN = 0.10   # diferença visual média mínima entre o quadro 0 e o de 1 s (0–1); abaixo = gancho parado
# Zonas cobertas pela interface do TikTok (auditoria do PC em 27/09, tela 1080x1920)
ZONAS = {"coluna de botões (x>920, y 900–1700)": (920, 900, 1080, 1700),
         "abas do topo (y<260)": (0, 0, 1080, 260),
         "legenda do app (y>1500)": (0, 1500, 1080, 1920)}
ZONA_MAX = 0.002        # fração máxima de pixels de interface/texto dentro de uma zona (modo auditoria)
ZONA_PERSISTE = 12      # só reprova se a invasão continuar 12 quadros (0,4 s) depois: entradas/saídas animadas passam
NOTA_MIN = 8.0
FAIXA = {"episodio": (61.0, 140.0), "esquete": (5.0, 20.0)}
FAIXA_CAFE = {"episodio": (61.0, 95.0), "esquete": (20.0, 35.0)}  # Sitcom do Café (docs/plano-formato-cafe.md)
# Gatilhos proibidos (regra do Felipe, 27/09): promessa milagrosa, urgência inventada, número zerado, frase do concorrente
GATILHO_PROIBIDO = re.compile(
    r"fluente em \d+|flu[eê]ncia em \d+|m[eé]todo secreto|segredo que ningu[eé]m|[uú]ltimas vagas|s[oó] hoje|corre que|"
    r"antes que (?:acabe|saia)|\b0 (?:seguidores|views|visualiza)|zero (?:seguidores|views|visualiza)|trava na hora de falar", re.I)
PROMESSA = re.compile(r"\bEP ?(\d{1,2})\b|\bamanh[ãa]\b", re.I)
TIPOS_APP = {"ouvir", "traducao", "montar", "ligar", "completar", "cartoes", "revisao", "repetir"}
LUFS_ALVO, LUFS_TOL, TP_MAX = -14.0, 1.0, -1.0
PROIBIDO = re.compile(r"\bduolingo\b|\bduo\b|\bcoruja\b|\bowl\b|%|\bpor ?cento\b", re.I)
EN_COMUNS = set("the and you your is are am i'm it's this that what where how please thank thanks hello hi bye "
                "yes no not good morning night coffee can get have has he she they we my name".split())

RUBRICA = """Você é o juiz de qualidade do canal CapyFala (inglês para brasileiros adultos, personagem Capy, capivara).
Dê nota 0–10 para cada critério e uma nota final (média ponderada, pesos entre parênteses). Seja exigente.
1. Inglês correto e natural (americano), sem erro nas frases ensinadas (3)
2. Ensina sem interação: 1 objetivo claro "Consigo…", a cena deixa o sentido óbvio, frase-alvo repetida e devagar, revisão (2)
3. História contínua e personagens coerentes com o elenco (1)
4. Humor: pelo menos 1 piada que funciona sozinha (1)
5. Adulto: nada que classifique como "feito para crianças" (cantiga, voz de bebê, tema infantil) (2)
6. Autoral: não parece "conteúdo inautêntico"/repetitivo/produzido em massa sem valor (1)
Responda SÓ JSON: {"nota": <0-10>, "criterios": {"1": n, ...}, "motivos": ["..."]}. Motivos curtos e acionáveis."""


# ---------------------------------------------------------------- camada 1: arquivo
def probe(mp4: Path) -> dict:
    out = subprocess.run([str(FFPROBE), "-v", "error", "-show_entries",
                          "format=duration:stream=codec_type,width,height,pix_fmt,color_range,color_space",
                          "-of", "json", str(mp4)], capture_output=True, text=True, check=True,
                         env={**os.environ, "LD_LIBRARY_PATH": str(FFPROBE.parent)}).stdout
    d = json.loads(out)
    v = next(s for s in d["streams"] if s["codec_type"] == "video")
    return {"duracao": round(float(d["format"]["duration"]), 2), "largura": v["width"], "altura": v["height"],
            "cor": f"{v.get('pix_fmt')}/{v.get('color_range')}/{v.get('color_space')}",
            "tem_audio": any(s["codec_type"] == "audio" for s in d["streams"])}


def quadro(mp4: Path, t: float, tmp: Path):
    from PIL import Image
    png = tmp / f"q{t}.png"
    subprocess.run([str(FFMPEG), "-v", "error", "-y", "-ss", str(t), "-i", str(mp4), "-frames:v", "1", str(png)],
                   check=True, env={**os.environ, "LD_LIBRARY_PATH": str(FFMPEG.parent)})
    return Image.open(png).convert("L").resize((108, 192))


def movimento_gancho(mp4: Path) -> float:
    """Diferença média (0–1) entre o quadro 0 e o quadro de 1 s: mede se há corte/zoom/ação no 1º segundo."""
    with tempfile.TemporaryDirectory() as tmp:
        a, b = quadro(mp4, 0, Path(tmp)), quadro(mp4, 1.0, Path(tmp))
    pa, pb = list(a.getdata()), list(b.getdata())
    return round(sum(abs(x - y) for x, y in zip(pa, pb)) / (255 * len(pa)), 3)


def zona_segura(ep_id: str, comp: str, frames: list[int]) -> list[str]:
    """Renderiza quadros no modo auditoria (só interface/texto sobre preto) e procura pixels nas zonas do TikTok."""
    from PIL import Image
    props = ROOT / "out" / (f"props-{ep_id}.json" if ":" not in comp else f"props-{ep_id}-esquete-{comp.split(':')[1]}.json")
    if not props.exists():
        return [f"zona segura: props não encontrados ({props.name})"]
    falhas = []
    with tempfile.TemporaryDirectory() as tmp:
        pa = Path(tmp) / "props.json"
        pa.write_text(json.dumps({**json.loads(props.read_text()), "auditoria": True}))
        nome = comp.split(":")[0]
        ultimo = max(frames)
        todos = sorted({min(f, ultimo) for x in frames for f in (x, x + ZONA_PERSISTE)})
        r = subprocess.run(["node", "scripts/stills.mjs", nome, str(pa), tmp, *map(str, todos)], cwd=ROOT,
                           capture_output=True, text=True)
        if r.returncode:
            return [f"zona segura: falha ao renderizar auditoria ({r.stderr.strip()[-200:]})"]

        def invasoes(png: Path) -> dict:
            im = Image.open(png).convert("L")
            out = {}
            for nomez, (x0, y0, x1, y1) in ZONAS.items():
                reg = im.crop((x0, y0, x1, y1))
                frac = sum(1 for v in reg.getdata() if v > 40) / ((x1 - x0) * (y1 - y0))
                if frac > ZONA_MAX:
                    out[nomez] = frac
            return out
        por_quadro = {int(p.stem.split("-f")[-1]): invasoes(p) for p in Path(tmp).glob("*.png")}
        for f in frames:
            depois = por_quadro.get(min(f + ZONA_PERSISTE, ultimo), {})
            for nomez, frac in por_quadro.get(f, {}).items():
                if nomez in depois:  # parado na zona, não é só transição
                    falhas.append(f"zona segura: {nomez} com {frac:.1%} de interface no quadro {f}")
    return sorted(set(falhas))


def loudness(mp4: Path) -> tuple[float, float]:
    import numpy as np
    import pyloudnorm as pyln
    import soundfile as sf
    from scipy.signal import resample_poly
    with tempfile.TemporaryDirectory() as tmp:
        wav = Path(tmp) / "a.wav"
        subprocess.run(["npx", "remotion", "ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(mp4),
                        "-vn", "-ac", "2", "-ar", "48000", str(wav)], cwd=ROOT, check=True)
        x, sr = sf.read(wav)
    lufs = pyln.Meter(sr).integrated_loudness(x)
    tp = 20 * np.log10(np.abs(resample_poly(x, 4, 1, axis=0)).max() + 1e-12)
    return round(float(lufs), 2), round(float(tp), 2)


def checar_arquivo(mp4: Path, faixa: str, cafe: bool = False) -> tuple[list[str], dict]:
    falhas = []
    if not mp4.exists():
        return [f"MP4 não existe: {mp4.name}"], {}
    m = probe(mp4)
    lo, hi = (FAIXA_CAFE if cafe else FAIXA)[faixa]
    if not lo <= m["duracao"] <= hi:
        falhas.append(f"duração {m['duracao']} s fora da faixa {faixa} ({lo}–{hi} s)")
    if (m["largura"], m["altura"]) != (1080, 1920):
        falhas.append(f"resolução {m['largura']}x{m['altura']} (esperado 1080x1920)")
    if m["cor"] != "yuv420p/tv/bt709":
        falhas.append(f"cor {m['cor']} (esperado yuv420p/tv/bt709: full range lava ou estoura no app)")
    m["movimento_1s"] = movimento_gancho(mp4)
    if m["movimento_1s"] < GANCHO_DIF_MIN:
        falhas.append(f"gancho parado: diferença entre 0 s e 1 s = {m['movimento_1s']} (mín. {GANCHO_DIF_MIN})")
    if not m["tem_audio"]:
        falhas.append("sem trilha de áudio")
    else:
        m["lufs"], m["true_peak"] = loudness(mp4)
        if abs(m["lufs"] - LUFS_ALVO) > LUFS_TOL:
            falhas.append(f"loudness {m['lufs']} LUFS (alvo {LUFS_ALVO} ±{LUFS_TOL})")
        if m["true_peak"] > TP_MAX:
            falhas.append(f"pico verdadeiro {m['true_peak']} dBTP (> {TP_MAX})")
    return falhas, m


# ---------------------------------------------------------------- camada 1: roteiro
def falas(node):
    if isinstance(node, dict):
        if "text" in node and "lang" in node:
            yield node
        for v in node.values():
            yield from falas(v)
    elif isinstance(node, list):
        for v in node:
            yield from falas(v)


def checar_roteiro_cafe(ep: dict) -> list[str]:
    """Regras do formato Sitcom do Café (formato-ensino-video.md §5)."""
    falhas = []
    beats = ep.get("beats") or []
    if not (ep.get("serie") or {}).get("codigo"):
        falhas.append("sem selo de série (serie.codigo)")
    if len((ep.get("hookTitle") or "").split()) > 6:
        falhas.append("hookTitle com mais de 6 palavras")
    alvo = (ep.get("alvo") or {}).get("en", "").lower().rstrip("?.!")
    falas_ = [b for b in beats if "text" in b and "lang" in b]
    exatas = [b for b in falas_ if b.get("alvo") is True]
    if len(exatas) < 5:
        falhas.append(f"frase-alvo só {len(exatas)}× com alvo:true (mínimo 5)")
    bocas = {b.get("speaker") for b in falas_ if b.get("alvo")}
    if len(bocas) < 3:
        falhas.append(f"frase-alvo em só {len(bocas)} boca(s) (mínimo 3)")
    for b in exatas:
        if alvo and alvo.replace(",", "") not in b["text"].lower().replace("...", "").replace(",", "").replace("  ", " "):
            falhas.append(f"fala marcada como alvo não contém a frase-alvo: {b['text']!r}")
    for b in falas_:
        n = len(b["text"].replace("...", " ").split())
        if b["lang"] == "en" and n > (8 if ep.get("level", "A1") == "A1" else 12):
            falhas.append(f"fala em inglês longa demais ({n} palavras): {b['text']!r}")
        if b["lang"] == "pt" and n > 14:
            falhas.append(f"fala em português longa demais ({n} palavras): {b['text']!r}")
        if PROIBIDO.search(b["text"]):
            falhas.append(f"termo proibido/estatística sem fonte: {b['text']!r}")
    if sum(1 for b in beats if b.get("errado")) > 1:
        falhas.append("a forma errada aparece mais de 1 vez")
    if falas_ and falas_[-1].get("errado"):
        falhas.append("a última fala é a forma errada")
    if sum(1 for b in beats if b.get("tipo") == "pergunta") > 1:
        falhas.append("mais de 1 pergunta no vídeo")
    if any(b.get("tipo") in TIPOS_APP for b in beats) or "licao" in ep:
        falhas.append("tem exercício de app (formato abandonado)")
    textos = [b.get("text", "") for b in beats] + [b.get("cardTexto", "") for b in beats] + [
        ep.get("hookTitle", ""), ep.get("title", "")] + [x.get(k, "") for x in ep.get("esquetes") or [] for k in ("gancho", "cta")]
    for t in textos:
        if GATILHO_PROIBIDO.search(t):
            falhas.append(f"gatilho proibido: {t!r}")
    falhas += promessas(ep, textos)
    en_vocab = {w.lower() for b in falas_ if b["lang"] == "en" for w in re.findall(r"[A-Za-z']+", b["text"])}
    en_vocab -= {"capy", "lazy", "hank", "duda", "poppy", "bolinha", "jaca", "a", "i", "o", "e", "time"}
    for b in falas_:
        if b["lang"] == "pt":
            ing = sorted({w.lower() for w in re.findall(r"[A-Za-z']+", b["text"])} & en_vocab & EN_COMUNS - {"no", "a"})
            if ing:
                falhas.append(f"inglês dentro de fala pt ({', '.join(ing)}): {b['text']!r}")
    en = [b for b in falas_ if b["lang"] == "en"]
    pal_en = sum(len(b["text"].split()) for b in en)
    pal_tot = sum(len(b["text"].split()) for b in falas_) or 1
    if pal_en / pal_tot < 0.35:
        falhas.append(f"inglês só {pal_en / pal_tot:.0%} das palavras faladas (mínimo 35%)")
    return sorted(set(falhas))


def promessas(ep: dict, textos: list[str]) -> list[str]:
    """Laço aberto ('amanhã', 'EP 08') só se o episódio prometido existe E está na grade (config/grade.json)."""
    atual = (ep.get("serie") or {}).get("episodio")
    temp = (ep.get("serie") or {}).get("temporada", 1)
    grade = ROOT / "config" / "grade.json"
    agendados = set()
    if grade.exists():
        agendados = {p.get("episodio") for g in json.loads(grade.read_text()).get("grade", []) for p in g["posts"]}
    eps = [json.loads(f.read_text()) for f in (ROOT / "episodes").glob("*.json")]
    existentes = {(x.get("serie") or {}).get("codigo") for x in eps if x.get("format") == ep.get("format")}
    falhas = []
    for t in textos:
        for m in PROMESSA.finditer(t or ""):
            n = int(m.group(1)) if m.group(1) else (atual or 0) + 1
            if n == atual:
                continue  # "aula completa no EP 01" dentro do próprio EP 01
            cod = f"T{temp} E{n:02d}"
            if cod not in existentes or cod not in agendados:
                falhas.append(f"promete {cod} ({t!r}) mas ele não existe ou não está agendado na grade")
    return falhas


def checar_roteiro(ep: dict) -> list[str]:
    if ep.get("format") == "cafe":
        return checar_roteiro_cafe(ep)
    falhas = []
    serie = ep.get("serie") or {}
    if not serie.get("codigo"):
        falhas.append("sem selo de série (serie.codigo)")
    if len((ep.get("hookTitle") or "").split()) > 6:
        falhas.append(f"hookTitle com mais de 6 palavras: {ep['hookTitle']!r}")
    todas = list(falas({k: ep[k] for k in ("cena", "licao", "volta", "esquetes") if k in ep}))
    en_vocab = {w.lower() for f in todas if f["lang"] == "en" for w in re.findall(r"[A-Za-z']+", f["text"])}
    en_vocab -= {"capy", "lazy", "hank", "duda", "poppy", "bolinha", "jaca", "a", "i", "o", "e"}
    for f in todas:
        if PROIBIDO.search(f["text"]):
            falhas.append(f"termo proibido/estatística sem fonte: {f['text']!r}")
        if f["lang"] == "pt":
            palavras = {w.lower() for w in re.findall(r"[A-Za-z']+", f["text"])}
            ingles = sorted((palavras & en_vocab & EN_COMUNS) - {"no", "a"})
            if ingles:
                falhas.append(f"inglês dentro de fala pt ({', '.join(ingles)}): {f['text']!r}")
    for e in ep.get("esquetes") or []:
        if len((e.get("gancho") or "").split()) > 6:
            falhas.append(f"esquete {e.get('id')}: gancho com mais de 6 palavras")
    prox = ep.get("nextEpisodeId")
    if prox and not list((ROOT / "episodes").glob(f"{prox}*.json")):
        falhas.append(f"promete o próximo episódio ({prox}) mas o arquivo não existe")
    return sorted(set(falhas))


# ---------------------------------------------------------------- camada 2: juiz
def roteiro_texto(ep: dict) -> str:
    if ep.get("format") == "cafe":
        linhas = [f"{ep['serie']['codigo']} — objetivo: {ep.get('canDo', '')}",
                  f"frase-alvo: {ep['alvo']['en']} = {ep['alvo']['pt']} · forma errada: {ep.get('errado', {}).get('en', '-')}"]
        for b in ep["beats"]:
            if b.get("tipo") == "pausa":
                linhas.append(f"[reação muda {b['s']} s: {b.get('react', {})}]")
            elif b.get("tipo") == "pergunta":
                linhas.append(f"[PERGUNTA na tela, {b['s']} s de silêncio: {b['text']}]")
            else:
                marca = " (ALVO)" if b.get("alvo") is True else " (variação)" if b.get("alvo") else ""
                marca += " (ERRADO, riscado)" if b.get("errado") else ""
                marca += " [pausa para o espectador repetir]" if b.get("repita") else ""
                linhas.append(f"{b['speaker']} ({b['lang']}){marca}: {b['text']}")
        return "\n".join(linhas)
    linhas = [f"{ep.get('serie', {}).get('codigo', ep['id'])} — objetivo: {ep.get('canDo', '')}",
              f"erro de brasileiro: {ep.get('erroBrasileiro', '')}"]
    for bloco in ("cena", "licao", "volta"):
        linhas.append(f"--- {bloco}")
        if bloco == "licao":
            for i, ex in enumerate(ep.get("licao", {}).get("exercicios", [])):
                tela = {k: v for k, v in ex.items() if k not in ("passos", "falas") and not isinstance(v, (dict,))}
                linhas.append(f"[exercício {i + 1}] {json.dumps(tela, ensure_ascii=False)[:400]}")
                linhas += [f"  {f.get('speaker', 'capi')} ({f['lang']}): {f['text']}" for f in falas(ex)]
            continue
        linhas += [f"{f.get('speaker', 'capi')} ({f['lang']}): {f['text']}" for f in falas(ep.get(bloco, {}))]
    return "\n".join(linhas)


def juiz_api(ep: dict) -> dict | None:
    try:
        import anthropic
    except ImportError:
        return None
    try:
        client = anthropic.Anthropic() if os.environ.get("ANTHROPIC_API_KEY") else anthropic.Anthropic(api_key="injetada")
        r = client.messages.create(model="claude-opus-5", max_tokens=2000, system=RUBRICA,
                                   messages=[{"role": "user", "content": roteiro_texto(ep)}])
        texto = next(b.text for b in r.content if b.type == "text")
        d = json.loads(texto[texto.index("{"): texto.rindex("}") + 1])
        return {"nota": float(d["nota"]), "motivos": d.get("motivos", []), "criterios": d.get("criterios", {}),
                "fonte": "api"}
    except Exception as e:  # sem acesso à API: cai no juiz da rotina
        print(f"juiz API indisponível ({type(e).__name__}); use --pedido-juiz / --juiz", file=sys.stderr)
        return None


# ---------------------------------------------------------------- veredito
def videos(ep: dict) -> list[tuple[Path, str]]:
    if ep.get("format") == "cafe":
        return [(ROOT / "out" / f"{ep['id']}.mp4", "episodio")] + [
            (ROOT / "out" / f"{ep['id']}-esquete-{e['id']}.mp4", "esquete") for e in ep.get("esquetes") or []]
    out = [(ROOT / "out" / f"{ep['id']}.mp4", "episodio")]
    out += [(ROOT / "out" / f"{ep['id']}-esquete-{e['id']}.mp4", "esquete") for e in ep.get("esquetes") or []]
    return out


def gravar(mp4: Path, c1: dict, juiz: dict | None) -> dict:
    aprovado = c1["ok"] and juiz is not None and juiz["nota"] >= NOTA_MIN
    v = {"aprovado": aprovado, "camada1": c1, "juiz": juiz, "nota_minima": NOTA_MIN,
         "data": dt.datetime.now(dt.timezone.utc).isoformat(timespec="seconds")}
    mp4.with_suffix(".portao.json").write_text(json.dumps(v, ensure_ascii=False, indent=2))
    return v


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("episodio")
    ap.add_argument("--pedido-juiz", action="store_true")
    ap.add_argument("--juiz", type=float, metavar="NOTA")
    ap.add_argument("--motivos", default="")
    ap.add_argument("--sem-midia", action="store_true", help="não sobe os aprovados para o branch midia")
    args = ap.parse_args()
    ep = json.loads(Path(args.episodio).read_text())

    if args.pedido_juiz:
        print(RUBRICA + "\n\n=== ROTEIRO ===\n" + roteiro_texto(ep))
        print(f"\nDepois grave: .venv/bin/python scripts/portao.py {args.episodio} --juiz <nota> --motivos \"...\"")
        return

    falhas_roteiro = checar_roteiro(ep)
    juiz = None
    if args.juiz is not None:
        juiz = {"nota": args.juiz, "motivos": [m.strip() for m in args.motivos.split(";") if m.strip()],
                "fonte": "rotina"}
    else:
        juiz = juiz_api(ep)
    aprovados = 0
    for mp4, faixa in videos(ep):
        cafe = ep.get("format") == "cafe"
        falhas_arq, medidas = checar_arquivo(mp4, faixa, cafe)
        if mp4.exists():
            dur_f = int(medidas.get("duracao", 0) * 30)
            base = "Cafe" if cafe else "Licao"
            comp = base if faixa == "episodio" else f"{base}Esquete:{mp4.stem.rsplit('-', 1)[-1]}"
            fim = max(dur_f - 2, 31)
            falhas_arq += zona_segura(ep["id"], comp, sorted({f for f in (0, 15, 30, *range(60, fim, 90)) if f <= fim}))
        c1 = {"ok": not (falhas_arq or falhas_roteiro), "falhas": falhas_arq + falhas_roteiro, "medidas": medidas}
        v = gravar(mp4, c1, juiz)
        aprovados += v["aprovado"]
        status = "APROVADO" if v["aprovado"] else "REPROVADO"
        nota = f"juiz {juiz['nota']}" if juiz else "juiz pendente"
        print(f"{status:9} {mp4.name} ({faixa}, {medidas.get('duracao', '?')} s, {medidas.get('lufs', '?')} LUFS, {nota})")
        for f in c1["falhas"]:
            print(f"   - {f}")
    aprovados_mp4 = [m for m, _ in videos(ep) if m.with_suffix(".portao.json").exists()
                     and json.loads(m.with_suffix(".portao.json").read_text()).get("aprovado")]
    if aprovados_mp4 and not args.sem_midia:  # regra do PC: aprovado vai pro branch midia no mesmo passo
        from publicar import hospedar
        urls = hospedar(aprovados_mp4, dt.date.today())
        print(f"midia: commit {urls['_commit'][:7]} · " + ", ".join(m.name for m in aprovados_mp4))
        cod = (ep.get("serie") or {}).get("codigo", ep["id"])
        subprocess.run(["bash", str(ROOT / "scripts" / "aviso.sh"), f"portão {cod}: {len(aprovados_mp4)} vídeo(s) aprovado(s) no branch midia",
                        f"commit {urls['_commit']}: " + ", ".join(m.name for m in aprovados_mp4),
                        "PC auditar (duração, cor, movimento 0–1 s, zona segura)"], check=False)
    if juiz is None:
        print("Camada 2 pendente: rode com --pedido-juiz, avalie e grave com --juiz <nota> --motivos \"a; b\".")
    elif juiz["nota"] < NOTA_MIN:
        print(f"Juiz reprovou ({juiz['nota']} < {NOTA_MIN}): " + "; ".join(juiz["motivos"]))
    sys.exit(0 if aprovados == len(videos(ep)) else 1)


if __name__ == "__main__":
    main()
