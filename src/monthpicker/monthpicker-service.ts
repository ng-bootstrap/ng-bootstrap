import { NgbMonthCalendar } from './ngb-month-calendar';
import { NgbMonth } from './ngb-month';
import { NgbMonthStruct } from './ngb-month-struct';
import { MonthpickerViewModel, NgbDayTemplateData, NgbMarkDisabled } from './monthpicker-view-model';
import { inject, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {
	buildMonths,
	checkDateInRange,
	checkMinBeforeMax,
	generateSelectBoxYears,
	isChangedDate,
	isChangedMonth,
	isDateSelectable,
	nextMonthDisabled,
	prevMonthDisabled,
} from './monthpicker-tools';

import { filter } from 'rxjs/operators';
import { NgbMonthpickerI18n } from './monthpicker-i18n';

export type MonthpickerServiceInputs = Partial<{
	dayTemplateData: NgbDayTemplateData;
	disabled: boolean;
	focusVisible: boolean;
	markDisabled: NgbMarkDisabled;
	maxDate: NgbMonth | null;
	minDate: NgbMonth | null;
	navigation: 'select' | 'arrows' | 'none';
}>;

@Injectable()
export class NgbMonthpickerService {
	private _VALIDATORS: {
		[K in keyof MonthpickerServiceInputs]: (v: MonthpickerServiceInputs[K]) => Partial<MonthpickerViewModel> | void;
	} = {
		dayTemplateData: (dayTemplateData: NgbDayTemplateData) => {
			if (this._state.dayTemplateData !== dayTemplateData) {
				return { dayTemplateData };
			}
		},
		disabled: (disabled: boolean) => {
			if (this._state.disabled !== disabled) {
				return { disabled };
			}
		},
		focusVisible: (focusVisible: boolean) => {
			if (this._state.focusVisible !== focusVisible && !this._state.disabled) {
				return { focusVisible };
			}
		},
		markDisabled: (markDisabled: NgbMarkDisabled) => {
			if (this._state.markDisabled !== markDisabled) {
				return { markDisabled };
			}
		},
		maxDate: (date: NgbMonth | null) => {
			const maxDate = this.toValidDate(date, null);
			if (isChangedDate(this._state.maxDate, maxDate)) {
				return { maxDate };
			}
		},
		minDate: (date: NgbMonth | null) => {
			const minDate = this.toValidDate(date, null);
			if (isChangedDate(this._state.minDate, minDate)) {
				return { minDate };
			}
		},
		navigation: (navigation: 'select' | 'arrows' | 'none') => {
			if (this._state.navigation !== navigation) {
				return { navigation };
			}
		},
	};

	private _calendar = inject(NgbMonthCalendar);
	private _i18n = inject(NgbMonthpickerI18n);

	private _model$ = new Subject<MonthpickerViewModel>();

	private _dateSelect$ = new Subject<NgbMonth>();

	private _state: MonthpickerViewModel = {
		dayTemplateData: null,
		markDisabled: null,
		maxDate: null,
		minDate: null,
		disabled: false,
		firstDate: null,
		lastDate: null,
		focusDate: null,
		focusVisible: false,
		months: [],
		navigation: 'select',
		prevDisabled: false,
		nextDisabled: false,
		selectedDate: null,
		selectBoxes: { years: [] },
	};

	get model$(): Observable<MonthpickerViewModel> {
		return this._model$.pipe(filter((model) => model.months.length > 0));
	}

	get dateSelect$(): Observable<NgbMonth> {
		return this._dateSelect$.pipe(filter((date) => date !== null));
	}

	set(options: MonthpickerServiceInputs) {
		let patch = Object.keys(options)
			.map((key) => this._VALIDATORS[key](options[key]))
			.reduce((obj, part) => ({ ...obj, ...part }), {});

		if (Object.keys(patch).length > 0) {
			this._nextState(patch);
		}
	}

	focus(date?: NgbMonth | null) {
		const focusedDate = this.toValidDate(date, null);
		if (focusedDate != null && !this._state.disabled && isChangedDate(this._state.focusDate, focusedDate)) {
			this._nextState({ focusDate: date });
		}
	}

	focusSelect() {
		if (isDateSelectable(this._state.focusDate, this._state)) {
			this.select(this._state.focusDate, { emitEvent: true });
		}
	}

	open(date?: NgbMonth | null) {
		const firstDate = this.toValidDate(date, this._calendar.getToday());
		if (
			firstDate != null &&
			!this._state.disabled &&
			(!this._state.firstDate || isChangedMonth(this._state.firstDate, firstDate))
		) {
			this._nextState({ firstDate });
		}
	}

	select(date?: NgbMonth | null, options: { emitEvent?: boolean } = {}) {
		const selectedDate = this.toValidDate(date, null);
		if (selectedDate != null && !this._state.disabled) {
			if (isChangedDate(this._state.selectedDate, selectedDate)) {
				this._nextState({ selectedDate });
			}

			if (options.emitEvent && isDateSelectable(selectedDate, this._state)) {
				this._dateSelect$.next(selectedDate);
			}
		}
	}

	toValidDate(date?: NgbMonthStruct | null, defaultValue?: NgbMonth | null): NgbMonth | null {
		const ngbMonth = NgbMonth.from(date);
		if (defaultValue === undefined) {
			defaultValue = this._calendar.getToday();
		}
		return this._calendar.isValid(ngbMonth) ? ngbMonth : defaultValue;
	}

	getMonth(struct: NgbMonthStruct) {
		for (let month of this._state.months) {
			if (struct.month === month.number && struct.year === month.year) {
				return month;
			}
		}
		throw new Error(`month ${struct.month} of year ${struct.year} not found`);
	}

	private _nextState(patch: Partial<MonthpickerViewModel>) {
		const newState = this._updateState(patch);
		this._patchContexts(newState);
		this._state = newState;
		this._model$.next(this._state);
	}

	private _patchContexts(state: MonthpickerViewModel) {
		const { months, selectedDate, focusDate, focusVisible, disabled } = state;
		state.months.forEach((month) => {
			month.weeks.forEach((week) => {
				week.days.forEach((day) => {
					// patch focus flag
					if (focusDate) {
						day.context.focused = focusDate.equals(day.date) && focusVisible;
					}

					// calculating tabindex
					day.tabindex =
						!disabled && focusDate && day.date.equals(focusDate) && focusDate.month === month.number ? 0 : -1;

					// override context disabled
					if (disabled === true) {
						day.context.disabled = true;
					}

					// patch selection flag
					if (selectedDate !== undefined) {
						day.context.selected = selectedDate !== null && selectedDate.equals(day.date);
					}

					// visibility
					if (month.number !== day.date.month) {
						day.hidden = day.date.after(months[0].firstDate) && day.date.before(months[0].lastDate);
					}
				});
			});
		});
	}

	private _updateState(patch: Partial<MonthpickerViewModel>): MonthpickerViewModel {
		// patching fields
		const state = Object.assign({}, this._state, patch);

		let startDate = state.firstDate;

		// min/max dates changed
		if ('minDate' in patch || 'maxDate' in patch) {
			checkMinBeforeMax(state.minDate, state.maxDate);
			state.focusDate = checkDateInRange(state.focusDate, state.minDate, state.maxDate);
			state.firstDate = checkDateInRange(state.firstDate, state.minDate, state.maxDate);
			startDate = state.focusDate;
		}

		// disabled
		if ('disabled' in patch) {
			state.focusVisible = false;
		}

		// initial rebuild via 'select()'
		if ('selectedDate' in patch && this._state.months.length === 0) {
			startDate = state.selectedDate;
		}

		// terminate early if only focus visibility was changed
		if ('focusVisible' in patch) {
			return state;
		}

		// focus date changed
		if ('focusDate' in patch) {
			state.focusDate = checkDateInRange(state.focusDate, state.minDate, state.maxDate);
			startDate = state.focusDate;

			// nothing to rebuild if only focus changed and it is still visible
			if (
				state.months.length !== 0 &&
				state.focusDate &&
				!state.focusDate.before(state.firstDate) &&
				!state.focusDate.after(state.lastDate)
			) {
				return state;
			}
		}

		// first date changed
		if ('firstDate' in patch) {
			state.firstDate = checkDateInRange(state.firstDate, state.minDate, state.maxDate);
			startDate = state.firstDate;
		}

		// rebuilding months
		if (startDate) {
			const forceRebuild =
				'dayTemplateData' in patch ||
				'markDisabled' in patch ||
				'minDate' in patch ||
				'maxDate' in patch ||
				'disabled' in patch;

			const months = buildMonths(this._calendar, startDate, state, this._i18n, forceRebuild);

			// updating months and boundary dates
			state.months = months;
			state.firstDate = months[0].firstDate;
			state.lastDate = months[months.length - 1].lastDate;

			// reset selected date if 'markDisabled' returns true
			if ('selectedDate' in patch && !isDateSelectable(state.selectedDate, state)) {
				state.selectedDate = null;
			}

			// adjusting focus after months were built
			if ('firstDate' in patch) {
				if (!state.focusDate || state.focusDate.before(state.firstDate) || state.focusDate.after(state.lastDate)) {
					state.focusDate = startDate;
				}
			}

			// adjusting months/years for the select box navigation
			const yearChanged = !this._state.firstDate || this._state.firstDate.year !== state.firstDate.year;
			const monthChanged = !this._state.firstDate || this._state.firstDate.month !== state.firstDate.month;
			if (state.navigation === 'select') {
				// years ->  boundaries (min/max were changed)
				if ('minDate' in patch || 'maxDate' in patch || state.selectBoxes.years.length === 0 || yearChanged) {
					state.selectBoxes.years = generateSelectBoxYears(state.firstDate, state.minDate, state.maxDate);
				}
			} else {
				state.selectBoxes = { years: [] };
			}

			// updating navigation arrows -> boundaries change (min/max) or month/year changes
			if (
				(state.navigation === 'arrows' || state.navigation === 'select') &&
				(monthChanged || yearChanged || 'minDate' in patch || 'maxDate' in patch || 'disabled' in patch)
			) {
				state.prevDisabled = state.disabled || prevMonthDisabled(this._calendar, state.firstDate, state.minDate);
				state.nextDisabled = state.disabled || nextMonthDisabled(this._calendar, state.lastDate, state.maxDate);
			}
		}

		return state;
	}
}
