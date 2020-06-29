import {$} from 'protractor';

export class ModalNestingPage {
  getModal(selector = 'ngb-modal-window') { return $(selector); }

  getDatepickerButton() { return $('#datepicker-button') as any; }

  getDropdownButton() { return $('#dropdown') as any; }

  getTypeaheadInput() { return $('#typeahead'); }

  async openModal() {
    await $(`#open-modal`).click();
    const modal = this.getModal();
    expect(await modal.isPresent()).toBeTruthy(`A modal should have been opened`);
    return modal as any;
  }
}
