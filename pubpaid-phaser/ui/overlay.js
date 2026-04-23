import { subscribeGameState } from "../core/gameState.js";
import { runPanelAction } from "../ui/panelActions.js";

const refs = {
  scene: document.querySelector("[data-game-scene]"),
  focus: document.querySelector("[data-game-focus]"),
  mode: document.querySelector("[data-game-mode]"),
  testBalance: document.querySelector("[data-game-test-balance]"),
  realBalance: document.querySelector("[data-game-real-balance]"),
  availableBalance: document.querySelector("[data-game-available-balance]"),
  lockedMatchBalance: document.querySelector("[data-game-locked-match-balance]"),
  pvpStatus: document.querySelector("[data-game-pvp-status]"),
  objective: document.querySelector("[data-game-objective]"),
  nerdAgent: document.querySelector("[data-game-nerd-agent]"),
  prompt: document.querySelector("[data-game-prompt-copy]"),
  panel: document.querySelector("[data-game-panel]"),
  panelKicker: document.querySelector("[data-game-panel-kicker]"),
  panelTitle: document.querySelector("[data-game-panel-title]"),
  panelBody: document.querySelector("[data-game-panel-body]"),
  panelChips: document.querySelector("[data-game-panel-chips]"),
  panelView: document.querySelector("[data-game-panel-view]"),
  panelActions: document.querySelector("[data-game-panel-actions]"),
  accountLabel: document.querySelector("[data-game-account-label]")
};

function renderChips(chips = []) {
  if (!refs.panelChips) return;
  refs.panelChips.innerHTML = "";
  chips.forEach((chip) => {
    const node = document.createElement("span");
    node.textContent = chip;
    refs.panelChips.appendChild(node);
  });
}

function renderActions(actions = []) {
  if (!refs.panelActions) return;
  refs.panelActions.innerHTML = "";
  actions.forEach((action) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = action.label;
    button.dataset.panelAction = action.id;
    if (action.primary) button.classList.add("is-primary");
    refs.panelActions.appendChild(button);
  });
}

function renderDartsView(view) {
  const throwLabel = (entry) => entry ? `${entry.label || "hit"} • ${entry.score || 0}` : "aguardando";
  const history = Array.isArray(view.history) ? view.history.slice(-3) : [];
  const dartPins = [
    { entry: view.playerOneThrow, className: "p1" },
    { entry: view.playerTwoThrow, className: "p2" }
  ]
    .filter((item) => item.entry)
    .map((item) => {
      const x = Math.max(8, Math.min(92, Number(item.entry.x ?? item.entry.aimX ?? 50)));
      const y = Math.max(8, Math.min(92, Number(item.entry.y ?? item.entry.aimY ?? 50)));
      return `<i class="ppg-dart-pin ${item.className}" style="left:${x}%;top:${y}%"></i>`;
    })
    .join("");
  return `
    <div class="ppg-darts-view" aria-label="Mesa de Dardos">
      <div class="ppg-darts-cabinet">
        <div class="ppg-darts-marquee">DARTS</div>
        <div class="ppg-darts-board">
          <span class="ring r1"></span>
          <span class="ring r2"></span>
          <span class="ring r3"></span>
          <span class="bull"></span>
          ${dartPins}
        </div>
      </div>
      <div class="ppg-match-stats">
        <span>rodada ${view.round}/${view.maxRounds}</span>
        <strong>${view.playerOneScore} x ${view.playerTwoScore}</strong>
        <small>P1 ${throwLabel(view.playerOneThrow)}</small>
        <small>P2 ${throwLabel(view.playerTwoThrow)}</small>
        ${history.length ? `<small>histórico ${history.map((round) => `${round.playerOne}-${round.playerTwo}`).join(" / ")}</small>` : ""}
      </div>
    </div>
    ${renderSettlementView(view.settlement)}
  `;
}

function renderCheckersView(view) {
  const board = Array.isArray(view.board) && view.board.length ? view.board : Array.from({ length: 8 }, () => Array(8).fill(""));
  const moveHints = Array.isArray(view.legalMoves) ? view.legalMoves : [];
  const hintKeys = new Set(moveHints.flatMap((move) => [
    `${move?.from?.row}:${move?.from?.col}:from`,
    `${move?.to?.row}:${move?.to?.col}:to`
  ]));
  const cells = board.flatMap((row, rowIndex) =>
    row.map((piece, colIndex) => {
      const dark = (rowIndex + colIndex) % 2 === 1;
      const owner = String(piece || "").toLowerCase() === "p" ? "p1" : String(piece || "").toLowerCase() === "o" ? "p2" : "";
      const king = piece && piece === String(piece).toUpperCase();
      const from = hintKeys.has(`${rowIndex}:${colIndex}:from`);
      const to = hintKeys.has(`${rowIndex}:${colIndex}:to`);
      return `<span class="${dark ? "dark" : "light"}${from ? " move-from" : ""}${to ? " move-to" : ""}" aria-label="linha ${rowIndex + 1}, coluna ${colIndex + 1}">${piece ? `<b class="${owner}${king ? " king" : ""}">${king ? "K" : ""}</b>` : ""}</span>`;
    })
  ).join("");
  return `
    <div class="ppg-checkers-view" aria-label="Mesa de Dama">
      <div class="ppg-checkers-table">
        <div class="ppg-checkers-lamp"></div>
        <div class="ppg-checkers-board">${cells}</div>
      </div>
      <div class="ppg-match-stats">
        <span>turno</span>
        <strong>${view.turn || "-"}</strong>
        <small>voce: ${view.seat || "-"}</small>
      </div>
    </div>
    ${renderSettlementView(view.settlement)}
  `;
}

function renderSettlementView(settlement) {
  if (!settlement) return "";
  return `
    <div class="ppg-result-view is-${settlement.tone || "draw"}" aria-label="Resultado da partida">
      <div class="ppg-result-badge">${settlement.headline}</div>
      <div class="ppg-result-grid">
        <strong>${settlement.detail}</strong>
        <small>pote ${settlement.pot} • casa ${settlement.houseFee}</small>
      </div>
    </div>
  `;
}

function renderPanelView(view) {
  if (!refs.panelView) return;
  refs.panelView.innerHTML = "";
  refs.panelView.hidden = !view;
  if (!view) return;
  if (view.type === "queue") {
    refs.panelView.innerHTML = `
      <div class="ppg-queue-view" aria-label="Fila PvP">
        <div class="ppg-queue-door">
          <span></span><span></span><span></span>
        </div>
        <div class="ppg-match-stats">
          <span>escrow travado</span>
          <strong>${view.stake || 10} créditos</strong>
          <small>${view.label || "aguardando rival"}</small>
        </div>
      </div>
    `;
    return;
  }
  refs.panelView.innerHTML = view.type === "checkers" ? renderCheckersView(view) : renderDartsView(view);
}

export function bindOverlay() {
  refs.panelActions?.addEventListener("click", (event) => {
    const actionButton = event.target.closest("[data-panel-action]");
    if (!actionButton) return;
    runPanelAction(actionButton.dataset.panelAction || "");
  });

  refs.panel?.querySelector("[data-game-panel-close]")?.addEventListener("click", () => {
    runPanelAction("close-panel");
  });

  subscribeGameState((state) => {
    if (refs.scene) refs.scene.textContent = state.currentScene;
    if (refs.focus) refs.focus.textContent = state.focus;
    if (refs.mode) refs.mode.textContent = state.mode;
    if (refs.testBalance) refs.testBalance.textContent = String(state.testBalance);
    if (refs.realBalance) refs.realBalance.textContent = String(state.realBalance);
    if (refs.availableBalance) refs.availableBalance.textContent = String(state.availableBalance);
    if (refs.lockedMatchBalance) refs.lockedMatchBalance.textContent = String(state.lockedMatchBalance);
    if (refs.pvpStatus) {
      refs.pvpStatus.textContent = state.pvpMatchId
        ? `${state.pvpStatus}:${state.pvpGameId}`
        : state.pvpStatus;
    }
    if (refs.objective) refs.objective.textContent = state.objective;
    if (refs.nerdAgent) refs.nerdAgent.textContent = state.nerdAgent;
    if (refs.prompt) refs.prompt.textContent = state.prompt;
    if (refs.accountLabel) {
      refs.accountLabel.textContent =
        state.realBalance > 0
          ? `Carteira: ${state.availableBalance} disponível, ${state.lockedMatchBalance} em mesa e ${state.lockedWithdrawalBalance} em saque.`
          : "Rua e salão já estão organizados em scenes separadas. O próximo salto é ligar tudo à carteira e ao matchmaking real.";
    }
    if (refs.panel) refs.panel.hidden = !state.panel.open;
    if (refs.panelKicker) refs.panelKicker.textContent = state.panel.kicker;
    if (refs.panelTitle) refs.panelTitle.textContent = state.panel.title;
    if (refs.panelBody) refs.panelBody.textContent = state.panel.body;
    renderChips(state.panel.chips);
    renderPanelView(state.panel.view);
    renderActions(state.panel.actions);
  });
}
