import { TestBed } from '@angular/core/testing';
import { NgbDatepickerConfig } from './datepicker-config';
import { describe, expect, it } from 'vitest';

describe('ngb-datepicker-config', () => {
	it('should have sensible default values', () => {
		const config = TestBed.inject(NgbDatepickerConfig);

		expect(config.dayTemplate).toBeUndefined();
		expect(config.displayMonths).toBe(1);
		expect(config.firstDayOfWeek).toBe(1);
		expect(config.markDisabled).toBeUndefined();
		expect(config.minDate).toBeUndefined();
		expect(config.maxDate).toBeUndefined();
		expect(config.navigation).toBe('select');
		expect(config.outsideDays).toBe('visible');
		expect(config.weekdays).toBe('narrow');
		expect(config.showWeekNumbers).toBe(false);
		expect(config.startDate).toBeUndefined();
	});
});
