(function () {
  const deferredScripts = [
    "./insiders-crowd-march.js?v=20260420a",
    "./news-photo-fix.js?v=20260415c",
    "./arquivo-noticias.js?v=20260415b",
    "admin-menu.js?v=20260415b",
    "analytics-client.js?v=20260415c",
    "engagement-api.js?v=20260411k",
    "elections-static-fix.js?v=20260415b",
    "acre-photo-cards.js?v=20260415a",
    "servicos-menu.js?v=20260413a",
    "catalogo-telefonico-plus-data.js?v=20260413a",
    "catalogo-telefonico-plus.js?v=20260413a",
    "rodape-voz-humana.js?v=20260411o",
    "sala-redacao-real.js?v=20260414q",
    "photo-layout-fix.js?v=20260411ab",
    "agentes-newsroom-hero.js?v=20260413ac",
    "startup-experience.js?v=20260422founder-cinema-session",
    "pro-design.js?v=20260413b"
  ];
  function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.defer = true;
      script.onload = resolve;
      script.onerror = resolve;
      document.body.appendChild(script);
    });
  }

  async function loadDeferredScripts() {
    for (const src of deferredScripts) {
      // keep sequence predictable because some files depend on earlier globals
      // eslint-disable-next-line no-await-in-loop
      await loadScript(src);
    }
  }

  function scheduleDeferredBoot() {
    const run = () => {
      window.setTimeout(() => {
        loadDeferredScripts().catch(() => {});
      }, 120);
    };

    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(run, { timeout: 1800 });
      return;
    }

    window.setTimeout(run, 900);
  }

  if (document.readyState === "complete") {
    scheduleDeferredBoot();
  } else {
    window.addEventListener("load", scheduleDeferredBoot, { once: true });
  }
})();
