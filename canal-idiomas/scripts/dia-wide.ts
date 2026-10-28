// LONGO DO DIA (YouTube 16:9): monta os props do DiaWide a partir dos MESMOS JSONs e da voz em cache, e exporta
// capítulos/quadros-chave da MESMA agenda (src/wide/dia.ts). Rodado por scripts/make-dia-wide.sh (bundle esbuild).
// Uso:
//   node dia.cjs montar <AAAA-MM-DD> <sitcom.json> <vocab-props.json> <corte.json> <de> <ate>  -> out/props-dia-<data>-wide.json
//   node dia.cjs capitulos <props-dia.json>   -> linhas "00:00 ..." (sai 1 se quebrar regra do YouTube)
//   node dia.cjs pacote <props-dia.json>      -> out/<id>.youtube.json (título, descrição com capítulos, categoria 27)
//   node dia.cjs quadros <props-dia.json>     -> quadros para stills/auditoria (início/meio de cada bloco)
import { readFileSync, writeFileSync, existsSync } from "fs";
import { DiaProps, diaBlocos, diaCapitulos } from "../src/wide/dia";

const FPS = 30;
const [cmd, ...a] = process.argv.slice(2);
const ler = (f: string) => JSON.parse(readFileSync(f, "utf8"));
const cafeProps = (ep: string) => {
  const e = ler(ep);
  const t = ler(`public/audio/${e.id}/timings.json`);
  const mix = ler(`public/audio/${e.id}/mix.json`);
  return { ...e, timings: t, ...mix };
};
// "T1 E01 · parte 2/3 · um gringo de verdade no café ☕" -> "um gringo de verdade no café"
const tituloCurto = (t: string) => t.split(" · ").pop()!.replace(/[☀-➿\u{1F300}-\u{1FAFF}]/gu, "").trim();
const DIAS = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];
const dataTexto = (d: string) => {
  const [y, m, dd] = d.split("-").map(Number);
  return `${DIAS[new Date(Date.UTC(y, m - 1, dd)).getUTCDay()]}, ${String(dd).padStart(2, "0")}/${String(m).padStart(2, "0")}`;
};

// próximo episódio: SÓ o que já está agendado no publicados.csv depois desta data (nunca promessa inventada)
const proximoAgendado = (data: string, depoisDe: string): string | undefined => {
  if (!existsSync("publicados.csv")) return undefined;
  const [cab, ...rows] = readFileSync("publicados.csv", "utf8").trim().split("\n");
  const k = cab.split(",");
  const linhas = rows.map((r) => Object.fromEntries(r.split(",").map((v, i) => [k[i], v])) as Record<string, string>)
    .filter((r) => r.rede === "youtube" && r.faixa === "episodio" && r.data > data && r.status !== "error")
    .sort((x, y) => (x.data + x.hora).localeCompare(y.data + y.hora));
  const r = linhas.find((x) => x.arquivo.replace(".mp4", "") !== depoisDe);
  if (!r) return undefined;
  const ep = (() => { try { return ler(`episodes/${r.arquivo.replace(".mp4", ".json")}`); } catch { return null; } })();
  return `${ep?.serie?.codigo ?? r.episodio} · ${dataTexto(r.data)}`;
};
// corte: só de episódio que já tem post no YouTube com data ANTERIOR à do longo (já publicado)
const jaPublicado = (arquivo: string, data: string) =>
  existsSync("publicados.csv") && readFileSync("publicados.csv", "utf8").split("\n").some((l) => {
    const c = l.split(",");
    return c[2] === "youtube" && c[9] === arquivo && c[0] < data;
  });

// numeração pública (CLAUDE.md 28/10): sitcom "Ep. N (parte X/3)", vocabulário "Palavras #NN", corte "do Ep. N", longo "Dia N"
const parteX = (e: any) => { const m = /parte (\d)\/3/.exec(e.serie?.codigo ?? ""); return m ? +m[1] : 1; };
const epNum = (e: any) => `Ep. ${e.serie.episodio} (parte ${parteX(e)}/3)`;
const palavrasNum = (v: any) => `Palavras #${String(v.serie.codigo).replace(/\D/g, "").padStart(2, "0")}`;
// Dia N = 1 + longos já registrados (faixa "longo") antes desta data
const diaNum = (data: string) => 1 + (existsSync("publicados.csv") ? readFileSync("publicados.csv", "utf8").split("\n")
  .filter((l) => { const c = l.split(","); return c[3] === "longo" && c[0] < data; }).map((l) => l.split(",")[0]).filter((d, i, a) => a.indexOf(d) === i).length : 0);

if (cmd === "montar") {
  const [data, sitcom, vocabProps, corte, de, ate] = a;
  const s = cafeProps(sitcom);
  const v = ler(vocabProps);
  const c = cafeProps(corte);
  if (!jaPublicado(`${c.id}.mp4`, data)) throw new Error(`corte: ${c.id} não tem post no YouTube antes de ${data} (publicados.csv)`);
  const p: DiaProps = {
    id: `dia-${data}-wide`,
    data,
    dia: diaNum(data),
    dataTexto: dataTexto(data),
    partes: [
      { tipo: "cafe", rotulo: "sitcom", numero: epNum(s), titulo: tituloCurto(s.title), props: s },
      { tipo: "vocab", rotulo: "vocabulário", numero: palavrasNum(v), titulo: `${v.palavras.length} palavras de ${v.tema.pt}`, props: v },
      { tipo: "corte", rotulo: `do ${c.serie.codigo}`, numero: `do Ep. ${c.serie.episodio}`, titulo: tituloCurto(c.title), props: c, de: +de, ate: +ate,
        cta: `episódio completo: ${c.serie.codigo} no canal` },
    ],
    recap: [`${s.alvo.en} = ${s.alvo.pt}`, `${v.palavras.length} palavras de ${v.tema.pt}`],
    proximo: proximoAgendado(data, s.id),
    capitulos: { encerramento: "Revisão do dia e próximo episódio" },
  };
  const out = `out/props-${p.id}.json`;
  writeFileSync(out, JSON.stringify(p));
  console.log(out);
} else if (cmd === "capitulos") {
  const p = ler(a[0]) as DiaProps;
  const c = diaCapitulos(p, FPS);
  c.linhas.forEach((l) => console.log(l));
  console.error(`duração: ${c.total.toFixed(1)} s`);
  if (c.problemas.length) { c.problemas.forEach((x) => console.error("CAPÍTULO: " + x)); process.exit(1); }
} else if (cmd === "pacote") {
  // título/descrição do YouTube (vídeo normal, categoria Educação = 27). Regras do pacote do assunto 1
  // (ponte/saida/pacote-postagem-assunto1.md): termo de busca primeiro, frase em inglês escrita, sem gatilho proibido.
  const p = ler(a[0]) as DiaProps;
  const s = p.partes.find((x) => x.tipo === "cafe")!.props as any;
  const v = p.partes.find((x) => x.tipo === "vocab")!.props as any;
  const c = p.partes.find((x) => x.tipo === "corte") as any;
  const cap = diaCapitulos(p, FPS);
  const titulo = `Dia ${p.dia ?? 1} · Inglês do zero: ${s.alvo.en.replace(/[.!?]+$/, "")} + ${v.palavras.length} palavras de ${v.tema.pt} | CapyFala`;
  const descricao = [
    `Episódio do dia do CapyFala em tela cheia: a sitcom do café Bean There, ${p.partes[0].numero}; ${palavrasNum(v)}, ${v.palavras.length} palavras de ${v.tema.pt}; e um trecho ${c.numero}.`,
    "",
    `${s.canDo}`,
    `Frase do dia: ${s.alvo.en} = ${s.alvo.pt}`,
    `Palavras: ${v.palavras.map((w: any) => `${w.en} (${w.pt})`).join(", ")}`,
    "",
    "Capítulos:",
    ...cap.linhas,
    "",
    ...(p.proximo ? [`Próximo episódio: ${p.proximo.replace(/^T\d+ E0?(\d+)(?: · parte (\d)\/3)?/, (_m, n, x) => `Ep. ${n} (parte ${x ?? 1}/3)`)}.`, ""] : []),
    "Inglês do básico, em episódios, com a Capy e a turma do café. Inscreva-se para acompanhar a série.",
    "",
    "#capyfala #inglês #inglesdozero",
    ...((p.dia ?? 1) > 1 ? ["", `anterior: Dia ${(p.dia ?? 1) - 1}`] : []),
  ].join("\n");
  const out = { titulo, descricao, categoriaId: "27", madeForKids: false, miniatura: `out/${p.id}.miniatura.png`, arquivo: `${p.id}.mp4`,
    duracao: +cap.total.toFixed(1), capitulos: cap.linhas };
  writeFileSync(`out/${p.id}.youtube.json`, JSON.stringify(out, null, 2));
  console.log(`out/${p.id}.youtube.json (título ${titulo.length} car., descrição ${descricao.length} car.)`);
} else if (cmd === "quadros") {
  const p = ler(a[0]) as DiaProps;
  const b = diaBlocos(p, FPS);
  const fr = new Set<number>([0, 15, 30, 60]);
  b.forEach((x) => { fr.add(x.from + 20); fr.add(x.from + Math.floor(x.dur / 2)); });
  console.log([...fr].sort((x, y) => x - y).join(" "));
} else {
  console.error("uso: montar | capitulos | quadros");
  process.exit(2);
}
