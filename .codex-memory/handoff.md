# Handoff

Updated: 2026-04-21T16:36:13.891Z

Rota protegida /api/pesquisa-acre-2026/admin/force-sync adicionada. Ela deduplica/normaliza os votos reais já existentes em acre-2026-poll.json e devolve summary recalculado. Teste local com 2 votos simulados passou: parcial pública retornou total 2.

## Next

- Após deploy
- chamar POST /api/pesquisa-acre-2026/admin/force-sync com x-poll-admin-password e depois consultar /api/pesquisa-acre-2026/summary.

## Files In Focus

- server.js
- .codex-memory/orders.json
