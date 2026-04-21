# Current State

Updated: 2026-04-21T15:35:18.882Z

## Active Goal

- Solução objetiva para persistência da SPO no Render

## Summary

Além da escrita atômica/fila já publicada, o projeto agora tem endpoint admin /api/admin/storage-health que valida DATA_DIR, caminho persistente esperado no Render, leitura do arquivo acre-2026-poll.json e escrita de prova. Também existe npm run deploy:storage-check para consultar o deploy com ADMIN_TOKEN.

## Next

- Após subir este novo ajuste
- rodar npm run deploy:storage-check -- --url https://catalogo-cruzeiro-web.onrender.com --token <ADMIN_TOKEN>. Se render-persistent-path falhar
- configurar o disk manualmente no Dashboard ou migrar o serviço para Blueprint.

## Files In Focus

- server.js
- scripts/check-render-storage.js
- package.json
