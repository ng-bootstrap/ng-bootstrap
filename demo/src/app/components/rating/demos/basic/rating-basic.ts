import { Component } from '@angular/core';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'ngbd-rating-basic',
	standalone: true,
	imports: [NgbRatingModule],
	templateUrl: './rating-basic.html',
})
export class NgbdRatingBasic {
	currentRate = 8;
}
