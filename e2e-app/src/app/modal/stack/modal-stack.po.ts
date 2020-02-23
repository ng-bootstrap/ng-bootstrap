import {$} from 'protractor';

export class ModalStackPage {
  getModal() { return $('#modal'); }

  getStackModal() { return $('#stack-modal'); }

  getModalButton() { return $('#open-modal'); }

  getStackModalButton() { return $('#open-inner-modal'); }

  getCloseIcon() { return $('button.close'); }

  async openModal() {
    await this.getModalButton().click();
    expect(await this.getModal().isPresent()).toBeTruthy(`A modal should have been opened`);
  }

  async openStackModal() {
    await this.getStackModalButton().click();
    expect(await this.getStackModal().isPresent()).toBeTruthy(`A second modal should have been opened`);
  }
}
