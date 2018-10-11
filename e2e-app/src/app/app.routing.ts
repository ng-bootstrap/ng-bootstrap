import {ModuleWithProviders} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DatepickerFocusComponent} from './datepicker/focus/datepicker-focus.component';
import {DatepickerAutoCloseComponent} from './datepicker/autoclose/datepicker-autoclose.component';
import {DropdownAutoCloseComponent} from './dropdown/autoclose/dropdown-autoclose.component';
import {ModalFocustrapComponent} from './modal/focustrap/modal-focustrap.component';

const routes: Routes = [
  {
    path: 'datepicker',
    children: [
      {path: 'focus', component: DatepickerFocusComponent},
      {path: 'autoclose', component: DatepickerAutoCloseComponent}
    ]
  },
  {
    path: 'modal',
    children: [
      {path: 'focustrap', component: ModalFocustrapComponent}
    ]
  },
  {
    path: 'dropdown',
    children: [
      {path: 'autoclose', component: DropdownAutoCloseComponent}
    ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, {useHash: true});
