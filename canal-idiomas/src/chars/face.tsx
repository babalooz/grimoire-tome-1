import React from "react";
import { Emotion, INK, S } from "./common";

// Peças de rosto compartilhadas pelo elenco novo (Hank panda, Duda, Poppy, Bolinha).
// Mesma linguagem da Capy/Lazy: branco do olho com contorno INK, pupila com brilho, pálpebra da cor do pelo.
// Pálpebra desenhada como segmento de elipse (sem clipPath → sem colisão de id com vários personagens na tela).

export const MOUTH_DARK = "#5A2E1A";
const TONGUE = "#FF7A8A";

type Side = -1 | 1; // -1 = olho à esquerda do espectador, 1 = à direita

export const Eye: React.FC<{
  cx: number; cy: number; r: number; emotion: Emotion; blink: boolean; side: Side;
  lidColor: string; baseLid?: number; ratio?: number; look?: [number, number];
  lineColor?: string; pupil?: number; sw?: number;
}> = ({ cx, cy, r, emotion: e, blink, side, lidColor, baseLid = 0, ratio = 0.92, look = [0, 0], lineColor = INK, pupil = 0.44, sw = 6 }) => {
  const w = r * 1.05;
  const line = { fill: "none", stroke: lineColor, strokeLinecap: "round" as const, strokeWidth: sw + 3 };
  if (e === "happy") return <path d={`M${cx - w} ${cy + r * 0.35} Q${cx} ${cy - r * 0.95} ${cx + w} ${cy + r * 0.35}`} {...line} />;
  if (e === "zen" || blink) return <path d={`M${cx - w} ${cy} Q${cx} ${cy + r * 0.6} ${cx + w} ${cy}`} {...line} />;
  const wide = e === "surprised" || e === "panic";
  const big = wide ? 1.22 : e === "eyebrow" && side === 1 ? 1.12 : 1;
  const rx = r * big, ry = r * ratio * big;
  const lid =
    e === "bored" ? Math.max(0.5, baseLid) :
    e === "angry" ? 0.34 :
    e === "whisper" ? 0.4 :
    e === "eyebrow" ? (side === 1 ? 0 : 0.45) :
    wide ? 0 :
    e === "smile" ? Math.min(baseLid, 0.2) : baseLid;
  const lk: [number, number] =
    e === "whisper" ? [r * 0.38 * (look[0] >= 0 ? 1 : -1), r * 0.12] :
    e === "bored" ? [look[0], look[1] + r * 0.14] : look;
  const pr = r * pupil * (wide ? 0.62 : 1);
  const px = cx + lk[0], py = cy + lk[1];
  let lidEl: React.ReactNode = null;
  if (lid > 0) {
    const y0 = cy - ry + 2 * ry * lid;
    const d = (y0 - cy) / ry;
    const hx = rx * Math.sqrt(Math.max(0, 1 - d * d));
    lidEl = (
      <g>
        <path d={`M${cx - hx} ${y0} A${rx} ${ry} 0 ${lid > 0.5 ? 1 : 0} 1 ${cx + hx} ${y0} Z`} fill={lidColor} />
        <line x1={cx - hx - 1} y1={y0} x2={cx + hx + 1} y2={y0} stroke={INK} strokeWidth={sw + 1} strokeLinecap="round" />
      </g>
    );
  }
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#fff" stroke={INK} strokeWidth={sw} />
      <circle cx={px} cy={py} r={pr} fill={INK} />
      <circle cx={px - pr * 0.35} cy={py - pr * 0.4} r={pr * 0.32} fill="#fff" />
      {lidEl}
    </g>
  );
};

// Sobrancelha: ponta interna (perto do nariz) e externa se movem por emoção. grump > 0 = cenho franzido fixo.
export const Brow: React.FC<{ cx: number; cy: number; w: number; emotion: Emotion; side: Side; color?: string; sw?: number; grump?: number }> = ({
  cx, cy, w, emotion: e, side, color = INK, sw = 12, grump = 0,
}) => {
  const T: Record<Emotion, [number, number, number]> = {
    // [interna, externa, arco]
    neutral: [0, 0, -6], angry: [16, -8, 0], panic: [-16, 4, -4], surprised: [-20, -16, -14],
    eyebrow: side === 1 ? [-18, -24, -12] : [8, 6, 0], bored: [6, 6, 0], happy: [-6, -2, -10], smile: [-4, 0, -8],
    zen: [2, 2, -6], whisper: [-8, 0, -4],
  };
  let [yi, yo, arch] = T[e];
  if (e !== "surprised" && e !== "panic" && e !== "happy") yi += grump;
  const xi = cx - side * (w / 2), xo = cx + side * (w / 2);
  return <path d={`M${xo} ${cy + yo} Q${cx} ${cy + (yi + yo) / 2 + arch} ${xi} ${cy + yi}`} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" />;
};

// Boca por emoção. Falando → elipse com língua (visema simples por abertura).
export const Mouth: React.FC<{ cx: number; cy: number; w: number; emotion: Emotion; talking: boolean; open: number; sw?: number; grump?: boolean; frame?: number }> = ({
  cx, cy, w, emotion: e, talking, open, sw = 6, grump = false, frame = 0,
}) => {
  const ln = { fill: "none", ...S, strokeWidth: sw + 1 };
  if (talking) {
    const soft = e === "whisper" ? 0.55 : 1;
    const rx = w * 0.42 * soft, ry = (3 + open * w * 0.34) * soft;
    return (
      <g>
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={MOUTH_DARK} {...S} strokeWidth={sw} />
        {ry > 9 && <ellipse cx={cx} cy={cy + ry * 0.45} rx={rx * 0.55} ry={ry * 0.32} fill={TONGUE} />}
      </g>
    );
  }
  switch (e) {
    case "surprised": return <ellipse cx={cx} cy={cy + 4} rx={w * 0.2} ry={w * 0.25} fill={MOUTH_DARK} {...S} strokeWidth={sw} />;
    case "panic": {
      const j = Math.sin(frame * 1.3) * 2;
      return <path d={`M${cx - w * 0.45} ${cy + j} q${w * 0.15} -${w * 0.14} ${w * 0.3} 0 t${w * 0.3} 0 t${w * 0.3} 0`} {...ln} />;
    }
    case "happy": return (
      <g>
        <path d={`M${cx - w / 2} ${cy - 4} Q${cx} ${cy + w * 0.75} ${cx + w / 2} ${cy - 4} Z`} fill={MOUTH_DARK} {...S} strokeWidth={sw} />
        <ellipse cx={cx} cy={cy + w * 0.24} rx={w * 0.2} ry={w * 0.09} fill={TONGUE} />
      </g>
    );
    case "smile": return <path d={`M${cx - w / 2} ${cy - 2} Q${cx} ${cy + w * 0.42} ${cx + w / 2} ${cy - 2}`} {...ln} />;
    case "angry": return <path d={`M${cx - w * 0.42} ${cy + w * 0.14} Q${cx} ${cy - w * 0.22} ${cx + w * 0.42} ${cy + w * 0.14}`} {...ln} />;
    case "bored": return <path d={`M${cx - w * 0.36} ${cy + 3} L${cx + w * 0.36} ${cy - 3}`} {...ln} />;
    case "eyebrow": return <path d={`M${cx - w * 0.4} ${cy + 3} Q${cx} ${cy + 8} ${cx + w * 0.45} ${cy - w * 0.16}`} {...ln} />;
    case "whisper": return <ellipse cx={cx} cy={cy + 2} rx={w * 0.1} ry={w * 0.08} fill={MOUTH_DARK} {...S} strokeWidth={sw - 1} />;
    case "zen": return <path d={`M${cx - w * 0.3} ${cy} Q${cx} ${cy + w * 0.2} ${cx + w * 0.3} ${cy}`} {...ln} />;
    default:
      return grump
        ? <path d={`M${cx - w * 0.38} ${cy + 4} Q${cx} ${cy - 6} ${cx + w * 0.38} ${cy + 4}`} {...ln} />
        : <path d={`M${cx - w * 0.36} ${cy} Q${cx} ${cy + w * 0.2} ${cx + w * 0.36} ${cy}`} {...ln} />;
  }
};

// Gotas de suor (pânico).
export const Sweat: React.FC<{ x: number; y: number; frame: number; n?: number; s?: number }> = ({ x, y, frame, n = 2, s = 1 }) => (
  <g>
    {Array.from({ length: n }, (_, i) => (
      <path key={i} d="M0 0 Q18 30 0 44 Q-18 30 0 0" fill="#7FD3FF" {...S} strokeWidth={5}
        transform={`translate(${x + i * 34 * s} ${y + i * 26 * s + Math.sin(frame / 5 + i) * 5}) scale(${s})`} />
    ))}
  </g>
);

// Rubor (feliz/sussurro).
export const Blush: React.FC<{ x: number; y: number; rx?: number; ry?: number; color?: string }> = ({ x, y, rx = 22, ry = 12, color = "#FF8FB1" }) => (
  <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={color} opacity={0.55} />
);
