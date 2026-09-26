# Canal de idiomas — "CapyFala"

Vídeos curtos 9:16 (TikTok / Shorts / Reels) de inglês para brasileiros, com mascote original (Capy, a capivara),
narração automática PT+EN, legenda palavra a palavra e quiz com contagem regressiva. 100% gerado por código.

## Uso
```bash
scripts/setup.sh                                   # uma vez
scripts/make.sh episodes/001-looking-forward.json  # gera out/001-looking-forward.mp4
export ANTHROPIC_API_KEY=...                       # uma vez
scripts/diario.sh                                  # radar -> roteiro -> vídeo do dia
```

## Pipeline (meta: zero trabalho manual)
| Etapa | Status | Como |
|---|---|---|
| 1. Radar de tendências (hype local + dúvidas de inglês) | **pronto** | `scripts/radar.py` — Google Trends RSS + autocomplete/busca YouTube |
| 2. Roteiro do episódio (JSON) | **pronto** (falta chave API) | `scripts/roteirista.py` — Claude gera + 2ª passada professor nativo |
| 3. Narração | **pronto** | Kokoro TTS local (grátis, Apache-2.0): pf_dora (PT) + af_heart (EN), voz feminina |
| 4. Vídeo + legenda + mascote | **pronto** | Remotion (`src/Episode.tsx`) |
| 5. Postagem automática | a fazer | YouTube Data API + TikTok Content Posting API |
| 6. Agendamento diário | a fazer | GitHub Actions (cron) |

## Formato do episódio
Ver `episodes/001-looking-forward.json`: cenas `hook` → `question` (com timer) → `reveal` → `example` → `cta`.

## Regras
- Mascote e cores **originais** — nada que lembre a coruja/verde do Duolingo (marca registrada).
- Todo inglês passa por revisão automática antes de renderizar; pronúncia errada mata a credibilidade.
