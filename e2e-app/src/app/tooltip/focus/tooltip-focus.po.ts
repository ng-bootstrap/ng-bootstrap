import {$} from 'protractor';

export class TooltipFocusPage {
  getTooltip() { return $('ngb-tooltip-window'); }

  getButton(type: string) { return $(`#btn-${type}`); }

  getOpenStatus() { return $('#open-status'); }
}
