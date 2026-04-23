import { updateGameState } from "../core/gameState.js";

export async function syncPubpaidAccount() {
  try {
    const response = await fetch("./api/pubpaid/account", {
      method: "GET",
      credentials: "same-origin",
      headers: {
        Accept: "application/json"
      }
    });

    if (!response.ok) {
      return null;
    }

    const payload = await response.json();
    const realBalance = Number(payload?.wallet?.balanceCoins || 0);
    const availableBalance = Number(payload?.wallet?.availableCoins ?? realBalance);
    const lockedMatchBalance = Number(payload?.wallet?.lockedMatchCoins || 0);
    const lockedWithdrawalBalance = Number(payload?.wallet?.lockedWithdrawalCoins || 0);
    updateGameState({
      realBalance: Number.isFinite(realBalance) ? realBalance : 0,
      availableBalance: Number.isFinite(availableBalance) ? availableBalance : 0,
      lockedMatchBalance: Number.isFinite(lockedMatchBalance) ? lockedMatchBalance : 0,
      lockedWithdrawalBalance: Number.isFinite(lockedWithdrawalBalance) ? lockedWithdrawalBalance : 0
    });
    return payload;
  } catch (_error) {
    return null;
  }
}

export async function joinPubpaidPvpQueue(gameId = "darts", stake = 10) {
  try {
    const response = await fetch("./api/pubpaid/pvp/join", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ gameId, stake })
    });
    const payload = await response.json().catch(() => null);
    if (!response.ok || !payload?.ok) {
      return {
        ok: false,
        error: payload?.error || "Nao foi possivel entrar na fila PvP."
      };
    }
    updateGameState({
      pvpStatus: payload.state || "idle",
      pvpGameId: payload.gameId || gameId,
      pvpSeat: payload.seat || "",
      pvpMatchId: payload?.match?.id || "",
      pvpMatch: payload?.match || null,
      pvpQueue: payload?.queue || null,
      objective:
        payload.state === "active"
          ? "Jogar mesa PvP ativa"
          : payload.state === "waiting"
            ? "Aguardar rival PvP"
            : "Escolher mesa PvP",
      prompt:
        payload.state === "active"
          ? `Mesa ${payload.gameId} pareada. Seu assento: ${payload.seat || "jogador"}. Escrow travado.`
          : "Fila PvP aberta. O escrow ficou travado ate parear ou sair."
    });
    await syncPubpaidAccount();
    return payload;
  } catch (_error) {
    return { ok: false, error: "Conexao com o PvP indisponivel agora." };
  }
}

export async function leavePubpaidPvpQueue(gameId = "darts") {
  try {
    const response = await fetch("./api/pubpaid/pvp/leave", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ gameId })
    });
    const payload = await response.json().catch(() => null);
    if (!response.ok || !payload?.ok) {
      return {
        ok: false,
        error: payload?.error || "Nao foi possivel sair da fila PvP."
      };
    }
    updateGameState({
      pvpStatus: payload.state || "idle",
      pvpGameId: payload.gameId || gameId,
      pvpSeat: payload.seat || "",
      pvpMatchId: payload?.match?.id || "",
      pvpMatch: payload?.match || null,
      pvpQueue: payload?.queue || null,
      objective: payload.state === "abandoned" ? "Reconectar antes do prazo" : "Escolher mesa PvP",
      prompt: payload.state === "idle" ? "Fila PvP cancelada. Escrow liberado." : "Estado PvP atualizado."
    });
    await syncPubpaidAccount();
    return payload;
  } catch (_error) {
    return { ok: false, error: "Conexao com o PvP indisponivel agora." };
  }
}
