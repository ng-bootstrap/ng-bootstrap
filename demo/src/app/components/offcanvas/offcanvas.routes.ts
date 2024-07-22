import { ComponentWrapper } from '../../shared/component-wrapper/component-wrapper.component';
import { NgbdApiPage } from '../../shared/api-page/api-page.component';
import { NgbdExamplesPageComponent } from '../../shared/examples-page/examples-page.component';
import { NgbdOffcanvasBasic } from './demos/basic/offcanvas-basic';
import { NgbdOffcanvasComponent } from './demos/component/offcanvas-component';
import { NgbdOffcanvasOptions } from './demos/options/offcanvas-options';
import { NgbdOffcanvasFocus } from './demos/focus/offcanvas-focus';
import { NgbdOffcanvasConfig } from './demos/config/offcanvas-config';
import { Routes } from '@angular/router';
import { COMPONENT_DATA, ComponentData } from '../../tokens';

const DATA: ComponentData = {
	name: 'Offcanvas',
	bootstrapUrl: 'https://getbootstrap.com/docs/%version%/components/offcanvas/',
	overview: {},
	demos: [
		{
			fragment: 'basic',
			title: 'Basic offcanvas',
			type: NgbdOffcanvasBasic,
			code: 'offcanvas/demos/basic/offcanvas-basic.ts',
			markup: 'offcanvas/demos/basic/offcanvas-basic.html',
		},
		{
			fragment: 'component',
			title: 'Components as content',
			type: NgbdOffcanvasComponent,
			code: 'offcanvas/demos/component/offcanvas-component.ts',
			markup: 'offcanvas/demos/component/offcanvas-component.html',
		},
		{
			fragment: 'options',
			title: 'Offcanvas options',
			type: NgbdOffcanvasOptions,
			code: 'offcanvas/demos/options/offcanvas-options.ts',
			markup: 'offcanvas/demos/options/offcanvas-options.html',
		},
		{
			fragment: 'focus',
			title: 'Focus management',
			type: NgbdOffcanvasFocus,
			code: 'offcanvas/demos/focus/offcanvas-focus.ts',
			markup: 'offcanvas/demos/focus/offcanvas-focus.html',
		},
		{
			fragment: 'config',
			title: 'Global configuration of Offcanvas',
			type: NgbdOffcanvasConfig,
			code: 'offcanvas/demos/config/offcanvas-config.ts',
			markup: 'offcanvas/demos/config/offcanvas-config.html',
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
