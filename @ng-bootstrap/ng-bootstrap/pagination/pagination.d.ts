import { EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { NgbPaginationConfig } from './pagination-config';
/**
 * A directive that will take care of visualising a pagination bar and enable / disable buttons correctly!
 */
export declare class NgbPagination implements OnChanges {
    pageCount: number;
    pages: number[];
    /**
     * Whether to disable buttons from user input
     */
    disabled: boolean;
    /**
     *  Whether to show the "First" and "Last" page links
     */
    boundaryLinks: boolean;
    /**
     *  Whether to show the "Next" and "Previous" page links
     */
    directionLinks: boolean;
    /**
     *  Whether to show ellipsis symbols and first/last page numbers when maxSize > number of pages
     */
    ellipses: boolean;
    /**
     *  Whether to rotate pages when maxSize > number of pages.
     *  Current page will be in the middle
     */
    rotate: boolean;
    /**
     *  Number of items in collection.
     */
    collectionSize: number;
    /**
     *  Maximum number of pages to display.
     */
    maxSize: number;
    /**
     *  Current page.
     */
    page: number;
    /**
     *  Number of items per page.
     */
    pageSize: number;
    /**
     *  An event fired when the page is changed.
     *  Event's payload equals to the newly selected page.
     */
    pageChange: EventEmitter<number>;
    /**
     * Pagination display size: small or large
     */
    size: 'sm' | 'lg';
    constructor(config: NgbPaginationConfig);
    hasPrevious(): boolean;
    hasNext(): boolean;
    selectPage(pageNumber: number): void;
    ngOnChanges(changes: SimpleChanges): void;
    /**
     * Appends ellipses and first/last page number to the displayed pages
     */
    private _applyEllipses(start, end);
    /**
     * Rotates page numbers based on maxSize items visible.
     * Currently selected page stays in the middle:
     *
     * Ex. for selected page = 6:
     * [5,*6*,7] for maxSize = 3
     * [4,5,*6*,7] for maxSize = 4
     */
    private _applyRotation();
    /**
     * Paginates page numbers based on maxSize items per page
     */
    private _applyPagination();
    private _setPageInRange(newPageNo);
    private _updatePages(newPage);
}
