import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap/popover';

@Component({
	selector: 'ngbd-popover-delay',
	imports: [NgbPopover],
	changeDetection: ChangeDetectionStrategy.Eager,
	templateUrl: './popover-delay.html',
})
export class NgbdPopoverDelay {}
