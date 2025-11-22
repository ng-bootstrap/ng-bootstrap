import { NgModule } from '@angular/core';

import {
	NgbAccordionDirective,
	NgbAccordionItem,
	NgbAccordionHeader,
	NgbAccordionToggle,
	NgbAccordionBody,
	NgbAccordionCollapse,
	NgbAccordionButton,
} from './accordion.directive';

export {
	NgbAccordionButton,
	NgbAccordionDirective,
	NgbAccordionItem,
	NgbAccordionHeader,
	NgbAccordionToggle,
	NgbAccordionBody,
	NgbAccordionCollapse,
} from './accordion.directive';
export { NgbAccordionConfig } from './accordion-config';

const NGB_ACCORDION_DIRECTIVES = [
	NgbAccordionButton,
	NgbAccordionDirective,
	NgbAccordionItem,
	NgbAccordionHeader,
	NgbAccordionToggle,
	NgbAccordionBody,
	NgbAccordionCollapse,
];

@NgModule({
	imports: NGB_ACCORDION_DIRECTIVES,
	exports: NGB_ACCORDION_DIRECTIVES,
})
export class NgbAccordionModule {}
