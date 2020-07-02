import {$} from 'protractor';

export class ModalNestingPage {
  getModal(selector = 'ngb-modal-window') { return $(selector); }

  getDatepickerButton() { return $('#datepicker-button'); }

  getDropdownButton() { return $('#dropdown'); }

  getTypeaheadInput() { return $('#typeahead'); }

  async openModal() {
    await $(`#open-modal`).click();
    const modal = this.getModal();
    expect(modal.isPresent()).toBeTruthy(`A modal should have been opened`);
    return Promise.resolve(modal);
  }
}
