import { Component, ViewEncapsulation } from '@angular/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'ngbd-tooltip-customclass',
	standalone: true,
	imports: [NgbTooltipModule],
	templateUrl: './tooltip-customclass.html',
	encapsulation: ViewEncapsulation.None,
	styles: [
		`
			.my-custom-class .tooltip-inner {
				background-color: darkgreen;
				font-size: 125%;
			}
			.my-custom-class.bs-tooltip-end .tooltip-arrow::before {
				border-right-color: darkgreen;
			}
			.my-custom-class.bs-tooltip-start .tooltip-arrow::before {
				border-left-color: darkgreen;
			}
			.my-custom-class.bs-tooltip-top .tooltip-arrow::before {
				border-top-color: darkgreen;
			}
			.my-custom-class.bs-tooltip-bottom .tooltip-arrow::before {
				border-bottom-color: darkgreen;
			}
		`,
	],
})
export class NgbdTooltipCustomclass {}
