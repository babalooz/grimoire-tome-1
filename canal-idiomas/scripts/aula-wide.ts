// AULA LONGA (YouTube 16:9, 8 a 12 min): mesma composição e agenda do longo do dia (src/DiaWide.tsx, src/wide/dia.ts),
// com partes `cafe` escolhidas num roteiro de aula (aulas/<slug>.json), mais pausadas e didáticas. Rodado por scripts/make-aula-wide.sh.
// Uso:
//   node aula.cjs montar <aulas/slug.json>   -> out/props-aula-<slug>.json
//   node aula.cjs capitulos <props.json>     -> linhas "00:00 ..." (sai 1 se quebrar regra do YouTube)
//   node aula.cjs pacote <aulas/slug.json> <props.json> -> out/aula-<slug>.youtube.json
import { readFileSync, writeFileSync } from "fs";
import { DiaProps, diaCapitulos } from "../src/wide/dia";

const FPS = 30;
const [cmd, ...a] = process.argv.slice(2);
const ler = (f: string) => JSON.parse(readFileSync(f, "utf8"));
const cafeProps = (ep: string) => {
  const e = ler(ep);
  return { ...e, timings: ler(`public/audio/${e.id}/timings.json`), ...ler(`public/audio/${e.id}/mix.json`) };
};

if (cmd === "montar") {
  const au = ler(a[0]);
  const p: DiaProps = {
    id: `aula-${au.slug}`,
    data: au.data,
    dataTexto: "aula completa", // a abertura escreve "inglês do básico, em episódios · aula completa"
    partes: au.partes.map((x: any) => ({ tipo: "cafe" as const, rotulo: x.rotulo, titulo: x.titulo, props: cafeProps(x.ep) })),
    recap: au.recap,
    capitulos: { encerramento: "Revisão da aula" },
  };
  const out = `out/props-${p.id}.json`;
  writeFileSync(out, JSON.stringify(p));
  console.log(out);
} else if (cmd === "capitulos") {
  const c = diaCapitulos(ler(a[0]) as DiaProps, FPS);
  c.linhas.forEach((l) => console.log(l));
  console.error(`duração: ${c.total.toFixed(1)} s`);
  if (c.problemas.length) { c.problemas.forEach((x) => console.error("CAPÍTULO: " + x)); process.exit(1); }
} else if (cmd === "pacote") {
  const au = ler(a[0]);
  const p = ler(a[1]) as DiaProps;
  const cap = diaCapitulos(p, FPS);
  const descricao = [...au.descricao, "", "Capítulos:", ...cap.linhas, "", "#capyfala #inglês #inglesdozero"].join("\n");
  const out = { titulo: au.titulo, descricao, categoriaId: "27", madeForKids: false, miniatura: `out/${p.id}.miniatura.png`, arquivo: `${p.id}.mp4`,
    duracao: +cap.total.toFixed(1), capitulos: cap.linhas };
  writeFileSync(`out/${p.id}.youtube.json`, JSON.stringify(out, null, 2));
  console.log(`out/${p.id}.youtube.json (título ${au.titulo.length} car., descrição ${descricao.length} car.)`);
} else {
  console.error("uso: montar | capitulos | pacote");
  process.exit(2);
}
