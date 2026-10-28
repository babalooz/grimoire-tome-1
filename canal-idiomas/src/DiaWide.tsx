import React, { useMemo } from "react";
import { AbsoluteFill, Audio, Freeze, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Capi } from "./Capi";
import { Hank } from "./chars/Hank";
import { CafeWide } from "./CafeWide";
import { AUDIT_BG, AuditCtx, useAudit } from "./lesson/audit";
import { MUSIC } from "./lesson/music";
import { CafeBackWide, CafeCounterWide } from "./sets/CafeSetWide";
import { Sfx } from "./Sitcom";
import { BODY, C, TITLE } from "./theme";
import { VocabWide } from "./VocabWide";
import { DiaBloco, DiaParte, DiaProps, corteJanela, diaBlocos, diaFrames } from "./wide/dia";
import { SAFE_W, STAGE_W, clampW } from "./wide/geo";
import { MarcaW } from "./wide/ui";

export { diaFrames };

// LONGO DO DIA em tela cheia 16:9: abertura (marca + o que tem hoje) → cartão + sitcom → cartão + vocabulário →
// cartão + corte de episódio já publicado (+ "episódio completo no canal") → encerramento (recap, próximo episódio SÓ
// se já agendado, inscrição sem urgência; metade direita livre para a tela final do YouTube). Sem voz nova: as vinhetas
// são só imagem + trilha CC0 do café; cada parte toca a própria voz em cache.
export const DiaWide: React.FC<DiaProps> = (p) => (
  <AuditCtx.Provider value={!!p.auditoria}><DiaInner {...p} /></AuditCtx.Provider>
);

const NUM = ["1", "2", "3", "4"];

const DiaInner: React.FC<DiaProps> = (p) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const blocos = useMemo(() => diaBlocos(p, fps), [p, fps]);
  // trilha das vinhetas: nível de respiro do café, com fade de 0,3 s nas bordas de cada vinheta
  const vinheta = (b: DiaBloco) => b.tipo !== "parte";
  const vol = (f: number) => {
    const b = blocos.find((x) => f >= x.from && f < x.from + x.dur);
    if (!b || !vinheta(b)) return 0;
    const k = Math.min(1, (f - b.from + 1) / 9, (b.from + b.dur - f) / 9);
    return 0.22 * Math.max(0, k);
  };

  return (
    <AbsoluteFill style={{ background: p.auditoria ? AUDIT_BG : C.noite }}>
      {!p.auditoria && Array.from({ length: Math.ceil(durationInFrames / MUSIC.loopFrames) }, (_, k) => (
        <Sequence key={`m${k}`} from={k * MUSIC.loopFrames} durationInFrames={MUSIC.loopFrames}>
          <Audio src={staticFile(MUSIC.src)} volume={(f) => vol(k * MUSIC.loopFrames + f)} />
        </Sequence>
      ))}
      {blocos.map((b, i) => (
        <Sequence key={i} from={b.from} durationInFrames={b.dur}>
          <Bloco b={b} p={p} />
        </Sequence>
      ))}
      {blocos.filter((b) => b.tipo === "cartao" || b.tipo === "cta").map((b, i) => (
        <Sfx key={`w${i}`} at={b.from} name={b.tipo === "cartao" ? "whoosh" : "stamp"} vol={0.35} />
      ))}
    </AbsoluteFill>
  );
};

const Bloco: React.FC<{ b: DiaBloco; p: DiaProps }> = ({ b, p }) => {
  const { fps } = useVideoConfig();
  const pt = b.parte !== undefined ? p.partes[b.parte] : undefined;
  if (b.tipo === "abertura") return <Abertura p={p} />;
  if (b.tipo === "encerramento") return <Encerramento p={p} />;
  if (b.tipo === "cartao") return <Cartao n={b.parte!} total={p.partes.length} pt={pt!} />;
  if (pt!.tipo === "cafe") return <CafeWide {...pt!.props} auditoria={p.auditoria} />;
  if (pt!.tipo === "vocab") return <VocabWide {...pt!.props} auditoria={p.auditoria} />;
  const w = corteJanela(pt as Extract<DiaParte, { tipo: "corte" }>, fps);
  if (b.tipo === "cta") {
    return (
      <AbsoluteFill>
        <Freeze frame={w.to - 1}><CafeWide {...pt!.props} corteDe={w.from} semAudio auditoria={p.auditoria} /></Freeze>
        <CtaW text={(pt as Extract<DiaParte, { tipo: "corte" }>).cta} />
      </AbsoluteFill>
    );
  }
  return <Sequence from={-w.from}><CafeWide {...pt!.props} corteDe={w.from} auditoria={p.auditoria} /></Sequence>;
};

// cenário parado com Capy e Hank (abertura e encerramento)
const Palco: React.FC<{ z: number; cx?: number; acena?: boolean; escuro?: number }> = ({ z, cx = 960, acena = false, escuro = 0 }) => {
  const frame = useCurrentFrame();
  if (useAudit()) return null;
  const c = clampW({ cx, cy: 540 + (z - 1) * 260, z });
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translate(960px, 540px) scale(${c.z}) translate(${-c.cx}px, ${-c.cy}px)`, transformOrigin: "0 0" }}>
        <CafeBackWide frame={frame} />
        <div style={{ position: "absolute", left: STAGE_W.hank.left, top: STAGE_W.hank.top }}>
          <Hank frame={frame} talking={false} emotion={acena ? "smile" : "bored"} size={STAGE_W.hank.size} />
        </div>
        <CafeCounterWide frame={frame} />
        <div style={{ position: "absolute", left: STAGE_W.capi.left, top: STAGE_W.capi.top }}>
          <Capi frame={frame} talking={false} mood="happy" size={STAGE_W.capi.size} armUp={acena} />
        </div>
      </AbsoluteFill>
      {escuro > 0 && <AbsoluteFill style={{ background: `rgba(30,15,77,${escuro})` }} />}
    </AbsoluteFill>
  );
};

const placa = { background: C.creme, border: `8px solid ${C.tinta}`, borderRadius: 36, boxShadow: `0 12px 0 ${C.tinta}` };

const Abertura: React.FC<{ p: DiaProps }> = ({ p }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // movimento nos 2 primeiros segundos: câmera abrindo do close na Capy para o café inteiro + placa da marca caindo
  const z = interpolate(frame, [0, 40], [1.5, 1], { extrapolateRight: "clamp", easing: (t) => 1 - Math.pow(1 - t, 3) });
  const cx = interpolate(frame, [0, 40], [STAGE_W.capi.head[0] + 140, 960], { extrapolateRight: "clamp", easing: (t) => 1 - Math.pow(1 - t, 3) });
  const logo = spring({ frame: frame - 4, fps, config: { damping: 11 } });
  const painel = spring({ frame: frame - 34, fps, config: { damping: 14 } });
  const escuro = interpolate(frame, [30, 44], [0, 0.55], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <Palco z={z} cx={cx} acena={frame > 20} escuro={escuro} />
      <div style={{ position: "absolute", left: 0, width: 1920, top: 96, display: "flex", justifyContent: "center", transform: `translateY(${(1 - logo) * -260}px) rotate(-2deg)` }}>
        <div style={{ ...placa, background: C.roxo, padding: "10px 46px 18px", textAlign: "center" }}>
          <div style={{ fontFamily: TITLE, fontSize: 104, lineHeight: 1, color: C.creme }}>CapyFala</div>
          <div style={{ fontFamily: BODY, fontWeight: 800, fontSize: 30, color: C.creme, opacity: 0.9 }}>inglês do básico, em episódios · {p.dataTexto}</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 460, width: 1000, top: 380, opacity: painel, transform: `translateY(${(1 - painel) * 60}px)` }}>
        <div style={{ ...placa, padding: "26px 40px 30px" }}>
          <div style={{ fontFamily: BODY, fontWeight: 800, fontSize: 34, color: C.roxo, letterSpacing: 1 }}>HOJE NO CAFÉ</div>
          {p.partes.map((pt, i) => {
            const s = spring({ frame: frame - 44 - i * 10, fps, config: { damping: 13 } });
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 16, opacity: s, transform: `translateX(${(1 - s) * 40}px)` }}>
                <div style={{ width: 64, height: 64, borderRadius: 18, background: C.roxo, color: C.creme, fontFamily: TITLE, fontSize: 44, lineHeight: "64px", textAlign: "center", flexShrink: 0 }}>{NUM[i]}</div>
                <div style={{ fontFamily: TITLE, fontSize: 50, lineHeight: 1.05, color: C.tinta }}>
                  <span style={{ color: C.roxo }}>{pt.rotulo}:</span> {pt.titulo}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <MarcaW />
    </AbsoluteFill>
  );
};

const Cartao: React.FC<{ n: number; total: number; pt: DiaParte }> = ({ n, total, pt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 12 } });
  const out = interpolate(frame, [60, 75], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <Palco z={1.06 + 0.04 * frame / 75} escuro={0.72} />
      <div style={{ position: "absolute", left: 360, width: 1200, top: 300, transform: `scale(${(0.8 + 0.2 * s) * (1 - 0.08 * out)}) rotate(-1.5deg)`, opacity: s * (1 - out) }}>
        <div style={{ ...placa, padding: "30px 50px 40px", textAlign: "center" }}>
          <div style={{ display: "inline-block", fontFamily: TITLE, fontSize: 40, color: C.creme, background: C.roxo, borderRadius: 20, padding: "4px 24px" }}>
            {n + 1} de {total} · {pt.rotulo.toUpperCase()}
          </div>
          <div style={{ fontFamily: TITLE, fontSize: 96, lineHeight: 1.05, color: C.tinta, marginTop: 20, textWrap: "balance" as any }}>{pt.titulo}</div>
        </div>
      </div>
      <MarcaW />
    </AbsoluteFill>
  );
};

const CtaW: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 11 } });
  const dim = interpolate(frame, [0, 8], [0, 0.72], { extrapolateRight: "clamp" }) * (useAudit() ? 0 : 1);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: `rgba(30,15,77,${dim})` }} />
      <div style={{ position: "absolute", left: 360, width: 1200, top: 380, transform: `scale(${s}) rotate(-2deg)`, textAlign: "center" }}>
        <div style={{ ...placa, background: C.creme, padding: "30px 40px", fontFamily: TITLE, fontSize: 80, lineHeight: 1.05, color: C.tinta }}>{text}</div>
      </div>
    </AbsoluteFill>
  );
};

const Encerramento: React.FC<{ p: DiaProps }> = ({ p }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 14 } });
  const linha = (k: number) => spring({ frame: frame - 10 - k * 8, fps, config: { damping: 13 } });
  return (
    <AbsoluteFill>
      <Palco z={1} acena escuro={0.45} />
      {/* metade esquerda: recap; metade direita fica livre para os elementos da tela final do YouTube */}
      <div style={{ position: "absolute", left: SAFE_W.x0, width: 980, top: 150, opacity: s, transform: `translateX(${(1 - s) * -80}px)` }}>
        <div style={{ ...placa, padding: "28px 40px 34px" }}>
          <div style={{ fontFamily: BODY, fontWeight: 800, fontSize: 34, color: C.roxo, letterSpacing: 1 }}>HOJE VOCÊ VIU</div>
          {p.recap.map((r, k) => (
            <div key={k} style={{ fontFamily: TITLE, fontSize: 48, lineHeight: 1.1, whiteSpace: "nowrap", color: C.tinta, marginTop: 12, opacity: linha(k) }}>
              <span style={{ color: C.certo }}>✓</span> {r}
            </div>
          ))}
          {p.proximo && (
            <div style={{ fontFamily: TITLE, fontSize: 42, lineHeight: 1.1, color: C.roxo, marginTop: 26, opacity: linha(p.recap.length) }}>próximo episódio: {p.proximo}</div>
          )}
          <div style={{ fontFamily: BODY, fontWeight: 800, fontSize: 34, color: C.tinta, marginTop: 24, opacity: linha(p.recap.length + 1) }}>
            inscreva-se no CapyFala para acompanhar a série
          </div>
        </div>
      </div>
      <MarcaW />
    </AbsoluteFill>
  );
};
