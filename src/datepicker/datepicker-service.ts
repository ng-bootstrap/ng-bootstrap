import {NgbCalendar} from './ngb-calendar';
import {NgbDate} from './ngb-date';
import {NgbDateStruct} from './ngb-date-struct';
import {DatepickerViewModel, NgbDayTemplateData, NgbMarkDisabled} from './datepicker-view-model';
import {Injectable} from '@angular/core';
import {isInteger, toInteger} from '../util/util';
import {Observable, Subject} from 'rxjs';
import {
  buildMonths,
  checkDateInRange,
  checkMinBeforeMax,
  isChangedDate,
  isChangedMonth,
  isDateSelectable,
  generateSelectBoxYears,
  generateSelectBoxMonths,
  prevMonthDisabled,
  nextMonthDisabled
} from './datepicker-tools';

import {filter} from 'rxjs/operators';
import {NgbDatepickerI18n} from './datepicker-i18n';

export interface DatepickerServiceInputs extends
    Partial<Pick<DatepickerViewModel, 'dayTemplateData' | 'displayMonths' | 'disabled' | 'firstDayOfWeek' |
                     'focusVisible' | 'markDisabled' | 'maxDate' | 'minDate' | 'navigation' | 'outsideDays'>> {}

@Injectable()
export class NgbDatepickerService {
  private _VALIDATORS:
      {[K in keyof DatepickerServiceInputs]: (v: DatepickerServiceInputs[K]) => Partial<DatepickerViewModel>} = {
        dayTemplateData: (dayTemplateData: NgbDayTemplateData) => {
          if (this._state.dayTemplateData !== dayTemplateData) {
            return {dayTemplateData};
          }
        },
        displayMonths: (displayMonths: number) => {
          displayMonths = toInteger(displayMonths);
          if (isInteger(displayMonths) && displayMonths > 0 && this._state.displayMonths !== displayMonths) {
            return {displayMonths};
          }
        },
        disabled: (disabled: boolean) => {
          if (this._state.disabled !== disabled) {
            return {disabled};
          }
        },
        firstDayOfWeek: (firstDayOfWeek: number) => {
          firstDayOfWeek = toInteger(firstDayOfWeek);
          if (isInteger(firstDayOfWeek) && firstDayOfWeek >= 0 && this._state.firstDayOfWeek !== firstDayOfWeek) {
            return {firstDayOfWeek};
          }
        },
        focusVisible: (focusVisible: boolean) => {
          if (this._state.focusVisible !== focusVisible && !this._state.disabled) {
            return {focusVisible};
          }
        },
        markDisabled: (markDisabled: NgbMarkDisabled) => {
          if (this._state.markDisabled !== markDisabled) {
            return {markDisabled};
          }
        },
        maxDate: (date: NgbDate) => {
          const maxDate = this.toValidDate(date, null);
          if (isChangedDate(this._state.maxDate, maxDate)) {
            return {maxDate};
          }
        },
        minDate: (date: NgbDate) => {
          const minDate = this.toValidDate(date, null);
          if (isChangedDate(this._state.minDate, minDate)) {
            return {minDate};
          }
        },
        navigation: (navigation: 'select' | 'arrows' | 'none') => {
          if (this._state.navigation !== navigation) {
            return {navigation};
          }
        },
        outsideDays: (outsideDays: 'visible' | 'collapsed' | 'hidden') => {
          if (this._state.outsideDays !== outsideDays) {
            return {outsideDays};
          }
        }
      };

  private _model$ = new Subject<DatepickerViewModel>();

  private _dateSelect$ = new Subject<NgbDate>();

  private _state: DatepickerViewModel = {
    disabled: false,
    displayMonths: 1,
    firstDayOfWeek: 1,
    focusVisible: false,
    months: [],
    navigation: 'select',
    outsideDays: 'visible',
    prevDisabled: false,
    nextDisabled: false,
    selectBoxes: {years: [], months: []},
    selectedDate: null
  };

  get model$(): Observable<DatepickerViewModel> { return this._model$.pipe(filter(model => model.months.length > 0)); }

  get dateSelect$(): Observable<NgbDate> { return this._dateSelect$.pipe(filter(date => date !== null)); }

  set(options: DatepickerServiceInputs) {
    let patch = Object.keys(options)
                    .map(key => this._VALIDATORS[key](options[key]))
                    .reduce((obj, part) => ({...obj, ...part}), {});

    if (Object.keys(patch).length > 0) {
      this._nextState(patch);
    }
  }

  constructor(private _calendar: NgbCalendar, private _i18n: NgbDatepickerI18n) {}

  focus(date: NgbDate) {
    if (!this._state.disabled && this._calendar.isValid(date) && isChangedDate(this._state.focusDate, date)) {
      this._nextState({focusDate: date});
    }
  }

  focusSelect() {
    if (isDateSelectable(this._state.focusDate, this._state)) {
      this.select(this._state.focusDate, {emitEvent: true});
    }
  }

  open(date: NgbDate) {
    const firstDate = this.toValidDate(date, this._calendar.getToday());
    if (!this._state.disabled && (!this._state.firstDate || isChangedMonth(this._state.firstDate, date))) {
      this._nextState({firstDate});
    }
  }

  select(date: NgbDate, options: {emitEvent?: boolean} = {}) {
    const selectedDate = this.toValidDate(date, null);
    if (!this._state.disabled) {
      if (isChangedDate(this._state.selectedDate, selectedDate)) {
        this._nextState({selectedDate});
      }

      if (options.emitEvent && isDateSelectable(selectedDate, this._state)) {
        this._dateSelect$.next(selectedDate);
      }
    }
  }

  toValidDate(date: NgbDateStruct, defaultValue?: NgbDate): NgbDate {
    const ngbDate = NgbDate.from(date);
    if (defaultValue === undefined) {
      defaultValue = this._calendar.getToday();
    }
    return this._calendar.isValid(ngbDate) ? ngbDate : defaultValue;
  }

  getMonth(struct: NgbDateStruct) {
    for (let month of this._state.months) {
      if (struct.month === month.number && struct.year === month.year) {
        return month;
      }
    }
    throw new Error(`month ${struct.month} of year ${struct.year} not found`);
  }

  private _nextState(patch: Partial<DatepickerViewModel>) {
    const newState = this._updateState(patch);
    this._patchContexts(newState);
    this._state = newState;
    this._model$.next(this._state);
  }

  private _patchContexts(state: DatepickerViewModel) {
    const {months, displayMonths, selectedDate, focusDate, focusVisible, disabled, outsideDays} = state;
    state.months.forEach(month => {
      month.weeks.forEach(week => {
        week.days.forEach(day => {

          // patch focus flag
          if (focusDate) {
            day.context.focused = focusDate.equals(day.date) && focusVisible;
          }

          // calculating tabindex
          day.tabindex = !disabled && day.date.equals(focusDate) && focusDate.month === month.number ? 0 : -1;

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
            day.hidden = outsideDays === 'hidden' || outsideDays === 'collapsed' ||
                (displayMonths > 1 && day.date.after(months[0].firstDate) &&
                 day.date.before(months[displayMonths - 1].lastDate));
          }
        });
      });
    });
  }

  private _updateState(patch: Partial<DatepickerViewModel>): DatepickerViewModel {
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
      if (state.months.length !== 0 && !state.focusDate.before(state.firstDate) &&
          !state.focusDate.after(state.lastDate)) {
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
      const forceRebuild = 'dayTemplateData' in patch || 'firstDayOfWeek' in patch || 'markDisabled' in patch ||
          'minDate' in patch || 'maxDate' in patch || 'disabled' in patch || 'outsideDays' in patch;

      const months = buildMonths(this._calendar, startDate, state, this._i18n, forceRebuild);

      // updating months and boundary dates
      state.months = months;
      state.firstDate = months.length > 0 ? months[0].firstDate : undefined;
      state.lastDate = months.length > 0 ? months[months.length - 1].lastDate : undefined;

      // reset selected date if 'markDisabled' returns true
      if ('selectedDate' in patch && !isDateSelectable(state.selectedDate, state)) {
        state.selectedDate = null;
      }

      // adjusting focus after months were built
      if ('firstDate' in patch) {
        if (state.focusDate === undefined || state.focusDate.before(state.firstDate) ||
            state.focusDate.after(state.lastDate)) {
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

        // months -> when current year or boundaries change
        if ('minDate' in patch || 'maxDate' in patch || state.selectBoxes.months.length === 0 || yearChanged) {
          state.selectBoxes.months =
              generateSelectBoxMonths(this._calendar, state.firstDate, state.minDate, state.maxDate);
        }
      } else {
        state.selectBoxes = {years: [], months: []};
      }

      // updating navigation arrows -> boundaries change (min/max) or month/year changes
      if ((state.navigation === 'arrows' || state.navigation === 'select') &&
          (monthChanged || yearChanged || 'minDate' in patch || 'maxDate' in patch || 'disabled' in patch)) {
        state.prevDisabled = state.disabled || prevMonthDisabled(this._calendar, state.firstDate, state.minDate);
        state.nextDisabled = state.disabled || nextMonthDisabled(this._calendar, state.lastDate, state.maxDate);
      }
    }

    return state;
  }
}
