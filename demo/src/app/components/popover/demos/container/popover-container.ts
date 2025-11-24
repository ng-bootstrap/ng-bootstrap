import { Component } from '@angular/core';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap/popover';

@Component({
	selector: 'ngbd-popover-container',
	imports: [NgbPopover],
	templateUrl: './popover-container.html',
	styles: `
			.card {
				overflow: hidden;
			}
		`,
})
export class NgbdPopoverContainer {}
