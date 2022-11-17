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
		code: require('!!raw-loader!./demos/basic/popover-basic').default,
		markup: require('!!raw-loader!./demos/basic/popover-basic.html').default,
	},
	tplcontent: {
		title: 'HTML and bindings in popovers',
		type: NgbdPopoverTplcontent,
		code: require('!!raw-loader!./demos/tplcontent/popover-tplcontent').default,
		markup: require('!!raw-loader!./demos/tplcontent/popover-tplcontent.html').default,
	},
	triggers: {
		title: 'Custom and manual triggers',
		type: NgbdPopoverTriggers,
		code: require('!!raw-loader!./demos/triggers/popover-triggers').default,
		markup: require('!!raw-loader!./demos/triggers/popover-triggers.html').default,
	},
	autoclose: {
		title: 'Automatic closing with keyboard and mouse',
		type: NgbdPopoverAutoclose,
		code: require('!!raw-loader!./demos/autoclose/popover-autoclose').default,
		markup: require('!!raw-loader!./demos/autoclose/popover-autoclose.html').default,
	},
	tplwithcontext: {
		title: 'Context and manual triggers',
		type: NgbdPopoverTplwithcontext,
		code: require('!!raw-loader!./demos/tplwithcontext/popover-tplwithcontext').default,
		markup: require('!!raw-loader!./demos/tplwithcontext/popover-tplwithcontext.html').default,
	},
	target: {
		title: 'Custom target',
		type: NgbdPopoverTarget,
		code: require('!!raw-loader!./demos/custom-target/popover-target').default,
		markup: require('!!raw-loader!./demos/custom-target/popover-target.html').default,
	},
	delay: {
		title: 'Open and close delays',
		type: NgbdPopoverDelay,
		code: require('!!raw-loader!./demos/delay/popover-delay').default,
		markup: require('!!raw-loader!./demos/delay/popover-delay.html').default,
	},
	visibility: {
		title: 'Popover visibility events',
		type: NgbdPopoverVisibility,
		code: require('!!raw-loader!./demos/visibility/popover-visibility').default,
		markup: require('!!raw-loader!./demos/visibility/popover-visibility.html').default,
	},
	container: {
		title: 'Append popover in the body',
		type: NgbdPopoverContainer,
		code: require('!!raw-loader!./demos/container/popover-container').default,
		markup: require('!!raw-loader!./demos/container/popover-container.html').default,
	},
	customclass: {
		title: 'Popover with custom class',
		type: NgbdPopoverCustomclass,
		code: require('!!raw-loader!./demos/customclass/popover-customclass').default,
		markup: require('!!raw-loader!./demos/customclass/popover-customclass.html').default,
	},
	options: {
		title: 'Popper options',
		type: NgbdPopoverOptions,
		code: require('!!raw-loader!./demos/options/popover-options').default,
		markup: require('!!raw-loader!./demos/options/popover-options.html').default,
	},
	config: {
		title: 'Global configuration of popovers',
		type: NgbdPopoverConfig,
		code: require('!!raw-loader!./demos/config/popover-config').default,
		markup: require('!!raw-loader!./demos/config/popover-config.html').default,
	},
};

export const ROUTES: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'examples' },
	{
		path: '',
		component: ComponentWrapper,
		data: {
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
