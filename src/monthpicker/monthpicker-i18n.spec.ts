import { NgbMonthpickerI18nDefault } from './monthpicker-i18n';
import { TestBed } from '@angular/core/testing';

describe('ngb-monthpicker-i18n-default', () => {
	let i18n: NgbMonthpickerI18nDefault;

	beforeEach(() => {
		TestBed.configureTestingModule({ providers: [NgbMonthpickerI18nDefault] });
		i18n = TestBed.inject(NgbMonthpickerI18nDefault);
	});

	it('should return abbreviated month name', () => {
		expect(i18n.getMonthShortName(0)).toBe('');
		expect(i18n.getMonthShortName(1)).toBe('Jan');
		expect(i18n.getMonthShortName(12)).toBe('Dec');
		expect(i18n.getMonthShortName(13)).toBe('');
	});

	it('should return wide month name', () => {
		expect(i18n.getMonthFullName(0)).toBe('');
		expect(i18n.getMonthFullName(1)).toBe('January');
		expect(i18n.getMonthFullName(12)).toBe('December');
		expect(i18n.getMonthFullName(13)).toBe('');
	});

	it('should generate year numerals', () => {
		expect(i18n.getYearNumerals(0)).toBe('0');
		expect(i18n.getYearNumerals(2000)).toBe('2000');
	});
});
