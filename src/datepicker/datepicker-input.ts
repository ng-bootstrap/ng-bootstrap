import {
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  Output,
  Renderer2,
  SimpleChanges,
  TemplateRef,
  ViewContainerRef,
  ChangeDetectorRef,
} from '@angular/core';
import {AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validator} from '@angular/forms';
import {Subject} from 'rxjs';

import {ngbFocusTrap} from '../util/focus-trap';
import {PlacementArray, positionElements} from '../util/positioning';
import {NgbDateAdapter} from './adapters/ngb-date-adapter';
import {NgbDatepicker, NgbDatepickerNavigateEvent} from './datepicker';
import {DayTemplateContext} from './datepicker-day-template-context';
import {NgbDatepickerService} from './datepicker-service';
import {NgbCalendar} from './ngb-calendar';
import {NgbDate} from './ngb-date';
import {NgbDateParserFormatter} from './ngb-date-parser-formatter';
import {NgbDateStruct} from './ngb-date-struct';
import {AutoClose} from '../util/autoclose';

const NGB_DATEPICKER_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => NgbInputDatepicker),
  multi: true
};

const NGB_DATEPICKER_VALIDATOR = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => NgbInputDatepicker),
  multi: true
};

/**
 * A directive that makes it possible to have datepickers on input fields.
 * Manages integration with the input field itself (data entry) and ngModel (validation etc.).
 */
@Directive({
  selector: 'input[ngbDatepicker]',
  exportAs: 'ngbDatepicker',
  host: {
    '(input)': 'manualDateChange($event.target.value)',
    '(change)': 'manualDateChange($event.target.value, true)',
    '(blur)': 'onBlur()',
    '[disabled]': 'disabled'
  },
  providers: [NGB_DATEPICKER_VALUE_ACCESSOR, NGB_DATEPICKER_VALIDATOR, NgbDatepickerService]
})
export class NgbInputDatepicker implements OnChanges,
    OnDestroy, ControlValueAccessor, Validator {
  private _closed$ = new Subject();
  private _cRef: ComponentRef<NgbDatepicker> = null;
  private _disabled = false;
  private _model: NgbDate;
  private _inputValue: string;
  private _zoneSubscription: any;

  /**
   * Indicates whether the datepicker popup should be closed automatically after date selection / outside click or not.
   *
   * By default the popup will close on both date selection and outside click. If the value is 'false' the popup has to
   * be closed manually via '.close()' or '.toggle()' methods. If the value is set to 'inside' the popup will close on
   * date selection only. For the 'outside' the popup will close only on the outside click.
   *
   * @since 3.0.0
   */
  @Input() autoClose: boolean | 'inside' | 'outside' = true;

  /**
   * Reference for the custom template for the day display
   */
  @Input() dayTemplate: TemplateRef<DayTemplateContext>;

  /**
   * Callback to pass any arbitrary data to the custom day template context
   * 'Current' contains the month that will be displayed in the view
   *
   * @since 3.3.0
   */
  @Input() dayTemplateData: (date: NgbDate, current: {year: number, month: number}) => any;

  /**
   * Number of months to display
   */
  @Input() displayMonths: number;

  /**
   * First day of the week. With default calendar we use ISO 8601: 1=Mon ... 7=Sun
   */
  @Input() firstDayOfWeek: number;

  /**
   * Reference for the custom template for the footer inside datepicker
   *
   * @since 3.3.0
   */
  @Input() footerTemplate: TemplateRef<any>;

  /**
   * Callback to mark a given date as disabled.
   * 'Current' contains the month that will be displayed in the view
   */
  @Input() markDisabled: (date: NgbDate, current: {year: number, month: number}) => boolean;

  /**
   * Min date for the navigation. If not provided will be 10 years before today or `startDate`
   */
  @Input() minDate: NgbDateStruct;

  /**
   * Max date for the navigation. If not provided will be 10 years from today or `startDate`
   */
  @Input() maxDate: NgbDateStruct;

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
   * Placement of a datepicker popup accepts:
   *    "top", "top-left", "top-right", "bottom", "bottom-left", "bottom-right",
   *    "left", "left-top", "left-bottom", "right", "right-top", "right-bottom"
   * and array of above values.
   */
  @Input() placement: PlacementArray = 'bottom-left';

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
  @Input() startDate: {year: number, month: number, day?: number};

  /**
   * A selector specifying the element the datepicker popup should be appended to.
   * Currently only supports "body".
   */
  @Input() container: string;

  /**
   * An event fired when user selects a date using keyboard or mouse.
   * The payload of the event is currently selected NgbDate.
   *
   * @since 1.1.1
   */
  @Output() dateSelect = new EventEmitter<NgbDate>();

  /**
   * An event fired when navigation happens and currently displayed month changes.
   * See NgbDatepickerNavigateEvent for the payload info.
   */
  @Output() navigate = new EventEmitter<NgbDatepickerNavigateEvent>();

  @Input()
  get disabled() {
    return this._disabled;
  }
  set disabled(value: any) {
    this._disabled = value === '' || (value && value !== 'false');

    if (this.isOpen()) {
      this._cRef.instance.setDisabledState(this._disabled);
    }
  }

  private _onChange = (_: any) => {};
  private _onTouched = () => {};
  private _validatorChange = () => {};


  constructor(
      private _parserFormatter: NgbDateParserFormatter, private _elRef: ElementRef<HTMLInputElement>,
      private _vcRef: ViewContainerRef, private _renderer: Renderer2, private _cfr: ComponentFactoryResolver,
      private _ngZone: NgZone, private _service: NgbDatepickerService, private _calendar: NgbCalendar,
      private _dateAdapter: NgbDateAdapter<any>, private _changeDetector: ChangeDetectorRef,
      private _autoClose: AutoClose) {
    this._zoneSubscription = _ngZone.onStable.subscribe(() => {
      if (this._cRef) {
        positionElements(
            this._elRef.nativeElement, this._cRef.location.nativeElement, this.placement, this.container === 'body');
      }
    });
  }

  registerOnChange(fn: (value: any) => any): void { this._onChange = fn; }

  registerOnTouched(fn: () => any): void { this._onTouched = fn; }

  registerOnValidatorChange(fn: () => void): void { this._validatorChange = fn; }

  setDisabledState(isDisabled: boolean): void { this.disabled = isDisabled; }

  validate(c: AbstractControl): {[key: string]: any} {
    const value = c.value;

    if (value === null || value === undefined) {
      return null;
    }

    const ngbDate = this._fromDateStruct(this._dateAdapter.fromModel(value));

    if (!this._calendar.isValid(ngbDate)) {
      return {'ngbDate': {invalid: c.value}};
    }

    if (this.minDate && ngbDate.before(NgbDate.from(this.minDate))) {
      return {'ngbDate': {requiredBefore: this.minDate}};
    }

    if (this.maxDate && ngbDate.after(NgbDate.from(this.maxDate))) {
      return {'ngbDate': {requiredAfter: this.maxDate}};
    }
  }

  writeValue(value) {
    this._model = this._fromDateStruct(this._dateAdapter.fromModel(value));
    this._writeModelValue(this._model);
  }

  manualDateChange(value: string, updateView = false) {
    const inputValueChanged = value !== this._inputValue;
    if (inputValueChanged) {
      this._inputValue = value;
      this._model = this._fromDateStruct(this._parserFormatter.parse(value));
    }
    if (inputValueChanged || !updateView) {
      this._onChange(this._model ? this._dateAdapter.toModel(this._model) : (value === '' ? null : value));
    }
    if (updateView && this._model) {
      this._writeModelValue(this._model);
    }
  }

  isOpen() { return !!this._cRef; }

  /**
   * Opens the datepicker with the selected date indicated by the ngModel value.
   */
  open() {
    if (!this.isOpen()) {
      const cf = this._cfr.resolveComponentFactory(NgbDatepicker);
      this._cRef = this._vcRef.createComponent(cf);

      this._applyPopupStyling(this._cRef.location.nativeElement);
      this._applyDatepickerInputs(this._cRef.instance);
      this._subscribeForDatepickerOutputs(this._cRef.instance);
      this._cRef.instance.ngOnInit();
      this._cRef.instance.writeValue(this._dateAdapter.toModel(this._model));

      // date selection event handling
      this._cRef.instance.registerOnChange((selectedDate) => {
        this.writeValue(selectedDate);
        this._onChange(selectedDate);
        this._onTouched();
      });

      this._cRef.changeDetectorRef.detectChanges();

      this._cRef.instance.setDisabledState(this.disabled);

      if (this.container === 'body') {
        window.document.querySelector(this.container).appendChild(this._cRef.location.nativeElement);
      }

      // focus handling
      ngbFocusTrap(this._cRef.location.nativeElement, this._closed$, true);

      this._cRef.instance.focus();
      this._autoClose.install(
          this.autoClose, () => this.close(), this._closed$, [],
          [this._elRef.nativeElement, this._cRef.location.nativeElement]);
    }
  }

  /**
   * Closes the datepicker popup.
   */
  close() {
    if (this.isOpen()) {
      this._vcRef.remove(this._vcRef.indexOf(this._cRef.hostView));
      this._cRef = null;
      this._closed$.next();
      this._changeDetector.markForCheck();
    }
  }

  /**
   * Toggles the datepicker popup (opens when closed and closes when opened).
   */
  toggle() {
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * Navigates current view to provided date.
   * With default calendar we use ISO 8601: 'month' is 1=Jan ... 12=Dec.
   * If nothing or invalid date provided calendar will open current month.
   * Use 'startDate' input as an alternative
   */
  navigateTo(date?: {year: number, month: number, day?: number}) {
    if (this.isOpen()) {
      this._cRef.instance.navigateTo(date);
    }
  }

  onBlur() { this._onTouched(); }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['minDate'] || changes['maxDate']) {
      this._validatorChange();
    }
  }

  ngOnDestroy() {
    this.close();
    this._zoneSubscription.unsubscribe();
  }

  private _applyDatepickerInputs(datepickerInstance: NgbDatepicker): void {
    ['dayTemplate', 'dayTemplateData', 'displayMonths', 'firstDayOfWeek', 'footerTemplate', 'markDisabled', 'minDate',
     'maxDate', 'navigation', 'outsideDays', 'showNavigation', 'showWeekdays', 'showWeekNumbers']
        .forEach((optionName: string) => {
          if (this[optionName] !== undefined) {
            datepickerInstance[optionName] = this[optionName];
          }
        });
    datepickerInstance.startDate = this.startDate || this._model;
  }

  private _applyPopupStyling(nativeElement: any) {
    this._renderer.addClass(nativeElement, 'dropdown-menu');
    this._renderer.setStyle(nativeElement, 'padding', '0');
    this._renderer.addClass(nativeElement, 'show');
  }

  private _subscribeForDatepickerOutputs(datepickerInstance: NgbDatepicker) {
    datepickerInstance.navigate.subscribe(date => this.navigate.emit(date));
    datepickerInstance.select.subscribe(date => {
      this.dateSelect.emit(date);
      if (this.autoClose === true || this.autoClose === 'inside') {
        this.close();
      }
    });
  }

  private _writeModelValue(model: NgbDate) {
    const value = this._parserFormatter.format(model);
    this._inputValue = value;
    this._renderer.setProperty(this._elRef.nativeElement, 'value', value);
    if (this.isOpen()) {
      this._cRef.instance.writeValue(this._dateAdapter.toModel(model));
      this._onTouched();
    }
  }

  private _fromDateStruct(date: NgbDateStruct): NgbDate {
    const ngbDate = date ? new NgbDate(date.year, date.month, date.day) : null;
    return this._calendar.isValid(ngbDate) ? ngbDate : null;
  }
}
