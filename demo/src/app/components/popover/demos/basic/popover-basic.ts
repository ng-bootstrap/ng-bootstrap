import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap/popover';

@Component({
	selector: 'ngbd-popover-basic',
	imports: [NgbPopover],
	templateUrl: './popover-basic.html',
	changeDetection: ChangeDetectionStrategy.Eager,
	host: { class: 'd-block' },
})
export class NgbdPopoverBasic {}
