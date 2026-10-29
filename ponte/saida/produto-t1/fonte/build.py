"""Gera isca.html e apostila.html (A4) a partir de dados.py. Uso: python3 build.py"""
import base64, html, sys
from pathlib import Path
D = Path(__file__).parent
sys.path.insert(0, str(D))
from dados import A, REVISOES

def b64(name):
    mime = "image/png" if name.endswith(".png") else ("font/woff2" if name.endswith(".woff2") else "image/jpeg")
    return f"data:{mime};base64," + base64.b64encode((D / name).read_bytes()).decode()

e = html.escape
AV = {"Capy": b64("av_capy.jpg"), "Hank": b64("av_hank.jpg"), "Lazy": b64("av_lazy.jpg")}
COR = {"Capy": "#C98A4B", "Hank": "#1A0B45", "Lazy": "#C9A227", "Duda": "#D9542B", "Poppy": "#FF7FB0",
       "Bolinha": "#E8A33C", "Dona Jaca": "#8A5A2E"}

CSS = f"""
@font-face {{ font-family: Lilita; src: url({b64('LilitaOne.woff2')}) format('woff2'); }}
@font-face {{ font-family: Rubik; src: url({b64('Rubik-latin.woff2')}) format('woff2'); font-weight: 300 900; }}
@page {{ size: A4; margin: 0; }}
* {{ box-sizing: border-box; margin: 0; padding: 0; }}
body {{ font-family: Rubik, sans-serif; color: #1A0B45; -webkit-print-color-adjust: exact; print-color-adjust: exact; }}
.page {{ width: 210mm; height: 297mm; padding: 16mm 15mm 14mm; position: relative; overflow: hidden; page-break-after: always;
  background: #FFF4E0; }}
.page:last-child {{ page-break-after: auto; }}
.rodape {{ position: absolute; bottom: 7mm; left: 15mm; right: 15mm; display: flex; justify-content: space-between;
  font-size: 8.5pt; color: #6b5a9a; font-weight: 600; }}
h1, h2, h3, .lilita {{ font-family: Lilita, sans-serif; font-weight: 400; }}
.capa {{ background: #3D1F8F; color: #FFF4E0; padding: 0; }}
.capa .topo {{ padding: 20mm 16mm 0; }}
.marca {{ font-family: Lilita; font-size: 22pt; color: #FFCC00; letter-spacing: .5px; }}
.capa h1 {{ font-size: 46pt; line-height: 1.02; margin-top: 10mm; color: #fff; }}
.capa .sub {{ font-size: 15pt; margin-top: 6mm; font-weight: 600; color: #FFF4E0; max-width: 160mm; line-height: 1.35; }}
.capa .foto {{ position: absolute; left: 0; right: 0; bottom: 0; height: 120mm; background-size: cover; background-position: center;
  border-top: 3mm solid #FFCC00; }}
.capa .selo {{ display: inline-block; background: #FFCC00; color: #1A0B45; font-family: Lilita; font-size: 13pt; padding: 2mm 5mm;
  border-radius: 99px; margin-top: 8mm; }}
.titulo-pag {{ font-family: Lilita; font-size: 26pt; color: #3D1F8F; margin-bottom: 5mm; }}
p {{ font-size: 11pt; line-height: 1.5; margin-bottom: 3mm; }}
.passos {{ counter-reset: p; margin: 2mm 0 6mm; }}
.passo {{ display: flex; gap: 4mm; align-items: flex-start; margin-bottom: 3.2mm; font-size: 11pt; line-height: 1.45; }}
.passo b.n {{ flex: none; width: 8mm; height: 8mm; border-radius: 50%; background: #3D1F8F; color: #FFCC00; font-family: Lilita;
  display: flex; align-items: center; justify-content: center; font-size: 12pt; }}
.elenco {{ display: grid; grid-template-columns: 1fr 1fr; gap: 3mm 6mm; margin-top: 3mm; }}
.pers {{ display: flex; gap: 3mm; align-items: center; font-size: 10pt; line-height: 1.35; }}
.av {{ flex: none; width: 11mm; height: 11mm; border-radius: 50%; background-size: cover; background-position: center;
  border: .6mm solid #1A0B45; display: flex; align-items: center; justify-content: center; color: #fff; font-family: Lilita; font-size: 12pt; }}
.ilustra {{ width: 100%; max-height: 72mm; object-fit: cover; border-radius: 4mm; border: .8mm solid #1A0B45; display: block; margin-top: 5mm; }}
.assunto {{ background: #fff; border: .8mm solid #1A0B45; border-radius: 5mm; padding: 6mm 7mm; box-shadow: 0 1.6mm 0 #1A0B45;
  margin-bottom: 7mm; }}
.cab {{ display: flex; align-items: center; gap: 3mm; margin-bottom: 2mm; }}
.tag {{ background: #3D1F8F; color: #FFCC00; font-family: Lilita; font-size: 11pt; padding: 1mm 3.5mm; border-radius: 99px; }}
.consigo {{ font-size: 10pt; color: #3D1F8F; font-weight: 600; }}
.en {{ font-family: Lilita; font-size: 25pt; line-height: 1.1; margin: 2mm 0 1mm; }}
.en span {{ background: #FFCC00; padding: 0 2mm; border-radius: 2mm; box-decoration-break: clone; -webkit-box-decoration-break: clone; }}
.pt {{ font-size: 12pt; color: #4b3d7a; margin-bottom: 3mm; }}
.linha {{ display: flex; gap: 3mm; font-size: 10.5pt; line-height: 1.45; margin-bottom: 1.6mm; }}
.rot {{ flex: none; width: 24mm; font-weight: 800; color: #FF8A1F; font-size: 9pt; text-transform: uppercase; letter-spacing: .4px; padding-top: .6mm; }}
.pron {{ font-weight: 800; letter-spacing: .3px; }}
.extra {{ font-size: 10pt; color: #4b3d7a; }}
.dialogo {{ margin-top: 3mm; background: #FFF4E0; border-radius: 3.5mm; padding: 3.5mm 4mm 2mm; }}
.dialogo h4 {{ font-family: Lilita; font-weight: 400; font-size: 11.5pt; color: #3D1F8F; margin-bottom: 2mm; }}
.fala {{ display: flex; gap: 2.5mm; align-items: center; margin-bottom: 2mm; }}
.fala .av {{ width: 8mm; height: 8mm; font-size: 9pt; border-width: .45mm; }}
.fala .q {{ font-size: 10.5pt; line-height: 1.3; }}
.fala .q b {{ font-weight: 800; }}
.fala .q i {{ color: #6b5a9a; font-style: normal; font-size: 9.5pt; }}
.fala.narr .q {{ font-style: italic; color: #6b5a9a; }}
.suavez {{ margin-top: 4mm; border: .6mm dashed #3D1F8F; border-radius: 3.5mm; padding: 3.5mm 4mm; }}
.suavez h4 {{ font-family: Lilita; font-weight: 400; font-size: 12.5pt; color: #FF8A1F; margin-bottom: 2mm; }}
.q-ex {{ font-size: 10.5pt; line-height: 1.4; margin-bottom: 2.2mm; }}
.q-ex .lin {{ display: block; border-bottom: .3mm solid #b9acd9; height: 9mm; margin-top: .5mm; }}
.gab {{ margin-top: 3mm; font-size: 9pt; color: #4b3d7a; background: #efe9ff; border-radius: 2.5mm; padding: 2.5mm 3.5mm; line-height: 1.45; }}
.gab b {{ color: #3D1F8F; }}
.cola {{ width: 100%; border-collapse: collapse; font-size: 10.5pt; }}
.cola td {{ padding: 2.4mm 2mm; border-bottom: .3mm solid #d9cff5; vertical-align: top; }}
.cola td.n {{ font-family: Lilita; color: #3D1F8F; width: 10mm; font-size: 12pt; }}
.cola td.e {{ font-weight: 800; width: 72mm; }}
.cola td.p {{ color: #6b5a9a; font-size: 9.5pt; }}
.chamada {{ background: #3D1F8F; color: #FFF4E0; }}
.chamada .titulo-pag {{ color: #FFCC00; font-size: 30pt; }}
.chamada p {{ font-size: 12pt; }}
.chamada .lista div {{ font-size: 12pt; margin-bottom: 3mm; padding-left: 7mm; position: relative; line-height: 1.4; }}
.chamada .lista div:before {{ content: ""; position: absolute; left: 0; top: 2mm; width: 3.2mm; height: 3.2mm; border-radius: 50%; background: #16C79A; }}
.chamada .rodape {{ color: #c9bdf5; }}
.sumario td {{ padding: 1.7mm 2mm; font-size: 10.5pt; border-bottom: .3mm solid #d9cff5; }}
.revisao {{ background: #efe9ff; }}
"""

def av(nome):
    if nome in AV:
        return f'<div class="av" style="background-image:url({AV[nome]})"></div>'
    return f'<div class="av" style="background:{COR.get(nome, "#8C6CFF")}">{e(nome[0])}</div>'

def rodape(txt, n):
    return f'<div class="rodape"><span>CapyFala · {e(txt)}</span><span>{n}</span></div>'

def bloco_assunto(a, com_exercicio=False):
    falas = []
    for quem, en, pt in a["dialogo"]:
        if en == "(":
            falas.append(f'<div class="fala narr">{av(quem)}<div class="q">{e(pt)}</div></div>')
        else:
            falas.append(f'<div class="fala">{av(quem)}<div class="q"><b>{e(quem)}:</b> {e(en)} <i>· {e(pt)}</i></div></div>')
    extra = ""
    if a["extra"]:
        extra = '<div class="linha"><span class="rot">Também</span><span class="extra">' + \
            " · ".join(f"<b>{e(x)}</b> ({e(y)})" for x, y in a["extra"]) + "</span></div>"
    ex = ""
    if com_exercicio:
        qs = "".join(f'<div class="q-ex">{i}. {e(q)}<span class="lin"></span></div>' for i, (q, _) in enumerate(a["sua_vez"], 1))
        gab = " · ".join(f"<b>{i}.</b> {e(r)}" for i, (_, r) in enumerate(a["sua_vez"], 1))
        ex = f'<div class="suavez"><h4>Sua vez</h4>{qs}</div><div class="gab"><b>Gabarito:</b> {gab}</div>'
    return f"""<div class="assunto">
<div class="cab"><span class="tag">Assunto {a['n']} · T1 E{a['n']:02d}</span><span class="consigo">Consigo {e(a['consigo'])}</span></div>
<div class="en"><span>{e(a['en'])}</span></div>
<div class="pt">{e(a['pt'])}</div>
<div class="linha"><span class="rot">Fala assim</span><span class="pron">{e(a['pron'])}</span></div>
<div class="linha"><span class="rot">Atenção</span><span>{e(a['dica'])}</span></div>
{extra}
<div class="dialogo"><h4>No Bean There</h4>{''.join(falas)}</div>
{ex}
</div>"""

def capa(titulo, sub, selo, foto):
    return f"""<div class="page capa"><div class="topo">
<div class="marca">CapyFala</div>
<h1>{titulo}</h1>
<div class="sub">{sub}</div>
<div class="selo">{selo}</div></div>
<div class="foto" style="background-image:url({b64(foto)})"></div></div>"""

ELENCO = [("Capy", "Capivara barista, a protagonista. Começou do zero, igual a você."),
          ("Hank", "Panda rabugento, dono do café Bean There. Seco, mas nunca humilha."),
          ("Lazy", "Preguiça. Fala devagar e puxa o \"repete comigo\". Não é preguiçoso, é eficiente."),
          ("Duda", "Panda-vermelho. Diz que é prima do Hank. Ele diz que não."),
          ("Bolinha", "Hamster. Guarda frases nas bochechas e devolve depois, pra você revisar."),
          ("Dona Jaca", "Mãe da Capy. Liga do Brasil por videochamada.")]

def pag_como_usar(n, total_txt, apostila=False):
    passos = [
        "Leia a frase em inglês e a tradução.",
        "Fale em voz alta seguindo o <b>Fala assim</b>. A sílaba em MAIÚSCULA é a forte.",
        "Leia o <b>Atenção</b>: é o ponto em que o brasileiro mais escorrega naquela frase.",
        "Leia o diálogo do Bean There em voz alta, fazendo todos os papéis.",
    ]
    if apostila:
        passos.append("Faça o <b>Sua vez</b> sem olhar o gabarito. Depois confira.")
        passos.append("A cada 5 assuntos tem uma revisão. Não pule: é ela que faz a frase ficar.")
    else:
        passos.append("Assista ao episódio do assunto no canal e repita junto com a Capy.")
    ps = "".join(f'<div class="passo"><b class="n">{i}</b><span>{p}</span></div>' for i, p in enumerate(passos, 1))
    el = "".join(f'<div class="pers">{av(k)}<span><b>{k}.</b> {e(v)}</span></div>' for k, v in ELENCO)
    return f"""<div class="page"><div class="titulo-pag">Como usar</div>
<p>{total_txt} Cada assunto é uma frase curta que se usa de verdade, na ordem em que os cursos de inglês para iniciantes costumam ensinar: primeiro cumprimentar, depois dizer o nome, de onde você é, e assim por diante.</p>
<div class="passos">{ps}</div>
<p>Sotaque não é erro. O objetivo é ser entendido.</p>
<div class="titulo-pag" style="font-size:20pt;margin-top:6mm">Quem está no café</div>
<div class="elenco">{el}</div>
<img class="ilustra" src="{b64('q_lazy.jpg')}">
{rodape('Temporada 1', n)}</div>"""

def doc(title, pages):
    return f'<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>{e(title)}</title><style>{CSS}</style></head><body>{"".join(pages)}</body></html>'

# ---------------- ISCA (assuntos 1-10) ----------------
def isca():
    pags = [capa("As frases da<br>Temporada 1", "As 10 primeiras frases do café Bean There, com tradução, pronúncia e um diálogo curto em cada uma. Para quem começa o inglês do zero.",
                 "Assuntos 1 a 10 · grátis", "q_capy_hi.jpg"),
            pag_como_usar(2, "Aqui estão os 10 primeiros assuntos da Temporada 1 do CapyFala.")]
    n = 3
    for i in range(0, 10, 2):
        pags.append(f'<div class="page">{bloco_assunto(A[i])}{bloco_assunto(A[i+1])}{rodape("As frases da Temporada 1", n)}</div>')
        n += 1
    linhas = "".join(f'<tr><td class="n">{a["n"]}</td><td class="e">{e(a["en"])}</td><td>{e(a["pt"])}<br><span class="p">{e(a["pron"])}</span></td></tr>' for a in A[:10])
    pags.append(f'<div class="page"><div class="titulo-pag">As 10 frases numa página</div><p>Recorte, cole na geladeira ou deixe no celular. Leia em voz alta uma vez por dia.</p><table class="cola">{linhas}</table><img class="ilustra" style="width:70%;margin:6mm auto 0" src="{b64("q_caderno.jpg")}">{rodape("As frases da Temporada 1", n)}</div>')
    n += 1
    pags.append(f"""<div class="page chamada"><div class="marca">CapyFala</div>
<div class="titulo-pag" style="margin-top:8mm">Gostou? A Temporada 1 tem 20 assuntos.</div>
<p>Este PDF tem os 10 primeiros. A apostila completa da Temporada 1 continua de onde paramos, no mesmo formato, e acrescenta prática para você fazer sozinho.</p>
<div class="lista" style="margin-top:6mm">
<div>Os 20 assuntos da Temporada 1, do "Hi! I'm Capy." até "It's three o'clock."</div>
<div>Em cada assunto: frase, tradução, pronúncia, o ponto de atenção e o diálogo do Bean There.</div>
<div>Exercício "Sua vez" em cada assunto, com gabarito.</div>
<div>Uma revisão a cada 5 assuntos.</div>
<div>Áudios em MP3 com as vozes do café nos assuntos que já têm gravação.</div>
</div>
<p style="margin-top:8mm">O link da apostila fica na bio do perfil <b>@acapyfala</b>.</p>
<img class="ilustra" src="{b64('perfil-800.png')}" style="width:62mm;height:62mm;margin:10mm auto 0;border-radius:50%">
{rodape('As frases da Temporada 1', n)}</div>""")
    return doc("As frases da Temporada 1", pags)

# ---------------- APOSTILA (assuntos 1-20) ----------------
def revisao(ate, n):
    itens = REVISOES[ate]
    qs = "".join(f'<div class="q-ex">{i}. {e(q)}<span class="lin"></span></div>' for i, (q, _) in enumerate(itens, 1))
    gab = " · ".join(f"<b>{i}.</b> {e(r)}" for i, (_, r) in enumerate(itens, 1))
    lista = "".join(f'<tr><td class="n">{a["n"]}</td><td class="e">{e(a["en"])}</td><td>{e(a["pt"])}</td></tr>' for a in A[ate-5:ate])
    return f"""<div class="page revisao"><div class="titulo-pag">Revisão · assuntos {ate-4} a {ate}</div>
<p>Antes de seguir, leia as 5 frases em voz alta. Depois faça os exercícios sem olhar.</p>
<table class="cola">{lista}</table>
<div class="suavez" style="margin-top:6mm;background:#fff"><h4>Sua vez</h4>{qs}</div>
<div class="gab"><b>Gabarito:</b> {gab}</div>
{rodape('Apostila da Temporada 1', n)}</div>"""

def apostila():
    pags = [capa("Apostila da<br>Temporada 1", "Os 20 assuntos do café Bean There, com tradução, pronúncia, diálogo, exercícios com gabarito e revisão a cada 5 assuntos. Inglês do zero, para adultos.",
                 "Assuntos 1 a 20", "q_capy_hi.jpg"),
            pag_como_usar(2, "Esta apostila tem os 20 assuntos da Temporada 1 do CapyFala.", apostila=True)]
    # sumário: capa(1) como usar(2) sumário(3), assuntos a partir da 4, revisão depois de cada 5
    pg, ent = 4, []
    for a in A:
        ent.append((f"Assunto {a['n']}", a["en"], pg)); pg += 1
        if a["n"] % 5 == 0:
            ent.append(("Revisão", f"assuntos {a['n']-4} a {a['n']}", pg)); pg += 1
    linhas = "".join(f'<tr><td><b>{e(k)}</b></td><td>{e(v)}</td><td style="text-align:right">{p}</td></tr>' for k, v, p in ent)
    pags.append(f'<div class="page"><div class="titulo-pag">Sumário</div><table class="sumario" style="width:100%;border-collapse:collapse">{linhas}</table>{rodape("Apostila da Temporada 1", 3)}</div>')
    n = 4
    for a in A:
        pags.append(f'<div class="page">{bloco_assunto(a, True)}{rodape("Apostila da Temporada 1", n)}</div>'); n += 1
        if a["n"] % 5 == 0:
            pags.append(revisao(a["n"], n)); n += 1
    pags.append(f"""<div class="page chamada"><div class="marca">CapyFala</div>
<div class="titulo-pag" style="margin-top:8mm">Você terminou a Temporada 1.</div>
<p>São 20 frases que você já consegue dizer: cumprimentar, se apresentar, dizer de onde é, a idade, o telefone, a profissão, pedir um café e perguntar a hora.</p>
<p>Volte às revisões de vez em quando. Frase que a gente repete em voz alta fica.</p>
<p style="margin-top:6mm">A história continua no perfil <b>@acapyfala</b>.</p>
<img class="ilustra" src="{b64('q_caderno.jpg')}" style="margin-top:8mm">
{rodape('Apostila da Temporada 1', n)}</div>""")
    return doc("Apostila da Temporada 1", pags), n

if __name__ == "__main__":
    (D / "isca.html").write_text(isca())
    h, total = apostila()
    (D / "apostila.html").write_text(h)
    print("ok, apostila paginas", total)
