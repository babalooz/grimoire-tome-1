import React from "react";
import { Capi } from "./Capi";
import { C, TITLE } from "./theme";

// Marca dentro do vídeo (Shorts não mostra marca d'água do canal): Capy + @acapyfala, canto inferior direito da zona segura.
export const Watermark: React.FC = () => (
  <div style={{
    position: "absolute", right: 1080 - 940, top: 1370, display: "flex", alignItems: "center", gap: 8,
    background: "rgba(30,15,77,0.72)", borderRadius: 30, padding: "4px 16px 4px 6px", opacity: 0.9,
  }}>
    <div style={{ width: 44, height: 44, overflow: "hidden", borderRadius: 22, background: C.amarelo }}>
      <div style={{ marginLeft: -6, marginTop: 2 }}><Capi frame={40} talking={false} mood="zen" size={56} /></div>
    </div>
    <span style={{ fontFamily: TITLE, fontSize: 30, color: "#fff" }}>@acapyfala</span>
  </div>
);
