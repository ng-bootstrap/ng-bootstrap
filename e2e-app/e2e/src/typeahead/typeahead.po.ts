import {$, Key, browser} from 'protractor';
import {sendKey} from '../tools';
import {expectFocused} from '../tools';

export class TypeaheadPage {
  getInputBefore() { return $('#first'); }

  getTypeaheadInput() { return $('#typeahead'); }

  getDropdown() { return $('ngb-typeahead-window'); }

  getDropdownItems() { return this.getDropdown().$$('button'); }

  async clearText() {
    const typeahead = this.getTypeaheadInput();
    await typeahead.click();
    await typeahead.sendKeys(Key.ESCAPE);
    await typeahead.clear();
  }

  async getTypeaheadValue() { return this.getTypeaheadInput().getAttribute('value'); }

  async reset() {
    await this.clearText();
    const body = $('body');
    await body.click();
    await body.sendKeys(Key.ESCAPE);

    await expectFocused(body, `Nothing should be focused initially`);
    expect(await this.getDropdown().isPresent()).toBeFalsy(`Typeahead should be closed initially`);
    expect(await this.getInputBefore().getAttribute('value'))
        .toBe('', `Input before typeahead should be cleared initially`);
    expect(await this.getTypeaheadValue()).toBe('', `Typeahead input should be cleared initially`);
  }
}
