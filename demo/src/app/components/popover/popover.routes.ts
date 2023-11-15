import { ComponentWrapper } from '../../shared/component-wrapper/component-wrapper.component';
import { NgbdApiPage } from '../../shared/api-page/api-page.component';
import { DemoListComponent } from '../../shared/examples-page/demo-list.component';
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

const DEMOS = [
	{
		fragment: 'basic',
		title: 'Quick and easy popovers',
		type: NgbdPopoverBasic,
		code: 'popover/demos/basic/popover-basic.ts',
		markup: 'popover/demos/basic/popover-basic.html',
	},
	{
		fragment: 'tplcontent',
		title: 'HTML and bindings in popovers',
		type: NgbdPopoverTplcontent,
		code: 'popover/demos/tplcontent/popover-tplcontent.ts',
		markup: 'popover/demos/tplcontent/popover-tplcontent.html',
	},
	{
		fragment: 'triggers',
		title: 'Custom and manual triggers',
		type: NgbdPopoverTriggers,
		code: 'popover/demos/triggers/popover-triggers.ts',
		markup: 'popover/demos/triggers/popover-triggers.html',
	},
	{
		fragment: 'autoclose',
		title: 'Automatic closing with keyboard and mouse',
		type: NgbdPopoverAutoclose,
		code: 'popover/demos/autoclose/popover-autoclose.ts',
		markup: 'popover/demos/autoclose/popover-autoclose.html',
	},
	{
		fragment: 'tplwithcontext',
		title: 'Context and manual triggers',
		type: NgbdPopoverTplwithcontext,
		code: 'popover/demos/tplwithcontext/popover-tplwithcontext.ts',
		markup: 'popover/demos/tplwithcontext/popover-tplwithcontext.html',
	},
	{
		fragment: 'target',
		title: 'Custom target',
		type: NgbdPopoverTarget,
		code: 'popover/demos/custom-target/popover-target.ts',
		markup: 'popover/demos/custom-target/popover-target.html',
	},
	{
		fragment: 'delay',
		title: 'Open and close delays',
		type: NgbdPopoverDelay,
		code: 'popover/demos/delay/popover-delay.ts',
		markup: 'popover/demos/delay/popover-delay.html',
	},
	{
		fragment: 'visibility',
		title: 'Popover visibility events',
		type: NgbdPopoverVisibility,
		code: 'popover/demos/visibility/popover-visibility.ts',
		markup: 'popover/demos/visibility/popover-visibility.html',
	},
	{
		fragment: 'container',
		title: 'Append popover in the body',
		type: NgbdPopoverContainer,
		code: 'popover/demos/container/popover-container.ts',
		markup: 'popover/demos/container/popover-container.html',
	},
	{
		fragment: 'customclass',
		title: 'Popover with custom class',
		type: NgbdPopoverCustomclass,
		code: 'popover/demos/customclass/popover-customclass.ts',
		markup: 'popover/demos/customclass/popover-customclass.html',
	},
	{
		fragment: 'options',
		title: 'Popper options',
		type: NgbdPopoverOptions,
		code: 'popover/demos/options/popover-options.ts',
		markup: 'popover/demos/options/popover-options.html',
	},
	{
		fragment: 'config',
		title: 'Global configuration of popovers',
		type: NgbdPopoverConfig,
		code: 'popover/demos/config/popover-config.ts',
		markup: 'popover/demos/config/popover-config.html',
	},
];

export const ROUTES: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'examples' },
	{
		path: '',
		component: ComponentWrapper,
		data: {
			name: 'Popover',
			bootstrap: 'https://getbootstrap.com/docs/%version%/components/popovers/',
		},
		children: [
			{ path: 'examples', component: DemoListComponent, data: { demos: DEMOS } },
			{ path: 'api', component: NgbdApiPage },
		],
	},
];
