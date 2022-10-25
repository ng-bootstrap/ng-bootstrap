import { Component } from '@angular/core';

@Component({
	selector: 'ngbd-rating-decimal',
	templateUrl: './rating-decimal.html',
	styles: [
		`
			i {
				position: relative;
				display: inline-block;
				font-size: 2.5rem;
				padding-right: 0.1rem;
				color: #d3d3d3;
			}

			.filled {
				color: red;
				overflow: hidden;
				position: absolute;
				top: 0;
				left: 0;
			}
		`,
	],
})
export class NgbdRatingDecimal {
	currentRate = 3.14;
}
