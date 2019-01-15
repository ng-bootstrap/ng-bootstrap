import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {routing} from './app.routing';
import {AppComponent} from './app.component';
import {NavigationComponent} from './navigation.component';

import {DatepickerAutoCloseComponent} from './datepicker/autoclose/datepicker-autoclose.component';
import {DatepickerFocusComponent} from './datepicker/focus/datepicker-focus.component';
import {DropdownAutoCloseComponent} from './dropdown/autoclose/dropdown-autoclose.component';
import {ModalFocusComponent} from './modal/focus/modal-focus.component';
import {PopoverAutocloseComponent} from './popover/autoclose/popover-autoclose.component';
import {TooltipAutocloseComponent} from './tooltip/autoclose/tooltip-autoclose.component';
import {TooltipPositionComponent} from './tooltip/position/tooltip-position.component';
import {TypeaheadAutoCloseComponent} from './typeahead/autoclose/typeahead-autoclose.component';
import {TypeaheadFocusComponent} from './typeahead/focus/typeahead-focus.component';
import {TypeaheadValidationComponent} from './typeahead/validation/typeahead-validation.component';

@NgModule({
  declarations: [
    AppComponent, NavigationComponent, DatepickerAutoCloseComponent, DatepickerFocusComponent,
    DropdownAutoCloseComponent, ModalFocusComponent, PopoverAutocloseComponent, TooltipAutocloseComponent,
    TooltipPositionComponent, TypeaheadFocusComponent, TypeaheadValidationComponent, TypeaheadAutoCloseComponent
  ],
  imports: [BrowserModule, FormsModule, ReactiveFormsModule, routing, NgbModule],
  bootstrap: [AppComponent]
})
export class AppModule {
}
