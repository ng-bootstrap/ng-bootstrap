/* eslint-disable @typescript-eslint/no-var-requires */
import { ENVIRONMENT_INITIALIZER, inject } from '@angular/core';
import { Routes } from '@angular/router';
import { NgbdDemoListService } from '../../services/demo-list.service';
import { NgbdApiPage } from '../../shared/api-page/api-page.component';
import { ComponentWrapper } from '../../shared/component-wrapper/component-wrapper.component';
import { NgbdExamplesPage } from '../../shared/examples-page/examples.component';
import { NgbSliderBasic } from './demos/basic/slider-basic';

const DEMOS = {
	basic: {
		title: 'Basic demo',
		type: NgbSliderBasic,
		code: require('!!raw-loader!./demos/basic/slider-basic').default,
		markup: require('!!raw-loader!./demos/basic/slider-basic.html').default,
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
				useValue: () => inject(NgbdDemoListService).register('slider', DEMOS),
			},
		],
		children: [
			{ path: 'examples', component: NgbdExamplesPage },
			{ path: 'api', component: NgbdApiPage },
		],
	},
];
