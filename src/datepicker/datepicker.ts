import {Subscription} from 'rxjs/Subscription';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  TemplateRef,
  forwardRef,
  OnInit,
  SimpleChanges,
  EventEmitter,
  Output,
  OnDestroy,
  ElementRef
} from '@angular/core';
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from '@angular/forms';
import {NgbCalendar} from './ngb-calendar';
import {NgbDate} from './ngb-date';
import {NgbDatepickerService} from './datepicker-service';
import {NgbDatepickerKeyMapService} from './datepicker-keymap-service';
import {DatepickerViewModel, NavigationEvent} from './datepicker-view-model';
import {toInteger} from '../util/util';
import {DayTemplateContext} from './datepicker-day-template-context';
import {NgbDatepickerConfig} from './datepicker-config';
import {NgbDateStruct} from './ngb-date-struct';
import {NgbDatepickerI18n} from './datepicker-i18n';
import {isChangedDate} from './datepicker-tools';

const NGB_DATEPICKER_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => NgbDatepicker),
  multi: true
};

/**
 * The payload of the datepicker navigation event
 */
export interface NgbDatepickerNavigateEvent {
  /**
   * Currently displayed month
   */
  current: {year: number, month: number};

  /**
   * Month we're navigating to
   */
  next: {year: number, month: number};
}

/**
 * A lightweight and highly configurable datepicker directive
 */
@Component({
  exportAs: 'ngbDatepicker',
  selector: 'ngb-datepicker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'd-inline-block rounded',
    'tabindex': '0',
    '[attr.tabindex]': 'model.disabled ? undefined : "0"',
    '(blur)': 'showFocus(false)',
    '(focus)': 'showFocus(true)',
    '(keydown)': 'onKeyDown($event)'
  },
  styles: [`
    :host {
      border: 1px solid rgba(0, 0, 0, 0.125);
    }
    .ngb-dp-header {
      border-bottom: 1px solid rgba(0, 0, 0, 0.125);
    }
    .ngb-dp-month {
      pointer-events: none;
    }
    ngb-datepicker-month-view {
      pointer-events: auto;
    }
    .ngb-dp-month:first-child {
      margin-left: 0 !important;
    }
    .ngb-dp-month-name {
      font-size: larger;
      height: 2rem;
      line-height: 2rem;
    }
  `],
  template: `
    <ng-template #dt let-date="date" let-currentMonth="currentMonth" let-selected="selected" let-disabled="disabled" let-focused="focused">
      <div ngbDatepickerDayView
        [date]="date"
        [currentMonth]="currentMonth"
        [selected]="selected"
        [disabled]="disabled"
        [focused]="focused">
      </div>
    </ng-template>

    <div class="ngb-dp-header bg-light pt-1 rounded-top" [style.height.rem]="getHeaderHeight()"
         [style.marginBottom.rem]="-getHeaderMargin()">
      <ngb-datepicker-navigation *ngIf="model.navigation !== 'none'"
        [date]="model.firstDate"
        [minDate]="model.minDate"
        [maxDate]="model.maxDate"
        [months]="model.months.length"
        [disabled]="model.disabled"
        [showWeekNumbers]="showWeekNumbers"
        [showSelect]="model.navigation === 'select'"
        (navigate)="onNavigateEvent($event)"
        (select)="onNavigateDateSelect($event)">
      </ngb-datepicker-navigation>
    </div>

    <div class="ngb-dp-months d-flex px-1 pb-1">
      <ng-template ngFor let-month [ngForOf]="model.months" let-i="index">
        <div class="ngb-dp-month d-block ml-3">
          <div *ngIf="model.navigation !== 'select' || displayMonths > 1" class="ngb-dp-month-name text-center">
            {{ i18n.getMonthFullName(month.number) }} {{ month.year }}
          </div>
          <ngb-datepicker-month-view
            [month]="month"
            [dayTemplate]="dayTemplate || dt"
            [showWeekdays]="showWeekdays"
            [showWeekNumbers]="showWeekNumbers"
            [outsideDays]="(displayMonths === 1 ? outsideDays : 'hidden')"
            (select)="onDateSelect($event)">
          </ngb-datepicker-month-view>
        </div>
      </ng-template>
    </div>
  `,
  providers: [NGB_DATEPICKER_VALUE_ACCESSOR, NgbDatepickerService, NgbDatepickerKeyMapService]
})
export class NgbDatepicker implements OnDestroy,
    OnChanges, OnInit, ControlValueAccessor {
  model: DatepickerViewModel;

  private _subscription: Subscription;
  private _selectSubscription: Subscription;
  /**
   * Reference for the custom template for the day display
   */
  @Input() dayTemplate: TemplateRef<DayTemplateContext>;

  /**
   * Number of months to display
   */
  @Input() displayMonths: number;

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
   * Max date for the navigation. If not provided will be 10 years from today or `startDate`
   */
  @Input() maxDate: NgbDateStruct;

  /**
   * Min date for the navigation. If not provided will be 10 years before today or `startDate`
   */
  @Input() minDate: NgbDateStruct;

  /**
   * Navigation type: `select` (default with select boxes for month and year), `arrows`
   * (without select boxes, only navigation arrows) or `none` (no navigation at all)
   */
  @Input() navigation: 'select' | 'arrows' | 'none';

  /**
   * The way to display days that don't belong to current month: `visible` (default),
   * `hidden` (not displayed) or `collapsed` (not displayed with empty space collapsed)
   */
  @Input() outsideDays: 'visible' | 'collapsed' | 'hidden';

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
   * If nothing or invalid date provided, calendar will open with current month.
   * Use 'navigateTo(date)' as an alternative
   */
  @Input() startDate: {year: number, month: number};

  /**
   * An event fired when navigation happens and currently displayed month changes.
   * See NgbDatepickerNavigateEvent for the payload info.
   */
  @Output() navigate = new EventEmitter<NgbDatepickerNavigateEvent>();

  /**
   * An event fired when user selects a date using keyboard or mouse.
   * The payload of the event is currently selected NgbDateStruct.
   */
  @Output() select = new EventEmitter<NgbDateStruct>();

  onChange = (_: any) => {};
  onTouched = () => {};

  constructor(
      private _keyMapService: NgbDatepickerKeyMapService, public _service: NgbDatepickerService,
      private _calendar: NgbCalendar, public i18n: NgbDatepickerI18n, config: NgbDatepickerConfig,
      private _cd: ChangeDetectorRef, private _elementRef: ElementRef) {
    this.dayTemplate = config.dayTemplate;
    this.displayMonths = config.displayMonths;
    this.firstDayOfWeek = config.firstDayOfWeek;
    this.markDisabled = config.markDisabled;
    this.minDate = config.minDate;
    this.maxDate = config.maxDate;
    this.navigation = config.navigation;
    this.outsideDays = config.outsideDays;
    this.showWeekdays = config.showWeekdays;
    this.showWeekNumbers = config.showWeekNumbers;
    this.startDate = config.startDate;

    this._selectSubscription = _service.select$.subscribe(date => { this.select.emit(date.toStruct()); });

    this._subscription = _service.model$.subscribe(model => {
      const newDate = model.firstDate;
      const oldDate = this.model ? this.model.firstDate : null;
      const newSelectedDate = model.selectedDate;
      const oldSelectedDate = this.model ? this.model.selectedDate : null;

      this.model = model;

      // handling selection change
      if (isChangedDate(newSelectedDate, oldSelectedDate)) {
        this.onTouched();
        this.onChange(
            newSelectedDate ? {year: newSelectedDate.year, month: newSelectedDate.month, day: newSelectedDate.day} :
                              null);
      }

      // emitting navigation event if the first month changes
      if (!newDate.equals(oldDate)) {
        this.navigate.emit({
          current: oldDate ? {year: oldDate.year, month: oldDate.month} : null,
          next: {year: newDate.year, month: newDate.month}
        });
      }
      _cd.markForCheck();
    });
  }

  /**
   * Manually focus the datepicker
   */
  focus() { this._elementRef.nativeElement.focus(); }

  getHeaderHeight() {
    const h = this.showWeekdays ? 6.25 : 4.25;
    return this.displayMonths === 1 || this.navigation !== 'select' ? h - 2 : h;
  }

  getHeaderMargin() {
    const m = this.showWeekdays ? 2 : 0;
    return this.displayMonths !== 1 || this.navigation !== 'select' ? m + 2 : m;
  }

  /**
   * Navigates current view to provided date.
   * With default calendar we use ISO 8601: 'month' is 1=Jan ... 12=Dec.
   * If nothing or invalid date provided calendar will open current month.
   * Use 'startDate' input as an alternative
   */
  navigateTo(date?: {year: number, month: number}) {
    this._service.open(date ? new NgbDate(date.year, date.month, 1) : this._calendar.getToday());
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
    this._selectSubscription.unsubscribe();
  }

  ngOnInit() {
    if (this.model === undefined) {
      this._service.displayMonths = toInteger(this.displayMonths);
      this._service.markDisabled = this.markDisabled;
      this._service.firstDayOfWeek = this.firstDayOfWeek;
      this._service.navigation = this.navigation;
      this._setDates();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['displayMonths']) {
      this._service.displayMonths = toInteger(this.displayMonths);
    }
    if (changes['markDisabled']) {
      this._service.markDisabled = this.markDisabled;
    }
    if (changes['firstDayOfWeek']) {
      this._service.firstDayOfWeek = this.firstDayOfWeek;
    }
    if (changes['navigation']) {
      this._service.navigation = this.navigation;
    }
    this._setDates();
  }

  onDateSelect(date: NgbDate) {
    this._service.focus(date);
    this._service.select(date, {emitEvent: true});
  }

  onKeyDown(event: KeyboardEvent) { this._keyMapService.processKey(event); }

  onNavigateDateSelect(date: NgbDate) { this._service.open(date); }

  onNavigateEvent(event: NavigationEvent) {
    switch (event) {
      case NavigationEvent.PREV:
        this._service.open(this._calendar.getPrev(this.model.firstDate, 'm', 1));
        break;
      case NavigationEvent.NEXT:
        this._service.open(this._calendar.getNext(this.model.firstDate, 'm', 1));
        break;
    }
  }

  registerOnChange(fn: (value: any) => any): void { this.onChange = fn; }

  registerOnTouched(fn: () => any): void { this.onTouched = fn; }

  setDisabledState(isDisabled: boolean) { this._service.disabled = isDisabled; }

  showFocus(focusVisible: boolean) { this._service.focusVisible = focusVisible; }

  writeValue(value) { this._service.select(value); }

  private _setDates() {
    const startDate = this._service.toValidDate(this.startDate, this._calendar.getToday());
    const minDate = this._service.toValidDate(this.minDate, this._calendar.getPrev(startDate, 'y', 10));
    const maxDate =
        this._service.toValidDate(this.maxDate, this._calendar.getPrev(this._calendar.getNext(startDate, 'y', 11)));

    this.minDate = {year: minDate.year, month: minDate.month, day: minDate.day};
    this.maxDate = {year: maxDate.year, month: maxDate.month, day: maxDate.day};

    this._service.minDate = minDate;
    this._service.maxDate = maxDate;
    this.navigateTo(startDate);
  }
}
