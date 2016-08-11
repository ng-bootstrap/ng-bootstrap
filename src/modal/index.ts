import {NgModule} from '@angular/core';

import {NgbModalBackdrop} from './modal_backdrop';
import {NgbModalWindow} from './modal_window';

@NgModule({declarations: [NgbModalBackdrop, NgbModalWindow], entryComponents: [NgbModalBackdrop, NgbModalWindow]})
export class NgbModalModule {
}
