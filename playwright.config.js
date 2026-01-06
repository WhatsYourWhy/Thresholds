const { defineConfig } = require("@playwright/test");
const path = require("path");

const testRoot = path.resolve(__dirname, "tests");

module.exports = defineConfig({
  testDir: testRoot,
  reporter: "list",
  outputDir: path.join(testRoot, "artifacts"),
  use: {
    headless: true,
    viewport: { width: 1280, height: 720 },
  },
});
