// Quadros-chave do formato lição (usado por scripts/make-licao.sh --stills).
// Usa a MESMA agenda da composição (src/lesson/timeline.ts), então não diverge quando o ritmo muda.
// Uso: licao-frames <props.json>              -> frames do episódio (stdout) + duração (stderr)
//      licao-frames <props.json> esquete <ID> -> frames da esquete (início, meio, fim do corte, card final)
//      licao-frames <props.json> duracoes      -> "episodio <s>" e "esquete <ID> <s>" por linha (stdout)
import { readFileSync } from "fs";
import { Line, Pause, Step, aberturaFrames, buildSchedule, esqueteWindow, exerciseMarks, isLine } from "../src/lesson/timeline";

const p = JSON.parse(readFileSync(process.argv[2], "utf8"));
const mode = process.argv[3];
const fps = 30;
const s = buildSchedule(p, fps);
const total = s[s.length - 1].from + s[s.length - 1].dur;

if (mode === "duracoes") {
  console.log(`episodio ${(total / fps).toFixed(2)}`);
  for (const e of p.esquetes ?? []) console.log(`esquete ${e.id} ${(esqueteWindow(p, e.id, fps).total / fps).toFixed(2)}`);
  process.exit(0);
}
if (mode === "esquete") {
  const w = esqueteWindow(p, process.argv[4], fps);
  const ab = aberturaFrames(p, process.argv[4], fps);
  const out = [0, ab + 20, ab + Math.round(w.cut / 2), ab + w.cut - 3, ab + w.cut + 20];
  console.error(`esquete ${process.argv[4]}: ${(w.total / fps).toFixed(1)} s (${w.total} frames)`);
  console.log(out.join(" "));
  process.exit(0);
}

const m = exerciseMarks(s, p.licao.exercicios.length);
const line = (x: Step) => (isLine(x.passo) ? (x.passo as Line) : null);
const out: [number, string][] = [[0, "capa"]];
const cena = s.filter((x) => x.phase === "cena");
const wrong = cena.find((x) => line(x)?.emotion === "eyebrow") ?? cena[cena.length - 1];
out.push([wrong.start + 18, "cena: reação ao erro"]);
const faint = s.find((x) => !isLine(x.passo) && (x.passo as Pause).evento === "desmaio");
if (faint) out.push([faint.start + 30, "desmaio"]);
p.licao.exercicios.forEach((e: any, ei: number) => {
  const own = s.filter((x) => x.ex === ei);
  const ev = (name: string) => own.filter((x) => line(x)?.evento === name);
  const mk = m[ei];
  const add = (f: number, what: string) => out.push([Math.round(f), `ex${ei + 1} ${e.tipo}: ${what}`]);
  if (e.tipo === "cartoes") {
    const c = ev("cartao");
    add(own[0].start + 20, "baralho");
    if (c.length > 2) add(c[2].start + 16, "cartão 3");
    const last = c[c.length - 1];
    if (last) add(last.start + last.audioFrames + 6, "último cartão + REPITA");
  } else if (e.tipo === "ligar") {
    add(mk.timerFrom + 30, "timer");
    add(mk.reveal + (e.pares.length - 1) * 13.5 + 16, "linhas");
  } else if (e.tipo === "completar") {
    add(mk.timerFrom + 50, "chute + timer");
    add(mk.reveal + 20, "lacuna preenchida");
  } else if (e.tipo === "revisao") {
    add(mk.timerFrom + 30, "Bolinha + timer");
    const l = ev("lembra");
    if (l.length) add(l[l.length - 1].start + 16, "tudo revelado");
  } else if (e.tipo === "traducao") add(mk.timerFrom + 45, "timer");
  else if (e.tipo === "montar") add(mk.reveal + 6 * e.ordem.length + 40, "blocos montados");
  else if (e.tipo === "ouvir") add(mk.reveal + 24, "resposta");
  else if (e.tipo === "repetir") add(mk.timerFrom + 40, "microfone");
});
const card = s.find((x) => !!line(x)?.card);
if (card) out.push([card.from + card.dur - 2, "caderninho + CTA"]);
console.error(`duração: ${(total / fps).toFixed(1)} s (${total} frames)`);
out.forEach(([f, what], i) => console.error(`  ${i + 1} f${f} ${what}`));
console.log(out.map(([f]) => f).join(" "));
