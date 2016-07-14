import {Component, EventEmitter, Input, Output, OnChanges, ChangeDetectionStrategy} from '@angular/core';
import {getValueInRange, toInteger, toBoolean} from '../util/util';

/**
 * A directive that will take care of visualising a pagination bar and enable / disable buttons correctly!
 */
@Component({
  selector: 'ngb-pagination',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav>
      <ul [class]="'pagination' + (size ? ' pagination-' + size : '')">
        <li *ngIf="boundaryLinks" class="page-item" [class.disabled]="!hasPrevious()">
          <a aria-label="First" class="page-link" (click)="selectPage(1)">
            <span aria-hidden="true">&laquo;&laquo;</span>
            <span class="sr-only">First</span>
          </a>                
        </li>
      
        <li *ngIf="directionLinks"class="page-item" [class.disabled]="!hasPrevious()">
          <a aria-label="Previous" class="page-link" (click)="selectPage(page-1)">
            <span aria-hidden="true">&laquo;</span>
            <span class="sr-only">Previous</span>
          </a>
        </li>

        <li *ngFor="let pageNumber of pages" class="page-item" [class.active]="pageNumber === page" 
          [class.disabled]="_isEllipsis(pageNumber)">
          <a *ngIf="_isEllipsis(pageNumber)" class="page-link">...</a>
          <a *ngIf="!_isEllipsis(pageNumber)" class="page-link" (click)="selectPage(pageNumber)">{{pageNumber}}</a>
        </li>

        <li *ngIf="directionLinks" class="page-item" [class.disabled]="!hasNext()">
          <a aria-label="Next" class="page-link" (click)="selectPage(page+1)">
            <span aria-hidden="true">&raquo;</span>
            <span class="sr-only">Next</span>
          </a>
        </li>
        
        <li *ngIf="boundaryLinks" class="page-item" [class.disabled]="!hasNext()">
          <a aria-label="Last" class="page-link" (click)="selectPage(_pageCount)">
            <span aria-hidden="true">&raquo;&raquo;</span>
            <span class="sr-only">Last</span>
          </a>                
        </li>        
      </ul>
    </nav>
  `
})
export class NgbPagination implements OnChanges {
  private _boundaryLinks = false;
  private _collectionSize;
  private _directionLinks = true;
  private _ellipses = true;
  private _maxSize = 0;
  private _page = 0;
  private _pageCount = 0;
  private _pageSize = 10;
  private _rotate = false;
  pages: number[] = [];

  /**
   *  Whether to show the "First" and "Last" page links
   */
  @Input()
  set boundaryLinks(value: boolean) {
    this._boundaryLinks = toBoolean(value);
  }

  get boundaryLinks(): boolean { return this._boundaryLinks; }

  /**
   *  Whether to show the "Next" and "Previous" page links
   */
  @Input()
  set directionLinks(value: boolean) {
    this._directionLinks = toBoolean(value);
  }

  get directionLinks(): boolean { return this._directionLinks; }

  /**
   *  Whether to show ellipsis symbols and first/last page numbers when maxSize > number of pages
   */
  @Input()
  set ellipses(value: boolean) {
    this._ellipses = toBoolean(value);
  }

  get ellipses(): boolean { return this._ellipses; }

  /**
   *  Number of items in collection.
   */
  @Input()
  set collectionSize(value: number | string) {
    this._collectionSize = toInteger(value);
  }

  get collectionSize(): number | string { return this._collectionSize; }

  /**
   *  Maximum number of pages to display
   */
  @Input()
  set maxSize(value: number | string) {
    this._maxSize = toInteger(value);
  }

  get maxSize(): number | string { return this._maxSize; }

  /**
   *  Current page.
   */
  @Input()
  set page(value: number | string) {
    this._page = parseInt(`${value}`, 10);
  }

  get page(): number | string { return this._page; }

  /**
   *  Number of items per page.
   */
  @Input()
  set pageSize(value: number | string) {
    this._pageSize = toInteger(value);
  }

  get pageSize(): number | string { return this._pageSize; }

  /**
   *  An event fired when the page is changed.
   *  Event's payload equals the current page.
   */
  @Output() pageChange = new EventEmitter();

  /**
   *  Whether to rotate pages when maxSize > number of pages.
   *  Current page will be in the middle
   */
  @Input()
  set rotate(value: boolean) {
    this._rotate = toBoolean(value);
  }

  get rotate(): boolean { return this._rotate; }

  /**
   * Pagination display size: small or large
   */
  @Input() size: 'sm' | 'lg';

  hasPrevious(): boolean { return this.page > 1; }

  hasNext(): boolean { return this.page < this._pageCount; }

  selectPage(pageNumber: number): void {
    let prevPageNo = this.page;
    this._page = this._getPageNoInRange(pageNumber);

    if (this.page !== prevPageNo) {
      this.pageChange.emit(this.page);
    }

    this.ngOnChanges();
  }

  ngOnChanges(): void {
    // re-calculate new length of pages
    this._pageCount = Math.ceil(this._collectionSize / this._pageSize);

    // fill-in model needed to render pages
    this.pages.length = 0;
    for (let i = 1; i <= this._pageCount; i++) {
      this.pages.push(i);
    }

    // get selected page
    this._page = this._getPageNoInRange(this.page);

    // apply maxSize if necessary
    if (this._maxSize > 0 && this._pageCount > this._maxSize) {
      let start = 0;
      let end = this._pageCount;

      // either paginating or rotating page numbers
      if (this._rotate) {
        [start, end] = this._applyRotation();
      } else {
        [start, end] = this._applyPagination();
      }

      this.pages = this.pages.slice(start, end);

      // adding ellipses
      this._applyEllipses(start, end);
    }
  }

  /**
   * Appends ellipses and first/last page number to the displayed pages
   */
  private _applyEllipses(start: number, end: number) {
    if (this._ellipses) {
      if (start > 0) {
        this.pages.unshift(-1);
        this.pages.unshift(1);
      }
      if (end < this._pageCount) {
        this.pages.push(-1);
        this.pages.push(this._pageCount);
      }
    }
  }

  /**
   * Rotates page numbers based on maxSize items visible.
   * Currently selected page stays in the middle:
   *
   * Ex. for selected page = 6:
   * [5,*6*,7] for maxSize = 3
   * [4,5,*6*,7] for maxSize = 4
   */
  private _applyRotation(): [number, number] {
    let start = 0;
    let end = this._pageCount;
    let leftOffset = Math.floor(this._maxSize / 2);
    let rightOffset = this._maxSize % 2 === 0 ? leftOffset - 1 : leftOffset;

    if (this._page <= leftOffset) {
      // very beginning, no rotation -> [0..maxSize]
      end = this._maxSize;
    } else if (this._pageCount - this._page < leftOffset) {
      // very end, no rotation -> [len-maxSize..len]
      start = this._pageCount - this._maxSize;
    } else {
      // rotate
      start = this._page - leftOffset - 1;
      end = this._page + rightOffset;
    }

    return [start, end];
  }

  /**
   * Paginates page numbers based on maxSize items per page
   */
  private _applyPagination(): [number, number] {
    let page = Math.ceil(this._page / this._maxSize) - 1;
    let start = page * this._maxSize;
    let end = start + this._maxSize;

    return [start, end];
  }

  private _isEllipsis(pageNumber): boolean { return pageNumber === -1; }

  private _getPageNoInRange(newPageNo): number { return getValueInRange(newPageNo, this._pageCount, 1); }
}

export const NGB_PAGINATION_DIRECTIVES = [NgbPagination];
