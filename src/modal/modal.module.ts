import {NgModule, ModuleWithProviders} from '@angular/core';

import {NgbA11yModule} from './../a11y/a11y.module';
import {NgbModalBackdrop} from './modal-backdrop';
import {NgbModalWindow} from './modal-window';
import {NgbModalStack} from './modal-stack';
import {NgbModal} from './modal';

export {NgbModal, NgbModalOptions} from './modal';
export {NgbModalRef, NgbActiveModal} from './modal-ref';
export {ModalDismissReasons} from './modal-dismiss-reasons';

@NgModule({
  imports: [NgbA11yModule.forRoot()],
  declarations: [NgbModalBackdrop, NgbModalWindow],
  entryComponents: [NgbModalBackdrop, NgbModalWindow],
  providers: [NgbModal]
})
export class NgbModalModule {
  static forRoot(): ModuleWithProviders { return {ngModule: NgbModalModule, providers: [NgbModal, NgbModalStack]}; }
}
