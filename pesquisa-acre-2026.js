(() => {
  const officeTabs = document.getElementById("officeTabs");
  const candidateGrid = document.getElementById("candidateGrid");
  const officeBadge = document.getElementById("officeBadge");
  const officeTitle = document.getElementById("officeTitle");
  const officeSummary = document.getElementById("officeSummary");
  const officeScope = document.getElementById("officeScope");
  const officeVoteRule = document.getElementById("officeVoteRule");
  const electionUpdatedAt = document.getElementById("electionUpdatedAt");
  const resultsTitle = document.getElementById("resultsTitle");
  const resultsNote = document.getElementById("resultsNote");
  const resultsBars = document.getElementById("resultsBars");
  const thanksBanner = document.getElementById("thanksBanner");
  const voteModalBackdrop = document.getElementById("voteModalBackdrop");
  const voteModalText = document.getElementById("voteModalText");
  const voteCancelButton = document.getElementById("voteCancelButton");
  const voteConfirmButton = document.getElementById("voteConfirmButton");

  const state = {
    offices: [],
    activeOfficeId: "",
    votes: {},
    userVotes: {},
    authUser: null,
    pendingVote: null,
    statusMessage: ""
  };

  const numberFormatter = new Intl.NumberFormat("pt-BR");
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

  async function readJson(response) {
    try {
      return await response.json();
    } catch (_error) {
      return {};
    }
  }

  function getGoogleUser() {
    try {
      return window.CatalogoGoogleAuth?.getUser?.() || null;
    } catch (_error) {
      return null;
    }
  }

  function formatDateTime(value) {
    if (!value) return "Sem atualização";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return String(value);
    return dateFormatter.format(parsed);
  }

  function currentOffice() {
    return state.offices.find((office) => office.id === state.activeOfficeId) || null;
  }

  function renderOfficeTabs() {
    if (!officeTabs) return;
    officeTabs.innerHTML = state.offices
      .map(
        (office) => `
          <button
            type="button"
            class="office-tab"
            role="tab"
            aria-selected="${office.id === state.activeOfficeId ? "true" : "false"}"
            data-office-tab="${escapeHtml(office.id)}"
          >
            ${escapeHtml(office.label)}
          </button>
        `
      )
      .join("");
  }

  function renderOfficeStage() {
    const office = currentOffice();
    if (!office) return;

    if (officeBadge) {
      officeBadge.textContent = office.badge || office.label;
    }
    if (officeTitle) {
      officeTitle.textContent = office.label;
    }
    if (officeSummary) {
      officeSummary.textContent =
        office.summary ||
        "Escolha um nome, confirme o voto e acompanhe a parcial semanal do cargo.";
    }
    if (officeScope) {
      officeScope.textContent = office.scope === "federal" ? "Escopo federal" : "Escopo estadual";
    }
    if (officeVoteRule) {
      officeVoteRule.textContent = "1 voto por semana neste cargo";
    }
  }

  function buildCandidateInitials(name = "") {
    return String(name || "")
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  }

  function scheduleGoogleButtonRefresh() {
    window.setTimeout(() => {
      window.CatalogoGoogleAuth?.refresh?.();
    }, 0);
  }

  function renderCandidates() {
    const office = currentOffice();
    if (!candidateGrid || !office) return;

    const currentUserVote = state.userVotes?.[office.id] || "";
    const isSignedIn = Boolean(state.authUser?.sub && state.authUser?.email);
    candidateGrid.innerHTML = (Array.isArray(office.candidates) ? office.candidates : [])
      .map((candidate) => {
        const isCurrentVote = currentUserVote === candidate.id;
        const actionMarkup = isCurrentVote
          ? `
            <button type="button" class="candidate-vote-button" disabled>
              Você já votou
            </button>
          `
          : isSignedIn
            ? `
              <button
                type="button"
                class="candidate-vote-button"
                data-vote-button="${escapeHtml(candidate.id)}"
              >
                Confirmar voto
              </button>
            `
            : `
              <div class="candidate-google-slot">
                <small>Entre com Google para votar</small>
                <div
                  class="candidate-google-button"
                  data-google-auth-button
                  data-candidate-google="${escapeHtml(candidate.id)}"
                ></div>
              </div>
            `;
        return `
          <article class="candidate-card${isCurrentVote ? " is-voted" : ""}">
            <div class="candidate-head">
              <div class="candidate-avatar">
                ${
                  candidate.imageUrl
                    ? `<img src="${escapeHtml(candidate.imageUrl)}" alt="${escapeHtml(candidate.name)}" loading="lazy" />`
                    : `<span>${escapeHtml(buildCandidateInitials(candidate.name))}</span>`
                }
              </div>
              <div>
                <h3 class="candidate-name">${escapeHtml(candidate.name)}</h3>
                <p class="candidate-meta">${escapeHtml(candidate.role || office.label)}</p>
              </div>
            </div>
            <span class="candidate-party">${escapeHtml(candidate.party || "Sem partido")}</span>
            <p>${escapeHtml(candidate.historySummary || candidate.currentPosition || "Sem resumo disponível.")}</p>
            <div class="candidate-footer">
              <span>${escapeHtml(candidate.currentPosition || "Perfil público em acompanhamento")}</span>
            </div>
            ${actionMarkup}
          </article>
        `;
      })
      .join("");

    if (!isSignedIn) {
      scheduleGoogleButtonRefresh();
    }
  }

  function renderResults() {
    const office = currentOffice();
    if (!office || !resultsBars) return;

    const officeVotes = state.votes?.[office.id] || {};
    const candidates = Array.isArray(office.candidates) ? office.candidates : [];
    const rows = candidates
      .map((candidate) => ({
        candidate,
        total: Number(officeVotes[candidate.id] || 0)
      }))
      .sort((left, right) => right.total - left.total || left.candidate.name.localeCompare(right.candidate.name, "pt-BR"));

    const totalVotes = rows.reduce((sum, row) => sum + row.total, 0);

    if (resultsTitle) {
      resultsTitle.textContent = `Parcial semanal para ${office.label}`;
    }

    if (resultsNote) {
      resultsNote.textContent = totalVotes
        ? `${numberFormatter.format(totalVotes)} voto(s) computado(s) nesta semana`
        : "Sem votos registrados nesta semana.";
    }

    if (!totalVotes) {
      resultsBars.innerHTML = `<p class="election-empty">Sem votos registrados nesta semana.</p>`;
      return;
    }

    resultsBars.innerHTML = rows
      .map((row) => {
        const percent = totalVotes ? (row.total / totalVotes) * 100 : 0;
        return `
          <div class="result-row">
            <div class="result-meta">
              <strong>${escapeHtml(row.candidate.name)}</strong>
              <span>${numberFormatter.format(row.total)} voto(s) • ${percent.toFixed(1).replace(".", ",")}%</span>
            </div>
            <div class="result-track">
              <span style="width:${Math.max(0, Math.min(100, percent))}%"></span>
            </div>
          </div>
        `;
      })
      .join("");
  }

  function renderStatusMessage() {
    if (!thanksBanner) return;

    if (!state.statusMessage) {
      thanksBanner.hidden = true;
      return;
    }

    thanksBanner.hidden = false;
    thanksBanner.innerHTML = state.statusMessage;
  }

  function renderAll() {
    renderOfficeTabs();
    renderOfficeStage();
    renderCandidates();
    renderResults();
    renderStatusMessage();
  }

  async function loadElectionConfig() {
    const response = await fetch("/api/elections/acre", {
      headers: { Accept: "application/json" }
    });
    const payload = await readJson(response);
    if (!response.ok || !Array.isArray(payload.offices)) {
      throw new Error(payload.error || "Não foi possível carregar os cargos.");
    }

    state.offices = payload.offices;
    state.activeOfficeId = state.activeOfficeId || payload.offices[0]?.id || "";

    if (electionUpdatedAt) {
      electionUpdatedAt.textContent = payload.updatedAt
        ? `Atualizado em ${escapeHtml(payload.updatedAt)}`
        : "Painel eleitoral carregado";
    }
  }

  async function loadVotes() {
    const voterId = encodeURIComponent(state.authUser?.sub || "");
    const response = await fetch(`/api/elections/votes?voterId=${voterId}`, {
      headers: { Accept: "application/json" }
    });
    const payload = await readJson(response);
    if (!response.ok) {
      throw new Error(payload.message || payload.error || "Não foi possível carregar as parciais.");
    }

    state.votes = payload.votes || {};
    state.userVotes = payload.userVotes || {};
    state.statusMessage = Object.keys(state.userVotes || {}).length
      ? "<strong>Você já votou.</strong><p>Seu voto da semana já foi registrado. Acompanhe semanalmente para ver as parciais.</p>"
      : "";
    renderResults();
    renderCandidates();
    renderStatusMessage();
  }

  function openVoteModal(candidateId) {
    const office = currentOffice();
    const candidate = office?.candidates?.find((item) => item.id === candidateId);
    if (!office || !candidate || !voteModalBackdrop || !voteModalText) return;

    state.pendingVote = { officeId: office.id, candidateId: candidate.id };
    voteModalText.textContent = `Confirmar voto em ${candidate.name} para ${office.label}? Seu login Google marcará esse voto semanal.`;
    voteModalBackdrop.hidden = false;
  }

  function closeVoteModal() {
    state.pendingVote = null;
    if (voteModalBackdrop) {
      voteModalBackdrop.hidden = true;
    }
  }

  async function submitVote() {
    if (!state.pendingVote || !state.authUser?.sub || !state.authUser?.email) {
      closeVoteModal();
      return;
    }

    const office = currentOffice();
    const candidate = office?.candidates?.find((item) => item.id === state.pendingVote.candidateId);
    if (!office || !candidate) {
      closeVoteModal();
      return;
    }

    voteConfirmButton.disabled = true;
    voteConfirmButton.textContent = "Registrando...";

    try {
      const response = await fetch("/api/elections/votes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          officeId: office.id,
          candidateId: candidate.id,
          city: "Cruzeiro do Sul",
          sourcePage: location.pathname,
          pageTitle: document.title
        })
      });
      const payload = await readJson(response);

      if (!response.ok || !payload.ok) {
        throw new Error(payload.message || payload.error || "Não foi possível registrar o voto.");
      }

      state.votes = payload.votes || state.votes;
      state.userVotes = payload.userVotes || state.userVotes;
      state.statusMessage =
        "<strong>Obrigado por votar.</strong><p>Acompanhe semanalmente para ver como o cenário muda ao longo da campanha.</p>";
      renderResults();
      renderCandidates();
      renderStatusMessage();
      closeVoteModal();
      thanksBanner?.scrollIntoView({ behavior: "smooth", block: "center" });
    } catch (error) {
      if (String(error.message || "").toLowerCase().includes("já registrou voto")) {
        state.statusMessage =
          "<strong>Você já votou.</strong><p>Seu voto da semana já foi registrado. Acompanhe semanalmente para ver as parciais.</p>";
        await loadVotes().catch(() => {});
        renderStatusMessage();
        closeVoteModal();
        thanksBanner?.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        window.alert(error.message || "Falha ao registrar o voto.");
      }
    } finally {
      voteConfirmButton.disabled = false;
      voteConfirmButton.textContent = "Confirmar voto";
    }
  }

  function bindEvents() {
    officeTabs?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-office-tab]");
      if (!button) return;
      state.activeOfficeId = button.getAttribute("data-office-tab") || "";
      renderAll();
    });

    candidateGrid?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-vote-button]");
      if (!button) return;

      state.authUser = getGoogleUser();
      if (!state.authUser?.sub || !state.authUser?.email) {
        document.querySelector("[data-google-auth-card]")?.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
        return;
      }

      openVoteModal(button.getAttribute("data-vote-button") || "");
    });

    voteCancelButton?.addEventListener("click", closeVoteModal);
    voteModalBackdrop?.addEventListener("click", (event) => {
      if (event.target === voteModalBackdrop) {
        closeVoteModal();
      }
    });
    voteConfirmButton?.addEventListener("click", submitVote);

    window.addEventListener("catalogo:google-auth", async () => {
      state.authUser = getGoogleUser();
      await loadVotes().catch(() => {});
    });
  }

  async function init() {
    state.authUser = getGoogleUser();
    bindEvents();
    await loadElectionConfig();
    await loadVotes();
    renderAll();
  }

  init().catch((error) => {
    if (candidateGrid) {
      candidateGrid.innerHTML = `<p class="election-empty">${escapeHtml(error.message || "Falha ao carregar o painel eleitoral.")}</p>`;
    }
  });
})();
