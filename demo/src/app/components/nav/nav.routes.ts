import { ComponentWrapper } from '../../shared/component-wrapper/component-wrapper.component';
import { NgbdApiPage } from '../../shared/api-page/api-page.component';
import { NgbdExamplesPageComponent } from '../../shared/examples-page/examples-page.component';
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
import { COMPONENT_DATA, ComponentData } from '../../tokens';

const DATA: ComponentData = {
	name: 'Nav',
	bootstrapUrl: 'https://getbootstrap.com/docs/%version%/components/navs/',
	overview: {
		'basic-usage': 'Basic Usage',
		customization: 'Customization',
		routing: 'Router integration',
		'keyboard-shortcuts': 'Keyboard shortcuts',
	},
	demos: [
		{
			fragment: 'basic',
			title: 'Basic navs',
			type: NgbdNavBasic,
			code: 'nav/demos/basic/nav-basic.ts',
			markup: 'nav/demos/basic/nav-basic.html',
		},
		{
			fragment: 'markup',
			title: 'Alternative markup',
			type: NgbdNavMarkup,
			code: 'nav/demos/markup/nav-markup.ts',
			markup: 'nav/demos/markup/nav-markup.html',
		},
		{
			fragment: 'vertical',
			title: 'Vertical pills',
			type: NgbdNavVertical,
			code: 'nav/demos/vertical/nav-vertical.ts',
			markup: 'nav/demos/vertical/nav-vertical.html',
		},
		{
			fragment: 'selection',
			title: 'Selecting navs',
			type: NgbdNavSelection,
			code: 'nav/demos/selection/nav-selection.ts',
			markup: 'nav/demos/selection/nav-selection.html',
		},
		{
			fragment: 'keep-content',
			title: 'Keep content',
			type: NgbdNavKeep,
			code: 'nav/demos/keep-content/nav-keep-content.ts',
			markup: 'nav/demos/keep-content/nav-keep-content.html',
		},
		{
			fragment: 'dynamic',
			title: 'Dynamic navs',
			type: NgbdNavDynamic,
			code: 'nav/demos/dynamic/nav-dynamic.ts',
			markup: 'nav/demos/dynamic/nav-dynamic.html',
		},
		{
			fragment: 'custom-style',
			title: 'Custom style',
			type: NgbdNavCustomStyle,
			code: 'nav/demos/custom-style/nav-custom-style.ts',
			markup: 'nav/demos/custom-style/nav-custom-style.html',
		},
		{
			fragment: 'config',
			title: 'Global configuration of navs',
			type: NgbdNavConfig,
			code: 'nav/demos/config/nav-config.ts',
			markup: 'nav/demos/config/nav-config.html',
		},
	],
};

export const ROUTES: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'overview' },
	{
		path: '',
		component: ComponentWrapper,
		providers: [{ provide: COMPONENT_DATA, useValue: DATA }],
		children: [
			{ path: 'overview', component: NgbdNavOverviewComponent },
			{ path: 'examples', component: NgbdExamplesPageComponent },
			{ path: 'api', component: NgbdApiPage },
		],
	},
];
