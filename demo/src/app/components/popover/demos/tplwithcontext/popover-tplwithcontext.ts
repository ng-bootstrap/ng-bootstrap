import { Component } from '@angular/core';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap/popover';

@Component({
	selector: 'ngbd-popover-tplwithcontext',
	imports: [NgbPopover],
	templateUrl: './popover-tplwithcontext.html',
})
export class NgbdPopoverTplwithcontext {
	name = 'World';

	toggleWithGreeting(popover: NgbPopover, greeting: string, language: string) {
		if (popover.isOpen()) {
			popover.close();
		} else {
			popover.open({ greeting, language });
		}
	}
}
