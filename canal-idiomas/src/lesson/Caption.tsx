import React from "react";
import { BODY, C, SAFE, TITLE } from "../theme";

// Legenda em balão com a FRASE INTEIRA (quebra em até 2–3 linhas) e destaque karaokê na palavra falada.
// Fica na tela o passo todo (fala + pausa + tempo mínimo de leitura), nunca some no meio da leitura.
export const Caption: React.FC<{
  anchor: [number, number]; // ponta do rabicho
  text: string;
  lang: "pt" | "en";
  progress: number; // 0..1 dentro do áudio (≥1 = tudo lido)
  thought?: boolean;
  side?: "above" | "right"; // above = balão acima do ponto; right = balão à direita (rabicho para a esquerda)
  maxW?: number;
  fontSize?: number;
  pop?: number; // 0..1 (entrada)
  bars?: number; // exercício de ouvir: esconde o texto (não entrega a resposta) e mostra ondas de som animadas (valor = frame)
}> = ({ anchor, text: rawText, lang, progress, thought = false, side = "above", maxW = SAFE.x1 - SAFE.x0, fontSize = 58, pop = 1, bars }) => {
  const text = bars !== undefined ? "~~~~~~~~~~" : rawText;
  const words = text.split(/\s+/);
  const active = progress >= 1 ? -1 : Math.max(0, Math.min(words.length - 1, Math.floor(progress * words.length)));
  const padX = 34;
  const est = text.length * fontSize * 0.5 + (lang === "en" ? 90 : 0) + padX * 2;
  const w = Math.min(maxW, Math.max(260, est));
  const lines = Math.max(1, Math.ceil(est / w));
  const h = lines * fontSize * 1.14 + 44;
  const bg = thought ? "#EFE8FF" : "#fff";

  // rabicho: preenchimento sem contorno (entra 10 px no balão e apaga a borda) + 2 traços laterais
  const spike = (pts: [number, number][]) => (
    <>
      <path d={`M${pts[0][0]} ${pts[0][1]} L${pts[1][0]} ${pts[1][1]} L${pts[2][0]} ${pts[2][1]} Z`} fill={bg} />
      <path d={`M${pts[0][0]} ${pts[0][1]} L${pts[1][0]} ${pts[1][1]} L${pts[2][0]} ${pts[2][1]}`} fill="none" stroke={C.tinta} strokeWidth={7} strokeLinejoin="round" strokeLinecap="round" />
    </>
  );
  let left: number, bottomY: number, tail: React.ReactNode;
  if (side === "right") {
    left = anchor[0] + 34;
    const top = Math.min(SAFE.y1 - h, Math.max(SAFE.y0, anchor[1] - h / 2));
    bottomY = top + h;
    const ty = Math.min(h - 46, Math.max(46, anchor[1] - top));
    tail = (
      <svg width={60} height={h} style={{ position: "absolute", left: -40, top: 0, overflow: "visible" }}>
        {thought ? (
          <>
            <circle cx={26} cy={ty} r={13} fill={bg} stroke={C.tinta} strokeWidth={6} />
            <circle cx={6} cy={ty + 10} r={8} fill={bg} stroke={C.tinta} strokeWidth={5} />
          </>
        ) : spike([[50, ty - 22], [6, ty + 10], [50, ty + 20]])}
      </svg>
    );
  } else {
    left = Math.min(SAFE.x1 - w, Math.max(SAFE.x0, anchor[0] - w / 2));
    bottomY = Math.min(SAFE.y1, Math.max(SAFE.y0 + 90 + h, anchor[1] - (thought ? 70 : 34)));
    const tx = Math.min(w - 50, Math.max(50, anchor[0] - left));
    const dx = anchor[0] - left > tx ? 34 : anchor[0] - left < tx ? -34 : 0;
    tail = (
      <svg width={w} height={60} style={{ position: "absolute", left: 0, top: "100%", marginTop: -8, overflow: "visible" }}>
        {thought ? (
          <>
            <circle cx={tx} cy={26} r={15} fill={bg} stroke={C.tinta} strokeWidth={6} />
            <circle cx={tx + dx * 0.5} cy={58} r={9} fill={bg} stroke={C.tinta} strokeWidth={5} />
          </>
        ) : spike([[tx - 24, 0], [tx + dx, 40], [tx + 24, 0]])}
      </svg>
    );
  }
  const scale = 0.88 + 0.12 * pop;
  return (
    <div style={{
      position: "absolute", left, top: bottomY, width: w, transform: `translateY(-100%) scale(${scale})`, opacity: Math.min(1, pop * 2),
      transformOrigin: side === "right" ? "0% 50%" : "50% 100%",
    }}>
      <div style={{
        position: "relative", background: bg, borderRadius: 32, border: `7px ${thought ? "dashed" : "solid"} ${C.tinta}`, boxShadow: `0 8px 0 ${C.tinta}`,
        padding: `16px ${padX}px 18px`, fontFamily: TITLE, fontSize, lineHeight: 1.14, color: C.tinta, textAlign: "center", textWrap: "balance" as any,
      }}>
        {lang === "en" && (
          <span style={{ fontFamily: BODY, fontWeight: 800, fontSize: 28, color: "#fff", background: C.roxo, borderRadius: 12, padding: "4px 10px", marginRight: 12, verticalAlign: "middle", position: "relative", top: -6 }}>EN</span>
        )}
        {bars !== undefined ? (
          <span style={{ display: "inline-flex", gap: 8, alignItems: "center", height: fontSize * 1.14, verticalAlign: "middle" }}>
            {Array.from({ length: 9 }, (_, i) => (
              <span key={i} style={{ display: "inline-block", width: 12, borderRadius: 6, background: i % 2 ? C.roxo : C.tangerina, height: 12 + Math.abs(Math.sin(bars / 3.2 + i * 0.8)) * fontSize * 0.8 }} />
            ))}
          </span>
        ) : words.map((wd, i) => (
          <span key={i} style={{ color: i === active ? C.tangerina : C.tinta }}>{wd}{i < words.length - 1 ? " " : ""}</span>
        ))}
      </div>
      {tail}
    </div>
  );
};
