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
		code: require('!!raw-loader!./demos/basic/nav-basic').default,
		markup: require('!!raw-loader!./demos/basic/nav-basic.html').default,
	},
	markup: {
		title: 'Alternative markup',
		type: NgbdNavMarkup,
		code: require('!!raw-loader!./demos/markup/nav-markup').default,
		markup: require('!!raw-loader!./demos/markup/nav-markup.html').default,
	},
	vertical: {
		title: 'Vertical pills',
		type: NgbdNavVertical,
		code: require('!!raw-loader!./demos/vertical/nav-vertical').default,
		markup: require('!!raw-loader!./demos/vertical/nav-vertical.html').default,
	},
	selection: {
		title: 'Selecting navs',
		type: NgbdNavSelection,
		code: require('!!raw-loader!./demos/selection/nav-selection').default,
		markup: require('!!raw-loader!./demos/selection/nav-selection.html').default,
	},
	'keep-content': {
		title: 'Keep content',
		type: NgbdNavKeep,
		code: require('!!raw-loader!./demos/keep-content/nav-keep-content').default,
		markup: require('!!raw-loader!./demos/keep-content/nav-keep-content.html').default,
	},
	dynamic: {
		title: 'Dynamic navs',
		type: NgbdNavDynamic,
		code: require('!!raw-loader!./demos/dynamic/nav-dynamic').default,
		markup: require('!!raw-loader!./demos/dynamic/nav-dynamic.html').default,
	},
	'custom-style': {
		title: 'Custom style',
		type: NgbdNavCustomStyle,
		code: require('!!raw-loader!./demos/custom-style/nav-custom-style').default,
		markup: require('!!raw-loader!./demos/custom-style/nav-custom-style.html').default,
	},
	config: {
		title: 'Global configuration of navs',
		type: NgbdNavConfig,
		code: require('!!raw-loader!./demos/config/nav-config').default,
		markup: require('!!raw-loader!./demos/config/nav-config.html').default,
	},
};

export const ROUTES: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'overview' },
	{
		path: '',
		component: ComponentWrapper,
		data: {
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
