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
import { HOOK, TITLE_BOTTOM, TITLE_TOP } from "./Licao";
import { AUDIT_BG, AuditCtx, useAudit } from "./lesson/audit";
import { Caption } from "./lesson/Caption";
import { MUSIC } from "./lesson/music";
import { CafeBack, CafeCounter, ThoughtOverlay, VaporPuff } from "./sets/CafeSet";
import { CAPI_MOOD, Cam, Notebook, Sfx, clampCam, toScreen } from "./Sitcom";
import { C } from "./theme";
import { Watermark } from "./Watermark";
import {
  Actor, CAFE_STAGE, CafeLine, CafeProps, CafeStep, HOOK_CUT, HOOK_INSERT, PERGUNTA_LEAD, STRIKE_DELAY, STRIKE_FRAMES,
  buildCafeSchedule, cafeMusicEnvelope, cafeTotal, firstAlvoIndex, highlightFor, isLine, isPausa, isPergunta, karaokeProgress,
  planShots, presenceK, presences, shotAt, stepAt,
} from "./cafe/timeline";
import { CafeSeal, CardTexto, HookTitle, LembraTag, PerguntaCard, RepitaBlock, VideoCall, phoneAnchor } from "./cafe/ui";

export type { CafeProps } from "./cafe/timeline";
export { cafeFrames } from "./cafe/timeline";

// "SITCOM DO CAFÉ" (CapyFala, formato passivo — docs/pesquisas/formato-novo/formato-ensino-video.md §3 F1).
// Uma cena no Bean There: a Capy erra ("Give me a coffee."), o Hank nem pisca, a Duda pede certo, pergunta de 3 s,
// o Lazy explica devagar, shadowing, Poppy/Hank variam, Dona Jaca liga, Bolinha guarda a frase, Caderninho.
// Mesmo elenco/cenário/câmera do Sitcom e do Licao, mais calmo: pausa ≥ 0,5 s entre falas, plano de 1,5–3 s,
// cortes secos (sem chicote), fundo parado, ≤ 3 coisas se mexendo.
//
// Flags de render: corteDe = frame em que a esquete começa (o gancho de câmera acontece a partir dele);
// gancho = texto de tela do gancho (esquete); semAudio/semTrilha; auditoria = fundo preto, só interface/texto (portão).
export type CafeRenderProps = CafeProps & { auditoria?: boolean; corteDe?: number; gancho?: string; semAudio?: boolean; semTrilha?: boolean };

const MOODS: Mood[] = ["zen", "thinking", "sweat", "shock", "happy", "fail"];
// O roteiro usa tanto emoções do elenco quanto humores da Capy ("sweat", "shock", "fail").
const capiMood = (e: string): Mood => (MOODS.includes(e as Mood) ? (e as Mood) : CAPI_MOOD[e as Emotion] ?? "zen");
const EMO_OK: Emotion[] = ["neutral", "zen", "bored", "angry", "eyebrow", "surprised", "panic", "happy", "smile", "whisper"];
const asEmotion = (e: string | undefined, fb: Emotion): Emotion => (e && EMO_OK.includes(e as Emotion) ? (e as Emotion) : fb);

export const Cafe: React.FC<CafeRenderProps> = (p) => (
  <AuditCtx.Provider value={!!p.auditoria}><CafeInner {...p} /></AuditCtx.Provider>
);

const CafeInner: React.FC<CafeRenderProps> = (p) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const audit = useAudit();
  const steps = useMemo(() => buildCafeSchedule(p, fps), [p, fps]);
  const total = cafeTotal(steps);
  const h0 = p.corteDe ?? 0;
  const shots = useMemo(() => planShots(steps, h0), [steps, h0]);
  const pres = useMemo(() => presences(steps), [steps]);
  const music = useMemo(() => cafeMusicEnvelope(steps, total, p.voiceLufs), [steps, total, p.voiceLufs]);
  const firstAlvo = firstAlvoIndex(p);
  const cur = stepAt(steps, frame);
  const lf = frame - cur.from;
  const beat = cur.beat;
  const line = isLine(beat) ? beat : null;

  // ---- emoções acumuladas (último valor até o beat atual) ----
  const emo: Record<Actor, string> = { capi: "zen", hank: "bored", lazy: "neutral", duda: "neutral", poppy: "neutral", bolinha: "neutral", donajaca: "neutral", turista: "neutral" };
  steps.forEach((s) => {
    if (s.i > cur.i) return;
    const b = s.beat;
    if (isLine(b) && b.speaker !== "narrador" && b.emotion) emo[b.speaker as Actor] = b.emotion;
    if ((isLine(b) || isPausa(b)) && b.react) Object.assign(emo, b.react);
  });
  const perguntaOn = isPergunta(beat);
  if (perguntaOn) emo.capi = "thinking";

  // ---- câmera ----
  const shot = shotAt(shots, frame);
  let cam: Cam;
  let tremor = 0;
  if (shot.hook === "a") {
    cam = clampCam({ ...shot.cam, z: shot.cam.z * HOOK.zoom * (1 + (0.06 * (frame - shot.from)) / HOOK_CUT) });
  } else if (shot.hook === "b") {
    const base = shot.subjects !== "wide" && shot.subjects[0] === "capi" ? { ...shot.cam, cy: CAFE_STAGE.capi.head[1] - 20 } : shot.cam;
    cam = clampCam({ ...base, z: base.z * HOOK.punch * (1 + (0.06 * (frame - shot.from)) / HOOK_INSERT) });
    tremor = 3;
    const who = shot.subjects !== "wide" ? shot.subjects[0] : "hank";
    if (who === "hank" && ["bored", "neutral", "zen", "smile"].includes(emo.hank)) emo.hank = "eyebrow";
    if (who === "capi") emo.capi = "panic";
  } else {
    const k = Math.min(1, (frame - shot.from) / Math.max(1, shot.to - shot.from));
    cam = clampCam({ ...shot.cam, z: shot.cam.z * (1 + 0.02 * k) }); // push-in lento dentro do plano
  }

  // ---- quem fala (boca só dentro dos pedaços de áudio; pausa das reticências = boca fechada) ----
  const sec = lf / fps;
  const inAudio = !!line && lf < cur.audioFrames;
  const inPart = inAudio && (cur.timing?.parts?.length ? cur.timing.parts.some((pt) => sec >= pt.start - 0.03 && sec <= pt.end + 0.03) : true);
  const talking = (id: Actor) => !!line && line.speaker === id && line.mode !== "pensamento" && inPart;
  const thinking = !!line && line.mode === "pensamento";
  const overlay = thinking ? (emo.capi === "panic" ? 1 : 0.32) * Math.min(1, lf / 5 + (frame === h0 ? 1 : 0)) : 0;

  // ---- presença / entradas ----
  const kIn = (id: Actor) => presenceK(pres[id], frame);
  const bolStep = steps.find((s) => isLine(s.beat) && (s.beat.speaker === "bolinha" || s.beat.bolinha));
  const bolLines = steps.filter((s) => isLine(s.beat) && s.beat.speaker === "bolinha");
  let cheeks = 1;
  if (bolLines.length) {
    const a = bolLines[0], b = bolLines[1];
    cheeks = interpolate(frame, [a.from, a.from + a.audioFrames], [1, 0.3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    if (b) cheeks = frame < b.from ? cheeks : interpolate(frame, [b.from, b.from + b.audioFrames], [0.3, 0.85], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  }

  // ---- mundo ----
  const tr = tremor ? [Math.sin(frame * 2.3) * tremor, Math.cos(frame * 1.9) * tremor] : [0, 0];
  const worldT = `translate(${540 + tr[0]}px, ${960 + tr[1]}px) scale(${cam.z}) translate(${-cam.cx}px, ${-cam.cy}px)`;
  const parallax = `translate(${(cam.cx - 540) * 0.12}px, ${(cam.cy - 960) * 0.08}px)`;
  const place = (id: Exclude<Actor, "donajaca">, el: React.ReactNode, transform = "") => (
    <div style={{ position: "absolute", left: CAFE_STAGE[id].left, top: CAFE_STAGE[id].top, transform }}>{el}</div>
  );
  const cardStep = steps.find((s) => isLine(s.beat) && s.beat.card);
  const onCard = !!cardStep && cur === cardStep;
  const lazyK = kIn("lazy"), dudaK = kIn("duda"), poppyK = kIn("poppy"), bolK = kIn("bolinha"), jacaK = kIn("donajaca"), turistaK = kIn("turista");
  const world = audit ? null : (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: worldT, transformOrigin: "0 0" }}>
        {/* fundo PARADO (frame fixo): sem luzinhas piscando nem lâmpada balançando (regra 6) */}
        <AbsoluteFill style={{ transform: parallax }}><CafeBack frame={0} /></AbsoluteFill>
        {place("hank", <Hank frame={frame} talking={talking("hank")} emotion={asEmotion(emo.hank, "bored")} size={CAFE_STAGE.hank.size} />)}
        {lazyK > 0 && place("lazy", <Lazy frame={frame} talking={talking("lazy")} emotion={asEmotion(emo.lazy, "neutral")} size={CAFE_STAGE.lazy.size} />, `translateY(${(1 - lazyK) * 440}px)`)}
        <CafeCounter frame={0} />
        {bolK > 0 && place("bolinha", <Bolinha frame={frame} talking={talking("bolinha")} emotion={asEmotion(emo.bolinha, "neutral")} size={CAFE_STAGE.bolinha.size} cheeks={cheeks} />,
          `translateY(${(1 - bolK) * 60}px) scale(${0.4 + 0.6 * bolK})`)}
        <ThoughtOverlay amount={overlay} frame={frame} />
        {dudaK > 0 && place("duda", <Duda frame={frame} talking={talking("duda")} emotion={asEmotion(emo.duda, "neutral")} size={CAFE_STAGE.duda.size} />, `translateX(${(1 - dudaK) * 540}px)`)}
        {poppyK > 0 && place("poppy", <Poppy frame={frame} talking={talking("poppy")} emotion={asEmotion(emo.poppy, "neutral")} size={CAFE_STAGE.poppy.size} />, `translateX(${(1 - poppyK) * 540}px)`)}
        {turistaK > 0 && place("turista", <Turista frame={frame} talking={talking("turista")} emotion={asEmotion(emo.turista, "neutral")} size={CAFE_STAGE.turista.size} />, `translateX(${(1 - turistaK) * 540}px)`)}
        {place("capi", <Capi frame={frame} talking={talking("capi")} mood={capiMood(emo.capi)} size={CAFE_STAGE.capi.size}
          sweat={emo.capi === "panic" || emo.capi === "sweat" ? 2 : 0} armUp={onCard} />)}
      </AbsoluteFill>
    </AbsoluteFill>
  );

  // ---- título do gancho (frame 0 = capa): até o fim do beat seguinte ao 1º ----
  const s0 = stepAt(steps, h0);
  const titleText = p.gancho ?? (h0 === 0 ? p.hookTitle : undefined);
  const titleEnd = (steps[s0.i + 1] ?? s0).from + (steps[s0.i + 1] ?? s0).dur;
  const titleOut = interpolate(frame, [titleEnd - 8, titleEnd], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const titleOn = !!titleText && frame >= h0 && frame < titleEnd;

  // ---- legenda (balão com karaokê) ----
  // a fala continua escrita durante a reação muda que vem logo depois dela (pausa) — o texto assenta
  const capStep: CafeStep | null = line ? cur : isPausa(beat) && cur.i > 0 && isLine(steps[cur.i - 1].beat) ? steps[cur.i - 1] : null;
  let caption: React.ReactNode = null;
  const inShadow = cur.shadowFrom >= 0 && frame >= cur.shadowFrom;
  if (capStep && !inShadow && !onCard) caption = captionFor(capStep);
  if (onCard && cardStep) caption = captionFor(cardStep, true);

  function captionFor(s: CafeStep, card = false) {
    const b = s.beat as CafeLine;
    const t = (frame - s.from) / fps;
    const progress = karaokeProgress(b.text, s.timing ?? null, t);
    let anchor: [number, number];
    if (b.speaker === "donajaca") anchor = phoneAnchor(jacaK);
    else {
      const id = (b.speaker === "narrador" ? "capi" : b.speaker) as Exclude<Actor, "donajaca">;
      const st = CAFE_STAGE[id];
      anchor = toScreen(cam, st.head[0] + (id === "capi" && b.mode === "pensamento" ? 60 : 0), st.headTop) as [number, number];
    }
    anchor = [Math.min(880, Math.max(100, anchor[0])), Math.min(1700, anchor[1])];
    const hl = highlightFor(p, b);
    const first = s.i === firstAlvo;
    const strikeStart = s.from + s.audioFrames + STRIKE_DELAY;
    const strike = b.errado ? interpolate(frame, [strikeStart, strikeStart + STRIKE_FRAMES], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
    const pop = frame === h0 || s.from < h0 ? 1 : spring({ frame: frame - s.from, fps, config: { damping: 14 } });
    return (
      <Caption anchor={anchor} text={b.text} lang={b.lang} progress={card ? Math.min(progress, 1) : progress} thought={b.mode === "pensamento"} pop={pop}
        fontSize={b.text.length > 26 ? 50 : 58} minTop={titleOn ? TITLE_BOTTOM : undefined}
        highlight={hl} sub={first ? p.alvo.pt : undefined} subOpacity={interpolate(frame - s.from, [12, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
        strike={strike} />
    );
  }

  // ---- blocos de aprender ----
  let block: React.ReactNode = null;
  if (isPergunta(beat)) {
    const qFrom = cur.from + PERGUNTA_LEAD, qTo = qFrom + cur.quietFrames;
    block = <PerguntaCard text={beat.text} since={lf} fps={fps} remaining={Math.max(0.01, (qTo - Math.max(frame, qFrom)) / fps)} total={beat.s}
      counting={frame >= qFrom} out={interpolate(frame, [qTo, cur.from + cur.dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />;
  } else if (line?.repita && inShadow) {
    const end = cur.shadowFrom + cur.shadowFrames;
    block = <RepitaBlock text={line.text} highlight={highlightFor(p, line)} since={frame - cur.shadowFrom} fps={fps} frame={frame}
      remaining={Math.max(0.01, (end - frame) / fps)} total={cur.shadowFrames / fps}
      out={interpolate(frame, [end, cur.from + cur.dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />;
  }

  // ---- áudio ----
  const sfx: React.ReactNode[] = [];
  steps.forEach((s) => {
    (isLine(s.beat) ? s.beat.sfx ?? [] : []).forEach((n, j) => sfx.push(<Sfx key={`s${s.i}-${j}`} at={s.from} name={n} vol={0.4} />));
    if (isPergunta(s.beat)) for (let j = 0; j < Math.round(s.quietFrames / fps); j++) sfx.push(<Sfx key={`t${s.i}-${j}`} at={s.from + PERGUNTA_LEAD + j * fps} name="tick" vol={0.22} />);
    if (s.shadowFrom >= 0) sfx.push(<Sfx key={`mic${s.i}`} at={s.shadowFrom} name="pop" vol={0.3} />);
  });
  if (cardStep) sfx.push(<Sfx key="stamp" at={cardStep.from + 10} name="stamp" vol={0.45} />);
  if (pres.bolinha) sfx.push(<Sfx key="bol" at={pres.bolinha.in + 4} name="pop" vol={0.35} />);
  if (pres.donajaca) sfx.push(<Sfx key="jaca" at={pres.donajaca.in} name="pop" vol={0.3} />);

  // ---- vapor do H (regra visual do assunto 1): nuvenzinha perto da boca de quem fala, enquanto a fala toca ----
  let vapor: React.ReactNode = null;
  if (line?.vapor && lf >= 0 && lf < Math.max(24, cur.audioFrames)) {
    const vid = (line.speaker === "narrador" ? "capi" : line.speaker) as Exclude<Actor, "donajaca">;
    const vst = CAFE_STAGE[vid];
    const [vx, vy] = toScreen(cam, vst.head[0] + 46, vst.headTop + 70) as [number, number];
    vapor = <VaporPuff x={vx} y={vy} frame={frame} since={lf} />;
  }

  const bolHead = bolStep ? toScreen(cam, CAFE_STAGE.bolinha.head[0], CAFE_STAGE.bolinha.headTop) : [0, 0];
  const lembra = !!bolStep && (p.serie?.episodio ?? 1) > 1 && cur === bolStep;
  const cardTexto = cardStep && (cardStep.beat as CafeLine).cardTexto;

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
      <VideoCall k={jacaK} frame={frame} talking={talking("donajaca")} emotion={asEmotion(emo.donajaca, "neutral")} />
      {titleOn && <HookTitle text={titleText!} top={TITLE_TOP} out={titleOut} />}
      {onCard && cardStep && <Notebook n={p.notebook ?? 1} chunk={{ en: p.alvo.en, pt: p.alvo.pt, pattern: p.alvo.nucleo ? `${p.alvo.nucleo} ...?` : undefined }} since={frame - cardStep.from} />}
      {onCard && cardTexto && <CardTexto text={cardTexto} since={frame - cardStep!.from - 14} fps={fps} />}
      {lembra && <LembraTag x={bolHead[0]} y={bolHead[1]} since={lf} fps={fps} />}
      {block}
      {!block && caption}
      {!block && vapor}
      <Watermark lead={<CafeSeal serie={p.serie} />} />
    </AbsoluteFill>
  );
};
