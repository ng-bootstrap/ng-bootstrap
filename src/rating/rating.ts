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
  @Input() private max: number = 10;
  @Input() private rate: number;
  @Input() private readonly: boolean;
  @Output() private rateChange: EventEmitter = new EventEmitter();
  @Output() private hover: EventEmitter = new EventEmitter();
  @Output() private leave: EventEmitter = new EventEmitter();
  private oldRate: number;
  private range: Array<any>;

  onInit() {
    this.oldRate = this.rate;
    this.range = this.buildTemplateObjects();
  }

  buildTemplateObjects(): Array<any> {
    let range = [];
    for (let i = 1; i <= this.max; i++) {
      range.push({title: i});
    }
    return range;
  }

  enter(value: number): void {
    if (!this.readonly) {
      this.rate = value;
    }
    this.hover.next(value);
  }

  reset(): void {
    this.leave.next(this.rate);
    this.rate = this.oldRate;
  }

  update(value: number): void {
    if (!this.readonly) {
      this.oldRate = value;
      this.rate = value;
      this.rateChange.next(value);
    }
  }
}
