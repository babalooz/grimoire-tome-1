import React from "react";
import { loadFont } from "@remotion/fonts";
import {
  AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig,
} from "remotion";

// Identidade "Sabia Não?": amarelo + preto + vermelho de plantão. Fontes locais (render sem rede).
const C = { am: "#FFD400", pr: "#0D0D12", vm: "#FF2E3D", br: "#FFFFFF", cr: "#FFF6E0" };
const TITULO = "Lilita One";
const CORPO = "Rubik";
loadFont({ family: TITULO, url: staticFile("fonts/LilitaOne.woff2") });
loadFont({ family: CORPO, url: staticFile("fonts/Rubik-800.woff2"), weight: "800" });

// Zona segura 1080x1920: fora disso a interface do TikTok cobre o conteúdo.
const SAFE = { x0: 60, x1: 940, y0: 200, y1: 1436 };
// Texto preto em cor clara, branco em cor escura (o roxo da ciência com texto preto não lia).
const tinta = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.45 ? C.pr : C.br;
};
const contorno = (px: number) => ({ WebkitTextStroke: `${px}px ${C.pr}`, paintOrder: "stroke fill" as const });

export type Cena = {
  bloco: string; narracao: string; editoria?: string; tarja?: string; texto_tela?: string; imagem?: string; sfx?: string; timer?: number;
};
export type Palavra = { w: string; t: number; fim: number };
export type Timing = { audio: string; duration: number; palavras?: Palavra[] };
export type NoticiaProps = {
  id: string; cenas: Cena[]; timings: Timing[]; imagens: (string | null)[];
  fonte_no_fim?: string; selo_imagem?: string;
  kit_editorias?: Record<string, { cor?: string; icone?: string }>; comentario_fixado?: string;
};

const RESPIRO = 0.3;
export const duracaoCena = (c: Cena, t: Timing, fps: number) =>
  Math.ceil(((t?.duration ?? 2) + (c.timer ?? 0) + RESPIRO) * fps);

// Nome do efeito no roteiro -> arquivo em public/sfx (Kenney, CC0).
const SFX: Record<string, string> = {
  vinheta: "stamp", zoom: "whoosh", "tique": "tick", buzina: "wrong", bonk: "wrong", whoosh: "whoosh",
  pop: "pop", carimbo: "stamp", pneu: "whoosh",
};
const sfxDe = (txt?: string) => {
  const k = Object.keys(SFX).find((k) => (txt ?? "").toLowerCase().includes(k));
  return k ? SFX[k] : null;
};

// Imagem com zoom lento (Ken Burns): mudança visual contínua segura a atenção.
const Fundo: React.FC<{ src: string | null; descricao?: string; selo?: string; dur: number }> = ({ src, descricao, selo, dur }) => {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, dur], [1.0, 1.12]);
  return (
    <AbsoluteFill style={{ background: C.pr, overflow: "hidden" }}>
      {src ? (
        <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${z})` }} />
      ) : (
        <AbsoluteFill style={{
          background: "radial-gradient(circle at 50% 45%, #2b2f3a 0%, #0D0D12 70%)", transform: `scale(${z})`,
          display: "flex", alignItems: "center", justifyContent: "center", padding: 120,
        }}>
          <div style={{ color: "#8a8f9c", font: `800 34px ${CORPO}`, textAlign: "center", lineHeight: 1.3 }}>
            IMAGEM PENDENTE<br />
            <span style={{ fontSize: 26, opacity: 0.8 }}>{descricao}</span>
          </div>
        </AbsoluteFill>
      )}
      {/* escurece topo e base para o texto ler em qualquer foto */}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,.55) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 55%, rgba(0,0,0,.7) 100%)" }} />
      {src && selo ? (
        <div style={{ position: "absolute", right: 150, top: 560, background: "rgba(13,13,18,.75)", color: C.br,
          font: `800 26px ${CORPO}`, padding: "6px 14px", borderRadius: 8, letterSpacing: 2 }}>{selo}</div>
      ) : null}
    </AbsoluteFill>
  );
};

// Tarja fixa no topo o vídeo inteiro (regra do Bruno Sub News).
// Cada notícia troca a manchete e a cor da faixa (kit de editorias); a marca "SABIA NÃO?" nunca muda.
const Tarja: React.FC<{ manchete: string; cor: string; entra: boolean }> = ({ manchete, cor, entra }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = entra ? spring({ frame: f, fps, config: { damping: 13 } }) : 1;
  const piscar = Math.floor(f / 15) % 2 === 0 ? 1 : 0.35;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: SAFE.y0 }}>
      <div style={{ display: "flex", height: 92 }}>
        <div style={{ background: C.pr, color: C.am, font: `64px ${TITULO}`, padding: "8px 30px 0 60px" }}>SABIA NÃO?</div>
        <div style={{ background: C.vm, color: C.br, font: `800 38px ${CORPO}`, display: "flex", alignItems: "center", gap: 12, padding: "0 24px" }}>
          <span style={{ width: 20, height: 20, borderRadius: 10, background: C.br, opacity: piscar }} />HOJE
        </div>
      </div>
      <div style={{ background: cor, color: tinta(cor), font: `800 50px/1.1 ${CORPO}`, padding: "18px 60px 22px",
        transform: `translateX(${(1 - s) * -1100}px)`,
        borderTop: `8px solid ${C.pr}`, borderBottom: `8px solid ${C.pr}`, textTransform: "uppercase" }}>{manchete}</div>
    </div>
  );
};

// Legenda em blocos de 3 palavras, distribuídos ao longo da fala (aproximação sem alinhamento fonético).
// Legenda em blocos de 3 palavras. Com "palavras" (tempo real de cada palavra, motor edge) fica sincronizada
// com a fala; sem isso, distribui os blocos ao longo da duração (aproximação).
const Legenda: React.FC<{ texto: string; dur: number; palavras?: Palavra[] }> = ({ texto, dur, palavras }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const agora = f / fps;
  const ws = palavras?.length ? palavras.map((p) => p.w) : texto.split(/\s+/);
  let idx: number;
  if (palavras?.length) {
    const atual = palavras.reduce((acc, p, k) => (p.t <= agora ? k : acc), 0);
    idx = Math.floor(atual / 3);
  } else {
    idx = Math.floor((agora / Math.max(dur, 0.1)) * Math.ceil(ws.length / 3));
  }
  const bloco = ws.slice(idx * 3, idx * 3 + 3).join(" ");
  return (
    <div style={{ position: "absolute", left: SAFE.x0, right: 140, top: 1270, textAlign: "center",
      font: `70px/1.05 ${TITULO}`, color: C.br, textTransform: "uppercase", ...contorno(12) }}>
      {bloco}
    </div>
  );
};

const TextoTela: React.FC<{ texto: string; cor: string }> = ({ texto, cor }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - 4, fps, config: { damping: 9, mass: 0.6 } });
  return (
    <div style={{ position: "absolute", left: SAFE.x0, right: 140, top: 920, display: "flex", justifyContent: "center" }}>
      <div style={{ transform: `scale(${0.6 + s * 0.4}) rotate(${(1 - s) * -6}deg)`, opacity: Math.min(1, s * 1.5),
        background: cor, color: tinta(cor), font: `800 60px/1.1 ${CORPO}`, padding: "16px 28px", borderRadius: 14,
        border: `6px solid ${C.pr}`, textAlign: "center", textTransform: "uppercase", boxShadow: `10px 10px 0 ${C.pr}` }}>
        {texto}
      </div>
    </div>
  );
};

const Timer: React.FC<{ inicio: number; seg: number }> = ({ inicio, seg }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps - inicio;
  if (t < 0 || t >= seg) return null;
  const n = seg - Math.floor(t);
  const s = spring({ frame: Math.round((t % 1) * fps), fps, config: { damping: 8 } });
  return (
    <div style={{ position: "absolute", left: 0, right: 80, top: 560, textAlign: "center", font: `300px ${TITULO}`,
      color: C.am, transform: `scale(${0.7 + s * 0.3})`, ...contorno(18) }}>{n}</div>
  );
};

const Letreiro: React.FC<{ texto: string }> = ({ texto }) => {
  const f = useCurrentFrame();
  const x = 1080 - ((f * 4) % (texto.length * 22 + 1400));
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: SAFE.y1 + 4, height: 62, background: C.pr, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 230, background: C.vm, color: C.br, zIndex: 2,
        font: `800 32px ${CORPO}`, display: "flex", alignItems: "center", justifyContent: "center" }}>● ÚLTIMAS</div>
      <div style={{ position: "absolute", left: x, top: 12, whiteSpace: "nowrap", color: C.cr, font: `800 32px ${CORPO}` }}>{texto}</div>
    </div>
  );
};

const CenaView: React.FC<{
  c: Cena; t: Timing; img: string | null; selo?: string; dur: number; cor: string; manchete: string; entra: boolean;
}> = ({ c, t, img, selo, dur, cor, manchete, entra }) => {
  const { fps } = useVideoConfig();
  const efeito = sfxDe(c.sfx);
  // Tudo que o quiz revela só aparece depois do timer.
  return (
    <AbsoluteFill>
      <Fundo src={img} descricao={c.imagem} selo={selo} dur={dur} />
      <Audio src={staticFile(t.audio)} />
      {efeito ? <Audio src={staticFile(`sfx/${efeito}.ogg`)} volume={0.5} /> : null}
      {c.texto_tela ? <TextoTela texto={c.texto_tela} cor={cor} /> : null}
      <Legenda texto={c.narracao} dur={t.duration} palavras={t.palavras} />
      <Tarja manchete={manchete} cor={cor} entra={entra} />
      {c.timer ? (
        <>
          <Timer inicio={t.duration} seg={c.timer} />
          {Array.from({ length: c.timer }, (_, k) => (
            <Sequence key={k} from={Math.round((t.duration + k) * fps)} durationInFrames={20}>
              <Audio src={staticFile("sfx/tick.ogg")} volume={0.6} />
            </Sequence>
          ))}
        </>
      ) : null}
    </AbsoluteFill>
  );
};

export const Noticia: React.FC<NoticiaProps> = (p) => {
  const { fps } = useVideoConfig();
  let from = 0;
  let manchete = "";
  return (
    <AbsoluteFill style={{ background: C.pr }}>
      {p.cenas.map((c, i) => {
        const dur = duracaoCena(c, p.timings[i], fps);
        const entra = Boolean(c.tarja) && i > 0;
        manchete = c.tarja ?? manchete; // a manchete vale até a próxima notícia
        const cor = p.kit_editorias?.[c.editoria ?? ""]?.cor ?? C.am;
        const el = (
          <Sequence key={i} from={from} durationInFrames={dur}>
            <CenaView c={c} t={p.timings[i]} img={p.imagens?.[i] ?? null} selo={p.selo_imagem} dur={dur} cor={cor} manchete={manchete} entra={entra} />
          </Sequence>
        );
        from += dur;
        return el;
      })}
      <Letreiro texto={`${p.fonte_no_fim ?? ""}   •   Imagens: simulação gerada por IA   •   ${p.comentario_fixado ?? "Comenta aí 👇"}`} />
    </AbsoluteFill>
  );
};
