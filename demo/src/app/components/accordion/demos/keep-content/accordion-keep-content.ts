import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgbAccordionModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'ngbd-accordion-keep-content',
	standalone: true,
	imports: [CommonModule, NgbAccordionModule, NgbAlertModule],
	templateUrl: './accordion-keep-content.html',
})
export class NgbdAccordionKeepContent {
	remove = true;
}
