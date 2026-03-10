(function (global) {
  const PHASES = ["approach", "listen", "cross"];
  const TAU = Math.PI * 2;

  const PALETTE_FAMILIES = [
    {
      name: "glass",
      approach: {
        background: "#08111f",
        line: "#95f2ff",
        accent: "#ffd089",
        glow: "#224a7c",
        mist: "rgba(149, 242, 255, 0.12)",
        panel: "rgba(8, 15, 28, 0.74)",
      },
      listen: {
        background: "#0d1023",
        line: "#d7c8ff",
        accent: "#7fffd4",
        glow: "#483d8b",
        mist: "rgba(215, 200, 255, 0.14)",
        panel: "rgba(12, 10, 30, 0.76)",
      },
      cross: {
        background: "#150d16",
        line: "#ffb3e6",
        accent: "#ffd36f",
        glow: "#6f335b",
        mist: "rgba(255, 179, 230, 0.16)",
        panel: "rgba(28, 11, 26, 0.78)",
      },
    },
    {
      name: "ember",
      approach: {
        background: "#120f16",
        line: "#f1d7b8",
        accent: "#89c2ff",
        glow: "#49312c",
        mist: "rgba(241, 215, 184, 0.12)",
        panel: "rgba(19, 13, 18, 0.74)",
      },
      listen: {
        background: "#11111e",
        line: "#8ce9ff",
        accent: "#ffbd7a",
        glow: "#2a4966",
        mist: "rgba(140, 233, 255, 0.14)",
        panel: "rgba(9, 14, 24, 0.76)",
      },
      cross: {
        background: "#170f12",
        line: "#ff9ec4",
        accent: "#f2e1a8",
        glow: "#693040",
        mist: "rgba(255, 158, 196, 0.14)",
        panel: "rgba(27, 10, 18, 0.78)",
      },
    },
    {
      name: "tidal",
      approach: {
        background: "#08131a",
        line: "#b7ffe5",
        accent: "#8fb9ff",
        glow: "#1f5060",
        mist: "rgba(183, 255, 229, 0.12)",
        panel: "rgba(6, 19, 24, 0.74)",
      },
      listen: {
        background: "#0b1120",
        line: "#c6d0ff",
        accent: "#8ff5ff",
        glow: "#32568f",
        mist: "rgba(198, 208, 255, 0.14)",
        panel: "rgba(9, 15, 34, 0.76)",
      },
      cross: {
        background: "#101118",
        line: "#ffd8f7",
        accent: "#8ee0b5",
        glow: "#534371",
        mist: "rgba(255, 216, 247, 0.15)",
        panel: "rgba(19, 13, 31, 0.78)",
      },
    },
  ];

  const TEXT_LIBRARY = {
    approach: {
      titles: [
        "The room remembers your outline",
        "A quiet threshold takes your measure",
        "The first door is made of weather",
        "You arrive where the light hesitates",
      ],
      whispers: [
        "Stand still long enough and the field begins to answer.",
        "The chamber is not locked. It is only listening first.",
        "Touch the surface lightly. The pattern bends toward notice.",
        "Everything here is unfinished on purpose.",
      ],
      mantras: [
        "Click, tap, or wait for the room to continue.",
        "Approach is the phase where the walls decide to soften.",
        "The sigil is not centered. It is gathering itself.",
      ],
      secrets: [
        "A key can be hidden in plain text and still feel ceremonial.",
        "The room rewards patience more than force.",
        "Some passages open when attention stops demanding proof.",
      ],
    },
    listen: {
      titles: [
        "The walls begin to answer back",
        "Now the field leans closer",
        "The middle distance starts to speak",
        "The threshold hums between syllables",
      ],
      whispers: [
        "The manifest shifts from file to omen once it is read aloud.",
        "Seed and phase are enough for the room to repeat itself.",
        "What looks random is only private.",
        "The observatory keeps the same pulse, only further away.",
      ],
      mantras: [
        "Press M for the manifest. Press R if you want a different omen.",
        "Listening is where the geometry becomes personal.",
        "Hover near the center and watch the threads bow toward you.",
      ],
      secrets: [
        "The forgotten key is less hidden than delayed.",
        "A held gesture counts as a sentence here.",
        "The same seed will always find the same hush.",
      ],
    },
    cross: {
      titles: [
        "The room agrees to open",
        "The crossing is softer than expected",
        "The threshold lets go without warning",
        "You have reached the side that looks back",
      ],
      whispers: [
        "Nothing dramatic happens. The air simply decides to include you.",
        "Crossing does not end the ritual. It clarifies the edges.",
        "The hidden chamber was present from the start.",
        "Beauty is the only proof the room intends to offer.",
      ],
      mantras: [
        "Stay a moment longer. The afterimage is part of it.",
        "A new seed changes the story without changing the rules.",
        "The memory chamber keeps the oldest clue in daylight.",
      ],
      secrets: [
        "Crossing reveals that the room was an instrument all along.",
        "The secret is gentle because the threshold already trusts you.",
        "Every ending here is designed to be revisited.",
      ],
    },
  };

  const DRIFT_LIBRARY = [
    "salt static",
    "half-open loop",
    "doorlight",
    "soft witness",
    "memory weather",
    "slow voltage",
    "echo ash",
    "glass breath",
    "hollow bloom",
    "field hush",
    "patient signal",
    "veiled index",
    "lantern math",
    "aftertone",
    "night pollen",
    "threshold rain",
  ];

  function sanitizeSeed(input) {
    if (typeof input !== "string") return "";
    return input
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-_]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 36);
  }

  function generateSeed() {
    const alphabet = "abcdefghjkmnpqrstuvwxyz23456789";
    const values = [];

    if (global.crypto && typeof global.crypto.getRandomValues === "function") {
      const buffer = new Uint32Array(4);
      global.crypto.getRandomValues(buffer);
      for (let i = 0; i < buffer.length; i += 1) {
        values.push(buffer[i]);
      }
    } else {
      for (let i = 0; i < 4; i += 1) {
        values.push(Math.floor(Math.random() * 0xffffffff));
      }
    }

    return values
      .map((value) => {
        let chunk = "";
        let working = value;
        for (let i = 0; i < 3; i += 1) {
          chunk += alphabet[working % alphabet.length];
          working = Math.floor(working / alphabet.length);
        }
        return chunk;
      })
      .join("-");
  }

  function parsePhase(input) {
    return PHASES.includes(input) ? input : PHASES[0];
  }

  function nextPhase(phase) {
    const index = PHASES.indexOf(parsePhase(phase));
    return PHASES[(index + 1) % PHASES.length];
  }

  function parseColor(input, fallback) {
    if (!input || typeof input !== "string") return fallback;
    const clean = input.trim().replace(/^#/, "");
    if (!/^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/.test(clean)) {
      return fallback;
    }

    if (clean.length === 3) {
      return `#${clean
        .split("")
        .map((part) => `${part}${part}`)
        .join("")
        .toLowerCase()}`;
    }

    return `#${clean.toLowerCase()}`;
  }

  function parseNumber(input, fallback, bounds) {
    if (input === null || input === undefined || input === "") return fallback;
    const parsed = Number(input);
    if (!Number.isFinite(parsed)) return fallback;

    let clamped = parsed;
    if (bounds && typeof bounds.min === "number") {
      clamped = Math.max(bounds.min, clamped);
    }
    if (bounds && typeof bounds.max === "number") {
      clamped = Math.min(bounds.max, clamped);
    }

    return clamped;
  }

  function hashString(input) {
    let hash = 2166136261;
    for (let index = 0; index < input.length; index += 1) {
      hash ^= input.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }

  function mulberry32(seed) {
    let value = seed >>> 0;
    return function () {
      value += 0x6d2b79f5;
      let step = value;
      step = Math.imul(step ^ (step >>> 15), step | 1);
      step ^= step + Math.imul(step ^ (step >>> 7), step | 61);
      return ((step ^ (step >>> 14)) >>> 0) / 4294967296;
    };
  }

  function rngFrom(seedText) {
    return mulberry32(hashString(seedText));
  }

  function takeSample(list, count, rng) {
    const pool = list.slice();
    for (let index = pool.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(rng() * (index + 1));
      const current = pool[index];
      pool[index] = pool[swapIndex];
      pool[swapIndex] = current;
    }
    return pool.slice(0, count);
  }

  function toRgba(hex, alpha) {
    const clean = parseColor(hex, "#ffffff").slice(1);
    const red = parseInt(clean.slice(0, 2), 16);
    const green = parseInt(clean.slice(2, 4), 16);
    const blue = parseInt(clean.slice(4, 6), 16);
    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
  }

  function derivePalette(seed, phase, overrides) {
    const cleanSeed = sanitizeSeed(seed) || "threshold";
    const activePhase = parsePhase(phase);
    const family =
      PALETTE_FAMILIES[hashString(cleanSeed) % PALETTE_FAMILIES.length];
    const base = family[activePhase];
    const safeOverrides = overrides || {};

    return {
      name: family.name,
      background: parseColor(safeOverrides.background, base.background),
      line: parseColor(safeOverrides.line, base.line),
      accent: parseColor(safeOverrides.accent, base.accent),
      glow: base.glow,
      mist: base.mist,
      panel: base.panel,
      halo: toRgba(base.accent, 0.16),
      lineSoft: toRgba(parseColor(safeOverrides.line, base.line), 0.18),
      accentSoft: toRgba(parseColor(safeOverrides.accent, base.accent), 0.22),
    };
  }

  function deriveText(seed, phase) {
    const cleanSeed = sanitizeSeed(seed) || "threshold";
    const activePhase = parsePhase(phase);
    const library = TEXT_LIBRARY[activePhase];
    const rng = rngFrom(`${cleanSeed}:${activePhase}:text`);

    return {
      title: library.titles[Math.floor(rng() * library.titles.length)],
      whisper: library.whispers[Math.floor(rng() * library.whispers.length)],
      mantra: library.mantras[Math.floor(rng() * library.mantras.length)],
      secret: library.secrets[Math.floor(rng() * library.secrets.length)],
      drift: takeSample(DRIFT_LIBRARY, 5, rng),
      glyph: takeSample(["<><", "/\\/", "[]~", "{::}", "o-o"], 1, rng)[0],
    };
  }

  function deriveSigilConfig(options) {
    const safeOptions = options || {};
    const cleanSeed = sanitizeSeed(safeOptions.seed) || "threshold";
    const activePhase = parsePhase(safeOptions.phase);
    const reducedMotion = Boolean(safeOptions.reducedMotion);
    const phaseIndex = PHASES.indexOf(activePhase);
    const rng = rngFrom(`${cleanSeed}:${activePhase}:sigil`);
    const overrides = safeOptions.overrides || {};
    const palette = derivePalette(cleanSeed, activePhase, overrides);

    const baseIterations = 128 + phaseIndex * 24 + Math.floor(rng() * 36);
    const baseOrbit = 0.28 + phaseIndex * 0.04 + rng() * 0.08;
    const baseNoise = 0.22 + rng() * 0.36;
    const baseSpeed = 0.35 + rng() * 0.32 + phaseIndex * 0.08;

    return {
      seed: cleanSeed,
      phase: activePhase,
      phaseIndex,
      reducedMotion,
      palette,
      iterations: Math.round(
        parseNumber(overrides.iterations, baseIterations, {
          min: 24,
          max: 720,
        }),
      ),
      orbitRadius: parseNumber(overrides.orbitRadius, baseOrbit, {
        min: 0,
        max: 1,
      }),
      noise: parseNumber(overrides.noise, baseNoise, {
        min: 0,
        max: 1,
      }),
      speed: parseNumber(overrides.speed, baseSpeed, {
        min: 0,
        max: 3,
      }),
    };
  }

  function parseManifest(text) {
    return String(text || "")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"))
      .map((line) => {
        const divider = line.indexOf(":");
        if (divider === -1) {
          return { key: line, value: "" };
        }
        return {
          key: line.slice(0, divider).trim(),
          value: line.slice(divider + 1).trim(),
        };
      });
  }

  function decodeBase64(input) {
    const clean = String(input || "").trim();
    if (!clean) return "";

    try {
      if (typeof global.atob === "function") {
        return global.atob(clean);
      }
    } catch (error) {
      return "";
    }

    return "";
  }

  function createSigilRenderer(options) {
    const safeOptions = options || {};
    const canvas = safeOptions.canvas;
    const context =
      canvas && typeof canvas.getContext === "function"
        ? canvas.getContext("2d")
        : null;

    if (!canvas || !context) {
      return {
        resize: function () {},
        setPointer: function () {},
        clearPointer: function () {},
        setState: function () {},
        getState: function () {
          return {
            seed: sanitizeSeed(safeOptions.seed) || "threshold",
            phase: parsePhase(safeOptions.phase),
          };
        },
        destroy: function () {},
      };
    }

    let dpr = Math.max(1, global.devicePixelRatio || 1);
    let frameHandle = 0;
    let destroyed = false;
    let state = {
      seed: sanitizeSeed(safeOptions.seed) || generateSeed(),
      phase: parsePhase(safeOptions.phase),
      reducedMotion: Boolean(safeOptions.reducedMotion),
      overrides: safeOptions.overrides || {},
    };
    let pointer = {
      x: 0.5,
      y: 0.5,
      active: false,
    };
    let pointerEase = {
      x: 0.5,
      y: 0.5,
    };
    let spec = buildSpec();

    function buildSpec() {
      const config = deriveSigilConfig(state);
      const rng = rngFrom(`${config.seed}:${config.phase}:dots`);
      const dots = [];

      for (let index = 0; index < config.iterations; index += 1) {
        const theta = (index / config.iterations) * TAU;
        dots.push({
          theta,
          drift: rng() * TAU,
          radius:
            config.orbitRadius +
            (rng() - 0.5) * 0.18 +
            Math.sin(theta * (2 + (index % 5))) * 0.06,
          weight: 0.55 + rng() * 1.35,
          band: Math.floor(rng() * 3),
          arc: 0.12 + rng() * 0.24,
        });
      }

      return {
        config,
        dots,
      };
    }

    function resize() {
      dpr = Math.max(1, global.devicePixelRatio || 1);
      const bounds = canvas.getBoundingClientRect();
      const width = Math.max(1, Math.round(bounds.width * dpr));
      const height = Math.max(1, Math.round(bounds.height * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function clearSurface() {
      context.save();
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.restore();
    }

    function drawBackground(width, height, config) {
      context.fillStyle = config.palette.background;
      context.fillRect(0, 0, width, height);

      const glowX = width * (0.5 + (pointerEase.x - 0.5) * 0.18);
      const glowY = height * (0.48 + (pointerEase.y - 0.5) * 0.12);

      const bloom = context.createRadialGradient(
        glowX,
        glowY,
        width * 0.02,
        glowX,
        glowY,
        width * 0.55,
      );
      bloom.addColorStop(0, config.palette.halo);
      bloom.addColorStop(0.45, config.palette.mist);
      bloom.addColorStop(1, "rgba(0, 0, 0, 0)");
      context.fillStyle = bloom;
      context.fillRect(0, 0, width, height);

      const veil = context.createLinearGradient(0, 0, width, height);
      veil.addColorStop(0, "rgba(255, 255, 255, 0.015)");
      veil.addColorStop(0.5, "rgba(255, 255, 255, 0)");
      veil.addColorStop(1, "rgba(0, 0, 0, 0.22)");
      context.fillStyle = veil;
      context.fillRect(0, 0, width, height);
    }

    function drawFrame(timestamp) {
      if (destroyed) return;
      resize();
      clearSurface();

      const width = canvas.width / dpr;
      const height = canvas.height / dpr;
      const config = spec.config;
      const pulse = timestamp * 0.001 * Math.max(0.12, config.speed);
      const scale = Math.min(width, height) * (state.reducedMotion ? 0.31 : 0.36);
      const pointerAttract = pointer.active ? 0.12 : 0.05;

      pointerEase.x += (pointer.x - pointerEase.x) * 0.08;
      pointerEase.y += (pointer.y - pointerEase.y) * 0.08;

      drawBackground(width, height, config);

      context.save();
      context.translate(width / 2, height / 2);

      const rotation = state.reducedMotion
        ? Math.sin(pulse * 0.2) * 0.02
        : Math.sin(pulse * 0.5) * 0.08;
      context.rotate(rotation);

      for (let index = 0; index < spec.dots.length; index += 1) {
        const dot = spec.dots[index];
        const wobble =
          Math.sin(pulse * 1.4 + dot.drift) *
          config.noise *
          (state.reducedMotion ? 0.08 : 0.18);
        const angle =
          dot.theta +
          Math.sin(pulse + dot.drift * 0.7) * config.noise * 0.14 +
          dot.arc * Math.sin(pulse * 0.7 + index * 0.015);
        const radius = Math.max(0.08, dot.radius + wobble) * scale;

        let x = Math.cos(angle) * radius;
        let y = Math.sin(angle) * radius;

        const pointerX = (pointerEase.x - 0.5) * width * 0.42;
        const pointerY = (pointerEase.y - 0.5) * height * 0.32;
        const distance = Math.hypot(pointerX - x, pointerY - y);
        const influence = Math.max(0, 1 - distance / (scale * 1.1)) * pointerAttract;

        x += (pointerX - x) * influence * dot.weight;
        y += (pointerY - y) * influence * dot.weight;

        const innerRadius = scale * (0.15 + dot.weight * 0.015);
        const innerAngle = angle - 0.12;
        const innerX = Math.cos(innerAngle) * innerRadius;
        const innerY = Math.sin(innerAngle) * innerRadius;
        const bendX = (innerX + x) / 2 + Math.sin(pulse + dot.drift) * 10;
        const bendY = (innerY + y) / 2 + Math.cos(pulse * 0.8 + dot.drift) * 10;

        context.beginPath();
        context.moveTo(innerX, innerY);
        context.quadraticCurveTo(bendX, bendY, x, y);
        context.strokeStyle =
          dot.band === 0
            ? toRgba(config.palette.accent, 0.62)
            : toRgba(config.palette.line, 0.42 + dot.weight * 0.08);
        context.lineWidth = dot.band === 0 ? 1.7 : 0.9 + dot.weight * 0.35;
        context.stroke();

        context.beginPath();
        context.arc(x, y, dot.band === 0 ? 2.1 : 1.45, 0, TAU);
        context.fillStyle =
          dot.band === 0
            ? toRgba(config.palette.accent, 0.9)
            : toRgba(config.palette.line, 0.82);
        context.fill();
      }

      context.beginPath();
      context.arc(0, 0, scale * 0.18, 0, TAU);
      context.fillStyle = toRgba(config.palette.accent, 0.12);
      context.fill();

      context.beginPath();
      context.arc(0, 0, scale * 0.12, 0, TAU);
      context.strokeStyle = toRgba(config.palette.line, 0.48);
      context.lineWidth = 1.4;
      context.stroke();

      context.restore();

      frameHandle = global.requestAnimationFrame(drawFrame);
    }

    function setPointer(next) {
      if (!next || typeof next.x !== "number" || typeof next.y !== "number") {
        pointer.active = false;
        return;
      }

      pointer.x = Math.min(1, Math.max(0, next.x));
      pointer.y = Math.min(1, Math.max(0, next.y));
      pointer.active = next.active !== false;
    }

    function clearPointer() {
      pointer.active = false;
      pointer.x = 0.5;
      pointer.y = 0.5;
    }

    function setState(nextState) {
      const incoming = nextState || {};
      state = {
        seed: sanitizeSeed(incoming.seed) || state.seed,
        phase: parsePhase(incoming.phase || state.phase),
        reducedMotion:
          typeof incoming.reducedMotion === "boolean"
            ? incoming.reducedMotion
            : state.reducedMotion,
        overrides: incoming.overrides || state.overrides,
      };
      spec = buildSpec();
    }

    function getState() {
      return {
        seed: state.seed,
        phase: state.phase,
        reducedMotion: state.reducedMotion,
        overrides: state.overrides,
        config: spec.config,
      };
    }

    function destroy() {
      destroyed = true;
      if (frameHandle) {
        global.cancelAnimationFrame(frameHandle);
      }
    }

    resize();
    frameHandle = global.requestAnimationFrame(drawFrame);
    global.addEventListener("resize", resize);

    return {
      resize,
      setPointer,
      clearPointer,
      setState,
      getState,
      destroy,
    };
  }

  global.ThresholdsEngine = {
    PHASES,
    sanitizeSeed,
    generateSeed,
    parsePhase,
    nextPhase,
    parseColor,
    parseNumber,
    derivePalette,
    deriveText,
    deriveSigilConfig,
    parseManifest,
    decodeBase64,
    createSigilRenderer,
  };
})(window);
