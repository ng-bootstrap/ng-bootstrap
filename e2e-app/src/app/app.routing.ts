import {ModuleWithProviders} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DatepickerFocusComponent} from './datepicker/focus/datepicker-focus.component';
import {DatepickerAutoCloseComponent} from './datepicker/autoclose/datepicker-autoclose.component';
import {DropdownAutoCloseComponent} from './dropdown/autoclose/dropdown-autoclose.component';
import {ModalFocusComponent} from './modal/focus/modal-focus.component';
import {PopoverAutocloseComponent} from './popover/autoclose/popover-autoclose.component';
import {TooltipAutocloseComponent} from './tooltip/autoclose/tooltip-autoclose.component';
import {TypeaheadFocusComponent} from './typeahead/focus/typeahead-focus.component';
import {TypeaheadValidationComponent} from './typeahead/validation/typeahead-validation.component';

export const routes: Routes = [
  {
    path: 'datepicker',
    children: [
      {path: 'focus', component: DatepickerFocusComponent},
      {path: 'autoclose', component: DatepickerAutoCloseComponent}
    ]
  },
  {path: 'modal', children: [{path: 'focus', component: ModalFocusComponent}]},
  {path: 'dropdown', children: [{path: 'autoclose', component: DropdownAutoCloseComponent}]},
  {path: 'popover', children: [{path: 'autoclose', component: PopoverAutocloseComponent}]},
  {path: 'tooltip', children: [{path: 'autoclose', component: TooltipAutocloseComponent}]}, {
    path: 'typeahead',
    children: [
      {path: 'focus', component: TypeaheadFocusComponent},
      {path: 'validation', component: TypeaheadValidationComponent}
    ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, {useHash: true});
