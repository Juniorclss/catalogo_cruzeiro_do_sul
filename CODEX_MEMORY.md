# CODEX Memory

Ultima atualizacao: 2026-04-16 12:33 -05:00 (America/Rio_Branco)

## Preferencia do usuario

- Quando o chat reiniciar, retomar o trabalho sem pedir tudo de novo.
- Manter uma memoria local do que esta em andamento neste projeto.
- Trabalhar sem ficar pedindo permissao para fluxo normal.

## Pedido atual em andamento

Reformular a home com tres focos visuais:

1. trocar o "exercito" por uma equipe de 5 robos ocupando o card, com poses de ataque tipo esquadrao
2. deixar o pop-up inicial com clima mais forte de guerra, com explosoes, bombas e soldados em combate
3. fazer o logo do Cruzeiro girar no proprio eixo, em vez de parecer orbitar em volta

## O que ja foi feito

- [index.html](C:/Users/junio/projeto codex/index.html) agora fixa o rodape em `data-army-count="5"` e atualiza a copy para "Esquadrão editorial em ataque".
- [script.js](C:/Users/junio/projeto codex/script.js) passou a travar o rodape em 5 robos e usar um blueprint fixo de posicoes, escala e pose para desktop e mobile.
- [styles.css](C:/Users/junio/projeto codex/styles.css) recebeu overrides para o esquadrao ocupar mais o card, subir no enquadramento e ganhar poses mais agressivas.
- [startup-experience.js](C:/Users/junio/projeto codex/startup-experience.js) ganhou mais elementos da cena de guerra: bombas extras, flashes, crateras e novos soldados.
- [startup-experience.css](C:/Users/junio/projeto codex/startup-experience.css) foi reforcado para puxar o pop-up para uma leitura mais de batalha: fundo escurecido, explosoes maiores, combate mais visivel e ajuste compacto no mobile.
- O mural pixelado (`startup-chaos-mural.svg`) foi removido do popup porque estava trazendo um personagem e feixes indevidos; o diretor da caneta voltou para a cena via `.catalogo-director-stage`.
- O popup agora tambem tem um letreiro central de "previsao do futuro", com animacao em etapas (`binario > ascii > programacao > noticia`) e os observadores alienigenas voltaram ao markup.
- [styles.css](C:/Users/junio/projeto codex/styles.css) tambem reforca a animacao de `.southern-cross-orbit` para girar no proprio eixo (`rotateZ`) sem ficar parecendo orbita lateral.

## Validacoes ja feitas

Capturas mais recentes em `.codex-temp/visual-verify/`:

- `turn5-popup-desktop.png`
- `turn4-popup-mobile.png`
- `turn8-footer-desktop.png`
- `turn12-footer-desktop-tall.png`
- `turn13-squad-desktop.png`
- `turn14-popup-mobile.png`
- `turn15-popup-desktop.png`
- `turn15-popup-mobile.png`

Leitura atual dessas validacoes:

- popup mobile: melhorou bem, a leitura de guerra ficou clara e mais pesada
- popup mobile mais recente: ok com o diretor da caneta de volta e sem o personagem estranho do mural
- popup com letreiro de previsao: ok no desktop e mobile, com painel central animado e aliens observando de novo
- popup desktop: melhorou, mas ainda vale revisar se quiser mais caos visual acima da linha media do card
- rodape: o bloco foi reduzido para 5 robos e o codigo agora posiciona o esquadrao muito mais alto; as capturas do rodape ficaram inconsistentes por causa do enquadramento do iframe de validacao
- sintaxe: `node --check script.js` e `node --check startup-experience.js` passaram

## Pendencia principal agora

- Se quiser concluir o ciclo completo, falta fazer o commit/push dessas alteracoes novas e acionar deploy.

## Observacoes importantes

- O workspace continua com outras alteracoes ja existentes do usuario em `news-data.js`, `server.js` e arquivos de `data/`; nao reverter.
- Arquivos de `data/` mudam durante validacoes locais; evitar incluir ruido desnecessario em commit.
- O commit anterior que ja foi para `origin/main` foi `5cd6811` (`Ajustar popup inicial e aliviar exercito do rodape`).
