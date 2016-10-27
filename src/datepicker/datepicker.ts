import {Component, Input, OnChanges, TemplateRef, forwardRef, OnInit, SimpleChanges} from '@angular/core';
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from '@angular/forms';
import {NgbCalendar} from './ngb-calendar';
import {NgbDate} from './ngb-date';
import {NgbDatepickerService} from './datepicker-service';
import {MonthViewModel, NavigationEvent} from './datepicker-view-model';
import {toInteger} from '../util/util';
import {DayTemplateContext} from './datepicker-day-template-context';
import {NgbDatepickerConfig} from './datepicker-config';
import {NgbDateStruct} from './ngb-date-struct';

const NGB_DATEPICKER_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => NgbDatepicker),
  multi: true
};

/**
 * A lightweight and highly configurable datepicker directive
 */
@Component({
  exportAs: 'ngbDatepicker',
  selector: 'ngb-datepicker',
  template: `
    <template #dt let-date="date" let-currentMonth="currentMonth" let-selected="selected" let-disabled="disabled">
       <div ngbDatepickerDayView [date]="date" [currentMonth]="currentMonth" [selected]="selected" [disabled]="disabled"></div>
    </template>
    
    <table>
      <tbody *ngIf="showNavigation" ngbDatepickerNavigation
        [date]="_date"
        [minDate]="_minDate"
        [maxDate]="_maxDate"
        [disabled]="disabled"
        [showWeekNumbers]="showWeekNumbers"
        (navigate)="onNavigateEvent($event)"
        (select)="onNavigateDateSelect($event)">
      </tbody>
      
      <tbody ngbDatepickerMonthView
        [month]="month"
        [selectedDate]="model"
        [dayTemplate]="dayTemplate || dt"
        [showWeekdays]="showWeekdays"
        [showWeekNumbers]="showWeekNumbers"
        [disabled]="disabled"
        [outsideDays]="outsideDays"
        (select)="onDateSelect($event)">
      </tbody>
    </table>
  `,
  providers: [NGB_DATEPICKER_VALUE_ACCESSOR]
})
export class NgbDatepicker implements OnChanges,
    OnInit, ControlValueAccessor {
  _date: NgbDate;
  _maxDate: NgbDate;
  _minDate: NgbDate;

  model: NgbDate;
  month: MonthViewModel;

  /**
   * Reference for the custom template for the day display
   */
  @Input() dayTemplate: TemplateRef<DayTemplateContext>;

  /**
   * First day of the week. With default calendar we use ISO 8601: 'weekday' is 1=Mon ... 7=Sun
   */
  @Input() firstDayOfWeek: number;

  /**
   * Callback to mark a given date as disabled.
   * 'Current' contains the month that will be displayed in the view
   */
  @Input() markDisabled: (date: NgbDateStruct, current: {year: number, month: number}) => boolean;

  /**
   * Min date for the navigation. If not provided will be 10 years before today or `startDate`
   */
  @Input() minDate: NgbDateStruct;

  /**
   * Max date for the navigation. If not provided will be 10 years from today or `startDate`
   */
  @Input() maxDate: NgbDateStruct;

  /**
   * The way to display days that don't belong to current month: `visible` (default),
   * `hidden` (not displayed) or `collapsed` (not displayed with empty space collapsed)
   */
  @Input() outsideDays: 'visible' | 'collapsed' | 'hidden';

  /**
   * Whether to display navigation
   */
  @Input() showNavigation: boolean;

  /**
   * Whether to display days of the week
   */
  @Input() showWeekdays: boolean;

  /**
   * Whether to display week numbers
   */
  @Input() showWeekNumbers: boolean;

  /**
   * Date to open calendar with.
   * With default calendar we use ISO 8601: 'month' is 1=Jan ... 12=Dec.
   * If nothing provided, calendar will open with current month.
   * Use 'navigateTo(date)' as an alternative
   */
  @Input() startDate: {year: number, month: number};

  disabled = false;

  onChange = (_: any) => {};
  onTouched = () => {};

  constructor(private _service: NgbDatepickerService, private _calendar: NgbCalendar, config: NgbDatepickerConfig) {
    this.dayTemplate = config.dayTemplate;
    this.firstDayOfWeek = config.firstDayOfWeek;
    this.markDisabled = config.markDisabled;
    this.minDate = config.minDate;
    this.maxDate = config.maxDate;
    this.outsideDays = config.outsideDays;
    this.showNavigation = config.showNavigation;
    this.showWeekdays = config.showWeekdays;
    this.showWeekNumbers = config.showWeekNumbers;
    this.startDate = config.startDate;
  }

  /**
   * Navigates current view to provided date.
   * With default calendar we use ISO 8601: 'month' is 1=Jan ... 12=Dec.
   * If nothing provided calendar will open current month.
   * Use 'startDate' input as an alternative
   */
  navigateTo(date?: {year: number, month: number}) {
    this._setViewWithinLimits(date ? NgbDate.from(date) : this._calendar.getToday());
    this._updateData();
  }

  ngOnInit() {
    this._setDates();
    this.navigateTo(this.startDate);
  }

  ngOnChanges(changes: SimpleChanges) {
    this._setDates();
    this.navigateTo(this.startDate);
  }

  onDateSelect(date: NgbDate) {
    this._setViewWithinLimits(date);

    this.onTouched();
    this.writeValue(date);
    this.onChange({year: date.year, month: date.month, day: date.day});

    // switch current month
    if (this._date.month !== this.month.number) {
      this._updateData();
    }
  }

  onNavigateDateSelect(date: NgbDate) {
    this._setViewWithinLimits(date);
    this._updateData();
  }

  onNavigateEvent(event: NavigationEvent) {
    switch (event) {
      case NavigationEvent.PREV:
        this._setViewWithinLimits(this._calendar.getPrev(this._date, 'm'));
        break;
      case NavigationEvent.NEXT:
        this._setViewWithinLimits(this._calendar.getNext(this._date, 'm'));
        break;
    }

    this._updateData();
  }

  registerOnChange(fn: (value: any) => any): void { this.onChange = fn; }

  registerOnTouched(fn: () => any): void { this.onTouched = fn; }

  writeValue(value) { this.model = value ? new NgbDate(value.year, value.month, value.day) : null; }

  setDisabledState(isDisabled: boolean) { this.disabled = isDisabled; }

  private _setDates() {
    this._maxDate = NgbDate.from(this.maxDate);
    this._minDate = NgbDate.from(this.minDate);
    this._date = this.startDate ? NgbDate.from(this.startDate) : this._calendar.getToday();

    if (!this._minDate) {
      this._minDate = this._calendar.getPrev(this._date, 'y', 10);
    }

    if (!this._maxDate) {
      this._maxDate = this._calendar.getNext(this._date, 'y', 11);
      this._maxDate = this._calendar.getPrev(this._maxDate);
    }

    if (this._minDate && this._maxDate && this._maxDate.before(this._minDate)) {
      throw new Error(`'maxDate' ${this._maxDate} should be greater than 'minDate' ${this._minDate}`);
    }
  }

  private _setViewWithinLimits(date: NgbDate) {
    if (this._minDate && date.before(this._minDate)) {
      this._date = new NgbDate(this._minDate.year, this._minDate.month, 1);
    } else if (this._maxDate && date.after(this._maxDate)) {
      this._date = new NgbDate(this._maxDate.year, this._maxDate.month, 1);
    } else {
      this._date = new NgbDate(date.year, date.month, 1);
    }
  }

  private _updateData() {
    this.month = this._service.generateMonthViewModel(
        this._date, this._minDate, this._maxDate, toInteger(this.firstDayOfWeek), this.markDisabled);
  }
}
