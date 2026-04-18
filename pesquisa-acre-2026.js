"use strict";

(() => {
  const form = document.getElementById("acrePollForm");
  const submitButton = document.getElementById("submitButton");
  const formFeedback = document.getElementById("formFeedback");
  const summaryCard = document.querySelector(".poll-summary");
  const summaryTotal = document.getElementById("summaryTotal");
  const summaryAverage = document.getElementById("summaryAverage");
  const summaryUpdatedAt = document.getElementById("summaryUpdatedAt");
  const voteBars = document.getElementById("voteBars");
  const priorityBars = document.getElementById("priorityBars");
  const stateDirectionBars = document.getElementById("stateDirectionBars");
  const desiredCycleBars = document.getElementById("desiredCycleBars");
  const rejectionBars = document.getElementById("rejectionBars");
  const voteCertaintyBars = document.getElementById("voteCertaintyBars");
  const locationCloud = document.getElementById("locationCloud");
  const candidateProfiles = document.getElementById("candidateProfiles");
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

  async function handleFormSubmit(event) {
    event.preventDefault();
    if (!form || !submitButton) return;

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
        throw new Error(data.error || "Nao foi possivel registrar a resposta.");
      }

      form.reset();
      setFeedback(formFeedback, data.message || "Resposta registrada com sucesso.", "success");
      await loadPublicSummary();
      summaryCard?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (error) {
      setFeedback(formFeedback, error.message || "Falha ao enviar a pesquisa.", "error");
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Enviar e ver parciais";
    }
  }

  form?.addEventListener("submit", handleFormSubmit);
  loadPublicSummary().catch(() => {});
})();
