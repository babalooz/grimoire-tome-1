import React from "react";
import { Composition, registerRoot } from "remotion";
import { Noticia, NoticiaProps, duracaoCena } from "./Noticia";

const FPS = 30;

const Root: React.FC = () =>
  React.createElement(Composition<any, NoticiaProps>, {
    id: "Noticia",
    component: Noticia,
    fps: FPS,
    width: 1080,
    height: 1920,
    durationInFrames: 1,
    defaultProps: { id: "", cenas: [], timings: [], imagens: [] } as any,
    calculateMetadata: ({ props }) => ({
      durationInFrames: Math.max(1, props.cenas.reduce((s, c, i) => s + duracaoCena(c, props.timings[i], FPS), 0)),
    }),
  });

registerRoot(Root);
