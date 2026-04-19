(function () {
  const state = {
    password: sessionStorage.getItem("spriteCheckPassword") || "",
    items: [],
    itemMap: new Map(),
    category: "checkpubpaid",
    status: "todos",
    query: "",
    viewerId: ""
  };

  const loginForm = document.querySelector("[data-sprite-login]");
  const loginStatus = document.querySelector("[data-sprite-login-status]");
  const passwordInput = document.querySelector("#sprite-password");
  const grid = document.querySelector("[data-sprite-grid]");
  const summary = document.querySelector("[data-sprite-summary]");
  const menu = document.querySelector("[data-sprite-menu]");
  const searchInput = document.querySelector("[data-sprite-search]");
  const statusFilter = document.querySelector("[data-sprite-status-filter]");
  const builderPanel = document.querySelector("[data-pubpaid-builder]");
  const builderStats = document.querySelector("[data-builder-stats]");
  const builderTargets = document.querySelector("[data-builder-targets]");
  const viewer = document.querySelector("[data-sprite-viewer]");
  const viewerImage = document.querySelector("[data-viewer-image]");
  const viewerKicker = document.querySelector("[data-viewer-kicker]");
  const viewerName = document.querySelector("[data-viewer-name]");
  const viewerPath = document.querySelector("[data-viewer-path]");
  const viewerTags = document.querySelector("[data-viewer-tags]");
  const viewerMode = document.querySelector("[data-viewer-mode]");
  const viewerUsage = document.querySelector("[data-viewer-usage]");
  const viewerObservation = document.querySelector("[data-viewer-observation]");
  const viewerCollision = document.querySelector("[data-viewer-collision]");
  const viewerActions = document.querySelector("[data-viewer-actions]");

  function setStatus(message, isError = false) {
    if (!loginStatus) return;
    loginStatus.textContent = message;
    loginStatus.style.color = isError ? "#ff8da0" : "#7cffb2";
  }

  function formatBytes(value) {
    const bytes = Number(value || 0);
    if (!bytes) return "0 B";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  }

  function statusLabel(status, item) {
    if (item?.locked) return "ja aceito no site";
    return {
      accepted: "aceito",
      rejected: "reprovado",
      pending: "pendente",
      "needs-change": "ajuste"
    }[status] || status || "pendente";
  }

  function reviewModeLabel(item) {
    if (item.reviewMode === "construction") return "mapa / construcao";
    if (item.frameCount > 1) return `${item.frameCount} frames animados`;
    return "asset estatico";
  }

  function isPubPaidItem(item) {
    const contexts = Array.isArray(item?.contexts) ? item.contexts.join(" ") : "";
    const haystack = `${item?.name || ""} ${item?.path || ""} ${item?.category || ""} ${contexts}`.toLowerCase();
    return /(pubpaid|pub paid|bar|bartender|garcom|garçon|dealer|mesa|table|roulette|roleta|dice|dado|cup|copo|jukebox|pool|sinuca|poker|blackjack|slot|arcade|chair|stool|balcao|balcão|chip|ficha|casino|neon|stage|dance|cocktail|drink|glass|hud|ui)/.test(
      haystack
    );
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function updateSummary(payload) {
    if (!summary) return;
    const data = payload?.summary || {};
    const status = data.byStatus || {};
    const values = [
      data.total || state.items.length,
      data.animated || 0,
      data.construction || 0,
      data.alreadyAccepted || status.accepted || 0,
      status["needs-change"] || 0
    ];
    summary.querySelectorAll("strong").forEach((node, index) => {
      node.textContent = String(values[index] ?? "--");
    });
  }

  function updateBuilderPanel() {
    if (!builderPanel || !builderStats || !builderTargets) return;
    const pubpaidItems = state.items.filter(isPubPaidItem);
    const counts = [
      pubpaidItems.length,
      pubpaidItems.filter((item) => item.category === "personagens").length,
      pubpaidItems.filter(
        (item) =>
          item.category === "cenarios" ||
          item.reviewMode === "construction" ||
          /mapa|cenario|mesa|floor|room|tile/i.test(`${item.name} ${item.path}`)
      ).length,
      pubpaidItems.filter(
        (item) =>
          ["efeitos", "interface"].includes(item.category) ||
          /hud|fx|effect|light|spark|glow|ui/i.test(`${item.name} ${item.path}`)
      ).length
    ];

    builderStats.querySelectorAll("strong").forEach((node, index) => {
      node.textContent = String(counts[index] ?? "--");
    });

    const highlights = pubpaidItems
      .slice()
      .sort((left, right) => {
        const score = (item) =>
          (Array.isArray(item.contexts) && item.contexts.some((context) => /pubpaid/i.test(context)) ? 6 : 0) +
          (Number(item.frameCount || 0) > 1 ? 3 : 0) +
          (item.reviewMode === "construction" ? 2 : 0) +
          (item.locked ? 1 : 0);
        return score(right) - score(left);
      })
      .slice(0, 10);

    builderTargets.innerHTML = highlights.length
      ? highlights
          .map(
            (item) =>
              `<span>${escapeHtml(item.name)} · ${escapeHtml(
                item.reviewMode === "construction" ? "mapa" : item.frameCount > 1 ? "animado" : item.category
              )}</span>`
          )
          .join("")
      : "<span>Nenhum candidato PubPaid encontrado no cofre ainda.</span>";

    builderPanel.classList.toggle("is-active", state.category === "pubpaidbuilder");
  }

  function filterItems() {
    const query = state.query.trim().toLowerCase();
    return state.items.filter((item) => {
      const categoryMatch =
        state.category === "todos" ||
        state.category === "checkpubpaid" ||
        (state.category === "pubpaidbuilder" && isPubPaidItem(item)) ||
        item.category === state.category ||
        (state.category === "animados" && Number(item.frameCount || 0) > 1);
      const statusMatch = state.status === "todos" || item.status === state.status;
      const contextText = Array.isArray(item.contexts) ? item.contexts.join(" ") : "";
      const constructionText = item.construction
        ? `${item.construction.mode} ${item.construction.usage} ${item.construction.observation}`
        : "";
      const haystack = `${item.name} ${item.path} ${item.category} ${item.sourceRoot} ${contextText} ${constructionText}`.toLowerCase();
      const queryMatch = !query || haystack.includes(query);
      return categoryMatch && statusMatch && queryMatch;
    });
  }

  function renderActionButtons(item, compact = false) {
    if (item.locked) {
      return `<p class="sprite-locked-note">Ja esta no site/subsite. Nao volta para aprovacao.</p>`;
    }
    return `
      <button type="button" data-review="accepted">Aceitar</button>
      <button type="button" data-review="rejected">Reprovar</button>
      <button type="button" data-review="needs-change">Pedir ajuste</button>
      ${compact ? "" : `<button type="button" data-review="pending">Pendente</button>`}
    `;
  }

  function renderGrid() {
    if (!grid) return;
    const items = filterItems();
    updateBuilderPanel();
    if (!items.length) {
      grid.innerHTML = `
        <article class="sprite-empty-state">
          <strong>Nenhum candidato encontrado nesse filtro.</strong>
          <p>${
            state.category === "pubpaidbuilder"
              ? "Nenhum pacote PubPaid apareceu nesse recorte. Tente buscar por bar, garcom, mesa, roleta, copos ou dados."
              : "Troque busca, categoria ou status. Assets que ja estao no site nao entram nessa fila."
          }</p>
        </article>
      `;
      return;
    }

    grid.innerHTML = items
      .slice(0, 500)
      .map((item) => {
        const statusClass = `sprite-status-${escapeHtml(item.status || "pending")}`;
        const contexts = Array.isArray(item.contexts) ? item.contexts : [];
        return `
          <article class="sprite-card ${item.locked ? "is-locked" : ""}" data-sprite-id="${escapeHtml(item.id)}">
            <button class="sprite-card-preview sprite-card-preview-button" type="button" data-open-viewer>
              <img
                loading="lazy"
                data-animated-id="${escapeHtml(item.id)}"
                data-frame-index="0"
                src="${escapeHtml(item.previewUrl || item.publicUrl)}"
                alt="${escapeHtml(item.name)}"
              />
              <span>${escapeHtml(reviewModeLabel(item))}</span>
            </button>
            <div class="sprite-card-body">
              <strong>${escapeHtml(item.name)}</strong>
              <p>${escapeHtml(item.path)}</p>
              <div class="sprite-card-meta">
                <span>${escapeHtml(item.category)}</span>
                <span>${escapeHtml(item.sourceRoot)}</span>
                <span>${escapeHtml(formatBytes(item.sizeBytes))}</span>
                <span class="${statusClass}">${escapeHtml(statusLabel(item.status, item))}</span>
              </div>
              <div class="sprite-context-tags">
                ${contexts.map((context) => `<span>${escapeHtml(context)}</span>`).join("")}
              </div>
              <div class="sprite-construction-mini">
                <b>${escapeHtml(item.construction?.mode || "triagem")}</b>
                <p>${escapeHtml(item.construction?.usage || "Avaliar contexto antes de usar.")}</p>
              </div>
              ${item.note ? `<p><b>Nota:</b> ${escapeHtml(item.note)}</p>` : ""}
              <div class="sprite-card-actions">
                <button type="button" data-open-viewer>Tela cheia</button>
                ${renderActionButtons(item)}
              </div>
            </div>
          </article>
        `;
      })
      .join("");

    if (items.length > 500) {
      grid.insertAdjacentHTML(
        "beforeend",
        `<article class="sprite-empty-state"><strong>Mostrando 500 de ${items.length} grupos.</strong><p>Use busca para afinar por PubPaid, mapa, personagem, roleta, copos ou dados.</p></article>`
      );
    }
  }

  async function loadSprites() {
    if (!state.password) {
      setStatus("Digite a senha para carregar o cofre.", true);
      return;
    }

    setStatus("Buscando candidatos agrupados com contexto...");
    const response = await fetch(`/api/sprites-check?password=${encodeURIComponent(state.password)}`);
    const payload = await response.json().catch(() => ({}));
    if (!response.ok || !payload.ok) {
      setStatus(payload.error || "Senha recusada.", true);
      return;
    }

    sessionStorage.setItem("spriteCheckPassword", state.password);
    state.items = Array.isArray(payload.items) ? payload.items : [];
    state.itemMap = new Map(state.items.map((item) => [item.id, item]));
    updateSummary(payload);
    updateBuilderPanel();
    renderGrid();
    setStatus(`Cofre pronto: ${state.items.length} grupos uteis. Frames soltos foram agrupados.`);
  }

  async function reviewSprite(id, status) {
    const item = state.itemMap.get(id);
    if (!item || item.locked) {
      setStatus("Esse item ja esta aceito no site e nao precisa de revisao.", true);
      return;
    }
    const defaultNote = status === "needs-change" ? "Descrever ajuste necessario" : "";
    const note = window.prompt("Nota para Ninjas, Arte e Nerds (opcional):", item?.note || defaultNote) || "";
    const response = await fetch("/api/sprites-check/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: state.password, id, status, note })
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok || !payload.ok) {
      setStatus(payload.error || "Nao consegui registrar a revisao.", true);
      return;
    }

    state.items = state.items.map((entry) =>
      entry.id === id
        ? { ...entry, status: payload.item.status, note: payload.item.note, reviewedAt: payload.item.reviewedAt }
        : entry
    );
    state.itemMap = new Map(state.items.map((entry) => [entry.id, entry]));
    updateSummary({ summary: payload.summary });
    renderGrid();
    setStatus("Revisao salva. Agora a fila sabe o que usar, ajustar ou descartar.");
    if (!viewer?.hidden && state.viewerId === id) openViewer(id, false);
  }

  function renderViewerActions(item) {
    if (!viewerActions) return;
    viewerActions.innerHTML = renderActionButtons(item, true);
  }

  function openViewer(id, requestFullScreen = true) {
    const item = state.itemMap.get(id);
    if (!viewer || !item) return;
    state.viewerId = id;
    const contexts = Array.isArray(item.contexts) ? item.contexts : [];
    const frames = Array.isArray(item.frames) ? item.frames : [];
    viewer.hidden = false;
    if (viewerImage) {
      viewerImage.src = item.previewUrl || item.publicUrl || "";
      viewerImage.alt = item.name || "Sprite";
      viewerImage.dataset.animatedId = item.id;
      viewerImage.dataset.frameIndex = "0";
    }
    if (viewerKicker) viewerKicker.textContent = reviewModeLabel(item);
    if (viewerName) viewerName.textContent = item.name || "Sprite";
    if (viewerPath) viewerPath.textContent = `${item.path || ""} • ${frames.length} frame(s)`;
    if (viewerTags) {
      viewerTags.innerHTML = [
        ...(contexts || []),
        item.category,
        statusLabel(item.status, item)
      ]
        .filter(Boolean)
        .map((tag) => `<span>${escapeHtml(tag)}</span>`)
        .join("");
    }
    if (viewerMode) viewerMode.textContent = item.construction?.mode || "triagem";
    if (viewerUsage) viewerUsage.textContent = item.construction?.usage || "";
    if (viewerObservation) viewerObservation.textContent = item.construction?.observation || "";
    if (viewerCollision) viewerCollision.textContent = item.construction?.collision || "";
    renderViewerActions(item);

    if (requestFullScreen && viewer.requestFullscreen) {
      viewer.requestFullscreen().catch(() => {});
    }
  }

  function closeViewer() {
    if (!viewer) return;
    viewer.hidden = true;
    state.viewerId = "";
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
  }

  let lastFrameAt = 0;
  function animateSprites(now) {
    if (now - lastFrameAt > 220) {
      lastFrameAt = now;
      document.querySelectorAll("img[data-animated-id]").forEach((image) => {
        const item = state.itemMap.get(image.dataset.animatedId);
        const frames = Array.isArray(item?.frames) ? item.frames : [];
        if (frames.length < 2) return;
        const current = Number(image.dataset.frameIndex || 0);
        const next = (current + 1) % frames.length;
        image.dataset.frameIndex = String(next);
        image.src = frames[next].publicUrl;
      });
    }
    window.requestAnimationFrame(animateSprites);
  }

  loginForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    state.password = passwordInput?.value?.trim() || state.password;
    loadSprites().catch(() => setStatus("Falha ao carregar o painel.", true));
  });

  menu?.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-category]");
    if (!button) return;
    state.category = button.dataset.category || "checkpubpaid";
    menu.querySelectorAll("button").forEach((node) => node.classList.toggle("active", node === button));
    renderGrid();
  });

  searchInput?.addEventListener("input", () => {
    state.query = searchInput.value || "";
    renderGrid();
  });

  statusFilter?.addEventListener("change", () => {
    state.status = statusFilter.value || "todos";
    renderGrid();
  });

  grid?.addEventListener("click", (event) => {
    const card = event.target.closest("[data-sprite-id]");
    if (!card) return;
    const id = card.dataset.spriteId;
    const reviewButton = event.target.closest("button[data-review]");
    if (reviewButton) {
      reviewSprite(id, reviewButton.dataset.review).catch(() =>
        setStatus("Falha ao salvar revisao.", true)
      );
      return;
    }
    if (event.target.closest("[data-open-viewer]")) {
      openViewer(id);
    }
  });

  viewer?.addEventListener("click", (event) => {
    if (event.target.closest("[data-close-viewer]")) {
      closeViewer();
      return;
    }
    const reviewButton = event.target.closest("button[data-review]");
    if (reviewButton && state.viewerId) {
      reviewSprite(state.viewerId, reviewButton.dataset.review).catch(() =>
        setStatus("Falha ao salvar revisao.", true)
      );
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && viewer && !viewer.hidden) closeViewer();
  });

  if (state.password && passwordInput) {
    passwordInput.value = state.password;
    loadSprites().catch(() => setStatus("Falha ao restaurar sessao.", true));
  }

  updateBuilderPanel();
  window.requestAnimationFrame(animateSprites);
})();
