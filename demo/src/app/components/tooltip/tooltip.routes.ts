import { ComponentWrapper } from '../../shared/component-wrapper/component-wrapper.component';
import { NgbdApiPage } from '../../shared/api-page/api-page.component';
import { NgbdExamplesPageComponent } from '../../shared/examples-page/examples-page.component';
import { NgbdTooltipAutoclose } from './demos/autoclose/tooltip-autoclose';
import { NgbdTooltipBasic } from './demos/basic/tooltip-basic';
import { NgbdTooltipConfig } from './demos/config/tooltip-config';
import { NgbdTooltipContainer } from './demos/container/tooltip-container';
import { NgbdTooltipCustomclass } from './demos/customclass/tooltip-customclass';
import { NgbdTooltipDelay } from './demos/delay/tooltip-delay';
import { NgbdTooltipTarget } from './demos/custom-target/tooltip-target';
import { NgbdTooltipTplcontent } from './demos/tplcontent/tooltip-tplcontent';
import { NgbdTooltipTplwithcontext } from './demos/tplwithcontext/tooltip-tplwithcontext';
import { NgbdTooltipTriggers } from './demos/triggers/tooltip-triggers';
import { Routes } from '@angular/router';
import { COMPONENT_DATA, ComponentData } from '../../tokens';

const DATA: ComponentData = {
	name: 'Tooltip',
	bootstrapUrl: 'https://getbootstrap.com/docs/%version%/components/tooltips/',
	overview: {},
	demos: [
		{
			fragment: 'basic',
			title: 'Quick and easy tooltips',
			type: NgbdTooltipBasic,
			code: 'tooltip/demos/basic/tooltip-basic.ts',
			markup: 'tooltip/demos/basic/tooltip-basic.html',
		},
		{
			fragment: 'tplcontent',
			title: 'HTML and bindings in tooltips',
			type: NgbdTooltipTplcontent,
			code: 'tooltip/demos/tplcontent/tooltip-tplcontent.ts',
			markup: 'tooltip/demos/tplcontent/tooltip-tplcontent.html',
		},
		{
			fragment: 'triggers',
			title: 'Custom and manual triggers',
			type: NgbdTooltipTriggers,
			code: 'tooltip/demos/triggers/tooltip-triggers.ts',
			markup: 'tooltip/demos/triggers/tooltip-triggers.html',
		},
		{
			fragment: 'autoclose',
			title: 'Automatic closing with keyboard and mouse',
			type: NgbdTooltipAutoclose,
			code: 'tooltip/demos/autoclose/tooltip-autoclose.ts',
			markup: 'tooltip/demos/autoclose/tooltip-autoclose.html',
		},
		{
			fragment: 'tplwithcontext',
			title: 'Context and manual triggers',
			type: NgbdTooltipTplwithcontext,
			code: 'tooltip/demos/tplwithcontext/tooltip-tplwithcontext.ts',
			markup: 'tooltip/demos/tplwithcontext/tooltip-tplwithcontext.html',
		},
		{
			fragment: 'target',
			title: 'Custom target',
			type: NgbdTooltipTarget,
			code: 'tooltip/demos/custom-target/tooltip-target.ts',
			markup: 'tooltip/demos/custom-target/tooltip-target.html',
		},
		{
			fragment: 'delay',
			title: 'Open and close delays',
			type: NgbdTooltipDelay,
			code: 'tooltip/demos/delay/tooltip-delay.ts',
			markup: 'tooltip/demos/delay/tooltip-delay.html',
		},
		{
			fragment: 'container',
			title: 'Append tooltip in the body',
			type: NgbdTooltipContainer,
			code: 'tooltip/demos/container/tooltip-container.ts',
			markup: 'tooltip/demos/container/tooltip-container.html',
		},
		{
			fragment: 'customclass',
			title: 'Tooltip with custom class',
			type: NgbdTooltipCustomclass,
			code: 'tooltip/demos/customclass/tooltip-customclass.ts',
			markup: 'tooltip/demos/customclass/tooltip-customclass.html',
		},
		{
			fragment: 'config',
			title: 'Global configuration of tooltips',
			type: NgbdTooltipConfig,
			code: 'tooltip/demos/config/tooltip-config.ts',
			markup: 'tooltip/demos/config/tooltip-config.html',
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
