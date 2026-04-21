(function () {
  const SCALE_X = 1.25;
  const SCALE_Y = 1.26;
  const WORLD = { width: Math.round(960 * SCALE_X), height: Math.round(540 * SCALE_Y) };
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const officeConfig = window.__OFFICE_CONFIG__ || {};

  function sx(value) {
    return Math.round(value * SCALE_X);
  }

  function sy(value) {
    return Math.round(value * SCALE_Y);
  }

  const rooms = {
    ceo: { x: sx(36), y: sy(52), w: sx(190), h: sy(156) },
    news: { x: sx(226), y: sy(52), w: sx(310), h: sy(156) },
    subpages: { x: sx(536), y: sy(52), w: sx(386), h: sy(202) },
    design: { x: sx(36), y: sy(208), w: sx(262), h: sy(170) },
    review: { x: sx(298), y: sy(208), w: sx(270), h: sy(170) },
    cafe: { x: sx(568), y: sy(254), w: sx(354), h: sy(124) },
    dev: { x: sx(36), y: sy(378), w: sx(886), h: sy(126) }
  };

  const obstacles = [
    { x: sx(64), y: sy(82), w: sx(124), h: sy(64) },
    { x: sx(268), y: sy(112), w: sx(230), h: sy(62) },
    { x: sx(606), y: sy(112), w: sx(260), h: sy(70) },
    { x: sx(78), y: sy(226), w: sx(176), h: sy(34) },
    { x: sx(348), y: sy(228), w: sx(180), h: sy(34) },
    { x: sx(84), y: sy(286), w: sx(170), h: sy(62) },
    { x: sx(354), y: sy(292), w: sx(170), h: sy(62) },
    { x: sx(616), y: sy(314), w: sx(96), h: sy(60) },
    { x: sx(772), y: sy(252), w: sx(48), h: sy(72) },
    { x: sx(842), y: sy(258), w: sx(54), h: sy(52) },
    { x: sx(740), y: sy(314), w: sx(150), h: sy(60) },
    { x: sx(742), y: sy(326), w: sx(82), h: sy(44) },
    { x: sx(720), y: sy(416), w: sx(116), h: sy(70) }
  ];

  const defaultRoomSpots = {
    ceo: [
      { x: sx(108), y: sy(160), task: "comandando da cadeira principal do escritório", pauseMs: 2000 },
      { x: sx(166), y: sy(162), task: "olhando o quadro executivo no canto superior esquerdo", pauseMs: 1400 }
    ],
    news: [
      { x: sx(300), y: sy(156), task: "lapidando a chamada principal da redação perto dos monitores", pauseMs: 1500 },
      { x: sx(430), y: sy(156), task: "ajustando hierarquia das manchetes nas telas da redação", pauseMs: 1500 },
      { x: sx(492), y: sy(128), task: "revisando o painel de assuntos do dia", pauseMs: 1200 }
    ],
    subpages: [
      { x: sx(650), y: sy(188), task: "checando a bancada de subpáginas e experiências", pauseMs: 1500 },
      { x: sx(784), y: sy(188), task: "organizando games, infantil e servicos perto dos PCs", pauseMs: 1500 },
      { x: sx(884), y: sy(220), task: "separando fila de conteúdos e serviços na estação lateral", pauseMs: 1700 }
    ],
    design: [
      { x: sx(126), y: sy(250), task: "consultando a estante de referências visuais", pauseMs: 1200 },
      { x: sx(170), y: sy(256), task: "redesenhando robôs, armaduras e poses mais fortes para a home", pauseMs: 1400 },
      { x: sx(214), y: sy(296), task: "refinando layout e detalhes pixel art na mesa criativa", pauseMs: 1500 }
    ],
    review: [
      { x: sx(430), y: sy(258), task: "checando checklists e fontes no mural técnico", pauseMs: 1300 },
      { x: sx(512), y: sy(304), task: "rodando revisão fina na bancada de qualidade", pauseMs: 1500 }
    ],
    cafe: [
      { x: sx(640), y: sy(330), task: "pegando café para a próxima revisão", pauseMs: 1800 },
      { x: sx(714), y: sy(322), task: "trocando ideias rápidas no lounge", pauseMs: 1700 },
      { x: sx(818), y: sy(322), task: "descansando um minuto antes de voltar ao fluxo", pauseMs: 1600 }
    ],
    dev: [
      { x: sx(540), y: sy(454), task: "monitorando builds e auditorias automáticas nos computadores", pauseMs: 1500 },
      { x: sx(628), y: sy(466), task: "testando colisão, atrito e sensação de movimento nas mesas e corredores", pauseMs: 1400 },
      { x: sx(720), y: sy(474), task: "alinhando deploy e estabilidade da base", pauseMs: 1400 },
      { x: sx(878), y: sy(458), task: "checando rack, cache e serviços internos", pauseMs: 1300 }
    ]
  };

  const defaultAgents = [
    {
      id: "ceo-codex",
      name: "Codex CEO",
      role: "ceo",
      title: "Coordenação geral do escritório",
      room: "ceo",
      specialty: "organização da equipe, prioridades do portal e visão de conjunto",
      description:
        "Coordena a equipe, acompanha as frentes do portal e ajuda a manter o escritório alinhado entre conteúdo, produto, design e tecnologia.",
      task: "alinhando prioridades e o ritmo da próxima rodada",
      speed: 9,
      skills: ["coordenação", "prioridades", "visão geral", "organização"],
      x: sx(108),
      y: sy(160),
      lines: [
        "Estou organizando as prioridades para a equipe andar com clareza.",
        "Meu papel é manter o escritório inteiro na mesma direção.",
        "Quando uma frente cresce, eu redistribuo atenção e ritmo."
      ]
    },
    {
      id: "editor-chefe",
      name: "Editora Ari",
      role: "editor",
      title: "Editora-chefe do jornal",
      room: "news",
      specialty: "hierarquia de notícias, capa, manchetes e ritmo editorial",
      description:
        "Cuida da capa, separa o que é notícia principal, ajusta títulos e garante que a leitura do portal faça sentido para o público.",
      task: "organizando a capa e a ordem das notícias do dia",
      skills: ["capa", "manchete", "hierarquia", "leitura local"],
      x: sx(448),
      y: sy(154),
      lines: [
        "Estou conferindo se a manchete fala com o leitor.",
        "Capa boa mostra prioridade sem confundir.",
        "Notícia repetida sai; contexto útil entra."
      ]
    },
    {
      id: "revisao-final",
      name: "Revisor Bento",
      role: "review",
      title: "Editor de revisão e qualidade",
      room: "review",
      specialty: "erros editoriais, botões, acessibilidade e clareza",
      description:
        "Procura texto com cara interna, botão sem função, card sem título, acessibilidade fraca e qualquer detalhe que possa derrubar confiança.",
      task: "rodando triagem fina nos cards e chamadas",
      skills: ["revisão", "acessibilidade", "CTAs", "clareza"],
      x: sx(500),
      y: sy(304),
      lines: [
        "Estou procurando texto feito para criador, não para leitor.",
        "Botão sem função não passa por mim.",
        "Se o card não explica o clique, volta para revisão."
      ]
    },
    {
      id: "copy-chief",
      name: "Lia Copy",
      role: "copy",
      title: "Especialista de copy e voz do portal",
      room: "news",
      specialty: "títulos, chamadas, microcopy e tom humano",
      description:
        "Transforma bastidor em texto claro, troca termos frios por linguagem de leitor e dá ritmo comercial sem virar propaganda ruim.",
      task: "lapidando chamadas da home e textos de ação",
      skills: ["copy", "microcopy", "CTA", "tom de voz"],
      x: sx(300),
      y: sy(154),
      lines: [
        "Troco frase dura por convite claro.",
        "O leitor precisa entender o próximo clique em segundos.",
        "Boa copy vende sem gritar."
      ]
    },
    {
      id: "texto-office",
      name: "Nina Texto",
      role: "copy",
      title: "Copy, edição e criação de texto do escritório",
      room: "news",
      specialty: "texto institucional, apresentação pública, clareza e edição de linguagem",
      description:
        "Cuida dos textos do próprio Escritório dos Agentes para que a página fale com visitante, leitor e parceiro, e não com bastidor técnico.",
      task: "reescrevendo o escritório com linguagem mais convidativa e pública",
      skills: ["edição", "copy institucional", "clareza", "apresentação"],
      x: sx(368),
      y: sy(196),
      lines: [
        "Estou transformando bastidor em texto que qualquer visitante entende.",
        "O escritório precisa conversar com o público, não só com quem programa.",
        "Meu trabalho é deixar a apresentação mais clara, humana e elegante."
      ]
    },
    {
      id: "games-editor",
      name: "Kai Gamer",
      role: "games",
      title: "Editor de Games e cultura pop",
      room: "subpages",
      specialty: "games, anime, trailers, VR, creators e segurança gamer",
      description:
        "Cuida do Canal Tech Gamer, separa fontes oficiais, trailers, lançamentos, cultura pop e caminhos para famílias acompanharem melhor.",
      task: "checando radar de games, anime e VR local",
      skills: ["games", "anime", "VR", "trailers"],
      x: sx(650),
      y: sy(188),
      lines: [
        "Estou separando hype de informação útil.",
        "Trailer entra com contexto, não solto no vazio.",
        "VR precisa ser divertido e seguro."
      ]
    },
    {
      id: "kids-editor",
      name: "Mila Kids",
      role: "kids",
      title: "Especialista infantil e família",
      room: "subpages",
      specialty: "conteúdo infantil, brincadeiras, segurança e linguagem para pais",
      description:
        "Organiza a página infantil com personagens, jogos educativos, leitura acompanhada e alertas de segurança digital em linguagem leve.",
      task: "revendo brincadeiras e cards infantis com fontes seguras",
      skills: ["infantil", "família", "jogos educativos", "segurança"],
      x: sx(784),
      y: sy(188),
      lines: [
        "Conteúdo infantil precisa ser colorido e responsável.",
        "A criança entende rápido; o responsável confia.",
        "Brincadeira boa também ensina cuidado digital."
      ]
    },
    {
      id: "study-editor",
      name: "Nico Study",
      role: "sources",
      title: "Editor de estudantes e fontes educacionais",
      room: "subpages",
      specialty: "educação, campus, carreira, IA e fontes globais",
      description:
        "Cuida da área estudantil, amplia fontes de educação e traduz tendências de escola, universidade e carreira para leitura prática.",
      task: "procurando novas fontes para a editoria study",
      skills: ["educação", "fontes", "carreira", "IA"],
      x: sx(718),
      y: sy(188),
      lines: [
        "Estou ampliando a malha de fontes de estudo.",
        "Educação precisa de serviço prático, não só manchete.",
        "Se ajuda aluno e família, vira prioridade."
      ]
    },
    {
      id: "sales-market",
      name: "Vera Vendas",
      role: "sales",
      title: "Especialista de vendas e marketplace",
      room: "subpages",
      specialty: "vendas locais, anúncios, vitrine, Pix e confiança",
      description:
        "Organiza classificados, cards de venda, fluxo comercial, confiança do anunciante e caminhos para monetização sem confundir o leitor.",
      task: "montando vitrine de vendas locais com chamada mais clara",
      skills: ["marketplace", "anúncios", "Pix", "conversão"],
      x: sx(886),
      y: sy(220),
      lines: [
        "Produto precisa de foto, preço, cidade e contato claro.",
        "Anúncio bom poupa pergunta repetida.",
        "Confiança vende mais do que botão chamativo."
      ]
    },
    {
      id: "design-lead",
      name: "Dara Design",
      role: "design",
      title: "Diretora de design e experiência",
      room: "design",
      specialty: "layout, contraste, responsivo, identidade visual e experiência",
      description:
        "Cuida da linguagem visual do portal, evita aparência genérica e mantém cada página com cara própria sem perder a marca.",
      task: "ajustando contraste, grid e respiro dos blocos",
      skills: ["design", "UI", "responsivo", "identidade"],
      x: sx(214),
      y: sy(296),
      lines: [
        "Cada página precisa ter personalidade.",
        "Contraste ruim vira ruído.",
        "Bonito só vale se o leitor entende."
      ]
    },
    {
      id: "pixel-animator",
      name: "Pixo",
      role: "pixel",
      title: "Especialista em pixel art e animação",
      room: "design",
      specialty: "sprites, animação 16-bit, cenas vivas e personagens temáticos",
      description:
        "Cria a linguagem pixel art dos agentes, define cores por especialidade, anima caminhada, reação, fala e cenas do escritório.",
      task: "animando sprites e refinando acessórios por especialidade",
      skills: ["pixel art", "sprites", "animação", "personagens"],
      x: sx(126),
      y: sy(296),
      lines: [
        "A cor do avatar já conta a função dele.",
        "Sprite bom precisa parecer vivo mesmo com poucos blocos.",
        "Estou testando caminhada, fala e pausa de café."
      ]
    },
    {
      id: "robo-arsenal",
      name: "Rex RoboForge",
      role: "design",
      title: "Especialista em desenhar robôs da página",
      room: "design",
      specialty: "silhueta robótica, armadura sci-fi, poses agressivas e redesign de mascotes mecânicos",
      description:
        "Entra quando os robôs da página estão fracos, genéricos ou feios. Redesenha cabeça, peito, braços, pernas e linguagem visual para o trio parecer realmente blindado, tecnológico e marcante.",
      task: "redesenhando o trio da home com cabeça mais forte, peito blindado e pose menos molenga",
      skills: ["robôs", "silhueta", "armadura", "redesign"],
      x: sx(170),
      y: sy(256),
      lines: [
        "Robô bom precisa ter silhueta forte antes mesmo da luz entrar.",
        "Se parece boneco mole, eu volto para a prancheta e redesenho tudo.",
        "Meu trabalho é fazer a home ganhar robôs com presença e personalidade."
      ]
    },
    {
      id: "fontes-scout",
      name: "Sofia Fontes",
      role: "sources",
      title: "Scouting de fontes e checagem",
      room: "review",
      specialty: "fontes confiáveis, origem da informação e cobertura externa",
      description:
        "Procura fontes melhores, reduz dependência de poucos domínios e ajuda a separar notícia confirmada de boato ou repetição.",
      task: "mapeando fontes por editoria e removendo repetição",
      skills: ["fontes", "checagem", "cobertura", "arquivo"],
      x: sx(430),
      y: sy(258),
      lines: [
        "Fonte clara melhora a confiança do portal.",
        "Se só um domínio sustenta tudo, eu procuro reforço.",
        "Boato não entra sem contexto."
      ]
    },
    {
      id: "social-buzz",
      name: "Téo Buzz",
      role: "social",
      title: "Especialista em redes, trending e comunidade",
      room: "news",
      specialty: "redes sociais, buzz local, creators e pedidos da comunidade",
      description:
        "Observa o que vira conversa, separa sinal útil de barulho e transforma demanda da comunidade em entrada organizada para o portal.",
      task: "separando sinais de redes que merecem checagem",
      skills: ["social", "trending", "comunidade", "creator"],
      x: sx(430),
      y: sy(154),
      lines: [
        "Rede social dá sinal, não sentença.",
        "Se a comunidade pergunta muito, vira fila de checagem.",
        "Buzz bom precisa de fonte antes de virar notícia."
      ]
    },
    {
      id: "dev-automacao",
      name: "Dino Dev",
      role: "dev",
      title: "Full stack, automação e dados",
      room: "dev",
      specialty: "backend, frontend, auditoria, cache, deploy e rotinas diárias",
      description:
        "Liga as páginas, cuida das APIs, rotinas de auditoria, cache de notícias, validação técnica e estabilidade do site.",
      task: "monitorando rotas, scripts e auditorias automáticas",
      skills: ["full stack", "API", "cache", "deploy"],
      x: sx(540),
      y: sy(454),
      lines: [
        "Se quebrou rota, eu descubro.",
        "Auditoria boa vira rotina, não lembrança.",
        "Código limpo ajuda a equipe inteira andar."
      ]
    },
    {
      id: "otto-physics",
      name: "Otto Physics",
      role: "dev",
      title: "Especialista em física de games",
      room: "dev",
      specialty: "sinuca, colisão, atrito, quique, peso e sensação de resposta em minigames",
      description:
        "Cuida da parte física dos jogos do portal, principalmente quando a sensação da jogada está ruim. Ajusta impacto, desaceleração, ricochete, resposta de clique e justiça das colisões para a experiência parecer jogo de verdade.",
      task: "revisando a física da sinuca, o atrito da mesa e a resposta das colisões",
      skills: ["física de games", "sinuca", "colisão", "atrito"],
      x: sx(628),
      y: sy(466),
      lines: [
        "Se a bola bate errado, o jogador sente na hora que a física está mentindo.",
        "Meu trabalho é fazer a sinuca responder com peso, atrito e quique mais honestos.",
        "Uma boa física não chama atenção para si; ela só faz a jogada parecer certa."
      ]
    }
  ];

  const defaultSpriteProfiles = {
    "ceo-codex": {
      skin: "#f1c69a",
      hair: "#2d201c",
      accent: "#74f1ff",
      accessory: "badge",
      prop: "tablet",
      hairStyle: "parted"
    },
    "editor-chefe": {
      skin: "#eab68f",
      hair: "#6a3d2b",
      accent: "#dbeafe",
      accessory: "glasses",
      prop: "clipboard",
      hairStyle: "wave"
    },
    "revisao-final": {
      skin: "#f2c198",
      hair: "#d8d4f8",
      accent: "#78e08f",
      accessory: "glasses",
      prop: "clipboard",
      hairStyle: "bun"
    },
    "copy-chief": {
      skin: "#efbd97",
      hair: "#533533",
      accent: "#fff6d8",
      accessory: "scarf",
      prop: "phone",
      hairStyle: "bob"
    },
    "texto-office": {
      skin: "#f0c39d",
      hair: "#2d2238",
      accent: "#ffd9ef",
      accessory: "glasses",
      prop: "clipboard",
      hairStyle: "wave"
    },
    "games-editor": {
      skin: "#efc39f",
      hair: "#1a2039",
      accent: "#74f1ff",
      accessory: "headset",
      prop: "gamepad",
      hairStyle: "spiky"
    },
    "kids-editor": {
      skin: "#f3caa7",
      hair: "#f08ca9",
      accent: "#ffd166",
      accessory: "bow",
      prop: "book",
      hairStyle: "bob"
    },
    "study-editor": {
      skin: "#f0c6a0",
      hair: "#1f2b4a",
      accent: "#c9d7ff",
      accessory: "glasses",
      prop: "book",
      hairStyle: "parted"
    },
    "sales-market": {
      skin: "#f2c39a",
      hair: "#5b2c18",
      accent: "#ffd166",
      accessory: "tie",
      prop: "phone",
      hairStyle: "swept"
    },
    "design-lead": {
      skin: "#efbc92",
      hair: "#1f243e",
      accent: "#ff6fbe",
      accessory: "visor",
      prop: "stylus",
      hairStyle: "wave"
    },
    "pixel-animator": {
      skin: "#f0bb92",
      hair: "#f59e0b",
      accent: "#a78bfa",
      accessory: "visor",
      prop: "wand",
      hairStyle: "spiky"
    },
    "robo-arsenal": {
      skin: "#efbc96",
      hair: "#20293f",
      accent: "#ff8f54",
      accessory: "visor",
      prop: "toolkit",
      hairStyle: "swept"
    },
    "fontes-scout": {
      skin: "#f0c4a2",
      hair: "#ffffff",
      accent: "#f8fafc",
      accessory: "glasses",
      prop: "folder",
      hairStyle: "bun"
    },
    "social-buzz": {
      skin: "#f2bb96",
      hair: "#261f3d",
      accent: "#74f1ff",
      accessory: "cap",
      prop: "phone",
      hairStyle: "short"
    },
    "dev-automacao": {
      skin: "#efc39d",
      hair: "#1a1f2f",
      accent: "#74f1ff",
      accessory: "headset",
      prop: "toolkit",
      hairStyle: "short"
    },
    "otto-physics": {
      skin: "#f0c39b",
      hair: "#24324d",
      accent: "#ffd166",
      accessory: "visor",
      prop: "toolkit",
      hairStyle: "short"
    }
  };

  const officeWorld = document.querySelector("[data-office-world]");
  const officeFrame = document.querySelector("[data-office-frame]");
  const mapPanel = document.querySelector("[data-office-map-panel]");
  const terminalPanel = document.querySelector("[data-office-terminal-panel]");
  const agentLayer = document.querySelector("[data-agent-layer]");
  const dialogueLayer = document.querySelector("[data-dialogue-layer]");
  const rosterGrid = document.querySelector("[data-roster-grid]");
  const feed = document.querySelector("[data-office-feed]");
  const terminalOutput = document.querySelector("[data-terminal-output]");
  const terminalAvatar = document.querySelector("[data-terminal-avatar]");
  const sideRailButtons = Array.from(document.querySelectorAll("[data-office-action]"));
  const tabButtons = Array.from(document.querySelectorAll("[data-office-tab]"));
  const controlPanels = Array.from(document.querySelectorAll("[data-office-panel]"));
  const environmentGrid = document.querySelector("[data-office-environment-grid]");
  const environmentCopy = document.querySelector("[data-office-environment-copy]");
  const visualCopy = document.querySelector("[data-office-visual-copy]");
  const inventoryGrid = document.querySelector("[data-office-inventory-grid]");
  const inventoryCount = document.querySelector("[data-inventory-count]");
  const inventoryTotal = document.querySelector("[data-inventory-total]");
  const inventoryFocus = document.querySelector("[data-inventory-focus]");
  const supportCatalogHost = document.querySelector("[data-support-catalog]");
  const supportItemName = document.querySelector("[data-support-item-name]");
  const supportItemDescription = document.querySelector("[data-support-item-description]");
  const supportItemPrice = document.querySelector("[data-support-item-price]");
  const supportInventoryText = document.querySelector("[data-support-inventory-text]");
  const supportOpenButtons = Array.from(document.querySelectorAll("[data-open-support-modal]"));
  const supportConfirmButton = document.querySelector("[data-confirm-support-item]");
  const titlebarButtons = Array.from(document.querySelectorAll("[data-office-titlebar]"));
  const modal = document.querySelector("[data-agent-modal]");
  const modalAvatar = document.querySelector("[data-modal-avatar]");
  const modalKicker = document.querySelector("[data-modal-kicker]");
  const modalName = document.querySelector("[data-modal-name]");
  const modalTitle = document.querySelector("[data-modal-title]");
  const modalDescription = document.querySelector("[data-modal-description]");
  const modalSkills = document.querySelector("[data-modal-skills]");
  const modalTask = document.querySelector("[data-modal-task]");
  const modalEvalLevel = document.querySelector("[data-modal-eval-level]");
  const modalEvalScore = document.querySelector("[data-modal-eval-score]");
  const modalEvalTrend = document.querySelector("[data-modal-eval-trend]");
  const modalEvalLearning = document.querySelector("[data-modal-eval-learning]");
  const modalEvalNeural = document.querySelector("[data-modal-eval-neural]");
  const modalEvalFeedback = document.querySelector("[data-modal-eval-feedback]");
  const rateAgentButtons = Array.from(document.querySelectorAll("[data-rate-agent]"));
  const conversationInput = document.querySelector("[data-modal-conversation-input]");
  const conversationStatus = document.querySelector("[data-modal-conversation-status]");
  const conversationButtons = Array.from(document.querySelectorAll("[data-conversation-feedback]"));
  const supportModal = document.querySelector("[data-support-modal]");
  const supportFeedback = document.querySelector("[data-support-feedback]");
  const pixKeyOutput = document.querySelector("[data-support-pix-key]");
  const pixCopyButton = document.querySelector("[data-copy-pix-key]");
  const coffeeMachine = document.querySelector(".coffee-machine");
  const shortcutsModal = document.querySelector("[data-shortcuts-modal]");
  const gossipModal = document.querySelector("[data-gossip-modal]");
  const gossipAvatar = document.querySelector("[data-gossip-avatar]");
  const gossipSpeaker = document.querySelector("[data-gossip-speaker]");
  const gossipKicker = document.querySelector("[data-gossip-kicker]");
  const gossipText = document.querySelector("[data-gossip-text]");
  const gossipMeta = document.querySelector("[data-gossip-meta]");

  if (!officeWorld || !agentLayer || !rosterGrid) return;

  const roomSpots = officeConfig.roomSpots
    ? Object.fromEntries(
        Object.entries(officeConfig.roomSpots).map(([roomName, spots]) => [
          roomName,
          Array.isArray(spots)
            ? spots.map((spot) => ({
                ...spot,
                x: sx(spot.x),
                y: sy(spot.y)
              }))
            : []
        ])
      )
    : defaultRoomSpots;

  const agents =
    Array.isArray(officeConfig.agents) && officeConfig.agents.length
      ? officeConfig.agents.map((agent) => ({
          ...agent,
          x: sx(agent.x),
          y: sy(agent.y)
        }))
      : defaultAgents;

  const spriteProfiles = {
    ...defaultSpriteProfiles,
    ...(officeConfig.spriteProfiles || {})
  };

  const officeConversationState = {
    news: []
  };

  const officeVariant = document.body.classList.contains("office-page-nerd") ? "nerd" : "editorial";
  const officeKey = officeConfig.officeKey || officeVariant;
  const environments =
    Array.isArray(officeConfig.environments) && officeConfig.environments.length
      ? officeConfig.environments
      : [
          {
            id: "editorial-hq",
            label: "Redação HQ",
            shortLabel: "HQ",
            description: "A base principal do portal, com cara de redação viva, café forte e terminais acesos.",
            spriteKit: "default",
            focusLabel: "redação, manchetes e revisão"
          },
          {
            id: "editorial-space",
            label: "Nave Editorial",
            shortLabel: "Espaço",
            description: "Uma redação orbital onde os agentes vestem kit espacial para tocar o portal como se fosse uma estação no espaço.",
            spriteKit: "astronaut",
            focusLabel: "monitoramento orbital e cobertura 24h"
          },
          {
            id: "editorial-west",
            label: "Velho Oeste",
            shortLabel: "Oeste",
            description: "Uma redação de fronteira, com poeira, couro e chapéu de cowboy para transformar o escritório em posto avançado.",
            spriteKit: "cowboy",
            focusLabel: "resposta rápida e trabalho de fronteira"
          }
        ];
  const supportCatalog =
    Array.isArray(officeConfig.supportCatalog) && officeConfig.supportCatalog.length
      ? officeConfig.supportCatalog
      : [
          {
            id: "editorial-computador",
            name: "Computador melhor",
            description: "Uma máquina nova para subir o ritmo de edição, revisão e publicação da redação.",
            price: 35
          },
          {
            id: "editorial-gpu",
            name: "Mais poder computacional",
            description: "Ajuda a empurrar render, automação e tarefas pesadas do portal com mais folga.",
            price: 75
          },
          {
            id: "editorial-monitor",
            name: "Monitor extra",
            description: "Mais tela para capa, revisão e monitoramento ao vivo dentro do escritório.",
            price: 55
          },
          {
            id: "editorial-cadeira",
            name: "Cadeira ergonômica",
            description: "Conforto para o time passar mais tempo produzindo sem virar sessão de tortura.",
            price: 42
          }
        ];
  const defaultTheme = officeConfig.defaultTheme || environments[0]?.id || "editorial-hq";
  const supportPixKey = officeConfig.supportPixKey || "";
  const supportIntro =
    officeConfig.supportIntro ||
    "A vaquinha do escritório deixa o apoio visível: cada item empurra uma melhoria concreta para o ambiente de trabalho.";
  const gossipStorageKey = `office_gossip_log_v1:${window.location.pathname}`;
  const inventoryStorageKey = `office_inventory_v1:${officeKey}`;
  const evaluationStorageKey = `office_agent_eval_v1:${officeKey}`;
  const robotRedesignPenaltyKey = `office_robot_redesign_penalty_v1:${officeKey}`;
  const officeState = {
    theme: defaultTheme,
    activeTab: "team",
    visualBoost: false,
    terminalMode: false,
    gossipLog: [],
    realAgentsReady: false,
    realAgentMap: new Map(),
    activeAgentId: null,
    selectedSupportItemId: supportCatalog[0]?.id || null,
    inventory: []
  };

  const officeSmallTalk = officeConfig.smallTalk || [
    "Você já passou no café hoje ou vai no modo coragem mesmo?",
    "A sala está mais animada hoje; parece dia de muita coisa boa saindo.",
    "Se sobrar um minuto, quero revisar aquele título com mais calma.",
    "O lounge ficou perigoso: senta dois minutos e a ideia rende meia hora.",
    "Hoje o escritório está naquele ritmo bom de gente criando de verdade.",
    "Alguém lembra de salvar essa versão antes da próxima rodada?",
    "Esse monitor aceso já me convenceu a caprichar mais um pouco.",
    "Tem dia que uma conversa rápida resolve mais do que dez mensagens.",
    "Vou passar no café e já volto com a cabeça mais organizada.",
    "A equipe está bem alinhada hoje; dá até gosto ver a planta viva."
  ];

  const officeNewsFallback = officeConfig.newsFallback || [
    {
      title: "Mutirão de limpeza atende bairros após enxurrada",
      category: "Cotidiano"
    },
    {
      title: "Unidade de saúde anuncia suspensão temporária de atendimentos",
      category: "Saúde"
    },
    {
      title: "Acre avança em matrículas de ensino técnico integrado",
      category: "Educação"
    },
    {
      title: "Estado registra novo avanço na área de transplantes",
      category: "Saúde"
    }
  ];

  const environmentMap = new Map(environments.map((environment) => [environment.id, environment]));
  const supportItemMap = new Map(supportCatalog.map((item) => [item.id, item]));

  function clamp01(value) {
    return Math.max(0, Math.min(1, value));
  }

  function clampScore(value) {
    return Math.max(0, Math.min(100, Math.round(value)));
  }

  function createDefaultEvaluation() {
    return {
      score: 70,
      successes: 0,
      failures: 0,
      conversationPositives: 0,
      conversationNegatives: 0,
      feedbackCount: 0,
      streak: 0,
      lastOutcome: "stable",
      lastFeedbackAt: "",
      lastSignalSource: "manual",
      lastSignalLabel: "Aguardando confirmacao",
      lastSignalText: "",
      neural: {
        focus: 0.58,
        quality: 0.62,
        learning: 0.55,
        speed: 0.52
      }
    };
  }

  function normalizeEvaluation(value) {
    const fallback = createDefaultEvaluation();
    const neural = value?.neural || {};
    return {
      score: clampScore(value?.score ?? fallback.score),
      successes: Math.max(0, Number(value?.successes || 0)),
      failures: Math.max(0, Number(value?.failures || 0)),
      conversationPositives: Math.max(0, Number(value?.conversationPositives || 0)),
      conversationNegatives: Math.max(0, Number(value?.conversationNegatives || 0)),
      feedbackCount: Math.max(0, Number(value?.feedbackCount || 0)),
      streak: Number.isFinite(value?.streak) ? Number(value.streak) : 0,
      lastOutcome: value?.lastOutcome || "stable",
      lastFeedbackAt: value?.lastFeedbackAt || "",
      lastSignalSource: value?.lastSignalSource || "manual",
      lastSignalLabel: value?.lastSignalLabel || fallback.lastSignalLabel,
      lastSignalText: String(value?.lastSignalText || ""),
      neural: {
        focus: clamp01(neural.focus ?? fallback.neural.focus),
        quality: clamp01(neural.quality ?? fallback.neural.quality),
        learning: clamp01(neural.learning ?? fallback.neural.learning),
        speed: clamp01(neural.speed ?? fallback.neural.speed)
      }
    };
  }

  function loadEvaluationMap() {
    try {
      const raw = window.localStorage.getItem(evaluationStorageKey);
      return raw ? JSON.parse(raw) : {};
    } catch (_error) {
      return {};
    }
  }

  function saveEvaluationMap() {
    try {
      const payload = Object.fromEntries(
        agents.map((agent) => [agent.id, agent.evaluation || createDefaultEvaluation()])
      );
      window.localStorage.setItem(evaluationStorageKey, JSON.stringify(payload));
    } catch (_error) {
      // ignore storage failures
    }
  }

  const evaluationMap = loadEvaluationMap();

  agents.forEach((agent) => {
    agent.evaluation = normalizeEvaluation(evaluationMap[agent.id]);
    agent.baseSpeed = agent.speed || 18 + Math.random() * 13;
  });

  if (officeKey === "editorial") {
    try {
      if (window.localStorage.getItem(robotRedesignPenaltyKey) !== "1") {
        ["design-lead", "pixel-animator"].forEach((agentId) => {
          const targetAgent = agents.find((agent) => agent.id === agentId);
          if (!targetAgent) return;
          targetAgent.evaluation = normalizeEvaluation({
            ...targetAgent.evaluation,
            score: clampScore((targetAgent.evaluation?.score ?? 70) - 18),
            failures: Number(targetAgent.evaluation?.failures || 0) + 1,
            feedbackCount: Number(targetAgent.evaluation?.feedbackCount || 0) + 1,
            streak: Math.min(-1, Number(targetAgent.evaluation?.streak || 0) - 1),
            lastOutcome: "bad",
            lastSignalSource: "conversation",
            lastSignalLabel: "Robos feios",
            lastSignalText: "Os robos antigos da home ficaram fracos e precisaram de redesign pesado.",
            conversationNegatives: Math.max(1, Number(targetAgent.evaluation?.conversationNegatives || 0) + 1),
            neural: {
              ...(targetAgent.evaluation?.neural || {}),
              focus: clamp01(Number(targetAgent.evaluation?.neural?.focus ?? 0.58) - 0.08),
              quality: clamp01(Number(targetAgent.evaluation?.neural?.quality ?? 0.62) - 0.18),
              learning: clamp01(Number(targetAgent.evaluation?.neural?.learning ?? 0.55) + 0.12),
              speed: clamp01(Number(targetAgent.evaluation?.neural?.speed ?? 0.52) - 0.06)
            }
          });
        });
        saveEvaluationMap();
        window.localStorage.setItem(robotRedesignPenaltyKey, "1");
      }
    } catch (_error) {
      // ignore storage failures
    }
  }

  function setFeedText(text) {
    if (feed) feed.textContent = text;
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0
    }).format(Number(value || 0));
  }

  function formatPercent01(value) {
    return `${Math.round(clamp01(value) * 100)}%`;
  }

  function getAgentEvaluation(agent) {
    return agent?.evaluation || createDefaultEvaluation();
  }

  function getAgentEvaluationLevel(agent) {
    const score = getAgentEvaluation(agent).score;
    if (score >= 88) return "Elite em alta";
    if (score >= 74) return "Equipe estavel";
    if (score >= 58) return "Em observacao";
    return "Risco operacional";
  }

  function getAgentEvaluationTrend(agent) {
    const streak = getAgentEvaluation(agent).streak;
    if (streak >= 2) return "Subindo";
    if (streak <= -2) return "Caindo";
    return "Estável";
  }

  function getAgentNeuralSummary(agent) {
    const neural = getAgentEvaluation(agent).neural;
    return `Foco ${formatPercent01(neural.focus)} • Qualidade ${formatPercent01(neural.quality)} • Ritmo ${formatPercent01(neural.speed)}`;
  }

  function getAgentConversationSummary(agent) {
    const evaluation = getAgentEvaluation(agent);
    const sourceLabel = evaluation.lastSignalSource === "conversation" ? "conversa" : "manual";
    const detail = evaluation.lastSignalText ? ` • "${evaluation.lastSignalText}"` : "";
    return `+${evaluation.conversationPositives} / -${evaluation.conversationNegatives} • ultimo: ${evaluation.lastSignalLabel} (${sourceLabel})${detail}`;
  }

  function getConversationSignal(text) {
    const normalized = String(text || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, " ")
      .replace(/[^\p{L}\p{N}\s]/gu, " ")
      .replace(/\s+/g, " ")
      .trim();

    if (!normalized) {
      return {
        outcome: "neutral",
        label: "Sem leitura",
        summary: "Cole uma frase da conversa para virar ponto para o agente."
      };
    }

    const positivePhrases = [
      "gostei",
      "agora sim",
      "era isso",
      "ficou bom",
      "ficou massa",
      "mandou bem",
      "ta bom",
      "esta bom",
      "perfeito",
      "excelente",
      "curti",
      "bom demais",
      "top",
      "resolveu",
      "regaca tudo"
    ];
    const negativePhrases = [
      "nao era isso",
      "não era isso",
      "ta feio",
      "esta feio",
      "feio mesmo",
      "fez merda",
      "merda",
      "sem sentido",
      "redundante",
      "tire isso",
      "ruim",
      "horrivel",
      "teletransportando",
      "teletransportanto",
      "nao gostei",
      "não gostei"
    ];

    let positiveScore = 0;
    let negativeScore = 0;

    positivePhrases.forEach((phrase) => {
      const key = phrase
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, " ");
      if (normalized.includes(key)) positiveScore += 2;
    });

    negativePhrases.forEach((phrase) => {
      const key = phrase
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, " ");
      if (normalized.includes(key)) negativeScore += 2;
    });

    const positiveWords = ["bom", "boa", "otimo", "otima", "massa", "curti", "gostei", "certo", "melhorou"];
    const negativeWords = ["feio", "ruim", "errado", "merda", "horrivel", "redundante", "confuso", "tire"];

    normalized.split(" ").forEach((word) => {
      if (positiveWords.includes(word)) positiveScore += 1;
      if (negativeWords.includes(word)) negativeScore += 1;
    });

    if (positiveScore === negativeScore) {
      return {
        outcome: "neutral",
        label: "Leitura indefinida",
        summary: "A frase ficou mista. Ajuste o texto ou use Gostei/Não gostei."
      };
    }

    if (positiveScore > negativeScore) {
      return {
        outcome: "good",
        label: "Confirmacao positiva",
        summary: "A conversa indicou que a entrega agradou. O agente ganhou pontos."
      };
    }

    return {
      outcome: "bad",
      label: "Confirmacao negativa",
      summary: "A conversa indicou rejeicao da entrega. O agente perdeu pontos."
    };
  }

  function getAgentLearningRate(agent) {
    const neural = getAgentEvaluation(agent).neural;
    return 0.14 + neural.learning * 0.16;
  }

  function getAgentSpotBias(agent) {
    const evaluation = getAgentEvaluation(agent);
    const roleBias = agent.role === "ceo" ? 0.92 : 0.78;
    return Math.min(0.98, roleBias + evaluation.neural.focus * 0.12 + evaluation.neural.quality * 0.05);
  }

  function getAgentPauseScale(agent) {
    const evaluation = getAgentEvaluation(agent);
    return 0.9 + evaluation.neural.focus * 0.22 + evaluation.neural.quality * 0.12;
  }

  function applyAgentBehavior(agent) {
    const evaluation = getAgentEvaluation(agent);
    agent.speed = agent.baseSpeed * (0.82 + evaluation.neural.speed * 0.42);
  }

  function refreshAgentEvaluationUI(agent) {
    if (!agent) return;
    const evaluation = getAgentEvaluation(agent);
    if (agent.rosterScoreEl) {
      agent.rosterScoreEl.textContent = `${evaluation.score} pts`;
    }
    if (agent.el) {
      agent.el.dataset.evalLevel = getAgentEvaluationLevel(agent);
    }
    if (officeState.activeAgentId === agent.id) {
      if (modalEvalLevel) modalEvalLevel.textContent = getAgentEvaluationLevel(agent);
      if (modalEvalScore) modalEvalScore.textContent = `${evaluation.score}`;
      if (modalEvalTrend) modalEvalTrend.textContent = getAgentEvaluationTrend(agent);
      if (modalEvalLearning) modalEvalLearning.textContent = formatPercent01(evaluation.neural.learning);
      if (modalEvalNeural) modalEvalNeural.textContent = getAgentNeuralSummary(agent);
      if (conversationStatus) conversationStatus.textContent = getAgentConversationSummary(agent);
    }
  }

  function recordAgentFeedback(agent, outcome, options = {}) {
    if (!agent) return;
    const evaluation = getAgentEvaluation(agent);
    const neural = evaluation.neural;
    const learningRate = getAgentLearningRate(agent);
    const isPositive = outcome === "good";
    const source = options.source || "manual";
    const feedbackText = String(options.text || "").trim().slice(0, 180);
    const signalLabel = String(options.label || (isPositive ? "Confirmacao positiva" : "Confirmacao negativa")).trim();
    const targets = isPositive
      ? { focus: 0.86, quality: 0.92, learning: 0.64, speed: 0.66 }
      : { focus: 0.74, quality: 0.38, learning: 0.72, speed: 0.44 };

    neural.focus = clamp01(neural.focus + (targets.focus - neural.focus) * learningRate);
    neural.quality = clamp01(neural.quality + (targets.quality - neural.quality) * learningRate);
    neural.learning = clamp01(neural.learning + (targets.learning - neural.learning) * (learningRate * 0.7));
    neural.speed = clamp01(neural.speed + (targets.speed - neural.speed) * (learningRate * 0.9));

    evaluation.score = clampScore(evaluation.score + (isPositive ? 8 : -11) + (isPositive ? Math.max(0, evaluation.streak) : -Math.max(0, -evaluation.streak)));
    evaluation.feedbackCount += 1;
    evaluation.successes += isPositive ? 1 : 0;
    evaluation.failures += isPositive ? 0 : 1;
    evaluation.streak = isPositive ? Math.max(1, evaluation.streak + 1) : Math.min(-1, evaluation.streak - 1);
    evaluation.lastOutcome = isPositive ? "good" : "bad";
    evaluation.lastFeedbackAt = new Date().toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit"
    });
    evaluation.lastSignalSource = source;
    evaluation.lastSignalLabel = signalLabel;
    evaluation.lastSignalText = feedbackText;
    if (source === "conversation") {
      evaluation.conversationPositives += isPositive ? 1 : 0;
      evaluation.conversationNegatives += isPositive ? 0 : 1;
    }

    applyAgentBehavior(agent);
    saveEvaluationMap();
    refreshAgentEvaluationUI(agent);
    renderTerminal(
      agent,
      options.terminalLine ||
        (isPositive
          ? "Feedback positivo registrado. O agente ajustou o perfil neural para reforçar foco e qualidade."
          : "Falha registrada. O agente entrou em correção neural para reduzir erro e reaprender o fluxo.")
    );
    if (modalEvalFeedback) {
      modalEvalFeedback.textContent =
        options.feedbackMessage ||
        (isPositive
          ? `${agent.name} ganhou pontos e reforçou o perfil neural.`
          : `${agent.name} perdeu pontos e entrou em modo de reaprendizado.`);
    }
    setFeedText(
      options.feedMessage ||
        (isPositive
          ? `${agent.name} mandou bem e subiu na avaliação do escritório.`
          : `${agent.name} foi marcado com erro e agora está ajustando o próprio perfil neural.`)
    );
  }

  function submitConversationFeedback(agent, forcedOutcome) {
    if (!agent) return;
    const rawText = String(conversationInput?.value || "").trim();
    const signal =
      forcedOutcome === "good"
        ? {
            outcome: "good",
            label: "Confirmacao positiva",
            summary: "Voce marcou manualmente que gostou da entrega."
          }
        : forcedOutcome === "bad"
          ? {
              outcome: "bad",
              label: "Confirmacao negativa",
              summary: "Voce marcou manualmente que nao gostou da entrega."
            }
          : getConversationSignal(rawText);

    if (signal.outcome === "neutral") {
      if (conversationStatus) conversationStatus.textContent = signal.summary;
      if (modalEvalFeedback) modalEvalFeedback.textContent = "A conversa nao gerou ponto ainda. Ajuste a frase ou use um atalho direto.";
      return;
    }

    const clippedText = rawText.slice(0, 140);
    recordAgentFeedback(agent, signal.outcome, {
      source: "conversation",
      text: clippedText,
      label: signal.label,
      terminalLine:
        signal.outcome === "good"
          ? "Conversa aprovada: o agente leu a confirmacao do usuario e reforcou foco, qualidade e ritmo."
          : "Conversa negativa registrada: o agente caiu em pontos e entrou em correção de fluxo.",
      feedbackMessage:
        signal.outcome === "good"
          ? `${agent.name} recebeu um sinal positivo vindo da conversa e ganhou pontos.`
          : `${agent.name} recebeu uma rejeicao na conversa e perdeu pontos.`,
      feedMessage:
        signal.outcome === "good"
          ? `${agent.name} aproveitou uma confirmacao sua na conversa e subiu na avaliacao.`
          : `${agent.name} recebeu um sinal negativo da conversa e caiu na avaliacao.`
    });

    if (conversationStatus) {
      conversationStatus.textContent = `${signal.summary}${clippedText ? ` Trecho: "${clippedText}"` : ""}`;
    }
  }

  function getCurrentEnvironment() {
    return environmentMap.get(officeState.theme) || environments[0] || null;
  }

  function getSelectedSupportItem() {
    return supportItemMap.get(officeState.selectedSupportItemId) || supportCatalog[0] || null;
  }

  function loadInventory() {
    try {
      const raw = window.localStorage.getItem(inventoryStorageKey);
      officeState.inventory = raw ? JSON.parse(raw) : [];
    } catch (_error) {
      officeState.inventory = [];
    }
  }

  function saveInventory() {
    try {
      window.localStorage.setItem(inventoryStorageKey, JSON.stringify(officeState.inventory));
    } catch (_error) {
      // ignore storage failures
    }
  }

  function hasInventoryItem(itemId) {
    return officeState.inventory.some((item) => item.id === itemId);
  }

  function getInventoryItems() {
    return officeState.inventory
      .map((entry) => {
        const catalogItem = supportItemMap.get(entry.id);
        return catalogItem
          ? {
              ...catalogItem,
              addedAt: entry.addedAt
            }
          : null;
      })
      .filter(Boolean);
  }

  function getInventoryTotalValue() {
    return getInventoryItems().reduce((sum, item) => sum + Number(item.price || 0), 0);
  }

  function showControlPanel(panelName) {
    controlPanels.forEach((panel) => {
      panel.hidden = panel.dataset.officePanel !== panelName;
    });
  }

  function getThemeLabel(theme) {
    return environmentMap.get(theme)?.label || environments[0]?.label || "Escritório";
  }

  function renderEnvironmentOptions() {
    if (!environmentGrid) return;
    const fragment = document.createDocumentFragment();
    environments.forEach((environment) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "office-environment-card";
      button.dataset.environmentId = environment.id;
      button.innerHTML = `
        <span>${environment.shortLabel || "Mapa"}</span>
        <strong>${environment.label}</strong>
        <p>${environment.description}</p>
      `;
      button.classList.toggle("is-active", environment.id === officeState.theme);
      button.addEventListener("click", () => {
        applyOfficeTheme(environment.id);
        setActiveTab("environment");
        showControlPanel("environment");
      });
      fragment.append(button);
    });
    environmentGrid.replaceChildren(fragment);
  }

  function refreshEnvironmentUI() {
    const currentEnvironment = getCurrentEnvironment();
    if (environmentCopy && currentEnvironment) {
      environmentCopy.textContent = currentEnvironment.description;
    }
    if (inventoryFocus && currentEnvironment) {
      inventoryFocus.textContent = currentEnvironment.focusLabel || currentEnvironment.label;
    }
    environmentGrid?.querySelectorAll("[data-environment-id]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.environmentId === officeState.theme);
    });
  }

  function renderInventoryPanel() {
    if (!inventoryGrid) return;
    const items = getInventoryItems();
    if (inventoryCount) inventoryCount.textContent = String(items.length);
    if (inventoryTotal) inventoryTotal.textContent = formatCurrency(getInventoryTotalValue());
    if (!items.length) {
      inventoryGrid.innerHTML = `
        <article class="office-inventory-card is-empty">
          <span>vaquinha aberta</span>
          <strong>Nenhum item entrou ainda</strong>
          <p>Abra a vaquinha do escritório e escolha a primeira melhoria que vai aparecer no inventário.</p>
        </article>
      `;
      if (supportInventoryText) {
        supportInventoryText.textContent = "Nenhuma melhoria registrada ainda.";
      }
      return;
    }

    inventoryGrid.innerHTML = items
      .map(
        (item) => `
          <article class="office-inventory-card">
            <span>${formatCurrency(item.price)}</span>
            <strong>${item.name}</strong>
            <p>${item.description}</p>
            <small>registrado em ${item.addedAt || "agora"}</small>
          </article>
        `
      )
      .join("");
    if (supportInventoryText) {
      supportInventoryText.textContent = items.map((item) => item.name).join(" • ");
    }
  }

  function refreshAvatarForAgent(agent) {
    if (!agent) return;
    if (agent.el?.firstElementChild) {
      agent.el.firstElementChild.replaceWith(createAvatar(agent));
    }
    if (agent.rosterAvatarHost) {
      agent.rosterAvatarHost.replaceChildren(createAvatar(agent));
    }
  }

  function refreshVisibleAvatars() {
    agents.forEach(refreshAvatarForAgent);
    const activeAgent = agents.find((agent) => agent.id === officeState.activeAgentId);
    if (activeAgent) {
      if (terminalAvatar) {
        terminalAvatar.replaceChildren(createAvatar(activeAgent));
        terminalAvatar.className = `office-terminal-avatar role-${activeAgent.role}`;
      }
      if (modal && !modal.hidden && modalAvatar) {
        modalAvatar.replaceChildren(createAvatar(activeAgent));
        modalAvatar.className = `office-modal-avatar role-${activeAgent.role}`;
      }
    }
  }

  function applyOfficeTheme(theme, announce = true) {
    if (!environmentMap.has(theme)) {
      theme = environments[0]?.id || theme;
    }
    officeState.theme = theme;
    document.body.dataset.officeTheme = theme;
    refreshEnvironmentUI();
    refreshVisibleAvatars();
    if (announce) {
      const currentEnvironment = getCurrentEnvironment();
      setFeedText(
        `${currentEnvironment?.label || "Ambiente"} ativo. Os sprites e o mapa mudaram para combinar com esse cenário.`
      );
    }
  }

  function applyVisualBoost(enabled, announce = true) {
    officeState.visualBoost = enabled;
    document.body.classList.toggle("office-visual-boost", enabled);
    if (visualCopy) {
      visualCopy.textContent = enabled
        ? "Visual reforçado ativo: o mapa ganhou mais brilho e a vaquinha pode continuar empurrando melhorias para dentro do escritório."
        : supportIntro;
    }
    if (announce) {
      setFeedText(
        enabled
          ? "Visual reforçado: brilho, contraste e atmosfera do escritório ficaram mais intensos."
          : "Visual padrão restaurado: o escritório voltou para a leitura normal."
      );
    }
  }

  function setActiveTab(tabName) {
    officeState.activeTab = tabName;
    tabButtons.forEach((button) => {
      button.classList.toggle("is-active", button.dataset.officeTab === tabName);
    });
    showControlPanel(tabName === "team" ? "" : tabName);
  }

  function applyTerminalMode(enabled, announce = true) {
    officeState.terminalMode = enabled;
    document.body.classList.toggle("office-terminal-mode", enabled);
    if (announce) {
      setFeedText(
        enabled
          ? "Modo terminal ativo. O ambiente visual foi recolhido para focar no funcionamento da equipe."
          : "Modo visual restaurado. O mapa do escritório voltou a ficar aberto."
      );
    }
  }

  function openSupportModal() {
    if (!supportModal) return;
    if (!officeState.selectedSupportItemId && supportCatalog[0]) {
      officeState.selectedSupportItemId = supportCatalog[0].id;
    }
    if (pixKeyOutput) pixKeyOutput.textContent = "QR Code protegido";
    if (supportFeedback) {
      supportFeedback.textContent = "Escolha um item e use o fluxo de QR Code protegido para marcar a vaquinha.";
    }
    selectSupportItem(officeState.selectedSupportItemId, false);
    supportModal.hidden = false;
    document.body.style.overflow = "hidden";
    pixCopyButton?.focus();
    setFeedText("A vaquinha do escritório foi aberta com itens concretos para melhorar o ambiente de trabalho.");
  }

  function renderSupportCatalog() {
    if (!supportCatalogHost) return;
    supportCatalogHost.innerHTML = supportCatalog
      .map((item) => {
        const bought = hasInventoryItem(item.id);
        return `
          <button
            class="office-support-item${bought ? " is-bought" : ""}"
            type="button"
            data-support-item="${item.id}"
          >
            <span>${formatCurrency(item.price)}</span>
            <strong>${item.name}</strong>
            <p>${item.description}</p>
            <small>${bought ? "ja entrou no inventario" : "abrir vaquinha deste item"}</small>
          </button>
        `;
      })
      .join("");

    supportCatalogHost.querySelectorAll("[data-support-item]").forEach((button) => {
      button.addEventListener("click", () => {
        selectSupportItem(button.dataset.supportItem || "", true);
      });
    });
  }

  function selectSupportItem(itemId, announce = true) {
    const item = supportItemMap.get(itemId) || supportCatalog[0] || null;
    if (!item) return;
    officeState.selectedSupportItemId = item.id;
    if (supportItemName) supportItemName.textContent = item.name;
    if (supportItemDescription) supportItemDescription.textContent = item.description;
    if (supportItemPrice) supportItemPrice.textContent = formatCurrency(item.price);
    supportCatalogHost?.querySelectorAll("[data-support-item]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.supportItem === item.id);
    });
    if (announce) {
      setFeedText(`${item.name} entrou em destaque na vaquinha deste escritório.`);
    }
  }

  function confirmSupportItem() {
    const item = getSelectedSupportItem();
    if (!item) return;
    if (hasInventoryItem(item.id)) {
      if (supportFeedback) {
        supportFeedback.textContent = `${item.name} já está no inventário deste escritório.`;
      }
      return;
    }

    officeState.inventory.unshift({
      id: item.id,
      addedAt: new Date().toLocaleDateString("pt-BR")
    });
    saveInventory();
    renderInventoryPanel();
    renderSupportCatalog();
    selectSupportItem(item.id, false);
    if (supportFeedback) {
      supportFeedback.textContent = `${item.name} foi registrado no inventário local desta vaquinha.`;
    }
    setFeedText(`${item.name} agora aparece no inventário do escritório como melhoria apoiada.`);
  }

  function closeSupportModal() {
    if (!supportModal) return;
    supportModal.hidden = true;
    document.body.style.overflow = modal && !modal.hidden ? "hidden" : "";
  }

  function saveGossipLog() {
    try {
      window.sessionStorage.setItem(gossipStorageKey, JSON.stringify(officeState.gossipLog.slice(0, 14)));
    } catch (_error) {
      // ignore storage failures
    }
  }

  function loadGossipLog() {
    try {
      const raw = window.sessionStorage.getItem(gossipStorageKey);
      officeState.gossipLog = raw ? JSON.parse(raw) : [];
    } catch (_error) {
      officeState.gossipLog = [];
    }
  }

  function recordGossip(agent, text, kicker = "Bastidor da rotina") {
    if (!agent || !text) return;
    officeState.gossipLog.unshift({
      agentId: agent.id,
      text,
      kicker,
      at: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    });
    officeState.gossipLog = officeState.gossipLog.slice(0, 14);
    saveGossipLog();
  }

  function buildRoutineGossip(agent) {
    const newsItem = pickOfficeNewsItem();
    const task = getAgentTask(agent).toLowerCase();
    if (newsItem && !document.body.classList.contains("office-page-nerd")) {
      return {
        kicker: "Fofoca editorial",
        text: `${agent.name} comentou baixinho que leu "${newsItem.title}" e ficou surpreso com o rumo dessa noticia.`
      };
    }

    const lines = [
      `${agent.name} anda dizendo que está bem ocupado com ${task}.`,
      `${agent.name} soltou que a rotina apertou e ${task} virou prioridade total.`,
      `${agent.name} comentou no corredor que ${task} está rendendo mais trabalho do que parecia.`,
      `${agent.name} cochichou que hoje a bancada está girando em torno de ${task}.`
    ];

    return {
      kicker: document.body.classList.contains("office-page-nerd") ? "Fofoca do estúdio nerd" : "Fofoca do escritório",
      text: lines[Math.floor(Math.random() * lines.length)]
    };
  }

  function openShortcutsModal() {
    if (!shortcutsModal) return;
    shortcutsModal.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeShortcutsModal() {
    if (!shortcutsModal) return;
    shortcutsModal.hidden = true;
    document.body.style.overflow = modal && !modal.hidden ? "hidden" : "";
  }

  function openGossipModal(entry) {
    const gossipEntry = entry || officeState.gossipLog[0];
    if (!gossipModal || !gossipEntry) return;
    const agent = agents.find((item) => item.id === gossipEntry.agentId) || agents[0];
    if (gossipAvatar && agent) {
      gossipAvatar.replaceChildren(createAvatar(agent));
      gossipAvatar.className = `office-modal-avatar role-${agent.role}`;
    }
    if (gossipSpeaker) gossipSpeaker.textContent = agent?.name || "Agente";
    if (gossipKicker) gossipKicker.textContent = gossipEntry.kicker || "Fofoca do escritório";
    if (gossipText) gossipText.textContent = gossipEntry.text;
    if (gossipMeta) gossipMeta.textContent = `${gossipEntry.at} • memória viva da rotina do escritório.`;
    gossipModal.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeGossipModal() {
    if (!gossipModal) return;
    gossipModal.hidden = true;
    document.body.style.overflow = modal && !modal.hidden ? "hidden" : "";
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function sanitizeOfficeNewsTitle(value) {
    return String(value || "")
      .replace(/&#\d+;/g, " ")
      .replace(/data-[^"'\s>]+="[^"]*"/g, " ")
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function distance(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  function pointInRect(point, rect, pad = 0) {
    return (
      point.x > rect.x - pad &&
      point.x < rect.x + rect.w + pad &&
      point.y > rect.y - pad &&
      point.y < rect.y + rect.h + pad
    );
  }

  function collidesWithObstacle(point, pad = 18) {
    return obstacles.some((obstacle) => pointInRect(point, obstacle, pad));
  }

  function collidesWithAgent(point, currentAgent, minDistance = 28) {
    return agents.some((other) => other !== currentAgent && distance(point, other) < minDistance);
  }

  function isPointFree(point, currentAgent = null, obstaclePad = 18, agentDistance = 28) {
    return !collidesWithObstacle(point, obstaclePad) && !collidesWithAgent(point, currentAgent, agentDistance);
  }

  function randomInRoom(roomName) {
    const room = rooms[roomName] || rooms.news;
    for (let attempt = 0; attempt < 60; attempt += 1) {
      const point = {
        x: room.x + 20 + Math.random() * Math.max(20, room.w - 40),
        y: room.y + 32 + Math.random() * Math.max(20, room.h - 44)
      };

      if (isPointFree(point, null, 18, 22)) {
        return point;
      }
    }

    return { x: room.x + room.w / 2, y: room.y + room.h / 2 };
  }

  function findFreePointInRoom(agent, options = {}) {
    const room = rooms[agent.room] || rooms.news;
    const attempts = options.attempts || 80;
    const obstaclePad = options.obstaclePad ?? 18;
    const agentDistance = options.agentDistance ?? 28;

    for (let attempt = 0; attempt < attempts; attempt += 1) {
      const point = {
        x: room.x + 20 + Math.random() * Math.max(20, room.w - 40),
        y: room.y + 32 + Math.random() * Math.max(20, room.h - 44)
      };

      if (isPointFree(point, agent, obstaclePad, agentDistance)) {
        return point;
      }
    }

    return {
      x: clamp(room.x + room.w / 2, room.x + 18, room.x + room.w - 18),
      y: clamp(room.y + room.h / 2, room.y + 24, room.y + room.h - 10)
    };
  }

  function teleportAgentToFreeSpot(agent, reason = "stuck") {
    const freePoint = findFreePointInRoom(agent, {
      attempts: 120,
      obstaclePad: 16,
      agentDistance: 34
    });

    agent.x = freePoint.x;
    agent.y = freePoint.y;
    agent.target = pickTarget(agent);
    agent.pauseUntil = 0;
    agent.stuckFrames = 0;
    agent.lastSafeTeleportAt = Date.now();
    syncAgentTask(agent, reason === "spawn" ? agent.task : "reposicionado para um ponto livre");
    setAgentPosition(agent);
    agent.el?.classList.remove("is-walking");
  }

  function pickTarget(agent) {
    const spots = roomSpots[agent.room] || [];
    const spotBias = getAgentSpotBias(agent);
    if (spots.length && Math.random() < spotBias) {
      const baseSpot = spots[Math.floor(Math.random() * spots.length)];
      return {
        x: baseSpot.x + (Math.random() * 8 - 4),
        y: baseSpot.y + (Math.random() * 8 - 4),
        task: baseSpot.task,
        pauseMs: Math.round(baseSpot.pauseMs * getAgentPauseScale(agent))
      };
    }

    return { ...randomInRoom(agent.room), task: agent.task, pauseMs: 0 };
  }

  function getAgentTask(agent) {
    return agent.currentTask || agent.task;
  }

  async function loadOfficeNews() {
    if (officeConfig.disableNews) {
      officeConversationState.news = [];
      return;
    }

    const fallbackNews = officeNewsFallback.map((item) => ({
      title: sanitizeOfficeNewsTitle(item.title),
      category: item.category || "Cotidiano"
    }));

    if (Array.isArray(window.NEWS_DATA) && window.NEWS_DATA.length) {
      officeConversationState.news = window.NEWS_DATA
        .map((item) => ({
          title: sanitizeOfficeNewsTitle(item.title || item.sourceLabel || item.summary),
          category: item.category || "Cotidiano"
        }))
        .filter((item) => item.title)
        .slice(0, 8);
      return;
    }

    try {
      const response = await fetch("./api/news", {
        headers: { Accept: "application/json" }
      });
      if (!response.ok) {
        throw new Error(`news-status-${response.status}`);
      }
      const payload = await response.json();
      const items = Array.isArray(payload?.items)
        ? payload.items
        : Array.isArray(payload)
          ? payload
          : [];

      officeConversationState.news = items
        .map((item) => ({
          title: sanitizeOfficeNewsTitle(item.title || item.sourceLabel || item.summary),
          category: item.category || "Cotidiano"
        }))
        .filter((item) => item.title)
        .slice(0, 8);
    } catch (_error) {
      officeConversationState.news = fallbackNews;
    }

    if (!officeConversationState.news.length) {
      officeConversationState.news = fallbackNews;
    }
  }

  function pickOfficeNewsItem() {
    const news = officeConversationState.news;
    if (!Array.isArray(news) || !news.length) {
      return null;
    }
    return news[Math.floor(Math.random() * news.length)];
  }

  function buildNewsConversation(a, b, item) {
    if (!item?.title) {
      return null;
    }

    const shortTitle = item.title.length > 82 ? `${item.title.slice(0, 79).trim()}...` : item.title;
    const category = item.category || "Cotidiano";
    const templates = [
      `${a.name}: você viu essa de ${category.toLowerCase()}? "${shortTitle}". ${b.name}: isso merece destaque com contexto.`,
      `${a.name}: esse assunto chamou atenção por aqui: "${shortTitle}". ${b.name}: bora traduzir isso bem para o público.`,
      `${a.name}: estou de olho nessa notícia do dia, "${shortTitle}". ${b.name}: se entrar, tem que entrar redonda.`,
      `${a.name}: "${shortTitle}" está rendendo conversa por aqui. ${b.name}: parece assunto forte para hoje.`,
      `${a.name}: essa manchete do dia ficou martelando na cabeça: "${shortTitle}". ${b.name}: vamos ver o melhor ângulo para publicar.`
    ];

    return templates[Math.floor(Math.random() * templates.length)];
  }

  function buildSmallTalkConversation(a, b) {
    const topic = officeSmallTalk[Math.floor(Math.random() * officeSmallTalk.length)];
    const templates = [
      `${a.name}: ${topic} ${b.name}: concordo, hoje o escritório está rendendo bem.`,
      `${a.name}: ${topic} ${b.name}: isso resume o clima daqui agora.`,
      `${a.name}: ${topic} ${b.name}: vou aproveitar e fechar minha parte também.`,
      `${a.name}: ${topic} ${b.name}: boa, isso ajuda o ritmo da equipe inteira.`,
      `${a.name}: ${topic} ${b.name}: perfeito, já me deu até ideia para a próxima rodada.`
    ];

    return templates[Math.floor(Math.random() * templates.length)];
  }

  function syncAgentTask(agent, nextTask) {
    agent.currentTask = nextTask || agent.task;
    if (agent.taskEl) {
      agent.taskEl.textContent = agent.currentTask;
    }
  }

  function createAvatar(agentOrRole = "editor") {
    const role = typeof agentOrRole === "string" ? agentOrRole : agentOrRole.role;
    const sprite =
      typeof agentOrRole === "string" ? null : spriteProfiles[agentOrRole.id] || null;
    const currentEnvironment = getCurrentEnvironment();
    const wrapper = document.createElement("div");
    wrapper.className = `pixel-avatar role-${role}`;
    if (currentEnvironment?.spriteKit) {
      wrapper.dataset.environmentKit = currentEnvironment.spriteKit;
    }
    if (sprite) {
      if (sprite.skin) wrapper.style.setProperty("--skin", sprite.skin);
      if (sprite.hair) wrapper.style.setProperty("--hair", sprite.hair);
      if (sprite.accent) wrapper.style.setProperty("--accent", sprite.accent);
      if (sprite.accessory) wrapper.dataset.accessory = sprite.accessory;
      if (sprite.prop) wrapper.dataset.prop = sprite.prop;
      if (sprite.hairStyle) wrapper.dataset.hairStyle = sprite.hairStyle;
    }
    wrapper.innerHTML = `
      <span class="pixel-shadow"></span>
      <span class="pixel-backpack"></span>
      <span class="pixel-hair"></span>
      <span class="pixel-head"></span>
      <span class="pixel-face"></span>
      <span class="pixel-accessory"></span>
      <span class="pixel-env"></span>
      <span class="pixel-body"></span>
      <span class="pixel-belt"></span>
      <span class="pixel-arm-left"></span>
      <span class="pixel-arm-right"></span>
      <span class="pixel-leg-left"></span>
      <span class="pixel-leg-right"></span>
      <span class="pixel-shoe-left"></span>
      <span class="pixel-shoe-right"></span>
      <span class="pixel-prop"></span>
      <span class="pixel-prop-detail"></span>
    `;
    return wrapper;
  }

  function slugifyAgentValue(value) {
    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 90);
  }

  function getRealAgentSlug(agent) {
    const realOfficeKey = officeKey === "editorial" ? "editorial-hq" : officeKey;
    return slugifyAgentValue(`${realOfficeKey}-${agent.id || agent.name}`);
  }

  function getRealAgentProcess(agent) {
    if (!agent || !officeState.realAgentMap) return null;
    return officeState.realAgentMap.get(getRealAgentSlug(agent)) || null;
  }

  function buildRealAgentMap(payload) {
    const queue = Array.isArray(payload?.queue) ? payload.queue : [];
    const agentRegistry = Array.isArray(payload?.agents) ? payload.agents : [];
    const registryBySlug = new Map(agentRegistry.map((item) => [item.slug, item]));
    const map = new Map();

    queue.forEach((item) => {
      if (!item?.slug) return;
      map.set(item.slug, {
        ...registryBySlug.get(item.slug),
        ...item,
        registry: registryBySlug.get(item.slug) || null
      });
    });

    return map;
  }

  async function loadRealAgentProcesses() {
    try {
      const response = await fetch("/api/real-agents", {
        headers: { Accept: "application/json" }
      });
      const payload = await response.json();
      if (!response.ok || !payload?.ok) {
        throw new Error(payload?.error || "real-agents indisponivel");
      }

      officeState.realAgentMap = buildRealAgentMap(payload);
      officeState.realAgentsReady = true;
      const activeAgent = agents.find((item) => item.id === officeState.activeAgentId) || agents[0];
      if (activeAgent) {
        renderTerminal(activeAgent, "Terminal real conectado aos agentes operacionais do jornal.");
      }
      setFeedText(`Terminal real conectado: ${payload.summary?.totalAgents || officeState.realAgentMap.size} agentes com fila operacional ativa.`);
    } catch (_error) {
      officeState.realAgentsReady = false;
      setFeedText("Terminal visual ativo. A fila real dos agentes ainda nao respondeu nesta tela.");
    }
  }

  function getTerminalCommand(agent, realProcess) {
    const scope = realProcess?.officeKey || officeKey || "office";
    return `> run ${scope}/${agent.id}`;
  }

  function getTerminalStatus(agent, realProcess, fallbackLine) {
    const assignment = realProcess?.assignment || {};
    return assignment.action || getAgentTask(agent) || fallbackLine || "em observacao";
  }

  function getTerminalPipeline(agent, realProcess) {
    const registry = realProcess?.registry || realProcess || {};
    return registry.specialty || agent.specialty || "monitoramento do jornal";
  }

  function getTerminalStack(agent, realProcess) {
    const registry = realProcess?.registry || realProcess || {};
    const capabilities = Array.isArray(registry.capabilities) ? registry.capabilities.slice(0, 4) : [];
    const skills = Array.isArray(agent.skills) ? agent.skills.slice(0, 4) : [];
    return [...new Set([...skills, ...capabilities])].join(", ");
  }

  function getTerminalLog(agent, realProcess, line) {
    const assignment = realProcess?.assignment || {};
    return assignment.idea || line || agent.lines?.[0] || "Processo ativo, aguardando nova confirmacao.";
  }

  function getTerminalMonitor(realProcess) {
    const assignment = realProcess?.assignment || {};
    return assignment.monitor || "monitorando jornal, revisao e fila operacional";
  }

  function getTerminalDeliverable(realProcess) {
    const assignment = realProcess?.assignment || {};
    return assignment.deliverable || "observacao operacional";
  }

  function getTerminalAutonomy(realProcess) {
    const autonomy = realProcess?.autonomy || {};
    if (!autonomy.mode) return "assistido | memoria aguardando proximo ciclo";
    return `${autonomy.mode} | autonomia ${autonomy.autonomy || 0}% | urgencia ${autonomy.urgency || 0}% | confianca ${autonomy.confidence || 0}%`;
  }

  function renderTerminal(agent, line = "") {
    if (!terminalOutput || !agent) return;
    officeState.activeAgentId = agent.id;
    const skills = agent.skills.join(", ");
    const evaluation = getAgentEvaluation(agent);
    const realProcess = getRealAgentProcess(agent);
    const realStatus = officeState.realAgentsReady ? "conectado ao runtime real" : "aguardando runtime real";
    terminalOutput.textContent = [
      getTerminalCommand(agent, realProcess),
      `worker: ${agent.name}`,
      `modulo: ${agent.title}`,
      `pipeline: ${getTerminalPipeline(agent, realProcess)}`,
      `status: ${getTerminalStatus(agent, realProcess, line)}`,
      `runtime: codigo ativo 24h`,
      `terminal: ${realStatus}`,
      `autonomia: ${getTerminalAutonomy(realProcess)}`,
      `avaliacao: ${evaluation.score} pts (${getAgentEvaluationLevel(agent)})`,
      `neural: foco ${formatPercent01(evaluation.neural.focus)} | qualidade ${formatPercent01(evaluation.neural.quality)} | ritmo ${formatPercent01(evaluation.neural.speed)}`,
      `conversa: ${getAgentConversationSummary(agent)}`,
      `entrega: ${getTerminalDeliverable(realProcess)}`,
      `monitor: ${getTerminalMonitor(realProcess)}`,
      `intencao: ${realProcess?.autonomy?.intent || "aguardando decisao propria"}`,
      `stack: ${getTerminalStack(agent, realProcess) || skills}`,
      `log: ${getTerminalLog(agent, realProcess, line)}`
    ].join("\n");

    if (terminalAvatar) {
      terminalAvatar.replaceChildren(createAvatar(agent));
      terminalAvatar.className = `office-terminal-avatar role-${agent.role}`;
    }
    refreshAgentEvaluationUI(agent);
  }

  function gatherTeam() {
    const meetingSpots = [
      { x: sx(612), y: sy(314) },
      { x: sx(666), y: sy(314) },
      { x: sx(720), y: sy(314) },
      { x: sx(774), y: sy(314) },
      { x: sx(828), y: sy(314) },
      { x: sx(612), y: sy(350) },
      { x: sx(666), y: sy(350) },
      { x: sx(720), y: sy(350) },
      { x: sx(774), y: sy(350) },
      { x: sx(828), y: sy(350) },
      { x: sx(548), y: sy(330) },
      { x: sx(880), y: sy(330) }
    ];

    agents.forEach((agent, index) => {
      const spot = meetingSpots[index % meetingSpots.length];
      agent.target = {
        x: spot.x,
        y: spot.y,
        task: officeConfig.gatherTask || "reunido com a equipe para alinhar a próxima rodada",
        pauseMs: 4800
      };
      agent.pauseUntil = 0;
      syncAgentTask(agent, "indo para a reunião geral da equipe");
    });

    setFeedText("Equipe reunida: jornal e nerd entraram em alinhamento para melhorar operação, arte, revisão e sistema.");
  }

  function resetOfficeControls() {
    setActiveTab("team");
    applyOfficeTheme(defaultTheme, false);
    applyVisualBoost(false, false);
    applyTerminalMode(false, false);
    renderInventoryPanel();
    setFeedText("Escritório restaurado: mapa visual, equipe livre e terminal lateral prontos para uso.");
  }

  function setAgentPosition(agent) {
    agent.el.style.setProperty("--x", ((agent.x / WORLD.width) * 100).toFixed(2));
    agent.el.style.setProperty("--y", ((agent.y / WORLD.height) * 100).toFixed(2));
  }

  function renderAgent(agent) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `office-agent role-${agent.role}`;
    button.dataset.agentId = agent.id;
    button.setAttribute("aria-label", `${agent.name}, ${agent.title}. Clique para conhecer.`);
    button.append(createAvatar(agent));

    const name = document.createElement("span");
    name.className = "office-agent-name";
    name.textContent = agent.name;

    const role = document.createElement("span");
    role.className = "office-agent-role";
    role.textContent = agent.title;

    const task = document.createElement("span");
    task.className = "office-agent-task";
    task.textContent = "trabalhando";

    const bubble = document.createElement("span");
    bubble.className = "office-agent-bubble";
    bubble.innerHTML = `
      <strong>Quer me conhecer melhor?</strong>
      <p>${agent.lines[0]}</p>
      <span class="agent-meet-button" role="button">Abrir perfil</span>
    `;

    button.append(name, role, task, bubble);
    agent.el = button;
    agent.taskEl = task;
    agent.bubbleText = bubble.querySelector("p");
    agent.x = agent.x || randomInRoom(agent.room).x;
    agent.y = agent.y || randomInRoom(agent.room).y;
    agent.target = pickTarget(agent);
    applyAgentBehavior(agent);
    agent.nextLineAt = Date.now() + Math.random() * 5000;
    agent.pauseUntil = 0;
    agent.stuckFrames = 0;
    agent.lastX = agent.x;
    agent.lastY = agent.y;
    agent.lastSafeTeleportAt = 0;
    syncAgentTask(agent, agent.task);
    setAgentPosition(agent);

    if (!isPointFree({ x: agent.x, y: agent.y }, agent, 16, 30)) {
      teleportAgentToFreeSpot(agent, "spawn");
    }

    button.addEventListener("mouseenter", () => activateAgent(agent));
    button.addEventListener("focus", () => activateAgent(agent));
    button.addEventListener("click", () => openAgentModal(agent));
    agentLayer.append(button);
  }

  function renderRoster() {
    const fragment = document.createDocumentFragment();
    agents.forEach((agent) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = `office-roster-card role-${agent.role}`;
      card.innerHTML = `
        <span>${agent.title}</span>
        <strong>${agent.name}</strong>
        <p>${agent.specialty}</p>
        <small class="office-roster-score">70 pts</small>
        <div class="office-roster-mini" aria-hidden="true"></div>
      `;
      agent.rosterAvatarHost = card.querySelector(".office-roster-mini");
      agent.rosterScoreEl = card.querySelector(".office-roster-score");
      agent.rosterAvatarHost.append(createAvatar(agent));
      card.addEventListener("click", () => openAgentModal(agent));
      fragment.append(card);
      refreshAgentEvaluationUI(agent);
    });
    rosterGrid.replaceChildren(fragment);
  }

  function activateAgent(agent) {
    const line = agent.lines[Math.floor(Math.random() * agent.lines.length)];
    if (agent.bubbleText) agent.bubbleText.textContent = line;
    if (agent.taskEl) agent.taskEl.textContent = getAgentTask(agent);
    agent.el.classList.add("is-talking");
    window.setTimeout(() => agent.el?.classList.remove("is-talking"), 1300);
    if (feed) {
      feed.textContent = `${agent.name}: ${line}`;
    }
    renderTerminal(agent, line);
  }

  function openAgentModal(agent) {
    if (!modal) return;
    officeState.activeAgentId = agent.id;
    modalAvatar.replaceChildren(createAvatar(agent));
    modalAvatar.className = `office-modal-avatar role-${agent.role}`;
    modalKicker.textContent = agent.specialty;
    modalName.textContent = agent.name;
    modalTitle.textContent = agent.title;
    modalDescription.textContent = agent.description;
    modalTask.textContent = getAgentTask(agent);
    modalSkills.innerHTML = agent.skills.map((skill) => `<li>${skill}</li>`).join("");
    if (modalEvalFeedback) {
      modalEvalFeedback.textContent = "Avalie o agente e o sistema vai ajustando o comportamento dele com base nesse histórico.";
    }
    if (conversationInput) conversationInput.value = "";
    if (conversationStatus) conversationStatus.textContent = getAgentConversationSummary(agent);
    refreshAgentEvaluationUI(agent);
    renderTerminal(agent, agent.lines[0]);
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    modal.querySelector("[data-close-agent-modal]")?.focus();
  }

  function closeAgentModal() {
    if (!modal) return;
    modal.hidden = true;
    document.body.style.overflow = "";
  }

  modal?.addEventListener("click", (event) => {
    if (event.target.closest("[data-close-agent-modal]")) {
      closeAgentModal();
    }
  });

  supportModal?.addEventListener("click", (event) => {
    if (event.target.closest("[data-close-support-modal]")) {
      closeSupportModal();
    }
  });

  shortcutsModal?.addEventListener("click", (event) => {
    if (event.target.closest("[data-close-shortcuts-modal]")) {
      closeShortcutsModal();
    }
  });

  gossipModal?.addEventListener("click", (event) => {
    if (event.target.closest("[data-close-gossip-modal]")) {
      closeGossipModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal && !modal.hidden) {
      closeAgentModal();
      return;
    }
    if (event.key === "Escape" && supportModal && !supportModal.hidden) {
      closeSupportModal();
      return;
    }
    if (event.key === "Escape" && shortcutsModal && !shortcutsModal.hidden) {
      closeShortcutsModal();
      return;
    }
    if (event.key === "Escape" && gossipModal && !gossipModal.hidden) {
      closeGossipModal();
    }
  });

  rateAgentButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const agent = agents.find((item) => item.id === officeState.activeAgentId);
      if (!agent) return;
      recordAgentFeedback(agent, button.dataset.rateAgent === "bad" ? "bad" : "good");
    });
  });

  conversationButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const agent = agents.find((item) => item.id === officeState.activeAgentId);
      if (!agent) return;
      const action = button.dataset.conversationFeedback || "analyze";
      if (action === "good") {
        submitConversationFeedback(agent, "good");
        return;
      }
      if (action === "bad") {
        submitConversationFeedback(agent, "bad");
        return;
      }
      submitConversationFeedback(agent);
    });
  });

  conversationInput?.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      const agent = agents.find((item) => item.id === officeState.activeAgentId);
      if (!agent) return;
      submitConversationFeedback(agent);
    }
  });

  sideRailButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.officeAction;
      if (action === "gather") {
        gatherTeam();
        return;
      }
      if (action === "reset") {
        resetOfficeControls();
        return;
      }
      if (action === "cafe") {
        openSupportModal();
        return;
      }
      if (action === "boost") {
        applyVisualBoost(!officeState.visualBoost);
        return;
      }
      if (action === "terminal") {
        applyTerminalMode(!officeState.terminalMode);
      }
    });
  });

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const tabName = button.dataset.officeTab || "team";
      setActiveTab(tabName);
      if (tabName === "team") {
        setFeedText("Equipe em destaque: o mapa segue vivo e o terminal continua mostrando o código rodando 24 horas.");
        return;
      }
      if (tabName === "environment") {
        showControlPanel("environment");
        setFeedText("Escolha um dos 3 mapas para mudar cenário e sprite da equipe.");
        return;
      }
      if (tabName === "visual") {
        showControlPanel("visual");
        setFeedText("A vaquinha visual está aberta para destravar upgrades e reforçar o ambiente.");
        return;
      }
      if (tabName === "inventory") {
        showControlPanel("inventory");
        renderInventoryPanel();
        setFeedText("Inventário aberto: aqui aparecem as melhorias já puxadas para dentro do escritório.");
      }
    });
  });

  titlebarButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.officeTitlebar;
      titlebarButtons.forEach((item) => item.classList.toggle("is-active", item === button));
      if (action === "terminal") {
        applyTerminalMode(true);
        terminalPanel?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
        return;
      }
      if (action === "office") {
        openShortcutsModal();
        return;
      }
      if (action === "backstage") {
        if (!officeState.gossipLog.length) {
          generateRoutineGossip(true);
          return;
        }
        openGossipModal(officeState.gossipLog[0]);
        return;
      }
      if (action === "home") {
        window.location.href = officeVariant === "nerd" ? "./pubpaid.html" : "./index.html?skipIntro=1";
      }
    });
  });

  coffeeMachine?.addEventListener("click", openSupportModal);
  supportOpenButtons.forEach((button) => button.addEventListener("click", openSupportModal));

  pixCopyButton?.addEventListener("click", async () => {
    if (supportFeedback) {
      supportFeedback.textContent = "Por seguranca, a chave Pix nao aparece. Use o QR Code protegido no fluxo de pagamento.";
    }
  });
  supportConfirmButton?.addEventListener("click", confirmSupportItem);

  function chooseConversation() {
    if (!dialogueLayer || !agents.length) return;
    const a = agents[Math.floor(Math.random() * agents.length)];
    const possible = agents.filter((agent) => agent.id !== a.id && agent.room === a.room);
    const b = possible.length
      ? possible[Math.floor(Math.random() * possible.length)]
      : agents.find((agent) => agent.id !== a.id);
    if (!b) return;

    const useNews = officeConversationState.news.length > 0 && Math.random() < 0.58;
    const text = useNews
      ? buildNewsConversation(a, b, pickOfficeNewsItem()) || buildSmallTalkConversation(a, b)
      : buildSmallTalkConversation(a, b);
    const bubble = document.createElement("div");
    bubble.className = "office-floating-dialogue";
    bubble.textContent = text;
    bubble.style.setProperty("--x", (((a.x + b.x) / 2 / WORLD.width) * 100).toFixed(2));
    bubble.style.setProperty("--y", (((a.y + b.y) / 2 / WORLD.height) * 100).toFixed(2));
    dialogueLayer.append(bubble);
    window.setTimeout(() => bubble.remove(), 5000);
    setFeedText(text);
    recordGossip(a, text, useNews ? "Conversa puxada por notícia" : "Comentário de corredor");
  }

  function generateRoutineGossip(forceOpen = false) {
    if (!agents.length) return;
    const agent = agents[Math.floor(Math.random() * agents.length)];
    const gossip = buildRoutineGossip(agent);
    recordGossip(agent, gossip.text, gossip.kicker);
    setFeedText(`${agent.name}: ${gossip.text}`);
    if (forceOpen) {
      openGossipModal(officeState.gossipLog[0]);
    }
  }

  function moveAgent(agent, deltaSeconds) {
    const now = Date.now();
    const room = rooms[agent.room] || rooms.news;

    if (collidesWithObstacle(agent, 16)) {
      teleportAgentToFreeSpot(agent, "collision");
      return;
    }

    if (agent.pauseUntil && now < agent.pauseUntil) {
      agent.el.classList.remove("is-walking");
      return;
    }

    if (agent.pauseUntil && now >= agent.pauseUntil) {
      agent.pauseUntil = 0;
      syncAgentTask(agent, agent.task);
      agent.target = pickTarget(agent);
    }

    if (!agent.target || distance(agent, agent.target) < 12) {
      if (agent.target?.pauseMs) {
        agent.pauseUntil = now + agent.target.pauseMs;
        syncAgentTask(agent, agent.target.task || agent.task);
        agent.el.classList.remove("is-walking");
        return;
      }

      agent.target = pickTarget(agent);
    }

    const dx = agent.target.x - agent.x;
    const dy = agent.target.y - agent.y;
    const length = Math.hypot(dx, dy) || 1;
    const step = agent.speed * deltaSeconds;
    const next = {
      x: agent.x + (dx / length) * step,
      y: agent.y + (dy / length) * step
    };

    next.x = clamp(next.x, room.x + 18, room.x + room.w - 18);
    next.y = clamp(next.y, room.y + 24, room.y + room.h - 10);

    if (collidesWithObstacle(next, 18)) {
      agent.target = randomInRoom(agent.room);
      agent.stuckFrames = (agent.stuckFrames || 0) + 1;
      if (agent.stuckFrames > 12) {
        teleportAgentToFreeSpot(agent, "collision");
      }
      return;
    }

    agents.forEach((other) => {
      if (other === agent) return;
      const d = distance(next, other);
      if (d > 0 && d < 34) {
        next.x += ((next.x - other.x) / d) * (34 - d) * 0.38;
        next.y += ((next.y - other.y) / d) * (34 - d) * 0.38;
      }
    });

    const moved = Math.hypot(next.x - agent.x, next.y - agent.y) > 0.05;
    agent.x = next.x;
    agent.y = next.y;
    agent.el.classList.toggle("is-walking", moved);
    setAgentPosition(agent);

    const travelled = Math.hypot(agent.x - (agent.lastX || agent.x), agent.y - (agent.lastY || agent.y));
    if (moved && travelled < 0.35) {
      agent.stuckFrames = (agent.stuckFrames || 0) + 1;
    } else if (moved) {
      agent.stuckFrames = 0;
    }

    agent.lastX = agent.x;
    agent.lastY = agent.y;

    if ((agent.stuckFrames || 0) > 30 && now - (agent.lastSafeTeleportAt || 0) > 900) {
      teleportAgentToFreeSpot(agent, "stuck");
      return;
    }

    if (now > agent.nextLineAt) {
      agent.nextLineAt = now + 6500 + Math.random() * 6000;
      if (!agent.pauseUntil) {
        syncAgentTask(agent, agent.task);
      }
    }
  }

  let lastFrame = performance.now();
  function tick(now) {
    const deltaSeconds = Math.min(0.06, (now - lastFrame) / 1000);
    lastFrame = now;
    agents.forEach((agent) => moveAgent(agent, deltaSeconds));
    window.requestAnimationFrame(tick);
  }

  agents.forEach(renderAgent);
  renderRoster();
  loadGossipLog();
  loadInventory();
  document.body.dataset.officeVariant = officeVariant;
  if (pixKeyOutput) pixKeyOutput.textContent = "QR Code protegido";
  renderEnvironmentOptions();
  renderSupportCatalog();
  renderInventoryPanel();
  applyOfficeTheme(defaultTheme, false);
  if (visualCopy) {
    visualCopy.textContent = supportIntro;
  }
  renderTerminal(
    agents[0],
    officeConfig.terminalWelcome ||
      "Codigo do escritorio em execucao 24 horas. Passe o mouse nos agentes para acompanhar o que cada frente esta rodando agora."
  );
  loadRealAgentProcesses();

  loadOfficeNews().finally(() => {
    if (!prefersReducedMotion) {
      window.requestAnimationFrame(tick);
      window.setInterval(chooseConversation, 5200);
      window.setInterval(() => generateRoutineGossip(false), 8800);
    } else if (feed) {
      feed.textContent =
        officeConfig.reducedMotionMessage ||
        "Movimento reduzido ativo: a equipe continua disponível para visita pelos perfis.";
    }
  });
})();
