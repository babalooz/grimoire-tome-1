import React, { useMemo } from "react";
import { AbsoluteFill, Audio, Easing, Freeze, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Mood } from "./Capi";
import { Emotion } from "./chars/common";
import { Licao, TITLE_BOTTOM, TITLE_TOP, hookCam, hookEmo, hookPlan, onStage, shotWithHook } from "./Licao";
import { AUDIT_BG, AuditCtx, useAudit } from "./lesson/audit";
import { CafeStage, WHIP, camLerp } from "./lesson/CafeStage";
import { Caption } from "./lesson/Caption";
import { SeriesSeal } from "./lesson/ExerciseBoards";
import { MUSIC, DEFAULT_VOICE_LUFS, musicEnvelope } from "./lesson/music";
import { Line, LicaoProps, Step, buildSchedule, esqueteWindow, isLine } from "./lesson/timeline";
import { CharId, STAGE, Sfx, toScreen } from "./Sitcom";
import { C, SAFE, TITLE } from "./theme";
import { Watermark } from "./Watermark";

// Faixa ESQUETE (Teste Duas faixas, canal-idiomas/decisoes.md): 5–20 s cortados do MESMO episódio/áudio.
//   [gancho de tela desde o frame 0, sem vinheta] + [abertura opcional: 1–2 falas do hype do dia, ≤ 4 s]
//   + [corte `de`→`ate` do episódio] + [card final "aula completa no EP 0N"].
// Props = episódio (com `esquetes`) + timings + `esquete: "A" | "B" | "C"`. Render: scripts/make-licao.sh.

export type LicaoEsqueteProps = LicaoProps & { esquete: string; auditoria?: boolean };

export const licaoEsqueteFrames = (p: LicaoEsqueteProps, fps: number) =>
  !p.timings || !Object.keys(p.timings).length || !p.esquetes?.length ? 1 : esqueteWindow(p, p.esquete, fps).total;

const MOOD: Record<Emotion, Mood> = {
  neutral: "zen", zen: "zen", bored: "zen", angry: "thinking", eyebrow: "thinking", surprised: "shock",
  panic: "sweat", happy: "happy", smile: "happy", whisper: "thinking",
};
const GANCHO_S = 2.6;

// Abertura: falas curtas no palco do café (mesmo palco/câmera/legenda da cena do episódio).
// Mesmo gancho de câmera do episódio (src/Licao.tsx, HOOK): close em quem fala → corte seco para a reação → volta.
const Abertura: React.FC<{ steps: Step[]; lazy: boolean }> = ({ steps, lazy }) => {
  const frame = useCurrentFrame();
  const cur = steps.find((s) => frame >= s.from && frame < s.from + s.dur) ?? steps[steps.length - 1];
  const ci = steps.indexOf(cur);
  const hook = useMemo(() => hookPlan(steps, 0, lazy ? ["lazy"] : []), [steps, lazy]);
  const shotOf = shotWithHook(hook);
  const target = shotOf(cur);
  const prev = ci > 0 ? shotOf(steps[ci - 1]) : target;
  const k = interpolate(frame - cur.from, [0, WHIP], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const hc = hookCam(hook, frame);
  const cam = hc ? hc.cam : camLerp(prev, target, k, 1 + 0.018 * Math.min(1, Math.max(0, frame - cur.from) / (cur.dur || 1)));
  const emo: Record<CharId, Emotion> = { capi: "zen", hank: "bored", lazy: "neutral" };
  steps.forEach((s) => {
    if (s.i > cur.i || !isLine(s.passo)) return;
    const l = s.passo;
    if (onStage(l.speaker) && l.emotion) emo[l.speaker] = l.emotion;
    if (l.react) Object.assign(emo, l.react);
  });
  const emoView = hc?.insert ? hookEmo(emo, hook!.b) : emo;
  const line = isLine(cur.passo) ? (cur.passo as Line) : null;
  const inAudio = !!line && frame >= cur.start && frame < cur.start + cur.audioFrames;
  const talking = inAudio && line!.mode !== "pensamento" && onStage(line!.speaker) ? line!.speaker : null;
  let caption: React.ReactNode = null;
  if (line && frame >= cur.start) {
    const id: CharId = onStage(line.speaker) ? line.speaker : "capi";
    const [ax, ay] = toScreen(cam, STAGE[id].head[0], STAGE[id].headTop);
    caption = <Caption anchor={[ax, ay]} text={line.text} lang={line.lang} progress={(frame - cur.start) / Math.max(1, cur.audioFrames)}
      thought={line.mode === "pensamento"} pop={spring({ frame: frame - cur.start, fps: 30, config: { damping: 14 } })}
      minTop={frame < Math.round(GANCHO_S * 30) + 8 ? TITLE_BOTTOM : undefined} />;
  }
  return (
    <AbsoluteFill>
      <CafeStage frame={frame} cam={cam} blur={0} emo={emoView} capiMood={MOOD[emoView.capi]} talking={talking} overlay={0} tremor={hc?.insert ? 3 : 0} faintT={-1} lazy={lazy} />
      {caption}
      {steps.filter((s) => s.audio).map((s) => (
        <Sequence key={s.i} from={s.start} durationInFrames={s.audioFrames + 2}><Audio src={staticFile(s.audio!)} /></Sequence>
      ))}
      {steps.flatMap((s) => (s.passo.sfx ?? []).map((n, j) => <Sfx key={`${s.i}-${j}`} at={s.start} name={n} vol={0.5} />))}
    </AbsoluteFill>
  );
};

// Gancho: texto de tela já presente no frame 0 (é a capa no feed), sai em 2,6 s.
const Gancho: React.FC<{ text: string; frame: number; fps: number }> = ({ text, frame, fps }) => {
  const end = Math.round(GANCHO_S * fps);
  if (frame >= end + 8) return null;
  const wob = 1 + Math.sin(Math.min(1, frame / 8) * Math.PI) * 0.05;
  const out = interpolate(frame, [end, end + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic) });
  return (
    <div style={{
      position: "absolute", left: SAFE.x0 + 30, width: SAFE.x1 - SAFE.x0 - 60, top: TITLE_TOP, // wobble de 5% cabe em x ≤ 920
      transform: `rotate(-2deg) scale(${wob * (1 - out * 0.6)}) translateY(${-out * 160}px)`, opacity: 1 - out,
    }}>
      <div style={{
        background: C.amarelo, border: `8px solid ${C.tinta}`, borderRadius: 34, boxShadow: `0 10px 0 ${C.tinta}`, padding: "16px 24px",
        textAlign: "center", fontFamily: TITLE, fontSize: text.length > 22 ? 72 : 86, lineHeight: 1.02, color: C.tinta, textTransform: "uppercase",
        textWrap: "balance" as any,
      }}>{text}</div>
    </div>
  );
};

// Card final: "AULA COMPLETA NO EP 01" + selo da série.
const CtaCard: React.FC<{ text: string; since: number; fps: number; serie?: LicaoProps["serie"] }> = ({ text, since, fps, serie }) => {
  if (since < 0) return null;
  const s = spring({ frame: since, fps, config: { damping: 11 } });
  const dim = interpolate(since, [0, 8], [0, 0.72], { extrapolateRight: "clamp" }) * (useAudit() ? 0 : 1);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: `rgba(30,15,77,${dim})` }} />
      <div style={{ position: "absolute", left: SAFE.x0 + 10, width: SAFE.x1 - SAFE.x0 - 20, top: 640, transform: `scale(${s}) rotate(-2deg)`, textAlign: "center" }}>
        <div style={{
          background: C.amarelo, border: `9px solid ${C.tinta}`, borderRadius: 40, boxShadow: `0 14px 0 ${C.tinta}`, padding: "34px 30px 30px",
          fontFamily: TITLE, fontSize: 96, lineHeight: 1.0, color: C.tinta, textTransform: "uppercase",
        }}>{text}</div>
        {serie && (
          <div style={{
            display: "inline-block", marginTop: 36, fontFamily: TITLE, fontSize: 52, color: C.creme, background: C.roxo, border: `7px solid ${C.tinta}`,
            borderRadius: 26, padding: "6px 28px", transform: `rotate(3deg) scale(${spring({ frame: since - 8, fps, config: { damping: 9 } })})`,
          }}>{serie.codigo} · {serie.tituloCapitulo}</div>
        )}
      </div>
    </AbsoluteFill>
  );
};

export const LicaoEsquete: React.FC<LicaoEsqueteProps> = (p) => (
  <AuditCtx.Provider value={!!p.auditoria}><LicaoEsqueteInner {...p} /></AuditCtx.Provider>
);

const LicaoEsqueteInner: React.FC<LicaoEsqueteProps> = (p) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const w = useMemo(() => esqueteWindow(p, p.esquete, fps), [p, fps]);
  const lufs = p.voiceLufs ?? DEFAULT_VOICE_LUFS;
  // trilha: abertura com ducking próprio · corte = mesmo envelope do episódio · card = nível de respiro · fade no fim
  const music = useMemo(() => {
    const steps = buildSchedule(p, fps);
    const epTotal = steps[steps.length - 1].from + steps[steps.length - 1].dur;
    const full = musicEnvelope(steps, epTotal, lufs);
    const lin = (db: number) => Math.pow(10, (lufs + db - MUSIC.fileLufs) / 20);
    const raw = new Float32Array(durationInFrames);
    for (let f = 0; f < durationInFrames; f++) {
      if (f < w.ab) raw[f] = lin(w.abertura.some((s) => s.audioFrames && f >= s.start - MUSIC.lookahead && f < s.start + s.audioFrames) ? MUSIC.speech : MUSIC.gap);
      else if (f < w.ab + w.cut) raw[f] = full[Math.min(epTotal - 1, w.from + f - w.ab)];
      else raw[f] = lin(MUSIC.gap);
    }
    const out = new Float32Array(durationInFrames);
    let g = raw[0];
    for (let f = 0; f < durationInFrames; f++) {
      g += (raw[f] - g) / 4;
      out[f] = g * Math.max(0, Math.min(1, (durationInFrames - 1 - f) / 20));
    }
    return out;
  }, [p, fps, durationInFrames, lufs, w]);

  return (
    <AbsoluteFill style={{ background: p.auditoria ? AUDIT_BG : C.noite, overflow: "hidden" }}>
      {w.ab > 0 && (
        <Sequence durationInFrames={w.ab}><Abertura steps={w.abertura} lazy={!!p.cast?.includes("lazy")} /></Sequence>
      )}
      <Sequence from={w.ab} durationInFrames={w.cut}>
        <Sequence from={-w.from}><Licao {...p} semTrilha semGancho corteDe={w.from} ganchoAte={w.from - w.ab + Math.round(GANCHO_S * fps) + 8} /></Sequence>
      </Sequence>
      <Sequence from={w.ab + w.cut}>
        <Freeze frame={w.to - 1}><Licao {...p} semAudio semTrilha semGancho /></Freeze>
        <CtaCard text={w.esquete.cta} since={frame - w.ab - w.cut} fps={fps} serie={p.serie} />
      </Sequence>
      <Sfx at={w.ab + w.cut + 2} name="stamp" vol={0.55} />
      {Array.from({ length: Math.ceil(durationInFrames / MUSIC.loopFrames) }, (_, k) => (
        <Sequence key={`m${k}`} from={k * MUSIC.loopFrames} durationInFrames={MUSIC.loopFrames}>
          <Audio src={staticFile(MUSIC.src)} volume={(f) => music[Math.min(durationInFrames - 1, k * MUSIC.loopFrames + f)] ?? 0} />
        </Sequence>
      ))}
      <Gancho text={w.esquete.gancho} frame={frame} fps={fps} />
      {w.ab > 0 && frame < w.ab && <Watermark lead={p.serie ? <SeriesSeal serie={p.serie} /> : undefined} />}
    </AbsoluteFill>
  );
};
