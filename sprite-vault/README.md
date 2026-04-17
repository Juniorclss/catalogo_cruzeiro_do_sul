# Sprite Vault

Repositório local do `Escritório de Ninjas` para sprites 2D, tilesets, props, HUDs, efeitos e referências de jogos.

## Objetivo

Guardar material visual que possa ser reutilizado depois em jogos, protótipos, mockups e páginas do portal.

## Regra principal

Nada de asset roubado, sem origem ou com licença duvidosa.

Este cofre é para:

- material criado pela equipe;
- domínio público;
- Creative Commons compatível com o uso planejado;
- packs comprados/licenciados;
- referências visuais para estudo, sem uso direto indevido.

## Estrutura

- `references/`: links, notas e material de estudo
- `sprites/`: sprites prontos para uso futuro
- `generated/`: material original ou derivado internamente
- `sources/`: pacotes brutos baixados e extraidos com proveniencia preservada
- `licenses/`: comprovantes, notas de atribuição e observações de uso
- `manifest.json`: índice central do cofre

## Fluxo sugerido

1. Entrou no cofre? registrar origem e licença.
2. Se for referência apenas, deixar em `references/`.
3. Se for asset liberado para uso, catalogar em `manifest.json`.
4. Se a equipe redesenhar ou criar algo próprio, salvar em `generated/`.
5. Se houver dúvida de origem, não usar.

## Lote inicial

Primeiro intake concluido com packs oficiais do Kenney em `CC0 1.0`:

- `New Platformer Pack`
- `Pixel UI Pack`
- `Pixel Shmup`

As fontes brutas ficaram em `sources/kenney/raw/`, os pacotes extraidos em `sources/kenney/`
e os conjuntos prontos para reuso foram separados em `sprites/characters`, `sprites/enemies`,
`sprites/tilesets`, `sprites/props`, `sprites/ui` e `sprites/fx`.
