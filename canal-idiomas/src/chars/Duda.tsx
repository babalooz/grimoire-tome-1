import React from "react";
import { CharProps, INK, S, isBlinking, mouthOpen } from "./common";
import { Blush, Brow, Eye, Mouth, Sweat } from "./face";

// Duda — PANDA-VERMELHO (Ailurus), colega de quarto e melhor amiga da Capy. Confiante e errada:
// falsos cognatos com convicção total ("I'm very constipated" = resfriada). Jura ser prima do Hank ("somos os dois panda!").
// Silhueta a 64 px: CAUDA ANELADA ENORME em S ao lado do corpo (tão alta quanto ela) + orelhas triangulares + joinha erguido.
// Paleta: ferrugem #D2542A, anéis caramelo #F0A45C, máscara branca #FFF6EA, patas café #4A2419, camiseta creme, pochete rosa.
// As manchas brancas acima dos olhos SÃO as sobrancelhas (mexem com a emoção).
const FUR = "#D2542A";
const FUR_DARK = "#A83C1A";
const RING = "#F0A45C";
const MARK = "#FFF6EA";
const TEAR = "#8E3514";
const LIMB = "#4A2419";
const TEE = "#FFF4E0";
const TEE_SHADE = "#EAD9BD";
const PINK = "#FF4F9A";
const PINK_DARK = "#D12E7A";
const SHADES = "#1A1A1A";
const GOLD = "#FFCC00";

export const DUDA_BOX = { x: 40, y: 40, w: 640, h: 900 };

export const Duda: React.FC<CharProps> = ({ frame, talking, emotion, size = 400, seed = "duda" }) => {
  const blink = isBlinking(frame, seed, 78);
  const open = mouthOpen(frame, talking, 2.0); // fala rápido
  const happy = emotion === "happy" || emotion === "smile";
  const surprised = emotion === "surprised" || emotion === "panic";
  const angry = emotion === "angry";
  const wag = Math.sin(frame / (happy ? 5 : 14)) * (happy ? 4 : 1.5);
  const tailW = surprised ? 140 : 122; // cauda arrepia no susto
  const bob = talking ? Math.abs(Math.sin(frame / 4)) * -4 : 0;
  const shake = emotion === "panic" ? Math.sin(frame * 2.2) * 3 : angry ? Math.sin(frame * 1.8) * 2 : 0;

  const TAIL = "M372 800 C520 812 606 730 598 600 C590 470 500 420 520 300 C534 216 604 180 636 226";
  const limb = (d: string, w = 46) => (
    <g>
      <path d={d} fill="none" stroke={INK} strokeWidth={w + 16} strokeLinecap="round" />
      <path d={d} fill="none" stroke={LIMB} strokeWidth={w} strokeLinecap="round" />
    </g>
  );
  const sleeve = (d: string) => (
    <g>
      <path d={d} fill="none" stroke={INK} strokeWidth={76} strokeLinecap="round" />
      <path d={d} fill="none" stroke={TEE} strokeWidth={60} strokeLinecap="round" />
    </g>
  );

  // mão erguida: joinha (padrão), punho (raiva) ou aberta (susto)
  const raisedHand = () => {
    const cx = 116, cy = 470;
    if (surprised) return (
      <g>
        {[-26, -9, 9, 26].map((dx) => <path key={dx} d={`M${cx + dx * 0.6} ${cy} L${cx + dx} ${cy - 42}`} stroke={INK} strokeWidth={24} strokeLinecap="round" />)}
        {[-26, -9, 9, 26].map((dx) => <path key={`f${dx}`} d={`M${cx + dx * 0.6} ${cy} L${cx + dx} ${cy - 42}`} stroke={LIMB} strokeWidth={12} strokeLinecap="round" />)}
        <circle cx={cx} cy={cy} r={30} fill={LIMB} {...S} strokeWidth={7} />
      </g>
    );
    return (
      <g>
        <rect x={cx - 30} y={cy - 26} width={60} height={56} rx={22} fill={LIMB} {...S} strokeWidth={7} />
        {!angry && (
          <g>
            <path d={`M${cx - 6} ${cy - 22} L${cx - 8} ${cy - 66}`} stroke={INK} strokeWidth={34} strokeLinecap="round" />
            <path d={`M${cx - 6} ${cy - 22} L${cx - 8} ${cy - 66}`} stroke={LIMB} strokeWidth={20} strokeLinecap="round" />
          </g>
        )}
        <path d={`M${cx + 30} ${cy - 6} L${cx - 4} ${cy - 6} M${cx + 30} ${cy + 12} L${cx - 4} ${cy + 12}`} stroke="#7A4030" strokeWidth={5} strokeLinecap="round" />
      </g>
    );
  };

  return (
    <svg width={size} height={(size * DUDA_BOX.h) / DUDA_BOX.w} viewBox={`${DUDA_BOX.x} ${DUDA_BOX.y} ${DUDA_BOX.w} ${DUDA_BOX.h}`}
      style={{ overflow: "visible", transform: `translateX(${shake}px)` }}>
      {/* cauda anelada em S, atrás do corpo */}
      <g transform={`rotate(${wag} 372 800)`}>
        <path d={TAIL} fill="none" stroke={INK} strokeWidth={tailW + 18} strokeLinecap="round" />
        <path d={TAIL} fill="none" stroke={FUR} strokeWidth={tailW} strokeLinecap="round" />
        <path d={TAIL} fill="none" stroke={RING} strokeWidth={tailW} strokeDasharray="40 46" strokeDashoffset={-30} />
        {angry && [0, 1, 2].map((i) => (
          <path key={i} d={`M${560 + i * 26} ${250 + i * 70} l30 -14`} stroke={INK} strokeWidth={8} strokeLinecap="round" />
        ))}
      </g>

      <g transform={`translate(0 ${bob})`}>
        {/* pernas curtas escuras */}
        {limb("M236 820 L232 890", 52)}
        {limb("M340 820 L346 890", 52)}
        <ellipse cx={224} cy={904} rx={40} ry={20} fill={LIMB} {...S} strokeWidth={7} />
        <ellipse cx={356} cy={904} rx={40} ry={20} fill={LIMB} {...S} strokeWidth={7} />

        {/* tronco: camiseta creme sobre barriga ferrugem */}
        <path d="M196 590 C172 690 178 780 196 836 L388 836 C404 780 410 690 386 590 C350 566 232 566 196 590 Z" fill={FUR} {...S} />
        <path d="M196 590 C178 660 178 720 186 772 L398 772 C404 720 404 660 386 590 C350 566 232 566 196 590 Z" fill={TEE} {...S} strokeWidth={8} />
        <path d="M200 740 L396 740 L398 772 L186 772 Z" fill={TEE_SHADE} />
        {/* pochete rosa atravessada no peito */}
        <path d="M214 604 L372 740" stroke={INK} strokeWidth={24} strokeLinecap="round" />
        <path d="M214 604 L372 740" stroke={PINK_DARK} strokeWidth={11} strokeLinecap="round" />
        <rect x={322} y={700} width={92} height={60} rx={24} fill={PINK} {...S} strokeWidth={7} transform="rotate(-18 368 730)" />
        <path d="M336 720 L398 700" stroke={GOLD} strokeWidth={6} strokeLinecap="round" />

        {/* braço na cintura */}
        {limb("M390 624 C452 656 456 716 404 744", 44)}
        {sleeve("M384 612 L404 634")}
        {/* braço erguido com joinha */}
        {limb("M196 626 C150 634 116 580 116 500", 44)}
        {sleeve("M200 614 L180 628")}
        {raisedHand()}

        {/* orelhas triangulares com borda branca */}
        <path d="M156 380 L140 250 Q146 216 178 228 L262 300 Z" fill={FUR} {...S} />
        <path d="M168 330 L160 262 Q164 246 180 252 L230 296" fill="none" stroke={MARK} strokeWidth={14} strokeLinecap="round" />
        <path d="M424 380 L440 250 Q434 216 402 228 L318 300 Z" fill={FUR} {...S} />
        <path d="M412 330 L420 262 Q416 246 400 252 L350 296" fill="none" stroke={MARK} strokeWidth={14} strokeLinecap="round" />

        {/* cabeça larga com tufos nas bochechas */}
        <path d="M120 450 C118 340 196 284 290 284 C384 284 462 340 460 450 C460 486 452 512 476 536 Q444 544 440 560 Q414 596 360 604 Q330 616 290 612 Q250 616 220 604 Q166 596 140 560 Q136 544 104 536 C128 512 120 486 120 450 Z"
          fill={FUR} {...S} />
        {/* máscara branca: bochechas + focinho */}
        <path d="M138 486 C150 450 200 450 226 478 C246 500 250 540 290 540 C330 540 334 500 354 478 C380 450 430 450 442 486 C450 522 420 566 380 580 Q340 598 290 596 Q240 598 200 580 C160 566 130 522 138 486 Z" fill={MARK} />
        {/* lágrimas ferrugem escuras */}
        <path d="M244 468 C238 496 248 520 262 536" fill="none" stroke={TEAR} strokeWidth={12} strokeLinecap="round" />
        <path d="M336 468 C342 496 332 520 318 536" fill="none" stroke={TEAR} strokeWidth={12} strokeLinecap="round" />
        {/* óculos escuros na testa (ela "mora na Flórida" mentalmente) */}
        <g>
          <path d="M244 318 L336 318" stroke={GOLD} strokeWidth={7} />
          <rect x={196} y={300} width={78} height={44} rx={18} fill={SHADES} {...S} strokeWidth={6} />
          <rect x={306} y={300} width={78} height={44} rx={18} fill={SHADES} {...S} strokeWidth={6} />
          <path d="M210 312 L232 312 M320 312 L342 312" stroke="#fff" strokeWidth={5} strokeLinecap="round" opacity={0.7} />
        </g>
        <Eye cx={236} cy={430} r={25} emotion={emotion} blink={blink} side={-1} lidColor={FUR} baseLid={0.14} look={[3, 1]} />
        <Eye cx={344} cy={430} r={25} emotion={emotion} blink={blink} side={1} lidColor={FUR} baseLid={0.14} look={[3, 1]} />
        <Brow cx={232} cy={384} w={48} emotion={emotion} side={-1} color={MARK} sw={22} />
        <Brow cx={348} cy={384} w={48} emotion={emotion} side={1} color={MARK} sw={22} />
        <path d="M272 480 Q290 472 308 480 Q304 498 290 502 Q276 498 272 480 Z" fill={INK} />
        <Mouth cx={290} cy={talking ? 536 : 530} w={72} emotion={emotion === "neutral" ? "smile" : emotion} talking={talking} open={open} frame={frame} />
        {(happy || emotion === "eyebrow") && (
          <g><Blush x={176} y={522} /><Blush x={404} y={522} /></g>
        )}
        {emotion === "panic" && <Sweat x={452} y={380} frame={frame} />}
      </g>
    </svg>
  );
};
