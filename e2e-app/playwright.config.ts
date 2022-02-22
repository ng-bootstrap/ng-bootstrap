import {PlaywrightTestConfig, devices} from '@playwright/test';

export const baseURL = "http://localhost:4200/#";

const config: PlaywrightTestConfig = {
  reporter: process.env.CI ? 'github' : 'list',
  globalSetup: require.resolve('./setup.e2e-spec'),
  testDir: "src",
  testMatch: /\.e2e-spec\.ts$/,
  timeout: 60000,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  webServer: {
    command: "yarn e2e-app:serve -c playwright",
    timeout: 300000,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL,
    viewport: {width: 1280, height: 720},
  },
  projects: [
    {
      name: 'chromium',
      use: {
          ...devices['Desktop Chrome'],
      },
    },
    {
      name: 'firefox',
      use: {
          ...devices['Desktop Firefox'],
      },
    },
    {
      name: 'webkit',
      use: {
          ...devices['Desktop Safari'],
      },
    },
  ]
};

export default config;
