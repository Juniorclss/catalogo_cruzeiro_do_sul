#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { URL } = require("node:url");

const ROOT_DIR = path.resolve(__dirname, "..");
const REPORT_DIR = path.join(ROOT_DIR, ".codex-temp", "review-team");
const REPORT_JSON_FILE = path.join(REPORT_DIR, "latest-report.json");
const REPORT_MD_FILE = path.join(REPORT_DIR, "latest-report.md");
const FALLBACK_FILE = path.join(ROOT_DIR, "data", "topic-feed-fallback.json");
const BACKEND_SOURCE_FILE = path.join(ROOT_DIR, "backend", "source-config.js");
const SERVER_FILE = path.join(ROOT_DIR, "server.js");
const SELF_FILE = path.resolve(__filename);

const SKIP_DIRS = new Set([
  ".git",
  "node_modules",
  ".codex-temp",
  ".codex-memory",
  ".codex-review-team",
  ".chrome-headless-codex",
  ".edge-headless",
  "recovered-chat-assets",
  "recovered-vscode-chat-assets"
]);

const FRONT_EXTENSIONS = new Set([".html", ".js"]);

const INTERNAL_COPY_PATTERNS = [
  {
    id: "placeholder",
    label: "placeholder ou copy provisoria",
    regex: /\b(lorem ipsum|wireframe|preencher depois|texto provis[oó]rio|copy provis[oó]ria)\b|(?:^|[\s/])(?:todo|to-do)\s*:/i
  },
  {
    id: "loading",
    label: "texto temporario de carregamento",
    regex: /\b(carregando|loading|em breve)\b/i,
    ignore: [
      /\breadyState\s*===?\s*["']loading["']/i,
      /\bloading\s*=\s*["'][^"']+["']/i,
      /\bloading\s*:\s*["'][^"']+["']/i,
      /\(\?:data\|srcset\|sizes\|loading\|decoding/i
    ]
  },
  {
    id: "internal-editorial",
    label: "linguagem interna/editorial",
    regex: /\b(briefing|pauta|interno|para o criador|leitura editorial|monitoramento ativo|painel interno|fechando pauta)\b/i,
    ignore: [
      /\bclass=(["'])[^"']*briefing[^"']*\1/i,
      /\blogo-splash-briefing-bubble\b/i
    ]
  },
  {
    id: "demo",
    label: "linguagem de demo ou teste",
    regex: /\b(modo demo|teste local|ambiente de teste|prot[oó]tipo)\b/i
  }
];

const CARD_CLASS_PATTERN = /\b(card|panel|tile|spotlight|feature|story)\b/i;

function walkFiles(dir, results = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  entries.forEach((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) {
        return;
      }

      walkFiles(fullPath, results);
      return;
    }

    if (FRONT_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
      if (path.resolve(fullPath) === SELF_FILE) {
        return;
      }

      results.push(fullPath);
    }
  });

  return results;
}

function readText(filePath) {
  return fs.readFileSync(filePath, "utf-8");
}

function normalizePath(filePath) {
  return path.relative(ROOT_DIR, filePath).replace(/\\/g, "/");
}

function stripTags(value) {
  return String(value || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function lineNumberFromIndex(source, index) {
  return source.slice(0, index).split(/\r?\n/).length;
}

function pushIssue(store, issue) {
  store.push(issue);
}

function hasInteractiveHook(attrText = "") {
  return /\b(data-[a-z0-9:_-]+|onclick=|onchange=|onsubmit=|form=|aria-controls=|popovertarget=|commandfor=)\b/i.test(
    attrText
  );
}

function hasStructuralHook(attrText = "") {
  return /\b(id|class|name)=(["'])([^"']+)\2/i.test(attrText);
}

function hasButtonPurpose(attrText = "") {
  return /\btype=(["'])(submit|reset)\1/i.test(attrText) || hasInteractiveHook(attrText) || hasStructuralHook(attrText);
}

function extractIds(source) {
  const ids = new Set();
  const pattern = /\bid=(["'])([^"']+)\1/gi;
  let match = pattern.exec(source);

  while (match) {
    ids.add(match[2]);
    match = pattern.exec(source);
  }

  return ids;
}

function collectGlobalHtmlIds(files) {
  const ids = new Set();

  files.forEach((filePath) => {
    if (path.extname(filePath).toLowerCase() !== ".html") {
      return;
    }

    extractIds(readText(filePath)).forEach((id) => ids.add(id));
  });

  return ids;
}

function auditButtonsAndLinks(filePath, source, issues, globalIds) {
  const ids = extractIds(source);

  const buttonPattern = /<button\b([^>]*)>([\s\S]*?)<\/button>/gi;
  let buttonMatch = buttonPattern.exec(source);
  while (buttonMatch) {
    const attrs = buttonMatch[1] || "";
    const innerHtml = buttonMatch[2] || "";
    const text = stripTags(innerHtml);
    const line = lineNumberFromIndex(source, buttonMatch.index);
    const hasAriaLabel = /\baria-label=(["'])([^"']+)\1/i.test(attrs);

    if (!hasButtonPurpose(attrs)) {
      pushIssue(issues, {
        type: "cta-review",
        severity: "medium",
        file: normalizePath(filePath),
        line,
        label: "Botao sem indicio claro de funcao",
        detail: text || "botao sem texto legivel"
      });
    }

    if (!text && !hasAriaLabel) {
      pushIssue(issues, {
        type: "a11y-review",
        severity: "medium",
        file: normalizePath(filePath),
        line,
        label: "Botao sem texto visivel e sem aria-label",
        detail: "Adicionar rotulo acessivel"
      });
    }

    buttonMatch = buttonPattern.exec(source);
  }

  const anchorPattern = /<a\b([^>]*)href=(["'])([^"']+)\2([^>]*)>([\s\S]*?)<\/a>/gi;
  let anchorMatch = anchorPattern.exec(source);
  while (anchorMatch) {
    const beforeAttrs = anchorMatch[1] || "";
    const href = String(anchorMatch[3] || "").trim();
    const afterAttrs = anchorMatch[4] || "";
    const attrs = `${beforeAttrs} ${afterAttrs}`.trim();
    const text = stripTags(anchorMatch[5] || "");
    const line = lineNumberFromIndex(source, anchorMatch.index);
    const hasAriaLabel = /\baria-label=(["'])([^"']+)\1/i.test(attrs);

    if (href === "#" && !hasInteractiveHook(attrs)) {
      pushIssue(issues, {
        type: "cta-review",
        severity: "high",
        file: normalizePath(filePath),
        line,
        label: "Link com href=\"#\" sem funcao visivel",
        detail: text || "link sem texto legivel"
      });
    }

    if (href.startsWith("#") && href.length > 1 && !ids.has(href.slice(1)) && !globalIds.has(href.slice(1)) && !hasInteractiveHook(attrs)) {
      pushIssue(issues, {
        type: "link-review",
        severity: "high",
        file: normalizePath(filePath),
        line,
        label: "Ancora aponta para ID inexistente",
        detail: href
      });
    }

    if (!text && !hasAriaLabel) {
      pushIssue(issues, {
        type: "a11y-review",
        severity: "medium",
        file: normalizePath(filePath),
        line,
        label: "Link sem texto visivel e sem aria-label",
        detail: href || "link sem href legivel"
      });
    }

    anchorMatch = anchorPattern.exec(source);
  }
}

function auditInternalCopy(filePath, source, issues) {
  const lines = source.split(/\r?\n/);
  lines.forEach((lineText, index) => {
    INTERNAL_COPY_PATTERNS.forEach((pattern) => {
      if (Array.isArray(pattern.ignore) && pattern.ignore.some((ignorePattern) => ignorePattern.test(lineText))) {
        return;
      }

      if (!pattern.regex.test(lineText)) {
        return;
      }

      pushIssue(issues, {
        type: "editorial-review",
        severity: "medium",
        file: normalizePath(filePath),
        line: index + 1,
        label: `Texto com cara de ${pattern.label}`,
        detail: lineText.trim().slice(0, 220)
      });
    });
  });
}

function auditCardTitles(filePath, source, issues) {
  if (path.extname(filePath).toLowerCase() !== ".html") {
    return;
  }

  const blockPattern =
    /<(article|div|section)\b([^>]*)class=(["'])([^"']*)\3[^>]*>([\s\S]*?)<\/\1>/gi;

  let match = blockPattern.exec(source);
  while (match) {
    const attrs = match[2] || "";
    const className = match[4] || "";
    const inner = match[5] || "";
    const line = lineNumberFromIndex(source, match.index);
    const hasCardLikeClass = CARD_CLASS_PATTERN.test(className);
    const hasMedia = /<(img|picture|video|iframe)\b/i.test(inner);
    const hasTitle = /<(h1|h2|h3|h4|h5|h6|strong)\b/i.test(inner) || /\baria-label=(["'])([^"']+)\1/i.test(attrs);

    if (hasCardLikeClass && hasMedia && !hasTitle) {
      pushIssue(issues, {
        type: "ui-review",
        severity: "medium",
        file: normalizePath(filePath),
        line,
        label: "Card com midia sem titulo evidente",
        detail: className
      });
    }

    match = blockPattern.exec(source);
  }
}

function getDomain(urlValue) {
  try {
    const hostname = new URL(urlValue).hostname.replace(/^www\./, "");
    return /^[a-z0-9.-]+$/i.test(hostname) ? hostname : "";
  } catch {
    return "";
  }
}

function auditSourceCoverage() {
  const fallback = JSON.parse(fs.readFileSync(FALLBACK_FILE, "utf-8"));
  const topicSummary = Object.entries(fallback).map(([topic, items]) => {
    const safeItems = Array.isArray(items) ? items : [];
    const uniqueSources = new Set(safeItems.map((item) => String(item.sourceName || "").trim()).filter(Boolean));
    const uniqueDomains = new Set(safeItems.map((item) => getDomain(item.sourceUrl)).filter(Boolean));

    return {
      topic,
      items: safeItems.length,
      uniqueSources: uniqueSources.size,
      uniqueDomains: uniqueDomains.size,
      status: uniqueDomains.size >= 4 ? "ok" : "review"
    };
  });

  const backendSourceDomains = Array.from(
    new Set(
      (readText(BACKEND_SOURCE_FILE).match(/https?:\/\/[^\s"']+/g) || [])
        .map((urlValue) => getDomain(urlValue))
        .filter(Boolean)
    )
  ).sort();

  const serverFeedDomains = Array.from(
    new Set(
      (readText(SERVER_FILE).match(/https?:\/\/[^\s"']+/g) || [])
        .map((urlValue) => getDomain(urlValue))
        .filter(Boolean)
    )
  ).sort();

  return {
    topicSummary,
    backendSourceDomains,
    serverFeedDomains
  };
}

function ensureReportDir() {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
}

function getSeverityWeight(severity) {
  if (severity === "high") {
    return 0;
  }

  if (severity === "medium") {
    return 1;
  }

  return 2;
}

function sortIssues(issues) {
  return [...issues].sort((left, right) => {
    const severityDiff = getSeverityWeight(left.severity) - getSeverityWeight(right.severity);
    if (severityDiff !== 0) {
      return severityDiff;
    }

    const fileDiff = left.file.localeCompare(right.file);
    if (fileDiff !== 0) {
      return fileDiff;
    }

    return left.line - right.line;
  });
}

function buildTopFilesSummary(issues) {
  const counts = new Map();

  issues.forEach((issue) => {
    counts.set(issue.file, (counts.get(issue.file) || 0) + 1);
  });

  return [...counts.entries()]
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .slice(0, 12)
    .map(([file, count]) => ({ file, count }));
}

function buildMarkdownReport(report) {
  const lines = [
    "# Review Team Report",
    "",
    `Generated: ${report.generatedAt}`,
    "",
    "## Summary",
    "",
    `- Arquivos auditados: ${report.summary.filesAudited}`,
    `- Achados totais: ${report.summary.totalIssues}`,
    `- CTA / links: ${report.summary.byType["cta-review"] || 0}`,
    `- Editorial: ${report.summary.byType["editorial-review"] || 0}`,
    `- UI / cards: ${report.summary.byType["ui-review"] || 0}`,
    `- Acessibilidade: ${report.summary.byType["a11y-review"] || 0}`,
    `- Links quebrados: ${report.summary.byType["link-review"] || 0}`,
    "",
    "## Priority Files",
    "",
    ...(report.summary.topFiles.length
      ? report.summary.topFiles.map((item) => `- ${item.file}: ${item.count} achados`)
      : ["- Nenhum arquivo concentrando achados."]),
    "",
    "## Findings",
    ""
  ];

  if (!report.issues.length) {
    lines.push("- Nenhum achado encontrado nesta rodada.");
  } else {
    report.issues.forEach((issue) => {
      lines.push(
        `- [${issue.severity}] ${issue.label} - ${issue.file}:${issue.line} - ${issue.detail}`
      );
    });
  }

  lines.push("", "## Source Coverage", "");
  report.sources.topicSummary.forEach((topic) => {
    lines.push(
      `- ${topic.topic}: ${topic.items} itens, ${topic.uniqueSources} fontes, ${topic.uniqueDomains} dominios (${topic.status})`
    );
  });

  lines.push("", "## Runtime Source Domains", "");
  report.sources.serverFeedDomains.forEach((domain) => {
    lines.push(`- ${domain}`);
  });

  return `${lines.join("\n")}\n`;
}

function main() {
  const files = walkFiles(ROOT_DIR);
  const globalHtmlIds = collectGlobalHtmlIds(files);
  const issues = [];

  files.forEach((filePath) => {
    const source = readText(filePath);
    auditButtonsAndLinks(filePath, source, issues, globalHtmlIds);
    auditInternalCopy(filePath, source, issues);
    auditCardTitles(filePath, source, issues);
  });

  const sources = auditSourceCoverage();
  const sortedIssues = sortIssues(issues);

  const summary = sortedIssues.reduce(
    (acc, issue) => {
      acc.totalIssues += 1;
      acc.byType[issue.type] = (acc.byType[issue.type] || 0) + 1;
      return acc;
    },
    {
      filesAudited: files.length,
      totalIssues: 0,
      byType: {},
      topFiles: []
    }
  );
  summary.topFiles = buildTopFilesSummary(sortedIssues);

  const report = {
    generatedAt: new Date().toISOString(),
    summary,
    issues: sortedIssues,
    sources
  };

  ensureReportDir();
  fs.writeFileSync(REPORT_JSON_FILE, `${JSON.stringify(report, null, 2)}\n`, "utf-8");
  fs.writeFileSync(REPORT_MD_FILE, buildMarkdownReport(report), "utf-8");

  console.log(
    JSON.stringify(
      {
        reportJson: normalizePath(REPORT_JSON_FILE),
        reportMd: normalizePath(REPORT_MD_FILE),
        filesAudited: report.summary.filesAudited,
        totalIssues: report.summary.totalIssues
      },
      null,
      2
    )
  );
}

main();
