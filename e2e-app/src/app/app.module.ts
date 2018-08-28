import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {routing} from './app.routing';
import {AppComponent} from './app.component';

import {DatepickerFocustrapComponent} from './datepicker/focustrap/datepicker-focustrap.component';
import {ModalFocustrapComponent} from './modal/focustrap/modal-focustrap.component';

@NgModule({
  declarations: [
    AppComponent,
    DatepickerFocustrapComponent,
    ModalFocustrapComponent
  ],
  imports: [
    BrowserModule,
    routing,
    NgbModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
