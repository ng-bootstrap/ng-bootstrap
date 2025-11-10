/* eslint-disable deprecation/deprecation */
import { NgbAccordionConfig } from './accordion-config';
import { TestBed } from '@angular/core/testing';

describe('ngb-accordion-config', () => {
	let config: NgbAccordionConfig;

	beforeEach(() => {
		config = TestBed.inject(NgbAccordionConfig);
	});

	it('should have sensible default values', () => {
		expect(config.closeOthers).toBe(false);
		expect(config.destroyOnHide).toBe(true);
	});

	it('should set animation with correct value', () => {
		expect(config['_animation']).toBeUndefined();

		config.animation = true;
		expect(config['_animation']).toBe(true);

		config.animation = false;
		expect(config['_animation']).toBe(false);
	});
});
