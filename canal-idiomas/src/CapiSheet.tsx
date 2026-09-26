import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Capi, Mood } from "./Capi";
import { C, TITLE } from "./theme";

// Folha de personagem: todas as expressões lado a lado (revisão visual da Capi).
const MOODS: Mood[] = ["zen", "thinking", "sweat", "shock", "happy", "fail"];

export const CapiSheet: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.roxo, flexDirection: "row", flexWrap: "wrap", padding: 30 }}>
      {MOODS.map((m) => (
        <div key={m} style={{ width: 340, height: 560, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Capi frame={frame + 40} talking={false} mood={m} sweat={m === "sweat" ? 3 : 0} size={320} />
          <div style={{ fontFamily: TITLE, fontSize: 40, color: "#fff" }}>{m}</div>
        </div>
      ))}
    </AbsoluteFill>
  );
};
