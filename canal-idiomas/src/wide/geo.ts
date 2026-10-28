import type { Cam } from "../Sitcom";
import { Actor, CAFE_STAGE, CafeGeo, Spot } from "../cafe/timeline";

// Palco HORIZONTAL do Bean There (mundo 1920x1080, composições CafeWide/VocabWide/DiaWide — decisão do Felipe 28/10).
// Não é o vertical com moldura: balcão largo de ponta a ponta, elenco lado a lado. Da esquerda para a direita:
// Capy (cliente, primeiro plano) · Bolinha sentado no balcão · Hank atrás do balcão (centro) · Lazy atrás do balcão ·
// cliente da vez (Duda/Poppy/turista, primeiro plano à direita). Dona Jaca = videochamada em espaço de tela.
// Sem imports de React/fonte: também roda no node (scripts/dia-wide.ts).
export const W = 1920, H = 1080;
export const COUNTER_YW = 640; // tampo do balcão (o vertical usa 1130 num mundo de 1920)

// Zona segura 16:9 (YouTube): margem de título ~5% + faixa dos controles do player embaixo (barra/botões cobrem
// ~y>960 com o mouse em cima ou pausado). Nada de texto fora desta caixa (auditoria em scripts/portao.py --dia).
export const SAFE_W = { x0: 110, x1: 1810, y0: 64, y1: 950 };

// Mesmas proporções de rosto do vertical (head/headTop relativos ao tamanho), só muda left/top/size.
const spot = (id: Exclude<Actor, "donajaca">, left: number, top: number, size: number, zoom: number): Spot => {
  const v = CAFE_STAGE[id];
  const k = size / v.size;
  return {
    left, top, size, zoom,
    head: [left + (v.head[0] - v.left) * k, top + (v.head[1] - v.top) * k],
    headTop: top + (v.headTop - v.top) * k,
  };
};
// atrás do balcão: o tampo corta na mesma altura relativa do vertical
export const behindW = (id: Exclude<Actor, "donajaca">, headX: number, size: number, zoom: number) => {
  const v = CAFE_STAGE[id];
  const k = size / v.size;
  const top = COUNTER_YW - (1130 - v.top) * k;
  return spot(id, headX - (v.head[0] - v.left) * k, top, size, zoom);
};
export const frontW = (id: Exclude<Actor, "donajaca">, headX: number, size: number, zoom: number) => {
  const v = CAFE_STAGE[id];
  const k = size / v.size;
  const top = COUNTER_YW - (1130 - v.top) * k;
  return spot(id, headX - (v.head[0] - v.left) * k, top, size, zoom);
};

export const STAGE_W: Record<Exclude<Actor, "donajaca">, Spot> = {
  capi: frontW("capi", 400, 560, 1.3),
  bolinha: behindW("bolinha", 700, 250, 1.6),
  hank: behindW("hank", 1000, 560, 1.3),
  lazy: behindW("lazy", 1330, 340, 1.5),
  duda: frontW("duda", 1560, 440, 1.35),
  poppy: frontW("poppy", 1560, 450, 1.35),
  turista: frontW("turista", 1560, 440, 1.35),
};
export const PHONE_W = { left: 1420, top: 120, size: 330 };

export const TWO_W: Cam = { cx: 960, cy: 540, z: 1 };
export const clampW = (c: Cam): Cam => {
  const z = Math.max(1, c.z);
  const hw = 960 / z, hh = 540 / z;
  return { z, cx: Math.min(W - hw, Math.max(hw, c.cx)), cy: Math.min(H - hh, Math.max(hh, c.cy)) };
};
const headOf = (id: Actor): [number, number] => (id === "donajaca" ? STAGE_W.capi.head : STAGE_W[id].head);
export const closeW = (id: Actor): Cam => {
  const st = id === "donajaca" ? STAGE_W.capi : STAGE_W[id];
  // close "médio": rosto + ombros, rosto um pouco acima do centro (a legenda fica embaixo)
  return clampW({ cx: st.head[0], cy: st.head[1] + 70, z: st.zoom });
};
export const pairW = (a: Actor, b: Actor): Cam => {
  const [ax, ay] = headOf(a), [bx, by] = headOf(b);
  const z = Math.max(1, Math.min(1.3, 1920 / (Math.abs(ax - bx) + 900), 1080 / (Math.abs(ay - by) + 620)));
  return clampW({ cx: (ax + bx) / 2, cy: (ay + by) / 2 + 60, z });
};
export const GEO_W: CafeGeo = { two: TWO_W, close: closeW, pair: pairW, clamp: clampW };
export const toScreenW = (cam: Cam, x: number, y: number): [number, number] => [960 + (x - cam.cx) * cam.z, 540 + (y - cam.cy) * cam.z];
