import React from "react";
import { AbsoluteFill } from "remotion";
import { C, TITLE } from "../theme";

// Bean There Café — cenário principal de "Capi no Exterior" (Lagoa Pines, Kissimmee; tudo fictício).
// Direção visual (playbook 4.5): amarelo quente + detalhes roxos, contorno grosso, 3 camadas.
// Mundo = 1080x1920. Camadas: CafeBack (parede, menu, luzes) · personagens atrás do balcão · CafeCounter (balcão).
const INK = "#3A2213";
const WALL = "#FFD35C";
const WALL_STRIPE = "#FFDF85";
const WOOD = "#E9B874";
const WOOD_DARK = "#C98E4E";
const BOARD = "#2A1466";
const CHALK = "#FFF4E0";
const S = { stroke: INK, strokeWidth: 8, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

export const COUNTER_Y = 1130;

const Lamp: React.FC<{ x: number; len: number; color: string; frame: number; i: number }> = ({ x, len, color, frame, i }) => {
  const swing = Math.sin(frame / 40 + i * 1.7) * 1.5;
  return (
    <g transform={`rotate(${swing} ${x} 0)`}>
      <line x1={x} y1={0} x2={x} y2={len} stroke={INK} strokeWidth={6} />
      <circle cx={x} cy={len + 58} r={120} fill="#FFF6C8" opacity={0.28} />
      <circle cx={x} cy={len + 58} r={70} fill="#FFF6C8" opacity={0.35} />
      <path d={`M${x - 70} ${len + 56} L${x - 30} ${len} L${x + 30} ${len} L${x + 70} ${len + 56} Z`} fill={color} {...S} />
      <path d={`M${x - 30} ${len + 56} A30 26 0 0 0 ${x + 30} ${len + 56} Z`} fill="#FFF3A8" {...S} strokeWidth={6} />
    </g>
  );
};

// Menu com os tamanhos P/M/G desenhados: plantio da piada final ("Tem… TAMANHO?!").
const MenuBoard: React.FC = () => (
  <g transform="translate(90 330)">
    <rect x={0} y={0} width={560} height={372} rx={26} fill={BOARD} {...S} strokeWidth={10} />
    <rect x={18} y={18} width={524} height={336} rx={16} fill="none" stroke={C.lilas} strokeWidth={4} strokeDasharray="4 12" />
    <text x={280} y={86} textAnchor="middle" fontFamily={TITLE} fontSize={62} fill={C.amarelo}>MENU</text>
    {["COFFEE", "LATTE", "TEA", "COCOA"].map((t, i) => (
      <g key={t}>
        <text x={50} y={154 + i * 52} fontFamily={TITLE} fontSize={40} fill={CHALK}>{t}</text>
        <line x1={50 + t.length * 24} y1={144 + i * 52} x2={300} y2={144 + i * 52} stroke={CHALK} strokeWidth={4} strokeDasharray="3 9" opacity={0.6} />
      </g>
    ))}
    {/* copos S M L */}
    {[{ h: 56, l: "S" }, { h: 78, l: "M" }, { h: 104, l: "L" }].map((c, i) => {
      const x = 344 + i * 68, base = 300;
      return (
        <g key={c.l}>
          <path d={`M${x} ${base - c.h} L${x + 48} ${base - c.h} L${x + 42} ${base} L${x + 6} ${base} Z`} fill={CHALK} stroke={CHALK} strokeWidth={3} />
          <rect x={x + 3} y={base - c.h * 0.62} width={42} height={c.h * 0.26} fill={C.tangerina} />
          <text x={x + 24} y={base + 42} textAnchor="middle" fontFamily={TITLE} fontSize={32} fill={C.amarelo}>{c.l}</text>
        </g>
      );
    })}
  </g>
);

const Sign: React.FC<{ frame: number }> = ({ frame }) => {
  const glow = 0.85 + Math.sin(frame / 9) * 0.08 + (Math.floor(frame / 7) % 23 === 0 ? -0.35 : 0); // neon que pisca de vez em quando
  return (
    <g transform="translate(690 350) rotate(4)">
      <rect x={0} y={0} width={320} height={200} rx={100} fill={C.roxo} {...S} strokeWidth={10} />
      <g opacity={glow}>
        <text x={160} y={92} textAnchor="middle" fontFamily={TITLE} fontSize={56} fill={C.amarelo}>BEAN</text>
        <text x={160} y={150} textAnchor="middle" fontFamily={TITLE} fontSize={56} fill="#FF8FB1">THERE</text>
      </g>
      {/* grão de café */}
      <g transform="translate(160 -26) rotate(-20)">
        <ellipse cx={0} cy={0} rx={34} ry={24} fill="#7A4A2A" {...S} strokeWidth={7} />
        <path d="M-26 6 Q0 -14 26 -4" fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" />
      </g>
    </g>
  );
};

const Shelf: React.FC = () => (
  <g transform="translate(0 790)">
    <rect x={-10} y={0} width={1100} height={26} fill={WOOD} {...S} />
    {[
      { x: 60, c: C.tangerina }, { x: 140, c: C.lilas }, { x: 212, c: "#FF8FB1" }, { x: 870, c: C.lilas }, { x: 950, c: C.tangerina },
    ].map((m, i) => (
      <g key={i}>
        <rect x={m.x} y={-62} width={58} height={62} rx={8} fill={m.c} {...S} strokeWidth={7} />
        <path d={`M${m.x + 58} -48 q24 0 24 18 q0 18 -24 18`} fill="none" stroke={INK} strokeWidth={7} />
      </g>
    ))}
    {/* pote de grãos */}
    <g transform="translate(300 -110)">
      <rect x={0} y={20} width={90} height={90} rx={14} fill="#FFF4E0" {...S} strokeWidth={7} />
      <rect x={-6} y={0} width={102} height={26} rx={8} fill={C.roxo} {...S} strokeWidth={7} />
      {[[24, 60], [52, 78], [40, 44], [66, 54], [26, 90], [60, 96]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx={9} ry={6} fill="#7A4A2A" />)}
    </g>
  </g>
);

export const CafeBack: React.FC<{ frame: number }> = ({ frame }) => (
  <AbsoluteFill>
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute" }}>
      <rect width={1080} height={1920} fill={WALL} />
      {Array.from({ length: 10 }, (_, i) => <rect key={i} x={i * 120 + 30} y={0} width={56} height={1920} fill={WALL_STRIPE} />)}
      {/* rodameio roxo com azulejos */}
      <rect x={0} y={880} width={1080} height={300} fill={C.lilas} />
      {Array.from({ length: 14 }, (_, i) => (
        <rect key={i} x={i * 80 - 10} y={890} width={70} height={36} rx={6} fill="#A48BFF" />
      ))}
      <line x1={0} y1={880} x2={1080} y2={880} stroke={INK} strokeWidth={8} />
      {/* teto e varal de luzinhas */}
      <rect x={0} y={0} width={1080} height={150} fill={C.roxo} />
      <line x1={0} y1={150} x2={1080} y2={150} stroke={INK} strokeWidth={8} />
      <path d="M-20 170 Q270 290 540 190 Q810 290 1100 170" fill="none" stroke={INK} strokeWidth={5} />
      {Array.from({ length: 13 }, (_, i) => {
        const x = -20 + i * 93;
        // ponto exato sobre as duas curvas quadráticas do fio
        const t = x < 540 ? (x + 20) / 560 : (x - 540) / 560;
        const [y0, y1] = x < 540 ? [170, 190] : [190, 170];
        const y = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * 290 + t * t * y1;
        const on = (Math.floor(frame / 12) + i) % 3 !== 0;
        const col = [C.amarelo, "#FF8FB1", C.tangerina, "#7FD3FF"][i % 4];
        return (
          <g key={i}>
            {on && <circle cx={x} cy={y + 6} r={26} fill={col} opacity={0.35} />}
            <ellipse cx={x} cy={y + 6} rx={12} ry={16} fill={on ? col : "#C9B98A"} stroke={INK} strokeWidth={5} />
          </g>
        );
      })}
      <MenuBoard />
      <Sign frame={frame} />
      <Shelf />
      <Lamp x={250} len={150} color={C.tangerina} frame={frame} i={0} />
      <Lamp x={830} len={110} color={C.roxo} frame={frame} i={1} />
    </svg>
  </AbsoluteFill>
);

// Balcão (primeiro plano): cobre a metade de baixo de quem está atrás dele.
export const CafeCounter: React.FC<{ frame: number }> = ({ frame }) => {
  const steam = (x: number, k: number) => (
    <path key={k} d={`M${x} ${COUNTER_Y - 150} q-16 -26 0 -52 q16 -26 0 -52`} fill="none" stroke="#fff" strokeWidth={9} strokeLinecap="round"
      opacity={0.35 + 0.3 * Math.sin(frame / 10 + k)} transform={`translate(${Math.sin(frame / 14 + k) * 6} ${-((frame * 0.8 + k * 20) % 30)})`} />
  );
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute" }}>
        {/* máquina de espresso à direita */}
        <g transform={`translate(868 ${COUNTER_Y - 250})`}>
          <rect x={0} y={20} width={200} height={230} rx={22} fill="#D9D4E8" {...S} />
          <rect x={-8} y={0} width={216} height={40} rx={12} fill={C.tangerina} {...S} />
          <rect x={30} y={70} width={140} height={60} rx={10} fill={C.roxo} {...S} strokeWidth={6} />
          <circle cx={70} cy={100} r={12} fill={C.amarelo} /><circle cx={130} cy={100} r={12} fill="#FF8FB1" />
          <rect x={70} y={150} width={60} height={24} rx={6} fill={INK} />
          <rect x={80} y={196} width={40} height={54} rx={6} fill="#fff" {...S} strokeWidth={6} />
        </g>
        {steam(968, 1)}
        {/* pote de gorjeta (sem número, sem marca real) */}
        <g transform={`translate(40 ${COUNTER_Y - 110})`}>
          <rect x={0} y={0} width={90} height={110} rx={16} fill="#E8F6FF" opacity={0.85} {...S} strokeWidth={7} />
          <rect x={10} y={40} width={70} height={30} rx={6} fill={C.amarelo} {...S} strokeWidth={5} />
          <text x={45} y={63} textAnchor="middle" fontFamily={TITLE} fontSize={22} fill={INK}>TIPS</text>
        </g>
        {/* tampo */}
        <rect x={-20} y={COUNTER_Y} width={1120} height={52} rx={14} fill={WOOD} {...S} strokeWidth={10} />
        <rect x={-20} y={COUNTER_Y + 34} width={1120} height={18} fill={WOOD_DARK} />
        {/* frente roxa com ripas */}
        <rect x={-20} y={COUNTER_Y + 52} width={1120} height={900} fill={C.roxo} {...S} strokeWidth={10} />
        {Array.from({ length: 12 }, (_, i) => (
          <rect key={i} x={i * 96 + 10} y={COUNTER_Y + 80} width={60} height={800} rx={30} fill="#4B2BA6" />
        ))}
        <rect x={-20} y={COUNTER_Y + 52} width={1120} height={20} fill={C.amarelo} {...S} strokeWidth={6} />
      </svg>
    </AbsoluteFill>
  );
};

// Regra 2 do mundo: monólogo interno = tela roxa + vinheta (o balão de pensamento fica no motor).
export const ThoughtOverlay: React.FC<{ amount: number; frame: number }> = ({ amount, frame }) => {
  if (amount <= 0) return null;
  return (
    <AbsoluteFill style={{ opacity: amount, pointerEvents: "none" }}>
      <AbsoluteFill style={{ background: C.roxo, opacity: 0.78 }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 55%, transparent 35%, rgba(20,6,60,0.85) 100%)" }} />
      {Array.from({ length: 16 }, (_, i) => {
        const x = (i * 157 + frame * (1 + (i % 3))) % 1120 - 20;
        const y = (i * 311) % 1700 + 120 - ((frame * 1.5 + i * 40) % 120);
        return <div key={i} style={{ position: "absolute", left: x, top: y, fontFamily: TITLE, fontSize: 60 + (i % 3) * 20, color: "#fff", opacity: 0.1 }}>{i % 3 ? "?" : "!"}</div>;
      })}
    </AbsoluteFill>
  );
};
