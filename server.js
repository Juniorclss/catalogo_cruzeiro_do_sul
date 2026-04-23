const http = require("http");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { runRealAgentsRuntimeLocal } = require("./scripts/real-agents-runtime");
const {
  buildDashboardPayload: buildCanonicalPubpaidAdminPayload,
  readStore: readCanonicalPubpaidStore,
  writeStore: writeCanonicalPubpaidStore,
  reviewDeposit: reviewCanonicalPubpaidDeposit,
  reviewWithdrawal: reviewCanonicalPubpaidWithdrawal,
  withPubpaidLock: withCanonicalPubpaidLock,
} = require("./pubpaid-runtime");
const vm = require("vm");
const zlib = require("zlib");
const { URL } = require("url");
let QRCode = null;
try {
  QRCode = require("qrcode");
} catch (_error) {
  QRCode = null;
}

const PORT = Number(process.env.PORT || 3000);
const HOST = "0.0.0.0";
const ADMIN_TOKEN = String(process.env.ADMIN_TOKEN || "").trim();
const IS_PRODUCTION = String(process.env.NODE_ENV || "").trim().toLowerCase() === "production";

function getRequiredSecret(name, fallbackValue) {
  const value = String(process.env[name] || "").trim();
  if (value) return value;

  if (!IS_PRODUCTION) {
    return fallbackValue;
  }

  console.warn(`[security] Missing required env ${name} in production. Related admin access is disabled until it is set.`);
  return `missing-${name.toLowerCase()}-in-production`;
}

const SUPER_ADMIN_USER = getRequiredSecret("SUPER_ADMIN_USER", "admin");
const SUPER_ADMIN_PASSWORD = getRequiredSecret("SUPER_ADMIN_PASSWORD", "99831455a");
const POLL_ADMIN_PASSWORD = getRequiredSecret("POLL_ADMIN_PASSWORD", "99831455a");
const GOOGLE_AUTH_CLIENT_ID = String(
  process.env.GOOGLE_AUTH_CLIENT_ID || process.env.PUBPAID_GOOGLE_CLIENT_ID || ""
).trim();
const SITE_AUTH_SESSION_SECRET = String(
  process.env.SITE_AUTH_SESSION_SECRET ||
    process.env.PUBPAID_SESSION_SECRET ||
    (IS_PRODUCTION ? "" : "catalogo-local-google-auth-session")
).trim();
const SITE_AUTH_COOKIE = "catalogo_google_session";
const SITE_AUTH_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;
const GOOGLE_ID_TOKEN_CERTS_URL = "https://www.googleapis.com/oauth2/v1/certs";
let googleIdTokenCertCache = {
  certs: null,
  expiresAt: 0
};

const ROOT_DIR = __dirname;
const DEFAULT_DATA_DIR = path.join(ROOT_DIR, "data");
const DATA_DIR = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : DEFAULT_DATA_DIR;
const INDEX_FILE = path.join(ROOT_DIR, "index.html");
const ADMIN_DASHBOARD_FILE = path.join(ROOT_DIR, "backend", "public", "admin-dashboard.html");
const PUBPAID_ADMIN_FILE = path.join(ROOT_DIR, "pubpaid-admin.html");
const STATIC_NEWS_FILE = path.join(ROOT_DIR, "news-data.js");
const NEWS_IMAGE_FOCUS_AUDIT_FILE = path.join(DATA_DIR, "news-image-focus-audit.json");
const ELECTIONS_FILE = path.join(ROOT_DIR, "elections-data.js");
const SERVICES_CATALOG_FILE = path.join(ROOT_DIR, "catalogo-servicos-data.js");
const REAL_AGENTS_RUNTIME_SCRIPT = path.join(ROOT_DIR, "scripts", "real-agents-runtime.js");
const REAL_AGENTS_REGISTRY_FILE = path.join(ROOT_DIR, ".codex-agents", "registry.json");
const REAL_AGENTS_RUN_FILE = path.join(ROOT_DIR, ".codex-temp", "real-agents", "latest-run.json");
const REAL_AGENTS_RUN_MD_FILE = path.join(ROOT_DIR, ".codex-temp", "real-agents", "latest-run.md");
const REAL_AGENTS_RUN_HISTORY_FILE = path.join(DATA_DIR, "real-agents-run-history.json");
const REAL_AGENTS_ACTIONS_FILE = path.join(DATA_DIR, "real-agents-actions.json");
const CHEFFE_CALL_STATE_FILE = path.join(DATA_DIR, "cheffe-call-state.json");
const CHEFFE_CALL_PROMPTS_FILE = path.join(ROOT_DIR, "docs", "cheffe-call-181-prompts.json");
const REAL_AGENTS_AUTO_RUN_INTERVAL_INPUT = Number(process.env.REAL_AGENTS_AUTO_RUN_INTERVAL_MS || 5 * 60 * 1000);
const REAL_AGENTS_AUTO_RUN_INTERVAL_MS = Number.isFinite(REAL_AGENTS_AUTO_RUN_INTERVAL_INPUT)
  ? Math.max(60 * 1000, REAL_AGENTS_AUTO_RUN_INTERVAL_INPUT)
  : 5 * 60 * 1000;
const REAL_AGENTS_AUTO_RUN_DISABLED = String(process.env.REAL_AGENTS_AUTO_RUN_DISABLED || "").toLowerCase() === "true";
const realAgentsAutoRunState = {
  running: false,
  timer: null,
  startedAt: "",
  lastRunAt: "",
  lastError: "",
  cycles: 0
};
const SITE_NAME = "Catalogo Cruzeiro do Sul";
const SITE_REGION_NAME = "Cruzeiro do Sul e Vale do Jurua";
const DEFAULT_SITE_DESCRIPTION =
  "Jornal agregador local de Cruzeiro do Sul e Vale do Jurua, com editorias, arquivo mensal, resumos originais e links para as fontes.";
const DEFAULT_OG_IMAGE_PATH = "/assets/og-cover.svg";
const DEFAULT_PUBLISHER_LOGO_PATH = "/assets/favicon-512x512.png";
const PUBLIC_STATIC_EXTENSIONS = new Set([
  ".html",
  ".css",
  ".js",
  ".svg",
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".ico",
  ".webmanifest"
]);
const PRIVATE_STATIC_SEGMENTS = new Set([
  ".codex-temp",
  ".codex-agents",
  ".edge-headless",
  ".git",
  ".github",
  "backend",
  "data",
  "node_modules"
]);
const IMAGE_PREVIEW_CACHE_FILE = path.join(DATA_DIR, "image-preview-cache.json");
const NINJAS_REQUESTS_FILE = path.join(DATA_DIR, "ninjas-requests.json");
const NINJAS_PROFILES_FILE = path.join(DATA_DIR, "ninjas-profiles.json");
const SALES_LISTINGS_FILE = path.join(DATA_DIR, "sales-listings.json");
const VR_RENTAL_LEADS_FILE = path.join(DATA_DIR, "vr-rental-leads.json");
const VISITS_FILE = path.join(DATA_DIR, "visits.json");
const HEARTBEATS_FILE = path.join(DATA_DIR, "heartbeats.json");
const COMMUNITY_REPORTS_FILE = path.join(DATA_DIR, "community-reports.json");
const ACRE_2026_POLL_FILE = path.join(DATA_DIR, "acre-2026-poll.json");
const SPRITE_CHECK_REVIEWS_FILE = path.join(DATA_DIR, "sprite-check-reviews.json");
const OFFICE_ORDERS_FILE = path.join(DATA_DIR, "office-orders.json");
const OFFICE_NEURAL_GROWTH_FILE = path.join(DATA_DIR, "office-neural-growth.json");
const WHATSAPP_CHAT_LOG_FILE = path.join(DATA_DIR, "whatsapp-chat-log.json");
const PUBPAID_SPRITE_SCOUT_FILE = path.join(DATA_DIR, "pubpaid-sprite-scout.json");
const PUBPAID_DEPOSITS_FILE = path.join(DATA_DIR, "pubpaid-deposits.json");
const PUBPAID_WITHDRAWALS_FILE = path.join(DATA_DIR, "pubpaid-withdrawals.json");
const PUBPAID_WALLETS_FILE = path.join(DATA_DIR, "pubpaid-wallets.json");
const PUBPAID_PVP_FILE = path.join(DATA_DIR, "pubpaid-pvp.json");
const LEGACY_BACKEND_DATA_DIR = path.join(ROOT_DIR, "backend", "data");
const LEGACY_PUBPAID_DEPOSITS_FILE = path.join(LEGACY_BACKEND_DATA_DIR, "pubpaidDeposits.json");
const LEGACY_PUBPAID_WITHDRAWALS_FILE = path.join(LEGACY_BACKEND_DATA_DIR, "pubpaidWithdrawals.json");
const LEGACY_PUBPAID_WALLETS_FILE = path.join(LEGACY_BACKEND_DATA_DIR, "pubpaidWallets.json");
const SITE_URL = String(process.env.SITE_URL || "").trim().replace(/\/+$/, "");
const WHATSAPP_CHAT_ENABLED = String(process.env.WHATSAPP_CHAT_ENABLED || "").trim().toLowerCase() === "true";
const WHATSAPP_CLOUD_TOKEN = String(process.env.WHATSAPP_CLOUD_TOKEN || "").trim();
const WHATSAPP_CLOUD_PHONE_NUMBER_ID = String(process.env.WHATSAPP_CLOUD_PHONE_NUMBER_ID || "").trim();
const WHATSAPP_WEBHOOK_VERIFY_TOKEN = String(process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || "").trim();
const WHATSAPP_CHAT_AUTOREPLY_ENABLED =
  String(process.env.WHATSAPP_CHAT_AUTOREPLY_ENABLED || "").trim().toLowerCase() !== "false";
const WHATSAPP_CHAT_AUTOREPLY_TEXT = String(
  process.env.WHATSAPP_CHAT_AUTOREPLY_TEXT ||
    "Recebi sua mensagem aqui no WhatsApp. A ponte com o Catalogo/Codex esta ativa e eu vou responder por aqui assim que possivel."
)
  .replace(/\s+/g, " ")
  .trim()
  .slice(0, 1000);
const SPRITE_CHECK_PASSWORD = String(process.env.SPRITE_CHECK_PASSWORD || "99831455").trim();
const FULL_ADMIN_PASSWORD = String(process.env.FULL_ADMIN_PASSWORD || "99831455A").trim();
const LOCALE = "pt-BR";
const TIME_ZONE = "America/Rio_Branco";
const NINJAS_PIX_KEY = String(process.env.NINJAS_PIX_KEY || "").trim();
const NINJAS_PIX_DEFAULT_AMOUNT = 5;
const NINJAS_PIX_RECEIVER_NAME = String(
  process.env.NINJAS_PIX_RECEIVER_NAME || "CATALOGO CRUZEIRO"
).trim();
const NINJAS_MERCHANT_NAME = String(
  process.env.NINJAS_MERCHANT_NAME || NINJAS_PIX_RECEIVER_NAME || "CATALOGO CZS"
).trim();
const NINJAS_MERCHANT_CITY = String(process.env.NINJAS_MERCHANT_CITY || "CRUZEIRO DO SUL").trim();
const PUBPAID_ALLOWED_AMOUNTS = [5, 10, 20, 50, 100];
const PUBPAID_PENDING_WINDOW_MS = 3 * 60 * 60 * 1000;
const PREVIEW_CLASS_BY_CATEGORY = {
  cotidiano: "thumb-cheia",
  saude: "thumb-saude",
  negocios: "thumb-pascoa",
  policia: "thumb-policia",
  educacao: "thumb-educacao",
  prefeitura: "thumb-politica",
  politica: "thumb-politica",
  esporte: "thumb-cultura",
  "utilidade publica": "thumb-alerta",
  "festas & social": "thumb-social",
  social: "thumb-social",
  cultura: "thumb-cultura"
};
const CATEGORY_LABEL_BY_KEY = {
  cotidiano: "Cotidiano",
  prefeitura: "Prefeitura",
  politica: "Política",
  policia: "Polícia",
  saude: "Saúde",
  educacao: "Educação",
  negocios: "Negócios",
  cultura: "Cultura",
  esporte: "Esporte",
  social: "Social",
  "festas & social": "Festas & Social",
  "utilidade publica": "Utilidade Pública"
};
const CATEGORY_ALIAS_MAP = {
  cotidiano: "cotidiano",
  politica: "politica",
  policia: "policia",
  saude: "saude",
  educacao: "educacao",
  economia: "negocios",
  negocios: "negocios",
  cultura: "cultura",
  variedades: "cultura",
  esporte: "esporte",
  "destaques esporte": "esporte",
  governo: "prefeitura",
  prefeitura: "prefeitura",
  editais: "utilidade publica",
  detran: "utilidade publica",
  social: "social",
  "festas & social": "festas & social",
  "ac24horas play": "cultura",
  newsletter: "",
  nacional: "",
  geral: "",
  acre: "",
  "acre 03": "",
  "destaque 1": "",
  "extra total": ""
};
const ACRE_2026_POLL_OPTIONS = {
  ageRanges: [
    "16 a 17 anos",
    "18 a 24 anos",
    "25 a 34 anos",
    "35 a 44 anos",
    "45 a 59 anos",
    "60 anos ou mais",
    "Prefiro nao informar"
  ],
  previousVotes: [
    "Gladson Cameli",
    "Jorge Viana",
    "Marcia Bittar",
    "Sergio Petecao",
    "Branco/Nulo",
    "Nao lembro/Nao votei"
  ],
  vote2026: [
    "Alan Rick",
    "Mailza Assis",
    "Marcus Alexandre",
    "Ainda nao decidi",
    "Branco/Nulo"
  ],
  secondChoice: [
    "Alan Rick",
    "Mailza Assis",
    "Marcus Alexandre",
    "Ainda nao decidi",
    "Branco/Nulo",
    "Nenhuma segunda opcao"
  ],
  rejection: [
    "Nao rejeito nenhum",
    "Alan Rick",
    "Mailza Assis",
    "Marcus Alexandre",
    "Tiao Bocalom",
    "Rejeito todos"
  ],
  priorities: [
    "Emprego e renda",
    "Saude",
    "Seguranca",
    "Educacao",
    "Infraestrutura e mobilidade",
    "Combate a corrupcao",
    "Custo de vida e precos"
  ],
  governmentEvaluation: ["Otimo", "Bom", "Regular", "Ruim", "Pessimo", "Nao sabe"],
  stateDirection: ["No rumo certo", "No rumo errado", "Nem certo nem errado", "Nao sabe"],
  desiredCycle: ["Mudanca", "Continuidade", "Equilibrio", "Nao sabe"],
  voteCertainty: ["Ja esta decidido", "Pode mudar", "Muito indefinido"],
  politicalAttention: ["Acompanho sempre", "Acompanho as vezes", "Quase nao acompanho"],
  decisionDriver: [
    "Resultados concretos",
    "Postura e lideranca",
    "Combate a corrupcao",
    "Alinhamento politico",
    "Propostas para minha regiao"
  ]
};
const STATIC_PAGE_SEO = {
  "/": {
    title: `${SITE_NAME} | Jornal Agregador Local`,
    description: DEFAULT_SITE_DESCRIPTION,
    themeColor: "#1E3A5F",
    colorScheme: "light",
    ogType: "website",
    schemaType: "WebSite",
    priority: "1.0",
    changefreq: "hourly",
    fileName: "index.html"
  },
  "/arquivo.html": {
    title: `Pesquisa Completa | ${SITE_NAME}`,
    description:
      "Pesquisa completa do arquivo de noticias verificadas com filtros, rolagem e busca por tema, fonte, editoria e resumo.",
    themeColor: "#1E3A5F",
    colorScheme: "light",
    ogType: "website",
    schemaType: "CollectionPage",
    priority: "0.78",
    changefreq: "daily",
    fileName: "arquivo.html"
  },
  "/catalogo-servicos.html": {
    title: `Catalogo de Servicos | ${SITE_NAME}`,
    description:
      "Guia local com telefones, WhatsApp, links e modulos de restaurantes, saude, emergencia, transporte, hospedagem e utilidade publica em Cruzeiro do Sul.",
    themeColor: "#15304C",
    colorScheme: "light",
    ogType: "website",
    schemaType: "CollectionPage",
    priority: "0.72",
    changefreq: "weekly",
    fileName: "catalogo-servicos.html"
  },
  "/candidato.html": {
    title: `Portal do Candidato | ${SITE_NAME}`,
    description:
      "Historico, posicao politica, realizacoes, fontes e pontuacao editorial dos nomes monitorados nas eleicoes do Acre.",
    themeColor: "#1E3A5F",
    colorScheme: "light",
    ogType: "profile",
    schemaType: "ProfilePage",
    sitemap: false,
    fileName: "candidato.html"
  },
  "/estudantes.html": {
    title: `Para Estudantes | ${SITE_NAME}`,
    description:
      "Hub estudantil com buscador de assuntos, trilhas da educacao infantil ate a faculdade, dicas de rotina, materiais e apoio para vida academica.",
    themeColor: "#1E3A5F",
    colorScheme: "light",
    ogType: "website",
    schemaType: "CollectionPage",
    priority: "0.8",
    changefreq: "daily",
    fileName: "estudantes.html"
  },
  "/escritorio.html": {
    title: `Escritorio dos Agentes | ${SITE_NAME}`,
    description:
      "Escritorio pixel art dos agentes especialistas do Catalogo Cruzeiro do Sul, com editoria, copy, games, infantil, vendas, design, revisao, fontes e automacao.",
    themeColor: "#111827",
    colorScheme: "dark light",
    ogType: "website",
    schemaType: "CollectionPage",
    priority: "0.76",
    changefreq: "weekly",
    fileName: "escritorio.html"
  },
  "/real-agents.html": {
    title: `Agentes Reais em Operacao | ${SITE_NAME}`,
    description:
      "Painel operacional dos agentes reais do Catalogo Cruzeiro do Sul, com escritorios, capacidades, fila de monitoramento e ideias geradas a partir do jornal.",
    themeColor: "#101827",
    colorScheme: "dark light",
    ogType: "website",
    schemaType: "CollectionPage",
    priority: "0.74",
    changefreq: "hourly",
    fileName: "real-agents.html"
  },
  "/cheffe-call.html": {
    title: `Cheffe Call | ${SITE_NAME}`,
    description:
      "Sala de reuniao dos agentes reais, com escritorio bitmap, pausa operacional, memoria da reuniao, agente do dia, escritorio do dia e acao do dia.",
    themeColor: "#120f1a",
    colorScheme: "dark light",
    ogType: "website",
    schemaType: "CollectionPage",
    priority: "0.73",
    changefreq: "hourly",
    fileName: "cheffe-call.html"
  },
  "/escritorio-nerd.html": {
    title: `Escritorio Nerd | ${SITE_NAME}`,
    description:
      "Escritorio nerd em pixel art com o time de game dev do PubPaid, incluindo game design, fisica, HUD, pixel art, som, playtest e estabilidade.",
    themeColor: "#170d2d",
    colorScheme: "dark light",
    ogType: "website",
    schemaType: "CollectionPage",
    priority: "0.74",
    changefreq: "weekly",
    fileName: "escritorio-nerd.html"
  },
  "/escritorio-ninjas.html": {
    title: `Escritorio de Ninjas | ${SITE_NAME}`,
    description:
      "Escritorio em pixel art com 50 especialistas focados em sprites 2D, tilesets, props, HUD, efeitos, licencas, curadoria e criacao propria para os jogos do portal.",
    themeColor: "#0F1628",
    colorScheme: "dark light",
    ogType: "website",
    schemaType: "CollectionPage",
    priority: "0.7",
    changefreq: "weekly",
    fileName: "escritorio-ninjas.html"
  },
  "/escritorio-arte.html": {
    title: `Escritorio de Arte | ${SITE_NAME}`,
    description:
      "Escritorio de Arte com 50 agentes de Design Art e Programacao de Game Design estudando pixel art, sprites, engine, colisao, fisica, mapas e jogos junto com os Ninjas.",
    themeColor: "#111827",
    colorScheme: "dark light",
    ogType: "website",
    schemaType: "CollectionPage",
    priority: "0.72",
    changefreq: "weekly",
    fileName: "escritorio-arte.html"
  },
  "/esttiles.html": {
    title: `Esttiles | Editorial de Moda e Estilo | ${SITE_NAME}`,
    description:
      "Subsite editorial de moda com 50 agentes de estilo, passarela, beleza, fotografia, branding, vitrine e cobertura de moda local e cultural.",
    themeColor: "#182235",
    colorScheme: "dark light",
    ogType: "website",
    schemaType: "CollectionPage",
    priority: "0.72",
    changefreq: "weekly",
    fileName: "esttiles.html"
  },
  "/sprites-check-change.html": {
    title: `SPRTIS CHECK & CHANGE | ${SITE_NAME}`,
    description:
      "Painel administrativo para revisar sprites, itens, cenarios e assets capturados pela equipe Ninja antes de aplicar mudancas nos jogos.",
    themeColor: "#101827",
    colorScheme: "dark light",
    ogType: "website",
    schemaType: "CollectionPage",
    priority: "0.48",
    changefreq: "weekly",
    fileName: "sprites-check-change.html"
  },
  "/games.html": {
    title: `Canal Tech Gamer | ${SITE_NAME}`,
    description:
      "Canal Tech Gamer com noticias de games, anime, Roblox, Mario Kart World, Game Pass, PlayStation Plus, trailers oficiais e guias para familias.",
    themeColor: "#08142A",
    colorScheme: "dark light",
    ogType: "website",
    schemaType: "CollectionPage",
    priority: "0.83",
    changefreq: "daily",
    fileName: "games.html"
  },
  "/animes.html": {
    title: `Radar Anime | ${SITE_NAME}`,
    description:
      "Pagina editorial de anime, manga, dublagem, cultura pop, trailers, estreias, comunidades de fas e pontes com games.",
    themeColor: "#1D1238",
    colorScheme: "dark light",
    ogType: "website",
    schemaType: "CollectionPage",
    priority: "0.78",
    changefreq: "daily",
    fileName: "animes.html"
  },
  "/infantil.html": {
    title: `Clube Infantil | ${SITE_NAME}`,
    description:
      "Canal infantil com personagens conhecidos, desenhos, Roblox, Minecraft, creators de conteudo familiar, noticias de games, macetes e leitura acompanhada.",
    themeColor: "#1E3A5F",
    colorScheme: "light",
    ogType: "website",
    schemaType: "CollectionPage",
    priority: "0.8",
    changefreq: "daily",
    fileName: "infantil.html"
  },
  "/legal.html": {
    title: `${SITE_NAME} | Termos de Uso e Aviso de Privacidade`,
    description:
      "Termos de uso, aviso de privacidade, cookies, direitos autorais e regras de transparencia do Catalogo Cruzeiro do Sul.",
    themeColor: "#1E3A5F",
    colorScheme: "light",
    ogType: "article",
    schemaType: "WebPage",
    priority: "0.42",
    changefreq: "monthly",
    fileName: "legal.html"
  },
  "/ninjas.html": {
    title: "Ninjas Cruzeiro | Pedidos, Curriculos e Oportunidades",
    description:
      "Hub Ninjas Cruzeiro para pedir servicos locais, pagar no Pix, montar curriculo, entrar com perfil profissional e acompanhar vagas e concursos de Cruzeiro do Sul e regiao.",
    themeColor: "#10213D",
    colorScheme: "light",
    ogType: "website",
    schemaType: "Service",
    priority: "0.82",
    changefreq: "daily",
    fileName: "ninjas.html"
  },
  "/noticia.html": {
    title: `${SITE_NAME} | Noticia`,
    description:
      "Pagina interna do Catalogo Cruzeiro do Sul com resumo editorial, contexto e link para a fonte consultada.",
    themeColor: "#1E3A5F",
    colorScheme: "light",
    ogType: "article",
    schemaType: "NewsArticle",
    sitemap: false,
    fileName: "noticia.html"
  },
  "/remocao.html": {
    title: `${SITE_NAME} | Pedido de Remocao`,
    description:
      "Fluxo de pedido de revisao ou remocao de conteudo do Catalogo Cruzeiro do Sul com analise manual.",
    robots: "noindex,follow",
    themeColor: "#1E3A5F",
    colorScheme: "light",
    ogType: "website",
    schemaType: "ContactPage",
    sitemap: false,
    fileName: "remocao.html"
  },
  "/pesquisa-acre-2026.html": {
    title: `Enquete de Opiniao Acre 2026 | ${SITE_NAME}`,
    description:
      "Enquete publica espontanea, pessoal e sem carater cientifico sobre opiniao no Acre em 2026, com parciais automaticas das respostas voluntarias.",
    robots: "noindex,nofollow,noarchive",
    themeColor: "#081526",
    colorScheme: "dark light",
    ogType: "website",
    schemaType: "WebPage",
    sitemap: false,
    fileName: "pesquisa-acre-2026.html"
  },
  "/analyses.html": {
    title: `Analyses | Auditoria Manual de Fotos | ${SITE_NAME}`,
    description:
      "Fila manual da auditoria de fotos do Catalogo, com noticias em analise, motivos do bloqueio e atalhos para revisar imagem, foco e materia.",
    robots: "noindex,follow",
    themeColor: "#0C1324",
    colorScheme: "dark light",
    ogType: "website",
    schemaType: "CollectionPage",
    sitemap: false,
    fileName: "analyses.html"
  },
  "/pubpaid.html": {
    title: `PubPaid Demo | ${SITE_NAME}`,
    description:
      "Demo jogavel de um bar pixelado com avatar, perfil, lobby local, quatro mesas PvP e moedas ficticias para validar a experiencia do PubPaid.",
    themeColor: "#120C24",
    colorScheme: "dark light",
    ogType: "website",
    schemaType: "CollectionPage",
    priority: "0.63",
    changefreq: "weekly",
    fileName: "pubpaid.html"
  },
  "/pubpaid-v2.html": {
    title: `PubPaid 2.0 | Rua Viva e PvP`,
    description:
      "Laboratorio jogavel da PubPaid 2.0 com rua viva, fachada do bar, creditos de teste e blueprint PvP real.",
    robots: "noindex,nofollow",
    themeColor: "#070A18",
    colorScheme: "dark",
    ogType: "website",
    schemaType: "Game",
    sitemap: false,
    fileName: "pubpaid-v2.html"
  },
  "/palavras-da-rosa.html": {
    title: `Palavras da Rosa | ${SITE_NAME}`,
    description:
      "Jogo especial de palavras cruzadas com tema floral, visual rosa e uma singela homenagem integrada ao jornal.",
    themeColor: "#E91E63",
    colorScheme: "light",
    ogType: "website",
    schemaType: "Game",
    priority: "0.58",
    changefreq: "weekly",
    fileName: "palavras-da-rosa.html"
  },
  "/vendas.html": {
    title: `Vendas Locais | ${SITE_NAME}`,
    description:
      "Marketplace local para anunciar usados, eletronicos, moveis, veiculos, moda, casa e desapegos de Cruzeiro do Sul.",
    themeColor: "#102744",
    colorScheme: "light",
    ogType: "website",
    schemaType: "CollectionPage",
    priority: "0.74",
    changefreq: "daily",
    fileName: "vendas.html"
  }
};
const GENERIC_CATEGORY_KEYS = new Set([
  "",
  "newsletter",
  "nacional",
  "geral",
  "acre",
  "acre 03",
  "destaque 1",
  "extra total"
]);
const RSS_SOURCES = (() => {
  try {
    const list = require("./backend/source-config.js");
    return Array.isArray(list) ? list : [];
  } catch (_error) {
    return [];
  }
})();
const NEWS_REFRESH_INTERVAL_MS = Math.max(
  1000 * 60 * 5,
  Number(process.env.NEWS_REFRESH_INTERVAL_MS || 1000 * 60 * 15)
);
const TOPIC_FEED_TTL_MS = Math.max(
  1000 * 60 * 5,
  Number(process.env.TOPIC_FEED_TTL_MS || 1000 * 60 * 15)
);
const TOPIC_FEED_FALLBACK_FILE = path.join(ROOT_DIR, "data", "topic-feed-fallback.json");
const TOPIC_FEED_CONFIG = {
  study: [
    {
      id: "inside-higher-ed",
      name: "Inside Higher Ed",
      feedUrl: "https://www.insidehighered.com/rss.xml",
      siteUrl: "https://www.insidehighered.com/news",
      defaultCategory: "Educacao",
      topicGroup: "campus"
    },
    {
      id: "edsurge",
      name: "EdSurge",
      feedUrl: "https://www.edsurge.com/articles_rss",
      siteUrl: "https://www.edsurge.com/news",
      defaultCategory: "Educacao",
      topicGroup: "edtech"
    },
    {
      id: "hechinger",
      name: "The Hechinger Report",
      feedUrl: "https://hechingerreport.org/feed/",
      siteUrl: "https://hechingerreport.org/",
      defaultCategory: "Educacao",
      topicGroup: "acesso"
    },
    {
      id: "pie-news",
      name: "The PIE News",
      feedUrl: "https://thepienews.com/feed/",
      siteUrl: "https://thepienews.com/news/",
      defaultCategory: "Educacao",
      topicGroup: "mundo"
    }
  ],
  kids: [
    {
      id: "youtube-blog",
      name: "YouTube Blog",
      feedUrl: "https://blog.youtube/rss",
      siteUrl: "https://blog.youtube/",
      defaultCategory: "Cultura",
      topicGroup: "creators"
    },
    {
      id: "animation-magazine",
      name: "Animation Magazine",
      feedUrl: "https://www.animationmagazine.net/feed/",
      siteUrl: "https://www.animationmagazine.net/",
      defaultCategory: "Cartoons",
      topicGroup: "animation"
    },
    {
      id: "awn",
      name: "Animation World Network",
      feedUrl: "https://www.awn.com/news/rss.xml",
      siteUrl: "https://www.awn.com/",
      defaultCategory: "Cartoons",
      topicGroup: "animation"
    },
    {
      id: "cartoon-brew",
      name: "Cartoon Brew",
      feedUrl: "https://www.cartoonbrew.com/feed",
      siteUrl: "https://www.cartoonbrew.com/",
      defaultCategory: "Cartoons",
      topicGroup: "animation"
    },
    {
      id: "anime-news-network",
      name: "Anime News Network",
      feedUrl: "https://www.animenewsnetwork.com/all/rss.xml?ann-edition=us",
      siteUrl: "https://www.animenewsnetwork.com/",
      defaultCategory: "Anime",
      topicGroup: "anime"
    },
    {
      id: "toy-insider",
      name: "The Toy Insider",
      feedUrl: "https://thetoyinsider.com/feed/",
      siteUrl: "https://thetoyinsider.com/",
      defaultCategory: "Kids",
      topicGroup: "games"
    },
    {
      id: "tubefilter",
      name: "Tubefilter",
      feedUrl: "https://feeds.feedburner.com/tubefilter",
      siteUrl: "https://www.tubefilter.com/",
      defaultCategory: "Creators",
      topicGroup: "creators"
    }
  ],
  games: [
    {
      id: "youtube-blog",
      name: "YouTube Blog",
      feedUrl: "https://blog.youtube/rss",
      siteUrl: "https://blog.youtube/",
      defaultCategory: "Creators",
      topicGroup: "creators"
    },
    {
      id: "xbox-wire",
      name: "Xbox Wire",
      feedUrl: "https://news.xbox.com/en-us/feed/",
      siteUrl: "https://news.xbox.com/en-us/",
      defaultCategory: "Games",
      topicGroup: "premieres"
    },
    {
      id: "playstation-blog",
      name: "PlayStation Blog",
      feedUrl: "https://feeds.feedburner.com/psblog",
      siteUrl: "https://blog.playstation.com/",
      defaultCategory: "Games",
      topicGroup: "premieres"
    },
    {
      id: "the-verge-gaming",
      name: "The Verge Gaming",
      feedUrl: "https://www.theverge.com/rss/games/index.xml",
      siteUrl: "https://www.theverge.com/games",
      defaultCategory: "Games",
      topicGroup: "games"
    },
    {
      id: "anime-news-network",
      name: "Anime News Network",
      feedUrl: "https://www.animenewsnetwork.com/all/rss.xml?ann-edition=us",
      siteUrl: "https://www.animenewsnetwork.com/",
      defaultCategory: "Anime",
      topicGroup: "anime"
    },
    {
      id: "tubefilter",
      name: "Tubefilter",
      feedUrl: "https://feeds.feedburner.com/tubefilter",
      siteUrl: "https://www.tubefilter.com/",
      defaultCategory: "Creators",
      topicGroup: "creators"
    }
  ],
  buzz: [
    {
      id: "g1-pop-arte",
      name: "G1 Pop & Arte",
      feedUrl: "https://g1.globo.com/rss/g1/pop-arte/",
      siteUrl: "https://g1.globo.com/pop-arte/",
      defaultCategory: "Cultura",
      topicGroup: "cinema"
    },
    {
      id: "terra-diversao",
      name: "Terra Diversao",
      feedUrl: "https://www.terra.com.br/rss/Controller?channelid=7f6c931cc6b6d310VgnVCM4000009bcceb0aRCRD",
      siteUrl: "https://www.terra.com.br/diversao/",
      defaultCategory: "Cultura",
      topicGroup: "celebridades"
    },
    {
      id: "the-verge",
      name: "The Verge",
      feedUrl: "https://www.theverge.com/rss/index.xml",
      siteUrl: "https://www.theverge.com/",
      defaultCategory: "Novidades",
      topicGroup: "novidades"
    },
    {
      id: "youtube-blog",
      name: "YouTube Blog",
      feedUrl: "https://blog.youtube/rss",
      siteUrl: "https://blog.youtube/",
      defaultCategory: "Novidades",
      topicGroup: "creators"
    }
  ],
  politics: [
    {
      id: "g1-politica",
      name: "G1 Politica",
      feedUrl: "https://g1.globo.com/rss/g1/politica/",
      siteUrl: "https://g1.globo.com/politica/",
      defaultCategory: "Politica",
      topicGroup: "brasilia"
    },
    {
      id: "senado-noticias",
      name: "Senado Noticias",
      feedUrl: "https://www12.senado.leg.br/noticias/feed",
      siteUrl: "https://www12.senado.leg.br/noticias",
      defaultCategory: "Politica",
      topicGroup: "congresso"
    },
    {
      id: "agencia-brasil-politica",
      name: "Agencia Brasil Politica",
      feedUrl: "https://agenciabrasil.ebc.com.br/rss/politica/feed.xml",
      siteUrl: "https://agenciabrasil.ebc.com.br/politica",
      defaultCategory: "Politica",
      topicGroup: "nacional"
    },
    {
      id: "cnn-brasil-politica",
      name: "CNN Brasil Politica",
      feedUrl: "https://www.cnnbrasil.com.br/politica/feed/",
      siteUrl: "https://www.cnnbrasil.com.br/politica/",
      defaultCategory: "Politica",
      topicGroup: "nacional"
    }
  ]
};
const IMAGE_PREVIEW_ALLOWLIST = [
  "ac24horas.com",
  "jurua24horas.com",
  "juruaonline.com.br",
  "agencia.ac.gov.br",
  "cruzeirodosul.net",
  "cruzeirodosul.ac.gov.br",
  "portalacre.com.br",
  "noticiasdahora.com.br",
  "amac.com.br",
  "ifac.edu.br",
  "blog.youtube",
  "news.xbox.com",
  "blog.playstation.com",
  "animenewsnetwork.com",
  "cartoonbrew.com",
  "tubefilter.com",
  "www.theverge.com",
  "theverge.com",
  "insidehighered.com",
  "edsurge.com",
  "hechingerreport.org",
  "thepienews.com",
  "nintendo.com",
  "roblox.com",
  "ir.roblox.com",
  "crunchyroll.com",
  "animationmagazine.net",
  "awn.com",
  "thetoyinsider.com",
  "press.disneyplus.com",
  "bluey.tv",
  "nick.com",
  "galinhapintadinha.com.br",
  "mundobita.com.br",
  "turmadamonica.uol.com.br"
];
const DYNAMIC_ASSET_BASENAMES = new Set([
  "news-data.js",
  "social-rss-data.js",
  "elections-data.js",
  "sidebar-data.js",
  "runtime-config.js"
]);
const NINJAS_OPPORTUNITIES_UPDATED_AT = "2026-04-14";
const NINJAS_OPPORTUNITIES = [
  {
    id: "sine-acre-painel-vagas",
    kind: "vaga",
    badge: "Sine Acre",
    city: "Acre / confirmar lotacao local",
    title: "Painel estadual com funcoes abertas para vendas, recepcao, construcao e suporte",
    summary:
      "O painel oficial do Sine Acre lista vagas como consultor de vendas, recepcionista, promotor de vendas, vendas em loja, entregador de gas, engenheiro civil em estagio, pedreiro e servente de obras. Como a pagina muda com frequencia e nem sempre destaca o municipio, vale checar se ha encaminhamento para Cruzeiro do Sul.",
    publishedAt: "Pesquisa em 14 de abril de 2026",
    deadline: "Atualizacao continua",
    status: "aberto",
    sourceLabel: "Painel de vagas do Sine Acre",
    sourceUrl: "https://sine.ac.gov.br/vagas/"
  },
  {
    id: "ufac-tae-2026",
    kind: "concurso",
    badge: "UFAC",
    city: "Rio Branco e Cruzeiro do Sul",
    title: "Concurso tecnico-administrativo da UFAC com vagas e provas em Cruzeiro do Sul",
    summary:
      "Edital publicado em 31 de marco de 2026 para a carreira tecnico-administrativa em educacao. As inscricoes vao de 6 de abril de 2026 a 7 de maio de 2026, e o edital menciona aplicacao de provas em Cruzeiro do Sul para cargos com lotacao no municipio.",
    publishedAt: "2026-03-31",
    deadline: "2026-05-07",
    status: "inscricoes abertas",
    sourceLabel: "UFAC - Edital no 1/2026 (PDF)",
    sourceUrl:
      "https://www3.ufac.br/prodgep/2026/edital-no-1-de-30-de-marco-de-2026-concurso-publico-para-carreira-de-tecnico-administrativo-em-educacao/01-edital-2026-03-31-dou.pdf"
  },
  {
    id: "see-acre-pss-professor-2026",
    kind: "concurso",
    badge: "SEE Acre",
    city: "Interior do Acre",
    title: "PSS 001/2026 segue com chamadas para professor temporario no interior",
    summary:
      "A Secretaria de Educacao do Acre mantem o processo seletivo simplificado para professor temporario e ja publicou convocacoes para o interior. E uma trilha boa para quem quer acompanhar chamadas, lotacoes e documentos exigidos.",
    publishedAt: "Edital 001/2026",
    deadline: "acompanhar convocacoes",
    status: "em andamento",
    sourceLabel: "SEE Acre - PSS Professor Temporario",
    sourceUrl: "https://see.ac.gov.br/edital-pss-professor-temporario/"
  },
  {
    id: "ifac-cruzeiro-professor-substituto",
    kind: "concurso",
    badge: "IFAC Cruzeiro do Sul",
    city: "Cruzeiro do Sul",
    title: "Selecao de professor substituto em cinco areas no campus Cruzeiro do Sul",
    summary:
      "Publicado em 10 de fevereiro de 2026. O processo abriu vagas para Fisica, Historia, Lingua Portuguesa, Engenharia de Pesca e Engenharia Ambiental, com remuneracao entre R$ 4.326,60 e R$ 8.058,29 mais beneficios.",
    publishedAt: "2026-02-10",
    deadline: "2026-02-15",
    status: "encerrado",
    sourceLabel: "IFAC - noticia oficial",
    sourceUrl:
      "https://www.ifac.edu.br/noticias/2026/fevereiro/ifac-de-cruzeiro-do-sul-abre-selecao-para-professor-substituto-em-cinco-areas"
  },
  {
    id: "ufac-pet-agronomia-czs",
    kind: "bolsa",
    badge: "UFAC Campus Floresta",
    city: "Cruzeiro do Sul",
    title: "Selecao de bolsistas para o grupo PET Agronomia/CZS",
    summary:
      "Edital da Prograd para selecao de bolsistas do grupo PET Agronomia no campus Cruzeiro do Sul. Boa oportunidade para estudante que quer portfolio academico, extensao e primeiro historico relevante no curriculo.",
    publishedAt: "2026-03-05",
    deadline: "2026-03-12",
    status: "consultar edital",
    sourceLabel: "UFAC - PET Agronomia CZS",
    sourceUrl:
      "https://www3.ufac.br/prograd/2026/edital-prograd-ndeg-16-2026-processo-seletivo-para-bolsistas-do-grupo-pet-agronomia-czs/edital_prograd_n-c2-ba16-2026_-_pet_agronomia_assinado.pdf"
  },
  {
    id: "ufac-midialab-bolsas",
    kind: "bolsa",
    badge: "UFAC",
    city: "Acre / acompanhar lotacao",
    title: "MidiaLab da UFAC com bolsas para laboratorio de midias digitais",
    summary:
      "Edital da Prograd com 3 bolsas para atuacao no Laboratorio de Midias Digitais do Campus Floresta, em Cruzeiro do Sul. Mesmo quando nao encaixa como emprego tradicional, entra muito bem para portfolio e experiencia aplicada.",
    publishedAt: "2026-02-02",
    deadline: "2026-02-06",
    status: "consultar edital",
    sourceLabel: "UFAC - MídiaLab",
    sourceUrl:
      "https://www3.ufac.br/prograd/2026/edital-prograd-ndeg-12-2026-processo-seletivo-para-bolsista-do-laboratorio-de-midias-digitais-midialab/edital_12-2026_-_midialab_assinado.pdf"
  },
  {
    id: "prefeitura-pnab-2026",
    kind: "edital",
    badge: "Prefeitura de Cruzeiro do Sul",
    city: "Cruzeiro do Sul",
    title: "Editais da Lei Aldir Blanc 2026 com mais de R$ 634 mil no municipio",
    summary:
      "A Prefeitura informou em 27 de marco de 2026 o lancamento de seis editais culturais com investimento superior a R$ 634 mil. As inscricoes seguem ate 20 de abril de 2026, servindo para artistas, produtores, pontos de cultura e projetos locais.",
    publishedAt: "2026-03-27",
    deadline: "2026-04-20",
    status: "inscricoes abertas",
    sourceLabel: "Prefeitura de Cruzeiro do Sul - Lei Aldir Blanc 2026",
    sourceUrl:
      "https://www.cruzeirodosul.ac.gov.br/post/prefeitura-de-cruzeiro-do-sul-lan%C3%A7a-editais-da-lei-aldir-blanc-2026-de-r-r-634-mil-e-fortalece-ince"
  }
];
const IMAGE_PREVIEW_CACHE = new Map();
const IMAGE_PREVIEW_TTL_MS = 1000 * 60 * 60 * 12;
const REMOTE_REQUEST_HEADERS = {
  "User-Agent": "Mozilla/5.0 (compatible; CatalogoCruzeiroBot/1.0; +https://localhost)",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
};
const COMPRESSIBLE_MIME_TYPES = [
  "text/",
  "application/javascript",
  "application/json",
  "image/svg+xml"
];

let imagePreviewCacheLoaded = false;
let imagePreviewCacheWriteTimer = null;
const JSON_FILE_MUTATION_QUEUES = new Map();

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  seedDataDirFromDefault();
}

function seedDataDirFromDefault() {
  if (path.resolve(DATA_DIR) === path.resolve(DEFAULT_DATA_DIR)) {
    return;
  }

  if (!fs.existsSync(DEFAULT_DATA_DIR)) {
    return;
  }

  const entries = fs.readdirSync(DEFAULT_DATA_DIR, { withFileTypes: true });
  entries.forEach((entry) => {
    if (!entry.isFile()) return;
    const sourcePath = path.join(DEFAULT_DATA_DIR, entry.name);
    const targetPath = path.join(DATA_DIR, entry.name);
    if (fs.existsSync(targetPath)) return;
    fs.copyFileSync(sourcePath, targetPath);
  });
}

function safeJoin(base, targetPath) {
  const target = path.normalize(path.join(base, targetPath));
  if (!target.startsWith(base)) return null;
  return target;
}

function readJson(filePath, fallback) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw);
  } catch (_error) {
    return fallback;
  }
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const tempFilePath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
  fs.writeFileSync(tempFilePath, JSON.stringify(value, null, 2), "utf-8");
  fs.renameSync(tempFilePath, filePath);
}

function mutateJsonFile(filePath, fallback, mutator) {
  const previousTask = JSON_FILE_MUTATION_QUEUES.get(filePath) || Promise.resolve();
  const nextTask = previousTask
    .catch(() => {})
    .then(async () => {
      const currentValue = readJson(filePath, fallback);
      const result = await Promise.resolve(mutator(currentValue));
      const payload =
        result &&
        typeof result === "object" &&
        !Array.isArray(result) &&
        Object.prototype.hasOwnProperty.call(result, "value")
          ? result
          : { value: result };
      writeJson(filePath, payload.value);
      return payload;
    });

  const queueMarker = nextTask.catch(() => {});
  JSON_FILE_MUTATION_QUEUES.set(filePath, queueMarker);

  return nextTask.finally(() => {
    if (JSON_FILE_MUTATION_QUEUES.get(filePath) === queueMarker) {
      JSON_FILE_MUTATION_QUEUES.delete(filePath);
    }
  });
}

function buildStorageHealthPayload({ writeProbe = false } = {}) {
  const checks = [];
  const addCheck = (name, ok, details = {}) => {
    checks.push({
      name,
      ok: Boolean(ok),
      ...details
    });
  };

  let dataDirStat = null;
  try {
    ensureDataDir();
    dataDirStat = fs.statSync(DATA_DIR);
    addCheck("data-dir-exists", dataDirStat.isDirectory(), { target: DATA_DIR });
  } catch (error) {
    addCheck("data-dir-exists", false, { target: DATA_DIR, error: String(error?.message || error) });
  }

  const configuredByEnv = Boolean(String(process.env.DATA_DIR || "").trim());
  const renderExpectedPath = "/opt/render/project/src/render-data";
  const usingDefaultDataDir = path.resolve(DATA_DIR) === path.resolve(DEFAULT_DATA_DIR);
  const renderPersistentPath =
    path.resolve(DATA_DIR) === path.resolve(renderExpectedPath) ||
    path.resolve(DATA_DIR).startsWith(`${path.resolve(renderExpectedPath)}${path.sep}`);

  addCheck("data-dir-env", configuredByEnv || !IS_PRODUCTION, {
    configuredByEnv,
    usingDefaultDataDir,
    expectedRenderPath: renderExpectedPath
  });

  if (IS_PRODUCTION) {
    addCheck("render-persistent-path", renderPersistentPath, {
      expected: renderExpectedPath,
      target: DATA_DIR
    });
  }

  let acrePollResponses = 0;
  let acrePollFileSize = 0;
  try {
    const records = readJson(ACRE_2026_POLL_FILE, []);
    acrePollResponses = Array.isArray(records) ? records.length : 0;
    acrePollFileSize = fs.existsSync(ACRE_2026_POLL_FILE) ? fs.statSync(ACRE_2026_POLL_FILE).size : 0;
    addCheck("acre-poll-readable", Array.isArray(records), {
      file: ACRE_2026_POLL_FILE,
      responses: acrePollResponses,
      bytes: acrePollFileSize
    });
  } catch (error) {
    addCheck("acre-poll-readable", false, {
      file: ACRE_2026_POLL_FILE,
      error: String(error?.message || error)
    });
  }

  if (writeProbe) {
    const probeFile = path.join(DATA_DIR, ".storage-health.json");
    const marker = crypto.randomBytes(8).toString("hex");
    const probePayload = {
      marker,
      pid: process.pid,
      checkedAt: new Date().toISOString()
    };

    try {
      writeJson(probeFile, probePayload);
      const savedProbe = readJson(probeFile, null);
      addCheck("storage-write-probe", savedProbe?.marker === marker, {
        file: probeFile,
        checkedAt: probePayload.checkedAt
      });
    } catch (error) {
      addCheck("storage-write-probe", false, {
        file: probeFile,
        error: String(error?.message || error)
      });
    }
  }

  const ok = checks.every((check) => check.ok);
  const persistentExpected = IS_PRODUCTION ? renderPersistentPath : !usingDefaultDataDir || configuredByEnv;

  return {
    ok,
    service: "catalogo-cruzeiro",
    storage: {
      target: DATA_DIR,
      defaultTarget: DEFAULT_DATA_DIR,
      configuredByEnv,
      usingDefaultDataDir,
      persistentExpected,
      dataDirMode: dataDirStat ? dataDirStat.mode : null
    },
    acre2026Poll: {
      file: ACRE_2026_POLL_FILE,
      responses: acrePollResponses,
      bytes: acrePollFileSize
    },
    checks,
    checkedAt: new Date().toISOString()
  };
}

function loadImagePreviewCache() {
  if (imagePreviewCacheLoaded) return;
  imagePreviewCacheLoaded = true;

  const persisted = readJson(IMAGE_PREVIEW_CACHE_FILE, {});
  if (!persisted || typeof persisted !== "object" || Array.isArray(persisted)) {
    return;
  }

  Object.entries(persisted).forEach(([sourceUrl, entry]) => {
    if (!entry || typeof entry !== "object") return;
    IMAGE_PREVIEW_CACHE.set(sourceUrl, {
      url: String(entry.url || ""),
      at: Number(entry.at || 0)
    });
  });
}

function persistImagePreviewCache() {
  if (!imagePreviewCacheLoaded) return;

  const payload = {};
  IMAGE_PREVIEW_CACHE.forEach((value, key) => {
    payload[key] = {
      url: String(value?.url || ""),
      at: Number(value?.at || Date.now())
    };
  });

  writeJson(IMAGE_PREVIEW_CACHE_FILE, payload);
}

function scheduleImagePreviewCacheWrite() {
  if (imagePreviewCacheWriteTimer) {
    clearTimeout(imagePreviewCacheWriteTimer);
  }

  imagePreviewCacheWriteTimer = setTimeout(() => {
    imagePreviewCacheWriteTimer = null;
    persistImagePreviewCache();
  }, 120);

  if (typeof imagePreviewCacheWriteTimer.unref === "function") {
    imagePreviewCacheWriteTimer.unref();
  }
}

function updateImagePreviewCache(sourceUrl, imageUrl) {
  loadImagePreviewCache();
  IMAGE_PREVIEW_CACHE.set(sourceUrl, {
    url: String(imageUrl || ""),
    at: Date.now()
  });
  scheduleImagePreviewCacheWrite();
}

function writeStaticNewsData(items = []) {
  const safeItems = items.slice(0, 120);
  const payload = `window.NEWS_DATA = ${JSON.stringify(safeItems, null, 2)};\n`;
  fs.writeFileSync(STATIC_NEWS_FILE, payload, "utf-8");
}

function getStaticNewsItems() {
  try {
    if (!fs.existsSync(STATIC_NEWS_FILE)) return [];

    const sandbox = { window: {} };
    vm.createContext(sandbox);
    vm.runInContext(fs.readFileSync(STATIC_NEWS_FILE, "utf-8"), sandbox, {
      filename: STATIC_NEWS_FILE,
      timeout: 1000
    });

    return Array.isArray(sandbox.window.NEWS_DATA) ? sandbox.window.NEWS_DATA : [];
  } catch (_error) {
    return [];
  }
}

function getElectionConfig() {
  try {
    if (!fs.existsSync(ELECTIONS_FILE)) return { offices: [] };

    const sandbox = { window: {} };
    vm.createContext(sandbox);
    vm.runInContext(fs.readFileSync(ELECTIONS_FILE, "utf-8"), sandbox, {
      filename: ELECTIONS_FILE,
      timeout: 1000
    });

    return sandbox.window.ELECTIONS_DATA || { offices: [] };
  } catch (_error) {
    return { offices: [] };
  }
}

function getServicesCatalogConfig() {
  try {
    if (!fs.existsSync(SERVICES_CATALOG_FILE)) return { modules: [] };

    const sandbox = { window: {} };
    vm.createContext(sandbox);
    vm.runInContext(fs.readFileSync(SERVICES_CATALOG_FILE, "utf-8"), sandbox, {
      filename: SERVICES_CATALOG_FILE,
      timeout: 1000
    });

    return sandbox.window.CATALOGO_SERVICOS_DATA || { modules: [] };
  } catch (_error) {
    return { modules: [] };
  }
}

function normalizeText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function slugify(value) {
  return normalizeText(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function isKnownCategoryKey(categoryKey) {
  return Boolean(CATEGORY_LABEL_BY_KEY[categoryKey]);
}

function formatCategoryLabel(categoryKey) {
  return CATEGORY_LABEL_BY_KEY[categoryKey] || CATEGORY_LABEL_BY_KEY.cotidiano;
}

function inferCategoryKeyFromContent(rawText) {
  const haystack = normalizeText(rawText);
  if (!haystack) return "";

  if (
    /\b(policia|policial|preso|prende|prisao|trafico|crime|assalto|roubo|furto|homicidio|estupr|foragido|delegacia|delegado|operacao)\b/.test(
      haystack
    )
  ) {
    return "policia";
  }

  if (
    /\b(saude|hospital|ubs|upa|medic|vacina|vacinacao|dengue|cirurg|sus|atendimento|doenca|doula)\b/.test(
      haystack
    )
  ) {
    return "saude";
  }

  if (
    /\b(educacao|escola|colegio|ifac|ufac|universidade|estudante|enem|vestibular|aula|ensino|professor)\b/.test(
      haystack
    )
  ) {
    return "educacao";
  }

  if (
    /\b(esporte|futebol|basquete|campeonato|atleta|jogo|serie d|tourao|humaita|galvez)\b/.test(
      haystack
    )
  ) {
    return "esporte";
  }

  if (
    /\b(utilidade|servico|alerta|defesa civil|alag|chuva|temporal|transito|detran|edital|inscric|prazo|abastecimento|limpeza|coleta|ponto facultativo|pagamento|abrigo|rodovia|estrada)\b/.test(
      haystack
    )
  ) {
    return "utilidade publica";
  }

  if (
    /\b(aleac|camara|deputad|senador|ministro|presidente|ex-presidente|bolsonaro|lula|stj|stf|eleicao|eleitoral|parlamento|congresso|senado|monopolio aereo)\b/.test(
      haystack
    )
  ) {
    return "politica";
  }

  if (
    /\b(prefeitura|governo|governador|governadora|prefeito|prefeita|secretaria|secretario|gestao|obras?)\b/.test(
      haystack
    )
  ) {
    return "prefeitura";
  }

  if (
    /\b(negocio|economia|comercio|empresa|empreendedor|mercado|feira)\b/.test(haystack)
  ) {
    return "negocios";
  }

  if (
    /\b(festa|social|celebridade|famoso|famosa|fofoca|aniversario|casamento|coluna social)\b/.test(haystack)
  ) {
    return "festas & social";
  }

  if (
    /\b(cultura|cinema|filme|estreia|bilheteria|trailer|teatro|peca|peça|show|festival|musica|arte|artista|entretenimento|variedades|michael jackson)\b/.test(
      haystack
    )
  ) {
    return "cultura";
  }

  return "";
}

function normalizeNewsCategoryKey(rawCategory = "", context = {}) {
  const rawKey = normalizeText(rawCategory);
  const mappedKey = Object.prototype.hasOwnProperty.call(CATEGORY_ALIAS_MAP, rawKey)
    ? CATEGORY_ALIAS_MAP[rawKey]
    : "";

  if (mappedKey) {
    return mappedKey;
  }

  if (rawKey && !GENERIC_CATEGORY_KEYS.has(rawKey) && isKnownCategoryKey(rawKey)) {
    return rawKey;
  }

  const inferredKey = inferCategoryKeyFromContent(
    [rawCategory, context.title, context.summary, context.sourceName, context.sourceLabel].join(" ")
  );
  if (inferredKey) {
    return inferredKey;
  }

  const defaultKey = normalizeText(context.defaultCategory || "");
  if (isKnownCategoryKey(defaultKey)) {
    return defaultKey;
  }

  return "cotidiano";
}

function normalizeNewsCategoryLabel(rawCategory = "", context = {}) {
  return formatCategoryLabel(normalizeNewsCategoryKey(rawCategory, context));
}

function normalizeLookupSlug(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/^\/+|\/+$/g, "")
    .replace(/[_\s]+/g, "-")
    .replace(/-+/g, "-");
}

function formatDisplayDate(value) {
  if (!value) return "Sem data";
  if (typeof value === "string" && !/^\d{4}-\d{2}-\d{2}/.test(value)) {
    return value;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return String(value);
  }

  return parsed.toLocaleDateString(LOCALE, {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: TIME_ZONE
  });
}

function cleanShortText(value, maxLength = 160) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function hasPixKeyConfigured() {
  return Boolean(cleanShortText(NINJAS_PIX_KEY, 77));
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function cleanEmail(value) {
  return cleanShortText(value, 140).toLowerCase();
}

function cleanPhone(value) {
  return String(value || "").replace(/[^\d()+\-\s]/g, "").replace(/\s+/g, " ").trim().slice(0, 32);
}

function cleanPhoneDigits(value) {
  return String(value || "").replace(/\D/g, "").slice(0, 32);
}

function safeString(value, max = 400) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

function getWhatsappChatConfig() {
  return {
    enabled: WHATSAPP_CHAT_ENABLED,
    token: WHATSAPP_CLOUD_TOKEN,
    phoneNumberId: WHATSAPP_CLOUD_PHONE_NUMBER_ID,
    verifyToken: WHATSAPP_WEBHOOK_VERIFY_TOKEN,
    autoReplyEnabled: WHATSAPP_CHAT_AUTOREPLY_ENABLED,
    autoReplyText: WHATSAPP_CHAT_AUTOREPLY_TEXT
  };
}

function extractWhatsappInboundMessages(payload) {
  const entries = Array.isArray(payload?.entry) ? payload.entry : [];
  return entries.flatMap((entry) =>
    (Array.isArray(entry?.changes) ? entry.changes : []).flatMap((change) => {
      const value = change?.value || {};
      const contacts = Array.isArray(value?.contacts) ? value.contacts : [];
      const contactByWaId = new Map(
        contacts
          .map((contact) => [cleanPhoneDigits(contact?.wa_id), contact])
          .filter(([waId]) => waId)
      );
      const metadata = value?.metadata || {};
      const messages = Array.isArray(value?.messages) ? value.messages : [];

      return messages
        .map((message) => {
          const from = cleanPhoneDigits(message?.from);
          const contact = contactByWaId.get(from) || null;
          const type = String(message?.type || "unknown").trim().toLowerCase();
          let text = "";

          if (type === "text") {
            text = String(message?.text?.body || "");
          } else if (type === "button") {
            text = String(message?.button?.text || "");
          } else if (type === "interactive") {
            text = String(
              message?.interactive?.button_reply?.title ||
                message?.interactive?.list_reply?.title ||
                ""
            );
          }

          return {
            id: String(message?.id || ""),
            from,
            profileName: safeString(contact?.profile?.name || "", 120),
            type,
            text: safeString(text, 4000),
            timestamp: Number(message?.timestamp || 0) || 0,
            rawTimestamp: String(message?.timestamp || ""),
            phoneNumberId: String(metadata?.phone_number_id || ""),
            displayPhoneNumber: String(metadata?.display_phone_number || "")
          };
        })
        .filter((item) => item.from && item.id);
    })
  );
}

async function sendWhatsappTextMessage(to, message) {
  const config = getWhatsappChatConfig();
  const target = cleanPhoneDigits(to);
  const bodyText = safeString(message, 1000);

  if (!config.enabled) {
    return { ok: false, skipped: true, reason: "disabled" };
  }

  if (!config.token || !config.phoneNumberId || !target || !bodyText) {
    return { ok: false, skipped: true, reason: "missing-config" };
  }

  const response = await fetch(
    `https://graph.facebook.com/v19.0/${encodeURIComponent(config.phoneNumberId)}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: target,
        type: "text",
        text: {
          preview_url: false,
          body: bodyText
        }
      })
    }
  );

  const responseText = await response.text();
  if (!response.ok) {
    throw new Error(`WhatsApp Cloud API ${response.status}: ${responseText.slice(0, 500)}`);
  }

  return {
    ok: true,
    responseText
  };
}

function appendWhatsappChatLog(items) {
  if (!Array.isArray(items) || !items.length) return [];

  const current = readJson(WHATSAPP_CHAT_LOG_FILE, []);
  const next = Array.isArray(current) ? current : [];
  next.push(...items);
  writeJson(WHATSAPP_CHAT_LOG_FILE, next);
  return items;
}

function base64UrlEncode(value) {
  const buffer = Buffer.isBuffer(value) ? value : Buffer.from(String(value));
  return buffer.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlToBuffer(value) {
  let normalized = String(value || "").replace(/-/g, "+").replace(/_/g, "/");
  while (normalized.length % 4) normalized += "=";
  return Buffer.from(normalized, "base64");
}

function parseJwtJson(part) {
  return JSON.parse(base64UrlToBuffer(part).toString("utf8"));
}

function safeTimingCompare(left, right) {
  const leftBuffer = Buffer.from(String(left || ""));
  const rightBuffer = Buffer.from(String(right || ""));
  if (leftBuffer.length !== rightBuffer.length) return false;
  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function isCatalogoGoogleAuthEnabled() {
  return Boolean(GOOGLE_AUTH_CLIENT_ID && SITE_AUTH_SESSION_SECRET);
}

function parseCookies(req) {
  const header = String(req?.headers?.cookie || "");
  return header.split(";").reduce((cookies, part) => {
    const divider = part.indexOf("=");
    if (divider < 0) return cookies;
    const key = part.slice(0, divider).trim();
    const value = part.slice(divider + 1).trim();
    if (!key) return cookies;
    try {
      cookies[key] = decodeURIComponent(value);
    } catch (_error) {
      cookies[key] = value;
    }
    return cookies;
  }, {});
}

function serializeCookie(name, value, options = {}) {
  const parts = [`${name}=${encodeURIComponent(value)}`];
  if (options.maxAge !== undefined) parts.push(`Max-Age=${Number(options.maxAge) || 0}`);
  if (options.path) parts.push(`Path=${options.path}`);
  if (options.httpOnly) parts.push("HttpOnly");
  if (options.secure) parts.push("Secure");
  if (options.sameSite) parts.push(`SameSite=${options.sameSite}`);
  return parts.join("; ");
}

function appendSetCookie(res, cookie) {
  const current = res.getHeader("Set-Cookie");
  if (!current) {
    res.setHeader("Set-Cookie", cookie);
    return;
  }
  const next = Array.isArray(current) ? current.concat(cookie) : [current, cookie];
  res.setHeader("Set-Cookie", next);
}

function isSecureRequest(req) {
  const forwardedProto = String(req?.headers?.["x-forwarded-proto"] || "").toLowerCase();
  return forwardedProto.includes("https") || Boolean(req?.socket?.encrypted) || IS_PRODUCTION;
}

function createCatalogoAuthToken(user) {
  const now = Date.now();
  const payload = {
    sub: safeString(user.sub, 120),
    email: cleanEmail(user.email),
    name: safeString(user.name || user.givenName || "", 120),
    givenName: safeString(user.givenName, 80),
    familyName: safeString(user.familyName, 80),
    picture: safeString(user.picture, 360),
    iat: now,
    exp: now + SITE_AUTH_MAX_AGE_SECONDS * 1000
  };
  const body = base64UrlEncode(JSON.stringify(payload));
  const signature = base64UrlEncode(crypto.createHmac("sha256", SITE_AUTH_SESSION_SECRET).update(body).digest());
  return `${body}.${signature}`;
}

function readCatalogoAuthSession(req) {
  if (!isCatalogoGoogleAuthEnabled()) return null;
  const token = parseCookies(req)[SITE_AUTH_COOKIE];
  if (!token || !token.includes(".")) return null;
  const [body, signature] = token.split(".");
  const expected = base64UrlEncode(crypto.createHmac("sha256", SITE_AUTH_SESSION_SECRET).update(body).digest());
  if (!safeTimingCompare(signature, expected)) return null;

  try {
    const payload = JSON.parse(base64UrlToBuffer(body).toString("utf8"));
    if (!payload?.sub || !payload?.email) return null;
    if (Number(payload.exp || 0) < Date.now()) return null;
    return {
      sub: safeString(payload.sub, 120),
      email: cleanEmail(payload.email),
      name: safeString(payload.name, 120),
      givenName: safeString(payload.givenName, 80),
      familyName: safeString(payload.familyName, 80),
      picture: safeString(payload.picture, 360)
    };
  } catch (_error) {
    return null;
  }
}

function publicAuthUser(user) {
  if (!user) return null;
  return {
    sub: safeString(user.sub, 120),
    email: cleanEmail(user.email),
    name: safeString(user.name, 120),
    givenName: safeString(user.givenName, 80),
    familyName: safeString(user.familyName, 80),
    picture: safeString(user.picture, 360)
  };
}

function setCatalogoAuthCookie(req, res, user) {
  appendSetCookie(
    res,
    serializeCookie(SITE_AUTH_COOKIE, createCatalogoAuthToken(user), {
      maxAge: SITE_AUTH_MAX_AGE_SECONDS,
      path: "/",
      httpOnly: true,
      sameSite: "Lax",
      secure: isSecureRequest(req)
    })
  );
}

function clearCatalogoAuthCookie(req, res) {
  appendSetCookie(
    res,
    serializeCookie(SITE_AUTH_COOKIE, "", {
      maxAge: 0,
      path: "/",
      httpOnly: true,
      sameSite: "Lax",
      secure: isSecureRequest(req)
    })
  );
}

async function fetchGoogleIdTokenCerts() {
  if (googleIdTokenCertCache.certs && googleIdTokenCertCache.expiresAt > Date.now()) {
    return googleIdTokenCertCache.certs;
  }

  const response = await fetch(GOOGLE_ID_TOKEN_CERTS_URL, {
    headers: { Accept: "application/json" }
  });
  if (!response.ok) {
    throw new Error("Nao foi possivel carregar as chaves publicas do Google.");
  }

  const certs = await response.json();
  const cacheControl = String(response.headers.get("cache-control") || "");
  const maxAgeMatch = cacheControl.match(/max-age=(\d+)/i);
  const maxAgeMs = maxAgeMatch ? Number(maxAgeMatch[1]) * 1000 : 60 * 60 * 1000;
  googleIdTokenCertCache = {
    certs,
    expiresAt: Date.now() + Math.max(5 * 60 * 1000, maxAgeMs - 60 * 1000)
  };
  return certs;
}

async function verifyGoogleIdToken(idToken) {
  if (!isCatalogoGoogleAuthEnabled()) {
    throw new Error("Login Google ainda nao esta configurado neste ambiente.");
  }

  const parts = String(idToken || "").split(".");
  if (parts.length !== 3) {
    throw new Error("Credencial Google invalida.");
  }

  const header = parseJwtJson(parts[0]);
  const claims = parseJwtJson(parts[1]);
  if (header.alg !== "RS256" || !header.kid) {
    throw new Error("Assinatura Google nao reconhecida.");
  }

  const certs = await fetchGoogleIdTokenCerts();
  const cert = certs?.[header.kid];
  if (!cert) {
    googleIdTokenCertCache = { certs: null, expiresAt: 0 };
    throw new Error("Chave publica do Google nao encontrada.");
  }

  const verifier = crypto.createVerify("RSA-SHA256");
  verifier.update(`${parts[0]}.${parts[1]}`);
  verifier.end();
  if (!verifier.verify(cert, base64UrlToBuffer(parts[2]))) {
    throw new Error("Assinatura Google invalida.");
  }

  const nowSeconds = Math.floor(Date.now() / 1000);
  if (String(claims.aud || "") !== GOOGLE_AUTH_CLIENT_ID) {
    throw new Error("Credencial Google emitida para outro aplicativo.");
  }
  if (!["accounts.google.com", "https://accounts.google.com"].includes(String(claims.iss || ""))) {
    throw new Error("Emissor Google invalido.");
  }
  if (Number(claims.exp || 0) <= nowSeconds) {
    throw new Error("Credencial Google expirada.");
  }
  if (claims.nbf && Number(claims.nbf) > nowSeconds + 30) {
    throw new Error("Credencial Google ainda nao esta valida.");
  }
  if (!claims.sub) {
    throw new Error("Credencial Google sem identificador.");
  }
  if (!claims.email) {
    throw new Error("Credencial Google sem e-mail.");
  }

  const emailVerified = claims.email_verified === true || claims.email_verified === "true";
  if (claims.email && !emailVerified) {
    throw new Error("Confirme o e-mail no Google antes de continuar.");
  }

  return {
    sub: safeString(claims.sub, 120),
    email: cleanEmail(claims.email),
    name: safeString(claims.name, 120),
    givenName: safeString(claims.given_name, 80),
    familyName: safeString(claims.family_name, 80),
    picture: safeString(claims.picture, 360),
    emailVerified
  };
}

function buildAbsoluteUrl(baseUrl, value = "/") {
  try {
    return new URL(String(value || "/"), baseUrl).toString();
  } catch (_error) {
    return String(value || baseUrl || "").trim();
  }
}

function serializeJsonLd(value) {
  return JSON.stringify(value || {})
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/<\/script/gi, "<\\/script");
}

function buildSiteOrganizationJsonLd(baseUrl) {
  return {
    "@type": "NewsMediaOrganization",
    "@id": `${baseUrl}#organization`,
    name: SITE_NAME,
    url: baseUrl,
    areaServed: SITE_REGION_NAME,
    inLanguage: LOCALE,
    logo: {
      "@type": "ImageObject",
      url: buildAbsoluteUrl(baseUrl, DEFAULT_PUBLISHER_LOGO_PATH)
    },
    image: buildAbsoluteUrl(baseUrl, DEFAULT_OG_IMAGE_PATH)
  };
}

function buildStaticPageJsonLd(baseUrl, canonicalUrl, seoConfig = {}) {
  if (seoConfig.schemaType === "WebSite") {
    return {
      "@context": "https://schema.org",
      "@graph": [
        buildSiteOrganizationJsonLd(baseUrl),
        {
          "@type": "WebSite",
          "@id": `${baseUrl}#website`,
          name: SITE_NAME,
          url: baseUrl,
          inLanguage: LOCALE,
          description: seoConfig.description || DEFAULT_SITE_DESCRIPTION,
          publisher: {
            "@id": `${baseUrl}#organization`
          }
        }
      ]
    };
  }

  const payload = {
    "@context": "https://schema.org",
    "@type": seoConfig.schemaType || "WebPage",
    name: seoConfig.title || SITE_NAME,
    description: seoConfig.description || DEFAULT_SITE_DESCRIPTION,
    url: canonicalUrl,
    inLanguage: LOCALE,
    isPartOf: {
      "@type": "WebSite",
      "@id": `${baseUrl}#website`,
      name: SITE_NAME,
      url: baseUrl
    },
    publisher: {
      "@id": `${baseUrl}#organization`
    },
    about: {
      "@type": "Place",
      name: SITE_REGION_NAME
    }
  };

  if (seoConfig.schemaType === "Service") {
    payload.provider = {
      "@id": `${baseUrl}#organization`
    };
  }

  return payload;
}

function buildArticleJsonLd(baseUrl, canonicalUrl, article, description, imageUrl) {
  const payload = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article?.title || SITE_NAME,
    description,
    image: [imageUrl],
    url: canonicalUrl,
    mainEntityOfPage: canonicalUrl,
    inLanguage: LOCALE,
    isAccessibleForFree: true,
    datePublished: article?.publishedAt || article?.date || new Date().toISOString(),
    dateModified: article?.publishedAt || article?.date || new Date().toISOString(),
    articleSection: article?.category || "Noticia",
    publisher: {
      "@id": `${baseUrl}#organization`
    }
  };

  if (article?.sourceName) {
    payload.author = {
      "@type": "Organization",
      name: article.sourceName
    };
  }

  return payload;
}

function buildCandidateJsonLd(baseUrl, canonicalUrl, office, candidate, description, imageUrl) {
  const sameAs = []
    .concat(Array.isArray(candidate?.sources) ? candidate.sources : [])
    .concat(Array.isArray(candidate?.portalLinks) ? candidate.portalLinks : [])
    .map((item) => String(item?.url || "").trim())
    .filter(Boolean)
    .slice(0, 8);

  const person = {
    "@type": "Person",
    name: candidate?.name || "Candidato",
    description,
    image: imageUrl
  };

  if (candidate?.role) {
    person.jobTitle = candidate.role;
  }

  if (candidate?.party) {
    person.affiliation = {
      "@type": "Organization",
      name: candidate.party
    };
  }

  if (sameAs.length) {
    person.sameAs = sameAs;
  }

  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: `${candidate?.name || "Candidato"} | ${office?.label || "Eleicoes"}`,
    description,
    url: canonicalUrl,
    inLanguage: LOCALE,
    isPartOf: {
      "@type": "WebSite",
      "@id": `${baseUrl}#website`,
      name: SITE_NAME,
      url: baseUrl
    },
    mainEntity: person,
    publisher: {
      "@id": `${baseUrl}#organization`
    }
  };
}

function buildServiceModuleJsonLd(baseUrl, canonicalUrl, moduleConfig, description, imageUrl) {
  const items = Array.isArray(moduleConfig?.items) ? moduleConfig.items : [];
  const payload = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${moduleConfig?.title || "Catalogo de Servicos"} | ${SITE_NAME}`,
    description,
    url: canonicalUrl,
    inLanguage: LOCALE,
    isPartOf: {
      "@type": "WebSite",
      "@id": `${baseUrl}#website`,
      name: SITE_NAME,
      url: baseUrl
    },
    publisher: {
      "@id": `${baseUrl}#organization`
    },
    about: {
      "@type": "Place",
      name: SITE_REGION_NAME
    }
  };

  if (imageUrl) {
    payload.image = imageUrl;
  }

  if (items.length) {
    payload.mainEntity = {
      "@type": "ItemList",
      itemListElement: items.slice(0, 12).map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item?.name || `Item ${index + 1}`,
        url: item?.website || item?.source || canonicalUrl
      }))
    };
  }

  return payload;
}

function resolveCandidateContext(searchParams) {
  const officeId = normalizeLookupSlug(searchParams?.get("office"));
  const candidateId = normalizeLookupSlug(searchParams?.get("candidate"));
  const electionConfig = getElectionConfig();
  const offices = Array.isArray(electionConfig?.offices) ? electionConfig.offices : [];
  const office =
    offices.find((item) => normalizeLookupSlug(item?.id || item?.label) === officeId) ||
    offices.find((item) =>
      Array.isArray(item?.candidates)
        ? item.candidates.some(
            (candidate) => normalizeLookupSlug(candidate?.id || candidate?.name) === candidateId
          )
        : false
    ) ||
    null;
  const candidate = Array.isArray(office?.candidates)
    ? office.candidates.find(
        (item) => normalizeLookupSlug(item?.id || item?.name) === candidateId
      ) || null
    : null;

  return { office, candidate };
}

function resolveServiceModule(searchParams) {
  const moduleId = normalizeLookupSlug(searchParams?.get("modulo") || searchParams?.get("module"));
  const catalogConfig = getServicesCatalogConfig();
  const modules = Array.isArray(catalogConfig?.modules) ? catalogConfig.modules : [];
  const moduleConfig =
    modules.find((item) => normalizeLookupSlug(item?.id || item?.title) === moduleId) || null;

  return {
    catalogConfig,
    moduleConfig
  };
}

function resolvePageSeo(req, pathname, requestUrl) {
  const baseUrl = getPublicSiteUrl(req);
  const baseConfig = STATIC_PAGE_SEO[pathname] || {
    title: SITE_NAME,
    description: DEFAULT_SITE_DESCRIPTION,
    themeColor: "#1E3A5F",
    colorScheme: "light",
    ogType: "website",
    schemaType: "WebPage"
  };
  const searchParams = requestUrl?.searchParams;
  const seo = {
    ...baseConfig,
    robots: baseConfig.robots || "index,follow,max-image-preview:large"
  };

  if (pathname === "/noticia.html") {
    const article = getArticleBySlug(searchParams?.get("slug") || searchParams?.get("id"));

    if (article) {
      const title = `${SITE_NAME} | ${article.title}`;
      const description = cleanShortText(
        stripHtml(article.lede || article.summary || article.analysis || DEFAULT_SITE_DESCRIPTION),
        180
      );
      const canonicalUrl = buildAbsoluteUrl(
        baseUrl,
        `/noticia.html?slug=${encodeURIComponent(article.slug)}`
      );
      const imageUrl = buildAbsoluteUrl(
        baseUrl,
        article.imageUrl || article.feedImageUrl || article.sourceImageUrl || DEFAULT_OG_IMAGE_PATH
      );

      return {
        ...seo,
        title,
        description,
        ogType: "article",
        canonicalUrl,
        ogUrl: canonicalUrl,
        imageUrl,
        structuredData: buildArticleJsonLd(baseUrl, canonicalUrl, article, description, imageUrl)
      };
    }

    return {
      ...seo,
      canonicalUrl: buildAbsoluteUrl(baseUrl, pathname),
      ogUrl: buildAbsoluteUrl(baseUrl, pathname),
      imageUrl: buildAbsoluteUrl(baseUrl, DEFAULT_OG_IMAGE_PATH),
      structuredData: buildStaticPageJsonLd(baseUrl, buildAbsoluteUrl(baseUrl, pathname), seo)
    };
  }

  if (pathname === "/candidato.html") {
    const { office, candidate } = resolveCandidateContext(searchParams);

    if (office && candidate) {
      const title = `${candidate.name} | ${office.label} | ${SITE_NAME}`;
      const description = cleanShortText(
        stripHtml(
          candidate.currentPosition ||
            candidate.historySummary ||
            candidate.summary ||
            seo.description
        ),
        180
      );
      const canonicalUrl = buildAbsoluteUrl(
        baseUrl,
        `/candidato.html?office=${encodeURIComponent(office.id)}&candidate=${encodeURIComponent(
          candidate.id
        )}`
      );
      const imageUrl = buildAbsoluteUrl(
        baseUrl,
        candidate.imageUrl || DEFAULT_OG_IMAGE_PATH
      );

      return {
        ...seo,
        title,
        description,
        ogType: "profile",
        canonicalUrl,
        ogUrl: canonicalUrl,
        imageUrl,
        structuredData: buildCandidateJsonLd(
          baseUrl,
          canonicalUrl,
          office,
          candidate,
          description,
          imageUrl
        )
      };
    }

    return {
      ...seo,
      robots: "noindex,follow",
      canonicalUrl: buildAbsoluteUrl(baseUrl, pathname),
      ogUrl: buildAbsoluteUrl(baseUrl, pathname),
      imageUrl: buildAbsoluteUrl(baseUrl, DEFAULT_OG_IMAGE_PATH),
      structuredData: buildStaticPageJsonLd(baseUrl, buildAbsoluteUrl(baseUrl, pathname), {
        ...seo,
        schemaType: "WebPage"
      })
    };
  }

  if (pathname === "/catalogo-servicos.html") {
    const { catalogConfig, moduleConfig } = resolveServiceModule(searchParams);

    if (moduleConfig) {
      const city = cleanShortText(catalogConfig?.city || SITE_REGION_NAME, 80);
      const title = `${moduleConfig.title} | Catalogo de Servicos | ${SITE_NAME}`;
      const description = cleanShortText(
        stripHtml(
          moduleConfig.subtitle ||
            `Guia local de ${moduleConfig.title || "servicos"} em ${city}, com telefones, links e atalhos rapidos.`
        ),
        180
      );
      const canonicalUrl = buildAbsoluteUrl(
        baseUrl,
        `/catalogo-servicos.html?modulo=${encodeURIComponent(moduleConfig.id)}`
      );
      const imageUrl = buildAbsoluteUrl(
        baseUrl,
        moduleConfig.photoUrl || DEFAULT_OG_IMAGE_PATH
      );

      return {
        ...seo,
        title,
        description,
        canonicalUrl,
        ogUrl: canonicalUrl,
        imageUrl,
        structuredData: buildServiceModuleJsonLd(
          baseUrl,
          canonicalUrl,
          moduleConfig,
          description,
          imageUrl
        )
      };
    }

    return {
      ...seo,
      canonicalUrl: buildAbsoluteUrl(baseUrl, pathname),
      ogUrl: buildAbsoluteUrl(baseUrl, pathname),
      imageUrl: buildAbsoluteUrl(baseUrl, DEFAULT_OG_IMAGE_PATH),
      structuredData: buildStaticPageJsonLd(baseUrl, buildAbsoluteUrl(baseUrl, pathname), seo)
    };
  }

  const canonicalUrl = buildAbsoluteUrl(
    baseUrl,
    pathname === "/" ? "/" : pathname
  );

  return {
    ...seo,
    canonicalUrl,
    ogUrl: canonicalUrl,
    imageUrl: buildAbsoluteUrl(baseUrl, DEFAULT_OG_IMAGE_PATH),
    structuredData: buildStaticPageJsonLd(baseUrl, canonicalUrl, seo)
  };
}

function buildSeoTemplateVars(req, pathname, requestUrl) {
  const seo = resolvePageSeo(req, pathname, requestUrl);

  return {
    SITE_URL: getPublicSiteUrl(req),
    SEO_TITLE: escapeHtml(seo.title || SITE_NAME),
    SEO_DESCRIPTION: escapeHtml(seo.description || DEFAULT_SITE_DESCRIPTION),
    SEO_ROBOTS: escapeHtml(seo.robots || "index,follow,max-image-preview:large"),
    SEO_THEME_COLOR: escapeHtml(seo.themeColor || "#1E3A5F"),
    SEO_COLOR_SCHEME: escapeHtml(seo.colorScheme || "light"),
    SEO_OG_TYPE: escapeHtml(seo.ogType || "website"),
    SEO_OG_TITLE: escapeHtml(seo.title || SITE_NAME),
    SEO_OG_DESCRIPTION: escapeHtml(seo.description || DEFAULT_SITE_DESCRIPTION),
    SEO_OG_IMAGE: escapeHtml(seo.imageUrl || buildAbsoluteUrl(getPublicSiteUrl(req), DEFAULT_OG_IMAGE_PATH)),
    SEO_OG_URL: escapeHtml(seo.ogUrl || seo.canonicalUrl || getPublicSiteUrl(req)),
    SEO_TWITTER_TITLE: escapeHtml(seo.title || SITE_NAME),
    SEO_TWITTER_DESCRIPTION: escapeHtml(seo.description || DEFAULT_SITE_DESCRIPTION),
    SEO_TWITTER_IMAGE: escapeHtml(
      seo.imageUrl || buildAbsoluteUrl(getPublicSiteUrl(req), DEFAULT_OG_IMAGE_PATH)
    ),
    SEO_CANONICAL: escapeHtml(seo.canonicalUrl || getPublicSiteUrl(req)),
    SEO_JSON_LD: serializeJsonLd(seo.structuredData || buildStaticPageJsonLd(getPublicSiteUrl(req), getPublicSiteUrl(req), seo))
  };
}

function normalizeUrl(value) {
  const url = safeString(value, 500);
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith("/")) return url;
  return "";
}

function detectDeviceType(uaRaw) {
  const ua = String(uaRaw || "").toLowerCase();
  if (!ua) return "desconhecido";
  if (/mobile|android|iphone|ipod|blackberry|opera mini/i.test(ua)) {
    return "mobile";
  }
  if (/ipad|tablet/i.test(ua)) return "tablet";
  return "desktop";
}

function detectBrowser(uaRaw) {
  const ua = String(uaRaw || "").toLowerCase();
  if (ua.includes("edg/")) return "Edge";
  if (ua.includes("opr/") || ua.includes("opera")) return "Opera";
  if (ua.includes("firefox/")) return "Firefox";
  if (ua.includes("chrome/")) return "Chrome";
  if (ua.includes("safari/")) return "Safari";
  return "Outro";
}

function getClientIp(req) {
  const fromForward = safeString(req?.headers?.["x-forwarded-for"] || "", 120);
  if (fromForward) {
    return fromForward.split(",")[0].trim();
  }

  return safeString(req?.socket?.remoteAddress || "");
}

function getRequestCity(req, body = {}) {
  return (
    safeString(
      req?.headers?.["x-vercel-ip-city"] ||
        req?.headers?.["cf-ipcity"] ||
        body.city ||
        body.voterCity ||
        "",
      80
    ) || "não informado"
  );
}

function getRequestCountry(req, body = {}) {
  return (
    safeString(
      req?.headers?.["x-vercel-ip-country"] ||
        req?.headers?.["cf-ipcountry"] ||
        body.country ||
        "",
      40
    ) || "não informado"
  );
}

function summarizeReferrer(referrerRaw) {
  const referrer = safeString(referrerRaw, 300);
  if (!referrer) return "direto";

  try {
    return new URL(referrer).hostname || "direto";
  } catch {
    return referrer;
  }
}

function topEntries(bucket = {}, labelKey = "label", limit = 12) {
  return Object.entries(bucket)
    .map(([label, total]) => ({ [labelKey]: label, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, limit);
}

function sortByDateDesc(items = [], key = "at", limit = 20) {
  return [...items]
    .sort((left, right) => new Date(right[key] || 0).getTime() - new Date(left[key] || 0).getTime())
    .slice(0, limit);
}

function sumBy(items, keyGetter) {
  const bucket = {};

  for (const item of items) {
    const key = keyGetter(item) || "desconhecido";
    bucket[key] = (bucket[key] || 0) + 1;
  }

  return bucket;
}

function average(list = []) {
  if (!list.length) return 0;
  return list.reduce((sum, value) => sum + Number(value || 0), 0) / list.length;
}

function buildTrackingMeta(req, body = {}, userAgentRaw = "") {
  const userAgent = safeString(
    userAgentRaw || body.userAgent || req?.headers?.["user-agent"] || "",
    260
  );
  const referrer = safeString(body.referrer || req?.headers?.referer || "", 300);

  return {
    pagePath: safeString(body.pagePath || body.sourcePage || req?.headers?.referer || "/", 260) || "/",
    referrer,
    referrerHost: summarizeReferrer(referrer),
    deviceType: safeString(body.deviceType || detectDeviceType(userAgent), 40),
    browser: safeString(body.browser || detectBrowser(userAgent), 40),
    language: safeString(body.language || req?.headers?.["accept-language"] || "", 80),
    timezone: safeString(body.timezone, 80),
    screen: safeString(body.screen, 50),
    viewport: safeString(body.viewport, 50),
    platform: safeString(body.platform || req?.headers?.["sec-ch-ua-platform"] || "", 80),
    pageTitle: safeString(body.pageTitle, 160),
    city: getRequestCity(req, body),
    country: getRequestCountry(req, body),
    ip: getClientIp(req),
    userAgent,
    visitorId: safeString(body.visitorId, 90),
    sessionId: safeString(body.sessionId, 90),
    cookieVisitorId: safeString(body.cookieVisitorId, 90),
    cookieSessionId: safeString(body.cookieSessionId, 90),
    trackingConsent: safeString(body.trackingConsent || body.consentState || "", 30) || "accepted",
    trackingMethod: safeString(body.trackingMethod, 60) || "runtime",
    consentSource: safeString(body.consentSource, 40) || "banner",
    cookiesEnabled:
      typeof body.cookiesEnabled === "boolean" ? body.cookiesEnabled : Boolean(body.cookiesEnabled),
    storageEnabled:
      typeof body.storageEnabled === "boolean" ? body.storageEnabled : Boolean(body.storageEnabled),
    utmSource: safeString(body.utmSource, 120),
    utmMedium: safeString(body.utmMedium, 120),
    utmCampaign: safeString(body.utmCampaign, 160),
    utmContent: safeString(body.utmContent, 160),
    utmTerm: safeString(body.utmTerm, 160)
  };
}

function getJsonArray(filePath) {
  const items = readJson(filePath, []);
  return Array.isArray(items) ? items : [];
}

const ELECTION_SENTIMENT_KEYWORDS = {
  positive: [
    "bom",
    "boa",
    "otimo",
    "ótimo",
    "excelente",
    "honesto",
    "honesta",
    "preparado",
    "preparada",
    "competente",
    "serio",
    "sério",
    "confiavel",
    "confiável",
    "apoio",
    "voto nele",
    "voto nela",
    "merece",
    "gosto",
    "trabalha",
    "resultado",
    "entrega",
    "continuidade"
  ],
  negative: [
    "ruim",
    "péssimo",
    "pessimo",
    "fraco",
    "fraca",
    "corrupto",
    "corrupta",
    "mentira",
    "mentiroso",
    "mentirosa",
    "despreparado",
    "despreparada",
    "nao voto",
    "não voto",
    "rejeicao",
    "rejeição",
    "fora",
    "cansado",
    "cansada",
    "troca",
    "mudanca",
    "mudança",
    "desgaste",
    "promessa"
  ],
  reelectionPositive: [
    "reeleicao",
    "reeleição",
    "mais 4 anos",
    "continua",
    "continuar",
    "segue",
    "seguir",
    "continuidade"
  ],
  reelectionNegative: [
    "mudanca",
    "mudança",
    "alternancia",
    "alternância",
    "renovar",
    "troca",
    "fora",
    "chega",
    "nao merece reeleicao",
    "não merece reeleição"
  ]
};

function analyzeElectionObservation(value = "") {
  const observation = safeString(value, 1200);
  const normalized = normalizeText(observation);

  if (!normalized) {
    return {
      label: "sem-opiniao",
      score: 0,
      positiveHits: 0,
      negativeHits: 0,
      reelectionLabel: "neutro"
    };
  }

  const countHits = (list = []) =>
    list.reduce((total, entry) => total + (normalized.includes(normalizeText(entry)) ? 1 : 0), 0);

  const positiveHits = countHits(ELECTION_SENTIMENT_KEYWORDS.positive);
  const negativeHits = countHits(ELECTION_SENTIMENT_KEYWORDS.negative);
  const score = positiveHits - negativeHits;
  let label = "neutro";

  if (score >= 2 || (positiveHits > 0 && negativeHits === 0)) {
    label = "positivo";
  } else if (score <= -2 || (negativeHits > 0 && positiveHits === 0)) {
    label = "negativo";
  } else if (positiveHits > 0 && negativeHits > 0) {
    label = "misto";
  }

  const reelectionPositiveHits = countHits(ELECTION_SENTIMENT_KEYWORDS.reelectionPositive);
  const reelectionNegativeHits = countHits(ELECTION_SENTIMENT_KEYWORDS.reelectionNegative);
  let reelectionLabel = "neutro";

  if (reelectionPositiveHits > reelectionNegativeHits && reelectionPositiveHits > 0) {
    reelectionLabel = "favoravel";
  } else if (reelectionNegativeHits > reelectionPositiveHits && reelectionNegativeHits > 0) {
    reelectionLabel = "desgaste";
  }

  return {
    label,
    score,
    positiveHits,
    negativeHits,
    reelectionLabel
  };
}

function parseCurrency(value, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Number(value.toFixed(2));
  }

  const normalized = String(value || "")
    .replace(/[R$\s]/gi, "")
    .replace(/\./g, "")
    .replace(",", ".");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? Number(parsed.toFixed(2)) : fallback;
}

function clampInteger(value, fallback = 0) {
  const parsed = Number.parseInt(String(value ?? fallback), 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizePixText(value, maxLength = 25) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z0-9 /.-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase()
    .slice(0, maxLength);
}

function normalizePixToken(value, maxLength = 25) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z0-9]/g, "")
    .trim()
    .toUpperCase()
    .slice(0, maxLength);
}

function buildPixField(id, value) {
  const content = String(value || "");
  return `${id}${String(content.length).padStart(2, "0")}${content}`;
}

function computePixCrc16(payload) {
  let crc = 0xffff;

  for (let index = 0; index < payload.length; index += 1) {
    crc ^= payload.charCodeAt(index) << 8;
    for (let bit = 0; bit < 8; bit += 1) {
      if (crc & 0x8000) {
        crc = ((crc << 1) ^ 0x1021) & 0xffff;
      } else {
        crc = (crc << 1) & 0xffff;
      }
    }
  }

  return crc.toString(16).toUpperCase().padStart(4, "0");
}

function formatPixAmount(value) {
  const numeric = parseCurrency(value, NINJAS_PIX_DEFAULT_AMOUNT);
  return Math.max(0.01, Math.min(99999.99, numeric)).toFixed(2);
}

function buildPixPayload({ amount, txid, description }) {
  const merchantName = normalizePixText(NINJAS_MERCHANT_NAME || "CATALOGO CZS", 25) || "CATALOGO CZS";
  const merchantCity = normalizePixText(NINJAS_MERCHANT_CITY || "CRUZEIRO DO SUL", 15) || "CRUZEIRO DO SUL";
  const safeTxid = normalizePixToken(txid || `NJS${Date.now()}`, 25) || `NJS${Date.now()}`;
  const pixKey = cleanShortText(NINJAS_PIX_KEY, 77);

  if (!pixKey) {
    throw new Error("pix-key-not-configured");
  }

  const accountInfo = [
    buildPixField("00", "br.gov.bcb.pix"),
    buildPixField("01", pixKey)
  ];
  const safeDescription = normalizePixText(description, 40);

  if (safeDescription) {
    accountInfo.push(buildPixField("02", safeDescription));
  }

  const payloadWithoutCrc = [
    buildPixField("00", "01"),
    buildPixField("01", "12"),
    buildPixField("26", accountInfo.join("")),
    buildPixField("52", "0000"),
    buildPixField("53", "986"),
    buildPixField("54", formatPixAmount(amount)),
    buildPixField("58", "BR"),
    buildPixField("59", merchantName),
    buildPixField("60", merchantCity),
    buildPixField("62", buildPixField("05", safeTxid)),
    "6304"
  ].join("");

  return {
    txid: safeTxid,
    copyCode: `${payloadWithoutCrc}${computePixCrc16(payloadWithoutCrc)}`
  };
}

async function buildNinjasPixConfig({
  amount,
  txid,
  description,
  minAmount = NINJAS_PIX_DEFAULT_AMOUNT,
  maxAmount = 100,
  defaultAmount = NINJAS_PIX_DEFAULT_AMOUNT
}) {
  const safeAmount = Math.max(minAmount, Math.min(maxAmount, parseCurrency(amount, defaultAmount)));
  const payload = buildPixPayload({
    amount: safeAmount,
    txid,
    description
  });

  let qrSvg = "";
  if (QRCode?.toString) {
    try {
      qrSvg = await QRCode.toString(payload.copyCode, {
        type: "svg",
        margin: 1,
        errorCorrectionLevel: "M",
        color: {
          dark: "#0B1C33",
          light: "#FFFFFF"
        }
      });
    } catch (_error) {
      qrSvg = "";
    }
  }

  return {
    paymentMethod: "pix-qr-code",
    keyVisible: true,
    merchantName: normalizePixText(NINJAS_MERCHANT_NAME, 25) || "CATALOGO CZS",
    amount: Number(safeAmount.toFixed(2)),
    txid: payload.txid,
    pixKey: cleanShortText(NINJAS_PIX_KEY, 77),
    copyCode: payload.copyCode,
    qrSvg,
    confirmationMode: "manual"
  };
}

function getNinjasCreditsFromPlan(plan, amount) {
  const normalizedPlan = normalizeText(plan);
  const normalizedAmount = Number(parseCurrency(amount, 0).toFixed(2));

  if (normalizedPlan === "creditos" || normalizedPlan === "creditos-pro") {
    if (normalizedAmount >= 100) return 80;
    if (normalizedAmount >= 50) return 30;
    if (normalizedAmount >= 20) return 10;
  }

  return 0;
}

function buildNinjasOpportunityPayload() {
  const items = NINJAS_OPPORTUNITIES.map((item) => ({
    ...item,
    publishedLabel: formatDisplayDate(item.publishedAt),
    deadlineLabel: item.deadline || "Sem prazo divulgado"
  }));

  return {
    updatedAt: NINJAS_OPPORTUNITIES_UPDATED_AT,
    updatedLabel: formatDisplayDate(NINJAS_OPPORTUNITIES_UPDATED_AT),
    total: items.length,
    items
  };
}

function normalizeSalesCategory(value) {
  const normalized = normalizeText(value || "outros");
  if (/veiculo|moto|carro|bike|bicicleta|transporte/.test(normalized)) return "veiculos";
  if (/casa|movel|moveis|eletro|geladeira|fogao|sofa|mesa/.test(normalized)) return "casa";
  if (/celular|notebook|computador|game|console|tech|eletronico/.test(normalized)) return "eletronicos";
  if (/moda|roupa|calcado|tenis|bolsa|acessorio/.test(normalized)) return "moda";
  if (/servico|frete|aula|manutencao|diaria|mao de obra/.test(normalized)) return "servicos";
  return "outros";
}

function getSalesListings({ category = "", limit = 80 } = {}) {
  const items = getJsonArray(SALES_LISTINGS_FILE)
    .filter((item) => !item.status || item.status === "publicado")
    .sort((left, right) => new Date(right.createdAt || 0).getTime() - new Date(left.createdAt || 0).getTime());
  const normalizedCategory = normalizeSalesCategory(category);
  const filtered =
    category && normalizedCategory !== "outros"
      ? items.filter((item) => normalizeSalesCategory(item.category) === normalizedCategory)
      : items;

  return filtered.slice(0, Math.max(1, Math.min(200, Number(limit) || 80)));
}

function buildMostViewedArticles(visits = [], limit = 12) {
  const bucket = {};

  visits.forEach((visit) => {
    const pagePath = String(visit.pagePath || "");
    if (!pagePath.includes("noticia.html")) return;

    try {
      const url = new URL(pagePath, "https://catalogo.local");
      const slug = url.searchParams.get("slug") || url.searchParams.get("id") || "";
      if (slug) bucket[slug] = (bucket[slug] || 0) + 1;
    } catch (_error) {
      const match = pagePath.match(/[?&](?:slug|id)=([^&#]+)/i);
      const slug = match ? decodeURIComponent(match[1] || "") : "";
      if (slug) bucket[slug] = (bucket[slug] || 0) + 1;
    }
  });

  return Object.entries(bucket)
    .map(([slug, total]) => {
      const article = getArticleBySlug(slug);
      return {
        slug,
        title: article?.title || slug,
        category: article?.category || article?.section || "Materia",
        source: article?.source || article?.sourceName || "",
        total
      };
    })
    .sort((a, b) => b.total - a.total)
    .slice(0, limit);
}

function buildCollectionInventory({
  visits,
  heartbeats,
  comments,
  subscriptions,
  voteRecords,
  ninjasRequests,
  ninjasProfiles,
  pubpaidDeposits,
  salesListings,
  vrRentalLeads
}) {
  const agentMessages = getJsonArray(path.join(DATA_DIR, "agent-messages.json"));
  const newsArchive = getJsonArray(path.join(DATA_DIR, "news-archive.json"));
  const runtimeNews = getJsonArray(path.join(DATA_DIR, "runtime-news.json"));

  return [
    {
      key: "visits",
      label: "Acessos e paginas vistas",
      total: visits.length,
      source: "analytics-client.js -> /api/analytics/visit",
      purpose: "Mostra o que o publico abriu, origem, aparelho, cidade, IP e UTM.",
      readyForDb: true
    },
    {
      key: "heartbeats",
      label: "Tempo de permanencia",
      total: heartbeats.length,
      source: "analytics-client.js -> /api/analytics/heartbeat",
      purpose: "Ajuda a estimar leitura, abandono e sessoes ativas.",
      readyForDb: true
    },
    {
      key: "comments",
      label: "Comentarios e opinioes",
      total: comments.length,
      source: "formularios publicos -> /api/comments",
      purpose: "Registra comunidade, materia comentada, cidade, IP e mensagem.",
      readyForDb: true
    },
    {
      key: "subscriptions",
      label: "Apoiadores, fundadores e emails",
      total: subscriptions.length,
      source: "newsletter/apoie -> /api/subscriptions",
      purpose: "Controla contatos, interesse, plano, Pix pendente e apoiadores confirmaveis.",
      readyForDb: true
    },
    {
      key: "votes",
      label: "Pesquisas politicas e clima eleitoral",
      total: voteRecords.length,
      source: "enquetes eleitorais -> /api/elections/votes",
      purpose: "Conta votos, sentimento, sinal de reeleicao, cidade, partido declarado e observacoes.",
      readyForDb: true
    },
    {
      key: "ninjasRequests",
      label: "Pedidos Ninjas de clientes",
      total: ninjasRequests.length,
      source: "ninjas.html -> /api/ninjas/requests",
      purpose: "Fila de servicos pedidos, contato, bairro, urgencia, status e referencia Pix.",
      readyForDb: true
    },
    {
      key: "ninjasProfiles",
      label: "Curriculos e trabalhadores Ninjas",
      total: ninjasProfiles.length,
      source: "ninjas.html -> /api/ninjas/profiles",
      purpose: "Banco de profissionais, curriculo, area, plano gratis/destaque/creditos e Pix.",
      readyForDb: true
    },
    {
      key: "pubpaidDeposits",
      label: "Depositos PubPaid",
      total: pubpaidDeposits.length,
      source: "pubpaid.html -> /api/pubpaid/deposits",
      purpose: "Controla depositos em QR Code, conta Google, referencia e confirmacao manual.",
      readyForDb: true
    },
    {
      key: "salesListings",
      label: "Pagina filha de vendas",
      total: salesListings.length,
      source: "vendas.html -> /api/sales/listings",
      purpose: "Itens anunciados por tipo, vendedor, contato, preco, bairro e descricao.",
      readyForDb: true
    },
    {
      key: "vrRentalLeads",
      label: "Pedidos de aluguel VR",
      total: vrRentalLeads.length,
      source: "games.html popup -> /api/vr-rental/leads",
      purpose: "Guarda interessados no Meta Quest: nome, WhatsApp, data, horario, pacote e observacoes.",
      readyForDb: true
    },
    {
      key: "newsArchive",
      label: "Arquivo de noticias",
      total: newsArchive.length,
      source: "agregador/news-data/runtime",
      purpose: "Base para materias, arquivo, links de origem e mais vistas.",
      readyForDb: true
    },
    {
      key: "runtimeNews",
      label: "Cache de noticias em tempo real",
      total: runtimeNews.length,
      source: "RSS runtime",
      purpose: "Alimenta o radar quando o servidor consegue atualizar feeds.",
      readyForDb: true
    },
    {
      key: "agentMessages",
      label: "Mensagens e pedidos pelo site",
      total: agentMessages.length,
      source: "formularios de contato -> /api/agent-messages",
      purpose: "Centraliza pedidos comerciais, correcoes, pautas e contato direto.",
      readyForDb: true
    }
  ];
}

function createRecordId(prefix) {
  return `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeListInput(value, { maxItems = 12, itemLength = 80 } = {}) {
  const items = Array.isArray(value)
    ? value
    : String(value || "")
        .split(/\r?\n|,/)
        .map((item) => item.trim());

  return items
    .map((item) => cleanShortText(item, itemLength))
    .filter(Boolean)
    .slice(0, maxItems);
}

function isConfirmedFounderSubscription(item = {}) {
  if (String(item.plan || "").trim() !== "fundadores") return false;
  if (!String(item.name || "").trim()) return false;

  const paymentStatus = String(item?.payment?.status || item.status || "").trim();
  if (!paymentStatus) return true;
  return paymentStatus === "confirmado";
}

function isPendingFounderSubscription(item = {}) {
  if (String(item.plan || "").trim() !== "fundadores") return false;

  const paymentStatus = String(item?.payment?.status || item.status || "").trim();
  return paymentStatus === "pendente-manual" || paymentStatus === "aguardando-confirmacao-pix";
}

function sendJson(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "Content-Length": Buffer.byteLength(body),
  });
  res.end(body);
}

function applyApiCors(req, res) {
  const origin = String(req?.headers?.origin || "").trim();
  if (!origin) {
    return;
  }

  const localOriginPattern =
    /^https?:\/\/(?:(?:localhost|127(?:\.\d{1,3}){3})|(?:10(?:\.\d{1,3}){3})|(?:192\.168(?:\.\d{1,3}){2})|(?:172\.(?:1[6-9]|2\d|3[01])(?:\.\d{1,3}){2}))(?:\:\d+)?$/i;

  if (origin === "null" || localOriginPattern.test(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Admin-Token, Accept");
    res.setHeader("Access-Control-Max-Age", "600");
    res.setHeader("Vary", "Origin");
  }
}

function sendText(res, status, text, cacheControl = "no-store") {
  res.writeHead(status, {
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": cacheControl,
    "Content-Length": Buffer.byteLength(text),
  });
  res.end(text);
}

function sendXml(res, status, xml, cacheControl = "public, max-age=3600") {
  res.writeHead(status, {
    "Content-Type": "application/xml; charset=utf-8",
    "Cache-Control": cacheControl,
    "Content-Length": Buffer.byteLength(xml),
  });
  res.end(xml);
}

function sendCsv(res, status, csv, fileName) {
  const body = String(csv || "");
  res.writeHead(status, {
    "Content-Type": "text/csv; charset=utf-8",
    "Content-Disposition": `attachment; filename=${fileName}`,
    "Cache-Control": "no-store",
    "Content-Length": Buffer.byteLength(body),
  });
  res.end(body);
}

function escapeCsv(value) {
  const text = String(value ?? "");
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function toCsv(rows = []) {
  if (!Array.isArray(rows) || !rows.length) return "";
  const headers = Object.keys(rows[0]);
  return [headers.join(",")]
    .concat(rows.map((row) => headers.map((header) => escapeCsv(row[header])).join(",")))
    .join("\n");
}

function sendAdminUnauthorized(res) {
  const body = "Login de super admin necessario.";
  res.writeHead(401, {
    "WWW-Authenticate": 'Basic realm="Catalogo Super Admin", charset="UTF-8"',
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "no-store",
    "Content-Length": Buffer.byteLength(body),
  });
  res.end(body);
}

function escapeXml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function getPublicSiteUrl(req) {
  if (SITE_URL) {
    return SITE_URL;
  }

  const host = String(req?.headers?.host || "").trim();
  if (!host) {
    return `http://localhost:${PORT}`;
  }

  const forwardedProto = String(req?.headers?.["x-forwarded-proto"] || "")
    .split(",")[0]
    .trim();
  const protocol = forwardedProto || (/localhost|127\.0\.0\.1/i.test(host) ? "http" : "https");
  return `${protocol}://${host}`.replace(/\/+$/, "");
}

function getFileLastModified(fileName) {
  try {
    return fs.statSync(path.join(ROOT_DIR, fileName)).mtime.toISOString();
  } catch (_error) {
    return new Date().toISOString();
  }
}

function isPublicStaticFile(filePath) {
  const relativePath = path.relative(ROOT_DIR, filePath);
  if (!relativePath || relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    return false;
  }

  const segments = relativePath.split(path.sep).filter(Boolean);
  if (segments.some((segment) => PRIVATE_STATIC_SEGMENTS.has(segment))) {
    return false;
  }

  return PUBLIC_STATIC_EXTENSIONS.has(path.extname(filePath).toLowerCase());
}

function buildRobotsTxt(req) {
  const baseUrl = getPublicSiteUrl(req);
  return `User-agent: *
Allow: /
Disallow: /api/admin/
Disallow: /backend/
Disallow: /data/

Sitemap: ${baseUrl}/sitemap.xml
`;
}

function buildSitemapXml(req) {
  const baseUrl = getPublicSiteUrl(req);
  const staticPages = Object.entries(STATIC_PAGE_SEO)
    .filter(([, config]) => config?.sitemap !== false)
    .map(([pagePath, config]) => ({
      path: pagePath,
      lastmod: getFileLastModified(config?.fileName || (pagePath === "/" ? "index.html" : pagePath.slice(1))),
      priority: config?.priority || "0.6",
      changefreq: config?.changefreq || "weekly"
    }));
  const serviceCatalogConfig = getServicesCatalogConfig();
  const modulePages = (Array.isArray(serviceCatalogConfig?.modules) ? serviceCatalogConfig.modules : [])
    .filter((moduleConfig) => normalizeLookupSlug(moduleConfig?.id || moduleConfig?.title))
    .map((moduleConfig) => ({
      path: `/catalogo-servicos.html?modulo=${encodeURIComponent(moduleConfig.id)}`,
      lastmod: getFileLastModified("catalogo-servicos-data.js"),
      priority: "0.68",
      changefreq: "weekly"
    }));
  const electionConfig = getElectionConfig();
  const candidatePages = (Array.isArray(electionConfig?.offices) ? electionConfig.offices : [])
    .flatMap((office) =>
      (Array.isArray(office?.candidates) ? office.candidates : [])
        .filter((candidate) => office?.id && candidate?.id)
        .map((candidate) => ({
          path: `/candidato.html?office=${encodeURIComponent(office.id)}&candidate=${encodeURIComponent(
            candidate.id
          )}`,
          lastmod: getFileLastModified("elections-data.js"),
          priority: "0.58",
          changefreq: "daily"
        }))
    );
  const articlePages = getArticleNews(500)
    .filter((item) => item?.slug)
    .map((item) => ({
      path: `/noticia.html?slug=${encodeURIComponent(item.slug)}`,
      lastmod: item.publishedAt || item.date || new Date().toISOString(),
      priority: "0.64",
      changefreq: "daily"
    }));
  const entries = staticPages.concat(modulePages, candidatePages, articlePages);
  const body = entries
    .map(
      (entry) => `  <url>
    <loc>${escapeXml(`${baseUrl}${entry.path}`)}</loc>
    <lastmod>${escapeXml(entry.lastmod)}</lastmod>
    <changefreq>${escapeXml(entry.changefreq || "weekly")}</changefreq>
    <priority>${escapeXml(entry.priority)}</priority>
  </url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>`;
}

function parseBody(req) {
  return new Promise((resolve) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 1024 * 1024) req.destroy();
    });
    req.on("end", () => {
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch (_error) {
        resolve({});
      }
    });
    req.on("error", () => resolve({}));
  });
}

function decodeHtml(value) {
  return String(value || "")
    .replace(/<!\[CDATA\[(.*?)\]\]>/gis, "$1")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&nbsp;/gi, " ");
}

function stripHtml(value) {
  return decodeHtml(value).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function cleanFeedText(value) {
  return stripHtml(value)
    .replace(/\b[\w:-]+\s*=\s*["'][^"']*["']/gi, " ")
    .replace(/\b(?:data|srcset|sizes|loading|decoding|class|width|height)-?[a-z]*\s*=\s*["'][^"']*["']/gi, " ")
    .replace(/\s*\/>\s*/g, " ")
    .replace(/^\s*(?:foto|imagem)\s*:[^"“”]{0,140}["“”]\s*/i, "")
    .replace(/^[>"'\s-]+/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function pickRssTag(block, tagName) {
  const match = block.match(new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "i"));
  return match ? match[1] : "";
}

function pickRssAttr(block, tagName, attrName) {
  const match = block.match(new RegExp(`<${tagName}[^>]*${attrName}=["']([^"']+)["'][^>]*>`, "i"));
  return match ? match[1] : "";
}

function resolveFeedAssetUrl(baseUrl, candidate) {
  const cleanCandidate = decodeHtml(String(candidate || "").trim()).replace(/\\\//g, "/");
  if (!cleanCandidate) return "";

  try {
    return new URL(cleanCandidate, baseUrl || undefined).toString();
  } catch (_error) {
    return cleanCandidate;
  }
}

function pickLargestSrcsetCandidate(rawSrcset, baseUrl) {
  const entries = String(rawSrcset || "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const [urlPart, descriptor = ""] = entry.split(/\s+/, 2);
      const widthMatch = descriptor.match(/(\d+)w/i);
      return {
        url: resolveFeedAssetUrl(baseUrl, urlPart),
        width: Number(widthMatch?.[1] || 0)
      };
    })
    .filter((entry) => entry.url);

  if (!entries.length) return "";
  entries.sort((left, right) => right.width - left.width);
  return entries[0].url;
}

function shouldIgnoreImageUrl(value) {
  const imageUrl = String(value || "").toLowerCase();
  if (!imageUrl) return true;
  if (!/\.(?:avif|gif|jpe?g|png|svg|webp)(?:[?#].*)?$/i.test(imageUrl)) return true;
  if (/(?:logo|favicon|icon|avatar|emoji|gravatar|pixel|placeholder|spacer|blank)\b/i.test(imageUrl)) {
    return true;
  }
  return false;
}

function getImageCandidateScore(value) {
  const imageUrl = String(value || "").toLowerCase();
  let score = 0;

  if (!imageUrl) return -1000;
  if (shouldIgnoreImageUrl(imageUrl)) return -1000;
  if (imageUrl.includes("/wp-content/uploads/")) score += 40;
  if (/(?:featured|hero|wp-post-image|attachment)/i.test(imageUrl)) score += 16;
  if (/(?:1200|1024|1536|2048)/.test(imageUrl)) score += 10;
  if (/[-_](?:\d{3,4})x(?:\d{3,4})\./.test(imageUrl)) score -= 4;
  if (/\.avif(?:[?#].*)?$/i.test(imageUrl)) score += 2;

  return score;
}

function selectBestImageCandidate(candidates = []) {
  const unique = [...new Set(candidates.map((value) => String(value || "").trim()).filter(Boolean))];
  if (!unique.length) return "";

  const ranked = unique
    .map((url) => ({ url, score: getImageCandidateScore(url) }))
    .sort((left, right) => right.score - left.score);

  return ranked[0]?.url || "";
}

function collectImageCandidatesFromMarkup(markup, baseUrl) {
  const rawMarkup = decodeHtml(String(markup || "")).replace(/\\(["'])/g, "$1");
  if (!rawMarkup) return [];

  const candidates = [];
  const directPatterns = [
    /data-full-file=["']([^"']+)["']/gi,
    /data-large-file=["']([^"']+)["']/gi,
    /data-medium-file=["']([^"']+)["']/gi,
    /data-original=["']([^"']+)["']/gi,
    /data-lazy-src=["']([^"']+)["']/gi,
    /data-lazy-original=["']([^"']+)["']/gi,
    /data-srcset=["']([^"']+)["']/gi,
    /data-src=["']([^"']+)["']/gi,
    /<link[^>]+rel=["']image_src["'][^>]+href=["']([^"']+)["']/gi,
    /<img[^>]+src=["']([^"']+)["']/gi,
    /<video[^>]+poster=["']([^"']+)["']/gi,
    /<enclosure[^>]+url=["']([^"']+)["']/gi
  ];

  directPatterns.forEach((pattern) => {
    for (const match of rawMarkup.matchAll(pattern)) {
      const resolved = resolveFeedAssetUrl(baseUrl, match[1]);
      if (resolved) {
        candidates.push(resolved);
      }
    }
  });

  for (const match of rawMarkup.matchAll(/srcset=["']([^"']+)["']/gi)) {
    const resolved = pickLargestSrcsetCandidate(match[1], baseUrl);
    if (resolved) {
      candidates.push(resolved);
    }
  }

  const looseUrlMatches =
    rawMarkup.match(/https?:\/\/[^\s"'<>]+?\.(?:avif|gif|jpe?g|png|svg|webp)(?:\?[^\s"'<>]*)?/gi) || [];
  looseUrlMatches.forEach((url) => {
    const resolved = resolveFeedAssetUrl(baseUrl, url);
    if (resolved) {
      candidates.push(resolved);
    }
  });

  return candidates;
}

function extractImageFromMarkup(markup, baseUrl) {
  return selectBestImageCandidate(collectImageCandidatesFromMarkup(markup, baseUrl));
}

function pickCanonicalFeedImage(item = {}) {
  const sourceUrl = item.sourceUrl || item.url || "";
  const inlineMarkup = [
    item.summary,
    item.lede,
    item.description,
    Array.isArray(item.body) ? item.body.join(" ") : "",
    Array.isArray(item.highlights) ? item.highlights.join(" ") : ""
  ]
    .filter(Boolean)
    .join(" ");

  const candidates = [
    item.feedImageUrl,
    item.imageUrl,
    extractImageFromMarkup(inlineMarkup, sourceUrl)
  ];

  return candidates.find((candidate) => !shouldIgnoreImageUrl(candidate)) || "";
}

function extractBestSourceImage(html, baseUrl) {
  const rawHtml = decodeHtml(String(html || ""));
  if (!rawHtml) return "";

  const candidates = [];
  const metaMatches = rawHtml.match(/<meta[^>]+>/gi) || [];

  metaMatches.forEach((metaTag) => {
    const lowerTag = metaTag.toLowerCase();
    if (!/(?:og:image|twitter:image|twitter:image:src)/i.test(lowerTag)) {
      return;
    }

    const contentMatch = metaTag.match(/\bcontent=["']([^"']+)["']/i);
    if (!contentMatch?.[1]) {
      return;
    }

    const resolved = resolveFeedAssetUrl(baseUrl, contentMatch[1]);
    if (resolved) {
      candidates.push(resolved);
    }
  });

  const jsonLdBlocks = rawHtml.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi) || [];
  jsonLdBlocks.forEach((block) => {
    const jsonText = block
      .replace(/^<script[^>]*>/i, "")
      .replace(/<\/script>$/i, "")
      .trim();

    if (!jsonText) {
      return;
    }

    try {
      const parsed = JSON.parse(jsonText);
      const queue = Array.isArray(parsed) ? parsed : [parsed];

      queue.forEach((entry) => {
        const imageField = entry?.image;
        const values = Array.isArray(imageField)
          ? imageField
          : imageField && typeof imageField === "object"
            ? [imageField.url, imageField.contentUrl]
            : [imageField];

        values.forEach((value) => {
          const resolved = resolveFeedAssetUrl(baseUrl, value);
          if (resolved) {
            candidates.push(resolved);
          }
        });
      });
    } catch (_error) {
      // Ignora JSON-LD invalido da fonte.
    }
  });

  const focusedMarkupBlocks = [
    rawHtml.match(/<article\b[\s\S]*?<\/article>/i)?.[0] || "",
    rawHtml.match(/<main\b[\s\S]*?<\/main>/i)?.[0] || "",
    rawHtml
  ].filter(Boolean);

  focusedMarkupBlocks.forEach((block) => {
    candidates.push(...collectImageCandidatesFromMarkup(block, baseUrl));
  });

  return selectBestImageCandidate(candidates);
}

function splitFeedBlocks(xmlText, tagName) {
  const blocks = [];
  const pattern = new RegExp(`<${tagName}\\b[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "gi");

  for (const match of String(xmlText || "").matchAll(pattern)) {
    if (match?.[1]) {
      blocks.push(match[1]);
    }
  }

  return blocks;
}

function pickFirstFeedTag(block, tagNames = []) {
  for (const tagName of tagNames) {
    const value = pickRssTag(block, tagName);
    if (value) {
      return value;
    }
  }

  return "";
}

function pickFirstFeedAttr(block, candidates = []) {
  for (const candidate of candidates) {
    const value = pickRssAttr(block, candidate.tagName, candidate.attrName);
    if (value) {
      return value;
    }
  }

  return "";
}

function parseFeedDateValue(value) {
  const parsed = new Date(stripHtml(value));
  return Number.isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
}

function buildFeedRecordFromBlock(block, source, { atom = false } = {}) {
  const title = stripHtml(pickRssTag(block, "title"));
  const link =
    (atom
      ? pickFirstFeedAttr(block, [
          { tagName: "link", attrName: "href" },
          { tagName: "atom:link", attrName: "href" }
        ])
      : "") ||
    stripHtml(pickRssTag(block, "link")) ||
    stripHtml(pickRssTag(block, "guid")) ||
    stripHtml(pickRssTag(block, "id"));
  const pubDate = stripHtml(
    pickFirstFeedTag(block, ["pubDate", "published", "updated", "dc:date"])
  );
  const rawCategory =
    stripHtml(pickRssTag(block, "category")) ||
    pickFirstFeedAttr(block, [
      { tagName: "category", attrName: "term" },
      { tagName: "category", attrName: "label" }
    ]) ||
    source.defaultCategory ||
    "Cotidiano";
  const descriptionMarkup = pickFirstFeedTag(block, ["description", "summary"]);
  const encodedMarkup = pickFirstFeedTag(block, ["content:encoded", "content"]);
  const description = cleanFeedText(descriptionMarkup) || cleanFeedText(encodedMarkup);
  const imageUrl =
    pickRssAttr(block, "media:content", "url") ||
    pickRssAttr(block, "media:thumbnail", "url") ||
    pickRssAttr(block, "enclosure", "url") ||
    extractImageFromMarkup([descriptionMarkup, encodedMarkup].filter(Boolean).join(" "), link) ||
    "";

  if (!title || !link) {
    return null;
  }

  const category = normalizeNewsCategoryLabel(rawCategory, {
    defaultCategory: source.defaultCategory,
    title,
    summary: description,
    sourceName: source.name || source.id || "Fonte"
  });

  return {
    id: link,
    slug: slugify(title),
    title,
    summary: description,
    lede: description,
    url: link,
    sourceUrl: link,
    sourceName: source.name || source.id || "Fonte",
    sourceLabel: title,
    category,
    publishedAt: parseFeedDateValue(pubDate),
    imageUrl: imageUrl || "",
    feedImageUrl: imageUrl || "",
    sourceImageUrl: ""
  };
}

function parseRssItems(xmlText, source) {
  const rssItems = splitFeedBlocks(xmlText, "item").map((block) =>
    buildFeedRecordFromBlock(block, source)
  );
  const atomEntries = splitFeedBlocks(xmlText, "entry").map((block) =>
    buildFeedRecordFromBlock(block, source, { atom: true })
  );

  return [...rssItems, ...atomEntries]
    .filter(Boolean);
}

function fetchRemoteText(remoteUrl, { timeoutMs = 8000, maxBytes = 1200000, maxRedirects = 4 } = {}) {
  return new Promise((resolve, reject) => {
    let parsed;
    try {
      parsed = new URL(remoteUrl);
    } catch (error) {
      return reject(error);
    }

    const client = parsed.protocol === "https:" ? require("https") : require("http");
    const req = client.get(
      remoteUrl,
      {
        timeout: timeoutMs,
        headers: REMOTE_REQUEST_HEADERS
      },
      (resp) => {
        const statusCode = Number(resp.statusCode || 0);
        const redirectLocation = String(resp.headers.location || "").trim();

        if (
          statusCode >= 300 &&
          statusCode < 400 &&
          redirectLocation &&
          maxRedirects > 0
        ) {
          const targetUrl = resolveAbsoluteUrl(remoteUrl, redirectLocation);
          resp.resume();
          if (!targetUrl) {
            return reject(new Error("redirect"));
          }
          return resolve(
            fetchRemoteText(targetUrl, {
              timeoutMs,
              maxBytes,
              maxRedirects: maxRedirects - 1
            })
          );
        }

        if (statusCode >= 400) {
          resp.resume();
          return reject(new Error(`http_${statusCode}`));
        }

        let raw = "";
        resp.setEncoding("utf8");
        resp.on("data", (chunk) => {
          raw += chunk;
          if (raw.length > maxBytes) {
            resp.destroy();
          }
        });
        resp.on("end", () => resolve(raw));
      }
    );

    req.on("error", reject);
    req.on("timeout", () => {
      req.destroy();
      reject(new Error("timeout"));
    });
  });
}

function fetchRssFeed(feedUrl, options = {}) {
  return fetchRemoteText(feedUrl, { timeoutMs: 4500, maxBytes: 1200000, ...options });
}

async function refreshRssRuntime(limitPerSource = 30) {
  const reports = [];
  const items = [];

  for (const source of RSS_SOURCES) {
    try {
      const xml = await fetchRssFeed(source.feedUrl);
      const parsedItems = parseRssItems(xml, source).slice(0, limitPerSource);
      items.push(...parsedItems);
      reports.push({ source: source.id, ok: true, count: parsedItems.length });
    } catch (error) {
      reports.push({ source: source.id, ok: false, error: String(error?.message || "falha") });
    }
  }

  const deduped = [];
  const seen = new Set();
  items.forEach((item) => {
    const key = item.url || item.sourceUrl || item.title;
    if (!key || seen.has(key)) return;
    seen.add(key);
    deduped.push(item);
  });

  const enrichedItems = await enrichNewsItemsWithSourceImages(deduped);

  const payload = {
    lastAttemptAt: new Date().toISOString(),
    lastSuccessAt: enrichedItems.length ? new Date().toISOString() : null,
    items: enrichedItems,
    reports
  };

  writeJson(path.join(DATA_DIR, "runtime-news.json"), payload);
  if (enrichedItems.length) {
    writeStaticNewsData(enrichedItems);
  }
  return payload;
}

function getTopicFeedCacheFile(topic) {
  return path.join(DATA_DIR, `topic-feed-${slugify(topic || "topic")}.json`);
}

function getTopicFeedSources(topic) {
  const normalizedTopic = normalizeText(topic);
  return Array.isArray(TOPIC_FEED_CONFIG[normalizedTopic]) ? TOPIC_FEED_CONFIG[normalizedTopic] : [];
}

function readTopicFeedFallback(topic) {
  const fallback = readJson(TOPIC_FEED_FALLBACK_FILE, {});
  const items = fallback && typeof fallback === "object" ? fallback[normalizeText(topic)] : [];
  return Array.isArray(items) ? items : [];
}

function normalizeTopicFeedItem(item = {}, topic = "", sourceMeta = {}) {
  const normalizedTopic = normalizeText(topic);
  const normalizedRecord = normalizeArticleRecord({
    ...item,
    sourceName: item.sourceName || sourceMeta.name || item.source || "Fonte",
    sourceUrl: item.sourceUrl || item.url || sourceMeta.siteUrl || "#",
    defaultCategory: item.defaultCategory || sourceMeta.defaultCategory || item.category || "Cotidiano"
  });

  return {
    ...normalizedRecord,
    topic: normalizedTopic,
    topicGroup:
      normalizeText(item.topicGroup || sourceMeta.topicGroup || normalizedRecord.categoryKey || "") || "",
    summary: cleanShortText(item.summary || item.lede || item.description || normalizedRecord.summary, 260),
    lede: cleanShortText(item.lede || item.summary || item.description || normalizedRecord.lede, 220)
  };
}

function dedupeTopicFeedItems(items = []) {
  const map = new Map();

  items.forEach((item) => {
    const normalized = normalizeTopicFeedItem(item, item.topic || "", item);
    const key =
      normalized.sourceUrl ||
      normalized.slug ||
      normalized.id ||
      `${normalized.sourceName}-${normalized.title}`;

    if (!key || map.has(key)) {
      return;
    }

    map.set(key, normalized);
  });

  return Array.from(map.values()).sort(sortArticleItems);
}

function pickBalancedTopicFeedItems(items = [], limit = 12) {
  const deduped = dedupeTopicFeedItems(items);
  const buckets = new Map();

  deduped.forEach((item) => {
    const groupKey = normalizeText(item.topicGroup || "geral") || "geral";
    if (!buckets.has(groupKey)) {
      buckets.set(groupKey, []);
    }
    buckets.get(groupKey).push(item);
  });

  const selected = [];
  let progressed = true;

  while (selected.length < limit && progressed) {
    progressed = false;

    buckets.forEach((bucket) => {
      if (selected.length >= limit || !bucket.length) {
        return;
      }

      selected.push(bucket.shift());
      progressed = true;
    });
  }

  return selected.slice(0, Math.max(1, Math.min(40, limit)));
}

function mergeTopicFeedItems(primaryItems = [], fallbackItems = [], limit = 12) {
  return pickBalancedTopicFeedItems(
    [...(primaryItems || []), ...(fallbackItems || [])],
    Math.max(1, Math.min(40, limit))
  );
}

function buildTopicFeedFallback(topic, limit = 12) {
  return readTopicFeedFallback(topic)
    .map((item) => normalizeTopicFeedItem(item, topic, item))
    .sort(sortArticleItems)
    .slice(0, Math.max(1, Math.min(40, limit)));
}

async function refreshTopicFeed(topic, { limitPerSource = 8, totalLimit = 12 } = {}) {
  const normalizedTopic = normalizeText(topic);
  const sources = getTopicFeedSources(normalizedTopic);
  if (!sources.length) {
    return {
      topic: normalizedTopic,
      updatedAt: new Date().toISOString(),
      items: buildTopicFeedFallback(normalizedTopic, totalLimit),
      reports: [],
      fallbackUsed: true
    };
  }

  const sourceResults = await mapWithConcurrency(sources, 4, async (source) => {
    try {
      const xml = await fetchRssFeed(source.feedUrl);
      const items = parseRssItems(xml, source)
        .slice(0, limitPerSource)
        .map((item) => ({
          ...item,
          topic: normalizedTopic,
          topicGroup: source.topicGroup || "",
          sourceName: source.name || item.sourceName || "Fonte",
          sourceUrl: item.sourceUrl || item.url || source.siteUrl || "#",
          defaultCategory: source.defaultCategory || item.category || "Cotidiano"
        }));

      return {
        items,
        report: { source: source.id, ok: true, count: items.length }
      };
    } catch (error) {
      return {
        items: [],
        report: { source: source.id, ok: false, error: String(error?.message || "falha") }
      };
    }
  });

  const reports = sourceResults.map((entry) => entry.report);
  const normalizedItems = pickBalancedTopicFeedItems(
    sourceResults
      .flatMap((entry) => entry.items)
      .map((item) => normalizeTopicFeedItem(item, normalizedTopic, item)),
    Math.max(1, Math.min(40, totalLimit))
  );

  const mergedItems = mergeTopicFeedItems(
    normalizedItems,
    buildTopicFeedFallback(normalizedTopic, totalLimit),
    totalLimit
  );
  const enrichedItems = await enrichNewsItemsWithSourceImages(mergedItems);

  const payload = {
    topic: normalizedTopic,
    updatedAt: new Date().toISOString(),
    items: enrichedItems,
    reports,
    fallbackUsed: normalizedItems.length === 0
  };

  writeJson(getTopicFeedCacheFile(normalizedTopic), payload);
  return payload;
}

async function getTopicFeed(topic, limit = 12) {
  const normalizedTopic = normalizeText(topic);
  const safeLimit = Math.max(1, Math.min(40, Number(limit) || 12));

  if (!getTopicFeedSources(normalizedTopic).length) {
    return {
      ok: false,
      topic: normalizedTopic,
      updatedAt: null,
      items: [],
      fallbackUsed: false
    };
  }

  const cached = readJson(getTopicFeedCacheFile(normalizedTopic), null);
  const cachedItems = Array.isArray(cached?.items)
    ? cached.items.map((item) => normalizeTopicFeedItem(item, normalizedTopic, item))
    : [];
  const cachedUpdatedAt = cached?.updatedAt ? Date.parse(cached.updatedAt) : 0;
  const cacheIsFresh =
    cachedItems.length > 0 && Number.isFinite(cachedUpdatedAt) && Date.now() - cachedUpdatedAt < TOPIC_FEED_TTL_MS;

  if (cacheIsFresh) {
    return {
      ok: true,
      topic: normalizedTopic,
      updatedAt: cached.updatedAt,
      items: cachedItems.slice(0, safeLimit),
      reports: Array.isArray(cached?.reports) ? cached.reports : [],
      fallbackUsed: Boolean(cached?.fallbackUsed)
    };
  }

  try {
    const refreshed = await withPromiseTimeout(
      refreshTopicFeed(normalizedTopic, {
        limitPerSource: 8,
        totalLimit: Math.max(safeLimit, 12)
      }),
      9000,
      "topic_feed_timeout"
    );

    if (Array.isArray(refreshed?.items) && refreshed.items.length) {
      return {
        ok: true,
        topic: normalizedTopic,
        updatedAt: refreshed.updatedAt,
        items: refreshed.items.slice(0, safeLimit),
        reports: Array.isArray(refreshed?.reports) ? refreshed.reports : [],
        fallbackUsed: Boolean(refreshed?.fallbackUsed)
      };
    }
  } catch (_error) {
    // queda para cache ou fallback abaixo
  }

  if (cachedItems.length) {
    return {
      ok: true,
      topic: normalizedTopic,
      updatedAt: cached?.updatedAt || null,
      items: cachedItems.slice(0, safeLimit),
      reports: Array.isArray(cached?.reports) ? cached.reports : [],
      fallbackUsed: Boolean(cached?.fallbackUsed),
      stale: true
    };
  }

  const fallbackItems = buildTopicFeedFallback(normalizedTopic, safeLimit);
  return {
    ok: true,
    topic: normalizedTopic,
    updatedAt: new Date().toISOString(),
    items: fallbackItems,
    reports: [],
    fallbackUsed: true,
    stale: true
  };
}

function isAllowedPreviewHost(hostname) {
  if (!hostname) return false;
  const cleanHost = hostname.toLowerCase();
  return IMAGE_PREVIEW_ALLOWLIST.some(
    (allowed) => cleanHost === allowed || cleanHost.endsWith(`.${allowed}`)
  );
}

function resolveAbsoluteUrl(baseUrl, candidate) {
  try {
    return new URL(candidate, baseUrl).toString();
  } catch (_error) {
    return "";
  }
}

function extractOgImage(html, baseUrl) {
  return extractBestSourceImage(html, baseUrl) || "";
}

function fetchPreviewImage(sourceUrl) {
  return new Promise((resolve) => {
    let parsed;
    try {
      parsed = new URL(sourceUrl);
    } catch (_error) {
      return resolve("");
    }

    if (!/^https?:$/.test(parsed.protocol)) {
      return resolve("");
    }

    if (!isAllowedPreviewHost(parsed.hostname)) {
      return resolve("");
    }

    loadImagePreviewCache();
    const cached = IMAGE_PREVIEW_CACHE.get(sourceUrl);
    if (cached && Date.now() - cached.at < IMAGE_PREVIEW_TTL_MS) {
      return resolve(cached.url || "");
    }

    fetchRemoteText(sourceUrl, { timeoutMs: 2500, maxBytes: 350000 })
      .then((raw) => {
        const imageUrl = extractBestSourceImage(raw, sourceUrl);
        updateImagePreviewCache(sourceUrl, imageUrl);
        resolve(imageUrl);
      })
      .catch(() => resolve(""));
  });
}

async function mapWithConcurrency(items = [], limit = 4, mapper) {
  const safeItems = Array.isArray(items) ? items : [];
  const concurrency = Math.max(1, Math.min(limit, safeItems.length || 1));
  const results = new Array(safeItems.length);
  let cursor = 0;

  await Promise.all(
    Array.from({ length: concurrency }, async () => {
      while (cursor < safeItems.length) {
        const currentIndex = cursor++;
        results[currentIndex] = await mapper(safeItems[currentIndex], currentIndex);
      }
    })
  );

  return results;
}

function withPromiseTimeout(promise, timeoutMs = 9000, reason = "timeout") {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(reason)), timeoutMs);

    Promise.resolve(promise)
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((error) => {
        clearTimeout(timer);
        reject(error);
      });
  });
}

async function enrichNewsItemsWithSourceImages(items = []) {
  return mapWithConcurrency(items, 4, async (item) => {
    if (!item || !item.sourceUrl) {
      return item;
    }

    const canonicalFeedImage = pickCanonicalFeedImage(item);
    if (canonicalFeedImage) {
      return {
        ...item,
        feedImageUrl: canonicalFeedImage || item.feedImageUrl || item.imageUrl || "",
        sourceImageUrl: item.sourceImageUrl || "",
        imageUrl: canonicalFeedImage || item.imageUrl || item.feedImageUrl || ""
      };
    }

    const sourceImageUrl = await fetchPreviewImage(item.sourceUrl).catch(() => "");
    return {
      ...item,
      feedImageUrl: canonicalFeedImage || item.feedImageUrl || item.imageUrl || "",
      sourceImageUrl: sourceImageUrl || item.sourceImageUrl || "",
      imageUrl:
        canonicalFeedImage ||
        sourceImageUrl ||
        item.imageUrl ||
        item.feedImageUrl ||
        ""
    };
  });
}

function mimeFor(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case ".html":
      return "text/html; charset=utf-8";
    case ".css":
      return "text/css; charset=utf-8";
    case ".js":
      return "application/javascript; charset=utf-8";
    case ".json":
      return "application/json; charset=utf-8";
    case ".xml":
      return "application/xml; charset=utf-8";
    case ".webmanifest":
      return "application/manifest+json; charset=utf-8";
    case ".svg":
      return "image/svg+xml";
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".webp":
      return "image/webp";
    case ".gif":
      return "image/gif";
    case ".ico":
      return "image/x-icon";
    case ".txt":
      return "text/plain; charset=utf-8";
    default:
      return "application/octet-stream";
  }
}

function isCompressibleMime(mimeType) {
  return COMPRESSIBLE_MIME_TYPES.some((prefix) => mimeType.startsWith(prefix));
}

function getStaticCacheControl(filePath, hasVersionParam = false) {
  const ext = path.extname(filePath).toLowerCase();
  const baseName = path.basename(filePath);

  if (ext === ".html" || ext === ".css" || ext === ".js") {
    return "no-store";
  }

  if (DYNAMIC_ASSET_BASENAMES.has(baseName)) {
    return "no-store";
  }

  if (
    ext === ".svg" ||
    ext === ".png" ||
    ext === ".jpg" ||
    ext === ".jpeg" ||
    ext === ".webp" ||
    ext === ".gif" ||
    ext === ".ico"
  ) {
    return "public, max-age=86400";
  }

  if (ext === ".webmanifest" || ext === ".xml" || baseName === "robots.txt") {
    return "public, max-age=3600";
  }

  if (hasVersionParam) {
    return "no-store";
  }

  return "no-store";
}

function maybeCompressBuffer(req, mimeType, buffer) {
  if (!req || !buffer || buffer.length < 1024 || !isCompressibleMime(mimeType)) {
    return { buffer, encoding: "" };
  }

  const acceptEncoding = String(req.headers["accept-encoding"] || "").toLowerCase();

  try {
    if (acceptEncoding.includes("br")) {
      return {
        buffer: zlib.brotliCompressSync(buffer, {
          params: {
            [zlib.constants.BROTLI_PARAM_QUALITY]: 4
          }
        }),
        encoding: "br"
      };
    }

    if (acceptEncoding.includes("gzip")) {
      return {
        buffer: zlib.gzipSync(buffer, { level: 6 }),
        encoding: "gzip"
      };
    }
  } catch (_error) {
    return { buffer, encoding: "" };
  }

  return { buffer, encoding: "" };
}

function sendFile(req, res, filePath, options = {}) {
  fs.readFile(filePath, (err, buffer) => {
    if (err) {
      return sendText(res, 404, "Arquivo não encontrado.");
    }
    const mimeType = mimeFor(filePath);
    let fileBuffer = buffer;

    if (mimeType.startsWith("text/html") && options.templateVars) {
      let html = buffer.toString("utf-8");
      Object.entries(options.templateVars).forEach(([key, value]) => {
        html = html.replace(new RegExp(`{{\\s*${key}\\s*}}`, "g"), String(value ?? ""));
      });

      if (
        options.templateVars.SEO_JSON_LD &&
        !/<script[^>]+type=["']application\/ld\+json["']/i.test(html)
      ) {
        html = html.replace(
          /<\/head>/i,
          `    <script type="application/ld+json">${options.templateVars.SEO_JSON_LD}</script>\n  </head>`
        );
      }

      fileBuffer = Buffer.from(html, "utf-8");
    }

    const { buffer: finalBuffer, encoding } = maybeCompressBuffer(req, mimeType, fileBuffer);
    const cacheControl = options.cacheControl || getStaticCacheControl(filePath);
    const headers = {
      "Content-Type": mimeType,
      "Cache-Control": cacheControl,
      "Content-Length": finalBuffer.length,
    };

    if (/no-store/i.test(cacheControl)) {
      headers.Pragma = "no-cache";
      headers.Expires = "0";
      headers["Surrogate-Control"] = "no-store";
    }

    if (encoding) {
      headers["Content-Encoding"] = encoding;
      headers.Vary = "Accept-Encoding";
    }

    res.writeHead(200, {
      ...headers
    });
    res.end(finalBuffer);
  });
}

function normalizeNewsItem(item) {
  const title = item.title || "Atualização";
  const sourceUrl = item.url || item.sourceUrl || item.link || "#";
  const sourceName = item.source || item.sourceName || item.sourceLabel || "Fonte local";
  const slug = String(item.slug || slugify(title) || item.id || "").trim();
  const category = normalizeNewsCategoryLabel(item.category, {
    defaultCategory: item.defaultCategory,
    title,
    summary: item.summary || item.lede || item.description,
    sourceName
  });

  return {
    id: item.id || sourceUrl || `news-${Date.now()}`,
    slug,
    title,
    summary: cleanShortText(cleanFeedText(item.summary || item.lede || item.description), 260) || "Sem resumo.",
    url: sourceUrl,
    sourceUrl,
    source: sourceName,
    sourceName,
    sourceLabel: item.sourceLabel || title,
    category,
    location: item.location || "Cruzeiro do Sul",
    date: item.date || item.publishedAt || item.createdAt || new Date().toISOString(),
  };
}

function normalizeArticleRecord(item) {
  const title = String(item.title || "Atualizacao");
  const categoryKey = normalizeNewsCategoryKey(item.category, {
    defaultCategory: item.defaultCategory,
    title,
    summary: item.summary || item.lede || item.description,
    sourceName: item.sourceName || item.source || item.sourceLabel
  });
  const category = formatCategoryLabel(categoryKey);
  const sourceName = item.sourceName || item.source || item.sourceLabel || "Fonte local";
  const sourceUrl = item.sourceUrl || item.url || item.link || "#";
  const publishedAt = item.publishedAt || item.date || item.createdAt || new Date().toISOString();
  const slug = String(item.slug || slugify(title) || item.id || "").trim();

  return {
    id: item.id || slug || sourceUrl || title,
    slug,
    title,
    eyebrow: item.eyebrow || categoryKey || "geral",
    date: item.date || formatDisplayDate(publishedAt),
    publishedAt,
    category,
    categoryKey,
    previewClass: item.previewClass || PREVIEW_CLASS_BY_CATEGORY[categoryKey] || "thumb-servico",
    sourceName,
    sourceUrl,
    sourceLabel: item.sourceLabel || title,
    lede: item.lede || item.summary || item.description || "Sem resumo.",
    summary: item.summary || item.lede || item.description || "Sem resumo.",
    analysis: item.analysis || "",
    body: Array.isArray(item.body) ? item.body.filter(Boolean) : [],
    highlights: Array.isArray(item.highlights) ? item.highlights.filter(Boolean) : [],
    development: Array.isArray(item.development) ? item.development.filter(Boolean) : [],
    imageUrl: item.feedImageUrl || item.imageUrl || item.sourceImageUrl || item.image || "",
    sourceImageUrl: item.sourceImageUrl || "",
    feedImageUrl: item.feedImageUrl || item.imageUrl || item.sourceImageUrl || "",
    imageCredit: item.imageCredit || "",
    imageFocus: item.imageFocus || "",
    imageFit: item.imageFit || "",
    media: item.media || null,
    priority: Number(item.priority || 0)
  };
}

function getRawNewsItems() {
  const runtime = readJson(path.join(DATA_DIR, "runtime-news.json"), []);
  const archive = readJson(path.join(DATA_DIR, "news-archive.json"), []);
  const staticNews = getStaticNewsItems();

  return []
    .concat(Array.isArray(runtime) ? runtime : runtime.items || [])
    .concat(Array.isArray(archive) ? archive : archive.items || [])
    .concat(staticNews);
}

function getEditorialFocusScore(item = {}) {
  const text = normalizeText(
    [
      item.title,
      item.summary,
      item.lede,
      item.category,
      item.categoryKey,
      item.location,
      item.sourceName,
      item.sourceLabel,
      item.sourceUrl
    ].join(" ")
  );
  const isAcre = /\b(acre|rio branco|sena madureira|feijo|feij[oó]|xapuri|brasileia|epitaciolandia|assis brasil|placido de castro)\b/.test(
    text
  );
  const isValeJurua =
    /\b(cruzeiro do sul|jurua|juru[aá]|mancio lima|m[âa]ncio lima|porto walter|marechal thaumaturgo|tarauaca|tarauac[aá])\b/.test(
      text
    ) || (isAcre && /\brodrigues alves\b/.test(text));
  const isImportant =
    /\b(alerta|urgente|defesa civil|enchente|alag|saude|hospital|seguranca|policia|crime|acidente|educacao|prefeitura|governo|governador|governadora|eleicao|stf|congresso|senado|bolsonaro|lula)\b/.test(
      text
    );
  const isGlobalEntertainment =
    /\b(cinema|filme|trailer|estreia|bilheteria|teatro|peca|peça|famoso|famosa|celebridade|fofoca|michael jackson|entretenimento|novidades|tecnologia|games)\b/.test(
      text
    );

  if (isValeJurua) return 300 + (isImportant ? 40 : 0);
  if (isAcre) return 220 + (isImportant ? 35 : 0);
  if (isImportant) return 80;
  if (isGlobalEntertainment) return 90;
  return 40;
}

function sortArticleItems(left, right) {
  const rightFocus = getEditorialFocusScore(right);
  const leftFocus = getEditorialFocusScore(left);
  if (rightFocus !== leftFocus) {
    return rightFocus - leftFocus;
  }

  const rightDate = new Date(right.publishedAt || right.date || 0).getTime();
  const leftDate = new Date(left.publishedAt || left.date || 0).getTime();

  if (rightDate !== leftDate) {
    return rightDate - leftDate;
  }

  return Number(right.priority || 0) - Number(left.priority || 0);
}

function getArticleNews(limit = 30) {
  const items = getRawNewsItems().map(normalizeArticleRecord);
  const map = new Map();

  items.forEach((item) => {
    const key = item.slug || item.sourceUrl || item.id || item.title;
    if (!map.has(key)) {
      map.set(key, item);
    }
  });

  return Array.from(map.values()).sort(sortArticleItems).slice(0, limit);
}

function getArticleBySlug(slug) {
  if (!slug) {
    return null;
  }

  const targetSlug = normalizeLookupSlug(slug);
  return (
    getArticleNews(500).find((item) => normalizeLookupSlug(item.slug) === targetSlug) || null
  );
}

function getNewsArchive(limit = 500) {
  return getArticleNews(Math.max(1, Math.min(1000, limit)));
}

function getNewsSuggestions(query = "", limit = 80) {
  const normalizedQuery = normalizeText(query);
  const seen = new Set();
  const suggestions = [];

  getNewsArchive(1000).forEach((item) => {
    const values = [
      { type: "titulo", value: item.title, slug: item.slug },
      { type: "editoria", value: item.category, slug: "" },
      { type: "fonte", value: item.sourceName, slug: "" },
      { type: "assunto", value: item.sourceLabel, slug: item.slug },
      ...(Array.isArray(item.highlights)
        ? item.highlights.map((value) => ({ type: "destaque", value, slug: item.slug }))
        : [])
    ];

    values.forEach((suggestion) => {
      const label = String(suggestion.value || "").trim();
      const key = normalizeText(label);

      if (!label || seen.has(key)) {
        return;
      }

      if (normalizedQuery && !key.includes(normalizedQuery)) {
        return;
      }

      seen.add(key);
      suggestions.push({
        ...suggestion,
        value: label
      });
    });
  });

  return suggestions.slice(0, Math.max(1, Math.min(200, limit)));
}

function getElectionVotesFile() {
  return path.join(DATA_DIR, "election-votes.json");
}

function getCurrentWeekBucketKey() {
  return getWeekBucketKey(new Date().toISOString());
}

function normalizeElectionVoterOfficeEntry(entry) {
  if (typeof entry === "string") {
    return {
      candidateId: safeString(entry, 160),
      weekKey: getCurrentWeekBucketKey(),
      at: ""
    };
  }

  if (entry && typeof entry === "object" && !Array.isArray(entry)) {
    const candidateId = safeString(entry.candidateId || entry.vote || entry.value || "", 160);
    const at = safeString(entry.at || entry.createdAt || "", 80);
    return {
      candidateId,
      weekKey: safeString(entry.weekKey || "", 24) || getWeekBucketKey(at || new Date().toISOString()),
      at
    };
  }

  return {
    candidateId: "",
    weekKey: "",
    at: ""
  };
}

function getElectionCurrentUserVotes(voterRecord = {}, weekKey = getCurrentWeekBucketKey()) {
  const currentVotes = {};
  Object.entries(voterRecord || {}).forEach(([officeId, rawEntry]) => {
    const entry = normalizeElectionVoterOfficeEntry(rawEntry);
    if (!entry.candidateId || entry.weekKey !== weekKey) {
      return;
    }
    currentVotes[officeId] = entry.candidateId;
  });
  return currentVotes;
}

function getElectionVoteStore() {
  const store = readJson(getElectionVotesFile(), {});
  return {
    votes: store && typeof store.votes === "object" && !Array.isArray(store.votes) ? store.votes : {},
    voters: store && typeof store.voters === "object" && !Array.isArray(store.voters) ? store.voters : {},
    records: Array.isArray(store.records) ? store.records : [],
    updatedAt: store.updatedAt || null
  };
}

function writeElectionVoteStore(store) {
  writeJson(getElectionVotesFile(), {
    votes: store.votes || {},
    voters: store.voters || {},
    records: Array.isArray(store.records) ? store.records : [],
    updatedAt: new Date().toISOString()
  });
}

function getElectionOffice(officeId) {
  const config = getElectionConfig();
  const offices = Array.isArray(config.offices) ? config.offices : [];
  return offices.find((office) => office.id === officeId) || null;
}

function getElectionCandidate(office, candidateId) {
  const candidates = Array.isArray(office?.candidates) ? office.candidates : [];
  return candidates.find((candidate) => candidate.id === candidateId) || null;
}

function buildElectionOpinionSummary(recordsInput = null) {
  const records = Array.isArray(recordsInput) ? recordsInput : getElectionVoteRecords();
  const summary = {};

  records.forEach((record) => {
    const officeId = String(record.officeId || "").trim();
    const candidateId = String(record.candidateId || record.candidateName || "").trim();

    if (!officeId || !candidateId) {
      return;
    }

    if (!summary[officeId]) {
      summary[officeId] = {
        officeId,
        office: record.office || officeId,
        totalVotes: 0,
        totalComments: 0,
        candidateMap: {}
      };
    }

    const officeBucket = summary[officeId];
    officeBucket.totalVotes += 1;

    if (!officeBucket.candidateMap[candidateId]) {
      officeBucket.candidateMap[candidateId] = {
        candidateId,
        candidateName: record.candidateName || candidateId,
        candidateParty: record.candidateParty || "",
        totalVotes: 0,
        commentCount: 0,
        positiveCount: 0,
        neutralCount: 0,
        negativeCount: 0,
        mixedCount: 0,
        noOpinionCount: 0,
        favorableReelection: 0,
        desgasteReelection: 0,
        cities: {}
      };
    }

    const candidateBucket = officeBucket.candidateMap[candidateId];
    const cityKey = safeString(record.city || "não informado", 80) || "não informado";

    candidateBucket.totalVotes += 1;
    candidateBucket.cities[cityKey] = (candidateBucket.cities[cityKey] || 0) + 1;

    if (record.observation) {
      officeBucket.totalComments += 1;
      candidateBucket.commentCount += 1;
    }

    if (record.sentiment === "positivo") {
      candidateBucket.positiveCount += 1;
    } else if (record.sentiment === "negativo") {
      candidateBucket.negativeCount += 1;
    } else {
      candidateBucket.neutralCount += 1;
    }

    if (record.sentiment === "misto") {
      candidateBucket.mixedCount += 1;
    }

    if (record.sentiment === "sem-opiniao") {
      candidateBucket.noOpinionCount += 1;
    }

    if (record.reelectionSignal === "favoravel") {
      candidateBucket.favorableReelection += 1;
    } else if (record.reelectionSignal === "desgaste") {
      candidateBucket.desgasteReelection += 1;
    }
  });

  return Object.fromEntries(
    Object.entries(summary).map(([officeId, officeBucket]) => {
      const candidates = Object.values(officeBucket.candidateMap)
        .map((candidateBucket) => {
          const topCities = Object.entries(candidateBucket.cities)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3);
          const topCity = topCities[0]?.[0] || "";
          let moodLabel = "equilibrado";

          if (candidateBucket.commentCount <= 1 && candidateBucket.totalVotes <= 1) {
            moodLabel = "amostra inicial";
          } else if (
            candidateBucket.positiveCount > candidateBucket.negativeCount + 1 ||
            candidateBucket.favorableReelection > candidateBucket.desgasteReelection + 1
          ) {
            moodLabel = "favoravel a reeleicao";
          } else if (
            candidateBucket.negativeCount > candidateBucket.positiveCount + 1 ||
            candidateBucket.desgasteReelection > candidateBucket.favorableReelection + 1
          ) {
            moodLabel = "pressao contra reeleicao";
          } else if (candidateBucket.positiveCount > candidateBucket.negativeCount) {
            moodLabel = "favor e aprovacao";
          } else if (candidateBucket.negativeCount > candidateBucket.positiveCount) {
            moodLabel = "pressao e critica";
          }

          return {
            candidateId: candidateBucket.candidateId,
            candidateName: candidateBucket.candidateName,
            candidateParty: candidateBucket.candidateParty,
            totalVotes: candidateBucket.totalVotes,
            commentCount: candidateBucket.commentCount,
            positiveCount: candidateBucket.positiveCount,
            neutralCount: candidateBucket.neutralCount,
            negativeCount: candidateBucket.negativeCount,
            mixedCount: candidateBucket.mixedCount,
            noOpinionCount: candidateBucket.noOpinionCount,
            favorableReelection: candidateBucket.favorableReelection,
            desgasteReelection: candidateBucket.desgasteReelection,
            topCity,
            citiesLabel: topCities.map(([city, total]) => `${city} (${total})`).join(" • "),
            moodLabel
          };
        })
        .sort((a, b) => {
          const signalA = a.positiveCount + a.favorableReelection - a.negativeCount - a.desgasteReelection;
          const signalB = b.positiveCount + b.favorableReelection - b.negativeCount - b.desgasteReelection;
          return (
            b.commentCount - a.commentCount ||
            b.totalVotes - a.totalVotes ||
            signalB - signalA ||
            a.candidateName.localeCompare(b.candidateName, "pt-BR")
          );
        });

      return [
        officeId,
        {
          officeId,
          office: officeBucket.office,
          totalVotes: officeBucket.totalVotes,
          totalComments: officeBucket.totalComments,
          candidates
        }
      ];
    })
  );
}

function buildElectionVotesFromRecords(records = []) {
  const votes = {};
  (Array.isArray(records) ? records : []).forEach((record) => {
    const officeId = safeString(record.officeId || "", 120);
    const candidateId = safeString(record.candidateId || "", 160);
    if (!officeId || !candidateId) {
      return;
    }
    votes[officeId] = votes[officeId] || {};
    votes[officeId][candidateId] = Number(votes[officeId][candidateId] || 0) + 1;
  });
  return votes;
}

function getElectionPublicSnapshot(voterId = "") {
  const store = getElectionVoteStore();
  const safeVoterId = String(voterId || "").slice(0, 120);
  const currentWeekKey = getCurrentWeekBucketKey();
  const voterRecord = safeVoterId && store.voters[safeVoterId] ? store.voters[safeVoterId] : {};
  const userVotes = getElectionCurrentUserVotes(voterRecord, currentWeekKey);
  const currentWeekRecords = getElectionVoteRecords().filter(
    (record) => safeString(record.weekKey || "", 24) === currentWeekKey
  );
  const weeklyTrend = buildWeeklyTrendSeries(
    getElectionVoteRecords().map((record) => ({
      ...record,
      weeklyLabel: `${record.candidateName || record.candidateId || "Candidato"} (${record.office || record.officeId || "Cargo"})`
    })),
    { valueField: "weeklyLabel", totalLabel: "totalVotes" }
  );
  return {
    votes: buildElectionVotesFromRecords(currentWeekRecords),
    userVotes,
    opinionSummary: buildElectionOpinionSummary(currentWeekRecords),
    weeklyTrend,
    totalHistoryVotes: getElectionVoteRecords().length,
    currentWeekKey,
    updatedAt: store.updatedAt
  };
}

function recordElectionVote(payload = {}, req = null) {
  const safeOfficeId = String(payload.officeId || "").trim();
  const safeCandidateId = String(payload.candidateId || "").trim();
  const safeGoogleSub = "";
  const safeGoogleEmail = "";
  const safeVoterId = safeString(payload.voterId || payload.deviceId || payload.visitorId, 120);
  const office = getElectionOffice(safeOfficeId);
  const tracking = buildTrackingMeta(req, payload);
  const currentFingerprints = buildWeeklyDeviceFingerprints(tracking);
  const city = safeString(payload.city || tracking.city || "", 80);
  const voterName = safeString(payload.name || payload.voterName, 120);
  const voterParty = safeString(payload.party || payload.voterParty, 90);
  const observation = safeString(payload.observation || payload.notes || payload.comment, 1200);

  if (!safeVoterId) {
    return { ok: false, status: 400, message: "Identificador de eleitor ausente." };
  }

  if (!city || city === "não informado") {
    return { ok: false, status: 400, message: "Informe a cidade antes de votar." };
  }

  if (!office || !getElectionCandidate(office, safeCandidateId)) {
    return { ok: false, status: 400, message: "Cargo ou candidato inválido." };
  }

  const candidate = getElectionCandidate(office, safeCandidateId);
  const store = getElectionVoteStore();
  const currentWeekKey = getCurrentWeekBucketKey();
  store.votes[safeOfficeId] = store.votes[safeOfficeId] || {};
  store.voters[safeVoterId] = store.voters[safeVoterId] || {};
  store.records = Array.isArray(store.records) ? store.records : [];

  const currentVoteEntry = normalizeElectionVoterOfficeEntry(store.voters[safeVoterId][safeOfficeId]);
  if (currentVoteEntry.candidateId && currentVoteEntry.weekKey === currentWeekKey) {
    const snapshot = getElectionPublicSnapshot(safeVoterId);
    return {
      ok: false,
      alreadyVoted: true,
      status: 409,
      message: "Este dispositivo já votou neste cargo.",
      ...snapshot
    };
  }

  const deviceAlreadyVoted = store.records.some(
    (item) =>
      safeString(item.officeId || "", 120) === safeOfficeId &&
      recordMatchesWeeklyDevice(item, currentWeekKey, currentFingerprints)
  );

  if (deviceAlreadyVoted) {
    const snapshot = getElectionPublicSnapshot(safeVoterId);
    return {
      ok: false,
      status: 409,
      message: "Este dispositivo já votou neste cargo.",
      ...snapshot
    };
  }

  store.votes[safeOfficeId][safeCandidateId] =
    Number(store.votes[safeOfficeId][safeCandidateId] || 0) + 1;
  store.voters[safeVoterId][safeOfficeId] = {
    candidateId: safeCandidateId,
    weekKey: currentWeekKey,
    at: new Date().toISOString()
  };
  const opinion = analyzeElectionObservation(observation);

  store.records.push({
    id: createRecordId("elv"),
    officeId: safeOfficeId,
    office: office.label || safeOfficeId,
    candidateId: safeCandidateId,
    candidateName: candidate?.name || safeCandidateId,
    candidateParty: candidate?.party || "",
    city,
    voterName,
    voterParty,
    observation,
    sentiment: opinion.label,
    sentimentScore: opinion.score,
    reelectionSignal: opinion.reelectionLabel,
    pagePath: tracking.pagePath,
    referrerHost: tracking.referrerHost,
    country: tracking.country,
    ip: tracking.ip,
    browser: tracking.browser,
    deviceType: tracking.deviceType,
    googleEmail: safeGoogleEmail,
    googleSub: safeGoogleSub,
    visitorId: tracking.visitorId || tracking.cookieVisitorId,
    sessionId: tracking.sessionId || tracking.cookieSessionId,
    weekKey: currentWeekKey,
    at: new Date().toISOString()
  });
  writeElectionVoteStore(store);
  const snapshot = getElectionPublicSnapshot(safeVoterId);

  return {
    ok: true,
    alreadyVoted: false,
    status: 200,
    message: "Obrigado por votar. Acompanhe semanalmente para ver as parciais.",
    ...snapshot,
    updatedAt: snapshot.updatedAt || new Date().toISOString()
  };
}

function getNews(limit = 30) {
  const runtime = readJson(path.join(DATA_DIR, "runtime-news.json"), []);
  const archive = readJson(path.join(DATA_DIR, "news-archive.json"), []);
  const staticNews = getStaticNewsItems();
  const items = []
    .concat(Array.isArray(runtime) ? runtime : runtime.items || [])
    .concat(Array.isArray(archive) ? archive : archive.items || [])
    .concat(staticNews)
    .map(normalizeNewsItem);

  const map = new Map();
  items.forEach((item) => {
    const key = item.id || item.url || item.title;
    if (!map.has(key)) map.set(key, item);
  });

  return Array.from(map.values())
    .sort((a, b) => {
      const focus = getEditorialFocusScore(b) - getEditorialFocusScore(a);
      if (focus !== 0) return focus;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    })
    .slice(0, limit);
}

function getBusinesses(cityFilter) {
  const list = readJson(path.join(DATA_DIR, "businesses-cruzeiro.json"), []);
  const items = Array.isArray(list) ? list : [];
  if (!cityFilter) return items;
  return items.filter((item) =>
    String(item.city || "").toLowerCase().includes(String(cityFilter).toLowerCase())
  );
}

function parseBasicAuth(req) {
  const header = String(req?.headers?.authorization || "");
  const match = header.match(/^Basic\s+(.+)$/i);
  if (!match) return null;

  try {
    const decoded = Buffer.from(match[1], "base64").toString("utf-8");
    const divider = decoded.indexOf(":");
    if (divider < 0) return null;
    return {
      user: decoded.slice(0, divider),
      password: decoded.slice(divider + 1)
    };
  } catch (_error) {
    return null;
  }
}

function requireAdmin(req) {
  const tokenFromHeader = req.headers["x-admin-token"];
  const tokenFromQuery = new URL(req.url, `http://${req.headers.host}`).searchParams.get("token");
  const basic = parseBasicAuth(req);
  const hasValidBasic =
    basic?.user === SUPER_ADMIN_USER && basic?.password === SUPER_ADMIN_PASSWORD;
  const hasValidToken =
    Boolean(ADMIN_TOKEN) && (tokenFromHeader === ADMIN_TOKEN || tokenFromQuery === ADMIN_TOKEN);

  return hasValidBasic || hasValidToken;
}

const SPRITE_IMAGE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp", ".svg"]);
const SPRITE_SCAN_ROOTS = [
  {
    key: "sprite-vault",
    label: "Sprite Vault - candidatos",
    dir: path.join(ROOT_DIR, "sprite-vault"),
    publicBase: "/sprite-vault"
  }
];
const SPRITE_CONTEXT_FILES = [
  "index.html",
  "pubpaid.html",
  "palavras-da-rosa.html",
  "games.html",
  "infantil.html",
  "estudantes.html",
  "escritorio.html",
  "escritorio-nerd.html",
  "escritorio-ninjas.html",
  "escritorio-arte.html",
  "sprites-check-change.html",
  "pubpaid.js",
  "escritorio.js",
  "escritorio-arte-config.js"
];
const SPRITE_ACTION_ORDER = [
  "idle",
  "front",
  "walk",
  "run",
  "jump",
  "climb",
  "duck",
  "hit",
  "attack",
  "roll",
  "spin",
  "fall"
];

function getAuthValue(req, body = {}, keys = ["password", "token"]) {
  const requestUrl = new URL(req.url, `http://${req.headers.host}`);
  const headers = [
    req.headers["x-sprite-password"],
    req.headers["x-full-admin-password"],
    req.headers["x-admin-password"],
    req.headers["x-admin-token"]
  ];
  const candidates = [];

  keys.forEach((key) => {
    candidates.push(body?.[key]);
    candidates.push(requestUrl.searchParams.get(key));
  });
  headers.forEach((value) => candidates.push(value));

  return cleanShortText(candidates.find((value) => String(value || "").trim()) || "", 160);
}

function hasFullAdminPassword(value) {
  const token = cleanShortText(value, 160);
  return Boolean(token) && (
    token === FULL_ADMIN_PASSWORD ||
    token === SUPER_ADMIN_PASSWORD ||
    token.toLowerCase() === SUPER_ADMIN_PASSWORD.toLowerCase() ||
    token.toLowerCase() === FULL_ADMIN_PASSWORD.toLowerCase()
  );
}

function requireSpriteCheckAccess(req, body = {}) {
  const authValue = getAuthValue(req, body);
  return authValue === SPRITE_CHECK_PASSWORD || hasFullAdminPassword(authValue) || requireAdmin(req);
}

function requireFullAdminOrderAccess(req, body = {}) {
  const authValue = getAuthValue(req, body);
  return hasFullAdminPassword(authValue) || requireAdmin(req);
}

function toPublicAssetUrl(rootConfig, absoluteFilePath) {
  const relativePath = path.relative(rootConfig.dir, absoluteFilePath).split(path.sep).map(encodeURIComponent).join("/");
  return `${rootConfig.publicBase}/${relativePath}`;
}

function categorizeSpriteAsset(relativePath) {
  const value = normalizeText(relativePath);
  if (/(character|characters|personagem|avatar|agent|ninja|dealer|garcom|waiter|hero|npc|player|enemy|enemies|monster|boss|body|head|skin)/i.test(value)) {
    return "personagens";
  }
  if (
    /(background|cenario|scene|floor|tile|tileset|wall|room|office|interior|exterior|map|terrain)/i.test(value) ||
    /(^|[\/_\-\s])(bar|pub)([\/_\-\s]|$)/i.test(value)
  ) {
    return "cenarios";
  }
  if (/(item|items|prop|props|cup|dice|table|chair|coin|card|glass|bottle|jukebox|roulette|pool|ball|furniture)/i.test(value)) {
    return "itens";
  }
  if (/(hud|ui|button|icon|logo|badge|marker|pointer|menu|panel|frame)/i.test(value)) {
    return "interface";
  }
  if (/(fx|effect|spark|light|beam|shadow|glow|particles|smoke|fire)/i.test(value)) {
    return "efeitos";
  }
  return "outros";
}

function inferSpriteAction(fileBase) {
  const value = normalizeText(fileBase);
  return SPRITE_ACTION_ORDER.find((action) => value.includes(action)) || "";
}

function getFrameOrderToken(fileBase) {
  const match = String(fileBase || "").match(/(?:[_-])(?:frame)?([a-z]|\d{1,3})$/i);
  if (!match) return 0;
  const token = match[1].toLowerCase();
  if (/^\d+$/.test(token)) return Number(token);
  return token.charCodeAt(0) - 96;
}

function buildAnimationGroupInfo(relativePath, category) {
  const directory = path.posix.dirname(relativePath);
  const fileBase = path.basename(relativePath, path.extname(relativePath));
  const normalizedBase = normalizeText(fileBase).replace(/\s+/g, "_");
  const action = inferSpriteAction(fileBase);
  let groupBase = normalizedBase.replace(/(?:[_-])(?:frame)?([a-z]|\d{1,3})$/i, "");

  if (category === "personagens") {
    const characterMatch = normalizedBase.match(/^(character|player|hero|npc|agent|dealer|garcom|waiter)[_-]([a-z0-9]+)(?:[_-].*)?$/i);
    if (characterMatch) {
      groupBase = `${characterMatch[1]}_${characterMatch[2]}`;
    }
  }

  if (category === "efeitos" || /(roll|spin|spark|smoke|fire|explosion|effect|fx)/i.test(normalizedBase)) {
    groupBase = groupBase.replace(/(?:[_-])(?:frame)?([a-z]|\d{1,3})$/i, "");
  }

  return {
    groupKey: `${directory}/${groupBase}`,
    action,
    frameOrder: getFrameOrderToken(fileBase)
  };
}

function inferSpriteContexts(relativePath, category) {
  const value = normalizeText(relativePath);
  const contexts = [];
  const add = (label) => {
    if (!contexts.includes(label)) contexts.push(label);
  };

  if (
    /(^|[\/_\-\s])(pub|bar|casino|roulette|roleta|cup|copo|dice|dado|card|poker|blackjack|pool|sinuca|jukebox|glass|bottle|drink|table|chair|dealer|waiter|garcom)([\/_\-\s]|$)/i.test(value)
  ) {
    add("PubPaid");
  }
  if (/(office|escritorio|agent|ninja|avatar|desk|room|worker|terminal)/i.test(value)) {
    add("Escritorios");
  }
  if (/(game|platform|character|tile|tileset|map|controller|hud|ui)/i.test(value) || ["personagens", "cenarios", "interface"].includes(category)) {
    add("Games");
  }
  if (/(kid|child|infantil|toy|school|student|book)/i.test(value)) {
    add("Infantil/Estudantes");
  }
  if (!contexts.length) add("Cofre Ninja");
  return contexts;
}

function buildConstructionPlan(item) {
  if (item.category === "cenarios") {
    return {
      mode: "modo construcao",
      usage: "Dividir em base visual, camada de colisao, decoracao e hotspots antes de virar mapa jogavel.",
      observation:
        "A equipe de Arte deve separar chao, parede, bloqueios e objetos. A equipe Nerd valida fluxo, camera e colisao.",
      collision: "Mapear paredes, mesas, balcões e limites como retangulos simples antes de detalhar.",
      layers: ["base", "colisao", "decoracao", "hotspots"]
    };
  }
  if (item.category === "personagens") {
    return {
      mode: "sprite animado",
      usage: "Avaliar o ciclo inteiro em movimento, nao frame solto. Depois mapear idle, walk, hit, jump e acoes.",
      observation:
        "So entra no jogo se tiver leitura parado e em movimento; itens equipaveis precisam encaixar no corpo.",
      collision: "Usar hitbox menor que a arte para nao prender em mesas e portas.",
      layers: ["corpo", "animacoes", "hitbox", "itens"]
    };
  }
  if (item.category === "itens") {
    return {
      mode: "prop jogavel",
      usage: "Definir se e decoracao, item clicavel, item equipavel ou feedback de rodada.",
      observation: "Copos, dados, cartas e fichas precisam ter som/queda/estado quando forem jogo.",
      collision: "Itens de mesa normalmente nao bloqueiam; moveis grandes bloqueiam passagem.",
      layers: ["visual", "estado", "som", "interacao"]
    };
  }
  return {
    mode: "asset de apoio",
    usage: "Validar se atende um contexto real do site antes de entrar em producao.",
    observation: "Prioridade para PubPaid, jogos, escritorios e subsites ja existentes.",
    collision: "Sem colisao ate virar mapa, item ou personagem.",
    layers: ["triagem", "contexto", "uso"]
  };
}

function buildSiteSpriteReferenceSet() {
  const references = new Set();
  SPRITE_CONTEXT_FILES.forEach((fileName) => {
    const filePath = path.join(ROOT_DIR, fileName);
    if (!fs.existsSync(filePath)) return;
    let content = "";
    try {
      content = fs.readFileSync(filePath, "utf-8");
    } catch (_error) {
      return;
    }
    const regex = /(?:\.\/)?(sprite-vault\/[^"'\s)]+)/gi;
    let match = regex.exec(content);
    while (match) {
      references.add(`/${match[1].replace(/\\/g, "/")}`);
      match = regex.exec(content);
    }
  });
  return references;
}

function collectSpriteFiles(rootConfig, currentDir = rootConfig.dir, output = []) {
  if (!fs.existsSync(currentDir)) return output;

  let entries = [];
  try {
    entries = fs.readdirSync(currentDir, { withFileTypes: true });
  } catch (_error) {
    return output;
  }

  entries.forEach((entry) => {
    const absolutePath = path.join(currentDir, entry.name);
    if (entry.isDirectory()) {
      collectSpriteFiles(rootConfig, absolutePath, output);
      return;
    }

    if (!entry.isFile() || !SPRITE_IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
      return;
    }

    if (/^(preview|sample)\b/i.test(entry.name)) {
      return;
    }

    const relativePath = path.relative(rootConfig.dir, absolutePath).split(path.sep).join("/");
    const category = categorizeSpriteAsset(relativePath);
    const groupInfo = buildAnimationGroupInfo(relativePath, category);
    let stat = null;
    try {
      stat = fs.statSync(absolutePath);
    } catch (_error) {
      stat = null;
    }

    output.push({
      id: `${rootConfig.key}:${relativePath}`,
      name: path.basename(entry.name, path.extname(entry.name)).replace(/[-_]+/g, " "),
      fileName: entry.name,
      extension: path.extname(entry.name).replace(".", "").toLowerCase(),
      category,
      sourceRoot: rootConfig.label,
      path: relativePath,
      publicUrl: toPublicAssetUrl(rootConfig, absolutePath),
      groupKey: groupInfo.groupKey,
      action: groupInfo.action,
      frameOrder: groupInfo.frameOrder,
      sizeBytes: stat?.size || 0,
      updatedAt: stat?.mtime ? stat.mtime.toISOString() : ""
    });
  });

  return output;
}

function groupSpriteFiles(files, siteReferences) {
  const groups = new Map();
  files.forEach((file) => {
    const key = `${file.sourceRoot}:${file.groupKey}`;
    const existing = groups.get(key) || {
      id: `sprite-group:${key}`,
      name: path.basename(file.groupKey).replace(/[-_]+/g, " "),
      category: file.category,
      sourceRoot: file.sourceRoot,
      path: file.groupKey.replace(/^\.\//, ""),
      extension: file.extension,
      sizeBytes: 0,
      updatedAt: file.updatedAt,
      actions: [],
      frames: [],
      contexts: inferSpriteContexts(file.path, file.category)
    };

    existing.frames.push({
      name: file.name,
      fileName: file.fileName,
      path: file.path,
      publicUrl: file.publicUrl,
      action: file.action,
      frameOrder: file.frameOrder,
      sizeBytes: file.sizeBytes
    });
    existing.sizeBytes += Number(file.sizeBytes || 0);
    if (file.action && !existing.actions.includes(file.action)) existing.actions.push(file.action);
    if (file.updatedAt > existing.updatedAt) existing.updatedAt = file.updatedAt;
    if (siteReferences.has(file.publicUrl)) existing.alreadyInSite = true;
    groups.set(key, existing);
  });

  return Array.from(groups.values()).map((group) => {
    const actionOrder = new Map(SPRITE_ACTION_ORDER.map((action, index) => [action, index]));
    group.frames.sort((a, b) => {
      const actionDiff = (actionOrder.get(a.action) ?? 99) - (actionOrder.get(b.action) ?? 99);
      if (actionDiff) return actionDiff;
      return (a.frameOrder || 0) - (b.frameOrder || 0) || a.path.localeCompare(b.path);
    });
    group.actions.sort((a, b) => (actionOrder.get(a) ?? 99) - (actionOrder.get(b) ?? 99));
    group.frameCount = group.frames.length;
    group.previewUrl = group.frames[0]?.publicUrl || "";
    group.publicUrl = group.previewUrl;
    group.reviewMode =
      group.category === "cenarios"
        ? "construction"
        : group.frameCount > 1
          ? "animation"
          : "static";
    group.priority =
      (group.contexts.includes("PubPaid") ? 100 : 0) +
      (group.contexts.includes("Escritorios") ? 70 : 0) +
      (group.contexts.includes("Games") ? 45 : 0) +
      (group.frameCount > 1 ? 20 : 0);
    group.construction = buildConstructionPlan(group);
    return group;
  });
}

function buildSpriteCheckPayload() {
  const reviews = readJson(SPRITE_CHECK_REVIEWS_FILE, {});
  const reviewMap = reviews && typeof reviews === "object" && !Array.isArray(reviews) ? reviews : {};
  const siteReferences = buildSiteSpriteReferenceSet();
  const rawFiles = SPRITE_SCAN_ROOTS.flatMap((rootConfig) => collectSpriteFiles(rootConfig));
  const items = groupSpriteFiles(rawFiles, siteReferences)
    .sort((a, b) => b.priority - a.priority || a.category.localeCompare(b.category) || a.path.localeCompare(b.path))
    .map((item) => {
      const review = reviewMap[item.id] && typeof reviewMap[item.id] === "object" ? reviewMap[item.id] : {};
      const locked = Boolean(item.alreadyInSite);
      return {
        ...item,
        locked,
        status: cleanShortText(locked ? "accepted" : review.status || "pending", 40),
        statusReason: locked ? "Ja esta em uso no site/subsite, entao entra como aceito e nao volta para aprovacao." : "",
        note: cleanShortText(review.note || "", 500),
        reviewedAt: cleanShortText(review.reviewedAt || "", 60),
        reviewedBy: cleanShortText(review.reviewedBy || "", 80)
      };
    });
  const summary = items.reduce(
    (acc, item) => {
      acc.total += 1;
      acc.byCategory[item.category] = (acc.byCategory[item.category] || 0) + 1;
      acc.byStatus[item.status] = (acc.byStatus[item.status] || 0) + 1;
      if (item.frameCount > 1) acc.animated += 1;
      if (item.reviewMode === "construction") acc.construction += 1;
      if (item.locked) acc.alreadyAccepted += 1;
      return acc;
    },
    { total: 0, animated: 0, construction: 0, alreadyAccepted: 0, byCategory: {}, byStatus: {} }
  );

  return {
    ok: true,
    updatedAt: new Date().toISOString(),
    menuFirst: "CHECKPUBPAID",
    hierarchy: {
      fullAdmin: "Junior",
      ceo: "Codex CEO",
      flow: "Full Admin -> Codex CEO -> equipes",
      teams: ["Ninjas", "Arte/Game Design", "Nerd", "Editorial", "PubPaid"]
    },
    summary,
    rawFiles: rawFiles.length,
    rules: {
      siteAssets: "Assets ja publicados nao entram na fila de aprovacao.",
      movement: "Personagens chegam agrupados como sprite animado, nao como frame solto.",
      canvas: "Sem canvas para ilustracao de personagens ou conteudo do site; usar arquivos reais em assets/sprite-vault.",
      context: "Prioridade para PubPaid, jogos, escritorios e subsites existentes."
    },
    reviews: reviewMap,
    items
  };
}

function normalizeSpriteReviewStatus(value) {
  const status = cleanShortText(value || "pending", 40).toLowerCase();
  if (["accepted", "rejected", "pending", "needs-change"].includes(status)) return status;
  if (status === "aceito" || status === "aprovado") return "accepted";
  if (status === "reprovado" || status === "recusado") return "rejected";
  if (status === "ajuste" || status === "needs change") return "needs-change";
  return "pending";
}

function buildOfficeOrderPayload() {
  const orders = readJson(OFFICE_ORDERS_FILE, []);
  const safeOrders = Array.isArray(orders) ? orders : [];
  return {
    ok: true,
    hierarchy: {
      fullAdmin: "Junior",
      ceo: "Codex CEO",
      rule: "O Full Admin ordena, o CEO responde, e as equipes recebem tarefas pelo CEO.",
      teams: ["Ninjas", "Arte/Game Design", "Nerd", "Editorial", "PubPaid", "Design", "Revisao"]
    },
    orders: safeOrders.slice(-80).reverse()
  };
}

function appendOfficeOrder(order) {
  const orders = readJson(OFFICE_ORDERS_FILE, []);
  const nextOrders = Array.isArray(orders) ? orders.concat(order).slice(-250) : [order];
  writeJson(OFFICE_ORDERS_FILE, nextOrders);
  return nextOrders;
}

function reviewOfficeOrder(body = {}) {
  const orderId = cleanShortText(body.orderId || body.id, 120);
  const status = cleanShortText(body.status || body.reviewStatus, 40).toLowerCase();
  const note = cleanShortText(body.note || body.message || "", 800);
  const allowed = {
    approved: "aprovado",
    approve: "aprovado",
    aprovado: "aprovado",
    rejected: "reprovado",
    reject: "reprovado",
    reprovado: "reprovado",
    reopened: "reaberto",
    reopen: "reaberto",
    reaberto: "reaberto"
  };
  const nextStatus = allowed[status];
  if (!orderId || !nextStatus) {
    return { ok: false, status: 400, error: "Informe orderId e status aprovado/reprovado/reaberto." };
  }

  const orders = readJson(OFFICE_ORDERS_FILE, []);
  const safeOrders = Array.isArray(orders) ? orders : [];
  let found = null;
  const nextOrders = safeOrders.map((order) => {
    if (order.id !== orderId) return order;
    found = {
      ...order,
      status: nextStatus,
      review: {
        status: nextStatus,
        note,
        reviewedBy: "Full Admin",
        reviewedAt: new Date().toISOString()
      },
      reviewHistory: [
        {
          status: nextStatus,
          note,
          reviewedBy: "Full Admin",
          reviewedAt: new Date().toISOString()
        },
        ...(Array.isArray(order.reviewHistory) ? order.reviewHistory : [])
      ].slice(0, 20)
    };
    return found;
  });

  if (!found) return { ok: false, status: 404, error: "Ordem nao encontrada." };
  writeJson(OFFICE_ORDERS_FILE, nextOrders);
  return { ok: true, order: found };
}

function reviewRealAgentAction(body = {}) {
  const actionId = cleanShortText(body.actionId || body.id, 160);
  const status = cleanShortText(body.status || "", 40).toLowerCase();
  const note = cleanShortText(body.note || "", 800);
  const allowed = {
    aprovado: "aprovado",
    approve: "aprovado",
    approved: "aprovado",
    reprovado: "reprovado",
    reject: "reprovado",
    rejected: "reprovado",
    aplicar: "aprovado-para-aplicar"
  };
  const nextStatus = allowed[status];
  if (!actionId || !nextStatus) {
    return { ok: false, status: 400, error: "Informe actionId e status aprovado/reprovado." };
  }
  const store = readJson(REAL_AGENTS_ACTIONS_FILE, { version: 1, actions: [] });
  const actions = Array.isArray(store.actions) ? store.actions : [];
  let found = null;
  const nextActions = actions.map((action) => {
    if (action.id !== actionId) return action;
    found = {
      ...action,
      status: nextStatus,
      review: {
        status: nextStatus,
        note,
        reviewedBy: "Full Admin",
        reviewedAt: new Date().toISOString()
      }
    };
    return found;
  });
  if (!found) return { ok: false, status: 404, error: "Acao nao encontrada." };
  writeJson(REAL_AGENTS_ACTIONS_FILE, {
    version: 1,
    updatedAt: new Date().toISOString(),
    actions: nextActions
  });
  return { ok: true, action: found };
}

function normalizeCommunityReport(item = {}) {
  return {
    id: cleanShortText(item.id, 80),
    name: cleanShortText(item.name || "Morador local", 80),
    neighborhood: cleanShortText(item.neighborhood || item.bairro || "Bairro nao informado", 90),
    city: cleanShortText(item.city || "Cruzeiro do Sul - AC", 90),
    topic: cleanShortText(item.topic || "Relato comunitario", 100),
    message: cleanShortText(item.message || item.details || item.text, 900),
    contact: cleanShortText(item.contact || item.phone || item.whatsapp || "", 100),
    status: cleanShortText(item.status || "nao-checado", 40),
    verificationStatus: cleanShortText(item.verificationStatus || "nao-checado", 40),
    publicNote:
      "Participacao comunitaria voluntaria. Informacao recebida da populacao, ainda nao checada pela equipe.",
    createdAt: cleanShortText(item.createdAt || new Date().toISOString(), 60)
  };
}

function getCommunityReportsPayload(limit = 8) {
  const reports = readJson(COMMUNITY_REPORTS_FILE, []);
  const safeReports = Array.isArray(reports) ? reports : [];
  const publicItems = safeReports
    .map(normalizeCommunityReport)
    .filter((item) => item.message && item.verificationStatus !== "checado")
    .slice()
    .reverse()
    .slice(0, Math.max(1, Math.min(40, limit)));

  return {
    ok: true,
    updatedAt: new Date().toISOString(),
    label: "Participacao comunitaria voluntaria",
    verificationRule:
      "Este bloco mostra apenas relatos ainda nao checados. Informacoes verificadas devem sair daqui e virar checagem, servico ou noticia em area propria.",
    total: publicItems.length,
    items: publicItems
  };
}

function recordCommunityReport(body = {}, req = null) {
  const tracking = req ? buildTrackingMeta(req, body) : {};
  const message = cleanShortText(body.message || body.details || body.text, 900);
  const neighborhood = cleanShortText(body.neighborhood || body.bairro, 90);
  const topic = cleanShortText(body.topic || body.subject || "Relato comunitario", 100);

  if (!message || message.length < 12) {
    return {
      ok: false,
      status: 400,
      error: "Escreva um relato com um pouco mais de contexto para a equipe avaliar."
    };
  }

  const report = normalizeCommunityReport({
    id: createRecordId("com"),
    name: cleanShortText(body.name || body.author || "Morador local", 80),
    neighborhood: neighborhood || "Bairro nao informado",
    city: cleanShortText(body.city || "Cruzeiro do Sul - AC", 90),
    topic,
    message,
    contact: cleanShortText(body.contact || body.phone || body.whatsapp || "", 100),
    status: "recebido-nao-checado",
    verificationStatus: "nao-checado",
    sourcePage: cleanShortText(body.sourcePage || tracking.pagePath || "/", 260),
    visitorId: tracking.visitorId || tracking.cookieVisitorId,
    sessionId: tracking.sessionId || tracking.cookieSessionId,
    ip: tracking.ip,
    createdAt: new Date().toISOString()
  });

  const reports = readJson(COMMUNITY_REPORTS_FILE, []);
  const nextReports = Array.isArray(reports) ? reports.concat(report).slice(-300) : [report];
  writeJson(COMMUNITY_REPORTS_FILE, nextReports);

  appendOfficeOrder({
    id: createRecordId("ord"),
    from: "Comunidade",
    to: "Codex CEO + Revisor Bento + Sofia Fontes",
    priority: "normal",
    message: `Relato comunitario nao checado recebido: ${report.topic} em ${report.neighborhood}. ${report.message}`,
    ceoReply:
      "Recebido. O relato fica publico como nao checado e entra na fila para verificacao antes de virar noticia.",
    status: "relato-comunitario-nao-checado",
    hierarchy: "Comunidade -> Avatar comunitario -> Codex CEO -> agentes de verificacao",
    createdAt: report.createdAt
  });

  return {
    ok: true,
    status: 201,
    item: report,
    message:
      "Relato recebido. Ele fica marcado como nao checado e pode aparecer na area de participacao comunitaria voluntaria."
  };
}

function buildRealAgentsPayload() {
  const registry = readJson(REAL_AGENTS_REGISTRY_FILE, null);
  const latestRun = readJson(REAL_AGENTS_RUN_FILE, null);
  const latestRunMd = fs.existsSync(REAL_AGENTS_RUN_MD_FILE)
    ? fs.readFileSync(REAL_AGENTS_RUN_MD_FILE, "utf-8")
    : "";
  const history = readRealAgentsRunHistory();
  const agents = Array.isArray(registry?.agents) ? registry.agents : [];
  const queue = Array.isArray(latestRun?.queue) ? latestRun.queue : [];

  return {
    ok: Boolean(registry && latestRun),
    updatedAt: new Date().toISOString(),
    registryGeneratedAt: registry?.generatedAt || "",
    runGeneratedAt: latestRun?.generatedAt || "",
    summary: {
      totalAgents: Number(registry?.totalAgents || agents.length || 0),
      totalOffices: Array.isArray(registry?.offices) ? registry.offices.length : 0,
      totalRoles: Array.isArray(registry?.roles) ? registry.roles.length : 0,
      newsItems: Number(latestRun?.summary?.newsItems || 0),
      reviewIssues: Number(latestRun?.summary?.reviewIssues || 0),
      activeQueue: queue.length,
      autonomousAgents: Number(latestRun?.summary?.autonomousAgents || 0),
      highAutonomyAgents: Number(latestRun?.summary?.highAutonomyAgents || 0),
      averageAutonomy: Number(latestRun?.summary?.averageAutonomy || 0),
      aliveAgents: Number(latestRun?.summary?.aliveAgents || 0),
      deliveredAgents: Number(latestRun?.summary?.deliveredAgents || 0),
      failedAgents: Number(latestRun?.summary?.failedAgents || 0),
      exhaustedAgents: Number(latestRun?.summary?.exhaustedAgents || 0),
      averageEnergy: Number(latestRun?.summary?.averageEnergy || 0),
      averageMorale: Number(latestRun?.summary?.averageMorale || 0)
    },
    autonomy: latestRun?.autonomy || null,
    life: latestRun?.life || null,
    autoRun: {
      enabled: !REAL_AGENTS_AUTO_RUN_DISABLED,
      pausedByCheffeCall: readCheffeCallState().active,
      intervalMs: REAL_AGENTS_AUTO_RUN_INTERVAL_MS,
      running: realAgentsAutoRunState.running,
      startedAt: realAgentsAutoRunState.startedAt,
      lastRunAt: realAgentsAutoRunState.lastRunAt,
      lastError: realAgentsAutoRunState.lastError,
      cycles: realAgentsAutoRunState.cycles,
      history
    },
    offices: Array.isArray(registry?.offices) ? registry.offices : [],
    roles: Array.isArray(registry?.roles) ? registry.roles : [],
    agents: agents.map((agent) => ({
      id: agent.id,
      slug: agent.slug,
      name: agent.name,
      officeKey: agent.officeKey,
      officeLabel: agent.officeLabel,
      role: agent.role,
      title: agent.title,
      specialty: agent.specialty,
      capabilities: Array.isArray(agent.capabilities) ? agent.capabilities.slice(0, 12) : [],
      monitoringFocus: Array.isArray(agent.monitoringFocus) ? agent.monitoringFocus.slice(0, 10) : [],
      deliverables: Array.isArray(agent.deliverables) ? agent.deliverables : [],
      newsroomBridge: agent.newsroomBridge || "",
      spriteProfile: agent.spriteProfile || null
    })),
    news: latestRun?.news || null,
    dailyContext: latestRun?.dailyContext || null,
    liveEvents: Array.isArray(latestRun?.liveEvents) ? latestRun.liveEvents : [],
    officeLogs: Array.isArray(latestRun?.officeLogs) ? latestRun.officeLogs : [],
    agentTimelines: Array.isArray(latestRun?.agentTimelines) ? latestRun.agentTimelines : [],
    officeDashboard: Array.isArray(latestRun?.officeDashboard) ? latestRun.officeDashboard : [],
    executableActions: Array.isArray(latestRun?.executableActions)
      ? latestRun.executableActions
      : (Array.isArray(readJson(REAL_AGENTS_ACTIONS_FILE, {})?.actions) ? readJson(REAL_AGENTS_ACTIONS_FILE, {}).actions : []),
    orders: Array.isArray(latestRun?.orders) ? latestRun.orders : [],
    awards: latestRun?.awards || null,
    scoreboard: latestRun?.scoreboard || null,
    officeStatus: Array.isArray(latestRun?.offices) ? latestRun.offices : [],
    queue,
    reportMarkdown: latestRunMd
  };
}

function readRealAgentsRunHistory() {
  const history = readJson(REAL_AGENTS_RUN_HISTORY_FILE, []);
  return Array.isArray(history) ? history.slice(0, 24) : [];
}

function recordRealAgentsRunHistory(entry) {
  const history = readRealAgentsRunHistory();
  writeJson(REAL_AGENTS_RUN_HISTORY_FILE, [
    {
      at: entry.at || new Date().toISOString(),
      trigger: entry.trigger || "manual",
      ok: Boolean(entry.ok),
      totalAgents: Number(entry.totalAgents || 0),
      newsItems: Number(entry.newsItems || 0),
      reviewIssues: Number(entry.reviewIssues || 0),
      queueItems: Number(entry.queueItems || 0),
      error: cleanShortText(entry.error || "", 280)
    },
    ...history
  ].slice(0, 24));
}

function readCheffeCallState() {
  const payload = readJson(CHEFFE_CALL_STATE_FILE, {});
  const legacyInstruction = payload["last" + "Brief" + "ing"] || "";
  return {
    active: Boolean(payload.active),
    pausedAt: payload.pausedAt || "",
    releasedAt: payload.releasedAt || "",
    lastInstruction: payload.lastInstruction || legacyInstruction,
    lastSessionAt: payload.lastSessionAt || "",
    sessions: Array.isArray(payload.sessions) ? payload.sessions.slice(0, 12) : []
  };
}

function writeCheffeCallState(state) {
  writeJson(CHEFFE_CALL_STATE_FILE, {
    active: Boolean(state.active),
    pausedAt: state.pausedAt || "",
    releasedAt: state.releasedAt || "",
    lastInstruction: state.lastInstruction || "",
    lastSessionAt: state.lastSessionAt || "",
    sessions: Array.isArray(state.sessions) ? state.sessions.slice(0, 12) : []
  });
}

function normalizeCheffeCallLog(entry = {}) {
  const createdAt = cleanShortText(entry.createdAt || new Date().toISOString(), 60);
  return {
    id: cleanShortText(entry.id || createRecordId("cheflog"), 80),
    createdAt,
    time: cleanShortText(entry.time || createdAt.slice(11, 16), 12),
    kind: cleanShortText(entry.kind || "", 40),
    kindLabel: cleanShortText(entry.kindLabel || "fala", 80),
    agent: cleanShortText(entry.agent || "Cheffe Call", 120),
    office: cleanShortText(entry.office || "", 120),
    text: cleanShortText(entry.text || "", 2400)
  };
}

function normalizeCheffeCallDecision(entry = {}) {
  return {
    id: cleanShortText(entry.id || createRecordId("chefdec"), 80),
    createdAt: cleanShortText(entry.createdAt || new Date().toISOString(), 60),
    state: cleanShortText(entry.state || "queued", 40),
    kindLabel: cleanShortText(entry.kindLabel || "fila", 80),
    agent: cleanShortText(entry.agent || "Cheffe Call", 120),
    office: cleanShortText(entry.office || "", 120),
    title: cleanShortText(entry.title || "Ação da Cheffe Call", 220),
    text: cleanShortText(entry.text || "", 2400),
    howTo: cleanShortText(entry.howTo || "", 3200),
    prompt: cleanShortText(entry.prompt || "", 3200),
    command: cleanShortText(entry.command || "", 1600),
    action: cleanShortText(entry.action || "", 80),
    artifact: cleanShortText(entry.artifact || "", 400)
  };
}

function summarizeCheffeCallSession(session = {}) {
  const decisions = Array.isArray(session.decisions) ? session.decisions : [];
  const logs = Array.isArray(session.logs) ? session.logs : [];
  const approvals = Array.isArray(session.approvals) ? session.approvals : [];
  return {
    approvals: approvals.length,
    decisions: decisions.length,
    logs: logs.length,
    running: decisions.filter((item) => item.state === "running").length,
    queued: decisions.filter((item) => item.state === "queued" || item.state === "ready").length,
    terminal: decisions.filter((item) => item.state === "terminal" || item.state === "fallback").length
  };
}

function findCheffeExecutableActionMatch(body = {}) {
  const store = readJson(REAL_AGENTS_ACTIONS_FILE, { actions: [] });
  const actions = Array.isArray(store.actions) ? store.actions : [];
  const agentSlug = slugify(body.agent || "");
  const titleSlug = slugify(body.title || body.text || body.opinion || "");
  return (
    actions.find((item) => {
      if ((item.status || "") !== "aguardando-aprovacao") return false;
      const sameAgent = slugify(item.agent || "") === agentSlug;
      if (!sameAgent) return false;
      if (!titleSlug) return true;
      const itemTitle = slugify(item.title || "");
      return itemTitle.includes(titleSlug.slice(0, 42)) || titleSlug.includes(itemTitle.slice(0, 42));
    }) || null
  );
}

function applyCheffeCallAction(body = {}) {
  const action = cleanShortText(body.action || body.type, 40).toLowerCase();
  if (!action) {
    return { ok: false, status: 400, error: "Informe a ação que a Cheffe Call deve registrar." };
  }

  const state = readCheffeCallState();
  if (!state.sessions.length) {
    return { ok: false, status: 409, error: "Nenhuma sessao de Cheffe Call esta aberta para receber a ação." };
  }

  const now = new Date().toISOString();
  const sessionId = cleanShortText(body.sessionId, 80);
  const sessionIndex = state.sessions.findIndex((item, index) => (sessionId ? item.id === sessionId : index === 0));
  if (sessionIndex < 0) {
    return { ok: false, status: 404, error: "Sessao da Cheffe Call nao encontrada." };
  }

  const targetSession = state.sessions[sessionIndex] || {};
  const instruction = cleanShortText(body.instruction || targetSession.instruction || state.lastInstruction, 1600);
  const agent = cleanShortText(body.agent || "Cheffe Call", 120);
  const office = cleanShortText(body.office || "", 120);
  const role = cleanShortText(body.role || "", 80);
  const title = cleanShortText(body.title || body.assignment || body.text || body.opinion || `Acao de ${agent}`, 220);
  const opinion = cleanShortText(body.opinion || body.text || "", 2400);
  const command = cleanShortText(body.command || "", 1600);
  const howTo = cleanShortText(body.howTo || "", 3200);
  const prompt = cleanShortText(body.prompt || "", 3200);
  const approvals = Array.isArray(targetSession.approvals) ? targetSession.approvals.slice(0, 32) : [];
  const logs = Array.isArray(targetSession.logs) ? targetSession.logs.slice(0, 64) : [];
  const decisions = Array.isArray(targetSession.decisions) ? targetSession.decisions.slice(0, 32) : [];
  const executableMatch = findCheffeExecutableActionMatch({ agent, title, text: opinion });
  let reviewedAction = null;

  const pushLog = (entry) => {
    logs.unshift(normalizeCheffeCallLog({ ...entry, createdAt: now }));
  };
  const pushDecision = (entry) => {
    decisions.unshift(normalizeCheffeCallDecision({ ...entry, createdAt: now, action }));
  };
  const pushApproval = (entry) => {
    approvals.unshift({
      id: cleanShortText(entry.id || createRecordId("chefvote"), 80),
      createdAt: now,
      action,
      agent,
      office,
      role,
      note: cleanShortText(entry.note || "", 1200),
      executableActionId: cleanShortText(entry.executableActionId || "", 120)
    });
  };
  const appendActionOrder = (payload = {}) => {
    appendOfficeOrder({
      id: createRecordId("ord"),
      from: "Cheffe Call",
      to: cleanShortText(payload.to || `${agent}${office ? ` • ${office}` : ""}`, 120),
      priority: cleanShortText(payload.priority || "alta", 40),
      message: cleanShortText(payload.message || title, 1200),
      ceoReply: cleanShortText(
        payload.ceoReply || "Cheffe Call registrou a decisão e jogou a ação na fila operacional da equipe.",
        1200
      ),
      status: cleanShortText(payload.status || `cheffe-call-${action}`, 80),
      hierarchy: "Full Admin -> Cheffe Call -> agentes reais",
      createdAt: now,
      assignedAgents: 1,
      assignments: [
        {
          agent,
          office,
          role,
          title,
          action,
          command
        }
      ],
      executionSummary: {
        delivered: action === "approve" ? 1 : 0,
        failed: 0,
        running: action === "implement" ? 1 : 0
      }
    });
  };

  if (action === "refresh") {
    const runtimeResult = runRealAgentsRuntime({ trigger: "cheffe-call-refresh" });
    pushLog({
      kindLabel: runtimeResult.ok ? "runtime atualizada" : "falha de runtime",
      agent: "Cheffe Call",
      office: "Sistema",
      text: runtimeResult.ok
        ? "Os agentes reais rodaram novo ciclo manual a partir da sala."
        : runtimeResult.error || "Falha ao rodar os agentes reais."
    });
    if (!runtimeResult.ok) {
      return { ok: false, status: 500, error: runtimeResult.error || "Falha ao atualizar os agentes reais." };
    }
  } else if (action === "approve") {
    pushApproval({
      note: `Ideia aprovada na Cheffe Call: ${title}`,
      executableActionId: executableMatch?.id || ""
    });
    pushLog({
      kind: "good",
      kindLabel: "boa ideia",
      agent,
      office,
      text: opinion || title
    });
    pushDecision({
      state: "ready",
      kindLabel: "aceita",
      agent,
      office,
      title: `Plano aprovado para ${agent}`,
      text: title,
      howTo,
      prompt,
      command,
      artifact: executableMatch?.artifact || ""
    });
    appendActionOrder({
      message: `Aprovado na Cheffe Call: ${title}. Contexto: ${opinion || instruction}`,
      ceoReply: `${agent} recebeu aprovação formal da sala e pode seguir para execução orientada.`
    });
    if (executableMatch) {
      const review = reviewRealAgentAction({
        actionId: executableMatch.id,
        status: "aprovado",
        note: `Aprovado pela Cheffe Call em ${now}.`
      });
      if (review.ok) reviewedAction = review.action;
    }
  } else if (action === "implement") {
    pushApproval({
      note: `Execução autorizada na Cheffe Call: ${title}`,
      executableActionId: executableMatch?.id || ""
    });
    pushLog({
      kind: "good",
      kindLabel: "implementando",
      agent,
      office,
      text: opinion || title
    });
    pushDecision({
      state: "running",
      kindLabel: "implementando",
      agent,
      office,
      title: `Execução iniciada por ${agent}`,
      text: title,
      howTo,
      prompt,
      command,
      artifact: executableMatch?.artifact || ""
    });
    appendActionOrder({
      message: `Executar agora a partir da Cheffe Call: ${title}. Comando: ${command || "sem complemento de terminal"}`,
      ceoReply: `${agent} entrou em execução acompanhada a partir da sala.`,
      status: "cheffe-call-em-execucao"
    });
    if (executableMatch) {
      const review = reviewRealAgentAction({
        actionId: executableMatch.id,
        status: "aprovado",
        note: `Execução liberada pela Cheffe Call em ${now}.`
      });
      if (review.ok) reviewedAction = review.action;
    }
  } else if (action === "task") {
    pushLog({
      kindLabel: "tarefa criada",
      agent,
      office,
      text: title
    });
    pushDecision({
      state: "queued",
      kindLabel: "tarefa",
      agent,
      office,
      title: `Fila de tarefa para ${agent}`,
      text: title,
      howTo,
      prompt,
      command,
      artifact: executableMatch?.artifact || ""
    });
    appendActionOrder({
      message: `Nova tarefa vinda da Cheffe Call para ${agent}: ${title}. Critério: transformar em entrega revisável com validação.`,
      ceoReply: `${agent} recebeu uma tarefa formal da sala e entra na fila operacional.`,
      status: "cheffe-call-tarefa"
    });
  } else if (action === "terminal") {
    pushLog({
      kindLabel: "enviado ao terminal",
      agent,
      office,
      text: command || title
    });
    pushDecision({
      state: "terminal",
      kindLabel: "terminal",
      agent,
      office,
      title: `Prompt enviado ao terminal por ${agent}`,
      text: title,
      command,
      prompt,
      artifact: executableMatch?.artifact || ""
    });
    appendActionOrder({
      to: `Terminal + ${agent}`,
      message: `Terminal acionado pela Cheffe Call para ${agent}: ${command || title}`,
      ceoReply: "O pedido foi jogado no trilho de terminal e fica rastreado na reunião.",
      status: "cheffe-call-terminal"
    });
  } else if (action === "variation") {
    pushLog({
      kindLabel: "variação pedida",
      agent,
      office,
      text: title
    });
    pushDecision({
      state: "queued",
      kindLabel: "variação",
      agent,
      office,
      title: `Alternativa pedida para ${agent}`,
      text: title,
      howTo,
      prompt,
      command
    });
  } else {
    return { ok: false, status: 400, error: "Ação da Cheffe Call ainda nao suportada." };
  }

  const nextSession = {
    ...targetSession,
    instruction,
    updatedAt: now,
    status:
      action === "implement"
        ? "em-execucao"
        : action === "approve"
          ? "aprovado"
          : action === "refresh"
            ? "sincronizado"
            : "aguardando-aprovacao",
    approvals: approvals.slice(0, 32),
    logs: logs.slice(0, 64),
    decisions: decisions.slice(0, 32),
    reviewedActionId: reviewedAction?.id || targetSession.reviewedActionId || ""
  };

  const nextSessions = state.sessions.slice();
  nextSessions[sessionIndex] = nextSession;
  writeCheffeCallState({
    ...state,
    active: true,
    pausedAt: state.pausedAt || now,
    releasedAt: "",
    lastInstruction: instruction,
    lastSessionAt: now,
    sessions: nextSessions
  });

  const payload = buildCheffeCallPayload();
  return {
    ok: true,
    action,
    reviewedAction,
    session: payload.meeting.currentSession || null,
    payload
  };
}

function getCheffeCallOpinions(payload, instruction) {
  const daily = payload.dailyContext || {};
  const topAgents = Array.isArray(daily.topAgents) ? daily.topAgents.slice(0, 8) : [];
  const fallbackQueue = Array.isArray(payload.queue) ? payload.queue.slice(0, 8) : [];
  const sourceBase = topAgents.length
    ? topAgents.map((item) => ({
        name: item.name,
        office: item.office,
        role: item.role,
        intent: item.intent,
        autonomy: item.autonomy,
        urgency: item.urgency
      }))
    : fallbackQueue.map((item) => ({
        name: item.name,
        office: item.officeLabel,
        role: item.role,
        intent: item.autonomy?.intent || item.assignment?.idea || "",
        autonomy: item.autonomy?.autonomy || 0,
        urgency: item.autonomy?.urgency || 0
      }));
  const source = sourceBase.length
    ? sourceBase
    : [
        {
          name: "Codex CEO",
          office: "Escritorio Principal",
          role: "ceo",
          intent: "organizar a reuniao e transformar fala em decisao rastreavel",
          autonomy: 82,
          urgency: 78
        },
        {
          name: "Bento Producer",
          office: "Escritorio de Arte",
          role: "review",
          intent: "priorizar o que precisa ficar legivel antes do deploy",
          autonomy: 82,
          urgency: 80
        },
        {
          name: "Lia Foto",
          office: "Esttiles",
          role: "image",
          intent: "garantir que a cena e os assets nao sumam no deploy",
          autonomy: 80,
          urgency: 72
        },
        {
          name: "Zed Engine",
          office: "Escritorio Nerd",
          role: "dev",
          intent: "validar API, estado e comandos antes de publicar",
          autonomy: 84,
          urgency: 76
        },
        {
          name: "Iris Proof",
          office: "Escritorio de Ninjas",
          role: "audit",
          intent: "bloquear falhas de permissao, cache e rota quebrada",
          autonomy: 81,
          urgency: 74
        },
        {
          name: "Nina Texto",
          office: "Escritorio Principal",
          role: "copy",
          intent: "deixar as mensagens da sala publicaveis e sem linguagem temporaria",
          autonomy: 79,
          urgency: 70
        }
      ];

  const subject = cleanShortText(instruction || "tema de hoje", 140);
  const angles = [
    {
      match: /\b(ceo|coord|gest|admin|owner|lead|produtor)\b/i,
      text: (item) =>
        `${item.intent || "Organizo a prioridade da rodada"}. Sobre "${subject}", eu separaria em decisao principal, risco e primeira entrega aprovada antes de chamar execucao.`
    },
    {
      match: /\b(editor|jornal|news|redac|manchete|copy|texto|foto)\b/i,
      text: (item) =>
        `${item.intent || "Cuido da leitura publica"}. Sobre "${subject}", eu ajustaria a mensagem para o visitante entender em 5 segundos o que precisa pedir aos agentes.`
    },
    {
      match: /\b(review|revis|proof|qualidade|clean|tag)\b/i,
      text: (item) =>
        `${item.intent || "Procuro falhas antes de publicar"}. Sobre "${subject}", minha prioridade e cortar repeticao, marcar o que falta e impedir que resposta generica passe como opiniao.`
    },
    {
      match: /\b(arte|design|pixel|sprite|visual|modelo|foto)\b/i,
      text: (item) =>
        `${item.intent || "Olho a cena e a identidade visual"}. Sobre "${subject}", eu deixaria cada agente reconhecivel, com pose propria, destaque de fala e foto/premio visivel.`
    },
    {
      match: /\b(dev|code|sistema|autom|terminal|tech|acesso)\b/i,
      text: (item) =>
        `${item.intent || "Ligo a conversa ao terminal"}. Sobre "${subject}", eu criaria comandos separados por agente e registraria entrada, resposta, status e proxima acao.`
    },
    {
      match: /\b(ninja|fonte|proof|segur|audit|chec)\b/i,
      text: (item) =>
        `${item.intent || "Valido risco e fonte"}. Sobre "${subject}", eu exigiria evidencia do que foi decidido e deixaria claro o que ainda depende da sua aprovacao.`
    }
  ];
  const fallbackAngles = [
    (item) =>
      `${item.intent || "Escutei o tema"}. Sobre "${subject}", eu proponho transformar a fala em uma tarefa pequena, com dono e criterio de aceite.`,
    (item) =>
      `${item.intent || "Estou acompanhando"}. Sobre "${subject}", eu vejo valor em comparar duas alternativas antes de mexer no site.`,
    (item) =>
      `${item.intent || "Entrei na reuniao"}. Sobre "${subject}", minha sugestao e responder curto, mostrar impacto e pedir permissao para executar.`,
    (item) =>
      `${item.intent || "Analisei o pedido"}. Sobre "${subject}", eu faria uma rodada de opinioes por area e destacaria divergencias em vez de repetir consenso.`
  ];

  return source.map((item, index) => {
    const signature = `${item.name || ""} ${item.office || ""} ${item.role || ""}`;
    const angle = angles.find((entry) => entry.match.test(signature));
    const opinion = angle ? angle.text(item) : fallbackAngles[index % fallbackAngles.length](item);
    return {
      agent: item.name,
      office: item.office,
      role: item.role,
      score: item.autonomy,
      urgency: item.urgency,
      opinion,
      approvalRequired: true
    };
  });
}

function buildCheffeCallPayload() {
  const agentsPayload = buildRealAgentsPayload();
  const state = readCheffeCallState();
  const currentSession = state.sessions[0]
    ? {
        ...state.sessions[0],
        approvals: Array.isArray(state.sessions[0].approvals) ? state.sessions[0].approvals.slice(0, 32) : [],
        logs: Array.isArray(state.sessions[0].logs) ? state.sessions[0].logs.slice(0, 64) : [],
        decisions: Array.isArray(state.sessions[0].decisions) ? state.sessions[0].decisions.slice(0, 32) : [],
        actionStats: summarizeCheffeCallSession(state.sessions[0])
      }
    : null;
  return {
    ok: true,
    updatedAt: new Date().toISOString(),
    agentsReady: Boolean(agentsPayload.ok),
    meeting: {
      active: state.active,
      pausedAt: state.pausedAt,
      releasedAt: state.releasedAt,
      lastInstruction: state.lastInstruction,
      lastSessionAt: state.lastSessionAt,
      currentSession,
      sessions: state.sessions
    },
    dailyContext: agentsPayload.dailyContext || null,
    autonomy: agentsPayload.autonomy || null,
    summary: {
      ...(agentsPayload.summary || {}),
      totalAgents: Number(agentsPayload.summary?.totalAgents || 181),
      autonomousAgents: Number(agentsPayload.summary?.autonomousAgents || 181),
      averageAutonomy: Number(agentsPayload.summary?.averageAutonomy || 82)
    },
    queue: Array.isArray(agentsPayload.queue) ? agentsPayload.queue : [],
    opinions: state.sessions[0]?.opinions || getCheffeCallOpinions(agentsPayload, state.lastInstruction)
  };
}

function startCheffeCallSession(body) {
  const legacyInstruction = body["brief" + "ing"] || "";
  const instruction = cleanShortText(
    body.instruction ||
      legacyInstruction ||
      "Cheffe Call aberto: pausar rotinas, memorizar contexto, ouvir a orientacao e devolver opinioes por perspectiva antes de qualquer execucao.",
    1600
  );
  const agentsPayload = buildRealAgentsPayload();
  const now = new Date().toISOString();
  const state = readCheffeCallState();
  const session = {
    id: createRecordId("chef"),
    createdAt: now,
    instruction,
    dailyContext: agentsPayload.dailyContext || null,
    opinions: getCheffeCallOpinions(agentsPayload, instruction),
    approvals: [],
    logs: [
      normalizeCheffeCallLog({
        createdAt: now,
        kindLabel: "reunião aberta",
        agent: "Cheffe Call",
        office: "Sistema",
        text: instruction
      })
    ],
    decisions: [],
    status: "aguardando-aprovacao"
  };

  writeCheffeCallState({
    ...state,
    active: true,
    pausedAt: now,
    releasedAt: "",
    lastInstruction: instruction,
    lastSessionAt: now,
    sessions: [session, ...state.sessions].slice(0, 12)
  });

  appendOfficeOrder({
    id: createRecordId("ord"),
    from: "Full Admin",
    to: "Cheffe Call + todos os agentes reais",
    priority: cleanShortText(body.priority || "maxima", 40),
    message: instruction,
    ceoReply:
      "Cheffe Call aberto. Rotinas automaticas pausadas, agentes em escuta, memoria de reuniao criada e opinioes aguardando aprovacao.",
    status: "cheffe-call-ativo",
    hierarchy: "Full Admin -> Cheffe Call -> 181 agentes reais",
    createdAt: now
  });

  return buildCheffeCallPayload();
}

function runRealAgentsRuntime(options = {}) {
  const trigger = cleanShortText(options.trigger || "manual", 80);
  const at = new Date().toISOString();
  try {
    const summary = runRealAgentsRuntimeLocal();
    const payload = buildRealAgentsPayload();
    recordRealAgentsRunHistory({
      at,
      trigger,
      ok: true,
      totalAgents: payload.summary.totalAgents,
      newsItems: payload.summary.newsItems,
      reviewIssues: payload.summary.reviewIssues,
      queueItems: payload.summary.activeQueue
    });
    return {
      ok: true,
      summary,
      payload: buildRealAgentsPayload()
    };
  } catch (error) {
    recordRealAgentsRunHistory({
      at,
      trigger,
      ok: false,
      error: String(error?.message || error || "Falha ao rodar agentes reais.")
    });
    return {
      ok: false,
      error: String(error?.message || error || "Falha ao rodar agentes reais.")
    };
  }
}

function runRealAgentsAutoCycle(trigger) {
  if (REAL_AGENTS_AUTO_RUN_DISABLED || realAgentsAutoRunState.running) return;
  if (readCheffeCallState().active) {
    realAgentsAutoRunState.lastError = "Cheffe Call ativo: runtime automatica pausada para reuniao.";
    return;
  }

  realAgentsAutoRunState.running = true;
  realAgentsAutoRunState.startedAt = new Date().toISOString();
  const result = runRealAgentsRuntime({ trigger });
  realAgentsAutoRunState.running = false;
  realAgentsAutoRunState.lastRunAt = new Date().toISOString();
  realAgentsAutoRunState.cycles += 1;
  realAgentsAutoRunState.lastError = result.ok ? "" : result.error || "Falha ao rodar agentes reais.";

  if (result.ok) {
    console.log(`[catalogo] agentes reais atualizados (${trigger})`);
  } else {
    console.warn(`[catalogo] falha no ciclo dos agentes reais (${trigger}): ${realAgentsAutoRunState.lastError}`);
  }
}

function startRealAgentsAutoRunner() {
  if (REAL_AGENTS_AUTO_RUN_DISABLED || realAgentsAutoRunState.timer) return;

  realAgentsAutoRunState.timer = setInterval(() => {
    runRealAgentsAutoCycle("auto-5-minutos");
  }, REAL_AGENTS_AUTO_RUN_INTERVAL_MS);

  setTimeout(() => {
    runRealAgentsAutoCycle("auto-inicializacao");
  }, Math.min(15 * 1000, REAL_AGENTS_AUTO_RUN_INTERVAL_MS));
}

const PUBPAID_SPRITE_SCOUT_SOURCES = [
  {
    name: "Kenney Assets",
    url: "https://kenney.nl/assets",
    licenseFocus: "CC0 / permissivo",
    use: "base segura para UI, tiles, itens, personagens e prototipos comerciais"
  },
  {
    name: "OpenGameArt",
    url: "https://opengameart.org/",
    licenseFocus: "varia por asset",
    use: "buscar sprites animados, tilesets, props de bar/cassino e efeitos revisando licenca item a item"
  },
  {
    name: "itch.io Game Assets",
    url: "https://itch.io/game-assets/free",
    licenseFocus: "varia por pacote",
    use: "garimpar pixel art de bar, cassino, interiores, UI e personagens com pagina de licenca clara"
  },
  {
    name: "CraftPix Freebies",
    url: "https://craftpix.net/freebies/",
    licenseFocus: "ver termos do pacote",
    use: "spritesheets, personagens e UI packs para estudo e referencia de pipeline"
  },
  {
    name: "GameDev Market Free Assets",
    url: "https://www.gamedevmarket.net/category/free/",
    licenseFocus: "ver termos do pacote",
    use: "props, UI, personagens e ambientes com revisao de permissao antes de uso"
  }
];

const PUBPAID_SPRITE_SCOUT_CATEGORIES = [
  "Garcom de busto/idle/talk para balcão",
  "Clientes sentados, rivais e dealer com idle e pequenas falas",
  "Copos, dados, fichas, cartas, garrafas e moedas com estados de animacao",
  "Roleta, sinuca, poker, blackjack, damas e caca-niqueis com sprites completos",
  "Tilesets de bar/pub/cassino: chao, parede, balcão, palco, luzes e mesas",
  "FX de moedas, jackpot, luz RGB, fumaca, brilho, confete e impacto",
  "UI/HUD: icones de mesa, marcadores de interacao, botoes, placas e prompts"
];

function buildDefaultNeuralGrowthState() {
  return {
    ok: true,
    version: 1,
    updatedAt: new Date().toISOString(),
    cycles: 0,
    score: 0,
    hierarchy: "Full Admin -> Codex CEO -> Ninjas + Arte/Game Design + Nerd",
    modules: [
      {
        id: "sprites",
        name: "Sprites com movimento",
        team: "Ninjas + Arte",
        level: 1,
        focus: "captar pacote completo, agrupar frames e separar acoes jogaveis"
      },
      {
        id: "game-engine",
        name: "Game engine e loop",
        team: "Nerd + Arte",
        level: 1,
        focus: "estado de jogo, input, render, tempo, camadas e performance"
      },
      {
        id: "collision-physics",
        name: "Colisao e fisica",
        team: "Nerd",
        level: 1,
        focus: "hitbox, parede, mesa, atrito, quique, easing e resposta"
      },
      {
        id: "maps",
        name: "Mapas e modo construcao",
        team: "Arte + Ninjas",
        level: 1,
        focus: "tiles, layers, colisao, decoracao, hotspots e fluxo"
      },
      {
        id: "pubpaid-feel",
        name: "PubPaid vivo",
        team: "Ninjas + Arte + Nerd",
        level: 1,
        focus: "som, suspense, NPCs, luz, UI e sensacao de aposta"
      }
    ],
    lessons: [
      "Nao avaliar frame solto quando o correto e sprite animado.",
      "Nao colocar assets ja publicados na fila de aceite.",
      "Priorizar contexto real: PubPaid, jogos, escritorios e subsites existentes.",
      "Sem canvas para ilustracao nova de personagem/conteudo; usar bitmap real revisado."
    ],
    pulses: []
  };
}

function buildNeuralGrowthPayload() {
  const persisted = readJson(OFFICE_NEURAL_GROWTH_FILE, null);
  const fallback = buildDefaultNeuralGrowthState();
  if (!persisted || typeof persisted !== "object" || Array.isArray(persisted)) return fallback;

  return {
    ...fallback,
    ...persisted,
    modules: Array.isArray(persisted.modules) && persisted.modules.length ? persisted.modules : fallback.modules,
    lessons: Array.isArray(persisted.lessons) && persisted.lessons.length ? persisted.lessons : fallback.lessons,
    pulses: Array.isArray(persisted.pulses) ? persisted.pulses : []
  };
}

function recordNeuralGrowthPulse(body = {}) {
  const current = buildNeuralGrowthPayload();
  const focus = cleanShortText(body.focus || "sprites-pubpaid", 120);
  const note = cleanShortText(body.note || "", 500);
  const pulse = {
    id: createRecordId("neural"),
    focus,
    note,
    from: "Full Admin",
    to: "Codex CEO + equipes",
    createdAt: new Date().toISOString()
  };
  const modules = current.modules.map((moduleItem) => {
    const shouldGrow =
      focus === "todos" ||
      normalizeText(`${moduleItem.id} ${moduleItem.name} ${moduleItem.focus}`).includes(normalizeText(focus));
    return {
      ...moduleItem,
      level: Number(moduleItem.level || 1) + (shouldGrow ? 1 : 0)
    };
  });
  const nextState = {
    ...current,
    ok: true,
    updatedAt: new Date().toISOString(),
    cycles: Number(current.cycles || 0) + 1,
    score: Number(current.score || 0) + 7,
    modules,
    pulses: [pulse].concat(current.pulses || []).slice(0, 80)
  };
  writeJson(OFFICE_NEURAL_GROWTH_FILE, nextState);
  return nextState;
}

function buildPubPaidSpriteScoutPayload() {
  const requests = readJson(PUBPAID_SPRITE_SCOUT_FILE, []);
  const safeRequests = Array.isArray(requests) ? requests : [];
  return {
    ok: true,
    updatedAt: new Date().toISOString(),
    mission: "Buscar na internet sprites completos, animados e licenciaveis para o PubPaid.",
    rules: [
      "Priorizar sprite pronto com movimento, nao frame solto.",
      "Registrar fonte, licenca, URL, contexto de uso e risco antes de baixar.",
      "Nada entra no jogo sem passar pelo CHECKPUBPAID.",
      "Foco em bitmap/sprite real; canvas serve para mecanica, nao para ilustrar personagem novo."
    ],
    categories: PUBPAID_SPRITE_SCOUT_CATEGORIES,
    sources: PUBPAID_SPRITE_SCOUT_SOURCES,
    requests: safeRequests.slice(-60).reverse()
  };
}

function recordPubPaidSpriteScoutOrder(body = {}) {
  const target = cleanShortText(body.target || "Ninjas + Arte/Game Design + Nerd", 120);
  const focus = cleanShortText(body.focus || "sprites completos do PubPaid", 200);
  const scoutOrder = {
    id: createRecordId("scout"),
    target,
    focus,
    status: "ordem-enviada",
    createdAt: new Date().toISOString(),
    categories: PUBPAID_SPRITE_SCOUT_CATEGORIES,
    sources: PUBPAID_SPRITE_SCOUT_SOURCES
  };
  const requests = readJson(PUBPAID_SPRITE_SCOUT_FILE, []);
  const nextRequests = Array.isArray(requests) ? requests.concat(scoutOrder).slice(-120) : [scoutOrder];
  writeJson(PUBPAID_SPRITE_SCOUT_FILE, nextRequests);

  appendOfficeOrder({
    id: createRecordId("ord"),
    from: "Full Admin",
    to: target,
    priority: "critica",
    message:
      `Buscar pela internet sprites completos e animados para PubPaid: ${focus}. Registrar fonte, licenca, URL, contexto e risco antes de qualquer uso.`,
    ceoReply:
      "Recebido. CEO acionou Ninjas para garimpo/licenca, Arte para qualidade visual e Nerd para aplicacao em gameplay.",
    status: "recebida-pelo-ceo",
    hierarchy: "Full Admin -> Codex CEO -> Ninjas + Arte/Game Design + Nerd",
    createdAt: scoutOrder.createdAt
  });

  return scoutOrder;
}

function requireAcre2026PollAdmin(req) {
  if (requireAdmin(req)) {
    return true;
  }

  const password = safeString(req?.headers?.["x-poll-admin-password"] || "", 120);
  return Boolean(POLL_ADMIN_PASSWORD) && password === POLL_ADMIN_PASSWORD;
}

function normalizePollChoice(value, allowedValues = [], fallback = "") {
  const normalized = cleanShortText(value, 120);
  return allowedValues.includes(normalized) ? normalized : fallback;
}

function getAcre2026PollResponses() {
  return getJsonArray(ACRE_2026_POLL_FILE);
}

function buildWeeklyDeviceFingerprints(tracking = {}) {
  return [
    tracking.visitorId || tracking.cookieVisitorId || "",
    tracking.sessionId || tracking.cookieSessionId || "",
    tracking.ip || ""
  ]
    .map((item) => safeString(item, 160))
    .filter(Boolean);
}

function recordMatchesWeeklyDevice(item = {}, currentWeekKey = "", fingerprints = []) {
  if (!currentWeekKey || !Array.isArray(fingerprints) || !fingerprints.length) {
    return false;
  }

  if (safeString(item.weekKey || "", 24) !== currentWeekKey) {
    return false;
  }

  const savedFingerprints = [
    safeString(item.visitorId || "", 160),
    safeString(item.sessionId || "", 160),
    safeString(item.ip || "", 160)
  ].filter(Boolean);

  return fingerprints.some((fingerprint) => savedFingerprints.includes(fingerprint));
}

function findAcre2026WeeklyVoteForAuth(authUser = {}, weekKey = getWeekBucketKey(new Date().toISOString())) {
  const googleSub = safeString(authUser?.sub || "", 160);
  const googleEmail = safeString(authUser?.email || "", 160);
  if (!googleSub && !googleEmail) return null;

  const records = getAcre2026PollResponses();
  return (
    (Array.isArray(records) ? records : []).find(
      (item) =>
        safeString(item.weekKey || "", 24) === weekKey &&
        ((googleSub && safeString(item.googleSub || "", 160) === googleSub) ||
          (googleEmail && safeString(item.googleEmail || "", 160) === googleEmail))
    ) || null
  );
}

function buildAcre2026PollCurrentUserPayload(authUser = {}) {
  const weekKey = getWeekBucketKey(new Date().toISOString());
  const existingVote = findAcre2026WeeklyVoteForAuth(authUser, weekKey);
  return {
    ok: true,
    authenticated: Boolean(authUser?.email && authUser?.sub),
    alreadyVoted: Boolean(existingVote),
    weekKey,
    user: publicAuthUser(authUser),
    vote: existingVote
      ? {
          id: existingVote.id,
          createdAt: existingVote.createdAt,
          weekKey: existingVote.weekKey
        }
      : null,
    summary: buildAcre2026PollSummary(sortByDateDesc(getAcre2026PollResponses(), "createdAt", 5000)),
    message: existingVote
      ? "Seu Google já registrou uma resposta nesta semana. A participação fica encerrada e as parciais ficam liberadas."
      : "Google conectado. A participação semanal está liberada."
  };
}

function normalizeAcre2026PollRecord(item = {}) {
  if (!item || typeof item !== "object") return null;

  const id = safeString(item.id || "", 120) || createRecordId("poll");
  const createdAt = safeString(item.createdAt || item.at || "", 80) || new Date().toISOString();
  const voto2026 = normalizePollChoice(item.voto2026 || item.vote2026, ACRE_2026_POLL_OPTIONS.vote2026, "");
  if (!voto2026) return null;

  const normalized = {
    id,
    profissao: cleanShortText(item.profissao || item.profession || "Nao informado", 100),
    localizacao: cleanShortText(item.localizacao || item.location || item.city || "Nao informado", 120),
    faixaEtaria: normalizePollChoice(item.faixaEtaria || item.ageRange, ACRE_2026_POLL_OPTIONS.ageRanges, "Prefiro nao informar"),
    votoAnterior: normalizePollChoice(item.votoAnterior || item.previousVote, ACRE_2026_POLL_OPTIONS.previousVotes, "Nao lembro/Nao votei"),
    satisfacao: Math.max(1, Math.min(5, Number(item.satisfacao || item.satisfaction || 3))),
    avaliacaoGoverno: normalizePollChoice(
      item.avaliacaoGoverno || item.governmentEvaluation,
      ACRE_2026_POLL_OPTIONS.governmentEvaluation,
      "Nao sabe"
    ),
    direcaoEstado: normalizePollChoice(
      item.direcaoEstado || item.stateDirection,
      ACRE_2026_POLL_OPTIONS.stateDirection,
      "Nao sabe"
    ),
    desejoCiclo: normalizePollChoice(item.desejoCiclo || item.desiredCycle, ACRE_2026_POLL_OPTIONS.desiredCycle, "Nao sabe"),
    voto2026,
    segundaOpcao: normalizePollChoice(
      item.segundaOpcao || item.secondChoice,
      ACRE_2026_POLL_OPTIONS.secondChoice,
      "Nenhuma segunda opcao"
    ),
    certezaVoto: normalizePollChoice(
      item.certezaVoto || item.voteCertainty,
      ACRE_2026_POLL_OPTIONS.voteCertainty,
      "Muito indefinido"
    ),
    rejeicao: normalizePollChoice(item.rejeicao || item.rejection, ACRE_2026_POLL_OPTIONS.rejection, "Nao rejeito nenhum"),
    prioridade: normalizePollChoice(item.prioridade || item.priority, ACRE_2026_POLL_OPTIONS.priorities, "Emprego e renda"),
    atencaoPolitica: normalizePollChoice(
      item.atencaoPolitica || item.politicalAttention,
      ACRE_2026_POLL_OPTIONS.politicalAttention,
      "Acompanho as vezes"
    ),
    fatorDecisivo: normalizePollChoice(
      item.fatorDecisivo || item.decisionDriver,
      ACRE_2026_POLL_OPTIONS.decisionDriver,
      "Resultados concretos"
    ),
    comentario: safeString(item.comentario || item.comment || "", 1200),
    sourcePage: cleanShortText(item.sourcePage || "/pesquisa-acre-2026.html", 260),
    pageTitle: cleanShortText(item.pageTitle || "Enquete de Opiniao Acre 2026", 160),
    visitorId: safeString(item.visitorId || "", 90),
    sessionId: safeString(item.sessionId || "", 90),
    city: safeString(item.city || "", 80),
    country: safeString(item.country || "", 80),
    ip: safeString(item.ip || "", 160),
    browser: safeString(item.browser || "", 40),
    deviceType: safeString(item.deviceType || "", 40),
    referrerHost: safeString(item.referrerHost || "", 120),
    googleEmail: safeString(item.googleEmail || "", 160),
    googleSub: safeString(item.googleSub || "", 160),
    weekKey: safeString(item.weekKey || "", 24) || getWeekBucketKey(createdAt),
    createdAt
  };

  return normalized;
}

function dedupeAcre2026PollRecords(records = []) {
  const seen = new Set();
  const output = [];

  (Array.isArray(records) ? records : []).forEach((item) => {
    const normalized = normalizeAcre2026PollRecord(item);
    if (!normalized) return;
    const key = [
      normalized.id,
      normalized.weekKey,
      normalized.googleSub || normalized.googleEmail,
      normalized.createdAt,
      normalized.voto2026
    ].join("|");
    if (seen.has(key)) return;
    seen.add(key);
    output.push(normalized);
  });

  return sortByDateDesc(output, "createdAt", 10000);
}

function buildPollBreakdown(items = [], key, limit = 10) {
  const bucket = sumBy(items, (item) => item?.[key] || "Nao informado");
  const total = Array.isArray(items) ? items.length : 0;
  return Object.entries(bucket)
    .map(([label, count]) => ({
      label,
      total: Number(count || 0),
      percent: total ? Number((((Number(count || 0) / total) * 100)).toFixed(1)) : 0
    }))
    .sort((left, right) => right.total - left.total)
    .slice(0, limit);
}

function getPollLeaderLabel(items = [], key, fallback = "Sem leitura") {
  return buildPollBreakdown(items, key, 1)[0]?.label || fallback;
}

function buildPollCandidateProfiles(items = [], limit = 4) {
  return buildPollBreakdown(items, "voto2026", limit)
    .filter((entry) => entry.label !== "Ainda nao decidi" && entry.label !== "Branco/Nulo")
    .map((entry) => {
      const subset = items.filter((item) => item?.voto2026 === entry.label);
      const avgSatisfaction = Number(
        average(
          subset
            .map((item) => Number(item?.satisfacao || 0))
            .filter((value) => Number.isFinite(value) && value > 0)
        ).toFixed(1)
      );

      return {
        label: entry.label,
        total: entry.total,
        percent: entry.percent,
        topPriority: getPollLeaderLabel(subset, "prioridade"),
        desiredCycle: getPollLeaderLabel(subset, "desejoCiclo"),
        voteCertainty: getPollLeaderLabel(subset, "certezaVoto"),
        avgSatisfaction
      };
    });
}

function buildAcre2026PollSummary(records = getAcre2026PollResponses()) {
  const items = Array.isArray(records) ? records : [];
  const totalResponses = items.length;
  const satisfactionAverage = Number(
    average(
      items
        .map((item) => Number(item.satisfacao || 0))
        .filter((value) => Number.isFinite(value) && value > 0)
    ).toFixed(1)
  );
  const commentAverageLength = Number(
    average(
      items
        .map((item) => safeString(item.comentario || "", 1600).trim().length)
        .filter((value) => Number.isFinite(value) && value > 0)
    ).toFixed(0)
  );
  const distinctLocations = new Set(
    items
      .map((item) => normalizeText(item.localizacao || item.city || ""))
      .filter(Boolean)
  ).size;
  const distinctProfessions = new Set(
    items
      .map((item) => normalizeText(item.profissao || ""))
      .filter(Boolean)
  ).size;

  return {
    totalResponses,
    satisfactionAverage,
    commentAverageLength,
    distinctLocations,
    distinctProfessions,
    vote2026: buildPollBreakdown(items, "voto2026", 6),
    secondOptions: buildPollBreakdown(items, "segundaOpcao", 6),
    rejection: buildPollBreakdown(items, "rejeicao", 6),
    priorities: buildPollBreakdown(items, "prioridade", 6),
    stateDirection: buildPollBreakdown(items, "direcaoEstado", 6),
    desiredCycle: buildPollBreakdown(items, "desejoCiclo", 6),
    voteCertainty: buildPollBreakdown(items, "certezaVoto", 6),
    governmentEvaluation: buildPollBreakdown(items, "avaliacaoGoverno", 6),
    politicalAttention: buildPollBreakdown(items, "atencaoPolitica", 6),
    decisionDriver: buildPollBreakdown(items, "fatorDecisivo", 6),
    previousVote: buildPollBreakdown(items, "votoAnterior", 6),
    ageRanges: buildPollBreakdown(items, "faixaEtaria", 6),
    locations: buildPollBreakdown(items, "localizacao", 8),
    professions: buildPollBreakdown(items, "profissao", 8),
    devices: buildPollBreakdown(items, "deviceType", 6),
    browsers: buildPollBreakdown(items, "browser", 6),
    sourcePages: buildPollBreakdown(items, "sourcePage", 6),
    candidateProfiles: buildPollCandidateProfiles(items, 4),
    updatedAt: items[0]?.createdAt || ""
  };
}

function buildAcre2026PollPublicPayload() {
  const items = sortByDateDesc(getAcre2026PollResponses(), "createdAt", 5000);
  return {
    ok: true,
    updatedAt: items[0]?.createdAt || "",
    summary: buildAcre2026PollSummary(items),
    weekly: buildWeeklyTrendSeries(items, {
      valueField: "voto2026",
      totalLabel: "totalResponses"
    })
  };
}

function pickMeaningfulPollLeader(items = [], blockedLabels = []) {
  const blocked = new Set((Array.isArray(blockedLabels) ? blockedLabels : []).map((item) => normalizeText(item)));
  return (Array.isArray(items) ? items : []).find((item) => !blocked.has(normalizeText(item?.label || ""))) || items[0] || null;
}

function isElectionJournalNewsItem(item = {}) {
  const category = normalizeText(item.category || "");
  if (category === "politica" || category === "prefeitura") {
    return true;
  }

  const haystack = normalizeText(
    [item.title, item.summary, item.sourceName, item.sourceLabel, item.category, item.location].join(" ")
  );

  return /\b(eleic|governador|governadora|vice-governadora|senador|senado|deputad|prefeit|governo|politic|candidat|partido|alianc|mailza|gladson|alan rick|jorge viana|bocalom|petecao|marcio bittar|thor dantas)\b/.test(
    haystack
  );
}

function buildAcre2026PollBridgePayload() {
  const items = sortByDateDesc(getAcre2026PollResponses(), "createdAt", 5000);
  const summary = buildAcre2026PollSummary(items);
  const leadVote = pickMeaningfulPollLeader(summary.vote2026, ["Ainda nao decidi", "Branco/Nulo"]);
  const topPriority = summary.priorities?.[0] || null;
  const topDirection = summary.stateDirection?.[0] || null;
  const desiredCycle = pickMeaningfulPollLeader(summary.desiredCycle, ["Nao sabe"]);
  const journalItems = getNews(160)
    .filter(isElectionJournalNewsItem)
    .slice(0, 4)
    .map((item) => ({
      slug: safeString(item.slug, 160),
      title: safeString(item.title, 180),
      summary: safeString(item.summary, 280),
      category: safeString(item.category, 60),
      sourceName: safeString(item.sourceName || item.source, 80),
      publishedAt: item.date || item.publishedAt || "",
      localUrl: item.slug ? `/noticia.html?slug=${encodeURIComponent(item.slug)}` : safeString(item.url, 420),
      sourceUrl: safeString(item.url || item.sourceUrl, 420)
    }));

  return {
    ok: true,
    updatedAt: summary.updatedAt || journalItems[0]?.publishedAt || "",
    poll: {
      totalResponses: Number(summary.totalResponses || 0),
      satisfactionAverage: Number(summary.satisfactionAverage || 0),
      leadVote,
      topPriority,
      topDirection,
      desiredCycle,
      candidateProfiles: Array.isArray(summary.candidateProfiles) ? summary.candidateProfiles.slice(0, 4) : [],
      weekly: buildWeeklyTrendSeries(items, {
        valueField: "voto2026",
        totalLabel: "totalResponses"
      }),
      updatedAt: summary.updatedAt || ""
    },
    journal: {
      totalItems: journalItems.length,
      items: journalItems
    }
  };
}

function buildAcre2026PollAdminPayload() {
  const items = sortByDateDesc(getAcre2026PollResponses(), "createdAt", 5000);
  const weekly = buildWeeklyTrendSeries(items, {
    valueField: "voto2026",
    totalLabel: "totalResponses"
  });
  return {
    ok: true,
    updatedAt: items[0]?.createdAt || "",
    summary: buildAcre2026PollSummary(items),
    weekly,
    records: items.map((item) => ({
      id: item.id,
      createdAt: item.createdAt,
      weekKey: item.weekKey,
      profissao: item.profissao,
      localizacao: item.localizacao,
      faixaEtaria: item.faixaEtaria,
      votoAnterior: item.votoAnterior,
      satisfacao: item.satisfacao,
      avaliacaoGoverno: item.avaliacaoGoverno,
      direcaoEstado: item.direcaoEstado,
      desejoCiclo: item.desejoCiclo,
      voto2026: item.voto2026,
      segundaOpcao: item.segundaOpcao,
      certezaVoto: item.certezaVoto,
      rejeicao: item.rejeicao,
      prioridade: item.prioridade,
      atencaoPolitica: item.atencaoPolitica,
      fatorDecisivo: item.fatorDecisivo,
      comentario: item.comentario,
      sourcePage: item.sourcePage,
      pageTitle: item.pageTitle,
      referrerHost: item.referrerHost,
      city: item.city,
      country: item.country,
      browser: item.browser,
      deviceType: item.deviceType,
      googleEmail: item.googleEmail,
      googleSub: item.googleSub,
      visitorId: item.visitorId,
      sessionId: item.sessionId,
      ip: item.ip
    }))
  };
}

function getWeekBucketKey(value = "") {
  const date = new Date(value || Date.now());
  if (Number.isNaN(date.getTime())) {
    return "week-unknown";
  }

  const utc = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = utc.getUTCDay() || 7;
  utc.setUTCDate(utc.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(utc.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((utc - yearStart) / 86400000) + 1) / 7);
  return `${utc.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

function buildWeeklyTrendSeries(records = [], { valueField = "", totalLabel = "total" } = {}) {
  const bucket = new Map();
  (Array.isArray(records) ? records : []).forEach((item) => {
    const key = getWeekBucketKey(item?.createdAt || item?.at || "");
    if (!bucket.has(key)) {
      bucket.set(key, {
        week: key,
        total: 0,
        labels: {}
      });
    }
    const entry = bucket.get(key);
    entry.total += 1;
    const label = safeString(item?.[valueField] || "", 120) || "não informado";
    entry.labels[label] = (entry.labels[label] || 0) + 1;
  });

  const weeks = Array.from(bucket.values()).sort((a, b) => String(a.week).localeCompare(String(b.week), "pt-BR"));
  return weeks.map((entry, index) => {
    const topEntries = Object.entries(entry.labels)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([label, total]) => ({
        label,
        total,
        percent: entry.total ? Number(((total / entry.total) * 100).toFixed(1)) : 0
      }));
    const previous = weeks[index - 1];
    return {
      week: entry.week,
      [totalLabel]: entry.total,
      total: entry.total,
      labels: topEntries,
      changeFromPrevious: previous ? entry.total - previous.total : 0
    };
  });
}

function getPubpaidWalletKey(user = {}) {
  return safeString(user?.sub || user?.email || "", 180).toLowerCase();
}

function normalizePubpaidAmount(value, fallback = 10) {
  const parsed = Number(parseCurrency(value, fallback));
  return PUBPAID_ALLOWED_AMOUNTS.includes(parsed) ? parsed : fallback;
}

function normalizePubpaidMoney(value, fallback = 0) {
  return Number(parseCurrency(value, fallback).toFixed(2));
}

function readMergedPubpaidArray(primaryFile, legacyFile) {
  const primary = readJson(primaryFile, []);
  const legacy = readJson(legacyFile, []);
  const merged = [];
  const seen = new Set();

  [primary, legacy].forEach((list) => {
    (Array.isArray(list) ? list : []).forEach((item) => {
      if (!item || typeof item !== "object") return;
      const key = [
        safeString(item.id || "", 160),
        safeString(item?.payment?.txid || item.reference || "", 80),
        safeString(item.createdAt || "", 80),
        safeString(item.walletKey || item?.user?.email || "", 180)
      ].join("|");
      if (seen.has(key)) return;
      seen.add(key);
      merged.push(item);
    });
  });

  return merged;
}

function writePubpaidArrayCompat(primaryFile, legacyFile, items = []) {
  const normalized = Array.isArray(items) ? items : [];
  writeJson(primaryFile, normalized);
  if (legacyFile) {
    writeJson(legacyFile, normalized);
  }
}

function normalizePubpaidWalletRecord(item = {}) {
  const coerceMoney = (value) => normalizePubpaidMoney(value, 0);
  const lockedLegacy = item.locked === true ? coerceMoney(item.balance || item.balanceCoins || 0) : 0;
  const lockedWithdrawalCoins = coerceMoney(item.lockedWithdrawalCoins ?? lockedLegacy);
  const lockedMatchCoins = coerceMoney(item.lockedMatchCoins ?? item.lockedPvpCoins ?? 0);
  const balanceCoins = coerceMoney(item.balanceCoins ?? item.balance ?? 0);
  return {
    ...item,
    balanceCoins,
    availableCoins: Math.max(0, coerceMoney(item.availableCoins ?? (balanceCoins - lockedWithdrawalCoins - lockedMatchCoins))),
    lockedMatchCoins,
    lockedWithdrawalCoins,
    totalApprovedDeposits: coerceMoney(item.totalApprovedDeposits ?? item.depositsApproved ?? 0),
    totalApprovedWithdrawals: coerceMoney(item.totalApprovedWithdrawals ?? item.withdrawalsApproved ?? 0),
    locked: Boolean(item.locked ?? (lockedWithdrawalCoins + lockedMatchCoins > 0))
  };
}

function getPubpaidWalletStore() {
  const items = readMergedPubpaidArray(PUBPAID_WALLETS_FILE, LEGACY_PUBPAID_WALLETS_FILE);
  return (Array.isArray(items) ? items : []).map((item) => normalizePubpaidWalletRecord(item));
}

function writePubpaidWalletStore(items = []) {
  writePubpaidArrayCompat(PUBPAID_WALLETS_FILE, LEGACY_PUBPAID_WALLETS_FILE, items);
}

function getPubpaidWithdrawals() {
  const items = readMergedPubpaidArray(PUBPAID_WITHDRAWALS_FILE, LEGACY_PUBPAID_WITHDRAWALS_FILE);
  return Array.isArray(items) ? items : [];
}

function writePubpaidWithdrawals(items = []) {
  writePubpaidArrayCompat(PUBPAID_WITHDRAWALS_FILE, LEGACY_PUBPAID_WITHDRAWALS_FILE, items);
}

function getPubpaidWallet(authUser = {}, { createIfMissing = true } = {}) {
  const key = getPubpaidWalletKey(authUser);
  if (!key) {
    return null;
  }

  const walletStore = getPubpaidWalletStore();
  const wallets = walletStore && typeof walletStore === "object" ? walletStore : {};
  let walletRecord = wallets[key] || null;
  let wallet = walletRecord
    ? {
        id: safeString(walletRecord.id || "", 120) || createRecordId("pubwallet"),
        walletKey: key,
        user: publicAuthUser(authUser),
        balanceCoins: normalizePubpaidMoney(walletRecord.balanceCoins ?? walletRecord.balance),
        availableCoins: normalizePubpaidMoney(
          walletRecord.availableCoins ??
            (normalizePubpaidMoney(walletRecord.balanceCoins ?? walletRecord.balance) -
              normalizePubpaidMoney(walletRecord.lockedWithdrawalCoins ?? 0) -
              normalizePubpaidMoney(walletRecord.lockedMatchCoins ?? 0))
        ),
        lockedMatchCoins: normalizePubpaidMoney(walletRecord.lockedMatchCoins ?? 0),
        lockedWithdrawalCoins: normalizePubpaidMoney(walletRecord.lockedWithdrawalCoins ?? walletRecord.locked),
        totalApprovedDeposits: normalizePubpaidMoney(walletRecord.totalApprovedDeposits ?? walletRecord.approvedDeposits),
        totalApprovedWithdrawals: normalizePubpaidMoney(walletRecord.totalApprovedWithdrawals ?? walletRecord.approvedWithdrawals),
        createdAt: safeString(walletRecord.createdAt || "", 40),
        updatedAt: safeString(walletRecord.updatedAt || "", 40)
      }
    : null;

  if (!wallet && createIfMissing) {
    wallet = {
      id: createRecordId("pubwallet"),
      walletKey: key,
      user: publicAuthUser(authUser),
      balanceCoins: 0,
      availableCoins: 0,
      lockedMatchCoins: 0,
      lockedWithdrawalCoins: 0,
      totalApprovedDeposits: 0,
      totalApprovedWithdrawals: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    savePubpaidWalletStore({
      ...wallets,
      [key]: {
        playerId: key,
        playerName: safeString(authUser.name, 120) || "Jogador",
        balanceCoins: 0,
        availableCoins: 0,
        lockedMatchCoins: 0,
        lockedWithdrawalCoins: 0,
        totalApprovedDeposits: 0,
        totalApprovedWithdrawals: 0,
        createdAt: wallet.createdAt,
        updatedAt: wallet.updatedAt
      }
    });
  }

  return wallet;
}

function updatePubpaidWallet(authUser = {}, updater = null) {
  const key = getPubpaidWalletKey(authUser);
  if (!key) {
    return null;
  }

  const walletStore = getPubpaidWalletStore();
  const wallets = walletStore && typeof walletStore === "object" ? walletStore : {};
  const current = getPubpaidWallet(authUser, { createIfMissing: true }) || {
    id: createRecordId("pubwallet"),
    walletKey: key,
    user: publicAuthUser(authUser),
    balanceCoins: 0,
    availableCoins: 0,
    lockedMatchCoins: 0,
    lockedWithdrawalCoins: 0,
    totalApprovedDeposits: 0,
    totalApprovedWithdrawals: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  const next = typeof updater === "function" ? updater({ ...current }) || current : current;
  next.user = publicAuthUser(authUser);
  next.walletKey = key;
  next.balanceCoins = Math.max(0, normalizePubpaidMoney(next.balanceCoins));
  next.lockedMatchCoins = Math.max(0, normalizePubpaidMoney(next.lockedMatchCoins));
  next.lockedWithdrawalCoins = Math.max(0, normalizePubpaidMoney(next.lockedWithdrawalCoins));
  next.availableCoins = Math.max(0, normalizePubpaidMoney(next.balanceCoins - next.lockedMatchCoins - next.lockedWithdrawalCoins));
  next.totalApprovedDeposits = Math.max(0, normalizePubpaidMoney(next.totalApprovedDeposits));
  next.totalApprovedWithdrawals = Math.max(0, normalizePubpaidMoney(next.totalApprovedWithdrawals));
  next.updatedAt = new Date().toISOString();
  savePubpaidWalletStore({
    ...wallets,
    [key]: {
      playerId: key,
      playerName: safeString(next?.user?.name || authUser.name || "", 120) || "Jogador",
      balanceCoins: next.balanceCoins,
      availableCoins: next.availableCoins,
      lockedMatchCoins: next.lockedMatchCoins,
      lockedWithdrawalCoins: next.lockedWithdrawalCoins,
      totalApprovedDeposits: next.totalApprovedDeposits,
      totalApprovedWithdrawals: next.totalApprovedWithdrawals,
      createdAt: safeString(next.createdAt || "", 40) || new Date().toISOString(),
      updatedAt: next.updatedAt
    }
  });
  return next;
}

function isPubpaidPendingStatus(value = "") {
  const normalized = normalizeText(value);
  return normalized.includes("pendente") || normalized.includes("aguardando");
}

function buildPubpaidAccountPayload(authUser = {}) {
  const wallet = getPubpaidWallet(authUser);
  const walletKey = getPubpaidWalletKey(authUser);
  const deposits = readMergedPubpaidArray(PUBPAID_DEPOSITS_FILE, LEGACY_PUBPAID_DEPOSITS_FILE).filter(
    (item) => safeString(item?.walletKey || "", 180).toLowerCase() === walletKey
  );
  const withdrawals = getPubpaidWithdrawals().filter(
    (item) => safeString(item?.walletKey || "", 180).toLowerCase() === walletKey
  );
  const pendingDeposits = deposits.filter((item) => isPubpaidPendingStatus(item?.payment?.status || item?.status));
  const pendingWithdrawals = withdrawals.filter((item) =>
    isPubpaidPendingStatus(item?.payment?.status || item?.status || item?.status)
  );

  return {
    ok: true,
    user: publicAuthUser(authUser),
    wallet: wallet
      ? {
          balanceCoins: normalizePubpaidMoney(wallet.balanceCoins),
          availableCoins: normalizePubpaidMoney(wallet.availableCoins ?? (wallet.balanceCoins - wallet.lockedMatchCoins - wallet.lockedWithdrawalCoins)),
          lockedMatchCoins: normalizePubpaidMoney(wallet.lockedMatchCoins),
          lockedWithdrawalCoins: normalizePubpaidMoney(wallet.lockedWithdrawalCoins),
          totalApprovedDeposits: normalizePubpaidMoney(wallet.totalApprovedDeposits),
          totalApprovedWithdrawals: normalizePubpaidMoney(wallet.totalApprovedWithdrawals),
          createdAt: wallet.createdAt || "",
          updatedAt: wallet.updatedAt || ""
        }
      : {
          balanceCoins: 0,
          availableCoins: 0,
          lockedMatchCoins: 0,
          lockedWithdrawalCoins: 0,
          totalApprovedDeposits: 0,
          totalApprovedWithdrawals: 0,
          createdAt: "",
          updatedAt: ""
        },
    pending: {
      deposits: pendingDeposits.length,
      withdrawals: pendingWithdrawals.length
    },
    recentDeposits: sortByDateDesc(deposits, "createdAt", 8).map((item) => ({
      id: item.id,
      amount: item.amount || 0,
      creditsRequested: item.creditsRequested || 0,
      status: item.status || "",
      paymentStatus: item?.payment?.status || "",
      txid: item?.payment?.txid || "",
      createdAt: item.createdAt || "",
      reviewDeadlineAt: item.reviewDeadlineAt || ""
    })),
    recentWithdrawals: sortByDateDesc(withdrawals, "createdAt", 8).map((item) => ({
      id: item.id,
      amount: item.amount || 0,
      creditsRequested: item.creditsRequested || 0,
      status: item.status || "",
      paymentStatus: item?.payment?.status || "",
      txid: item?.payment?.txid || "",
      createdAt: item.createdAt || "",
      reviewDeadlineAt: item.reviewDeadlineAt || ""
    }))
  };
}

function getElectionVoteBoard(limit = 15) {
  const store = getElectionVoteStore();
  const config = getElectionConfig();
  const offices = Array.isArray(config.offices) ? config.offices : [];
  const rows = [];

  Object.entries(store.votes || {}).forEach(([officeId, candidates]) => {
    const office = offices.find((item) => item.id === officeId);
    Object.entries(candidates || {}).forEach(([candidateId, total]) => {
      const candidate = Array.isArray(office?.candidates)
        ? office.candidates.find((item) => item.id === candidateId)
        : null;
      rows.push({
        candidate: `${candidate?.name || candidateId} (${office?.label || officeId})`,
        office: office?.label || officeId,
        candidateName: candidate?.name || candidateId,
        candidateId,
        total: Number(total || 0)
      });
    });
  });

  return rows.sort((a, b) => b.total - a.total).slice(0, limit);
}

function getElectionVoteRecords(limit = 0) {
  const store = getElectionVoteStore();
  const records = Array.isArray(store.records) ? store.records : [];
  const sorted = sortByDateDesc(records, "at", Math.max(limit || records.length || 1, 1));
  return limit > 0 ? sorted.slice(0, limit) : sorted;
}

function buildElectionHeatBoard(limit = 12) {
  const buckets = new Map();

  getElectionVoteRecords().forEach((record) => {
    const key = `${record.officeId || record.office}::${record.candidateId || record.candidateName}`;
    if (!buckets.has(key)) {
      buckets.set(key, {
        office: record.office || record.officeId || "Cargo",
        candidate: record.candidateName || record.candidateId || "Candidato",
        candidateParty: record.candidateParty || "",
        totalVotes: 0,
        opinions: 0,
        positive: 0,
        negative: 0,
        neutral: 0,
        mixed: 0,
        noOpinion: 0,
        favorableReelection: 0,
        desgasteReelection: 0,
        cities: {},
        lastAt: record.at || ""
      });
    }

    const bucket = buckets.get(key);
    bucket.totalVotes += 1;
    bucket.cities[record.city || "não informado"] = (bucket.cities[record.city || "não informado"] || 0) + 1;
    bucket.lastAt = bucket.lastAt && new Date(bucket.lastAt) > new Date(record.at || 0) ? bucket.lastAt : record.at;

    if (record.observation) {
      bucket.opinions += 1;
    }

    if (record.sentiment === "positivo") {
      bucket.positive += 1;
    } else if (record.sentiment === "negativo") {
      bucket.negative += 1;
    } else if (record.sentiment === "misto") {
      bucket.mixed += 1;
    } else if (record.sentiment === "sem-opiniao") {
      bucket.noOpinion += 1;
    } else {
      bucket.neutral += 1;
    }

    if (record.reelectionSignal === "favoravel") {
      bucket.favorableReelection += 1;
    } else if (record.reelectionSignal === "desgaste") {
      bucket.desgasteReelection += 1;
    }
  });

  return Array.from(buckets.values())
    .map((bucket) => {
      const cityList = Object.entries(bucket.cities)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([city, total]) => `${city} (${total})`)
        .join(" • ");
      const heatScore =
        bucket.totalVotes +
        bucket.positive * 1.6 -
        bucket.negative * 1.4 +
        bucket.favorableReelection -
        bucket.desgasteReelection;
      let heatLabel = "ambiente dividido";

      if (bucket.positive > bucket.negative + 1 || bucket.favorableReelection > bucket.desgasteReelection + 1) {
        heatLabel = "clima favorável";
      } else if (bucket.negative > bucket.positive + 1 || bucket.desgasteReelection > bucket.favorableReelection + 1) {
        heatLabel = "sinal de desgaste";
      } else if (bucket.opinions <= 1 && bucket.totalVotes <= 1) {
        heatLabel = "amostra inicial";
      }

      return {
        ...bucket,
        citiesLabel: cityList || "Sem cidades registradas",
        heatScore: Number(heatScore.toFixed(2)),
        heatLabel
      };
    })
    .sort((a, b) => b.heatScore - a.heatScore || b.totalVotes - a.totalVotes)
    .slice(0, limit);
}

function buildHourlyDistribution(items = [], dateKey = "at") {
  const buckets = Array.from({ length: 24 }, (_, hour) => ({
    hour,
    label: `${String(hour).padStart(2, "0")}:00`,
    total: 0
  }));

  items.forEach((item) => {
    const date = new Date(item?.[dateKey] || 0);
    if (Number.isNaN(date.getTime())) return;
    buckets[date.getHours()].total += 1;
  });

  return buckets;
}

function buildDailySeries(seriesMap = {}, days = 14) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const keys = Object.keys(seriesMap);
  const rows = [];

  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - offset);
    const key = date.toISOString().slice(0, 10);
    const row = {
      date: key,
      label: date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
      total: 0
    };

    keys.forEach((name) => {
      const total = Number(seriesMap[name]?.[key] || 0);
      row[name] = total;
      row.total += total;
    });

    rows.push(row);
  }

  return rows;
}

function buildSourceSegments(visits = []) {
  const bucket = {
    direto: 0,
    social: 0,
    busca: 0,
    referencia: 0
  };

  visits.forEach((item) => {
    const ref = summarizeReferrer(item?.referrer).toLowerCase();
    if (!ref || ref === "direto") {
      bucket.direto += 1;
      return;
    }
    if (/(google|bing|yahoo|duckduckgo)/.test(ref)) {
      bucket.busca += 1;
      return;
    }
    if (/(facebook|instagram|whatsapp|tiktok|x\.com|twitter|youtube|telegram)/.test(ref)) {
      bucket.social += 1;
      return;
    }
    bucket.referencia += 1;
  });

  return bucket;
}

function buildExecutivePriorities({
  totals = {},
  founderItems = [],
  pendingFounderItems = [],
  pendingNinjasPayments = 0,
  voteRecords = [],
  acre2026Poll = [],
  recentSalesListings = [],
  recentVrRentalLeads = []
} = {}) {
  const priorities = [];
  const supportConversion = totals.subscriptions
    ? Number(((founderItems.length / totals.subscriptions) * 100).toFixed(1))
    : 0;
  const pollShare = totals.accesses
    ? Number(((totals.acre2026PollResponses / totals.accesses) * 100).toFixed(2))
    : 0;
  const opinionShare = totals.votes
    ? Number(((voteRecords.filter((item) => item.observation).length / totals.votes) * 100).toFixed(1))
    : 0;

  priorities.push({
    title: "Conversão em apoio fundador",
    tone: supportConversion >= 8 ? "good" : supportConversion >= 3 ? "watch" : "alert",
    metric: `${supportConversion}%`,
    detail: `${founderItems.length} confirmados de ${totals.subscriptions || 0} contatos captados`
  });
  priorities.push({
    title: "Pendências financeiras em fila",
    tone: pendingFounderItems.length + pendingNinjasPayments > 6 ? "alert" : pendingFounderItems.length + pendingNinjasPayments > 0 ? "watch" : "good",
    metric: fmtNumber(pendingFounderItems.length + pendingNinjasPayments),
    detail: `${pendingFounderItems.length} fundadores e ${pendingNinjasPayments} pagamentos Ninjas aguardando ação`
  });
  priorities.push({
    title: "Pulso eleitoral com comentário",
    tone: opinionShare >= 40 ? "good" : opinionShare >= 20 ? "watch" : "alert",
    metric: `${opinionShare}%`,
    detail: `${voteRecords.filter((item) => item.observation).length} votos com observação registrada`
  });
  priorities.push({
    title: "Captação da pesquisa Acre 2026",
    tone: pollShare >= 5 ? "good" : pollShare >= 2 ? "watch" : "alert",
    metric: `${pollShare}%`,
    detail: `${totals.acre2026PollResponses || 0} respostas em relação ao total de acessos`
  });
  priorities.push({
    title: "Mercado local em movimento",
    tone: recentSalesListings.length + recentVrRentalLeads.length >= 6 ? "good" : "watch",
    metric: fmtNumber((totals.salesListings || 0) + (totals.vrRentalLeads || 0)),
    detail: `${totals.salesListings || 0} vendas e ${totals.vrRentalLeads || 0} leads de aluguel VR`
  });

  return priorities;
}

function fmtNumber(value) {
  return Number.isFinite(Number(value)) ? Number(value).toLocaleString("pt-BR") : String(value || 0);
}

function buildAdminDashboardPayload() {
  const visits = getJsonArray(VISITS_FILE);
  const heartbeats = getJsonArray(HEARTBEATS_FILE);
  const comments = getJsonArray(path.join(DATA_DIR, "comments.json"));
  const subs = getJsonArray(path.join(DATA_DIR, "subscriptions.json"));
  const acre2026Poll = getAcre2026PollResponses();
  const acre2026PollSummary = buildAcre2026PollSummary(sortByDateDesc(acre2026Poll, "createdAt", 5000));
  const ninjasRequests = getJsonArray(NINJAS_REQUESTS_FILE);
  const ninjasProfiles = getJsonArray(NINJAS_PROFILES_FILE);
  const pubpaidDeposits = readMergedPubpaidArray(PUBPAID_DEPOSITS_FILE, LEGACY_PUBPAID_DEPOSITS_FILE);
  const salesListings = getJsonArray(SALES_LISTINGS_FILE);
  const vrRentalLeads = getJsonArray(VR_RENTAL_LEADS_FILE);
  const news = getNews(200);
  const biz = getBusinesses();
  const voteRecords = getElectionVoteRecords();
  const voteBoard = getElectionVoteBoard(15);
  const electoralHeat = buildElectionHeatBoard(12);
  const founderItems = subs.filter(isConfirmedFounderSubscription);
  const pendingFounderItems = subs.filter(isPendingFounderSubscription);
  const pendingNinjasPayments = ninjasRequests
    .concat(ninjasProfiles)
    .filter((item) => String(item?.payment?.status || item.status || "").includes("pendente")).length;

  const uniqueVisitors = new Set(
    visits.map((item) => item.visitorId || item.cookieVisitorId).filter(Boolean)
  );
  const uniqueSessions = new Set(
    visits.map((item) => item.sessionId || item.cookieSessionId).filter(Boolean)
  );
  const byDevice = sumBy(visits, (item) => item.deviceType || "desconhecido");
  const byBrowser = sumBy(visits, (item) => item.browser || "Outro");
  const byCity = sumBy(visits, (item) => item.city || "não informado");
  const byCountry = sumBy(visits, (item) => item.country || "não informado");
  const byIp = sumBy(visits, (item) => item.ip || "não informado");
  const byReferrer = sumBy(visits, (item) => summarizeReferrer(item.referrer));
  const byConsent = sumBy(visits, (item) => item.trackingConsent || "desconhecido");
  const byPage = sumBy(visits, (item) => item.pagePath || "/");
  const sourceSegments = buildSourceSegments(visits);
  const activityByDayRaw = {
    accesses: sumBy(visits, (item) => String(item.at || "").slice(0, 10) || "sem-data"),
    comments: sumBy(comments, (item) => String(item.createdAt || "").slice(0, 10) || "sem-data"),
    subscriptions: sumBy(subs, (item) => String(item.createdAt || "").slice(0, 10) || "sem-data"),
    votes: sumBy(voteRecords, (item) => String(item.at || "").slice(0, 10) || "sem-data"),
    poll: sumBy(acre2026Poll, (item) => String(item.createdAt || "").slice(0, 10) || "sem-data")
  };
  const hourlyActivity = {
    accesses: buildHourlyDistribution(visits, "at"),
    comments: buildHourlyDistribution(comments, "createdAt"),
    subscriptions: buildHourlyDistribution(subs, "createdAt"),
    votes: buildHourlyDistribution(voteRecords, "at")
  };
  const dailyActivity = buildDailySeries(activityByDayRaw, 14);

  const sessionDurations = {};
  heartbeats.forEach((item) => {
    const sessionId = String(item.sessionId || "").trim();
    if (!sessionId) return;
    sessionDurations[sessionId] = (sessionDurations[sessionId] || 0) + Number(item.durationSec || 0);
  });

  const sentimentTotals = {
    positivo: voteRecords.filter((item) => item.sentiment === "positivo").length,
    negativo: voteRecords.filter((item) => item.sentiment === "negativo").length,
    misto: voteRecords.filter((item) => item.sentiment === "misto").length,
    neutro: voteRecords.filter((item) => item.sentiment === "neutro").length,
    semOpiniao: voteRecords.filter((item) => item.sentiment === "sem-opiniao").length
  };
  const reelectionTotals = {
    favoravel: voteRecords.filter((item) => item.reelectionSignal === "favoravel").length,
    desgaste: voteRecords.filter((item) => item.reelectionSignal === "desgaste").length,
    neutro: voteRecords.filter((item) => item.reelectionSignal === "neutro").length
  };

  const activityDates = []
    .concat(visits.map((item) => item.at))
    .concat(comments.map((item) => item.createdAt))
    .concat(subs.map((item) => item.createdAt))
    .concat(voteRecords.map((item) => item.at))
    .concat(vrRentalLeads.map((item) => item.createdAt))
    .map((value) => new Date(value || 0).getTime())
    .filter((value) => Number.isFinite(value) && value > 0);

  const period = {
    from: activityDates.length ? new Date(Math.min(...activityDates)).toISOString() : null,
    to: activityDates.length ? new Date(Math.max(...activityDates)).toISOString() : null
  };
  const conversion = {
    visitToCommentRate: visits.length ? Number(((comments.length / visits.length) * 100).toFixed(2)) : 0,
    visitToSubscriptionRate: visits.length ? Number(((subs.length / visits.length) * 100).toFixed(2)) : 0,
    visitToPollRate: visits.length ? Number(((acre2026Poll.length / visits.length) * 100).toFixed(2)) : 0,
    subscriptionToFounderRate: subs.length ? Number(((founderItems.length / subs.length) * 100).toFixed(2)) : 0,
    ninjasDemandRate: visits.length ? Number((((ninjasRequests.length + ninjasProfiles.length) / visits.length) * 100).toFixed(2)) : 0
  };
  const topCityTotal = topEntries(byCity, "city", 1)[0]?.total || 0;
  const topCountryTotal = topEntries(byCountry, "country", 1)[0]?.total || 0;
  const geoReach = {
    topCityShare: visits.length ? Number(((topCityTotal / visits.length) * 100).toFixed(2)) : 0,
    topCountryShare: visits.length ? Number(((topCountryTotal / visits.length) * 100).toFixed(2)) : 0,
    totalCities: Object.keys(byCity).length,
    totalCountries: Object.keys(byCountry).length
  };
  const executiveSummary = buildExecutivePriorities({
    totals: {
      accesses: visits.length,
      subscriptions: subs.length,
      acre2026PollResponses: acre2026Poll.length,
      salesListings: salesListings.length,
      vrRentalLeads: vrRentalLeads.length,
      votes: voteRecords.length
    },
    founderItems,
    pendingFounderItems,
    pendingNinjasPayments,
    voteRecords,
    acre2026Poll,
    recentSalesListings: salesListings,
    recentVrRentalLeads: vrRentalLeads
  });
  const funnel = [
    { label: "Acessos", total: visits.length },
    { label: "Visitantes únicos", total: uniqueVisitors.size },
    { label: "Sessões", total: uniqueSessions.size },
    { label: "Comentários", total: comments.length },
    { label: "Assinaturas", total: subs.length },
    { label: "Fundadores", total: founderItems.length },
    { label: "Pesquisa Acre 2026", total: acre2026Poll.length },
    { label: "Pedidos Ninjas", total: ninjasRequests.length },
    { label: "Currículos Ninjas", total: ninjasProfiles.length },
    { label: "Vendas", total: salesListings.length },
    { label: "VR Leads", total: vrRentalLeads.length }
  ];
  const opportunityBoard = [
    { label: "Fundadores pendentes", total: pendingFounderItems.length, tone: pendingFounderItems.length ? "watch" : "good" },
    { label: "Pagamentos Ninjas pendentes", total: pendingNinjasPayments, tone: pendingNinjasPayments ? "alert" : "good" },
    { label: "Cidades alcançadas", total: Object.keys(byCity).length, tone: Object.keys(byCity).length >= 8 ? "good" : "watch" },
    { label: "Fontes de tráfego ativas", total: Object.keys(byReferrer).length, tone: Object.keys(byReferrer).length >= 4 ? "good" : "watch" }
  ];

  return {
    ok: true,
    period,
    storage: {
      mode: "arquivo local",
      target: DATA_DIR
    },
    totals: {
      accesses: visits.length,
      uniqueVisitors: uniqueVisitors.size,
      uniqueSessions: uniqueSessions.size,
      comments: comments.length,
      subscriptions: subs.length,
      acre2026PollResponses: acre2026Poll.length,
      supporters: founderItems.length,
      pendingSupporters: pendingFounderItems.length,
      votes: voteRecords.length || voteBoard.reduce((sum, item) => sum + Number(item.total || 0), 0),
      opinions: voteRecords.filter((item) => item.observation).length,
      ninjasRequests: ninjasRequests.length,
      ninjasProfiles: ninjasProfiles.length,
      ninjasPendingPayments: pendingNinjasPayments,
      salesListings: salesListings.length,
      vrRentalLeads: vrRentalLeads.length,
      news: Array.isArray(news) ? news.length : 0,
      businesses: Array.isArray(biz) ? biz.length : 0
    },
    engagement: {
      avgHeartbeatSec: Number(average(heartbeats.map((item) => Number(item.durationSec || 0))).toFixed(2)),
      avgSessionSec: Number(average(Object.values(sessionDurations)).toFixed(2))
    },
    executiveSummary,
    funnel,
    conversion,
    geoReach,
    sourceSegments,
    hourlyActivity,
    dailyActivity,
    opportunityBoard,
    distributions: {
      device: byDevice,
      browser: byBrowser,
      city: byCity,
      country: byCountry,
      ip: byIp,
      referrer: byReferrer,
      consent: byConsent
    },
    topPages: topEntries(byPage, "pagePath", 16),
    mostViewedArticles: buildMostViewedArticles(visits, 12),
    voteBoard,
    topCountries: topEntries(byCountry, "country", 16),
    topIps: topEntries(byIp, "ip", 16),
    topReferrers: topEntries(byReferrer, "referrer", 16),
    recentVisits: sortByDateDesc(visits, "at", 24).map((item) => ({
      at: item.at,
      pagePath: item.pagePath,
      city: item.city,
      country: item.country,
      browser: item.browser,
      ip: item.ip,
      visitorId: item.visitorId || item.cookieVisitorId || "",
      referrerHost: summarizeReferrer(item.referrer)
    })),
    recentComments: sortByDateDesc(comments, "createdAt", 18).map((item) => ({
      createdAt: item.createdAt,
      author: item.author || item.name || "Leitor",
      message: item.message || item.text || "",
      city: item.city || "",
      ip: item.ip || ""
    })),
    recentVotes: sortByDateDesc(voteRecords, "at", 18).map((item) => ({
      at: item.at,
      candidateName: item.candidateName,
      candidateParty: item.candidateParty || "",
      office: item.office,
      scope: item.office,
      city: item.city,
      voterName: item.voterName || "",
      voterParty: item.voterParty || "",
      ip: item.ip,
      observation: item.observation || "",
      sentiment: item.sentiment || "neutro",
      reelectionSignal: item.reelectionSignal || "neutro"
    })),
    electionWeekly: buildWeeklyTrendSeries(
      voteRecords.map((item) => ({
        ...item,
        weeklyLabel: `${item.candidateName || item.candidateId || "Candidato"} (${item.office || item.officeId || "Cargo"})`
      })),
      {
        valueField: "weeklyLabel",
        totalLabel: "totalVotes"
      }
    ),
    recentSubscriptions: sortByDateDesc(subs, "createdAt", 18).map((item) => ({
      createdAt: item.createdAt,
      name: item.name || "",
      email: item.email || "",
      whatsapp: item.whatsapp || item.phone || "",
      sourcePage: item.sourcePage || item.pagePath || "",
      city: item.city || "",
      ip: item.ip || ""
    })),
    acre2026PollSummary,
    acre2026PollWeekly: buildWeeklyTrendSeries(acre2026Poll, {
      valueField: "voto2026",
      totalLabel: "totalResponses"
    }),
    recentAcre2026Poll: sortByDateDesc(acre2026Poll, "createdAt", 18).map((item) => ({
      createdAt: item.createdAt,
      profissao: item.profissao || "",
      localizacao: item.localizacao || "",
      faixaEtaria: item.faixaEtaria || "",
      votoAnterior: item.votoAnterior || "",
      satisfacao: item.satisfacao || 0,
      voto2026: item.voto2026 || "",
      rejeicao: item.rejeicao || "",
      prioridade: item.prioridade || "",
      comentario: item.comentario || "",
      city: item.city || "",
      country: item.country || "",
      ip: item.ip || ""
    })),
    recentNinjasRequests: sortByDateDesc(ninjasRequests, "createdAt", 12).map((item) => ({
      createdAt: item.createdAt,
      type: item.type || "pedido",
      name: item.name || "",
      phone: item.phone || "",
      service: item.service || item.area || "",
      status: item.status || "",
      paymentStatus: item?.payment?.status || "",
      txid: item?.payment?.txid || ""
    })),
    recentNinjasProfiles: sortByDateDesc(ninjasProfiles, "createdAt", 12).map((item) => ({
      createdAt: item.createdAt,
      name: item.name || "",
      area: item.area || "",
      plan: item.plan || "gratis",
      credits: item.credits || 0,
      status: item.status || "",
      phone: item.phone || "",
      paymentStatus: item?.payment?.status || "",
      txid: item?.payment?.txid || ""
    })),
    recentSalesListings: sortByDateDesc(salesListings, "createdAt", 12).map((item) => ({
      createdAt: item.createdAt,
      title: item.title || "",
      category: item.category || "",
      price: item.price || "",
      sellerName: item.sellerName || "",
      phone: item.phone || "",
      city: item.city || "",
      status: item.status || ""
    })),
    recentVrRentalLeads: sortByDateDesc(vrRentalLeads, "createdAt", 12).map((item) => ({
      createdAt: item.createdAt,
      name: item.name || "",
      phone: item.phone || "",
      rentalDate: item.rentalDate || "",
      period: item.period || "",
      package: item.package || "",
      status: item.status || "",
      city: item.city || ""
    })),
    collectionInventory: buildCollectionInventory({
      visits,
      heartbeats,
      comments,
      subscriptions: subs,
      voteRecords,
      ninjasRequests,
      ninjasProfiles,
      pubpaidDeposits,
      salesListings,
      vrRentalLeads
    }),
    electoralHeat,
    sentimentTotals,
    reelectionTotals,
    updatedAt: new Date().toISOString()
  };
}

function buildPubpaidAdminPayload() {
  const pubpaidDeposits = readMergedPubpaidArray(PUBPAID_DEPOSITS_FILE, LEGACY_PUBPAID_DEPOSITS_FILE);
  const pubpaidWithdrawals = getPubpaidWithdrawals();
  const pubpaidWallets = getPubpaidWalletStore();
  const pendingPubpaidDeposits = sortByDateDesc(
    pubpaidDeposits.filter((item) => isPubpaidPendingStatus(item?.payment?.status || item?.status)),
    "createdAt",
    50
  ).map((item) => ({
    id: item.id,
    createdAt: item.createdAt || "",
    email: item?.user?.email || "",
    name: item?.user?.name || "",
    depositorName: item.depositorName || item?.payment?.depositorName || "",
    amount: item.amount || 0,
    creditsRequested: item.creditsRequested || 0,
    status: item.status || "",
    paymentStatus: item?.payment?.status || "",
    txid: item?.payment?.txid || "",
    reviewDeadlineAt: item.reviewDeadlineAt || ""
  }));
  const pendingPubpaidWithdrawals = sortByDateDesc(
    pubpaidWithdrawals.filter((item) => isPubpaidPendingStatus(item?.payment?.status || item?.status)),
    "createdAt",
    50
  ).map((item) => ({
    id: item.id,
    createdAt: item.createdAt || "",
    email: item?.user?.email || "",
    name: item?.user?.name || "",
    amount: item.amount || 0,
    creditsRequested: item.creditsRequested || 0,
    status: item.status || "",
    paymentStatus: item?.payment?.status || "",
    txid: item?.payment?.txid || "",
    reviewDeadlineAt: item.reviewDeadlineAt || ""
  }));
  const pubpaidWalletBoard = sortByDateDesc(pubpaidWallets, "updatedAt", 50).map((item) => ({
    updatedAt: item.updatedAt || item.createdAt || "",
    email: item?.user?.email || "",
    name: item?.user?.name || "",
    walletKey: item.walletKey || "",
    balanceCoins: normalizePubpaidMoney(item.balanceCoins),
    lockedWithdrawalCoins: normalizePubpaidMoney(item.lockedWithdrawalCoins),
    totalApprovedDeposits: normalizePubpaidMoney(item.totalApprovedDeposits),
    totalApprovedWithdrawals: normalizePubpaidMoney(item.totalApprovedWithdrawals)
  }));

  return {
    ok: true,
    storage: {
      mode: "pubpaid-file",
      target: DATA_DIR
    },
    totals: {
      pubpaidDeposits: pubpaidDeposits.length,
      pubpaidWithdrawals: pubpaidWithdrawals.length,
      pubpaidWallets: pubpaidWallets.length,
      pubpaidPendingDeposits: pendingPubpaidDeposits.length,
      pubpaidPendingWithdrawals: pendingPubpaidWithdrawals.length
    },
    pendingPubpaidDeposits,
    pendingPubpaidWithdrawals,
    pubpaidWalletBoard,
    updatedAt: new Date().toISOString()
  };
}

async function handleApi(req, res, pathname, searchParams) {
  applyApiCors(req, res);

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (pathname === "/health") {
    return sendJson(res, 200, { ok: true, service: "catalogo-cruzeiro", time: new Date().toISOString() });
  }

  if (req.method === "GET" && pathname === "/api/whatsapp/webhook") {
    const config = getWhatsappChatConfig();
    const mode = String(searchParams.get("hub.mode") || "").trim();
    const token = String(searchParams.get("hub.verify_token") || "").trim();
    const challenge = String(searchParams.get("hub.challenge") || "");

    if (!config.enabled) {
      return sendJson(res, 503, {
        ok: false,
        error: "WhatsApp chat desativado. Defina WHATSAPP_CHAT_ENABLED=true para habilitar."
      });
    }

    if (!config.verifyToken) {
      return sendJson(res, 500, {
        ok: false,
        error: "WHATSAPP_WEBHOOK_VERIFY_TOKEN nao configurado."
      });
    }

    if (mode === "subscribe" && token === config.verifyToken) {
      return sendText(res, 200, challenge || "ok");
    }

    return sendJson(res, 403, { ok: false, error: "Falha na verificacao do webhook do WhatsApp." });
  }

  if (req.method === "POST" && pathname === "/api/whatsapp/webhook") {
    const config = getWhatsappChatConfig();
    const body = await parseBody(req);

    if (!config.enabled) {
      return sendJson(res, 503, {
        ok: false,
        error: "WhatsApp chat desativado. Defina WHATSAPP_CHAT_ENABLED=true para habilitar."
      });
    }

    const inboundItems = extractWhatsappInboundMessages(body);
    const createdAt = new Date().toISOString();
    const logItems = inboundItems.map((item) => ({
      id: item.id,
      channel: "whatsapp",
      direction: "inbound",
      from: item.from,
      profileName: item.profileName,
      type: item.type,
      text: item.text,
      receivedAt: item.rawTimestamp || createdAt,
      createdAt,
      phoneNumberId: item.phoneNumberId,
      displayPhoneNumber: item.displayPhoneNumber
    }));

    appendWhatsappChatLog(logItems);

    if (config.autoReplyEnabled && config.autoReplyText) {
      for (const item of inboundItems) {
        if (!item.from || !item.text) continue;
        try {
          const sendResult = await sendWhatsappTextMessage(item.from, config.autoReplyText);
          if (sendResult?.ok) {
            appendWhatsappChatLog([
              {
                id: `out-${Date.now()}-${item.from}`,
                channel: "whatsapp",
                direction: "outbound",
                to: item.from,
                type: "text",
                text: config.autoReplyText,
                createdAt: new Date().toISOString()
              }
            ]);
          }
        } catch (error) {
          console.warn(`[whatsapp-chat] falha ao responder ${item.from}: ${error.message}`);
        }
      }
    }

    return sendJson(res, 200, {
      ok: true,
      received: inboundItems.length
    });
  }

  if (req.method === "GET" && pathname === "/api/admin/storage-health") {
    if (!requireAdmin(req)) {
      return sendJson(res, 401, { ok: false, error: "Acesso administrativo obrigatorio." });
    }

    return sendJson(res, 200, buildStorageHealthPayload({ writeProbe: true }));
  }

  if (req.method === "GET" && pathname === "/api/auth/config") {
    return sendJson(res, 200, {
      ok: true,
      enabled: isCatalogoGoogleAuthEnabled(),
      provider: "google",
      clientId: isCatalogoGoogleAuthEnabled() ? GOOGLE_AUTH_CLIENT_ID : "",
      requiredFor: ["newsletter", "fundadores", "pubpaid", "pagamentos"]
    });
  }

  if (req.method === "GET" && pathname === "/api/auth/session") {
    return sendJson(res, 200, {
      ok: true,
      enabled: isCatalogoGoogleAuthEnabled(),
      user: publicAuthUser(readCatalogoAuthSession(req))
    });
  }

  if (req.method === "POST" && pathname === "/api/auth/google") {
    const body = await parseBody(req);
    try {
      const user = await verifyGoogleIdToken(body.credential || body.idToken || body.token);
      setCatalogoAuthCookie(req, res, user);
      return sendJson(res, 200, {
        ok: true,
        user: publicAuthUser(user)
      });
    } catch (error) {
      return sendJson(res, 401, {
        ok: false,
        error: String(error?.message || "Login Google nao foi validado.")
      });
    }
  }

  if (req.method === "POST" && pathname === "/api/auth/logout") {
    clearCatalogoAuthCookie(req, res);
    return sendJson(res, 200, { ok: true });
  }

  if (req.method === "GET" && pathname === "/api/sprites-check") {
    if (!requireSpriteCheckAccess(req)) {
      return sendJson(res, 401, { ok: false, error: "Senha do CHECKPUBPAID obrigatoria." });
    }

    return sendJson(res, 200, buildSpriteCheckPayload());
  }

  if (req.method === "POST" && pathname === "/api/sprites-check/review") {
    const body = await parseBody(req);
    if (!requireSpriteCheckAccess(req, body)) {
      return sendJson(res, 401, { ok: false, error: "Senha do CHECKPUBPAID obrigatoria." });
    }

    const id = cleanShortText(body.id, 500);
    const status = normalizeSpriteReviewStatus(body.status);
    const note = cleanShortText(body.note || "", 500);
    if (!id) {
      return sendJson(res, 400, { ok: false, error: "Informe o id do sprite." });
    }

    const reviews = readJson(SPRITE_CHECK_REVIEWS_FILE, {});
    const nextReviews = reviews && typeof reviews === "object" && !Array.isArray(reviews) ? reviews : {};
    nextReviews[id] = {
      id,
      status,
      note,
      reviewedBy: hasFullAdminPassword(getAuthValue(req, body)) ? "Full Admin" : "CHECKPUBPAID",
      reviewedAt: new Date().toISOString()
    };
    writeJson(SPRITE_CHECK_REVIEWS_FILE, nextReviews);

    return sendJson(res, 200, { ok: true, item: nextReviews[id], summary: buildSpriteCheckPayload().summary });
  }

  if (req.method === "GET" && pathname === "/api/office-orders") {
    if (!requireFullAdminOrderAccess(req)) {
      return sendJson(res, 401, { ok: false, error: "Acesso restrito ao Full Admin." });
    }

    return sendJson(res, 200, buildOfficeOrderPayload());
  }

  if (req.method === "POST" && pathname === "/api/office-orders") {
    const body = await parseBody(req);
    if (!requireFullAdminOrderAccess(req, body)) {
      return sendJson(res, 401, { ok: false, error: "Acesso restrito ao Full Admin." });
    }

    const message = cleanShortText(body.message || body.order || body.text, 1200);
    if (!message) {
      return sendJson(res, 400, { ok: false, error: "Escreva a ordem antes de enviar." });
    }

    const target = cleanShortText(body.target || "Codex CEO", 80);
    const priority = cleanShortText(body.priority || "normal", 40);
    const ceoReply =
      `Recebido, Full Admin. Vou transformar essa ordem em fila para ${target}, cobrar retorno pela hierarquia e registrar o status aqui.`;
    const order = {
      id: createRecordId("ord"),
      from: "Full Admin",
      to: target,
      priority,
      message,
      ceoReply,
      status: "recebida",
      hierarchy: "Full Admin -> Codex CEO -> equipes",
      createdAt: new Date().toISOString(),
      assignedAgents: 0,
      assignments: [],
      executionSummary: {
        delivered: 0,
        failed: 0,
        running: 0
      }
    };
    appendOfficeOrder(order);

    return sendJson(res, 201, { ok: true, order, ceoReply, ...buildOfficeOrderPayload() });
  }

  if (req.method === "POST" && pathname === "/api/office-orders/review") {
    const body = await parseBody(req);
    if (!requireFullAdminOrderAccess(req, body)) {
      return sendJson(res, 401, { ok: false, error: "Acesso restrito ao Full Admin." });
    }
    const result = reviewOfficeOrder(body);
    if (!result.ok) return sendJson(res, result.status || 400, result);
    return sendJson(res, 200, { ok: true, ...result, ...buildOfficeOrderPayload() });
  }

  if (req.method === "POST" && pathname === "/api/real-agents/actions/review") {
    const body = await parseBody(req);
    if (!requireFullAdminOrderAccess(req, body)) {
      return sendJson(res, 401, { ok: false, error: "Acesso restrito ao Full Admin." });
    }
    const result = reviewRealAgentAction(body);
    if (!result.ok) return sendJson(res, result.status || 400, result);
    return sendJson(res, 200, result);
  }

  if (req.method === "GET" && pathname === "/api/office-neural-growth") {
    return sendJson(res, 200, buildNeuralGrowthPayload());
  }

  if (req.method === "GET" && pathname === "/api/real-agents") {
    const payload = buildRealAgentsPayload();
    if (!payload.ok) {
      return sendJson(res, 404, {
        ok: false,
        error: "Agentes reais ainda nao foram gerados. Rode npm run agents:run ou use POST /api/real-agents/run."
      });
    }

    return sendJson(res, 200, payload);
  }

  if (req.method === "POST" && pathname === "/api/real-agents/run") {
    const body = await parseBody(req);
    if (!requireFullAdminOrderAccess(req, body)) {
      return sendJson(res, 401, { ok: false, error: "Acesso restrito ao Full Admin." });
    }

    const result = runRealAgentsRuntime({ trigger: "manual-painel" });
    if (!result.ok) {
      return sendJson(res, 500, result);
    }

    appendOfficeOrder({
      id: createRecordId("ord"),
      from: "Full Admin",
      to: "Codex CEO + agentes reais",
      priority: cleanShortText(body.priority || "alta", 40),
      message: cleanShortText(body.message || "Rodada operacional dos agentes reais renovada pelo painel.", 1200),
      ceoReply: "Rodada renovada. Os agentes reais atualizaram fila, monitoramento e ideias em cima do jornal atual.",
      status: "rodada-real-agents-gerada",
      hierarchy: "Full Admin -> Codex CEO -> 181 agentes reais",
      createdAt: new Date().toISOString()
    });

    return sendJson(res, 201, { ok: true, ...result.payload });
  }

  if (req.method === "GET" && pathname === "/api/cheffe-call") {
    return sendJson(res, 200, buildCheffeCallPayload());
  }

  if (req.method === "GET" && pathname === "/api/cheffe-call/prompts") {
    const payload = readJson(CHEFFE_CALL_PROMPTS_FILE, null);
    if (!payload) {
      return sendJson(res, 404, { ok: false, error: "Arquivo de prompts da Cheffe Call nao encontrado." });
    }
    return sendJson(res, 200, { ok: true, ...payload });
  }

  if (req.method === "POST" && pathname === "/api/cheffe-call/start") {
    const body = await parseBody(req);
    if (!requireFullAdminOrderAccess(req, body)) {
      return sendJson(res, 401, { ok: false, error: "Acesso restrito ao Full Admin." });
    }

    return sendJson(res, 201, startCheffeCallSession(body));
  }

  if (req.method === "POST" && pathname === "/api/cheffe-call/action") {
    const body = await parseBody(req);
    if (!requireFullAdminOrderAccess(req, body)) {
      return sendJson(res, 401, { ok: false, error: "Acesso restrito ao Full Admin." });
    }

    const result = applyCheffeCallAction(body);
    if (!result.ok) {
      return sendJson(res, result.status || 400, result);
    }
    return sendJson(res, 200, result.payload);
  }

  if (req.method === "POST" && pathname === "/api/cheffe-call/release") {
    const body = await parseBody(req);
    if (!requireFullAdminOrderAccess(req, body)) {
      return sendJson(res, 401, { ok: false, error: "Acesso restrito ao Full Admin." });
    }

    const state = readCheffeCallState();
    writeCheffeCallState({
      ...state,
      active: false,
      releasedAt: new Date().toISOString()
    });
    return sendJson(res, 200, buildCheffeCallPayload());
  }

  if (req.method === "POST" && pathname === "/api/office-neural-growth/pulse") {
    const body = await parseBody(req);
    if (!requireFullAdminOrderAccess(req, body)) {
      return sendJson(res, 401, { ok: false, error: "Acesso restrito ao Full Admin." });
    }

    const payload = recordNeuralGrowthPulse(body);
    return sendJson(res, 201, payload);
  }

  if (req.method === "GET" && pathname === "/api/pubpaid-sprite-scout") {
    return sendJson(res, 200, buildPubPaidSpriteScoutPayload());
  }

  if (req.method === "POST" && pathname === "/api/pubpaid-sprite-scout/order") {
    const body = await parseBody(req);
    if (!requireFullAdminOrderAccess(req, body)) {
      return sendJson(res, 401, { ok: false, error: "Acesso restrito ao Full Admin." });
    }

    const order = recordPubPaidSpriteScoutOrder(body);
    return sendJson(res, 201, { ok: true, order, ...buildPubPaidSpriteScoutPayload() });
  }

  if (req.method === "GET" && pathname === "/api/news/aggregator") {
    const limit = Number(searchParams.get("limit") || 30);
    return sendJson(res, 200, { items: getNews(Math.max(1, Math.min(200, limit))) });
  }

  if (req.method === "GET" && pathname === "/api/news") {
    const limit = Number(searchParams.get("limit") || 60);
    const items = getArticleNews(Math.max(1, Math.min(500, limit)));
    return sendJson(res, 200, { ok: true, total: items.length, items });
  }

  if (req.method === "GET" && pathname === "/api/news/archive") {
    const limit = Number(searchParams.get("limit") || 500);
    const items = getNewsArchive(limit);
    return sendJson(res, 200, { ok: true, total: items.length, items });
  }

  if (req.method === "GET" && pathname === "/api/community/reports") {
    const limit = Number(searchParams.get("limit") || 8);
    return sendJson(res, 200, getCommunityReportsPayload(limit));
  }

  if (req.method === "POST" && pathname === "/api/community/reports") {
    const body = await parseBody(req);
    const result = recordCommunityReport(body, req);
    return sendJson(res, result.status || 201, result);
  }

  if (req.method === "GET" && pathname === "/api/topic-feed") {
    const topic = searchParams.get("topic") || "";
    const limit = Number(searchParams.get("limit") || 12);
    const payload = await getTopicFeed(topic, limit);

    if (!payload?.ok) {
      return sendJson(res, 404, {
        ok: false,
        error: "topico_nao_encontrado",
        availableTopics: Object.keys(TOPIC_FEED_CONFIG)
      });
    }

    return sendJson(res, 200, {
      ok: true,
      topic: payload.topic,
      updatedAt: payload.updatedAt,
      total: Array.isArray(payload.items) ? payload.items.length : 0,
      items: Array.isArray(payload.items) ? payload.items : [],
      reports: Array.isArray(payload.reports) ? payload.reports : [],
      fallbackUsed: Boolean(payload.fallbackUsed),
      stale: Boolean(payload.stale)
    });
  }

  if (req.method === "GET" && pathname === "/api/news/suggestions") {
    const limit = Number(searchParams.get("limit") || 80);
    const query = searchParams.get("q") || "";
    const items = getNewsSuggestions(query, limit);
    return sendJson(res, 200, { ok: true, total: items.length, items });
  }

  if (req.method === "GET" && pathname === "/api/elections/acre") {
    const scopeParam = normalizeText(searchParams.get("scope") || "");
    const electionConfig = getElectionConfig();
    const offices = Array.isArray(electionConfig.offices)
      ? electionConfig.offices.filter((office) => {
          if (!scopeParam || scopeParam === "todos" || scopeParam === "all") {
            return true;
          }
          return normalizeText(office.scope) === scopeParam;
        })
      : [];

    return sendJson(res, 200, {
      ok: true,
      scope: scopeParam || "all",
      updatedAt: electionConfig.updatedAt || "",
      summary: electionConfig.sourceNote || "",
      polling: electionConfig.polling || null,
      offices
    });
  }

  if (req.method === "GET" && pathname === "/api/elections/votes") {
    const voterId = searchParams.get("voterId") || "";
    return sendJson(res, 200, { ok: true, ...getElectionPublicSnapshot(voterId) });
  }

  if (req.method === "POST" && pathname === "/api/elections/votes") {
    const body = await parseBody(req);
    const result = recordElectionVote(body, req);
    return sendJson(res, result.status || 200, result);
  }

  if (req.method === "POST" && pathname === "/api/analytics/visit") {
    const body = await parseBody(req);
    const tracking = buildTrackingMeta(req, body);
    const visits = getJsonArray(VISITS_FILE);
    const visitorId = tracking.visitorId || tracking.cookieVisitorId || createRecordId("visitor");
    const sessionId = tracking.sessionId || tracking.cookieSessionId || createRecordId("session");
    const visit = {
      id: createRecordId("visit"),
      visitorId,
      sessionId,
      cookieVisitorId: tracking.cookieVisitorId,
      cookieSessionId: tracking.cookieSessionId,
      pagePath: tracking.pagePath,
      pageTitle: tracking.pageTitle,
      referrer: tracking.referrer,
      city: tracking.city,
      country: tracking.country,
      ip: tracking.ip,
      browser: tracking.browser,
      deviceType: tracking.deviceType,
      language: tracking.language,
      timezone: tracking.timezone,
      screen: tracking.screen,
      viewport: tracking.viewport,
      platform: tracking.platform,
      trackingConsent: tracking.trackingConsent,
      trackingMethod: tracking.trackingMethod,
      consentSource: tracking.consentSource,
      cookiesEnabled: tracking.cookiesEnabled,
      storageEnabled: tracking.storageEnabled,
      utmSource: tracking.utmSource,
      utmMedium: tracking.utmMedium,
      utmCampaign: tracking.utmCampaign,
      utmContent: tracking.utmContent,
      utmTerm: tracking.utmTerm,
      at: new Date().toISOString()
    };
    visits.push(visit);
    writeJson(VISITS_FILE, visits);

    return sendJson(res, 201, {
      ok: true,
      visitId: visit.id,
      sessionId: visit.sessionId,
      visitorId: visit.visitorId
    });
  }

  if (req.method === "POST" && pathname === "/api/analytics/heartbeat") {
    const body = await parseBody(req);
    const tracking = buildTrackingMeta(req, body);
    const sessionId = tracking.sessionId || tracking.cookieSessionId;
    const visitorId = tracking.visitorId || tracking.cookieVisitorId;
    const durationSec = Math.max(0, Number(body.durationSec || 0));

    if (!sessionId || !visitorId || !durationSec) {
      return sendJson(res, 400, {
        ok: false,
        error: "sessionId, visitorId e durationSec são obrigatórios."
      });
    }

    const heartbeats = getJsonArray(HEARTBEATS_FILE);
    heartbeats.push({
      id: createRecordId("hb"),
      sessionId,
      visitorId,
      pagePath: tracking.pagePath,
      pageTitle: tracking.pageTitle,
      durationSec: Math.min(durationSec, 600),
      at: new Date().toISOString()
    });
    writeJson(HEARTBEATS_FILE, heartbeats);

    return sendJson(res, 201, { ok: true });
  }

  if (req.method === "GET" && pathname.startsWith("/api/news/")) {
    const slug = decodeURIComponent(pathname.replace("/api/news/", ""));
    const item = getArticleBySlug(slug);

    if (!item) {
      return sendJson(res, 404, { ok: false, message: "Noticia nao encontrada." });
    }

    return sendJson(res, 200, { ok: true, item });
  }

  if (req.method === "GET" && pathname === "/api/catalog/businesses") {
    const city = searchParams.get("city");
    return sendJson(res, 200, { items: getBusinesses(city) });
  }

  if (req.method === "GET" && pathname === "/api/ninjas/opportunities") {
    return sendJson(res, 200, { ok: true, ...buildNinjasOpportunityPayload() });
  }

  if (req.method === "GET" && pathname === "/api/ninjas/pix") {
    if (!hasPixKeyConfigured()) {
      return sendJson(res, 503, {
        ok: false,
        error: "Pagamento Pix indisponivel no momento."
      });
    }

    const amount = searchParams.get("amount") || NINJAS_PIX_DEFAULT_AMOUNT;
    const txid = searchParams.get("txid") || "";
    const description = searchParams.get("description") || searchParams.get("label") || "Ninjas Cruzeiro";
    const payload = await buildNinjasPixConfig({ amount, txid, description });
    return sendJson(res, 200, { ok: true, ...payload });
  }

  if (req.method === "POST" && pathname === "/api/ninjas/requests") {
    const body = await parseBody(req);
    const requests = readJson(NINJAS_REQUESTS_FILE, []);
    const service = cleanShortText(body.service || body.requestTitle || body.requestType, 140);
    const phone = cleanPhone(body.phone || body.whatsapp || body.contactPhone);

    if (!service || !phone) {
      return sendJson(res, 400, {
        ok: false,
        error: "Informe pelo menos o servico desejado e um telefone para contato."
      });
    }

    const paymentAmount = NINJAS_PIX_DEFAULT_AMOUNT;

    if (!hasPixKeyConfigured()) {
      return sendJson(res, 503, {
        ok: false,
        error: "Pedidos pagos estao indisponiveis ate configurar a chave Pix."
      });
    }

    const paymentTxid =
      normalizePixToken(body.paymentTxid || body.txid || `NJSREQ${Date.now()}`, 25) || `NJSREQ${Date.now()}`;
    const nextItem = {
      id: createRecordId("njr"),
      type: "pedido-servico",
      name: cleanShortText(body.name || "Cliente local", 80),
      phone,
      email: cleanEmail(body.email),
      neighborhood: cleanShortText(body.neighborhood || body.bairro, 80),
      city: cleanShortText(body.city || "Cruzeiro do Sul - AC", 80),
      service,
      details: cleanShortText(body.details || body.description, 1200),
      budget: cleanShortText(body.budget, 40),
      urgency: cleanShortText(body.urgency || "normal", 40),
      availability: cleanShortText(body.availability, 120),
      status: "aguardando-confirmacao-pix",
      payment: {
        amount: paymentAmount,
        method: "pix-qr-code",
        keyVisible: false,
        txid: paymentTxid,
        status: "pendente-manual",
        confirmationMode: "manual"
      },
      createdAt: new Date().toISOString()
    };

    const next = Array.isArray(requests) ? requests : [];
    next.push(nextItem);
    writeJson(NINJAS_REQUESTS_FILE, next);

    return sendJson(res, 201, {
      ok: true,
      item: nextItem,
      message: "Pedido recebido. Agora o Pix de R$ 5,00 precisa ser confirmado manualmente."
    });
  }

  if (req.method === "POST" && pathname === "/api/ninjas/profiles") {
    const body = await parseBody(req);
    const profiles = readJson(NINJAS_PROFILES_FILE, []);
    const name = cleanShortText(body.name, 80);
    const area = cleanShortText(body.area || body.role || body.profession, 90);

    if (!name || !area) {
      return sendJson(res, 400, {
        ok: false,
        error: "Preencha pelo menos nome e area principal para montar o perfil."
      });
    }

    const rawPlan = normalizeText(body.plan || "gratis");
    const plan =
      rawPlan === "destaque" || rawPlan === "creditos" || rawPlan === "creditos-pro" ? rawPlan : "gratis";
    const paymentAmount = plan === "gratis" ? 0 : Math.max(5, Math.min(100, parseCurrency(body.paymentAmount, 5)));

    if (paymentAmount > 0 && !hasPixKeyConfigured()) {
      return sendJson(res, 503, {
        ok: false,
        error: "Planos pagos estao indisponiveis ate configurar a chave Pix."
      });
    }

    const credits = getNinjasCreditsFromPlan(plan, paymentAmount);
    const paymentTxid = paymentAmount
      ? normalizePixToken(body.paymentTxid || body.txid || `NJSPRO${Date.now()}`, 25) || `NJSPRO${Date.now()}`
      : "";
    const resume = {
      objective: cleanShortText(body.objective, 220),
      summary: cleanShortText(body.summary, 900),
      experience: cleanShortText(body.experience, 1200),
      education: cleanShortText(body.education, 800),
      availability: cleanShortText(body.availability, 160),
      salaryGoal: cleanShortText(body.salaryGoal || body.salary, 80),
      portfolio: cleanShortText(body.portfolio, 240),
      skills: normalizeListInput(body.skills, { maxItems: 14, itemLength: 60 }),
      strengths: normalizeListInput(body.strengths, { maxItems: 10, itemLength: 48 })
    };

    const nextItem = {
      id: createRecordId("njp"),
      type: "perfil-profissional",
      name,
      city: cleanShortText(body.city || "Cruzeiro do Sul - AC", 80),
      phone: cleanPhone(body.phone || body.whatsapp),
      email: cleanEmail(body.email),
      area,
      highlightNote: cleanShortText(body.highlightNote || body.tagline, 140),
      firstJob: Boolean(body.firstJob || body.isFirstJob),
      plan,
      credits,
      status: paymentAmount ? "aguardando-confirmacao-pix" : "perfil-gratuito-recebido",
      payment: {
        amount: paymentAmount,
        method: paymentAmount ? "pix-qr-code" : "none",
        keyVisible: false,
        txid: paymentTxid,
        status: paymentAmount ? "pendente-manual" : "nao-aplicavel",
        confirmationMode: paymentAmount ? "manual" : "none"
      },
      resume,
      createdAt: new Date().toISOString()
    };

    const next = Array.isArray(profiles) ? profiles : [];
    next.push(nextItem);
    writeJson(NINJAS_PROFILES_FILE, next);

    return sendJson(res, 201, {
      ok: true,
      item: nextItem,
      message:
        paymentAmount > 0
          ? "Perfil recebido. O destaque ou pacote sera liberado apos confirmacao manual do Pix."
          : "Curriculo recebido no plano gratuito."
    });
  }

  if (req.method === "GET" && pathname === "/api/sales/listings") {
    const category = searchParams.get("category") || "";
    const limit = Number(searchParams.get("limit") || 80);
    const items = getSalesListings({ category, limit }).map((item) => ({
      id: item.id,
      title: item.title,
      category: item.category,
      categoryLabel: item.categoryLabel,
      price: item.price,
      city: item.city,
      neighborhood: item.neighborhood,
      sellerName: item.sellerName,
      phone: item.phone,
      description: item.description,
      condition: item.condition,
      deliveryMode: item.deliveryMode,
      createdAt: item.createdAt
    }));

    return sendJson(res, 200, {
      ok: true,
      total: items.length,
      updatedAt: new Date().toISOString(),
      items
    });
  }

  if (req.method === "POST" && pathname === "/api/sales/listings") {
    const body = await parseBody(req);
    const title = cleanShortText(body.title || body.item || body.product, 120);
    const phone = cleanPhone(body.phone || body.whatsapp);
    const category = normalizeSalesCategory(body.category || body.type);

    if (!title || !phone) {
      return sendJson(res, 400, {
        ok: false,
        error: "Informe o item que quer vender e um telefone ou WhatsApp para contato."
      });
    }

    const listings = readJson(SALES_LISTINGS_FILE, []);
    const nextItem = {
      id: createRecordId("sale"),
      title,
      category,
      categoryLabel: cleanShortText(body.categoryLabel || body.category || "Outros", 80),
      price: cleanShortText(body.price || body.value || "A combinar", 60),
      condition: cleanShortText(body.condition || "nao informado", 80),
      deliveryMode: cleanShortText(body.deliveryMode || body.delivery || "combinar com vendedor", 120),
      sellerName: cleanShortText(body.sellerName || body.name || "Vendedor local", 90),
      phone,
      city: cleanShortText(body.city || "Cruzeiro do Sul - AC", 90),
      neighborhood: cleanShortText(body.neighborhood || body.bairro, 90),
      description: cleanShortText(body.description || body.details, 1200),
      status: "publicado",
      createdAt: new Date().toISOString()
    };

    const next = Array.isArray(listings) ? listings : [];
    next.push(nextItem);
    writeJson(SALES_LISTINGS_FILE, next);

    return sendJson(res, 201, {
      ok: true,
      item: nextItem,
      message: "Item publicado na lista de vendas."
    });
  }

  if (req.method === "POST" && pathname === "/api/vr-rental/leads") {
    const body = await parseBody(req);
    const tracking = buildTrackingMeta(req, body);
    const name = cleanShortText(body.name || body.customerName, 100);
    const phone = cleanPhone(body.phone || body.whatsapp || body.contactPhone);

    if (!name || !phone) {
      return sendJson(res, 400, {
        ok: false,
        error: "Informe nome e WhatsApp para reservar o aluguel VR."
      });
    }

    const leads = readJson(VR_RENTAL_LEADS_FILE, []);
    const nextItem = {
      id: createRecordId("vr"),
      type: "aluguel-vr",
      name,
      phone,
      email: cleanEmail(body.email),
      rentalDate: cleanShortText(body.date || body.rentalDate || body.eventDate, 40),
      period: cleanShortText(body.period || body.time || "a combinar", 60),
      package: cleanShortText(body.package || body.plan || "experiencia rapida", 100),
      notes: cleanShortText(body.notes || body.message || body.details, 700),
      status: "novo",
      sourcePage: cleanShortText(body.sourcePage || tracking.pagePath || "/games.html", 260),
      visitorId: tracking.visitorId || tracking.cookieVisitorId,
      sessionId: tracking.sessionId || tracking.cookieSessionId,
      city: tracking.city,
      country: tracking.country,
      ip: tracking.ip,
      createdAt: new Date().toISOString()
    };

    const next = Array.isArray(leads) ? leads : [];
    next.push(nextItem);
    writeJson(VR_RENTAL_LEADS_FILE, next);

    return sendJson(res, 201, {
      ok: true,
      item: nextItem,
      message: "Pedido de aluguel VR salvo."
    });
  }

  if (req.method === "GET" && pathname === "/api/pesquisa-acre-2026/summary") {
    return sendJson(res, 200, buildAcre2026PollPublicPayload());
  }

  if (req.method === "GET" && pathname === "/api/news-image-focus-audit") {
    const report = readJson(NEWS_IMAGE_FOCUS_AUDIT_FILE, {});
    const reviewQueue = Array.isArray(report.reviewQueue) ? report.reviewQueue : [];
    const summary = report && typeof report.summary === "object" ? report.summary : {};
    return sendJson(res, 200, {
      ok: true,
      updatedAt: report.updatedAt || "",
      checkedLimit: Number(report.checkedLimit || 0) || 0,
      total: Number(report.total || 0) || 0,
      offline: Boolean(report.offline),
      summary: {
        ok: Number(summary.ok || 0) || 0,
        review: Number(summary.review || 0) || 0,
        warning: Number(summary.warning || 0) || 0,
        error: Number(summary.error || 0) || 0,
        manualFocus: Number(summary.manualFocus || 0) || 0,
        newSinceLastAudit: Number(summary.newSinceLastAudit || 0) || 0,
        missingImage: Number(summary.missingImage || 0) || 0,
        unreachableImage: Number(summary.unreachableImage || 0) || 0
      },
      reviewQueue: reviewQueue.map((item) => ({
        slug: safeString(item.slug || "", 200),
        title: safeString(item.title || "Sem titulo", 220),
        level: safeString(item.level || "review", 24),
        reasons: Array.isArray(item.reasons)
          ? item.reasons.map((reason) => safeString(reason || "", 120)).filter(Boolean)
          : [],
        imageUrl: safeString(item.imageUrl || "", 1000),
        effectiveFocus: safeString(item.effectiveFocus || "", 80),
        articleUrl: item.slug ? `/noticia.html?slug=${encodeURIComponent(item.slug)}` : ""
      }))
    });
  }

  if (req.method === "GET" && pathname === "/api/pesquisa-acre-2026/bridge") {
    return sendJson(res, 200, buildAcre2026PollBridgePayload());
  }

  if (req.method === "GET" && pathname === "/api/pesquisa-acre-2026/me") {
    const authUser = readCatalogoAuthSession(req);
    if (!authUser?.email || !authUser?.sub) {
      return sendJson(res, 200, {
        ok: true,
        authenticated: false,
        alreadyVoted: false,
        weekKey: getWeekBucketKey(new Date().toISOString()),
        user: null,
        vote: null,
        message: "Entre com Google para liberar a participação semanal."
      });
    }

    return sendJson(res, 200, buildAcre2026PollCurrentUserPayload(authUser));
  }

  if (req.method === "POST" && pathname === "/api/pesquisa-acre-2026") {
    const authUser = readCatalogoAuthSession(req);
    if (!authUser?.email || !authUser?.sub) {
      return sendJson(res, 401, {
        ok: false,
        error: "Entre com Google para responder. Isso evita duplicação e libera apenas uma resposta por conta Google a cada semana."
      });
    }

    const body = await parseBody(req);
    const tracking = buildTrackingMeta(req, body);
    const currentWeekKey = getWeekBucketKey(new Date().toISOString());
    const profissao = cleanShortText(body.profissao || body.profession, 100);
    const localizacao = cleanShortText(body.localizacao || body.location, 120);
    const faixaEtaria = normalizePollChoice(
      body.faixaEtaria || body.faixa_etaria || body.ageRange,
      ACRE_2026_POLL_OPTIONS.ageRanges,
      ""
    );
    const votoAnterior = normalizePollChoice(
      body.votoAnterior || body.voto_anterior || body.previousVote,
      ACRE_2026_POLL_OPTIONS.previousVotes,
      ""
    );
    const avaliacaoGoverno = normalizePollChoice(
      body.avaliacaoGoverno || body.avaliacao_governo || body.governmentEvaluation,
      ACRE_2026_POLL_OPTIONS.governmentEvaluation,
      ""
    );
    const direcaoEstado = normalizePollChoice(
      body.direcaoEstado || body.direcao_estado || body.stateDirection,
      ACRE_2026_POLL_OPTIONS.stateDirection,
      ""
    );
    const desejoCiclo = normalizePollChoice(
      body.desejoCiclo || body.desejo_ciclo || body.desiredCycle,
      ACRE_2026_POLL_OPTIONS.desiredCycle,
      ""
    );
    const voto2026 = normalizePollChoice(
      body.voto2026 || body.voto_2026 || body.vote2026,
      ACRE_2026_POLL_OPTIONS.vote2026,
      ""
    );
    const segundaOpcao = normalizePollChoice(
      body.segundaOpcao || body.segunda_opcao || body.secondChoice,
      ACRE_2026_POLL_OPTIONS.secondChoice,
      ""
    );
    const certezaVoto = normalizePollChoice(
      body.certezaVoto || body.certeza_voto || body.voteCertainty,
      ACRE_2026_POLL_OPTIONS.voteCertainty,
      ""
    );
    const rejeicao = normalizePollChoice(
      body.rejeicao || body.rejection,
      ACRE_2026_POLL_OPTIONS.rejection,
      ""
    );
    const prioridade = normalizePollChoice(
      body.prioridade || body.priority,
      ACRE_2026_POLL_OPTIONS.priorities,
      ""
    );
    const atencaoPolitica = normalizePollChoice(
      body.atencaoPolitica || body.atencao_politica || body.politicalAttention,
      ACRE_2026_POLL_OPTIONS.politicalAttention,
      ""
    );
    const fatorDecisivo = normalizePollChoice(
      body.fatorDecisivo || body.fator_decisivo || body.decisionDriver,
      ACRE_2026_POLL_OPTIONS.decisionDriver,
      ""
    );
    const satisfacao = Math.max(0, Math.min(5, Number(body.satisfacao || body.satisfaction || 0)));
    const comentario = safeString(body.comentario || body.comment || "", 1200);

    if (
      !profissao ||
      !localizacao ||
      !faixaEtaria ||
      !votoAnterior ||
      !avaliacaoGoverno ||
      !direcaoEstado ||
      !desejoCiclo ||
      !satisfacao ||
      !voto2026 ||
      !segundaOpcao ||
      !certezaVoto ||
      !rejeicao ||
      !prioridade ||
      !atencaoPolitica ||
      !fatorDecisivo
    ) {
      return sendJson(res, 400, {
        ok: false,
        error: "Preencha todos os campos obrigatorios da pesquisa, incluindo a faixa etaria."
      });
    }

    let mutationResult;
    try {
      mutationResult = await mutateJsonFile(ACRE_2026_POLL_FILE, [], (currentRecords) => {
        const records = Array.isArray(currentRecords) ? currentRecords : [];
        const hasWeeklyGoogleVote = records.some(
          (item) =>
            safeString(item.weekKey || "", 24) === currentWeekKey &&
            (safeString(item.googleSub || "", 160) === safeString(authUser.sub, 160) ||
              safeString(item.googleEmail || "", 160) === safeString(authUser.email, 160))
        );

        if (hasWeeklyGoogleVote) {
          const error = new Error(
            "Este Google já registrou uma resposta nesta semana. Aguarde a próxima rodada para participar de novo."
          );
          error.statusCode = 409;
          throw error;
        }

        const nextItem = {
          id: createRecordId("poll"),
          profissao,
          localizacao,
          faixaEtaria,
          votoAnterior,
          satisfacao,
          avaliacaoGoverno,
          direcaoEstado,
          desejoCiclo,
          voto2026,
          segundaOpcao,
          certezaVoto,
          rejeicao,
          prioridade,
          atencaoPolitica,
          fatorDecisivo,
          comentario,
          sourcePage: cleanShortText(body.sourcePage || tracking.pagePath || "/pesquisa-acre-2026.html", 260),
          pageTitle: cleanShortText(body.pageTitle || tracking.pageTitle || "Enquete de Opiniao Acre 2026", 160),
          visitorId: tracking.visitorId || tracking.cookieVisitorId,
          sessionId: tracking.sessionId || tracking.cookieSessionId,
          city: tracking.city,
          country: tracking.country,
          ip: tracking.ip,
          browser: tracking.browser,
          deviceType: tracking.deviceType,
          referrerHost: tracking.referrerHost,
          googleEmail: safeString(authUser.email, 160),
          googleSub: safeString(authUser.sub, 160),
          weekKey: currentWeekKey,
          createdAt: new Date().toISOString()
        };

        const next = records.slice();
        next.push(nextItem);

        return {
          value: next,
          item: nextItem,
          records: next
        };
      });
    } catch (error) {
      if (error?.statusCode === 409) {
        return sendJson(res, 409, {
          ok: false,
          error: error.message
        });
      }
      throw error;
    }

    return sendJson(res, 201, {
      ok: true,
      item: {
        id: mutationResult.item.id,
        createdAt: mutationResult.item.createdAt
      },
      summary: buildAcre2026PollSummary(sortByDateDesc(mutationResult.records, "createdAt", 5000)),
      message: "Resposta registrada. As parciais da enquete ja foram atualizadas."
    });
  }

  if (req.method === "POST" && pathname === "/api/pesquisa-acre-2026/admin") {
    if (!requireAcre2026PollAdmin(req)) {
      return sendJson(res, 401, {
        ok: false,
        error: "Senha administrativa invalida."
      });
    }

    return sendJson(res, 200, buildAcre2026PollAdminPayload());
  }

  if (req.method === "POST" && pathname === "/api/pesquisa-acre-2026/admin/force-sync") {
    if (!requireAcre2026PollAdmin(req)) {
      return sendJson(res, 401, {
        ok: false,
        error: "Senha administrativa invalida."
      });
    }

    const result = await mutateJsonFile(ACRE_2026_POLL_FILE, [], (currentRecords) => {
      const normalizedRecords = dedupeAcre2026PollRecords(currentRecords);
      return {
        value: normalizedRecords,
        records: normalizedRecords
      };
    });
    const records = Array.isArray(result.records) ? result.records : [];

    return sendJson(res, 200, {
      ok: true,
      forced: true,
      total: records.length,
      summary: buildAcre2026PollSummary(records),
      message: "Votos reais da SPO normalizados e parciais recalculadas."
    });
  }

  if (req.method === "GET" && pathname === "/api/comments") {
    const comments = readJson(path.join(DATA_DIR, "comments.json"), []);
    const items = (Array.isArray(comments) ? comments : []).map((comment) => {
      const message = String(comment.message || comment.text || "").slice(0, 2000);

      return {
        ...comment,
        name: String(comment.name || comment.author || "Leitor").slice(0, 80),
        badge: String(comment.badge || "Leitor local").slice(0, 80),
        message,
        text: message
      };
    });

    return sendJson(res, 200, { items });
  }

  if (req.method === "GET" && pathname === "/api/preview-image") {
    const targetUrl = searchParams.get("url") || "";
    const imageUrl = await fetchPreviewImage(targetUrl);
    if (!imageUrl) {
      return sendJson(res, 404, { ok: false, message: "Imagem nao encontrada." });
    }
    return sendJson(res, 200, { ok: true, imageUrl });
  }

  if (req.method === "POST" && pathname === "/api/comments") {
    const body = await parseBody(req);
    const tracking = buildTrackingMeta(req, body);
    const comments = readJson(path.join(DATA_DIR, "comments.json"), []);
    const message = String(body.message || body.text || "").slice(0, 2000);
    const nextItem = {
      id: `c-${Date.now()}`,
      articleId: String(body.articleId || body.slug || "").trim().slice(0, 180),
      author: String(body.author || body.name || "Leitor").slice(0, 80),
      name: String(body.name || body.author || "Leitor").slice(0, 80),
      badge: String(body.badge || "Leitor local").slice(0, 80),
      message,
      text: message,
      pagePath: tracking.pagePath,
      visitorId: tracking.visitorId || tracking.cookieVisitorId,
      sessionId: tracking.sessionId || tracking.cookieSessionId,
      city: tracking.city,
      country: tracking.country,
      ip: tracking.ip,
      status: "published",
      createdAt: new Date().toISOString(),
    };
    const next = Array.isArray(comments) ? comments : [];
    next.push(nextItem);
    writeJson(path.join(DATA_DIR, "comments.json"), next);
    return sendJson(res, 201, { ok: true, item: nextItem, comment: nextItem });
  }

  if (req.method === "POST" && pathname === "/api/agent-messages") {
    const body = await parseBody(req);
    const messages = readJson(path.join(DATA_DIR, "agent-messages.json"), []);
    const message = String(body.message || "").trim().slice(0, 3000);

    if (!message) {
      return sendJson(res, 400, { ok: false, error: "Mensagem obrigatória." });
    }

    const nextItem = {
      id: `m-${Date.now()}`,
      name: String(body.name || "").trim().slice(0, 80),
      email: String(body.email || "").trim().toLowerCase().slice(0, 120),
      subject: String(body.subject || "Contato pelo Catalogo Cruzeiro do Sul").trim().slice(0, 120),
      recipient: String(body.recipient || "juniorclovisa@gmail.com").trim().slice(0, 120),
      message,
      createdAt: new Date().toISOString()
    };
    const next = Array.isArray(messages) ? messages : [];
    next.push(nextItem);
    writeJson(path.join(DATA_DIR, "agent-messages.json"), next);
    return sendJson(res, 201, { ok: true, item: nextItem });
  }

  if (req.method === "GET" && pathname === "/api/subscriptions") {
    const subs = readJson(path.join(DATA_DIR, "subscriptions.json"), []);
    const items = Array.isArray(subs) ? subs : [];
    const founderItems = items.filter(isConfirmedFounderSubscription);
    const pendingFounderItems = items.filter(isPendingFounderSubscription);
    const founders = founderItems
      .slice()
      .reverse()
      .slice(0, 24)
      .map((item) => ({
        id: String(item.id || ""),
        name: String(item.name || "").slice(0, 100),
        amount: Number(item.amount || 0),
        badge: "Fundador",
        createdAt: item.createdAt || ""
      }));

    return sendJson(res, 200, {
      ok: true,
      totals: {
        subscriptions: items.length,
        founders: founderItems.length,
        pendingFounders: pendingFounderItems.length
      },
      founders
    });
  }

  if (req.method === "GET" && pathname === "/api/subscriptions/pix") {
    const authUser = readCatalogoAuthSession(req);
    if (!authUser) {
      return sendJson(res, 401, {
        ok: false,
        error: "Entre com Google para gerar um QR code de apoio."
      });
    }

    if (!hasPixKeyConfigured()) {
      return sendJson(res, 503, {
        ok: false,
        error: "Pagamento Pix indisponivel no momento."
      });
    }

    const amount = searchParams.get("amount") || 5;
    const txid = searchParams.get("txid") || "";
    const description = searchParams.get("description") || "Apoio Fundador Catalogo";
    const payload = await buildNinjasPixConfig({
      amount,
      txid,
      description,
      minAmount: 1,
      maxAmount: 10,
      defaultAmount: 5
    });
    return sendJson(res, 200, { ok: true, ...payload });
  }

  if (req.method === "GET" && pathname === "/api/pubpaid/deposit/pix") {
    const authUser = readCatalogoAuthSession(req);
    if (!authUser) {
      return sendJson(res, 401, {
        ok: false,
        error: "Entre com Google para gerar o QR code de deposito."
      });
    }

    if (!hasPixKeyConfigured()) {
      return sendJson(res, 503, {
        ok: false,
        error: "Depositos Pix indisponiveis ate configurar a chave Pix."
      });
    }

    const amount = normalizePubpaidAmount(searchParams.get("amount") || 10, 10);
    const txid = searchParams.get("txid") || "";
    const description = searchParams.get("description") || "PubPaid Creditos";
    const payload = await buildNinjasPixConfig({
      amount,
      txid,
      description,
      minAmount: 5,
      maxAmount: 100,
      defaultAmount: 10
    });
    return sendJson(res, 200, { ok: true, ...payload, user: publicAuthUser(authUser) });
  }

  if (req.method === "GET" && pathname === "/api/pubpaid/account") {
    const authUser = readCatalogoAuthSession(req);
    if (!authUser) {
      return sendJson(res, 401, {
        ok: false,
        error: "Entre com Google para abrir a carteira do PubPaid."
      });
    }

    return sendJson(res, 200, buildPubpaidAccountPayload(authUser));
  }

  if (req.method === "GET" && pathname === "/api/pubpaid/pvp/state") {
    const authUser = readCatalogoAuthSession(req);
    if (!authUser) {
      return sendJson(res, 401, { ok: false, error: "Entre com Google para abrir a fila PvP." });
    }
    const gameId = normalizePubpaidPvpGameId(searchParams.get("gameId"));
    if (!gameId) {
      return sendJson(res, 400, { ok: false, error: "Mesa PvP ainda nao liberada para esse jogo." });
    }
    const store = writePubpaidPvpStore(cleanupPubpaidPvpStore(readPubpaidPvpStore()));
    return sendJson(res, 200, buildPubpaidPvpStatePayload(store, authUser, gameId));
  }

  if (req.method === "POST" && pathname === "/api/pubpaid/pvp/join") {
    const authUser = readCatalogoAuthSession(req);
    if (!authUser) {
      return sendJson(res, 401, { ok: false, error: "Entre com Google para entrar na fila PvP." });
    }
    const body = await parseBody(req);
    const gameId = normalizePubpaidPvpGameId(body.gameId);
    if (!gameId) {
      return sendJson(res, 400, { ok: false, error: "Mesa PvP ainda nao liberada para esse jogo." });
    }
    const stake = normalizePubpaidAmount(body.stake, 10);
    const walletKey = getPubpaidWalletKey(authUser);
    let store = cleanupPubpaidPvpStore(readPubpaidPvpStore());
    const previousWaiting = store.waiting.filter((entry) => entry?.player?.walletKey === walletKey);
    previousWaiting.forEach((entry) => {
      if (entry?.escrow?.status === "locked") {
        releasePubpaidMatchEscrow(entry.player, entry.stake);
      }
    });
    store.waiting = store.waiting.filter((entry) => entry?.player?.walletKey !== walletKey);
    const existingMatch = store.matches.find((entry) =>
      entry?.gameId === gameId &&
      ["active", "abandoned"].includes(entry?.status) &&
      [entry?.playerOne?.walletKey, entry?.playerTwo?.walletKey].includes(walletKey)
    );
    if (existingMatch) {
      if (existingMatch.status === "abandoned" && existingMatch.abandonedBy) {
        existingMatch.status = "active";
        existingMatch.abandonedBy = "";
        existingMatch.deadlineAt = "";
        existingMatch.resultSummary = "Jogador reconectou antes dos 60 segundos. A mesa voltou ao estado ativo.";
        existingMatch.updatedAt = new Date().toISOString();
      }
      store = writePubpaidPvpStore(store);
      return sendJson(res, 200, buildPubpaidPvpStatePayload(store, authUser, gameId));
    }

    const player = createPubpaidPvpPlayer(authUser, body.profile || {});
    const lockResult = lockPubpaidMatchEscrow(player, stake);
    if (!lockResult.ok) {
      return sendJson(res, 402, { ok: false, error: lockResult.error });
    }
    const rivalWaiting = store.waiting.find((entry) =>
      entry?.gameId === gameId &&
      clampInteger(entry?.stake) === stake &&
      entry?.player?.walletKey !== walletKey
    );

    if (rivalWaiting) {
      if (rivalWaiting?.escrow?.status !== "locked") {
        const rivalLock = lockPubpaidMatchEscrow(rivalWaiting.player, stake);
        if (!rivalLock.ok) {
          releasePubpaidMatchEscrow(player, stake);
          store.waiting = store.waiting.filter((entry) => entry.id !== rivalWaiting.id);
          store = writePubpaidPvpStore(store);
          return sendJson(res, 409, { ok: false, error: "Rival saiu da mesa porque nao havia escrow disponivel." });
        }
      }
      store.waiting = store.waiting.filter((entry) => entry.id !== rivalWaiting.id);
      store.matches.push(createPubpaidPvpMatch(gameId, stake, rivalWaiting.player, player));
    } else {
      store.waiting.push({
        id: createRecordId("pvpw"),
        gameId,
        stake,
        createdAt: new Date().toISOString(),
        player,
        escrow: {
          status: "locked",
          amount: stake,
          lockedAt: new Date().toISOString(),
        },
      });
    }

    store = writePubpaidPvpStore(store);
    return sendJson(res, 200, buildPubpaidPvpStatePayload(store, authUser, gameId));
  }

  if (req.method === "POST" && pathname === "/api/pubpaid/pvp/leave") {
    const authUser = readCatalogoAuthSession(req);
    if (!authUser) {
      return sendJson(res, 401, { ok: false, error: "Entre com Google para sair da fila PvP." });
    }
    const body = await parseBody(req);
    const gameId = normalizePubpaidPvpGameId(body.gameId);
    if (!gameId) {
      return sendJson(res, 400, { ok: false, error: "Mesa PvP ainda nao liberada para esse jogo." });
    }
    const walletKey = getPubpaidWalletKey(authUser);
    let store = cleanupPubpaidPvpStore(readPubpaidPvpStore());
    store.waiting
      .filter((entry) => entry?.gameId === gameId && entry?.player?.walletKey === walletKey && entry?.escrow?.status === "locked")
      .forEach((entry) => releasePubpaidMatchEscrow(entry.player, entry.stake));
    store.waiting = store.waiting.filter((entry) => !(entry?.gameId === gameId && entry?.player?.walletKey === walletKey));
    store.matches = store.matches.map((entry) => {
      if (entry?.gameId !== gameId || entry?.status !== "active") return entry;
      const isPlayerOne = entry?.playerOne?.walletKey === walletKey;
      const isPlayerTwo = entry?.playerTwo?.walletKey === walletKey;
      if (!isPlayerOne && !isPlayerTwo) return entry;
      const abandonedBy = isPlayerOne ? "playerOne" : "playerTwo";
      return {
        ...entry,
        status: "abandoned",
        abandonedBy,
        deadlineAt: new Date(Date.now() + PUBPAID_PVP_ABANDON_MS).toISOString(),
        resultSummary: isPlayerOne
          ? `${entry?.playerOne?.name || "Jogador"} saiu da mesa. Tem 60 segundos para voltar antes de perder por abandono.`
          : `${entry?.playerTwo?.name || "Jogador"} saiu da mesa. Tem 60 segundos para voltar antes de perder por abandono.`,
        updatedAt: new Date().toISOString(),
      };
    });
    store = writePubpaidPvpStore(store);
    return sendJson(res, 200, buildPubpaidPvpStatePayload(store, authUser, gameId));
  }

  if (req.method === "POST" && pathname === "/api/pubpaid/pvp/checkers/move") {
    const authUser = readCatalogoAuthSession(req);
    if (!authUser) {
      return sendJson(res, 401, { ok: false, error: "Entre com Google para jogar a mesa PvP." });
    }
    const body = await parseBody(req);
    const matchId = cleanShortText(body.matchId || "", 120);
    if (!matchId) {
      return sendJson(res, 400, { ok: false, error: "Informe a mesa PvP." });
    }
    let store = cleanupPubpaidPvpStore(readPubpaidPvpStore());
    const matchIndex = store.matches.findIndex((entry) => entry?.id === matchId && entry?.gameId === "checkers");
    if (matchIndex < 0) {
      return sendJson(res, 404, { ok: false, error: "Mesa PvP nao encontrada." });
    }
    const match = store.matches[matchIndex];
    const walletKey = getPubpaidWalletKey(authUser);
    const seat = match?.playerOne?.walletKey === walletKey ? "playerOne" : match?.playerTwo?.walletKey === walletKey ? "playerTwo" : "";
    if (!seat) {
      return sendJson(res, 403, { ok: false, error: "Essa mesa pertence a outros jogadores." });
    }
    if (match.status !== "active") {
      return sendJson(res, 400, { ok: false, error: "Essa mesa PvP nao esta mais ativa." });
    }
    if (match.turn !== seat) {
      return sendJson(res, 409, { ok: false, error: "Espere a vez do outro jogador." });
    }

    const move = body.move || {};
    const board = Array.isArray(match.board) ? match.board : createCheckersPvPBoard();
    const validMoves = getAllPvpCheckersMoves(board, seat);
    const chosenMove = validMoves.find((entry) =>
      clampInteger(entry?.from?.row, -1) === clampInteger(move?.from?.row, -1) &&
      clampInteger(entry?.from?.col, -1) === clampInteger(move?.from?.col, -1) &&
      clampInteger(entry?.to?.row, -1) === clampInteger(move?.to?.row, -1) &&
      clampInteger(entry?.to?.col, -1) === clampInteger(move?.to?.col, -1)
    );
    if (!chosenMove) {
      return sendJson(res, 400, { ok: false, error: "Jogada invalida para o tabuleiro atual." });
    }

    let nextBoard = applyPvpCheckersMove(board, chosenMove);
    let nextTurn = seat === "playerOne" ? "playerTwo" : "playerOne";
    let resultSummary = "";
    let winner = getPvpCheckersOutcome(nextBoard);
    if (!winner && chosenMove.capture) {
      const followCaptures = getMovesForPvpCheckersPiece(nextBoard, chosenMove.to.row, chosenMove.to.col).filter((entry) => entry.capture);
      if (followCaptures.length) {
        nextTurn = seat;
        resultSummary = "A captura continua com a mesma peca.";
      }
    }
    if (!winner && !resultSummary) {
      resultSummary = nextTurn === "playerOne"
        ? `${match?.playerOne?.name || "Jogador 1"} pensa a resposta.`
        : `${match?.playerTwo?.name || "Jogador 2"} pensa a resposta.`;
    }
    const finished = Boolean(winner);
    if (winner) {
      resultSummary =
        winner === "playerOne"
          ? `${match?.playerOne?.name || "Jogador 1"} fechou a mesa de damas.`
          : `${match?.playerTwo?.name || "Jogador 2"} fechou a mesa de damas.`;
    }

    store.matches[matchIndex] = {
      ...match,
      board: nextBoard,
      turn: nextTurn,
      winner: winner || "",
      resultSummary,
      moveCount: clampInteger(match.moveCount) + 1,
      status: finished ? "finished" : "active",
      finishedAt: finished ? new Date().toISOString() : "",
      updatedAt: new Date().toISOString(),
    };
    store = writePubpaidPvpStore(store);
    return sendJson(res, 200, buildPubpaidPvpStatePayload(store, authUser, "checkers"));
  }

  if (req.method === "POST" && pathname === "/api/pubpaid/pvp/cards21/action") {
    const authUser = readCatalogoAuthSession(req);
    if (!authUser) {
      return sendJson(res, 401, { ok: false, error: "Entre com Google para jogar a mesa PvP." });
    }
    const body = await parseBody(req);
    const matchId = cleanShortText(body.matchId || "", 120);
    const action = cleanShortText(body.action || "", 20).toLowerCase();
    if (!matchId) {
      return sendJson(res, 400, { ok: false, error: "Informe a mesa PvP." });
    }
    if (!["hit", "stand"].includes(action)) {
      return sendJson(res, 400, { ok: false, error: "Acao invalida para a mesa do 21." });
    }

    let store = cleanupPubpaidPvpStore(readPubpaidPvpStore());
    const matchIndex = store.matches.findIndex((entry) => entry?.id === matchId && entry?.gameId === "cards21");
    if (matchIndex < 0) {
      return sendJson(res, 404, { ok: false, error: "Mesa PvP nao encontrada." });
    }
    const match = store.matches[matchIndex];
    const walletKey = getPubpaidWalletKey(authUser);
    const seat = match?.playerOne?.walletKey === walletKey ? "playerOne" : match?.playerTwo?.walletKey === walletKey ? "playerTwo" : "";
    if (!seat) {
      return sendJson(res, 403, { ok: false, error: "Essa mesa pertence a outros jogadores." });
    }
    if (match.status !== "active") {
      return sendJson(res, 400, { ok: false, error: "Essa mesa PvP nao esta mais ativa." });
    }
    if (match.turn !== seat) {
      return sendJson(res, 409, { ok: false, error: "Espere a vez do outro jogador." });
    }

    const cardsState = match?.cardsState || createCards21PvPState();
    const stateKey = getCards21SeatStateKey(seat);
    const cardsKey = getCards21SeatCardsKey(seat);
    const rivalSeat = seat === "playerOne" ? "playerTwo" : "playerOne";
    const rivalStateKey = getCards21SeatStateKey(rivalSeat);
    if (!stateKey || !cardsKey || cardsState[stateKey] !== "active") {
      return sendJson(res, 400, { ok: false, error: "Sua mao nessa mesa ja foi encerrada." });
    }

    let resultSummary = "";
    let winner = "";
    let finished = false;

    if (action === "hit") {
      cardsState[cardsKey] = [...(Array.isArray(cardsState[cardsKey]) ? cardsState[cardsKey] : []), drawPubpaid21Card(cardsState)];
      const total = sumPubpaid21Cards(cardsState[cardsKey]);
      if (total > 21) {
        cardsState[stateKey] = "busted";
        finished = true;
        winner = rivalSeat;
        resultSummary =
          rivalSeat === "playerOne"
            ? `${match?.playerTwo?.name || "Jogador 2"} estourou em ${total}. ${match?.playerOne?.name || "Jogador 1"} levou a mesa do 21.`
            : `${match?.playerOne?.name || "Jogador 1"} estourou em ${total}. ${match?.playerTwo?.name || "Jogador 2"} levou a mesa do 21.`;
      } else if (total === 21) {
        cardsState[stateKey] = "stood";
        resultSummary = `${seat === "playerOne" ? match?.playerOne?.name || "Jogador 1" : match?.playerTwo?.name || "Jogador 2"} travou em 21 e passou a vez.`;
      } else {
        resultSummary = `${seat === "playerOne" ? match?.playerOne?.name || "Jogador 1" : match?.playerTwo?.name || "Jogador 2"} comprou e foi para ${total}.`;
      }
    } else {
      cardsState[stateKey] = "stood";
      resultSummary = `${seat === "playerOne" ? match?.playerOne?.name || "Jogador 1" : match?.playerTwo?.name || "Jogador 2"} parou a mao.`;
    }

    const bothClosed = cardsState.playerOneState !== "active" && cardsState.playerTwoState !== "active";
    if (!finished && bothClosed) {
      const resolution = resolveCards21PvpMatch({ ...match, cardsState });
      finished = true;
      winner = resolution.winner;
      resultSummary = resolution.resultSummary;
    }

    let nextTurn = rivalSeat;
    if (!finished) {
      if (cardsState[rivalStateKey] !== "active") {
        nextTurn = seat;
      }
      resultSummary = `${resultSummary} ${nextTurn === "playerOne" ? match?.playerOne?.name || "Jogador 1" : match?.playerTwo?.name || "Jogador 2"} responde agora.`;
    }

    store.matches[matchIndex] = {
      ...match,
      cardsState,
      turn: nextTurn,
      winner,
      resultSummary,
      moveCount: clampInteger(match.moveCount) + 1,
      status: finished ? "finished" : "active",
      finishedAt: finished ? new Date().toISOString() : "",
      updatedAt: new Date().toISOString(),
    };
    store = writePubpaidPvpStore(store);
    return sendJson(res, 200, buildPubpaidPvpStatePayload(store, authUser, "cards21"));
  }

  if (req.method === "POST" && pathname === "/api/pubpaid/pvp/poker/draw") {
    const authUser = readCatalogoAuthSession(req);
    if (!authUser) {
      return sendJson(res, 401, { ok: false, error: "Entre com Google para jogar a mesa PvP." });
    }
    const body = await parseBody(req);
    const matchId = cleanShortText(body.matchId || "", 120);
    if (!matchId) {
      return sendJson(res, 400, { ok: false, error: "Informe a mesa PvP." });
    }

    let store = cleanupPubpaidPvpStore(readPubpaidPvpStore());
    const matchIndex = store.matches.findIndex((entry) => entry?.id === matchId && entry?.gameId === "poker");
    if (matchIndex < 0) {
      return sendJson(res, 404, { ok: false, error: "Mesa PvP nao encontrada." });
    }
    const match = store.matches[matchIndex];
    const walletKey = getPubpaidWalletKey(authUser);
    const seat = match?.playerOne?.walletKey === walletKey ? "playerOne" : match?.playerTwo?.walletKey === walletKey ? "playerTwo" : "";
    if (!seat) {
      return sendJson(res, 403, { ok: false, error: "Essa mesa pertence a outros jogadores." });
    }
    if (match.status !== "active") {
      return sendJson(res, 400, { ok: false, error: "Essa mesa PvP nao esta mais ativa." });
    }
    if (match.turn !== seat) {
      return sendJson(res, 409, { ok: false, error: "Espere a vez do outro jogador." });
    }

    const pokerState = match?.pokerState || createPokerPvPState();
    const cardsKey = seat === "playerOne" ? "playerOneCards" : "playerTwoCards";
    const heldKey = seat === "playerOne" ? "playerOneHeld" : "playerTwoHeld";
    const drawUsedKey = seat === "playerOne" ? "playerOneDrawUsed" : "playerTwoDrawUsed";
    const rivalDrawUsedKey = seat === "playerOne" ? "playerTwoDrawUsed" : "playerOneDrawUsed";
    if (pokerState[drawUsedKey]) {
      return sendJson(res, 400, { ok: false, error: "Sua troca dessa mesa ja foi usada." });
    }

    const heldRaw = Array.isArray(body.held) ? body.held.slice(0, 5) : [];
    const held = Array.from({ length: 5 }, (_, index) => Boolean(heldRaw[index]));
    pokerState[heldKey] = held;
    pokerState[cardsKey] = (Array.isArray(pokerState[cardsKey]) ? pokerState[cardsKey] : []).map((card, index) =>
      held[index] ? card : drawPokerPvpCards(pokerState.deck, 1)[0] || card
    );
    pokerState[drawUsedKey] = true;

    let nextTurn = seat === "playerOne" ? "playerTwo" : "playerOne";
    let winner = "";
    let finished = false;
    let resultSummary = `${seat === "playerOne" ? match?.playerOne?.name || "Jogador 1" : match?.playerTwo?.name || "Jogador 2"} trocou as cartas e passou a vez.`;

    if (pokerState[rivalDrawUsedKey]) {
      const playerOneHand = evaluatePokerPvpHand(pokerState.playerOneCards);
      const playerTwoHand = evaluatePokerPvpHand(pokerState.playerTwoCards);
      const result = comparePokerPvpHands(playerOneHand, playerTwoHand);
      finished = true;
      if (result > 0) {
        winner = "playerOne";
        resultSummary = `${match?.playerOne?.name || "Jogador 1"} mostrou ${playerOneHand.label} e venceu ${match?.playerTwo?.name || "Jogador 2"} com ${playerTwoHand.label}.`;
      } else if (result < 0) {
        winner = "playerTwo";
        resultSummary = `${match?.playerTwo?.name || "Jogador 2"} mostrou ${playerTwoHand.label} e venceu ${match?.playerOne?.name || "Jogador 1"} com ${playerOneHand.label}.`;
      } else {
        resultSummary = `As duas maos fecharam em ${playerOneHand.label}. A mesa de poker empatou.`;
      }
    } else {
      resultSummary = `${resultSummary} ${nextTurn === "playerOne" ? match?.playerOne?.name || "Jogador 1" : match?.playerTwo?.name || "Jogador 2"} troca agora.`;
    }

    store.matches[matchIndex] = {
      ...match,
      pokerState,
      turn: nextTurn,
      winner,
      resultSummary,
      moveCount: clampInteger(match.moveCount) + 1,
      status: finished ? "finished" : "active",
      finishedAt: finished ? new Date().toISOString() : "",
      updatedAt: new Date().toISOString(),
    };
    store = writePubpaidPvpStore(store);
    return sendJson(res, 200, buildPubpaidPvpStatePayload(store, authUser, "poker"));
  }

  if (req.method === "POST" && pathname === "/api/pubpaid/pvp/darts/throw") {
    const authUser = readCatalogoAuthSession(req);
    if (!authUser) {
      return sendJson(res, 401, { ok: false, error: "Entre com Google para jogar a mesa PvP." });
    }
    const body = await parseBody(req);
    const matchId = cleanShortText(body.matchId || "", 120);
    const aimX = clampDartsAimValue(body.aimX, 50);
    const aimY = clampDartsAimValue(body.aimY, 50);
    if (!matchId) {
      return sendJson(res, 400, { ok: false, error: "Informe a mesa PvP." });
    }
    if (aimX < 8 || aimX > 92 || aimY < 8 || aimY > 92) {
      return sendJson(res, 400, { ok: false, error: "A mira dos dardos precisa ficar dentro do alvo." });
    }

    let store = cleanupPubpaidPvpStore(readPubpaidPvpStore());
    const matchIndex = store.matches.findIndex((entry) => entry?.id === matchId && entry?.gameId === "darts");
    if (matchIndex < 0) {
      return sendJson(res, 404, { ok: false, error: "Mesa PvP nao encontrada." });
    }
    const match = store.matches[matchIndex];
    const walletKey = getPubpaidWalletKey(authUser);
    const seat = match?.playerOne?.walletKey === walletKey ? "playerOne" : match?.playerTwo?.walletKey === walletKey ? "playerTwo" : "";
    if (!seat) {
      return sendJson(res, 403, { ok: false, error: "Essa mesa pertence a outros jogadores." });
    }
    if (match.status !== "active") {
      return sendJson(res, 400, { ok: false, error: "Essa mesa PvP nao esta mais ativa." });
    }
    if (match.turn !== seat) {
      return sendJson(res, 409, { ok: false, error: "Espere a vez do outro jogador." });
    }

    const dartsState = match?.dartsState || createDartsPvPState();
    const throwKey = seat === "playerOne" ? "playerOneThrow" : "playerTwoThrow";
    const lastKey = seat === "playerOne" ? "lastPlayerOne" : "lastPlayerTwo";
    const aimXKey = seat === "playerOne" ? "playerOneAimX" : "playerTwoAimX";
    const aimYKey = seat === "playerOne" ? "playerOneAimY" : "playerTwoAimY";
    const rivalThrowKey = seat === "playerOne" ? "playerTwoThrow" : "playerOneThrow";
    if (dartsState[throwKey]) {
      return sendJson(res, 400, { ok: false, error: "Seu arremesso dessa rodada ja foi enviado." });
    }

    const throwResult = rollDartsPvpThrow(aimX, aimY);
    dartsState[throwKey] = throwResult;
    dartsState[lastKey] = throwResult;
    dartsState[aimXKey] = aimX;
    dartsState[aimYKey] = aimY;

    let nextTurn = seat === "playerOne" ? "playerTwo" : "playerOne";
    let winner = "";
    let finished = false;
    let resultSummary = `${seat === "playerOne" ? match?.playerOne?.name || "Jogador 1" : match?.playerTwo?.name || "Jogador 2"} mirou em ${throwResult.targetLabel} e caiu em ${throwResult.label} (${throwResult.score}).`;

    if (dartsState[rivalThrowKey]) {
      const playerOneThrow = dartsState.playerOneThrow;
      const playerTwoThrow = dartsState.playerTwoThrow;
      dartsState.playerOneScore += clampInteger(playerOneThrow.score);
      dartsState.playerTwoScore += clampInteger(playerTwoThrow.score);
      if (playerOneThrow.score > playerTwoThrow.score) {
        resultSummary = `${match?.playerOne?.name || "Jogador 1"} levou a rodada dos dardos por ${playerOneThrow.score} a ${playerTwoThrow.score}.`;
      } else if (playerTwoThrow.score > playerOneThrow.score) {
        resultSummary = `${match?.playerTwo?.name || "Jogador 2"} levou a rodada dos dardos por ${playerTwoThrow.score} a ${playerOneThrow.score}.`;
      } else {
        resultSummary = `A rodada de dardos empatou em ${playerOneThrow.score}.`;
      }
      dartsState.history.push({
        round: dartsState.round,
        playerOne: playerOneThrow.score,
        playerTwo: playerTwoThrow.score,
      });
      dartsState.playerOneThrow = null;
      dartsState.playerTwoThrow = null;

      if (dartsState.round >= dartsState.maxRounds) {
        finished = true;
        if (dartsState.playerOneScore > dartsState.playerTwoScore) {
          winner = "playerOne";
          resultSummary = `${match?.playerOne?.name || "Jogador 1"} venceu os dardos por ${dartsState.playerOneScore} a ${dartsState.playerTwoScore}.`;
        } else if (dartsState.playerTwoScore > dartsState.playerOneScore) {
          winner = "playerTwo";
          resultSummary = `${match?.playerTwo?.name || "Jogador 2"} venceu os dardos por ${dartsState.playerTwoScore} a ${dartsState.playerOneScore}.`;
        } else {
          resultSummary = `Os dardos fecharam empatados em ${dartsState.playerOneScore} a ${dartsState.playerTwoScore}.`;
        }
      } else {
        dartsState.round += 1;
        nextTurn = "playerOne";
        resultSummary = `${resultSummary} Nova rodada aberta no alvo. ${match?.playerOne?.name || "Jogador 1"} mira primeiro.`;
      }
    } else {
      resultSummary = `${resultSummary} ${nextTurn === "playerOne" ? match?.playerOne?.name || "Jogador 1" : match?.playerTwo?.name || "Jogador 2"} responde agora.`;
    }

    store.matches[matchIndex] = {
      ...match,
      dartsState,
      turn: nextTurn,
      winner,
      resultSummary,
      moveCount: clampInteger(match.moveCount) + 1,
      status: finished ? "finished" : "active",
      finishedAt: finished ? new Date().toISOString() : "",
      updatedAt: new Date().toISOString(),
    };
    store = writePubpaidPvpStore(store);
    return sendJson(res, 200, buildPubpaidPvpStatePayload(store, authUser, "darts"));
  }

  if (req.method === "POST" && pathname === "/api/pubpaid/pvp/dicecups/guess") {
    const authUser = readCatalogoAuthSession(req);
    if (!authUser) {
      return sendJson(res, 401, { ok: false, error: "Entre com Google para jogar a mesa PvP." });
    }
    const body = await parseBody(req);
    const matchId = cleanShortText(body.matchId || "", 120);
    const guess = clampInteger(body.guess);
    if (!matchId) {
      return sendJson(res, 400, { ok: false, error: "Informe a mesa PvP." });
    }
    if (guess < 2 || guess > 12) {
      return sendJson(res, 400, { ok: false, error: "Escolha uma soma valida entre 2 e 12." });
    }

    let store = cleanupPubpaidPvpStore(readPubpaidPvpStore());
    const matchIndex = store.matches.findIndex((entry) => entry?.id === matchId && entry?.gameId === "dicecups");
    if (matchIndex < 0) {
      return sendJson(res, 404, { ok: false, error: "Mesa PvP nao encontrada." });
    }
    const match = store.matches[matchIndex];
    const walletKey = getPubpaidWalletKey(authUser);
    const seat = match?.playerOne?.walletKey === walletKey ? "playerOne" : match?.playerTwo?.walletKey === walletKey ? "playerTwo" : "";
    if (!seat) {
      return sendJson(res, 403, { ok: false, error: "Essa mesa pertence a outros jogadores." });
    }
    if (match.status !== "active") {
      return sendJson(res, 400, { ok: false, error: "Essa mesa PvP nao esta mais ativa." });
    }
    if (match.turn !== seat) {
      return sendJson(res, 409, { ok: false, error: "Espere a vez do outro jogador." });
    }

    const diceState = match?.diceState || createDicecupsPvPState();
    const guessKey = seat === "playerOne" ? "playerOneGuess" : "playerTwoGuess";
    const rivalGuessKey = seat === "playerOne" ? "playerTwoGuess" : "playerOneGuess";
    if (clampInteger(diceState[guessKey]) > 0) {
      return sendJson(res, 400, { ok: false, error: "Seu palpite dessa rodada ja foi enviado." });
    }

    diceState[guessKey] = guess;
    let nextTurn = seat === "playerOne" ? "playerTwo" : "playerOne";
    let winner = "";
    let finished = false;
    let resultSummary = `${seat === "playerOne" ? match?.playerOne?.name || "Jogador 1" : match?.playerTwo?.name || "Jogador 2"} cobriu a soma ${guess}.`;

    if (clampInteger(diceState[rivalGuessKey]) > 0) {
      diceState.dice = [1 + Math.floor(Math.random() * 6), 1 + Math.floor(Math.random() * 6)];
      diceState.total = diceState.dice[0] + diceState.dice[1];
      const playerOneDiff = Math.abs(clampInteger(diceState.playerOneGuess) - diceState.total);
      const playerTwoDiff = Math.abs(clampInteger(diceState.playerTwoGuess) - diceState.total);
      if (playerOneDiff < playerTwoDiff) {
        diceState.playerOneScore += 1;
        resultSummary = `${match?.playerOne?.name || "Jogador 1"} leu melhor os copos e venceu a soma ${diceState.total}.`;
      } else if (playerTwoDiff < playerOneDiff) {
        diceState.playerTwoScore += 1;
        resultSummary = `${match?.playerTwo?.name || "Jogador 2"} leu melhor os copos e venceu a soma ${diceState.total}.`;
      } else {
        resultSummary = `Os dois ficaram na mesma distancia da soma ${diceState.total}.`;
      }
      diceState.history.push({
        round: diceState.round,
        playerOne: diceState.playerOneGuess,
        playerTwo: diceState.playerTwoGuess,
        total: diceState.total,
      });
      if (diceState.round >= diceState.maxRounds) {
        finished = true;
        if (diceState.playerOneScore > diceState.playerTwoScore) {
          winner = "playerOne";
          resultSummary = `${match?.playerOne?.name || "Jogador 1"} venceu os copos por ${diceState.playerOneScore} a ${diceState.playerTwoScore}.`;
        } else if (diceState.playerTwoScore > diceState.playerOneScore) {
          winner = "playerTwo";
          resultSummary = `${match?.playerTwo?.name || "Jogador 2"} venceu os copos por ${diceState.playerTwoScore} a ${diceState.playerOneScore}.`;
        } else {
          resultSummary = `Os copos fecharam empatados em ${diceState.playerOneScore} a ${diceState.playerTwoScore}.`;
        }
      } else {
        diceState.round += 1;
        diceState.playerOneGuess = 0;
        diceState.playerTwoGuess = 0;
        nextTurn = "playerOne";
        resultSummary = `${resultSummary} Nova rodada aberta. ${match?.playerOne?.name || "Jogador 1"} escolhe primeiro.`;
      }
    } else {
      resultSummary = `${resultSummary} ${nextTurn === "playerOne" ? match?.playerOne?.name || "Jogador 1" : match?.playerTwo?.name || "Jogador 2"} responde agora.`;
    }

    store.matches[matchIndex] = {
      ...match,
      diceState,
      turn: nextTurn,
      winner,
      resultSummary,
      moveCount: clampInteger(match.moveCount) + 1,
      status: finished ? "finished" : "active",
      finishedAt: finished ? new Date().toISOString() : "",
      updatedAt: new Date().toISOString(),
    };
    store = writePubpaidPvpStore(store);
    return sendJson(res, 200, buildPubpaidPvpStatePayload(store, authUser, "dicecups"));
  }

  if (req.method === "POST" && pathname === "/api/pubpaid/deposits") {
    const authUser = readCatalogoAuthSession(req);
    if (!authUser) {
      return sendJson(res, 401, {
        ok: false,
        error: "Entre com Google para registrar o deposito."
      });
    }

    const body = await parseBody(req);
    const amount = normalizePubpaidAmount(body.amount, 10);
    const txid = normalizePixToken(body.paymentTxid || body.txid || `PUB${Date.now()}`, 25) || `PUB${Date.now()}`;
    const depositorName = cleanShortText(body.depositorName || body.depositName || body.payerName || "", 90);
    if (!depositorName || depositorName.length < 3) {
      return sendJson(res, 400, {
        ok: false,
        error: "Informe o nome de quem fez o Pix para a conferencia manual."
      });
    }
    const tracking = buildTrackingMeta(req, body);
    const wallet = getPubpaidWallet(authUser);
    const reviewDeadlineAt = new Date(Date.now() + PUBPAID_PENDING_WINDOW_MS).toISOString();
    const nextItem = {
      id: createRecordId("pubdep"),
      type: "pubpaid-deposito",
      user: publicAuthUser(authUser),
      depositorName,
      walletKey: wallet?.walletKey || getPubpaidWalletKey(authUser),
      amount: Number(amount.toFixed(2)),
      creditsRequested: Math.floor(amount),
      status: "aguardando-confirmacao-pix",
      payment: {
        method: "pix-qr-code",
        keyVisible: false,
        txid,
        depositorName,
        status: "pendente-manual",
        confirmationMode: "manual"
      },
      reviewDeadlineAt,
      sourcePage: cleanShortText(body.sourcePage || tracking.pagePath || "/pubpaid.html", 260),
      visitorId: tracking.visitorId || tracking.cookieVisitorId,
      sessionId: tracking.sessionId || tracking.cookieSessionId,
      city: tracking.city,
      country: tracking.country,
      ip: tracking.ip,
      createdAt: new Date().toISOString()
    };

    await appendCanonicalPubpaidItem("deposits", nextItem);

    return sendJson(res, 201, {
      ok: true,
      item: nextItem,
      message: "Deposito PubPaid registrado. Os creditos ficam pendentes por ate 3 horas ou ate a confirmacao manual no admin."
    });
  }

  if (req.method === "POST" && pathname === "/api/pubpaid/withdrawals") {
    const authUser = readCatalogoAuthSession(req);
    if (!authUser) {
      return sendJson(res, 401, {
        ok: false,
        error: "Entre com Google para solicitar saque."
      });
    }

    const body = await parseBody(req);
    const amount = normalizePubpaidMoney(body.amount, 0);
    if (amount <= 0) {
      return sendJson(res, 400, {
        ok: false,
        error: "Informe um valor valido para a retirada."
      });
    }
    const wallet = getPubpaidWallet(authUser);
    if (!wallet) {
      return sendJson(res, 400, {
        ok: false,
        error: "Carteira PubPaid indisponivel."
      });
    }

    if (normalizePubpaidMoney(wallet.balanceCoins) + 0.0001 < amount) {
      return sendJson(res, 400, {
        ok: false,
        error: "Saldo insuficiente para solicitar esse saque."
      });
    }

    const txid = normalizePixToken(body.paymentTxid || body.txid || `SAQ${Date.now()}`, 25) || `SAQ${Date.now()}`;
    const tracking = buildTrackingMeta(req, body);
    const reviewDeadlineAt = new Date(Date.now() + PUBPAID_PENDING_WINDOW_MS).toISOString();
    const nextItem = {
      id: createRecordId("pubwd"),
      type: "pubpaid-saque",
      user: publicAuthUser(authUser),
      walletKey: wallet.walletKey,
      amount: Number(amount.toFixed(2)),
      creditsRequested: Number(amount.toFixed(2)),
      status: "aguardando-confirmacao-saque",
      payment: {
        method: "pix-manual",
        txid,
        status: "pendente-manual",
        confirmationMode: "manual"
      },
      reviewDeadlineAt,
      sourcePage: cleanShortText(body.sourcePage || tracking.pagePath || "/pubpaid.html", 260),
      visitorId: tracking.visitorId || tracking.cookieVisitorId,
      sessionId: tracking.sessionId || tracking.cookieSessionId,
      city: tracking.city,
      country: tracking.country,
      ip: tracking.ip,
      createdAt: new Date().toISOString()
    };

    updatePubpaidWallet(authUser, (current) => ({
      ...current,
      balanceCoins: Math.max(0, normalizePubpaidMoney(current.balanceCoins) - amount),
      lockedWithdrawalCoins: normalizePubpaidMoney(current.lockedWithdrawalCoins) + amount
    }));

    await appendCanonicalPubpaidItem("withdrawals", nextItem);

    return sendJson(res, 201, {
      ok: true,
      item: nextItem,
      wallet: buildPubpaidAccountPayload(authUser).wallet,
      message: "Saque solicitado. O valor fica travado por ate 3 horas ou ate revisao manual no admin."
    });
  }

  if (req.method === "GET" && pathname === "/api/pubpaid-admin/dashboard") {
    if (!requireAdmin(req)) return sendAdminUnauthorized(res);
    return sendJson(res, 200, buildPubpaidAdminPayload());
  }

  if (req.method === "POST" && pathname === "/api/pubpaid-admin/deposits/review") {
    if (!requireAdmin(req)) return sendAdminUnauthorized(res);
    const body = await parseBody(req);
    try {
      const result = await reviewCanonicalPubpaidDeposit({
        depositId: cleanShortText(body.depositId || body.id, 120),
        decision: body.decision || body.status || "",
        reviewer: cleanShortText(body.reviewer || body.adminUser || body.username || SUPER_ADMIN_USER, 120),
        reason: cleanShortText(body.reason || body.reviewReason || body.note || "", 280),
      });
      const payload = buildPubpaidAdminPayload();
      return sendJson(res, 200, {
        ok: true,
        idempotent: result.idempotent,
        item: result.item,
        updatedAt: payload.updatedAt,
        storage: payload.storage,
        totals: payload.totals,
        dashboard: payload.dashboard,
        pendingPubpaidDeposits: payload.pendingPubpaidDeposits,
        pendingPubpaidWithdrawals: payload.pendingPubpaidWithdrawals,
        pubpaidWalletBoard: payload.pubpaidWalletBoard,
      });
    } catch (error) {
      console.error("[pubpaid-admin][deposit-review] failed", {
        depositId: cleanShortText(body.depositId || body.id, 120),
        decision: normalizeText(body.decision || body.status || ""),
        message: error?.message || String(error)
      });
      return sendJson(res, error?.statusCode || 500, {
        ok: false,
        error: error?.message || "Falha ao confirmar o deposito PubPaid."
      });
    }
  }

  if (req.method === "POST" && pathname === "/api/pubpaid-admin/withdrawals/review") {
    if (!requireAdmin(req)) return sendAdminUnauthorized(res);
    const body = await parseBody(req);
    try {
      const result = await reviewCanonicalPubpaidWithdrawal({
        withdrawalId: cleanShortText(body.withdrawalId || body.id, 120),
        decision: body.decision || body.status || "",
        reviewer: cleanShortText(body.reviewer || body.adminUser || body.username || SUPER_ADMIN_USER, 120),
        reason: cleanShortText(body.reason || body.reviewReason || body.note || "", 280),
      });
      const payload = buildPubpaidAdminPayload();
      return sendJson(res, 200, {
        ok: true,
        idempotent: result.idempotent,
        item: result.item,
        updatedAt: payload.updatedAt,
        storage: payload.storage,
        totals: payload.totals,
        dashboard: payload.dashboard,
        pendingPubpaidDeposits: payload.pendingPubpaidDeposits,
        pendingPubpaidWithdrawals: payload.pendingPubpaidWithdrawals,
        pubpaidWalletBoard: payload.pubpaidWalletBoard,
      });
    } catch (error) {
      console.error("[pubpaid-admin][withdrawal-review] failed", {
        withdrawalId: cleanShortText(body.withdrawalId || body.id, 120),
        decision: normalizeText(body.decision || body.status || ""),
        message: error?.message || String(error)
      });
      return sendJson(res, error?.statusCode || 500, {
        ok: false,
        error: error?.message || "Falha ao confirmar o saque PubPaid."
      });
    }
  }

  if (req.method === "GET" && pathname === "/api/pubpaid-admin/reports/pubpaid-deposits.csv") {
    if (!requireAdmin(req)) return sendAdminUnauthorized(res);
    const rows = readMergedPubpaidArray(PUBPAID_DEPOSITS_FILE, LEGACY_PUBPAID_DEPOSITS_FILE).map((item) => ({
      createdAt: item.createdAt || "",
      player: item?.user?.name || "",
      email: item?.user?.email || "",
      depositorName: item.depositorName || item?.payment?.depositorName || "",
      amount: item.amount || 0,
      creditsRequested: item.creditsRequested || 0,
      status: item.status || "",
      paymentStatus: item?.payment?.status || "",
      txid: item?.payment?.txid || ""
    }));
    return sendCsv(res, 200, toCsv(rows) || "createdAt,player,email,depositorName,amount,creditsRequested,status,paymentStatus,txid\n", "pubpaid_depositos.csv");
  }

  if (req.method === "GET" && pathname === "/api/pubpaid-admin/reports/pubpaid-withdrawals.csv") {
    if (!requireAdmin(req)) return sendAdminUnauthorized(res);
    const rows = getPubpaidWithdrawals().map((item) => ({
      createdAt: item.createdAt || "",
      player: item?.user?.name || "",
      email: item?.user?.email || "",
      amount: item.amount || 0,
      status: item.status || "",
      paymentStatus: item?.payment?.status || "",
      txid: item?.payment?.txid || ""
    }));
    return sendCsv(res, 200, toCsv(rows) || "createdAt,player,email,amount,status,paymentStatus,txid\n", "pubpaid_retiradas.csv");
  }

  if (req.method === "GET" && pathname === "/api/pubpaid-admin/reports/pubpaid-wallets.csv") {
    if (!requireAdmin(req)) return sendAdminUnauthorized(res);
    const rows = getPubpaidWalletStore().map((item) => ({
      updatedAt: item.updatedAt || item.createdAt || "",
      player: item?.user?.name || "",
      email: item?.user?.email || "",
      walletKey: item.walletKey || "",
      balanceCoins: normalizePubpaidMoney(item.balanceCoins),
      lockedWithdrawalCoins: normalizePubpaidMoney(item.lockedWithdrawalCoins),
      totalApprovedDeposits: normalizePubpaidMoney(item.totalApprovedDeposits),
      totalApprovedWithdrawals: normalizePubpaidMoney(item.totalApprovedWithdrawals)
    }));
    return sendCsv(res, 200, toCsv(rows) || "updatedAt,player,email,walletKey,balanceCoins,lockedWithdrawalCoins,totalApprovedDeposits,totalApprovedWithdrawals\n", "pubpaid_carteiras.csv");
  }

  if (req.method === "GET" && pathname === "/api/admin/dashboard") {
    if (!requireAdmin(req)) return sendAdminUnauthorized(res);
    return sendJson(res, 200, buildAdminDashboardPayload());
  }

  if (req.method === "GET" && pathname === "/api/admin/reports/access.csv") {
    if (!requireAdmin(req)) return sendAdminUnauthorized(res);
    const rows = getJsonArray(VISITS_FILE).map((item) => ({
      at: item.at,
      pagePath: item.pagePath,
      pageTitle: item.pageTitle,
      visitorId: item.visitorId,
      sessionId: item.sessionId,
      city: item.city,
      country: item.country,
      ip: item.ip,
      browser: item.browser,
      deviceType: item.deviceType,
      trackingConsent: item.trackingConsent,
      referrerHost: summarizeReferrer(item.referrer)
    }));
    return sendCsv(
      res,
      200,
      toCsv(rows) || "at,pagePath,pageTitle,visitorId,sessionId,city,country,ip,browser,deviceType,trackingConsent,referrerHost\n",
      "acessos_catalogo_czs.csv"
    );
  }

  if (req.method === "GET" && pathname === "/api/admin/reports/votes.csv") {
    if (!requireAdmin(req)) return sendAdminUnauthorized(res);
    const rows = getElectionVoteRecords().map((item) => ({
      at: item.at,
      office: item.office,
      candidateName: item.candidateName,
      candidateParty: item.candidateParty,
      city: item.city,
      voterName: item.voterName,
      voterParty: item.voterParty,
      observation: item.observation,
      sentiment: item.sentiment,
      reelectionSignal: item.reelectionSignal,
      ip: item.ip,
      browser: item.browser,
      deviceType: item.deviceType
    }));
    return sendCsv(
      res,
      200,
      toCsv(rows) || "at,office,candidateName,candidateParty,city,voterName,voterParty,observation,sentiment,reelectionSignal,ip,browser,deviceType\n",
      "votos_catalogo_czs.csv"
    );
  }

  if (req.method === "GET" && pathname === "/api/admin/reports/comments.csv") {
    if (!requireAdmin(req)) return sendAdminUnauthorized(res);
    const rows = getJsonArray(path.join(DATA_DIR, "comments.json")).map((item) => ({
      createdAt: item.createdAt,
      articleId: item.articleId,
      pagePath: item.pagePath,
      author: item.author || item.name,
      badge: item.badge,
      message: item.message || item.text,
      status: item.status,
      visitorId: item.visitorId,
      sessionId: item.sessionId,
      city: item.city,
      country: item.country,
      ip: item.ip
    }));
    return sendCsv(
      res,
      200,
      toCsv(rows) || "createdAt,articleId,pagePath,author,badge,message,status,visitorId,sessionId,city,country,ip\n",
      "comentarios_catalogo_czs.csv"
    );
  }

  if (req.method === "GET" && pathname === "/api/admin/reports/subscriptions.csv") {
    if (!requireAdmin(req)) return sendAdminUnauthorized(res);
    const rows = getJsonArray(path.join(DATA_DIR, "subscriptions.json")).map((item) => ({
      createdAt: item.createdAt,
      name: item.name,
      email: item.email,
      whatsapp: item.whatsapp,
      interests: Array.isArray(item.interests) ? item.interests.join(" | ") : "",
      sourcePage: item.sourcePage,
      visitorId: item.visitorId,
      sessionId: item.sessionId,
      city: item.city,
      country: item.country,
      ip: item.ip
    }));
    return sendCsv(
      res,
      200,
      toCsv(rows) || "createdAt,name,email,whatsapp,interests,sourcePage,visitorId,sessionId,city,country,ip\n",
      "assinaturas_catalogo_czs.csv"
    );
  }

  if (req.method === "GET" && pathname === "/api/admin/reports/acre-2026-poll.csv") {
    if (!requireAdmin(req)) return sendAdminUnauthorized(res);
    const rows = getAcre2026PollResponses().map((item) => ({
      createdAt: item.createdAt,
      profissao: item.profissao,
      localizacao: item.localizacao,
      faixaEtaria: item.faixaEtaria,
      votoAnterior: item.votoAnterior,
      satisfacao: item.satisfacao,
      avaliacaoGoverno: item.avaliacaoGoverno,
      direcaoEstado: item.direcaoEstado,
      desejoCiclo: item.desejoCiclo,
      voto2026: item.voto2026,
      segundaOpcao: item.segundaOpcao,
      certezaVoto: item.certezaVoto,
      rejeicao: item.rejeicao,
      prioridade: item.prioridade,
      atencaoPolitica: item.atencaoPolitica,
      fatorDecisivo: item.fatorDecisivo,
      comentario: item.comentario,
      sourcePage: item.sourcePage,
      pageTitle: item.pageTitle,
      visitorId: item.visitorId,
      sessionId: item.sessionId,
      city: item.city,
      country: item.country,
      ip: item.ip,
      browser: item.browser,
      deviceType: item.deviceType
    }));
    return sendCsv(
      res,
      200,
      toCsv(rows) || "createdAt,profissao,localizacao,faixaEtaria,votoAnterior,satisfacao,voto2026,rejeicao,prioridade,comentario,sourcePage,pageTitle,visitorId,sessionId,city,country,ip,browser,deviceType\n",
      "pesquisa_acre_2026.csv"
    );
  }

  if (req.method === "GET" && pathname.startsWith("/api/admin/raw/")) {
    if (!requireAdmin(req)) return sendAdminUnauthorized(res);
    const key = pathname.replace("/api/admin/raw/", "");
    const limit = Math.max(1, Math.min(500, Number(searchParams.get("limit") || 100)));
    const loaders = {
      visits: () => getJsonArray(VISITS_FILE),
      heartbeats: () => getJsonArray(HEARTBEATS_FILE),
      comments: () => getJsonArray(path.join(DATA_DIR, "comments.json")),
      subscriptions: () => getJsonArray(path.join(DATA_DIR, "subscriptions.json")),
      acre2026Poll: () => getAcre2026PollResponses(),
      votes: () => getElectionVoteRecords(),
      ninjasRequests: () => getJsonArray(NINJAS_REQUESTS_FILE),
      ninjasProfiles: () => getJsonArray(NINJAS_PROFILES_FILE),
      salesListings: () => getJsonArray(SALES_LISTINGS_FILE),
      vrRentalLeads: () => getJsonArray(VR_RENTAL_LEADS_FILE)
    };

    if (!loaders[key]) {
      return sendJson(res, 404, { ok: false, error: "Colecao nao suportada." });
    }

    const items = loaders[key]();
    const ordered =
      key === "heartbeats"
        ? sortByDateDesc(items, "at", limit)
        : sortByDateDesc(
            items,
            key === "votes"
              ? "at"
              : key === "comments" ||
                  key === "subscriptions" ||
                  key === "acre2026Poll" ||
                  key.startsWith("ninjas") ||
                  key === "salesListings" ||
                  key === "vrRentalLeads"
                ? "createdAt"
                : "at",
            limit
          );
    return sendJson(res, 200, {
      ok: true,
      key,
      total: items.length,
      items: ordered.slice(0, limit)
    });
  }

  if (req.method === "POST" && pathname === "/api/subscriptions") {
    const authUser = readCatalogoAuthSession(req);
    if (!authUser) {
      return sendJson(res, 401, {
        ok: false,
        error: "Entre com Google para assinar, apoiar ou entrar no mural."
      });
    }

    const body = await parseBody(req);
    const tracking = buildTrackingMeta(req, body);
    const subs = readJson(path.join(DATA_DIR, "subscriptions.json"), []);
    const plan = String(body.plan || "resumo-7h-gratis").trim() || "resumo-7h-gratis";
    const amount = plan === "fundadores" ? Math.max(1, Math.min(10, parseCurrency(body.amount, 5))) : 0;

    if (plan === "fundadores" && !hasPixKeyConfigured()) {
      return sendJson(res, 503, {
        ok: false,
        error: "Apoio fundador por Pix esta indisponivel ate configurar a chave Pix."
      });
    }

    const paymentTxid =
      plan === "fundadores"
        ? normalizePixToken(body.paymentTxid || body.txid || `FUND${Date.now()}`, 25) || `FUND${Date.now()}`
        : "";
    const nextItem = {
      id: createRecordId("s"),
      email: authUser.email,
      name: cleanShortText(body.name || authUser.name || authUser.givenName, 100),
      authProvider: "google",
      googleSub: authUser.sub,
      whatsapp: cleanPhone(body.whatsapp || body.phone),
      interests: normalizeListInput(body.interests, { maxItems: 8, itemLength: 60 }),
      plan,
      amount: plan === "fundadores" ? amount : 0,
      badge: plan === "fundadores" ? "Fundador" : "Resumo das 7h",
      status: plan === "fundadores" ? "aguardando-confirmacao-pix" : "ativo",
      sourcePage: cleanShortText(body.sourcePage || tracking.pagePath, 260),
      visitorId: tracking.visitorId || tracking.cookieVisitorId,
      sessionId: tracking.sessionId || tracking.cookieSessionId,
      city: tracking.city,
      country: tracking.country,
      ip: tracking.ip,
      payment:
        plan === "fundadores"
          ? {
              amount,
              method: "pix-qr-code",
              keyVisible: false,
              txid: paymentTxid,
              status: "pendente-manual",
              confirmationMode: "manual"
            }
          : {
              amount: 0,
              method: "none",
              keyVisible: false,
              txid: "",
              status: "nao-aplicavel",
              confirmationMode: "none"
            },
      createdAt: new Date().toISOString(),
    };
    const next = Array.isArray(subs) ? subs : [];
    if (nextItem.email) next.push(nextItem);
    writeJson(path.join(DATA_DIR, "subscriptions.json"), next);
    const founderItems = next.filter(isConfirmedFounderSubscription);
    const founders = founderItems
      .slice()
      .reverse()
      .slice(0, 24)
      .map((item) => ({
        id: String(item.id || ""),
        name: String(item.name || "").slice(0, 100),
        amount: Number(item.amount || 0),
        badge: "Fundador",
        createdAt: item.createdAt || ""
      }));
    return sendJson(res, 201, {
      ok: true,
      item: nextItem,
      founders,
      paymentPending: plan === "fundadores",
      message:
        plan === "fundadores"
          ? "Apoio registrado e aguardando confirmacao manual do Pix antes de entrar no mural."
          : "Resumo das 7h registrado."
    });
  }

  if (req.method === "POST" && pathname === "/api/news/refresh") {
    if (!requireAdmin(req)) return sendAdminUnauthorized(res);
    const body = await parseBody(req);
    const limit = Number(body.limit || 18);
    const payload = await refreshRssRuntime(Math.max(5, Math.min(80, limit)));
    return sendJson(res, 200, { ok: true, ...payload });
  }

  if (req.method === "GET" && pathname === "/api/admin/overview") {
    if (!requireAdmin(req)) return sendAdminUnauthorized(res);

    const comments = readJson(path.join(DATA_DIR, "comments.json"), []);
    const subs = readJson(path.join(DATA_DIR, "subscriptions.json"), []);
    const pubpaidDeposits = readMergedPubpaidArray(PUBPAID_DEPOSITS_FILE, LEGACY_PUBPAID_DEPOSITS_FILE);
    const news = getNews(200);
    const biz = getBusinesses();

    return sendJson(res, 200, {
      ok: true,
      totals: {
        comments: Array.isArray(comments) ? comments.length : 0,
        subscriptions: Array.isArray(subs) ? subs.length : 0,
        pubpaidDeposits: Array.isArray(pubpaidDeposits) ? pubpaidDeposits.length : 0,
        news: Array.isArray(news) ? news.length : 0,
        businesses: Array.isArray(biz) ? biz.length : 0,
      },
      updatedAt: new Date().toISOString(),
    });
  }

  return sendJson(res, 404, { ok: false, message: "Rota não encontrada." });
}

function handleStatic(req, res, pathname, requestUrl) {
  const templateVars = buildSeoTemplateVars(req, pathname, requestUrl);

  if (pathname === "/robots.txt") {
    return sendText(res, 200, buildRobotsTxt(req), "public, max-age=3600");
  }

  if (pathname === "/sitemap.xml") {
    return sendXml(res, 200, buildSitemapXml(req));
  }

  if (
    pathname === "/pubpaid-admin" ||
    pathname === "/pubpaid-admin/" ||
    pathname === "/pubpaid-admin.html" ||
    pathname === "/admin" ||
    pathname === "/admin/" ||
    pathname === "/admin/admin-dashboard.html" ||
    pathname === "/admin/admin_dashboard.html" ||
    pathname === "/admin-dashboard.html" ||
    pathname === "/admin_dashboard.html"
  ) {
    if (pathname === "/pubpaid-admin" || pathname === "/pubpaid-admin/" || pathname === "/pubpaid-admin.html") {
      return sendFile(req, res, PUBPAID_ADMIN_FILE, {
        cacheControl: "no-store",
        templateVars
      });
    }
    return sendFile(req, res, ADMIN_DASHBOARD_FILE, {
      cacheControl: "no-store",
      templateVars
    });
  }

  if (pathname === "/") {
    return sendFile(req, res, INDEX_FILE, {
      cacheControl: getStaticCacheControl(INDEX_FILE, false),
      templateVars
    });
  }

  const decodedPath = decodeURIComponent(pathname);
  const safePath = safeJoin(ROOT_DIR, decodedPath.replace(/^\/+/, ""));
  const hasVersionParam = Boolean(requestUrl?.searchParams?.has("v"));

  if (!safePath) return sendText(res, 400, "Caminho inválido.");

  if (fs.existsSync(safePath) && fs.statSync(safePath).isFile()) {
    if (!isPublicStaticFile(safePath)) return sendText(res, 404, "Página não encontrada.");
    return sendFile(req, res, safePath, {
      cacheControl: getStaticCacheControl(safePath, hasVersionParam),
      templateVars
    });
  }

  if (!path.extname(decodedPath) && fs.existsSync(INDEX_FILE)) {
    return sendFile(req, res, INDEX_FILE, {
      cacheControl: getStaticCacheControl(INDEX_FILE, false),
      templateVars: buildSeoTemplateVars(req, "/", requestUrl)
    });
  }

  return sendText(res, 404, "Página não encontrada.");
}

ensureDataDir();
loadImagePreviewCache();
if (RSS_SOURCES.length) {
  refreshRssRuntime().catch(() => {});
  setInterval(() => {
    refreshRssRuntime().catch(() => {});
  }, NEWS_REFRESH_INTERVAL_MS);
}

const server = http.createServer(async (req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = requestUrl.pathname;

  if (pathname.startsWith("/api/") || pathname === "/health") {
    return handleApi(req, res, pathname, requestUrl.searchParams);
  }

  return handleStatic(req, res, pathname, requestUrl);
});

server.listen(PORT, HOST, () => {
  console.log(`[catalogo] online em http://${HOST}:${PORT}`);
  startRealAgentsAutoRunner();
});
function buildPubpaidAdminPayload() {
  const store = readCanonicalPubpaidStore();
  const pvpStore = readPubpaidPvpStore();
  const dashboard = buildCanonicalPubpaidAdminPayload(store);
  const activePvpMatches = (Array.isArray(pvpStore.matches) ? pvpStore.matches : []).filter((item) => item.status === "active");
  const settledPvpMatches = (Array.isArray(pvpStore.matches) ? pvpStore.matches : []).filter((item) => item.settlement?.status === "settled");
  return {
    ok: true,
    updatedAt: dashboard.generatedAt,
    storage: {
      mode: "canonical-store",
      target: "data/pubpaid-store.json",
    },
    totals: {
      pubpaidDeposits: Array.isArray(store.deposits) ? store.deposits.length : 0,
      pubpaidWithdrawals: Array.isArray(store.withdrawals) ? store.withdrawals.length : 0,
      pubpaidWallets: Array.isArray(dashboard.walletBoard) ? dashboard.walletBoard.length : 0,
      pubpaidPendingDeposits: Array.isArray(dashboard.pendingDeposits) ? dashboard.pendingDeposits.length : 0,
      pubpaidPendingWithdrawals: Array.isArray(dashboard.pendingWithdrawals) ? dashboard.pendingWithdrawals.length : 0,
      pubpaidPvpWaiting: Array.isArray(pvpStore.waiting) ? pvpStore.waiting.length : 0,
      pubpaidPvpActive: activePvpMatches.length,
      pubpaidPvpSettled: settledPvpMatches.length,
    },
    dashboard,
    pubpaidPvp: {
      updatedAt: pvpStore.updatedAt,
      waiting: pvpStore.waiting,
      activeMatches: activePvpMatches,
      settledMatches: settledPvpMatches.slice(-50),
    },
    pendingPubpaidDeposits: dashboard.pendingDeposits,
    pendingPubpaidWithdrawals: dashboard.pendingWithdrawals,
    pubpaidWalletBoard: dashboard.walletBoard,
  };
}

const PUBPAID_PVP_ENABLED_GAMES = new Set(["checkers", "cards21", "poker", "darts", "dicecups"]);
const PUBPAID_PVP_WAIT_MS = 1000 * 60 * 15;
const PUBPAID_PVP_MATCH_MS = 1000 * 60 * 60 * 6;
const PUBPAID_PVP_ABANDON_MS = 1000 * 60;

function emptyPubpaidPvpStore() {
  return {
    updatedAt: null,
    waiting: [],
    matches: [],
  };
}

function readPubpaidPvpStore() {
  const parsed = readJson(PUBPAID_PVP_FILE, emptyPubpaidPvpStore());
  return {
    updatedAt: parsed?.updatedAt || null,
    waiting: Array.isArray(parsed?.waiting) ? parsed.waiting : [],
    matches: Array.isArray(parsed?.matches) ? parsed.matches : [],
  };
}

function writePubpaidPvpStore(store = emptyPubpaidPvpStore()) {
  const settledStore = settleFinishedPubpaidPvpMatches(store);
  const nextStore = {
    updatedAt: new Date().toISOString(),
    waiting: Array.isArray(settledStore?.waiting) ? settledStore.waiting : [],
    matches: Array.isArray(settledStore?.matches) ? settledStore.matches : [],
  };
  writeJson(PUBPAID_PVP_FILE, nextStore);
  return nextStore;
}

function cleanupPubpaidPvpStore(store = emptyPubpaidPvpStore()) {
  const now = Date.now();
  const expiredWaiting = [];
  const matches = (Array.isArray(store.matches) ? store.matches : []).map((entry) => {
    if (entry?.status !== "abandoned") return entry;
    const deadline = new Date(entry.deadlineAt || 0).getTime();
    if (!deadline || now < deadline) return entry;
    const winner = entry.abandonedBy === "playerOne" ? "playerTwo" : "playerOne";
    return {
      ...entry,
      status: "finished",
      winner,
      resultSummary:
        winner === "playerOne"
          ? `${entry?.playerTwo?.name || "Jogador 2"} nao voltou em 60 segundos. ${entry?.playerOne?.name || "Jogador 1"} venceu por abandono.`
          : `${entry?.playerOne?.name || "Jogador 1"} nao voltou em 60 segundos. ${entry?.playerTwo?.name || "Jogador 2"} venceu por abandono.`,
      finishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });
  return {
    ...store,
    waiting: (Array.isArray(store.waiting) ? store.waiting : []).filter((entry) => {
      const createdAt = new Date(entry?.createdAt || 0).getTime();
      const keep = createdAt && now - createdAt < PUBPAID_PVP_WAIT_MS;
      if (!keep) {
        expiredWaiting.push(entry);
        if (entry?.escrow?.status === "locked") {
          releasePubpaidMatchEscrow(entry.player, entry.stake);
        }
      }
      return keep;
    }),
    matches: matches.filter((entry) => {
      if (entry?.status === "finished") {
        const finishedAt = new Date(entry?.finishedAt || entry?.updatedAt || 0).getTime();
        return finishedAt && now - finishedAt < PUBPAID_PVP_MATCH_MS;
      }
      const startedAt = new Date(entry?.startedAt || entry?.createdAt || 0).getTime();
      return startedAt && now - startedAt < PUBPAID_PVP_MATCH_MS;
    }),
  };
}

function getPubpaidWalletRecordByKey(walletKey = "") {
  const key = safeString(walletKey, 180).toLowerCase();
  if (!key) return null;
  const wallets = getPubpaidWalletStore();
  const record = wallets && typeof wallets === "object" ? wallets[key] : null;
  return record ? normalizePubpaidWalletRecord(record) : null;
}

function savePubpaidWalletRecordByKey(walletKey = "", patch = {}) {
  const key = safeString(walletKey, 180).toLowerCase();
  if (!key) return null;
  const wallets = getPubpaidWalletStore();
  const current = normalizePubpaidWalletRecord(wallets?.[key] || {});
  const next = normalizePubpaidWalletRecord({
    ...current,
    ...patch,
    updatedAt: new Date().toISOString(),
  });
  savePubpaidWalletStore({
    ...(wallets && typeof wallets === "object" ? wallets : {}),
    [key]: {
      ...next,
      playerId: key,
      walletKey: key,
      playerName: safeString(patch.playerName || next.playerName || next?.user?.name || "", 120) || "Jogador",
    },
  });
  return next;
}

function lockPubpaidMatchEscrow(player = {}, stake = 0) {
  const walletKey = safeString(player?.walletKey || "", 180).toLowerCase();
  const amount = normalizePubpaidMoney(stake);
  const wallet = getPubpaidWalletRecordByKey(walletKey);
  if (!wallet || amount <= 0) {
    return { ok: false, error: "Carteira PubPaid nao encontrada." };
  }
  const available = normalizePubpaidMoney(wallet.availableCoins ?? (wallet.balanceCoins - wallet.lockedMatchCoins - wallet.lockedWithdrawalCoins));
  if (available < amount) {
    return { ok: false, error: "Saldo real disponivel insuficiente para travar escrow nessa mesa." };
  }
  const next = savePubpaidWalletRecordByKey(walletKey, {
    ...wallet,
    lockedMatchCoins: normalizePubpaidMoney(wallet.lockedMatchCoins + amount),
    playerName: player.name,
  });
  return { ok: true, wallet: next };
}

function releasePubpaidMatchEscrow(player = {}, amount = 0) {
  const walletKey = safeString(player?.walletKey || "", 180).toLowerCase();
  const wallet = getPubpaidWalletRecordByKey(walletKey);
  if (!wallet) return null;
  return savePubpaidWalletRecordByKey(walletKey, {
    ...wallet,
    lockedMatchCoins: Math.max(0, normalizePubpaidMoney(wallet.lockedMatchCoins - normalizePubpaidMoney(amount))),
    playerName: player.name,
  });
}

function creditPubpaidMatchPayout(player = {}, amount = 0) {
  const walletKey = safeString(player?.walletKey || "", 180).toLowerCase();
  const wallet = getPubpaidWalletRecordByKey(walletKey);
  if (!wallet) return null;
  return savePubpaidWalletRecordByKey(walletKey, {
    ...wallet,
    balanceCoins: normalizePubpaidMoney(wallet.balanceCoins + normalizePubpaidMoney(amount)),
    playerName: player.name,
  });
}

function settlePubpaidPvpMatch(match = {}) {
  if (!match || match.status !== "finished" || match.settlement?.status === "settled") return match;
  const stake = normalizePubpaidMoney(match.stake);
  const pot = normalizePubpaidMoney(stake * 2);
  const houseFee = match.winner ? normalizePubpaidMoney(pot * 0.2) : 0;
  const payout = match.winner ? normalizePubpaidMoney(pot - houseFee) : stake;
  releasePubpaidMatchEscrow(match.playerOne, stake);
  releasePubpaidMatchEscrow(match.playerTwo, stake);
  if (match.winner === "playerOne") {
    creditPubpaidMatchPayout(match.playerOne, payout);
  } else if (match.winner === "playerTwo") {
    creditPubpaidMatchPayout(match.playerTwo, payout);
  } else {
    creditPubpaidMatchPayout(match.playerOne, stake);
    creditPubpaidMatchPayout(match.playerTwo, stake);
  }
  return {
    ...match,
    settlement: {
      status: "settled",
      stake,
      pot,
      houseFee,
      payout,
      settledAt: new Date().toISOString(),
    },
  };
}

function settleFinishedPubpaidPvpMatches(store = emptyPubpaidPvpStore()) {
  return {
    ...store,
    matches: (Array.isArray(store.matches) ? store.matches : []).map((match) => settlePubpaidPvpMatch(match)),
  };
}

function normalizePubpaidPvpGameId(value = "") {
  const normalized = safeString(value, 40).toLowerCase();
  return PUBPAID_PVP_ENABLED_GAMES.has(normalized) ? normalized : "";
}

function createCheckersPvPBoard() {
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
  return board;
}

function drawPubpaid21Card(stateCards) {
  const deck = [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 11];
  const value = deck[Math.floor(Math.random() * deck.length)];
  stateCards.drawCount = clampInteger(stateCards.drawCount) + 1;
  return value;
}

function sumPubpaid21Cards(cards = []) {
  let total = (Array.isArray(cards) ? cards : []).reduce((sum, card) => sum + clampInteger(card), 0);
  let aces = (Array.isArray(cards) ? cards : []).filter((card) => clampInteger(card) === 11).length;
  while (total > 21 && aces > 0) {
    total -= 10;
    aces -= 1;
  }
  return total;
}

function createCards21PvPState() {
  const cardsState = {
    drawCount: 0,
    playerOneCards: [],
    playerTwoCards: [],
    playerOneState: "active",
    playerTwoState: "active",
  };
  cardsState.playerOneCards.push(drawPubpaid21Card(cardsState));
  cardsState.playerOneCards.push(drawPubpaid21Card(cardsState));
  cardsState.playerTwoCards.push(drawPubpaid21Card(cardsState));
  cardsState.playerTwoCards.push(drawPubpaid21Card(cardsState));
  return cardsState;
}

function createPokerPvpDeck() {
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

function drawPokerPvpCards(deck, count) {
  const cards = [];
  for (let index = 0; index < count; index += 1) {
    const card = deck.pop();
    if (card) cards.push(card);
  }
  return cards;
}

function createPokerPvPState() {
  const deck = createPokerPvpDeck();
  return {
    deck,
    playerOneCards: drawPokerPvpCards(deck, 5),
    playerTwoCards: drawPokerPvpCards(deck, 5),
    playerOneHeld: [false, false, false, false, false],
    playerTwoHeld: [false, false, false, false, false],
    playerOneDrawUsed: false,
    playerTwoDrawUsed: false,
  };
}

function countPokerPvpRanks(cards = []) {
  const counts = new Map();
  cards.forEach((card) => counts.set(card.rank, (counts.get(card.rank) || 0) + 1));
  return counts;
}

function isPokerPvpStraight(uniqueRanks = []) {
  if (uniqueRanks.length !== 5) return false;
  for (let index = 0; index < uniqueRanks.length - 1; index += 1) {
    if (uniqueRanks[index] - 1 !== uniqueRanks[index + 1]) {
      return uniqueRanks.join(",") === "14,5,4,3,2";
    }
  }
  return true;
}

function evaluatePokerPvpHand(cards = []) {
  const sorted = cards.slice().sort((a, b) => b.rank - a.rank);
  const ranks = sorted.map((card) => card.rank);
  const suits = sorted.map((card) => card.suit);
  const counts = Array.from(countPokerPvpRanks(sorted).entries()).sort((a, b) => b[1] - a[1] || b[0] - a[0]);
  const uniqueRanks = Array.from(new Set(ranks)).sort((a, b) => b - a);
  const flush = suits.every((suit) => suit === suits[0]);
  const straight = isPokerPvpStraight(uniqueRanks);

  if (flush && straight) {
    return { score: 8, label: "straight flush", tiebreak: [uniqueRanks[0] === 14 && uniqueRanks[1] === 5 ? 5 : uniqueRanks[0]] };
  }
  if (counts[0]?.[1] === 4) {
    return { score: 7, label: "quadra", tiebreak: [counts[0][0], counts[1][0]] };
  }
  if (counts[0]?.[1] === 3 && counts[1]?.[1] === 2) {
    return { score: 6, label: "full house", tiebreak: [counts[0][0], counts[1][0]] };
  }
  if (flush) {
    return { score: 5, label: "flush", tiebreak: uniqueRanks };
  }
  if (straight) {
    return { score: 4, label: "sequência", tiebreak: [uniqueRanks[0] === 14 && uniqueRanks[1] === 5 ? 5 : uniqueRanks[0]] };
  }
  if (counts[0]?.[1] === 3) {
    return { score: 3, label: "trinca", tiebreak: [counts[0][0], ...uniqueRanks.filter((rank) => rank !== counts[0][0])] };
  }
  if (counts[0]?.[1] === 2 && counts[1]?.[1] === 2) {
    const pairs = counts.filter((entry) => entry[1] === 2).map((entry) => entry[0]).sort((a, b) => b - a);
    const kicker = uniqueRanks.find((rank) => !pairs.includes(rank)) || 0;
    return { score: 2, label: "dois pares", tiebreak: [...pairs, kicker] };
  }
  if (counts[0]?.[1] === 2) {
    return { score: 1, label: "par", tiebreak: [counts[0][0], ...uniqueRanks.filter((rank) => rank !== counts[0][0])] };
  }
  return { score: 0, label: "carta alta", tiebreak: uniqueRanks };
}

function comparePokerPvpHands(a, b) {
  if (a.score !== b.score) return a.score > b.score ? 1 : -1;
  const maxLength = Math.max(a.tiebreak.length, b.tiebreak.length);
  for (let index = 0; index < maxLength; index += 1) {
    const left = a.tiebreak[index] || 0;
    const right = b.tiebreak[index] || 0;
    if (left !== right) return left > right ? 1 : -1;
  }
  return 0;
}

function createDartsPvPState() {
  return {
    round: 1,
    maxRounds: 3,
    playerOneScore: 0,
    playerTwoScore: 0,
    playerOneThrow: null,
    playerTwoThrow: null,
    lastPlayerOne: null,
    lastPlayerTwo: null,
    playerOneAimX: 50,
    playerOneAimY: 50,
    playerTwoAimX: 50,
    playerTwoAimY: 50,
    history: [],
  };
}

function createDicecupsPvPState() {
  return {
    round: 1,
    maxRounds: 3,
    playerOneScore: 0,
    playerTwoScore: 0,
    playerOneGuess: 0,
    playerTwoGuess: 0,
    dice: [0, 0],
    total: 0,
    history: [],
  };
}

function clampDartsAimValue(value, fallback = 50) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return fallback;
  return Math.max(0, Math.min(100, numeric));
}

function getDartboardScoreFromPoint(x, y) {
  const dx = clampDartsAimValue(x, 50) - 50;
  const dy = clampDartsAimValue(y, 50) - 50;
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

function getDartAimDifficulty(target) {
  if (!target || target.ring === "miss") return 0.9;
  if (target.ring === "bull") return 1.45;
  if (target.ring === "outerBull") return 1.2;
  if (target.ring === "triple" || target.ring === "double") return 1.15;
  return 0.82;
}

function randomDartSpread(range) {
  return (Math.random() * 2 - 1) * range + (Math.random() * 2 - 1) * range * 0.55;
}

function rollDartsPvpThrow(aimX, aimY) {
  const target = getDartboardScoreFromPoint(aimX, aimY);
  const difficulty = getDartAimDifficulty(target);
  const spread = Math.max(4, 8 + difficulty * 8);
  const finalX = clampDartsAimValue(aimX + randomDartSpread(spread), 50);
  const finalY = clampDartsAimValue(aimY + randomDartSpread(spread), 50);
  const outcome = getDartboardScoreFromPoint(finalX, finalY);
  return {
    aimX: clampDartsAimValue(aimX, 50),
    aimY: clampDartsAimValue(aimY, 50),
    targetLabel: target.label,
    score: outcome.score,
    ring: outcome.ring,
    number: outcome.number,
    multiplier: outcome.multiplier,
    label: outcome.label,
    x: finalX,
    y: finalY,
  };
}

function getCards21SeatStateKey(seat = "") {
  return seat === "playerOne" ? "playerOneState" : seat === "playerTwo" ? "playerTwoState" : "";
}

function getCards21SeatCardsKey(seat = "") {
  return seat === "playerOne" ? "playerOneCards" : seat === "playerTwo" ? "playerTwoCards" : "";
}

function createPubpaidPvpMatch(gameId, stake, playerOne, playerTwo) {
  const match = {
    id: createRecordId("pvp"),
    gameId,
    stake,
    status: "active",
    createdAt: new Date().toISOString(),
    startedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    playerOne,
    playerTwo,
    winner: "",
    resultSummary: "",
    moveCount: 0,
  };

  if (gameId === "checkers") {
    return {
      ...match,
      board: createCheckersPvPBoard(),
      turn: "playerOne",
    };
  }

  if (gameId === "cards21") {
    return {
      ...match,
      turn: "playerOne",
      cardsState: createCards21PvPState(),
      resultSummary: `${playerOne?.name || "Jogador 1"} compra ou para primeiro.`,
    };
  }

  if (gameId === "poker") {
    return {
      ...match,
      turn: "playerOne",
      pokerState: createPokerPvPState(),
      resultSummary: `${playerOne?.name || "Jogador 1"} segura cartas e troca primeiro.`,
    };
  }

  if (gameId === "darts") {
    return {
      ...match,
      turn: "playerOne",
      dartsState: createDartsPvPState(),
      resultSummary: `${playerOne?.name || "Jogador 1"} mira primeiro no alvo.`,
    };
  }

  if (gameId === "dicecups") {
    return {
      ...match,
      turn: "playerOne",
      diceState: createDicecupsPvPState(),
      resultSummary: `${playerOne?.name || "Jogador 1"} escolhe a soma primeiro.`,
    };
  }

  return match;
}

function resolveCards21PvpMatch(match) {
  const cardsState = match?.cardsState || createCards21PvPState();
  const playerOneTotal = sumPubpaid21Cards(cardsState.playerOneCards);
  const playerTwoTotal = sumPubpaid21Cards(cardsState.playerTwoCards);
  const playerOneLive = playerOneTotal <= 21;
  const playerTwoLive = playerTwoTotal <= 21;

  if (!playerOneLive && !playerTwoLive) {
    return {
      winner: "",
      resultSummary: "As duas maos estouraram. A mesa devolveu a entrada.",
    };
  }
  if (!playerOneLive) {
    return {
      winner: "playerTwo",
      resultSummary: `${match?.playerOne?.name || "Jogador 1"} estourou. ${match?.playerTwo?.name || "Jogador 2"} levou a mesa do 21.`,
    };
  }
  if (!playerTwoLive) {
    return {
      winner: "playerOne",
      resultSummary: `${match?.playerTwo?.name || "Jogador 2"} estourou. ${match?.playerOne?.name || "Jogador 1"} levou a mesa do 21.`,
    };
  }
  if (playerOneTotal > playerTwoTotal) {
    return {
      winner: "playerOne",
      resultSummary: `${match?.playerOne?.name || "Jogador 1"} travou melhor em ${playerOneTotal} e venceu o 21.`,
    };
  }
  if (playerTwoTotal > playerOneTotal) {
    return {
      winner: "playerTwo",
      resultSummary: `${match?.playerTwo?.name || "Jogador 2"} travou melhor em ${playerTwoTotal} e venceu o 21.`,
    };
  }
  return {
    winner: "",
    resultSummary: `As duas maos fecharam em ${playerOneTotal}. A mesa devolveu a entrada.`,
  };
}

function getPvpCheckersOwner(piece = "") {
  if (!piece) return "";
  return piece.toLowerCase() === "p" ? "playerOne" : "playerTwo";
}

function getPvpCheckersDirections(piece = "") {
  if (!piece) return [];
  if (piece === piece.toUpperCase()) return [[-1, -1], [-1, 1], [1, -1], [1, 1]];
  return piece.toLowerCase() === "p" ? [[-1, -1], [-1, 1]] : [[1, -1], [1, 1]];
}

function inPvpCheckersBounds(row, col) {
  return row >= 0 && row < 8 && col >= 0 && col < 8;
}

function crownPvpCheckersPiece(piece, row) {
  if (piece === "p" && row === 0) return "P";
  if (piece === "o" && row === 7) return "O";
  return piece;
}

function clonePvpCheckersBoard(board = []) {
  return board.map((row) => row.slice());
}

function getMovesForPvpCheckersPiece(board, row, col) {
  const piece = board?.[row]?.[col];
  if (!piece) return [];
  const owner = getPvpCheckersOwner(piece);
  const enemy = owner === "playerOne" ? "playerTwo" : "playerOne";
  const moves = [];
  getPvpCheckersDirections(piece).forEach(([rowStep, colStep]) => {
    const nextRow = row + rowStep;
    const nextCol = col + colStep;
    if (!inPvpCheckersBounds(nextRow, nextCol)) return;
    if (!board[nextRow][nextCol]) {
      moves.push({ from: { row, col }, to: { row: nextRow, col: nextCol }, capture: null });
      return;
    }
    if (getPvpCheckersOwner(board[nextRow][nextCol]) !== enemy) return;
    const jumpRow = nextRow + rowStep;
    const jumpCol = nextCol + colStep;
    if (!inPvpCheckersBounds(jumpRow, jumpCol) || board[jumpRow][jumpCol]) return;
    moves.push({
      from: { row, col },
      to: { row: jumpRow, col: jumpCol },
      capture: { row: nextRow, col: nextCol },
    });
  });
  return moves;
}

function getAllPvpCheckersMoves(board, owner) {
  const moves = [];
  for (let row = 0; row < 8; row += 1) {
    for (let col = 0; col < 8; col += 1) {
      if (getPvpCheckersOwner(board[row][col]) !== owner) continue;
      moves.push(...getMovesForPvpCheckersPiece(board, row, col));
    }
  }
  const captures = moves.filter((move) => move.capture);
  return captures.length ? captures : moves;
}

function applyPvpCheckersMove(board, move) {
  const next = clonePvpCheckersBoard(board);
  const piece = next[move.from.row][move.from.col];
  next[move.from.row][move.from.col] = "";
  if (move.capture) next[move.capture.row][move.capture.col] = "";
  next[move.to.row][move.to.col] = crownPvpCheckersPiece(piece, move.to.row);
  return next;
}

function countPvpCheckersPieces(board, owner) {
  let count = 0;
  for (let row = 0; row < 8; row += 1) {
    for (let col = 0; col < 8; col += 1) {
      if (getPvpCheckersOwner(board[row][col]) === owner) count += 1;
    }
  }
  return count;
}

function getPvpCheckersOutcome(board) {
  const playerOnePieces = countPvpCheckersPieces(board, "playerOne");
  const playerTwoPieces = countPvpCheckersPieces(board, "playerTwo");
  if (!playerOnePieces) return "playerTwo";
  if (!playerTwoPieces) return "playerOne";
  if (!getAllPvpCheckersMoves(board, "playerOne").length) return "playerTwo";
  if (!getAllPvpCheckersMoves(board, "playerTwo").length) return "playerOne";
  return "";
}

function createPubpaidPvpPlayer(authUser = {}, profile = {}) {
  return {
    walletKey: getPubpaidWalletKey(authUser),
    sub: safeString(authUser.sub, 160),
    email: cleanEmail(authUser.email),
    name: cleanShortText(profile.name || authUser.name || authUser.givenName || "Jogador", 100),
    archetype: cleanShortText(profile.archetype || "neon", 40) || "neon",
    favorite: cleanShortText(profile.favorite || "", 40),
    picture: safeString(authUser.picture, 360),
  };
}

function buildPubpaidPvpStatePayload(store, authUser, gameId) {
  const walletKey = getPubpaidWalletKey(authUser);
  const waitingEntry = store.waiting.find((entry) => entry?.gameId === gameId && entry?.player?.walletKey === walletKey) || null;
  const matchEntry = store.matches.find((entry) =>
    entry?.gameId === gameId &&
    ["active", "abandoned", "finished"].includes(entry?.status) &&
    [entry?.playerOne?.walletKey, entry?.playerTwo?.walletKey].includes(walletKey)
  ) || null;
  const seat = matchEntry
    ? matchEntry.playerOne?.walletKey === walletKey
      ? "playerOne"
      : "playerTwo"
    : "";
  return {
    ok: true,
    gameId,
    state: matchEntry ? matchEntry.status : waitingEntry ? "waiting" : "idle",
    seat,
    queue: waitingEntry,
    match: matchEntry,
  };
}

async function appendCanonicalPubpaidItem(collectionKey, item) {
  return withCanonicalPubpaidLock(() => {
    const store = readCanonicalPubpaidStore();
    const nextItems = Array.isArray(store?.[collectionKey]) ? store[collectionKey].slice() : [];
    nextItems.push(item);
    return writeCanonicalPubpaidStore({
      ...store,
      [collectionKey]: nextItems,
    });
  });
}

function readMergedPubpaidArray(primaryFile, legacyFile) {
  const store = readCanonicalPubpaidStore();
  const normalizedPrimary = String(primaryFile || "");
  const normalizedLegacy = String(legacyFile || "");

  if (normalizedPrimary.includes("withdraw") || normalizedLegacy.includes("withdraw")) {
    return store.withdrawals.slice();
  }

  return store.deposits.slice();
}

function getPubpaidWalletStore() {
  return readCanonicalPubpaidStore().wallets;
}

function writePubpaidArrayCompat(primaryFile, legacyFile, items = []) {
  const store = readCanonicalPubpaidStore();
  const normalizedPrimary = String(primaryFile || "");
  const normalizedLegacy = String(legacyFile || "");

  if (normalizedPrimary.includes("withdraw") || normalizedLegacy.includes("withdraw")) {
    const nextStore = {
      ...store,
      withdrawals: Array.isArray(items) ? items : [],
    };
    return require("./pubpaid-runtime").writeStore(nextStore).withdrawals;
  }

  const nextStore = {
    ...store,
    deposits: Array.isArray(items) ? items : [],
  };
  return require("./pubpaid-runtime").writeStore(nextStore).deposits;
}

function savePubpaidWalletStore(wallets = {}) {
  const store = readCanonicalPubpaidStore();
  return require("./pubpaid-runtime").writeStore({
    ...store,
    wallets: wallets || {},
  }).wallets;
}

function sendPubpaidAdminDashboard(res) {
  const payload = buildPubpaidAdminPayload();
  return res.json({
    ok: true,
    dashboard: payload.dashboard,
    pendingPubpaidDeposits: payload.pendingPubpaidDeposits,
    pendingPubpaidWithdrawals: payload.pendingPubpaidWithdrawals,
    pubpaidWalletBoard: payload.pubpaidWalletBoard,
  });
}

function patchPubpaidAdminRoutes() {
  if (typeof app === "undefined" || !app || !app._router || !Array.isArray(app._router.stack)) {
    return;
  }

  const replaceRouteHandler = (routePath, method, handler) => {
    for (const layer of app._router.stack) {
      if (!layer || !layer.route || layer.route.path !== routePath) {
        continue;
      }
      if (!layer.route.methods || !layer.route.methods[method]) {
        continue;
      }
      layer.route.stack = [
        {
          handle: handler,
          name: handler.name || "patchedPubpaidHandler",
          params: undefined,
          path: undefined,
          keys: [],
          method,
        },
      ];
    }
  };

  replaceRouteHandler("/api/pubpaid-admin/dashboard", "get", function patchedPubpaidDashboard(_req, res) {
    return sendPubpaidAdminDashboard(res);
  });

  replaceRouteHandler("/api/pubpaid-admin/deposits/review", "post", async function patchedPubpaidDepositReview(req, res) {
    try {
      const body = req.body || {};
      const result = await reviewCanonicalPubpaidDeposit({
        depositId: body.depositId || body.id,
        decision: body.decision,
        reviewer: body.reviewer || body.adminUser || body.username,
        reason: body.reason || body.reviewReason,
      });
      return res.json({
        ok: true,
        idempotent: result.idempotent,
        item: result.item,
        dashboard: result.dashboard,
        pendingPubpaidDeposits: result.dashboard.pendingDeposits,
        pendingPubpaidWithdrawals: result.dashboard.pendingWithdrawals,
        pubpaidWalletBoard: result.dashboard.walletBoard,
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        ok: false,
        error: error.message || "Falha ao revisar depósito.",
      });
    }
  });

  replaceRouteHandler("/api/pubpaid-admin/withdrawals/review", "post", async function patchedPubpaidWithdrawalReview(req, res) {
    try {
      const body = req.body || {};
      const result = await reviewCanonicalPubpaidWithdrawal({
        withdrawalId: body.withdrawalId || body.id,
        decision: body.decision,
        reviewer: body.reviewer || body.adminUser || body.username,
        reason: body.reason || body.reviewReason,
      });
      return res.json({
        ok: true,
        idempotent: result.idempotent,
        item: result.item,
        dashboard: result.dashboard,
        pendingPubpaidDeposits: result.dashboard.pendingDeposits,
        pendingPubpaidWithdrawals: result.dashboard.pendingWithdrawals,
        pubpaidWalletBoard: result.dashboard.walletBoard,
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        ok: false,
        error: error.message || "Falha ao revisar saque.",
      });
    }
  });
}

process.nextTick(patchPubpaidAdminRoutes);
