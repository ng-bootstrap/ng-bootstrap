import { AppPage } from './app.po';

describe('tmp App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display framework version', () => {
    const expectedVersion = require('../package.json').version;
    page.navigateTo();
    expect(page.getVersionText()).toEqual(expectedVersion);
  });
});
