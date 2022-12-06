import { Component } from '@angular/core';
import { AccordionDirectivesModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'ngbd-accordion-basic',
	standalone: true,
	imports: [AccordionDirectivesModule],
	templateUrl: './accordion-basic.html',
})
export class NgbdAccordionBasic {
	animation = true;
	activeIds: string[] | string = '1,3';
	closeOthers = false;
	collapsed = true;
	log = console.log;

	updateActiveIds() {
		this.activeIds = [
			...new Set(
				Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => `${Math.floor(Math.random() * 3) + 1}`),
			),
		];
		console.log(this.activeIds);
	}
}
