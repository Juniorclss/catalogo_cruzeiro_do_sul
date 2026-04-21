#!/usr/bin/env node
"use strict";

const http = require("node:http");
const https = require("node:https");

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    const next = argv[index + 1];
    if (next && !next.startsWith("--")) {
      args[key] = next;
      index += 1;
    } else {
      args[key] = true;
    }
  }
  return args;
}

function requestJson(targetUrl, token) {
  return new Promise((resolve, reject) => {
    const url = new URL(targetUrl);
    const client = url.protocol === "https:" ? https : http;
    const req = client.request(
      url,
      {
        method: "GET",
        headers: token
          ? {
              "X-Admin-Token": token,
              Accept: "application/json"
            }
          : {
              Accept: "application/json"
            },
        timeout: 20000
      },
      (res) => {
        let raw = "";
        res.setEncoding("utf8");
        res.on("data", (chunk) => {
          raw += chunk;
        });
        res.on("end", () => {
          let payload = null;
          try {
            payload = raw ? JSON.parse(raw) : null;
          } catch (error) {
            return reject(new Error(`Resposta nao e JSON: ${error.message}`));
          }

          if (res.statusCode < 200 || res.statusCode >= 300) {
            return reject(
              new Error(`HTTP ${res.statusCode}: ${payload?.error || payload?.message || raw || "falha"}`)
            );
          }

          resolve(payload);
        });
      }
    );

    req.on("timeout", () => {
      req.destroy(new Error("Timeout ao consultar o storage do deploy."));
    });
    req.on("error", reject);
    req.end();
  });
}

function printReport(payload) {
  console.log(`Storage target: ${payload?.storage?.target || "-"}`);
  console.log(`DATA_DIR por env: ${payload?.storage?.configuredByEnv ? "sim" : "nao"}`);
  console.log(`Persistencia esperada: ${payload?.storage?.persistentExpected ? "sim" : "nao"}`);
  console.log(`Respostas SPO: ${payload?.acre2026Poll?.responses ?? 0}`);
  console.log("");

  (payload?.checks || []).forEach((check) => {
    const status = check.ok ? "ok" : "falhou";
    const extra = check.error ? ` - ${check.error}` : "";
    console.log(`${status} ${check.name}${extra}`);
  });
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const baseUrl = String(args.url || process.env.RENDER_URL || process.env.SITE_URL || "").replace(/\/+$/, "");
  const token = String(args.token || process.env.ADMIN_TOKEN || "").trim();

  if (!baseUrl) {
    throw new Error("Informe --url ou defina RENDER_URL/SITE_URL.");
  }

  if (!token) {
    throw new Error("Informe --token ou defina ADMIN_TOKEN para acessar /api/admin/storage-health.");
  }

  const payload = await requestJson(`${baseUrl}/api/admin/storage-health`, token);
  printReport(payload);

  if (!payload?.ok || !payload?.storage?.persistentExpected) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error.message || String(error));
  process.exitCode = 1;
});
