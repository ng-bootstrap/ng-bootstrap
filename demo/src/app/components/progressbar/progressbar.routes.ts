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
		code: require('!!raw-loader!./demos/basic/progressbar-basic').default,
		markup: require('!!raw-loader!./demos/basic/progressbar-basic.html').default,
	},
	texttypes: {
		title: 'Contextual text progress bars',
		type: NgbdProgressbarTextTypes,
		code: require('!!raw-loader!./demos/texttypes/progressbar-texttypes').default,
		markup: require('!!raw-loader!./demos/texttypes/progressbar-texttypes.html').default,
	},
	showvalue: {
		title: 'Progress bars with current value labels',
		type: NgbdProgressbarShowvalue,
		code: require('!!raw-loader!./demos/showvalue/progressbar-showvalue').default,
		markup: require('!!raw-loader!./demos/showvalue/progressbar-showvalue.html').default,
	},
	striped: {
		title: 'Striped progress bars',
		type: NgbdProgressbarStriped,
		code: require('!!raw-loader!./demos/striped/progressbar-striped').default,
		markup: require('!!raw-loader!./demos/striped/progressbar-striped.html').default,
	},
	labels: {
		title: 'Progress bars with custom labels',
		type: NgbdProgressbarLabels,
		code: require('!!raw-loader!./demos/labels/progressbar-labels').default,
		markup: require('!!raw-loader!./demos/labels/progressbar-labels.html').default,
	},
	height: {
		title: 'Progress bars with height',
		type: NgbdProgressbarHeight,
		code: require('!!raw-loader!./demos/height/progressbar-height').default,
		markup: require('!!raw-loader!./demos/height/progressbar-height.html').default,
	},
	config: {
		title: 'Global configuration of progress bars',
		type: NgbdProgressbarConfig,
		code: require('!!raw-loader!./demos/config/progressbar-config').default,
		markup: require('!!raw-loader!./demos/config/progressbar-config.html').default,
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
