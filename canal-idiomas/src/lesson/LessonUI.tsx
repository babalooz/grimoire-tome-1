import React from "react";
import { Easing, interpolate, spring } from "remotion";
import { BODY, C, SAFE, TITLE } from "../theme";

// Interface de "app de idiomas" própria da CapyFala (nada de Duolingo: roxo/amarelo/creme, turquesa = certo, coral = errado).
// Tudo em coordenadas de tela 1080x1920, dentro da zona segura x 60–940 / y 200–1436.

export const L = {
  sealY: SAFE.y0, // selo da série "T1 E01 · capítulo" (SeriesSeal), acima da barra
  barY: 252,
  chipY: 326,
  cardY: 406,
  optY: 676,
  optH: 120,
  optGap: 24,
  capi: { left: 0, top: 1116, size: 340 },
  capiMouth: [350, 1282] as [number, number], // ponta do focinho da Capy na lição (âncora do balão lateral)
};
const W = SAFE.x1 - SAFE.x0;
const CARD_SHADOW = `0 10px 0 ${C.tinta}`;

// ---------- fundo ----------
export const LessonBg: React.FC<{ frame: number }> = ({ frame }) => (
  <div style={{ position: "absolute", inset: 0, background: C.roxo, overflow: "hidden" }}>
    <div style={{ position: "absolute", inset: -200, backgroundImage: `radial-gradient(${"rgba(255,255,255,0.07)"} 7px, transparent 8px)`, backgroundSize: "72px 72px", transform: `translate(${(frame * 0.5) % 72}px, ${(frame * 0.35) % 72}px)` }} />
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 38%, rgba(140,108,255,0.45) 0%, transparent 60%)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 560, background: `linear-gradient(transparent, ${C.noite})` }} />
  </div>
);

// ---------- barra de topo: progresso · corações · XP ----------
const Heart: React.FC<{ lost: number; frame: number; i: number }> = ({ lost, frame, i }) => {
  // lost: 0 = inteiro, >0 = frames desde que quebrou
  const beat = 1 + Math.max(0, Math.sin((frame + i * 9) / 7)) * 0.04;
  const d = "M30 52 C8 38 2 26 4 16 C6 6 16 2 23 4 C27 5 29 8 30 11 C31 8 33 5 37 4 C44 2 54 6 56 16 C58 26 52 38 30 52 Z";
  if (lost <= 0) {
    return (
      <svg width={62} height={58} viewBox="0 0 60 56" style={{ transform: `scale(${beat})` }}>
        <path d={d} fill={C.errado} stroke={C.tinta} strokeWidth={5} strokeLinejoin="round" />
        <ellipse cx={18} cy={17} rx={6} ry={4} fill="#fff" opacity={0.6} transform="rotate(-30 18 17)" />
      </svg>
    );
  }
  const k = interpolate(lost, [0, 14], [0, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const pop = lost < 10 ? 1 + Math.sin((lost / 10) * Math.PI) * 0.35 : 1;
  return (
    <svg width={62} height={58} viewBox="0 0 60 56" style={{ transform: `scale(${pop})`, overflow: "visible" }}>
      <clipPath id={`hl${i}`}><rect x={-10} y={-10} width={40} height={80} /></clipPath>
      <clipPath id={`hr${i}`}><rect x={30} y={-10} width={40} height={80} /></clipPath>
      <g transform={`translate(${-6 * k} ${4 * k}) rotate(${-14 * k} 30 50)`}><path d={d} clipPath={`url(#hl${i})`} fill="#8E7FB8" stroke={C.tinta} strokeWidth={5} /></g>
      <g transform={`translate(${6 * k} ${4 * k}) rotate(${14 * k} 30 50)`}><path d={d} clipPath={`url(#hr${i})`} fill="#8E7FB8" stroke={C.tinta} strokeWidth={5} /></g>
      <path d={`M30 11 L25 22 L33 30 L27 40 L30 52`} transform={`translate(0 ${4 * k})`} fill="none" stroke={C.tinta} strokeWidth={4} opacity={k} />
    </svg>
  );
};

const Bolt: React.FC = () => (
  <svg width={40} height={46} viewBox="0 0 40 46">
    <path d="M24 2 L6 26 L19 26 L14 44 L34 18 L21 18 Z" fill={C.amarelo} stroke={C.tinta} strokeWidth={4.5} strokeLinejoin="round" />
  </svg>
);

export const TopBar: React.FC<{ frame: number; fps: number; progress: number; heartsLostAt: number[]; xp: number; xpBumpSince: number }> = ({
  frame, fps, progress, heartsLostAt, xp, xpBumpSince,
}) => {
  const bump = xpBumpSince >= 0 && xpBumpSince < 20 ? 1 + Math.sin((xpBumpSince / 20) * Math.PI) * 0.18 : 1;
  const barW = 440;
  return (
    <div style={{ position: "absolute", left: SAFE.x0, top: L.barY, width: W, height: 64, display: "flex", alignItems: "center", gap: 18 }}>
      <div style={{ position: "relative", width: barW, height: 40, borderRadius: 20, background: C.noite, border: `6px solid ${C.tinta}`, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${Math.max(0.06, progress) * 100}%`, background: C.amarelo, borderRadius: 20 }}>
          <div style={{ position: "absolute", left: 12, right: 12, top: 5, height: 8, borderRadius: 4, background: "rgba(255,255,255,0.55)" }} />
        </div>
      </div>
      <div style={{ display: "flex", gap: 4 }}>
        {[0, 1, 2].map((i) => (
          <Heart key={i} i={i} frame={frame} lost={heartsLostAt[i] !== undefined && frame >= heartsLostAt[i] ? frame - heartsLostAt[i] + 1 : 0} />
        ))}
      </div>
      <div style={{
        marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, background: C.creme, border: `6px solid ${C.tinta}`, borderRadius: 32,
        padding: "2px 16px 2px 8px", boxShadow: `0 6px 0 ${C.tinta}`, transform: `scale(${bump})`,
      }}>
        <Bolt />
        <div style={{ fontFamily: TITLE, fontSize: 40, color: C.tinta, lineHeight: "54px", whiteSpace: "nowrap" }}>{xp} XP</div>
      </div>
    </div>
  );
};

// "+10 XP" que salta do cartão e voa até o contador.
export const XpPop: React.FC<{ since: number; amount: number; fps: number }> = ({ since, amount, fps }) => {
  if (since < 0 || since > 42) return null;
  const s = spring({ frame: since, fps, config: { damping: 10, mass: 0.7 } });
  const fly = interpolate(since, [22, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic) });
  const x = interpolate(fly, [0, 1], [640, 850]), y = interpolate(fly, [0, 1], [760, 250]);
  return (
    <div style={{
      position: "absolute", left: x - 150, top: y - 50, width: 300, textAlign: "center", fontFamily: TITLE, fontSize: 84, color: C.amarelo,
      WebkitTextStroke: `10px ${C.tinta}`, paintOrder: "stroke fill", textShadow: `0 8px 0 ${C.tinta}`,
      transform: `scale(${s * (1 - fly * 0.6)}) rotate(-6deg)`, opacity: 1 - fly * 0.8,
    }}>+{amount} XP</div>
  );
};

// ---------- cabeçalho do exercício ----------
export const ExChip: React.FC<{ text: string; n: number; total: number }> = ({ text, n, total }) => (
  <div style={{ position: "absolute", left: SAFE.x0, top: L.chipY, display: "flex", alignItems: "center", gap: 14 }}>
    <div style={{ fontFamily: BODY, fontWeight: 800, fontSize: 34, letterSpacing: 1, color: C.tinta, background: C.amarelo, borderRadius: 16, padding: "8px 18px", border: `5px solid ${C.tinta}`, boxShadow: `0 5px 0 ${C.tinta}` }}>{text}</div>
    <div style={{ fontFamily: BODY, fontWeight: 800, fontSize: 30, color: "#C9B8F5" }}>{n}/{total}</div>
  </div>
);

export const PromptCard: React.FC<{ children: React.ReactNode; top?: number; minH?: number; tag?: string }> = ({ children, top = L.cardY, minH = 228, tag }) => (
  <div style={{
    position: "absolute", left: SAFE.x0, top, width: W, height: minH, boxSizing: "border-box", textWrap: "balance" as any, background: C.creme, border: `8px solid ${C.tinta}`, borderRadius: 38,
    boxShadow: CARD_SHADOW, padding: "24px 34px", display: "flex", flexDirection: "column", justifyContent: "center",
  }}>
    {tag && <div style={{ fontFamily: BODY, fontWeight: 800, fontSize: 28, color: C.roxo, marginBottom: 6, letterSpacing: 1 }}>{tag}</div>}
    {children}
  </div>
);

// Timer circular: 3–4 s, tique por segundo (SFX no motor), vermelho no último.
export const Timer: React.FC<{ remaining: number; total: number; since: number; fps: number; x?: number; y?: number }> = ({ remaining, total, since, fps, x = SAFE.x1 - 118, y = 306 }) => {
  const r = 50, circ = 2 * Math.PI * r;
  const inS = spring({ frame: since, fps, config: { damping: 12 } });
  const last = remaining <= 1;
  const pulse = 1 + (1 - (remaining % 1)) * 0.06;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `scale(${inS * pulse})` }}>
      <svg width={118} height={118} viewBox="0 0 136 136">
        <circle cx={68} cy={68} r={r + 6} fill={C.tinta} />
        <circle cx={68} cy={68} r={r} fill={C.creme} />
        <circle cx={68} cy={68} r={r - 8} fill="none" stroke={last ? C.errado : C.amarelo} strokeWidth={16}
          strokeDasharray={2 * Math.PI * (r - 8)} strokeDashoffset={2 * Math.PI * (r - 8) * (1 - remaining / total)} transform="rotate(-90 68 68)" />
        <text x={68} y={88} textAnchor="middle" fontFamily={TITLE} fontSize={58} fill={last ? C.errado : C.tinta}>{Math.ceil(remaining)}</text>
      </svg>
    </div>
  );
};

// Ícones desenhados (sem emoji: render estável e sem marca de terceiros).
export const Check: React.FC<{ size?: number; color?: string }> = ({ size = 40, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 40 40"><path d="M8 21 L17 30 L33 11" fill="none" stroke={color} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" /></svg>
);
export const Cross: React.FC<{ size?: number; color?: string }> = ({ size = 40, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 40 40"><path d="M11 11 L29 29 M29 11 L11 29" fill="none" stroke={color} strokeWidth={7} strokeLinecap="round" /></svg>
);

// ---------- opções (escolha / ouça) ----------
export const Options: React.FC<{
  options: string[]; answer: number; since: number; revealT: number; fps: number; top?: number; chute?: number; chuteT?: number; frame: number;
}> = ({ options, answer, since, revealT, fps, top = L.optY, chute, chuteT = -1, frame }) => {
  const revealed = revealT >= 0;
  return (
    <>
      {options.map((opt, i) => {
        const ok = i === answer;
        const picked = chute === i && chuteT >= 0;
        const wrongPick = revealed && picked && !ok;
        const s = spring({ frame: since - 8 - i * 7, fps, config: { damping: 14 } });
        const shake = wrongPick ? Math.sin(revealT * 1.5) * interpolate(revealT, [0, 16], [16, 0], { extrapolateRight: "clamp" }) : 0;
        const float = !revealed ? Math.sin((frame + i * 20) / 18) * 2 : 0;
        const okPop = revealed && ok ? 1 + Math.max(0, Math.sin(Math.min(1, revealT / 10) * Math.PI)) * 0.05 : 1;
        const bg = revealed ? (ok ? C.certo : wrongPick ? C.errado : "#E6DDF5") : picked ? "#FFE680" : "#fff";
        const fg = revealed && (ok || wrongPick) ? "#fff" : revealed ? "#7D6FA8" : C.tinta;
        return (
          <div key={i} style={{
            position: "absolute", left: SAFE.x0, top: top + i * (L.optH + L.optGap), width: W, height: L.optH, boxSizing: "border-box",
            display: "flex", alignItems: "center", gap: 20, padding: "0 26px", borderRadius: 30, border: `7px solid ${C.tinta}`, boxShadow: `0 8px 0 ${C.tinta}`,
            background: bg, opacity: Math.min(1, s * 1.4),
            transform: `translateX(${(1 - s) * 120 + shake}px) translateY(${float}px) scale(${okPop})`,
          }}>
            <div style={{
              width: 64, height: 64, flex: "0 0 64px", borderRadius: 18, background: revealed && ok ? "#0E9C78" : wrongPick ? "#D12E40" : C.creme,
              border: `5px solid ${C.tinta}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: TITLE, fontSize: 40, color: C.tinta,
            }}>{revealed && ok ? <Check /> : wrongPick ? <Cross /> : String.fromCharCode(65 + i)}</div>
            <div style={{ fontFamily: BODY, fontWeight: 800, fontSize: 46, lineHeight: 1.05, color: fg }}>{opt}</div>
            {picked && (
              <div style={{
                position: "absolute", right: -14, top: -30, fontFamily: TITLE, fontSize: 32, color: C.tinta, background: C.tangerina, border: `5px solid ${C.tinta}`,
                borderRadius: 16, padding: "0 14px", transform: `rotate(6deg) scale(${spring({ frame: chuteT, fps, config: { damping: 9 } })})`,
              }}>CAPY: ESSA!</div>
            )}
          </div>
        );
      })}
    </>
  );
};

// ---------- montar a frase (blocos voam do banco para os slots) ----------
export const STAG = 6; // frames entre um bloco e o próximo (montar)
const TILE_FS = 48, TILE_H = 92, TILE_GAP = 16;
const tileW = (t: string) => Math.round(t.length * TILE_FS * 0.56 + 56);
const flow = (words: string[], x0: number, y0: number, maxW: number, rowH: number, center = false) => {
  const pos: [number, number][] = [];
  const rows: number[][] = [[]];
  let x = 0;
  words.forEach((w, i) => {
    const tw = tileW(w);
    if (x > 0 && x + tw > maxW) { rows.push([]); x = 0; }
    rows[rows.length - 1].push(i);
    x += tw + TILE_GAP;
  });
  rows.forEach((r, ri) => {
    const rw = r.reduce((s, i) => s + tileW(words[i]) + TILE_GAP, -TILE_GAP);
    let cx = x0 + (center ? (maxW - rw) / 2 : 0);
    r.forEach((i) => { pos[i] = [cx, y0 + ri * rowH]; cx += tileW(words[i]) + TILE_GAP; });
  });
  return { pos, rows: rows.length };
};

export const TileBoard: React.FC<{
  tiles: string[]; order: number[]; since: number; flyT: number; revealT: number; fps: number; frame: number;
}> = ({ tiles, order, since, flyT, revealT, fps, frame }) => {
  const ANS_Y = 676, BANK_Y = 948;
  const ansWords = order.map((i) => tiles[i]);
  const ans = flow(ansWords, SAFE.x0 + 10, ANS_Y, W - 20, 120);
  const bank = flow(tiles, SAFE.x0, BANK_Y, W, TILE_H + 22, true);
  const lineYs = Array.from({ length: Math.max(2, ans.rows) }, (_, r) => ANS_Y + r * 120 + TILE_H + 10);
  const done = revealT >= 0;
  return (
    <>
      {lineYs.map((y, r) => (
        <div key={r} style={{ position: "absolute", left: SAFE.x0, top: y, width: W, height: 6, borderRadius: 3, background: "rgba(255,244,224,0.35)" }} />
      ))}
      {/* sombras dos blocos no banco */}
      {tiles.map((t, i) => (
        <div key={`g${i}`} style={{ position: "absolute", left: bank.pos[i][0], top: bank.pos[i][1], width: tileW(t), height: TILE_H, borderRadius: 20, background: "rgba(20,6,60,0.45)" }} />
      ))}
      {tiles.map((t, i) => {
        const slot = order.indexOf(i);
        const inS = spring({ frame: since - 6 - i * 4, fps, config: { damping: 13 } });
        let [x, y] = bank.pos[i];
        let lift = 0;
        if (slot >= 0 && flyT >= 0) {
          const k = spring({ frame: flyT - slot * STAG, fps, config: { damping: 15, mass: 0.7 } });
          const [tx, ty] = ans.pos[slot];
          x = x + (tx - x) * k;
          y = y + (ty - y) * k;
          lift = Math.sin(Math.min(1, Math.max(0, k)) * Math.PI) * -60;
        }
        const leftover = slot < 0 && done;
        const wiggle = !done && flyT < 0 ? Math.sin((frame + i * 13) / 10) * 1.5 : 0;
        const shake = leftover ? Math.sin(revealT * 1.4) * interpolate(revealT, [0, 18], [12, 0], { extrapolateRight: "clamp" }) : 0;
        const placedOk = slot >= 0 && done;
        return (
          <div key={i} style={{
            position: "absolute", left: x + shake, top: y + lift, width: tileW(t), height: TILE_H, boxSizing: "border-box", borderRadius: 20,
            background: placedOk ? C.certo : leftover ? C.errado : "#fff", border: `6px solid ${C.tinta}`, boxShadow: `0 7px 0 ${C.tinta}`,
            display: "flex", alignItems: "center", justifyContent: "center", fontFamily: BODY, fontWeight: 800, fontSize: TILE_FS,
            color: placedOk || leftover ? "#fff" : C.tinta, transform: `scale(${inS}) rotate(${wiggle}deg)`,
            ...(placedOk || leftover ? { WebkitTextStroke: `1.5px ${C.tinta}` } : {}),
          }}>
            {t}
            {leftover && revealT > 10 && (
              <div style={{
                position: "absolute", top: -58, left: "50%", transform: `translateX(-50%) rotate(-4deg) scale(${spring({ frame: revealT - 10, fps, config: { damping: 10 } })})`,
                whiteSpace: "nowrap", fontFamily: TITLE, fontSize: 34, color: C.creme, background: C.tinta, borderRadius: 14, padding: "2px 14px", WebkitTextStroke: "0px",
              }}>VILÃ DO DIA</div>
            )}
          </div>
        );
      })}
    </>
  );
};

// ---------- ouvir: botão de som ----------
const SpeakerIcon: React.FC<{ waves: number }> = ({ waves }) => (
  <svg width={120} height={120} viewBox="0 0 120 120">
    <path d="M18 46 L40 46 L64 24 L64 96 L40 74 L18 74 Z" fill={C.tinta} stroke={C.tinta} strokeWidth={6} strokeLinejoin="round" />
    {[0, 1, 2].map((i) => (
      <path key={i} d={`M${78 + i * 12} ${44 - i * 10} Q${92 + i * 16} 60 ${78 + i * 12} ${76 + i * 10}`} fill="none" stroke={C.tinta} strokeWidth={8} strokeLinecap="round"
        opacity={0.25 + 0.75 * Math.max(0, Math.min(1, waves * 3 - i))} />
    ))}
  </svg>
);

export const ListenPanel: React.FC<{ since: number; fps: number; frame: number; playing: "devagar" | "normal" | null }> = ({ since, fps, frame, playing }) => {
  const s = spring({ frame: since, fps, config: { damping: 12 } });
  const waves = playing ? (Math.sin(frame / 3) + 1) / 2 : 0.34;
  const ring = playing ? (frame % 24) / 24 : -1;
  const chip = (label: string, on: boolean) => (
    <div style={{
      fontFamily: BODY, fontWeight: 800, fontSize: 30, color: on ? C.tinta : "#C9B8F5", background: on ? C.amarelo : "transparent",
      border: `5px solid ${on ? C.tinta : "#8C6CFF"}`, borderRadius: 16, padding: "6px 16px", transform: `scale(${on ? 1.06 : 1})`,
    }}>{label}</div>
  );
  return (
    <div style={{ position: "absolute", left: SAFE.x0, top: L.cardY + 10, width: W, height: 200, transform: `scale(${s})` }}>
      <div style={{ position: "absolute", left: 60, top: 6, width: 188, height: 188 }}>
        {ring >= 0 && (
          <div style={{ position: "absolute", inset: -ring * 40, borderRadius: "50%", border: `6px solid ${C.amarelo}`, opacity: 1 - ring }} />
        )}
        <div style={{
          position: "absolute", inset: 0, borderRadius: "50%", background: C.amarelo, border: `8px solid ${C.tinta}`, boxShadow: `0 10px 0 ${C.tinta}`,
          display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${playing ? 1 + Math.sin(frame / 4) * 0.03 : 1})`,
        }}><SpeakerIcon waves={waves} /></div>
      </div>
      <div style={{ position: "absolute", left: 300, top: 34, display: "flex", flexDirection: "column", gap: 18 }}>
        {chip("1ª DEVAGAR", playing === "devagar")}
        {chip("2ª NORMAL", playing === "normal")}
      </div>
    </div>
  );
};

// ---------- repetir: frase-modelo + microfone ----------
export const MicPanel: React.FC<{ frame: number; fps: number; since: number; micT: number; micFrames: number; active: boolean; after?: boolean }> = ({ frame, fps, since, micT, micFrames, active, after = false }) => {
  const s = spring({ frame: since, fps, config: { damping: 12 } });
  const k = active ? micT / micFrames : 0;
  const cx = 540, cy = 850;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transform: `scale(${s})`, transformOrigin: `${cx}px ${cy}px` }}>
      {active && [0, 1].map((j) => {
        const r = ((frame + j * 15) % 30) / 30;
        return <div key={j} style={{ position: "absolute", left: cx - 120 - r * 70, top: cy - 120 - r * 70, width: 240 + r * 140, height: 240 + r * 140, borderRadius: "50%", border: `6px solid ${C.certo}`, opacity: 1 - r }} />;
      })}
      <svg width={300} height={300} viewBox="0 0 300 300" style={{ position: "absolute", left: cx - 150, top: cy - 150 }}>
        <circle cx={150} cy={150} r={116} fill={C.tinta} />
        <circle cx={150} cy={142} r={110} fill={active ? C.certo : C.creme} />
        {active && (
          <circle cx={150} cy={142} r={96} fill="none" stroke="#fff" strokeWidth={12} strokeDasharray={2 * Math.PI * 96}
            strokeDashoffset={2 * Math.PI * 96 * k} transform="rotate(-90 150 142)" strokeLinecap="round" opacity={0.9} />
        )}
        <rect x={122} y={78} width={56} height={92} rx={28} fill={active ? "#fff" : C.roxo} stroke={C.tinta} strokeWidth={7} />
        <path d="M104 142 Q104 196 150 196 Q196 196 196 142" fill="none" stroke={C.tinta} strokeWidth={9} strokeLinecap="round" />
        <path d="M150 196 L150 220 M124 222 L176 222" stroke={C.tinta} strokeWidth={9} strokeLinecap="round" />
      </svg>
      {/* barras de "voz" */}
      {active && (
        <div style={{ position: "absolute", left: cx - 190, top: cy + 170, width: 380, height: 70, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {Array.from({ length: 13 }, (_, i) => (
            <div key={i} style={{ width: 18, borderRadius: 9, background: C.amarelo, border: `3px solid ${C.tinta}`, height: 16 + Math.abs(Math.sin(frame / 4 + i * 0.9)) * 48 }} />
          ))}
        </div>
      )}
      <div style={{
        position: "absolute", left: SAFE.x0, width: W, top: cy + (active ? 256 : 176), textAlign: "center", fontFamily: TITLE, fontSize: active ? 64 : 44,
        color: active ? C.amarelo : "#C9B8F5", WebkitTextStroke: active ? `8px ${C.tinta}` : "0px", paintOrder: "stroke fill",
      }}>{active ? "SUA VEZ! FALA ALTO" : after ? "DE NOVO, JUNTO COM ELA" : "OUÇA A CAPY PRIMEIRO"}</div>
    </div>
  );
};

// Faixa de lição completa.
export const CompleteBanner: React.FC<{ since: number; fps: number; xp: number }> = ({ since, fps, xp }) => {
  if (since < 0) return null;
  const s = spring({ frame: since, fps, config: { damping: 10 } });
  return (
    <div style={{ position: "absolute", left: SAFE.x0 + 40, width: W - 80, top: 820, transform: `scale(${s}) rotate(-3deg)`, textAlign: "center" }}>
      <div style={{ display: "inline-block", background: C.amarelo, border: `8px solid ${C.tinta}`, borderRadius: 30, boxShadow: `0 10px 0 ${C.tinta}`, padding: "10px 30px", fontFamily: TITLE, fontSize: 60, color: C.tinta }}>
        LIÇÃO COMPLETA! <span style={{ color: C.roxo }}>{xp} XP</span>
      </div>
    </div>
  );
};
