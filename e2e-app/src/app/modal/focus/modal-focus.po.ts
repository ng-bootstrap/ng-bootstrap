import {$} from 'protractor';

export class ModalFocusPage {
  getModal(selector = 'ngb-modal-window') { return $(selector); }

  getModalText() { return this.getModal().$('div.modal-content').getText(); }

  getModalDismissButton() { return this.getModal().$('div.modal-header button'); }

  getModalCloseButton() { return this.getModal().$('div.modal-footer button'); }

  getModalInput() { return this.getModal().$('div.modal-body input'); }

  getModalHeader() { return this.getModal().$('div.modal-header'); }

  async openModal(type: string) {
    await $(`#open-modal-${type}`).click();
    const modal = this.getModal();
    expect(await modal.isPresent()).toBeTruthy(`A modal of type '${type}' should have been opened`);
    return modal;
  }
}
