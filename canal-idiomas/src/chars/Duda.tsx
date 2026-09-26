import React from "react";
import { CharProps, INK, S, isBlinking, mouthOpen } from "./common";

// Duda — quati, 34 anos, 8 anos na Flórida, "fluente". Fala tudo errado com confiança total ("vou parkear").
// Silhueta a 64 px: CAUDA ANELADA EM PÉ, mais alta que ele + focinho comprido para a DIREITA + joinha.
// Paleta (playbook 4.5): ferrugem #D9622B, anéis creme #F3D9B1, pochete rosa #FF4F9A, óculos escuros na testa.
const FUR = "#D9622B";
const FUR_DARK = "#A8441A";
const MASK = "#7A3214";
const CREAM = "#F3D9B1";
const PINK = "#FF4F9A";
const PINK_DARK = "#D12E7A";
const SHADES = "#1A1A1A";

export const DUDA_BOX = { x: 40, y: 50, w: 600, h: 900 };

export const Duda: React.FC<CharProps> = ({ frame, talking, emotion, size = 400, seed = "duda" }) => {
  const blink = isBlinking(frame, seed, 90);
  const open = mouthOpen(frame, talking, 1.9); // fala rápido e cheio de si
  const angry = emotion === "angry";
  const surprised = emotion === "surprised" || emotion === "panic";
  const happy = emotion === "happy" || emotion === "smile";
  const eyebrow = emotion === "eyebrow";
  const smug = !angry && !surprised && !happy; // padrão: convencido
  const bob = Math.sin(frame / 12) * 4; // gingado confiante
  const tailSway = Math.sin(frame / 18) * 3;
  const shake = angry ? Math.sin(frame * 1.9) * 3 : 0;

  const eye = (cx: number, cy: number, r: number, far: boolean) => {
    if (happy) return <path d={`M${cx - r} ${cy + 6} Q${cx} ${cy - r * 1.1} ${cx + r} ${cy + 6}`} fill="none" {...S} strokeWidth={9} />;
    if (blink) return <path d={`M${cx - r} ${cy} Q${cx} ${cy + 9} ${cx + r} ${cy}`} fill="none" {...S} strokeWidth={8} />;
    const k = surprised ? 1.3 : 1;
    const rx = r * k, ry = r * 0.95 * k;
    const lid = smug && !(eyebrow && !far) ? 0.38 : angry ? 0.3 : 0;
    const id = `dlid-${far ? "f" : "n"}`;
    return (
      <g>
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#fff" {...S} strokeWidth={6} />
        <circle cx={cx + 5} cy={cy + 2} r={surprised ? 6 : 9} fill={INK} />
        {lid > 0 && (
          <g>
            <clipPath id={id}><ellipse cx={cx} cy={cy} rx={rx} ry={ry} /></clipPath>
            <rect x={cx - rx} y={cy - ry} width={rx * 2} height={ry * 2 * lid} fill={MASK} clipPath={`url(#${id})`} />
            <line x1={cx - rx + 3} y1={cy - ry + ry * 2 * lid} x2={cx + rx - 3} y2={cy - ry + ry * 2 * lid} {...S} strokeWidth={6} />
          </g>
        )}
      </g>
    );
  };

  // "sobrancelhas" = manchas creme do quati acima dos olhos (contorno + miolo creme)
  const brow = (d: string) => (
    <g fill="none" strokeLinecap="round">
      <path d={d} stroke={INK} strokeWidth={24} />
      <path d={d} stroke={CREAM} strokeWidth={12} />
    </g>
  );
  const brows = () => {
    if (surprised) return <>{brow("M236 238 Q262 218 290 232")}{brow("M322 230 Q346 214 368 226")}</>;
    if (angry) return <>{brow("M238 246 L292 266")}{brow("M324 262 L370 238")}</>;
    if (eyebrow) return <>{brow("M234 232 Q262 206 292 226")}{brow("M324 262 L370 256")}</>;
    if (happy) return <>{brow("M238 250 Q264 236 290 248")}{brow("M324 244 Q346 232 368 242")}</>;
    return <>{brow("M236 240 Q264 228 292 244")}{brow("M324 238 Q348 226 370 236")}</>; // convencido
  };

  const mouth = () => {
    if (talking) return <ellipse cx={392} cy={384} rx={24} ry={4 + open * 15} fill="#5A1E10" {...S} strokeWidth={6} />;
    if (surprised) return <ellipse cx={392} cy={388} rx={14} ry={17} fill="#5A1E10" {...S} strokeWidth={6} />;
    if (happy) return (
      <g>
        <path d="M340 370 Q392 424 444 364 Z" fill="#5A1E10" {...S} strokeWidth={7} />
        <path d="M352 374 L432 370" stroke="#fff" strokeWidth={9} strokeLinecap="round" />
      </g>
    );
    if (angry) return <path d="M354 392 Q392 372 430 390" fill="none" {...S} strokeWidth={8} />;
    return <path d="M352 380 Q396 396 436 366" fill="none" {...S} strokeWidth={8} />; // sorriso de canto
  };

  const armTube = (d: string) => (
    <g>
      <path d={d} fill="none" stroke={INK} strokeWidth={54} strokeLinecap="round" />
      <path d={d} fill="none" stroke={FUR} strokeWidth={38} strokeLinecap="round" />
    </g>
  );

  const tail = "M372 850 C470 820 520 700 504 560 C492 450 470 330 520 230 C540 190 552 150 548 110";

  return (
    <svg width={size} height={(size * DUDA_BOX.h) / DUDA_BOX.w} viewBox={`${DUDA_BOX.x} ${DUDA_BOX.y} ${DUDA_BOX.w} ${DUDA_BOX.h}`}
      style={{ overflow: "visible", transform: `translateX(${shake}px)` }}>
      {/* cauda anelada em pé (atrás de tudo), mais alta que a cabeça */}
      <g transform={`rotate(${tailSway} 380 850)`}>
        <path d={tail} fill="none" stroke={INK} strokeWidth={80} strokeLinecap="round" />
        <path d={tail} fill="none" stroke={FUR} strokeWidth={62} strokeLinecap="round" />
        <path d={tail} fill="none" stroke={CREAM} strokeWidth={62} strokeDasharray="34 34" strokeDashoffset={-40} />
        <circle cx={548} cy={112} r={31} fill={MASK} />
      </g>

      <g transform={`translate(0 ${bob * 0.3})`}>
        {/* corpo em pera */}
        <path d="M140 950 C132 800 150 640 206 548 C236 500 330 496 360 548 C410 640 420 800 412 950 Z" fill={FUR} {...S} />
        <path d="M212 950 C204 820 220 680 276 600 C330 680 346 820 340 950 Z" fill={CREAM} />
        <path d="M150 950 C144 820 156 700 190 610 C184 740 190 860 200 950 Z" fill="#000" opacity={0.12} />
        {/* pochete rosa atravessada (estilo "turista chique") */}
        <path d="M206 560 L380 780" stroke={INK} strokeWidth={24} strokeLinecap="round" />
        <path d="M206 560 L380 780" stroke={PINK_DARK} strokeWidth={12} strokeLinecap="round" />
        <g transform="rotate(-18 300 700)">
          <rect x={236} y={654} width={140} height={84} rx={34} fill={PINK} {...S} strokeWidth={8} />
          <path d="M252 684 Q306 672 360 684" fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" />
          <circle cx={362} cy={684} r={8} fill={CREAM} {...S} strokeWidth={4} />
        </g>
        {/* braço direito na cintura */}
        {armTube("M364 572 C420 620 444 690 404 760")}
        <circle cx={398} cy={768} r={24} fill={FUR} {...S} strokeWidth={7} />
        {/* braço esquerdo em JOINHA ("relaxa, eu sou fluente") */}
        {armTube("M200 580 C140 640 120 720 150 730 C180 740 190 660 176 610")}
        <g transform={`translate(0 ${happy ? -6 : 0})`}>
          <rect x={146} y={560} width={54} height={50} rx={18} fill={FUR} {...S} strokeWidth={7} />
          <rect x={156} y={512} width={22} height={58} rx={11} fill={FUR} {...S} strokeWidth={7} />
        </g>

        {/* cabeça: crânio redondo + focinho comprido e empinado para a direita */}
        <circle cx={196} cy={192} r={34} fill={FUR_DARK} {...S} />
        <circle cx={196} cy={194} r={15} fill={CREAM} />
        <path d="M168 300 C168 214 224 176 288 176 C348 176 392 214 398 262 C440 280 480 300 496 322 C508 344 494 366 470 368 L400 372 C388 420 330 446 272 440 C206 432 168 384 168 300 Z"
          fill={FUR} {...S} />
        {/* máscara escura nos olhos e focinho escuro por cima */}
        <path d="M218 300 C220 262 256 250 300 256 C340 250 378 256 400 270 C446 286 478 302 490 324 C470 318 420 316 392 330 C356 342 300 336 270 330 C236 326 218 320 218 300 Z"
          fill={MASK} />
        {/* faixa creme sob o focinho e na bochecha */}
        <path d="M360 360 C396 348 440 344 470 352 C452 366 420 372 390 372 Z" fill={CREAM} />
        <path d="M206 340 C224 370 256 390 290 392 C258 404 220 390 206 340 Z" fill={CREAM} />
        {/* ponta do nariz empinada */}
        <ellipse cx={494} cy={324} rx={22} ry={17} fill={INK} transform="rotate(-24 494 324)" />
        <ellipse cx={488} cy={318} rx={7} ry={4} fill="#fff" opacity={0.5} />
        {/* orelha da frente */}
        <circle cx={330} cy={170} r={30} fill={FUR} {...S} />
        <circle cx={332} cy={172} r={13} fill={CREAM} />
        {/* óculos escuros na testa */}
        <path d="M216 214 Q282 196 350 206" fill="none" stroke={PINK} strokeWidth={10} strokeLinecap="round" />
        <path d="M216 214 Q282 196 350 206" fill="none" stroke={INK} strokeWidth={4} opacity={0.5} />
        <rect x={218} y={196} width={62} height={38} rx={16} fill={SHADES} {...S} strokeWidth={6} transform="rotate(-6 249 215)" />
        <rect x={292} y={190} width={58} height={36} rx={16} fill={SHADES} {...S} strokeWidth={6} transform="rotate(-2 321 208)" />
        <path d="M232 206 L250 202" stroke="#fff" strokeWidth={5} strokeLinecap="round" opacity={0.7} />
        {eye(264, 296, 21, false)}
        {eye(346, 290, 18, true)}
        {brows()}
        {mouth()}
        {angry && (
          <g transform={`translate(${420 + Math.sin(frame / 3) * 4} 180)`} fill="#fff" stroke={INK} strokeWidth={6} opacity={0.9}>
            <circle cx={0} cy={0} r={16} /><circle cx={22} cy={-18} r={11} /><circle cx={38} cy={-40} r={8} />
          </g>
        )}
        {happy && (
          <g stroke="#FFCC00" strokeWidth={8} strokeLinecap="round">
            <path d="M160 480 L140 462" /><path d="M176 468 L172 440" /><path d="M146 500 L118 496" />
          </g>
        )}
      </g>
    </svg>
  );
};
