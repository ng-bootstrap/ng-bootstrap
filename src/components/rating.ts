import {Component, View, NgFor, NgClass, EventEmitter, OnInit} from 'angular2/angular2';

@Component({
  selector: 'ngb-rating',
  inputs: ['max', 'rate', 'readonly'],
  outputs: ['updateRating: rate', 'onHover', 'onLeave']
})
@View({
  template: `
    <span tabindex="0" (mouseleave)="reset()" aria-valuemin="0" [attr.aria-valuemax]="max" [attr.aria-valuenow]="rate">
      <template ng-for #r [ng-for-of]="range" #index="index">
        <span class="sr-only">({{ index < rate ? '*' : ' ' }})</span>
        <i class="glyphicon" (mouseenter)="hover(index + 1)" (click)="update(index + 1)" [ng-class]="index < rate ? 'glyphicon-star' : 'glyphicon-star-empty'" [title]="r.title" [attr.aria-valuetext]="r.title"></i>
      </template>
    </span>
  `,
  directives: [NgFor, NgClass]
})
export class NgbRating implements OnInit {
  private max: number = 10;
  private oldRate: number;
  private range: Array<any>;
  private rate: number;
  private readonly: boolean;
  private updateRating: EventEmitter = new EventEmitter();
  private onHover: EventEmitter = new EventEmitter();
  private onLeave: EventEmitter = new EventEmitter();

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

  hover(value: number): void {
    if (!this.readonly) {
      this.rate = value;
    }
    this.onHover.next(value);
  }

  reset(): void {
    // I feel like sending the hovered value on leave.
    this.onLeave.next(this.rate);
    this.rate = this.oldRate;
  }

  update(value: number): void {
    if (!this.readonly) {
      this.oldRate = value;
      this.rate = value;
      this.updateRating.next(value);
    }
  }
}
