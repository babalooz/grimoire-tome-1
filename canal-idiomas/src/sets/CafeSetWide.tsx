import React from "react";
import { AbsoluteFill } from "remotion";
import { C, TITLE } from "../theme";
import { Lamp, MenuBoard, Sign } from "./CafeSet";
import { COUNTER_YW, H, W } from "../wide/geo";

// Bean There em 16:9 (mundo 1920x1080), REDESENHADO para tela deitada: mesma paleta, traço e peças do vertical
// (menu com S/M/L, letreiro BEAN THERE, luminárias, varal de luzinhas, máquina de espresso, pote TIPS),
// só que o balcão vai de ponta a ponta e as peças se espalham na largura. Fundo parado (frame fixo) como o vertical.
const INK = "#3A2213";
const WALL = "#FFD35C";
const WALL_STRIPE = "#FFDF85";
const WOOD = "#E9B874";
const WOOD_DARK = "#C98E4E";
const S = { stroke: INK, strokeWidth: 8, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

const Shelf: React.FC<{ x: number; y: number; w: number }> = ({ x, y, w }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={0} y={0} width={w} height={24} fill={WOOD} {...S} />
    {[C.tangerina, C.lilas, "#FF8FB1", C.lilas, C.tangerina].map((c, i) => {
      const mx = 30 + i * ((w - 120) / 4);
      return (
        <g key={i}>
          <rect x={mx} y={-58} width={54} height={58} rx={8} fill={c} {...S} strokeWidth={7} />
          <path d={`M${mx + 54} -45 q22 0 22 17 q0 17 -22 17`} fill="none" stroke={INK} strokeWidth={7} />
        </g>
      );
    })}
  </g>
);

export const CafeBackWide: React.FC<{ frame: number }> = ({ frame }) => (
  <AbsoluteFill>
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute" }}>
      <rect width={W} height={H} fill={WALL} />
      {Array.from({ length: 17 }, (_, i) => <rect key={i} x={i * 120 + 30} y={0} width={56} height={H} fill={WALL_STRIPE} />)}
      {/* rodameio roxo com azulejos */}
      <rect x={0} y={470} width={W} height={COUNTER_YW - 470} fill={C.lilas} />
      {Array.from({ length: 25 }, (_, i) => <rect key={i} x={i * 80 - 10} y={480} width={70} height={34} rx={6} fill="#A48BFF" />)}
      <line x1={0} y1={470} x2={W} y2={470} stroke={INK} strokeWidth={8} />
      {/* teto + varal de luzinhas */}
      <rect x={0} y={0} width={W} height={56} fill={C.roxo} />
      <line x1={0} y1={56} x2={W} y2={56} stroke={INK} strokeWidth={8} />
      <path d={`M-20 70 Q480 150 960 84 Q1440 150 1940 70`} fill="none" stroke={INK} strokeWidth={5} />
      {Array.from({ length: 21 }, (_, i) => {
        const x = -20 + i * 98;
        const left = x < 960;
        const t = left ? (x + 20) / 980 : (x - 960) / 980;
        const [y0, y1] = left ? [70, 84] : [84, 70];
        const y = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * 150 + t * t * y1;
        const on = (Math.floor(frame / 12) + i) % 3 !== 0;
        const col = [C.amarelo, "#FF8FB1", C.tangerina, "#7FD3FF"][i % 4];
        return (
          <g key={i}>
            {on && <circle cx={x} cy={y + 6} r={22} fill={col} opacity={0.35} />}
            <ellipse cx={x} cy={y + 6} rx={11} ry={14} fill={on ? col : "#C9B98A"} stroke={INK} strokeWidth={5} />
          </g>
        );
      })}
      {/* menu (S/M/L) à esquerda e letreiro à direita: mesmas peças do vertical, reposicionadas */}
      <g transform="translate(96 -152) scale(0.8)"><MenuBoard /></g>
      <g transform="translate(905 -228) scale(0.9)"><Sign frame={frame} /></g>
      <Shelf x={1180} y={440} w={430} />
      <Lamp x={560} len={60} color={C.tangerina} frame={frame} i={0} />
      <Lamp x={1230} len={40} color={C.roxo} frame={frame} i={1} />
    </svg>
  </AbsoluteFill>
);

// Balcão largo (primeiro plano): cobre a metade de baixo de quem está atrás dele.
export const CafeCounterWide: React.FC<{ frame: number }> = ({ frame }) => {
  const Y = COUNTER_YW;
  const steam = (x: number, k: number) => (
    <path key={k} d={`M${x} ${Y - 150} q-16 -26 0 -52 q16 -26 0 -52`} fill="none" stroke="#fff" strokeWidth={9} strokeLinecap="round"
      opacity={0.35 + 0.3 * Math.sin(frame / 10 + k)} transform={`translate(${Math.sin(frame / 14 + k) * 6} ${-((frame * 0.8 + k * 20) % 30)})`} />
  );
  return (
    <AbsoluteFill>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute" }}>
        <g transform={`translate(1690 ${Y - 250})`}>
          <rect x={0} y={20} width={200} height={230} rx={22} fill="#D9D4E8" {...S} />
          <rect x={-8} y={0} width={216} height={40} rx={12} fill={C.tangerina} {...S} />
          <rect x={30} y={70} width={140} height={60} rx={10} fill={C.roxo} {...S} strokeWidth={6} />
          <circle cx={70} cy={100} r={12} fill={C.amarelo} /><circle cx={130} cy={100} r={12} fill="#FF8FB1" />
          <rect x={70} y={150} width={60} height={24} rx={6} fill={INK} />
          <rect x={80} y={196} width={40} height={54} rx={6} fill="#fff" {...S} strokeWidth={6} />
        </g>
        {steam(1790, 1)}
        <g transform={`translate(1190 ${Y - 110})`}>
          <rect x={0} y={0} width={90} height={110} rx={16} fill="#E8F6FF" opacity={0.85} {...S} strokeWidth={7} />
          <rect x={10} y={40} width={70} height={30} rx={6} fill={C.amarelo} {...S} strokeWidth={5} />
          <text x={45} y={63} textAnchor="middle" fontFamily={TITLE} fontSize={22} fill={INK}>TIPS</text>
        </g>
        <rect x={-20} y={Y} width={W + 40} height={52} rx={14} fill={WOOD} {...S} strokeWidth={10} />
        <rect x={-20} y={Y + 34} width={W + 40} height={18} fill={WOOD_DARK} />
        <rect x={-20} y={Y + 52} width={W + 40} height={H} fill={C.roxo} {...S} strokeWidth={10} />
        {Array.from({ length: 20 }, (_, i) => <rect key={i} x={i * 96 + 10} y={Y + 80} width={60} height={600} rx={30} fill="#4B2BA6" />)}
        <rect x={-20} y={Y + 52} width={W + 40} height={20} fill={C.amarelo} {...S} strokeWidth={6} />
      </svg>
    </AbsoluteFill>
  );
};
