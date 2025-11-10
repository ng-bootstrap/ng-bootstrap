import { Component } from '@angular/core';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap/rating';

@Component({
	selector: 'ngbd-rating-events',
	imports: [NgbRatingModule],
	templateUrl: './rating-events.html',
})
export class NgbdRatingEvents {
	selected = 0;
	hovered = 0;
	readonly = false;
}
