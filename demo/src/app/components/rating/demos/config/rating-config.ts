import { Component, inject } from '@angular/core';
import { NgbRatingConfig, NgbRating } from '@ng-bootstrap/ng-bootstrap/rating';

@Component({
	selector: 'ngbd-rating-config',
	imports: [NgbRating],
	templateUrl: './rating-config.html',
	providers: [NgbRatingConfig],
})
export class NgbdRatingConfig {
	constructor() {
		// customize default values of ratings used by this component tree
		const config = inject(NgbRatingConfig);
		config.max = 5;
		config.readonly = true;
	}
}
