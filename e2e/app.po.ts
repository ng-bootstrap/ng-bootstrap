import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo() {
    return browser.get('/');
  }

  getVersionText() {
    return element(by.css('#version')).getText();
  }
}
