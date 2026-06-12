import { Component, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import {
	NgbAccordionDirective,
	NgbAccordionItem,
	NgbAccordionHeader,
	NgbAccordionToggle,
	NgbAccordionBody,
	NgbAccordionCollapse,
} from '@ng-bootstrap/ng-bootstrap/accordion';

@Component({
	selector: 'ngbd-accordion-header',
	imports: [
		NgbAccordionDirective,
		NgbAccordionItem,
		NgbAccordionHeader,
		NgbAccordionToggle,
		NgbAccordionBody,
		NgbAccordionCollapse,
	],
	templateUrl: './accordion-header.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.Eager,
	styles: `
		.custom-header::after {
			content: none;
		}
	`,
})
export class NgbdAccordionHeader {}
