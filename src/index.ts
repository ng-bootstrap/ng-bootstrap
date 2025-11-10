import { NgModule } from '@angular/core';

import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap/accordion';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap/alert';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap/carousel';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap/collapse';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap/datepicker';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap/dropdown';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap/modal';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap/nav';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap/pagination';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap/popover';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap/progressbar';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap/rating';
import { NgbScrollSpyModule } from '@ng-bootstrap/ng-bootstrap/scrollspy';
import { NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap/timepicker';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap/toast';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap/tooltip';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap/typeahead';
import { NgbOffcanvasModule } from '@ng-bootstrap/ng-bootstrap/offcanvas';

export * from '@ng-bootstrap/ng-bootstrap/accordion';
export * from '@ng-bootstrap/ng-bootstrap/alert';
export * from '@ng-bootstrap/ng-bootstrap/carousel';
export * from '@ng-bootstrap/ng-bootstrap/collapse';
export * from '@ng-bootstrap/ng-bootstrap/datepicker';
export * from '@ng-bootstrap/ng-bootstrap/dropdown';
export * from '@ng-bootstrap/ng-bootstrap/modal';
export * from '@ng-bootstrap/ng-bootstrap/nav';
export * from '@ng-bootstrap/ng-bootstrap/offcanvas';
export * from '@ng-bootstrap/ng-bootstrap/pagination';
export * from '@ng-bootstrap/ng-bootstrap/popover';
export * from '@ng-bootstrap/ng-bootstrap/progressbar';
export * from '@ng-bootstrap/ng-bootstrap/rating';
export * from '@ng-bootstrap/ng-bootstrap/scrollspy';
export * from '@ng-bootstrap/ng-bootstrap/timepicker';
export * from '@ng-bootstrap/ng-bootstrap/toast';
export * from '@ng-bootstrap/ng-bootstrap/tooltip';
export * from '@ng-bootstrap/ng-bootstrap/typeahead';
export type { Placement, PlacementArray } from '@ng-bootstrap/ng-bootstrap/utils';

export { NgbConfig } from '@ng-bootstrap/ng-bootstrap/config';

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
