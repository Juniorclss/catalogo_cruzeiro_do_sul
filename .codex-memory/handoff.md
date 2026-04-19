# Handoff

Updated: 2026-04-19T15:05:00.000Z

Retomada obrigatoria: ler `AGENTS.md`, `CODEX_MEMORY.md`, `.codex-memory/current-state.md`, `.codex-memory/orders.json`, `.codex-memory/assets.json` e `.codex-memory/credit-end-protocol.md`.

## Estado

- Site temporario Render: `https://catalogo-cruzeiro-web.onrender.com`.
- Rodada geral de 2026-04-19 validou rotas principais no Render com 200.
- Arquivos alterados nesta rodada: `infantil.html`, `server.js`, `scripts/review-team-audit.js`, `news-data.js`, `.codex-temp/reports/reuniao-geral-escritorios-2026-04-19.md`, memoria local.
- Commit publicado: `e0a4838` em `origin/main`.
- Render conferido depois do deploy: `/`, `/infantil.html`, `/pubpaid.html`, `/fontes-monitoradas.html`, `/escritorio-ninjas.html` e `/health` responderam 200; `/infantil.html` nao tem mais a referencia quebrada `personagens01.png`.
- `npm run review:team`: 0 achados.
- `node --check server.js` e `node --check scripts/review-team-audit.js`: ok.
- `npm run audit:news-images`: 30 itens, 23 ok, 7 review, 0 warning/error.
- Em andamento/concluido localmente: painel `SPRTIS CHECK & CHANGE` em `sprites-check-change.html`, com menu `CHECKPUBPAID`, senha `99831455`, listagem de 2600 assets vindos de `sprite-vault` e `assets`, e salvamento de revisoes em `data/sprite-check-reviews.json`.
- Chat hierarquico de ordens adicionado aos escritorios por `office-command-chat.js`: senha Full Admin `99831455A`, fluxo `Full Admin -> Codex CEO -> equipes`, APIs `/api/office-orders`.
- Validacoes locais desta etapa: `node --check server.js`, `node --check sprites-check-change.js`, `node --check office-command-chat.js`, `npm run review:team` com 0 achados, `GET /sprites-check-change.html` 200, `GET /api/sprites-check?password=99831455` ok, `POST /api/office-orders` ok.
- Novo `Escritorio de Arte` em `escritorio-arte.html` com `escritorio-arte-config.js`: 50 agentes de Design Art e Programacao de Game Design, trabalhando junto com Ninjas em pixel art, sprites, engine, colisao, fisica, mapas, som, QA, balanceamento e build.
- Validacoes locais do Escritorio de Arte: `node --check escritorio-arte-config.js`, `node --check server.js`, `node --check office-command-chat.js`, `npm run review:team` com 0 achados, `GET /escritorio-arte.html` 200, config 200, sitemap inclui `/escritorio-arte.html`.
- Correcao importante no `SPRTIS CHECK & CHANGE`: a API agora varre apenas `sprite-vault`, nao `assets`; agrupa frames em sprites animados; marca usados no site como aceitos/travados caso aparecam; adiciona contexto de uso e plano de construcao; front abre avaliacao em tela cheia e troca frames por `<img>`, sem canvas.
- Validacoes locais do painel corrigido: `node --check server.js`, `node --check sprites-check-change.js`, `npm run review:team` 0 achados, HTML 200, senha nao aparece no HTML, sem `<canvas>`, 2107 grupos, 190 grupos animados, 1668 mapas/cenarios/construcao, 0 itens de `assets`.

## Pendencias

- Ajustar foco manual das 7 noticias em `data/news-image-focus-audit.json`.
- PubPaid ainda precisa ficar mais dinamico: copos/dados com animacao e som, roleta com giro/suspense, sinuca com fisica clara.
- Equipe Ninja recomenda criar kits `sprite-vault/generated/pubpaid/*` e `sprite-vault/generated/offices/agents/*`.
- Se publicar esta etapa, conferir no Render a URL `https://catalogo-cruzeiro-web.onrender.com/sprites-check-change.html` e os escritorios com botao flutuante `Ordens`.
- Conferir no Render tambem `https://catalogo-cruzeiro-web.onrender.com/escritorio-arte.html`.
- Na proxima retomada, se o usuario reclamar do painel, primeiro verificar se ele esta vendo a versao nova: sem placeholder com senha, cards animando frames e botao `Tela cheia`.

## Referencias de jogos pesquisadas

- Sinuca: `https://github.com/cptleo92/JSBilliards`.
- Roleta: `https://github.com/dozsolti/react-casino-roulette`.
- Damas: `https://github.com/codethejason/checkers`.
- Blackjack: `https://github.com/Oli8/BlackJackJs`.
- Slots: `https://github.com/johakr/html5-slot-machine`.
- Dados: `https://github.com/3d-dice/dice-box`.
