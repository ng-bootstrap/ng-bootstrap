/* eslint-disable @typescript-eslint/no-var-requires */
import { ComponentWrapper } from '../../shared/component-wrapper/component-wrapper.component';
import { NgbdApiPage } from '../../shared/api-page/api-page.component';
import { NgbdExamplesPage } from '../../shared/examples-page/examples.component';
import { NgbdRatingBasic } from './demos/basic/rating-basic';
import { NgbdRatingConfig } from './demos/config/rating-config';
import { NgbdRatingDecimal } from './demos/decimal/rating-decimal';
import { NgbdRatingEvents } from './demos/events/rating-events';
import { NgbdRatingForm } from './demos/form/rating-form';
import { NgbdRatingTemplate } from './demos/template/rating-template';
import { Routes } from '@angular/router';
import { ENVIRONMENT_INITIALIZER, inject } from '@angular/core';
import { NgbdDemoListService } from '../../services/demo-list.service';

const DEMOS = {
	basic: {
		title: 'Basic demo',
		type: NgbdRatingBasic,
		code: require('!!raw-loader!./demos/basic/rating-basic').default,
		markup: require('!!raw-loader!./demos/basic/rating-basic.html').default,
	},
	events: {
		title: 'Events and readonly ratings',
		type: NgbdRatingEvents,
		code: require('!!raw-loader!./demos/events/rating-events').default,
		markup: require('!!raw-loader!./demos/events/rating-events.html').default,
	},
	template: {
		title: 'Custom star template',
		type: NgbdRatingTemplate,
		code: require('!!raw-loader!./demos/template/rating-template').default,
		markup: require('!!raw-loader!./demos/template/rating-template.html').default,
	},
	decimal: {
		title: 'Custom decimal rating',
		type: NgbdRatingDecimal,
		code: require('!!raw-loader!./demos/decimal/rating-decimal').default,
		markup: require('!!raw-loader!./demos/decimal/rating-decimal.html').default,
	},
	form: {
		title: 'Form integration',
		type: NgbdRatingForm,
		code: require('!!raw-loader!./demos/form/rating-form').default,
		markup: require('!!raw-loader!./demos/form/rating-form.html').default,
	},
	config: {
		title: 'Global configuration of ratings',
		type: NgbdRatingConfig,
		code: require('!!raw-loader!./demos/config/rating-config').default,
		markup: require('!!raw-loader!./demos/config/rating-config.html').default,
	},
};

export const ROUTES: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'examples' },
	{
		path: '',
		component: ComponentWrapper,
		providers: [
			{
				provide: ENVIRONMENT_INITIALIZER,
				multi: true,
				useValue: () => inject(NgbdDemoListService).register('rating', DEMOS),
			},
		],
		children: [
			{ path: 'examples', component: NgbdExamplesPage },
			{ path: 'api', component: NgbdApiPage },
		],
	},
];
