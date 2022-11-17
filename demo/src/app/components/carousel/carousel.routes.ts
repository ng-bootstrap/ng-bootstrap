/* eslint-disable @typescript-eslint/no-var-requires */
import { ENVIRONMENT_INITIALIZER, inject } from '@angular/core';
import { ComponentWrapper } from '../../shared/component-wrapper/component-wrapper.component';
import { NgbdDemoListService } from '../../services/demo-list.service';
import { NgbdApiPage } from '../../shared/api-page/api-page.component';
import { NgbdExamplesPage } from '../../shared/examples-page/examples.component';
import { NgbdCarouselBasic } from './demos/basic/carousel-basic';
import { NgbdCarouselConfig } from './demos/config/carousel-config';
import { NgbdCarouselNavigation } from './demos/navigation/carousel-navigation';
import { NgbdCarouselPause } from './demos/pause/carousel-pause';
import { Routes } from '@angular/router';

const DEMOS = {
	basic: {
		title: 'Carousel',
		type: NgbdCarouselBasic,
		code: require('!!raw-loader!./demos/basic/carousel-basic').default,
		markup: require('!!raw-loader!./demos/basic/carousel-basic.html').default,
	},
	navigation: {
		title: 'Navigation arrows and indicators',
		type: NgbdCarouselNavigation,
		code: require('!!raw-loader!./demos/navigation/carousel-navigation').default,
		markup: require('!!raw-loader!./demos/navigation/carousel-navigation.html').default,
	},
	pause: {
		title: 'Pause/cycle',
		type: NgbdCarouselPause,
		code: require('!!raw-loader!./demos/pause/carousel-pause').default,
		markup: require('!!raw-loader!./demos/pause/carousel-pause.html').default,
	},
	config: {
		title: 'Global configuration of carousels',
		type: NgbdCarouselConfig,
		code: require('!!raw-loader!./demos/config/carousel-config').default,
		markup: require('!!raw-loader!./demos/config/carousel-config.html').default,
	},
};

export const ROUTES: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'examples' },
	{
		path: '',
		component: ComponentWrapper,
		data: {
			bootstrap: 'https://getbootstrap.com/docs/%version%/components/carousel/',
		},
		providers: [
			{
				provide: ENVIRONMENT_INITIALIZER,
				multi: true,
				useValue: () => inject(NgbdDemoListService).register('carousel', DEMOS),
			},
		],
		children: [
			{ path: 'examples', component: NgbdExamplesPage },
			{ path: 'api', component: NgbdApiPage },
		],
	},
];
