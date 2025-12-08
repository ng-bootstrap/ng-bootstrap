import { NgbTimepickerI18n } from './timepicker-i18n';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

describe('ngb-timepicker-i18n-default', () => {
	let i18n: NgbTimepickerI18n;

	beforeEach(() => {
		i18n = TestBed.inject(NgbTimepickerI18n);
	});

	it('should return morning period', () => {
		expect(i18n.getMorningPeriod()).toBe('AM');
	});

	it('should return afternoon period', () => {
		expect(i18n.getAfternoonPeriod()).toBe('PM');
	});
});
