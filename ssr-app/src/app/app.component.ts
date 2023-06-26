import { Component } from '@angular/core';
import { TypeaheadComponent } from './components/typeahead.component';
import { TooltipComponent } from './components/tooltip.component';
import { TimepickerComponent } from './components/timepicker.component';
import { RatingComponent } from './components/rating.component';
import { ProgressComponent } from './components/progress.component';
import { PopoverComponent } from './components/popover.component';
import { PaginationComponent } from './components/pagination.component';
import { NavComponent } from './components/nav.component';
import { ModalComponent } from './components/modal.component';
import { DropdownComponent } from './components/dropdown.component';
import { DatepickerComponent } from './components/datepicker.component';
import { CollapseComponent } from './components/collapse.component';
import { CarouselComponent } from './components/carousel.component';
import { AlertComponent } from './components/alert.component';
import { AccordionComponent } from './components/accordion.component';
import { ScrollSpyComponent } from './components/scrollspy.component';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [
		AccordionComponent,
		AlertComponent,
		CarouselComponent,
		CollapseComponent,
		DatepickerComponent,
		DropdownComponent,
		ModalComponent,
		NavComponent,
		PaginationComponent,
		PopoverComponent,
		ProgressComponent,
		RatingComponent,
		ScrollSpyComponent,
		TimepickerComponent,
		TooltipComponent,
		TypeaheadComponent,
	],
	template: `
		<div class="container p-5">
			<h1>ng-bootstrap SSR test application</h1>

			<h2 class="mt-5">Accordion</h2>
			<accordion-component></accordion-component>

			<h2 class="mt-5">Alert</h2>
			<alert-component></alert-component>

			<h2 class="mt-5">Carousel</h2>
			<carousel-component></carousel-component>

			<h2 class="mt-5">Collapse</h2>
			<collapse-component></collapse-component>

			<h2 class="mt-5">Datepicker</h2>
			<datepicker-component></datepicker-component>

			<h2 class="mt-5">Dropdown</h2>
			<dropdown-component></dropdown-component>

			<h2 class="mt-5">Modal</h2>
			<modal-component></modal-component>

			<h2 class="mt-5">Nav</h2>
			<nav-component></nav-component>

			<h2 class="mt-5">Pagination</h2>
			<pagination-component></pagination-component>

			<h2 class="mt-5">Popover</h2>
			<popover-component></popover-component>

			<h2 class="mt-5">Progress</h2>
			<progress-component></progress-component>

			<h2 class="mt-5">Rating</h2>
			<rating-component></rating-component>

			<h2 class="mt-5">Scrollspy</h2>
			<scrollspy-component></scrollspy-component>

			<h2 class="mt-5">Timepicker</h2>
			<timepicker-component></timepicker-component>

			<h2 class="mt-5">Tooltip</h2>
			<tooltip-component></tooltip-component>

			<h2 class="mt-5">Typeahead</h2>
			<typeahead-component></typeahead-component>
		</div>
	`,
})
export class AppComponent {}
