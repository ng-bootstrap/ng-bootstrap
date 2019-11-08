import {$} from 'protractor';

export class ModalAutoClosePage {
  getModal(selector = 'ngb-modal-window') { return $(selector); }

  getModalCloseButton() { return $('#modal-close-button'); }

  getDismissReason() { return $('#dismiss-reason').getText(); }

  getResetButton() { return $('#reset-button'); }

  async openModal(option = '') {
    if (option !== '') {
      await $(`#option-${option}`).click();
    }

    await $('#open-modal').click();

    const modal = this.getModal();
    expect(await modal.isPresent()).toBeTruthy(`A modal should have been opened`);
    return modal;
  }
}
