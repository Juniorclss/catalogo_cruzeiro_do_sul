import { updateGameState } from "../core/gameState.js";
import { syncPubpaidAccount } from "./accountService.js";

async function requestPvp(path, body = {}) {
  const response = await fetch(path, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok || !payload?.ok) {
    return {
      ok: false,
      error: payload?.error || "A mesa PvP nao respondeu agora."
    };
  }
  syncPvpState(payload);
  await syncPubpaidAccount();
  return payload;
}

export async function fetchPvpState(gameId = "darts") {
  try {
    const response = await fetch(`./api/pubpaid/pvp/state?gameId=${encodeURIComponent(gameId)}`, {
      method: "GET",
      credentials: "same-origin",
      headers: { Accept: "application/json" }
    });
    const payload = await response.json().catch(() => null);
    if (!response.ok || !payload?.ok) {
      return {
        ok: false,
        error: payload?.error || "Nao foi possivel ler a mesa PvP."
      };
    }
    syncPvpState(payload);
    await syncPubpaidAccount();
    return payload;
  } catch (_error) {
    return { ok: false, error: "Conexao com a mesa PvP indisponivel." };
  }
}

export async function throwDarts(matchId, aimX = 50, aimY = 50) {
  return requestPvp("./api/pubpaid/pvp/darts/throw", { matchId, aimX, aimY });
}

export async function moveCheckers(matchId, move) {
  return requestPvp("./api/pubpaid/pvp/checkers/move", { matchId, move });
}

export function syncPvpState(payload = {}) {
  updateGameState({
    pvpStatus: payload.state || "idle",
    pvpGameId: payload.gameId || "",
    pvpSeat: payload.seat || "",
    pvpMatchId: payload?.match?.id || "",
    pvpMatch: payload?.match || null,
    pvpQueue: payload?.queue || null
  });
}
