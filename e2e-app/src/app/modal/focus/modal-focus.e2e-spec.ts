import {ModalFocusPage} from './modal-focus.po';
import {expectFocused, expectNoOpenModals, openUrl, sendKey} from '../../tools.po';
import {$, Key} from 'protractor';

describe('Modal', () => {
  let page: ModalFocusPage;

  beforeAll(() => page = new ModalFocusPage());

  beforeEach(async() => await openUrl('modal/focus'));

  afterEach(async() => {
    await sendKey(Key.ESCAPE);
    await expectNoOpenModals();
  });

  it('should close modal on ESC and re-focus trigger button', async() => {
    await page.openModal('simple');

    // close
    await sendKey(Key.ESCAPE);
    expect(await page.getModal().isPresent()).toBeFalsy('The modal should be closed on ESC');

    // button should be focused
    await expectFocused($('#open-modal-simple'), 'Should focus trigger button after closing');
  });

  it('should close modal on window click and re-focus trigger button', async() => {
    const modal = await page.openModal('simple');

    // close
    await modal.click();
    expect(await modal.isPresent()).toBeFalsy('The modal should be closed on ESC');

    // button should be focused
    await expectFocused($('#open-modal-simple'), 'Should focus trigger button after closing');
  });

  it('should focus modal window if there is no focusable content after opening', async() => {
    const modal = await page.openModal('simple');

    // window should be focused
    expect(await page.getModalText()).toBe('Modal content');
    await expectFocused(modal, 'ngb-modal-window should be focused');
  });

  it('should focus first focusable element after opening', async() => {
    await page.openModal('template');

    await expectFocused(page.getModalDismissButton(), 'Modal dismiss button should be focused');
  });

  it('should focus element with [ngbAutofocus] after opening', async() => {
    await page.openModal('autofocus');

    await expectFocused(page.getModalCloseButton(), 'Modal close button should be focused, because of ngbAutoFocus');
  });

  it('should trap focus inside opened modal (Tab)', async() => {
    await page.openModal('template');

    // dismiss -> input -> close -> dismiss
    await expectFocused(page.getModalDismissButton(), 'Modal dismiss button should be focused');

    await sendKey(Key.TAB);
    await expectFocused(page.getModalInput(), 'Modal input should be focused');

    await sendKey(Key.TAB);
    await expectFocused(page.getModalCloseButton(), 'Modal close button should be focused');

    await sendKey(Key.TAB);
    await expectFocused(page.getModalDismissButton(), 'Modal dismiss button should be focused');
  });

  it('should trap focus inside opened modal (Shift + Tab)', async() => {
    await page.openModal('template');

    // dismiss -> close -> input -> dismiss
    await expectFocused(page.getModalDismissButton(), 'Modal dismiss button should be focused');

    await sendKey(Key.SHIFT, Key.TAB);
    await expectFocused(page.getModalCloseButton(), 'Modal close button should be focused');

    await sendKey(Key.SHIFT, Key.TAB);
    await expectFocused(page.getModalInput(), 'Modal input should be focused');

    await sendKey(Key.SHIFT, Key.TAB);
    await expectFocused(page.getModalDismissButton(), 'Modal dismiss button should be focused');
  });

  it('should keep focus trap inside the modal when clicking on content and navigating away (Tab)', async() => {
    const modal = await page.openModal('template');

    // click on the header
    await page.getModalHeader().click();
    await expectFocused(modal, 'Modal window should be focused');

    // re-focus
    await sendKey(Key.TAB);
    await expectFocused(page.getModalDismissButton(), 'Modal dismiss button should be focused');
  });

  it('should keep focus trap inside the modal when clicking on content and navigating away (Shift + Tab)', async() => {
    const modal = await page.openModal('template');

    // click on the header
    await page.getModalHeader().click();
    await expectFocused(modal, 'Modal window should be focused');

    // re-focus
    await sendKey(Key.SHIFT, Key.TAB);
    await expectFocused(page.getModalCloseButton(), 'Modal close button should be focused');
  });
});
