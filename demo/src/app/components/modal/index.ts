export * from './modal.component';

import {NgModule} from '@angular/core';
import {NgbdModal} from './modal.component';
import {NgbdSharedModule} from '../../shared';
import {NgbdComponentsSharedModule} from '../shared';
import {DEMO_DIRECTIVES, NgbdModalContent} from './demos';

@NgModule({
  imports: [NgbdSharedModule, NgbdComponentsSharedModule],
  exports: [NgbdModal],
  entryComponents: [NgbdModalContent],
  declarations: [NgbdModal, NgbdModalContent, ...DEMO_DIRECTIVES]
})
export class NgbdModalModule {}
