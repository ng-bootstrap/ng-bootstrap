import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { NgbModalBackdrop } from './modal-backdrop';
import { inputBinding } from '@angular/core';

describe('ngb-modal-backdrop', () => {
	it('should render backdrop with required CSS classes', async () => {
		const fixture = TestBed.createComponent(NgbModalBackdrop);

		await fixture.whenStable();
		expect(fixture.nativeElement).toHaveCssClass('modal-backdrop');
		expect(fixture.nativeElement).toHaveCssClass('show');
		expect(fixture.nativeElement).not.toHaveCssClass('fade');
	});

	it('should render correct CSS classes for animations', async () => {
		const fixture = TestBed.createComponent(NgbModalBackdrop, {
			bindings: [inputBinding('animation', () => true)],
		});

		await fixture.whenStable();
		expect(fixture.nativeElement).toHaveCssClass('show');
		expect(fixture.nativeElement).toHaveCssClass('fade');
	});
});
