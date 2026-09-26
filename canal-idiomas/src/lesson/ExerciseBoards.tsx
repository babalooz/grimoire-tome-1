import React from "react";
import { Easing, interpolate, spring } from "remotion";
import { Bolinha } from "../chars/Bolinha";
import { BODY, C, SAFE, TITLE } from "../theme";
import { Check, L } from "./LessonUI";
import { Cartao, LIGAR_DRAW, LIGAR_STAG, Serie } from "./timeline";

// Exercícios do percurso do zero (docs/percurso-do-zero.md): cartoes · ligar · completar · revisao + selo da série.
// Mesmo vocabulário visual do LessonUI (creme + contorno tinta + sombra dura; turquesa = certo). Coordenadas 1080x1920,
// conteúdo entre L.cardY (406) e ~1090 (a Capy da lição ocupa o canto inferior esquerdo a partir de y 1116).

const W = SAFE.x1 - SAFE.x0;
const SHADOW = `0 10px 0 ${C.tinta}`;
const MUTED = "#7D6FA8";
// Emoji: fonte colorida do sistema (Noto Color Emoji no container de render). Sem ela o Chromium desenha "tofu".
export const EMOJI = `"Noto Color Emoji", "Apple Color Emoji", "Segoe UI Emoji", sans-serif`;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Tamanho de fonte que cabe numa largura (estimativa por caractere; TITLE ≈ 0,5 em, BODY 800 ≈ 0,56 em).
export const fit = (text: string, width: number, max: number, min = 26, em = 0.52) =>
  Math.max(min, Math.min(max, Math.floor(width / Math.max(1, text.length * em))));

// ---------- selo da série: "T1 E01 · Primeiro contato" ----------
// Discreto, no topo da zona segura, o episódio inteiro (a marca d'água fica embaixo à direita: sem colisão).
export const SeriesSeal: React.FC<{ serie: Serie }> = ({ serie }) => (
  <div style={{
    position: "absolute", left: SAFE.x0, top: L.sealY, height: 42, maxWidth: W, display: "flex", alignItems: "center", gap: 10,
    background: "rgba(26,11,69,0.78)", borderRadius: 21, padding: "0 16px 0 4px", boxSizing: "border-box",
  }}>
    <div style={{ fontFamily: TITLE, fontSize: 28, color: C.tinta, background: C.amarelo, borderRadius: 17, padding: "0 12px", lineHeight: "34px" }}>{serie.codigo}</div>
    <div style={{ fontFamily: BODY, fontWeight: 800, fontSize: 24, color: C.creme, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
      Cap. {serie.capitulo} · {serie.tituloCapitulo}
    </div>
  </div>
);

// Ícone de microfone pequeno (cartoes com `repita`).
const MicIcon: React.FC<{ size: number; on: boolean }> = ({ size, on }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <circle cx={50} cy={50} r={46} fill={on ? C.certo : C.creme} stroke={C.tinta} strokeWidth={7} />
    <rect x={39} y={20} width={22} height={38} rx={11} fill="#fff" stroke={C.tinta} strokeWidth={5} />
    <path d="M30 48 Q30 70 50 70 Q70 70 70 48 M50 70 L50 80 M40 81 L60 81" fill="none" stroke={C.tinta} strokeWidth={5} strokeLinecap="round" />
  </svg>
);

// ---------- cartoes: APRESENTAR ----------
// 1 cartão grande por vez (emoji + inglês + tradução); os já vistos viram uma pilha de fichas no topo = progresso.
const STACK_Y = L.cardY;
const BIG_Y = 506;
const BIG_H = 560;

const BigCard: React.FC<{ c: Cartao; n: number; total: number; style?: React.CSSProperties; children?: React.ReactNode }> = ({ c, n, total, style, children }) => (
  <div style={{
    position: "absolute", left: SAFE.x0, top: BIG_Y, width: W, height: BIG_H, boxSizing: "border-box", background: C.creme, border: `8px solid ${C.tinta}`,
    borderRadius: 44, boxShadow: SHADOW, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, ...style,
  }}>
    <div style={{ position: "absolute", top: 20, right: 28, fontFamily: BODY, fontWeight: 800, fontSize: 30, color: MUTED }}>{n}/{total}</div>
    <div style={{ fontFamily: EMOJI, fontSize: 168, lineHeight: 1.1, height: 190 }}>{c.emoji ?? ""}</div>
    <div style={{ fontFamily: TITLE, fontSize: fit(c.en, W - 90, 118, 60, 0.5), lineHeight: 1.02, color: C.tinta, textAlign: "center", padding: "0 30px" }}>{c.en}</div>
    <div style={{ fontFamily: BODY, fontWeight: 800, fontSize: fit(c.pt, W - 120, 46, 30, 0.56), color: MUTED, textAlign: "center", padding: "0 30px" }}>{c.pt}</div>
    {children}
  </div>
);

export const CardsBoard: React.FC<{
  cards: Cartao[]; active: number; activeSince: number; since: number; repita: boolean; repitaOn: boolean; repitaT: number; frame: number; fps: number;
}> = ({ cards, active, activeSince, since, repita, repitaOn, repitaT, frame, fps }) => {
  // pilha: cartões já apresentados (índices < active), fichas pequenas com fonte que encolhe para caber numa linha
  const seen = cards.slice(0, Math.max(0, active));
  let fs = 30;
  const chipW = (c: Cartao, f: number) => (c.en.length * f * 0.56) + f * 1.3 + 40;
  while (fs > 20 && seen.reduce((s, c) => s + chipW(c, fs) + 12, -12) > W) fs -= 2;
  const inK = spring({ frame: activeSince, fps, config: { damping: 14, mass: 0.8 } });
  const deckIn = spring({ frame: since, fps, config: { damping: 13 } });
  const prev = active > 0 && activeSince < 14 ? active - 1 : -1;
  const outK = interpolate(activeSince, [0, 12], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  return (
    <>
      <div style={{ position: "absolute", left: SAFE.x0, top: STACK_Y, width: W, height: 74, display: "flex", gap: 12, alignItems: "center", flexWrap: "nowrap" }}>
        {seen.map((c, i) => {
          const k = i === active - 1 ? spring({ frame: activeSince - 8, fps, config: { damping: 12 } }) : 1;
          return (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 6, background: "#fff", border: `5px solid ${C.tinta}`, borderRadius: 18, boxShadow: `0 5px 0 ${C.tinta}`,
              padding: "4px 14px 4px 10px", transform: `scale(${k}) rotate(${(i % 2 ? 1.5 : -1.5)}deg)`, whiteSpace: "nowrap",
            }}>
              <span style={{ fontFamily: EMOJI, fontSize: fs * 1.05 }}>{c.emoji ?? ""}</span>
              <span style={{ fontFamily: BODY, fontWeight: 800, fontSize: fs, color: C.tinta }}>{c.en}</span>
            </div>
          );
        })}
      </div>
      {active < 0 && (
        // baralho fechado enquanto a Capy apresenta o exercício
        <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transform: `scale(${deckIn})`, transformOrigin: `540px ${BIG_Y + BIG_H / 2}px` }}>
          {[2, 1, 0].map((j) => (
            <div key={j} style={{
              position: "absolute", left: SAFE.x0 + j * 14, top: BIG_Y - j * 16, width: W - j * 28, height: BIG_H, boxSizing: "border-box", background: j ? C.lilas : C.roxo,
              border: `8px solid ${C.tinta}`, borderRadius: 44, boxShadow: SHADOW, transform: `rotate(${(j - 1) * 2.2 + Math.sin(frame / 20) * 0.6}deg)`,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            }}>
              {j === 0 && (
                <>
                  <div style={{ fontFamily: TITLE, fontSize: 150, color: C.amarelo, WebkitTextStroke: `10px ${C.tinta}`, paintOrder: "stroke fill", lineHeight: 1 }}>{cards.length}</div>
                  <div style={{ fontFamily: TITLE, fontSize: 76, color: C.creme, WebkitTextStroke: `8px ${C.tinta}`, paintOrder: "stroke fill" }}>PALAVRAS NOVAS</div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
      {prev >= 0 && (
        <BigCard c={cards[prev]} n={prev + 1} total={cards.length}
          style={{ transform: `translate(${-outK * 260}px, ${-outK * 420}px) scale(${1 - outK * 0.8}) rotate(${-outK * 10}deg)`, opacity: 1 - outK }} />
      )}
      {active >= 0 && (
        <BigCard c={cards[active]} n={active + 1} total={cards.length}
          style={{ transform: `translateX(${(1 - inK) * 1000}px) rotate(${(1 - inK) * 12}deg)` }}>
          {repita && repitaOn && (
            <div style={{
              position: "absolute", right: -18, bottom: -26, display: "flex", alignItems: "center", gap: 8, background: C.amarelo, border: `6px solid ${C.tinta}`,
              borderRadius: 40, boxShadow: `0 6px 0 ${C.tinta}`, padding: "4px 20px 4px 6px",
              transform: `scale(${spring({ frame: repitaT, fps, config: { damping: 9 } }) * (1 + Math.sin(frame / 3) * 0.04)}) rotate(-4deg)`,
            }}>
              <MicIcon size={70} on />
              <span style={{ fontFamily: TITLE, fontSize: 48, color: C.tinta }}>REPITA!</span>
            </div>
          )}
        </BigCard>
      )}
    </>
  );
};

// ---------- ligar: RECONHECER (pares) ----------
const COL_W = 350;
const ROW_Y0 = 500;
const ROW_H = 132;
const ROW_PITCH = 186;
const LX = SAFE.x0, RX = SAFE.x1 - COL_W;

export const MatchBoard: React.FC<{
  pares: { en: string; pt: string }[]; direita: number[]; since: number; revealT: number; frame: number; fps: number;
}> = ({ pares, direita, since, revealT, frame, fps }) => {
  const n = pares.length;
  const pitch = n > 3 ? Math.min(ROW_PITCH, (1060 - ROW_Y0) / n) : ROW_PITCH;
  const rowY = (r: number) => ROW_Y0 + r * pitch;
  const drawn = (i: number) => (revealT < 0 ? 0 : interpolate(revealT - i * LIGAR_STAG, [0, LIGAR_DRAW], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) }));
  const box = (text: string, x: number, y: number, k: number, ok: number, key: string, lang: "en" | "pt") => {
    const s = spring({ frame: since - 6 - k * 5, fps, config: { damping: 13 } });
    const float = ok ? 0 : Math.sin((frame + k * 17) / 16) * 2.5;
    const pop = ok > 0 && ok < 1 ? 1 + Math.sin(ok * Math.PI) * 0.06 : 1;
    return (
      <div key={key} style={{
        position: "absolute", left: x, top: y + float, width: COL_W, height: ROW_H, boxSizing: "border-box", borderRadius: 30, border: `7px solid ${C.tinta}`,
        boxShadow: `0 8px 0 ${C.tinta}`, background: ok >= 1 ? C.certo : "#fff", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 18px",
        transform: `scale(${s * pop})`, textAlign: "center",
      }}>
        <span style={{
          fontFamily: lang === "en" ? TITLE : BODY, fontWeight: lang === "en" ? 400 : 800, fontSize: fit(text, COL_W - 40, lang === "en" ? 58 : 46, 28, lang === "en" ? 0.5 : 0.56),
          lineHeight: 1.05, color: ok >= 1 ? "#fff" : C.tinta, ...(ok >= 1 ? { WebkitTextStroke: `1.5px ${C.tinta}` } : {}),
        }}>{text}</span>
      </div>
    );
  };
  const tag = (label: string, x: number, color: string) => (
    <div style={{ position: "absolute", left: x, top: L.cardY + 8, width: COL_W, textAlign: "center" }}>
      <span style={{ fontFamily: BODY, fontWeight: 800, fontSize: 30, color: "#fff", background: color, border: `4px solid ${C.tinta}`, borderRadius: 14, padding: "4px 16px" }}>{label}</span>
    </div>
  );
  return (
    <>
      {tag("INGLÊS", LX, C.roxo)}
      {tag("PORTUGUÊS", RX, C.tangerina)}
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        {pares.map((_, i) => {
          const k = direita.indexOf(i);
          const y1 = rowY(i) + ROW_H / 2, y2 = rowY(k) + ROW_H / 2;
          const x1 = LX + COL_W - 4, x2 = RX + 4, mx = (x1 + x2) / 2;
          const d = `M${x1} ${y1} C${mx} ${y1} ${mx} ${y2} ${x2} ${y2}`;
          const t = drawn(i);
          if (revealT < 0) {
            // durante o timer: pontinhos de "?" entre as colunas
            return <circle key={i} cx={x1 + 22} cy={y1} r={9} fill={C.creme} stroke={C.tinta} strokeWidth={4} opacity={0.5 + 0.5 * Math.sin(frame / 6 + i)} />;
          }
          return (
            <g key={i}>
              <path d={d} pathLength={1} fill="none" stroke={C.tinta} strokeWidth={22} strokeLinecap="round" strokeDasharray="1 1" strokeDashoffset={1 - t} opacity={t > 0 ? 1 : 0} />
              <path d={d} pathLength={1} fill="none" stroke={C.certo} strokeWidth={12} strokeLinecap="round" strokeDasharray="1 1" strokeDashoffset={1 - t} opacity={t > 0 ? 1 : 0} />
              {t > 0 && <circle cx={x1} cy={y1} r={14} fill={C.certo} stroke={C.tinta} strokeWidth={5} />}
              {t >= 1 && <circle cx={x2} cy={y2} r={14} fill={C.certo} stroke={C.tinta} strokeWidth={5} />}
            </g>
          );
        })}
      </svg>
      {pares.map((p, i) => box(p.en, LX, rowY(i), i, drawn(i), `l${i}`, "en"))}
      {direita.map((pi, k) => box(pares[pi].pt, RX, rowY(k), k + 0.5, drawn(pi), `r${k}`, "pt"))}
    </>
  );
};
export const ligarDone = (n: number) => Math.round((n - 1) * LIGAR_STAG + LIGAR_DRAW);

// ---------- completar: USAR (lacuna) ----------
// PromptCard alto: situação em português + frase com a lacuna (vazia -> preenchida com a resposta no reveal).
export const COMPLETAR_CARD_H = 262;
export const GapSentence: React.FC<{ frase: string; lacuna: string; answer: string; revealT: number; fps: number; frame: number }> = ({
  frase, lacuna, answer, revealT, fps, frame,
}) => {
  const [before, ...rest] = frase.split(lacuna);
  const after = rest.join(lacuna);
  const full = `${before}${answer}${after}`;
  const fs = fit(full, W - 90, 68, 40, 0.48);
  const k = revealT >= 0 ? spring({ frame: revealT, fps, config: { damping: 10 } }) : 0;
  const blink = revealT < 0 ? 0.55 + 0.45 * Math.abs(Math.sin(frame / 9)) : 1;
  return (
    <div style={{ fontFamily: TITLE, fontSize: fs, lineHeight: 1.2, color: C.tinta, marginTop: 10 }}>
      {before}
      <span style={{
        display: "inline-block", minWidth: Math.round(answer.length * fs * 0.5) + 30, padding: "0 12px", margin: "0 4px", borderRadius: 16, textAlign: "center",
        background: revealT >= 0 ? C.certo : "rgba(140,108,255,0.14)", border: `5px ${revealT >= 0 ? "solid" : "dashed"} ${revealT >= 0 ? C.tinta : C.lilas}`,
        color: revealT >= 0 ? "#fff" : C.lilas, transform: `scale(${revealT >= 0 ? 0.85 + 0.15 * k : 1})`, opacity: revealT >= 0 ? 1 : blink,
        ...(revealT >= 0 ? { WebkitTextStroke: `1.5px ${C.tinta}` } : {}),
      }}>{revealT >= 0 ? answer : "?"}</span>
      {after}
    </div>
  );
};

// ---------- revisao: REVISÃO ESPAÇADA (quadro do Bolinha) ----------
// O Bolinha (hamster arquivista) guarda as frases nas bochechas: os cartões saem dele, o inglês fica borrado
// e cada fala `evento:"lembra"` revela o item `alvo`.
const REV_Y = 752;
const REV_H = 320;
export const ReviewBoard: React.FC<{
  itens: (Cartao & { de: string })[]; since: number; revealedAt: number[]; timerOn: boolean; frame: number; fps: number;
}> = ({ itens, since, revealedAt, timerOn, frame, fps }) => {
  const n = itens.length;
  const gap = 20;
  const cw = (W - gap * (n - 1)) / n;
  const nRev = revealedAt.filter((t) => t >= 0 && frame >= t).length;
  const lastRev = Math.max(-1, ...revealedAt.filter((t) => t >= 0 && frame >= t));
  const puff = lastRev >= 0 && frame - lastRev < 10 ? Math.sin(((frame - lastRev) / 10) * Math.PI) : 0;
  const cheeks = Math.max(0.2, 1 - (nRev / n) * 0.8) + puff * 0.15;
  const bIn = spring({ frame: since, fps, config: { damping: 12 } });
  const bx = 540, bw = 330;
  return (
    <>
      <div style={{ position: "absolute", left: bx - bw / 2 - 150, top: 388, transform: `scale(${bIn})`, transformOrigin: "50% 100%" }}>
        <Bolinha frame={frame} talking={false} emotion={puff > 0 ? "happy" : timerOn ? "neutral" : "smile"} size={bw} cheeks={cheeks} />
      </div>
      <div style={{
        position: "absolute", left: bx + 60, top: 470, transform: `rotate(5deg) scale(${spring({ frame: since - 10, fps, config: { damping: 10 } })})`,
        fontFamily: TITLE, fontSize: 40, color: C.tinta, background: C.amarelo, border: `6px solid ${C.tinta}`, borderRadius: 20, boxShadow: `0 6px 0 ${C.tinta}`,
        padding: "4px 18px", lineHeight: 1.05, textAlign: "center",
      }}>O BOLINHA<br />GUARDOU!</div>
      {itens.map((it, i) => {
        const x = SAFE.x0 + i * (cw + gap);
        // sai da bochecha do Bolinha e cai no lugar
        const k = spring({ frame: since - 12 - i * 6, fps, config: { damping: 14, mass: 0.7 } });
        const fromX = bx - cw / 2 + (i - (n - 1) / 2) * 60, fromY = 560;
        const tx = fromX + (x - fromX) * k, ty = fromY + (REV_Y - fromY) * k;
        const rt = revealedAt[i] >= 0 ? frame - revealedAt[i] : -1;
        const shown = rt >= 0;
        const pop = shown ? spring({ frame: rt, fps, config: { damping: 9 } }) : 0;
        const fsEn = fit(it.en, cw - 40, 54, 30, 0.5);
        return (
          <div key={i} style={{
            position: "absolute", left: tx, top: ty, width: cw, height: REV_H, boxSizing: "border-box", background: shown ? "#fff" : C.creme, borderRadius: 32,
            border: `7px solid ${shown ? C.certo : C.tinta}`, boxShadow: SHADOW, transform: `scale(${0.3 + 0.7 * k}) rotate(${(1 - k) * (i - 1) * 20 + (i % 2 ? 1.2 : -1.2)}deg)`,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", padding: "34px 14px 0", gap: 4, opacity: Math.min(1, k * 2),
          }}>
            <div style={{
              position: "absolute", top: -22, left: "50%", transform: "translateX(-50%) rotate(-3deg)", whiteSpace: "nowrap", fontFamily: BODY, fontWeight: 800, fontSize: 24,
              color: "#fff", background: C.lilas, border: `4px solid ${C.tinta}`, borderRadius: 12, padding: "1px 12px",
            }}>do {it.de}</div>
            <div style={{ fontFamily: EMOJI, fontSize: 84, lineHeight: 1.15 }}>{it.emoji ?? ""}</div>
            <div style={{ fontFamily: BODY, fontWeight: 800, fontSize: fit(it.pt, cw - 30, 36, 24, 0.56), color: MUTED, textAlign: "center", lineHeight: 1.1 }}>{it.pt}</div>
            <div style={{ position: "relative", marginTop: 10, width: cw - 36, minHeight: 90, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{
                fontFamily: TITLE, fontSize: fsEn, lineHeight: 1.04, color: shown ? C.roxo : C.tinta, textAlign: "center",
                filter: shown ? undefined : "blur(11px)", opacity: shown ? 1 : 0.55, transform: `scale(${shown ? 0.8 + 0.2 * pop : 1})`,
              }}>{it.en}</div>
              {!shown && (
                <div style={{ position: "absolute", fontFamily: TITLE, fontSize: 64, color: C.lilas, WebkitTextStroke: `6px ${C.tinta}`, paintOrder: "stroke fill" }}>?</div>
              )}
              {shown && (
                <div style={{ position: "absolute", right: -16, top: -34, transform: `scale(${pop})` }}>
                  <div style={{ width: 50, height: 50, borderRadius: 25, background: C.certo, border: `5px solid ${C.tinta}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Check size={30} />
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
};
