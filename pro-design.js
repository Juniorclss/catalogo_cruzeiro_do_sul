(function () {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const ready = () => {
    document.body.classList.add("pro-design-ready");

    if (!document.querySelector(".pro-scroll-progress")) {
      const progress = document.createElement("div");
      progress.className = "pro-scroll-progress";
      progress.setAttribute("aria-hidden", "true");
      document.body.appendChild(progress);
    }

    if (!document.querySelector(".pro-ambient-light")) {
      const ambient = document.createElement("div");
      ambient.className = "pro-ambient-light";
      ambient.setAttribute("aria-hidden", "true");
      ambient.innerHTML = "<span></span><span></span><span></span>";
      document.body.prepend(ambient);
    }

    if (!document.querySelector(".pro-orbital-field")) {
      const orbitals = document.createElement("div");
      orbitals.className = "pro-orbital-field";
      orbitals.setAttribute("aria-hidden", "true");
      orbitals.innerHTML = "<i></i><i></i><i></i>";
      document.body.prepend(orbitals);
    }

    document
      .querySelectorAll(
        ".section-block, .students-card, .sidebar-widget, .side-card, .news-card, .archive-card, .live-feed-card, .trending-card, .feature-card, .regional-card, .highlight-card"
      )
      .forEach((element, index) => {
        element.classList.add("pro-reveal");
        element.style.transitionDelay = `${Math.min(index % 6, 5) * 45}ms`;
      });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -8% 0px" }
    );

    document.querySelectorAll(".pro-reveal").forEach((element) => observer.observe(element));

    if (!prefersReducedMotion) {
      document
        .querySelectorAll(".hero-grid, .section-block, .students-hero, .trending-card.main")
        .forEach((element) => element.classList.add("pro-parallax"));
    }

    document
      .querySelectorAll(".hero-grid, .news-highlight-grid, .trending-grid, .students-stage-grid, .kids-game-grid")
      .forEach((element) => element.classList.add("pro-depth-stage"));

    document
      .querySelectorAll(".eyebrow, .card-kicker, .left-rail-title, .widget-kicker")
      .forEach((element) => element.classList.add("pro-holo-label"));
  };

  const updateProgress = () => {
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const progress = height > 0 ? window.scrollY / height : 0;
    document.documentElement.style.setProperty("--pro-scroll", String(Math.max(0, Math.min(1, progress))));

    if (!prefersReducedMotion) {
      document.querySelectorAll(".pro-parallax").forEach((element, index) => {
        const rect = element.getBoundingClientRect();
        const centerOffset = rect.top + rect.height / 2 - window.innerHeight / 2;
        const depth = index % 2 === 0 ? -0.018 : 0.014;
        const y = Math.max(-18, Math.min(18, centerOffset * depth));
        element.style.setProperty("--pro-y", `${y}px`);
      });
    }
  };

  const updatePointerLight = (event) => {
    document.body.style.setProperty("--pro-mx", `${event.clientX}px`);
    document.body.style.setProperty("--pro-my", `${event.clientY}px`);
    document.documentElement.style.setProperty(
      "--pro-header-shine",
      `${Math.max(-55, Math.min(55, (event.clientX / window.innerWidth - 0.5) * 90))}%`
    );
  };

  const applyTilt = (event) => {
    if (prefersReducedMotion) return;

    const card = event.target.closest(
      ".news-card, .archive-card, .live-feed-card, .trending-card, .feature-card, .regional-card, .highlight-card, .movie-card, .theater-card, .students-stage-card, .kids-media-card, .kids-game-card, .election-candidate-card, .infantil-card, .infantil-mini-card"
    );

    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.setProperty("--tilt-x", `${(-y * 4).toFixed(2)}deg`);
    card.style.setProperty("--tilt-y", `${(x * 5).toFixed(2)}deg`);
  };

  const clearTilt = (event) => {
    if (!event?.target || typeof event.target.closest !== "function") {
      return;
    }

    const card = event.target.closest(
      ".news-card, .archive-card, .live-feed-card, .trending-card, .feature-card, .regional-card, .highlight-card, .movie-card, .theater-card, .students-stage-card, .kids-media-card, .kids-game-card, .election-candidate-card, .infantil-card, .infantil-mini-card"
    );

    if (!card) return;
    card.style.removeProperty("--tilt-x");
    card.style.removeProperty("--tilt-y");
  };

  let ticking = false;
  const requestScrollUpdate = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => {
      ticking = false;
      updateProgress();
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ready);
  } else {
    ready();
  }

  window.addEventListener("scroll", requestScrollUpdate, { passive: true });
  window.addEventListener("resize", requestScrollUpdate, { passive: true });
  window.addEventListener("pointermove", updatePointerLight, { passive: true });
  document.addEventListener("pointermove", applyTilt, { passive: true });
  document.addEventListener("pointerleave", clearTilt, true);
  window.addEventListener("load", updateProgress);
})();
