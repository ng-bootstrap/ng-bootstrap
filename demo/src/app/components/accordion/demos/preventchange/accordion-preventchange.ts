import { Component } from '@angular/core';
import { NgbAccordionModule, NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'ngbd-accordion-preventchange',
	standalone: true,
	imports: [NgbAccordionModule],
	templateUrl: './accordion-preventchange.html',
})
export class NgbdAccordionPreventchange {
	public beforeChange($event: NgbPanelChangeEvent) {
		if ($event.panelId === 'preventchange-2') {
			$event.preventDefault();
		}

		if ($event.panelId === 'preventchange-3' && $event.nextState === false) {
			$event.preventDefault();
		}
	}
}
