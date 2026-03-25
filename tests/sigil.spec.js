const { test, expect } = require("@playwright/test");
const fs = require("fs");
const http = require("http");
const path = require("path");
const { URL } = require("url");

const root = path.resolve(__dirname, "..");

const mimeByExtension = {
  ".css": "text/css",
  ".html": "text/html",
  ".js": "text/javascript",
  ".json": "application/json",
  ".key": "text/plain",
  ".md": "text/plain",
  ".txt": "text/plain",
  ".yaml": "text/plain",
};

function summonStaticServer() {
  return new Promise((resolve) => {
    const server = http.createServer((request, response) => {
      const requested = new URL(request.url, "http://localhost");
      const requestedPath = decodeURIComponent(requested.pathname);
      const safePath = requestedPath.endsWith("/")
        ? `${requestedPath}index.html`
        : requestedPath;
      const relativePath = safePath.replace(/^\/+/, "");
      const absolute = path.normalize(path.join(root, relativePath));

      if (!absolute.startsWith(root)) {
        response.statusCode = 403;
        response.end("threshold denied");
        return;
      }

      fs.stat(absolute, (statError, stats) => {
        if (statError || !stats.isFile()) {
          response.statusCode = 404;
          response.end("lost in the corridor");
          return;
        }

        const ext = path.extname(absolute).toLowerCase();
        response.setHeader("Content-Type", mimeByExtension[ext] || "application/octet-stream");
        fs.createReadStream(absolute).pipe(response);
      });
    });

    server.listen(0, () => {
      const address = server.address();
      resolve({ server, port: address.port });
    });
  });
}

test.describe("threshold room", () => {
  let listening;

  test.beforeAll(async () => {
    listening = await summonStaticServer();
  });

  test.afterAll(async () => {
    await new Promise((resolve) => listening.server.close(resolve));
  });

  test("renders the room and keyboard shortcuts stay active", async ({ page }) => {
    const url = `http://localhost:${listening.port}/index.html?seed=door-salt&phase=approach`;
    await page.goto(url);

    await expect(page.locator("[data-testid='room-canvas']")).toBeVisible();
    await expect(page.locator("body")).toHaveAttribute("data-phase", "approach");

    const title = page.locator("[data-testid='room-title']");
    const firstTitle = await title.textContent();
    const firstSeed = await page.locator("#seed-value").textContent();

    await page.locator("#phase-button").click();
    await expect(page.locator("body")).toHaveAttribute("data-phase", "listen");
    await expect(title).not.toHaveText(firstTitle || "");
    await expect(page.locator("#observatory-link")).toHaveAttribute("href", /seed=door-salt/);
    await expect(page.locator("#observatory-link")).toHaveAttribute("href", /phase=listen/);
    await expect(page.locator("#memory-link")).toHaveAttribute("href", /seed=door-salt/);

    const panel = page.locator("[data-testid='manifest-panel']");
    const before = await panel.getAttribute("data-open");
    await page.keyboard.press("KeyM");
    await expect(panel).toHaveAttribute(
      "data-open",
      before === "true" ? "false" : "true",
    );

    await page.keyboard.press("KeyR");
    await expect(page.locator("#seed-value")).not.toHaveText(firstSeed || "");
  });

  test("soft secret can be dismissed without blocking the room", async ({ page }) => {
    const url = `http://localhost:${listening.port}/index.html?seed=door-salt&phase=approach`;
    await page.goto(url);

    await page.evaluate(() => {
      window.__thresholdRoomTest.revealSecret("test");
    });

    const secret = page.locator("#secret-panel");
    await expect(secret).toHaveClass(/is-visible/);

    await page.locator("#phase-button").click();
    await expect(page.locator("body")).toHaveAttribute("data-phase", "listen");
    await expect(secret).not.toHaveClass(/is-visible/);

    await page.evaluate(() => {
      window.__thresholdRoomTest.revealSecret("test");
    });
    await expect(secret).toHaveClass(/is-visible/);
    await page.keyboard.press("Escape");
    await expect(secret).not.toHaveClass(/is-visible/);
  });

  test("echo shelf captures and recalls seeded moments", async ({ page }) => {
    const url = `http://localhost:${listening.port}/index.html?seed=first-echo&phase=approach`;
    await page.goto(url);

    await page.locator("#capture-button").click();
    await expect(page.locator("#echo-list button[data-echo-index='0']")).toContainText("first-echo");
    await expect(page.locator("#echo-list button[data-echo-index='0']")).toContainText("approach");

    await page.keyboard.press("KeyR");
    const newSeed = await page.locator("#seed-value").textContent();
    expect(newSeed).not.toEqual("first-echo");

    await page.locator("#phase-button").click();
    await expect(page.locator("body")).toHaveAttribute("data-phase", "listen");

    await page.locator("#echo-list button[data-echo-index='0']").click();
    await expect(page.locator("#seed-value")).toHaveText("first-echo");
    await expect(page.locator("body")).toHaveAttribute("data-phase", "approach");
  });

  test("echo shelf can be cleared after captures", async ({ page }) => {
    const url = `http://localhost:${listening.port}/index.html?seed=clear-echo&phase=listen`;
    await page.goto(url);

    await page.locator("#capture-button").click();
    await expect(page.locator("#echo-list button[data-echo-index='0']")).toBeVisible();

    await page.locator("#clear-echoes-button").click();
    await expect(page.locator("#echo-list")).toContainText("No echoes yet");
  });

  test("omen invocation shifts the dreamline", async ({ page }) => {
    const url = `http://localhost:${listening.port}/index.html?seed=oracle-thread&phase=approach`;
    await page.goto(url);

    const dreamline = page.locator("#room-dreamline");
    const first = await dreamline.textContent();

    await page.keyboard.press("KeyV");
    await expect(dreamline).not.toHaveText(first || "");
  });

  test("same seed and phase produce the same text fragments", async ({ page }) => {
    const url = `http://localhost:${listening.port}/index.html?seed=ashen-window&phase=cross`;

    await page.goto(url);
    await expect(page.locator("[data-testid='room-title']")).toBeVisible();

    const firstSnapshot = await page.evaluate(() => ({
      title: document.querySelector("[data-testid='room-title']")?.textContent,
      whisper: document.getElementById("room-whisper")?.textContent,
      dreamline: document.getElementById("room-dreamline")?.textContent,
      drift: Array.from(document.querySelectorAll("#drift-grid span")).map((node) => node.textContent),
    }));

    await page.goto(url);

    const secondSnapshot = await page.evaluate(() => ({
      title: document.querySelector("[data-testid='room-title']")?.textContent,
      whisper: document.getElementById("room-whisper")?.textContent,
      dreamline: document.getElementById("room-dreamline")?.textContent,
      drift: Array.from(document.querySelectorAll("#drift-grid span")).map((node) => node.textContent),
    }));

    expect(secondSnapshot).toEqual(firstSnapshot);
  });

  test("observatory still renders non-background pixels with legacy params", async ({ page }) => {
    const background = "#10131d";
    const url = `http://localhost:${listening.port}/Sigil/threshold.html?background=${background.slice(1)}&line=7fffd4&accent=ff6bcb&iterations=96&noise=0.42&speed=0.65`;

    await page.goto(url);

    const canvas = page.locator("[data-testid='sigil-canvas']");
    await expect(canvas).toBeVisible();
    await page.waitForFunction(() => {
      const node = document.getElementById("sigil");
      return node && node.width > 0 && node.height > 0;
    });

    const render = await canvas.evaluate((node, bgHex) => {
      const ctx = node.getContext("2d");
      const width = node.width;
      const height = node.height;
      const snapshot = ctx.getImageData(0, 0, width, height).data;

      const cleanHex = bgHex.startsWith("#") ? bgHex.slice(1) : bgHex;
      const backgroundColor = [
        parseInt(cleanHex.slice(0, 2), 16),
        parseInt(cleanHex.slice(2, 4), 16),
        parseInt(cleanHex.slice(4, 6), 16),
      ];

      let nonBackground = 0;
      for (let i = 0; i < snapshot.length; i += 4) {
        const matchesBackground =
          snapshot[i] === backgroundColor[0] &&
          snapshot[i + 1] === backgroundColor[1] &&
          snapshot[i + 2] === backgroundColor[2];

        if (!matchesBackground) {
          nonBackground += 1;
          if (nonBackground > 400) break;
        }
      }

      return { width, height, nonBackground };
    }, background);

    expect(render.width).toBeGreaterThan(0);
    expect(render.height).toBeGreaterThan(0);
    expect(render.nonBackground).toBeGreaterThan(120);
  });

  test("memory chamber reveals the decoded key with keyboard input", async ({ page }) => {
    const url = `http://localhost:${listening.port}/forgotten.html?seed=amber-latch`;
    await page.goto(url);

    const button = page.locator("[data-testid='reveal-key']");
    await expect(page.locator("#return-link")).toHaveAttribute("href", /seed=amber-latch/);
    await button.focus();
    await page.keyboard.press("Enter");

    await expect(page.locator("[data-testid='memory-output']")).toContainText(
      "https://shankstrategy.com",
    );
  });

  test("reduced-motion mode still renders a coherent room", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`http://localhost:${listening.port}/index.html?seed=slow-lantern`);

    await expect(page.locator("body")).toHaveAttribute("data-motion", "reduced");
    await expect(page.locator("[data-testid='room-canvas']")).toBeVisible();
  });
});

test.describe("mobile thresholds", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

  let listening;

  test.beforeAll(async () => {
    listening = await summonStaticServer();
  });

  test.afterAll(async () => {
    await new Promise((resolve) => listening.server.close(resolve));
  });

  test("room controls remain visible on mobile", async ({ page }) => {
    await page.goto(`http://localhost:${listening.port}/index.html?seed=mobile-veil`);

    const phaseButton = page.locator("#phase-button");
    await expect(phaseButton).toBeVisible();
    const box = await phaseButton.boundingBox();

    expect(box).not.toBeNull();
    expect(box.y + box.height).toBeLessThanOrEqual(844);
  });

  test("memory chamber reveal works by touch", async ({ page }) => {
    await page.goto(`http://localhost:${listening.port}/forgotten.html?seed=touch-echo`);

    await page.locator("[data-testid='reveal-key']").tap();
    await expect(page.locator("[data-testid='memory-output']")).toContainText(
      "https://shankstrategy.com",
    );
  });
});


