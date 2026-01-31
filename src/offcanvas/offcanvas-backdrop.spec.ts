import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { NgbOffcanvasBackdrop } from './offcanvas-backdrop';
import { OffcanvasDismissReasons } from './offcanvas-dismiss-reasons';
import { inputBinding } from '@angular/core';

describe('ngb-offcanvas-backdrop', () => {
	it('should render backdrop with required CSS classes', async () => {
		const fixture = TestBed.createComponent(NgbOffcanvasBackdrop);

		await fixture.whenStable();
		expect(fixture.nativeElement).toHaveCssClass('offcanvas-backdrop');
		expect(fixture.nativeElement).toHaveCssClass('show');
		expect(fixture.nativeElement).not.toHaveCssClass('fade');
	});

	it('should render correct CSS classes for animations', async () => {
		const fixture = TestBed.createComponent(NgbOffcanvasBackdrop, {
			bindings: [inputBinding('animation', () => true)],
		});

		await fixture.whenStable();
		expect(fixture.nativeElement).toHaveCssClass('show');
		expect(fixture.nativeElement).toHaveCssClass('fade');
	});

	it('should render custom CSS class', async () => {
		const fixture = TestBed.createComponent(NgbOffcanvasBackdrop, {
			bindings: [inputBinding('backdropClass', () => 'custom-backdrop')],
		});

		await fixture.whenStable();
		expect(fixture.nativeElement).toHaveCssClass('custom-backdrop');
	});

	it('should emit dismiss event on mousedown', async () => {
		const fixture = TestBed.createComponent(NgbOffcanvasBackdrop);
		await fixture.whenStable();

		let emittedEvent: any;
		fixture.componentInstance.dismissEvent.subscribe((event) => (emittedEvent = event));
		fixture.nativeElement.dispatchEvent(new Event('mousedown'));
		await fixture.whenStable();

		expect(emittedEvent).toBe(OffcanvasDismissReasons.BACKDROP_CLICK);
	});

	it('should not emit dismiss event on mousedown if static is true', async () => {
		const fixture = TestBed.createComponent(NgbOffcanvasBackdrop, {
			bindings: [inputBinding('static', () => true)],
		});
		await fixture.whenStable();

		let emittedEvent: any;
		fixture.componentInstance.dismissEvent.subscribe((event) => (emittedEvent = event));
		fixture.nativeElement.dispatchEvent(new Event('mousedown'));
		await fixture.whenStable();

		expect(emittedEvent).toBeUndefined();
	});
});
