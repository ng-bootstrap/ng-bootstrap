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
	closeOthers = true;
	collapsed = true;
	log = console.log;
}
