import {$} from 'protractor';

export class TypeaheadPage {
  getInputBefore() { return $('#first'); }

  getTypeaheadInput() { return $('#typeahead'); }

  getDropdown() { return $('ngb-typeahead-window'); }

  getDropdownItems() { return this.getDropdown().$$('button'); }

  async getTypeaheadValue() { return this.getTypeaheadInput().getAttribute('value'); }

  async setTypeaheadValue(text: string) {
    await this.getTypeaheadInput().sendKeys(text);
    expect(await this.getDropdown().isPresent()).toBeTruthy(`Dropdown should be visible`);
  }
}
