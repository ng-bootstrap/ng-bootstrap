import {NgModule} from '@angular/core';

import {NgbAccordionModule, NgbPanelChangeEvent} from './accordion/accordion.module';
import {NgbAlertModule} from './alert/alert.module';
import {NgbButtonsModule} from './buttons/radio.module';
import {NgbCarouselModule} from './carousel/carousel.module';
import {NgbCollapseModule} from './collapse/collapse.module';
import {NgbDropdownModule} from './dropdown/dropdown.module';
import {NgbModalModule, NgbModal, NgbModalOptions, NgbModalRef, ModalDismissReasons} from './modal/modal.module';
import {NgbPaginationModule} from './pagination/pagination.module';
import {NgbPopoverModule} from './popover/popover.module';
import {NgbProgressbarModule} from './progressbar/progressbar.module';
import {NgbRatingModule} from './rating/rating.module';
import {NgbTabsetModule, NgbTabChangeEvent} from './tabset/tabset.module';
import {NgbTimepickerModule} from './timepicker/timepicker.module';
import {NgbTooltipModule} from './tooltip/tooltip.module';
import {NgbTypeaheadModule} from './typeahead/typeahead.module';

export {NgbPanelChangeEvent} from './accordion/accordion.module';
export {NgbModal, NgbModalOptions, NgbModalRef, ModalDismissReasons} from './modal/modal.module';
export {NgbTabChangeEvent} from './tabset/tabset.module';
export {NgbProgressbarConfig} from './progressbar/progressbar.module';

@NgModule({
  exports: [
    NgbAccordionModule, NgbAlertModule, NgbButtonsModule, NgbCarouselModule, NgbCollapseModule, NgbDropdownModule,
    NgbModalModule, NgbPaginationModule, NgbPopoverModule, NgbProgressbarModule, NgbRatingModule, NgbTabsetModule,
    NgbTimepickerModule, NgbTooltipModule, NgbTypeaheadModule
  ]
})
export class NgbModule {
}
