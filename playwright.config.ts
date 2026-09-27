import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: './tests/',
  timeout: 600000,
  retries: 2,
  reporter: [
    ['list'],
    [
      'html',
      {
        outputFolder: 'attendence-report',
        open: 'never',
      }
    ]
  ],
  use: {
    headless: true,
    actionTimeout: 90000,
    navigationTimeout: 90000,
    viewport: null,
    ignoreHTTPSErrors: true,
    screenshot: 'only-on-failure',
    trace: 'on',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: "chrome",
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          args: ["--start-maximized"],
        },
      },
    },
  ],
});
