# CODEX Memory

Ultima atualizacao: 2026-04-16 18:20 -05:00 (America/Rio_Branco)

## Preferencia do usuario

- Quando o chat reiniciar, retomar o trabalho sem pedir tudo de novo.
- Manter uma memoria local do que esta em andamento neste projeto.
- Trabalhar sem ficar pedindo permissao para fluxo normal.

## Pedido atual em andamento

Fechar o pacote final desta rodada:

1. manter a home, popup e consulta no estado visual ja validado
2. atualizar todas as noticias e caches principais
3. subir o conjunto para `origin/main` e deixar o deploy pronto para acompanhar

## O que ja foi feito

- [index.html](C:/Users/junio/projeto codex/index.html) agora fixa o rodape em `data-army-count="5"` e atualiza a copy para "Esquadrão editorial em ataque".
- [script.js](C:/Users/junio/projeto codex/script.js) passou a travar o rodape em 5 robos e usar um blueprint fixo de posicoes, escala e pose para desktop e mobile.
- [styles.css](C:/Users/junio/projeto codex/styles.css) recebeu overrides para o esquadrao ocupar mais o card, subir no enquadramento e ganhar poses mais agressivas.
- [startup-experience.js](C:/Users/junio/projeto codex/startup-experience.js) ganhou mais elementos da cena de guerra: bombas extras, flashes, crateras e novos soldados.
- [startup-experience.css](C:/Users/junio/projeto codex/startup-experience.css) foi reforcado para puxar o pop-up para uma leitura mais de batalha: fundo escurecido, explosoes maiores, combate mais visivel e ajuste compacto no mobile.
- O mural pixelado (`startup-chaos-mural.svg`) foi removido do popup porque estava trazendo um personagem e feixes indevidos; o diretor da caneta voltou para a cena via `.catalogo-director-stage`.
- O popup agora tambem tem um letreiro central de "previsao do futuro", com animacao em etapas (`binario > ascii > programacao > noticia`) e os observadores alienigenas voltaram ao markup.
- O laser do editor foi reancorado para sair visualmente da mao direita, com brilho de origem na propria mao para deixar a leitura clara.
- [styles.css](C:/Users/junio/projeto codex/styles.css) tambem reforca a animacao de `.southern-cross-orbit` para girar no proprio eixo (`rotateZ`) sem ficar parecendo orbita lateral.
- A faixa [index.html](C:/Users/junio/projeto codex/index.html) de "analise editorial" agora ganhou uma copy descritiva maior e mais chamativa, com destaque inicial em negrito.
- [styles.css](C:/Users/junio/projeto codex/styles.css) agora da um tratamento proprio para `.signal-band-description`, com tipografia maior, mais peso visual e colunas mais equilibradas na `signal-band`.
- [script.js](C:/Users/junio/projeto codex/script.js) agora faz os 5 robos patrulharem a arena com deslocamento proprio, resposta ao ponteiro e formacao mais espalhada para ocupar mais do card.
- [styles.css](C:/Users/junio/projeto codex/styles.css) ampliou a arena dos robos ate a faixa do "apresenta", sobrepos a legenda no palco e reforcou a leitura de cores tipo Power Rangers (vermelho, azul, amarelo, verde e rosa).
- O palco dos robos tambem foi esticado mais para baixo, com `min-height` maior no card e a formacao reposicionada mais abaixo para ocupar o novo espaco sem deixar um bloco vazio.
- Ajuste estrutural novo: o card `INSIDERS INFOR` deixou de ocupar uma linha separada do grid e passou a ficar sobreposto na frente do proprio palco, para a arena dos robos preencher toda a faixa ate o fundo do bloco.
- [startup-experience.css](C:/Users/junio/projeto codex/startup-experience.css) agora reposiciona o diretor pixelado acima do painel de "previsao do futuro", centralizado no popup e com escalas proprias para tablet, mobile e modo compacto.
- O bloco "Arquivo vivo" agora abre uma barra lateral rolavel ao focar/digitar na busca, mostrando todo o historico de pautas ja verificadas e atualizando o recorte em tempo real junto do autocomplete.
- [arquivo-noticias.js](C:/Users/junio/projeto codex/arquivo-noticias.js), [index.html](C:/Users/junio/projeto codex/index.html) e [styles.css](C:/Users/junio/projeto codex/styles.css) receberam a estrutura, interacao e estilos do novo `feed-drawer` lateral.
- O esquadrao do rodape foi refeito para 3 robos em vez de 5, com poses mais agressivas, movimento mais rapido, rajadas pelos olhos e alvos simbolicos de desinformacao (`fake news`, `deepfake`, `dados torcidos`) em vez de pessoas especificas.
- [script.js](C:/Users/junio/projeto codex/script.js), [index.html](C:/Users/junio/projeto codex/index.html) e [styles.css](C:/Users/junio/projeto codex/styles.css) agora tratam esse card como uma cena de guerra contra o ruido: fundo mais pesado, copy nova e trio blindado.
- Foi feita tambem uma passada extra no mobile para empurrar a home para uma leitura mais "app": raios e rodape responsivos, bordas mais consistentes e blocos com padding/radius mais controlados em telas pequenas.
- O letreiro central do popup foi refeito para uma leitura maior e mais teatral: agora ele abre com terminal, atravessa binario > ascii > sintaxe > alegoria, segura uma manchete grande de "ataque alienigena iminente / guerra mundial iminente", derruba para "era so um meme" e reinicia o ciclo.
- [startup-experience.js](C:/Users/junio/projeto codex/startup-experience.js) e [startup-experience.css](C:/Users/junio/projeto codex/startup-experience.css) tambem reposicionam o diretor mais em cima do letreiro, apontando lateralmente para os termos com o laser mais comprido e mais legivel.
- A hero principal agora ficou preparada para 50 slots diarios de foto, combinando um shuffle por data do acervo de Cruzeiro do Sul com imagens locais do proprio feed quando houver, para variar mais a abertura sem depender so de uma lista fixa.
- [script.js](C:/Users/junio/projeto codex/script.js) agora monta esse pool diario, aplica foco diferente por slot e acelera um pouco a rotacao da hero.
- A pagina [pesquisa-acre-2026.html](C:/Users/junio/projeto codex/pesquisa-acre-2026.html) ganhou copy mais neutra de pesquisa, sem a leitura tao puxada para editorial.
- [pesquisa-acre-2026.css](C:/Users/junio/projeto codex/pesquisa-acre-2026.css) foi puxado para uma paleta mais neutra e clara, mantendo contraste mas saindo do clima pesado anterior.
- O fluxo da consulta administrativa da pesquisa foi deixado mais robusto em [pesquisa-acre-2026.js](C:/Users/junio/projeto codex/pesquisa-acre-2026.js), sanitizando melhor a senha digitada e deixando o feedback mais claro.
- O dashboard grande [backend/public/admin-dashboard.html](C:/Users/junio/projeto codex/backend/public/admin-dashboard.html) agora reforca o usuario padrao `admin`, evita tropeco se o usuario ficar em branco e tambem ficou com visual mais neutro.
- [styles.css](C:/Users/junio/projeto codex/styles.css) recebeu um ajuste final para os feixes do trio anti-desinformacao nascerem mais alto, claramente da faixa dos olhos em vez de parecerem sair do pescoco.
- [script.js](C:/Users/junio/projeto codex/script.js) agora mantem um fallback leve para montar o trio do bloco `Insiders Infor` mesmo se o `IntersectionObserver` falhar em navegadores/headless mais instaveis.
- [script.js](C:/Users/junio/projeto codex/script.js) tambem foi corrigido em dois pontos de runtime: a chamada precoce de `registerArticleCardLinks(radarGrid)` passou a ser deferida e o helper `getHeroTourismDailyPool()` voltou a existir como alias de `buildHeroTourismDailyPool()`.

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
- `turn18-popup-desktop-tall.png`

Leitura atual dessas validacoes:

- popup mobile: melhorou bem, a leitura de guerra ficou clara e mais pesada
- popup mobile mais recente: ok com o diretor da caneta de volta e sem o personagem estranho do mural
- popup com letreiro de previsao: ok no desktop e mobile, com painel central animado e aliens observando de novo
- popup com laser do editor: ok, agora o feixe nasce da mao direita com ponto de origem luminoso
- faixa "analise editorial": validada no navegador em desktop e mobile; a descricao ficou maior e sem overflow horizontal/vertical no bloco
- popup desktop: melhorou, mas ainda vale revisar se quiser mais caos visual acima da linha media do card
- rodape: o bloco foi reduzido para 5 robos e o codigo agora posiciona o esquadrao muito mais alto; as capturas do rodape ficaram inconsistentes por causa do enquadramento do iframe de validacao
- sintaxe: `node --check script.js` e `node --check startup-experience.js` passaram
- sintaxe: `node --check script.js` passou de novo apos a patrulha/interacao dos robos
- validacao visual automatica do novo card dos robos ficou pendente: Chrome/Edge headless nao conseguiram gerar screenshot local nesta sessao
- ajuste extra pedido pelo usuario: aumentar a arena dos robos para baixo; validacao visual automatica continua pendente pelo mesmo bloqueio no headless
- ajuste extra do ajuste: o usuario queria preencher todo o espaco morto ate embaixo mantendo o card Insiders na frente; isso foi atendido com overlay absoluto do card e arena ocupando a ultima faixa inteira
- ajuste novo do popup: usuario pediu o diretor acima da "previsao"; CSS atualizado, mas a validacao visual automatica ainda nao saiu porque Edge headless segue sem gerar screenshot nesta sessao
- sintaxe: `node --check arquivo-noticias.js` passou depois da barra lateral do arquivo
- consistencia basica: `styles.css` ficou com balanco de chaves ok (`brace-balance 0`) apos corrigir um `}` extra no bloco responsivo do drawer
- sintaxe: `node --check script.js` passou depois do novo trio de robos
- consistencia basica: `styles.css` continuou com balanco de chaves ok (`brace-balance 0`) apos os overrides finais do rodape e do polimento mobile
- tentativa de screenshot mobile automatica do HTML local ficou instavel nesta sessao: Chrome headless respondeu com tela de conexao recusada mesmo com o servidor local pronto, entao a revisao mobile foi fechada principalmente por inspecao estrutural do CSS responsivo
- sintaxe: `node --check script.js`, `startup-experience.js` e `pesquisa-acre-2026.js` passaram depois da retomada das ultimas ordens
- consistencia basica: `styles.css`, `startup-experience.css` e `pesquisa-acre-2026.css` ficaram com `brace-balance 0`
- backend local: `POST /api/pesquisa-acre-2026/admin` respondeu `200` com a senha `99831455a`
- backend local: `GET /api/admin/dashboard` respondeu `200` com Basic Auth `admin:99831455a`
- validacao visual automatica por screenshot continuou bloqueada nesta sessao porque o Chrome headless abriu com erro de `crashpad CreateFile: Acesso negado` e nao escreveu os PNGs, entao a conferencia visual final ainda pede navegador manual
- o bloqueio do `crashpad CreateFile: Acesso negado` foi contornado nesta retomada usando DevTools/CDP do Chrome headless com perfil temporario, sem depender da flag nativa de screenshot
- erro de runtime identificado e corrigido: `registerArticleCardLinks(radarGrid)` estava sendo chamado cedo demais e interrompia a execucao do `script.js`
- erro de runtime identificado e corrigido: `getHeroTourismDailyPool is not defined` quebrava `initializeHeroTourismHero()` e impedia inicializacoes posteriores na home
- capturas novas em `.codex-temp/visual-review-home/`:
- `home-popup-desktop.png`
- `home-top-after-popup.png`
- `home-insiders-stage-fixed.png`
- leitura atual: popup desktop ok; topo da home ok; bloco `Insiders Infor` voltou a montar o trio anti-desinformacao e ficou visualmente preenchido
- capturas novas em `.codex-temp/visual-review-pesquisa/`:
- `pesquisa-topo.png`
- `pesquisa-admin-aberto.png`
- leitura atual: pagina de consulta ficou neutra e legivel; painel administrativo abre com visual coerente e sem distorcoes evidentes no desktop
- refresh local concluido em `POST /api/news/refresh` da raiz: `news-data.js` e `data/runtime-news.json` foram regenerados com 28 itens; `ac24horas` veio com 18, `agencia-acre` com 10, `jurua-online` voltou vazio e `prefeitura-czs` respondeu `404`
- refresh local concluido em `POST /api/news/refresh` do backend: [backend/data/news-cache.json](C:/Users/junio/projeto codex/backend/data/news-cache.json) foi atualizado com 10 itens online

## Pendencia principal agora

- Acompanhar o deploy da subida mais recente em `origin/main` e conferir o comportamento no servidor.
- Se o servidor ou DNS reagirem mal depois da subida, registrar o erro exato para a proxima passada.

## Observacoes importantes

- O workspace continua com outras alteracoes ja existentes do usuario em `news-data.js`, `server.js` e arquivos de `data/`; nao reverter.
- Arquivos de `data/` mudam durante validacoes locais; evitar incluir ruido desnecessario em commit.
- O backend local criou JSONs vazios em `backend/data/` ao subir o servidor; isso e ruido operacional e nao precisa entrar no commit.
- O pacote desta rodada subiu para `origin/main` no commit `96b887c` (`Atualizar home final e renovar noticias`).
- O commit anterior que ja foi para `origin/main` foi `5cd6811` (`Ajustar popup inicial e aliviar exercito do rodape`).
