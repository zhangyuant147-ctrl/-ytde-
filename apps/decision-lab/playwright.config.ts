import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/browser",
  timeout: 45000,
  workers: 2,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:3211",
    launchOptions: { executablePath: process.env.CHROME_PATH },
  },
  webServer: {
    command: "npm run start -- --port 3211 --hostname 127.0.0.1",
    url: "http://127.0.0.1:3211",
    env: { DEMO_MODE: "true" },
    reuseExistingServer: false,
  },
});
