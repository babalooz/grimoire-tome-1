import React from "react";
import { AbsoluteFill } from "remotion";
import { Capi } from "./Capi";
import { Hank } from "./chars/Hank";
import { CafeBackWide, CafeCounterWide } from "./sets/CafeSetWide";
import { BODY, C, TITLE } from "./theme";
import { STAGE_W } from "./wide/geo";

// Miniatura 1280x720 do longo do dia: Capy + a frase do dia GRANDE (lê em 168x94, tamanho da lista de sugeridos),
// 1 chip curto de contexto. Visual de série adulta: fundo do café escurecido, sem confete, sem arco-íris, sem
// letra infantil; mesma tipografia/cores do canal (só a frase-alvo em amarelo).
export type MiniaturaProps = { frase: string; tag: string; extra?: string };

export const MiniaturaWide: React.FC<MiniaturaProps> = ({ frase, tag, extra }) => (
  <AbsoluteFill style={{ background: C.noite, overflow: "hidden" }}>
    <AbsoluteFill style={{ transform: "scale(0.6667)", transformOrigin: "0 0", width: 1920, height: 1080 }}>
      <CafeBackWide frame={0} />
      <div style={{ position: "absolute", left: STAGE_W.hank.left + 300, top: STAGE_W.hank.top + 40 }}>
        <Hank frame={0} talking={false} emotion="eyebrow" size={STAGE_W.hank.size} />
      </div>
      <CafeCounterWide frame={0} />
    </AbsoluteFill>
    <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(30,15,77,0.92) 0%, rgba(30,15,77,0.75) 52%, rgba(30,15,77,0.1) 80%)" }} />
    <div style={{ position: "absolute", right: -10, bottom: -110 }}>
      <Capi frame={30} talking mood="happy" size={560} armUp />
    </div>
    <div style={{ position: "absolute", left: 56, top: 70, width: 760 }}>
      <div style={{ display: "inline-block", fontFamily: BODY, fontWeight: 800, fontSize: 34, color: C.tinta, background: C.creme, borderRadius: 16, padding: "4px 18px", border: `5px solid ${C.tinta}` }}>{tag}</div>
      <div style={{ marginTop: 26, fontFamily: TITLE, fontSize: 150, lineHeight: 1.0, color: C.tinta }}>
        <span style={{ background: C.amarelo, borderRadius: 26, padding: "0 22px", border: `8px solid ${C.tinta}`, boxShadow: `0 12px 0 ${C.tinta}`,
          boxDecorationBreak: "clone" as any, WebkitBoxDecorationBreak: "clone" as any, lineHeight: 1.35 }}>{frase}</span>
      </div>
      {extra && <div style={{ marginTop: 34, fontFamily: TITLE, fontSize: 58, lineHeight: 1.05, color: C.creme }}>{extra}</div>}
    </div>
  </AbsoluteFill>
);
