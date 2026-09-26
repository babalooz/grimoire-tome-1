import { Emotion } from "../chars/common";

// Formato "LIÇÃO EM VÍDEO": CENA (problema no café) → LIÇÃO (exercícios de app) → VOLTA (Capy usa a frase certa).
// O roteiro é uma lista de passos. Passo = fala (1 áudio) ou pausa (timer, microfone, respiro).
// Esta agenda é a fonte da verdade do tempo: a composição, o áudio e o script de stills leem daqui.

export type Speaker = "capi" | "hank" | "lazy" | "narrador";
export type CharId = "capi" | "hank" | "lazy";

export type Line = {
  speaker: Speaker;
  lang: "pt" | "en";
  text: string;
  mode?: "fala" | "pensamento";
  speed?: number; // velocidade do TTS (ex.: 0.7 = devagar). Sem isso vale o padrão do formato (scripts/tts.py LICAO_SPEED)
  emotion?: Emotion;
  react?: Partial<Record<CharId, Emotion>>;
  shot?: "two" | "close";
  sfx?: string[];
  evento?: "som" | "modelo"; // som = botão de áudio aceso (ouvir) · modelo = frase-modelo acesa (repetir)
  pre?: number; // silêncio antes da fala (s): deixa a animação respirar
  hold?: number; // silêncio extra depois (s)
  card?: boolean; // Caderninho da Capy na tela
};
export type Pause = { pausa: "timer" | "mic" | "respiro"; s: number; evento?: "desmaio"; sfx?: string[] };
export type Passo = Line | Pause;

export type Exercicio = {
  tipo: "traducao" | "montar" | "ouvir" | "repetir";
  titulo: string;
  enunciado?: string;
  opcoes?: string[];
  resposta?: number;
  chute?: number; // opção que a Capy escolhe durante o timer (se errada: perde 1 coração, sem XP)
  tiles?: string[];
  ordem?: number[]; // índices de `tiles` na ordem certa
  frase?: string;
  xp?: number;
  passos: Passo[];
};

export type Timings = Record<string, { audio: string; duration: number }>;
export type LicaoProps = {
  id?: string;
  day: number;
  notebook: number;
  hookTitle?: string;
  chunk: { en: string; pt: string; pattern?: string };
  cena: { passos: Passo[] };
  licao: { exercicios: Exercicio[] };
  volta: { passos: Passo[] };
  timings: Timings;
  voiceLufs?: number; // loudness da voz do episódio (scripts/tts.py -> mix.json) — referência do nível da trilha
};

export type Phase = "cena" | "licao" | "volta";
export type Step = {
  i: number;
  phase: Phase;
  ex: number; // índice do exercício (-1 fora da lição)
  passo: Passo;
  from: number; // frame de início do passo
  dur: number;
  start: number; // frame em que o áudio (ou a pausa) começa = from + pre
  audioFrames: number; // duração do áudio (0 em pausa)
  pauseFrames: number; // duração da pausa (0 em fala)
  audio?: string;
};

export const isLine = (p: Passo): p is Line => (p as Line).text !== undefined;

// Mesma chave de scripts/tts.py (line_key).
export const lineKey = (l: Line) =>
  [l.speaker ?? "capi", l.lang, l.mode ?? "fala", l.speed === undefined ? "" : String(l.speed), l.text].join("|");

// Ritmo (feedback do piloto: "MUITO RÁPIDO"). Pausa entre falas 0,3–0,5 s; texto fica ≥ 2x o tempo de leitura.
export const GAP = 0.3;
export const READ_WPS = 4.2; // leitura de frase curta no celular (~250 palavras/min)
export const TRANS = 0.6; // troca de bloco (cena ↔ lição)
const minShow = (text: string) => (2 * text.split(/\s+/).length) / READ_WPS;

export const buildSchedule = (p: LicaoProps, fps: number): Step[] => {
  const steps: Step[] = [];
  let from = 0;
  // A frase-alvo já fica fixa na interface da lição (cartão/opções/blocos): repeti-la em áudio não exige tempo extra de leitura.
  const onScreen = (phase: Phase, l: Line) => phase === "licao" && l.lang === "en" && l.text === p.chunk.en;
  const push = (phase: Phase, ex: number, passo: Passo, extraPre = 0) => {
    const pre = Math.round(((isLine(passo) ? passo.pre ?? 0 : 0) + extraPre) * fps);
    let audioFrames = 0, pauseFrames = 0, audio: string | undefined, body: number;
    if (isLine(passo)) {
      const t = p.timings[lineKey(passo)];
      if (!t) throw new Error(`sem áudio para a fala: ${lineKey(passo)} (rode scripts/tts.py)`);
      audio = t.audio;
      audioFrames = Math.ceil(t.duration * fps);
      body = Math.max(audioFrames + Math.round(GAP * fps), onScreen(phase, passo) ? 0 : Math.ceil(minShow(passo.text) * fps)) + Math.round((passo.hold ?? 0) * fps);
    } else {
      pauseFrames = Math.round(passo.s * fps);
      body = pauseFrames + Math.round((passo.pausa === "respiro" ? 0 : GAP * 0.75) * fps);
    }
    const dur = pre + body;
    steps.push({ i: steps.length, phase, ex, passo, from, dur, start: from + pre, audioFrames, pauseFrames, audio });
    from += dur;
  };
  p.cena.passos.forEach((s) => push("cena", -1, s));
  p.licao.exercicios.forEach((e, ei) => e.passos.forEach((s, si) => push("licao", ei, s, ei === 0 && si === 0 ? TRANS : si === 0 ? 0.25 : 0)));
  p.volta.passos.forEach((s, si) => push("volta", -1, s, si === 0 ? TRANS : 0));
  return steps;
};

export const licaoFrames = (p: LicaoProps, fps: number) => {
  if (!p.timings || !Object.keys(p.timings).length) return 1;
  const s = buildSchedule(p, fps);
  return s.length ? s[s.length - 1].from + s[s.length - 1].dur : 1;
};

// Marcos de cada exercício (frames absolutos).
export type ExMarks = { start: number; end: number; timerFrom: number; timerFrames: number; reveal: number; kind: "timer" | "mic" | "none" };
export const exerciseMarks = (steps: Step[], nEx: number): ExMarks[] =>
  Array.from({ length: nEx }, (_, ei) => {
    const own = steps.filter((s) => s.ex === ei);
    const t = own.find((s) => !isLine(s.passo) && (s.passo as Pause).pausa !== "respiro");
    const start = own[0].from, end = own[own.length - 1].from + own[own.length - 1].dur;
    if (!t) return { start, end, timerFrom: -1, timerFrames: 0, reveal: end, kind: "none" };
    return { start, end, timerFrom: t.start, timerFrames: t.pauseFrames, reveal: t.start + t.pauseFrames, kind: (t.passo as Pause).pausa as "timer" | "mic" };
  });

// Blocos grandes (para transições e stills).
export const phaseBounds = (steps: Step[]) => {
  const b = (ph: Phase) => {
    const own = steps.filter((s) => s.phase === ph);
    return own.length ? { from: own[0].from, to: own[own.length - 1].from + own[own.length - 1].dur } : { from: -1, to: -1 };
  };
  return { cena: b("cena"), licao: b("licao"), volta: b("volta") };
};
