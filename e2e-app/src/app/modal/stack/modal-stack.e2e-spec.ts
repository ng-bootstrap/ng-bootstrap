import {Key} from 'protractor';
import {expectFocused, expectNoOpenModals, openUrl, sendKey} from '../../tools.po';
import {ModalStackPage} from './modal-stack.po';

describe('Modal stacked', () => {
  let page: ModalStackPage;

  beforeAll(() => { page = new ModalStackPage(); });

  beforeEach(async() => await openUrl('modal/stack'));

  afterEach(async() => { await expectNoOpenModals(); });

  it('should keep tab on the first modal after the second modal has closed', async() => {
    await page.openModal();
    await page.openStackModal();

    // close the stack modal
    await sendKey(Key.ESCAPE);

    // Check that the button is focused again
    await expectFocused(page.getStackModalButton(), 'Button element not focused');
    await sendKey(Key.TAB);

    await expectFocused(page.getCoseIcon(), 'Close icon not focused');

    // close the main modal
    await sendKey(Key.ESCAPE);

  });

});
