"""2ª tentativa do teste de música Lyria 3.5 (3 estilos), depois do travamento content_blocked de 28/10
(ver `ponte/AVISOS.md`, aviso "teste de música travou"). Estudo: `ponte/saida/estudo-musica-autoral.md`.
Letra/estrutura: `ponte/saida/musica-numeros-1a10.md`.

CHAVE: nenhuma chave no código nem no ambiente. Ela entra como "Credencial de API" do ambiente e o proxy injeta o
header x-goog-api-key sozinho em generativelanguage.googleapis.com (igual a scripts/teste_voz.py). Nunca procurar
nem imprimir a chave.

API: Gemini Interactions (REST), não generateContent:
  POST https://generativelanguage.googleapis.com/v1beta/interactions
  body: {"model": "lyria-3.5", "input": "<prompt>"}
  resposta: {"steps": [...]}; conveniência output_audio.data (base64) e output_text.

Hipóteses testadas NA ORDEM, 1 chamada cada, parando no 1º sucesso de cada estilo (pedido do Felipe, 29/10):
  (a) estilo só com gênero, andamento, voz e instrumentos — sem adjetivo de artista/país/década
  (b) letra só em inglês (números + refrão), sem nenhuma fala em português misturada
  (c) duração pedida de 30 s (soma instrução de duração ao prompt de b)

Uso (a partir de canal-idiomas/):
  .venv/bin/python scripts/teste_musica_2.py --dry-run              # mostra os prompts, não chama nada
  .venv/bin/python scripts/teste_musica_2.py --estilo bossa --hipotese a
  .venv/bin/python scripts/teste_musica_2.py --estilo arena --hipotese b

Saída: ponte/saida/teste-musica/bruto/<estilo>_<hipotese>.mp3 (+ .json com a resposta crua, sem a chave)
Teto desta rodada: US$ 0,32 (máx. 4 chamadas a US$ 0,08). O script não impõe o teto sozinho — quem decide quando
parar é quem o chama (este script só avisa o custo acumulado a cada chamada bem-sucedida).
"""
import argparse
import base64
import json
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT.parent / "ponte" / "saida" / "teste-musica" / "bruto"
GEMINI_API = "https://generativelanguage.googleapis.com/v1beta"
MODELO = "lyria-3.5"
CUSTO_POR_CHAMADA = 0.08

# Letra em INGLÊS puro (musica-numeros-1a10.md §2.1), igual para as 3 hipóteses: nenhuma fala em português entra
# no prompt do gerador (a fala em PT da Capy é só TTS, mixada depois, fora do Lyria).
LETRA = """[Verse - call and echo]
One, two, three
(instrumental, one bar, no vocals)
Four, five, six
(instrumental, one bar, no vocals)
Seven, eight, nine, ten
(instrumental, one bar, no vocals)

[Chorus]
One, two, three, four, five
Six, seven, eight, nine, ten
One, two, three!
(instrumental, one bar, no vocals)

[Outro]
One to ten!"""

REGRAS_COMUNS = (
    "Original instrumental composition. No references to any real artist, band, or existing song. "
    "Clear, intelligible English diction, especially the final consonants of \"three\", \"five\", \"seven\", "
    "\"eight\" (no added vowel sound after them). Very simple, repeated, few-note melody in a mid vocal range "
    "(no high notes). Echo bars after each call stay completely silent of voice, only the rhythm instruments "
    "continue, leaving space for a listener to repeat the words out loud. No children's choir, no nursery-rhyme "
    "melody, no clapping-game feel, no extra ad-libbed lyrics, not childlike or cute."
)

# Estilo por hipótese (a) = só gênero/andamento/voz/instrumentos, sem adjetivo de artista, país ou década.
ESTILO_A = {
    "bossa": (
        "Genre: smooth jazz ballad. Tempo: 96 BPM, 4/4 with a soft swing feel.\n"
        "Lead vocal: adult female, low alto register, close and clear.\n"
        "Instruments: nylon-string guitar, electric piano, upright acoustic bass, brushed drum kit."
    ),
    "arena": (
        "Genre: stadium chant. Tempo: 100 BPM, 4/4, stomp-clap groove.\n"
        "Lead vocal: adult male, low register. Group vocal: mixed adult chorus shouting in unison.\n"
        "Instruments: stomps and hand claps, marching snare drum, deep floor toms, low brass stabs, one whistle hit."
    ),
    "pop": (
        "Genre: dance-pop. Tempo: 118 BPM, 4/4, four-on-the-floor groove.\n"
        "Lead vocal: adult female, mezzo-soprano, clear and confident.\n"
        "Instruments: synth bass, kick drum, finger snaps, muted electric guitar, bright synth lead in the chorus."
    ),
}

# Estilo por hipótese (b)/(c) = a descrição rica original (musica-numeros-1a10.md §4), mantendo a letra só em inglês.
ESTILO_RICO = {
    "bossa": (
        "Lo-fi bossa café song, warm, relaxed, adult, intimate coffee-shop mood, 96 BPM, 4/4 with a gentle bossa "
        "groove.\n"
        "Lead vocal: adult female contralto, warm, close-mic, almost spoken but in tune, extremely clear English "
        "articulation, not childlike.\n"
        "Instruments: nylon-string guitar with bossa rhythm, soft electric piano, upright acoustic bass, brushed "
        "drums, light vinyl crackle. Echo bars: guitar and bass only, no voice."
    ),
    "arena": (
        "Stadium arena chant, sports-arena energy, adult and powerful, 100 BPM, 4/4, stomp-stomp-clap groove.\n"
        "Lead vocal: adult male, low and punchy, half-sung half-shouted like an arena hype man. Chorus: adult mixed "
        "crowd shouting in unison.\n"
        "Instruments: stomps and claps, marching snare drumline, deep floor toms, short low brass stabs, one "
        "referee whistle on the final bar. Echo bars: only stomps and kick drum, no voice."
    ),
    "pop": (
        "Adult Brazilian-influenced dance-pop, catchy and confident, polished modern production, 118 BPM, 4/4.\n"
        "Lead vocal: adult female mezzo-soprano, clear and confident, no vibrato, not childlike.\n"
        "Instruments: warm synth bass, soft four-on-the-floor kick, finger snaps on 2 and 4, muted funky electric "
        "guitar, bright synth lead only in the chorus. Echo bars: only bass and kick, no voice."
    ),
}


def montar_prompt(estilo: str, hipotese: str) -> str:
    if hipotese == "a":
        corpo_estilo = ESTILO_A[estilo]
    else:
        corpo_estilo = ESTILO_RICO[estilo]
    duracao = ""
    if hipotese == "c":
        duracao = "\n\nMake this a short song, about 30 seconds long in total."
    return f"{corpo_estilo}\n\n{REGRAS_COMUNS}{duracao}\n\nLyrics:\n{LETRA}"


def chamar(prompt: str) -> dict:
    url = f"{GEMINI_API}/interactions"
    body = json.dumps({"model": MODELO, "input": prompt}).encode()
    headers = {"Content-Type": "application/json", "x-goog-api-key": "proxy-injected"}
    req = urllib.request.Request(url, data=body, method="POST", headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=180) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as e:  # nunca logar headers: a chave não aparece aqui
        corpo = e.read()
        raise SystemExit(f"HTTP {e.code} em {url}: {corpo[:800].decode(errors='replace')}")


def extrair_audio(resposta: dict) -> tuple[bytes, str] | None:
    oa = resposta.get("output_audio")
    if oa and oa.get("data"):
        return base64.b64decode(oa["data"]), oa.get("mime_type", "audio/mpeg")
    for step in resposta.get("steps", []):
        for bloco in step.get("content", []) or []:
            if bloco.get("type") == "audio" and bloco.get("data"):
                return base64.b64decode(bloco["data"]), bloco.get("mime_type", "audio/mpeg")
    return None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--estilo", choices=["bossa", "arena", "pop"])
    ap.add_argument("--hipotese", choices=["a", "b", "c"])
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    if args.dry_run or not args.estilo:
        for estilo in ESTILO_A:
            for hip in "abc":
                print(f"\n=== {estilo} / hipótese {hip} ===")
                print(montar_prompt(estilo, hip))
        return

    prompt = montar_prompt(args.estilo, args.hipotese)
    print(f"--- prompt ({args.estilo}, hipótese {args.hipotese}) ---\n{prompt}\n---\nchamando {MODELO}...")
    t0 = time.monotonic()
    resposta = chamar(prompt)
    dt = time.monotonic() - t0
    audio = extrair_audio(resposta)
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / f"{args.estilo}_{args.hipotese}.json").write_text(
        json.dumps({k: v for k, v in resposta.items() if k != "output_audio"}, indent=2, ensure_ascii=False))
    if not audio:
        print(f"SEM ÁUDIO na resposta ({dt:.1f}s). Resposta salva em {OUT}/{args.estilo}_{args.hipotese}.json")
        sys.exit(1)
    dados, mime = audio
    ext = "wav" if "wav" in mime else "mp3"
    caminho = OUT / f"{args.estilo}_{args.hipotese}.{ext}"
    caminho.write_bytes(dados)
    print(f"OK ({dt:.1f}s, {len(dados)} bytes, {mime}) -> {caminho} · custo desta chamada: US$ {CUSTO_POR_CHAMADA:.2f}")


if __name__ == "__main__":
    main()
