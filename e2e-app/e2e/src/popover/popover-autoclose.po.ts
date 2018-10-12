import {$} from 'protractor';
import {expectFocused} from '../tools';

export class PopoverAutoClosePage {
  async close() { await $('#close').click(); }

  async clickOutside() { await $('#outside-button').click(); }

  getPopover() { return $('ngb-popover-window'); }

  getPopoverContent() { return this.getPopover().$('div.popover-body'); }

  async openPopover() {
    await $('button[ngbPopover]').click();
    expect(await this.getPopover().isPresent()).toBeTruthy(`Popover should be visible`);
  }

  async selectAutoClose(type: string) {
    await $('#autoclose-dropdown').click();
    await $(`#autoclose-${type}`).click();
  }

  async reset() {
    await this.close();
    const body = $('body');
    await body.click();

    await expectFocused(body, `Nothing should be focused initially`);
    expect(await this.getPopover().isPresent()).toBeFalsy(`Popover should be hidden initially`);
  }
}
