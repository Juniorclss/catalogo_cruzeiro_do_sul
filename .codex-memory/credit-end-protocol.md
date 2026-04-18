# Protocolo de Fim de Credito e Retomada

Este arquivo existe para ser lido sempre que a sessao estiver perto de acabar
ou quando outra sessao assumir o workspace.

## Passos obrigatorios antes de encerrar ou retomar

1. Ler `AGENTS.md`, `CODEX_MEMORY.md`, `.codex-memory/README.md`, `current-state.md`, `handoff.md`, `orders.json` e `assets.json`.
2. Registrar a ordem mais recente do usuario em `orders.json` antes de responder ou agir.
3. Se houver imagem, referencia visual, captura ou anexo novo, registrar a referencia em `assets.json`.
4. Antes de interpretar uma nova referencia visual, conferir nas ordens abertas qual pagina/modulo estava em foco.
5. Quando o credito estiver acabando, atualizar `current-state.md` e `handoff.md` com:
   - o que foi feito de verdade;
   - o que ficou pendente;
   - qual foi a ultima correcao ou feedback do usuario;
   - em qual arquivo/pagina o foco deve continuar.
6. Nao inventar novo alvo para referencia visual. Se a referencia foi enviada numa conversa sobre `PubPaid`, assumir primeiro `PubPaid` ate prova em contrario.

## Lembrete desta correcao

- Em 2026-04-17 houve uma interpretacao errada: uma referencia visual enviada pelo usuario era para `PubPaid` (jogo, mesas e posicoes), nao para o bloco de fundadores.
- Em retomadas futuras, verificar o contexto imediato da ordem antes de aplicar a referencia.
