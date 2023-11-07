import { NgbMonth } from './ngb-month';
import { MonthpickerViewModel, YearMonthViewModel, YearViewModel } from './monthpicker-view-model';
import { NgbMonthCalendar } from './ngb-month-calendar';
import { NgbMonthpickerI18n } from './monthpicker-i18n';

export function isChangedDate(prev?: NgbMonth | null, next?: NgbMonth | null): boolean {
	return !dateComparator(prev, next);
}

export function isChangedMonth(prev?: NgbMonth | null, next?: NgbMonth | null): boolean {
	return !prev && !next ? false : !prev || !next ? true : prev.year !== next.year || prev.month !== next.month;
}

export function dateComparator(prev?: NgbMonth | null, next?: NgbMonth | null): boolean {
	return (!prev && !next) || (!!prev && !!next && prev.equals(next));
}

export function checkMinBeforeMax(minDate?: NgbMonth | null, maxDate?: NgbMonth | null): void {
	if (maxDate && minDate && maxDate.before(minDate)) {
		throw new Error(`'maxDate' ${maxDate} should be greater than 'minDate' ${minDate}`);
	}
}

export function checkDateInRange(
	date?: NgbMonth | null,
	minDate?: NgbMonth | null,
	maxDate?: NgbMonth | null,
): NgbMonth | null {
	if (date && minDate && date.before(minDate)) {
		return minDate;
	}
	if (date && maxDate && date.after(maxDate)) {
		return maxDate;
	}

	return date || null;
}

export function isDateSelectable(date: NgbMonth | null | undefined, state: MonthpickerViewModel) {
	const { minDate, maxDate, disabled, markDisabled } = state;
	return !(
		date === null ||
		date === undefined ||
		disabled ||
		(markDisabled && markDisabled(date, { year: date.year, month: date.month })) ||
		(minDate && date.before(minDate)) ||
		(maxDate && date.after(maxDate))
	);
}

export function generateSelectBoxMonths(
	calendar: NgbMonthCalendar,
	date: NgbMonth,
	minDate: NgbMonth | null,
	maxDate: NgbMonth | null,
) {
	if (!date) {
		return [];
	}

	let months = calendar.getMonths(date.year);

	if (minDate && date.year === minDate.year) {
		const index = months.findIndex((month) => month === minDate.month);
		months = months.slice(index);
	}

	if (maxDate && date.year === maxDate.year) {
		const index = months.findIndex((month) => month === maxDate.month);
		months = months.slice(0, index + 1);
	}

	return months;
}

export function generateSelectBoxYears(date: NgbMonth, minDate: NgbMonth | null, maxDate: NgbMonth | null) {
	if (!date) {
		return [];
	}

	const start = minDate ? Math.max(minDate.year, date.year - 500) : date.year - 10;
	const end = maxDate ? Math.min(maxDate.year, date.year + 500) : date.year + 10;

	const length = end - start + 1;
	const numbers = Array(length);
	for (let i = 0; i < length; i++) {
		numbers[i] = start + i;
	}

	return numbers;
}

export function nextMonthDisabled(calendar: NgbMonthCalendar, date: NgbMonth, maxDate: NgbMonth | null) {
	const nextDate = calendar.getNext(date, 'm');
	return maxDate != null && nextDate.after(maxDate);
}

export function prevMonthDisabled(calendar: NgbMonthCalendar, date: NgbMonth, minDate: NgbMonth | null) {
	const prevDate = Object.assign(calendar.getPrev(date, 'm'), { day: 1 });
	return (
		minDate != null &&
		((prevDate.year === minDate.year && prevDate.month < minDate.month) ||
			(prevDate.year < minDate.year && minDate.month === 1))
	);
}

export function buildYears(
	calendar: NgbMonthCalendar,
	date: NgbMonth,
	state: MonthpickerViewModel,
	i18n: NgbMonthpickerI18n,
	force: boolean,
): YearViewModel[] {
	const { years } = state;
	// move old years to a temporary array
	const yearsToReuse = years.splice(0, years.length);

	// generate new first dates, nullify or reuse years
	const firstDates = Array.from({ length: 1 }, (_, i) => {
		const firstDate = Object.assign(calendar.getNext(date, 'm', i));
		years[i] = <any>null;

		if (!force) {
			const reusedIndex = yearsToReuse.findIndex((month) => month.firstDate.equals(firstDate));
			// move reused year back to years
			if (reusedIndex !== -1) {
				years[i] = yearsToReuse.splice(reusedIndex, 1)[0];
			}
		}

		return firstDate;
	});

	// rebuild nullified years
	firstDates.forEach((firstDate, i) => {
		if (years[i] === null) {
			years[i] = buildYear(calendar, firstDate, state, i18n, yearsToReuse.shift() || ({} as YearViewModel));
		}
	});

	return years;
}

export function buildYear(
	calendar: NgbMonthCalendar,
	date: NgbMonth,
	state: MonthpickerViewModel,
	i18n: NgbMonthpickerI18n,
	year: YearViewModel = {} as YearViewModel,
): YearViewModel {
	const { monthTemplateData, minDate, maxDate, markDisabled } = state;
	const calendarToday = calendar.getToday();

	year.firstDate = new NgbMonth(date.year, 1);
	year.lastDate = new NgbMonth(date.year, calendar.getMonths().length);
	year.year = date.year;
	year.months = year.months || [];

	for (let month = 1; month <= calendar.getMonths().length; month++) {
		const newMonth = new NgbMonth(date.year, month);
		const nextMonth = calendar.getNext(newMonth);

		const ariaLabel = ''; // TODO: i18n.getMonthAriaLabel(newMonth);

		// marking date as disabled
		let disabled = !!((minDate && newMonth.before(minDate)) || (maxDate && newMonth.after(maxDate)));
		if (!disabled && markDisabled) {
			disabled = markDisabled(newMonth, { month: month, year: year.year });
		}

		// today
		let today = newMonth.equals(calendarToday);

		// adding user-provided data to the context
		let contextUserData = monthTemplateData
			? monthTemplateData(newMonth, { month: month, year: year.year })
			: undefined;

		// saving first date of the month
		/*if (year.firstDate === null && newMonth.month === year.number) {
			year.firstDate = newMonth;
		}

		// saving last date of the month
		if (newMonth.month === year.number && nextMonth.month !== month) {
			year.lastDate = newMonth;
		}*/

		let monthObject = year.months[month - 1];
		if (!monthObject) {
			monthObject = year.months[month - 1] = {} as YearMonthViewModel;
		}
		monthObject.date = newMonth;
		monthObject.context = Object.assign(monthObject.context || {}, {
			$implicit: newMonth,
			date: newMonth,
			data: contextUserData,
			currentMonth: month,
			currentYear: year.year,
			disabled,
			focused: false,
			selected: false,
			today,
		});
		monthObject.tabindex = -1;
		monthObject.ariaLabel = ariaLabel;

		date = nextMonth;
	}

	return year;
}

export function getFirstViewDate(calendar: NgbMonthCalendar, date: NgbMonth): NgbMonth {
	const daysPerWeek = calendar.getDaysPerWeek();
	const firstMonthDate = new NgbMonth(date.year, date.month);
	const dayOfWeek = calendar.getWeekday(firstMonthDate) % daysPerWeek;
	return calendar.getPrev(firstMonthDate, 'm', (daysPerWeek + dayOfWeek) % daysPerWeek);
}
