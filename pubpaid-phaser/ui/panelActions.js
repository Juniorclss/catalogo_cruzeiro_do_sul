import { TABLE_COPY } from "../config/gameConfig.js";
import { NERD_TEAM, formatNerdAgent } from "../config/nerdTeam.js";
import { gameState, updateGameState, updatePanel } from "../core/gameState.js";
import { joinPubpaidPvpQueue, leavePubpaidPvpQueue } from "../services/accountService.js";
import { fetchPvpState, moveCheckers, throwDarts } from "../services/pvpService.js";

export function openPanel(content) {
  updatePanel({
    open: true,
    kicker: content.kicker,
    title: content.title,
    body: content.body,
    chips: content.chips || [],
    view: content.view || null,
    actions: content.actions || []
  });
}

export function closePanel() {
  updatePanel({
    open: false,
    kicker: "interação",
    title: "Ponto do jogo",
    body: "",
    chips: [],
    view: null,
    actions: []
  });
}

export function setSelectedTable(tableId) {
  updateGameState({
    selectedTable: tableId,
    prompt: TABLE_COPY[tableId] || TABLE_COPY.darts
  });
}

function getPlayerLabel(match, seat) {
  if (!match) return "Jogador";
  const player = seat === "playerTwo" ? match.playerTwo : match.playerOne;
  return player?.name || (seat === "playerTwo" ? "Jogador 2" : "Jogador 1");
}

function getRivalLabel(match, seat) {
  if (!match) return "Rival";
  const rival = seat === "playerTwo" ? match.playerOne : match.playerTwo;
  return rival?.name || (seat === "playerTwo" ? "Jogador 1" : "Jogador 2");
}

function formatMatchBody(match, seat, state) {
  if (!match) {
    return "Entre em uma fila real para abrir a mesa. O saldo fica travado no escrow ate a partida terminar ou a fila ser cancelada.";
  }
  const stake = Number(match.stake || 0);
  const pot = stake * 2;
  const turnLabel = match.turn === seat ? "sua vez" : `vez de ${getRivalLabel(match, seat)}`;
  const deadline = match.deadlineAt ? ` Prazo de reconexao: ${new Date(match.deadlineAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}.` : "";
  if (state === "finished") {
    const payout = match?.settlement?.payout ?? (match.winner ? pot * 0.8 : stake);
    const result = match.winner
      ? match.winner === seat
        ? `Voce venceu e recebe ${payout} creditos.`
        : `${getRivalLabel(match, seat)} venceu.`
      : `Empate: ${stake} creditos voltam para cada jogador.`;
    return `${match.resultSummary || "Partida encerrada."} ${result}`;
  }
  if (state === "abandoned") {
    return `${match.resultSummary || "Mesa em reconexao."}${deadline}`;
  }
  return `${getPlayerLabel(match, seat)} contra ${getRivalLabel(match, seat)}. Entrada ${stake}, pote ${pot}, casa 20%. Agora: ${turnLabel}. ${match.resultSummary || ""}`;
}

function buildSettlementView(match, seat) {
  if (!match || !["finished", "abandoned"].includes(match.state)) return null;
  const stake = Number(match.stake || 0);
  const payout = Number(match?.settlement?.payout ?? (match.winner ? stake * 1.6 : stake));
  const houseFee = Number(match?.settlement?.houseFee ?? (match.winner ? stake * 0.4 : 0));
  const tone = match.winner
    ? match.winner === seat
      ? "win"
      : "loss"
    : "draw";
  return {
    tone,
    headline: tone === "win" ? "Vitoria confirmada" : tone === "loss" ? "Derrota confirmada" : "Empate auditado",
    detail:
      tone === "win"
        ? `Voce recebe ${payout} creditos e a casa segura ${houseFee}.`
        : tone === "loss"
          ? `${getRivalLabel(match, seat)} levou ${payout} creditos.`
          : `Entrada devolvida: ${stake} para cada lado.`,
    payout,
    houseFee,
    pot: stake * 2
  };
}

function openPvpPanel(payload = {}) {
  const state = payload.state || gameState.pvpStatus || "idle";
  const gameId = payload.gameId || gameState.pvpGameId || gameState.selectedTable || "darts";
  const match = payload.match || gameState.pvpMatch || null;
  const queue = payload.queue || gameState.pvpQueue || null;
  const seat = payload.seat || gameState.pvpSeat || "";
  const isDarts = gameId === "darts";
  const isCheckers = gameId === "checkers";
  const actions = [];

  if (state === "waiting") {
    actions.push({ id: "refresh-pvp", label: "Atualizar fila", primary: true });
    actions.push({ id: "leave-pvp", label: "Cancelar fila" });
  } else if (state === "active" && match) {
    actions.push({ id: "refresh-pvp", label: "Atualizar mesa" });
    if (match.turn === seat && isDarts) {
      actions.push({ id: "pvp-darts-50-50", label: "Mira bull", primary: true });
      actions.push({ id: "pvp-darts-50-18", label: "Triplo 20" });
      actions.push({ id: "pvp-darts-78-34", label: "Lateral direita" });
      actions.push({ id: "pvp-darts-30-62", label: "Baixo esquerdo" });
    }
    if (match.turn === seat && isCheckers) {
      const legalMoves = getLegalCheckersMoves(match.board || [], seat).slice(0, 6);
      legalMoves.forEach((move, index) => {
        actions.push({
          id: `pvp-checkers-move-${encodeCheckersMove(move)}`,
          label: `${formatSquare(move.from.row, move.from.col)}-${formatSquare(move.to.row, move.to.col)}`,
          primary: index === 0
        });
      });
      if (!legalMoves.length) {
        actions.push({ id: "refresh-pvp", label: "Sem jogada, atualizar", primary: true });
      }
    }
    actions.push({ id: "leave-pvp", label: "Sair da mesa" });
  } else if (state === "abandoned") {
    actions.push({ id: `join-${isCheckers ? "checkers" : "darts"}-pvp`, label: "Reconectar", primary: true });
    actions.push({ id: "refresh-pvp", label: "Atualizar" });
  } else {
    actions.push({ id: `join-${isCheckers ? "checkers" : "darts"}-pvp`, label: `Entrar em ${isCheckers ? "Dama" : "Dardos"}`, primary: true });
  }

  openPanel({
    kicker: state === "waiting" ? "fila real" : state === "active" ? "mesa real" : "pvp",
    title: isCheckers ? "Dama PvP" : "Dardos PvP",
    body:
      state === "waiting"
        ? `Fila aberta para ${isCheckers ? "Dama" : "Dardos"} com ${queue?.stake || 10} creditos travados no escrow. Aguardando rival.`
        : formatMatchBody(match, seat, state),
    chips: [
      `estado: ${state}`,
      `jogo: ${isCheckers ? "dama" : "dardos"}`,
      `assento: ${seat || "-"}`,
      `mesa: ${match?.id || queue?.id || "-"}`
    ],
    view: buildPvpView({ gameId, state, match, seat }),
    actions
  });
}

function buildPvpView({ gameId, state, match, seat }) {
  const settlement = buildSettlementView(match, seat);
  if (state === "waiting") {
    return {
      type: "queue",
      stake: match?.stake || gameState.pvpQueue?.stake || 10,
      label: gameId === "checkers" ? "mesa de dama procurando jogador" : "alvo de dardos procurando jogador"
    };
  }
  if (gameId === "darts") {
    const darts = match?.dartsState || {};
    return {
      type: "darts",
      state,
      seat,
      round: darts.round || 1,
      maxRounds: darts.maxRounds || 3,
      playerOneScore: darts.playerOneScore || 0,
      playerTwoScore: darts.playerTwoScore || 0,
      playerOneThrow: darts.lastPlayerOne || darts.playerOneThrow || null,
      playerTwoThrow: darts.lastPlayerTwo || darts.playerTwoThrow || null,
      history: darts.history || [],
      settlement
    };
  }
  if (gameId === "checkers") {
    const board = Array.isArray(match?.board) ? match.board : [];
    return {
      type: "checkers",
      state,
      seat,
      turn: match?.turn || "",
      board,
      legalMoves: match?.turn === seat ? getLegalCheckersMoves(board, seat).slice(0, 6) : [],
      settlement
    };
  }
  return null;
}

function getCheckersOwner(piece = "") {
  if (!piece) return "";
  return piece.toLowerCase() === "p" ? "playerOne" : "playerTwo";
}

function getCheckersDirections(piece = "") {
  if (!piece) return [];
  if (piece === piece.toUpperCase()) return [[-1, -1], [-1, 1], [1, -1], [1, 1]];
  return piece.toLowerCase() === "p" ? [[-1, -1], [-1, 1]] : [[1, -1], [1, 1]];
}

function getAutoCheckersMove(board = [], owner = "playerOne") {
  const moves = [];
  for (let row = 0; row < 8; row += 1) {
    for (let col = 0; col < 8; col += 1) {
      const piece = board?.[row]?.[col];
      if (getCheckersOwner(piece) !== owner) continue;
      const enemy = owner === "playerOne" ? "playerTwo" : "playerOne";
      getCheckersDirections(piece).forEach(([rowStep, colStep]) => {
        const nextRow = row + rowStep;
        const nextCol = col + colStep;
        if (!board?.[nextRow] || nextCol < 0 || nextCol > 7) return;
        if (!board[nextRow][nextCol]) {
          moves.push({ from: { row, col }, to: { row: nextRow, col: nextCol }, capture: null });
          return;
        }
        const jumpRow = nextRow + rowStep;
        const jumpCol = nextCol + colStep;
        if (
          getCheckersOwner(board[nextRow][nextCol]) === enemy &&
          board?.[jumpRow] &&
          jumpCol >= 0 &&
          jumpCol <= 7 &&
          !board[jumpRow][jumpCol]
        ) {
          moves.unshift({
            from: { row, col },
            to: { row: jumpRow, col: jumpCol },
            capture: { row: nextRow, col: nextCol }
          });
        }
      });
    }
  }
  return moves[0] || null;
}

function getLegalCheckersMoves(board = [], owner = "playerOne") {
  const moves = [];
  for (let row = 0; row < 8; row += 1) {
    for (let col = 0; col < 8; col += 1) {
      const piece = board?.[row]?.[col];
      if (getCheckersOwner(piece) !== owner) continue;
      const enemy = owner === "playerOne" ? "playerTwo" : "playerOne";
      getCheckersDirections(piece).forEach(([rowStep, colStep]) => {
        const nextRow = row + rowStep;
        const nextCol = col + colStep;
        if (!board?.[nextRow] || nextCol < 0 || nextCol > 7) return;
        if (!board[nextRow][nextCol]) {
          moves.push({ from: { row, col }, to: { row: nextRow, col: nextCol }, capture: null });
          return;
        }
        const jumpRow = nextRow + rowStep;
        const jumpCol = nextCol + colStep;
        if (
          getCheckersOwner(board[nextRow][nextCol]) === enemy &&
          board?.[jumpRow] &&
          jumpCol >= 0 &&
          jumpCol <= 7 &&
          !board[jumpRow][jumpCol]
        ) {
          moves.push({
            from: { row, col },
            to: { row: jumpRow, col: jumpCol },
            capture: { row: nextRow, col: nextCol }
          });
        }
      });
    }
  }
  const captures = moves.filter((move) => move.capture);
  return captures.length ? captures : moves;
}

function encodeCheckersMove(move) {
  return [
    move?.from?.row ?? 0,
    move?.from?.col ?? 0,
    move?.to?.row ?? 0,
    move?.to?.col ?? 0
  ].join("-");
}

function decodeCheckersMove(encoded = "") {
  const [fromRow, fromCol, toRow, toCol] = String(encoded).split("-").map((item) => Number(item));
  if (![fromRow, fromCol, toRow, toCol].every((item) => Number.isInteger(item))) return null;
  return {
    from: { row: fromRow, col: fromCol },
    to: { row: toRow, col: toCol }
  };
}

function formatSquare(row, col) {
  return `${String.fromCharCode(65 + col)}${row + 1}`;
}

export function runPanelAction(actionId) {
  if (actionId === "close-panel") {
    closePanel();
    return;
  }

  if (actionId === "reset-test") {
    updateGameState({
      testBalance: 100,
      objective: "Escolher uma mesa para testar",
      nerdAgent: formatNerdAgent(NERD_TEAM.hud),
      prompt: "Bartender: 100 créditos de teste recarregados."
    });
    return;
  }

  if (actionId === "suggest-darts") {
    setSelectedTable("darts");
    updateGameState({
      focus: "balcão do bartender",
      objective: "Ir para Dardos",
      nerdAgent: formatNerdAgent(NERD_TEAM.engine),
      prompt: "Bartender: vá de Dardos primeiro. É a melhor leitura de ritmo do núcleo."
    });
    return;
  }

  if (actionId === "toggle-stage-event") {
    updateGameState({
      stageEventActive: !gameState.stageEventActive,
      objective: !gameState.stageEventActive ? "Explorar o salão com evento ativo" : "Escolher outro ponto ativo",
      nerdAgent: formatNerdAgent(NERD_TEAM.sprite),
      prompt: !gameState.stageEventActive
        ? "Evento do palco ativado. O salão ganhou clima de noite grande."
        : "Evento do palco encerrado. O salão voltou ao modo base."
    });
    return;
  }

  if (actionId === "queue-casual") {
    setSelectedTable("checkers");
    updateGameState({
      loungeQueue: "casual",
      objective: "Aguardar mesa casual",
      nerdAgent: formatNerdAgent(NERD_TEAM.engine),
      prompt: "Fila casual aberta na mesa oeste. Dama virou a mesa sugerida."
    });
    return;
  }

  if (actionId === "queue-premium") {
    setSelectedTable("poker");
    updateGameState({
      loungeQueue: "premium",
      objective: "Aguardar mesa premium",
      nerdAgent: formatNerdAgent(NERD_TEAM.qa),
      prompt: "Fila premium aberta na mesa leste. Poker virou a mesa social do momento."
    });
    return;
  }

  if (actionId === "join-darts-pvp" || actionId === "join-checkers-pvp") {
    const gameId = actionId === "join-checkers-pvp" ? "checkers" : "darts";
    setSelectedTable(gameId);
    updateGameState({
      objective: "Travando escrow PvP",
      nerdAgent: formatNerdAgent(NERD_TEAM.engine),
      prompt: `Abrindo fila real de ${gameId === "darts" ? "Dardos" : "Dama"} com 10 créditos.`
    });
    joinPubpaidPvpQueue(gameId, 10).then((payload) => {
      if (!payload?.ok) {
        updateGameState({
          objective: "Depositar antes do PvP",
          nerdAgent: formatNerdAgent(NERD_TEAM.qa),
          prompt: payload?.error || "Saldo real indisponivel para escrow."
        });
        return;
      }
      openPvpPanel(payload);
    });
    return;
  }

  if (actionId === "leave-pvp") {
    const gameId = gameState.pvpGameId || gameState.selectedTable || "darts";
    updateGameState({
      objective: "Saindo da fila PvP",
      prompt: "Cancelando fila ou abandonando mesa ativa."
    });
    leavePubpaidPvpQueue(gameId).then((payload) => {
      if (payload?.ok) openPvpPanel(payload);
    });
    return;
  }

  if (actionId === "refresh-pvp") {
    const gameId = gameState.pvpGameId || gameState.selectedTable || "darts";
    fetchPvpState(gameId).then((payload) => {
      if (payload?.ok) openPvpPanel(payload);
    });
    return;
  }

  if (actionId.startsWith("pvp-darts-")) {
    const [, , aimX = "50", aimY = "50"] = actionId.split("-");
    const aim = {
      x: Number(aimX) || 50,
      y: Number(aimY) || 50
    };
    updateGameState({
      objective: "Arremesso enviado",
      prompt: "Dardo lançado. Aguardando resposta da mesa."
    });
    throwDarts(gameState.pvpMatchId, aim.x, aim.y).then((payload) => {
      if (payload?.ok) {
        openPvpPanel(payload);
      } else {
        updateGameState({ prompt: payload?.error || "Arremesso recusado pela mesa." });
      }
    });
    return;
  }

  if (actionId.startsWith("pvp-checkers-move-")) {
    const move = decodeCheckersMove(actionId.replace("pvp-checkers-move-", ""));
    if (!move) {
      updateGameState({ prompt: "Movimento de Dama inválido no painel." });
      return;
    }
    updateGameState({
      objective: "Movimento enviado",
      prompt: "Movimento de Dama enviado para validacao do servidor."
    });
    moveCheckers(gameState.pvpMatchId, move).then((payload) => {
      if (payload?.ok) {
        openPvpPanel(payload);
      } else {
        updateGameState({ prompt: payload?.error || "Movimento recusado pela mesa." });
      }
    });
    return;
  }

  if (actionId === "pvp-checkers-auto") {
    const match = gameState.pvpMatch || {};
    const move = getAutoCheckersMove(match.board || [], gameState.pvpSeat || "playerOne");
    if (!move) {
      updateGameState({ prompt: "Nenhuma jogada legal encontrada para sua vez." });
      return;
    }
    updateGameState({
      objective: "Movimento enviado",
      prompt: "Movimento de Dama enviado para validacao do servidor."
    });
    moveCheckers(gameState.pvpMatchId, move).then((payload) => {
      if (payload?.ok) {
        openPvpPanel(payload);
      } else {
        updateGameState({ prompt: payload?.error || "Movimento recusado pela mesa." });
      }
    });
  }
}
