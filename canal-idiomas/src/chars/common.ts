import { random } from "remotion";

// Traço comum do elenco (mesmo da Capy v2): contorno grosso marrom-tinta, pontas redondas.
export const INK = "#3A2213";
export const S = { stroke: INK, strokeWidth: 9, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

// Emoções do motor de sitcom. Cada personagem traduz para o seu rosto.
export type Emotion = "neutral" | "zen" | "bored" | "angry" | "eyebrow" | "surprised" | "panic" | "happy" | "smile" | "whisper";

export type CharProps = {
  frame: number;
  talking: boolean;
  emotion: Emotion;
  size?: number;
  seed?: string;
};

// Piscar com semente, intervalo irregular, nunca nos 30 primeiros frames (frame 0 = capa).
export const isBlinking = (frame: number, seed: string, period = 84) => {
  if (frame < 30) return false;
  const cycle = Math.floor(frame / period);
  const at = Math.floor(random(`${seed}-${cycle}`) * (period - 20)) + 8;
  const f = frame % period;
  return f >= at && f < at + 4;
};

// Abertura da boca 0..1 enquanto fala (ritmo de sílaba, não senoide pura).
export const mouthOpen = (frame: number, talking: boolean, speed = 2.1) =>
  talking ? 0.3 + Math.abs(Math.sin(frame / speed) * Math.cos(frame / (speed * 2.7))) * 0.7 : 0;
