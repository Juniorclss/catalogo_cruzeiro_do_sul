"use strict";

(() => {
  const form = document.getElementById("pollAdminAccessForm");
  const apiBaseInput = document.getElementById("pollAdminApiBase");
  const userInput = document.getElementById("pollAdminUser");
  const passwordInput = document.getElementById("pollAdminPassword");
  const feedback = document.getElementById("pollAdminFeedback");
  const dashboard = document.getElementById("pollAdminDashboard");
  const kpis = document.getElementById("pollAdminKpis");
  const reportMeta = document.getElementById("pollAdminReportMeta");
  const narrative = document.getElementById("pollAdminNarrative");
  const timeline = document.getElementById("pollAdminTimeline");
  const flowVote = document.getElementById("pollAdminFlowVote");
  const flowSecond = document.getElementById("pollAdminFlowSecond");
  const dataHealth = document.getElementById("pollAdminDataHealth");
  const breakdowns = document.getElementById("pollAdminBreakdowns");
  const candidateInsights = document.getElementById("pollAdminCandidateInsights");
  const ageMatrix = document.getElementById("pollAdminAgeMatrix");
  const locationMatrix = document.getElementById("pollAdminLocationMatrix");
  const professionMatrix = document.getElementById("pollAdminProfessionMatrix");
  const commentTags = document.getElementById("pollAdminCommentTags");
  const commentHighlights = document.getElementById("pollAdminCommentHighlights");
  const distributionSummary = document.getElementById("pollAdminDistributionSummary");
  const tableBody = document.getElementById("pollAdminTableBody");
  const tableMeta = document.getElementById("pollAdminTableMeta");
  const exportButton = document.getElementById("pollAdminExport");
  const clearFiltersButton = document.getElementById("pollAdminClearFilters");
  const filters = {
    search: document.getElementById("pollAdminSearch"),
    vote2026: document.getElementById("pollAdminFilterVote2026"),
    age: document.getElementById("pollAdminFilterAge"),
    priority: document.getElementById("pollAdminFilterPriority"),
    previousVote: document.getElementById("pollAdminFilterPreviousVote"),
    cycle: document.getElementById("pollAdminFilterCycle"),
    certainty: document.getElementById("pollAdminFilterCertainty"),
    government: document.getElementById("pollAdminFilterGovernment"),
    location: document.getElementById("pollAdminFilterLocation"),
    profession: document.getElementById("pollAdminFilterProfession"),
    recency: document.getElementById("pollAdminFilterRecency")
  };
  const suggestionLists = {
    locations: document.getElementById("pollAdminLocationsList"),
    professions: document.getElementById("pollAdminProfessionsList")
  };
  const ACCESS_KEY = "acre_2026_poll_admin_access_v1";
  const CSV_FIELDS = [
    "id",
    "createdAt",
    "weekKey",
    "googleEmail",
    "googleSub",
    "profissao",
    "localizacao",
    "faixaEtaria",
    "votoAnterior",
    "avaliacaoGoverno",
    "direcaoEstado",
    "desejoCiclo",
    "satisfacao",
    "voto2026",
    "segundaOpcao",
    "certezaVoto",
    "rejeicao",
    "prioridade",
    "atencaoPolitica",
    "fatorDecisivo",
    "comentario",
    "sourcePage",
    "pageTitle",
    "referrerHost",
    "city",
    "country",
    "browser",
    "deviceType",
    "visitorId",
    "sessionId",
    "ip"
  ];
  const BREAKDOWN_DEFINITIONS = [
    {
      key: "voto2026",
      label: "Intenção principal para 2026",
      description: "Quem aparece na frente dentro do recorte ativo.",
      tone: "vote",
      limit: 6
    },
    {
      key: "segundaOpcao",
      label: "Segunda opção",
      description: "Reserva de voto quando o nome principal sai do jogo.",
      tone: "vote",
      limit: 6
    },
    {
      key: "rejeicao",
      label: "Rejeição",
      description: "Nome mais bloqueado pelos respondentes.",
      tone: "rejection",
      limit: 6
    },
    {
      key: "prioridade",
      label: "Prioridade principal",
      description: "Tema que mais pesa hoje na cabeça do eleitor.",
      tone: "priority",
      limit: 6
    },
    {
      key: "avaliacaoGoverno",
      label: "Avaliação do governo",
      description: "Percepção direta sobre a gestão atual.",
      tone: "priority",
      limit: 6
    },
    {
      key: "direcaoEstado",
      label: "Direção do Estado",
      description: "Se o Acre está no rumo certo, errado ou no meio-termo.",
      tone: "priority",
      limit: 6
    },
    {
      key: "desejoCiclo",
      label: "Desejo de ciclo",
      description: "Mudança, continuidade ou equilíbrio.",
      tone: "vote",
      limit: 6
    },
    {
      key: "certezaVoto",
      label: "Firmeza do voto",
      description: "Quão consolidada está a escolha atual.",
      tone: "vote",
      limit: 6
    },
    {
      key: "votoAnterior",
      label: "Voto para governador em 2022",
      description: "Base de origem política declarada.",
      tone: "vote",
      limit: 6
    },
    {
      key: "atencaoPolitica",
      label: "Atenção à política",
      description: "Grau de acompanhamento do noticiário e debate.",
      tone: "priority",
      limit: 6
    },
    {
      key: "fatorDecisivo",
      label: "Fator decisivo",
      description: "O que mais define a escolha do voto.",
      tone: "priority",
      limit: 6
    },
    {
      key: "faixaEtaria",
      label: "Faixa etária",
      description: "Distribuição etária do recorte atual.",
      tone: "vote",
      limit: 6
    },
    {
      key: "localizacao",
      label: "Localização informada",
      description: "Origens mais frequentes da amostra.",
      tone: "priority",
      limit: 8
    },
    {
      key: "profissao",
      label: "Área de atuação / trabalho",
      description: "Profissões e universos que mais responderam.",
      tone: "priority",
      limit: 8
    },
    {
      key: "deviceType",
      label: "Dispositivo",
      description: "Como o eleitor respondeu tecnicamente.",
      tone: "vote",
      limit: 6
    },
    {
      key: "browser",
      label: "Navegador",
      description: "Canal técnico de entrada da resposta.",
      tone: "vote",
      limit: 6
    }
  ];
  const COMMENT_STOPWORDS = new Set([
    "acre",
    "agora",
    "ainda",
    "alem",
    "antes",
    "apos",
    "aqui",
    "assim",
    "cada",
    "como",
    "coisa",
    "coisas",
    "contra",
    "depois",
    "dessa",
    "desse",
    "deste",
    "eleicao",
    "eleicoes",
    "entre",
    "essa",
    "esse",
    "esta",
    "estao",
    "estar",
    "estas",
    "este",
    "fazer",
    "governo",
    "hoje",
    "isso",
    "mais",
    "menos",
    "mesmo",
    "muito",
    "nada",
    "nao",
    "para",
    "parte",
    "pelos",
    "pela",
    "pelo",
    "porque",
    "quando",
    "quase",
    "quem",
    "sera",
    "seria",
    "sobre",
    "tambem",
    "temos",
    "tenho",
    "tinha",
    "todo",
    "todos",
    "uma",
    "umas",
    "uns",
    "votar",
    "voto"
  ]);
  const numberFormatter = new Intl.NumberFormat("pt-BR");
  const decimalFormatter = new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  });
  const integerFormatter = new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
  const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short"
  });

  let lastPayload = null;
  let lastFilteredRecords = [];

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function normalizeText(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }

  function setFeedback(message, state = "") {
    if (!feedback) return;
    feedback.textContent = message || "";
    if (state) {
      feedback.dataset.state = state;
    } else {
      delete feedback.dataset.state;
    }
  }

  function formatDateTime(value) {
    if (!value) return "Sem atualização";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return String(value);
    return dateFormatter.format(parsed);
  }

  function trimText(value, maxLength = 220) {
    const text = String(value || "").trim();
    if (text.length <= maxLength) return text;
    return `${text.slice(0, maxLength - 1).trimEnd()}…`;
  }

  function shrinkValue(value, maxLength = 44) {
    const text = String(value || "").trim();
    if (text.length <= maxLength) return text;
    const side = Math.max(8, Math.floor((maxLength - 3) / 2));
    return `${text.slice(0, side)}...${text.slice(-side)}`;
  }

  function average(list = [], digits = 1) {
    const values = (Array.isArray(list) ? list : []).filter((item) => Number.isFinite(Number(item)));
    if (!values.length) return 0;
    const total = values.reduce((sum, item) => sum + Number(item), 0);
    return Number((total / values.length).toFixed(digits));
  }

  function normalizeBase(value) {
    return String(value || "").trim().replace(/\/$/, "");
  }

  function getDefaultApiBase() {
    return location.protocol === "file:" ? "http://localhost:3000" : location.origin;
  }

  function getStoredAccess() {
    try {
      return JSON.parse(sessionStorage.getItem(ACCESS_KEY) || "{}");
    } catch {
      return {};
    }
  }

  function saveStoredAccess(value) {
    try {
      sessionStorage.setItem(ACCESS_KEY, JSON.stringify(value || {}));
    } catch {
      // ignore
    }
  }

  function encodeBasicAuth(user, password) {
    if (!user || !password) return "";
    try {
      return `Basic ${btoa(`${user}:${password}`)}`;
    } catch {
      return "";
    }
  }

  async function readJson(response) {
    try {
      return await response.json();
    } catch {
      return {};
    }
  }

  function formatPercent(value) {
    return `${decimalFormatter.format(Number(value || 0))}%`;
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

  function formatWeekLabel(value = "") {
    const match = String(value || "").match(/^(\d{4})-W(\d{2})$/);
    if (!match) return value || "Semana indefinida";
    return `${match[1]} · sem ${match[2]}`;
  }

  function buildBreakdown(items = [], key, limit = 6) {
    const counts = new Map();
    const source = Array.isArray(items) ? items : [];
    source.forEach((item) => {
      const label = String(item?.[key] || "").trim() || "Nao informado";
      counts.set(label, (counts.get(label) || 0) + 1);
    });

    return Array.from(counts.entries())
      .map(([label, total]) => ({
        label,
        total,
        percent: source.length ? Number(((total / source.length) * 100).toFixed(1)) : 0
      }))
      .sort((left, right) => {
        if (right.total !== left.total) return right.total - left.total;
        return String(left.label).localeCompare(String(right.label), "pt-BR");
      })
      .slice(0, limit);
  }

  function getLeader(items = [], key, blockedLabels = []) {
    const blocked = new Set((Array.isArray(blockedLabels) ? blockedLabels : []).map((label) => normalizeText(label)));
    return buildBreakdown(items, key, 20).find((entry) => !blocked.has(normalizeText(entry.label))) || null;
  }

  function getPercentForLabel(items = [], key, label) {
    const normalized = normalizeText(label);
    const match = buildBreakdown(items, key, 30).find((entry) => normalizeText(entry.label) === normalized);
    return Number(match?.percent || 0);
  }

  function buildWeeklyTrendSeries(records = [], valueField = "voto2026") {
    const bucket = new Map();
    (Array.isArray(records) ? records : []).forEach((item) => {
      const week = getWeekBucketKey(item?.createdAt || "");
      if (!bucket.has(week)) {
        bucket.set(week, {
          week,
          total: 0,
          labels: {}
        });
      }

      const entry = bucket.get(week);
      const label = String(item?.[valueField] || "").trim() || "Nao informado";
      entry.total += 1;
      entry.labels[label] = (entry.labels[label] || 0) + 1;
    });

    const weeks = Array.from(bucket.values()).sort((left, right) =>
      String(left.week).localeCompare(String(right.week), "pt-BR")
    );

    return weeks.map((entry, index) => {
      const labels = Object.entries(entry.labels)
        .map(([label, total]) => ({
          label,
          total,
          percent: entry.total ? Number(((total / entry.total) * 100).toFixed(1)) : 0
        }))
        .sort((left, right) => right.total - left.total)
        .slice(0, 5);

      return {
        week: entry.week,
        total: entry.total,
        labels,
        changeFromPrevious: index > 0 ? entry.total - weeks[index - 1].total : 0
      };
    });
  }

  function buildComboBreakdown(records = [], fromKey, toKey, limit = 6) {
    const combos = new Map();
    const source = Array.isArray(records) ? records : [];
    source.forEach((record) => {
      const from = String(record?.[fromKey] || "").trim() || "Nao informado";
      const to = String(record?.[toKey] || "").trim() || "Nao informado";
      const key = `${from}|||${to}`;
      if (!combos.has(key)) {
        combos.set(key, {
          from,
          to,
          total: 0
        });
      }
      combos.get(key).total += 1;
    });

    return Array.from(combos.values())
      .map((entry) => ({
        ...entry,
        percent: source.length ? Number(((entry.total / source.length) * 100).toFixed(1)) : 0
      }))
      .sort((left, right) => right.total - left.total)
      .slice(0, limit);
  }

  function buildGroupedInsights(records = [], groupKey, limit = 6) {
    return buildBreakdown(records, groupKey, 60)
      .filter((entry) => normalizeText(entry.label) !== "nao informado")
      .slice(0, limit)
      .map((entry) => {
        const subset = records.filter((record) => String(record?.[groupKey] || "").trim() === entry.label);
        return {
          label: entry.label,
          total: entry.total,
          percent: entry.percent,
          leadVote: getLeader(subset, "voto2026", ["Ainda nao decidi", "Branco/Nulo"])?.label || "Sem líder claro",
          topPriority: getLeader(subset, "prioridade")?.label || "Sem leitura",
          desiredCycle: getLeader(subset, "desejoCiclo", ["Nao sabe"])?.label || "Sem leitura",
          avgSatisfaction: average(
            subset
              .map((item) => Number(item?.satisfacao || 0))
              .filter((value) => Number.isFinite(value) && value > 0),
            1
          )
        };
      });
  }

  function collectDistinctValues(records = [], key, limit = 80) {
    return buildBreakdown(records, key, limit)
      .map((entry) => entry.label)
      .filter((label) => normalizeText(label) !== "nao informado");
  }

  function populateSelect(select, values, allLabel = "Todos") {
    if (!select) return;
    const previousValue = select.value;
    const options = [`<option value="">${escapeHtml(allLabel)}</option>`]
      .concat(
        (Array.isArray(values) ? values : []).map(
          (value) => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`
        )
      )
      .join("");
    select.innerHTML = options;
    if ((Array.isArray(values) ? values : []).includes(previousValue)) {
      select.value = previousValue;
    }
  }

  function populateDatalist(datalist, values) {
    if (!datalist) return;
    datalist.innerHTML = (Array.isArray(values) ? values : [])
      .map((value) => `<option value="${escapeHtml(value)}"></option>`)
      .join("");
  }

  function hydrateFilterOptions(records = []) {
    populateSelect(filters.vote2026, collectDistinctValues(records, "voto2026", 20), "Todos");
    populateSelect(filters.age, collectDistinctValues(records, "faixaEtaria", 20), "Todas");
    populateSelect(filters.priority, collectDistinctValues(records, "prioridade", 20), "Todas");
    populateSelect(filters.previousVote, collectDistinctValues(records, "votoAnterior", 20), "Todos");
    populateSelect(filters.cycle, collectDistinctValues(records, "desejoCiclo", 20), "Todos");
    populateSelect(filters.certainty, collectDistinctValues(records, "certezaVoto", 20), "Todas");
    populateSelect(filters.government, collectDistinctValues(records, "avaliacaoGoverno", 20), "Todas");
    populateDatalist(suggestionLists.locations, collectDistinctValues(records, "localizacao", 60));
    populateDatalist(suggestionLists.professions, collectDistinctValues(records, "profissao", 60));
  }

  function getActiveFilters() {
    return {
      search: normalizeText(filters.search?.value || ""),
      vote2026: String(filters.vote2026?.value || "").trim(),
      age: String(filters.age?.value || "").trim(),
      priority: String(filters.priority?.value || "").trim(),
      previousVote: String(filters.previousVote?.value || "").trim(),
      cycle: String(filters.cycle?.value || "").trim(),
      certainty: String(filters.certainty?.value || "").trim(),
      government: String(filters.government?.value || "").trim(),
      location: normalizeText(filters.location?.value || ""),
      profession: normalizeText(filters.profession?.value || ""),
      recency: String(filters.recency?.value || "all").trim() || "all"
    };
  }

  function matchesRecency(record = {}, recency = "all") {
    if (!recency || recency === "all") return true;
    const createdAt = new Date(record.createdAt || "");
    if (Number.isNaN(createdAt.getTime())) return false;
    const diffMs = Date.now() - createdAt.getTime();
    const ranges = {
      "24h": 24 * 60 * 60 * 1000,
      "7d": 7 * 24 * 60 * 60 * 1000,
      "30d": 30 * 24 * 60 * 60 * 1000
    };
    return diffMs <= (ranges[recency] || Number.MAX_SAFE_INTEGER);
  }

  function matchesSearch(record = {}, query = "") {
    if (!query) return true;
    const haystack = normalizeText(
      [
        record.id,
        record.googleEmail,
        record.profissao,
        record.localizacao,
        record.faixaEtaria,
        record.votoAnterior,
        record.avaliacaoGoverno,
        record.direcaoEstado,
        record.desejoCiclo,
        record.voto2026,
        record.segundaOpcao,
        record.certezaVoto,
        record.rejeicao,
        record.prioridade,
        record.atencaoPolitica,
        record.fatorDecisivo,
        record.comentario,
        record.city,
        record.country,
        record.browser,
        record.deviceType,
        record.sourcePage,
        record.pageTitle,
        record.referrerHost
      ].join(" ")
    );

    return haystack.includes(query);
  }

  function filterRecords(records = [], activeFilters = getActiveFilters()) {
    return (Array.isArray(records) ? records : []).filter((record) => {
      if (activeFilters.vote2026 && String(record.voto2026 || "").trim() !== activeFilters.vote2026) return false;
      if (activeFilters.age && String(record.faixaEtaria || "").trim() !== activeFilters.age) return false;
      if (activeFilters.priority && String(record.prioridade || "").trim() !== activeFilters.priority) return false;
      if (activeFilters.previousVote && String(record.votoAnterior || "").trim() !== activeFilters.previousVote) return false;
      if (activeFilters.cycle && String(record.desejoCiclo || "").trim() !== activeFilters.cycle) return false;
      if (activeFilters.certainty && String(record.certezaVoto || "").trim() !== activeFilters.certainty) return false;
      if (activeFilters.government && String(record.avaliacaoGoverno || "").trim() !== activeFilters.government) return false;
      if (activeFilters.location && !normalizeText(record.localizacao || record.city || "").includes(activeFilters.location)) return false;
      if (activeFilters.profession && !normalizeText(record.profissao || "").includes(activeFilters.profession)) return false;
      if (!matchesRecency(record, activeFilters.recency)) return false;
      if (!matchesSearch(record, activeFilters.search)) return false;
      return true;
    });
  }

  function formatFilterMeta(activeFilters = {}, filteredCount = 0, totalCount = 0) {
    const parts = [];
    if (activeFilters.search) parts.push(`busca "${activeFilters.search}"`);
    if (activeFilters.vote2026) parts.push(`2026: ${activeFilters.vote2026}`);
    if (activeFilters.age) parts.push(`idade: ${activeFilters.age}`);
    if (activeFilters.priority) parts.push(`prioridade: ${activeFilters.priority}`);
    if (activeFilters.previousVote) parts.push(`2022: ${activeFilters.previousVote}`);
    if (activeFilters.cycle) parts.push(`ciclo: ${activeFilters.cycle}`);
    if (activeFilters.certainty) parts.push(`firmeza: ${activeFilters.certainty}`);
    if (activeFilters.government) parts.push(`governo: ${activeFilters.government}`);
    if (activeFilters.location) parts.push(`local contém "${activeFilters.location}"`);
    if (activeFilters.profession) parts.push(`profissão contém "${activeFilters.profession}"`);
    if (activeFilters.recency && activeFilters.recency !== "all") parts.push(`janela: ${activeFilters.recency}`);

    const head = `${numberFormatter.format(filteredCount)} de ${numberFormatter.format(totalCount)} respostas no recorte atual.`;
    return parts.length ? `${head} Filtros ativos: ${parts.join(" • ")}.` : `${head} Sem filtros adicionais no momento.`;
  }

  function renderBarRowsHtml(items = [], tone = "vote", emptyMessage = "Sem dados suficientes.") {
    if (!Array.isArray(items) || !items.length) {
      return `<p class="poll-admin-empty">${escapeHtml(emptyMessage)}</p>`;
    }

    return `
      <div class="poll-bar-list">
        ${items
          .map(
            (item) => `
              <div class="poll-bar-row" data-tone="${escapeHtml(tone)}">
                <div class="poll-bar-meta">
                  <strong>${escapeHtml(item.label)}</strong>
                  <span>${numberFormatter.format(item.total || 0)} • ${formatPercent(item.percent || 0)}</span>
                </div>
                <div class="poll-bar-track">
                  <span style="width:${Math.max(0, Math.min(100, Number(item.percent || 0)))}%"></span>
                </div>
              </div>
            `
          )
          .join("")}
      </div>
    `;
  }

  function renderKpis(records = [], totalRecords = 0) {
    if (!kpis) return;

    const voteLeader = getLeader(records, "voto2026");
    const rejectionLeader = getLeader(records, "rejeicao");
    const priorityLeader = getLeader(records, "prioridade");
    const cycleLeader = getLeader(records, "desejoCiclo", ["Nao sabe"]);
    const satisfactionAverage = average(
      records
        .map((item) => Number(item?.satisfacao || 0))
        .filter((value) => Number.isFinite(value) && value > 0),
      1
    );
    const decidedShare = getPercentForLabel(records, "certezaVoto", "Ja esta decidido");
    const commentAverage = average(
      records
        .map((item) => String(item?.comentario || "").trim().length)
        .filter((value) => Number.isFinite(value) && value > 0),
      0
    );
    const lastRecord = records[0]?.createdAt || "";
    const cards = [
      {
        value: numberFormatter.format(records.length),
        label: "respostas no recorte",
        note: totalRecords ? `${numberFormatter.format(totalRecords)} totais na base` : "Base ainda vazia"
      },
      {
        value: decimalFormatter.format(satisfactionAverage),
        label: "satisfação média",
        note: "média do bloco de avaliação em escala de 1 a 5"
      },
      {
        value: escapeHtml(voteLeader?.label || "Sem líder"),
        label: "liderança em 2026",
        note: voteLeader ? `${formatPercent(voteLeader.percent)} da amostra filtrada` : "sem amostra"
      },
      {
        value: escapeHtml(rejectionLeader?.label || "Sem rejeição"),
        label: "rejeição dominante",
        note: rejectionLeader ? `${formatPercent(rejectionLeader.percent)} das respostas` : "sem amostra"
      },
      {
        value: escapeHtml(priorityLeader?.label || "Sem prioridade"),
        label: "tema que mais pesa",
        note: priorityLeader ? `${numberFormatter.format(priorityLeader.total)} menções` : "sem amostra"
      },
      {
        value: formatPercent(decidedShare),
        label: "voto já decidido",
        note: "percentual que diz estar com o voto fechado"
      },
      {
        value: escapeHtml(cycleLeader?.label || "Sem ciclo"),
        label: "desejo de ciclo",
        note: cycleLeader ? `${formatPercent(cycleLeader.percent)} no recorte` : "sem amostra"
      },
      {
        value: integerFormatter.format(commentAverage),
        label: "média de caracteres",
        note: lastRecord ? `última resposta em ${formatDateTime(lastRecord)}` : "aguardando respostas"
      }
    ];

    kpis.innerHTML = cards
      .map(
        (card) => `
          <article>
            <strong>${card.value}</strong>
            <span>${escapeHtml(card.label)}</span>
            <small>${escapeHtml(card.note)}</small>
          </article>
        `
      )
      .join("");
  }

  function renderNarrative(records = [], totalRecords = 0) {
    if (!narrative) return;

    if (!records.length) {
      narrative.innerHTML = `<p class="poll-admin-empty">Sem dados no recorte atual. Ajuste os filtros para reabrir a leitura executiva.</p>`;
      return;
    }

    const voteBreakdown = buildBreakdown(records, "voto2026", 3);
    const leader = voteBreakdown[0] || null;
    const second = voteBreakdown[1] || null;
    const priority = getLeader(records, "prioridade");
    const rejection = getLeader(records, "rejeicao");
    const cycle = getLeader(records, "desejoCiclo", ["Nao sabe"]);
    const topAge = buildBreakdown(records, "faixaEtaria", 1)[0] || null;
    const topLocation = buildBreakdown(records, "localizacao", 1)[0] || null;
    const topAgeSubset = topAge
      ? records.filter((record) => String(record.faixaEtaria || "").trim() === topAge.label)
      : [];
    const topAgeLeader = getLeader(topAgeSubset, "voto2026", ["Ainda nao decidi", "Branco/Nulo"]);
    const googleCount = records.filter((record) => String(record.googleEmail || "").trim()).length;
    const margin = leader && second ? Number((leader.percent - second.percent).toFixed(1)) : 0;
    const items = [
      {
        title: "Tamanho e recorte",
        text: `A leitura atual usa ${numberFormatter.format(records.length)} respostas do recorte filtrado, dentro de um universo total de ${numberFormatter.format(totalRecords)} registros armazenados.`
      },
      {
        title: "Liderança eleitoral",
        text: leader
          ? `${leader.label} lidera com ${formatPercent(leader.percent)}. ${second ? `A margem sobre ${second.label} é de ${decimalFormatter.format(margin)} ponto(s).` : "Ainda não há segundo colocado robusto no recorte."}`
          : "Ainda não existe liderança clara no recorte selecionado."
      },
      {
        title: "Agenda dominante",
        text: `${priority?.label || "Sem prioridade dominante"} é o tema mais citado, enquanto ${cycle?.label || "sem desejo de ciclo dominante"} aparece como vontade política mais frequente. ${rejection ? `Na rejeição, o nome mais bloqueado é ${rejection.label}.` : ""}`.trim()
      },
      {
        title: "Perfil mais ativo",
        text: `${topAge ? `${topAge.label} é a faixa com maior volume,` : "Sem faixa etária dominante,"} ${topAgeLeader ? `e dentro dela o nome mais forte é ${topAgeLeader.label}.` : "sem liderança definida."} ${topLocation ? `O ponto de origem mais recorrente no recorte é ${topLocation.label}.` : ""}`.trim()
      },
      {
        title: "Qualidade do recorte",
        text: `${numberFormatter.format(googleCount)} respostas trazem e-mail Google visível para auditoria administrativa, e a média de satisfação no bloco atual está em ${decimalFormatter.format(
          average(
            records
              .map((item) => Number(item?.satisfacao || 0))
              .filter((value) => Number.isFinite(value) && value > 0),
            1
          )
        )}.`
      }
    ];

    narrative.innerHTML = items
      .map(
        (item) => `
          <article class="poll-admin-bullet-item">
            <strong>${escapeHtml(item.title)}</strong>
            <p>${escapeHtml(item.text)}</p>
          </article>
        `
      )
      .join("");
  }

  function renderTimeline(records = []) {
    if (!timeline) return;

    const weekly = buildWeeklyTrendSeries(records, "voto2026");
    if (!weekly.length) {
      timeline.innerHTML = `<p class="poll-admin-empty">Sem série temporal suficiente para montar a tendência semanal.</p>`;
      return;
    }

    const maxTotal = Math.max(...weekly.map((item) => Number(item.total || 0)), 1);
    timeline.innerHTML = weekly
      .map((entry) => {
        const leader = entry.labels?.[0];
        const changeLabel =
          entry.changeFromPrevious === 0
            ? "estável versus semana anterior"
            : entry.changeFromPrevious > 0
              ? `+${numberFormatter.format(entry.changeFromPrevious)} vs semana anterior`
              : `${numberFormatter.format(entry.changeFromPrevious)} vs semana anterior`;

        return `
          <article class="poll-admin-timeline-row">
            <div class="poll-admin-timeline-head">
              <strong>${escapeHtml(formatWeekLabel(entry.week))}</strong>
              <span>${numberFormatter.format(entry.total)} respostas • ${escapeHtml(changeLabel)}</span>
            </div>
            <div class="poll-admin-timeline-track">
              <span style="width:${Math.max(6, Math.min(100, (Number(entry.total || 0) / maxTotal) * 100))}%"></span>
            </div>
            <small>${escapeHtml(leader ? `${leader.label} lidera na semana com ${formatPercent(leader.percent)}` : "Sem liderança semanal definida")}</small>
          </article>
        `;
      })
      .join("");
  }

  function renderFlowList(container, items = [], emptyMessage) {
    if (!container) return;

    if (!items.length) {
      container.innerHTML = `<p class="poll-admin-empty">${escapeHtml(emptyMessage)}</p>`;
      return;
    }

    container.innerHTML = items
      .map(
        (item) => `
          <article class="poll-admin-flow-item">
            <div class="poll-admin-flow-head">
              <strong>${escapeHtml(item.from)}</strong>
              <span class="poll-admin-flow-arrow">→</span>
              <strong>${escapeHtml(item.to)}</strong>
            </div>
            <p>${numberFormatter.format(item.total)} registros • ${formatPercent(item.percent)}</p>
          </article>
        `
      )
      .join("");
  }

  function renderFlows(records = []) {
    renderFlowList(
      flowVote,
      buildComboBreakdown(records, "votoAnterior", "voto2026", 8),
      "Sem fluxo suficiente entre 2022 e 2026 no recorte."
    );
    renderFlowList(
      flowSecond,
      buildComboBreakdown(records, "voto2026", "segundaOpcao", 8),
      "Sem fluxo suficiente entre voto principal e segunda opção no recorte."
    );
  }

  function renderHealth(records = [], totalRecords = 0) {
    if (!dataHealth) return;

    if (!records.length) {
      dataHealth.innerHTML = `<p class="poll-admin-empty">Sem dados para medir a saúde da base no recorte atual.</p>`;
      return;
    }

    const commentAverage = average(
      records
        .map((item) => String(item?.comentario || "").trim().length)
        .filter((value) => Number.isFinite(value) && value > 0),
      0
    );
    const uniqueLocations = new Set(
      records.map((item) => normalizeText(item.localizacao || item.city || "")).filter(Boolean)
    ).size;
    const uniqueProfessions = new Set(records.map((item) => normalizeText(item.profissao || "")).filter(Boolean)).size;
    const googleCount = records.filter((item) => String(item.googleEmail || "").trim()).length;
    const mobileCount = records.filter((item) =>
      /mobile|android|iphone|ios|phone/i.test(String(item.deviceType || ""))
    ).length;
    const desktopCount = records.filter((item) =>
      /desktop|windows|mac|linux/i.test(String(item.deviceType || ""))
    ).length;
    const topBrowser = getLeader(records, "browser");
    const topSource = getLeader(records, "sourcePage");
    const weekly = buildWeeklyTrendSeries(records, "voto2026");
    const strongestWeek = weekly.slice().sort((left, right) => right.total - left.total)[0];
    const items = [
      {
        title: "Registros filtrados",
        value: `${numberFormatter.format(records.length)} / ${numberFormatter.format(totalRecords)}`,
        note: "volume ativo dentro do total armazenado"
      },
      {
        title: "Comentários médios",
        value: `${integerFormatter.format(commentAverage)} caracteres`,
        note: "comprimento médio do campo aberto"
      },
      {
        title: "Locais distintos",
        value: numberFormatter.format(uniqueLocations),
        note: "localizações informadas diferentes no recorte"
      },
      {
        title: "Profissões distintas",
        value: numberFormatter.format(uniqueProfessions),
        note: "áreas de atuação diferentes registradas"
      },
      {
        title: "Google com e-mail",
        value: `${numberFormatter.format(googleCount)} respostas`,
        note: "registros com e-mail Google visível na auditoria"
      },
      {
        title: "Mobile x desktop",
        value: `${formatPercent(records.length ? (mobileCount / records.length) * 100 : 0)} mobile`,
        note: `${formatPercent(records.length ? (desktopCount / records.length) * 100 : 0)} desktop`
      },
      {
        title: "Canal técnico dominante",
        value: topBrowser?.label || "Sem leitura",
        note: topBrowser ? `${formatPercent(topBrowser.percent)} do recorte • origem ${topSource?.label || "não identificada"}` : "sem dados técnicos"
      },
      {
        title: "Janela mais forte",
        value: strongestWeek ? formatWeekLabel(strongestWeek.week) : "Sem semana",
        note: strongestWeek ? `${numberFormatter.format(strongestWeek.total)} respostas nessa semana` : "sem leitura temporal"
      }
    ];

    dataHealth.innerHTML = items
      .map(
        (item) => `
          <article class="poll-admin-health-item">
            <span>${escapeHtml(item.title)}</span>
            <strong>${escapeHtml(item.value)}</strong>
            <small>${escapeHtml(item.note)}</small>
          </article>
        `
      )
      .join("");
  }

  function renderBreakdowns(records = []) {
    if (!breakdowns) return;

    breakdowns.innerHTML = BREAKDOWN_DEFINITIONS.map((definition) => {
      const items = buildBreakdown(records, definition.key, definition.limit || 6);
      return `
        <article class="poll-admin-breakdown-card">
          <div>
            <h3>${escapeHtml(definition.label)}</h3>
            <p>${escapeHtml(definition.description)}</p>
          </div>
          ${renderBarRowsHtml(items, definition.tone || "vote", "Sem dados suficientes nesse recorte.")}
        </article>
      `;
    }).join("");
  }

  function renderCandidateInsights(records = []) {
    if (!candidateInsights) return;

    const candidates = buildBreakdown(records, "voto2026", 12)
      .filter((entry) => !["Ainda nao decidi", "Branco/Nulo", "Nao informado"].includes(entry.label))
      .slice(0, 6);

    if (!candidates.length) {
      candidateInsights.innerHTML = `<p class="poll-admin-empty">Sem massa suficiente para montar perfis por candidato no recorte atual.</p>`;
      return;
    }

    candidateInsights.innerHTML = candidates
      .map((entry) => {
        const subset = records.filter((record) => String(record.voto2026 || "").trim() === entry.label);
        const avgSatisfaction = average(
          subset
            .map((item) => Number(item?.satisfacao || 0))
            .filter((value) => Number.isFinite(value) && value > 0),
          1
        );
        const decidedShare = getPercentForLabel(subset, "certezaVoto", "Ja esta decidido");
        const topPriority = getLeader(subset, "prioridade")?.label || "Sem leitura";
        const topSecondOption =
          getLeader(subset, "segundaOpcao", [entry.label])?.label || getLeader(subset, "segundaOpcao")?.label || "Sem leitura";
        const topAge = getLeader(subset, "faixaEtaria")?.label || "Sem leitura";
        const topLocation = getLeader(subset, "localizacao")?.label || "Sem leitura";
        const topDriver = getLeader(subset, "fatorDecisivo")?.label || "Sem leitura";

        return `
          <article class="poll-admin-candidate-card">
            <span>${formatPercent(entry.percent)} do recorte • ${numberFormatter.format(entry.total)} respostas</span>
            <strong>${escapeHtml(entry.label)}</strong>
            <p>Satisfação média ${decimalFormatter.format(avgSatisfaction)} e ${formatPercent(decidedShare)} com voto já decidido.</p>
            <ul>
              <li><b>Prioridade dominante:</b> ${escapeHtml(topPriority)}</li>
              <li><b>Segunda opção mais citada:</b> ${escapeHtml(topSecondOption)}</li>
              <li><b>Faixa etária dominante:</b> ${escapeHtml(topAge)}</li>
              <li><b>Local mais frequente:</b> ${escapeHtml(topLocation)}</li>
              <li><b>Fator decisivo:</b> ${escapeHtml(topDriver)}</li>
            </ul>
          </article>
        `;
      })
      .join("");
  }

  function renderMatrix(container, rows = [], emptyMessage) {
    if (!container) return;

    if (!rows.length) {
      container.innerHTML = `<p class="poll-admin-empty">${escapeHtml(emptyMessage)}</p>`;
      return;
    }

    container.innerHTML = rows
      .map(
        (row) => `
          <article class="poll-admin-matrix-row">
            <div class="poll-admin-matrix-head">
              <strong>${escapeHtml(row.label)}</strong>
              <span>${numberFormatter.format(row.total)} respostas • ${formatPercent(row.percent)}</span>
            </div>
            <p>Liderança: <b>${escapeHtml(row.leadVote)}</b> • Prioridade: <b>${escapeHtml(row.topPriority)}</b></p>
            <small>Desejo de ciclo: ${escapeHtml(row.desiredCycle)} • Satisfação média ${decimalFormatter.format(row.avgSatisfaction)}</small>
          </article>
        `
      )
      .join("");
  }

  function renderCrossInsights(records = []) {
    renderMatrix(
      ageMatrix,
      buildGroupedInsights(records, "faixaEtaria", 6),
      "Sem leitura por faixa etária no recorte atual."
    );
    renderMatrix(
      locationMatrix,
      buildGroupedInsights(records, "localizacao", 8),
      "Sem leitura por localização no recorte atual."
    );
    renderMatrix(
      professionMatrix,
      buildGroupedInsights(records, "profissao", 8),
      "Sem leitura por profissão no recorte atual."
    );
  }

  function extractCommentTerms(records = [], limit = 18) {
    const counter = new Map();

    records.forEach((record) => {
      normalizeText(record?.comentario || "")
        .split(/[^a-z0-9]+/g)
        .filter((token) => token.length >= 4 && !COMMENT_STOPWORDS.has(token))
        .forEach((token) => {
          counter.set(token, (counter.get(token) || 0) + 1);
        });
    });

    return Array.from(counter.entries())
      .map(([label, total]) => ({ label, total }))
      .sort((left, right) => right.total - left.total)
      .slice(0, limit);
  }

  function renderCommentSignals(records = []) {
    if (commentTags) {
      const tags = extractCommentTerms(records, 18);
      commentTags.innerHTML = tags.length
        ? tags
            .map(
              (tag) => `
                <span class="poll-admin-tag">
                  ${escapeHtml(tag.label)}
                  <small>${numberFormatter.format(tag.total)}</small>
                </span>
              `
            )
            .join("")
        : `<p class="poll-admin-empty">Sem comentários suficientes para extrair sinais textuais.</p>`;
    }

    if (commentHighlights) {
      const comments = records
        .filter((record) => String(record.comentario || "").trim().length >= 10)
        .slice(0, 6);

      commentHighlights.innerHTML = comments.length
        ? comments
            .map(
              (record) => `
                <article class="poll-admin-comment-card">
                  <strong>${escapeHtml(record.voto2026 || "Sem voto principal")} • ${escapeHtml(record.prioridade || "Sem prioridade")}</strong>
                  <span>${escapeHtml(formatDateTime(record.createdAt))} • ${escapeHtml(record.localizacao || record.city || "Origem não informada")}</span>
                  <p>${escapeHtml(trimText(record.comentario || "", 240))}</p>
                  <small>${escapeHtml(record.profissao || "Profissão não informada")} • ${escapeHtml(record.fatorDecisivo || "Fator decisivo não informado")}</small>
                </article>
              `
            )
            .join("")
        : `<p class="poll-admin-empty">Nenhum comentário aberto dentro do recorte atual.</p>`;
    }
  }

  function renderDistributionSummary(records = []) {
    if (!distributionSummary) return;

    if (!records.length) {
      distributionSummary.innerHTML = `<p class="poll-admin-empty">Sem recorte suficiente para montar o resumo de distribuição.</p>`;
      return;
    }

    const voteTop = buildBreakdown(records, "voto2026", 3);
    const priorityTop = buildBreakdown(records, "prioridade", 3);
    const rejectionTop = buildBreakdown(records, "rejeicao", 3);
    const directionTop = buildBreakdown(records, "direcaoEstado", 3);
    const items = [
      {
        title: "Topo do voto 2026",
        text: voteTop.length
          ? voteTop.map((item) => `${item.label} (${formatPercent(item.percent)})`).join(" • ")
          : "Sem leitura suficiente."
      },
      {
        title: "Top prioridades",
        text: priorityTop.length
          ? priorityTop.map((item) => `${item.label} (${numberFormatter.format(item.total)})`).join(" • ")
          : "Sem leitura suficiente."
      },
      {
        title: "Top rejeições",
        text: rejectionTop.length
          ? rejectionTop.map((item) => `${item.label} (${formatPercent(item.percent)})`).join(" • ")
          : "Sem leitura suficiente."
      },
      {
        title: "Clima do Estado",
        text: directionTop.length
          ? directionTop.map((item) => `${item.label} (${formatPercent(item.percent)})`).join(" • ")
          : "Sem leitura suficiente."
      }
    ];

    distributionSummary.innerHTML = items
      .map(
        (item) => `
          <article class="poll-admin-summary-item">
            <strong>${escapeHtml(item.title)}</strong>
            <p>${escapeHtml(item.text)}</p>
          </article>
        `
      )
      .join("");
  }

  function renderTable(records = []) {
    if (!tableBody || !tableMeta) return;

    if (!records.length) {
      tableMeta.textContent = "Nenhum registro bate com o recorte atual.";
      tableBody.innerHTML = `<tr><td colspan="13">Nenhum registro encontrado com os filtros atuais.</td></tr>`;
      return;
    }

    const visibleRows = records.slice(0, 300);
    tableMeta.textContent = `Mostrando ${numberFormatter.format(visibleRows.length)} registro(s) mais recentes de ${numberFormatter.format(
      records.length
    )} no recorte atual. O CSV exporta todos os registros filtrados.`;

    tableBody.innerHTML = visibleRows
      .map(
        (record) => `
          <tr>
            <td>
              ${escapeHtml(formatDateTime(record.createdAt))}
              <small>${escapeHtml(record.weekKey || getWeekBucketKey(record.createdAt || ""))}</small>
            </td>
            <td>
              ${escapeHtml(record.googleEmail || "Sem e-mail visível")}
              <small>sub ${escapeHtml(shrinkValue(record.googleSub || "-", 24))}</small>
            </td>
            <td>
              ${escapeHtml(record.localizacao || record.city || "Nao informado")}
              <small>${escapeHtml(record.sourcePage || "-")} • ${escapeHtml(record.referrerHost || "direto")}</small>
            </td>
            <td>
              ${escapeHtml(record.profissao || "Nao informado")}
              <small>${escapeHtml(record.faixaEtaria || "Faixa etária não informada")}</small>
            </td>
            <td>
              ${escapeHtml(record.votoAnterior || "-")}
              <small>Satisfação ${escapeHtml(String(record.satisfacao || "-"))}/5</small>
            </td>
            <td>
              ${escapeHtml(record.avaliacaoGoverno || "-")}
              <small>${escapeHtml(record.direcaoEstado || "-")} • ${escapeHtml(record.desejoCiclo || "-")}</small>
            </td>
            <td>
              ${escapeHtml(record.voto2026 || "-")}
              <small>${escapeHtml(record.certezaVoto || "Firmeza não informada")}</small>
            </td>
            <td>${escapeHtml(record.segundaOpcao || "-")}</td>
            <td>${escapeHtml(record.rejeicao || "-")}</td>
            <td>
              ${escapeHtml(record.prioridade || "-")}
              <small>${escapeHtml(record.fatorDecisivo || "-")}</small>
            </td>
            <td>
              ${escapeHtml(record.atencaoPolitica || "-")}
              <small>${escapeHtml(trimText(record.pageTitle || "Página sem título", 60))}</small>
            </td>
            <td>
              ${escapeHtml(record.deviceType || "-")}
              <small>${escapeHtml(record.browser || "-")} • ${escapeHtml(record.country || "pais n/d")}</small>
            </td>
            <td>
              ${escapeHtml(trimText(record.comentario || "Sem comentário", 280))}
              <small>IP ${escapeHtml(shrinkValue(record.ip || "-", 18))} • visitante ${escapeHtml(shrinkValue(record.visitorId || "-", 18))}</small>
            </td>
          </tr>
        `
      )
      .join("");
  }

  function renderReport(records = [], totalRecords = 0) {
    const activeFilters = getActiveFilters();
    lastFilteredRecords = records.slice();

    if (reportMeta) {
      reportMeta.textContent = formatFilterMeta(activeFilters, records.length, totalRecords);
    }

    renderKpis(records, totalRecords);
    renderNarrative(records, totalRecords);
    renderTimeline(records);
    renderFlows(records);
    renderHealth(records, totalRecords);
    renderBreakdowns(records);
    renderCandidateInsights(records);
    renderCrossInsights(records);
    renderCommentSignals(records);
    renderDistributionSummary(records);
    renderTable(records);
  }

  function applyFiltersAndRender() {
    if (!lastPayload || !Array.isArray(lastPayload.records)) return;
    const baseRecords = lastPayload.records.slice();
    const filtered = filterRecords(baseRecords, getActiveFilters());
    renderReport(filtered, baseRecords.length);
  }

  function renderDashboard(payload = {}) {
    const records = Array.isArray(payload.records) ? payload.records.slice() : [];
    lastPayload = {
      ...payload,
      records
    };
    hydrateFilterOptions(records);
    dashboard.hidden = false;
    applyFiltersAndRender();
  }

  function serializeCsvRows(rows = []) {
    if (!Array.isArray(rows) || !rows.length) return "";

    const escapeCsv = (value) => {
      const text = String(value ?? "");
      if (/[",\n\r]/.test(text)) {
        return `"${text.replace(/"/g, '""')}"`;
      }
      return text;
    };

    return [CSV_FIELDS.join(",")]
      .concat(rows.map((row) => CSV_FIELDS.map((field) => escapeCsv(row?.[field])).join(",")))
      .join("\n");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const apiBase = normalizeBase(apiBaseInput?.value || getDefaultApiBase());
    const user = String(userInput?.value || "").trim() || "admin";
    const password = String(passwordInput?.value || "");

    if (!password) {
      setFeedback("Digite a senha administrativa.", "error");
      return;
    }

    setFeedback("Liberando painel analítico...");

    try {
      const response = await fetch(`${apiBase}/api/pesquisa-acre-2026/admin`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: encodeBasicAuth(user, password)
        },
        body: "{}"
      });
      const payload = await readJson(response);
      if (!response.ok) {
        throw new Error(payload.error || "Falha ao abrir a consulta administrativa.");
      }

      renderDashboard(payload);
      saveStoredAccess({ apiBase, user });
      setFeedback(
        `Painel liberado. Atualizado em ${formatDateTime(payload.updatedAt || payload.summary?.updatedAt)}.`,
        "success"
      );
    } catch (error) {
      dashboard.hidden = true;
      setFeedback(error.message || "Falha ao abrir a consulta administrativa.", "error");
    }
  }

  function handleExport() {
    const rows = lastFilteredRecords.length ? lastFilteredRecords : lastPayload?.records;
    if (!Array.isArray(rows) || !rows.length) {
      setFeedback("Nenhum dado carregado para exportar.", "error");
      return;
    }

    const csv = serializeCsvRows(rows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const link = document.createElement("a");
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    link.href = URL.createObjectURL(blob);
    link.download = `pesquisa-acre-2026-filtrado-${stamp}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(link.href), 500);
  }

  function clearFilters() {
    if (filters.search) filters.search.value = "";
    if (filters.vote2026) filters.vote2026.value = "";
    if (filters.age) filters.age.value = "";
    if (filters.priority) filters.priority.value = "";
    if (filters.previousVote) filters.previousVote.value = "";
    if (filters.cycle) filters.cycle.value = "";
    if (filters.certainty) filters.certainty.value = "";
    if (filters.government) filters.government.value = "";
    if (filters.location) filters.location.value = "";
    if (filters.profession) filters.profession.value = "";
    if (filters.recency) filters.recency.value = "all";
    applyFiltersAndRender();
  }

  const stored = getStoredAccess();
  if (apiBaseInput) {
    apiBaseInput.value = normalizeBase(stored.apiBase || getDefaultApiBase());
  }
  if (userInput) {
    userInput.value = String(stored.user || "admin").trim() || "admin";
  }
  if (filters.recency) {
    filters.recency.value = "all";
  }

  form?.addEventListener("submit", handleSubmit);
  exportButton?.addEventListener("click", handleExport);
  clearFiltersButton?.addEventListener("click", clearFilters);

  Object.values(filters).forEach((element) => {
    if (!element) return;
    const eventName = element.tagName === "INPUT" ? "input" : "change";
    element.addEventListener(eventName, applyFiltersAndRender);
  });
})();
