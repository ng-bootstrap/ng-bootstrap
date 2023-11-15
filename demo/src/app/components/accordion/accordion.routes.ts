import { ComponentWrapper } from '../../shared/component-wrapper/component-wrapper.component';
import { NgbdApiPage } from '../../shared/api-page/api-page.component';
import { DemoListComponent } from '../../shared/examples-page/demo-list.component';
import { NgbdAccordionBasic } from './demos/basic/accordion-basic';
import { NgbdAccordionConfig } from './demos/config/accordion-config';
import { NgbdAccordionHeader } from './demos/header/accordion-header';
import { NgbdAccordionStatic } from './demos/static/accordion-static';
import { NgbdAccordionToggle } from './demos/toggle/accordion-toggle';
import { NgbdAccordionKeepContent } from './demos/keep-content/accordion-keep-content';
import { Routes } from '@angular/router';
import { NgbdAccordionOverviewComponent } from './overview/accordion-overview.component';
import { NgbdAcccordionDeprecationComponent } from './accordion-deprecation.component';

const OVERVIEW = {
	'basic-usage': 'Basic Usage',
	features: 'Features',
	customization: 'Customization',
};

const DEMOS = [
	{
		fragment: 'basic',
		title: 'Accordion',
		code: 'accordion/demos/basic/accordion-basic.ts',
		markup: 'accordion/demos/basic/accordion-basic.html',
		type: NgbdAccordionBasic,
	},
	{
		fragment: 'static',
		title: 'One open panel at a time',
		code: 'accordion/demos/static/accordion-static.ts',
		markup: 'accordion/demos/static/accordion-static.html',
		type: NgbdAccordionStatic,
	},
	{
		fragment: 'toggle',
		title: 'Toggle panels',
		code: 'accordion/demos/toggle/accordion-toggle.ts',
		markup: 'accordion/demos/toggle/accordion-toggle.html',
		type: NgbdAccordionToggle,
	},
	{
		fragment: 'header',
		title: 'Custom header',
		code: 'accordion/demos/header/accordion-header.ts',
		markup: 'accordion/demos/header/accordion-header.html',
		type: NgbdAccordionHeader,
	},
	{
		fragment: 'keep-content',
		title: 'Keep content',
		code: 'accordion/demos/keep-content/accordion-keep-content.ts',
		markup: 'accordion/demos/keep-content/accordion-keep-content.html',
		type: NgbdAccordionKeepContent,
	},
	{
		fragment: 'config',
		title: 'Global configuration of accordions',
		code: 'accordion/demos/config/accordion-config.ts',
		markup: 'accordion/demos/config/accordion-config.html',
		type: NgbdAccordionConfig,
	},
];

export const ROUTES: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'overview' },
	{
		path: '',
		component: ComponentWrapper,
		data: {
			name: 'Accordion',
			bootstrap: 'https://getbootstrap.com/docs/%version%/components/accordion/',
			header: NgbdAcccordionDeprecationComponent,
		},
		children: [
			{
				path: 'overview',
				component: NgbdAccordionOverviewComponent,
				data: { overview: OVERVIEW },
			},
			{
				path: 'examples',
				component: DemoListComponent,
				data: { demos: DEMOS },
			},
			{ path: 'api', component: NgbdApiPage },
		],
	},
];
