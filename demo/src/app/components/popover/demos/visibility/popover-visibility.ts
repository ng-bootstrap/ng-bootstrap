import { Component } from '@angular/core';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';

@Component({
	selector: 'ngbd-popover-visibility',
	standalone: true,
	imports: [NgbPopoverModule, DatePipe],
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
