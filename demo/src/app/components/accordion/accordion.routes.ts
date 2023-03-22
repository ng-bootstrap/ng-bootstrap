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
		code: require('!raw-loader!./demos/basic/accordion-basic').default,
		markup: require('!raw-loader!./demos/basic/accordion-basic.html').default,
		type: NgbdAccordionBasic,
	},
	static: {
		title: 'One open panel at a time',
		code: require('!!raw-loader!./demos/static/accordion-static').default,
		markup: require('!!raw-loader!./demos/static/accordion-static.html').default,
		type: NgbdAccordionStatic,
	},
	toggle: {
		title: 'Toggle panels',
		code: require('!!raw-loader!./demos/toggle/accordion-toggle').default,
		markup: require('!!raw-loader!./demos/toggle/accordion-toggle.html').default,
		type: NgbdAccordionToggle,
	},
	header: {
		title: 'Custom header',
		code: require('!!raw-loader!./demos/header/accordion-header').default,
		markup: require('!!raw-loader!./demos/header/accordion-header.html').default,
		type: NgbdAccordionHeader,
	},
	'keep-content': {
		title: 'Keep content',
		code: require('!raw-loader!./demos/keep-content/accordion-keep-content').default,
		markup: require('!raw-loader!./demos/keep-content/accordion-keep-content.html').default,
		type: NgbdAccordionKeepContent,
	},
	config: {
		title: 'Global configuration of accordions',
		code: require('!!raw-loader!./demos/config/accordion-config').default,
		markup: require('!!raw-loader!./demos/config/accordion-config.html').default,
		type: NgbdAccordionConfig,
	},
};

export const ROUTES: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'overview' },
	{
		path: '',
		component: ComponentWrapper,
		data: {
			bootstrap: 'https://getbootstrap.com/docs/%version%/components/collapse/#accordion-example',
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
