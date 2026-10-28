// Quadros-chave, duração, roteiro linear e checagens da série de VOCABULÁRIO (usado por scripts/make-vocab.sh e pelo portão).
// Usa a MESMA agenda da composição (src/vocab/timeline.ts).
// Uso: vocab-frames <props.json>            -> frames dos stills (stdout) + rótulos (stderr)
//      vocab-frames <props.json> duracao    -> segundos (stdout)
//      vocab-frames <props.json> roteiro    -> roteiro linear em JSON (stdout): o portão lê este arquivo
//      vocab-frames <props.json> checar     -> regras do formato (stderr); sai 1 se alguma falhar
//      vocab-frames <props.json> cenas      -> 1 quadro por palavra (teste do quadro de cena: scripts/teste-cena.sh)
import { readFileSync } from "fs";
import { CENA_ACOES, CENA_ATORES, aprendidas, buildVocabSchedule, falaAt, mostraAt, roteiroLinear, vocabTotal, voiceStart } from "../src/vocab/timeline";

const p = JSON.parse(readFileSync(process.argv[2], "utf8"));
const mode = process.argv[3];
const fps = 30;
const s = buildVocabSchedule(p, fps);
const total = vocabTotal(s);

if (mode === "duracao") {
  console.log((total / fps).toFixed(2));
  process.exit(0);
}
if (mode === "roteiro") {
  console.log(JSON.stringify({ id: p.id, duracao: +(total / fps).toFixed(2), linhas: roteiroLinear(p, s, fps) }, null, 1));
  process.exit(0);
}
if (mode === "cenas") { // 1 quadro por palavra: voz da apresentação + 10 (cena/objetos montados, adesivo colado)
  console.log(s.filter((x) => x.papel === "apresenta").map((x) => voiceStart(x) + 10).join(" "));
  process.exit(0);
}
if (mode === "checar") {
  const falhas: string[] = [];
  const en = s.filter((x) => x.tipo === "fala" && x.lang === "en");
  p.palavras.forEach((pal: any, k: number) => {
    const ditos = en.filter((x) => x.palavra === k);
    const bocas = new Set(ditos.map((x) => x.speaker));
    if (bocas.size < 3) falhas.push(`${pal.en}: só ${bocas.size} boca(s) (mín. 3)`);
    if (ditos.length && ditos[ditos.length - 1].speaker === "capi") falhas.push(`${pal.en}: a Capy é a última a dizer`);
    // adesivo cola no quadro da voz (±3): o estado visual tem de virar no quadro da 1ª fala da palavra
    const first = ditos.find((x) => x.papel === "apresenta");
    if (first) {
      const v = voiceStart(first);
      const m = mostraAt(s, v);
      const antes = mostraAt(s, v - 4);
      if (!m || m.palavra !== k || Math.abs(m.revelado - v) > 3) falhas.push(`${pal.en}: adesivo fora de sincronia com a voz`);
      if (antes && antes.palavra === k && antes.revelado <= v - 4) falhas.push(`${pal.en}: adesivo aparece antes da voz`);
    }
  });
  p.palavras.forEach((pal: any) => {
    if (!pal.cena && !pal.objeto) falhas.push(`${pal.en}: sem objeto nem cena`);
    if (pal.cena && (!CENA_ACOES.includes(pal.cena.acao) || !pal.cena.quem?.length || pal.cena.quem.some((q: string) => !CENA_ATORES.includes(q as any))
      || !pal.cena.contexto)) falhas.push(`${pal.en}: cena inválida (acao/quem/contexto)`);
  });
  const sv = s.filter((x) => x.tipo === "suavez");
  if (sv.length < p.palavras.length) falhas.push(`só ${sv.length} pausas "sua vez" para ${p.palavras.length} palavras`);
  if (!(p.palavras.length >= 5 && p.palavras.length <= 10)) falhas.push(`${p.palavras.length} palavras (faixa 5–10)`);
  const d = total / fps;
  if (d < 61 || d > 75) falhas.push(`duração ${d.toFixed(1)} s fora de 61–75 s`);
  // 1ª voz no máximo em 0,5 s (gancho falado, sem card parado)
  const v0 = s.find((x) => x.tipo === "fala");
  if (!v0 || voiceStart(v0) > 15) falhas.push("gancho: a 1ª voz começa depois de 0,5 s");
  console.error(`duração ${d.toFixed(1)} s · ${en.length} falas em inglês · ${sv.length} pausas sua vez · ${aprendidas(s, total)} palavras apresentadas`);
  falhas.forEach((f) => console.error("  ✗ " + f));
  process.exit(falhas.length ? 1 : 0);
}

const out: [number, string][] = [[0, "capa"], [20, "gancho: corte"], [30, "gancho 1 s"]];
const add = (f: number | undefined, what: string) => { if (f !== undefined && f >= 0 && f < total) out.push([Math.round(f), what]); };
const ap = s.filter((x) => x.papel === "apresenta");
add(ap[0] && voiceStart(ap[0]) + 6, "1ª palavra: adesivo");
const sv = s.find((x) => x.tipo === "suavez");
add(sv && sv.from + 15, "sua vez");
const dica = s.find((x) => x.papel === "dica");
add(dica && dica.from + 30, "dica de pronúncia");
const rev = s.find((x) => x.papel === "revisao");
add(rev && voiceStart(rev) + 4, "mini-revisão");
[4, 6, 9].forEach((k) => { const a = ap.find((x) => x.palavra === k); add(a && voiceStart(a) + 8, `palavra ${k + 1}`); });
const per = s.find((x) => x.tipo === "pergunta");
add(per && per.from + 20, "desafio");
const fin = s.filter((x) => x.papel === "final");
add(fin[5] && voiceStart(fin[5]) + 3, "revisão final");
const fe = s.find((x) => x.papel === "fecho");
add(fe && fe.from + fe.dur - 4, "fecho");
console.error(`duração: ${(total / fps).toFixed(1)} s (${total} frames)`);
out.forEach(([f, what], i) => console.error(`  ${i + 1} f${f} ${what}${falaAt(s, f) ? ` · fala ${falaAt(s, f)!.speaker}` : ""}`));
console.log(out.map(([f]) => f).join(" "));
