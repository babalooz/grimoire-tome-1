import React from "react";
import { random } from "remotion";

// Capi v2 — vetor feito em código a partir do conceito docs/arte/capi-conceito-v1.png.
// Perfil 3/4: cabeça e corpo num bloco só (sem pescoço), focinho retangular grande, orelhas no topo,
// óculos redondos amarelos, tangerina na cabeça, olhar zen (pálpebra a meio-mastro).
export type Mood = "zen" | "thinking" | "sweat" | "shock" | "happy" | "fail";

const INK = "#3A2213";
const FUR = "#C98B54";
const FUR_DARK = "#A8703F";
const MUZZLE = "#A5714A";
const EAR_IN = "#9C6A45";
const YELLOW = "#FFCC00";
const ORANGE = "#FF8A1F";

export const Capi: React.FC<{
  frame: number;
  talking: boolean;
  mood: Mood;
  sweat?: number;
  size?: number;
  armUp?: boolean;
}> = ({ frame, talking, mood, sweat = 0, size = 520, armUp = false }) => {
  const cycle = Math.floor(frame / 80);
  const at = Math.floor(random(`blink-${cycle}`) * 60) + 10;
  const blink = frame > 30 && frame % 80 >= at && frame % 80 < at + 4 && mood !== "fail";
  const open = talking ? 0.35 + Math.abs(Math.sin(frame / 2.1)) * 0.65 : 0;
  const breathe = 1 + Math.sin(frame / 14) * 0.01;
  const shake = mood === "shock" || mood === "fail" ? Math.sin(frame * 1.7) * 4 : 0;
  const tilt = mood === "thinking" ? -3 : mood === "happy" ? 2 : 0;
  const S = { stroke: INK, strokeWidth: 9, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

  // olho: centro (360,515)
  const eye = () => {
    const cx = 360, cy = 515;
    if (mood === "fail") return (
      <g {...S} strokeWidth={10}><line x1={cx - 22} y1={cy - 22} x2={cx + 22} y2={cy + 22} /><line x1={cx + 22} y1={cy - 22} x2={cx - 22} y2={cy + 22} /></g>
    );
    if (mood === "happy") return <path d={`M${cx - 30} ${cy + 10} Q${cx} ${cy - 30} ${cx + 30} ${cy + 10}`} fill="none" {...S} strokeWidth={10} />;
    if (blink) return <path d={`M${cx - 34} ${cy + 4} Q${cx} ${cy + 18} ${cx + 34} ${cy + 4}`} fill="none" {...S} />;
    const r = mood === "shock" ? 44 : 38;
    const lid = mood === "zen" ? 0.55 : mood === "sweat" ? 0.25 : mood === "thinking" ? 0.35 : 0; // fração coberta pela pálpebra
    const pupilX = mood === "thinking" ? cx + 8 : cx + 4;
    const pupilY = mood === "thinking" ? cy - 8 : cy + 4;
    return (
      <g>
        <ellipse cx={cx} cy={cy} rx={r} ry={r * 0.82} fill="#fff" {...S} strokeWidth={7} />
        <circle cx={pupilX} cy={pupilY} r={mood === "shock" ? 11 : 16} fill={INK} />
        {lid > 0 && (
          <g>
            <clipPath id="lidclip"><ellipse cx={cx} cy={cy} rx={r} ry={r * 0.82} /></clipPath>
            <rect x={cx - r} y={cy - r} width={r * 2} height={r * 2 * lid} fill={FUR} clipPath="url(#lidclip)" />
            <line x1={cx - r + 4} y1={cy - r * 0.82 + r * 2 * lid * 0.82} x2={cx + r - 4} y2={cy - r * 0.82 + r * 2 * lid * 0.82} {...S} strokeWidth={8} />
          </g>
        )}
      </g>
    );
  };

  const mouth = () => {
    if (talking) return <ellipse cx={548} cy={688} rx={24} ry={5 + open * 16} fill="#5A2E1A" {...S} strokeWidth={6} />;
    if (mood === "shock") return <ellipse cx={548} cy={690} rx={18} ry={20} fill="#5A2E1A" {...S} strokeWidth={6} />;
    if (mood === "fail") return <path d="M520 700 Q548 680 578 700" fill="none" {...S} />;
    return null;
  };

  const smile = mood === "happy" ? "M300 675 Q400 760 490 712" : mood === "fail" ? "M320 720 Q400 700 480 722" : "M315 690 Q400 730 482 714";

  return (
    <svg width={size} height={(size * 760) / 580} viewBox="80 250 580 760" style={{ overflow: "visible", transform: `translateX(${shake}px) rotate(${tilt}deg)` }}>
      {/* orelha de trás + braço de trás */}
      <circle cx={452} cy={400} r={30} fill={FUR_DARK} {...S} />
      <path d="M500 735 C525 800 535 900 552 990" fill="none" {...S} />

      {/* corpo + cabeça (um bloco só) */}
      <g transform={`translate(330 1000) scale(1 ${breathe}) translate(-330 -1000)`}>
        <path d="M100 1000 C98 800 110 650 152 560 C188 470 252 420 332 410 C422 400 502 420 562 460 C612 492 628 542 622 602 C617 662 590 702 540 716 C528 762 544 882 550 1000 Z"
          fill={FUR} {...S} />
        <path d="M112 1000 C110 820 118 690 150 600 C160 700 158 850 176 1000 Z" fill={FUR_DARK} opacity={0.55} />
        {/* focinho */}
        <path d="M492 505 C542 494 602 510 616 560 C626 622 606 680 560 700 C520 710 490 690 486 640 C481 590 472 520 492 505 Z" fill={MUZZLE} opacity={0.85} />
        <path d="M512 540 Q526 530 540 540" fill="none" {...S} strokeWidth={8} />
        <path d="M580 540 Q594 530 606 542" fill="none" {...S} strokeWidth={8} />
        <path d="M562 568 L562 650 M532 668 Q562 660 590 666" fill="none" {...S} strokeWidth={7} />
        <path d={smile} fill="none" {...S} />
        {mouth()}
        {/* braço da frente */}
        {armUp
          ? <path d="M170 760 C120 700 110 620 140 560" fill="none" {...S} strokeWidth={10} />
          : <path d="M168 760 C150 850 172 948 232 958 C272 960 262 900 268 840" fill="none" {...S} />}
      </g>

      {/* orelha da frente */}
      <circle cx={222} cy={412} r={42} fill={FUR} {...S} />
      <circle cx={226} cy={416} r={20} fill={EAR_IN} />
      <path d="M150 560 C188 470 252 420 332 410" fill="none" {...S} />

      {eye()}
      {mood === "thinking" && <path d="M318 452 L400 470" fill="none" {...S} />}
      {mood === "fail" && <path d="M318 462 L396 448" fill="none" {...S} />}

      {/* óculos: lente da frente, ponte e lente de trás (parcial) */}
      <g fill="none" stroke={YELLOW} strokeWidth={14} strokeLinecap="round">
        <circle cx={360} cy={515} r={76} />
        <path d="M436 498 Q470 470 508 468" />
        <path d="M508 452 Q548 408 588 448 Q598 470 584 488" />
        <path d="M284 512 L168 532" />
      </g>

      {/* tangerina */}
      <g transform={mood === "shock" ? `translate(0 ${-12 + Math.sin(frame) * 4})` : undefined}>
        <circle cx={356} cy={352} r={58} fill={ORANGE} {...S} />
        <ellipse cx={338} cy={332} rx={14} ry={9} fill="#FFB36B" />
        <path d="M356 296 L352 272" fill="none" {...S} strokeWidth={7} />
        <path d="M356 284 Q380 256 408 270 Q386 292 356 284 Z" fill="#2F9E6B" {...S} strokeWidth={6} />
      </g>

      {/* gotas de suor */}
      {Array.from({ length: Math.min(sweat, 4) }, (_, i) => (
        <path key={i} d="M0 0 Q22 38 0 56 Q-22 38 0 0" fill="#7FD3FF" {...S} strokeWidth={5}
          transform={`translate(${200 - i * 18} ${470 + i * 50 + Math.sin(frame / 5 + i) * 6})`} />
      ))}
    </svg>
  );
};
