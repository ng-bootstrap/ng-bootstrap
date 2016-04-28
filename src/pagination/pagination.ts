import {Component, EventEmitter, Input, Output, OnChanges, ChangeDetectionStrategy} from 'angular2/core';
import {getValueInRange, toInteger} from '../util/util';

@Component({
  selector: 'ngb-pagination',
  // changeDetection: ChangeDetectionStrategy.OnPush, TODO: https://github.com/angular/angular/issues/8242
  template: `
    <nav>
      <ul class="pagination">
        <li class="page-item" [class.disabled]="!hasPrevious()">
            <a aria-label="Previous" class="page-link" (click)="selectPage(page-1)">
              <span aria-hidden="true">&laquo;</span>
              <span class="sr-only">Previous</span>
            </a>
        </li>

        <li *ngFor="let pageNumber of pages" class="page-item" [class.active]="pageNumber === page">
          <a class="page-link" (click)="selectPage(pageNumber)">{{pageNumber}}</a>
        </li>

        <li class="page-item" [class.disabled]="!hasNext()">
          <a aria-label="Next" class="page-link" (click)="selectPage(page+1)">
            <span aria-hidden="true">&raquo;</span>
            <span class="sr-only">Next</span>
          </a>
        </li>
      </ul>
    </nav>
  `
})
export class NgbPagination implements OnChanges {
  private _collectionSize;
  private _page = 0;
  private _pageSize = 10;
  pages: number[] = [];

  @Input()
  set page(value: number | string) {
    this._page = parseInt(`${value}`, 10);
  }

  get page(): number | string { return this._page; }

  @Input()
  set collectionSize(value: number | string) {
    this._collectionSize = toInteger(value);
  }

  get collectionSize(): number | string { return this._collectionSize; }

  @Input()
  set pageSize(value: number | string) {
    this._pageSize = toInteger(value);
  }

  get pageSize(): number | string { return this._pageSize; }

  @Output() pageChange = new EventEmitter();

  hasPrevious(): boolean { return this.page > 1; }

  hasNext(): boolean { return this.page < this.pages.length; }

  selectPage(pageNumber: number): void {
    var prevPageNo = this.page;
    this._page = this._getPageNoInRange(pageNumber);

    if (this.page != prevPageNo) {
      this.pageChange.emit(this.page);
    }
  }

  ngOnChanges(): void {
    // re-calculate new length of pages
    var pageCount = Math.ceil(this._collectionSize / this._pageSize);

    // fill-in model needed to render pages
    this.pages.length = 0;
    for (var i = 1; i <= pageCount; i++) {
      this.pages.push(i);
    }

    this._page = this._getPageNoInRange(this.page);
  }

  private _getPageNoInRange(newPageNo): number { return getValueInRange(newPageNo, this.pages.length, 1); }
}
