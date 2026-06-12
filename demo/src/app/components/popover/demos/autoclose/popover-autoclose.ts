import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap/popover';

@Component({
	selector: 'ngbd-popover-autoclose',
	imports: [NgbPopover],
	changeDetection: ChangeDetectionStrategy.Eager,
	templateUrl: './popover-autoclose.html',
})
export class NgbdPopoverAutoclose {}
