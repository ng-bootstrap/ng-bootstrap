export * from './tabset.component';

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NgbdSharedModule} from '../../shared';
import {NgbdComponentsSharedModule} from '../shared';
import {NgbdTabs} from './tabset.component';
import {DEMO_DIRECTIVES} from './demos';

@NgModule({
  imports: [NgbdSharedModule, NgbdComponentsSharedModule],
  exports: [NgbdTabs],
  declarations: [NgbdTabs, ...DEMO_DIRECTIVES]
})
export class NgbdTabsModule {}
