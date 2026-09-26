import React from "react";
import { CharProps, INK, S, isBlinking, mouthOpen } from "./common";
import { Brow, Eye, Mouth, Sweat } from "./face";

// Bolinha — HAMSTER-sírio, o "arquivista" da turma: guarda as frases dos episódios nas bochechas e devolve dias depois
// (é o quadro de revisão espaçada). Metódico, fala pouco e certeiro. Lápis atrás da orelha, pilha de fichas nas mãos.
// Silhueta a 64 px: BOLA sem pescoço com orelhinhas + BOCHECHAS que incham para os lados (prop `cheeks` 0..1) + fichas.
// Paleta: dourado #E9A24A, creme #FFF1DC, patas rosadas #F7A8A0, fichas brancas com pauta azul, lápis amarelo.
const FUR = "#E9A24A";
const FUR_DARK = "#C9812E";
const CREAM = "#FFF1DC";
const PAW = "#F7A8A0";
const EAR_IN = "#F7A8A0";
const CARD = "#FFFFFF";
const RULE = "#6FA8FF";
const PENCIL = "#FFCC00";

export const BOLINHA_BOX = { x: 60, y: 170, w: 480, h: 520 };

export const Bolinha: React.FC<CharProps & { cheeks?: number }> = ({ frame, talking, emotion, size = 300, seed = "bolinha", cheeks = 0.25 }) => {
  const blink = isBlinking(frame, seed, 64);
  const c = Math.max(0, Math.min(1, cheeks));
  // de boca cheia a fala sai abafada (abre menos)
  const open = mouthOpen(frame, talking, 1.9) * (1 - c * 0.5);
  const sniff = Math.sin(frame / 3) * (talking ? 0 : 1.5); // focinho farejando
  const breathe = 1 + Math.sin(frame / 12) * 0.012;
  const shake = emotion === "panic" ? Math.sin(frame * 2.6) * 3 : 0;
  const hop = emotion === "happy" ? Math.abs(Math.sin(frame / 5)) * -10 : 0;

  // bochechas: crescem para os lados e um pouco para baixo
  const crx = 44 + c * 70, cry = 50 + c * 34, cdx = 30 + c * 44, cdy = 450 + c * 10;

  return (
    <svg width={size} height={(size * BOLINHA_BOX.h) / BOLINHA_BOX.w} viewBox={`${BOLINHA_BOX.x} ${BOLINHA_BOX.y} ${BOLINHA_BOX.w} ${BOLINHA_BOX.h}`}
      style={{ overflow: "visible", transform: `translate(${shake}px, ${hop}px)` }}>
      <g transform={`translate(300 660) scale(${breathe} ${1 / breathe}) translate(-300 -660)`}>
        {/* pezinhos */}
        <ellipse cx={240} cy={664} rx={38} ry={20} fill={PAW} {...S} strokeWidth={7} />
        <ellipse cx={360} cy={664} rx={38} ry={20} fill={PAW} {...S} strokeWidth={7} />

        {/* orelhas */}
        <circle cx={206} cy={262} r={38} fill={FUR} {...S} />
        <circle cx={208} cy={266} r={20} fill={EAR_IN} />
        <circle cx={394} cy={262} r={38} fill={FUR} {...S} />
        <circle cx={392} cy={266} r={20} fill={EAR_IN} />
        {/* lápis atrás da orelha direita */}
        <g transform="rotate(-38 420 250)">
          <rect x={360} y={236} width={130} height={26} rx={6} fill={PENCIL} {...S} strokeWidth={6} />
          <path d="M490 236 L520 249 L490 262 Z" fill={CREAM} {...S} strokeWidth={6} />
          <path d="M508 244 L520 249 L508 254 Z" fill={INK} />
          <rect x={346} y={236} width={18} height={26} rx={5} fill="#FF8FB1" {...S} strokeWidth={6} />
        </g>

        {/* bochechas (atrás do contorno do corpo → viram parte da silhueta) */}
        <ellipse cx={300 - 120 - cdx} cy={cdy} rx={crx} ry={cry} fill={CREAM} {...S} />
        <ellipse cx={300 + 120 + cdx} cy={cdy} rx={crx} ry={cry} fill={CREAM} {...S} />

        {/* corpo-bola sem pescoço */}
        <path d="M160 480 C150 336 214 250 300 250 C386 250 450 336 440 480 C450 590 404 660 300 660 C196 660 150 590 160 480 Z" fill={FUR} {...S} />
        <path d="M172 520 C180 600 220 644 268 652 C214 650 170 610 172 520 Z" fill={FUR_DARK} opacity={0.55} />
        {/* máscara creme (focinho + bochechas internas) e barriga */}
        <path d="M178 440 C196 400 250 404 300 404 C350 404 404 400 422 440 C440 520 410 640 300 646 C190 640 160 520 178 440 Z" fill={CREAM} />
        {/* listra dourada da testa */}
        <path d="M284 262 Q300 300 316 262" fill="none" stroke={FUR_DARK} strokeWidth={10} strokeLinecap="round" />
        {/* marcas de esforço quando lotado */}
        {c > 0.55 && (
          <g fill="none" stroke={FUR_DARK} strokeWidth={6} strokeLinecap="round">
            <path d={`M${300 - 120 - cdx - 20} ${cdy - 22} q10 -8 20 0`} />
            <path d={`M${300 + 120 + cdx} ${cdy - 22} q10 -8 20 0`} />
          </g>
        )}

        <Eye cx={246} cy={378} r={21} emotion={emotion} blink={blink} side={-1} lidColor={FUR} baseLid={0.08} ratio={1} pupil={0.56} />
        <Eye cx={354} cy={378} r={21} emotion={emotion} blink={blink} side={1} lidColor={FUR} baseLid={0.08} ratio={1} pupil={0.56} />
        <Brow cx={244} cy={336} w={36} emotion={emotion} side={-1} sw={8} />
        <Brow cx={356} cy={336} w={36} emotion={emotion} side={1} sw={8} />

        {/* focinho farejando + bigodes */}
        <g transform={`translate(0 ${sniff})`}>
          <path d="M288 412 L312 412 L300 426 Z" fill="#E86F86" {...S} strokeWidth={5} />
          <g stroke={INK} strokeWidth={4} strokeLinecap="round" opacity={0.75}>
            <path d="M258 424 L206 414 M258 434 L208 440" />
            <path d="M342 424 L394 414 M342 434 L392 440" />
          </g>
        </g>
        {!talking && emotion !== "surprised" && emotion !== "happy" && emotion !== "panic" && (
          <g>
            <path d="M300 426 L300 440" stroke={INK} strokeWidth={5} strokeLinecap="round" />
            <rect x={291} y={441} width={18} height={14} rx={3} fill="#fff" {...S} strokeWidth={4} />
          </g>
        )}
        <Mouth cx={300} cy={talking ? 452 : 446} w={50} emotion={emotion} talking={talking} open={open} sw={5} frame={frame} />
        {/* ficha saindo da boca quando as bochechas estão lotadas */}
        {c > 0.6 && !talking && (
          <g transform="rotate(14 334 450)">
            <rect x={318} y={436} width={48} height={30} rx={3} fill={CARD} {...S} strokeWidth={5} />
            <path d="M326 448 L358 448 M326 457 L350 457" stroke={RULE} strokeWidth={3} />
          </g>
        )}

        {/* patinhas segurando a pilha de fichas */}
        <g transform="rotate(-6 300 560)">
          <rect x={236} y={516} width={132} height={86} rx={6} fill={CARD} {...S} strokeWidth={6} transform="rotate(8 300 560)" />
          <rect x={232} y={512} width={136} height={88} rx={6} fill={CARD} {...S} strokeWidth={6} />
          <path d="M246 530 L354 530" stroke="#FF4D5E" strokeWidth={4} />
          {[550, 566, 582].map((y) => <path key={y} d={`M246 ${y} L354 ${y}`} stroke={RULE} strokeWidth={3} />)}
        </g>
        <circle cx={232} cy={560} r={22} fill={PAW} {...S} strokeWidth={6} />
        <circle cx={368} cy={560} r={22} fill={PAW} {...S} strokeWidth={6} />
        {emotion === "panic" && <Sweat x={430} y={300} frame={frame} s={0.8} />}
      </g>
    </svg>
  );
};
