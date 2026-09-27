import React from "react";
import { Composition, registerRoot } from "remotion";
import { Episode, EpisodeProps, sceneFrames } from "./Episode";
import { CapiSheet } from "./CapiSheet";
import { Avatar, Banner } from "./Brand";
import { CastSheet } from "./CastSheet";
import { Sitcom, SitcomProps, sitcomFrames } from "./Sitcom";
import { Licao, LicaoProps, licaoFrames } from "./Licao";
import { LicaoEsquete, LicaoEsqueteProps, licaoEsqueteFrames } from "./LicaoEsquete";
import { Cafe, CafeProps, cafeFrames } from "./Cafe";
import { CafeEsquete, CafeEsqueteProps, cafeEsqueteFrames } from "./CafeEsquete";

// Ponte para o portão (scripts/portao.py renderiza o modo auditoria pelas composições "Licao"/"LicaoEsquete"):
// props com `format: "cafe"` nessas composições vão para Cafe/CafeEsquete. Lições antigas seguem iguais.
const isCafe = (p: any) => p?.format === "cafe";
const LicaoOuCafe: React.FC<any> = (p) => React.createElement((isCafe(p) ? Cafe : Licao) as React.FC<any>, p);
const LicaoEsqueteOuCafe: React.FC<any> = (p) => React.createElement((isCafe(p) ? CafeEsquete : LicaoEsquete) as React.FC<any>, p);

const FPS = 30;

const Root: React.FC = () =>
  React.createElement(React.Fragment, null,
  React.createElement(Composition, { id: "Avatar", component: Avatar, fps: FPS, width: 800, height: 800, durationInFrames: 1 }),
  React.createElement(Composition, { id: "Banner", component: Banner, fps: FPS, width: 2560, height: 1440, durationInFrames: 1 }),
  React.createElement(Composition, { id: "CapiSheet", component: CapiSheet, fps: FPS, width: 1080, height: 1150, durationInFrames: 1 }),
  React.createElement(Composition, { id: "CastSheet", component: CastSheet, fps: FPS, width: 2560, height: 1800, durationInFrames: 60 }),
  React.createElement(Composition<any, EpisodeProps>, {
    id: "Episode",
    component: Episode,
    fps: FPS,
    width: 1080,
    height: 1920,
    durationInFrames: 1,
    defaultProps: { format: "nivel", scenes: [], timings: [] },
    calculateMetadata: ({ props }) => ({
      durationInFrames: Math.max(
        1,
        props.scenes.reduce((sum, s, i) => sum + sceneFrames(s, props.timings[i], FPS), 0),
      ),
    }),
  }),
  // "Capy no Exterior" (sitcom em micro-episódios). Props = episódio com `beats` + timings do TTS (scripts/make-sitcom.sh).
  React.createElement(Composition<any, SitcomProps>, {
    id: "Sitcom",
    component: Sitcom,
    fps: FPS,
    width: 1080,
    height: 1920,
    durationInFrames: 1,
    defaultProps: { day: 1, notebook: 1, chunk: { en: "", pt: "" }, beats: [], timings: [] },
    calculateMetadata: ({ props }) => ({ durationInFrames: Math.max(1, sitcomFrames(props, FPS)) }),
  }),
  // "LIÇÃO EM VÍDEO": cena no café → mini-lição com exercícios de app → volta à cena. Props = episódio + timings (scripts/make-licao.sh).
  React.createElement(Composition<any, LicaoProps>, {
    id: "Licao",
    component: LicaoOuCafe,
    fps: FPS,
    width: 1080,
    height: 1920,
    durationInFrames: 1,
    defaultProps: { day: 1, notebook: 1, chunk: { en: "", pt: "" }, cena: { passos: [] }, licao: { exercicios: [] }, volta: { passos: [] }, timings: {} },
    calculateMetadata: ({ props }) => ({ durationInFrames: Math.max(1, isCafe(props) ? cafeFrames(props as any, FPS) : licaoFrames(props, FPS)) }),
  }),
  // Faixa ESQUETE (5–20 s): corte do mesmo episódio + gancho no frame 0 + card "aula completa no EP N". Props = as do Licao + `esquete`.
  React.createElement(Composition<any, LicaoEsqueteProps>, {
    id: "LicaoEsquete",
    component: LicaoEsqueteOuCafe,
    fps: FPS,
    width: 1080,
    height: 1920,
    durationInFrames: 1,
    defaultProps: { day: 1, notebook: 1, chunk: { en: "", pt: "" }, cena: { passos: [] }, licao: { exercicios: [] }, volta: { passos: [] }, timings: {}, esquete: "A" },
    calculateMetadata: ({ props }) => ({ durationInFrames: Math.max(1, isCafe(props) ? cafeEsqueteFrames(props as any, FPS) : licaoEsqueteFrames(props, FPS)) }),
  }),
  // "SITCOM DO CAFÉ" (formato passivo): 1 cena no Bean There com a frase-alvo em 5+ bocas, pergunta, shadowing, Caderninho.
  // Props = episódio `format: "cafe"` + timings (lista alinhada com beats) + voiceLufs (scripts/make-cafe.sh).
  React.createElement(Composition<any, CafeProps>, {
    id: "Cafe",
    component: Cafe,
    fps: FPS,
    width: 1080,
    height: 1920,
    durationInFrames: 1,
    defaultProps: { format: "cafe", alvo: { en: "", pt: "" }, beats: [], timings: [] },
    calculateMetadata: ({ props }) => ({ durationInFrames: Math.max(1, cafeFrames(props, FPS)) }),
  }),
  // Faixa ESQUETE do café: beats `de`..`ate` + card "aula completa no EP N" (2 s). Props = as do Cafe + `esquete`.
  React.createElement(Composition<any, CafeEsqueteProps>, {
    id: "CafeEsquete",
    component: CafeEsquete,
    fps: FPS,
    width: 1080,
    height: 1920,
    durationInFrames: 1,
    defaultProps: { format: "cafe", alvo: { en: "", pt: "" }, beats: [], timings: [], esquete: "A" },
    calculateMetadata: ({ props }) => ({ durationInFrames: Math.max(1, cafeEsqueteFrames(props, FPS)) }),
  }));

registerRoot(Root);
