import {NgModule, ModuleWithProviders} from '@angular/core';

import {NgbModalContainer} from './modal-container';
import {NgbModalBackdrop} from './modal-backdrop';
import {NgbModalWindow} from './modal-window';
import {NgbModalStack} from './modal-stack';
import {NgbModal} from './modal';

export {NgbModal, NgbModalOptions} from './modal';
export {NgbModalRef, NgbActiveModal} from './modal-ref';
export {ModalDismissReasons} from './modal-dismiss-reasons';

@NgModule({
  declarations: [NgbModalContainer, NgbModalBackdrop, NgbModalWindow],
  entryComponents: [NgbModalBackdrop, NgbModalWindow],
  providers: [NgbModal],
  exports: [NgbModalContainer]
})
export class NgbModalModule {
  static forRoot(): ModuleWithProviders { return {ngModule: NgbModalModule, providers: [NgbModal, NgbModalStack]}; }
}
