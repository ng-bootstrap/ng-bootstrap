import {Component, Input, Output, EventEmitter, TemplateRef} from '@angular/core';

import {toString} from '../util/util';

/**
 * Context for the typeahead result template in case you want to override the default one
 */
export interface ResultTemplateContext {
  /**
   * Your typeahead result data model
   */
  result: any;

  /**
   * Search term from the input used to get current result
   */
  term: string;
}

@Component({
  selector: 'ngb-typeahead-window',
  exportAs: 'ngbTypeaheadWindow',
  host: {'class': 'dropdown-menu', 'style': 'display: block'},
  template: `
    <template #rt let-result="result" let-term="term" let-formatter="formatter">
      <ngb-highlight [result]="formatter(result)" [term]="term"></ngb-highlight>
    </template>
    <template ngFor [ngForOf]="results" let-result let-idx="index">
      <button type="button" class="dropdown-item" [class.active]="idx === activeIdx" 
        (mouseenter)="markActive(idx)" 
        (click)="select(result)">
          <template [ngTemplateOutlet]="resultTemplate || rt" 
          [ngOutletContext]="{result: result, term: term, formatter: formatter}"></template>
      </button>
    </template>
  `
})
export class NgbTypeaheadWindow {
  activeIdx = 0;

  /**
   * Typeahead match results to be displayed
   */
  @Input() results;

  /**
   * Search term used to get current results
   */
  @Input() term: string;

  /**
   * A function used to format a given result before display. This function should return a formatted string without any
   * HTML markup
   */
  @Input() formatter = toString;

  /**
   * A template to override a matching result default display
   */
  @Input() resultTemplate: TemplateRef<ResultTemplateContext>;

  /**
   * Event raised when user selects a particular result row
   */
  @Output('select') selectEvent = new EventEmitter();

  getActive() { return this.results[this.activeIdx]; }

  /**
   * @internal
   */
  markActive(activeIdx: number) { this.activeIdx = activeIdx; }

  next() { this.activeIdx = (this.activeIdx + 1) % this.results.length; }

  prev() { this.activeIdx = (this.activeIdx === 0 ? this.results.length - 1 : this.activeIdx - 1); }

  /**
   * @internal
   */
  select(item) { this.selectEvent.emit(item); }
}
