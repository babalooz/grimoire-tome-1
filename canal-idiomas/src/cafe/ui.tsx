import React from "react";
import { AbsoluteFill, spring } from "remotion";
import { DonaJaca } from "../chars/DonaJaca";
import { Emotion } from "../chars/common";
import { useAudit } from "../lesson/audit";
import { BODY, C, SAFE, TITLE } from "../theme";
import { CafeSerie, PHONE } from "./timeline";

// Interface da Sitcom do Café. Regras (docs/pesquisas/formato-novo/didatica-visual.md):
//   1 — só a frase-alvo é AMARELA (selo, título, contador e cartões usam creme/lilás/turquesa);
//   6 — cena limpa: dim do cenário nos blocos de aprender, nada de confete;
//   tudo dentro de SAFE (x 60–920, y 260–1436).
const W = SAFE.x1 - SAFE.x0;
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

// Selo "T1 E01 · você já sabe 1 frase" (sem `progresso`: só o código). Vai como `lead` da marca d'água.
export const CafeSeal: React.FC<{ serie?: CafeSerie }> = ({ serie }) => !serie ? null : (
  <div style={{
    height: 42, minWidth: 0, display: "flex", alignItems: "center", gap: 10,
    background: "rgba(26,11,69,0.78)", borderRadius: 21, padding: serie.progresso ? "0 16px 0 4px" : "0 4px", boxSizing: "border-box",
  }}>
    <div style={{ flexShrink: 0, fontFamily: TITLE, fontSize: 28, color: C.tinta, background: C.creme, borderRadius: 17, padding: "0 12px", lineHeight: "34px", whiteSpace: "nowrap" }}>{serie.codigo}</div>
    {serie.progresso && (
      <div style={{ minWidth: 0, fontFamily: BODY, fontWeight: 800, fontSize: 24, color: C.creme, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        {serie.progresso}
      </div>
    )}
  </div>
);

// Título de tela do gancho (capa no feed): creme, já presente no frame 0.
export const HookTitle: React.FC<{ text: string; top: number; out: number }> = ({ text, top, out }) => (
  <div style={{
    position: "absolute", left: SAFE.x0 + 30, width: W - 60, top, transform: `rotate(-2deg) translateY(${-out * 60}px)`, opacity: 1 - out,
  }}>
    <div style={{
      background: C.creme, border: `8px solid ${C.tinta}`, borderRadius: 36, boxShadow: `0 10px 0 ${C.tinta}`, padding: "18px 26px",
      textAlign: "center", fontFamily: TITLE, fontSize: text.length > 18 ? 68 : 84, lineHeight: 1.02, color: C.tinta, textWrap: "balance" as any,
    }}>{text}</div>
  </div>
);

// Contador circular (lilás → turquesa no último segundo; nunca amarelo).
export const CountRing: React.FC<{ remaining: number; total: number; size?: number }> = ({ remaining, total, size = 170 }) => {
  const r = 62, circ = 2 * Math.PI * r;
  const last = remaining <= 1;
  return (
    <svg width={size} height={size} viewBox="0 0 160 160">
      <circle cx={80} cy={80} r={r} fill={C.creme} stroke={C.tinta} strokeWidth={9} />
      <circle cx={80} cy={80} r={r} fill="none" stroke={last ? C.certo : C.lilas} strokeWidth={16}
        strokeDasharray={circ} strokeDashoffset={circ * (1 - clamp01(remaining / total))} transform="rotate(-90 80 80)" strokeLinecap="round" />
      <text x={80} y={100} textAnchor="middle" fontFamily={TITLE} fontSize={60} fill={C.tinta}>{Math.max(1, Math.ceil(remaining))}</text>
    </svg>
  );
};

// Escurece o cenário nos blocos de aprender (pergunta / sua vez). Some no modo auditoria.
export const Dim: React.FC<{ k: number }> = ({ k }) => useAudit() || k <= 0 ? null : (
  <AbsoluteFill style={{ background: `rgba(20,6,60,${0.62 * k})` }} />
);

// Pergunta de recuperação ("pensa aí..."): texto grande + contador; sem fala, trilha em zero.
export const PerguntaCard: React.FC<{ text: string; since: number; fps: number; remaining: number; total: number; counting: boolean; out: number }> = ({
  text, since, fps, remaining, total, counting, out,
}) => {
  const s = spring({ frame: since, fps, config: { damping: 14 } });
  return (
    <>
      <Dim k={Math.min(1, since / 6) * (1 - out)} />
      <div style={{ position: "absolute", left: SAFE.x0 + 20, width: W - 40, top: 560, opacity: s * (1 - out), transform: `scale(${0.9 + 0.1 * s})` }}>
        <div style={{
          background: C.creme, border: `8px solid ${C.tinta}`, borderRadius: 40, boxShadow: `0 12px 0 ${C.tinta}`, padding: "30px 34px",
          textAlign: "center", fontFamily: TITLE, fontSize: text.length > 30 ? 70 : 84, lineHeight: 1.05, color: C.tinta, textWrap: "balance" as any,
        }}>{text}</div>
        <div style={{ display: "flex", justifyContent: "center", marginTop: 44, opacity: counting ? 1 : 0.5 }}>
          <CountRing remaining={remaining} total={total} />
        </div>
      </div>
    </>
  );
};

const Mic: React.FC<{ size: number; frame: number }> = ({ size, frame }) => (
  <div style={{ position: "relative", width: size, height: size }}>
    {[0, 1].map((j) => {
      const r = ((frame + j * 15) % 30) / 30;
      return <div key={j} style={{ position: "absolute", left: -r * 40, top: -r * 40, width: size + r * 80, height: size + r * 80, borderRadius: "50%", border: `6px solid ${C.certo}`, opacity: 1 - r }} />;
    })}
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ position: "absolute" }}>
      <circle cx={50} cy={50} r={46} fill={C.certo} stroke={C.tinta} strokeWidth={6} />
      <rect x={39} y={20} width={22} height={38} rx={11} fill="#fff" stroke={C.tinta} strokeWidth={5} />
      <path d="M30 48 Q30 70 50 70 Q70 70 70 48 M50 70 L50 80 M40 81 L60 81" fill="none" stroke={C.tinta} strokeWidth={5} strokeLinecap="round" />
    </svg>
  </div>
);

// Shadowing ("sua vez"): frase grande (só a frase-alvo em amarelo) + microfone + contador, em silêncio.
export const RepitaBlock: React.FC<{
  text: string; highlight?: [number, number]; since: number; fps: number; frame: number; remaining: number; total: number; out: number;
}> = ({ text, highlight, since, fps, frame, remaining, total, out }) => {
  const s = spring({ frame: since, fps, config: { damping: 14 } });
  const words = text.split(/\s+/);
  const size = text.length > 22 ? 84 : 100;
  return (
    <>
      <Dim k={Math.min(1, since / 6) * (1 - out)} />
      <div style={{ position: "absolute", left: SAFE.x0 + 20, width: W - 40, top: 540, opacity: s * (1 - out), transform: `scale(${0.9 + 0.1 * s})` }}>
        <div style={{
          background: C.creme, border: `8px solid ${C.tinta}`, borderRadius: 40, boxShadow: `0 12px 0 ${C.tinta}`, padding: "26px 30px 34px", textAlign: "center",
        }}>
          <div style={{ fontFamily: BODY, fontWeight: 800, fontSize: 34, color: C.roxo, letterSpacing: 1 }}>SUA VEZ · FALA EM VOZ ALTA</div>
          <div style={{ fontFamily: TITLE, fontSize: size, lineHeight: 1.12, color: C.tinta, marginTop: 14, textWrap: "balance" as any }}>
            {words.map((w, i) => {
              const hl = !!highlight && i >= highlight[0] && i < highlight[1];
              const edgeL = hl && i === highlight![0], edgeR = hl && i === highlight![1] - 1;
              return (
                <React.Fragment key={i}>
                  <span style={hl ? { background: C.amarelo, padding: `0 ${edgeR ? 12 : 0}px 0 ${edgeL ? 12 : 0}px`, borderRadius: `${edgeL ? 14 : 0}px ${edgeR ? 14 : 0}px ${edgeR ? 14 : 0}px ${edgeL ? 14 : 0}px`, boxDecorationBreak: "clone" as any, WebkitBoxDecorationBreak: "clone" as any } : undefined}>
                    {w}{hl && !edgeR && i < words.length - 1 ? " " : ""}
                  </span>
                  {(!hl || edgeR) && i < words.length - 1 ? " " : ""}
                </React.Fragment>
              );
            })}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 70, marginTop: 56 }}>
          <Mic size={150} frame={frame} />
          <CountRing remaining={remaining} total={total} size={150} />
        </div>
      </div>
    </>
  );
};

// Dona Jaca por videochamada: celular (arte do elenco) no canto, entra deslizando da direita. x ≤ 920.
export const VideoCall: React.FC<{ k: number; frame: number; talking: boolean; emotion: Emotion }> = ({ k, frame, talking, emotion }) => {
  if (k <= 0 || useAudit()) return null;
  return (
    <div style={{
      position: "absolute", left: PHONE.left, top: PHONE.top, transform: `translateX(${(1 - k) * 560}px) rotate(${3 - 3 * k + 4}deg)`,
      filter: "drop-shadow(0 12px 0 rgba(26,11,69,0.55))",
    }}>
      <DonaJaca frame={frame} talking={talking} emotion={emotion} size={PHONE.size} />
    </div>
  );
};
export const phoneAnchor = (k: number): [number, number] => [PHONE.left + PHONE.size / 2 + (1 - k) * 560, PHONE.top + 10];

// Texto do card final (pertencimento: "#TimeLazy ou #TimeHank?"): adesivo creme sobre o balcão, à direita, x ≤ 920.
export const CardTexto: React.FC<{ text: string; since: number; fps: number }> = ({ text, since, fps }) => {
  const s = spring({ frame: since, fps, config: { damping: 10 } });
  if (since < 0) return null;
  return (
    <div style={{ position: "absolute", left: 500, width: SAFE.x1 - 500, top: 1170, transform: `rotate(4deg) scale(${s})`, textAlign: "center" }}>
      <div style={{
        display: "inline-block", background: C.creme, border: `7px solid ${C.tinta}`, borderRadius: 30, boxShadow: `0 10px 0 ${C.tinta}`,
        padding: "14px 22px", fontFamily: TITLE, fontSize: 52, lineHeight: 1.08, color: C.roxo, textWrap: "balance" as any,
      }}>{text}</div>
    </div>
  );
};

// Bolinha em episódio que não é o primeiro: "lembra dessa?" acima dele.
export const LembraTag: React.FC<{ x: number; y: number; since: number; fps: number }> = ({ x, y, since, fps }) => {
  if (since < 0) return null;
  const s = spring({ frame: since, fps, config: { damping: 12 } });
  const left = Math.min(SAFE.x1 - 330, Math.max(SAFE.x0, x - 165));
  return (
    <div style={{
      position: "absolute", left, top: Math.max(SAFE.y0 + 60, y - 110), width: 330, textAlign: "center", transform: `scale(${s}) rotate(-3deg)`,
      fontFamily: TITLE, fontSize: 56, color: C.tinta, background: C.creme, border: `7px solid ${C.tinta}`, borderRadius: 28, boxShadow: `0 8px 0 ${C.tinta}`,
    }}>lembra dessa?</div>
  );
};
