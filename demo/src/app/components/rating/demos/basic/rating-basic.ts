import { Component, signal } from '@angular/core';
import { NgbRating } from '@ng-bootstrap/ng-bootstrap/rating';

@Component({
	selector: 'ngbd-rating-basic',
	imports: [NgbRating],
	templateUrl: './rating-basic.html',
})
export class NgbdRatingBasic {
	readonly rating = signal(8);
}
