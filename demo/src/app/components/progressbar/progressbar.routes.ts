import { ComponentWrapper } from '../../shared/component-wrapper/component-wrapper.component';
import { NgbdApiPage } from '../../shared/api-page/api-page.component';
import { NgbdExamplesPageComponent } from '../../shared/examples-page/examples-page.component';
import { NgbdProgressbarBasic } from './demos/basic/progressbar-basic';
import { NgbdProgressbarConfig } from './demos/config/progressbar-config';
import { NgbdProgressbarHeight } from './demos/height/progressbar-height';
import { NgbdProgressbarLabels } from './demos/labels/progressbar-labels';
import { NgbdProgressbarShowvalue } from './demos/showvalue/progressbar-showvalue';
import { NgbdProgressbarStacked } from './demos/stacked/progressbar-stacked';
import { NgbdProgressbarStriped } from './demos/striped/progressbar-striped';
import { NgbdProgressbarTextTypes } from './demos/texttypes/progressbar-texttypes';
import { Routes } from '@angular/router';
import { COMPONENT_DATA, ComponentData } from '../../tokens';

const DATA: ComponentData = {
	name: 'Progressbar',
	bootstrapUrl: 'https://getbootstrap.com/docs/%version%/components/progress/',
	overview: {},
	demos: [
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
			fragment: 'stacked',
			title: 'Progress bars stacked',
			type: NgbdProgressbarStacked,
			code: 'progressbar/demos/stacked/progressbar-stacked.ts',
			markup: 'progressbar/demos/stacked/progressbar-stacked.html',
		},
		{
			fragment: 'config',
			title: 'Global configuration of progress bars',
			type: NgbdProgressbarConfig,
			code: 'progressbar/demos/config/progressbar-config.ts',
			markup: 'progressbar/demos/config/progressbar-config.html',
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
