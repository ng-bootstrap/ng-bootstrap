import { NgModule } from '@angular/core';
import {
	NgbAccordionBody,
	NgbAccordionCollapse,
	NgbAccordionDirective,
	NgbAccordionHeader,
	NgbAccordionItem,
	NgbAccordionToggle,
} from './accordion-directives';

export {
	NgbAccordionBody,
	NgbAccordionCollapse,
	NgbAccordionDirective,
	NgbAccordionHeader,
	NgbAccordionItem,
	NgbAccordionToggle,
} from './accordion-directives';

@NgModule({
	imports: [
		NgbAccordionDirective,
		NgbAccordionItem,
		NgbAccordionHeader,
		NgbAccordionCollapse,
		NgbAccordionToggle,
		NgbAccordionBody,
	],
	exports: [
		NgbAccordionDirective,
		NgbAccordionItem,
		NgbAccordionHeader,
		NgbAccordionCollapse,
		NgbAccordionToggle,
		NgbAccordionBody,
	],
})
export class AccordionDirectivesModule {}
