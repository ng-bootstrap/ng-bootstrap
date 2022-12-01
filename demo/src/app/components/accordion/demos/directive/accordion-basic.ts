import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'ngbd-accordion-basic',
	standalone: true,
	imports: [CommonModule, NgbAccordionModule],
	templateUrl: './accordion-basic.html',
})
export class NgbdAccordionBasicDirective {
	logEvent($event) {
		console.log($event);
	}

	doh1 = false;
	customId = '0';
}
