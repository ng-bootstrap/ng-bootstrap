import { Component } from '@angular/core';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap/popover';
import { DatePipe } from '@angular/common';

@Component({
	selector: 'ngbd-popover-visibility',
	imports: [NgbPopover, DatePipe],
	templateUrl: './popover-visibility.html',
})
export class NgbdPopoverVisibility {
	lastShown: Date;
	lastHidden: Date;

	recordShown() {
		this.lastShown = new Date();
	}

	recordHidden() {
		this.lastHidden = new Date();
	}
}
