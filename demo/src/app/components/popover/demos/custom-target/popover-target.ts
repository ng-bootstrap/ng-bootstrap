import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap/popover';

@Component({
	selector: 'ngbd-popover-target',
	imports: [NgbPopover],
	changeDetection: ChangeDetectionStrategy.Eager,
	templateUrl: './popover-target.html',
})
export class NgbdPopoverTarget {}
