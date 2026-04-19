"use strict";

(() => {
  const MODAL_ID = "catalogoPremiumTerms";
  const CONSENT_BANNER_ID = "catalogo-cookie-consent";
  const READY_FALLBACK_MS = 6800;
  const OPEN_DELAY_MS = 260;
  const THANKS_SCREEN_MS = 5000;
  const THANKS_SCREEN_MS_COMPACT = 3200;
  const SESSION_ACCEPT_KEY = "catalogo_terms_session_accept_v1";
  const FOUNDERS_VIDEO_SRC = "./assets/founders-cafe-pack-anim.mp4";
  const FOUNDERS_GEANE_LOGO_SRC = "./assets/founders-geane-logo.png";
  const FOUNDERS_RECOMMENCER_LOGO_SRC = "./assets/founders-recommencer-logo.svg";
  const FOUNDERS_OPENING_STEPS = [
    "Abrindo noticias atuais do Vale do Jurua.",
    "Atualizando manchetes de politica, servico e cidade.",
    "Lendo fontes monitoradas e checando resumos.",
    "Montando radar local, agenda e destaques do dia.",
    "Conferindo capas, editorias e atalhos do portal."
  ];

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
      <h2 id="catalogoWelcomeTitle">Preferencias de cookies</h2>
      <p class="catalogo-welcome-lead">
        Usamos cookies para entender o uso do portal, melhorar a navegacao e
        acompanhar metricas essenciais de desempenho e audiencia.
      </p>

      <div class="catalogo-terms-summary">
        <article class="catalogo-summary-card">
          <strong>Essenciais</strong>
          <p>Mantem recursos basicos do site funcionando corretamente.</p>
        </article>
        <article class="catalogo-summary-card">
          <strong>Medicao e desempenho</strong>
          <p>Ajudam a analisar acessos, paginas mais visitadas e a estabilidade da experiencia.</p>
        </article>
        <article class="catalogo-summary-card">
          <strong>Seu controle</strong>
          <p>Voce pode consultar os detalhes na pagina legal antes de seguir.</p>
        </article>
      </div>

      <div class="catalogo-terms-list">
        <div class="catalogo-term-item">
          <strong>O que usamos</strong>
          <span>Cookies essenciais e ferramentas de medicao de uso.</span>
        </div>
        <div class="catalogo-term-item">
          <strong>Finalidade</strong>
          <span>Aprimorar conteudo, usabilidade e desempenho do portal.</span>
        </div>
        <div class="catalogo-term-item">
          <strong>Transparencia</strong>
          <span>As condicoes podem ser atualizadas conforme o site evolui.</span>
        </div>
      </div>

      <label class="catalogo-terms-check">
        <input type="checkbox" id="catalogoAcceptTerms" />
        <span>Autorizo o uso de cookies e metricas de navegacao neste acesso.</span>
      </label>

      <p class="catalogo-welcome-note">
        Cookies estritamente necessarios podem permanecer ativos para o funcionamento do site.
      </p>

      <div class="catalogo-welcome-actions">
        <button class="catalogo-btn primary" id="catalogoAcceptButton" type="button" disabled>
          Aceitar e continuar
        </button>
        <a class="catalogo-btn ghost" href="./legal.html" target="_blank" rel="noopener noreferrer">
          Ver politica
        </a>
      </div>
    `;
  }

  function buildDirectorMarkup() {
    return `
      <div class="catalogo-director-stage" aria-hidden="true">
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
    `;
  }

  function buildFounderThanksMarkup() {
    return `
      <div class="catalogo-founder-thanks" aria-hidden="true">
        <div class="catalogo-founder-thanks-overlay"></div>
        <div class="catalogo-founder-thanks-atmosphere">
          <span class="catalogo-founder-orb orb-a"></span>
          <span class="catalogo-founder-orb orb-b"></span>
          <span class="catalogo-founder-orb orb-c"></span>
          <span class="catalogo-founder-spotlight spot-a"></span>
          <span class="catalogo-founder-spotlight spot-b"></span>
          <span class="catalogo-founder-spotlight spot-c"></span>
          <span class="catalogo-founder-beam beam-a"></span>
          <span class="catalogo-founder-beam beam-b"></span>
          <span class="catalogo-founder-spark spark-a"></span>
          <span class="catalogo-founder-spark spark-b"></span>
          <span class="catalogo-founder-spark spark-c"></span>
          <span class="catalogo-founder-spark spark-d"></span>
          <span class="catalogo-founder-spark spark-e"></span>
          <span class="catalogo-founder-spark spark-f"></span>
        </div>

        <div class="catalogo-founder-thanks-layout">
          <div class="catalogo-founder-thanks-media catalogo-founder-reveal reveal-2">
            <video
              class="catalogo-founder-thanks-video"
              muted
              playsinline
              preload="metadata"
              autoplay
              loop
            >
              <source src="${FOUNDERS_VIDEO_SRC}" type="video/mp4" />
            </video>
          </div>

          <div class="catalogo-founder-thanks-copy">
            <p class="catalogo-founder-thanks-kicker catalogo-founder-reveal reveal-1">Socios fundadores</p>
            <span class="catalogo-founder-thanks-seal catalogo-founder-reveal reveal-2">Agradecimento especial</span>
            <div class="catalogo-founder-banner-rail catalogo-founder-reveal reveal-3">
              <article class="catalogo-founder-banner-card">
                <span>Fundadora em destaque</span>
                <div class="catalogo-founder-thanks-logo-wrap">
                  <img
                    class="catalogo-founder-thanks-logo"
                    src="${FOUNDERS_GEANE_LOGO_SRC}"
                    alt="Logo da Dra. Geane Campo"
                    loading="eager"
                    decoding="async"
                  />
                </div>
              </article>
              <article class="catalogo-founder-banner-card catalogo-founder-banner-card-dark">
                <span>Marca fundadora</span>
                <div class="catalogo-founder-thanks-logo-wrap">
                  <img
                    class="catalogo-founder-thanks-logo"
                    src="${FOUNDERS_RECOMMENCER_LOGO_SRC}"
                    alt="Logo da Recommencer"
                    loading="eager"
                    decoding="async"
                  />
                </div>
              </article>
            </div>
            <strong class="catalogo-founder-reveal reveal-4">Nossos agradecimentos em destaque.</strong>
            <span class="catalogo-founder-reveal reveal-5">Obrigado. O portal esta abrindo.</span>
            <div class="catalogo-founder-opening catalogo-founder-reveal reveal-5" aria-live="polite">
              <div class="catalogo-founder-opening-head">
                <strong>Abrindo edicao atual</strong>
                <span data-founder-opening-percent>0%</span>
              </div>
              <div class="catalogo-founder-opening-bar">
                <span data-founder-opening-bar></span>
              </div>
              <p data-founder-opening-text>${FOUNDERS_OPENING_STEPS[0]}</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function startFounderOpening(modal) {
    const openingText = modal?.querySelector("[data-founder-opening-text]");
    const openingPercent = modal?.querySelector("[data-founder-opening-percent]");
    const openingBar = modal?.querySelector("[data-founder-opening-bar]");
    if (!openingText || !openingPercent || !openingBar) {
      return () => {};
    }

    const startedAt = Date.now();
    let stepIndex = 0;
    openingText.textContent = FOUNDERS_OPENING_STEPS[0];
    openingPercent.textContent = "0%";
    openingBar.style.width = "0%";

    const progressTimer = window.setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const progress = Math.min(100, Math.round((elapsed / THANKS_SCREEN_MS) * 100));
      openingPercent.textContent = `${progress}%`;
      openingBar.style.width = `${progress}%`;
    }, 120);

    const stepTimer = window.setInterval(() => {
      stepIndex = (stepIndex + 1) % FOUNDERS_OPENING_STEPS.length;
      openingText.textContent = FOUNDERS_OPENING_STEPS[stepIndex];
    }, 760);

    return () => {
      window.clearInterval(progressTimer);
      window.clearInterval(stepTimer);
      openingPercent.textContent = "100%";
      openingBar.style.width = "100%";
    };
  }

  function buildWelcomeVisualMarkup(options = {}) {
    const compact = options.compact === true;
    const visualClass = compact
      ? "catalogo-welcome-visual catalogo-welcome-visual-compact"
      : "catalogo-welcome-visual";

    return `
        <div class="${visualClass}" aria-hidden="true">
        <div class="catalogo-stage-chip">Preferencias e cookies</div>

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
          <span class="catalogo-star-alien alien-star-a"></span>
          <span class="catalogo-star-alien alien-star-b"></span>
          <span class="catalogo-star-alien alien-star-c"></span>
          <span class="catalogo-star-alien alien-star-d"></span>
          <span class="catalogo-star-alien alien-star-e"></span>
          <span class="catalogo-sky-angel sky-angel-a"></span>
          <span class="catalogo-sky-angel sky-angel-b"></span>
          <span class="catalogo-sky-angel sky-angel-c"></span>
          <span class="catalogo-bomber-plane bomber-plane-a">
            <span class="catalogo-plane-bomb"></span>
          </span>
          <span class="catalogo-bomber-plane bomber-plane-b">
            <span class="catalogo-plane-bomb"></span>
          </span>
          <span class="catalogo-bomber-plane bomber-plane-c">
            <span class="catalogo-plane-bomb"></span>
          </span>
          <span class="catalogo-bomber-plane bomber-plane-d">
            <span class="catalogo-plane-bomb"></span>
          </span>
          <span class="catalogo-war-drone drone-a"></span>
          <span class="catalogo-war-drone drone-b"></span>
          <span class="catalogo-war-drone drone-c"></span>
          <span class="catalogo-space-bus" aria-label="Onibus espacial com Elon Musk sentado">
            <span class="catalogo-space-bus-window"></span>
            <span class="catalogo-space-bus-passenger"></span>
          </span>
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
          <span class="catalogo-war-jet jet-left"></span>
          <span class="catalogo-war-jet jet-right"></span>
          <span class="catalogo-war-vehicle vehicle-left"></span>
          <span class="catalogo-war-vehicle vehicle-right"></span>
          <span class="catalogo-war-tower tower-left"></span>
          <span class="catalogo-war-tower tower-right"></span>
        </div>

        <div class="catalogo-prophecy-panel" aria-hidden="true">
          <span class="catalogo-prophecy-kicker">Terminal de previsao alegorica</span>
          <strong class="catalogo-prophecy-title">Codigo, caos e manchete montando a cena</strong>
          <div class="catalogo-prophecy-console">
            <span class="catalogo-prophecy-console-line">> pintar linha 01 :: binario bruto</span>
            <span class="catalogo-prophecy-console-line">> converter :: ASCII :: probabilidade</span>
            <span class="catalogo-prophecy-console-line">> assinar previsao :: alienigenas</span>
          </div>
          <div class="catalogo-prophecy-stream">
            <div class="catalogo-prophecy-phase phase-binary">
              01000100 01000101 01010011 01010100 01010010 01010101<br />
              01001001 01000011 01000001 01001111 00100000 01001101<br />
              01010101 01001110 01000100 01001001 01000001 01001100
            </div>
            <div class="catalogo-prophecy-phase phase-ascii">
              44 45 53 54 52 55 49 43 41 4F<br />
              4D 55 4E 44 49 41 4C // 45 4D<br />
              50 4F 55 43 4F 53 20 44 49 41 53
            </div>
            <div class="catalogo-prophecy-phase phase-code">
              const probabilidade = IA.calcular({<br />
              &nbsp;&nbsp;caos: "alto", meme: "viral", aliens: "observando"<br />
              });<br />
              if (probabilidade &gt; 0.87) publicar("alerta");
            </div>
            <div class="catalogo-prophecy-phase phase-glyph">
              probabilidade_final = 98.7%<br />
              margem_de_absurdo = maxima<br />
              fonte = "onibus espacial em zigue-zague"<br />
              status = aguardando assinatura alienigena
            </div>
            <div class="catalogo-prophecy-phase phase-alert">
              <span class="catalogo-prophecy-alert-tag">meme calculado</span>
              <strong>DESTRUICAO MUNDIAL EM POUCOS DIAS</strong>
              <span>se continuar assim</span>
              <small>assinado: alienigenas perto do Cruzeiro do Sul</small>
            </div>
            <div class="catalogo-prophecy-phase phase-meme">
              <span class="catalogo-prophecy-alert-tag">meme geopolitico do dia</span>
              <strong>cessar-fogo no papel, drone no ceu, reuniao em looping</strong>
              <span>enquanto isso, o feed chama de estabilidade e a guerra abre outra aba</span>
              <small>leitura do momento: diplomacia fragil, drones dominando e paz em buffering</small>
            </div>
          </div>
          <small>terminal > binario > ascii > codigo > probabilidade > meme > reboot</small>
        </div>

        <div class="catalogo-night-landscape" aria-hidden="true">
          <span class="catalogo-horizon-glow"></span>
          <span class="catalogo-sea-band"></span>
          <span class="catalogo-war-ship ship-left"></span>
          <span class="catalogo-war-ship ship-center"></span>
          <span class="catalogo-war-ship ship-right"></span>
          <span class="catalogo-land-ridge ridge-back"></span>
          <span class="catalogo-land-ridge ridge-mid"></span>
          <span class="catalogo-land-ridge ridge-front"></span>
          <span class="catalogo-land-trail"></span>
          <div class="catalogo-skywatcher watcher-one"></div>
          <div class="catalogo-skywatcher watcher-two"></div>
          <div class="catalogo-battle-line">
            <span class="catalogo-trench trench-back"></span>
            <span class="catalogo-trench trench-front"></span>
            <span class="catalogo-war-crater crater-a"></span>
            <span class="catalogo-war-crater crater-b"></span>
            <span class="catalogo-war-crater crater-c"></span>
            <span class="catalogo-war-crater crater-d"></span>
            <span class="catalogo-war-tank tank-left"></span>
            <span class="catalogo-war-tank tank-center"></span>
            <span class="catalogo-war-tank tank-right"></span>
            <span class="catalogo-field-gun gun-left"></span>
            <span class="catalogo-field-gun gun-right"></span>

            <div class="catalogo-war-soldier human-unit runner-unit soldier-alpha">
              <span class="catalogo-war-rifle"></span>
            </div>
            <div class="catalogo-war-soldier robot-unit striker-unit soldier-beta">
              <span class="catalogo-war-rifle"></span>
            </div>
            <div class="catalogo-war-soldier human-unit soldier-gamma">
              <span class="catalogo-war-rifle"></span>
            </div>
            <div class="catalogo-war-soldier robot-unit runner-unit soldier-epsilon">
              <span class="catalogo-war-rifle"></span>
            </div>
            <div class="catalogo-war-soldier human-unit soldier-zeta">
              <span class="catalogo-war-rifle"></span>
            </div>
            <div class="catalogo-war-soldier robot-unit soldier-delta">
              <span class="catalogo-war-rifle"></span>
            </div>
            <div class="catalogo-war-soldier human-unit soldier-eta">
              <span class="catalogo-war-rifle"></span>
            </div>
            <div class="catalogo-war-soldier robot-unit striker-unit soldier-theta">
              <span class="catalogo-war-rifle"></span>
            </div>
            <div class="catalogo-war-soldier human-unit soldier-iota">
              <span class="catalogo-war-rifle"></span>
            </div>
            <div class="catalogo-war-soldier robot-unit soldier-kappa">
              <span class="catalogo-war-rifle"></span>
            </div>
            <div class="catalogo-war-soldier human-unit soldier-lambda">
              <span class="catalogo-war-rifle"></span>
            </div>
            <span class="catalogo-battle-burst burst-a"></span>
            <span class="catalogo-battle-burst burst-b"></span>
            <span class="catalogo-battle-burst burst-c"></span>
            <span class="catalogo-battle-shot shot-a"></span>
            <span class="catalogo-battle-shot shot-b"></span>
            <span class="catalogo-battle-shot shot-c"></span>
          </div>
        </div>

        <div class="catalogo-visual-copy">
          <strong>Preferencias de navegacao</strong>
          <span>Seu aceite permite usar cookies e metricas para entender a navegacao e melhorar o portal.</span>
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
              <strong>Preferencias e cookies</strong>
            </div>
            ${buildWelcomeCopyMarkup()}
          </div>
        </article>
        ${buildFounderThanksMarkup()}
      `
      : `
        <div class="catalogo-welcome-shell">
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
          ${buildDirectorMarkup()}
        </div>
        ${buildFounderThanksMarkup()}
      `;

    return modal;
  }

  function openWelcomeModal(modal) {
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("catalogo-lock-scroll");
  }

  function closeWelcomeModal(modal) {
    if (!modal || modal.classList.contains("is-thanking") || modal.classList.contains("is-leaving")) {
      return;
    }

    const thanksDuration = modal.classList.contains("is-compact")
      ? THANKS_SCREEN_MS_COMPACT
      : THANKS_SCREEN_MS;
    const thanksVideo = modal.querySelector(".catalogo-founder-thanks-video");
    modal.__stopFounderOpening = startFounderOpening(modal);
    modal.classList.add("is-thanking");
    modal.setAttribute("aria-hidden", "true");

    if (thanksVideo) {
      try {
        thanksVideo.currentTime = 0;
        const playAttempt = thanksVideo.play();
        if (playAttempt && typeof playAttempt.catch === "function") {
          playAttempt.catch(() => {});
        }
      } catch (_error) {
        // ignore media playback failures
      }
    }

    window.setTimeout(() => {
      modal.classList.add("is-leaving");
      document.body.classList.remove("catalogo-lock-scroll");
      window.setTimeout(() => {
        if (typeof modal.__stopFounderOpening === "function") {
          modal.__stopFounderOpening();
        }
        modal.remove();
        dispatchIntroFinished();
      }, 320);
    }, thanksDuration);
  }

  function closeWelcomeModalImmediately(modal) {
    if (!modal) return;
    if (typeof modal.__stopFounderOpening === "function") {
      modal.__stopFounderOpening();
    }
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
          closeWelcomeModalImmediately(modal);
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
