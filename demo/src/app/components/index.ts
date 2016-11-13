export * from './accordion';
export * from './alert';
export * from './buttons';
export * from './carousel';
export * from './collapse';
export * from './datepicker';
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
import {Routes, RouterModule} from '@angular/router';
import {JsonpModule} from '@angular/http';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {NgbdSharedModule} from '../shared';

import {NgbdAccordionModule, NgbdAccordion} from './accordion';
import {NgbdAlertModule, NgbdAlert} from './alert';
import {NgbdButtonsModule, NgbdButtons} from './buttons';
import {NgbdCarouselModule, NgbdCarousel} from './carousel';
import {NgbdCollapseModule, NgbdCollapse} from './collapse';
import {NgbdDatepickerModule, NgbdDatepicker} from './datepicker';
import {NgbdDropdownModule, NgbdDropdown} from './dropdown';
import {NgbdModalModule, NgbdModal} from './modal';
import {NgbdPaginationModule, NgbdPagination} from './pagination';
import {NgbdPopoverModule, NgbdPopover} from './popover';
import {NgbdProgressbarModule, NgbdProgressbar} from './progressbar';
import {NgbdRatingModule, NgbdRating} from './rating';
import {NgbdTabsModule, NgbdTabs} from './tabset';
import {NgbdTimepickerModule, NgbdTimepicker} from './timepicker';
import {NgbdTooltipModule, NgbdTooltip} from './tooltip';
import {NgbdTypeaheadModule, NgbdTypeahead} from './typeahead';

const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'accordion'},
  {path: 'accordion', component: NgbdAccordion},
  {path: 'alert', component: NgbdAlert},
  {path: 'buttons', component: NgbdButtons},
  {path: 'carousel', component: NgbdCarousel},
  {path: 'collapse', component: NgbdCollapse},
  {path: 'datepicker', component: NgbdDatepicker},
  {path: 'dropdown', component: NgbdDropdown},
  {path: 'modal', component: NgbdModal},
  {path: 'pagination', component: NgbdPagination},
  {path: 'popover', component: NgbdPopover},
  {path: 'progressbar', component: NgbdProgressbar},
  {path: 'rating', component: NgbdRating},
  {path: 'tabs', component: NgbdTabs},
  {path: 'timepicker', component: NgbdTimepicker},
  {path: 'tooltip', component: NgbdTooltip},
  {path: 'typeahead', component: NgbdTypeahead}
];

@NgModule({
  imports: [
    NgbdSharedModule,
    RouterModule.forChild(routes),
    NgbModule.forRoot(),
    JsonpModule,
    NgbdAccordionModule,
    NgbdAlertModule,
    NgbdButtonsModule,
    NgbdCarouselModule,
    NgbdCollapseModule,
    NgbdDatepickerModule,
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
