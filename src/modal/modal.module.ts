import { NgModule } from '@angular/core';

import { NgbModal } from './modal';

export { NgbModal } from './modal';
export { NgbModalConfig, NgbModalOptions, NgbModalUpdatableOptions } from './modal-config';
export { NgbModalRef, NgbActiveModal } from './modal-ref';
export { ModalDismissReasons } from './modal-dismiss-reasons';

@NgModule({ providers: [NgbModal] })
export class NgbModalModule {}
