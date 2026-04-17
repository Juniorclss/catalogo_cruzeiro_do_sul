const dns = require("node:dns").promises
const https = require("node:https")

function parseArgs(argv) {
  const result = {
    domain: "catalogocruzeirodosul.com.br",
    renderHost: "",
    timeoutMs: 10000
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]

    if (arg === "--domain" && argv[index + 1]) {
      result.domain = String(argv[index + 1]).trim()
      index += 1
      continue
    }

    if (arg === "--render-host" && argv[index + 1]) {
      result.renderHost = String(argv[index + 1]).trim()
      index += 1
      continue
    }

    if (arg === "--timeout" && argv[index + 1]) {
      const timeout = Number(argv[index + 1])
      if (Number.isFinite(timeout) && timeout > 0) {
        result.timeoutMs = timeout
      }
      index += 1
    }
  }

  return result
}

async function resolveRecord(hostname, rrtype) {
  try {
    const answer = await dns.resolve(hostname, rrtype)
    return { ok: true, type: rrtype, value: answer }
  } catch (error) {
    return {
      ok: false,
      type: rrtype,
      error: error && error.code ? error.code : String(error && error.message ? error.message : error)
    }
  }
}

function requestHead(url, timeoutMs) {
  return new Promise((resolve) => {
    const request = https.request(
      url,
      {
        method: "HEAD",
        timeout: timeoutMs
      },
      (response) => {
        resolve({
          ok: true,
          statusCode: response.statusCode || 0,
          location: response.headers.location || "",
          server: response.headers.server || ""
        })
        response.resume()
      }
    )

    request.on("timeout", () => {
      request.destroy(new Error("TIMEOUT"))
    })

    request.on("error", (error) => {
      resolve({
        ok: false,
        error: error && error.code ? error.code : String(error && error.message ? error.message : error)
      })
    })

    request.end()
  })
}

function printSection(title) {
  console.log(`\n=== ${title} ===`)
}

function printRecord(label, record) {
  if (record.ok) {
    console.log(`${label}: ok -> ${JSON.stringify(record.value)}`)
    return
  }

  console.log(`${label}: fail -> ${record.error}`)
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const rootDomain = options.domain
  const wwwDomain = `www.${rootDomain}`

  console.log(`DNS readiness check for ${rootDomain}`)
  console.log(`Checked at ${new Date().toISOString()}`)

  printSection("DNS")
  const [rootA, rootCname, rootNs, rootSoa, wwwA, wwwCname] = await Promise.all([
    resolveRecord(rootDomain, "A"),
    resolveRecord(rootDomain, "CNAME"),
    resolveRecord(rootDomain, "NS"),
    resolveRecord(rootDomain, "SOA"),
    resolveRecord(wwwDomain, "A"),
    resolveRecord(wwwDomain, "CNAME")
  ])

  printRecord(`${rootDomain} A`, rootA)
  printRecord(`${rootDomain} CNAME`, rootCname)
  printRecord(`${rootDomain} NS`, rootNs)
  printRecord(`${rootDomain} SOA`, rootSoa)
  printRecord(`${wwwDomain} A`, wwwA)
  printRecord(`${wwwDomain} CNAME`, wwwCname)

  printSection("HTTPS")
  const [rootHttp, wwwHttp] = await Promise.all([
    requestHead(`https://${rootDomain}`, options.timeoutMs),
    requestHead(`https://${wwwDomain}`, options.timeoutMs)
  ])

  if (rootHttp.ok) {
    console.log(`${rootDomain}: ok -> status=${rootHttp.statusCode} server=${rootHttp.server || "-"}`)
  } else {
    console.log(`${rootDomain}: fail -> ${rootHttp.error}`)
  }

  if (wwwHttp.ok) {
    console.log(`${wwwDomain}: ok -> status=${wwwHttp.statusCode} server=${wwwHttp.server || "-"}`)
  } else {
    console.log(`${wwwDomain}: fail -> ${wwwHttp.error}`)
  }

  if (options.renderHost) {
    printSection("Render Target")
    const renderDns = await resolveRecord(options.renderHost, "CNAME")
    printRecord(`${options.renderHost} CNAME`, renderDns)
    const renderHttp = await requestHead(`https://${options.renderHost}`, options.timeoutMs)
    if (renderHttp.ok) {
      console.log(`${options.renderHost}: ok -> status=${renderHttp.statusCode} server=${renderHttp.server || "-"}`)
    } else {
      console.log(`${options.renderHost}: fail -> ${renderHttp.error}`)
    }
  }

  printSection("Summary")
  if (!rootA.ok && !rootCname.ok && !wwwA.ok && !wwwCname.ok) {
    console.log("Public DNS is not live yet. Root and www still need records.")
    process.exitCode = 2
    return
  }

  if (!rootHttp.ok || !wwwHttp.ok) {
    console.log("DNS may exist, but HTTPS is not healthy on every hostname yet.")
    process.exitCode = 1
    return
  }

  console.log("DNS and HTTPS look healthy for root and www.")
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
