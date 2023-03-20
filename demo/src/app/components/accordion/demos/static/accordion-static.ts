import { Component } from '@angular/core';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'ngbd-accordion-static',
	standalone: true,
	imports: [CommonModule, NgbAccordionModule],
	templateUrl: './accordion-static.html',
})
export class NgbdAccordionStatic {
	panels = ['First', 'Second', 'Third'];
}
