import React from "react";
import { Watermark } from "./Watermark";
import {
  AbsoluteFill, Audio, Sequence, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig,
} from "remotion";
import { Capi, Mood } from "./Capi";
import { BG_BY_FORMAT, BODY, C, SAFE, TITLE, outline } from "./theme";

export type Segment = { lang: "pt" | "en"; text: string; start: number; end: number };
export type Track = { audio: string; duration: number; segments: Segment[] };
export type Timing = Track & { reveal?: Track };
export type Scene = {
  type: "hook" | "question" | "reveal" | "example" | "cta";
  title: string;
  level?: number;
  rehook?: string;
  subtitle?: string;
  options?: string[];
  answer?: number;
  timerSeconds?: number;
  example?: string;
  translation?: string;
};
export type EpisodeProps = { format?: string; scenes: Scene[]; timings: Timing[] };

const BREATH = 0.15; // respiro entre cenas (manual de retenção)

// Duração de cada cena em frames: fala + timer + revelação + respiro.
export const sceneFrames = (scene: Scene, timing: Timing, fps: number) =>
  Math.ceil((timing.duration + (scene.timerSeconds ?? 0) + (timing.reveal?.duration ?? 0) + BREATH) * fps);

const revealAt = (scene: Scene, timing: Timing) => timing.duration + (scene.timerSeconds ?? 0);

const Sfx: React.FC<{ at: number; name: string; vol?: number }> = ({ at, name, vol = 0.55 }) => {
  const { fps } = useVideoConfig();
  return (
    <Sequence from={Math.max(0, Math.round(at * fps))} durationInFrames={45}>
      <Audio src={staticFile(`sfx/${name}.ogg`)} volume={vol} />
    </Sequence>
  );
};

// Entrada com mola. instant = já visível no frame 0 (capa do feed nunca vazia).
const In: React.FC<{ children: React.ReactNode; delay?: number; instant?: boolean; from?: "up" | "left" | "right" }> = ({
  children, delay = 0, instant, from = "up",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = instant ? 1 : spring({ frame: frame - delay, fps, config: { damping: 14 } });
  const off = (1 - s) * 140;
  const t = from === "left" ? `translateX(${-off}px)` : from === "right" ? `translateX(${off}px)` : `translateY(${off}px)`;
  return <div style={{ transform: `${t} scale(${0.9 + s * 0.1})`, opacity: Math.min(1, s * 1.4) }}>{children}</div>;
};

const Background: React.FC<{ color: string; pulse: number }> = ({ color, pulse }) => {
  const frame = useCurrentFrame();
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ?!";
  return (
    <AbsoluteFill style={{ background: color, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: C.errado, opacity: pulse * 0.35 }} />
      {Array.from({ length: 36 }, (_, i) => (
        <div key={i} style={{
          position: "absolute", fontFamily: TITLE, fontSize: 90, color: "#fff", opacity: 0.06,
          left: (i % 6) * 190 - 40 + ((frame * 0.6) % 190), top: Math.floor(i / 6) * 330 + (i % 2) * 120,
          transform: `rotate(${random(`r${i}`) * 40 - 20}deg)`,
        }}>{letters[i % letters.length]}</div>
      ))}
    </AbsoluteFill>
  );
};

const Bubble: React.FC<{ track: Track; offset?: number; x: number; y: number; w: number }> = ({ track, offset = 0, x, y, w }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps - offset;
  const seg = track.segments.find((s) => t >= s.start && t <= s.end + 0.1);
  if (!seg) return null;
  const words = seg.text.split(" ");
  const active = Math.min(words.length - 1, Math.floor(((t - seg.start) / (seg.end - seg.start)) * words.length));
  const start = Math.floor(active / 3) * 3; // blocos de 3 palavras
  const chunk = words.slice(start, start + 3);
  return (
    <div style={{
      position: "absolute", left: x, top: y, width: w, background: "#fff", borderRadius: 36, padding: "20px 26px",
      border: `7px solid ${C.tinta}`, boxShadow: `0 8px 0 ${C.tinta}`, textAlign: "center",
    }}>
      <span style={{ fontFamily: TITLE, fontSize: 60, lineHeight: 1.1, color: C.tinta }}>
        {seg.lang === "en" ? "🇺🇸 " : ""}
        {chunk.map((wd, i) => (
          <span key={i} style={{ color: start + i === active ? C.tangerina : C.tinta }}>{wd} </span>
        ))}
      </span>
    </div>
  );
};

const TimerRing: React.FC<{ remaining: number; total: number }> = ({ remaining, total }) => {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const last = remaining <= 1;
  return (
    <svg width={140} height={140} viewBox="0 0 140 140">
      <circle cx={70} cy={70} r={r} fill={C.creme} stroke={C.tinta} strokeWidth={8} />
      <circle cx={70} cy={70} r={r} fill="none" stroke={last ? C.errado : C.amarelo} strokeWidth={14}
        strokeDasharray={circ} strokeDashoffset={circ * (1 - remaining / total)} transform="rotate(-90 70 70)" strokeLinecap="round" />
      <text x={70} y={88} textAnchor="middle" fontFamily={TITLE} fontSize={54} fill={C.tinta}>{Math.ceil(remaining)}</text>
    </svg>
  );
};

const LevelBar: React.FC<{ level: number; total: number; done: number }> = ({ level, total, done }) => (
  <div style={{ position: "absolute", top: SAFE.y0, left: SAFE.x0, display: "flex", alignItems: "center", gap: 18 }}>
    <div style={{ fontFamily: TITLE, fontSize: 52, color: "#fff", ...outline(8) }}>NÍVEL {level}</div>
    <div style={{ display: "flex", gap: 10 }}>
      {Array.from({ length: total }, (_, i) => (
        <div key={i} style={{
          width: 70, height: 26, borderRadius: 13, border: `5px solid ${C.tinta}`,
          background: i < done ? C.certo : i < level ? C.amarelo : C.lilas,
        }} />
      ))}
    </div>
  </div>
);

const Stamp: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame > 18) return null;
  const s = spring({ frame, fps, config: { damping: 8, mass: 0.6 } });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
      <div style={{
        fontFamily: TITLE, fontSize: 170, color: C.amarelo, ...outline(14),
        transform: `scale(${interpolate(s, [0, 1], [2.2, 1])}) rotate(-8deg)`, opacity: interpolate(frame, [12, 18], [1, 0], { extrapolateLeft: "clamp" }),
      }}>{text}</div>
    </AbsoluteFill>
  );
};

const Particles: React.FC<{ since: number }> = ({ since }) => {
  if (since < 0 || since > 20) return null;
  return (
    <>
      {Array.from({ length: 14 }, (_, i) => {
        const a = (i / 14) * Math.PI * 2;
        const d = since * 22;
        return <div key={i} style={{
          position: "absolute", left: 500 + Math.cos(a) * d, top: 900 + Math.sin(a) * d, width: 22, height: 22,
          borderRadius: 11, background: i % 2 ? C.amarelo : C.tangerina, opacity: 1 - since / 20,
        }} />;
      })}
    </>
  );
};

const SceneView: React.FC<{ scene: Scene; timing: Timing; first: boolean; levels: number; done: number; format?: string }> = ({
  scene, timing, first, levels, done, format,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const ra = revealAt(scene, timing);
  const rt = t - ra;
  const hasAnswer = scene.answer !== undefined;
  const revealed = hasAnswer && rt >= 0;
  const inTimer = !!scene.timerSeconds && t >= timing.duration && t < ra;
  const remaining = inTimer ? ra - t : 0;
  const talking = timing.segments.some((s) => t >= s.start && t <= s.end)
    || !!timing.reveal?.segments.some((s) => rt >= s.start && rt <= s.end);

  const mood: Mood = scene.type === "hook" ? "shock"
    : revealed ? "happy"
    : inTimer ? "sweat"
    : scene.type === "question" ? "thinking"
    : scene.type === "cta" ? "happy" : "zen";

  const punch = revealed ? interpolate(rt * fps, [0, 4, 10], [1, 1.05, 1], { extrapolateRight: "clamp" }) : 1;
  const pulse = inTimer && remaining <= 1 ? Math.abs(Math.sin(frame / 3)) : 0;
  const bg = BG_BY_FORMAT[format ?? ""] ?? C.roxo;
  const isHook = scene.type === "hook";

  return (
    <AbsoluteFill style={{ transform: `scale(${punch})` }}>
      <Background color={bg} pulse={pulse} />
      <Audio src={staticFile(timing.audio)} />
      {!first && <Sfx at={0} name="whoosh" vol={0.35} />}
      {scene.level !== undefined && <Sfx at={0} name="stamp" vol={0.5} />}
      {scene.options?.map((_, i) => <Sfx key={i} at={(8 + i * 6) / fps} name="pop" vol={0.3} />)}
      {scene.timerSeconds && Array.from({ length: scene.timerSeconds }, (_, i) => (
        <Sfx key={`t${i}`} at={timing.duration + i} name={i === scene.timerSeconds! - 1 ? "tick2" : "tick"} vol={0.6} />
      ))}
      {hasAnswer && <Sfx at={ra} name="correct" vol={0.6} />}
      {timing.reveal && (
        <Sequence from={Math.round(ra * fps)}>
          <Audio src={staticFile(timing.reveal.audio)} />
        </Sequence>
      )}

      {scene.level !== undefined && <LevelBar level={scene.level} total={levels} done={done + (revealed ? 1 : 0)} />}
      {inTimer && <div style={{ position: "absolute", top: SAFE.y0 - 20, left: SAFE.x1 - 140 }}><TimerRing remaining={remaining} total={scene.timerSeconds!} /></div>}

      {/* cartão principal */}
      <div style={{ position: "absolute", left: SAFE.x0, width: SAFE.x1 - SAFE.x0, top: isHook ? SAFE.y0 + 40 : SAFE.y0 + 130 }}>
        <In instant={first}>
          <div style={{
            background: C.creme, border: `8px solid ${C.tinta}`, borderRadius: 44, padding: "34px 36px",
            boxShadow: `0 12px 0 ${C.tinta}`, textAlign: "center",
          }}>
            {scene.rehook && <div style={{ fontFamily: TITLE, fontSize: 44, color: C.errado, marginBottom: 8 }}>{scene.rehook}</div>}
            <div style={{ fontFamily: TITLE, fontSize: isHook ? 96 : 80, lineHeight: 1.05, color: C.tinta }}>{scene.title}</div>
            {scene.subtitle && <div style={{ fontFamily: BODY, fontWeight: 800, fontSize: 42, color: C.roxo, marginTop: 14 }}>{scene.subtitle}</div>}
          </div>
        </In>

        {scene.options?.map((opt, i) => {
          const isRight = i === scene.answer;
          const wrongShake = revealed && !isRight ? Math.sin(rt * fps * 1.6) * interpolate(rt * fps, [0, 12], [14, 0], { extrapolateRight: "clamp" }) : 0;
          return (
            <In key={i} delay={8 + i * 6} instant={first} from={i % 2 ? "right" : "left"}>
              <div style={{
                marginTop: 26, height: 116, display: "flex", alignItems: "center", gap: 22, padding: "0 28px",
                borderRadius: 58, border: `7px solid ${C.tinta}`, boxShadow: `0 9px 0 ${C.tinta}`,
                background: !revealed ? "#fff" : isRight ? C.certo : C.errado,
                opacity: revealed && !isRight ? 0.5 : 1,
                transform: `translateX(${wrongShake}px) scale(${revealed && isRight ? 1.06 : 1})`,
              }}>
                <div style={{
                  width: 66, height: 66, borderRadius: 33, background: C.amarelo, border: `5px solid ${C.tinta}`,
                  display: "flex", alignItems: "center", justifyContent: "center", fontFamily: TITLE, fontSize: 40, color: C.tinta,
                }}>{revealed ? (isRight ? "✓" : "✗") : String.fromCharCode(65 + i)}</div>
                <div style={{ fontFamily: BODY, fontWeight: 800, fontSize: 52, color: revealed ? "#fff" : C.tinta }}>{opt}</div>
              </div>
            </In>
          );
        })}

        {scene.example && (
          <In delay={4} instant={first}>
            <div style={{
              marginTop: 30, background: "#fff", border: `7px solid ${C.tinta}`, borderRadius: 36, padding: 30,
              boxShadow: `0 9px 0 ${C.tinta}`, fontFamily: BODY, fontWeight: 800, fontSize: 52, color: C.tinta, textAlign: "center",
            }}>
              🇺🇸 {scene.example}
              <div style={{ fontWeight: 800, fontSize: 40, color: C.roxo, marginTop: 12 }}>{scene.translation}</div>
            </div>
          </In>
        )}
      </div>

      {/* Capi: grande no gancho, à esquerda nas demais; balão de fala ao lado */}
      <div style={{ position: "absolute", left: isHook ? 150 : SAFE.x0 - 10, top: isHook ? 760 : 1010 }}>
        <Capi frame={frame} talking={talking} mood={mood} size={isHook ? 700 : 400}
          sweat={inTimer ? (scene.level ?? 1) : 0} armUp={scene.type === "question" && !inTimer} />
      </div>
      {!(scene.type === "question" && !revealed) && (
        t < ra || !timing.reveal
          ? <Bubble track={timing} x={isHook ? 120 : 470} y={isHook ? 600 : 1060} w={isHook ? 840 : 470} />
          : <Bubble track={timing.reveal} offset={ra} x={470} y={1060} w={470} />
      )}
      {revealed && <Particles since={rt * fps} />}
      {scene.level !== undefined && <Stamp text={`NÍVEL ${scene.level}!`} />}
    </AbsoluteFill>
  );
};

export const Episode: React.FC<EpisodeProps> = ({ format, scenes, timings }) => {
  const { fps } = useVideoConfig();
  const levels = Math.max(0, ...scenes.map((s) => s.level ?? 0));
  let from = 0;
  let done = 0;
  return (
    <AbsoluteFill style={{ background: C.noite }}>
      {scenes.map((scene, i) => {
        const dur = sceneFrames(scene, timings[i], fps);
        const el = (
          <Sequence key={i} from={from} durationInFrames={dur}>
            <SceneView scene={scene} timing={timings[i]} first={i === 0} levels={levels} done={done} format={format} />
          </Sequence>
        );
        from += dur;
        if (scene.answer !== undefined) done += 1;
        return el;
      })}
    <Watermark />
    </AbsoluteFill>
  );
};
