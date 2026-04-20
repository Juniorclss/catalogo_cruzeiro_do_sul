# Current State

Updated: 2026-04-20T05:57:43.194Z

## Active Goal

- PubPaid deposito manual corrigido

## Summary

Ao avisar pagamento, PubPaid exige nome do depositante, envia depositorName para /api/pubpaid/deposits, esconde QR e mostra aviso de conferencia ate 3h; dashboard admin mostra coluna Depositante e servidor inclui depositorName no payload/CSV.

## Next

- Deployar e testar fluxo real: gerar QR
- preencher nome
- avisar pagamento
- abrir dashboard e aprovar deposito.
