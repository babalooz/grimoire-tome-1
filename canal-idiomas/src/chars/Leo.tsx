import React from "react";
import { CharProps, INK, S, isBlinking, mouthOpen } from "./common";

// Léo — bicho-preguiça, 29 anos, brasileiro, lava a louça no café. Sabe tudo e quase nunca fala; quando fala, sussurra devagar.
// Silhueta a 64 px: cabeça redonda com "máscara" escura nos olhos + braços longos pendurados + caneca.
// Paleta (playbook 4.5): areia #CDB58E, máscara #6B4A2E, cardigã mostarda #E0A526.
const FUR = "#CDB58E";
const FUR_DARK = "#B39868";
const FACE = "#F4E7CB";
const MASK = "#6B4A2E";
const CARDIGAN = "#E0A526";
const CARDIGAN_DARK = "#B98416";
const MUG = "#3D1F8F";

export const LEO_BOX = { x: 40, y: 110, w: 540, h: 1030 };

export const Leo: React.FC<CharProps & { mug?: boolean }> = ({ frame, talking, emotion, size = 400, seed = "leo", mug = true }) => {
  const blink = isBlinking(frame, seed, 110);
  const open = mouthOpen(frame, talking, 3.2); // fala devagar
  const sway = Math.sin(frame / 22) * 1.6; // balanço lento de preguiça
  const surprised = emotion === "surprised" || emotion === "panic";
  const happy = emotion === "happy" || emotion === "smile";
  const whisper = emotion === "whisper";
  const lid = surprised ? 0 : whisper ? 0.5 : happy ? 0 : 0.42; // sonolento por padrão

  const eye = (cx: number, cy: number, side: number) => {
    if (happy) return <path d={`M${cx - 17} ${cy + 6} Q${cx} ${cy - 16} ${cx + 17} ${cy + 6}`} fill="none" stroke={FACE} strokeWidth={9} strokeLinecap="round" />;
    if (blink) return <path d={`M${cx - 17} ${cy} Q${cx} ${cy + 8} ${cx + 17} ${cy}`} fill="none" stroke={FACE} strokeWidth={8} strokeLinecap="round" />;
    const r = surprised ? 21 : 17;
    const id = `llid-${side}`;
    const px = whisper ? cx + 5 : cx + side * 1.5;
    const py = whisper ? cy + 5 : cy + 1;
    return (
      <g>
        <ellipse cx={cx} cy={cy} rx={r} ry={r * 0.92} fill="#fff" {...S} strokeWidth={6} />
        <circle cx={px} cy={py} r={surprised ? 7 : 9} fill={INK} />
        {lid > 0 && (
          <g>
            <clipPath id={id}><ellipse cx={cx} cy={cy} rx={r} ry={r * 0.92} /></clipPath>
            <rect x={cx - r} y={cy - r} width={r * 2} height={r * 2 * lid} fill={MASK} clipPath={`url(#${id})`} />
            <line x1={cx - r + 3} y1={cy - r * 0.92 + r * 2 * lid * 0.92} x2={cx + r - 3} y2={cy - r * 0.92 + r * 2 * lid * 0.92}
              stroke={INK} strokeWidth={6} strokeLinecap="round" />
          </g>
        )}
      </g>
    );
  };

  const mouth = () => {
    if (talking) return <ellipse cx={300} cy={420} rx={whisper ? 12 : 16} ry={3 + open * (whisper ? 7 : 12)} fill="#5A2E1A" {...S} strokeWidth={5} />;
    if (surprised) return <ellipse cx={300} cy={422} rx={11} ry={13} fill="#5A2E1A" {...S} strokeWidth={5} />;
    if (happy) return <path d="M274 408 Q300 440 326 408" fill="#5A2E1A" {...S} strokeWidth={6} />;
    return <path d="M282 412 Q300 424 318 412" fill="none" {...S} strokeWidth={6} />;
  };

  // braço = tubo de pelo inteiro + manga do cardigã só na parte de cima
  const arm = (d: string, sleeve: string) => (
    <g>
      <path d={d} fill="none" stroke={INK} strokeWidth={56} strokeLinecap="round" />
      <path d={d} fill="none" stroke={FUR} strokeWidth={40} strokeLinecap="round" />
      <path d={sleeve} fill="none" stroke={INK} strokeWidth={70} strokeLinecap="round" />
      <path d={sleeve} fill="none" stroke={CARDIGAN} strokeWidth={54} strokeLinecap="round" />
    </g>
  );
  const hand = (cx: number, cy: number) => (
    <g>
      <circle cx={cx} cy={cy} r={30} fill={FUR} {...S} strokeWidth={7} />
      {[-14, 0, 14].map((dx) => (
        <path key={dx} d={`M${cx + dx} ${cy + 22} Q${cx + dx - 4} ${cy + 50} ${cx + dx + 8} ${cy + 62}`} fill="none" stroke={INK} strokeWidth={14} strokeLinecap="round" />
      ))}
      {[-14, 0, 14].map((dx) => (
        <path key={`c${dx}`} d={`M${cx + dx} ${cy + 22} Q${cx + dx - 4} ${cy + 50} ${cx + dx + 8} ${cy + 62}`} fill="none" stroke={FACE} strokeWidth={7} strokeLinecap="round" />
      ))}
    </g>
  );

  return (
    <svg width={size} height={(size * LEO_BOX.h) / LEO_BOX.w} viewBox={`${LEO_BOX.x} ${LEO_BOX.y} ${LEO_BOX.w} ${LEO_BOX.h}`}
      style={{ overflow: "visible" }}>
      <g transform={`rotate(${sway} 300 1000)`}>
        {/* corpo: cardigã mostarda */}
        <path d="M208 452 C174 560 178 760 198 930 L402 930 C422 760 426 560 392 452 C358 436 242 436 208 452 Z" fill={CARDIGAN} {...S} />
        <path d="M252 452 L300 612 L348 452 Z" fill={FUR} {...S} strokeWidth={7} />
        <path d="M300 612 L300 930" stroke={INK} strokeWidth={7} />
        {[660, 730, 800].map((y) => <circle key={y} cx={322} cy={y} r={10} fill={CARDIGAN_DARK} {...S} strokeWidth={5} />)}
        <path d="M218 770 L268 770 L268 820 L218 820 Z" fill={CARDIGAN_DARK} {...S} strokeWidth={6} />

        {/* braços longos, pendurados até embaixo */}
        {arm("M204 488 C144 560 110 720 106 960", "M204 488 C154 548 126 630 118 700")}
        {arm("M396 488 C456 560 490 720 494 960", "M396 488 C446 548 474 630 482 700")}
        {hand(106, 976)}
        {hand(494, 976)}
        {mug && (
          <g transform="translate(476 1030)">
            <path d="M8 18 C-22 18 -22 58 8 58" fill="none" stroke={INK} strokeWidth={18} />
            <path d="M8 18 C-22 18 -22 58 8 58" fill="none" stroke={MUG} strokeWidth={8} />
            <path d="M0 0 L86 0 L78 84 C76 96 12 96 10 84 Z" fill={MUG} {...S} strokeWidth={7} />
            <path d="M22 30 L62 30" stroke="#FFCC00" strokeWidth={9} strokeLinecap="round" />
          </g>
        )}

        {/* cabeça redonda e felpuda */}
        <path d="M234 200 Q248 148 280 174 Q300 132 322 170 Q352 148 366 200 Z" fill={FUR_DARK} {...S} />
        <path d="M146 330 C146 228 216 172 300 172 C384 172 454 228 454 330 C454 424 392 478 300 478 C208 478 146 424 146 330 Z" fill={FUR} {...S} />
        <path d="M160 360 C170 420 214 460 262 470 C214 470 164 436 160 360 Z" fill={FUR_DARK} opacity={0.6} />
        <ellipse cx={300} cy={352} rx={120} ry={100} fill={FACE} />
        {/* máscara escura inclinada para baixo e para fora */}
        <path d="M284 316 C270 290 212 296 192 338 C180 368 190 396 214 396 C246 394 294 352 284 316 Z" fill={MASK} />
        <path d="M316 316 C330 290 388 296 408 338 C420 368 410 396 386 396 C354 394 306 352 316 316 Z" fill={MASK} />
        {eye(246, 338, -1)}
        {eye(354, 338, 1)}
        <ellipse cx={300} cy={384} rx={24} ry={16} fill="#4A3020" {...S} strokeWidth={5} />
        <ellipse cx={293} cy={379} rx={7} ry={4} fill="#fff" opacity={0.5} />
        {mouth()}
        {(whisper || happy) && (
          <g fill="#FF8FB1" opacity={0.55}>
            <ellipse cx={206} cy={420} rx={24} ry={13} />
            <ellipse cx={394} cy={420} rx={24} ry={13} />
          </g>
        )}
        {whisper && (
          <path d={`M${360 + Math.sin(frame / 8) * 3} 454 q14 -8 28 0 q14 8 28 0`} fill="none" stroke="#fff" strokeWidth={6} strokeLinecap="round" opacity={0.8} />
        )}
      </g>
    </svg>
  );
};
