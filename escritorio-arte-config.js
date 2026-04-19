const artSupportCatalog = [
  {
    id: "arte-tablet",
    name: "Mesa digitalizadora de pixel art",
    description: "Ajuda o time a estudar silhueta, sprites, tiles e acabamento com mais precisão.",
    price: 78
  },
  {
    id: "arte-map-pack",
    name: "Kit de mapas e tilesets",
    description: "Organiza referências licenciadas para chão, parede, cenário, sala, pub e ambientes jogáveis.",
    price: 64
  },
  {
    id: "arte-engine-lab",
    name: "Bancada de game engine",
    description: "Fortalece estudo de loop, colisão, física, câmera, input, estados e performance.",
    price: 92
  },
  {
    id: "arte-sound-lab",
    name: "Kit de feedback e som",
    description: "Deixa dados, copos, roleta, passos, colisões e menus com resposta mais viva.",
    price: 48
  }
];

const artRoomSpots = {
  ceo: [
    { x: 108, y: 160, task: "coordenando Arte, Game Design, Ninjas e Nerds pela fila mestre de jogos", pauseMs: 1800 },
    { x: 166, y: 162, task: "definindo prioridades de estudo para pixel art, sprites, engine e mapas", pauseMs: 1500 }
  ],
  news: [
    { x: 300, y: 156, task: "puxando informações do site para transformar referências em estudo visual", pauseMs: 1500 },
    { x: 430, y: 156, task: "separando fundamentos de pixel art, paleta, silhueta e animação", pauseMs: 1400 },
    { x: 492, y: 128, task: "anotando o que precisa virar sprite, item, cenário ou efeito", pauseMs: 1300 }
  ],
  subpages: [
    { x: 650, y: 188, task: "planejando mapas, salas, caminhos, hotspots e zonas de colisão", pauseMs: 1500 },
    { x: 784, y: 188, task: "transformando ambiente em mapa modular jogável", pauseMs: 1500 },
    { x: 884, y: 220, task: "alinhando a ponte com o cofre de sprites da equipe Ninja", pauseMs: 1600 }
  ],
  design: [
    { x: 126, y: 250, task: "desenhando personagens, roupas, itens equipáveis e variações", pauseMs: 1300 },
    { x: 214, y: 296, task: "limpando spritesheets, poses, outlines e sombras", pauseMs: 1500 }
  ],
  review: [
    { x: 430, y: 258, task: "testando legibilidade, controles, colisão, física e sensação de jogo", pauseMs: 1300 },
    { x: 512, y: 304, task: "checando se cada sprite funciona em gameplay, não só em vitrine", pauseMs: 1500 }
  ],
  cafe: [
    { x: 640, y: 330, task: "fazendo estudo rápido de referência antes da próxima iteração", pauseMs: 1800 },
    { x: 714, y: 322, task: "trocando notas com Ninjas sobre licença, uso e recorte de asset", pauseMs: 1700 },
    { x: 818, y: 322, task: "revisando mapas e fluxo espacial com café na mão", pauseMs: 1600 }
  ],
  dev: [
    { x: 540, y: 454, task: "programando loop, engine, colisão, física, estados e input", pauseMs: 1500 },
    { x: 720, y: 474, task: "integrando sprites, mapa, sons e regras de gameplay", pauseMs: 1400 },
    { x: 878, y: 458, task: "medindo performance, bugs, playtest e estabilidade", pauseMs: 1300 }
  ]
};

const artPositions = {
  ceo: [
    { x: 96, y: 148 },
    { x: 148, y: 156 },
    { x: 196, y: 184 },
    { x: 122, y: 188 }
  ],
  news: [
    { x: 286, y: 132 },
    { x: 356, y: 132 },
    { x: 426, y: 132 },
    { x: 496, y: 132 },
    { x: 318, y: 172 },
    { x: 388, y: 172 },
    { x: 458, y: 172 },
    { x: 528, y: 172 }
  ],
  subpages: [
    { x: 604, y: 144 },
    { x: 674, y: 144 },
    { x: 744, y: 144 },
    { x: 814, y: 144 },
    { x: 884, y: 164 },
    { x: 638, y: 210 },
    { x: 708, y: 210 },
    { x: 778, y: 210 },
    { x: 850, y: 220 }
  ],
  design: [
    { x: 82, y: 246 },
    { x: 144, y: 246 },
    { x: 206, y: 246 },
    { x: 110, y: 310 },
    { x: 172, y: 310 },
    { x: 234, y: 318 }
  ],
  review: [
    { x: 330, y: 246 },
    { x: 392, y: 246 },
    { x: 454, y: 246 },
    { x: 516, y: 270 },
    { x: 360, y: 320 },
    { x: 430, y: 322 },
    { x: 500, y: 324 }
  ],
  cafe: [
    { x: 610, y: 318 },
    { x: 676, y: 318 },
    { x: 742, y: 318 },
    { x: 808, y: 318 },
    { x: 874, y: 330 }
  ],
  dev: [
    { x: 86, y: 438 },
    { x: 154, y: 438 },
    { x: 222, y: 438 },
    { x: 290, y: 438 },
    { x: 358, y: 438 },
    { x: 426, y: 438 },
    { x: 494, y: 438 },
    { x: 562, y: 438 },
    { x: 630, y: 438 },
    { x: 698, y: 438 },
    { x: 766, y: 438 }
  ]
};

const artDisciplines = [
  ["arte-lead", "Ari Art Lead", "ceo", "ceo", "Direção Design Art e Game Design", "pipeline de arte, programação de jogos e ponte com Ninjas"],
  ["arte-ninja-bridge", "Lia Ponte", "sources", "ceo", "Ponte com Escritório de Ninjas", "triagem de sprites, licenças, cofre visual e uso futuro"],
  ["arte-site-connector", "Dora Conecta", "sources", "ceo", "Conexão de informação do site", "consulta de notícias, referências internas, assets e contexto do portal"],
  ["arte-producer", "Bento Producer", "review", "ceo", "Produção e fila de tarefas", "prioridade, sprint, checklist e entregas de jogo"],
  ["pixel-fundamentals", "Nina Pixel", "pixel", "news", "Fundamentos de pixel art", "silhueta, grid, proporção, outline e leitura em escala pequena"],
  ["palette-master", "Mika Paleta", "design", "news", "Paleta e harmonia", "cor, contraste, sombra, luz e identidade visual dos jogos"],
  ["sprite-anatomy", "Ravi Corpo", "pixel", "news", "Anatomia de sprite", "cabeça, tronco, mãos, poses e construção modular"],
  ["sprite-idle", "Theo Idle", "pixel", "news", "Idle e presença", "pose parada, respiração visual e leitura de personagem"],
  ["walk-cycle", "Iris Walk", "pixel", "news", "Ciclo de caminhada", "walk cycle, corrida, passos e sensação de peso"],
  ["combat-anim", "Caio Action", "games", "news", "Animação de ação", "ataque, impacto, reação, squash e antecipação"],
  ["wearable-items", "Sora Equip", "design", "news", "Itens equipáveis", "roupas, chapéus, acessórios e encaixe no corpo"],
  ["sprite-cleanup", "Jade Clean", "review", "news", "Limpeza de spritesheets", "recorte, transparência, borda limpa e exportação"],
  ["props-artist", "Luna Props", "pixel", "subpages", "Props de jogo", "copos, dados, fichas, cartas, mesas, garrafas e objetos"],
  ["hud-icons", "Beto Ícones", "design", "subpages", "Ícones e HUD", "botões, placas, marcadores, cursores e feedback visual"],
  ["ui-micro", "Tessa UI", "design", "subpages", "Interface de minigames", "menus, prompts, tooltips e telas de rodada"],
  ["tiles-floor", "Otto Piso", "pixel", "subpages", "Tiles de chão", "piso, grade, sujeira, variação e encaixe modular"],
  ["tiles-wall", "Maya Parede", "pixel", "subpages", "Paredes e limites", "paredes, balcões, barreiras e leitura de colisão"],
  ["bar-mapper", "Rafa PubMap", "games", "subpages", "Mapas de bar e cassino", "layout do pub, balcão, mesas, passagem e hotspots"],
  ["office-mapper", "Gabi OfficeMap", "games", "subpages", "Mapas de escritórios", "salas, mesas, corredores, agentes e circulação"],
  ["world-biome", "Juca Bioma", "pixel", "subpages", "Biomas e cenários externos", "rua, floresta, cidade, luz e atmosfera"],
  ["lighting-fx", "Mel Luz", "design", "subpages", "Luzes e efeitos", "RGB, cone de luz, glow, sombra e clima de ambiente"],
  ["particles-fx", "Davi Partícula", "design", "design", "Partículas e impacto", "poeira, brilho, fumaça, colisão e feedback rápido"],
  ["shading", "Cleo Sombra", "design", "design", "Sombreamento pixel", "volume, sombra curta, reflexo e material"],
  ["game-loop", "Iris Loop", "games", "design", "Loop principal", "objetivo, decisão, risco, recompensa e retorno do jogador"],
  ["level-design", "Milo Level", "games", "design", "Level design", "caminho, bloqueio, atalho, foco e aprendizado por espaço"],
  ["map-flow", "Noa Fluxo", "games", "design", "Fluxo de mapa", "entrada, saída, corredor, ponto de interesse e leitura espacial"],
  ["collision", "Otto Colisão", "dev", "review", "Sistema de colisão", "hitbox, parede, mesa, NPC, balcão e bloqueio justo"],
  ["physics", "Lia Física", "dev", "review", "Física de jogo", "atrito, quique, peso, velocidade e resposta de ação"],
  ["controls", "Téo Input", "dev", "review", "Controles e input", "teclado, mouse, toque, foco e resposta de comando"],
  ["camera", "Bia Camera", "dev", "review", "Câmera e enquadramento", "zoom, pan, viewport, spawn e legibilidade"],
  ["engine-arch", "Vera Engine", "dev", "review", "Arquitetura de engine", "loop, render, atualização, camadas e entidades"],
  ["state-machine", "Rui State", "dev", "review", "Máquina de estados", "menu, rodada, animação, resultado e transição"],
  ["npc-ai", "Nico NPC", "dev", "cafe", "NPCs e comportamento", "rotina, fala, clique, missão e presença no cenário"],
  ["interaction-prompts", "Duda Prompt", "design", "cafe", "Prompts de interação", "bolinhas, nomes, ícones, distância e ação clara"],
  ["audio-feedback", "Tom Som", "games", "cafe", "Som e feedback", "dados caindo, copos, roleta, fichas, passos e UI sonora"],
  ["cups-dice", "Kika Dados", "games", "cafe", "Copos e dados dinâmicos", "queda, rolagem, suspense, barulho e resultado visual"],
  ["roulette-feel", "Rex Roleta", "games", "dev", "Roleta com suspense", "giro, desaceleração, ponteiro externo e resultado claro"],
  ["pool-physics", "Sol Sinuca", "dev", "dev", "Física de sinuca", "taco, bola, colisão, atrito e quique legível"],
  ["cards-flow", "Mina Cartas", "games", "dev", "Fluxo de cartas", "blackjack, poker, mão, mesa, troca e leitura de risco"],
  ["manifest", "Bento Manifest", "sources", "dev", "Manifesto de assets", "nome, categoria, licença, status e versão"],
  ["licensing", "Tessa Legal", "sources", "dev", "Licenças e segurança", "uso comercial, origem, restrição e bloqueio de risco"],
  ["spritesheet-export", "Ayla Export", "dev", "dev", "Exportação de spritesheets", "frames, atlas, escala, transparência e cache"],
  ["optimizer", "Igor Otimiza", "dev", "dev", "Otimização visual", "peso, tamanho, sprite atlas, lazy load e performance"],
  ["qa-controls", "Rita QA", "review", "dev", "QA de controles", "bug de clique, foco, teclado, scroll e tela cortada"],
  ["accessibility-games", "Luan Acesso", "review", "dev", "Acessibilidade em jogos", "contraste, instrução, foco, legibilidade e ritmo"],
  ["playtest", "Nara Play", "review", "dev", "Playtest e sensação", "diversão, fricção, clareza, justiça e emoção"],
  ["balance", "Ravi Balance", "sales", "dev", "Balanceamento", "risco, recompensa, apostas, progressão e economia"],
  ["docs", "Luna Docs", "copy", "dev", "Documentação de jogo", "instruções, checklist, handoff e memória de decisão"],
  ["deploy-games", "Dora Deploy", "dev", "dev", "Build e publicação", "deploy, versão, cache, rota, Render e estabilidade"],
  ["map-tools", "Vini MapTool", "dev", "dev", "Ferramentas de mapa", "editor, grade, colisão, coordenadas e exportação"]
];

const roomSlotCursor = {};
function nextArtPosition(room) {
  const slots = artPositions[room] || artPositions.news;
  const cursor = roomSlotCursor[room] || 0;
  roomSlotCursor[room] = cursor + 1;
  return slots[cursor % slots.length];
}

function buildArtAgents() {
  return artDisciplines.map(([id, name, role, room, title, specialty], index) => {
    const spot = nextArtPosition(room);
    return {
      id,
      name,
      role,
      room,
      title,
      specialty,
      description:
        `Especialista do Escritório de Arte dedicado a ${specialty}. Trabalha junto com os Ninjas para transformar referência, sprite e código em jogo mais claro, bonito e jogável.`,
      task: `estudando ${specialty} e aplicando no pipeline de arte e programação de jogos`,
      skills: specialty.split(",").map((item) => item.trim()).slice(0, 4),
      x: spot.x,
      y: spot.y,
      speed: 7 + (index % 4),
      lines: [
        `Estou estudando ${specialty} para melhorar os jogos do portal.`,
        "A regra aqui é aprender, testar no mapa e devolver algo jogável.",
        "Eu cruzo referência do site, cofre Ninja e lógica de engine antes de propor mudança."
      ]
    };
  });
}

window.__OFFICE_CONFIG__ = {
  officeKey: "arte-game-design",
  defaultTheme: "editorial-hq",
  disableNews: false,
  supportIntro:
    "A vaquinha do Escritório de Arte ajuda o time a estudar pixel art, sprites, mapas, engine, colisão, física e som com ferramentas melhores.",
  environments: [
    {
      id: "editorial-hq",
      label: "Ateliê de Pixel Art",
      shortLabel: "Arte",
      description:
        "Base principal do Escritório de Arte: bancada visual, estudos de sprites, mapas e programação de jogos andando juntos.",
      spriteKit: "default",
      focusLabel: "pixel art, sprites e mapas"
    },
    {
      id: "editorial-space",
      label: "Engine Orbital",
      shortLabel: "Engine",
      description:
        "Modo laboratório de engine: foco em loop, colisão, física, câmera, performance e integração de assets.",
      spriteKit: "astronaut",
      focusLabel: "engine, física e programação"
    },
    {
      id: "editorial-west",
      label: "Mapa de Fronteira",
      shortLabel: "Mapa",
      description:
        "Modo cartografia de jogo: estudo de fluxo, tiles, obstáculos, caminhos, hotspots e mapas jogáveis.",
      spriteKit: "cowboy",
      focusLabel: "level design, tiles e colisão"
    }
  ],
  supportCatalog: artSupportCatalog,
  terminalWelcome:
    "Escritório de Arte online. 50 agentes estudam pixel art, sprites, game design, engine, colisão, física, mapas e integração com o cofre Ninja.",
  reducedMotionMessage:
    "Movimento reduzido ativo: os 50 agentes seguem disponíveis nos perfis e no terminal lateral.",
  smallTalk: [
    "Sprite bonito que não encaixa na colisão ainda não está pronto.",
    "O mapa precisa ensinar caminho sem gritar tutorial.",
    "A equipe Ninja traz o cofre; a Arte transforma em linguagem jogável.",
    "Toda animação precisa ter intenção: peso, ritmo e resposta.",
    "Programação de jogo boa deixa o jogador sentir antes de entender.",
    "Se a roleta não dá suspense, falta curva de desaceleração e feedback.",
    "Copos e dados precisam cair, bater e convencer o ouvido.",
    "Um mapa bom tem passagem, bloqueio e recompensa visual.",
    "O site alimenta referência; o escritório transforma isso em estudo aplicado.",
    "A cada ordem do CEO, a equipe separa o que é arte, engine, mapa e QA."
  ],
  roomSpots: artRoomSpots,
  agents: buildArtAgents()
};
