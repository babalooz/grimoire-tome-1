// Quadros-chave do formato lição (usado por scripts/make-licao.sh --stills).
// Usa a MESMA agenda da composição (src/lesson/timeline.ts), então não diverge quando o ritmo muda.
import { readFileSync } from "fs";
import { buildSchedule, exerciseMarks, isLine } from "../src/lesson/timeline";

const p = JSON.parse(readFileSync(process.argv[2], "utf8"));
const fps = 30;
const s = buildSchedule(p, fps);
const m = exerciseMarks(s, p.licao.exercicios.length);
const find = (f: (x: any) => boolean) => s.find(f)!;
const wrong = find((x) => x.phase === "cena" && isLine(x.passo) && x.passo.emotion === "eyebrow");
const faint = find((x) => !isLine(x.passo) && x.passo.evento === "desmaio");
const card = find((x) => isLine(x.passo) && !!x.passo.card);
const e = p.licao.exercicios;
const ix = (t: string) => e.findIndex((q: any) => q.tipo === t);
const out = [
  0, // 1 frame 0 (capa)
  wrong.start + 18, // 2 Hank: "You... WANT?"
  faint.start + 30, // 3 desmaio (PLOFT)
  m[ix("traducao")].timerFrom + 45, // 4 escolha a tradução + timer
  m[ix("montar")].reveal + 6 * e[ix("montar")].ordem.length + 40, // 5 blocos montados + vilã
  m[ix("ouvir")].reveal + 24, // 6 ouvir: a Capi errou, coração quebra
  m[ix("repetir")].timerFrom + 40, // 7 microfone: sua vez
  card.from + card.dur - 2, // 8 caderninho + CTA
];
const total = s[s.length - 1].from + s[s.length - 1].dur;
console.error(`duração: ${(total / fps).toFixed(1)} s (${total} frames)`);
console.log(out.join(" "));
