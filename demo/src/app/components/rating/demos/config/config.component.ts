import {Component} from '@angular/core';
import {NgbRatingConfig} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngbd-rating-config',
  templateUrl: './config.component.html',
  providers: [NgbRatingConfig] // add NgbRatingConfig to the component providers
})
export class RatingConfigComponent {
  constructor(config: NgbRatingConfig) {
    // customize default values of ratings used by this component tree
    config.max = 5;
    config.readonly = true;
  }
}
