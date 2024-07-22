import { ComponentWrapper } from '../../shared/component-wrapper/component-wrapper.component';
import { NgbdApiPage } from '../../shared/api-page/api-page.component';
import { NgbdExamplesPageComponent } from '../../shared/examples-page/examples-page.component';
import { NgbdCarouselBasic } from './demos/basic/carousel-basic';
import { NgbdCarouselConfig } from './demos/config/carousel-config';
import { NgbdCarouselNavigation } from './demos/navigation/carousel-navigation';
import { NgbdCarouselPause } from './demos/pause/carousel-pause';
import { Routes } from '@angular/router';
import { COMPONENT_DATA, ComponentData } from '../../tokens';

const DATA: ComponentData = {
	name: 'Carousel',
	bootstrapUrl: 'https://getbootstrap.com/docs/%version%/components/carousel/',
	overview: {},
	demos: [
		{
			fragment: 'basic',
			title: 'Carousel',
			type: NgbdCarouselBasic,
			code: 'carousel/demos/basic/carousel-basic.ts',
			markup: 'carousel/demos/basic/carousel-basic.html',
		},
		{
			fragment: 'navigation',
			title: 'Navigation arrows and indicators',
			type: NgbdCarouselNavigation,
			code: 'carousel/demos/navigation/carousel-navigation.ts',
			markup: 'carousel/demos/navigation/carousel-navigation.html',
		},
		{
			fragment: 'pause',
			title: 'Pause/cycle',
			type: NgbdCarouselPause,
			code: 'carousel/demos/pause/carousel-pause.ts',
			markup: 'carousel/demos/pause/carousel-pause.html',
		},
		{
			fragment: 'config',
			title: 'Global configuration of carousels',
			type: NgbdCarouselConfig,
			code: 'carousel/demos/config/carousel-config.ts',
			markup: 'carousel/demos/config/carousel-config.html',
		},
	],
};

export const ROUTES: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'examples' },
	{
		path: '',
		component: ComponentWrapper,
		providers: [{ provide: COMPONENT_DATA, useValue: DATA }],
		children: [
			{ path: 'examples', component: NgbdExamplesPageComponent },
			{ path: 'api', component: NgbdApiPage },
		],
	},
];
