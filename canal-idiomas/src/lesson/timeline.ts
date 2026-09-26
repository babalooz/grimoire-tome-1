import { Emotion } from "../chars/common";

// Formato "LIÇÃO EM VÍDEO": CENA (problema no café) → LIÇÃO (exercícios de app) → VOLTA (Capy usa a frase certa).
// O roteiro é uma lista de passos. Passo = fala (1 áudio) ou pausa (timer, microfone, respiro).
// Esta agenda é a fonte da verdade do tempo: a composição, o áudio e o script de stills leem daqui.

export type Speaker = "capi" | "hank" | "lazy" | "duda" | "poppy" | "bolinha" | "donajaca" | "narrador";
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
  // som = botão de áudio aceso (ouvir) · modelo = frase-modelo acesa (repetir) · cartao = entra o cartão `alvo` (cartoes)
  // lembra = o item `alvo` da revisão revela o inglês (revisao) · par = reservado (ligar é mudo nesta versão)
  evento?: "som" | "modelo" | "cartao" | "par" | "lembra";
  alvo?: number; // índice do cartão / par / item que esta fala acende
  pre?: number; // silêncio antes da fala (s): deixa a animação respirar
  hold?: number; // silêncio extra depois (s)
  card?: boolean; // Caderninho da Capy na tela
};
export type Pause = { pausa: "timer" | "mic" | "respiro"; s: number; evento?: "desmaio" | "ligar"; sfx?: string[] };
export type Passo = Line | Pause;

export const TIPOS = ["traducao", "montar", "ouvir", "repetir", "cartoes", "ligar", "completar", "revisao"] as const;
export type Tipo = (typeof TIPOS)[number];
export type Cartao = { en: string; pt: string; emoji?: string };
export type Exercicio = {
  tipo: Tipo;
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
  // tipos novos (docs/percurso-do-zero.md, "Schema dos exercícios novos")
  cartoes?: Cartao[]; // cartoes
  repita?: boolean; // cartoes: microfone no cartão durante o hold depois de cada fala
  pares?: { en: string; pt: string }[]; // ligar
  direita?: number[]; // ligar: ordem da coluna PT (permutação de índices de `pares`)
  lacuna?: string; // completar: marcador dentro de `frase` (padrão "___")
  itens?: (Cartao & { de: string })[]; // revisao (de = "T1 E03")
  mascote?: "bolinha"; // revisao
};

// Série (T1 E01 = temporada 1, episódio 1). O selo aparece no topo da zona segura durante todo o episódio.
export type Serie = { temporada: number; capitulo: number; episodio: number; codigo: string; tituloCapitulo: string };

// Faixa ESQUETE (TikTok/Shorts curtos, docs/tiktok-nativo.md §7): corte de 5–20 s do MESMO render do episódio.
// `de`/`ate` = referência estável a um passo: "cena.2" · "volta.0" · "licao.3" (exercício inteiro) · "licao.3.1" (passo 1 do ex. 3).
// O corte vai do começo da fala `de` até o fim do passo `ate` (inclusive); o card final "aula completa no EP N" vem depois.
// `abertura` (opcional, decisão do Felipe): 1–2 falas curtas do HYPE DO DIA (roteirista, no dia da postagem) que tocam
// ANTES do corte, no palco do café. Máx. 4 s. O `gancho` (texto de tela, ≤ 6 palavras) pode vir do mesmo hype.
export type Esquete = { id: "A" | "B" | "C"; de: string; ate: string; gancho: string; cta: string; abertura?: Passo[] };

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
  serie?: Serie;
  cast?: string[];
  esquetes?: Esquete[];
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

// Falha alto em vez de renderizar errado (antes: tipo desconhecido caía em "repetir" em silêncio).
export const validateLicao = (p: LicaoProps) => {
  const where = (ei: number) => `${p.id ?? "episódio"} · licao.exercicios[${ei}]`;
  p.licao.exercicios.forEach((e, ei) => {
    if (!(TIPOS as readonly string[]).includes(e.tipo)) {
      throw new Error(`${where(ei)}: tipo de exercício desconhecido "${e.tipo}". Tipos válidos: ${TIPOS.join(", ")}.`);
    }
    const need = (ok: unknown, what: string) => { if (!ok) throw new Error(`${where(ei)} (${e.tipo}): ${what}`); };
    const lines = e.passos.filter(isLine);
    const timer = e.passos.find((x) => !isLine(x) && x.pausa === "timer");
    if (e.tipo === "traducao" || e.tipo === "ouvir" || e.tipo === "completar") {
      need(e.opcoes?.length && e.resposta !== undefined && e.resposta < e.opcoes.length, "precisa de `opcoes` e `resposta` válida");
    }
    if (e.tipo === "montar") need(e.tiles?.length && e.ordem?.length && e.ordem.every((i) => i < e.tiles!.length), "precisa de `tiles` e `ordem` válida");
    if (e.tipo === "repetir") need(e.frase, "precisa de `frase`");
    if (e.tipo === "cartoes") {
      need(e.cartoes?.length, "precisa de `cartoes`");
      lines.filter((l) => l.evento === "cartao").forEach((l) => need(l.alvo !== undefined && l.alvo < e.cartoes!.length, `fala "${l.text}" com alvo fora de \`cartoes\``));
    }
    if (e.tipo === "ligar") {
      need(e.pares?.length && e.direita?.length === e.pares.length && [...e.direita].sort((x, y) => x - y).every((v, i) => v === i), "precisa de `pares` e `direita` (permutação dos índices)");
      need(timer, "precisa de uma pausa `timer`");
    }
    if (e.tipo === "completar") need(e.frase && e.frase.includes(e.lacuna ?? "___") && timer, "precisa de `frase` com a lacuna e de uma pausa `timer`");
    if (e.tipo === "revisao") {
      need(e.itens?.length, "precisa de `itens`");
      lines.filter((l) => l.evento === "lembra").forEach((l) => need(l.alvo !== undefined && l.alvo < e.itens!.length, `fala "${l.text}" com alvo fora de \`itens\``));
    }
  });
};

export const buildSchedule = (p: LicaoProps, fps: number): Step[] => {
  validateLicao(p);
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

// Frames do voo das linhas do "ligar" (1 linha a cada LIGAR_STAG frames, cada uma leva LIGAR_DRAW para desenhar).
export const LIGAR_STAG = 13.5; // ≈ 0,45 s a 30 fps
export const LIGAR_DRAW = 10;

// ---------- faixa ESQUETE ----------
export const ESQUETE_CTA = 2.0; // s do card final
export const ESQUETE_LEAD = 4; // frames antes do começo da fala `de` (o som não pode nascer cortado)

// "cena.2" / "volta.0" / "licao.3" / "licao.3.1" -> passos (Step) do trecho.
export const resolveRef = (steps: Step[], ref: string): Step[] => {
  const m = /^(cena|volta|licao)\.(\d+)(?:\.(\d+))?$/.exec(ref.trim());
  if (!m) throw new Error(`referência de esquete inválida "${ref}" (use "cena.N", "volta.N", "licao.E" ou "licao.E.P")`);
  const [, ph, a, b] = m;
  let out: Step[];
  if (ph === "licao") {
    const own = steps.filter((s) => s.phase === "licao" && s.ex === Number(a));
    out = b === undefined ? own : own.slice(Number(b), Number(b) + 1);
  } else {
    const own = steps.filter((s) => s.phase === ph);
    if (b !== undefined) throw new Error(`referência "${ref}": ${ph} não tem subníveis`);
    out = own.slice(Number(a), Number(a) + 1);
  }
  if (!out.length) throw new Error(`referência de esquete "${ref}" não existe neste episódio`);
  return out;
};

export const esqueteWindow = (p: LicaoProps, esqueteId: string, fps: number) => {
  const e = (p.esquetes ?? []).find((x) => x.id === esqueteId);
  if (!e) throw new Error(`${p.id ?? "episódio"}: esquete "${esqueteId}" não existe (campo \`esquetes\`)`);
  if (e.gancho.trim().split(/\s+/).length > 6) throw new Error(`esquete ${esqueteId}: gancho com mais de 6 palavras ("${e.gancho}")`);
  const steps = buildSchedule(p, fps);
  const a = resolveRef(steps, e.de)[0];
  const zs = resolveRef(steps, e.ate);
  const z = zs[zs.length - 1];
  const from = Math.max(0, a.from, a.start - ESQUETE_LEAD); // sem sobra da fala anterior no frame 0 (capa)
  const to = z.from + z.dur;
  if (to <= from) throw new Error(`esquete ${esqueteId}: "ate" (${e.ate}) vem antes de "de" (${e.de})`);
  const cta = Math.round(ESQUETE_CTA * fps);
  const abertura = aberturaSteps(p, esqueteId, fps);
  const ab = abertura.length ? abertura[abertura.length - 1].from + abertura[abertura.length - 1].dur : 0;
  const total = ab + to - from + cta;
  const tag = `${p.id ?? "episódio"} · esquete ${esqueteId}`;
  if (ab > ABERTURA_MAX * fps) throw new Error(`${tag}: abertura com ${(ab / fps).toFixed(1)} s (máx. ${ABERTURA_MAX} s)`);
  if (total < ESQUETE_MIN * fps || total > ESQUETE_MAX * fps) {
    throw new Error(`${tag}: ${(total / fps).toFixed(1)} s fora da faixa ${ESQUETE_MIN}–${ESQUETE_MAX} s (de ${e.de} até ${e.ate}, abertura ${(ab / fps).toFixed(1)} s)`);
  }
  return { esquete: e, abertura, ab, from, to, cut: to - from, cta, total };
};

export const ESQUETE_MIN = 5;
export const ESQUETE_MAX = 20;
export const ABERTURA_MAX = 4;

// Agenda da abertura (mesma régua de tempo das falas da cena; `start` relativo ao frame 0 da esquete).
export const aberturaSteps = (p: LicaoProps, esqueteId: string, fps: number): Step[] => {
  const e = (p.esquetes ?? []).find((x) => x.id === esqueteId);
  if (!e?.abertura?.length) return [];
  return buildSchedule({ ...p, cena: { passos: e.abertura }, licao: { exercicios: [] }, volta: { passos: [] } }, fps);
};
export const aberturaFrames = (p: LicaoProps, esqueteId: string, fps: number) => {
  const a = aberturaSteps(p, esqueteId, fps);
  return a.length ? a[a.length - 1].from + a[a.length - 1].dur : 0;
};
