import { Component } from '@angular/core';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'ngbd-accordion-static',
	standalone: true,
	imports: [NgbAccordionModule],
	templateUrl: './accordion-static.html',
})
export class NgbdAccordionStatic {}
