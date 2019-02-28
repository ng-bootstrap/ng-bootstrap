import { browser } from 'protractor';
import { ApplicationPage } from './app.po';

describe('SSR application', () => {

  const page = new ApplicationPage();

  beforeAll(async () => await browser.get('/'));

  it('should open server side rendered page without failures', async () => {
    expect(await page.getHeading().getText()).toBe('ng-bootstrap SSR test application');
  });
});
