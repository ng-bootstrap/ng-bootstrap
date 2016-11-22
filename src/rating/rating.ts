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
  ContentChild
} from '@angular/core';
import {NgbRatingConfig} from './rating-config';
import {toString, getValueInRange} from '../util/util';

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

/**
 * Rating directive that will take care of visualising a star rating bar.
 */
@Component({
  selector: 'ngb-rating',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {'(keydown)': 'handleKeyDown($event)'},
  template: `
    <template #t let-fill="fill">{{ fill === 100 ? '&#9733;' : '&#9734;' }}</template>
    <span tabindex="0" (mouseleave)="reset()" role="slider" aria-valuemin="0"
      [attr.aria-valuemax]="max" [attr.aria-valuenow]="rate" [attr.aria-valuetext]="ariaValueText()">
      <template ngFor [ngForOf]="range" let-index="index">
        <span class="sr-only">({{ index < rate ? '*' : ' ' }})</span>
        <span (mouseenter)="enter(index + 1)" (click)="update(index + 1)" 
        [style.cursor]="readonly ? 'default' : 'pointer'">
          <template [ngTemplateOutlet]="starTemplate || t" [ngOutletContext]="{fill: getFillValue(index)}"></template>
        </span>
      </template>
    </span>
  `
})
export class NgbRating implements OnInit,
    OnChanges {
  private _oldRate: number;
  range: number[] = [];

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
   * A template to override star display.
   * Alternatively put a <template> as the only child of <ngb-rating> element
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
  @Output() rateChange = new EventEmitter<number>();

  constructor(config: NgbRatingConfig) {
    this.max = config.max;
    this.readonly = config.readonly;
  }

  ariaValueText() { return `${this.rate} out of ${this.max}`; }

  enter(value: number): void {
    if (!this.readonly) {
      this.rate = value;
    }
    this.hover.emit(value);
  }

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

  getFillValue(index: number): number {
    const diff = this.rate - index;

    if (diff >= 1) {
      return 100;
    }
    if (diff < 1 && diff > 0) {
      return Number.parseInt((diff * 100).toFixed(2));
    }

    return 0;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['rate']) {
      this._oldRate = this.rate;
    }
  }

  ngOnInit(): void { this.range = Array.from({length: this.max}, (v, k) => k + 1); }

  reset(): void {
    this.leave.emit(this.rate);
    this.rate = this._oldRate;
  }

  update(value: number): void {
    if (!this.readonly) {
      const newRate = getValueInRange(value, this.max, 0);

      if (this._oldRate !== newRate) {
        this._oldRate = newRate;
        this.rate = newRate;
        this.rateChange.emit(newRate);
      }
    }
  }
}
