import { Component, ViewEncapsulation } from '@angular/core';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'ngbd-popover-customclass',
	standalone: true,
	imports: [NgbPopoverModule],
	templateUrl: './popover-customclass.html',
	encapsulation: ViewEncapsulation.None,
	styles: [
		`
			.my-custom-class {
				background: aliceblue;
				font-size: 125%;
			}
			.my-custom-class .arrow::after {
				border-top-color: aliceblue;
			}
		`,
	],
})
export class NgbdPopoverCustomclass {}
