import React from "react";
import {
  AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig,
} from "remotion";
import { Mascot } from "./Mascot";

export type Segment = { lang: "pt" | "en"; text: string; start: number; end: number };
export type Track = { audio: string; duration: number; segments: Segment[] };
export type Timing = Track & { reveal?: Track };
export type Scene = {
  type: "hook" | "question" | "reveal" | "example" | "cta";
  level?: number;
  title: string;
  subtitle?: string;
  options?: string[];
  answer?: number;
  timerSeconds?: number;
  example?: string;
  translation?: string;
};
export type EpisodeProps = { scenes: Scene[]; timings: Timing[] };

const BG = "#3d1f8f"; // roxo da marca
const ACCENT = "#ffcc00";
const FONT = "Arial Black, Arial, sans-serif";

// Duração de cada cena em frames: fala + tempo de resposta + revelação + respiro.
export const sceneFrames = (scene: Scene, timing: Timing, fps: number) =>
  Math.ceil((timing.duration + (scene.timerSeconds ?? 0) + (timing.reveal?.duration ?? 0) + 0.4) * fps);

// Momento (s) em que a resposta aparece.
const revealAt = (scene: Scene, timing: Timing) => timing.duration + (scene.timerSeconds ?? 0);

const Pop: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 12 } });
  return <div style={{ transform: `scale(${s})`, opacity: s }}>{children}</div>;
};

const Caption: React.FC<{ track: Track; offset?: number }> = ({ track, offset = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps - offset;
  const seg = track.segments.find((s) => t >= s.start && t <= s.end + 0.2);
  if (!seg) return null;
  const words = seg.text.split(" ");
  const progress = (t - seg.start) / (seg.end - seg.start);
  const active = Math.min(words.length - 1, Math.floor(progress * words.length));
  return (
    <div style={{ position: "absolute", bottom: 260, width: "100%", textAlign: "center", padding: "0 60px" }}>
      <span style={{ fontFamily: FONT, fontSize: 58, lineHeight: 1.25, color: "#fff", textShadow: "0 6px 0 #000" }}>
        {seg.lang === "en" ? "🇺🇸 " : ""}
        {words.map((w, i) => (
          <span key={i} style={{ color: i === active ? ACCENT : "#fff" }}>{w} </span>
        ))}
      </span>
    </div>
  );
};

const LevelBar: React.FC<{ level: number; total: number }> = ({ level, total }) => (
  <div style={{ position: "absolute", top: 70, display: "flex", gap: 14 }}>
    {Array.from({ length: total }, (_, i) => (
      <div key={i} style={{
        width: 150, height: 26, borderRadius: 13,
        background: i < level ? ACCENT : "rgba(255,255,255,0.2)",
      }} />
    ))}
    <div style={{ position: "absolute", top: 36, width: "100%", textAlign: "center", color: "#fff", fontSize: 40 }}>
      NÍVEL {level}/{total}
    </div>
  </div>
);

const SceneView: React.FC<{ scene: Scene; timing: Timing; levels: number }> = ({ scene, timing, levels }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const rt = t - revealAt(scene, timing);
  const talking = timing.segments.some((s) => t >= s.start && t <= s.end)
    || !!timing.reveal?.segments.some((s) => rt >= s.start && rt <= s.end);
  const revealed = scene.answer !== undefined && rt >= 0;
  const mood = scene.type === "reveal" ? "happy" : scene.type === "hook" ? "shock" : "normal";
  const countdown = scene.timerSeconds && t > timing.duration
    ? Math.max(0, Math.ceil(scene.timerSeconds - (t - timing.duration)))
    : null;
  const showCountdown = countdown !== null && !revealed;

  return (
    <AbsoluteFill style={{ background: BG, alignItems: "center", fontFamily: FONT }}>
      <Audio src={staticFile(timing.audio)} />
      {timing.reveal && (
        <Sequence from={Math.round(revealAt(scene, timing) * fps)}>
          <Audio src={staticFile(timing.reveal.audio)} />
        </Sequence>
      )}
      {scene.level !== undefined && <LevelBar level={scene.level} total={levels} />}
      <div style={{ marginTop: scene.level !== undefined ? 230 : 170, padding: "0 60px", textAlign: "center" }}>
        <Pop>
          <div style={{ fontSize: 76, color: "#fff", lineHeight: 1.1, textShadow: "0 8px 0 #1a0b45" }}>{scene.title}</div>
        </Pop>
        {scene.subtitle && (
          <Pop delay={8}>
            <div style={{ fontSize: 46, color: ACCENT, marginTop: 30 }}>{scene.subtitle}</div>
          </Pop>
        )}
        {scene.options?.map((opt, i) => (
          <Pop key={i} delay={10 + i * 12}>
            <div style={{
              marginTop: 36, borderRadius: 28, padding: "26px 30px", fontSize: 44, textAlign: "left",
              boxShadow: "0 10px 0 #1a0b45", color: revealed ? "#fff" : BG,
              background: !revealed ? "#fff" : i === scene.answer ? "#22c55e" : "#ef4444",
              opacity: revealed && i !== scene.answer ? 0.55 : 1,
              transform: revealed && i === scene.answer ? "scale(1.06)" : undefined,
            }}>
              <b style={{ color: ACCENT, WebkitTextStroke: "2px #1a0b45" }}>{String.fromCharCode(65 + i)}</b> {opt}
            </div>
          </Pop>
        ))}
        {scene.example && (
          <Pop delay={4}>
            <div style={{ marginTop: 40, background: "#fff", color: BG, borderRadius: 28, padding: 34, fontSize: 50 }}>
              {scene.example}
              <div style={{ fontSize: 38, color: "#7a6aa8", marginTop: 16 }}>{scene.translation}</div>
            </div>
          </Pop>
        )}
      </div>
      {showCountdown && (
        <div style={{
          position: "absolute", top: 1020, fontSize: 150, color: ACCENT,
          transform: `scale(${interpolate((t - timing.duration) % 1, [0, 1], [1.3, 1])})`,
        }}>{countdown || "⏰"}</div>
      )}
      <div style={{ position: "absolute", bottom: 380 }}>
        <Mascot talking={talking} frame={frame} mood={mood} />
      </div>
      {t < revealAt(scene, timing) ? <Caption track={timing} /> : timing.reveal && <Caption track={timing.reveal} offset={revealAt(scene, timing)} />}
      <div style={{ position: "absolute", bottom: 90, fontSize: 34, color: "#b9a8ff" }}>@capi.english</div>
    </AbsoluteFill>
  );
};

export const Episode: React.FC<EpisodeProps> = ({ scenes, timings }) => {
  const { fps } = useVideoConfig();
  const levels = Math.max(0, ...scenes.map((s) => s.level ?? 0));
  let from = 0;
  return (
    <AbsoluteFill style={{ background: BG }}>
      {scenes.map((scene, i) => {
        const dur = sceneFrames(scene, timings[i], fps);
        const el = (
          <Sequence key={i} from={from} durationInFrames={dur}>
            <SceneView scene={scene} timing={timings[i]} levels={levels} />
          </Sequence>
        );
        from += dur;
        return el;
      })}
    </AbsoluteFill>
  );
};
