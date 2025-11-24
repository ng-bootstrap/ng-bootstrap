import { Component } from '@angular/core';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap/popover';

@Component({
	selector: 'ngbd-popover-basic',
	imports: [NgbPopover],
	templateUrl: './popover-basic.html',
	host: { class: 'd-block' },
})
export class NgbdPopoverBasic {}
