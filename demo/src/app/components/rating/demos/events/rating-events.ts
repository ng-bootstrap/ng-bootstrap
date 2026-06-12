import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgbRating } from '@ng-bootstrap/ng-bootstrap/rating';

@Component({
	selector: 'ngbd-rating-events',
	imports: [NgbRating],
	changeDetection: ChangeDetectionStrategy.Eager,
	templateUrl: './rating-events.html',
})
export class NgbdRatingEvents {
	selected = 0;
	hovered = 0;
	readonly = false;
}
