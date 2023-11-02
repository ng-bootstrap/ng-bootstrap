import { NgbMonth } from './ngb-month';

describe('ngb-date', () => {
	describe('from', () => {
		it('should create a date from a structure', () => {
			expect(NgbMonth.from({ year: 2010, month: 10 })).toEqual(new NgbMonth(2010, 10));
		});

		it('should work with non-numeric values', () => {
			expect(NgbMonth.from(<any>{ year: null, month: null })).toEqual(new NgbMonth(<any>null, <any>null));
			expect(NgbMonth.from(<any>{ year: undefined, month: undefined })).toEqual(new NgbMonth(<any>null, <any>null));
			expect(NgbMonth.from({ year: <any>'2010', month: <any>'10' })).toEqual(new NgbMonth(<any>null, <any>null));
		});

		it('should return the same NgbMonth object', () => {
			const date = new NgbMonth(2010, 10);
			expect(NgbMonth.from(date)).toBe(date);
		});
	});

	describe('equals', () => {
		const date = new NgbMonth(2016, 8);

		it('should return true for the same dates', () => {
			expect(date.equals(new NgbMonth(2016, 8))).toBeTruthy();
		});

		it('should work with structures', () => {
			expect(date.equals({ month: 8, year: 2016 })).toBeTruthy();
		});

		it('should return false different dates', () => {
			expect(date.equals(new NgbMonth(0, 8))).toBeFalsy();
			expect(date.equals(new NgbMonth(2016, 0))).toBeFalsy();
			expect(date.equals(new NgbMonth(2016, 8))).toBeFalsy();
		});

		it('should return false undefined and null values', () => {
			expect(date.equals(null)).toBeFalsy();
			expect(date.equals(undefined)).toBeFalsy();
		});
	});

	describe('before', () => {
		const date = new NgbMonth(2016, 8);

		it('should return false undefined and null values', () => {
			expect(date.before(null)).toBeFalsy();
			expect(date.before(undefined)).toBeFalsy();
		});

		it('should work with structures', () => {
			expect(date.before({ month: 9, year: 2016 })).toBeTruthy();
		});

		it('should return true if current date is before the other one', () => {
			expect(date.before(new NgbMonth(2016, 8))).toBeTruthy();
			expect(date.before(new NgbMonth(2016, 9))).toBeTruthy();
			expect(date.before(new NgbMonth(2017, 8))).toBeTruthy();
		});

		it('should return false if current date is after the other one', () => {
			expect(date.before(new NgbMonth(2016, 8))).toBeFalsy();
			expect(date.before(new NgbMonth(2016, 7))).toBeFalsy();
			expect(date.before(new NgbMonth(2015, 8))).toBeFalsy();
		});
	});

	describe('after', () => {
		const date = new NgbMonth(2016, 8);

		it('should return false undefined and null values', () => {
			expect(date.after(null)).toBeFalsy();
			expect(date.after(undefined)).toBeFalsy();
		});

		it('should work with structures', () => {
			expect(date.after({ month: 8, year: 2016 })).toBeTruthy();
		});

		it('should return true if current date is after the other one', () => {
			expect(date.after(new NgbMonth(2016, 8))).toBeTruthy();
			expect(date.after(new NgbMonth(2016, 7))).toBeTruthy();
			expect(date.after(new NgbMonth(2015, 8))).toBeTruthy();
		});

		it('should return false if current date is before the other one', () => {
			expect(date.after(new NgbMonth(2016, 8))).toBeFalsy();
			expect(date.after(new NgbMonth(2016, 9))).toBeFalsy();
			expect(date.after(new NgbMonth(2017, 8))).toBeFalsy();
		});
	});
});
