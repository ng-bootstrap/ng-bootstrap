import { NgModule } from '@angular/core';

import { NgbAccordionModule } from './accordion/src/accordion.module';
import { NgbAlertModule } from './alert/src/alert.module';
import { NgbCarouselModule } from './carousel/src/carousel.module';
import { NgbCollapseModule } from './collapse/src/collapse.module';
import { NgbDatepickerModule } from './datepicker/src/datepicker.module';
import { NgbDropdownModule } from './dropdown/src/dropdown.module';
import { NgbModalModule } from './modal/src/modal.module';
import { NgbNavModule } from './nav/src/nav.module';
import { NgbPaginationModule } from './pagination/src/pagination.module';
import { NgbPopoverModule } from './popover/src/popover.module';
import { NgbProgressbarModule } from './progressbar/src/progressbar.module';
import { NgbRatingModule } from './rating/src/rating.module';
import { NgbScrollSpyModule } from './scrollspy/src/scrollspy.module';
import { NgbTimepickerModule } from './timepicker/src/timepicker.module';
import { NgbToastModule } from './toast/src/toast.module';
import { NgbTooltipModule } from './tooltip/src/tooltip.module';
import { NgbTypeaheadModule } from './typeahead/src/typeahead.module';
import { NgbOffcanvasModule } from './offcanvas/src/offcanvas.module';

export {
	NgbAccordionDirective,
	NgbAccordionConfig,
	NgbAccordionModule,
	NgbAccordionItem,
	NgbAccordionHeader,
	NgbAccordionToggle,
	NgbAccordionCollapse,
	NgbAccordionBody,
	NgbAccordionButton,
} from './accordion/src/accordion.module';

export { NgbAlert, NgbAlertConfig, NgbAlertModule } from './alert/src/alert.module';
export {
	NgbCarousel,
	NgbCarouselConfig,
	NgbCarouselModule,
	NgbSlide,
	NgbSlideEvent,
	NgbSlideEventDirection,
	NgbSlideEventSource,
} from './carousel/src/carousel.module';
export { NgbCollapse, NgbCollapseConfig, NgbCollapseModule } from './collapse/src/collapse.module';
export {
	NgbCalendar,
	NgbCalendarEthiopian,
	NgbCalendarGregorian,
	NgbCalendarHebrew,
	NgbCalendarIslamicCivil,
	NgbCalendarIslamicUmalqura,
	NgbCalendarPersian,
	NgbCalendarBuddhist,
	NgbDate,
	NgbDateAdapter,
	NgbDateStructAdapter,
	NgbDateNativeAdapter,
	NgbDateNativeUTCAdapter,
	NgbDateParserFormatter,
	NgbDatepicker,
	NgbDatepickerConfig,
	NgbInputDatepickerConfig,
	NgbDatepickerContent,
	NgbDatepickerI18n,
	NgbDatepickerI18nAmharic,
	NgbDatepickerI18nDefault,
	NgbDatepickerI18nHebrew,
	NgbDatepickerKeyboardService,
	NgbDatepickerModule,
	NgbDatepickerMonth,
	NgbDatepickerNavigateEvent,
	NgbDatepickerState,
	NgbDateStruct,
	NgbInputDatepicker,
	NgbPeriod,
	DayTemplateContext,
} from './datepicker/src/datepicker.module';
export {
	NgbDropdown,
	NgbDropdownAnchor,
	NgbDropdownConfig,
	NgbDropdownItem,
	NgbDropdownButtonItem,
	NgbDropdownMenu,
	NgbDropdownModule,
	NgbDropdownToggle,
} from './dropdown/src/dropdown.module';
export {
	ModalDismissReasons,
	NgbActiveModal,
	NgbModal,
	NgbModalConfig,
	NgbModalModule,
	NgbModalOptions,
	NgbModalUpdatableOptions,
	NgbModalRef,
} from './modal/src/modal.module';
export {
	NgbNavChangeEvent,
	NgbNavConfig,
	NgbNav,
	NgbNavContent,
	NgbNavContentContext,
	NgbNavItem,
	NgbNavItemRole,
	NgbNavLink,
	NgbNavLinkButton,
	NgbNavLinkBase,
	NgbNavModule,
	NgbNavOutlet,
	NgbNavPane,
} from './nav/src/nav.module';
export {
	OffcanvasDismissReasons,
	NgbActiveOffcanvas,
	NgbOffcanvas,
	NgbOffcanvasConfig,
	NgbOffcanvasModule,
	NgbOffcanvasOptions,
	NgbOffcanvasRef,
} from './offcanvas/src/offcanvas.module';
export {
	NgbPagination,
	NgbPaginationConfig,
	NgbPaginationEllipsis,
	NgbPaginationFirst,
	NgbPaginationLast,
	NgbPaginationModule,
	NgbPaginationNext,
	NgbPaginationNumber,
	NgbPaginationPrevious,
	NgbPaginationPages,
} from './pagination/src/pagination.module';
export { NgbPopover, NgbPopoverConfig, NgbPopoverModule } from './popover/src/popover.module';
export {
	NgbProgressbar,
	NgbProgressbarConfig,
	NgbProgressbarModule,
	NgbProgressbarStacked,
} from './progressbar/src/progressbar.module';
export { NgbRating, NgbRatingConfig, NgbRatingModule } from './rating/src/rating.module';
export {
	NgbScrollSpy,
	NgbScrollSpyConfig,
	NgbScrollSpyFragment,
	NgbScrollSpyItem,
	NgbScrollSpyMenu,
	NgbScrollSpyModule,
	NgbScrollSpyProcessChanges,
	NgbScrollSpyService,
} from './scrollspy/src/scrollspy.module';
export {
	NgbTimeAdapter,
	NgbTimepickerI18n,
	NgbTimepicker,
	NgbTimepickerConfig,
	NgbTimepickerModule,
	NgbTimeStruct,
} from './timepicker/src/timepicker.module';
export { NgbToast, NgbToastConfig, NgbToastOptions, NgbToastHeader, NgbToastModule } from './toast/src/toast.module';
export { NgbTooltip, NgbTooltipConfig, NgbTooltipModule } from './tooltip/src/tooltip.module';
export {
	NgbHighlight,
	NgbTypeahead,
	NgbTypeaheadConfig,
	NgbTypeaheadModule,
	NgbTypeaheadSelectItemEvent,
} from './typeahead/src/typeahead.module';
export { Placement, PlacementArray } from './util/src/positioning';

export { NgbConfig } from './config/src/ngb-config';

const NGB_MODULES = [
	NgbAccordionModule,
	NgbAlertModule,
	NgbCarouselModule,
	NgbCollapseModule,
	NgbDatepickerModule,
	NgbDropdownModule,
	NgbModalModule,
	NgbNavModule,
	NgbOffcanvasModule,
	NgbPaginationModule,
	NgbPopoverModule,
	NgbProgressbarModule,
	NgbRatingModule,
	NgbScrollSpyModule,
	NgbTimepickerModule,
	NgbToastModule,
	NgbTooltipModule,
	NgbTypeaheadModule,
];

@NgModule({ imports: NGB_MODULES, exports: NGB_MODULES })
export class NgbModule {}
