import { Component } from '@angular/core';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap/alert';
import {
	NgbAccordionButton,
	NgbAccordionDirective,
	NgbAccordionItem,
	NgbAccordionHeader,
	NgbAccordionToggle,
	NgbAccordionBody,
	NgbAccordionCollapse,
} from '@ng-bootstrap/ng-bootstrap/accordion';

@Component({
	selector: 'ngbd-accordion-keep-content',
	imports: [
		NgbAccordionButton,
		NgbAccordionDirective,
		NgbAccordionItem,
		NgbAccordionHeader,
		NgbAccordionToggle,
		NgbAccordionBody,
		NgbAccordionCollapse,
		NgbAlert,
	],
	templateUrl: './accordion-keep-content.html',
})
export class NgbdAccordionKeepContent {
	remove = true;
}
