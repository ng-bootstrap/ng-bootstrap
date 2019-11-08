import {browser} from 'protractor';
import {isLogActionSupported} from './tools.po';

beforeAll(async() => await browser.get('#/'));

afterEach(async() => {
  if (await isLogActionSupported()) {
    const browserLog = await browser.manage().logs().get('browser');

    if (browserLog.length > 0) {
      console.error(browserLog);
      fail(`Unexpected console messages found`);
    }
  }
});
