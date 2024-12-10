import { Component } from '@angular/core';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'ngbd-accordion-static',
	imports: [NgbAccordionModule],
	templateUrl: './accordion-static.html',
})
export class NgbdAccordionStatic {
	items = ['First', 'Second', 'Third'];
}
