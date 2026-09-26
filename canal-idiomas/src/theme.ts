import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Tokens de cor (diretor de arte, conselho 26/09). Certo = turquesa, nunca verde-limão (regra anti-Duolingo).
export const C = {
  noite: "#1E0F4D",
  roxo: "#3D1F8F",
  lilas: "#8C6CFF",
  amarelo: "#FFCC00",
  tangerina: "#FF8A1F",
  creme: "#FFF4E0",
  tinta: "#1A0B45",
  certo: "#16C79A",
  errado: "#FF4D5E",
};

// Cor de fundo por quadro: reconhecimento de série no feed e variedade contra "template repetitivo".
export const BG_BY_FORMAT: Record<string, string> = {
  nivel: C.roxo,
  "desafio-niveis": C.roxo,
  "voce-sabia": "#0F4C75",
  "capi-errou": "#7A1F2B",
  "br-vs-nativo": "#5A2A8F",
  hype: "#111111",
  pegadinha: "#5B45C9",
};

// Fontes locais em public/fonts (render não depende de rede).
export const TITLE = "Lilita One";
export const BODY = "Rubik";
loadFont({ family: TITLE, url: staticFile("fonts/LilitaOne.woff2") });
loadFont({ family: BODY, url: staticFile("fonts/Rubik-800.woff2"), weight: "800" });

// Zona segura 1080x1920: fora disso a interface do TikTok/Shorts/Reels cobre o conteúdo.
export const SAFE = { x0: 60, x1: 940, y0: 200, y1: 1436 };

// Contorno grosso + sombra dura: lê em cima de qualquer fundo.
export const outline = (px = 10) => ({
  WebkitTextStroke: `${px}px ${C.tinta}`,
  paintOrder: "stroke fill" as const,
  textShadow: `0 8px 0 ${C.tinta}`,
});
