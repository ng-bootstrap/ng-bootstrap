import { ComponentWrapper } from '../../shared/component-wrapper/component-wrapper.component';
import { NgbdApiPage } from '../../shared/api-page/api-page.component';
import { DemoListComponent } from '../../shared/examples-page/demo-list.component';
import { NgbdToastCloseable } from './demos/closeable/toast-closeable';
import { NgbdToastCustomHeader } from './demos/custom-header/toast-custom-header';
import { NgbdToastGlobal } from './demos/howto-global/toast-global.component';
import { NgbdToastInline } from './demos/inline/toast-inline';
import { NgbdToastPreventAutohide } from './demos/prevent-autohide/toast-prevent-autohide';
import { NgbdToastOverviewComponent } from './overview/toast-overview.component';
import { Routes } from '@angular/router';

const OVERVIEW = {
	'inline-usage': 'Declarative usage',
	'toast-service': 'Building a toast management service',
};

const DEMOS = [
	{
		fragment: 'inline',
		title: 'Declarative inline usage',
		type: NgbdToastInline,
		code: 'toast/demos/inline/toast-inline.ts',
		markup: 'toast/demos/inline/toast-inline.html',
	},
	{
		fragment: 'custom-header',
		title: 'Using a Template as header',
		type: NgbdToastCustomHeader,
		code: 'toast/demos/custom-header/toast-custom-header.ts',
		markup: 'toast/demos/custom-header/toast-custom-header.html',
	},
	{
		fragment: 'closeable',
		title: 'Closeable toast',
		type: NgbdToastCloseable,
		code: 'toast/demos/closeable/toast-closeable.ts',
		markup: 'toast/demos/closeable/toast-closeable.html',
	},
	{
		fragment: 'prevent-autohide',
		title: 'Prevent autohide on mouseover',
		type: NgbdToastPreventAutohide,
		code: 'toast/demos/prevent-autohide/toast-prevent-autohide.ts',
		markup: 'toast/demos/prevent-autohide/toast-prevent-autohide.html',
	},
	{
		fragment: 'howto-global',
		title: 'Toast management service',
		type: NgbdToastGlobal,
		files: [
			{
				name: 'toast-service.ts',
				source: 'toast/demos/howto-global/toast-service.ts',
			},
			{
				name: 'toast-global.component.html',
				source: 'toast/demos/howto-global/toast-global.component.html',
			},
			{
				name: 'toast-global.component.ts',
				source: 'toast/demos/howto-global/toast-global.component.ts',
			},
			{
				name: 'toasts-container.component.ts',
				source: 'toast/demos/howto-global/toasts-container.component.ts',
			},
		],
	},
];

export const ROUTES: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'overview' },
	{
		path: '',
		component: ComponentWrapper,
		data: {
			name: 'Toast',
			bootstrap: `https://getbootstrap.com/docs/%version%/components/toasts/`,
		},
		children: [
			{
				path: 'overview',
				component: NgbdToastOverviewComponent,
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
