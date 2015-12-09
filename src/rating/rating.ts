import {Component, Input, Output, NgFor, EventEmitter, OnInit} from 'angular2/angular2';

@Component({
  selector: 'ngb-rating',
  template: `
    <span tabindex="0" (mouseleave)="reset()" aria-valuemin="0" [attr.aria-valuemax]="max" [attr.aria-valuenow]="rate">
      <template ng-for #r [ng-for-of]="range" #index="index">
        <span class="sr-only">({{ index < rate ? '*' : ' ' }})</span>
        <i class="glyphicon {{index < rate ? 'glyphicon-star' : 'glyphicon-star-empty'}}" (mouseenter)="enter(index + 1)" (click)="update(index + 1)" [title]="r.title" [attr.aria-valuetext]="r.title"></i>
      </template>
    </span>
  `,
  directives: [NgFor]
})
export class NgbRating implements OnInit {
  private _oldRate: number;
  range: number[] = [];

  @Input() max = 10;
  @Input() rate: number;
  @Input() readonly: boolean;

  @Output() hover = new EventEmitter<number>();
  @Output() leave = new EventEmitter<number>();
  @Output() rateChange = new EventEmitter<number>();

  enter(value: number): void {
    if (!this.readonly) {
      this.rate = value;
    }
    this.hover.next(value);
  }

  ngOnInit(): void {
    this._oldRate = this.rate;
    this.range = this._buildTemplateObjects();
  }

  reset(): void {
    this.leave.next(this.rate);
    this.rate = this._oldRate;
  }

  update(value: number): void {
    if (!this.readonly) {
      this._oldRate = value;
      this.rate = value;
      this.rateChange.next(value);
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
