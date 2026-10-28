import React, { useMemo } from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Capi, Mood } from "./Capi";
import { Bolinha } from "./chars/Bolinha";
import { Duda } from "./chars/Duda";
import { Hank } from "./chars/Hank";
import { Lazy } from "./chars/Lazy";
import { Poppy } from "./chars/Poppy";
import { Turista } from "./chars/Turista";
import { Emotion } from "./chars/common";
import { HOOK } from "./Licao";
import { AUDIT_BG, AuditCtx, useAudit } from "./lesson/audit";
import { MUSIC } from "./lesson/music";
import { ThoughtOverlay, VaporPuff } from "./sets/CafeSet";
import { CafeBackWide, CafeCounterWide } from "./sets/CafeSetWide";
import { CAPI_MOOD, Cam, Sfx } from "./Sitcom";
import { C } from "./theme";
import {
  Actor, CafeLine, CafeProps, CafeStep, HOOK_CUT, HOOK_INSERT, PERGUNTA_LEAD, STRIKE_DELAY, STRIKE_FRAMES,
  buildCafeSchedule, cafeMusicEnvelope, cafeTotal, firstAlvoIndex, highlightFor, isLine, isPausa, isPergunta, karaokeProgress,
  planShots, presenceK, presences, shotAt, stepAt,
} from "./cafe/timeline";
import { GEO_W, STAGE_W, clampW, toScreenW } from "./wide/geo";
import { CadernoW, CardTextoW, FraseHojeW, LegendaW, LembraW, MarcaW, PerguntaW, RepitaW, VideoCallW } from "./wide/ui";

export { cafeFrames as cafeWideFrames } from "./cafe/timeline";

// SITCOM DO CAFÉ em tela cheia 16:9 (YouTube longo, decisão do Felipe 28/10). Guiada pelo MESMO JSON e pela MESMA
// agenda (src/cafe/timeline.ts): mesmos tempos, mesma voz em cache, mesmo karaokê (±0 quadro em relação ao vertical),
// mesma trilha com ducking. O que muda: cenário redesenhado em largura (src/sets/CafeSetWide.tsx), elenco lado a lado,
// câmera com a geometria horizontal (src/wide/geo.ts) e legenda de programa no terço de baixo (src/wide/ui.tsx).
// Flags: corteDe (frame em que começa o trecho, para o corte), semAudio/semTrilha, auditoria (só interface, portão).
export type CafeWideProps = CafeProps & { auditoria?: boolean; corteDe?: number; semAudio?: boolean; semTrilha?: boolean; semMarca?: boolean };

const MOODS: Mood[] = ["zen", "thinking", "sweat", "shock", "happy", "fail"];
const capiMood = (e: string): Mood => (MOODS.includes(e as Mood) ? (e as Mood) : CAPI_MOOD[e as Emotion] ?? "zen");
const EMO_OK: Emotion[] = ["neutral", "zen", "bored", "angry", "eyebrow", "surprised", "panic", "happy", "smile", "whisper"];
const asEmotion = (e: string | undefined, fb: Emotion): Emotion => (e && EMO_OK.includes(e as Emotion) ? (e as Emotion) : fb);

export const CafeWide: React.FC<CafeWideProps> = (p) => (
  <AuditCtx.Provider value={!!p.auditoria}><CafeWideInner {...p} /></AuditCtx.Provider>
);

const CafeWideInner: React.FC<CafeWideProps> = (p) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const audit = useAudit();
  const steps = useMemo(() => buildCafeSchedule(p, fps), [p, fps]);
  const total = cafeTotal(steps);
  const h0 = p.corteDe ?? 0;
  const shots = useMemo(() => planShots(steps, h0, GEO_W), [steps, h0]);
  const pres = useMemo(() => presences(steps), [steps]);
  const music = useMemo(() => cafeMusicEnvelope(steps, total, p.voiceLufs), [steps, total, p.voiceLufs]);
  const firstAlvo = firstAlvoIndex(p);
  const cur = stepAt(steps, frame);
  const lf = frame - cur.from;
  const beat = cur.beat;
  const line = isLine(beat) ? beat : null;

  const emo: Record<Actor, string> = { capi: "zen", hank: "bored", lazy: "neutral", duda: "neutral", poppy: "neutral", bolinha: "neutral", donajaca: "neutral", turista: "neutral" };
  steps.forEach((s) => {
    if (s.i > cur.i) return;
    const b = s.beat;
    if (isLine(b) && b.speaker !== "narrador" && b.emotion) emo[b.speaker as Actor] = b.emotion;
    if ((isLine(b) || isPausa(b)) && b.react) Object.assign(emo, b.react);
  });
  if (isPergunta(beat)) emo.capi = "thinking";

  // ---- câmera (mesmo plano de cortes do vertical, geometria larga) ----
  const shot = shotAt(shots, frame);
  let cam: Cam;
  let tremor = 0;
  if (shot.hook === "a") {
    cam = clampW({ ...shot.cam, z: shot.cam.z * HOOK.zoom * (1 + (0.06 * (frame - shot.from)) / HOOK_CUT) });
  } else if (shot.hook === "b") {
    cam = clampW({ ...shot.cam, z: shot.cam.z * HOOK.punch * (1 + (0.06 * (frame - shot.from)) / HOOK_INSERT) });
    tremor = 3;
    const who = shot.subjects !== "wide" ? shot.subjects[0] : "hank";
    if (who === "hank" && ["bored", "neutral", "zen", "smile"].includes(emo.hank)) emo.hank = "eyebrow";
    if (who === "capi") emo.capi = "panic";
  } else {
    const k = Math.min(1, (frame - shot.from) / Math.max(1, shot.to - shot.from));
    cam = clampW({ ...shot.cam, z: shot.cam.z * (1 + 0.02 * k) });
  }

  const sec = lf / fps;
  const inAudio = !!line && lf < cur.audioFrames;
  const inPart = inAudio && (cur.timing?.parts?.length ? cur.timing.parts.some((pt) => sec >= pt.start - 0.03 && sec <= pt.end + 0.03) : true);
  const talking = (id: Actor) => !!line && line.speaker === id && line.mode !== "pensamento" && inPart;
  const thinking = !!line && line.mode === "pensamento";
  const overlay = thinking ? (emo.capi === "panic" ? 1 : 0.32) * Math.min(1, lf / 5 + (frame === h0 ? 1 : 0)) : 0;

  const kIn = (id: Actor) => presenceK(pres[id], frame);
  const bolStep = steps.find((s) => isLine(s.beat) && (s.beat.speaker === "bolinha" || s.beat.bolinha));
  const bolLines = steps.filter((s) => isLine(s.beat) && s.beat.speaker === "bolinha");
  let cheeks = 1;
  if (bolLines.length) {
    const a = bolLines[0], b = bolLines[1];
    cheeks = interpolate(frame, [a.from, a.from + a.audioFrames], [1, 0.3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    if (b) cheeks = frame < b.from ? cheeks : interpolate(frame, [b.from, b.from + b.audioFrames], [0.3, 0.85], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  }

  const tr = tremor ? [Math.sin(frame * 2.3) * tremor, Math.cos(frame * 1.9) * tremor] : [0, 0];
  const worldT = `translate(${960 + tr[0]}px, ${540 + tr[1]}px) scale(${cam.z}) translate(${-cam.cx}px, ${-cam.cy}px)`;
  const parallax = `translate(${(cam.cx - 960) * 0.1}px, ${(cam.cy - 540) * 0.06}px)`;
  const place = (id: Exclude<Actor, "donajaca">, el: React.ReactNode, transform = "") => (
    <div style={{ position: "absolute", left: STAGE_W[id].left, top: STAGE_W[id].top, transform }}>{el}</div>
  );
  const cardStep = steps.find((s) => isLine(s.beat) && s.beat.card);
  const onCard = !!cardStep && frame >= cardStep.from;
  const lazyK = kIn("lazy"), dudaK = kIn("duda"), poppyK = kIn("poppy"), bolK = kIn("bolinha"), jacaK = kIn("donajaca"), turistaK = kIn("turista");
  const world = audit ? null : (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: worldT, transformOrigin: "0 0" }}>
        <AbsoluteFill style={{ transform: parallax }}><CafeBackWide frame={0} /></AbsoluteFill>
        {place("hank", <Hank frame={frame} talking={talking("hank")} emotion={asEmotion(emo.hank, "bored")} size={STAGE_W.hank.size} />)}
        {lazyK > 0 && place("lazy", <Lazy frame={frame} talking={talking("lazy")} emotion={asEmotion(emo.lazy, "neutral")} size={STAGE_W.lazy.size} />, `translateY(${(1 - lazyK) * 420}px)`)}
        <CafeCounterWide frame={0} />
        {bolK > 0 && place("bolinha", <Bolinha frame={frame} talking={talking("bolinha")} emotion={asEmotion(emo.bolinha, "neutral")} size={STAGE_W.bolinha.size} cheeks={cheeks} />,
          `translateY(${(1 - bolK) * 60}px) scale(${0.4 + 0.6 * bolK})`)}
        <ThoughtOverlay amount={overlay} frame={frame} />
        {dudaK > 0 && place("duda", <Duda frame={frame} talking={talking("duda")} emotion={asEmotion(emo.duda, "neutral")} size={STAGE_W.duda.size} />, `translateX(${(1 - dudaK) * 700}px)`)}
        {poppyK > 0 && place("poppy", <Poppy frame={frame} talking={talking("poppy")} emotion={asEmotion(emo.poppy, "neutral")} size={STAGE_W.poppy.size} />, `translateX(${(1 - poppyK) * 700}px)`)}
        {turistaK > 0 && place("turista", <Turista frame={frame} talking={talking("turista")} emotion={asEmotion(emo.turista, "neutral")} size={STAGE_W.turista.size} />, `translateX(${(1 - turistaK) * 700}px)`)}
        {place("capi", <Capi frame={frame} talking={talking("capi")} mood={capiMood(emo.capi)} size={STAGE_W.capi.size}
          sweat={emo.capi === "panic" || emo.capi === "sweat" ? 2 : 0} armUp={onCard} />)}
      </AbsoluteFill>
    </AbsoluteFill>
  );

  // ---- legenda (fala + reação muda logo depois dela) ----
  const capStep: CafeStep | null = line ? cur : isPausa(beat) && cur.i > 0 && isLine(steps[cur.i - 1].beat) ? steps[cur.i - 1] : null;
  const inShadow = cur.shadowFrom >= 0 && frame >= cur.shadowFrom;
  let caption: React.ReactNode = null;
  if (capStep && !inShadow) {
    const b = capStep.beat as CafeLine;
    const t = (frame - capStep.from) / fps;
    const first = capStep.i === firstAlvo;
    const strikeStart = capStep.from + capStep.audioFrames + STRIKE_DELAY;
    caption = (
      <LegendaW speaker={b.speaker} text={b.text} lang={b.lang} progress={karaokeProgress(b.text, capStep.timing ?? null, t)} thought={b.mode === "pensamento"}
        pop={frame === h0 || capStep.from < h0 ? 1 : spring({ frame: frame - capStep.from, fps, config: { damping: 14 } })}
        highlight={highlightFor(p, b)} big={b.alvo === true} sub={first ? p.alvo.pt : undefined}
        subOpacity={interpolate(frame - capStep.from, [12, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
        strike={b.errado ? interpolate(frame, [strikeStart, strikeStart + STRIKE_FRAMES], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0} />
    );
  }

  let block: React.ReactNode = null;
  if (isPergunta(beat)) {
    const qFrom = cur.from + PERGUNTA_LEAD, qTo = qFrom + cur.quietFrames;
    block = <PerguntaW text={beat.text} since={lf} fps={fps} remaining={Math.max(0.01, (qTo - Math.max(frame, qFrom)) / fps)} total={beat.s}
      counting={frame >= qFrom} out={interpolate(frame, [qTo, cur.from + cur.dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />;
  } else if (line?.repita && inShadow) {
    const end = cur.shadowFrom + cur.shadowFrames;
    block = <RepitaW text={line.text} highlight={highlightFor(p, line)} since={frame - cur.shadowFrom} fps={fps} frame={frame}
      remaining={Math.max(0.01, (end - frame) / fps)} total={cur.shadowFrames / fps}
      out={interpolate(frame, [end, cur.from + cur.dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />;
  }

  const sfx: React.ReactNode[] = [];
  steps.forEach((s) => {
    (isLine(s.beat) ? s.beat.sfx ?? [] : []).forEach((n, j) => sfx.push(<Sfx key={`s${s.i}-${j}`} at={s.from} name={n} vol={0.4} />));
    if (isPergunta(s.beat)) for (let j = 0; j < Math.round(s.quietFrames / fps); j++) sfx.push(<Sfx key={`t${s.i}-${j}`} at={s.from + PERGUNTA_LEAD + j * fps} name="tick" vol={0.22} />);
    if (s.shadowFrom >= 0) sfx.push(<Sfx key={`mic${s.i}`} at={s.shadowFrom} name="pop" vol={0.3} />);
  });
  if (cardStep) sfx.push(<Sfx key="stamp" at={cardStep.from + 10} name="stamp" vol={0.45} />);
  if (pres.bolinha) sfx.push(<Sfx key="bol" at={pres.bolinha.in + 4} name="pop" vol={0.35} />);
  if (pres.donajaca) sfx.push(<Sfx key="jaca" at={pres.donajaca.in} name="pop" vol={0.3} />);

  let vapor: React.ReactNode = null;
  if (line?.vapor && lf >= 0 && lf < Math.max(24, cur.audioFrames)) {
    const vid = (line.speaker === "narrador" ? "capi" : line.speaker) as Exclude<Actor, "donajaca">;
    const vst = STAGE_W[vid];
    const [vx, vy] = toScreenW(cam, vst.head[0] + 46 * (vst.size / 520), vst.headTop + 70);
    vapor = <VaporPuff x={vx} y={vy} frame={frame} since={lf} />;
  }

  const bolHead = toScreenW(cam, STAGE_W.bolinha.head[0], STAGE_W.bolinha.headTop);
  const lembra = !!bolStep && (p.serie?.episodio ?? 1) > 1 && cur === bolStep;
  const cardTexto = cardStep && (cardStep.beat as CafeLine).cardTexto;
  const alvoStep = firstAlvo >= 0 ? steps[firstAlvo] : null;
  const fraseOn = !!alvoStep && frame >= alvoStep.from + alvoStep.dur && !block && !onCard && jacaK <= 0;

  return (
    <AbsoluteFill style={{ background: p.auditoria ? AUDIT_BG : C.noite, overflow: "hidden" }}>
      {!p.semAudio && steps.filter((s) => s.audio).map((s) => (
        <Sequence key={`a${s.i}`} from={s.from} durationInFrames={s.audioFrames + 2}>
          <Audio src={staticFile(s.audio!)} />
        </Sequence>
      ))}
      {!p.semAudio && sfx}
      {!p.semAudio && !p.semTrilha && Array.from({ length: Math.ceil(total / MUSIC.loopFrames) }, (_, k) => (
        <Sequence key={`m${k}`} from={k * MUSIC.loopFrames} durationInFrames={MUSIC.loopFrames}>
          <Audio src={staticFile(MUSIC.src)} volume={(f) => music[Math.min(total - 1, k * MUSIC.loopFrames + f)] ?? 0} />
        </Sequence>
      ))}

      {world}
      <VideoCallW k={jacaK} frame={frame} talking={talking("donajaca")} emotion={asEmotion(emo.donajaca, "neutral")} />
      {fraseOn && <FraseHojeW en={p.alvo.en} pt={p.alvo.pt} since={frame - alvoStep!.from - alvoStep!.dur} fps={fps} />}
      {onCard && cardStep && <CadernoW n={p.notebook ?? 1} en={p.alvo.en} pt={p.alvo.pt} pattern={p.alvo.nucleo ? `${p.alvo.nucleo} ...` : undefined} since={frame - cardStep.from} fps={fps} />}
      {onCard && cardTexto && <CardTextoW text={cardTexto} since={frame - cardStep!.from - 14} fps={fps} />}
      {lembra && <LembraW x={bolHead[0]} y={bolHead[1]} since={lf} fps={fps} />}
      {block}
      {!block && caption}
      {!block && vapor}
      {!p.semMarca && <MarcaW codigo={p.serie?.codigo} progresso={p.serie?.progresso} />}
    </AbsoluteFill>
  );
};
