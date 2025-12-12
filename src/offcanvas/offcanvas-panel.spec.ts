import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { NgbOffcanvasPanel } from './offcanvas-panel';
import { provideZoneChangeDetection } from '@angular/core';

describe('ngb-offcanvas-panel', () => {
	let fixture: ComponentFixture<NgbOffcanvasPanel>;

	beforeEach(() => {
		TestBed.configureTestingModule({ providers: [provideZoneChangeDetection()] });
		fixture = TestBed.createComponent(NgbOffcanvasPanel);
	});

	describe('basic rendering functionality', () => {
		it('should render default offcanvas panel', () => {
			fixture.detectChanges();

			expect(fixture.nativeElement).toHaveCssClass('offcanvas');
			expect(fixture.nativeElement).toHaveCssClass('offcanvas-start');
		});

		it('should render default offcanvas panel with a specified position', () => {
			fixture.componentInstance.position = 'end';
			fixture.detectChanges();

			expect(fixture.nativeElement).toHaveCssClass('offcanvas-end');
		});

		it('should render default offcanvas panel with a specified class', () => {
			fixture.componentInstance.panelClass = 'custom-class';
			fixture.detectChanges();

			expect(fixture.nativeElement).toHaveCssClass('custom-class');
		});

		it('aria attributes', () => {
			fixture.detectChanges();

			expect(fixture.nativeElement.getAttribute('role')).toBe('dialog');

			expect(fixture.nativeElement.getAttribute('aria-labelledby')).toBeFalsy();
			expect(fixture.nativeElement.getAttribute('aria-describedby')).toBeFalsy();

			fixture.componentInstance.ariaLabelledBy = 'label';
			fixture.componentInstance.ariaDescribedBy = 'description';

			fixture.detectChanges();

			expect(fixture.nativeElement.getAttribute('aria-labelledby')).toBe('label');
			expect(fixture.nativeElement.getAttribute('aria-describedby')).toBe('description');
		});
	});
});
