import {Component, EventEmitter, Input, Output, OnChanges, ChangeDetectionStrategy, SimpleChanges} from '@angular/core';
import {getValueInRange, isNumber} from '../util/util';
import {NgbPaginationConfig} from './pagination-config';

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
          <a aria-label="First" class="page-link" href (click)="!!selectPage(1)">
            <span aria-hidden="true">{{firstText}}</span>
            <span class="sr-only">{{_firstTextSr}}</span>
          </a>                
        </li>
      
        <li *ngIf="directionLinks" class="page-item" [class.disabled]="!hasPrevious()">
          <a aria-label="Previous" class="page-link" href (click)="!!selectPage(page-1)">
            <span aria-hidden="true">{{previousText}}</span>
            <span class="sr-only">{{_previousTextSr}}</span>
          </a>
        </li>

        <li *ngFor="let pageNumber of pages" class="page-item" [class.active]="pageNumber === page" 
          [class.disabled]="isEllipsis(pageNumber)">
          <a *ngIf="isEllipsis(pageNumber)" class="page-link">...</a>
          <a *ngIf="!isEllipsis(pageNumber)" class="page-link" href (click)="!!selectPage(pageNumber)">{{pageNumber}}</a>
        </li>

        <li *ngIf="directionLinks" class="page-item" [class.disabled]="!hasNext()">
          <a aria-label="Next" class="page-link" href (click)="!!selectPage(page+1)">
            <span aria-hidden="true">{{nextText}}</span>
            <span class="sr-only">{{_nextTextSr}}</span>
          </a>
        </li>
        
        <li *ngIf="boundaryLinks" class="page-item" [class.disabled]="!hasNext()">
          <a aria-label="Last" class="page-link" href (click)="!!selectPage(pageCount)">
            <span aria-hidden="true">{{lastText}}</span>
            <span class="sr-only">{{_lastTextSr}}</span>
          </a>                
        </li>        
      </ul>
    </nav>
  `
})
export class NgbPagination implements OnChanges {
  private _firstText;
  private _firstTextSr = 'First';
  private _lastText;
  private _lastTextSr = 'Last';
  private _nextText;
  private _nextTextSr = 'Next';
  private _previousText;
  private _previousTextSr = 'Previous';
  private _defaultConfig: NgbPaginationConfig;

  pageCount = 0;
  pages: number[] = [];

  /**
   *  Whether to show the "First" and "Last" page links
   */
  @Input() boundaryLinks: boolean;

  /**
   *  Whether to show the "Next" and "Previous" page links
   */
  @Input() directionLinks: boolean;

  /**
   *  Whether to show ellipsis symbols and first/last page numbers when maxSize > number of pages
   */
  @Input() ellipses: boolean;

  /**
   * Text to display for the first page button. This value will be used for both screen readers and non-screen
   * reader displays. Default value: «« (for non-screen reader displays); First for screen-reader displays.
   */
  @Input()
  set firstText(value: string) {
    this._firstText = value;
    if (value !== this._defaultConfig.firstText) {
      this._firstTextSr = value;
    }
  }

  get firstText() { return this._firstText; }

  /**
   *  Whether to rotate pages when maxSize > number of pages.
   *  Current page will be in the middle
   */
  @Input() rotate: boolean;

  /**
   *  Number of items in collection.
   */
  @Input() collectionSize: number;

  /**
   * Text to display for the last page button. This value will be used for both screen readers and non-screen
   * reader displays. Default value: »» (for non-screen reader displays); Last for screen-reader displays.
   */
  @Input()
  set lastText(value: string) {
    this._lastText = value;
    if (value !== this._defaultConfig.lastText) {
      this._lastTextSr = value;
    }
  }

  get lastText() { return this._lastText; }

  /**
   *  Maximum number of pages to display.
   */
  @Input() maxSize: number;

  /**
   * Text to display for the next page button. This value will be used for both screen readers and non-screen
   * reader displays. Default value: » (for non-screen reader displays); Next for screen-reader displays.
   */
  @Input()
  set nextText(value: string) {
    this._nextText = value;
    if (value !== this._defaultConfig.nextText) {
      this._nextTextSr = value;
    }
  }

  get nextText() { return this._nextText; }

  /**
   *  Current page.
   */
  @Input() page = 0;

  /**
   *  Number of items per page.
   */
  @Input() pageSize: number;

  /**
   *  An event fired when the page is changed.
   *  Event's payload equals to the newly selected page.
   */
  @Output() pageChange = new EventEmitter<number>(true);

  /**
   * Text to display for the previous page button. This value will be used for both screen readers and non-screen
   * reader displays. Default value: « (for non-screen reader displays); Previous for screen-reader displays.
   */
  @Input()
  set previousText(value: string) {
    this._previousText = value;
    if (value !== this._defaultConfig.previousText) {
      this._previousTextSr = value;
    }
  }

  get previousText() { return this._previousText; }

  /**
   * Pagination display size: small or large
   */
  @Input() size: 'sm' | 'lg';

  constructor(config: NgbPaginationConfig) {
    this._defaultConfig = config;
    this.boundaryLinks = config.boundaryLinks;
    this.directionLinks = config.directionLinks;
    this.ellipses = config.ellipses;
    this._firstText = config.firstText;
    this._lastText = config.lastText;
    this.maxSize = config.maxSize;
    this._nextText = config.nextText;
    this.pageSize = config.pageSize;
    this._previousText = config.previousText;
    this.rotate = config.rotate;
    this.size = config.size;
  }

  hasPrevious(): boolean { return this.page > 1; }

  hasNext(): boolean { return this.page < this.pageCount; }

  selectPage(pageNumber: number): void { this._updatePages(pageNumber); }

  ngOnChanges(changes: SimpleChanges): void { this._updatePages(this.page); }

  /**
   * @internal
   */
  isEllipsis(pageNumber): boolean { return pageNumber === -1; }

  /**
   * Appends ellipses and first/last page number to the displayed pages
   */
  private _applyEllipses(start: number, end: number) {
    if (this.ellipses) {
      if (start > 0) {
        this.pages.unshift(-1);
        this.pages.unshift(1);
      }
      if (end < this.pageCount) {
        this.pages.push(-1);
        this.pages.push(this.pageCount);
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
    let end = this.pageCount;
    let leftOffset = Math.floor(this.maxSize / 2);
    let rightOffset = this.maxSize % 2 === 0 ? leftOffset - 1 : leftOffset;

    if (this.page <= leftOffset) {
      // very beginning, no rotation -> [0..maxSize]
      end = this.maxSize;
    } else if (this.pageCount - this.page < leftOffset) {
      // very end, no rotation -> [len-maxSize..len]
      start = this.pageCount - this.maxSize;
    } else {
      // rotate
      start = this.page - leftOffset - 1;
      end = this.page + rightOffset;
    }

    return [start, end];
  }

  /**
   * Paginates page numbers based on maxSize items per page
   */
  private _applyPagination(): [number, number] {
    let page = Math.ceil(this.page / this.maxSize) - 1;
    let start = page * this.maxSize;
    let end = start + this.maxSize;

    return [start, end];
  }

  private _setPageInRange(newPageNo) {
    const prevPageNo = this.page;
    this.page = getValueInRange(newPageNo, this.pageCount, 1);

    if (this.page !== prevPageNo) {
      this.pageChange.emit(this.page);
    }
  }

  private _updatePages(newPage: number) {
    this.pageCount = Math.ceil(this.collectionSize / this.pageSize);

    if (!isNumber(this.pageCount)) {
      this.pageCount = 0;
    }

    // fill-in model needed to render pages
    this.pages.length = 0;
    for (let i = 1; i <= this.pageCount; i++) {
      this.pages.push(i);
    }

    // set page within 1..max range
    this._setPageInRange(newPage);

    // apply maxSize if necessary
    if (this.maxSize > 0 && this.pageCount > this.maxSize) {
      let start = 0;
      let end = this.pageCount;

      // either paginating or rotating page numbers
      if (this.rotate) {
        [start, end] = this._applyRotation();
      } else {
        [start, end] = this._applyPagination();
      }

      this.pages = this.pages.slice(start, end);

      // adding ellipses
      this._applyEllipses(start, end);
    }
  }
}
