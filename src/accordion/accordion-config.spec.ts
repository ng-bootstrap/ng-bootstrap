/* eslint-disable deprecation/deprecation */
import { NgbAccordionConfig } from './accordion-config';
import { TestBed } from '@angular/core/testing';

describe('ngb-accordion-config', () => {
	it('should have sensible default values', () => {
		const config = TestBed.inject(NgbAccordionConfig);

		expect(config.closeOthers).toBe(false);
		expect(config.destroyOnHide).toBe(true);
	});
});
