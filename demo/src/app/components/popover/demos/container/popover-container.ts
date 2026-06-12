import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap/popover';

@Component({
	selector: 'ngbd-popover-container',
	imports: [NgbPopover],
	templateUrl: './popover-container.html',
	changeDetection: ChangeDetectionStrategy.Eager,
	styles: `
		.card {
			overflow: hidden;
		}
	`,
})
export class NgbdPopoverContainer {}
