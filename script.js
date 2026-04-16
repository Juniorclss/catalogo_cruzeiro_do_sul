const revealNodes = document.querySelectorAll(".reveal");
const radarFilterButtons = document.querySelectorAll("#radar .chip-button[data-filter]");
const dayChips = document.querySelectorAll(".day-chip");
const betButtons = document.querySelectorAll(".bet-option");
const parallaxNodes = document.querySelectorAll("[data-parallax]");
const stakeInput = document.querySelector("#stake");
const stakeValue = document.querySelector("#stake-value");
const stakeReturn = document.querySelector("#stake-return");
const commentForm = document.querySelector("#comment-form");
const commentAuthorInput = document.querySelector("#comment-author");
const opinionInput = document.querySelector("#opinion");
const publishCommentButton = document.querySelector("#publish-comment");
const commentsFeed = document.querySelector(".comments-feed");
const commentFeedback = document.querySelector("#comment-feedback");
const charCount = document.querySelector("#char-count");
const guideTip = document.querySelector("#guide-tip");
const splashRoot = document.querySelector(".logo-splash");
const splashStatus = document.querySelector("#logo-splash-status");
const splashDate = document.querySelector("#logo-splash-date");
const radarGuide = document.querySelector("#radar-guide");
const radarGuideLabel = document.querySelector("#radar-guide-label");
const radarGuideText = document.querySelector("#radar-guide-text");
const radarGuideScene = radarGuide?.querySelector(".radar-guide-scene");
const radarGuideSprite = radarGuide?.querySelector(".radar-guide-sprite");
const radarGuideLaser = radarGuide?.querySelector(".radar-guide-laser");
const radarGuideLaserDot = radarGuide?.querySelector(".radar-guide-laser-dot");
const radarGuideLantern = radarGuide?.querySelector(".radar-guide-lantern");
const radarGuideFrontArm = radarGuide?.querySelector(".radar-guide-arm.arm-front");
const thumbNodes = document.querySelectorAll(".news-thumb, .mini-thumb");
const subscriptionForm = document.querySelector("#subscription-form");
const subscriptionNameInput = document.querySelector("#subscription-name");
const subscriptionEmailInput = document.querySelector("#subscription-email");
const subscriptionPlanInput = document.querySelector("#subscription-plan");
const subscriptionFounderWrap = document.querySelector("#subscription-founder-wrap");
const subscriptionFounderAmountInput = document.querySelector("#subscription-founder-amount");
const subscriptionFeedback = document.querySelector("#subscription-feedback");
const subscriptionSubmitButton = document.querySelector("#subscription-submit");
const subscriptionPaymentCard = document.querySelector("#subscription-payment-card");
const subscriptionPixKey = document.querySelector("[data-supporter-pix-key]");
const subscriptionPixAmount = document.querySelector("[data-supporter-pix-amount]");
const subscriptionPixTxid = document.querySelector("[data-supporter-pix-txid]");
const subscriptionPixQr = document.querySelector("#subscription-pix-qr");
const subscriptionPixCode = document.querySelector("#subscription-pix-code");
const subscriptionPaymentNote = document.querySelector("#subscription-payment-note");
const subscriptionCopyPixButton = document.querySelector("#subscription-copy-pix");
const subscriptionRefreshPixButton = document.querySelector("#subscription-refresh-pix");
const foundersCount = document.querySelector("#founders-count");
const foundersList = document.querySelector("#founders-list");
const agentMailModal = document.querySelector("#agent-mail-modal");
const agentMailForm = document.querySelector("#agent-mail-form");
const agentMailNameInput = document.querySelector("#agent-mail-name");
const agentMailEmailInput = document.querySelector("#agent-mail-email");
const agentMailSubjectInput = document.querySelector("#agent-mail-subject");
const agentMailMessageInput = document.querySelector("#agent-mail-message");
const agentMailFeedback = document.querySelector("#agent-mail-feedback");
const footerChatInput = document.querySelector("#footer-chat-input");
const footerChatSend = document.querySelector("#footer-chat-send");
const heroTourismShell = document.querySelector(".hero-newsroom-shell");
const heroInsidersShell = document.querySelector(".hero-insiders-shell");
const heroTourismSlides = [...document.querySelectorAll("[data-hero-tourism-slide]")];
const heroTourismTitle = document.querySelector("[data-hero-tourism-title]");
const heroTourismNote = document.querySelector("[data-hero-tourism-note]");
const heroOfficeStatusNodes = [...document.querySelectorAll("[data-hero-office-status]")];
const heroOfficeBubble = document.querySelector("[data-hero-office-bubble]");
const archiveBrowserLaunchers = [...document.querySelectorAll("[data-open-archive-browser]")];
const insidersTypedNodes = [...document.querySelectorAll("[data-insiders-typed]")];
const insidersBootScene = document.querySelector("[data-insiders-boot-scene]");
const insidersArmyScene = document.querySelector("[data-insiders-army]");
const insidersChantTrack = document.querySelector("[data-insiders-chant-track]");
const tickerLiveGrid = document.querySelector("#ticker-live-grid");
const performanceLiteMode = document.body.classList.contains("fx-lite");
const localeTimeZone = "America/Rio_Branco";
const portalWhatsappNumber = "5568992269296";
const splashMessages = [
  "Abrindo os destaques de Cruzeiro do Sul",
  "Notícias, serviços e agenda em uma só leitura",
  "Atualizando a edição com foco no Vale do Juruá"
];
const splashMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const tickerPhrasePool = [
  { label: "Radar", text: "Radar local destaca primeiro o que impacta Cruzeiro do Sul no dia." },
  { label: "Arquivo", text: "Arquivo do mês ajuda a entender o contexto das notícias mais recentes." },
  { label: "Comunidade", text: "Recados da comunidade entram com leitura rápida e informação útil." },
  { label: "Serviço", text: "Serviço útil aparece com endereço, horário e caminho para resolver." },
  { label: "Checagem", text: "Cada destaque sobe com checagem, contexto e fonte identificada." },
  { label: "Agenda", text: "Agenda cultural, cinema e teatro correm juntos no painel vivo." },
  { label: "Negócios", text: "Negócios locais ganham espaço com foco no que movimenta a cidade." },
  { label: "Educação", text: "Escolas, vestibular e oportunidades estudantis ficam sempre por perto." },
  { label: "Trânsito", text: "Mudou a rua, mudou a rotina: o letreiro avisa sem rodeio." },
  { label: "Clima", text: "Tempo, cheia e alerta entram cedo quando afetam o dia da população." },
  { label: "Cultura", text: "A cultura local aparece com voz própria e espaço de verdade." },
  { label: "Social", text: "Festas, bastidores e repercussão social passam aqui com ritmo leve." },
  { label: "Opinião", text: "Humor e opinião aparecem sem tirar o foco do fato principal." },
  { label: "Fonte", text: "Resumo original com link para a fonte segue firme em cada bloco." },
  { label: "Pauta", text: "Os assuntos mais quentes entram com contexto, não só com barulho." },
  { label: "Bairro", text: "O que acontece no bairro também merece manchete bem tratada." },
  { label: "Plantão", text: "Plantão leve, visual limpo e leitura rápida para quem está no corre." },
  { label: "Comunidade", text: "Pedidos de correção, avisos de evento e mensagens úteis entram no fluxo." },
  { label: "Saúde", text: "Saúde, escola e utilidade pública ficam mais fáceis de achar nesta faixa." },
  { label: "Feira", text: "Feira, comércio e pequenos negócios entram no mapa com clareza." },
  { label: "Bastidor", text: "A cobertura mostra movimento e atualização sem perder clareza." },
  { label: "Agenda", text: "Show, peça, oficina e evento local aparecem em uma mesma corrida." },
  { label: "Serviço", text: "Telefone, endereço e atalho de serviço ficam mais perto do clique." },
  { label: "Rede", text: "O que viraliza só sobe com curadoria, contexto e confirmação." },
  { label: "Manchete", text: "Cada trilha mistura notícia, serviço e comunidade em equilíbrio." },
  { label: "Cobertura", text: "Cobertura regional passa em camadas para leitura rápida e contexto claro." },
  { label: "Leitor", text: "Quem mora na cidade encontra serviço rápido antes mesmo de abrir a matéria." },
  { label: "Centro", text: "Centro, bairros e zona rural podem dividir o mesmo painel com equilíbrio." },
  { label: "Política", text: "Política entra com leitura clara, contexto e nomes identificados." },
  { label: "Mercado", text: "Anúncio, membro e patrocínio convivem sem apagar a informação." },
  { label: "Cultura", text: "Cinema, teatro e agenda criativa ganham mais presença no topo." },
  { label: "Tempo real", text: "As frases trocam ao longo do dia para acompanhar o que está acontecendo agora." },
  { label: "Curadoria", text: "Curadoria regional mantém o foco no que realmente importa por aqui." },
  { label: "Destaque", text: "O topo vira uma grade viva para mostrar o que mexe com a cidade." },
  { label: "Vale do Juruá", text: "O Vale do Juruá aparece como território vivo, com contexto e proximidade." },
  { label: "Redação", text: "A entrada do site reúne atualização contínua, leitura rápida e contexto local." }
];
const tickerRuntime = {
  timerIds: []
};
const supporterPaymentState = {
  txid: "",
  amount: 5,
  locked: false
};
const heroTourismRotation = {
  photoIndex: 0,
  activeSlideIndex: 0,
  statusIndex: 0,
  bubbleIndex: 0,
  timerId: 0,
  bubbleTimerId: 0,
  statusTimerId: 0
};
const heroTourismPhotoPool = [
  { file: "Cidade de Cruzeiro do Sul.jpg", title: "Panorama do centro", note: "vista ampla da cidade" },
  { file: "Cruzeiro do Sul - Acre (3800379687).jpg", title: "Cidade em foco", note: "recorte urbano do municipio" },
  { file: "Cruzeiro do Sul - Acre (3800380231).jpg", title: "Bairro e circulacao", note: "camada viva do centro" },
  { file: "Cruzeiro do Sul - Acre (3800380961).jpg", title: "Ritmo da cidade", note: "ruas e fachadas locais" },
  { file: "Cruzeiro do Sul - Acre (3800381599).jpg", title: "Vista do vale", note: "cidade cercada de verde" },
  { file: "Cruzeiro do Sul - Acre (3800381885).jpg", title: "Janela do Jurua", note: "paisagem e movimento local" },
  { file: "Cruzeiro do Sul - Acre (3800382621).jpg", title: "Momento urbano", note: "arquitetura e vida diaria" },
  { file: "Cruzeiro do Sul - Acre (3800382979).jpg", title: "Cruzeiro em detalhe", note: "mais um recorte turistico" },
  { file: "Cruzeiro do Sul - Acre (3800383521).jpg", title: "Centro historico", note: "fachadas e eixo central" },
  { file: "Cruzeiro do Sul - Acre (3800384851).jpg", title: "Caminho da cidade", note: "bairro, luz e profundidade" },
  { file: "Cruzeiro do Sul - Acre (3800387275).jpg", title: "Cidade e horizonte", note: "mais abertura para a paisagem" },
  { file: "Cruzeiro do Sul - Acre (3800388779).jpg", title: "Vale do Jurua", note: "respiro visual da regiao" },
  { file: "Cruzeiro do Sul - Acre (3800389269).jpg", title: "Quadra urbana", note: "clima turistico do municipio" },
  { file: "Cruzeiro do Sul - Acre (3800390087).jpg", title: "Vertical da cidade", note: "enquadramento de referencia" },
  { file: "Cruzeiro do Sul - Acre (3800390785).jpg", title: "Rua e paisagem", note: "movimento do cotidiano local" },
  { file: "Cruzeiro do Sul - Acre (3800393509).jpg", title: "Cruzeiro do Sul aberta", note: "camadas da cidade no vale" },
  { file: "Cruzeiro do Sul - Acre (3801204086).jpg", title: "Postal principal", note: "cidade vista de longe" },
  { file: "Cruzeiro do Sul - Acre (3801204374).jpg", title: "Recorte turistico", note: "cidade com atmosfera de viagem" },
  { file: "Cruzeiro do Sul - Acre (3801207912).jpg", title: "Linha do horizonte", note: "panorama urbano do Acre" },
  { file: "Cruzeiro do Sul - Acre (3801208338).jpg", title: "Cidade no fim do dia", note: "cores e relevo do municipio" },
  { file: "Cruzeiro do Sul - Acre (3801209660).jpg", title: "Vista aberta do centro", note: "paisagem para leitura rapida" },
  { file: "Cruzeiro do Sul - Acre (3801210260).jpg", title: "Cruzeiro em camadas", note: "profundidade entre ruas e vale" },
  { file: "Cruzeiro do Sul - Acre (3801211190).jpg", title: "Mais uma janela local", note: "cidade, ceu e volume" },
  { file: "PanoCZS.jpg", title: "Panorama maior", note: "recorte largo do municipio" },
  { file: "CZS-AC-BRA.jpg", title: "Cruzeiro vista ampla", note: "postal contemporaneo da cidade" },
  { file: "DowntownCZS-AC-BRA.jpg", title: "Downtown CZS", note: "miolo urbano com cara de cartao postal" },
  { file: "DowntownCZS-AC-BRA2.jpg", title: "Centro em destaque", note: "fachadas, vias e movimento" },
  { file: "Cruzeiro do Sul Acre.jpg", title: "Vista turistica", note: "panorama para abrir a home" },
  { file: "Cruzeiro do Sul-Acre, Brasil.jpg", title: "Acre em foco", note: "cidade aberta para turismo e memoria" },
  { file: "CruzeirodoSul-AC-BRA.jpg", title: "Faixa panoramica", note: "leitura horizontal da cidade" }
];
const heroOfficeBubblePool = [
  "Atualizando destaques da cidade",
  "Resumo local em revisão",
  "Acompanhando ruas, redes e agenda",
  "Novas informações entrando no radar",
  "Edição do dia em atualização"
];
const heroOfficeStatusGroups = [
  ["Cobertura local", "Fontes verificadas", "Atualização contínua"],
  ["Radar do Juruá", "Serviço em destaque", "Leitura rápida"],
  ["Agenda da cidade", "Contexto local", "Publicação no ar"],
  ["Movimento da região", "Apuração ativa", "Destaques confirmados"]
];
let lastArchiveBrowserOpenAt = 0;

const clearLiveTickerRuntime = () => {
  tickerRuntime.timerIds.forEach((timerId) => {
    window.clearTimeout(timerId);
    window.clearInterval(timerId);
  });
  tickerRuntime.timerIds = [];
};

const buildLiveTickerPhrasePool = (items = []) => {
  const seenKeys = new Set();

  return (Array.isArray(items) ? items : [])
    .map((item) => normalizeRuntimeArticle(item))
    .filter((article) => {
      const key = article.slug || article.sourceUrl || article.id || article.title;

      if (!article.title || seenKeys.has(key)) {
        return false;
      }

      seenKeys.add(key);
      return true;
    })
    .slice(0, 18)
    .map((article) => ({
      label: truncateCopy(article.category || article.sourceName || "Agora", 20),
      text: truncateCopy(article.title || article.lede || "Atualização local em destaque.", 84)
    }));
};

const getTickerPhrasePool = () => {
  const livePhrases = buildLiveTickerPhrasePool(window.NEWS_DATA || []);
  return livePhrases.length >= 6 ? livePhrases : [...livePhrases, ...tickerPhrasePool];
};
const splashStorageKey = "catalogo_splash_seen_v1";
const skipHomeIntroKey = "catalogo_skip_home_intro_once";
const offlineNewsCacheKey = "catalogo_news_cache_v2";
const offlineLastArticleKey = "catalogo_last_article_v2";
const legacyOfflineStorageKeys = ["catalogo_news_cache_v1", "catalogo_last_article_v1"];
const urlSearchParams = new URLSearchParams(window.location.search);
const urlRequestsSkipHomeIntro = (() => {
  const rawValue = String(urlSearchParams.get("skipIntro") || "").trim().toLowerCase();
  return rawValue === "1" || rawValue === "true" || rawValue === "yes";
})();
const clearSkipHomeIntroParamFromUrl = () => {
  if (!urlRequestsSkipHomeIntro || !window.history?.replaceState) {
    return;
  }

  try {
    const cleanUrl = new URL(window.location.href);
    cleanUrl.searchParams.delete("skipIntro");
    const nextUrl = `${cleanUrl.pathname}${cleanUrl.search}${cleanUrl.hash}`;
    window.history.replaceState({}, document.title, nextUrl);
  } catch (_error) {
    // Mantem a URL original se o navegador restringir a mudanca.
  }
};
const shouldSkipHomeIntro = (() => {
  if (urlRequestsSkipHomeIntro) {
    try {
      sessionStorage.setItem(skipHomeIntroKey, "1");
    } catch (_error) {
      // Continua pulando nesta visita mesmo sem sessionStorage.
    }

    clearSkipHomeIntroParamFromUrl();
    return true;
  }

  try {
    return sessionStorage.getItem(skipHomeIntroKey) === "1";
  } catch (_error) {
    return false;
  }
})();
const splashBootStartedAt =
  typeof performance !== "undefined" && typeof performance.now === "function"
    ? performance.now()
    : Date.now();
window.__CATALOGO_SKIP_HOME_INTRO__ = shouldSkipHomeIntro;
legacyOfflineStorageKeys.forEach((storageKey) => {
  [window.localStorage, window.sessionStorage].forEach((storage) => {
    try {
      storage?.removeItem(storageKey);
    } catch (_error) {
      // Ignora ambientes sem storage disponivel.
    }
  });
});
const initialStaticNews = Array.isArray(window.NEWS_DATA) ? [...window.NEWS_DATA] : [];
const thumbTopicFallbacks = {
  "thumb-cheia": "Cheia",
  "thumb-saude": "Saude",
  "thumb-servico": "Servico",
  "thumb-politica": "Prefeitura",
  "thumb-social": "Social",
  "thumb-educacao": "Educacao",
  "thumb-educacao-alt": "Educacao",
  "thumb-cultura": "Cultura",
  "thumb-pascoa": "Pascoa",
  "thumb-policia": "Policia",
  "thumb-rede": "Rede",
  "thumb-alerta": "Utilidade"
};

const getSlugFromThumbNode = (node) => {
  const linkNode = node?.closest?.("a");
  const href = linkNode?.getAttribute("href") || node?.getAttribute?.("href") || "";
  const match = href.match(/slug=([^&]+)/);
  return match ? decodeURIComponent(match[1]) : "";
};

const getThumbTopic = (thumbNode, article) => {
  const inlineLabel = thumbNode.querySelector("span")?.textContent?.trim();

  if (inlineLabel) {
    return inlineLabel;
  }

  if (article?.category) {
    return article.category;
  }

  const fallbackClass = [...thumbNode.classList].find((className) =>
    className.startsWith("thumb-")
  );

  return thumbTopicFallbacks[fallbackClass] || "Radar";
};

const sanitizeImageUrl = (value) => {
  const raw = String(value || "").trim();
  if (!raw) {
    return "";
  }

  const cleaned = raw.replace(/'/g, "%27");
  const needsProxy = /ac24horas\.com|jurua24horas\.com|cruzeirodosul\.net|cruzeirodosul\.ac\.gov\.br|static\.wixstatic\.com|agencia\.ac\.gov\.br|www\.amac\.com\.br|ifac\.edu\.br|portalacre\.com\.br/i.test(
    cleaned
  );

  if (!needsProxy || /images\.weserv\.nl/i.test(cleaned)) {
    return cleaned;
  }

  const withoutProtocol = cleaned.replace(/^https?:\/\//i, "");
  return `https://images.weserv.nl/?url=${encodeURIComponent(withoutProtocol)}`;
};

const pushUniqueImageCandidate = (bucket, value) => {
  const normalized = String(value || "").trim();
  if (!normalized || bucket.includes(normalized)) {
    return;
  }

  bucket.push(normalized);
};

const buildImageLoadCandidates = (value) => {
  const raw = String(value || "").trim();
  if (!raw) {
    return [];
  }

  const directUrl = raw.replace(/'/g, "%27");
  const proxiedUrl = sanitizeImageUrl(directUrl);
  const candidates = [];

  pushUniqueImageCandidate(candidates, directUrl);
  pushUniqueImageCandidate(candidates, proxiedUrl);

  return candidates;
};

const unwrapProxyImageUrl = (value) => {
  const raw = String(value || "").trim();
  if (!raw) {
    return "";
  }

  if (!/images\.weserv\.nl/i.test(raw)) {
    return raw;
  }

  try {
    const parsed = new URL(raw);
    const proxiedValue = parsed.searchParams.get("url") || "";
    return proxiedValue ? `https://${decodeURIComponent(proxiedValue)}` : raw;
  } catch (_error) {
    return raw;
  }
};

const getImageFingerprint = (value) => {
  const raw = unwrapProxyImageUrl(value);
  if (!raw) {
    return "";
  }

  try {
    const parsed = new URL(raw);
    return decodeURIComponent(`${parsed.hostname}${parsed.pathname}`)
      .toLowerCase()
      .replace(/-\d{2,4}x\d{2,4}(?=\.[a-z0-9]+$)/i, "")
      .replace(/\.(avif|gif|jpe?g|png|webp)$/i, "");
  } catch (_error) {
    return raw
      .toLowerCase()
      .replace(/^https?:\/\//i, "")
      .replace(/\?.*$/, "")
      .replace(/-\d{2,4}x\d{2,4}(?=\.[a-z0-9]+$)/i, "")
      .replace(/\.(avif|gif|jpe?g|png|webp)$/i, "");
  }
};

const buildOrderedImageSources = (article = {}, surface = "default") => {
  const inlineImageUrl = extractInlineArticleImage(article);
  const sharedValues = [
    article.image,
    article.media?.imageUrl,
    article.media?.image,
    article.media?.src,
    article.media?.url
  ];

  const canonicalValues = [
    article.imageUrl,
    article.originalImageUrl,
    inlineImageUrl,
    article.feedImageUrl,
    article.originalFeedImageUrl,
    ...sharedValues,
    article.originalSourceImageUrl,
    article.sourceImageUrl
  ];

  if (surface === "hero") {
    return canonicalValues;
  }

  return canonicalValues;
};

const collectArticleImageCandidates = (article = {}, surface = "default") => {
  const candidates = [];
  const seenFingerprints = new Set();
  const seenUrls = new Set();
  const values = buildOrderedImageSources(article, surface);

  values.forEach((value) => {
    buildImageLoadCandidates(value).forEach((candidate) => {
      const normalizedCandidate = String(candidate || "").trim();
      const fingerprint = getImageFingerprint(normalizedCandidate);

      if (
        !normalizedCandidate ||
        seenUrls.has(normalizedCandidate) ||
        (fingerprint && seenFingerprints.has(fingerprint))
      ) {
        return;
      }

      seenUrls.add(normalizedCandidate);
      if (fingerprint) {
        seenFingerprints.add(fingerprint);
      }
      candidates.push(normalizedCandidate);
    });
  });

  return candidates;
};

const preloadFirstAvailableImage = (candidates = []) =>
  new Promise((resolve) => {
    const queue = [...candidates];

    const tryNext = () => {
      const candidate = queue.shift();
      if (!candidate) {
        resolve("");
        return;
      }

      const preloader = new Image();
      preloader.onload = () => resolve(candidate);
      preloader.onerror = tryNext;
      preloader.src = candidate;
    };

    tryNext();
  });

const extractImageUrlFromText = (value) => {
  const raw = String(value || "")
    .replace(/&quot;/gi, '"')
    .replace(/\\(["'])/g, "$1");
  if (!raw) {
    return "";
  }

  const directPatterns = [
    /data-large-file\s*=\s*["']([^"']+)["']/i,
    /data-medium-file\s*=\s*["']([^"']+)["']/i,
    /<img[^>]+src\s*=\s*["']([^"']+)["']/i,
    /src\s*=\s*["']([^"']+\.(?:avif|gif|jpe?g|png|webp)(?:\?[^"']*)?)["']/i
  ];

  for (const pattern of directPatterns) {
    const match = raw.match(pattern);
    if (match?.[1]) {
      return sanitizeImageUrl(
        match[1].replace(/\\\//g, "/").replace(/&amp;/gi, "&").trim()
      );
    }
  }

  const looseUrlMatch = raw.match(
    /https?:\/\/[^\s"'<>]+?\.(?:avif|gif|jpe?g|png|webp)(?:\?[^\s"'<>]*)?/i
  );
  if (looseUrlMatch?.[0]) {
    return sanitizeImageUrl(looseUrlMatch[0].replace(/&amp;/gi, "&"));
  }

  return "";
};

const extractInlineArticleImage = (article = {}) => {
  const candidates = [
    article.imageUrl,
    article.image,
    article.media?.imageUrl,
    article.media?.image,
    article.media?.src,
    article.media?.url,
    article.summary,
    article.lede,
    article.description,
    Array.isArray(article.body) ? article.body.join(" ") : "",
    Array.isArray(article.highlights) ? article.highlights.join(" ") : ""
  ];

  for (const candidate of candidates) {
    const imageUrl = extractImageUrlFromText(candidate);
    if (imageUrl) {
      return imageUrl;
    }
  }

  return "";
};

const isIllustrativeImage = (article) => {
  const imageUrl = String(article?.imageUrl || "");
  const credit = String(article?.imageCredit || "").toLowerCase();
  if (/images\.unsplash\.com/i.test(imageUrl)) return true;
  if (credit.includes("ilustrativa")) return true;
  return false;
};

const articleImageResolveCache = new Map();
const sourcePreviewImageResolveCache = new Map();

const resolveSourcePreviewImage = async (article = {}) => {
  const sourceUrl = String(article.sourceUrl || article.url || article.link || "").trim();

  if (!sourceUrl) {
    return "";
  }

  if (!sourcePreviewImageResolveCache.has(sourceUrl)) {
    sourcePreviewImageResolveCache.set(
      sourceUrl,
      requestApiJson(`/api/preview-image?url=${encodeURIComponent(sourceUrl)}`, {
        method: "GET"
      })
        .then((payload) => sanitizeImageUrl(payload?.imageUrl || ""))
        .catch(() => "")
    );
  }

  return sourcePreviewImageResolveCache.get(sourceUrl) || "";
};

const resolveArticleImage = async (article, surface = "default") => {
  if (!article) return "";
  const candidates = collectArticleImageCandidates(article, surface).filter(
    (candidate) => !isIllustrativeImage({ ...article, imageUrl: candidate })
  );

  const sourceUrl = String(article.sourceUrl || article.url || article.link || "").trim();
  const cacheKey = `${surface}::${candidates.join("||")}::${sourceUrl}`;
  if (!articleImageResolveCache.has(cacheKey)) {
    articleImageResolveCache.set(
      cacheKey,
      (async () => {
        const directImage = candidates.length ? await preloadFirstAvailableImage(candidates) : "";
        if (directImage) {
          return directImage;
        }

        const sourcePreviewImage = await resolveSourcePreviewImage(article);
        if (!sourcePreviewImage || isIllustrativeImage({ ...article, imageUrl: sourcePreviewImage })) {
          return "";
        }

        const sourceCandidates = buildImageLoadCandidates(sourcePreviewImage);
        return preloadFirstAvailableImage(sourceCandidates);
      })()
    );
  }

  return articleImageResolveCache.get(cacheKey) || "";
};

const paintSurfaceImage = (node, url, position = "center", size = "cover") => {
  if (!node || !url) {
    return;
  }
  node.style.setProperty("--bg-image", `url('${url}')`);
  node.style.setProperty("--news-photo", `url('${url}')`);
  node.style.setProperty("--bg-position", position);
  node.style.setProperty("--bg-size", size);
  node.style.setProperty("background-image", `url('${url}')`, "important");
  node.style.setProperty("background-position", position, "important");
  node.style.setProperty("background-size", size, "important");
  node.style.setProperty("background-repeat", "no-repeat", "important");
};

const thumbLightingCache = new Map();

const clampColorChannel = (value = 0) => Math.min(255, Math.max(0, Math.round(value)));

const buildThumbRgb = (red = 0, green = 0, blue = 0) =>
  `rgb(${clampColorChannel(red)}, ${clampColorChannel(green)}, ${clampColorChannel(blue)})`;

const buildThumbRgba = (red = 0, green = 0, blue = 0, alpha = 1) =>
  `rgba(${clampColorChannel(red)}, ${clampColorChannel(green)}, ${clampColorChannel(blue)}, ${alpha})`;

const buildFallbackThumbLighting = (article = {}, url = "") => {
  const seedSource = String(url || article.slug || article.title || article.category || "thumb");
  let hash = 0;

  for (const char of seedSource) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }

  const red = 76 + (hash % 104);
  const green = 94 + ((hash >> 7) % 92);
  const blue = 124 + ((hash >> 13) % 108);

  return {
    accent1: buildThumbRgb(red, green, blue),
    accent2: buildThumbRgb(red * 0.34, green * 0.36, blue * 0.44),
    glow: buildThumbRgba(red * 1.12, green * 1.08, blue * 1.04, 0.48),
    highlight: buildThumbRgba(255, 255, 255, 0.18),
    shadow: buildThumbRgba(red * 0.26, green * 0.22, blue * 0.3, 0.42)
  };
};

const extractThumbLighting = (url, article = {}) => {
  const cacheKey = String(url || "").trim();
  const fallback = buildFallbackThumbLighting(article, cacheKey);

  if (!cacheKey) {
    return Promise.resolve(fallback);
  }

  if (!thumbLightingCache.has(cacheKey)) {
    thumbLightingCache.set(
      cacheKey,
      new Promise((resolve) => {
        const sample = new Image();
        sample.crossOrigin = "anonymous";
        sample.referrerPolicy = "no-referrer";

        sample.onload = () => {
          try {
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d", { willReadFrequently: true });

            if (!context) {
              resolve(fallback);
              return;
            }

            const sampleSize = 18;
            canvas.width = sampleSize;
            canvas.height = sampleSize;
            context.drawImage(sample, 0, 0, sampleSize, sampleSize);

            const { data } = context.getImageData(0, 0, sampleSize, sampleSize);
            let totalWeight = 0;
            let red = 0;
            let green = 0;
            let blue = 0;
            let brightest = { red: 255, green: 244, blue: 194, luminance: 0 };

            for (let index = 0; index < data.length; index += 4) {
              const alpha = data[index + 3];
              if (alpha < 48) {
                continue;
              }

              const pixelRed = data[index];
              const pixelGreen = data[index + 1];
              const pixelBlue = data[index + 2];
              const luminance =
                pixelRed * 0.2126 + pixelGreen * 0.7152 + pixelBlue * 0.0722;
              const weight = 0.35 + luminance / 255;

              totalWeight += weight;
              red += pixelRed * weight;
              green += pixelGreen * weight;
              blue += pixelBlue * weight;

              if (luminance >= brightest.luminance) {
                brightest = {
                  red: pixelRed,
                  green: pixelGreen,
                  blue: pixelBlue,
                  luminance
                };
              }
            }

            if (!totalWeight) {
              resolve(fallback);
              return;
            }

            const avgRed = red / totalWeight;
            const avgGreen = green / totalWeight;
            const avgBlue = blue / totalWeight;

            resolve({
              accent1: buildThumbRgb(avgRed * 1.06, avgGreen * 1.03, avgBlue * 1.04),
              accent2: buildThumbRgb(avgRed * 0.34, avgGreen * 0.31, avgBlue * 0.4),
              glow: buildThumbRgba(
                brightest.red * 1.08,
                brightest.green * 1.06,
                brightest.blue * 1.02,
                0.52
              ),
              highlight: buildThumbRgba(
                Math.max(232, brightest.red),
                Math.max(232, brightest.green),
                Math.max(228, brightest.blue),
                0.2
              ),
              shadow: buildThumbRgba(avgRed * 0.2, avgGreen * 0.18, avgBlue * 0.24, 0.42)
            });
          } catch (_error) {
            resolve(fallback);
          }
        };

        sample.onerror = () => resolve(fallback);
        sample.src = cacheKey;
      })
    );
  }

  return thumbLightingCache.get(cacheKey) || Promise.resolve(fallback);
};

const applyThumbPhotoLighting = (node, article, url) => {
  if (!node || !url) {
    return;
  }

  const requestToken = `${article?.slug || article?.id || article?.sourceUrl || url}`;
  node.dataset.thumbLightingToken = requestToken;

  extractThumbLighting(url, article).then((lighting) => {
    if (!lighting || node.dataset.thumbLightingToken !== requestToken) {
      return;
    }

    node.style.setProperty("--thumb-accent-1", lighting.accent1);
    node.style.setProperty("--thumb-accent-2", lighting.accent2);
    node.style.setProperty("--thumb-glow", lighting.glow);
    node.style.setProperty("--thumb-photo-glow", lighting.glow);
    node.style.setProperty("--thumb-photo-highlight", lighting.highlight);
    node.style.setProperty("--thumb-photo-shadow", lighting.shadow);
  });
};

const paintMosaicImageElement = (panelNode, url, position = "center 35%") => {
  if (!panelNode || !url) {
    return;
  }

  const mosaicPhoto = panelNode.querySelector(".mosaic-photo");
  if (mosaicPhoto) {
    mosaicPhoto.remove();
  }

  panelNode.dataset.imageUrl = url;
  panelNode.dataset.sourceImage = url;
  panelNode.style.setProperty("--news-photo", `url('${url}')`);
  paintSurfaceImage(panelNode, url, position, "cover");
  panelNode.classList.add("has-photo", "has-real-photo");
};

const mosaicImageFocusOverridesBySlug = {
  "ciclista-acreano-chega-no-panama-para-disputa-do-sul-americano-da-juventude": "center 10%",
  "governadora-mailza-assis-empossa-novo-delegado-geral-e-anuncia-concurso-publico-da-policia-civil":
    "40% 18%",
  "bolsa-interrompe-sequencia-de-11-altas-e-cai-0-46": "center 46%"
};

const mosaicPersonFocusPattern =
  /\b(ciclista|atleta|jogador|jogadora|governador|governadora|prefeito|prefeita|senador|senadora|deputado|deputada|delegado|delegada|secretario|secretaria|ministro|ministra|presidente|artista|cantor|cantora|ator|atriz|apresentador|apresentadora|treinador|treinadora|empresario|empresaria|medico|medica|juiz|juiza|estudante|aluno|aluna|entrevista)\b/;
const mosaicGroupScenePattern =
  /\b(posse|cerimonia|solenidade|evento|auditorio|reuniao|encontro|coletiva|equipe|time|selecao|colegio|grupo|plateia)\b/;
const mosaicLandscapePattern =
  /\b(bolsa|mercado|dolar|cidade|rio|ponte|bairro|rodovia|estrada|enchente|cheia|alag|obra|calcadao|orcamento|salario|superavit|petroleo|economia|feira|fachada|predio)\b/;

const getMosaicStorySignals = (article = {}) => {
  const text = normalizeText(
    [
      article.title,
      article.sourceLabel,
      article.lede,
      article.summary,
      article.category,
      article.sourceName
    ].join(" ")
  );

  return {
    text,
    prefersFace: mosaicPersonFocusPattern.test(text),
    isGroupScene: mosaicGroupScenePattern.test(text),
    isLandscape: mosaicLandscapePattern.test(text)
  };
};

const inferMosaicImageFocus = (article = {}, panelNode) => {
  const manualFocus = String(article.imageFocus || "").trim();
  if (manualFocus) {
    return manualFocus;
  }

  const slug = String(article.slug || "").trim();
  if (slug && mosaicImageFocusOverridesBySlug[slug]) {
    return mosaicImageFocusOverridesBySlug[slug];
  }

  const isSideCard = Boolean(panelNode?.classList?.contains("side"));
  const { prefersFace, isGroupScene, isLandscape } = getMosaicStorySignals(article);

  if (prefersFace && isGroupScene) {
    return isSideCard ? "42% 16%" : "40% 20%";
  }

  if (prefersFace) {
    return isSideCard ? "center 12%" : "center 18%";
  }

  if (isLandscape) {
    return isSideCard ? "center 46%" : "center 34%";
  }

  return isSideCard ? "center 28%" : "center 30%";
};

const inferMosaicLayoutMode = (article = {}, panelNode) => {
  const manualLayout = String(article.imageLayout || article.mosaicLayout || "").trim();
  if (manualLayout) {
    return manualLayout;
  }

  const isMainCard = Boolean(panelNode?.classList?.contains("main"));
  const { prefersFace, isGroupScene, isLandscape } = getMosaicStorySignals(article);

  if (prefersFace && isGroupScene) {
    return "group-safe";
  }

  if (isMainCard && prefersFace && !isLandscape) {
    return "portrait-safe";
  }

  return "default";
};

let thumbImageRequestSequence = 0;

const applyThumbImage = (thumbNode, article) => {
  if (!thumbNode) {
    return;
  }

  const photoCard = thumbNode.closest(".news-card, .archive-card, .live-feed-card, .feed-card");
  clearSurfaceImage(thumbNode);
  const requestId = String(++thumbImageRequestSequence);
  thumbNode.dataset.thumbImageRequest = requestId;

  if (photoCard) {
    photoCard.classList.remove("news-photo-fixed");
    delete photoCard.dataset.imageUrl;
    delete photoCard.dataset.sourceImage;
    photoCard.style.removeProperty("--news-photo");
  }

  resolveArticleImage(article).then((safeUrl) => {
    if (!safeUrl || thumbNode.dataset.thumbImageRequest !== requestId) return;
    paintSurfaceImage(
      thumbNode,
      safeUrl,
      article?.imageFocus || "center",
      article?.imageFit || "cover"
    );
    thumbNode.dataset.imageUrl = safeUrl;
    thumbNode.dataset.sourceImage = safeUrl;
    thumbNode.classList.add("has-photo", "has-real-photo");
    applyThumbPhotoLighting(thumbNode, article, safeUrl);

    if (photoCard) {
      photoCard.classList.add("news-photo-fixed");
      photoCard.dataset.imageUrl = safeUrl;
      photoCard.dataset.sourceImage = safeUrl;
      photoCard.style.setProperty("--news-photo", `url('${safeUrl}')`);
    }
  });
};

const clearSurfaceImage = (node) => {
  if (!node) {
    return;
  }

  const mosaicPhoto = node.querySelector?.(".mosaic-photo");
  if (mosaicPhoto) {
    mosaicPhoto.remove();
  }

  node.classList.remove("has-photo");
  node.classList.remove("has-real-photo");
  delete node.dataset.imageUrl;
  delete node.dataset.sourceImage;
  node.style.removeProperty("--bg-image");
  node.style.removeProperty("--bg-position");
  node.style.removeProperty("--bg-size");
  node.style.removeProperty("--news-photo");
  node.style.removeProperty("--thumb-accent-1");
  node.style.removeProperty("--thumb-accent-2");
  node.style.removeProperty("--thumb-glow");
  node.style.removeProperty("--thumb-photo-glow");
  node.style.removeProperty("--thumb-photo-highlight");
  node.style.removeProperty("--thumb-photo-shadow");
  delete node.dataset.thumbLightingToken;
  delete node.dataset.thumbImageRequest;
  node.style.removeProperty("background-image");
  node.style.removeProperty("background-position");
  node.style.removeProperty("background-size");
  node.style.removeProperty("background-repeat");
};

let mosaicImageRequestSequence = 0;

const applyMosaicImage = (panelNode, article) => {
  if (!panelNode) {
    return;
  }

  const requestId = String(++mosaicImageRequestSequence);
  panelNode.dataset.mosaicImageRequest = requestId;
  clearSurfaceImage(panelNode);

  resolveArticleImage(article, "hero").then((safeUrl) => {
    if (!safeUrl || panelNode.dataset.mosaicImageRequest !== requestId) return;
    paintMosaicImageElement(panelNode, safeUrl, inferMosaicImageFocus(article, panelNode));
  });
};

const hydrateStaticThumbs = (newsMap = {}) => {
  thumbNodes.forEach((thumbNode) => {
    const slug = getSlugFromThumbNode(thumbNode);
    const article = newsMap?.[slug];
    thumbNode.dataset.topic = getThumbTopic(thumbNode, article);
    applyThumbImage(thumbNode, article);
  });
};

if (window.NEWS_DATA) {
  hydrateStaticThumbs(
    Object.fromEntries(window.NEWS_DATA.map((item) => [item.slug, item]))
  );
}

const formatSplashStamp = () => {
  const now = new Date();
  const dateText = new Intl.DateTimeFormat("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "long",
    timeZone: localeTimeZone
  })
    .format(now)
    .replace(/\.$/, "");
  const timeText = new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: localeTimeZone
  }).format(now);

  return `${dateText.charAt(0).toUpperCase()}${dateText.slice(1)} • ${timeText}`;
};

const setupSplashExperience = () => {
  if (performanceLiteMode) {
    document.body.classList.add("site-loaded");
    return;
  }

  if (shouldSkipHomeIntro) {
    try {
      sessionStorage.setItem(splashStorageKey, "1");
      sessionStorage.removeItem(skipHomeIntroKey);
    } catch (_error) {
      // ignore session storage failures
    }

    document.body.classList.add("site-loaded");
    return;
  }

  if (!splashRoot) {
    document.body.classList.add("site-loaded");
    return;
  }

  if (splashDate) {
    splashDate.textContent = formatSplashStamp();
  }

  let splashReleased = false;
  let messageIndex = 0;
  let messageTimer = 0;
  let hasSeenSplash = false;

  try {
    hasSeenSplash = sessionStorage.getItem(splashStorageKey) === "1";
  } catch (_error) {
    hasSeenSplash = false;
  }

  splashRoot.classList.toggle("is-repeat-visit", hasSeenSplash);

  if (splashStatus) {
    splashStatus.textContent = splashMessages[messageIndex];

    if (!splashMotionQuery.matches) {
      messageTimer = window.setInterval(() => {
        messageIndex = (messageIndex + 1) % splashMessages.length;
        splashStatus.textContent = splashMessages[messageIndex];
      }, 760);
    }
  }

  const releaseSplash = () => {
    if (splashReleased) {
      return;
    }

    splashReleased = true;

    if (messageTimer) {
      window.clearInterval(messageTimer);
    }

    requestAnimationFrame(() => {
      document.body.classList.add("site-loaded");
    });

    try {
      sessionStorage.setItem(splashStorageKey, "1");
    } catch (_error) {
      // ignore session storage failures
    }
  };

  const currentTime =
    typeof performance !== "undefined" && typeof performance.now === "function"
      ? performance.now()
      : Date.now();
  const elapsed = currentTime - splashBootStartedAt;
  const minimumDuration = splashMotionQuery.matches ? 100 : 5000;
  const remaining = Math.max(100, minimumDuration - elapsed);

  window.setTimeout(releaseSplash, remaining);
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setupSplashExperience, { once: true });
} else {
  setupSplashExperience();
}

const buildTickerChip = (phrase) => {
  const chip = document.createElement("article");
  chip.className = "ticker-chip";
  chip.innerHTML = `
    <span class="ticker-chip-label"></span>
    <span class="ticker-chip-text"></span>
    <span class="ticker-chip-caret" aria-hidden="true"></span>
  `;
  setTickerChipPhrase(chip, phrase);
  return chip;
};

const setTickerChipPhrase = (chip, phrase, { type = false } = {}) => {
  if (!chip || !phrase) {
    return;
  }

  const labelNode = chip.querySelector(".ticker-chip-label");
  const textNode = chip.querySelector(".ticker-chip-text");
  const nextLabel = String(phrase.label || "Ao vivo").trim();
  const nextText = String(phrase.text || "").trim();

  if (chip._typingInterval) {
    window.clearInterval(chip._typingInterval);
    chip._typingInterval = 0;
  }

  if (chip._typingDoneTimer) {
    window.clearTimeout(chip._typingDoneTimer);
    chip._typingDoneTimer = 0;
  }

  if (labelNode) {
    labelNode.textContent = nextLabel;
  }

  if (!textNode) {
    return;
  }

  chip.classList.remove("is-typing");

  if (!type || splashMotionQuery.matches) {
    textNode.textContent = nextText;
    return;
  }

  textNode.textContent = "";
  chip.classList.add("is-typing");

  let charIndex = 0;
  const typingSpeed = Math.max(18, Math.min(34, Math.floor(960 / Math.max(nextText.length, 1))));

  chip._typingInterval = window.setInterval(() => {
    charIndex += 1;
    textNode.textContent = nextText.slice(0, charIndex);

    if (charIndex >= nextText.length) {
      window.clearInterval(chip._typingInterval);
      chip._typingInterval = 0;
      chip._typingDoneTimer = window.setTimeout(() => {
        chip.classList.remove("is-typing");
      }, 520);
    }
  }, typingSpeed);
};

const initializeLiveTicker = () => {
  if (!tickerLiveGrid) {
    return;
  }

  clearLiveTickerRuntime();

  const laneNodes = [...tickerLiveGrid.querySelectorAll(".ticker-lane")].slice(0, 2);
  const activeTickerPhrasePool = getTickerPhrasePool();

  if (!laneNodes.length || activeTickerPhrasePool.length === 0) {
    return;
  }

  const phrasesPerLane = 10;
  let phraseCursor = 0;
  const nextPhrase = () => {
    const phrase = activeTickerPhrasePool[phraseCursor % activeTickerPhrasePool.length];
    phraseCursor += 1;
    return phrase;
  };

  const lanes = laneNodes.map((laneNode, laneIndex) => {
    const track = document.createElement("div");
    track.className = "ticker-track";
    track.style.setProperty("--ticker-duration", `${34 + laneIndex * 4}s`);

    const primarySegment = document.createElement("div");
    primarySegment.className = "ticker-segment";

    const cloneSegment = document.createElement("div");
    cloneSegment.className = "ticker-segment";
    cloneSegment.setAttribute("aria-hidden", "true");

    const primaryChips = [];
    const cloneChips = [];

    for (let chipIndex = 0; chipIndex < phrasesPerLane; chipIndex += 1) {
      const phrase = nextPhrase();
      const primaryChip = buildTickerChip(phrase);
      const cloneChip = buildTickerChip(phrase);

      cloneChip.classList.add("is-clone");
      primarySegment.appendChild(primaryChip);
      cloneSegment.appendChild(cloneChip);
      primaryChips.push(primaryChip);
      cloneChips.push(cloneChip);
    }

    track.append(primarySegment, cloneSegment);
    laneNode.replaceChildren(track);

    return {
      primaryChips,
      cloneChips,
      rotationIndex: laneIndex % phrasesPerLane
    };
  });

  if (splashMotionQuery.matches) {
    return;
  }

  lanes.forEach((lane, laneIndex) => {
    const cycleLane = () => {
      lane.rotationIndex = (lane.rotationIndex + 1) % lane.primaryChips.length;
      const phrase = nextPhrase();
      setTickerChipPhrase(lane.primaryChips[lane.rotationIndex], phrase, { type: true });
      setTickerChipPhrase(lane.cloneChips[lane.rotationIndex], phrase);
    };

    const timeoutId = window.setTimeout(() => {
      cycleLane();
      const intervalId = window.setInterval(cycleLane, 2600 + laneIndex * 240);
      tickerRuntime.timerIds.push(intervalId);
    }, 1100 + laneIndex * 320);

    tickerRuntime.timerIds.push(timeoutId);
  });
};

const guideMessages = [
  "Comece pelo Radar para ver o que mexeu com Cruzeiro do Sul nesta semana.",
  "No Arquivo de Abril você revê o mês até agora sem perder a linha do tempo.",
  "Festas & Social reúne clima de Páscoa, cultura e buzz público de rede.",
  "Pedidos de revisão ou remoção passam por análise manual da equipe."
];

if (!performanceLiteMode && "IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll(".reveal").forEach((node) => revealObserver.observe(node));
} else {
  document.querySelectorAll(".reveal").forEach((node) => node.classList.add("active"));
}

const motionPanelSelector = [
  ".mosaic-item",
  ".news-card",
  ".archive-card",
  ".social-card",
  ".caderno-card",
  ".sidebar-widget",
  ".side-card",
  ".ad-unit",
  ".membership-card",
  ".projection-card",
  ".feature-card",
  ".comment-card",
  ".signal-band"
].join(", ");

const motionMediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");

const bindInteractivePanel = (panel) => {
  if (!panel || panel.dataset.motionBound === "true") {
    return;
  }

  panel.dataset.motionBound = "true";
  panel.classList.add("interactive-panel");

  const hasPhotoSurface =
    panel.matches(".news-card, .archive-card, .mosaic-item, .trending-card, .month-card") ||
    panel.querySelector(".news-thumb, .mini-thumb, .trend-photo, .month-photo");

  if (hasPhotoSurface) {
    return;
  }

  const resetPanel = () => {
    panel.style.transform = "";
  };

  panel.addEventListener("pointermove", (event) => {
    if (!motionMediaQuery.matches) {
      return;
    }

    const rect = panel.getBoundingClientRect();
    const offsetX = (event.clientX - rect.left) / rect.width;
    const offsetY = (event.clientY - rect.top) / rect.height;
    const rotateY = (offsetX - 0.5) * 7;
    const rotateX = (0.5 - offsetY) * 5;

    panel.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });

  panel.addEventListener("pointerleave", resetPanel);
  panel.addEventListener("pointerup", resetPanel);
};

const registerInteractivePanels = (root = document) => {
  if (performanceLiteMode || !root) {
    return;
  }

  const panels = [];

  if (root.matches?.(motionPanelSelector)) {
    panels.push(root);
  }

  const nestedPanels = root.querySelectorAll
    ? [...root.querySelectorAll(motionPanelSelector)]
    : [];

  panels.push(...nestedPanels);
  panels.forEach(bindInteractivePanel);
};

registerInteractivePanels();

const radarGuideThemes = {
  todos: {
    label: "Tudo",
    text: "Curadoria local com a lanterna aberta para cima, chamando o panorama e trocando os dois grandes destaques do radar."
  },
  cotidiano: {
    label: "Cotidiano",
    text: "A curadoria mira o feixe no cotidiano para subir o que mexe direto com a rotina da cidade e o pulso do dia."
  },
  prefeitura: {
    label: "Prefeitura",
    text: "O radar marca entregas, obras, decretos e movimentos oficiais da gestão."
  },
  politica: {
    label: "Política",
    text: "O feixe sobe para assembleia, disputas institucionais, decisões de gabinete e movimentos do poder."
  },
  policia: {
    label: "Polícia",
    text: "A mira sobe para segurança, operações e ocorrências que pedem atenção imediata."
  },
  saude: {
    label: "Saúde",
    text: "A luz do editor puxa campanhas, atendimento, prevenção e tudo que impacta cuidado público."
  },
  educacao: {
    label: "Educação",
    text: "O apontador do editor sobe para escola, calendário letivo, esporte estudantil e formação."
  },
  negocios: {
    label: "Negócios",
    text: "A leitura abre comércio, economia local, feiras, renda e movimentação do mercado regional."
  },
  cultura: {
    label: "Cultura",
    text: "A lanterna vira para agenda criativa, festivais, cinema, arte e o que mexe com o circuito cultural."
  },
  esporte: {
    label: "Esporte",
    text: "A mira entra no gramado e nas quadras para destacar jogos, atletas, campeonatos e bastidores esportivos."
  }
};

let radarGuideTargetFrame = 0;
let radarGuideScanIndex = 0;
let radarGuideScanTimer = 0;
let radarGuideScanTopic = null;
let radarGuideManualFocusUntil = Date.now() + 4200;
const RADAR_GUIDE_MANUAL_LOCK_MS = 1200;

const clampNumber = (value, min, max) => Math.min(max, Math.max(min, value));

const normalizeDegrees = (degrees = 0) => {
  let normalized = Number(degrees) || 0;

  while (normalized <= -180) normalized += 360;
  while (normalized > 180) normalized -= 360;

  return normalized;
};

const rotatePoint = ({ x = 0, y = 0 } = {}, angle = 0) => {
  const radians = (angle * Math.PI) / 180;
  const cosine = Math.cos(radians);
  const sine = Math.sin(radians);

  return {
    x: x * cosine - y * sine,
    y: x * sine + y * cosine
  };
};

const getRadarGuideHandPose = (sceneRect, targetX, targetY) => {
  if (!radarGuideSprite || !radarGuideFrontArm) {
    return null;
  }

  const spriteRect = radarGuideSprite.getBoundingClientRect();
  const armWidth = radarGuideFrontArm.offsetWidth || 15;
  const armHeight = radarGuideFrontArm.offsetHeight || 76;
  const spriteWidth = radarGuideSprite.offsetWidth || spriteRect.width || 1;
  const spriteHeight = radarGuideSprite.offsetHeight || spriteRect.height || 1;
  const scaleX = spriteRect.width / spriteWidth;
  const scaleY = spriteRect.height / spriteHeight;
  const shoulderLocalX = radarGuideFrontArm.offsetLeft + armWidth;
  const shoulderLocalY = radarGuideFrontArm.offsetTop + armHeight * 0.16;
  const shoulderX = spriteRect.left - sceneRect.left + shoulderLocalX * scaleX;
  const shoulderY = spriteRect.top - sceneRect.top + shoulderLocalY * scaleY;
  const shoulderAimAngle = Math.atan2(targetY - shoulderY, targetX - shoulderX) * (180 / Math.PI);
  const handBaseVector = {
    x: (-armWidth - 3) * scaleX,
    y: (-(armHeight * 0.16) - 3) * scaleY
  };
  const handBaseAngle = Math.atan2(handBaseVector.y, handBaseVector.x) * (180 / Math.PI);
  const armAngle = clampNumber(normalizeDegrees(shoulderAimAngle - handBaseAngle), -84, -10);
  const handOffset = rotatePoint(handBaseVector, armAngle);

  return {
    armAngle,
    handX: shoulderX + handOffset.x,
    handY: shoulderY + handOffset.y
  };
};

const getRadarGuideLaserTopic = (topicNodes = [], activeTopic = null) => {
  const nodes = topicNodes.filter(Boolean);
  if (!nodes.length) {
    return activeTopic;
  }

  if (Date.now() < radarGuideManualFocusUntil) {
    radarGuideScanTopic = activeTopic || nodes[0];
    return radarGuideScanTopic;
  }

  const pool = nodes.filter((topic) => topic !== radarGuideScanTopic);
  const nextPool = pool.length ? pool : nodes;
  const nextTopic = nextPool[Math.floor(Math.random() * nextPool.length)] || activeTopic || nodes[0];
  radarGuideScanTopic = nextTopic;
  return nextTopic;
};

const startRadarGuideScan = () => {
  if (!radarGuide || radarGuideScanTimer || performanceLiteMode) {
    return;
  }

  radarGuideScanTimer = window.setInterval(() => {
    if (document.hidden) {
      return;
    }

    radarGuideScanIndex += 1;
    scheduleRadarGuideTarget();
  }, 1800);
};

const updateRadarGuideTarget = () => {
  if (!radarGuide || !radarGuideScene || !radarGuideLaser || !radarGuideLantern || !radarGuideFrontArm) {
    return;
  }

  const activeButton = document.querySelector("#radar .chip-button.is-active[data-filter]");
  if (!activeButton) {
    return;
  }

  const activeFilter = activeButton.dataset.filter || "todos";
  const topicNodes = [...radarGuideScene.querySelectorAll(".radar-office-topic[data-filter]")];
  const activeTopic =
    topicNodes.find((topic) => topic.dataset.filter === activeFilter) || topicNodes[0];
  const laserTopic = getRadarGuideLaserTopic(topicNodes, activeTopic);

  topicNodes.forEach((topic) => {
    const isLaserTopic = topic === (laserTopic || activeTopic);
    const isLinkedTopic = topic === activeTopic;
    topic.classList.toggle("is-active", isLaserTopic);
    topic.classList.toggle("is-linked", isLinkedTopic);
  });

  const sceneRect = radarGuideScene.getBoundingClientRect();
  const targetRect = (laserTopic || activeTopic || activeButton).getBoundingClientRect();
  const targetX = targetRect.left + targetRect.width / 2 - sceneRect.left;
  const targetY = targetRect.top + targetRect.height / 2 - sceneRect.top;
  const handPose = getRadarGuideHandPose(sceneRect, targetX, targetY);
  const fallbackArmRect = radarGuideFrontArm.getBoundingClientRect();
  const handX =
    handPose?.handX ?? fallbackArmRect.left + fallbackArmRect.width * 0.16 - sceneRect.left;
  const handY =
    handPose?.handY ?? fallbackArmRect.top + fallbackArmRect.height * 0.12 - sceneRect.top;
  const aimAngle = Math.atan2(targetY - handY, targetX - handX) * (180 / Math.PI);
  const penAngle = clampNumber(normalizeDegrees(aimAngle - 180), -34, 28);
  const armAngle = handPose?.armAngle ?? clampNumber(penAngle - 28, -84, -10);
  const penWidth = radarGuideLantern.offsetWidth || 58;
  const penHeight = radarGuideLantern.offsetHeight || 11;
  const penLeft = handX - penWidth + 6;
  const penTop = handY - penHeight / 2;
  const tipAngle = penAngle + 180;
  const tipRadians = (tipAngle * Math.PI) / 180;
  const penReach = Math.max(24, penWidth - 4);
  const originX = handX + Math.cos(tipRadians) * penReach;
  const originY = handY + Math.sin(tipRadians) * penReach;
  const distanceX = targetX - originX;
  const distanceY = targetY - originY;
  const length = Math.max(72, Math.hypot(distanceX, distanceY));
  const angle = Math.atan2(distanceY, distanceX) * (180 / Math.PI);

  radarGuide.style.setProperty("--radar-laser-origin-x", `${originX}px`);
  radarGuide.style.setProperty("--radar-laser-origin-y", `${originY}px`);
  radarGuide.style.setProperty("--radar-laser-target-x", `${targetX}px`);
  radarGuide.style.setProperty("--radar-laser-target-y", `${targetY}px`);
  radarGuide.style.setProperty("--radar-laser-length", `${length}px`);
  radarGuide.style.setProperty("--radar-laser-angle", `${angle}deg`);
  radarGuide.style.setProperty("--radar-guide-pen-angle", `${penAngle}deg`);
  radarGuide.style.setProperty("--radar-guide-arm-angle", `${armAngle}deg`);
  radarGuide.style.setProperty("--radar-guide-pen-left", `${penLeft}px`);
  radarGuide.style.setProperty("--radar-guide-pen-top", `${penTop}px`);
  radarGuide.classList.add("is-tracking-chip");

  if (radarGuideLaserDot) {
    radarGuideLaserDot.dataset.target = (laserTopic || activeTopic || activeButton).textContent.trim();
  }
};

const scheduleRadarGuideTarget = () => {
  if (!radarGuide || !radarGuideScene || !radarGuideLaser || !radarGuideLantern) {
    return;
  }

  if (radarGuideTargetFrame) {
    window.cancelAnimationFrame(radarGuideTargetFrame);
  }

  radarGuideTargetFrame = window.requestAnimationFrame(() => {
    radarGuideTargetFrame = 0;
    updateRadarGuideTarget();
  });
};

const updateRadarGuide = (filter = "todos", spotlightArticles = []) => {
  if (!radarGuide) {
    return;
  }

  const theme = radarGuideThemes[filter] || radarGuideThemes.todos;
  const leadTitle = spotlightArticles[0]?.title
    ? ` Agora em foco: ${spotlightArticles[0].title}.`
    : "";

  radarGuide.dataset.theme = filter;

  if (radarGuideLabel) {
    radarGuideLabel.textContent = theme.label;
  }

  if (radarGuideText) {
    radarGuideText.textContent = `${theme.text}${leadTitle}`;
  }

  radarGuideScanIndex = 0;
  radarGuideScanTopic = null;
  radarGuideManualFocusUntil = Date.now() + RADAR_GUIDE_MANUAL_LOCK_MS;
  scheduleRadarGuideTarget();
};

const setActiveRadarFilter = (filter = "todos") => {
  radarFilterButtons.forEach((button) => {
    const isActive = button.dataset.filter === filter;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });
};

const getRadarSpotlightArticles = (filter = "todos") => {
  const allArticles = sortRadarArticles([...(window.NEWS_DATA || [])]);
  const normalizedFilter = normalizeText(filter);
  const filteredArticles =
    normalizedFilter === "todos"
      ? allArticles
      : allArticles.filter((article) => articleMatchesCategoryFilter(article, normalizedFilter));
  const spotlight = [];
  const seenKeys = new Set();

  const pushUnique = (article) => {
    if (!article) {
      return false;
    }

    const articleKey = getRadarArticleKey(article);
    if (!articleKey || seenKeys.has(articleKey)) {
      return false;
    }

    seenKeys.add(articleKey);
    spotlight.push(article);
    return spotlight.length >= 2;
  };

  if (normalizedFilter === "todos") {
    const { leadArticles } = pickRadarLeadArticles(allArticles);
    leadArticles.some(pushUnique);
  }

  filteredArticles.some(pushUnique);

  if (spotlight.length < 2) {
    allArticles.some(pushUnique);
  }

  return spotlight.slice(0, 2);
};

// FUNÇÃO PARA RENDERIZAR O RADAR (HOME)
const renderRadar = (filter = "todos") => {
  const radarGrid = document.querySelector("#radar .news-grid");
  if (!radarGrid || !window.NEWS_DATA) {
    return;
  }

  const spotlightArticles = getRadarSpotlightArticles(filter);

  radarGrid.innerHTML = "";
  radarGrid.dataset.activeFilter = filter;

  spotlightArticles.forEach((article, index) => {
    const card = buildFeedCard(article);
    card.classList.add(
      "radar-spotlight-card",
      "radar-top-story",
      "reveal",
      "active"
    );
    card.dataset.radarRank = String(index + 1);

    if (index === 0) {
      card.classList.add("featured", "featured-primary");
    } else {
      card.classList.add("featured-secondary");
    }

    radarGrid.appendChild(card);
  });

  if (spotlightArticles.length === 0) {
    const emptyState = document.createElement("article");
    emptyState.className = "news-card radar-empty-state reveal active";
    emptyState.innerHTML = `
      <span class="news-source">Radar CZS</span>
      <h3>Sem destaque encontrado para este tema agora.</h3>
      <p>Troque o chip acima para abrir outro módulo do radar local.</p>
    `;
    radarGrid.appendChild(emptyState);
  }

  setActiveRadarFilter(filter);
  updateRadarGuide(filter, spotlightArticles);
  registerInteractivePanels(radarGrid);
  registerArticleCardLinks(radarGrid);
};

if (radarGuide && !performanceLiteMode) {
  window.addEventListener("resize", scheduleRadarGuideTarget);
  window.addEventListener("scroll", scheduleRadarGuideTarget, { passive: true });
  startRadarGuideScan();

  if (document.fonts?.ready) {
    document.fonts.ready.then(scheduleRadarGuideTarget).catch(() => {});
  }
}

dayChips.forEach((button) => {
  button.addEventListener("click", () => {
    dayChips.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
  });
});

betButtons.forEach((button) => {
  button.addEventListener("click", () => {
    betButtons.forEach((item) => item.classList.remove("is-selected"));
    button.classList.add("is-selected");
  });
});

const updateProjection = () => {
  const stake = Number(stakeInput.value);
  const trackedItems = Math.round(18 + ((stake - 7) / (31 - 7)) * (74 - 18));

  stakeValue.textContent = `${stake} dias`;
  stakeReturn.textContent = `${trackedItems} notas`;
};

if (stakeInput && stakeValue && stakeReturn) {
  updateProjection();
  stakeInput.addEventListener("input", updateProjection);
}

if (opinionInput && charCount) {
  opinionInput.addEventListener("input", () => {
    charCount.textContent = `${opinionInput.value.length} / 180`;
  });
}

const buildCommentCard = (comment) => {
  const article = document.createElement("article");
  const header = document.createElement("header");
  const author = document.createElement("strong");
  const badge = document.createElement("span");
  const message = document.createElement("p");

  article.className = "comment-card reveal active";
  author.textContent = comment.name || comment.author || "Leitor local";
  badge.textContent = comment.badge || comment.city || "Comunidade";
  message.textContent = `“${comment.message || ""}”`;

  header.append(author, badge);
  article.append(header, message);
  return article;
};

const renderCommentsFeed = (items = []) => {
  if (!commentsFeed) {
    return;
  }

  commentsFeed.innerHTML = "";
  items.forEach((comment) => {
    commentsFeed.appendChild(buildCommentCard(comment));
  });
};

const getAnalyticsContext = () => {
  try {
    return window.CatalogoAnalytics?.getContext?.() || {};
  } catch {
    return {};
  }
};

let pointerX = window.innerWidth / 2;
let pointerY = window.innerHeight / 2;
let scrollY = window.scrollY;

const renderParallax = () => {
  parallaxNodes.forEach((node) => {
    const depth = Number(node.dataset.depth || 12);
    const offsetX = ((pointerX - window.innerWidth / 2) / window.innerWidth) * depth;
    const offsetY = ((pointerY - window.innerHeight / 2) / window.innerHeight) * depth;
    const scrollOffset = Math.min(scrollY * 0.015, depth * 1.5);
    node.style.transform = `translate3d(${offsetX}px, ${offsetY + scrollOffset}px, 0)`;
  });
};

if (!performanceLiteMode && parallaxNodes.length > 0) {
  renderParallax();

  window.addEventListener("mousemove", (event) => {
    pointerX = event.clientX;
    pointerY = event.clientY;
    renderParallax();
  });

  window.addEventListener(
    "scroll",
    () => {
      scrollY = window.scrollY;
      renderParallax();
    },
    { passive: true }
  );
}

if (guideTip && !performanceLiteMode) {
  let guideIndex = 0;

  window.setInterval(() => {
    guideIndex = (guideIndex + 1) % guideMessages.length;
    guideTip.textContent = guideMessages[guideIndex];
  }, 4200);
}

const mediaDefaults = {
  badge: "",
  label: "",
  note: "Cobertura direta do Catalogo Cruzeiro do Sul",
  creditLabel: "Politica visual do Catalogo",
  creditUrl: "./index.html#desmonte"
};

const getSlugFromLink = (node) => {
  if (!node || !node.getAttribute) {
    return "";
  }

  const href = node.getAttribute("href") || "";
  const match = href.match(/slug=([^&]+)/);
  return match ? decodeURIComponent(match[1]) : "";
};

const ensureMediaBadge = (node, media) => {
  if (!node || node.querySelector(".thumb-media-badge")) {
    return;
  }

  if (!media || !media.badge) {
    return;
  }

  const badge = document.createElement("span");
  badge.className = "thumb-media-badge";
  badge.textContent = media.badge;
  node.appendChild(badge);
};

const liveFeedGrid = document.querySelector("#live-feed-grid");
const liveFeedQuery = document.querySelector("#live-feed-query");
const liveFeedSuggestions = document.querySelector("#arquivo-noticias-sugestoes");
const liveFeedMore = document.querySelector("#live-feed-more");
const liveFeedCount = document.querySelector("#live-feed-count");
const liveFeedCountLabel = document.querySelector("#live-feed-count-label");
const liveFeedTotal = document.querySelector("#live-feed-total");
const liveFeedStatus = document.querySelector("#live-feed-status");
const liveFeedFilters = document.querySelector("#live-feed-filters");
const liveFeedUpdated = document.querySelector("#live-feed-updated");
const liveFeedFocus = document.querySelector("#live-feed-focus");
const liveFeedSources = document.querySelector("#live-feed-sources");
const liveFeedClear = document.querySelector("#live-feed-clear");
const liveFeedState = {
  pageSize: 6,
  visibleItems: 6,
  items: [...initialStaticNews],
  activeCategory: ""
};

const monthIndex = {
  janeiro: 0,
  fevereiro: 1,
  marco: 2,
  abril: 3,
  maio: 4,
  junho: 5,
  julho: 6,
  agosto: 7,
  setembro: 8,
  outubro: 9,
  novembro: 10,
  dezembro: 11
};

const normalizeText = (value) =>
  String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const slugifyText = (value) =>
  normalizeText(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const getLocalDateKey = (date = new Date()) => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: localeTimeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(date);

  const dateParts = Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value])
  );

  return `${dateParts.year}-${dateParts.month}-${dateParts.day}`;
};

const previewClassByCategory = {
  cotidiano: "thumb-cheia",
  saude: "thumb-saude",
  negocios: "thumb-pascoa",
  policia: "thumb-policia",
  educacao: "thumb-educacao",
  prefeitura: "thumb-politica",
  politica: "thumb-politica",
  esporte: "thumb-cultura",
  "utilidade publica": "thumb-alerta",
  "festas & social": "thumb-social",
  social: "thumb-social",
  cultura: "thumb-cultura"
};

const categoryLabelByKey = {
  cotidiano: "Cotidiano",
  prefeitura: "Prefeitura",
  politica: "Política",
  policia: "Polícia",
  saude: "Saúde",
  educacao: "Educação",
  negocios: "Negócios",
  cultura: "Cultura",
  esporte: "Esporte",
  social: "Social",
  "festas & social": "Festas & Social",
  "utilidade publica": "Utilidade Pública"
};

const categoryAliasMap = {
  cotidiano: "cotidiano",
  politica: "politica",
  policia: "policia",
  saude: "saude",
  educacao: "educacao",
  economia: "negocios",
  negocios: "negocios",
  cultura: "cultura",
  variedades: "cultura",
  esporte: "esporte",
  "destaques esporte": "esporte",
  governo: "prefeitura",
  prefeitura: "prefeitura",
  editais: "utilidade publica",
  detran: "utilidade publica",
  social: "social",
  "festas & social": "festas & social",
  "ac24horas play": "cultura",
  newsletter: "",
  nacional: "",
  geral: "",
  acre: "",
  "acre 03": "",
  "destaque 1": "",
  "extra total": ""
};

const genericCategoryKeys = new Set([
  "",
  "newsletter",
  "nacional",
  "geral",
  "acre",
  "acre 03",
  "destaque 1",
  "extra total"
]);

const radarCategoryRelevance = {
  cotidiano: 6,
  saude: 5,
  "utilidade publica": 5,
  prefeitura: 4,
  politica: 4,
  policia: 4,
  educacao: 4,
  esporte: 4,
  negocios: 3,
  cultura: 3,
  "festas & social": 2,
  social: 2
};

const isKnownCategoryKey = (categoryKey = "") => Boolean(categoryLabelByKey[categoryKey]);

const formatCategoryLabel = (categoryKey = "") =>
  categoryLabelByKey[categoryKey] || categoryLabelByKey.cotidiano;

const inferCategoryKeyFromContent = (rawText = "") => {
  const haystack = normalizeText(rawText);

  if (!haystack) {
    return "";
  }

  if (
    /\b(policia|policial|preso|prende|prisao|trafico|crime|assalto|roubo|furto|homicidio|estupr|foragido|delegacia|delegado|operacao)\b/.test(
      haystack
    )
  ) {
    return "policia";
  }

  if (
    /\b(saude|hospital|ubs|upa|medic|vacina|vacinacao|dengue|cirurg|sus|atendimento|doenca|doula)\b/.test(
      haystack
    )
  ) {
    return "saude";
  }

  if (
    /\b(educacao|escola|colegio|ifac|ufac|universidade|estudante|enem|vestibular|aula|ensino|professor)\b/.test(
      haystack
    )
  ) {
    return "educacao";
  }

  if (
    /\b(esporte|futebol|basquete|campeonato|atleta|jogo|serie d|tourao|humaita|galvez)\b/.test(
      haystack
    )
  ) {
    return "esporte";
  }

  if (
    /\b(utilidade|servico|alerta|defesa civil|alag|chuva|temporal|transito|detran|edital|inscric|prazo|abastecimento|limpeza|coleta|ponto facultativo|pagamento|abrigo|rodovia|estrada)\b/.test(
      haystack
    )
  ) {
    return "utilidade publica";
  }

  if (
    /\b(aleac|camara|deputad|senador|ministro|stj|stf|eleicao|eleitoral|parlamento|monopolio aereo)\b/.test(
      haystack
    )
  ) {
    return "politica";
  }

  if (
    /\b(prefeitura|governo|governador|governadora|prefeito|prefeita|secretaria|secretario|gestao|obras?)\b/.test(
      haystack
    )
  ) {
    return "prefeitura";
  }

  if (/\b(negocio|economia|comercio|empresa|empreendedor|mercado|feira)\b/.test(haystack)) {
    return "negocios";
  }

  if (/\b(festa|social|celebridade|aniversario|casamento|coluna social)\b/.test(haystack)) {
    return "festas & social";
  }

  if (
    /\b(cultura|cinema|teatro|show|festival|musica|arte|artista|entretenimento|variedades)\b/.test(
      haystack
    )
  ) {
    return "cultura";
  }

  return "";
};

const normalizeNewsCategoryKey = (rawCategory = "", context = {}) => {
  const rawKey = normalizeText(rawCategory);
  const mappedKey = Object.prototype.hasOwnProperty.call(categoryAliasMap, rawKey)
    ? categoryAliasMap[rawKey]
    : "";

  if (mappedKey) {
    return mappedKey;
  }

  if (rawKey && !genericCategoryKeys.has(rawKey) && isKnownCategoryKey(rawKey)) {
    return rawKey;
  }

  const inferredKey = inferCategoryKeyFromContent(
    [rawCategory, context.title, context.summary, context.sourceName, context.sourceLabel].join(" ")
  );
  if (inferredKey) {
    return inferredKey;
  }

  const defaultKey = normalizeText(context.defaultCategory || "");
  if (isKnownCategoryKey(defaultKey)) {
    return defaultKey;
  }

  return "cotidiano";
};

const formatDisplayDate = (value) => {
  if (!value) {
    return "Sem data";
  }

  if (typeof value === "string" && !/^\d{4}-\d{2}-\d{2}/.test(value)) {
    return value;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return String(value);
  }

  return parsed.toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: localeTimeZone
  });
};

const formatCompactDisplayDate = (value) => {
  if (!value) {
    return "Sem data";
  }

  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed
      .toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: localeTimeZone
      })
      .replace(/\./g, "")
      .replace(/\s+de\s+/gi, " ")
      .trim();
  }

  return cleanArticleText(String(value || ""))
    .replace(/\./g, "")
    .replace(/\s+de\s+/gi, " ")
    .trim();
};

const formatMosaicSourceLabel = (article = {}) => {
  const sourceName = cleanArticleText(
    article.sourceName || article.source || article.sourceLabel || "Fonte local"
  );
  const dateLabel = formatCompactDisplayDate(article.publishedAt || article.date || article.createdAt || "");
  return dateLabel && dateLabel !== "Sem data" ? `${sourceName} • ${dateLabel}` : sourceName;
};

const decodeBasicEntities = (value = "") =>
  String(value || "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&quot;/gi, '"')
    .replace(/&amp;/gi, "&")
    .replace(/&hellip;|&#8230;/gi, "...")
    .replace(/&#8211;|&#8212;/gi, "-")
    .replace(/&#8216;|&#8217;/gi, "'")
    .replace(/&#8220;|&#8221;/gi, '"')
    .replace(/&#(\d+);/g, (_match, code) => {
      const parsed = Number(code);
      return Number.isFinite(parsed) ? String.fromCharCode(parsed) : "";
    });

const cleanArticleText = (value = "") =>
  decodeBasicEntities(value)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const cleanArticleExcerpt = (value = "", fallback = "") => {
  let text = cleanArticleText(value || fallback || "");

  text = text
    .replace(/\s*["“”]?\s*data-medium-file="[^"]*"/gi, " ")
    .replace(/\s*data-large-file="[^"]*"/gi, " ")
    .replace(/\s*data-orig-file="[^"]*"/gi, " ")
    .replace(/\s*data-orig-size="[^"]*"/gi, " ")
    .replace(/\s*srcset="[^"]*"/gi, " ")
    .replace(/\s*src="[^"]*"/gi, " ")
    .replace(/\s*The post .*? appeared first on .*?\.?$/i, "")
    .replace(/\[\s*\.{3}\s*\]|\[\s*…\s*\]/g, "...")
    .replace(/\s+/g, " ")
    .trim();

  if (/^(foto|fotos|imagem|imagens|screenshot|arquivo|reproducao|reprodução)\s*:/i.test(text)) {
    text = text
      .replace(
        /^(foto|fotos|imagem|imagens|screenshot|arquivo|reproducao|reprodução)\s*:\s*.*?(?=\s+(A|O|As|Os|Uma|Um|Na|No|Em|Foi|Com|Pontos|Fortes|Durante)\b)/i,
        ""
      )
      .trim();
  }

  return text || cleanArticleText(fallback || value || "");
};

const normalizeRuntimeArticle = (article = {}) => {
  const title = cleanArticleText(article.title || "Atualizacao");
  const categoryKey = normalizeNewsCategoryKey(article.category, {
    defaultCategory: article.defaultCategory,
    title,
    summary: article.lede || article.summary || article.description,
    sourceName: article.sourceName || article.source || article.sourceLabel
  });
  const category = formatCategoryLabel(categoryKey);
  const sourceName = cleanArticleText(
    article.sourceName || article.source || article.sourceLabel || "Fonte local"
  );
  const sourceUrl = article.sourceUrl || article.url || article.link || "#";
  const lede = cleanArticleExcerpt(
    article.lede || article.summary || article.description || "Sem resumo.",
    article.sourceLabel || article.title || "Sem resumo."
  );
  const slug = String(article.slug || slugifyText(title) || article.id || "").trim();
  const originalImageUrl = String(article.feedImageUrl || article.imageUrl || "");
  const originalSourceImageUrl = String(article.sourceImageUrl || "");
  const originalFeedImageUrl = String(article.feedImageUrl || article.imageUrl || "");
  const imageUrl = sanitizeImageUrl(
    originalImageUrl ||
      originalFeedImageUrl ||
      extractInlineArticleImage(article) ||
      originalSourceImageUrl
  );

  return {
    ...article,
    id: article.id || slug || sourceUrl || title,
    slug,
    title,
    category,
    categoryKey,
    previewClass: article.previewClass || previewClassByCategory[categoryKey] || "thumb-servico",
    sourceName,
    sourceUrl,
    sourceLabel: cleanArticleText(article.sourceLabel || title),
    lede,
    date: formatDisplayDate(article.date || article.publishedAt || article.createdAt || ""),
    originalImageUrl,
    originalSourceImageUrl,
    originalFeedImageUrl,
    imageUrl
  };
};

const parseArticleDate = (value) => {
  const normalized = normalizeText(value).replace("º", "");
  const match = normalized.match(/(\d{1,2}) de ([a-z]+) de (\d{4})/);

  if (!match) {
    return 0;
  }

  const [, day, month, year] = match;
  return new Date(Number(year), monthIndex[month] ?? 0, Number(day)).getTime();
};

const getArticleDateKey = (article = {}) => {
  const rawValue = article.publishedAt || article.date || article.createdAt || "";

  if (!rawValue) {
    return "";
  }

  if (typeof rawValue === "string") {
    const isoMatch = rawValue.match(/^(\d{4}-\d{2}-\d{2})/);
    if (isoMatch) {
      return isoMatch[1];
    }

    const normalized = normalizeText(rawValue).replace("º", "");
    const longDateMatch = normalized.match(/(\d{1,2}) de ([a-z]+) de (\d{4})/);

    if (longDateMatch) {
      const [, day, month, year] = longDateMatch;
      const monthNumber = String((monthIndex[month] ?? 0) + 1).padStart(2, "0");
      const dayNumber = String(Number(day)).padStart(2, "0");
      return `${year}-${monthNumber}-${dayNumber}`;
    }
  }

  const parsed = new Date(rawValue);
  return Number.isNaN(parsed.getTime()) ? "" : getLocalDateKey(parsed);
};

const getArticleSortTimestamp = (article = {}) =>
  Date.parse(article.publishedAt || article.createdAt || "") || parseArticleDate(article.date || "");

const getRadarArticleKey = (article = {}) => {
  const normalizedArticle = normalizeRuntimeArticle(article);
  return (
    normalizedArticle.sourceUrl ||
    normalizedArticle.slug ||
    normalizedArticle.id ||
    normalizeText(
      [normalizedArticle.title, normalizedArticle.date, normalizedArticle.sourceName].join(" ")
    )
  );
};

const getRadarRelevanceScore = (article = {}) =>
  radarCategoryRelevance[
    normalizeRuntimeArticle(article).categoryKey || normalizeText(article.category)
  ] || 0;

const articleCategoryGroups = {
  cotidiano: ["cotidiano"],
  prefeitura: ["prefeitura", "politica", "utilidade publica", "gestao publica"],
  politica: ["politica", "prefeitura", "utilidade publica", "gestao publica"],
  policia: ["policia", "seguranca"],
  saude: ["saude"],
  educacao: ["educacao"],
  negocios: ["negocios", "economia"],
  cultura: ["cultura", "variedades"],
  social: ["social", "festas & social"],
  esporte: ["esporte"]
};

const getArticleCategoryGroup = (filter = "") => {
  const normalizedFilter = normalizeText(filter);
  return articleCategoryGroups[normalizedFilter] || (normalizedFilter ? [normalizedFilter] : []);
};

const articleMatchesCategoryFilter = (article = {}, filter = "") => {
  const normalizedFilter = normalizeText(filter);

  if (!normalizedFilter || normalizedFilter === "todos") {
    return true;
  }

  const normalizedArticle = normalizeRuntimeArticle(article);
  const categoryKey = normalizedArticle.categoryKey || normalizeText(normalizedArticle.category);
  return getArticleCategoryGroup(normalizedFilter).includes(categoryKey);
};

const sortRadarArticles = (articles = []) =>
  [...articles].sort((left, right) => {
    const dateDiff = getArticleSortTimestamp(right) - getArticleSortTimestamp(left);
    if (dateDiff !== 0) {
      return dateDiff;
    }

    const priorityDiff = Number(right.priority || 0) - Number(left.priority || 0);
    if (priorityDiff !== 0) {
      return priorityDiff;
    }

    const relevanceDiff = getRadarRelevanceScore(right) - getRadarRelevanceScore(left);
    if (relevanceDiff !== 0) {
      return relevanceDiff;
    }

    const imageDiff =
      Number(articleHasUsableImageCandidate(right, "hero")) -
      Number(articleHasUsableImageCandidate(left, "hero"));
    if (imageDiff !== 0) {
      return imageDiff;
    }

    return String(left.title || "").localeCompare(String(right.title || ""), "pt-BR");
  });

const getArticleDisplayImageUrl = (article = {}, surface = "default") =>
  collectArticleImageCandidates(article, surface)[0] || "";

const getArticlePreferredImageUrl = (article = {}, surface = "default") => {
  const candidates = collectArticleImageCandidates(article, surface).filter(
    (candidate) => !isIllustrativeImage({ ...article, imageUrl: candidate })
  );
  return candidates[0] || "";
};

const articleHasUsableImageCandidate = (article = {}, surface = "default") =>
  Boolean(getArticlePreferredImageUrl(article, surface));

const getArticleImageKey = (article = {}, surface = "default") =>
  getImageFingerprint(getArticleDisplayImageUrl(article, surface));

const newsSurfaceReservations = {
  hero: new Set(),
  social: new Set(),
  buzz: new Set(),
  popular: new Set()
};

const getArticleUsageKey = (article = {}) => getRadarArticleKey(normalizeRuntimeArticle(article));

const reserveSurfaceArticles = (surfaceName = "", articles = []) => {
  if (!surfaceName) {
    return;
  }

  newsSurfaceReservations[surfaceName] = new Set(
    (Array.isArray(articles) ? articles : [])
      .map((article) => getArticleUsageKey(article))
      .filter(Boolean)
  );
};

const buildReservedArticleKeys = (excludedSurfaces = []) => {
  const excluded = new Set(excludedSurfaces);
  const reserved = new Set();

  Object.entries(newsSurfaceReservations).forEach(([surfaceName, surfaceKeys]) => {
    if (excluded.has(surfaceName) || !(surfaceKeys instanceof Set)) {
      return;
    }

    surfaceKeys.forEach((key) => reserved.add(key));
  });

  return reserved;
};

const pushUniqueArticle = (
  article,
  bucket,
  selectedKeys,
  selectedImages,
  allowDuplicateImages = false
) => {
  const articleKey = getRadarArticleKey(article);
  if (selectedKeys.has(articleKey)) {
    return false;
  }

  const imageKey = getArticleImageKey(article, "hero");
  if (!allowDuplicateImages && imageKey && selectedImages.has(imageKey)) {
    return false;
  }

  selectedKeys.add(articleKey);
  if (imageKey) {
    selectedImages.add(imageKey);
  }
  bucket.push(article);
  return true;
};

const pickRadarLeadArticles = (articles = []) => {
  const todayKey = getLocalDateKey();
  const availableDateKeys = [...new Set(articles.map((article) => getArticleDateKey(article)).filter(Boolean))]
    .sort((left, right) => right.localeCompare(left));
  const referenceDateKey = availableDateKeys.find((dateKey) => dateKey <= todayKey) || availableDateKeys[0] || "";
  const sameDayArticles = sortRadarArticles(
    articles.filter((article) => getArticleDateKey(article) === referenceDateKey)
  );
  const leadArticles = [];
  const selectedKeys = new Set();
  const selectedImages = new Set();

  sameDayArticles.some((article) => {
    if (leadArticles.length >= 3) return true;
    pushUniqueArticle(article, leadArticles, selectedKeys, selectedImages);
    return false;
  });

  if (leadArticles.length < 3) {
    const fallbackArticles = sortRadarArticles(
      articles.filter((article) => !selectedKeys.has(getRadarArticleKey(article)))
    );

    fallbackArticles.some((article) => {
      pushUniqueArticle(article, leadArticles, selectedKeys, selectedImages);
      return leadArticles.length >= 3;
    });

    if (leadArticles.length < 3) {
      sameDayArticles.some((article) => {
        if (leadArticles.length >= 3) return true;
        pushUniqueArticle(article, leadArticles, selectedKeys, selectedImages, true);
        return false;
      });
    }

    if (leadArticles.length < 3) {
      fallbackArticles.some((article) => {
        if (leadArticles.length >= 3) return true;
        pushUniqueArticle(article, leadArticles, selectedKeys, selectedImages, true);
        return false;
      });
    }
  }

  return { leadArticles, referenceDateKey };
};

const resolveApiBases = () => {
  const bases = [];
  const addBase = (value) => {
    const normalized = String(value || "").trim().replace(/\/$/, "");
    if (!normalized || bases.includes(normalized)) {
      return;
    }
    bases.push(normalized);
  };
  const localBaseCandidates = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8787",
    "http://127.0.0.1:8787"
  ];
  const configuredBases = Array.isArray(window.CATALOGO_API_BASES) ? window.CATALOGO_API_BASES : [];
  const configuredBase =
    typeof window.CATALOGO_API_BASE === "string" && window.CATALOGO_API_BASE
      ? window.CATALOGO_API_BASE
      : "";
  const localHostPattern = /^(localhost|127(?:\.\d{1,3}){3})$/i;
  const isLocalHttp = window.location.protocol.startsWith("http") && localHostPattern.test(window.location.hostname);

  if (isLocalHttp && window.location.port !== "3000") {
    localBaseCandidates.forEach(addBase);
  }

  configuredBases.forEach(addBase);
  addBase(configuredBase);

  if (window.location.protocol.startsWith("http")) {
    addBase(window.location.origin);
  } else {
    localBaseCandidates.forEach(addBase);
  }

  if (isLocalHttp) {
    localBaseCandidates.forEach(addBase);
  }

  return bases.length ? bases : localBaseCandidates;
};

const rememberApiBase = (base = "") => {
  const normalized = String(base || "").trim().replace(/\/$/, "");
  if (!normalized) {
    return;
  }

  window.CATALOGO_API_BASE = normalized;
  window.CATALOGO_API_BASES = [normalized].concat(
    (Array.isArray(window.CATALOGO_API_BASES) ? window.CATALOGO_API_BASES : []).filter(
      (candidate) => String(candidate || "").trim().replace(/\/$/, "") !== normalized
    )
  );

  try {
    localStorage.setItem("catalogo_api_base", normalized);
  } catch {
    // ignore
  }
};

const requestApiJson = async (path, options = {}) => {
  const nextHeaders = { ...(options.headers || {}) };

  if (options.body && !nextHeaders["Content-Type"]) {
    nextHeaders["Content-Type"] = "application/json";
  }

  if (!nextHeaders.Accept) {
    nextHeaders.Accept = "application/json";
  }

  let lastError = null;
  const bases = resolveApiBases();

  for (let index = 0; index < bases.length; index += 1) {
    const apiBase = bases[index];

    try {
      const response = await fetch(`${apiBase}${path}`, {
        ...options,
        headers: nextHeaders
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        const message = payload.error || payload.message || `Falha em ${path}`;
        const canRetry = (response.status === 404 || response.status === 405) && index < bases.length - 1;

        if (canRetry) {
          lastError = new Error(message);
          continue;
        }

        throw new Error(message);
      }

      const contentType = String(response.headers.get("content-type") || "").toLowerCase();
      if (!contentType.includes("json")) {
        const invalidPayloadError = new Error(`Resposta invalida em ${path}`);
        if (index < bases.length - 1) {
          lastError = invalidPayloadError;
          continue;
        }
        throw invalidPayloadError;
      }

      const payload = await response.json().catch(() => null);
      if (!payload || typeof payload !== "object") {
        const invalidPayloadError = new Error(`Resposta invalida em ${path}`);
        if (index < bases.length - 1) {
          lastError = invalidPayloadError;
          continue;
        }
        throw invalidPayloadError;
      }

      rememberApiBase(apiBase);
      return payload;
    } catch (error) {
      lastError = error;

      if (!(error instanceof TypeError) || index >= bases.length - 1) {
        break;
      }
    }
  }

  throw lastError || new Error(`Falha em ${path}`);
};

const copyTextToClipboard = async (value = "") => {
  const text = String(value || "").trim();
  if (!text) {
    return false;
  }

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (_error) {
    // Continua para o fallback abaixo.
  }

  const helper = document.createElement("textarea");
  helper.value = text;
  helper.setAttribute("readonly", "readonly");
  helper.style.position = "fixed";
  helper.style.opacity = "0";
  document.body.appendChild(helper);
  helper.select();
  const copied = document.execCommand("copy");
  helper.remove();
  return copied;
};

const buildCommonsTourismPhotoUrl = (fileName = "", width = 1200) => {
  const encodedName = encodeURIComponent(String(fileName || "").trim());
  return `https://images.weserv.nl/?url=commons.wikimedia.org/wiki/Special:FilePath/${encodedName}&w=${width}&output=jpg`;
};

const buildCommonsTourismFallbackUrl = (fileName = "") =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(String(fileName || "").trim())}`;

const preloadHeroTourismImage = (primaryUrl = "", fallbackUrl = "") =>
  new Promise((resolve) => {
    const candidates = [primaryUrl, fallbackUrl].filter(Boolean);

    const tryLoad = (index = 0) => {
      const targetUrl = candidates[index];
      if (!targetUrl) {
        resolve("");
        return;
      }

      const loader = new Image();
      loader.decoding = "async";
      loader.referrerPolicy = "no-referrer";
      loader.loading = "eager";

      loader.onload = () => {
        const finalize = () => resolve(targetUrl);
        if (typeof loader.decode === "function") {
          loader.decode().catch(() => {}).finally(finalize);
          return;
        }
        finalize();
      };

      loader.onerror = () => tryLoad(index + 1);
      loader.src = targetUrl;
    };

    tryLoad(0);
  });

const getHeroTourismPhoto = (photoIndex = 0) => {
  if (!heroTourismPhotoPool.length) {
    return null;
  }

  const poolIndex =
    ((Number(photoIndex) % heroTourismPhotoPool.length) + heroTourismPhotoPool.length) %
    heroTourismPhotoPool.length;
  const photo = heroTourismPhotoPool[poolIndex];

  return {
    ...photo,
    proxyUrl: buildCommonsTourismPhotoUrl(photo.file, 1920),
    fallbackUrl: buildCommonsTourismFallbackUrl(photo.file)
  };
};

const setHeroTourismMeta = (photo) => {
  if (!photo) {
    return;
  }

  if (heroTourismTitle) {
    heroTourismTitle.textContent = photo.title;
  }

  if (heroTourismNote) {
    heroTourismNote.textContent = photo.note;
  }
};

const paintHeroTourismBackdrop = (slideNode, photo) => {
  if (!slideNode || !photo) {
    return Promise.resolve(false);
  }

  const requestToken = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  slideNode.dataset.heroBackdropToken = requestToken;

  return preloadHeroTourismImage(photo.proxyUrl, photo.fallbackUrl).then((resolvedUrl) => {
    if (slideNode.dataset.heroBackdropToken !== requestToken || !resolvedUrl) {
      return false;
    }

    slideNode.style.backgroundImage = `
      linear-gradient(180deg, rgba(6, 16, 29, 0.08), rgba(6, 16, 29, 0.24)),
      url("${resolvedUrl}")
    `;
    slideNode.style.backgroundPosition = "center 44%";
    slideNode.style.backgroundSize = "cover";
    slideNode.dataset.heroBackdropReady = "true";
    return true;
  });
};

const rotateHeroOfficeStatus = (groupIndex = 0) => {
  if (!heroOfficeStatusNodes.length || !heroOfficeStatusGroups.length) {
    return;
  }

  const nextGroup = heroOfficeStatusGroups[groupIndex % heroOfficeStatusGroups.length] || [];
  heroOfficeStatusNodes.forEach((node, index) => {
    node.textContent = nextGroup[index] || nextGroup[nextGroup.length - 1] || node.textContent;
  });
};

const rotateHeroOfficeBubble = (bubbleIndex = 0) => {
  if (!heroOfficeBubble || !heroOfficeBubblePool.length) {
    return;
  }

  heroOfficeBubble.textContent =
    heroOfficeBubblePool[bubbleIndex % heroOfficeBubblePool.length] || heroOfficeBubble.textContent;
  heroOfficeBubble.classList.remove("is-pop");
  window.requestAnimationFrame(() => {
    heroOfficeBubble.classList.add("is-pop");
  });
};

const renderHeroTourismBackground = (photoIndex = 0, { initial = false } = {}) => {
  if (!heroTourismSlides.length) {
    return;
  }

  const photo = getHeroTourismPhoto(photoIndex);
  if (!photo) {
    return;
  }

  const activeSlide =
    heroTourismSlides[heroTourismRotation.activeSlideIndex] || heroTourismSlides[0];
  const fallbackNextSlide = heroTourismSlides.find((slide) => slide !== activeSlide) || activeSlide;
  const nextSlide = initial ? activeSlide : fallbackNextSlide;

  paintHeroTourismBackdrop(nextSlide, photo).then((painted) => {
    if (!painted) {
      return;
    }

    setHeroTourismMeta(photo);

    heroTourismSlides.forEach((slide) => {
      slide.classList.toggle("is-active", slide === nextSlide);
    });

    heroTourismRotation.activeSlideIndex = Math.max(heroTourismSlides.indexOf(nextSlide), 0);
    heroTourismRotation.photoIndex = photoIndex;

    if (heroTourismShell) {
      heroTourismShell.dataset.heroTourismReady = "true";
    }
  });
};

const initializeHeroTourismHero = () => {
  if (!heroTourismShell || !heroTourismSlides.length) {
    return;
  }

  if (heroTourismRotation.timerId) {
    window.clearInterval(heroTourismRotation.timerId);
  }

  if (heroTourismRotation.statusTimerId) {
    window.clearInterval(heroTourismRotation.statusTimerId);
  }

  if (heroTourismRotation.bubbleTimerId) {
    window.clearInterval(heroTourismRotation.bubbleTimerId);
  }

  heroTourismRotation.photoIndex = 0;
  heroTourismRotation.activeSlideIndex = 0;
  heroTourismRotation.statusIndex = 0;
  heroTourismRotation.bubbleIndex = 0;

  renderHeroTourismBackground(0, { initial: true });
  rotateHeroOfficeStatus(0);
  rotateHeroOfficeBubble(0);

  if (heroTourismPhotoPool.length > 1) {
    heroTourismRotation.timerId = window.setInterval(() => {
      const nextPhotoIndex = (heroTourismRotation.photoIndex + 1) % heroTourismPhotoPool.length;
      renderHeroTourismBackground(nextPhotoIndex);
    }, 5000);
  }

  if (heroOfficeStatusNodes.length && heroOfficeStatusGroups.length > 1) {
    heroTourismRotation.statusTimerId = window.setInterval(() => {
      heroTourismRotation.statusIndex =
        (heroTourismRotation.statusIndex + 1) % heroOfficeStatusGroups.length;
      rotateHeroOfficeStatus(heroTourismRotation.statusIndex);
    }, 4200);
  }

  if (heroOfficeBubble && heroOfficeBubblePool.length > 1) {
    heroTourismRotation.bubbleTimerId = window.setInterval(() => {
      heroTourismRotation.bubbleIndex =
        (heroTourismRotation.bubbleIndex + 1) % heroOfficeBubblePool.length;
      rotateHeroOfficeBubble(heroTourismRotation.bubbleIndex);
    }, 3600);
  }
};

const openArchiveBrowser = (seedQuery = "") => {
  const now = Date.now();
  if (now - lastArchiveBrowserOpenAt < 700) {
    return;
  }

  lastArchiveBrowserOpenAt = now;
  const archiveUrl = new URL("./arquivo.html", window.location.href);
  const normalizedQuery = String(seedQuery || "").trim();

  if (normalizedQuery) {
    archiveUrl.searchParams.set("q", normalizedQuery);
  }

  window.open(archiveUrl.toString(), "_blank", "noopener,noreferrer");
};

const attachArchiveBrowserLaunchers = () => {
  if (!archiveBrowserLaunchers.length) {
    return;
  }

  archiveBrowserLaunchers.forEach((launcher) => {
    if (!launcher || launcher.dataset.archiveBrowserBound === "true") {
      return;
    }

    launcher.dataset.archiveBrowserBound = "true";
    const launch = (event) => {
      event?.preventDefault?.();
      const inputValue =
        launcher instanceof HTMLInputElement
          ? String(launcher.value || "").trim()
          : String(liveFeedQuery?.value || "").trim();
      openArchiveBrowser(inputValue);
    };

    if (launcher instanceof HTMLInputElement) {
      launcher.addEventListener("focus", launch);
      launcher.addEventListener("click", launch);
      launcher.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          launch(event);
        }
      });
      return;
    }

    launcher.addEventListener("click", launch);
    launcher.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        launch(event);
      }
    });
  });
};

const typeInsidersLine = (node, text, delay, step) => {
  if (!node) {
    return;
  }

  if (splashMotionQuery.matches) {
    node.textContent = text;
    return;
  }

  node.textContent = "";
  let index = 0;
  window.setTimeout(function tick() {
    index += 1;
    node.textContent = text.slice(0, index);

    if (index < text.length) {
      window.setTimeout(tick, step);
    }
  }, delay);
};

const insidersAsciiGlyphs = "01<>[]{}()/\\|=+*#%@&$░▒▓█";

const getRandomGlyph = () =>
  insidersAsciiGlyphs[Math.floor(Math.random() * insidersAsciiGlyphs.length)] || "0";

const buildBinaryMask = (text = "") =>
  [...String(text)].map((char) => (/\s/.test(char) ? char : Math.random() > 0.5 ? "1" : "0")).join("");

const buildAsciiMask = (text = "", revealCount = 0) =>
  [...String(text)]
    .map((char, index) => {
      if (/\s/.test(char)) return char;
      return index < revealCount ? char : getRandomGlyph();
    })
    .join("");

const waitFrame = () =>
  new Promise((resolve) => {
    window.requestAnimationFrame(resolve);
  });

const animateInsidersCodeLine = async (node, index = 0) => {
  if (!node || node.dataset.insidersBootReady === "true") {
    return;
  }

  const finalText = String(node.dataset.insidersFinal || node.textContent || "")
    .replace(/\s+/g, " ")
    .trim();

  if (!finalText) {
    return;
  }

  node.dataset.insidersFinal = finalText;
  node.dataset.insidersBootReady = "true";
  node.setAttribute("aria-label", finalText);

  const currentHeight = node.getBoundingClientRect().height;
  if (currentHeight > 0) {
    node.style.minHeight = `${Math.ceil(currentHeight)}px`;
  }

  if (splashMotionQuery.matches) {
    node.textContent = finalText;
    return;
  }

  node.classList.add("is-binary");

  for (let frame = 0; frame < 7; frame += 1) {
    node.textContent = buildBinaryMask(finalText);
    await waitFrame();
  }

  node.classList.remove("is-binary");
  node.classList.add("is-ascii");

  const chars = [...finalText];
  const step = Math.max(2, Math.ceil(chars.length / 12));

  for (let reveal = 0; reveal <= chars.length; reveal += step) {
    node.textContent = buildAsciiMask(finalText, reveal);
    await waitFrame();
  }

  node.classList.remove("is-ascii");
  node.classList.add("is-typing");
  node.textContent = "";

  const typeStep = node.closest(".construction-service-card") || node.closest(".construction-badges") ? 3 : 2;
  for (let charIndex = 0; charIndex < chars.length; charIndex += typeStep) {
    node.textContent = chars.slice(0, charIndex + typeStep).join("");
    await waitFrame();
  }

  node.textContent = finalText;
  node.classList.remove("is-typing");
  window.setTimeout(() => {
    node.style.minHeight = "";
  }, 360 + index * 12);
};

const runInsidersBootSequence = async () => {
  if (!insidersBootScene || insidersBootScene.dataset.bootStarted === "true") {
    return;
  }

  const screen = insidersBootScene.querySelector(".insiders-code-screen");
  const codeLines = [...insidersBootScene.querySelectorAll("[data-insiders-code-line]")];

  if (!screen || !codeLines.length) {
    return;
  }

  insidersBootScene.dataset.bootStarted = "true";
  screen.classList.add("is-booting");

  const introLines = codeLines.slice(0, 4);
  const moduleLines = codeLines.slice(4);

  for (let index = 0; index < introLines.length; index += 1) {
    await animateInsidersCodeLine(introLines[index], index);
  }

  moduleLines.forEach((node, index) => {
    window.setTimeout(() => {
      void animateInsidersCodeLine(node, introLines.length + index);
    }, index * 95);
  });

  window.setTimeout(() => {
    screen.classList.add("is-ready");
  }, 460);
};

const initializeInsidersBootScreen = () => {
  if (!insidersBootScene) {
    return;
  }

  if (splashMotionQuery.matches || !("IntersectionObserver" in window)) {
    void runInsidersBootSequence();
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        observer.disconnect();
        void runInsidersBootSequence();
      });
    },
    { threshold: 0.28 }
  );

  observer.observe(insidersBootScene);
};

const initializeInsidersHeroScene = () => {
  if (!insidersTypedNodes.length) {
    return;
  }

  insidersTypedNodes.forEach((node, index) => {
    if (!node || node.dataset.typedReady === "true") {
      return;
    }

    const fullText = String(node.dataset.typedFull || node.textContent || "").trim();
    if (!fullText) {
      return;
    }

    node.dataset.typedReady = "true";
    node.setAttribute("aria-label", fullText);
    typeInsidersLine(node, fullText, 220 + index * 320, node.closest(".construction-showcase") ? 11 : 13);
  });

  if (heroInsidersShell) {
    window.requestAnimationFrame(() => {
      heroInsidersShell.classList.add("is-ready");
    });
  }
};

const buildInsidersArmyChant = () => {
  if (!insidersChantTrack || insidersChantTrack.dataset.ready === "true") {
    return;
  }

  const slogans = ["INSIDERS", "AQUI TEM VERDADE"];
  const fragment = document.createDocumentFragment();

  for (let index = 0; index < 20; index += 1) {
    const badge = document.createElement("span");
    badge.textContent = slogans[index % slogans.length];
    fragment.appendChild(badge);
  }

  insidersChantTrack.appendChild(fragment);
  insidersChantTrack.dataset.ready = "true";

  window.requestAnimationFrame(() => {
    const midpointBadge =
      insidersChantTrack.children[Math.floor(insidersChantTrack.children.length / 2)];

    if (midpointBadge instanceof HTMLElement) {
      insidersChantTrack.style.setProperty("--chant-shift", `${midpointBadge.offsetLeft}px`);
    }
  });
};

const getInsidersLiteMode = () => {
  if (performanceLiteMode || splashMotionQuery.matches) {
    return true;
  }

  const connection =
    navigator.connection || navigator.mozConnection || navigator.webkitConnection || null;
  if (connection && (connection.saveData || /(?:^|slow-)?2g$/i.test(String(connection.effectiveType || "")))) {
    return true;
  }

  const deviceMemory = Number(navigator.deviceMemory || 0);
  if (deviceMemory > 0 && deviceMemory <= 4) {
    return true;
  }

  const hardwareThreads = Number(navigator.hardwareConcurrency || 0);
  return hardwareThreads > 0 && hardwareThreads <= 4;
};

const getInsidersArmyCount = (requestedCount = 20) => {
  const safeRequestedCount = Math.max(8, Number.parseInt(requestedCount, 10) || 20);
  const isCompactViewport = window.matchMedia("(max-width: 960px)").matches;

  if (getInsidersLiteMode()) {
    return Math.min(safeRequestedCount, isCompactViewport ? 10 : 14);
  }

  return Math.min(safeRequestedCount, isCompactViewport ? 12 : 20);
};

const createInsidersArmyRobot = (rowIndex, columnIndex, rowCount, columnCount) => {
  const robot = document.createElement("article");
  const fragment = document.createDocumentFragment();
  const depth = rowCount <= 1 ? 1 : rowIndex / (rowCount - 1);
  const xRatio = columnCount <= 1 ? 0.5 : columnIndex / (columnCount - 1);
  const x = 10 + xRatio * 80;
  const y = 6 + depth * 60;
  const scale = 0.16 + depth * 0.42;
  const stepDuration = 0.78 + depth * 0.42;
  const swing = 16 + depth * 8;
  const opacity = 0.34 + depth * 0.66;
  const delay = -1 * (rowIndex * 0.06 + columnIndex * 0.03);
  const tilt = -8 + depth * 3;
  const partClassNames = [
    "robot-shadow",
    "robot-crest",
    "robot-head",
    "robot-eye-band",
    "robot-core",
    "robot-shoulder shoulder-left",
    "robot-shoulder shoulder-right",
    "robot-arm arm-left",
    "robot-arm arm-right",
    "robot-leg leg-left",
    "robot-leg leg-right"
  ];

  robot.className = "insider-robot robot-scout";
  robot.style.setProperty("--army-x", `${x.toFixed(2)}%`);
  robot.style.setProperty("--army-y", `${y.toFixed(2)}%`);
  robot.style.setProperty("--army-scale", scale.toFixed(3));
  robot.style.setProperty("--army-step", `${stepDuration.toFixed(2)}s`);
  robot.style.setProperty("--army-delay", `${delay.toFixed(2)}s`);
  robot.style.setProperty("--army-swing", `${swing.toFixed(2)}deg`);
  robot.style.setProperty("--army-tilt", `${tilt.toFixed(2)}deg`);
  robot.style.setProperty("--army-opacity", opacity.toFixed(2));
  robot.style.setProperty("--robot-z", `${10 + rowIndex}`);

  partClassNames.forEach((className) => {
    const part = document.createElement("span");
    part.className = className;
    fragment.appendChild(part);
  });

  robot.appendChild(fragment);
  return robot;
};

const initializeInsidersArmy = () => {
  if (!insidersArmyScene || insidersArmyScene.dataset.armyReady === "true") {
    return;
  }

  const renderArmy = () => {
    if (!insidersArmyScene || insidersArmyScene.dataset.armyReady === "true") {
      return;
    }

    buildInsidersArmyChant();

    const totalCount = getInsidersArmyCount(insidersArmyScene.dataset.armyCount || "20");
    const isLiteMode = getInsidersLiteMode();
    const columnCount = Math.max(isLiteMode ? 4 : 5, Math.round(Math.sqrt(totalCount * 1.15)));
    const rowCount = Math.ceil(totalCount / columnCount);
    const fragment = document.createDocumentFragment();
    let robotIndex = 0;

    insidersArmyScene.dataset.armyMode = isLiteMode ? "lite" : "full";
    insidersArmyScene.style.setProperty("--insiders-army-count", String(totalCount));

    for (let rowIndex = 0; rowIndex < rowCount; rowIndex += 1) {
      for (let columnIndex = 0; columnIndex < columnCount; columnIndex += 1) {
        if (robotIndex >= totalCount) {
          break;
        }

        fragment.appendChild(
          createInsidersArmyRobot(rowIndex, columnIndex, rowCount, columnCount)
        );
        robotIndex += 1;
      }
    }

    insidersArmyScene.textContent = "";
    insidersArmyScene.appendChild(fragment);
    insidersArmyScene.dataset.armyReady = "true";
  };

  if (!("IntersectionObserver" in window)) {
    window.setTimeout(renderArmy, 180);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        observer.disconnect();
        renderArmy();
      });
    },
    {
      rootMargin: "320px 0px",
      threshold: 0.05
    }
  );

  observer.observe(insidersArmyScene);
};

const escapeHtml = (value) =>
  String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const setFeedbackState = (node, message, tone = "") => {
  if (!node) {
    return;
  }

  node.textContent = message || "";
  node.classList.remove("is-error", "is-success");

  if (tone) {
    node.classList.add(tone);
  }
};

const dedupeNewsItems = (items = []) => {
  const mergedMap = new Map();

  items.forEach((item) => {
    const normalizedItem = normalizeRuntimeArticle(item);
    const key =
      normalizedItem.sourceUrl ||
      normalizedItem.slug ||
      normalizeText(
        [normalizedItem.title, normalizedItem.date, normalizedItem.sourceName].join(" ")
      );

    if (!mergedMap.has(key)) {
      mergedMap.set(key, normalizedItem);
    }
  });

  return [...mergedMap.values()].sort((left, right) => {
    const rightDate = Date.parse(right.publishedAt || "") || parseArticleDate(right.date);
    const leftDate = Date.parse(left.publishedAt || "") || parseArticleDate(left.date);
    return rightDate - leftDate;
  });
};

const writeOfflineStorage = (key, value) => {
  const serialized = JSON.stringify(value);
  const storages = [];

  try {
    if (window.sessionStorage) {
      storages.push(window.sessionStorage);
    }
  } catch (error) {
    // Ignora ambiente sem sessionStorage.
  }

  try {
    if (window.localStorage) {
      storages.push(window.localStorage);
    }
  } catch (error) {
    // Ignora ambiente sem localStorage.
  }

  storages.forEach((storage) => {
    try {
      storage.setItem(key, serialized);
    } catch (error) {
      // Ignora limite de storage.
    }
  });
};

const readOfflineStorage = (key) => {
  const storages = [];

  try {
    if (window.sessionStorage) {
      storages.push(window.sessionStorage);
    }
  } catch (error) {
    // Ignora ambiente sem sessionStorage.
  }

  try {
    if (window.localStorage) {
      storages.push(window.localStorage);
    }
  } catch (error) {
    // Ignora ambiente sem localStorage.
  }

  for (const storage of storages) {
    try {
      const raw = storage.getItem(key);
      if (!raw) {
        continue;
      }

      return JSON.parse(raw);
    } catch (error) {
      // Tenta o proximo storage.
    }
  }
};

const persistOfflineNewsCache = (items = []) => {
  const normalizedItems = dedupeNewsItems(items).slice(0, 180);

  if (normalizedItems.length === 0) {
    return;
  }

  writeOfflineStorage(offlineNewsCacheKey, normalizedItems);
};

const persistOfflineArticle = (article) => {
  const normalizedArticle = normalizeRuntimeArticle(article);

  if (!normalizedArticle.slug) {
    return;
  }

  writeOfflineStorage(offlineLastArticleKey, normalizedArticle);

  const cachedItems = readOfflineStorage(offlineNewsCacheKey);
  const mergedItems = Array.isArray(cachedItems)
    ? dedupeNewsItems([normalizedArticle, ...cachedItems])
    : [normalizedArticle];
  writeOfflineStorage(offlineNewsCacheKey, mergedItems.slice(0, 180));
};

const syncNewsDataset = (runtimeItems = []) => {
  const merged = dedupeNewsItems([...(runtimeItems || []), ...initialStaticNews]);
  window.NEWS_DATA = merged;
  window.NEWS_MAP = Object.fromEntries(merged.map((item) => [item.slug, item]));
  persistOfflineNewsCache(merged);
  return merged;
};

const truncateCopy = (value, maxLength = 140) => {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, Math.max(0, maxLength - 1)).trimEnd()}...`;
};

const socialSurfaceBaseScores = {
  "festas & social": 10,
  social: 10,
  cultura: 9,
  esporte: 7,
  educacao: 6,
  negocios: 5,
  prefeitura: 3,
  politica: 1,
  cotidiano: 1,
  saude: 0,
  policia: -8,
  "utilidade publica": -5
};

const socialSurfaceSignalPattern =
  /\b(festa|show|festival|evento|agenda|cultura|arte|teatro|cinema|musica|viral|rede social|instagram|tiktok|youtube|influenc|celebridade|aniversario|casamento|exposicao|feira|programacao|oficina|comunidade|historia|superacao|retrato|juventude|turma|bairro|trabalhador|pascoa)\b/;

const socialSurfaceHeavyPattern =
  /\b(crime|homicidio|prisao|operacao|assalto|roubo|furto|morte|ice|stf|cpi|inss|detran|doenca|hospital|vacina|alagacao|enchente|alerta|beneficiario)\b/;

const socialSurfacePublicEventPattern =
  /\b(show|festa|festival|programacao|agenda|evento|cultura|credenciamento|trabalhador|pascoa|natal|feira|oficina|artista|apresentacao)\b/;

const getSocialSurfaceScore = (article = {}) => {
  const normalized = normalizeRuntimeArticle(article);
  const categoryKey = normalized.categoryKey || normalizeText(normalized.category);
  const haystack = normalizeText(
    [
      normalized.title,
      normalized.sourceLabel,
      normalized.lede,
      normalized.summary,
      normalized.category,
      normalized.sourceName
    ].join(" ")
  );

  let score = socialSurfaceBaseScores[categoryKey] ?? 0;

  if (socialSurfaceSignalPattern.test(haystack)) {
    score += 6;
  }

  if (/\b(viral|instagram|tiktok|youtube|rede|post|video|fotos?)\b/.test(haystack)) {
    score += 3;
  }

  if (/\b(show|festival|cinema|teatro|musica|artista|agenda|evento|oficina|feira)\b/.test(haystack)) {
    score += 3;
  }

  if (/\b(historia|superacao|comunidade|aluno|estudante|professor|familia|bairro|juventude)\b/.test(haystack)) {
    score += 2;
  }

  if (categoryKey === "prefeitura" && socialSurfacePublicEventPattern.test(haystack)) {
    score += 3;
  }

  if (socialSurfaceHeavyPattern.test(haystack)) {
    score -= 7;
  }

  if (!articleHasUsableImageCandidate(normalized)) {
    score -= 2;
  }

  return score;
};

const pickSocialFallbackArticles = (items = [], count = 0, usedKeys = new Set()) => {
  if (count <= 0) {
    return [];
  }

  const candidates = sortRadarArticles(dedupeNewsItems(items)).map((item) =>
    normalizeRuntimeArticle(item)
  );
  const heroReservedKeys =
    newsSurfaceReservations.hero instanceof Set ? newsSurfaceReservations.hero : new Set();
  const rankedCandidates = [...candidates].sort((left, right) => {
    const scoreDiff = getSocialSurfaceScore(right) - getSocialSurfaceScore(left);
    if (scoreDiff !== 0) {
      return scoreDiff;
    }

    return getArticleSortTimestamp(right) - getArticleSortTimestamp(left);
  });
  const selected = [];
  const usedImages = new Set();
  const categoryCounts = new Map();

  const tryPushSocialArticle = (
    article,
    {
      allowDuplicateImages = false,
      allowSecondFromCategory = false,
      minimumScore = 0
    } = {}
  ) => {
    if (selected.length >= count) {
      return true;
    }

    const articleKey = getArticleUsageKey(article);
    if (!articleKey || usedKeys.has(articleKey) || heroReservedKeys.has(articleKey)) {
      return false;
    }

    if (getSocialSurfaceScore(article) < minimumScore) {
      return false;
    }

    const categoryKey = article.categoryKey || normalizeText(article.category);
    const maxPerCategory = allowSecondFromCategory ? 2 : 1;
    if ((categoryCounts.get(categoryKey) || 0) >= maxPerCategory) {
      return false;
    }

    const imageKey = getArticleImageKey(article);
    if (!allowDuplicateImages && imageKey && usedImages.has(imageKey)) {
      return false;
    }

    if (imageKey) {
      usedImages.add(imageKey);
    }
    usedKeys.add(articleKey);
    categoryCounts.set(categoryKey, (categoryCounts.get(categoryKey) || 0) + 1);
    selected.push(article);
    return selected.length >= count;
  };

  rankedCandidates.some((article) =>
    tryPushSocialArticle(article, {
      minimumScore: 3
    })
  );

  if (selected.length < count) {
    rankedCandidates.some((article) =>
      tryPushSocialArticle(article, {
        allowSecondFromCategory: true,
        minimumScore: 1
      })
    );
  }

  if (selected.length < count) {
    candidates.some((article) =>
      tryPushSocialArticle(article, {
        allowDuplicateImages: true,
        allowSecondFromCategory: true,
        minimumScore: -2
      })
    );
  }

  return selected;
};

const applySocialCardFromArticle = (card, article) => {
  if (!card || !article) {
    return;
  }

  const normalized = normalizeRuntimeArticle(article);
  const linkNode = card.querySelector(".news-thumb");
  const tagNode = linkNode?.querySelector("span");
  const sourceNode = card.querySelector(".news-source");
  const titleNode = card.querySelector("h3");
  const copyNode = card.querySelector("p");
  const footerSource = card.querySelector("footer span");
  const footerLink = card.querySelector("footer a");
  const href = buildArticleHref(normalized);

  if (linkNode) {
    linkNode.href = href;
    applyArticleLinkAttrs(linkNode, href);
    linkNode.setAttribute("aria-label", `Abrir notícia: ${normalized.title}`);
  }

  if (tagNode) {
    tagNode.textContent = truncateCopy(normalized.category, 22);
  }

  if (sourceNode) {
    sourceNode.textContent = `${normalized.sourceName} • ${normalized.date}`;
  }

  if (titleNode) {
    titleNode.textContent = normalized.title;
  }

  if (copyNode) {
    copyNode.textContent = truncateCopy(normalized.lede, 150);
  }

  if (footerSource) {
    footerSource.textContent = `Fonte consultada: ${normalized.sourceName}`;
  }

  if (footerLink) {
    footerLink.href = href;
    applyArticleLinkAttrs(footerLink, href);
  }

  if (linkNode) {
    applyThumbImage(linkNode, normalized);
  }
};

const hydrateSocialCards = (items = []) => {
  const cards = [...document.querySelectorAll(".social-card")].filter(
    (card) => !card.classList.contains("wide")
  );
  if (!cards.length || !window.NEWS_MAP) {
    reserveSurfaceArticles("social", []);
    return;
  }

  const missingCards = [];
  const appliedArticles = [];
  const usedKeys = buildReservedArticleKeys(["social"]);

  cards.forEach((card) => {
    const linkNode = card.querySelector(".news-thumb");
    const slugFromHref = getSlugFromLink(linkNode);
    const article = slugFromHref ? window.NEWS_MAP?.[slugFromHref] : null;
    const articleKey = getArticleUsageKey(article);

    if (article && articleKey && !usedKeys.has(articleKey)) {
      usedKeys.add(articleKey);
      appliedArticles.push(article);
      if (linkNode) {
        applyThumbImage(linkNode, article);
      }
      return;
    }
    missingCards.push(card);
  });

  if (!missingCards.length) {
    return;
  }

  const fallbackArticles = pickSocialFallbackArticles(
    items,
    missingCards.length,
    usedKeys
  );

  missingCards.forEach((card, index) => {
    const article = fallbackArticles[index];
    if (!article) {
      return;
    }
    appliedArticles.push(article);
    applySocialCardFromArticle(card, article);
  });

  reserveSurfaceArticles("social", appliedArticles);
};

const hydrateStaticMediaSurfaces = () => {
  if (thumbNodes.length > 0 && window.NEWS_MAP) {
    thumbNodes.forEach((node) => {
      const slugFromHref = getSlugFromLink(node.closest("a") || node);
      const article = window.NEWS_MAP?.[slugFromHref];
      ensureMediaBadge(node, article?.media);
    });
  }

  if (window.NEWS_MAP) {
    hydrateStaticThumbs(window.NEWS_MAP);
    hydrateSocialCards(window.NEWS_DATA || []);
  }

};

const hydrateMosaicHero = (items = []) => {
  const hero = document.querySelector(".mosaic-hero");
  if (!hero) {
    reserveSurfaceArticles("hero", []);
    return;
  }

  const cards = [...hero.querySelectorAll(".mosaic-item")];
  if (cards.length === 0) {
    return;
  }

  const { leadArticles, referenceDateKey } = pickRadarLeadArticles(dedupeNewsItems(items));
  if (!leadArticles.length) {
    reserveSurfaceArticles("hero", []);
    return;
  }

  const editionNode = hero.querySelector(".mosaic-edition");
  if (editionNode && referenceDateKey) {
    editionNode.textContent = `Edicao visual • ${formatCompactDisplayDate(`${referenceDateKey}T12:00:00`)}`;
  }

  cards.forEach((card, index) => {
    const article = normalizeRuntimeArticle(leadArticles[index] || leadArticles[0]);
    const link = card.querySelector("a");
    const tag = card.querySelector(".mosaic-tag");
    const source = card.querySelector(".mosaic-source");
    const titleNode = card.querySelector("h1, h3");
    const copyNode = card.querySelector(".mosaic-copy p");
    const statNode = card.querySelector(".mosaic-stat");
    const actionNode = card.querySelector(".mosaic-action");
    const href = buildArticleHref(article);

    if (link) {
      link.href = href;
      applyArticleLinkAttrs(link, href);
    }

    card.dataset.category = normalizeText(article.category);
    [...card.classList]
      .filter((className) => className.startsWith("thumb-"))
      .forEach((className) => card.classList.remove(className));
    card.classList.add(article.previewClass);
    card.dataset.mosaicLayout = inferMosaicLayoutMode(article, card);

    if (tag) {
      tag.textContent = index === 0 ? "Destaque do radar" : truncateCopy(article.category, 22);
    }

    if (source) {
      source.textContent = formatMosaicSourceLabel(article);
    }

    if (titleNode) {
      titleNode.textContent = article.title;
    }

    if (copyNode) {
      copyNode.textContent = truncateCopy(article.lede, index === 0 ? 88 : 64);
    }

    if (statNode) {
      statNode.textContent =
        index === 0
          ? truncateCopy(article.summary || article.lede, 84)
          : truncateCopy(article.sourceLabel || article.title, 68);
    }

    if (actionNode) {
      actionNode.textContent = index === 0 ? "Abrir materia" : "Ler cobertura";
    }

    applyMosaicImage(card, article);
  });

  reserveSurfaceArticles("hero", leadArticles);
};

const buildArticleHref = (article) => {
  const normalizedArticle = normalizeRuntimeArticle(article);

  if (normalizedArticle.slug) {
    return `./noticia.html?slug=${encodeURIComponent(normalizedArticle.slug)}`;
  }

  return normalizedArticle.sourceUrl || "#";
};

const applyArticleLinkAttrs = (linkNode, href) => {
  if (!linkNode) {
    return;
  }

  linkNode.removeAttribute("target");
  linkNode.removeAttribute("rel");

  if (/^https?:\/\//i.test(href)) {
    linkNode.setAttribute("target", "_blank");
    linkNode.setAttribute("rel", "noreferrer");
  }
};

const initialMergedNews = syncNewsDataset(initialStaticNews);
hydrateMosaicHero(initialMergedNews);
hydrateStaticMediaSurfaces();
initializeHeroTourismHero();
attachArchiveBrowserLaunchers();
initializeInsidersArmy();
initializeInsidersBootScreen();
initializeInsidersHeroScene();

const articleCardSelector = [".news-card", ".archive-card", ".mosaic-item"].join(", ");
const cardInteractiveSelector = "a, button, input, select, textarea, label, summary";

const getPrimaryCardLink = (card) =>
  card?.querySelector?.('a[href*="noticia.html?slug="], a[href]') || null;

const bindArticleCardLink = (card) => {
  if (!card || card.dataset.cardLinkBound === "true") {
    return;
  }

  const primaryLink = getPrimaryCardLink(card);
  if (!primaryLink) {
    return;
  }

  card.dataset.cardLinkBound = "true";
  card.classList.add("is-card-link");
  card.addEventListener("click", (event) => {
    if (event.defaultPrevented || event.target.closest(cardInteractiveSelector)) {
      return;
    }

    const href = primaryLink.getAttribute("href") || "";
    const match = href.match(/[?&]slug=([^&#]+)/i);
    const slugFromHref = match ? decodeURIComponent(match[1]) : "";
    const article = slugFromHref ? window.NEWS_MAP?.[slugFromHref] : null;

    if (article) {
      persistOfflineArticle(article);
    }

    primaryLink.click();
  });
};

const registerArticleCardLinks = (root = document) => {
  if (!root) {
    return;
  }

  const cards = [];

  if (root.matches?.(articleCardSelector)) {
    cards.push(root);
  }

  const nestedCards = root.querySelectorAll
    ? [...root.querySelectorAll(articleCardSelector)]
    : [];

  cards.push(...nestedCards);
  cards.forEach(bindArticleCardLink);
};

registerArticleCardLinks();

document.addEventListener("click", (event) => {
  const link = event.target instanceof Element ? event.target.closest('a[href*="noticia.html?slug="]') : null;
  if (!link) {
    return;
  }

  const href = link.getAttribute("href") || "";
  const match = href.match(/[?&]slug=([^&#]+)/i);
  const slugFromHref = match ? decodeURIComponent(match[1]) : "";
  const article = slugFromHref ? window.NEWS_MAP?.[slugFromHref] : null;

  if (article) {
    persistOfflineArticle(article);
  }
});

// --- Elections: poll by office with one vote per browser/office ---
if (window.ELECTIONS_DATA?.offices?.length) {
  const electionGrid = document.querySelector(".elections-grid");
  const electionFilters = [...document.querySelectorAll(".election-filter[data-office]")];
  const electionResultsTitle = document.querySelector("#election-results-title");
  const electionResultsMeta = document.querySelector("#election-results-meta");
  const electionResultsBars = document.querySelector("#election-results-bars");
  const electionHeatTitle = document.querySelector("#election-heat-title");
  const electionHeatMeta = document.querySelector("#election-heat-meta");
  const electionHeatGrid = document.querySelector("#election-heat-grid");
  const electionDisclaimer = document.querySelector("#election-disclaimer");
  const electionVotesKey = "catalogo_election_votes_by_office_v1";
  const electionUserVotesKey = "catalogo_election_user_votes_v1";
  const electionOpinionSummaryKey = "catalogo_election_opinion_summary_v1";
  const electionVoterIdKey = "catalogo_election_voter_id_v1";
  const electionVoterProfileKey = "catalogo_election_voter_profile_v1";
  const electionCycle = String(window.ELECTIONS_DATA.cycle || "").toLowerCase();
  const generalElectionOfficeIds = new Set([
    "governador",
    "senador",
    "deputado-federal",
    "deputado-estadual"
  ]);
  const electionOffices = window.ELECTIONS_DATA.offices.filter((office) => {
    const officeId = String(office?.id || "").trim();

    if (!officeId) {
      return false;
    }

    if (electionCycle === "geral") {
      return generalElectionOfficeIds.has(officeId);
    }

    if (electionCycle === "municipal") {
      return officeId === "municipal";
    }

    return true;
  });
  const availableElectionOfficeIds = new Set(electionOffices.map((office) => office.id));
  let remoteElectionVotes = null;
  let remoteElectionUserVotes = null;
  let remoteElectionOpinionSummary = null;
  let electionVoteModal = document.querySelector("#electionVoteModal");
  let electionVoteModalState = null;

  electionFilters.forEach((button) => {
    const officeId = String(button.dataset.office || "").trim();
    const isAvailable = availableElectionOfficeIds.has(officeId);

    button.hidden = !isAvailable;
    button.disabled = !isAvailable;
    button.setAttribute("aria-hidden", isAvailable ? "false" : "true");

    if (!isAvailable) {
      button.classList.remove("is-active");
    }
  });

  let activeElectionOfficeId =
    electionFilters.find(
      (button) =>
        button.classList.contains("is-active") &&
        availableElectionOfficeIds.has(String(button.dataset.office || "").trim())
    )?.dataset.office || electionOffices[0]?.id;

  if (!electionOffices.length || !activeElectionOfficeId) {
    if (electionGrid) {
      electionGrid.innerHTML =
        '<div class="feed-empty">Ainda não há cargos disponíveis para o ciclo eleitoral atual.</div>';
    }
  } else {

  const safeParseJson = (key, fallback) => {
    try {
      return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
    } catch (_error) {
      return fallback;
    }
  };

  const writeElectionStorage = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (_error) {
      // Se o navegador bloquear localStorage, a enquete continua visual.
    }
  };

  const getElectionVoterProfile = () =>
    safeParseJson(electionVoterProfileKey, {
      city: "",
      name: "",
      party: ""
    });

  const writeElectionVoterProfile = (profile = {}) => {
    writeElectionStorage(electionVoterProfileKey, {
      city: String(profile.city || "").trim().slice(0, 80),
      name: String(profile.name || "").trim().slice(0, 120),
      party: String(profile.party || "").trim().slice(0, 90)
    });
  };

  const getElectionVoterId = () => {
    try {
      const stored = localStorage.getItem(electionVoterIdKey);
      if (stored) {
        return stored;
      }

      const nextId =
        typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : `voter-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      localStorage.setItem(electionVoterIdKey, nextId);
      return nextId;
    } catch (_error) {
      return `session-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    }
  };

  const getElectionOffice = (officeId = activeElectionOfficeId) =>
    electionOffices.find((office) => office.id === officeId) || electionOffices[0];

  const getElectionVotes = () => remoteElectionVotes || safeParseJson(electionVotesKey, {});

  const getElectionUserVotes = () =>
    remoteElectionUserVotes || safeParseJson(electionUserVotesKey, {});

  const getElectionOpinionSummary = () =>
    remoteElectionOpinionSummary || safeParseJson(electionOpinionSummaryKey, {});

  const getOfficeVotes = (officeId) => {
    const votes = getElectionVotes();
    return votes[officeId] || {};
  };

  const getUserOfficeVote = (officeId) => getElectionUserVotes()[officeId] || "";

  const getElectionOpinionOffice = (officeId) => getElectionOpinionSummary()[officeId] || null;

  const getElectionMoodClass = (label = "") => {
    const normalized = String(label || "").toLowerCase();
    if (normalized.includes("favor")) return "is-hot";
    if (normalized.includes("press")) return "is-cold";
    return "is-neutral";
  };

  const getElectionHeatBarWidth = (value, total) => {
    if (!value) {
      return 0;
    }

    if (!total) {
      return value > 0 ? 8 : 0;
    }

    return Math.max(6, Math.min(100, Math.round((value / total) * 100)));
  };

  const renderElectionHeat = (office) => {
    if (!electionHeatGrid || !office) {
      return;
    }

    const summary = getElectionOpinionOffice(office.id);
    const candidates = Array.isArray(summary?.candidates) ? summary.candidates.slice(0, 4) : [];
    const totalSignals = Number(summary?.totalComments || 0);

    if (electionHeatTitle) {
      electionHeatTitle.textContent = `Calor eleitoral para ${office.label}`;
    }

    if (electionHeatMeta) {
      electionHeatMeta.textContent = totalSignals
        ? `${totalSignals} observacao(oes) com leitura de humor e reeleicao percebida nesta faixa.`
        : "As observacoes enviadas junto com o voto alimentam um termometro de favor, pressao ou neutralidade.";
    }

    if (!candidates.length) {
      electionHeatGrid.innerHTML = `
        <article class="election-heat-card is-empty">
          <strong>Sem sinais suficientes ainda.</strong>
          <p>Os proximos votos com observacoes vao mostrar aqui o clima local de cada nome.</p>
        </article>
      `;
      return;
    }

    electionHeatGrid.innerHTML = candidates
      .map((item) => {
        const positiveCount = Number(item.positiveCount || 0);
        const neutralCount = Number(item.neutralCount || 0);
        const negativeCount = Number(item.negativeCount || 0);
        const commentCount = Number(item.commentCount || 0);
        const totalCount = Math.max(commentCount, positiveCount + neutralCount + negativeCount);
        const moodLabel = item.moodLabel || "equilibrado";

        return `
          <article class="election-heat-card">
            <div class="election-heat-card-header">
              <strong>${escapeHtml(item.candidateName || "Nome em leitura")}</strong>
              <span>${escapeHtml(item.candidateParty || office.label || "cargo")} • ${Number(item.totalVotes || 0)} voto(s)</span>
            </div>
            <span class="election-heat-mood ${getElectionMoodClass(moodLabel)}">${escapeHtml(moodLabel)}</span>
            <div class="election-heat-bars">
              <div class="election-heat-stat">
                <div class="election-heat-stat-row">
                  <span>positivo</span>
                  <strong>${positiveCount}</strong>
                </div>
                <div class="election-heat-bar"><span class="is-positive" style="width:${getElectionHeatBarWidth(positiveCount, totalCount)}%"></span></div>
              </div>
              <div class="election-heat-stat">
                <div class="election-heat-stat-row">
                  <span>neutro</span>
                  <strong>${neutralCount}</strong>
                </div>
                <div class="election-heat-bar"><span class="is-neutral" style="width:${getElectionHeatBarWidth(neutralCount, totalCount)}%"></span></div>
              </div>
              <div class="election-heat-stat">
                <div class="election-heat-stat-row">
                  <span>negativo</span>
                  <strong>${negativeCount}</strong>
                </div>
                <div class="election-heat-bar"><span class="is-negative" style="width:${getElectionHeatBarWidth(negativeCount, totalCount)}%"></span></div>
              </div>
            </div>
            <p class="election-heat-card-meta">
              ${commentCount ? `${commentCount} comentario(s) local(is)` : "Ainda sem comentario qualitativo"}${item.topCity ? ` • cidade mais citada: ${escapeHtml(item.topCity)}` : ""}.
            </p>
          </article>
        `;
      })
      .join("");
  };

  const ensureElectionVoteModal = () => {
    if (electionVoteModal) {
      if (electionVoteModal.dataset.voteModalBound === "1") {
        return electionVoteModal;
      }
    } else {
      electionVoteModal = document.querySelector("#electionVoteModal");
    }

    if (!electionVoteModal) {
      const modal = document.createElement("section");
      modal.id = "electionVoteModal";
      modal.className = "election-vote-modal";
      modal.hidden = true;
      modal.innerHTML = `
        <div class="election-vote-modal-backdrop" data-election-vote-close></div>
        <article class="election-vote-dialog" role="dialog" aria-modal="true" aria-labelledby="electionVoteTitle">
          <button class="election-vote-close" type="button" aria-label="Fechar coleta de voto" data-election-vote-close>&times;</button>
          <p class="panel-label">Pesquisa local com contexto</p>
          <h3 id="electionVoteTitle">Registrar voto com cidade</h3>
          <p class="election-vote-lead" data-election-vote-lead>
            Informe sua cidade. Nome, partido e observacao sao opcionais.
          </p>
          <form class="election-vote-form" novalidate>
            <div class="election-vote-form-grid">
              <label class="election-vote-field">
                <span>Cidade</span>
                <input type="text" name="city" maxlength="80" autocomplete="address-level2" required />
              </label>
              <label class="election-vote-field">
                <span>Seu nome (opcional)</span>
                <input type="text" name="voterName" maxlength="120" autocomplete="name" />
              </label>
              <label class="election-vote-field">
                <span>Partido ou apoio (opcional)</span>
                <input type="text" name="voterParty" maxlength="90" autocomplete="organization-title" />
              </label>
            </div>
            <label class="election-vote-field full">
              <span>Observacoes sobre o candidato</span>
              <textarea name="comment" maxlength="420"></textarea>
            </label>
            <p class="election-vote-feedback" data-election-vote-feedback aria-live="polite"></p>
            <div class="election-vote-actions">
              <button class="outline-button" type="button" data-election-vote-close>Cancelar</button>
              <button class="solid-button" type="submit" data-election-vote-submit>Confirmar voto</button>
            </div>
          </form>
        </article>
      `;
      document.body.appendChild(modal);
      electionVoteModal = modal;
    }

    const modal = electionVoteModal;
    const closeModal = ({ reset = false } = {}) => {
      modal.hidden = true;
      document.body.classList.remove("election-vote-open");
      if (reset) {
        modal.querySelector(".election-vote-form")?.reset();
        setFeedbackState(
          modal.querySelector("[data-election-vote-feedback], #electionVoteFeedback"),
          "",
          ""
        );
      }
      electionVoteModalState = null;
    };

    modal.__closeElectionVote = closeModal;

    if (modal.dataset.voteModalBound === "1") {
      return modal;
    }

    modal.dataset.voteModalBound = "1";

    modal.addEventListener("click", (event) => {
      if (
        event.target === modal ||
        event.target?.matches?.(".election-vote-modal-backdrop, [data-election-vote-close], [data-close-election-vote]")
      ) {
        closeModal();
      }
    });

    modal.querySelectorAll("[data-close-election-vote], [data-election-vote-close]").forEach((button) => {
      button.addEventListener("click", () => closeModal());
    });

    modal.querySelector(".election-vote-form")?.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!electionVoteModalState) {
        return;
      }

      const form = event.currentTarget;
      const cityInput = form.elements.city || form.querySelector("[name='city']");
      const nameInput = form.elements.voterName || form.elements.name || form.querySelector("[name='voterName'], [name='name']");
      const partyInput = form.elements.voterParty || form.elements.party || form.querySelector("[name='voterParty'], [name='party']");
      const commentInput = form.elements.comment || form.elements.observation || form.querySelector("[name='comment'], [name='observation']");
      const city = String(cityInput?.value || "").trim();
      const name = String(nameInput?.value || "").trim();
      const party = String(partyInput?.value || "").trim();
      const observation = String(commentInput?.value || "").trim();
      const feedback = modal.querySelector("[data-election-vote-feedback], #electionVoteFeedback");
      const submitButton = modal.querySelector("[data-election-vote-submit], #electionVoteSubmitButton");

      if (!city) {
        setFeedbackState(feedback, "Informe a cidade para registrar o voto.", "is-error");
        cityInput?.focus();
        return;
      }

      submitButton.disabled = true;
      submitButton.textContent = "Registrando...";
      setFeedbackState(feedback, "", "");

      try {
        await submitElectionVote(electionVoteModalState.officeId, electionVoteModalState.candidateId, {
          city,
          name,
          party,
          observation
        });
        writeElectionVoterProfile({ city, name, party });
        try {
          localStorage.setItem("catalogo_user_city", city);
          localStorage.setItem("catalogo_user_country", "Brasil");
        } catch (_error) {
          // segue sem bloquear o voto
        }
        closeModal({ reset: true });
      } catch (error) {
        setFeedbackState(
          feedback,
          String(error?.message || "Nao foi possivel registrar o voto agora."),
          "is-error"
        );
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = "Confirmar voto";
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !modal.hidden) {
        closeModal();
      }
    });

    return modal;
  };

  const openElectionVoteModal = (officeId, candidateId) => {
    const office = getElectionOffice(officeId);
    const candidate = office?.candidates?.find((item) => item.id === candidateId);
    if (!office || !candidate) {
      return;
    }

    const modal = ensureElectionVoteModal();
    const form = modal.querySelector(".election-vote-form");
    const profile = getElectionVoterProfile();

    electionVoteModalState = {
      officeId,
      candidateId
    };

    modal.querySelector("#electionVoteTitle").textContent = `Votar em ${candidate.name}`;
    modal.querySelector("[data-election-vote-lead], #electionVoteLead").textContent =
      `Seu voto para ${office.label} pede cidade obrigatoria. Nome, partido e observacoes sao opcionais e ajudam a montar o calor eleitoral interno.`;

    if (form) {
      const cityInput = form.elements.city || form.querySelector("[name='city']");
      const nameInput = form.elements.voterName || form.elements.name || form.querySelector("[name='voterName'], [name='name']");
      const partyInput = form.elements.voterParty || form.elements.party || form.querySelector("[name='voterParty'], [name='party']");
      const commentInput = form.elements.comment || form.elements.observation || form.querySelector("[name='comment'], [name='observation']");

      if (cityInput) cityInput.value = profile.city || "";
      if (nameInput) nameInput.value = profile.name || "";
      if (partyInput) partyInput.value = profile.party || "";
      if (commentInput) commentInput.value = "";
    }

    setFeedbackState(modal.querySelector("[data-election-vote-feedback], #electionVoteFeedback"), "", "");
    modal.hidden = false;
    document.body.classList.add("election-vote-open");
    window.setTimeout(() => {
      const cityInput = form?.elements?.city || form?.querySelector?.("[name='city']");
      cityInput?.focus();
      cityInput?.select?.();
    }, 20);
  };

  window.openElectionVoteModal = openElectionVoteModal;

  const hydrateElectionVotes = async () => {
    try {
      const voterId = getElectionVoterId();
      const payload = await requestApiJson(
        `/api/elections/votes?voterId=${encodeURIComponent(voterId)}`,
        { method: "GET" }
      );
      remoteElectionVotes = payload.votes || {};
      remoteElectionUserVotes = payload.userVotes || {};
      remoteElectionOpinionSummary = payload.opinionSummary || {};
      writeElectionStorage(electionVotesKey, remoteElectionVotes);
      writeElectionStorage(electionUserVotesKey, remoteElectionUserVotes);
      writeElectionStorage(electionOpinionSummaryKey, remoteElectionOpinionSummary);
      renderElectionOffice(activeElectionOfficeId);
    } catch (_error) {
      // Mantem a votação local se o backend não estiver disponível.
    }
  };

  const submitElectionVote = async (officeId, candidateId, voterMeta = {}) => {
    const userVotes = getElectionUserVotes();
    const city = String(voterMeta.city || "").trim();

    if (userVotes[officeId]) {
      renderElectionOffice(officeId);
      return;
    }

    if (!city) {
      throw new Error("Informe a cidade para registrar o voto.");
    }

    try {
      const payload = await requestApiJson("/api/elections/votes", {
        method: "POST",
        body: JSON.stringify({
          officeId,
          candidateId,
          voterId: getElectionVoterId(),
          city,
          name: String(voterMeta.name || "").trim(),
          party: String(voterMeta.party || "").trim(),
          observation: String(voterMeta.observation || "").trim()
        })
      });
      remoteElectionVotes = payload.votes || {};
      remoteElectionUserVotes = payload.userVotes || {};
      remoteElectionOpinionSummary = payload.opinionSummary || {};
      writeElectionStorage(electionVotesKey, remoteElectionVotes);
      writeElectionStorage(electionUserVotesKey, remoteElectionUserVotes);
      writeElectionStorage(electionOpinionSummaryKey, remoteElectionOpinionSummary);
      window.dispatchEvent(
        new CustomEvent("catalogo:election-vote-updated", {
          detail: { officeId, candidateId }
        })
      );
      renderElectionOffice(officeId);
      return;
    } catch (error) {
      throw new Error(
        String(
          error?.message ||
            "O backend de coleta nao respondeu agora. O voto nao foi salvo, entao vale tentar novamente."
        )
      );
    }
  };

  const getCandidateInitials = (name = "") =>
    String(name)
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "?";

  const candidatePhotoResolveCache = new Map();

  const resolveCandidatePhoto = async (candidate = {}) => {
    const directCandidates = [];
    [candidate.imageUrl, candidate.photoUrl, candidate.avatarUrl].forEach((value) => {
      buildImageLoadCandidates(value).forEach((imageCandidate) =>
        pushUniqueImageCandidate(directCandidates, imageCandidate)
      );
    });

    if (directCandidates.length) {
      const directPhoto = await preloadFirstAvailableImage(directCandidates);
      if (directPhoto) {
        return directPhoto;
      }
    }

    const sourceUrl = String(candidate.sourceUrl || candidate.imageSourceUrl || "").trim();
    if (!sourceUrl || sourceUrl === "#") {
      return "";
    }

    if (!candidatePhotoResolveCache.has(sourceUrl)) {
      candidatePhotoResolveCache.set(
        sourceUrl,
        requestApiJson(`/api/preview-image?url=${encodeURIComponent(sourceUrl)}`, {
          method: "GET"
        })
          .then((payload) =>
            preloadFirstAvailableImage(buildImageLoadCandidates(payload?.imageUrl || ""))
          )
          .catch(() => "")
      );
    }

    return candidatePhotoResolveCache.get(sourceUrl) || "";
  };

  const applyCandidatePhoto = (avatarNode, candidate = {}) => {
    if (!avatarNode) {
      return;
    }

    resolveCandidatePhoto(candidate).then((photoUrl) => {
      if (!photoUrl) {
        return;
      }

      avatarNode.style.setProperty("--candidate-photo", `url('${photoUrl}')`);
      avatarNode.classList.add("has-photo");
    });
  };

  const buildCandidatePortalUrl = (officeId, candidateId) =>
    `./candidato.html?office=${encodeURIComponent(officeId)}&candidate=${encodeURIComponent(candidateId)}`;

  const buildCandidateCard = (office, candidate) => {
    const card = document.createElement("article");
    const votedCandidateId = getUserOfficeVote(office.id);
    const hasVoteInOffice = Boolean(votedCandidateId);
    const isSelected = votedCandidateId === candidate.id;
    const initial = getCandidateInitials(candidate.name);
    const summary =
      candidate.historySummary ||
      candidate.summary ||
      "Nome monitorado na cobertura politica do Catalogo CZS.";
    const currentPosition = String(candidate.currentPosition || "").trim();
    const politicalPosition = String(
      candidate.politicalPositionShort || candidate.politicalPosition || ""
    ).trim();
    const scoreTotal = Number(candidate.score?.total || 0);
    const highlights = Array.isArray(candidate.achievements) && candidate.achievements.length
      ? candidate.achievements.slice(0, 3)
      : Array.isArray(candidate.proposals) && candidate.proposals.length
        ? candidate.proposals.slice(0, 3)
        : ["Perfil em atualização"];

    card.className = "candidate-card news-card reveal active";
    card.dataset.office = office.id;
    card.dataset.candidate = candidate.id;

    card.innerHTML = `
      <header class="candidate-header">
        <div class="candidate-avatar">${initial}</div>
        <div>
          <span class="candidate-office">${office.badge || office.label}</span>
          <h3>${candidate.name}</h3>
          <p class="candidate-party">${candidate.party || "partido em atualização"} • ${candidate.role || office.label}</p>
        </div>
      </header>
      <p class="candidate-summary">${escapeHtml(summary)}</p>
      ${currentPosition ? `<p class="candidate-status">${escapeHtml(currentPosition)}</p>` : ""}
      <div class="candidate-meta-chips">
        ${politicalPosition ? `<span>${escapeHtml(politicalPosition)}</span>` : ""}
        ${scoreTotal ? `<span>Pontuação editorial ${escapeHtml(String(scoreTotal))}</span>` : ""}
      </div>
      <div class="candidate-propostas">
        <h4>Realizações e focos</h4>
        <ul>
          ${highlights.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
        </ul>
      </div>
      <footer class="candidate-vote-footer">
        <a class="candidate-portal-link" href="${buildCandidatePortalUrl(office.id, candidate.id)}">
          Ver histórico e pontuação
        </a>
        <button
          class="chip-button vote-button${isSelected ? " voted" : ""}"
          type="button"
          data-office="${office.id}"
          data-candidate="${candidate.id}"
          ${hasVoteInOffice ? "disabled" : ""}
        >
          ${isSelected ? "Voto registrado" : hasVoteInOffice ? "Voto já usado neste cargo" : "Votar com cidade"}
        </button>
      </footer>
    `;

    applyCandidatePhoto(card.querySelector(".candidate-avatar"), candidate);

    return card;
  };

  const renderElectionResults = (office) => {
    if (!electionResultsBars) {
      return;
    }

    const officeVotes = getOfficeVotes(office.id);
    const totalVotes = (office.candidates || []).reduce(
      (sum, candidate) => sum + Number(officeVotes[candidate.id] || 0),
      0
    );
    const selectedCandidateId = getUserOfficeVote(office.id);

    if (electionResultsTitle) {
      electionResultsTitle.textContent = `Preferência para ${office.label}`;
    }

    if (electionResultsMeta) {
      electionResultsMeta.textContent = selectedCandidateId
        ? `Seu voto neste cargo ja foi registrado. Total atual: ${totalVotes} voto${totalVotes === 1 ? "" : "s"}. Cidade foi coletada e as observacoes ajudam a ler o clima eleitoral.`
        : `Escolha uma opcao para ${office.label}. A cidade e obrigatoria; nome, partido e observacao continuam opcionais.`;
    }

    electionResultsBars.innerHTML = "";

    (office.candidates || []).forEach((candidate) => {
      const votes = Number(officeVotes[candidate.id] || 0);
      const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
      const item = document.createElement("div");
      item.className = `result-item${selectedCandidateId === candidate.id ? " is-user-choice" : ""}`;
      item.innerHTML = `
        <span>${candidate.name} (${candidate.party || "partido em atualização"})</span>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${Math.max(percentage, votes > 0 ? 3 : 0)}%"></div>
        </div>
        <strong>${percentage}% <small>${votes} voto${votes === 1 ? "" : "s"}</small></strong>
      `;
      electionResultsBars.appendChild(item);
    });

    if (electionDisclaimer) {
      electionDisclaimer.innerHTML = `<strong>Aviso:</strong> Esta e uma enquete informal de leitores, sem amostragem cientifica e sem valor de pesquisa registrada. A cidade e obrigatoria no voto, e as observacoes alimentam um calor eleitoral interno com sinais positivos, negativos e de reeleicao. ${escapeHtml(window.ELECTIONS_DATA.sourceNote || "")}`;
    }

    renderElectionHeat(office);
  };

  const renderElectionOffice = (officeId = activeElectionOfficeId) => {
    const office = getElectionOffice(officeId);

    if (!electionGrid || !office) {
      return;
    }

    activeElectionOfficeId = office.id;
    electionFilters.forEach((button) => {
      button.classList.toggle("is-active", button.dataset.office === office.id);
    });

    electionGrid.innerHTML = "";

    if (!office.candidates?.length) {
      const empty = document.createElement("div");
      empty.className = "feed-empty";
      empty.textContent = "Ainda não há nomes cadastrados para este cargo.";
      electionGrid.appendChild(empty);
      renderElectionResults({ ...office, candidates: [] });
      return;
    }

    office.candidates.forEach((candidate) => {
      electionGrid.appendChild(buildCandidateCard(office, candidate));
    });

    renderElectionResults(office);
    registerInteractivePanels(electionGrid);
  };

  electionFilters.forEach((button) => {
    button.addEventListener("click", () => {
      renderElectionOffice(button.dataset.office);
    });
  });

  electionGrid?.addEventListener("click", (event) => {
    const button = event.target instanceof Element ? event.target.closest(".vote-button[data-office][data-candidate]") : null;
    if (!button || button.disabled) {
      return;
    }

    const officeId = button.dataset.office;
    const candidateId = button.dataset.candidate;
    openElectionVoteModal(officeId, candidateId);
  });

  window.addEventListener("storage", (event) => {
    if (event.key === electionVotesKey || event.key === electionUserVotesKey) {
      renderElectionOffice(activeElectionOfficeId);
    }
  });

  renderElectionOffice(activeElectionOfficeId);
  hydrateElectionVotes();
  }
}

const buildAgentWhatsappUrl = ({ name = "", email = "", subject = "", message = "" }) => {
  const lines = ["Olá, segue uma mensagem enviada pelo Catalogo Cruzeiro do Sul.", ""];

  if (name) {
    lines.push(`Nome: ${name}`);
  }

  if (email) {
    lines.push(`E-mail: ${email}`);
  }

  lines.push("", message, "", "Enviado pelo formulario Fale com a equipe.");

  if (subject) {
    lines.splice(1, 0, `Assunto: ${subject}`);
  }

  return `https://wa.me/${portalWhatsappNumber}?text=${encodeURIComponent(lines.join("\n"))}`;
};

const openAgentMailModal = (prefillMessage = "") => {
  if (!agentMailModal) {
    return;
  }

  agentMailModal.hidden = false;
  document.body.classList.add("agent-mail-open");

  if (prefillMessage && agentMailMessageInput && !agentMailMessageInput.value.trim()) {
    agentMailMessageInput.value = prefillMessage;
  }

  setFeedbackState(agentMailFeedback, "", "");
  window.setTimeout(() => {
    agentMailMessageInput?.focus();
  }, 20);
};

const closeAgentMailModal = ({ reset = false } = {}) => {
  if (!agentMailModal) {
    return;
  }

  agentMailModal.hidden = true;
  document.body.classList.remove("agent-mail-open");

  if (reset) {
    agentMailForm?.reset();
    setFeedbackState(agentMailFeedback, "", "");
  }
};

const attachAgentMailFlow = () => {
  if (!agentMailModal || !agentMailForm || !agentMailMessageInput) {
    return;
  }

  document.querySelectorAll("[data-open-agent-mail]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      const shouldUseFooterDraft = button === footerChatSend;
      const prefillMessage = shouldUseFooterDraft ? String(footerChatInput?.value || "").trim() : "";
      openAgentMailModal(prefillMessage);
    });
  });

  document.querySelectorAll("[data-close-agent-mail]").forEach((button) => {
    button.addEventListener("click", () => closeAgentMailModal());
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !agentMailModal.hidden) {
      closeAgentMailModal();
    }
  });

  agentMailForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = String(agentMailNameInput?.value || "").trim();
    const email = String(agentMailEmailInput?.value || "").trim();
    const subject =
      String(agentMailSubjectInput?.value || "").trim() || "Contato pelo Catalogo Cruzeiro do Sul";
    const message = String(agentMailMessageInput?.value || "").trim();

    if (message.length < 5) {
      setFeedbackState(agentMailFeedback, "Escreva uma mensagem com pelo menos 5 caracteres.", "is-error");
      agentMailMessageInput.focus();
      return;
    }

    setFeedbackState(agentMailFeedback, "Preparando a mensagem no WhatsApp...", "");

    try {
      await requestApiJson("/api/agent-messages", {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
          recipient: `WhatsApp ${portalWhatsappNumber}`
        })
      });
    } catch (_error) {
      // Mesmo sem backend, o WhatsApp continua como caminho principal.
    }

    window.location.href = buildAgentWhatsappUrl({ name, email, subject, message });
    setFeedbackState(
      agentMailFeedback,
      "Mensagem pronta no WhatsApp. Confirme o envio para 68 99226-9296.",
      "is-success"
    );
  });
};

const buildFeedCard = (article) => {
  const normalizedArticle = normalizeRuntimeArticle(article);
  const card = document.createElement("article");
  const thumb = document.createElement("a");
  const chip = document.createElement("span");
  const source = document.createElement("span");
  const title = document.createElement("h3");
  const summary = document.createElement("p");
  const footer = document.createElement("footer");
  const category = document.createElement("span");
  const link = document.createElement("a");

  card.className = "news-card generated-feed-card reveal active";
  card.dataset.category = normalizeText(normalizedArticle.category);

  const href = buildArticleHref(normalizedArticle);

  thumb.className = `news-thumb ${normalizedArticle.previewClass}`;
  thumb.href = href;
  thumb.setAttribute("aria-label", `Abrir noticia ${normalizedArticle.title}`);
  thumb.dataset.topic = normalizedArticle.category;
  applyThumbImage(thumb, normalizedArticle);
  applyArticleLinkAttrs(thumb, href);

  chip.textContent = normalizedArticle.category;
  thumb.append(chip);

  source.className = "news-source";
  source.textContent = `${normalizedArticle.sourceName} • ${normalizedArticle.date}`;

  title.textContent = normalizedArticle.title;
  summary.textContent = normalizedArticle.lede;

  category.textContent = `Fonte consultada: ${normalizedArticle.sourceName}`;
  link.href = href;
  link.textContent = "ler análise";
  applyArticleLinkAttrs(link, href);

  footer.append(category, link);
  card.append(thumb, source, title, summary, footer);

  return card;
};

const getSortedLiveFeedArticles = (items = []) =>
  [...items].sort((left, right) => {
    const rightDate = Date.parse(right.publishedAt || "") || parseArticleDate(right.date);
    const leftDate = Date.parse(left.publishedAt || "") || parseArticleDate(left.date);

    if (rightDate !== leftDate) {
      return rightDate - leftDate;
    }

    return String(left.title || "").localeCompare(String(right.title || ""), "pt-BR");
  });

const getLiveFeedSearchTerms = (query = "") =>
  [...new Set(normalizeText(query).split(/\s+/).filter(Boolean))];

const getLiveFeedQueryScore = (article, query = "") => {
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) {
    return 0;
  }

  const normalizedArticle = normalizeRuntimeArticle(article);
  const title = normalizeText(normalizedArticle.title);
  const lede = normalizeText(normalizedArticle.lede);
  const category = normalizeText(normalizedArticle.category);
  const sourceName = normalizeText(normalizedArticle.sourceName);
  const sourceLabel = normalizeText(normalizedArticle.sourceLabel);
  const haystack = normalizeText([title, lede, category, sourceName, sourceLabel].join(" "));
  const terms = getLiveFeedSearchTerms(normalizedQuery);

  let score = 0;
  let matchedTerms = 0;

  if (title === normalizedQuery) score += 260;
  if (title.includes(normalizedQuery)) score += 140;
  if (sourceLabel.includes(normalizedQuery)) score += 84;
  if (category === normalizedQuery) score += 72;
  if (category.includes(normalizedQuery)) score += 34;
  if (sourceName.includes(normalizedQuery)) score += 28;
  if (lede.includes(normalizedQuery)) score += 40;
  if (haystack.includes(normalizedQuery)) score += 18;

  terms.forEach((term) => {
    let matched = false;

    if (title.includes(term)) {
      score += 42;
      matched = true;
    }

    if (sourceLabel.includes(term)) {
      score += 22;
      matched = true;
    }

    if (category.includes(term)) {
      score += 18;
      matched = true;
    }

    if (sourceName.includes(term)) {
      score += 14;
      matched = true;
    }

    if (lede.includes(term)) {
      score += 12;
      matched = true;
    }

    if (matched || haystack.includes(term)) {
      matchedTerms += 1;
    }
  });

  if (matchedTerms === terms.length && terms.length > 1) {
    score += 56;
  } else if (matchedTerms > 0) {
    score += matchedTerms * 8;
  }

  return score;
};

const getLiveFeedFilterOptions = (items = []) => {
  const categoryMap = new Map();

  items.forEach((article) => {
    const normalizedArticle = normalizeRuntimeArticle(article);
    const key = normalizedArticle.categoryKey || normalizeText(normalizedArticle.category);

    if (!key) {
      return;
    }

    const current = categoryMap.get(key) || {
      key,
      label: normalizedArticle.category,
      count: 0
    };

    current.count += 1;
    categoryMap.set(key, current);
  });

  const sortedCategories = [...categoryMap.values()]
    .sort((left, right) => right.count - left.count || left.label.localeCompare(right.label, "pt-BR"))
    .slice(0, 7);

  return [
    {
      key: "",
      label: "Tudo",
      count: items.length
    },
    ...sortedCategories
  ];
};

const getLiveFeedActiveFilterLabel = () => {
  if (!liveFeedState.activeCategory) {
    return "";
  }

  return (
    getLiveFeedFilterOptions(liveFeedState.items).find(
      (option) => option.key === liveFeedState.activeCategory
    )?.label ||
    radarGuideThemes[liveFeedState.activeCategory]?.label ||
    liveFeedState.activeCategory
  );
};

const getLiveFeedDominantCategory = (items = []) =>
  getLiveFeedFilterOptions(items).find((option) => option.key)?.label || "Arquivo geral";

const getLiveFeedLatestDate = (items = []) => {
  const latestArticle = getSortedLiveFeedArticles(items)[0];
  return latestArticle ? normalizeRuntimeArticle(latestArticle).date : "--";
};

const getLiveFeedSourceCount = (items = []) =>
  new Set(items.map((article) => normalizeRuntimeArticle(article).sourceName).filter(Boolean)).size;

const renderLiveFeedFilters = () => {
  if (!liveFeedFilters) {
    return;
  }

  const filterOptions = getLiveFeedFilterOptions(liveFeedState.items);
  liveFeedFilters.innerHTML = "";

  filterOptions.forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `feed-filter-chip${option.key === liveFeedState.activeCategory ? " is-active" : ""}`;
    button.dataset.category = option.key;
    button.textContent = option.label;
    button.setAttribute("aria-label", `${option.label}: ${option.count} pauta${option.count === 1 ? "" : "s"}`);
    button.addEventListener("click", () => {
      if (liveFeedState.activeCategory === option.key) {
        return;
      }

      liveFeedState.activeCategory = option.key;
      liveFeedState.visibleItems = liveFeedState.pageSize;
      renderLiveFeedFilters();
      renderLiveFeed();
    });
    liveFeedFilters.appendChild(button);
  });
};

const getFilteredLiveFeedArticles = () => {
  const query = String(liveFeedQuery?.value || "").trim();
  const normalizedQuery = normalizeText(query);
  const sortedArticles = getSortedLiveFeedArticles(liveFeedState.items);
  const categoryFiltered = sortedArticles
    .map((article) => normalizeRuntimeArticle(article))
    .filter((article) => {
      if (
        liveFeedState.activeCategory &&
        !articleMatchesCategoryFilter(article, liveFeedState.activeCategory)
      ) {
        return false;
      }

      return true;
    });

  if (!normalizedQuery) {
    return categoryFiltered;
  }

  return categoryFiltered
    .map((article) => ({
      article,
      score: getLiveFeedQueryScore(article, normalizedQuery)
    }))
    .filter((entry) => entry.score > 0)
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      const rightDate = Date.parse(right.article.publishedAt || "") || parseArticleDate(right.article.date);
      const leftDate = Date.parse(left.article.publishedAt || "") || parseArticleDate(left.article.date);

      if (rightDate !== leftDate) {
        return rightDate - leftDate;
      }

      return String(left.article.title || "").localeCompare(String(right.article.title || ""), "pt-BR");
    })
    .map((entry) => entry.article);
};

const updateLiveFeedSummary = (filtered, visibleSlice) => {
  const totalItems = liveFeedState.items.length;
  const queryText = String(liveFeedQuery?.value || "").trim();
  const activeFilterLabel = getLiveFeedActiveFilterLabel();
  const summarySource = filtered.length > 0 ? filtered : liveFeedState.items;
  const activeContext = [activeFilterLabel, queryText ? `busca "${queryText}"` : ""].filter(Boolean);

  if (liveFeedCount) {
    liveFeedCount.textContent = String(filtered.length);
  }

  if (liveFeedCountLabel) {
    liveFeedCountLabel.textContent =
      activeContext.length > 0 ? "pautas no recorte atual" : "pautas verificadas na base";
  }

  if (liveFeedTotal) {
    liveFeedTotal.textContent = `Base local: ${totalItems} pautas verificadas`;
  }

  if (liveFeedUpdated) {
    liveFeedUpdated.textContent = getLiveFeedLatestDate(summarySource);
  }

  if (liveFeedFocus) {
    liveFeedFocus.textContent = getLiveFeedDominantCategory(summarySource);
  }

  if (liveFeedSources) {
    const sourceCount = getLiveFeedSourceCount(summarySource);
    liveFeedSources.textContent = `${sourceCount} ${sourceCount === 1 ? "fonte" : "fontes"}`;
  }

  if (liveFeedClear) {
    liveFeedClear.hidden = activeContext.length === 0;
  }

  if (!liveFeedStatus) {
    return;
  }

  if (filtered.length === 0) {
    liveFeedStatus.textContent =
      activeContext.length > 0
        ? `Nenhuma pauta bateu com ${activeContext.join(" e ")}. Limpe o filtro ou tente outro termo.`
        : "A base está carregada, mas nenhuma pauta entrou no recorte atual.";
    return;
  }

  if (activeContext.length > 0) {
    const loadedText =
      visibleSlice.length < filtered.length
        ? ` Mostrando ${visibleSlice.length} de ${filtered.length} agora.`
        : ` ${filtered.length} pauta${filtered.length === 1 ? "" : "s"} encontrada${filtered.length === 1 ? "" : "s"}.`;

    liveFeedStatus.textContent = `Recorte ativo por ${activeContext.join(" e ")}.${loadedText}`;
    return;
  }

  if (visibleSlice.length < filtered.length) {
    liveFeedStatus.textContent = `Arquivo vivo pronto: ${filtered.length} pautas verificadas na base. As ${liveFeedState.pageSize} mais recentes já aparecem aqui, e o restante pode ser aberto no botão abaixo.`;
    return;
  }

  liveFeedStatus.textContent = `Arquivo vivo com ${filtered.length} pautas verificadas. Use a busca ou os filtros rápidos para achar bairros, temas, fontes e editorias.`;
};

const renderLiveFeed = () => {
  if (!liveFeedGrid || !liveFeedQuery || !liveFeedMore || !liveFeedCount) {
    return;
  }

  const filtered = getFilteredLiveFeedArticles();
  const visibleSlice = filtered.slice(0, liveFeedState.visibleItems);

  liveFeedGrid.innerHTML = "";
  updateLiveFeedSummary(filtered, visibleSlice);

  if (filtered.length === 0) {
    const empty = document.createElement("div");
    empty.className = "feed-empty";
    empty.textContent =
      "Nenhuma pauta encontrada com esse termo. Tente buscar por tema, órgão ou bairro.";
    liveFeedGrid.appendChild(empty);
    liveFeedMore.hidden = true;
    return;
  }

  visibleSlice.forEach((article) => {
    liveFeedGrid.appendChild(buildFeedCard(article));
  });

  liveFeedMore.hidden = visibleSlice.length >= filtered.length;
  registerInteractivePanels(liveFeedGrid);
  registerArticleCardLinks(liveFeedGrid);
};

const closeLiveFeedSuggestions = () => {
  if (!liveFeedSuggestions || !liveFeedQuery) {
    return;
  }

  liveFeedSuggestions.hidden = true;
  liveFeedQuery.setAttribute("aria-expanded", "false");
};

const getLiveFeedSuggestionArticles = () => {
  if (!liveFeedQuery) {
    return [];
  }

  const query = normalizeText(liveFeedQuery.value);
  const categoryFiltered = getSortedLiveFeedArticles(liveFeedState.items)
    .map((article) => normalizeRuntimeArticle(article))
    .filter((article) => {
      if (!liveFeedState.activeCategory) {
        return true;
      }

      return articleMatchesCategoryFilter(article, liveFeedState.activeCategory);
    });

  if (!query) {
    return categoryFiltered;
  }

  return categoryFiltered
    .map((article) => ({
      article,
      score: getLiveFeedQueryScore(article, query)
    }))
    .filter((entry) => entry.score > 0)
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      return getArticleSortTimestamp(right.article) - getArticleSortTimestamp(left.article);
    })
    .map((entry) => entry.article);
};

const renderLiveFeedSuggestions = () => {
  if (!liveFeedSuggestions || !liveFeedQuery) {
    return;
  }

  if (document.activeElement !== liveFeedQuery) {
    closeLiveFeedSuggestions();
    return;
  }

  const matches = getLiveFeedSuggestionArticles();
  liveFeedSuggestions.innerHTML = "";

  if (!matches.length) {
    closeLiveFeedSuggestions();
    return;
  }

  const fragment = document.createDocumentFragment();

  matches.forEach((article) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "feed-suggestion-button is-article";
    button.setAttribute("role", "option");
    button.dataset.slug = article.slug || "";

    const title = document.createElement("strong");
    title.textContent = article.title;

    const meta = document.createElement("small");
    meta.textContent = `${article.sourceName} • ${article.date} • ${article.category}`;

    button.append(title, meta);
    fragment.appendChild(button);
  });

  liveFeedSuggestions.appendChild(fragment);
  liveFeedSuggestions.hidden = false;
  liveFeedQuery.setAttribute("aria-expanded", "true");
};

const attachLiveFeedAutocomplete = () => {
  if (!liveFeedSuggestions || !liveFeedQuery || liveFeedSuggestions.dataset.bound === "true") {
    return;
  }

  liveFeedSuggestions.dataset.bound = "true";
  liveFeedQuery.setAttribute("autocomplete", "off");
  liveFeedQuery.setAttribute("aria-controls", "arquivo-noticias-sugestoes");
  liveFeedQuery.setAttribute("aria-expanded", "false");

  liveFeedQuery.addEventListener("focus", renderLiveFeedSuggestions);
  liveFeedQuery.addEventListener("click", renderLiveFeedSuggestions);
  liveFeedQuery.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeLiveFeedSuggestions();
    }
  });

  liveFeedSuggestions.addEventListener("mousedown", (event) => {
    const button = event.target.closest(".feed-suggestion-button");
    if (!button) {
      return;
    }

    event.preventDefault();
    const slug = button.dataset.slug || "";
    const article = slug ? window.NEWS_MAP?.[slug] : null;
    const nextValue = article?.title || button.querySelector("strong")?.textContent || "";

    liveFeedQuery.value = nextValue;
    liveFeedState.visibleItems = liveFeedState.pageSize;
    renderLiveFeed();
    closeLiveFeedSuggestions();
    liveFeedQuery.focus();
  });

  document.addEventListener("mousedown", (event) => {
    if (event.target === liveFeedQuery || liveFeedSuggestions.contains(event.target)) {
      return;
    }

    closeLiveFeedSuggestions();
  });
};

const scrollToLiveFeed = () => {
  const target = document.querySelector("#arquivo-vivo") || liveFeedGrid;

  if (!target) {
    return;
  }

  target.scrollIntoView({
    behavior: splashMotionQuery.matches ? "auto" : "smooth",
    block: "start"
  });
};

const applyLiveFeedCategoryFilter = (filter = "todos", { scroll = false } = {}) => {
  if (!liveFeedGrid || !liveFeedQuery || !liveFeedMore || !liveFeedCount) {
    return;
  }

  const normalizedFilter = normalizeText(filter);
  liveFeedState.activeCategory = normalizedFilter === "todos" ? "" : normalizedFilter;
  liveFeedState.visibleItems = liveFeedState.pageSize;
  liveFeedQuery.value = "";

  renderLiveFeedFilters();
  renderLiveFeed();
  renderLiveFeedSuggestions();

  if (scroll) {
    scrollToLiveFeed();
  }
};

radarFilterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter || "todos";
    renderRadar(filter);
    applyLiveFeedCategoryFilter(filter, { scroll: true });
  });
});

const updateLiveFeedItems = (items = [], { resetFilter = true } = {}) => {
  const currentCategory = liveFeedState.activeCategory;
  liveFeedState.items = [...items];
  liveFeedState.activeCategory = resetFilter ? "" : currentCategory;
  liveFeedState.visibleItems = liveFeedState.pageSize;
  renderLiveFeedFilters();
  renderLiveFeed();
  renderLiveFeedSuggestions();
};

if (liveFeedGrid && liveFeedQuery && liveFeedMore && liveFeedCount) {
  attachLiveFeedAutocomplete();

  liveFeedQuery.addEventListener("input", () => {
    liveFeedState.visibleItems = liveFeedState.pageSize;
    renderLiveFeed();
    renderLiveFeedSuggestions();
  });

  if (liveFeedClear) {
    liveFeedClear.addEventListener("click", () => {
      liveFeedState.activeCategory = "";
      liveFeedState.visibleItems = liveFeedState.pageSize;

      if (liveFeedQuery) {
        liveFeedQuery.value = "";
        liveFeedQuery.focus();
      }

      renderLiveFeedFilters();
      renderLiveFeed();
      renderLiveFeedSuggestions();
    });
  }

  liveFeedMore.addEventListener("click", () => {
    liveFeedState.visibleItems += liveFeedState.pageSize;
    renderLiveFeed();
  });

  updateLiveFeedItems(window.NEWS_DATA || []);
}

// Inicializar o radar somente depois que os helpers e normalizadores ja existem.
renderRadar();

// --- WIDGETS LATERAIS ---
const sidebarData = window.SIDEBAR_DATA || null;

const escapeAttribute = (value) =>
  String(value || "").replace(/"/g, "&quot;");

const isExternalUrl = (value) => /^https?:\/\//.test(String(value || ""));

const getSidebarHref = (item, article) => {
  if (article?.slug) {
    return `./noticia.html?slug=${article.slug}`;
  }

  return item?.url || "./index.html";
};

const getSidebarLinkAttrs = (href) =>
  isExternalUrl(href) ? ' target="_blank" rel="noreferrer"' : "";

const getSidebarWeatherIcon = (condition) => {
  const normalized = normalizeText(condition);

  if (normalized.includes("trovoada") || normalized.includes("tempestade")) {
    return "⛈";
  }

  if (normalized.includes("chuva")) {
    return "🌧";
  }

  if (normalized.includes("nuv")) {
    return "☁";
  }

  return "☀";
};

const getLocalTodayIso = () => {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: localeTimeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });

  return formatter.format(new Date());
};

let sidebarClockTimerId = 0;

const getSidebarSafeDateFormatter = (locale, options) => {
  try {
    return new Intl.DateTimeFormat(locale, { ...options, timeZone: localeTimeZone });
  } catch (_error) {
    return new Intl.DateTimeFormat(locale, options);
  }
};

const getSidebarLocalDateParts = (date = new Date()) => {
  const timeLabel = getSidebarSafeDateFormatter("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23"
  }).format(date);

  const dateLabel = getSidebarSafeDateFormatter("pt-BR", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(date);

  const weekdayLabel = getSidebarSafeDateFormatter("pt-BR", {
    weekday: "long"
  }).format(date);

  const hourValue = Number(
    getSidebarSafeDateFormatter("en-US", {
      hour: "2-digit",
      hourCycle: "h23"
    }).format(date)
  );

  return {
    timeLabel,
    dateLabel,
    weekdayLabel,
    hourValue: Number.isFinite(hourValue) ? hourValue : date.getHours()
  };
};

const getSidebarDayPeriod = (hourValue = 12) => {
  if (hourValue < 12) return "manhã";
  if (hourValue < 18) return "tarde";
  return "noite";
};

const buildSidebarSnapshotLabel = () => {
  const { dateLabel } = getSidebarLocalDateParts();
  return `snapshot ${dateLabel}`;
};

const buildSidebarWeatherNote = (weather = {}) => {
  const { dateLabel, hourValue } = getSidebarLocalDateParts();
  const period = getSidebarDayPeriod(hourValue);
  const tonight = String(weather.tonight || "").trim();
  const prefix = `Leitura pública atualizada para ${dateLabel}, ${period}.`;
  return tonight ? `${prefix} ${tonight}` : prefix;
};

const refreshSidebarClock = () => {
  const clockNode = document.querySelector("#live-clock");
  const dateNode = document.querySelector("#live-date");
  const weekdayNode = document.querySelector("#live-weekday");

  if (!clockNode && !dateNode && !weekdayNode) {
    return;
  }

  const { timeLabel, dateLabel, weekdayLabel } = getSidebarLocalDateParts();

  if (clockNode) {
    clockNode.textContent = timeLabel;
  }

  if (dateNode) {
    dateNode.textContent = dateLabel;
  }

  if (weekdayNode) {
    weekdayNode.textContent = `${weekdayLabel} • Acre • UTC-5`;
  }
};

const bindSidebarClock = () => {
  refreshSidebarClock();

  if (sidebarClockTimerId) {
    window.clearInterval(sidebarClockTimerId);
  }

  sidebarClockTimerId = window.setInterval(refreshSidebarClock, 1000);
};

const getNextHolidayText = (holidayGroups = []) => {
  const todayIso = getLocalTodayIso();
  const todayMs = Date.parse(`${todayIso}T12:00:00Z`);
  const upcoming = holidayGroups
    .flat()
    .filter((holiday) => holiday.isoDate >= todayIso)
    .sort((left, right) => left.isoDate.localeCompare(right.isoDate))[0];

  if (!upcoming) {
    return "Sem feriado futuro cadastrado no radar local.";
  }

  const holidayMs = Date.parse(`${upcoming.isoDate}T12:00:00Z`);
  const diffDays = Math.round((holidayMs - todayMs) / 86400000);
  const plural = diffDays === 1 ? "" : "s";

  return `Proximo feriado no radar: ${upcoming.name} em ${diffDays} dia${plural}.`;
};

const buildHolidayMarkup = (holidays) =>
  holidays
    .map(
      (holiday) => `
        <div class="holiday-item">
          <div>
            <span class="holiday-date">${holiday.shortDate}</span>
            <span class="holiday-weekday">${holiday.weekday}</span>
          </div>
          <div>
            <span class="holiday-name">${holiday.name}</span>
            ${holiday.scope ? `<small>${holiday.scope}</small>` : ""}
          </div>
        </div>
      `
    )
    .join("");

const buildAgendaMarkup = (items) =>
  items
    .map((item) => {
      const article = item.slug ? window.NEWS_MAP?.[item.slug] : null;
      const href = getSidebarHref(item, article);
      const title = article?.title || item.title;
      const sourceName = article?.sourceName || item.sourceName || "Fonte local";
      const meta = item.meta || article?.sourceLabel || "";

      return `
        <a class="sidebar-list-item" href="${escapeAttribute(href)}"${getSidebarLinkAttrs(href)}>
          <div class="sidebar-list-head">
            <span class="rail-pill">${item.tag}</span>
            <strong>${item.dateLabel}</strong>
          </div>
          <h3>${title}</h3>
          <p>${meta}</p>
          <small>Fonte: ${sourceName}</small>
        </a>
      `;
    })
    .join("");

const pickSidebarFallbackStories = (count = 0, usedKeys = new Set()) => {
  if (count <= 0) {
    return [];
  }

  const candidates = (window.NEWS_DATA || [])
    .map((item) => normalizeRuntimeArticle(item))
    .filter((article) => getArticleUsageKey(article));
  const selected = [];
  const usedImages = new Set();

  candidates.some((article) => {
    if (selected.length >= count) return true;
    const articleKey = getArticleUsageKey(article);
    if (!articleKey || usedKeys.has(articleKey)) return false;
    const imageKey = getArticleImageKey(article);
    if (!imageKey || usedImages.has(imageKey)) return false;
    usedImages.add(imageKey);
    usedKeys.add(articleKey);
    selected.push(article);
    return false;
  });

  if (selected.length < count) {
    candidates.some((article) => {
      if (selected.length >= count) return true;
      const articleKey = getArticleUsageKey(article);
      if (!articleKey || usedKeys.has(articleKey)) return false;
      usedKeys.add(articleKey);
      selected.push(article);
      return false;
    });
  }

  return selected;
};

const buildStoryMarkup = (items, surfaceName = "") =>
  (() => {
    const usedKeys = buildReservedArticleKeys(surfaceName ? [surfaceName] : []);
    const selectedArticles = [];
    const fallbackArticles = pickSidebarFallbackStories(items.length, usedKeys);
    let fallbackIndex = 0;

    const markup = items
      .map((item) => {
        const requestedArticle = item.slug ? window.NEWS_MAP?.[item.slug] : null;
        const requestedKey = requestedArticle ? getArticleUsageKey(requestedArticle) : "";
        const shouldUseRequested = Boolean(requestedArticle && requestedKey && !usedKeys.has(requestedKey));
        const rawArticle = shouldUseRequested ? requestedArticle : fallbackArticles[fallbackIndex++];

        if (!rawArticle) {
          return "";
        }

        const article = normalizeRuntimeArticle(rawArticle);
        const articleKey = getArticleUsageKey(article);
        if (articleKey) {
          usedKeys.add(articleKey);
          selectedArticles.push(article);
        }
        const href = buildArticleHref(article);
        const photoUrl = getArticleDisplayImageUrl(article);
        const photoStyle = photoUrl
          ? ` style="--story-photo:url('${photoUrl}')"`
          : "";

        return `
          <a class="sidebar-photo-card" href="${escapeAttribute(href)}"${getSidebarLinkAttrs(href)}${photoStyle}>
            <div class="sidebar-photo-copy">
              <span>${item.kicker}</span>
              <strong>${article.title}</strong>
              <small>${item.stat} • ${article.sourceName}</small>
            </div>
          </a>
        `;
      })
      .join("");

    if (surfaceName) {
      reserveSurfaceArticles(surfaceName, selectedArticles);
    }

    return markup;
  })();

const buildListPanelMarkup = ({
  title,
  source,
  items,
  actionLabel,
  actionUrl,
  passiveLabel = "recorte real"
}) => {
  const actionMarkup = actionUrl
    ? `<a class="widget-link" href="${escapeAttribute(actionUrl)}"${getSidebarLinkAttrs(actionUrl)}>${actionLabel}</a>`
    : `<span class="widget-link passive-link">${passiveLabel}</span>`;

  return `
    <div class="sidebar-heading">
      <div>
        <p class="widget-title">${title}</p>
        <span class="widget-source">${source}</span>
      </div>
      ${actionMarkup}
    </div>
    <div class="sidebar-list">
      ${buildAgendaMarkup(items)}
    </div>
  `;
};

const buildMarketMarkup = (market) => `
  <div class="sidebar-heading">
    <div>
      <p class="widget-title">Radar de Bolsa</p>
      <span class="widget-source">${market.snapshotLabel}</span>
    </div>
    <a class="widget-link" href="${escapeAttribute(market.sourceUrl)}"${getSidebarLinkAttrs(market.sourceUrl)}>fechamento</a>
  </div>
  <div class="market-quote-row">
    ${market.quotes
      .map(
        (quote) => `
          <div class="market-quote">
            <span>${quote.label}</span>
            <strong>${quote.value}</strong>
            <small>${quote.note}</small>
          </div>
        `
      )
      .join("")}
  </div>
  <div class="market-grid">
    ${market.moves
      .map(
        (item) => `
          <a class="market-move" href="${escapeAttribute(item.url)}"${getSidebarLinkAttrs(item.url)}>
            <div class="market-head">
              <span class="market-bias ${item.bias}">${item.badge}</span>
              <strong>${item.label}</strong>
            </div>
            <h3>${item.title}</h3>
            <p>${item.summary}</p>
            <small>Base: ${item.sourceName}</small>
          </a>
        `
      )
      .join("")}
  </div>
  <div class="market-opinion">
    <p class="widget-kicker">${market.opinionTitle}</p>
    <p>${market.opinionText}</p>
  </div>
  <div class="sidebar-list compact-list">
    ${buildAgendaMarkup(market.pocketTips)}
  </div>
`;

const renderSidebarWidgets = () => {
  if (!sidebarData) {
    return;
  }

  reserveSurfaceArticles("buzz", []);
  reserveSurfaceArticles("popular", []);

  const nowPanel = document.querySelector("#sidebar-now");
  const holidaysPanel = document.querySelector("#sidebar-holidays");
  const nationalPanel = document.querySelector("#sidebar-national");
  const politicsPanel = document.querySelector("#sidebar-politics");
  const marketPanel = document.querySelector("#sidebar-market");
  const agendaPanel = document.querySelector("#sidebar-agenda");
  const worldPanel = document.querySelector("#sidebar-world");
  const varietiesPanel = document.querySelector("#sidebar-varieties");
  const famousPanel = document.querySelector("#sidebar-famous");
  const buzzPanel = document.querySelector("#sidebar-buzz");
  const popularPanel = document.querySelector("#sidebar-popular");
  const commercialPanel = document.querySelector("#sidebar-commercial");
  const adsPanel = document.querySelector("#sidebar-ads");

  if (!nowPanel) {
    return;
  }

  const nextHolidayText = getNextHolidayText([
    sidebarData.holidays.national,
    sidebarData.holidays.local
  ]);
  const weatherIcon = getSidebarWeatherIcon(sidebarData.weather.current.condition);

  nowPanel.innerHTML = `
    <div class="rail-intro">
      <p class="rail-kicker">terceira coluna</p>
      <h3>Painel Local</h3>
      <p>Relógio, clima, feriados, agenda, buzz da rede e espaço comercial no mesmo trilho.</p>
    </div>
    <div class="sidebar-heading">
      <div>
        <p class="widget-title">Cruzeiro do Sul Agora</p>
        <span class="widget-source">${buildSidebarSnapshotLabel()}</span>
      </div>
      <a class="widget-link" href="${sidebarData.weather.sourceUrl}" target="_blank" rel="noreferrer">clima real</a>
    </div>
    <div class="sidebar-now-grid">
      <div>
        <div class="clock-time" id="live-clock">00:00:00</div>
        <div class="clock-date" id="live-date">carregando data local...</div>
        <div class="clock-weekday" id="live-weekday">Acre • UTC-5</div>
      </div>
      <div class="sidebar-weather-badge">
        <span class="weather-icon">${weatherIcon}</span>
        <div>
          <strong class="weather-temp" id="weather-temp">${sidebarData.weather.current.temperature}</strong>
          <p class="weather-summary">${sidebarData.weather.current.condition}</p>
        </div>
      </div>
    </div>
    <div class="weather-details">
      ${sidebarData.weather.current.details
        .map((detail) => `<span>${detail}</span>`)
        .join("")}
    </div>
    <p class="widget-note">${buildSidebarWeatherNote(sidebarData.weather)}</p>
    <p class="widget-note">${nextHolidayText}</p>
    <label class="sidebar-search-inline">
      <span>Buscar no portal</span>
      <input type="text" id="sidebar-search" placeholder="cheia, escola, policia, cultura..." />
    </label>
  `;

  if (holidaysPanel) {
    holidaysPanel.innerHTML = `
    <div class="sidebar-heading">
      <div>
        <p class="widget-title">Feriados no Radar</p>
        <span class="widget-source">nacional + Acre + municipio</span>
      </div>
      <a class="widget-link" href="${sidebarData.holidays.sourceUrl}" target="_blank" rel="noreferrer">fonte oficial</a>
    </div>
    <div class="holiday-columns">
      <section>
        <p class="widget-kicker">nacionais</p>
        <div class="holiday-list">
          ${buildHolidayMarkup(sidebarData.holidays.national)}
        </div>
      </section>
      <section>
        <p class="widget-kicker">locais e regionais</p>
        <div class="holiday-list">
          ${buildHolidayMarkup(sidebarData.holidays.local)}
        </div>
      </section>
    </div>
  `;
  }

  if (nationalPanel) {
    nationalPanel.innerHTML = buildListPanelMarkup({
      title: "Nacional do Dia",
      source: "servico, consumo e custo de vida no radar",
      items: sidebarData.national,
      actionLabel: "economia",
      actionUrl: "https://agenciabrasil.ebc.com.br/economia"
    });
  }

  if (politicsPanel) {
    politicsPanel.innerHTML = buildListPanelMarkup({
      title: "Politica",
      source: "Brasilia, eleicoes e mudancas de equipe",
      items: sidebarData.politics,
      actionLabel: "politica",
      actionUrl: "https://agenciabrasil.ebc.com.br/politica"
    });
  }

  if (marketPanel) {
    marketPanel.innerHTML = buildMarketMarkup(sidebarData.market);
  }

  if (agendaPanel) {
    agendaPanel.innerHTML = buildListPanelMarkup({
      title: "Agenda & Servico",
      source: "acoes uteis com data certa",
      items: sidebarData.agenda
    });
  }

  if (worldPanel) {
    worldPanel.innerHTML = buildListPanelMarkup({
      title: "Internacional",
      source: "mundo, energia, juros e ciencia",
      items: sidebarData.world,
      actionLabel: "mundo",
      actionUrl: "https://agenciabrasil.ebc.com.br/internacional"
    });
  }

  if (varietiesPanel) {
    varietiesPanel.innerHTML = buildListPanelMarkup({
      title: "Variedades",
      source: "cinema, museu, cultura e conversa",
      items: sidebarData.varieties,
      actionLabel: "cultura",
      actionUrl: "https://agenciabrasil.ebc.com.br/cultura"
    });
  }

  if (famousPanel) {
    famousPanel.innerHTML = buildListPanelMarkup({
      title: "Famosos",
      source: "pop, relacionamento e bastidor",
      items: sidebarData.famous,
      actionLabel: "gshow",
      actionUrl: "https://gshow.globo.com/cultura-pop/famosos/"
    });
  }

  if (buzzPanel) {
    buzzPanel.innerHTML = `
    <div class="sidebar-heading">
      <div>
        <p class="widget-title">Rede, Festas & Fofoca</p>
        <span class="widget-source">o que circula na conversa local</span>
      </div>
      <span class="widget-link passive-link">com foto quando houver</span>
    </div>
    <div class="sidebar-photo-list">
      ${buildStoryMarkup(sidebarData.buzz, "buzz")}
    </div>
  `;
  }

  if (popularPanel) {
    popularPanel.innerHTML = `
    <div class="sidebar-heading">
      <div>
        <p class="widget-title">Mais Vistos do Catalogo</p>
        <span class="widget-source">puxado da cobertura ativa</span>
      </div>
      <span class="widget-link passive-link">atalhos rapidos</span>
    </div>
    <div class="sidebar-photo-list compact">
      ${buildStoryMarkup(sidebarData.popular, "popular")}
    </div>
  `;
  }

  if (commercialPanel) {
    commercialPanel.innerHTML = `
    <p class="card-kicker">publicidade local</p>
    <h3>Banner premium, publieditorial e agenda paga</h3>
    <p>
      A terceira coluna agora aguenta divulgacao de evento, festa, curso, clinica,
      loja, campanha e servico com chamada forte e boa permanencia em tela.
    </p>
    <div class="side-pill-row">
      <span class="rail-pill">300 x 600</span>
      <span class="rail-pill">post patrocinado</span>
      <span class="rail-pill">agenda local</span>
    </div>
    <a class="solid-button" href="#monetizacao">Reservar a lateral</a>
  `;
  }

  if (adsPanel) {
    adsPanel.innerHTML = `
    <p class="card-kicker">ads e divulgacao</p>
    <h3>Espacos prontos para vender</h3>
    <div class="sidebar-ad-grid">
      <a class="ad-slot tall" href="#monetizacao">
        <span>300 x 600</span>
        <strong>Banner vertical premium</strong>
        <small>campanha fixa ao lado da leitura</small>
      </a>
      <a class="ad-slot" href="#monetizacao">
        <span>agenda patrocinada</span>
        <strong>Evento com data, local e CTA</strong>
        <small>festa, show, encontro ou promocao</small>
      </a>
      <a class="ad-slot" href="#monetizacao">
        <span>vitrine local</span>
        <strong>Guia rapido de marcas e servicos</strong>
        <small>entrada enxuta com selo parceiro</small>
      </a>
    </div>
  `;
  }

  bindSidebarClock();
};

const initializeSidebarWidgets = () => {
  renderSidebarWidgets();
  document
    .querySelectorAll(".side-rail .reveal")
    .forEach((node) => node.classList.add("active"));

  const sidebarSearch = document.querySelector("#sidebar-search");

  if (sidebarSearch) {
    sidebarSearch.addEventListener("input", (event) => {
      const query = event.target.value;

      if (typeof liveFeedQuery !== "undefined" && liveFeedQuery) {
        liveFeedQuery.value = query;
        liveFeedQuery.dispatchEvent(new Event("input"));
      }

      if (typeof renderRadar === "function") {
        renderRadar("todos");
      }
    });
  }

  registerInteractivePanels(document.querySelector(".side-rail"));
};

initializeSidebarWidgets();

const hydrateDynamicNews = async () => {
  try {
    const payload = await requestApiJson("/api/news", { method: "GET" });
    const runtimeItems = Array.isArray(payload.items) ? payload.items : [];

    if (runtimeItems.length === 0) {
      return;
    }

    const merged = syncNewsDataset(runtimeItems);
    const activeFilter =
      document.querySelector("#radar .chip-button.is-active[data-filter]")?.dataset.filter ||
      "todos";
    hydrateMosaicHero(merged);
    hydrateStaticMediaSurfaces();
    renderSidebarWidgets();
    renderRadar(activeFilter);
    updateLiveFeedItems(merged, { resetFilter: false });
    initializeLiveTicker();
  } catch (error) {
    // Mantem o fallback estatico quando a API nao estiver ligada.
  }
};

const hydrateCommentsFromApi = async () => {
  try {
    const payload = await requestApiJson("/api/comments?limit=8", { method: "GET" });
    const comments = Array.isArray(payload.items)
      ? payload.items
      : Array.isArray(payload.comments)
        ? payload.comments
        : [];

    if (comments.length > 0) {
      renderCommentsFeed(comments.slice(0, 8));
    }
  } catch (error) {
    // Mantem os comentarios estaticos quando a API nao estiver ligada.
  }
};

const scheduleHomeBackgroundHydration = () => {
  const run = () => {
    const execute = () => {
      hydrateDynamicNews();
      hydrateCommentsFromApi();
      window.setInterval(hydrateDynamicNews, 300000);
    };

    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(execute, { timeout: 1800 });
      return;
    }

    window.setTimeout(execute, 300);
  };

  if (document.readyState === "complete") {
    run();
    return;
  }

  window.addEventListener("load", run, { once: true });
};

const attachCommentSubmission = () => {
  if (!publishCommentButton || !opinionInput || !commentsFeed || !charCount) {
    return;
  }

  publishCommentButton.addEventListener("click", async () => {
    const name = commentAuthorInput?.value?.trim() || "";
    const message = opinionInput.value.trim();

    if (name.length < 2) {
      setFeedbackState(commentFeedback, "Escreva um nome ou apelido com pelo menos 2 letras.", "is-error");
      commentAuthorInput?.focus();
      return;
    }

    if (!message) {
      setFeedbackState(commentFeedback, "Escreva sua opiniao antes de enviar.", "is-error");
      opinionInput.focus();
      return;
    }

    publishCommentButton.disabled = true;
    setFeedbackState(commentFeedback, "Enviando comentario...", "");

    try {
      const analyticsContext = getAnalyticsContext();
      const payload = await requestApiJson("/api/comments", {
        method: "POST",
        body: JSON.stringify({
          articleId: "home-comunidade",
          pagePath: `${window.location.pathname || "/"}${window.location.search || ""}`,
          author: name,
          name,
          message,
          badge: "Leitor local",
          visitorId: analyticsContext.visitorId || "",
          sessionId: analyticsContext.sessionId || "",
          cookieVisitorId: analyticsContext.cookieVisitorId || "",
          cookieSessionId: analyticsContext.cookieSessionId || "",
          trackingConsent: analyticsContext.consent || ""
        })
      });

      if (payload.comment) {
        await hydrateCommentsFromApi();
      }

      opinionInput.value = "";
      if (commentAuthorInput) {
        commentAuthorInput.value = "";
      }
      charCount.textContent = "0 / 180";
      setFeedbackState(commentFeedback, "Comentario enviado para a comunidade.", "is-success");
    } catch (error) {
      commentsFeed.prepend(
        buildCommentCard({
          name,
          badge: "Somente local",
          message
        })
      );
      opinionInput.value = "";
      if (commentAuthorInput) {
        commentAuthorInput.value = "";
      }
      charCount.textContent = "0 / 180";
      setFeedbackState(
        commentFeedback,
        "Servidor offline. Seu comentario apareceu so nesta tela por enquanto.",
        "is-error"
      );
    } finally {
      publishCommentButton.disabled = false;
    }
  });
};

const isFounderPlan = (value = "") => String(value || "").trim() === "fundadores";

const buildSupporterTxid = () =>
  `FUND${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`
    .replace(/[^A-Za-z0-9]/g, "")
    .toUpperCase()
    .slice(0, 25);

const formatPixAmountLabel = (value = 0) =>
  Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2
  });

const getFounderAmountValue = () => {
  const rawAmount = Number(subscriptionFounderAmountInput?.value || 5);
  return Math.max(1, Math.min(10, Number.isFinite(rawAmount) ? rawAmount : 5));
};

const resetSupporterPaymentCard = () => {
  if (!subscriptionPaymentCard) {
    return;
  }

  supporterPaymentState.locked = false;
  subscriptionPaymentCard.hidden = true;
  if (subscriptionPixKey) subscriptionPixKey.textContent = "carregando...";
  if (subscriptionPixAmount) subscriptionPixAmount.textContent = formatPixAmountLabel(getFounderAmountValue());
  if (subscriptionPixTxid) subscriptionPixTxid.textContent = "carregando...";
  if (subscriptionPixQr) subscriptionPixQr.innerHTML = "";
  if (subscriptionPixCode) subscriptionPixCode.value = "";
  if (subscriptionPaymentNote) {
    subscriptionPaymentNote.textContent = "O apoio só entra no mural depois da confirmação manual do pagamento.";
  }
};

const syncSupporterPaymentCard = async (forceNewTxid = false) => {
  if (!subscriptionPlanInput || !subscriptionPaymentCard) {
    return;
  }

  if (!isFounderPlan(subscriptionPlanInput.value)) {
    resetSupporterPaymentCard();
    return;
  }

  if (supporterPaymentState.locked && forceNewTxid) {
    if (subscriptionPaymentNote) {
      subscriptionPaymentNote.textContent =
        "Esta referência já foi vinculada ao apoio enviado. Use este mesmo código Pix ou recarregue a página para começar outro apoio.";
    }
    return;
  }

  const founderAmount = getFounderAmountValue();
  supporterPaymentState.amount = founderAmount;

  if (forceNewTxid || !supporterPaymentState.txid) {
    supporterPaymentState.txid = buildSupporterTxid();
  }

  subscriptionPaymentCard.hidden = false;
  if (subscriptionPixAmount) {
    subscriptionPixAmount.textContent = formatPixAmountLabel(founderAmount);
  }
  if (subscriptionPixQr) {
    subscriptionPixQr.innerHTML = "<p>Gerando QR code do apoio...</p>";
  }

  try {
    const params = new URLSearchParams({
      amount: String(founderAmount),
      txid: supporterPaymentState.txid,
      description: "Apoio Fundador Catalogo"
    });
    const payload = await requestApiJson(`/api/subscriptions/pix?${params.toString()}`, { method: "GET" });
    const resolvedAmount = Number(payload.amount || founderAmount);

    supporterPaymentState.txid = payload.txid || supporterPaymentState.txid;
    supporterPaymentState.amount = resolvedAmount;
    if (subscriptionFounderAmountInput) {
      subscriptionFounderAmountInput.value = String(Math.round(resolvedAmount));
    }
    if (subscriptionPixKey) subscriptionPixKey.textContent = payload.key || "";
    if (subscriptionPixAmount) subscriptionPixAmount.textContent = formatPixAmountLabel(resolvedAmount);
    if (subscriptionPixTxid) subscriptionPixTxid.textContent = supporterPaymentState.txid;
    if (subscriptionPixQr) {
      subscriptionPixQr.innerHTML =
        payload.qrSvg || "<p>QR code indisponível no momento. Use o copia e cola abaixo.</p>";
    }
    if (subscriptionPixCode) {
      subscriptionPixCode.value = payload.copyCode || "";
    }
    if (subscriptionPaymentNote) {
      const recipientName = String(payload.recipientName || "").trim();
      subscriptionPaymentNote.textContent = recipientName
        ? `Recebedor: ${recipientName}. Apoio de ${formatPixAmountLabel(resolvedAmount)} aguardando confirmação manual do Pix antes de entrar no mural.`
        : `Apoio de ${formatPixAmountLabel(resolvedAmount)} aguardando confirmação manual do Pix antes de entrar no mural.`;
    }
  } catch (error) {
    if (subscriptionPixQr) {
      subscriptionPixQr.innerHTML = "<p>Não foi possível gerar o QR code agora.</p>";
    }
    if (subscriptionPaymentNote) {
      subscriptionPaymentNote.textContent = String(error?.message || "Falha ao gerar o pagamento.");
    }
  }
};

const activateFounderPlan = ({ focusAmount = false } = {}) => {
  if (!subscriptionPlanInput) {
    return;
  }

  subscriptionPlanInput.value = "fundadores";
  toggleFounderAmountField();
  void syncSupporterPaymentCard(true);

  if (focusAmount && subscriptionFounderAmountInput) {
    window.setTimeout(() => {
      subscriptionFounderAmountInput.focus();
      subscriptionFounderAmountInput.select?.();
    }, 120);
  }
};

const toggleFounderAmountField = () => {
  if (!subscriptionFounderWrap || !subscriptionPlanInput) {
    return;
  }

  const founderActive = isFounderPlan(subscriptionPlanInput.value);
  subscriptionFounderWrap.hidden = !founderActive;

  if (subscriptionFounderAmountInput) {
    subscriptionFounderAmountInput.disabled = !founderActive;
  }

  if (subscriptionSubmitButton) {
    subscriptionSubmitButton.textContent = founderActive
      ? "Quero virar fundador"
      : "Receber grátis no e-mail";
  }

  if (!founderActive) {
    resetSupporterPaymentCard();
    supporterPaymentState.txid = "";
  }
};

const buildFounderCard = (founder = {}) => {
  const card = document.createElement("article");
  const amount = Number(founder.amount || 0);
  const safeName = String(founder.name || "Fundador do Catalogo").trim() || "Fundador do Catalogo";
  const joinedAt = founder.createdAt
    ? new Date(founder.createdAt).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: localeTimeZone
      })
    : "agora";

  card.className = "founder-card";
  card.innerHTML = `
    <strong>★ ${escapeHtml(safeName)}</strong>
    <p>Fundador do Catalogo CZS com apoio simbólico${amount ? ` de R$ ${amount}` : ""}.</p>
    <span>entrou em ${escapeHtml(joinedAt)}</span>
  `;
  return card;
};

const renderFoundersWall = (items = [], totalFounders = items.length) => {
  if (!foundersList || !foundersCount) {
    return;
  }

  const founders = (Array.isArray(items) ? items : []).filter((item) => item?.name);
  foundersCount.textContent = `${totalFounders} ${totalFounders === 1 ? "fundador" : "fundadores"} até agora`;

  if (!founders.length) {
    foundersList.innerHTML = `
      <article class="founder-card is-empty">
        <strong>★ Seu nome pode abrir esta lista</strong>
        <p>Os primeiros apoiadores aparecem aqui como fundadores do portal.</p>
      </article>
    `;
    return;
  }

  foundersList.innerHTML = "";
  founders.slice(0, 18).forEach((founder) => {
    foundersList.appendChild(buildFounderCard(founder));
  });
};

const hydrateFoundersWallFromApi = async () => {
  try {
    const payload = await requestApiJson("/api/subscriptions", { method: "GET" });
    renderFoundersWall(payload.founders || [], Number(payload?.totals?.founders || 0));
  } catch (_error) {
    // Mantem o mural estatico quando a API nao estiver ligada.
  }
};

const attachSubscriptionSubmission = () => {
  if (!subscriptionForm || !subscriptionEmailInput || !subscriptionPlanInput) {
    return;
  }

  toggleFounderAmountField();
  if (isFounderPlan(subscriptionPlanInput.value)) {
    void syncSupporterPaymentCard(true);
  }

  document.querySelectorAll("[data-founder-cta]").forEach((cta) => {
    cta.addEventListener("click", () => {
      activateFounderPlan({ focusAmount: true });
      window.setTimeout(() => {
        subscriptionPaymentCard?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 180);
    });
  });

  subscriptionPlanInput.addEventListener("change", () => {
    toggleFounderAmountField();
    if (isFounderPlan(subscriptionPlanInput.value)) {
      void syncSupporterPaymentCard(true);
    }
  });

  subscriptionFounderAmountInput?.addEventListener("input", () => {
    if (!isFounderPlan(subscriptionPlanInput.value)) {
      return;
    }

    if (supporterPaymentState.locked) {
      if (subscriptionPaymentNote) {
        subscriptionPaymentNote.textContent =
          "O apoio já foi enviado com a referência atual. Recarregue a página se quiser começar outro pagamento.";
      }
      subscriptionFounderAmountInput.value = String(supporterPaymentState.amount || 5);
      return;
    }

    void syncSupporterPaymentCard(true);
  });

  subscriptionCopyPixButton?.addEventListener("click", async () => {
    const copied = await copyTextToClipboard(subscriptionPixCode?.value || "");
    if (subscriptionPaymentNote) {
      subscriptionPaymentNote.textContent = copied
        ? "Código Pix copiado para o apoio de fundador."
        : "Não consegui copiar o código Pix agora.";
    }
  });

    subscriptionRefreshPixButton?.addEventListener("click", () => {
    if (!isFounderPlan(subscriptionPlanInput.value)) {
      return;
    }

    if (supporterPaymentState.locked) {
      if (subscriptionPaymentNote) {
        subscriptionPaymentNote.textContent =
          "A referência já está presa ao apoio enviado. Use este código Pix para concluir o pagamento.";
      }
      return;
    }

    void syncSupporterPaymentCard(true);
  });

  subscriptionForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = subscriptionEmailInput.value.trim();
    const name = subscriptionNameInput?.value?.trim() || "";
    const plan = subscriptionPlanInput.value;
    const founderAmount = getFounderAmountValue();

    if (!email) {
      setFeedbackState(subscriptionFeedback, "Preencha o e-mail para assinar.", "is-error");
      subscriptionEmailInput.focus();
      return;
    }

    if (isFounderPlan(plan) && name.length < 2) {
      setFeedbackState(subscriptionFeedback, "Para entrar nos fundadores, informe um nome publico.", "is-error");
      subscriptionNameInput?.focus();
      return;
    }

    if (isFounderPlan(plan) && (founderAmount < 1 || founderAmount > 10)) {
      setFeedbackState(subscriptionFeedback, "O apoio de fundador precisa ficar entre R$ 1 e R$ 10.", "is-error");
      subscriptionFounderAmountInput?.focus();
      return;
    }

    if (isFounderPlan(plan) && !supporterPaymentState.txid) {
      await syncSupporterPaymentCard(true);
    }

    setFeedbackState(
      subscriptionFeedback,
      isFounderPlan(plan) ? "Registrando apoio e vinculando a referência do Pix..." : "Registrando assinatura...",
      ""
    );

    try {
      const payload = await requestApiJson("/api/subscriptions", {
        method: "POST",
        body: JSON.stringify({
          email,
          name,
          plan,
          amount: isFounderPlan(plan) ? founderAmount : 0,
          paymentTxid: isFounderPlan(plan) ? supporterPaymentState.txid : ""
        })
      });

      if (isFounderPlan(plan)) {
        supporterPaymentState.locked = true;
        setFeedbackState(
          subscriptionFeedback,
          `Apoio de fundador registrado com referência ${supporterPaymentState.txid}. Agora conclua o Pix de R$ ${founderAmount} no quadro acima. O nome entra no mural após confirmação manual.`,
          "is-success"
        );
        if (subscriptionPaymentNote) {
          subscriptionPaymentNote.textContent =
            payload?.message ||
            "Apoio registrado e aguardando confirmação manual do Pix antes de entrar no mural.";
        }
      } else {
        subscriptionForm.reset();
        toggleFounderAmountField();
        setFeedbackState(
          subscriptionFeedback,
          "Resumo das 7h grátis registrado. A partir de agora ele cai no seu e-mail.",
          "is-success"
        );
      }
    } catch (error) {
      setFeedbackState(
        subscriptionFeedback,
        String(error?.message || "Nao consegui falar com o backend agora. Ligue o servidor para receber assinaturas reais."),
        "is-error"
      );
    }
  });
};

attachCommentSubmission();
attachSubscriptionSubmission();
attachAgentMailFlow();
initializeLiveTicker();
scheduleHomeBackgroundHydration();
hydrateFoundersWallFromApi();
