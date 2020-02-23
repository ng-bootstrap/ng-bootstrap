import {$, $$} from 'protractor';

export class ModalStackConfirmationPage {
  getOpenModals() { return $$('ngb-modal-window'); }

  getModal(index) { return this.getOpenModals().get(index); }

  getStackModal() { return $('#stack-modal'); }

  getModalButton() { return $('#open-modal'); }

  getModalCloseButton() { return $('#close'); }

  getConfirmationButton() { return $('#confirm'); }

  getDismissalButton() { return $('#dismiss'); }

  async openModal() {
    await this.getModalButton().click();
    expect(await this.getModal(0).isPresent()).toBeTruthy(`A modal should have been opened`);
  }
}
