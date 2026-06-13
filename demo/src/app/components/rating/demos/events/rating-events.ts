import { Component, signal } from '@angular/core';
import { NgbRating } from '@ng-bootstrap/ng-bootstrap/rating';

@Component({
	selector: 'ngbd-rating-events',
	imports: [NgbRating],
	templateUrl: './rating-events.html',
})
export class NgbdRatingEvents {
	readonly selected = signal(0);
	readonly hovered = signal(0);
	readonly readonly = signal(false);
}
