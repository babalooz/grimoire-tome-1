import React from "react";
import { C } from "../theme";

// Objetos do balcão do Bean There para a série de VOCABULÁRIO. Mesma arte do elenco (contorno grosso marrom-tinta,
// pontas redondas, cores do theme). Os mesmos objetos da música "One to Ten" e do assunto 4 (quantidade visível ANTES
// da palavra: didatica-visual.md §3). Cada objeto novo = 1 desenho aqui + 1 entrada em LAYOUT; o tema só cita o nome.
// Coordenadas: cada item é desenhado com a base em y = 0 e centro em x = 0. `h` = altura do grupo (o adesivo fica logo acima).
const INK = "#3A2213";
const S = { stroke: INK, strokeWidth: 8, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

const Xicara: React.FC = () => (
  <g>
    <ellipse cx={0} cy={-6} rx={112} ry={16} fill="#fff" {...S} />
    <path d="M-70 -120 L70 -120 L58 -24 Q0 -10 -58 -24 Z" fill="#fff" {...S} />
    <path d="M68 -100 Q112 -100 104 -66 Q96 -40 62 -46" fill="none" {...S} strokeWidth={12} />
    <ellipse cx={0} cy={-120} rx={70} ry={14} fill="#7A4A22" {...S} strokeWidth={6} />
    <rect x={-60} y={-86} width={120} height={18} fill={C.lilas} />
    {[-24, 18].map((x, k) => (
      <path key={k} d={`M${x} -150 q-14 -22 0 -44 q14 -22 0 -44`} fill="none" stroke="#fff" strokeWidth={9} strokeLinecap="round" opacity={0.8} />
    ))}
  </g>
);
const Croissant: React.FC = () => (
  <g transform="translate(0 -46)">
    <path d="M-86 22 Q-92 -26 -44 -40 Q0 -54 44 -40 Q92 -26 86 22 Q60 6 40 16 Q0 -2 -40 16 Q-60 6 -86 22 Z" fill="#F2B45A" {...S} />
    <path d="M-44 -38 Q-34 -6 -40 14 M0 -48 Q8 -18 0 6 M44 -38 Q34 -6 40 14" fill="none" stroke="#C97B2A" strokeWidth={7} strokeLinecap="round" />
  </g>
);
const Semente: React.FC = () => (
  <g>
    <path d="M0 -70 Q26 -40 18 -6 Q0 4 -18 -6 Q-26 -40 0 -70 Z" fill="#4A3B33" {...S} strokeWidth={6} />
    <path d="M-6 -56 Q-12 -32 -8 -10 M8 -56 Q12 -32 8 -10" stroke="#EDE4D3" strokeWidth={5} strokeLinecap="round" fill="none" />
  </g>
);
const Acucar: React.FC = () => (
  <g>
    <path d="M-34 -68 L14 -80 L40 -62 L-8 -50 Z" fill="#fff" {...S} strokeWidth={6} />
    <path d="M-34 -68 L-8 -50 L-8 0 L-34 -14 Z" fill="#E9E4F5" {...S} strokeWidth={6} />
    <path d="M-8 -50 L40 -62 L40 -12 L-8 0 Z" fill="#F6F2FF" {...S} strokeWidth={6} />
  </g>
);
// pata aberta (5 dedos): `cor` = pelo, `palma` = almofada
const Pata: React.FC<{ cor: string; palma: string; flip?: boolean }> = ({ cor, palma, flip }) => (
  <g transform={flip ? "scale(-1 1)" : undefined}>
    <path d="M-46 0 L-50 -70 L50 -70 L46 0 Z" fill={cor} {...S} />
    <path d="M-80 -150 Q-86 -90 -60 -60 L60 -60 Q86 -90 80 -150 Q0 -190 -80 -150 Z" fill={cor} {...S} />
    {[-78, -40, 0, 40].map((x, k) => (
      <path key={k} d={`M${x} ${-150 + (k === 0 ? 12 : 0)} q ${2} -70 ${18} -72 q 18 0 ${18} 70`} fill={cor} {...S} />
    ))}
    <path d="M70 -112 q 40 -40 60 -18 q 12 18 -40 50" fill={cor} {...S} />
    <ellipse cx={0} cy={-112} rx={44} ry={30} fill={palma} />
    {[-62, -22, 18, 58].map((x, k) => <ellipse key={k} cx={x + 8} cy={k === 0 ? -184 : -196} rx={11} ry={13} fill={palma} />)}
    <ellipse cx={104} cy={-128} rx={10} ry={12} fill={palma} />
  </g>
);
const Muffin: React.FC = () => (
  <g>
    <path d="M-34 0 L-40 -50 L40 -50 L34 0 Z" fill={C.tangerina} {...S} strokeWidth={6} />
    <path d="M-26 -4 L-30 -46 M-10 -4 L-11 -46 M10 -4 L11 -46 M26 -4 L30 -46" stroke="#C8620E" strokeWidth={5} />
    <path d="M-48 -48 Q-54 -96 0 -100 Q54 -96 48 -48 Z" fill="#8A4B23" {...S} strokeWidth={6} />
    {[[-18, -76], [12, -84], [24, -62], [-4, -62]].map(([x, y], k) => <circle key={k} cx={x} cy={y} r={6} fill="#3A1E0E" />)}
  </g>
);
const Copo: React.FC = () => (
  <g>
    <path d="M-34 -96 L34 -96 L26 0 L-26 0 Z" fill="#fff" {...S} strokeWidth={6} />
    <rect x={-31} y={-66} width={60} height={26} fill={C.roxo} />
    <path d="M-40 -96 L40 -96" {...S} strokeWidth={8} />
  </g>
);
const Cookie: React.FC = () => (
  <g transform="translate(0 -40)">
    <circle cx={0} cy={0} r={38} fill="#D9A15C" {...S} strokeWidth={6} />
    {[[-14, -10], [12, -16], [16, 10], [-8, 14], [0, -2]].map(([x, y], k) => <circle key={k} cx={x} cy={y} r={6} fill="#4A2A14" />)}
  </g>
);
// 9 canudos num copo: desenho único (a quantidade está nos canudos)
const Canudos: React.FC<{ k: number }> = ({ k }) => {
  const shown = Math.max(0, Math.min(9, k));
  return (
    <g>
      {Array.from({ length: 9 }, (_, i) => {
        if (i >= shown) return null;
        const a = -32 + (64 * i) / 8;
        const rad = (a * Math.PI) / 180;
        const x2 = Math.sin(rad) * 170, y2 = -60 - Math.cos(rad) * 170;
        return <g key={i}>
          <line x1={0} y1={-60} x2={x2} y2={y2} stroke={INK} strokeWidth={22} strokeLinecap="round" />
          <line x1={0} y1={-60} x2={x2} y2={y2} stroke={i % 2 ? C.lilas : C.certo} strokeWidth={10} strokeLinecap="round" />
        </g>;
      })}
      <path d="M-62 -130 L62 -130 L50 0 L-50 0 Z" fill="#E8F6FF" opacity={0.95} {...S} />
      <rect x={-54} y={-92} width={106} height={22} fill={C.tangerina} opacity={0.85} />
    </g>
  );
};

type Item = { x: number; y: number; s?: number; flip?: boolean };
// Posições dos itens na área do balcão (centro do grupo em x = 0, base no tampo em y = 0). Ordem = ordem de entrada.
const row = (n: number, gap: number, y = 0, s = 1): Item[] => Array.from({ length: n }, (_, i) => ({ x: (i - (n - 1) / 2) * gap, y, s }));
export const LAYOUT: Record<string, { items: Item[]; draw: (i: number, k: number) => React.ReactNode; h: number }> = {
  xicara: { items: [{ x: 0, y: 0, s: 1.15 }], draw: () => <Xicara />, h: 250 },
  croissant: { items: row(2, 200, 0, 1.15), draw: () => <Croissant />, h: 120 },
  semente: { items: row(3, 110, 0, 1.3), draw: () => <Semente />, h: 95 },
  acucar: { items: row(4, 112, 0, 1.25), draw: () => <Acucar />, h: 105 },
  pata: { items: [{ x: 0, y: 0, s: 1.05 }], draw: () => <Pata cor="#C8552B" palma="#3A2213" />, h: 235 },
  muffin: { items: [...row(3, 116, -44, 0.86), ...row(3, 132, 0)], draw: () => <Muffin />, h: 135 },
  // pirâmide de copos: 4 embaixo + 3 em cima
  copo: { items: [...row(4, 100, 0), ...row(3, 100, -100)], draw: () => <Copo />, h: 205 },
  cookie: { items: [...row(4, 100, -46, 0.88), ...row(4, 112, 0)], draw: () => <Cookie />, h: 120 },
  canudo: { items: [{ x: 0, y: 0, s: 1.1 }], draw: (_i, k) => <Canudos k={k} />, h: 255 },
  "pata-hank": { items: [{ x: -112, y: 0, s: 0.92, flip: true }, { x: 112, y: 0, s: 0.92 }], draw: () => <Pata cor="#1F1A24" palma="#5A5260" />, h: 215 },
};

// Grupo de objetos com entrada item a item (`since` = quadros desde o início da entrada; `instant` = já completo).
// Os canudos entram um por um dentro do mesmo copo (a contagem é dos canudos).
export const Objetos: React.FC<{ objeto: string; qtd: number; since: number; instant?: boolean; stagger?: number }> = ({ objeto, qtd, since, instant, stagger = 2 }) => {
  const L = LAYOUT[objeto];
  if (!L) return null;
  if (objeto === "canudo") {
    const k = instant ? qtd : Math.floor(since / stagger) + 1;
    const s = instant ? 1 : Math.min(1, 0.6 + since / 6);
    return <g transform={`scale(${(L.items[0].s ?? 1) * s})`}>{L.draw(0, k)}</g>;
  }
  const items = L.items.slice(0, qtd);
  return (
    <g>
      {items.map((it, i) => {
        const t = instant ? 99 : since - i * stagger;
        if (t < 0) return null;
        const k = Math.min(1, t / 5);
        const pop = k < 1 ? 0.4 + 0.75 * k : 1 + 0.08 * Math.max(0, 1 - (t - 5) / 4);
        const s = (it.s ?? 1) * pop;
        return (
          <g key={i} transform={`translate(${it.x} ${it.y}) scale(${it.flip ? -s : s} ${s})`}>
            {L.draw(i, 0)}
          </g>
        );
      })}
    </g>
  );
};
