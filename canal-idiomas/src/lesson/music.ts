import { Pause, Step, isLine } from "./timeline";

// Trilha de fundo (public/music/cafe-loop.wav, gerada por scripts/music.py, CC0) com ducking automático.
// Níveis em dB RELATIVOS à loudness da voz do episódio (props.voiceLufs, medida por scripts/tts.py):
//   alguém falando -24 · respiros entre falas -18 (duck de 6 dB) · timer -15 (sobe: sem silêncio morto)
//   microfone "repita em voz alta" -32 (quase some: o espectador precisa falar).
export const MUSIC = {
  src: "music/cafe-loop.wav",
  fileLufs: -16, // loudness do arquivo (scripts/music.py TARGET_LUFS)
  loopFrames: 600, // 20,0 s a 30 fps (8 compassos a 96 BPM)
  speech: -24,
  gap: -18,
  timer: -15,
  mic: -32,
  attack: 3, // frames p/ abaixar (rápido: não mascarar o começo da fala)
  release: 10, // frames p/ voltar
  lookahead: 3, // começa a abaixar antes da fala
  fadeOut: 30,
};
export const DEFAULT_VOICE_LUFS = -22;

// Ganho linear por frame (0..durationInFrames-1).
export const musicEnvelope = (steps: Step[], total: number, voiceLufs = DEFAULT_VOICE_LUFS): Float32Array => {
  const target = new Float32Array(total).fill(MUSIC.gap);
  const set = (a: number, b: number, db: number, onlyIfLower = false) => {
    for (let f = Math.max(0, a); f < Math.min(total, b); f++) target[f] = onlyIfLower ? Math.min(target[f], db) : db;
  };
  steps.forEach((s) => {
    if (isLine(s.passo)) return;
    const k = (s.passo as Pause).pausa;
    if (k === "timer") set(s.start, s.start + s.pauseFrames, MUSIC.timer);
    if (k === "mic") set(s.start - MUSIC.lookahead, s.start + s.pauseFrames + MUSIC.release, MUSIC.mic);
  });
  // fala tem prioridade (exceto sobre o microfone, que já está mais baixo)
  steps.forEach((s) => { if (s.audioFrames) set(s.start - MUSIC.lookahead, s.start + s.audioFrames, MUSIC.speech, true); });

  const out = new Float32Array(total);
  let db = target[0];
  for (let f = 0; f < total; f++) {
    const t = target[f];
    db += (t - db) / (t < db ? MUSIC.attack : MUSIC.release);
    const fade = Math.min(1, (total - 1 - f) / MUSIC.fadeOut, (f + 1) / 6);
    out[f] = Math.pow(10, (voiceLufs + db - MUSIC.fileLufs) / 20) * Math.max(0, fade);
  }
  return out;
};
