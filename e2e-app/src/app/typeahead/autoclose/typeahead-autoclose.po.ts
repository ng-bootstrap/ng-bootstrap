import {$} from 'protractor';
import {TypeaheadPage} from '../typeahead.po';

export class TypeaheadAutoClosePage extends TypeaheadPage {
  getOutsideButton() { return $('#outside-button'); }

  async showHint(hint: boolean) {
    await $('#hint-dropdown').click();
    await $(`#hint-${hint}`).click();
  }
}
