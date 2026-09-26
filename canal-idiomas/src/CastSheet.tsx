import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Capi } from "./Capi";
import { Hank } from "./chars/Hank";
import { Lazy } from "./chars/Lazy";
import { Emotion } from "./chars/common";
import { C, TITLE } from "./theme";

// Folha do elenco do piloto: expressões + teste de silhueta a 64 px (preenchido de preto).
const HANK: [Emotion, boolean][] = [["bored", false], ["neutral", true], ["eyebrow", false], ["angry", false], ["surprised", false], ["happy", false]];
const LAZY: [Emotion, boolean][] = [["neutral", false], ["whisper", true], ["surprised", false], ["happy", false]];

const Label: React.FC<{ t: string }> = ({ t }) => <div style={{ fontFamily: TITLE, fontSize: 30, color: "#fff" }}>{t}</div>;

export const CastSheet: React.FC = () => {
  const frame = useCurrentFrame() + 12;
  return (
    <AbsoluteFill style={{ background: C.roxo, padding: 30, gap: 20 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
        {HANK.map(([e, t]) => (
          <div key={e + t} style={{ width: 240, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Hank frame={frame} talking={t} emotion={e} size={230} />
            <Label t={t ? "falando" : e} />
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 30, alignItems: "flex-end" }}>
        {LAZY.map(([e, t]) => (
          <div key={e + t} style={{ width: 220, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Lazy frame={frame} talking={t} emotion={e} size={170} />
            <Label t={t ? "falando" : e} />
          </div>
        ))}
        <div style={{ display: "flex", flexDirection: "column", gap: 20, alignItems: "center", marginLeft: 30 }}>
          <Label t="64 px" />
          <div style={{ display: "flex", gap: 24, alignItems: "flex-end", filter: "brightness(0)" }}>
            <Capi frame={40} talking={false} mood="zen" size={64} />
            <Hank frame={40} talking={false} emotion="bored" size={64} />
            <Lazy frame={40} talking={false} emotion="neutral" size={40} />
          </div>
          <div style={{ display: "flex", gap: 24, alignItems: "flex-end" }}>
            <Capi frame={40} talking={false} mood="zen" size={64} />
            <Hank frame={40} talking={false} emotion="bored" size={64} />
            <Lazy frame={40} talking={false} emotion="neutral" size={40} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
