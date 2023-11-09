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
		code: 'carousel/demos/basic/carousel-basic.ts',
		markup: 'carousel/demos/basic/carousel-basic.html',
	},
	navigation: {
		title: 'Navigation arrows and indicators',
		type: NgbdCarouselNavigation,
		code: 'carousel/demos/navigation/carousel-navigation.ts',
		markup: 'carousel/demos/navigation/carousel-navigation.html',
	},
	pause: {
		title: 'Pause/cycle',
		type: NgbdCarouselPause,
		code: 'carousel/demos/pause/carousel-pause.ts',
		markup: 'carousel/demos/pause/carousel-pause.html',
	},
	config: {
		title: 'Global configuration of carousels',
		type: NgbdCarouselConfig,
		code: 'carousel/demos/config/carousel-config.ts',
		markup: 'carousel/demos/config/carousel-config.html',
	},
};

export const ROUTES: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'examples' },
	{
		path: '',
		component: ComponentWrapper,
		data: {
			name: 'Carousel',
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
