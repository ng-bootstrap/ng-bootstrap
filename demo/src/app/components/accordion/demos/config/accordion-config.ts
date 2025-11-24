import { Component } from '@angular/core';
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
	constructor(config: NgbAccordionConfig) {
		// customize default values of accordions used by this component tree
		config.closeOthers = true;
	}
}
