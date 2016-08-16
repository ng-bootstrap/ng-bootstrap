export * from './accordion.component';

import {NgModule} from '@angular/core';

import {NgbdSharedModule} from '../../shared';
import {NgbdComponentsSharedModule} from '../shared';
import {NgbdAccordion} from './accordion.component';
import {DEMO_DIRECTIVES} from './demos';

@NgModule({
  imports: [NgbdSharedModule, NgbdComponentsSharedModule],
  exports: [NgbdAccordion],
  declarations: [NgbdAccordion, ...DEMO_DIRECTIVES]
})
export class NgbdAccordionModule {}
