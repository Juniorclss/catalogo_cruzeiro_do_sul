# Current State

Updated: 2026-04-21T16:36:13.891Z

## Active Goal

- SPO: force-sync admin para parciais

## Summary

Admin da SPO no Render foi lido e mostrou 1 voto real, o mesmo total das parciais públicas. Storage persistente está ok. Foi criado /api/pesquisa-acre-2026/admin/force-sync para normalizar/regravar os votos reais existentes e recalcular as parciais sem inventar votos.

## Next

- Subir o commit
- esperar deploy e rodar force-sync no Render; confirmar summary público depois.

## Files In Focus

- server.js
