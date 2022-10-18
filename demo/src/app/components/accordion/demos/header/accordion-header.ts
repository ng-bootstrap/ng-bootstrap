import { Component, ViewEncapsulation } from '@angular/core';

@Component({
	selector: 'ngbd-accordion-header',
	templateUrl: './accordion-header.html',
	encapsulation: ViewEncapsulation.None,
	styles: [
		`
			.card.disabled {
				opacity: 0.5;
			}
			.custom-header::after {
				content: none;
			}
		`,
	],
})
export class NgbdAccordionHeader {
	disabled = false;
}
