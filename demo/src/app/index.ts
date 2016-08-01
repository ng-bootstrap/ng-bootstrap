import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {JsonpModule} from '@angular/http';

import {Angulartics2, Angulartics2On} from 'angulartics2';
import {Angulartics2GoogleAnalytics} from 'angulartics2/src/providers/angulartics2-google-analytics';
import {Angulartics} from './angulartics2.workaround';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {
  NgbdAccordion,
  NgbdAlert,
  NgbdButtons,
  NgbdCarousel,
  NgbdCollapse,
  NgbdDropdown,
  NgbdModal,
  NgbdPagination,
  NgbdPopover,
  NgbdProgressbar,
  NgbdRating,
  NgbdTabs,
  NgbdTimepicker,
  NgbdTooltip,
  NgbdTypeahead
} from './components';

import {DefaultComponent} from './default';
import {GettingStarted} from './getting-started';
import {ContentWrapper, SideNavComponent} from './shared';
import {AppComponent} from './app.component';
import {routing} from './app.routing';

@NgModule({
  declarations: [
    AppComponent,
    DefaultComponent,
    GettingStarted,
    NgbdAccordion,
    NgbdAlert,
    NgbdButtons,
    NgbdCarousel,
    NgbdCollapse,
    NgbdDropdown,
    NgbdModal,
    NgbdPagination,
    NgbdPopover,
    NgbdProgressbar,
    NgbdRating,
    NgbdTabs,
    NgbdTimepicker,
    NgbdTooltip,
    NgbdTypeahead,
    ContentWrapper,
    SideNavComponent,
    Angulartics2On
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    JsonpModule,
    routing,
    NgbModule
  ],
  providers: [
    {provide: Angulartics2, useClass: Angulartics},
    Angulartics2GoogleAnalytics],
  bootstrap: [AppComponent]
})
export class NgbdModule {
}
