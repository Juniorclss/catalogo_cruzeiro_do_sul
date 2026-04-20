"use strict";

(function () {
  const DEFAULT_LOCAL_API_BASES = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8787",
    "http://127.0.0.1:8787"
  ];
  const normalizeBase = (value) => String(value || "").trim().replace(/\/$/, "");
  const localHostPattern = /^(localhost|127(?:\.\d{1,3}){3})$/i;
  const isLocalLikeBase = (value) => {
    const normalized = normalizeBase(value);

    if (!normalized) {
      return false;
    }

    try {
      const parsed = new URL(normalized);
      return localHostPattern.test(parsed.hostname);
    } catch {
      return false;
    }
  };
  const addBase = (list, value) => {
    const normalized = normalizeBase(value);
    if (!normalized || list.includes(normalized)) {
      return;
    }
    list.push(normalized);
  };
  const bases = [];
  const presetBase = normalizeBase(window.CATALOGO_API_BASE);
  const isLocalHttp = location.protocol.startsWith("http") && localHostPattern.test(location.hostname);
  const isFileMode = location.protocol === "file:";
  const currentOrigin = normalizeBase(location.origin);
  const canUseCrossOriginSavedBase = isFileMode || isLocalHttp;

  let savedBase = "";
  try {
    savedBase = normalizeBase(localStorage.getItem("catalogo_api_base"));
  } catch {
    // ignore
  }

  if (!canUseCrossOriginSavedBase && savedBase && savedBase !== currentOrigin && !isLocalLikeBase(savedBase)) {
    try {
      localStorage.removeItem("catalogo_api_base");
    } catch {
      // ignore
    }
    savedBase = "";
  }

  if (!isFileMode && !isLocalHttp) {
    addBase(bases, currentOrigin);
  }

  if (presetBase && (canUseCrossOriginSavedBase || presetBase === currentOrigin || isLocalLikeBase(presetBase))) {
    addBase(bases, presetBase);
  }

  if (savedBase && (canUseCrossOriginSavedBase || savedBase === currentOrigin || isLocalLikeBase(savedBase))) {
    addBase(bases, savedBase);
  }

  if (isFileMode) {
    DEFAULT_LOCAL_API_BASES.forEach((base) => addBase(bases, base));
  } else if (isLocalHttp && location.port !== "3000") {
    DEFAULT_LOCAL_API_BASES.forEach((base) => addBase(bases, base));
    addBase(bases, currentOrigin);
  } else {
    addBase(bases, currentOrigin);
    if (isLocalHttp) {
      DEFAULT_LOCAL_API_BASES.forEach((base) => addBase(bases, base));
    }
  }

  window.CATALOGO_API_BASES = bases;
  window.CATALOGO_API_BASE = bases[0] || normalizeBase(location.origin) || DEFAULT_LOCAL_API_BASES[0];
})();
