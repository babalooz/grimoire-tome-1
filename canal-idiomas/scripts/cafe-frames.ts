// Quadros-chave, durações e plano de câmera do formato Sitcom do Café (usado por scripts/make-cafe.sh).
// Usa a MESMA agenda da composição (src/cafe/timeline.ts), então não diverge quando o ritmo muda.
// Uso: cafe-frames <props.json>              -> frames dos stills do episódio (stdout) + rótulos (stderr)
//      cafe-frames <props.json> esquete <ID> -> frames da esquete
//      cafe-frames <props.json> duracoes      -> "episodio <s>" e "esquete <ID> <s>" (stdout)
//      cafe-frames <props.json> camera        -> planos (início, duração) e avisos fora de 1,5–3 s (stderr); sai 1 se houver
//      cafe-frames <props.json> ritmo         -> palavras/min das falas com frase-alvo (dos timings do TTS)
import { readFileSync } from "fs";
import {
  CAM_MAX, CAM_MIN, CafeLine, CafeStep, PERGUNTA_LEAD, STRIKE_DELAY, STRIKE_FRAMES, buildCafeSchedule, cafeEsqueteWindow, cafeTotal,
  firstAlvoIndex, isLine, isPergunta, planShots,
} from "../src/cafe/timeline";

const p = JSON.parse(readFileSync(process.argv[2], "utf8"));
const mode = process.argv[3];
const fps = 30;
const s = buildCafeSchedule(p, fps);
const total = cafeTotal(s);
const L = (x: CafeStep) => (isLine(x.beat) ? (x.beat as CafeLine) : null);

if (mode === "duracoes") {
  console.log(`episodio ${(total / fps).toFixed(2)}`);
  for (const e of p.esquetes ?? []) console.log(`esquete ${e.id} ${(cafeEsqueteWindow(p, e.id, fps).total / fps).toFixed(2)}`);
  process.exit(0);
}
if (mode === "camera") {
  const h0 = process.argv[4] ? cafeEsqueteWindow(p, process.argv[4], fps).from : 0;
  const shots = planShots(s, h0);
  let bad = 0;
  shots.forEach((sh, k) => {
    const d = sh.to - sh.from;
    const last = k === shots.length - 1;
    const warn = !sh.hook && ((d < CAM_MIN && !last) || d > CAM_MAX + 9) ? "  <- fora de 1,5–3 s" : "";
    if (warn) bad++;
    console.error(`  f${sh.from}–${sh.to} (${(d / fps).toFixed(2)} s) ${sh.hook ? `gancho ${sh.hook}` : ""} ${Array.isArray(sh.subjects) ? sh.subjects.join("+") : "geral"} z${sh.cam.z.toFixed(2)}${warn}`);
  });
  console.error(`${shots.length} planos, ${bad} fora da faixa`);
  process.exit(bad ? 1 : 0);
}
if (mode === "ritmo") {
  const first = firstAlvoIndex(p);
  s.forEach((x) => {
    const l = L(x);
    if (!l || l.lang !== "en" || !l.alvo || !x.timing) return;
    const pts = x.timing.parts ?? [{ start: 0, end: x.timing.duration }];
    const span = pts[pts.length - 1].end - pts[0].start;
    const words = (l.text.match(/[A-Za-z0-9']+/g) ?? []).length;
    const wpm = Math.round((words / span) * 60);
    console.log(`b${x.i} ${l.speaker} ${x.i === first ? "(1ª)" : ""} "${l.text}" speed ${x.timing.speed ?? "?"}: ${span.toFixed(2)} s = ${wpm} palavras/min${wpm > 190 ? "  <- ACIMA de 190" : ""}`);
  });
  process.exit(0);
}
if (mode === "esquete") {
  const w = cafeEsqueteWindow(p, process.argv[4], fps);
  console.error(`esquete ${process.argv[4]}: ${(w.total / fps).toFixed(1)} s (${w.total} frames)`);
  console.log([0, 15, 30, Math.round(w.cut / 2), w.cut - 3, w.cut + 20].join(" "));
  process.exit(0);
}

const out: [number, string][] = [[0, "capa"], [15, "gancho: close"], [30, "gancho: reação"]];
const add = (f: number | undefined, what: string) => { if (f !== undefined && f >= 0) out.push([Math.round(f), what]); };
const errado = s.find((x) => L(x)?.errado);
if (errado) add(errado.from + errado.audioFrames + STRIKE_DELAY + STRIKE_FRAMES + 4, "errado riscado");
const fa = s[firstAlvoIndex(p)];
if (fa) add(fa.from + 26, "1ª frase-alvo (legenda dupla)");
const perg = s.find((x) => isPergunta(x.beat));
if (perg) add(perg.from + PERGUNTA_LEAD + 30, "pergunta + contador");
const rep = s.find((x) => x.shadowFrom >= 0);
if (rep) add(rep.shadowFrom + 20, "repita (sua vez)");
const by = (sp: string) => s.find((x) => L(x)?.speaker === sp);
add(by("poppy") && by("poppy")!.from + 30, "Poppy");
add(by("donajaca") && by("donajaca")!.from + 30, "Dona Jaca");
const bol = s.find((x) => L(x)?.bolinha || L(x)?.speaker === "bolinha");
add(bol && bol.from + 20, "Bolinha");
const card = s.find((x) => L(x)?.card);
add(card && card.from + card.dur - 2, "caderninho + CTA");
console.error(`duração: ${(total / fps).toFixed(1)} s (${total} frames)`);
out.forEach(([f, what], i) => console.error(`  ${i + 1} f${f} ${what}`));
console.log(out.map(([f]) => f).join(" "));
