(function () {
  const STORAGE_KEY = "officeFullAdminPassword";
  const state = {
    password: sessionStorage.getItem(STORAGE_KEY) || "",
    open: false,
    neural: null,
    scout: null
  };

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function createShell() {
    const root = document.createElement("section");
    root.className = "office-neural-system";
    root.innerHTML = `
      <button class="office-neural-toggle" type="button" data-neural-toggle>
        <span></span>
        Crescimento Neural
      </button>
      <article class="office-neural-panel" data-neural-panel aria-label="Subsistema de crescimento neural dos escritórios">
        <header>
          <div>
            <span>estudo das IAs</span>
            <strong>Crescimento Neural dos Escritórios</strong>
          </div>
          <button type="button" data-neural-close>Fechar</button>
        </header>

        <form class="office-neural-login" data-neural-login>
          <label>
            Senha Full Admin
            <input type="password" name="password" placeholder="Digite a senha" autocomplete="current-password" />
          </label>
          <button type="submit">Liberar ações</button>
        </form>

        <section class="office-neural-summary" data-neural-summary>
          <article><span>ciclos</span><strong>--</strong></article>
          <article><span>pontos</span><strong>--</strong></article>
          <article><span>módulos</span><strong>--</strong></article>
        </section>

        <div class="office-neural-actions">
          <button type="button" data-neural-pulse="todos">Rodar estudo geral</button>
          <button type="button" data-neural-pulse="sprites">Estudar sprites</button>
          <button type="button" data-neural-pulse="game-engine">Estudar game engine</button>
          <button type="button" data-scout-pubpaid>Ordenar busca de sprites PubPaid</button>
        </div>

        <section class="office-neural-modules" data-neural-modules></section>

        <section class="office-scout-panel">
          <div>
            <span>missão internet</span>
            <strong>Sprites completos para PubPaid</strong>
            <p>Busca orientada: só entra com fonte, licença, contexto e aprovação no CHECKPUBPAID.</p>
          </div>
          <div class="office-scout-sources" data-scout-sources></div>
        </section>

        <div class="office-neural-status" data-neural-status>Subsistema pronto para sincronizar.</div>
      </article>
    `;
    document.body.appendChild(root);
    return root;
  }

  const root = createShell();
  const toggle = root.querySelector("[data-neural-toggle]");
  const close = root.querySelector("[data-neural-close]");
  const loginForm = root.querySelector("[data-neural-login]");
  const summary = root.querySelector("[data-neural-summary]");
  const modulesHost = root.querySelector("[data-neural-modules]");
  const sourcesHost = root.querySelector("[data-scout-sources]");
  const status = root.querySelector("[data-neural-status]");

  function setOpen(open) {
    state.open = open;
    root.classList.toggle("is-open", open);
  }

  function setStatus(message, isError = false) {
    status.textContent = message;
    status.classList.toggle("is-error", isError);
  }

  function renderNeural(payload) {
    state.neural = payload;
    const modules = Array.isArray(payload.modules) ? payload.modules : [];
    const values = [payload.cycles || 0, payload.score || 0, modules.length];
    summary?.querySelectorAll("strong").forEach((node, index) => {
      node.textContent = String(values[index] ?? "--");
    });
    if (modulesHost) {
      modulesHost.innerHTML = modules
        .map(
          (item) => `
            <article>
              <span>${escapeHtml(item.team || "Equipe")}</span>
              <strong>${escapeHtml(item.name || "Módulo")}</strong>
              <p>${escapeHtml(item.focus || "")}</p>
              <small>nivel neural ${escapeHtml(item.level || 1)}</small>
            </article>
          `
        )
        .join("");
    }
  }

  function renderScout(payload) {
    state.scout = payload;
    const sources = Array.isArray(payload.sources) ? payload.sources : [];
    if (sourcesHost) {
      sourcesHost.innerHTML = sources
        .map(
          (source) => `
            <a href="${escapeHtml(source.url)}" target="_blank" rel="noopener">
              <strong>${escapeHtml(source.name)}</strong>
              <span>${escapeHtml(source.licenseFocus)}</span>
              <small>${escapeHtml(source.use)}</small>
            </a>
          `
        )
        .join("");
    }
  }

  async function loadSubsystem() {
    const [neuralResponse, scoutResponse] = await Promise.all([
      fetch("/api/office-neural-growth"),
      fetch("/api/pubpaid-sprite-scout")
    ]);
    const neuralPayload = await neuralResponse.json().catch(() => ({}));
    const scoutPayload = await scoutResponse.json().catch(() => ({}));
    if (neuralPayload.ok !== false) renderNeural(neuralPayload);
    if (scoutPayload.ok !== false) renderScout(scoutPayload);
    setStatus("Subsistema pronto. Ações administrativas exigem senha Full Admin.");
  }

  async function sendNeuralPulse(focus) {
    if (!state.password) {
      setStatus("Digite a senha Full Admin para rodar crescimento neural.", true);
      return;
    }
    setStatus("Rodando estudo neural e atualizando módulos...");
    const response = await fetch("/api/office-neural-growth/pulse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        password: state.password,
        focus,
        note: "Ciclo acionado pelo botão Crescimento Neural dentro do escritório."
      })
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok || payload.ok === false) {
      setStatus(payload.error || "Não consegui rodar o crescimento neural.", true);
      return;
    }
    renderNeural(payload);
    setStatus("Crescimento neural registrado. Os módulos subiram conforme o foco escolhido.");
  }

  async function sendPubPaidScoutOrder() {
    if (!state.password) {
      setStatus("Digite a senha Full Admin para ordenar busca de sprites.", true);
      return;
    }
    setStatus("Enviando ordem de busca para Ninjas, Arte e Nerd...");
    const response = await fetch("/api/pubpaid-sprite-scout/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        password: state.password,
        focus: "garçom, clientes, roleta, copos, dados, bar, cassino, mesas, UI, FX e mapas do PubPaid"
      })
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok || !payload.ok) {
      setStatus(payload.error || "Não consegui enviar a ordem de busca.", true);
      return;
    }
    renderScout(payload);
    setStatus("Ordem enviada. CEO acionou Ninjas, Arte/Game Design e Nerd para buscar sprites PubPaid com licença.");
  }

  toggle?.addEventListener("click", () => {
    setOpen(!state.open);
    if (state.open) loadSubsystem().catch(() => setStatus("Falha ao carregar subsistema.", true));
  });

  close?.addEventListener("click", () => setOpen(false));

  loginForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(loginForm);
    state.password = String(data.get("password") || "").trim();
    if (state.password) {
      sessionStorage.setItem(STORAGE_KEY, state.password);
      setStatus("Ações administrativas liberadas nesta sessão.");
    }
  });

  root.addEventListener("click", (event) => {
    const pulseButton = event.target.closest("[data-neural-pulse]");
    if (pulseButton) {
      sendNeuralPulse(pulseButton.dataset.neuralPulse || "todos").catch(() =>
        setStatus("Falha ao rodar estudo neural.", true)
      );
      return;
    }
    if (event.target.closest("[data-scout-pubpaid]")) {
      sendPubPaidScoutOrder().catch(() => setStatus("Falha ao enviar ordem de busca.", true));
    }
  });

  loadSubsystem().catch(() => {});
})();
