import { InjectionToken, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { routing } from './app.routing';
import { NgbdAccordionModule } from './components/accordion/accordion.module';
import { NgbdAlertModule } from './components/alert/alert.module';
import { NgbdButtonsModule } from './components/buttons/buttons.module';
import { NgbdCarouselModule } from './components/carousel/carousel.module';
import { NgbdCollapseModule } from './components/collapse/collapse.module';
import { NgbdDatepickerModule } from './components/datepicker/datepicker.module';
import { NgbdDropdownModule } from './components/dropdown/dropdown.module';
import { NgbdModalModule } from './components/modal/modal.module';
import { NgbdPaginationModule } from './components/pagination/pagination.module';
import { NgbdPopoverModule } from './components/popover/popover.module';
import { NgbdProgressbarModule } from './components/progressbar/progressbar.module';
import { NgbdRatingModule } from './components/rating/rating.module';
import { NgbdTabsetModule } from './components/tabset/tabset.module';
import { NgbdTimepickerModule } from './components/timepicker/timepicker.module';
import { NgbdTooltipModule } from './components/tooltip/tooltip.module';
import { NgbdTypeaheadModule } from './components/typeahead/typeahead.module';
import { DefaultComponent } from './default';
import { GettingStarted } from './getting-started';
import { NgbdSharedModule } from './shared';

const DEMOS = [
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
  NgbdTabsetModule,
  NgbdTimepickerModule,
  NgbdTooltipModule,
  NgbdTypeaheadModule
];

@NgModule({
  declarations: [
    AppComponent,
    DefaultComponent,
    GettingStarted
  ],
  imports: [
    BrowserModule,
    routing,
    NgbModule,
    NgbdSharedModule,
    ...DEMOS
  ],
  bootstrap: [AppComponent]
})
export class NgbdModule {
}
