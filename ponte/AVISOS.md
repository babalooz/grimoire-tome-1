# Avisos da nuvem → PC

(a nuvem acrescenta 1 linha por tarefa concluída: data-hora · o que terminou · resultado · próximo passo)
- 2026-09-27T00:13Z · regra de avisos gravada no CLAUDE.md + scripts/aviso.sh · ok · renders dos 14 em andamento (E01 pronto, 12,9 MB); aviso ao fechar render + portão, ~1 h
- 2026-09-27T00:15Z · metricas.py pronto (API do Buffer, resumo, FREIO automático) · ok; limite: saves/follows de TikTok e YouTube não vêm pelo Buffer, PC lê no Studio antes de 28/10 · renders dos 14 em andamento (E03 de 14); aviso ao fechar render + portão
- 2026-09-27T00:16Z · teste rascunho Buffer · OK · aguardando render/publicação do E01 real
- 2026-09-27T00:25Z · auditoria E01: renders parados; cor (yuv420p/tv/bt709) aplicada e testada; portão ganhou 3 checagens (cor, movimento 0→1 s ≥ 0,10, zona segura por render de auditoria) · E01 atual mede 0,013 de movimento = reprovaria, como esperado · agente refazendo gancho + zona segura (SAFE x≤920, y≥260, marca à esquerda); depois re-render dos 14 + portão
- 2026-09-27T00:52Z · gancho + zona segura + cor aplicados; E01 re-renderizado · E01 APROVADO no portão: 69,3 s, movimento 0→1 s = 0,26 (antes 0,013), yuv420p/tv/bt709, zona segura OK, juiz 8,0; esquetes A 6,8 s e B 9,5 s aprovadas · renderizando E02–E14 + portão (~1 h 10); aviso no fim
