import {NgModule, ModuleWithProviders} from '@angular/core';

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
import {NgbTypeaheadModule, NgbTypeaheadSelectItemEvent} from './typeahead/typeahead.module';

export {NgbAccordionModule, NgbPanelChangeEvent, NgbAccordionConfig} from './accordion/accordion.module';
export {NgbAlertModule, NgbAlertConfig} from './alert/alert.module';
export {NgbButtonsModule} from './buttons/radio.module';
export {NgbCarouselModule, NgbCarouselConfig} from './carousel/carousel.module';
export {NgbCollapseModule} from './collapse/collapse.module';
export {
  NgbDatepickerModule,
  NgbDatepickerI18n,
  NgbDatepickerConfig,
  NgbDateStruct,
  NgbDateParserFormatter
} from './datepicker/datepicker.module';
export {NgbDropdownModule, NgbDropdownConfig} from './dropdown/dropdown.module';
export {NgbModalModule, NgbModal, NgbModalOptions, NgbModalRef, ModalDismissReasons} from './modal/modal.module';
export {NgbPaginationModule, NgbPaginationConfig} from './pagination/pagination.module';
export {NgbPopoverModule, NgbPopoverConfig} from './popover/popover.module';
export {NgbProgressbarModule, NgbProgressbarConfig} from './progressbar/progressbar.module';
export {NgbRatingModule, NgbRatingConfig} from './rating/rating.module';
export {NgbTabsetModule, NgbTabChangeEvent, NgbTabsetConfig} from './tabset/tabset.module';
export {NgbTimepickerModule, NgbTimepickerConfig, NgbTimeStruct} from './timepicker/timepicker.module';
export {NgbTooltipModule, NgbTooltipConfig} from './tooltip/tooltip.module';
export {NgbTypeaheadModule, NgbTypeaheadConfig, NgbTypeaheadSelectItemEvent} from './typeahead/typeahead.module';

const NGB_MODULES = [
  NgbAccordionModule, NgbAlertModule, NgbButtonsModule, NgbCarouselModule, NgbCollapseModule, NgbDatepickerModule,
  NgbDropdownModule, NgbModalModule, NgbPaginationModule, NgbPopoverModule, NgbProgressbarModule, NgbRatingModule,
  NgbTabsetModule, NgbTimepickerModule, NgbTooltipModule, NgbTypeaheadModule
];

@NgModule({
  imports: [
    NgbAlertModule.forRoot(), NgbButtonsModule.forRoot(), NgbCollapseModule.forRoot(), NgbProgressbarModule.forRoot(),
    NgbTooltipModule.forRoot(), NgbTypeaheadModule.forRoot(), NgbAccordionModule.forRoot(), NgbCarouselModule.forRoot(),
    NgbDatepickerModule.forRoot(), NgbDropdownModule.forRoot(), NgbModalModule.forRoot(), NgbPaginationModule.forRoot(),
    NgbPopoverModule.forRoot(), NgbProgressbarModule.forRoot(), NgbRatingModule.forRoot(), NgbTabsetModule.forRoot(),
    NgbTimepickerModule.forRoot(), NgbTooltipModule.forRoot()
  ],
  exports: NGB_MODULES
})
export class NgbRootModule {
}

@NgModule({imports: NGB_MODULES, exports: NGB_MODULES})
export class NgbModule {
  static forRoot(): ModuleWithProviders { return {ngModule: NgbRootModule}; }
}
