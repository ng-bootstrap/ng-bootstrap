import {$} from 'protractor';

export class TooltipAutoClosePage {
  async clickOutside() { await $('#outside-button').click(); }

  getOpenStatus() { return $('#open-status'); }

  getTooltip() { return $('ngb-tooltip-window'); }

  getTooltipContent() { return this.getTooltip().$('div.tooltip-inner'); }

  async openTooltip() {
    await $('button[ngbTooltip]').click();
    expect(await this.getTooltip().isPresent()).toBeTruthy(`Tooltip should be visible`);
  }

  async selectAutoClose(type: string) {
    await $('#autoclose-dropdown').click();
    await $(`#autoclose-${type}`).click();
  }
}
