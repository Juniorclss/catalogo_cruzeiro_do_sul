"use strict";

(() => {
  const form = document.getElementById("pollAdminAccessForm");
  const apiBaseInput = document.getElementById("pollAdminApiBase");
  const userInput = document.getElementById("pollAdminUser");
  const passwordInput = document.getElementById("pollAdminPassword");
  const feedback = document.getElementById("pollAdminFeedback");
  const dashboard = document.getElementById("pollAdminDashboard");
  const kpis = document.getElementById("pollAdminKpis");
  const tableBody = document.getElementById("pollAdminTableBody");
  const exportButton = document.getElementById("pollAdminExport");
  const ACCESS_KEY = "acre_2026_poll_admin_access_v1";
  const numberFormatter = new Intl.NumberFormat("pt-BR");
  const decimalFormatter = new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  });
  const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short"
  });
  let lastPayload = null;

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
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

  function serializeCsvRows(rows = []) {
    if (!Array.isArray(rows) || !rows.length) return "";
    const headers = [
      "createdAt",
      "localizacao",
      "profissao",
      "faixaEtaria",
      "votoAnterior",
      "satisfacao",
      "voto2026",
      "rejeicao",
      "prioridade",
      "comentario",
      "city",
      "country",
      "browser",
      "deviceType",
      "visitorId",
      "sessionId",
      "ip"
    ];

    const escapeCsv = (value) => {
      const text = String(value ?? "");
      if (/[",\n\r]/.test(text)) {
        return `"${text.replace(/"/g, '""')}"`;
      }
      return text;
    };

    return [headers.join(",")]
      .concat(rows.map((row) => headers.map((header) => escapeCsv(row[header])).join(",")))
      .join("\n");
  }

  function renderDashboard(payload = {}) {
    const summary = payload.summary || {};
    const voteLeader = Array.isArray(summary.vote2026) && summary.vote2026.length ? summary.vote2026[0] : null;
    const priorityLeader =
      Array.isArray(summary.priorities) && summary.priorities.length ? summary.priorities[0] : null;

    if (kpis) {
      kpis.innerHTML = `
        <article>
          <strong>${numberFormatter.format(summary.totalResponses || 0)}</strong>
          <span>respostas armazenadas</span>
        </article>
        <article>
          <strong>${decimalFormatter.format(summary.satisfactionAverage || 0)}</strong>
          <span>satisfação média</span>
        </article>
        <article>
          <strong>${escapeHtml(voteLeader?.label || "Sem líder")}</strong>
          <span>${voteLeader ? `${decimalFormatter.format(voteLeader.percent || 0)}% da amostra` : "sem amostra"}</span>
        </article>
        <article>
          <strong>${escapeHtml(priorityLeader?.label || "Sem prioridade")}</strong>
          <span>${priorityLeader ? `${numberFormatter.format(priorityLeader.total || 0)} menções` : "sem amostra"}</span>
        </article>
      `;
    }

    const records = Array.isArray(payload.records) ? payload.records : [];
    tableBody.innerHTML =
      records
        .map(
          (record) => `
            <tr>
              <td>${escapeHtml(formatDateTime(record.createdAt))}</td>
              <td>${escapeHtml(record.localizacao || record.city || "Nao informado")}</td>
              <td>${escapeHtml(record.profissao || "Nao informado")}<br /><small>${escapeHtml(record.faixaEtaria || "")}</small></td>
              <td>${escapeHtml(record.votoAnterior || "-")}<br /><small>Satisfação ${escapeHtml(record.satisfacao || "-")}/5</small></td>
              <td>${escapeHtml(record.voto2026 || "-")}</td>
              <td>${escapeHtml(record.rejeicao || "-")}</td>
              <td>${escapeHtml(record.prioridade || "-")}</td>
              <td>${escapeHtml(record.comentario || "Sem comentário")}</td>
            </tr>
          `
        )
        .join("") || `<tr><td colspan="8">Nenhum registro armazenado ainda.</td></tr>`;
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

    setFeedback("Liberando painel...");

    try {
      const response = await fetch(`${apiBase}/api/pesquisa-acre-2026/admin`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: encodeBasicAuth(user, password)
        },
        body: "{}"
      });
      const payload = await readJson(response);
      if (!response.ok) {
        throw new Error(payload.error || "Falha ao abrir a consulta administrativa.");
      }

      lastPayload = payload;
      dashboard.hidden = false;
      renderDashboard(payload);
      saveStoredAccess({ apiBase, user });
      setFeedback(`Painel liberado. Atualizado em ${formatDateTime(payload.updatedAt || payload.summary?.updatedAt)}.`, "success");
    } catch (error) {
      dashboard.hidden = true;
      setFeedback(error.message || "Falha ao abrir a consulta administrativa.", "error");
    }
  }

  function handleExport() {
    const records = lastPayload?.records;
    if (!Array.isArray(records) || !records.length) {
      setFeedback("Nenhum dado carregado para exportar.", "error");
      return;
    }

    const csv = serializeCsvRows(records);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "pesquisa-acre-2026.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(link.href), 500);
  }

  const stored = getStoredAccess();
  if (apiBaseInput) {
    apiBaseInput.value = normalizeBase(stored.apiBase || getDefaultApiBase());
  }
  if (userInput) {
    userInput.value = String(stored.user || "admin").trim() || "admin";
  }

  form?.addEventListener("submit", handleSubmit);
  exportButton?.addEventListener("click", handleExport);
})();
