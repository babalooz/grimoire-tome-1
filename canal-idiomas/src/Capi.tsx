import React from "react";
import { random } from "remotion";

// Capi provisória (vetor feito em código) — vista 3/4, focinho longo, orelhas no topo, corpo de barril,
// óculos + tangerina na cabeça. Será trocada pela arte do ilustrador (mesmas props).
export type Mood = "zen" | "thinking" | "sweat" | "shock" | "happy" | "fail";

const INK = "#2B1A12";
const FUR = "#C98B54";
const LIGHT = "#E3B888";
const SHADE = "#9A6438";

export const Capi: React.FC<{
  frame: number;
  talking: boolean;
  mood: Mood;
  sweat?: number; // nº de gotas (ex.: = nível)
  size?: number;
  armUp?: boolean;
}> = ({ frame, talking, mood, sweat = 0, size = 520, armUp = false }) => {
  // piscada em intervalo pseudoaleatório (nunca nos 30 primeiros frames = frame 0 limpo)
  const blinkCycle = Math.floor(frame / 75);
  const blinkAt = Math.floor(random(`blink-${blinkCycle}`) * 60);
  const blink = frame > 30 && frame % 75 >= blinkAt && frame % 75 < blinkAt + 4 && mood !== "fail";
  const mouth = talking ? 4 + Math.abs(Math.sin(frame / 2.1)) * 12 : 0;
  const breathe = 1 + Math.sin(frame / 12) * 0.012;
  const shake = mood === "shock" || mood === "fail" ? Math.sin(frame * 1.7) * 2 : 0;

  const eyes = (cx: number, cy: number) => {
    if (blink || mood === "zen") return <path d={`M${cx - 12} ${cy} Q${cx} ${cy + 7} ${cx + 12} ${cy}`} stroke={INK} strokeWidth={5} fill="none" strokeLinecap="round" />;
    if (mood === "fail") return (
      <g stroke={INK} strokeWidth={5} strokeLinecap="round">
        <line x1={cx - 9} y1={cy - 9} x2={cx + 9} y2={cy + 9} /><line x1={cx + 9} y1={cy - 9} x2={cx - 9} y2={cy + 9} />
      </g>
    );
    if (mood === "happy") return <path d={`M${cx - 11} ${cy + 4} Q${cx} ${cy - 9} ${cx + 11} ${cy + 4}`} stroke={INK} strokeWidth={5} fill="none" strokeLinecap="round" />;
    const r = mood === "shock" ? 13 : 10;
    return (
      <g>
        <circle cx={cx} cy={cy} r={r} fill="#fff" stroke={INK} strokeWidth={3} />
        <circle cx={cx + (mood === "thinking" ? 4 : 2)} cy={cy + (mood === "thinking" ? -3 : 1)} r={mood === "shock" ? 4 : 5.5} fill={INK} />
      </g>
    );
  };

  return (
    <svg width={size} height={size * 1.2} viewBox="0 0 300 360" style={{ overflow: "visible", transform: `translateX(${shake}px)` }}>
      {/* corpo de barril */}
      <g transform={`translate(150 300) scale(1 ${breathe}) translate(-150 -300)`}>
        <ellipse cx={140} cy={275} rx={100} ry={78} fill={FUR} stroke={INK} strokeWidth={5} />
        <ellipse cx={150} cy={295} rx={62} ry={48} fill={LIGHT} />
        <rect x={75} y={330} width={34} height={26} rx={12} fill={SHADE} stroke={INK} strokeWidth={5} />
        <rect x={170} y={330} width={34} height={26} rx={12} fill={SHADE} stroke={INK} strokeWidth={5} />
        {/* braços */}
        <rect x={60} y={240} width={30} height={62} rx={15} fill={SHADE} stroke={INK} strokeWidth={5} transform="rotate(18 75 240)" />
        {armUp
          ? <rect x={205} y={170} width={30} height={70} rx={15} fill={SHADE} stroke={INK} strokeWidth={5} transform="rotate(-35 220 240)" />
          : <rect x={200} y={240} width={30} height={62} rx={15} fill={SHADE} stroke={INK} strokeWidth={5} transform="rotate(-18 215 240)" />}
      </g>
      {/* cabeça 3/4 com focinho longo e reto */}
      <g>
        <ellipse cx={108} cy={60} rx={13} ry={11} fill={SHADE} stroke={INK} strokeWidth={5} />
        <ellipse cx={146} cy={52} rx={13} ry={11} fill={SHADE} stroke={INK} strokeWidth={5} />
        <rect x={70} y={58} width={165} height={132} rx={56} fill={FUR} stroke={INK} strokeWidth={5} />
        <rect x={168} y={92} width={118} height={92} rx={40} fill={FUR} stroke={INK} strokeWidth={5} />
        <rect x={180} y={128} width={100} height={52} rx={26} fill={LIGHT} />
        <ellipse cx={252} cy={106} rx={7} ry={5} fill={INK} />
        <ellipse cx={272} cy={110} rx={6} ry={4.5} fill={INK} />
        {/* boca */}
        {mood === "happy" && !talking
          ? <path d="M222 160 Q240 174 258 160" stroke={INK} strokeWidth={5} fill="none" strokeLinecap="round" />
          : <ellipse cx={240} cy={163} rx={13} ry={2.5 + mouth} fill={INK} />}
        {/* olhos + óculos (marca) */}
        {eyes(142, 104)}
        {eyes(192, 100)}
        <g stroke={INK} strokeWidth={4} fill="none">
          <circle cx={142} cy={104} r={22} stroke="#FFCC00" strokeWidth={7} />
          <circle cx={192} cy={100} r={22} stroke="#FFCC00" strokeWidth={7} />
          <line x1={164} y1={102} x2={170} y2={101} stroke="#FFCC00" strokeWidth={7} />
        </g>
        {mood === "thinking" && <path d="M125 72 L158 80" stroke={INK} strokeWidth={5} strokeLinecap="round" />}
        {/* tangerina na cabeça (assinatura) */}
        <circle cx={120} cy={36} r={24} fill="#FF8A1F" stroke={INK} strokeWidth={5} />
        <path d="M120 13 Q132 2 140 12 Q130 16 120 13" fill="#2F9E6B" stroke={INK} strokeWidth={3} />
        {/* gotas de suor */}
        {Array.from({ length: Math.min(sweat, 4) }, (_, i) => (
          <path key={i} d="M0 0 Q7 12 0 18 Q-7 12 0 0" fill="#7FD3FF" stroke={INK} strokeWidth={3}
            transform={`translate(${62 - i * 4} ${78 + i * 26 + Math.sin(frame / 5 + i) * 3})`} />
        ))}
      </g>
    </svg>
  );
};
