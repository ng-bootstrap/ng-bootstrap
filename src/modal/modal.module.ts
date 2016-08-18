import {NgModule} from '@angular/core';

import {NgbModalContainer} from './modal-container';
import {NgbModalBackdrop} from './modal-backdrop';
import {NgbModalWindow} from './modal-window';
import {NgbModalStack} from './modal-stack';
import {NgbModal} from './modal';

export {NgbModal, NgbModalOptions} from './modal';
export {NgbModalRef} from './modal-ref';
export {ModalDismissReasons} from './modal-dismiss-reasons';

@NgModule({
  declarations: [NgbModalContainer, NgbModalBackdrop, NgbModalWindow],
  entryComponents: [NgbModalBackdrop, NgbModalWindow],
  exports: [NgbModalContainer],
  providers: [NgbModal, NgbModalStack]
})
export class NgbModalModule {
}
