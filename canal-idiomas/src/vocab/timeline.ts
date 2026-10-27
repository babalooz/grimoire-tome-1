// Série de VOCABULÁRIO (decisão do Felipe, 27/10/2026): "estilo app, mas em vídeo", passivo, 61–75 s, 5–10 palavras,
// 1 tema por vídeo. Cada tema novo = 1 JSON em vocab/<tema>.json (palavras, objeto, quantidade, quem fala).
// Esta agenda é a fonte da verdade do tempo: a composição (src/Vocab.tsx), o script de quadros/roteiro
// (scripts/vocab-frames.ts) e o portão (scripts/portao.py, via o roteiro que o vocab-frames exporta).
// Sem imports de React/fontes: também roda no node.
//
// Estrutura (docs em ponte/saida/serie-vocabulario.md §a):
//   gancho (Capy em PT, movimento no 1º segundo) →
//   por bloco (1-3, 4-6, 7-10): por palavra = objetos aparecem com a quantidade → Capy diz (adesivo cola no
//     mesmo quadro da fala) → SUA VEZ (pausa) → 2 ecos de outros personagens (+ dica de pronúncia nas armadilhas)
//     → mini-revisão do bloco (Bolinha devolve as palavras) →
//   desafio (objeto sem a palavra, "qual é?", pausa, resposta) → revisão final das 10 em ritmo crescente → fecho.

export type VocabActor = "capi" | "hank" | "lazy" | "duda" | "bolinha";
export type VocabArmadilha = { id: string; marca: string; dica: string; voz?: boolean; enfase?: string };
export type VocabPalavra = {
  en: string; pt: string; digito: string; objeto: string; qtd: number; contagem?: number; armadilha?: VocabArmadilha;
};
export type VocabFala = { speaker: VocabActor; text: string };
export type VocabClip = { audio: string; duration: number; onset: number; fala: number; text: string };
export type VocabTrilha = { src: string; lufs: number; loop_s: number } | null;
export type VocabProps = {
  id?: string;
  format?: string;
  serie?: { codigo: string; titulo?: string };
  hookTitle?: string;
  palavras: VocabPalavra[];
  blocos: { palavras: number[]; ecos: VocabActor[] }[];
  apresenta: VocabActor;
  dicas: VocabActor;
  revisao: VocabActor;
  desafio?: { itens: number[]; vozes: VocabActor[] };
  final: VocabActor;
  falarFinal?: boolean; // false = a revisão final abre só com a faixa na tela (a fala falas.final fica no cache, sem tocar)
  falas: Partial<Record<"gancho" | "desafio" | "final" | "fecho", VocabFala>>;
  card?: { titulo: string; sub?: string };
  trilha?: VocabTrilha;
  clips: Record<string, VocabClip>;
  voiceLufs?: number;
};

export type Papel = "gancho" | "apresenta" | "eco" | "dica" | "revisao" | "desafio" | "resposta" | "final" | "fecho";
export type VocabStep = {
  i: number;
  tipo: "fala" | "objetos" | "suavez" | "pergunta" | "pausa";
  from: number;
  dur: number;
  palavra?: number; // índice em `palavras`
  bloco?: number;
  papel?: Papel;
  speaker?: VocabActor;
  lang?: "en" | "pt";
  text?: string;
  clip?: VocabClip;
  onsetF?: number; // fala: frame (relativo) em que a voz começa = quadro em que o adesivo cola
  speechF?: number; // fala: frames de voz
  instant?: boolean; // objetos: troca seca (revisão/final) em vez de entrar um por um
};

// ---- ritmo (voz-audio-didatico.md regras 1–3; plano-formato-cafe.md §0.1) ----
export const R = {
  leadBase: 0.2, leadPorItem: 0.03, leadMax: 0.4, // objetos entram ANTES da palavra (a quantidade aparece primeiro)
  aposApresenta: 0.1,
  suaVezExtra: 1.0, suaVezMin: 1.5, suaVezMax: 2.2, // pausa de repetir = fala + 1,0 s (mín. 1,5 s)
  aposSuaVez: 0.1,
  entreEcos: 0.18,
  aposPalavra: 0.2,
  aposDica: 0.25,
  revisaoLead: 0.3, revisaoGap: 0.15, aposRevisao: 0.35,
  desafioPausa: 1.7, aposResposta: 0.35,
  finalGap: [0.3, 0.03] as [number, number], // ritmo crescente: o respiro entre as palavras encolhe
  aposGancho: 0.2,
  fechoHold: 0.7,
};
export const ENTER = 10; // frames de entrada/saída de personagem

export const clipKey = (speaker: string, lang: string, item: string) => `${speaker}|${lang}|${item}`;

export const buildVocabSchedule = (p: VocabProps, fps: number): VocabStep[] => {
  const steps: VocabStep[] = [];
  let t = 0;
  const F = (s: number) => Math.round(s * fps);
  const push = (s: Omit<VocabStep, "i" | "from">) => {
    steps.push({ ...s, i: steps.length, from: t });
    t += s.dur;
  };
  const clip = (speaker: string, lang: string, item: string) => {
    const c = p.clips?.[clipKey(speaker, lang, item)];
    if (!c) throw new Error(`${p.id ?? "vocab"}: falta o áudio ${clipKey(speaker, lang, item)} (rode scripts/tts_vocab.py)`);
    return c;
  };
  const fala = (speaker: VocabActor, lang: "en" | "pt", item: string, papel: Papel, extra: Partial<VocabStep> = {}, gap = 0) => {
    const c = clip(speaker, lang, item);
    // a folga de silêncio do fim do corte entra no respiro: o passo dura até o fim da voz + 2 quadros + gap
    const dur = Math.ceil((c.onset + c.fala) * fps) + 2 + F(gap);
    push({ tipo: "fala", dur, speaker, lang, text: c.text, clip: c, onsetF: Math.round(c.onset * fps), speechF: Math.ceil(c.fala * fps), papel, ...extra });
  };
  const w = (k: number) => `w${k}`;

  const g = p.falas.gancho;
  if (g) fala(g.speaker, "pt", "gancho", "gancho", {}, R.aposGancho);

  p.blocos.forEach((b, bi) => {
    b.palavras.forEach((k) => {
      const pal = p.palavras[k];
      const n = pal.contagem ?? pal.qtd;
      push({ tipo: "objetos", dur: F(Math.min(R.leadMax, R.leadBase + R.leadPorItem * n)), palavra: k, bloco: bi });
      fala(p.apresenta, "en", w(k), "apresenta", { palavra: k, bloco: bi }, R.aposApresenta);
      const c = clip(p.apresenta, "en", w(k));
      push({ tipo: "suavez", dur: F(Math.min(R.suaVezMax, Math.max(R.suaVezMin, c.fala + R.suaVezExtra))), palavra: k, bloco: bi });
      t += F(R.aposSuaVez);
      b.ecos.forEach((sp, j) => fala(sp, "en", w(k), "eco", { palavra: k, bloco: bi }, j < b.ecos.length - 1 ? R.entreEcos : R.aposPalavra));
      if (pal.armadilha?.voz) fala(p.dicas, "pt", pal.armadilha.id, "dica", { palavra: k, bloco: bi }, R.aposDica);
    });
    t += F(R.revisaoLead);
    b.palavras.forEach((k, j) => fala(p.revisao, "en", w(k), "revisao", { palavra: k, bloco: bi }, j < b.palavras.length - 1 ? R.revisaoGap : R.aposRevisao));
  });

  if (p.desafio?.itens.length) {
    const d = p.falas.desafio;
    if (d) fala(d.speaker, "pt", "desafio", "desafio", {}, 0.1);
    p.desafio.itens.forEach((k, j) => {
      push({ tipo: "objetos", dur: F(0.35), palavra: k, papel: "desafio" });
      push({ tipo: "pergunta", dur: F(R.desafioPausa), palavra: k });
      fala(p.desafio!.vozes[j % p.desafio!.vozes.length], "en", w(k), "resposta", { palavra: k }, R.aposResposta);
    });
  }

  const fin = p.falarFinal === false ? undefined : p.falas.final;
  if (fin) fala(fin.speaker, "pt", "final", "final", {}, 0.1);
  const ordem = p.blocos.flatMap((b) => b.palavras);
  ordem.forEach((k, j) => {
    const a = ordem.length > 1 ? j / (ordem.length - 2 || 1) : 1;
    const gap = j === ordem.length - 1 ? 0.35 : R.finalGap[0] + (R.finalGap[1] - R.finalGap[0]) * Math.min(1, a);
    fala(p.final, "en", w(k), "final", { palavra: k }, gap);
  });

  const fe = p.falas.fecho;
  if (fe) fala(fe.speaker, "pt", "fecho", "fecho", {}, R.fechoHold);
  return steps;
};

export const vocabTotal = (s: VocabStep[]) => (s.length ? s[s.length - 1].from + s[s.length - 1].dur : 1);
export const vocabFrames = (p: VocabProps, fps: number) => (!p.clips || !Object.keys(p.clips).length ? 1 : vocabTotal(buildVocabSchedule(p, fps)));
export const stepAt = (steps: VocabStep[], f: number) => steps.find((s) => f >= s.from && f < s.from + s.dur) ?? steps[steps.length - 1];
export const isFala = (s: VocabStep) => s.tipo === "fala";
// quadro absoluto em que a voz de uma fala começa (= adesivo cola / acende)
export const voiceStart = (s: VocabStep) => s.from + (s.onsetF ?? 0);

// ---- estado visual por quadro ----
export type Mostra = { palavra: number; from: number; instant: boolean; revelado: number; oculto: boolean };
// O que está no balcão: a última palavra mostrada (entrada dos objetos) e o quadro em que o adesivo colou.
// oculto = desafio antes da resposta (adesivo mostra "?").
export const mostraAt = (steps: VocabStep[], f: number): Mostra | null => {
  let m: Mostra | null = null;
  for (const s of steps) {
    if (s.from > f + 2) break;
    if (s.palavra === undefined) continue;
    if (s.tipo === "objetos") {
      m = { palavra: s.palavra, from: s.from, instant: false, revelado: Infinity, oculto: s.papel === "desafio" };
    } else if (s.tipo === "fala" && (s.lang === "en")) {
      const v = voiceStart(s);
      if (v > f + 2) break; // troca seca 2 quadros antes da voz (revisão/final), nunca depois
      if (!m || m.palavra !== s.palavra) m = { palavra: s.palavra, from: v - 2, instant: true, revelado: v, oculto: false };
      else if (m.revelado === Infinity || m.oculto) m = { palavra: m.palavra, from: m.from, instant: m.instant, revelado: v, oculto: false };
    }
  }
  return m;
};
// Palavras já apresentadas pela Capy até o quadro f (progresso real do selo).
export const aprendidas = (steps: VocabStep[], f: number) =>
  new Set(steps.filter((s) => s.papel === "apresenta" && voiceStart(s) <= f).map((s) => s.palavra!)).size;
// Fala tocando agora (voz de fato, não a folga depois).
export const falaAt = (steps: VocabStep[], f: number) =>
  steps.find((s) => s.tipo === "fala" && f >= voiceStart(s) && f < voiceStart(s) + (s.speechF ?? 0)) ?? null;

// Convidado da frente à direita (Lazy/Duda): fica do 1º eco do bloco até o próximo convidado entrar.
export const GUESTS: VocabActor[] = ["lazy", "duda"];
export type Presenca = { who: VocabActor; in: number; out: number };
export const convidados = (steps: VocabStep[], total: number): Presenca[] => {
  const out: Presenca[] = [];
  steps.forEach((s) => {
    if (s.tipo !== "fala" || !s.speaker || !GUESTS.includes(s.speaker)) return;
    const last = out[out.length - 1];
    if (last && last.who === s.speaker) return;
    if (last) last.out = s.from - 2;
    out.push({ who: s.speaker, in: s.from - ENTER - 4, out: total + 999 });
  });
  return out;
};
export const presencaK = (pr: { in: number; out: number }, f: number) => {
  const k = Math.min(1, Math.max(0, (f - pr.in) / ENTER), Math.max(0, (pr.out - f) / ENTER));
  return k * k * (3 - 2 * k);
};
// O Bolinha entra na 1ª revisão e fica.
export const bolinhaIn = (steps: VocabStep[]) => {
  const s = steps.find((x) => x.tipo === "fala" && x.speaker === "bolinha");
  return s ? s.from - ENTER - 6 : Infinity;
};

// ---- trilha: −22 dB sob a voz, −18 nos respiros, ZERO na pausa de repetir e no desafio ----
export const VOCAB_MUSIC = { speech: -22, gap: -18, zero: -70, attack: 3, release: 10, lookahead: 3, fadeOut: 30, fade: 4 };
export const vocabMusicEnvelope = (steps: VocabStep[], total: number, trilha: VocabTrilha | undefined, voiceLufs = -22): Float32Array => {
  const out = new Float32Array(total);
  if (!trilha) return out;
  const M = VOCAB_MUSIC;
  const target = new Float32Array(total).fill(M.gap);
  const set = (a: number, b: number, db: number) => {
    for (let f = Math.max(0, a); f < Math.min(total, b); f++) target[f] = Math.min(target[f], db);
  };
  steps.forEach((s) => {
    if (s.tipo === "fala") set(voiceStart(s) - M.lookahead, voiceStart(s) + (s.speechF ?? 0), M.speech);
    if (s.tipo === "suavez" || s.tipo === "pergunta") set(s.from - M.fade, s.from + s.dur, M.zero);
  });
  let db = target[0];
  for (let f = 0; f < total; f++) {
    const tg = target[f];
    db += (tg - db) / (tg < db ? (tg <= M.zero ? 2 : M.attack) : M.release);
    const fade = Math.min(1, (total - 1 - f) / M.fadeOut, (f + 1) / 6);
    out[f] = db <= M.zero + 3 ? 0 : Math.pow(10, (voiceLufs + db - trilha.lufs) / 20) * Math.max(0, fade);
  }
  return out;
};

// ---- roteiro linear (para o portão e para o juiz) ----
export type LinhaRoteiro = { t: number; tipo: VocabStep["tipo"]; papel?: Papel; speaker?: string; lang?: string; text?: string; palavra?: string; dur: number };
export const roteiroLinear = (p: VocabProps, steps: VocabStep[], fps: number): LinhaRoteiro[] =>
  steps.map((s) => ({
    t: +(s.from / fps).toFixed(2), tipo: s.tipo, papel: s.papel, speaker: s.speaker, lang: s.lang, text: s.text,
    palavra: s.palavra !== undefined ? p.palavras[s.palavra].en : undefined, dur: +(s.dur / fps).toFixed(2),
  }));
