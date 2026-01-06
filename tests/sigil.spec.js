const { test, expect } = require("@playwright/test");
const fs = require("fs");
const http = require("http");
const path = require("path");
const { URL } = require("url");

const root = path.resolve(__dirname, "..");

const mimeByExtension = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".txt": "text/plain",
};

function summonStaticServer() {
  return new Promise((resolve) => {
    const server = http.createServer((request, response) => {
      const requested = new URL(request.url, "http://localhost");
      const requestedPath = decodeURIComponent(requested.pathname);
      const safePath = requestedPath.endsWith("/")
        ? `${requestedPath}index.html`
        : requestedPath;
      const absolute = path.normalize(path.join(root, safePath));

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
        const contentType = mimeByExtension[ext] || "application/octet-stream";
        response.setHeader("Content-Type", contentType);
        fs.createReadStream(absolute).pipe(response);
      });
    });

    server.listen(0, () => {
      const address = server.address();
      resolve({ server, port: address.port });
    });
  });
}

test.describe("threshold sigil", () => {
  let listening;

  test.beforeAll(async () => {
    listening = await summonStaticServer();
  });

  test.afterAll(async () => {
    await new Promise((resolve) => listening.server.close(resolve));
  });

  test("draws beyond its background when tuned by query string", async ({
    page,
  }) => {
    const background = "#10131d";
    const lineColor = "7fffd4";
    const accent = "ff6bcb";
    const iterations = 96;
    const url = `http://localhost:${listening.port}/Sigil/threshold.html?background=${background.slice(1)}&line=${lineColor}&accent=${accent}&iterations=${iterations}&noise=0.42&speed=0.65`;

    await page.goto(url);

    const canvas = page.locator("#sigil");
    await expect(canvas).toBeVisible();
    await page.waitForFunction(() => {
      const node = document.getElementById("sigil");
      return node && node.width > 0 && node.height > 0;
    });
    await page.waitForTimeout(900);

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
          if (nonBackground > 120) break;
        }
      }

      return { width, height, nonBackground };
    }, background);

    expect(render.width).toBeGreaterThan(0);
    expect(render.height).toBeGreaterThan(0);
    expect(render.nonBackground).toBeGreaterThan(0);
  });
});
