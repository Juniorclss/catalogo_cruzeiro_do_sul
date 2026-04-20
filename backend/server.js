"use strict";

const express = require("express");
const cors = require("cors");
const path = require("node:path");
const crypto = require("node:crypto");
const { createSharedDataStore } = require("./shared-data-store");
let QRCode = null;
try {
  QRCode = require("qrcode");
} catch (_error) {
  QRCode = null;
}

const app = express();
const PORT = Number(process.env.PORT || 8787);
const HOST = process.env.HOST || "0.0.0.0";
const ADMIN_TOKEN = String(process.env.ADMIN_TOKEN || "").trim();
const IS_PRODUCTION = String(process.env.NODE_ENV || "").trim().toLowerCase() === "production";

function getRequiredSecret(name, fallbackValue) {
  const value = String(process.env[name] || "").trim();
  if (value) return value;

  if (!IS_PRODUCTION) {
    return fallbackValue;
  }

  console.warn(`[security] Missing required env ${name} in production. Related admin access is disabled until it is set.`);
  return `missing-${name.toLowerCase()}-in-production`;
}

const SUPER_ADMIN_USER = getRequiredSecret("SUPER_ADMIN_USER", "admin");
const SUPER_ADMIN_PASSWORD = getRequiredSecret("SUPER_ADMIN_PASSWORD", "99831455a");
const GOOGLE_AUTH_CLIENT_ID = String(
  process.env.GOOGLE_AUTH_CLIENT_ID || process.env.PUBPAID_GOOGLE_CLIENT_ID || ""
).trim();
const SITE_AUTH_SESSION_SECRET = String(
  process.env.SITE_AUTH_SESSION_SECRET ||
    process.env.PUBPAID_SESSION_SECRET ||
    (IS_PRODUCTION ? "" : "catalogo-local-google-auth-session")
).trim();
const SITE_AUTH_COOKIE = "catalogo_google_session";
const SITE_AUTH_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;
const GOOGLE_ID_TOKEN_CERTS_URL = "https://www.googleapis.com/oauth2/v1/certs";
let googleIdTokenCertCache = {
  certs: null,
  expiresAt: 0
};
const LOCALE = "pt-BR";
const TIME_ZONE = "America/Rio_Branco";
const NINJAS_PIX_KEY = String(process.env.NINJAS_PIX_KEY || "").trim();
const NINJAS_PIX_DEFAULT_AMOUNT = 5;
const NINJAS_PIX_RECEIVER_NAME = String(
  process.env.NINJAS_PIX_RECEIVER_NAME || "CATALOGO CRUZEIRO"
).trim();
const NINJAS_MERCHANT_NAME = String(
  process.env.NINJAS_MERCHANT_NAME || NINJAS_PIX_RECEIVER_NAME || "CATALOGO CZS"
).trim();
const NINJAS_MERCHANT_CITY = String(process.env.NINJAS_MERCHANT_CITY || "CRUZEIRO DO SUL").trim();
const NEWS_REFRESH_ENABLED = !["0", "false", "off"].includes(
  String(process.env.NEWS_REFRESH_ENABLED || "true").trim().toLowerCase()
);
const PREVIEW_CLASS_BY_CATEGORY = {
  cotidiano: "thumb-cheia",
  saude: "thumb-saude",
  negocios: "thumb-pascoa",
  policia: "thumb-policia",
  educacao: "thumb-educacao",
  prefeitura: "thumb-politica",
  "utilidade publica": "thumb-alerta",
  "festas & social": "thumb-social",
  social: "thumb-social",
  cultura: "thumb-cultura",
  acre: "thumb-cheia",
  nacional: "thumb-servico",
  politica: "thumb-politica"
};

const STORE_DEFAULTS = {
  subscriptions: [],
  comments: [],
  visits: [],
  heartbeats: [],
  votes: [],
  ninjasRequests: [],
  ninjasProfiles: [],
  salesListings: [],
  vrRentalLeads: [],
  pubpaidDeposits: [],
  pubpaidWithdrawals: [],
  pubpaidWallets: [],
  news: {
    updatedAt: null,
    online: false,
    items: []
  }
};
const store = createSharedDataStore();

const NEWS_SOURCES = [
  {
    id: "g1-acre",
    label: "G1 Acre",
    url: "https://g1.globo.com/dynamo/acre/rss2.xml",
    category: "acre"
  },
  {
    id: "agencia-brasil",
    label: "Agência Brasil",
    url: "https://agenciabrasil.ebc.com.br/rss/geral/feed.xml",
    category: "nacional"
  },
  {
    id: "senado-noticias",
    label: "Senado Notícias",
    url: "https://www12.senado.leg.br/noticias/feed",
    category: "politica"
  }
];

const RANKING_POLITICOS_URL = "https://www.politicos.org.br/Ranking";

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

function parseBasicAuth(req) {
  const header = String(req.headers.authorization || "");
  const match = header.match(/^Basic\s+(.+)$/i);
  if (!match) return null;

  try {
    const decoded = Buffer.from(match[1], "base64").toString("utf-8");
    const divider = decoded.indexOf(":");
    if (divider < 0) return null;
    return {
      user: decoded.slice(0, divider),
      password: decoded.slice(divider + 1)
    };
  } catch (_error) {
    return null;
  }
}

function requireAdmin(req, res, next) {
  const token =
    safeString(req.headers["x-admin-token"], 160) ||
    safeString(req.query.token, 160);
  const basic = parseBasicAuth(req);
  const hasValidBasic =
    basic?.user === SUPER_ADMIN_USER && basic?.password === SUPER_ADMIN_PASSWORD;
  const hasValidToken = Boolean(ADMIN_TOKEN) && token === ADMIN_TOKEN;

  if (!hasValidBasic && !hasValidToken) {
    res.setHeader("WWW-Authenticate", 'Basic realm="Catalogo Super Admin", charset="UTF-8"');
    return res.status(401).json({
      ok: false,
      error: "login de super admin necessario"
    });
  }
  next();
}

app.use("/admin", express.static(path.join(__dirname, "public")));

function nowIso() {
  return new Date().toISOString();
}

function safeString(value, max = 400) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

function normalizeText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function slugify(value) {
  return normalizeText(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeSalesCategory(value) {
  const normalized = normalizeText(value || "outros");
  if (/veiculo|moto|carro|bike|bicicleta|transporte/.test(normalized)) return "veiculos";
  if (/casa|movel|moveis|eletro|geladeira|fogao|sofa|mesa/.test(normalized)) return "casa";
  if (/celular|notebook|computador|game|console|tech|eletronico/.test(normalized)) return "eletronicos";
  if (/moda|roupa|calcado|tenis|bolsa|acessorio/.test(normalized)) return "moda";
  if (/servico|frete|aula|manutencao|diaria|mao de obra/.test(normalized)) return "servicos";
  return "outros";
}

function publicSalesListing(item = {}) {
  return {
    id: item.id,
    title: item.title,
    category: item.category,
    categoryLabel: item.categoryLabel,
    price: item.price,
    condition: item.condition,
    deliveryMode: item.deliveryMode,
    sellerName: item.sellerName,
    phone: item.phone,
    city: item.city,
    neighborhood: item.neighborhood,
    description: item.description,
    createdAt: item.createdAt
  };
}

function parseCurrency(value, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Number(value.toFixed(2));
  }
  const parsed = Number(
    String(value || "")
      .replace(/[R$\s]/gi, "")
      .replace(/\./g, "")
      .replace(",", ".")
  );
  return Number.isFinite(parsed) ? Number(parsed.toFixed(2)) : fallback;
}

function normalizePixText(value, maxLength = 25) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z0-9 /.-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase()
    .slice(0, maxLength);
}

function normalizePixToken(value, maxLength = 25) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z0-9]/g, "")
    .trim()
    .toUpperCase()
    .slice(0, maxLength);
}

function buildPixField(id, value) {
  const content = String(value || "");
  return `${id}${String(content.length).padStart(2, "0")}${content}`;
}

function computePixCrc16(payload) {
  let crc = 0xffff;
  for (let index = 0; index < payload.length; index += 1) {
    crc ^= payload.charCodeAt(index) << 8;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

function buildPixPayload({ amount, txid, description }) {
  const safeAmount = Math.max(0.01, Math.min(99999.99, parseCurrency(amount, NINJAS_PIX_DEFAULT_AMOUNT))).toFixed(2);
  const safeTxid = normalizePixToken(txid || `NJS${Date.now()}`, 25) || `NJS${Date.now()}`;
  const pixKey = safeString(NINJAS_PIX_KEY, 77);
  if (!pixKey) throw new Error("pix-key-not-configured");
  const accountInfo = [
    buildPixField("00", "br.gov.bcb.pix"),
    buildPixField("01", pixKey)
  ];
  const safeDescription = normalizePixText(description, 40);
  if (safeDescription) accountInfo.push(buildPixField("02", safeDescription));

  const payloadWithoutCrc = [
    buildPixField("00", "01"),
    buildPixField("01", "12"),
    buildPixField("26", accountInfo.join("")),
    buildPixField("52", "0000"),
    buildPixField("53", "986"),
    buildPixField("54", safeAmount),
    buildPixField("58", "BR"),
    buildPixField("59", normalizePixText(NINJAS_MERCHANT_NAME, 25) || "CATALOGO CZS"),
    buildPixField("60", normalizePixText(NINJAS_MERCHANT_CITY, 15) || "CRUZEIRO DO SUL"),
    buildPixField("62", buildPixField("05", safeTxid)),
    "6304"
  ].join("");

  return {
    txid: safeTxid,
    copyCode: `${payloadWithoutCrc}${computePixCrc16(payloadWithoutCrc)}`
  };
}

async function buildNinjasPixConfig({ amount, txid, description }) {
  const safeAmount = Math.max(1, Math.min(100, parseCurrency(amount, NINJAS_PIX_DEFAULT_AMOUNT)));
  const payload = buildPixPayload({ amount: safeAmount, txid, description });
  let qrSvg = "";
  if (QRCode?.toString) {
    try {
      qrSvg = await QRCode.toString(payload.copyCode, {
        type: "svg",
        margin: 1,
        errorCorrectionLevel: "M",
        color: { dark: "#0B1C33", light: "#FFFFFF" }
      });
    } catch (_error) {
      qrSvg = "";
    }
  }
  return {
    paymentMethod: "pix-qr-code",
    keyVisible: false,
    merchantName: normalizePixText(NINJAS_MERCHANT_NAME, 25) || "CATALOGO CZS",
    amount: Number(safeAmount.toFixed(2)),
    txid: payload.txid,
    qrSvg,
    confirmationMode: "manual"
  };
}

function getNinjasCreditsFromPlan(plan, amount) {
  const normalizedPlan = normalizeText(plan);
  const normalizedAmount = Number(parseCurrency(amount, 0).toFixed(2));
  if (normalizedPlan === "creditos" || normalizedPlan === "creditos-pro") {
    if (normalizedAmount >= 100) return 80;
    if (normalizedAmount >= 50) return 30;
    if (normalizedAmount >= 20) return 10;
  }
  return 0;
}

function formatDisplayDate(value) {
  if (!value) return "Sem data";
  if (typeof value === "string" && !/^\d{4}-\d{2}-\d{2}/.test(value)) {
    return value;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return String(value);

  return parsed.toLocaleDateString(LOCALE, {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: TIME_ZONE
  });
}

function safeEmail(value) {
  const email = safeString(value, 160).toLowerCase();
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  return ok ? email : "";
}

function base64UrlEncode(value) {
  return Buffer.from(String(value || ""), "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function base64UrlToBuffer(value) {
  const normalized = String(value || "").replace(/-/g, "+").replace(/_/g, "/");
  const padding = normalized.length % 4;
  const padded = padding ? normalized + "=".repeat(4 - padding) : normalized;
  return Buffer.from(padded, "base64");
}

function parseJwtJson(part) {
  return JSON.parse(base64UrlToBuffer(part).toString("utf8"));
}

function safeTimingCompare(left, right) {
  const leftBuffer = Buffer.from(String(left || ""));
  const rightBuffer = Buffer.from(String(right || ""));
  if (leftBuffer.length !== rightBuffer.length) return false;
  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function isCatalogoGoogleAuthEnabled() {
  return Boolean(GOOGLE_AUTH_CLIENT_ID && SITE_AUTH_SESSION_SECRET);
}

function parseCookies(req) {
  const header = String(req?.headers?.cookie || "");
  return header.split(";").reduce((cookies, part) => {
    const divider = part.indexOf("=");
    if (divider < 0) return cookies;
    const key = part.slice(0, divider).trim();
    const value = part.slice(divider + 1).trim();
    if (!key) return cookies;
    try {
      cookies[key] = decodeURIComponent(value);
    } catch (_error) {
      cookies[key] = value;
    }
    return cookies;
  }, {});
}

function serializeCookie(name, value, options = {}) {
  const parts = [`${name}=${encodeURIComponent(value)}`];
  if (options.maxAge !== undefined) parts.push(`Max-Age=${Number(options.maxAge) || 0}`);
  if (options.path) parts.push(`Path=${options.path}`);
  if (options.httpOnly) parts.push("HttpOnly");
  if (options.secure) parts.push("Secure");
  if (options.sameSite) parts.push(`SameSite=${options.sameSite}`);
  return parts.join("; ");
}

function appendSetCookie(res, cookie) {
  const current = res.getHeader("Set-Cookie");
  if (!current) {
    res.setHeader("Set-Cookie", cookie);
    return;
  }
  const next = Array.isArray(current) ? current.concat(cookie) : [current, cookie];
  res.setHeader("Set-Cookie", next);
}

function isSecureRequest(req) {
  const forwardedProto = String(req?.headers?.["x-forwarded-proto"] || "").toLowerCase();
  return forwardedProto.includes("https") || Boolean(req?.socket?.encrypted) || IS_PRODUCTION;
}

function createCatalogoAuthToken(user) {
  const now = Date.now();
  const payload = {
    sub: safeString(user.sub, 120),
    email: safeEmail(user.email),
    name: safeString(user.name || user.givenName || "", 120),
    givenName: safeString(user.givenName, 80),
    familyName: safeString(user.familyName, 80),
    picture: safeString(user.picture, 360),
    iat: now,
    exp: now + SITE_AUTH_MAX_AGE_SECONDS * 1000
  };
  const body = base64UrlEncode(JSON.stringify(payload));
  const signature = base64UrlEncode(
    crypto.createHmac("sha256", SITE_AUTH_SESSION_SECRET).update(body).digest()
  );
  return `${body}.${signature}`;
}

function readCatalogoAuthSession(req) {
  if (!isCatalogoGoogleAuthEnabled()) return null;
  const token = parseCookies(req)[SITE_AUTH_COOKIE];
  if (!token || !token.includes(".")) return null;
  const [body, signature] = token.split(".");
  const expected = base64UrlEncode(
    crypto.createHmac("sha256", SITE_AUTH_SESSION_SECRET).update(body).digest()
  );
  if (!safeTimingCompare(signature, expected)) return null;

  try {
    const payload = JSON.parse(base64UrlToBuffer(body).toString("utf8"));
    if (!payload?.sub || !payload?.email) return null;
    if (Number(payload.exp || 0) < Date.now()) return null;
    return {
      sub: safeString(payload.sub, 120),
      email: safeEmail(payload.email),
      name: safeString(payload.name, 120),
      givenName: safeString(payload.givenName, 80),
      familyName: safeString(payload.familyName, 80),
      picture: safeString(payload.picture, 360)
    };
  } catch (_error) {
    return null;
  }
}

function publicAuthUser(user) {
  if (!user) return null;
  return {
    sub: safeString(user.sub, 120),
    email: safeEmail(user.email),
    name: safeString(user.name, 120),
    givenName: safeString(user.givenName, 80),
    familyName: safeString(user.familyName, 80),
    picture: safeString(user.picture, 360)
  };
}

function setCatalogoAuthCookie(req, res, user) {
  appendSetCookie(
    res,
    serializeCookie(SITE_AUTH_COOKIE, createCatalogoAuthToken(user), {
      maxAge: SITE_AUTH_MAX_AGE_SECONDS,
      path: "/",
      httpOnly: true,
      sameSite: "Lax",
      secure: isSecureRequest(req)
    })
  );
}

function clearCatalogoAuthCookie(req, res) {
  appendSetCookie(
    res,
    serializeCookie(SITE_AUTH_COOKIE, "", {
      maxAge: 0,
      path: "/",
      httpOnly: true,
      sameSite: "Lax",
      secure: isSecureRequest(req)
    })
  );
}

async function fetchGoogleIdTokenCerts() {
  if (googleIdTokenCertCache.certs && googleIdTokenCertCache.expiresAt > Date.now()) {
    return googleIdTokenCertCache.certs;
  }

  const response = await fetch(GOOGLE_ID_TOKEN_CERTS_URL, {
    headers: { Accept: "application/json" }
  });
  if (!response.ok) {
    throw new Error("Nao foi possivel carregar as chaves publicas do Google.");
  }

  const certs = await response.json();
  const cacheControl = String(response.headers.get("cache-control") || "");
  const maxAgeMatch = cacheControl.match(/max-age=(\d+)/i);
  const maxAgeMs = maxAgeMatch ? Number(maxAgeMatch[1]) * 1000 : 60 * 60 * 1000;
  googleIdTokenCertCache = {
    certs,
    expiresAt: Date.now() + Math.max(5 * 60 * 1000, maxAgeMs - 60 * 1000)
  };
  return certs;
}

async function verifyGoogleIdToken(idToken) {
  if (!isCatalogoGoogleAuthEnabled()) {
    throw new Error("Login Google ainda nao esta configurado neste ambiente.");
  }

  const parts = String(idToken || "").split(".");
  if (parts.length !== 3) {
    throw new Error("Credencial Google invalida.");
  }

  const header = parseJwtJson(parts[0]);
  const claims = parseJwtJson(parts[1]);
  if (header.alg !== "RS256" || !header.kid) {
    throw new Error("Assinatura Google nao reconhecida.");
  }

  const certs = await fetchGoogleIdTokenCerts();
  const cert = certs?.[header.kid];
  if (!cert) {
    googleIdTokenCertCache = { certs: null, expiresAt: 0 };
    throw new Error("Chave publica do Google nao encontrada.");
  }

  const verifier = crypto.createVerify("RSA-SHA256");
  verifier.update(`${parts[0]}.${parts[1]}`);
  verifier.end();
  if (!verifier.verify(cert, base64UrlToBuffer(parts[2]))) {
    throw new Error("Assinatura Google invalida.");
  }

  const nowSeconds = Math.floor(Date.now() / 1000);
  if (String(claims.aud || "") !== GOOGLE_AUTH_CLIENT_ID) {
    throw new Error("Credencial Google emitida para outro aplicativo.");
  }
  if (!["accounts.google.com", "https://accounts.google.com"].includes(String(claims.iss || ""))) {
    throw new Error("Emissor Google invalido.");
  }
  if (Number(claims.exp || 0) <= nowSeconds) {
    throw new Error("Credencial Google expirada.");
  }
  if (!claims.sub) {
    throw new Error("Credencial Google sem identificador.");
  }
  if (!claims.email) {
    throw new Error("Credencial Google sem e-mail.");
  }

  const emailVerified = claims.email_verified === true || claims.email_verified === "true";
  if (claims.email && !emailVerified) {
    throw new Error("Confirme o e-mail no Google antes de continuar.");
  }

  return {
    sub: safeString(claims.sub, 120),
    email: safeEmail(claims.email),
    name: safeString(claims.name, 120),
    givenName: safeString(claims.given_name, 80),
    familyName: safeString(claims.family_name, 80),
    picture: safeString(claims.picture, 360),
    emailVerified
  };
}

function normalizeUrl(value) {
  const url = safeString(value, 500);
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith("/")) return url;
  return "";
}

function detectDeviceType(uaRaw) {
  const ua = (uaRaw || "").toLowerCase();
  if (!ua) return "desconhecido";
  if (/mobile|android|iphone|ipod|blackberry|opera mini/i.test(ua)) {
    return "mobile";
  }
  if (/ipad|tablet/i.test(ua)) return "tablet";
  return "desktop";
}

function detectBrowser(uaRaw) {
  const ua = (uaRaw || "").toLowerCase();
  if (ua.includes("edg/")) return "Edge";
  if (ua.includes("opr/") || ua.includes("opera")) return "Opera";
  if (ua.includes("firefox/")) return "Firefox";
  if (ua.includes("chrome/")) return "Chrome";
  if (ua.includes("safari/")) return "Safari";
  return "Outro";
}

function getClientIp(req) {
  const fromForward = safeString(req.headers["x-forwarded-for"] || "", 120);
  if (fromForward) return fromForward.split(",")[0].trim();
  return safeString(req.socket?.remoteAddress || "");
}

function getRequestCity(req, body = {}) {
  return (
    safeString(
      req.headers["x-vercel-ip-city"] ||
        req.headers["cf-ipcity"] ||
        body.city ||
        "",
      80
    ) || "não informado"
  );
}

function getRequestCountry(req, body = {}) {
  return (
    safeString(
      req.headers["x-vercel-ip-country"] ||
        req.headers["cf-ipcountry"] ||
        body.country ||
        "",
      40
    ) || "não informado"
  );
}

function summarizeReferrer(referrerRaw) {
  const referrer = safeString(referrerRaw, 300);
  if (!referrer) return "direto";

  try {
    return new URL(referrer).hostname || "direto";
  } catch {
    return referrer;
  }
}

function topEntries(bucket = {}, labelKey = "label", limit = 12) {
  return Object.entries(bucket)
    .map(([label, total]) => ({ [labelKey]: label, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, limit);
}

function sortByDateDesc(items = [], key = "at", limit = 20) {
  return [...items]
    .sort((left, right) => {
      return new Date(right[key] || 0).getTime() - new Date(left[key] || 0).getTime();
    })
    .slice(0, limit);
}

function buildTrackingMeta(req, body = {}, userAgentRaw = "") {
  const userAgent = safeString(
    userAgentRaw || body.userAgent || req.headers["user-agent"] || "",
    260
  );
  const referrer = safeString(body.referrer || req.headers.referer || "", 300);

  return {
    pagePath: safeString(body.pagePath || body.sourcePage || req.headers.referer || "/", 260) || "/",
    referrer,
    referrerHost: summarizeReferrer(referrer),
    deviceType: safeString(body.deviceType || detectDeviceType(userAgent), 40),
    browser: safeString(body.browser || detectBrowser(userAgent), 40),
    language: safeString(body.language || req.headers["accept-language"] || "", 80),
    timezone: safeString(body.timezone, 80),
    screen: safeString(body.screen, 50),
    viewport: safeString(body.viewport, 50),
    platform: safeString(body.platform || req.headers["sec-ch-ua-platform"] || "", 80),
    pageTitle: safeString(body.pageTitle, 160),
    city: getRequestCity(req, body),
    country: getRequestCountry(req, body),
    ip: getClientIp(req),
    userAgent,
    visitorId: safeString(body.visitorId, 90),
    sessionId: safeString(body.sessionId, 90),
    cookieVisitorId: safeString(body.cookieVisitorId, 90),
    cookieSessionId: safeString(body.cookieSessionId, 90),
    trackingConsent: safeString(body.trackingConsent || body.consentState || "", 30) || "accepted",
    trackingMethod: safeString(body.trackingMethod, 60) || "runtime",
    consentSource: safeString(body.consentSource, 40) || "banner",
    cookiesEnabled:
      typeof body.cookiesEnabled === "boolean" ? body.cookiesEnabled : Boolean(body.cookiesEnabled),
    storageEnabled:
      typeof body.storageEnabled === "boolean" ? body.storageEnabled : Boolean(body.storageEnabled),
    utmSource: safeString(body.utmSource, 120),
    utmMedium: safeString(body.utmMedium, 120),
    utmCampaign: safeString(body.utmCampaign, 160),
    utmContent: safeString(body.utmContent, 160),
    utmTerm: safeString(body.utmTerm, 160)
  };
}

async function ensureStore() {
  await store.ensure(STORE_DEFAULTS);
}

async function readStore(key, fallback = []) {
  return store.read(key, fallback);
}

async function writeStore(key, data) {
  await store.write(key, data);
}

function buildId(prefix = "id") {
  return `${prefix}_${crypto.randomBytes(8).toString("hex")}`;
}

function normalizePubpaidAmount(value, fallback = 10) {
  const amount = parseCurrency(value, fallback);
  return Math.max(1, Math.min(1000, Number(amount.toFixed(2))));
}

function isPubpaidPendingStatus(status) {
  return ["pendente-manual", "aguardando-confirmacao-pix", "pending", "em-analise"].includes(
    safeString(status, 60).toLowerCase()
  );
}

function getPubpaidWalletKey(user) {
  const email = safeEmail(user?.email);
  return email ? `email:${email}` : `sub:${safeString(user?.sub, 120) || "anon"}`;
}

function publicPubpaidUser(user) {
  return publicAuthUser(user) || {
    sub: "",
    email: "",
    name: "",
    givenName: "",
    familyName: "",
    picture: ""
  };
}

function summarizePubpaidDeposit(item = {}) {
  return {
    id: item.id || "",
    createdAt: item.createdAt,
    reviewDeadlineAt: item.reviewDeadlineAt,
    email: item?.user?.email || "",
    name: item?.user?.name || "",
    depositorName: item.depositorName || item?.payment?.depositorName || "",
    amount: item.amount || 0,
    creditsRequested: item.creditsRequested || 0,
    status: item.status || "",
    paymentStatus: item?.payment?.status || "",
    txid: item?.payment?.txid || item.reference || "",
    sourcePage: item?.tracking?.pagePath || item.sourcePage || "",
    ip: item?.tracking?.ip || ""
  };
}

function summarizePubpaidWithdrawal(item = {}) {
  return {
    id: item.id || "",
    createdAt: item.createdAt,
    reviewDeadlineAt: item.reviewDeadlineAt,
    email: item?.user?.email || "",
    name: item?.user?.name || "",
    amount: item.amount || 0,
    status: item.status || "",
    pixKey: item.pixKey || "",
    txid: item.reference || item.txid || "",
    sourcePage: item?.tracking?.pagePath || item.sourcePage || "",
    ip: item?.tracking?.ip || ""
  };
}

async function creditPubpaidWallet(user, credits, meta = {}) {
  const amount = Math.max(0, Math.floor(Number(credits || 0)));
  if (!amount) return null;
  const wallets = ensureArrayItems(await readStore("pubpaidWallets", []));
  const walletKey = getPubpaidWalletKey(user);
  const index = wallets.findIndex((item) => item.walletKey === walletKey);
  const now = nowIso();
  const current =
    index >= 0
      ? wallets[index]
      : {
          id: buildId("pubwallet"),
          walletKey,
          user: publicPubpaidUser(user),
          balance: 0,
          depositsApproved: 0,
          withdrawalsApproved: 0,
          locked: false,
          createdAt: now
        };
  const next = {
    ...current,
    user: publicPubpaidUser(user),
    balance: Math.max(0, Number(current.balance || 0) + amount),
    depositsApproved: Number(current.depositsApproved || 0) + amount,
    updatedAt: now,
    lastDepositId: meta.depositId || current.lastDepositId || ""
  };
  if (index >= 0) wallets[index] = next;
  else wallets.push(next);
  await writeStore("pubpaidWallets", wallets);
  return next;
}

async function getOrCreatePubpaidWallet(user) {
  const wallets = ensureArrayItems(await readStore("pubpaidWallets", []));
  const walletKey = getPubpaidWalletKey(user);
  const existing = wallets.find((item) => item.walletKey === walletKey);
  if (existing) return existing;
  const now = nowIso();
  const wallet = {
    id: buildId("pubwallet"),
    walletKey,
    user: publicPubpaidUser(user),
    balance: 0,
    depositsApproved: 0,
    withdrawalsApproved: 0,
    locked: false,
    createdAt: now,
    updatedAt: now
  };
  wallets.push(wallet);
  await writeStore("pubpaidWallets", wallets);
  return wallet;
}

async function updatePubpaidWallet(walletKey, updater) {
  const wallets = ensureArrayItems(await readStore("pubpaidWallets", []));
  const index = wallets.findIndex((item) => item.walletKey === walletKey);
  if (index < 0) return null;
  const next = updater(wallets[index]);
  wallets[index] = { ...next, updatedAt: nowIso() };
  await writeStore("pubpaidWallets", wallets);
  return wallets[index];
}

function ensureArrayItems(value) {
  if (Array.isArray(value)) return value;
  if (value === null || value === undefined) return [];
  return [value];
}

function stripHtml(text) {
  return safeString(String(text || "").replace(/<[^>]*>/g, " "), 800);
}

function decodeEntities(text) {
  return String(text || "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function pickTag(block, tag) {
  const rx = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i");
  const match = block.match(rx);
  if (!match) return "";
  return decodeEntities(stripHtml(match[1]));
}

function pickEnclosure(block) {
  const match = block.match(/<enclosure[^>]+url=["']([^"']+)["'][^>]*>/i);
  return match ? normalizeUrl(match[1]) : "";
}

function parseRss(xml, source) {
  const items = [];
  const blocks = xml.match(/<item[\s\S]*?<\/item>/gi) || [];

  for (const block of blocks.slice(0, 25)) {
    const title = pickTag(block, "title");
    const link = pickTag(block, "link");
    if (!title || !link) continue;

    const summary =
      pickTag(block, "description") ||
      pickTag(block, "content:encoded") ||
      "";
    const pubDate = pickTag(block, "pubDate");
    const imageUrl = pickEnclosure(block);

    items.push({
      id: buildId(source.id),
      sourceId: source.id,
      sourceLabel: source.label,
      category: source.category,
      title,
      link: normalizeUrl(link),
      summary: safeString(summary, 700),
      imageUrl,
      publishedAt: pubDate ? new Date(pubDate).toISOString() : nowIso(),
      collectedAt: nowIso()
    });
  }

  return items;
}

function normalizeArticleItem(item) {
  const title = safeString(item.title || "Atualizacao", 240);
  const category = safeString(item.category || "Geral", 80) || "Geral";
  const sourceName = safeString(item.sourceName || item.source || item.sourceLabel || "Fonte local", 120);
  const sourceUrl = normalizeUrl(item.sourceUrl || item.url || item.link) || "#";
  const publishedAt = item.publishedAt || item.date || nowIso();
  const slug = safeString(item.slug || slugify(title) || item.id, 180);

  return {
    id: safeString(item.id || slug || sourceUrl || title, 220),
    slug,
    title,
    eyebrow: safeString(item.eyebrow || normalizeText(category), 80),
    date: safeString(item.date || formatDisplayDate(publishedAt), 80),
    publishedAt,
    category,
    previewClass:
      safeString(item.previewClass, 80) ||
      PREVIEW_CLASS_BY_CATEGORY[normalizeText(category)] ||
      "thumb-servico",
    sourceName,
    sourceUrl,
    sourceLabel: safeString(item.sourceLabel || sourceName, 180),
    lede: safeString(item.lede || item.summary || item.description || "Sem resumo.", 500),
    summary: safeString(item.summary || item.lede || item.description || "Sem resumo.", 500),
    analysis: safeString(item.analysis || "", 700),
    body: Array.isArray(item.body) ? item.body.map((entry) => safeString(entry, 900)).filter(Boolean) : [],
    highlights: Array.isArray(item.highlights)
      ? item.highlights.map((entry) => safeString(entry, 180)).filter(Boolean)
      : [],
    development: Array.isArray(item.development)
      ? item.development.map((entry) => safeString(entry, 240)).filter(Boolean)
      : [],
    imageUrl: normalizeUrl(item.imageUrl || item.image || "") || "",
    imageCredit: safeString(item.imageCredit || "", 180),
    imageFocus: safeString(item.imageFocus || "", 80),
    imageFit: safeString(item.imageFit || "", 40),
    media: item.media && typeof item.media === "object" ? item.media : null,
    priority: Number(item.priority || 0)
  };
}

function sortArticleItems(left, right) {
  const rightDate = new Date(right.publishedAt || right.date || 0).getTime();
  const leftDate = new Date(left.publishedAt || left.date || 0).getTime();
  if (rightDate !== leftDate) return rightDate - leftDate;
  return Number(right.priority || 0) - Number(left.priority || 0);
}

async function getNormalizedNewsItems(limit = 120) {
  const news = await readStore("news", { updatedAt: null, online: false, items: [] });
  const items = Array.isArray(news.items) ? news.items.map(normalizeArticleItem) : [];
  const map = new Map();

  items.forEach((item) => {
    const key = item.slug || item.sourceUrl || item.id || item.title;
    if (!map.has(key)) {
      map.set(key, item);
    }
  });

  return Array.from(map.values()).sort(sortArticleItems).slice(0, limit);
}

async function refreshNewsAggregator() {
  const allItems = [];
  let online = false;

  for (const source of NEWS_SOURCES) {
    try {
      const response = await fetch(source.url, {
        headers: {
          "User-Agent": "Catalogo-CZS/1.0 (+https://catalogoczs.local)"
        }
      });

      if (!response.ok) continue;
      online = true;
      const xml = await response.text();
      allItems.push(...parseRss(xml, source));
    } catch {
      // sem rede: ignora e segue para o próximo feed
    }
  }

  allItems.sort((a, b) => {
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });

  const data = {
    updatedAt: nowIso(),
    online,
    items: allItems.slice(0, 120)
  };

  await writeStore("news", data);
  return data;
}

function sumBy(items, keyGetter) {
  const bucket = {};
  for (const item of items) {
    const key = keyGetter(item) || "desconhecido";
    bucket[key] = (bucket[key] || 0) + 1;
  }
  return bucket;
}

function average(list) {
  if (!list.length) return 0;
  return list.reduce((acc, value) => acc + Number(value || 0), 0) / list.length;
}

function toCsv(rows) {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const lines = [headers.join(",")];
  for (const row of rows) {
    const line = headers
      .map((key) => {
        const value = String(row[key] ?? "");
        const escaped = value.replace(/"/g, '""');
        return `"${escaped}"`;
      })
      .join(",");
    lines.push(line);
  }
  return lines.join("\n");
}

function getElectionCycle(year) {
  if (year % 4 === 0) return "municipal";
  if (year % 4 === 2) return "geral";
  return "sem-pleito";
}

function getAcreElectionSnapshot(year = new Date().getFullYear(), scope = "federal") {
  const cycle = getElectionCycle(year);
  const normalizedScope = safeString(scope, 20).toLowerCase() || "federal";

  const base = {
    year,
    cycle,
    scope: normalizedScope,
    rankingNacionalUrl: RANKING_POLITICOS_URL,
    officialSource:
      "https://www.tse.jus.br/eleicoes/eleicoes-2026",
    notes: [
      "Candidaturas oficiais dependem de registro e deferimento no TSE.",
      "Este painel usa nomes públicos reais em monitoramento jornalístico/local."
    ]
  };

  const governorPhoto =
    "https://upload.wikimedia.org/wikipedia/commons/f/fa/Foto_oficial_de_Gladson_Cameli.jpg";
  const mailzaPhoto =
    "https://upload.wikimedia.org/wikipedia/commons/0/0b/Foto_oficial_da_senadora_Mailza_Gomes_%28v._AgSen%29.jpg";

  const senateInDispute = [
    {
      id: "marcio-bittar",
      name: "Márcio Bittar",
      party: "PL",
      office: "Senador (Acre)",
      status: "mandato até 2027, vaga em disputa em 2026",
      photoUrl: "https://legis.senado.leg.br/senadores/fotos-oficiais/senador5990.jpg",
      rankUrl: `${RANKING_POLITICOS_URL}?search=Márcio%20Bittar`
    },
    {
      id: "sergio-petecao",
      name: "Sérgio Petecão",
      party: "PSD",
      office: "Senador (Acre)",
      status: "mandato até 2027, vaga em disputa em 2026",
      photoUrl: "https://legis.senado.leg.br/senadores/fotos-oficiais/senador5525.jpg",
      rankUrl: `${RANKING_POLITICOS_URL}?search=Sérgio%20Petecão`
    }
  ];

  const senateCurrentNotInDispute = [
    {
      id: "alan-rick",
      name: "Alan Rick",
      party: "REPUBLICANOS",
      office: "Senador (Acre)",
      status: "mandato até 2031, fora da disputa de 2026",
      photoUrl: "https://legis.senado.leg.br/senadores/fotos-oficiais/senador6331.jpg",
      rankUrl: `${RANKING_POLITICOS_URL}?search=Alan%20Rick`
    }
  ];

  if (cycle === "municipal") {
    return {
      ...base,
      summary:
        "Ano de eleição municipal: foco em prefeitura e câmara municipal.",
      offices: [
        {
          id: "prefeitura-czs",
          office: "Prefeito(a) de Cruzeiro do Sul",
          available: true,
          candidates: [],
          message:
            "Candidaturas oficiais são disponibilizadas pelo TSE após abertura do registro."
        }
      ]
    };
  }

  if (cycle === "geral") {
    if (normalizedScope === "municipal") {
      return {
        ...base,
        summary:
          "Em ano de eleição geral não há eleição para prefeito/vereador.",
        offices: [
          {
            id: "municipal-off",
            office: "Prefeitura/Câmara Municipal",
            available: false,
            message:
              "Não há pleito municipal neste ciclo. No Acre, o foco atual é Governo, Senado e bancadas estadual/federal."
          }
        ]
      };
    }

    const offices = [];

    if (normalizedScope === "estadual" || normalizedScope === "federal") {
      offices.push({
        id: "governo-acre",
        office: "Governo do Acre",
        available: true,
        message:
          "Pré-candidaturas e chapas oficiais dependem de registro no TSE. Abaixo estão nomes públicos reais em monitoramento local.",
        candidates: [
          {
            id: "gladson-cameli",
            name: "Gladson Cameli",
            party: "PP",
            office: "Governador (atual)",
            status: "figura pública real; candidatura oficial depende de registro",
            photoUrl: governorPhoto,
            rankUrl: `${RANKING_POLITICOS_URL}?search=Gladson%20Cameli`
          },
          {
            id: "mailza-assis",
            name: "Mailza Assis",
            party: "PP",
            office: "Vice-governadora (atual)",
            status: "figura pública real; candidatura oficial depende de registro",
            photoUrl: mailzaPhoto,
            rankUrl: `${RANKING_POLITICOS_URL}?search=Mailza%20Assis`
          }
        ]
      });
    }

    if (normalizedScope === "federal" || normalizedScope === "estadual") {
      offices.push({
        id: "senado-acre",
        office: "Senado Federal (Acre) - 2 vagas em disputa",
        available: true,
        sourceUrl: "https://www25.senado.leg.br/web/transparencia/sen/por-uf/-/uf/AC",
        message:
          "No Acre, em 2026, duas cadeiras estão em disputa (mandatos terminando em 2027).",
        candidates: senateInDispute,
        alsoCurrent: senateCurrentNotInDispute
      });
    }

    return {
      ...base,
      summary:
        "Ano de eleição geral: Governo, Senado, Câmara Federal e Assembleia Legislativa.",
      offices
    };
  }

  return {
    ...base,
    summary: "Ano sem pleito nacional principal no calendário regular.",
    offices: []
  };
}

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    service: "catalogo-czs-backend",
    time: nowIso()
  });
});

app.get("/api/auth/config", (_req, res) => {
  res.json({
    ok: true,
    enabled: isCatalogoGoogleAuthEnabled(),
    provider: "google",
    clientId: isCatalogoGoogleAuthEnabled() ? GOOGLE_AUTH_CLIENT_ID : "",
    requiredFor: ["newsletter", "fundadores", "pubpaid", "pagamentos"]
  });
});

app.get("/api/auth/session", (req, res) => {
  res.json({
    ok: true,
    enabled: isCatalogoGoogleAuthEnabled(),
    user: publicAuthUser(readCatalogoAuthSession(req))
  });
});

app.post("/api/auth/google", async (req, res) => {
  try {
    if (!isCatalogoGoogleAuthEnabled()) {
      return res.status(503).json({
        ok: false,
        error: "Login Google ainda nao esta configurado neste ambiente."
      });
    }

    const credential = safeString(req.body?.credential, 6000);
    if (!credential) {
      return res.status(400).json({ ok: false, error: "Credencial Google ausente." });
    }

    const user = await verifyGoogleIdToken(credential);
    setCatalogoAuthCookie(req, res, user);
    return res.json({ ok: true, user: publicAuthUser(user) });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      error: safeString(error?.message || "Falha ao validar o login Google.", 240)
    });
  }
});

app.post("/api/auth/logout", (req, res) => {
  clearCatalogoAuthCookie(req, res);
  res.json({ ok: true });
});

app.post("/api/subscriptions", async (req, res) => {
  const body = req.body || {};
  const email = safeEmail(body.email);
  const consent = Boolean(body.consent);
  const tracking = buildTrackingMeta(req, body);

  if (!email || !consent) {
    return res.status(400).json({
      ok: false,
      error: "email válido e consentimento são obrigatórios."
    });
  }

  const subscriptions = await readStore("subscriptions", []);
  const existing = subscriptions.find((item) => item.email === email);

  if (existing) {
    return res.json({
      ok: true,
      duplicated: true,
      subscription: existing
    });
  }

  const subscription = {
    id: buildId("sub"),
    name: safeString(body.name, 120),
    email,
    whatsapp: safeString(body.whatsapp, 40),
    interests: Array.isArray(body.interests)
      ? body.interests.map((x) => safeString(x, 40)).filter(Boolean)
      : [],
    sourcePage: tracking.pagePath,
    visitorId: tracking.visitorId || tracking.cookieVisitorId,
    sessionId: tracking.sessionId || tracking.cookieSessionId,
    city: tracking.city,
    country: tracking.country,
    ip: tracking.ip,
    referrer: tracking.referrer,
    createdAt: nowIso(),
    consentVersion: safeString(body.consentVersion || "1.0", 20)
  };

  subscriptions.push(subscription);
  await writeStore("subscriptions", subscriptions);

  return res.status(201).json({ ok: true, subscription });
});

app.post("/api/comments", async (req, res) => {
  const body = req.body || {};
  const tracking = buildTrackingMeta(req, body);
  const articleId = safeString(body.articleId || tracking.pagePath || "home-comunidade", 120);
  const message = safeString(body.message, 1000);

  if (!articleId || message.length < 6) {
    return res.status(400).json({
      ok: false,
      error: "articleId e comentário com pelo menos 6 caracteres são obrigatórios."
    });
  }

  const comments = await readStore("comments", []);
  const comment = {
    id: buildId("comment"),
    articleId,
    pagePath: tracking.pagePath,
    author: safeString(body.author || body.name || "Leitor(a)", 80),
    badge: safeString(body.badge || "Comunidade", 80),
    message,
    status: "published",
    visitorId: tracking.visitorId || tracking.cookieVisitorId,
    sessionId: tracking.sessionId || tracking.cookieSessionId,
    city: tracking.city,
    country: tracking.country,
    ip: tracking.ip,
    referrer: tracking.referrer,
    userAgent: tracking.userAgent,
    createdAt: nowIso()
  };

  comments.push(comment);
  await writeStore("comments", comments);

  return res.status(201).json({ ok: true, comment });
});

app.get("/api/comments", async (req, res) => {
  const limit = Math.max(1, Math.min(120, Number(req.query.limit || 24)));
  const comments = await readStore("comments", []);
  const items = comments
    .filter((item) => item.status === "published")
    .slice(-limit)
    .reverse();

  res.json({ ok: true, total: items.length, items, comments: items });
});

app.get("/api/comments/:articleId", async (req, res) => {
  const articleId = safeString(req.params.articleId, 120);
  const comments = await readStore("comments", []);
  const filtered = comments
    .filter((item) => item.articleId === articleId && item.status === "published")
    .slice(-120)
    .reverse();

  res.json({ ok: true, total: filtered.length, comments: filtered });
});

app.post("/api/analytics/visit", async (req, res) => {
  const body = req.body || {};
  const visits = await readStore("visits", []);
  const tracking = buildTrackingMeta(req, body);

  const visit = {
    id: buildId("visit"),
    visitorId: tracking.visitorId || tracking.cookieVisitorId || buildId("visitor"),
    sessionId: tracking.sessionId || tracking.cookieSessionId || buildId("session"),
    cookieVisitorId: tracking.cookieVisitorId,
    cookieSessionId: tracking.cookieSessionId,
    pagePath: tracking.pagePath,
    pageTitle: tracking.pageTitle,
    referrer: tracking.referrer,
    referrerHost: tracking.referrerHost,
    deviceType: tracking.deviceType,
    browser: tracking.browser,
    language: tracking.language,
    timezone: tracking.timezone,
    screen: tracking.screen,
    viewport: tracking.viewport,
    platform: tracking.platform,
    city: tracking.city,
    country: tracking.country,
    ip: tracking.ip,
    userAgent: tracking.userAgent,
    trackingConsent: tracking.trackingConsent,
    trackingMethod: tracking.trackingMethod,
    consentSource: tracking.consentSource,
    cookiesEnabled: tracking.cookiesEnabled,
    storageEnabled: tracking.storageEnabled,
    utmSource: tracking.utmSource,
    utmMedium: tracking.utmMedium,
    utmCampaign: tracking.utmCampaign,
    utmContent: tracking.utmContent,
    utmTerm: tracking.utmTerm,
    at: nowIso()
  };

  visits.push(visit);
  await writeStore("visits", visits);

  res.status(201).json({
    ok: true,
    visitId: visit.id,
    sessionId: visit.sessionId,
    visitorId: visit.visitorId
  });
});

app.post("/api/analytics/heartbeat", async (req, res) => {
  const body = req.body || {};
  const tracking = buildTrackingMeta(req, body);
  const sessionId = tracking.sessionId || tracking.cookieSessionId;
  const visitorId = tracking.visitorId || tracking.cookieVisitorId;
  const durationSec = Math.max(0, Number(body.durationSec || 0));

  if (!sessionId || !visitorId || !durationSec) {
    return res.status(400).json({
      ok: false,
      error: "sessionId, visitorId e durationSec são obrigatórios."
    });
  }

  const heartbeats = await readStore("heartbeats", []);
  const hb = {
    id: buildId("hb"),
    sessionId,
    visitorId,
    pagePath: tracking.pagePath,
    durationSec: Math.min(durationSec, 600),
    pageTitle: tracking.pageTitle,
    at: nowIso()
  };

  heartbeats.push(hb);
  await writeStore("heartbeats", heartbeats);

  res.status(201).json({ ok: true });
});

app.post("/api/votes", async (req, res) => {
  const body = req.body || {};
  const tracking = buildTrackingMeta(req, body);
  const candidateName = safeString(body.candidateName, 120);
  const office = safeString(body.office, 120);
  const scope = safeString(body.scope, 30);

  if (!candidateName || !office) {
    return res.status(400).json({
      ok: false,
      error: "candidateName e office são obrigatórios."
    });
  }

  const votes = await readStore("votes", []);
  const vote = {
    id: buildId("vote"),
    candidateId: safeString(body.candidateId, 120),
    candidateName,
    office,
    scope: scope || "indefinido",
    sourcePage: tracking.pagePath,
    rankingUrl: normalizeUrl(body.rankingUrl) || RANKING_POLITICOS_URL,
    visitorId: tracking.visitorId || tracking.cookieVisitorId,
    sessionId: tracking.sessionId || tracking.cookieSessionId,
    city: tracking.city,
    country: tracking.country,
    ip: tracking.ip,
    referrer: tracking.referrer,
    userAgent: tracking.userAgent,
    browser: tracking.browser,
    deviceType: tracking.deviceType,
    at: nowIso()
  };

  votes.push(vote);
  await writeStore("votes", votes);

  res.status(201).json({ ok: true, vote });
});

app.get("/api/votes/summary", async (req, res) => {
  const scope = safeString(req.query.scope, 40).toLowerCase();
  const votes = await readStore("votes", []);
  const filtered = scope
    ? votes.filter((item) => String(item.scope || "").toLowerCase() === scope)
    : votes;

  const byCandidate = sumBy(
    filtered,
    (item) => `${item.candidateName} (${item.office})`
  );

  const top = Object.entries(byCandidate)
    .map(([label, total]) => ({ label, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 15);

  res.json({
    ok: true,
    totalVotes: filtered.length,
    top
  });
});

app.get("/api/news/aggregator", async (req, res) => {
  const news = await readStore("news", { updatedAt: null, online: false, items: [] });
  const limit = Math.max(1, Math.min(120, Number(req.query.limit || 30)));
  const category = safeString(req.query.category, 40).toLowerCase();

  const items = (news.items || []).filter((item) => {
    if (!category) return true;
    return String(item.category || "").toLowerCase() === category;
  });

  res.json({
    ok: true,
    updatedAt: news.updatedAt,
    online: news.online,
    total: items.length,
    items: items.slice(0, limit)
  });
});

app.get("/api/news", async (req, res) => {
  const limit = Math.max(1, Math.min(200, Number(req.query.limit || 60)));
  const items = await getNormalizedNewsItems(limit);

  res.json({
    ok: true,
    total: items.length,
    items
  });
});

app.get("/api/news/:slug", async (req, res) => {
  const targetSlug = safeString(req.params.slug, 180);
  const items = await getNormalizedNewsItems(500);
  const item = items.find((entry) => entry.slug === targetSlug);

  if (!item) {
    return res.status(404).json({
      ok: false,
      error: "noticia nao encontrada"
    });
  }

  res.json({
    ok: true,
    item
  });
});

app.post("/api/news/refresh", async (_req, res) => {
  const data = await refreshNewsAggregator();
  res.json({
    ok: true,
    updatedAt: data.updatedAt,
    online: data.online,
    total: data.items.length
  });
});

app.get("/api/elections/acre", (req, res) => {
  const year = Number(req.query.year || new Date().getFullYear());
  const scope = safeString(req.query.scope || "federal", 20);
  const data = getAcreElectionSnapshot(year, scope);

  res.json({
    ok: true,
    ...data
  });
});

app.get("/api/elections/ranking", (_req, res) => {
  res.json({
    ok: true,
    url: RANKING_POLITICOS_URL
  });
});

app.get("/api/sales/listings", async (req, res) => {
  const category = req.query.category ? normalizeSalesCategory(req.query.category) : "";
  const limit = Math.max(1, Math.min(200, Number(req.query.limit || 80)));
  const listings = await readStore("salesListings", []);
  const items = (Array.isArray(listings) ? listings : [])
    .filter((item) => !item.status || item.status === "publicado")
    .filter((item) => !category || category === "outros" || normalizeSalesCategory(item.category) === category)
    .sort((left, right) => new Date(right.createdAt || 0).getTime() - new Date(left.createdAt || 0).getTime())
    .slice(0, limit)
    .map(publicSalesListing);

  res.json({
    ok: true,
    total: items.length,
    updatedAt: new Date().toISOString(),
    items
  });
});

app.post("/api/sales/listings", async (req, res) => {
  const title = safeString(req.body.title || req.body.item || req.body.product, 120);
  const phone = safeString(req.body.phone || req.body.whatsapp, 32).replace(/[^\d()+\-\s]/g, "");

  if (!title || !phone) {
    return res.status(400).json({
      ok: false,
      error: "Informe o item que quer vender e um telefone ou WhatsApp para contato."
    });
  }

  const listings = await readStore("salesListings", []);
  const nextItem = {
    id: `sale-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`,
    title,
    category: normalizeSalesCategory(req.body.category || req.body.type),
    categoryLabel: safeString(req.body.categoryLabel || req.body.category || "Outros", 80),
    price: safeString(req.body.price || req.body.value || "A combinar", 60),
    condition: safeString(req.body.condition || "nao informado", 80),
    deliveryMode: safeString(req.body.deliveryMode || req.body.delivery || "combinar com vendedor", 120),
    sellerName: safeString(req.body.sellerName || req.body.name || "Vendedor local", 90),
    phone,
    city: safeString(req.body.city || "Cruzeiro do Sul - AC", 90),
    neighborhood: safeString(req.body.neighborhood || req.body.bairro, 90),
    description: safeString(req.body.description || req.body.details, 1200),
    status: "publicado",
    createdAt: new Date().toISOString()
  };
  const next = Array.isArray(listings) ? listings : [];
  next.push(nextItem);
  await writeStore("salesListings", next);

  res.status(201).json({
    ok: true,
    item: nextItem,
    message: "Item publicado na lista de vendas."
  });
});

app.post("/api/vr-rental/leads", async (req, res) => {
  const name = safeString(req.body.name || req.body.customerName, 100);
  const phone = safeString(req.body.phone || req.body.whatsapp || req.body.contactPhone, 32).replace(/[^\d()+\-\s]/g, "");

  if (!name || !phone) {
    return res.status(400).json({
      ok: false,
      error: "Informe nome e WhatsApp para reservar o aluguel VR."
    });
  }

  const leads = await readStore("vrRentalLeads", []);
  const nextItem = {
    id: `vr-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`,
    type: "aluguel-vr",
    name,
    phone,
    email: safeEmail(req.body.email),
    rentalDate: safeString(req.body.date || req.body.rentalDate || req.body.eventDate, 40),
    period: safeString(req.body.period || req.body.time || "a combinar", 60),
    package: safeString(req.body.package || req.body.plan || "experiencia rapida", 100),
    notes: safeString(req.body.notes || req.body.message || req.body.details, 700),
    status: "novo",
    sourcePage: safeString(req.body.sourcePage || "/games.html", 260),
    visitorId: safeString(req.body.visitorId || req.body.cookieVisitorId, 120),
    sessionId: safeString(req.body.sessionId || req.body.cookieSessionId, 120),
    city: safeString(req.body.city, 80),
    country: safeString(req.body.country, 80),
    createdAt: nowIso()
  };
  const next = Array.isArray(leads) ? leads : [];
  next.push(nextItem);
  await writeStore("vrRentalLeads", next);

  res.status(201).json({
    ok: true,
    item: nextItem,
    message: "Pedido de aluguel VR salvo."
  });
});

app.get("/api/ninjas/opportunities", (_req, res) => {
  const items = [
    {
      id: "sine-acre-painel-vagas",
      kind: "vaga",
      badge: "Sine Acre",
      city: "Acre / confirmar lotacao local",
      title: "Painel estadual com vagas para vendas, recepcao, construcao e suporte",
      summary: "Lista publica para acompanhar vagas abertas e pedir encaminhamento conforme disponibilidade.",
      publishedLabel: "Pesquisa em 14 de abril de 2026",
      deadlineLabel: "Atualizacao continua",
      status: "aberto",
      sourceUrl: "https://sine.ac.gov.br/vagas/"
    },
    {
      id: "ufac-tae-2026",
      kind: "concurso",
      badge: "UFAC",
      city: "Rio Branco e Cruzeiro do Sul",
      title: "Concurso tecnico-administrativo da UFAC com provas em Cruzeiro do Sul",
      summary: "Inscricoes de 6 de abril de 2026 a 7 de maio de 2026, com edital oficial.",
      publishedLabel: "31 de mar. de 2026",
      deadlineLabel: "7 de mai. de 2026",
      status: "inscricoes abertas",
      sourceUrl:
        "https://www3.ufac.br/prodgep/2026/edital-no-1-de-30-de-marco-de-2026-concurso-publico-para-carreira-tecnico-administrativa-em-educacao"
    }
  ];
  res.json({
    ok: true,
    updatedAt: "2026-04-14",
    updatedLabel: "14 de abr. de 2026",
    total: items.length,
    items
  });
});

app.get("/api/ninjas/pix", async (req, res) => {
  if (!NINJAS_PIX_KEY) {
    return res.status(503).json({ ok: false, error: "Pagamento Pix indisponivel no momento." });
  }
  const payload = await buildNinjasPixConfig({
    amount: req.query.amount || NINJAS_PIX_DEFAULT_AMOUNT,
    txid: req.query.txid || "",
    description: req.query.description || req.query.label || "Ninjas Cruzeiro"
  });
  res.json({ ok: true, ...payload });
});

app.get("/api/pubpaid/deposit/pix", async (req, res) => {
  const authUser = readCatalogoAuthSession(req);
  if (!authUser) {
    return res.status(401).json({
      ok: false,
      error: "Entre com Google para gerar o QR code de deposito."
    });
  }

  try {
    const amount = normalizePubpaidAmount(req.query.amount, 10);
    const txid = normalizePixToken(req.query.txid || `PUB${Date.now()}`, 25);
    const pix = await buildNinjasPixConfig({
      amount,
      txid,
      description: req.query.description || "PubPaid Creditos"
    });
    return res.json({
      ok: true,
      amount,
      credits: Math.floor(amount),
      txid: pix.txid,
      qrSvg: pix.qrSvg,
      keyVisible: false,
      confirmationMode: "manual"
    });
  } catch (error) {
    const missingPix = String(error?.message || "") === "pix-key-not-configured";
    return res.status(missingPix ? 503 : 500).json({
      ok: false,
      error: missingPix ? "Pix ainda nao configurado no servidor." : "Nao foi possivel gerar o QR do PubPaid."
    });
  }
});

app.post("/api/pubpaid/deposits", async (req, res) => {
  const authUser = readCatalogoAuthSession(req);
  if (!authUser) {
    return res.status(401).json({
      ok: false,
      error: "Entre com Google para registrar o deposito."
    });
  }

  const body = req.body || {};
  const amount = normalizePubpaidAmount(body.amount, 10);
  const txid = normalizePixToken(body.paymentTxid || body.txid || `PUB${Date.now()}`, 25) || `PUB${Date.now()}`;
  const depositorName = safeString(body.depositorName || body.depositName || body.payerName || "", 90);
  if (!depositorName || depositorName.length < 3) {
    return res.status(400).json({
      ok: false,
      error: "Informe o nome de quem fez o Pix para a conferencia manual."
    });
  }

  const deposits = await readStore("pubpaidDeposits", []);
  const tracking = buildTrackingMeta(req, body);
  const reviewDeadlineAt = new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString();
  const item = {
    id: buildId("pubdep"),
    type: "pubpaid-deposito",
    user: publicPubpaidUser(authUser),
    depositorName,
    walletKey: getPubpaidWalletKey(authUser),
    amount,
    creditsRequested: Math.floor(amount),
    reference: txid,
    payment: {
      method: "pix-qr-code",
      keyVisible: false,
      txid,
      depositorName,
      status: "pendente-manual",
      confirmationMode: "manual"
    },
    status: "pendente-manual",
    reviewDeadlineAt,
    tracking,
    createdAt: nowIso()
  };
  const next = Array.isArray(deposits) ? deposits : [];
  next.push(item);
  await writeStore("pubpaidDeposits", next);

  return res.status(201).json({
    ok: true,
    item,
    message: "Deposito PubPaid registrado. Os creditos ficam pendentes por ate 3 horas ou ate a confirmacao manual no admin."
  });
});

app.get("/api/pubpaid/account", async (req, res) => {
  const authUser = readCatalogoAuthSession(req);
  if (!authUser) {
    return res.status(401).json({
      ok: false,
      error: "Entre com Google para abrir a carteira do PubPaid."
    });
  }

  const wallet = await getOrCreatePubpaidWallet(authUser);
  const deposits = ensureArrayItems(await readStore("pubpaidDeposits", []));
  const withdrawals = ensureArrayItems(await readStore("pubpaidWithdrawals", []));
  const walletKey = getPubpaidWalletKey(authUser);
  const pendingDeposits = (Array.isArray(deposits) ? deposits : []).filter(
    (item) => item.walletKey === walletKey && isPubpaidPendingStatus(item?.payment?.status || item?.status)
  );
  const pendingWithdrawals = (Array.isArray(withdrawals) ? withdrawals : []).filter(
    (item) => item.walletKey === walletKey && isPubpaidPendingStatus(item?.payment?.status || item?.status)
  );

  return res.json({
    ok: true,
    user: publicPubpaidUser(authUser),
    wallet: {
      ...wallet,
      balanceCoins: Math.floor(Number(wallet.balance || 0))
    },
    pending: {
      deposits: pendingDeposits.length,
      withdrawals: pendingWithdrawals.length
    }
  });
});

app.post("/api/pubpaid/withdrawals", async (req, res) => {
  const authUser = readCatalogoAuthSession(req);
  if (!authUser) {
    return res.status(401).json({
      ok: false,
      error: "Entre com Google para pedir retirada."
    });
  }

  const amount = Math.max(1, Math.floor(Number(req.body?.amount || 0)));
  const wallet = await getOrCreatePubpaidWallet(authUser);
  if (amount > Number(wallet.balance || 0)) {
    return res.status(400).json({
      ok: false,
      error: "Saldo insuficiente para pedir retirada."
    });
  }

  const walletKey = getPubpaidWalletKey(authUser);
  const withdrawals = ensureArrayItems(await readStore("pubpaidWithdrawals", []));
  const item = {
    id: buildId("pubwd"),
    type: "pubpaid-retirada",
    user: publicPubpaidUser(authUser),
    walletKey,
    amount,
    status: "pendente-manual",
    reference: normalizePixToken(req.body?.reference || `PUBWD${Date.now()}`, 25),
    payment: {
      method: "manual",
      status: "pendente-manual",
      confirmationMode: "manual"
    },
    reviewDeadlineAt: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
    tracking: buildTrackingMeta(req, req.body || {}),
    createdAt: nowIso()
  };
  withdrawals.push(item);
  await writeStore("pubpaidWithdrawals", withdrawals);

  const nextWallet = await updatePubpaidWallet(walletKey, (current) => ({
    ...current,
    balance: Math.max(0, Number(current.balance || 0) - amount),
    withdrawalsApproved: Number(current.withdrawalsApproved || 0)
  }));

  return res.status(201).json({
    ok: true,
    item,
    wallet: {
      ...nextWallet,
      balanceCoins: Math.floor(Number(nextWallet?.balance || 0))
    },
    message: "Retirada PubPaid enviada para confirmacao manual."
  });
});

app.post("/api/ninjas/requests", async (req, res) => {
  const service = safeString(req.body.service || req.body.requestTitle || req.body.requestType, 140);
  const phone = safeString(req.body.phone || req.body.whatsapp || req.body.contactPhone, 32).replace(/[^\d()+\-\s]/g, "");

  if (!service || !phone) {
    return res.status(400).json({
      ok: false,
      error: "Informe pelo menos o servico desejado e um telefone para contato."
    });
  }

  const requests = await readStore("ninjasRequests", []);
  const paymentTxid = normalizePixToken(req.body.paymentTxid || req.body.txid || `NJSREQ${Date.now()}`, 25);
  const nextItem = {
    id: `njr-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`,
    type: "pedido-servico",
    name: safeString(req.body.name || "Cliente local", 80),
    phone,
    neighborhood: safeString(req.body.neighborhood || req.body.bairro, 80),
    city: safeString(req.body.city || "Cruzeiro do Sul - AC", 80),
    service,
    details: safeString(req.body.details || req.body.description, 1200),
    budget: safeString(req.body.budget, 40),
    urgency: safeString(req.body.urgency || "normal", 40),
    availability: safeString(req.body.availability, 120),
    status: "aguardando-confirmacao-pix",
    payment: {
      amount: NINJAS_PIX_DEFAULT_AMOUNT,
      method: "pix-qr-code",
      keyVisible: false,
      txid: paymentTxid,
      status: "pendente-manual",
      confirmationMode: "manual"
    },
    createdAt: new Date().toISOString()
  };
  const next = Array.isArray(requests) ? requests : [];
  next.push(nextItem);
  await writeStore("ninjasRequests", next);

  res.status(201).json({
    ok: true,
    item: nextItem,
    message: "Pedido recebido. Agora o Pix de R$ 5,00 precisa ser confirmado manualmente."
  });
});

app.post("/api/ninjas/profiles", async (req, res) => {
  const name = safeString(req.body.name, 80);
  const area = safeString(req.body.area || req.body.role || req.body.profession, 90);

  if (!name || !area) {
    return res.status(400).json({
      ok: false,
      error: "Preencha pelo menos nome e area principal para montar o perfil."
    });
  }

  const rawPlan = normalizeText(req.body.plan || "gratis");
  const plan = rawPlan === "destaque" || rawPlan === "creditos" || rawPlan === "creditos-pro" ? rawPlan : "gratis";
  const paymentAmount = plan === "gratis" ? 0 : Math.max(5, Math.min(100, parseCurrency(req.body.paymentAmount, 5)));
  const profiles = await readStore("ninjasProfiles", []);
  const nextItem = {
    id: `njp-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`,
    type: "perfil-profissional",
    name,
    area,
    city: safeString(req.body.city || "Cruzeiro do Sul - AC", 80),
    phone: safeString(req.body.phone || req.body.whatsapp, 32).replace(/[^\d()+\-\s]/g, ""),
    email: safeEmail(req.body.email),
    plan,
    credits: getNinjasCreditsFromPlan(plan, paymentAmount),
    status: paymentAmount ? "aguardando-confirmacao-pix" : "perfil-gratuito-recebido",
    payment: {
      amount: paymentAmount,
      method: paymentAmount ? "pix-qr-code" : "none",
      keyVisible: false,
      txid: paymentAmount ? normalizePixToken(req.body.paymentTxid || req.body.txid || `NJSPRO${Date.now()}`, 25) : "",
      status: paymentAmount ? "pendente-manual" : "nao-aplicavel",
      confirmationMode: paymentAmount ? "manual" : "none"
    },
    resume: {
      objective: safeString(req.body.objective, 220),
      summary: safeString(req.body.summary, 900),
      experience: safeString(req.body.experience, 1200),
      education: safeString(req.body.education, 800),
      skills: String(req.body.skills || "")
        .split(/\r?\n|,/)
        .map((item) => safeString(item, 60))
        .filter(Boolean)
        .slice(0, 14)
    },
    createdAt: new Date().toISOString()
  };
  const next = Array.isArray(profiles) ? profiles : [];
  next.push(nextItem);
  await writeStore("ninjasProfiles", next);

  res.status(201).json({
    ok: true,
    item: nextItem,
    message:
      paymentAmount > 0
        ? "Perfil recebido. O destaque ou pacote sera liberado apos confirmacao manual do Pix."
        : "Curriculo recebido no plano gratuito."
  });
});

app.use("/api/admin", requireAdmin);

app.get("/api/admin/dashboard", async (req, res) => {
  const from = req.query.from ? new Date(String(req.query.from)) : null;
  const to = req.query.to ? new Date(String(req.query.to)) : null;

  const visits = await readStore("visits", []);
  const heartbeats = await readStore("heartbeats", []);
  const votes = await readStore("votes", []);
  const comments = await readStore("comments", []);
  const subscriptions = await readStore("subscriptions", []);
  const ninjasRequests = await readStore("ninjasRequests", []);
  const ninjasProfiles = await readStore("ninjasProfiles", []);
  const salesListings = await readStore("salesListings", []);
  const vrRentalLeads = await readStore("vrRentalLeads", []);
  const pubpaidDeposits = await readStore("pubpaidDeposits", []);
  const pubpaidWithdrawals = await readStore("pubpaidWithdrawals", []);
  const pubpaidWallets = await readStore("pubpaidWallets", []);
  const storageInfo = store.describe();

  const inRange = (dateStr) => {
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return false;
    if (from && date < from) return false;
    if (to && date > to) return false;
    return true;
  };

  const visitsR = visits.filter((item) => inRange(item.at));
  const hbR = heartbeats.filter((item) => inRange(item.at));
  const votesR = votes.filter((item) => inRange(item.at));
  const commentsR = comments.filter((item) => inRange(item.createdAt));
  const subscriptionsR = subscriptions.filter((item) => inRange(item.createdAt));
  const ninjasRequestsR = (Array.isArray(ninjasRequests) ? ninjasRequests : []).filter((item) => inRange(item.createdAt));
  const ninjasProfilesR = (Array.isArray(ninjasProfiles) ? ninjasProfiles : []).filter((item) => inRange(item.createdAt));
  const salesListingsR = (Array.isArray(salesListings) ? salesListings : []).filter((item) => inRange(item.createdAt));
  const vrRentalLeadsR = (Array.isArray(vrRentalLeads) ? vrRentalLeads : []).filter((item) => inRange(item.createdAt));
  const pubpaidDepositsR = (Array.isArray(pubpaidDeposits) ? pubpaidDeposits : []).filter((item) => inRange(item.createdAt));
  const pubpaidWithdrawalsR = (Array.isArray(pubpaidWithdrawals) ? pubpaidWithdrawals : []).filter((item) => inRange(item.createdAt));
  const pubpaidWalletsR = Array.isArray(pubpaidWallets) ? pubpaidWallets : [];
  const pendingPubpaidDeposits = pubpaidDepositsR.filter((item) =>
    isPubpaidPendingStatus(item?.payment?.status || item?.status)
  );
  const pendingPubpaidWithdrawals = pubpaidWithdrawalsR.filter((item) =>
    isPubpaidPendingStatus(item?.payment?.status || item?.status)
  );

  const uniqueVisitors = new Set(visitsR.map((item) => item.visitorId).filter(Boolean));
  const uniqueSessions = new Set(visitsR.map((item) => item.sessionId).filter(Boolean));

  const byDevice = sumBy(visitsR, (item) => item.deviceType || "desconhecido");
  const byBrowser = sumBy(visitsR, (item) => item.browser || "Outro");
  const byCity = sumBy(visitsR, (item) => item.city || "não informado");
  const byCountry = sumBy(visitsR, (item) => item.country || "não informado");
  const byIp = sumBy(visitsR, (item) => item.ip || "não informado");
  const byReferrer = sumBy(visitsR, (item) => summarizeReferrer(item.referrer));
  const byConsent = sumBy(visitsR, (item) => item.trackingConsent || "desconhecido");
  const byPage = sumBy(visitsR, (item) => item.pagePath || "/");

  const avgHeartbeat = average(hbR.map((item) => Number(item.durationSec || 0)));

  const sessionDuration = {};
  for (const hb of hbR) {
    const key = hb.sessionId || "unknown";
    sessionDuration[key] = (sessionDuration[key] || 0) + Number(hb.durationSec || 0);
  }
  const avgSession = average(Object.values(sessionDuration));

  const topPages = Object.entries(byPage)
    .map(([pagePath, total]) => ({ pagePath, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 12);

  const voteBoard = Object.entries(
    sumBy(votesR, (item) => `${item.candidateName} (${item.office})`)
  )
    .map(([candidate, total]) => ({ candidate, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 15);

  const recentVisits = sortByDateDesc(visitsR, "at", 24).map((item) => ({
    at: item.at,
    pagePath: item.pagePath || "/",
    pageTitle: item.pageTitle || "",
    city: item.city || "não informado",
    country: item.country || "não informado",
    browser: item.browser || "Outro",
    ip: item.ip || "não informado",
    visitorId: item.visitorId || "",
    referrerHost: item.referrerHost || summarizeReferrer(item.referrer)
  }));

  const recentComments = sortByDateDesc(
    commentsR.filter((item) => item.status === "published"),
    "createdAt",
    18
  ).map((item) => ({
    createdAt: item.createdAt,
    author: item.author || "Leitor(a)",
    badge: item.badge || "Comunidade",
    message: item.message || "",
    articleId: item.articleId || item.pagePath || "home",
    city: item.city || "não informado",
    ip: item.ip || "não informado"
  }));

  const recentVotes = sortByDateDesc(votesR, "at", 18).map((item) => ({
    at: item.at,
    candidateName: item.candidateName || "Não informado",
    office: item.office || "Não informado",
    scope: item.scope || "indefinido",
    city: item.city || "não informado",
    ip: item.ip || "não informado",
    sourcePage: item.sourcePage || "/"
  }));

  const recentSubscriptions = sortByDateDesc(subscriptionsR, "createdAt", 18).map((item) => ({
    createdAt: item.createdAt,
    name: item.name || "Sem nome",
    email: item.email || "",
    whatsapp: item.whatsapp || "",
    sourcePage: item.sourcePage || "/",
    city: item.city || "não informado",
    ip: item.ip || "não informado"
  }));

  const recentNinjasRequests = sortByDateDesc(ninjasRequestsR, "createdAt", 12).map((item) => ({
    createdAt: item.createdAt,
    type: item.type || "pedido",
    name: item.name || "",
    phone: item.phone || "",
    service: item.service || item.area || "",
    status: item.status || "",
    paymentStatus: item?.payment?.status || "",
    txid: item?.payment?.txid || ""
  }));

  const recentNinjasProfiles = sortByDateDesc(ninjasProfilesR, "createdAt", 12).map((item) => ({
    createdAt: item.createdAt,
    name: item.name || "",
    area: item.area || "",
    plan: item.plan || "gratis",
    credits: item.credits || 0,
    status: item.status || "",
    phone: item.phone || "",
    paymentStatus: item?.payment?.status || "",
    txid: item?.payment?.txid || ""
  }));

  const recentSalesListings = sortByDateDesc(salesListingsR, "createdAt", 12).map((item) => ({
    createdAt: item.createdAt,
    title: item.title || "",
    category: item.category || "",
    price: item.price || "",
    sellerName: item.sellerName || "",
    phone: item.phone || "",
    city: item.city || "",
    status: item.status || ""
  }));

  const recentVrRentalLeads = sortByDateDesc(vrRentalLeadsR, "createdAt", 12).map((item) => ({
    createdAt: item.createdAt,
    name: item.name || "",
    phone: item.phone || "",
    rentalDate: item.rentalDate || "",
    period: item.period || "",
    package: item.package || "",
    status: item.status || "",
    city: item.city || ""
  }));

  const pubpaidRecentDeposits = sortByDateDesc(pubpaidDepositsR, "createdAt", 12).map(summarizePubpaidDeposit);
  const pubpaidRecentWithdrawals = sortByDateDesc(pubpaidWithdrawalsR, "createdAt", 12).map(summarizePubpaidWithdrawal);
  const pubpaidPendingDeposits = sortByDateDesc(pendingPubpaidDeposits, "createdAt", 50).map(summarizePubpaidDeposit);
  const pubpaidPendingWithdrawals = sortByDateDesc(pendingPubpaidWithdrawals, "createdAt", 50).map(summarizePubpaidWithdrawal);
  const pubpaidWalletRows = sortByDateDesc(pubpaidWalletsR, "updatedAt", 50).map((item) => ({
    walletKey: item.walletKey || "",
    email: item?.user?.email || "",
    name: item?.user?.name || "",
    balance: item.balance || 0,
    locked: Boolean(item.locked),
    depositsApproved: item.depositsApproved || 0,
    withdrawalsApproved: item.withdrawalsApproved || 0,
    updatedAt: item.updatedAt || item.createdAt
  }));

  const collectionInventory = [
    ["visits", "Acessos e paginas vistas", visitsR.length, "analytics-client.js -> /api/analytics/visit"],
    ["heartbeats", "Tempo de permanencia", hbR.length, "analytics-client.js -> /api/analytics/heartbeat"],
    ["comments", "Comentarios e opinioes", commentsR.length, "formularios publicos -> /api/comments"],
    ["subscriptions", "Apoiadores, fundadores e emails", subscriptionsR.length, "newsletter/apoie -> /api/subscriptions"],
    ["votes", "Pesquisas politicas e clima eleitoral", votesR.length, "votos locais -> /api/votes"],
    ["ninjasRequests", "Pedidos Ninjas de clientes", ninjasRequestsR.length, "ninjas.html -> /api/ninjas/requests"],
    ["ninjasProfiles", "Curriculos e trabalhadores Ninjas", ninjasProfilesR.length, "ninjas.html -> /api/ninjas/profiles"],
    ["salesListings", "Pagina filha de vendas", salesListingsR.length, "vendas.html -> /api/sales/listings"],
    ["vrRentalLeads", "Pedidos de aluguel VR", vrRentalLeadsR.length, "games.html popup -> /api/vr-rental/leads"],
    ["pubpaidDeposits", "Depositos PubPaid", pubpaidDepositsR.length, "pubpaid.html -> /api/pubpaid/deposits"],
    ["pubpaidWithdrawals", "Retiradas PubPaid", pubpaidWithdrawalsR.length, "pubpaid.html -> /api/pubpaid/withdrawals"],
    ["pubpaidWallets", "Carteiras PubPaid", pubpaidWalletsR.length, "PubPaid creditos manuais"]
  ].map(([key, label, total, source]) => ({
    key,
    label,
    total,
    source,
    purpose: "Colecao pronta para persistir em arquivo local ou Supabase quando as variaveis do banco estiverem configuradas.",
    readyForDb: true
  }));

  res.json({
    ok: true,
    period: {
      from: from ? from.toISOString() : null,
      to: to ? to.toISOString() : null
    },
    storage: {
      mode: storageInfo.mode,
      target: storageInfo.mode === "supabase" ? storageInfo.table : storageInfo.dataDir
    },
    totals: {
      accesses: visitsR.length,
      uniqueVisitors: uniqueVisitors.size,
      uniqueSessions: uniqueSessions.size,
      comments: commentsR.length,
      subscriptions: subscriptionsR.length,
      votes: votesR.length,
      ninjasRequests: ninjasRequestsR.length,
      ninjasProfiles: ninjasProfilesR.length,
      salesListings: salesListingsR.length,
      vrRentalLeads: vrRentalLeadsR.length,
      pubpaidDeposits: pubpaidDepositsR.length,
      pubpaidWithdrawals: pubpaidWithdrawalsR.length,
      pubpaidWallets: pubpaidWalletsR.length,
      pubpaidPendingDeposits: pendingPubpaidDeposits.length,
      pubpaidPendingWithdrawals: pendingPubpaidWithdrawals.length
    },
    engagement: {
      avgHeartbeatSec: Number(avgHeartbeat.toFixed(2)),
      avgSessionSec: Number(avgSession.toFixed(2))
    },
    distributions: {
      device: byDevice,
      browser: byBrowser,
      city: byCity,
      country: byCountry,
      ip: byIp,
      referrer: byReferrer,
      consent: byConsent
    },
    topPages,
    voteBoard,
    topCountries: topEntries(byCountry, "country", 12),
    topIps: topEntries(byIp, "ip", 15),
    topReferrers: topEntries(byReferrer, "referrer", 12),
    recentVisits,
    recentComments,
    recentVotes,
    recentSubscriptions,
    recentNinjasRequests,
    recentNinjasProfiles,
    recentSalesListings,
    recentVrRentalLeads,
    pubpaidPendingDeposits,
    pubpaidPendingWithdrawals,
    pubpaidRecentDeposits,
    pubpaidRecentWithdrawals,
    pubpaidWallets: pubpaidWalletRows,
    collectionInventory
  });
});

app.get("/api/admin/raw/:key", async (req, res) => {
  const key = safeString(req.params.key, 40);
  const limit = Math.max(1, Math.min(500, Number(req.query.limit || 100)));
  const allowed = new Set([
    "subscriptions",
    "comments",
    "visits",
    "heartbeats",
    "votes",
    "ninjasRequests",
    "ninjasProfiles",
    "salesListings",
    "vrRentalLeads",
    "pubpaidDeposits",
    "pubpaidWithdrawals",
    "pubpaidWallets",
    "news"
  ]);

  if (!allowed.has(key)) {
    return res.status(404).json({
      ok: false,
      error: "store nao encontrado"
    });
  }

  const fallback = Object.prototype.hasOwnProperty.call(STORE_DEFAULTS, key)
    ? STORE_DEFAULTS[key]
    : [];
  const data = await readStore(key, fallback);

  if (Array.isArray(data)) {
    return res.json({
      ok: true,
      key,
      total: data.length,
      items: data.slice(-limit).reverse()
    });
  }

  res.json({
    ok: true,
    key,
    data
  });
});

app.post("/api/admin/pubpaid/deposits/review", async (req, res) => {
  const id = safeString(req.body?.id, 80);
  const approve = safeString(req.body?.decision || req.body?.status, 40).toLowerCase() === "approve";
  if (!id) return res.status(400).json({ ok: false, error: "ID do deposito ausente." });

  const deposits = ensureArrayItems(await readStore("pubpaidDeposits", []));
  const index = deposits.findIndex((item) => String(item?.id || "") === id);
  if (index < 0) return res.status(404).json({ ok: false, error: "Deposito PubPaid nao encontrado." });
  const current = deposits[index];
  if (!isPubpaidPendingStatus(current?.payment?.status || current?.status)) {
    return res.status(400).json({ ok: false, error: "Esse deposito ja foi revisado." });
  }

  const nextItem = {
    ...current,
    status: approve ? "creditos-liberados" : "deposito-rejeitado",
    payment: {
      ...(current.payment || {}),
      status: approve ? "confirmado-manual" : "rejeitado-manual"
    },
    reviewedAt: nowIso(),
    reviewedBy: "admin",
    reviewNote: safeString(req.body?.note, 240)
  };
  deposits[index] = nextItem;
  await writeStore("pubpaidDeposits", deposits);

  let wallet = null;
  if (approve) {
    wallet = await creditPubpaidWallet(current.user, current.creditsRequested || current.amount || 0, {
      depositId: current.id
    });
  }

  return res.json({ ok: true, item: nextItem, wallet });
});

app.post("/api/admin/pubpaid/withdrawals/review", async (req, res) => {
  const id = safeString(req.body?.id, 80);
  if (!id) return res.status(400).json({ ok: false, error: "ID da retirada ausente." });

  const withdrawals = ensureArrayItems(await readStore("pubpaidWithdrawals", []));
  const index = withdrawals.findIndex((item) => String(item?.id || "") === id);
  if (index < 0) return res.status(404).json({ ok: false, error: "Retirada PubPaid nao encontrada." });
  const approve = safeString(req.body?.decision || req.body?.status, 40).toLowerCase() === "approve";
  withdrawals[index] = {
    ...withdrawals[index],
    status: approve ? "retirada-liberada" : "retirada-rejeitada",
    payment: {
      ...(withdrawals[index].payment || {}),
      status: approve ? "confirmado-manual" : "rejeitado-manual"
    },
    reviewedAt: nowIso(),
    reviewedBy: "admin",
    reviewNote: safeString(req.body?.note, 240)
  };
  await writeStore("pubpaidWithdrawals", withdrawals);
  return res.json({ ok: true, item: withdrawals[index] });
});

app.get("/api/admin/reports/access.csv", async (_req, res) => {
  const visits = await readStore("visits", []);
  const rows = visits.map((item) => ({
    at: item.at,
    visitorId: item.visitorId,
    sessionId: item.sessionId,
    cookieVisitorId: item.cookieVisitorId,
    cookieSessionId: item.cookieSessionId,
    pagePath: item.pagePath,
    pageTitle: item.pageTitle,
    referrer: item.referrer,
    referrerHost: item.referrerHost,
    deviceType: item.deviceType,
    browser: item.browser,
    language: item.language,
    timezone: item.timezone,
    screen: item.screen,
    viewport: item.viewport,
    platform: item.platform,
    city: item.city,
    country: item.country,
    ip: item.ip,
    trackingConsent: item.trackingConsent,
    trackingMethod: item.trackingMethod,
    consentSource: item.consentSource,
    cookiesEnabled: item.cookiesEnabled,
    storageEnabled: item.storageEnabled,
    utmSource: item.utmSource,
    utmMedium: item.utmMedium,
    utmCampaign: item.utmCampaign,
    utmContent: item.utmContent,
    utmTerm: item.utmTerm
  }));

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", "attachment; filename=acessos_catalogo_czs.csv");
  res.send(toCsv(rows));
});

app.get("/api/admin/reports/votes.csv", async (_req, res) => {
  const votes = await readStore("votes", []);
  const rows = votes.map((item) => ({
    at: item.at,
    candidateName: item.candidateName,
    office: item.office,
    scope: item.scope,
    sourcePage: item.sourcePage,
    rankingUrl: item.rankingUrl,
    visitorId: item.visitorId,
    sessionId: item.sessionId,
    city: item.city,
    country: item.country,
    ip: item.ip,
    browser: item.browser,
    deviceType: item.deviceType
  }));

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", "attachment; filename=votos_catalogo_czs.csv");
  res.send(toCsv(rows));
});

app.get("/api/admin/reports/comments.csv", async (_req, res) => {
  const comments = await readStore("comments", []);
  const rows = comments.map((item) => ({
    createdAt: item.createdAt,
    articleId: item.articleId,
    pagePath: item.pagePath,
    author: item.author,
    badge: item.badge,
    message: item.message,
    status: item.status,
    visitorId: item.visitorId,
    sessionId: item.sessionId,
    city: item.city,
    country: item.country,
    ip: item.ip
  }));

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", "attachment; filename=comentarios_catalogo_czs.csv");
  res.send(toCsv(rows));
});

app.get("/api/admin/reports/subscriptions.csv", async (_req, res) => {
  const subscriptions = await readStore("subscriptions", []);
  const rows = subscriptions.map((item) => ({
    createdAt: item.createdAt,
    name: item.name,
    email: item.email,
    whatsapp: item.whatsapp,
    interests: Array.isArray(item.interests) ? item.interests.join(" | ") : "",
    sourcePage: item.sourcePage,
    visitorId: item.visitorId,
    sessionId: item.sessionId,
    city: item.city,
    country: item.country,
    ip: item.ip
  }));

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", "attachment; filename=assinaturas_catalogo_czs.csv");
  res.send(toCsv(rows));
});

app.get("/api/admin/reports/pubpaid-deposits.csv", async (_req, res) => {
  const deposits = await readStore("pubpaidDeposits", []);
  const rows = (Array.isArray(deposits) ? deposits : []).map((item) => ({
    createdAt: item.createdAt,
    player: item.user?.name || item.name,
    email: item.user?.email || item.email,
    depositorName: item.depositorName || item.payment?.depositorName,
    amount: item.amount,
    creditsRequested: item.creditsRequested,
    status: item.status,
    paymentStatus: item.payment?.status,
    txid: item.payment?.txid,
    reference: item.reference,
    reviewedAt: item.reviewedAt,
    reviewedBy: item.reviewedBy,
    reviewNote: item.reviewNote,
    sourcePage: item.tracking?.pagePath || item.sourcePage,
    ip: item.tracking?.ip
  }));

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", "attachment; filename=pubpaid_depositos.csv");
  res.send(toCsv(rows));
});

app.get("/api/admin/reports/pubpaid-withdrawals.csv", async (_req, res) => {
  const withdrawals = await readStore("pubpaidWithdrawals", []);
  const rows = (Array.isArray(withdrawals) ? withdrawals : []).map(summarizePubpaidWithdrawal);
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", "attachment; filename=pubpaid_retiradas.csv");
  res.send(toCsv(rows));
});

app.get("/api/admin/reports/pubpaid-wallets.csv", async (_req, res) => {
  const wallets = await readStore("pubpaidWallets", []);
  const rows = (Array.isArray(wallets) ? wallets : []).map((item) => ({
    walletKey: item.walletKey,
    player: item.user?.name,
    email: item.user?.email,
    balance: item.balance,
    depositsApproved: item.depositsApproved,
    withdrawalsApproved: item.withdrawalsApproved,
    locked: item.locked,
    updatedAt: item.updatedAt,
    createdAt: item.createdAt
  }));
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", "attachment; filename=pubpaid_carteiras.csv");
  res.send(toCsv(rows));
});

app.get("/", (_req, res) => {
  res.json({
    ok: true,
    service: "Catálogo Cruzeiro do Sul backend",
    docs: "/admin/admin-dashboard.html",
    time: nowIso()
  });
});

async function boot() {
  await ensureStore();
  if (NEWS_REFRESH_ENABLED) {
    await refreshNewsAggregator();
    setInterval(refreshNewsAggregator, 30 * 60 * 1000);
  }

  const storageInfo = store.describe();

  app.listen(PORT, HOST, () => {
    console.log(`[catalogo-czs-backend] online em http://${HOST}:${PORT}`);
    console.log(`[catalogo-czs-backend] storage: ${storageInfo.mode} (${storageInfo.mode === "supabase" ? storageInfo.table : storageInfo.dataDir})`);
    console.log(`[catalogo-czs-backend] news refresh automatico: ${NEWS_REFRESH_ENABLED ? "ativo" : "desativado"}`);
  });
}

boot().catch((error) => {
  console.error("[catalogo-czs-backend] falha ao iniciar", error);
  process.exit(1);
});
