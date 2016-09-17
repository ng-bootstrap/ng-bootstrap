import {
  Directive,
  Input,
  ComponentRef,
  ElementRef,
  ViewContainerRef,
  Renderer,
  ComponentFactoryResolver,
  NgZone,
  TemplateRef,
  forwardRef
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

import {NgbDate} from './ngb-date';
import {NgbDatepicker} from './datepicker';
import {DayTemplateContext} from './datepicker-day-template-context';
import {NgbDateParserFormatter} from './ngb-date-parser-formatter';

import {positionElements} from '../util/positioning';
import {NgbDateStruct} from './ngb-date-struct';

const NGB_DATEPICKER_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
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
  host: {'(change)': 'manualDateChange($event.target.value)', '(keyup.esc)': 'close()'},
  providers: [NGB_DATEPICKER_VALUE_ACCESSOR]
})
export class NgbInputDatepicker implements ControlValueAccessor {
  private _cRef: ComponentRef<NgbDatepicker> = null;
  private _model: NgbDate;
  private _zoneSubscription: any;

  /**
   * Reference for the custom template for the day display
   */
  @Input() dayTemplate: TemplateRef<DayTemplateContext>;

  /**
   * First day of the week, 0=Sun, 1=Mon, etc.
   */
  @Input() firstDayOfWeek: number;

  /**
   * Callback to mark a given date as disabled
   */
  @Input() markDisabled: (date: NgbDateStruct) => boolean;

  /**
   * Min date for the navigation. If not provided will be 10 years before today or `startDate`
   */
  @Input() minDate: NgbDateStruct;

  /**
   * Max date for the navigation. If not provided will be 10 years from today or `startDate`
   */
  @Input() maxDate: NgbDateStruct;

  /**
   * Whether to display navigation or not
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
   * Date to open calendar with. If nothing provided, calendar will open with current month.
   * Use 'navigateTo(date)' as an alternative
   */
  @Input() startDate: {year: number, month: number};

  private _onChange = (_: any) => {};
  private _onTouched = () => {};


  constructor(
      private _parserFormatter: NgbDateParserFormatter, private _elRef: ElementRef, private _vcRef: ViewContainerRef,
      private _renderer: Renderer, private _cfr: ComponentFactoryResolver, ngZone: NgZone) {
    this._zoneSubscription = ngZone.onStable.subscribe(() => {
      if (this._cRef) {
        positionElements(this._elRef.nativeElement, this._cRef.location.nativeElement, 'bottom-left');
      }
    });
  }

  /**
   * @internal
   */
  registerOnChange(fn: (value: any) => any): void { this._onChange = fn; }

  /**
   * @internal
   */
  registerOnTouched(fn: () => any): void { this._onTouched = fn; }

  /**
   * @internal
   */
  writeValue(value) {
    this._model = value ? new NgbDate(value.year, value.month, value.day) : null;
    this._writeModelValue(this._model);
  }

  /**
   * @internal
   */
  setDisabledState(isDisabled: boolean): void {
    this._renderer.setElementProperty(this._elRef.nativeElement, 'disabled', isDisabled);
    if (this.isOpen()) {
      this._cRef.instance.setDisabledState(isDisabled);
    }
  }

  /**
   * @internal
   */
  manualDateChange(value: string) {
    this._model = NgbDate.from(this._parserFormatter.parse(value));
    this._onChange(this._model ? {year: this._model.year, month: this._model.month, day: this._model.day} : null);
    this._writeModelValue(this._model);
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
      this._cRef.instance.writeValue(this._model);
      this._applyDatepickerInputs(this._cRef.instance);
      this._cRef.instance.ngOnInit();

      // date selection event handling
      this._cRef.instance.registerOnChange((selectedDate) => {
        this.writeValue(selectedDate);
        this._onChange(selectedDate);
        this.close();
      });
    }
  }

  /**
   * Closes the datepicker popup.
   */
  close() {
    if (this.isOpen()) {
      this._vcRef.remove(this._vcRef.indexOf(this._cRef.hostView));
      this._cRef = null;
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
   * Navigates current view to provided date. If nothing provided calendar will open current month.
   * Use 'startDate' input as an alternative
   */
  navigateTo(date?: {year: number, month: number}) {
    if (this.isOpen()) {
      this._cRef.instance.navigateTo(date);
    }
  }

  private _applyDatepickerInputs(datepickerInstance: NgbDatepicker): void {
    ['dayTemplate', 'firstDayOfWeek', 'markDisabled', 'minDate', 'maxDate', 'showNavigation', 'showWeekdays',
     'showWeekNumbers', 'startDate']
        .forEach((optionName: string) => {
          if (this[optionName] !== undefined) {
            datepickerInstance[optionName] = this[optionName];
          }
        });
  }

  private _applyPopupStyling(nativeElement: any) {
    this._renderer.setElementClass(nativeElement, 'dropdown-menu', true);
    this._renderer.setElementStyle(nativeElement, 'display', 'block');
    this._renderer.setElementStyle(nativeElement, 'padding', '0.40rem');
  }

  private _writeModelValue(model: NgbDate) {
    this._renderer.setElementProperty(this._elRef.nativeElement, 'value', this._parserFormatter.format(model));
    if (this.isOpen()) {
      this._cRef.instance.writeValue(model);
    }
  }
}
