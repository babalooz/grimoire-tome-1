import React, { useMemo } from "react";
import { AbsoluteFill, Audio, Freeze, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Cafe } from "./Cafe";
import { CtaCard } from "./LicaoEsquete";
import { AUDIT_BG, AuditCtx } from "./lesson/audit";
import { DEFAULT_VOICE_LUFS, MUSIC } from "./lesson/music";
import { Sfx } from "./Sitcom";
import { C } from "./theme";
import { CAFE_MUSIC, CafeProps, cafeEsqueteWindow, cafeMusicEnvelope, cafeTotal } from "./cafe/timeline";

export { cafeEsqueteFrames } from "./cafe/timeline";

// Faixa ESQUETE da Sitcom do Café: beats `de`..`ate` (inclusive) do MESMO episódio/áudio, gancho de câmera e texto de
// tela (`gancho`) a partir do 1º quadro, e card final "aula completa no EP 0N" de 2 s. Render: scripts/make-cafe.sh.
export type CafeEsqueteProps = CafeProps & { esquete: string; auditoria?: boolean };

export const CafeEsquete: React.FC<CafeEsqueteProps> = (p) => (
  <AuditCtx.Provider value={!!p.auditoria}><CafeEsqueteInner {...p} /></AuditCtx.Provider>
);

const CafeEsqueteInner: React.FC<CafeEsqueteProps> = (p) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const w = useMemo(() => cafeEsqueteWindow(p, p.esquete, fps), [p, fps]);
  const lufs = p.voiceLufs ?? DEFAULT_VOICE_LUFS;
  // trilha: mesmo envelope do episódio no trecho cortado · card = nível de respiro · fade no fim
  const music = useMemo(() => {
    const epTotal = cafeTotal(w.steps);
    const full = cafeMusicEnvelope(w.steps, epTotal, lufs);
    const gap = Math.pow(10, (lufs + CAFE_MUSIC.gap - MUSIC.fileLufs) / 20);
    const out = new Float32Array(durationInFrames);
    let g = full[Math.min(epTotal - 1, w.from)];
    for (let f = 0; f < durationInFrames; f++) {
      const raw = f < w.cut ? full[Math.min(epTotal - 1, w.from + f)] : gap;
      g += (raw - g) / (f < w.cut ? 1 : 6);
      out[f] = g * Math.max(0, Math.min(1, (durationInFrames - 1 - f) / 20, (f + 1) / 6));
    }
    return out;
  }, [w, durationInFrames, lufs]);
  const cafeProps = { ...p, corteDe: w.from, gancho: w.esquete.gancho };

  return (
    <AbsoluteFill style={{ background: p.auditoria ? AUDIT_BG : C.noite, overflow: "hidden" }}>
      <Sequence durationInFrames={w.cut}>
        <Sequence from={-w.from}><Cafe {...cafeProps} semTrilha /></Sequence>
      </Sequence>
      <Sequence from={w.cut}>
        <Freeze frame={w.to - 1}><Cafe {...cafeProps} semAudio semTrilha /></Freeze>
        <CtaCard text={w.esquete.cta} since={frame - w.cut} fps={fps} serie={p.serie} />
      </Sequence>
      <Sfx at={w.cut + 2} name="stamp" vol={0.45} />
      {Array.from({ length: Math.ceil(durationInFrames / MUSIC.loopFrames) }, (_, k) => (
        <Sequence key={`m${k}`} from={k * MUSIC.loopFrames} durationInFrames={MUSIC.loopFrames}>
          <Audio src={staticFile(MUSIC.src)} volume={(f) => music[Math.min(durationInFrames - 1, k * MUSIC.loopFrames + f)] ?? 0} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
