import {$, $$} from 'protractor';

export class ModalStackPage {
  getModal(index) { return $$('ngb-modal-window').get(index); }

  getModalButton() { return $('#open-modal'); }

  getStackModalButton() { return $('#open-inner-modal'); }

  getCoseIcon() { return $('button.close'); }

  async openModal() {
    await this.getModalButton().click();
    const modal = this.getModal(0);
    expect(await modal.isPresent()).toBeTruthy(`A modal should have been opened`);
    return modal;
  }

  async openStackModal() {
    await this.getStackModalButton().click();
    const modal = this.getModal(1);
    expect(await modal.isPresent()).toBeTruthy(`A second modal should have been opened`);
    return modal;
  }
}
