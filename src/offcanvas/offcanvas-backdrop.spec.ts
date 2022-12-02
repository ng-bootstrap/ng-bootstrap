import { TestBed } from '@angular/core/testing';

import { NgbOffcanvasBackdrop } from './offcanvas-backdrop';
import { OffcanvasDismissReasons } from './offcanvas-dismiss-reasons';

describe('ngb-offcanvas-backdrop', () => {
	it('should render backdrop with required CSS classes', () => {
		const fixture = TestBed.createComponent(NgbOffcanvasBackdrop);

		fixture.detectChanges();
		expect(fixture.nativeElement).toHaveCssClass('offcanvas-backdrop');
		expect(fixture.nativeElement).toHaveCssClass('show');
		expect(fixture.nativeElement).not.toHaveCssClass('fade');
	});

	it('should render correct CSS classes for animations', () => {
		const fixture = TestBed.createComponent(NgbOffcanvasBackdrop);
		fixture.componentInstance.animation = true;

		fixture.detectChanges();
		expect(fixture.nativeElement).toHaveCssClass('show');
		expect(fixture.nativeElement).toHaveCssClass('fade');
	});

	it('should render custom CSS class', () => {
		const fixture = TestBed.createComponent(NgbOffcanvasBackdrop);
		fixture.componentInstance.backdropClass = 'custom-backdrop';

		fixture.detectChanges();
		expect(fixture.nativeElement).toHaveCssClass('custom-backdrop');
	});

	it('should emit dismiss event on mousedown', () => {
		const fixture = TestBed.createComponent(NgbOffcanvasBackdrop);
		fixture.detectChanges();

		let emittedEvent: any;
		fixture.componentInstance.dismissEvent.subscribe((event) => (emittedEvent = event));
		fixture.nativeElement.dispatchEvent(new Event('mousedown'));
		fixture.detectChanges();

		expect(emittedEvent).toBe(OffcanvasDismissReasons.BACKDROP_CLICK);
	});

	it('should not emit dismiss event on mousedown if static is true', () => {
		const fixture = TestBed.createComponent(NgbOffcanvasBackdrop);
		fixture.componentInstance.static = true;
		fixture.detectChanges();

		let emittedEvent: any;
		fixture.componentInstance.dismissEvent.subscribe((event) => (emittedEvent = event));
		fixture.nativeElement.dispatchEvent(new Event('mousedown'));
		fixture.detectChanges();

		expect(emittedEvent).toBeUndefined();
	});
});
