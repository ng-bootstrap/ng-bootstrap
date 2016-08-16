export * from './modal.component';

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NgbdModal} from './modal.component';

@NgModule({
  imports: [CommonModule],
  exports: [NgbdModal],
  declarations: [NgbdModal]
})
export class NgbdModalModule {}
