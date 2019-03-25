import {$, Key} from 'protractor';
import {DropdownPage} from '../dropdown.po';
import {expectFocused, sendKey} from '../../tools.po';

export class DropdownFocusPage extends DropdownPage {
  async focusToggle() {
    await $('#before').click();
    await sendKey(Key.TAB);
    await expectFocused(this.getDropdownToggle(), `dropdown should be focused`);
  }

  getDropdownItem(item: number) { return $(`#item-${item}`); }

  async selectContainer(container: string) { await $(`#container-${container}`).click(); }
}
