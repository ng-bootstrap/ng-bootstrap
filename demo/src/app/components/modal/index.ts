export * from './modal.component';

import {NgModule} from '@angular/core';
import {NgbdModal} from './modal.component';
import {NgbdSharedModule} from '../../shared';
import {NgbdComponentsSharedModule} from '../shared';
import {DEMO_DIRECTIVES} from './demos';

@NgModule({
  imports: [NgbdSharedModule, NgbdComponentsSharedModule],
  exports: [NgbdModal],
  declarations: [NgbdModal, ...DEMO_DIRECTIVES]
})
export class NgbdModalModule {}
