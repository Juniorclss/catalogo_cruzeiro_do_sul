(function () {
  const STORAGE_KEY = "pubpaid_arcade_state_v3";
  const TUTORIAL_SESSION_KEY = "pubpaid_demo_tutorial_seen_v1";
  const DEMO_STAKES = [2, 5, 10, 20, 30, 40, 50, 100];
  const HISTORY_LIMIT = 12;
  const PUBPAID_PVP_POLL_MS = 1800;
  const WORLD = { width: 960, height: 640 };
  const SCENE_HINTS = {
    exterior: "fachada e estrada",
    interior: "dentro do salao"
  };

  const PALETTES = {
    neon: {
      label: "Neon hacker",
      skin: "#f8c79c",
      hair: "#66ecff",
      shirt: "#ff67b5",
      jacket: "#2f244d",
      pants: "#181522",
      accent: "#fff4d6",
      background: "#120d24"
    },
    cowboy: {
      label: "Cowboy digital",
      skin: "#f4c59f",
      hair: "#f5c96b",
      shirt: "#72d8ff",
      jacket: "#48301d",
      pants: "#121118",
      accent: "#fff4d6",
      background: "#20130d"
    },
    lounge: {
      label: "Lounge futurista",
      skin: "#ffd4b3",
      hair: "#80e092",
      shirt: "#7f81ff",
      jacket: "#1a243f",
      pants: "#15111f",
      accent: "#effcff",
      background: "#0f1929"
    },
    street: {
      label: "Street glitch",
      skin: "#f6c09f",
      hair: "#ff7a6a",
      shirt: "#70ebff",
      jacket: "#32161f",
      pants: "#140f17",
      accent: "#fff1dc",
      background: "#1a1019"
    }
  };

  const TABLE_META = {
    pool: {
      label: "Sinuca Real",
      shortLabel: "sinuca",
      description: "Sinuca 9 bolas com luz de bar, carregamento de força e duelo seco valendo o pote da noite.",
      sceneCopy: "O pano verde está aceso, o bar bate no fundo e a próxima tacada pode virar a mesa toda.",
      stakes: DEMO_STAKES
    },
    checkers: {
      label: "Damas Pixel",
      shortLabel: "damas",
      description: "Uma disputa mais estratégica, daquelas que prendem atenção em silêncio.",
      sceneCopy: "O tabuleiro está pronto. Escolha suas jogadas e leia o ritmo da casa.",
      stakes: DEMO_STAKES,
      pvp: true
    },
    chess: {
      label: "Xadrez de Mesa",
      shortLabel: "xadrez",
      description: "Tabuleiro clássico com peças completas, leitura longa e pressão por linhas, colunas e diagonais.",
      sceneCopy: "As peças já estão montadas. Abra espaço, proteja o rei e veja quem domina melhor a mesa.",
      stakes: DEMO_STAKES
    },
    cards21: {
      label: "21 do Bar",
      shortLabel: "21",
      description: "Cartas, leitura de risco e aquela dúvida entre pedir mais uma ou parar.",
      sceneCopy: "As cartas já estão na mesa. Agora é você quem decide até onde vai.",
      stakes: DEMO_STAKES,
      pvp: true
    },
    poker: {
      label: "Poker da Mesa Redonda",
      shortLabel: "poker",
      description: "Draw poker em rodada curta: segure as cartas certas, troque o resto e veja quem fechou a melhor mão.",
      sceneCopy: "A mesa de poker está pronta. Escolha o que segurar, puxe novas cartas e dispute a melhor combinação.",
      stakes: DEMO_STAKES,
      pvp: true
    },
    truco: {
      label: "Truco Paulista",
      shortLabel: "truco",
      description: "Três vazas, vira aberta e manilha móvel num duelo rápido contra a casa.",
      sceneCopy: "A vira já caiu na mesa. Leia a manilha, escolha a carta certa e tente fechar duas das três vazas.",
      stakes: DEMO_STAKES
    },
    dicecups: {
      label: "Copos e Dados",
      shortLabel: "copos",
      description: "Uma mesa para blefe, leitura de clima e um pouco de ousadia.",
      sceneCopy: "Os copos escondem a resposta. Confie no seu palpite e veja no que dá.",
      stakes: DEMO_STAKES,
      pvp: true
    },
    slots: {
      label: "Caça-Níqueis Neon",
      shortLabel: "maquina",
      description: "Uma maquina solo com alavanca, tres rolos e série curta de giros para quem quer arrancar mais de uma rodada da noite.",
      sceneCopy: "A cabine está piscando. Agora a aposta abre uma série curta, não só um giro isolado.",
      stakes: DEMO_STAKES,
      isSolo: true
    },
    roulette: {
      label: "Roleta",
      shortLabel: "roleta",
      description: "Cada lado gira em série curta. Quem vencer mais giros leva a mesa.",
      sceneCopy: "A roleta está pronta para uma melhor de 3. O maior placar fecha a noite.",
      stakes: DEMO_STAKES
    },
    darts: {
      label: "Dardos de Parede",
      shortLabel: "dardos",
      description: "Mire no eixo X e Y do alvo oficial, aceite o desvio do braço e tente fechar mais pontos no tabuleiro real.",
      sceneCopy: "O alvo está preso na parede. Mire com precisão lateral e vertical, porque acertar o centro aqui é raro.",
      stakes: DEMO_STAKES,
      pvp: true
    }
  };

  const HOUSE_OPPONENTS = {
    pool: {
      name: "Nina Cue",
      archetype: "lounge",
      bio: "Lê a mesa com calma e costuma decidir tudo no detalhe."
    },
    checkers: {
      name: "Rex Square",
      archetype: "street",
      bio: "Vê a jogada antes e raramente entrega espaço fácil."
    },
    chess: {
      name: "Mestre Brasa",
      archetype: "cowboy",
      bio: "Joga simples, ocupa o centro cedo e gosta de trocar peça quando está na frente."
    },
    cards21: {
      name: "Luna Deck",
      archetype: "cowboy",
      bio: "Sabe a hora de pedir mais uma e a hora de parar."
    },
    poker: {
      name: "Otto River",
      archetype: "street",
      bio: "Joga fechado, segura cartas fortes e quase nunca entrega a leitura da mão."
    },
    truco: {
      name: "Bia Manilha",
      archetype: "lounge",
      bio: "Conta a vaza pelo olhar e adora crescer quando a vira ajuda."
    },
    dicecups: {
      name: "Maya Cups",
      archetype: "neon",
      bio: "Gosta de blefar pouco e acertar por margem curta."
    },
    slots: {
      name: "Maquina 8-Bit",
      archetype: "neon",
      bio: "Uma cabine da casa que paga rápido quando os simbolos se alinham."
    },
    roulette: {
      name: "Dante Giro",
      archetype: "lounge",
      bio: "Gosta de confiar em uma rodada so e levar no numero mais alto."
    },
    darts: {
      name: "Tuca Mira",
      archetype: "cowboy",
      bio: "Respira curto, mira rapido e costuma acertar o aro certo quando a sala esta barulhenta."
    }
  };

  const POOL_BALL_ORDER = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
  const POOL_BALL_COLORS = {
    cue: "#f5f5f5",
    "1": "#ffd66b",
    "2": "#6aa7ff",
    "3": "#ff7268",
    "4": "#9e7cff",
    "5": "#ff9f52",
    "6": "#5fe09a",
    "7": "#7e4630",
    "8": "#111111",
    "9": "#ffe58a"
  };

  const ROULETTE_WHEEL_ORDER = [
    0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24,
    16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
  ];

  const ROULETTE_RED_NUMBERS = new Set([
    1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36
  ]);

  const ROULETTE_NUMBERS_GRID = [
    [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36],
    [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35],
    [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34]
  ];

  const DRINK_CATALOG = [
    {
      id: "cafe-do-corredor",
      name: "Cafe do Corredor",
      price: 8,
      goodChance: 0.04,
      badChance: 0.02,
      flavor: "Ligado no 220. Quase nao muda a rodada, mas as vezes devolve o foco."
    },
    {
      id: "neon-fizz",
      name: "Neon Fizz",
      price: 16,
      goodChance: 0.06,
      badChance: 0.02,
      flavor: "Refresco brilhante com sorte curta. Bom para tentar uma respirada da casa."
    },
    {
      id: "whisky-8bit",
      name: "Whisky 8-Bit",
      price: 28,
      goodChance: 0.09,
      badChance: 0.03,
      flavor: "Madeira, gelo e um pouco mais de fe no detalhe final."
    },
    {
      id: "ouro-da-casa",
      name: "Ouro da Casa",
      price: 48,
      goodChance: 0.12,
      badChance: 0.03,
      flavor: "O gole premium do salao. Ainda sutil, mas puxa a aleatoriedade mais para o seu lado."
    },
    {
      id: "constelacao-reserva",
      name: "Constelacao Reserva",
      price: 78,
      goodChance: 0.15,
      badChance: 0.04,
      flavor: "A garrafa cara da noite: chance pequena, mas a melhor do cardapio para cair em boa sorte."
    }
  ];

  const VISUAL_UPGRADES = [
    {
      id: "neon-outline",
      name: "Contorno Neon",
      price: 22,
      description: "Adiciona um brilho ciano em volta do personagem dentro do salao."
    },
    {
      id: "gold-jacket",
      name: "Jaqueta Dourada",
      price: 36,
      description: "Troca detalhes do figurino por acentos dourados mais chamativos."
    },
    {
      id: "vip-title",
      name: "Tag VIP",
      price: 52,
      description: "Mostra uma plaquinha VIP no nome do personagem e deixa a presenca mais premium."
    },
    {
      id: "arcade-shades",
      name: "Oculos Arcade",
      price: 26,
      description: "Coloca um visor escuro no avatar para deixar a entrada mais estilosa."
    },
    {
      id: "lucky-hat",
      name: "Chapeu Lucky",
      price: 31,
      description: "Adiciona um chapeu claro no sprite e reforca o visual de jogador da noite."
    }
  ];

  const JUKEBOX_TRACKS = [
    {
      id: "turbo-neon",
      name: "Turbo Neon",
      tempoMs: 228,
      melody: [76, 79, 81, 83, 84, 83, 81, 79, 76, 79, 83, 86, 84, 83, 81, 79],
      bass: [45, 45, 45, 45, 41, 41, 41, 41, 43, 43, 43, 43, 40, 40, 40, 40],
      harmony: [64, 67, 69, 71, 72, 71, 69, 67, 64, 67, 71, 74, 72, 71, 69, 67],
      leadType: "square",
      harmonyType: "triangle",
      bassType: "triangle"
    },
    {
      id: "bar-jump",
      name: "Bar Jump",
      tempoMs: 244,
      melody: [79, 83, 86, 88, 86, 83, 81, 79, 78, 81, 83, 86, 83, 81, 79, 76],
      bass: [43, 43, 46, 46, 41, 41, 45, 45, 38, 38, 43, 43, 41, 41, 38, 38],
      harmony: [67, null, 71, null, 69, null, 67, null, 66, null, 69, null, 67, null, 64, null],
      leadType: "square",
      harmonyType: "sawtooth",
      bassType: "triangle"
    },
    {
      id: "pixel-rush",
      name: "Pixel Rush",
      tempoMs: 258,
      melody: [84, 81, 79, 76, 79, 81, 84, 88, 86, 84, 81, 79, 81, 84, 86, 88],
      bass: [40, 40, 43, 43, 45, 45, 40, 40, 38, 38, 41, 41, 43, 43, 45, 45],
      harmony: [72, 69, 67, 64, 67, 69, 72, 76, 74, 72, 69, 67, 69, 72, 74, 76],
      leadType: "square",
      harmonyType: "triangle",
      bassType: "triangle"
    },
    {
      id: "coin-combo",
      name: "Coin Combo",
      tempoMs: 236,
      melody: [76, 76, 79, 83, 81, 79, 76, 74, 76, 79, 83, 86, 83, 79, 76, 74],
      bass: [45, 45, 45, 45, 38, 38, 38, 38, 43, 43, 43, 43, 40, 40, 40, 40],
      harmony: [64, null, 67, null, 69, null, 67, null, 64, null, 67, null, 71, null, 67, null],
      leadType: "square",
      harmonyType: "sine",
      bassType: "triangle"
    },
    {
      id: "final-boss-bar",
      name: "Final Boss Bar",
      tempoMs: 268,
      melody: [71, 74, 78, 81, 79, 78, 76, 74, 73, 76, 79, 83, 81, 79, 78, 76],
      bass: [36, 36, 41, 41, 43, 43, 38, 38, 35, 35, 40, 40, 41, 41, 38, 38],
      harmony: [59, 62, 66, 69, 67, 66, 64, 62, 61, 64, 67, 71, 69, 67, 66, 64],
      leadType: "sawtooth",
      harmonyType: "triangle",
      bassType: "square"
    }
  ];

  const INTERIOR_NPC_BLUEPRINTS = [
    {
      id: "bia-lounge",
      name: "Bia Lounge",
      archetype: "lounge",
      x: 360,
      y: 248,
      zone: { x: 344, y: 236, w: 32, h: 24 },
      behavior: "fixed",
      facing: "down",
      prop: "drink",
      lines: [
        "No 21, pare no 18 se a mao vier limpa.",
        "A cantora ajuda mais quem ja perdeu uma rodada.",
        "Blefe curto funciona melhor nos copos.",
        "Nao gaste tudo cedo. O pub vira depois.",
        "Hoje o balcão está mais fofoqueiro que a mesa.",
        "Tem gente que veio jogar e acabou ficando pela conversa."
      ]
    },
    {
      id: "duda-check",
      name: "Duda Check",
      archetype: "neon",
      x: 434,
      y: 520,
      zone: { x: 420, y: 508, w: 30, h: 22 },
      behavior: "fixed",
      facing: "down",
      prop: "drink",
      lines: [
        "Damas premia paciencia. Nao corra para virar dama.",
        "Aposta baixa compra mais leitura de mesa.",
        "Revanche boa nasce depois de derrota curta.",
        "Essa mesa já viu amizade acabar por uma dama torta.",
        "Quem bate a mão na mesa antes da hora geralmente perde."
      ]
    },
    {
      id: "tito-copo",
      name: "Tito Copo",
      archetype: "cowboy",
      x: 824,
      y: 330,
      zone: { x: 808, y: 316, w: 28, h: 24 },
      behavior: "fixed",
      facing: "left",
      prop: "drink",
      lines: [
        "Nos copos, o centro costuma mentir menos.",
        "Bebida ajuda pouco. Palpite ruim continua ruim.",
        "Se a rodada alongar, a casa entrega sinais.",
        "Olhe o ritmo antes de subir a entrada.",
        "O povo jura que entende os copos, mas quase sempre chuta.",
        "Se a mesa ficou silenciosa, alguém aprontou."
      ]
    },
    {
      id: "rex-barra",
      name: "Rex Barra",
      archetype: "street",
      x: 318,
      y: 518,
      zone: { x: 280, y: 490, w: 86, h: 46 },
      behavior: "wander",
      facing: "right",
      prop: "drink",
      lines: [
        "O poker cresce quando voce segura so o necessario.",
        "Slot paga mais quando voce aguenta a serie curta.",
        "Entrada alta sem leitura vira presente pra casa.",
        "Quem fala alto no balcão normalmente está blefando.",
        "Bar cheio sempre inventa um especialista por minuto."
      ]
    },
    {
      id: "garcom-vito",
      name: "Garçom",
      archetype: "cowboy",
      x: 302,
      y: 156,
      zone: { x: 292, y: 148, w: 24, h: 18 },
      behavior: "fixed",
      facing: "down",
      prop: "bottle",
      role: "bartender",
      lines: [
        "Chegue no balcao. Eu recebo o pedido e deixo a proxima rodada pronta.",
        "Bebida da sorte existe, mas so muda detalhe.",
        "Quer lobby rapido? Eu abro qualquer mesa daqui.",
        "Se pedir gelo demais, eu já sei que perdeu rodada.",
        "Aqui no balcão eu ouço aposta, desculpa e promessa."
      ]
    },
    {
      id: "lito-copos",
      name: "Lito Copos",
      archetype: "lounge",
      x: 770,
      y: 148,
      zone: { x: 752, y: 138, w: 34, h: 16 },
      behavior: "fixed",
      facing: "down",
      prop: "glasses",
      role: "tips",
      lines: [
        "Sinuca pede forca menor. Mesa cheia espalha melhor.",
        "No caca-niqueis, fruta repetida vale mais que sino solto.",
        "Poker forte troca no maximo tres. Ganancia desmonta a mao.",
        "Roleta boa e serie. Nao trate um giro como final.",
        "Metade desse pub sobrevive de dica errada dada com confiança.",
        "Todo mundo aqui diz que tem método até a mesa virar."
      ]
    },
    {
      id: "nina-bar",
      name: "Nina Bar",
      archetype: "lounge",
      x: 658,
      y: 214,
      zone: { x: 636, y: 206, w: 54, h: 22 },
      behavior: "wander",
      facing: "right",
      prop: "drink",
      lines: [
        "A jukebox nao ganha por voce, mas muda seu ritmo.",
        "Se o pub acalmar, aproveite para subir a aposta.",
        "Quando a música acerta, até derrota parece estilosa.",
        "Tem noite que a trilha vale mais que o prêmio."
      ]
    },
    {
      id: "caio-palco",
      name: "Caio Palco",
      archetype: "street",
      x: 706,
      y: 236,
      zone: { x: 688, y: 220, w: 44, h: 28 },
      behavior: "wander",
      facing: "left",
      prop: "drink",
      lines: [
        "A cantora puxou o salão hoje, olha o povo colando no palco.",
        "Tem noite que a melhor mesa e so a que deixa voce enxergar tudo.",
        "Quando o bar enche, ate blefe ruim parece corajoso.",
        "O povo do palco comenta mais jogo que quem está jogando.",
        "Se alguém apontou para a roleta, já começou discussão."
      ]
    },
    {
      id: "maya-roulette",
      name: "Maya Roulette",
      archetype: "neon",
      x: 722,
      y: 476,
      zone: { x: 700, y: 460, w: 62, h: 34 },
      behavior: "wander",
      facing: "right",
      prop: "drink",
      lines: [
        "A roleta gira melhor quando a galera para de gritar o obvio.",
        "Eu vim pela conversa e fiquei pela ultima rodada.",
        "Mesa cheia faz o pub parecer vivo de verdade.",
        "Sempre tem alguém jurando que o próximo giro vem limpo.",
        "Roleta chama superstição como luz chama mariposa."
      ]
    },
    {
      id: "otto-sinuca",
      name: "Otto Sinuca",
      archetype: "cowboy",
      x: 176,
      y: 182,
      zone: { x: 118, y: 154, w: 96, h: 42 },
      behavior: "wander",
      facing: "right",
      prop: "hat",
      lines: [
        "Encosta aqui, a sinuca hoje ta chamando conversa longa.",
        "Tem noite que o taco acerta mais quando o salão para para olhar.",
        "Quem chega cedo pega a mesa, quem fica tarde pega as historias.",
        "O bar só esquenta de verdade quando começa aposta besta.",
        "Sinuca boa é a que rende história antes do prêmio."
      ]
    },
    {
      id: "luna-cards",
      name: "Luna Cards",
      archetype: "lounge",
      x: 248,
      y: 468,
      zone: { x: 214, y: 434, w: 64, h: 54 },
      behavior: "wander",
      facing: "down",
      prop: "drink",
      lines: [
        "O vinte e um lotou, mas metade do salão veio mesmo foi pra fofocar.",
        "Se ouvir duas mesas ao mesmo tempo, ja entende o clima da casa.",
        "Aqui dentro sempre tem alguem prometendo a ultima rodada.",
        "Essa mesa de cartas já ouviu mais segredos que o balcão.",
        "No bar, ninguém vai embora na hora que fala que vai."
      ]
    }
  ];

  const INTERIOR_DANCE_COUPLES = [
    {
      id: "dance-couple-a",
      x: 742,
      y: 154,
      left: "lounge",
      right: "cowboy",
      glow: "#ff62bd"
    },
    {
      id: "dance-couple-b",
      x: 794,
      y: 188,
      left: "neon",
      right: "street",
      glow: "#70ebff"
    }
  ];

  const EXTERIOR_WALK_ZONES = [
    { x: 0, y: 500, w: 960, h: 140 },
    { x: 392, y: 396, w: 176, h: 118 }
  ];

  const INTERIOR_BLOCKS = [
    { x: 24, y: 76, w: 196, h: 146, hard: true },
    { x: 242, y: 72, w: 348, h: 132, hard: true },
    { x: 624, y: 72, w: 194, h: 132, hard: true },
    { x: 776, y: 74, w: 168, h: 152, hard: true },
    { x: 22, y: 220, w: 228, h: 164, hard: true },
    { x: 412, y: 190, w: 220, h: 178, hard: true },
    { x: 736, y: 260, w: 208, h: 152, hard: true },
    { x: 18, y: 398, w: 230, h: 166, hard: true },
    { x: 296, y: 418, w: 92, h: 154 },
    { x: 552, y: 418, w: 24, h: 154 },
    { x: 680, y: 462, w: 170, h: 112, hard: true },
    { x: 840, y: 420, w: 104, h: 170 }
  ];

  const INTERACTIONS = {
    exterior: [
      {
        id: "front-door",
        type: "door",
        label: "Entrada principal",
        venueKey: "door",
        x: 480,
        y: 430,
        radius: 86
      }
    ],
    interior: [
      {
        id: "pool",
        type: "game",
        gameId: "pool",
        label: TABLE_META.pool.label,
        venueKey: "pool",
        x: 126,
        y: 170,
        radius: 78
      },
      {
        id: "checkers",
        type: "game",
        gameId: "checkers",
        label: TABLE_META.checkers.label,
        venueKey: "checkers",
        x: 190,
        y: 332,
        radius: 92
      },
      {
        id: "chess",
        type: "game",
        gameId: "chess",
        label: TABLE_META.chess.label,
        venueKey: "chess",
        x: 198,
        y: 544,
        radius: 102
      },
      {
        id: "cards21",
        type: "game",
        gameId: "cards21",
        label: TABLE_META.cards21.label,
        venueKey: "cards21",
        x: 286,
        y: 456,
        radius: 72
      },
      {
        id: "poker",
        type: "game",
        gameId: "poker",
        label: TABLE_META.poker.label,
        venueKey: "poker",
        x: 424,
        y: 495,
        radius: 82
      },
      {
        id: "truco",
        type: "game",
        gameId: "truco",
        label: TABLE_META.truco.label,
        venueKey: "truco",
        x: 666,
        y: 456,
        radius: 74
      },
      {
        id: "dicecups",
        type: "game",
        gameId: "dicecups",
        label: TABLE_META.dicecups.label,
        venueKey: "dicecups",
        x: 796,
        y: 306,
        radius: 78
      },
      {
        id: "slots",
        type: "game",
        gameId: "slots",
        label: TABLE_META.slots.label,
        venueKey: "slots",
        x: 660,
        y: 174,
        radius: 58
      },
      {
        id: "roulette",
        type: "game",
        gameId: "roulette",
        label: TABLE_META.roulette.label,
        venueKey: "roulette",
        x: 790,
        y: 164,
        radius: 64
      },
      {
        id: "wall-darts",
        type: "game",
        gameId: "darts",
        label: TABLE_META.darts.label,
        venueKey: "darts",
        x: 884,
        y: 156,
        radius: 58
      },
      {
        id: "stage",
        type: "stage",
        label: "Cantora do palco",
        venueKey: "stage",
        x: 860,
        y: 150,
        radius: 78
      },
      {
        id: "bartender-shop",
        type: "shop",
        label: "Garçom",
        venueKey: "shop",
        x: 302,
        y: 156,
        radius: 92
      },
      {
        id: "waiter-tips",
        type: "tips",
        label: "Garcom dos copos",
        venueKey: "waiter",
        x: 772,
        y: 148,
        radius: 84
      },
      {
        id: "jukebox",
        type: "jukebox",
        label: "Jukebox",
        venueKey: "jukebox",
        x: 854,
        y: 506,
        radius: 80
      },
      {
        id: "back-door",
        type: "exit",
        label: "Porta do salao",
        venueKey: "door",
        x: 480,
        y: 592,
        radius: 78
      }
    ]
  };

  const refs = {
    sceneCanvas: document.querySelector("[data-scene-canvas]"),
    sceneTitle: document.querySelector("[data-scene-title]"),
    sceneHint: document.querySelector("[data-scene-hint]"),
    sceneNearby: document.querySelector("[data-scene-nearby]"),
    sceneNearbyNote: document.querySelector("[data-scene-nearby-note]"),
    scenePrompt: document.querySelector("[data-scene-prompt]"),
    sceneDescription: document.querySelector("[data-scene-description]"),
    hudCoins: document.querySelector("[data-hud-coins]"),
    avatarCanvas: document.querySelector("[data-avatar-canvas]"),
    profileName: document.querySelector("[data-profile-name]"),
    profileRole: document.querySelector("[data-profile-role]"),
    profileMotto: document.querySelector("[data-profile-motto]"),
    splashPlayerBadge: document.querySelector("[data-splash-player-badge]"),
    splashPlayerAvatar: document.querySelector("[data-splash-player-avatar]"),
    splashPlayerKicker: document.querySelector("[data-splash-player-kicker]"),
    splashPlayerName: document.querySelector("[data-splash-player-name]"),
    splashPlayerNote: document.querySelector("[data-splash-player-note]"),
    splashEntryRoad: document.querySelector("[data-splash-entry-road]"),
    splashEntryTitle: document.querySelector("[data-splash-entry-title]"),
    splashEntryNote: document.querySelector("[data-splash-entry-note]"),
    statCoins: document.querySelector("[data-stat-coins]"),
    statWins: document.querySelector("[data-stat-wins]"),
    statLosses: document.querySelector("[data-stat-losses]"),
    statBest: document.querySelector("[data-stat-best]"),
    profileUpgrades: document.querySelector("[data-profile-upgrades]"),
    focusTitle: document.querySelector("[data-focus-title]"),
    focusCopy: document.querySelector("[data-focus-copy]"),
    focusMeta: document.querySelector("[data-focus-meta]"),
    focusScene: document.querySelector("[data-focus-scene]"),
    focusStakes: document.querySelector("[data-focus-stakes]"),
    focusAction: document.querySelector("[data-focus-action]"),
    historyList: document.querySelector("[data-history-list]"),
    audioButtons: Array.from(document.querySelectorAll("[data-audio-toggle]")),
    openTutorialButtons: Array.from(document.querySelectorAll("[data-open-tutorial]")),
    openProfileButtons: Array.from(document.querySelectorAll("[data-open-profile]")),
    resetButtons: Array.from(document.querySelectorAll("[data-reset-demo]")),
    enterGameButtons: Array.from(document.querySelectorAll("[data-enter-game]")),
    exitGameButtons: Array.from(document.querySelectorAll("[data-exit-game]")),
    toggleGamePanelButtons: Array.from(document.querySelectorAll("[data-toggle-night-panel]")),
    touchMoveButtons: Array.from(document.querySelectorAll("[data-touch-move]")),
    touchActionButtons: Array.from(document.querySelectorAll("[data-touch-action]")),
    venueCards: Array.from(document.querySelectorAll("[data-venue-card]")),
    topActions: document.querySelector(".pubpaid-top-actions"),
    topMenu: document.querySelector("[data-top-menu]"),
    topMenuToggle: document.querySelector("[data-top-menu-toggle]"),
    topMenuPanel: document.querySelector("[data-top-menu-panel]"),
    profileModal: document.querySelector("[data-profile-modal]"),
    profileForm: document.querySelector("[data-profile-form]"),
    profileFeedback: document.querySelector("[data-profile-feedback]"),
    depositAmount: document.querySelector("[data-pubpaid-deposit-amount]"),
    depositStepAmount: document.querySelector('[data-pubpaid-step="amount"]'),
    depositStepName: document.querySelector('[data-pubpaid-step="name"]'),
    depositStepQr: document.querySelector('[data-pubpaid-step="qr"]'),
    depositStepConfirm: document.querySelector('[data-pubpaid-step="confirm"]'),
    depositQr: document.querySelector("[data-pubpaid-deposit-qr]"),
    depositorField: document.querySelector("[data-pubpaid-depositor-field]"),
    depositorName: document.querySelector("[data-pubpaid-depositor-name]"),
    depositFeedback: document.querySelector("[data-pubpaid-deposit-feedback]"),
    withdrawAmount: document.querySelector("[data-pubpaid-withdraw-amount]"),
    withdrawFeedback: document.querySelector("[data-pubpaid-withdraw-feedback]"),
    advanceDepositAmountButton: document.querySelector("[data-pubpaid-advance-amount]"),
    generateDepositButton: document.querySelector("[data-pubpaid-generate-deposit]"),
    registerDepositButton: document.querySelector("[data-pubpaid-register-deposit]"),
    requestWithdrawalButton: document.querySelector("[data-pubpaid-request-withdrawal]"),
    doorModal: document.querySelector("[data-door-modal]"),
    doorChoiceButtons: Array.from(document.querySelectorAll("[data-door-choice]")),
    badEndingModal: document.querySelector("[data-bad-ending-modal]"),
    badEndingCanvas: document.querySelector("[data-bad-ending-canvas]"),
    restartBadEndingButton: document.querySelector("[data-restart-bad-ending]"),
    tutorialModal: document.querySelector("[data-tutorial-modal]"),
    tutorialCanvas: document.querySelector("[data-tutorial-canvas]"),
    gameModal: document.querySelector("[data-game-modal]"),
    gameKicker: document.querySelector("[data-game-kicker]"),
    gameTitle: document.querySelector("[data-game-title]"),
    gameSubtitle: document.querySelector("[data-game-subtitle]"),
    gameHost: document.querySelector("[data-game-host]"),
    shopModal: document.querySelector("[data-shop-modal]"),
    shopHost: document.querySelector("[data-shop-host]"),
    waiterModal: document.querySelector("[data-waiter-modal]"),
    jukeboxModal: document.querySelector("[data-jukebox-modal]"),
    jukeboxHost: document.querySelector("[data-jukebox-host]")
  };

  const sceneCtx = refs.sceneCanvas?.getContext("2d");
  const depositState = {
    amount: null,
    txid: "",
    qrReady: false,
    locked: false,
    pendingId: "",
    stage: "amount"
  };
  if (sceneCtx) sceneCtx.imageSmoothingEnabled = false;
  const badEndingCtx = refs.badEndingCanvas?.getContext("2d");
  if (badEndingCtx) badEndingCtx.imageSmoothingEnabled = false;
  const tutorialCtx = refs.tutorialCanvas?.getContext("2d");
  if (tutorialCtx) tutorialCtx.imageSmoothingEnabled = false;

  const images = {
    exterior: new Image(),
    interior: new Image(),
    bartenderTorso: new Image(),
    stageSinger: new Image()
  };

  const runtime = {
    scene: "exterior",
    prompt: null,
    notes: [],
    noteTimer: 0,
    npcs: [],
    exteriorWalkers: [],
    exteriorTraffic: [],
    npcBubbleTimer: 0,
    npcBubbles: [],
    streetBubbles: [],
    streetBubbleTimer: 0,
    singerBursts: [],
    activeGame: null,
    pvpPollTimer: 0,
    keys: new Set(),
    touchMove: "",
    lastFrame: performance.now(),
    rafId: 0,
    message: {
      text: "",
      expiresAt: 0
    },
    badEndingStartedAt: 0,
    badEndingGame: {
      active: false,
      status: "idle",
      lane: 1,
      targetLane: 1,
      speed: 160,
      boost: 0,
      distance: 0,
      obstacleTimer: 0,
      obstacles: [],
      catchMeter: 0.22,
      hitFlash: 0,
      lastCreditLossAt: 0
    },
    tutorialStartedAt: 0,
    gameTimer: null,
    profileEntryMode: false,
    demoMode: false,
    gameMode: false,
    nightPanelOpen: false,
    poolRefs: {
      canvas: null,
      ctx: null,
      meter: null,
      angleSlider: null,
      chargeButton: null,
      pointerInside: false
    },
    player: {
      x: 480,
      y: 548,
      facing: "up",
      walkFrame: 0,
      walkClock: 0,
      moving: false,
      path: [],
      pendingInteraction: null
    },
    audio: {
      enabled: true,
      ctx: null,
      timer: null,
      step: 0,
      currentTrackIndex: 0,
      trafficTimer: 0,
      trafficCooldown: randomBetween(1.6, 3.8)
    }
  };

  let state = loadState();

  function createInitialState() {
    return {
      profile: {
        registered: false,
        avatarReady: false,
        name: "",
        archetype: "neon",
        motto: "",
        favorite: "pool",
        bonusClaimed: false,
        authProvider: "",
        googleSub: "",
        googleEmail: "",
        googlePicture: "",
        starterCreditsRevoked: false
      },
      wallet: {
        coins: 0,
        wins: 0,
        losses: 0,
        bestWin: 0
      },
      shop: {
        activeDrinkId: "",
        drinkInventory: {},
        ownedUpgrades: []
      },
      secrets: {
        singerCharm: 0
      },
      history: []
    };
  }

  function loadState() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return createInitialState();
      const parsed = JSON.parse(raw);
      const nextState = {
        profile: {
          ...createInitialState().profile,
          ...(parsed?.profile || {})
        },
        wallet: {
          ...createInitialState().wallet,
          ...(parsed?.wallet || {})
        },
        shop: {
          ...createInitialState().shop,
          ...(parsed?.shop || {}),
          drinkInventory: {
            ...createInitialState().shop.drinkInventory,
            ...(parsed?.shop?.drinkInventory || {})
          },
          ownedUpgrades: Array.isArray(parsed?.shop?.ownedUpgrades) ? parsed.shop.ownedUpgrades.slice(0, 12) : []
        },
        secrets: {
          ...createInitialState().secrets,
          ...(parsed?.secrets || {})
        },
        history: Array.isArray(parsed?.history) ? parsed.history.slice(0, HISTORY_LIMIT) : []
      };
      if (!Object.prototype.hasOwnProperty.call(parsed?.profile || {}, "avatarReady") && nextState.profile.registered) {
        nextState.profile.avatarReady = true;
      }
      if (nextState.profile.avatarReady) {
        nextState.profile.registered = true;
      }
      if (nextState.profile.bonusClaimed && !nextState.profile.starterCreditsRevoked) {
        nextState.wallet.coins = Math.max(0, clampInteger(nextState.wallet.coins) - 100);
        nextState.profile.starterCreditsRevoked = true;
      }
      nextState.wallet.coins = 0;
      return nextState;
    } catch (error) {
      return createInitialState();
    }
  }

  function saveState() {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function init() {
    preloadImages().then(() => {
      runtime.npcs = createInteriorNpcs();
      runtime.exteriorWalkers = createExteriorWalkers();
      runtime.exteriorTraffic = createExteriorTraffic();
      closeTopMenu();
      resetScenePosition();
      fillProfileForm();
      renderAll();
      bindEvents();
      syncExistingGoogleAuth();
      ensureMusicPlayback();
      runtime.lastFrame = performance.now();
      runtime.rafId = window.requestAnimationFrame(loop);
      scheduleTutorialIntro();
    });
  }

  function scheduleTutorialIntro() {
    if (!shouldAutoOpenTutorial()) return;
    window.setTimeout(() => {
      if (
        refs.tutorialModal?.hidden === false ||
        refs.profileModal.hidden === false ||
        refs.doorModal.hidden === false ||
        refs.badEndingModal.hidden === false ||
        refs.gameModal.hidden === false ||
        refs.shopModal?.hidden === false ||
        refs.waiterModal?.hidden === false
      ) {
        return;
      }
      openTutorialModal();
    }, 260);
  }

  function shouldAutoOpenTutorial() {
    try {
      return window.sessionStorage.getItem(TUTORIAL_SESSION_KEY) !== "1";
    } catch (_error) {
      return true;
    }
  }

  function rememberTutorialSeen() {
    try {
      window.sessionStorage.setItem(TUTORIAL_SESSION_KEY, "1");
    } catch (_error) {
      // ignore storage failures
    }
  }

  function preloadImages() {
    return Promise.all([
      loadImage(images.exterior, "./assets/pubpaid-exterior-v3.png"),
      loadImage(images.interior, "./assets/pubpaid-interior-v5.png"),
      loadImage(images.bartenderTorso, "./assets/pubpaid-bartender-counter-v1.png"),
      loadImage(images.stageSinger, "./assets/pubpaid-stage-singer-v1.png")
    ]);
  }

  function loadImage(image, src) {
    return new Promise((resolve) => {
      image.onload = resolve;
      image.onerror = resolve;
      image.src = src;
    });
  }

  function bindEvents() {
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    document.addEventListener("click", handleClick);
    window.addEventListener("blur", clearPressedDirections);
    window.addEventListener("catalogo:google-auth", handleCatalogoGoogleAuth);
    refs.profileForm?.addEventListener("submit", handleProfileSubmit);
    refs.advanceDepositAmountButton?.addEventListener("click", () => {
      unlockDepositNameStep();
    });
    refs.generateDepositButton?.addEventListener("click", () => {
      void generatePubPaidDepositQr(true);
    });
    refs.registerDepositButton?.addEventListener("click", () => {
      void registerPubPaidDeposit();
    });
    refs.requestWithdrawalButton?.addEventListener("click", () => {
      void requestPubPaidWithdrawal();
    });
    refs.depositAmount?.addEventListener("change", () => {
      resetDepositQrState("Valor alterado. Gere um novo QR Code para esse deposito.");
      unlockDepositNameStep();
    });
    refs.depositorName?.addEventListener("input", () => {
      if (String(refs.depositorName?.value || "").trim().length >= 3) {
        unlockDepositQrStep();
      }
    });

    refs.touchMoveButtons.forEach((button) => {
      const direction = button.dataset.touchMove;
      button.addEventListener("pointerdown", (event) => {
        event.preventDefault();
        runtime.touchMove = direction || "";
      });
      button.addEventListener("pointerup", () => {
        runtime.touchMove = "";
      });
      button.addEventListener("pointercancel", () => {
        runtime.touchMove = "";
      });
      button.addEventListener("pointerleave", () => {
        runtime.touchMove = "";
      });
    });

    refs.touchActionButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        triggerInteraction();
      });
    });

    refs.sceneCanvas?.addEventListener("click", handleSceneCanvasClick);
  }

  function ensureMusicPlayback() {
    if (!runtime.audio.enabled || runtime.audio.timer) return;
    startMusic();
  }

  function isTypingField(target) {
    if (!(target instanceof HTMLElement)) return false;
    if (target.isContentEditable) return true;
    const tagName = String(target.tagName || "").toUpperCase();
    return tagName === "INPUT" || tagName === "TEXTAREA" || tagName === "SELECT";
  }

  function handleKeyDown(event) {
    if (event.repeat) return;
    ensureMusicPlayback();

    if (refs.badEndingModal?.hidden === false) {
      if (handleBadEndingKey(event.key)) {
        event.preventDefault();
        return;
      }
    }

    if (event.key === "Escape") {
      if (refs.tutorialModal?.hidden === false) {
        closeModal("tutorial");
      } else if (!refs.profileModal.hidden) {
        closeModal("profile");
      } else if (!refs.doorModal.hidden) {
        closeModal("door");
      } else if (!refs.badEndingModal.hidden) {
        closeModal("bad-ending");
      } else if (!refs.gameModal.hidden) {
        closeGameModal();
      } else if (refs.shopModal?.hidden === false) {
        closeShopModal();
      } else if (refs.waiterModal?.hidden === false) {
        closeWaiterModal();
      } else if (refs.jukeboxModal?.hidden === false) {
        closeJukeboxModal();
      } else if (runtime.nightPanelOpen) {
        toggleNightPanel(false);
      } else if (runtime.gameMode) {
        exitGameExperience();
      }
      return;
    }

    if (isTypingField(event.target)) {
      return;
    }

    if (
      refs.tutorialModal?.hidden === false ||
      refs.profileModal.hidden === false ||
      refs.doorModal.hidden === false ||
      refs.badEndingModal.hidden === false ||
      refs.gameModal.hidden === false ||
      refs.shopModal?.hidden === false ||
      refs.waiterModal?.hidden === false ||
      refs.jukeboxModal?.hidden === false
    ) {
      if (event.key === " " && activeGameNeedsSpace()) {
        event.preventDefault();
      }
    }

    if (event.key === "e" || event.key === "E" || event.key === "Enter") {
      if (
        !refs.tutorialModal.hidden ||
        !refs.profileModal.hidden ||
        !refs.doorModal.hidden ||
        !refs.badEndingModal.hidden ||
        !refs.gameModal.hidden ||
        refs.shopModal?.hidden === false ||
        refs.waiterModal?.hidden === false ||
        refs.jukeboxModal?.hidden === false
      ) return;
      event.preventDefault();
      triggerInteraction();
      return;
    }

    if (event.key === " " && activeGameNeedsSpace()) {
      event.preventDefault();
      if (runtime.activeGame?.id === "cards21" && runtime.activeGame.screen === "playing") {
        handleCardsAction("hit");
      }
      return;
    }

    const direction = keyToDirection(event.key);
    if (direction) {
      runtime.keys.add(direction);
      event.preventDefault();
    }
  }

  function handleKeyUp(event) {
    if (isTypingField(event.target)) {
      return;
    }
    const direction = keyToDirection(event.key);
    if (direction) {
      runtime.keys.delete(direction);
      event.preventDefault();
    }
  }

  function handleClick(event) {
    ensureMusicPlayback();

    const topMenuToggle = event.target.closest("[data-top-menu-toggle]");
    if (topMenuToggle) {
      toggleTopMenu();
      return;
    }

    if (
      refs.topMenu &&
      refs.topMenu.classList.contains("is-open") &&
      !event.target.closest("[data-top-menu]")
    ) {
      closeTopMenu();
    }

    const enterGameTrigger = event.target.closest("[data-enter-game]");
    if (enterGameTrigger) {
      closeTopMenu();
      enterGameExperience();
      return;
    }

    const enterDemoTrigger = event.target.closest("[data-enter-demo]");
    if (enterDemoTrigger) {
      enterDemoExperience();
      return;
    }

    const exitGameTrigger = event.target.closest("[data-exit-game]");
    if (exitGameTrigger) {
      closeTopMenu();
      exitGameExperience();
      return;
    }

    const toggleGamePanelTrigger = event.target.closest("[data-toggle-night-panel]");
    if (toggleGamePanelTrigger) {
      toggleNightPanel();
      return;
    }

    const profileTrigger = event.target.closest("[data-open-profile]");
    if (profileTrigger) {
      closeTopMenu();
      openProfileModal();
      return;
    }

    const audioTrigger = event.target.closest("[data-audio-toggle]");
    if (audioTrigger) {
      closeTopMenu();
      toggleMusic();
      return;
    }

    const tutorialTrigger = event.target.closest("[data-open-tutorial]");
    if (tutorialTrigger) {
      closeTopMenu();
      openTutorialModal();
      return;
    }

    const resetTrigger = event.target.closest("[data-reset-demo]");
    if (resetTrigger) {
      closeTopMenu();
      resetDemo();
      return;
    }

    const closeModalTrigger = event.target.closest("[data-close-modal]");
    if (closeModalTrigger) {
      const name = closeModalTrigger.dataset.closeModal;
      if (name === "profile") closeModal("profile");
      if (name === "door") closeModal("door");
      if (name === "bad-ending") closeModal("bad-ending");
      if (name === "tutorial") closeModal("tutorial");
      if (name === "game") closeGameModal();
      if (name === "shop") closeShopModal();
      if (name === "waiter") closeWaiterModal();
      if (name === "jukebox") closeJukeboxModal();
      return;
    }

    if (event.target.closest("[data-waiter-open-shop]")) {
      closeWaiterModal();
      openShopModal();
      setWorldMessage("O garcom abriu o cardapio de bebidas e upgrades.", 2200);
      return;
    }

    const doorChoice = event.target.closest("[data-door-choice]");
    if (doorChoice) {
      handleDoorChoice(doorChoice.dataset.doorChoice || "");
      return;
    }

    if (event.target.closest("[data-restart-bad-ending]")) {
      resetBadEndingGame();
      runtime.badEndingStartedAt = performance.now();
      return;
    }

    const focusAction = event.target.closest("[data-focus-action]");
    if (focusAction) {
      triggerInteraction();
      return;
    }

    const venueCard = event.target.closest("[data-venue-card]");
    if (venueCard) {
      handleVenueShortcut(venueCard.dataset.venueCard || "");
      return;
    }

    const stakeButton = event.target.closest("[data-game-stake]");
    if (stakeButton && runtime.activeGame?.screen === "lobby") {
      runtime.activeGame.stake = clampMoney(stakeButton.dataset.gameStake);
      renderGameModal();
      return;
    }

    if (event.target.closest("[data-start-game]")) {
      if (runtime.activeGame?.multiplayer?.enabled) {
        if (runtime.activeGame.id === "checkers") {
          void startCheckersPvpFlow();
        } else if (runtime.activeGame.id === "cards21") {
          void startCards21PvpFlow();
        } else if (runtime.activeGame.id === "dicecups") {
          void startDicecupsPvpFlow();
        } else if (runtime.activeGame.id === "poker") {
          void startPokerPvpFlow();
        } else if (runtime.activeGame.id === "darts") {
          void startDartsPvpFlow();
        }
      } else {
        startActiveGame();
      }
      return;
    }

    if (event.target.closest("[data-close-finished]")) {
      closeGameModal(true);
      return;
    }

    if (event.target.closest("[data-rematch-game]")) {
      rematchCurrentGame();
      return;
    }

    if (event.target.closest("[data-abandon-game]")) {
      abandonActiveGame();
      return;
    }

    const trackButton = event.target.closest("[data-jukebox-track]");
    if (trackButton) {
      selectJukeboxTrack(trackButton.dataset.jukeboxTrack);
      return;
    }

    const shopBuy = event.target.closest("[data-shop-buy]");
    if (shopBuy) {
      handleShopBuy(shopBuy.dataset.shopBuy, shopBuy.dataset.shopType || "");
      return;
    }

    const shopDrink = event.target.closest("[data-shop-drink]");
    if (shopDrink) {
      activateDrink(shopDrink.dataset.shopDrink || "");
      return;
    }

    const quickTable = event.target.closest("[data-open-table]");
    if (quickTable) {
      closeWaiterModal();
      openTableFromShop(quickTable.dataset.openTable || "");
      return;
    }

    const checkersCell = event.target.closest("[data-checkers-cell]");
    if (checkersCell) {
      handleCheckersClick(
        clampInteger(checkersCell.dataset.row),
        clampInteger(checkersCell.dataset.col)
      );
      return;
    }

    const chessCell = event.target.closest("[data-chess-cell]");
    if (chessCell) {
      handleChessClick(
        clampInteger(chessCell.dataset.row),
        clampInteger(chessCell.dataset.col)
      );
      return;
    }

    if (event.target.closest("[data-cards-action='hit']")) {
      handleCardsAction("hit");
      return;
    }

    if (event.target.closest("[data-cards-action='stand']")) {
      handleCardsAction("stand");
      return;
    }

    const pokerToggle = event.target.closest("[data-poker-toggle]");
    if (pokerToggle) {
      handlePokerToggle(clampInteger(pokerToggle.dataset.pokerToggle));
      return;
    }

    if (event.target.closest("[data-poker-draw]")) {
      handlePokerDraw();
      return;
    }

    const trucoPlay = event.target.closest("[data-truco-play]");
    if (trucoPlay) {
      handleTrucoPlay(clampInteger(trucoPlay.dataset.trucoPlay));
      return;
    }

    const diceButton = event.target.closest("[data-dice-guess]");
    if (diceButton) {
      handleDiceGuess(clampInteger(diceButton.dataset.diceGuess));
      return;
    }

    if (event.target.closest("[data-dice-next]")) {
      advanceDiceRound();
      return;
    }

    if (event.target.closest("[data-slot-spin]")) {
      handleSlotsSpin();
      return;
    }

    if (event.target.closest("[data-slot-next]")) {
      advanceSlotsRound();
      return;
    }

    const rouletteChip = event.target.closest("[data-roulette-chip]");
    if (rouletteChip) {
      handleRouletteChipSelect(clampMoney(rouletteChip.dataset.rouletteChip));
      return;
    }

    const rouletteBet = event.target.closest("[data-roulette-bet]");
    if (rouletteBet) {
      handleRouletteBetPlace(rouletteBet.dataset.rouletteBet || "");
      return;
    }

    if (event.target.closest("[data-roulette-clear]")) {
      clearRouletteBets();
      return;
    }

    if (event.target.closest("[data-roulette-spin]")) {
      handleRouletteSpin();
      return;
    }

    if (event.target.closest("[data-roulette-next]")) {
      advanceRouletteRound();
      return;
    }

    const dartsThrow = event.target.closest("[data-darts-throw]");
    if (dartsThrow) {
      handleDartsThrow(dartsThrow.dataset.dartsThrow || "focus");
      return;
    }
  }

  function handleBadEndingKey(key) {
    if (!runtime.badEndingGame.active || runtime.badEndingGame.status !== "running") {
      if ((key === "Enter" || key === " ") && refs.badEndingModal?.hidden === false) {
        resetBadEndingGame();
        runtime.badEndingStartedAt = performance.now();
        return true;
      }
      return false;
    }

    if (key === "ArrowLeft" || key === "a" || key === "A") {
      runtime.badEndingGame.targetLane = Math.max(0, runtime.badEndingGame.targetLane - 1);
      return true;
    }
    if (key === "ArrowRight" || key === "d" || key === "D") {
      runtime.badEndingGame.targetLane = Math.min(3, runtime.badEndingGame.targetLane + 1);
      return true;
    }
    if (key === "ArrowUp" || key === "w" || key === "W" || key === " ") {
      runtime.badEndingGame.boost = Math.min(0.9, runtime.badEndingGame.boost + 0.45);
      runtime.badEndingGame.speed = Math.min(220, runtime.badEndingGame.speed + 18);
      return true;
    }
    return false;
  }

  function handleSceneCanvasClick(event) {
    if (
      refs.tutorialModal.hidden === false ||
      refs.profileModal.hidden === false ||
      refs.doorModal.hidden === false ||
      refs.badEndingModal.hidden === false ||
      refs.gameModal.hidden === false ||
      refs.shopModal?.hidden === false ||
      refs.waiterModal?.hidden === false ||
      refs.jukeboxModal?.hidden === false
    ) {
      return;
    }

    const point = getCanvasPoint(event, refs.sceneCanvas);
    const interaction = getInteractionAtCanvasPoint(point.x, point.y);
    if (!interaction) {
      queuePlayerWalk(point.x, point.y);
      return;
    }

    if (runtime.scene === "interior") {
      const distanceToInteraction = Math.hypot(runtime.player.x - interaction.x, runtime.player.y - interaction.y);
      if (distanceToInteraction <= interaction.radius + 10) {
        clearPlayerWalkPath();
        runtime.prompt = interaction;
        renderSceneHud();
        triggerInteraction(interaction);
        return;
      }

      const standPoint = getInteractionStandPoint(interaction);
      if (!standPoint || !queuePlayerWalk(standPoint.x, standPoint.y, interaction)) {
        return;
      }
      runtime.prompt = interaction;
      renderSceneHud();
      return;
    }

    runtime.prompt = interaction;
    renderSceneHud();
    triggerInteraction(interaction);
  }

  function activeGameNeedsSpace() {
    return runtime.activeGame?.id === "cards21" && runtime.activeGame?.screen === "playing";
  }

  function clearPressedDirections() {
    runtime.keys.clear();
    runtime.touchMove = "";
  }

  function keyToDirection(key) {
    if (key === "ArrowUp" || key === "w" || key === "W") return "up";
    if (key === "ArrowDown" || key === "s" || key === "S") return "down";
    if (key === "ArrowLeft" || key === "a" || key === "A") return "left";
    if (key === "ArrowRight" || key === "d" || key === "D") return "right";
    return "";
  }

  function loop(now) {
    const delta = Math.min((now - runtime.lastFrame) / 1000, 0.033);
    runtime.lastFrame = now;

    updateScene(delta, now);
    renderScene(now);
    renderSceneHud();

    if (runtime.activeGame?.id === "pool" && runtime.activeGame.screen === "playing") {
      updatePoolGame(delta);
      drawPoolTable();
      updatePoolHud();
    }

    if (!refs.badEndingModal.hidden) {
      updateBadEndingGame(delta, now);
      renderBadEndingScene(now);
    }

    if (refs.tutorialModal?.hidden === false) {
      renderTutorialScene(now);
    }

    runtime.rafId = window.requestAnimationFrame(loop);
  }

  function updateScene(delta, now) {
    updateStageNotes(delta);
    updateInteriorNpcs(delta);
    updateExteriorWalkers(delta);
    updateExteriorTraffic(delta);
    updateNpcBubbles(delta);
    updateStreetBubbles(delta);
    updateSingerBursts(delta);
    updateTrafficAudio(delta, now);

    if (
      !refs.tutorialModal.hidden ||
      !refs.profileModal.hidden ||
      !refs.doorModal.hidden ||
      !refs.badEndingModal.hidden ||
      !refs.gameModal.hidden ||
      refs.shopModal?.hidden === false ||
      refs.waiterModal?.hidden === false ||
      refs.jukeboxModal?.hidden === false
    ) {
      runtime.player.moving = false;
      return;
    }

    const move = getMoveVector();
    const speed = runtime.scene === "exterior" ? 128 : 134;
    const usingManualMove = move.x !== 0 || move.y !== 0;
    runtime.player.moving = usingManualMove;

    if (usingManualMove) {
      clearPlayerWalkPath();
      const velocityX = (move.x * speed * delta);
      const velocityY = (move.y * speed * delta);
      tryMovePlayer(velocityX, velocityY);
      runtime.player.walkClock += delta;
      if (runtime.player.walkClock >= 0.12) {
        runtime.player.walkClock = 0;
        runtime.player.walkFrame = (runtime.player.walkFrame + 1) % 2;
      }
    } else if (updatePlayerWalkPath(delta, speed)) {
      runtime.player.moving = true;
      runtime.player.walkClock += delta;
      if (runtime.player.walkClock >= 0.12) {
        runtime.player.walkClock = 0;
        runtime.player.walkFrame = (runtime.player.walkFrame + 1) % 2;
      }
    } else {
      runtime.player.walkClock = 0;
      runtime.player.walkFrame = 0;
    }

    runtime.prompt = runtime.player.pendingInteraction || getNearestInteraction();

    if (runtime.message.expiresAt && now >= runtime.message.expiresAt) {
      runtime.message.text = "";
      runtime.message.expiresAt = 0;
    }
  }

  function updateStageNotes(delta) {
    if (runtime.scene !== "interior") {
      runtime.notes = [];
      runtime.noteTimer = 0;
      return;
    }

    runtime.noteTimer -= delta;
    if (runtime.noteTimer <= 0) {
      runtime.noteTimer = 0.32;
      runtime.notes.push({
        x: 834 + Math.random() * 46,
        y: 135 + Math.random() * 24,
        vy: 22 + Math.random() * 10,
        drift: (Math.random() - 0.5) * 14,
        life: 1.2,
        color: Math.random() > 0.5 ? "#70ebff" : "#ffca6b"
      });
    }

    runtime.notes = runtime.notes
      .map((note) => ({
        ...note,
        x: note.x + note.drift * delta,
        y: note.y - note.vy * delta,
        life: note.life - delta
      }))
      .filter((note) => note.life > 0);
  }

  function getMoveVector() {
    const source = runtime.touchMove || Array.from(runtime.keys).join(",");
    const vector = { x: 0, y: 0 };

    if (source.includes("up")) {
      vector.y -= 1;
      runtime.player.facing = "up";
    }
    if (source.includes("down")) {
      vector.y += 1;
      runtime.player.facing = "down";
    }
    if (source.includes("left")) {
      vector.x -= 1;
      runtime.player.facing = "left";
    }
    if (source.includes("right")) {
      vector.x += 1;
      runtime.player.facing = "right";
    }

    if (vector.x !== 0 && vector.y !== 0) {
      const scale = Math.SQRT1_2;
      vector.x *= scale;
      vector.y *= scale;
    }

    return vector;
  }

  function tryMovePlayer(deltaX, deltaY) {
    const nextX = runtime.player.x + deltaX;
    if (canStandAt(nextX, runtime.player.y)) runtime.player.x = nextX;

    const nextY = runtime.player.y + deltaY;
    if (canStandAt(runtime.player.x, nextY)) runtime.player.y = nextY;
  }

  function canStandAt(x, y) {
    const feet = getFeetRect(x, y);
    if (runtime.scene === "exterior") {
      return EXTERIOR_WALK_ZONES.some((zone) => rectInside(feet, zone));
    }

    if (feet.x < 32 || feet.x + feet.w > 928 || feet.y < 88 || feet.y + feet.h > 620) {
      return false;
    }

    return !INTERIOR_BLOCKS.some((block) => rectsOverlap(feet, softenInteriorBlock(block)));
  }

  function softenInteriorBlock(block) {
    if (block.hard) {
      return {
        x: block.x,
        y: block.y,
        w: block.w,
        h: block.h
      };
    }

    const insetX = Math.max(3, Math.min(14, Math.floor(block.w * 0.16)));
    const insetTop = Math.max(4, Math.min(12, Math.floor(block.h * 0.12)));
    const insetBottom = Math.max(3, Math.min(10, Math.floor(block.h * 0.08)));
    const safeWidth = Math.max(10, block.w - insetX * 2);
    const safeHeight = Math.max(10, block.h - insetTop - insetBottom);

    return {
      x: block.x + insetX,
      y: block.y + insetTop,
      w: safeWidth,
      h: safeHeight
    };
  }

  function findNearestWalkablePoint(x, y) {
    const clampedX = Math.max(44, Math.min(916, x));
    const clampedY = Math.max(102, Math.min(606, y));
    if (canStandAt(clampedX, clampedY)) return { x: clampedX, y: clampedY };

    for (let radius = 12; radius <= 180; radius += 12) {
      for (let step = 0; step < 16; step += 1) {
        const angle = (Math.PI * 2 * step) / 16;
        const tryX = clampedX + Math.cos(angle) * radius;
        const tryY = clampedY + Math.sin(angle) * radius;
        if (canStandAt(tryX, tryY)) {
          return { x: tryX, y: tryY };
        }
      }
    }

    return null;
  }

  function getSceneWalkBounds() {
    if (runtime.scene === "exterior") {
      return {
        minX: 36,
        maxX: WORLD.width - 36,
        minY: 84,
        maxY: WORLD.height - 36
      };
    }

    return {
      minX: 44,
      maxX: 916,
      minY: 102,
      maxY: 606
    };
  }

  function hasWalkLine(fromX, fromY, toX, toY) {
    const distance = Math.hypot(toX - fromX, toY - fromY);
    const steps = Math.max(1, Math.ceil(distance / 10));
    for (let index = 1; index <= steps; index += 1) {
      const progress = index / steps;
      const sampleX = fromX + (toX - fromX) * progress;
      const sampleY = fromY + (toY - fromY) * progress;
      if (!canStandAt(sampleX, sampleY)) {
        return false;
      }
    }
    return true;
  }

  function findNearestGridWalkablePoint(x, y, step = 24) {
    const bounds = getSceneWalkBounds();
    const baseX = Math.round(x / step) * step;
    const baseY = Math.round(y / step) * step;

    for (let radius = 0; radius <= 6; radius += 1) {
      for (let offsetY = -radius; offsetY <= radius; offsetY += 1) {
        for (let offsetX = -radius; offsetX <= radius; offsetX += 1) {
          if (Math.max(Math.abs(offsetX), Math.abs(offsetY)) !== radius) continue;
          const candidateX = Math.max(bounds.minX, Math.min(bounds.maxX, baseX + offsetX * step));
          const candidateY = Math.max(bounds.minY, Math.min(bounds.maxY, baseY + offsetY * step));
          if (canStandAt(candidateX, candidateY)) {
            return { x: candidateX, y: candidateY };
          }
        }
      }
    }

    return null;
  }

  function buildWalkPath(targetX, targetY) {
    const target = findNearestWalkablePoint(targetX, targetY);
    if (!target) return null;

    const start = {
      x: runtime.player.x,
      y: runtime.player.y
    };
    if (Math.hypot(target.x - start.x, target.y - start.y) <= 6) {
      return [];
    }

    if (hasWalkLine(start.x, start.y, target.x, target.y)) {
      return [target];
    }

    const step = 24;
    const startNode = findNearestGridWalkablePoint(start.x, start.y, step);
    const targetNode = findNearestGridWalkablePoint(target.x, target.y, step);
    if (!startNode || !targetNode) {
      return null;
    }

    const open = [startNode];
    const keyOf = (point) => `${Math.round(point.x)}:${Math.round(point.y)}`;
    const startKey = keyOf(startNode);
    const targetKey = keyOf(targetNode);
    const cameFrom = new Map();
    const gScore = new Map([[startKey, 0]]);
    const fScore = new Map([[startKey, Math.hypot(targetNode.x - startNode.x, targetNode.y - startNode.y)]]);
    const queued = new Set([startKey]);
    const directions = [
      { x: step, y: 0, cost: step },
      { x: -step, y: 0, cost: step },
      { x: 0, y: step, cost: step },
      { x: 0, y: -step, cost: step },
      { x: step, y: step, cost: step * Math.SQRT2 },
      { x: step, y: -step, cost: step * Math.SQRT2 },
      { x: -step, y: step, cost: step * Math.SQRT2 },
      { x: -step, y: -step, cost: step * Math.SQRT2 }
    ];
    const bounds = getSceneWalkBounds();

    while (open.length) {
      open.sort(
        (left, right) => (fScore.get(keyOf(left)) ?? Infinity) - (fScore.get(keyOf(right)) ?? Infinity)
      );
      const current = open.shift();
      const currentKey = keyOf(current);
      queued.delete(currentKey);

      if (currentKey === targetKey) {
        const reversed = [];
        let traceKey = currentKey;
        while (traceKey && traceKey !== startKey) {
          const [traceX, traceY] = traceKey.split(":").map(Number);
          reversed.push({ x: traceX, y: traceY });
          traceKey = cameFrom.get(traceKey) || "";
        }

        const path = reversed.reverse();
        if (!path.length || path[path.length - 1].x !== target.x || path[path.length - 1].y !== target.y) {
          path.push(target);
        }
        return smoothWalkPath(path, start);
      }

      for (const direction of directions) {
        const nextX = current.x + direction.x;
        const nextY = current.y + direction.y;
        if (nextX < bounds.minX || nextX > bounds.maxX || nextY < bounds.minY || nextY > bounds.maxY) {
          continue;
        }
        if (!canStandAt(nextX, nextY) || !hasWalkLine(current.x, current.y, nextX, nextY)) {
          continue;
        }

        const neighbor = { x: nextX, y: nextY };
        const neighborKey = keyOf(neighbor);
        const tentativeG = (gScore.get(currentKey) ?? Infinity) + direction.cost;
        if (tentativeG >= (gScore.get(neighborKey) ?? Infinity)) {
          continue;
        }

        cameFrom.set(neighborKey, currentKey);
        gScore.set(neighborKey, tentativeG);
        fScore.set(
          neighborKey,
          tentativeG + Math.hypot(targetNode.x - neighbor.x, targetNode.y - neighbor.y)
        );
        if (!queued.has(neighborKey)) {
          open.push(neighbor);
          queued.add(neighborKey);
        }
      }
    }

    return null;
  }

  function smoothWalkPath(path, origin) {
    if (!path.length) return [];

    const smooth = [];
    let anchor = origin;
    let index = 0;
    while (index < path.length) {
      let farthest = index;
      for (let probe = index; probe < path.length; probe += 1) {
        if (!hasWalkLine(anchor.x, anchor.y, path[probe].x, path[probe].y)) {
          break;
        }
        farthest = probe;
      }

      smooth.push(path[farthest]);
      anchor = path[farthest];
      index = farthest + 1;
    }

    return smooth;
  }

  function clearPlayerWalkPath() {
    runtime.player.path = [];
    runtime.player.pendingInteraction = null;
  }

  function teleportPlayerToInteraction(interaction) {
    if (!interaction) return false;
    const standPoint = getInteractionStandPoint(interaction);
    if (!standPoint) return false;

    runtime.player.x = standPoint.x;
    runtime.player.y = standPoint.y;

    const dx = interaction.x - standPoint.x;
    const dy = interaction.y - standPoint.y;
    if (Math.abs(dx) >= Math.abs(dy)) {
      runtime.player.facing = dx >= 0 ? "right" : "left";
    } else {
      runtime.player.facing = dy >= 0 ? "down" : "up";
    }

    runtime.prompt = interaction;
    clearPlayerWalkPath();
    return true;
  }

  function queuePlayerWalk(targetX, targetY, pendingInteraction = null) {
    const path = buildWalkPath(targetX, targetY);
    if (path === null) {
      runtime.player.path = [];
      runtime.player.pendingInteraction = null;
      if (pendingInteraction && teleportPlayerToInteraction(pendingInteraction)) {
        renderSceneHud();
        triggerInteraction(pendingInteraction);
        return true;
      }
      return false;
    }

    if (!path.length) {
      runtime.player.path = [];
      runtime.player.pendingInteraction = null;
      if (pendingInteraction) {
        runtime.prompt = pendingInteraction;
        triggerInteraction(pendingInteraction);
      }
      return true;
    }

    runtime.player.path = path;
    runtime.player.pendingInteraction = pendingInteraction;
    return true;
  }

  function updatePlayerWalkPath(delta, speed) {
    if (!runtime.player.path.length) {
      return false;
    }

    while (runtime.player.path.length) {
      const waypoint = runtime.player.path[0];
      const dx = waypoint.x - runtime.player.x;
      const dy = waypoint.y - runtime.player.y;
      const distance = Math.hypot(dx, dy);

      if (distance <= 5) {
        runtime.player.x = waypoint.x;
        runtime.player.y = waypoint.y;
        runtime.player.path.shift();
        continue;
      }

      if (Math.abs(dx) >= Math.abs(dy)) {
        runtime.player.facing = dx >= 0 ? "right" : "left";
      } else {
        runtime.player.facing = dy >= 0 ? "down" : "up";
      }

      const step = Math.min(distance, speed * delta);
      const beforeX = runtime.player.x;
      const beforeY = runtime.player.y;
      tryMovePlayer((dx / distance) * step, (dy / distance) * step);
      const movedDistance = Math.hypot(runtime.player.x - beforeX, runtime.player.y - beforeY);
      if (movedDistance <= 0.2) {
        const blockedInteraction = runtime.player.pendingInteraction;
        clearPlayerWalkPath();
        if (blockedInteraction && teleportPlayerToInteraction(blockedInteraction)) {
          renderSceneHud();
          triggerInteraction(blockedInteraction);
          return true;
        }
        return false;
      }
      return true;
    }

    const pendingInteraction = runtime.player.pendingInteraction;
    clearPlayerWalkPath();
    if (pendingInteraction) {
      runtime.prompt = pendingInteraction;
      triggerInteraction(pendingInteraction);
    }
    return false;
  }

  function getInteractionStandPoint(interaction) {
    const offsets = {
      pool: { x: 0, y: 56 },
      // A mesa de damas fica mais acessivel parando pelo corredor central de baixo.
      checkers: { x: 0, y: 96 },
      chess: { x: 0, y: 94 },
      cards21: { x: 0, y: 70 },
      poker: { x: 0, y: 62 },
      truco: { x: 0, y: 72 },
      dicecups: { x: 0, y: 70 },
      slots: { x: 0, y: 78 },
      roulette: { x: -18, y: 76 },
      "wall-darts": { x: -12, y: 88 },
      "bartender-shop": { x: 0, y: 74 },
      "waiter-tips": { x: 0, y: 72 },
      jukebox: { x: -40, y: 34 },
      exit: { x: 0, y: 44 }
    };
    const offset = offsets[interaction.id] || { x: 0, y: 54 };
    return findNearestWalkablePoint(interaction.x + offset.x, interaction.y + offset.y);
  }

  function getFeetRect(x, y) {
    return {
      x: x - 9,
      y: y - 10,
      w: 18,
      h: 10
    };
  }

  function rectInside(a, b) {
    return a.x >= b.x && a.y >= b.y && a.x + a.w <= b.x + b.w && a.y + a.h <= b.y + b.h;
  }

  function rectsOverlap(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  }

  function getNearestInteraction() {
    const list = INTERACTIONS[runtime.scene] || [];
    let nearest = null;
    let nearestDistance = Infinity;

    list.forEach((interaction) => {
      const distance = Math.hypot(runtime.player.x - interaction.x, runtime.player.y - interaction.y);
      if (distance <= interaction.radius && distance < nearestDistance) {
        nearest = interaction;
        nearestDistance = distance;
      }
    });

    return nearest;
  }

  function getInteractionAtCanvasPoint(x, y) {
    const list = INTERACTIONS[runtime.scene] || [];
    const directHit = list.find((interaction) => pointInsideInteractionClickArea(x, y, interaction));
    if (directHit) return directHit;

    let nearest = null;
    let nearestDistance = Infinity;

    list.forEach((interaction) => {
      const distance = Math.hypot(x - interaction.x, y - interaction.y);
      if (distance <= interaction.radius + 46 && distance < nearestDistance) {
        nearest = interaction;
        nearestDistance = distance;
      }
    });

    return nearest;
  }

  function pointInsideInteractionClickArea(x, y, interaction) {
    const area = getInteractionClickArea(interaction);
    if (!area) return false;
    return x >= area.x && x <= area.x + area.w && y >= area.y && y <= area.y + area.h;
  }

  function getInteractionClickArea(interaction) {
    const explicitAreas = {
      pool: { x: 36, y: 66, w: 182, h: 166 },
      checkers: { x: 54, y: 236, w: 272, h: 164 },
      chess: { x: 24, y: 442, w: 308, h: 182 },
      cards21: { x: 226, y: 410, w: 138, h: 108 },
      poker: { x: 354, y: 418, w: 146, h: 122 },
      truco: { x: 592, y: 404, w: 150, h: 112 },
      dicecups: { x: 684, y: 208, w: 226, h: 126 },
      slots: { x: 618, y: 36, w: 110, h: 238 },
      roulette: { x: 730, y: 92, w: 132, h: 132 },
      "wall-darts": { x: 836, y: 104, w: 98, h: 102 },
      stage: { x: 818, y: 96, w: 88, h: 130 },
      "bartender-shop": { x: 266, y: 88, w: 82, h: 114 },
      "waiter-tips": { x: 744, y: 78, w: 94, h: 116 },
      jukebox: { x: 798, y: 436, w: 118, h: 126 },
      "front-door": { x: 392, y: 338, w: 176, h: 154 },
      "back-door": { x: 414, y: 536, w: 132, h: 84 }
    };

    if (explicitAreas[interaction.id]) {
      return explicitAreas[interaction.id];
    }

      return {
        x: interaction.x - 52,
        y: interaction.y - 52,
        w: 104,
        h: 104
      };
  }

  function renderScene(now) {
    if (!sceneCtx || !refs.sceneCanvas) return;

    sceneCtx.clearRect(0, 0, WORLD.width, WORLD.height);

    const background = images[runtime.scene];
    if (background?.naturalWidth) {
      sceneCtx.drawImage(background, 0, 0, WORLD.width, WORLD.height);
    } else {
      sceneCtx.fillStyle = "#05040b";
      sceneCtx.fillRect(0, 0, WORLD.width, WORLD.height);
    }

    if (runtime.scene === "interior") {
      drawInteriorLights(now);
      drawDanceCouples(now);
      drawInteractionMarkers(now);
      drawInteriorNpcs();
      drawStageSinger(now);
      drawStageNotes();
      drawNpcBubbles();
      drawSingerBursts();
      drawBarBartender(now);
    } else {
      drawExteriorStreetLife(now);
      drawExteriorTraffic();
      drawExteriorWalkers();
      drawStreetBubbles();
      drawInteractionMarkers(now);
    }
    drawPlayerLabel();
    drawPlayerSprite(sceneCtx, runtime.player.x - 14, runtime.player.y - 42, 2, runtime.player.facing, runtime.player.walkFrame, getPlayerPalette(), true);
  }

  function drawInteriorLights(now) {
    if (runtime.scene !== "interior") return;

    const pulseA = 0.18 + (Math.sin(now / 240) + 1) * 0.08;
    const pulseB = 0.14 + (Math.sin(now / 320 + 1.4) + 1) * 0.08;
    const pulseC = 0.12 + (Math.sin(now / 270 + 3.1) + 1) * 0.07;
    const floorSweep = (Math.sin(now / 980) + 1) / 2;
    const floorSweepAlt = (Math.cos(now / 1260 + 0.8) + 1) / 2;

    sceneCtx.save();
    sceneCtx.globalCompositeOperation = "screen";

    sceneCtx.fillStyle = `rgba(255, 98, 189, ${pulseA.toFixed(3)})`;
    sceneCtx.beginPath();
    sceneCtx.moveTo(720, 92);
    sceneCtx.lineTo(648, 308);
    sceneCtx.lineTo(792, 308);
    sceneCtx.closePath();
    sceneCtx.fill();

    sceneCtx.fillStyle = `rgba(112, 235, 255, ${pulseB.toFixed(3)})`;
    sceneCtx.beginPath();
    sceneCtx.moveTo(824, 96);
    sceneCtx.lineTo(742, 332);
    sceneCtx.lineTo(894, 332);
    sceneCtx.closePath();
    sceneCtx.fill();

    sceneCtx.fillStyle = `rgba(128, 224, 146, ${pulseC.toFixed(3)})`;
    sceneCtx.beginPath();
    sceneCtx.moveTo(894, 102);
    sceneCtx.lineTo(782, 356);
    sceneCtx.lineTo(940, 356);
    sceneCtx.closePath();
    sceneCtx.fill();

    const rgbBeams = [
      {
        x: 138 + floorSweep * 58,
        y: 86,
        color: "rgba(255, 70, 160, 0.24)",
        floor: { x: 78 + floorSweep * 92, y: 340, w: 210, h: 72, rotate: -0.14 }
      },
      {
        x: 440 + floorSweepAlt * 80,
        y: 84,
        color: "rgba(90, 235, 255, 0.22)",
        floor: { x: 340 + floorSweepAlt * 110, y: 350, w: 260, h: 76, rotate: 0.08 }
      },
      {
        x: 776 + floorSweep * 70,
        y: 92,
        color: "rgba(124, 255, 162, 0.2)",
        floor: { x: 650 + floorSweep * 110, y: 360, w: 236, h: 72, rotate: -0.05 }
      },
      {
        x: 560 + floorSweepAlt * 70,
        y: 128,
        color: "rgba(255, 205, 92, 0.18)",
        floor: { x: 478 + floorSweepAlt * 86, y: 234, w: 184, h: 48, rotate: 0.12 }
      }
    ];

    rgbBeams.forEach((beam, index) => {
      const alpha = 0.55 + (Math.sin(now / 360 + index * 1.8) + 1) * 0.18;
      const beamGradient = sceneCtx.createLinearGradient(beam.x, beam.y, beam.floor.x + beam.floor.w / 2, beam.floor.y);
      beamGradient.addColorStop(0, beam.color.replace(/0\.\d+\)/, `${(0.22 * alpha).toFixed(3)})`));
      beamGradient.addColorStop(0.62, beam.color.replace(/0\.\d+\)/, `${(0.1 * alpha).toFixed(3)})`));
      beamGradient.addColorStop(1, "rgba(255,255,255,0)");
      sceneCtx.fillStyle = beamGradient;
      sceneCtx.beginPath();
      sceneCtx.moveTo(beam.x, beam.y);
      sceneCtx.lineTo(beam.floor.x + beam.floor.w, beam.floor.y + beam.floor.h);
      sceneCtx.lineTo(beam.floor.x, beam.floor.y + beam.floor.h);
      sceneCtx.closePath();
      sceneCtx.fill();

      sceneCtx.save();
      sceneCtx.translate(beam.floor.x + beam.floor.w / 2, beam.floor.y + beam.floor.h / 2);
      sceneCtx.rotate(beam.floor.rotate + Math.sin(now / 720 + index) * 0.04);
      const floorGradient = sceneCtx.createRadialGradient(0, 0, 4, 0, 0, beam.floor.w * 0.55);
      floorGradient.addColorStop(0, beam.color.replace(/0\.\d+\)/, `${(0.28 * alpha).toFixed(3)})`));
      floorGradient.addColorStop(0.55, beam.color.replace(/0\.\d+\)/, `${(0.13 * alpha).toFixed(3)})`));
      floorGradient.addColorStop(1, "rgba(255,255,255,0)");
      sceneCtx.fillStyle = floorGradient;
      sceneCtx.beginPath();
      sceneCtx.ellipse(0, 0, beam.floor.w / 2, beam.floor.h / 2, 0, 0, Math.PI * 2);
      sceneCtx.fill();
      sceneCtx.restore();
    });

    const sweepBars = [
      { y: 286 + Math.sin(now / 680) * 18, color: "rgba(255, 98, 189, 0.18)", speed: 0 },
      { y: 380 + Math.cos(now / 760) * 20, color: "rgba(112, 235, 255, 0.16)", speed: 1.7 },
      { y: 470 + Math.sin(now / 840 + 1.8) * 24, color: "rgba(128, 224, 146, 0.14)", speed: 3.2 }
    ];

    sweepBars.forEach((bar) => {
      const x = -180 + ((now / 18 + bar.speed * 130) % 1240);
      const gradient = sceneCtx.createLinearGradient(x, bar.y, x + 220, bar.y + 22);
      gradient.addColorStop(0, "rgba(255,255,255,0)");
      gradient.addColorStop(0.45, bar.color);
      gradient.addColorStop(1, "rgba(255,255,255,0)");
      sceneCtx.fillStyle = gradient;
      sceneCtx.beginPath();
      sceneCtx.moveTo(x, bar.y);
      sceneCtx.lineTo(x + 230, bar.y + 34);
      sceneCtx.lineTo(x + 214, bar.y + 54);
      sceneCtx.lineTo(x - 16, bar.y + 20);
      sceneCtx.closePath();
      sceneCtx.fill();
    });

    sceneCtx.globalCompositeOperation = "source-over";

    const leds = [
      { x: 650, y: 88, color: "#ff62bd", wave: 0 },
      { x: 690, y: 90, color: "#70ebff", wave: 0.8 },
      { x: 730, y: 86, color: "#80e092", wave: 1.6 },
      { x: 770, y: 90, color: "#ffca6b", wave: 2.4 },
      { x: 810, y: 86, color: "#ff62bd", wave: 3.2 },
      { x: 850, y: 90, color: "#70ebff", wave: 4.0 },
      { x: 890, y: 88, color: "#80e092", wave: 4.8 }
    ];

    leds.forEach((led) => {
      const alpha = 0.45 + (Math.sin(now / 180 + led.wave) + 1) * 0.2;
      sceneCtx.fillStyle = led.color;
      sceneCtx.globalAlpha = alpha;
      sceneCtx.fillRect(led.x, led.y, 12, 4);
      sceneCtx.fillRect(led.x + 2, led.y + 4, 8, 2);
    });

    sceneCtx.globalAlpha = 0.12;
    sceneCtx.fillStyle = "#fff6d8";
    sceneCtx.fillRect(620, 84, 302, 10);

    sceneCtx.globalAlpha = 0.55;
    [
      { x: 156, y: 92, color: "#ff62bd" },
      { x: 454, y: 86, color: "#70ebff" },
      { x: 802, y: 92, color: "#80e092" },
      { x: 566, y: 128, color: "#ffca6b" }
    ].forEach((lamp) => {
      sceneCtx.fillStyle = lamp.color;
      sceneCtx.fillRect(lamp.x - 8, lamp.y - 4, 16, 6);
      sceneCtx.fillStyle = "rgba(255,255,255,0.38)";
      sceneCtx.fillRect(lamp.x - 4, lamp.y - 7, 8, 3);
    });
    sceneCtx.restore();
  }

  function drawDanceCouples(now) {
    if (runtime.scene !== "interior") return;

    INTERIOR_DANCE_COUPLES.forEach((couple, index) => {
      const sway = Math.sin(now / 220 + index * 1.7);
      const step = Math.sin(now / 110 + index) > 0 ? 1 : 0;
      const leftX = couple.x - 14 + sway * 4;
      const rightX = couple.x + 14 - sway * 4;
      const baseY = couple.y + Math.cos(now / 260 + index) * 3;

      sceneCtx.save();
      sceneCtx.globalAlpha = 0.24 + (Math.sin(now / 210 + index) + 1) * 0.08;
      sceneCtx.fillStyle = couple.glow;
      sceneCtx.beginPath();
      sceneCtx.ellipse(couple.x, baseY + 6, 38, 16, 0, 0, Math.PI * 2);
      sceneCtx.fill();
      sceneCtx.restore();

      drawPlayerSprite(
        sceneCtx,
        leftX - 14,
        baseY - 42,
        2,
        "right",
        step,
        PALETTES[couple.left] || PALETTES.neon,
        false
      );
      drawPlayerSprite(
        sceneCtx,
        rightX - 14,
        baseY - 42,
        2,
        "left",
        step === 1 ? 0 : 1,
        PALETTES[couple.right] || PALETTES.lounge,
        false
      );

      sceneCtx.save();
      sceneCtx.strokeStyle = "rgba(255, 246, 216, 0.3)";
      sceneCtx.lineWidth = 2;
      sceneCtx.beginPath();
      sceneCtx.moveTo(leftX + 6, baseY - 12);
      sceneCtx.lineTo(rightX - 6, baseY - 12);
      sceneCtx.stroke();
      sceneCtx.restore();
    });
  }

  function drawInteractionMarkers(now) {
    const list = INTERACTIONS[runtime.scene] || [];

    list.forEach((interaction) => {
      const marker = getInteractionMarkerPosition(interaction);
      const pulse = 1 + Math.sin(now / 180 + marker.x * 0.01) * 0.12;
      const isFocus = runtime.prompt?.id === interaction.id;
      const color =
        interaction.type === "game"
          ? "#70ebff"
          : interaction.type === "stage"
            ? "#ffca6b"
            : interaction.type === "shop"
              ? "#80e092"
              : interaction.type === "tips"
                ? "#fff0a6"
              : interaction.type === "jukebox"
                ? "#ff62bd"
                : "#effcff";

      sceneCtx.save();
      sceneCtx.translate(marker.x, marker.y);
      sceneCtx.scale(pulse, pulse);
      sceneCtx.strokeStyle = color;
      sceneCtx.fillStyle = isFocus ? color : "rgba(0,0,0,0.55)";
      sceneCtx.lineWidth = isFocus ? 3 : 2;
      if (interaction.id === "bartender-shop") {
        sceneCtx.beginPath();
        sceneCtx.arc(0, 0, 9, 0, Math.PI * 2);
        sceneCtx.closePath();
      } else {
        sceneCtx.beginPath();
        sceneCtx.moveTo(0, -12);
        sceneCtx.lineTo(11, 0);
        sceneCtx.lineTo(0, 12);
        sceneCtx.lineTo(-11, 0);
        sceneCtx.closePath();
      }
      sceneCtx.fill();
      sceneCtx.stroke();
      sceneCtx.restore();

      if (isFocus) {
        const label = interaction.label;
        sceneCtx.save();
        sceneCtx.font = "12px Chakra Petch";
        const width = Math.ceil(sceneCtx.measureText(label).width) + 18;
        sceneCtx.fillStyle = "rgba(12, 9, 23, 0.85)";
        sceneCtx.fillRect(marker.x - width / 2, marker.y - 42, width, 24);
        sceneCtx.strokeStyle = color;
        sceneCtx.strokeRect(marker.x - width / 2, marker.y - 42, width, 24);
        sceneCtx.fillStyle = "#f7f2d5";
        sceneCtx.fillText(label, marker.x - width / 2 + 9, marker.y - 25);
        sceneCtx.restore();
      }
    });
  }

  function getInteractionMarkerPosition(interaction) {
    if (runtime.scene === "interior") {
      if (interaction.id === "bartender-shop") {
        const npc = findNpcById("garcom-vito");
        if (npc) return { x: npc.x + 36, y: npc.y - 70 };
      }
      if (interaction.id === "waiter-tips") {
        const npc = findNpcById("lito-copos");
        if (npc) return { x: npc.x, y: npc.y - 48 };
      }
    }

    return { x: interaction.x, y: interaction.y - 34 };
  }

  function drawStageNotes() {
    if (runtime.scene !== "interior" || !runtime.notes.length) return;

    runtime.notes.forEach((note) => {
      const alpha = Math.max(0, Math.min(1, note.life));
      sceneCtx.save();
      sceneCtx.globalAlpha = alpha;
      sceneCtx.fillStyle = note.color;
      sceneCtx.fillRect(note.x, note.y, 6, 6);
      sceneCtx.fillRect(note.x + 4, note.y - 10, 4, 12);
      sceneCtx.fillRect(note.x + 8, note.y - 12, 6, 4);
      sceneCtx.restore();
    });
  }

  function drawPlayerLabel() {
    const label = hasAvatarProfile()
      ? `${state.profile.name}${hasUpgrade("vip-title") ? " VIP" : ""}`
      : "visitante";
    sceneCtx.save();
    sceneCtx.font = "12px Chakra Petch";
    const width = Math.ceil(sceneCtx.measureText(label).width) + 16;
    sceneCtx.fillStyle = "rgba(10, 8, 18, 0.82)";
    sceneCtx.fillRect(runtime.player.x - width / 2, runtime.player.y - 56, width, 20);
    sceneCtx.fillStyle = "#f7f2d5";
    sceneCtx.fillText(label, runtime.player.x - width / 2 + 8, runtime.player.y - 41);
    sceneCtx.restore();
  }

  function getPlayerPalette() {
    const base = PALETTES[state.profile.archetype] || PALETTES.neon;
    if (!hasUpgrade("gold-jacket")) return base;
    return {
      ...base,
      jacket: "#7b5b12",
      accent: "#ffd66b"
    };
  }

  function drawPlayerSprite(ctx, x, y, scale, facing, walkFrame, palette, isPlayer) {
    const pixels = [];

    for (let row = 0; row < 2; row += 1) {
      for (let col = 3; col < 9; col += 1) {
        pixels.push({ x: col, y: row, color: palette.hair });
      }
    }

    if (isPlayer && hasUpgrade("lucky-hat")) {
      for (let col = 2; col < 10; col += 1) {
        pixels.push({ x: col, y: 0, color: "#f7f2d5" });
      }
      for (let col = 4; col < 8; col += 1) {
        pixels.push({ x: col, y: -1, color: "#f0cf6d" });
      }
    }

    for (let row = 2; row < 6; row += 1) {
      for (let col = 3; col < 9; col += 1) {
        pixels.push({ x: col, y: row, color: palette.skin });
      }
    }

    pixels.push({ x: 4, y: 3, color: palette.accent });
    pixels.push({ x: 7, y: 3, color: palette.accent });

    if (isPlayer && hasUpgrade("arcade-shades")) {
      pixels.push({ x: 4, y: 3, color: "#0d0d14" });
      pixels.push({ x: 5, y: 3, color: "#0d0d14" });
      pixels.push({ x: 6, y: 3, color: "#0d0d14" });
      pixels.push({ x: 7, y: 3, color: "#0d0d14" });
    }

    for (let row = 6; row < 11; row += 1) {
      for (let col = 2; col < 10; col += 1) {
        pixels.push({ x: col, y: row, color: palette.shirt });
      }
    }

    for (let row = 7; row < 11; row += 1) {
      pixels.push({ x: 1, y: row, color: palette.jacket });
      pixels.push({ x: 10, y: row, color: palette.jacket });
    }

    pixels.push({ x: 4, y: 9, color: palette.accent });
    pixels.push({ x: 7, y: 9, color: palette.accent });

    if (isPlayer && hasUpgrade("vip-title")) {
      pixels.push({ x: 5, y: 7, color: "#ffd66b" });
      pixels.push({ x: 6, y: 7, color: "#ffd66b" });
      pixels.push({ x: 5, y: 8, color: "#ff62bd" });
      pixels.push({ x: 6, y: 8, color: "#ff62bd" });
    }

    for (let row = 11; row < 16; row += 1) {
      for (let col = 3; col < 6; col += 1) {
        pixels.push({ x: col, y: row, color: palette.pants });
      }
      for (let col = 6; col < 9; col += 1) {
        pixels.push({ x: col, y: row, color: palette.pants });
      }
    }

    const feetOffset = walkFrame === 0 ? 0 : 1;
    pixels.push({ x: 3 - feetOffset, y: 16, color: "#0b0a10" });
    pixels.push({ x: 4 - feetOffset, y: 16, color: "#0b0a10" });
    pixels.push({ x: 7 + feetOffset, y: 16, color: "#0b0a10" });
    pixels.push({ x: 8 + feetOffset, y: 16, color: "#0b0a10" });

    ctx.save();
    if (isPlayer && hasUpgrade("neon-outline")) {
      ctx.shadowColor = "rgba(112, 235, 255, 0.55)";
      ctx.shadowBlur = 16;
    }
    ctx.fillStyle = "rgba(0,0,0,0.38)";
    ctx.fillRect(x + 4 * scale, y + 34, 14 * scale, 4);

    pixels.forEach((pixel) => {
      let shiftX = 0;
      if (facing === "left") shiftX = -1;
      if (facing === "right") shiftX = 1;
      ctx.fillStyle = pixel.color;
      ctx.fillRect((x + pixel.x * scale) + shiftX, y + pixel.y * scale, scale, scale);
    });

    if (isPlayer && hasUpgrade("vip-title")) {
      const badgeX = x + 20 * scale;
      const badgeY = y + 10 * scale;
      ctx.fillStyle = "#ff62bd";
      ctx.fillRect(badgeX, badgeY, 10, 6);
      ctx.fillStyle = "#ffd66b";
      ctx.fillRect(badgeX + 2, badgeY + 2, 6, 2);
    }
    ctx.restore();
  }

  function createInteriorNpcs() {
    return INTERIOR_NPC_BLUEPRINTS.map((blueprint) => ({
      ...blueprint,
      targetX: blueprint.x,
      targetY: blueprint.y,
      facing: blueprint.facing || "down",
      walkFrame: 0,
      walkClock: 0,
      pause: randomBetween(0.4, 1.4),
      speed: randomBetween(24, 38)
    }));
  }

  function createExteriorWalkers() {
    return [
      createExteriorWalker({
        id: "front-walker-a",
        x: 96,
        y: 612,
        minX: 86,
        maxX: 370,
        speed: 28,
        facing: "right",
        archetype: "street",
        lines: [
          "Esse pub acende e a rua esquece da hora.",
          "Falaram que hoje a calçada está mais animada que o salão.",
          "Eu só parei pra olhar a porta e já fiquei."
        ]
      }),
      createExteriorWalker({
        id: "front-walker-b",
        x: 324,
        y: 604,
        minX: 122,
        maxX: 426,
        speed: 23,
        facing: "left",
        archetype: "lounge",
        prop: "bag",
        lines: [
          "Tem gente entrando séria e saindo amiga do porteiro.",
          "A rua comenta mais besteira que mesa de jogo.",
          "Se a luz da fachada bate, ninguém passa reto."
        ]
      }),
      createExteriorWalker({
        id: "front-walker-c",
        x: 640,
        y: 600,
        minX: 560,
        maxX: 912,
        speed: 31,
        facing: "right",
        archetype: "cowboy",
        prop: "hat",
        lines: [
          "Disseram que lá dentro já tem discussão sobre roleta.",
          "Pub bom é o que faz a rua parar pra fofocar.",
          "Ainda nem entrei e já ouvi três histórias diferentes."
        ]
      }),
      createExteriorWalker({
        id: "front-walker-d",
        x: 900,
        y: 616,
        minX: 602,
        maxX: 922,
        speed: 19,
        facing: "left",
        archetype: "neon",
        lines: [
          "O povo da calçada sempre sabe quem perdeu primeiro.",
          "Essa entrada parece cutscene de jogo antigo.",
          "Hoje a rua está falando sozinha."
        ]
      }),
      createExteriorWalker({
        id: "front-walker-kid-a",
        x: 148,
        y: 584,
        minX: 104,
        maxX: 338,
        speed: 35,
        facing: "right",
        archetype: "neon",
        prop: "kid",
        lines: [
          "Olha as luzes!",
          "Quero ver o bar de novo.",
          "A porta brilhou!"
        ]
      }),
      createExteriorWalker({
        id: "front-walker-elder-a",
        x: 248,
        y: 596,
        minX: 132,
        maxX: 404,
        speed: 16,
        facing: "right",
        archetype: "street",
        prop: "cane",
        lines: [
          "No meu tempo bar bom começava na calçada mesmo.",
          "A rua decide se o lugar presta antes do primeiro gole.",
          "Esse povo fala alto, mas eu gosto."
        ]
      }),
      createExteriorWalker({
        id: "front-walker-elder-b",
        x: 742,
        y: 586,
        minX: 622,
        maxX: 900,
        speed: 15,
        facing: "left",
        archetype: "lounge",
        prop: "cane",
        lines: [
          "Parece que a noite resolveu ficar por aqui.",
          "A fachada já convence mais que muita propaganda.",
          "A rua está parecendo corredor de boato."
        ]
      }),
      createExteriorWalker({
        id: "front-walker-mom",
        x: 824,
        y: 574,
        minX: 644,
        maxX: 904,
        speed: 22,
        facing: "left",
        archetype: "lounge",
        prop: "bag",
        lines: [
          "Eu disse que era só passar, mas parei pra olhar.",
          "Toda rua ganha assunto quando esse pub acende.",
          "Tem alguém ali dentro cantando ou é impressão minha?"
        ]
      }),
      createExteriorWalker({
        id: "front-walker-kid-b",
        x: 856,
        y: 566,
        minX: 700,
        maxX: 912,
        speed: 38,
        facing: "left",
        archetype: "street",
        prop: "kid",
        lines: [
          "Olha o brilho da porta!",
          "Tem jogo lá dentro?",
          "A calçada está divertida hoje."
        ]
      }),
      createExteriorWalker({
        id: "front-walker-dog-handler",
        x: 560,
        y: 610,
        minX: 482,
        maxX: 786,
        speed: 24,
        facing: "right",
        archetype: "cowboy",
        prop: "leash",
        lines: [
          "Até meu cachorro desacelerou pra olhar essa entrada.",
          "Quando a rua para, o pub já venceu metade da noite.",
          "Tem lugar que convida sem precisar falar nada."
        ]
      }),
      createExteriorWalker({
        id: "front-door-security",
        x: 418,
        y: 470,
        minX: 418,
        maxX: 418,
        speed: 0,
        facing: "right",
        archetype: "street",
        prop: "security",
        behavior: "fixed",
        lines: [
          "Fila tranquila, noite barulhenta.",
          "Quem entra sorrindo sai contando história.",
          "A porta hoje está chamando gente sem esforço."
        ]
      }),
      createExteriorWalker({
        id: "front-walker-night-kid",
        x: 606,
        y: 568,
        minX: 468,
        maxX: 826,
        speed: 42,
        facing: "left",
        archetype: "neon",
        prop: "kid",
        lines: [
          "Corre não, eu quero ver a fachada!",
          "Esse lugar parece fase secreta.",
          "A rua está acesa demais pra ir embora cedo."
        ]
      }),
      createExteriorWalker({
        id: "front-walker-elder-couple",
        x: 168,
        y: 602,
        minX: 104,
        maxX: 462,
        speed: 17,
        facing: "right",
        archetype: "lounge",
        prop: "cane",
        lines: [
          "Casal que fofoca junto atravessa a rua mais devagar.",
          "Esse pub já virou assunto do quarteirão.",
          "A gente só ia olhar e já está comentando a noite."
        ]
      }),
      createExteriorWalker({
        id: "front-walker-pub-runner",
        x: 928,
        y: 578,
        minX: 584,
        maxX: 930,
        speed: 34,
        facing: "left",
        archetype: "cowboy",
        prop: "hat",
        lines: [
          "Quem corre demais perde a melhor parte da calçada.",
          "Esse bar está com cara de história ruim e boa ao mesmo tempo.",
          "Se a rua está assim, imagina o salão."
        ]
      })
    ];
  }

  function createExteriorWalker(config) {
    return {
      id: config.id,
      x: config.x,
      y: config.y,
      minX: config.minX,
      maxX: config.maxX,
      speed: config.speed,
      facing: config.facing,
      archetype: config.archetype,
      walkFrame: 0,
      walkClock: 0,
      pause: randomBetween(0.2, 1.8),
      prop: config.prop || "",
      behavior: config.behavior || "patrol",
      lines: Array.isArray(config.lines) ? config.lines : []
    };
  }

  function createExteriorTraffic() {
    return [
      createTrafficVehicle({
        id: "road-car-a",
        kind: "car",
        x: -240,
        y: 508,
        speed: 132,
        dir: 1,
        length: 78,
        color: "#ff625e"
      }),
      createTrafficVehicle({
        id: "road-car-b",
        kind: "car",
        x: 1180,
        y: 458,
        speed: 156,
        dir: -1,
        length: 86,
        color: "#70ebff"
      }),
      createTrafficVehicle({
        id: "road-car-c",
        kind: "car",
        x: -340,
        y: 548,
        speed: 146,
        dir: 1,
        length: 84,
        color: "#ff9c62"
      }),
      createTrafficVehicle({
        id: "road-car-d",
        kind: "car",
        x: 1260,
        y: 432,
        speed: 164,
        dir: -1,
        length: 90,
        color: "#9d8cff"
      }),
      createTrafficVehicle({
        id: "road-bike-a",
        kind: "moto",
        x: -180,
        y: 614,
        speed: 168,
        dir: 1,
        length: 46,
        color: "#ffd166"
      }),
      createTrafficVehicle({
        id: "road-bike-b",
        kind: "moto",
        x: 1140,
        y: 592,
        speed: 182,
        dir: -1,
        length: 46,
        color: "#80e092"
      }),
      createTrafficVehicle({
        id: "road-bike-c",
        kind: "moto",
        x: -280,
        y: 572,
        speed: 194,
        dir: 1,
        length: 48,
        color: "#ff62bd"
      }),
      createTrafficVehicle({
        id: "road-bike-d",
        kind: "moto",
        x: 1320,
        y: 520,
        speed: 188,
        dir: -1,
        length: 48,
        color: "#70ebff"
      }),
      createTrafficVehicle({
        id: "road-car-e",
        kind: "car",
        x: -420,
        y: 486,
        speed: 148,
        dir: 1,
        length: 82,
        color: "#f4c56d"
      }),
      createTrafficVehicle({
        id: "road-car-f",
        kind: "car",
        x: 1380,
        y: 566,
        speed: 174,
        dir: -1,
        length: 92,
        color: "#7de4b8"
      }),
      createTrafficVehicle({
        id: "road-bike-e",
        kind: "moto",
        x: -360,
        y: 598,
        speed: 208,
        dir: 1,
        length: 44,
        color: "#ff8f62"
      }),
      createTrafficVehicle({
        id: "road-bike-f",
        kind: "moto",
        x: 1420,
        y: 470,
        speed: 196,
        dir: -1,
        length: 42,
        color: "#9d8cff"
      })
    ];
  }

  function createTrafficVehicle(config) {
    return {
      id: config.id,
      kind: config.kind,
      x: config.x,
      y: config.y,
      speed: config.speed,
      dir: config.dir,
      length: config.length,
      color: config.color,
      wait: randomBetween(0.1, 1.8)
    };
  }

  function findNpcById(npcId) {
    return runtime.npcs.find((npc) => npc.id === npcId) || null;
  }

  function pushNpcBubble(npcId, text, life = 4.2) {
    if (!text) return;
    runtime.npcBubbles.push({
      id: `${npcId}-${Date.now()}-${Math.round(Math.random() * 999)}`,
      npcId,
      text,
      life
    });
    runtime.npcBubbles = runtime.npcBubbles.slice(-6);
  }

  function pushStreetBubble(walkerId, text, life = 4.2) {
    if (!text) return;
    runtime.streetBubbles.push({
      id: `${walkerId}-${Date.now()}-${Math.round(Math.random() * 999)}`,
      walkerId,
      text,
      life
    });
    runtime.streetBubbles = runtime.streetBubbles.slice(-8);
  }

  function pickNpcLine(npc) {
    if (!npc || !Array.isArray(npc.lines) || !npc.lines.length) return "";
    return npc.lines[Math.floor(Math.random() * npc.lines.length)] || "";
  }

  function pickWalkerLine(walker) {
    if (!walker || !Array.isArray(walker.lines) || !walker.lines.length) return "";
    return walker.lines[Math.floor(Math.random() * walker.lines.length)] || "";
  }

  function primeNpcBubbles() {
    if (runtime.scene !== "interior" || !runtime.npcs.length) return;
    runtime.npcBubbles = [];
    ["lito-copos", "bia-lounge", "rex-barra"].forEach((npcId) => {
      const npc = findNpcById(npcId);
      const text = pickNpcLine(npc);
      if (text) pushNpcBubble(npcId, text, 4.8);
    });
  }

  function primeStreetBubbles() {
    if (runtime.scene !== "exterior" || !runtime.exteriorWalkers.length) return;
    runtime.streetBubbles = [];
    ["front-walker-a", "front-walker-mom", "front-door-security"].forEach((walkerId) => {
      const walker = runtime.exteriorWalkers.find((entry) => entry.id === walkerId);
      const text = pickWalkerLine(walker);
      if (text) pushStreetBubble(walkerId, text, 4.8);
    });
  }

  function updateInteriorNpcs(delta) {
    if (runtime.scene !== "interior" || !runtime.npcs.length) return;

    runtime.npcBubbleTimer -= delta;

    runtime.npcs.forEach((npc) => {
      if (npc.behavior === "fixed") {
        npc.walkFrame = 0;
        npc.walkClock = 0;
        return;
      }

      npc.pause -= delta;
      if (npc.pause <= 0 && Math.hypot(npc.targetX - npc.x, npc.targetY - npc.y) < 6) {
        npc.targetX = randomBetween(npc.zone.x, npc.zone.x + npc.zone.w);
        npc.targetY = randomBetween(npc.zone.y, npc.zone.y + npc.zone.h);
        npc.pause = randomBetween(1.1, 2.8);
      }

      const dx = npc.targetX - npc.x;
      const dy = npc.targetY - npc.y;
      const distance = Math.hypot(dx, dy);
      if (distance > 2) {
        const step = Math.min(distance, npc.speed * delta);
        npc.x += (dx / distance) * step;
        npc.y += (dy / distance) * step;
        npc.walkClock += delta;
        npc.walkFrame = npc.walkClock >= 0.18 ? (npc.walkFrame + 1) % 2 : npc.walkFrame;
        if (npc.walkClock >= 0.18) npc.walkClock = 0;

        if (Math.abs(dx) > Math.abs(dy)) {
          npc.facing = dx > 0 ? "right" : "left";
        } else {
          npc.facing = dy > 0 ? "down" : "up";
        }
      } else {
        npc.walkFrame = 0;
        npc.walkClock = 0;
      }
    });

    if (runtime.npcBubbleTimer <= 0) {
      runtime.npcBubbleTimer = randomBetween(1.4, 2.8);
      spawnNpcBubble();
      if (Math.random() > 0.52) {
        spawnNpcBubble();
      }
    }
  }

  function updateExteriorWalkers(delta) {
    if (runtime.scene !== "exterior" || !runtime.exteriorWalkers.length) return;
    runtime.streetBubbleTimer -= delta;
    runtime.exteriorWalkers.forEach((walker) => {
      if (walker.behavior === "fixed") {
        walker.walkFrame = 0;
        walker.walkClock = 0;
        return;
      }
      walker.pause -= delta;
      if (walker.pause > 0) {
        walker.walkFrame = 0;
        walker.walkClock = 0;
        return;
      }
      const direction = walker.facing === "right" ? 1 : -1;
      walker.x += direction * walker.speed * delta;
      walker.walkClock += delta;
      if (walker.walkClock >= 0.18) {
        walker.walkClock = 0;
        walker.walkFrame = (walker.walkFrame + 1) % 2;
      }
      if (walker.x >= walker.maxX) {
        walker.x = walker.maxX;
        walker.facing = "left";
        walker.pause = randomBetween(0.6, 2.1);
      } else if (walker.x <= walker.minX) {
        walker.x = walker.minX;
        walker.facing = "right";
        walker.pause = randomBetween(0.6, 2.1);
      }
    });

    if (runtime.streetBubbleTimer <= 0) {
      runtime.streetBubbleTimer = randomBetween(1.8, 3.4);
      spawnStreetBubble();
      if (Math.random() > 0.66) spawnStreetBubble();
    }
  }

  function spawnStreetBubble() {
    if (!runtime.exteriorWalkers.length || runtime.scene !== "exterior") return;
    const busyWalkers = runtime.streetBubbles.map((bubble) => bubble.walkerId);
    const available = runtime.exteriorWalkers.filter(
      (walker) => !busyWalkers.includes(walker.id) && Array.isArray(walker.lines) && walker.lines.length
    );
    const pool = available.length ? available : runtime.exteriorWalkers;
    const walker = pool[Math.floor(Math.random() * pool.length)];
    const text = pickWalkerLine(walker);
    if (!text) return;
    pushStreetBubble(walker.id, text, randomBetween(3.8, 5.6));
  }

  function updateExteriorTraffic(delta) {
    if (runtime.scene !== "exterior" || !runtime.exteriorTraffic.length) return;
    runtime.exteriorTraffic.forEach((vehicle) => {
      if (vehicle.wait > 0) {
        vehicle.wait -= delta;
        return;
      }
      vehicle.x += vehicle.speed * vehicle.dir * delta;
      if (vehicle.dir > 0 && vehicle.x > WORLD.width + 220) {
        vehicle.x = -240 - Math.random() * 240;
        vehicle.wait = randomBetween(1.2, 4.1);
      } else if (vehicle.dir < 0 && vehicle.x < -240) {
        vehicle.x = WORLD.width + 220 + Math.random() * 240;
        vehicle.wait = randomBetween(1.2, 4.1);
      }
    });
  }

  function drawExteriorWalkers() {
    if (runtime.scene !== "exterior" || !runtime.exteriorWalkers.length) return;
    runtime.exteriorWalkers
      .slice()
      .sort((a, b) => a.y - b.y)
      .forEach((walker) => {
        drawPlayerSprite(
          sceneCtx,
          walker.x - 14,
          walker.y - 42,
          2,
          walker.facing,
          walker.walkFrame,
          PALETTES[walker.archetype] || PALETTES.street,
          false
        );
        drawExteriorWalkerProp(walker);
      });
  }

  function drawExteriorWalkerProp(walker) {
    if (!walker?.prop) return;
    sceneCtx.save();

    if (walker.prop === "bag") {
      sceneCtx.fillStyle = "#ffca6b";
      sceneCtx.fillRect(walker.x + 8, walker.y - 18, 7, 8);
      sceneCtx.fillStyle = "#7c5522";
      sceneCtx.fillRect(walker.x + 9, walker.y - 20, 5, 2);
    } else if (walker.prop === "hat") {
      sceneCtx.fillStyle = "#c39254";
      sceneCtx.fillRect(walker.x + 6, walker.y - 36, 12, 3);
      sceneCtx.fillRect(walker.x + 8, walker.y - 40, 8, 5);
    } else if (walker.prop === "kid") {
      sceneCtx.fillStyle = "#ffd89f";
      sceneCtx.fillRect(walker.x + 7, walker.y - 26, 8, 8);
      sceneCtx.fillStyle = "#70ebff";
      sceneCtx.fillRect(walker.x + 6, walker.y - 17, 10, 8);
      sceneCtx.fillStyle = "#1a1323";
      sceneCtx.fillRect(walker.x + 8, walker.y - 9, 3, 6);
      sceneCtx.fillRect(walker.x + 12, walker.y - 9, 3, 6);
    } else if (walker.prop === "cane") {
      sceneCtx.fillStyle = "#d8b47b";
      sceneCtx.fillRect(walker.x + (walker.facing === "left" ? 4 : 20), walker.y - 18, 2, 18);
      sceneCtx.fillRect(walker.x + (walker.facing === "left" ? 2 : 18), walker.y - 18, 6, 2);
    } else if (walker.prop === "leash") {
      const startX = walker.x + (walker.facing === "left" ? 2 : 20);
      sceneCtx.strokeStyle = "rgba(255, 242, 202, 0.72)";
      sceneCtx.lineWidth = 1;
      sceneCtx.beginPath();
      sceneCtx.moveTo(startX, walker.y - 10);
      sceneCtx.lineTo(startX + (walker.facing === "left" ? -18 : 18), walker.y - 4);
      sceneCtx.stroke();
    } else if (walker.prop === "security") {
      sceneCtx.fillStyle = "#d9b47a";
      sceneCtx.fillRect(walker.x + 8, walker.y - 36, 8, 3);
      sceneCtx.fillStyle = "#11131b";
      sceneCtx.fillRect(walker.x + 6, walker.y - 33, 12, 4);
      sceneCtx.fillStyle = "#d8c08b";
      sceneCtx.fillRect(walker.x + 17, walker.y - 18, 2, 16);
      sceneCtx.fillRect(walker.x + 17, walker.y - 20, 6, 2);
    }

    sceneCtx.restore();
  }

  function drawExteriorStreetLife(now) {
    if (runtime.scene !== "exterior") return;

    const drunkBob = Math.sin(now / 430) * 2;
    const dogTail = Math.sin(now / 210) * 4;
    const roadPulse = (Math.sin(now / 520) + 1) / 2;
    const signGlow = (Math.sin(now / 280) + 1) / 2;
    const lampPulse = (Math.cos(now / 470) + 1) / 2;

    sceneCtx.save();

    const roadGradient = sceneCtx.createLinearGradient(0, 450, 0, 640);
    roadGradient.addColorStop(0, "rgba(28, 24, 34, 0.88)");
    roadGradient.addColorStop(0.4, "rgba(20, 20, 28, 0.95)");
    roadGradient.addColorStop(1, "rgba(14, 14, 20, 0.98)");
    sceneCtx.fillStyle = roadGradient;
    sceneCtx.fillRect(0, 448, WORLD.width, 192);

    sceneCtx.fillStyle = "rgba(58, 50, 64, 0.92)";
    sceneCtx.fillRect(0, 432, WORLD.width, 20);
    sceneCtx.fillStyle = "rgba(235, 198, 126, 0.28)";
    sceneCtx.fillRect(0, 430, WORLD.width, 2);

    sceneCtx.fillStyle = `rgba(255, 221, 148, ${0.26 + roadPulse * 0.14})`;
    for (let x = 28; x < WORLD.width; x += 118) {
      sceneCtx.fillRect(x, 532, 56, 5);
    }

    sceneCtx.fillStyle = "rgba(255,255,255,0.05)";
    sceneCtx.fillRect(0, 486, WORLD.width, 2);
    sceneCtx.fillRect(0, 584, WORLD.width, 2);

    sceneCtx.fillStyle = "rgba(255, 170, 105, 0.14)";
    sceneCtx.fillRect(344, 424, 272, 74);
    sceneCtx.fillStyle = "rgba(255, 229, 180, 0.12)";
    sceneCtx.fillRect(382, 436, 196, 34);
    sceneCtx.fillStyle = `rgba(255, 184, 111, ${0.08 + lampPulse * 0.06})`;
    sceneCtx.fillRect(0, 392, WORLD.width, 126);

    const entryPulse = (Math.sin(now / 260) + 1) / 2;
    const doorGlow = sceneCtx.createRadialGradient(480, 420, 12, 480, 420, 94);
    doorGlow.addColorStop(0, `rgba(112, 235, 255, ${0.32 + entryPulse * 0.14})`);
    doorGlow.addColorStop(0.45, `rgba(255, 207, 103, ${0.18 + entryPulse * 0.08})`);
    doorGlow.addColorStop(1, "rgba(255, 207, 103, 0)");
    sceneCtx.fillStyle = doorGlow;
    sceneCtx.beginPath();
    sceneCtx.ellipse(480, 420, 110, 58, 0, 0, Math.PI * 2);
    sceneCtx.fill();

    sceneCtx.strokeStyle = `rgba(112, 235, 255, ${0.54 + entryPulse * 0.24})`;
    sceneCtx.lineWidth = 3;
    sceneCtx.strokeRect(434, 396, 92, 56);
    sceneCtx.strokeStyle = `rgba(255, 214, 122, ${0.48 + entryPulse * 0.18})`;
    sceneCtx.strokeRect(444, 406, 72, 36);

    sceneCtx.fillStyle = "rgba(10, 8, 18, 0.46)";
    sceneCtx.fillRect(404, 360, 152, 26);
    sceneCtx.strokeStyle = "rgba(112, 235, 255, 0.34)";
    sceneCtx.lineWidth = 2;
    sceneCtx.strokeRect(404, 360, 152, 26);

    sceneCtx.fillStyle = "rgba(0,0,0,0.24)";
    sceneCtx.fillRect(146, 560, 104, 24);
    sceneCtx.fillRect(736, 560, 120, 26);

    sceneCtx.fillStyle = "#2a1c27";
    sceneCtx.fillRect(154, 516, 20, 42);
    sceneCtx.fillRect(176, 526, 26, 32);
    sceneCtx.fillStyle = "#f0c79f";
    sceneCtx.fillRect(158, 508 + drunkBob, 10, 10);
    sceneCtx.fillStyle = "#8b5cff";
    sceneCtx.fillRect(156, 520, 14, 16);
    sceneCtx.fillStyle = "#ffca6b";
    sceneCtx.fillRect(198, 520, 6, 18);
    sceneCtx.fillRect(202, 514, 2, 5);

    sceneCtx.fillStyle = "#3d2a1f";
    sceneCtx.fillRect(748, 520, 28, 16);
    sceneCtx.fillRect(776, 524, 22, 12);
    sceneCtx.fillStyle = "#7a5135";
    sceneCtx.fillRect(804, 522, 18, 14);
    sceneCtx.fillStyle = "#d3a97a";
    sceneCtx.fillRect(754, 512, 12, 9);
    sceneCtx.fillRect(782, 516, 11, 9);
    sceneCtx.fillRect(808, 514, 10, 8);

    sceneCtx.fillStyle = "#1d151f";
    sceneCtx.fillRect(674, 540, 28, 12);
    sceneCtx.fillRect(700, 546, 14, 8);
    sceneCtx.fillStyle = "#8a6a52";
    sceneCtx.fillRect(680, 534, 12, 9);
    sceneCtx.fillRect(696 + dogTail * 0.15, 542, 10, 3);
    sceneCtx.fillStyle = "#ffca6b";
    sceneCtx.fillRect(708, 538, 3, 3);

    sceneCtx.fillStyle = "#241722";
    sceneCtx.fillRect(612, 548, 24, 10);
    sceneCtx.fillRect(632, 552, 10, 7);
    sceneCtx.fillStyle = "#7f5d49";
    sceneCtx.fillRect(618, 542, 9, 8);
    sceneCtx.fillRect(638 + dogTail * 0.12, 548, 7, 3);

    sceneCtx.fillStyle = "#5c422f";
    sceneCtx.fillRect(96, 446, 112, 26);
    sceneCtx.fillStyle = `rgba(255, 193, 102, ${0.32 + signGlow * 0.18})`;
    sceneCtx.fillRect(100, 450, 104, 18);
    sceneCtx.fillStyle = "#1f1020";
    sceneCtx.fillRect(104, 454, 12, 10);
    sceneCtx.fillRect(118, 454, 10, 10);
    sceneCtx.fillRect(130, 454, 10, 10);
    sceneCtx.fillRect(144, 454, 10, 10);
    sceneCtx.fillRect(158, 454, 10, 10);
    sceneCtx.fillRect(170, 454, 10, 10);
    sceneCtx.fillRect(182, 454, 10, 10);
    sceneCtx.fillRect(194, 454, 8, 10);

    sceneCtx.fillStyle = "rgba(0,0,0,0.28)";
    sceneCtx.fillRect(458, 484, 44, 82);
    sceneCtx.fillStyle = "#15131a";
    sceneCtx.fillRect(462, 486, 34, 46);
    sceneCtx.fillRect(466, 530, 26, 30);
    sceneCtx.fillStyle = "#e9c39f";
    sceneCtx.fillRect(472, 476 + drunkBob * 0.3, 16, 16);
    sceneCtx.fillStyle = "#242630";
    sceneCtx.fillRect(468, 496, 24, 22);
    sceneCtx.fillStyle = "#111216";
    sceneCtx.fillRect(468, 538, 9, 22);
    sceneCtx.fillRect(481, 538, 9, 22);
    sceneCtx.fillStyle = "#ffca6b";
    sceneCtx.fillRect(466, 502, 4, 10);
    sceneCtx.fillRect(490, 502, 4, 10);
    sceneCtx.fillStyle = "#dfe9ff";
    sceneCtx.fillRect(474, 483 + drunkBob * 0.2, 4, 3);
    sceneCtx.fillRect(482, 483 + drunkBob * 0.2, 4, 3);

    sceneCtx.fillStyle = "rgba(255, 214, 153, 0.12)";
    sceneCtx.fillRect(446, 472, 68, 108);

    sceneCtx.fillStyle = "#463228";
    sceneCtx.fillRect(820, 450, 52, 24);
    sceneCtx.fillStyle = "#24161f";
    sceneCtx.fillRect(826, 456, 40, 12);
    sceneCtx.fillStyle = `rgba(255, 187, 102, ${0.2 + signGlow * 0.1})`;
    sceneCtx.fillRect(822, 448, 48, 2);

    sceneCtx.fillStyle = "rgba(0,0,0,0.22)";
    sceneCtx.fillRect(422, 564, 148, 20);
    sceneCtx.fillRect(576, 552, 98, 18);

    sceneCtx.fillStyle = "#261920";
    sceneCtx.fillRect(434, 534, 22, 28);
    sceneCtx.fillRect(454, 542, 16, 20);
    sceneCtx.fillStyle = "#f2c7a6";
    sceneCtx.fillRect(438, 526 + drunkBob * 0.5, 10, 10);
    sceneCtx.fillStyle = "#6aa8ff";
    sceneCtx.fillRect(437, 538, 12, 12);
    sceneCtx.fillStyle = "#ffca6b";
    sceneCtx.fillRect(457, 538, 5, 14);

    sceneCtx.fillStyle = "#1a1419";
    sceneCtx.fillRect(588, 544, 30, 10);
    sceneCtx.fillRect(612, 548, 12, 8);
    sceneCtx.fillStyle = "#8a6a52";
    sceneCtx.fillRect(592, 536, 10, 8);
    sceneCtx.fillRect(618 + dogTail * 0.14, 544, 8, 3);
    sceneCtx.fillStyle = "#f4c59f";
    sceneCtx.fillRect(604, 536, 6, 6);

    sceneCtx.fillStyle = "rgba(255, 205, 134, 0.12)";
    sceneCtx.beginPath();
    sceneCtx.moveTo(462, 430);
    sceneCtx.lineTo(408, 640);
    sceneCtx.lineTo(620, 640);
    sceneCtx.lineTo(532, 430);
    sceneCtx.closePath();
    sceneCtx.fill();

    sceneCtx.restore();
  }

  function drawExteriorTraffic() {
    if (runtime.scene !== "exterior" || !runtime.exteriorTraffic.length) return;
    runtime.exteriorTraffic
      .slice()
      .sort((a, b) => a.y - b.y)
      .forEach((vehicle) => {
        if (vehicle.wait > 0) return;
        if (vehicle.kind === "moto") {
          drawExteriorMotorbike(vehicle);
        } else {
          drawExteriorCar(vehicle);
        }
      });
  }

  function drawExteriorCar(vehicle) {
    const x = vehicle.x;
    const y = vehicle.y;
    const width = vehicle.length;
    const height = 28;
    const front = vehicle.dir > 0 ? x + width : x;
    sceneCtx.save();
    if (vehicle.dir < 0) {
      sceneCtx.translate(x + width / 2, y + height / 2);
      sceneCtx.scale(-1, 1);
      sceneCtx.translate(-(x + width / 2), -(y + height / 2));
    }
    sceneCtx.fillStyle = "rgba(0,0,0,0.18)";
    sceneCtx.beginPath();
    sceneCtx.ellipse(x + width / 2, y + height + 8, width * 0.52, 8, 0, 0, Math.PI * 2);
    sceneCtx.fill();
    sceneCtx.fillStyle = vehicle.dir > 0 ? "rgba(255, 226, 165, 0.16)" : "rgba(255, 110, 92, 0.14)";
    sceneCtx.fillRect(vehicle.dir > 0 ? x + width - 4 : x - 26, y + 10, 30, 8);
    sceneCtx.fillStyle = vehicle.color;
    sceneCtx.fillRect(x + 4, y + 8, width - 8, height - 8);
    sceneCtx.fillRect(x + 18, y, width - 36, 14);
    sceneCtx.fillStyle = "#101420";
    sceneCtx.fillRect(x + 22, y + 2, width - 44, 10);
    sceneCtx.fillStyle = "#f7f2d5";
    sceneCtx.fillRect(front - 6, y + 12, 4, 5);
    sceneCtx.fillStyle = "#ff7a59";
    sceneCtx.fillRect(vehicle.dir > 0 ? x + 2 : x + width - 6, y + 12, 4, 5);
    sceneCtx.fillStyle = "#0f1118";
    sceneCtx.fillRect(x + 12, y + height - 6, 12, 6);
    sceneCtx.fillRect(x + width - 24, y + height - 6, 12, 6);
    sceneCtx.restore();
  }

  function drawExteriorMotorbike(vehicle) {
    const x = vehicle.x;
    const y = vehicle.y;
    const length = vehicle.length;
    const enginePulse = (Math.sin(performance.now() / 88 + x * 0.01) + 1) / 2;
    sceneCtx.save();
    if (vehicle.dir < 0) {
      sceneCtx.translate(x + length / 2, y + 12);
      sceneCtx.scale(-1, 1);
      sceneCtx.translate(-(x + length / 2), -(y + 12));
    }
    sceneCtx.fillStyle = "rgba(0,0,0,0.18)";
    sceneCtx.beginPath();
    sceneCtx.ellipse(x + length / 2, y + 24, 22, 6, 0, 0, Math.PI * 2);
    sceneCtx.fill();
    sceneCtx.fillStyle = "#0f1118";
    sceneCtx.beginPath();
    sceneCtx.arc(x + 10, y + 18, 6, 0, Math.PI * 2);
    sceneCtx.arc(x + length - 10, y + 18, 6, 0, Math.PI * 2);
    sceneCtx.fill();
    sceneCtx.fillStyle = vehicle.color;
    sceneCtx.fillRect(x + 10, y + 8, length - 20, 5);
    sceneCtx.fillRect(x + 16, y + 3, 14, 7);
    sceneCtx.fillStyle = "#f4c59f";
    sceneCtx.fillRect(x + 24, y - 7, 6, 10);
    sceneCtx.fillStyle = "#1f2330";
    sceneCtx.fillRect(x + 20, y - 1, 16, 6);
    sceneCtx.fillRect(x + length - 16, y + 2, 3, 8);
    sceneCtx.fillStyle = "#f7f2d5";
    sceneCtx.fillRect(x + length - 10, y + 8, 3, 3);
    sceneCtx.fillStyle = `rgba(255, 205, 122, ${0.16 + enginePulse * 0.18})`;
    sceneCtx.fillRect(x + length - 7, y + 7, 12, 5);
    sceneCtx.restore();
  }

  function spawnNpcBubble() {
    if (!runtime.npcs.length || runtime.scene !== "interior") return;
    const busyNpcs = runtime.npcBubbles.map((bubble) => bubble.npcId);
    const available = runtime.npcs.filter((npc) => !busyNpcs.includes(npc.id) && Array.isArray(npc.lines) && npc.lines.length);
    const pool = available.length ? available : runtime.npcs;
    const npc = pool[Math.floor(Math.random() * pool.length)];
    const text = pickNpcLine(npc);
    if (!text) return;
    pushNpcBubble(npc.id, text, randomBetween(3.6, 5.4));
  }

  function updateNpcBubbles(delta) {
    runtime.npcBubbles = runtime.npcBubbles
      .map((bubble) => ({
        ...bubble,
        life: bubble.life - delta
      }))
      .filter((bubble) => bubble.life > 0);
  }

  function updateStreetBubbles(delta) {
    runtime.streetBubbles = runtime.streetBubbles
      .map((bubble) => ({
        ...bubble,
        life: bubble.life - delta
      }))
      .filter((bubble) => bubble.life > 0);
  }

  function drawInteriorNpcs() {
    if (runtime.scene !== "interior") return;

    runtime.npcs
      .slice()
      .sort((a, b) => a.y - b.y)
      .forEach((npc) => {
        if (npc.id === "garcom-vito") return;
        drawPlayerSprite(
          sceneCtx,
          npc.x - 14,
          npc.y - 42,
          2,
          npc.facing,
          npc.walkFrame,
          PALETTES[npc.archetype] || PALETTES.neon,
          false
        );
        drawNpcProp(npc);
      });
  }

  function drawNpcProp(npc) {
    sceneCtx.save();
    const polishOffset = Math.sin(performance.now() / 180) * 2;
    if (npc.prop === "drink") {
      sceneCtx.fillStyle = "#fff1c8";
      sceneCtx.fillRect(npc.x + 8, npc.y - 18, 6, 10);
      sceneCtx.fillStyle = "#ff8f62";
      sceneCtx.fillRect(npc.x + 8, npc.y - 12, 6, 4);
      sceneCtx.fillStyle = "rgba(255,255,255,0.45)";
      sceneCtx.fillRect(npc.x + 9, npc.y - 17, 2, 2);
    } else if (npc.prop === "bottle") {
      sceneCtx.fillStyle = "#7de4b8";
      sceneCtx.fillRect(npc.x + 10, npc.y - 20, 4, 12);
      sceneCtx.fillStyle = "#d6f8ef";
      sceneCtx.fillRect(npc.x + 11, npc.y - 24, 2, 4);
    } else if (npc.prop === "glasses") {
      sceneCtx.fillStyle = "rgba(220, 248, 255, 0.65)";
      sceneCtx.fillRect(npc.x + 6, npc.y - 20, 5, 8);
      sceneCtx.fillRect(npc.x + 13, npc.y - 20, 5, 8);
      sceneCtx.fillStyle = "#d9f2ff";
      sceneCtx.fillRect(npc.x + 7, npc.y - 21, 3, 1);
      sceneCtx.fillRect(npc.x + 14, npc.y - 21, 3, 1);
      sceneCtx.fillStyle = "#ffca6b";
      sceneCtx.fillRect(npc.x + 10 + polishOffset, npc.y - 17, 6, 3);
      sceneCtx.fillStyle = "rgba(255,255,255,0.35)";
      sceneCtx.fillRect(npc.x + 8, npc.y - 18, 1, 4);
      sceneCtx.fillRect(npc.x + 15, npc.y - 18, 1, 4);
    }
    sceneCtx.restore();
  }

  function drawNpcBubbles() {
    if (runtime.scene !== "interior" || !runtime.npcBubbles.length) return;
    let stackY = -999;

    runtime.npcBubbles.forEach((bubble) => {
      const npc = runtime.npcs.find((entry) => entry.id === bubble.npcId);
      if (!npc) return;

      const alpha = Math.max(0, Math.min(1, bubble.life / 0.6, 1));
      sceneCtx.save();
      sceneCtx.globalAlpha = Math.min(0.96, bubble.life > 0.8 ? 0.96 : bubble.life / 0.8);
      sceneCtx.font = "12px Chakra Petch";
      const width = Math.min(210, Math.ceil(sceneCtx.measureText(bubble.text).width) + 18);
      let bubbleY = npc.y - 76;
      if (bubbleY > stackY - 24) bubbleY = stackY - 26;
      stackY = bubbleY;
      sceneCtx.fillStyle = "rgba(8, 7, 18, 0.9)";
      sceneCtx.strokeStyle = alpha > 0.4 ? "rgba(112, 235, 255, 0.55)" : "rgba(255,255,255,0.24)";
      sceneCtx.lineWidth = 1;
      sceneCtx.fillRect(npc.x - width / 2, bubbleY, width, 22);
      sceneCtx.strokeRect(npc.x - width / 2, bubbleY, width, 22);
      sceneCtx.beginPath();
      sceneCtx.moveTo(npc.x - 6, bubbleY + 22);
      sceneCtx.lineTo(npc.x + 2, bubbleY + 22);
      sceneCtx.lineTo(npc.x - 2, bubbleY + 28);
      sceneCtx.closePath();
      sceneCtx.fill();
      sceneCtx.stroke();
      sceneCtx.fillStyle = "#f7f2d5";
      sceneCtx.fillText(bubble.text, npc.x - width / 2 + 9, bubbleY + 15);
      sceneCtx.restore();
    });
  }

  function drawStageSinger(now) {
    if (runtime.scene !== "interior") return;

    const sway = Math.sin(now / 250) * 2.2;
    const x = 862;
    const y = 150;

    sceneCtx.save();
    sceneCtx.fillStyle = "rgba(0, 0, 0, 0.22)";
    sceneCtx.beginPath();
    sceneCtx.ellipse(x, y + 24, 22, 8, 0, 0, Math.PI * 2);
    sceneCtx.fill();
    sceneCtx.restore();

    if (images.stageSinger?.naturalWidth) {
      sceneCtx.drawImage(images.stageSinger, x - 32, y - 48 + sway, 64, 96);
      return;
    }

    sceneCtx.save();
    sceneCtx.fillStyle = "#ff84c3";
    sceneCtx.fillRect(x - 14, y - 20 + sway, 28, 56);
    sceneCtx.fillStyle = "#f0c7a4";
    sceneCtx.fillRect(x - 12, y - 12 + sway, 24, 16);
    sceneCtx.fillStyle = "#7a2d58";
    sceneCtx.fillRect(x - 14, y + 4 + sway, 28, 32);
    sceneCtx.fillStyle = "#d8f6ff";
    sceneCtx.fillRect(x + 18, y - 16 + sway, 4, 28);
    sceneCtx.fillStyle = "#f5e7c4";
    sceneCtx.fillRect(x + 15, y - 22 + sway, 10, 8);
    sceneCtx.restore();
  }

  function drawStreetBubbles() {
    if (runtime.scene !== "exterior" || !runtime.streetBubbles.length) return;
    let stackY = -999;

    runtime.streetBubbles.forEach((bubble) => {
      const walker = runtime.exteriorWalkers.find((entry) => entry.id === bubble.walkerId);
      if (!walker) return;

      const alpha = Math.max(0, Math.min(1, bubble.life / 0.6, 1));
      sceneCtx.save();
      sceneCtx.globalAlpha = Math.min(0.96, bubble.life > 0.8 ? 0.96 : bubble.life / 0.8);
      sceneCtx.font = "12px Chakra Petch";
      const width = Math.min(228, Math.ceil(sceneCtx.measureText(bubble.text).width) + 18);
      let bubbleY = walker.y - 78;
      if (bubbleY > stackY - 24) bubbleY = stackY - 28;
      stackY = bubbleY;
      sceneCtx.fillStyle = "rgba(8, 9, 20, 0.9)";
      sceneCtx.strokeStyle = alpha > 0.4 ? "rgba(255, 202, 107, 0.58)" : "rgba(255,255,255,0.24)";
      sceneCtx.lineWidth = 1;
      sceneCtx.fillRect(walker.x - width / 2, bubbleY, width, 22);
      sceneCtx.strokeRect(walker.x - width / 2, bubbleY, width, 22);
      sceneCtx.beginPath();
      sceneCtx.moveTo(walker.x - 5, bubbleY + 22);
      sceneCtx.lineTo(walker.x + 3, bubbleY + 22);
      sceneCtx.lineTo(walker.x - 1, bubbleY + 28);
      sceneCtx.closePath();
      sceneCtx.fill();
      sceneCtx.stroke();
      sceneCtx.fillStyle = "#f7f2d5";
      sceneCtx.fillText(bubble.text, walker.x - width / 2 + 9, bubbleY + 15);
      sceneCtx.restore();
    });
  }

  function updateSingerBursts(delta) {
    if (runtime.scene === "interior" && Math.random() < delta * 0.95) {
      runtime.singerBursts.push({
        x: 838 + Math.random() * 18,
        y: 110 + Math.random() * 14,
        life: 1.15
      });
      runtime.singerBursts = runtime.singerBursts.slice(-6);
    }

    runtime.singerBursts = runtime.singerBursts
      .map((burst) => ({
        ...burst,
        y: burst.y - delta * 18,
        life: burst.life - delta
      }))
      .filter((burst) => burst.life > 0);
  }

  function drawSingerBursts() {
    if (!runtime.singerBursts.length) return;

    runtime.singerBursts.forEach((burst) => {
      const alpha = Math.max(0, Math.min(1, burst.life / 0.9));
      sceneCtx.save();
      sceneCtx.globalAlpha = alpha;
      sceneCtx.fillStyle = "#ff6fae";
      sceneCtx.fillRect(burst.x, burst.y, 8, 6);
      sceneCtx.fillRect(burst.x + 8, burst.y, 8, 6);
      sceneCtx.fillRect(burst.x + 2, burst.y + 4, 12, 6);
      sceneCtx.fillRect(burst.x + 4, burst.y + 8, 8, 4);
      sceneCtx.fillStyle = "#ffd8eb";
      sceneCtx.fillRect(burst.x + 3, burst.y + 1, 2, 2);
      sceneCtx.fillRect(burst.x + 11, burst.y + 1, 2, 2);
      sceneCtx.restore();
    });
  }

  function renderSceneHud() {
    const focus = runtime.prompt || getSceneFallbackFocus();
    const nearbyLabel = runtime.prompt ? runtime.prompt.label : "corredor livre";
    const nearbyNote = runtime.prompt ? getInteractionActionLabel(runtime.prompt) : "circule pelo pub";
    const bundle = getFocusBundle(focus);

    setText(refs.sceneTitle, SCENE_HINTS[runtime.scene]);
    setText(
      refs.sceneHint,
      runtime.scene === "exterior"
        ? "veja a fachada, a estrada e siga para a entrada principal"
        : "o salão está aberto para você"
    );
    setText(refs.sceneNearby, nearbyLabel);
    setText(refs.sceneNearbyNote, nearbyNote);
    setText(refs.scenePrompt, getWorldPromptText());
    setText(refs.sceneDescription, bundle.description);
    setText(refs.hudCoins, formatCoins(state.wallet.coins));

    setText(refs.focusTitle, bundle.title);
    setText(refs.focusCopy, bundle.copy);
    setText(refs.focusMeta, bundle.meta);
    setText(refs.focusScene, SCENE_HINTS[runtime.scene]);
    renderFocusStakes(focus);

    refs.focusAction.disabled = !runtime.prompt;
    refs.focusAction.textContent = runtime.prompt ? getInteractionButtonText(runtime.prompt) : "Chegue mais perto";

    refs.venueCards.forEach((card) => {
      const key = card.dataset.venueCard;
      card.classList.toggle("is-active", key === bundle.venueKey);
    });
  }

  function getSceneFallbackFocus() {
    if (runtime.scene === "exterior") {
      return {
        label: "Entrada principal",
        venueKey: "door",
        type: "door"
      };
    }

    return {
      label: "Salao principal",
      venueKey: "",
      type: "ambient"
    };
  }

  function getFocusBundle(focus) {
    if (!focus) {
      return {
        title: "Salao principal",
        copy: "Caminhe pelo pub e pare onde a noite parecer mais promissora.",
        meta: "ande pelo salão",
        description: "Mesas, palco e jukebox mudam o clima quando você chega perto.",
        venueKey: ""
      };
    }

    if (focus.type === "door") {
      const hasGoogle = hasGoogleSession();
      const hasAvatar = hasAvatarProfile();
      return {
        title: "Entrada principal",
        copy: canEnterPubGame()
          ? "A fachada já foi apresentada. Agora a porta está aberta para levar você ao bar em tela cheia."
          : hasGoogle
            ? "Você já viu a frente do pub. Falta só montar o avatar para a entrada abrir valendo."
            : "Aqui a ideia é simples: primeiro ver a fachada e a entrada, depois ligar Google, montar avatar e entrar.",
        meta: canEnterPubGame() ? "entrar no game" : hasGoogle ? "montar avatar" : "conectar google",
        description: canEnterPubGame()
          ? "Sempre que quiser, a porta marcada leva você do lado de fora para o salão em modo full tela."
          : hasAvatar
            ? "Seu avatar já existe, mas você precisa reconectar o Google para entrar."
            : "A entrada primeiro apresenta o ambiente. Depois prepara conta, personagem e carteira antes do jogo.",
        venueKey: "door"
      };
    }

    if (focus.type === "exit") {
      return {
        title: "Porta do salao",
        copy: "Daqui você volta para a calçada e vê o pub inteiro aceso outra vez.",
        meta: "voltar para fora",
        description: "Quando quiser respirar um pouco, a rua continua logo ali.",
        venueKey: "door"
      };
    }

    if (focus.type === "stage") {
      return {
        title: "Cantora do palco",
        copy: "O palco segura o clima do salão. Quando ela canta, o pub muda de tom.",
        meta: "chamar a cantora",
        description: "A trilha dancante do bar casa com a cantora e deixa a abertura da noite mais viva.",
        venueKey: "stage"
      };
    }

    if (focus.type === "shop") {
      const activeDrink = getActiveDrinkDefinition();
      return {
        title: "Garcom do bar",
        copy: activeDrink
          ? `${activeDrink.name} ja esta pronto para a proxima rodada valendo.`
          : "Bebidas com sorte pequena, acessorios do avatar e lobbies das mesas saindo direto do balcao.",
        meta: activeDrink ? "bebida equipada" : "abrir catalogo",
        description: "As bebidas podem puxar um fiapo de sorte ou azar. Os acessorios visuais ficam com voce.",
        venueKey: "shop"
      };
    }

    if (focus.type === "tips") {
      return {
        title: "Garcom dos copos",
        copy: "Ele fica polindo os copos e soltando dicas curtas sobre os segredos do salao.",
        meta: "ouvir dica",
        description: "Boa parte das pistas de fisica, ritmo e leitura das mesas passa primeiro por esse balcao.",
        venueKey: "waiter"
      };
    }

    if (focus.type === "jukebox") {
      const currentTrack = getCurrentJukeboxTrack();
      return {
        title: "Jukebox",
        copy: `A jukebox puxa o salao para um clima arcade mais rapido. Agora toca "${currentTrack.name}".`,
        meta: runtime.audio.enabled ? "desligar a música" : "ligar a música",
        description: "Escolha uma das 5 faixas da playlist ou use o botão do topo para desligar se quiser silencio.",
        venueKey: "jukebox"
      };
    }

    if (focus.type === "game" && TABLE_META[focus.gameId]) {
      return {
        title: TABLE_META[focus.gameId].label,
        copy: TABLE_META[focus.gameId].sceneCopy,
        meta: "abrir essa mesa",
        description: TABLE_META[focus.gameId].description,
        venueKey: focus.gameId
      };
    }

    return {
      title: focus.label || "Salao principal",
      copy: "Caminhe pelo pub e veja onde a sua noite combina mais.",
      meta: "explorar o salão",
      description: "O pub mistura música, conversa, palco e mesas para todos os ritmos.",
      venueKey: focus.venueKey || ""
    };
  }

  function renderFocusStakes(focus) {
    if (!refs.focusStakes) return;

    if (focus?.type === "jukebox") {
      refs.focusStakes.innerHTML = JUKEBOX_TRACKS
        .map((track, index) => {
          const isActive = index === runtime.audio.currentTrackIndex;
          return `<button class="pubpaid-stake-button ${isActive ? "is-active" : ""}" type="button" data-jukebox-track="${escapeHtml(track.id)}">${escapeHtml(track.name)}</button>`;
        })
        .join("");
      return;
    }

    if (!focus || focus.type !== "game") {
      refs.focusStakes.innerHTML = "";
      return;
    }

    refs.focusStakes.innerHTML = TABLE_META[focus.gameId].stakes
      .map((stake) => `<span class="pubpaid-game-chip">${formatCoins(stake)} entrada</span>`)
      .join("");
  }

  function getWorldPromptText() {
    if (runtime.message.text) return runtime.message.text;
    if (!runtime.prompt) {
      return runtime.scene === "exterior"
        ? "veja a fachada e chegue até a porta principal"
        : "circule pelo salão e escolha o seu próximo passo";
    }

    if (runtime.prompt.type === "door") {
      if (canEnterPubGame()) return "pressione E para entrar no game em tela cheia";
      if (hasGoogleSession()) return "pressione E para montar o avatar";
      return "pressione E para conectar Google e começar";
    }
    if (runtime.prompt.type === "exit") return "pressione E para voltar para a calçada";
    if (runtime.prompt.type === "stage") return "pressione E para chamar a cantora";
    if (runtime.prompt.type === "shop") return "pressione E para abrir a loja premium";
    if (runtime.prompt.type === "jukebox") {
      return runtime.audio.enabled
        ? "pressione E para desligar a trilha"
        : "pressione E para ligar a trilha";
    }
    if (runtime.prompt.type === "game") return `pressione E para sentar na ${TABLE_META[runtime.prompt.gameId].shortLabel}`;
    return "pressione E para continuar";
  }

  function getInteractionActionLabel(interaction) {
    if (!interaction) return "";
    if (interaction.type === "game") return "mesa pronta";
    if (interaction.type === "stage") return "palco em destaque";
    if (interaction.type === "shop") return "catalogo premium";
    if (interaction.type === "jukebox") return runtime.audio.enabled ? "som no ar" : "som em pausa";
    if (interaction.type === "door") return "entrada";
    if (interaction.type === "exit") return "saída";
    return "por perto";
  }

  function getInteractionButtonText(interaction) {
    if (!interaction) return "Chegue mais perto";
    if (interaction.type === "game") return `Abrir ${TABLE_META[interaction.gameId].label}`;
    if (interaction.type === "stage") return "Chamar cantora";
    if (interaction.type === "shop") return "Abrir loja premium";
    if (interaction.type === "tips") return "Ouvir dica do garcom";
    if (interaction.type === "jukebox") return runtime.audio.enabled ? "Desligar musica" : "Ligar musica";
    if (interaction.type === "door") {
      if (canEnterPubGame()) return "Entrar no game";
      if (hasGoogleSession()) return "Montar avatar";
      return "Conectar Google";
    }
    if (interaction.type === "exit") return "Voltar para fora";
    return "Interagir";
  }

  function setWorldMessage(text, durationMs) {
    runtime.message.text = text;
    runtime.message.expiresAt = performance.now() + durationMs;
  }

  function renderProfile() {
    const hasGoogle = hasGoogleSession();
    const registered = hasAvatarProfile();
    const favorite = TABLE_META[state.profile.favorite];
    setText(refs.profileName, registered ? state.profile.name : runtime.demoMode ? "Visitante demo" : "Visitante da calcada");
    setText(
      refs.profileRole,
      registered
        ? `${PALETTES[state.profile.archetype].label}${hasUpgrade("vip-title") ? " VIP" : ""} • ${favorite?.label || "PubPaid"}`
        : runtime.demoMode
          ? "Demo aberta sem carteira real"
        : hasGoogle
          ? "Google conectado, avatar pendente"
          : "Ainda do lado de fora"
    );
    setText(
      refs.profileMotto,
      registered
        ? state.profile.motto || "Entrou no pub, encontrou sua mesa e deixou a noite seguir."
        : runtime.demoMode
          ? "Você entrou só para testar o salão. Conecte o Google para liberar personagem, saldo e caixa Pix."
        : hasGoogle
          ? "A conta Google já está pronta. Falta escolher nome, estilo e mesa favorita."
          : "Chegue até a porta principal para conectar o Google, criar seu personagem e começar a noite."
    );

    setText(refs.statCoins, formatCoins(state.wallet.coins));
    setText(refs.statWins, String(state.wallet.wins));
    setText(refs.statLosses, String(state.wallet.losses));
    setText(refs.statBest, formatCoins(state.wallet.bestWin));

    drawAvatarPreview();
    renderSplashIdentity();
    renderProfileLoadout();
    syncCashierState();
  }

  function renderSplashIdentity() {
    const hasGoogle = hasGoogleSession();
    const hasAvatar = hasAvatarProfile();
    const splashBadge = refs.splashPlayerBadge;
    const avatarHost = refs.splashPlayerAvatar;
    if (splashBadge) {
      splashBadge.hidden = !hasGoogle;
    }

    if (avatarHost) {
      const photo = String(state.profile.googlePicture || "").trim();
      const palette = PALETTES[normalizeArchetype(state.profile.archetype)] || PALETTES.neon;
      avatarHost.style.backgroundImage = photo ? `url("${photo.replace(/"/g, '\\"')}")` : "";
      avatarHost.style.backgroundColor = palette.background;
    }

    setText(refs.splashPlayerKicker, hasAvatar ? "avatar reconhecido" : hasGoogle ? "google conectado" : "visitante na rua");
    setText(
      refs.splashPlayerName,
      hasGoogle ? String(state.profile.name || state.profile.googleEmail || "Jogador Google").slice(0, 28) : "Visitante da calçada"
    );
    setText(
      refs.splashPlayerNote,
      hasAvatar
        ? "Sua conta já apareceu na fachada. A porta agora chama você para entrar."
        : hasGoogle
          ? "Seu rosto já apareceu na entrada. Falta montar o avatar para o PubPaid liberar geral."
          : "Conecte o Google para a porta reconhecer você."
    );

    setText(refs.splashEntryRoad, hasAvatar ? "porta liberada" : hasGoogle ? "google na porta" : "veja a estrada");
    setText(refs.splashEntryTitle, hasAvatar ? "Enter gamer" : hasGoogle ? "Monte o avatar" : "Entrada principal");
    setText(
      refs.splashEntryNote,
      hasAvatar
        ? "Seu avatar já está na noite. Entre no bar quando quiser."
        : hasGoogle
          ? "O login foi reconhecido. Agora finalize o personagem para destravar o salão."
          : "Primeiro conheça a fachada. Depois entre no bar."
    );
  }

  function syncCashierState() {
    const walletReady = canUseRealWallet();
    if (refs.generateDepositButton) refs.generateDepositButton.disabled = !walletReady;
    if (refs.registerDepositButton) refs.registerDepositButton.disabled = !walletReady;
    if (refs.requestWithdrawalButton) refs.requestWithdrawalButton.disabled = !walletReady;

    if (!walletReady && refs.depositFeedback) {
      refs.depositFeedback.textContent = hasGoogleSession()
        ? "Finalize o avatar para liberar o caixa real."
        : "O caixa real aparece depois do login Google e do avatar.";
    }

    if (!walletReady && refs.withdrawFeedback) {
      refs.withdrawFeedback.textContent = runtime.demoMode
        ? "A visita guiada nao libera deposito nem retirada."
        : "A retirada so abre para conta Google identificada.";
    }
  }

  function drawAvatarPreview() {
    const canvas = refs.avatarCanvas;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;
    const palette = getPlayerPalette();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = palette.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(255,255,255,0.06)";
    ctx.fillRect(8, 8, canvas.width - 16, canvas.height - 16);
    drawPlayerSprite(ctx, 34, 18, 4, "down", 0, palette, true);
    const activeDrink = getActiveDrinkDefinition();
    if (activeDrink) {
      drawInventorySprite(ctx, 80, 18, "drink", activeDrink.id);
    }
  }

  function renderProfileLoadout() {
    if (!refs.profileUpgrades) return;
    const owned = getOwnedUpgrades();
    const activeDrink = getActiveDrinkDefinition();

    if (!owned.length && !activeDrink) {
      refs.profileUpgrades.innerHTML =
        '<p class="pubpaid-loadout-empty">Nenhum acessorio comprado ainda. Fale com o garcom para liberar o visual do avatar.</p>';
      return;
    }

    const upgradeMarkup = owned
      .map(
        (upgrade) => `
          <article class="pubpaid-loadout-item">
            <span class="pubpaid-loadout-sprite">${renderInventorySpriteMarkup("upgrade", upgrade.id)}</span>
            <span class="pubpaid-loadout-copy">
              <strong>${escapeHtml(upgrade.name)}</strong>
              <small>acessório equipado</small>
            </span>
          </article>
        `
      )
      .join("");
    const activeDrinkMarkup = activeDrink
      ? `
          <article class="pubpaid-loadout-item is-drink">
            <span class="pubpaid-loadout-sprite">${renderInventorySpriteMarkup("drink", activeDrink.id)}</span>
            <span class="pubpaid-loadout-copy">
              <strong>${escapeHtml(activeDrink.name)}</strong>
              <small>bebida ativa da próxima mesa</small>
            </span>
          </article>
        `
      : "";

    refs.profileUpgrades.innerHTML = `
      <p class="pubpaid-loadout-title">avatar equipado</p>
      <div class="pubpaid-loadout-list">
        ${upgradeMarkup}
        ${activeDrinkMarkup}
      </div>
    `;
  }

  function renderHistory() {
    if (!refs.historyList) return;

    if (!state.history.length) {
      refs.historyList.innerHTML =
        '<p class="pubpaid-history-empty">Ainda não tem nenhuma rodada por aqui. Entre no pub e veja onde a sua noite começa.</p>';
      return;
    }

    refs.historyList.innerHTML = state.history
      .slice(0, HISTORY_LIMIT)
      .map((entry) => {
        const resultClass =
          entry.result === "win" ? "is-win" : entry.result === "loss" ? "is-loss" : "is-tie";
        return `
          <article class="pubpaid-history-item ${resultClass}">
            <header>
              <strong>${escapeHtml(entry.title)}</strong>
              <time>${escapeHtml(formatDate(entry.at))}</time>
            </header>
            <p>${escapeHtml(entry.summary)}</p>
            <small>${escapeHtml(entry.amount)} • ${escapeHtml(entry.opponent)}</small>
          </article>
        `;
      })
      .join("");
  }

  function renderShopModal(feedback) {
    if (!refs.shopHost) return;

    const activeDrink = getActiveDrinkDefinition();
    const ownedUpgrades = getOwnedUpgrades();
    const gamesMarkup = Object.entries(TABLE_META)
      .map(
        ([gameId, meta]) => `
          <article class="pubpaid-shop-card pubpaid-shop-shortcut">
            <div class="pubpaid-shop-line">
              <strong>${escapeHtml(meta.label)}</strong>
              <span>${escapeHtml(meta.shortLabel)}</span>
            </div>
            <p>${escapeHtml(meta.description)}</p>
            <div class="pubpaid-card-actions">
              <button class="pubpaid-card-button" type="button" data-open-table="${escapeHtml(gameId)}">
                Abrir lobby
              </button>
            </div>
          </article>
        `
      )
      .join("");

    const drinksMarkup = DRINK_CATALOG.map((drink) => {
      const owned = clampInteger(state.shop.drinkInventory[drink.id]);
      return `
        <article class="pubpaid-shop-card">
          <div class="pubpaid-shop-art">${renderInventorySpriteMarkup("drink", drink.id)}</div>
          <div class="pubpaid-shop-line">
            <strong>${escapeHtml(drink.name)}</strong>
            <span>${escapeHtml(formatCoins(drink.price))}</span>
          </div>
          <p>${escapeHtml(drink.flavor)}</p>
          <div class="pubpaid-shop-meta">
            <span class="pubpaid-game-chip">boa sorte ${Math.round(drink.goodChance * 100)}%</span>
            <span class="pubpaid-game-chip">azar ${Math.round(drink.badChance * 100)}%</span>
            <span class="pubpaid-game-chip">estoque ${owned}</span>
          </div>
          <div class="pubpaid-card-actions">
            <button class="pubpaid-card-button" type="button" data-shop-buy="${escapeHtml(drink.id)}" data-shop-type="drink">
              Comprar
            </button>
            <button class="pubpaid-card-button" type="button" data-shop-drink="${escapeHtml(drink.id)}" ${owned ? "" : "disabled"}>
              Beber agora
            </button>
          </div>
        </article>
      `;
    }).join("");

    const upgradesMarkup = VISUAL_UPGRADES.map((upgrade) => {
      const owned = hasUpgrade(upgrade.id);
      return `
        <article class="pubpaid-shop-card">
          <div class="pubpaid-shop-art">${renderInventorySpriteMarkup("upgrade", upgrade.id)}</div>
          <div class="pubpaid-shop-line">
            <strong>${escapeHtml(upgrade.name)}</strong>
            <span>${escapeHtml(formatCoins(upgrade.price))}</span>
          </div>
          <p>${escapeHtml(upgrade.description)}</p>
          <div class="pubpaid-shop-meta">
            <span class="pubpaid-game-chip">${owned ? "ativo no personagem" : "upgrade permanente"}</span>
          </div>
          <div class="pubpaid-card-actions">
            <button class="pubpaid-card-button" type="button" data-shop-buy="${escapeHtml(upgrade.id)}" data-shop-type="upgrade" ${owned ? "disabled" : ""}>
              ${owned ? "Comprado" : "Comprar upgrade"}
            </button>
          </div>
        </article>
      `;
    }).join("");

    refs.shopHost.innerHTML = `
      <section class="pubpaid-shop-panel">
        <article class="pubpaid-game-box">
          <span class="pubpaid-game-chip">garcom premium</span>
          <h3>Catalogo da loja</h3>
          <p>Bebidas para dar um leve empurrao na sorte da proxima partida, acessorios permanentes para o avatar e atalhos para cada mesa.</p>
          <ul>
            <li>As bebidas sao consumidas quando voce bebe e valem para a proxima partida.</li>
            <li>Quanto mais cara a bebida, maior a chance de bater uma boa sorte.</li>
            <li>Azar tambem existe, mas em impacto pequeno para nao desequilibrar a mesa.</li>
          </ul>
        </article>
        <article class="pubpaid-game-box">
          <div class="pubpaid-game-chip-row">
            <span class="pubpaid-game-chip">saldo ${escapeHtml(formatCoins(state.wallet.coins))}</span>
            <span class="pubpaid-game-chip">${activeDrink ? `na mesa: ${escapeHtml(activeDrink.name)}` : "nenhuma bebida ativa"}</span>
          </div>
          <p>${activeDrink ? "A proxima mesa ja vai carregar a bebida escolhida antes da partida." : "Escolha uma bebida para deixar a proxima rodada com uma pitada de aleatoriedade."}</p>
          <div class="pubpaid-shop-meta">
            ${
              ownedUpgrades.length
                ? ownedUpgrades
                    .map((upgrade) => `<span class="pubpaid-game-chip">${escapeHtml(upgrade.name)}</span>`)
                    .join("")
                : '<span class="pubpaid-game-chip">sem acessorios no avatar</span>'
            }
          </div>
          ${feedback ? `<p class="pubpaid-feedback">${escapeHtml(feedback)}</p>` : ""}
        </article>
      </section>

      <section class="pubpaid-shop-columns">
        <div>
          <p class="pubpaid-eyebrow">bebidas</p>
          <div class="pubpaid-shop-grid">${drinksMarkup}</div>
        </div>
        <div>
          <p class="pubpaid-eyebrow">acessorios de avatar</p>
          <div class="pubpaid-shop-grid">${upgradesMarkup}</div>
        </div>
      </section>

      <section>
        <p class="pubpaid-eyebrow">mesas do garcom</p>
        <div class="pubpaid-shop-grid pubpaid-shop-games-grid">${gamesMarkup}</div>
      </section>
    `;
  }

  function renderJukeboxModal(feedback = "") {
    if (!refs.jukeboxHost) return;

    const currentTrack = getCurrentJukeboxTrack();
    const tracksMarkup = JUKEBOX_TRACKS.map((track, index) => {
      const isActive = index === runtime.audio.currentTrackIndex;
      return `
        <article class="pubpaid-shop-card ${isActive ? "is-active" : ""}">
          <div class="pubpaid-shop-line">
            <strong>${escapeHtml(track.name)}</strong>
            <span>${escapeHtml(`${track.tempoMs} ms`)}</span>
          </div>
          <p>${escapeHtml(getJukeboxTrackDescription(track.id))}</p>
          <div class="pubpaid-card-actions">
            <button class="pubpaid-card-button" type="button" data-jukebox-track="${escapeHtml(track.id)}">
              ${isActive ? "Tocando agora" : "Tocar essa"}
            </button>
          </div>
        </article>
      `;
    }).join("");

    refs.jukeboxHost.innerHTML = `
      <section class="pubpaid-shop-panel">
        <article class="pubpaid-game-box">
          <span class="pubpaid-game-chip">jukebox</span>
          <h3>Playlist do PubPaid</h3>
          <p>Escolha a trilha do salão e mude o ritmo da noite sem sair da jukebox.</p>
          <ul>
            <li>A faixa ativa muda na hora quando voce clica.</li>
            <li>Se o som estiver desligado, a jukebox liga junto com a musica escolhida.</li>
            <li>Voce pode silenciar o bar quando quiser.</li>
          </ul>
        </article>
        <article class="pubpaid-game-box">
          <div class="pubpaid-game-chip-row">
            <span class="pubpaid-game-chip">${runtime.audio.enabled ? "som ligado" : "som desligado"}</span>
            <span class="pubpaid-game-chip">faixa ${escapeHtml(currentTrack.name)}</span>
          </div>
          <p>${escapeHtml(getJukeboxTrackDescription(currentTrack.id))}</p>
          <div class="pubpaid-card-actions">
            <button class="pubpaid-card-button" type="button" data-audio-toggle>
              ${runtime.audio.enabled ? "Desligar som" : "Ligar playlist"}
            </button>
            <button class="pubpaid-card-button" type="button" data-close-modal="jukebox">
              Voltar ao salao
            </button>
          </div>
          ${feedback ? `<p class="pubpaid-feedback">${escapeHtml(feedback)}</p>` : ""}
        </article>
      </section>

      <section>
        <p class="pubpaid-eyebrow">faixas da noite</p>
        <div class="pubpaid-shop-grid">${tracksMarkup}</div>
      </section>
    `;
  }

  function getJukeboxTrackDescription(trackId) {
    const descriptions = {
      "turbo-neon": "Batida neon para deixar o pub mais aceso e mais arcade logo de cara.",
      "bar-jump": "Faixa saltada de balcão para quando o salão pede mais movimento.",
      "pixel-rush": "Corrida pixelada para noites mais rápidas e mesas com mais tensão.",
      "coin-combo": "Clima de jackpot curto, bom para puxar a energia das máquinas.",
      "final-boss-bar": "Peso de fase final para quando a noite pede um duelo mais dramático."
    };

    return descriptions[trackId] || "A jukebox empurra o clima da noite para outro ritmo.";
  }

  function handleShopBuy(itemId, itemType) {
    if (itemType === "drink") {
      const drink = DRINK_CATALOG.find((entry) => entry.id === itemId);
      if (!drink) return;
      if (state.wallet.coins < drink.price) {
        renderShopModal(`Saldo insuficiente para ${drink.name}.`);
        return;
      }
      state.wallet.coins -= drink.price;
      state.shop.drinkInventory[drink.id] = clampInteger(state.shop.drinkInventory[drink.id]) + 1;
      saveState();
      renderAll();
      renderShopModal(`${drink.name} entrou no seu estoque da noite.`);
      return;
    }

    if (itemType === "upgrade") {
      const upgrade = VISUAL_UPGRADES.find((entry) => entry.id === itemId);
      if (!upgrade) return;
      if (hasUpgrade(upgrade.id)) {
        renderShopModal(`${upgrade.name} ja esta ativo no seu personagem.`);
        return;
      }
      if (state.wallet.coins < upgrade.price) {
        renderShopModal(`Saldo insuficiente para ${upgrade.name}.`);
        return;
      }
      state.wallet.coins -= upgrade.price;
      state.shop.ownedUpgrades.push(upgrade.id);
      saveState();
      renderAll();
      renderShopModal(`${upgrade.name} foi liberado e ja aparece no salao.`);
    }
  }

  function activateDrink(drinkId) {
    const drink = DRINK_CATALOG.find((entry) => entry.id === drinkId);
    if (!drink) return;
    const owned = clampInteger(state.shop.drinkInventory[drink.id]);
    if (!owned) {
      renderShopModal("Essa bebida nao esta no seu estoque.");
      return;
    }

    state.shop.drinkInventory[drink.id] = owned - 1;
    state.shop.activeDrinkId = drink.id;
    saveState();
    renderAll();
      renderShopModal(`${drink.name} foi servida. A proxima mesa ja vai carregar esse efeito.`);
  }

  function openTableFromShop(gameId) {
    closeShopModal();
    openGameLobby(gameId);
  }

  function renderAudioButtons() {
    const currentTrack = getCurrentJukeboxTrack();
    refs.audioButtons.forEach((button) => {
      const prefix = button.closest(".pubpaid-tutorial-stage-actions") ? "Jukebox" : "Musica";
      button.textContent = runtime.audio.enabled
        ? `${prefix}: desligar (${currentTrack.name})`
        : `${prefix}: ligar playlist`;
    });
  }

  function renderAll() {
    renderProfile();
    renderHistory();
    renderAudioButtons();
    renderSceneHud();
    renderGameModal();
    if (refs.shopModal?.hidden === false) renderShopModal("");
    if (refs.jukeboxModal?.hidden === false) renderJukeboxModal("");
    syncGameModeUi();
  }

  function fillProfileForm() {
    if (!refs.profileForm) return;
    refs.profileForm.elements.namedItem("name").value = state.profile.name || "";
    refs.profileForm.elements.namedItem("archetype").value = state.profile.archetype || "neon";
    refs.profileForm.elements.namedItem("favorite").value = state.profile.favorite || "pool";
    refs.profileForm.elements.namedItem("motto").value = state.profile.motto || "";
  }

  function openProfileModal({ entryMode = false } = {}) {
    runtime.profileEntryMode = Boolean(entryMode);
    fillProfileForm();
    setText(refs.profileFeedback, "");
    refs.profileModal.hidden = false;
  }

  function openTutorialModal() {
    if (!refs.tutorialModal) return;
    refs.tutorialModal.hidden = false;
    runtime.tutorialStartedAt = performance.now();
    rememberTutorialSeen();
  }

  function closeModal(name) {
    if (name === "tutorial") {
      if (refs.tutorialModal) refs.tutorialModal.hidden = true;
      runtime.tutorialStartedAt = 0;
      return;
    }

    if (name === "profile") {
      refs.profileModal.hidden = true;
      runtime.profileEntryMode = false;
      return;
    }

    if (name === "door") {
      refs.doorModal.hidden = true;
      return;
    }

    if (name === "bad-ending") {
      refs.badEndingModal.hidden = true;
      runtime.badEndingStartedAt = 0;
      runtime.badEndingGame.active = false;
      runtime.badEndingGame.status = "idle";
      runtime.badEndingGame.obstacles = [];
      runtime.badEndingGame.boost = 0;
      return;
    }

    if (name === "jukebox") {
      closeJukeboxModal();
      return;
    }
  }

  function openShopModal() {
    renderShopModal("");
    if (refs.shopModal) refs.shopModal.hidden = false;
  }

  function closeShopModal() {
    if (refs.shopModal) refs.shopModal.hidden = true;
  }

  function openWaiterModal() {
    if (refs.waiterModal) refs.waiterModal.hidden = false;
    pushNpcBubble("garcom-vito", "Eu vendo bebidas, upgrades e abro mesa rapida.", 4.4);
  }

  function closeWaiterModal() {
    if (refs.waiterModal) refs.waiterModal.hidden = true;
  }

  function openJukeboxModal(feedback = "") {
    renderJukeboxModal(feedback);
    if (refs.jukeboxModal) refs.jukeboxModal.hidden = false;
  }

  function closeJukeboxModal() {
    if (refs.jukeboxModal) refs.jukeboxModal.hidden = true;
  }

  function getCatalogoGoogleAuthUser() {
    try {
      return window.CatalogoGoogleAuth?.getUser?.() || null;
    } catch (_error) {
      return null;
    }
  }

  function hasGoogleSession() {
    return Boolean(getCatalogoGoogleAuthUser()?.email);
  }

  function hasAvatarProfile() {
    return Boolean((state.profile.avatarReady || state.profile.registered) && String(state.profile.name || "").trim().length >= 2);
  }

  function canUseRealWallet() {
    return hasGoogleSession() && hasAvatarProfile();
  }

  function canEnterPubGame() {
    return runtime.demoMode || canUseRealWallet();
  }

  function focusProfileAccess(message) {
    document.getElementById("perfil")?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
    if (message) setWorldMessage(message, 3200);
  }

  function syncGameModeUi() {
    const inGame = Boolean(runtime.gameMode);
    document.body.classList.toggle("pubpaid-in-game", inGame);
    document.body.classList.toggle("pubpaid-night-panel-open", false);

    refs.enterGameButtons.forEach((button) => {
      button.hidden = inGame;
    });

    refs.exitGameButtons.forEach((button) => {
      button.hidden = !inGame;
    });

    refs.toggleGamePanelButtons.forEach((button) => {
      button.hidden = true;
      button.textContent = "Menu do jogo";
      button.setAttribute("aria-expanded", "false");
    });
  }

  function toggleNightPanel(forceState) {
    runtime.nightPanelOpen = false;
    syncGameModeUi();
  }

  function enterGameExperience({ skipChecks = false, announce = true, targetScene = "interior" } = {}) {
    if (!skipChecks && !hasGoogleSession()) {
      runtime.profileEntryMode = true;
      focusProfileAccess("Entre com Google para liberar o acesso ao PubPaid.");
      return false;
    }

    if (!skipChecks && !hasAvatarProfile()) {
      openProfileModal({ entryMode: true });
      setText(refs.profileFeedback, "Google conectado. Agora monte o avatar para abrir o salão.");
      return false;
    }

    runtime.demoMode = false;
    runtime.gameMode = true;
    runtime.nightPanelOpen = false;
    if (targetScene === "exterior") {
      if (runtime.scene !== "exterior") enterExterior();
    } else if (runtime.scene !== "interior") {
      enterInterior();
    }

    syncGameModeUi();
    renderAll();
    window.scrollTo({ top: 0, behavior: "smooth" });

    const fullscreenRequest = document.documentElement.requestFullscreen?.();
    if (fullscreenRequest?.catch) fullscreenRequest.catch(() => {});

    if (announce) {
      setWorldMessage(
        targetScene === "exterior"
          ? "Google confirmado. Você caiu na estrada da entrada do PubPaid."
          : "Portas abertas. Você entrou no salão do PubPaid.",
        2600
      );
    }
    return true;
  }

  function enterDemoExperience() {
    runtime.profileEntryMode = false;
    runtime.demoMode = true;
    runtime.gameMode = true;
    runtime.nightPanelOpen = false;
    if (runtime.scene !== "interior") enterInterior();
    if (!state.profile.name) {
      state.profile.name = "Visitante demo";
      state.profile.motto = "Treinando no modo demonstrativo do PubPaid.";
      state.profile.favorite = state.profile.favorite || "pool";
    }
    if (!hasGoogleSession()) {
      state.wallet.coins = Math.max(state.wallet.coins, 20);
    }
    saveState();
    syncGameModeUi();
    renderAll();
    window.scrollTo({ top: 0, behavior: "smooth" });
    setWorldMessage("Modo treino ativo. Teste os jogos, rode partidas e aprenda sem gastar saldo real.", 3200);
    return true;
  }

  function exitGameExperience({ announce = true } = {}) {
    runtime.gameMode = false;
    runtime.nightPanelOpen = false;
    runtime.demoMode = false;
    closeGameModal(true);
    closeShopModal();
    closeWaiterModal();
    closeJukeboxModal();
    enterExterior();

    syncGameModeUi();
    renderAll();

    const fullscreenExit = document.exitFullscreen?.();
    if (fullscreenExit?.catch) fullscreenExit.catch(() => {});

    if (announce) {
      setWorldMessage("Você saiu do modo game e voltou para a apresentação do PubPaid.", 2600);
    }
  }

  function syncExistingGoogleAuth() {
    const user = getCatalogoGoogleAuthUser();
    if (user?.email) {
      applyGoogleProfile(user, { announce: false });
      openGameFromGoogleSession({ announce: false, openProfileIfNeeded: true });
      void syncPubpaidAccount();
    }
  }

  function openGameFromGoogleSession({ announce = true, openProfileIfNeeded = true } = {}) {
    if (!hasGoogleSession()) {
      return false;
    }

    runtime.profileEntryMode = true;
    runtime.demoMode = false;
    enterGameExperience({ skipChecks: true, announce: false, targetScene: "exterior" });

    if (hasAvatarProfile()) {
      if (announce) {
        setWorldMessage("Google conferido. Seu personagem já está na estrada da entrada do pub.", 3200);
      }
      return true;
    }

    if (openProfileIfNeeded) {
      openProfileModal({ entryMode: true });
      setText(refs.profileFeedback, "Google conectado. Agora finalize o avatar para aparecer na entrada do PubPaid.");
    }

    if (announce) {
      setWorldMessage("Google conectado. Agora monte o avatar para ir para a estrada da entrada do pub.", 3200);
    }
    return true;
  }

  function handleCatalogoGoogleAuth(event) {
    const user = event?.detail?.user || getCatalogoGoogleAuthUser();
    if (!user?.email) {
      if (runtime.gameMode) {
        exitGameExperience({ announce: false });
        setWorldMessage("Google desconectado. A página voltou para a entrada do PubPaid.", 3400);
      }
      runtime.demoMode = false;
      state.wallet.coins = 0;
      saveState();
      renderAll();
      if (refs.depositFeedback) {
        refs.depositFeedback.textContent = "Entre com Google para gerar deposito e salvar o personagem.";
      }
      if (refs.withdrawFeedback) {
        refs.withdrawFeedback.textContent = "Entre com Google para abrir a carteira do PubPaid.";
      }
      return;
    }
    applyGoogleProfile(user, { announce: true });
    void syncPubpaidAccount();
    resetDepositQrState();
    openGameFromGoogleSession({ announce: true, openProfileIfNeeded: true });
  }

  function applyGoogleProfile(user, { announce = true } = {}) {
    const hadAvatar = hasAvatarProfile();
    state.profile.authProvider = "google";
    state.profile.googleSub = String(user.sub || "");
    state.profile.googleEmail = String(user.email || "");
    state.profile.googlePicture = String(user.picture || "");
    if (!state.profile.name) {
      state.profile.name = String(user.givenName || user.name || "Jogador Google").slice(0, 28);
    }
    if (!state.profile.motto) {
      state.profile.motto = "Entrou com Google, sem crédito grátis, pronto para depositar no caixa.";
    }
    if (!state.profile.bonusClaimed) {
      state.profile.bonusClaimed = true;
    }
    state.profile.starterCreditsRevoked = true;

    saveState();
    fillProfileForm();
    renderAll();
    void syncPubpaidAccount();

    if (announce) {
      setWorldMessage(
        hadAvatar
          ? "Conta Google conferida. O salão já pode abrir em tela cheia."
          : "Conta Google conectada. Agora monte o avatar para entrar no PubPaid valendo.",
        3400
      );
    }
  }

  async function requestApiJson(url, options = {}) {
    const response = await fetch(url, {
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(options.headers || {})
      },
      ...options
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok || payload.ok === false) {
      throw new Error(payload.error || payload.message || "Nao foi possivel falar com o caixa agora.");
    }
    return payload;
  }

  async function ensurePubpaidServerSession() {
    const session = await requestApiJson("/api/auth/session", { method: "GET" });
    if (session?.user?.email) {
      return session.user;
    }
    throw new Error("Sua sessão Google expirou no servidor. Entre novamente antes de usar o caixa.");
  }

  function getProfileSnapshot() {
    return {
      name: String(state.profile.name || "").trim() || "Jogador",
      archetype: normalizeArchetype(state.profile.archetype),
      favorite: normalizeGameId(state.profile.favorite),
      motto: String(state.profile.motto || "").trim()
    };
  }

  function getLobbyPalette(archetype) {
    return PALETTES[normalizeArchetype(archetype)] || PALETTES.neon;
  }

  function renderLobbyAvatarCard(player, variant = "self") {
    const palette = getLobbyPalette(player?.archetype);
    const label = player?.name || (variant === "self" ? state.profile.name || "Você" : "Aguardando rival");
    const subtitle = variant === "self" ? "você" : player?.name ? "rival conectado" : "aguardando conexão";
    return `
      <article class="pubpaid-lobby-avatar-card ${variant === "self" ? "is-self" : "is-rival"}">
        <div class="pubpaid-lobby-avatar" style="--hair:${palette.hair};--skin:${palette.skin};--shirt:${palette.shirt};--jacket:${palette.jacket};--pants:${palette.pants};--accent:${palette.accent};">
          <span class="hair"></span>
          <span class="face"></span>
          <span class="shirt"></span>
          <span class="jacket left"></span>
          <span class="jacket right"></span>
          <span class="pants left"></span>
          <span class="pants right"></span>
          <span class="accent a"></span>
          <span class="accent b"></span>
        </div>
        <strong>${escapeHtml(label)}</strong>
        <small>${escapeHtml(subtitle)}</small>
      </article>
    `;
  }

  function getPvpSeatPlayer(match, seat) {
    if (!match || !seat) return null;
    return seat === "playerOne" ? match.playerOne : match.playerTwo;
  }

  function getPvpOpponent(match, seat) {
    if (!match || !seat) return null;
    return seat === "playerOne" ? match.playerTwo : match.playerOne;
  }

  function mapPointForSeat(point, seat) {
    if (!point) return null;
    return seat === "playerTwo"
      ? { row: 7 - clampInteger(point.row), col: 7 - clampInteger(point.col) }
      : { row: clampInteger(point.row), col: clampInteger(point.col) };
  }

  function mapBoardForSeat(board, seat) {
    const safeBoard = Array.isArray(board) ? board.map((row) => row.slice()) : createCheckersState().board;
    if (seat !== "playerTwo") return safeBoard;
    return safeBoard
      .slice()
      .reverse()
      .map((row) =>
        row
          .slice()
          .reverse()
          .map((cell) => {
            if (!cell) return "";
            return cell.toLowerCase() === "p"
              ? cell === cell.toUpperCase() ? "O" : "o"
              : cell === cell.toUpperCase() ? "P" : "p";
          })
      );
  }

  function startPvpPolling() {
    clearPvpPoll();
    const game = runtime.activeGame;
    if (!game || !game.multiplayer) return;
    runtime.pvpPollTimer = window.setTimeout(() => {
      if (game.id === "checkers") {
        void refreshCheckersPvpState();
      } else if (game.id === "cards21") {
        void refreshCards21PvpState();
      } else if (game.id === "dicecups") {
        void refreshDicecupsPvpState();
      } else if (game.id === "poker") {
        void refreshPokerPvpState();
      } else if (game.id === "darts") {
        void refreshDartsPvpState();
      }
    }, PUBPAID_PVP_POLL_MS);
  }

  async function leaveActivePvpGame(game = runtime.activeGame) {
    if (!game?.multiplayer?.enabled) return;
    clearPvpPoll();
    try {
      await requestApiJson("/api/pubpaid/pvp/leave", {
        method: "POST",
        body: JSON.stringify({ gameId: game.id })
      });
    } catch (_error) {
      // best effort
    }
  }

  function hydrateCheckersPvpGame(match, seat) {
    const game = runtime.activeGame;
    if (!game || game.id !== "checkers") return;
    const opponent = getPvpOpponent(match, seat);
    game.multiplayer = {
      ...(game.multiplayer || {}),
      enabled: true,
      state: match?.status || "active",
      matchId: match?.id || "",
      seat,
      waiting: false,
      stakeLocked: Boolean(game.multiplayer?.stakeLocked),
      settled: Boolean(game.multiplayer?.settled),
    };
    game.opponent = {
      ...(opponent || HOUSE_OPPONENTS.checkers),
      name: opponent?.name || "Rival",
      bio: opponent?.name ? "Conectado na mesma mesa de damas." : HOUSE_OPPONENTS.checkers.bio,
      archetype: opponent?.archetype || HOUSE_OPPONENTS.checkers.archetype
    };
    if (!game.multiplayer.stakeLocked) {
      game.startedAt = match?.startedAt || new Date().toISOString();
      game.houseFee = 0;
      game.payout = getMatchWinnerPayout(game.stake);
      state.wallet.coins -= game.stake;
      game.multiplayer.stakeLocked = true;
    }
    game.screen = match?.status === "finished" ? "playing" : "playing";
    game.tableState = {
      board: mapBoardForSeat(match?.board, seat),
      turn: match?.turn === seat ? "player" : "opponent",
      selected: null,
      validMoves: [],
      message:
        match?.resultSummary ||
        (match?.turn === seat ? "Sua vez. Clique numa peca e feche a jogada." : `${game.opponent.name} está pensando.`),
      turnCount: clampInteger(match?.moveCount),
      multiplayer: true,
    };
    saveState();
    renderAll();
    if (match?.status === "finished" && !game.multiplayer.settled) {
      const result = match?.winner === seat ? "win" : "loss";
      game.multiplayer.settled = true;
      finalizeGame(result, match?.resultSummary || (result === "win" ? "Você venceu a mesa PvP." : "O rival venceu a mesa PvP."));
      return;
    }
    renderGameModal();
    startPvpPolling();
  }

  function hydrateCards21PvpGame(match, seat) {
    const game = runtime.activeGame;
    if (!game || game.id !== "cards21") return;
    const opponent = getPvpOpponent(match, seat);
    const cardsState = match?.cardsState || {};
    const playerCards = Array.isArray(seat === "playerOne" ? cardsState.playerOneCards : cardsState.playerTwoCards)
      ? (seat === "playerOne" ? cardsState.playerOneCards : cardsState.playerTwoCards).slice()
      : [];
    const opponentCards = Array.isArray(seat === "playerOne" ? cardsState.playerTwoCards : cardsState.playerOneCards)
      ? (seat === "playerOne" ? cardsState.playerTwoCards : cardsState.playerOneCards).slice()
      : [];
    const playerState = seat === "playerOne" ? cardsState.playerOneState : cardsState.playerTwoState;
    const opponentState = seat === "playerOne" ? cardsState.playerTwoState : cardsState.playerOneState;

    game.multiplayer = {
      ...(game.multiplayer || {}),
      enabled: true,
      state: match?.status || "active",
      matchId: match?.id || "",
      seat,
      waiting: false,
      stakeLocked: Boolean(game.multiplayer?.stakeLocked),
      settled: Boolean(game.multiplayer?.settled),
    };
    game.opponent = {
      ...(opponent || HOUSE_OPPONENTS.cards21),
      name: opponent?.name || "Rival",
      bio: opponent?.name ? "Conectado na mesma mesa de 21." : HOUSE_OPPONENTS.cards21.bio,
      archetype: opponent?.archetype || HOUSE_OPPONENTS.cards21.archetype
    };
    if (!game.multiplayer.stakeLocked) {
      game.startedAt = match?.startedAt || new Date().toISOString();
      game.houseFee = 0;
      game.payout = getMatchWinnerPayout(game.stake);
      state.wallet.coins -= game.stake;
      game.multiplayer.stakeLocked = true;
    }
    game.screen = "playing";
    game.tableState = {
      phase: match?.status === "finished" ? "finished" : match?.turn === seat ? "player" : "opponent",
      playerCards,
      botCards: opponentCards,
      drawCount: clampInteger(cardsState.drawCount),
      message:
        match?.resultSummary ||
        (match?.turn === seat ? "Sua vez. Compre ou pare." : `${game.opponent.name} está decidindo a mão.`),
      playerState: playerState || "active",
      botState: opponentState || "active",
      multiplayer: true,
    };
    saveState();
    renderAll();
    if (match?.status === "finished" && !game.multiplayer.settled) {
      const result = !match?.winner ? "tie" : match?.winner === seat ? "win" : "loss";
      game.multiplayer.settled = true;
      finalizeGame(
        result,
        match?.resultSummary ||
          (result === "win" ? "Você venceu a mesa PvP." : result === "loss" ? "O rival venceu a mesa PvP." : "A mesa empatou.")
      );
      return;
    }
    renderGameModal();
    startPvpPolling();
  }

  function applyCheckersPvpState(payload) {
    const game = runtime.activeGame;
    if (!game || game.id !== "checkers" || !game.multiplayer) return;
    game.multiplayer.state = payload?.state || "idle";
    game.multiplayer.matchId = payload?.match?.id || "";
    game.multiplayer.seat = payload?.seat || "";
    game.multiplayer.waiting = payload?.state === "waiting";
    if (payload?.state === "waiting") {
      game.feedback = "Lobby aberto. A mesa vai subir assim que outro jogador entrar na mesma aposta.";
      renderGameModal();
      startPvpPolling();
      return;
    }
    if (payload?.match && payload?.seat) {
      hydrateCheckersPvpGame(payload.match, payload.seat);
      return;
    }
    renderGameModal();
  }

  function applyCards21PvpState(payload) {
    const game = runtime.activeGame;
    if (!game || game.id !== "cards21" || !game.multiplayer) return;
    game.multiplayer.state = payload?.state || "idle";
    game.multiplayer.matchId = payload?.match?.id || "";
    game.multiplayer.seat = payload?.seat || "";
    game.multiplayer.waiting = payload?.state === "waiting";
    if (payload?.state === "waiting") {
      game.feedback = "Lobby aberto. A mesa vai subir assim que outro jogador entrar na mesma aposta.";
      renderGameModal();
      startPvpPolling();
      return;
    }
    if (payload?.match && payload?.seat) {
      hydrateCards21PvpGame(payload.match, payload.seat);
      return;
    }
    renderGameModal();
  }

  async function refreshCheckersPvpState() {
    clearPvpPoll();
    const game = runtime.activeGame;
    if (!game || game.id !== "checkers" || !game.multiplayer?.enabled) return;
    try {
      const payload = await requestApiJson("/api/pubpaid/pvp/state?gameId=checkers", { method: "GET" });
      applyCheckersPvpState(payload);
    } catch (error) {
      game.feedback = String(error?.message || "Não consegui atualizar a mesa PvP.");
      renderGameModal();
    }
  }

  async function refreshCards21PvpState() {
    clearPvpPoll();
    const game = runtime.activeGame;
    if (!game || game.id !== "cards21" || !game.multiplayer?.enabled) return;
    try {
      const payload = await requestApiJson("/api/pubpaid/pvp/state?gameId=cards21", { method: "GET" });
      applyCards21PvpState(payload);
    } catch (error) {
      game.feedback = String(error?.message || "Não consegui atualizar a mesa PvP.");
      renderGameModal();
    }
  }

  async function startCheckersPvpFlow() {
    const game = runtime.activeGame;
    if (!game || game.id !== "checkers") return;
    if (state.wallet.coins < game.stake) {
      game.feedback = `Saldo insuficiente. Voce precisa de ${formatCoins(game.stake)}.`;
      renderGameModal();
      return;
    }
    await ensurePubpaidServerSession();
    game.feedback = "Entrando na fila PvP da mesa de damas...";
    renderGameModal();
    const payload = await requestApiJson("/api/pubpaid/pvp/join", {
      method: "POST",
      body: JSON.stringify({
        gameId: "checkers",
        stake: game.stake,
        profile: getProfileSnapshot()
      })
    });
    applyCheckersPvpState(payload);
  }

  async function startCards21PvpFlow() {
    const game = runtime.activeGame;
    if (!game || game.id !== "cards21") return;
    if (state.wallet.coins < game.stake) {
      game.feedback = `Saldo insuficiente. Voce precisa de ${formatCoins(game.stake)}.`;
      renderGameModal();
      return;
    }
    await ensurePubpaidServerSession();
    game.feedback = "Entrando na fila PvP da mesa de 21...";
    renderGameModal();
    const payload = await requestApiJson("/api/pubpaid/pvp/join", {
      method: "POST",
      body: JSON.stringify({
        gameId: "cards21",
        stake: game.stake,
        profile: getProfileSnapshot()
      })
    });
    applyCards21PvpState(payload);
  }

  async function submitCheckersPvpMove(move) {
    const game = runtime.activeGame;
    if (!game?.multiplayer?.matchId) return;
    const serverMove = {
      from: mapPointForSeat(move.from, game.multiplayer.seat),
      to: mapPointForSeat(move.to, game.multiplayer.seat),
      capture: mapPointForSeat(move.capture, game.multiplayer.seat)
    };
    const payload = await requestApiJson("/api/pubpaid/pvp/checkers/move", {
      method: "POST",
      body: JSON.stringify({
        matchId: game.multiplayer.matchId,
        move: serverMove
      })
    });
    applyCheckersPvpState(payload);
  }

  async function submitCards21PvpAction(action) {
    const game = runtime.activeGame;
    if (!game?.multiplayer?.matchId) return;
    const payload = await requestApiJson("/api/pubpaid/pvp/cards21/action", {
      method: "POST",
      body: JSON.stringify({
        matchId: game.multiplayer.matchId,
        action
      })
    });
    applyCards21PvpState(payload);
  }

  function hydrateDicecupsPvpGame(match, seat) {
    const game = runtime.activeGame;
    if (!game || game.id !== "dicecups") return;
    const opponent = getPvpOpponent(match, seat);
    const diceState = match?.diceState || {};
    game.multiplayer = {
      ...(game.multiplayer || {}),
      enabled: true,
      state: match?.status || "active",
      matchId: match?.id || "",
      seat,
      waiting: false,
      stakeLocked: Boolean(game.multiplayer?.stakeLocked),
      settled: Boolean(game.multiplayer?.settled),
    };
    game.opponent = {
      ...(opponent || HOUSE_OPPONENTS.dicecups),
      name: opponent?.name || "Rival",
      bio: opponent?.name ? "Conectado na mesma mesa de copos." : HOUSE_OPPONENTS.dicecups.bio,
      archetype: opponent?.archetype || HOUSE_OPPONENTS.dicecups.archetype
    };
    if (!game.multiplayer.stakeLocked) {
      game.startedAt = match?.startedAt || new Date().toISOString();
      game.houseFee = 0;
      game.payout = getMatchWinnerPayout(game.stake);
      state.wallet.coins -= game.stake;
      game.multiplayer.stakeLocked = true;
    }
    game.screen = "playing";
    game.tableState = {
      round: clampInteger(diceState.round) || 1,
      playerScore: clampInteger(seat === "playerOne" ? diceState.playerOneScore : diceState.playerTwoScore),
      botScore: clampInteger(seat === "playerOne" ? diceState.playerTwoScore : diceState.playerOneScore),
      phase: match?.status === "finished" ? "reveal" : match?.turn === seat ? "guess" : "rolling",
      playerGuess: clampInteger(seat === "playerOne" ? diceState.playerOneGuess : diceState.playerTwoGuess),
      botGuess: clampInteger(seat === "playerOne" ? diceState.playerTwoGuess : diceState.playerOneGuess),
      dice: Array.isArray(diceState.dice) ? diceState.dice.slice(0, 2) : [0, 0],
      total: clampInteger(diceState.total),
      rollSeed: 0,
      message:
        match?.resultSummary ||
        (match?.turn === seat ? "Escolha a soma escondida sob os copos." : `${game.opponent.name} está lendo a mesa.`),
      multiplayer: true,
    };
    saveState();
    renderAll();
    if (match?.status === "finished" && !game.multiplayer.settled) {
      const result = !match?.winner ? "tie" : match?.winner === seat ? "win" : "loss";
      game.multiplayer.settled = true;
      finalizeGame(
        result,
        match?.resultSummary ||
          (result === "win" ? "Você venceu a mesa PvP." : result === "loss" ? "O rival venceu a mesa PvP." : "A mesa empatou.")
      );
      return;
    }
    renderGameModal();
    startPvpPolling();
  }

  function applyDicecupsPvpState(payload) {
    const game = runtime.activeGame;
    if (!game || game.id !== "dicecups" || !game.multiplayer) return;
    game.multiplayer.state = payload?.state || "idle";
    game.multiplayer.matchId = payload?.match?.id || "";
    game.multiplayer.seat = payload?.seat || "";
    game.multiplayer.waiting = payload?.state === "waiting";
    if (payload?.state === "waiting") {
      game.feedback = "Lobby aberto. A mesa vai subir assim que outro jogador entrar na mesma aposta.";
      renderGameModal();
      startPvpPolling();
      return;
    }
    if (payload?.match && payload?.seat) {
      hydrateDicecupsPvpGame(payload.match, payload.seat);
      return;
    }
    renderGameModal();
  }

  async function refreshDicecupsPvpState() {
    clearPvpPoll();
    const game = runtime.activeGame;
    if (!game || game.id !== "dicecups" || !game.multiplayer?.enabled) return;
    try {
      const payload = await requestApiJson("/api/pubpaid/pvp/state?gameId=dicecups", { method: "GET" });
      applyDicecupsPvpState(payload);
    } catch (error) {
      game.feedback = String(error?.message || "Não consegui atualizar a mesa PvP.");
      renderGameModal();
    }
  }

  async function startDicecupsPvpFlow() {
    const game = runtime.activeGame;
    if (!game || game.id !== "dicecups") return;
    if (state.wallet.coins < game.stake) {
      game.feedback = `Saldo insuficiente. Voce precisa de ${formatCoins(game.stake)}.`;
      renderGameModal();
      return;
    }
    await ensurePubpaidServerSession();
    game.feedback = "Entrando na fila PvP da mesa de copos...";
    renderGameModal();
    const payload = await requestApiJson("/api/pubpaid/pvp/join", {
      method: "POST",
      body: JSON.stringify({
        gameId: "dicecups",
        stake: game.stake,
        profile: getProfileSnapshot()
      })
    });
    applyDicecupsPvpState(payload);
  }

  async function submitDicecupsPvpGuess(guess) {
    const game = runtime.activeGame;
    if (!game?.multiplayer?.matchId) return;
    const payload = await requestApiJson("/api/pubpaid/pvp/dicecups/guess", {
      method: "POST",
      body: JSON.stringify({
        matchId: game.multiplayer.matchId,
        guess
      })
    });
    applyDicecupsPvpState(payload);
  }

  function hydratePokerPvpGame(match, seat) {
    const game = runtime.activeGame;
    if (!game || game.id !== "poker") return;
    const opponent = getPvpOpponent(match, seat);
    const pokerState = match?.pokerState || {};
    const playerCards = Array.isArray(seat === "playerOne" ? pokerState.playerOneCards : pokerState.playerTwoCards)
      ? (seat === "playerOne" ? pokerState.playerOneCards : pokerState.playerTwoCards).slice()
      : [];
    const opponentCards = Array.isArray(seat === "playerOne" ? pokerState.playerTwoCards : pokerState.playerOneCards)
      ? (seat === "playerOne" ? pokerState.playerTwoCards : pokerState.playerOneCards).slice()
      : [];
    const held = Array.isArray(seat === "playerOne" ? pokerState.playerOneHeld : pokerState.playerTwoHeld)
      ? (seat === "playerOne" ? pokerState.playerOneHeld : pokerState.playerTwoHeld).slice()
      : [false, false, false, false, false];
    const drawUsed = Boolean(seat === "playerOne" ? pokerState.playerOneDrawUsed : pokerState.playerTwoDrawUsed);
    const opponentDrawUsed = Boolean(seat === "playerOne" ? pokerState.playerTwoDrawUsed : pokerState.playerOneDrawUsed);

    game.multiplayer = {
      ...(game.multiplayer || {}),
      enabled: true,
      state: match?.status || "active",
      matchId: match?.id || "",
      seat,
      waiting: false,
      stakeLocked: Boolean(game.multiplayer?.stakeLocked),
      settled: Boolean(game.multiplayer?.settled),
    };
    game.opponent = {
      ...(opponent || HOUSE_OPPONENTS.poker),
      name: opponent?.name || "Rival",
      bio: opponent?.name ? "Conectado na mesma mesa de poker." : HOUSE_OPPONENTS.poker.bio,
      archetype: opponent?.archetype || HOUSE_OPPONENTS.poker.archetype
    };
    if (!game.multiplayer.stakeLocked) {
      game.startedAt = match?.startedAt || new Date().toISOString();
      game.houseFee = 0;
      game.payout = getMatchWinnerPayout(game.stake);
      state.wallet.coins -= game.stake;
      game.multiplayer.stakeLocked = true;
    }
    game.screen = "playing";
    game.tableState = {
      phase: match?.status === "finished" ? "showdown" : drawUsed ? "opponent" : match?.turn === seat ? "draw" : "opponent",
      deck: [],
      playerCards,
      botCards: opponentCards,
      held,
      drawUsed,
      opponentDrawUsed,
      message:
        match?.resultSummary ||
        (match?.turn === seat ? "Escolha as cartas que ficam e troque o resto." : `${game.opponent.name} está trocando as cartas.`),
      multiplayer: true,
    };
    saveState();
    renderAll();
    if (match?.status === "finished" && !game.multiplayer.settled) {
      const result = !match?.winner ? "tie" : match?.winner === seat ? "win" : "loss";
      game.multiplayer.settled = true;
      finalizeGame(
        result,
        match?.resultSummary ||
          (result === "win" ? "Você venceu a mesa PvP." : result === "loss" ? "O rival venceu a mesa PvP." : "A mesa empatou.")
      );
      return;
    }
    renderGameModal();
    startPvpPolling();
  }

  function applyPokerPvpState(payload) {
    const game = runtime.activeGame;
    if (!game || game.id !== "poker" || !game.multiplayer) return;
    game.multiplayer.state = payload?.state || "idle";
    game.multiplayer.matchId = payload?.match?.id || "";
    game.multiplayer.seat = payload?.seat || "";
    game.multiplayer.waiting = payload?.state === "waiting";
    if (payload?.state === "waiting") {
      game.feedback = "Lobby aberto. A mesa vai subir assim que outro jogador entrar na mesma aposta.";
      renderGameModal();
      startPvpPolling();
      return;
    }
    if (payload?.match && payload?.seat) {
      hydratePokerPvpGame(payload.match, payload.seat);
      return;
    }
    renderGameModal();
  }

  async function refreshPokerPvpState() {
    clearPvpPoll();
    const game = runtime.activeGame;
    if (!game || game.id !== "poker" || !game.multiplayer?.enabled) return;
    try {
      const payload = await requestApiJson("/api/pubpaid/pvp/state?gameId=poker", { method: "GET" });
      applyPokerPvpState(payload);
    } catch (error) {
      game.feedback = String(error?.message || "Não consegui atualizar a mesa PvP.");
      renderGameModal();
    }
  }

  async function startPokerPvpFlow() {
    const game = runtime.activeGame;
    if (!game || game.id !== "poker") return;
    if (state.wallet.coins < game.stake) {
      game.feedback = `Saldo insuficiente. Voce precisa de ${formatCoins(game.stake)}.`;
      renderGameModal();
      return;
    }
    await ensurePubpaidServerSession();
    game.feedback = "Entrando na fila PvP da mesa de poker...";
    renderGameModal();
    const payload = await requestApiJson("/api/pubpaid/pvp/join", {
      method: "POST",
      body: JSON.stringify({
        gameId: "poker",
        stake: game.stake,
        profile: getProfileSnapshot()
      })
    });
    applyPokerPvpState(payload);
  }

  async function submitPokerPvpDraw(held) {
    const game = runtime.activeGame;
    if (!game?.multiplayer?.matchId) return;
    const payload = await requestApiJson("/api/pubpaid/pvp/poker/draw", {
      method: "POST",
      body: JSON.stringify({
        matchId: game.multiplayer.matchId,
        held
      })
    });
    applyPokerPvpState(payload);
  }

  function hydrateDartsPvpGame(match, seat) {
    const game = runtime.activeGame;
    if (!game || game.id !== "darts") return;
    const opponent = getPvpOpponent(match, seat);
    const dartsState = match?.dartsState || {};
    game.multiplayer = {
      ...(game.multiplayer || {}),
      enabled: true,
      state: match?.status || "active",
      matchId: match?.id || "",
      seat,
      waiting: false,
      stakeLocked: Boolean(game.multiplayer?.stakeLocked),
      settled: Boolean(game.multiplayer?.settled),
    };
    game.opponent = {
      ...(opponent || HOUSE_OPPONENTS.darts),
      name: opponent?.name || "Rival",
      bio: opponent?.name ? "Conectado no mesmo alvo de dardos." : HOUSE_OPPONENTS.darts.bio,
      archetype: opponent?.archetype || HOUSE_OPPONENTS.darts.archetype
    };
    if (!game.multiplayer.stakeLocked) {
      game.startedAt = match?.startedAt || new Date().toISOString();
      game.houseFee = 0;
      game.payout = getMatchWinnerPayout(game.stake);
      state.wallet.coins -= game.stake;
      game.multiplayer.stakeLocked = true;
    }
    const myLast = seat === "playerOne" ? dartsState.lastPlayerOne : dartsState.lastPlayerTwo;
    const rivalLast = seat === "playerOne" ? dartsState.lastPlayerTwo : dartsState.lastPlayerOne;
    game.screen = "playing";
    game.tableState = {
      round: clampInteger(dartsState.round) || 1,
      maxRounds: clampInteger(dartsState.maxRounds) || 3,
      playerScore: clampInteger(seat === "playerOne" ? dartsState.playerOneScore : dartsState.playerTwoScore),
      botScore: clampInteger(seat === "playerOne" ? dartsState.playerTwoScore : dartsState.playerOneScore),
      lastPlayer: myLast || null,
      lastBot: rivalLast || null,
      aimX: clampPercent(seat === "playerOne" ? dartsState.playerOneAimX : dartsState.playerTwoAimX, 50),
      aimY: clampPercent(seat === "playerOne" ? dartsState.playerOneAimY : dartsState.playerTwoAimY, 50),
      message:
        match?.resultSummary ||
        (match?.turn === seat ? "Ajuste a mira no eixo X/Y e solte o dardo." : `${game.opponent.name} está mirando.`),
      history: Array.isArray(dartsState.history)
        ? dartsState.history.map((item) => ({
            round: item.round,
            player: seat === "playerOne" ? item.playerOne : item.playerTwo,
            bot: seat === "playerOne" ? item.playerTwo : item.playerOne,
          }))
        : [],
      multiplayer: true,
      phase: match?.status === "finished" ? "finished" : match?.turn === seat ? "player" : "opponent",
    };
    saveState();
    renderAll();
    if (match?.status === "finished" && !game.multiplayer.settled) {
      const result = !match?.winner ? "tie" : match?.winner === seat ? "win" : "loss";
      game.multiplayer.settled = true;
      finalizeGame(
        result,
        match?.resultSummary ||
          (result === "win" ? "Você venceu a mesa PvP." : result === "loss" ? "O rival venceu a mesa PvP." : "A mesa empatou.")
      );
      return;
    }
    renderGameModal();
    startPvpPolling();
  }

  function applyDartsPvpState(payload) {
    const game = runtime.activeGame;
    if (!game || game.id !== "darts" || !game.multiplayer) return;
    game.multiplayer.state = payload?.state || "idle";
    game.multiplayer.matchId = payload?.match?.id || "";
    game.multiplayer.seat = payload?.seat || "";
    game.multiplayer.waiting = payload?.state === "waiting";
    if (payload?.state === "waiting") {
      game.feedback = "Lobby aberto. A mesa vai subir assim que outro jogador entrar na mesma aposta.";
      renderGameModal();
      startPvpPolling();
      return;
    }
    if (payload?.match && payload?.seat) {
      hydrateDartsPvpGame(payload.match, payload.seat);
      return;
    }
    renderGameModal();
  }

  async function refreshDartsPvpState() {
    clearPvpPoll();
    const game = runtime.activeGame;
    if (!game || game.id !== "darts" || !game.multiplayer?.enabled) return;
    try {
      const payload = await requestApiJson("/api/pubpaid/pvp/state?gameId=darts", { method: "GET" });
      applyDartsPvpState(payload);
    } catch (error) {
      game.feedback = String(error?.message || "Não consegui atualizar a mesa PvP.");
      renderGameModal();
    }
  }

  async function startDartsPvpFlow() {
    const game = runtime.activeGame;
    if (!game || game.id !== "darts") return;
    if (state.wallet.coins < game.stake) {
      game.feedback = `Saldo insuficiente. Voce precisa de ${formatCoins(game.stake)}.`;
      renderGameModal();
      return;
    }
    await ensurePubpaidServerSession();
    game.feedback = "Entrando na fila PvP do alvo de dardos...";
    renderGameModal();
    const payload = await requestApiJson("/api/pubpaid/pvp/join", {
      method: "POST",
      body: JSON.stringify({
        gameId: "darts",
        stake: game.stake,
        profile: getProfileSnapshot()
      })
    });
    applyDartsPvpState(payload);
  }

  async function submitDartsPvpThrow({ aimX, aimY }) {
    const game = runtime.activeGame;
    if (!game?.multiplayer?.matchId) return;
    const payload = await requestApiJson("/api/pubpaid/pvp/darts/throw", {
      method: "POST",
      body: JSON.stringify({
        matchId: game.multiplayer.matchId,
        aimX,
        aimY
      })
    });
    applyDartsPvpState(payload);
  }

  function getDepositAmount() {
    const raw = String(refs.depositAmount?.value || "").trim();
    const amount = clampInteger(raw);
    return [5, 10, 20, 50, 100].includes(amount) ? amount : null;
  }

  function getWithdrawalAmount() {
    const amount = parseMoneyInput(refs.withdrawAmount?.value || 0);
    return amount > 0 ? amount : null;
  }

  function buildDepositTxid() {
    return `PUB${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`
      .replace(/[^A-Za-z0-9]/g, "")
      .toUpperCase()
      .slice(0, 25);
  }

  function resetDepositQrState(message = "Informe o nome do pagador e clique em gerar para abrir o QR do deposito.") {
    depositState.txid = "";
    depositState.qrReady = false;
    depositState.locked = false;
    depositState.pendingId = "";
    depositState.stage = "amount";
    if (refs.depositQr) {
      refs.depositQr.innerHTML = `<p>${escapeHtml(message)}</p>`;
    }
    setDepositStepState({
      amount: true,
      name: false,
      qr: false,
      confirm: false
    });
  }

  function setStepVisibility(node, visible) {
    if (!node) return;
    node.hidden = !visible;
    node.classList.toggle("is-open", visible);
  }

  function setDepositStepState({ amount = true, name = false, qr = false, confirm = false } = {}) {
    setStepVisibility(refs.depositStepAmount, amount);
    setStepVisibility(refs.depositStepName, name);
    setStepVisibility(refs.depositStepQr, qr);
    setStepVisibility(refs.depositStepConfirm, confirm);
  }

  function unlockDepositNameStep() {
    const amount = getDepositAmount();
    if (!amount) {
      if (refs.depositFeedback) {
        refs.depositFeedback.textContent = "Escolha um valor antes de continuar no deposito.";
      }
      refs.depositAmount?.focus?.();
      return;
    }
    depositState.amount = amount;
    depositState.stage = "name";
    setDepositStepState({
      amount: true,
      name: true,
      qr: false,
      confirm: false
    });
    refs.depositorName?.focus?.();
  }

  function unlockDepositQrStep() {
    depositState.stage = "qr";
    setDepositStepState({
      amount: true,
      name: true,
      qr: true,
      confirm: false
    });
  }

  function unlockDepositConfirmStep() {
    depositState.stage = "confirm";
    setDepositStepState({
      amount: true,
      name: true,
      qr: true,
      confirm: true
    });
  }

  async function generatePubPaidDepositQr(forceNewTxid = false) {
    if (!refs.depositQr) return;
    const localUser = getCatalogoGoogleAuthUser();
    if (!localUser?.email) {
      refs.depositQr.innerHTML = "<p>Entre com Google para gerar o QR do deposito.</p>";
      if (refs.depositFeedback) {
        refs.depositFeedback.textContent = "O caixa só abre para conta Google identificada.";
      }
      return;
    }

    const depositorName = String(refs.depositorName?.value || "").trim();
    if (!depositorName || depositorName.length < 3) {
      if (refs.depositFeedback) {
        refs.depositFeedback.textContent = "Preencha primeiro o nome de quem fez o Pix e depois gere o QR.";
      }
      unlockDepositNameStep();
      refs.depositorName?.focus?.();
      return;
    }

    const amount = getDepositAmount();
    if (!amount) {
      if (refs.depositFeedback) {
        refs.depositFeedback.textContent = "Escolha um valor antes de gerar o QR Code.";
      }
      return;
    }
    if (forceNewTxid || !depositState.txid || depositState.amount !== amount) {
      depositState.txid = buildDepositTxid();
      depositState.qrReady = false;
      depositState.locked = false;
      depositState.pendingId = "";
    }
    depositState.amount = amount;
    if (refs.depositorField) refs.depositorField.hidden = false;
    refs.depositQr.innerHTML = "<p>Gerando QR Code protegido...</p>";
    if (refs.depositFeedback) {
      refs.depositFeedback.textContent = "A chave Pix fica escondida; use somente o QR Code.";
    }

    try {
      const user = await ensurePubpaidServerSession();
      const params = new URLSearchParams({
        amount: String(amount),
        txid: depositState.txid,
        description: "PubPaid Creditos"
      });
      const payload = await requestApiJson(`/api/pubpaid/deposit/pix?${params.toString()}`, { method: "GET" });
      depositState.txid = payload.txid || depositState.txid;
      depositState.qrReady = true;
      refs.depositQr.innerHTML = `
        ${payload.qrSvg || "<p>QR indisponivel. Tente gerar novamente.</p>"}
        <div class="pubpaid-pix-meta">
          <div>
            <strong>Chave Pix</strong>
            <span class="pubpaid-pix-box">${escapeHtml(payload.pixKey || "Indisponivel")}</span>
          </div>
          <div>
            <strong>Codigo Pix copia e cola</strong>
            <span class="pubpaid-pix-box">${escapeHtml(payload.copyCode || "Indisponivel")}</span>
          </div>
        </div>
      `;
      unlockDepositConfirmStep();
      if (refs.depositFeedback) {
        refs.depositFeedback.textContent =
          `QR criado para ${user.email}: ${amount} creditos, referencia ${depositState.txid}.`;
      }
    } catch (error) {
      depositState.qrReady = false;
      refs.depositQr.innerHTML = `<p>${escapeHtml(error.message)}</p>`;
      if (refs.depositFeedback) refs.depositFeedback.textContent = "Nao foi possivel gerar o QR agora.";
    }
  }

  async function registerPubPaidDeposit() {
    const localUser = getCatalogoGoogleAuthUser();
    if (!localUser?.email) {
      if (refs.depositFeedback) refs.depositFeedback.textContent = "Entre com Google antes de avisar o pagamento.";
      return;
    }
    if (!depositState.txid || !depositState.qrReady) {
      if (refs.depositFeedback) {
        refs.depositFeedback.textContent = "Gere o QR Code primeiro para registrar o deposito.";
      }
      return;
    }
    if (depositState.locked) {
      if (refs.depositFeedback) {
        refs.depositFeedback.textContent = "Esse pagamento ja foi enviado para conferencia manual.";
      }
      return;
    }

    const depositorName = String(refs.depositorName?.value || "").trim();
    if (!depositorName || depositorName.length < 3) {
      if (refs.depositFeedback) {
        refs.depositFeedback.textContent = "Informe o nome de quem fez o Pix para aparecer na dashboard.";
      }
      unlockDepositNameStep();
      refs.depositorName?.focus?.();
      return;
    }

    try {
      await ensurePubpaidServerSession();
      const payload = await requestApiJson("/api/pubpaid/deposits", {
        method: "POST",
        body: JSON.stringify({
          amount: depositState.amount || getDepositAmount(),
          paymentTxid: depositState.txid,
          depositorName,
          sourcePage: window.location.pathname
        })
      });
      depositState.locked = true;
      depositState.qrReady = false;
      depositState.pendingId = payload?.item?.id || "";
      refs.depositQr.innerHTML = `
        <p><strong>Pagamento avisado.</strong></p>
        <p>Agora aguarde a conferência manual. O crédito pode levar até 3 horas para ser liberado.</p>
        <p>Referência: ${escapeHtml(depositState.txid)}</p>
      `;
      if (refs.depositFeedback) {
        refs.depositFeedback.textContent =
          payload.message || "Deposito enviado para a dashboard. Aguarde a confirmacao manual.";
      }
      void syncPubpaidAccount();
      setWorldMessage("Deposito enviado para conferencia. Nenhum credito gratis foi liberado automaticamente.", 3600);
    } catch (error) {
      if (refs.depositFeedback) refs.depositFeedback.textContent = String(error.message || "Falha ao registrar deposito.");
    }
  }

  async function syncPubpaidAccount() {
    const user = getCatalogoGoogleAuthUser();
    if (!user?.email) {
      state.wallet.coins = 0;
      saveState();
      renderAll();
      return;
    }

    try {
      const payload = await requestApiJson("/api/pubpaid/account", { method: "GET" });
      state.wallet.coins = roundMoney(payload?.wallet?.balanceCoins || 0);
      saveState();
      renderAll();
      if (refs.withdrawFeedback) {
        const pendingDeposits = clampInteger(payload?.pending?.deposits || 0);
        const pendingWithdrawals = clampInteger(payload?.pending?.withdrawals || 0);
        refs.withdrawFeedback.textContent =
          pendingDeposits || pendingWithdrawals
            ? `Pendencias atuais: ${pendingDeposits} deposito(s) e ${pendingWithdrawals} retirada(s).`
            : "Sem pendencias abertas na carteira agora.";
      }
    } catch (error) {
      if (refs.withdrawFeedback) {
        refs.withdrawFeedback.textContent = String(error.message || "Nao consegui atualizar a carteira.");
      }
    }
  }

  async function requestPubPaidWithdrawal() {
    const user = getCatalogoGoogleAuthUser();
    if (!user?.email) {
      if (refs.withdrawFeedback) refs.withdrawFeedback.textContent = "Entre com Google antes de pedir retirada.";
      return;
    }

    const amount = getWithdrawalAmount();
    if (!amount) {
      if (refs.withdrawFeedback) refs.withdrawFeedback.textContent = "Informe um valor valido para a retirada, como 6,70.";
      refs.withdrawAmount?.focus?.();
      return;
    }
    try {
      await ensurePubpaidServerSession();
      const payload = await requestApiJson("/api/pubpaid/withdrawals", {
        method: "POST",
        body: JSON.stringify({
          amount,
          sourcePage: window.location.pathname
        })
      });
      state.wallet.coins = roundMoney(payload?.wallet?.balanceCoins || state.wallet.coins);
      saveState();
      renderAll();
      if (refs.withdrawFeedback) {
        refs.withdrawFeedback.textContent =
          payload.message || "Retirada enviada. O admin revisa manualmente em ate 3 horas.";
      }
      setWorldMessage("Retirada enviada para revisao manual do admin.", 3200);
    } catch (error) {
      if (refs.withdrawFeedback) refs.withdrawFeedback.textContent = String(error.message || "Falha ao pedir retirada.");
    }
  }

  function handleProfileSubmit(event) {
    event.preventDefault();
    if (!refs.profileForm) return;

    const shouldEnterGameAfterProfile = runtime.profileEntryMode;
    const formData = new FormData(refs.profileForm);
    const name = String(formData.get("name") || "").trim();
    const archetype = normalizeArchetype(formData.get("archetype"));
    const favorite = normalizeGameId(formData.get("favorite"));
    const motto = String(formData.get("motto") || "").trim();

    if (name.length < 2) {
      setText(refs.profileFeedback, "Escolha um nome curto para entrar no clima da noite.");
      return;
    }

    const authUser = getCatalogoGoogleAuthUser();
    if (!authUser?.email) {
      setText(refs.profileFeedback, "Entre com Google para salvar o personagem e abrir o caixa.");
      return;
    }

    const firstEntry = !state.profile.bonusClaimed;
    state.profile.registered = true;
    state.profile.avatarReady = true;
    state.profile.name = name;
    state.profile.archetype = archetype;
    state.profile.favorite = favorite;
    state.profile.motto = motto;
    state.profile.authProvider = "google";
    state.profile.googleSub = String(authUser.sub || "");
    state.profile.googleEmail = String(authUser.email || "");
    state.profile.googlePicture = String(authUser.picture || "");

    if (firstEntry) {
      state.profile.bonusClaimed = true;
      state.profile.starterCreditsRevoked = true;
      state.wallet.coins = 0;
    }

    saveState();
    closeModal("profile");
    renderAll();

    if (shouldEnterGameAfterProfile) {
      enterGameExperience({ skipChecks: true, announce: false, targetScene: "exterior" });
    }

    setWorldMessage(
      shouldEnterGameAfterProfile
        ? "Avatar salvo. Você apareceu na estrada da entrada e já pode ir até a porta do pub."
        : firstEntry
          ? "Personagem salvo com Google. Créditos grátis zerados: gere um QR no caixa para depositar."
          : "Seu personagem foi atualizado e o salão já reconheceu você.",
      2800
    );
  }

  function resetScenePosition() {
    runtime.scene = "exterior";
    runtime.player.x = 480;
    runtime.player.y = 548;
    runtime.player.facing = "up";
    clearPlayerWalkPath();
    runtime.prompt = null;
    runtime.npcBubbles = [];
  }

  function enterInterior() {
    runtime.scene = "interior";
    runtime.player.x = 480;
    runtime.player.y = 560;
    runtime.player.facing = "up";
    clearPlayerWalkPath();
    runtime.prompt = null;
    if (!runtime.npcs.length) runtime.npcs = createInteriorNpcs();
    runtime.npcBubbleTimer = 0.65;
    primeNpcBubbles();
  }

  function enterExterior() {
    runtime.scene = "exterior";
    runtime.player.x = 480;
    runtime.player.y = 548;
    runtime.player.facing = "up";
    clearPlayerWalkPath();
    runtime.prompt = null;
    runtime.npcBubbles = [];
    runtime.streetBubbleTimer = 0.8;
    primeStreetBubbles();
  }

  function openDoorDecision() {
    refs.doorModal.hidden = false;
  }

  function handleDoorChoice(choice) {
    closeModal("door");

    if (choice === "enter") {
      if (!hasGoogleSession()) {
        runtime.profileEntryMode = true;
        focusProfileAccess("Entre com Google para destravar a entrada do PubPaid.");
        return;
      }

      if (!hasAvatarProfile()) {
        openProfileModal({ entryMode: true });
        setText(refs.profileFeedback, "Agora falta só montar o avatar para abrir o salão.");
        return;
      }

      enterGameExperience({ skipChecks: true, announce: true });
      return;
    }

    if (choice === "retreat") {
      enterExterior();
      setWorldMessage("Você saiu do pub e voltou para a rua da entrada.", 2400);
    }
  }

  function openBadEndingModal() {
    runtime.badEndingStartedAt = performance.now();
    resetBadEndingGame();
    refs.badEndingModal.hidden = false;
  }

  function resetBadEndingGame() {
    runtime.badEndingGame = {
      active: true,
      status: "running",
      lane: 1,
      targetLane: 1,
      speed: 160,
      boost: 0,
      distance: 0,
      obstacleTimer: 0.6,
      obstacles: [],
      catchMeter: 0.22,
      hitFlash: 0,
      lastCreditLossAt: 0
    };
  }

  function triggerInteraction(forcedInteraction) {
    const interaction = forcedInteraction || runtime.prompt;
    if (!interaction) {
      setWorldMessage(
        runtime.scene === "exterior"
          ? "Chegue até a porta principal para começar."
          : "Chegue mais perto de uma mesa, do palco ou da jukebox.",
        1800
      );
      return;
    }

    if (interaction.type === "door") {
      openDoorDecision();
      return;
    }

    if (interaction.type === "exit") {
      enterExterior();
      setWorldMessage("Você voltou para a calçada e viu o pub inteiro aceso outra vez.", 2200);
      return;
    }

    if (interaction.type === "stage") {
      grantSingerCharm();
      if (!runtime.audio.enabled) toggleMusic(true);
      setWorldMessage("A cantora sorriu, mandou um beijinho e o salão ganhou outro clima.", 2400);
      return;
    }

    if (interaction.type === "shop") {
      if (!canEnterPubGame()) {
        openWaiterModal();
        setWorldMessage("O garcom apareceu. Primeiro passe por Google e avatar para jogar valendo.", 2400);
        return;
      }
      openWaiterModal();
      setWorldMessage("O garcom explicou o cardapio do balcao.", 2200);
      return;
    }

    if (interaction.type === "tips") {
      const npc = findNpcById("lito-copos");
      const tip = pickNpcLine(npc) || "Mesa boa entrega pista antes de pagar.";
      pushNpcBubble("lito-copos", tip, 4.8);
      setWorldMessage(`Lito diz: ${tip}`, 2600);
      return;
    }

    if (interaction.type === "jukebox") {
      openJukeboxModal();
      setWorldMessage("A jukebox abriu a playlist do salão.", 2200);
      return;
    }

    if (interaction.type === "game") {
      if (!canEnterPubGame()) {
        setWorldMessage("Entre com Google, monte o avatar e abra o salão antes de escolher uma mesa.", 2400);
        return;
      }
      openGameLobby(interaction.gameId);
    }
  }

  function handleVenueShortcut(venueKey) {
    const key = String(venueKey || "").trim();
    if (!key) return;

    if (key === "door") {
      if (runtime.scene === "interior") {
        enterExterior();
        setWorldMessage("Atalho rápido: você voltou para a calçada.", 2200);
      } else {
        openDoorDecision();
        setWorldMessage("Atalho rápido: a decisão da porta já está aberta.", 2200);
      }
      return;
    }

    if (runtime.scene === "exterior") {
      if (!hasGoogleSession()) {
        runtime.profileEntryMode = true;
        focusProfileAccess("Primeiro conecte o Google para liberar o acesso ao salão.");
        return;
      }

      if (!hasAvatarProfile()) {
        openProfileModal({ entryMode: true });
        setText(refs.profileFeedback, "Monte o avatar antes de pular direto para uma mesa.");
        return;
      }

      enterGameExperience({ skipChecks: true, announce: false });
    }

    const interaction = findInteractionByVenueKey(key);
    if (!interaction) {
      setWorldMessage("Esse atalho ainda não encontrou um destino dentro do pub.", 2200);
      return;
    }

    movePlayerToInteraction(interaction);
    runtime.prompt = interaction;
    renderSceneHud();

    if (interaction.type === "stage") {
      grantSingerCharm();
      if (!runtime.audio.enabled) toggleMusic(true);
      setWorldMessage("Atalho rapido: voce foi ao palco e a cantora respondeu com um beijinho.", 2200);
      return;
    }

    if (interaction.type === "game") {
      openGameLobby(interaction.gameId);
      setWorldMessage(`Atalho rápido: ${TABLE_META[interaction.gameId].label} já está aberta.`, 2200);
      return;
    }

    if (interaction.type === "shop") {
      openWaiterModal();
      setWorldMessage("Atalho rapido: o garcom apareceu no balcao.", 2200);
      return;
    }

    if (interaction.type === "tips") {
      const npc = findNpcById("lito-copos");
      const tip = pickNpcLine(npc) || "Mesa boa entrega pista antes de pagar.";
      pushNpcBubble("lito-copos", tip, 4.8);
      setWorldMessage(`Atalho rapido: Lito soltou a dica "${tip}"`, 2600);
      return;
    }

    if (interaction.type === "jukebox") {
      openJukeboxModal();
      setWorldMessage("Atalho rapido: a playlist da jukebox ja abriu.", 2200);
    }
  }

  function findInteractionByVenueKey(venueKey) {
    const list = INTERACTIONS.interior || [];
    return list.find((interaction) => interaction.venueKey === venueKey) || null;
  }

  function movePlayerToInteraction(interaction) {
    const standPoint = getInteractionStandPoint(interaction);
    if (!standPoint) return;
    runtime.player.x = standPoint.x;
    runtime.player.y = standPoint.y;
    runtime.player.facing = "up";
  }

  function toggleMusic(forceOn) {
    if (forceOn === true && runtime.audio.enabled) return;
    if (!runtime.audio.enabled) {
      startMusic();
    } else if (forceOn !== true) {
      stopMusic();
    }
    renderAudioButtons();
  }

  function grantSingerCharm() {
    state.secrets.singerCharm = Math.min(2, clampInteger(state.secrets.singerCharm) + 1);
    runtime.singerBursts.push({
      x: 836 + Math.random() * 18,
      y: 108 + Math.random() * 12,
      life: 1.1
    });
    runtime.singerBursts = runtime.singerBursts.slice(-4);
    saveState();
  }

  function getBadEndingLaneX(lane) {
    return [142, 258, 382, 500][Math.max(0, Math.min(3, lane))];
  }

  function spawnBadEndingObstacle() {
    const lane = Math.floor(Math.random() * 4);
    const roadLane = lane === 1 || lane === 2;
    const kinds = roadLane ? ["car", "taxi", "cone"] : ["bench", "trash", "post"];
    const kind = kinds[Math.floor(Math.random() * kinds.length)];
    runtime.badEndingGame.obstacles.push({
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      lane,
      kind,
      y: -60,
      speed: 0.85 + Math.random() * 0.2,
      width: roadLane ? 44 : 26,
      height: roadLane ? 66 : 42,
      hit: false
    });
  }

  function penalizeBadEndingCollision() {
    const game = runtime.badEndingGame;
    game.speed = Math.max(84, game.speed - 34);
    game.catchMeter = Math.min(1, game.catchMeter + 0.16);
    game.hitFlash = 0.55;
  }

  function finishBadEndingCatch() {
    const game = runtime.badEndingGame;
    if (game.status === "caught") return;
    game.status = "caught";
    game.active = false;
    if (game.lastCreditLossAt !== 1) {
      state.wallet.coins = Math.max(0, state.wallet.coins - 1);
      saveState();
      renderAll();
      game.lastCreditLossAt = 1;
    }
    setWorldMessage("A vassoura te acertou. Você perdeu 1 crédito nessa fuga.", 2600);
  }

  function updateBadEndingGame(delta) {
    const game = runtime.badEndingGame;
    if (!game.active || game.status !== "running") return;

    game.boost = Math.max(0, game.boost - delta * 0.85);
    game.speed = Math.min(206, game.speed + delta * (18 + game.boost * 24));
    game.speed = Math.max(82, game.speed - delta * 4);
    game.distance += game.speed * delta;
    game.lane += (game.targetLane - game.lane) * Math.min(1, delta * 10);
    game.obstacleTimer -= delta;
    game.hitFlash = Math.max(0, game.hitFlash - delta);

    if (game.obstacleTimer <= 0) {
      spawnBadEndingObstacle();
      game.obstacleTimer = Math.max(0.36, 1.08 - game.speed / 260);
    }

    const runnerY = 214;
    const runnerLane = Math.round(game.lane);
    game.obstacles.forEach((obstacle) => {
      obstacle.y += game.speed * delta * obstacle.speed;
      const sameLane = obstacle.lane === runnerLane;
      const verticalHit = obstacle.y + obstacle.height > runnerY && obstacle.y < runnerY + 52;
      if (!obstacle.hit && sameLane && verticalHit) {
        obstacle.hit = true;
        penalizeBadEndingCollision();
      }
    });
    game.obstacles = game.obstacles.filter((obstacle) => obstacle.y < 360);

    const pressure = 0.045 + Math.max(0, 142 - game.speed) * 0.0015;
    const relief = Math.max(0, game.speed - 150) * 0.0008;
    game.catchMeter = Math.max(0.08, Math.min(1, game.catchMeter + delta * pressure - delta * relief));

    if (game.catchMeter >= 1) {
      finishBadEndingCatch();
    }
  }

  function drawBadEndingBitmapBackdrop(ctx, canvas, scroll) {
    ctx.fillStyle = "#121826";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#1a2234";
    ctx.fillRect(0, 112, canvas.width, 188);

    for (let x = -((scroll * 0.18) % 68); x < canvas.width + 80; x += 68) {
      fillRect(ctx, x, 84, 22, 28, "#29344b");
      fillRect(ctx, x + 4, 70, 14, 14, "#1e283d");
      fillRect(ctx, x + 6, 92, 4, 6, "#ffe29a");
      fillRect(ctx, x + 14, 92, 4, 6, "#70ebff");
    }

    fillRect(ctx, 0, 188, canvas.width, 112, "#2a313e");
    fillRect(ctx, 110, 188, 64, 112, "#5c6069");
    fillRect(ctx, 470, 188, 64, 112, "#5c6069");
    fillRect(ctx, 174, 188, 296, 112, "#242b37");

    for (let y = -((scroll * 0.5) % 44); y < canvas.height + 44; y += 44) {
      fillRect(ctx, 318, y, 8, 22, "#fff4d6");
    }

    for (let y = -((scroll * 0.7) % 52); y < canvas.height + 52; y += 52) {
      fillRect(ctx, 148, y, 8, 22, "#c9d2df");
      fillRect(ctx, 494, y + 12, 8, 22, "#c9d2df");
    }
  }

  function drawBadEndingObstacle(ctx, obstacle) {
    const x = getBadEndingLaneX(obstacle.lane);
    if (obstacle.kind === "car" || obstacle.kind === "taxi") {
      fillRect(ctx, x - 20, obstacle.y, 40, 62, obstacle.kind === "taxi" ? "#ffca6b" : "#ff6b6b");
      fillRect(ctx, x - 16, obstacle.y + 8, 32, 20, "#70ebff");
      fillRect(ctx, x - 22, obstacle.y + 12, 4, 16, "#fff4d6");
      fillRect(ctx, x + 18, obstacle.y + 12, 4, 16, "#fff4d6");
      fillRect(ctx, x - 16, obstacle.y + 52, 10, 8, "#10131d");
      fillRect(ctx, x + 6, obstacle.y + 52, 10, 8, "#10131d");
      return;
    }

    if (obstacle.kind === "cone") {
      fillRect(ctx, x - 10, obstacle.y + 8, 20, 26, "#ff9f43");
      fillRect(ctx, x - 14, obstacle.y + 30, 28, 8, "#fff4d6");
      return;
    }

    if (obstacle.kind === "bench") {
      fillRect(ctx, x - 14, obstacle.y + 14, 28, 8, "#8b6236");
      fillRect(ctx, x - 12, obstacle.y + 22, 6, 18, "#5c3d24");
      fillRect(ctx, x + 6, obstacle.y + 22, 6, 18, "#5c3d24");
      return;
    }

    if (obstacle.kind === "trash") {
      fillRect(ctx, x - 10, obstacle.y + 8, 20, 24, "#6f86ff");
      fillRect(ctx, x - 12, obstacle.y + 4, 24, 6, "#c9d2df");
      return;
    }

    fillRect(ctx, x - 4, obstacle.y, 8, 36, "#9aa3b5");
    fillRect(ctx, x - 10, obstacle.y, 20, 6, "#ffca6b");
  }

  function drawBadEndingRunner(ctx, x, y, pace) {
    const arm = pace % 2 === 0 ? 0 : 4;
    const leg = pace >= 2 ? 4 : 0;
    fillRect(ctx, x - 14, y, 18, 14, "#f3c59f");
    fillRect(ctx, x - 18, y - 6, 26, 10, "#66ecff");
    fillRect(ctx, x - 18, y + 14, 30, 28, "#70ebff");
    fillRect(ctx, x - 24, y + 18 + arm, 8, 20, "#f3c59f");
    fillRect(ctx, x + 8, y + 14 - arm, 8, 20, "#f3c59f");
    fillRect(ctx, x - 14, y + 42, 8, 28 - leg, "#181522");
    fillRect(ctx, x + 2, y + 42 + leg, 8, 28 - leg, "#181522");
    fillRect(ctx, x - 30, y + 30 + arm, 16, 4, "#fff4d6");
    fillRect(ctx, x + 14, y + 18 - arm, 16, 4, "#fff4d6");
    fillRect(ctx, x - 14, y + 70, 28, 6, "#0b0a10");
  }

  function drawBadEndingWoman(ctx, x, y, swing) {
    fillRect(ctx, x - 12, y, 18, 14, "#f0c2a0");
    fillRect(ctx, x - 16, y - 4, 24, 8, "#6c4a2f");
    fillRect(ctx, x - 16, y + 14, 24, 28, "#ff62bd");
    fillRect(ctx, x - 22, y + 18, 8, 20, "#f0c2a0");
    fillRect(ctx, x + 8, y + 18, 8, 20, "#f0c2a0");
    fillRect(ctx, x - 12, y + 42, 6, 28, "#5f3c2d");
    fillRect(ctx, x + 2, y + 42, 6, 28, "#5f3c2d");
    ctx.save();
    ctx.translate(x + 16, y + 26);
    ctx.rotate(((46 + swing) * Math.PI) / 180);
    fillRect(ctx, 0, -2, 34, 4, "#c99858");
    fillRect(ctx, 26, -4, 14, 8, "#9d7144");
    ctx.restore();
    fillRect(ctx, x - 12, y + 70, 26, 6, "#0b0a10");
  }

  function drawBadEndingHud(ctx, game) {
    ctx.fillStyle = "rgba(8, 10, 18, 0.92)";
    ctx.fillRect(14, 14, 248, 72);
    ctx.fillStyle = "#ffca6b";
    ctx.font = "14px Chakra Petch";
    ctx.fillText("CORRIDA DA VASSOURA", 28, 34);
    ctx.fillStyle = "#f7f2d5";
    ctx.font = "12px Chakra Petch";
    ctx.fillText("Desvie dos carros e nao perca velocidade.", 28, 54);
    ctx.fillText(`Velocidade: ${Math.round(game.speed)}  |  Distancia: ${Math.round(game.distance / 10)}m`, 28, 72);

    ctx.fillStyle = "rgba(8, 10, 18, 0.92)";
    ctx.fillRect(390, 14, 236, 72);
    ctx.fillStyle = "#ff6b6b";
    ctx.fillText("PRESSAO DA VASSOURA", 404, 34);
    ctx.fillStyle = "#2a313e";
    ctx.fillRect(404, 48, 182, 12);
    ctx.fillStyle = game.catchMeter > 0.72 ? "#ff6b6b" : "#ffca6b";
    ctx.fillRect(404, 48, 182 * game.catchMeter, 12);
    ctx.fillStyle = "#f7f2d5";
    ctx.fillText(`Creditos em risco: 1`, 404, 76);
  }

  function drawBadEndingStatusOverlay(ctx, canvas, game) {
    if (game.status === "running") return;
    ctx.fillStyle = "rgba(8, 10, 18, 0.8)";
    ctx.fillRect(96, 102, canvas.width - 192, 96);
    ctx.fillStyle = "#ff6b6b";
    ctx.font = "20px 'Press Start 2P'";
    ctx.fillText("ELA TE ALCANCOU", 118, 138);
    ctx.fillStyle = "#f7f2d5";
    ctx.font = "14px Chakra Petch";
    ctx.fillText("A vassoura bateu e voce perdeu 1 credito nessa corrida.", 118, 168);
    ctx.fillText("Aperte Enter ou clique em correr de novo para reiniciar.", 118, 188);
  }

  function renderBadEndingScene(now) {
    if (!badEndingCtx || !refs.badEndingCanvas) return;

    const ctx = badEndingCtx;
    const canvas = refs.badEndingCanvas;
    const game = runtime.badEndingGame;
    const elapsed = runtime.badEndingStartedAt ? (now - runtime.badEndingStartedAt) / 1000 : 0;
    const scroll = game.distance * 0.9;
    const runnerX = getBadEndingLaneX(Math.round(game.lane));
    const pace = Math.floor(elapsed * Math.max(3.2, game.speed / 42)) % 4;
    const womanLane = Math.round(game.lane + (game.catchMeter > 0.78 ? 0 : -0.15));
    const womanX = getBadEndingLaneX(Math.max(0, Math.min(3, womanLane))) - 64 + game.catchMeter * 46;
    const womanY = 220 + game.catchMeter * 18;
    const swing = Math.sin(elapsed * 10) * 8;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBadEndingBitmapBackdrop(ctx, canvas, scroll);
    game.obstacles.forEach((obstacle) => drawBadEndingObstacle(ctx, obstacle));
    drawBadEndingWoman(ctx, womanX, womanY, swing);
    drawBadEndingRunner(ctx, runnerX, 170, pace);

    if (game.hitFlash > 0) {
      ctx.fillStyle = `rgba(255, 107, 107, ${Math.min(0.36, game.hitFlash * 0.45)})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    drawBadEndingHud(ctx, game);
    drawBadEndingStatusOverlay(ctx, canvas, game);
  }

  function renderTutorialScene(now) {
    if (!tutorialCtx || !refs.tutorialCanvas) return;

    const ctx = tutorialCtx;
    const canvas = refs.tutorialCanvas;
    const elapsed = runtime.tutorialStartedAt ? (now - runtime.tutorialStartedAt) / 1000 : 0;
    const sway = Math.sin(elapsed * 3.2) * 8;
    const spotlight = 0.18 + (Math.sin(elapsed * 2.4) + 1) * 0.1;
    const frame = Math.floor(elapsed * 5) % 4;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#08060f";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = `rgba(255, 202, 107, ${spotlight.toFixed(3)})`;
    ctx.beginPath();
    ctx.moveTo(210, 28);
    ctx.lineTo(138, 230);
    ctx.lineTo(282, 230);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#160f24";
    ctx.fillRect(0, 226, canvas.width, 94);
    ctx.fillStyle = "#2d1540";
    for (let index = 0; index < canvas.width; index += 26) {
      ctx.fillRect(index, 238 + ((index / 26) % 2) * 10, 12, 42);
    }
    ctx.fillStyle = "#ff62bd";
    for (let index = 12; index < canvas.width; index += 42) {
      ctx.fillRect(index, 232, 18, 3);
    }

    drawTutorialDancer(ctx, 174, 112, sway, frame);
    drawTutorialSpeechBubble(ctx, elapsed);
  }

  function drawTutorialDancer(ctx, x, y, sway, frame) {
    const armOffset = frame % 2 === 0 ? 0 : 4;
    const legOffset = frame >= 2 ? 4 : 0;
    const hipSway = Math.round(Math.sin((frame + 1) * 0.9) * 2);

    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.28)";
    ctx.fillRect(x + 10, y + 114, 52, 8);
    fillRect(ctx, x + 25, y, 20, 16, "#f4c59f");
    fillRect(ctx, x + 21, y - 7, 28, 10, "#ff62bd");
    fillRect(ctx, x + 18 + hipSway, y + 12, 34, 38, "#7f81ff");
    fillRect(ctx, x + 12, y + 18 + armOffset, 10, 28, "#f4c59f");
    fillRect(ctx, x + 50, y + 14 - armOffset, 10, 28, "#f4c59f");
    fillRect(ctx, x + 18 + hipSway, y + 50, 32, 18, "#ff62bd");
    fillRect(ctx, x + 22, y + 68, 10, 38 - legOffset, "#15111f");
    fillRect(ctx, x + 40, y + 68 + legOffset, 10, 38 - legOffset, "#15111f");
    fillRect(ctx, x + 19, y - 2, 10, 10, "#80e092");
    fillRect(ctx, x + 40, y + 18, 8, 8, "#fff4d6");
    fillRect(ctx, x + 12, y + 30 + armOffset, 10, 4, "#fff4d6");
    fillRect(ctx, x + 46, y + 24 - armOffset, 12, 4, "#fff4d6");
    ctx.restore();
  }

  function drawTutorialSpeechBubble(ctx, elapsed) {
    const pulse = 0.88 + Math.sin(elapsed * 2.4) * 0.06;
    const bubbleX = 22;
    const bubbleY = 18;
    const bubbleW = 206;
    const bubbleH = 72;

    ctx.save();
    ctx.globalAlpha = pulse;
    ctx.fillStyle = "rgba(9, 8, 18, 0.92)";
    ctx.fillRect(bubbleX, bubbleY, bubbleW, bubbleH);
    ctx.fillStyle = "#ffca6b";
    ctx.fillRect(bubbleX, bubbleY, bubbleW, 4);
    ctx.fillStyle = "#f7f2d5";
    ctx.font = "12px Chakra Petch";
    ctx.fillText("Aqui voce aprende como funciona.", bubbleX + 12, bubbleY + 26);
    ctx.fillText("Leia do lado, entre no clima", bubbleX + 12, bubbleY + 46);
    ctx.fillText("e depois caia pra dentro do salao.", bubbleX + 12, bubbleY + 62);
    ctx.restore();
  }

  function drawPixelWoman(ctx, x, y, swing) {
    ctx.save();
    ctx.fillStyle = "#0b0a10";
    ctx.fillRect(x + 6, y + 70, 30, 6);
    fillRect(ctx, x + 10, y, 16, 14, "#f0c2a0");
    fillRect(ctx, x + 8, y - 4, 20, 8, "#6c4a2f");
    fillRect(ctx, x + 8, y + 14, 20, 28, "#ff62bd");
    fillRect(ctx, x + 4, y + 18, 8, 20, "#f0c2a0");
    fillRect(ctx, x + 26, y + 18, 8, 20, "#f0c2a0");
    fillRect(ctx, x + 12, y + 42, 6, 28, "#5f3c2d");
    fillRect(ctx, x + 20, y + 42, 6, 28, "#5f3c2d");
    ctx.translate(x + 30, y + 22);
    ctx.rotate(((54 + swing) * Math.PI) / 180);
    fillRect(ctx, 0, -2, 42, 4, "#c99858");
    fillRect(ctx, 34, -4, 16, 8, "#9d7144");
    ctx.restore();
  }

  function drawPixelRunner(ctx, x, y) {
    ctx.save();
    ctx.fillStyle = "#0b0a10";
    ctx.fillRect(x + 4, y + 70, 32, 6);
    fillRect(ctx, x + 10, y, 16, 14, "#f3c59f");
    fillRect(ctx, x + 8, y - 4, 20, 8, "#66ecff");
    fillRect(ctx, x + 8, y + 14, 22, 28, "#70ebff");
    fillRect(ctx, x + 2, y + 18, 8, 18, "#f3c59f");
    fillRect(ctx, x + 28, y + 18, 8, 18, "#f3c59f");
    fillRect(ctx, x + 10, y + 42, 6, 28, "#181522");
    fillRect(ctx, x + 24, y + 42, 6, 28, "#181522");
    fillRect(ctx, x - 8, y + 28, 18, 4, "#fff4d6");
    fillRect(ctx, x + 34, y + 12, 18, 4, "#fff4d6");
    ctx.restore();
  }

  function fillRect(ctx, x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
  }

  function getActiveDrinkDefinition() {
    return DRINK_CATALOG.find((entry) => entry.id === state.shop.activeDrinkId) || null;
  }

  function getOwnedUpgrades() {
    return VISUAL_UPGRADES.filter((upgrade) => hasUpgrade(upgrade.id));
  }

  function getDrinkSpriteSpec(drinkId) {
    const specs = {
      "cafe-do-corredor": { className: "is-coffee", icon: "CF", accent: "#f0cf6d" },
      "neon-fizz": { className: "is-fizz", icon: "NZ", accent: "#70ebff" },
      "whisky-8bit": { className: "is-whisky", icon: "WK", accent: "#ffbf66" },
      "ouro-da-casa": { className: "is-gold", icon: "GD", accent: "#ffd66b" },
      "constelacao-reserva": { className: "is-constellation", icon: "CR", accent: "#c7b2ff" }
    };
    return specs[drinkId] || specs["cafe-do-corredor"];
  }

  function getUpgradeSpriteSpec(upgradeId) {
    const specs = {
      "neon-outline": { className: "is-outline", icon: "NO", accent: "#70ebff" },
      "gold-jacket": { className: "is-jacket", icon: "GJ", accent: "#ffd66b" },
      "vip-title": { className: "is-vip", icon: "VIP", accent: "#ff62bd" },
      "arcade-shades": { className: "is-shades", icon: "AR", accent: "#d9e7ff" },
      "lucky-hat": { className: "is-hat", icon: "HT", accent: "#f0cf6d" }
    };
    return specs[upgradeId] || specs["neon-outline"];
  }

  function renderInventorySpriteMarkup(kind, id) {
    const spec = kind === "drink" ? getDrinkSpriteSpec(id) : getUpgradeSpriteSpec(id);
    return `<span class="pubpaid-item-sprite ${spec.className}" data-kind="${kind}"><span>${escapeHtml(spec.icon)}</span></span>`;
  }

  function drawInventorySprite(ctx, x, y, kind, id) {
    const spec = kind === "drink" ? getDrinkSpriteSpec(id) : getUpgradeSpriteSpec(id);
    ctx.save();
    ctx.fillStyle = "rgba(8, 7, 18, 0.72)";
    ctx.fillRect(x, y, 22, 22);
    ctx.strokeStyle = spec.accent;
    ctx.lineWidth = 2;
    ctx.strokeRect(x + 1, y + 1, 20, 20);
    ctx.fillStyle = spec.accent;
    ctx.font = "bold 8px Chakra Petch";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(spec.icon, x + 11, y + 12);
    ctx.restore();
  }

  function hasUpgrade(upgradeId) {
    return state.shop.ownedUpgrades.includes(upgradeId);
  }

  function getSecretLuckBoost() {
    return {
      music: runtime.audio.enabled ? 0.04 : 0,
      singer: state.secrets.singerCharm > 0 ? 0.03 : 0
    };
  }

  function rollDrinkFortune(drink, stake, hiddenBoost) {
    const boost = hiddenBoost || { music: 0, singer: 0 };
    const baseGoodChance = drink ? drink.goodChance : 0.03;
    const baseBadChance = drink ? drink.badChance : 0.01;
    const goodChance = Math.min(0.26, baseGoodChance + boost.music + boost.singer);
    const badChance = Math.max(0.005, baseBadChance);
    const roll = Math.random();
    if (roll < badChance) {
      return {
        mood: "bad",
        type: Math.random() > 0.5 ? "house-edge" : "cold-hand",
        coinValue: Math.max(1, Math.round(stake * 0.1)),
        note: `${drink ? drink.name : "A noite"} pesou na mao e trouxe um azar leve.`
      };
    }
    if (roll < badChance + goodChance) {
      return {
        mood: "good",
        type: Math.random() > 0.45 ? "extra-round" : "bonus-pot",
        coinValue: Math.max(1, Math.round(stake * 0.15)),
        note: `${drink ? drink.name : "O clima do salao"} bateu bem e abriu uma sorte pequena para a mesa.`
      };
    }
    return {
      mood: "neutral",
      type: "steady",
      coinValue: 0,
      note: `${drink ? drink.name : "O clima do salao"} ficou so no clima. Nada mudou nessa rodada.`
    };
  }

  function announceFortune(fortune) {
    if (!fortune) return;
    if (fortune.mood === "good") {
      setWorldMessage("A bebida bateu com sorte. Talvez a mesa abra uma chance extra.", 2400);
      return;
    }
    if (fortune.mood === "bad") {
      setWorldMessage("A bebida bateu torto. O azar da noite pode aparecer em detalhe pequeno.", 2400);
    }
  }

  function resolveFortuneOutcome(game, result, summary) {
    if (!game.fortune) {
      return {
        result,
        summary,
        coinDelta: 0,
        fortuneNote: ""
      };
    }

    const fortune = game.fortune;
    if (result === "loss" && fortune.type === "extra-round") {
      return {
        result: "tie",
        summary: `${summary} A bebida segurou a queda e a casa devolveu sua entrada com uma rodada extra simbolica.`,
        coinDelta: 0,
        fortuneNote: `${fortune.note} A derrota virou empate.`
      };
    }

    if (result === "win" && fortune.type === "bonus-pot") {
      return {
        result,
        summary,
        coinDelta: fortune.coinValue,
        fortuneNote: `${fortune.note} A casa pingou ${formatCoins(fortune.coinValue)} no premio.`
      };
    }

    if (result === "win" && fortune.type === "house-edge") {
      return {
        result,
        summary,
        coinDelta: -fortune.coinValue,
        fortuneNote: `${fortune.note} A mesa comeu ${formatCoins(fortune.coinValue)} do premio.`
      };
    }

    if (result === "loss" && fortune.type === "cold-hand") {
      return {
        result,
        summary,
        coinDelta: -fortune.coinValue,
        fortuneNote: `${fortune.note} A casa puxou mais ${formatCoins(fortune.coinValue)} no fim da rodada.`
      };
    }

    return {
      result,
      summary,
      coinDelta: 0,
      fortuneNote: fortune.mood === "neutral" ? fortune.note : ""
    };
  }

  function startMusic() {
    ensureAudioContext();
    if (!runtime.audio.ctx) return;
    runtime.audio.enabled = true;
    runtime.audio.step = 0;
    if (runtime.audio.timer) window.clearInterval(runtime.audio.timer);
    runtime.audio.timer = window.setInterval(scheduleMusicStep, getCurrentJukeboxTrack().tempoMs);
    scheduleMusicStep();
    renderAudioButtons();
  }

  function stopMusic() {
    runtime.audio.enabled = false;
    if (runtime.audio.timer) {
      window.clearInterval(runtime.audio.timer);
      runtime.audio.timer = null;
    }
    renderAudioButtons();
  }

  function ensureAudioContext() {
    if (runtime.audio.ctx) {
      if (runtime.audio.ctx.state === "suspended") runtime.audio.ctx.resume();
      return;
    }
    try {
      runtime.audio.ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (error) {
      runtime.audio.ctx = null;
    }
  }

  function scheduleMusicStep() {
    const ctx = runtime.audio.ctx;
    if (!ctx || !runtime.audio.enabled) return;
    if (ctx.state === "suspended") ctx.resume();
    const track = getCurrentJukeboxTrack();
    const melody = track.melody;
    const bass = track.bass;
    const harmony = track.harmony;

    const when = ctx.currentTime + 0.03;
    const step = runtime.audio.step % melody.length;

    playNote(midiToFreq(bass[step]), 0.28, track.bassType || "triangle", 0.04, when);
    playNote(midiToFreq(melody[step]), 0.18, track.leadType || "square", 0.026, when + 0.015);
    if (harmony[step]) playNote(midiToFreq(harmony[step]), 0.18, track.harmonyType || "triangle", 0.016, when + 0.05);
    if (melody[(step + 2) % melody.length]) {
      playNote(midiToFreq(melody[(step + 2) % melody.length] - 12), 0.12, "square", 0.01, when + 0.09);
    }

    runtime.audio.step += 1;
  }

  function playNote(frequency, duration, type, volume, when) {
    const ctx = runtime.audio.ctx;
    if (!ctx) return;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, when);
    gain.gain.setValueAtTime(0.0001, when);
    gain.gain.linearRampToValueAtTime(volume, when + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, when + duration);
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start(when);
    oscillator.stop(when + duration + 0.03);
  }

  function updateTrafficAudio(delta, now) {
    if (!runtime.audio.enabled || runtime.scene !== "exterior") return;
    runtime.audio.trafficTimer += delta;
    if (runtime.audio.trafficTimer < runtime.audio.trafficCooldown) return;
    runtime.audio.trafficTimer = 0;
    runtime.audio.trafficCooldown = randomBetween(2.2, 5.1);
    const motorcycles = runtime.exteriorTraffic.filter((vehicle) => vehicle.kind === "moto" && vehicle.wait <= 0);
    const cars = runtime.exteriorTraffic.filter((vehicle) => vehicle.kind === "car" && vehicle.wait <= 0);
    const kind = motorcycles.length && Math.sin(now / 800) > 0.18 ? "moto" : "car";
    playTrafficPass(kind);
  }

  function playTrafficPass(kind = "car") {
    ensureAudioContext();
    const ctx = runtime.audio.ctx;
    if (!ctx) return;
    const when = ctx.currentTime + 0.02;
    const duration = kind === "moto" ? 0.56 : 0.74;
    const base = kind === "moto" ? 168 : 92;
    const end = kind === "moto" ? 228 : 128;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    oscillator.type = kind === "moto" ? "sawtooth" : "triangle";
    oscillator.frequency.setValueAtTime(base, when);
    oscillator.frequency.exponentialRampToValueAtTime(end, when + duration);
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(kind === "moto" ? 980 : 760, when);
    gain.gain.setValueAtTime(0.0001, when);
    gain.gain.linearRampToValueAtTime(kind === "moto" ? 0.02 : 0.014, when + 0.06);
    gain.gain.exponentialRampToValueAtTime(0.0001, when + duration);
    oscillator.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start(when);
    oscillator.stop(when + duration + 0.04);
  }

  function midiToFreq(midi) {
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  function openGameLobby(gameId) {
    const normalized = normalizeGameId(gameId);
    if (!TABLE_META[normalized]) return;

    clearGameTimer();
    runtime.activeGame = {
      id: normalized,
      mode: runtime.demoMode ? "treino" : "valendo",
      screen: "lobby",
      stake: TABLE_META[normalized].stakes[0],
      payout: 0,
      houseFee: 0,
      opponent: { ...HOUSE_OPPONENTS[normalized] },
      feedback: "",
      summary: "",
      result: "",
      resultAmount: "",
      activeDrink: getActiveDrinkDefinition(),
      fortune: null,
      tableState: null,
      startedAt: "",
      multiplayer: TABLE_META[normalized].pvp && !runtime.demoMode
        ? {
            enabled: true,
            state: "idle",
            matchId: "",
            seat: "",
            waiting: false,
            stakeLocked: false,
            settled: false,
          }
        : null,
    };

    refs.gameModal.hidden = false;
    renderGameModal();
  }

  function closeGameModal(forceClose) {
    if (!runtime.activeGame) {
      refs.gameModal.hidden = true;
      return;
    }

    if (!forceClose && runtime.activeGame.screen === "playing") {
      setWorldMessage("Use o botao de sair da mesa para abandonar a partida.", 2200);
      return;
    }

    if (runtime.activeGame.multiplayer?.enabled) {
      void leaveActivePvpGame(runtime.activeGame);
    }
    clearGameTimer();
    clearPvpPoll();
    runtime.activeGame = null;
    refs.gameModal.hidden = true;
    refs.gameHost.innerHTML = "";
    clearPoolRefs();
  }

  function renderGameModal() {
    if (!runtime.activeGame || !refs.gameHost) {
      refs.gameModal.hidden = true;
      return;
    }

    const game = runtime.activeGame;
    refs.gameModal.hidden = false;
    setText(refs.gameTitle, TABLE_META[game.id].label);
    setText(
      refs.gameSubtitle,
      game.screen === "lobby"
        ? TABLE_META[game.id].description
        : game.screen === "finished"
          ? game.summary
          : TABLE_META[game.id].sceneCopy
    );
    setText(
      refs.gameKicker,
      game.screen === "lobby"
        ? TABLE_META[game.id].isSolo
          ? "solo da casa"
          : "mesa aberta"
        : game.screen === "finished"
          ? "resultado"
          : "partida ao vivo"
    );

    if (game.screen === "lobby") {
      refs.gameHost.innerHTML = renderGameLobby(game);
      clearPoolRefs();
      return;
    }

    if (game.screen === "finished") {
      refs.gameHost.innerHTML = renderGameFinished(game);
      clearPoolRefs();
      return;
    }

    if (game.id === "pool") {
      refs.gameHost.innerHTML = renderPoolGame(game);
      syncPoolRefs();
      drawPoolTable();
      updatePoolHud();
      return;
    }

    if (game.id === "checkers") {
      refs.gameHost.innerHTML = renderCheckersGame(game);
      clearPoolRefs();
      return;
    }

    if (game.id === "chess") {
      refs.gameHost.innerHTML = renderChessGame(game);
      clearPoolRefs();
      return;
    }

    if (game.id === "cards21") {
      refs.gameHost.innerHTML = renderCardsGame(game);
      clearPoolRefs();
      return;
    }

    if (game.id === "poker") {
      refs.gameHost.innerHTML = renderPokerGame(game);
      clearPoolRefs();
      return;
    }

    if (game.id === "truco") {
      refs.gameHost.innerHTML = renderTrucoGame(game);
      clearPoolRefs();
      return;
    }

    if (game.id === "dicecups") {
      refs.gameHost.innerHTML = renderDiceGame(game);
      clearPoolRefs();
      return;
    }

    if (game.id === "slots") {
      refs.gameHost.innerHTML = renderSlotsGame(game);
      clearPoolRefs();
      return;
    }

    if (game.id === "roulette") {
      refs.gameHost.innerHTML = renderRouletteGame(game);
      clearPoolRefs();
      return;
    }

    if (game.id === "darts") {
      refs.gameHost.innerHTML = renderDartsGame(game);
      clearPoolRefs();
    }
  }

  function renderGameLobby(game) {
    const stakes = TABLE_META[game.id].stakes
      .map(
        (stake) => `
          <button
            class="pubpaid-stake-button ${stake === game.stake ? "is-active" : ""}"
            type="button"
            data-game-stake="${stake}"
          >
            ${formatCoins(stake)}
          </button>
        `
      )
      .join("");

    const isSolo = Boolean(TABLE_META[game.id].isSolo);
    const isPvp = Boolean(TABLE_META[game.id].pvp);
    const trainingMode = runtime.demoMode;
    const startLabel = trainingMode ? "Treinar agora" : isSolo ? "Sentar na maquina" : "Encontrar rival";
    const pvpStartLabel =
      game.multiplayer?.state === "waiting"
        ? "Esperando outro jogador"
        : game.multiplayer?.matchId
          ? "Mesa conectada"
          : "Entrar na fila PvP";
    const flowLines = isSolo
      ? `
        <li>Voce joga sozinho contra a maquina e a aposta entra no instante em que a rodada começa.</li>
        <li>Puxe a alavanca para girar os tres rolos e tente montar vantagem em uma série curta.</li>
        <li>Apostas liberadas: ${DEMO_STAKES.map((stake) => formatCoins(stake)).join(", ")}.</li>
      `
      : `
        <li>Voce entra pela mesa, encontra um rival e joga na hora.</li>
        <li>Se ganhar a série, leva o pote. Se perder, deixa a aposta na mesa.</li>
        <li>Apostas liberadas: ${DEMO_STAKES.map((stake) => formatCoins(stake)).join(", ")}.</li>
      `;

    if (isPvp) {
      const selfPlayer = getProfileSnapshot();
      const rivalPlayer = game.multiplayer?.state === "waiting" ? null : game.opponent;
      return `
        <div class="pubpaid-game-lobby is-pvp">
          <article class="pubpaid-game-box">
            <span class="pubpaid-game-chip">${escapeHtml(TABLE_META[game.id].shortLabel)}</span>
            <h3>${escapeHtml(TABLE_META[game.id].label)} PvP</h3>
            <p>${escapeHtml(TABLE_META[game.id].description)}</p>
            <ul>
              <li>Escolha a aposta, sente na mesa e o lobby espera outro jogador real entrar na mesma rodada.</li>
              <li>Quando a segunda conexão chega, a partida sobe automaticamente para os dois lados.</li>
              <li>Seu avatar fica visível no lobby enquanto a mesa conecta.</li>
            </ul>
          </article>

          <article class="pubpaid-game-box">
            <div class="pubpaid-game-chip-row">
              <span class="pubpaid-game-chip">saldo ${escapeHtml(formatCoins(state.wallet.coins))}</span>
              <span class="pubpaid-game-chip">aposta ${escapeHtml(formatCoins(game.stake))}</span>
              <span class="pubpaid-game-chip">${trainingMode ? "modo treino" : game.multiplayer?.state === "waiting" ? "aguardando rival" : "mesa PvP ao vivo"}</span>
            </div>
            <div class="pubpaid-lobby-avatar-row">
              ${renderLobbyAvatarCard(selfPlayer, "self")}
              ${renderLobbyAvatarCard(rivalPlayer, "rival")}
            </div>
            <div class="pubpaid-stake-row">${stakes}</div>
            <p class="pubpaid-feedback">${escapeHtml(game.feedback || `A mesa de ${TABLE_META[game.id].shortLabel} agora sobe com outro jogador real.`)}</p>
            <div class="pubpaid-card-actions">
              <button class="pubpaid-card-button" type="button" data-start-game ${!trainingMode && game.multiplayer?.state === "waiting" ? "disabled" : ""}>${escapeHtml(trainingMode ? "Treino instantaneo" : pvpStartLabel)}</button>
              <button class="pubpaid-card-button" type="button" data-close-finished>Voltar ao salao</button>
            </div>
          </article>
        </div>
      `;
    }

    return `
      <div class="pubpaid-game-lobby">
        <article class="pubpaid-game-box">
          <span class="pubpaid-game-chip">${escapeHtml(TABLE_META[game.id].shortLabel)}</span>
          <h3>${escapeHtml(TABLE_META[game.id].label)}</h3>
          <p>${escapeHtml(TABLE_META[game.id].description)}</p>
          <ul>${flowLines}</ul>
        </article>

        <article class="pubpaid-game-box">
          <div class="pubpaid-game-chip-row">
            <span class="pubpaid-game-chip">saldo ${escapeHtml(formatCoins(state.wallet.coins))}</span>
            <span class="pubpaid-game-chip">${trainingMode ? "treino livre" : `${escapeHtml(isSolo ? "maquina solo" : "rival")} ${escapeHtml(game.opponent.name)}`}</span>
            <span class="pubpaid-game-chip">${game.activeDrink ? `bebida ${escapeHtml(game.activeDrink.name)}` : "sem bebida ativa"}</span>
          </div>
          <p>${escapeHtml(game.opponent.bio)}</p>
          ${game.activeDrink ? `<p class="pubpaid-feedback">A bebida pode dar boa sorte em ${Math.round(game.activeDrink.goodChance * 100)}% ou azar em ${Math.round(game.activeDrink.badChance * 100)}% da rodada.</p>` : ""}
          <div class="pubpaid-stake-row">${stakes}</div>
          <p class="pubpaid-feedback">${escapeHtml(trainingMode ? "Esta mesa abriu em modo de visita: voce pode conhecer as mecanicas sem mexer no saldo." : "Esta mesa usa o saldo real ja liberado na sua carteira aprovada.")}</p>
          <div class="pubpaid-card-actions">
            <button class="pubpaid-card-button" type="button" data-start-game>${escapeHtml(startLabel)}</button>
            <button class="pubpaid-card-button" type="button" data-close-finished>Voltar ao salao</button>
          </div>
          ${game.feedback ? `<p class="pubpaid-feedback">${escapeHtml(game.feedback)}</p>` : ""}
        </article>
      </div>
    `;
  }

  function renderGameFinished(game) {
    const bannerClass =
      game.result === "win" ? "is-win" : game.result === "loss" ? "is-loss" : "is-tie";
    const title =
      game.result === "win" ? "Voce venceu" : game.result === "loss" ? "Voce perdeu" : "Empate";

    return `
      <section class="pubpaid-result-banner ${bannerClass}">
        <span class="pubpaid-result-chip">${escapeHtml(TABLE_META[game.id].label)}</span>
        <strong>${escapeHtml(title)}</strong>
        <p>${escapeHtml(game.summary)}</p>
        ${game.fortuneNote ? `<p class="pubpaid-feedback">${escapeHtml(game.fortuneNote)}</p>` : ""}
        <div class="pubpaid-result-amount">${escapeHtml(game.resultAmount)}</div>
      </section>

      <section class="pubpaid-result-panel">
        <article>
          <span>rival</span>
          <strong>${escapeHtml(game.opponent.name)}</strong>
          <p>${escapeHtml(game.opponent.bio)}</p>
        </article>
        <article>
          <span>saldo atual</span>
          <strong>${escapeHtml(formatCoins(state.wallet.coins))}</strong>
          <p>O historico local ja guardou essa rodada.</p>
        </article>
      </section>

      <div class="pubpaid-result-actions">
        <button class="pubpaid-card-button" type="button" data-rematch-game>Mesma mesa de novo</button>
        <button class="pubpaid-card-button" type="button" data-close-finished>Fechar mesa</button>
      </div>
    `;
  }

  function startActiveGame() {
    const game = runtime.activeGame;
    if (!game || game.screen !== "lobby") return;
    const trainingMode = runtime.demoMode;
    if (state.wallet.coins < game.stake) {
      if (!trainingMode) {
        game.feedback = `Saldo insuficiente. Voce precisa de ${formatCoins(game.stake)}.`;
        renderGameModal();
        return;
      }
    }

    game.feedback = "";
    game.startedAt = new Date().toISOString();
    game.houseFee = roundMoney(game.stake - getMatchWinnerPayout(game.stake));
    game.payout = getMatchWinnerPayout(game.stake);
    game.fortune = rollDrinkFortune(game.activeDrink, game.stake, getSecretLuckBoost());
    game.screen = "playing";
    if (!trainingMode) {
      state.wallet.coins -= game.stake;
    }
    state.shop.activeDrinkId = "";
    if (state.secrets.singerCharm > 0) state.secrets.singerCharm -= 1;

    if (game.id === "pool") {
      game.tableState = createPoolState();
    } else if (game.id === "checkers") {
      game.tableState = createCheckersState();
    } else if (game.id === "chess") {
      game.tableState = createChessState();
    } else if (game.id === "cards21") {
      game.tableState = createCardsState();
    } else if (game.id === "poker") {
      game.tableState = createPokerState();
    } else if (game.id === "truco") {
      game.tableState = createTrucoState();
    } else if (game.id === "dicecups") {
      game.tableState = createDiceState();
    } else if (game.id === "slots") {
      game.tableState = createSlotsState();
    } else if (game.id === "roulette") {
      game.tableState = createRouletteState(game.stake);
    } else if (game.id === "darts") {
      game.tableState = createDartsState();
    }

    saveState();
    renderAll();
    if (game.fortune) announceFortune(game.fortune);
  }

  function drawBarBartender(now) {
    if (runtime.scene !== "interior") return;
    const npc = findNpcById("garcom-vito");
    const anchorX = npc?.x || 302;
    const anchorY = npc?.y || 139;
    const sway = Math.sin(now / 340) * 1.1;
    const topY = anchorY - 34 + sway;

    sceneCtx.save();
    sceneCtx.beginPath();
    sceneCtx.rect(anchorX - 22, anchorY - 46, 44, 34);
    sceneCtx.clip();

    sceneCtx.fillStyle = "#261813";
    sceneCtx.fillRect(anchorX - 10, topY - 4, 20, 8);
    sceneCtx.fillRect(anchorX - 8, topY - 8, 16, 4);

    sceneCtx.fillStyle = "#f4c59f";
    sceneCtx.fillRect(anchorX - 8, topY, 16, 13);
    sceneCtx.fillStyle = "#fff8ee";
    sceneCtx.fillRect(anchorX - 4, topY + 5, 2, 2);
    sceneCtx.fillRect(anchorX + 2, topY + 5, 2, 2);
    sceneCtx.fillStyle = "#fff2e0";
    sceneCtx.fillRect(anchorX - 10, topY + 13, 20, 12);
    sceneCtx.fillStyle = "#2d473d";
    sceneCtx.fillRect(anchorX - 14, topY + 13, 4, 14);
    sceneCtx.fillRect(anchorX + 10, topY + 13, 4, 14);
    sceneCtx.fillRect(anchorX - 5, topY + 15, 10, 10);
    sceneCtx.fillStyle = "#cfa85a";
    sceneCtx.fillRect(anchorX - 1, topY + 13, 2, 12);
    sceneCtx.fillStyle = "#3b241c";
    sceneCtx.fillRect(anchorX - 15, topY + 22, 30, 6);
    sceneCtx.fillStyle = "#f4c59f";
    sceneCtx.fillRect(anchorX - 18, topY + 16, 4, 11);
    sceneCtx.fillRect(anchorX + 14, topY + 16, 4, 11);
    sceneCtx.restore();

    sceneCtx.save();
    sceneCtx.fillStyle = "#c98f4f";
    sceneCtx.fillRect(anchorX + 16, anchorY - 24, 3, 10);
    sceneCtx.fillStyle = "#f0dfc1";
    sceneCtx.fillRect(anchorX + 16, anchorY - 26, 3, 2);
    sceneCtx.restore();

    drawBartenderLabel(anchorX, anchorY, now);
  }

  function drawBartenderLabel(anchorX, anchorY, now) {
    const pulse = 1 + Math.sin(now / 220) * 0.08;
    sceneCtx.save();
    sceneCtx.font = "bold 13px Chakra Petch";
    const label = "GARÇOM";
    const width = Math.ceil(sceneCtx.measureText(label).width) + 22;
    const x = anchorX - width / 2;
    const y = anchorY - 72;
    sceneCtx.fillStyle = "rgba(8, 7, 18, 0.9)";
    sceneCtx.fillRect(x, y, width, 22);
    sceneCtx.strokeStyle = "rgba(128, 224, 146, 0.82)";
    sceneCtx.strokeRect(x, y, width, 22);
    sceneCtx.fillStyle = "#f7f2d5";
    sceneCtx.fillText(label, x + 11, y + 15);
    sceneCtx.translate(anchorX + width / 2 - 4, y + 11);
    sceneCtx.scale(pulse, pulse);
    sceneCtx.fillStyle = "#80e092";
    sceneCtx.beginPath();
    sceneCtx.arc(0, 0, 5, 0, Math.PI * 2);
    sceneCtx.fill();
    sceneCtx.restore();
  }

  function rematchCurrentGame() {
    const game = runtime.activeGame;
    if (!game) return;
    const sameId = game.id;
    closeGameModal(true);
    openGameLobby(sameId);
  }

  function abandonActiveGame() {
    if (!runtime.activeGame || runtime.activeGame.screen !== "playing") return;
    if (runtime.activeGame.multiplayer?.enabled) {
      void leaveActivePvpGame(runtime.activeGame);
    }
    finalizeGame("loss", "Voce levantou da mesa antes do fim da rodada.");
  }

  function getHouseFee(stake) {
    return roundMoney(stake * 0.2);
  }

  function getMatchWinnerPayout(stake) {
    return roundMoney(stake + stake * 0.8);
  }

  function finalizeGame(result, summary) {
    const game = runtime.activeGame;
    if (!game || game.screen === "finished") return;
    const trainingMode = runtime.demoMode;

    clearGameTimer();
    clearPoolRefs(false);

    const resolved = resolveFortuneOutcome(game, result, summary);
    game.screen = "finished";
    game.result = resolved.result;
    game.summary = trainingMode
      ? `${resolved.summary} Rodada em modo de visita, sem mexer no saldo real da carteira.`
      : resolved.summary;
    game.fortuneNote = resolved.fortuneNote;

    if (trainingMode) {
      game.resultAmount = resolved.result === "loss" ? "Treino concluido" : "Treino concluido";
      saveState();
      renderAll();
      return;
    }

    if (resolved.result === "win") {
      const finalPayout = Math.max(0, game.payout + resolved.coinDelta);
      state.wallet.coins += finalPayout;
      state.wallet.wins += 1;
      state.wallet.bestWin = Math.max(state.wallet.bestWin, finalPayout);
      game.resultAmount = `+${formatCoins(finalPayout)}`;
    } else if (resolved.result === "loss") {
      state.wallet.losses += 1;
      const finalLoss = game.stake + Math.max(0, -resolved.coinDelta);
      if (resolved.coinDelta < 0) state.wallet.coins = Math.max(0, state.wallet.coins + resolved.coinDelta);
      game.resultAmount = `-${formatCoins(finalLoss)}`;
    } else {
      const refunded = game.stake + Math.max(0, resolved.coinDelta);
      state.wallet.coins += refunded;
      game.resultAmount = `+${formatCoins(refunded)}`;
    }

    state.history.unshift({
      id: `history-${Date.now()}`,
      title: `${TABLE_META[game.id].label}`,
      result: resolved.result,
      summary: resolved.summary,
      amount: game.resultAmount,
      opponent: game.opponent.name,
      at: new Date().toISOString()
    });
    state.history = state.history.slice(0, HISTORY_LIMIT);

    saveState();
    renderAll();
  }

  function getCurrentJukeboxTrack() {
    return JUKEBOX_TRACKS[runtime.audio.currentTrackIndex] || JUKEBOX_TRACKS[0];
  }

  function selectJukeboxTrack(trackId) {
    const nextIndex = JUKEBOX_TRACKS.findIndex((track) => track.id === trackId);
    if (nextIndex < 0) return;
    runtime.audio.currentTrackIndex = nextIndex;
    runtime.audio.step = 0;
    if (runtime.audio.enabled) {
      startMusic();
    } else {
      renderAll();
    }
    if (refs.jukeboxModal?.hidden === false) {
      renderJukeboxModal(`Agora toca ${getCurrentJukeboxTrack().name}.`);
    }
    setWorldMessage(`Jukebox: ${getCurrentJukeboxTrack().name} entrou na fila da noite.`, 2200);
  }

  function renderPoolGame(game) {
    const pool = game.tableState;
    const targetBall = getLowestPoolTarget(pool);
    return `
      <div class="pubpaid-pool-layout">
        <section class="pubpaid-pool-stage">
          <div class="pubpaid-minigame-head">
            <div>
              <strong>Sinuca 9 bolas</strong>
              <span>Segure o clique, solte na força certa e mate a 9 para fechar o pote.</span>
            </div>
            <div class="pubpaid-game-chip-row">
              <span class="pubpaid-turn-chip">entrada ${escapeHtml(formatCoins(game.stake))}</span>
              <span class="pubpaid-turn-chip">pote ${escapeHtml(formatCoins(game.payout))}</span>
            </div>
          </div>
          <canvas class="pubpaid-pool-canvas" data-pool-canvas width="760" height="430"></canvas>
          <div class="pubpaid-pool-bottom">
            <div class="pubpaid-meter">
              <span data-pool-meter-fill></span>
            </div>
            <div class="pubpaid-meter-label">
              <span data-pool-status>${escapeHtml(pool.message)}</span>
              <span data-pool-turn>${escapeHtml(pool.turn === "player" ? "sua vez" : `${game.opponent.name} na tacada`)}</span>
            </div>
          </div>
          <div class="pubpaid-pool-helper">
            <span>clique para mirar</span>
            <span>segure para carregar</span>
            <span>solte para bater</span>
          </div>
          <div class="pubpaid-pool-mobile-controls">
            <label class="pubpaid-pool-mobile-card">
              <span>Mira mobile</span>
              <input type="range" min="0" max="359" step="1" value="${escapeHtml(String(getPoolAimDegrees(pool)))}" data-pool-angle-slider />
              <small>Ajuste o angulo da branca no dedo.</small>
            </label>
            <div class="pubpaid-pool-mobile-card">
              <span>Força mobile</span>
              <button class="pubpaid-card-button pubpaid-pool-charge-button" type="button" data-pool-charge-button>
                Segure para carregar, solte para bater
              </button>
              <small>Primeiro mire. Depois segure o botão e solte na força certa.</small>
            </div>
          </div>
        </section>

        <section class="pubpaid-pool-side">
          <article class="pubpaid-pool-duel">
            <div class="pubpaid-pool-player-card is-player">
              <span>jogador</span>
              <strong>${escapeHtml(state.profile.name || "Voce")}</strong>
              <small data-pool-player-pocketed>${escapeHtml(String(pool.playerPocketed))} bolas derrubadas</small>
            </div>
            <div class="pubpaid-pool-player-card is-bot">
              <span>rival</span>
              <strong>${escapeHtml(game.opponent.name)}</strong>
              <small data-pool-bot-pocketed>${escapeHtml(String(pool.botPocketed))} bolas derrubadas</small>
            </div>
          </article>
          <article>
            <span>bola alvo</span>
            <strong data-pool-target>${escapeHtml(targetBall ? `bola ${targetBall.id}` : "bola 9")}</strong>
            <p>A menor bola viva guia a rodada. A 9 fecha a mesa quando cai limpa.</p>
          </article>
          <article>
            <span>mesa viva</span>
            <strong data-pool-remaining>${escapeHtml(String(countPoolColored(pool)))}</strong>
            <p>Bolas numeradas ainda de pé antes da tacada final.</p>
          </article>
          <article>
            <span>força e ângulo</span>
            <strong><span data-pool-power>${escapeHtml(String(Math.round(pool.charge * 100)))}</span>% / <span data-pool-angle>${escapeHtml(String(getPoolAimDegrees(pool)))}</span>°</strong>
            <p>Use a carga para controlar a pancada e ajustar a leitura da mesa.</p>
          </article>
          <article>
            <span>placar de bar</span>
            <strong data-pool-score>${escapeHtml(String(pool.playerPocketed))} x ${escapeHtml(String(pool.botPocketed))}</strong>
            <p>Quem derruba melhor chega com moral na 9 e leva a mesa.</p>
          </article>
          <div class="pubpaid-card-actions">
            <button class="pubpaid-card-button" type="button" data-abandon-game>Sair da mesa</button>
          </div>
        </section>
      </div>
    `;
  }

  function createPoolState() {
    const ballRadius = 10;
    return {
      table: {
        x: 84,
        y: 76,
        w: 592,
        h: 278,
        pocketRadius: 21,
        ballRadius
      },
      turn: "player",
      phase: "aim",
      message: "Mesa aberta. Mire com calma, carregue a tacada e procure a menor bola viva.",
      physics: {
        cuePower: 296,
        rollingFriction: 0.986,
        railBounce: 0.9,
        ballBounce: 0.982,
        pocketPull: 52,
        stopSpeed: 4.2,
        substeps: 3
      },
      charge: 0,
      charging: false,
      chargeStartedAt: 0,
      aimX: 468,
      aimY: 216,
      cuePocketed: false,
      foul: false,
      foulReason: "",
      shotFirstHit: "",
      targetBallId: "1",
      playerPocketed: 0,
      botPocketed: 0,
      shotPocketed: 0,
      shotOwner: "player",
      pockets: [
        { x: 84, y: 76 },
        { x: 380, y: 72 },
        { x: 676, y: 76 },
        { x: 84, y: 354 },
        { x: 380, y: 358 },
        { x: 676, y: 354 }
      ],
      balls: createPoolRack(ballRadius)
    };
  }

  function createBall(id, x, y, color) {
    return {
      id,
      x,
      y,
      vx: 0,
      vy: 0,
      color,
      pocketed: false
    };
  }

  function createPoolRack(ballRadius) {
    const cue = createBall("cue", 198, 216, POOL_BALL_COLORS.cue);
    const rackOriginX = 536;
    const rackOriginY = 216;
    const rowSpacing = ballRadius * 1.86;
    const columnSpacing = ballRadius * 2.12;
    const rows = [1, 2, 3, 2, 1];
    const rackBalls = [];
    let index = 0;

    rows.forEach((rowCount, rowIndex) => {
      for (let slot = 0; slot < rowCount; slot += 1) {
        const id = POOL_BALL_ORDER[index];
        if (!id) continue;
        const x = rackOriginX + rowIndex * rowSpacing;
        const y = rackOriginY + (slot - (rowCount - 1) / 2) * columnSpacing;
        rackBalls.push(createBall(id, x, y, POOL_BALL_COLORS[id]));
        index += 1;
      }
    });

    return [cue, ...rackBalls];
  }

  function syncPoolRefs() {
    const canvas = refs.gameHost.querySelector("[data-pool-canvas]");
    runtime.poolRefs.canvas = canvas;
    runtime.poolRefs.ctx = canvas?.getContext("2d") || null;
    if (runtime.poolRefs.ctx) runtime.poolRefs.ctx.imageSmoothingEnabled = false;
    runtime.poolRefs.meter = refs.gameHost.querySelector("[data-pool-meter-fill]");
    runtime.poolRefs.angleSlider = refs.gameHost.querySelector("[data-pool-angle-slider]");
    runtime.poolRefs.chargeButton = refs.gameHost.querySelector("[data-pool-charge-button]");

    if (!canvas) return;
    canvas.addEventListener("pointermove", handlePoolPointerMove);
    canvas.addEventListener("pointerdown", handlePoolPointerDown);
    canvas.addEventListener("pointerup", handlePoolPointerUp);
    canvas.addEventListener("pointerleave", handlePoolPointerLeave);

    if (runtime.poolRefs.angleSlider) {
      runtime.poolRefs.angleSlider.addEventListener("input", handlePoolMobileAngleInput);
    }
    if (runtime.poolRefs.chargeButton) {
      runtime.poolRefs.chargeButton.addEventListener("pointerdown", handlePoolMobileChargeStart);
      runtime.poolRefs.chargeButton.addEventListener("pointerup", handlePoolMobileChargeEnd);
      runtime.poolRefs.chargeButton.addEventListener("pointercancel", handlePoolMobileChargeCancel);
      runtime.poolRefs.chargeButton.addEventListener("pointerleave", handlePoolMobileChargeLeave);
    }
  }

  function clearPoolRefs(removeCanvasListeners) {
    if (removeCanvasListeners !== false && runtime.poolRefs.canvas) {
      runtime.poolRefs.canvas.removeEventListener("pointermove", handlePoolPointerMove);
      runtime.poolRefs.canvas.removeEventListener("pointerdown", handlePoolPointerDown);
      runtime.poolRefs.canvas.removeEventListener("pointerup", handlePoolPointerUp);
      runtime.poolRefs.canvas.removeEventListener("pointerleave", handlePoolPointerLeave);
    }
    if (runtime.poolRefs.angleSlider) {
      runtime.poolRefs.angleSlider.removeEventListener("input", handlePoolMobileAngleInput);
    }
    if (runtime.poolRefs.chargeButton) {
      runtime.poolRefs.chargeButton.removeEventListener("pointerdown", handlePoolMobileChargeStart);
      runtime.poolRefs.chargeButton.removeEventListener("pointerup", handlePoolMobileChargeEnd);
      runtime.poolRefs.chargeButton.removeEventListener("pointercancel", handlePoolMobileChargeCancel);
      runtime.poolRefs.chargeButton.removeEventListener("pointerleave", handlePoolMobileChargeLeave);
    }

    runtime.poolRefs.canvas = null;
    runtime.poolRefs.ctx = null;
    runtime.poolRefs.meter = null;
    runtime.poolRefs.angleSlider = null;
    runtime.poolRefs.chargeButton = null;
    runtime.poolRefs.pointerInside = false;
  }

  function setPoolAimByDegrees(pool, degrees) {
    const cue = getCueBall(pool);
    if (!cue || cue.pocketed) return;
    const radians = (Number(degrees || 0) * Math.PI) / 180;
    const distance = 160;
    pool.aimX = cue.x + Math.cos(radians) * distance;
    pool.aimY = cue.y + Math.sin(radians) * distance;
  }

  function handlePoolMobileAngleInput(event) {
    const game = runtime.activeGame;
    if (!game || game.id !== "pool" || game.screen !== "playing") return;
    const pool = game.tableState;
    if (pool.turn !== "player" || pool.phase !== "aim") return;
    setPoolAimByDegrees(pool, clampInteger(event.target?.value, getPoolAimDegrees(pool)));
    updatePoolHud();
    drawPoolTable();
  }

  function handlePoolMobileChargeStart(event) {
    const game = runtime.activeGame;
    if (!game || game.id !== "pool" || game.screen !== "playing") return;
    const pool = game.tableState;
    if (pool.turn !== "player" || pool.phase !== "aim") return;
    const cue = getCueBall(pool);
    if (!cue || cue.pocketed) return;
    event.preventDefault();
    pool.charging = true;
    pool.chargeStartedAt = performance.now();
  }

  function handlePoolMobileChargeEnd(event) {
    const game = runtime.activeGame;
    if (!game || game.id !== "pool" || game.screen !== "playing") return;
    const pool = game.tableState;
    if (!pool.charging || pool.turn !== "player" || pool.phase !== "aim") return;
    event.preventDefault();
    shootPoolCue(pool, "player");
  }

  function handlePoolMobileChargeCancel() {
    const game = runtime.activeGame;
    if (!game || game.id !== "pool" || game.screen !== "playing") return;
    const pool = game.tableState;
    pool.charging = false;
    pool.charge = 0;
    updatePoolHud();
  }

  function handlePoolMobileChargeLeave(event) {
    if (window.matchMedia && !window.matchMedia("(max-width: 900px)").matches) return;
    handlePoolMobileChargeEnd(event);
  }

  function handlePoolPointerMove(event) {
    const game = runtime.activeGame;
    if (!game || game.id !== "pool" || game.screen !== "playing") return;
    const pool = game.tableState;
    if (pool.turn !== "player" || pool.phase !== "aim") return;
    const point = getCanvasPoint(event, runtime.poolRefs.canvas);
    pool.aimX = point.x;
    pool.aimY = point.y;
  }

  function handlePoolPointerDown(event) {
    const game = runtime.activeGame;
    if (!game || game.id !== "pool" || game.screen !== "playing") return;
    const pool = game.tableState;
    if (pool.turn !== "player" || pool.phase !== "aim") return;
    const cue = getCueBall(pool);
    if (!cue || cue.pocketed) return;
    const point = getCanvasPoint(event, runtime.poolRefs.canvas);
    pool.aimX = point.x;
    pool.aimY = point.y;
    pool.charging = true;
    pool.chargeStartedAt = performance.now();
  }

  function handlePoolPointerUp(event) {
    const game = runtime.activeGame;
    if (!game || game.id !== "pool" || game.screen !== "playing") return;
    const pool = game.tableState;
    if (!pool.charging || pool.turn !== "player" || pool.phase !== "aim") return;
    const point = getCanvasPoint(event, runtime.poolRefs.canvas);
    pool.aimX = point.x;
    pool.aimY = point.y;
    shootPoolCue(pool, "player");
  }

  function handlePoolPointerLeave() {
    const game = runtime.activeGame;
    if (!game || game.id !== "pool" || game.screen !== "playing") return;
    const pool = game.tableState;
    if (pool.charging && pool.turn === "player" && pool.phase === "aim") {
      shootPoolCue(pool, "player");
    }
  }

  function getCanvasPoint(event, canvas) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY
    };
  }

  function shootPoolCue(pool, shooter) {
    const cue = getCueBall(pool);
    if (!cue || cue.pocketed) return;
    const dx = pool.aimX - cue.x;
    const dy = pool.aimY - cue.y;
    const length = Math.hypot(dx, dy) || 1;
    const charge = shooter === "player"
      ? Math.max(0.18, Math.min(1, (performance.now() - pool.chargeStartedAt) / 850))
      : pool.charge;
    const aimDistance = Math.min(240, Math.hypot(dx, dy));
    const distanceBoost = 0.72 + aimDistance / 240;
    const power = pool.physics.cuePower * charge * distanceBoost;
    cue.vx = (dx / length) * power;
    cue.vy = (dy / length) * power;
    pool.shotOwner = shooter;
    pool.shotPocketed = 0;
    pool.cuePocketed = false;
    pool.foul = false;
    pool.foulReason = "";
    pool.shotFirstHit = "";
    pool.targetBallId = getLowestPoolTarget(pool)?.id || "9";
    pool.phase = "rolling";
    pool.charge = 0;
    pool.charging = false;
    pool.message =
      shooter === "player"
        ? "A mesa esta rolando. Veja o caminho das bolas."
        : `${runtime.activeGame.opponent.name} bateu na branca.`;

    renderGameModal();
  }

  function updatePoolGame(delta) {
    const game = runtime.activeGame;
    if (!game || game.id !== "pool" || game.screen !== "playing") return;
    const pool = game.tableState;

    if (pool.turn === "bot" && pool.phase === "aim") {
      pool.charge = 0.58;
      pool.aimX = 530;
      pool.aimY = 210;
      pool.phase = "bot-thinking";
      pool.message = `${game.opponent.name} esta lendo a mesa.`;
      renderGameModal();
      runtime.gameTimer = window.setTimeout(() => runBotPoolShot(pool), 900);
      return;
    }

    if (pool.turn === "player" && pool.phase === "aim" && pool.charging) {
      pool.charge = Math.max(0.18, Math.min(1, (performance.now() - pool.chargeStartedAt) / 850));
    }

    if (pool.phase !== "rolling") return;

    stepPoolPhysics(pool, delta);

    if (!poolBallsMoving(pool)) {
      resolvePoolStop(pool);
    }
  }

  function runBotPoolShot(pool) {
    const game = runtime.activeGame;
    if (!game || game.id !== "pool" || game.screen !== "playing") return;
    const cue = getCueBall(pool);
    const target = getBotPoolTarget(pool);
    if (!cue || !target) {
      finalizeGame("loss", `${game.opponent.name} matou o ritmo da mesa e ficou com a vantagem.`);
      return;
    }

    const bestPocket = getBestPoolPocket(pool, target);
    const ghostPoint = getPoolGhostAimPoint(pool, target, bestPocket) || {
      x: target.x + randomBetween(-10, 10),
      y: target.y + randomBetween(-9, 9)
    };
    pool.aimX = ghostPoint.x;
    pool.aimY = ghostPoint.y;
    const distance = cue ? Math.hypot(ghostPoint.x - cue.x, ghostPoint.y - cue.y) : 120;
    pool.charge = Math.max(0.46, Math.min(0.84, 0.42 + distance / 320));
    shootPoolCue(pool, "bot");
  }

  function getBotPoolTarget(pool) {
    return getLowestPoolTarget(pool);
  }

  function distanceToCue(pool, ball) {
    const cue = getCueBall(pool);
    return cue ? Math.hypot(ball.x - cue.x, ball.y - cue.y) : Infinity;
  }

  function stepPoolPhysics(pool, delta) {
    const { x, y, w, h, pocketRadius, ballRadius } = pool.table;
    const left = x + ballRadius;
    const right = x + w - ballRadius;
    const top = y + ballRadius;
    const bottom = y + h - ballRadius;
    const steps = Math.max(1, pool.physics.substeps || 1);
    const stepDelta = delta / steps;

    for (let step = 0; step < steps; step += 1) {
      const friction = Math.pow(pool.physics.rollingFriction, stepDelta * 60);

      pool.balls.forEach((ball) => {
        if (ball.pocketed) return;

        pool.pockets.forEach((pocket) => {
          const dxPocket = pocket.x - ball.x;
          const dyPocket = pocket.y - ball.y;
          const pocketDistance = Math.hypot(dxPocket, dyPocket) || 1;
          if (pocketDistance < pocketRadius * 2.25) {
            const pull = ((pocketRadius * 2.25 - pocketDistance) / (pocketRadius * 2.25)) * pool.physics.pocketPull;
            ball.vx += (dxPocket / pocketDistance) * pull * stepDelta;
            ball.vy += (dyPocket / pocketDistance) * pull * stepDelta;
          }
        });

        ball.x += ball.vx * stepDelta;
        ball.y += ball.vy * stepDelta;
        ball.vx *= friction;
        ball.vy *= friction;

        if (Math.abs(ball.vx) < pool.physics.stopSpeed) ball.vx = 0;
        if (Math.abs(ball.vy) < pool.physics.stopSpeed) ball.vy = 0;

        if (ball.x <= left) {
          ball.x = left;
          ball.vx *= -pool.physics.railBounce;
          ball.vy *= 0.992;
        }
        if (ball.x >= right) {
          ball.x = right;
          ball.vx *= -pool.physics.railBounce;
          ball.vy *= 0.992;
        }
        if (ball.y <= top) {
          ball.y = top;
          ball.vy *= -pool.physics.railBounce;
          ball.vx *= 0.992;
        }
        if (ball.y >= bottom) {
          ball.y = bottom;
          ball.vy *= -pool.physics.railBounce;
          ball.vx *= 0.992;
        }

        pool.pockets.forEach((pocket) => {
          if (ball.pocketed) return;
          if (Math.hypot(ball.x - pocket.x, ball.y - pocket.y) <= pocketRadius) {
            ball.pocketed = true;
            ball.vx = 0;
            ball.vy = 0;
            registerPocket(pool, ball);
          }
        });
      });

      for (let index = 0; index < pool.balls.length; index += 1) {
        const a = pool.balls[index];
        if (a.pocketed) continue;
        for (let inner = index + 1; inner < pool.balls.length; inner += 1) {
          const b = pool.balls[inner];
          if (b.pocketed) continue;
          const collided = resolveBallCollision(a, b, ballRadius * 2, pool.physics.ballBounce);
          if (!collided || pool.shotFirstHit) continue;
          if (a.id === "cue" && b.id !== "cue") {
            pool.shotFirstHit = b.id;
          } else if (b.id === "cue" && a.id !== "cue") {
            pool.shotFirstHit = a.id;
          }
        }
      }
    }
  }

  function resolveBallCollision(a, b, minDistance, restitution = 1) {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const distance = Math.hypot(dx, dy);
    if (!distance || distance >= minDistance) return false;

    const overlap = (minDistance - distance) / 2;
    const nx = dx / distance;
    const ny = dy / distance;

    a.x -= nx * overlap;
    a.y -= ny * overlap;
    b.x += nx * overlap;
    b.y += ny * overlap;

    const relativeVelocityX = b.vx - a.vx;
    const relativeVelocityY = b.vy - a.vy;
    const velocityAlongNormal = relativeVelocityX * nx + relativeVelocityY * ny;
    if (velocityAlongNormal > 0) return true;

    const impulse = (-(1 + restitution) * velocityAlongNormal) / 2;
    const impulseX = impulse * nx;
    const impulseY = impulse * ny;
    a.vx -= impulseX;
    a.vy -= impulseY;
    b.vx += impulseX;
    b.vy += impulseY;
    return true;
  }

  function registerPocket(pool, ball) {
    if (ball.id === "cue") {
      pool.cuePocketed = true;
      pool.message = "A branca caiu. A casa vai reposicionar a bola.";
      return;
    }

    if (ball.id === "9") {
      const shooterIsPlayer = pool.shotOwner === "player";
      const legalTarget = !pool.targetBallId || pool.targetBallId === "9";
      if (legalTarget && pool.shotFirstHit === "9") {
        finalizeGame(
          shooterIsPlayer ? "win" : "loss",
          shooterIsPlayer
            ? `${state.profile.name || "Voce"} matou a 9 limpa e levou a mesa.`
            : `${runtime.activeGame.opponent.name} acertou a 9 e fechou a mesa.`
        );
      } else {
        finalizeGame(
          shooterIsPlayer ? "loss" : "win",
          shooterIsPlayer
            ? "A bola 9 caiu sem tacada legal e a mesa escapou da sua mao."
            : `${runtime.activeGame.opponent.name} derrubou a 9 sem jogada valida.`
        );
      }
      return;
    }

    pool.shotPocketed += 1;
    if (pool.shotOwner === "player") {
      pool.playerPocketed += 1;
    } else {
      pool.botPocketed += 1;
    }
    pool.message =
      pool.shotOwner === "player"
        ? "Boa. A bola caiu e a mesa ainda esta viva."
        : `${runtime.activeGame.opponent.name} derrubou uma bola colorida.`;
  }

  function poolBallsMoving(pool) {
    return pool.balls.some((ball) => !ball.pocketed && (Math.abs(ball.vx) > 1 || Math.abs(ball.vy) > 1));
  }

  function countPoolColored(pool) {
    return pool.balls.filter((ball) => !ball.pocketed && ball.id !== "cue" && ball.id !== "9").length;
  }

  function getCueBall(pool) {
    return pool.balls.find((ball) => ball.id === "cue");
  }

  function resolvePoolStop(pool) {
    const cue = getCueBall(pool);
    const shooterIsPlayer = pool.shotOwner === "player";
    const targetBallId = pool.targetBallId || (getLowestPoolTarget(pool)?.id || "9");
    const missedTarget = pool.shotFirstHit && pool.shotFirstHit !== targetBallId;
    const noContact = !pool.shotFirstHit;
    const foul = Boolean(pool.cuePocketed || missedTarget || noContact);

    if (cue && cue.pocketed) {
      setCueBallPosition(pool, cue);
    }

    const keepTurn = pool.shotPocketed > 0 && !foul;
    pool.turn = foul ? (shooterIsPlayer ? "bot" : "player") : keepTurn ? pool.shotOwner : shooterIsPlayer ? "bot" : "player";
    pool.phase = "aim";
    pool.charge = 0;
    pool.charging = false;
    pool.foul = foul;
    pool.foulReason = foul
      ? pool.cuePocketed
        ? "A branca caiu e virou falta."
        : noContact
          ? "Nao houve contato valido com nenhuma bola."
          : `A primeira bola tocada foi a ${pool.shotFirstHit}, mas a mesa pedia a ${targetBallId}.`
      : "";
    pool.message = foul
      ? shooterIsPlayer
        ? `${pool.foulReason} ${runtime.activeGame.opponent.name} assume a mesa.`
        : `${pool.foulReason} Agora a mesa volta para voce.`
      : keepTurn
        ? shooterIsPlayer
          ? "Tacada limpa. Como voce matou bola, a vez continua sua."
          : `${runtime.activeGame.opponent.name} matou bola e vai de novo.`
        : shooterIsPlayer
          ? `${runtime.activeGame.opponent.name} assumiu a tacada.`
          : "A casa errou o ritmo. Agora a mesa volta para voce.";

    renderGameModal();
  }

  function drawPoolTable() {
    const game = runtime.activeGame;
    const ctx = runtime.poolRefs.ctx;
    if (!game || game.id !== "pool" || game.screen !== "playing" || !ctx) return;
    const pool = game.tableState;
    const canvas = runtime.poolRefs.canvas;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#4c2d15";
    ctx.fillRect(20, 18, 720, 392);
    ctx.fillStyle = "#174425";
    ctx.fillRect(pool.table.x, pool.table.y, pool.table.w, pool.table.h);
    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.lineWidth = 1;
    ctx.strokeRect(pool.table.x + 26, pool.table.y + 26, pool.table.w - 52, pool.table.h - 52);
    ctx.strokeStyle = "#0d2615";
    ctx.lineWidth = 6;
    ctx.strokeRect(pool.table.x, pool.table.y, pool.table.w, pool.table.h);

    pool.pockets.forEach((pocket) => {
      ctx.fillStyle = "#050505";
      ctx.beginPath();
      ctx.arc(pocket.x, pocket.y, pool.table.pocketRadius, 0, Math.PI * 2);
      ctx.fill();
    });

    if (pool.turn === "player" && pool.phase === "aim") {
      const cue = getCueBall(pool);
      if (cue && !cue.pocketed) {
        const dx = pool.aimX - cue.x;
        const dy = pool.aimY - cue.y;
        const length = Math.hypot(dx, dy) || 1;
        const guideEndX = cue.x + (dx / length) * Math.min(160, length);
        const guideEndY = cue.y + (dy / length) * Math.min(160, length);
        ctx.save();
        ctx.strokeStyle = "rgba(255,255,255,0.46)";
        ctx.setLineDash([10, 8]);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cue.x, cue.y);
        ctx.lineTo(guideEndX, guideEndY);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.strokeStyle = "rgba(255, 207, 107, 0.42)";
        ctx.beginPath();
        ctx.moveTo(cue.x - (dx / length) * (26 + 34 * pool.charge), cue.y - (dy / length) * (26 + 34 * pool.charge));
        ctx.lineTo(cue.x - (dx / length) * 12, cue.y - (dy / length) * 12);
        ctx.stroke();
        ctx.restore();
      }
    }

    pool.balls.forEach((ball) => {
      if (ball.pocketed) return;
      ctx.fillStyle = "rgba(0,0,0,0.28)";
      ctx.beginPath();
      ctx.arc(ball.x + 2, ball.y + 2, pool.table.ballRadius + 1, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = ball.color;
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, pool.table.ballRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = ball.id === "8" ? "#f5f5f5" : "rgba(255,255,255,0.92)";
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, 4.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = ball.id === "8" ? "#111111" : "#1c1830";
      ctx.font = "9px Chakra Petch";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(ball.id === "cue" ? "" : ball.id, ball.x, ball.y + 0.5);
    });
  }

  function updatePoolHud() {
    const game = runtime.activeGame;
    if (!game || game.id !== "pool" || game.screen !== "playing") return;
    const pool = game.tableState;
    const status = refs.gameHost.querySelector("[data-pool-status]");
    const turn = refs.gameHost.querySelector("[data-pool-turn]");
    const remaining = refs.gameHost.querySelector("[data-pool-remaining]");
    const score = refs.gameHost.querySelector("[data-pool-score]");
    const target = refs.gameHost.querySelector("[data-pool-target]");
    const power = refs.gameHost.querySelector("[data-pool-power]");
    const angle = refs.gameHost.querySelector("[data-pool-angle]");
    const playerPocketed = refs.gameHost.querySelector("[data-pool-player-pocketed]");
    const botPocketed = refs.gameHost.querySelector("[data-pool-bot-pocketed]");

    if (status) status.textContent = pool.message;
    if (turn) turn.textContent = pool.turn === "player" ? "sua vez" : `${game.opponent.name} na tacada`;
    if (remaining) remaining.textContent = String(countPoolColored(pool));
    if (score) score.textContent = `${pool.playerPocketed} x ${pool.botPocketed}`;
    if (target) {
      const nextTarget = getLowestPoolTarget(pool);
      target.textContent = nextTarget ? `bola ${nextTarget.id}` : "bola 9";
    }
    if (power) power.textContent = String(Math.round(pool.charge * 100));
    if (angle) angle.textContent = String(getPoolAimDegrees(pool));
    if (playerPocketed) playerPocketed.textContent = `${pool.playerPocketed} bolas derrubadas`;
    if (botPocketed) botPocketed.textContent = `${pool.botPocketed} bolas derrubadas`;
    if (runtime.poolRefs.meter) {
      runtime.poolRefs.meter.style.width = `${Math.round(pool.charge * 100)}%`;
    }
    if (runtime.poolRefs.angleSlider && document.activeElement !== runtime.poolRefs.angleSlider) {
      runtime.poolRefs.angleSlider.value = String(getPoolAimDegrees(pool));
    }
    if (runtime.poolRefs.chargeButton) {
      runtime.poolRefs.chargeButton.textContent = pool.charging
        ? `Solte para bater (${Math.round(pool.charge * 100)}%)`
        : "Segure para carregar, solte para bater";
      runtime.poolRefs.chargeButton.disabled = !(pool.turn === "player" && pool.phase === "aim");
    }
  }

  function getLowestPoolTarget(pool) {
    return pool.balls
      .filter((ball) => !ball.pocketed && ball.id !== "cue")
      .sort((a, b) => Number(a.id) - Number(b.id))[0] || null;
  }

  function getPoolAimDegrees(pool) {
    const cue = getCueBall(pool);
    if (!cue) return 0;
    const angle = Math.atan2(pool.aimY - cue.y, pool.aimX - cue.x) * (180 / Math.PI);
    return Math.round((angle + 360) % 360);
  }

  function getBestPoolPocket(pool, targetBall) {
    if (!targetBall) return null;
    const cue = getCueBall(pool);
    if (!cue) return null;
    const ballDiameter = pool.table.ballRadius * 2;
    let bestPocket = null;
    let bestScore = Infinity;

    pool.pockets.forEach((pocket) => {
      const ghostPoint = getPoolGhostAimPoint(pool, targetBall, pocket);
      if (!ghostPoint || !isPointInsidePoolTable(pool, ghostPoint.x, ghostPoint.y, pool.table.ballRadius)) return;
      const cueDistance = Math.hypot(cue.x - ghostPoint.x, cue.y - ghostPoint.y);
      const pocketDistance = Math.hypot(targetBall.x - pocket.x, targetBall.y - pocket.y);
      const linePenalty = Math.abs(
        Math.atan2(pocket.y - targetBall.y, pocket.x - targetBall.x) -
        Math.atan2(targetBall.y - cue.y, targetBall.x - cue.x)
      );
      const score = cueDistance + pocketDistance * 0.42 + linePenalty * 28 + ballDiameter;
      if (score < bestScore) {
        bestScore = score;
        bestPocket = pocket;
      }
    });

    return bestPocket;
  }

  function getPoolGhostAimPoint(pool, targetBall, pocket) {
    if (!targetBall || !pocket) return null;
    const dx = pocket.x - targetBall.x;
    const dy = pocket.y - targetBall.y;
    const distance = Math.hypot(dx, dy) || 1;
    const contactDistance = pool.table.ballRadius * 2.02;
    return {
      x: targetBall.x - (dx / distance) * contactDistance,
      y: targetBall.y - (dy / distance) * contactDistance
    };
  }

  function isPointInsidePoolTable(pool, x, y, padding = 0) {
    const { table } = pool;
    return (
      x >= table.x + padding &&
      x <= table.x + table.w - padding &&
      y >= table.y + padding &&
      y <= table.y + table.h - padding
    );
  }

  function setCueBallPosition(pool, cue) {
    const spot = findPoolRespotPosition(pool);
    cue.pocketed = false;
    cue.x = spot.x;
    cue.y = spot.y;
    cue.vx = 0;
    cue.vy = 0;
  }

  function findPoolRespotPosition(pool) {
    const baseX = pool.table.x + pool.table.w * 0.19;
    const baseY = pool.table.y + pool.table.h / 2;
    const step = pool.table.ballRadius * 2.4;
    const offsets = [0, -1, 1, -2, 2, -3, 3];

    for (const offset of offsets) {
      const candidate = { x: baseX, y: baseY + offset * step };
      if (isPoolSpotClear(pool, candidate.x, candidate.y, "cue")) return candidate;
    }

    return { x: baseX, y: baseY };
  }

  function isPoolSpotClear(pool, x, y, ignoreId = "") {
    const minimumDistance = pool.table.ballRadius * 2.25;
    if (!isPointInsidePoolTable(pool, x, y, pool.table.ballRadius)) return false;
    return pool.balls.every((ball) => {
      if (ball.pocketed || ball.id === ignoreId) return true;
      return Math.hypot(ball.x - x, ball.y - y) >= minimumDistance;
    });
  }

  function createCheckersState() {
    const board = Array.from({ length: 8 }, () => Array(8).fill(""));
    for (let row = 0; row < 3; row += 1) {
      for (let col = 0; col < 8; col += 1) {
        if ((row + col) % 2 === 1) board[row][col] = "o";
      }
    }
    for (let row = 5; row < 8; row += 1) {
      for (let col = 0; col < 8; col += 1) {
        if ((row + col) % 2 === 1) board[row][col] = "p";
      }
    }
    return {
      board,
      turn: "player",
      selected: null,
      validMoves: [],
      message: "Sua vez. Clique numa peca azul e depois no destino.",
      turnCount: 0
    };
  }

  function createChessState() {
    return {
      board: [
        ["r", "n", "b", "q", "k", "b", "n", "r"],
        ["p", "p", "p", "p", "p", "p", "p", "p"],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["P", "P", "P", "P", "P", "P", "P", "P"],
        ["R", "N", "B", "Q", "K", "B", "N", "R"]
      ],
      turn: "player",
      selected: null,
      validMoves: [],
      message: "Sua vez. Clique numa peca azul e depois no destino.",
      turnCount: 0
    };
  }

  function renderCheckersGame(game) {
    const stateCheckers = game.tableState;
    const validTargets = new Set(
      stateCheckers.validMoves.map((move) => `${move.to.row}-${move.to.col}`)
    );
    const selected = stateCheckers.selected
      ? `${stateCheckers.selected.row}-${stateCheckers.selected.col}`
      : "";
    const boardMarkup = stateCheckers.board
      .map((row, rowIndex) =>
        row
          .map((cell, colIndex) => {
            const dark = (rowIndex + colIndex) % 2 === 1;
            const key = `${rowIndex}-${colIndex}`;
            const isSelected = key === selected;
            const isValid = validTargets.has(key);
            const owner = getCheckersOwner(cell);
            const clickable = dark && (owner === "player" || isValid);
            return `
              <button
                type="button"
                class="pubpaid-checkers-cell${dark ? " is-dark" : ""}${isSelected ? " is-selected" : ""}${isValid ? " is-valid" : ""}"
                data-checkers-cell="1"
                data-row="${rowIndex}"
                data-col="${colIndex}"
                ${clickable ? "" : "disabled"}
              >
                ${cell ? `<span class="pubpaid-piece ${owner}${cell === cell.toUpperCase() ? " king" : ""}"></span>` : ""}
              </button>
            `;
          })
          .join("")
      )
      .join("");

    return `
      <div class="pubpaid-checkers-wrap">
        <div class="pubpaid-game-chip-row">
          <span class="pubpaid-turn-chip">${escapeHtml(stateCheckers.turn === "player" ? "sua vez" : `${game.opponent.name} pensa`)}</span>
          <span class="pubpaid-turn-chip">pote ${escapeHtml(formatCoins(game.payout))}</span>
          ${game.multiplayer?.enabled ? `<span class="pubpaid-turn-chip">pvp ao vivo</span>` : ""}
        </div>
        <section class="pubpaid-checkers-stage pubpaid-minigame-frame">
          <div class="pubpaid-minigame-head">
            <strong>Damas Pixel</strong>
            <span>Capture em diagonal e feche a ultima linha.</span>
          </div>
          <div class="pubpaid-checkers-board-wrap">
            <div class="pubpaid-checkers-axis pubpaid-checkers-axis-top">
              ${["A", "B", "C", "D", "E", "F", "G", "H"].map((label) => `<span>${label}</span>`).join("")}
            </div>
            <div class="pubpaid-checkers-stage-row">
              <div class="pubpaid-checkers-axis pubpaid-checkers-axis-side">
                ${Array.from({ length: 8 }, (_, index) => `<span>${8 - index}</span>`).join("")}
              </div>
              <div class="pubpaid-checkers-board">${boardMarkup}</div>
            </div>
          </div>
        </section>
        <section class="pubpaid-pool-side">
          <article>
            <span>status</span>
            <strong>${escapeHtml(stateCheckers.message)}</strong>
            <p>Azul move primeiro. Captura continua quando a mesma peca mantem o salto.</p>
          </article>
          <article>
            <span>pecas vivas</span>
            <strong>${escapeHtml(String(countCheckersPieces(stateCheckers.board, "player")))} x ${escapeHtml(String(countCheckersPieces(stateCheckers.board, "opponent")))}</strong>
            <p>${escapeHtml(game.multiplayer?.enabled ? `Seu lado contra ${game.opponent.name}.` : "Seu lado contra o rival da casa.")}</p>
          </article>
        </section>
        <div class="pubpaid-card-actions">
          <button class="pubpaid-card-button" type="button" data-abandon-game>Sair da mesa</button>
        </div>
      </div>
    `;
  }

  function getCheckersOwner(piece) {
    if (!piece) return "";
    return piece.toLowerCase() === "p" ? "player" : "opponent";
  }

  function getChessOwner(piece) {
    if (!piece) return "";
    return piece === piece.toUpperCase() ? "player" : "opponent";
  }

  function cloneChessBoard(board) {
    return board.map((row) => row.slice());
  }

  function inChessBounds(row, col) {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
  }

  function getChessGlyph(piece) {
    const map = { p: "P", r: "T", n: "C", b: "B", q: "Q", k: "K" };
    return map[String(piece || "").toLowerCase()] || "?";
  }

  function getCheckersDirections(piece) {
    if (!piece) return [];
    if (piece === piece.toUpperCase()) return [[-1, -1], [-1, 1], [1, -1], [1, 1]];
    return piece.toLowerCase() === "p" ? [[-1, -1], [-1, 1]] : [[1, -1], [1, 1]];
  }

  function inCheckersBounds(row, col) {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
  }

  function crownCheckersPiece(piece, row) {
    if (piece === "p" && row === 0) return "P";
    if (piece === "o" && row === 7) return "O";
    return piece;
  }

  function cloneCheckersBoard(board) {
    return board.map((row) => row.slice());
  }

  function getMovesForCheckersPiece(board, row, col) {
    const piece = board[row][col];
    if (!piece) return [];
    const owner = getCheckersOwner(piece);
    const enemy = owner === "player" ? "opponent" : "player";
    const moves = [];

    getCheckersDirections(piece).forEach(([rowStep, colStep]) => {
      const nextRow = row + rowStep;
      const nextCol = col + colStep;
      if (!inCheckersBounds(nextRow, nextCol)) return;

      if (!board[nextRow][nextCol]) {
        moves.push({
          from: { row, col },
          to: { row: nextRow, col: nextCol },
          capture: null
        });
        return;
      }

      if (getCheckersOwner(board[nextRow][nextCol]) !== enemy) return;
      const jumpRow = nextRow + rowStep;
      const jumpCol = nextCol + colStep;
      if (!inCheckersBounds(jumpRow, jumpCol) || board[jumpRow][jumpCol]) return;
      moves.push({
        from: { row, col },
        to: { row: jumpRow, col: jumpCol },
        capture: { row: nextRow, col: nextCol }
      });
    });

    return moves;
  }

  function getAllCheckersMoves(board, owner) {
    const moves = [];
    for (let row = 0; row < 8; row += 1) {
      for (let col = 0; col < 8; col += 1) {
        if (getCheckersOwner(board[row][col]) !== owner) continue;
        moves.push(...getMovesForCheckersPiece(board, row, col));
      }
    }
    const captures = moves.filter((move) => move.capture);
    return captures.length ? captures : moves;
  }

  function applyCheckersMove(board, move) {
    const next = cloneCheckersBoard(board);
    const piece = next[move.from.row][move.from.col];
    next[move.from.row][move.from.col] = "";
    if (move.capture) next[move.capture.row][move.capture.col] = "";
    next[move.to.row][move.to.col] = crownCheckersPiece(piece, move.to.row);
    return next;
  }

  function countCheckersPieces(board, owner) {
    let count = 0;
    for (let row = 0; row < 8; row += 1) {
      for (let col = 0; col < 8; col += 1) {
        if (getCheckersOwner(board[row][col]) === owner) count += 1;
      }
    }
    return count;
  }

  function checkCheckersOutcome(board) {
    const playerPieces = countCheckersPieces(board, "player");
    const botPieces = countCheckersPieces(board, "opponent");
    if (!playerPieces) return "loss";
    if (!botPieces) return "win";
    if (!getAllCheckersMoves(board, "player").length) return "loss";
    if (!getAllCheckersMoves(board, "opponent").length) return "win";
    return "";
  }

  function getChessMovesForPiece(board, row, col) {
    const piece = board[row][col];
    if (!piece) return [];
    const owner = getChessOwner(piece);
    const enemy = owner === "player" ? "opponent" : "player";
    const lower = piece.toLowerCase();
    const moves = [];
    const pushStep = (r, c) => {
      if (!inChessBounds(r, c)) return false;
      const target = board[r][c];
      if (!target) {
        moves.push({ from: { row, col }, to: { row: r, col: c }, capture: null });
        return true;
      }
      if (getChessOwner(target) === enemy) {
        moves.push({ from: { row, col }, to: { row: r, col: c }, capture: { row: r, col: c } });
      }
      return false;
    };
    const pushRay = (dirs) => {
      dirs.forEach(([dr, dc]) => {
        let r = row + dr;
        let c = col + dc;
        while (inChessBounds(r, c)) {
          if (!pushStep(r, c)) break;
          r += dr;
          c += dc;
        }
      });
    };

    if (lower === "p") {
      const dir = owner === "player" ? -1 : 1;
      const startRow = owner === "player" ? 6 : 1;
      if (inChessBounds(row + dir, col) && !board[row + dir][col]) {
        moves.push({ from: { row, col }, to: { row: row + dir, col }, capture: null });
        if (row === startRow && !board[row + dir * 2][col]) {
          moves.push({ from: { row, col }, to: { row: row + dir * 2, col }, capture: null });
        }
      }
      [-1, 1].forEach((offset) => {
        const r = row + dir;
        const c = col + offset;
        if (!inChessBounds(r, c)) return;
        const target = board[r][c];
        if (target && getChessOwner(target) === enemy) {
          moves.push({ from: { row, col }, to: { row: r, col: c }, capture: { row: r, col: c } });
        }
      });
      return moves;
    }

    if (lower === "n") {
      [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]].forEach(([dr, dc]) => {
        pushStep(row + dr, col + dc);
      });
      return moves;
    }

    if (lower === "b") {
      pushRay([[-1, -1], [-1, 1], [1, -1], [1, 1]]);
      return moves;
    }

    if (lower === "r") {
      pushRay([[-1, 0], [1, 0], [0, -1], [0, 1]]);
      return moves;
    }

    if (lower === "q") {
      pushRay([[-1, -1], [-1, 1], [1, -1], [1, 1], [-1, 0], [1, 0], [0, -1], [0, 1]]);
      return moves;
    }

    if (lower === "k") {
      [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]].forEach(([dr, dc]) => {
        pushStep(row + dr, col + dc);
      });
    }

    return moves;
  }

  function getAllChessMoves(board, owner) {
    const moves = [];
    for (let row = 0; row < 8; row += 1) {
      for (let col = 0; col < 8; col += 1) {
        if (getChessOwner(board[row][col]) !== owner) continue;
        moves.push(...getChessMovesForPiece(board, row, col));
      }
    }
    return moves;
  }

  function applyChessMove(board, move) {
    const next = cloneChessBoard(board);
    let piece = next[move.from.row][move.from.col];
    next[move.from.row][move.from.col] = "";
    if (move.capture) next[move.capture.row][move.capture.col] = "";
    if (piece === "P" && move.to.row === 0) piece = "Q";
    if (piece === "p" && move.to.row === 7) piece = "q";
    next[move.to.row][move.to.col] = piece;
    return next;
  }

  function countChessPieces(board, owner) {
    let count = 0;
    for (let row = 0; row < 8; row += 1) {
      for (let col = 0; col < 8; col += 1) {
        if (getChessOwner(board[row][col]) === owner) count += 1;
      }
    }
    return count;
  }

  function getChessKingAlive(board, owner) {
    const king = owner === "player" ? "K" : "k";
    return board.some((row) => row.includes(king));
  }

  function checkChessOutcome(board) {
    if (!getChessKingAlive(board, "player")) return "loss";
    if (!getChessKingAlive(board, "opponent")) return "win";
    if (!getAllChessMoves(board, "player").length) return "loss";
    if (!getAllChessMoves(board, "opponent").length) return "win";
    return "";
  }

  function handleCheckersClick(row, col) {
    const game = runtime.activeGame;
    if (!game || game.id !== "checkers" || game.screen !== "playing") return;
    const checkers = game.tableState;
    if (checkers.turn !== "player") return;

    const cell = checkers.board[row][col];
    const owner = getCheckersOwner(cell);
    const allMoves = getAllCheckersMoves(checkers.board, "player");

    if (owner === "player") {
      const moves = allMoves.filter((move) => move.from.row === row && move.from.col === col);
      checkers.selected = { row, col };
      checkers.validMoves = moves;
      checkers.message = moves.length
        ? "Destino marcado. Feche a jogada."
        : "Essa peca nao tem rota agora.";
      renderGameModal();
      return;
    }

    const chosenMove = checkers.validMoves.find((move) => move.to.row === row && move.to.col === col);
    if (!chosenMove) return;

    if (game.multiplayer?.enabled) {
      checkers.message = "Enviando sua jogada para a mesa PvP...";
      checkers.selected = null;
      checkers.validMoves = [];
      renderGameModal();
      void submitCheckersPvpMove(chosenMove).catch((error) => {
        checkers.message = String(error?.message || "Nao consegui enviar a jogada.");
        renderGameModal();
      });
      return;
    }

    checkers.board = applyCheckersMove(checkers.board, chosenMove);
    checkers.turnCount += 1;
    const outcome = checkCheckersOutcome(checkers.board);
    if (outcome === "win") {
      finalizeGame("win", `${state.profile.name || "Voce"} fechou a diagonal e levou a mesa de damas.`);
      return;
    }
    if (outcome === "loss") {
      finalizeGame("loss", `${game.opponent.name} travou o tabuleiro e ficou com a mesa.`);
      return;
    }

    if (chosenMove.capture) {
      const followCaptures = getMovesForCheckersPiece(checkers.board, chosenMove.to.row, chosenMove.to.col).filter(
        (move) => move.capture
      );
      if (followCaptures.length) {
        checkers.selected = { row: chosenMove.to.row, col: chosenMove.to.col };
        checkers.validMoves = followCaptures;
        checkers.message = "A captura continua com a mesma peca.";
        renderGameModal();
        return;
      }
    }

    checkers.turn = "opponent";
    checkers.selected = null;
    checkers.validMoves = [];
    checkers.message = `${game.opponent.name} esta lendo o tabuleiro.`;
    renderGameModal();
    runtime.gameTimer = window.setTimeout(runCheckersBotTurn, 620);
  }

  function runCheckersBotTurn() {
    const game = runtime.activeGame;
    if (!game || game.id !== "checkers" || game.screen !== "playing") return;
    const checkers = game.tableState;
    const moves = getAllCheckersMoves(checkers.board, "opponent");

    if (!moves.length) {
      finalizeGame("win", `${state.profile.name || "Voce"} cercou a casa e fechou a mesa.`);
      return;
    }

    const move = moves[Math.floor(Math.random() * moves.length)];
    checkers.board = applyCheckersMove(checkers.board, move);
    checkers.turnCount += 1;

    let follow = move;
    while (follow.capture) {
      const nextCaptures = getMovesForCheckersPiece(checkers.board, follow.to.row, follow.to.col).filter(
        (item) => item.capture
      );
      if (!nextCaptures.length) break;
      follow = nextCaptures[Math.floor(Math.random() * nextCaptures.length)];
      checkers.board = applyCheckersMove(checkers.board, follow);
      checkers.turnCount += 1;
    }

    const outcome = checkCheckersOutcome(checkers.board);
    if (outcome === "win") {
      finalizeGame("win", `${state.profile.name || "Voce"} segurou o tabuleiro melhor e venceu.`);
      return;
    }
    if (outcome === "loss") {
      finalizeGame("loss", `${game.opponent.name} dominou a ultima diagonal e venceu.`);
      return;
    }

    if (checkers.turnCount >= 60) {
      const playerPieces = countCheckersPieces(checkers.board, "player");
      const botPieces = countCheckersPieces(checkers.board, "opponent");
      if (playerPieces > botPieces) {
        finalizeGame("win", `${state.profile.name || "Voce"} terminou com mais pecas vivas e levou a mesa.`);
      } else if (botPieces > playerPieces) {
        finalizeGame("loss", `${game.opponent.name} sobrou com mais pecas e segurou o fim da mesa.`);
      } else {
        finalizeGame("tie", "A mesa de damas travou em equilibrio e a entrada voltou.");
      }
      return;
    }

    checkers.turn = "player";
    checkers.selected = null;
    checkers.validMoves = [];
    checkers.message = "Sua vez de novo. Clique numa peca azul.";
    renderGameModal();
  }

  function handleChessClick(row, col) {
    const game = runtime.activeGame;
    if (!game || game.id !== "chess" || game.screen !== "playing") return;
    const chess = game.tableState;
    if (chess.turn !== "player") return;

    const cell = chess.board[row][col];
    const owner = getChessOwner(cell);

    if (owner === "player") {
      const moves = getChessMovesForPiece(chess.board, row, col);
      chess.selected = { row, col };
      chess.validMoves = moves;
      chess.message = moves.length ? "Destino marcado. Feche a jogada." : "Essa peca nao tem rota agora.";
      renderGameModal();
      return;
    }

    const chosenMove = chess.validMoves.find((move) => move.to.row === row && move.to.col === col);
    if (!chosenMove) return;

    chess.board = applyChessMove(chess.board, chosenMove);
    chess.turnCount += 1;
    const outcome = checkChessOutcome(chess.board);
    if (outcome === "win") {
      finalizeGame("win", `${state.profile.name || "Voce"} derrubou o rei rival e venceu a mesa de xadrez.`);
      return;
    }
    if (outcome === "loss") {
      finalizeGame("loss", `${game.opponent.name} tomou seu rei e fechou a mesa.`);
      return;
    }

    chess.turn = "opponent";
    chess.selected = null;
    chess.validMoves = [];
    chess.message = `${game.opponent.name} esta lendo a posicao.`;
    renderGameModal();
    runtime.gameTimer = window.setTimeout(runChessBotTurn, 680);
  }

  function runChessBotTurn() {
    const game = runtime.activeGame;
    if (!game || game.id !== "chess" || game.screen !== "playing") return;
    const chess = game.tableState;
    const moves = getAllChessMoves(chess.board, "opponent");
    if (!moves.length) {
      finalizeGame("win", `${state.profile.name || "Voce"} cercou o rival e venceu a mesa.`);
      return;
    }

    const captures = moves.filter((move) => move.capture);
    const pool = captures.length ? captures : moves;
    const move = pool[Math.floor(Math.random() * pool.length)];
    chess.board = applyChessMove(chess.board, move);
    chess.turnCount += 1;

    const outcome = checkChessOutcome(chess.board);
    if (outcome === "win") {
      finalizeGame("win", `${state.profile.name || "Voce"} segurou melhor o rei e levou a mesa.`);
      return;
    }
    if (outcome === "loss") {
      finalizeGame("loss", `${game.opponent.name} dominou a mesa e venceu no xadrez.`);
      return;
    }

    if (chess.turnCount >= 80) {
      const playerPieces = countChessPieces(chess.board, "player");
      const opponentPieces = countChessPieces(chess.board, "opponent");
      if (playerPieces > opponentPieces) {
        finalizeGame("win", `${state.profile.name || "Voce"} terminou com mais material e venceu a mesa.`);
      } else if (opponentPieces > playerPieces) {
        finalizeGame("loss", `${game.opponent.name} terminou com mais material e segurou o fim.`);
      } else {
        finalizeGame("tie", "A mesa de xadrez travou em equilibrio e a entrada voltou.");
      }
      return;
    }

    chess.turn = "player";
    chess.selected = null;
    chess.validMoves = [];
    chess.message = "Sua vez de novo. Escolha uma peca azul.";
    renderGameModal();
  }

  function createCardsState() {
    const stateCards = {
      phase: "player",
      playerCards: [],
      botCards: [],
      drawCount: 0,
      message: "Compre ou pare. O alvo continua sendo 21 sem estourar."
    };
    stateCards.playerCards.push(drawCardsValue(stateCards));
    stateCards.playerCards.push(drawCardsValue(stateCards));
    stateCards.botCards.push(drawCardsValue(stateCards));
    stateCards.botCards.push(drawCardsValue(stateCards));
    return stateCards;
  }

  function createPokerState() {
    const deck = createPokerDeck();
    return {
      phase: "draw",
      deck,
      playerCards: drawPokerCards(deck, 5),
      botCards: drawPokerCards(deck, 5),
      held: [false, false, false, false, false],
      drawUsed: false,
      message: "Clique nas cartas que quer segurar e depois troque o resto."
    };
  }

  function createPokerDeck() {
    const suits = ["hearts", "diamonds", "clubs", "spades"];
    const ranks = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
    const deck = [];
    suits.forEach((suit) => {
      ranks.forEach((rank) => deck.push({ suit, rank }));
    });
    for (let index = deck.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      const temp = deck[index];
      deck[index] = deck[swapIndex];
      deck[swapIndex] = temp;
    }
    return deck;
  }

  function drawPokerCards(deck, count) {
    const cards = [];
    for (let index = 0; index < count; index += 1) {
      const card = deck.pop();
      if (card) cards.push(card);
    }
    return cards;
  }

  function drawCardsValue(cardsState) {
    const deck = [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 11];
    const value = deck[Math.floor(Math.random() * deck.length)];
    cardsState.drawCount += 1;
    return value;
  }

  function sumCards(cards) {
    let total = cards.reduce((sum, card) => sum + card, 0);
    let aces = cards.filter((card) => card === 11).length;
    while (total > 21 && aces > 0) {
      total -= 10;
      aces -= 1;
    }
    return total;
  }

  function renderCardsGame(game) {
    const cards = game.tableState;
    const isPvp = Boolean(game.multiplayer?.enabled);
    const hideSecond = !isPvp && cards.phase === "player";
    const botTotal = sumCards(cards.botCards);
    const playerTotal = sumCards(cards.playerCards);
    const rivalLabel = isPvp ? game.opponent.name : "Mao da casa";
    const turnLabel = isPvp
      ? cards.phase === "player"
        ? "sua vez"
        : cards.phase === "opponent"
          ? `${game.opponent.name} decide`
          : "mao fechada"
      : cards.phase === "player"
        ? "sua vez"
        : "banca responde";
    const tableStatus = isPvp
      ? `${botTotal} • ${formatCards21StateLabel(cards.botState)}`
      : hideSecond
        ? `${cards.botCards[0]} + ?`
        : String(botTotal);

    return `
      <div class="pubpaid-cards-layout">
        <div class="pubpaid-game-chip-row">
          <span class="pubpaid-turn-chip">${escapeHtml(turnLabel)}</span>
          <span class="pubpaid-turn-chip">pote ${escapeHtml(formatCoins(game.payout))}</span>
          ${isPvp ? '<span class="pubpaid-turn-chip">pvp ao vivo</span>' : ""}
        </div>
        <section class="pubpaid-cards-table pubpaid-minigame-frame">
          <div class="pubpaid-minigame-head">
            <strong>21 do Bar</strong>
            <span>Chegue o mais perto possivel de 21 sem estourar.</span>
          </div>
          <article class="pubpaid-card-hand">
            <strong>${escapeHtml(rivalLabel)}</strong>
            <div class="pubpaid-card-row">
              ${cards.botCards
                .map(
                  (card, index) =>
                    renderCardChip(card, hideSecond && index > 0)
                )
                .join("")}
            </div>
          </article>

          <article class="pubpaid-card-hand">
            <strong>Sua mao</strong>
            <div class="pubpaid-card-row">
              ${cards.playerCards.map((card) => renderCardChip(card, false)).join("")}
            </div>
          </article>
        </section>

        <section class="pubpaid-cards-info">
          <article>
            <span>status</span>
            <strong>${escapeHtml(cards.message)}</strong>
          </article>
          <article>
            <span>placar da mesa</span>
            <strong>${escapeHtml(String(playerTotal))} x ${escapeHtml(tableStatus)}</strong>
          </article>
          <article>
            <span>pote</span>
            <strong>${escapeHtml(formatCoins(game.payout))}</strong>
          </article>
          <div class="pubpaid-card-actions">
            <button class="pubpaid-card-button" type="button" data-cards-action="hit" ${cards.phase !== "player" ? "disabled" : ""}>Comprar</button>
            <button class="pubpaid-card-button" type="button" data-cards-action="stand" ${cards.phase !== "player" ? "disabled" : ""}>Parar</button>
            <button class="pubpaid-card-button" type="button" data-abandon-game>Sair da mesa</button>
          </div>
        </section>
      </div>
    `;
  }

  function renderChessGame(game) {
    const stateChess = game.tableState;
    const validTargets = new Set(stateChess.validMoves.map((move) => `${move.to.row}-${move.to.col}`));
    const selected = stateChess.selected ? `${stateChess.selected.row}-${stateChess.selected.col}` : "";
    const boardMarkup = stateChess.board
      .map((row, rowIndex) =>
        row
          .map((cell, colIndex) => {
            const dark = (rowIndex + colIndex) % 2 === 1;
            const key = `${rowIndex}-${colIndex}`;
            const isSelected = key === selected;
            const isValid = validTargets.has(key);
            const owner = getChessOwner(cell);
            const clickable = owner === "player" || isValid;
            return `
              <button
                type="button"
                class="pubpaid-checkers-cell${dark ? " is-dark" : ""}${isSelected ? " is-selected" : ""}${isValid ? " is-valid" : ""}"
                data-chess-cell="1"
                data-row="${rowIndex}"
                data-col="${colIndex}"
                ${clickable ? "" : "disabled"}
              >
                ${cell ? `<span class="pubpaid-piece chess ${owner}">${escapeHtml(getChessGlyph(cell))}</span>` : ""}
              </button>
            `;
          })
          .join("")
      )
      .join("");

    return `
      <div class="pubpaid-checkers-wrap">
        <div class="pubpaid-game-chip-row">
          <span class="pubpaid-turn-chip">${escapeHtml(stateChess.turn === "player" ? "sua vez" : `${game.opponent.name} pensa`)}</span>
          <span class="pubpaid-turn-chip">pote ${escapeHtml(formatCoins(game.payout))}</span>
          <span class="pubpaid-turn-chip">xadrez</span>
        </div>
        <section class="pubpaid-checkers-stage pubpaid-minigame-frame">
          <div class="pubpaid-minigame-head">
            <strong>Xadrez de Mesa</strong>
            <span>Peças completas, centro disputado e pressão direta no rei.</span>
          </div>
          <div class="pubpaid-checkers-board-wrap">
            <div class="pubpaid-checkers-axis pubpaid-checkers-axis-top">
              ${["A", "B", "C", "D", "E", "F", "G", "H"].map((label) => `<span>${label}</span>`).join("")}
            </div>
            <div class="pubpaid-checkers-stage-row">
              <div class="pubpaid-checkers-axis pubpaid-checkers-axis-side">
                ${Array.from({ length: 8 }, (_, index) => `<span>${8 - index}</span>`).join("")}
              </div>
              <div class="pubpaid-checkers-board">${boardMarkup}</div>
            </div>
          </div>
        </section>
        <section class="pubpaid-pool-side">
          <article>
            <span>status</span>
            <strong>${escapeHtml(stateChess.message)}</strong>
            <p>Sem roque, en passant ou xeque formal nesta primeira versão. Capturar o rei fecha a mesa.</p>
          </article>
          <article>
            <span>pecas vivas</span>
            <strong>${escapeHtml(String(countChessPieces(stateChess.board, "player")))} x ${escapeHtml(String(countChessPieces(stateChess.board, "opponent")))}</strong>
            <p>${escapeHtml(`Seu lado contra ${game.opponent.name}.`)}</p>
          </article>
        </section>
        <div class="pubpaid-card-actions">
          <button class="pubpaid-card-button" type="button" data-abandon-game>Sair da mesa</button>
        </div>
      </div>
    `;
  }

  function formatCards21StateLabel(value) {
    if (value === "stood") return "parou";
    if (value === "busted") return "estourou";
    if (value === "finished") return "fechou";
    return "jogando";
  }

  function renderPokerGame(game) {
    const poker = game.tableState;
    const reveal = poker.phase === "showdown";
    const isPvp = Boolean(game.multiplayer?.enabled);
    const playerHand = evaluatePokerHand(poker.playerCards);
    const botHand = reveal ? evaluatePokerHand(poker.botCards) : null;
    const turnLabel = isPvp
      ? poker.phase === "draw"
        ? "sua vez"
        : poker.phase === "opponent"
          ? `${game.opponent.name} troca`
          : "showdown"
      : reveal
        ? "showdown"
        : "sua vez";

    return `
      <div class="pubpaid-poker-layout">
        <div class="pubpaid-game-chip-row">
          <span class="pubpaid-turn-chip">${escapeHtml(turnLabel)}</span>
          <span class="pubpaid-turn-chip">pote ${escapeHtml(formatCoins(game.payout))}</span>
          ${isPvp ? '<span class="pubpaid-turn-chip">pvp ao vivo</span>' : ""}
        </div>
        <section class="pubpaid-cards-table pubpaid-minigame-frame">
          <div class="pubpaid-minigame-head">
            <strong>Poker da Mesa Redonda</strong>
            <span>Segure cartas, troque uma vez e feche a melhor mão.</span>
          </div>
          <article class="pubpaid-card-hand">
            <strong>${escapeHtml(isPvp ? game.opponent.name : "Mao da casa")}</strong>
            <div class="pubpaid-card-row">
              ${poker.botCards.map((card, index) => renderPokerCard(card, !reveal, false, index, false)).join("")}
            </div>
          </article>
          <article class="pubpaid-card-hand">
            <strong>Sua mao</strong>
            <div class="pubpaid-card-row">
              ${poker.playerCards
                .map((card, index) => renderPokerCard(card, false, poker.held[index], index, poker.phase === "draw" && !poker.drawUsed))
                .join("")}
            </div>
          </article>
        </section>

        <section class="pubpaid-cards-info">
          <article>
            <span>status</span>
            <strong>${escapeHtml(poker.message)}</strong>
          </article>
          <article>
            <span>sua mão</span>
            <strong>${escapeHtml(playerHand.label)}</strong>
          </article>
          <article>
            <span>mesa</span>
            <strong>${escapeHtml(reveal && botHand ? `${playerHand.label} x ${botHand.label}` : isPvp ? `rival ${poker.opponentDrawUsed ? "ja trocou" : "ainda decide"}` : "aguardando revelação")}</strong>
          </article>
          <div class="pubpaid-card-actions">
            <button class="pubpaid-card-button" type="button" data-poker-draw ${poker.phase !== "draw" || poker.drawUsed ? "disabled" : ""}>Trocar cartas</button>
            <button class="pubpaid-card-button" type="button" data-abandon-game>Sair da mesa</button>
          </div>
        </section>
      </div>
    `;
  }

  function renderPokerCard(card, hidden, held, index, interactive) {
    return renderPlayingCard(card, {
      hidden,
      held,
      interactive,
      dataAttr: interactive ? `data-poker-toggle="${index}"` : "",
      note: held ? "segura" : getSuitMeta(card?.suit).label
    });
  }

  function handleCardsAction(action) {
    const game = runtime.activeGame;
    if (!game || game.id !== "cards21" || game.screen !== "playing") return;
    const cards = game.tableState;
    if (cards.phase !== "player") return;

    if (game.multiplayer?.enabled) {
      cards.message = action === "hit" ? "Comprando carta na mesa PvP..." : "Travando a mao na mesa PvP...";
      cards.phase = "opponent";
      renderGameModal();
      void submitCards21PvpAction(action).catch((error) => {
        cards.phase = "player";
        cards.message = String(error?.message || "Nao consegui falar com a mesa PvP.");
        renderGameModal();
      });
      return;
    }

    if (action === "hit") {
      cards.playerCards.push(drawCardsValue(cards));
      const total = sumCards(cards.playerCards);
      if (total > 21) {
        finalizeGame("loss", `${state.profile.name || "Voce"} estourou no 21 e soltou a mesa.`);
        return;
      }
      if (total === 21) {
        finalizeGame("win", `${state.profile.name || "Voce"} fechou 21 antes da banca.`);
        return;
      }
      cards.message = `Voce puxou mais uma carta e foi para ${total}.`;
      renderGameModal();
      return;
    }

    if (action === "stand") {
      cards.phase = "bot";
      cards.message = `${game.opponent.name} esta comprando a resposta.`;
      renderGameModal();
      runtime.gameTimer = window.setTimeout(runCardsBotTurn, 800);
    }
  }

  function runCardsBotTurn() {
    const game = runtime.activeGame;
    if (!game || game.id !== "cards21" || game.screen !== "playing") return;
    const cards = game.tableState;
    const playerTotal = sumCards(cards.playerCards);
    let botTotal = sumCards(cards.botCards);

    while (botTotal < 17 || (botTotal < playerTotal && playerTotal <= 21)) {
      cards.botCards.push(drawCardsValue(cards));
      botTotal = sumCards(cards.botCards);
      if (botTotal >= 21) break;
    }

    if (botTotal > 21) {
      finalizeGame("win", `${game.opponent.name} estourou e entregou a mesa do 21.`);
      return;
    }
    if (botTotal > playerTotal) {
      finalizeGame("loss", `${game.opponent.name} segurou cartas melhores e venceu no 21.`);
      return;
    }
    if (playerTotal > botTotal) {
      finalizeGame("win", `${state.profile.name || "Voce"} parou melhor e levou o 21 do bar.`);
      return;
    }
    finalizeGame("tie", "As duas maos fecharam no mesmo total e a entrada voltou.");
  }

  function handlePokerToggle(index) {
    const game = runtime.activeGame;
    if (!game || game.id !== "poker" || game.screen !== "playing") return;
    const poker = game.tableState;
    if (poker.phase !== "draw" || poker.drawUsed) return;
    if (index < 0 || index >= poker.held.length) return;
    poker.held[index] = !poker.held[index];
    poker.message = poker.held[index]
      ? "Carta marcada para ficar na mão."
      : "Carta liberada para troca.";
    renderGameModal();
  }

  function handlePokerDraw() {
    const game = runtime.activeGame;
    if (!game || game.id !== "poker" || game.screen !== "playing") return;
    const poker = game.tableState;
    if (poker.phase !== "draw" || poker.drawUsed) return;

    if (game.multiplayer?.enabled) {
      poker.message = "Enviando a troca para a mesa PvP...";
      poker.phase = "opponent";
      renderGameModal();
      void submitPokerPvpDraw(poker.held.slice()).catch((error) => {
        poker.phase = "draw";
        poker.message = String(error?.message || "Nao consegui falar com a mesa PvP.");
        renderGameModal();
      });
      return;
    }

    poker.playerCards = poker.playerCards.map((card, index) => (poker.held[index] ? card : drawPokerCards(poker.deck, 1)[0] || card));
    runPokerBotDraw(poker);
    poker.drawUsed = true;
    poker.phase = "showdown";

    const playerHand = evaluatePokerHand(poker.playerCards);
    const botHand = evaluatePokerHand(poker.botCards);
    poker.message = `${state.profile.name || "Voce"} fechou ${playerHand.label}. ${game.opponent.name} mostrou ${botHand.label}.`;
    renderGameModal();

    const result = comparePokerHands(playerHand, botHand);
    if (result > 0) {
      finalizeGame("win", `${state.profile.name || "Voce"} levou o poker com ${playerHand.label.toLowerCase()}.`);
      return;
    }
    if (result < 0) {
      finalizeGame("loss", `${game.opponent.name} segurou a mesa com ${botHand.label.toLowerCase()}.`);
      return;
    }
    finalizeGame("tie", `A mesa de poker empatou em ${playerHand.label.toLowerCase()}.`);
  }

  function runPokerBotDraw(poker) {
    const counts = countPokerRanks(poker.botCards);
    poker.botCards = poker.botCards.map((card) => (counts.get(card.rank) >= 2 ? card : drawPokerCards(poker.deck, 1)[0] || card));
  }

  function countPokerRanks(cards) {
    const counts = new Map();
    cards.forEach((card) => counts.set(card.rank, (counts.get(card.rank) || 0) + 1));
    return counts;
  }

  function evaluatePokerHand(cards) {
    const sorted = cards.slice().sort((a, b) => b.rank - a.rank);
    const ranks = sorted.map((card) => card.rank);
    const suits = sorted.map((card) => card.suit);
    const counts = Array.from(countPokerRanks(sorted).entries()).sort((a, b) => b[1] - a[1] || b[0] - a[0]);
    const uniqueRanks = Array.from(new Set(ranks)).sort((a, b) => b - a);
    const flush = suits.every((suit) => suit === suits[0]);
    const straight = isPokerStraight(uniqueRanks);

    if (flush && straight) {
      return { score: 8, label: "straight flush", tiebreak: [uniqueRanks[0] === 14 && uniqueRanks[1] === 5 ? 5 : uniqueRanks[0]] };
    }
    if (counts[0][1] === 4) {
      return { score: 7, label: "quadra", tiebreak: [counts[0][0], counts[1][0]] };
    }
    if (counts[0][1] === 3 && counts[1]?.[1] === 2) {
      return { score: 6, label: "full house", tiebreak: [counts[0][0], counts[1][0]] };
    }
    if (flush) {
      return { score: 5, label: "flush", tiebreak: uniqueRanks };
    }
    if (straight) {
      return { score: 4, label: "sequência", tiebreak: [uniqueRanks[0] === 14 && uniqueRanks[1] === 5 ? 5 : uniqueRanks[0]] };
    }
    if (counts[0][1] === 3) {
      return { score: 3, label: "trinca", tiebreak: [counts[0][0], ...uniqueRanks.filter((rank) => rank !== counts[0][0])] };
    }
    if (counts[0][1] === 2 && counts[1]?.[1] === 2) {
      const pairs = counts.filter((entry) => entry[1] === 2).map((entry) => entry[0]).sort((a, b) => b - a);
      const kicker = uniqueRanks.find((rank) => !pairs.includes(rank)) || 0;
      return { score: 2, label: "dois pares", tiebreak: [...pairs, kicker] };
    }
    if (counts[0][1] === 2) {
      return { score: 1, label: "par", tiebreak: [counts[0][0], ...uniqueRanks.filter((rank) => rank !== counts[0][0])] };
    }
    return { score: 0, label: "carta alta", tiebreak: uniqueRanks };
  }

  function isPokerStraight(uniqueRanks) {
    if (uniqueRanks.length !== 5) return false;
    for (let index = 0; index < uniqueRanks.length - 1; index += 1) {
      if (uniqueRanks[index] - 1 !== uniqueRanks[index + 1]) {
        return uniqueRanks.join(",") === "14,5,4,3,2";
      }
    }
    return true;
  }

  function comparePokerHands(a, b) {
    if (a.score !== b.score) return a.score > b.score ? 1 : -1;
    const maxLength = Math.max(a.tiebreak.length, b.tiebreak.length);
    for (let index = 0; index < maxLength; index += 1) {
      const left = a.tiebreak[index] || 0;
      const right = b.tiebreak[index] || 0;
      if (left !== right) return left > right ? 1 : -1;
    }
    return 0;
  }

  function getPokerRankLabel(rank) {
    if (rank === 14) return "A";
    if (rank === 13) return "K";
    if (rank === 12) return "Q";
    if (rank === 11) return "J";
    return String(rank);
  }

  function getPokerSuitSymbol(suit) {
    return getSuitMeta(suit).label;
  }

  function createTrucoDeck() {
    const suits = ["clubs", "hearts", "spades", "diamonds"];
    const ranks = [4, 5, 6, 7, 12, 11, 13, 14, 2, 3];
    const deck = [];
    suits.forEach((suit) => {
      ranks.forEach((rank) => deck.push({ suit, rank }));
    });
    for (let index = deck.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      const temp = deck[index];
      deck[index] = deck[swapIndex];
      deck[swapIndex] = temp;
    }
    return deck;
  }

  function drawTrucoCards(deck, count) {
    const cards = [];
    for (let index = 0; index < count; index += 1) {
      const card = deck.pop();
      if (card) cards.push(card);
    }
    return cards;
  }

  function getTrucoRankCycle() {
    return [4, 5, 6, 7, 12, 11, 13, 14, 2, 3];
  }

  function getTrucoManilhaRank(viraRank) {
    const cycle = getTrucoRankCycle();
    const index = cycle.indexOf(clampInteger(viraRank));
    if (index < 0) return 4;
    return cycle[(index + 1) % cycle.length];
  }

  function getTrucoRankStrength(rank) {
    const order = [4, 5, 6, 7, 12, 11, 13, 14, 2, 3];
    return order.indexOf(clampInteger(rank));
  }

  function getTrucoSuitStrength(suit) {
    const order = { diamonds: 0, spades: 1, hearts: 2, clubs: 3 };
    return order[suit] ?? 0;
  }

  function compareTrucoCards(left, right, manilhaRank) {
    const leftManilha = clampInteger(left?.rank) === clampInteger(manilhaRank);
    const rightManilha = clampInteger(right?.rank) === clampInteger(manilhaRank);
    if (leftManilha && rightManilha) {
      const deltaSuit = getTrucoSuitStrength(left?.suit) - getTrucoSuitStrength(right?.suit);
      return deltaSuit === 0 ? 0 : deltaSuit > 0 ? 1 : -1;
    }
    if (leftManilha) return 1;
    if (rightManilha) return -1;
    const deltaRank = getTrucoRankStrength(left?.rank) - getTrucoRankStrength(right?.rank);
    return deltaRank === 0 ? 0 : deltaRank > 0 ? 1 : -1;
  }

  function describeTrucoCard(card, manilhaRank) {
    if (!card) return "";
    const meta = getSuitMeta(card.suit);
    const base = `${getPokerRankLabel(card.rank)} ${meta.label}`;
    return clampInteger(card.rank) === clampInteger(manilhaRank) ? `${base} (manilha)` : base;
  }

  function getTrucoHandWinner(results, initialLeader) {
    const first = results[0];
    const second = results[1];
    const third = results[2];
    if (!first) return "";
    if (first !== "tie") {
      if (second === first || second === "tie") return first;
      if (!third) return "";
      return third === "tie" ? first : third;
    }
    if (!second) return "";
    if (second !== "tie") return second;
    if (!third) return "";
    return third === "tie" ? initialLeader : third;
  }

  function createTrucoState() {
    const deck = createTrucoDeck();
    const playerCards = drawTrucoCards(deck, 3);
    const botCards = drawTrucoCards(deck, 3);
    const vira = drawTrucoCards(deck, 1)[0] || { rank: 4, suit: "clubs" };
    return {
      phase: "player",
      deck,
      playerCards,
      botCards,
      vira,
      manilhaRank: getTrucoManilhaRank(vira.rank),
      leader: "player",
      initialLeader: "player",
      currentTrick: 1,
      tableCards: { player: null, bot: null },
      trickResults: [],
      history: [],
      message: "Primeira vaza aberta. Sua vez de sair no truco.",
    };
  }

  function chooseTrucoBotCard(truco, responseToCard = null) {
    const sorted = truco.botCards
      .map((card, index) => ({ card, index }))
      .sort((a, b) => compareTrucoCards(a.card, b.card, truco.manilhaRank));
    if (!responseToCard) {
      return (truco.currentTrick === 3 ? sorted[sorted.length - 1] : sorted[Math.max(0, sorted.length - 2)]) || sorted[0];
    }
    const winning = sorted.find((entry) => compareTrucoCards(entry.card, responseToCard, truco.manilhaRank) > 0);
    return winning || sorted[0];
  }

  function renderTrucoGame(game) {
    const truco = game.tableState;
    const trickWinsPlayer = truco.trickResults.filter((item) => item === "player").length;
    const trickWinsBot = truco.trickResults.filter((item) => item === "bot").length;
    const turnLabel =
      truco.phase === "player"
        ? "sua vez"
        : truco.phase === "opponent"
          ? `${game.opponent.name} abre`
          : "vaza em mesa";
    return `
      <div class="pubpaid-poker-layout">
        <div class="pubpaid-game-chip-row">
          <span class="pubpaid-turn-chip">${escapeHtml(turnLabel)}</span>
          <span class="pubpaid-turn-chip">pote ${escapeHtml(formatCoins(game.payout))}</span>
          <span class="pubpaid-turn-chip">manilha ${escapeHtml(getPokerRankLabel(truco.manilhaRank))}</span>
        </div>
        <section class="pubpaid-cards-table pubpaid-minigame-frame">
          <div class="pubpaid-minigame-head">
            <strong>Truco Paulista</strong>
            <span>Melhor de três vazas com vira aberta e manilha móvel.</span>
          </div>
          <article class="pubpaid-card-hand">
            <strong>Vira da rodada</strong>
            <div class="pubpaid-card-row">
              ${renderPlayingCard(truco.vira, { note: "vira" })}
            </div>
          </article>
          <article class="pubpaid-card-hand">
            <strong>${escapeHtml(game.opponent.name)}</strong>
            <div class="pubpaid-card-row">
              ${truco.tableCards.bot ? renderPlayingCard(truco.tableCards.bot, { note: "na mesa" }) : ""}
              ${truco.botCards.map(() => renderPlayingCard(null, { hidden: true })).join("")}
            </div>
          </article>
          <article class="pubpaid-card-hand">
            <strong>Sua mão</strong>
            <div class="pubpaid-card-row">
              ${truco.tableCards.player ? renderPlayingCard(truco.tableCards.player, { note: "na mesa" }) : ""}
              ${truco.playerCards
                .map((card, index) =>
                  renderPlayingCard(card, {
                    interactive: truco.phase === "player",
                    dataAttr: `data-truco-play="${index}"`,
                    note: clampInteger(card.rank) === clampInteger(truco.manilhaRank) ? "manilha" : getPokerSuitSymbol(card.suit)
                  })
                )
                .join("")}
            </div>
          </article>
        </section>

        <section class="pubpaid-cards-info">
          <article>
            <span>status</span>
            <strong>${escapeHtml(truco.message)}</strong>
          </article>
          <article>
            <span>placar das vazas</span>
            <strong>${escapeHtml(String(trickWinsPlayer))} x ${escapeHtml(String(trickWinsBot))}</strong>
          </article>
          <article>
            <span>histórico</span>
            <strong>${escapeHtml(truco.history.length ? truco.history.map((item) => `${item.trick}ª:${item.winnerLabel}`).join(" • ") : "sem vazas fechadas")}</strong>
          </article>
          <div class="pubpaid-card-actions">
            <button class="pubpaid-card-button" type="button" data-abandon-game>Sair da mesa</button>
          </div>
        </section>
      </div>
    `;
  }

  function resolveTrucoTrick(game) {
    const truco = game.tableState;
    const playerCard = truco.tableCards.player;
    const botCard = truco.tableCards.bot;
    if (!playerCard || !botCard) return;
    const outcome = compareTrucoCards(playerCard, botCard, truco.manilhaRank);
    const winner = outcome > 0 ? "player" : outcome < 0 ? "bot" : "tie";
    const winnerLabel =
      winner === "player" ? (state.profile.name || "Voce") : winner === "bot" ? game.opponent.name : "empate";
    truco.trickResults.push(winner);
    truco.history.push({
      trick: truco.currentTrick,
      winner,
      winnerLabel,
      playerCard: describeTrucoCard(playerCard, truco.manilhaRank),
      botCard: describeTrucoCard(botCard, truco.manilhaRank)
    });
    const handWinner = getTrucoHandWinner(truco.trickResults, truco.initialLeader);
    if (handWinner) {
      if (handWinner === "player") {
        finalizeGame("win", `${state.profile.name || "Voce"} fechou o truco por ${truco.trickResults.filter((item) => item === "player").length} a ${truco.trickResults.filter((item) => item === "bot").length}.`);
      } else {
        finalizeGame("loss", `${game.opponent.name} fechou o truco por ${truco.trickResults.filter((item) => item === "bot").length} a ${truco.trickResults.filter((item) => item === "player").length}.`);
      }
      return;
    }

    truco.message = `Vaza ${truco.currentTrick}: ${winner === "tie" ? "empatou" : `${winnerLabel} levou`} com ${describeTrucoCard(winner === "player" ? playerCard : botCard, truco.manilhaRank)}.`;
    truco.leader = winner === "tie" ? truco.leader : winner;
    truco.currentTrick += 1;
    truco.tableCards = { player: null, bot: null };
    if (truco.leader === "player") {
      truco.phase = "player";
      truco.message = `${truco.message} Sua vez de abrir a próxima vaza.`;
      renderGameModal();
      return;
    }
    truco.phase = "opponent";
    truco.message = `${truco.message} ${game.opponent.name} vai sair primeiro agora.`;
    renderGameModal();
    runtime.gameTimer = window.setTimeout(runTrucoBotLead, 820);
  }

  function runTrucoBotLead() {
    const game = runtime.activeGame;
    if (!game || game.id !== "truco" || game.screen !== "playing") return;
    const truco = game.tableState;
    if (truco.phase !== "opponent" || truco.tableCards.bot || !truco.botCards.length) return;
    const choice = chooseTrucoBotCard(truco);
    if (!choice) return;
    truco.tableCards.bot = choice.card;
    truco.botCards.splice(choice.index, 1);
    truco.phase = "player";
    truco.message = `${game.opponent.name} abriu com ${describeTrucoCard(choice.card, truco.manilhaRank)}. Responda a vaza.`;
    renderGameModal();
  }

  function handleTrucoPlay(index) {
    const game = runtime.activeGame;
    if (!game || game.id !== "truco" || game.screen !== "playing") return;
    const truco = game.tableState;
    if (truco.phase !== "player" || index < 0 || index >= truco.playerCards.length) return;
    const [card] = truco.playerCards.splice(index, 1);
    if (!card) return;
    truco.tableCards.player = card;

    if (truco.tableCards.bot) {
      truco.message = `Você respondeu com ${describeTrucoCard(card, truco.manilhaRank)}.`;
      renderGameModal();
      resolveTrucoTrick(game);
      return;
    }

    const choice = chooseTrucoBotCard(truco, card);
    if (choice) {
      truco.tableCards.bot = choice.card;
      truco.botCards.splice(choice.index, 1);
    }
    truco.message = `Você saiu com ${describeTrucoCard(card, truco.manilhaRank)}. ${game.opponent.name} respondeu.`;
    renderGameModal();
    resolveTrucoTrick(game);
  }

  function createDiceState() {
    return {
      round: 1,
      playerScore: 0,
      botScore: 0,
      phase: "guess",
      playerGuess: 0,
      botGuess: 0,
      dice: [0, 0],
      total: 0,
      rollSeed: 0,
      message: "Escolha a soma escondida sob os copos."
    };
  }

  function renderDiceGame(game) {
    const dice = game.tableState;
    const isPvp = Boolean(game.multiplayer?.enabled);
    const cupMarkup = [0, 1].map((index) => renderDiceCup(dice, index)).join("");
    const sumMarkup = renderDiceSumCup(dice);
    const rollingHint =
      dice.phase === "rolling"
        ? `<p class="pubpaid-dice-stage-note is-live">Os copos batem na mesa, os dados estao rolando e a casa ainda nao abriu o total.</p>`
        : `<p class="pubpaid-dice-stage-note">Escolha uma soma, espere os copos sacudirem e veja quem leu melhor a mesa.</p>`;
    return `
      <div class="pubpaid-dice-layout">
        <section class="pubpaid-dice-stage pubpaid-minigame-frame">
          <div class="pubpaid-minigame-head">
            <strong>Copos e Dados</strong>
            <span>Escolha a soma e veja quem ficou mais perto do total escondido.</span>
          </div>
          ${isPvp ? `<div class="pubpaid-game-chip-row"><span class="pubpaid-turn-chip">${escapeHtml(dice.phase === "guess" ? "sua vez" : `${game.opponent.name} responde`)}</span><span class="pubpaid-turn-chip">pvp ao vivo</span></div>` : ""}
          <div class="pubpaid-dice-cups">
            ${cupMarkup}
            ${sumMarkup}
          </div>
          ${rollingHint}

          ${dice.phase === "reveal" ? `
            <div class="pubpaid-dice-reveal">
              ${renderDieFace(dice.dice[0] || 1, "dado 1")}
              ${renderDieFace(dice.dice[1] || 1, "dado 2")}
              <span class="pubpaid-dice-sum-card" aria-label="soma final ${escapeHtml(String(dice.total))}">
                <small>soma real</small>
                <strong>${escapeHtml(String(dice.total))}</strong>
              </span>
            </div>
          ` : ""}
        </section>

        <section class="pubpaid-dice-scoreboard">
          <article>
            <span>rodada</span>
            <strong>${escapeHtml(String(dice.round))}/3</strong>
          </article>
          <article>
            <span>placar</span>
            <strong>${escapeHtml(String(dice.playerScore))} x ${escapeHtml(String(dice.botScore))}</strong>
          </article>
          <article>
            <span>status</span>
            <strong>${escapeHtml(dice.message)}</strong>
          </article>
          ${
            dice.phase === "guess"
              ? `
                <div class="pubpaid-dice-grid">
                  ${Array.from({ length: 11 }, (_, index) => index + 2)
                    .map(
                      (value) =>
                        `<button class="pubpaid-dice-button${dice.playerGuess === value ? " is-active" : ""}" type="button" data-dice-guess="${value}">${value}</button>`
                    )
                    .join("")}
                </div>
              `
              : dice.phase === "rolling"
                ? `
                  <div class="pubpaid-card-actions">
                    <button class="pubpaid-card-button" type="button" disabled>Copos batendo na mesa...</button>
                    <button class="pubpaid-card-button" type="button" data-abandon-game>Sair da mesa</button>
                  </div>
                `
              : `
                <div class="pubpaid-card-actions">
                  ${
                    dice.round < 3
                      ? '<button class="pubpaid-card-button" type="button" data-dice-next>Proxima rodada</button>'
                      : ""
                  }
                  <button class="pubpaid-card-button" type="button" data-abandon-game>Sair da mesa</button>
                </div>
              `
          }
        </section>
      </div>
    `;
  }

  function renderDiceCup(dice, index) {
    const value = dice.dice[index] || 1;
    const isRolling = dice.phase === "rolling";
    const isReveal = dice.phase === "reveal";
    const hasDie = isRolling || isReveal;
    const label = `copo ${index + 1}`;

    return `
      <article class="pubpaid-dice-cup${isRolling ? " is-rolling" : ""}${isReveal ? " is-open" : ""}">
        <div class="pubpaid-dice-cup-shadow"></div>
        <div class="pubpaid-dice-cup-glass">
          <div class="pubpaid-dice-cup-rim"></div>
          <div class="pubpaid-dice-cup-body"></div>
        </div>
        <div class="pubpaid-dice-felt">
          ${hasDie ? `
            <div class="pubpaid-dice-drop${isRolling ? " is-rolling" : ""}" style="--drop-delay:${index * 0.14}s; --drop-rotate:${index === 0 ? "-16deg" : "14deg"};">
              ${renderMiniDie(value)}
            </div>
          ` : '<div class="pubpaid-dice-hidden-note">?</div>'}
        </div>
        <span>${escapeHtml(label)}</span>
      </article>
    `;
  }

  function renderDiceSumCup(dice) {
    const isRolling = dice.phase === "rolling";
    const isReveal = dice.phase === "reveal";
    return `
      <article class="pubpaid-dice-cup pubpaid-dice-total${isRolling ? " is-rolling" : ""}${isReveal ? " is-open" : ""}">
        <div class="pubpaid-dice-cup-shadow"></div>
        <div class="pubpaid-dice-cup-glass">
          <div class="pubpaid-dice-cup-rim"></div>
          <div class="pubpaid-dice-cup-body"></div>
        </div>
        <div class="pubpaid-dice-total-readout">
          <small>soma</small>
          <strong>${isReveal ? escapeHtml(String(dice.total)) : "?"}</strong>
        </div>
        <span>soma</span>
      </article>
    `;
  }

  function renderMiniDie(value) {
    const active = getDiePipMap(Math.max(1, Math.min(6, clampInteger(value))));
    return `
      <span class="pubpaid-mini-die">
        ${Array.from({ length: 9 }, (_, index) => `<i class="${active.includes(index) ? "is-on" : ""}"></i>`).join("")}
      </span>
    `;
  }

  function handleDiceGuess(guess) {
    const game = runtime.activeGame;
    if (!game || game.id !== "dicecups" || game.screen !== "playing") return;
    const dice = game.tableState;
    if (dice.phase !== "guess") return;

    if (game.multiplayer?.enabled) {
      dice.phase = "rolling";
      dice.message = "Enviando seu palpite para a mesa PvP...";
      renderGameModal();
      void submitDicecupsPvpGuess(guess).catch((error) => {
        dice.phase = "guess";
        dice.message = String(error?.message || "Nao consegui falar com a mesa PvP.");
        renderGameModal();
      });
      return;
    }

    dice.playerGuess = guess;
    dice.botGuess = pickBotDiceGuess(guess);
    dice.dice = [randomDie(), randomDie()];
    dice.total = dice.dice[0] + dice.dice[1];
    dice.rollSeed = Math.round(Math.random() * 9999);
    dice.phase = "rolling";
    dice.message = "Os copos chacoalharam, os dados cairam e a mesa ainda nao abriu o total.";
    renderGameModal();
    playDiceTableSound();

    const playerDiff = Math.abs(dice.playerGuess - dice.total);
    const botDiff = Math.abs(dice.botGuess - dice.total);
    runtime.gameTimer = window.setTimeout(() => {
      const activeGame = runtime.activeGame;
      if (!activeGame || activeGame.id !== "dicecups" || activeGame.screen !== "playing") return;

      if (playerDiff < botDiff) {
        dice.playerScore += 1;
        dice.message = `${state.profile.name || "Voce"} ficou mais perto da soma ${dice.total}.`;
      } else if (botDiff < playerDiff) {
        dice.botScore += 1;
        dice.message = `${game.opponent.name} leu melhor os copos e pegou a rodada.`;
      } else {
        dice.message = `Os dois ficaram na mesma distancia da soma ${dice.total}.`;
      }

      dice.phase = "reveal";
      renderGameModal();
      playDiceTableSound(true);

      if (dice.round === 3) {
        runtime.gameTimer = window.setTimeout(() => {
          if (!runtime.activeGame || runtime.activeGame.id !== "dicecups") return;
          if (dice.playerScore > dice.botScore) {
            finalizeGame("win", `${state.profile.name || "Voce"} leu melhor os copos e venceu a serie.`);
          } else if (dice.botScore > dice.playerScore) {
            finalizeGame("loss", `${game.opponent.name} ganhou mais leituras e fechou os copos.`);
          } else {
            finalizeGame("tie", "Os copos fecharam em igualdade e a entrada voltou.");
          }
        }, 1400);
      }
    }, 2300);
  }

  function advanceDiceRound() {
    const game = runtime.activeGame;
    if (!game || game.id !== "dicecups" || game.screen !== "playing") return;
    const dice = game.tableState;
    if (dice.phase !== "reveal" || dice.round >= 3) return;

    dice.round += 1;
    dice.phase = "guess";
    dice.playerGuess = 0;
    dice.botGuess = 0;
    dice.dice = [0, 0];
    dice.total = 0;
    dice.rollSeed = 0;
    dice.message = "Nova rodada. Escolha outra soma escondida.";
    renderGameModal();
  }

  function playDiceTableSound(isReveal = false) {
    ensureAudioContext();
    const ctx = runtime.audio.ctx;
    if (!ctx) return;
    const now = ctx.currentTime + 0.01;

    playNote(isReveal ? 180 : 120, 0.08, "triangle", 0.03, now);
    playNote(isReveal ? 140 : 92, 0.11, "square", 0.02, now + 0.05);
    playNote(isReveal ? 220 : 150, 0.06, "triangle", 0.018, now + 0.1);
  }

  function pickBotDiceGuess(playerGuess) {
    let guess = clampInteger(playerGuess + (Math.floor(Math.random() * 7) - 3));
    if (guess < 2) guess = 2;
    if (guess > 12) guess = 12;
    return guess;
  }

  function randomDie() {
    return 1 + Math.floor(Math.random() * 6);
  }

  function createSlotsState() {
    return {
      reels: ["star", "bar", "cherry"],
      phase: "ready",
      spins: 0,
      round: 1,
      maxRounds: 3,
      playerRounds: 0,
      houseRounds: 0,
      pushRounds: 0,
      message: "Puxe a alavanca para começar uma série de 3 giros.",
      payoutLabel: "Sem premio na ultima rodada.",
      lastMatch: "",
      lastRoundResult: ""
    };
  }

  function renderSlotsGame(game) {
    const slots = game.tableState;
    const spinDisabled = slots.phase === "spinning";
    const reelMarkup = slots.reels.map((symbol, index) => renderSlotReel(symbol, index)).join("");

    return `
      <div class="pubpaid-slots-layout">
        <section class="pubpaid-slots-stage pubpaid-minigame-frame">
          <div class="pubpaid-minigame-head">
            <strong>Caça-Níqueis Neon</strong>
            <span>Puxe a alavanca e alinhe simbolos iguais na linha central.</span>
          </div>
          <div class="pubpaid-slots-machine${slots.phase === "spinning" ? " is-spinning" : ""}">
            <div class="pubpaid-slots-top">
              <span>pixel jackpot</span>
              <strong>${escapeHtml(formatCoins(game.payout))}</strong>
            </div>
            <div class="pubpaid-slots-window">
              ${reelMarkup}
            </div>
            <div class="pubpaid-slots-bottom">
              <span class="pubpaid-slots-led">${escapeHtml(slots.lastMatch || "linha central")}</span>
              <button class="pubpaid-slots-lever" type="button" data-slot-spin ${spinDisabled ? "disabled" : ""}>
                <span></span>
                Puxar alavanca
              </button>
            </div>
          </div>
        </section>

        <section class="pubpaid-slots-side">
          <article>
            <span>status</span>
            <strong>${escapeHtml(slots.message)}</strong>
            <p>${escapeHtml(slots.payoutLabel)}</p>
          </article>
          <article>
            <span>série</span>
            <strong>${escapeHtml(`${slots.round}/${slots.maxRounds}`)}</strong>
            <p>Voce precisa vencer mais giros do que a maquina para fechar a cabine em alta.</p>
          </article>
          <article>
            <span>placar</span>
            <strong>${escapeHtml(`${slots.playerRounds} x ${slots.houseRounds}`)}</strong>
            <p>Trinca ou dupla forte contam ponto. Cereja segura empate no giro.</p>
          </article>
          <div class="pubpaid-card-actions">
            ${
              slots.phase === "settled" && slots.round < slots.maxRounds
                ? '<button class="pubpaid-card-button" type="button" data-slot-next>Próximo giro</button>'
                : `<button class="pubpaid-card-button" type="button" data-slot-spin ${spinDisabled ? "disabled" : ""}>Girar agora</button>`
            }
            <button class="pubpaid-card-button" type="button" data-abandon-game>Sair da maquina</button>
          </div>
        </section>
      </div>
    `;
  }

  function renderSlotReel(symbol, index) {
    const spec = getSlotSymbolSpec(symbol);
    return `
      <article class="pubpaid-slot-reel" data-slot-reel="${index}">
        <div class="pubpaid-slot-icon is-${escapeHtml(symbol)}">
          <span class="pubpaid-slot-fruit" aria-hidden="true">${escapeHtml(spec.icon)}</span>
        </div>
        <strong>${escapeHtml(spec.label)}</strong>
      </article>
    `;
  }

  function handleSlotsSpin() {
    const game = runtime.activeGame;
    if (!game || game.id !== "slots" || game.screen !== "playing") return;
    const slots = game.tableState;
    if (slots.phase === "spinning") return;
    if (slots.phase === "settled") {
      if (slots.round >= slots.maxRounds) return;
      slots.round += 1;
      slots.phase = "ready";
      slots.reels = ["star", "bar", "cherry"];
      slots.lastMatch = "";
      slots.payoutLabel = `Placar atual: ${slots.playerRounds} x ${slots.houseRounds}.`;
    }

    slots.phase = "spinning";
    slots.message = "A alavanca desceu e a maquina esta correndo.";
    slots.payoutLabel = "Os rolos estao embaralhando a sorte da casa.";
    slots.spins += 1;
    renderGameModal();

    runtime.gameTimer = window.setTimeout(() => {
      const activeGame = runtime.activeGame;
      if (!activeGame || activeGame.id !== "slots" || activeGame.screen !== "playing") return;
      resolveSlotsSpin();
    }, 900);
  }

  function resolveSlotsSpin() {
    const game = runtime.activeGame;
    if (!game || game.id !== "slots" || game.screen !== "playing") return;
    const slots = game.tableState;
    const reels = createSlotRoll(game.fortune);
    const first = reels[0];
    const second = reels[1];
    const third = reels[2];
    let result = "loss";
    let summary = "A maquina girou seca e ficou com a aposta.";
    let payoutLabel = "Nenhuma linha premiada dessa vez.";
    let lastMatch = "sem combinacao";

    if (first === second && second === third) {
      result = "win";
      slots.playerRounds += 1;
      summary = `${state.profile.name || "Voce"} alinhou tres ${getSlotSymbolSpec(first).label.toLowerCase()} e estourou o jackpot curto da casa.`;
      payoutLabel = "Trinca premiada: giro vencido com força total.";
      lastMatch = `trinca de ${getSlotSymbolSpec(first).label.toLowerCase()}`;
    } else if (first === second || second === third || first === third) {
      result = "win";
      slots.playerRounds += 1;
      summary = `${state.profile.name || "Voce"} puxou uma dupla forte e arrancou um premio rapido da maquina.`;
      payoutLabel = "Dupla premiada: ponto seu na série.";
      lastMatch = "dupla acesa";
    } else if (reels.includes("cherry")) {
      result = "tie";
      slots.pushRounds += 1;
      summary = "Uma cereja apareceu no visor e a maquina devolveu sua entrada.";
      payoutLabel = "Cereja viva: giro empatado.";
      lastMatch = "cereja salvou";
    } else {
      slots.houseRounds += 1;
    }

    slots.reels = reels;
    slots.phase = "settled";
    slots.message = summary;
    slots.payoutLabel = payoutLabel;
    slots.lastMatch = lastMatch;
    slots.lastRoundResult = result;
    renderGameModal();

    if (slots.round >= slots.maxRounds) {
      if (slots.playerRounds > slots.houseRounds) {
        game.payout = Math.max(game.stake * 3 - Math.round(game.stake * 0.08), game.stake * 2);
        finalizeGame("win", `${state.profile.name || "Voce"} venceu a série da máquina por ${slots.playerRounds} a ${slots.houseRounds}.`);
      } else if (slots.houseRounds > slots.playerRounds) {
        game.payout = 0;
        finalizeGame("loss", `A máquina fechou a série por ${slots.houseRounds} a ${slots.playerRounds} e segurou a cabine.`);
      } else {
        game.payout = 0;
        finalizeGame("tie", `A série da máquina travou em ${slots.playerRounds} a ${slots.houseRounds} e a entrada voltou.`);
      }
    }
  }

  function advanceSlotsRound() {
    const game = runtime.activeGame;
    if (!game || game.id !== "slots" || game.screen !== "playing") return;
    const slots = game.tableState;
    if (slots.phase !== "settled" || slots.round >= slots.maxRounds) return;

    slots.round += 1;
    slots.phase = "ready";
    slots.reels = ["star", "bar", "cherry"];
    slots.message = `Giro ${slots.round} de ${slots.maxRounds}. A máquina abriu outra janela.`;
    slots.payoutLabel = `Placar atual: ${slots.playerRounds} x ${slots.houseRounds}.`;
    slots.lastMatch = "";
    renderGameModal();
  }

  function createSlotRoll(fortune) {
    const symbols = ["cherry", "bar", "star", "seven", "bell"];
    const reels = [
      pickSlotSymbol(symbols, fortune, 0),
      pickSlotSymbol(symbols, fortune, 1),
      pickSlotSymbol(symbols, fortune, 2)
    ];

    if (fortune?.mood === "good" && Math.random() < 0.45) {
      reels[1] = reels[0];
    }
    if (fortune?.mood === "good" && Math.random() < 0.22) {
      reels[2] = reels[1];
    }
    if (fortune?.mood === "bad" && reels[0] === reels[1] && Math.random() < 0.6) {
      reels[2] = symbols[(symbols.indexOf(reels[0]) + 2) % symbols.length];
    }

    return reels;
  }

  function pickSlotSymbol(symbols, fortune, reelIndex) {
    const weighted = [
      { id: "cherry", weight: 28 },
      { id: "bar", weight: 23 },
      { id: "star", weight: 19 },
      { id: "bell", weight: 16 },
      { id: "seven", weight: 14 }
    ];
    if (fortune?.mood === "good") {
      weighted[0].weight += 4;
      weighted[2].weight += 3;
      weighted[4].weight += 2;
    } else if (fortune?.mood === "bad") {
      weighted[1].weight += 3;
      weighted[3].weight += 2;
      weighted[4].weight -= 3;
    }

    let total = 0;
    weighted.forEach((entry) => {
      total += Math.max(1, entry.weight + (reelIndex === 2 && entry.id === "seven" ? -1 : 0));
    });
    let roll = Math.random() * total;
    for (const entry of weighted) {
      roll -= Math.max(1, entry.weight + (reelIndex === 2 && entry.id === "seven" ? -1 : 0));
      if (roll <= 0) return entry.id;
    }
    return symbols[0];
  }

  function getSlotSymbolSpec(symbol) {
    const specs = {
      cherry: { icon: "🍒", label: "Cereja" },
      bar: { icon: "🍋", label: "Limao" },
      star: { icon: "🍉", label: "Melancia" },
      seven: { icon: "🍇", label: "Uva" },
      bell: { icon: "🔔", label: "Sino" }
    };
    return specs[symbol] || specs.cherry;
  }

  function createDartsState() {
    return {
      round: 1,
      maxRounds: 3,
      playerScore: 0,
      botScore: 0,
      lastPlayer: null,
      lastBot: null,
      aimX: 50,
      aimY: 50,
      message: "Ajuste a mira horizontal e a altura. O tabuleiro oficial paga single, double, treble, outer bull 25 e bull 50.",
      history: []
    };
  }

  function renderDartsGame(game) {
    const darts = game.tableState || createDartsState();
    const playerName = state.profile.name || "Voce";
    const isPvp = Boolean(game.multiplayer?.enabled);
    const buttonsDisabled = darts.round > darts.maxRounds || darts.phase === "opponent" ? "disabled" : "";
    const previewAim = describeDartPoint(darts.aimX, darts.aimY);
    const historyMarkup = darts.history.length
      ? darts.history
          .map(
            (item) => `
              <span class="pubpaid-game-chip">
                ${escapeHtml(String(item.round))}. ${escapeHtml(String(item.player))} x ${escapeHtml(String(item.bot))}
              </span>
            `
          )
          .join("")
      : '<span class="pubpaid-game-chip">sem arremessos ainda</span>';

    return `
      <div class="pubpaid-darts-layout">
        <section class="pubpaid-minigame-frame pubpaid-darts-stage">
          <div class="pubpaid-minigame-head">
            <div>
              <span class="pubpaid-game-chip">rodada ${escapeHtml(`${Math.min(darts.round, darts.maxRounds)}/${darts.maxRounds}`)}</span>
              <h3>Alvo de dardos na parede</h3>
            </div>
            <div class="pubpaid-game-chip-row">
              <span class="pubpaid-turn-chip">${escapeHtml(playerName)} ${escapeHtml(String(darts.playerScore))}</span>
              <span class="pubpaid-turn-chip">${escapeHtml(game.opponent.name)} ${escapeHtml(String(darts.botScore))}</span>
              ${isPvp ? '<span class="pubpaid-turn-chip">pvp ao vivo</span>' : ""}
            </div>
          </div>
          <div class="pubpaid-darts-board" aria-label="Alvo de dardos">
            <span class="ring ring-a"></span>
            <span class="ring ring-b"></span>
            <span class="ring ring-c"></span>
            <span class="bull"></span>
            <span class="dart-hit aim" style="--hit-x:${escapeHtml(String(darts.aimX))}%; --hit-y:${escapeHtml(String(darts.aimY))}%"></span>
            ${darts.lastPlayer ? `<span class="dart-hit player" style="--hit-x:${escapeHtml(String(darts.lastPlayer.x))}%; --hit-y:${escapeHtml(String(darts.lastPlayer.y))}%"></span>` : ""}
            ${darts.lastBot ? `<span class="dart-hit bot" style="--hit-x:${escapeHtml(String(darts.lastBot.x))}%; --hit-y:${escapeHtml(String(darts.lastBot.y))}%"></span>` : ""}
          </div>
        </section>
        <section class="pubpaid-game-box">
          <span class="pubpaid-game-chip">mira manual</span>
          <h3>Dardos de Parede</h3>
          <p>${escapeHtml(darts.message)}</p>
          <div class="pubpaid-game-chip-row">
            <span class="pubpaid-game-chip">mira lateral ${escapeHtml(String(Math.round(darts.aimX)))}</span>
            <span class="pubpaid-game-chip">altura ${escapeHtml(String(Math.round(darts.aimY)))}</span>
            <span class="pubpaid-game-chip">alvo previsto ${escapeHtml(previewAim.label)}</span>
          </div>
          <div class="pubpaid-darts-controls">
            <label class="pubpaid-darts-control">
              <span>Mira lateral</span>
              <input type="range" min="8" max="92" step="1" value="${escapeHtml(String(Math.round(darts.aimX)))}" data-darts-aim-x ${buttonsDisabled} />
              <small>Esquerda 8 / direita 92</small>
            </label>
            <label class="pubpaid-darts-control">
              <span>Altura da mira</span>
              <input type="range" min="8" max="92" step="1" value="${escapeHtml(String(Math.round(darts.aimY)))}" data-darts-aim-y ${buttonsDisabled} />
              <small>Topo 8 / base 92</small>
            </label>
          </div>
          <div class="pubpaid-stake-row">
            <button class="pubpaid-stake-button is-active" type="button" data-darts-throw ${buttonsDisabled}>Arremessar com essa mira</button>
          </div>
          <div class="pubpaid-game-chip-row">${historyMarkup}</div>
          <div class="pubpaid-card-actions">
            <button class="pubpaid-card-button" type="button" data-abandon-game>Sair da parede</button>
          </div>
        </section>
      </div>
    `;
  }

  function clampPercent(value, fallback = 50) {
    const number = Number(value);
    if (!Number.isFinite(number)) return fallback;
    return Math.max(0, Math.min(100, number));
  }

  function getDartsAimFromInputs() {
    const aimXInput = refs.gameHost?.querySelector("[data-darts-aim-x]");
    const aimYInput = refs.gameHost?.querySelector("[data-darts-aim-y]");
    return {
      aimX: clampPercent(aimXInput?.value, 50),
      aimY: clampPercent(aimYInput?.value, 50)
    };
  }

  function getDartboardPointResult(x, y) {
    const dx = clampPercent(x, 50) - 50;
    const dy = clampPercent(y, 50) - 50;
    const distance = Math.hypot(dx, dy);
    if (distance > 48) {
      return { score: 0, ring: "miss", number: 0, multiplier: 0, label: "fora do alvo" };
    }
    if (distance <= 4.2) {
      return { score: 50, ring: "bull", number: 25, multiplier: 2, label: "bull 50" };
    }
    if (distance <= 8.4) {
      return { score: 25, ring: "outerBull", number: 25, multiplier: 1, label: "outer bull 25" };
    }
    const order = [20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5];
    const angle = (Math.atan2(dx, -dy) * 180) / Math.PI;
    const normalizedAngle = (angle + 360 + 9) % 360;
    const number = order[Math.floor(normalizedAngle / 18) % order.length];
    if (distance >= 38.5 && distance <= 48) {
      return { score: number * 2, ring: "double", number, multiplier: 2, label: `double ${number}` };
    }
    if (distance >= 24.5 && distance <= 30.5) {
      return { score: number * 3, ring: "triple", number, multiplier: 3, label: `triple ${number}` };
    }
    return { score: number, ring: "single", number, multiplier: 1, label: `single ${number}` };
  }

  function describeDartPoint(x, y) {
    return getDartboardPointResult(x, y);
  }

  function getDartAimDifficulty(target) {
    if (!target || target.ring === "miss") return 0.9;
    if (target.ring === "bull") return 1.45;
    if (target.ring === "outerBull") return 1.2;
    if (target.ring === "triple" || target.ring === "double") return 1.15;
    return 0.82;
  }

  function getRandomDartAim() {
    const targets = [
      { x: 50, y: 24 },
      { x: 50, y: 50 },
      { x: 67, y: 30 },
      { x: 33, y: 30 },
      { x: 73, y: 63 },
      { x: 26, y: 66 }
    ];
    const choice = targets[Math.floor(Math.random() * targets.length)] || targets[0];
    return {
      aimX: clampPercent(choice.x + randomBetween(-7, 7), 50),
      aimY: clampPercent(choice.y + randomBetween(-7, 7), 50)
    };
  }

  function simulateDartThrow(aimX, aimY, isBot = false) {
    const intended = getDartboardPointResult(aimX, aimY);
    const difficulty = getDartAimDifficulty(intended);
    const spread = Math.max(4, 8 + difficulty * 8 - (isBot ? 2 : 0));
    const driftX = randomBetween(-spread, spread) + randomBetween(-spread * 0.55, spread * 0.55);
    const driftY = randomBetween(-spread, spread) + randomBetween(-spread * 0.55, spread * 0.55);
    const finalX = clampPercent(aimX + driftX, 50);
    const finalY = clampPercent(aimY + driftY, 50);
    const outcome = getDartboardPointResult(finalX, finalY);
    return {
      aimX: clampPercent(aimX, 50),
      aimY: clampPercent(aimY, 50),
      x: finalX,
      y: finalY,
      score: outcome.score,
      ring: outcome.ring,
      number: outcome.number,
      multiplier: outcome.multiplier,
      label: outcome.label
    };
  }

  function handleDartsThrow() {
    const game = runtime.activeGame;
    if (!game || game.id !== "darts" || game.screen !== "playing") return;
    const darts = game.tableState || createDartsState();
    if (darts.round > darts.maxRounds) return;
    const { aimX, aimY } = getDartsAimFromInputs();
    darts.aimX = aimX;
    darts.aimY = aimY;

    if (game.multiplayer?.enabled) {
      if (darts.phase === "opponent") return;
      darts.phase = "opponent";
      darts.message = `Travando a mira em ${describeDartPoint(aimX, aimY).label} e enviando para a mesa PvP...`;
      renderGameModal();
      void submitDartsPvpThrow({ aimX, aimY }).catch((error) => {
        darts.phase = "player";
        darts.message = String(error?.message || "Nao consegui falar com a mesa PvP.");
        renderGameModal();
      });
      return;
    }

    const player = simulateDartThrow(aimX, aimY, false);
    const botAim = getRandomDartAim();
    const bot = simulateDartThrow(botAim.aimX, botAim.aimY, true);
    darts.playerScore += player.score;
    darts.botScore += bot.score;
    darts.lastPlayer = player;
    darts.lastBot = bot;
    darts.history.push({ round: darts.round, player: player.score, bot: bot.score });
    darts.message = `${state.profile.name || "Voce"} caiu em ${player.label} (${player.score}). ${game.opponent.name} respondeu com ${bot.label} (${bot.score}).`;
    darts.round += 1;

    if (darts.round > darts.maxRounds) {
      if (darts.playerScore > darts.botScore) {
        finalizeGame("win", `${state.profile.name || "Voce"} venceu nos dardos por ${darts.playerScore} a ${darts.botScore}.`);
      } else if (darts.botScore > darts.playerScore) {
        finalizeGame("loss", `${game.opponent.name} venceu nos dardos por ${darts.botScore} a ${darts.playerScore}.`);
      } else {
        finalizeGame("tie", `A parede de dardos empatou em ${darts.playerScore} a ${darts.botScore}.`);
      }
      return;
    }

    renderGameModal();
  }

  function createRouletteState(stake = 10) {
    const bank = Math.max(12, Math.min(80, stake * 4));
    const chipOptions = [1, 2, 5, 10].filter((value) => value <= Math.max(10, bank));
    return {
      phase: "betting",
      round: 1,
      maxRounds: 3,
      playerRounds: 0,
      botRounds: 0,
      chipOptions: chipOptions.length ? chipOptions : [1],
      chipValue: chipOptions[1] || chipOptions[0] || 1,
      bank,
      playerChipsLeft: bank,
      playerBets: [],
      botBets: [],
      resultNumber: null,
      pendingResultNumber: null,
      message: "Duelo indireto: monte suas fichas. O rival monta as dele em segredo e o maior retorno no mesmo giro leva o round.",
      resultLine: "Melhor de 3 rodadas. Cada lado monta apostas separadas, mas o numero sorteado e o mesmo para os dois.",
      playerReturn: 0,
      botReturn: 0,
      wheelRotation: 0,
      ballRotation: 0,
      spinStartWheelRotation: 0,
      spinStartBallRotation: 0,
      history: []
    };
  }

  function renderRouletteGame(game) {
    const roulette = game.tableState;
    const playerName = state.profile.name || "Voce";
    const rivalHiddenLabel = roulette.phase === "betting" ? "apostas ocultas do rival" : game.opponent.name;
    const roundSummary =
      roulette.resultNumber === null
        ? "maior retorno no mesmo giro vence"
        : `${playerName}: ${roulette.playerReturn} | ${game.opponent.name}: ${roulette.botReturn}`;
    const instructionsMarkup = `
      <ol class="pubpaid-roulette-instructions">
        <li>Escolha o valor da ficha nos botoes 1, 2, 5 ou 10.</li>
        <li>Clique nas casas da mesa para montar sua aposta.</li>
        <li>Aperte Fechar apostas e girar para rodar a mesma bola para voce e o rival.</li>
        <li>Leva o round quem tiver maior retorno naquele numero sorteado.</li>
      </ol>
    `;
    const chipOptions = roulette.chipOptions
      .map((value) => {
        const active = value === roulette.chipValue ? " is-active" : "";
        return `<button class="pubpaid-stake-button${active}" type="button" data-roulette-chip="${value}">${escapeHtml(String(value))}</button>`;
      })
      .join("");

    const playerBetsMarkup = renderRouletteBetList(roulette.playerBets, "Suas fichas ainda nao entraram na mesa.");
    const rivalBetsMarkup = renderRouletteBetList(roulette.botBets, "O rival ainda nao abriu a propria cobertura.");
    const historyMarkup = roulette.history.length
      ? roulette.history
          .map((number) => `<span class="pubpaid-roulette-history-ball is-${escapeHtml(getRouletteColor(number))}">${escapeHtml(String(number))}</span>`)
          .join("")
      : '<span class="pubpaid-roulette-history-empty">sem giros ainda</span>';

    return `
      <div class="pubpaid-roulette-layout">
        <section class="pubpaid-roulette-stage pubpaid-minigame-frame">
          <div class="pubpaid-minigame-head">
            <div>
              <strong>Spin of Wonder</strong>
              <span>Duelo indireto: cada lado monta sua mesa em segredo, a roleta gira uma vez e o maior retorno leva a rodada.</span>
            </div>
            <div class="pubpaid-game-chip-row">
              <span class="pubpaid-turn-chip">entrada ${escapeHtml(formatCoins(game.stake))}</span>
              <span class="pubpaid-turn-chip">rodada ${escapeHtml(`${roulette.round}/${roulette.maxRounds}`)}</span>
            </div>
          </div>

          <div class="pubpaid-roulette-rules" aria-label="Como essa roleta funciona">
            <span class="pubpaid-roulette-rule">1. monte suas fichas</span>
            <span class="pubpaid-roulette-rule">2. o rival cobre em segredo</span>
            <span class="pubpaid-roulette-rule">3. o mesmo numero decide os dois lados</span>
          </div>

          <div class="pubpaid-roulette-scene">
            <img class="pubpaid-roulette-backdrop" src="./assets/pubpaid-roulette-bar-backdrop-v3.png" alt="" loading="eager" decoding="async" />
            <div class="pubpaid-roulette-dealer-wrap${roulette.phase === "spinning" ? " is-spinning" : ""}">
              <span class="pubpaid-roulette-dealer-arm" aria-hidden="true"></span>
              <img class="pubpaid-roulette-dealer" src="./assets/pubpaid-roulette-dealer-v4.png" alt="" loading="eager" decoding="async" />
            </div>
            <div class="pubpaid-roulette-scene-center">
              <div class="pubpaid-roulette-wheel-shell">
                ${renderRouletteWheelMarkup(roulette)}
              </div>
            </div>
          </div>

          <div class="pubpaid-roulette-betting-head">
            <div class="pubpaid-stake-row">${chipOptions}</div>
            <div class="pubpaid-roulette-bank">
              <span class="pubpaid-game-chip">saldo da rodada ${escapeHtml(String(roulette.playerChipsLeft))}</span>
              <span class="pubpaid-game-chip">limite da rodada ${escapeHtml(String(roulette.bank))}</span>
            </div>
          </div>

          <div class="pubpaid-roulette-board">
            ${renderRouletteBettingTable(roulette)}
          </div>
        </section>

        <section class="pubpaid-roulette-side">
          <article>
            <span>como jogar</span>
            <strong>aposte, gire e compare o retorno</strong>
            ${instructionsMarkup}
          </article>
          <article>
            <span>mesa da rodada</span>
            <strong>${escapeHtml(roulette.resultNumber === null ? "apostas abertas" : `numero ${roulette.resultNumber}`)}</strong>
            <p>${escapeHtml(roulette.message)}</p>
          </article>
          <article>
            <span>placar PvP</span>
            <strong>${escapeHtml(`${roulette.playerRounds} x ${roulette.botRounds}`)}</strong>
            <p>${escapeHtml(roulette.resultLine)}</p>
          </article>
          <article>
            <span>resumo do giro</span>
            <strong>${escapeHtml(roundSummary)}</strong>
            <p>O ponto vai para quem fechar acima do rival no mesmo numero sorteado.</p>
          </article>
          <article>
            <span>${escapeHtml(rivalHiddenLabel)}</span>
            <strong>${escapeHtml(String(roulette.botReturn))}</strong>
            <p>Antes do giro, o rival so prepara a propria cobertura. Depois do giro, o retorno dele aparece aqui.</p>
          </article>
          <article>
            <span>suas fichas</span>
            <div class="pubpaid-roulette-bets-list">${playerBetsMarkup}</div>
          </article>
          <article>
            <span>rival na mesa</span>
            <div class="pubpaid-roulette-bets-list">${rivalBetsMarkup}</div>
          </article>
          <article>
            <span>ultimos giros</span>
            <div class="pubpaid-roulette-history">${historyMarkup}</div>
          </article>
          <div class="pubpaid-card-actions">
            ${
              roulette.phase === "betting"
                ? '<button class="pubpaid-card-button" type="button" data-roulette-spin>Fechar apostas e girar</button><button class="pubpaid-card-button" type="button" data-roulette-clear>Limpar mesa</button>'
                : roulette.phase === "spinning"
                  ? '<button class="pubpaid-card-button" type="button" data-roulette-spin disabled>Girando a roleta...</button>'
                  : roulette.round < roulette.maxRounds
                    ? '<button class="pubpaid-card-button" type="button" data-roulette-next>Nova rodada</button>'
                    : '<button class="pubpaid-card-button" type="button" data-rematch-game>Outra série</button>'
            }
            <button class="pubpaid-card-button" type="button" data-abandon-game>Sair da mesa</button>
          </div>
        </section>
      </div>
    `;
  }

  function renderRouletteWheelMarkup(roulette) {
    const slotDeg = 360 / ROULETTE_WHEEL_ORDER.length;
    const wheelAngle = roulette.phase === "spinning" ? roulette.spinStartWheelRotation : roulette.wheelRotation;
    const ballAngle = roulette.phase === "spinning" ? roulette.spinStartBallRotation : roulette.ballRotation;
    const scoreNumber = roulette.resultNumber === null ? "?" : String(roulette.resultNumber);
    const scoreTone = roulette.resultNumber === null ? "unknown" : getRouletteColor(roulette.resultNumber);
    const slots = ROULETTE_WHEEL_ORDER.map((number, index) => {
      const angle = index * slotDeg;
      return `
        <div class="pubpaid-roulette-slot is-${escapeHtml(getRouletteColor(number))}" style="transform: rotate(${angle}deg)">
          <span>${escapeHtml(String(number))}</span>
        </div>
      `;
    }).join("");

    return `
      <div class="pubpaid-roulette-wheel">
        <div class="pubpaid-roulette-score is-${escapeHtml(scoreTone)}">
          <span>resultado</span>
          <strong>${escapeHtml(scoreNumber)}</strong>
        </div>
        <div class="pubpaid-roulette-top-pointer"></div>
        <div class="pubpaid-roulette-ball-track" data-roulette-ball-track style="transform: rotate(${escapeHtml(String(ballAngle))}deg)">
          <div class="pubpaid-roulette-ball"></div>
        </div>
        <div class="pubpaid-roulette-ring${roulette.phase === "spinning" ? " is-spinning" : ""}" data-roulette-ring style="transform: rotate(${escapeHtml(String(wheelAngle))}deg)">
          ${slots}
          <div class="pubpaid-roulette-hub">
            <span>${escapeHtml(roulette.phase === "spinning" ? "girando" : "mesa viva")}</span>
          </div>
        </div>
      </div>
    `;
  }

  function renderRouletteBettingTable(roulette) {
    const zeroAmount = getRouletteBetAmount(roulette.playerBets, { kind: "number", value: 0 });
    const rows = ROULETTE_NUMBERS_GRID
      .map((row, rowIndex) => {
        const columnValue = 3 - rowIndex;
        const cells = row.map((number) => renderRouletteBetCell({ kind: "number", value: number }, String(number), getRouletteColor(number)));
        cells.push(renderRouletteBetCell({ kind: "column", value: columnValue }, "2:1"));
        return cells.join("");
      })
      .join("");

    return `
      <div class="pubpaid-roulette-grid">
        <button class="pubpaid-roulette-bet pubpaid-roulette-bet-zero" type="button" data-roulette-bet="number-0">
          <span>0</span>
          ${zeroAmount ? `<small>${escapeHtml(String(zeroAmount))}</small>` : ""}
        </button>
        ${rows}
        <div class="pubpaid-roulette-bet-spacer"></div>
        ${renderRouletteBetWideCell({ kind: "dozen", value: 1 }, "1st 12")}
        ${renderRouletteBetWideCell({ kind: "dozen", value: 2 }, "2nd 12")}
        ${renderRouletteBetWideCell({ kind: "dozen", value: 3 }, "3rd 12")}
        <div class="pubpaid-roulette-bet-spacer"></div>
        <div class="pubpaid-roulette-bet-spacer"></div>
        ${renderRouletteBetWideCell({ kind: "range", value: "low" }, "1-18")}
        ${renderRouletteBetWideCell({ kind: "parity", value: "even" }, "Even")}
        ${renderRouletteBetWideCell({ kind: "color", value: "red" }, "Red", "red")}
        ${renderRouletteBetWideCell({ kind: "color", value: "black" }, "Black", "black")}
        ${renderRouletteBetWideCell({ kind: "parity", value: "odd" }, "Odd")}
        ${renderRouletteBetWideCell({ kind: "range", value: "high" }, "19-36")}
        <div class="pubpaid-roulette-bet-spacer"></div>
      </div>
    `;
  }

  function renderRouletteBetCell(type, label, tone = "") {
    const amount = getRouletteBetAmount(runtime.activeGame?.tableState?.playerBets || [], type);
    const encoded = encodeRouletteBet(type);
    const toneClass = tone ? ` is-${tone}` : "";
    return `
      <button class="pubpaid-roulette-bet${toneClass}" type="button" data-roulette-bet="${escapeHtml(encoded)}">
        <span>${escapeHtml(label)}</span>
        ${amount ? `<small>${escapeHtml(String(amount))}</small>` : ""}
      </button>
    `;
  }

  function renderRouletteBetWideCell(type, label, tone = "") {
    const amount = getRouletteBetAmount(runtime.activeGame?.tableState?.playerBets || [], type);
    const encoded = encodeRouletteBet(type);
    const toneClass = tone ? ` is-${tone}` : "";
    return `
      <button class="pubpaid-roulette-bet pubpaid-roulette-bet-wide${toneClass}" type="button" data-roulette-bet="${escapeHtml(encoded)}">
        <span>${escapeHtml(label)}</span>
        ${amount ? `<small>${escapeHtml(String(amount))}</small>` : ""}
      </button>
    `;
  }

  function renderRouletteBetList(bets, emptyText) {
    if (!bets.length) {
      return `<p class="pubpaid-roulette-empty">${escapeHtml(emptyText)}</p>`;
    }

    return bets
      .map((bet) => `<span class="pubpaid-game-chip">${escapeHtml(getRouletteBetLabel(bet.type))} ${escapeHtml(String(bet.amount))}</span>`)
      .join("");
  }

  function handleRouletteChipSelect(value) {
    const game = runtime.activeGame;
    if (!game || game.id !== "roulette" || game.screen !== "playing") return;
    const roulette = game.tableState;
    if (roulette.phase !== "betting") return;
    if (!roulette.chipOptions.includes(value)) return;
    roulette.chipValue = value;
    renderGameModal();
  }

  function handleRouletteBetPlace(encodedBet) {
    const game = runtime.activeGame;
    if (!game || game.id !== "roulette" || game.screen !== "playing") return;
    const roulette = game.tableState;
    if (roulette.phase !== "betting") return;
    const type = decodeRouletteBet(encodedBet);
    if (!type) return;
    if (roulette.playerChipsLeft < roulette.chipValue) {
      roulette.message = "Suas fichas dessa rodada acabaram. Gire ou limpe a mesa.";
      renderGameModal();
      return;
    }

    addRouletteBet(roulette.playerBets, type, roulette.chipValue);
    roulette.playerChipsLeft -= roulette.chipValue;
    roulette.message = `${state.profile.name || "Voce"} cobriu ${getRouletteBetLabel(type)} com ${roulette.chipValue} fichas.`;
    renderGameModal();
  }

  function clearRouletteBets() {
    const game = runtime.activeGame;
    if (!game || game.id !== "roulette" || game.screen !== "playing") return;
    const roulette = game.tableState;
    if (roulette.phase !== "betting") return;
    roulette.playerBets = [];
    roulette.playerChipsLeft = roulette.bank;
    roulette.message = "Mesa limpa. Suas fichas da rodada voltaram para o saldo da mesa.";
    renderGameModal();
  }

  function handleRouletteSpin() {
    const game = runtime.activeGame;
    if (!game || game.id !== "roulette" || game.screen !== "playing") return;
    const roulette = game.tableState;
    if (roulette.phase !== "betting") return;
    if (!roulette.playerBets.length) {
      roulette.message = "Coloque pelo menos uma ficha na mesa antes de girar.";
      renderGameModal();
      return;
    }

    roulette.botBets = buildRouletteBotBets(roulette.bank);
    roulette.phase = "spinning";
    roulette.playerReturn = 0;
    roulette.botReturn = 0;
    roulette.message = "A operadora soltou a bola. Agora o mesmo giro vai decidir voce e o rival.";
    roulette.resultLine = `${game.opponent.name} ja cobriu a propria mesa em segredo e aguarda o numero final.`;

    const winningNumber = rollRouletteResultNumber(game.fortune);
    roulette.pendingResultNumber = winningNumber;
    roulette.resultNumber = null;
    const targetIndex = ROULETTE_WHEEL_ORDER.indexOf(winningNumber);
    const slotDeg = 360 / ROULETTE_WHEEL_ORDER.length;
    const targetWheelDeg = -(targetIndex * slotDeg);
    roulette.spinStartWheelRotation = roulette.wheelRotation;
    roulette.spinStartBallRotation = roulette.ballRotation;
    const wheelBase = roulette.wheelRotation + 10 * 360;
    const currentMod = ((wheelBase % 360) + 360) % 360;
    const targetMod = ((targetWheelDeg % 360) + 360) % 360;
    let delta = targetMod - currentMod;
    if (delta < 0) delta += 360;
    roulette.wheelRotation = wheelBase + delta;
    roulette.ballRotation -= 15 * 360 + Math.round(Math.random() * 60);

    renderGameModal();
    kickoffRouletteSpinAnimation(roulette);

    runtime.gameTimer = window.setTimeout(() => {
      const activeGame = runtime.activeGame;
      if (!activeGame || activeGame.id !== "roulette" || activeGame.screen !== "playing") return;
      resolveRouletteRound();
    }, 7600);
  }

  function resolveRouletteRound() {
    const game = runtime.activeGame;
    if (!game || game.id !== "roulette" || game.screen !== "playing") return;
    const roulette = game.tableState;
    const winningNumber = roulette.pendingResultNumber;
    if (!Number.isInteger(winningNumber)) return;

    const winningColor = getRouletteColor(winningNumber);
    roulette.phase = "settled";
    roulette.resultNumber = winningNumber;
    roulette.pendingResultNumber = null;
    roulette.playerReturn = calculateRouletteReturn(roulette.playerBets, winningNumber);
    roulette.botReturn = calculateRouletteReturn(roulette.botBets, winningNumber);
    roulette.history = [winningNumber, ...roulette.history].slice(0, 8);

    if (roulette.playerReturn > roulette.botReturn) {
      roulette.playerRounds += 1;
      roulette.message = `${state.profile.name || "Voce"} fechou retorno maior no ${winningNumber} ${winningColor} e levou o round.`;
      roulette.resultLine = `${state.profile.name || "Voce"}: ${roulette.playerReturn} | ${game.opponent.name}: ${roulette.botReturn}.`;
    } else if (roulette.botReturn > roulette.playerReturn) {
      roulette.botRounds += 1;
      roulette.message = `${game.opponent.name} fechou retorno maior no ${winningNumber} ${winningColor} e levou o round.`;
      roulette.resultLine = `${state.profile.name || "Voce"}: ${roulette.playerReturn} | ${game.opponent.name}: ${roulette.botReturn}.`;
    } else {
      roulette.message = `O numero ${winningNumber} ${winningColor} empatou a mesa em ${roulette.playerReturn}.`;
      roulette.resultLine = `${state.profile.name || "Voce"} e ${game.opponent.name} fecharam o mesmo retorno.`;
    }

    renderGameModal();

    if (roulette.round >= roulette.maxRounds) {
      finalizeRouletteSeries();
    }
  }

  function finalizeRouletteSeries() {
    const game = runtime.activeGame;
    if (!game || game.id !== "roulette" || game.screen !== "playing") return;
    const roulette = game.tableState;

    if (roulette.playerRounds > roulette.botRounds) {
      game.payout = getMatchWinnerPayout(game.stake);
      finalizeGame("win", `${state.profile.name || "Voce"} venceu a série da roleta PvP por ${roulette.playerRounds} a ${roulette.botRounds}.`);
      return;
    }

    if (roulette.botRounds > roulette.playerRounds) {
      game.payout = 0;
      finalizeGame("loss", `${game.opponent.name} venceu a série da roleta PvP por ${roulette.botRounds} a ${roulette.playerRounds}.`);
      return;
    }

    game.payout = 0;
    finalizeGame("tie", `A série da roleta PvP empatou em ${roulette.playerRounds} a ${roulette.botRounds}.`);
  }

  function advanceRouletteRound() {
    const game = runtime.activeGame;
    if (!game || game.id !== "roulette" || game.screen !== "playing") return;
    const roulette = game.tableState;
    if (roulette.phase !== "settled" || roulette.round >= roulette.maxRounds) return;

    roulette.round += 1;
    roulette.phase = "betting";
    roulette.playerBets = [];
    roulette.botBets = [];
    roulette.playerChipsLeft = roulette.bank;
    roulette.resultNumber = null;
    roulette.pendingResultNumber = null;
    roulette.playerReturn = 0;
    roulette.botReturn = 0;
    roulette.message = `Nova rodada aberta. Redistribua seu saldo para tentar fechar a serie em ${roulette.playerRounds} x ${roulette.botRounds}.`;
    roulette.resultLine = `${roulette.maxRounds - roulette.round + 1} rodada(s) restante(s) para decidir a mesa.`;
    renderGameModal();
  }

  function kickoffRouletteSpinAnimation(roulette) {
    if (!refs.gameHost) return;
    const ring = refs.gameHost.querySelector("[data-roulette-ring]");
    const ballTrack = refs.gameHost.querySelector("[data-roulette-ball-track]");
    if (!ring || !ballTrack) return;

    window.requestAnimationFrame(() => {
      ring.style.transform = `rotate(${roulette.wheelRotation}deg)`;
      ballTrack.style.transform = `rotate(${roulette.ballRotation}deg)`;
    });
  }

  function addRouletteBet(bets, type, amount) {
    const key = getRouletteBetKey(type);
    const existing = bets.find((entry) => getRouletteBetKey(entry.type) === key);
    if (existing) {
      existing.amount += amount;
      return;
    }
    bets.push({ type, amount });
  }

  function getRouletteBetAmount(bets, type) {
    const key = getRouletteBetKey(type);
    const existing = bets.find((entry) => getRouletteBetKey(entry.type) === key);
    return existing ? existing.amount : 0;
  }

  function getRouletteBetKey(type) {
    return `${type.kind}-${type.value}`;
  }

  function encodeRouletteBet(type) {
    return getRouletteBetKey(type);
  }

  function decodeRouletteBet(value) {
    const [kind, raw] = String(value || "").split("-");
    if (!kind || raw === undefined) return null;
    if (kind === "number") return { kind, value: clampInteger(raw) };
    if (kind === "color" && (raw === "red" || raw === "black")) return { kind, value: raw };
    if (kind === "parity" && (raw === "even" || raw === "odd")) return { kind, value: raw };
    if (kind === "range" && (raw === "low" || raw === "high")) return { kind, value: raw };
    if (kind === "dozen") return { kind, value: clampInteger(raw) };
    if (kind === "column") return { kind, value: clampInteger(raw) };
    return null;
  }

  function getRouletteColor(number) {
    if (number === 0) return "green";
    return ROULETTE_RED_NUMBERS.has(number) ? "red" : "black";
  }

  function getRouletteBetLabel(type) {
    if (type.kind === "number") return `n${type.value}`;
    if (type.kind === "color") return type.value === "red" ? "vermelho" : "preto";
    if (type.kind === "parity") return type.value === "even" ? "par" : "impar";
    if (type.kind === "range") return type.value === "low" ? "1-18" : "19-36";
    if (type.kind === "dozen") return `${type.value}ª duzia`;
    if (type.kind === "column") return `coluna ${type.value}`;
    return "aposta";
  }

  function getRoulettePayoutMultiplier(type) {
    if (type.kind === "number") return 35;
    if (type.kind === "dozen" || type.kind === "column") return 2;
    return 1;
  }

  function rouletteBetWins(type, number) {
    if (number === 0) return type.kind === "number" && type.value === 0;
    if (type.kind === "number") return type.value === number;
    if (type.kind === "color") return getRouletteColor(number) === type.value;
    if (type.kind === "parity") return type.value === "even" ? number % 2 === 0 : number % 2 === 1;
    if (type.kind === "range") return type.value === "low" ? number >= 1 && number <= 18 : number >= 19 && number <= 36;
    if (type.kind === "dozen") return number >= (type.value - 1) * 12 + 1 && number <= type.value * 12;
    if (type.kind === "column") return number % 3 === (type.value === 3 ? 0 : type.value);
    return false;
  }

  function calculateRouletteReturn(bets, winningNumber) {
    let total = 0;
    bets.forEach((bet) => {
      if (rouletteBetWins(bet.type, winningNumber)) {
        total += bet.amount + bet.amount * getRoulettePayoutMultiplier(bet.type);
      }
    });
    return total;
  }

  function buildRouletteBotBets(bank) {
    const picks = [
      { kind: "color", value: Math.random() > 0.5 ? "red" : "black" },
      { kind: "parity", value: Math.random() > 0.5 ? "even" : "odd" },
      { kind: "range", value: Math.random() > 0.5 ? "low" : "high" },
      { kind: "dozen", value: 1 + Math.floor(Math.random() * 3) },
      { kind: "column", value: 1 + Math.floor(Math.random() * 3) },
      { kind: "number", value: Math.floor(Math.random() * 37) }
    ];
    const shuffled = picks.sort(() => Math.random() - 0.5);
    const chipSequence = [10, 5, 5, 2, 2, 1, 1];
    const bets = [];
    let remaining = bank;

    shuffled.forEach((type, index) => {
      if (remaining <= 0) return;
      const amount = Math.min(remaining, chipSequence[index] || 1);
      addRouletteBet(bets, type, amount);
      remaining -= amount;
    });

    while (remaining > 0) {
      const amount = Math.min(remaining, 1 + Math.floor(Math.random() * 2));
      const number = Math.floor(Math.random() * 37);
      addRouletteBet(bets, { kind: "number", value: number }, amount);
      remaining -= amount;
    }

    return bets;
  }

  function rollRouletteResultNumber(fortune) {
    const base = Math.floor(Math.random() * 37);
    if (!fortune || fortune.mood === "neutral") return base;
    if (fortune.mood === "good") {
      const weighted = [base, base, Math.floor(Math.random() * 19), Math.floor(Math.random() * 37)];
      return weighted[Math.floor(Math.random() * weighted.length)];
    }
    if (fortune.mood === "bad") {
      return Math.floor(Math.random() * 37);
    }
    return base;
  }

  function clearGameTimer() {
    if (runtime.gameTimer) {
      window.clearTimeout(runtime.gameTimer);
      runtime.gameTimer = null;
    }
  }

  function clearPvpPoll() {
    if (runtime.pvpPollTimer) {
      window.clearTimeout(runtime.pvpPollTimer);
      runtime.pvpPollTimer = 0;
    }
  }

  function resetDemo() {
    stopMusic();
    clearGameTimer();
    const fullscreenExit = document.exitFullscreen?.();
    if (fullscreenExit?.catch) fullscreenExit.catch(() => {});
    window.localStorage.removeItem(STORAGE_KEY);
    state = createInitialState();
    runtime.activeGame = null;
    runtime.profileEntryMode = false;
    runtime.demoMode = false;
    runtime.gameMode = false;
    runtime.nightPanelOpen = false;
    refs.gameModal.hidden = true;
    if (refs.shopModal) refs.shopModal.hidden = true;
    if (refs.waiterModal) refs.waiterModal.hidden = true;
    if (refs.jukeboxModal) refs.jukeboxModal.hidden = true;
    if (refs.tutorialModal) refs.tutorialModal.hidden = true;
    refs.profileModal.hidden = true;
    clearPressedDirections();
    clearPoolRefs();
    resetScenePosition();
    renderAll();
    setWorldMessage("A ficha, o saldo e o historico voltaram ao zero.", 2600);
  }

  function normalizeArchetype(value) {
    const key = String(value || "").trim();
    return PALETTES[key] ? key : "neon";
  }

  function normalizeGameId(value) {
    const key = String(value || "").trim();
    return TABLE_META[key] ? key : "pool";
  }

  function clampMoney(value) {
    const amount = clampInteger(value);
    const normalized = DEMO_STAKES.find((stake) => stake === amount);
    return normalized || DEMO_STAKES[0];
  }

  function getSuitMeta(suit = "") {
    const map = {
      hearts: { glyph: "♥", label: "copas", red: true },
      diamonds: { glyph: "♦", label: "ouros", red: true },
      clubs: { glyph: "♣", label: "paus", red: false },
      spades: { glyph: "♠", label: "espadas", red: false }
    };
    return map[suit] || { glyph: "♠", label: "espadas", red: false };
  }

  function normalizeDisplayCard(cardLike) {
    if (cardLike && typeof cardLike === "object" && "rank" in cardLike) {
      return {
        rank: clampInteger(cardLike.rank) || 14,
        suit: String(cardLike.suit || "spades")
      };
    }
    const numeric = clampInteger(cardLike);
    const suitCycle = ["hearts", "diamonds", "clubs", "spades"];
    return {
      rank: numeric === 11 ? 14 : Math.max(2, Math.min(10, numeric || 10)),
      suit: suitCycle[Math.abs(numeric || 0) % suitCycle.length]
    };
  }

  function renderPlayingCard(cardLike, options = {}) {
    const { hidden = false, held = false, interactive = false, dataAttr = "", note = "" } = options;
    const tag = interactive ? "button" : "span";
    const attr = interactive ? `type="button" ${dataAttr}` : "";
    if (hidden) {
      return `
        <${tag} class="pubpaid-poker-card is-hidden" ${attr} ${interactive ? "" : ""}>
          <span class="pubpaid-card-back"></span>
        </${tag}>
      `;
    }

    const card = normalizeDisplayCard(cardLike);
    const rankLabel = getPokerRankLabel(card.rank);
    const suit = getSuitMeta(card.suit);
    return `
      <${tag} class="pubpaid-poker-card ${held ? "is-held" : ""} ${suit.red ? "is-red" : ""}" ${attr} ${interactive ? "" : ""}>
        <span class="pubpaid-card-corner">
          <b>${escapeHtml(rankLabel)}</b>
          <i>${escapeHtml(suit.glyph)}</i>
        </span>
        <strong class="pubpaid-card-center">${escapeHtml(suit.glyph)}</strong>
        <span class="pubpaid-card-corner is-bottom">
          <b>${escapeHtml(rankLabel)}</b>
          <i>${escapeHtml(suit.glyph)}</i>
        </span>
        ${note ? `<small class="pubpaid-card-note">${escapeHtml(note)}</small>` : ""}
      </${tag}>
    `;
  }

  function renderCardChip(value, hidden) {
    return renderPlayingCard(value, {
      hidden,
      note: hidden ? "" : `${clampInteger(typeof value === "object" ? value.value || value.rank : value)} pts`
    });
  }

  function getCardFace(value) {
    if (value === 11) return "A";
    if (value === 10) return "K";
    return String(value);
  }

  function getCardTone(value) {
    if (value === 11) return "ace";
    if (value === 10) return "face";
    return "draw";
  }

  function renderDieFace(value, label) {
    const normalized = Math.max(1, Math.min(6, clampInteger(value)));
    const active = getDiePipMap(normalized);
    return `
      <span class="pubpaid-die" aria-label="${escapeHtml(label)}">
        <span class="pubpaid-die-grid">
          ${Array.from({ length: 9 }, (_, index) => `<i class="${active.includes(index) ? "is-on" : ""}"></i>`).join("")}
        </span>
        <small>${escapeHtml(label)}</small>
      </span>
    `;
  }

  function getDiePipMap(value) {
    const maps = {
      1: [4],
      2: [0, 8],
      3: [0, 4, 8],
      4: [0, 2, 6, 8],
      5: [0, 2, 4, 6, 8],
      6: [0, 2, 3, 5, 6, 8]
    };
    return maps[value] || maps[1];
  }

  function clampInteger(value) {
    const number = Number.parseInt(String(value || "0"), 10);
    return Number.isFinite(number) ? number : 0;
  }

  function randomBetween(min, max) {
    return min + Math.random() * (max - min);
  }

  function roundMoney(value) {
    const amount = Number(value);
    if (!Number.isFinite(amount)) return 0;
    return Math.round((amount + Number.EPSILON) * 100) / 100;
  }

  function parseMoneyInput(value, fallback = 0) {
    if (typeof value === "number" && Number.isFinite(value)) {
      return roundMoney(value);
    }
    const normalized = String(value || "")
      .replace(/[R$\s]/gi, "")
      .replace(/\./g, "")
      .replace(",", ".");
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? roundMoney(parsed) : fallback;
  }

  function formatCoins(value) {
    const amount = roundMoney(value);
    return `${amount.toLocaleString("pt-BR", {
      minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
      maximumFractionDigits: 2
    })} moedas`;
  }

  function formatDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  function setText(node, value) {
    if (!node) return;
    const text = String(value || "");
    if (node.textContent !== text) node.textContent = text;
  }

  function openTopMenu() {
    if (!refs.topMenu || !refs.topMenuToggle || !refs.topMenuPanel) return;
    refs.topMenu.classList.add("is-open");
    refs.topMenuToggle.setAttribute("aria-expanded", "true");
    refs.topMenuPanel.hidden = false;
  }

  function closeTopMenu() {
    if (!refs.topMenu || !refs.topMenuToggle || !refs.topMenuPanel) return;
    refs.topMenu.classList.remove("is-open");
    refs.topMenuToggle.setAttribute("aria-expanded", "false");
    refs.topMenuPanel.hidden = true;
  }

  function toggleTopMenu() {
    if (!refs.topMenu) return;
    if (refs.topMenu.classList.contains("is-open")) {
      closeTopMenu();
      return;
    }
    openTopMenu();
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  init();
})();
