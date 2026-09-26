import React from "react";
import { AbsoluteFill } from "remotion";
import { Capi } from "./Capi";
import { C, TITLE, BODY } from "./theme";

// Foto de perfil (800x800) e banner do YouTube (2560x1440, área segura central 1546x423).
export const Avatar: React.FC = () => (
  <AbsoluteFill style={{ background: C.roxo, alignItems: "center", justifyContent: "center" }}>
    <div style={{ position: "absolute", width: 700, height: 700, borderRadius: 350, background: C.amarelo, opacity: 0.18 }} />
    <div style={{ marginTop: 120 }}><Capi frame={40} talking={false} mood="happy" size={620} /></div>
  </AbsoluteFill>
);

export const Banner: React.FC = () => (
  <AbsoluteFill style={{ background: C.roxo, alignItems: "center", justifyContent: "center" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 60, marginTop: 40 }}>
      <div style={{ marginTop: 60 }}><Capi frame={40} talking={false} mood="zen" size={300} /></div>
      <div>
        <div style={{ fontFamily: TITLE, fontSize: 150, color: "#fff", WebkitTextStroke: `12px ${C.tinta}`, paintOrder: "stroke fill", textShadow: `0 10px 0 ${C.tinta}` }}>
          Capy<span style={{ color: C.amarelo }}>Fala</span>
        </div>
        <div style={{ fontFamily: BODY, fontWeight: 800, fontSize: 52, color: C.creme }}>Inglês de verdade, um mico por dia 🇧🇷➡️🇺🇸</div>
      </div>
    </div>
  </AbsoluteFill>
);
