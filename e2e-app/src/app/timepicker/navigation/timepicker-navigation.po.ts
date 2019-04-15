import {$} from 'protractor';

export type Field = 'hour' | 'minute' | 'second';

export class TimepickerNavigationPage {
  getInputBefore() { return $('#before'); }
  focusInputBefore() { return this.getInputBefore().click(); }

  getInputAfter() { return $('#after'); }
  getField(field: Field) { return $(`.ngb-tp-${field} > input`); }

  getFields() { return ['hour', 'minute', 'second'].map((field: Field) => this.getField(field)); }
}
