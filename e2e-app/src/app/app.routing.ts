import {ModuleWithProviders} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DatepickerFocustrapComponent} from './datepicker/focustrap/datepicker-focustrap.component';
import {ModalFocustrapComponent} from './modal/focustrap/modal-focustrap.component';

const routes: Routes = [
  {
    path: 'datepicker',
    children: [
      {path: 'focustrap', component: DatepickerFocustrapComponent}
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
