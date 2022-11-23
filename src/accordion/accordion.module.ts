import { NgModule } from '@angular/core';

import { NgbAccordion, NgbPanel, NgbPanelContent, NgbPanelHeader, NgbPanelTitle, NgbPanelToggle } from './accordion';

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
export { NgbAccordionConfig } from './accordion-config';

const NGB_ACCORDION_DIRECTIVES = [
	NgbAccordion,
	NgbPanel,
	NgbPanelTitle,
	NgbPanelContent,
	NgbPanelHeader,
	NgbPanelToggle,
];

@NgModule({
	imports: NGB_ACCORDION_DIRECTIVES,
	exports: NGB_ACCORDION_DIRECTIVES,
})
export class NgbAccordionModule {}
