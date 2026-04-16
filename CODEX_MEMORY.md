# CODEX Memory

Ultima atualizacao: 2026-04-16 09:45 -05:00 (America/Rio_Branco)

## Preferencia do usuario

- Quando o chat reiniciar, retomar o trabalho sem pedir tudo de novo.
- Manter uma memoria local do que esta em andamento neste projeto.

## Pedido atual em andamento

Finalizar os ajustes visuais da home e subir a versao:

1. reduzir o exercito de robos do rodape para no maximo 20
2. adicionar uma ceninha de guerra no fundo do pop-up inicial
3. conferir responsivo para ficar bom no celular, com cara de app
4. subir e deixar rodando

## O que ja foi feito

- [index.html](C:/Users/junio/projeto codex/index.html) agora usa `data-army-count="20"` na area do exercito do rodape.
- [script.js](C:/Users/junio/projeto codex/script.js) passou a limitar o exercito para no maximo 20 no desktop e menos em modo compacto/lite.
- [styles.css](C:/Users/junio/projeto codex/styles.css) recebeu um ajuste para deixar a area do rodape mais leve e menor.
- [startup-experience.js](C:/Users/junio/projeto codex/startup-experience.js) ganhou `buildWelcomeVisualMarkup()` para reutilizar a arte visual no pop-up normal e no compacto.
- [startup-experience.css](C:/Users/junio/projeto codex/startup-experience.css) ganhou a cena de guerra (`catalogo-war-tableau`) e um topo visual compacto para o mobile.
- O mobile compacto do pop-up foi corrigido para alinhar pelo topo (`.catalogo-welcome.is-compact { place-items: start center; }`), evitando o corte estranho do card.

## Validacoes ja feitas

Capturas em `.codex-temp/visual-verify/`:

- `startup-popup-desktop.png`
- `startup-popup-mobile-viewport.png`
- `footer-army-desktop.png`
- `footer-army-mobile.png`

Leitura atual dessas validacoes:

- popup desktop: ok
- popup mobile: ok apos alinhar o card compacto pelo topo
- rodape desktop: ok, bem mais leve
- rodape mobile: ok, botoes e blocos continuam legiveis

## Pendencia principal agora

- Fazer o deploy final da versao atualizada.

## Observacoes importantes

- O workspace esta com outras alteracoes ja existentes do usuario, inclusive em `news-data.js`, `server.js`, `script.js` e `styles.css`.
- Arquivos de `data/` mudaram durante as validacoes locais; tomar cuidado para nao subir ruido desnecessario se o deploy for via commit.
- Tentativa de acesso SSH ao VPS `108.174.144.183:22022` com senha falhou em 2026-04-16, entao o caminho mais provavel de deploy pode ser `git push` para acionar a hospedagem ligada ao GitHub.
