import {AssistivePlaywrightTestConfig} from 'assistive-playwright-test';
import {join} from 'path';
import {hostname} from 'os';

// The dot (.) at the end of the hostname is useful to force resolution through DNS
// (which may not be done if the hostname does not contain at least one dot)
export const baseURL = `http://${hostname()}.:4200/#`;

const reportsDir = join(__dirname, "..", "test-reports", "e2e-app-apw");

const config: AssistivePlaywrightTestConfig = {
  reporter: [[process.env.CI ? 'github' : 'list'], ['html', {open: 'never', outputFolder: join(reportsDir, "report")}]],
  outputDir: join(reportsDir, "traces"),
  testDir: "src",
  testMatch: /\.apw-spec\.ts$/,
  timeout: 300000,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 5 : 0,
  webServer: {
    command: "yarn e2e-app:serve -c playwright --host 0.0.0.0 --disable-host-check",
    timeout: 300000,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL,
    viewport: null,
    launchOptions: {args: ["--start-maximized"]},
    trace: "retain-on-failure",
    vmSettings: {type: "virtualbox", vm: "win10-apw", snapshot: "nvda"}
  },
};

export default config;
