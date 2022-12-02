import { Component } from '@angular/core';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'ngbd-popover-tplwithcontext',
	standalone: true,
	imports: [NgbPopoverModule],
	templateUrl: './popover-tplwithcontext.html',
})
export class NgbdPopoverTplwithcontext {
	name = 'World';

	toggleWithGreeting(popover, greeting: string, language: string) {
		if (popover.isOpen()) {
			popover.close();
		} else {
			popover.open({ greeting, language });
		}
	}
}
