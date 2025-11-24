import { Component } from '@angular/core';
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
	selector: 'ngbd-accordion-basic',
	imports: [
		NgbAccordionButton,
		NgbAccordionDirective,
		NgbAccordionItem,
		NgbAccordionHeader,
		NgbAccordionToggle,
		NgbAccordionBody,
		NgbAccordionCollapse,
	],
	templateUrl: './accordion-basic.html',
})
export class NgbdAccordionBasic {}
