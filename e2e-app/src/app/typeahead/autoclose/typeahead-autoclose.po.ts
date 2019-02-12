import {$} from 'protractor';
import {TypeaheadPage} from '../typeahead.po';
import {rightClick} from '../../tools.po';

export class TypeaheadAutoClosePage extends TypeaheadPage {
  getOpenStatus() { return $('#open-status'); }

  getOutsideButton() { return $('#outside-button'); }

  async rightClickOutside() { await rightClick($('#outside-button')); }

  async showHint(hint: boolean) {
    await $('#hint-dropdown').click();
    await $(`#hint-${hint}`).click();
  }
}
