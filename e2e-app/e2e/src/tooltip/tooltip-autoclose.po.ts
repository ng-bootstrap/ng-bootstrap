import {$} from 'protractor';
import {expectFocused} from '../tools';

export class TooltipAutoClosePage {

  async close() {
    await $('#close').click();
  }

  async clickOutside() {
    await $('#outside-button').click();
  }

  getTooltip() {
    return $('ngb-tooltip-window');
  }

  getTooltipContent() {
    return this.getTooltip().$('div.tooltip-inner');
  }

  async openTooltip() {
    await $('button[ngbTooltip]').click();
    expect(await this.getTooltip().isPresent()).toBeTruthy(`Tooltip should be visible`);
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
    expect(await this.getTooltip().isPresent()).toBeFalsy(`Tooltip should be hidden initially`);
  }
}
