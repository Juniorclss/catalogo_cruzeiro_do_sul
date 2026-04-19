(function () {
  const STORAGE_KEY = "officeFullAdminPassword";
  const state = {
    password: sessionStorage.getItem(STORAGE_KEY) || "",
    open: false
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
    root.className = "office-command-chat";
    root.innerHTML = `
      <button class="office-command-toggle" type="button" data-order-toggle>
        <span></span>
        Ordens
      </button>
      <article class="office-command-panel" data-order-panel aria-label="Chat de ordens do Full Admin">
        <header>
          <div>
            <span>canal hierarquico</span>
            <strong>Full Admin -> CEO -> equipes</strong>
          </div>
          <button type="button" data-order-close>Fechar</button>
        </header>
        <form class="office-command-login" data-order-login>
          <label>
            Senha Full Admin
            <input type="password" name="password" placeholder="99831455A" autocomplete="current-password" />
          </label>
          <button type="submit">Liberar comando</button>
        </form>
        <form class="office-command-form" data-order-form>
          <label>
            Alvo
            <select name="target">
              <option>Codex CEO</option>
              <option>Equipe Arte/Game Design</option>
              <option>Equipe Ninjas</option>
              <option>Equipe Nerd</option>
              <option>Equipe Editorial</option>
              <option>Equipe PubPaid</option>
              <option>Equipe Design</option>
            </select>
          </label>
          <label>
            Prioridade
            <select name="priority">
              <option value="alta">Alta</option>
              <option value="normal">Normal</option>
              <option value="critica">Critica</option>
              <option value="baixa">Baixa</option>
            </select>
          </label>
          <label class="wide">
            Ordem direta
            <textarea name="message" rows="4" placeholder="Escreva a ordem. O CEO responde e repassa para a hierarquia."></textarea>
          </label>
          <button type="submit">Enviar para o CEO</button>
        </form>
        <div class="office-command-status" data-order-status>Somente administradores podem dar ordens.</div>
        <div class="office-command-log" data-order-log></div>
      </article>
    `;
    document.body.appendChild(root);
    return root;
  }

  const root = createShell();
  const panel = root.querySelector("[data-order-panel]");
  const toggle = root.querySelector("[data-order-toggle]");
  const close = root.querySelector("[data-order-close]");
  const loginForm = root.querySelector("[data-order-login]");
  const orderForm = root.querySelector("[data-order-form]");
  const status = root.querySelector("[data-order-status]");
  const log = root.querySelector("[data-order-log]");

  function setOpen(nextOpen) {
    state.open = nextOpen;
    root.classList.toggle("is-open", nextOpen);
  }

  function setStatus(message, isError = false) {
    status.textContent = message;
    status.classList.toggle("is-error", isError);
  }

  function renderOrders(orders) {
    if (!Array.isArray(orders) || !orders.length) {
      log.innerHTML = `<p class="office-command-empty">Nenhuma ordem registrada ainda nesta mesa.</p>`;
      return;
    }

    log.innerHTML = orders
      .slice(0, 18)
      .map(
        (order) => `
          <article>
            <span>${escapeHtml(order.priority || "normal")} / ${escapeHtml(order.to || "CEO")}</span>
            <strong>${escapeHtml(order.message || "")}</strong>
            <p>${escapeHtml(order.ceoReply || "CEO recebeu.")}</p>
            <small>${escapeHtml(order.createdAt || "")}</small>
          </article>
        `
      )
      .join("");
  }

  async function loadOrders() {
    if (!state.password) return;
    const response = await fetch(`/api/office-orders?password=${encodeURIComponent(state.password)}`);
    const payload = await response.json().catch(() => ({}));
    if (!response.ok || !payload.ok) {
      setStatus(payload.error || "Senha recusada para ordens.", true);
      return;
    }

    sessionStorage.setItem(STORAGE_KEY, state.password);
    setStatus("Full Admin liberado. O CEO vai responder primeiro e repassar para as equipes.");
    renderOrders(payload.orders);
  }

  toggle?.addEventListener("click", () => {
    setOpen(!state.open);
    if (state.open && state.password) {
      loadOrders().catch(() => setStatus("Nao consegui carregar as ordens.", true));
    }
  });

  close?.addEventListener("click", () => setOpen(false));

  loginForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(loginForm);
    state.password = String(data.get("password") || "").trim();
    loadOrders().catch(() => setStatus("Falha ao validar senha.", true));
  });

  orderForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!state.password) {
      setStatus("Entre com a senha Full Admin antes de ordenar.", true);
      return;
    }

    const data = new FormData(orderForm);
    const message = String(data.get("message") || "").trim();
    if (!message) {
      setStatus("Escreva a ordem antes de enviar.", true);
      return;
    }

    setStatus("Enviando ordem para o CEO...");
    const response = await fetch("/api/office-orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        password: state.password,
        target: data.get("target"),
        priority: data.get("priority"),
        message
      })
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok || !payload.ok) {
      setStatus(payload.error || "Nao consegui registrar a ordem.", true);
      return;
    }

    orderForm.reset();
    setStatus(payload.ceoReply || "CEO recebeu a ordem.");
    renderOrders(payload.orders);
  });

  if (state.password) {
    loadOrders().catch(() => {});
  }
})();
