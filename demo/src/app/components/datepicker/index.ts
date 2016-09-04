export * from './datepicker.component';

import {NgModule} from '@angular/core';
import {NgbdSharedModule} from '../../shared';
import {NgbdComponentsSharedModule} from '../shared';
import {NgbdDatepicker} from './datepicker.component';
import {DEMO_DIRECTIVES} from './demos';

@NgModule({
  imports: [NgbdSharedModule, NgbdComponentsSharedModule],
  exports: [NgbdDatepicker],
  declarations: [NgbdDatepicker, ...DEMO_DIRECTIVES],
})
export class NgbdDatepickerModule {}
