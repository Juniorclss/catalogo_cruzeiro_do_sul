/* eslint-disable no-console */
const { createSharedDataStore } = require("../shared-data-store");

const NEWS_INTERVAL_MS = Math.max(
  5 * 60 * 1000,
  Number(process.env.NEWS_INTERVAL_MS || 15 * 60 * 1000)
);
const BIZ_INTERVAL_MS = 24 * 60 * 60 * 1000;
const NEWS_FALLBACK = { updatedAt: null, online: false, items: [] };
const store = createSharedDataStore();

function createReportFallback() {
  return {
    startedAt: new Date().toISOString(),
    runs: [],
    totals: { news: 0, businesses: 0 },
  };
}

const RSS_SOURCES = [
  {
    source: "Agência Brasil - Últimas",
    url: "https://agenciabrasil.ebc.com.br/rss/ultimasnoticias/feed.xml",
    weight: 10,
  },
  {
    source: "g1 Acre",
    url: "https://g1.globo.com/rss/g1/ac/acre/",
    weight: 9,
  },
  {
    source: "Agência de Notícias do Acre",
    url: "https://agencia.ac.gov.br/feed/",
    weight: 9,
  },
  {
    source: "ac24horas",
    url: "https://ac24horas.com/feed/",
    weight: 8,
  },
  {
    source: "G1 Brasil",
    url: "https://g1.globo.com/rss/g1/brasil/",
    weight: 7,
  },
  {
    source: "G1 Política",
    url: "https://g1.globo.com/rss/g1/politica/",
    weight: 7,
  },
  {
    source: "G1 Pop & Arte",
    url: "https://g1.globo.com/rss/g1/pop-arte/",
    weight: 7,
  },
  {
    source: "CNN Brasil",
    url: "https://www.cnnbrasil.com.br/feed/",
    weight: 6,
  },
];

const KEYWORDS = [
  "cruzeiro do sul",
  "jurua",
  "juruá",
  "acre",
  "rio",
  "enchente",
  "economia",
  "saude",
  "saúde",
  "educacao",
  "educação",
  "política",
  "politica",
  "bolsonaro",
  "lula",
  "stf",
  "congresso",
  "senado",
  "cinema",
  "filme",
  "michael jackson",
  "teatro",
  "peça",
  "peca",
  "famosos",
  "celebridade",
  "fofoca",
  "novidade",
  "novidades",
  "entretenimento",
  "cultura",
  "negócios",
  "negocios",
];

const BIZ_QUERIES = [
  { category: "Restaurantes", query: "restaurant" },
  { category: "Farmácias", query: "pharmacy" },
  { category: "Hospitais e Clínicas", query: "hospital" },
  { category: "Mercados", query: "supermarket" },
  { category: "Hotéis e Pousadas", query: "hotel" },
  { category: "Bancos e Finanças", query: "bank" },
  { category: "Combustível", query: "fuel" },
  { category: "Táxi e Transporte", query: "taxi" },
];

async function ensureDataStore() {
  await store.ensure({
    news: NEWS_FALLBACK,
    businesses: [],
    collectorReport: createReportFallback(),
  });
}

function normalize(str) {
  return (str || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function looksRelevant(title, description = "") {
  const text = normalize(`${title} ${description}`);
  return KEYWORDS.some((key) => text.includes(normalize(key)));
}

function categoryByText(textRaw) {
  const text = normalize(textRaw);
  if (text.includes("saude") || text.includes("hospital")) return "Saúde";
  if (text.includes("escola") || text.includes("educacao")) return "Educação";
  if (text.includes("polic") || text.includes("crime")) return "Segurança";
  if (text.includes("prefeitura") || text.includes("governo")) return "Política";
  if (text.includes("bolsonaro") || text.includes("lula") || text.includes("stf") || text.includes("senado")) return "Política";
  if (text.includes("cinema") || text.includes("filme") || text.includes("teatro") || text.includes("cultura")) return "Cultura";
  if (text.includes("celebridade") || text.includes("famos") || text.includes("fofoca")) return "Festas & Social";
  if (text.includes("empreend") || text.includes("comercio") || text.includes("econom")) return "Negócios";
  if (text.includes("clima") || text.includes("rio") || text.includes("enchente")) return "Cotidiano";
  return "Geral";
}

function getEditorialFocusScore(item = {}) {
  const text = normalize(
    [
      item.title,
      item.summary,
      item.category,
      item.location,
      item.source,
      item.url
    ].join(" ")
  );
  const isAcre = /\b(acre|rio branco|sena madureira|feijo|xapuri|brasileia|epitaciolandia|assis brasil|placido de castro)\b/.test(
    text
  );
  const isValeJurua =
    /\b(cruzeiro do sul|jurua|mancio lima|porto walter|marechal thaumaturgo|tarauaca)\b/.test(
      text
    ) || (isAcre && /\brodrigues alves\b/.test(text));
  const isImportant =
    /\b(alerta|urgente|defesa civil|enchente|alag|saude|hospital|seguranca|policia|crime|acidente|educacao|prefeitura|governo|governador|governadora|eleicao|stf|congresso|senado|bolsonaro|lula)\b/.test(
      text
    );
  const isGlobalEntertainment =
    /\b(cinema|filme|trailer|estreia|bilheteria|teatro|peca|famoso|famosa|celebridade|fofoca|michael jackson|entretenimento|novidades|tecnologia|games)\b/.test(
      text
    );

  if (isValeJurua) return 300 + (isImportant ? 40 : 0);
  if (isAcre) return 220 + (isImportant ? 35 : 0);
  if (isImportant) return 80;
  if (isGlobalEntertainment) return 90;
  return 40;
}

function extractRssItems(xml, sourceName) {
  const items = [];
  const itemMatches = xml.match(/<item[\s\S]*?<\/item>/gi) || [];
  itemMatches.forEach((entry) => {
    const title = (entry.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/i) || entry.match(/<title>(.*?)<\/title>/i) || [])[1] || "";
    const link = (entry.match(/<link>(.*?)<\/link>/i) || [])[1] || "";
    const description =
      (entry.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/i) || entry.match(/<description>(.*?)<\/description>/i) || [])[1] || "";
    const pubDate = (entry.match(/<pubDate>(.*?)<\/pubDate>/i) || [])[1] || new Date().toUTCString();

    if (!title || !link) return;
    if (!looksRelevant(title, description)) return;

    const item = {
      id: Buffer.from(link).toString("base64").slice(0, 28),
      title: title.replace(/<[^>]+>/g, "").trim(),
      summary: description.replace(/<[^>]+>/g, "").trim().slice(0, 280),
      url: link.trim(),
      source: sourceName,
      date: new Date(pubDate).toISOString(),
      category: categoryByText(`${title} ${description}`),
      location: /cruzeiro do sul|jurua|juruá|acre/i.test(`${title} ${description}`)
        ? "Acre / Cruzeiro do Sul"
        : "Brasil / Mundo",
      createdAt: new Date().toISOString(),
    };

    items.push(item);
  });

  return items;
}

function dedupeAppend(existing, incoming) {
  const map = new Map();
  existing.forEach((item) => map.set(item.id || item.url || item.title, item));
  incoming.forEach((item) => {
    const key = item.id || item.url || item.title;
    if (!map.has(key)) map.set(key, item);
  });
  return Array.from(map.values()).sort(
    (a, b) => {
      const focus = getEditorialFocusScore(b) - getEditorialFocusScore(a);
      if (focus !== 0) return focus;
      return new Date(b.date || b.createdAt).getTime() - new Date(a.date || a.createdAt).getTime();
    }
  );
}

async function collectNews() {
  const currentStore = await store.read("news", NEWS_FALLBACK);
  const archive = Array.isArray(currentStore) ? currentStore : currentStore.items || [];
  const collected = [];

  for (const source of RSS_SOURCES) {
    try {
      const response = await fetch(source.url, { headers: { "User-Agent": "CatalogoCruzeiroBot/1.0" } });
      if (!response.ok) continue;
      const xml = await response.text();
      const items = extractRssItems(xml, source.source);
      collected.push(...items);
    } catch (_error) {
      // segue para a próxima fonte
    }
  }

  const next = dedupeAppend(archive, collected).slice(0, 200);
  await store.write("news", {
    updatedAt: new Date().toISOString(),
    online: collected.length > 0,
    items: next
  });

  return { previous: archive.length, collected: collected.length, total: next.length };
}

function buildOverpassQuery(tagValue) {
  return `
[out:json][timeout:60];
area["name"="Cruzeiro do Sul"]["boundary"="administrative"]->.searchArea;
(
  nwr["amenity"="${tagValue}"](area.searchArea);
  nwr["shop"="${tagValue}"](area.searchArea);
  nwr["office"="${tagValue}"](area.searchArea);
  nwr["tourism"="${tagValue}"](area.searchArea);
);
out center tags;
`;
}

function normalizePhone(raw) {
  return (raw || "").replace(/[^\d+]/g, "");
}

async function collectBusinesses() {
  const current = await store.read("businesses", []);
  const found = [];

  for (const queryInfo of BIZ_QUERIES) {
    try {
      const response = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
        body: `data=${encodeURIComponent(buildOverpassQuery(queryInfo.query))}`,
      });

      if (!response.ok) continue;
      const data = await response.json();
      const elements = Array.isArray(data?.elements) ? data.elements : [];

      elements.forEach((el) => {
        const tags = el.tags || {};
        const name = (tags.name || "").trim();
        if (!name) return;

        found.push({
          id: `${queryInfo.category}-${name}-${tags.phone || tags["contact:phone"] || ""}`
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-"),
          name,
          category: queryInfo.category,
          phone: normalizePhone(tags.phone || tags["contact:phone"] || ""),
          whatsapp: normalizePhone(tags["contact:whatsapp"] || ""),
          address: [tags["addr:street"], tags["addr:housenumber"], tags["addr:suburb"]]
            .filter(Boolean)
            .join(", "),
          website: tags.website || tags["contact:website"] || "",
          source: "OpenStreetMap / Overpass",
          lat: el.lat || el.center?.lat || null,
          lon: el.lon || el.center?.lon || null,
          city: "Cruzeiro do Sul",
          state: "AC",
          updatedAt: new Date().toISOString(),
        });
      });
    } catch (_error) {
      // segue para próxima categoria
    }
  }

  const map = new Map();
  current.forEach((item) => map.set(item.id || `${item.name}-${item.phone}`, item));
  found.forEach((item) => {
    const key = item.id || `${item.name}-${item.phone}`;
    if (!map.has(key)) {
      map.set(key, item);
    } else {
      const previous = map.get(key);
      map.set(key, { ...previous, ...item, firstSeenAt: previous.firstSeenAt || previous.updatedAt });
    }
  });

  const merged = Array.from(map.values())
    .map((item) => ({ ...item, firstSeenAt: item.firstSeenAt || item.updatedAt }))
    .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));

  await store.write("businesses", merged);
  return { previous: current.length, collected: found.length, total: merged.length };
}

async function writeReport(partial) {
  const report = await store.read("collectorReport", createReportFallback());

  report.runs.push({ time: new Date().toISOString(), ...partial });
  report.runs = report.runs.slice(-500);
  if (partial.news?.total) report.totals.news = partial.news.total;
  if (partial.business?.total) report.totals.businesses = partial.business.total;
  report.lastUpdate = new Date().toISOString();

  await store.write("collectorReport", report);
}

async function fullRun() {
  await ensureDataStore();
  const news = await collectNews();
  const business = await collectBusinesses();
  await writeReport({ news, business });
  console.log(
    `[catalogo-worker] news: +${news.collected} (total ${news.total}) | business: +${business.collected} (total ${business.total})`
  );
}

async function newsOnlyRun() {
  await ensureDataStore();
  const news = await collectNews();
  await writeReport({ news });
  console.log(`[catalogo-worker] news tick: +${news.collected} (total ${news.total})`);
}

async function businessOnlyRun() {
  await ensureDataStore();
  const business = await collectBusinesses();
  await writeReport({ business });
  console.log(`[catalogo-worker] business tick: +${business.collected} (total ${business.total})`);
}

const RUN_ONCE = process.argv.includes("--once") || process.env.RUN_ONCE === "1";

async function boot() {
  const storageInfo = store.describe();
  console.log(
    `[catalogo-worker] storage: ${storageInfo.mode} (${storageInfo.mode === "supabase" ? storageInfo.table : storageInfo.dataDir})`
  );
  await fullRun();

  if (RUN_ONCE) {
    return;
  }

  setInterval(newsOnlyRun, NEWS_INTERVAL_MS);
  setInterval(businessOnlyRun, BIZ_INTERVAL_MS);
}

if (require.main === module) {
  boot().catch((error) => {
    console.error("[catalogo-worker] fatal", error);
    process.exitCode = 1;
  });
}

module.exports = {
  fullRun,
};
