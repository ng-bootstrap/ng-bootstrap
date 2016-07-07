import {Component} from '@angular/core';

import {NGB_RATING_DIRECTIVES} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngbd-rating-basic',
  template: require('./basic.component.html'),
  directives: [NGB_RATING_DIRECTIVES]
})
export class RatingBasicComponent {
  currentRate = 8;
}
