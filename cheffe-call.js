(function () {
  const audienceEl = document.querySelector("#agentAudience");
  const statusEl = document.querySelector("#callStatus");
  const terminalEl = document.querySelector("#callTerminal");
  const formEl = document.querySelector("#cheffeCallForm");
  const releaseEl = document.querySelector("#releaseCall");
  const sendTerminalEl = document.querySelector("#sendTerminalCommand");
  const nextSpeakerEl = document.querySelector("#nextSpeaker");
  const markGoodIdeaEl = document.querySelector("#markGoodIdea");
  const opinionsEl = document.querySelector("#opinionsList");
  const speechBubbleEl = document.querySelector("#activeSpeechBubble");
  const raisedHandBoard = document.querySelector("#raisedHandBoard");
  const raisedHandList = document.querySelector("#raisedHandList");
  const meetingLogList = document.querySelector("#meetingLogList");
  const callModeBanner = document.querySelector("#callModeBanner");
  const taskQueueList = document.querySelector("#taskQueueList");
  const agentOfDayEl = document.querySelector("#agentOfDay");
  const agentOfDayMetaEl = document.querySelector("#agentOfDayMeta");
  const agentOfDayAvatar = document.querySelector("#agentOfDayAvatar");
  const agentNeuralBar = document.querySelector("#agentNeuralBar");
  const agentAwardNote = document.querySelector("#agentAwardNote");
  const voteAgentOfDay = document.querySelector("#voteAgentOfDay");
  const openAgentFile = document.querySelector("#openAgentFile");
  const fullscreenToggleEl = document.querySelector("#toggleFullscreenMode");
  const hudToggleEl = document.querySelector("#toggleHudMode");
  const lowerDecksToggleEl = document.querySelector("#toggleLowerDecks");
  const commandBarEl = document.querySelector("#cheffeCommandBar");
  const quickInstructionInput = document.querySelector("#quickInstructionInput");
  const focusCommandDetails = document.querySelector("#focusCommandDetails");
  const quickNextSpeaker = document.querySelector("#quickNextSpeaker");
  const quickOpenDecks = document.querySelector("#quickOpenDecks");
  const quickRefreshAgents = document.querySelector("#quickRefreshAgents");
  const officeOfDayEl = document.querySelector("#officeOfDay");
  const officeOfDayMetaEl = document.querySelector("#officeOfDayMeta");
  const actionOfDayEl = document.querySelector("#actionOfDay");
  const actionOfDayMetaEl = document.querySelector("#actionOfDayMeta");
  const achievementHeadlineEl = document.querySelector("#achievementHeadline");
  const achievementChaseLineEl = document.querySelector("#achievementChaseLine");
  const achievementHourLeaderEl = document.querySelector("#achievementHourLeader");
  const achievementHourMetaEl = document.querySelector("#achievementHourMeta");
  const achievementDayLeaderEl = document.querySelector("#achievementDayLeader");
  const achievementDayMetaEl = document.querySelector("#achievementDayMeta");
  const achievementWeekLeaderEl = document.querySelector("#achievementWeekLeader");
  const achievementWeekMetaEl = document.querySelector("#achievementWeekMeta");
  const achievementMonthLeaderEl = document.querySelector("#achievementMonthLeader");
  const achievementMonthMetaEl = document.querySelector("#achievementMonthMeta");
  const adminRuntimeStateEl = document.querySelector("#adminRuntimeState");
  const adminRuntimeMetaEl = document.querySelector("#adminRuntimeMeta");
  const adminSessionStateEl = document.querySelector("#adminSessionState");
  const adminSessionMetaEl = document.querySelector("#adminSessionMeta");
  const adminLastActionStateEl = document.querySelector("#adminLastActionState");
  const adminLastActionMetaEl = document.querySelector("#adminLastActionMeta");
  const adminRunAgentsNow = document.querySelector("#adminRunAgentsNow");
  const adminReleaseRoom = document.querySelector("#adminReleaseRoom");
  const adminClearSession = document.querySelector("#adminClearSession");
  const adminExportSnapshot = document.querySelector("#adminExportSnapshot");
  const adminOpenRealAgents = document.querySelector("#adminOpenRealAgents");
  const callMapSummary = document.querySelector("#callMapSummary");
  const callMapList = document.querySelector("#callMapList");
  const theaterEl = document.querySelector(".bitmap-theater");
  const lowerDecksEl = document.querySelector(".call-lower-decks");
  const theaterStackEl = document.querySelector(".theater-stack");
  const meetingTableEl = document.querySelector(".meeting-table");
  const stagePlatformEl = document.querySelector(".stage-platform");
  const instructionInput = formEl?.querySelector('[name="instruction"]');
  const commandInput = formEl?.querySelector('[name="command"]');
  const promptModeSelect = document.querySelector("#promptModeSelect");
  const promptOfficeSelect = document.querySelector("#promptOfficeSelect");
  const promptAgentSelect = document.querySelector("#promptAgentSelect");
  const promptPreviewTitle = document.querySelector("#promptPreviewTitle");
  const promptPreviewBadge = document.querySelector("#promptPreviewBadge");
  const promptPreviewText = document.querySelector("#promptPreviewText");
  const promptConsoleMeta = document.querySelector("#promptConsoleMeta");
  const loadPromptToInstruction = document.querySelector("#loadPromptToInstruction");
  const loadPromptToTerminal = document.querySelector("#loadPromptToTerminal");
  const copyPromptText = document.querySelector("#copyPromptText");

  const fallbackAgents = [
    { agent: "Codex CEO", office: "Comando", role: "prioridade", score: 92 },
    { agent: "Editora Ari", office: "Jornal", role: "manchete", score: 88 },
    { agent: "Revisor Bento", office: "Qualidade", role: "revisão", score: 84 },
    { agent: "Lia Copy", office: "Texto", role: "copy", score: 83 },
    { agent: "Dara Design", office: "Criação", role: "visual", score: 82 },
    { agent: "Pixo", office: "Pixel Art", role: "sprites", score: 81 },
    { agent: "Kai Gamer", office: "Games", role: "loop", score: 79 },
    { agent: "Téo Dev", office: "Sistema", role: "terminal", score: 78 },
    { agent: "Nina Texto", office: "Texto", role: "clareza", score: 77 },
    { agent: "Vera Vendas", office: "Promo", role: "pontuação", score: 76 },
    { agent: "Nico Study", office: "Fontes", role: "contexto", score: 75 },
    { agent: "Mila Kids", office: "Família", role: "leveza", score: 74 }
  ];
  let currentAgentOfDay = null;
  let currentRealAgents = [];
  let currentOpinions = [];
  let activeSpeakerIndex = 0;
  let meetingLogs = [];
  let taskQueue = [];
  let raisedHandName = "";
  let raisedHandQueue = [];
  let promptConsoleData = null;
  let activePromptPayload = { title: "Prompt supremo", badge: "Cheffe Call", text: "" };
  let lowerDecksOpen = false;
  let currentMeetingSessionId = "";
  let latestCallPayload = null;

  function rectToPercent(rect, rootRect) {
    if (!rect || !rootRect || !rootRect.width || !rootRect.height) return null;
    return {
      x: Number((((rect.left - rootRect.left) / rootRect.width) * 100).toFixed(2)),
      y: Number((((rect.top - rootRect.top) / rootRect.height) * 100).toFixed(2)),
      width: Number(((rect.width / rootRect.width) * 100).toFixed(2)),
      height: Number(((rect.height / rootRect.height) * 100).toFixed(2))
    };
  }

  function getSeatGridMeta() {
    const mobile = window.matchMedia("(max-width: 980px)").matches;
    return {
      columns: mobile ? 10 : 20,
      rows: mobile ? 19 : 10,
      orientation: "virados para o palco sul",
      anchor: "tronco no assento / cabeça acima do encosto"
    };
  }

  function buildSceneMap() {
    const rootRect = theaterStackEl?.getBoundingClientRect();
    if (!rootRect) return null;
    const zones = [
      {
        key: "audience",
        label: "Plateia",
        role: "Grade de cadeiras onde ficam os 181 agentes.",
        rect: rectToPercent(audienceEl?.getBoundingClientRect(), rootRect)
      },
      {
        key: "podium",
        label: "Púlpito",
        role: "Mesa central de fala do comando.",
        rect: rectToPercent(meetingTableEl?.getBoundingClientRect(), rootRect)
      },
      {
        key: "stage",
        label: "Palco sul",
        role: "Área do avatar principal em 2D, de costas para a plateia.",
        rect: rectToPercent(stagePlatformEl?.getBoundingClientRect(), rootRect)
      },
      {
        key: "speakerBubble",
        label: "Bolha de fala",
        role: "Card do agente ativo com as ações da fala.",
        rect: rectToPercent(speechBubbleEl?.getBoundingClientRect(), rootRect)
      },
      {
        key: "raisedHands",
        label: "Fila de fala",
        role: "Zona dos agentes com mão levantada aguardando vez.",
        rect: rectToPercent(raisedHandBoard?.getBoundingClientRect(), rootRect)
      }
    ].filter((item) => item.rect);

    return {
      root: {
        width: Math.round(rootRect.width),
        height: Math.round(rootRect.height)
      },
      stageDirection: "south",
      seatGrid: getSeatGridMeta(),
      zones
    };
  }

  function renderSceneMap() {
    const sceneMap = buildSceneMap();
    if (!sceneMap) return;
    if (callMapSummary) {
      callMapSummary.textContent = `Mapa ativo: palco ao sul, ${sceneMap.seatGrid.columns} colunas de assentos e ${sceneMap.zones.length} zonas nomeadas com coordenadas reais da cena.`;
    }
    if (callMapList) {
      callMapList.innerHTML = sceneMap.zones
        .map(
          (zone) => `
            <article class="call-map-item">
              <span>${escapeHtml(zone.key)}</span>
              <strong>${escapeHtml(zone.label)}</strong>
              <p>${escapeHtml(zone.role)} x:${zone.rect.x}% y:${zone.rect.y}% w:${zone.rect.width}% h:${zone.rect.height}%</p>
            </article>
          `
        )
        .join("");
    }
    window.cheffe_call_scene_map = sceneMap;
  }

  function syncGameShellState() {
    document.body.classList.toggle("call-hud-hidden", document.body.dataset.hud === "hidden");
    document.body.classList.toggle("call-lower-open", lowerDecksOpen);
    if (lowerDecksEl) lowerDecksEl.setAttribute("aria-hidden", lowerDecksOpen ? "false" : "true");
    window.dispatchEvent(
      new CustomEvent("cheffe-call:scene-state", {
        detail: {
          hudHidden: document.body.dataset.hud === "hidden",
          lowerDecksOpen,
          speaker: currentOpinions[activeSpeakerIndex % Math.max(1, currentOpinions.length)] || null
        }
      })
    );
  }

  async function toggleFullscreen() {
    const root = document.documentElement;
    try {
      if (!document.fullscreenElement) {
        await root.requestFullscreen?.();
      } else {
        await document.exitFullscreen?.();
      }
    } catch (_error) {
      setStatus("Nao foi possivel alternar tela cheia agora.", "bad");
    }
  }

  function toggleHudVisibility() {
    document.body.dataset.hud = document.body.dataset.hud === "hidden" ? "visible" : "hidden";
    syncGameShellState();
  }

  function toggleLowerDecksVisibility(forceState) {
    lowerDecksOpen = typeof forceState === "boolean" ? forceState : !lowerDecksOpen;
    syncGameShellState();
  }

  function slugify(value) {
    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function getVoteKey(agent) {
    return `cheffe_agent_vote:${slugify(agent?.name || agent?.agent || "agente")}`;
  }

  function getAgentVotes(agent) {
    try {
      return Number(window.localStorage.getItem(getVoteKey(agent)) || 0);
    } catch (_error) {
      return 0;
    }
  }

  function addAgentVote(agent) {
    const nextVotes = getAgentVotes(agent) + 1;
    try {
      window.localStorage.setItem(getVoteKey(agent), String(nextVotes));
    } catch (_error) {
      // ignore storage failures
    }
    return nextVotes;
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function setStatus(message, tone) {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.style.color = tone === "bad" ? "var(--call-red)" : tone === "ok" ? "var(--call-green)" : "";
  }

  function getAdminPassword() {
    return String(new FormData(formEl).get("password") || "").trim();
  }

  function updatePromptPreview(payload) {
    activePromptPayload = payload || activePromptPayload;
    if (promptPreviewTitle) promptPreviewTitle.textContent = activePromptPayload.title || "Prompt";
    if (promptPreviewBadge) promptPreviewBadge.textContent = activePromptPayload.badge || "Cheffe Call";
    if (promptPreviewText) promptPreviewText.textContent = activePromptPayload.text || "";
  }

  function fillSelect(select, options, placeholder) {
    if (!select) return;
    select.innerHTML = [`<option value="">${escapeHtml(placeholder)}</option>`]
      .concat(
        options.map((item) => `<option value="${escapeHtml(item.value)}">${escapeHtml(item.label)}</option>`)
      )
      .join("");
  }

  function refreshPromptAgentOptions(selectedOffice = "") {
    if (!promptAgentSelect) return;
    const agents = Array.isArray(promptConsoleData?.agents) ? promptConsoleData.agents : [];
    const filtered = selectedOffice ? agents.filter((item) => item.office === selectedOffice) : agents;
    fillSelect(
      promptAgentSelect,
      filtered.map((item) => ({
        value: item.slug,
        label: `${item.name} • ${item.office} • ${item.role}`
      })),
      "Selecione um agente"
    );
  }

  function selectPromptPayload() {
    if (!promptConsoleData) return;
    const mode = promptModeSelect?.value || "global";
    if (mode === "global") {
      updatePromptPreview({
        title: "Prompt supremo",
        badge: "Cheffe Call",
        text: promptConsoleData.globalPrompt || ""
      });
      return;
    }

    if (mode === "office") {
      const office = promptOfficeSelect?.value || "";
      const officePrompt = (promptConsoleData.offices || []).find((item) => item.office === office);
      updatePromptPreview({
        title: officePrompt?.office || "Prompt por escritório",
        badge: officePrompt ? "Escritório" : "Cheffe Call",
        text: officePrompt?.prompt || "Escolha um escritório para carregar a diretriz da equipe."
      });
      return;
    }

    const agentSlug = promptAgentSelect?.value || "";
    const agentPrompt = (promptConsoleData.agents || []).find((item) => item.slug === agentSlug);
    updatePromptPreview({
      title: agentPrompt?.name || "Prompt por agente",
      badge: agentPrompt ? `${agentPrompt.office} • ${agentPrompt.role}` : "Agente",
      text: agentPrompt?.prompt || "Escolha um agente para abrir o prompt individual."
    });
  }

  async function copyText(value) {
    if (!value) return false;
    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch (_error) {
      return false;
    }
  }

  async function initPromptConsole() {
    if (!promptPreviewText) return;
    try {
      const response = await fetch("/api/cheffe-call/prompts", { cache: "no-store" });
      if (!response.ok) throw new Error("Nao foi possivel carregar o arquivo de prompts.");
      const payload = await response.json();
      promptConsoleData = payload?.ok ? payload : null;
      if (!promptConsoleData) throw new Error("Nao foi possivel montar a reuniao dos prompts.");
      fillSelect(
        promptOfficeSelect,
        (promptConsoleData.offices || []).map((item) => ({ value: item.office, label: item.office })),
        "Selecione um escritório"
      );
      refreshPromptAgentOptions("");
      selectPromptPayload();
      if (promptConsoleMeta) {
        promptConsoleMeta.textContent = `${promptConsoleData.totalAgents || 0} agentes carregados. Use o prompt supremo, um escritório ou um agente específico.`;
      }
    } catch (error) {
      updatePromptPreview({
        title: "Prompts indisponíveis",
        badge: "Falha",
        text: "Nao foi possivel carregar o console dos 181 agentes agora."
      });
      if (promptConsoleMeta) {
        promptConsoleMeta.textContent = String(error?.message || error || "Falha ao carregar prompts.");
      }
    }
  }

  function setModeBanner(mode, detail) {
    if (!callModeBanner) return;
    callModeBanner.dataset.mode = mode || "visual";
    callModeBanner.innerHTML = `
      <span>${escapeHtml(mode === "real" ? "Runtime real" : "Modo visual")}</span>
      <strong>${escapeHtml(detail || (mode === "real" ? "Runtimes pausadas para operação" : "Simulação aberta sem senha"))}</strong>
    `;
  }

  function getAgentDisplayName(item) {
    return item?.agent || item?.name || "Agente";
  }

  function getAgentOffice(item) {
    return item?.office || item?.officeLabel || "Escritório";
  }

  function getAgentScore(item) {
    return Number(item?.score || item?.autonomy?.autonomy || item?.autonomy || 0);
  }

  function hashValue(value) {
    return String(value || "")
      .split("")
      .reduce((sum, char) => sum + char.charCodeAt(0), 0);
  }

  function getAgentPersona(item) {
    const spriteProfile = item?.spriteProfile || null;
    if (spriteProfile) {
      return {
        accent: spriteProfile.accent || "#7fe7ff",
        jacket: spriteProfile.jacket || spriteProfile.secondary || "#1d2740",
        accessory: spriteProfile.accessory || "badge",
        prop: spriteProfile.prop || "tablet",
        hairStyle: spriteProfile.hairStyle || "short",
        skin: spriteProfile.skin || "#f2c5a0",
        hair: spriteProfile.hair || "#17101b"
      };
    }
    const signature = `${getAgentDisplayName(item)} ${getAgentOffice(item)} ${item?.role || ""}`.toLowerCase();
    const photo = item?.photo || {};
    const skin = ["#f2c5a0", "#e8ae83", "#d99b72", "#f0d0aa"][hashValue(signature) % 4];
    const hair = ["#17101b", "#3a2419", "#24283d", "#5a351f", "#111827"][hashValue(signature) % 5];
    const profile = {
      accent: photo.primary || "#7fe7ff",
      jacket: photo.secondary || "#1d2740",
      accessory: "badge",
      prop: "tablet",
      hairStyle: "short",
      skin,
      hair
    };
    if (/ceo|coord|gest|admin|produtor|prioridade|comando/.test(signature)) {
      return { ...profile, accent: "#f4c96b", jacket: "#2b2234", accessory: "tie", prop: "tablet", hairStyle: "swept" };
    }
    if (/review|revis|proof|qualidade|clean|audit/.test(signature)) {
      return { ...profile, accent: "#cda6ff", jacket: "#302653", accessory: "glasses", prop: "clipboard", hairStyle: "bob" };
    }
    if (/arte|design|foto|visual|pixel|sprite|tag/.test(signature)) {
      return { ...profile, accent: "#ff7ab6", jacket: "#3a1930", accessory: "bow", prop: "stylus", hairStyle: "wave" };
    }
    if (/dev|sistema|terminal|code|autom|runtime|dados/.test(signature)) {
      return { ...profile, accent: "#73eba8", jacket: "#113323", accessory: "headset", prop: "toolkit", hairStyle: "short" };
    }
    if (/games|game|loop|play|nerd/.test(signature)) {
      return { ...profile, accent: "#7fe7ff", jacket: "#142446", accessory: "visor", prop: "gamepad", hairStyle: "spiky" };
    }
    if (/venda|promo|market|pix|acesso|social/.test(signature)) {
      return { ...profile, accent: "#ffb65c", jacket: "#4a2813", accessory: "cap", prop: "phone", hairStyle: "swept" };
    }
    if (/fonte|source|study|educ|kids|ninja|segur/.test(signature)) {
      return { ...profile, accent: "#73eba8", jacket: "#1e3a2f", accessory: "glasses", prop: "book", hairStyle: "bun" };
    }
    return profile;
  }

  function renderAgentSprite(item, options = {}) {
    const persona = getAgentPersona(item);
    const label = escapeHtml(getAgentDisplayName(item));
    const extraClass = options.large ? " is-large" : "";
    return `
      <span
        class="call-agent-sprite${extraClass}"
        data-accessory="${persona.accessory}"
        data-prop="${persona.prop}"
        data-hair-style="${persona.hairStyle}"
        style="--agent-skin:${persona.skin};--agent-hair:${persona.hair};--agent-accent:${persona.accent};--agent-jacket:${persona.jacket}"
        aria-label="${label}"
      >
        <i class="sprite-shadow"></i>
        <i class="sprite-hair"></i>
        <i class="sprite-head"></i>
        <i class="sprite-face"></i>
        <i class="sprite-accessory"></i>
        <i class="sprite-body"></i>
        <i class="sprite-arm left"></i>
        <i class="sprite-arm right"></i>
        <i class="sprite-leg left"></i>
        <i class="sprite-leg right"></i>
        <i class="sprite-prop"></i>
        <i class="sprite-prop-detail"></i>
      </span>
    `;
  }

  function renderAgentPhotoToken(item) {
    const photo = item?.photo || {};
    if (!photo.initials && !photo.badge) return "";
    return `
      <span
        class="call-agent-photo-token"
        style="--photo-a:${escapeHtml(photo.primary || "#7fe7ff")};--photo-b:${escapeHtml(photo.secondary || "#f4c96b")}"
        aria-label="Foto real de ${escapeHtml(getAgentDisplayName(item))}"
      >
        <b>${escapeHtml(photo.initials || "?")}</b>
        <i>${escapeHtml(photo.badge || "AG")}</i>
      </span>
    `;
  }

  function enrichAgentContext(item) {
    const memory = Array.isArray(item?.autonomy?.memory) ? item.autonomy.memory[0] : null;
    return {
      name: getAgentDisplayName(item),
      office: getAgentOffice(item),
      role: item?.role || "agent",
      score: getAgentScore(item),
      intent: item?.intent || item?.autonomy?.intent || memory?.intent || item?.opinion || "intenção em formação",
      action: item?.action || item?.assignment?.action || memory?.action || item?.deliverable || "aguardando sua decisão",
      neural: Math.max(42, Math.min(100, getAgentScore(item) || 72))
    };
  }

  function extractRealAgents(payload) {
    const daily = payload?.dailyContext || {};
    const topAgents = Array.isArray(daily.topAgents) ? daily.topAgents : [];
    const queue = Array.isArray(payload?.queue) ? payload.queue : [];
    const registry = Array.isArray(payload?.agents) ? payload.agents : [];
    const registryBySlug = new Map(registry.map((item) => [item.slug, item]));
    const registryByNameOffice = new Map(
      registry.map((item) => [`${item.name || item.agent}|${item.officeLabel || item.office}`, item])
    );
    const source = queue.length ? queue : topAgents;
    const mapped = source
      .map((item) => {
        const registryMatch =
          registryBySlug.get(item.slug) ||
          registryByNameOffice.get(`${item.name || item.agent}|${item.office || item.officeLabel}`) ||
          null;
        return {
        id: item.id,
        slug: item.slug,
        agent: item.name || item.agent,
        office: item.office || item.officeLabel,
        officeLabel: item.officeLabel || registryMatch?.officeLabel || item.office,
        role: item.role || item.title || "agent",
        score: item.score || item.autonomy?.autonomy || item.autonomy || 0,
        urgency: item.urgency || item.autonomy?.urgency || 0,
        confidence: item.confidence || item.autonomy?.confidence || 0,
        intent: item.intent || item.autonomy?.intent || item.assignment?.idea || "",
        action: item.action || item.assignment?.action || "",
        assignment: item.assignment || null,
        autonomy: item.autonomy || null,
        photo: item.photo || null,
        officeKey: item.officeKey || registryMatch?.officeKey || null,
        spriteProfile: item.spriteProfile || registryMatch?.spriteProfile || null,
        points: item.points || 0,
        awards: Array.isArray(item.awards) ? item.awards : []
      };
      })
      .filter((item) => item.agent);
    return mapped.length ? mapped : fallbackAgents;
  }

  function isWeakOpinionSet(opinions) {
    if (!Array.isArray(opinions) || opinions.length < 3) return true;
    const keys = opinions.map((item) => String(item.opinion || "").toLowerCase().replace(/\s+/g, " ").trim());
    return new Set(keys).size <= Math.ceil(keys.length / 2);
  }

  function buildOpinionsFromAgents(agents, subject) {
    return (Array.isArray(agents) ? agents : [])
      .slice(0, 12)
      .map((agent, index) => ({
        ...agent,
        opinion: buildOpinionForAgent(agent, subject, index),
        approvalRequired: true
      }));
  }

  function mergeCheffeAndRealPayload(cheffePayload, realPayload) {
    if (!realPayload?.ok) return cheffePayload;
    const merged = {
      ...cheffePayload,
      ok: true,
      summary: realPayload.summary || cheffePayload.summary || {},
      dailyContext: realPayload.dailyContext || cheffePayload.dailyContext || null,
      autonomy: realPayload.autonomy || cheffePayload.autonomy || null,
      queue: Array.isArray(realPayload.queue) ? realPayload.queue : cheffePayload.queue || [],
      awards: realPayload.awards || cheffePayload.awards || null,
      scoreboard: realPayload.scoreboard || cheffePayload.scoreboard || null
    };
    const realAgents = extractRealAgents(merged);
    const subject = merged.meeting?.lastInstruction || "tema da reunião";
    if (isWeakOpinionSet(merged.opinions)) {
      merged.opinions = buildOpinionsFromAgents(realAgents, subject);
    } else {
      const byNameOffice = new Map(
        realAgents.map((agent) => [`${getAgentDisplayName(agent)}|${getAgentOffice(agent)}`, agent])
      );
      merged.opinions = merged.opinions.map((item) => ({
        ...(byNameOffice.get(`${getAgentDisplayName(item)}|${getAgentOffice(item)}`) || {}),
        ...item
      }));
    }
    return merged;
  }

  function renderAudience(count, speakerNames = [], agentList = currentRealAgents) {
    if (!audienceEl) return;
    const colors = ["#7fe7ff", "#f4c96b", "#73eba8", "#f56d7a", "#cda6ff"];
    const sourceAgents = Array.isArray(agentList) && agentList.length ? agentList : fallbackAgents;
    audienceEl.innerHTML = Array.from({ length: Math.min(181, Number(count || 90)) })
      .map(
        (_, index) => {
          const agent = sourceAgents[index % sourceAgents.length];
          const name = getAgentDisplayName(agent);
          const isSpeaking = speakerNames.includes(name);
          return `<span class="seat-agent has-sprite ${isSpeaking ? "is-speaking" : ""}" data-agent-index="${index}" data-agent-name="${escapeHtml(name)}" title="${escapeHtml(
            `${name} • ${getAgentOffice(agent)}`
          )}" style="--agent-color:${colors[index % colors.length]};--agent-hair:${
            index % 3 === 0 ? "#151018" : index % 3 === 1 ? "#47301d" : "#232b44"
          };--delay:${
            (index % 17) * 80
          }ms">${renderAgentPhotoToken(agent)}${renderAgentSprite(agent)}<span class="seat-state-icon" aria-hidden="true"></span><span class="agent-name-tag">${escapeHtml(name)}</span></span>`;
        }
      )
      .join("");
    applyAudienceStates();
  }

  function applyAudienceStates() {
    if (!audienceEl) return;
    const runningNames = new Set(taskQueue.filter((item) => item.state === "running").map((item) => item.agent));
    const fallbackNames = new Set(taskQueue.filter((item) => item.state === "fallback").map((item) => item.agent));
    const terminalNames = new Set(taskQueue.filter((item) => item.state === "terminal").map((item) => item.agent));
    const raisedNames = new Set([raisedHandName, ...raisedHandQueue].filter(Boolean));
    audienceEl.querySelectorAll(".seat-agent").forEach((seat) => {
      const name = seat.dataset.agentName || "";
      seat.classList.toggle("is-implementing", runningNames.has(name));
      seat.classList.toggle("is-fallback", fallbackNames.has(name));
      seat.classList.toggle("is-terminal", terminalNames.has(name));
      seat.classList.toggle("is-hand-raised", raisedNames.has(name));
    });
  }

  function refreshRaisedHandQueue() {
    if (!currentOpinions.length) {
      raisedHandQueue = [];
    } else {
      const activeName = getAgentDisplayName(currentOpinions[activeSpeakerIndex]);
      raisedHandQueue = currentOpinions
        .map((item) => getAgentDisplayName(item))
        .filter((name) => name && name !== activeName)
        .slice(0, 4);
    }

    if (!raisedHandList) return;
    if (!raisedHandQueue.length) {
      raisedHandBoard?.classList.remove("is-live");
      raisedHandList.innerHTML = '<p class="raised-hand-empty">Ninguém aguardando a vez.</p>';
      return;
    }

    raisedHandBoard?.classList.add("is-live");
    raisedHandList.innerHTML = raisedHandQueue
      .map(
        (name, index) => `
          <span class="raised-hand-chip ${index === 0 ? "is-next" : ""}">
            <i>${index === 0 ? "Proximo" : `Fila ${index + 1}`}</i>
            <strong>${escapeHtml(name)}</strong>
          </span>
        `
      )
      .join("");
  }

  function buildLocalOpinions(subject, command) {
    const cleanSubject = subject || "a reunião dos agentes";
    const cleanCommand = command || "sem código colado ainda";
    const templates = [
      "Eu começaria definindo o objetivo da sala e a primeira ação que você quer aprovar.",
      "A reunião precisa mostrar resposta visual: sentado, levantando a mão, falando e pontuando.",
      "O terminal deve receber pedido específico sem misturar com senha; senha só para operação real.",
      "Eu criaria pontuação visível para dar vontade de acompanhar funcionário do dia, semana, mês e ano.",
      "A sala precisa inspirar: luz, mesa central, gente conversando e painel vivo, não um palco vazio.",
      "Se tiver código, eu separaria análise, risco e patch antes de executar qualquer coisa."
    ];
    return fallbackAgents.slice(0, 10).map((agent, index) => ({
      ...agent,
      opinion: `${templates[index % templates.length]} Assunto: ${cleanSubject}. Terminal: ${cleanCommand.slice(0, 120)}.`
    }));
  }

  function buildOpinionForAgent(item, subject, index) {
    const cleanSubject = subject || "o assunto da reunião";
    const signature = `${item.agent || ""} ${item.office || ""} ${item.role || ""}`.toLowerCase();
    const templates = [
      {
        test: /ceo|coord|gest|admin|produtor|prioridade/,
        text: "Eu separaria isso em prioridade, risco e primeira entrega aprovada. Sem essa ordem, a reunião vira barulho."
      },
      {
        test: /editor|jornal|news|redac|manchete/,
        text: "Minha visão é organizar a narrativa: o visitante precisa entender o assunto, a decisão e o próximo clique sem esforço."
      },
      {
        test: /review|revis|proof|qualidade|clean/,
        text: "Eu atacaria repetição e frase genérica. Cada agente precisa dizer algo diferente ou sair da lista."
      },
      {
        test: /copy|texto|tag/,
        text: "Eu transformaria o pedido em fala curta, humana e acionável, com verbo claro para você mandar executar depois."
      },
      {
        test: /arte|design|foto|visual|pixel|sprite/,
        text: "Eu faria a sala inspirar: personagens reconhecíveis, pose de fala, mão levantada, foto do destaque e prêmio visível."
      },
      {
        test: /dev|sistema|terminal|code|autom|acesso/,
        text: "Eu conectaria a opinião ao terminal: comando recebido, agente responsável, status e próximo patch possível."
      },
      {
        test: /ninja|fonte|audit|segur/,
        text: "Eu entraria como trava de segurança: o que é evidência, o que é sugestão e o que ainda precisa da sua aprovação."
      },
      {
        test: /games|loop|promo|pontua/,
        text: "Eu colocaria regra de mini game: rodada, turno de fala, pontuação, recompensa e histórico de quem ajudou mais."
      }
    ];
    const match = templates.find((template) => template.test.test(signature));
    const fallback = [
      "Eu pegaria uma parte pequena do problema e devolveria uma proposta com dono, prazo e critério de aceite.",
      "Eu compararia duas alternativas e mostraria qual delas dá menos retrabalho agora.",
      "Eu responderia com uma ação prática e uma dúvida objetiva antes de mexer em produção.",
      "Eu marcaria o que é opinião, o que é tarefa e o que precisa de aprovação final."
    ][index % 4];
    return `${match ? match.text : fallback} Assunto: ${cleanSubject}.`;
  }

  function normalizeOpinions(opinions, subject) {
    const list = Array.isArray(opinions) && opinions.length ? opinions : fallbackAgents;
    const seen = new Map();
    return list.map((item, index) => {
      const rawOpinion = String(item.opinion || "").trim();
      const key = rawOpinion.toLowerCase().replace(/\s+/g, " ");
      const repeated = key && seen.has(key);
      seen.set(key, (seen.get(key) || 0) + 1);
      return {
        ...item,
        opinion: !rawOpinion || repeated ? buildOpinionForAgent(item, subject, index) : rawOpinion
      };
    });
  }

  function renderDaily(payload) {
    const daily = payload.dailyContext || {};
    const agent = daily.agentOfDay || {};
    const office = daily.officeOfDay || {};
    const action = daily.actionOfDay || {};
    const matchingRealAgent = currentRealAgents.find((item) => getAgentDisplayName(item) === agent.name) || null;
    currentAgentOfDay = agent.name ? { ...matchingRealAgent, ...agent, agent: agent.name } : currentRealAgents[0] || fallbackAgents[0];
    const neuralScore = Math.max(42, Math.min(100, Number(agent.score || agent.autonomy || 82)));
    const votes = getAgentVotes(currentAgentOfDay);
    if (agentOfDayAvatar) {
      agentOfDayAvatar.innerHTML = `
        <span class="spotlight-rays"></span>
        ${renderAgentPhotoToken(currentAgentOfDay)}
        ${renderAgentSprite(
          {
            agent: currentAgentOfDay.name || currentAgentOfDay.agent,
            office: currentAgentOfDay.office,
            role: currentAgentOfDay.role,
            score: currentAgentOfDay.score,
            photo: currentAgentOfDay.photo,
            assignment: currentAgentOfDay.assignment,
            autonomy: currentAgentOfDay.autonomy
          },
          { large: true }
        )}
        <span class="spotlight-agent-confetti c1"></span>
        <span class="spotlight-agent-confetti c2"></span>
        <span class="spotlight-agent-confetti c3"></span>
      `;
    }

    agentOfDayEl.textContent = agent.name || "Sem rodada";
    agentOfDayMetaEl.textContent = agent.name
      ? `${agent.office} • autonomia ${agent.score || 0}% • ${votes} votos no avatar • ${
          agent.intent || "intencao em formacao"
        }`
      : "Rode os agentes para calcular o destaque.";
    if (agentNeuralBar) agentNeuralBar.style.width = `${neuralScore}%`;
    if (agentAwardNote) {
      agentAwardNote.textContent = agent.name
        ? `${agent.name} atingiu um objetivo importante no fluxo de aprendizado neural: ${neuralScore}% de crescimento aplicado. Esse destaque inspira os outros agentes a subir pontuação, foco e qualidade.`
        : "Objetivo neural em leitura. Quando um agente atinge uma meta, a sala inteira vê o avanço.";
    }

    officeOfDayEl.textContent = office.office || "Sem rodada";
    officeOfDayMetaEl.textContent = office.office
      ? `${office.agents || 0} agentes • autonomia media ${office.averageAutonomy || 0}% • urgencia ${
          office.averageUrgency || 0
        }%`
      : "Aguardando pontuacao diaria.";

    actionOfDayEl.textContent = action.title || "Sem ação";
    actionOfDayMetaEl.textContent = action.action || "As propostas aguardam aprovação do Full Admin.";
  }

  function getPeriodLeader(scoreboard, periodKey) {
    const leaders = scoreboard?.current?.[periodKey]?.leaders;
    return Array.isArray(leaders) && leaders.length ? leaders[0] : null;
  }

  function formatLeaderMeta(leader, fallbackText) {
    if (!leader) return fallbackText;
    return `${leader.office || "Escritório"} • ${leader.points || 0} pts • média ${leader.average || 0}`;
  }

  function renderAchievements(payload) {
    const awards = payload?.awards || {};
    const scoreboard = payload?.scoreboard || {};
    const podium = Array.isArray(awards.podium) ? awards.podium : [];
    const liveLeader = podium[0] || getPeriodLeader(scoreboard, "day") || null;
    const dayLeader = getPeriodLeader(scoreboard, "day");
    const weekLeader = getPeriodLeader(scoreboard, "week");
    const monthLeader = getPeriodLeader(scoreboard, "month");

    if (achievementHeadlineEl) {
      achievementHeadlineEl.textContent = liveLeader
        ? `${liveLeader.name} puxa a reunião agora`
        : "Funcionários e escritórios em disputa real";
    }

    if (achievementChaseLineEl) {
      achievementChaseLineEl.textContent =
        awards.chaseLine ||
        "A evolução dos agentes depende de entregas, constância, autonomia e leitura real do ecossistema.";
    }

    if (achievementHourLeaderEl) achievementHourLeaderEl.textContent = liveLeader?.name || "Sem rodada";
    if (achievementHourMetaEl) {
      achievementHourMetaEl.textContent = liveLeader
        ? `${liveLeader.office || "Escritório"} • ${liveLeader.points || 0} pts • ${liveLeader.awards?.length || 0} awards`
        : "Mais pontos na rodada atual.";
    }

    if (achievementDayLeaderEl) achievementDayLeaderEl.textContent = dayLeader?.name || "Sem líder";
    if (achievementDayMetaEl) {
      achievementDayMetaEl.textContent = formatLeaderMeta(dayLeader, "Corrida diária de pontos e awards.");
    }

    if (achievementWeekLeaderEl) achievementWeekLeaderEl.textContent = weekLeader?.name || "Sem líder";
    if (achievementWeekMetaEl) {
      achievementWeekMetaEl.textContent = formatLeaderMeta(weekLeader, "Acúmulo semanal e consistência.");
    }

    if (achievementMonthLeaderEl) achievementMonthLeaderEl.textContent = monthLeader?.name || "Sem líder";
    if (achievementMonthMetaEl) {
      achievementMonthMetaEl.textContent = formatLeaderMeta(monthLeader, "Quem sustenta a liderança mais longa.");
    }
  }

  function renderOpinions(payload) {
    const opinions = normalizeOpinions(payload.opinions, payload.meeting?.lastInstruction || "o assunto da reunião");
    if (!opinions.length) {
      opinionsEl.innerHTML = '<p class="opinion-body">Nenhuma opinião registrada ainda.</p>';
      return;
    }

    opinionsEl.innerHTML = opinions
      .map(
        (item, index) => {
          const context = enrichAgentContext(item);
          return `
          <article class="opinion-item" data-opinion-index="${index}">
            <div class="opinion-id">
              <div class="opinion-avatar-window" aria-hidden="true">
                ${renderAgentPhotoToken(item)}
                ${renderAgentSprite(item, { large: true })}
              </div>
              <strong>${escapeHtml(context.name)}</strong>
              <span>${escapeHtml(context.office)} • ${escapeHtml(context.role)} • ${escapeHtml(context.score)}%</span>
            </div>
            <div class="opinion-context-window">
              <p class="opinion-body">${escapeHtml(item.opinion)}</p>
              <div class="idea-context-grid">
                <span>Neural ${escapeHtml(context.neural)}%</span>
                <span>Objetivo: ${escapeHtml(context.intent).slice(0, 90)}</span>
                <span>Ação: ${escapeHtml(context.action).slice(0, 90)}</span>
              </div>
              <div class="speech-actions compact">
                <button type="button" data-list-idea-action="approve" data-index="${index}">Aprovar</button>
                <button type="button" data-list-idea-action="variation" data-index="${index}">Pedir ajuste</button>
                <button type="button" data-list-idea-action="task" data-index="${index}">Criar tarefa</button>
              </div>
            </div>
          </article>
        `;
        }
      )
      .join("");
    setSpeakerQueue(opinions, false);
  }

  function addMeetingLog(entry) {
    const now = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    meetingLogs.unshift({
      time: now,
      ...entry
    });
    meetingLogs = meetingLogs.slice(0, 24);
    renderMeetingLogs();
  }

  function buildFallbackPrompts(active) {
    const name = getAgentDisplayName(active);
    const office = getAgentOffice(active);
    const assignment = active?.assignment || {};
    const subject = active?.opinion || active?.intent || "ideia da reunião";
    return [
      {
        type: "prompt",
        title: `Prompt alternativo para ${name}`,
        text: `Refine a proposta de ${office} em passos claros, entregáveis e critério de aceite. Base: ${subject.slice(0, 140)}.`
      },
      {
        type: "task",
        title: `Quebrar execução de ${name}`,
        text: `Separar a ação "${assignment.action || "ação sugerida"}" em diagnóstico, patch e validação visual.`
      },
      {
        type: "prompt",
        title: "Escalar para outro agente",
        text: `Se ${name} não concluir, gerar prompt de handoff com contexto neural, risco, arquivo provável e próximo dono.`
      }
    ];
  }

  function buildExecutionPacket(active, mode = "implement") {
    const name = getAgentDisplayName(active);
    const office = getAgentOffice(active);
    const assignment = active?.assignment || {};
    const intent = active?.intent || active?.autonomy?.intent || "executar a proposta";
    const action = assignment.action || active?.action || `executar a ideia de ${name}`;
    const source = active?.opinion || assignment.idea || "sem contexto adicional";
    const howTo = [
      `1. Ler o contexto do agente ${name} em ${office} e confirmar o objetivo: ${intent}.`,
      `2. Abrir o ponto principal da ação: ${action}.`,
      `3. Quebrar a mudança em diagnóstico, alteração e validação visível antes de fechar.`,
      `4. Registrar o que foi feito, o que faltou e a próxima checagem.`
    ].join("\n");
    const prompt = [
      `Implemente esta solicitação no projeto atual.`,
      `Agente de origem: ${name} (${office}, ${active?.role || "agente"}).`,
      `Objetivo neural: ${intent}.`,
      `Ação principal: ${action}.`,
      `Contexto da ideia: ${source}.`,
      `Entregue:`,
      `- a alteração necessária`,
      `- os arquivos prováveis`,
      `- os riscos`,
      `- como validar no navegador`
    ].join("\n");
    return {
      title: mode === "prompt" ? `Prompt pronto de ${name}` : `Plano de execução de ${name}`,
      text: action,
      howTo,
      prompt
    };
  }

  function enqueueTask(item) {
    taskQueue.unshift(item);
    taskQueue = taskQueue.slice(0, 16);
    renderTaskQueue();
    applyAudienceStates();
  }

  function renderTaskQueue() {
    if (!taskQueueList) return;
    if (!taskQueue.length) {
      taskQueueList.innerHTML = '<p class="opinion-body">Quando você aprovar, variar ou escalar uma ideia, a fila aparece aqui.</p>';
      return;
    }
    taskQueueList.innerHTML = taskQueue
      .map(
        (item) => `
          <article class="task-queue-item ${item.state ? `is-${escapeHtml(item.state)}` : ""}">
            <span>${escapeHtml(item.kindLabel || "fila")} • ${escapeHtml(item.agent || "Cheffe Call")}</span>
            <strong>${escapeHtml(item.title || "Tarefa em andamento")}</strong>
            <p>${escapeHtml(item.text || "")}</p>
            ${item.howTo ? `<pre class="task-queue-block">${escapeHtml(item.howTo)}</pre>` : ""}
            ${item.prompt ? `<pre class="task-queue-block is-prompt">${escapeHtml(item.prompt)}</pre>` : ""}
          </article>
        `
      )
      .join("");
  }

  function moveToNextSpeaker(kindLabel = "próxima fala") {
    if (!currentOpinions.length) return;
    activeSpeakerIndex = (activeSpeakerIndex + 1) % currentOpinions.length;
    const active = currentOpinions[activeSpeakerIndex];
    raisedHandName = getAgentDisplayName(active);
    refreshRaisedHandQueue();
    applyAudienceStates();
    showActiveSpeaker();
    addMeetingLog({
      kindLabel,
      agent: getAgentDisplayName(active),
      text: active?.opinion || ""
    });
    setStatus(`${getAgentDisplayName(active)} levantou a mão e assumiu a próxima fala.`, "ok");
    window.setTimeout(() => {
      if (raisedHandName === getAgentDisplayName(active)) {
        raisedHandName = "";
        refreshRaisedHandQueue();
        applyAudienceStates();
      }
    }, 1600);
  }

  function renderMeetingLogs() {
    if (!meetingLogList) return;
    if (!meetingLogs.length) {
      meetingLogList.innerHTML = '<p class="opinion-body">As falas aprovadas e comandos aparecem aqui.</p>';
      return;
    }
    meetingLogList.innerHTML = meetingLogs
      .map(
        (item) => `
          <article class="meeting-log-item ${item.kind === "good" ? "is-good" : ""}">
            <span>${escapeHtml(item.time)} • ${escapeHtml(item.kindLabel || "fala")}</span>
            <strong>${escapeHtml(item.agent || "Cheffe Call")}</strong>
            <p>${escapeHtml(item.text || "")}</p>
          </article>
        `
      )
      .join("");
  }

  function hydrateMeetingArtifacts(payload) {
    const session = payload?.meeting?.currentSession || payload?.meeting?.sessions?.[0] || null;
    currentMeetingSessionId = session?.id || "";

    if (Array.isArray(session?.logs)) {
      meetingLogs = session.logs.map((item) => ({
        time: item.time || String(item.createdAt || "").slice(11, 16) || "--:--",
        kind: item.kind || "",
        kindLabel: item.kindLabel || "fala",
        agent: item.agent || "Cheffe Call",
        text: item.text || ""
      }));
      renderMeetingLogs();
    }

    if (Array.isArray(session?.decisions)) {
      taskQueue = session.decisions.map((item) => ({
        state: item.state || "",
        kindLabel: item.kindLabel || "fila",
        agent: item.agent || "Cheffe Call",
        title: item.title || "Ação da Cheffe Call",
        text: item.text || "",
        howTo: item.howTo || "",
        prompt: item.prompt || ""
      }));
      renderTaskQueue();
      applyAudienceStates();
    }
  }

  function setSpeakerQueue(opinions, reset = true) {
    currentOpinions = Array.isArray(opinions) && opinions.length ? opinions : [];
    if (reset) activeSpeakerIndex = 0;
    refreshRaisedHandQueue();
    showActiveSpeaker();
  }

  function showActiveSpeaker() {
    const active = currentOpinions[activeSpeakerIndex % Math.max(1, currentOpinions.length)];
    if (!active) return;
    const activeName = getAgentDisplayName(active);
    audienceEl?.querySelectorAll(".seat-agent").forEach((seat) => {
      seat.classList.toggle("is-speaking", seat.dataset.agentName === activeName);
    });
    applyAudienceStates();
    if (speechBubbleEl) {
      speechBubbleEl.innerHTML = `
        <div class="active-speaker-card">
          <div class="active-speaker-avatar" aria-hidden="true">
            ${renderAgentPhotoToken(active)}
            ${renderAgentSprite(active, { large: true })}
          </div>
          <div>
            <span>${escapeHtml(getAgentOffice(active))} • ${escapeHtml(active.role || "agente")} • ${escapeHtml(active.score || 0)}%</span>
            <strong>${escapeHtml(activeName)}</strong>
            <p>${escapeHtml(active.opinion || "Aguardando fala.")}</p>
            <div class="speech-actions">
              <button type="button" data-idea-action="approve">Aprovar A</button>
              <button type="button" data-idea-action="implement">Implementar I</button>
              <button type="button" data-idea-action="variation">Ajuste V</button>
              <button type="button" data-idea-action="task">Tarefa T</button>
              <button type="button" data-idea-action="terminal">Terminal M</button>
              <button type="button" data-idea-action="file">Ficha F</button>
              <button type="button" data-idea-action="next">Próximo N</button>
            </div>
          </div>
        </div>
      `;
    }
    terminalEl.textContent = [
      "> cheffe-call/speaker",
      `agente: ${activeName}`,
      `escritorio: ${getAgentOffice(active)}`,
      `score: ${active.score || 0}%`,
      `fala: ${active.opinion || "aguardando"}`
    ].join("\n");
  }

  function renderGameState() {
    const active = currentOpinions[activeSpeakerIndex % Math.max(1, currentOpinions.length)] || null;
    const visibleAgents = Array.from(document.querySelectorAll(".seat-agent"))
      .slice(0, 12)
      .map((seat) => ({
        name: seat.dataset.agentName || "",
        speaking: seat.classList.contains("is-speaking"),
        handRaised: seat.classList.contains("is-hand-raised"),
        implementing: seat.classList.contains("is-implementing")
      }));
    const sceneMap = buildSceneMap();
    return JSON.stringify({
      mode: document.body.dataset.hud === "hidden" ? "cinematic" : "hud",
      fullscreen: Boolean(document.fullscreenElement),
      lowerDecksOpen,
      speaker: active ? getAgentDisplayName(active) : "",
      instruction: instructionInput?.value || "",
      command: commandInput?.value || "",
      sessionId: currentMeetingSessionId,
      visibleAgents,
      queueSize: taskQueue.length,
      logs: meetingLogs.length,
      raisedHands: raisedHandQueue,
      theater: {
        seats: visibleAgents.length,
        stage: "south",
        background: "nerd-straight-seats",
        sceneMap
      },
      coords: "screen-space, full meeting theater, stage at south/bottom"
    });
  }

  window.render_game_to_text = renderGameState;
  window.advanceTime = (ms = 16) => {
    const turns = Math.max(1, Math.round(ms / 250));
    for (let index = 0; index < turns; index += 1) {
      if (currentOpinions.length) {
        activeSpeakerIndex = (activeSpeakerIndex + 1) % currentOpinions.length;
      }
    }
    showActiveSpeaker();
    applyAudienceStates();
    return renderGameState();
  };

  async function handleIdeaAction(action) {
    const active = currentOpinions[activeSpeakerIndex];
    if (!active) {
      setStatus("Nenhuma ideia ativa para interagir.", "bad");
      return;
    }
    const agentName = getAgentDisplayName(active);
    const idea = active.opinion || "";
    if (action === "approve") {
      if (await postRoomAction("approve", active)) {
        setStatus(`${agentName} recebeu aprovação formal na Cheffe Call.`, "ok");
        moveToNextSpeaker("próxima fala");
        return;
      }
      const packet = buildExecutionPacket(active, "implement");
      addMeetingLog({ kind: "good", kindLabel: "boa ideia", agent: agentName, text: idea });
      enqueueTask({
        state: "ready",
        kindLabel: "aceita",
        agent: agentName,
        title: packet.title,
        text: packet.text,
        howTo: packet.howTo,
        prompt: packet.prompt
      });
      setStatus(`${agentName} recebeu voto positivo nessa ideia.`, "ok");
      moveToNextSpeaker("próxima fala");
      return;
    }
    if (action === "implement") {
      if (await postRoomAction("implement", active)) {
        setStatus(`${agentName} entrou em execução real pela Cheffe Call.`, "ok");
        moveToNextSpeaker("próxima fala");
        return;
      }
      const implementation = active?.assignment?.action || `Começar a executar a proposta de ${agentName}.`;
      const packet = buildExecutionPacket(active, "implement");
      enqueueTask({
        state: "running",
        kindLabel: "implementando",
        agent: agentName,
        title: `Execução iniciada por ${agentName}`,
        text: implementation,
        howTo: packet.howTo,
        prompt: packet.prompt
      });
      addMeetingLog({
        kind: "good",
        kindLabel: "implementando",
        agent: agentName,
        text: implementation
      });
      terminalEl.textContent = [
        "> cheffe-call/implementation",
        `owner: ${agentName}`,
        `office: ${getAgentOffice(active)}`,
        `action: ${implementation}`,
        "status: execução iniciada pela reunião"
      ].join("\n");
      setStatus(`${agentName} começou a implementar a ideia aprovada.`, "ok");
      moveToNextSpeaker("próxima fala");
      return;
    }
    if (action === "variation") {
      if (await postRoomAction("variation", active, { title: `Pedir alternativa para ${agentName}` })) {
        setStatus(`${agentName} recebeu pedido real de segunda opção.`, "ok");
        return;
      }
      const variation = `${buildOpinionForAgent(active, "variação solicitada", activeSpeakerIndex)} Quero uma segunda opção antes de executar.`;
      active.opinion = variation;
      enqueueTask({
        state: "queued",
        kindLabel: "variação",
        agent: agentName,
        title: `Alternativa pedida para ${agentName}`,
        text: variation
      });
      addMeetingLog({ kindLabel: "variação pedida", agent: agentName, text: variation });
      showActiveSpeaker();
      setStatus(`${agentName} reformulou a ideia em outra direção.`, "ok");
      return;
    }
    if (action === "task") {
      if (await postRoomAction("task", active)) {
        setStatus(`Tarefa real registrada para ${agentName}.`, "ok");
        return;
      }
      const task = `Tarefa criada para ${agentName}: transformar a ideia em entrega revisável, com critério de aceite e próxima ação.`;
      const packet = buildExecutionPacket(active, "implement");
      enqueueTask({
        state: "queued",
        kindLabel: "tarefa",
        agent: agentName,
        title: `Fila de tarefa para ${agentName}`,
        text: task,
        howTo: packet.howTo,
        prompt: packet.prompt
      });
      addMeetingLog({ kindLabel: "tarefa criada", agent: agentName, text: task });
      terminalEl.textContent = [
        "> cheffe-call/task",
        `owner: ${agentName}`,
        `source: ${idea}`,
        "status: aguardando aprovação para execução"
      ].join("\n");
      setStatus(`Ideia de ${agentName} virou tarefa aguardando aprovação.`, "ok");
      return;
    }
    if (action === "terminal") {
      if (await postRoomAction("terminal", active, { title: active?.assignment?.action || idea })) {
        setStatus(`Terminal real recebeu a ordem de ${agentName}.`, "ok");
        return;
      }
      enqueueTask({
        state: "terminal",
        kindLabel: "terminal",
        agent: agentName,
        title: `Prompt enviado ao terminal por ${agentName}`,
        text: active?.assignment?.action || idea
      });
      buildFallbackPrompts(active).forEach((item) => {
        const packet = buildExecutionPacket(active, "prompt");
        enqueueTask({
          state: "fallback",
          kindLabel: item.type === "prompt" ? "prompt alternativo" : "tarefa sugerida",
          agent: agentName,
          title: item.title,
          text: item.text,
          prompt: packet.prompt
        });
      });
      addMeetingLog({ kindLabel: "enviado ao terminal", agent: agentName, text: idea });
      terminalEl.textContent = [
        "> cheffe-call/idea-terminal",
        `agent: ${agentName}`,
        `office: ${getAgentOffice(active)}`,
        `idea: ${idea}`,
        "command: aguardando seu complemento no campo Terminal"
      ].join("\n");
      setStatus(`Ideia de ${agentName} foi enviada ao terminal.`, "ok");
      return;
    }
    if (action === "file") {
      window.location.href = `./real-agents.html?agent=${encodeURIComponent(slugify(agentName))}`;
      return;
    }
    if (action === "next") {
      moveToNextSpeaker("levantou a mão");
    }
  }

  function renderTerminal(payload) {
    const meeting = payload.meeting || {};
    const session = meeting.currentSession || meeting.sessions?.[0] || {};
    const sessionStats = session.actionStats || {};
    const summary = payload.summary || {};
    const daily = payload.dailyContext || {};
    const agent = daily.agentOfDay || {};
    const office = daily.officeOfDay || {};
    const action = daily.actionOfDay || {};
    terminalEl.textContent = [
      "> cheffe-call/status",
      `runtime: ${meeting.active ? "PAUSADA PARA REUNIAO" : "ativa em ciclos de 5 minutos"}`,
      `agentes: ${summary.totalAgents || 0}`,
      `autonomos: ${summary.autonomousAgents || 0}`,
      `media_autonomia: ${summary.averageAutonomy || 0}%`,
      `agente_do_dia: ${agent.name || "aguardando"}`,
      `escritorio_do_dia: ${office.office || "aguardando"}`,
      `acao_do_dia: ${action.action || "aguardando aprovacao"}`,
      `aprovacoes: ${sessionStats.approvals || 0}`,
      `fila_reuniao: ${sessionStats.decisions || 0}`,
      `execucoes: ${sessionStats.running || 0}`,
      `orientacao: ${meeting.lastInstruction || "nenhuma orientacao ativa"}`,
      "protocolo: ouvir -> memorizar -> opinar -> aguardar aprovacao"
    ].join("\n");
    setModeBanner(meeting.active ? "real" : "visual", meeting.active ? "Runtimes pausadas para reunião em andamento" : "Simulação aberta sem senha e sem impacto operacional");
  }

  function renderAdminState(payload) {
    const meeting = payload?.meeting || {};
    const session = meeting.currentSession || meeting.sessions?.[0] || {};
    const summary = payload?.summary || {};
    const agentsReady = Boolean(payload?.agentsReady);
    const logsCount = Array.isArray(session?.logs) ? session.logs.length : 0;
    const decisionsCount = Array.isArray(session?.decisions) ? session.decisions.length : 0;

    if (adminRuntimeStateEl) {
      adminRuntimeStateEl.textContent = meeting.active ? "Runtimes pausadas" : "Runtimes livres";
    }
    if (adminRuntimeMetaEl) {
      adminRuntimeMetaEl.textContent = agentsReady
        ? `${summary.totalAgents || 0} agentes visíveis • autonomia média ${summary.averageAutonomy || 0}%`
        : "Fallback visual ativo até a runtime real publicar a rodada dos agentes.";
    }

    if (adminSessionStateEl) {
      adminSessionStateEl.textContent = session?.status || (meeting.active ? "em reunião" : "sem reunião ativa");
    }
    if (adminSessionMetaEl) {
      adminSessionMetaEl.textContent = meeting.lastInstruction
        ? `Assunto: ${String(meeting.lastInstruction).slice(0, 110)}`
        : "Nenhum assunto operacional registrado ainda.";
    }

    if (adminLastActionStateEl) {
      adminLastActionStateEl.textContent = logsCount ? `${logsCount} logs` : "Sem ações recentes";
    }
    if (adminLastActionMetaEl) {
      adminLastActionMetaEl.textContent = `${decisionsCount} decisões na fila • sessão ${session?.id || "não iniciada"}`;
    }
  }

  function render(payload) {
    latestCallPayload = payload;
    currentRealAgents = extractRealAgents(payload);
    renderAudience(payload.summary?.totalAgents || currentRealAgents.length || 181, [], currentRealAgents);
    renderDaily(payload);
    renderAchievements(payload);
    renderOpinions(payload);
    hydrateMeetingArtifacts(payload);
    renderTerminal(payload);
    renderAdminState(payload);
    setStatus(payload.meeting?.active ? "Cheffe Call ativo. Runtimes pausadas." : "Sala pronta.", "ok");
    if (quickInstructionInput && !quickInstructionInput.matches(":focus")) {
      quickInstructionInput.value = instructionInput?.value || payload.meeting?.lastInstruction || "";
    }
    syncGameShellState();
  }

  function renderLocalMeeting(subject, command) {
    const opinions = currentRealAgents.length
      ? buildOpinionsFromAgents(currentRealAgents, subject || "reunião visual aberta").map((item) => ({
          ...item,
          opinion: `${item.opinion} Terminal: ${(command || "aguardando pedido específico").slice(0, 120)}.`
        }))
      : buildLocalOpinions(subject, command);
    const payload = {
      summary: {
        totalAgents: 181,
        autonomousAgents: 181,
        averageAutonomy: 86
      },
      meeting: {
        active: true,
        lastInstruction: subject || "reunião visual aberta"
      },
      dailyContext: {
        agentOfDay: {
          name: opinions[0].agent,
          office: opinions[0].office,
          score: opinions[0].score,
          intent: "abrir a conversa e organizar prioridade"
        },
        officeOfDay: {
          office: "Cheffe Call",
          agents: 181,
          averageAutonomy: 86,
          averageUrgency: 72
        },
        actionOfDay: {
          title: "Reunião interativa",
          action: command || "Ouvir, opinar, pontuar e aguardar aprovação."
        }
      },
      awards: {
        chaseLine: `${opinions[0].agent} abriu a rodada local. A liderança muda conforme aprovação, execução e constância.`,
        podium: opinions.slice(0, 3).map((item, index) => ({
          rank: index + 1,
          name: item.agent,
          office: item.office,
          points: 120 - index * 14,
          awards: index === 0 ? [{ id: "local-lead" }] : []
        }))
      },
      scoreboard: {
        current: {
          day: {
            leaders: opinions.slice(0, 4).map((item, index) => ({
              rank: index + 1,
              name: item.agent,
              office: item.office,
              points: 320 - index * 33,
              average: 80 - index * 4
            }))
          },
          week: {
            leaders: opinions.slice(1, 5).map((item, index) => ({
              rank: index + 1,
              name: item.agent,
              office: item.office,
              points: 1140 - index * 88,
              average: 83 - index * 3
            }))
          },
          month: {
            leaders: opinions.slice(2, 6).map((item, index) => ({
              rank: index + 1,
              name: item.agent,
              office: item.office,
              points: 4820 - index * 240,
              average: 86 - index * 2
            }))
          }
        }
      },
      queue: currentRealAgents,
      opinions
    };
    theaterEl?.classList.add("is-meeting-live");
    currentRealAgents = opinions;
    renderAudience(181, opinions.slice(0, 1).map((item) => item.agent), currentRealAgents);
    renderDaily(payload);
    renderAchievements(payload);
    renderOpinions(payload);
    setSpeakerQueue(opinions);
    addMeetingLog({
      kindLabel: "reunião aberta",
      agent: "Cheffe Call",
      text: subject || "Reunião visual aberta."
    });
    terminalEl.textContent = [
      "> cheffe-call/visual-meeting",
      "modo: reunião interativa local",
      "senha: não exigida para ouvir opiniões visuais",
      `assunto: ${subject || "sem assunto informado"}`,
      `terminal: ${command || "aguardando pedido específico ou código"}`,
      "protocolo: ouvir -> comparar opiniões -> pedir execução específica -> aprovar"
    ].join("\n");
    setModeBanner("visual", "Simulação local em andamento sem pausar runtimes reais");
    setStatus("Reunião visual aberta. Agentes levantaram a mão e responderam.", "ok");
  }

  async function loadCall() {
    const [callResult, realResult] = await Promise.allSettled([
      fetch("/api/cheffe-call", { headers: { Accept: "application/json" } }),
      fetch("/api/real-agents", { headers: { Accept: "application/json" } })
    ]);
    if (callResult.status !== "fulfilled") throw new Error("Nao foi possivel carregar a Cheffe Call.");

    const callPayload = await callResult.value.json();
    if (!callResult.value.ok || !callPayload.ok) throw new Error(callPayload.error || "Nao foi possivel carregar a Cheffe Call.");

    let realPayload = null;
    if (realResult.status === "fulfilled" && realResult.value.ok) {
      realPayload = await realResult.value.json();
    }
    render(mergeCheffeAndRealPayload(callPayload, realPayload));
  }

  async function postCall(path, body) {
    const response = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body)
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) throw new Error(payload.error || "Falha na Cheffe Call.");
    render(payload);
    return payload;
  }

  async function postRoomAction(action, active, extras = {}) {
    const password = getAdminPassword();
    if (!password) return false;
    const packet = active ? buildExecutionPacket(active, action === "terminal" ? "prompt" : "implement") : null;
    await postCall("/api/cheffe-call/action", {
      password,
      action,
      sessionId: currentMeetingSessionId,
      instruction: instructionInput?.value || "",
      command: commandInput?.value || "",
      agent: active ? getAgentDisplayName(active) : "Cheffe Call",
      office: active ? getAgentOffice(active) : "Sistema",
      role: active?.role || "",
      title: extras.title || active?.assignment?.action || active?.action || active?.opinion || "Ação da reunião",
      opinion: active?.opinion || "",
      howTo: extras.howTo || packet?.howTo || "",
      prompt: extras.prompt || packet?.prompt || "",
      ...extras
    });
    return true;
  }

  formEl?.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(formEl);
    const password = String(form.get("password") || "").trim();
    const instruction = String(form.get("instruction") || "").trim();
    const command = String(form.get("command") || "").trim();
    if (!password) {
      renderLocalMeeting(instruction, command);
      return;
    }
    setStatus("Abrindo Cheffe Call...");
    postCall("/api/cheffe-call/start", { password, instruction }).catch((error) => setStatus(error.message, "bad"));
  });

  commandBarEl?.addEventListener("submit", (event) => {
    event.preventDefault();
    const quickInstruction = String(quickInstructionInput?.value || "").trim();
    if (!quickInstruction) {
      setStatus("Digite uma ordem rápida antes de enviar.", "bad");
      return;
    }
    if (instructionInput) instructionInput.value = quickInstruction;
    renderLocalMeeting(quickInstruction, String(commandInput?.value || "").trim());
  });

  sendTerminalEl?.addEventListener("click", () => {
    const form = new FormData(formEl);
    const instruction = String(form.get("instruction") || "").trim();
    const command = String(form.get("command") || "").trim();
    if (!instruction && !command) {
      setStatus("Digite o assunto ou cole um pedido/código antes de enviar ao terminal.", "bad");
      return;
    }
    renderLocalMeeting(instruction || "pedido direto ao terminal", command);
    terminalEl.textContent += "\nacao: pedido enviado ao terminal visual dos agentes";
    addMeetingLog({
      kindLabel: "comando terminal",
      agent: "Você",
      text: command || instruction
    });
  });

  nextSpeakerEl?.addEventListener("click", () => {
    if (!currentOpinions.length) {
      setStatus("Envie uma mensagem aos agentes antes de chamar o próximo.", "bad");
      return;
    }
    moveToNextSpeaker("levantou a mão");
  });

  markGoodIdeaEl?.addEventListener("click", () => {
    const active = currentOpinions[activeSpeakerIndex];
    if (!active) {
      setStatus("Nenhuma fala ativa para marcar como boa ideia.", "bad");
      return;
    }
    addMeetingLog({
      kind: "good",
      kindLabel: "boa ideia",
      agent: getAgentDisplayName(active),
      text: active.opinion
    });
    setStatus(`${getAgentDisplayName(active)} ganhou sinal positivo nessa rodada.`, "ok");
  });

  speechBubbleEl?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-idea-action]");
    if (!button) {
      speechBubbleEl.classList.toggle("is-expanded");
      return;
    }
    handleIdeaAction(button.dataset.ideaAction).catch((error) => setStatus(error.message, "bad"));
  });

  opinionsEl?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-list-idea-action]");
    if (!button) return;
    const index = Number(button.dataset.index || 0);
    if (Number.isFinite(index)) {
      activeSpeakerIndex = index;
      showActiveSpeaker();
      handleIdeaAction(button.dataset.listIdeaAction).catch((error) => setStatus(error.message, "bad"));
    }
  });

  releaseEl?.addEventListener("click", () => {
    const password = String(new FormData(formEl).get("password") || "").trim();
    if (!password) {
      setStatus("Digite a senha Full Admin para liberar as runtimes.", "bad");
      return;
    }
    setStatus("Liberando runtimes...");
    postCall("/api/cheffe-call/release", { password }).catch((error) => setStatus(error.message, "bad"));
  });

  voteAgentOfDay?.addEventListener("click", () => {
    if (!currentAgentOfDay) return;
    const votes = addAgentVote(currentAgentOfDay);
    setStatus(`${currentAgentOfDay.name || currentAgentOfDay.agent} recebeu seu voto no avatar. Total local: ${votes}.`, "ok");
    renderDaily({
      dailyContext: {
        agentOfDay: currentAgentOfDay,
        officeOfDay: { office: officeOfDayEl?.textContent || "", agents: 181, averageAutonomy: 86, averageUrgency: 72 },
        actionOfDay: { title: actionOfDayEl?.textContent || "", action: actionOfDayMetaEl?.textContent || "" }
      }
    });
  });

  openAgentFile?.addEventListener("click", () => {
    const name = currentAgentOfDay?.name || currentAgentOfDay?.agent || "";
    window.location.href = `./real-agents.html?agent=${encodeURIComponent(slugify(name))}`;
  });

  fullscreenToggleEl?.addEventListener("click", () => {
    toggleFullscreen();
  });

  hudToggleEl?.addEventListener("click", () => {
    toggleHudVisibility();
  });

  lowerDecksToggleEl?.addEventListener("click", () => {
    toggleLowerDecksVisibility();
  });

  focusCommandDetails?.addEventListener("click", () => {
    instructionInput?.focus();
    toggleHudVisibility();
    document.body.dataset.hud = "visible";
    syncGameShellState();
  });

  quickNextSpeaker?.addEventListener("click", () => {
    moveToNextSpeaker("atalho command bar");
  });

  quickOpenDecks?.addEventListener("click", () => {
    toggleLowerDecksVisibility();
  });

  quickRefreshAgents?.addEventListener("click", () => {
    postRoomAction("refresh", null).catch((error) => setStatus(error.message, "bad"));
  });

  adminRunAgentsNow?.addEventListener("click", () => {
    const password = getAdminPassword();
    if (!password) {
      setStatus("Digite a senha Full Admin para rodar os agentes reais.", "bad");
      return;
    }
    setStatus("Rodando agentes reais...");
    fetch("/api/real-agents/run", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        password,
        message: instructionInput?.value || "Rodada manual disparada pela Cheffe Call."
      })
    })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok || !payload.ok) throw new Error(payload.error || "Falha ao rodar agentes.");
        return loadCall();
      })
      .then(() => setStatus("Rodada manual dos agentes concluída e sala atualizada.", "ok"))
      .catch((error) => setStatus(error.message, "bad"));
  });

  adminReleaseRoom?.addEventListener("click", () => {
    const password = getAdminPassword();
    if (!password) {
      setStatus("Digite a senha Full Admin para encerrar a reunião.", "bad");
      return;
    }
    setStatus("Encerrando reunião real...");
    postCall("/api/cheffe-call/release", { password }).catch((error) => setStatus(error.message, "bad"));
  });

  adminClearSession?.addEventListener("click", () => {
    const password = getAdminPassword();
    if (!password) {
      setStatus("Digite a senha Full Admin para limpar a sessão.", "bad");
      return;
    }
    setStatus("Limpando sessão atual...");
    postCall("/api/cheffe-call/admin/clear", { password, sessionId: currentMeetingSessionId }).catch((error) =>
      setStatus(error.message, "bad")
    );
  });

  adminExportSnapshot?.addEventListener("click", async () => {
    try {
      if (!latestCallPayload) throw new Error("Ainda não há snapshot carregado.");
      const snapshot = JSON.stringify(latestCallPayload, null, 2);
      const copied = await copyText(snapshot);
      if (!copied) throw new Error("Não foi possível copiar o snapshot para a área de transferência.");
      setStatus("Snapshot da Cheffe Call copiado.", "ok");
    } catch (error) {
      setStatus(error.message, "bad");
    }
  });

  adminOpenRealAgents?.addEventListener("click", () => {
    window.location.href = "./real-agents.html";
  });

  promptModeSelect?.addEventListener("change", () => {
    const mode = promptModeSelect.value || "global";
    if (mode === "global") {
      if (promptOfficeSelect) promptOfficeSelect.value = "";
      if (promptAgentSelect) promptAgentSelect.value = "";
    }
    if (mode === "office" && promptAgentSelect) {
      promptAgentSelect.value = "";
    }
    if (mode === "agent" && !promptOfficeSelect?.value && promptConsoleData?.agents?.[0]?.office && promptOfficeSelect) {
      promptOfficeSelect.value = promptConsoleData.agents[0].office;
      refreshPromptAgentOptions(promptOfficeSelect.value);
    }
    selectPromptPayload();
  });

  promptOfficeSelect?.addEventListener("change", () => {
    refreshPromptAgentOptions(promptOfficeSelect.value || "");
    if (promptModeSelect?.value === "agent" && promptAgentSelect) {
      promptAgentSelect.value = "";
    }
    if (promptModeSelect && promptModeSelect.value === "global") {
      promptModeSelect.value = "office";
    }
    selectPromptPayload();
  });

  promptAgentSelect?.addEventListener("change", () => {
    if (promptAgentSelect?.value && promptModeSelect) {
      promptModeSelect.value = "agent";
      const agentPrompt = (promptConsoleData?.agents || []).find((item) => item.slug === promptAgentSelect.value);
      if (agentPrompt && promptOfficeSelect) {
        promptOfficeSelect.value = agentPrompt.office || "";
        refreshPromptAgentOptions(promptOfficeSelect.value);
        promptAgentSelect.value = agentPrompt.slug;
      }
    }
    selectPromptPayload();
  });

  loadPromptToInstruction?.addEventListener("click", () => {
    if (!instructionInput) return;
    instructionInput.value = activePromptPayload.text || "";
    instructionInput.focus();
    setStatus("Prompt carregado no assunto da reunião.", "ok");
  });

  loadPromptToTerminal?.addEventListener("click", () => {
    if (!commandInput) return;
    commandInput.value = activePromptPayload.text || "";
    commandInput.focus();
    setStatus("Prompt carregado no terminal da sala.", "ok");
  });

  copyPromptText?.addEventListener("click", async () => {
    const copied = await copyText(activePromptPayload.text || "");
    setStatus(copied ? "Prompt copiado para a área de transferência." : "Nao foi possivel copiar o prompt.", copied ? "ok" : "bad");
  });

  document.addEventListener("keydown", (event) => {
    const target = event.target;
    if (target instanceof HTMLElement) {
      const tag = target.tagName.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select" || target.isContentEditable) return;
    }
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    const key = event.key.toLowerCase();
    if (key === "f") {
      event.preventDefault();
      toggleFullscreen();
    }
    if (key === "h") {
      event.preventDefault();
      toggleHudVisibility();
    }
    if (key === "l") {
      event.preventDefault();
      toggleLowerDecksVisibility();
    }
    if (key === "c") {
      event.preventDefault();
      quickInstructionInput?.focus();
    }
    if (key === "n") {
      event.preventDefault();
      moveToNextSpeaker("atalho do palco");
    }
    if (key === "a") {
      event.preventDefault();
      handleIdeaAction("approve").catch((error) => setStatus(error.message, "bad"));
    }
    if (key === "i") {
      event.preventDefault();
      handleIdeaAction("implement").catch((error) => setStatus(error.message, "bad"));
    }
    if (key === "t") {
      event.preventDefault();
      handleIdeaAction("task").catch((error) => setStatus(error.message, "bad"));
    }
    if (key === "r") {
      event.preventDefault();
      postRoomAction("refresh", null).catch((error) => setStatus(error.message, "bad"));
    }
    if (event.key === "Escape") {
      toggleLowerDecksVisibility(false);
    }
  });

  document.addEventListener("fullscreenchange", () => {
    if (fullscreenToggleEl) {
      fullscreenToggleEl.textContent = document.fullscreenElement ? "Sair da tela" : "Tela cheia";
    }
  });

  document.body.dataset.hud = "visible";
  syncGameShellState();

  initPromptConsole();
  loadCall().catch((error) => setStatus(error.message, "bad"));
  renderMeetingLogs();
  renderTaskQueue();
  window.setInterval(() => loadCall().catch((error) => setStatus(error.message, "bad")), 60 * 1000);
})();
