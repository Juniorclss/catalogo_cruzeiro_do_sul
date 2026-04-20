"use strict";

const fs = require("fs");
const path = require("path");

const ROOT_DIR = __dirname;
const CANONICAL_DATA_DIR = path.join(ROOT_DIR, "data");
const PUBPAID_STORE_FILE = path.join(CANONICAL_DATA_DIR, "pubpaid-store.json");

const emptyStore = () => ({
  schemaVersion: 1,
  updatedAt: null,
  deposits: [],
  withdrawals: [],
  wallets: {},
});

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function clampInteger(value, fallback = 0) {
  const num = Number(value);
  if (!Number.isFinite(num)) {
    return fallback;
  }
  return Math.trunc(num);
}

function normalizeStatus(value, fallback = "pending") {
  const normalized = String(value || fallback).trim().toLowerCase();
  if (normalized === "approved" || normalized === "approve" || normalized === "aprovado" || normalized === "aprovar") {
    return "approved";
  }
  if (normalized === "creditos-liberados" || normalized === "saque-liberado" || normalized === "confirmado-manual") {
    return "approved";
  }
  if (normalized === "rejected" || normalized === "reject" || normalized === "rejeitado" || normalized === "rejeitar") {
    return "rejected";
  }
  if (normalized === "deposito-rejeitado" || normalized === "saque-rejeitado" || normalized === "rejeitado-manual") {
    return "rejected";
  }
  if (normalized === "pending" || normalized === "pendente") {
    return "pending";
  }
  if (
    normalized === "aguardando-confirmacao-pix" ||
    normalized === "aguardando-confirmacao-saque" ||
    normalized === "pendente-manual"
  ) {
    return "pending";
  }
  return fallback;
}

function normalizeText(value, fallback = "") {
  if (value === null || value === undefined) {
    return fallback;
  }
  return String(value).trim();
}

function normalizeId(prefix, value, fallbackIndex) {
  const raw = normalizeText(value);
  if (raw) {
    return raw;
  }
  return `${prefix}-${fallbackIndex + 1}`;
}

function normalizeMoney(value) {
  return clampInteger(value, 0);
}

function normalizeDeposit(item = {}, index = 0) {
  const amount = normalizeMoney(
    item.amountCoins ?? item.amount ?? item.valueCoins ?? item.value ?? item.coins ?? item.creditsRequested
  );
  const playerId = normalizeText(
    item.playerId ?? item.userId ?? item.playerSlug ?? item.email ?? item.whatsApp ?? item.user?.email,
    ""
  );
  const playerName = normalizeText(
    item.playerName ?? item.player ?? item.name ?? item.depositante ?? item.depositorName ?? item.user?.name,
    "Jogador"
  );
  const reference = normalizeText(
    item.reference ?? item.receiptReference ?? item.txid ?? item.comprovante ?? item.receipt ?? item.payment?.txid ?? "-",
    "-"
  );
  return {
    id: normalizeId("deposit", item.id, index),
    playerId,
    playerName,
    amountCoins: amount,
    reference,
    notes: normalizeText(item.notes ?? item.observation ?? item.obs, ""),
    status: normalizeStatus(item.status ?? item.payment?.status, "pending"),
    createdAt: normalizeText(item.createdAt ?? item.requestedAt ?? item.date ?? item.when, new Date().toISOString()),
    reviewedAt: normalizeText(item.reviewedAt ?? item.updatedAt, ""),
    reviewedBy: normalizeText(item.reviewedBy ?? item.adminUser, ""),
    reviewReason: normalizeText(item.reviewReason ?? item.reason, ""),
  };
}

function normalizeWithdrawal(item = {}, index = 0) {
  const amount = normalizeMoney(
    item.amountCoins ?? item.amount ?? item.valueCoins ?? item.value ?? item.coins
  );
  const playerId = normalizeText(item.playerId ?? item.userId ?? item.playerSlug ?? item.email ?? item.whatsApp, "");
  const playerName = normalizeText(item.playerName ?? item.player ?? item.name ?? item.solicitante, "Jogador");
  return {
    id: normalizeId("withdrawal", item.id, index),
    playerId,
    playerName,
    amountCoins: amount,
    pixKey: normalizeText(item.pixKey ?? item.walletKey ?? item.key, "-"),
    status: normalizeStatus(item.status, "pending"),
    createdAt: normalizeText(item.createdAt ?? item.requestedAt ?? item.date ?? item.when, new Date().toISOString()),
    reviewedAt: normalizeText(item.reviewedAt ?? item.updatedAt, ""),
    reviewedBy: normalizeText(item.reviewedBy ?? item.adminUser, ""),
    reviewReason: normalizeText(item.reviewReason ?? item.reason, ""),
  };
}

function normalizeWallet(playerId, record = {}) {
  const balanceCoins = normalizeMoney(record.balanceCoins ?? record.balance ?? record.saldo);
  const lockedWithdrawalCoins = normalizeMoney(record.lockedWithdrawalCoins ?? record.locked ?? record.travado);
  const totalApprovedDeposits = normalizeMoney(record.totalApprovedDeposits ?? record.approvedDeposits ?? record.depositosAprovados);
  const totalApprovedWithdrawals = normalizeMoney(record.totalApprovedWithdrawals ?? record.approvedWithdrawals ?? record.saquesAprovados);
  return {
    playerId: normalizeText(playerId || record.playerId || record.userId, ""),
    playerName: normalizeText(record.playerName ?? record.player ?? record.name, "Jogador"),
    balanceCoins,
    lockedWithdrawalCoins,
    totalApprovedDeposits,
    totalApprovedWithdrawals,
  };
}

function atomicWriteJson(filePath, data) {
  ensureDir(path.dirname(filePath));
  const tempFile = `${filePath}.tmp`;
  fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), "utf8");
  fs.renameSync(tempFile, filePath);
}

function readJsonIfExists(filePath, fallback) {
  try {
    if (!fs.existsSync(filePath)) {
      return fallback;
    }
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (_error) {
    return fallback;
  }
}

function mergeUnique(items, normalizeFn) {
  const map = new Map();
  items.forEach((item, index) => {
    const normalized = normalizeFn(item, index);
    map.set(normalized.id, normalized);
  });
  return Array.from(map.values());
}

function rebuildWalletProjection(deposits, withdrawals, previousWallets = {}) {
  const walletMap = new Map();

  Object.entries(previousWallets || {}).forEach(([playerId, wallet]) => {
    const normalized = normalizeWallet(playerId, wallet);
    if (normalized.playerId) {
      walletMap.set(normalized.playerId, {
        playerId: normalized.playerId,
        playerName: normalized.playerName,
        balanceCoins: 0,
        lockedWithdrawalCoins: 0,
        totalApprovedDeposits: 0,
        totalApprovedWithdrawals: 0,
      });
    }
  });

  const touchWallet = (playerId, playerName) => {
    const safeId = normalizeText(playerId, "");
    if (!safeId) {
      return null;
    }
    if (!walletMap.has(safeId)) {
      walletMap.set(
        safeId,
        normalizeWallet(safeId, {
          playerId: safeId,
          playerName,
          balanceCoins: 0,
          lockedWithdrawalCoins: 0,
          totalApprovedDeposits: 0,
          totalApprovedWithdrawals: 0,
        })
      );
    }
    const wallet = walletMap.get(safeId);
    if (playerName && wallet.playerName === "Jogador") {
      wallet.playerName = playerName;
    }
    return wallet;
  };

  deposits.forEach((deposit) => {
    const wallet = touchWallet(deposit.playerId, deposit.playerName);
    if (!wallet) {
      return;
    }
    if (deposit.status === "approved") {
      wallet.totalApprovedDeposits += normalizeMoney(deposit.amountCoins);
    }
  });

  withdrawals.forEach((withdrawal) => {
    const wallet = touchWallet(withdrawal.playerId, withdrawal.playerName);
    if (!wallet) {
      return;
    }
    const amount = normalizeMoney(withdrawal.amountCoins);
    if (withdrawal.status === "approved") {
      wallet.totalApprovedWithdrawals += amount;
    }
    if (withdrawal.status === "pending") {
      wallet.lockedWithdrawalCoins += amount;
    }
  });

  walletMap.forEach((wallet) => {
    wallet.balanceCoins = Math.max(
      0,
      normalizeMoney(wallet.totalApprovedDeposits) - normalizeMoney(wallet.totalApprovedWithdrawals) - normalizeMoney(wallet.lockedWithdrawalCoins)
    );
  });

  return Object.fromEntries(Array.from(walletMap.entries()));
}

function migrateLegacyStore() {
  const legacyCandidates = [
    path.join(ROOT_DIR, "backend", "data", "pubpaid-deposits.json"),
    path.join(ROOT_DIR, "backend", "data", "pubpaid-withdrawals.json"),
    path.join(ROOT_DIR, "backend", "data", "pubpaid-wallets.json"),
    path.join(ROOT_DIR, "data", "pubpaid-deposits.json"),
    path.join(ROOT_DIR, "data", "pubpaid-withdrawals.json"),
    path.join(ROOT_DIR, "data", "pubpaid-wallets.json"),
  ];

  const canonicalExists = fs.existsSync(PUBPAID_STORE_FILE);
  if (canonicalExists) {
    return;
  }

  const legacyDeposits = []
    .concat(readJsonIfExists(legacyCandidates[0], []))
    .concat(readJsonIfExists(legacyCandidates[3], []));
  const legacyWithdrawals = []
    .concat(readJsonIfExists(legacyCandidates[1], []))
    .concat(readJsonIfExists(legacyCandidates[4], []));
  const legacyWallets = Object.assign(
    {},
    readJsonIfExists(legacyCandidates[2], {}),
    readJsonIfExists(legacyCandidates[5], {})
  );

  const deposits = mergeUnique(legacyDeposits, normalizeDeposit);
  const withdrawals = mergeUnique(legacyWithdrawals, normalizeWithdrawal);
  const wallets = rebuildWalletProjection(deposits, withdrawals, legacyWallets);

  atomicWriteJson(PUBPAID_STORE_FILE, {
    schemaVersion: 1,
    updatedAt: new Date().toISOString(),
    deposits,
    withdrawals,
    wallets,
  });
}

function readStore() {
  migrateLegacyStore();
  const parsed = readJsonIfExists(PUBPAID_STORE_FILE, emptyStore());
  const deposits = mergeUnique(parsed.deposits || [], normalizeDeposit);
  const withdrawals = mergeUnique(parsed.withdrawals || [], normalizeWithdrawal);
  const wallets = rebuildWalletProjection(deposits, withdrawals, parsed.wallets || {});
  return {
    schemaVersion: 1,
    updatedAt: parsed.updatedAt || null,
    deposits,
    withdrawals,
    wallets,
  };
}

function writeStore(store) {
  const deposits = mergeUnique(store.deposits || [], normalizeDeposit);
  const withdrawals = mergeUnique(store.withdrawals || [], normalizeWithdrawal);
  const wallets = rebuildWalletProjection(deposits, withdrawals, store.wallets || {});
  const payload = {
    schemaVersion: 1,
    updatedAt: new Date().toISOString(),
    deposits,
    withdrawals,
    wallets,
  };
  atomicWriteJson(PUBPAID_STORE_FILE, payload);
  return payload;
}

let pubpaidMutation = Promise.resolve();

function withPubpaidLock(action) {
  const run = pubpaidMutation.then(() => action());
  pubpaidMutation = run.catch(() => undefined);
  return run;
}

function buildDashboardPayload(storeInput) {
  const store = storeInput || readStore();
  const pendingDeposits = store.deposits
    .filter((item) => item.status === "pending")
    .map((item) => ({
      ...item,
      amount: item.amountCoins,
      value: item.amountCoins,
      player: item.playerName,
      depositante: item.playerName,
      when: item.createdAt,
      referenceLabel: item.reference,
    }))
    .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  const pendingWithdrawals = store.withdrawals
    .filter((item) => item.status === "pending")
    .map((item) => ({
      ...item,
      amount: item.amountCoins,
      value: item.amountCoins,
      player: item.playerName,
      solicitante: item.playerName,
      when: item.createdAt,
      key: item.pixKey,
    }))
    .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  const walletBoard = Object.values(store.wallets)
    .map((wallet) => ({
      playerId: wallet.playerId,
      playerName: wallet.playerName,
      balanceCoins: wallet.balanceCoins,
      balance: wallet.balanceCoins,
      saldo: wallet.balanceCoins,
      lockedWithdrawalCoins: wallet.lockedWithdrawalCoins,
      locked: wallet.lockedWithdrawalCoins,
      travado: wallet.lockedWithdrawalCoins,
      totalApprovedDeposits: wallet.totalApprovedDeposits,
      approvedDeposits: wallet.totalApprovedDeposits,
      totalApprovedWithdrawals: wallet.totalApprovedWithdrawals,
      approvedWithdrawals: wallet.totalApprovedWithdrawals,
    }))
    .sort((a, b) => b.balanceCoins - a.balanceCoins || a.playerName.localeCompare(b.playerName));

  return {
    generatedAt: new Date().toISOString(),
    pendingDeposits,
    pendingWithdrawals,
    walletBoard,
    stats: {
      pendingDepositCount: pendingDeposits.length,
      pendingWithdrawalCount: pendingWithdrawals.length,
      walletCount: walletBoard.length,
      totalPlayerBalanceCoins: walletBoard.reduce((sum, item) => sum + normalizeMoney(item.balanceCoins), 0),
      totalLockedWithdrawalCoins: walletBoard.reduce((sum, item) => sum + normalizeMoney(item.lockedWithdrawalCoins), 0),
    },
  };
}

function reviewDeposit({ depositId, decision, reviewer, reason }) {
  return withPubpaidLock(() => {
    const store = readStore();
    const normalizedDecision = normalizeStatus(decision, "");
    if (normalizedDecision !== "approved" && normalizedDecision !== "rejected") {
      const error = new Error("Decisão inválida.");
      error.statusCode = 400;
      throw error;
    }

    const targetIndex = store.deposits.findIndex((item) => item.id === depositId);
    if (targetIndex === -1) {
      const error = new Error("Depósito não encontrado.");
      error.statusCode = 404;
      throw error;
    }

    const current = store.deposits[targetIndex];
    if (current.status !== "pending") {
      return {
        item: current,
        idempotent: true,
        dashboard: buildDashboardPayload(store),
      };
    }

    const reviewed = {
      ...current,
      status: normalizedDecision,
      reviewedAt: new Date().toISOString(),
      reviewedBy: normalizeText(reviewer, "admin"),
      reviewReason: normalizeText(reason, ""),
    };

    store.deposits[targetIndex] = reviewed;
    const nextStore = writeStore(store);

    return {
      item: reviewed,
      idempotent: false,
      dashboard: buildDashboardPayload(nextStore),
    };
  });
}

function reviewWithdrawal({ withdrawalId, decision, reviewer, reason }) {
  return withPubpaidLock(() => {
    const store = readStore();
    const normalizedDecision = normalizeStatus(decision, "");
    if (normalizedDecision !== "approved" && normalizedDecision !== "rejected") {
      const error = new Error("Decisão inválida.");
      error.statusCode = 400;
      throw error;
    }

    const targetIndex = store.withdrawals.findIndex((item) => item.id === withdrawalId);
    if (targetIndex === -1) {
      const error = new Error("Saque não encontrado.");
      error.statusCode = 404;
      throw error;
    }

    const current = store.withdrawals[targetIndex];
    if (current.status !== "pending") {
      return {
        item: current,
        idempotent: true,
        dashboard: buildDashboardPayload(store),
      };
    }

    const reviewed = {
      ...current,
      status: normalizedDecision,
      reviewedAt: new Date().toISOString(),
      reviewedBy: normalizeText(reviewer, "admin"),
      reviewReason: normalizeText(reason, ""),
    };

    store.withdrawals[targetIndex] = reviewed;
    const nextStore = writeStore(store);

    return {
      item: reviewed,
      idempotent: false,
      dashboard: buildDashboardPayload(nextStore),
    };
  });
}

module.exports = {
  PUBPAID_STORE_FILE,
  buildDashboardPayload,
  clampInteger,
  normalizeDeposit,
  normalizeStatus,
  normalizeWallet,
  normalizeWithdrawal,
  readStore,
  reviewDeposit,
  reviewWithdrawal,
  withPubpaidLock,
  writeStore,
};
