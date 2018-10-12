import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {routing} from './app.routing';
import {AppComponent} from './app.component';

import {DatepickerAutoCloseComponent} from './datepicker/autoclose/datepicker-autoclose.component';
import {DatepickerFocusComponent} from './datepicker/focus/datepicker-focus.component';
import {DropdownAutoCloseComponent} from './dropdown/autoclose/dropdown-autoclose.component';
import {ModalFocustrapComponent} from './modal/focustrap/modal-focustrap.component';
import {TooltipAutocloseComponent} from './tooltip/autoclose/tooltip-autoclose.component';
import {TypeaheadFocusComponent} from './typeahead/focus/typeahead-focus.component';

@NgModule({
  declarations: [
    AppComponent,
    DatepickerAutoCloseComponent,
    DatepickerFocusComponent,
    DropdownAutoCloseComponent,
    ModalFocustrapComponent,
    TooltipAutocloseComponent,
    TypeaheadFocusComponent
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
