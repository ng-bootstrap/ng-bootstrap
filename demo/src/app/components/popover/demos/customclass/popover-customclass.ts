import { Component, ViewEncapsulation } from '@angular/core';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap/popover';

@Component({
	selector: 'ngbd-popover-customclass',
	imports: [NgbPopover],
	templateUrl: './popover-customclass.html',
	encapsulation: ViewEncapsulation.None,
	styles: `
		.my-custom-class {
			background: aliceblue;
			font-size: 125%;
		}
		.my-custom-class .arrow::after {
			border-top-color: aliceblue;
		}
	`,
})
export class NgbdPopoverCustomclass {}
