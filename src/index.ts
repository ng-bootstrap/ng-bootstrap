import {NgModule} from '@angular/core';

import {NgbAccordionModule} from './accordion';
import {NgbAlertModule} from './alert';
import {NgbButtonsModule} from './buttons';
import {NgbCarouselModule} from './carousel';
import {NgbCollapseModule} from './collapse';
import {NgbDropdownModule} from './dropdown';
import {NgbPaginationModule} from './pagination';
import {NgbPopoverModule} from './popover';
import {NgbProgressbarModule} from './progressbar';
import {NgbRatingModule} from './rating';
import {NgbTabsetModule} from './tabset';
import {NgbTimepickerModule} from './timepicker';
import {NgbTooltipModule} from './tooltip';
import {NgbTypeaheadModule} from './typeahead';

export {NgbPanelChangeEvent} from './accordion';
export {NgbTabChangeEvent} from './tabset';

@NgModule({
  exports: [
    NgbAccordionModule, NgbAlertModule, NgbButtonsModule, NgbCarouselModule, NgbCollapseModule, NgbDropdownModule,
    NgbPaginationModule, NgbPopoverModule, NgbProgressbarModule, NgbRatingModule, NgbTabsetModule, NgbTimepickerModule,
    NgbTooltipModule, NgbTypeaheadModule
  ]
})
export class NgbModule {
}
