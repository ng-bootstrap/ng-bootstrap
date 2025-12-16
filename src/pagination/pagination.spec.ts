import { ComponentFixture, TestBed } from '@angular/core/testing';
import { createGenericTestComponent } from '../test/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Component, inputBinding, signal } from '@angular/core';

import {
	NgbPagination,
	NgbPaginationEllipsis,
	NgbPaginationFirst,
	NgbPaginationLast,
	NgbPaginationNext,
	NgbPaginationNumber,
	NgbPaginationPrevious,
	NgbPaginationPages,
} from './pagination.module';
import { NgbPaginationConfig } from './pagination-config';
import { Locator, page } from 'vitest/browser';
import { By } from '@angular/platform-browser';

class PaginationTester {
	readonly fixture: ComponentFixture<TestComponent>;
	readonly root: Locator;
	readonly paginationDirective: NgbPagination;
	readonly componentInstance: TestComponent;
	constructor(html: string) {
		this.fixture = createGenericTestComponent(html, TestComponent, false);
		this.root = page.elementLocator(this.fixture.nativeElement);
		this.paginationDirective = this.fixture.debugElement.query(By.directive(NgbPagination)).injector.get(NgbPagination);
		this.componentInstance = this.fixture.componentInstance;
	}

	readonly list = page.getByRole('list');
	readonly pages = page.getByRole('listitem');
	readonly links = page.getByCss('a');
	readonly input = page.getByRole('textbox');

	clickDisabledLink(index: number) {
		(this.links.nth(index).element() as HTMLElement).click();
	}
}

async function expectPages(tester: PaginationTester, pagesDef: string[], ellipsis = '...') {
	await expect.element(tester.pages).toHaveLength(pagesDef.length);

	for (let i = 0; i < pagesDef.length; i++) {
		const pageDef = pagesDef[i];
		const page = tester.pages.nth(i);
		const pageLink = page.getByCss('a');
		const pageInput = page.getByRole('textbox');
		const classIndicator = pageDef.charAt(0);

		if (classIndicator === '+') {
			await expect.element(page).toHaveClass('active');
			await expect.element(page).not.toHaveClass('disabled');
			await expect.element(pageLink).toHaveAttribute('aria-current', 'page');
			await expect.element(page).toHaveTextContent(pageDef.substring(1));
		} else if (classIndicator === '-') {
			await expect.element(page).not.toHaveClass('active');
			await expect.element(page).toHaveClass('disabled');
			await expect.element(pageLink).not.toHaveAttribute('aria-current');
			await expect.element(pageLink).toHaveAttribute('aria-disabled');
			await expect.element(page).toHaveTextContent(pageDef.substring(1));
		} else if (classIndicator === 'c') {
			// Custom Pages
			const suffix = pageDef.substring(1);
			const expectedTextContent = suffix.substring(0, suffix.indexOf(','));
			const expectedPage = suffix.substring(suffix.indexOf(',') + 1);
			await expect.element(page).toHaveTextContent(expectedTextContent);
			await expect.element(pageInput).toHaveDisplayValue(expectedPage);
		} else {
			await expect.element(page).not.toHaveClass('active');
			await expect.element(page).not.toHaveClass('disabled');
			await expect.element(pageLink).not.toHaveAttribute('aria-current');
			await expect.element(page).toHaveTextContent(pageDef);
		}

		if (pageDef.endsWith(ellipsis)) {
			// ellipsis is always disabled
			await expect.element(page).not.toHaveClass('active');
			await expect.element(page).toHaveClass('disabled');
			await expect.element(pageLink).not.toHaveAttribute('aria-current');
			await expect.element(pageLink).toHaveAttribute('tabindex', '-1');
			await expect.element(pageLink).toHaveAttribute('aria-disabled');
		}
	}
}

function expectSameValues(pagination: NgbPagination, config: NgbPaginationConfig) {
	expect(pagination.disabled).toBe(config.disabled);
	expect(pagination.boundaryLinks).toBe(config.boundaryLinks);
	expect(pagination.directionLinks).toBe(config.directionLinks);
	expect(pagination.ellipses).toBe(config.ellipses);
	expect(pagination.maxSize).toBe(config.maxSize);
	expect(pagination.pageSize).toBe(config.pageSize);
	expect(pagination.rotate).toBe(config.rotate);
	expect(pagination.size).toBe(config.size);
}

describe('ngb-pagination', () => {
	describe('business logic', () => {
		it('should initialize inputs with default values', () => {
			const pagination = TestBed.createComponent(NgbPagination).componentInstance;
			const defaultConfig = new NgbPaginationConfig();
			expectSameValues(pagination, defaultConfig);
		});

		it('should calculate and update no of pages (default page size)', async () => {
			const collectionSize = signal(100);
			let fixture = TestBed.createComponent(NgbPagination, {
				bindings: [inputBinding('collectionSize', collectionSize)],
			});
			const pagination = fixture.componentInstance;
			await fixture.whenStable();
			expect(pagination.pages.length).toEqual(10);

			collectionSize.set(200);
			await fixture.whenStable();
			expect(pagination.pages.length).toEqual(20);
		});

		it('should calculate and update no of pages (custom page size)', async () => {
			const collectionSize = signal(100);
			const pageSize = signal(20);
			let fixture = TestBed.createComponent(NgbPagination, {
				bindings: [inputBinding('collectionSize', collectionSize), inputBinding('pageSize', pageSize)],
			});
			const pagination = fixture.componentInstance;

			await fixture.whenStable();
			expect(pagination.pages.length).toEqual(5);

			collectionSize.set(200);
			await fixture.whenStable();
			expect(pagination.pages.length).toEqual(10);

			pageSize.set(10);
			await fixture.whenStable();
			expect(pagination.pages.length).toEqual(20);
		});

		it('should allow setting a page within a valid range (default page size)', async () => {
			const collectionSize = signal(100);
			const page = signal(2);
			let fixture = TestBed.createComponent(NgbPagination, {
				bindings: [inputBinding('collectionSize', collectionSize), inputBinding('page', page)],
			});
			const pagination = fixture.componentInstance;

			await fixture.whenStable();

			expect(pagination.page).toEqual(2);
		});

		it('should auto-correct page no if outside of valid range (default page size)', async () => {
			const collectionSize = signal(100);
			const page = signal(100);
			let fixture = TestBed.createComponent(NgbPagination, {
				bindings: [inputBinding('collectionSize', collectionSize), inputBinding('page', page)],
			});
			const pagination = fixture.componentInstance;

			await fixture.whenStable();

			expect(pagination.page).toEqual(10);

			page.set(-100);
			await fixture.whenStable();
			expect(pagination.page).toEqual(1);

			page.set(5);
			collectionSize.set(10);
			await fixture.whenStable();
			expect(pagination.page).toEqual(1);
		});

		it('should allow setting a page within a valid range (custom page size)', async () => {
			const collectionSize = signal(100);
			const pageSize = signal(20);
			const page = signal(2);
			let fixture = TestBed.createComponent(NgbPagination, {
				bindings: [
					inputBinding('collectionSize', collectionSize),
					inputBinding('pageSize', pageSize),
					inputBinding('page', page),
				],
			});
			const pagination = fixture.componentInstance;

			await fixture.whenStable();
			expect(pagination.page).toEqual(2);
		});
	});

	describe('UI logic', () => {
		it('should render and respond to collectionSize change', async () => {
			const html = '<ngb-pagination [collectionSize]="collectionSize()" [page]="1" />';
			const tester = new PaginationTester(html);

			tester.componentInstance.collectionSize.set(30);

			await expectPages(tester, ['-«', '+1', '2', '3', '»']);

			tester.componentInstance.collectionSize.set(40);

			await expectPages(tester, ['-«', '+1', '2', '3', '4', '»']);
		});

		it('should render and respond to pageSize change', async () => {
			const html = '<ngb-pagination [collectionSize]="collectionSize()" [page]="1" [pageSize]="pageSize()" />';
			const tester = new PaginationTester(html);

			tester.componentInstance.collectionSize.set(30);
			tester.componentInstance.pageSize.set(5);

			await expectPages(tester, ['-«', '+1', '2', '3', '4', '5', '6', '»']);

			tester.componentInstance.pageSize.set(10);

			await expectPages(tester, ['-«', '+1', '2', '3', '»']);
		});

		it('should render and respond to active page change', async () => {
			const html = '<ngb-pagination [collectionSize]="collectionSize()" [page]="page()" />';
			const tester = new PaginationTester(html);

			tester.componentInstance.collectionSize.set(30);
			tester.componentInstance.page.set(2);

			await expectPages(tester, ['«', '1', '+2', '3', '»']);

			tester.componentInstance.page.set(3);

			await expectPages(tester, ['«', '1', '2', '+3', '-»']);
		});

		it('should update selected page model on page on click', async () => {
			const html = '<ngb-pagination [collectionSize]="collectionSize()" [page]="page()" />';
			const tester = new PaginationTester(html);

			tester.componentInstance.collectionSize.set(30);
			tester.componentInstance.page.set(2);

			await expectPages(tester, ['«', '1', '+2', '3', '»']);

			await tester.links.nth(1).click();

			await expectPages(tester, ['-«', '+1', '2', '3', '»']);

			await tester.links.nth(3).click();

			await expectPages(tester, ['«', '1', '2', '+3', '-»']);
		});

		it('should update selected page model on prev / next click', async () => {
			const html =
				'<ngb-pagination [collectionSize]="collectionSize()" [page]="page()" [directionLinks]="directionLinks()" />';
			const tester = new PaginationTester(html);

			tester.componentInstance.collectionSize.set(30);

			await expectPages(tester, ['+1', '2', '3']);

			tester.componentInstance.directionLinks.set(true);

			await expectPages(tester, ['-«', '+1', '2', '3', '»']);

			tester.clickDisabledLink(0);

			await expectPages(tester, ['-«', '+1', '2', '3', '»']);

			await tester.links.nth(4).click();

			await expectPages(tester, ['«', '1', '+2', '3', '»']);

			await tester.links.nth(4).click();

			await expectPages(tester, ['«', '1', '2', '+3', '-»']);

			tester.clickDisabledLink(4);

			await expectPages(tester, ['«', '1', '2', '+3', '-»']);
		});

		it('should update selected page model on first / last click', async () => {
			const html = `<ngb-pagination [collectionSize]="collectionSize()" [page]="page()" [maxSize]="maxSize()"
              [boundaryLinks]="boundaryLinks()" />`;
			const tester = new PaginationTester(html);

			tester.componentInstance.collectionSize.set(30);

			await expectPages(tester, ['-«', '+1', '2', '3', '»']);

			tester.componentInstance.boundaryLinks.set(true);

			await expectPages(tester, ['-««', '-«', '+1', '2', '3', '»', '»»']);

			tester.clickDisabledLink(0);

			await expectPages(tester, ['-««', '-«', '+1', '2', '3', '»', '»»']);

			await tester.links.nth(6).click();

			await expectPages(tester, ['««', '«', '1', '2', '+3', '-»', '-»»']);

			await tester.links.nth(3).click();

			await expectPages(tester, ['««', '«', '1', '+2', '3', '»', '»»']);

			await tester.links.nth(0).click();

			await expectPages(tester, ['-««', '-«', '+1', '2', '3', '»', '»»']);

			// maxSize < number of pages
			tester.componentInstance.collectionSize.set(70);
			tester.componentInstance.maxSize.set(3);

			await expectPages(tester, ['-««', '-«', '+1', '2', '3', '-...', '7', '»', '»»']);

			await tester.links.nth(8).click();

			await expectPages(tester, ['««', '«', '1', '-...', '+7', '-»', '-»»']);

			await tester.links.nth(0).click();

			await expectPages(tester, ['-««', '-«', '+1', '2', '3', '-...', '7', '»', '»»']);
		});

		it('should update page when it becomes out of range', async () => {
			const html = '<ngb-pagination [collectionSize]="collectionSize()" [(page)]="page" [size]="size()" />';
			const tester = new PaginationTester(html);

			tester.componentInstance.collectionSize.set(30);

			await expectPages(tester, ['-«', '+1', '2', '3', '»']);

			await tester.links.nth(3).click();

			await expectPages(tester, ['«', '1', '2', '+3', '-»']);
			expect(tester.componentInstance.page()).toBe(3);

			tester.componentInstance.collectionSize.set(20);

			await expectPages(tester, ['«', '1', '+2', '-»']);
			expect(tester.componentInstance.page()).toBe(2);
		});

		it('should render and respond to size change', async () => {
			const html = '<ngb-pagination [collectionSize]="20" [page]="1" [size]="size()" />';

			const tester = new PaginationTester(html);

			// default case
			await expectPages(tester, ['-«', '+1', '2', '»']);
			await expect(tester.list).toHaveClass('pagination');

			// large size
			tester.componentInstance.size.set('lg');

			await expect.element(tester.list).toHaveClass('pagination', 'pagination-lg');

			// removing large size
			tester.componentInstance.size.set('');

			await expect.element(tester.list).toHaveClass('pagination');
			await expect.element(tester.list).not.toHaveClass('pagination-lg');

			// arbitrary string
			tester.componentInstance.size.set('123');

			await expect.element(tester.list).toHaveClass('pagination', 'pagination-123');

			// null value
			tester.componentInstance.size.set(null);

			await expect.element(tester.list).toHaveClass('pagination');
			await expect.element(tester.list).not.toHaveClass('pagination-123');
		});

		it('should render and respond to maxSize change correctly', async () => {
			const html =
				'<ngb-pagination [collectionSize]="70" [page]="page()" [maxSize]="maxSize()" [ellipses]="ellipses()" />';
			const tester = new PaginationTester(html);

			await expectPages(tester, ['-«', '+1', '2', '3', '4', '5', '6', '7', '»']);

			// disabling ellipsis
			tester.componentInstance.ellipses.set(false);

			// limiting to 3 page numbers
			tester.componentInstance.maxSize.set(3);

			await expectPages(tester, ['-«', '+1', '2', '3', '»']);

			tester.componentInstance.page.set(3);

			await expectPages(tester, ['«', '1', '2', '+3', '»']);

			tester.componentInstance.page.set(4);

			await expectPages(tester, ['«', '+4', '5', '6', '»']);

			tester.componentInstance.page.set(7);

			await expectPages(tester, ['«', '+7', '-»']);

			// checking that maxSize > total pages works
			tester.componentInstance.maxSize.set(100);

			await expectPages(tester, ['«', '1', '2', '3', '4', '5', '6', '+7', '-»']);
		});

		it('should render and rotate pages correctly', async () => {
			const html = `<ngb-pagination [collectionSize]="70" [page]="page()" [maxSize]="maxSize()" [rotate]="rotate()"
        [ellipses]="ellipses()" />`;
			const tester = new PaginationTester(html);

			await expectPages(tester, ['-«', '+1', '2', '3', '4', '5', '6', '7', '»']);

			// disabling ellipsis
			tester.componentInstance.ellipses.set(false);

			// limiting to 3 (odd) page numbers
			tester.componentInstance.maxSize.set(3);
			tester.componentInstance.rotate.set(true);

			await expectPages(tester, ['-«', '+1', '2', '3', '»']);

			tester.componentInstance.page.set(2);

			await expectPages(tester, ['«', '1', '+2', '3', '»']);

			tester.componentInstance.page.set(3);

			await expectPages(tester, ['«', '2', '+3', '4', '»']);

			tester.componentInstance.page.set(7);

			await expectPages(tester, ['«', '5', '6', '+7', '-»']);

			// limiting to 4 (even) page numbers
			tester.componentInstance.maxSize.set(4);

			await expectPages(tester, ['«', '4', '5', '6', '+7', '-»']);

			tester.componentInstance.page.set(5);

			await expectPages(tester, ['«', '3', '4', '+5', '6', '»']);

			tester.componentInstance.page.set(3);

			await expectPages(tester, ['«', '1', '2', '+3', '4', '»']);
		});

		it('should display ellipsis correctly', async () => {
			const html = `<ngb-pagination [collectionSize]="70" [page]="page()"
        [maxSize]="maxSize()" [rotate]="rotate()" [ellipses]="ellipses()" />`;
			const tester = new PaginationTester(html);

			await expectPages(tester, ['-«', '+1', '2', '3', '4', '5', '6', '7', '»']);

			// limiting to 3 page numbers
			tester.componentInstance.maxSize.set(3);

			await expectPages(tester, ['-«', '+1', '2', '3', '-...', '7', '»']);

			tester.componentInstance.page.set(4);

			await expectPages(tester, ['«', '1', '-...', '+4', '5', '6', '7', '»']);

			tester.componentInstance.page.set(7);

			await expectPages(tester, ['«', '1', '-...', '+7', '-»']);

			// enabling rotation
			tester.componentInstance.rotate.set(true);
			tester.componentInstance.page.set(1);

			await expectPages(tester, ['-«', '+1', '2', '3', '-...', '7', '»']);

			tester.componentInstance.page.set(2);

			await expectPages(tester, ['«', '1', '+2', '3', '-...', '7', '»']);

			tester.componentInstance.page.set(3);

			await expectPages(tester, ['«', '1', '2', '+3', '4', '-...', '7', '»']);

			tester.componentInstance.page.set(4);

			await expectPages(tester, ['«', '1', '2', '3', '+4', '5', '6', '7', '»']);

			tester.componentInstance.page.set(5);

			await expectPages(tester, ['«', '1', '-...', '4', '+5', '6', '7', '»']);

			tester.componentInstance.page.set(6);

			await expectPages(tester, ['«', '1', '-...', '5', '+6', '7', '»']);

			tester.componentInstance.page.set(7);

			await expectPages(tester, ['«', '1', '-...', '5', '6', '+7', '-»']);

			// no ellipsis when maxPage > total pages
			tester.componentInstance.maxSize.set(100);
			tester.componentInstance.page.set(5);

			await expectPages(tester, ['«', '1', '2', '3', '4', '+5', '6', '7', '»']);
		});

		it('should use page number instead of ellipsis when ellipsis hides a single page', async () => {
			const html = `<ngb-pagination [collectionSize]="120" [page]="page()"
        [maxSize]="5" [rotate]="true" [ellipses]="true" />`;
			const tester = new PaginationTester(html);

			tester.componentInstance.page.set(1);

			await expectPages(tester, ['-«', '+1', '2', '3', '4', '5', '-...', '12', '»']);

			tester.componentInstance.page.set(2);

			await expectPages(tester, ['«', '1', '+2', '3', '4', '5', '-...', '12', '»']);

			tester.componentInstance.page.set(3);

			await expectPages(tester, ['«', '1', '2', '+3', '4', '5', '-...', '12', '»']);

			tester.componentInstance.page.set(4);

			await expectPages(tester, ['«', '1', '2', '3', '+4', '5', '6', '-...', '12', '»']);

			tester.componentInstance.page.set(5);

			await expectPages(tester, ['«', '1', '2', '3', '4', '+5', '6', '7', '-...', '12', '»']);

			tester.componentInstance.page.set(6);

			await expectPages(tester, ['«', '1', '-...', '4', '5', '+6', '7', '8', '-...', '12', '»']);

			tester.componentInstance.page.set(7);

			await expectPages(tester, ['«', '1', '-...', '5', '6', '+7', '8', '9', '-...', '12', '»']);

			tester.componentInstance.page.set(8);

			await expectPages(tester, ['«', '1', '-...', '6', '7', '+8', '9', '10', '11', '12', '»']);

			tester.componentInstance.page.set(9);

			await expectPages(tester, ['«', '1', '-...', '7', '8', '+9', '10', '11', '12', '»']);

			tester.componentInstance.page.set(10);

			await expectPages(tester, ['«', '1', '-...', '8', '9', '+10', '11', '12', '»']);

			tester.componentInstance.page.set(11);

			await expectPages(tester, ['«', '1', '-...', '8', '9', '10', '+11', '12', '»']);

			tester.componentInstance.page.set(12);

			await expectPages(tester, ['«', '1', '-...', '8', '9', '10', '11', '+12', '-»']);
		});

		it('should handle edge "maxSize" values', async () => {
			const html = '<ngb-pagination [collectionSize]="50" [maxSize]="maxSize()" />';
			const tester = new PaginationTester(html);

			tester.componentInstance.maxSize.set(2);

			await expectPages(tester, ['-«', '+1', '2', '-...', '5', '»']);

			tester.componentInstance.maxSize.set(0);

			await expectPages(tester, ['-«', '+1', '2', '3', '4', '5', '»']);

			tester.componentInstance.maxSize.set(100);

			await expectPages(tester, ['-«', '+1', '2', '3', '4', '5', '»']);

			tester.componentInstance.maxSize.set(NaN);

			await expectPages(tester, ['-«', '+1', '2', '3', '4', '5', '»']);

			tester.componentInstance.maxSize.set(null);

			await expectPages(tester, ['-«', '+1', '2', '3', '4', '5', '»']);
		});

		it('should handle edge "collectionSize" values', async () => {
			const html = '<ngb-pagination [collectionSize]="collectionSize()" />';
			const tester = new PaginationTester(html);

			tester.componentInstance.collectionSize.set(0);

			await expectPages(tester, ['-«', '-»']);

			tester.componentInstance.collectionSize.set(NaN);

			await expectPages(tester, ['-«', '-»']);

			tester.componentInstance.collectionSize.set(null);

			await expectPages(tester, ['-«', '-»']);
		});

		it('should handle edge "pageSize" values', async () => {
			const html = '<ngb-pagination [collectionSize]="50" [pageSize]="pageSize()" />';
			const tester = new PaginationTester(html);

			tester.componentInstance.pageSize.set(0);

			await expectPages(tester, ['-«', '-»']);

			tester.componentInstance.pageSize.set(NaN);

			await expectPages(tester, ['-«', '-»']);

			tester.componentInstance.pageSize.set(null);

			await expectPages(tester, ['-«', '-»']);
		});

		it('should handle edge "page" values', async () => {
			const html = '<ngb-pagination [collectionSize]="20" [page]="page()" />';
			const tester = new PaginationTester(html);

			tester.componentInstance.page.set(0);

			await expectPages(tester, ['-«', '+1', '2', '»']);

			tester.componentInstance.page.set(2016);

			await expectPages(tester, ['«', '1', '+2', '-»']);

			tester.componentInstance.page.set(NaN);
			await expectPages(tester, ['«', '1', '+2', '-»']);

			tester.componentInstance.page.set(null);
			await expectPages(tester, ['«', '1', '+2', '-»']);
		});

		it('should not emit "pageChange" for incorrect input values', async () => {
			const html = `<ngb-pagination [collectionSize]="collectionSize()" [pageSize]="pageSize()" [maxSize]="maxSize()"
        (pageChange)="onPageChange($event)" />`;
			const tester = new PaginationTester(html);
			await tester.fixture.whenStable();

			vi.spyOn(tester.componentInstance, 'onPageChange');

			tester.componentInstance.collectionSize.set(NaN);

			await tester.fixture.whenStable();

			tester.componentInstance.maxSize.set(NaN);

			await tester.fixture.whenStable();

			tester.componentInstance.pageSize.set(NaN);

			await tester.fixture.whenStable();

			expect(tester.componentInstance.onPageChange).not.toHaveBeenCalled();
		});

		it('should not emit "pageChange" when collection size is not set', async () => {
			const html = `<ngb-pagination [page]="page()" (pageChange)="onPageChange($event)" />`;
			const tester = new PaginationTester(html);
			await tester.fixture.whenStable();

			vi.spyOn(tester.componentInstance, 'onPageChange');

			tester.componentInstance.page.set(5);

			await tester.fixture.whenStable();

			expect(tester.componentInstance.onPageChange).not.toHaveBeenCalled();
		});

		it('should set classes correctly for disabled state', async () => {
			const html = `<ngb-pagination [collectionSize]="collectionSize()" [pageSize]="pageSize()" [maxSize]="maxSize()"
         [disabled]="true" />`;
			const tester = new PaginationTester(html);

			await expect.element(tester.pages).toHaveLength(12);
			for (let i = 0; i < tester.pages.length; i++) {
				await expect.element(tester.pages.nth(i)).toHaveClass('disabled');
			}
		});

		it('should set tabindex for links correctly for disabled state', async () => {
			const html = `<ngb-pagination [collectionSize]="collectionSize()" [pageSize]="pageSize()" [maxSize]="maxSize()"
      	  [disabled]="true" />`;
			const tester = new PaginationTester(html);

			await expect.element(tester.links).toHaveLength(12);
			for (let i = 0; i < tester.links.length; i++) {
				await expect.element(tester.links.nth(i)).toHaveAttribute('tabindex', '-1');
			}
		});

		it('should set aria-disabled for links correctly for disabled state', async () => {
			const html = `<ngb-pagination [collectionSize]="collectionSize()" [pageSize]="pageSize()" [maxSize]="maxSize()"
      		[disabled]="true" />`;
			const tester = new PaginationTester(html);

			await expect.element(tester.links).toHaveLength(12);
			for (let i = 0; i < tester.links.length; i++) {
				await expect.element(tester.links.nth(i)).toHaveAttribute('aria-disabled', 'true');
			}
		});
	});

	describe('Customization', () => {
		it('should allow overriding link templates', async () => {
			const tester = new PaginationTester(`
        <ngb-pagination [collectionSize]="50" [page]="1" [boundaryLinks]="true" [ellipses]="true" [maxSize]="2">
          <ng-template ngbPaginationFirst>F</ng-template>
          <ng-template ngbPaginationLast>L</ng-template>
          <ng-template ngbPaginationPrevious>P</ng-template>
          <ng-template ngbPaginationNext>N</ng-template>
          <ng-template ngbPaginationEllipsis>E</ng-template>
          <ng-template ngbPaginationNumber let-page let-currentPage="currentPage">{{ page }}!</ng-template>
        </ngb-pagination>
      `);

			await expectPages(tester, ['-F', '-P', '+1!', '2!', '-E', '5!', 'N', 'L'], 'E');
		});

		it('should pass disabled value to custom link templates', async () => {
			const tester = new PaginationTester(`
        <ngb-pagination [collectionSize]="30" [(page)]="page" [boundaryLinks]="true" [disabled]="disabled()">
          <ng-template ngbPaginationFirst let-disabled="disabled">{{ disabled ? 'dF' : 'F' }}</ng-template>
          <ng-template ngbPaginationLast let-disabled="disabled">{{ disabled ? 'dL' : 'L' }}</ng-template>
          <ng-template ngbPaginationPrevious let-disabled="disabled">{{ disabled ? 'dP' : 'P' }}</ng-template>
          <ng-template ngbPaginationNext let-disabled="disabled">{{ disabled ? 'dN' : 'N' }}</ng-template>
          <ng-template ngbPaginationNumber let-page let-currentPage="currentPage" let-disabled="disabled">
            {{ disabled ? 'd'+page : page }}
          </ng-template>
        </ngb-pagination>
      `);

			await expectPages(tester, ['-dF', '-dP', '+1', '2', '3', 'N', 'L']);

			tester.componentInstance.page.set(3);

			await expectPages(tester, ['F', 'P', '1', '2', '+3', '-dN', '-dL']);

			await tester.componentInstance.disabled.set(true);

			const firstPage = tester.links.nth(2);
			await expect.poll(() => firstPage.element().parentElement).toHaveClass('disabled');
			await expect.element(firstPage).toHaveTextContent('d1');
		});
	});

	describe('Custom Pages', () => {
		let tester: PaginationTester;

		beforeEach(() => {
			const html = `
				<ngb-pagination
					[collectionSize]="collectionSize()"
					[page]="page()"
					[pageSize]="pageSize()"
					[disabled]="disabled()"
				>
					<ng-template ngbPaginationPages let-page let-pages="pages" let-disabled="disabled">
						@if (pages.length > 0) {
							<li>
								<label>Pages</label>
								<input type="text" inputmode="numeric" pattern="[0-9]*" [disabled]="disabled" [value]="page" />
								<span>of {{ pages.length }}</span>
							</li>
						}
					</ng-template>
				</ngb-pagination>`;
			tester = new PaginationTester(html);
		});

		it('should render and respond to collectionSize change with customPages', async () => {
			tester.componentInstance.collectionSize.set(30);

			await expectPages(tester, ['-«', 'cPagesof 3,1', '»']);

			tester.componentInstance.collectionSize.set(40);

			await expectPages(tester, ['-«', 'cPagesof 4,1', '»']);
		});

		it('should render and respond to pageSize change with custom Pages', async () => {
			tester.componentInstance.collectionSize.set(30);
			tester.componentInstance.pageSize.set(5);

			await expectPages(tester, ['-«', 'cPagesof 6,1', '»']);

			tester.componentInstance.pageSize.set(10);

			await expectPages(tester, ['-«', 'cPagesof 3,1', '»']);
		});

		it('should render and respond to active page change with custom Pages', async () => {
			tester.componentInstance.collectionSize.set(30);
			tester.componentInstance.page.set(2);

			await expectPages(tester, ['«', 'cPagesof 3,2', '»']);

			tester.componentInstance.page.set(3);

			await expectPages(tester, ['«', 'cPagesof 3,3', '-»']);
		});

		it('should update selected page model on page on click with custom Pages', async () => {
			tester.componentInstance.collectionSize.set(30);
			tester.componentInstance.page.set(2);

			await expectPages(tester, ['«', 'cPagesof 3,2', '»']);

			await tester.links.nth(0).click();

			await expectPages(tester, ['-«', 'cPagesof 3,1', '»']);

			await tester.links.nth(1).click();

			await expectPages(tester, ['«', 'cPagesof 3,2', '»']);
		});

		it('should pass disabled flag with custom Pages', async () => {
			await expectPages(tester, ['-«', 'cPagesof 10,1', '»']);
			await expect.element(tester.input).not.toBeDisabled();

			tester.componentInstance.disabled.set(true);

			await expectPages(tester, ['-«', 'cPagesof 10,1', '-»']);
			await expect.element(tester.input).toBeDisabled();
		});
	});

	describe('Custom config', () => {
		let config: NgbPaginationConfig;

		beforeEach(() => {
			config = TestBed.inject(NgbPaginationConfig);
			config.boundaryLinks = true;
			config.directionLinks = false;
			config.ellipses = false;
			config.maxSize = 42;
			config.pageSize = 7;
			config.rotate = true;
			config.size = 'sm';
		});

		it('should initialize inputs with provided config', async () => {
			const fixture = TestBed.createComponent(NgbPagination);
			await fixture.whenStable();

			const pagination = fixture.componentInstance;
			expectSameValues(pagination, config);
		});
	});

	describe('Custom config as provider', () => {
		let config: NgbPaginationConfig;

		beforeEach(() => {
			config = TestBed.inject(NgbPaginationConfig);
			config.disabled = true;
			config.boundaryLinks = true;
			config.directionLinks = false;
			config.ellipses = false;
			config.maxSize = 42;
			config.pageSize = 7;
			config.rotate = true;
			config.size = 'sm';
		});

		it('should initialize inputs with provided config as provider', async () => {
			const fixture = TestBed.createComponent(NgbPagination);
			await fixture.whenStable();

			const pagination = fixture.componentInstance;
			expectSameValues(pagination, config);
		});
	});
});

@Component({
	selector: 'pagination-test-cmp',
	imports: [
		NgbPagination,
		NgbPaginationEllipsis,
		NgbPaginationFirst,
		NgbPaginationLast,
		NgbPaginationNext,
		NgbPaginationNumber,
		NgbPaginationPrevious,
		NgbPaginationPages,
	],
	template: '',
})
class TestComponent {
	disabled = signal(false);
	pageSize = signal<number | null>(10);
	collectionSize = signal<number | null>(100);
	page = signal<number | null>(1);
	boundaryLinks = signal(false);
	directionLinks = signal(false);
	size = signal<string | null>('');
	maxSize = signal<number | null>(0);
	ellipses = signal(true);
	rotate = signal(false);

	onPageChange = () => {};
}
