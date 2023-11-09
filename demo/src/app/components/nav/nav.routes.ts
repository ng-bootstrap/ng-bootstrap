/* eslint-disable @typescript-eslint/no-var-requires */
import { ComponentWrapper } from '../../shared/component-wrapper/component-wrapper.component';
import { NgbdApiPage } from '../../shared/api-page/api-page.component';
import { NgbdExamplesPage } from '../../shared/examples-page/examples.component';
import { NgbdNavBasic } from './demos/basic/nav-basic';
import { NgbdNavMarkup } from './demos/markup/nav-markup';
import { NgbdNavConfig } from './demos/config/nav-config';
import { NgbdNavCustomStyle } from './demos/custom-style/nav-custom-style';
import { NgbdNavSelection } from './demos/selection/nav-selection';
import { NgbdNavDynamic } from './demos/dynamic/nav-dynamic';
import { NgbdNavKeep } from './demos/keep-content/nav-keep-content';
import { NgbdNavOverviewComponent } from './overview/nav-overview.component';
import { NgbdNavVertical } from './demos/vertical/nav-vertical';
import { Routes } from '@angular/router';
import { ENVIRONMENT_INITIALIZER, inject } from '@angular/core';
import { NgbdDemoListService } from '../../services/demo-list.service';

const OVERVIEW = {
	'basic-usage': 'Basic Usage',
	customization: 'Customization',
	routing: 'Router integration',
	'keyboard-shortcuts': 'Keyboard shortcuts',
};

const DEMOS = {
	basic: {
		title: 'Basic navs',
		type: NgbdNavBasic,
		code: 'nav/demos/basic/nav-basic.ts',
		markup: 'nav/demos/basic/nav-basic.html',
	},
	markup: {
		title: 'Alternative markup',
		type: NgbdNavMarkup,
		code: 'nav/demos/markup/nav-markup.ts',
		markup: 'nav/demos/markup/nav-markup.html',
	},
	vertical: {
		title: 'Vertical pills',
		type: NgbdNavVertical,
		code: 'nav/demos/vertical/nav-vertical.ts',
		markup: 'nav/demos/vertical/nav-vertical.html',
	},
	selection: {
		title: 'Selecting navs',
		type: NgbdNavSelection,
		code: 'nav/demos/selection/nav-selection.ts',
		markup: 'nav/demos/selection/nav-selection.html',
	},
	'keep-content': {
		title: 'Keep content',
		type: NgbdNavKeep,
		code: 'nav/demos/keep-content/nav-keep-content.ts',
		markup: 'nav/demos/keep-content/nav-keep-content.html',
	},
	dynamic: {
		title: 'Dynamic navs',
		type: NgbdNavDynamic,
		code: 'nav/demos/dynamic/nav-dynamic.ts',
		markup: 'nav/demos/dynamic/nav-dynamic.html',
	},
	'custom-style': {
		title: 'Custom style',
		type: NgbdNavCustomStyle,
		code: 'nav/demos/custom-style/nav-custom-style.ts',
		markup: 'nav/demos/custom-style/nav-custom-style.html',
	},
	config: {
		title: 'Global configuration of navs',
		type: NgbdNavConfig,
		code: 'nav/demos/config/nav-config.ts',
		markup: 'nav/demos/config/nav-config.html',
	},
};

export const ROUTES: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'overview' },
	{
		path: '',
		component: ComponentWrapper,
		data: {
			name: 'Nav',
			bootstrap: 'https://getbootstrap.com/docs/%version%/components/navs/',
		},
		providers: [
			{
				provide: ENVIRONMENT_INITIALIZER,
				multi: true,
				useValue: () => inject(NgbdDemoListService).register('nav', DEMOS, OVERVIEW),
			},
		],
		children: [
			{ path: 'overview', component: NgbdNavOverviewComponent },
			{ path: 'examples', component: NgbdExamplesPage },
			{ path: 'api', component: NgbdApiPage },
		],
	},
];
