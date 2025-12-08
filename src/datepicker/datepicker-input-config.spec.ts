import { TestBed } from '@angular/core/testing';
import { NgbInputDatepickerConfig } from './datepicker-input-config';
import { describe, expect, it } from 'vitest';

describe('NgbInputDatepickerConfig', () => {
	it('should have sensible default values', () => {
		const config = TestBed.inject(NgbInputDatepickerConfig);

		expect(config.autoClose).toBe(true);
		expect(config.container).toBeUndefined();
		expect(config.positionTarget).toBeUndefined();
		expect(config.placement).toEqual(['bottom-start', 'bottom-end', 'top-start', 'top-end']);
		expect(config.popperOptions({})).toEqual({});
		expect(config.restoreFocus).toBe(true);
	});
});
