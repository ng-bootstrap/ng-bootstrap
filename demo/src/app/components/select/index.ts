export * from './select.component';

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NgbdSharedModule} from '../../shared';
import {NgbdComponentsSharedModule} from '../shared';
import {NgbdSelect} from './select.component';
import {DEMO_DIRECTIVES} from './demos';

@NgModule({
  imports: [NgbdSharedModule, NgbdComponentsSharedModule],
  exports: [NgbdSelect],
  declarations: [NgbdSelect, ...DEMO_DIRECTIVES]
})
export class NgbdSelectModule {}
