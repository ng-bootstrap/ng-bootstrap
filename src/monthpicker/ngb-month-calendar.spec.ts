import { NgbMonthCalendarGregorian } from './ngb-month-calendar';
import { NgbMonth } from './ngb-month';

describe('ngb-calendar-gregorian', () => {
	const calendar = new NgbMonthCalendarGregorian();

	it("should return today's date", () => {
		const jsToday = new Date();
		const today = new NgbMonth(jsToday.getFullYear(), jsToday.getMonth() + 1);

		expect(calendar.getToday()).toEqual(today);
	});

	it('should return months of a year', () => {
		expect(calendar.getMonths()).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
	});

	it('should add days to date', () => {
		expect(calendar.getNext(new NgbMonth(2016, 12))).toEqual(new NgbMonth(2017, 1));
		expect(calendar.getNext(new NgbMonth(2016, 2))).toEqual(new NgbMonth(2016, 2));
		expect(calendar.getNext(new NgbMonth(2017, 2))).toEqual(new NgbMonth(2017, 3));
	});

	it('should subtract days from date', () => {
		expect(calendar.getPrev(new NgbMonth(2017, 1))).toEqual(new NgbMonth(2016, 12));
		expect(calendar.getPrev(new NgbMonth(2016, 2))).toEqual(new NgbMonth(2016, 2));
		expect(calendar.getPrev(new NgbMonth(2017, 3))).toEqual(new NgbMonth(2017, 2));
	});

	it('should add months to date', () => {
		expect(calendar.getNext(new NgbMonth(2016, 7), 'm')).toEqual(new NgbMonth(2016, 8));
		expect(calendar.getNext(new NgbMonth(2016, 7), 'm')).toEqual(new NgbMonth(2016, 8));
		expect(calendar.getNext(new NgbMonth(2016, 12), 'm')).toEqual(new NgbMonth(2017, 1));
		expect(calendar.getNext(new NgbMonth(2016, 1), 'm')).toEqual(new NgbMonth(2016, 2));
		expect(calendar.getNext(new NgbMonth(2016, 1), 'm')).toEqual(new NgbMonth(2016, 2));
		expect(calendar.getNext(new NgbMonth(2016, 10), 'm', 6)).toEqual(new NgbMonth(2017, 4));
		expect(calendar.getNext(new NgbMonth(2016, 10), 'm', 6)).toEqual(new NgbMonth(2017, 4));
	});

	it('should subtract months from date', () => {
		expect(calendar.getPrev(new NgbMonth(2016, 7), 'm')).toEqual(new NgbMonth(2016, 6));
		expect(calendar.getPrev(new NgbMonth(2016, 8), 'm')).toEqual(new NgbMonth(2016, 7));
		expect(calendar.getPrev(new NgbMonth(2017, 1), 'm')).toEqual(new NgbMonth(2016, 12));
		expect(calendar.getPrev(new NgbMonth(2016, 3), 'm')).toEqual(new NgbMonth(2016, 2));
		expect(calendar.getPrev(new NgbMonth(2016, 3), 'm')).toEqual(new NgbMonth(2016, 2));
		expect(calendar.getPrev(new NgbMonth(2016, 10), 'm', 4)).toEqual(new NgbMonth(2016, 6));
		expect(calendar.getPrev(new NgbMonth(2016, 10), 'm', 4)).toEqual(new NgbMonth(2016, 6));
	});

	it('should add years to date', () => {
		expect(calendar.getNext(new NgbMonth(2016, 1), 'y')).toEqual(new NgbMonth(2017, 1));
		expect(calendar.getNext(new NgbMonth(2017, 12), 'y')).toEqual(new NgbMonth(2018, 12));
		expect(calendar.getNext(new NgbMonth(2016, 2), 'y')).toEqual(new NgbMonth(2017, 2));
		expect(calendar.getNext(new NgbMonth(2016, 2), 'y')).toEqual(new NgbMonth(2017, 2));
		expect(calendar.getNext(new NgbMonth(2016, 2), 'y', 4)).toEqual(new NgbMonth(2020, 2));
		expect(calendar.getNext(new NgbMonth(2016, 2), 'y', 3)).toEqual(new NgbMonth(2019, 2));
	});

	it('should subtract years from date', () => {
		expect(calendar.getPrev(new NgbMonth(2016, 12), 'y')).toEqual(new NgbMonth(2015, 12));
		expect(calendar.getPrev(new NgbMonth(2017, 1), 'y')).toEqual(new NgbMonth(2016, 1));
		expect(calendar.getPrev(new NgbMonth(2016, 2), 'y')).toEqual(new NgbMonth(2015, 2));
		expect(calendar.getPrev(new NgbMonth(2016, 2), 'y')).toEqual(new NgbMonth(2015, 2));
		expect(calendar.getPrev(new NgbMonth(2016, 2), 'y', 4)).toEqual(new NgbMonth(2012, 2));
		expect(calendar.getPrev(new NgbMonth(2016, 2), 'y', 3)).toEqual(new NgbMonth(2013, 2));
	});

	it('should properly recognize invalid javascript date', () => {
		expect(calendar.isValid(null)).toBeFalsy();
		expect(calendar.isValid(<any>undefined)).toBeFalsy();
		expect(calendar.isValid(<any>NaN)).toBeFalsy();
		expect(calendar.isValid(<any>new Date())).toBeFalsy();
		expect(calendar.isValid(new NgbMonth(<any>null, <any>null))).toBeFalsy();
		expect(calendar.isValid(new NgbMonth(<any>undefined, <any>undefined))).toBeFalsy();
		expect(calendar.isValid(new NgbMonth(NaN, NaN))).toBeFalsy();
		expect(calendar.isValid(new NgbMonth(<any>'2017', <any>'03'))).toBeFalsy();
	});

	it('should recognize dates outside of JS range as invalid', () => {
		expect(calendar.isValid(new NgbMonth(275760, 9))).toBeFalsy();
		expect(calendar.isValid(new NgbMonth(-271821, 4))).toBeFalsy();
	});

	it('should recognize dates outside of calendar range as invalid', () => {
		expect(calendar.isValid(new NgbMonth(0, 0))).toBeFalsy();
		expect(calendar.isValid(new NgbMonth(-1, -1))).toBeFalsy();
		expect(calendar.isValid(new NgbMonth(2016, 17))).toBeFalsy();
		expect(calendar.isValid(new NgbMonth(2017, 5))).toBeFalsy();
	});

	it('should mark valid JS dates as valid', () => {
		expect(calendar.isValid(new NgbMonth(275760, 9))).toBeTruthy();
		expect(calendar.isValid(new NgbMonth(2016, 8))).toBeTruthy();
	});

	it('should dates with year 0 as invalid', () => {
		expect(calendar.isValid(new NgbMonth(0, 1))).toBeFalsy();
	});
});
