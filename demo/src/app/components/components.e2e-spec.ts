import {BASE_URL, playwright} from '../../../playwright.conf';
import {ConsoleMessage} from 'playwright';

const SELECTOR_TAB_LINKS = 'header.title a.nav-link';
const SELECTOR_SIDE_NAV_COMPONENT_LINKS = 'ngbd-side-nav >> a[href^="#/components/"]';
const SELECTOR_CODE_BUTTONS = 'button.toggle-code';

const COMPONENTS = [
  'accordion', 'alert', 'buttons', 'carousel', 'collapse', 'datepicker', 'dropdown', 'modal', 'nav', 'pagination',
  'popover', 'progressbar', 'rating', 'table', 'tabset', 'timepicker', 'toast', 'tooltip', 'typeahead'
];

describe(`Components`, () => {

  let messages: ConsoleMessage[] = [];

  beforeAll(async () => {
    // just opening the 'Components' page to dump initial console messages
    await playwright.newPage();
    playwright.page.on('console', msg => messages.push(msg));

    await playwright.page.goto(`${BASE_URL}/components`);
    await playwright.page.waitForSelector(SELECTOR_SIDE_NAV_COMPONENT_LINKS);
  });

  it('should cover all components we have', async() => {
    for (const link of await playwright.page.$$(SELECTOR_SIDE_NAV_COMPONENT_LINKS)) {
      const componentName = await link.innerText();
      expect(COMPONENTS).toContain(componentName.toLowerCase(), `'${componentName}' is not covered by demo e2e tests`);
    }
  });

  COMPONENTS.forEach(component => {
    describe(`${component} page`, () => {

      const SELECTOR_EXAMPLE_LINK = `a[href="#/components/${component}/examples"]`;
      const SELECTOR_SIDE_NAV_COMPONENT_LINK = `ngbd-side-nav >> a[href^="#/components/${component}"]`;

      beforeAll(async() => {
        messages = [];
        await playwright.page.click(SELECTOR_SIDE_NAV_COMPONENT_LINK);
        await playwright.page.waitForSelector(SELECTOR_TAB_LINKS);
      });

      afterAll(async() => {
        if (messages.length > 0) {
          console.log(messages);
          fail('Unexpected console messages found');
        }
      });

      it(`should display the tabs`, async() => {
        for (const link of await playwright.page.$$(SELECTOR_TAB_LINKS)) {
          await link.click();
        }
      });

      it(`should display code samples`, async() => {
        await playwright.page.click(SELECTOR_EXAMPLE_LINK);
        for (const link of await playwright.page.$$(SELECTOR_CODE_BUTTONS)) {
          await link.click();
        }
      });
    });
  });
});
