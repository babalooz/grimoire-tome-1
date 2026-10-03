import React from "react";
import { CharProps, INK, S, isBlinking, mouthOpen } from "./common";
import { Brow, Eye, Mouth } from "./face";

// Turista — FIGURANTE genérico (reserva atemporal do assunto 1, docs/roteiros/roteiros-tema01.md V2).
// Nunca entra no elenco fixo (decisão em aberto no roteiro: "silhueta simples ou bicho genérico"). Por isso o desenho
// é deliberadamente simples e neutro: silhueta cinza/creme sem espécie definida, boné + câmera de turista, sem cauda/orelha
// de bicho e sem paleta de nenhum personagem do elenco (evita parecer um 7º personagem fixo).
const SKIN = "#D9CBB8";
const SKIN_SHADE = "#C4B49C";
const SHIRT = "#8FA9C4";
const CAP = "#E0574A";
const STRAP = "#3A2213";
const CAM = "#2A2A2A";

export const TURISTA_BOX = { x: 20, y: 40, w: 600, h: 860 };

export const Turista: React.FC<CharProps> = ({ frame, talking, emotion, size = 400, seed = "turista" }) => {
  const blink = isBlinking(frame, seed, 90);
  const open = mouthOpen(frame, talking, 2.3);
  const bob = talking ? Math.abs(Math.sin(frame / 4)) * -3 : 0;

  return (
    <svg width={size} height={(size * TURISTA_BOX.h) / TURISTA_BOX.w} viewBox={`${TURISTA_BOX.x} ${TURISTA_BOX.y} ${TURISTA_BOX.w} ${TURISTA_BOX.h}`}
      style={{ overflow: "visible" }}>
      <g transform={`translate(0 ${bob})`}>
        {/* corpo: camisa simples, sem detalhe de marca */}
        <path d="M180 560 C164 660 170 760 186 820 L454 820 C470 760 476 660 460 560 C420 530 220 530 180 560 Z" fill={SHIRT} {...S} />
        <path d="M180 560 L460 560 L452 600 L188 600 Z" fill="#fff" opacity={0.18} />
        {/* câmera no peito (turista clássico) */}
        <path d="M232 620 L410 700" stroke={INK} strokeWidth={22} strokeLinecap="round" />
        <path d="M232 620 L410 700" stroke={STRAP} strokeWidth={11} strokeLinecap="round" />
        <rect x={352} y={660} width={96} height={68} rx={10} fill={CAM} {...S} strokeWidth={7} />
        <circle cx={400} cy={694} r={24} fill="#111" stroke="#666" strokeWidth={4} />
        {/* braços parados ao lado do corpo (figurante simples) */}
        <path d="M188 584 C140 610 126 660 140 712" fill="none" stroke={INK} strokeWidth={60} strokeLinecap="round" />
        <path d="M188 584 C140 610 126 660 140 712" fill="none" stroke={SHIRT} strokeWidth={46} strokeLinecap="round" />
        <path d="M452 584 C500 610 514 660 500 712" fill="none" stroke={INK} strokeWidth={60} strokeLinecap="round" />
        <path d="M452 584 C500 610 514 660 500 712" fill="none" stroke={SHIRT} strokeWidth={46} strokeLinecap="round" />
        <circle cx={140} cy={722} r={26} fill={SKIN} {...S} strokeWidth={7} />
        <circle cx={500} cy={722} r={26} fill={SKIN} {...S} strokeWidth={7} />

        {/* cabeça redonda, neutra */}
        <circle cx={320} cy={370} r={164} fill={SKIN} {...S} />
        <path d="M156 370 A164 164 0 0 1 484 370 Q484 300 320 280 Q156 300 156 370 Z" fill={SKIN_SHADE} opacity={0.5} />
        <Eye cx={264} cy={368} r={23} emotion={emotion} blink={blink} side={-1} lidColor={SKIN} baseLid={0.1} />
        <Eye cx={376} cy={368} r={23} emotion={emotion} blink={blink} side={1} lidColor={SKIN} baseLid={0.1} />
        <Brow cx={260} cy={322} w={44} emotion={emotion} side={-1} />
        <Brow cx={380} cy={322} w={44} emotion={emotion} side={1} />
        <Mouth cx={320} cy={talking ? 448 : 442} w={64} emotion={emotion === "neutral" ? "smile" : emotion} talking={talking} open={open} frame={frame} />

        {/* boné genérico (sem logo) */}
        <path d="M168 300 Q320 160 472 300 Q472 240 320 212 Q168 240 168 300 Z" fill={CAP} {...S} />
        <path d="M168 300 Q230 330 130 338 L140 300 Z" fill={CAP} {...S} strokeWidth={7} />
      </g>
    </svg>
  );
};
