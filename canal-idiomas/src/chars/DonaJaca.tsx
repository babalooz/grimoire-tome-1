import React from "react";
import { CharProps, INK, S, isBlinking, mouthOpen } from "./common";

// Dona Jaca — capivara, mãe da Capy, em Curitiba. Só aparece por VIDEOCHAMADA, com a câmera no queixo:
// rosto enquadrado de baixo pra cima (narinas e papada enormes, olhinhos lá em cima), bobs no cabelo, ventilador de teto.
// Cobra inglês e não fala nenhuma palavra. Bordão: "Fala um inglês pra mãe ouvir!"
// Silhueta a 64 px: MOLDURA DE CELULAR VERTICAL + fileira de bobs + queixo largo ocupando o fundo da tela.
// Paleta (playbook 4.5): caramelo escuro #A06A3C, bobs #FF8FB1, moldura #1A1A1A.
const FUR = "#A06A3C";
const FUR_DARK = "#7E5029";
const CHIN = "#C08A5A";
const NOSTRIL = "#3A2213";
const BOBS = "#FF8FB1";
const BOBS_DARK = "#E0668E";
const FRAME = "#1A1A1A";
const CEILING = "#F6E7CF";
const ROBE = "#8C6CFF"; // roupão lilás estampado
const ROBE_DOT = "#FFCC00";

export const JACA_BOX = { x: 0, y: 0, w: 460, h: 820 };

export const DonaJaca: React.FC<CharProps> = ({ frame, talking, emotion, size = 300, seed = "jaca" }) => {
  const blink = isBlinking(frame, seed, 76);
  const open = mouthOpen(frame, talking, 2.0);
  const angry = emotion === "angry";
  const surprised = emotion === "surprised" || emotion === "panic";
  const happy = emotion === "happy" || emotion === "smile";
  // mão tremendo segurando o celular
  const wobble = Math.sin(frame / 7) * 1.2 + Math.sin(frame / 2.3) * (angry ? 1.4 : 0.3);
  const faceY = Math.sin(frame / 11) * 6;

  // olhos pequenos lá em cima, olhando pra baixo (pra tela)
  const eye = (cx: number, cy: number, side: number) => {
    if (happy) return <path d={`M${cx - 16} ${cy + 4} Q${cx} ${cy - 14} ${cx + 16} ${cy + 4}`} fill="none" {...S} strokeWidth={8} />;
    if (blink) return <path d={`M${cx - 16} ${cy} Q${cx} ${cy + 7} ${cx + 16} ${cy}`} fill="none" {...S} strokeWidth={7} />;
    const r = surprised ? 19 : 14;
    const id = `jlid-${side}`;
    const lid = angry ? 0.35 : 0;
    return (
      <g>
        <ellipse cx={cx} cy={cy} rx={r} ry={r * 0.85} fill="#fff" {...S} strokeWidth={5} />
        <circle cx={cx} cy={cy + (surprised ? 2 : 5)} r={surprised ? 5 : 7} fill={INK} />
        {lid > 0 && (
          <g>
            <clipPath id={id}><ellipse cx={cx} cy={cy} rx={r} ry={r * 0.85} /></clipPath>
            <rect x={cx - r} y={cy - r} width={r * 2} height={r * 2 * lid} fill={FUR} clipPath={`url(#${id})`} />
          </g>
        )}
        {/* óculos de leitura (arame fino) */}
        <circle cx={cx} cy={cy} r={24} fill="none" stroke={INK} strokeWidth={4} />
      </g>
    );
  };

  const brows = () => {
    const w = { ...S, strokeWidth: 8 };
    if (surprised) return <g {...w} fill="none"><path d="M146 226 Q168 212 190 222" /><path d="M270 222 Q292 212 314 226" /></g>;
    if (angry) return <g {...w} fill="none"><path d="M146 236 L194 250" /><path d="M266 250 L314 236" /></g>;
    return <g {...w} fill="none"><path d="M148 240 Q168 232 190 238" /><path d="M270 238 Q292 232 312 240" /></g>;
  };

  const mouth = () => {
    if (talking) return <ellipse cx={230} cy={560} rx={62} ry={10 + open * 40} fill="#5A2E1A" {...S} strokeWidth={8} />;
    if (surprised) return <ellipse cx={230} cy={566} rx={36} ry={40} fill="#5A2E1A" {...S} strokeWidth={8} />;
    if (happy) return (
      <g>
        <path d="M150 540 Q230 640 310 540 Z" fill="#5A2E1A" {...S} strokeWidth={8} />
        <path d="M200 544 L200 566 L226 566 L226 544 M234 544 L234 566 L260 566 L260 544" fill="#fff" {...S} strokeWidth={5} />
      </g>
    );
    if (angry) return <path d="M168 572 Q230 530 292 572" fill="none" {...S} strokeWidth={10} />;
    return <path d="M176 556 Q230 578 284 556" fill="none" {...S} strokeWidth={9} />;
  };

  return (
    <svg width={size} height={(size * JACA_BOX.h) / JACA_BOX.w} viewBox={`${JACA_BOX.x} ${JACA_BOX.y} ${JACA_BOX.w} ${JACA_BOX.h}`}
      style={{ overflow: "visible", transform: `rotate(${wobble}deg)` }}>
      <defs>
        <clipPath id="jaca-screen"><rect x={42} y={58} width={376} height={704} rx={38} /></clipPath>
      </defs>
      {/* moldura do celular */}
      <rect x={20} y={20} width={420} height={780} rx={62} fill={FRAME} {...S} />
      <g clipPath="url(#jaca-screen)">
        {/* teto de casa + ventilador de teto */}
        <rect x={42} y={58} width={376} height={704} fill={CEILING} />
        <path d="M42 150 L418 118" stroke="#E5D2B2" strokeWidth={6} />
        <g transform={`translate(330 96) rotate(${(frame * 9) % 360})`}>
          <path d="M0 0 L60 -8 L60 8 Z M0 0 L-38 -46 L-24 -54 Z M0 0 L-26 54 L-40 44 Z" fill="#D8C4A2" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
        </g>
        <circle cx={330} cy={96} r={12} fill="#fff" stroke={INK} strokeWidth={4} />

        <g transform={`translate(0 ${faceY})`}>
          {/* roupão lilás de bolinha nos cantos de baixo */}
          <path d="M20 780 C40 690 90 660 130 690 L330 690 C370 660 420 690 440 780 Z" fill={ROBE} {...S} />
          {[[70, 740], [110, 712], [370, 736], [396, 760]].map(([x, y]) => <circle key={x} cx={x} cy={y} r={8} fill={ROBE_DOT} />)}
          {/* bobs (atrás da cabeça) */}
          {[110, 170, 230, 290, 350].map((x, i) => (
            <g key={x} transform={`rotate(${(i - 2) * 12} ${x} 170)`}>
              <rect x={x - 26} y={124} width={52} height={62} rx={14} fill={BOBS} {...S} strokeWidth={7} />
              <path d={`M${x - 22} 146 L${x + 22} 146 M${x - 22} 164 L${x + 22} 164`} stroke={BOBS_DARK} strokeWidth={5} />
            </g>
          ))}
          {/* orelhinhas */}
          <circle cx={92} cy={210} r={26} fill={FUR_DARK} {...S} strokeWidth={8} />
          <circle cx={368} cy={210} r={26} fill={FUR_DARK} {...S} strokeWidth={8} />
          {/* cabeça vista de baixo: larga embaixo, estreita em cima */}
          <path d="M100 250 C110 190 170 172 230 172 C290 172 350 190 360 250 C392 330 432 450 440 560 C446 660 400 740 230 760 C60 740 14 660 20 560 C28 450 68 330 100 250 Z"
            fill={FUR} {...S} />
          {/* papada / queixo (o que a câmera mais vê) */}
          <path d="M40 600 C60 700 140 760 230 764 C320 760 400 700 420 600 C390 660 320 700 230 702 C140 700 70 660 40 600 Z" fill={CHIN} />
          <path d="M90 690 Q230 740 370 690" fill="none" {...S} strokeWidth={7} opacity={0.6} />
          {/* focinho de capivara visto de baixo: bloco com narinas GRANDES */}
          <path d="M110 380 C120 330 170 318 230 318 C290 318 340 330 350 380 C360 430 350 490 310 510 L150 510 C110 490 100 430 110 380 Z" fill={FUR_DARK} opacity={0.5} />
          <ellipse cx={184} cy={440} rx={30} ry={20} fill={NOSTRIL} transform="rotate(-12 184 440)" />
          <ellipse cx={276} cy={440} rx={30} ry={20} fill={NOSTRIL} transform="rotate(12 276 440)" />
          <path d="M230 470 L230 520" {...S} strokeWidth={7} />
          {mouth()}
          {eye(168, 272, -1)}
          {eye(292, 272, 1)}
          <path d="M192 272 L268 272" stroke={INK} strokeWidth={4} />
          {brows()}
          {(happy || talking) && (
            <g fill={BOBS} opacity={0.5}><ellipse cx={100} cy={500} rx={30} ry={16} /><ellipse cx={360} cy={500} rx={30} ry={16} /></g>
          )}
          {angry && (
            <g transform={`translate(${380 + Math.sin(frame / 3) * 3} 300)`} fill="#fff" stroke={INK} strokeWidth={5} opacity={0.9}>
              <circle cx={0} cy={0} r={14} /><circle cx={18} cy={-18} r={10} />
            </g>
          )}
        </g>

        {/* interface da chamada */}
        <rect x={42} y={58} width={376} height={64} fill="#000" opacity={0.35} />
        <text x={70} y={100} fontFamily="Rubik, sans-serif" fontWeight={700} fontSize={28} fill="#fff">Mãe ♥</text>
        <circle cx={196} cy={90} r={7} fill="#FF4D5E" opacity={Math.floor(frame / 15) % 2 ? 1 : 0.3} />
        <text x={210} y={100} fontFamily="Rubik, sans-serif" fontSize={24} fill="#fff" opacity={0.9}>{`0${Math.floor(frame / 30 / 60) % 10}:${String(Math.floor(frame / 30) % 60).padStart(2, "0")}`}</text>
        {/* minha câmera (a Capy) */}
        <rect x={322} y={136} width={80} height={112} rx={14} fill="#3D1F8F" stroke="#fff" strokeWidth={4} />
        <path d="M334 248 C334 200 352 178 372 176 C394 176 406 196 402 218 L402 248 Z" fill="#C98B54" />
        <circle cx={352} cy={184} r={8} fill="#C98B54" />
        {/* botão de desligar */}
        <circle cx={230} cy={712} r={34} fill="#FF4D5E" stroke="#fff" strokeWidth={4} />
        <path d="M210 716 Q230 700 250 716" fill="none" stroke="#fff" strokeWidth={8} strokeLinecap="round" />
      </g>
      {/* borda da tela + câmera frontal */}
      <rect x={42} y={58} width={376} height={704} rx={38} fill="none" stroke={INK} strokeWidth={4} />
      <rect x={190} y={32} width={80} height={16} rx={8} fill="#000" />
      <circle cx={250} cy={40} r={4} fill="#2A2350" />
    </svg>
  );
};
