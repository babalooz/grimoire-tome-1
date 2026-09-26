import React from "react";
import { CharProps, INK, S, isBlinking, mouthOpen } from "./common";
import { Brow, Eye, Mouth, Sweat } from "./face";

// Hank — PANDA-GIGANTE, 58 anos, dono do Bean There Café. Rabugento, humor seco, traduz tudo ao pé da letra.
// Cara fechada padrão (pálpebra a meio-mastro + cenho franzido). Olha para a ESQUERDA (onde fica a Capy no balcão).
// Silhueta a 64 px: CABEÇA-BOLA ENORME com duas orelhas pretas redondas sobre ombros largos + braços cruzados.
// Paleta: branco-osso #F4F1EA, preto-carvão #2B2530, avental tomate #E23B3B com grão de café.
// Mesmo viewBox do bisão anterior → STAGE.hank em Sitcom.tsx continua valendo.
const WHITE = "#F4F1EA";
const SHADE = "#DCD5C8";
const BLACK = "#2B2530";
const BLACK_HI = "#4A4252";
const APRON = "#E23B3B";
const APRON_DARK = "#B82A2E";
const BEAN = "#7A4A2A";

export const HANK_BOX = { x: 60, y: 150, w: 680, h: 720 };

export const Hank: React.FC<CharProps> = ({ frame, talking, emotion, size = 520, seed = "hank" }) => {
  const blink = isBlinking(frame, seed, 96);
  const open = mouthOpen(frame, talking, 2.4);
  const breathe = 1 + Math.sin(frame / 16) * 0.008;
  const angry = emotion === "angry";
  const panic = emotion === "panic";
  const surprised = emotion === "surprised" || panic;
  const shake = angry ? Math.sin(frame * 1.9) * 3 : panic ? Math.sin(frame * 2.4) * 2 : 0;
  const earY = surprised ? -12 : angry ? 6 : 0;

  const arm = (d: string) => (
    <g>
      <path d={d} stroke={INK} strokeWidth={84} strokeLinecap="round" fill="none" />
      <path d={d} stroke={BLACK} strokeWidth={66} strokeLinecap="round" fill="none" />
    </g>
  );

  return (
    <svg width={size} height={(size * HANK_BOX.h) / HANK_BOX.w} viewBox={`${HANK_BOX.x} ${HANK_BOX.y} ${HANK_BOX.w} ${HANK_BOX.h}`}
      style={{ overflow: "visible", transform: `translateX(${shake}px)` }}>
      <g transform={`translate(400 870) scale(1 ${breathe}) translate(-400 -870)`}>
        {/* corpo: ombros pretos largos, peito branco, avental */}
        <path d="M104 870 C100 736 150 646 262 612 L476 598 C616 604 704 700 716 870 Z" fill={BLACK} {...S} />
        <path d="M600 640 C660 690 694 770 700 860" fill="none" stroke={BLACK_HI} strokeWidth={10} strokeLinecap="round" />
        <path d="M244 870 C240 758 290 676 404 664 C524 668 584 758 590 870 Z" fill={WHITE} {...S} />
        <path d="M256 704 L566 700 C578 760 586 818 590 870 L240 870 C244 806 248 752 256 704 Z" fill={APRON} {...S} />
        <path d="M300 704 L318 640" stroke={INK} strokeWidth={26} strokeLinecap="round" />
        <path d="M300 704 L318 640" stroke={APRON} strokeWidth={12} strokeLinecap="round" />
        <path d="M526 700 L500 626" stroke={INK} strokeWidth={26} strokeLinecap="round" />
        <path d="M526 700 L500 626" stroke={APRON} strokeWidth={12} strokeLinecap="round" />
        <path d="M262 726 L560 722" stroke="#fff" strokeWidth={5} strokeDasharray="14 12" opacity={0.6} />
        {/* braços cruzados (pretos, por cima do avental) */}
        {arm("M244 782 L516 772")}
        <path d="M262 758 L500 750" stroke={BLACK_HI} strokeWidth={9} strokeLinecap="round" />
        {arm("M548 832 L270 826")}
        <path d="M290 806 L520 810" stroke={BLACK_HI} strokeWidth={9} strokeLinecap="round" />
        {/* grão de café (logo do Bean There) no bolso do avental */}
        <g transform="translate(470 858) rotate(-20)">
          <ellipse cx={0} cy={0} rx={20} ry={13} fill={BEAN} {...S} strokeWidth={5} />
          <path d="M-14 2 Q0 -6 14 2" fill="none" stroke={INK} strokeWidth={4} strokeLinecap="round" />
        </g>
      </g>

      {/* orelhas pretas redondas */}
      <g transform={`translate(0 ${earY})`}>
        <circle cx={172} cy={322} r={54} fill={BLACK} {...S} />
        <circle cx={176} cy={326} r={26} fill={BLACK_HI} />
        <circle cx={438} cy={314} r={50} fill={BLACK} {...S} />
        <circle cx={434} cy={318} r={23} fill={BLACK_HI} />
      </g>

      {/* cabeça-bola, bochechas fofas embaixo */}
      <path d="M128 456 C126 346 206 290 304 290 C404 290 482 344 482 454 C482 520 460 572 420 604 Q400 632 360 628 Q330 640 300 632 Q264 642 236 628 Q196 632 180 604 C144 574 128 520 128 456 Z"
        fill={WHITE} {...S} />
      <path d="M146 500 C156 560 190 600 240 618 C196 620 150 580 146 500 Z" fill={SHADE} />
      {/* topete ralo de 58 anos */}
      <path d="M268 296 Q262 262 290 262 Q286 280 304 290 Q312 258 342 266 Q322 278 326 294" fill={WHITE} {...S} strokeWidth={7} />

      {/* manchas dos olhos: gota caindo para fora (cara de cansado) */}
      <path d="M254 424 C236 396 184 404 170 448 C160 484 176 514 202 508 C236 500 266 456 254 424 Z" fill={BLACK} />
      <path d="M330 420 C350 394 398 402 410 444 C420 480 404 506 380 500 C348 494 318 452 330 420 Z" fill={BLACK} />
      <Eye cx={220} cy={452} r={21} emotion={emotion} blink={blink} side={-1} lidColor={BLACK} baseLid={0.44} look={[-6, 2]} lineColor={WHITE} sw={6} />
      <Eye cx={364} cy={448} r={19} emotion={emotion} blink={blink} side={1} lidColor={BLACK} baseLid={0.44} look={[-6, 2]} lineColor={WHITE} sw={6} />
      <Brow cx={214} cy={396} w={74} emotion={emotion} side={-1} color={INK} sw={15} grump={10} />
      <Brow cx={364} cy={392} w={66} emotion={emotion} side={1} color={INK} sw={15} grump={10} />

      {/* focinho: nariz preto + boca */}
      <ellipse cx={282} cy={548} rx={72} ry={52} fill="#FFFFFF" />
      <path d="M254 508 Q282 498 310 508 Q306 530 282 538 Q258 530 254 508 Z" fill={BLACK} {...S} strokeWidth={6} />
      <ellipse cx={272} cy={510} rx={8} ry={4} fill="#fff" opacity={0.5} />
      {!talking && emotion !== "surprised" && emotion !== "happy" && <path d="M282 538 L282 556" stroke={INK} strokeWidth={6} strokeLinecap="round" />}
      <Mouth cx={282} cy={talking ? 574 : 568} w={76} emotion={emotion} talking={talking} open={open} grump frame={frame} />

      {angry && (
        <g transform={`translate(${486 + Math.sin(frame / 3) * 4} 300)`} fill="#fff" stroke={INK} strokeWidth={6} opacity={0.9}>
          <circle cx={0} cy={0} r={18} /><circle cx={24} cy={-20} r={13} /><circle cx={40} cy={-44} r={9} />
        </g>
      )}
      {panic && <Sweat x={470} y={380} frame={frame} n={2} />}
    </svg>
  );
};
