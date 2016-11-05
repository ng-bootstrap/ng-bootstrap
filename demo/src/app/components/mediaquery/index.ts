export * from './mediaquery.component';

import {NgModule} from '@angular/core';

import {NgbdSharedModule} from '../../shared';
import {NgbdComponentsSharedModule} from '../shared';
import {NgbdMediaQuery} from './mediaquery.component';
import {DEMO_DIRECTIVES} from './demos';

@NgModule({
  imports: [NgbdSharedModule, NgbdComponentsSharedModule],
  exports: [NgbdMediaQuery],
  declarations: [NgbdMediaQuery, ...DEMO_DIRECTIVES]
})
export class NgbdMediaQueryModule {}
