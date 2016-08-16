export * from './typeahead.component';

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NgbdSharedModule} from '../../shared';
import {NgbdComponentsSharedModule} from '../shared';
import {NgbdTypeahead} from './typeahead.component';
import {DEMO_DIRECTIVES} from './demos';

@NgModule({
  imports: [NgbdSharedModule, NgbdComponentsSharedModule],
  exports: [NgbdTypeahead],
  declarations: [NgbdTypeahead, ...DEMO_DIRECTIVES]
})
export class NgbdTypeaheadModule {}
