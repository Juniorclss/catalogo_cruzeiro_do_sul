"use strict";

(() => {
  const form = document.getElementById("acrePollForm");
  const submitButton = document.getElementById("submitButton");
  const formFeedback = document.getElementById("formFeedback");
  const formCard = document.querySelector(".poll-form-card");
  const authCard = document.querySelector("[data-google-auth-card]");
  const methodCard = document.querySelector(".poll-method-card");
  const adminEntry = document.querySelector(".poll-admin-entry");
  const thanksPanel = document.getElementById("pollThanksPanel");
  const thanksMessage = document.getElementById("pollThanksMessage");
  const summaryCard = document.querySelector(".poll-summary");
  const summaryTotal = document.getElementById("summaryTotal");
  const summaryAverage = document.getElementById("summaryAverage");
  const summaryUpdatedAt = document.getElementById("summaryUpdatedAt");
  const bridgeUpdatedAt = document.getElementById("bridgeUpdatedAt");
  const voteBars = document.getElementById("voteBars");
  const priorityBars = document.getElementById("priorityBars");
  const stateDirectionBars = document.getElementById("stateDirectionBars");
  const desiredCycleBars = document.getElementById("desiredCycleBars");
  const rejectionBars = document.getElementById("rejectionBars");
  const voteCertaintyBars = document.getElementById("voteCertaintyBars");
  const locationCloud = document.getElementById("locationCloud");
  const candidateProfiles = document.getElementById("candidateProfiles");
  const pollBridgeSignals = document.getElementById("pollBridgeSignals");
  const pollBridgeNews = document.getElementById("pollBridgeNews");
  const pollCompletionKey = "acre_poll_completed_v2";
  const numberFormatter = new Intl.NumberFormat("pt-BR");
  const decimalFormatter = new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  });
  const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short"
  });

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function setFeedback(element, message, state = "") {
    if (!element) return;
    element.textContent = message || "";
    if (state) {
      element.dataset.state = state;
    } else {
      delete element.dataset.state;
    }
  }

  function formatDateTime(value) {
    if (!value) return "Sem atualização";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return String(value);
    return dateFormatter.format(parsed);
  }

  async function readJson(response) {
    try {
      return await response.json();
    } catch (_error) {
      return {};
    }
  }

  function collectClientMeta() {
    const resolvedTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    return {
      sourcePage: location.pathname,
      pageTitle: document.title,
      referrer: document.referrer || "",
      language: navigator.language || "",
      timezone: resolvedTimeZone,
      screen: window.screen ? `${window.screen.width}x${window.screen.height}` : "",
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      platform: navigator.platform || ""
    };
  }

  function getGoogleUser() {
    try {
      return window.CatalogoGoogleAuth?.getUser?.() || null;
    } catch (_error) {
      return null;
    }
  }

  function setPollCompletedState(isCompleted, message = "") {
    if (!formCard) return;

    formCard.classList.toggle("is-completed", Boolean(isCompleted));

    [authCard, form, methodCard, adminEntry].forEach((node) => {
      if (node) {
        node.hidden = Boolean(isCompleted);
      }
    });

    if (thanksPanel) {
      thanksPanel.hidden = !isCompleted;
    }

    if (thanksMessage && isCompleted) {
      thanksMessage.textContent =
        message ||
        "Seu voto foi registrado com sucesso. As parciais públicas continuam logo abaixo, mas a área de votação fica encerrada após o envio.";
    }

    try {
      if (isCompleted) {
        window.localStorage.setItem(
          pollCompletionKey,
          JSON.stringify({
            completedAt: new Date().toISOString(),
            message:
              message ||
              "Seu voto foi registrado com sucesso. As parciais públicas continuam logo abaixo, mas a área de votação fica encerrada após o envio."
          })
        );
      } else {
        window.localStorage.removeItem(pollCompletionKey);
      }
    } catch (_error) {
      // Ignora falhas de persistencia local.
    }
  }

  function showPartials() {
    summaryCard?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function restorePollCompletedState() {
    try {
      const raw = window.localStorage.getItem(pollCompletionKey);
      if (!raw) return;
      const savedState = JSON.parse(raw);
      if (!savedState || typeof savedState !== "object") return;
      setPollCompletedState(true, savedState.message);
    } catch (_error) {
      // Ignora estado local invalido.
    }
  }

  function renderBarList(container, items, tone, emptyMessage) {
    if (!container) return;

    if (!Array.isArray(items) || !items.length) {
      container.innerHTML = `<p class="poll-empty">${escapeHtml(emptyMessage)}</p>`;
      return;
    }

    container.innerHTML = items
      .map(
        (item) => `
          <div class="poll-bar-row" data-tone="${escapeHtml(tone)}">
            <div class="poll-bar-meta">
              <strong>${escapeHtml(item.label)}</strong>
              <span>${numberFormatter.format(item.total || 0)} • ${decimalFormatter.format(item.percent || 0)}%</span>
            </div>
            <div class="poll-bar-track">
              <span style="width:${Math.max(0, Math.min(100, Number(item.percent || 0)))}%"></span>
            </div>
          </div>
        `
      )
      .join("");
  }

  function renderLocationCloud(items) {
    if (!locationCloud) return;

    if (!Array.isArray(items) || !items.length) {
      locationCloud.innerHTML = `<span class="poll-empty-chip">Aguardando distribuição</span>`;
      return;
    }

    locationCloud.innerHTML = items
      .map(
        (item) =>
          `<span>${escapeHtml(item.label)} • ${numberFormatter.format(item.total || 0)}</span>`
      )
      .join("");
  }

  function renderCandidateProfiles(items) {
    if (!candidateProfiles) return;

    if (!Array.isArray(items) || !items.length) {
      candidateProfiles.innerHTML = `<p class="poll-empty">Os perfis aparecem quando houver massa de respostas.</p>`;
      return;
    }

    candidateProfiles.innerHTML = items
      .map(
        (item) => `
          <article class="poll-insight-card">
            <strong>${escapeHtml(item.label)}</strong>
            <span>${numberFormatter.format(item.total || 0)} respostas • ${decimalFormatter.format(item.percent || 0)}%</span>
            <p>Prioridade mais comum: <b>${escapeHtml(item.topPriority || "Sem leitura")}</b></p>
            <p>Desejo dominante: <b>${escapeHtml(item.desiredCycle || "Sem leitura")}</b></p>
            <p>Firmeza do voto: <b>${escapeHtml(item.voteCertainty || "Sem leitura")}</b></p>
            <p>Satisfação média do grupo: <b>${decimalFormatter.format(item.avgSatisfaction || 0)}</b></p>
          </article>
        `
      )
      .join("");
  }

  function renderBridgeSignals(poll = {}) {
    if (!pollBridgeSignals) return;

    const cards = [];
    if (poll.leadVote?.label) {
      cards.push({
        label: "Voto mais citado",
        title: poll.leadVote.label,
        meta: `${numberFormatter.format(poll.leadVote.total || 0)} respostas • ${decimalFormatter.format(poll.leadVote.percent || 0)}%`,
        tone: "vote"
      });
    }
    if (poll.topPriority?.label) {
      cards.push({
        label: "Prioridade dominante",
        title: poll.topPriority.label,
        meta: `${numberFormatter.format(poll.topPriority.total || 0)} menções`,
        tone: "priority"
      });
    }
    if (poll.topDirection?.label) {
      cards.push({
        label: "Rumo percebido",
        title: poll.topDirection.label,
        meta: `${numberFormatter.format(poll.topDirection.total || 0)} respostas`,
        tone: "direction"
      });
    }
    if (poll.desiredCycle?.label) {
      cards.push({
        label: "Desejo de ciclo",
        title: poll.desiredCycle.label,
        meta: `${numberFormatter.format(poll.desiredCycle.total || 0)} respostas`,
        tone: "cycle"
      });
    }

    if (!cards.length) {
      pollBridgeSignals.innerHTML = `<p class="poll-empty">A leitura cruzada aparece assim que os dados forem carregados.</p>`;
      return;
    }

    pollBridgeSignals.innerHTML = cards
      .map(
        (card) => `
          <article class="poll-bridge-signal" data-tone="${escapeHtml(card.tone)}">
            <span>${escapeHtml(card.label)}</span>
            <strong>${escapeHtml(card.title)}</strong>
            <small>${escapeHtml(card.meta)}</small>
          </article>
        `
      )
      .join("");
  }

  function renderBridgeNews(items = []) {
    if (!pollBridgeNews) return;

    if (!Array.isArray(items) || !items.length) {
      pollBridgeNews.innerHTML = `<p class="poll-empty">As matérias ligadas ao clima político entram aqui.</p>`;
      return;
    }

    pollBridgeNews.innerHTML = items
      .map(
        (item) => `
          <article class="poll-bridge-news-card">
            <span>${escapeHtml(item.category || "Política")} • ${escapeHtml(item.sourceName || "Fonte local")}</span>
            <strong>${escapeHtml(item.title || "Atualização política")}</strong>
            <p>${escapeHtml(item.summary || "Sem resumo disponível.")}</p>
            <div class="poll-bridge-news-actions">
              <a href="${escapeHtml(item.localUrl || item.sourceUrl || "#")}">Abrir no jornal</a>
              <a href="${escapeHtml(item.sourceUrl || item.localUrl || "#")}" target="_blank" rel="noreferrer">Ver fonte</a>
            </div>
          </article>
        `
      )
      .join("");
  }

  function renderPollBridge(payload = {}) {
    const poll = payload.poll || {};
    const journal = payload.journal || {};

    if (bridgeUpdatedAt) {
      bridgeUpdatedAt.textContent = poll.totalResponses
        ? `SPO com ${numberFormatter.format(poll.totalResponses)} respostas • ${formatDateTime(poll.updatedAt || payload.updatedAt)}`
        : "Jornal e SPO em sincronização";
    }

    renderBridgeSignals(poll);
    renderBridgeNews(journal.items);
  }

  function renderPublicSummary(payload = {}) {
    const summary = payload.summary || {};
    const totalResponses = Number(summary.totalResponses || 0);
    const satisfactionAverageValue = Number(summary.satisfactionAverage || 0);

    if (summaryTotal) {
      summaryTotal.textContent = numberFormatter.format(totalResponses);
    }

    if (summaryAverage) {
      summaryAverage.textContent = decimalFormatter.format(satisfactionAverageValue);
    }

    if (summaryUpdatedAt) {
      summaryUpdatedAt.textContent = totalResponses
        ? `Atualizado em ${formatDateTime(summary.updatedAt || payload.updatedAt)}`
        : "Aguardando respostas";
    }

    renderBarList(
      voteBars,
      summary.vote2026,
      "vote",
      "As barras aparecem assim que chegarem as primeiras respostas."
    );
    renderBarList(
      priorityBars,
      summary.priorities,
      "priority",
      "Sem prioridades registradas ainda."
    );
    renderBarList(
      stateDirectionBars,
      summary.stateDirection,
      "priority",
      "Sem leitura suficiente ainda."
    );
    renderBarList(
      desiredCycleBars,
      summary.desiredCycle,
      "vote",
      "Aguardando mais respostas."
    );
    renderBarList(
      rejectionBars,
      summary.rejection,
      "rejection",
      "Sem dados suficientes até o momento."
    );
    renderBarList(
      voteCertaintyBars,
      summary.voteCertainty,
      "vote",
      "Aguardando respostas."
    );
    renderLocationCloud(summary.locations);
    renderCandidateProfiles(summary.candidateProfiles);
  }

  async function loadPublicSummary() {
    try {
      const response = await fetch("/api/pesquisa-acre-2026/summary", {
        headers: {
          Accept: "application/json"
        }
      });
      const payload = await readJson(response);
      if (!response.ok) {
        throw new Error(payload.error || "Nao foi possivel carregar as parciais.");
      }
      renderPublicSummary(payload);
    } catch (error) {
      if (summaryUpdatedAt) {
        summaryUpdatedAt.textContent = "Parciais indisponiveis no momento";
      }
      setFeedback(formFeedback, error.message || "Falha ao carregar as parciais.", "error");
    }
  }

  async function checkCurrentUserVote({ scrollToPartials = false } = {}) {
    const user = getGoogleUser();
    if (!user?.email) {
      setPollCompletedState(false);
      setFeedback(formFeedback, "Entre com Google para liberar o voto semanal.", "error");
      return null;
    }

    try {
      const response = await fetch("/api/pesquisa-acre-2026/me", {
        credentials: "same-origin",
        headers: {
          Accept: "application/json"
        }
      });
      const payload = await readJson(response);
      if (!response.ok) {
        throw new Error(payload.error || "Nao foi possivel conferir seu voto.");
      }

      if (payload.alreadyVoted) {
        setPollCompletedState(
          true,
          payload.message ||
            "Seu Google ja registrou uma resposta nesta semana. A votacao fica encerrada e as parciais ficam liberadas."
        );
        setFeedback(formFeedback, "");
        renderPublicSummary({ summary: payload.summary, updatedAt: payload.summary?.updatedAt });
        await loadPollBridge();
        if (scrollToPartials) {
          showPartials();
        }
      } else {
        setPollCompletedState(false);
        setFeedback(
          formFeedback,
          "Google conectado. Seu dispositivo libera uma resposta por semana e guarda o historico da eleicao.",
          "success"
        );
      }

      return payload;
    } catch (error) {
      setFeedback(formFeedback, error.message || "Nao foi possivel conferir seu voto agora.", "error");
      return null;
    }
  }

  async function loadPollBridge() {
    try {
      const response = await fetch("/api/pesquisa-acre-2026/bridge", {
        headers: {
          Accept: "application/json"
        }
      });
      const payload = await readJson(response);
      if (!response.ok) {
        throw new Error(payload.error || "Nao foi possivel cruzar pesquisa e jornal.");
      }
      renderPollBridge(payload);
    } catch (_error) {
      if (bridgeUpdatedAt) {
        bridgeUpdatedAt.textContent = "Ponte jornal + SPO indisponivel no momento";
      }
    }
  }

  async function handleFormSubmit(event) {
    event.preventDefault();
    if (!form || !submitButton) return;

    if (!getGoogleUser()?.email) {
      setFeedback(formFeedback, "Entre com Google antes de votar. A pesquisa aceita um voto por dispositivo a cada semana.", "error");
      document.querySelector("[data-google-auth-card]")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    if (!form.reportValidity()) {
      setFeedback(formFeedback, "Preencha todos os campos antes de enviar.", "error");
      return;
    }

    const payload = {
      ...Object.fromEntries(new FormData(form).entries()),
      ...collectClientMeta()
    };

    submitButton.disabled = true;
    submitButton.textContent = "Registrando...";
    setFeedback(formFeedback, "");

    try {
      const response = await fetch("/api/pesquisa-acre-2026", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(payload)
      });
      const data = await readJson(response);

      if (!response.ok) {
        if (response.status === 409) {
          setPollCompletedState(
            true,
            data.error ||
              "Seu Google ou dispositivo ja registrou uma resposta nesta semana. As parciais ficam liberadas."
          );
          await loadPublicSummary();
          await loadPollBridge();
          showPartials();
          return;
        }
        throw new Error(data.error || "Nao foi possivel registrar a resposta.");
      }

      setPollCompletedState(true, data.message || "Obrigado por participar. Seu voto ja entrou nas parciais.");
      setFeedback(formFeedback, "");
      await loadPublicSummary();
      await loadPollBridge();
      showPartials();
    } catch (error) {
      setFeedback(formFeedback, error.message || "Falha ao enviar a pesquisa.", "error");
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Enviar e ver parciais";
    }
  }

  form?.addEventListener("submit", handleFormSubmit);
  window.addEventListener("catalogo:google-auth", () => {
    if (getGoogleUser()?.email) {
      void checkCurrentUserVote({ scrollToPartials: true });
      return;
    }
    setPollCompletedState(false);
    setFeedback(formFeedback, "Entre com Google para liberar o voto semanal.", "error");
  });
  restorePollCompletedState();
  loadPublicSummary().catch(() => {});
  loadPollBridge().catch(() => {});
  if (window.CatalogoGoogleAuth?.isReady?.() && getGoogleUser()?.email) {
    checkCurrentUserVote().catch(() => {});
  }
})();
