import {Component} from '@angular/core';

import {NgbRating} from '@ng-bootstrap/rating';

@Component({
  selector: 'ngbd-rating-basic',
  template: require('./basic.component.html'),
  directives: [NgbRating]
})
export class RatingBasicComponent {
  currentRate = 8;
}
