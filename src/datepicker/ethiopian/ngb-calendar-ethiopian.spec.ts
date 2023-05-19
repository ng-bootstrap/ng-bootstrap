import { NgbDate } from '../ngb-date';
import { NgbCalendarEthiopian } from './ngb-calendar-ethiopian';

describe('ngb-calendar-ethiopian', () => {
	let calendar: NgbCalendarEthiopian = new NgbCalendarEthiopian();

	it('should return number of days per week', () => {
		expect(calendar.getDaysPerWeek()).toBe(7);
	});

	it('should return number of weeks per month', () => {
		expect(calendar.getWeeksPerMonth()).toBe(6);
	});

	it('should add days to date', () => {
		expect(calendar.getNext(new NgbDate(2000, 13, 5))).toEqual(new NgbDate(2001, 1, 1));
		expect(calendar.getNext(new NgbDate(1999, 13, 5))).toEqual(new NgbDate(1999, 13, 6));
	});

	it('should subtract days from date', () => {
		expect(calendar.getPrev(new NgbDate(1999, 13, 6))).toEqual(new NgbDate(1999, 13, 5));
		expect(calendar.getPrev(new NgbDate(2001, 1, 1))).toEqual(new NgbDate(2000, 13, 5));
	});

	it('should add months to date', () => {
		expect(calendar.getNext(new NgbDate(2000, 12, 30), 'm')).toEqual(new NgbDate(2000, 13, 1));
		expect(calendar.getNext(new NgbDate(1999, 13, 6), 'm')).toEqual(new NgbDate(2000, 1, 1));
	});

	it('should subtract months from date', () => {
		expect(calendar.getPrev(new NgbDate(2000, 13, 1), 'm')).toEqual(new NgbDate(2000, 12, 1));
		expect(calendar.getPrev(new NgbDate(1999, 13, 6), 'm')).toEqual(new NgbDate(1999, 12, 1));
	});

	it('should add years to date', () => {
		expect(calendar.getNext(new NgbDate(2000, 13, 1), 'y')).toEqual(new NgbDate(2001, 1, 1));
		expect(calendar.getNext(new NgbDate(1999, 13, 6), 'y')).toEqual(new NgbDate(2000, 1, 1));
	});

	it('should subtract years from date', () => {
		expect(calendar.getPrev(new NgbDate(2001, 13, 1), 'y')).toEqual(new NgbDate(2000, 1, 1));
		expect(calendar.getPrev(new NgbDate(1999, 13, 6), 'y')).toEqual(new NgbDate(1998, 1, 1));
	});
});
