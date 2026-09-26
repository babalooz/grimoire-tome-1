import React from "react";
import { AbsoluteFill, Easing, interpolate } from "remotion";
import { Capi, Mood } from "../Capi";
import { Hank } from "../chars/Hank";
import { Leo } from "../chars/Leo";
import { Emotion } from "../chars/common";
import { CafeBack, CafeCounter, ThoughtOverlay } from "../sets/CafeSet";
import { Cam, CharId, STAGE, clampCam } from "../Sitcom";
import { C, TITLE } from "../theme";

// Palco do Bean There Café para o formato lição (mesmo elenco/cenário/câmera do Sitcom, mais calmo:
// troca de plano em 12 frames em vez de 8 e push-in mais lento). Inclui o desmaio da Capi.

export const WHIP = 12;

export const CafeStage: React.FC<{
  frame: number;
  cam: Cam;
  blur: number;
  emo: Record<CharId, Emotion>;
  capiMood: Mood;
  talking: CharId | null;
  overlay: number;
  tremor: number;
  faintT: number; // frames desde o início do desmaio (-1 = de pé)
  leo?: boolean;
  capiArmUp?: boolean;
  capiHop?: number;
}> = ({ frame, cam, blur, emo, capiMood, talking, overlay, tremor, faintT, leo = false, capiArmUp = false, capiHop = 0 }) => {
  const tr = tremor ? [Math.sin(frame * 2.3) * tremor, Math.cos(frame * 1.9) * tremor] : [0, 0];
  const worldT = `translate(${540 + tr[0]}px, ${960 + tr[1]}px) scale(${cam.z}) translate(${-cam.cx}px, ${-cam.cy}px)`;
  const parallax = `translate(${(cam.cx - 540) * 0.12}px, ${(cam.cy - 960) * 0.08}px)`;
  const place = (id: CharId, el: React.ReactNode, dy = 0, extra = "") => (
    <div style={{ position: "absolute", left: STAGE[id].left, top: STAGE[id].top + dy, transform: extra, transformOrigin: "30% 100%" }}>{el}</div>
  );

  // desmaio: 10 frames dura (X nos olhos, treme) → cai reta para baixo girando para trás
  let capiT = "", mood = capiMood, sweat = capiMood === "sweat" ? 2 : 0;
  if (faintT >= 0) {
    mood = "fail";
    const fall = interpolate(faintT, [10, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) });
    const stiff = faintT < 10 ? Math.sin(faintT * 2.2) * 3 : 0;
    capiT = `translate(${stiff - fall * 40}px, ${fall * 760}px) rotate(${-fall * 28}deg)`;
    sweat = 0;
  } else if (capiHop) {
    capiT = `translateY(${-capiHop * 40}px)`;
  }

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: worldT, transformOrigin: "0 0", filter: blur > 0.3 ? `blur(${blur}px)` : undefined }}>
        <AbsoluteFill style={{ transform: parallax }}><CafeBack frame={frame} /></AbsoluteFill>
        {place("hank", <Hank frame={frame} talking={talking === "hank"} emotion={emo.hank} size={STAGE.hank.size} />)}
        {leo && place("leo", <Leo frame={frame} talking={talking === "leo"} emotion={emo.leo} size={STAGE.leo.size} />)}
        <CafeCounter frame={frame} />
        <ThoughtOverlay amount={overlay} frame={frame} />
        {place("capi", <Capi frame={frame} talking={talking === "capi"} mood={mood} size={STAGE.capi.size} sweat={sweat} armUp={capiArmUp} />, 0, capiT)}
      </AbsoluteFill>
      {faintT >= 18 && <Ploft since={faintT - 18} />}
    </AbsoluteFill>
  );
};

// Onomatopeia da queda + estrelinhas girando onde a cabeça estava.
const Ploft: React.FC<{ since: number }> = ({ since }) => {
  const s = interpolate(since, [0, 6], [0.3, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.back(3)) });
  return (
    <>
      <div style={{
        position: "absolute", left: 110, top: 1230, fontFamily: TITLE, fontSize: 130, color: C.amarelo, WebkitTextStroke: `12px ${C.tinta}`, paintOrder: "stroke fill",
        textShadow: `0 10px 0 ${C.tinta}`, transform: `rotate(-10deg) scale(${s})`,
      }}>PLOFT!</div>
      <svg width={420} height={200} style={{ position: "absolute", left: 90, top: 1130, overflow: "visible" }}>
        {[0, 1, 2, 3].map((i) => {
          const a = since / 7 + (i * Math.PI) / 2;
          const x = 200 + Math.cos(a) * 150, y = 60 + Math.sin(a) * 36;
          return (
            <path key={i} transform={`translate(${x} ${y}) scale(${0.9 + 0.2 * Math.sin(a)})`}
              d="M0 -26 L7 -8 L26 -8 L11 4 L17 24 L0 12 L-17 24 L-11 4 L-26 -8 L-7 -8 Z" fill={C.amarelo} stroke={C.tinta} strokeWidth={5} strokeLinejoin="round" />
          );
        })}
      </svg>
    </>
  );
};

export const camLerp = (a: Cam, b: Cam, k: number, push: number): Cam =>
  clampCam({ cx: a.cx + (b.cx - a.cx) * k, cy: a.cy + (b.cy - a.cy) * k, z: (a.z + (b.z - a.z) * k) * push });
