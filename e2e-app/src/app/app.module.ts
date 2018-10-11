import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {routing} from './app.routing';
import {AppComponent} from './app.component';

import {DatepickerAutoCloseComponent} from './datepicker/autoclose/datepicker-autoclose.component';
import {DatepickerFocusComponent} from './datepicker/focus/datepicker-focus.component';
import {ModalFocustrapComponent} from './modal/focustrap/modal-focustrap.component';
import {DropdownAutoCloseComponent} from './dropdown/autoclose/dropdown-autoclose.component';

@NgModule({
  declarations: [
    AppComponent,
    DatepickerAutoCloseComponent,
    DatepickerFocusComponent,
    DropdownAutoCloseComponent,
    ModalFocustrapComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    routing,
    NgbModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
