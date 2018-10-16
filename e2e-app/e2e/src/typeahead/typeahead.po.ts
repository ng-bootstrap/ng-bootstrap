import {$, Key} from 'protractor';

export class TypeaheadPage {
  getInputBefore() { return $('#first'); }

  getTypeaheadInput() { return $('#typeahead'); }

  getDropdown() { return $('ngb-typeahead-window'); }

  getDropdownItems() { return this.getDropdown().$$('button'); }

  async getTypeaheadValue() { return this.getTypeaheadInput().getAttribute('value'); }
}
