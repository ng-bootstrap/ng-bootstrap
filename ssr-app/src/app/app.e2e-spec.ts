import {BASE_URL, playwright} from '../../playwright.conf';
import {ConsoleMessage} from 'playwright';

const SELECTOR_HEADER = 'h1';

describe('SSR application', () => {

  const messages: ConsoleMessage[] = [];

  beforeAll(async () => {
    await playwright.newPage();
    playwright.page.on('console', msg => messages.push(msg));

    await playwright.page.goto(BASE_URL);
    await playwright.page.waitForSelector(SELECTOR_HEADER);
  });

  afterAll(async() => {
    if (messages.length > 0) {
      console.log(messages);
      fail('Unexpected console messages found');
    }
  });

  it('should open server side rendered page without failures', async () => {
    expect(await playwright.page.innerText(SELECTOR_HEADER)).toBe('ng-bootstrap SSR test application');
  });
});
