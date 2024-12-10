import { Component } from '@angular/core';
import { NgbRatingConfig, NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'ngbd-rating-config',
	imports: [NgbRatingModule],
	templateUrl: './rating-config.html',
	providers: [NgbRatingConfig],
})
export class NgbdRatingConfig {
	constructor(config: NgbRatingConfig) {
		// customize default values of ratings used by this component tree
		config.max = 5;
		config.readonly = true;
	}
}
