/* eslint-disable @typescript-eslint/no-var-requires */
import { ComponentWrapper } from '../../shared/component-wrapper/component-wrapper.component';
import { NgbdApiPage } from '../../shared/api-page/api-page.component';
import { DemoListComponent } from '../../shared/examples-page/demo-list.component';
import { NgbdProgressbarBasic } from './demos/basic/progressbar-basic';
import { NgbdProgressbarConfig } from './demos/config/progressbar-config';
import { NgbdProgressbarHeight } from './demos/height/progressbar-height';
import { NgbdProgressbarLabels } from './demos/labels/progressbar-labels';
import { NgbdProgressbarShowvalue } from './demos/showvalue/progressbar-showvalue';
import { NgbdProgressbarStriped } from './demos/striped/progressbar-striped';
import { NgbdProgressbarTextTypes } from './demos/texttypes/progressbar-texttypes';
import { Routes } from '@angular/router';

const DEMOS = [
	{
		fragment: 'basic',
		title: 'Contextual progress bars',
		type: NgbdProgressbarBasic,
		code: 'progressbar/demos/basic/progressbar-basic.ts',
		markup: 'progressbar/demos/basic/progressbar-basic.html',
	},
	{
		fragment: 'texttypes',
		title: 'Contextual text progress bars',
		type: NgbdProgressbarTextTypes,
		code: 'progressbar/demos/texttypes/progressbar-texttypes.ts',
		markup: 'progressbar/demos/texttypes/progressbar-texttypes.html',
	},
	{
		fragment: 'showvalue',
		title: 'Progress bars with current value labels',
		type: NgbdProgressbarShowvalue,
		code: 'progressbar/demos/showvalue/progressbar-showvalue.ts',
		markup: 'progressbar/demos/showvalue/progressbar-showvalue.html',
	},
	{
		fragment: 'striped',
		title: 'Striped progress bars',
		type: NgbdProgressbarStriped,
		code: 'progressbar/demos/striped/progressbar-striped.ts',
		markup: 'progressbar/demos/striped/progressbar-striped.html',
	},
	{
		fragment: 'labels',
		title: 'Progress bars with custom labels',
		type: NgbdProgressbarLabels,
		code: 'progressbar/demos/labels/progressbar-labels.ts',
		markup: 'progressbar/demos/labels/progressbar-labels.html',
	},
	{
		fragment: 'height',
		title: 'Progress bars with height',
		type: NgbdProgressbarHeight,
		code: 'progressbar/demos/height/progressbar-height.ts',
		markup: 'progressbar/demos/height/progressbar-height.html',
	},
	{
		fragment: 'config',
		title: 'Global configuration of progress bars',
		type: NgbdProgressbarConfig,
		code: 'progressbar/demos/config/progressbar-config.ts',
		markup: 'progressbar/demos/config/progressbar-config.html',
	},
];

export const ROUTES: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'examples' },
	{
		path: '',
		component: ComponentWrapper,
		data: {
			name: 'Progressbar',
			bootstrap: 'https://getbootstrap.com/docs/%version%/components/progress/',
		},
		children: [
			{ path: 'examples', component: DemoListComponent, data: { demos: DEMOS } },
			{ path: 'api', component: NgbdApiPage },
		],
	},
];
