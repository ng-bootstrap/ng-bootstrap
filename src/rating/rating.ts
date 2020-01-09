import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import {NgbRatingConfig} from './rating-config';
import {getValueInRange} from '../util/util';
import {Key} from '../util/key';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

/**
 * The context for the custom star display template defined in the `starTemplate`.
 */
export interface StarTemplateContext {
  /**
   * The star fill percentage, an integer in the `[0, 100]` range.
   */
  fill: number;

  /**
   * Index of the star, starts with `0`.
   */
  index: number;
}

const NGB_RATING_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => NgbRating),
  multi: true
};

/**
 * A directive that helps visualising and interacting with a star rating bar.
 */
@Component({
  selector: 'ngb-rating',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'class': 'd-inline-flex',
    'tabindex': '0',
    'role': 'slider',
    'aria-valuemin': '0',
    '[attr.aria-valuemax]': 'max',
    '[attr.aria-valuenow]': 'nextRate',
    '[attr.aria-valuetext]': 'ariaValueText()',
    '[attr.aria-disabled]': 'readonly ? true : null',
    '(blur)': 'handleBlur()',
    '(keydown)': 'handleKeyDown($event)',
    '(mouseleave)': 'reset()'
  },
  template: `
    <ng-template #t let-fill="fill">{{ fill === 100 ? '&#9733;' : '&#9734;' }}</ng-template>
    <ng-template ngFor [ngForOf]="contexts" let-index="index">
      <span class="sr-only">({{ index < nextRate ? '*' : ' ' }})</span>
      <span (mouseenter)="enter(index + 1)" (click)="handleClick(index + 1)" [style.cursor]="readonly || disabled ? 'default' : 'pointer'">
        <ng-template [ngTemplateOutlet]="starTemplate || starTemplateFromContent || t" [ngTemplateOutletContext]="contexts[index]">
        </ng-template>
      </span>
    </ng-template>
  `,
  providers: [NGB_RATING_VALUE_ACCESSOR]
})
export class NgbRating implements ControlValueAccessor,
    OnInit, OnChanges {
  contexts: StarTemplateContext[] = [];
  disabled = false;
  nextRate: number;


  /**
   * The maximal rating that can be given.
   */
  @Input() max: number;

  /**
   * The current rating. Could be a decimal value like `3.75`.
   */
  @Input() rate: number;

  /**
   * If `true`, the rating can't be changed.
   */
  @Input() readonly: boolean;

  /**
   * If `true`, the rating can be reset to `0` by mouse clicking currently set rating.
   */
  @Input() resettable: boolean;

  /**
   * The template to override the way each star is displayed.
   *
   * Alternatively put an `<ng-template>` as the only child of your `<ngb-rating>` element
   */
  @Input() starTemplate: TemplateRef<StarTemplateContext>;
  @ContentChild(TemplateRef, {static: false}) starTemplateFromContent: TemplateRef<StarTemplateContext>;

  /**
   * An event emitted when the user is hovering over a given rating.
   *
   * Event payload equals to the rating being hovered over.
   */
  @Output() hover = new EventEmitter<number>();

  /**
   * An event emitted when the user stops hovering over a given rating.
   *
   * Event payload equals to the rating of the last item being hovered over.
   */
  @Output() leave = new EventEmitter<number>();

  /**
   * An event emitted when the user selects a new rating.
   *
   * Event payload equals to the newly selected rating.
   */
  @Output() rateChange = new EventEmitter<number>(true);

  onChange = (_: any) => {};
  onTouched = () => {};

  constructor(config: NgbRatingConfig, private _changeDetectorRef: ChangeDetectorRef) {
    this.max = config.max;
    this.readonly = config.readonly;
  }

  ariaValueText() { return `${this.nextRate} out of ${this.max}`; }

  enter(value: number): void {
    if (!this.readonly && !this.disabled) {
      this._updateState(value);
    }
    this.hover.emit(value);
  }

  handleBlur() { this.onTouched(); }

  handleClick(value: number) { this.update(this.resettable && this.rate === value ? 0 : value); }

  handleKeyDown(event: KeyboardEvent) {
    // tslint:disable-next-line:deprecation
    switch (event.which) {
      case Key.ArrowDown:
      case Key.ArrowLeft:
        this.update(this.rate - 1);
        break;
      case Key.ArrowUp:
      case Key.ArrowRight:
        this.update(this.rate + 1);
        break;
      case Key.Home:
        this.update(0);
        break;
      case Key.End:
        this.update(this.max);
        break;
      default:
        return;
    }

    // note 'return' in default case
    event.preventDefault();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['rate']) {
      this.update(this.rate);
    }
  }

  ngOnInit(): void {
    this.contexts = Array.from({length: this.max}, (v, k) => ({fill: 0, index: k}));
    this._updateState(this.rate);
  }

  registerOnChange(fn: (value: any) => any): void { this.onChange = fn; }

  registerOnTouched(fn: () => any): void { this.onTouched = fn; }

  reset(): void {
    this.leave.emit(this.nextRate);
    this._updateState(this.rate);
  }

  setDisabledState(isDisabled: boolean) { this.disabled = isDisabled; }

  update(value: number, internalChange = true): void {
    const newRate = getValueInRange(value, this.max, 0);
    if (!this.readonly && !this.disabled && this.rate !== newRate) {
      this.rate = newRate;
      this.rateChange.emit(this.rate);
    }
    if (internalChange) {
      this.onChange(this.rate);
      this.onTouched();
    }
    this._updateState(this.rate);
  }

  writeValue(value) {
    this.update(value, false);
    this._changeDetectorRef.markForCheck();
  }

  private _getFillValue(index: number): number {
    const diff = this.nextRate - index;

    if (diff >= 1) {
      return 100;
    }
    if (diff < 1 && diff > 0) {
      return parseInt((diff * 100).toFixed(2), 10);
    }

    return 0;
  }

  private _updateState(nextValue: number) {
    this.nextRate = nextValue;
    this.contexts.forEach((context, index) => context.fill = this._getFillValue(index));
  }
}
