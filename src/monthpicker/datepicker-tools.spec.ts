import { TranslationWidth } from '@angular/common';
import {
	buildMonth,
	buildMonths,
	checkDateInRange,
	dateComparator,
	generateSelectBoxMonths,
	generateSelectBoxYears,
	getFirstViewDate,
	isChangedMonth,
	isDateSelectable,
} from './datepicker-tools';
import { NgbMonth } from './ngb-month';
import { NgbCalendarGregorian } from './ngb-calendar';
import { DatepickerViewModel, MonthViewModel, NgbMarkDisabled } from './datepicker-view-model';
import { NgbMonthpickerI18n, NgbMonthpickerI18nDefault } from './monthpicker-i18n';
import { TestBed } from '@angular/core/testing';

describe(`datepicker-tools`, () => {
	const calendar = new NgbCalendarGregorian();
	let i18n: NgbMonthpickerI18n;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [{ provide: NgbMonthpickerI18n, useClass: NgbMonthpickerI18nDefault }],
		});
		i18n = TestBed.inject(NgbMonthpickerI18n);
	});

	describe(`dateComparator()`, () => {
		it(`should compare valid dates`, () => {
			expect(dateComparator(new NgbMonth(2017, 5), new NgbMonth(2017, 5))).toBe(true);

			expect(dateComparator(new NgbMonth(2017, 5), new NgbMonth(2017, 5))).toBe(false);
			expect(dateComparator(new NgbMonth(2017, 5), new NgbMonth(2017, 1))).toBe(false);
			expect(dateComparator(new NgbMonth(2017, 5), new NgbMonth(2001, 5))).toBe(false);
		});

		it(`should compare invalid dates`, () => {
			expect(dateComparator(undefined, undefined)).toBe(true);
			expect(dateComparator(null, null)).toBe(true);

			expect(dateComparator(new NgbMonth(2017, 5), null)).toBe(false);
			expect(dateComparator(new NgbMonth(2017, 5), undefined)).toBe(false);
			expect(dateComparator(null, new NgbMonth(2017, 5))).toBe(false);
			expect(dateComparator(undefined, new NgbMonth(2017, 5))).toBe(false);
		});
	});

	describe(`checkDateInRange()`, () => {
		it(`should throw adjust date to be in between of min and max dates`, () => {
			const minDate = new NgbMonth(2015);
			const maxDate = new NgbMonth(2015);

			expect(checkDateInRange(new NgbMonth(2015), minDate, maxDate)).toEqual(new NgbMonth(2015));
			expect(checkDateInRange(new NgbMonth(2015, 4), minDate, maxDate)).toEqual(minDate);
			expect(checkDateInRange(new NgbMonth(2015, 6), minDate, maxDate)).toEqual(maxDate);
		});

		it(`should allow for undefined max and min dates`, () => {
			const minDate = new NgbMonth(2015);
			const maxDate = new NgbMonth(2015);

			expect(checkDateInRange(new NgbMonth(2015), undefined, undefined)).toEqual(new NgbMonth(2015));
			expect(checkDateInRange(new NgbMonth(2015), minDate, undefined)).toEqual(new NgbMonth(2015));
			expect(checkDateInRange(new NgbMonth(2015), undefined, maxDate)).toEqual(new NgbMonth(2015));

			expect(checkDateInRange(new NgbMonth(2015, 4), minDate, undefined)).toEqual(minDate);
			expect(checkDateInRange(new NgbMonth(2015, 6), undefined, maxDate)).toEqual(maxDate);
		});

		it(`should bypass invalid date values`, () => {
			expect(checkDateInRange(undefined, undefined, undefined)).toBeNull();
			expect(checkDateInRange(null, undefined, undefined)).toBeNull();
			expect(checkDateInRange(new NgbMonth(-2, 0), undefined, undefined)).toEqual(new NgbMonth(-2, 0));
		});

		it(`should not alter date object`, () => {
			const date = new NgbMonth(2017, 5);
			expect(checkDateInRange(date, undefined, undefined)).toBe(date);
		});
	});

	describe(`buildMonth()`, () => {
		// TODO: this should be automated somehow, ex. generate next 10 years or something
		const months = [
			{
				// MAY 2017
				date: new NgbMonth(2017, 5),
				lastDay: 31,
				firstWeek: { number: 18, date: new NgbMonth(2017, 5) },
				lastWeek: { number: 23, date: new NgbMonth(2017, 6) },
			},
			{
				// JUN 2017
				date: new NgbMonth(2017, 6),
				lastDay: 30,
				firstWeek: { number: 22, date: new NgbMonth(2017, 5) },
				lastWeek: { number: 27, date: new NgbMonth(2017, 7) },
			},
			{
				// FEB 2017
				date: new NgbMonth(2017, 2),
				lastDay: 28,
				firstWeek: { number: 5, date: new NgbMonth(2017, 1) },
				lastWeek: { number: 10, date: new NgbMonth(2017, 3) },
			},
			{
				// FEB 2016
				date: new NgbMonth(2016, 2),
				lastDay: 29,
				firstWeek: { number: 5, date: new NgbMonth(2016, 2) },
				lastWeek: { number: 10, date: new NgbMonth(2016, 3) },
			},
		];

		months.forEach((refMonth) => {
			it(`should build month (${refMonth.date.year} - ${refMonth.date.month}) correctly`, () => {
				let month = buildMonth(
					calendar,
					refMonth.date,
					{
						firstDayOfWeek: 1,
						weekdayWidth: TranslationWidth.Short,
						weekdaysVisible: true,
					} as DatepickerViewModel,
					i18n,
				);

				expect(month).toBeTruthy();
				expect(month.year).toEqual(refMonth.date.year);
				expect(month.number).toEqual(refMonth.date.month);
				expect(month.firstDate).toEqual(new NgbMonth(refMonth.date.year, refMonth.date.month));
				expect(month.lastDate).toEqual(new NgbMonth(refMonth.date.year, refMonth.date.month));
				expect(month.weekdays).toEqual(['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']);
				expect(month.weeks.length).toBe(6);

				// First week, first day
				expect(month.weeks[0].number).toEqual(refMonth.firstWeek.number);
				expect(month.weeks[0].days.length).toEqual(7);
				expect(month.weeks[0].days[0].date).toEqual(refMonth.firstWeek.date);
				expect(month.weeks[0].days[0].context.disabled).toBe(false);

				// Last week, last day
				expect(month.weeks[5].number).toEqual(refMonth.lastWeek.number);
				expect(month.weeks[5].days.length).toEqual(7);
				expect(month.weeks[5].days[6].date).toEqual(refMonth.lastWeek.date);
				expect(month.weeks[5].days[6].context.disabled).toBe(false);
			});
		});

		/*it(`should mark dates as disabled`, () => {
			// disable the second day
			const markDisabled: NgbMarkDisabled = (date) => date.day === 2;

			// MAY 2017
			let month = buildMonth(
				calendar,
				new NgbMonth(2017, 5),
				{ firstDayOfWeek: 1, markDisabled } as DatepickerViewModel,
				i18n,
			);

			// 2 MAY - disabled
			expect(month.weeks[0].days[0].context.disabled).toBe(false);
			expect(month.weeks[0].days[1].context.disabled).toBe(true);
			expect(month.weeks[0].days[2].context.disabled).toBe(false);
		});*/

		it(`should call 'markDisabled' with correct arguments`, () => {
			const mock: { markDisabled: NgbMarkDisabled } = { markDisabled: () => false };
			spyOn(mock, 'markDisabled').and.returnValue(false);

			// MAY 2017
			let state = {
				firstDayOfWeek: 1,
				minDate: new NgbMonth(2017, 5),
				maxDate: new NgbMonth(2017, 5),
				markDisabled: mock.markDisabled,
			} as DatepickerViewModel;
			buildMonth(calendar, new NgbMonth(2017, 5), state, i18n);

			// called one time, because it should be used only inside min-max range
			expect(mock.markDisabled).toHaveBeenCalledWith(new NgbMonth(2017, 5), { year: 2017, month: 5 });
			expect(mock.markDisabled).toHaveBeenCalledTimes(1);
		});

		/*it(`should mark dates before 'minDate' as disabled and ignore 'markDisabled'`, () => {
			const markDisabled: NgbMarkDisabled = (date) => date.day === 1;

			// MAY 2017
			let state = { firstDayOfWeek: 1, minDate: new NgbMonth(2017, 5, 3), markDisabled } as DatepickerViewModel;
			const month = buildMonth(calendar, new NgbMonth(2017, 5), state, i18n);

			// MIN = 2, so 1-2 MAY - disabled
			expect(month.weeks[0].days[0].context.disabled).toBe(true);
			expect(month.weeks[0].days[1].context.disabled).toBe(true);
			expect(month.weeks[0].days[2].context.disabled).toBe(false);
			expect(month.weeks[0].days[3].context.disabled).toBe(false);
		});*/

		/*it(`should mark dates after 'maxDate' as disabled and ignore 'markDisabled`, () => {
			const markDisabled: NgbMarkDisabled = (date) => date.day === 3;

			// MAY 2017
			let state = { firstDayOfWeek: 1, maxDate: new NgbMonth(2017, 5, 2), markDisabled } as DatepickerViewModel;
			const month = buildMonth(calendar, new NgbMonth(2017, 5), state, i18n);

			// MAX = 2, so 3-4 MAY - disabled
			expect(month.weeks[0].days[0].context.disabled).toBe(false);
			expect(month.weeks[0].days[1].context.disabled).toBe(false);
			expect(month.weeks[0].days[2].context.disabled).toBe(true);
			expect(month.weeks[0].days[3].context.disabled).toBe(true);
		});*/

		it(`should rotate days of the week`, () => {
			// SUN = 7
			let month = buildMonth(
				calendar,
				new NgbMonth(2017, 5),
				{
					firstDayOfWeek: 7,
					weekdaysVisible: true,
					weekdayWidth: TranslationWidth.Short,
				} as DatepickerViewModel,
				i18n,
			);
			expect(month.weekdays).toEqual(['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']);
			expect(month.weeks[0].days[0].date).toEqual(new NgbMonth(2017, 4));

			// WED = 3
			month = buildMonth(
				calendar,
				new NgbMonth(2017, 5),
				{
					firstDayOfWeek: 3,
					weekdaysVisible: true,
					weekdayWidth: TranslationWidth.Short,
				} as DatepickerViewModel,
				i18n,
			);
			expect(month.weekdays).toEqual(['We', 'Th', 'Fr', 'Sa', 'Su', 'Mo', 'Tu']);
			expect(month.weeks[0].days[0].date).toEqual(new NgbMonth(2017, 4));
		});
	});

	describe(`buildMonths()`, () => {
		it(`should generate 'displayMonths' number of months`, () => {
			let state = { displayMonths: 1, firstDayOfWeek: 1, months: [] as MonthViewModel[] } as DatepickerViewModel;
			let months = buildMonths(calendar, new NgbMonth(2017, 5), state, i18n, false);
			expect(months.length).toBe(1);

			state.displayMonths = 2;
			months = buildMonths(calendar, new NgbMonth(2017, 5), state, i18n, false);
			expect(months.length).toBe(2);
		});

		const storeMonthsDataStructure = (months: MonthViewModel[]) => {
			return months.map((month) => {
				const storage = { weeks: month.weeks, weekdays: month.weekdays };
				const weeks = month.weeks;
				for (let weekIndex = 0, weeksLength = weeks.length; weekIndex < weeksLength; weekIndex++) {
					const currentWeek = weeks[weekIndex];
					storage[`weeks[${weekIndex}]`] = currentWeek;
					const days = currentWeek.days;
					storage[`weeks[${weekIndex}].days`] = days;
					for (let dayIndex = 0, daysLength = days.length; dayIndex < daysLength; dayIndex++) {
						const currentDay = days[dayIndex];
						storage[`weeks[${weekIndex}].days[${dayIndex}]`] = currentDay;
					}
				}
				return storage;
			});
		};

		const customMatchers: jasmine.CustomMatcherFactories = {
			toHaveTheSameMonthDataStructureAs: function (util) {
				return {
					compare(actualMonthsStorage, expectedMonthsStorage) {
						try {
							const monthsNumber = actualMonthsStorage.length;
							if (expectedMonthsStorage.length !== monthsNumber) {
								throw 'the number of months';
							}
							for (let i = 0; i < monthsNumber; i++) {
								const storage1 = actualMonthsStorage[i];
								const storage2 = expectedMonthsStorage[i];
								const keys1 = Object.keys(storage1);
								const keys2 = Object.keys(storage2);
								if (!util.equals(keys2, keys1)) {
									throw `the set of keys in months[${i}]: ${keys1} != ${keys2}`;
								}
								for (const key of keys1) {
									if (storage1[key] !== storage2[key]) {
										throw `months[${i}].${key}`;
									}
								}
							}
							return {
								pass: true,
								message: 'Expected different months data structures, but the same data structure was found.',
							};
						} catch (e) {
							return {
								pass: false,
								message:
									typeof e === 'string'
										? `Expected the same months data structure, but a difference was found in ${e}`
										: `${e}`,
							};
						}
					},
				};
			},
		};

		beforeEach(function () {
			jasmine.addMatchers(customMatchers);
		});

		it(`should reuse the same data structure (force = false)`, () => {
			let state = { displayMonths: 1, firstDayOfWeek: 1, months: [] as MonthViewModel[] } as DatepickerViewModel;
			let months = buildMonths(calendar, new NgbMonth(2017, 5), state, i18n, false);
			expect(months).toBe(state.months);
			expect(months.length).toBe(1);
			let monthsStructure = storeMonthsDataStructure(months)!;

			months = buildMonths(calendar, new NgbMonth(2018, 5), state, i18n, false);
			expect(months).toBe(state.months);
			expect(months.length).toBe(1);
			expect(storeMonthsDataStructure(months))['toHaveTheSameMonthDataStructureAs'](monthsStructure);

			state.displayMonths = 2;
			months = buildMonths(calendar, new NgbMonth(2018, 5), state, i18n, false);
			expect(months).toBe(state.months);
			expect(months.length).toBe(2);
			monthsStructure.push(...storeMonthsDataStructure([months[1]]));
			expect(storeMonthsDataStructure(months))['toHaveTheSameMonthDataStructureAs'](monthsStructure);

			// next month
			months = buildMonths(calendar, new NgbMonth(2018, 6), state, i18n, false);
			expect(months).toBe(state.months);
			expect(months.length).toBe(2);
			// the structures should be swapped:
			monthsStructure.push(monthsStructure.shift()!);
			expect(storeMonthsDataStructure(months))['toHaveTheSameMonthDataStructureAs'](monthsStructure);

			// previous month
			months = buildMonths(calendar, new NgbMonth(2018, 5), state, i18n, false);
			expect(months).toBe(state.months);
			expect(months.length).toBe(2);
			// the structures should be swapped (again):
			monthsStructure.push(monthsStructure.shift()!);
			expect(storeMonthsDataStructure(months))['toHaveTheSameMonthDataStructureAs'](monthsStructure);

			state.displayMonths = 5;
			months = buildMonths(calendar, new NgbMonth(2018, 5), state, i18n, false);
			expect(months).toBe(state.months);
			expect(months.length).toBe(5);
			monthsStructure.push(...storeMonthsDataStructure(months.slice(2)));
			expect(storeMonthsDataStructure(months))['toHaveTheSameMonthDataStructureAs'](monthsStructure);

			// go to two months after, the 3 last months are reused as is
			months = buildMonths(calendar, new NgbMonth(2018, 7), state, i18n, false);
			expect(months).toBe(state.months);
			expect(months.length).toBe(5);
			monthsStructure.unshift(...monthsStructure.splice(2, 3));
			expect(storeMonthsDataStructure(months))['toHaveTheSameMonthDataStructureAs'](monthsStructure);

			// go to two months before, the 3 first months are reused as is
			months = buildMonths(calendar, new NgbMonth(2018, 5), state, i18n, false);
			expect(months).toBe(state.months);
			expect(months.length).toBe(5);
			monthsStructure.push(...monthsStructure.splice(0, 3));
			expect(storeMonthsDataStructure(months))['toHaveTheSameMonthDataStructureAs'](monthsStructure);

			// completely change the dates, nothing is shifted in monthsStructure
			months = buildMonths(calendar, new NgbMonth(2018), state, i18n, false);
			expect(months).toBe(state.months);
			expect(months.length).toBe(5);
			expect(storeMonthsDataStructure(months))['toHaveTheSameMonthDataStructureAs'](monthsStructure);

			// keep 2 months
			state.displayMonths = 2;
			months = buildMonths(calendar, new NgbMonth(2018, 11), state, i18n, false);
			expect(months).toBe(state.months);
			expect(months.length).toBe(2);
			monthsStructure = monthsStructure.slice(1, 3);
			expect(storeMonthsDataStructure(months))['toHaveTheSameMonthDataStructureAs'](monthsStructure);
		});

		it(`should reuse the same data structure (force = true)`, () => {
			let state = { displayMonths: 1, firstDayOfWeek: 1, months: [] as MonthViewModel[] } as DatepickerViewModel;
			let months = buildMonths(calendar, new NgbMonth(2017, 5), state, i18n, true);
			expect(months).toBe(state.months);
			expect(months.length).toBe(1);
			let monthsStructure = storeMonthsDataStructure(months);

			months = buildMonths(calendar, new NgbMonth(2018, 5), state, i18n, true);
			expect(months).toBe(state.months);
			expect(months.length).toBe(1);
			expect(storeMonthsDataStructure(months))['toHaveTheSameMonthDataStructureAs'](monthsStructure);

			state.displayMonths = 2;
			months = buildMonths(calendar, new NgbMonth(2018, 5), state, i18n, true);
			expect(months).toBe(state.months);
			expect(months.length).toBe(2);
			monthsStructure.push(...storeMonthsDataStructure([months[1]]));
			expect(storeMonthsDataStructure(months))['toHaveTheSameMonthDataStructureAs'](monthsStructure);

			// next month
			months = buildMonths(calendar, new NgbMonth(2018, 6), state, i18n, true);
			expect(months).toBe(state.months);
			expect(months.length).toBe(2);
			expect(storeMonthsDataStructure(months))['toHaveTheSameMonthDataStructureAs'](monthsStructure);

			// previous month
			months = buildMonths(calendar, new NgbMonth(2018, 5), state, i18n, true);
			expect(months).toBe(state.months);
			expect(months.length).toBe(2);
			expect(storeMonthsDataStructure(months))['toHaveTheSameMonthDataStructureAs'](monthsStructure);

			state.displayMonths = 5;
			months = buildMonths(calendar, new NgbMonth(2018, 5), state, i18n, true);
			expect(months).toBe(state.months);
			expect(months.length).toBe(5);
			monthsStructure.push(...storeMonthsDataStructure(months.slice(2)));
			expect(storeMonthsDataStructure(months))['toHaveTheSameMonthDataStructureAs'](monthsStructure);

			// go to two months after
			months = buildMonths(calendar, new NgbMonth(2018, 7), state, i18n, true);
			expect(months).toBe(state.months);
			expect(months.length).toBe(5);
			expect(storeMonthsDataStructure(months))['toHaveTheSameMonthDataStructureAs'](monthsStructure);

			// go to two months before
			months = buildMonths(calendar, new NgbMonth(2018, 5), state, i18n, true);
			expect(months).toBe(state.months);
			expect(months.length).toBe(5);
			expect(storeMonthsDataStructure(months))['toHaveTheSameMonthDataStructureAs'](monthsStructure);

			// completely change the dates
			months = buildMonths(calendar, new NgbMonth(2018), state, i18n, true);
			expect(months).toBe(state.months);
			expect(months.length).toBe(5);
			expect(storeMonthsDataStructure(months))['toHaveTheSameMonthDataStructureAs'](monthsStructure);

			// keep 2 months
			state.displayMonths = 2;
			months = buildMonths(calendar, new NgbMonth(2018, 11, 5), state, i18n, true);
			expect(months).toBe(state.months);
			expect(months.length).toBe(2);
			monthsStructure = monthsStructure.slice(0, 2);
			expect(storeMonthsDataStructure(months))['toHaveTheSameMonthDataStructureAs'](monthsStructure);
		});
	});

	describe(`getFirstViewDate()`, () => {
		const months = [
			// Mon
			{ start: 1, date: new NgbMonth(2017, 1), first: new NgbMonth(2016, 12) },
			{ start: 1, date: new NgbMonth(2017, 2), first: new NgbMonth(2017, 1) },
			{ start: 1, date: new NgbMonth(2017, 3), first: new NgbMonth(2017, 2) },
			{ start: 1, date: new NgbMonth(2017, 4), first: new NgbMonth(2017, 3) },
			{ start: 1, date: new NgbMonth(2017, 5), first: new NgbMonth(2017, 5) },
			{ start: 1, date: new NgbMonth(2017, 6), first: new NgbMonth(2017, 5) },
			{ start: 1, date: new NgbMonth(2017, 7), first: new NgbMonth(2017, 6) },
			{ start: 1, date: new NgbMonth(2017, 8), first: new NgbMonth(2017, 7) },
			{ start: 1, date: new NgbMonth(2017, 9), first: new NgbMonth(2017, 8) },
			{ start: 1, date: new NgbMonth(2017, 10), first: new NgbMonth(2017, 9) },
			{ start: 1, date: new NgbMonth(2017, 11), first: new NgbMonth(2017, 10) },
			{ start: 1, date: new NgbMonth(2017, 12), first: new NgbMonth(2017, 11) },
			// Sun
			{ start: 7, date: new NgbMonth(2017, 1), first: new NgbMonth(2017, 1) },
			{ start: 7, date: new NgbMonth(2017, 2), first: new NgbMonth(2017, 1) },
			{ start: 7, date: new NgbMonth(2017, 3), first: new NgbMonth(2017, 2) },
			{ start: 7, date: new NgbMonth(2017, 4), first: new NgbMonth(2017, 3) },
			{ start: 7, date: new NgbMonth(2017, 5), first: new NgbMonth(2017, 4) },
			{ start: 7, date: new NgbMonth(2017, 6), first: new NgbMonth(2017, 5) },
			{ start: 7, date: new NgbMonth(2017, 7), first: new NgbMonth(2017, 6) },
			{ start: 7, date: new NgbMonth(2017, 8), first: new NgbMonth(2017, 7) },
			{ start: 7, date: new NgbMonth(2017, 9), first: new NgbMonth(2017, 8) },
			{ start: 7, date: new NgbMonth(2017, 10), first: new NgbMonth(2017, 10) },
			{ start: 7, date: new NgbMonth(2017, 11), first: new NgbMonth(2017, 10) },
			{ start: 7, date: new NgbMonth(2017, 12), first: new NgbMonth(2017, 11) },
			// Wed
			{ start: 3, date: new NgbMonth(2017, 1), first: new NgbMonth(2016, 12) },
			{ start: 3, date: new NgbMonth(2017, 2), first: new NgbMonth(2017, 2) },
			{ start: 3, date: new NgbMonth(2017, 3), first: new NgbMonth(2017, 3) },
			{ start: 3, date: new NgbMonth(2017, 4), first: new NgbMonth(2017, 3) },
			{ start: 3, date: new NgbMonth(2017, 5), first: new NgbMonth(2017, 4) },
			{ start: 3, date: new NgbMonth(2017, 6), first: new NgbMonth(2017, 5) },
			{ start: 3, date: new NgbMonth(2017, 7), first: new NgbMonth(2017, 6) },
			{ start: 3, date: new NgbMonth(2017, 8), first: new NgbMonth(2017, 7) },
			{ start: 3, date: new NgbMonth(2017, 9), first: new NgbMonth(2017, 8) },
			{ start: 3, date: new NgbMonth(2017, 10), first: new NgbMonth(2017, 9) },
			{ start: 3, date: new NgbMonth(2017, 11), first: new NgbMonth(2017, 11) },
			{ start: 3, date: new NgbMonth(2017, 12), first: new NgbMonth(2017, 11) },
		];

		months.forEach((month) => {
			it(`should return the correct first view date`, () => {
				expect(getFirstViewDate(calendar, month.date, month.start)).toEqual(month.first);
			});
		});
	});

	/*describe(`isDateSelectable()`, () => {
		// disabling 15th of any month
		const markDisabled: NgbMarkDisabled = (date, month) => date.day === 15;

		it(`should return false if date is invalid`, () => {
			let state = { disabled: false } as DatepickerViewModel;
			expect(isDateSelectable(null, state)).toBeFalsy();
			expect(isDateSelectable(undefined, state)).toBeFalsy();
		});

		it(`should return false if datepicker is disabled`, () => {
			let state = { disabled: true } as DatepickerViewModel;
			expect(isDateSelectable(new NgbMonth(2016, 11), state)).toBeFalsy();
			expect(isDateSelectable(new NgbMonth(2017, 11), state)).toBeFalsy();
			expect(isDateSelectable(new NgbMonth(2018, 11), state)).toBeFalsy();
		});

		it(`should take into account markDisabled values`, () => {
			let state = { disabled: false, markDisabled } as DatepickerViewModel;
			expect(isDateSelectable(new NgbMonth(2016, 11, 15), state)).toBeFalsy();
			expect(isDateSelectable(new NgbMonth(2017, 11, 15), state)).toBeFalsy();
			expect(isDateSelectable(new NgbMonth(2018, 11, 15), state)).toBeFalsy();
		});

		it(`should take into account minDate values`, () => {
			let state = { disabled: false, minDate: new NgbMonth(2018, 11, 10) } as DatepickerViewModel;
			expect(isDateSelectable(new NgbMonth(2017, 11), state)).toBeFalsy();
		});

		it(`should take into account maxDate values`, () => {
			let state = { disabled: false, maxDate: new NgbMonth(2016, 11, 10) } as DatepickerViewModel;
			expect(isDateSelectable(new NgbMonth(2017, 11), state)).toBeFalsy();
		});

		it(`should return true for normal values`, () => {
			let state = { disabled: false } as DatepickerViewModel;
			expect(isDateSelectable(new NgbMonth(2016, 11), state)).toBeTruthy();
			expect(isDateSelectable(new NgbMonth(2017, 11), state)).toBeTruthy();
			expect(isDateSelectable(new NgbMonth(2018, 11), state)).toBeTruthy();
		});
	});*/

	describe(`generateSelectBoxMonths`, () => {
		const test = (minDate, date, maxDate, result) => {
			expect(generateSelectBoxMonths(calendar, date, minDate, maxDate)).toEqual(result);
		};

		it(`should handle edge cases`, () => {
			test(new NgbMonth(2018, 6), null, new NgbMonth(2018, 6), []);
			test(null, null, null, []);
		});

		it(`should generate months correctly`, () => {
			// different years
			test(
				new NgbMonth(2017, 1),
				new NgbMonth(2018, 1),
				new NgbMonth(2019, 1),
				[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
			);
			test(null, new NgbMonth(2018, 6), null, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
			test(null, new NgbMonth(2018, 1), new NgbMonth(2019, 1), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
			test(new NgbMonth(2017, 1), new NgbMonth(2018, 1), null, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);

			// same 'min year'
			test(
				new NgbMonth(2018, 1),
				new NgbMonth(2018, 6),
				new NgbMonth(2020, 1),
				[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
			);
			test(new NgbMonth(2018, 6), new NgbMonth(2018, 6), new NgbMonth(2020, 1), [6, 7, 8, 9, 10, 11, 12]);
			test(new NgbMonth(2018, 6), new NgbMonth(2018, 6), null, [6, 7, 8, 9, 10, 11, 12]);

			// same 'max' year
			test(
				new NgbMonth(2017, 1),
				new NgbMonth(2018, 6),
				new NgbMonth(2018, 12),
				[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
			);
			test(new NgbMonth(2017, 1), new NgbMonth(2018, 6), new NgbMonth(2018, 6), [1, 2, 3, 4, 5, 6]);
			test(null, new NgbMonth(2018, 6), new NgbMonth(2018, 6), [1, 2, 3, 4, 5, 6]);

			// same 'min' and 'max years'
			test(
				new NgbMonth(2018, 1),
				new NgbMonth(2018, 6),
				new NgbMonth(2018, 12),
				[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
			);
			test(new NgbMonth(2018, 3), new NgbMonth(2018, 6), new NgbMonth(2018, 12), [3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
			test(new NgbMonth(2018, 3), new NgbMonth(2018, 6), null, [3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
			test(null, new NgbMonth(2018, 6), new NgbMonth(2018, 8), [1, 2, 3, 4, 5, 6, 7, 8]);
			test(new NgbMonth(2018, 3), new NgbMonth(2018, 6), new NgbMonth(2018, 8), [3, 4, 5, 6, 7, 8]);
			test(new NgbMonth(2018, 6), new NgbMonth(2018, 6), new NgbMonth(2018, 6), [6]);
		});
	});

	describe(`generateSelectBoxYears`, () => {
		const test = (minDate, date, maxDate, result) => {
			expect(generateSelectBoxYears(date, minDate, maxDate)).toEqual(result);
		};
		const range = (start, end) => Array.from({ length: end - start + 1 }, (e, i) => start + i);

		it(`should handle edge cases`, () => {
			test(new NgbMonth(2018, 6), null, new NgbMonth(2018, 6), []);
			test(null, null, null, []);
		});

		it(`should generate years correctly`, () => {
			// both 'min' and 'max' are set
			test(new NgbMonth(2017, 1), new NgbMonth(2018, 1), new NgbMonth(2019, 1), range(2017, 2019));
			test(new NgbMonth(1000, 1), new NgbMonth(2018, 1), new NgbMonth(3000, 1), range(1518, 2518));
			test(new NgbMonth(2018, 1), new NgbMonth(2018, 1), new NgbMonth(2018, 1), [2018]);

			// 'min' is not set
			test(null, new NgbMonth(2018, 1), new NgbMonth(2019, 1), range(2008, 2019));
			test(null, new NgbMonth(2018, 1), new NgbMonth(3000, 1), range(2008, 2518));
			test(null, new NgbMonth(2018, 1), new NgbMonth(2018, 1), range(2008, 2018));

			// 'max' is not set
			test(new NgbMonth(2017, 1), new NgbMonth(2018, 1), null, range(2017, 2028));
			test(new NgbMonth(1000, 1), new NgbMonth(2018, 1), null, range(1518, 2028));
			test(new NgbMonth(2018, 1), new NgbMonth(2018, 1), null, range(2018, 2028));

			// both are not set
			test(null, new NgbMonth(2018, 1), null, range(2008, 2028));
			test(null, new NgbMonth(2000, 1), null, range(1990, 2010));
		});
	});

	describe(`isChangedMonth()`, () => {
		it(`should compare valid dates`, () => {
			expect(isChangedMonth(new NgbMonth(2017, 1), new NgbMonth(2017, 1))).toBe(false);
			expect(isChangedMonth(new NgbMonth(2017, 1), new NgbMonth(2017, 1))).toBe(false);
			expect(isChangedMonth(new NgbMonth(2017, 1), new NgbMonth(2017, 2))).toBe(true);
			expect(isChangedMonth(new NgbMonth(2017, 1), new NgbMonth(2018, 1))).toBe(true);
			expect(isChangedMonth(new NgbMonth(2017, 1), new NgbMonth(2018, 2))).toBe(true);
		});

		it(`should compare invalid dates`, () => {
			expect(isChangedMonth(undefined, undefined)).toBe(false);
			expect(isChangedMonth(null, null)).toBe(false);

			expect(isChangedMonth(new NgbMonth(2017, 5), null)).toBe(true);
			expect(isChangedMonth(new NgbMonth(2017, 5), undefined)).toBe(true);
			expect(isChangedMonth(null, new NgbMonth(2017, 5))).toBe(true);
			expect(isChangedMonth(undefined, new NgbMonth(2017, 5))).toBe(true);
		});
	});
});
