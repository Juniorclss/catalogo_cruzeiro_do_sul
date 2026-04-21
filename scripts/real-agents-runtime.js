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
const RUNTIME_NEWS_FILE = path.join(ROOT_DIR, "data", "runtime-news.json");
const ARCHIVE_NEWS_FILE = path.join(ROOT_DIR, "data", "news-archive.json");
const AGENT_MEMORY_FILE = path.join(ROOT_DIR, "data", "real-agents-memory.json");
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

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
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
  return sandbox.module.exports.map((agent) => ({
    ...agent,
    officeKey: "editorial-hq",
    officeLabel: OFFICE_LABELS["editorial-hq"],
    sourceFile: "escritorio.js"
  }));
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
    sourceFile: path.basename(filePath)
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
  if (scores.urgency >= 82) {
    return `abrir alerta proprio sobre ${assignment.headline}`;
  }

  if (agent.role === "ceo") {
    return "redistribuir prioridades sem esperar comando manual";
  }

  if (agent.role === "review") {
    return "bloquear pequenos vazamentos editoriais antes de virarem publicos";
  }

  if (agent.role === "sources") {
    return "procurar lacunas de fonte e preparar sugestao de checagem";
  }

  if (agent.role === "dev") {
    return "propor automacao quando detectar tarefa repetida";
  }

  if (previousMemory.lastIntent && scores.confidence < 65) {
    return previousMemory.lastIntent;
  }

  return `puxar melhoria propria para ${assignment.deliverable}`;
}

function updateAgentMemory(agent, assignment, context, memoryStore) {
  const previous = memoryStore.agents[agent.slug] || {};
  const scores = scoreAgentAutonomy(agent, assignment, context, previous);
  const intent = chooseAgentIntent(agent, assignment, scores, previous);
  const now = new Date();
  const nextCheck = new Date(now.getTime() + (scores.urgency >= 80 ? 2 : 5) * 60 * 1000).toISOString();
  const note = {
    at: now.toISOString(),
    intent,
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
    nextCheckAt: nextCheck,
    autonomy: scores.autonomy,
    urgency: scores.urgency,
    confidence: scores.confidence,
    memoryLog: [note, ...memoryLog].slice(0, 8)
  };

  return {
    mode: scores.autonomy >= 75 ? "autonomo-alto" : scores.autonomy >= 55 ? "autonomo-ativo" : "assistido",
    intent,
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
  const context = { newsItems, newsSummary, reviewReport };
  const memoryStore = readAgentMemoryStore();

  const queue = agents.map((agent) => {
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
  });

  writeAgentMemoryStore(memoryStore);

  const officeStatus = pickTop(agents, (agent) => agent.officeLabel, 20).map((item) => ({
    officeLabel: item.value,
    agentCount: item.count,
    focus:
      agents.find((agent) => agent.officeLabel === item.value)?.newsroomBridge ||
      "monitoramento do jornal"
  }));
  const autonomySummary = summarizeAutonomy(queue);

  const runReport = {
    generatedAt: new Date().toISOString(),
    summary: {
      totalAgents: agents.length,
      totalOffices: officeStatus.length,
      newsItems: newsItems.length,
      reviewIssues: (reviewReport.issues || []).length,
      autonomousAgents: autonomySummary.autonomousAgents,
      highAutonomyAgents: autonomySummary.highAutonomyAgents,
      averageAutonomy: autonomySummary.averageAutonomy
    },
    news: newsSummary,
    autonomy: autonomySummary,
    offices: officeStatus,
    queue
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
