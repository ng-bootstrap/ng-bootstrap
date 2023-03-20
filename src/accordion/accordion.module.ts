import { NgModule } from '@angular/core';

import { NgbAccordion, NgbPanel, NgbPanelContent, NgbPanelHeader, NgbPanelTitle, NgbPanelToggle } from './accordion';
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
	NgbAccordion,
	NgbPanel,
	NgbPanelTitle,
	NgbPanelContent,
	NgbPanelChangeEvent,
	NgbPanelHeader,
	NgbPanelHeaderContext,
	NgbPanelToggle,
} from './accordion';

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
	NgbAccordion,
	NgbPanel,
	NgbPanelTitle,
	NgbPanelContent,
	NgbPanelHeader,
	NgbPanelToggle,
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
