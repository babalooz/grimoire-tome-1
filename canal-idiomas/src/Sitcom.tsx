import React from "react";
import { Watermark } from "./Watermark";
import {
  AbsoluteFill, Audio, Easing, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig,
} from "remotion";
import { Capi, Mood } from "./Capi";
import { Hank } from "./chars/Hank";
import { Leo } from "./chars/Leo";
import { Emotion } from "./chars/common";
import { CafeBack, CafeCounter, ThoughtOverlay } from "./sets/CafeSet";
import { BODY, C, SAFE, TITLE } from "./theme";

// "Capi no Exterior" — motor de sitcom em micro-episódios.
// Roteiro = lista de beats (1 fala cada, 1 áudio cada). O motor decide câmera, balão, reações, quiz e cartão final.

export type Speaker = "capi" | "hank" | "leo" | "narrador";
export type Beat = {
  speaker: Speaker;
  lang: "pt" | "en";
  text: string;
  mode?: "fala" | "pensamento";
  emotion?: Emotion;
  shot?: "auto" | "two" | "close";
  sfx?: string[]; // nomes em public/sfx, tocados no início do beat
  react?: Partial<Record<"capi" | "hank" | "leo", Emotion>>; // reação de quem ouve
  quiz?: "ask" | "reveal"; // ask = painel aberto (o timer roda depois do último ask); reveal = resposta
  option?: number; // opção que está sendo lida (destaque)
  card?: boolean; // cartão "Caderninho da Capi" na tela
  hold?: number; // segundos extras parados no fim do beat
};
export type BeatTiming = { audio: string; duration: number };
export type SitcomProps = {
  day: number;
  hookTitle?: string;
  notebook: number;
  chunk: { en: string; pt: string; pattern?: string };
  quiz?: { question: string; options: string[]; answer: number; timerSeconds: number };
  beats: Beat[];
  timings: BeatTiming[];
};

const GAP = 0.1; // pausa entre falas (manual de retenção: ≤ 0,12 s)
const WHIP = 8; // frames da troca de plano

// Agenda de cada beat em frames. make-sitcom.sh replica esta conta para escolher os stills.
export const schedule = (p: SitcomProps, fps: number) => {
  const lastAsk = p.beats.map((b) => b.quiz).lastIndexOf("ask");
  let from = 0;
  return p.beats.map((b, i) => {
    const audio = Math.ceil(p.timings[i].duration * fps);
    const timer = i === lastAsk && p.quiz ? p.quiz.timerSeconds * fps : 0;
    const dur = audio + timer + Math.ceil(GAP * fps) + Math.ceil((b.hold ?? 0) * fps);
    const s = { i, from, dur, audio, timerFrom: timer ? from + audio : -1, timer };
    from += dur;
    return s;
  });
};
export const sitcomFrames = (p: SitcomProps, fps: number) => {
  const s = schedule(p, fps);
  return s.length ? s[s.length - 1].from + s[s.length - 1].dur : 1;
};

// ---- palco (coordenadas do mundo 1080x1920) ----
export type CharId = "capi" | "hank" | "leo";
export const STAGE: Record<CharId, { left: number; top: number; size: number; head: [number, number]; headTop: number; zoom: number }> = {
  capi: { left: 20, top: 900, size: 520, head: [293, 1177], headTop: 1034, zoom: 1.3 },
  hank: { left: 480, top: 560, size: 560, head: [680, 800], headTop: 626, zoom: 1.3 },
  leo: { left: 276, top: 751, size: 340, head: [440, 890], headTop: 765, zoom: 1.6 },
};
export type Cam = { cx: number; cy: number; z: number };
export const TWO: Cam = { cx: 540, cy: 960, z: 1 };
export const clampCam = (c: Cam): Cam => {
  const hw = 540 / c.z, hh = 960 / c.z;
  return { z: c.z, cx: Math.min(1080 - hw, Math.max(hw, c.cx)), cy: Math.min(1920 - hh, Math.max(hh, c.cy)) };
};
export const closeOn = (id: CharId): Cam => {
  const st = STAGE[id];
  return clampCam({ cx: st.head[0], cy: st.head[1] - (id === "capi" ? 150 : 90), z: st.zoom });
};
const shotFor = (b: Beat): Cam => {
  if (b.card) return TWO;
  if (b.quiz === "ask") return closeOn("capi");
  if (b.shot === "two" || b.speaker === "narrador") return TWO;
  return closeOn(b.speaker as CharId);
};
export const toScreen = (cam: Cam, x: number, y: number) => [540 + (x - cam.cx) * cam.z, 960 + (y - cam.cy) * cam.z];

export const CAPI_MOOD: Record<Emotion, Mood> = {
  neutral: "zen", zen: "zen", bored: "zen", angry: "fail", eyebrow: "thinking", surprised: "shock",
  panic: "sweat", happy: "happy", smile: "happy", whisper: "thinking",
};

export const Sfx: React.FC<{ at: number; name: string; vol?: number }> = ({ at, name, vol = 0.5 }) => (
  <Sequence from={Math.max(0, Math.round(at))} durationInFrames={60}>
    <Audio src={staticFile(`sfx/${name}.ogg`)} volume={vol} />
  </Sequence>
);

// ---- legenda em balão (blocos de 3 palavras, dentro da zona segura) ----
export const captionChunk = (text: string, t: number, dur: number) => {
  const words = text.split(/\s+/);
  const active = Math.max(0, Math.min(words.length - 1, Math.floor((t / Math.max(0.1, dur)) * words.length)));
  const start = Math.floor(active / 3) * 3;
  return { words: words.slice(start, start + 3), active: active - start };
};

export const Balloon: React.FC<{
  anchor: [number, number]; words: string[]; active: number; thought: boolean; lang: "pt" | "en"; pop: number;
}> = ({ anchor, words, active, thought, lang, pop }) => {
  const fontSize = 64;
  const chars = words.join(" ").length;
  const w = Math.min(SAFE.x1 - SAFE.x0, Math.max(300, chars * fontSize * 0.5 + 110));
  const h = fontSize * 1.15 + 56;
  const cx = Math.min(SAFE.x1 - w / 2, Math.max(SAFE.x0 + w / 2, anchor[0]));
  const bottom = anchor[1] - (thought ? 90 : 36);
  const top = Math.min(SAFE.y1 - h, Math.max(SAFE.y0 + 100, bottom - h));
  const tailX = Math.min(cx + w / 2 - 60, Math.max(cx - w / 2 + 60, anchor[0]));
  const text = (
    <div style={{ fontFamily: TITLE, fontSize, lineHeight: 1.15, color: C.tinta, whiteSpace: "nowrap", position: "relative" }}>
      {lang === "en" && <span style={{ fontFamily: BODY, fontWeight: 800, fontSize: 28, color: "#fff", background: C.roxo, borderRadius: 12, padding: "4px 10px", marginRight: 12, verticalAlign: "middle" }}>EN</span>}
      {words.map((wd, i) => (
        <span key={i} style={{ color: i === active ? C.tangerina : C.tinta }}>{wd}{i < words.length - 1 ? " " : ""}</span>
      ))}
    </div>
  );
  const scale = 0.85 + 0.15 * pop;
  if (thought) {
    // nuvem de pensamento: bolhas ao redor de um retângulo + bolinhas até a cabeça
    const bumps = [];
    const r = 34;
    const nx = Math.max(2, Math.round(w / 62)), ny = 2;
    for (let i = 0; i <= nx; i++) { bumps.push([(w * i) / nx, 0], [(w * i) / nx, h]); }
    for (let j = 1; j < ny; j++) { bumps.push([0, (h * j) / ny], [w, (h * j) / ny]); }
    const trail = [[0.35, 24], [0.62, 16], [0.85, 10]].map(([k, rr]) => [
      tailX - (cx - w / 2) + (anchor[0] - tailX) * k, h + (anchor[1] - 10 - top - h) * k, rr,
    ]);
    return (
      <div style={{ position: "absolute", left: cx - w / 2, top, width: w, height: h, transform: `scale(${scale})`, transformOrigin: `${tailX - cx + w / 2}px ${h}px` }}>
        <svg width={w} height={h} style={{ position: "absolute", overflow: "visible" }}>
          {bumps.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={r} fill="#fff" stroke={C.tinta} strokeWidth={7} />)}
          {trail.map(([x, y, rr], i) => <circle key={`t${i}`} cx={x} cy={y} r={rr} fill="#fff" stroke={C.tinta} strokeWidth={6} />)}
          <rect x={-4} y={-4} width={w + 8} height={h + 8} rx={30} fill="#fff" />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>{text}</div>
      </div>
    );
  }
  return (
    <div style={{ position: "absolute", left: cx - w / 2, top, width: w, height: h, transform: `scale(${scale})`, transformOrigin: `${tailX - cx + w / 2}px ${h + 30}px` }}>
      <svg width={w} height={h + 40} style={{ position: "absolute", overflow: "visible" }}>
        <path d={`M${tailX - (cx - w / 2) - 26} ${h - 4} L${tailX - (cx - w / 2) + (anchor[0] > tailX ? 40 : anchor[0] < tailX ? -40 : 0)} ${h + 34} L${tailX - (cx - w / 2) + 26} ${h - 4} Z`}
          fill="#fff" stroke={C.tinta} strokeWidth={7} strokeLinejoin="round" />
      </svg>
      <div style={{
        position: "absolute", inset: 0, background: "#fff", borderRadius: 34, border: `7px solid ${C.tinta}`, boxShadow: `0 8px 0 ${C.tinta}`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>{text}</div>
      {/* cobre a base do rabicho para ele "sair" do balão */}
      <div style={{ position: "absolute", left: tailX - (cx - w / 2) - 20, top: h - 14, width: 40, height: 8, background: "#fff" }} />
    </div>
  );
};

// ---- elementos de interface ----
export const DayBadge: React.FC<{ day: number }> = ({ day }) => (
  <div style={{
    position: "absolute", left: SAFE.x0, top: SAFE.y0, display: "flex", alignItems: "center", gap: 12,
    background: C.amarelo, border: `6px solid ${C.tinta}`, borderRadius: 40, padding: "8px 24px 8px 12px", boxShadow: `0 6px 0 ${C.tinta}`,
  }}>
    <div style={{ width: 52, height: 52, borderRadius: 12, background: "#fff", border: `5px solid ${C.tinta}`, overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ height: 14, background: C.errado }} />
      <div style={{ flex: 1, fontFamily: TITLE, fontSize: 28, color: C.tinta, textAlign: "center", lineHeight: "30px" }}>{day}</div>
    </div>
    <div style={{ fontFamily: TITLE, fontSize: 44, color: C.tinta }}>DIA {day} NOS EUA</div>
  </div>
);

export const TimerRing: React.FC<{ remaining: number; total: number }> = ({ remaining, total }) => {
  const r = 50, circ = 2 * Math.PI * r;
  return (
    <svg width={136} height={136} viewBox="0 0 136 136">
      <circle cx={68} cy={68} r={r} fill={C.creme} stroke={C.tinta} strokeWidth={8} />
      <circle cx={68} cy={68} r={r} fill="none" stroke={remaining <= 1 ? C.errado : C.amarelo} strokeWidth={14}
        strokeDasharray={circ} strokeDashoffset={circ * (1 - remaining / total)} transform="rotate(-90 68 68)" strokeLinecap="round" />
      <text x={68} y={86} textAnchor="middle" fontFamily={TITLE} fontSize={52} fill={remaining <= 1 ? C.errado : C.tinta}>{Math.ceil(remaining)}</text>
    </svg>
  );
};

const QuizPanel: React.FC<{
  quiz: NonNullable<SitcomProps["quiz"]>; since: number; revealT: number; reading?: number; timer?: { remaining: number; total: number }; exit: number;
}> = ({ quiz, since, revealT, reading, timer, exit }) => {
  const { fps } = useVideoConfig();
  const revealed = revealT >= 0;
  const inS = spring({ frame: since, fps, config: { damping: 14 } });
  return (
    <div style={{ position: "absolute", left: SAFE.x0, width: SAFE.x1 - SAFE.x0, top: 300, transform: `translateY(${(1 - inS) * -260 - exit * 700}px)`, opacity: Math.min(1, inS * 1.5) }}>
      <div style={{
        background: C.creme, border: `8px solid ${C.tinta}`, borderRadius: 40, padding: "26px 150px 26px 30px", boxShadow: `0 10px 0 ${C.tinta}`,
        fontFamily: TITLE, fontSize: 60, lineHeight: 1.05, color: C.tinta, position: "relative",
      }}>
        {quiz.question}
        {timer && <div style={{ position: "absolute", right: 8, top: -30 }}><TimerRing {...timer} /></div>}
      </div>
      {quiz.options.map((opt, i) => {
        const ok = i === quiz.answer;
        const s = spring({ frame: since - 6 - i * 6, fps, config: { damping: 13 } });
        const shake = revealed && !ok ? Math.sin(revealT * 1.6) * interpolate(revealT, [0, 12], [14, 0], { extrapolateRight: "clamp" }) : 0;
        const lit = !revealed && reading === i;
        return (
          <div key={i} style={{
            marginTop: 22, minHeight: 104, display: "flex", alignItems: "center", gap: 18, padding: "10px 24px",
            borderRadius: 54, border: `7px solid ${C.tinta}`, boxShadow: `0 8px 0 ${C.tinta}`,
            background: revealed ? (ok ? C.certo : "#C9A9B6") : lit ? C.amarelo : "#fff",
            opacity: Math.min(1, s * 1.5),
            transform: `translateX(${(1 - s) * (i % 2 ? 300 : -300) + shake}px) scale(${revealed && ok ? 1.04 : lit ? 1.03 : 1})`,
          }}>
            <div style={{
              width: 62, height: 62, flex: "0 0 62px", borderRadius: 31, background: C.amarelo, border: `5px solid ${C.tinta}`,
              display: "flex", alignItems: "center", justifyContent: "center", fontFamily: TITLE, fontSize: 38, color: C.tinta,
            }}>{revealed ? (ok ? "✓" : "✗") : String.fromCharCode(65 + i)}</div>
            <div style={{ fontFamily: BODY, fontWeight: 800, fontSize: 44, lineHeight: 1.1, color: revealed ? "#fff" : C.tinta, ...(revealed ? { WebkitTextStroke: `2px ${C.tinta}` } : {}) }}>{opt}</div>
          </div>
        );
      })}
    </div>
  );
};

export const Particles: React.FC<{ since: number; x: number; y: number }> = ({ since, x, y }) => {
  if (since < 0 || since > 22) return null;
  return (
    <>
      {Array.from({ length: 16 }, (_, i) => {
        const a = (i / 16) * Math.PI * 2, d = since * 24;
        return <div key={i} style={{
          position: "absolute", left: x + Math.cos(a) * d, top: y + Math.sin(a) * d, width: 22, height: 22, borderRadius: 11,
          background: i % 2 ? C.amarelo : C.tangerina, border: `3px solid ${C.tinta}`, opacity: 1 - since / 22,
        }} />;
      })}
    </>
  );
};

// Cartão final colecionável: "Caderninho da Capi #00N" com o chunk do dia.
export const Notebook: React.FC<{ n: number; chunk: SitcomProps["chunk"]; since: number }> = ({ n, chunk, since }) => {
  const { fps } = useVideoConfig();
  const s = spring({ frame: since, fps, config: { damping: 13 } });
  const st = spring({ frame: since - 10, fps, config: { damping: 8, mass: 0.6 } });
  const num = `#${String(n).padStart(3, "0")}`;
  return (
    <div style={{ position: "absolute", left: SAFE.x0 + 20, width: SAFE.x1 - SAFE.x0 - 40, top: 300, transform: `translateY(${(1 - s) * 900}px) rotate(${(1 - s) * 8 - 1.5}deg)` }}>
      <div style={{
        background: C.creme, border: `8px solid ${C.tinta}`, borderRadius: 28, boxShadow: `0 12px 0 ${C.tinta}`, padding: "70px 40px 40px 90px", position: "relative",
        backgroundImage: `repeating-linear-gradient(transparent 0 58px, #C9B8F5 58px 62px)`, backgroundPosition: "0 40px",
      }}>
        {/* espiral */}
        <div style={{ position: "absolute", top: -26, left: 40, right: 40, display: "flex", justifyContent: "space-between" }}>
          {Array.from({ length: 9 }, (_, i) => <div key={i} style={{ width: 22, height: 52, borderRadius: 11, background: "#D9D4E8", border: `6px solid ${C.tinta}` }} />)}
        </div>
        <div style={{ position: "absolute", top: 0, bottom: 0, left: 62, width: 5, background: C.errado, opacity: 0.7 }} />
        <div style={{ fontFamily: TITLE, fontSize: 46, color: C.roxo }}>Caderninho da Capi</div>
        <div style={{ fontFamily: TITLE, fontSize: 76, lineHeight: 1.05, color: C.tinta, marginTop: 18 }}>{chunk.en}</div>
        <div style={{ fontFamily: BODY, fontWeight: 800, fontSize: 40, color: C.roxo, marginTop: 16 }}>{chunk.pt}</div>
        {chunk.pattern && (
          <div style={{ display: "inline-block", marginTop: 22, fontFamily: BODY, fontWeight: 800, fontSize: 36, color: C.tinta, background: C.amarelo, borderRadius: 14, padding: "6px 16px", border: `4px solid ${C.tinta}` }}>
            {chunk.pattern}
          </div>
        )}
        <div style={{
          position: "absolute", right: -20, top: -40, fontFamily: TITLE, fontSize: 64, color: C.errado, border: `8px solid ${C.errado}`, borderRadius: 20,
          padding: "0 18px", background: "rgba(255,244,224,0.9)", transform: `rotate(-12deg) scale(${interpolate(st, [0, 1], [2.4, 1])})`, opacity: Math.min(1, st * 2),
        }}>{num}</div>
      </div>
    </div>
  );
};

// ---- composição ----
export const Sitcom: React.FC<SitcomProps> = (p) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sched = schedule(p, fps);
  const cur = sched.find((s) => frame >= s.from && frame < s.from + s.dur) ?? sched[sched.length - 1];
  const beat = p.beats[cur.i];
  const lf = frame - cur.from; // frame local do beat
  const t = lf / fps;
  const dur = p.timings[cur.i].duration;
  const inAudio = t < dur;

  // estado emocional de cada personagem = último valor definido até o beat atual
  const emo: Record<CharId, Emotion> = { capi: "zen", hank: "bored", leo: "neutral" };
  let leoFrom = -1;
  p.beats.forEach((b, i) => {
    if (b.speaker === "leo" && leoFrom < 0) leoFrom = sched[i].from;
    if (i > cur.i) return;
    if (b.speaker !== "narrador" && b.emotion) emo[b.speaker] = b.emotion;
    if (b.react) Object.assign(emo, b.react);
  });
  const inTimer = cur.timerFrom >= 0 && frame >= cur.timerFrom;
  if (inTimer) emo.capi = "panic";

  // câmera: plano atual, com chicote (whip) vindo do plano anterior + leve push-in
  const target = shotFor(beat);
  const prev = cur.i > 0 ? shotFor(p.beats[cur.i - 1]) : target;
  const changed = prev.cx !== target.cx || prev.cy !== target.cy || prev.z !== target.z;
  const k = changed ? interpolate(lf, [0, WHIP], [0, 1], { extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) }) : 1;
  const push = 1 + 0.025 * Math.min(1, lf / (cur.dur || 1));
  const cam = clampCam({ cx: prev.cx + (target.cx - prev.cx) * k, cy: prev.cy + (target.cy - prev.cy) * k, z: (prev.z + (target.z - prev.z) * k) * push });
  const blur = changed ? Math.sin(k * Math.PI) * 6 : 0;

  // monólogo interno: tela roxa (forte no pânico), tremor de 2 px
  const thinking = beat.mode === "pensamento" || beat.quiz === "ask";
  const panic = thinking && (emo.capi === "panic" || inTimer);
  const overlay = thinking ? (panic || beat.quiz === "ask" ? 1 : 0.3) * (cur.i === 0 ? 1 : Math.min(1, lf / 4)) : 0;
  const tremor = panic ? [Math.sin(frame * 2.3) * 2, Math.cos(frame * 1.9) * 2] : [0, 0];

  // personagens
  const talking = (id: Speaker) => beat.speaker === id && beat.mode !== "pensamento" && inAudio;
  const leoRise = leoFrom < 0 ? 0 : interpolate(frame, [leoFrom - 4, leoFrom + 36], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.quad) });

  const place = (id: CharId, el: React.ReactNode, dy = 0) => (
    <div style={{ position: "absolute", left: STAGE[id].left, top: STAGE[id].top + dy }}>{el}</div>
  );
  const worldT = `translate(${540 + tremor[0]}px, ${960 + tremor[1]}px) scale(${cam.z}) translate(${-cam.cx}px, ${-cam.cy}px)`;
  const parallax = `translate(${(cam.cx - 540) * 0.12}px, ${(cam.cy - 960) * 0.08}px)`;

  // quiz
  const askIdx = p.beats.findIndex((b) => b.quiz === "ask");
  const revIdx = p.beats.findIndex((b) => b.quiz === "reveal");
  const quizOpen = p.quiz && askIdx >= 0 && cur.i >= askIdx && (beat.quiz === "ask" || cur.i === revIdx || (cur.i === revIdx + 1 && lf < 10));
  const revealFrame = revIdx >= 0 ? sched[revIdx].from : Infinity;
  const exit = cur.i === revIdx + 1 ? interpolate(lf, [0, 9], [0, 1], { easing: Easing.in(Easing.cubic), extrapolateRight: "clamp" }) : 0;

  // legenda
  const showCaption = beat.quiz !== "ask" && inAudio && !beat.card;
  const cap = captionChunk(beat.text, t, dur);
  const anchorId: CharId = beat.speaker === "narrador" ? "capi" : beat.speaker;
  const [ax, ay] = toScreen(cam, STAGE[anchorId].head[0] + (anchorId === "capi" && thinking ? 60 : 0), STAGE[anchorId].headTop);
  const firstChunkPop = cur.i === 0 ? 1 : spring({ frame: lf, fps, config: { damping: 12 } });

  const capiEl = (
    <Capi frame={frame} talking={talking("capi")} mood={CAPI_MOOD[emo.capi]} size={STAGE.capi.size}
      sweat={inTimer ? 3 : emo.capi === "panic" ? 2 : 0} armUp={beat.card} />
  );

  return (
    <AbsoluteFill style={{ background: C.noite, overflow: "hidden" }}>
      {/* áudio: falas + SFX */}
      {sched.map((s) => (
        <Sequence key={`a${s.i}`} from={s.from} durationInFrames={s.dur}>
          <Audio src={staticFile(p.timings[s.i].audio)} />
        </Sequence>
      ))}
      {sched.map((s) => {
        const b = p.beats[s.i];
        const out: React.ReactNode[] = [];
        const pb = s.i > 0 ? shotFor(p.beats[s.i - 1]) : null;
        const sb = shotFor(b);
        if (pb && (pb.cx !== sb.cx || pb.cy !== sb.cy || pb.z !== sb.z)) out.push(<Sfx key={`w${s.i}`} at={s.from} name="whoosh" vol={0.22} />);
        (b.sfx ?? []).forEach((n, j) => out.push(<Sfx key={`s${s.i}${j}`} at={s.from} name={n} vol={0.5} />));
        if (b.quiz === "ask" && s.i === askIdx) p.quiz?.options.forEach((_, j) => out.push(<Sfx key={`p${j}`} at={s.from + 6 + j * 6} name="pop" vol={0.3} />));
        if (s.timer) for (let j = 0; j < s.timer / fps; j++) out.push(<Sfx key={`t${j}`} at={s.timerFrom + j * fps} name={j === s.timer / fps - 1 ? "tick2" : "tick"} vol={0.6} />);
        if (b.quiz === "reveal" && s.i === revIdx) out.push(<Sfx key="ok" at={s.from} name="correct" vol={0.6} />);
        if (b.card) out.push(<Sfx key="st" at={s.from + 10} name="stamp" vol={0.55} />);
        if (b.speaker === "leo" && s.from === leoFrom) out.push(<Sfx key="leo" at={s.from} name="whoosh" vol={0.12} />);
        return <React.Fragment key={`f${s.i}`}>{out}</React.Fragment>;
      })}

      {/* mundo com câmera */}
      <AbsoluteFill style={{ transform: worldT, transformOrigin: "0 0", filter: blur > 0.3 ? `blur(${blur}px)` : undefined }}>
        <AbsoluteFill style={{ transform: parallax }}><CafeBack frame={frame} /></AbsoluteFill>
        {place("hank", <Hank frame={frame} talking={talking("hank")} emotion={emo.hank} size={STAGE.hank.size} />)}
        {leoFrom >= 0 && leoRise > 0 && place("leo", <Leo frame={frame} talking={talking("leo")} emotion={emo.leo} size={STAGE.leo.size} />, (1 - leoRise) * 440)}
        <CafeCounter frame={frame} />
        <ThoughtOverlay amount={overlay} frame={frame} />
        {place("capi", capiEl)}
      </AbsoluteFill>

      {/* interface (espaço de tela, zona segura) */}
      <DayBadge day={p.day} />
      {cur.i === 0 && p.hookTitle && (
        <div style={{ position: "absolute", left: SAFE.x0 + 30, width: SAFE.x1 - SAFE.x0 - 60, top: 318, transform: "rotate(-2deg)" }}>
          <div style={{
            background: C.creme, border: `8px solid ${C.tinta}`, borderRadius: 36, boxShadow: `0 10px 0 ${C.tinta}`, padding: "18px 26px",
            textAlign: "center", fontFamily: TITLE, fontSize: 84, lineHeight: 1.02, color: C.tinta,
          }}>{p.hookTitle}</div>
        </div>
      )}
      {quizOpen && p.quiz && (
        <QuizPanel quiz={p.quiz} since={frame - sched[askIdx].from + (askIdx === 0 ? 30 : 0)} revealT={frame - revealFrame} reading={beat.option}
          timer={inTimer ? { remaining: Math.max(0.01, (cur.timerFrom + cur.timer - frame) / fps), total: p.quiz.timerSeconds } : undefined} exit={exit} />
      )}
      {p.quiz && revIdx >= 0 && <Particles since={frame - revealFrame} x={500} y={620} />}
      {beat.card && <Notebook n={p.notebook} chunk={p.chunk} since={lf} />}
      {showCaption && (
        <Balloon anchor={[ax, ay]} words={cap.words} active={cap.active} thought={beat.mode === "pensamento"} lang={beat.lang} pop={firstChunkPop} />
      )}
      {beat.card && inAudio && (
        <Balloon anchor={toScreen(cam, STAGE.capi.head[0], STAGE.capi.headTop) as [number, number]} words={cap.words} active={cap.active} thought={false} lang={beat.lang} pop={1} />
      )}
    <Watermark />
    </AbsoluteFill>
  );
};
