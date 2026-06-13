import { Component, signal } from '@angular/core';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap/popover';
import { DatePipe } from '@angular/common';

@Component({
	selector: 'ngbd-popover-visibility',
	imports: [NgbPopover, DatePipe],
	templateUrl: './popover-visibility.html',
})
export class NgbdPopoverVisibility {
	readonly lastShown = signal<Date | null>(null);
	readonly lastHidden = signal<Date | null>(null);

	recordShown() {
		this.lastShown.set(new Date());
	}

	recordHidden() {
		this.lastHidden.set(new Date());
	}
}
