import React, { useMemo } from "react";
import { AbsoluteFill, Audio, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Capi, Mood } from "./Capi";
import { Bolinha } from "./chars/Bolinha";
import { Duda } from "./chars/Duda";
import { Hank } from "./chars/Hank";
import { Lazy } from "./chars/Lazy";
import { Emotion } from "./chars/common";
import { CountRing } from "./cafe/ui";
import { AUDIT_BG, AuditCtx, useAudit } from "./lesson/audit";
import { CafeBackWide, CafeCounterWide } from "./sets/CafeSetWide";
import { Cam, Sfx } from "./Sitcom";
import { BODY, C, TITLE } from "./theme";
import { Adesivo } from "./Vocab";
import { CENA_H, Cena, ChipContexto } from "./vocab/cena";
import { LAYOUT, Objetos } from "./vocab/objetos";
import {
  VocabActor, VocabProps, aprendidas, bolinhaIn, buildVocabSchedule, convidados, falaAt, mostraAt, presencaK,
  stepAt, vocabMusicEnvelope, vocabTotal, voiceStart,
} from "./vocab/timeline";
import { COUNTER_YW, SAFE_W, behindW, clampW, frontW, toScreenW } from "./wide/geo";
import { LegendaW, MarcaW } from "./wide/ui";

export { vocabFrames as vocabWideFrames } from "./vocab/timeline";

// SÉRIE DE VOCABULÁRIO em tela cheia 16:9 (YouTube longo, decisão do Felipe 28/10). MESMO JSON (vocab/<tema>.json),
// MESMA agenda (src/vocab/timeline.ts) e MESMOS cortes de voz em cache: a palavra cola no objeto no mesmo quadro da
// voz, como no vertical. Layout largo: a vitrine é o balcão no centro-esquerda, Hank atrás do balcão, Bolinha sentado
// nele, Capy e convidado nos cantos da frente; fileira das palavras no alto; "sua vez"/"qual é?" no terço de baixo.
export type VocabWideProps = VocabProps & { auditoria?: boolean; semAudio?: boolean; semTrilha?: boolean; semMarca?: boolean };

const ST = {
  capi: frontW("capi", 300, 520, 1),
  hank: behindW("hank", 1250, 500, 1),
  bolinha: behindW("bolinha", 1540, 220, 1),
  lazy: frontW("lazy", 1650, 380, 1),
  duda: frontW("duda", 1650, 400, 1),
};
const OBJ_X = 800;
const OBJ_SCALE = 1.55;
const HOOK_A = 20, HOOK_B = 42;
const WIDE: Cam = { cx: 960, cy: 540, z: 1 };
const FOCO: Cam = { cx: 820, cy: 520, z: 1.1 };
const ease = (k: number) => k * k * (3 - 2 * k);
const mixCam = (a: Cam, b: Cam, k: number): Cam => ({ cx: a.cx + (b.cx - a.cx) * k, cy: a.cy + (b.cy - a.cy) * k, z: a.z + (b.z - a.z) * k });

export const VocabWide: React.FC<VocabWideProps> = (p) => (
  <AuditCtx.Provider value={!!p.auditoria}><VocabWideInner {...p} /></AuditCtx.Provider>
);

const VocabWideInner: React.FC<VocabWideProps> = (p) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const audit = useAudit();
  const steps = useMemo(() => buildVocabSchedule(p, fps), [p, fps]);
  const total = vocabTotal(steps);
  const music = useMemo(() => vocabMusicEnvelope(steps, total, p.semTrilha ? null : p.trilha, p.voiceLufs), [steps, total, p.trilha, p.voiceLufs, p.semTrilha]);
  const cur = stepAt(steps, frame);
  const fala = falaAt(steps, frame);
  const mostra = mostraAt(steps, frame);
  const nSabe = aprendidas(steps, frame);
  const ganchoSteps = steps.filter((s) => s.papel === "gancho"); // 1 fala, ou as partes de uma fala dividida
  const ganchoStep = ganchoSteps.length ? { from: ganchoSteps[0].from, dur: ganchoSteps.reduce((t, s) => t + s.dur, 0) } : null;
  const ganchoEnd = ganchoStep ? ganchoStep.from + ganchoStep.dur : 0;
  const finais = steps.filter((s) => s.papel === "final");
  const finalFrom = finais.length ? finais[0].from - 8 : Infinity;
  const fecho = steps.find((s) => s.papel === "fecho");
  const onFecho = !!fecho && frame >= fecho.from;

  // câmera: gancho em 2 closes com corte seco (movimento no 1º segundo), depois aberto com foco na pausa
  let cam: Cam;
  let emoHank: Emotion = "bored";
  const capHead: [number, number] = [ST.capi.head[0], ST.capi.head[1]];
  if (frame < HOOK_A) {
    cam = clampW({ cx: capHead[0] + 80, cy: capHead[1] - 20, z: 1.45 * (1 + 0.05 * frame / HOOK_A) });
  } else if (frame < HOOK_B) {
    cam = clampW({ cx: ST.hank.head[0], cy: ST.hank.head[1] + 60, z: 1.5 * (1 + 0.05 * (frame - HOOK_A) / (HOOK_B - HOOK_A)) });
    emoHank = "eyebrow";
  } else {
    const foco = steps.find((s) => (s.tipo === "suavez" || s.tipo === "pergunta") && frame >= s.from - 8 && frame < s.from + s.dur + 8);
    const k = foco ? ease(Math.min(1, (frame - foco.from + 8) / 8, (foco.from + foco.dur + 8 - frame) / 8)) : 0;
    cam = clampW(mixCam(WIDE, FOCO, Math.max(0, k)));
    if (frame >= finalFrom && !onFecho) {
      const f2 = finais.filter((s) => voiceStart(s) <= frame).pop();
      if (f2) cam = clampW({ ...cam, z: cam.z * (1 + 0.025 * Math.max(0, 1 - (frame - voiceStart(f2)) / 6)) });
    }
  }
  const worldT = `translate(960px, 540px) scale(${cam.z}) translate(${-cam.cx}px, ${-cam.cy}px)`;

  const guests = useMemo(() => convidados(steps, total), [steps, total]);
  const bolK = Math.min(1, Math.max(0, (frame - bolinhaIn(steps)) / 10));
  const talking = (id: VocabActor) => !!fala && fala.speaker === id;
  const lastSpeaker = steps.filter((s) => s.tipo === "fala" && s.from <= frame).pop()?.speaker;
  const emo = (id: VocabActor, base: Emotion): Emotion => (cur.tipo === "pergunta" ? (id === "hank" ? "eyebrow" : "neutral") : talking(id) ? (id === "hank" ? "neutral" : "smile") : base);
  const capiMood: Mood = onFecho ? "happy" : cur.tipo === "pergunta" ? "thinking" : talking("capi") ? "zen" : lastSpeaker === "capi" && cur.tipo === "suavez" ? "happy" : "zen";
  const place = (id: keyof typeof ST, el: React.ReactNode, transform = "") => (
    <div style={{ position: "absolute", left: ST[id].left, top: ST[id].top, transform }}>{el}</div>
  );
  const pal = mostra ? p.palavras[mostra.palavra] : null;
  const objSince = mostra ? frame - mostra.from : 0;
  const world = audit ? null : (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: worldT, transformOrigin: "0 0" }}>
        <CafeBackWide frame={0} />
        <AbsoluteFill style={{ background: "rgba(30,15,77,0.4)" }} />
        {place("hank", <Hank frame={frame} talking={talking("hank")} emotion={frame < HOOK_B ? emoHank : emo("hank", onFecho ? "smile" : "bored")} size={ST.hank.size} />)}
        <CafeCounterWide frame={0} />
        {pal && (
          <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", left: 0, top: 0 }}>
            <g transform={`translate(${OBJ_X} ${COUNTER_YW + 4}) scale(${OBJ_SCALE})`}>
              {pal.cena
                ? <Cena cena={pal.cena} frame={frame} since={objSince} instant={mostra!.instant} uid={`w${mostra!.palavra}`} />
                : <Objetos objeto={pal.objeto!} qtd={pal.qtd ?? 1} since={objSince} instant={mostra!.instant} />}
            </g>
          </svg>
        )}
        {bolK > 0 && place("bolinha", <Bolinha frame={frame} talking={talking("bolinha")} emotion={emo("bolinha", "happy")} size={ST.bolinha.size} cheeks={0.5} />,
          `translateY(${(1 - bolK) * 50}px) scale(${0.4 + 0.6 * bolK})`)}
        {guests.map((g) => {
          const k = presencaK(g, frame);
          if (k <= 0) return null;
          const el = g.who === "lazy"
            ? <Lazy frame={frame} talking={talking("lazy")} emotion={emo("lazy", "neutral")} size={ST.lazy.size} />
            : <Duda frame={frame} talking={talking("duda")} emotion={emo("duda", "happy")} size={ST.duda.size} />;
          return <React.Fragment key={g.who + g.in}>{place(g.who as "lazy" | "duda", el, `translateX(${(1 - k) * 700}px)`)}</React.Fragment>;
        })}
        {place("capi", <Capi frame={frame} talking={talking("capi")} mood={capiMood} size={ST.capi.size} armUp={onFecho} />)}
      </AbsoluteFill>
    </AbsoluteFill>
  );

  // adesivo de preço (palavra colada no objeto, acompanha a câmera)
  let sticker: React.ReactNode = null;
  if (pal && mostra && !onFecho) {
    const h = pal.cena ? CENA_H : LAYOUT[pal.objeto!].h;
    const [sx, sy] = toScreenW(cam, OBJ_X, COUNTER_YW - h * OBJ_SCALE - 30);
    const revelado = frame >= mostra.revelado;
    const since = revelado ? frame - mostra.revelado : frame - mostra.from;
    const ativo = !!fala && fala.palavra === mostra.palavra && fala.lang === "en";
    const pulse = ativo ? 1 + 0.06 * Math.max(0, 1 - (frame - voiceStart(fala!)) / 5) : 1;
    const marca = pal.armadilha && revelado && steps.some((s) => s.papel === "apresenta" && s.palavra === mostra.palavra && voiceStart(s) <= frame)
      && !(frame >= finalFrom) && cur.papel !== "revisao" ? pal.armadilha : null;
    if (revelado || mostra.oculto) {
      sticker = (
        <Adesivo x={sx} y={Math.max(sy, marca ? 430 : 370)} z={cam.z} digito={mostra.oculto && !revelado ? "?" : pal.digito} palavra={mostra.oculto && !revelado ? "" : pal.en}
          enfase={pal.armadilha?.enfase} ativo={ativo} pop={mostra.instant || mostra.oculto ? 1 : spring({ frame: since, fps, config: { damping: 11, stiffness: 190 } })}
          pulse={pulse} marca={marca?.marca} marcaSince={frame - mostra.revelado - 8} />
      );
    }
  }

  // contexto da cena (PT, apoio): chip logo abaixo da janela, some na revisão final rápida e no fecho
  let contexto: React.ReactNode = null;
  if (pal?.cena && mostra && !onFecho && frame < finalFrom) {
    const [cx, cy] = toScreenW(cam, OBJ_X, COUNTER_YW + 18);
    contexto = (
      <div style={{ position: "absolute", left: cx - 300, width: 600, top: cy, display: "flex", justifyContent: "center", transform: `scale(${cam.z})`, transformOrigin: "50% 0" }}>
        <ChipContexto text={pal.cena.contexto} opacity={mostra.instant ? 1 : Math.min(1, objSince / 8)} />
      </div>
    );
  }
  const stripFrom = Math.max(HOOK_B + 6, ganchoEnd - 36);
  const armadilhaAt = ganchoStep ? ganchoStep.from + Math.round(ganchoStep.dur * 0.62) : 0;
  const ativoIdx = fala && fala.lang === "en" && (fala.papel === "revisao" || fala.papel === "final") ? fala.palavra : undefined;

  let chip: React.ReactNode = null;
  if (cur.tipo === "suavez") {
    chip = <ChipW since={frame - cur.from} fps={fps}><MicW size={96} frame={frame} /><span>sua vez!</span>
      <CountRing remaining={Math.max(0.01, (cur.from + cur.dur - frame) / fps)} total={cur.dur / fps} size={100} /></ChipW>;
  } else if (cur.tipo === "pergunta" || (cur.papel === "desafio" && cur.tipo !== "fala")) {
    const per = cur.tipo === "pergunta" ? cur : steps[cur.i + 1];
    chip = <ChipW since={frame - cur.from + (cur.tipo === "pergunta" ? 10 : 0)} fps={fps}><span>qual é?</span>
      <CountRing remaining={Math.max(0.01, (per.from + per.dur - Math.max(frame, per.from)) / fps)} total={per.dur / fps} size={100} /></ChipW>;
  } else if (frame >= finalFrom && !onFecho) {
    chip = <ChipW since={frame - finalFrom} fps={fps} roxo><span>todas, cada vez mais rápido »</span></ChipW>;
  }

  // legenda: só falas em PT (as palavras em inglês aparecem no adesivo, colado no objeto)
  let caption: React.ReactNode = null;
  const capStep = steps.filter((s) => s.tipo === "fala" && s.lang === "pt" && frame >= s.from && frame < s.from + s.dur + 6).pop();
  if (capStep && !onFecho && !chip) {
    const prog = Math.min(1, (frame - voiceStart(capStep)) / Math.max(1, capStep.speechF ?? 1));
    caption = <LegendaW speaker={capStep.speaker!} text={capStep.text!} lang="pt" progress={prog}
      pop={frame === 0 ? 1 : spring({ frame: frame - capStep.from, fps, config: { damping: 14 } })} />;
  }

  const sfx: React.ReactNode[] = [];
  steps.forEach((s) => {
    if (s.tipo === "objetos" && !s.papel) sfx.push(<Sfx key={`o${s.i}`} at={s.from} name="pop" vol={0.18} />);
    if (s.tipo === "suavez") sfx.push(<Sfx key={`m${s.i}`} at={s.from} name="pop" vol={0.3} />);
    if (s.tipo === "pergunta") for (let j = 0; j < Math.round(s.dur / fps); j++) sfx.push(<Sfx key={`t${s.i}-${j}`} at={s.from + j * fps} name="tick" vol={0.22} />);
  });
  if (fecho) sfx.push(<Sfx key="stamp" at={fecho.from + 6} name="stamp" vol={0.4} />);
  const loop = p.trilha ? Math.round(p.trilha.loop_s * fps) : 0;

  return (
    <AbsoluteFill style={{ background: p.auditoria ? AUDIT_BG : C.noite, overflow: "hidden" }}>
      {!p.semAudio && steps.filter((s) => s.clip).map((s) => (
        <Sequence key={`a${s.i}`} from={s.from} durationInFrames={Math.ceil(s.clip!.duration * fps) + 2}>
          <Audio src={staticFile(s.clip!.audio)} />
        </Sequence>
      ))}
      {!p.semAudio && sfx}
      {!p.semAudio && !p.semTrilha && p.trilha && Array.from({ length: Math.ceil(total / loop) }, (_, k) => (
        <Sequence key={`mu${k}`} from={k * loop} durationInFrames={loop}>
          <Audio src={staticFile(p.trilha!.src)} volume={(f) => music[Math.min(total - 1, k * loop + f)] ?? 0} />
        </Sequence>
      ))}
      {world}
      {frame >= stripFrom && !onFecho && (
        <FileiraW palavras={p.palavras} sabe={nSabe} ativo={ativoIdx} since={frame - stripFrom} marcas={frame >= armadilhaAt} fps={fps} prev={frame < ganchoEnd} />
      )}
      {contexto}
      {sticker}
      {chip}
      {caption}
      {onFecho && fecho && <CardFinalW titulo={p.card?.titulo ?? ""} sub={p.card?.sub} since={frame - fecho.from} fps={fps} />}
      {onFecho && fecho && <LegendaW speaker={fecho.speaker!} text={fecho.text!} lang="pt"
        progress={Math.min(1, (frame - voiceStart(fecho)) / Math.max(1, fecho.speechF ?? 1))} />}
      {!p.semMarca && <MarcaW codigo={p.serie?.codigo} progresso={nSabe > 0 ? `você já sabe ${nSabe} palavra${nSabe > 1 ? "s" : ""}` : p.serie?.titulo} />}
    </AbsoluteFill>
  );
};

const MicW: React.FC<{ size: number; frame: number }> = ({ size, frame }) => (
  <div style={{ position: "relative", width: size, height: size }}>
    {[0, 1].map((j) => {
      const r = ((frame + j * 15) % 30) / 30;
      return <div key={j} style={{ position: "absolute", left: -r * 30, top: -r * 30, width: size + r * 60, height: size + r * 60, borderRadius: "50%", border: `5px solid ${C.certo}`, opacity: 1 - r }} />;
    })}
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ position: "absolute" }}>
      <circle cx={50} cy={50} r={46} fill={C.certo} stroke={C.tinta} strokeWidth={6} />
      <rect x={39} y={20} width={22} height={38} rx={11} fill="#fff" stroke={C.tinta} strokeWidth={5} />
      <path d="M30 48 Q30 70 50 70 Q70 70 70 48 M50 70 L50 80 M40 81 L60 81" fill="none" stroke={C.tinta} strokeWidth={5} strokeLinecap="round" />
    </svg>
  </div>
);

// marcador do terço de baixo ("sua vez" / "qual é?" / "todas, cada vez mais rápido"), acima dos controles do player
const ChipW: React.FC<{ since: number; fps: number; roxo?: boolean; children: React.ReactNode }> = ({ since, fps, roxo, children }) => {
  const s = spring({ frame: since, fps, config: { damping: 13 } });
  return (
    <div style={{ position: "absolute", left: SAFE_W.x0, width: SAFE_W.x1 - SAFE_W.x0, bottom: 1080 - SAFE_W.y1, display: "flex", justifyContent: "center",
      transform: `scale(${0.85 + 0.15 * s})`, transformOrigin: "50% 100%", opacity: s }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 26, background: roxo ? C.roxo : C.creme, color: roxo ? C.creme : C.tinta, border: `7px solid ${C.tinta}`,
        borderRadius: 36, boxShadow: `0 10px 0 ${C.tinta}`, padding: "10px 26px", fontFamily: TITLE, fontSize: 70, lineHeight: 1,
      }}>{children}</div>
    </div>
  );
};

// Fileira das palavras (glossário que se monta sozinho) no alto, em toda a largura.
const FileiraW: React.FC<{ palavras: VocabProps["palavras"]; sabe: number; ativo?: number; since: number; marcas: boolean; fps: number; prev: boolean }> = ({
  palavras, sabe, ativo, since, marcas, fps, prev,
}) => {
  const n = palavras.length;
  const gap = 12, w = Math.floor((SAFE_W.x1 - SAFE_W.x0 - gap * (n - 1)) / n);
  return (
    <div style={{ position: "absolute", left: SAFE_W.x0, top: SAFE_W.y0 + 70, display: "flex", gap }}>
      {palavras.map((pw, k) => {
        const s = prev ? spring({ frame: since - k * 2, fps, config: { damping: 12 } }) : 1;
        const on = k < sabe;
        const at = k === ativo;
        return (
          <div key={k} style={{
            width: w, height: 92, borderRadius: 18, boxSizing: "border-box", border: `5px solid ${C.tinta}`, position: "relative",
            background: at ? C.lilas : on ? C.creme : "rgba(255,244,224,0.35)", transform: `scale(${Math.max(0, s) * (at ? 1.1 : 1)})`,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          }}>
            {pw.digito
              ? <><div style={{ fontFamily: TITLE, fontSize: 34, lineHeight: 1, color: at ? "#fff" : C.tinta }}>{pw.digito}</div>
                <div style={{ fontFamily: BODY, fontWeight: 800, fontSize: 26, lineHeight: 1.1, color: at ? "#fff" : C.roxo, opacity: on ? 1 : 0 }}>{pw.en}</div></>
              : <div style={{ fontFamily: TITLE, fontSize: Math.min(40, Math.floor((w - 12) / (0.55 * pw.en.length))), lineHeight: 1, color: at ? "#fff" : C.tinta, opacity: on ? 1 : 0.25 }}>{on ? pw.en : "?"}</div>}
            {marcas && pw.armadilha && !on && (
              <div style={{ position: "absolute", right: -6, top: -12, width: 30, height: 30, borderRadius: 15, background: C.tangerina, border: `4px solid ${C.tinta}`,
                fontFamily: TITLE, fontSize: 22, lineHeight: "22px", textAlign: "center", color: C.tinta }}>!</div>
            )}
          </div>
        );
      })}
    </div>
  );
};

const CardFinalW: React.FC<{ titulo: string; sub?: string; since: number; fps: number }> = ({ titulo, sub, since, fps }) => {
  const s = spring({ frame: since, fps, config: { damping: 13 } });
  return (
    <div style={{ position: "absolute", left: 460, width: 1000, top: 190, transform: `translateY(${(1 - s) * 700}px) rotate(-1.5deg)` }}>
      <div style={{ background: C.creme, border: `8px solid ${C.tinta}`, borderRadius: 34, boxShadow: `0 12px 0 ${C.tinta}`, padding: "34px 30px 36px", textAlign: "center" }}>
        <div style={{ fontFamily: TITLE, fontSize: 84, lineHeight: 1.05, color: C.tinta }}>{titulo} <span style={{ color: C.certo }}>✓</span></div>
        {sub && <div style={{ fontFamily: TITLE, fontSize: 64, color: C.roxo, marginTop: 14 }}>{sub}</div>}
      </div>
    </div>
  );
};
