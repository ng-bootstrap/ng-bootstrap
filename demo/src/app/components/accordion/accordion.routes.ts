/* eslint-disable @typescript-eslint/no-var-requires */
import { ENVIRONMENT_INITIALIZER, inject } from '@angular/core';
import { ComponentWrapper } from '../../shared/component-wrapper/component-wrapper.component';
import { NgbdApiPage } from '../../shared/api-page/api-page.component';
import { NgbdExamplesPage } from '../../shared/examples-page/examples.component';
import { NgbdAccordionBasic } from './demos/basic/accordion-basic';
import { NgbdAccordionConfig } from './demos/config/accordion-config';
import { NgbdAccordionHeader } from './demos/header/accordion-header';
import { NgbdAccordionStatic } from './demos/static/accordion-static';
import { NgbdAccordionToggle } from './demos/toggle/accordion-toggle';
import { NgbdAccordionKeepContent } from './demos/keep-content/accordion-keep-content';
import { Routes } from '@angular/router';
import { NgbdDemoListService } from '../../services/demo-list.service';
import { NgbdAccordionOverviewComponent } from './overview/accordion-overview.component';
import { NgbdAcccordionDeprecationComponent } from './accordion-deprecation.component';

const OVERVIEW = {
	'basic-usage': 'Basic Usage',
	features: 'Features',
	customization: 'Customization',
};

const DEMOS = {
	basic: {
		title: 'Accordion',
		code: 'accordion/demos/basic/accordion-basic.ts',
		markup: 'accordion/demos/basic/accordion-basic.html',
		type: NgbdAccordionBasic,
	},
	static: {
		title: 'One open panel at a time',
		code: 'accordion/demos/static/accordion-static.ts',
		markup: 'accordion/demos/static/accordion-static.html',
		type: NgbdAccordionStatic,
	},
	toggle: {
		title: 'Toggle panels',
		code: 'accordion/demos/toggle/accordion-toggle.ts',
		markup: 'accordion/demos/toggle/accordion-toggle.html',
		type: NgbdAccordionToggle,
	},
	header: {
		title: 'Custom header',
		code: 'accordion/demos/header/accordion-header.ts',
		markup: 'accordion/demos/header/accordion-header.html',
		type: NgbdAccordionHeader,
	},
	'keep-content': {
		title: 'Keep content',
		code: 'accordion/demos/keep-content/accordion-keep-content.ts',
		markup: 'accordion/demos/keep-content/accordion-keep-content.html',
		type: NgbdAccordionKeepContent,
	},
	config: {
		title: 'Global configuration of accordions',
		code: 'accordion/demos/config/accordion-config.ts',
		markup: 'accordion/demos/config/accordion-config.html',
		type: NgbdAccordionConfig,
	},
};

export const ROUTES: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'overview' },
	{
		path: '',
		component: ComponentWrapper,
		data: {
			bootstrap: 'https://getbootstrap.com/docs/%version%/components/accordion/',
			header: NgbdAcccordionDeprecationComponent,
		},
		providers: [
			{
				provide: ENVIRONMENT_INITIALIZER,
				multi: true,
				useValue: () => inject(NgbdDemoListService).register('accordion', DEMOS, OVERVIEW),
			},
		],
		children: [
			{ path: 'overview', component: NgbdAccordionOverviewComponent },
			{ path: 'examples', component: NgbdExamplesPage },
			{ path: 'api', component: NgbdApiPage },
		],
	},
];
