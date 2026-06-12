import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgbRating } from '@ng-bootstrap/ng-bootstrap/rating';

@Component({
	selector: 'ngbd-rating-basic',
	imports: [NgbRating],
	changeDetection: ChangeDetectionStrategy.Eager,
	templateUrl: './rating-basic.html',
})
export class NgbdRatingBasic {
	rating = 8;
}
