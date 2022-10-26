/* eslint-disable @typescript-eslint/no-var-requires */
import { ComponentWrapper } from '../../shared/component-wrapper/component-wrapper.component';
import { NgbdApiPage } from '../../shared/api-page/api-page.component';
import { NgbdExamplesPage } from '../../shared/examples-page/examples.component';
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
import { ENVIRONMENT_INITIALIZER, inject } from '@angular/core';
import { NgbdDemoListService } from '../../services/demo-list.service';

const DEMOS = {
	basic: {
		title: 'Quick and easy tooltips',
		type: NgbdTooltipBasic,
		code: require('!!raw-loader!./demos/basic/tooltip-basic').default,
		markup: require('!!raw-loader!./demos/basic/tooltip-basic.html').default,
	},
	tplcontent: {
		title: 'HTML and bindings in tooltips',
		type: NgbdTooltipTplcontent,
		code: require('!!raw-loader!./demos/tplcontent/tooltip-tplcontent').default,
		markup: require('!!raw-loader!./demos/tplcontent/tooltip-tplcontent.html').default,
	},
	triggers: {
		title: 'Custom and manual triggers',
		type: NgbdTooltipTriggers,
		code: require('!!raw-loader!./demos/triggers/tooltip-triggers').default,
		markup: require('!!raw-loader!./demos/triggers/tooltip-triggers.html').default,
	},
	autoclose: {
		title: 'Automatic closing with keyboard and mouse',
		type: NgbdTooltipAutoclose,
		code: require('!!raw-loader!./demos/autoclose/tooltip-autoclose').default,
		markup: require('!!raw-loader!./demos/autoclose/tooltip-autoclose.html').default,
	},
	tplwithcontext: {
		title: 'Context and manual triggers',
		type: NgbdTooltipTplwithcontext,
		code: require('!!raw-loader!./demos/tplwithcontext/tooltip-tplwithcontext').default,
		markup: require('!!raw-loader!./demos/tplwithcontext/tooltip-tplwithcontext.html').default,
	},
	target: {
		title: 'Custom target',
		type: NgbdTooltipTarget,
		code: require('!!raw-loader!./demos/custom-target/tooltip-target').default,
		markup: require('!!raw-loader!./demos/custom-target/tooltip-target.html').default,
	},
	delay: {
		title: 'Open and close delays',
		type: NgbdTooltipDelay,
		code: require('!!raw-loader!./demos/delay/tooltip-delay').default,
		markup: require('!!raw-loader!./demos/delay/tooltip-delay.html').default,
	},
	container: {
		title: 'Append tooltip in the body',
		type: NgbdTooltipContainer,
		code: require('!!raw-loader!./demos/container/tooltip-container').default,
		markup: require('!!raw-loader!./demos/container/tooltip-container.html').default,
	},
	customclass: {
		title: 'Tooltip with custom class',
		type: NgbdTooltipCustomclass,
		code: require('!!raw-loader!./demos/customclass/tooltip-customclass').default,
		markup: require('!!raw-loader!./demos/customclass/tooltip-customclass.html').default,
	},
	config: {
		title: 'Global configuration of tooltips',
		type: NgbdTooltipConfig,
		code: require('!!raw-loader!./demos/config/tooltip-config').default,
		markup: require('!!raw-loader!./demos/config/tooltip-config.html').default,
	},
};

export const ROUTES: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'examples' },
	{
		path: '',
		component: ComponentWrapper,
		data: {
			bootstrap: 'https://getbootstrap.com/docs/%version%/components/tooltips/',
		},
		providers: [
			{
				provide: ENVIRONMENT_INITIALIZER,
				multi: true,
				useValue: () => inject(NgbdDemoListService).register('tooltip', DEMOS),
			},
		],
		children: [
			{ path: 'examples', component: NgbdExamplesPage },
			{ path: 'api', component: NgbdApiPage },
		],
	},
];
