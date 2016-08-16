export * from './accordion';
export * from './alert';
export * from './buttons';
export * from './carousel';
export * from './collapse';
export * from './dropdown';
export * from './modal';
export * from './pagination';
export * from './popover';
export * from './progressbar';
export * from './rating';
export * from './tabset';
export * from './timepicker';
export * from './tooltip';
export * from './typeahead';

import {NgModule} from '@angular/core';

import {NgbdSharedModule} from '../shared';

import {NgbdAccordionModule} from './accordion';
import {NgbdAlertModule} from './alert';
import {NgbdButtonsModule} from './buttons';
import {NgbdCarouselModule} from './carousel';
import {NgbdCollapseModule} from './collapse';
import {NgbdDropdownModule} from './dropdown';
import {NgbdModalModule} from './modal';
import {NgbdPaginationModule} from './pagination';
import {NgbdPopoverModule} from './popover';
import {NgbdProgressbarModule} from './progressbar';
import {NgbdRatingModule} from './rating';
import {NgbdTabsModule} from './tabset';
import {NgbdTimepickerModule} from './timepicker';
import {NgbdTooltipModule} from './tooltip';
import {NgbdTypeaheadModule} from './typeahead';

@NgModule({
  imports: [
    NgbdSharedModule,
    NgbdAccordionModule,
    NgbdAlertModule,
    NgbdButtonsModule,
    NgbdCarouselModule,
    NgbdCollapseModule,
    NgbdDropdownModule,
    NgbdModalModule,
    NgbdPaginationModule,
    NgbdPopoverModule,
    NgbdProgressbarModule,
    NgbdRatingModule,
    NgbdTabsModule,
    NgbdTimepickerModule,
    NgbdTooltipModule,
    NgbdTypeaheadModule
  ],
  exports: [
    NgbdAccordionModule,
    NgbdAlertModule,
    NgbdButtonsModule,
    NgbdCarouselModule,
    NgbdCollapseModule,
    NgbdDropdownModule,
    NgbdModalModule,
    NgbdPaginationModule,
    NgbdPopoverModule,
    NgbdProgressbarModule,
    NgbdRatingModule,
    NgbdTabsModule,
    NgbdTimepickerModule,
    NgbdTooltipModule,
    NgbdTypeaheadModule
  ]
})
export class NgbdDemoModule {}
