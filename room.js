window.addEventListener("DOMContentLoaded", () => {
const Engine = window.ThresholdsEngine;
const search = new URLSearchParams(window.location.search);
const reduceMotion =
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const state = {
  seed: Engine.sanitizeSeed(search.get("seed")) || Engine.generateSeed(),
  phase: Engine.parsePhase(search.get("phase")),
  persistSeed: search.has("seed"),
  manifestOpen: window.innerWidth > 1080,
  secretVisible: false,
  manifestEntries: [],
  memoryUrl: "",
  echoes: [],
  omenIndex: 0,
};

const body = document.body;
const room = document.querySelector(".room");
const canvas = document.getElementById("room-canvas");
const title = document.getElementById("room-title");
const whisper = document.getElementById("room-whisper");
const mantra = document.getElementById("room-mantra");
const dreamline = document.getElementById("room-dreamline");
const driftGrid = document.getElementById("drift-grid");
const phaseChip = document.getElementById("phase-chip");
const seedValue = document.getElementById("seed-value");
const motionValue = document.getElementById("motion-value");
const glyphValue = document.getElementById("glyph-value");
const manifestPanel = document.getElementById("manifest-panel");
const manifestList = document.getElementById("manifest-list");
const manifestStatus = document.getElementById("manifest-status");
const phaseButton = document.getElementById("phase-button");
const reseedButton = document.getElementById("reseed-button");
const manifestButton = document.getElementById("manifest-button");
const captureButton = document.getElementById("capture-button");
const verseButton = document.getElementById("verse-button");
const canvasPrompt = document.getElementById("canvas-prompt");
const secretPanel = document.getElementById("secret-panel");
const secretCopy = document.getElementById("secret-copy");
const secretMeta = document.getElementById("secret-meta");
const secretLink = document.getElementById("secret-link");
const secretClose = document.getElementById("secret-close");
const observatoryLink = document.getElementById("observatory-link");
const memoryLink = document.getElementById("memory-link");
const echoList = document.getElementById("echo-list");
const clearEchoesButton = document.getElementById("clear-echoes-button");
const copyLinkButton = document.getElementById("copy-link-button");

const ECHO_STORAGE_KEY = "threshold-room-echoes-v1";

body.dataset.motion = reduceMotion ? "reduced" : "full";
motionValue.textContent = reduceMotion ? "reduced" : "full";

const renderer = Engine.createSigilRenderer({
  canvas,
  seed: state.seed,
  phase: state.phase,
  reducedMotion: reduceMotion,
});

let idleTimer = 0;
let holdTimer = 0;
let secretTimer = 0;

room.tabIndex = -1;

function updateTheme() {
  const palette = Engine.derivePalette(state.seed, state.phase);
  body.style.setProperty("--bg", palette.background);
  body.style.setProperty("--line", palette.line);
  body.style.setProperty("--accent", palette.accent);
  body.style.setProperty("--panel", palette.panel);
  body.style.setProperty("--mist", palette.mist);
}

function renderManifest() {
  const derived = Engine.deriveText(state.seed, state.phase);
  const rows = state.manifestEntries.concat([
    { key: "seed", value: state.seed },
    { key: "phase", value: state.phase },
    { key: "drift", value: derived.drift[0] },
    { key: "palette", value: Engine.derivePalette(state.seed, state.phase).name },
  ]);

  manifestList.innerHTML = rows
    .map(
      (row) =>
        `<div class="manifest-row"><dt>${row.key}</dt><dd>${row.value}</dd></div>`,
    )
    .join("");
}

function renderText() {
  const text = Engine.deriveText(state.seed, state.phase);
  title.textContent = text.title;
  whisper.textContent = text.whisper;
  mantra.textContent = text.mantra;
  dreamline.textContent = Engine.deriveVerse(state.seed, state.phase, state.omenIndex);
  phaseChip.textContent = state.phase;
  seedValue.textContent = state.seed;
  glyphValue.textContent = text.glyph;
  manifestStatus.textContent = state.phase;
  const nextPhase = Engine.nextPhase(state.phase);
  phaseButton.textContent = `Advance to ${nextPhase}`;
  reseedButton.textContent = "Reseed (R)";
  captureButton.textContent = "Capture echo (C)";
  verseButton.textContent = "Invoke omen (V)";
  manifestButton.textContent = state.manifestOpen ? "Hide manifest (M)" : "Show manifest (M)";
  canvasPrompt.textContent = `Touch the field :: advance to ${nextPhase}`;

  driftGrid.innerHTML = text.drift
    .map(
      (entry, index) =>
        `<span style="--index:${index}" aria-hidden="true">${entry}</span>`,
    )
    .join("");

  if (state.secretVisible) {
    secretCopy.textContent = text.secret;
  }
}

function readStoredEchoes() {
  try {
    const raw = window.localStorage.getItem(ECHO_STORAGE_KEY);
    const parsed = JSON.parse(raw || "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (entry) =>
          entry &&
          typeof entry.seed === "string" &&
          typeof entry.phase === "string" &&
          typeof entry.capturedAt === "string",
      )
      .slice(0, 8);
  } catch (error) {
    return [];
  }
}

function writeStoredEchoes() {
  try {
    window.localStorage.setItem(ECHO_STORAGE_KEY, JSON.stringify(state.echoes.slice(0, 8)));
  } catch (error) {
    // storage is optional for this room
  }
}

function renderEchoes() {
  if (!state.echoes.length) {
    echoList.innerHTML =
      '<li><button type="button" disabled><span>No echoes yet</span><span class="echo-phase">capture one</span></button></li>';
    clearEchoesButton.disabled = true;
    return;
  }
  clearEchoesButton.disabled = false;

  echoList.innerHTML = state.echoes
    .map(
      (entry, index) =>
        `<li><button type="button" data-echo-index="${index}"><span>${entry.seed}<span class="echo-meta">${formatCapturedAt(entry.capturedAt)}</span></span><span class="echo-phase">${entry.phase}</span></button></li>`,
    )
    .join("");
}

function formatCapturedAt(input) {
  const capturedAt = new Date(input);
  if (Number.isNaN(capturedAt.getTime())) return "just now";
  return capturedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function captureEcho() {
  const next = [{ seed: state.seed, phase: state.phase, capturedAt: new Date().toISOString() }]
    .concat(state.echoes)
    .filter(
      (entry, index, list) =>
        list.findIndex((candidate) => candidate.seed === entry.seed && candidate.phase === entry.phase) ===
        index,
    )
    .slice(0, 8);
  state.echoes = next;
  writeStoredEchoes();
  renderEchoes();
}

function syncUrl() {
  const next = new URL(window.location.href);
  next.searchParams.set("phase", state.phase);
  if (state.persistSeed) {
    next.searchParams.set("seed", state.seed);
  } else {
    next.searchParams.delete("seed");
  }
  const target = `${next.pathname}${next.search}${next.hash}`;
  window.history.replaceState({}, "", target);
}

function updateNavigation() {
  const query = new URLSearchParams({
    seed: state.seed,
    phase: state.phase,
  }).toString();
  observatoryLink.href = `Sigil/threshold.html?${query}`;
  memoryLink.href = `forgotten.html?${query}`;
  if (!state.secretVisible || !state.memoryUrl) {
    secretLink.href = `forgotten.html?${query}`;
    secretLink.textContent = "Continue into the memory chamber";
  }
}

function applyState() {
  body.dataset.phase = state.phase;
  updateTheme();
  renderText();
  renderManifest();
  updateNavigation();
  renderer.setState({
    seed: state.seed,
    phase: state.phase,
    reducedMotion: reduceMotion,
  });
  manifestPanel.dataset.open = String(state.manifestOpen);
  syncUrl();
}

function focusShortcutLayer() {
  const active = document.activeElement;
  if (active && active.matches && active.matches("input, textarea, select, [contenteditable='true']")) {
    return;
  }
  room.focus({ preventScroll: true });
}

function hideSecret() {
  state.secretVisible = false;
  secretPanel.classList.remove("is-visible");
  window.clearTimeout(secretTimer);
  updateNavigation();
}

function scheduleSecretHide() {
  window.clearTimeout(secretTimer);
  secretTimer = window.setTimeout(() => hideSecret(), reduceMotion ? 12000 : 8000);
}

function cyclePhase() {
  hideSecret();
  state.phase = Engine.nextPhase(state.phase);
  state.omenIndex = 0;
  applyState();
  resetIdleTimer();
}

function revealSecret(source) {
  state.secretVisible = true;
  secretPanel.classList.add("is-visible");
  const text = Engine.deriveText(state.seed, state.phase);
  secretCopy.textContent = text.secret;
  secretMeta.textContent =
    source === "hold"
      ? "The room answered a held touch. Press Esc to dismiss it."
      : "The room offered this while you were still. Press Esc to dismiss it.";
  const fallbackMemory = `forgotten.html?seed=${state.seed}&phase=${state.phase}`;
  secretLink.href = state.memoryUrl || fallbackMemory;
  secretLink.textContent = state.memoryUrl
    ? `Follow the old address :: ${state.memoryUrl}`
    : "Continue into the memory chamber";
  scheduleSecretHide();
}

window.__thresholdRoomTest = {
  revealSecret,
  hideSecret,
  getState: () => ({
    seed: state.seed,
    phase: state.phase,
    manifestOpen: state.manifestOpen,
    secretVisible: state.secretVisible,
  }),
};

function resetIdleTimer() {
  window.clearTimeout(idleTimer);
  idleTimer = window.setTimeout(
    () => revealSecret("idle"),
    reduceMotion ? 14000 : 9000,
  );
}

function clearHoldTimer() {
  window.clearTimeout(holdTimer);
  holdTimer = 0;
}

async function loadArtifacts() {
  const [manifestResponse, keyResponse] = await Promise.allSettled([
    fetch("threshold.yaml"),
    fetch("forgotten.key"),
  ]);

  if (manifestResponse.status === "fulfilled" && manifestResponse.value.ok) {
    const manifestText = await manifestResponse.value.text();
    state.manifestEntries = Engine.parseManifest(manifestText);
  } else {
    state.manifestEntries = [
      { key: "manifest", value: "unheard" },
      { key: "loop", value: "half-open" },
    ];
  }

  if (keyResponse.status === "fulfilled" && keyResponse.value.ok) {
    const keyText = await keyResponse.value.text();
    state.memoryUrl = Engine.decodeBase64(keyText);
  }

  renderManifest();
}

room.addEventListener("pointermove", (event) => {
  const rect = canvas.getBoundingClientRect();
  renderer.setPointer({
    x: (event.clientX - rect.left) / rect.width,
    y: (event.clientY - rect.top) / rect.height,
    active: true,
  });
  resetIdleTimer();
});

room.addEventListener("pointerleave", () => {
  renderer.clearPointer();
});

room.addEventListener("pointerdown", (event) => {
  focusShortcutLayer();
  if (event.target.closest("a, button")) return;
  hideSecret();
  resetIdleTimer();
  clearHoldTimer();
  holdTimer = window.setTimeout(() => revealSecret("hold"), 850);
});

room.addEventListener("pointerup", clearHoldTimer);
room.addEventListener("pointercancel", clearHoldTimer);

room.addEventListener("click", (event) => {
  if (event.target.closest("a, button")) return;
  cyclePhase();
});

phaseButton.addEventListener("click", () => {
  cyclePhase();
  focusShortcutLayer();
});
canvasPrompt.addEventListener("click", () => {
  cyclePhase();
  focusShortcutLayer();
});
reseedButton.addEventListener("click", () => {
  hideSecret();
  state.seed = Engine.generateSeed();
  state.omenIndex = 0;
  applyState();
  resetIdleTimer();
  focusShortcutLayer();
});
captureButton.addEventListener("click", () => {
  captureEcho();
  focusShortcutLayer();
  resetIdleTimer();
});
verseButton.addEventListener("click", () => {
  state.omenIndex += 1;
  renderText();
  focusShortcutLayer();
  resetIdleTimer();
});
clearEchoesButton.addEventListener("click", () => {
  state.echoes = [];
  writeStoredEchoes();
  renderEchoes();
  hideSecret();
  focusShortcutLayer();
});
copyLinkButton.addEventListener("click", async () => {
  const link = new URL(window.location.href);
  link.searchParams.set("seed", state.seed);
  link.searchParams.set("phase", state.phase);
  const shareable = link.toString();
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(shareable);
      copyLinkButton.textContent = "Copied";
    } else {
      copyLinkButton.textContent = "Copy manually";
    }
  } catch (error) {
    copyLinkButton.textContent = "Copy manually";
  }
  window.setTimeout(() => {
    copyLinkButton.textContent = "Copy ritual link";
  }, 1500);
  resetIdleTimer();
});
manifestButton.addEventListener("click", () => {
  hideSecret();
  state.manifestOpen = !state.manifestOpen;
  manifestPanel.dataset.open = String(state.manifestOpen);
  renderText();
  resetIdleTimer();
  focusShortcutLayer();
});
secretClose.addEventListener("click", () => {
  hideSecret();
  focusShortcutLayer();
});
echoList.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-echo-index]");
  if (!button) return;
  const index = Number(button.dataset.echoIndex);
  if (!Number.isInteger(index) || !state.echoes[index]) return;
  hideSecret();
  state.seed = state.echoes[index].seed;
  state.phase = Engine.parsePhase(state.echoes[index].phase);
  state.omenIndex = 0;
  state.persistSeed = true;
  applyState();
  focusShortcutLayer();
  resetIdleTimer();
});

function handleShortcut(event) {
  if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) {
    return;
  }
  const target = event.target;
  if (target && target.matches && target.matches("input, textarea, select, [contenteditable='true']")) {
    return;
  }
  const key = typeof event.key === "string" ? event.key.toLowerCase() : "";
  const code = typeof event.code === "string" ? event.code : "";
  if (key === "r" || code === "KeyR") {
    event.preventDefault();
    hideSecret();
    state.seed = Engine.generateSeed();
    applyState();
    resetIdleTimer();
    return;
  }
  if (key === "m" || code === "KeyM") {
    event.preventDefault();
    hideSecret();
    state.manifestOpen = !state.manifestOpen;
    manifestPanel.dataset.open = String(state.manifestOpen);
    renderText();
    resetIdleTimer();
    return;
  }
  if (key === "c" || code === "KeyC") {
    event.preventDefault();
    captureEcho();
    resetIdleTimer();
    return;
  }
  if (key === "v" || code === "KeyV") {
    event.preventDefault();
    state.omenIndex += 1;
    renderText();
    resetIdleTimer();
    return;
  }
  if (key === "escape" || code === "Escape") {
    event.preventDefault();
    hideSecret();
  }
}

window.addEventListener("keydown", handleShortcut, { capture: true });

window.addEventListener("resize", () => {
  if (window.innerWidth > 1080 && !state.secretVisible) {
    state.manifestOpen = true;
  }
  manifestPanel.dataset.open = String(state.manifestOpen);
});

applyState();
state.echoes = readStoredEchoes();
renderEchoes();
loadArtifacts();
resetIdleTimer();
focusShortcutLayer();
});
