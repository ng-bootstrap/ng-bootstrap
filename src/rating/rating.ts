import {Component, ChangeDetectionStrategy, Input, Output, EventEmitter, OnInit, TemplateRef} from '@angular/core';
import {NgbRatingConfig} from './rating-config';

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
  template: `
    <template #t let-fill="fill">{{ fill === 100 ? '&#9733;' : '&#9734;' }}</template>
    <span tabindex="0" (mouseleave)="reset()" aria-valuemin="0" [attr.aria-valuemax]="max" [attr.aria-valuenow]="rate">
      <template ngFor let-r [ngForOf]="range" let-index="index">
        <span class="sr-only">({{ index < rate ? '*' : ' ' }})</span>
        <span (mouseenter)="enter(index + 1)" (click)="update(index + 1)" [title]="r.title" 
        [attr.aria-valuetext]="r.title" 
        [style.cursor]="readonly ? 'not-allowed' : 'pointer'">
          <template [ngTemplateOutlet]="starTemplate || t" [ngOutletContext]="{fill: index < rate ? 100 : 0}"></template>
        </span>
      </template>
    </span>
  `
})
export class NgbRating implements OnInit {
  private _oldRate: number;
  range: number[] = [];

  /**
   * Maximal rating that can be given using this widget.
   */
  @Input() max: number;

  /**
   * Current rating.
   */
  @Input() rate: number;

  /**
   * A flag indicating if rating can be updated.
   */
  @Input() readonly: boolean;

  /**
   * A template to override star display
   */
  @Input() starTemplate: TemplateRef<StarTemplateContext>;

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

  enter(value: number): void {
    if (!this.readonly) {
      this.rate = value;
    }
    this.hover.emit(value);
  }

  ngOnInit(): void {
    this._oldRate = this.rate;
    this.range = this._buildTemplateObjects();
  }

  reset(): void {
    this.leave.emit(this.rate);
    this.rate = this._oldRate;
  }

  update(value: number): void {
    if (!this.readonly) {
      this._oldRate = value;
      this.rate = value;
      this.rateChange.emit(value);
    }
  }

  private _buildTemplateObjects(): number[] {
    let range = [];
    for (let i = 1; i <= this.max; i++) {
      range.push({title: i});
    }
    return range;
  }
}

export const NGB_RATING_DIRECTIVES = [NgbRating];
