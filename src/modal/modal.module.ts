import {NgModule, ModuleWithProviders} from '@angular/core';

import {NgbModalBackdrop} from './modal-backdrop';
import {NgbModalWindow} from './modal-window';
import {NgbModal} from './modal';

export {NgbModal, NgbModalOptions} from './modal';
export {NgbModalRef, NgbActiveModal} from './modal-ref';
export {ModalDismissReasons} from './modal-dismiss-reasons';

@NgModule({declarations: [NgbModalBackdrop, NgbModalWindow], entryComponents: [NgbModalBackdrop, NgbModalWindow]})
export class NgbModalModule {
  /**
   * Importing with '.forRoot()' is no longer necessary, you can simply import the module.
   * Will be removed in 4.0.0.
   *
   * @deprecated 3.0.0
   */
  static forRoot(): ModuleWithProviders { return {ngModule: NgbModalModule}; }
}
