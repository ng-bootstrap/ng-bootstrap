import {browser} from 'protractor';

beforeAll(async() => await browser.get('#/'));

afterEach(async() => {
  const browserLog = await browser.manage().logs().get('browser');

  if (browserLog.length > 0) {
    console.error(browserLog);
    fail(`Unexpected console messages found`);
  }
});
