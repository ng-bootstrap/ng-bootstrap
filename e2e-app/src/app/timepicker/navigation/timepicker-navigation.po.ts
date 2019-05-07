import {$} from 'protractor';

export type Field = 'hour' | 'minute' | 'second';

export class Page {
  getInputBefore() { return $('#before'); }
  getInputAfter() { return $('#after'); }
  getField(field: Field) { return $(`.ngb-tp-${field} > input`); }

  getFields() { return ['hour', 'minute', 'second'].map((field: Field) => this.getField(field)); }
}
