import React, { useMemo } from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Capi, Mood } from "./Capi";
import { Bolinha } from "./chars/Bolinha";
import { Duda } from "./chars/Duda";
import { Hank } from "./chars/Hank";
import { Lazy } from "./chars/Lazy";
import { Emotion } from "./chars/common";
import { CafeSeal, CountRing, HookTitle } from "./cafe/ui";
import { TITLE_TOP } from "./Licao";
import { AUDIT_BG, AuditCtx, useAudit } from "./lesson/audit";
import { Caption } from "./lesson/Caption";
import { CafeBack, CafeCounter, COUNTER_Y } from "./sets/CafeSet";
import { Cam, Sfx, clampCam, toScreen } from "./Sitcom";
import { BODY, C, SAFE, TITLE } from "./theme";
import { Watermark } from "./Watermark";
import { CENA_H, Cena, ChipContexto } from "./vocab/cena";
import { LAYOUT, Objetos } from "./vocab/objetos";
import {
  VocabActor, VocabProps, VocabStep, aprendidas, bolinhaIn, buildVocabSchedule, convidados, falaAt, mostraAt, presencaK,
  stepAt, vocabMusicEnvelope, vocabTotal, voiceStart,
} from "./vocab/timeline";

export type { VocabProps } from "./vocab/timeline";
export { vocabFrames } from "./vocab/timeline";

// SÉRIE DE VOCABULÁRIO (CapyFala, passiva): o balcão do Bean There vira a vitrine das palavras do tema.
// Objeto aparece com a quantidade → a Capy diz → o adesivo de preço cola no MESMO quadro da voz → SUA VEZ (pausa)
// → 2 ecos de outros personagens → mini-revisão do Bolinha por bloco → desafio → revisão final crescente → fecho.
// Mesmo elenco, cenário, tipografia, cores e zona segura da Sitcom do Café. Sem botão, sem A/B/C, sem XP, sem corações.
// Regras visuais (didatica-visual.md): 1 só amarelo por quadro (a palavra falada), palavra colada no objeto (±3 quadros),
// cena parada com ≤ 3 coisas mexendo. Trilha = `trilha` do tema (troca de arquivo sem mudar a estrutura) ou null.
export type VocabRenderProps = VocabProps & { auditoria?: boolean; semAudio?: boolean; semTrilha?: boolean };

// palco (mundo 1080x1920). Hank atrás do balcão à direita, Bolinha sentado no balcão, Capy e convidado na frente.
const ST = {
  hank: { left: 600, top: 650, size: 470 },
  bolinha: { left: 790, top: 955, size: 200 },
  capi: { left: -20, top: 1180, size: 470 },
  lazy: { left: 590, top: 1150, size: 360 },
  duda: { left: 560, top: 1235, size: 390 },
};
const capiHeadTop = ST.capi.top + ST.capi.size * 0.258;
const capiHeadX = ST.capi.left + ST.capi.size * 0.525;
const OBJ_X = 400; // centro da área de objetos no balcão
const OBJ_SCALE = 1.45; // objetos grandes: a quantidade tem de ser contável no celular
const HOOK_A = 20, HOOK_B = 42; // gancho: close na Capy → corte seco no Hank → plano aberto
const WIDE: Cam = { cx: 540, cy: 960, z: 1 };
const FOCO: Cam = { cx: 430, cy: 930, z: 1.07 };

export const Vocab: React.FC<VocabRenderProps> = (p) => (
  <AuditCtx.Provider value={!!p.auditoria}><VocabInner {...p} /></AuditCtx.Provider>
);

const ease = (k: number) => k * k * (3 - 2 * k);
const mixCam = (a: Cam, b: Cam, k: number): Cam => ({ cx: a.cx + (b.cx - a.cx) * k, cy: a.cy + (b.cy - a.cy) * k, z: a.z + (b.z - a.z) * k });

const VocabInner: React.FC<VocabRenderProps> = (p) => {
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

  // ---- câmera: gancho em 2 closes com corte seco (movimento no 1º segundo), depois aberto com foco na pausa ----
  let cam: Cam;
  let emoHank: Emotion = "bored";
  if (frame < HOOK_A) {
    cam = clampCam({ cx: capiHeadX + 40, cy: capiHeadTop + 40, z: 1.38 * (1 + 0.05 * frame / HOOK_A) });
  } else if (frame < HOOK_B) {
    cam = clampCam({ cx: ST.hank.left + 170, cy: ST.hank.top + 200, z: 1.42 * (1 + 0.05 * (frame - HOOK_A) / (HOOK_B - HOOK_A)) });
    emoHank = "eyebrow";
  } else {
    const foco = steps.find((s) => (s.tipo === "suavez" || s.tipo === "pergunta") && frame >= s.from - 8 && frame < s.from + s.dur + 8);
    const k = foco ? ease(Math.min(1, (frame - foco.from + 8) / 8, (foco.from + foco.dur + 8 - frame) / 8)) : 0;
    cam = clampCam(mixCam(WIDE, FOCO, Math.max(0, k)));
    if (frame >= finalFrom && !onFecho) { // revisão final: pulso leve a cada palavra
      const f2 = finais.filter((s) => voiceStart(s) <= frame).pop();
      if (f2) cam = clampCam({ ...cam, z: cam.z * (1 + 0.025 * Math.max(0, 1 - (frame - voiceStart(f2)) / 6)) });
    }
  }
  const worldT = `translate(540px, 960px) scale(${cam.z}) translate(${-cam.cx}px, ${-cam.cy}px)`;

  // ---- presença ----
  const guests = useMemo(() => convidados(steps, total), [steps, total]);
  const bolIn = bolinhaIn(steps);
  const bolK = Math.min(1, Math.max(0, (frame - bolIn) / 10));
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
        <CafeBack frame={0} />
        <AbsoluteFill style={{ background: "rgba(30,15,77,0.4)" }} /> {/* parede escura: a vitrine é o balcão */}
        {place("hank", <Hank frame={frame} talking={talking("hank")} emotion={frame < HOOK_B ? emoHank : emo("hank", onFecho ? "smile" : "bored")} size={ST.hank.size} />)}
        <CafeCounter frame={0} />
        {pal && (
          <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", left: 0, top: 0 }}>
            <g transform={`translate(${OBJ_X} ${COUNTER_Y + 4}) scale(${OBJ_SCALE})`}>
              {pal.cena
                ? <Cena cena={pal.cena} frame={frame} since={objSince} instant={mostra!.instant} uid={`${mostra!.palavra}`} />
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
          return <React.Fragment key={g.who + g.in}>{place(g.who as "lazy" | "duda", el, `translateX(${(1 - k) * 560}px)`)}</React.Fragment>;
        })}
        {place("capi", <Capi frame={frame} talking={talking("capi")} mood={capiMood} size={ST.capi.size} armUp={onFecho} />)}
      </AbsoluteFill>
    </AbsoluteFill>
  );

  // ---- adesivo de preço (palavra colada no objeto; espaço de tela, acompanha a câmera) ----
  let sticker: React.ReactNode = null;
  if (pal && mostra && !onFecho) {
    const h = pal.cena ? CENA_H : LAYOUT[pal.objeto!].h;
    const [sx, sy] = toScreen(cam, OBJ_X, COUNTER_Y - h * OBJ_SCALE - 30);
    const revelado = frame >= mostra.revelado;
    const since = revelado ? frame - mostra.revelado : frame - mostra.from;
    const show = revelado || mostra.oculto;
    const ativo = !!fala && fala.palavra === mostra.palavra && fala.lang === "en";
    const pulse = ativo ? 1 + 0.06 * Math.max(0, 1 - (frame - voiceStart(fala!)) / 5) : 1;
    const marca = pal.armadilha && revelado && steps.some((s) => s.papel === "apresenta" && s.palavra === mostra.palavra && voiceStart(s) <= frame)
      && !(frame >= finalFrom) && cur.papel !== "revisao" ? pal.armadilha : null;
    if (show) {
      sticker = (
        <Adesivo x={sx} y={sy} z={cam.z} digito={mostra.oculto && !revelado ? "?" : pal.digito} palavra={mostra.oculto && !revelado ? "" : pal.en}
          enfase={pal.armadilha?.enfase} ativo={ativo} pop={mostra.instant || mostra.oculto ? 1 : spring({ frame: since, fps, config: { damping: 11, stiffness: 190 } })}
          pulse={pulse} marca={marca?.marca} marcaSince={frame - mostra.revelado - 8} />
      );
    }
  }
  // contexto da cena (PT, apoio): chip logo abaixo da janela, some na revisão final rápida e no fecho
  let contexto: React.ReactNode = null;
  if (pal?.cena && mostra && !onFecho && frame < finalFrom) {
    const [cx, cy] = toScreen(cam, OBJ_X, COUNTER_Y + 18);
    contexto = (
      <div style={{ position: "absolute", left: cx - 300, width: 600, top: cy, display: "flex", justifyContent: "center", transform: `scale(${cam.z})`, transformOrigin: "50% 0" }}>
        <ChipContexto text={pal.cena.contexto} opacity={mostra.instant ? 1 : Math.min(1, objSince / 8)} />
      </div>
    );
  }

  // ---- interface de tela ----
  const titleOn = !!p.hookTitle && frame < ganchoEnd - 30;
  const titleOut = interpolate(frame, [ganchoEnd - 40, ganchoEnd - 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const stripFrom = Math.max(HOOK_B + 6, ganchoEnd - 36);
  const armadilhaAt = ganchoStep ? ganchoStep.from + Math.round(ganchoStep.dur * 0.62) : 0; // "...têm pegadinha"
  const ativoIdx = fala && fala.lang === "en" && (fala.papel === "revisao" || fala.papel === "final") ? fala.palavra : undefined;

  let chip: React.ReactNode = null;
  if (cur.tipo === "suavez") {
    chip = <SuaVez since={frame - cur.from} fps={fps} frame={frame} remaining={(cur.from + cur.dur - frame) / fps} total={cur.dur / fps} />;
  } else if (cur.tipo === "pergunta" || (cur.papel === "desafio" && cur.tipo !== "fala")) {
    const per = cur.tipo === "pergunta" ? cur : steps[cur.i + 1];
    chip = <QualE since={frame - cur.from + (cur.tipo === "pergunta" ? 10 : 0)} fps={fps} remaining={(per.from + per.dur - Math.max(frame, per.from)) / fps} total={per.dur / fps} />;
  } else if (frame >= finalFrom && !onFecho) {
    chip = <Faixa text="todas, cada vez mais rápido" since={frame - finalFrom} fps={fps} />;
  }

  // legenda: só falas em PT (as palavras em inglês aparecem no adesivo, colado no objeto)
  let caption: React.ReactNode = null;
  const capStep = steps.filter((s) => s.tipo === "fala" && s.lang === "pt" && frame >= s.from && frame < s.from + s.dur + 6).pop();
  if (capStep && !onFecho && capStep.papel === "dica") {
    const prog = Math.min(1, (frame - voiceStart(capStep)) / Math.max(1, capStep.speechF ?? 1));
    caption = <FalaTopo nome={NOMES[capStep.speaker!]} text={capStep.text!} progress={prog} since={frame - capStep.from} fps={fps} />;
  } else if (capStep && !onFecho) {
    const sp = capStep.speaker!;
    const anchor: [number, number] = sp === "lazy"
      ? toScreen(cam, ST.lazy.left + ST.lazy.size * 0.48, ST.lazy.top + 10) as [number, number]
      : toScreen(cam, capiHeadX + 30, capiHeadTop) as [number, number];
    const prog = Math.min(1, (frame - voiceStart(capStep)) / Math.max(1, capStep.speechF ?? 1));
    caption = <Caption anchor={[Math.min(880, Math.max(100, anchor[0])), Math.min(1420, anchor[1])]} text={capStep.text!} lang="pt" progress={prog}
      pop={frame === 0 ? 1 : spring({ frame: frame - capStep.from, fps, config: { damping: 14 } })} fontSize={capStep.text!.length > 40 ? 48 : 54}
      minTop={titleOn ? 560 : SAFE.y0 + 200} />;
  }

  // ---- áudio ----
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
        <Faixa10 palavras={p.palavras} sabe={nSabe} ativo={ativoIdx} since={frame - stripFrom} marcas={frame >= armadilhaAt} fps={fps}
          prev={frame < ganchoEnd} />
      )}
      {contexto}
      {sticker}
      {chip}
      {titleOn && <HookTitle text={p.hookTitle!} top={TITLE_TOP} out={titleOut} />}
      {caption}
      {onFecho && fecho && <CardFinal titulo={p.card?.titulo ?? ""} sub={p.card?.sub} cta={p.card?.cta} since={frame - fecho.from} fps={fps} />}
      <Watermark lead={<CafeSeal serie={p.serie ? { temporada: 0, capitulo: 0, episodio: 0, codigo: p.serie.codigo, tituloCapitulo: "",
        progresso: nSabe > 0 ? `você já sabe ${nSabe} palavra${nSabe > 1 ? "s" : ""}` : p.serie.titulo } : undefined} />} />
    </AbsoluteFill>
  );
};

// Adesivo de preço do café: dígito + palavra. A palavra fica AMARELA só enquanto alguém a diz (único amarelo do quadro).
// `enfase` = sílaba forte maior (SEV-en). `marca` = armadilha do brasileiro, chip lilás embaixo.
const Adesivo: React.FC<{
  x: number; y: number; z: number; digito: string; palavra: string; enfase?: string; ativo: boolean; pop: number; pulse: number;
  marca?: string; marcaSince: number;
}> = ({ x, y, z, digito, palavra, enfase, ativo, pop, pulse, marca, marcaSince }) => {
  const word = enfase && palavra.toLowerCase().startsWith(enfase.toLowerCase())
    ? <><span style={{ fontSize: 104 }}>{palavra.slice(0, enfase.length).toUpperCase()}</span>{palavra.slice(enfase.length)}</>
    : palavra;
  const W = 470;
  return (
    <div style={{ position: "absolute", left: x - W / 2, top: y, width: W, transform: `translateY(-100%) scale(${z * Math.max(0.01, pop) * pulse})`, transformOrigin: "50% 100%" }}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 16, background: C.creme, border: `8px solid ${C.tinta}`, borderRadius: 30,
          boxShadow: `0 10px 0 ${C.tinta}`, padding: "8px 26px 8px 14px", transform: "rotate(-2deg)", position: "relative",
        }}>
          <div style={{ position: "absolute", left: -14, top: "50%", width: 22, height: 22, marginTop: -11, borderRadius: 11, background: C.noite, border: `6px solid ${C.tinta}` }} />
          {digito && <div style={{ minWidth: 92, height: 92, borderRadius: 22, background: C.roxo, color: C.creme, fontFamily: TITLE, fontSize: 76, lineHeight: "92px", textAlign: "center", padding: "0 8px" }}>{digito}</div>}
          {palavra && (
            <div style={{
              fontFamily: TITLE, fontSize: 84, lineHeight: 1.05, color: C.tinta, padding: "0 12px", borderRadius: 16,
              background: ativo ? C.amarelo : "transparent", whiteSpace: "nowrap",
            }}>{word}</div>
          )}
        </div>
      </div>
      {marca && marcaSince >= 0 && (
        <div style={{ display: "flex", justifyContent: "center", marginTop: 18, transform: `scale(${Math.min(1, 0.6 + marcaSince / 15)})`, opacity: Math.min(1, marcaSince / 6) }}>
          <div style={{ background: C.lilas, color: "#fff", fontFamily: BODY, fontWeight: 800, fontSize: 36, borderRadius: 18, padding: "6px 18px", border: `5px solid ${C.tinta}`, whiteSpace: "nowrap" }}>
            <span style={{ display: "inline-block", width: 34, height: 34, borderRadius: 17, background: C.tangerina, color: C.tinta, fontFamily: TITLE, fontSize: 26, lineHeight: "34px", textAlign: "center", marginRight: 10 }}>!</span>
            {marca}
          </div>
        </div>
      )}
      {/* barbante até o objeto */}
      <svg width={W} height={40} style={{ position: "absolute", left: 0, top: "100%", overflow: "visible", opacity: marca ? 0 : 1 }}>
        <path d={`M${W / 2} 0 L${W / 2} 30`} stroke={C.creme} strokeWidth={4} strokeDasharray="2 8" strokeLinecap="round" />
      </svg>
    </div>
  );
};

const Mic: React.FC<{ size: number; frame: number }> = ({ size, frame }) => (
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

const CHIP_TOP = 444;
const NOMES: Record<VocabActor, string> = { capi: "Capy", hank: "Hank", lazy: "Lazy", duda: "Duda", bolinha: "Bolinha" };
// Fala em PT de apoio (dica de pronúncia) na faixa do topo: não cobre o objeto nem o adesivo.
const FalaTopo: React.FC<{ nome: string; text: string; progress: number; since: number; fps: number }> = ({ nome, text, progress, since, fps }) => {
  const s = spring({ frame: since, fps, config: { damping: 14 } });
  const words = text.split(/\s+/);
  const active = progress >= 1 ? -1 : Math.floor(progress * words.length);
  return (
    <div style={{ position: "absolute", left: SAFE.x0 + 10, width: SAFE.x1 - SAFE.x0 - 20, top: CHIP_TOP, opacity: s, transform: `translateY(${(1 - s) * -20}px)` }}>
      <div style={{ background: "#fff", border: `7px solid ${C.tinta}`, borderRadius: 30, boxShadow: `0 8px 0 ${C.tinta}`, padding: "14px 26px 16px", textAlign: "center", position: "relative" }}>
        <div style={{ fontFamily: TITLE, fontSize: 50, lineHeight: 1.12, color: C.tinta, textWrap: "balance" as any }}>
          <span style={{ fontFamily: BODY, fontWeight: 800, fontSize: 26, color: C.creme, background: C.roxo, borderRadius: 12, padding: "3px 12px", marginRight: 12, verticalAlign: "middle", position: "relative", top: -5 }}>{nome}</span>
          {words.map((w, i) => <span key={i} style={{ color: i === active ? C.tangerina : C.tinta }}>{w}{i < words.length - 1 ? " " : ""}</span>)}
        </div>
      </div>
    </div>
  );
};
// Marcador "sua vez": microfone + contador, sem escurecer a cena (o objeto e o adesivo continuam à vista).
const SuaVez: React.FC<{ since: number; fps: number; frame: number; remaining: number; total: number }> = ({ since, fps, frame, remaining, total }) => {
  const s = spring({ frame: since, fps, config: { damping: 13 } });
  return (
    <div style={{ position: "absolute", left: SAFE.x0 + 40, width: SAFE.x1 - SAFE.x0 - 80, top: CHIP_TOP, display: "flex", justifyContent: "center", transform: `scale(${0.85 + 0.15 * s})`, opacity: s }}>
      <div style={{ display: "flex", alignItems: "center", gap: 22, background: C.creme, border: `7px solid ${C.tinta}`, borderRadius: 34, boxShadow: `0 10px 0 ${C.tinta}`, padding: "10px 22px 10px 14px" }}>
        <Mic size={96} frame={frame} />
        <div style={{ fontFamily: TITLE, fontSize: 62, color: C.tinta, lineHeight: 1 }}>sua vez!</div>
        <CountRing remaining={Math.max(0.01, remaining)} total={total} size={100} />
      </div>
    </div>
  );
};
const QualE: React.FC<{ since: number; fps: number; remaining: number; total: number }> = ({ since, fps, remaining, total }) => {
  const s = spring({ frame: since, fps, config: { damping: 13 } });
  return (
    <div style={{ position: "absolute", left: SAFE.x0 + 40, width: SAFE.x1 - SAFE.x0 - 80, top: CHIP_TOP, display: "flex", justifyContent: "center", transform: `scale(${0.85 + 0.15 * s})`, opacity: s }}>
      <div style={{ display: "flex", alignItems: "center", gap: 26, background: C.creme, border: `7px solid ${C.tinta}`, borderRadius: 34, boxShadow: `0 10px 0 ${C.tinta}`, padding: "10px 22px 10px 30px" }}>
        <div style={{ fontFamily: TITLE, fontSize: 66, color: C.tinta, lineHeight: 1 }}>qual é?</div>
        <CountRing remaining={Math.max(0.01, remaining)} total={total} size={100} />
      </div>
    </div>
  );
};
const Faixa: React.FC<{ text: string; since: number; fps: number }> = ({ text, since, fps }) => {
  const s = spring({ frame: since, fps, config: { damping: 13 } });
  return (
    <div style={{ position: "absolute", left: SAFE.x0 + 40, width: SAFE.x1 - SAFE.x0 - 80, top: CHIP_TOP + 10, display: "flex", justifyContent: "center", opacity: s, transform: `translateY(${(1 - s) * -30}px)` }}>
      <div style={{ background: C.roxo, color: C.creme, fontFamily: TITLE, fontSize: 52, borderRadius: 28, padding: "10px 28px", border: `6px solid ${C.tinta}`, boxShadow: `0 8px 0 ${C.tinta}` }}>{text} »</div>
    </div>
  );
};

// Fileira 1–10 (glossário que se monta sozinho): dígito + palavra das já apresentadas. Na revisão/final a da vez acende em lilás.
const Faixa10: React.FC<{ palavras: VocabProps["palavras"]; sabe: number; ativo?: number; since: number; marcas: boolean; fps: number; prev: boolean }> = ({
  palavras, sabe, ativo, since, marcas, fps, prev,
}) => {
  const n = palavras.length;
  const gap = 8, w = Math.floor((SAFE.x1 - SAFE.x0 - gap * (n - 1)) / n);
  return (
    <div style={{ position: "absolute", left: SAFE.x0, top: 330, display: "flex", gap }}>
      {palavras.map((pw, k) => {
        const s = prev ? spring({ frame: since - k * 2, fps, config: { damping: 12 } }) : 1;
        const on = k < sabe;
        const at = k === ativo;
        return (
          <div key={k} style={{
            width: w, height: 96, borderRadius: 18, boxSizing: "border-box", border: `5px solid ${C.tinta}`, position: "relative",
            background: at ? C.lilas : on ? C.creme : "rgba(255,244,224,0.35)", transform: `scale(${Math.max(0, s) * (at ? 1.12 : 1)})`,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          }}>
            {pw.digito
              ? <><div style={{ fontFamily: TITLE, fontSize: 40, lineHeight: 1, color: at ? "#fff" : C.tinta }}>{pw.digito}</div>
                <div style={{ fontFamily: BODY, fontWeight: 800, fontSize: 17, lineHeight: 1.1, color: at ? "#fff" : C.roxo, opacity: on ? 1 : 0 }}>{pw.en}</div></>
              : <div style={{ fontFamily: TITLE, fontSize: Math.min(30, Math.floor((w - 10) / (0.55 * pw.en.length))), lineHeight: 1, color: at ? "#fff" : C.tinta, opacity: on ? 1 : 0.25 }}>{on ? pw.en : "?"}</div>}
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

// `cta` = a mesma pergunta que a Capy faz no fecho (padrão: a do protótipo)
const CardFinal: React.FC<{ titulo: string; sub?: string; cta?: string; since: number; fps: number }> = ({ titulo, sub, cta, since, fps }) => {
  const s = spring({ frame: since, fps, config: { damping: 13 } });
  return (
    <div style={{ position: "absolute", left: SAFE.x0 + 20, width: SAFE.x1 - SAFE.x0 - 40, top: 420, transform: `translateY(${(1 - s) * 700}px) rotate(-1.5deg)` }}>
      <div style={{ background: C.creme, border: `8px solid ${C.tinta}`, borderRadius: 34, boxShadow: `0 12px 0 ${C.tinta}`, padding: "30px 30px 34px", textAlign: "center" }}>
        <div style={{ fontFamily: TITLE, fontSize: 74, lineHeight: 1.05, color: C.tinta }}>{titulo} <span style={{ color: C.certo }}>✓</span></div>
        {sub && <div style={{ fontFamily: TITLE, fontSize: 60, color: C.roxo, marginTop: 14 }}>{sub}</div>}
        <div style={{ fontFamily: BODY, fontWeight: 800, fontSize: 36, color: C.tinta, marginTop: 22, opacity: Math.min(1, Math.max(0, (since - 20) / 8)) }}>{cta ?? "qual foi o mais difícil? comenta aí"}</div>
      </div>
    </div>
  );
};
