import {
  Component,
  ContentChild,
  Directive,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  ChangeDetectionStrategy,
  SimpleChanges,
  TemplateRef
} from '@angular/core';
import {getValueInRange, isNumber} from '../util/util';
import {NgbPaginationConfig} from './pagination-config';

/**
 * Context for the pagination 'first', 'previous', 'next', 'last' or 'ellipsis' cell
 * in case you want to override one
 *
 * @since 4.1.0
 */
export interface NgbPaginationLinkContext {
  /**
   * Page number currently selected
   */
  currentPage: number;

  /**
   * If true the link in question is disabled
   */
  disabled: boolean;
}

/**
 * Context for the pagination 'number' cell in case you want to override one.
 * Extends 'NgbPaginationLinkContext'
 *
 * @since 4.1.0
 */
export interface NgbPaginationNumberContext extends NgbPaginationLinkContext {
  /**
   * Page number displayed by the current cell
   */
  $implicit: number;
}

/**
 * The directive to match the 'ellipsis' cell template
 *
 * @since 4.1.0
 */
@Directive({selector: 'ng-template[ngbPaginationEllipsis]'})
export class NgbPaginationEllipsis {
  constructor(public templateRef: TemplateRef<NgbPaginationLinkContext>) {}
}

/**
 * The directive to match the 'first' cell template
 *
 * @since 4.1.0
 */
@Directive({selector: 'ng-template[ngbPaginationFirst]'})
export class NgbPaginationFirst {
  constructor(public templateRef: TemplateRef<NgbPaginationLinkContext>) {}
}

/**
 * The directive to match the 'last' cell template
 *
 * @since 4.1.0
 */
@Directive({selector: 'ng-template[ngbPaginationLast]'})
export class NgbPaginationLast {
  constructor(public templateRef: TemplateRef<NgbPaginationLinkContext>) {}
}

/**
 * The directive to match the 'next' cell template
 *
 * @since 4.1.0
 */
@Directive({selector: 'ng-template[ngbPaginationNext]'})
export class NgbPaginationNext {
  constructor(public templateRef: TemplateRef<NgbPaginationLinkContext>) {}
}

/**
 * The directive to match the page 'number' cell template
 *
 * @since 4.1.0
 */
@Directive({selector: 'ng-template[ngbPaginationNumber]'})
export class NgbPaginationNumber {
  constructor(public templateRef: TemplateRef<NgbPaginationNumberContext>) {}
}

/**
 * The directive to match the 'previous' cell template
 *
 * @since 4.1.0
 */
@Directive({selector: 'ng-template[ngbPaginationPrevious]'})
export class NgbPaginationPrevious {
  constructor(public templateRef: TemplateRef<NgbPaginationLinkContext>) {}
}

/**
 * A component that displays page numbers and allows to customize them in several ways
 */
@Component({
  selector: 'ngb-pagination',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {'role': 'navigation'},
  template: `
    <ng-template #first><span aria-hidden="true" i18n="@@ngb.pagination.first">&laquo;&laquo;</span></ng-template>
    <ng-template #previous><span aria-hidden="true" i18n="@@ngb.pagination.previous">&laquo;</span></ng-template>
    <ng-template #next><span aria-hidden="true" i18n="@@ngb.pagination.next">&raquo;</span></ng-template>
    <ng-template #last><span aria-hidden="true" i18n="@@ngb.pagination.last">&raquo;&raquo;</span></ng-template>
    <ng-template #ellipsis>...</ng-template>
    <ng-template #defaultNumber let-page let-currentPage="currentPage">
      {{ page }}
      <span *ngIf="page === currentPage" class="sr-only">(current)</span>
    </ng-template>
    <ul [class]="'pagination' + (size ? ' pagination-' + size : '')">
      <li *ngIf="boundaryLinks" class="page-item"
        [class.disabled]="previousDisabled()">
        <a aria-label="First" i18n-aria-label="@@ngb.pagination.first-aria" class="page-link" href
          (click)="selectPage(1); $event.preventDefault()" [attr.tabindex]="(hasPrevious() ? null : '-1')">
          <ng-template [ngTemplateOutlet]="tplFirst?.templateRef || first"
                       [ngTemplateOutletContext]="{disabled: previousDisabled(), currentPage: page}"></ng-template>
        </a>
      </li>

      <li *ngIf="directionLinks" class="page-item"
        [class.disabled]="previousDisabled()">
        <a aria-label="Previous" i18n-aria-label="@@ngb.pagination.previous-aria" class="page-link" href
          (click)="selectPage(page-1); $event.preventDefault()" [attr.tabindex]="(hasPrevious() ? null : '-1')">
          <ng-template [ngTemplateOutlet]="tplPrevious?.templateRef || previous"
                       [ngTemplateOutletContext]="{disabled: previousDisabled()}"></ng-template>
        </a>
      </li>
      <li *ngFor="let pageNumber of pages" class="page-item" [class.active]="pageNumber === page"
        [class.disabled]="isEllipsis(pageNumber) || disabled">
        <a *ngIf="isEllipsis(pageNumber)" class="page-link">
          <ng-template [ngTemplateOutlet]="tplEllipsis?.templateRef || ellipsis"
                       [ngTemplateOutletContext]="{disabled: true, currentPage: page}"></ng-template>
        </a>
        <a *ngIf="!isEllipsis(pageNumber)" class="page-link" href (click)="selectPage(pageNumber); $event.preventDefault()">
          <ng-template [ngTemplateOutlet]="tplNumber?.templateRef || defaultNumber"
                       [ngTemplateOutletContext]="{disabled: disabled, $implicit: pageNumber, currentPage: page}"></ng-template>
        </a>
      </li>
      <li *ngIf="directionLinks" class="page-item" [class.disabled]="nextDisabled()">
        <a aria-label="Next" i18n-aria-label="@@ngb.pagination.next-aria" class="page-link" href
          (click)="selectPage(page+1); $event.preventDefault()" [attr.tabindex]="(hasNext() ? null : '-1')">
          <ng-template [ngTemplateOutlet]="tplNext?.templateRef || next"
                       [ngTemplateOutletContext]="{disabled: nextDisabled(), currentPage: page}"></ng-template>
        </a>
      </li>

      <li *ngIf="boundaryLinks" class="page-item" [class.disabled]="nextDisabled()">
        <a aria-label="Last" i18n-aria-label="@@ngb.pagination.last-aria" class="page-link" href
          (click)="selectPage(pageCount); $event.preventDefault()" [attr.tabindex]="(hasNext() ? null : '-1')">
          <ng-template [ngTemplateOutlet]="tplLast?.templateRef || last"
                       [ngTemplateOutletContext]="{disabled: nextDisabled(), currentPage: page}"></ng-template>
        </a>
      </li>
    </ul>
  `
})
export class NgbPagination implements OnChanges {
  pageCount = 0;
  pages: number[] = [];

  @ContentChild(NgbPaginationEllipsis) tplEllipsis: NgbPaginationEllipsis;
  @ContentChild(NgbPaginationFirst) tplFirst: NgbPaginationFirst;
  @ContentChild(NgbPaginationLast) tplLast: NgbPaginationLast;
  @ContentChild(NgbPaginationNext) tplNext: NgbPaginationNext;
  @ContentChild(NgbPaginationNumber) tplNumber: NgbPaginationNumber;
  @ContentChild(NgbPaginationPrevious) tplPrevious: NgbPaginationPrevious;

  /**
   * Whether to disable buttons from user input
   */
  @Input() disabled: boolean;

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
   *  Whether to rotate pages when maxSize > number of pages.
   *  Current page will be in the middle
   */
  @Input() rotate: boolean;

  /**
   *  Number of items in collection.
   */
  @Input() collectionSize: number;

  /**
   *  Maximum number of pages to display.
   */
  @Input() maxSize: number;

  /**
   *  Current page. Page numbers start with 1
   */
  @Input() page = 1;

  /**
   *  Number of items per page.
   */
  @Input() pageSize: number;

  /**
   *  An event fired when the page is changed.
   *  Event's payload equals to the newly selected page.
   *  Will fire only if collection size is set and all values are valid.
   *  Page numbers start with 1
   */
  @Output() pageChange = new EventEmitter<number>(true);

  /**
   * Pagination display size: small or large
   */
  @Input() size: 'sm' | 'lg';

  constructor(config: NgbPaginationConfig) {
    this.disabled = config.disabled;
    this.boundaryLinks = config.boundaryLinks;
    this.directionLinks = config.directionLinks;
    this.ellipses = config.ellipses;
    this.maxSize = config.maxSize;
    this.pageSize = config.pageSize;
    this.rotate = config.rotate;
    this.size = config.size;
  }

  hasPrevious(): boolean { return this.page > 1; }

  hasNext(): boolean { return this.page < this.pageCount; }

  nextDisabled(): boolean { return !this.hasNext() || this.disabled; }

  previousDisabled(): boolean { return !this.hasPrevious() || this.disabled; }

  selectPage(pageNumber: number): void { this._updatePages(pageNumber); }

  ngOnChanges(changes: SimpleChanges): void { this._updatePages(this.page); }

  isEllipsis(pageNumber): boolean { return pageNumber === -1; }

  /**
   * Appends ellipses and first/last page number to the displayed pages
   */
  private _applyEllipses(start: number, end: number) {
    if (this.ellipses) {
      if (start > 0) {
        if (start > 1) {
          this.pages.unshift(-1);
        }
        this.pages.unshift(1);
      }
      if (end < this.pageCount) {
        if (end < (this.pageCount - 1)) {
          this.pages.push(-1);
        }
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

    if (this.page !== prevPageNo && isNumber(this.collectionSize)) {
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
