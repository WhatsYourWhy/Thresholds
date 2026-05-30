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
    {
      name: "ash",
      approach: {
        background: "#0e0e12",
        line: "#c8c4d4",
        accent: "#e8c97a",
        glow: "#2a2830",
        mist: "rgba(200, 196, 212, 0.10)",
        panel: "rgba(14, 14, 20, 0.78)",
      },
      listen: {
        background: "#0c0d14",
        line: "#a3b8d8",
        accent: "#c4f0c4",
        glow: "#1e2c40",
        mist: "rgba(163, 184, 216, 0.12)",
        panel: "rgba(10, 13, 22, 0.80)",
      },
      cross: {
        background: "#100e14",
        line: "#d4b8e8",
        accent: "#f0d4a0",
        glow: "#302040",
        mist: "rgba(212, 184, 232, 0.14)",
        panel: "rgba(18, 12, 24, 0.80)",
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
        "Something here was waiting before you named it",
        "The field opens when you stop explaining yourself",
        "An old hush adjusts to your presence",
        "The approach is already the answer",
      ],
      whispers: [
        "Stand still long enough and the field begins to answer.",
        "The chamber is not locked. It is only listening first.",
        "Touch the surface lightly. The pattern bends toward notice.",
        "Everything here is unfinished on purpose.",
        "Attention without demand is the only key that fits.",
        "The room does not reward speed. It rewards return.",
        "What you brought in with you will settle. Give it a moment.",
        "The threshold has already decided to open. You are catching up.",
      ],
      mantras: [
        "Click, tap, or wait for the room to continue.",
        "Approach is the phase where the walls decide to soften.",
        "The sigil is not centered. It is gathering itself.",
        "The room is not asking you to understand. Only to stay.",
        "Your seed determines the palette. Your patience determines the rest.",
      ],
      secrets: [
        "A key can be hidden in plain text and still feel ceremonial.",
        "The room rewards patience more than force.",
        "Some passages open when attention stops demanding proof.",
        "The approach phase is where the room takes a breath. You are sharing it.",
        "Every threshold is a frequency. You are tuning without knowing it.",
      ],
    },
    listen: {
      titles: [
        "The walls begin to answer back",
        "Now the field leans closer",
        "The middle distance starts to speak",
        "The threshold hums between syllables",
        "Something under the geometry has learned your rhythm",
        "The room has memorized three things about you already",
        "A low frequency decides to become audible",
        "The listening is mutual now",
      ],
      whispers: [
        "The manifest shifts from file to omen once it is read aloud.",
        "Seed and phase are enough for the room to repeat itself.",
        "What looks random is only private.",
        "The observatory keeps the same pulse, only further away.",
        "You have been in this phase before. The room recalls the shape of your attention.",
        "Listening here is not passive. The sigil curves toward you.",
        "The field is not displaying itself. It is asking a question with no words.",
        "A hum without a source is still a hum. Follow it anyway.",
      ],
      mantras: [
        "Press M for the manifest. Press R if you want a different omen.",
        "Listening is where the geometry becomes personal.",
        "Hover near the center and watch the threads bow toward you.",
        "The room speaks in repetition. Return to the same seed and it remembers.",
        "This phase does not end. It graduates.",
      ],
      secrets: [
        "The forgotten key is less hidden than delayed.",
        "A held gesture counts as a sentence here.",
        "The same seed will always find the same hush.",
        "You are not decoding the sigil. The sigil is decoding you.",
        "The observatory holds the same seed from farther away. Distance clarifies.",
      ],
    },
    cross: {
      titles: [
        "The room agrees to open",
        "The crossing is softer than expected",
        "The threshold lets go without warning",
        "You have reached the side that looks back",
        "The room is now a memory of itself",
        "Something finished without you noticing the moment",
        "The crossing was never the hard part",
        "You arrived before you decided to",
      ],
      whispers: [
        "Nothing dramatic happens. The air simply decides to include you.",
        "Crossing does not end the ritual. It clarifies the edges.",
        "The hidden chamber was present from the start.",
        "Beauty is the only proof the room intends to offer.",
        "The room did not open for you. It opened with you.",
        "What you crossed was not a boundary. It was a tempo.",
        "The sigil does not celebrate. It continues, which is the same thing.",
        "You are in the part of the room that knows it is being remembered.",
      ],
      mantras: [
        "Stay a moment longer. The afterimage is part of it.",
        "A new seed changes the story without changing the rules.",
        "The memory chamber keeps the oldest clue in daylight.",
        "The cross phase is where the room exhales. You are inside that breath.",
        "Capture an echo before you leave. The shelf holds up to eight.",
      ],
      secrets: [
        "Crossing reveals that the room was an instrument all along.",
        "The secret is gentle because the threshold already trusts you.",
        "Every ending here is designed to be revisited.",
        "The room does not mark the crossing. You carry that yourself.",
        "A seed shared is a crossing shared. The ritual link holds the full state.",
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
    "quiet corridor",
    "borrowed resonance",
    "held frequency",
    "dim cartography",
    "interval fog",
    "tender static",
    "unnamed approach",
    "slow crossing",
    "open recursion",
    "light delay",
    "attentive hush",
    "field memory",
    "dissolved signal",
    "pale instrument",
    "corridor breath",
    "fractured calm",
  ];

  const VERSE_LIBRARY = {
    openings: [
      "Between glass and ember,",
      "At the lip of the quiet room,",
      "Under a patient signal,",
      "Where the doorlight hesitates,",
      "Inside the half-open loop,",
      "Beneath the corridor breath,",
      "Along the borrowed resonance,",
      "Through the interval fog,",
      "Past the unnamed approach,",
      "Within the attentive hush,",
    ],
    middles: [
      "your name becomes weather",
      "the sigil leans toward memory",
      "the field hums in borrowed gold",
      "attention turns the lock silently",
      "the corridor writes in soft static",
      "the room holds its breath around you",
      "something decides to include you",
      "the threshold adjusts its frequency",
      "light delays itself on purpose",
      "the crossing was always this quiet",
    ],
    endings: [
      "and the threshold keeps listening.",
      "until the walls answer back.",
      "while the hidden key stays warm.",
      "before the room remembers you first.",
      "as if crossing were a form of prayer.",
      "while the echo shelf fills slowly.",
      "until the field becomes familiar.",
      "as the sigil gathers its next shape.",
      "before the corridor decides to open.",
      "while patience does its invisible work.",
    ],
  };

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
    const safeOverrides = overrides || {};

    if (safeOverrides.void) {
      const voidBg = parseColor(safeOverrides.background, "#020206");
      const voidLine = parseColor(safeOverrides.line, "#8a2be2");
      const voidAccent = parseColor(safeOverrides.accent, "#00ffff");
      return {
        name: "void",
        background: voidBg,
        line: voidLine,
        accent: voidAccent,
        glow: "#1a0033",
        mist: "rgba(138, 43, 226, 0.12)",
        panel: "rgba(2, 2, 6, 0.85)",
        halo: "rgba(0, 255, 255, 0.15)",
        lineSoft: toRgba(voidLine, 0.18),
        accentSoft: toRgba(voidAccent, 0.22),
      };
    }

    const family =
      PALETTE_FAMILIES[hashString(cleanSeed) % PALETTE_FAMILIES.length];
    const base = family[activePhase];

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

  function deriveVerse(seed, phase, variant) {
    const cleanSeed = sanitizeSeed(seed) || "threshold";
    const activePhase = parsePhase(phase);
    const safeVariant = Number.isFinite(Number(variant)) ? Number(variant) : 0;
    const rng = rngFrom(`${cleanSeed}:${activePhase}:verse:${safeVariant}`);
    const opening =
      VERSE_LIBRARY.openings[Math.floor(rng() * VERSE_LIBRARY.openings.length)];
    const middle =
      VERSE_LIBRARY.middles[Math.floor(rng() * VERSE_LIBRARY.middles.length)];
    const ending =
      VERSE_LIBRARY.endings[Math.floor(rng() * VERSE_LIBRARY.endings.length)];

    return `${opening} ${middle}, ${ending}`;
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

    const MODES = ["orbital", "constellation", "spiral", "void"];
    const defaultMode = MODES[hashString(cleanSeed) % (MODES.length - 1)];
    const mode =
      overrides.mode && MODES.includes(overrides.mode)
        ? overrides.mode
        : defaultMode;

    return {
      seed: cleanSeed,
      phase: activePhase,
      phaseIndex,
      reducedMotion,
      palette,
      mode,
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
    const audioSource = safeOptions.audioSource || null;
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

      const isSpiral = config.mode === "spiral";
      for (let index = 0; index < config.iterations; index += 1) {
        const theta =
          (index / config.iterations) * TAU * (isSpiral ? 3.0 : 1.0);
        const baseRadius = isSpiral
          ? 0.05 + (index / config.iterations) * (config.orbitRadius * 0.9)
          : config.orbitRadius;
        dots.push({
          theta,
          drift: rng() * TAU,
          radius:
            baseRadius +
            (rng() - 0.5) * (isSpiral ? 0.05 : 0.18) +
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

      // Audio-visual coupling: read live synth metrics and breathe them into the frame
      let audioSpeedMod = 1.0;
      let audioNoiseMod = 1.0;
      if (audioSource && typeof audioSource.getMetrics === "function") {
        const metrics = audioSource.getMetrics();
        // LFO phase oscillates -1..1 at ~0.18Hz; map to a gentle speed breath ±6%
        audioSpeedMod = 1.0 + metrics.lfoPhase * 0.06;
        // Filter envelope (0..1) maps to a gentle noise swell ±4%
        audioNoiseMod = 1.0 + (metrics.filterEnvelope - 0.5) * 0.08;
      }

      const pulse =
        timestamp * 0.001 * Math.max(0.12, config.speed * audioSpeedMod);
      const scale =
        Math.min(width, height) * (state.reducedMotion ? 0.31 : 0.36);
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

      const points = [];
      for (let index = 0; index < spec.dots.length; index += 1) {
        const dot = spec.dots[index];
        const wobble =
          Math.sin(pulse * 1.4 + dot.drift) *
          (config.noise * audioNoiseMod) *
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
        const influence =
          Math.max(0, 1 - distance / (scale * 1.1)) * pointerAttract;

        x += (pointerX - x) * influence * dot.weight;
        y += (pointerY - y) * influence * dot.weight;

        points.push({ x, y, angle, dot });
      }

      if (config.mode === "constellation") {
        const step = Math.max(2, Math.floor(points.length / 6));
        for (let i = 0; i < points.length; i++) {
          const p1 = points[i];
          const p2 = points[(i + 1) % points.length];
          const p3 = points[(i + step) % points.length];

          context.beginPath();
          context.moveTo(p1.x, p1.y);
          context.lineTo(p2.x, p2.y);
          context.strokeStyle = toRgba(
            config.palette.line,
            0.28 + p1.dot.weight * 0.05,
          );
          context.lineWidth = 0.8;
          context.stroke();

          if (i % 2 === 0) {
            context.beginPath();
            context.moveTo(p1.x, p1.y);
            context.lineTo(p3.x, p3.y);
            context.strokeStyle = toRgba(config.palette.accent, 0.15);
            context.lineWidth = 0.6;
            context.stroke();
          }
        }
      } else if (config.mode === "spiral") {
        context.beginPath();
        for (let i = 0; i < points.length; i++) {
          const p = points[i];
          if (i === 0) {
            context.moveTo(p.x, p.y);
          } else {
            const prev = points[i - 1];
            const cx = (prev.x + p.x) / 2;
            const cy = (prev.y + p.y) / 2;
            context.quadraticCurveTo(prev.x, prev.y, cx, cy);
          }
        }
        context.strokeStyle = toRgba(config.palette.line, 0.4);
        context.lineWidth = 1.0;
        context.stroke();

        for (let i = 0; i < points.length; i += 4) {
          const p = points[i];
          context.beginPath();
          context.moveTo(p.x, p.y);
          context.lineTo(p.x * 0.2, p.y * 0.2);
          context.strokeStyle = toRgba(config.palette.accent, 0.12);
          context.lineWidth = 0.5;
          context.stroke();
        }
      } else if (config.mode === "void") {
        for (let i = 0; i < points.length; i++) {
          const p = points[i];
          context.beginPath();
          context.moveTo(p.x, p.y);
          const midX = p.x * 0.5;
          const midY = p.y * 0.5;
          const perpX = -p.y * 0.15;
          const perpY = p.x * 0.15;
          const controlX = midX + perpX + (pointerEase.x - 0.5) * 15;
          const controlY = midY + perpY + (pointerEase.y - 0.5) * 15;
          context.quadraticCurveTo(controlX, controlY, 0, 0);
          context.strokeStyle = toRgba(
            config.palette.line,
            0.18 + p.dot.weight * 0.04,
          );
          context.lineWidth = 0.5 + p.dot.weight * 0.15;
          context.stroke();
        }
      } else {
        // orbital (default)
        for (let i = 0; i < points.length; i++) {
          const p = points[i];
          const innerRadius = scale * (0.15 + p.dot.weight * 0.015);
          const innerAngle = p.angle - 0.12;
          const innerX = Math.cos(innerAngle) * innerRadius;
          const innerY = Math.sin(innerAngle) * innerRadius;
          const bendX = (innerX + p.x) / 2 + Math.sin(pulse + p.dot.drift) * 10;
          const bendY =
            (innerY + p.y) / 2 + Math.cos(pulse * 0.8 + p.dot.drift) * 10;

          context.beginPath();
          context.moveTo(innerX, innerY);
          context.quadraticCurveTo(bendX, bendY, p.x, p.y);
          context.strokeStyle =
            p.dot.band === 0
              ? toRgba(config.palette.accent, 0.62)
              : toRgba(config.palette.line, 0.42 + p.dot.weight * 0.08);
          context.lineWidth =
            p.dot.band === 0 ? 1.7 : 0.9 + p.dot.weight * 0.35;
          context.stroke();
        }
      }

      // Draw dots for all modes
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        context.beginPath();
        context.arc(p.x, p.y, p.dot.band === 0 ? 2.1 : 1.45, 0, TAU);
        context.fillStyle =
          p.dot.band === 0
            ? toRgba(config.palette.accent, 0.9)
            : toRgba(config.palette.line, 0.82);
        context.fill();
      }

      if (config.mode === "void") {
        context.beginPath();
        context.arc(0, 0, scale * 0.28, 0, TAU);
        context.fillStyle = config.palette.background;
        context.fill();

        for (let r = 1; r <= 4; r++) {
          context.beginPath();
          context.arc(0, 0, scale * (0.28 + r * 0.015), 0, TAU);
          context.strokeStyle = toRgba(config.palette.accent, 0.3 / r);
          context.lineWidth = 1.6;
          context.stroke();
        }
      } else {
        context.beginPath();
        context.arc(0, 0, scale * 0.18, 0, TAU);
        context.fillStyle = toRgba(config.palette.accent, 0.12);
        context.fill();

        context.beginPath();
        context.arc(0, 0, scale * 0.12, 0, TAU);
        context.strokeStyle = toRgba(config.palette.line, 0.48);
        context.lineWidth = 1.4;
        context.stroke();
      }

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

  function createResonanceCircuit() {
    let ctx = null;
    let osc1 = null;
    let osc2 = null;
    let filter = null;
    let gainNode = null;
    let lfo = null;
    let lfoGain = null;
    let delayNode = null;
    let feedbackGain = null;
    let wetGain = null;
    let active = false;
    let lfoPhaseOffset = 0;
    let filterEnvelopeValue = 0.5;
    let pendingSeed = null;
    let isVoidModeActive = false;
    let lastSeed = "threshold";
    let currentPaletteName = "glass";
    let hasExplicitPalette = false;

    const PALETTE_AUDIO_CONFIGS = {
      glass: {
        osc1Type: "triangle",
        osc2Type: "sine",
        baseDelayTime: 0.35,
        baseFeedback: 0.45,
        baseWet: 0.22,
        Q: 5.5,
      },
      ember: {
        osc1Type: "sawtooth",
        osc2Type: "triangle",
        baseDelayTime: 0.5,
        baseFeedback: 0.35,
        baseWet: 0.15,
        Q: 3.5,
      },
      tidal: {
        osc1Type: "sine",
        osc2Type: "triangle",
        baseDelayTime: 0.8,
        baseFeedback: 0.4,
        baseWet: 0.18,
        Q: 2.0,
      },
      ash: {
        osc1Type: "sawtooth",
        osc2Type: "sawtooth",
        baseDelayTime: 0.6,
        baseFeedback: 0.2,
        baseWet: 0.12,
        Q: 1.5,
      },
      void: {
        osc1Type: "sawtooth",
        osc2Type: "triangle",
        baseDelayTime: 1.2,
        baseFeedback: 0.55,
        baseWet: 0.26,
        Q: 2.5,
      },
    };

    function init() {
      if (ctx) return;
      const AudioContextClass =
        global.AudioContext || global.webkitAudioContext;
      if (!AudioContextClass) return;

      ctx = new AudioContextClass();
      osc1 = ctx.createOscillator();
      osc2 = ctx.createOscillator();
      filter = ctx.createBiquadFilter();
      gainNode = ctx.createGain();
      delayNode = ctx.createDelay(2.0);
      feedbackGain = ctx.createGain();
      wetGain = ctx.createGain();

      osc1.type = "sawtooth";
      osc1.frequency.value = 55.0;

      osc2.type = "triangle";
      osc2.frequency.value = 55.3;

      filter.type = "lowpass";
      filter.frequency.value = 220;
      filter.Q.value = 4.5;

      lfo = ctx.createOscillator();
      lfoGain = ctx.createGain();
      lfo.frequency.value = 0.18;
      lfoGain.gain.value = 45;

      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);

      osc1.connect(filter);
      osc2.connect(filter);

      // Dry path
      filter.connect(gainNode);

      // Wet path (delay loop)
      filter.connect(delayNode);
      delayNode.connect(wetGain);
      wetGain.connect(gainNode);

      // Feedback loop
      delayNode.connect(feedbackGain);
      feedbackGain.connect(delayNode);

      gainNode.connect(ctx.destination);

      gainNode.gain.setValueAtTime(0, ctx.currentTime);

      osc1.start();
      osc2.start();
      lfo.start();

      // Apply any seed that arrived before init
      if (pendingSeed !== null) {
        applySeedToNodes(pendingSeed);
        pendingSeed = null;
      }
      applyPaletteSettings();
    }

    function applyPaletteSettings() {
      const isVoid = isVoidModeActive || currentPaletteName === "void";
      const configKey = isVoid ? "void" : currentPaletteName;
      const config =
        PALETTE_AUDIO_CONFIGS[configKey] || PALETTE_AUDIO_CONFIGS.glass;

      if (osc1 && osc2 && filter && delayNode) {
        osc1.type = config.osc1Type;
        osc2.type = config.osc2Type;
        filter.Q.setTargetAtTime(config.Q, ctx.currentTime, 0.4);
        delayNode.delayTime.setTargetAtTime(
          config.baseDelayTime,
          ctx.currentTime,
          0.6,
        );
        applySeedToNodes(lastSeed);
      }
    }

    function enable() {
      init();
      if (ctx && ctx.state === "suspended") {
        ctx.resume();
      }
      if (gainNode) {
        gainNode.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 1.2);
      }
      active = true;
    }

    function disable() {
      if (gainNode) {
        gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.8);
      }
      active = false;
    }

    function setPointer(x, y, phase) {
      if (
        !active ||
        !filter ||
        !osc2 ||
        !ctx ||
        !delayNode ||
        !feedbackGain ||
        !wetGain
      )
        return;

      const height = 1 - y;
      const targetCutoff = 120 + height * 560;
      filter.frequency.setTargetAtTime(targetCutoff, ctx.currentTime, 0.2);
      // Track normalised filter envelope for renderer coupling
      filterEnvelopeValue = (targetCutoff - 120) / 560;

      const baseFreq = osc1.frequency.value;
      const detuneAmount = (x - 0.5) * (baseFreq * 0.08);
      osc2.frequency.setTargetAtTime(
        baseFreq + detuneAmount,
        ctx.currentTime,
        0.3,
      );

      const isVoid = isVoidModeActive || currentPaletteName === "void";
      const configKey = isVoid ? "void" : currentPaletteName;
      const config =
        PALETTE_AUDIO_CONFIGS[configKey] || PALETTE_AUDIO_CONFIGS.glass;

      // Modulate feedback based on X
      const targetFeedback = Math.max(
        0.05,
        Math.min(0.85, config.baseFeedback * (0.4 + x * 1.2)),
      );
      feedbackGain.gain.setTargetAtTime(targetFeedback, ctx.currentTime, 0.3);

      // Modulate wet mix based on Y (height = 1 - y)
      const targetWet = Math.max(
        0.01,
        Math.min(0.7, config.baseWet * (0.3 + height * 1.4)),
      );
      wetGain.gain.setTargetAtTime(targetWet, ctx.currentTime, 0.2);

      let volume = 0.08;
      if (phase === "approach") volume = 0.06;
      if (phase === "listen") volume = 0.09;
      if (phase === "cross") volume = 0.12;
      gainNode.gain.setTargetAtTime(volume, ctx.currentTime, 0.4);
    }

    function applySeedToNodes(seed) {
      const hash = hashString(seed || "threshold");
      const baseNotes = [41.2, 43.65, 49.0, 55.0, 65.41];
      let rootNote = baseNotes[hash % baseNotes.length];
      const isVoid = isVoidModeActive || currentPaletteName === "void";
      if (isVoid) {
        rootNote = rootNote * 0.5;
      }
      osc1.frequency.setTargetAtTime(rootNote, ctx.currentTime, 0.8);
      osc2.frequency.setTargetAtTime(
        rootNote * (isVoid ? 1.003 : 1.006),
        ctx.currentTime,
        0.8,
      );
    }

    function setSeed(seed) {
      lastSeed = seed || "threshold";
      if (!hasExplicitPalette) {
        const hash = hashString(lastSeed);
        const derivedPaletteFamily =
          PALETTE_FAMILIES[hash % PALETTE_FAMILIES.length].name;
        currentPaletteName = derivedPaletteFamily;
      }
      // Always pre-warm pitch regardless of active state
      if (!ctx) {
        // Store for when init() is called
        pendingSeed = lastSeed;
        return;
      }
      if (!osc1 || !osc2) return;
      applyPaletteSettings();
    }

    function setVoidMode(enabled) {
      isVoidModeActive = !!enabled;
      if (ctx && (osc1 || osc2)) {
        applyPaletteSettings();
      }
    }

    function setPalette(paletteName) {
      if (paletteName && PALETTE_AUDIO_CONFIGS[paletteName]) {
        currentPaletteName = paletteName;
        hasExplicitPalette = true;
      }
      if (ctx && osc1 && osc2) {
        applyPaletteSettings();
      }
    }

    // Returns live metrics for audio-visual coupling
    function getMetrics() {
      if (!ctx) return { lfoPhase: 0, filterEnvelope: 0.5, active: false };
      // Approximate LFO phase from currentTime — 0.18Hz period = ~5.56s
      const lfoPhase = Math.sin(
        ctx.currentTime * 2 * Math.PI * 0.18 + lfoPhaseOffset,
      );
      return {
        lfoPhase,
        filterEnvelope: filterEnvelopeValue,
        active,
      };
    }

    return {
      toggle: function (shouldEnable) {
        if (shouldEnable) enable();
        else disable();
      },
      setPointer,
      setSeed,
      setVoidMode,
      setPalette,
      getMetrics,
      isActive: function () {
        return active;
      },
    };
  }

  function createAudioGlowController(audio, target) {
    const glowTarget = target || (global.document && global.document.body);
    const neutralGlow = "1.0";
    let frameHandle = null;
    let glowApplied = false;

    function applyGlow(value) {
      if (!glowTarget || !glowTarget.style) return;
      glowTarget.style.setProperty("--audio-bloom-glow", value);
      glowApplied = true;
    }

    function resetGlow() {
      if (!glowApplied || !glowTarget || !glowTarget.style) return;
      glowTarget.style.setProperty("--audio-bloom-glow", neutralGlow);
      glowApplied = false;
    }

    function queueFrame() {
      if (typeof global.requestAnimationFrame !== "function") return;
      frameHandle = global.requestAnimationFrame(update);
    }

    function update() {
      if (!audio || !audio.isActive()) {
        frameHandle = null;
        resetGlow();
        return;
      }

      const metrics = audio.getMetrics();
      const pulse = 1.0 + metrics.lfoPhase * 0.12;
      const envelope = 1.0 + (metrics.filterEnvelope - 0.5) * 0.08;
      applyGlow(`${pulse * envelope}`);
      queueFrame();
    }

    function start() {
      if (frameHandle !== null || !audio || !audio.isActive()) return;
      queueFrame();
    }

    function stop() {
      if (
        frameHandle !== null &&
        typeof global.cancelAnimationFrame === "function"
      ) {
        global.cancelAnimationFrame(frameHandle);
      }
      frameHandle = null;
      resetGlow();
    }

    function sync() {
      if (audio && audio.isActive()) {
        start();
      } else {
        stop();
      }
    }

    return {
      start,
      stop,
      sync,
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
    deriveVerse,
    deriveSigilConfig,
    parseManifest,
    decodeBase64,
    createSigilRenderer,
    createResonanceCircuit,
    createAudioGlowController,
  };
})(window);
