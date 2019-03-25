import {ModuleWithProviders} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {DatepickerAutoCloseComponent} from './datepicker/autoclose/datepicker-autoclose.component';
import {DatepickerFocusComponent} from './datepicker/focus/datepicker-focus.component';
import {DropdownAutoCloseComponent} from './dropdown/autoclose/dropdown-autoclose.component';
import {DropdownFocusComponent} from './dropdown/focus/dropdown-focus.component';
import {ModalFocusComponent} from './modal/focus/modal-focus.component';
import {PopoverAutocloseComponent} from './popover/autoclose/popover-autoclose.component';
import {TooltipAutocloseComponent} from './tooltip/autoclose/tooltip-autoclose.component';
import {TooltipFocusComponent} from './tooltip/focus/tooltip-focus.component';
import {TooltipPositionComponent} from './tooltip/position/tooltip-position.component';
import {TypeaheadAutoCloseComponent} from './typeahead/autoclose/typeahead-autoclose.component';
import {TypeaheadFocusComponent} from './typeahead/focus/typeahead-focus.component';
import {TypeaheadValidationComponent} from './typeahead/validation/typeahead-validation.component';
import {DropdownPositionComponent} from './dropdown/position/dropdown-position.component';


export const routes: Routes = [
  {
    path: 'datepicker',
    children: [
      {path: 'focus', component: DatepickerFocusComponent},
      {path: 'autoclose', component: DatepickerAutoCloseComponent}
    ]
  },
  {path: 'modal', children: [{path: 'focus', component: ModalFocusComponent}]}, {
    path: 'dropdown',
    children: [
      {path: 'autoclose', component: DropdownAutoCloseComponent}, {path: 'focus', component: DropdownFocusComponent},
      {path: 'position', component: DropdownPositionComponent}
    ]
  },
  {path: 'popover', children: [{path: 'autoclose', component: PopoverAutocloseComponent}]}, {
    path: 'tooltip',
    children: [
      {path: 'autoclose', component: TooltipAutocloseComponent}, {path: 'focus', component: TooltipFocusComponent},
      {path: 'position', component: TooltipPositionComponent}
    ]
  },
  {
    path: 'typeahead',
    children: [
      {path: 'focus', component: TypeaheadFocusComponent}, {path: 'autoclose', component: TypeaheadAutoCloseComponent},
      {path: 'validation', component: TypeaheadValidationComponent}
    ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, {useHash: true});
