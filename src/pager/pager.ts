import {Component, ChangeDetectionStrategy, OnChanges, Input, Output, EventEmitter} from '@angular/core';

/**
 * A lightweight pager directive that is focused on providing previous/next paging functionality.
 */
@Component({
  selector: 'ngb-pager',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav>
      <ul class="pager">
        <li [class.disabled]="!hasPrev()" [class.pager-prev]="alignLinks"><a (click)="prev()">Previous</a></li>
        <li [class.disabled]="!hasNext()" [class.pager-next]="alignLinks"><a (click)="next()">Next</a></li>
      </ul>
    </nav>
    `
})
export class NgbPager implements OnChanges {
  private _currentPage = 0;  // internal state

  /**
   *  Number of pages present.
   */
  @Input() noOfPages: number;

  /**
   *  Current page.
   */
  @Input() page: number;

  /**
   *  A flag for determining whether links need to be aligned.
   */
  @Input() alignLinks = false;

  /**
   *  An event fired when the page is changed.
   *  Event's payload equals the current page.
   */
  @Output() pageChange = new EventEmitter();

  prev(): void {
    if (this.hasPrev()) {
      this.pageChange.emit(--this._currentPage);
    }
  }

  next(): void {
    if (this.hasNext()) {
      this.pageChange.emit(++this._currentPage);
    }
  }

  hasPrev(): boolean { return this._currentPage > 0; }

  hasNext(): boolean { return this._currentPage < this.noOfPages - 1; }

  ngOnChanges(): void { this._currentPage = Math.max(Math.min(this.page, this.noOfPages - 1), 0); }
}

export const NGB_PAGER_DIRECTIVES = [NgbPager];
