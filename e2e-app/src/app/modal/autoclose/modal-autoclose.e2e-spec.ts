import {ModalAutoClosePage} from './modal-autoclose.po';
import {expectNoOpenModals, openUrl, sendKey} from '../../tools.po';
import {browser, Key} from 'protractor';

describe('Modal', () => {
  let page: ModalAutoClosePage;

  beforeAll(() => page = new ModalAutoClosePage());

  beforeEach(async() => {
    await openUrl('modal/autoclose');
    await page.getResetButton().click();
  });

  afterEach(async() => { await expectNoOpenModals(); });

  it('should close modal from the inside', async() => {
    const modal = await page.openModal();

    // close
    await page.getModalCloseButton().click();
    expect(await modal.isPresent()).toBeFalsy('The modal should be closed imperatively');
    expect(await page.getDismissReason()).toBe('Closed', `Modal should have been closed`);
  });

  it('should close modal on ESC', async() => {
    await page.openModal();

    // close
    await sendKey(Key.ESCAPE);
    await expectNoOpenModals('The modal should be closed on ESC');
    expect(await page.getDismissReason()).toBe('Escape', `Modal should have been dismissed with 'Escape' reason`);
  });

  it(`should NOT close modal on ESC when keyboard === 'false'`, async() => {
    const modal = await page.openModal('no-keyboard');

    // close
    await sendKey(Key.ESCAPE);
    expect(await modal.isPresent()).toBeTruthy('The modal should stay opened on ESC');
    await page.getModalCloseButton().click();
  });

  it('should close modal on backdrop click', async() => {
    const modal = await page.openModal();

    // dialog click
    await page.getModalDialog().click();
    expect(await modal.isPresent()).toBeTruthy('The modal should stay opened on dialog click');

    // close
    await modal.click();
    expect(await modal.isPresent()).toBeFalsy('The modal should be closed on backdrop click');
    expect(await page.getDismissReason()).toBe('Click', `Modal should have been dismissed with 'Click' reason`);
  });

  it('should close modal when dragging from backdrop -> dialog', async() => {
    const modal = await page.openModal();

    // close
    const dialog = await page.getModalDialog();
    await browser.actions().dragAndDrop(modal, dialog).mouseUp().perform();
    expect(await modal.isPresent()).toBeFalsy('The modal should be closed on drag from backdrop -> dialog');
    expect(await page.getDismissReason()).toBe('Click', `Modal should have been dismissed with 'Click' reason`);
  });

  it('should NOT close modal when dragging from dialog -> backdrop', async() => {
    const modal = await page.openModal();

    // close
    const dialog = await page.getModalDialog();
    await browser.actions().dragAndDrop(dialog, modal).mouseUp().perform();
    expect(await modal.isPresent()).toBeTruthy('The modal should stay opened on drag from dialog -> backdrop');
    await page.getModalCloseButton().click();
  });


  it(`should NOT close modal on 'static' backdrop click`, async() => {
    const modal = await page.openModal('backdrop-static');

    // dialog click
    await page.getModalDialog().click();
    expect(await modal.isPresent()).toBeTruthy('The modal should stay opened on dialog click');

    // close
    await modal.click();
    expect(await modal.isPresent()).toBeTruthy('The modal should stay opened on backdrop click');
    await page.getModalCloseButton().click();
  });

  it(`should NOT close modal on click with no backdrop`, async() => {
    const modal = await page.openModal('backdrop-false');

    // dialog click
    await page.getModalDialog().click();
    expect(await modal.isPresent()).toBeTruthy('The modal should stay opened on dialog click');

    // close
    await modal.click();
    expect(await modal.isPresent()).toBeTruthy('The modal should stay opened on backdrop click');
    await page.getModalCloseButton().click();
  });
});
