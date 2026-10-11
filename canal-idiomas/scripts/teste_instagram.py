"""Teste SIMULADO (sem rede, sem publicar nada) do suporte opcional ao Instagram em publicar.py.

Cobre os 2 casos pedidos:
  A) Instagram não aparece no Buffer -> script segue normal (TikTok + YouTube), sem travar.
  B) Instagram aparece no Buffer -> entra sozinho, com legenda própria (diferente de TikTok/YouTube).

Não chama scripts.publicar.gql() nem main(): só troca scripts.publicar.CANAIS por um arquivo json temporário
com canais inventados e exercita canal_id()/status_instagram()/textos()/metadata() direto.

Uso: python3 scripts/teste_instagram.py
"""
import json
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import publicar  # noqa: E402

FALHAS = []


def check(nome: str, ok: bool, detalhe: str = "") -> None:
    print(f"  {'OK  ' if ok else 'FALHOU'} {nome}" + (f" — {detalhe}" if detalhe and not ok else ""))
    if not ok:
        FALHAS.append(nome)


def canais_fake(com_instagram: bool) -> dict:
    canais = [
        {"id": "tiktok-id-123", "name": "acapyfala", "displayName": "acapyfala", "service": "tiktok", "isQueuePaused": False},
        {"id": "youtube-id-456", "name": "CapyFala", "displayName": "CapyFala", "service": "youtube", "isQueuePaused": False},
    ]
    if com_instagram:
        canais.append({"id": "instagram-id-789", "name": "acapyfala", "displayName": "acapyfala",
                        "service": "instagram", "isQueuePaused": False})
    return {"_sobre": "fixture de teste, não é o Buffer real", "atualizado": "teste",
            "organizacoes": [{"id": "org-teste", "nome": "org-teste", "canais": canais}]}


EP = {
    "serie": {"codigo": "T1 E01"},
    "title": "T1 E01 · o primeiro \"oi\" da Capy ☕",
    "canDo": "Consigo cumprimentar alguém e dizer meu nome de um jeito simples.",
    "hashtags": ["#capyfala", "#inglês", "#capybara", "#aprenderingles", "#inglesdozero"],
    "hookTitle": "você já sabe essa. sério.",
    "esquetes": [],
}


def caso_a_sem_instagram(tmp: Path) -> None:
    # Não chama acesso_ok()/listar(): essas duas SEMPRE fazem uma consulta de leitura real ao Buffer (é o que o
    # --listar de verdade faz). Este teste é 100% offline: só grava o fixture em CANAIS e exercita canal_id()/
    # status_instagram()/textos()/metadata() direto, sem rede.
    print("Caso A — Instagram NÃO conectado no Buffer:")
    publicar.CANAIS.write_text(json.dumps(canais_fake(False), ensure_ascii=False))
    check("canal_id('tiktok') resolvido", publicar.canal_id("tiktok") == "tiktok-id-123")
    check("canal_id('youtube') resolvido", publicar.canal_id("youtube") == "youtube-id-456")
    check("canal_id('instagram') é None (não conectado)", publicar.canal_id("instagram") is None)
    status = publicar.status_instagram()
    check("status_instagram() avisa 'ainda não conectado' sem travar", "ainda não conectado" in status, status)
    # metadata()/textos() não devem explodir mesmo sem o canal — a decisão de publicar ou ir pra fila é do
    # publicar_dia() (que olha canal_id), não dessas funções de montagem de texto.
    t = publicar.textos(EP, {"rede": "instagram", "faixa": "episodio", "episodio": "T1 E01"})
    check("textos() não quebra montando legenda de instagram mesmo sem canal", isinstance(t["texto"], str) and t["texto"])


def caso_b_com_instagram(tmp: Path) -> None:
    print("Caso B — Instagram CONECTADO no Buffer:")
    publicar.CANAIS.write_text(json.dumps(canais_fake(True), ensure_ascii=False))
    cid = publicar.canal_id("instagram")
    check("canal_id('instagram') resolvido sem ID fixo no código (vem do fixture)", cid == "instagram-id-789")
    status = publicar.status_instagram()
    check("status_instagram() mostra 'conectado'", status.startswith("conectado"), status)
    check("TikTok/YouTube continuam resolvendo junto", publicar.canal_id("tiktok") and publicar.canal_id("youtube"))

    p_ep = {"rede": "instagram", "faixa": "episodio", "episodio": "T1 E01"}
    p_tt = {"rede": "tiktok", "faixa": "episodio", "episodio": "T1 E01"}
    p_yt = {"rede": "youtube", "faixa": "episodio", "episodio": "T1 E01"}
    t_ig, t_tt, t_yt = publicar.textos(EP, p_ep), publicar.textos(EP, p_tt), publicar.textos(EP, p_yt)
    check("legenda do Instagram é diferente da do TikTok (legenda própria)", t_ig["texto"] != t_tt["texto"])
    check("legenda do Instagram é diferente da do YouTube (legenda própria)", t_ig["texto"] != t_yt["texto"])
    check("legenda do Instagram não tem o prefixo 'cod |' do TikTok", not t_ig["texto"].startswith("T1 E01 |"))
    check("legenda do Instagram contém as hashtags do episódio", "#capyfala" in t_ig["texto"])

    meta = publicar.metadata("instagram", t_ig)
    check("metadata() do Instagram usa type=reel (schema oficial InstagramPostMetadataInput)",
          meta["instagram"]["type"] == "reel")
    check("metadata() do Instagram manda shouldShareToFeed (campo obrigatório no schema)",
          meta["instagram"]["shouldShareToFeed"] is True)

    # esquete também precisa ter legenda própria
    esq = dict(EP, esquetes=[{"id": "A", "gancho": "O gringo te deu bom dia", "cta": "aula completa no EP 01"}])
    p_esq_ig = {"rede": "instagram", "faixa": "esquete", "episodio": "T1 E01", "corte": "A"}
    p_esq_tt = {"rede": "tiktok", "faixa": "esquete", "episodio": "T1 E01", "corte": "A"}
    t_esq_ig, t_esq_tt = publicar.textos(esq, p_esq_ig), publicar.textos(esq, p_esq_tt)
    check("legenda de esquete do Instagram também é própria (diferente do TikTok)", t_esq_ig["texto"] != t_esq_tt["texto"])


def main() -> None:
    original = publicar.CANAIS.read_bytes() if publicar.CANAIS.exists() else None
    tmp = Path(tempfile.mkdtemp(prefix="teste-instagram-"))
    publicar.CANAIS = tmp / "buffer-canais.json"  # nunca toca o arquivo real nem a rede
    try:
        caso_a_sem_instagram(tmp)
        caso_b_com_instagram(tmp)
    finally:
        publicar.CANAIS = publicar.ROOT / "config" / "buffer-canais.json"
        if original is not None:
            publicar.CANAIS.write_bytes(original)
    print()
    if FALHAS:
        print(f"RESULTADO: {len(FALHAS)} falha(s): {', '.join(FALHAS)}")
        sys.exit(1)
    print("RESULTADO: todas as checagens passaram. Nada foi publicado, agendado ou enviado à rede.")


if __name__ == "__main__":
    main()
