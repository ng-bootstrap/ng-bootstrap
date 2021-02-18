import {BrowserContextOptions, LaunchOptions} from 'playwright';
import {Browsers, Playwright} from '../playwright/controller';

type BrowserName = 'chromium' | 'firefox' | 'webkit';

export const baseUrl = 'http://localhost:4200/#';
process.env.BROWSER = (process.env.BROWSER || 'chromium').trim();
export const browserName: BrowserName = process.env.BROWSER as BrowserName;

console.log('Test suite is configured for browser:', browserName);

export const launchOptions: LaunchOptions = {
  headless: !!process.env.CI
};

export const contextOptions: BrowserContextOptions = {
  viewport: {width: 1280, height: 720},
  recordVideo: process.env.CI ? {dir: `test-videos/e2e/${browserName}`} : undefined
};

export const test = new Playwright(Browsers[browserName], launchOptions, contextOptions);
