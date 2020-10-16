import {LaunchOptions, BrowserContextOptions} from 'playwright';

type BrowserName = 'chromium' | 'firefox' | 'webkit';

export const baseUrl = 'http://localhost:4200/#';
export const browserName: BrowserName = (process.env.BROWSER || 'chromium').trim() as BrowserName;

console.log('Test suite is configured for browser:', browserName);

export const launchOptions: LaunchOptions = process.env.TRAVIS ? {headless: true} : {headless: false};

// export const contextOptions: BrowserContextOptions = process.env.TRAVIS ? {viewport: {width: 1280, height: 720}} :
// {};
export const contextOptions: BrowserContextOptions = {
  viewport: {width: 1280, height: 720}
};
