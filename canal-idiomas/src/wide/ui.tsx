import React from "react";
import { AbsoluteFill, spring } from "remotion";
import { Capi } from "../Capi";
import { DonaJaca } from "../chars/DonaJaca";
import { Emotion } from "../chars/common";
import { CountRing } from "../cafe/ui";
import { useAudit } from "../lesson/audit";
import { BODY, C, TITLE } from "../theme";
import { PHONE_W, SAFE_W } from "./geo";

// Interface das composições 16:9. Mesmas regras do vertical (didatica-visual.md): só a frase/palavra-alvo é AMARELA,
// cena limpa nos blocos de aprender, contorno grosso + sombra dura. Tamanho pensado para celular deitado e TV:
// legenda EN ≥ 64 px (≈6% da altura), tudo dentro de SAFE_W (controles do YouTube embaixo, margem de título).
const CW = SAFE_W.x1 - SAFE_W.x0;
export const NOMES: Record<string, string> = {
  capi: "Capy", hank: "Hank", lazy: "Lazy", duda: "Duda", poppy: "Poppy", bolinha: "Bolinha", donajaca: "Dona Jaca",
  turista: "Rick", narrador: "Capy",
};
export const COR_NOME: Record<string, string> = {
  capi: C.tangerina, hank: C.roxo, lazy: "#2F8F83", duda: "#D9485F", poppy: "#C2409A", bolinha: "#8A5A2B", donajaca: "#6B4FCF",
  turista: "#1F6FB2", narrador: C.tangerina,
};

// Marca + selo da série no canto de cima à esquerda (o YouTube não mostra marca d'água em tela cheia por padrão).
export const MarcaW: React.FC<{ codigo?: string; progresso?: string }> = ({ codigo, progresso }) => (
  <div style={{ position: "absolute", left: SAFE_W.x0, top: SAFE_W.y0, height: 50, display: "flex", alignItems: "center", gap: 12 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10, height: 50, background: "rgba(30,15,77,0.8)", borderRadius: 25, padding: "0 18px 0 4px" }}>
      <div style={{ width: 42, height: 42, overflow: "hidden", borderRadius: 21, background: C.amarelo }}>
        <div style={{ marginLeft: -5, marginTop: 2 }}><Capi frame={40} talking={false} mood="zen" size={52} /></div>
      </div>
      <span style={{ fontFamily: TITLE, fontSize: 30, color: "#fff", whiteSpace: "nowrap" }}>CapyFala</span>
    </div>
    {codigo && (
      <div style={{ display: "flex", alignItems: "center", gap: 10, height: 50, background: "rgba(26,11,69,0.8)", borderRadius: 25, padding: progresso ? "0 18px 0 5px" : "0 5px" }}>
        <div style={{ fontFamily: TITLE, fontSize: 30, color: C.tinta, background: C.creme, borderRadius: 20, padding: "0 14px", lineHeight: "40px", whiteSpace: "nowrap" }}>{codigo}</div>
        {progresso && <div style={{ fontFamily: BODY, fontWeight: 800, fontSize: 26, color: C.creme, whiteSpace: "nowrap" }}>{progresso}</div>}
      </div>
    )}
  </div>
);

// Legenda de programa: faixa no terço de baixo (acima dos controles), chip com o nome de quem fala, karaokê,
// frase-alvo em marca-texto amarelo, linha PT menor na 1ª vez, risco vermelho na forma errada.
export const LegendaW: React.FC<{
  speaker: string; text: string; lang: "pt" | "en"; progress: number; pop?: number; thought?: boolean;
  highlight?: [number, number]; sub?: string; subOpacity?: number; strike?: number; big?: boolean;
}> = ({ speaker, text, lang, progress, pop = 1, thought = false, highlight, sub, subOpacity = 1, strike = 0, big = false }) => {
  const words = text.split(/\s+/);
  const active = progress >= 1 ? -1 : Math.max(0, Math.min(words.length - 1, Math.floor(progress * words.length)));
  const fs = lang === "en" ? (big ? 84 : 70) : 60;
  const s = 0.9 + 0.1 * Math.min(1, pop);
  return (
    <div style={{
      position: "absolute", left: SAFE_W.x0 + 60, width: CW - 120, bottom: 1080 - SAFE_W.y1, display: "flex", justifyContent: "center",
      transform: `scale(${s})`, transformOrigin: "50% 100%", opacity: Math.min(1, pop * 2),
    }}>
      <div style={{
        position: "relative", maxWidth: CW - 120, background: thought ? "#EFE8FF" : "#fff", borderRadius: 34,
        border: `7px ${thought ? "dashed" : "solid"} ${C.tinta}`, boxShadow: `0 9px 0 ${C.tinta}`, padding: "22px 40px 22px",
        textAlign: "center", fontFamily: TITLE, fontSize: fs, lineHeight: 1.12, color: C.tinta, textWrap: "balance" as any,
      }}>
        <div style={{
          position: "absolute", left: 30, top: -30, fontFamily: BODY, fontWeight: 800, fontSize: 28, color: "#fff",
          background: COR_NOME[speaker] ?? C.roxo, border: `5px solid ${C.tinta}`, borderRadius: 16, padding: "2px 16px", whiteSpace: "nowrap",
        }}>{NOMES[speaker] ?? speaker}{thought ? " (pensando)" : ""}{lang === "en" ? " · EN" : ""}</div>
        {words.map((wd, i) => {
          const hl = !!highlight && i >= highlight[0] && i < highlight[1];
          const sp = i < words.length - 1 ? " " : "";
          if (!hl) return <span key={i} style={{ color: i === active ? C.tangerina : C.tinta }}>{wd}{sp}</span>;
          const edgeL = i === highlight![0], edgeR = i === highlight![1] - 1;
          return (
            <React.Fragment key={i}>
              <span style={{
                background: C.amarelo, color: C.tinta, padding: `0 ${edgeR ? 12 : 0}px 0 ${edgeL ? 12 : 0}px`,
                borderRadius: `${edgeL ? 14 : 0}px ${edgeR ? 14 : 0}px ${edgeR ? 14 : 0}px ${edgeL ? 14 : 0}px`,
                boxDecorationBreak: "clone" as any, WebkitBoxDecorationBreak: "clone" as any,
                textDecoration: i === active ? "underline" : "none", textDecorationThickness: 7, textUnderlineOffset: 9,
              }}>{wd}{edgeR ? "" : sp}</span>
              {edgeR && sp}
            </React.Fragment>
          );
        })}
        {sub && <div style={{ fontFamily: BODY, fontWeight: 800, fontSize: 42, lineHeight: 1.2, color: C.roxo, marginTop: 8, opacity: subOpacity }}>{sub}</div>}
        {strike > 0 && (
          <div style={{ position: "absolute", left: 30, top: "50%", height: 12, width: `calc(${strike} * (100% - 60px))`, background: C.errado, borderRadius: 6,
            transform: "rotate(-3deg)", transformOrigin: "0 50%", boxShadow: `0 0 0 3px ${C.tinta}` }} />
        )}
      </div>
    </div>
  );
};

// "Frase de hoje" fixa no canto de cima à direita depois da 1ª vez que a frase-alvo aparece (âncora para quem chega
// no meio). É a própria frase-alvo, então é o único outro amarelo permitido.
export const FraseHojeW: React.FC<{ en: string; pt: string; since: number; fps: number; rotulo?: string }> = ({ en, pt, since, fps, rotulo = "frase de hoje" }) => {
  if (since < 0) return null;
  const s = spring({ frame: since, fps, config: { damping: 14 } });
  return (
    <div style={{ position: "absolute", right: 1920 - SAFE_W.x1, top: SAFE_W.y0, transform: `translateX(${(1 - s) * 520}px)`, textAlign: "right" }}>
      <div style={{ display: "inline-block", background: C.creme, border: `6px solid ${C.tinta}`, borderRadius: 26, boxShadow: `0 8px 0 ${C.tinta}`, padding: "10px 22px 12px", textAlign: "left" }}>
        <div style={{ fontFamily: BODY, fontWeight: 800, fontSize: 22, color: C.roxo, letterSpacing: 1, textTransform: "uppercase" }}>{rotulo}</div>
        <div style={{ fontFamily: TITLE, fontSize: 50, lineHeight: 1.1, color: C.tinta }}>
          <span style={{ background: C.amarelo, borderRadius: 12, padding: "0 10px" }}>{en}</span>
        </div>
        <div style={{ fontFamily: BODY, fontWeight: 800, fontSize: 26, color: C.roxo, marginTop: 4 }}>{pt}</div>
      </div>
    </div>
  );
};

const Dim: React.FC<{ k: number }> = ({ k }) => useAudit() || k <= 0 ? null : <AbsoluteFill style={{ background: `rgba(20,6,60,${0.62 * k})` }} />;

const MicW: React.FC<{ size: number; frame: number }> = ({ size, frame }) => (
  <div style={{ position: "relative", width: size, height: size }}>
    {[0, 1].map((j) => {
      const r = ((frame + j * 15) % 30) / 30;
      return <div key={j} style={{ position: "absolute", left: -r * 34, top: -r * 34, width: size + r * 68, height: size + r * 68, borderRadius: "50%", border: `6px solid ${C.certo}`, opacity: 1 - r }} />;
    })}
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ position: "absolute" }}>
      <circle cx={50} cy={50} r={46} fill={C.certo} stroke={C.tinta} strokeWidth={6} />
      <rect x={39} y={20} width={22} height={38} rx={11} fill="#fff" stroke={C.tinta} strokeWidth={5} />
      <path d="M30 48 Q30 70 50 70 Q70 70 70 48 M50 70 L50 80 M40 81 L60 81" fill="none" stroke={C.tinta} strokeWidth={5} strokeLinecap="round" />
    </svg>
  </div>
);

const Cartao: React.FC<{ children: React.ReactNode; since: number; fps: number; out: number; top?: number }> = ({ children, since, fps, out, top = 250 }) => {
  const s = spring({ frame: since, fps, config: { damping: 14 } });
  return (
    <>
      <Dim k={Math.min(1, since / 6) * (1 - out)} />
      <div style={{ position: "absolute", left: 360, width: 1200, top, opacity: s * (1 - out), transform: `scale(${0.9 + 0.1 * s})` }}>{children}</div>
    </>
  );
};
const caixa = { background: C.creme, border: `8px solid ${C.tinta}`, borderRadius: 40, boxShadow: `0 12px 0 ${C.tinta}`, textAlign: "center" as const };

// Pergunta de recuperação ("pensa aí..."): texto grande + contador; sem fala, trilha em zero.
export const PerguntaW: React.FC<{ text: string; since: number; fps: number; remaining: number; total: number; counting: boolean; out: number }> = (p) => (
  <Cartao since={p.since} fps={p.fps} out={p.out}>
    <div style={{ ...caixa, padding: "34px 44px", fontFamily: TITLE, fontSize: p.text.length > 34 ? 76 : 90, lineHeight: 1.05, color: C.tinta, textWrap: "balance" as any }}>{p.text}</div>
    <div style={{ display: "flex", justifyContent: "center", marginTop: 40, opacity: p.counting ? 1 : 0.5 }}>
      <CountRing remaining={p.remaining} total={p.total} size={170} />
    </div>
  </Cartao>
);

// Shadowing ("sua vez"): frase grande (só a frase-alvo em amarelo) + microfone + contador, em silêncio.
export const RepitaW: React.FC<{ text: string; highlight?: [number, number]; since: number; fps: number; frame: number; remaining: number; total: number; out: number }> = (p) => {
  const words = p.text.split(/\s+/);
  return (
    <Cartao since={p.since} fps={p.fps} out={p.out}>
      <div style={{ ...caixa, padding: "28px 40px 36px" }}>
        <div style={{ fontFamily: BODY, fontWeight: 800, fontSize: 36, color: C.roxo, letterSpacing: 1 }}>SUA VEZ · FALA EM VOZ ALTA</div>
        <div style={{ fontFamily: TITLE, fontSize: 118, lineHeight: 1.1, color: C.tinta, marginTop: 10 }}>
          {words.map((w, i) => {
            const hl = !!p.highlight && i >= p.highlight[0] && i < p.highlight[1];
            return <span key={i} style={hl ? { background: C.amarelo, borderRadius: 14, padding: "0 6px" } : undefined}>{w}{i < words.length - 1 ? " " : ""}</span>;
          })}
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 70, marginTop: 44 }}>
        <MicW size={150} frame={p.frame} />
        <CountRing remaining={p.remaining} total={p.total} size={150} />
      </div>
    </Cartao>
  );
};

// Dona Jaca por videochamada: celular no alto à direita (abaixo da "frase de hoje", que some enquanto ela fala).
export const VideoCallW: React.FC<{ k: number; frame: number; talking: boolean; emotion: Emotion }> = ({ k, frame, talking, emotion }) => {
  if (k <= 0 || useAudit()) return null;
  return (
    <div style={{ position: "absolute", left: PHONE_W.left, top: PHONE_W.top, transform: `translateX(${(1 - k) * 700}px) rotate(${4 - 3 * k + 3}deg)`,
      filter: "drop-shadow(0 12px 0 rgba(26,11,69,0.55))" }}>
      <DonaJaca frame={frame} talking={talking} emotion={emotion} size={PHONE_W.size} />
    </div>
  );
};

// Bolinha em episódio que não é o primeiro: "lembra dessa?" acima dele.
export const LembraW: React.FC<{ x: number; y: number; since: number; fps: number }> = ({ x, y, since, fps }) => {
  if (since < 0) return null;
  const s = spring({ frame: since, fps, config: { damping: 12 } });
  return (
    <div style={{
      position: "absolute", left: Math.min(SAFE_W.x1 - 340, Math.max(SAFE_W.x0, x - 170)), top: Math.max(SAFE_W.y0 + 70, y - 110), width: 340,
      textAlign: "center", transform: `scale(${s}) rotate(-3deg)`, fontFamily: TITLE, fontSize: 56, color: C.tinta, background: C.creme,
      border: `7px solid ${C.tinta}`, borderRadius: 28, boxShadow: `0 8px 0 ${C.tinta}`,
    }}>lembra dessa?</div>
  );
};

// Adesivo do card final (pertencimento) — faixa logo abaixo do Caderninho, acima da legenda.
export const CardTextoW: React.FC<{ text: string; since: number; fps: number }> = ({ text, since, fps }) => {
  if (since < 0) return null;
  const s = spring({ frame: since, fps, config: { damping: 10 } });
  return (
    <div style={{ position: "absolute", left: 360, width: 1200, top: 650, transform: `rotate(-1.5deg) scale(${s})`, textAlign: "center" }}>
      <div style={{ display: "inline-block", background: C.creme, border: `7px solid ${C.tinta}`, borderRadius: 30, boxShadow: `0 10px 0 ${C.tinta}`,
        padding: "8px 26px", fontFamily: TITLE, fontSize: 40, lineHeight: 1.08, color: C.roxo, textWrap: "balance" as any }}>{text}</div>
    </div>
  );
};

// Caderninho da Capy (card final) em formato largo: frase à esquerda, número carimbado à direita.
export const CadernoW: React.FC<{ n: number; en: string; pt: string; pattern?: string; since: number; fps: number }> = ({ n, en, pt, pattern, since, fps }) => {
  const s = spring({ frame: since, fps, config: { damping: 13 } });
  const st = spring({ frame: since - 10, fps, config: { damping: 8, mass: 0.6 } });
  return (
    <div style={{ position: "absolute", left: 380, width: 1160, top: 140, transform: `translateY(${(1 - s) * 900}px) rotate(${(1 - s) * 6 - 1}deg)` }}>
      <div style={{
        background: C.creme, border: `8px solid ${C.tinta}`, borderRadius: 28, boxShadow: `0 12px 0 ${C.tinta}`, padding: "60px 60px 40px 110px", position: "relative",
        backgroundImage: `repeating-linear-gradient(transparent 0 58px, #C9B8F5 58px 62px)`, backgroundPosition: "0 36px",
      }}>
        <div style={{ position: "absolute", top: -26, left: 40, right: 40, display: "flex", justifyContent: "space-between" }}>
          {Array.from({ length: 13 }, (_, i) => <div key={i} style={{ width: 22, height: 52, borderRadius: 11, background: "#D9D4E8", border: `6px solid ${C.tinta}` }} />)}
        </div>
        <div style={{ position: "absolute", top: 0, bottom: 0, left: 76, width: 5, background: C.errado, opacity: 0.7 }} />
        <div style={{ fontFamily: TITLE, fontSize: 46, color: C.roxo }}>Caderninho da Capy</div>
        <div style={{ fontFamily: TITLE, fontSize: 100, lineHeight: 1.05, color: C.tinta, marginTop: 14 }}>{en}</div>
        <div style={{ fontFamily: BODY, fontWeight: 800, fontSize: 46, color: C.roxo, marginTop: 12 }}>{pt}</div>
        {pattern && (
          <div style={{ display: "inline-block", marginTop: 20, fontFamily: BODY, fontWeight: 800, fontSize: 38, color: C.tinta, background: C.amarelo, borderRadius: 14, padding: "6px 16px", border: `4px solid ${C.tinta}` }}>{pattern}</div>
        )}
        <div style={{
          position: "absolute", right: 40, top: -36, fontFamily: TITLE, fontSize: 70, color: C.errado, border: `8px solid ${C.errado}`, borderRadius: 20,
          padding: "0 20px", background: "rgba(255,244,224,0.9)", transform: `rotate(-10deg) scale(${1.8 - 0.8 * st})`, opacity: Math.min(1, st * 2),
        }}>#{String(n).padStart(3, "0")}</div>
      </div>
    </div>
  );
};
