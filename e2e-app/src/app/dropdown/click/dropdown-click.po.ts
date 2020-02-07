import {$, $$, Key} from 'protractor';
import {DropdownPage} from '../dropdown.po';
import {expectFocused, sendKey} from '../../tools.po';

export class DropdownClickPage extends DropdownPage {
  async toggleItem(index: number) {
    await $('#before').click();
    await sendKey(Key.TAB);
    await expectFocused(this.getDropdownToggle(), `dropdown should be focused`);
    for (let i = 0; i <= index; ++i) {
      await sendKey(Key.ARROW_DOWN);
    }
    await sendKey(Key.TAB);
    await expectFocused(this.getDropdownItem(index), `Item should be focused`);
  }

  getDropdownItem(index: number) { return $$(`[ngbDropdownItem]`).get(index); }

  getSpaceClickLabel() { return $('#space-click'); }

  getEnterClickLabel() { return $('#enter-click'); }

  getEnterKeyLabel() { return $('#enter-key'); }

  getSpaceKeyLabel() { return $('#space-key'); }
}
