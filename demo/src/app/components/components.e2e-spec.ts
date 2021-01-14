import {browser} from 'protractor';
import {
  getLinkElement,
  getComponentTabsLinks,
  getCodeToggleElement,
  getCodeElements,
  scrollIntoView
} from '../tools.po';



describe(`Components`, () => {

  beforeAll(async() => { await getLinkElement(`components`).click(); });

  const components = [
    'accordion', 'alert', 'buttons', 'carousel', 'collapse', 'datepicker', 'dropdown', 'modal', 'nav', 'pagination',
    'popover', 'progressbar', 'rating', 'table', 'tabset', 'timepicker', 'toast', 'tooltip', 'typeahead'
  ];
  components.forEach((component) => {
    describe(`${component} page`, () => {


      beforeAll(async() => {
        const selector = `components/${component}`;
        await scrollIntoView(`a[href="#/${selector}"]`);
        await getLinkElement(selector).click();
      });

      afterAll(async() => {
        const browserLog = await browser.manage().logs().get('browser');
        if (browserLog.length > 0) {
          console.error(browserLog);
          fail(`Unexpected console messages found`);
        }
      });

      it(`should display the tabs`, async() => {
        const links = getComponentTabsLinks(component);
        const nbTabs = await links.count();
        for (let i = 0; i < nbTabs; i++) {
          await links.get(i).click();
        }
      });

      it(`should display code samples`, async() => {
        await getLinkElement(`components/${component}/examples`).click();

        const initialCodeElements = await getCodeElements().count();
        await getCodeToggleElement().click();
        expect(await getCodeElements().count()).toBe(initialCodeElements + 1);
        await getCodeToggleElement().click();
        expect(await getCodeElements().count()).toBe(initialCodeElements);
      });

    });

  });
});
