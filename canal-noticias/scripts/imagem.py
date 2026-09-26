#!/usr/bin/env python3
"""Gera 1 imagem realista via Cloudflare Workers AI (FLUX.1 schnell, cota grátis de 10k neurons/dia).

Uso: scripts/imagem.py "descrição da cena" saida.jpg
Requer as variáveis de ambiente CF_ACCOUNT_ID e CF_API_TOKEN (token com permissão Workers AI).
"""
import base64, json, os, sys, urllib.request

MODEL = "@cf/black-forest-labs/flux-1-schnell"
# Estilo fixo do canal: foto realista, rosto expressivo, luz de telejornal.
STYLE = ("photorealistic news photo, vertical 9:16, sharp focus, dramatic lighting, "
         "expressive human reaction, no text, no logos, no watermark")


def gerar(prompt: str, saida: str) -> None:
    conta, token = os.environ["CF_ACCOUNT_ID"], os.environ["CF_API_TOKEN"]
    url = f"https://api.cloudflare.com/client/v4/accounts/{conta}/ai/run/{MODEL}"
    corpo = json.dumps({"prompt": f"{prompt}. {STYLE}", "steps": 8}).encode()
    req = urllib.request.Request(url, corpo, {"Authorization": f"Bearer {token}",
                                              "Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=120) as r:
        resp = json.load(r)
    if not resp.get("success"):
        sys.exit(f"Falhou: {resp.get('errors')}")
    with open(saida, "wb") as f:
        f.write(base64.b64decode(resp["result"]["image"]))
    print(saida)


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    gerar(sys.argv[1], sys.argv[2])
