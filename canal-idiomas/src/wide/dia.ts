import { CafeProps, cafeFrames, cafeEsqueteWindow } from "../cafe/timeline";
import { VocabProps, vocabFrames } from "../vocab/timeline";

// LONGO DO DIA (YouTube 16:9, decisão do Felipe 28/10): abertura curta → [cartão + parte] × 3 → encerramento.
// Partes = os vídeos do dia, guiados pelos MESMOS JSONs: sitcom (CafeWide), vocabulário (VocabWide) e um corte de
// episódio já publicado (CafeWide numa janela de beats). Agenda única: a composição (src/DiaWide.tsx), os capítulos
// da descrição e o portão (scripts/dia-wide.ts) usam estas contas. Sem React: roda no node.
// numero = numeração pública dos posts (CLAUDE.md, decisão do Felipe 28/10): "Ep. 1 (parte 2/3)", "Palavras #02", "do Ep. 1"
export type DiaParte =
  | { tipo: "cafe"; rotulo: string; numero?: string; titulo: string; props: CafeProps }
  | { tipo: "vocab"; rotulo: string; numero?: string; titulo: string; props: VocabProps }
  | { tipo: "corte"; rotulo: string; numero?: string; titulo: string; props: CafeProps; de: number; ate: number; cta: string };
export type DiaProps = {
  id: string;
  data: string; // AAAA-MM-DD
  dia?: number; // "Dia N" (numeração do longo); anterior = Dia N-1
  dataTexto: string; // "quinta, 29/10"
  partes: DiaParte[];
  recap: string[]; // "hoje você viu" (só o que está no vídeo)
  proximo?: string; // SÓ se já estiver agendado (publicados.csv); senão fica fora
  capitulos?: { encerramento: string };
  auditoria?: boolean;
};

export const DIA = { abertura: 6.5, cartao: 2.5, cta: 2.0, encerramento: 10 };
export type DiaBloco = { tipo: "abertura" | "cartao" | "parte" | "cta" | "encerramento"; parte?: number; from: number; dur: number };

export const corteJanela = (pt: Extract<DiaParte, { tipo: "corte" }>, fps: number) =>
  cafeEsqueteWindow({ ...pt.props, esquetes: [{ id: "dia", de: pt.de, ate: pt.ate, gancho: "", cta: pt.cta }] }, "dia", fps);

export const parteFrames = (pt: DiaParte, fps: number) =>
  pt.tipo === "cafe" ? cafeFrames(pt.props, fps) : pt.tipo === "vocab" ? vocabFrames(pt.props, fps) : corteJanela(pt, fps).cut;

export const diaBlocos = (p: DiaProps, fps: number): DiaBloco[] => {
  const F = (s: number) => Math.round(s * fps);
  const out: DiaBloco[] = [];
  let t = 0;
  const add = (b: Omit<DiaBloco, "from">) => { out.push({ ...b, from: t }); t += b.dur; };
  add({ tipo: "abertura", dur: F(DIA.abertura) });
  p.partes.forEach((pt, i) => {
    add({ tipo: "cartao", parte: i, dur: F(DIA.cartao) });
    add({ tipo: "parte", parte: i, dur: parteFrames(pt, fps) });
    if (pt.tipo === "corte") add({ tipo: "cta", parte: i, dur: F(DIA.cta) });
  });
  add({ tipo: "encerramento", dur: F(DIA.encerramento) });
  return out;
};
export const diaFrames = (p: DiaProps, fps: number) => {
  if (!p.partes?.length) return 1;
  const b = diaBlocos(p, fps);
  return b[b.length - 1].from + b[b.length - 1].dur;
};

// Capítulos do YouTube: 1º em 00:00, ≥ 3, cada um ≥ 10 s (regra do YouTube). Começam no cartão de cada parte.
const mmss = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
export const diaCapitulos = (p: DiaProps, fps: number) => {
  const b = diaBlocos(p, fps);
  const nome = (i: number) => {
    const pt = p.partes[i];
    const n = pt.numero ?? `${pt.rotulo[0].toUpperCase()}${pt.rotulo.slice(1)}`;
    return `${n[0].toUpperCase()}${n.slice(1)}: ${pt.titulo}`;
  };
  // a abertura (6,5 s) não vira capítulo próprio (< 10 s): o 1º capítulo começa em 00:00 com a 1ª parte
  const caps = b.filter((x) => x.tipo === "cartao").map((x, i) => ({ t: i === 0 ? 0 : x.from / fps, nome: nome(x.parte!) }));
  const fim = b[b.length - 1];
  caps.push({ t: fim.from / fps, nome: p.capitulos?.encerramento ?? "Revisão do dia" });
  const total = (fim.from + fim.dur) / fps;
  const problemas: string[] = [];
  caps.forEach((c, i) => {
    const prox = i + 1 < caps.length ? caps[i + 1].t : total;
    if (prox - Math.floor(c.t) < 10) problemas.push(`capítulo "${c.nome}" com ${(prox - c.t).toFixed(1)} s (< 10 s)`);
  });
  if (caps.length < 3) problemas.push("menos de 3 capítulos");
  return { linhas: caps.map((c) => `${mmss(c.t)} ${c.nome}`), problemas, total };
};
