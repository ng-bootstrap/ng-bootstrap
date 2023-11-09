/* eslint-disable @typescript-eslint/no-var-requires */
import { ComponentWrapper } from '../../shared/component-wrapper/component-wrapper.component';
import { NgbdApiPage } from '../../shared/api-page/api-page.component';
import { DemoListComponent } from '../../shared/examples-page/demo-list.component';
import { NgbdRatingBasic } from './demos/basic/rating-basic';
import { NgbdRatingConfig } from './demos/config/rating-config';
import { NgbdRatingDecimal } from './demos/decimal/rating-decimal';
import { NgbdRatingEvents } from './demos/events/rating-events';
import { NgbdRatingForm } from './demos/form/rating-form';
import { NgbdRatingTemplate } from './demos/template/rating-template';
import { Routes } from '@angular/router';

const DEMOS = [
	{
		fragment: 'basic',
		title: 'Basic demo',
		type: NgbdRatingBasic,
		code: 'rating/demos/basic/rating-basic.ts',
		markup: 'rating/demos/basic/rating-basic.html',
	},
	{
		fragment: 'events',
		title: 'Events and readonly ratings',
		type: NgbdRatingEvents,
		code: 'rating/demos/events/rating-events.ts',
		markup: 'rating/demos/events/rating-events.html',
	},
	{
		fragment: 'template',
		title: 'Custom star template',
		type: NgbdRatingTemplate,
		code: 'rating/demos/template/rating-template.ts',
		markup: 'rating/demos/template/rating-template.html',
	},
	{
		fragment: 'decimal',
		title: 'Custom decimal rating',
		type: NgbdRatingDecimal,
		code: 'rating/demos/decimal/rating-decimal.ts',
		markup: 'rating/demos/decimal/rating-decimal.html',
	},
	{
		fragment: 'form',
		title: 'Form integration',
		type: NgbdRatingForm,
		code: 'rating/demos/form/rating-form.ts',
		markup: 'rating/demos/form/rating-form.html',
	},
	{
		fragment: 'config',
		title: 'Global configuration of ratings',
		type: NgbdRatingConfig,
		code: 'rating/demos/config/rating-config.ts',
		markup: 'rating/demos/config/rating-config.html',
	},
];

export const ROUTES: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'examples' },
	{
		path: '',
		component: ComponentWrapper,
		data: {
			name: 'Rating',
		},
		children: [
			{ path: 'examples', component: DemoListComponent, data: { demos: DEMOS } },
			{ path: 'api', component: NgbdApiPage },
		],
	},
];
