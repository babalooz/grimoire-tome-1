import React from "react";
import { Capi } from "./Capi";
import { C, SAFE, TITLE } from "./theme";

// Marca dentro do vídeo (Shorts não mostra marca d'água do canal): Capy + @acapyfala.
// Fica no TOPO ESQUERDO da zona segura (y ≥ 260, x ≤ 920): a coluna de botões do TikTok cobre a direita de y≈900 a 1700
// e a descrição cobre y>1500. `lead` (selo da série / badge do dia) entra na mesma linha, antes da marca, sem colidir.
export const BRAND_ROW = { top: SAFE.y0 + 4, h: 44 };

export const Watermark: React.FC<{ lead?: React.ReactNode; top?: number }> = ({ lead, top = BRAND_ROW.top }) => (
  <div style={{
    position: "absolute", left: SAFE.x0, top, height: BRAND_ROW.h, maxWidth: SAFE.x1 - SAFE.x0, display: "flex", alignItems: "center", gap: 10,
  }}>
    {lead && <div style={{ minWidth: 0, flexShrink: 1, display: "flex" }}>{lead}</div>}
    <div style={{
      flexShrink: 0, display: "flex", alignItems: "center", gap: 8, height: BRAND_ROW.h, boxSizing: "border-box",
      background: "rgba(30,15,77,0.72)", borderRadius: 22, padding: "0 14px 0 3px", opacity: 0.9,
    }}>
      <div style={{ width: 38, height: 38, overflow: "hidden", borderRadius: 19, background: C.amarelo }}>
        <div style={{ marginLeft: -5, marginTop: 2 }}><Capi frame={40} talking={false} mood="zen" size={48} /></div>
      </div>
      <span style={{ fontFamily: TITLE, fontSize: 27, color: "#fff", whiteSpace: "nowrap" }}>@acapyfala</span>
    </div>
  </div>
);
