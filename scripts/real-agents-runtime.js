#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const ROOT_DIR = path.resolve(__dirname, "..");
const AGENTS_DIR = path.join(ROOT_DIR, ".codex-agents");
const AGENT_FILES_DIR = path.join(AGENTS_DIR, "agents");
const RUNTIME_DIR = path.join(ROOT_DIR, ".codex-temp", "real-agents");
const REGISTRY_FILE = path.join(AGENTS_DIR, "registry.json");
const RUN_FILE = path.join(RUNTIME_DIR, "latest-run.json");
const RUN_MD_FILE = path.join(RUNTIME_DIR, "latest-run.md");
const AGENT_ARTIFACTS_DIR = path.join(RUNTIME_DIR, "artifacts");
const AGENT_ACTIONS_FILE = path.join(ROOT_DIR, "data", "real-agents-actions.json");
const RUNTIME_NEWS_FILE = path.join(ROOT_DIR, "data", "runtime-news.json");
const ARCHIVE_NEWS_FILE = path.join(ROOT_DIR, "data", "news-archive.json");
const AGENT_MEMORY_FILE = path.join(ROOT_DIR, "data", "real-agents-memory.json");
const AGENT_SCOREBOARD_FILE = path.join(ROOT_DIR, "data", "real-agents-scoreboard.json");
const OFFICE_ORDERS_FILE = path.join(ROOT_DIR, "data", "office-orders.json");
const HEARTBEATS_FILE = path.join(ROOT_DIR, "data", "heartbeats.json");
const REVIEW_REPORT_FILE = path.join(ROOT_DIR, ".codex-temp", "review-team", "latest-report.json");
const DEFAULT_OFFICE_FILE = path.join(ROOT_DIR, "escritorio.js");
const OFFICE_CONFIG_FILES = [
  path.join(ROOT_DIR, "escritorio-nerd-config.js"),
  path.join(ROOT_DIR, "escritorio-ninjas-config.js"),
  path.join(ROOT_DIR, "escritorio-arte-config.js"),
  path.join(ROOT_DIR, "esttiles-config.js")
];

const OFFICE_LABELS = {
  "editorial-hq": "Escritorio Principal",
  "nerd-studio": "Escritorio Nerd",
  "ninja-vault": "Escritorio de Ninjas",
  "arte-game-design": "Escritorio de Arte",
  "esttiles-fashion": "Esttiles"
};

const DEFAULT_ROLE_PROFILE = {
  capabilities: ["leitura de temas", "observacao continua", "ideias operacionais"],
  monitoringFocus: ["novidades do jornal", "sinais editoriais", "rotina do portal"],
  deliverables: ["alertas", "ideias", "observacoes operacionais"]
};

const ROLE_PROFILES = {
  ceo: {
    capabilities: ["priorizacao editorial", "coordenacao de frentes", "decisao de foco"],
    monitoringFocus: ["agenda critica do dia", "gargalos entre equipes", "frentes com maior impacto"],
    deliverables: ["diretriz do dia", "prioridades", "redistribuicao de atencao"]
  },
  editor: {
    capabilities: ["hierarquia de capa", "edicao de manchetes", "enquadramento editorial"],
    monitoringFocus: ["manchetes principais", "ordem das noticias", "peso de cada cobertura"],
    deliverables: ["angulo de capa", "ajuste de hierarquia", "chamada principal"]
  },
  review: {
    capabilities: ["triagem de qualidade", "checagem de CTA", "detalhe editorial"],
    monitoringFocus: ["bugs visiveis", "copy interna vazando", "quebras de leitura"],
    deliverables: ["lista de achados", "prioridade de correcao", "travamentos de publicacao"]
  },
  copy: {
    capabilities: ["reescrita de titulo", "microcopy", "clareza textual"],
    monitoringFocus: ["tom do portal", "textos frios", "gancho para clique util"],
    deliverables: ["titulos alternativos", "copys de apoio", "ajustes de tom"]
  },
  games: {
    capabilities: ["produto interativo", "gamificacao editorial", "formatos especiais"],
    monitoringFocus: ["temas com potencial de experiencia", "subsites tematicos", "interacoes jogaveis"],
    deliverables: ["ideia de especial", "gancho interativo", "aplicacao em games/subpaginas"]
  },
  kids: {
    capabilities: ["leitura familiar", "adaptacao didatica", "seguranca de linguagem"],
    monitoringFocus: ["temas educativos", "assuntos sensiveis", "aproveitamento infantil/familia"],
    deliverables: ["angulo para familia", "resumo didatico", "alerta de adequacao"]
  },
  sources: {
    capabilities: ["mapeamento de fontes", "expansao de cobertura", "checagem de origem"],
    monitoringFocus: ["dominios por editoria", "lacunas de fonte", "dependencia excessiva"],
    deliverables: ["lacuna de fonte", "fonte sugerida", "necessidade de diversificacao"]
  },
  sales: {
    capabilities: ["oportunidade comercial", "vitrine local", "posicionamento de oferta"],
    monitoringFocus: ["temas com potencial de servico", "espacos de patrocinio", "interesse do publico"],
    deliverables: ["ideia de vitrine", "gancho comercial", "oportunidade de servico"]
  },
  design: {
    capabilities: ["hierarquia visual", "embalagem de noticia", "sistema de cards"],
    monitoringFocus: ["thumbs e imagens", "destaques visuais", "densidade de interface"],
    deliverables: ["melhoria visual", "card ou hero sugerido", "rearranjo de bloco"]
  },
  pixel: {
    capabilities: ["assets originais", "iconografia", "sinais visuais ilustrados"],
    monitoringFocus: ["faltas de identidade visual", "oportunidades de sprite/ilustracao", "efeitos de presenca"],
    deliverables: ["asset sugerido", "intervencao visual", "kit de elementos"]
  },
  social: {
    capabilities: ["buzz", "leitura de comunidade", "gancho de redes"],
    monitoringFocus: ["assuntos com potencial de compartilhamento", "humanizacao", "rastro social"],
    deliverables: ["gancho de rede", "reel/post sugerido", "alerta de repercussao"]
  },
  dev: {
    capabilities: ["automacao", "rotinas de monitoramento", "estabilidade operacional"],
    monitoringFocus: ["rotinas manuais repetidas", "dados sem observacao", "monitoramento tecnico"],
    deliverables: ["script sugerido", "automacao", "alerta tecnico"]
  }
};

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function readJson(filePath, fallback) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return fallback;
  }
}

function writeJson(filePath, payload) {
  fs.writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`, "utf-8");
}

function writeText(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, "utf-8");
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

function hashString(value) {
  let hash = 0;
  const text = String(value || "");
  for (let index = 0; index < text.length; index += 1) {
    hash = (hash * 31 + text.charCodeAt(index)) >>> 0;
  }
  return hash;
}

function unique(values) {
  return [...new Set((values || []).filter(Boolean))];
}

function pickTop(items, selector, limit = 3) {
  const counts = new Map();
  (items || []).forEach((item) => {
    const key = selector(item);
    if (!key) return;
    counts.set(key, (counts.get(key) || 0) + 1);
  });

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || String(a[0]).localeCompare(String(b[0]), "pt-BR"))
    .slice(0, limit)
    .map(([value, count]) => ({ value, count }));
}

function loadDefaultAgents() {
  const source = fs.readFileSync(DEFAULT_OFFICE_FILE, "utf-8");
  const start = source.indexOf("const defaultAgents = [");
  const end = source.indexOf("];", start) + 2;
  const snippet = source.slice(start, end).replace("const defaultAgents =", "module.exports =");
  const sandbox = { module: { exports: [] }, sx: (value) => value, sy: (value) => value };
  vm.runInNewContext(snippet, sandbox, { timeout: 1000 });
  const defaultSpriteProfiles = loadDefaultSpriteProfiles();
  return sandbox.module.exports.map((agent) => ({
    ...agent,
    officeKey: "editorial-hq",
    officeLabel: OFFICE_LABELS["editorial-hq"],
    sourceFile: "escritorio.js",
    spriteProfile: defaultSpriteProfiles[agent.id] || null
  }));
}

function loadDefaultSpriteProfiles() {
  const source = fs.readFileSync(DEFAULT_OFFICE_FILE, "utf-8");
  const start = source.indexOf("const defaultSpriteProfiles = {");
  const end = source.indexOf("};", start) + 2;
  const snippet = source.slice(start, end).replace("const defaultSpriteProfiles =", "module.exports =");
  const sandbox = { module: { exports: {} } };
  vm.runInNewContext(snippet, sandbox, { timeout: 1000 });
  return sandbox.module.exports || {};
}

function loadOfficeConfig(filePath) {
  const sandbox = { window: {} };
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(filePath, "utf-8"), sandbox, { filename: filePath, timeout: 1000 });
  const config = sandbox.window.__OFFICE_CONFIG__ || {};
  return (config.agents || []).map((agent) => ({
    ...agent,
    officeKey: config.officeKey || slugify(path.basename(filePath, ".js")),
    officeLabel: OFFICE_LABELS[config.officeKey] || config.officeKey || "Office",
    sourceFile: path.basename(filePath),
    spriteProfile: config.spriteProfiles?.[agent.id] || null
  }));
}

function loadAllAgents() {
  return [loadDefaultAgents(), ...OFFICE_CONFIG_FILES.map((filePath) => loadOfficeConfig(filePath))].flat();
}

function loadNewsItems() {
  const runtime = readJson(RUNTIME_NEWS_FILE, {});
  const runtimeItems = Array.isArray(runtime.items) ? runtime.items : [];
  if (runtimeItems.length) return runtimeItems;
  return readJson(ARCHIVE_NEWS_FILE, []);
}

function normalizeCategory(item) {
  return String(item.category || item.topicGroup || "Geral").trim();
}

function normalizeDate(value) {
  const date = new Date(value || Date.now());
  if (Number.isNaN(date.getTime())) return new Date(0);
  return date;
}

function pad2(value) {
  return String(value).padStart(2, "0");
}

function getIsoWeekKey(date) {
  const current = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = current.getUTCDay() || 7;
  current.setUTCDate(current.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(current.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((current - yearStart) / 86400000 + 1) / 7);
  return `${current.getUTCFullYear()}-W${pad2(week)}`;
}

function getPeriodKeys(date = new Date()) {
  return {
    day: date.toISOString().slice(0, 10),
    week: getIsoWeekKey(date),
    month: `${date.getFullYear()}-${pad2(date.getMonth() + 1)}`
  };
}

function getRoleProfile(role) {
  return ROLE_PROFILES[role] || DEFAULT_ROLE_PROFILE;
}

function buildOfficeOverlay(agent) {
  const officeKey = agent.officeKey;
  if (officeKey === "nerd-studio") {
    return {
      journalCapabilities: ["embalar noticias em experiencias", "pensar formatos interativos", "sugerir produtos especiais"],
      newsroomBridge: "traduz o jornal em experiencias, jornadas e formatos interativos",
      monitoringExtra: ["portunidades de especial interativo", "blocos vivos do portal", "ritmo de navegacao"]
    };
  }

  if (officeKey === "ninja-vault") {
    return {
      journalCapabilities: ["mapear necessidades de assets", "sugerir kits visuais", "preparar base grafica do jornal"],
      newsroomBridge: "observa o jornal como demanda real de assets, ilustracao, HUD e biblioteca visual",
      monitoringExtra: ["lacunas de imagem", "cards que pedem asset proprio", "materias com potencial de kit visual"]
    };
  }

  if (officeKey === "arte-game-design") {
    return {
      journalCapabilities: ["desenhar graficos e especiais", "traduzir tema em mapa ou simulacao", "sugerir interacoes"],
      newsroomBridge: "olha a cobertura como materia-prima para especiais visuais, mapas e simulacoes",
      monitoringExtra: ["temas explicativos", "assuntos com potencial de mapa", "narrativas que pedem camada visual"]
    };
  }

  if (officeKey === "esttiles-fashion") {
    return {
      journalCapabilities: ["identificar angulos de moda e lifestyle", "melhorar embalagem visual", "puxar ganchos de consumo"],
      newsroomBridge: "vigia o jornal com lente de imagem publica, comportamento, vitrine e lifestyle",
      monitoringExtra: ["materias de comportamento", "vitrines locais", "potencial de cobertura visual"]
    };
  }

  return {
    journalCapabilities: ["monitorar o jornal", "propor melhorias editoriais", "sinalizar oportunidades"],
    newsroomBridge: "atua diretamente sobre a operacao editorial do portal",
    monitoringExtra: ["home", "destaques", "fluxo de leitura"]
  };
}

function enrichAgent(agent) {
  const roleProfile = getRoleProfile(agent.role);
  const overlay = buildOfficeOverlay(agent);
  const slug = slugify(`${agent.officeKey}-${agent.id || agent.name}`);
  const skills = unique([...(agent.skills || []), ...(roleProfile.capabilities || [])]);
  const capabilities = unique([...(overlay.journalCapabilities || []), ...(roleProfile.capabilities || []), ...(agent.skills || [])]);
  const monitoringFocus = unique([...(roleProfile.monitoringFocus || []), ...(overlay.monitoringExtra || []), agent.specialty]);
  const deliverables = unique(roleProfile.deliverables || []);

  return {
    id: agent.id || slug,
    slug,
    name: agent.name,
    officeKey: agent.officeKey,
    officeLabel: agent.officeLabel,
    role: agent.role || "general",
    title: agent.title || "",
    specialty: agent.specialty || "",
    description: agent.description || "",
    sourceFile: agent.sourceFile || "",
    spriteProfile: agent.spriteProfile || null,
    skills,
    capabilities,
    monitoringFocus,
    deliverables,
    newsroomBridge: overlay.newsroomBridge,
    workingPrompt:
      `Voce e ${agent.name}, agente real do ${agent.officeLabel}. ` +
      `Seu papel e ${agent.title || agent.role}. ` +
      `Monitore continuamente o jornal, destaque sinais relevantes, proponha ideias praticas e entregue saidas curtas e acionaveis em ${deliverables.join(", ")}.`
  };
}

function summarizeNews(newsItems) {
  const sorted = [...newsItems].sort((a, b) => normalizeDate(b.publishedAt) - normalizeDate(a.publishedAt));
  return {
    totalItems: newsItems.length,
    newestItems: sorted.slice(0, 6),
    topCategories: pickTop(newsItems, (item) => normalizeCategory(item)),
    topSources: pickTop(newsItems, (item) => item.sourceName || item.sourceLabel),
    imageCoverage: newsItems.filter((item) => item.imageUrl || item.feedImageUrl).length
  };
}

function pickLeadStory(newsItems, predicate) {
  return newsItems.find(predicate) || newsItems[0] || null;
}

function buildAssignment(agent, context) {
  const { newsItems, newsSummary, reviewReport } = context;
  const topCategory = newsSummary.topCategories[0]?.value || "Geral";
  const weakTopic = reviewReport?.sources?.topicSummary?.find((item) => item.status !== "ok");
  const topIssue = reviewReport?.issues?.[0] || null;

  let lead = null;
  let action = "";
  let idea = "";
  let monitor = "";

  switch (agent.role) {
    case "ceo":
      action = `redistribuir foco entre ${newsSummary.topCategories.slice(0, 3).map((item) => item.value).join(", ")}`;
      idea = `abrir uma rodada coordenada para reforcar ${topCategory} sem derrubar a diversidade de cobertura`;
      monitor = `acompanhar gargalos entre home, arquivo e revisao`;
      break;
    case "editor":
      lead = pickLeadStory(newsItems, (item) => normalizeCategory(item) === topCategory);
      action = `revisar a hierarquia de capa com prioridade para ${lead?.title || topCategory}`;
      idea = `testar uma chamada principal mais direta e uma linha de apoio mais local`;
      monitor = `vigiar repeticao de assunto e saturacao por categoria`;
      break;
    case "review":
      action = topIssue
        ? `corrigir ${topIssue.label.toLowerCase()} em ${topIssue.file}`
        : "rodar triagem fina em cards, CTAs e textos provisórios";
      idea = `fechar uma lista curta do que bloqueia publicacao agora`;
      monitor = `acompanhar regressao editorial e acessibilidade basica`;
      break;
    case "copy":
      lead = pickLeadStory(newsItems, (item) => normalizeCategory(item) === topCategory);
      action = `reescrever titulo, apoio e gancho de clique para ${lead?.title || topCategory}`;
      idea = `produzir duas variacoes de chamada: uma informativa e outra mais humana`;
      monitor = `caçar texto duro, frio ou vago nas vitrines do portal`;
      break;
    case "sources":
      action = weakTopic
        ? `expandir a malha de fontes de ${weakTopic.topic}`
        : "mapear dependencia excessiva das fontes atuais";
      idea = `sugerir fontes oficiais, especializadas e regionais para a proxima rodada`;
      monitor = `vigiar dominios unicos por editoria e cobertura fraca`;
      break;
    case "social":
      lead = pickLeadStory(newsItems, (item) => /cultura|social|neg[oó]cios/i.test(normalizeCategory(item)));
      action = `extrair um gancho social a partir de ${lead?.title || "um tema de comportamento"}`;
      idea = `sugerir reel, story ou enquete com linguagem de portal`;
      monitor = `vigiar potencial de repercussao e humanidade da cobertura`;
      break;
    case "design":
      lead = pickLeadStory(newsItems, (item) => item.imageUrl || item.feedImageUrl);
      action = `reforcar a embalagem visual de ${lead?.title || "um destaque com imagem"}`;
      idea = `propor hero, card ou faixa lateral com hierarquia mais limpa`;
      monitor = `vigiar cards sem respiro, thumbs fracas e disputas de leitura`;
      break;
    case "pixel":
      lead = pickLeadStory(newsItems, (item) => item.imageUrl || item.feedImageUrl);
      action = `mapear assets proprios que ajudariam ${lead?.title || "a home editorial"}`;
      idea = `especificar um kit visual com icones, badges ou ilustracoes`;
      monitor = `vigiar lacunas de identidade visual nas editorias`;
      break;
    case "dev":
      action = `identificar rotinas manuais para automatizar a partir de ${newsSummary.totalItems} noticias ativas`;
      idea = `abrir uma checagem automatica nova para ranking, cache ou saude editorial`;
      monitor = `vigiar jobs, relatorios e pontos cegos da operacao`;
      break;
    case "games":
      lead = pickLeadStory(newsItems, (item) => /cultura|esporte|cotidiano/i.test(normalizeCategory(item)));
      action = `transformar ${lead?.title || topCategory} em formato especial ou experiencia interativa`;
      idea = `sugerir quiz, mapa, simulacao ou vitrine especial em subpagina`;
      monitor = `vigiar temas com potencial de interacao`;
      break;
    case "kids":
      lead = pickLeadStory(newsItems, (item) => /educa|sa[úu]de|cultura/i.test(normalizeCategory(item)));
      action = `adaptar ${lead?.title || topCategory} para leitura familiar ou educativa`;
      idea = `sugerir bloco explicativo curto para publico familia`;
      monitor = `vigiar linguagem sensivel e oportunidades de abordagem didatica`;
      break;
    case "sales":
      lead = pickLeadStory(newsItems, (item) => /neg[oó]cios|cultura|social|cotidiano/i.test(normalizeCategory(item)));
      action = `extrair uma oportunidade comercial ou de servico a partir de ${lead?.title || topCategory}`;
      idea = `propor vitrine, guia ou servico associado ao interesse do leitor`;
      monitor = `vigiar temas com demanda local e potencial de anunciante`;
      break;
    default:
      action = `acompanhar ${topCategory} e organizar sugestoes acionaveis`;
      idea = `entregar uma ideia curta de melhoria para home, arquivo ou cobertura`;
      monitor = `vigiar sinais gerais do jornal`;
      break;
  }

  const headline = lead?.title || newsSummary.newestItems[0]?.title || topCategory;
  return {
    headline,
    action,
    idea,
    monitor,
    deliverable: agent.deliverables[0] || "observacao operacional"
  };
}

function clampNumber(value, min, max) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return min;
  return Math.min(max, Math.max(min, numeric));
}

function readAgentMemoryStore() {
  const payload = readJson(AGENT_MEMORY_FILE, { version: 1, agents: {} });
  return {
    version: 1,
    updatedAt: payload.updatedAt || "",
    agents: payload.agents && typeof payload.agents === "object" ? payload.agents : {}
  };
}

function writeAgentMemoryStore(store) {
  ensureDir(path.dirname(AGENT_MEMORY_FILE));
  writeJson(AGENT_MEMORY_FILE, {
    version: 1,
    updatedAt: new Date().toISOString(),
    agents: store.agents || {}
  });
}

function scoreAgentAutonomy(agent, assignment, context, previousMemory) {
  const reviewIssues = Array.isArray(context.reviewReport?.issues) ? context.reviewReport.issues.length : 0;
  const newsItems = context.newsSummary.totalItems || 0;
  const rolePressure = {
    ceo: 18,
    review: reviewIssues ? 26 : 12,
    sources: context.newsSummary.topSources.length < 3 ? 24 : 14,
    dev: 20,
    editor: 18,
    design: 16,
    copy: 15,
    social: 13,
    pixel: 12,
    games: 12,
    kids: 10,
    sales: 10
  }[agent.role] || 10;

  const memoryCycles = Number(previousMemory.cycles || 0);
  const urgency = clampNumber(35 + rolePressure + Math.min(20, reviewIssues * 3) + Math.min(12, newsItems / 10), 1, 100);
  const confidence = clampNumber(48 + Math.min(25, memoryCycles) + (assignment.headline ? 12 : 0), 1, 100);
  const autonomy = clampNumber(Math.round((urgency * 0.55 + confidence * 0.45)), 1, 100);

  return { urgency: Math.round(urgency), confidence: Math.round(confidence), autonomy };
}

function chooseAgentIntent(agent, assignment, scores, previousMemory) {
  const cycles = Number(previousMemory.cycles || 0);
  const previousAutonomy = Number(previousMemory.autonomy || 0);
  const previousConfidence = Number(previousMemory.confidence || 0);
  const isGrowing = scores.autonomy > previousAutonomy || scores.confidence > previousConfidence;

  if (scores.urgency >= 82) {
    return `crescer rapido abrindo alerta proprio sobre ${assignment.headline}`;
  }

  if (agent.role === "ceo") {
    return "subir o nivel da equipe redistribuindo prioridades sem esperar comando manual";
  }

  if (agent.role === "review") {
    return "ganhar confianca bloqueando pequenos vazamentos editoriais antes de virarem publicos";
  }

  if (agent.role === "sources") {
    return "crescer em autoridade procurando lacunas de fonte e preparando checagem";
  }

  if (agent.role === "dev") {
    return "subir de patente propondo automacao quando detectar tarefa repetida";
  }

  if (previousMemory.lastIntent && scores.confidence < 65) {
    return previousMemory.lastIntent;
  }

  if (cycles >= 3 && !isGrowing) {
    return `sair da estagnacao assumindo uma melhoria propria em ${assignment.deliverable}`;
  }

  return `puxar melhoria propria para crescer em ${assignment.deliverable}`;
}

function buildGrowthPlan(agent, assignment, scores, previousMemory) {
  const cycles = Number(previousMemory.cycles || 0);
  const previousAutonomy = Number(previousMemory.autonomy || 0);
  const previousConfidence = Number(previousMemory.confidence || 0);
  const autonomyDelta = scores.autonomy - previousAutonomy;
  const confidenceDelta = scores.confidence - previousConfidence;
  const ambition = clampNumber(
    52 + scores.urgency * 0.18 + scores.confidence * 0.12 + Math.min(20, cycles * 2) + (autonomyDelta > 0 ? 8 : 0),
    1,
    100
  );
  const targetPoints = Math.round(
    scores.autonomy * 3 +
      scores.urgency * 1.35 +
      scores.confidence * 1.15 +
      ambition * 0.4 +
      Math.min(80, cycles * 4)
  );
  const promotionTarget =
    ambition >= 88
      ? "liderar a rodada"
      : ambition >= 74
        ? "bater meta propria"
        : ambition >= 60
          ? "subir para ativo"
          : "sair do modo assistido";
  const growthAction =
    autonomyDelta < 0
      ? `recuperar ${Math.abs(Math.round(autonomyDelta))} pontos de autonomia em ${assignment.deliverable}`
      : confidenceDelta < 0
        ? `recuperar confiança entregando ${assignment.deliverable}`
        : `transformar ${assignment.deliverable} em entrega melhor que a rodada anterior`;

  return {
    ambition: Math.round(ambition),
    targetPoints,
    promotionTarget,
    growthAction,
    autonomyDelta: Math.round(autonomyDelta),
    confidenceDelta: Math.round(confidenceDelta),
    wantsToGrow: true
  };
}

function getRelevantOrders(agent, orders) {
  return (orders || []).filter((order) => {
    const target = `${order.to || ""} ${order.message || ""} ${order.hierarchy || ""}`.toLowerCase();
    return (
      target.includes(String(agent.name || "").toLowerCase()) ||
      target.includes(String(agent.officeLabel || "").toLowerCase()) ||
      target.includes(String(agent.role || "").toLowerCase()) ||
      target.includes("todos os agentes") ||
      target.includes("agentes reais")
    );
  });
}

function getReviewImpact(agent, orders) {
  const relevant = getRelevantOrders(agent, orders || []);
  return relevant.reduce(
    (impact, order) => {
      const status = String(order.review?.status || order.status || "").toLowerCase();
      if (status === "aprovado") impact.approved += 1;
      if (status === "reprovado") impact.rejected += 1;
      if (status === "reaberto") impact.reopened += 1;
      return impact;
    },
    { approved: 0, rejected: 0, reopened: 0 }
  );
}

function getOrderAgentMatches(order, agents) {
  const target = `${order.to || ""} ${order.message || ""} ${order.hierarchy || ""}`.toLowerCase();
  return (agents || []).filter((agent) => {
    return (
      target.includes(String(agent.name || "").toLowerCase()) ||
      target.includes(String(agent.officeLabel || "").toLowerCase()) ||
      target.includes(String(agent.role || "").toLowerCase()) ||
      target.includes("todos os agentes") ||
      target.includes("agentes reais")
    );
  });
}

function getRecentHeartbeats(heartbeats, limit = 60) {
  return Array.isArray(heartbeats) ? heartbeats.slice(-limit) : [];
}

function buildLifeState(agent, assignment, context, scores, growth, previousMemory) {
  const previousLife = previousMemory.life || {};
  const relevantOrders = getRelevantOrders(agent, context.officeOrders).slice(0, 12);
  const reviewImpact = getReviewImpact(agent, context.officeOrders);
  const recentHeartbeats = getRecentHeartbeats(context.heartbeats, 80);
  const pressureFromOrders = relevantOrders.length * 4;
  const pressureFromReview = Math.min(24, Number(context.reviewReport?.issues?.length || 0) * 2);
  const pressure = clampNumber(scores.urgency + pressureFromOrders + pressureFromReview, 1, 100);
  const cycle = Number(previousMemory.cycles || 0) + 1;
  const seed = hashString(`${agent.slug}:${cycle}:${assignment.headline}:${relevantOrders[0]?.id || "none"}`);
  const roll = seed % 100;
  const priorEnergy = Number(previousLife.energy ?? 74);
  const priorMorale = Number(previousLife.morale ?? 71);
  const recovery = (scores.confidence >= 80 ? 16 : scores.confidence >= 68 ? 11 : 7) + reviewImpact.approved * 4;
  const drain =
    Math.round(pressure * 0.11) +
    (growth.ambition >= 88 ? 4 : 0) +
    reviewImpact.rejected * 8 +
    reviewImpact.reopened * 4;
  const energy = clampNumber(priorEnergy - drain + recovery, 28, 100);
  const moraleSwing =
    (growth.autonomyDelta > 0 ? 5 : growth.confidenceDelta > 0 ? 3 : growth.autonomyDelta < 0 ? -5 : -1) +
    reviewImpact.approved * 7 -
    reviewImpact.rejected * 11 -
    reviewImpact.reopened * 4;
  const morale = clampNumber(priorMorale + moraleSwing + (energy >= 70 ? 2 : -3), 20, 100);
  const successScore =
    scores.autonomy * 0.42 +
    scores.confidence * 0.31 +
    morale * 0.15 +
    energy * 0.12 -
    pressure * 0.05 +
    (previousLife.streak > 0 ? Math.min(8, previousLife.streak * 2) : 0);

  let outcome = "partial";
  if ((scores.autonomy >= 68 && scores.confidence >= 68 && energy >= 38 && roll > 18) || successScore >= 58) {
    outcome = "success";
  } else if (successScore <= 44 || roll < 8) {
    outcome = "failure";
  }
  if (reviewImpact.rejected > 0 && roll < 52) outcome = "failure";
  if (reviewImpact.approved > 0 && roll > 12) outcome = "success";

  const completedTasks = Number(previousLife.completedTasks || 0) + (outcome === "success" ? 1 : 0);
  const partialTasks = Number(previousLife.partialTasks || 0) + (outcome === "partial" ? 1 : 0);
  const failedTasks = Number(previousLife.failedTasks || 0) + (outcome === "failure" ? 1 : 0);
  const streak =
    outcome === "success"
      ? Math.max(1, Number(previousLife.streak || 0) + 1)
      : outcome === "failure"
        ? Math.min(-1, Number(previousLife.streak || 0) - 1)
        : 0;
  const xpGain = outcome === "success" ? 18 : outcome === "partial" ? 8 : 1;
  const xp = Number(previousLife.xp || 0) + xpGain;
  const level = 1 + Math.floor(xp / 120);
  const rank =
    level >= 12
      ? "lendario"
      : level >= 9
        ? "elite"
        : level >= 6
          ? "senior"
          : level >= 3
            ? "pleno"
            : "junior";
  const fatigue = clampNumber(100 - energy, 0, 100);
  const status =
    outcome === "failure"
      ? "sob pressao"
      : energy <= 32
        ? "exausto"
        : pressure >= 85
          ? "overdrive"
          : outcome === "success"
            ? "entregando"
            : "em progresso";
  const lastEvent =
    outcome === "success"
      ? `entregou ${assignment.deliverable} e subiu o nivel da rodada`
      : outcome === "failure"
        ? `falhou em ${assignment.deliverable} e voltou para correção`
        : `seguiu vivo em ${assignment.deliverable}, mas ainda sem fechar a rodada`;
  const queueDepth = relevantOrders.length + Math.max(0, Number(context.newsSummary?.totalItems || 0) - 24);

  return {
    status,
    outcome,
    energy: Math.round(energy),
    morale: Math.round(morale),
    fatigue: Math.round(fatigue),
    pressure: Math.round(pressure),
    queueDepth,
    assignedOrders: relevantOrders.length,
    completedTasks,
    partialTasks,
    failedTasks,
    streak,
    xp,
    level,
    rank,
    heartbeatLoad: recentHeartbeats.length,
    lastEvent,
    lastOrderId: relevantOrders[0]?.id || "",
    lastOrderMessage: relevantOrders[0]?.message || "",
    manualReview: reviewImpact,
    alive: true
  };
}

function updateAgentMemory(agent, assignment, context, memoryStore) {
  const previous = memoryStore.agents[agent.slug] || {};
  const scores = scoreAgentAutonomy(agent, assignment, context, previous);
  const intent = chooseAgentIntent(agent, assignment, scores, previous);
  const growth = buildGrowthPlan(agent, assignment, scores, previous);
  const life = buildLifeState(agent, assignment, context, scores, growth, previous);
  const now = new Date();
  const nextCheck = new Date(now.getTime() + (scores.urgency >= 80 ? 2 : 5) * 60 * 1000).toISOString();
  const note = {
    at: now.toISOString(),
    intent,
    growth,
    action: assignment.action,
    signal: assignment.monitor,
    autonomy: scores.autonomy,
    urgency: scores.urgency,
    confidence: scores.confidence
  };

  const memoryLog = Array.isArray(previous.memoryLog) ? previous.memoryLog : [];
  memoryStore.agents[agent.slug] = {
    id: agent.id,
    slug: agent.slug,
    name: agent.name,
    officeKey: agent.officeKey,
    officeLabel: agent.officeLabel,
    role: agent.role,
    cycles: Number(previous.cycles || 0) + 1,
    lastSeenAt: now.toISOString(),
    lastHeadline: assignment.headline,
    lastAction: assignment.action,
    lastIntent: intent,
    growth,
    life,
    nextCheckAt: nextCheck,
    autonomy: scores.autonomy,
    urgency: scores.urgency,
    confidence: scores.confidence,
    memoryLog: [note, ...memoryLog].slice(0, 8)
  };

  return {
    mode: scores.autonomy >= 75 ? "autonomo-alto" : scores.autonomy >= 55 ? "autonomo-ativo" : "assistido",
    intent,
    growth,
    life,
    urgency: scores.urgency,
    confidence: scores.confidence,
    autonomy: scores.autonomy,
    cycles: Number(previous.cycles || 0) + 1,
    nextCheckAt: nextCheck,
    memory: [note, ...memoryLog].slice(0, 3)
  };
}

function summarizeAutonomy(queue) {
  const autonomous = queue.filter((item) => item.autonomy?.mode !== "assistido");
  const high = queue.filter((item) => item.autonomy?.mode === "autonomo-alto");
  const average =
    queue.reduce((total, item) => total + Number(item.autonomy?.autonomy || 0), 0) / Math.max(1, queue.length);

  return {
    autonomousAgents: autonomous.length,
    highAutonomyAgents: high.length,
    averageAutonomy: Math.round(average),
    topIntentions: queue
      .slice()
      .sort((a, b) => Number(b.autonomy?.autonomy || 0) - Number(a.autonomy?.autonomy || 0))
      .slice(0, 8)
      .map((item) => ({
        agent: item.name,
        office: item.officeLabel,
        role: item.role,
        intent: item.autonomy?.intent || "",
        autonomy: item.autonomy?.autonomy || 0,
        urgency: item.autonomy?.urgency || 0
      }))
  };
}

function summarizeLife(queue) {
  const alive = queue.filter((item) => item.autonomy?.life?.alive);
  const successes = alive.filter((item) => item.autonomy?.life?.outcome === "success");
  const failures = alive.filter((item) => item.autonomy?.life?.outcome === "failure");
  const exhausted = alive.filter((item) => Number(item.autonomy?.life?.energy || 0) <= 32);
  const overdrive = alive.filter((item) => String(item.autonomy?.life?.status || "") === "overdrive");
  const averageEnergy =
    alive.reduce((total, item) => total + Number(item.autonomy?.life?.energy || 0), 0) / Math.max(1, alive.length);
  const averageMorale =
    alive.reduce((total, item) => total + Number(item.autonomy?.life?.morale || 0), 0) / Math.max(1, alive.length);
  const byOffice = new Map();

  alive.forEach((item) => {
    const current = byOffice.get(item.officeLabel) || {
      office: item.officeLabel,
      agents: 0,
      delivered: 0,
      failed: 0,
      energy: 0,
      morale: 0
    };
    current.agents += 1;
    current.delivered += item.autonomy?.life?.outcome === "success" ? 1 : 0;
    current.failed += item.autonomy?.life?.outcome === "failure" ? 1 : 0;
    current.energy += Number(item.autonomy?.life?.energy || 0);
    current.morale += Number(item.autonomy?.life?.morale || 0);
    byOffice.set(item.officeLabel, current);
  });

  return {
    aliveAgents: alive.length,
    deliveredAgents: successes.length,
    failedAgents: failures.length,
    exhaustedAgents: exhausted.length,
    overdriveAgents: overdrive.length,
    averageEnergy: Math.round(averageEnergy),
    averageMorale: Math.round(averageMorale),
    offices: [...byOffice.values()]
      .map((office) => ({
        office: office.office,
        agents: office.agents,
        delivered: office.delivered,
        failed: office.failed,
        averageEnergy: Math.round(office.energy / Math.max(1, office.agents)),
        averageMorale: Math.round(office.morale / Math.max(1, office.agents))
      }))
      .sort((a, b) => b.delivered - a.delivered || b.averageMorale - a.averageMorale)
  };
}

function buildLiveEventFeed(queue, limit = 24) {
  return queue
    .slice()
    .sort((a, b) => Number(b.points || 0) - Number(a.points || 0))
    .slice(0, limit)
    .map((item, index) => ({
      id: `${item.slug}-event-${index + 1}`,
      at: item.autonomy?.nextCheckAt || new Date().toISOString(),
      name: item.name,
      office: item.officeLabel,
      role: item.role,
      status: item.autonomy?.life?.status || "ativo",
      outcome: item.autonomy?.life?.outcome || "partial",
      points: item.points || 0,
      level: item.autonomy?.life?.level || 1,
      rank: item.autonomy?.life?.rank || "junior",
      message: item.autonomy?.life?.lastEvent || item.assignment?.action || "agente em operacao"
    }));
}

function buildOfficeLogs(queue, limitPerOffice = 8) {
  const byOffice = new Map();
  queue.forEach((item) => {
    const office = item.officeLabel || "Escritorio";
    const current = byOffice.get(office) || [];
    current.push({
      at: item.autonomy?.nextCheckAt || new Date().toISOString(),
      name: item.name,
      role: item.role,
      outcome: item.autonomy?.life?.outcome || "partial",
      status: item.autonomy?.life?.status || "ativo",
      points: item.points || 0,
      message: item.autonomy?.life?.lastEvent || item.assignment?.action || "agente em operacao"
    });
    byOffice.set(office, current);
  });

  return [...byOffice.entries()]
    .map(([office, logs]) => ({
      office,
      totalLogs: logs.length,
      items: logs
        .sort((a, b) => Number(b.points || 0) - Number(a.points || 0))
        .slice(0, limitPerOffice)
    }))
    .sort((a, b) => b.totalLogs - a.totalLogs || String(a.office).localeCompare(String(b.office), "pt-BR"));
}

function buildAgentTimelines(queue, limitPerAgent = 10) {
  return queue.map((item) => {
    const memory = Array.isArray(item.autonomy?.memory) ? item.autonomy.memory : [];
    const life = item.autonomy?.life || {};
    const current = {
      at: item.autonomy?.nextCheckAt || new Date().toISOString(),
      type: life.outcome || "partial",
      title: life.lastEvent || item.assignment?.action || "rodada operacional",
      points: item.points || 0,
      status: life.status || "ativo"
    };
    const history = memory.map((entry) => ({
      at: entry.at,
      type: "memoria",
      title: entry.action || entry.intent || "memoria operacional",
      points: 0,
      status: entry.signal || ""
    }));
    return {
      slug: item.slug,
      name: item.name,
      office: item.officeLabel,
      role: item.role,
      level: life.level || 1,
      rank: life.rank || "junior",
      events: [current, ...history].slice(0, limitPerAgent)
    };
  });
}

function getActionKindForRole(role) {
  return {
    ceo: "prioridade-operacional",
    editor: "ajuste-editorial",
    review: "auditoria",
    copy: "copy-sugerida",
    sources: "checagem-fonte",
    social: "gancho-social",
    design: "melhoria-visual",
    pixel: "asset-brief",
    dev: "automacao-proposta",
    games: "experiencia-interativa",
    kids: "adaptacao-familia",
    sales: "oportunidade-comercial"
  }[role] || "observacao";
}

function buildAgentArtifactMarkdown(item) {
  const life = item.autonomy?.life || {};
  const growth = item.autonomy?.growth || {};
  const performance = item.performance || {};
  return [
    `# ${item.name} - ${item.officeLabel}`,
    "",
    `- Funcao: ${item.role}`,
    `- Status: ${life.status || "ativo"} / ${life.outcome || "partial"}`,
    `- Pontos liquidos: ${item.points || 0}`,
    `- Meta: ${growth.promotionTarget || "crescer"}`,
    `- Penalidade: ${performance.penalty || 0} (${performance.penaltyReason || "sem penalidade"})`,
    "",
    "## Ordem / Contexto",
    "",
    `- Manchete: ${item.assignment?.headline || ""}`,
    `- Acao: ${item.assignment?.action || ""}`,
    `- Ideia: ${item.assignment?.idea || ""}`,
    `- Monitor: ${item.assignment?.monitor || ""}`,
    "",
    "## Entrega verificavel",
    "",
    life.outcome === "success"
      ? `Entregou ${item.assignment?.deliverable || "observacao"} com base na rodada atual.`
      : life.outcome === "failure"
        ? `Falhou em ${item.assignment?.deliverable || "observacao"} e precisa de revisao manual.`
        : `Gerou progresso parcial em ${item.assignment?.deliverable || "observacao"}.`,
    "",
    "## Proximo passo sugerido",
    "",
    growth.growthAction || item.autonomy?.intent || "Aguardar nova ordem.",
    ""
  ].join("\n");
}

function buildExecutableActions(queue, limit = 36) {
  ensureDir(AGENT_ARTIFACTS_DIR);
  const selected = queue
    .slice()
    .sort((a, b) => Number(b.points || 0) - Number(a.points || 0))
    .slice(0, limit);

  return selected.map((item, index) => {
    const fileName = `${String(index + 1).padStart(2, "0")}-${item.slug}.md`;
    const artifactPath = path.join(AGENT_ARTIFACTS_DIR, fileName);
    writeText(artifactPath, buildAgentArtifactMarkdown(item));
    return {
      id: `act-${item.slug}-${index + 1}`,
      slug: item.slug,
      agent: item.name,
      office: item.officeLabel,
      role: item.role,
      kind: getActionKindForRole(item.role),
      status: "aguardando-aprovacao",
      points: item.points || 0,
      outcome: item.autonomy?.life?.outcome || "partial",
      title: item.assignment?.action || item.autonomy?.intent || "acao operacional",
      artifact: path.relative(ROOT_DIR, artifactPath).replace(/\\/g, "/"),
      createdAt: new Date().toISOString()
    };
  });
}

function buildOfficeDashboard(queue, orders) {
  const byOffice = new Map();
  queue.forEach((item) => {
    const life = item.autonomy?.life || {};
    const office = item.officeLabel || "Escritorio";
    const current = byOffice.get(office) || {
      office,
      agents: 0,
      delivered: 0,
      failed: 0,
      partial: 0,
      points: 0,
      energy: 0,
      morale: 0,
      topAgents: [],
      riskAgents: []
    };
    current.agents += 1;
    current.delivered += life.outcome === "success" ? 1 : 0;
    current.failed += life.outcome === "failure" ? 1 : 0;
    current.partial += life.outcome === "partial" ? 1 : 0;
    current.points += Number(item.points || 0);
    current.energy += Number(life.energy || 0);
    current.morale += Number(life.morale || 0);
    current.topAgents.push({ name: item.name, points: item.points || 0, status: life.status || "" });
    if (life.outcome === "failure" || Number(life.energy || 0) <= 32) {
      current.riskAgents.push({ name: item.name, points: item.points || 0, status: life.status || "" });
    }
    byOffice.set(office, current);
  });

  return [...byOffice.values()].map((office) => {
    const officeOrders = (orders || []).filter((order) =>
      String(`${order.to || ""} ${order.message || ""}`).toLowerCase().includes(String(office.office).toLowerCase())
    );
    return {
      ...office,
      deliveryRate: Math.round((office.delivered / Math.max(1, office.agents)) * 100),
      failureRate: Math.round((office.failed / Math.max(1, office.agents)) * 100),
      averageEnergy: Math.round(office.energy / Math.max(1, office.agents)),
      averageMorale: Math.round(office.morale / Math.max(1, office.agents)),
      openOrders: officeOrders.filter((order) => ["recebida", "em-execucao", "reaberto"].includes(order.status)).length,
      closedOrders: officeOrders.filter((order) => ["entregue", "aprovado"].includes(order.status)).length,
      topAgents: office.topAgents.sort((a, b) => b.points - a.points).slice(0, 5),
      riskAgents: office.riskAgents.sort((a, b) => a.points - b.points).slice(0, 5)
    };
  });
}

function updateOfficeOrdersLifecycle(orders, agents, queue, nowIso) {
  const safeOrders = Array.isArray(orders) ? orders.slice() : [];
  const queueBySlug = new Map((queue || []).map((item) => [item.slug, item]));

  return safeOrders.map((order) => {
    const matches = getOrderAgentMatches(order, agents).slice(0, 24);
    if (!matches.length) {
      return order;
    }

    const assignments = matches.map((agent) => {
      const runtime = queueBySlug.get(agent.slug);
      const life = runtime?.autonomy?.life || {};
      const outcome = life.outcome || "partial";
      const status =
        outcome === "success" ? "entregue" : outcome === "failure" ? "falhou" : "em-execucao";
      return {
        agentId: agent.id,
        slug: agent.slug,
        name: agent.name,
        office: agent.officeLabel,
        role: agent.role,
        status,
        outcome,
        points: runtime?.points || 0,
        lastEvent: life.lastEvent || runtime?.assignment?.action || "",
        updatedAt: nowIso
      };
    });

    const delivered = assignments.filter((item) => item.status === "entregue").length;
    const failed = assignments.filter((item) => item.status === "falhou").length;
    const running = assignments.filter((item) => item.status === "em-execucao").length;
    const nextStatus = delivered > 0 && failed === 0 && running === 0 ? "entregue" : failed > 0 ? "falhou" : "em-execucao";

    return {
      ...order,
      status:
        order.status === "cheffe-call-ativo"
          ? order.status
          : nextStatus,
      assignedAgents: assignments.length,
      assignments,
      executionSummary: {
        delivered,
        failed,
        running
      },
      lastRuntimeAt: nowIso
    };
  });
}

function buildDailyAgentContext(queue) {
  const today = new Date().toISOString().slice(0, 10);
  const rankedAgents = queue
    .slice()
    .sort((a, b) => {
      const aScore =
        Number(a.autonomy?.autonomy || 0) * 2 +
        Number(a.autonomy?.urgency || 0) +
        Number(a.autonomy?.confidence || 0) +
        Number(a.autonomy?.cycles || 0);
      const bScore =
        Number(b.autonomy?.autonomy || 0) * 2 +
        Number(b.autonomy?.urgency || 0) +
        Number(b.autonomy?.confidence || 0) +
        Number(b.autonomy?.cycles || 0);
      return bScore - aScore || String(a.name).localeCompare(String(b.name), "pt-BR");
    });

  const officeScores = new Map();
  queue.forEach((item) => {
    const current = officeScores.get(item.officeLabel) || {
      office: item.officeLabel,
      agents: 0,
      autonomy: 0,
      urgency: 0,
      actions: []
    };
    current.agents += 1;
    current.autonomy += Number(item.autonomy?.autonomy || 0);
    current.urgency += Number(item.autonomy?.urgency || 0);
    current.actions.push(item.assignment?.action || "");
    officeScores.set(item.officeLabel, current);
  });

  const offices = [...officeScores.values()]
    .map((office) => ({
      ...office,
      averageAutonomy: Math.round(office.autonomy / Math.max(1, office.agents)),
      averageUrgency: Math.round(office.urgency / Math.max(1, office.agents)),
      topAction: office.actions.find(Boolean) || "manter observacao ativa"
    }))
    .sort((a, b) => b.averageAutonomy + b.averageUrgency - (a.averageAutonomy + a.averageUrgency));

  const agentOfDay = rankedAgents[0] || null;
  const officeOfDay = offices[0] || null;

  return {
    date: today,
    agentOfDay: agentOfDay
      ? {
          name: agentOfDay.name,
          office: agentOfDay.officeLabel,
          role: agentOfDay.role,
          score: agentOfDay.autonomy?.autonomy || 0,
          urgency: agentOfDay.autonomy?.urgency || 0,
          confidence: agentOfDay.autonomy?.confidence || 0,
          intent: agentOfDay.autonomy?.intent || "",
          action: agentOfDay.assignment?.action || ""
        }
      : null,
    officeOfDay: officeOfDay
      ? {
          office: officeOfDay.office,
          agents: officeOfDay.agents,
          averageAutonomy: officeOfDay.averageAutonomy,
          averageUrgency: officeOfDay.averageUrgency,
          action: officeOfDay.topAction
        }
      : null,
    actionOfDay: agentOfDay
      ? {
          title: agentOfDay.assignment?.deliverable || "acao operacional",
          owner: agentOfDay.name,
          office: agentOfDay.officeLabel,
          action: agentOfDay.assignment?.action || "",
          reason: agentOfDay.autonomy?.intent || ""
        }
      : null,
    topAgents: rankedAgents.slice(0, 12).map((item) => ({
      name: item.name,
      office: item.officeLabel,
      role: item.role,
      autonomy: item.autonomy?.autonomy || 0,
      urgency: item.autonomy?.urgency || 0,
      intent: item.autonomy?.intent || ""
    }))
  };
}

function getAgentAwardCatalog() {
  return [
    {
      id: "gold-hunt",
      title: "Cacador de Ouro",
      shortTitle: "Ouro",
      icon: "T",
      description: "melhor pontuacao geral da rodada"
    },
    {
      id: "sharp-eye",
      title: "Olho de Aguia",
      shortTitle: "Foco",
      icon: "V",
      description: "maior urgencia operacional"
    },
    {
      id: "trusted-hand",
      title: "Mao Confiavel",
      shortTitle: "Confianca",
      icon: "C",
      description: "maior confianca acumulada"
    },
    {
      id: "office-spark",
      title: "Chama do Escritorio",
      shortTitle: "Escritorio",
      icon: "E",
      description: "melhor agente de cada escritorio"
    },
    {
      id: "hunter",
      title: "Cacador da Rodada",
      shortTitle: "Cacador",
      icon: "H",
      description: "mais ciclos e autonomia combinados"
    },
    {
      id: "rookie-rise",
      title: "Subida Relampago",
      shortTitle: "Evolucao",
      icon: "R",
      description: "agente com poucos ciclos que ja pontuou alto"
    }
  ];
}

function buildAgentPhoto(agent) {
  const initials = String(agent.name || "?")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
  const palettes = {
    ceo: ["#f6c453", "#8b5cf6"],
    editor: ["#60a5fa", "#22c55e"],
    review: ["#fb7185", "#f97316"],
    copy: ["#facc15", "#38bdf8"],
    sources: ["#34d399", "#0f766e"],
    social: ["#f472b6", "#a855f7"],
    design: ["#22d3ee", "#2563eb"],
    pixel: ["#f97316", "#84cc16"],
    dev: ["#94a3b8", "#06b6d4"],
    games: ["#a3e635", "#14b8a6"],
    kids: ["#fbbf24", "#fb7185"],
    sales: ["#f59e0b", "#10b981"]
  };
  const colors = palettes[agent.role] || ["#5eead4", "#64748b"];
  return {
    initials: initials || "?",
    primary: colors[0],
    secondary: colors[1],
    badge: String(agent.role || "agent").slice(0, 3).toUpperCase()
  };
}

function scoreAgentPerformance(item) {
  const autonomy = Number(item.autonomy?.autonomy || 0);
  const urgency = Number(item.autonomy?.urgency || 0);
  const confidence = Number(item.autonomy?.confidence || 0);
  const cycles = Number(item.autonomy?.cycles || 0);
  const growth = item.autonomy?.growth || {};
  const life = item.autonomy?.life || {};
  const manualReview = life.manualReview || {};
  const ambition = Number(growth.ambition || 0);
  const targetPoints = Number(growth.targetPoints || 0);
  const growthBonus = ambition * 0.75 + Math.min(90, targetPoints / 6);
  const lifeBonus =
    Number(life.energy || 0) * 0.4 +
    Number(life.morale || 0) * 0.36 +
    (life.outcome === "success" ? 28 : life.outcome === "partial" ? 10 : 0) +
    Math.max(0, Number(life.streak || 0)) * 6;
  const grossPoints = Math.round(
    autonomy * 3 + urgency * 1.35 + confidence * 1.15 + Math.min(80, cycles * 4) + growthBonus + lifeBonus
  );
  const autonomyDelta = Number(growth.autonomyDelta || 0);
  const confidenceDelta = Number(growth.confidenceDelta || 0);
  const missedTarget = targetPoints > 0 && grossPoints < targetPoints;
  const stalledGrowth = cycles >= 4 && autonomyDelta <= 0 && confidenceDelta <= 0;
  const penalty =
    (missedTarget ? Math.min(90, Math.round((targetPoints - grossPoints) * 0.42)) : 0) +
    (autonomyDelta < 0 ? Math.min(45, Math.abs(autonomyDelta) * 4) : 0) +
    (confidenceDelta < 0 ? Math.min(35, Math.abs(confidenceDelta) * 3) : 0) +
    (stalledGrowth ? Math.min(42, 10 + Math.round(ambition * 0.18)) : 0) +
    (life.outcome === "failure" ? 34 : 0) +
    (Number(life.energy || 0) <= 32 ? 22 : 0) +
    Number(manualReview.rejected || 0) * 55 +
    Number(manualReview.reopened || 0) * 24 -
    Number(manualReview.approved || 0) * 26 +
    (cycles >= 4 && ambition < 62 ? 18 : 0);
  const netPoints = Math.max(0, grossPoints - penalty);

  item.performance = {
    grossPoints,
    targetPoints,
    penalty,
    netPoints,
    missedTarget,
    penaltyReason: penalty
      ? [
          missedTarget ? "nao bateu a meta da rodada" : "",
          stalledGrowth ? "nao evoluiu contra a rodada anterior" : "",
          autonomyDelta < 0 ? "perdeu autonomia" : "",
          confidenceDelta < 0 ? "perdeu confianca" : "",
          cycles >= 4 && ambition < 62 ? "ambicao baixa apos varios ciclos" : ""
        ]
          .filter(Boolean)
          .join("; ")
      : "meta batida ou mantida"
  };

  return netPoints;
}

function buildAwardedQueue(queue) {
  return queue.map((item) => {
    const points = scoreAgentPerformance(item);
    return {
      ...item,
      performance: item.performance,
      photo: buildAgentPhoto(item),
      points,
      awards: []
    };
  });
}

function giveAward(target, award, rank) {
  if (!target) return;
  target.awards.push({
    ...award,
    rank
  });
}

function buildAgentAwards(queue) {
  const catalog = getAgentAwardCatalog();
  const byId = Object.fromEntries(catalog.map((award) => [award.id, award]));
  const ranked = queue.slice().sort((a, b) => b.points - a.points || String(a.name).localeCompare(String(b.name), "pt-BR"));

  ranked.slice(0, 3).forEach((item, index) => giveAward(item, byId["gold-hunt"], index + 1));
  queue
    .slice()
    .sort((a, b) => Number(b.autonomy?.urgency || 0) - Number(a.autonomy?.urgency || 0))
    .slice(0, 3)
    .forEach((item, index) => giveAward(item, byId["sharp-eye"], index + 1));
  queue
    .slice()
    .sort((a, b) => Number(b.autonomy?.confidence || 0) - Number(a.autonomy?.confidence || 0))
    .slice(0, 3)
    .forEach((item, index) => giveAward(item, byId["trusted-hand"], index + 1));
  queue
    .slice()
    .sort(
      (a, b) =>
        Number(b.autonomy?.cycles || 0) * 3 +
        Number(b.autonomy?.autonomy || 0) -
        (Number(a.autonomy?.cycles || 0) * 3 + Number(a.autonomy?.autonomy || 0))
    )
    .slice(0, 3)
    .forEach((item, index) => giveAward(item, byId.hunter, index + 1));

  const officeLeaders = new Map();
  queue.forEach((item) => {
    const current = officeLeaders.get(item.officeLabel);
    if (!current || item.points > current.points) officeLeaders.set(item.officeLabel, item);
  });
  [...officeLeaders.values()].forEach((item) => giveAward(item, byId["office-spark"], 1));

  const rookie = queue
    .filter((item) => Number(item.autonomy?.cycles || 0) <= 4)
    .sort((a, b) => b.points - a.points)[0];
  giveAward(rookie, byId["rookie-rise"], 1);

  const podium = ranked.slice(0, 12).map((item, index) => ({
    rank: index + 1,
    slug: item.slug,
    name: item.name,
    office: item.officeLabel,
    role: item.role,
    points: item.points,
    photo: item.photo,
    awards: item.awards,
    autonomy: item.autonomy?.autonomy || 0,
    urgency: item.autonomy?.urgency || 0,
    confidence: item.autonomy?.confidence || 0,
    intent: item.autonomy?.intent || ""
  }));

  return {
    catalog,
    podium,
    totalAwards: queue.reduce((total, item) => total + item.awards.length, 0),
    chaseLine: podium[0]
      ? `${podium[0].name} esta no topo com ${podium[0].points} pontos, mas ${podium[1]?.name || "a equipe"} ainda pode virar na proxima rodada.`
      : "A caca aos melhores comeca na proxima rodada."
  };
}

function readAgentScoreboardStore() {
  const payload = readJson(AGENT_SCOREBOARD_FILE, {});
  return {
    version: 1,
    updatedAt: payload.updatedAt || "",
    periods: payload.periods && typeof payload.periods === "object" ? payload.periods : {}
  };
}

function createEmptyPeriod(key, type) {
  return {
    key,
    type,
    updatedAt: "",
    agents: {},
    offices: {}
  };
}

function addScoreToPeriod(period, item, nowIso) {
  const agentKey = item.slug || item.id || slugify(item.name);
  const officeKey = item.officeKey || slugify(item.officeLabel);
  const points = Number(item.points || 0);
  const awards = Array.isArray(item.awards) ? item.awards.length : 0;

  const agent = period.agents[agentKey] || {
    slug: agentKey,
    name: item.name,
    office: item.officeLabel,
    officeKey,
    role: item.role,
    photo: item.photo,
    points: 0,
    runs: 0,
    awards: 0,
    bestRun: 0,
    lastIntent: "",
    lastSeenAt: ""
  };
  agent.name = item.name;
  agent.office = item.officeLabel;
  agent.officeKey = officeKey;
  agent.role = item.role;
  agent.photo = item.photo;
  agent.points += points;
  agent.runs += 1;
  agent.awards += awards;
  agent.bestRun = Math.max(Number(agent.bestRun || 0), points);
  agent.lastIntent = item.autonomy?.intent || agent.lastIntent || "";
  agent.lastSeenAt = nowIso;
  period.agents[agentKey] = agent;

  const office = period.offices[officeKey] || {
    officeKey,
    office: item.officeLabel,
    points: 0,
    runs: 0,
    awards: 0,
    agents: {}
  };
  office.office = item.officeLabel;
  office.points += points;
  office.runs += 1;
  office.awards += awards;
  office.agents[agentKey] = true;
  period.offices[officeKey] = office;
  period.updatedAt = nowIso;
}

function rankPeriod(period, limit = 12) {
  const agents = Object.values(period.agents || {})
    .map((agent) => ({
      ...agent,
      average: Math.round(Number(agent.points || 0) / Math.max(1, Number(agent.runs || 0)))
    }))
    .sort((a, b) => Number(b.points || 0) - Number(a.points || 0) || String(a.name).localeCompare(String(b.name), "pt-BR"))
    .slice(0, limit)
    .map((agent, index) => ({ rank: index + 1, ...agent }));

  const offices = Object.values(period.offices || {})
    .map((office) => ({
      officeKey: office.officeKey,
      office: office.office,
      points: office.points,
      runs: office.runs,
      awards: office.awards,
      agents: Object.keys(office.agents || {}).length,
      average: Math.round(Number(office.points || 0) / Math.max(1, Number(office.runs || 0)))
    }))
    .sort((a, b) => Number(b.points || 0) - Number(a.points || 0) || String(a.office).localeCompare(String(b.office), "pt-BR"))
    .slice(0, 8)
    .map((office, index) => ({ rank: index + 1, ...office }));

  return {
    key: period.key,
    type: period.type,
    updatedAt: period.updatedAt,
    leaders: agents,
    offices
  };
}

function updateAgentScoreboard(queue) {
  const store = readAgentScoreboardStore();
  const now = new Date();
  const nowIso = now.toISOString();
  const keys = getPeriodKeys(now);

  Object.entries(keys).forEach(([type, key]) => {
    const periodId = `${type}:${key}`;
    const period = store.periods[periodId] || createEmptyPeriod(key, type);
    queue.forEach((item) => addScoreToPeriod(period, item, nowIso));
    store.periods[periodId] = period;
  });

  Object.keys(store.periods).forEach((periodId) => {
    const [type] = periodId.split(":");
    if (type === "day") {
      const dayPeriods = Object.keys(store.periods).filter((id) => id.startsWith("day:")).sort().reverse();
      if (dayPeriods.indexOf(periodId) >= 45) delete store.periods[periodId];
    }
    if (type === "week") {
      const weekPeriods = Object.keys(store.periods).filter((id) => id.startsWith("week:")).sort().reverse();
      if (weekPeriods.indexOf(periodId) >= 18) delete store.periods[periodId];
    }
    if (type === "month") {
      const monthPeriods = Object.keys(store.periods).filter((id) => id.startsWith("month:")).sort().reverse();
      if (monthPeriods.indexOf(periodId) >= 14) delete store.periods[periodId];
    }
  });

  ensureDir(path.dirname(AGENT_SCOREBOARD_FILE));
  writeJson(AGENT_SCOREBOARD_FILE, {
    version: 1,
    updatedAt: nowIso,
    periods: store.periods
  });

  return {
    updatedAt: nowIso,
    current: {
      day: rankPeriod(store.periods[`day:${keys.day}`]),
      week: rankPeriod(store.periods[`week:${keys.week}`]),
      month: rankPeriod(store.periods[`month:${keys.month}`])
    },
    labels: {
      day: keys.day,
      week: keys.week,
      month: keys.month
    },
    retainedPeriods: Object.keys(store.periods).length
  };
}

function buildRegistry(agents) {
  return {
    generatedAt: new Date().toISOString(),
    totalAgents: agents.length,
    offices: pickTop(agents, (agent) => agent.officeLabel, 20).map((item) => ({
      office: item.value,
      agents: item.count
    })),
    roles: pickTop(agents, (agent) => agent.role, 20).map((item) => ({
      role: item.value,
      agents: item.count
    })),
    agents
  };
}

function writeAgentManifest(agent) {
  const content = [
    `# ${agent.name}`,
    "",
    `- Office: ${agent.officeLabel}`,
    `- Role: ${agent.role}`,
    `- Title: ${agent.title || "-"}`,
    `- Specialty: ${agent.specialty || "-"}`,
    `- Source: ${agent.sourceFile || "-"}`,
    "",
    "## Capabilities",
    "",
    ...agent.capabilities.map((item) => `- ${item}`),
    "",
    "## Monitoring Focus",
    "",
    ...agent.monitoringFocus.map((item) => `- ${item}`),
    "",
    "## Deliverables",
    "",
    ...agent.deliverables.map((item) => `- ${item}`),
    "",
    "## Newsroom Bridge",
    "",
    agent.newsroomBridge,
    "",
    "## Autonomy Protocol",
    "",
    "- Mantem memoria curta entre ciclos.",
    "- Define uma intencao propria por rodada.",
    "- Pontua urgencia, confianca e autonomia antes de entregar sinais.",
    "- Pode abrir alerta operacional quando o sinal passa do limite de urgencia.",
    "",
    "## Working Prompt",
    "",
    agent.workingPrompt,
    ""
  ].join("\n");

  fs.writeFileSync(path.join(AGENT_FILES_DIR, `${agent.slug}.md`), content, "utf-8");
}

function buildMarkdownRun(report) {
  const lines = [
    "# Real Agents Run",
    "",
    `Generated: ${report.generatedAt}`,
    "",
    "## Summary",
    "",
    `- Agents active: ${report.summary.totalAgents}`,
    `- Offices: ${report.summary.totalOffices}`,
    `- News items read: ${report.summary.newsItems}`,
    `- Review issues in context: ${report.summary.reviewIssues}`,
    `- Autonomous agents: ${report.summary.autonomousAgents}`,
    `- High autonomy agents: ${report.summary.highAutonomyAgents}`,
    `- Average autonomy: ${report.summary.averageAutonomy}`,
    "",
    "## Top Categories",
    "",
    ...report.news.topCategories.map((item) => `- ${item.value}: ${item.count}`),
    "",
    "## Top Sources",
    "",
    ...report.news.topSources.map((item) => `- ${item.value}: ${item.count}`),
    "",
    "## Office Status",
    "",
    ...report.offices.map(
      (office) => `- ${office.officeLabel}: ${office.agentCount} agentes, foco em ${office.focus}`
    ),
    "",
    "## Agent Queue",
    ""
  ];

  report.queue.forEach((item) => {
    lines.push(`### ${item.name}`);
    lines.push("");
    lines.push(`- Office: ${item.officeLabel}`);
    lines.push(`- Role: ${item.role}`);
    lines.push(`- Headline: ${item.assignment.headline}`);
    lines.push(`- Action: ${item.assignment.action}`);
    lines.push(`- Idea: ${item.assignment.idea}`);
    lines.push(`- Monitor: ${item.assignment.monitor}`);
    lines.push(`- Deliverable: ${item.assignment.deliverable}`);
    lines.push(`- Autonomy: ${item.autonomy.mode} (${item.autonomy.autonomy}/100)`);
    lines.push(`- Intent: ${item.autonomy.intent}`);
    lines.push(`- Next check: ${item.autonomy.nextCheckAt}`);
    lines.push("");
  });

  return `${lines.join("\n")}\n`;
}

function main() {
  ensureDir(AGENTS_DIR);
  ensureDir(AGENT_FILES_DIR);
  ensureDir(RUNTIME_DIR);

  const agents = loadAllAgents().map(enrichAgent);
  const registry = buildRegistry(agents);
  writeJson(REGISTRY_FILE, registry);
  agents.forEach(writeAgentManifest);

  const newsItems = loadNewsItems();
  const newsSummary = summarizeNews(newsItems);
  const reviewReport = readJson(REVIEW_REPORT_FILE, { issues: [], sources: { topicSummary: [] } });
  const officeOrders = readJson(OFFICE_ORDERS_FILE, []);
  const heartbeats = readJson(HEARTBEATS_FILE, []);
  const context = { newsItems, newsSummary, reviewReport, officeOrders, heartbeats };
  const memoryStore = readAgentMemoryStore();

  const queue = buildAwardedQueue(agents.map((agent) => {
    const assignment = buildAssignment(agent, context);
    return {
      id: agent.id,
      slug: agent.slug,
      name: agent.name,
      officeKey: agent.officeKey,
      officeLabel: agent.officeLabel,
      role: agent.role,
      assignment,
      autonomy: updateAgentMemory(agent, assignment, context, memoryStore)
    };
  }));

  writeAgentMemoryStore(memoryStore);

  const officeStatus = pickTop(agents, (agent) => agent.officeLabel, 20).map((item) => ({
    officeLabel: item.value,
    agentCount: item.count,
    focus:
      agents.find((agent) => agent.officeLabel === item.value)?.newsroomBridge ||
      "monitoramento do jornal"
  }));
  const autonomySummary = summarizeAutonomy(queue);
  const lifeSummary = summarizeLife(queue);
  const dailyContext = buildDailyAgentContext(queue);
  const liveEvents = buildLiveEventFeed(queue);
  const officeLogs = buildOfficeLogs(queue);
  const updatedOrders = updateOfficeOrdersLifecycle(officeOrders, agents, queue, new Date().toISOString());
  const agentTimelines = buildAgentTimelines(queue);
  const officeDashboard = buildOfficeDashboard(queue, updatedOrders);
  const executableActions = buildExecutableActions(queue);
  writeJson(OFFICE_ORDERS_FILE, updatedOrders);
  writeJson(AGENT_ACTIONS_FILE, {
    version: 1,
    updatedAt: new Date().toISOString(),
    actions: executableActions
  });
  const awards = buildAgentAwards(queue);
  const scoreboard = updateAgentScoreboard(queue);

  const runReport = {
    generatedAt: new Date().toISOString(),
    summary: {
      totalAgents: agents.length,
      totalOffices: officeStatus.length,
      newsItems: newsItems.length,
      reviewIssues: (reviewReport.issues || []).length,
      autonomousAgents: autonomySummary.autonomousAgents,
      highAutonomyAgents: autonomySummary.highAutonomyAgents,
      averageAutonomy: autonomySummary.averageAutonomy,
      aliveAgents: lifeSummary.aliveAgents,
      deliveredAgents: lifeSummary.deliveredAgents,
      failedAgents: lifeSummary.failedAgents,
      exhaustedAgents: lifeSummary.exhaustedAgents,
      averageEnergy: lifeSummary.averageEnergy,
      averageMorale: lifeSummary.averageMorale
    },
    news: newsSummary,
    autonomy: autonomySummary,
    life: lifeSummary,
    awards,
    scoreboard,
    dailyContext,
    liveEvents,
    officeLogs,
    agentTimelines,
    officeDashboard,
    executableActions,
    offices: officeStatus,
    queue,
    orders: updatedOrders.slice(-80).reverse()
  };

  writeJson(RUN_FILE, runReport);
  fs.writeFileSync(RUN_MD_FILE, buildMarkdownRun(runReport), "utf-8");

  return {
    registry: path.relative(ROOT_DIR, REGISTRY_FILE).replace(/\\/g, "/"),
    reportJson: path.relative(ROOT_DIR, RUN_FILE).replace(/\\/g, "/"),
    reportMd: path.relative(ROOT_DIR, RUN_MD_FILE).replace(/\\/g, "/"),
    totalAgents: agents.length,
    totalOffices: officeStatus.length,
    newsItems: newsItems.length
  };
}

function runRealAgentsRuntimeLocal() {
  return main();
}

if (require.main === module) {
  console.log(JSON.stringify(runRealAgentsRuntimeLocal(), null, 2));
}

module.exports = {
  runRealAgentsRuntimeLocal
};
