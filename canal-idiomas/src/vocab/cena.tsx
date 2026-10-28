import React from "react";
import { Capi } from "../Capi";
import { BOLINHA_BOX, Bolinha } from "../chars/Bolinha";
import { DUDA_BOX, Duda } from "../chars/Duda";
import { DonaJaca, JACA_BOX } from "../chars/DonaJaca";
import { HANK_BOX, Hank } from "../chars/Hank";
import { LAZY_BOX, Lazy } from "../chars/Lazy";
import { TURISTA_BOX, Turista } from "../chars/Turista";
import { BODY, C } from "../theme";
import { LAYOUT } from "./objetos";

// QUADRO DE CENA da série de VOCABULÁRIO: para tema de frase/cumprimento/pronome, em que a palavra NÃO é um objeto
// contado (hi, thanks, sorry, he, she…). No lugar dos objetos, o balcão ganha uma "janelinha" do Bean There (mesma
// parede, porta e contorno do café) com 1 ou 2 personagens fazendo a AÇÃO que dá sentido à palavra: chega e acena (hi),
// vai embora acenando (bye), pede apontando a xícara (please), recebe a xícara (thanks), esbarra (sorry), faz que sim
// (yes), faz que não com a palma (no), alguém aponta (I, you, he…). O contexto em PT fica num chip embaixo (apoio).
// Guiado por JSON como o resto: `palavras[k].cena = { quem, acao, contexto, adereco? }` no lugar de `objeto`/`qtd`.
// Coordenadas iguais às de objetos.tsx: base no tampo em y = 0, centro em x = 0 (o Vocab escala por OBJ_SCALE).
const INK = "#3A2213";
const S = { stroke: INK, strokeWidth: 8, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

import type { CenaAtor, VocabCena } from "./timeline";

export const CENA_W = 330, CENA_H = 262; // janela (antes do OBJ_SCALE do Vocab)
const ALT = 170; // altura de um personagem dentro da janela
const BOX: Record<CenaAtor, { w: number; h: number }> = {
  turista: TURISTA_BOX, capi: { w: 580, h: 760 }, hank: HANK_BOX, lazy: LAZY_BOX, duda: DUDA_BOX, bolinha: BOLINHA_BOX,
  donajaca: JACA_BOX, voce: { w: 120, h: 170 },
};
const larg = (id: CenaAtor) => (ALT * (id === "bolinha" ? 0.7 : 1) * BOX[id].w) / BOX[id].h;

const Ator: React.FC<{ id: CenaAtor; frame: number; feliz: boolean; x: number; flip?: boolean; rot?: number; dy?: number }> = ({
  id, frame, feliz, x, flip, rot = 0, dy = 0,
}) => {
  const w = larg(id);
  const h = (w * BOX[id].h) / BOX[id].w;
  const em = feliz ? "happy" : "neutral";
  const el = id === "turista" ? <Turista frame={frame} talking={false} emotion={feliz ? "smile" : "neutral"} size={w} />
    : id === "capi" ? <Capi frame={frame} talking={false} mood={feliz ? "happy" : "zen"} size={w} />
    : id === "hank" ? <Hank frame={frame} talking={false} emotion={feliz ? "smile" : "bored"} size={w} />
    : id === "lazy" ? <Lazy frame={frame} talking={false} emotion={feliz ? "smile" : "neutral"} size={w} mug={false} />
    : id === "duda" ? <Duda frame={frame} talking={false} emotion={em} size={w} />
    : id === "donajaca" ? <DonaJaca frame={frame} talking={false} emotion={em} size={w} />
    : id === "voce" ? <Voce />
    : <Bolinha frame={frame} talking={false} emotion={em} size={w} />;
  return (
    <g transform={`translate(${x} ${dy}) rotate(${rot} 0 0) scale(${flip ? -1 : 1} 1) translate(${-w / 2} ${-h})`}>{el}</g>
  );
};

// "você": quem assiste, como silhueta na tela de um celular (sem rosto, sem gênero)
const Voce: React.FC = () => (
  <svg width={120} height={170} viewBox="0 0 120 170" style={{ overflow: "visible" }}>
    <rect x={4} y={4} width={112} height={162} rx={18} fill={C.roxo} {...S} strokeWidth={7} />
    <rect x={16} y={18} width={88} height={134} rx={8} fill="#BFE6FF" />
    <circle cx={60} cy={70} r={20} fill={C.lilas} stroke={INK} strokeWidth={5} />
    <path d="M26 150 Q26 100 60 100 Q94 100 94 150 Z" fill={C.lilas} stroke={INK} strokeWidth={5} />
  </svg>
);
// pata acenando (mesmo traço do elenco); `ang` = inclinação do aceno
const Aceno: React.FC<{ x: number; y: number; ang: number; s?: number }> = ({ x, y, ang, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(${ang})`}>
    <path d="M-30 -30 Q-46 -36 -40 -18" fill="none" stroke="#fff" strokeWidth={6} strokeLinecap="round" opacity={0.9} />
    <path d="M30 -30 Q46 -36 40 -18" fill="none" stroke="#fff" strokeWidth={6} strokeLinecap="round" opacity={0.9} />
    <path d="M-16 20 L-18 -6 Q-22 -34 -10 -36 Q-2 -36 -2 -20 L0 -40 Q2 -52 10 -50 Q18 -48 16 -34 L16 -18 Q24 -30 30 -24 Q34 -18 24 0 L18 20 Z"
      fill="#F2D7B6" {...S} strokeWidth={6} />
  </g>
);
// palma aberta de "não" (lilás, sem vermelho)
const Palma: React.FC<{ x: number; y: number; ang: number }> = ({ x, y, ang }) => (
  <g transform={`translate(${x} ${y}) rotate(${ang})`}>
    <circle r={34} fill={C.lilas} {...S} strokeWidth={6} />
    <path d="M-12 18 L-14 -2 L-16 -16 Q-16 -22 -10 -22 L-8 -8 L-6 -26 Q-4 -32 2 -30 L2 -10 L6 -24 Q10 -28 14 -24 L12 -6 Q18 -14 22 -10 L14 12 L6 20 Z"
      fill="#fff" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
  </g>
);
const Visto: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle r={32} fill={C.certo} {...S} strokeWidth={6} />
    <path d="M-14 0 L-4 11 L15 -11" fill="none" stroke="#fff" strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
  </g>
);
const Seta: React.FC<{ x1: number; x2: number; y: number; k: number }> = ({ x1, x2, y, k }) => {
  const x = x1 + (x2 - x1) * k;
  const d = Math.sign(x2 - x1) || 1;
  return (
    <g>
      <path d={`M${x1} ${y} L${x} ${y}`} stroke={C.tangerina} strokeWidth={12} strokeLinecap="round" />
      <path d={`M${x} ${y} l${-18 * d} -16 M${x} ${y} l${-18 * d} 16`} stroke={C.tangerina} strokeWidth={12} strokeLinecap="round" />
    </g>
  );
};

// Fundo da janela: parede do café, porta à esquerda (entrada/saída), rodapé. Mesmas cores do CafeSet.
const Janela: React.FC<{ id: string; children: React.ReactNode; porta: boolean }> = ({ id, children, porta }) => (
  <g>
    <defs><clipPath id={id}><rect x={-CENA_W / 2} y={-CENA_H} width={CENA_W} height={CENA_H} rx={26} /></clipPath></defs>
    <g clipPath={`url(#${id})`}>
      <rect x={-CENA_W / 2} y={-CENA_H} width={CENA_W} height={CENA_H} fill="#FFD35C" />
      {[0, 1, 2, 3, 4, 5].map((k) => <rect key={k} x={-CENA_W / 2 + k * 60} y={-CENA_H} width={30} height={CENA_H} fill="#FFDF85" />)}
      {porta && (
        <g>
          <rect x={-CENA_W / 2 + 14} y={-CENA_H + 40} width={96} height={CENA_H - 40} fill="#C98E4E" {...S} strokeWidth={6} />
          <rect x={-CENA_W / 2 + 30} y={-CENA_H + 58} width={64} height={86} rx={8} fill="#BFE6FF" {...S} strokeWidth={5} />
          <circle cx={-CENA_W / 2 + 96} cy={-CENA_H / 2 + 30} r={6} fill={C.amarelo} {...S} strokeWidth={4} />
        </g>
      )}
      <rect x={-CENA_W / 2} y={-26} width={CENA_W} height={26} fill="#E9B874" />
      {children}
    </g>
    <rect x={-CENA_W / 2} y={-CENA_H} width={CENA_W} height={CENA_H} rx={26} fill="none" {...S} strokeWidth={10} />
  </g>
);

// `since` = quadros desde que a cena entrou (`instant` = já na pose final: revisão, desafio, final).
export const Cena: React.FC<{ cena: VocabCena; frame: number; since: number; instant?: boolean; uid: string }> = ({ cena, frame, since, instant, uid }) => {
  const t = instant ? 99 : since;
  const k = Math.min(1, Math.max(0, t / 12));
  const e = k * k * (3 - 2 * k);
  const [a, b] = cena.quem;
  const osc = Math.sin(frame / 3.2);
  const xL = -CENA_W / 2 + 70, xR = CENA_W / 2 - 80;
  const ad = cena.adereco ?? "xicara";
  const atores: React.ReactNode[] = [];
  const extras: React.ReactNode[] = [];
  const topo = -26 - ALT; // cabeça
  const mesa = (x: number, s = 0.42) => LAYOUT[ad] ? (
    <g transform={`translate(${x} -26)`}>
      <rect x={-46} y={0} width={92} height={10} fill="#C98E4E" {...S} strokeWidth={5} />
      <g transform={`scale(${s})`}>{LAYOUT[ad].draw(0, 0)}</g>
    </g>
  ) : null;

  switch (cena.acao) {
    case "chega": { // entra pela porta e acena
      const x = xL + (10 - xL) * e;
      atores.push(<Ator key="a" id={a} frame={frame} feliz={k >= 1} x={x} dy={-26} />);
      if (k >= 0.6) extras.push(<Aceno key="w" x={x + 70} y={topo + 40} ang={osc * 22} />);
      break;
    }
    case "sai": { // vai embora pela porta acenando (de costas: espelhado)
      const x = 40 + (xL + 20 - 40) * e;
      atores.push(<Ator key="a" id={a} frame={frame} feliz x={x} dy={-26} flip />);
      extras.push(<Aceno key="w" x={x + 64} y={topo + 36} ang={osc * 22} />);
      break;
    }
    case "acena": {
      atores.push(<Ator key="a" id={a} frame={frame} feliz x={-40} dy={-26} />);
      extras.push(<Aceno key="w" x={40} y={topo + 40} ang={osc * 22} s={0.6 + 0.4 * e} />);
      if (b) atores.push(<Ator key="b" id={b} frame={frame} feliz x={xR} dy={-26} flip />);
      break;
    }
    case "pede": { // aponta para a xícara na mesinha
      atores.push(<Ator key="a" id={a} frame={frame} feliz={false} x={-70} dy={-26} />);
      extras.push(mesa(90));
      extras.push(<Seta key="s" x1={0} x2={56} y={-96} k={e} />);
      break;
    }
    case "agradece": { // a xícara chega até ele e ele sorri
      atores.push(<Ator key="a" id={a} frame={frame} feliz={k >= 0.8} x={-60} dy={-26} />);
      const xc = 120 + (20 - 120) * e;
      extras.push(<g key="c" transform={`translate(${xc} -60) scale(0.42)`}>{LAYOUT[ad]?.draw(0, 0)}</g>);
      if (b) atores.push(<Ator key="b" id={b} frame={frame} feliz x={xR + 20} dy={-26} flip />);
      break;
    }
    case "esbarra": { // anda e esbarra no outro; estrela de impacto e gotinhas
      const x = -110 + (-30 - -110) * e;
      atores.push(<Ator key="b" id={b ?? "turista"} frame={frame} feliz={false} x={60} dy={-26} flip />);
      atores.push(<Ator key="a" id={a} frame={frame} feliz={false} x={x} dy={-26} rot={k >= 1 ? -4 : 0} />);
      if (k >= 1) {
        const p = Math.min(1, (t - 12) / 6);
        extras.push(
          <g key="i" transform={`translate(18 ${topo + 70}) scale(${0.6 + 0.4 * p})`}>
            <path d="M0 -34 L9 -10 L34 -12 L14 4 L24 28 L0 14 L-24 28 L-14 4 L-34 -12 L-9 -10 Z" fill="#fff" {...S} strokeWidth={5} />
          </g>,
          <g key="g">{[[-18, 0], [0, 8], [18, -2]].map(([dx, dy], j) => (
            <path key={j} d={`M${18 + dx} ${topo + 110 + dy + p * 22} q-7 12 0 18 q7 -6 0 -18 Z`} fill="#7A4A22" stroke={INK} strokeWidth={3} />
          ))}</g>,
        );
      }
      break;
    }
    case "sim": { // faz que sim (cabeceia) + visto turquesa
      const dy = -26 + (k >= 1 ? Math.max(0, Math.sin(frame / 2.6)) * 7 : 0);
      atores.push(<Ator key="a" id={a} frame={frame} feliz x={-30} dy={dy} />);
      extras.push(<Visto key="v" x={92} y={topo + 30} s={e} />);
      break;
    }
    case "nao": { // faz que não (balança) + palma lilás
      const rot = k >= 1 ? Math.sin(frame / 2.2) * 4 : 0;
      atores.push(<Ator key="a" id={a} frame={frame} feliz={false} x={-30} dy={-26} rot={rot} />);
      extras.push(<g key="p" transform={`translate(92 ${topo + 40}) scale(${e}) translate(-92 ${-(topo + 40)})`}><Palma x={92} y={topo + 40} ang={osc * 10} /></g>);
      break;
    }
    case "aponta": { // seta laranja da borda até quem é (1 ou 2 personagens)
      if (b) {
        atores.push(<Ator key="a" id={a} frame={frame} feliz x={-30} dy={-26} />);
        atores.push(<Ator key="b" id={b} frame={frame} feliz x={xR - 10} dy={-26} flip />);
      } else {
        atores.push(<Ator key="a" id={a} frame={frame} feliz x={30} dy={-26} />);
      }
      extras.push(<Seta key="s" x1={-CENA_W / 2 + 18} x2={b ? -100 : -50} y={topo + 80} k={e} />);
      break;
    }
  }
  const porta = cena.acao === "chega" || cena.acao === "sai";
  const pop = instant ? 1 : Math.min(1, 0.7 + since / 10);
  return (
    <g transform={`scale(${pop})`}>
      <Janela id={`cena-${uid}`} porta={porta}>
        {atores}
        {extras}
      </Janela>
    </g>
  );
};

// Chip do contexto (PT) logo abaixo da janela: diz a situação, não traduz a palavra.
export const ChipContexto: React.FC<{ text: string; opacity: number }> = ({ text, opacity }) => (
  <div style={{ display: "inline-block", opacity, background: C.roxo, color: C.creme, fontFamily: BODY, fontWeight: 800, fontSize: 34,
    borderRadius: 18, padding: "6px 20px", border: `5px solid ${C.tinta}`, whiteSpace: "nowrap" }}>{text}</div>
);
