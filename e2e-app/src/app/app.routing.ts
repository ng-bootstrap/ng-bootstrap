import {ModuleWithProviders} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DatepickerFocusComponent} from './datepicker/focus/datepicker-focus.component';
import {ModalFocustrapComponent} from './modal/focustrap/modal-focustrap.component';

const routes: Routes = [
  {
    path: 'datepicker',
    children: [
      {path: 'focus', component: DatepickerFocusComponent}
    ]
  },
  {
    path: 'modal',
    children: [
      {path: 'focustrap', component: ModalFocustrapComponent}
    ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, {useHash: true});
