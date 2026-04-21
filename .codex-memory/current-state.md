# Current State

Updated: 2026-04-21T15:50:20.142Z

## Active Goal

- SPO: bloquear formulário para Google já votante

## Summary

A pesquisa agora consulta /api/pesquisa-acre-2026/me quando o Google conecta. Se o usuário já votou na semana, o formulário é escondido e as parciais são carregadas/mostradas. Erro 409 no envio também vira estado de voto concluído, não erro comum.

## Next

- Subir a correção e aguardar deploy; testar entrando com o mesmo Google que já votou e confirmar que aparece apenas o painel de participação concluída + parciais.

## Files In Focus

- server.js
- pesquisa-acre-2026.js
- pesquisa-acre-2026.html
