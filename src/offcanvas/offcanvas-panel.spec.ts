import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { NgbOffcanvasPanel } from './offcanvas-panel';
import { inputBinding, signal } from '@angular/core';

describe('ngb-offcanvas-panel', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({});
	});

	describe('basic rendering functionality', () => {
		it('should render default offcanvas panel', async () => {
			const fixture = TestBed.createComponent(NgbOffcanvasPanel);
			await fixture.whenStable();

			expect(fixture.nativeElement).toHaveCssClass('offcanvas');
			expect(fixture.nativeElement).toHaveCssClass('offcanvas-start');
		});

		it('should render default offcanvas panel with a specified position', async () => {
			const fixture = TestBed.createComponent(NgbOffcanvasPanel, {
				bindings: [inputBinding('position', () => 'end')],
			});
			await fixture.whenStable();

			expect(fixture.nativeElement).toHaveCssClass('offcanvas-end');
		});

		it('should render default offcanvas panel with a specified class', async () => {
			const fixture = TestBed.createComponent(NgbOffcanvasPanel, {
				bindings: [inputBinding('panelClass', () => 'custom-class')],
			});
			await fixture.whenStable();

			expect(fixture.nativeElement).toHaveCssClass('custom-class');
		});

		it('aria attributes', async () => {
			const ariaLabelledBy = signal<string | undefined>(undefined);
			const ariaDescribedBy = signal<string | undefined>(undefined);
			const fixture = TestBed.createComponent(NgbOffcanvasPanel, {
				bindings: [inputBinding('ariaLabelledBy', ariaLabelledBy), inputBinding('ariaDescribedBy', ariaDescribedBy)],
			});
			await fixture.whenStable();

			expect(fixture.nativeElement.getAttribute('role')).toBe('dialog');

			expect(fixture.nativeElement.getAttribute('aria-labelledby')).toBeFalsy();
			expect(fixture.nativeElement.getAttribute('aria-describedby')).toBeFalsy();

			ariaLabelledBy.set('label');
			ariaDescribedBy.set('description');

			await fixture.whenStable();

			expect(fixture.nativeElement.getAttribute('aria-labelledby')).toBe('label');
			expect(fixture.nativeElement.getAttribute('aria-describedby')).toBe('description');
		});
	});
});
