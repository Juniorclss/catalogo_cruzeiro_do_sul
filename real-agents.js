(function () {
  const state = {
    payload: null,
    query: ""
  };

  const statsEl = document.querySelector("#agentsStats");
  const officeListEl = document.querySelector("#officeList");
  const roleListEl = document.querySelector("#roleList");
  const queueListEl = document.querySelector("#queueList");
  const runMetaEl = document.querySelector("#runMeta");
  const statusEl = document.querySelector("#agentsStatus");
  const searchEl = document.querySelector("#agentSearch");
  const runnerEl = document.querySelector("#agentsRunner");

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function formatDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "sem data";
    return date.toLocaleString("pt-BR", {
      dateStyle: "short",
      timeStyle: "short"
    });
  }

  function formatInterval(ms) {
    const minutes = Math.max(1, Math.round(Number(ms || 0) / 60000));
    return `${minutes} min`;
  }

  function normalize(value) {
    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function setStatus(message, tone) {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.style.color = tone === "bad" ? "var(--agent-red)" : tone === "ok" ? "var(--agent-green)" : "";
  }

  function renderStats(payload) {
    const summary = payload.summary || {};
    const autoRun = payload.autoRun || {};
    const stats = [
      ["Agentes", summary.totalAgents],
      ["Escritórios", summary.totalOffices],
      ["Funções", summary.totalRoles],
      ["Notícias lidas", summary.newsItems],
      ["Achados", summary.reviewIssues],
      ["Fila ativa", summary.activeQueue],
      ["Autônomos", summary.autonomousAgents || 0],
      ["Média IA", `${summary.averageAutonomy || 0}%`],
      ["Auto", autoRun.enabled ? formatInterval(autoRun.intervalMs) : "off"]
    ];

    statsEl.innerHTML = stats
      .map(
        ([label, value]) => `
          <article class="agents-stat">
            <span>${escapeHtml(label)}</span>
            <strong>${escapeHtml(value ?? 0)}</strong>
          </article>
        `
      )
      .join("");
  }

  function renderMiniRows(container, items, labelKey, countKey) {
    container.innerHTML = (items || [])
      .map((item) => {
        const label = item[labelKey] || item.value || item.office || item.role || "Sem nome";
        const count = item[countKey] || item.agents || item.count || 0;
        return `
          <div class="agents-mini-row">
            <strong>${escapeHtml(label)}</strong>
            <span>${escapeHtml(count)}</span>
          </div>
        `;
      })
      .join("");
  }

  function queueMatches(item) {
    const query = normalize(state.query);
    if (!query) return true;
    return normalize(
      [
        item.name,
        item.officeLabel,
        item.role,
        item.assignment?.headline,
        item.assignment?.action,
        item.assignment?.idea,
        item.assignment?.monitor
      ].join(" ")
    ).includes(query);
  }

  function renderQueue(payload) {
    const queue = (payload.queue || []).filter(queueMatches);
    if (!queue.length) {
      queueListEl.innerHTML = '<p class="agents-empty">Nenhum agente encontrado nesse filtro.</p>';
      return;
    }

    queueListEl.innerHTML = queue
      .map((item) => {
        const assignment = item.assignment || {};
        const autonomy = item.autonomy || {};
        return `
          <article class="agent-work-item">
            <div class="agent-work-id">
              <h3>${escapeHtml(item.name)}</h3>
              <p>${escapeHtml(item.officeLabel)} • ${escapeHtml(item.role)}</p>
              <div class="agent-pill-row">
                <span class="agent-pill">${escapeHtml(assignment.deliverable || "entrega")}</span>
                <span class="agent-pill">${escapeHtml(autonomy.mode || "assistido")}</span>
              </div>
            </div>
            <div class="agent-work-body">
              <p><b>Manchete:</b> ${escapeHtml(assignment.headline)}</p>
              <p><strong>Ação:</strong> ${escapeHtml(assignment.action)}</p>
              <p><b>Ideia:</b> ${escapeHtml(assignment.idea)}</p>
              <p><b>Monitor:</b> ${escapeHtml(assignment.monitor)}</p>
              <div class="agent-autonomy-meter" aria-label="Autonomia operacional">
                <span style="width: ${Math.max(0, Math.min(100, Number(autonomy.autonomy || 0)))}%"></span>
              </div>
              <p><b>Intenção própria:</b> ${escapeHtml(autonomy.intent || "aguardando memoria")}</p>
              <p class="agent-autonomy-line">
                Autonomia ${escapeHtml(autonomy.autonomy || 0)}% • urgência ${escapeHtml(
                  autonomy.urgency || 0
                )}% • confiança ${escapeHtml(autonomy.confidence || 0)}% • próxima checagem ${escapeHtml(
                  formatDate(autonomy.nextCheckAt)
                )}
              </p>
            </div>
          </article>
        `;
      })
      .join("");
  }

  function render(payload) {
    state.payload = payload;
    renderStats(payload);
    renderMiniRows(officeListEl, payload.offices, "office", "agents");
    renderMiniRows(roleListEl, payload.roles, "role", "agents");
    const autoRun = payload.autoRun || {};
    const autoText = autoRun.enabled
      ? ` • Auto: ${formatInterval(autoRun.intervalMs)} • Ciclos: ${autoRun.cycles || 0}`
      : " • Auto: desligado";
    runMetaEl.textContent = `Rodada: ${formatDate(payload.runGeneratedAt)} • Registry: ${formatDate(
      payload.registryGeneratedAt
    )}${autoText}`;
    renderQueue(payload);
  }

  async function loadAgents(silent) {
    if (!silent) setStatus("Abrindo agentes...");
    const response = await fetch("/api/real-agents", { headers: { Accept: "application/json" } });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || "Nao foi possivel carregar os agentes.");
    }
    render(payload);
    setStatus("Agentes trabalhando e monitorando o jornal.", "ok");
  }

  async function runAgents(event) {
    event.preventDefault();
    const form = new FormData(runnerEl);
    const password = String(form.get("password") || "").trim();
    if (!password) {
      setStatus("Digite a senha Full Admin para rodar a equipe.", "bad");
      return;
    }

    setStatus("Rodando 181 agentes...");
    const response = await fetch("/api/real-agents/run", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        password,
        message: "Rodada solicitada pelo painel Agentes Reais."
      })
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || "Falha ao rodar agentes.");
    }
    render(payload);
    setStatus("Rodada renovada. Os agentes atualizaram a fila.", "ok");
  }

  searchEl?.addEventListener("input", () => {
    state.query = searchEl.value || "";
    if (state.payload) renderQueue(state.payload);
  });

  runnerEl?.addEventListener("submit", (event) => {
    runAgents(event).catch((error) => setStatus(error.message, "bad"));
  });

  loadAgents().catch((error) => setStatus(error.message, "bad"));
  window.setInterval(() => {
    loadAgents(true).catch((error) => setStatus(error.message, "bad"));
  }, 60 * 1000);
})();
