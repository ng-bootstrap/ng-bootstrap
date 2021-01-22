import {
  chromium,
  firefox,
  webkit,
  BrowserType,
  BrowserContext,
  Page,
  ChromiumBrowser,
  FirefoxBrowser,
  WebKitBrowser,
  LaunchOptions,
  BrowserContextOptions
} from 'playwright';

export const Browsers = {chromium, firefox, webkit};

export type BrowserInstance = ChromiumBrowser | FirefoxBrowser | WebKitBrowser;
export type BrowserTypes = BrowserType<BrowserInstance>;
export type PlaywrightParams = {
  browser: BrowserTypes,
  launchOptions: LaunchOptions,
  contextOptions: BrowserContextOptions
};

export class Playwright {
  private browser: BrowserTypes;
  private launchOptions: LaunchOptions;
  private contextOptions: BrowserContextOptions;
  private context: BrowserContext;

  private _page: Page;

  constructor({browser, launchOptions: _launchOptions, contextOptions: _contextOptions}: PlaywrightParams) {
    this.browser = browser;
    this.launchOptions = _launchOptions;
    this.contextOptions = _contextOptions;
  }

  get page(): Page {
    return this._page;
  }

  private async launchBrowser() {
    if (!this.context) {
      const browserInstance: BrowserInstance = await this.browser.launch(this.launchOptions);
      this.context = await browserInstance.newContext(this.contextOptions);

      // Default timeout used to wait for selector/actions reuiring timeout
      this.context.setDefaultTimeout(2000);
    }
  }

  async newPage(): Promise<Page> {
    if (this._page && !this._page.isClosed()) {
      await this._page.close();
    }

    if (!this.context) {
      await this.launchBrowser();
    }
    this._page = await this.context.newPage();
    return this._page;
  }

  /**
   *
   * @param timeoutInSeconds number of seconds to wait (default: 1000s)
   */
  async pause(timeoutInSeconds = 1000, msg?: string) {
    console.log(`Warning : pause done for ${timeoutInSeconds}s` + (msg ? ` (${msg})` : ''));
    await this._page.waitForTimeout(timeoutInSeconds * 1000);
  }
}
