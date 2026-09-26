import React from "react";
import { CharProps, INK, S, isBlinking, mouthOpen } from "./common";

// Hank — bisão, 58 anos, dono do Bean There Café. Rabugento, literal, secretamente fã do Brasil.
// Silhueta a 64 px: bloco com corcova + topete e barba enormes + chifres creme. Olha para a ESQUERDA (3/4).
// Paleta (playbook 4.5): marrom #4A2E24, avental tomate #E23B3B, chifres creme.
const MANE = "#4A2E24";
const FUR = "#7B4F36";
const HEAD = "#6A4231";
const MUZZLE = "#A07C62";
const HORN = "#F3E3C3";
const APRON = "#E23B3B";
const APRON_DARK = "#B82A2E";

export const HANK_BOX = { x: 60, y: 150, w: 680, h: 720 };

export const Hank: React.FC<CharProps> = ({ frame, talking, emotion, size = 520, seed = "hank" }) => {
  const blink = isBlinking(frame, seed, 96);
  const open = mouthOpen(frame, talking, 2.4);
  const breathe = 1 + Math.sin(frame / 16) * 0.008;
  const angry = emotion === "angry";
  const eyebrow = emotion === "eyebrow";
  const surprised = emotion === "surprised" || emotion === "panic";
  const happy = emotion === "happy" || emotion === "smile";
  const bored = emotion === "bored" || emotion === "neutral" || emotion === "zen";
  const shake = angry ? Math.sin(frame * 1.9) * 3 : 0;

  // olhos: próximo (215,445) e distante (340,438), olhando para a esquerda
  const eye = (cx: number, cy: number, r: number, far: boolean) => {
    if (happy) return <path d={`M${cx - r} ${cy + 6} Q${cx} ${cy - r * 1.1} ${cx + r} ${cy + 6}`} fill="none" {...S} strokeWidth={10} />;
    if (blink) return <path d={`M${cx - r} ${cy} Q${cx} ${cy + 10} ${cx + r} ${cy}`} fill="none" {...S} strokeWidth={9} />;
    const big = surprised || (eyebrow && !far) ? 1.25 : 1;
    const rx = r * big, ry = r * 0.9 * big;
    const lid = bored ? 0.45 : angry ? 0.3 : 0;
    const id = `hlid-${far ? "f" : "n"}`;
    return (
      <g>
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#fff" {...S} strokeWidth={7} />
        <circle cx={cx - 6} cy={cy + 2} r={surprised ? 7 : 10} fill={INK} />
        {lid > 0 && (
          <g>
            <clipPath id={id}><ellipse cx={cx} cy={cy} rx={rx} ry={ry} /></clipPath>
            <rect x={cx - rx} y={cy - ry} width={rx * 2} height={ry * 2 * lid} fill={HEAD} clipPath={`url(#${id})`} />
            <line x1={cx - rx + 3} y1={cy - ry + ry * 2 * lid} x2={cx + rx - 3} y2={cy - ry + ry * 2 * lid} {...S} strokeWidth={7} />
          </g>
        )}
      </g>
    );
  };

  // sobrancelhas grossas (ponta interna perto de x≈280)
  const brows = () => {
    const w = { ...S, strokeWidth: 15 };
    if (surprised) return <g {...w} fill="none"><path d="M182 392 Q215 372 248 388" /><path d="M312 384 Q342 366 372 378" /></g>;
    if (eyebrow) return <g {...w} fill="none"><path d="M180 380 Q212 352 250 372" /><path d="M308 412 L372 400" /></g>;
    if (angry) return <g {...w} fill="none"><path d="M182 398 L256 424" /><path d="M306 420 L372 392" /></g>;
    if (happy) return <g {...w} fill="none"><path d="M184 398 Q215 384 248 396" /><path d="M312 392 Q342 380 370 390" /></g>;
    return <g {...w} fill="none"><path d="M182 404 L252 414" /><path d="M308 412 L372 400" /></g>; // rabugento padrão
  };

  const mouth = () => {
    if (talking) return <ellipse cx={238} cy={622} rx={30} ry={5 + open * 17} fill="#4A1E14" {...S} strokeWidth={7} />;
    if (surprised) return <ellipse cx={238} cy={624} rx={17} ry={19} fill="#4A1E14" {...S} strokeWidth={7} />;
    if (happy) return <path d="M190 606 Q238 656 288 606" fill="#4A1E14" {...S} strokeWidth={8} />;
    if (angry) return <path d="M196 632 Q238 606 282 632" fill="none" {...S} strokeWidth={9} />;
    return <path d="M198 624 Q238 612 280 626" fill="none" {...S} strokeWidth={9} />;
  };

  return (
    <svg width={size} height={(size * HANK_BOX.h) / HANK_BOX.w} viewBox={`${HANK_BOX.x} ${HANK_BOX.y} ${HANK_BOX.w} ${HANK_BOX.h}`}
      style={{ overflow: "visible", transform: `translateX(${shake}px)` }}>
      <g transform={`translate(400 870) scale(1 ${breathe}) translate(-400 -870)`}>
        {/* corpo: corcova alta atrás da cabeça */}
        <path d="M130 870 C126 760 150 660 228 600 C258 430 340 214 468 196 C572 186 628 300 666 410 C700 500 716 580 716 660 L716 870 Z" fill={FUR} {...S} />
        <path d="M620 350 C670 430 704 520 708 640 C684 540 660 450 620 350 Z" fill="#000" opacity={0.12} />
        {/* manto felpudo escuro (frente da corcova), borda recortada */}
        <path d="M150 870 C150 740 190 640 240 604 C272 436 346 220 468 198 Q532 246 502 296 Q566 336 520 420 Q584 456 540 506 Q600 548 552 598 Q610 644 562 692 Q614 744 570 790 Q612 830 590 870 Z"
          fill={MANE} {...S} />
        {/* avental tomate */}
        <path d="M262 712 L548 704 C566 760 574 812 580 870 L238 870 C242 812 250 760 262 712 Z" fill={APRON} {...S} />
        <path d="M262 736 L546 728" stroke="#fff" strokeWidth={5} strokeDasharray="14 12" opacity={0.7} />
        {/* braços cruzados */}
        <path d="M250 772 L500 760" stroke={INK} strokeWidth={80} strokeLinecap="round" />
        <path d="M250 772 L500 760" stroke="#5A382B" strokeWidth={62} strokeLinecap="round" />
        <path d="M520 820 L262 812" stroke={INK} strokeWidth={80} strokeLinecap="round" />
        <path d="M520 820 L262 812" stroke="#5E3B2D" strokeWidth={62} strokeLinecap="round" />
        <path d="M540 812 C560 800 566 830 548 842" fill="none" {...S} strokeWidth={7} />
        <rect x={420} y={836} width={70} height={34} rx={6} fill={APRON_DARK} {...S} strokeWidth={6} />
      </g>

      {/* chifres */}
      <path d="M178 336 C118 342 86 304 92 238 C112 282 142 294 184 292 Z" fill={HORN} {...S} />
      <path d="M440 322 C498 322 528 286 520 222 C504 264 476 278 436 282 Z" fill={HORN} {...S} />
      {/* cabeça */}
      <path d="M150 380 C150 318 196 296 266 296 L386 296 C446 296 474 332 474 392 L474 540 C474 610 432 650 372 660 L262 664 C192 668 142 628 140 562 Z"
        fill={HEAD} {...S} />
      {/* barba */}
      <path d="M176 640 Q196 720 234 762 Q262 792 300 808 Q300 752 326 712 Q352 676 360 636 Z" fill={MANE} {...S} />
      {/* focinho largo e chato */}
      <path d="M128 540 C124 496 164 482 226 486 L300 490 C346 494 362 530 358 574 C354 624 322 652 262 656 L192 656 C142 652 130 604 128 540 Z"
        fill={MUZZLE} {...S} />
      <ellipse cx={170} cy={540} rx={15} ry={10} fill={INK} transform="rotate(-18 170 540)" />
      <ellipse cx={246} cy={544} rx={15} ry={10} fill={INK} transform="rotate(14 246 544)" />
      {mouth()}
      {/* topete enorme */}
      <path d="M146 396 Q112 326 170 304 Q168 232 252 240 Q296 180 372 222 Q444 206 462 276 Q512 304 474 372 Q438 350 402 366 Q358 336 318 368 Q276 338 236 370 Q192 352 146 396 Z"
        fill={MANE} {...S} />
      <path d="M224 290 Q256 268 290 282 M330 262 Q364 246 396 262" fill="none" stroke="#6B4A3A" strokeWidth={8} strokeLinecap="round" />
      {eye(214, 446, 24, false)}
      {eye(338, 440, 21, true)}
      {brows()}
      {angry && (
        <g transform={`translate(${470 + Math.sin(frame / 3) * 4} 300)`} fill="#fff" stroke={INK} strokeWidth={6} opacity={0.9}>
          <circle cx={0} cy={0} r={18} /><circle cx={24} cy={-20} r={13} /><circle cx={40} cy={-44} r={9} />
        </g>
      )}
    </svg>
  );
};
