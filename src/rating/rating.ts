import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  OnInit,
  TemplateRef,
  OnChanges,
  SimpleChanges,
  ContentChild,
  forwardRef,
  ChangeDetectorRef
} from '@angular/core';
import {NgbRatingConfig} from './rating-config';
import {toString, getValueInRange} from '../util/util';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

enum Key {
  End = 35,
  Home = 36,
  ArrowLeft = 37,
  ArrowUp = 38,
  ArrowRight = 39,
  ArrowDown = 40
}

/**
 * Context for the custom star display template
 */
export interface StarTemplateContext {
  /**
   * Star fill percentage. An integer value between 0 and 100
   */
  fill: number;
}

const NGB_RATING_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => NgbRating),
  multi: true
};

/**
 * Rating directive that will take care of visualising a star rating bar.
 */
@Component({
  selector: 'ngb-rating',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
        <ng-template [ngTemplateOutlet]="starTemplate || t" [ngTemplateOutletContext]="contexts[index]"></ng-template>
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
   * Maximal rating that can be given using this widget.
   */
  @Input() max: number;

  /**
   * Current rating. Can be a decimal value like 3.75
   */
  @Input() rate: number;

  /**
   * A flag indicating if rating can be updated.
   */
  @Input() readonly: boolean;

  /**
   * A flag indicating if rating can be reset to 0 on mouse click
   */
  @Input() resettable: boolean;

  /**
   * A template to override star display.
   * Alternatively put a <ng-template> as the only child of <ngb-rating> element
   */
  @Input() @ContentChild(TemplateRef) starTemplate: TemplateRef<StarTemplateContext>;

  /**
   * An event fired when a user is hovering over a given rating.
   * Event's payload equals to the rating being hovered over.
   */
  @Output() hover = new EventEmitter<number>();

  /**
   * An event fired when a user stops hovering over a given rating.
   * Event's payload equals to the rating of the last item being hovered over.
   */
  @Output() leave = new EventEmitter<number>();

  /**
   * An event fired when a user selects a new rating.
   * Event's payload equals to the newly selected rating.
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
    if (Key[toString(event.which)]) {
      event.preventDefault();

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
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['rate']) {
      this.update(this.rate);
    }
  }

  ngOnInit(): void {
    this.contexts = Array.from({length: this.max}, () => ({fill: 0}));
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
      return Number.parseInt((diff * 100).toFixed(2));
    }

    return 0;
  }

  private _updateState(nextValue: number) {
    this.nextRate = nextValue;
    this.contexts.forEach((context, index) => context.fill = this._getFillValue(index));
  }
}
