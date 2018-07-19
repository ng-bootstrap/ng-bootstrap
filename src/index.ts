import {NgModule, ModuleWithProviders} from '@angular/core';

import {NgbAccordionModule, NgbPanelChangeEvent} from './accordion/accordion.module';
import {NgbAlertModule} from './alert/alert.module';
import {NgbButtonsModule} from './buttons/buttons.module';
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

export {
  NgbAccordionModule,
  NgbPanelChangeEvent,
  NgbAccordionConfig,
  NgbAccordion,
  NgbPanel,
  NgbPanelTitle,
  NgbPanelContent
} from './accordion/accordion.module';
export {NgbAlertModule, NgbAlertConfig, NgbAlert} from './alert/alert.module';
export {NgbButtonsModule, NgbCheckBox, NgbRadioGroup} from './buttons/buttons.module';
export {NgbCarouselModule, NgbCarouselConfig, NgbCarousel, NgbSlide} from './carousel/carousel.module';
export {NgbCollapseModule, NgbCollapse} from './collapse/collapse.module';
export {
  NgbCalendar,
  NgbPeriod,
  NgbCalendarIslamicCivil,
  NgbCalendarIslamicUmalqura,
  NgbDatepickerModule,
  NgbDatepickerI18n,
  NgbDatepickerConfig,
  NgbDateStruct,
  NgbDateParserFormatter,
  NgbDateAdapter,
  NgbDateNativeAdapter,
  NgbDatepicker,
  NgbInputDatepicker,
  NgbDatepickerToggle
} from './datepicker/datepicker.module';
export {NgbDropdownModule, NgbDropdownConfig, NgbDropdown} from './dropdown/dropdown.module';
export {
  NgbModalModule,
  NgbModal,
  NgbModalOptions,
  NgbActiveModal,
  NgbModalRef,
  ModalDismissReasons
} from './modal/modal.module';
export {NgbPaginationModule, NgbPaginationConfig, NgbPagination} from './pagination/pagination.module';
export {NgbPopoverModule, NgbPopoverConfig, NgbPopover} from './popover/popover.module';
export {NgbProgressbarModule, NgbProgressbarConfig, NgbProgressbar} from './progressbar/progressbar.module';
export {NgbRatingModule, NgbRatingConfig, NgbRating} from './rating/rating.module';
export {
  NgbTabsetModule,
  NgbTabChangeEvent,
  NgbTabsetConfig,
  NgbTabset,
  NgbTab,
  NgbTabContent,
  NgbTabTitle
} from './tabset/tabset.module';
export {
  NgbTimepickerModule,
  NgbTimepickerConfig,
  NgbTimeStruct,
  NgbTimepicker,
  NgbTimeAdapter
} from './timepicker/timepicker.module';
export {NgbTooltipModule, NgbTooltipConfig, NgbTooltip} from './tooltip/tooltip.module';
export {
  NgbHighlight,
  NgbTypeaheadModule,
  NgbTypeaheadConfig,
  NgbTypeaheadSelectItemEvent,
  NgbTypeahead
} from './typeahead/typeahead.module';

export {Placement} from './util/positioning';

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
