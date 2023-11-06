import { NgbMonth } from './ngb-month';
import { DayViewModel, MonthpickerViewModel, MonthViewModel } from './monthpicker-view-model';
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

export function buildMonths(
	calendar: NgbMonthCalendar,
	date: NgbMonth,
	state: MonthpickerViewModel,
	i18n: NgbMonthpickerI18n,
	force: boolean,
): MonthViewModel[] {
	const { displayMonths, months } = state;
	// move old months to a temporary array
	const monthsToReuse = months.splice(0, months.length);

	// generate new first dates, nullify or reuse months
	const firstDates = Array.from({ length: displayMonths }, (_, i) => {
		const firstDate = Object.assign(calendar.getNext(date, 'm', i));
		months[i] = <any>null;

		if (!force) {
			const reusedIndex = monthsToReuse.findIndex((month) => month.firstDate.equals(firstDate));
			// move reused month back to months
			if (reusedIndex !== -1) {
				months[i] = monthsToReuse.splice(reusedIndex, 1)[0];
			}
		}

		return firstDate;
	});

	// rebuild nullified months
	firstDates.forEach((firstDate, i) => {
		if (months[i] === null) {
			months[i] = buildMonth(calendar, firstDate, state, i18n, monthsToReuse.shift() || ({} as MonthViewModel));
		}
	});

	return months;
}

export function buildMonth(
	calendar: NgbMonthCalendar,
	date: NgbMonth,
	state: MonthpickerViewModel,
	i18n: NgbMonthpickerI18n,
	month: MonthViewModel = {} as MonthViewModel,
): MonthViewModel {
	const { dayTemplateData, minDate, maxDate, markDisabled } = state;
	const calendarToday = calendar.getToday();

	month.firstDate = <any>null;
	month.lastDate = <any>null;
	month.number = date.month;
	month.year = date.year;
	month.weeks = month.weeks || [];

	date = getFirstViewDate(calendar, date);

	// month has weeks
	for (let week = 0; week < calendar.getWeeksPerMonth(); week++) {
		let weekObject = month.weeks[week];
		if (!weekObject) {
			weekObject = month.weeks[week] = { number: 0, days: [], collapsed: true };
		}
		const days = weekObject.days;

		// week has days
		for (let day = 0; day < calendar.getDaysPerWeek(); day++) {
			const newDate = new NgbMonth(date.year, date.month);
			const nextDate = calendar.getNext(newDate);

			//const ariaLabel = i18n.getDayAriaLabel(newDate);

			// marking date as disabled
			let disabled = !!((minDate && newDate.before(minDate)) || (maxDate && newDate.after(maxDate)));
			if (!disabled && markDisabled) {
				disabled = markDisabled(newDate, { month: month.number, year: month.year });
			}

			// today
			let today = newDate.equals(calendarToday);

			// adding user-provided data to the context
			let contextUserData = dayTemplateData
				? dayTemplateData(newDate, { month: month.number, year: month.year })
				: undefined;

			// saving first date of the month
			if (month.firstDate === null && newDate.month === month.number) {
				month.firstDate = newDate;
			}

			// saving last date of the month
			if (newDate.month === month.number && nextDate.month !== month.number) {
				month.lastDate = newDate;
			}

			let dayObject = days[day];
			if (!dayObject) {
				dayObject = days[day] = {} as DayViewModel;
			}
			dayObject.date = newDate;
			dayObject.context = Object.assign(dayObject.context || {}, {
				$implicit: newDate,
				date: newDate,
				data: contextUserData,
				currentMonth: month.number,
				currentYear: month.year,
				disabled,
				focused: false,
				selected: false,
				today,
			});
			dayObject.tabindex = -1;
			//dayObject.ariaLabel = ariaLabel;
			dayObject.hidden = false;

			date = nextDate;
		}

		weekObject.number = calendar.getWeekNumber(days.map((day) => day.date));

		// marking week as collapsed
		weekObject.collapsed = days[0].date.month !== month.number && days[days.length - 1].date.month !== month.number;
	}

	return month;
}

export function getFirstViewDate(calendar: NgbMonthCalendar, date: NgbMonth): NgbMonth {
	const daysPerWeek = calendar.getDaysPerWeek();
	const firstMonthDate = new NgbMonth(date.year, date.month);
	const dayOfWeek = calendar.getWeekday(firstMonthDate) % daysPerWeek;
	return calendar.getPrev(firstMonthDate, 'm', (daysPerWeek + dayOfWeek) % daysPerWeek);
}
