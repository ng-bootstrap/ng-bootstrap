import { Component } from '@angular/core';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap/alert';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap/accordion';

@Component({
	selector: 'ngbd-accordion-keep-content',
	imports: [NgbAccordionModule, NgbAlertModule],
	templateUrl: './accordion-keep-content.html',
})
export class NgbdAccordionKeepContent {
	remove = true;
}
