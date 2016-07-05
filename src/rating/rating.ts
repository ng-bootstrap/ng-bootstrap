import {Component, ChangeDetectionStrategy, Input, Output, EventEmitter, OnInit} from '@angular/core';

/**
 * Rating directive that will take care of visualising a star rating bar.
 */
@Component({
  selector: 'ngb-rating',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span tabindex="0" (mouseleave)="reset()" aria-valuemin="0" [attr.aria-valuemax]="max" [attr.aria-valuenow]="rate">
      <template ngFor let-r [ngForOf]="range" let-index="index">
        <span class="sr-only">({{ index < rate ? '*' : ' ' }})</span>
        <span (mouseenter)="enter(index + 1)" (click)="update(index + 1)" [title]="r.title" 
        [attr.aria-valuetext]="r.title">{{ index < rate ? '&#9733;' : '&#9734;' }}</span>
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
  @Input() max: number = 10;

  /**
   * Current rating.
   */
  @Input() rate: number;

  /**
   * A flag indicating if rating can be updated.
   */
  @Input() readonly = false;

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
