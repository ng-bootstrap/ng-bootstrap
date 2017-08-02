import { NgModule } from '@angular/core';
import { NgbAccordionModule } from './accordion/accordion.module';
import { NgbAlertModule } from './alert/alert.module';
import { NgbButtonsModule } from './buttons/radio.module';
import { NgbCarouselModule } from './carousel/carousel.module';
import { NgbCollapseModule } from './collapse/collapse.module';
import { NgbDatepickerModule } from './datepicker/datepicker.module';
import { NgbDropdownModule } from './dropdown/dropdown.module';
import { NgbModalModule } from './modal/modal.module';
import { NgbPaginationModule } from './pagination/pagination.module';
import { NgbPopoverModule } from './popover/popover.module';
import { NgbProgressbarModule } from './progressbar/progressbar.module';
import { NgbRatingModule } from './rating/rating.module';
import { NgbTabsetModule } from './tabset/tabset.module';
import { NgbTimepickerModule } from './timepicker/timepicker.module';
import { NgbTooltipModule } from './tooltip/tooltip.module';
import { NgbTypeaheadModule } from './typeahead/typeahead.module';
export { NgbAccordionModule, NgbAccordionConfig, NgbAccordion, NgbPanel, NgbPanelTitle, NgbPanelContent } from './accordion/accordion.module';
export { NgbAlertModule, NgbAlertConfig, NgbAlert } from './alert/alert.module';
export { NgbButtonsModule, NgbRadioGroup } from './buttons/radio.module';
export { NgbCarouselModule, NgbCarouselConfig, NgbCarousel, NgbSlide } from './carousel/carousel.module';
export { NgbCollapseModule, NgbCollapse } from './collapse/collapse.module';
export { NgbDatepickerModule, NgbDatepickerI18n, NgbDatepickerConfig, NgbDateParserFormatter, NgbDatepicker, NgbInputDatepicker } from './datepicker/datepicker.module';
export { NgbDropdownModule, NgbDropdownConfig, NgbDropdown } from './dropdown/dropdown.module';
export { NgbModalModule, NgbModal, NgbActiveModal, NgbModalRef, ModalDismissReasons } from './modal/modal.module';
export { NgbPaginationModule, NgbPaginationConfig, NgbPagination } from './pagination/pagination.module';
export { NgbPopoverModule, NgbPopoverConfig, NgbPopover } from './popover/popover.module';
export { NgbProgressbarModule, NgbProgressbarConfig, NgbProgressbar } from './progressbar/progressbar.module';
export { NgbRatingModule, NgbRatingConfig, NgbRating } from './rating/rating.module';
export { NgbTabsetModule, NgbTabsetConfig, NgbTabset, NgbTab, NgbTabContent, NgbTabTitle } from './tabset/tabset.module';
export { NgbTimepickerModule, NgbTimepickerConfig, NgbTimepicker } from './timepicker/timepicker.module';
export { NgbTooltipModule, NgbTooltipConfig, NgbTooltip } from './tooltip/tooltip.module';
export { NgbTypeaheadModule, NgbTypeaheadConfig, NgbTypeahead } from './typeahead/typeahead.module';
var NGB_MODULES = [
    NgbAccordionModule, NgbAlertModule, NgbButtonsModule, NgbCarouselModule, NgbCollapseModule, NgbDatepickerModule,
    NgbDropdownModule, NgbModalModule, NgbPaginationModule, NgbPopoverModule, NgbProgressbarModule, NgbRatingModule,
    NgbTabsetModule, NgbTimepickerModule, NgbTooltipModule, NgbTypeaheadModule
];
export var NgbRootModule = (function () {
    function NgbRootModule() {
    }
    NgbRootModule.decorators = [
        { type: NgModule, args: [{
                    imports: [
                        NgbAlertModule.forRoot(), NgbButtonsModule.forRoot(), NgbCollapseModule.forRoot(), NgbProgressbarModule.forRoot(),
                        NgbTooltipModule.forRoot(), NgbTypeaheadModule.forRoot(), NgbAccordionModule.forRoot(), NgbCarouselModule.forRoot(),
                        NgbDatepickerModule.forRoot(), NgbDropdownModule.forRoot(), NgbModalModule.forRoot(), NgbPaginationModule.forRoot(),
                        NgbPopoverModule.forRoot(), NgbProgressbarModule.forRoot(), NgbRatingModule.forRoot(), NgbTabsetModule.forRoot(),
                        NgbTimepickerModule.forRoot(), NgbTooltipModule.forRoot()
                    ],
                    exports: NGB_MODULES
                },] },
    ];
    /** @nocollapse */
    NgbRootModule.ctorParameters = [];
    return NgbRootModule;
}());
export var NgbModule = (function () {
    function NgbModule() {
    }
    NgbModule.forRoot = function () { return { ngModule: NgbRootModule }; };
    NgbModule.decorators = [
        { type: NgModule, args: [{ imports: NGB_MODULES, exports: NGB_MODULES },] },
    ];
    /** @nocollapse */
    NgbModule.ctorParameters = [];
    return NgbModule;
}());
//# sourceMappingURL=index.js.map