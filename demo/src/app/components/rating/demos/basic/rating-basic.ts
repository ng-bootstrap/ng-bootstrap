import { Component } from '@angular/core';
import { NgbRating } from '@ng-bootstrap/ng-bootstrap/rating';

@Component({
	selector: 'ngbd-rating-basic',
	imports: [NgbRating],
	templateUrl: './rating-basic.html',
})
export class NgbdRatingBasic {
	rating = 8;
}
