import React, { useMemo } from "react";
import { Watermark } from "./Watermark";
import { AbsoluteFill, Audio, Easing, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Capi, Mood } from "./Capi";
import { Emotion } from "./chars/common";
import { CafeStage, WHIP, camLerp } from "./lesson/CafeStage";
import { Caption } from "./lesson/Caption";
import {
  CompleteBanner, ExChip, L, LessonBg, ListenPanel, MicPanel, Options, PromptCard, TileBoard, Timer, TopBar, XpPop,
} from "./lesson/LessonUI";
import {
  Exercicio, LIGAR_STAG, Line, LicaoProps, Pause, Step, buildSchedule, exerciseMarks, isLine, phaseBounds,
} from "./lesson/timeline";
import { Cam, CharId, DayBadge, Notebook, STAGE, Sfx, TWO, closeOn, toScreen } from "./Sitcom";
import { BODY, C, SAFE, TITLE } from "./theme";
import { STAG } from "./lesson/LessonUI";
import { CardsBoard, COMPLETAR_CARD_H, GapSentence, MatchBoard, ReviewBoard, SeriesSeal, ligarDone } from "./lesson/ExerciseBoards";
import { MUSIC, musicEnvelope } from "./lesson/music";

export type { LicaoProps } from "./lesson/timeline";
// Flags de render (usadas pela faixa ESQUETE, src/LicaoEsquete.tsx): o corte reaproveita este componente.
// corteDe = frame em que a esquete começa: o plano desse passo entra já pronto (sem chicote de câmera no frame 0).
export type LicaoRenderProps = LicaoProps & { semAudio?: boolean; semTrilha?: boolean; semGancho?: boolean; corteDe?: number };
export { licaoFrames } from "./lesson/timeline";

// "LIÇÃO EM VÍDEO" (CapyFala): CENA (a Capy erra e desmaia) → LIÇÃO (4 exercícios de app, com pausa real
// para o espectador pensar) → VOLTA (a Capy acerta no balcão) + Caderninho + CTA.
// Ritmo calmo (feedback do piloto), mas algo muda na tela a cada 2–3 s (reações, micro-animações, SFX).

const MOOD: Record<Emotion, Mood> = {
  neutral: "zen", zen: "zen", bored: "zen", angry: "thinking", eyebrow: "thinking", surprised: "shock",
  panic: "sweat", happy: "happy", smile: "happy", whisper: "thinking",
};
const FLY = (n: number) => n * STAG + 20; // frames do voo dos blocos (montar)

// Só capi/hank/lazy têm lugar no palco do café; outros falantes (narrador, elenco novo) usam o plano aberto.
export const onStage = (sp: string): sp is CharId => sp in STAGE;
export const shotFor = (s: Step): Cam => {
  const p = s.passo;
  if (!isLine(p)) return TWO;
  if (p.card || p.shot === "two" || !onStage(p.speaker)) return TWO;
  return closeOn(p.speaker);
};

export const Licao: React.FC<LicaoRenderProps> = (p) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const steps = useMemo(() => buildSchedule(p, fps), [p, fps]);
  const musicVol = useMemo(() => musicEnvelope(steps, durationInFrames, p.voiceLufs), [steps, durationInFrames, p.voiceLufs]);
  const exs = p.licao.exercicios;
  const marks = useMemo(() => exerciseMarks(steps, exs.length), [steps, exs.length]);
  const bounds = phaseBounds(steps);
  const cur = steps.find((s) => frame >= s.from && frame < s.from + s.dur) ?? steps[steps.length - 1];
  const line = isLine(cur.passo) ? (cur.passo as Line) : null;
  const inAudio = !!line && frame >= cur.start && frame < cur.start + cur.audioFrames;
  const talking = inAudio && line!.mode !== "pensamento" && onStage(line!.speaker) ? line!.speaker : null;

  // ---- estado emocional acumulado ----
  const emo: Record<CharId, Emotion> = { capi: "zen", hank: "bored", lazy: "neutral" };
  let capiEmoFrom = 0;
  steps.forEach((s) => {
    if (s.i > cur.i || !isLine(s.passo)) return;
    const l = s.passo;
    if (l.speaker !== "narrador" && l.emotion) {
      if (l.speaker === "capi" && l.emotion !== emo.capi) capiEmoFrom = s.start;
      emo[l.speaker] = l.emotion;
    }
    if (l.react) Object.assign(emo, l.react);
  });

  // ---- XP, corações, progresso (por exercício) ----
  const exInfo = exs.map((e, ei) => {
    const m = marks[ei];
    const own = steps.filter((s) => s.ex === ei);
    const wrong = e.chute !== undefined && e.chute !== e.resposta;
    const lembra = own.filter((s) => isLine(s.passo) && (s.passo as Line).evento === "lembra");
    const doneAt =
      e.tipo === "montar" ? m.reveal + FLY(e.ordem?.length ?? 0)
      : e.tipo === "repetir" ? own[own.length - 1].start
      : e.tipo === "ligar" ? m.reveal + ligarDone(e.pares?.length ?? 1)
      : e.tipo === "revisao" && lembra.length ? lembra[lembra.length - 1].start + 12
      : m.reveal;
    return { m, wrong, doneAt, xp: wrong ? 0 : e.xp ?? 10 };
  });
  const XP_LAND = 38; // o "+10 XP" voa até o contador; o número sobe quando chega
  const xp = exInfo.reduce((s, x) => s + (frame >= x.doneAt + XP_LAND ? x.xp : 0), 0);
  const xpTotal = exInfo.reduce((s, x) => s + x.xp, 0);
  const lastXp = exInfo.filter((x) => x.xp && frame >= x.doneAt + XP_LAND).pop();
  const heartsLostAt: number[] = [];
  exInfo.filter((x) => x.wrong).forEach((x, k) => { heartsLostAt[2 - k] = x.m.reveal + 10; });
  const progress = exInfo.reduce((s, x) => s + interpolate(frame, [x.doneAt, x.doneAt + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), 0) / exs.length;

  // ---- transições de bloco ----
  const T = Math.round(0.6 * fps);
  const lessonIn = spring({ frame: frame - bounds.licao.from, fps, config: { damping: 16, mass: 0.8 }, durationInFrames: T });
  // esquete cortada na volta: começa com a lição já fora da tela (nada de painel saindo no frame 0)
  const lessonOut = p.corteDe !== undefined && p.corteDe >= bounds.volta.from ? 1 : interpolate(frame, [bounds.volta.from, bounds.volta.from + T - 2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic) });
  const showLesson = frame >= bounds.licao.from && lessonOut < 1;
  const showCafe = cur.phase !== "licao" || lessonIn < 0.999 || lessonOut > 0;

  // ---- câmera do café ----
  const cafeSteps = steps.filter((s) => s.phase !== "licao");
  const cafeCur = cur.phase === "licao" ? (frame < bounds.licao.from + T ? cafeSteps.filter((s) => s.phase === "cena").pop()! : cafeSteps.find((s) => s.phase === "volta")!) : cur;
  const ci = cafeSteps.indexOf(cafeCur);
  const target = shotFor(cafeCur);
  const cutHere = p.corteDe !== undefined && cafeCur.from <= p.corteDe && p.corteDe < cafeCur.from + cafeCur.dur;
  const prevStep = ci > 0 && cafeSteps[ci - 1].phase === cafeCur.phase && !cutHere ? cafeSteps[ci - 1] : null;
  const prev = prevStep ? shotFor(prevStep) : target;
  const lf = frame - cafeCur.from;
  const changed = prev.cx !== target.cx || prev.cy !== target.cy || prev.z !== target.z;
  const k = changed ? interpolate(lf, [0, WHIP], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) }) : 1;
  const push = 1 + 0.018 * Math.min(1, Math.max(0, lf) / (cafeCur.dur || 1));
  const cam = camLerp(prev, target, k, push);
  const blur = changed ? Math.sin(k * Math.PI) * 5 : 0;
  const faint = steps.find((s) => !isLine(s.passo) && (s.passo as Pause).evento === "desmaio");
  const faintT = faint && frame >= faint.start && frame < bounds.cena.to + T ? frame - faint.start : -1;
  const cafeLine = isLine(cafeCur.passo) ? (cafeCur.passo as Line) : null;
  const thinking = !!cafeLine && cafeLine.mode === "pensamento";
  const panic = thinking && emo.capi === "panic";
  const overlay = thinking && cur === cafeCur ? (panic ? 1 : 0.32) * Math.min(1, (frame - cafeCur.from) / 5 + (cafeCur.i === 0 ? 1 : 0)) : 0;
  const hopFrom = emo.capi === "happy" || emo.capi === "smile" ? capiEmoFrom : -999;
  const hop = frame - hopFrom >= 0 && frame - hopFrom < 16 ? Math.sin(((frame - hopFrom) / 16) * Math.PI) : 0;

  // ---- exercício atual ----
  const exNow = cur.phase === "licao" ? cur.ex : cur.phase === "volta" ? exs.length - 1 : 0;

  const renderEx = (ei: number) => {
    const e: Exercicio = exs[ei];
    const m = marks[ei];
    const since = frame - m.start;
    const revealT = frame >= m.reveal ? frame - m.reveal : -1;
    const inTimer = m.timerFrom >= 0 && frame >= m.timerFrom && frame < m.reveal;
    const header = <ExChip text={e.titulo} n={ei + 1} total={exs.length} />;
    const timer = inTimer && m.kind === "timer" ? (
      <Timer remaining={Math.max(0.01, (m.reveal - frame) / fps)} total={m.timerFrames / fps} since={frame - m.timerFrom} fps={fps} />
    ) : null;
    const ownSteps = steps.filter((s) => s.ex === ei);
    const playingLine = ownSteps.find((s) => isLine(s.passo) && frame >= s.start && frame < s.start + s.audioFrames);
    if (e.tipo === "traducao") {
      return (
        <>
          {header}
          <PromptCard tag="TRADUZA PRO INGLÊS:">
            <div style={{ fontFamily: TITLE, fontSize: 64, lineHeight: 1.06, color: C.tinta }}>{e.enunciado}</div>
          </PromptCard>
          <Options options={e.opcoes!} answer={e.resposta!} since={since} revealT={revealT} fps={fps} frame={frame} />
          {timer}
        </>
      );
    }
    if (e.tipo === "montar") {
      const fly = FLY(e.ordem!.length);
      return (
        <>
          {header}
          <PromptCard tag="MONTE EM INGLÊS:">
            <div style={{ fontFamily: TITLE, fontSize: 60, lineHeight: 1.06, color: C.tinta }}>{e.enunciado}</div>
          </PromptCard>
          <TileBoard tiles={e.tiles!} order={e.ordem!} since={since} flyT={revealT} revealT={revealT >= fly ? revealT - fly : -1} fps={fps} frame={frame} />
          {timer}
        </>
      );
    }
    if (e.tipo === "ouvir") {
      const som = ownSteps.filter((s) => isLine(s.passo) && (s.passo as Line).evento === "som");
      const playing = playingLine && som.includes(playingLine) ? (som.indexOf(playingLine) === 0 ? "devagar" : "normal") : null;
      const chuteT = m.timerFrom >= 0 ? frame - (m.timerFrom + Math.round(1.3 * fps)) : -1;
      return (
        <>
          {header}
          <ListenPanel since={since} fps={fps} frame={frame} playing={playing} />
          <Options options={e.opcoes!} answer={e.resposta!} since={since} revealT={revealT} fps={fps} frame={frame} top={L.optY + 20} chute={e.chute} chuteT={chuteT} />
          {timer}
        </>
      );
    }
    if (e.tipo === "cartoes") {
      const cart = ownSteps.filter((s) => isLine(s.passo) && (s.passo as Line).evento === "cartao" && frame >= s.start);
      const curCard = cart[cart.length - 1];
      const inHold = !!curCard && frame >= curCard.start + curCard.audioFrames && curCard === ownSteps.find((s) => frame >= s.from && frame < s.from + s.dur);
      return (
        <>
          {header}
          <CardsBoard cards={e.cartoes!} active={curCard ? (curCard.passo as Line).alvo ?? 0 : -1} activeSince={curCard ? frame - curCard.start : 0} since={since}
            repita={!!e.repita} repitaOn={inHold} repitaT={curCard ? frame - (curCard.start + curCard.audioFrames) : 0} frame={frame} fps={fps} />
        </>
      );
    }
    if (e.tipo === "ligar") {
      return (
        <>
          {header}
          <MatchBoard pares={e.pares!} direita={e.direita!} since={since} revealT={revealT} frame={frame} fps={fps} />
          {timer}
        </>
      );
    }
    if (e.tipo === "completar") {
      const chuteT = m.timerFrom >= 0 ? frame - (m.timerFrom + Math.round(1.3 * fps)) : -1;
      return (
        <>
          {header}
          <PromptCard tag="SITUAÇÃO:" minH={COMPLETAR_CARD_H}>
            {e.enunciado && <div style={{ fontFamily: BODY, fontWeight: 800, fontSize: 38, lineHeight: 1.12, color: C.tinta }}>{e.enunciado}</div>}
            <GapSentence frase={e.frase!} lacuna={e.lacuna ?? "___"} answer={e.opcoes![e.resposta!]} revealT={revealT} fps={fps} frame={frame} />
          </PromptCard>
          <Options options={e.opcoes!} answer={e.resposta!} since={since} revealT={revealT} fps={fps} frame={frame} top={L.cardY + COMPLETAR_CARD_H + 34} chute={e.chute} chuteT={chuteT} />
          {timer}
        </>
      );
    }
    if (e.tipo === "revisao") {
      const revealedAt = e.itens!.map((_, i) => {
        const s = ownSteps.find((x) => isLine(x.passo) && (x.passo as Line).evento === "lembra" && (x.passo as Line).alvo === i);
        return s ? s.start : -1;
      });
      return (
        <>
          {header}
          <ReviewBoard itens={e.itens!} since={since} revealedAt={revealedAt} timerOn={inTimer} frame={frame} fps={fps} />
          {timer}
        </>
      );
    }
    if (e.tipo !== "repetir") throw new Error(`exercício ${ei + 1}: tipo "${e.tipo}" sem renderer em src/Licao.tsx`);
    // repetir
    const modelo = ownSteps.filter((s) => isLine(s.passo) && (s.passo as Line).evento === "modelo");
    const cm = playingLine && modelo.includes(playingLine) ? playingLine : null;
    const words = (e.frase ?? "").split(" ");
    const act = cm ? Math.floor(((frame - cm.start) / cm.audioFrames) * words.length) : -1;
    const done = frame >= exInfo[ei].doneAt;
    return (
      <>
        {header}
        <PromptCard tag={cm ? (modelo.indexOf(cm) === 0 ? "OUÇA DEVAGAR:" : "AGORA NO RITMO NORMAL:") : "REPITA:"}>
          <div style={{ fontFamily: TITLE, fontSize: 70, lineHeight: 1.06, color: C.tinta }}>
            {words.map((w, i) => <span key={i} style={{ color: i === act ? C.tangerina : i < act ? C.roxo : C.tinta }}>{w}{i < words.length - 1 ? " " : ""}</span>)}
          </div>
        </PromptCard>
        {!done && <MicPanel frame={frame} fps={fps} since={since - 6} micT={frame - m.timerFrom} micFrames={m.timerFrames} active={inTimer} after={frame >= m.reveal} />}
      </>
    );
  };

  const slide = (ei: number) => {
    const m = marks[ei];
    const kin = ei === 0 ? 1 : spring({ frame: frame - m.start, fps, config: { damping: 16 }, durationInFrames: 16 });
    return kin;
  };

  // ---- capi da lição ----
  let capiLessonMood: Mood = MOOD[emo.capi];
  if (cur.phase === "licao") {
    const m = marks[exNow];
    const e = exs[exNow];
    if (m.timerFrom >= 0 && frame >= m.timerFrom && frame < m.reveal) capiLessonMood = e.chute !== undefined ? "happy" : m.kind === "mic" ? "happy" : "thinking";
    if (exInfo[exNow].wrong && frame >= m.reveal && frame < m.reveal + 40) capiLessonMood = "shock";
  }
  const micOn = cur.phase === "licao" && marks[exNow].kind === "mic" && frame >= marks[exNow].timerFrom && frame < marks[exNow].reveal;
  const capiBob = Math.sin(frame / 14) * 4;

  // ---- legenda ----
  const lineProgress = line ? (frame - cur.start) / Math.max(1, cur.audioFrames) : 0;
  const capPop = line ? spring({ frame: frame - cur.start, fps, config: { damping: 14 } }) : 0;
  let caption: React.ReactNode = null;
  if (line && frame >= cur.start) {
    if (cur.phase === "licao") {
      caption = <Caption anchor={L.capiMouth} side="right" maxW={SAFE.x1 - L.capiMouth[0] - 34} fontSize={50} text={line.text} lang={line.lang} progress={lineProgress} pop={capPop}
        bars={line.evento === "som" ? frame : undefined} />;
    } else {
      const id: CharId = onStage(line.speaker) ? line.speaker : "capi";
      const [ax, ay] = toScreen(cam, STAGE[id].head[0] + (id === "capi" && thinking ? 60 : 0), STAGE[id].headTop);
      caption = <Caption anchor={[ax, ay]} text={line.text} lang={line.lang} progress={lineProgress} thought={line.mode === "pensamento"} pop={cur.i === 0 ? 1 : capPop} />;
    }
  }

  // ---- áudio ----
  const sfx: React.ReactNode[] = [];
  steps.forEach((s) => {
    const ps = s.passo;
    (ps.sfx ?? []).forEach((n, j) => sfx.push(<Sfx key={`s${s.i}-${j}`} at={s.start + (n === "thud" ? 20 : 0)} name={n} vol={n === "thud" ? 0.9 : 0.5} />));
    if (isLine(ps) && ps.card) sfx.push(<Sfx key={`st${s.i}`} at={s.from + 10} name="stamp" vol={0.55} />);
  });
  cafeSteps.forEach((s, j) => {
    const pv = j > 0 && cafeSteps[j - 1].phase === s.phase ? shotFor(cafeSteps[j - 1]) : null;
    const sb = shotFor(s);
    if (pv && (pv.cx !== sb.cx || pv.cy !== sb.cy || pv.z !== sb.z)) sfx.push(<Sfx key={`w${s.i}`} at={s.from} name="whoosh" vol={0.16} />);
  });
  sfx.push(<Sfx key="tin" at={bounds.licao.from} name="whoosh" vol={0.35} />);
  sfx.push(<Sfx key="tout" at={bounds.volta.from} name="whoosh" vol={0.35} />);
  exs.forEach((e, ei) => {
    const m = marks[ei];
    if (ei > 0) sfx.push(<Sfx key={`ew${ei}`} at={m.start} name="whoosh" vol={0.18} />);
    (e.opcoes ?? []).forEach((_, j) => sfx.push(<Sfx key={`op${ei}-${j}`} at={m.start + 8 + j * 7} name="pop" vol={0.22} />));
    if (m.kind === "timer") {
      const n = Math.round(m.timerFrames / fps);
      for (let j = 0; j < n; j++) sfx.push(<Sfx key={`t${ei}-${j}`} at={m.timerFrom + j * fps} name={j === n - 1 ? "tick2" : "tick"} vol={0.5} />);
    }
    if (m.kind === "mic") sfx.push(<Sfx key={`mic${ei}`} at={m.timerFrom} name="pop" vol={0.4} />);
    if (e.tipo === "montar") e.ordem!.forEach((_, j) => sfx.push(<Sfx key={`fl${ei}-${j}`} at={m.reveal + j * STAG + 8} name="pop" vol={0.3} />));
    if (e.tipo === "ligar") e.pares!.forEach((_, j) => sfx.push(<Sfx key={`lg${ei}-${j}`} at={m.reveal + Math.round(j * LIGAR_STAG) + 2} name="pop" vol={0.32} />));
    if (e.tipo === "cartoes") steps.filter((s) => s.ex === ei && isLine(s.passo) && (s.passo as Line).evento === "cartao")
      .forEach((s) => sfx.push(<Sfx key={`ct${s.i}`} at={s.start} name="whoosh" vol={0.14} />));
    if (e.tipo === "revisao") {
      e.itens!.forEach((_, j) => sfx.push(<Sfx key={`rv${ei}-${j}`} at={m.start + 14 + j * 6} name="pop" vol={0.2} />));
      steps.filter((s) => s.ex === ei && isLine(s.passo) && (s.passo as Line).evento === "lembra").forEach((s) => sfx.push(<Sfx key={`lb${s.i}`} at={s.start} name="pop" vol={0.4} />));
    }
    if (e.tipo !== "repetir" && e.tipo !== "cartoes") sfx.push(<Sfx key={`ok${ei}`} at={e.tipo === "montar" || e.tipo === "ligar" || e.tipo === "revisao" ? exInfo[ei].doneAt : m.reveal} name="correct" vol={0.5} />);
    if (e.chute !== undefined) sfx.push(<Sfx key={`ch${ei}`} at={m.timerFrom + Math.round(1.3 * fps)} name="pop" vol={0.4} />);
    if (exInfo[ei].wrong) sfx.push(<Sfx key={`hb${ei}`} at={m.reveal + 10} name="heartbreak" vol={0.5} />);
    if (exInfo[ei].xp) sfx.push(<Sfx key={`xp${ei}`} at={exInfo[ei].doneAt + 4} name="xp" vol={0.35} />);
  });

  const cardStep = steps.find((s) => isLine(s.passo) && (s.passo as Line).card);
  const lastLessonStep = steps.filter((s) => s.phase === "licao").pop()!;

  return (
    <AbsoluteFill style={{ background: C.noite, overflow: "hidden" }}>
      {!p.semAudio && steps.filter((s) => s.audio).map((s) => (
        <Sequence key={`a${s.i}`} from={s.start} durationInFrames={s.audioFrames + 2}>
          <Audio src={staticFile(s.audio!)} />
        </Sequence>
      ))}
      {!p.semAudio && sfx}
      {/* trilha em loop (cópias encostadas a cada 600 frames = emenda exata), volume com ducking por frame */}
      {!p.semAudio && !p.semTrilha && Array.from({ length: Math.ceil(durationInFrames / MUSIC.loopFrames) }, (_, k) => (
        <Sequence key={`m${k}`} from={k * MUSIC.loopFrames} durationInFrames={MUSIC.loopFrames}>
          <Audio src={staticFile(MUSIC.src)} volume={(f) => musicVol[Math.min(durationInFrames - 1, k * MUSIC.loopFrames + f)] ?? 0} />
        </Sequence>
      ))}

      {showCafe && (
        <AbsoluteFill>
          <CafeStage frame={frame} cam={cam} blur={blur} emo={emo} capiMood={MOOD[emo.capi]} talking={cur.phase !== "licao" ? talking : null}
            overlay={overlay} tremor={panic ? 2 : 0} faintT={cur.phase === "volta" ? -1 : faintT} capiHop={cur.phase === "volta" ? hop : 0}
            lazy={!!p.cast?.includes("lazy")} />
          {!p.serie && <DayBadge day={p.day} />}
          {cur.i === 0 && p.hookTitle && !p.semGancho && (
            <div style={{ position: "absolute", left: SAFE.x0 + 30, width: SAFE.x1 - SAFE.x0 - 60, top: 256, transform: "rotate(-2deg)" }}>
              <div style={{
                background: C.creme, border: `8px solid ${C.tinta}`, borderRadius: 36, boxShadow: `0 10px 0 ${C.tinta}`, padding: "18px 26px",
                textAlign: "center", fontFamily: TITLE, fontSize: p.hookTitle.length > 16 ? 64 : 84, lineHeight: 1.02, color: C.tinta, textWrap: "balance" as any,
              }}>{p.hookTitle}</div>
            </div>
          )}
          {cardStep && cur === cardStep && <Notebook n={p.notebook} chunk={p.chunk} since={frame - cardStep.from} />}
          {cur.phase !== "licao" && caption}
        </AbsoluteFill>
      )}

      {showLesson && (
        <AbsoluteFill style={{ transform: `translateY(${(1 - lessonIn) * 1920 + lessonOut * 1920}px)` }}>
          <LessonBg frame={frame} />
          <TopBar frame={frame} fps={fps} progress={progress} heartsLostAt={heartsLostAt} xp={xp} xpBumpSince={lastXp ? frame - lastXp.doneAt - XP_LAND : -1} />
          {exs.map((_, ei) => {
            if (ei !== exNow && ei !== exNow - 1) return null;
            if (ei === exNow - 1 && frame >= marks[exNow].start + 16) return null;
            const kin = slide(exNow);
            const x = ei === exNow ? (1 - kin) * 1100 : -kin * 1100;
            return <AbsoluteFill key={ei} style={{ transform: `translateX(${x}px)` }}>{renderEx(ei)}</AbsoluteFill>;
          })}
          <div style={{ position: "absolute", left: L.capi.left, top: L.capi.top + capiBob - hop * 36 }}>
            <Capi frame={frame} talking={cur.phase === "licao" && talking === "capi"} mood={capiLessonMood} size={L.capi.size}
              sweat={capiLessonMood === "sweat" ? 2 : 0} armUp={micOn} />
          </div>
          {exInfo.map((x, ei) => x.xp ? <XpPop key={ei} since={frame - x.doneAt} amount={x.xp} fps={fps} /> : null)}
          {/* revisão no fim: a faixa espera o último item aparecer e fica sobre o Bolinha, sem tampar os cartões */}
          <CompleteBanner since={frame - (exs[exs.length - 1].tipo === "revisao" ? Math.max(lastLessonStep.start + lastLessonStep.audioFrames, lastLessonStep.start + 15) : lastLessonStep.start)}
            fps={fps} xp={xpTotal} top={exs[exs.length - 1].tipo === "revisao" ? 610 : 820} />
          {cur.phase === "licao" && caption}
        </AbsoluteFill>
      )}
      {p.serie && <SeriesSeal serie={p.serie} />}
      <Watermark />
    </AbsoluteFill>
  );
};
