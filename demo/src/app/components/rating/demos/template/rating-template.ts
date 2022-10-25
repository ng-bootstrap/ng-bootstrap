import { Component } from '@angular/core';

@Component({
	selector: 'ngbd-rating-template',
	templateUrl: './rating-template.html',
	styles: [
		`
			i {
				font-size: 1.5rem;
				padding-right: 0.1rem;
				color: #b0c4de;
			}
			.filled {
				color: #1e90ff;
			}
			.low {
				color: #deb0b0;
			}
			.filled.low {
				color: #ff1e1e;
			}
		`,
	],
})
export class NgbdRatingTemplate {
	currentRate = 6;
}
