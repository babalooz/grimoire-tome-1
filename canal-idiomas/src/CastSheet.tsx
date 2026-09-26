import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Capi } from "./Capi";
import { CAPI_MOOD } from "./Sitcom";
import { Bolinha, BOLINHA_BOX } from "./chars/Bolinha";
import { DonaJaca, JACA_BOX } from "./chars/DonaJaca";
import { Duda, DUDA_BOX } from "./chars/Duda";
import { Hank, HANK_BOX } from "./chars/Hank";
import { Lazy, LAZY_BOX } from "./chars/Lazy";
import { Poppy, POPPY_BOX, PoppyEmotion } from "./chars/Poppy";
import { Emotion } from "./chars/common";
import { C, BODY, TITLE } from "./theme";

// Folha do elenco CapyFala: 2–3 expressões por personagem + teste de silhueta a 64 px (preto chapado e cor).
// Tamanhos pela ALTURA do viewBox de cada um (comparável entre personagens).
const CAPI_BOX = { w: 580, h: 760 };
type Box = { w: number; h: number };
const byH = (box: Box, h: number) => (h * box.w) / box.h;

type Pose = { e: Emotion | PoppyEmotion; t?: boolean; label: string; cheeks?: number };
type Char = { name: string; tag: string; box: Box; pad?: number; poses: Pose[]; render: (p: Pose, size: number, frame: number) => React.ReactNode };

const CAST: Char[] = [
  { name: "Capy", tag: "capivara zen · protagonista", box: CAPI_BOX,
    poses: [{ e: "zen", label: "zen" }, { e: "neutral", t: true, label: "falando" }, { e: "panic", label: "pânico" }],
    render: (p, s, f) => <Capi frame={f} talking={!!p.t} mood={CAPI_MOOD[p.e as Emotion]} size={s} sweat={p.e === "panic" ? 2 : 0} /> },
  { name: "Lazy", tag: "bicho-preguiça · sussurra", box: LAZY_BOX,
    poses: [{ e: "neutral", label: "neutro" }, { e: "whisper", t: true, label: "sussurro" }, { e: "surprised", label: "susto" }],
    render: (p, s, f) => <Lazy frame={f} talking={!!p.t} emotion={p.e as Emotion} size={s} /> },
  { name: "Duda", tag: "panda-vermelho · confiante e errada", box: DUDA_BOX,
    poses: [{ e: "neutral", label: "convicta" }, { e: "happy", t: true, label: "falando" }, { e: "panic", label: "pânico" }],
    render: (p, s, f) => <Duda frame={f} talking={!!p.t} emotion={p.e as Emotion} size={s} /> },
  { name: "Poppy", tag: "axolote · influencer", box: POPPY_BOX,
    poses: [{ e: "neutral", label: "blasé" }, { e: "happy", t: true, label: "falando" }, { e: "dead", label: "morreu (cringe)" }],
    render: (p, s, f) => <Poppy frame={f} talking={!!p.t} emotion={p.e} size={s} /> },
  { name: "Hank", tag: "panda-gigante · dono do Bean There", box: HANK_BOX,
    poses: [{ e: "bored", label: "cara fechada" }, { e: "eyebrow", t: true, label: "falando" }, { e: "angry", label: "bravo" }],
    render: (p, s, f) => <Hank frame={f} talking={!!p.t} emotion={p.e as Emotion} size={s} /> },
  { name: "Dona Jaca", tag: "mãe da Capy · videochamada", box: JACA_BOX,
    poses: [{ e: "neutral", t: true, label: "falando" }, { e: "angry", label: "cobrando" }],
    render: (p, s, f) => <DonaJaca frame={f} talking={!!p.t} emotion={p.e as Emotion} size={s} /> },
  { name: "Bolinha", tag: "hamster · revisão espaçada", box: BOLINHA_BOX, pad: 1.45,
    poses: [{ e: "neutral", label: "vazio", cheeks: 0 }, { e: "smile", label: "guardando", cheeks: 0.55 }, { e: "surprised", label: "lotado", cheeks: 1 }],
    render: (p, s, f) => <Bolinha frame={f} talking={!!p.t} emotion={p.e as Emotion} size={s} cheeks={p.cheeks} /> },
];

const Card: React.FC<{ c: Char; h: number; frame: number }> = ({ c, h, frame }) => (
  <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: 28, padding: "18px 26px 14px", display: "flex", flexDirection: "column", gap: 6 }}>
    <div style={{ fontFamily: TITLE, fontSize: 46, color: C.amarelo, whiteSpace: "nowrap", lineHeight: 1 }}>{c.name}</div>
    <div style={{ fontFamily: BODY, fontSize: 22, color: C.creme, opacity: 0.8, whiteSpace: "nowrap" }}>{c.tag}</div>
    <div style={{ display: "flex", gap: 22, alignItems: "flex-end", height: h + 20, paddingTop: 20 }}>
      {c.poses.map((p) => (
        <div key={p.label} style={{ width: byH(c.box, h) * (c.pad ?? 1), display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ height: h, display: "flex", alignItems: "flex-end" }}>{c.render(p, byH(c.box, h), frame)}</div>
        </div>
      ))}
    </div>
    <div style={{ display: "flex", gap: 22 }}>
      {c.poses.map((p) => (
        <div key={p.label} style={{ width: byH(c.box, h) * (c.pad ?? 1), textAlign: "center", fontFamily: BODY, fontWeight: 700, fontSize: 24, color: "#fff" }}>{p.label}</div>
      ))}
    </div>
  </div>
);

const SIL = 64;
const Row: React.FC<{ black?: boolean }> = ({ black }) => (
  <div style={{ display: "flex", gap: 34, alignItems: "flex-end", filter: black ? "brightness(0)" : undefined }}>
    {CAST.map((c) => (
      <div key={c.name} style={{ width: byH(c.box, SIL), height: SIL, display: "flex", alignItems: "flex-end" }}>
        {c.render({ e: c.poses[0].e, label: "" }, byH(c.box, SIL), 40)}
      </div>
    ))}
  </div>
);

export const CastSheet: React.FC = () => {
  const frame = useCurrentFrame() + 12;
  const H = 330;
  return (
    <AbsoluteFill style={{ background: C.roxo, padding: 36, gap: 26 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 24 }}>
        <div style={{ fontFamily: TITLE, fontSize: 64, color: "#fff" }}>CapyFala · elenco v1</div>
        <div style={{ fontFamily: BODY, fontSize: 28, color: C.creme, opacity: 0.75 }}>traço INK 9 px · formas redondas · silhueta distinta a 64 px</div>
      </div>
      <div style={{ display: "flex", gap: 26 }}>
        <Card c={CAST[0]} h={H} frame={frame} />
        <Card c={CAST[1]} h={H} frame={frame} />
        <Card c={CAST[2]} h={H} frame={frame} />
      </div>
      <div style={{ display: "flex", gap: 26 }}>
        <Card c={CAST[3]} h={H} frame={frame} />
        <Card c={CAST[4]} h={H} frame={frame} />
        <Card c={CAST[5]} h={H} frame={frame} />
      </div>
      <div style={{ display: "flex", gap: 26 }}>
        <Card c={CAST[6]} h={H - 30} frame={frame} />
        <div style={{ background: "rgba(0,0,0,0.18)", borderRadius: 28, padding: "22px 36px", display: "flex", flexDirection: "column", gap: 26, justifyContent: "center" }}>
          <div style={{ fontFamily: TITLE, fontSize: 40, color: C.amarelo }}>teste de silhueta · 64 px de altura</div>
          <div style={{ background: "#fff", borderRadius: 16, padding: "18px 24px" }}><Row black /></div>
          <Row />
          <div style={{ fontFamily: BODY, fontSize: 22, color: C.creme, opacity: 0.75 }}>Capy · Lazy · Duda · Poppy · Hank · Dona Jaca · Bolinha</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
