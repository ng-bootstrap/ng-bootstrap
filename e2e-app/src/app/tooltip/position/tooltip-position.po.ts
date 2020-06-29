import {$} from 'protractor';

export class TooltipPositionPage {
  getTooltip() { return $('ngb-tooltip-window') as any; }

  getTooltipButton(type: string) { return $(`#btn-${type}`); }

  async selectPosition(position: string) { await $(`#flex-${position}`).click(); }
}
