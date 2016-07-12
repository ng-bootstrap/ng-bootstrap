import {Component, Input, Output, EventEmitter} from '@angular/core';
import {NgbHighlight} from './highlight';

@Component({
  selector: 'ngb-typeahead-window',
  exportAs: 'ngbTypeaheadWindow',
  template: `
    <div class="dropdown-menu" aria-labelledby="dropdownMenu1">
      <template ngFor [ngForOf]="results" let-result let-idx="index">
        <a class="dropdown-item" [class.active]="idx === activeIdx" 
          (mouseenter)="markActive(idx)" 
          (click)="select(result)"><ngb-highlight [result]="formatter(result)" [term]="term"></ngb-highlight></a>
      </template>
    </div>
  `,
  directives: [NgbHighlight]
})
export class NgbTypeaheadWindow {
  private activeIdx = 0;

  /**
   * Event raised when users selects a particular result row.
   */
  @Output('select') selectEvent = new EventEmitter();

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
  @Input() formatter = (result) => { return `${result}`; };


  markActive(activeIdx: number) { this.activeIdx = activeIdx; }

  next() { this.activeIdx = (this.activeIdx + 1) % this.results.length; }

  prev() { this.activeIdx = (this.activeIdx === 0 ? this.results.length - 1 : this.activeIdx - 1); }

  select(item) { this.selectEvent.emit(item); }
}
