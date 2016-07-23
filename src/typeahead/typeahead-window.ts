import {Component, Input, Output, EventEmitter, TemplateRef} from '@angular/core';
import {NgbHighlight} from './highlight';

import {toString} from '../util/util';

class ResultTplCtx {
  constructor(public result, public term: string, public formatter: (result) => string) {}
}

@Component({
  selector: 'ngb-typeahead-window',
  exportAs: 'ngbTypeaheadWindow',
  template: `
    <template #rt let-result="result" let-term="term" let-formatter="formatter">
      <ngb-highlight [result]="formatter(result)" [term]="term"></ngb-highlight>
    </template>
    <div class="dropdown-menu" aria-labelledby="dropdownMenu1">
      <template ngFor [ngForOf]="results" let-result let-idx="index">
        <a class="dropdown-item" [class.active]="idx === _activeIdx" 
          (mouseenter)="markActive(idx)" 
          (click)="select(result)">
            <template [ngTemplateOutlet]="resultTemplate || rt" [ngOutletContext]="_prepareTplCtx(result)"></template>
        </a>
      </template>
    </div>
  `,
  directives: [NgbHighlight]
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
  @Input() term;

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

  markActive(_activeIdx: number) { this._activeIdx = _activeIdx; }

  next() { this._activeIdx = (this._activeIdx + 1) % this.results.length; }

  prev() { this._activeIdx = (this._activeIdx === 0 ? this.results.length - 1 : this._activeIdx - 1); }

  select(item) { this.selectEvent.emit(item); }

  private _prepareTplCtx(result: any) { return new ResultTplCtx(result, this.term, this.formatter); }
}
