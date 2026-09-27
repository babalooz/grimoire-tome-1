import type { Emotion } from "../chars/common";
import type { Cam } from "../Sitcom";

// Sem imports de módulos com fonte/React (theme.ts, Sitcom.tsx): este arquivo também roda no node (scripts/cafe-frames.ts).
// Geometria copiada de src/Sitcom.tsx (STAGE, TWO, clampCam, closeOn) e níveis de src/lesson/music.ts (MUSIC) — manter iguais.
const STAGE = {
  capi: { left: 20, top: 900, size: 520, head: [293, 1177] as [number, number], headTop: 1034, zoom: 1.3 },
  hank: { left: 480, top: 560, size: 560, head: [680, 800] as [number, number], headTop: 626, zoom: 1.3 },
  lazy: { left: 276, top: 751, size: 340, head: [440, 890] as [number, number], headTop: 765, zoom: 1.6 },
};
const TWO: Cam = { cx: 540, cy: 960, z: 1 };
const clampCam = (c: Cam): Cam => {
  const hw = 540 / c.z, hh = 960 / c.z;
  return { z: c.z, cx: Math.min(1080 - hw, Math.max(hw, c.cx)), cy: Math.min(1920 - hh, Math.max(hh, c.cy)) };
};
const closeOn = (id: keyof typeof STAGE): Cam => {
  const st = STAGE[id];
  return clampCam({ cx: st.head[0], cy: st.head[1] - (id === "capi" ? 150 : 90), z: st.zoom });
};
const MUSIC = { fileLufs: -16, attack: 3, release: 10, lookahead: 3, fadeOut: 30 };
const DEFAULT_VOICE_LUFS = -22;

// Formato "SITCOM DO CAFÉ" (passivo, sem interação) — docs/pesquisas/formato-novo/formato-ensino-video.md §3 F1.
// Roteiro = lista de beats (episodes/cafe-*.json, `format: "cafe"`). Esta agenda é a fonte da verdade do tempo:
// a composição (src/Cafe.tsx), a esquete (src/CafeEsquete.tsx), a trilha e o script de quadros (scripts/cafe-frames.ts).

export type Actor = "capi" | "hank" | "lazy" | "duda" | "poppy" | "bolinha" | "donajaca";
export type CafeSpeaker = Actor | "narrador";
export type CafeLine = {
  speaker: CafeSpeaker;
  lang: "pt" | "en";
  text: string;
  emotion?: Emotion;
  mode?: "fala" | "pensamento";
  speed?: number;
  sfx?: string[];
  react?: Partial<Record<Actor, Emotion>>;
  hold?: number;
  card?: boolean;
  cardTexto?: string;
  alvo?: true | "variacao";
  errado?: boolean;
  repita?: boolean;
  bolinha?: boolean;
};
export type CafePausa = { tipo: "pausa"; s: number; react?: Partial<Record<Actor, Emotion>> };
export type CafePergunta = { tipo: "pergunta"; s: number; text: string };
export type CafeBeat = CafeLine | CafePausa | CafePergunta;
export type CafePart = { text: string; start: number; end: number };
export type CafeTiming = { audio: string; duration: number; parts?: CafePart[]; wpm?: number; speed?: number } | null;
export type CafeSerie = { temporada: number; capitulo: number; episodio: number; codigo: string; tituloCapitulo: string; progresso?: string };
export type CafeEsqueteDef = { id: string; de: number; ate: number; gancho: string; cta: string };
export type CafeProps = {
  id?: string;
  format?: string;
  serie?: CafeSerie;
  hookTitle?: string;
  alvo: { en: string; pt: string; nucleo?: string; variacoes?: string[] };
  errado?: { en: string; pt: string };
  cast?: string[];
  notebook?: number;
  beats: CafeBeat[];
  esquetes?: CafeEsqueteDef[];
  timings: CafeTiming[];
  voiceLufs?: number;
};

export const isLine = (b: CafeBeat): b is CafeLine => (b as CafeLine).text !== undefined && (b as CafePausa).tipo === undefined;
export const isPausa = (b: CafeBeat): b is CafePausa => (b as CafePausa).tipo === "pausa";
export const isPergunta = (b: CafeBeat): b is CafePergunta => (b as CafePergunta).tipo === "pergunta";

// ---- ritmo (formato-ensino-video.md §5 e voz-audio-didatico.md) ----
export const GAP = 0.5; // pausa entre falas (≥ 0,45 s; antes ~0,1)
export const READ_CPS = 15; // legenda: no máx. 15 caracteres/s
export const READ_MIN = 0.833; // legenda: no mín. 833 ms na tela
export const ALVO_MIN = 2.5; // frase-alvo fica ≥ 2,5 s na tela
export const STRIKE_DELAY = 4; // frames depois do fim da fala errada até o risco começar
export const STRIKE_FRAMES = 9; // risco desenhado em 300 ms
export const STRIKE_HOLD = 0.6; // s com o risco já feito antes do próximo beat
export const PERGUNTA_LEAD = 8; // frames de entrada do cartão da pergunta antes do contador
export const REPITA_EXTRA = 1.0; // shadowing = duração da fala + 1,0 s
export const REPITA_MIN = 1.5;
export const REPITA_MAX = 3.5;
export const CAM_MIN = 45; // câmera muda no mínimo a cada 1,5 s (exceto o corte do gancho)
export const CAM_MAX = 90; // e no máximo a cada 3 s (planos longos ganham um corte de reenquadramento)

export type CafeStep = {
  i: number;
  beat: CafeBeat;
  from: number;
  dur: number;
  audioFrames: number; // fala: frames de áudio (0 em pausa/pergunta)
  shadowFrom: number; // repita: frame em que começa o silêncio de shadowing (-1 = não tem)
  shadowFrames: number;
  quietFrames: number; // pausa/pergunta: frames do silêncio
  audio?: string;
  timing?: CafeTiming;
};

export const firstAlvoIndex = (p: CafeProps) => p.beats.findIndex((b) => isLine(b) && b.alvo === true);

export const buildCafeSchedule = (p: CafeProps, fps: number): CafeStep[] => {
  if (!p.timings || p.timings.length !== p.beats.length) {
    throw new Error(`${p.id ?? "episódio"}: timings (${p.timings?.length ?? 0}) não batem com os beats (${p.beats.length}); rode scripts/tts.py`);
  }
  const steps: CafeStep[] = [];
  let from = 0;
  p.beats.forEach((b, i) => {
    let dur: number, audioFrames = 0, shadowFrom = -1, shadowFrames = 0, quietFrames = 0;
    const t = p.timings[i];
    if (isLine(b)) {
      if (!t) throw new Error(`${p.id ?? "episódio"} · beat ${i}: sem áudio para "${b.text}" (rode scripts/tts.py)`);
      audioFrames = Math.ceil(t.duration * fps);
      const read = Math.ceil(Math.max(READ_MIN, b.text.length / READ_CPS) * fps);
      let body = Math.max(audioFrames + Math.round(GAP * fps), read);
      if (b.alvo === true) body = Math.max(body, Math.ceil(ALVO_MIN * fps));
      if (b.errado) body = Math.max(body, audioFrames + STRIKE_DELAY + STRIKE_FRAMES + Math.round(STRIKE_HOLD * fps));
      if (b.repita) {
        shadowFrames = Math.round(Math.min(REPITA_MAX, Math.max(REPITA_MIN, t.duration + REPITA_EXTRA)) * fps);
        shadowFrom = from + audioFrames + 6; // meio respiro entre o modelo e o "sua vez"
        body = Math.max(body, audioFrames + 6 + shadowFrames + Math.round(GAP * fps));
      }
      dur = body + Math.round((b.hold ?? 0) * fps);
    } else if (isPergunta(b)) {
      quietFrames = Math.round(b.s * fps);
      dur = PERGUNTA_LEAD + quietFrames + Math.round(0.3 * fps);
    } else {
      quietFrames = Math.round(b.s * fps);
      dur = quietFrames;
    }
    steps.push({ i, beat: b, from, dur, audioFrames, shadowFrom, shadowFrames, quietFrames, audio: isLine(b) ? t!.audio : undefined, timing: t });
    from += dur;
  });
  return steps;
};

export const cafeTotal = (steps: CafeStep[]) => (steps.length ? steps[steps.length - 1].from + steps[steps.length - 1].dur : 1);
export const cafeFrames = (p: CafeProps, fps: number) =>
  !p.timings || !p.timings.length ? 1 : cafeTotal(buildCafeSchedule(p, fps));
export const stepAt = (steps: CafeStep[], frame: number) =>
  steps.find((s) => frame >= s.from && frame < s.from + s.dur) ?? steps[steps.length - 1];

// ---- karaokê pelos tempos reais do TTS (pedaços separados por pausa em `parts`) ----
const norm = (w: string) => w.toLowerCase().replace(/[^a-z0-9à-ÿ']/g, "");
export const wordTimes = (text: string, t: CafeTiming): number[] => {
  const words = text.split(/\s+/);
  if (!t) return words.map(() => 0);
  const parts = t.parts?.length ? t.parts : [{ text, start: 0, end: t.duration }];
  const out: number[] = [];
  parts.forEach((pt) => {
    const pw = pt.text.split(/\s+/).filter(Boolean);
    const total = pw.reduce((s, w) => s + w.length + 1, 0);
    let acc = 0;
    pw.forEach((w) => { out.push(pt.start + ((pt.end - pt.start) * acc) / total); acc += w.length + 1; });
  });
  // pedaços e texto de tela têm o mesmo número de palavras; se não tiverem, cai na distribuição linear
  if (out.length !== words.length) return words.map((_, k) => (t.duration * k) / words.length);
  return out;
};
// progresso compatível com src/lesson/Caption.tsx (active = floor(progress * nPalavras)); ≥ 1 = fala terminou
export const karaokeProgress = (text: string, t: CafeTiming, sec: number) => {
  const wt = wordTimes(text, t);
  const end = t?.parts?.length ? t.parts[t.parts.length - 1].end : t?.duration ?? 0;
  if (sec >= end + 0.05) return 1;
  let k = 0;
  wt.forEach((x, j) => { if (sec >= x) k = j; });
  return (k + 0.5) / wt.length;
};
// palavras [de, até) da frase-alvo dentro da legenda: alvo true = frase inteira; "variacao" = só o núcleo
export const targetRange = (text: string, target: string): [number, number] | undefined => {
  const w = text.split(/\s+/).map(norm);
  const t = target.split(/\s+/).map(norm).filter(Boolean);
  for (let a = 0; a + t.length <= w.length; a++) if (t.every((x, k) => w[a + k] === x)) return [a, a + t.length];
  return undefined;
};
export const highlightFor = (p: CafeProps, b: CafeLine): [number, number] | undefined => {
  if (!b.alvo || b.lang !== "en") return undefined;
  const nucleo = p.alvo.nucleo ?? p.alvo.en;
  if (b.alvo === "variacao") return targetRange(b.text, nucleo);
  return targetRange(b.text, p.alvo.en.replace(/[?.!]+$/, "")) ?? targetRange(b.text, nucleo) ?? [0, b.text.split(/\s+/).length];
};

// ---- palco (mundo 1080x1920; capi/hank/lazy = STAGE do Sitcom) ----
// head = centro do rosto; headTop = topo da cabeça (ponta do balão). Clientes ficam no primeiro plano à direita,
// o Bolinha sentado no balcão, a Dona Jaca fora do mundo (videochamada em espaço de tela).
export type Spot = { left: number; top: number; size: number; head: [number, number]; headTop: number; zoom: number };
export const CAFE_STAGE: Record<Exclude<Actor, "donajaca">, Spot> = {
  ...STAGE,
  duda: { left: 560, top: 1010, size: 420, head: [690, 1195], headTop: 1070, zoom: 1.35 },
  poppy: { left: 560, top: 1020, size: 430, head: [712, 1185], headTop: 1060, zoom: 1.35 },
  bolinha: { left: 610, top: 826, size: 270, head: [735, 960], headTop: 880, zoom: 1.55 },
};
export const PHONE = { left: 560, top: 690, size: 300 }; // Dona Jaca: moldura de celular (espaço de tela, x ≤ 920)

export const closeOnActor = (id: Actor): Cam => {
  if (id === "capi" || id === "hank" || id === "lazy") return closeOn(id);
  if (id === "donajaca") return closeOn("capi");
  const st = CAFE_STAGE[id];
  return clampCam({ cx: st.head[0], cy: st.head[1] - 90, z: st.zoom });
};
const headOf = (id: Actor): [number, number] => (id === "donajaca" ? CAFE_STAGE.capi.head : CAFE_STAGE[id].head);
// plano que enquadra 2 personagens (cabeças) inteiros
export const pairCam = (a: Actor, b: Actor): Cam => {
  const [ax, ay] = headOf(a), [bx, by] = headOf(b);
  const z = Math.max(1, Math.min(1.25, 1080 / (Math.abs(ax - bx) + 560), 1920 / (Math.abs(ay - by) + 900)));
  return clampCam({ cx: (ax + bx) / 2, cy: (ay + by) / 2 + 40, z });
};

// ---- presença em cena (entradas/saídas) ----
export const ENTER = 12; // frames de entrada/saída
export type Presence = { in: number; out: number }; // frames absolutos: começa a entrar em `in`, termina de sair em `out`
export const presences = (steps: CafeStep[]): Partial<Record<Actor, Presence>> => {
  const out: Partial<Record<Actor, Presence>> = {};
  const first = (id: Actor) => steps.find((s) => isLine(s.beat) && s.beat.speaker === id);
  const end = cafeTotal(steps) + 999;
  (["duda", "poppy"] as Actor[]).forEach((id) => {
    const f = first(id);
    if (!f) return;
    // cliente sai com o café: depois da 1ª resposta do Hank que vem depois da fala dela
    const reply = steps.find((s) => s.i > f.i && isLine(s.beat) && s.beat.speaker === "hank");
    out[id] = { in: f.from - ENTER, out: reply ? reply.from + reply.dur : f.from + f.dur };
  });
  const lazy = first("lazy");
  if (lazy) out.lazy = { in: lazy.from - ENTER - 6, out: end };
  const bol = steps.find((s) => isLine(s.beat) && (s.beat.speaker === "bolinha" || s.beat.bolinha));
  if (bol) out.bolinha = { in: bol.from - ENTER, out: end };
  const jaca = first("donajaca");
  if (jaca) {
    const next = steps[jaca.i + 1];
    out.donajaca = { in: jaca.from - ENTER, out: next ? next.from + next.dur : jaca.from + jaca.dur };
  }
  return out;
};
// 0 = fora, 1 = em cena
export const presenceK = (pr: Presence | undefined, frame: number) => {
  if (!pr) return 0;
  const k = Math.min(1, Math.max(0, (frame - pr.in) / ENTER), Math.max(0, (pr.out - frame) / ENTER));
  return k * k * (3 - 2 * k);
};

// ---- câmera: planos com duração mínima/máxima, gancho no início ----
export type Shot = { from: number; to: number; cam: Cam; hook?: "a" | "b"; subjects: Actor[] | "wide" };
// Gancho (mesmo desenho de src/Licao.tsx HOOK): close em quem fala → CORTE SECO para a reação (≈0,5 s) → plano normal.
export const HOOK_CUT = 16, HOOK_INSERT = 22;

const subjectOf = (s: CafeStep): Actor[] | "wide" => {
  const b = s.beat;
  if (isPergunta(b)) return ["capi"];
  if (isPausa(b)) {
    const k = Object.keys(b.react ?? {})[0] as Actor | undefined;
    return k ? [k] : "wide";
  }
  if (b.card || b.speaker === "narrador") return "wide";
  if (b.mode === "pensamento" || b.speaker === "donajaca") return ["capi"];
  return [b.speaker as Actor];
};
const camOf = (subj: Actor[] | "wide"): Cam => {
  if (subj === "wide" || subj.length === 0 || subj.length > 2) return TWO;
  if (subj.length === 1) return closeOnActor(subj[0]);
  return pairCam(subj[0], subj[1]);
};
const eqSubj = (a: Actor[] | "wide", b: Actor[] | "wide") =>
  a === "wide" || b === "wide" ? a === b : a.length === b.length && b.every((x) => a.includes(x));
const within = (a: Actor[] | "wide", b: Actor[] | "wide") => a === "wide" || (b !== "wide" && b.every((x) => a.includes(x)));
// reenquadramento de plano longo: close ↔ plano com quem escuta (a Capy; ou o Hank se a Capy fala)
const altCam = (sh: Shot): Cam => {
  if (sh.subjects === "wide") return punch(sh.cam);
  if (sh.subjects.length === 1) return pairCam(sh.subjects[0], sh.subjects[0] === "capi" ? "hank" : "capi");
  return closeOnActor(sh.subjects[0]);
};

export const planShots = (steps: CafeStep[], h0 = 0): Shot[] => {
  const total = cafeTotal(steps);
  const shots: Shot[] = [];
  const s0 = stepAt(steps, h0);
  let cur: Shot;
  const b0 = s0.beat;
  const hookOk = isLine(b0) && !b0.card && s0.from + s0.dur - h0 > HOOK_CUT + HOOK_INSERT + 10;
  if (hookOk) {
    const a = (subjectOf(s0) as Actor[])[0] ?? "capi";
    const b: Actor = a === "capi" ? "hank" : "capi";
    shots.push({ from: h0, to: h0 + HOOK_CUT, cam: closeOnActor(a), hook: "a", subjects: [a] });
    shots.push({ from: h0 + HOOK_CUT, to: h0 + HOOK_CUT + HOOK_INSERT, cam: closeOnActor(b), hook: "b", subjects: [b] });
    cur = { from: h0 + HOOK_CUT + HOOK_INSERT, to: -1, cam: TWO, subjects: [a] };
  } else {
    cur = { from: h0, to: -1, cam: TWO, subjects: subjectOf(s0) };
  }
  for (const s of steps) {
    if (s.from <= cur.from || s.from < h0) continue;
    const subj = subjectOf(s);
    if (eqSubj(cur.subjects, subj)) continue;
    const early = s.from - cur.from < CAM_MIN;
    if (early && within(cur.subjects, subj)) continue; // quem fala já está no plano aberto
    if (!early) {
      cur.to = s.from;
      shots.push(cur);
      cur = { from: s.from, to: -1, cam: TWO, subjects: subj };
    } else if (cur.subjects !== "wide" && subj !== "wide") {
      // corte cedo demais: abre o plano atual para caber os dois (sem cortar)
      cur.subjects = [...cur.subjects, ...subj.filter((x) => !(cur.subjects as Actor[]).includes(x))];
    } else {
      cur.subjects = "wide";
    }
  }
  cur.to = total;
  shots.push(cur);
  shots.forEach((sh) => { if (!sh.hook) sh.cam = camOf(sh.subjects); });

  // plano longo (> 3 s): reenquadra (punch-in de 15% ou volta) em limites de beat, entre 1,5 e 3 s
  const bounds = steps.flatMap((s) => [s.from, s.shadowFrom]).filter((f) => f > 0);
  const out: Shot[] = [];
  shots.forEach((sh) => {
    if (sh.hook || sh.to - sh.from <= CAM_MAX + 9) { out.push(sh); return; }
    let pos = sh.from, alt = false;
    while (sh.to - pos > CAM_MAX + 9) {
      const cands = bounds.filter((f) => f >= pos + CAM_MIN && f <= pos + CAM_MAX && sh.to - f >= CAM_MIN);
      const cut = cands.length ? cands.reduce((a, b) => (Math.abs(b - pos - 70) < Math.abs(a - pos - 70) ? b : a)) : Math.min(pos + 72, sh.to - CAM_MIN);
      out.push({ ...sh, from: pos, to: cut, cam: alt ? altCam(sh) : sh.cam });
      pos = cut;
      alt = !alt;
    }
    out.push({ ...sh, from: pos, to: sh.to, cam: alt ? altCam(sh) : sh.cam });
  });
  return out;
};
const punch = (c: Cam): Cam => clampCam({ cx: c.cx, cy: c.cy - 20, z: c.z * 1.15 });
export const shotAt = (shots: Shot[], frame: number) => shots.find((s) => frame >= s.from && frame < s.to) ?? shots[shots.length - 1];

// ---- trilha: −22 dB sob a voz, respiro −18, ZERO na pergunta, no shadowing e em todo beat da frase-alvo ----
export const CAFE_MUSIC = { speech: -22, gap: -18, zero: -70, fade: 5 };
export const cafeMusicEnvelope = (steps: CafeStep[], total: number, voiceLufs = DEFAULT_VOICE_LUFS): Float32Array => {
  const target = new Float32Array(total).fill(CAFE_MUSIC.gap);
  const set = (a: number, b: number, db: number, onlyIfLower = true) => {
    for (let f = Math.max(0, a); f < Math.min(total, b); f++) target[f] = onlyIfLower ? Math.min(target[f], db) : db;
  };
  steps.forEach((s) => {
    const b = s.beat;
    if (isLine(b) && s.audioFrames) set(s.from - MUSIC.lookahead, s.from + s.audioFrames, CAFE_MUSIC.speech);
    if (isPergunta(b)) set(s.from - CAFE_MUSIC.fade, s.from + s.dur, CAFE_MUSIC.zero);
    if (isLine(b) && b.alvo) set(s.from - CAFE_MUSIC.fade, s.from + s.dur, CAFE_MUSIC.zero);
    if (s.shadowFrom >= 0) set(s.shadowFrom - CAFE_MUSIC.fade, s.shadowFrom + s.shadowFrames, CAFE_MUSIC.zero);
  });
  const out = new Float32Array(total);
  let db = target[0];
  for (let f = 0; f < total; f++) {
    const t = target[f];
    db += (t - db) / (t < db ? (t <= CAFE_MUSIC.zero ? 2 : MUSIC.attack) : MUSIC.release);
    const fade = Math.min(1, (total - 1 - f) / MUSIC.fadeOut, (f + 1) / 6);
    out[f] = db <= CAFE_MUSIC.zero + 3 ? 0 : Math.pow(10, (voiceLufs + db - MUSIC.fileLufs) / 20) * Math.max(0, fade);
  }
  return out;
};

// ---- faixa ESQUETE (beats `de`..`ate`, inclusive) + card final ----
export const CAFE_CTA = 2.0;
export const CAFE_ESQUETE_LEAD = 4;
export const cafeEsqueteWindow = (p: CafeProps, id: string, fps: number) => {
  const e = (p.esquetes ?? []).find((x) => x.id === id);
  if (!e) throw new Error(`${p.id ?? "episódio"}: esquete "${id}" não existe (campo \`esquetes\`)`);
  const steps = buildCafeSchedule(p, fps);
  if (!(e.de >= 0 && e.ate < steps.length && e.ate >= e.de)) throw new Error(`esquete ${id}: de/ate fora dos beats (${e.de}..${e.ate}, ${steps.length} beats)`);
  const from = e.de === 0 ? 0 : Math.max(0, steps[e.de].from - CAFE_ESQUETE_LEAD);
  const to = steps[e.ate].from + steps[e.ate].dur;
  const cta = Math.round(CAFE_CTA * fps);
  return { esquete: e, steps, from, to, cut: to - from, cta, total: to - from + cta };
};
export const cafeEsqueteFrames = (p: CafeProps & { esquete: string }, fps: number) =>
  !p.timings?.length || !p.esquetes?.length ? 1 : cafeEsqueteWindow(p, p.esquete, fps).total;
