"use strict";

(() => {
  const MODAL_ID = "catalogoPremiumTerms";
  const CONSENT_BANNER_ID = "catalogo-cookie-consent";
  const READY_FALLBACK_MS = 6800;
  const OPEN_DELAY_MS = 260;
  const SESSION_ACCEPT_KEY = "catalogo_terms_session_accept_v1";

  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback, { once: true });
      return;
    }

    callback();
  }

  function clearStoredConsent() {
    try {
      localStorage.removeItem("catalogo_lgpd_consent_v3");
    } catch (_error) {
      // ignore storage failures
    }
  }

  function removeLegacyConsentBanner() {
    document.getElementById(CONSENT_BANNER_ID)?.remove();
  }

  function dispatchIntroFinished() {
    window.dispatchEvent(new CustomEvent("catalogo:intro-finished"));
  }

  function dispatchConsent(value) {
    window.dispatchEvent(
      new CustomEvent("catalogo:consent", {
        detail: {
          accepted: Boolean(value),
          state: value ? "accepted" : "rejected",
          source: "welcome-modal"
        }
      })
    );
  }

  function rememberWelcomeAcceptedThisSession() {
    try {
      sessionStorage.setItem(SESSION_ACCEPT_KEY, "1");
    } catch (_error) {
      // ignore storage failures
    }
  }

  function shouldSkipWelcomeModal() {
    if (window.__CATALOGO_SKIP_HOME_WELCOME__ === true) {
      return true;
    }

    try {
      return sessionStorage.getItem(SESSION_ACCEPT_KEY) === "1";
    } catch (_error) {
      return false;
    }
  }

  function connectionPrefersLite() {
    const connection =
      navigator.connection || navigator.mozConnection || navigator.webkitConnection || null;

    if (!connection) {
      return false;
    }

    return Boolean(connection.saveData) || /(?:^|slow-)?2g$/i.test(String(connection.effectiveType || ""));
  }

  function shouldUseCompactWelcome() {
    return (
      window.matchMedia("(max-width: 760px)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      connectionPrefersLite()
    );
  }

  function buildWelcomeCopyMarkup() {
    return `
      <p class="catalogo-welcome-kicker">Antes de continuar</p>
      <h2 id="catalogoWelcomeTitle">Autorize cookies, rastreamento e metricas</h2>
      <p class="catalogo-welcome-lead">
        Ao aceitar, voce libera a captura de cookies e sinais de navegacao para
        medir acessos, registrar cliques, acompanhar permanencia, entender trilhas
        de uso e gerar estatisticas para conteudo, produto, campanhas e desempenho.
      </p>

      <div class="catalogo-terms-summary">
        <article class="catalogo-summary-card">
          <strong>Cookies analiticos</strong>
          <p>Registram paginas vistas, origem de acesso, cliques, tempo de navegacao e interacoes gerais.</p>
        </article>
        <article class="catalogo-summary-card">
          <strong>Uso dos dados</strong>
          <p>Esses sinais alimentam relatorios, metricas de audiencia e ajustes editoriais, tecnicos, comerciais e de rastreio de comportamento.</p>
        </article>
        <article class="catalogo-summary-card">
          <strong>Seu controle</strong>
          <p>Os detalhes do tratamento, retencao e base legal ficam na pagina legal, que voce pode consultar antes de continuar.</p>
        </article>
      </div>

      <div class="catalogo-terms-list">
        <div class="catalogo-term-item">
          <strong>O que coletamos</strong>
          <span>Cookies, dados do navegador, paginas acessadas, tempo de uso, cliques, votos, origem de visita e interacoes com modulos.</span>
        </div>
        <div class="catalogo-term-item">
          <strong>Para que usamos</strong>
          <span>Usamos esses dados para rastrear uso, gerar estatisticas, medir campanhas, entender comportamento e melhorar experiencia e desempenho.</span>
        </div>
        <div class="catalogo-term-item">
          <strong>Leitura de comportamento</strong>
          <span>Os dados de navegacao podem ser ligados ao desempenho de blocos, materias, formularios, votacoes, buscas e recursos interativos do portal.</span>
        </div>
        <div class="catalogo-term-item">
          <strong>Atualizacoes</strong>
          <span>Ferramentas de medicao, layout e regras podem mudar; por isso o aceite pode ser renovado neste fluxo.</span>
        </div>
      </div>

      <label class="catalogo-terms-check">
        <input type="checkbox" id="catalogoAcceptTerms" />
        <span>Autorizo, neste acesso, o uso de cookies, captura de dados de navegacao e tecnologias de rastreamento para medir interacoes, permanencia, cliques e metricas do portal.</span>
      </label>

      <p class="catalogo-welcome-note">
        Observacao: cookies estritamente necessarios podem continuar ativos para o funcionamento basico do site. Mais detalhes estao na pagina legal.
      </p>

      <div class="catalogo-welcome-actions">
        <button class="catalogo-btn primary" id="catalogoAcceptButton" type="button" disabled>
          Aceitar cookies e continuar
        </button>
        <a class="catalogo-btn ghost" href="./legal.html" target="_blank" rel="noopener noreferrer">
          Ver detalhes completos
        </a>
      </div>
    `;
  }

  function buildWelcomeVisualMarkup(options = {}) {
    const compact = options.compact === true;
    const visualClass = compact
      ? "catalogo-welcome-visual catalogo-welcome-visual-compact"
      : "catalogo-welcome-visual";

    return `
      <div class="${visualClass}" aria-hidden="true">
        <div class="catalogo-stage-chip">Cookies, rastreio e dados</div>

        <div class="catalogo-cosmos">
          <span class="catalogo-sky-glow glow-a"></span>
          <span class="catalogo-sky-glow glow-b"></span>
          <span class="catalogo-sky-glow glow-c"></span>
          <span class="catalogo-sky-ribbon ribbon-a"></span>
          <span class="catalogo-sky-ribbon ribbon-b"></span>
          <span class="catalogo-orbital-satellite satellite-a"></span>
          <span class="catalogo-orbital-satellite satellite-b"></span>
          <span class="catalogo-ufo ufo-a"></span>
          <span class="catalogo-ufo ufo-b"></span>
          <div class="catalogo-cruzeiro-sul">
            <span class="catalogo-cruzeiro-trace trace-top"></span>
            <span class="catalogo-cruzeiro-trace trace-left"></span>
            <span class="catalogo-cruzeiro-trace trace-right"></span>
            <span class="catalogo-cruzeiro-trace trace-bottom"></span>
            <span class="catalogo-cruzeiro-star star-top"></span>
            <span class="catalogo-cruzeiro-star star-left"></span>
            <span class="catalogo-cruzeiro-star star-core"></span>
            <span class="catalogo-cruzeiro-star star-right"></span>
            <span class="catalogo-cruzeiro-star star-bottom"></span>
          </div>
          <span class="catalogo-shooting-star"></span>
        </div>

        <div class="catalogo-war-tableau" aria-hidden="true">
          <span class="catalogo-war-smoke smoke-left"></span>
          <span class="catalogo-war-smoke smoke-mid"></span>
          <span class="catalogo-war-smoke smoke-right"></span>
          <span class="catalogo-war-flash flash-left"></span>
          <span class="catalogo-war-flash flash-center"></span>
          <span class="catalogo-war-flash flash-right"></span>
          <span class="catalogo-war-bomb bomb-a"></span>
          <span class="catalogo-war-bomb bomb-b"></span>
          <span class="catalogo-war-bomb bomb-c"></span>
          <span class="catalogo-war-bomb bomb-d"></span>
          <span class="catalogo-war-bomb bomb-e"></span>
          <span class="catalogo-war-blast blast-a"></span>
          <span class="catalogo-war-blast blast-b"></span>
          <span class="catalogo-war-blast blast-c"></span>
          <span class="catalogo-war-blast blast-d"></span>
          <span class="catalogo-war-tracer tracer-left"></span>
          <span class="catalogo-war-tracer tracer-mid"></span>
          <span class="catalogo-war-tracer tracer-right"></span>
          <span class="catalogo-war-searchlight light-left"></span>
          <span class="catalogo-war-searchlight light-right"></span>
          <span class="catalogo-war-vehicle vehicle-left"></span>
          <span class="catalogo-war-vehicle vehicle-right"></span>
          <span class="catalogo-war-tower tower-left"></span>
          <span class="catalogo-war-tower tower-right"></span>
        </div>

        <div class="catalogo-prophecy-panel" aria-hidden="true">
          <span class="catalogo-prophecy-kicker">Previsao do futuro</span>
          <strong class="catalogo-prophecy-title">Calculando probabilidades com I.A.</strong>
          <div class="catalogo-prophecy-stream">
            <span class="catalogo-prophecy-phase phase-binary">01010000 01110010 01100101 01110110 01101001 01110011 01100001 01101111</span>
            <span class="catalogo-prophecy-phase phase-ascii">50 72 65 76 69 73 61 6F 20 3E 20 6E 6F 74 69 63 69 61</span>
            <span class="catalogo-prophecy-phase phase-code">parse(binario).toASCII().toPrograma().toNoticia(ia);</span>
            <span class="catalogo-prophecy-phase phase-news">Meme + guerra + aliens olhando = noticia em formacao</span>
          </div>
          <small>binario > ascii > programacao > noticia</small>
        </div>

        <div class="catalogo-night-landscape" aria-hidden="true">
          <span class="catalogo-horizon-glow"></span>
          <span class="catalogo-land-ridge ridge-back"></span>
          <span class="catalogo-land-ridge ridge-mid"></span>
          <span class="catalogo-land-ridge ridge-front"></span>
          <span class="catalogo-land-trail"></span>
          <div class="catalogo-director-stage">
            <div class="catalogo-pixel-director">
              <i class="catalogo-director-shadow"></i>
              <i class="catalogo-director-hair"></i>
              <i class="catalogo-director-head"></i>
              <i class="catalogo-director-glasses"></i>
              <i class="catalogo-director-body"></i>
              <i class="catalogo-director-arm arm-left">
                <span class="catalogo-director-hand left-hand"></span>
              </i>
              <i class="catalogo-director-arm arm-right">
                <span class="catalogo-director-hand right-hand"></span>
                <span class="catalogo-director-laser-burst">
                  <span class="catalogo-pointer-beam"></span>
                </span>
              </i>
              <i class="catalogo-director-leg leg-left"></i>
              <i class="catalogo-director-leg leg-right"></i>
            </div>
          </div>
          <div class="catalogo-skywatcher watcher-one"></div>
          <div class="catalogo-skywatcher watcher-two"></div>
          <div class="catalogo-battle-line">
            <span class="catalogo-war-crater crater-a"></span>
            <span class="catalogo-war-crater crater-b"></span>
            <span class="catalogo-war-crater crater-c"></span>
            <span class="catalogo-war-crater crater-d"></span>

            <div class="catalogo-war-soldier soldier-alpha">
              <span class="catalogo-war-rifle"></span>
            </div>
            <div class="catalogo-war-soldier soldier-beta">
              <span class="catalogo-war-rifle"></span>
            </div>
            <div class="catalogo-war-soldier soldier-gamma">
              <span class="catalogo-war-rifle"></span>
            </div>
            <div class="catalogo-war-soldier soldier-epsilon">
              <span class="catalogo-war-rifle"></span>
            </div>
            <div class="catalogo-war-soldier soldier-zeta">
              <span class="catalogo-war-rifle"></span>
            </div>
            <div class="catalogo-war-soldier soldier-delta">
              <span class="catalogo-war-rifle"></span>
            </div>
            <div class="catalogo-war-soldier soldier-eta">
              <span class="catalogo-war-rifle"></span>
            </div>
          </div>
        </div>

        <div class="catalogo-visual-copy">
          <strong>Monitoramento ativo</strong>
          <span>O aceite libera cookies, cliques e tempo de uso para metricas, testes e ajustes do portal.</span>
        </div>
      </div>
    `;
  }

  function createWelcomeModal(options = {}) {
    const compact = options.compact === true;
    const modal = document.createElement("section");
    modal.id = MODAL_ID;
    modal.className = compact ? "catalogo-welcome is-compact" : "catalogo-welcome";
    modal.setAttribute("aria-hidden", "true");
    modal.innerHTML = compact
      ? `
        <article
          class="catalogo-welcome-card"
          role="dialog"
          aria-modal="true"
          aria-labelledby="catalogoWelcomeTitle"
        >
          ${buildWelcomeVisualMarkup({ compact: true })}
          <div class="catalogo-welcome-copy">
            <div class="catalogo-compact-banner" aria-hidden="true">
              <span class="catalogo-compact-dot"></span>
              <strong>Cookies, rastreio e dados</strong>
            </div>
            ${buildWelcomeCopyMarkup()}
          </div>
        </article>
      `
      : `
        <article
          class="catalogo-welcome-card"
          role="dialog"
          aria-modal="true"
          aria-labelledby="catalogoWelcomeTitle"
        >
          ${buildWelcomeVisualMarkup()}

          <div class="catalogo-welcome-copy">
            ${buildWelcomeCopyMarkup()}
          </div>
        </article>
      `;

    return modal;
  }

  function openWelcomeModal(modal) {
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("catalogo-lock-scroll");
  }

  function closeWelcomeModal(modal) {
    modal.classList.add("is-leaving");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("catalogo-lock-scroll");
    window.setTimeout(() => {
      modal.remove();
      dispatchIntroFinished();
    }, 280);
  }

  function runWhenBrowserIsIdle(callback) {
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(() => callback(), { timeout: 1200 });
      return;
    }

    window.setTimeout(callback, 180);
  }

  function whenSiteReady(callback) {
    const release = () => {
      if (released) return;
      released = true;
      observer?.disconnect();
      callback();
    };

    if (document.body.classList.contains("site-loaded")) {
      callback();
      return;
    }

    let released = false;
    const observer = new MutationObserver(() => {
      if (document.body.classList.contains("site-loaded")) {
        release();
      }
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"]
    });

    window.setTimeout(release, READY_FALLBACK_MS);
  }

  ready(() => {
    if (shouldSkipWelcomeModal()) {
      removeLegacyConsentBanner();
      const oldModal = document.getElementById(MODAL_ID);
      if (oldModal) {
        oldModal.remove();
      }
      dispatchIntroFinished();
      return;
    }

    clearStoredConsent();

    whenSiteReady(() => {
      runWhenBrowserIsIdle(() => {
        removeLegacyConsentBanner();
        const oldModal = document.getElementById(MODAL_ID);
        if (oldModal) {
          oldModal.remove();
        }

        const modal = createWelcomeModal({
          compact: shouldUseCompactWelcome()
        });
        document.body.appendChild(modal);

        const checkbox = modal.querySelector("#catalogoAcceptTerms");
        const acceptButton = modal.querySelector("#catalogoAcceptButton");

        if (!checkbox || !acceptButton) {
          dispatchIntroFinished();
          return;
        }

        checkbox.addEventListener("change", () => {
          acceptButton.disabled = !checkbox.checked;
        });

        acceptButton.addEventListener("click", () => {
          if (!checkbox.checked) {
            return;
          }

          rememberWelcomeAcceptedThisSession();
          dispatchConsent(true);
          closeWelcomeModal(modal);
        });

        window.setTimeout(() => {
          openWelcomeModal(modal);
        }, OPEN_DELAY_MS);
      });
    });
  });
})();
