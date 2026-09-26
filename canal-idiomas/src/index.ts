import React from "react";
import { Composition, registerRoot } from "remotion";
import { Episode, EpisodeProps, sceneFrames } from "./Episode";
import { CapiSheet } from "./CapiSheet";
import { Avatar, Banner } from "./Brand";
import { CastSheet } from "./CastSheet";
import { Sitcom, SitcomProps, sitcomFrames } from "./Sitcom";
import { Licao, LicaoProps, licaoFrames } from "./Licao";

const FPS = 30;

const Root: React.FC = () =>
  React.createElement(React.Fragment, null,
  React.createElement(Composition, { id: "Avatar", component: Avatar, fps: FPS, width: 800, height: 800, durationInFrames: 1 }),
  React.createElement(Composition, { id: "Banner", component: Banner, fps: FPS, width: 2560, height: 1440, durationInFrames: 1 }),
  React.createElement(Composition, { id: "CapiSheet", component: CapiSheet, fps: FPS, width: 1080, height: 1150, durationInFrames: 1 }),
  React.createElement(Composition, { id: "CastSheet", component: CastSheet, fps: FPS, width: 1520, height: 900, durationInFrames: 60 }),
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
  // "Capi no Exterior" (sitcom em micro-episódios). Props = episódio com `beats` + timings do TTS (scripts/make-sitcom.sh).
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
    component: Licao,
    fps: FPS,
    width: 1080,
    height: 1920,
    durationInFrames: 1,
    defaultProps: { day: 1, notebook: 1, chunk: { en: "", pt: "" }, cena: { passos: [] }, licao: { exercicios: [] }, volta: { passos: [] }, timings: {} },
    calculateMetadata: ({ props }) => ({ durationInFrames: Math.max(1, licaoFrames(props, FPS)) }),
  }));

registerRoot(Root);
