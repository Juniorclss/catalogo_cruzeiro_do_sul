const params = new URLSearchParams(window.location.search);
const OFFLINE_NEWS_CACHE_KEYS = ["catalogo_news_cache_v2", "catalogo_news_cache_v1"];
const OFFLINE_LAST_ARTICLE_KEYS = ["catalogo_last_article_v2", "catalogo_last_article_v1"];
const SKIP_HOME_INTRO_KEY = "catalogo_skip_home_intro_once";
const HOME_RETURN_URL = "./index.html?skipIntro=1";
const DETAIL_FALLBACK_IMAGES = [];
const AUTHORIAL_DETAIL_ARTICLES = {
  "michael-jackson-filme-cine-romeu-cruzeiro-do-sul": {
    id: "michael-jackson-filme-cine-romeu-cruzeiro-do-sul",
    slug: "michael-jackson-filme-cine-romeu-cruzeiro-do-sul",
    title: "Filme de Michael Jackson vira estreia de peso para 2026 e entra no radar do Cine Romeu",
    eyebrow: "cinema e impacto cultural",
    date: "23 de abril de 2026",
    publishedAt: "2026-04-23T08:55:00-05:00",
    category: "Cultura",
    previewClass: "thumb-cultura",
    sourceName: "Editorial Catalogo Cruzeiro do Sul",
    sourceUrl: "https://www.youtube.com/watch?v=lIMj2ZRpo1M",
    sourceLabel: "Artigo autoral do Catalogo com base em trailer publico, IMDb e circuito local do Cine Romeu",
    imageUrl: "https://i.ytimg.com/vi/lIMj2ZRpo1M/maxresdefault.jpg",
    feedImageUrl: "https://i.ytimg.com/vi/lIMj2ZRpo1M/maxresdefault.jpg",
    sourceImageUrl: "https://i.ytimg.com/vi/lIMj2ZRpo1M/maxresdefault.jpg",
    imageCredit: "Crédito: trailer oficial de Michael / Lionsgate",
    imageFocus: "center 28%",
    lede: "O longa Michael, dirigido por Antoine Fuqua e estrelado por Jaafar Jackson, chega aos cinemas em 24 de abril de 2026 com lançamento global e ambição de evento de grande circuito.",
    summary: "O longa Michael, dirigido por Antoine Fuqua e estrelado por Jaafar Jackson, chega aos cinemas em 24 de abril de 2026 com lançamento global e ambição de evento de grande circuito. Em Cruzeiro do Sul, isso entra no radar porque o Cine Romeu segue como a principal sala local para produções de apelo popular e pode transformar a estreia em pauta de cidade.",
    analysis: "Este artigo autoral entra como destaque porque junta memória pop, indústria cultural e circuito exibidor com reflexo concreto em Cruzeiro do Sul. Michael Jackson segue como um nome gigantesco da música global, e um filme com distribuição ampla, suporte em IMAX e protagonista da própria família tende a mobilizar curiosidade, debate e bilheteria também fora dos grandes centros.",
    body: [
      "A produção ganhou corpo como um dos lançamentos fortes do primeiro semestre de 2026. A data de estreia internacional foi fixada para 24 de abril de 2026, com distribuição da Lionsgate nos Estados Unidos e da Universal no mercado internacional.",
      "O filme é dirigido por Antoine Fuqua, escrito por John Logan e traz Jaafar Jackson no papel principal. Isso pesa no noticiário porque não se trata de um documentário pequeno ou de nicho: é um projeto de estúdio, com escala comercial, elenco conhecido e aposta explícita em alcançar o público global.",
      "No plano cultural, Michael Jackson continua sendo um dos artistas mais influentes da música pop, com impacto em dança, clipes, performance, moda, turnês e indústria fonográfica. Mesmo quando a recepção crítica diverge sobre o recorte da cinebiografia, o tamanho do personagem por si só já transforma o filme em acontecimento.",
      "Para Cruzeiro do Sul, a conversa não é abstrata. O Cine Romeu, no Hortência Center, segue como referência local de exibição e já recebeu sessões de festivais e circuitos culturais recentes. Quando um título com esse tamanho entra em cartaz, ele também funciona como termômetro do apetite do público local por grandes estreias.",
      "Se Michael chegar à grade do Cine Romeu, a estreia pode abrir uma janela rara para aproximar o debate global de cinema da rotina cultural da cidade. Não é só um filme sobre um astro: é uma oportunidade de movimentar bilheteria, conversa pública e presença do cinema como programa urbano em Cruzeiro do Sul.",
      "Na escolha editorial do Catalogo, esta pauta merece vitrine porque transforma uma estreia internacional em assunto local palpável: programação, fila, comentário de plateia e movimento cultural no centro da cidade."
    ],
    highlights: [
      "Estreia internacional marcada para 24 de abril de 2026",
      "Direção de Antoine Fuqua e roteiro de John Logan",
      "Jaafar Jackson vive Michael na tela",
      "Cine Romeu entra no radar local para a exibição"
    ],
    development: [
      "Na leitura editorial, a importância do filme está em unir memória pop, indústria cultural e circuito exibidor ao mesmo tempo.",
      "O nome Michael Jackson ainda mobiliza gerações diferentes, da nostalgia do videoclipe ao público mais novo que conhece a obra por streaming e recortes virais.",
      "Em Cruzeiro do Sul, qualquer chegada do filme ao Cine Romeu merece cobertura própria, com foco em programação, procura do público e reação local à estreia."
    ]
  },
  "filme-bolsonaro-memes-reacao-redes": {
    id: "filme-bolsonaro-memes-reacao-redes",
    slug: "filme-bolsonaro-memes-reacao-redes",
    title: "Filme sobre Bolsonaro entra no radar com memes, ironias e gente bastante irritada nas redes",
    eyebrow: "humor e repercussao",
    date: "23 de abril de 2026",
    publishedAt: "2026-04-23T09:05:00-05:00",
    category: "Festas & Social",
    previewClass: "thumb-rede",
    sourceName: "Editorial Catalogo Cruzeiro do Sul",
    sourceUrl: "https://www.exibidor.com.br/filme/17429/a-colis%C3%A3o-dos-destinos.html",
    sourceLabel: "Artigo autoral do Catalogo com base em Exibidor, VEJA e repercussao publica do teaser de Dark Horse",
    imageUrl: "https://img.band.com.br/image/2026/04/08/dark-horse-e-o-novo-filme-sobre-jair-bolsonaro-91750.jpg",
    feedImageUrl: "https://img.band.com.br/image/2026/04/08/dark-horse-e-o-novo-filme-sobre-jair-bolsonaro-91750.jpg",
    sourceImageUrl: "https://img.band.com.br/image/2026/04/08/dark-horse-e-o-novo-filme-sobre-jair-bolsonaro-91750.jpg",
    imageCredit: "Crédito: Band / reprodução do cartaz oficial de Dark Horse",
    imageFocus: "center 22%",
    lede: "A Colisão dos Destinos tem estreia prevista para 14 de maio de 2026, enquanto Dark Horse segue cercado por repercussão online, e o tema já nasceu com um ingrediente inevitável: meme em alta voltagem.",
    summary: "Entre documentário, cinebiografia heroica e muito barulho em rede, o universo audiovisual ligado a Bolsonaro já está produzindo uma reação curiosa: apoiadores tentam vender épico, enquanto críticos transformam trailer, inglês torto e exagero promocional em material pronto para piada.",
    analysis: "A leitura autoral aqui é assumidamente leve: a internet brasileira não costuma desperdiçar uma oportunidade dessas. Quando o teaser vira piada por erros em inglês e ainda aparece cercado de controvérsia sobre trilha e tom grandioso, a narrativa escapa do controle da campanha e cai no território em que a web trabalha melhor: deboche, comparação e comentário atravessado.",
    body: [
      "O documentário A Colisão dos Destinos aparece na base do mercado exibidor com estreia prevista para 14 de maio de 2026. A proposta é narrar a trajetória de Jair Bolsonaro com depoimentos de familiares, aliados e nomes próximos do campo político bolsonarista.",
      "Paralelamente, a cinebiografia Dark Horse já vinha chamando atenção desde 2025 por tentar embalar a campanha de 2018 em chave épica. O problema para os produtores é que a internet brasileira raramente aceita esse tipo de embalagem sem abrir a caixa, rir do laço e postar print.",
      "Parte da reação online foi puxada pelo teaser que virou alvo de piadas por erros em inglês. Veículos como VEJA e Farol da Bahia registraram que o vídeo foi recebido com chacota, inclusive por frases promocionais mal escritas, como se o próprio trailer tivesse pedido revisão no grupo da família e ninguém tivesse visto a tempo.",
      "Outro combustível para o humor foi a notícia de que o teaser de Dark Horse incomodou a equipe de Beyoncé por uso indevido de música. A combinação de grandiloquência, polêmica e acabamento questionado deu ao debate um tom quase inevitável: metade disputa política, metade roteiro involuntário de comédia de internet.",
      "No fim, o mais interessante não é só o filme em si, mas o efeito colateral. Há gente furiosa porque o projeto tenta heroicizar demais. Há gente furiosa porque achou o material tecnicamente fraco. E há uma multidão apenas se divertindo com o fato de que, no Brasil, até trailer político corre o risco de estrear primeiro como meme.",
      "Na leitura do Catalogo, o valor desta pauta está menos em defender ou atacar o projeto e mais em mostrar como a internet brasileira pega um material de pretensão épica e o redistribui como comédia política em tempo real."
    ],
    highlights: [
      "A Colisão dos Destinos está listado para 14 de maio de 2026",
      "Dark Horse já apanhou nas redes por erros em inglês no teaser",
      "Repercussão também passou por polêmica com trilha atribuída a Beyoncé",
      "Tema chegou ao debate público em tom de meme e irritação"
    ],
    development: [
      "O diferencial editorial aqui é tratar a repercussão como fenômeno de linguagem de internet, e não só como pauta partidária.",
      "Quando um projeto tenta nascer como épico e desembarca como print compartilhável, a web brasileira rapidamente muda o gênero do filme sem pedir autorização.",
      "Se surgirem novos trailers, vale acompanhar menos a propaganda oficial e mais o que o público faz com ela, porque é aí que a história realmente ganha tração."
    ]
  }
};

const normalizeSlug = (value) => {
  let raw = String(value || "").trim();

  try {
    raw = decodeURIComponent(raw);
  } catch (_error) {
    // URLSearchParams already decodes values in modern browsers.
  }

  return raw
    .split(/[?#&\s]/)[0]
    .replace(/^\/+|\/+$/g, "")
    .replace(/[_\s]+/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();
};

const getSlugFromLocation = () => {
  const fromQuery = params.get("slug") || params.get("id");
  if (fromQuery) {
    return normalizeSlug(fromQuery);
  }

  const fromHash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  return normalizeSlug(fromHash.get("slug") || fromHash.get("id"));
};

const slug = getSlugFromLocation();

if (document.body) {
  document.body.classList.add("site-loaded");
}

try {
  sessionStorage.setItem(SKIP_HOME_INTRO_KEY, "1");
} catch (_error) {
  // Ignora ambientes sem sessionStorage.
}

const titleNode = document.querySelector("#detail-title");
const eyebrowNode = document.querySelector("#detail-eyebrow");
const metaNode = document.querySelector("#detail-meta");
const thumbNode = document.querySelector("#detail-thumb");
const categoryNode = document.querySelector("#detail-category");
const ledeNode = document.querySelector("#detail-lede");
const contentNode = document.querySelector("#detail-content");
const sourceNameNode = document.querySelector("#detail-source-name");
const sourceLabelNode = document.querySelector("#detail-source-label");
const sourceLinkNode = document.querySelector("#detail-source-link");
const mediaKindNode = document.querySelector("#detail-media-kind");
const mediaNoteNode = document.querySelector("#detail-media-note");
const mediaLinkNode = document.querySelector("#detail-media-link");
const highlightsNode = document.querySelector("#detail-highlights");
const analysisContainer = document.querySelector("#detail-analysis-container");
const analysisText = document.querySelector("#detail-analysis");
const factTabsSection = document.querySelector("#detail-fact-tabs");
const factTabsListNode = document.querySelector("#detail-fact-tabs-list");
const factTabsPanelsNode = document.querySelector("#detail-fact-tabs-panels");
const metaDescriptionNode = document.querySelector("#meta-description");
const metaRobotsNode = document.querySelector("#meta-robots");
const canonicalNode = document.querySelector("#meta-canonical");
const ogTitleNode = document.querySelector("#og-title");
const ogDescriptionNode = document.querySelector("#og-description");
const ogImageNode = document.querySelector("#og-image");
const ogUrlNode = document.querySelector("#og-url");
const twitterTitleNode = document.querySelector("#twitter-title");
const twitterDescriptionNode = document.querySelector("#twitter-description");
const twitterImageNode = document.querySelector("#twitter-image");
const structuredDataNode = document.querySelector("#article-structured-data");
let detailHeroRequestId = 0;
const DEFAULT_OG_IMAGE = "./assets/og-cover.svg";

const detailImageFocusOverridesBySlug = {
  "stf-decide-que-piso-nacional-deve-ser-pago-a-professores-temporarios": "62% 12%",
  "governo-avanca-na-regularizacao-fundiaria-e-conclui-primeira-etapa-do-programa-em-assis-brasil":
    "74% 32%",
  "acre-disputa-campeonato-regional-de-bocha-com-14-paratletas": "78% 43%",
  "jordao-celebra-34-anos-com-show-de-evoney-fernandes": "40% 38%",
  "com-presenca-da-familia-mario-sergio-toma-posse-no-tribunal-de-contas-do-acre": "58% 42%",
  "academia-acreana-de-letras-reune-mulheres-de-poder-em-primeira-roda-de-conversa-de-2026":
    "30% 58%",
  "socorro-propoe-jornada-especial-para-professores-em-tratamento-de-saude": "49% 26%",
  "prefeito-decreta-emergencia-e-anuncia-auxilio-a-familias-atingidas-por-enxurradas": "78% 38%",
  "traficante-foge-da-policia-e-deixa-esposa-com-bebe-recem-nascido-para-ser-presa": "58% 68%",
  "fundhacre-recebe-treinamento-da-fiocruz-para-diagnostico-molecular-de-leishmaniose": "78% 30%",
  "fundhacre-realiza-quinto-transplante-de-tecido-osseo-e-amplia-oferta-de-alta-complexidade-no-acre":
    "45% 22%",
  "acre-alcanca-o-segundo-lugar-no-ranking-nacional-de-matriculas-de-ensino-tecnico-articulado-com-o-ensino-medio":
    "38% 26%",
  "governo-do-acre-capacita-orgaos-do-executivo-estadual-sobre-planos-de-integridade": "60% 40%",
  "governo-do-acre-amplia-acesso-a-identidade-para-indigenas-com-acao-da-policia-civil-na-casai":
    "58% 16%"
};

const resolveDetailImageFocus = (article = {}, fallback = "center 30%") => {
  const direct = String(article.imageFocus || "").trim();
  if (direct) {
    return direct;
  }

  const articleSlug = normalizeSlug(article.slug || "");
  return detailImageFocusOverridesBySlug[articleSlug] || fallback;
};

const truncateSeoText = (value, limit = 180) => {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  if (!text) return "";
  if (text.length <= limit) return text;
  return `${text.slice(0, Math.max(0, limit - 3)).trim()}...`;
};

const toAbsoluteUrl = (value) => {
  const raw = String(value || "").trim();
  if (!raw) return "";

  try {
    return new URL(raw, window.location.href).href;
  } catch (_error) {
    return raw;
  }
};

const updateArticleSeo = (article, options = {}) => {
  const indexable = options.indexable !== false;
  const pageTitle = article?.title
    ? `Catalogo Cruzeiro do Sul | ${article.title}`
    : "Catalogo Cruzeiro do Sul | Noticia";
  const description = truncateSeoText(
    article?.lede ||
      article?.summary ||
      article?.analysis ||
      "Pagina interna do Catalogo Cruzeiro do Sul com resumo editorial, contexto e link para a fonte consultada."
  );
  const canonicalHref = article?.slug
    ? toAbsoluteUrl(`./noticia.html?slug=${encodeURIComponent(article.slug)}`)
    : toAbsoluteUrl("./noticia.html");
  const imageHref = toAbsoluteUrl(
    article?.imageUrl || article?.feedImageUrl || article?.sourceImageUrl || DEFAULT_OG_IMAGE
  );

  document.title = pageTitle;

  if (metaDescriptionNode) {
    metaDescriptionNode.setAttribute("content", description);
  }

  if (metaRobotsNode) {
    metaRobotsNode.setAttribute(
      "content",
      indexable ? "index,follow,max-image-preview:large" : "noindex,nofollow"
    );
  }

  if (canonicalNode) {
    canonicalNode.setAttribute("href", canonicalHref);
  }

  [
    [ogTitleNode, pageTitle],
    [twitterTitleNode, pageTitle],
    [ogDescriptionNode, description],
    [twitterDescriptionNode, description],
    [ogImageNode, imageHref],
    [twitterImageNode, imageHref],
    [ogUrlNode, canonicalHref]
  ].forEach(([node, value]) => {
    if (node) {
      node.setAttribute("content", value);
    }
  });

  if (structuredDataNode) {
    const payload = {
      "@context": "https://schema.org",
      "@type": indexable ? "NewsArticle" : "WebPage",
      headline: article?.title || "Catalogo Cruzeiro do Sul",
      description,
      image: [imageHref],
      url: canonicalHref,
      mainEntityOfPage: canonicalHref,
      datePublished: article?.publishedAt || article?.date || new Date().toISOString(),
      dateModified: article?.publishedAt || article?.date || new Date().toISOString(),
      articleSection: article?.category || "Noticia",
      publisher: {
        "@type": "NewsMediaOrganization",
        name: "Catalogo Cruzeiro do Sul",
        logo: {
          "@type": "ImageObject",
          url: toAbsoluteUrl("./assets/favicon-512x512.png")
        }
      }
    };

    if (article?.sourceName) {
      payload.author = {
        "@type": "Organization",
        name: article.sourceName
      };
    }

    structuredDataNode.textContent = JSON.stringify(payload);
  }
};

const resolveApiBases = () => {
  const bases = [];
  const addBase = (value, allowEmpty = false) => {
    const normalized = String(value ?? "").replace(/\/$/, "");
    if (!normalized && !allowEmpty) {
      return;
    }
    if (!bases.includes(normalized)) {
      bases.push(normalized);
    }
  };
  const configured =
    typeof window.CATALOGO_API_BASE === "string" && window.CATALOGO_API_BASE
      ? window.CATALOGO_API_BASE
      : "";

  if (window.location.protocol.startsWith("http")) {
    addBase(configured || "", true);
    return bases;
  }

  addBase("http://localhost:3000");
  if (configured) {
    addBase(configured);
  }
  addBase("http://localhost:8787");
  return bases;
};

const applyMediaBadge = (node, media) => {
  if (!node || !media || !media.badge) {
    return;
  }

  const badge = document.createElement("span");
  badge.className = "thumb-media-badge";
  badge.textContent = media.badge;
  node.appendChild(badge);
};

const resetDetailThumb = () => {
  if (!thumbNode) {
    return;
  }

  thumbNode.className = "detail-hero-thumb";
  thumbNode.removeAttribute("data-top-image");
  thumbNode.style.removeProperty("--bg-image");
  thumbNode.style.removeProperty("--bg-position");
  thumbNode.style.removeProperty("--bg-size");
  thumbNode.style.removeProperty("--hero-image-position");
  thumbNode.style.removeProperty("backgroundImage");
  thumbNode.style.removeProperty("backgroundPosition");
  thumbNode.style.removeProperty("backgroundSize");
  thumbNode.style.removeProperty("backgroundRepeat");
  thumbNode.style.removeProperty("backgroundColor");
  thumbNode.querySelector(".detail-hero-media")?.remove();
  thumbNode.querySelectorAll(".thumb-media-badge").forEach((node) => node.remove());
};

const normalizeParagraph = (value) =>
  String(value || "")
    .replace(/\s+/g, " ")
    .trim();

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

const stripFeedArtifacts = (value = "") =>
  String(value || "")
    .replace(/\bdata-[a-z-]+\s*=\s*["'][^"']*["']/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/https?:\/\/[^\s"']+/gi, " ")
    .replace(/\[\s*\.{3}\s*\]/g, " ")
    .replace(/The post .*? appeared first on .*?(?:\.|$)/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

const stripLeadingMediaCredit = (value = "") => {
  const raw = String(value || "").trim();
  const match = raw.match(
    /^(?:foto|imagem|reprodução|reproducao|arquivo|vídeo|video)\s*:[^.!?]{0,220}\s(?=(?:o|a|os|as|um|uma|em|no|na|nos|nas|neste|nesta|após|apos|depois|para|com)\b)/i
  );
  return match ? raw.slice(match[0].length).trim() : raw;
};

const normalizeEditorialText = (value = "") =>
  normalizeParagraph(stripLeadingMediaCredit(stripFeedArtifacts(decodeBasicEntities(value))));

const dedupeTextList = (values = []) =>
  [
    ...new Set(
      (Array.isArray(values) ? values : [values])
        .map((value) => normalizeEditorialText(value))
        .filter(Boolean)
    )
  ];

const normalizeMarkerText = (value = "") =>
  decodeBasicEntities(String(value || ""))
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const splitIntoSentences = (value = "") => {
  const cleaned = normalizeEditorialText(value);
  if (!cleaned) {
    return [];
  }

  return (cleaned.match(/[^.!?]+[.!?]?/g) || [])
    .map((sentence) => normalizeParagraph(sentence))
    .filter((sentence) => sentence.length > 18);
};

const getArticleDateLabel = (article = {}) => {
  const directDate = normalizeEditorialText(article.date || "");
  if (directDate) {
    return directDate;
  }

  if (!article.publishedAt) {
    return "data recente";
  }

  try {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "America/Rio_Branco"
    }).format(new Date(article.publishedAt));
  } catch (_error) {
    return "data recente";
  }
};

const UNCERTAINTY_MARKERS = [
  "pode estar",
  "pode ser",
  "podera",
  "poderiam",
  "poderia",
  "cogitada",
  "cogitado",
  "sondada",
  "sondado",
  "suspeito",
  "suspeita",
  "investiga",
  "investigado",
  "investigada",
  "alega",
  "alegou",
  "suposto",
  "suposta",
  "possivel",
  "previsao",
  "estimativa",
  "projecao",
  "devera",
  "tendencia",
  "expectativa",
  "indicio",
  "indicios"
];

const FAKE_NEWS_MARKERS = [
  "fake news",
  "boato",
  "boatos",
  "desmentiu",
  "desmentido",
  "nao procede",
  "informacao falsa",
  "informacoes falsas",
  "enganoso",
  "enganosa",
  "mentira"
];

const textHasMarker = (value = "", markers = []) => {
  const normalized = normalizeMarkerText(value);
  return markers.some((marker) => normalized.includes(marker));
};

const getArticleSentencePool = (article = {}) =>
  [
    article.title,
    article.sourceLabel,
    article.lede,
    article.summary,
    article.analysis,
    ...(Array.isArray(article.body) ? article.body : []),
    ...(Array.isArray(article.highlights) ? article.highlights : [])
  ]
    .flatMap((value) => splitIntoSentences(value))
    .filter(Boolean)
    .filter((value, index, list) => list.indexOf(value) === index);

const getLimitedItems = (values = [], limit = 4) => dedupeTextList(values).slice(0, limit);

const getFactCheckVerdict = ({
  sourceName = "fonte consultada",
  dateLabel = "data recente",
  truthCount = 0,
  uncertaintyCount = 0,
  fakeCount = 0,
  title = "este assunto"
} = {}) => {
  if (fakeCount > 0) {
    return {
      tone: "fake",
      label: "Resultado da checagem",
      shortLabel: "desmentido no material",
      stateLabel: "Boato identificado",
      count: 1,
      description:
        "O cruzamento do texto-base encontrou desmentido explícito ou menção direta a boato/fake news.",
      items: [
        `Resultado editorial: há sinal claro de boato ou informação falsa associado a ${title}.`,
        `Base usada no veredito: texto publicado por ${sourceName} em ${dateLabel}.`,
        "Leitura final: trate os trechos marcados como desmentidos, não como fato confirmado."
      ]
    };
  }

  if (uncertaintyCount > 0 && truthCount === 0) {
    return {
      tone: "uncertainty",
      label: "Resultado da checagem",
      shortLabel: "sem base fechada",
      stateLabel: "Inconclusivo",
      count: 1,
      description:
        "O material consultado não traz base suficiente para fechar um veredito como fato consolidado.",
      items: [
        `Resultado editorial: não dá para classificar ${title} como fake news, mas também não dá para cravar como fato fechado só com este material.`,
        `Base usada no veredito: texto publicado por ${sourceName} em ${dateLabel}.`,
        "Leitura final: o assunto segue inconclusivo e pede confirmação adicional antes de virar certeza."
      ]
    };
  }

  if (uncertaintyCount > 0) {
    return {
      tone: "uncertainty",
      label: "Resultado da checagem",
      shortLabel: "sem sinal de fake news",
      stateLabel: "Confirmado com ressalvas",
      count: 1,
      description:
        "Há base real no texto consultado, mas alguns pontos ainda dependem de atualização ou confirmação complementar.",
      items: [
        `Resultado editorial: não há sinal de fake news no texto-base sobre ${title}.`,
        `Base usada no veredito: texto publicado por ${sourceName} em ${dateLabel}.`,
        "Leitura final: a notícia é tratada como válida, com ressalvas apenas nos pontos ainda sem fechamento total."
      ]
    };
  }

  return {
    tone: "truth",
    label: "Resultado da checagem",
    shortLabel: "sem sinal de fake news",
    stateLabel: "Confirmado",
    count: 1,
    description:
      "O texto-base sustenta a leitura sem sinal de boato ou desmentido explícito no material consultado.",
    items: [
      `Resultado editorial: ${title} não aparece como fake news no material analisado.`,
      `Base usada no veredito: publicação de ${sourceName} em ${dateLabel}.`,
      "Leitura final: o que está no texto-base pode ser tratado como conteúdo confirmado na fonte consultada."
    ]
  };
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

const unwrapProxyImageUrl = (value) => {
  const raw = String(value || "").trim();
  if (!raw || !/images\.weserv\.nl/i.test(raw)) {
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

const extractImageUrlFromText = (value) => {
  const raw = decodeBasicEntities(value).replace(/\\(["'])/g, "$1");
  if (!raw) {
    return "";
  }

  const directPatterns = [
    /data-full-file\s*=\s*["']([^"']+)["']/i,
    /data-large-file\s*=\s*["']([^"']+)["']/i,
    /data-medium-file\s*=\s*["']([^"']+)["']/i,
    /data-original\s*=\s*["']([^"']+)["']/i,
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
    article.feedImageUrl,
    article.imageUrl,
    article.image,
    article.sourceImageUrl,
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

const isIllustrativeImage = (article = {}, candidate = "") => {
  const imageUrl = String(candidate || article.imageUrl || "").toLowerCase();
  const credit = String(article.imageCredit || "").toLowerCase();
  if (/images\.unsplash\.com/i.test(imageUrl)) return true;
  if (credit.includes("ilustrativa")) return true;
  return false;
};

const normalizeDetailArticle = (article = {}) => {
  const inlineImageUrl = extractInlineArticleImage(article);
  const canonicalFeedImage =
    article.feedImageUrl || article.imageUrl || article.image || inlineImageUrl || "";
  const canonicalSourceImage = article.sourceImageUrl || "";
  const canonicalImage =
    canonicalFeedImage || inlineImageUrl || canonicalSourceImage || article.image || "";

  return {
    ...article,
    feedImageUrl: canonicalFeedImage,
    imageUrl: canonicalImage,
    sourceImageUrl: canonicalSourceImage
  };
};

const pushUniqueImageCandidate = (bucket, value) => {
  const normalized = String(value || "").trim();
  if (!normalized || bucket.includes(normalized)) {
    return;
  }

  bucket.push(normalized);
};

const buildImageLoadCandidates = (values = []) => {
  const items = Array.isArray(values) ? values : [values];
  const candidates = [];

  items.forEach((value) => {
    const raw = String(value || "").trim();
    if (!raw) {
      return;
    }

    const directUrl = raw.replace(/'/g, "%27");
    const proxiedUrl = sanitizeImageUrl(directUrl);
    pushUniqueImageCandidate(candidates, directUrl);
    pushUniqueImageCandidate(candidates, proxiedUrl);
  });

  return candidates;
};

const getUniqueItems = (values = []) =>
  [...new Set(values.map((value) => String(value || "").trim()).filter(Boolean))];

const looksLikeImageAsset = (value) => {
  const raw = String(value || "").trim();
  if (!raw) {
    return false;
  }

  if (/^data:image\//i.test(raw)) {
    return true;
  }

  if (/wikimedia\.org\/wiki\/Special:FilePath\//i.test(raw)) {
    return true;
  }

  return /^https?:\/\/.+\.(avif|webp|png|jpe?g|gif|bmp|svg)(\?.*)?$/i.test(raw);
};

const ensureDetailHeroMediaNode = () => {
  if (!thumbNode) {
    return null;
  }

  let mediaNode = thumbNode.querySelector(".detail-hero-media");
  if (mediaNode) {
    return mediaNode;
  }

  mediaNode = document.createElement("img");
  mediaNode.className = "detail-hero-media";
  mediaNode.alt = "";
  mediaNode.decoding = "async";
  mediaNode.loading = "eager";
  thumbNode.insertBefore(mediaNode, thumbNode.firstChild || null);
  return mediaNode;
};

const preloadHeroImage = (url) =>
  new Promise((resolve) => {
    const testImage = new Image();
    let settled = false;
    const timeoutId = window.setTimeout(() => {
      if (settled) return;
      settled = true;
      resolve("");
    }, 4200);

    const finish = (value) => {
      if (settled) {
        return;
      }

      settled = true;
      window.clearTimeout(timeoutId);
      resolve(value);
    };

    testImage.onload = () => finish(url);
    testImage.onerror = () => finish("");
    testImage.src = url;
  });

const resolveFirstAvailableHeroImage = async (candidates = []) => {
  for (const candidate of candidates) {
    const resolved = await preloadHeroImage(candidate);
    if (resolved) {
      return resolved;
    }
  }

  return "";
};

const getDetailHeroCandidates = (article = {}) =>
  buildImageLoadCandidates(
    getUniqueItems([
      article.imageUrl,
      article.feedImageUrl,
      extractInlineArticleImage(article),
      looksLikeImageAsset(article.media?.imageUrl) ? article.media.imageUrl : "",
      looksLikeImageAsset(article.media?.url) ? article.media.url : "",
      article.sourceImageUrl,
      looksLikeImageAsset(article.media?.creditUrl) ? article.media.creditUrl : ""
    ]).filter((candidate, index, list) => {
      const fingerprint = getImageFingerprint(candidate);
      if (!fingerprint) {
        return true;
      }

      return list.findIndex((value) => getImageFingerprint(value) === fingerprint) === index;
    })
  ).filter((candidate) => !isIllustrativeImage(article, candidate));

const fetchSourceHeroImage = async (sourceUrl) => {
  const cleanUrl = String(sourceUrl || "").trim();
  if (!cleanUrl || cleanUrl === "#") return "";
  const bases = resolveApiBases();

  for (const base of bases) {
    const apiBase = base || "";
    try {
      const response = await fetch(
        `${apiBase}/api/preview-image?url=${encodeURIComponent(cleanUrl)}`
      );
      if (!response.ok) continue;
      const payload = await response.json();
      const imageUrl = await resolveFirstAvailableHeroImage(
        buildImageLoadCandidates(payload?.imageUrl || "")
      );
      if (imageUrl) return imageUrl;
    } catch (_error) {
      // tenta proxima base
    }
  }

  return "";
};

const applyResolvedDetailHeroImage = (imageUrl, article = {}) => {
  if (!thumbNode) {
    return;
  }

  const mediaNode = ensureDetailHeroMediaNode();
  if (!mediaNode) {
    return;
  }

  const normalizedImageUrl = sanitizeImageUrl(imageUrl);
  const backgroundPosition = resolveDetailImageFocus(article);
  const backgroundSize = String(article.imageFit || "cover").trim() || "cover";

  thumbNode.classList.remove("no-image");
  thumbNode.classList.add("has-image", "has-photo", "has-inline-media");
  thumbNode.dataset.topImage = "resolved";
  thumbNode.style.setProperty("--bg-image", `url('${normalizedImageUrl}')`);
  thumbNode.style.setProperty("--bg-position", backgroundPosition);
  thumbNode.style.setProperty("--bg-size", backgroundSize);
  thumbNode.style.setProperty("--hero-image-position", backgroundPosition);
  thumbNode.style.backgroundImage = `linear-gradient(180deg, rgba(8, 16, 29, 0.08) 0%, rgba(8, 16, 29, 0.28) 100%), url('${normalizedImageUrl}')`;
  thumbNode.style.backgroundPosition = `center, ${backgroundPosition}`;
  thumbNode.style.backgroundSize = `cover, ${backgroundSize}`;
  thumbNode.style.backgroundRepeat = "no-repeat";
  thumbNode.style.backgroundColor = "#102742";

  mediaNode.src = normalizedImageUrl;
  mediaNode.alt = article.title
    ? `Imagem principal da matéria: ${article.title}`
    : "Imagem principal da matéria";
  mediaNode.classList.toggle("is-contain", backgroundSize === "contain");
};

const applyDetailHeroImage = async (article = {}) => {
  if (!thumbNode) {
    return;
  }

  const requestId = ++detailHeroRequestId;
  const mediaNode = ensureDetailHeroMediaNode();
  const candidates = getDetailHeroCandidates(article);

  if (!mediaNode || !candidates.length) {
    thumbNode.classList.add("no-image");
    return;
  }

  thumbNode.dataset.topImage = "pending";
  const resolvedImageUrl = await resolveFirstAvailableHeroImage(candidates);

  if (requestId !== detailHeroRequestId) {
    return;
  }

  if (!resolvedImageUrl) {
    const previewImage = await fetchSourceHeroImage(article.sourceUrl);
    if (!previewImage) {
      thumbNode.classList.remove("has-inline-media");
      thumbNode.classList.add("no-image");
      thumbNode.removeAttribute("data-top-image");
      mediaNode.remove();
      return;
    }
    applyResolvedDetailHeroImage(previewImage, article);
    return;
  }

  applyResolvedDetailHeroImage(resolvedImageUrl, article);
};

const getExpandedBodyParagraphs = (article) => {
  const baseParagraphs = Array.isArray(article.body)
    ? article.body.map(normalizeEditorialText).filter(Boolean)
    : [];
  const fallbackLede = normalizeEditorialText(article.lede || article.summary || "");
  const source = normalizeEditorialText(article.sourceName || "fonte local");
  const sourceLabel = normalizeEditorialText(article.sourceLabel || article.title || "");
  const category = normalizeEditorialText(article.category || "tema local").toLowerCase();
  const dateLabel = getArticleDateLabel(article);
  const highlights = Array.isArray(article.highlights)
    ? article.highlights.map(normalizeEditorialText).filter(Boolean)
    : [];

  const highlightSentence = highlights.length > 0 ? highlights.join(", ") : "atualizacao do assunto";
  const analysisSentence = normalizeEditorialText(article.analysis || "");

  const generated = [
    fallbackLede
      ? `No recorte do Catalogo Cruzeiro do Sul, esta noticia entra em uma leitura de ${category}, com impacto direto no dia a dia da cidade e no servico publico local. ${fallbackLede}`
      : `No recorte do Catalogo Cruzeiro do Sul, esta noticia entra em uma leitura de ${category}, com impacto direto no dia a dia da cidade e no servico publico local.`,
    `Em ${dateLabel}, a fonte ${source} destacou o seguinte eixo principal: ${sourceLabel}. A repercussao local costuma ir alem do fato inicial e atinge rotas de trabalho, atendimento e rotina dos bairros.`,
    `Os pontos mais observados nesta cobertura sao: ${highlightSentence}. Esse conjunto ajuda a entender o que ja aconteceu e o que ainda pode evoluir nos proximos dias.`,
    analysisSentence
      ? `Contexto complementar: ${analysisSentence}`
      : "Contexto complementar: a tendencia local depende da resposta institucional, do acompanhamento comunitario e de nova atualizacao da fonte original.",
    "Para continuar bem informado, vale acompanhar o link da fonte consultada e as proximas atualizacoes do Catalogo, especialmente quando houver mudanca de status, novos numeros ou decisao oficial."
  ].filter(Boolean);

  const merged = [...baseParagraphs];
  while (merged.length < 5 && generated.length > 0) {
    merged.push(generated.shift());
  }

  if (merged.length === 0) {
    return generated.slice(0, 5);
  }

  return merged;
};

const buildEditorialFactTabs = (article = {}) => {
  const sourceName = normalizeEditorialText(article.sourceName || "fonte local");
  const sourceLabel = normalizeEditorialText(article.sourceLabel || article.title || "texto-base consultado");
  const title = normalizeEditorialText(article.title || sourceLabel || "este assunto");
  const category = normalizeEditorialText(article.category || "tema local");
  const categoryLower = category.toLowerCase();
  const dateLabel = getArticleDateLabel(article);
  const cleanAnalysis = normalizeEditorialText(article.analysis || "");
  const cleanHighlights = dedupeTextList(article.highlights || []);
  const sentences = getArticleSentencePool(article);
  const leadSentence =
    splitIntoSentences(article.lede || article.summary || article.title || "")[0] || title;
  const truthSentences = sentences.filter(
    (sentence) =>
      !textHasMarker(sentence, UNCERTAINTY_MARKERS) && !textHasMarker(sentence, FAKE_NEWS_MARKERS)
  );
  const uncertaintySentences = sentences.filter(
    (sentence) =>
      textHasMarker(sentence, UNCERTAINTY_MARKERS) && !textHasMarker(sentence, FAKE_NEWS_MARKERS)
  );
  const fakeSentences = sentences.filter((sentence) => textHasMarker(sentence, FAKE_NEWS_MARKERS));

  const importanceItems = getLimitedItems(
    [
      ...cleanHighlights,
      leadSentence,
      cleanAnalysis,
      sourceLabel && sourceLabel !== title ? `O eixo central da noticia é: ${sourceLabel}.` : "",
      `O impacto imediato desta matéria cai sobre ${categoryLower} e pede atenção para os efeitos práticos no dia a dia.`
    ],
    4
  );

  const truthItems = getLimitedItems(
    [
      ...truthSentences.slice(0, 3),
      `Está confirmado que a noticia-base foi publicada por ${sourceName} em ${dateLabel}.`,
      sourceLabel ? `A referência aberta consultada foi: ${sourceLabel}.` : ""
    ],
    4
  );

  const uncertaintyItems = getLimitedItems(
    [
      ...uncertaintySentences.slice(0, 3),
      textHasMarker(title, UNCERTAINTY_MARKERS) ? title : ""
    ],
    4
  );

  const fakeItems = getLimitedItems(fakeSentences.slice(0, 3), 3);
  const verdictTab = getFactCheckVerdict({
    sourceName,
    dateLabel,
    truthCount: truthItems.length,
    uncertaintyCount: uncertaintySentences.length,
    fakeCount: fakeSentences.length,
    title
  });

  return [
    {
      id: "verdict",
      ...verdictTab
    },
    {
      id: "truth",
      label: "Fatos confirmados",
      shortLabel: "base confirmada",
      tone: "truth",
      stateLabel: "Confirmado",
      count: truthItems.length > 0 ? truthItems.length : 1,
      description: `Aqui entram apenas os pontos que o texto-base sustenta com clareza na fonte ${sourceName}.`,
      items:
        truthItems.length > 0
          ? truthItems
          : [`O que está confirmado até aqui é a existência da publicação original e o tema ${title}.`]
    },
    {
      id: "importance",
      label: "O que importa agora",
      shortLabel: "impacto imediato",
      tone: "importance",
      stateLabel: "Essencial agora",
      count: importanceItems.length > 0 ? importanceItems.length : 1,
      description: `Leitura rápida do que realmente mexe com o leitor neste assunto de ${categoryLower}.`,
      items:
        importanceItems.length > 0
          ? importanceItems
          : [`O eixo principal deste assunto é ${title} e o acompanhamento segue aberto.`]
    },
    {
      id: "uncertainty",
      label: "O que ainda não foi comprovado",
      shortLabel: "sem fechamento total",
      tone: "uncertainty",
      stateLabel: "Inconclusivo",
      count: uncertaintySentences.length,
      description: "Pontos que ainda não fecham prova completa dentro do material consultado.",
      items:
        uncertaintyItems.length > 0
          ? uncertaintyItems
          : [
              "O material consultado não deixou ponto relevante sem comprovação fechada."
            ]
    },
    {
      id: "fake",
      label: "Boato ou fake news",
      shortLabel: "desmentido explícito",
      tone: "fake",
      stateLabel: "Desmentido",
      count: fakeSentences.length,
      description: "Só entra aqui o que o próprio material marca de forma explícita como boato ou informação falsa.",
      items:
        fakeItems.length > 0
          ? fakeItems
          : ["Resultado: o texto-base não traz boato ou fake news desmentida de forma explícita."]
    }
  ];
};

const clearFactTabs = () => {
  if (!factTabsSection || !factTabsListNode || !factTabsPanelsNode) {
    return;
  }

  factTabsListNode.innerHTML = "";
  factTabsPanelsNode.innerHTML = "";
  factTabsSection.hidden = true;
  factTabsSection.classList.remove("active");
};

const renderFactTabs = (article = {}) => {
  if (!factTabsSection || !factTabsListNode || !factTabsPanelsNode) {
    return [];
  }

  const tabs = buildEditorialFactTabs(article);
  factTabsListNode.innerHTML = "";
  factTabsPanelsNode.innerHTML = "";

  const activateTab = (tabId) => {
    const buttons = [...factTabsListNode.querySelectorAll('[role="tab"]')];
    const panels = [...factTabsPanelsNode.querySelectorAll('[role="tabpanel"]')];

    buttons.forEach((button) => {
      const isActive = button.dataset.tabId === tabId;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-selected", isActive ? "true" : "false");
      button.tabIndex = isActive ? 0 : -1;
    });

    panels.forEach((panel) => {
      const isActive = panel.dataset.tabId === tabId;
      panel.hidden = !isActive;
      panel.classList.toggle("is-active", isActive);
    });
  };

  tabs.forEach((tab, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `detail-fact-tab-button tone-${tab.tone}`;
    button.id = `detail-fact-tab-${tab.id}`;
    button.dataset.tabId = tab.id;
    button.setAttribute("role", "tab");
    button.setAttribute("aria-controls", `detail-fact-panel-${tab.id}`);
    button.setAttribute("aria-selected", index === 0 ? "true" : "false");
    button.tabIndex = index === 0 ? 0 : -1;

    const buttonLabel = document.createElement("strong");
    buttonLabel.textContent = tab.label;
    const buttonHelp = document.createElement("small");
    buttonHelp.textContent = tab.shortLabel;
    const buttonCount = document.createElement("span");
    buttonCount.className = "detail-fact-tab-count";
    buttonCount.classList.toggle("is-empty", Number(tab.count || 0) === 0);
    buttonCount.textContent = String(tab.count ?? tab.items.length);

    button.append(buttonLabel, buttonHelp, buttonCount);
    button.addEventListener("click", () => activateTab(tab.id));
    button.addEventListener("keydown", (event) => {
      const buttons = [...factTabsListNode.querySelectorAll('[role="tab"]')];
      const currentIndex = buttons.findIndex((item) => item.dataset.tabId === tab.id);

      if (event.key === "ArrowRight") {
        event.preventDefault();
        const next = buttons[(currentIndex + 1) % buttons.length];
        activateTab(next.dataset.tabId);
        next.focus();
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        const next = buttons[(currentIndex - 1 + buttons.length) % buttons.length];
        activateTab(next.dataset.tabId);
        next.focus();
      }

      if (event.key === "Home") {
        event.preventDefault();
        activateTab(buttons[0].dataset.tabId);
        buttons[0].focus();
      }

      if (event.key === "End") {
        event.preventDefault();
        activateTab(buttons[buttons.length - 1].dataset.tabId);
        buttons[buttons.length - 1].focus();
      }
    });
    factTabsListNode.appendChild(button);

    const panel = document.createElement("section");
    panel.className = `detail-fact-panel tone-${tab.tone}`;
    panel.id = `detail-fact-panel-${tab.id}`;
    panel.dataset.tabId = tab.id;
    panel.setAttribute("role", "tabpanel");
    panel.setAttribute("aria-labelledby", button.id);
    panel.hidden = index !== 0;

    const badge = document.createElement("span");
    badge.className = `detail-fact-panel-badge tone-${tab.tone}`;
    badge.textContent = tab.stateLabel;

    const title = document.createElement("h3");
    title.textContent = tab.label;

    const description = document.createElement("p");
    description.className = "detail-fact-panel-note";
    description.textContent = tab.description;

    const list = document.createElement("ul");
    tab.items.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      list.appendChild(li);
    });

    panel.append(badge, title, description, list);
    factTabsPanelsNode.appendChild(panel);
  });

  factTabsSection.hidden = false;
  factTabsSection.classList.add("active");
  activateTab(tabs[0]?.id || "importance");
  return tabs;
};

const renderNotFound = () => {
  updateArticleSeo(null, { indexable: false });
  titleNode.textContent = "Noticia nao encontrada";
  eyebrowNode.textContent = "catalogo cruzeiro do sul";
  metaNode.textContent = "O link pode estar incompleto ou a noticia ainda nao foi cadastrada.";
  ledeNode.textContent = "Volte para a home e escolha outra noticia.";
  clearFactTabs();
  if (analysisContainer) {
    analysisContainer.hidden = true;
    analysisContainer.classList.remove("active");
  }
  sourceLinkNode.href = HOME_RETURN_URL;
  sourceLinkNode.removeAttribute("target");
  sourceLinkNode.removeAttribute("rel");
  sourceLinkNode.textContent = "Voltar para a home";

  if (mediaKindNode && mediaNoteNode && mediaLinkNode) {
    mediaKindNode.textContent = "Foto real";
    mediaNoteNode.textContent = "Esta capa e um apoio visual da pagina de leitura.";
    mediaLinkNode.href = HOME_RETURN_URL;
    mediaLinkNode.removeAttribute("target");
    mediaLinkNode.removeAttribute("rel");
    mediaLinkNode.textContent = "Voltar para a home";
  }
};

const renderArticle = (article) => {
  if (!article) {
    renderNotFound();
    return;
  }

  article = normalizeDetailArticle(article);

  window.currentArticle = article;
  window.__CURRENT_ARTICLE__ = article;
  window.__ARTICLE__ = article;

  updateArticleSeo(article, { indexable: true });
  eyebrowNode.textContent = article.eyebrow || "catalogo cruzeiro do sul";
  titleNode.textContent = article.title || "Abrindo noticia";
  metaNode.textContent = `${getArticleDateLabel(article)} • ${article.category || "Noticia"}`;

  resetDetailThumb();
  categoryNode.textContent = article.category || "Noticia";
  ledeNode.textContent = normalizeEditorialText(article.lede || article.summary || "");
  sourceNameNode.textContent = article.sourceName || "Fonte local";
  sourceLabelNode.textContent = normalizeEditorialText(article.sourceLabel || article.title || "");
  sourceLinkNode.href = article.sourceUrl || HOME_RETURN_URL;

  if (article.sourceUrl && article.sourceUrl.startsWith("http")) {
    sourceLinkNode.setAttribute("target", "_blank");
    sourceLinkNode.setAttribute("rel", "noreferrer");
  } else {
    sourceLinkNode.removeAttribute("target");
    sourceLinkNode.removeAttribute("rel");
  }

  if (article.analysis && analysisContainer && analysisText) {
    analysisText.textContent = normalizeEditorialText(article.analysis);
    analysisContainer.hidden = false;
    analysisContainer.classList.add("active");
  } else if (analysisContainer) {
    analysisContainer.hidden = true;
    analysisContainer.classList.remove("active");
  }

  const editorialTabs = renderFactTabs(article);

  void applyDetailHeroImage(article);

  if (article.imageUrl || article.media) {
    applyMediaBadge(thumbNode, article.media);
  }

  if (mediaKindNode && mediaNoteNode && mediaLinkNode) {
    if (article.media) {
      mediaKindNode.textContent = article.media.label || "";
      mediaNoteNode.textContent = article.media.note || "";
      mediaLinkNode.href = article.media.creditUrl || HOME_RETURN_URL;
      mediaLinkNode.textContent = article.media.creditLabel || "Ver fonte";

      if (article.media.creditUrl && article.media.creditUrl.startsWith("http")) {
        mediaLinkNode.setAttribute("target", "_blank");
        mediaLinkNode.setAttribute("rel", "noreferrer");
      } else {
        mediaLinkNode.removeAttribute("target");
        mediaLinkNode.removeAttribute("rel");
      }
    } else if (article.imageUrl) {
      mediaKindNode.textContent = "Imagem da materia";
      mediaNoteNode.textContent = article.imageCredit || "";
      mediaLinkNode.href = article.sourceUrl || HOME_RETURN_URL;
      mediaLinkNode.textContent = "Ver fonte";
      if (article.sourceUrl && article.sourceUrl.startsWith("http")) {
        mediaLinkNode.setAttribute("target", "_blank");
        mediaLinkNode.setAttribute("rel", "noreferrer");
      } else {
        mediaLinkNode.removeAttribute("target");
        mediaLinkNode.removeAttribute("rel");
      }
    } else {
      mediaKindNode.textContent = "";
      mediaNoteNode.textContent = "";
      mediaLinkNode.href = HOME_RETURN_URL;
      mediaLinkNode.textContent = "Voltar para a home";
      mediaLinkNode.removeAttribute("target");
      mediaLinkNode.removeAttribute("rel");
    }
  }

  contentNode.innerHTML = "";
  getExpandedBodyParagraphs(article).forEach((paragraph) => {
    const p = document.createElement("p");
    p.textContent = paragraph;
    contentNode.appendChild(p);
  });

  const generatedDevelopment = Array.isArray(article.development)
    ? article.development.map(normalizeEditorialText).filter(Boolean)
    : [
        `${article.title || "A noticia"} continua em acompanhamento no Catalogo Cruzeiro do Sul com foco nos impactos práticos para a rotina da cidade.`,
        `Na leitura local, o ponto central envolve ${String(article.category || "o tema principal").toLowerCase()} e seus efeitos diretos nos bairros, nos serviços e na vida de quem acompanha o caso.`,
        "O portal segue atualizando esta matéria conforme novas informações oficiais forem publicadas pela fonte original e pelos órgãos locais."
      ];

  const developmentBox = document.createElement("section");
  developmentBox.className = "detail-development";
  const developmentTitle = document.createElement("h4");
  developmentTitle.textContent = "Desenvolvimento da Materia";
  developmentBox.appendChild(developmentTitle);
  generatedDevelopment.forEach((line) => {
    const paragraph = document.createElement("p");
    paragraph.textContent = line;
    developmentBox.appendChild(paragraph);
  });
  contentNode.appendChild(developmentBox);

  highlightsNode.innerHTML = "";
  const quickHighlights =
    editorialTabs.find((tab) => tab.id === "importance")?.items ||
    dedupeTextList(article.highlights || []);

  quickHighlights.slice(0, 4).forEach((highlight) => {
    const li = document.createElement("li");
    li.textContent = highlight;
    highlightsNode.appendChild(li);
  });
};

const loadRuntimeArticle = async (targetSlug) => {
  if (!targetSlug) {
    return null;
  }

  for (const apiBase of resolveApiBases()) {
    const article = await requestRuntimeArticle(apiBase, targetSlug);
    if (article) {
      return article;
    }
  }

  return null;
};

const requestRuntimeArticle = async (apiBase, targetSlug) => {
  const controller = typeof AbortController === "function" ? new AbortController() : null;
  const timeoutId = controller
    ? window.setTimeout(() => controller.abort(), 3500)
    : null;

  try {
    const response = await fetch(`${apiBase}/api/news/${encodeURIComponent(targetSlug)}`, {
      cache: "no-store",
      signal: controller?.signal
    });

    if (!response.ok) {
      return null;
    }

    const payload = await response.json();
    return payload.item ? normalizeDetailArticle(payload.item) : null;
  } catch (error) {
    return null;
  } finally {
    if (timeoutId) {
      window.clearTimeout(timeoutId);
    }
  }
};

const findLocalArticle = (targetSlug) => {
  if (!targetSlug) {
    return null;
  }

  const article =
    AUTHORIAL_DETAIL_ARTICLES[targetSlug] ||
    window.NEWS_MAP?.[targetSlug] ||
    (Array.isArray(window.NEWS_DATA)
      ? window.NEWS_DATA.find((item) => normalizeSlug(item?.slug) === targetSlug)
      : null) ||
    findStoredArticle(targetSlug) ||
    null;

  return article ? normalizeDetailArticle(article) : null;
};

const getReadableStorages = () => {
  const storages = [];

  try {
    if (window.sessionStorage) {
      storages.push(window.sessionStorage);
    }
  } catch (_error) {
    // Ignora ambiente sem sessionStorage.
  }

  try {
    if (window.localStorage) {
      storages.push(window.localStorage);
    }
  } catch (_error) {
    // Ignora ambiente sem localStorage.
  }

  return storages;
};

const readStoredItems = (key) => {
  const storages = getReadableStorages();

  for (const storage of storages) {
    try {
      const raw = storage.getItem(key);
      if (!raw) {
        continue;
      }

      const parsed = JSON.parse(raw);
      if (parsed) {
        return parsed;
      }
    } catch (_error) {
      // Segue para o proximo storage.
    }
  }

  return null;
};

const findStoredArticle = (targetSlug) => {
  for (const key of OFFLINE_LAST_ARTICLE_KEYS) {
    const recentArticle = readStoredItems(key);
    if (recentArticle && normalizeSlug(recentArticle.slug) === targetSlug) {
      return normalizeDetailArticle(recentArticle);
    }
  }

  for (const key of OFFLINE_NEWS_CACHE_KEYS) {
    const cachedItems = readStoredItems(key);
    if (!Array.isArray(cachedItems)) {
      continue;
    }

    const item = cachedItems.find((value) => normalizeSlug(value?.slug) === targetSlug) || null;
    if (item) {
      return normalizeDetailArticle(item);
    }
  }

  return null;
};

const persistLoadedArticle = (article) => {
  const normalizedArticle = normalizeDetailArticle(article);
  if (!normalizedArticle?.slug) {
    return;
  }

  const serialized = JSON.stringify(normalizedArticle);
  const storages = getReadableStorages();

  storages.forEach((storage) => {
    OFFLINE_LAST_ARTICLE_KEYS.forEach((key) => {
      try {
        storage.setItem(key, serialized);
      } catch (_error) {
        // Ignora falhas de quota.
      }
    });
  });
};

const loadArticle = async () => {
  if (!slug) {
    renderNotFound();
    return;
  }

  const fallbackArticle = findLocalArticle(slug);

  if (fallbackArticle) {
    renderArticle(fallbackArticle);
    persistLoadedArticle(fallbackArticle);
  }

  if (fallbackArticle && window.location.protocol === "file:") {
    return;
  }

  const runtimeArticle = await loadRuntimeArticle(slug);

  if (runtimeArticle) {
    renderArticle(runtimeArticle);
    persistLoadedArticle(runtimeArticle);
    return;
  }

  if (!fallbackArticle) {
    renderNotFound();
  }
};

loadArticle();
