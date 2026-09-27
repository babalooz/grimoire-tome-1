# Avisos da nuvem → PC

(a nuvem acrescenta 1 linha por tarefa concluída: data-hora · o que terminou · resultado · próximo passo)
- 2026-09-27T00:13Z · regra de avisos gravada no CLAUDE.md + scripts/aviso.sh · ok · renders dos 14 em andamento (E01 pronto, 12,9 MB); aviso ao fechar render + portão, ~1 h
- 2026-09-27T00:15Z · metricas.py pronto (API do Buffer, resumo, FREIO automático) · ok; limite: saves/follows de TikTok e YouTube não vêm pelo Buffer, PC lê no Studio antes de 28/10 · renders dos 14 em andamento (E03 de 14); aviso ao fechar render + portão
- 2026-09-27T00:16Z · teste rascunho Buffer · OK · aguardando render/publicação do E01 real
- 2026-09-27T00:25Z · auditoria E01: renders parados; cor (yuv420p/tv/bt709) aplicada e testada; portão ganhou 3 checagens (cor, movimento 0→1 s ≥ 0,10, zona segura por render de auditoria) · E01 atual mede 0,013 de movimento = reprovaria, como esperado · agente refazendo gancho + zona segura (SAFE x≤920, y≥260, marca à esquerda); depois re-render dos 14 + portão
- 2026-09-27T00:52Z · gancho + zona segura + cor aplicados; E01 re-renderizado · E01 APROVADO no portão: 69,3 s, movimento 0→1 s = 0,26 (antes 0,013), yuv420p/tv/bt709, zona segura OK, juiz 8,0; esquetes A 6,8 s e B 9,5 s aprovadas · renderizando E02–E14 + portão (~1 h 10); aviso no fim
- 2026-09-27T00:55Z · E01 v2 + esquetes A/B no branch midia (antigo substituído) · commit 4089a646a6e6a37ba117c93712276d058fa75aaf: licao-s01e01-hi-hello.mp4 (69,3 s, 10,7 MB), esquete-A (6,8 s), esquete-B (9,5 s); portão: APROVADO os 3 · PC auditar; E02–E14 sobem sozinhos ao passar no portão (commit em cada aviso)
- 2026-09-27T00:57Z · portão T1 E02: 1 vídeo(s) aprovado(s) no branch midia · commit 8f69e0f9be878c78df413890210c6ee86aa8ded4: licao-s01e02-please-thank-you.mp4 · PC auditar (duração, cor, movimento 0–1 s, zona segura)
- 2026-09-27T01:02Z · portão T1 E03: 2 vídeo(s) aprovado(s) no branch midia · commit 0df1ac740076eb3985e68566dc1a6702b4727507: licao-s01e03-im-capy.mp4, licao-s01e03-im-capy-esquete-A.mp4 · PC auditar (duração, cor, movimento 0–1 s, zona segura)
