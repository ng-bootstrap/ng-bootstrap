import {Component, ChangeDetectionStrategy, Input, Output, EventEmitter, OnInit} from '@angular/core';

@Component({
  selector: 'ngb-rating',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span tabindex="0" (mouseleave)="reset()" aria-valuemin="0" [attr.aria-valuemax]="max" [attr.aria-valuenow]="rate">
      <template ngFor let-r [ngForOf]="range" let-index="index">
        <span class="sr-only">({{ index < rate ? '*' : ' ' }})</span>
        <i class="glyphicon {{index < rate ? 'glyphicon-star' : 'glyphicon-star-empty'}}" (mouseenter)="enter(index + 1)"
          (click)="update(index + 1)" [title]="r.title" [attr.aria-valuetext]="r.title"></i>
      </template>
    </span>
  `
})
export class NgbRating implements OnInit {
  private _oldRate: number;
  range: number[] = [];

  @Input() max: number = 10;
  @Input() rate: number;
  @Input() readonly: boolean;

  @Output() hover = new EventEmitter<number>();
  @Output() leave = new EventEmitter<number>();
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
