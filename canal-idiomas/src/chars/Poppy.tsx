import React from "react";
import { CharProps, Emotion, INK, S, isBlinking, mouthOpen } from "./common";
import { Blush, Brow, Eye, Mouth, Sweat } from "./face";

// Poppy — AXOLOTE rosa, 24 anos, influencer (quer viralizar a qualquer custo). Só fala gíria, rápido, celular sempre na mão.
// Visual adulto/fashion: delineado gatinho, argolas douradas, puffer preto cropped, calça wide creme, tênis branco.
// Silhueta a 64 px: COROA DE BRÂNQUIAS EM LEQUE (3 de cada lado) sobre cabeça larga e achatada + celular erguido.
// Paleta: rosa #FF9EC4, brânquias magenta #E0468C, puffer #26212F, capa do celular amarela #FFCC00. Zero verde.
// "dead" = vergonha alheia extrema (olhos X, língua pra fora, brânquias murchas).
const SKIN = "#FF9EC4";
const SKIN_DARK = "#F07AAE";
const GILL = "#E0468C";
const GILL_HI = "#FF7DB5";
const PUFFER = "#26212F";
const PUFFER_HI = "#3E3750";
const PANTS = "#F1E4CC";
const PANTS_SHADE = "#DCCBAE";
const CASE = "#FFCC00";
const GOLD = "#F5B800";

export type PoppyEmotion = Emotion | "dead";
export const POPPY_BOX = { x: 20, y: 40, w: 660, h: 900 };

// brânquia externa: folha serrilhada ao longo de uma espinha
const frond = (len: number, w: number) => {
  const n = 7;
  const top: string[] = [], bot: string[] = [];
  for (let i = 0; i <= n; i++) {
    const t = (i / n) * len;
    const base = w * Math.pow(Math.sin((Math.PI * (i + 0.6)) / (n + 1.2)), 0.8);
    const serr = i % 2 ? 7 : 0;
    top.push(`${t.toFixed(1)} ${(-base - serr).toFixed(1)}`);
    bot.push(`${t.toFixed(1)} ${(base + serr).toFixed(1)}`);
  }
  return `M0 ${-w * 0.5} L${top.join(" L")} Q${len + 14} 0 ${bot[bot.length - 1]} L${bot.reverse().join(" L")} L0 ${w * 0.5} Z`;
};

export const Poppy: React.FC<Omit<CharProps, "emotion"> & { emotion: PoppyEmotion; phone?: boolean }> = ({
  frame, talking, emotion: raw, size = 400, seed = "poppy", phone = true,
}) => {
  const dead = raw === "dead";
  const emotion: Emotion = dead ? "surprised" : raw;
  const blink = isBlinking(frame, seed, 70);
  const open = mouthOpen(frame, talking, 1.7); // fala MUITO rápido
  const surprised = emotion === "surprised" || emotion === "panic";
  const droop = dead ? 34 : emotion === "bored" ? 14 : surprised ? -10 : 0;
  const lenAdd = surprised && !dead ? 14 : 0;
  const wig = Math.sin(frame / 9) * 3;
  const sway = Math.sin(frame / 18) * 1.2;

  const gills = (side: -1 | 1) => {
    const cx = side === -1 ? 150 : 450;
    const specs: [number, number, number][] = [[312, -38, 112], [366, -4, 124], [420, 30, 104]]; // [y, ângulo, comprimento]
    return specs.map(([y, a, len], i) => {
      const ang = side === -1 ? 180 - a - droop * (i === 0 ? 0.6 : 1) : a + droop * (i === 0 ? 0.6 : 1);
      const x = cx + side * (i === 1 ? 16 : 0);
      return (
        <g key={i} transform={`translate(${x} ${y}) rotate(${ang + wig * (i - 1) * side})`}>
          <path d={frond(len + lenAdd, 22)} fill={GILL} {...S} strokeWidth={7} />
          <path d={`M4 0 L${len - 10} 0`} stroke={GILL_HI} strokeWidth={6} strokeLinecap="round" />
        </g>
      );
    });
  };

  const eyeX = (cx: number, cy: number) => (
    <g {...S} strokeWidth={9}><path d={`M${cx - 15} ${cy - 15} L${cx + 15} ${cy + 15} M${cx + 15} ${cy - 15} L${cx - 15} ${cy + 15}`} /></g>
  );
  // delineado gatinho + cílios (é isso que tira a cara de bebê)
  const liner = (cx: number, cy: number, side: -1 | 1) => (
    <g stroke={INK} strokeLinecap="round" fill="none">
      <path d={`M${cx + side * 20} ${cy - 8} L${cx + side * 38} ${cy - 22}`} strokeWidth={8} />
      <path d={`M${cx + side * 8} ${cy - 20} L${cx + side * 16} ${cy - 34}`} strokeWidth={5} />
    </g>
  );

  return (
    <svg width={size} height={(size * POPPY_BOX.h) / POPPY_BOX.w} viewBox={`${POPPY_BOX.x} ${POPPY_BOX.y} ${POPPY_BOX.w} ${POPPY_BOX.h}`}
      style={{ overflow: "visible" }}>
      <g transform={`rotate(${sway} 300 900)`}>
        {/* cauda de axolote com nadadeira, saindo atrás do quadril */}
        <path d="M250 770 C190 800 120 846 44 824 C92 884 196 884 282 820 Z" fill={SKIN} {...S} />
        <path d="M232 800 C176 836 120 850 80 842" fill="none" stroke={SKIN_DARK} strokeWidth={8} strokeLinecap="round" />

        {/* calça wide creme + tênis brancos */}
        <path d="M212 752 L388 752 L416 896 L322 896 L300 800 L278 896 L184 896 Z" fill={PANTS} {...S} />
        <path d="M300 800 L300 770" stroke={INK} strokeWidth={6} strokeLinecap="round" />
        <path d="M200 860 L270 860 M330 860 L402 860" stroke={PANTS_SHADE} strokeWidth={10} strokeLinecap="round" />
        <rect x={168} y={886} width={120} height={40} rx={18} fill="#fff" {...S} strokeWidth={7} />
        <rect x={312} y={886} width={120} height={40} rx={18} fill="#fff" {...S} strokeWidth={7} />

        {/* puffer preto cropped, gomos horizontais */}
        <path d="M184 580 C152 640 158 720 180 770 L420 770 C442 720 448 640 416 580 C372 548 228 548 184 580 Z" fill={PUFFER} {...S} />
        {[636, 696].map((y) => <path key={y} d={`M${176} ${y} Q300 ${y + 16} ${424} ${y}`} fill="none" stroke={PUFFER_HI} strokeWidth={8} strokeLinecap="round" />)}
        <path d="M300 566 L300 770" stroke={PUFFER_HI} strokeWidth={6} />

        {/* braço esquerdo relaxado na cintura */}
        <path d="M196 604 C150 650 146 716 180 744" fill="none" stroke={INK} strokeWidth={82} strokeLinecap="round" />
        <path d="M196 604 C150 650 146 716 180 744" fill="none" stroke={PUFFER} strokeWidth={66} strokeLinecap="round" />
        <circle cx={188} cy={752} r={24} fill={SKIN} {...S} strokeWidth={7} />
        {/* braço direito erguendo o celular (selfie) */}
        {phone ? (
          <g>
            <path d="M404 604 C470 640 530 640 548 612" fill="none" stroke={INK} strokeWidth={82} strokeLinecap="round" />
            <path d="M404 604 C470 640 530 640 548 612" fill="none" stroke={PUFFER} strokeWidth={66} strokeLinecap="round" />
            <g transform="rotate(10 556 560)">
              <rect x={512} y={478} width={88} height={150} rx={18} fill={CASE} {...S} strokeWidth={8} />
              <rect x={524} y={490} width={38} height={38} rx={10} fill={INK} />
              <circle cx={535} cy={501} r={6} fill="#555" /><circle cx={551} cy={517} r={6} fill="#555" />
            </g>
            <circle cx={548} cy={606} r={26} fill={SKIN} {...S} strokeWidth={7} />
          </g>
        ) : (
          <g>
            <path d="M404 604 C450 650 454 716 420 744" fill="none" stroke={INK} strokeWidth={82} strokeLinecap="round" />
            <path d="M404 604 C450 650 454 716 420 744" fill="none" stroke={PUFFER} strokeWidth={66} strokeLinecap="round" />
            <circle cx={412} cy={752} r={24} fill={SKIN} {...S} strokeWidth={7} />
          </g>
        )}
        {/* gola alta do puffer */}
        <path d="M222 560 Q300 596 378 560 L384 600 Q300 636 216 600 Z" fill={PUFFER} {...S} strokeWidth={8} />

        {/* brânquias atrás da cabeça */}
        {gills(-1)}
        {gills(1)}
        {/* cabeça larga e achatada */}
        <path d="M128 400 C128 312 206 268 300 268 C394 268 472 312 472 400 C472 482 400 548 300 548 C200 548 128 482 128 400 Z" fill={SKIN} {...S} />
        <path d="M150 440 C170 500 224 532 280 540 C214 540 158 504 150 440 Z" fill={SKIN_DARK} opacity={0.6} />
        {/* argolas */}
        <circle cx={150} cy={470} r={18} fill="none" stroke={INK} strokeWidth={13} />
        <circle cx={150} cy={470} r={18} fill="none" stroke={GOLD} strokeWidth={6} />
        <circle cx={450} cy={470} r={18} fill="none" stroke={INK} strokeWidth={13} />
        <circle cx={450} cy={470} r={18} fill="none" stroke={GOLD} strokeWidth={6} />

        {dead ? (
          <g>{eyeX(218, 390)}{eyeX(382, 390)}</g>
        ) : (
          <g>
            {liner(218, 392, -1)}
            {liner(382, 392, 1)}
            <Eye cx={218} cy={392} r={22} emotion={emotion} blink={blink} side={-1} lidColor={SKIN} baseLid={0.32} look={[-2, 2]} />
            <Eye cx={382} cy={392} r={22} emotion={emotion} blink={blink} side={1} lidColor={SKIN} baseLid={0.32} look={[-2, 2]} />
            <Brow cx={214} cy={346} w={46} emotion={emotion} side={-1} sw={8} />
            <Brow cx={386} cy={346} w={46} emotion={emotion} side={1} sw={8} />
          </g>
        )}
        <Blush x={176} y={440} rx={26} ry={13} color="#FF5E9C" />
        <Blush x={424} y={440} rx={26} ry={13} color="#FF5E9C" />
        {/* narinas mínimas */}
        <circle cx={288} cy={420} r={4} fill={INK} /><circle cx={312} cy={420} r={4} fill={INK} />
        {dead ? (
          <g>
            <path d="M246 462 Q300 450 354 462" fill="none" {...S} strokeWidth={8} />
            <path d="M312 460 Q316 500 334 496 Q346 490 338 458 Z" fill="#FF5E7E" {...S} strokeWidth={6} />
          </g>
        ) : (
          <Mouth cx={300} cy={talking ? 470 : 458} w={emotion === "neutral" || emotion === "smile" ? 130 : 96}
            emotion={emotion === "neutral" ? "smile" : emotion} talking={talking} open={open} frame={frame} />
        )}
        {raw === "panic" && <Sweat x={460} y={300} frame={frame} />}
      </g>
    </svg>
  );
};
