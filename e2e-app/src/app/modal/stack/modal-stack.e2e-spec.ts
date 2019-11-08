import {$, Key} from 'protractor';
import {expectFocused, expectNoOpenModals, openUrl, sendKey} from '../../tools.po';
import {ModalStackPage} from './modal-stack.po';

const bodyClass = () => $('body').getAttribute('class');

describe('Modal stacked', () => {
  let page: ModalStackPage;

  beforeAll(() => { page = new ModalStackPage(); });

  beforeEach(async() => await openUrl('modal/stack'));

  afterEach(async() => { await expectNoOpenModals(); });

  it('should keep tab on the first modal after the second modal has closed', async() => {
    await page.openModal();
    await page.openStackModal();
    expect(await bodyClass()).toContain('modal-open', `body should have 'modal-open' class`);

    // close the stack modal
    await sendKey(Key.ESCAPE);
    expect(await bodyClass()).toContain('modal-open', `body should have 'modal-open' class`);

    // Check that the button is focused again
    await expectFocused(page.getStackModalButton(), 'Button element not focused');
    await sendKey(Key.TAB);

    await expectFocused(page.getCoseIcon(), 'Close icon not focused');

    // close the main modal
    await sendKey(Key.ESCAPE);
    expect(await bodyClass()).not.toContain('modal-open', `body should have 'modal-open' class`);
  });

});
