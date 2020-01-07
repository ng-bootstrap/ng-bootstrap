import {expectNoOpenModals, openUrl, sendKey} from '../../tools.po';
import {ModalStackConfirmationPage} from './modal-stack-confirmation.po';
import {browser, Key, protractor} from 'protractor';

describe('Modal stacked with confirmation', () => {
  let page: ModalStackConfirmationPage;

  beforeAll(() => { page = new ModalStackConfirmationPage(); });

  beforeEach(async() => await openUrl('modal/stack-confirmation'));

  afterEach(async() => { await expectNoOpenModals(); });

  it('should close modals correctly using close button', async() => {
    await page.openModal();

    // close with button
    await page.getModalCloseButton().click();
    expect(await page.getOpenModals().count()).toBe(2, 'Confirmation modal should be opened');

    // cancel closure with button
    await page.getDismissalButton().click();
    expect(await page.getOpenModals().count()).toBe(1, 'Confirmation modal should be dismissed');

    // close again
    await page.getModalCloseButton().click();
    expect(await page.getOpenModals().count()).toBe(2, 'Confirmation modal should be re-opened');

    // close all modals
    await page.getConfirmationButton().click();
  });

  it('should close modals correctly using ESC', async() => {
    await page.openModal();

    // close with Escape
    await sendKey(Key.ESCAPE);
    browser.wait(protractor.ExpectedConditions.presenceOf(page.getDismissalButton()));
    expect(await page.getOpenModals().count()).toBe(2, 'Confirmation modal should be opened');

    // cancel closure with Escape
    await sendKey(Key.ESCAPE);
    browser.wait(protractor.ExpectedConditions.invisibilityOf(page.getDismissalButton()));
    expect(await page.getOpenModals().count()).toBe(1, 'Confirmation modal should be dismissed');

    // close again
    await sendKey(Key.ESCAPE);
    browser.wait(protractor.ExpectedConditions.presenceOf(page.getDismissalButton()));
    expect(await page.getOpenModals().count()).toBe(2, 'Confirmation modal should be re-opened');

    // close all modals
    await page.getConfirmationButton().click();
  });

  it('should close modals correctly using backdrop click', async() => {
    await page.openModal();

    // close with click
    await page.getModal(0).click();
    expect(await page.getOpenModals().count()).toBe(2, 'Confirmation modal should be opened');

    // cancel closure with click
    await page.getModal(1).click();
    expect(await page.getOpenModals().count()).toBe(1, 'Confirmation modal should be dismissed');

    // close again
    await page.getModal(0).click();
    expect(await page.getOpenModals().count()).toBe(2, 'Confirmation modal should be re-opened');

    // close all modals
    await page.getConfirmationButton().click();
  });

});
