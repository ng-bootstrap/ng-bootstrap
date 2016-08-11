import {Component, Input, Output, EventEmitter, TemplateRef} from '@angular/core';
import {NgbHighlight} from './highlight';

import {toString} from '../util/util';

export type ResultTplCtx = {
  result: any,
  term: string,
  formatter: (_: string) => string
};

@Component({
  selector: 'ngb-typeahead-window',
  exportAs: 'ngbTypeaheadWindow',
  host: {'class': 'dropdown-menu', 'style': 'display: block'},
  template: `
    <template #rt let-result="result" let-term="term" let-formatter="formatter">
      <ngb-highlight [result]="formatter(result)" [term]="term"></ngb-highlight>
    </template>
    <template ngFor [ngForOf]="results" let-result let-idx="index">
      <button class="dropdown-item" [class.active]="idx === _activeIdx" 
        (mouseenter)="markActive(idx)" 
        (click)="select(result)">
          <template [ngTemplateOutlet]="resultTemplate || rt" 
          [ngOutletContext]="{result: result, term: term, formatter: formatter}"></template>
      </button>
    </template>
  `
})
export class NgbTypeaheadWindow {
  private _activeIdx = 0;

  /**
   * Typeahead match results to be displayed
   */
  @Input() results;

  /**
   * Search term used to get current results
   */
  @Input() term: string;

  /**
   * A function used to format a given result before display. This function should return a formated string without any
   * HTML markup.
   */
  @Input() formatter = toString;

  /**
   * A template to display a matching result.
   */
  @Input() resultTemplate: TemplateRef<ResultTplCtx>;

  /**
   * Event raised when users selects a particular result row.
   */
  @Output('select') selectEvent = new EventEmitter();

  getActive() { return this.results[this._activeIdx]; }

  markActive(_activeIdx: number) { this._activeIdx = _activeIdx; }

  next() { this._activeIdx = (this._activeIdx + 1) % this.results.length; }

  prev() { this._activeIdx = (this._activeIdx === 0 ? this.results.length - 1 : this._activeIdx - 1); }

  select(item) { this.selectEvent.emit(item); }
}
