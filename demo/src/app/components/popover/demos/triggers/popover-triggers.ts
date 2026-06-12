import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap/popover';

@Component({
	selector: 'ngbd-popover-triggers',
	imports: [NgbPopover],
	changeDetection: ChangeDetectionStrategy.Eager,
	templateUrl: './popover-triggers.html',
})
export class NgbdPopoverTriggers {}
