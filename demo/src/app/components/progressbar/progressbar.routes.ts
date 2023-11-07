/* eslint-disable @typescript-eslint/no-var-requires */
import { ComponentWrapper } from '../../shared/component-wrapper/component-wrapper.component';
import { NgbdApiPage } from '../../shared/api-page/api-page.component';
import { NgbdExamplesPage } from '../../shared/examples-page/examples.component';
import { NgbdProgressbarBasic } from './demos/basic/progressbar-basic';
import { NgbdProgressbarConfig } from './demos/config/progressbar-config';
import { NgbdProgressbarHeight } from './demos/height/progressbar-height';
import { NgbdProgressbarLabels } from './demos/labels/progressbar-labels';
import { NgbdProgressbarShowvalue } from './demos/showvalue/progressbar-showvalue';
import { NgbdProgressbarStriped } from './demos/striped/progressbar-striped';
import { NgbdProgressbarTextTypes } from './demos/texttypes/progressbar-texttypes';
import { Routes } from '@angular/router';
import { ENVIRONMENT_INITIALIZER, inject } from '@angular/core';
import { NgbdDemoListService } from '../../services/demo-list.service';

const DEMOS = {
	basic: {
		title: 'Contextual progress bars',
		type: NgbdProgressbarBasic,
		code: 'progressbar/demos/basic/progressbar-basic.ts',
		markup: 'progressbar/demos/basic/progressbar-basic.html',
	},
	texttypes: {
		title: 'Contextual text progress bars',
		type: NgbdProgressbarTextTypes,
		code: 'progressbar/demos/texttypes/progressbar-texttypes.ts',
		markup: 'progressbar/demos/texttypes/progressbar-texttypes.html',
	},
	showvalue: {
		title: 'Progress bars with current value labels',
		type: NgbdProgressbarShowvalue,
		code: 'progressbar/demos/showvalue/progressbar-showvalue.ts',
		markup: 'progressbar/demos/showvalue/progressbar-showvalue.html',
	},
	striped: {
		title: 'Striped progress bars',
		type: NgbdProgressbarStriped,
		code: 'progressbar/demos/striped/progressbar-striped.ts',
		markup: 'progressbar/demos/striped/progressbar-striped.html',
	},
	labels: {
		title: 'Progress bars with custom labels',
		type: NgbdProgressbarLabels,
		code: 'progressbar/demos/labels/progressbar-labels.ts',
		markup: 'progressbar/demos/labels/progressbar-labels.html',
	},
	height: {
		title: 'Progress bars with height',
		type: NgbdProgressbarHeight,
		code: 'progressbar/demos/height/progressbar-height.ts',
		markup: 'progressbar/demos/height/progressbar-height.html',
	},
	config: {
		title: 'Global configuration of progress bars',
		type: NgbdProgressbarConfig,
		code: 'progressbar/demos/config/progressbar-config.ts',
		markup: 'progressbar/demos/config/progressbar-config.html',
	},
};

export const ROUTES: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'examples' },
	{
		path: '',
		component: ComponentWrapper,
		data: {
			bootstrap: 'https://getbootstrap.com/docs/%version%/components/progress/',
		},
		providers: [
			{
				provide: ENVIRONMENT_INITIALIZER,
				multi: true,
				useValue: () => inject(NgbdDemoListService).register('progressbar', DEMOS),
			},
		],
		children: [
			{ path: 'examples', component: NgbdExamplesPage },
			{ path: 'api', component: NgbdApiPage },
		],
	},
];
