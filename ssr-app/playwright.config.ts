import {PlaywrightTestConfig} from '@playwright/test';

export const baseURL = "http://localhost:4200/#";

const config: PlaywrightTestConfig = {
  reporter: process.env.CI ? 'github' : 'list',
  testDir: "src",
  testMatch: /\.e2e-spec\.ts$/,
  timeout: 60000,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  webServer: {
    command: "yarn ssr-app:serve-express",
    timeout: 300000,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL,
    viewport: {width: 1280, height: 720},
  }
};

export default config;
