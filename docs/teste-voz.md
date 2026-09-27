# Teste cego de voz — como rodar (script pronto, NÃO rodado)

Regras fixas (definidas antes de ouvir, estudo `pesquisas/formato-novo/voz-audio-didatico.md` §4):
- **A · Pronúncia dos alvos:** 100% certo, e WER ≤ 5%. Reprova se errar um.
- **B · Naturalidade:** MOS ≥ 4,0, com ≥ 8 brasileiros adultos do público. Se houver um nativo, ele avalia as falas 2 a 5.
- **C · Obediência:** a pausa pedida fica em ±150 ms e a velocidade em ±10%. É obrigatório para o Lazy.
- **D · Consistência:** similaridade de falante ≥ 0,80 na fala 2, gerada 5 vezes.
- **Decisão por personagem:** o motor precisa passar em A e D. Entre os que passam, vence o maior MOS. Se a diferença de MOS for < 0,3, vence o mais barato.
- **Kokoro:** é a âncora. Se um motor perder para ele, o teste está errado.

Credenciais: "Credencial de API" do ambiente Default, sem chave no código.

| Serviço | Header | Site |
|---|---|---|
| Gemini | `x-goog-api-key` | `generativelanguage.googleapis.com` |
| Azure | `Ocp-Apim-Subscription-Key` | `eastus.tts.speech.microsoft.com` |

Região recomendada: **eastus**.

Passos (em `canal-idiomas/`):
1. `.venv/bin/python scripts/teste_voz.py --dry-run` mostra o que seria enviado.
2. `... --listar-modelos` confere o ID do Gemini TTS. Se não for `gemini-3.8-flash-tts`, rode com `--modelo-gemini <id>`.
3. `... --listar-vozes` confere as vozes Azure na região.
4. `... --motores gemini azure kokoro` gera `teste-voz/brutos/` e `teste-voz/medidas.csv`, com duração, palavras/min e pausas medidas (métrica C).
5. `... --embaralhar` monta `teste-voz/cego/` (nomes aleatórios) e `notas.csv` (formulário). O `gabarito.json` fica só com a gente.
6. Escuta cega (PC/Felipe) e aplicação da regra de decisão acima. O resultado vai para `canal-idiomas/decisoes.md`.

O que o script NÃO mede sozinho:
- **WER com Whisper** e **similaridade ECAPA:** dependem de instalar modelos grandes. Fazer só se A e D ficarem em dúvida na escuta.
- **Fala 1 no Kokoro:** sai só com a voz em português, porque ele não mistura idiomas na mesma fala. Isso é uma limitação conhecida da âncora.

Custo: ~450 caracteres por motor, ou seja, centavos no Gemini e grátis no Azure F0. O ElevenLabs Starter (US$6) só entra se o Felipe quiser comparar a Capy.
