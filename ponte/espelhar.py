"""Espelha os arquivos vivos da nuvem para o cofre Obsidian do CapyFala.

Copia (só leitura) de origin/main e origin/ponte para C:/Users/felip/CapyFala_Vault/Espelho/.
Silencioso; roda pela vigia quando main ou ponte mudam. Não edite nada em Espelho/.
"""
import subprocess
from pathlib import Path

W = Path(__file__).resolve().parent.parent
DEST = Path(r"C:\Users\felip\CapyFala_Vault\Espelho")

MAIN = {
    "CLAUDE.md": "CLAUDE-nuvem.md",
    "docs/plano-de-acao.md": "plano-de-acao.md",
    "docs/tiktok-nativo.md": "tiktok-nativo.md",
    "docs/motor-formato-passivo.md": "motor-formato-passivo.md",
    "docs/tarefas-navegador.md": "tarefas-navegador.md",
    "canal-idiomas/episodes/T1-roteiro.md": "T1-roteiro.md",
}
PONTE = {
    "ponte/AVISOS.md": "AVISOS.md",
    "ponte/PEDIDOS.md": "PEDIDOS.md",
    "ponte/RESPOSTAS.md": "RESPOSTAS.md",
    "ponte/AUDITORIA.md": "AUDITORIA.md",
}


def show(ref: str) -> bytes | None:
    r = subprocess.run(["git", "-C", str(W), "show", ref], capture_output=True)
    return r.stdout if r.returncode == 0 else None


def ls(ref: str, path: str) -> list[str]:
    out = subprocess.run(["git", "-C", str(W), "ls-tree", "-r", "--name-only", ref, path],
                         capture_output=True, text=True).stdout
    return [p for p in out.split() if p.endswith(".md")]


def put(dest: Path, data: bytes | None):
    if data is None:
        return
    dest.parent.mkdir(parents=True, exist_ok=True)
    if not dest.exists() or dest.read_bytes() != data:
        dest.write_bytes(data)


def main():
    for src, name in MAIN.items():
        put(DEST / name, show(f"origin/main:{src}"))
    for src, name in PONTE.items():
        put(DEST / name, show(f"origin/ponte:{src}"))
    for p in ls("origin/ponte", "ponte/saida"):
        put(DEST / "pesquisas" / Path(p).name, show(f"origin/ponte:{p}"))
    for p in ls("origin/main", "docs/pesquisas"):
        put(DEST / "pesquisas" / Path(p).name, show(f"origin/main:{p}"))
    radar = sorted(p for p in ls("origin/main", "canal-idiomas/radar") if "vidiq" not in p)
    for p in radar[-8:]:
        put(DEST / "radar" / Path(p).name, show(f"origin/main:{p}"))


if __name__ == "__main__":
    main()
