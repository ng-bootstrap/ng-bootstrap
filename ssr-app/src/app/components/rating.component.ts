import { Component } from '@angular/core';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'rating-component',
	imports: [NgbRatingModule],
	styles: `
		.star {
			position: relative;
			display: inline-block;
			font-size: 3rem;
			color: #d3d3d3;
		}
		.full {
			color: red;
		}
		.half {
			position: absolute;
			display: inline-block;
			overflow: hidden;
			color: red;
		}
	`,
	template: `
		<ng-template #t let-fill="fill">
			<span class="star" [class.full]="fill === 100">
				<span class="half" [style.width.%]="fill">&hearts;</span>&hearts;
			</span>
		</ng-template>

		<ngb-rating [(rate)]="currentRate" [starTemplate]="t" [readonly]="true" [max]="5"></ngb-rating>
	`,
})
export class RatingComponent {
	currentRate = 3.14;
}
