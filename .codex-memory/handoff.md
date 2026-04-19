# Handoff

Updated: 2026-04-19T14:55:00.000Z

Retomada obrigatoria: ler `AGENTS.md`, `CODEX_MEMORY.md`, `.codex-memory/current-state.md`, `.codex-memory/orders.json`, `.codex-memory/assets.json` e `.codex-memory/credit-end-protocol.md`.

## Estado

- Site temporario Render: `https://catalogo-cruzeiro-web.onrender.com`.
- Rodada geral de 2026-04-19 validou rotas principais no Render com 200.
- Arquivos alterados nesta rodada: `infantil.html`, `server.js`, `scripts/review-team-audit.js`, `news-data.js`, `.codex-temp/reports/reuniao-geral-escritorios-2026-04-19.md`, memoria local.
- `npm run review:team`: 0 achados.
- `node --check server.js` e `node --check scripts/review-team-audit.js`: ok.
- `npm run audit:news-images`: 30 itens, 23 ok, 7 review, 0 warning/error.

## Pendencias

- Live Render ainda mostra a imagem antiga quebrada do Mundo Bita ate deployar o commit local.
- Ajustar foco manual das 7 noticias em `data/news-image-focus-audit.json`.
- PubPaid ainda precisa ficar mais dinamico: copos/dados com animacao e som, roleta com giro/suspense, sinuca com fisica clara.
- Equipe Ninja recomenda criar kits `sprite-vault/generated/pubpaid/*` e `sprite-vault/generated/offices/agents/*`.

## Referencias de jogos pesquisadas

- Sinuca: `https://github.com/cptleo92/JSBilliards`.
- Roleta: `https://github.com/dozsolti/react-casino-roulette`.
- Damas: `https://github.com/codethejason/checkers`.
- Blackjack: `https://github.com/Oli8/BlackJackJs`.
- Slots: `https://github.com/johakr/html5-slot-machine`.
- Dados: `https://github.com/3d-dice/dice-box`.
