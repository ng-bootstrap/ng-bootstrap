import {ModalFocustrapPage} from './modal-focustrap.po';

describe('Modal', () => {
  let page: ModalFocustrapPage;

  beforeEach(async() => {
    page = new ModalFocustrapPage();
    await page.navigateTo();
  });

  it('should be present on the page', async() => {
    const modal = await page.getModal();
    const text = await page.getText(modal);
    expect(text).toEqual('hello modal');
  });
});
