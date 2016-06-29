import { Component } from '@angular/core';

import { NgbRating } from '@ng-bootstrap/rating';

@Component({
  selector: 'ngbd-rating-basic',
  template: require('./basic.component.html'),
  directives: [NgbRating]
})
export class RatingBasicComponent {
  firstDisabled = false;
  isOpen = false;
  isReadOnly = false;
  x = 4;
  y = 2;
  max = 10;
  overStar: number = null;
  percent = 0;
  rate = 7;

  hoveringOver(value: number) {
    this.overStar = value;
    this.percent = 100 * value / this.max;
  }
}
