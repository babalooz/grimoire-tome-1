import React from "react";
import { Composition, registerRoot } from "remotion";
import { Episode, EpisodeProps, sceneFrames } from "./Episode";
import { CapiSheet } from "./CapiSheet";

const FPS = 30;

const Root: React.FC = () =>
  React.createElement(React.Fragment, null,
  React.createElement(Composition, { id: "CapiSheet", component: CapiSheet, fps: FPS, width: 1080, height: 1150, durationInFrames: 1 }),
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
  }));

registerRoot(Root);
