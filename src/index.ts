import {NgModule} from '@angular/core';

import {NgbAccordionModule, NgbPanelChangeEvent} from './accordion/accordion.module';
import {NgbAlertModule} from './alert/alert.module';
import {NgbButtonsModule} from './buttons/radio.module';
import {NgbCarouselModule} from './carousel/carousel.module';
import {NgbCollapseModule} from './collapse/collapse.module';
import {NgbDatepickerModule} from './datepicker/datepicker.module';
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

export {NgbPanelChangeEvent, NgbAccordionConfig} from './accordion/accordion.module';
export {NgbModal, NgbModalOptions, NgbModalRef, ModalDismissReasons} from './modal/modal.module';
export {NgbTabChangeEvent} from './tabset/tabset.module';
export {NgbAlertConfig, NgbSelfClosingAlertConfig} from './alert/alert.module';
export {NgbCarouselConfig} from './carousel/carousel.module';
export {NgbDatepickerConfig} from './datepicker/datepicker.module';
export {NgbPaginationConfig} from './pagination/pagination.module';
export {NgbPopoverConfig} from './popover/popover.module';
export {NgbProgressbarConfig} from './progressbar/progressbar.module';
export {NgbRatingConfig} from './rating/rating.module';
export {NgbTimepickerConfig} from './timepicker/timepicker.module';
export {NgbTabsetConfig} from './tabset/tabset.module';
export {NgbTooltipConfig} from './tooltip/tooltip.module';

@NgModule({
  exports: [
    NgbAccordionModule, NgbAlertModule, NgbButtonsModule, NgbCarouselModule, NgbCollapseModule, NgbDatepickerModule,
    NgbDropdownModule, NgbModalModule, NgbPaginationModule, NgbPopoverModule, NgbProgressbarModule, NgbRatingModule,
    NgbTabsetModule, NgbTimepickerModule, NgbTooltipModule, NgbTypeaheadModule
  ]
})
export class NgbModule {
}
