import {$, $$} from 'protractor';

export class ModalStackConfirmationPage {
  getOpenModals() { return $$('ngb-modal-window'); }

  getModal(index) { return this.getOpenModals().get(index); }

  getModalButton() { return $('#open-modal'); }

  getModalClose() { return $('#close'); }

  getConfirmationButton() { return $('#confirm'); }

  getDismissalButton() { return $('#dismiss'); }

  async openModal() {
    await this.getModalButton().click();
    const modal = this.getModal(0);
    expect(await modal.isPresent()).toBeTruthy(`A modal should have been opened`);
    return modal;
  }
}
