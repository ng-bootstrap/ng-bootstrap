import { Component } from '@angular/core';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'ngbd-rating-events',
	standalone: true,
	imports: [NgbRatingModule],
	templateUrl: './rating-events.html',
})
export class NgbdRatingEvents {
	selected = 0;
	hovered = 0;
	readonly = false;
}
