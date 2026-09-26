import React from "react";

// "Capi" — capivara original do canal (NÃO usar nada parecido com a coruja do Duolingo).
export const Mascot: React.FC<{ talking: boolean; frame: number; mood: "normal" | "happy" | "shock" }> = ({
  talking,
  frame,
  mood,
}) => {
  const mouthOpen = talking ? Math.abs(Math.sin(frame / 2.2)) : 0;
  const bob = Math.sin(frame / 8) * 6;
  const blink = frame % 90 < 4;
  return (
    <svg width={420} height={420} viewBox="0 0 200 200" style={{ transform: `translateY(${bob}px)` }}>
      {/* orelhas */}
      <ellipse cx="58" cy="52" rx="14" ry="11" fill="#8a5a3c" />
      <ellipse cx="142" cy="52" rx="14" ry="11" fill="#8a5a3c" />
      {/* cabeça */}
      <rect x="35" y="45" width="130" height="115" rx="52" fill="#b27a52" />
      {/* focinho */}
      <rect x="55" y="105" width="90" height="55" rx="27" fill="#9c6743" />
      <ellipse cx="85" cy="118" rx="6" ry="4" fill="#3b2418" />
      <ellipse cx="115" cy="118" rx="6" ry="4" fill="#3b2418" />
      {/* olhos */}
      {blink ? (
        <>
          <rect x="62" y="84" width="22" height="4" rx="2" fill="#2a1a10" />
          <rect x="116" y="84" width="22" height="4" rx="2" fill="#2a1a10" />
        </>
      ) : (
        <>
          <circle cx="73" cy="85" r={mood === "shock" ? 13 : 11} fill="#fff" />
          <circle cx="127" cy="85" r={mood === "shock" ? 13 : 11} fill="#fff" />
          <circle cx="75" cy="87" r="6" fill="#2a1a10" />
          <circle cx="129" cy="87" r="6" fill="#2a1a10" />
        </>
      )}
      {/* boca */}
      {mood === "happy" && !talking ? (
        <path d="M82 136 Q100 152 118 136" stroke="#3b2418" strokeWidth="5" fill="none" strokeLinecap="round" />
      ) : (
        <ellipse cx="100" cy="140" rx="14" ry={3 + mouthOpen * 9} fill="#3b2418" />
      )}
      {/* óculos de professora */}
      <g stroke="#ffcc00" strokeWidth="4" fill="none">
        <circle cx="73" cy="85" r="17" />
        <circle cx="127" cy="85" r="17" />
        <line x1="90" y1="85" x2="110" y2="85" />
      </g>
    </svg>
  );
};
