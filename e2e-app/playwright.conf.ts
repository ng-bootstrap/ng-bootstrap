import {BrowserContextOptions, LaunchOptions, Page} from 'playwright';
import {Browsers, Playwright} from '../playwright/controller';

type BrowserName = 'chromium' | 'firefox' | 'webkit';

export const baseUrl = 'http://localhost:4200/#';
export const browserName: BrowserName = (process.env.BROWSER || 'chromium').trim() as BrowserName;

console.log('Test suite is configured for browser:', browserName);

export const launchOptions: LaunchOptions = {
  headless: !!process.env.TRAVIS
};

export const contextOptions: BrowserContextOptions = {
  viewport: {width: 1280, height: 720}
};

export const test = new Playwright(Browsers[browserName], launchOptions, contextOptions);
export function page(): Page {
  return test.page;
}
