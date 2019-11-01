import {Key} from 'protractor';
import {expectFocused, expectNoOpenModals, openUrl, sendKey} from '../../tools.po';
import {ModalScrollbarPage} from './modal-scrollbar.po';

describe('Modal scrollbar', () => {
  let page: ModalScrollbarPage;

  beforeAll(() => { page = new ModalScrollbarPage(); });

  beforeEach(async() => await openUrl('modal/scrollbar'));

  afterEach(async() => { await expectNoOpenModals(); });

  it('should open the modal, scroll it and close it', async() => {
    // open modal
    await page.openModal();

    // scroll modal
    await page.scrollModal();

    await expectFocused(page.getCloseIcon(), 'Close icon not focused');

    // close the modal
    await sendKey(Key.ESCAPE);
  });
});
