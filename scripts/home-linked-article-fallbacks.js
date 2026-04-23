"use strict";

const fs = require("node:fs");
const path = require("node:path");

const ROOT_DIR = path.resolve(__dirname, "..");
const INDEX_FILE = path.join(ROOT_DIR, "index.html");

function decodeHtml(value = "") {
  return String(value || "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&#039;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function stripHtml(value = "") {
  return decodeHtml(String(value || "").replace(/<[^>]+>/g, " "));
}

function normalizeSlug(value = "") {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/^\/+|\/+$/g, "")
    .replace(/[_\s]+/g, "-")
    .replace(/-+/g, "-");
}

function slugify(value = "") {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

function extractImageUrl(block = "") {
  const directPatterns = [
    /data-image-url="([^"]+)"/i,
    /data-source-image="([^"]+)"/i,
    /--bg-image:url\('([^']+)'\)/i,
    /background-image:url\('([^']+)'\)/i
  ];

  for (const pattern of directPatterns) {
    const match = block.match(pattern);
    if (match?.[1]) {
      return decodeHtml(match[1]);
    }
  }

  return "";
}

function extractTitle(block = "") {
  const patterns = [/<h1[^>]*>([\s\S]*?)<\/h1>/i, /<h2[^>]*>([\s\S]*?)<\/h2>/i, /<h3[^>]*>([\s\S]*?)<\/h3>/i, /<strong[^>]*>([\s\S]*?)<\/strong>/i];
  for (const pattern of patterns) {
    const match = block.match(pattern);
    const text = stripHtml(match?.[1] || "");
    if (text && text.length > 10) {
      return text;
    }
  }
  return "";
}

function extractSummary(block = "") {
  const paragraphs = [...block.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
    .map((match) => stripHtml(match[1]))
    .filter(Boolean)
    .filter((text) => text.length > 20);

  return paragraphs[0] || "";
}

function extractSourceText(block = "") {
  const sourcePatterns = [
    /<span class="news-source">([\s\S]*?)<\/span>/i,
    /<span>\s*Fonte consultada:\s*([\s\S]*?)<\/span>/i,
    /<span>\s*Fonte:\s*([\s\S]*?)<\/span>/i,
    /<small>([\s\S]*?)<\/small>/i
  ];

  for (const pattern of sourcePatterns) {
    const text = stripHtml((block.match(pattern) || [])[1] || "");
    if (text) {
      return text;
    }
  }

  return "";
}

function inferCategory(block = "", title = "", sourceText = "") {
  const haystack = `${block} ${title} ${sourceText}`.toLowerCase();
  if (haystack.includes("thumb-saude") || haystack.includes(" saúde") || haystack.includes("ubs")) return "Saude";
  if (haystack.includes("thumb-politica") || haystack.includes("governo") || haystack.includes("comissionados")) return "Politica";
  if (haystack.includes("thumb-policia") || haystack.includes("presa") || haystack.includes("facção") || haystack.includes("faccion")) return "Policia";
  if (haystack.includes("thumb-educacao") || haystack.includes("ifac") || haystack.includes("eja")) return "Educacao";
  if (haystack.includes("thumb-cultura") || haystack.includes("cultura") || haystack.includes("artistas")) return "Cultura";
  if (haystack.includes("thumb-social") || haystack.includes("social") || haystack.includes("pascoa")) return "Social";
  if (haystack.includes("thumb-servico") || haystack.includes("utilidade")) return "Utilidade Publica";
  if (haystack.includes("thumb-cheia") || haystack.includes("rio") || haystack.includes("vazante") || haystack.includes("cheia")) return "Cotidiano";
  if (haystack.includes("thumb-rede")) return "Festas & Social";
  return "Cotidiano";
}

function buildFallbackArticleFromBlock(block = "") {
  const slugMatch = block.match(/noticia\.html\?slug=([^"'&#>\s]+)/i);
  const slug = normalizeSlug(decodeURIComponent(slugMatch?.[1] || ""));
  if (!slug) {
    return null;
  }

  const title = extractTitle(block);
  if (!title) {
    return null;
  }

  const summary = extractSummary(block);
  const sourceText = extractSourceText(block);
  const imageUrl = extractImageUrl(block);
  const sourceParts = sourceText.split("•").map((part) => part.trim()).filter(Boolean);
  const sourceName = sourceParts[0] || "Fonte local";
  const dateLabel = sourceParts.slice(1).join(" • ") || "data recente";
  const category = inferCategory(block, title, sourceText);
  const body = [
    summary || `${title} aparece na home do Catalogo como um dos assuntos que merecem leitura completa.`,
    `A chamada publicada na capa remete a ${sourceName}, com recorte principal em ${category.toLowerCase()} e leitura voltada ao que isso muda para o publico do portal.`,
    "Esta materia foi reconstruida automaticamente a partir da chamada editorial da home para evitar quebra de leitura enquanto a ficha completa e sincronizada na base principal."
  ].filter(Boolean);

  return {
    id: slugify(`home-linked-${slug}`) || slug,
    slug,
    title,
    eyebrow: category.toLowerCase(),
    date: dateLabel,
    publishedAt: "",
    category,
    previewClass: "",
    sourceName,
    sourceUrl: "",
    sourceLabel: title,
    imageUrl,
    feedImageUrl: imageUrl,
    sourceImageUrl: imageUrl,
    imageCredit: imageUrl ? `Imagem usada na chamada da home para ${sourceName}` : "",
    lede: summary || title,
    summary: summary || title,
    analysis: `A chamada da home indica um assunto considerado relevante pelo portal e foi convertida em fallback legivel para impedir erro de abertura em ${slug}.`,
    body,
    highlights: [title, sourceText || sourceName, category].filter(Boolean),
    development: [
      `Fallback montado a partir da chamada da home para o slug ${slug}.`,
      "A recomendacao editorial e sincronizar depois a ficha completa com fonte, data, imagem e corpo integral.",
      imageUrl ? "A imagem veio da propria chamada publicada na home." : "Sem imagem fixa na chamada; a pagina pode seguir sem foto ate a fonte completa ser vinculada."
    ]
  };
}

function parseHomeLinkedArticleFallbacks(html = "") {
  const sourceHtml = String(html || fs.readFileSync(INDEX_FILE, "utf8"));
  const blocks = [
    ...sourceHtml.matchAll(/<article\b[\s\S]*?<\/article>/gi),
    ...sourceHtml.matchAll(/<a class="mini-story"[\s\S]*?<\/a>/gi)
  ].map((match) => match[0]);

  const map = new Map();
  blocks.forEach((block) => {
    if (!/noticia\.html\?slug=/i.test(block)) {
      return;
    }
    const article = buildFallbackArticleFromBlock(block);
    if (!article?.slug || map.has(article.slug)) {
      return;
    }
    map.set(article.slug, article);
  });

  return Array.from(map.values());
}

function auditHomeLinkedArticleIntegrity({ homeHtml = "", knownSlugs = [] } = {}) {
  const fallbackItems = parseHomeLinkedArticleFallbacks(homeHtml);
  const fallbackSlugs = fallbackItems.map((item) => item.slug);
  const known = new Set((knownSlugs || []).map((value) => normalizeSlug(value)).filter(Boolean));
  const missing = fallbackItems
    .filter((item) => !known.has(item.slug))
    .map((item) => ({
      slug: item.slug,
      title: item.title,
      sourceName: item.sourceName,
      hasImage: Boolean(item.imageUrl)
    }));

  return {
    checkedAt: new Date().toISOString(),
    totalHomeLinked: fallbackItems.length,
    missingCount: missing.length,
    missing,
    withoutImageCount: fallbackItems.filter((item) => !item.imageUrl).length
  };
}

module.exports = {
  parseHomeLinkedArticleFallbacks,
  auditHomeLinkedArticleIntegrity
};
