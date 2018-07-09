import {NgModule, ModuleWithProviders} from '@angular/core';

import {NgbModalBackdrop} from './modal-backdrop';
import {NgbModalWindow} from './modal-window';
import {NgbModalStack} from './modal-stack';
import {NgbModal} from './modal';
import {ScrollBar} from '../util/scrollbar';

export {NgbModal, NgbModalOptions} from './modal';
export {NgbModalRef, NgbActiveModal} from './modal-ref';
export {ModalDismissReasons} from './modal-dismiss-reasons';

@NgModule({
  declarations: [NgbModalBackdrop, NgbModalWindow],
  entryComponents: [NgbModalBackdrop, NgbModalWindow],
  providers: [NgbModal]
})
export class NgbModalModule {
  static forRoot(): ModuleWithProviders {
    return {ngModule: NgbModalModule, providers: [NgbModal, NgbModalStack, ScrollBar]};
  }
}
