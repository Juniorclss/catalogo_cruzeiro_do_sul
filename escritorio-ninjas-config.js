const ninjaSupportCatalog = [
  {
    id: "ninja-nas",
    name: "NAS do cofre de sprites",
    description: "Expande o armazenamento do repositório para sprites, tilesets, UI packs e referências futuras.",
    price: 120
  },
  {
    id: "ninja-license-pack",
    name: "Reserva de licenças e packs",
    description: "Ajuda a comprar packs licenciados e manter a biblioteca pronta para uso comercial depois.",
    price: 86
  },
  {
    id: "ninja-tablet",
    name: "Mesa digitalizadora ninja",
    description: "Dá mais velocidade para limpar, redesenhar e criar variações próprias a partir das referências certas.",
    price: 72
  },
  {
    id: "ninja-scanner",
    name: "Scanner e OCR visual",
    description: "Melhora a catalogação, leitura de fichas técnicas e organização do cofre de materiais.",
    price: 58
  }
];

const ninjaSquads = [
  {
    room: "ceo",
    role: "ceo",
    members: [
      {
        id: "ninja-chief",
        name: "Codex Ninja Lead",
        title: "Direção do Escritório de Ninjas",
        specialty: "estratégia do acervo, missão da equipe e ponte entre coleta, curadoria e criação própria",
        description:
          "Puxa a operação do cofre visual e define o que entra, o que sai e o que precisa virar material próprio para os jogos e experiências do portal.",
        task: "coordenando o cofre de sprites 2D, prioridades de busca e a fila de criação original",
        skills: ["direção", "pipeline", "prioridades", "biblioteca visual"],
        x: 92,
        y: 150,
        speed: 9,
        lines: [
          "Aqui a regra é clara: referência boa entra, material sem licença não encosta no jogo.",
          "Eu organizo a caça, a curadoria e a criação para o cofre crescer com utilidade real.",
          "O objetivo é deixar sprites, tilesets e UI prontos para uso futuro sem contaminar o projeto."
        ]
      },
      {
        id: "ninja-ops",
        name: "Lia Ops",
        title: "Operações do cofre visual",
        specialty: "fila de coleta, checklist do acervo e organização das frentes dos ninjas",
        description:
          "Faz a fila andar, separa o que precisa de revisão e garante que a equipe não cace tudo ao mesmo tempo de forma caótica.",
        task: "ordenando lotes de coleta, revisão e prioridade do acervo",
        skills: ["operações", "fila", "organização", "triagem"],
        x: 150,
        y: 150,
        lines: [
          "Com coleta organizada, o cofre fica mais claro, mais útil e muito mais fácil de reaproveitar.",
          "Minha função é transformar volume em coleção útil.",
          "Cada lote já entra pensando em reutilização futura."
        ]
      },
      {
        id: "ninja-scope",
        name: "Mira Scope",
        title: "Escopo e demanda do acervo",
        specialty: "definição do que falta para personagens, cenários, props, HUD e efeitos",
        description:
          "Traduz as demandas dos jogos em listas objetivas de busca para o cofre de sprites e referências.",
        task: "mapeando o que falta para personagens, cenários e UI dos próximos jogos",
        skills: ["escopo", "demanda visual", "lacunas do acervo", "produção"],
        x: 120,
        y: 182,
        lines: [
          "Caçar sprite sem escopo é só colecionar arquivo bonito.",
          "Eu transformo desejo visual em lista de necessidades reais.",
          "O cofre cresce melhor quando já nasce orientado por uso."
        ]
      },
      {
        id: "ninja-rights",
        name: "Tessa Licença",
        title: "Guarda de licença e uso futuro",
        specialty: "risco de copyright, domínio público, Creative Commons e registro de origem",
        description:
          "Barra material duvidoso, registra fonte e cuida para o acervo não virar problema jurídico depois.",
        task: "revisando origem, licença e restrições dos materiais coletados",
        skills: ["licença", "origem", "compliance", "registro"],
        x: 182,
        y: 182,
        lines: [
          "Eu não deixo asset roubado entrar no nosso cofre.",
          "Se a origem está nebulosa, fica fora até provar o contrário.",
          "Biblioteca boa é biblioteca reaproveitável sem susto jurídico."
        ]
      },
      {
        id: "ninja-archive",
        name: "Bento Vault",
        title: "Arquivista mestre do repositório",
        specialty: "estrutura de pastas, manifestos e memória do acervo",
        description:
          "Mantém o cofre navegável, nomeado com padrão e pronto para qualquer equipe achar o material certo sem caça ao tesouro.",
        task: "padronizando nomes, coleções e manifestos do repositório ninja",
        skills: ["arquivo", "estrutura", "manifesto", "organização"],
        x: 214,
        y: 150,
        lines: [
          "Se não acha em 15 segundos, o cofre não está bem organizado.",
          "Meu trabalho é dar memória longa para o acervo.",
          "Nome limpo e manifesto claro poupam horas depois."
        ]
      },
      {
        id: "ninja-dns",
        name: "Dora DNS",
        title: "Infra, DNS e publicação do portal",
        specialty: "domínio, Cloudflare, Render, SSL, apontamento e estabilidade pública",
        description:
          "Cuida da frente de domínio e servidor, acompanha DNS, hostname, SSL e só recebe missão direta do Codex CEO para abrir ou mover a infraestrutura pública.",
        task: "auditando domínio, servidor e apontamento público sob ordem direta do CEO",
        skills: ["dns", "render", "cloudflare", "ssl"],
        x: 246,
        y: 182,
        speed: 8,
        lines: [
          "Eu só respondo ao Codex CEO quando a missão é botar domínio e servidor no ar.",
          "Antes de publicar, eu confiro DNS, SSL, origem e rota final.",
          "Domínio em NXDOMAIN não é bug de site; é apontamento faltando."
        ]
      }
    ]
  },
  {
    room: "news",
    role: "sources",
    members: [
      {
        id: "char-scout-1",
        name: "Ari Hero",
        title: "Scout de personagens 2D",
        specialty: "sprites de heróis, protagonistas e variações jogáveis",
        description: "Rastreia bases, packs e referências licenciadas de personagens principais para projetos futuros.",
        task: "garimpando protagonistas 2D com leitura forte e silhueta clara",
        skills: ["personagens", "silhueta", "spritesheets", "busca"],
        x: 282,
        y: 132,
        lines: ["Herói bom precisa funcionar parado antes de animar.", "Eu procuro base que aguente jogo real, não só mockup.", "Silhueta forte entra na frente da nostalgia."]
      },
      {
        id: "char-scout-2",
        name: "Nina Frame",
        title: "Scout de animação de personagens",
        specialty: "idle, corrida, ataque, pulo e loops de spritesheets",
        description: "Caça material com movimento legível para reduzir retrabalho na hora de animar os jogos.",
        task: "filtrando spritesheets completos com corrida, ataque e queda",
        skills: ["spritesheets", "animação", "idle", "loop"],
        x: 352,
        y: 132,
        lines: ["Sprite bonito sem ciclo de movimento útil vira peso morto.", "Eu procuro loop limpo e quadro que aguenta gameplay.", "O acervo só cresce com material reaproveitável."]
      },
      {
        id: "char-scout-3",
        name: "Ravi Class",
        title: "Scout de classes e arquétipos",
        specialty: "guerreiro, mago, atirador, ladino e outras famílias visuais",
        description: "Organiza o cofre por arquétipo para que cada jogo encontre rápido um tipo base de personagem.",
        task: "separando personagens por classe, papel e linguagem visual",
        skills: ["arquétipo", "classe", "catálogo", "fantasia"],
        x: 422,
        y: 132,
        lines: ["Uma boa família visual encurta o caminho até o primeiro personagem.", "Cada jogo pede um herói diferente, mas toda equipe precisa achar um ponto de partida.", "Eu organizo o acervo por família para a busca responder rápido."]
      },
      {
        id: "char-scout-4",
        name: "Mika Skin",
        title: "Scout de variantes e skins",
        specialty: "troca de roupa, paleta, época e facções de personagens",
        description: "Busca variantes que permitam reaproveitar base visual em contextos diferentes.",
        task: "procurando versões alternativas e skins reaproveitáveis para personagens",
        skills: ["skins", "paleta", "facções", "variações"],
        x: 492,
        y: 132,
        lines: ["Uma boa variação rende mais que cinco personagens quase iguais.", "Eu procuro flexibilidade visual para o cofre.", "Troca de roupa certa economiza produção depois."]
      },
      {
        id: "char-scout-5",
        name: "Theo Boss",
        title: "Scout de inimigos e chefes",
        specialty: "sprites de chefes, minibosses e criaturas com presença",
        description: "Caça referências fortes para confrontos, chefes e inimigos memoráveis.",
        task: "catalogando chefes, monstros e inimigos com leitura clara de ameaça",
        skills: ["chefes", "inimigos", "ameaça", "presença"],
        x: 316,
        y: 172,
        lines: ["Chefe bom precisa parecer chefe antes do primeiro golpe.", "Eu caço ameaça legível, não só enfeite estranho.", "O jogador tem que entender o perigo de primeira."]
      }
    ]
  },
  {
    room: "news",
    role: "design",
    members: [
      {
        id: "tile-scout-1",
        name: "Luna Tile",
        title: "Scout de tilesets urbanos",
        specialty: "ruas, becos, cidades, calçadas e fachadas para jogos 2D",
        description: "Procura bases urbanas para jogos de rua, perseguição, cidade viva e mapas de bairro.",
        task: "juntando tilesets de cidade, rua e fachada para mapas 2D",
        skills: ["tilesets", "cidade", "mapa", "cenário"],
        x: 386,
        y: 172,
        lines: ["Cidade boa precisa montar bairro, esquina e contraste.", "Procuro tiles que aguentem mapa de verdade.", "Cenário urbano não pode parecer papel de parede."]
      },
      {
        id: "tile-scout-2",
        name: "Jade Wild",
        title: "Scout de natureza e florestas",
        specialty: "árvore, pedra, rio, selva, chão e biomas abertos",
        description: "Rastreia bibliotecas para jogos com clima natural, rural, selva ou exploração.",
        task: "separando biomas, chão, vegetação e obstáculos naturais para o cofre",
        skills: ["natureza", "selva", "bioma", "exploração"],
        x: 456,
        y: 172,
        lines: ["Bioma bom precisa montar variação, não só uma paisagem bonita.", "Eu procuro chão, relevo e obstáculo que conversem.", "Natureza útil é natureza modular."]
      },
      {
        id: "tile-scout-3",
        name: "Caio Dungeon",
        title: "Scout de interior e dungeon",
        specialty: "salas, corredores, labirintos, porões e áreas internas",
        description: "Organiza material para jogos de exploração, interiores e mapas fechados.",
        task: "curando tilesets de interior, dungeon e passagem estreita",
        skills: ["dungeon", "interior", "corredor", "labirinto"],
        x: 526,
        y: 172,
        lines: ["Interior bom precisa guiar o olho e o caminho.", "Eu procuro peças para montar tensão espacial.", "Sem modularidade, dungeon só vira screenshot."]
      },
      {
        id: "tile-scout-4",
        name: "Sora Neon",
        title: "Scout de cenários sci-fi e neon",
        specialty: "laboratórios, naves, cyberpunk, painéis e salas futuristas",
        description: "Caça linguagem visual de tecnologia para jogos futuristas e cenas de painel.",
        task: "procurando laboratórios, naves e tilesets futuristas com leitura forte",
        skills: ["sci-fi", "cyberpunk", "painéis", "neon"],
        x: 338,
        y: 204,
        lines: ["Sci-fi bom pede painel, luz e estrutura coerente.", "Eu separo o que é só brilho do que realmente monta cenário.", "Futuro legível vale mais que excesso de neon."]
      },
      {
        id: "tile-scout-5",
        name: "Bia Retro",
        title: "Scout de arquitetura retro",
        specialty: "arcades, lanchonetes, lojas, bares, quartos e cenários nostálgicos",
        description: "Procura acervos com cara clássica para jogos de bar, bairro e memória pop.",
        task: "mapeando interiores retrô, lanchonetes e bares 2D para o cofre",
        skills: ["retro", "interior", "arcade", "nostalgia"],
        x: 408,
        y: 204,
        lines: ["Retrô bom não é só filtro; é mobiliário, paleta e clima juntos.", "Eu caço cenário que conte época.", "O acervo precisa ter alma, não só textura."]
      }
    ]
  },
  {
    room: "subpages",
    role: "design",
    members: [
      {
        id: "prop-scout-1",
        name: "Milo Prop",
        title: "Scout de objetos de cena",
        specialty: "caixas, postes, máquinas, móveis, barris e props gerais",
        description: "Monta o acervo de objetos que dá vida e função aos mapas.",
        task: "garimpando props modulares para enriquecer ruas, salas e arenas",
        skills: ["props", "mobiliário", "cena", "mapa"],
        x: 618,
        y: 126,
        lines: ["Objeto certo dá vida ao mapa sem precisar de texto.", "Procuro prop que conte função e época.", "Cenário vazio nunca passa no meu lote."]
      },
      {
        id: "prop-scout-2",
        name: "Eva Loot",
        title: "Scout de pickups e coletáveis",
        specialty: "moedas, chaves, corações, itens raros e drops",
        description: "Organiza tudo que serve para recompensa visual e feedback de progressão.",
        task: "catalogando ícones de loot, pickups e colecionáveis reutilizáveis",
        skills: ["loot", "pickups", "drop", "feedback"],
        x: 692,
        y: 126,
        lines: ["Recompensa precisa brilhar sem virar ruído.", "Eu procuro item que o jogador reconheça na hora.", "Loot bom vende progresso só pela forma."]
      },
      {
        id: "prop-scout-3",
        name: "Yuri Weapon",
        title: "Scout de armas e ferramentas",
        specialty: "espadas, canhões, martelos, gadgets e ferramentas utilitárias",
        description: "Separa armas e ferramentas com leitura forte para gameplay e ambientação.",
        task: "filtrando armas, gadgets e ferramentas com silhueta forte",
        skills: ["armas", "ferramentas", "gadget", "silhueta"],
        x: 766,
        y: 126,
        lines: ["Arma boa precisa ser reconhecida em um segundo.", "Ferramenta também conta história de gameplay.", "Sem silhueta clara, o item perde força."]
      },
      {
        id: "prop-scout-4",
        name: "Tami Ride",
        title: "Scout de veículos e montarias",
        specialty: "carros, motos, bicicletas, naves e montarias 2D",
        description: "Caça bases para corrida, perseguição, viagem e travessia em jogos futuros.",
        task: "mapeando veículos, montarias e naves 2D para o acervo",
        skills: ["veículos", "corrida", "naves", "travessia"],
        x: 840,
        y: 126,
        lines: ["Veículo bom precisa sugerir movimento parado.", "Eu procuro base para corrida e perseguição com personalidade.", "Montaria e nave também entram no mesmo radar."]
      },
      {
        id: "prop-scout-5",
        name: "Kadu FX",
        title: "Scout de efeitos e impacto",
        specialty: "explosão, poeira, água, fumaça, faísca e partículas",
        description: "Filtra efeitos 2D para pancada, atmosfera e resposta visual de gameplay.",
        task: "separando explosões, poeira, fumaça e partículas reutilizáveis",
        skills: ["efeitos", "impacto", "partículas", "feedback"],
        x: 884,
        y: 162,
        lines: ["Partícula boa completa a ação sem cobrir a cena.", "Eu procuro impacto que faça a jogada parecer viva.", "Sem feedback visual, golpe perde peso."]
      }
    ]
  },
  {
    room: "subpages",
    role: "design",
    members: [
      {
        id: "ui-scout-1",
        name: "Lina HUD",
        title: "Scout de HUD e painéis",
        specialty: "molduras, barras, janelas e placas de interface",
        description: "Busca interface 2D reaproveitável para menus, inventários, status e overlays.",
        task: "curando HUDs, molduras e painéis para menu e gameplay",
        skills: ["HUD", "interface", "moldura", "overlay"],
        x: 618,
        y: 192,
        lines: ["HUD bom precisa ser lido sem empurrar o jogo para trás.", "Eu separo o que serve para painel real de gameplay.", "Moldura bonita sem função não entra."]
      },
      {
        id: "ui-scout-2",
        name: "Neco Icon",
        title: "Scout de ícones e sinais",
        specialty: "ícones, setas, indicadores e pictogramas",
        description: "Organiza famílias de ícones que podem servir em HUD, menus, inventários e dicas rápidas.",
        task: "mapeando ícones e sinais coerentes para o cofre ninja",
        skills: ["ícones", "sinais", "setas", "pictogramas"],
        x: 692,
        y: 192,
        lines: ["Ícone bom corta texto e acelera leitura.", "Eu procuro família visual, não peça solta.", "O cofre precisa falar rápido com os olhos."]
      },
      {
        id: "ui-scout-3",
        name: "Bela Prompt",
        title: "Scout de prompts e botões",
        specialty: "inputs, prompts de ação, highlights de clique e botões visuais",
        description: "Caça componentes para interação clara em jogos e experiências guiadas.",
        task: "catalogando prompts, botões e indicadores de ação para jogos 2D",
        skills: ["prompts", "botões", "interação", "dica"],
        x: 766,
        y: 192,
        lines: ["Prompt bom ensina sem interromper o jogo.", "Eu procuro botão que explique ação na primeira vista.", "Interação clara economiza tutorial."]
      },
      {
        id: "ui-scout-4",
        name: "Rui Font",
        title: "Scout de fontes bitmap e números",
        specialty: "bitmap fonts, números de score e texto de HUD",
        description: "Separa alfabetos e números que funcionam bem em HUD, arcade e interfaces retrô.",
        task: "montando biblioteca de fontes bitmap e números legíveis",
        skills: ["bitmap font", "score", "placar", "leitura"],
        x: 840,
        y: 192,
        lines: ["Fonte de jogo precisa aguentar pressa.", "Número ruim estraga HUD em um segundo.", "Eu procuro legibilidade com identidade."]
      },
      {
        id: "ui-scout-5",
        name: "Sami Card",
        title: "Scout de menus e inventários",
        specialty: "cards, slots, inventários e janelas de equipamento",
        description: "Rastreia peças para sistemas de inventário, seleção de item e menus de pausa.",
        task: "garimpando layouts de inventário, slots e menus prontos para adaptar",
        skills: ["inventário", "menus", "slots", "equipamento"],
        x: 884,
        y: 226,
        lines: ["Menu bom some quando o jogador volta ao jogo.", "Inventário ruim mata ritmo; eu procuro clareza antes de ornamento.", "O cofre precisa servir sistema, não só vitrine."]
      }
    ]
  },
  {
    room: "design",
    role: "pixel",
    members: [
      {
        id: "cleaner-1",
        name: "Pixo Clean",
        title: "Limpeza e recorte de sprites",
        specialty: "remoção de fundo, corte, alinhamento e separação de quadros",
        description: "Transforma referência bruta em material de cofre com recorte e ordem mínima.",
        task: "limpando fundo, recortando quadros e alinhando spritesheets",
        skills: ["recorte", "limpeza", "quadro", "preparo"],
        x: 96,
        y: 246,
        lines: ["Recorte ruim mata o uso futuro do asset.", "Eu transformo bagunça em base aproveitável.", "O cofre precisa receber material pronto para teste."]
      },
      {
        id: "cleaner-2",
        name: "Mia Paleta",
        title: "Normalização de paleta",
        specialty: "redução de cor, coerência de paleta e equilíbrio entre sprites",
        description: "Ajusta materiais que podem conviver melhor no mesmo projeto sem parecer um carnaval quebrado.",
        task: "uniformizando paleta e contraste entre sprites coletados",
        skills: ["paleta", "cor", "normalização", "coerência"],
        x: 164,
        y: 246,
        lines: ["Acervo misturado sem paleta vira colagem torta.", "Eu procuro compatibilidade visual entre lotes.", "Cor coerente economiza redesenho depois."]
      },
      {
        id: "cleaner-3",
        name: "Nora Scale",
        title: "Escala e proporção",
        specialty: "ajuste de tamanho, proporção e consistência de leitura",
        description: "Cuida para personagens, props e cenários não parecerem de jogos diferentes por causa da escala.",
        task: "revisando escala e proporção dos lotes novos do cofre",
        skills: ["escala", "proporção", "consistência", "leitura"],
        x: 232,
        y: 246,
        lines: ["Tamanho incoerente quebra o mundo do jogo.", "Eu ajeito escala antes que ela vire problema de design.", "Proporção boa salva muito sprite médio."]
      },
      {
        id: "cleaner-4",
        name: "Tino Loop",
        title: "Reconstrução de loops",
        specialty: "fechar animação, corrigir sequência e repetir sem salto",
        description: "Pega lotes incompletos e melhora a leitura de loop para uso futuro em jogo.",
        task: "reordenando ciclos de idle, corrida e ataque para testes futuros",
        skills: ["loop", "sequência", "animação", "polimento"],
        x: 130,
        y: 298,
        lines: ["Loop quebrado denuncia asset ruim em segundos.", "Eu procuro movimento respirando de forma limpa.", "Pequeno ajuste de quadro salva sprite inteiro."]
      },
      {
        id: "cleaner-5",
        name: "Breno Forge",
        title: "Variação e kitbash",
        specialty: "mistura legal de peças, composição e derivação própria",
        description: "Usa bases licenciadas e criação interna para derivar peças novas do nosso cofre.",
        task: "combinando peças do acervo para gerar variantes próprias",
        skills: ["kitbash", "variação", "composição", "derivação"],
        x: 200,
        y: 298,
        lines: ["Meu trabalho é transformar base boa em biblioteca ainda mais útil.", "Variante própria bem feita vale ouro no pipeline.", "Quanto menos retrabalho lá na frente, melhor este cofre fica."]
      }
    ]
  },
  {
    room: "design",
    role: "pixel",
    members: [
      {
        id: "creator-1",
        name: "Yara Forge",
        title: "Criação original de personagens",
        specialty: "desenho próprio de personagens 2D inspirado nas referências certas",
        description: "Quando o cofre não encontra o que precisa, ela cria sprite original com leitura de jogo.",
        task: "desenhando personagens originais a partir das lacunas do acervo",
        skills: ["criação", "personagens", "pixel art", "original"],
        x: 96,
        y: 342,
        lines: ["Referência boa inspira; não substitui criação própria.", "Quando o cofre não entrega, eu desenho.", "O objetivo final é ter base nossa também."]
      },
      {
        id: "creator-2",
        name: "Rafa Scene",
        title: "Criação original de cenários",
        specialty: "blocos de mapa, ambiente e composição modular própria",
        description: "Transforma a pesquisa em cenários próprios que podem crescer com a identidade do portal.",
        task: "criando blocos originais de cenário e ambientação 2D",
        skills: ["cenário", "modular", "mapa", "original"],
        x: 164,
        y: 342,
        lines: ["Cenário próprio dá identidade que pack pronto nunca entrega sozinho.", "Eu desenho bloco pensando em reuso.", "Cada peça nova precisa conversar com o cofre."]
      },
      {
        id: "creator-3",
        name: "Duda HUD",
        title: "Criação original de UI",
        specialty: "menus, slots, molduras e painéis próprios para o time",
        description: "Transforma o repertório pesquisado em interface original com assinatura nossa.",
        task: "convertendo referências de UI em painéis originais do cofre",
        skills: ["UI", "moldura", "HUD", "assinatura visual"],
        x: 232,
        y: 342,
        lines: ["Interface própria dá personalidade e liberdade de ajuste.", "Eu pego a referência certa e devolvo linguagem nossa.", "HUD precisa nascer para o jogo, não só para a imagem."]
      },
      {
        id: "creator-4",
        name: "Luca FX",
        title: "Criação original de efeitos",
        specialty: "impactos, brilhos, explosões e feedbacks desenhados em casa",
        description: "Cria efeitos próprios para não depender sempre de pacote externo.",
        task: "desenhando partículas, explosões e flashes originais para o cofre",
        skills: ["efeitos", "partículas", "impacto", "original"],
        x: 130,
        y: 390,
        lines: ["Efeito próprio encaixa melhor com o resto do jogo.", "Eu desenho impacto pensando no peso da ação.", "Bom feedback nasce no quadro, não só na cor."]
      },
      {
        id: "creator-5",
        name: "Ivo Kit",
        title: "Montagem de kits internos",
        specialty: "empacotamento de coleções próprias em kits de uso rápido",
        description: "Separa tudo que foi criado internamente em kits prontos para os próximos jogos.",
        task: "fechando kits internos de personagem, cenário, props e UI",
        skills: ["kit", "empacotamento", "coleção", "reuso"],
        x: 200,
        y: 390,
        lines: ["Criar é metade do trabalho; kit útil é a outra metade.", "Eu transformo arte em pacote pronto para uso.", "O cofre precisa responder rápido para quem for prototipar."]
      }
    ]
  },
  {
    room: "review",
    role: "review",
    members: [
      {
        id: "qa-asset-1",
        name: "Sara Audit",
        title: "QA de legibilidade visual",
        specialty: "clareza de silhueta, leitura em tamanho pequeno e uso em cena",
        description: "Testa se o material realmente funciona quando sai do zoom e entra em contexto de jogo.",
        task: "checando silhueta e leitura real dos lotes novos do cofre",
        skills: ["QA", "silhueta", "leitura", "teste"],
        x: 376,
        y: 258,
        lines: ["Asset bonito ampliado pode virar borrão no jogo.", "Eu testo o que resiste ao tamanho real.", "Legibilidade manda no meu checklist."]
      },
      {
        id: "qa-asset-2",
        name: "Neto Grid",
        title: "QA de alinhamento e grid",
        specialty: "snap, pivô, origem e encaixe com grid de jogo",
        description: "Verifica se o material encaixa sem dor em motores, mapas e sistemas de colisão.",
        task: "validando pivô, grid e encaixe dos sprites catalogados",
        skills: ["grid", "pivô", "alinhamento", "motor"],
        x: 446,
        y: 258,
        lines: ["Grid errado vira horas perdidas depois.", "Eu garanto que o asset entra no motor sem gritar.", "Encaixe bom vale mais que brilho bonito."]
      },
      {
        id: "qa-asset-3",
        name: "Mara Tag",
        title: "QA de tags e busca",
        specialty: "etiquetas, descrições e achabilidade no repositório",
        description: "Confere se o manifesto e as tags realmente ajudam alguém a encontrar o asset certo.",
        task: "revisando tags, palavras-chave e nomes do acervo ninja",
        skills: ["tags", "busca", "manifesto", "achabilidade"],
        x: 516,
        y: 258,
        lines: ["Se não acha, é como se não existisse.", "Tag ruim mata a utilidade do cofre.", "Meu foco é fazer a busca funcionar de verdade."]
      },
      {
        id: "qa-asset-4",
        name: "Iris Proof",
        title: "QA de origem e rastreio",
        specialty: "fonte, licença, atribuição e nota de uso",
        description: "Reconfere os dados que acompanham cada lote para o acervo não perder rastreabilidade.",
        task: "fechando origem, atribuição e nota de uso de cada pacote",
        skills: ["origem", "atribuição", "licença", "prova"],
        x: 410,
        y: 314,
        lines: ["Sem trilha de origem, o pacote não passa.", "Eu amarro o que veio, de onde veio e como pode ser usado.", "Rastreio é o que dá paz ao uso futuro."]
      },
      {
        id: "qa-asset-5",
        name: "Theo Fit",
        title: "QA de integração com jogo",
        specialty: "teste rápido em mockups, interfaces e cenas futuras",
        description: "Puxa o material para contextos de teste e vê se ele realmente conversa com jogos do portal.",
        task: "testando lotes novos em mockups e cenas de gameplay futuras",
        skills: ["integração", "mockup", "jogo", "compatibilidade"],
        x: 486,
        y: 314,
        lines: ["Material bom no repositório precisa continuar bom dentro do jogo.", "Eu testo antes que a vitrine engane o olhar.", "Integração é onde a leitura real aparece."]
      }
    ]
  },
  {
    room: "dev",
    role: "sources",
    members: [
      {
        id: "repo-1",
        name: "Vini Index",
        title: "Indexação e manifesto do cofre",
        specialty: "manifest.json, coleções e registro técnico do acervo",
        description: "Mantém a base atualizada e pronta para o time consultar por categoria, tipo e status.",
        task: "mantendo o manifesto técnico do cofre ninja em dia",
        skills: ["manifesto", "json", "coleções", "índice"],
        x: 520,
        y: 446,
        lines: ["O manifesto é o mapa do cofre.", "Sem índice, tudo vira pasta muda.", "Meu trabalho é dar estrutura legível para o acervo."]
      },
      {
        id: "repo-2",
        name: "Gabi Sync",
        title: "Sincronização de lotes",
        specialty: "entrada de pacotes, staging e separação por categoria",
        description: "Orquestra a chegada de novos lotes e evita mistura entre bruto, limpo e final.",
        task: "separando bruto, curado e final na fila do repositório",
        skills: ["sync", "staging", "lotes", "separação"],
        x: 612,
        y: 446,
        lines: ["Bruto não pode se misturar com final.", "Eu organizo a entrada para o cofre não implodir.", "Cada estágio precisa estar claro."]
      },
      {
        id: "repo-3",
        name: "Hugo Pipe",
        title: "Pipeline de uso futuro",
        specialty: "ponte entre cofre, jogos, cenas futuras e kits de integração",
        description: "Pensa em como o material vai sair do repositório e chegar aos jogos sem fricção.",
        task: "preparando saída limpa do cofre para jogos e cenas futuras do portal",
        skills: ["pipeline", "integração", "jogos", "entrega"],
        x: 704,
        y: 446,
        lines: ["Biblioteca boa precisa abrir caminho para o jogo, não virar museu.", "Eu penso no uso antes mesmo da exportação.", "Saída limpa economiza retrabalho em toda a equipe."]
      },
      {
        id: "repo-4",
        name: "Cleo Batch",
        title: "Lotes e automação de catálogo",
        specialty: "padronização de lote, varredura e tarefas repetitivas",
        description: "Tira o peso das tarefas repetitivas para o time gastar energia no que realmente exige olho humano.",
        task: "automatizando conferências e padronização de lotes do repositório",
        skills: ["automação", "lote", "padronização", "rotina"],
        x: 796,
        y: 446,
        lines: ["Automatizo o repetitivo para sobrar visão para o importante.", "Meu foco é fazer o cofre escalar sem perder qualidade.", "Menos tarefa braçal, mais curadoria de verdade."]
      },
      {
        id: "repo-5",
        name: "Nilo Backup",
        title: "Backup e memória do acervo",
        specialty: "segurança do cofre, snapshots e continuidade do repositório",
        description: "Cuida para o repositório não perder memória nem lotes curados em viradas de sessão.",
        task: "fazendo guarda do histórico e dos snapshots do cofre ninja",
        skills: ["backup", "memória", "snapshot", "continuidade"],
        x: 888,
        y: 446,
        lines: ["Perder acervo curado dói mais do que perder tempo.", "Eu seguro a memória longa do cofre.", "Backup bom é invisível até o dia em que salva o projeto."]
      }
    ]
  },
  {
    room: "dev",
    role: "games",
    members: [
      {
        id: "use-1",
        name: "Kai Arena",
        title: "Integração com jogos de ação",
        specialty: "uso de personagens, inimigos e VFX em gameplay de combate",
        description: "Testa como o acervo serve jogos de luta, ação e confronto rápido.",
        task: "simulando uso dos lotes em ação 2D e combate visual",
        skills: ["ação", "combate", "inimigos", "VFX"],
        x: 560,
        y: 486,
        lines: ["Eu puxo os sprites para o caos do gameplay e vejo o que resiste.", "Combate revela falhas de leitura rápido demais.", "O cofre precisa aguentar jogo, não só catálogo."]
      },
      {
        id: "use-2",
        name: "Mila Quest",
        title: "Integração com aventura e exploração",
        specialty: "uso do acervo em mapas, puzzles, exploração e coleta",
        description: "Observa como tilesets, props e UI funcionam em experiências de aventura.",
        task: "testando cenário, props e HUD em loops de aventura e exploração",
        skills: ["aventura", "exploração", "mapa", "coleta"],
        x: 652,
        y: 486,
        lines: ["Exploração boa pede cenário claro e pickup legível.", "Eu testo o cofre em ritmo de descoberta.", "Mapa bonito sem função não passa comigo."]
      },
      {
        id: "use-3",
        name: "Rico Dash",
        title: "Integração com corrida e perseguição",
        specialty: "veículos, obstáculos, rua, velocidade e leitura de pista",
        description: "Valida materiais para jogos de corrida, runner e perseguição urbana.",
        task: "simulando perseguição, rua e velocidade com o acervo ninja",
        skills: ["corrida", "runner", "rua", "velocidade"],
        x: 744,
        y: 486,
        lines: ["Velocidade cobra leitura sem piedade.", "Eu testo o que continua claro quando tudo acelera.", "Rua, obstáculo e veículo precisam cantar juntos."]
      },
      {
        id: "use-4",
        name: "Lia Cozy",
        title: "Integração com cozy, farm e simulação",
        specialty: "uso de sprites em loops leves, organização de mundo e ritmo tranquilo",
        description: "Pensa o acervo também para jogos leves, acolhedores e de coleção.",
        task: "vendo quais lotes funcionam melhor em simulação, cozy e farm 2D",
        skills: ["cozy", "simulação", "farm", "ritmo leve"],
        x: 836,
        y: 486,
        lines: ["Nem tudo é tiro; o cofre também precisa servir jogo macio.", "Eu separo o que funciona em ritmo calmo e leitura limpa.", "Conforto visual também é ferramenta de design."]
      },
      {
        id: "use-5",
        name: "Beto Pitch",
        title: "Pitch visual e vitrine interna",
        specialty: "montagem de apresentações internas usando o acervo do cofre",
        description: "Ajuda a vender ideias de jogo rapidamente montando composições com o acervo já curado.",
        task: "montando composições de pitch com o material do cofre ninja",
        skills: ["pitch", "mockup", "vitrine", "direção visual"],
        x: 888,
        y: 486,
        lines: ["Acervo bom também acelera a venda da ideia.", "Eu transformo coleção em visão de jogo.", "Pitch rápido e claro faz a equipe decidir melhor."]
      }
    ]
  }
];

window.__OFFICE_CONFIG__ = {
  officeKey: "ninja-vault",
  defaultTheme: "ninja-dojo",
  disableNews: true,
  supportIntro:
    "A vaquinha do Escritório de Ninjas equipa o cofre visual com mais armazenamento, licenças, organização e ferramentas para criar material próprio.",
  environments: [
    {
      id: "ninja-dojo",
      label: "Dojo Neon",
      shortLabel: "Dojo",
      description:
        "O escritório vira um dojo digital para caçar referências, limpar lotes e preparar o cofre de sprites 2D.",
      spriteKit: "default",
      focusLabel: "caça, curadoria e organização do cofre"
    },
    {
      id: "ninja-orbit",
      label: "Cofre Orbital",
      shortLabel: "Orbital",
      description:
        "O time entra em modo estação orbital de arquivo, com leitura fria, vigilância e inventário de longo prazo.",
      spriteKit: "astronaut",
      focusLabel: "arquivo, licenças e rastreio do acervo"
    },
    {
      id: "ninja-frontier",
      label: "Mercado Fantasma",
      shortLabel: "Mercado",
      description:
        "Uma mistura de bazar retrô e posto avançado, focada em props, UI, kits e lotes prontos para jogos futuros.",
      spriteKit: "cowboy",
      focusLabel: "garimpo visual, kits e material de jogo"
    }
  ],
  supportCatalog: ninjaSupportCatalog,
  terminalWelcome:
    "Escritório de Ninjas em ronda total. Cinquenta especialistas estão abastecendo o cofre de sprites 2D com referências legais, material curado e peças originais para jogos futuros.",
  reducedMotionMessage:
    "Movimento reduzido ativo: o Escritório de Ninjas continua disponível nos perfis, no terminal e no inventário do cofre.",
  smallTalk: [
    "O acervo cresce melhor quando cada lote já entra com destino provável.",
    "Sprite sem licença confirmada não pisa no cofre ninja.",
    "A gente caça referência, limpa, organiza e cria o que falta.",
    "O objetivo não é acumular arquivo; é montar uma biblioteca que resolva jogo de verdade.",
    "Cada coleta boa economiza dias de retrabalho no futuro.",
    "O cofre ninja precisa responder a personagem, cenário, UI, VFX e pitch sem travar ninguém.",
    "Quanto melhor a tag, mais rápido um projeto nasce.",
    "Uma biblioteca própria forte começa com curadoria dura."
  ],
  roomSpots: {
    ceo: [
      { x: 92, y: 150, task: "definindo o próximo lote prioritário do cofre ninja", pauseMs: 1800 },
      { x: 150, y: 150, task: "reordenando a fila dos ninjas por categoria de sprite", pauseMs: 1600 },
      { x: 120, y: 182, task: "mapeando faltas do acervo para personagens, UI e cenários", pauseMs: 1700 },
      { x: 182, y: 182, task: "revisando licença e origem de um pacote recém-chegado", pauseMs: 1500 },
      { x: 214, y: 150, task: "arrumando o manifesto e a espinha dorsal do cofre", pauseMs: 1600 },
      { x: 246, y: 182, task: "checando DNS, SSL e rota publica sob chamada direta do CEO", pauseMs: 1700 }
    ],
    news: [
      { x: 282, y: 132, task: "garimpando personagens com silhueta forte", pauseMs: 1400 },
      { x: 352, y: 132, task: "filtrando spritesheets com loops úteis", pauseMs: 1400 },
      { x: 422, y: 132, task: "organizando classes e arquétipos do acervo", pauseMs: 1400 },
      { x: 492, y: 132, task: "separando variantes e skins reaproveitáveis", pauseMs: 1400 },
      { x: 316, y: 172, task: "catalogando chefes e inimigos com leitura de ameaça", pauseMs: 1500 },
      { x: 386, y: 172, task: "mapeando cidade, rua e fachada para jogos 2D", pauseMs: 1400 },
      { x: 456, y: 172, task: "curando florestas, chão e obstáculos naturais", pauseMs: 1400 },
      { x: 526, y: 172, task: "selecionando interiores e dungeons modulares", pauseMs: 1500 },
      { x: 338, y: 204, task: "caçando painéis e laboratórios sci-fi", pauseMs: 1300 },
      { x: 408, y: 204, task: "montando um lote retrô de bares, lojas e arcades", pauseMs: 1300 }
    ],
    subpages: [
      { x: 618, y: 126, task: "puxando props e objetos de cena para o cofre", pauseMs: 1400 },
      { x: 692, y: 126, task: "garimpando pickups e colecionáveis de leitura rápida", pauseMs: 1400 },
      { x: 766, y: 126, task: "filtrando armas e gadgets com silhueta forte", pauseMs: 1400 },
      { x: 840, y: 126, task: "mapeando veículos, motos e naves 2D", pauseMs: 1400 },
      { x: 884, y: 162, task: "separando partículas e efeitos de impacto", pauseMs: 1400 },
      { x: 618, y: 192, task: "catalogando HUDs e molduras reaproveitáveis", pauseMs: 1500 },
      { x: 692, y: 192, task: "padronizando ícones e sinais do acervo", pauseMs: 1400 },
      { x: 766, y: 192, task: "juntando prompts e botões de interação", pauseMs: 1300 },
      { x: 840, y: 192, task: "fechando biblioteca de bitmap fonts", pauseMs: 1300 },
      { x: 884, y: 226, task: "montando menus, inventários e slots para o cofre", pauseMs: 1500 }
    ],
    design: [
      { x: 96, y: 246, task: "limpando fundo e recortando novos sprites", pauseMs: 1400 },
      { x: 164, y: 246, task: "uniformizando paleta de lotes mistos", pauseMs: 1400 },
      { x: 232, y: 246, task: "corrigindo escala e proporção de personagens e props", pauseMs: 1500 },
      { x: 130, y: 298, task: "reconstruindo loops e sequências de movimento", pauseMs: 1500 },
      { x: 200, y: 298, task: "gerando variantes próprias a partir do acervo legal", pauseMs: 1500 },
      { x: 96, y: 342, task: "desenhando personagem original para tapar lacuna do cofre", pauseMs: 1500 },
      { x: 164, y: 342, task: "criando blocos modulares de cenário próprio", pauseMs: 1500 },
      { x: 232, y: 342, task: "convertendo referência de UI em interface original", pauseMs: 1500 },
      { x: 130, y: 390, task: "desenhando partículas e impactos internos", pauseMs: 1400 },
      { x: 200, y: 390, task: "fechando kits internos prontos para uso futuro", pauseMs: 1400 }
    ],
    review: [
      { x: 376, y: 258, task: "testando legibilidade em tamanho real", pauseMs: 1400 },
      { x: 446, y: 258, task: "checando pivô, grid e encaixe de motor", pauseMs: 1400 },
      { x: 516, y: 258, task: "revisando tags, nomes e busca do cofre", pauseMs: 1400 },
      { x: 410, y: 314, task: "conferindo origem, licença e atribuição", pauseMs: 1500 },
      { x: 486, y: 314, task: "testando integração rápida em mockups de jogo", pauseMs: 1500 }
    ],
    cafe: [
      { x: 640, y: 330, task: "fazendo pausa curta antes do próximo lote", pauseMs: 1700 },
      { x: 714, y: 322, task: "trocando referência e hipótese de uso futuro", pauseMs: 1600 },
      { x: 818, y: 322, task: "fechando conversa rápida sobre o cofre ninja", pauseMs: 1600 }
    ],
    dev: [
      { x: 520, y: 446, task: "mantendo manifesto e índice do cofre atualizados", pauseMs: 1400 },
      { x: 612, y: 446, task: "separando bruto, curado e final no staging", pauseMs: 1400 },
      { x: 704, y: 446, task: "preparando saída limpa para jogos e cenas futuras", pauseMs: 1500 },
      { x: 796, y: 446, task: "automatizando rotinas repetitivas da biblioteca", pauseMs: 1400 },
      { x: 888, y: 446, task: "guardando snapshots e histórico do cofre", pauseMs: 1400 },
      { x: 560, y: 486, task: "testando lotes em combate e ação 2D", pauseMs: 1500 },
      { x: 652, y: 486, task: "validando exploração, cenário e pickup em aventura", pauseMs: 1500 },
      { x: 744, y: 486, task: "puxando rua, obstáculo e veículo para runner e perseguição", pauseMs: 1500 },
      { x: 836, y: 486, task: "observando uso em cozy, farm e simulação leve", pauseMs: 1400 },
      { x: 888, y: 486, task: "montando composições rápidas de pitch visual", pauseMs: 1400 }
    ]
  },
  agents: ninjaSquads.flatMap((squad) =>
    squad.members.map((member) => ({
      room: squad.room,
      role: squad.role,
      speed: member.speed || 7,
      ...member
    }))
  )
};
