import React from "react";
import { CharProps, Emotion, INK, S, isBlinking, mouthOpen } from "./common";

// Poppy — gambá (opossum) americana, 21 anos, colega de balcão, quer viralizar. Só fala gíria, rápido.
// Quando passa vergonha (própria ou alheia) SE FINGE DE MORTA: deitada, olhos X, língua pra fora, patas duras pra cima.
// Silhueta a 64 px: rosto triangular + ORELHAS REDONDAS grandes + rabo pelado em ESPIRAL + celular de selfie erguido.
// Paleta (playbook 4.5): lavanda-cinza #B8B3D6, rosto #FFFFFF, nariz #FF8FB1, fones #FFCC00.
const FUR = "#B8B3D6";
const FUR_DARK = "#8F89B8";
const EAR = "#5E5883";
const FACE = "#FFFFFF";
const BELLY = "#E6E3F3";
const NOSE = "#FF8FB1";
const SKIN = "#F7B7C8"; // rabo e patas pelados
const PHONES = "#FFCC00";
const CASE = "#FF4F9A";

export type PoppyEmotion = Emotion | "dead";
export const POPPY_BOX = { x: 40, y: 60, w: 600, h: 920 };

export const Poppy: React.FC<Omit<CharProps, "emotion"> & { emotion: PoppyEmotion }> = ({ frame, talking, emotion, size = 400, seed = "poppy" }) => {
  const dead = emotion === "dead";
  const blink = isBlinking(frame, seed, 70) && !dead;
  const open = mouthOpen(frame, talking && !dead, 1.6); // fala MUITO rápido
  const angry = emotion === "angry"; // "no because—" (careta de vergonha alheia)
  const surprised = emotion === "surprised" || emotion === "panic";
  const happy = emotion === "happy" || emotion === "smile";
  const bored = !angry && !surprised && !happy && !talking && !dead;
  const bounce = dead ? 0 : Math.abs(Math.sin(frame / 9)) * -6;

  const eye = (cx: number, cy: number, side: number) => {
    const ring = <ellipse cx={cx} cy={cy + 2} rx={32} ry={28} fill={FUR_DARK} opacity={0.55} />;
    if (dead) return (
      <g>{ring}<g {...S} strokeWidth={9}><line x1={cx - 16} y1={cy - 16} x2={cx + 16} y2={cy + 16} /><line x1={cx + 16} y1={cy - 16} x2={cx - 16} y2={cy + 16} /></g></g>
    );
    if (happy) return <g>{ring}<path d={`M${cx - 18} ${cy + 6} Q${cx} ${cy - 16} ${cx + 18} ${cy + 6}`} fill="none" {...S} strokeWidth={9} /></g>;
    if (blink) return <g>{ring}<path d={`M${cx - 18} ${cy} Q${cx} ${cy + 8} ${cx + 18} ${cy}`} fill="none" {...S} strokeWidth={8} /></g>;
    const r = surprised ? 24 : 19;
    const lid = bored ? 0.4 : angry ? 0.25 : 0;
    const id = `plid-${side}`;
    const px = bored ? cx + 7 : cx + side * 1; // entediada: olha pro celular
    return (
      <g>
        {ring}
        <ellipse cx={cx} cy={cy} rx={r} ry={r * 1.05} fill="#fff" {...S} strokeWidth={6} />
        <circle cx={px} cy={cy + 2} r={surprised ? 7 : 11} fill={INK} />
        <circle cx={px - 3} cy={cy - 2} r={3} fill="#fff" />
        {lid > 0 && (
          <g>
            <clipPath id={id}><ellipse cx={cx} cy={cy} rx={r} ry={r * 1.05} /></clipPath>
            <rect x={cx - r} y={cy - r * 1.05} width={r * 2} height={r * 2.1 * lid} fill={FACE} clipPath={`url(#${id})`} />
            <line x1={cx - r + 3} y1={cy - r * 1.05 + r * 2.1 * lid} x2={cx + r - 3} y2={cy - r * 1.05 + r * 2.1 * lid} {...S} strokeWidth={6} />
          </g>
        )}
      </g>
    );
  };

  const brows = () => {
    const w = { ...S, strokeWidth: 10 };
    if (dead) return null;
    if (surprised) return <g {...w} fill="none"><path d="M222 212 Q244 196 266 208" /><path d="M314 208 Q336 196 358 212" /></g>;
    if (angry) return <g {...w} fill="none"><path d="M222 214 L266 232" /><path d="M314 232 L358 214" /></g>; // cringe
    if (bored) return <g {...w} fill="none"><path d="M224 226 L264 224" /><path d="M316 222 Q338 210 358 220" /></g>;
    return <g {...w} fill="none"><path d="M224 220 Q246 208 266 218" /><path d="M314 218 Q336 208 356 220" /></g>;
  };

  const mouth = () => {
    if (dead) return (
      <g>
        <path d="M272 432 Q290 424 308 432" fill="none" {...S} strokeWidth={6} />
        <path d="M280 432 C272 470 290 486 304 472 C310 464 306 448 300 432 Z" fill={NOSE} {...S} strokeWidth={5} />
      </g>
    );
    if (talking) return <ellipse cx={290} cy={436} rx={15} ry={3 + open * 10} fill="#5A1E3A" {...S} strokeWidth={5} />;
    if (surprised) return <ellipse cx={290} cy={438} rx={10} ry={12} fill="#5A1E3A" {...S} strokeWidth={5} />;
    if (happy) return <path d="M268 428 Q290 458 312 428 Z" fill="#5A1E3A" {...S} strokeWidth={5} />;
    if (angry) return (
      <g>
        <rect x={266} y={426} width={48} height={20} rx={8} fill="#fff" {...S} strokeWidth={5} />
        <path d="M282 426 L282 446 M298 426 L298 446" stroke={INK} strokeWidth={3} />
      </g>
    );
    return <path d="M276 436 L304 434" fill="none" {...S} strokeWidth={6} />;
  };

  const tube = (d: string, w = 36) => (
    <g>
      <path d={d} fill="none" stroke={INK} strokeWidth={w + 16} strokeLinecap="round" />
      <path d={d} fill="none" stroke={FUR} strokeWidth={w} strokeLinecap="round" />
    </g>
  );

  const tailPath = dead ? "M232 860 C170 880 110 890 70 900" : "M232 850 C150 880 76 850 80 780 C84 716 162 712 168 768 C172 806 128 816 120 790";

  const body = (
    <g>
      {/* rabo pelado em espiral */}
      <path d={tailPath} fill="none" stroke={INK} strokeWidth={34} strokeLinecap="round" />
      <path d={tailPath} fill="none" stroke={SKIN} strokeWidth={20} strokeLinecap="round" />
      {/* patas */}
      {dead ? (
        <g>
          {tube("M360 800 L470 800", 30)}{tube("M360 880 L462 896", 30)}
          <ellipse cx={484} cy={800} rx={16} ry={22} fill={SKIN} {...S} strokeWidth={6} />
          <ellipse cx={476} cy={898} rx={16} ry={22} fill={SKIN} {...S} strokeWidth={6} />
        </g>
      ) : (
        <g>
          <ellipse cx={246} cy={916} rx={36} ry={20} fill={SKIN} {...S} strokeWidth={7} />
          <ellipse cx={334} cy={916} rx={36} ry={20} fill={SKIN} {...S} strokeWidth={7} />
        </g>
      )}
      {/* corpo */}
      <path d="M220 470 C188 540 178 690 194 810 C204 880 246 904 290 904 C334 904 376 880 386 810 C402 690 392 540 360 470 Z" fill={FUR} {...S} />
      <path d="M240 560 C236 660 244 790 290 850 C336 790 344 660 340 560 C320 530 260 530 240 560 Z" fill={BELLY} />
      {/* braço esquerdo */}
      {dead ? tube("M340 560 L460 560") : tube("M224 520 C170 600 172 690 226 730")}
      {!dead && <circle cx={232} cy={732} r={22} fill={SKIN} {...S} strokeWidth={6} />}
      {dead && <circle cx={470} cy={560} r={22} fill={SKIN} {...S} strokeWidth={6} />}
      {/* braço direito com celular de selfie */}
      {!dead && (
        <g>
          {tube("M358 520 C420 520 460 480 468 420")}
          <g transform="rotate(14 478 350)">
            <rect x={440} y={286} width={78} height={128} rx={16} fill={CASE} {...S} strokeWidth={7} />
            <rect x={452} y={300} width={54} height={94} rx={8} fill="#2A2350" />
            <circle cx={479} cy={322} r={11} fill="none" stroke="#fff" strokeWidth={4} opacity={0.8} />
          </g>
          <circle cx={466} cy={418} r={22} fill={SKIN} {...S} strokeWidth={6} />
        </g>
      )}
      {/* fones amarelos no pescoço */}
      <path d="M216 470 Q290 530 364 470" fill="none" stroke={INK} strokeWidth={24} strokeLinecap="round" />
      <path d="M216 470 Q290 530 364 470" fill="none" stroke={PHONES} strokeWidth={12} strokeLinecap="round" />
      <rect x={190} y={440} width={42} height={62} rx={18} fill={PHONES} {...S} strokeWidth={7} />
      <rect x={348} y={440} width={42} height={62} rx={18} fill={PHONES} {...S} strokeWidth={7} />

      {/* orelhas redondas grandes */}
      <circle cx={186} cy={164} r={60} fill={EAR} {...S} />
      <circle cx={190} cy={170} r={34} fill={SKIN} />
      <circle cx={394} cy={164} r={60} fill={EAR} {...S} />
      <circle cx={390} cy={170} r={34} fill={SKIN} />
      {/* cabeça: rosto branco triangular apontando para o nariz */}
      <path d="M176 250 C176 176 230 146 290 146 C350 146 404 176 404 250 C404 316 348 380 312 432 C302 448 278 448 268 432 C232 380 176 316 176 250 Z" fill={FACE} {...S} />
      {/* faixa cinza no topo da cabeça (o "cabelo" dela) */}
      <path d="M214 170 C246 150 334 150 366 170 C354 196 318 204 298 244 C294 252 286 252 282 244 C262 204 226 196 214 170 Z" fill={FUR_DARK} />
      <path d="M252 160 Q290 176 330 158" fill="none" stroke={PHONES} strokeWidth={10} strokeLinecap="round" />
      {eye(244, 272, -1)}
      {eye(336, 272, 1)}
      {brows()}
      {/* nariz rosa */}
      <ellipse cx={290} cy={408} rx={24} ry={17} fill={NOSE} {...S} strokeWidth={6} />
      <ellipse cx={283} cy={402} rx={7} ry={4} fill="#fff" opacity={0.6} />
      <g stroke={INK} strokeWidth={4} strokeLinecap="round" opacity={0.6}>
        <path d="M252 400 L204 392" /><path d="M254 412 L208 418" /><path d="M328 400 L376 392" /><path d="M326 412 L372 418" />
      </g>
      {mouth()}
      {(happy || angry) && (
        <g fill={NOSE} opacity={0.5}><ellipse cx={220} cy={330} rx={22} ry={12} /><ellipse cx={360} cy={330} rx={22} ry={12} /></g>
      )}
    </g>
  );

  if (dead) {
    // deitada de barriga pra cima: cabeça à esquerda, patas duras apontando pro teto
    const float = Math.sin(frame / 10) * 4;
    return (
      <svg width={size} height={(size * POPPY_BOX.h) / POPPY_BOX.w} viewBox={`${POPPY_BOX.x} ${POPPY_BOX.y} ${POPPY_BOX.w} ${POPPY_BOX.h}`} style={{ overflow: "visible" }}>
        <ellipse cx={350} cy={912} rx={290} ry={22} fill="#000" opacity={0.18} />
        <g transform="translate(360 790) scale(0.72) rotate(-90) translate(-300 -560)">{body}</g>
        {/* celular caído */}
        <g transform="rotate(-8 560 900)">
          <rect x={520} y={860} width={110} height={56} rx={12} fill={CASE} {...S} strokeWidth={7} />
          <rect x={532} y={870} width={86} height={36} rx={6} fill="#2A2350" />
        </g>
        {/* alminha saindo de vergonha */}
        <g transform={`translate(150 ${560 + float})`} opacity={0.85}>
          <path d="M-30 40 C-34 -10 -18 -40 0 -40 C18 -40 34 -10 30 40 L18 28 L6 42 L-6 28 L-18 42 Z" fill="#fff" {...S} strokeWidth={6} />
          <circle cx={-9} cy={-8} r={4} fill={INK} /><circle cx={9} cy={-8} r={4} fill={INK} />
          <ellipse cx={0} cy={-56} rx={22} ry={7} fill="none" stroke={PHONES} strokeWidth={6} />
        </g>
      </svg>
    );
  }

  return (
    <svg width={size} height={(size * POPPY_BOX.h) / POPPY_BOX.w} viewBox={`${POPPY_BOX.x} ${POPPY_BOX.y} ${POPPY_BOX.w} ${POPPY_BOX.h}`}
      style={{ overflow: "visible", transform: `translateY(${bounce}px)` }}>
      {body}
      {happy && (
        <g fill={PHONES} {...S} strokeWidth={5}>
          <path d="M540 230 l8 18 l18 8 l-18 8 l-8 18 l-8 -18 l-18 -8 l18 -8 Z" />
          <path d="M110 300 l6 13 l13 6 l-13 6 l-6 13 l-6 -13 l-13 -6 l13 -6 Z" />
        </g>
      )}
    </svg>
  );
};
