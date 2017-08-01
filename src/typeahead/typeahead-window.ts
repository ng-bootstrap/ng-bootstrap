import {Component, Input, Output, EventEmitter, TemplateRef, OnInit} from '@angular/core';

import {toString} from '../util/util';

/**
 * Context for the typeahead window template in case you want to override the default one
 */
export interface WindowTemplateContext {
  /**
   * Your typeahead results data model
   */
  results: any;

  /**
   * Search term from the input used to get current result
   */
  term: string;

  /**
   * Typeahead window context
   */
  context: NgbTypeaheadWindow;
}


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

/**
 * Context for the typeahead no results template
 */
export interface NoResultsTemplateContext {
  /**
   * Search term from the input that did not return any results
   */
  term: string;
}

@Component({
  selector: 'ngb-typeahead-window',
  exportAs: 'ngbTypeaheadWindow',
  host: {'class': 'dropdown-menu', 'style': 'display: block', 'role': 'listbox', '[id]': 'id'},
  template: `
    <ng-template #rt let-result="result" let-term="term" let-formatter="formatter">
      <ngb-highlight [result]="formatter(result)" [term]="term"></ngb-highlight>
    </ng-template>
    <ng-template #wt let-results="results" let-context="context">
      <ng-template ngFor [ngForOf]="results" let-result let-idx="index">
        <button type="button" class="dropdown-item" role="option"
          [id]="id + '-' + idx"
          [class.active]="idx === activeIdx"
          (mouseenter)="context.markActive(idx)"
          (click)="context.select(result)">
            <ng-template [ngTemplateOutlet]="resultTemplate || rt"
            [ngOutletContext]="{result: result, term: term, formatter: formatter}"></ng-template>
        </button>
      </ng-template>
    </ng-template>
    <ng-template [ngTemplateOutlet]="windowTemplate || wt"
      [ngOutletContext]="_getWindowContext()"> 
    </ng-template>
    <ng-template *ngIf="!results || results.length === 0"
      [ngTemplateOutlet]="noResultsTemplate"
      [ngOutletContext]="_getNoResultsContext()">
    </ng-template>
  `
})
export class NgbTypeaheadWindow implements OnInit {
  private _results: Array<any>;
  private _term: string;
  private _context: WindowTemplateContext = {results: this._results, term: this._term, context: this};
  activeIdx = 0;


  /**
   *  The id for the typeahead widnow. The id should be unique and the same
   *  as the associated typeahead's id.
   */
  @Input() id: string;

  /**
   * Flag indicating if the first row should be active initially
   */
  @Input() focusFirst = true;

  /**
   * Typeahead match results to be displayed. Created as get and set so the ngOutletContext is only recreated on data
   * changes.
   */
  @Input()
  get results() {
    return this._results;
  };
  set results(value: any) {
    this._results = value;
    this._context.results = value;
  }

  /**
   * Search term used to get current results. Created as get and set so the ngOutletContext is only recreated on data
   * changes.
   */
  @Input()
  get term(): string {
    return this._term;
  };
  set term(value: string) {
    this._term = value;
    this._context.term = value;
  }

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
   * A template used to display a no results message in the dropdown window
   */
  @Input() noResultsTemplate: TemplateRef<any>;

  /**
   * A template to override a matching result default display
   */
  @Input() windowTemplate: TemplateRef<WindowTemplateContext>;

  /**
   * Event raised when user selects a particular result row
   */
  @Output('select') selectEvent = new EventEmitter();

  @Output('activeChange') activeChangeEvent = new EventEmitter();

  _getWindowContext() { return this._context; }


  _getNoResultsContext() { return {term: this.term}; }
  getActive() { return this.results[this.activeIdx]; }

  markActive(activeIdx: number) {
    this.activeIdx = activeIdx;
    this._activeChanged();
  }

  next() {
    if (this.activeIdx === this.results.length - 1) {
      this.activeIdx = this.focusFirst ? (this.activeIdx + 1) % this.results.length : -1;
    } else {
      this.activeIdx++;
    }
    this._activeChanged();
  }

  prev() {
    if (this.activeIdx < 0) {
      this.activeIdx = this.results.length - 1;
    } else if (this.activeIdx === 0) {
      this.activeIdx = this.focusFirst ? this.results.length - 1 : -1;
    } else {
      this.activeIdx--;
    }
    this._activeChanged();
  }

  select(item) { this.selectEvent.emit(item); }

  ngOnInit() {
    this.activeIdx = this.focusFirst ? 0 : -1;
    this._activeChanged();
  }

  private _activeChanged() {
    this.activeChangeEvent.emit(this.activeIdx >= 0 ? this.id + '-' + this.activeIdx : undefined);
  }
}
