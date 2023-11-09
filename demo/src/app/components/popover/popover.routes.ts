/* eslint-disable @typescript-eslint/no-var-requires */
import { ComponentWrapper } from '../../shared/component-wrapper/component-wrapper.component';
import { NgbdApiPage } from '../../shared/api-page/api-page.component';
import { NgbdExamplesPage } from '../../shared/examples-page/examples.component';
import { NgbdPopoverAutoclose } from './demos/autoclose/popover-autoclose';
import { NgbdPopoverBasic } from './demos/basic/popover-basic';
import { NgbdPopoverConfig } from './demos/config/popover-config';
import { NgbdPopoverContainer } from './demos/container/popover-container';
import { NgbdPopoverCustomclass } from './demos/customclass/popover-customclass';
import { NgbdPopoverDelay } from './demos/delay/popover-delay';
import { NgbdPopoverTplcontent } from './demos/tplcontent/popover-tplcontent';
import { NgbdPopoverTplwithcontext } from './demos/tplwithcontext/popover-tplwithcontext';
import { NgbdPopoverTriggers } from './demos/triggers/popover-triggers';
import { NgbdPopoverVisibility } from './demos/visibility/popover-visibility';
import { NgbdPopoverTarget } from './demos/custom-target/popover-target';
import { Routes } from '@angular/router';
import { NgbdPopoverOptions } from './demos/options/popover-options';
import { ENVIRONMENT_INITIALIZER, inject } from '@angular/core';
import { NgbdDemoListService } from '../../services/demo-list.service';

const DEMOS = {
	basic: {
		title: 'Quick and easy popovers',
		type: NgbdPopoverBasic,
		code: 'popover/demos/basic/popover-basic.ts',
		markup: 'popover/demos/basic/popover-basic.html',
	},
	tplcontent: {
		title: 'HTML and bindings in popovers',
		type: NgbdPopoverTplcontent,
		code: 'popover/demos/tplcontent/popover-tplcontent.ts',
		markup: 'popover/demos/tplcontent/popover-tplcontent.html',
	},
	triggers: {
		title: 'Custom and manual triggers',
		type: NgbdPopoverTriggers,
		code: 'popover/demos/triggers/popover-triggers.ts',
		markup: 'popover/demos/triggers/popover-triggers.html',
	},
	autoclose: {
		title: 'Automatic closing with keyboard and mouse',
		type: NgbdPopoverAutoclose,
		code: 'popover/demos/autoclose/popover-autoclose.ts',
		markup: 'popover/demos/autoclose/popover-autoclose.html',
	},
	tplwithcontext: {
		title: 'Context and manual triggers',
		type: NgbdPopoverTplwithcontext,
		code: 'popover/demos/tplwithcontext/popover-tplwithcontext.ts',
		markup: 'popover/demos/tplwithcontext/popover-tplwithcontext.html',
	},
	target: {
		title: 'Custom target',
		type: NgbdPopoverTarget,
		code: 'popover/demos/custom-target/popover-target.ts',
		markup: 'popover/demos/custom-target/popover-target.html',
	},
	delay: {
		title: 'Open and close delays',
		type: NgbdPopoverDelay,
		code: 'popover/demos/delay/popover-delay.ts',
		markup: 'popover/demos/delay/popover-delay.html',
	},
	visibility: {
		title: 'Popover visibility events',
		type: NgbdPopoverVisibility,
		code: 'popover/demos/visibility/popover-visibility.ts',
		markup: 'popover/demos/visibility/popover-visibility.html',
	},
	container: {
		title: 'Append popover in the body',
		type: NgbdPopoverContainer,
		code: 'popover/demos/container/popover-container.ts',
		markup: 'popover/demos/container/popover-container.html',
	},
	customclass: {
		title: 'Popover with custom class',
		type: NgbdPopoverCustomclass,
		code: 'popover/demos/customclass/popover-customclass.ts',
		markup: 'popover/demos/customclass/popover-customclass.html',
	},
	options: {
		title: 'Popper options',
		type: NgbdPopoverOptions,
		code: 'popover/demos/options/popover-options.ts',
		markup: 'popover/demos/options/popover-options.html',
	},
	config: {
		title: 'Global configuration of popovers',
		type: NgbdPopoverConfig,
		code: 'popover/demos/config/popover-config.ts',
		markup: 'popover/demos/config/popover-config.html',
	},
};

export const ROUTES: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'examples' },
	{
		path: '',
		component: ComponentWrapper,
		data: {
			name: 'Popover',
			bootstrap: 'https://getbootstrap.com/docs/%version%/components/popovers/',
		},
		providers: [
			{
				provide: ENVIRONMENT_INITIALIZER,
				multi: true,
				useValue: () => inject(NgbdDemoListService).register('popover', DEMOS),
			},
		],
		children: [
			{ path: 'examples', component: NgbdExamplesPage },
			{ path: 'api', component: NgbdApiPage },
		],
	},
];
