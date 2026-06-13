import { Component, inject } from '@angular/core';
import {
	NgbAccordionConfig,
	NgbAccordionButton,
	NgbAccordionDirective,
	NgbAccordionItem,
	NgbAccordionHeader,
	NgbAccordionToggle,
	NgbAccordionBody,
	NgbAccordionCollapse,
} from '@ng-bootstrap/ng-bootstrap/accordion';

@Component({
	selector: 'ngbd-accordion-config',
	imports: [
		NgbAccordionButton,
		NgbAccordionDirective,
		NgbAccordionItem,
		NgbAccordionHeader,
		NgbAccordionToggle,
		NgbAccordionBody,
		NgbAccordionCollapse,
	],
	templateUrl: './accordion-config.html',
	providers: [NgbAccordionConfig],
})
export class NgbdAccordionConfig {
	constructor() {
		// customize default values of accordions used by this component tree
		inject(NgbAccordionConfig).closeOthers = true;
	}
}
