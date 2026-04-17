# DNS Runbook

Dominio alvo desta rodada:

- `catalogocruzeirodosul.com.br`
- `www.catalogocruzeirodosul.com.br`

Status verificado localmente em `2026-04-17`:

- raiz: `NXDOMAIN`
- `www`: `NXDOMAIN`
- HTTPS na raiz: host desconhecido
- HTTPS no `www`: host desconhecido

Isso significa que o problema atual esta no DNS publico, antes mesmo do HTML ou do servidor.

## Agente responsavel

- `Dora DNS`
- responde somente ao `Codex CEO`
- foco: `Cloudflare`, `Render`, `SSL`, `hostname`, `apontamento`

## O que precisa existir

No `Render`:

1. o servico web precisa estar de pe
2. em `Settings > Custom Domains`, adicionar:
   - `catalogocruzeirodosul.com.br`
   - `www.catalogocruzeirodosul.com.br`
3. copiar exatamente os registros que o Render pedir

No `Cloudflare`:

1. o dominio precisa estar na zona certa
2. o registrador precisa usar os nameservers do Cloudflare
3. criar os registros pedidos pelo Render

Layout esperado na pratica:

- `www` como `CNAME` para o hostname do Render
- raiz como `A`, `ALIAS` ou `ANAME`, conforme o Render informar para esse servico

## Variavel obrigatoria

Quando o dominio estiver respondendo:

- ajustar `SITE_URL=https://catalogocruzeirodosul.com.br` no Render
- fazer novo deploy

Sem isso, canonical, Open Graph, sitemap e links absolutos podem continuar errados.

## Checagem local

Rodar:

```bash
npm run dns:check
```

Se voce ja souber o hostname publico do Render, rode:

```bash
node scripts/check-dns-readiness.js --domain catalogocruzeirodosul.com.br --render-host SEU-SERVICO.onrender.com
```

## Sinal verde para ir ao ar

- raiz responde DNS
- `www` responde DNS
- `https://catalogocruzeirodosul.com.br` abre
- `https://www.catalogocruzeirodosul.com.br` abre ou redireciona limpo
- `https://catalogocruzeirodosul.com.br/sitemap.xml` abre
- `https://catalogocruzeirodosul.com.br/robots.txt` abre
- Render mostra certificado emitido para raiz e `www`
