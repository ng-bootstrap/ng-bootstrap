import { Routes } from '@angular/router';

import { ROUTES as ACCORDION_ROUTES } from './components/accordion/accordion.routes';
import { ROUTES as ALERT_ROUTES } from './components/alert/alert.routes';
import { ROUTES as CAROUSEL_ROUTES } from './components/carousel/carousel.routes';
import { ROUTES as COLLAPSE_ROUTES } from './components/collapse/collapse.routes';
import { ROUTES as DATEPICKER_ROUTES } from './components/datepicker/datepicker.routes';
import { ROUTES as DROPDOWN_ROUTES } from './components/dropdown/dropdown.routes';
import { ROUTES as MODAL_ROUTES } from './components/modal/modal.routes';
import { ROUTES as NAV_ROUTES } from './components/nav/nav.routes';
import { ROUTES as OFFCANVAS_ROUTES } from './components/offcanvas/offcanvas.routes';
import { ROUTES as PAGINATION_ROUTES } from './components/pagination/pagination.routes';
import { ROUTES as POPOVER_ROUTES } from './components/popover/popover.routes';
import { ROUTES as PROGRESSBAR_ROUTES } from './components/progressbar/progressbar.routes';
import { ROUTES as RATING_ROUTES } from './components/rating/rating.routes';
import { ROUTES as TABLE_ROUTES } from './components/table/table.routes';
import { ROUTES as TIMEPICKER_ROUTES } from './components/timepicker/timepicker.routes';
import { ROUTES as TOAST_ROUTES } from './components/toast/toast.routes';
import { ROUTES as TOOLTIP_ROUTES } from './components/tooltip/tooltip.routes';
import { ROUTES as TYPEAHEAD_ROUTES } from './components/typeahead/typeahead.routes';
import { DefaultComponent } from './default';
import { GettingStartedPage } from './pages/getting-started/getting-started.component';
import { AnimationsPage } from './pages/animations/animations.component';
import { I18nPage } from './pages/i18n/i18n.component';
import { PositioningPage } from './pages/positioning/positioning.component';

export const ROUTES: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'home' },
	{ path: 'home', component: DefaultComponent },
	{ path: 'getting-started', component: GettingStartedPage },
	{ path: 'animations', redirectTo: 'guides/animations' },
	{ path: 'positioning', redirectTo: 'guides/positioning' },
	{
		path: 'guides',
		children: [
			{ path: '', pathMatch: 'full', redirectTo: 'animations' },
			{ path: 'animations', component: AnimationsPage },
			{ path: 'i18n', component: I18nPage },
			{ path: 'positioning', component: PositioningPage },
		],
	},
	{ path: 'components', pathMatch: 'full', redirectTo: 'components/accordion' },
	{ path: 'components/accordion', children: ACCORDION_ROUTES },
	{ path: 'components/alert', children: ALERT_ROUTES },
	{ path: 'components/carousel', children: CAROUSEL_ROUTES },
	{ path: 'components/collapse', children: COLLAPSE_ROUTES },
	{ path: 'components/datepicker', children: DATEPICKER_ROUTES },
	{ path: 'components/dropdown', children: DROPDOWN_ROUTES },
	{ path: 'components/modal', children: MODAL_ROUTES },
	{ path: 'components/nav', children: NAV_ROUTES },
	{ path: 'components/offcanvas', children: OFFCANVAS_ROUTES },
	{ path: 'components/pagination', children: PAGINATION_ROUTES },
	{ path: 'components/popover', children: POPOVER_ROUTES },
	{ path: 'components/progressbar', children: PROGRESSBAR_ROUTES },
	{ path: 'components/rating', children: RATING_ROUTES },
	{ path: 'components/table', children: TABLE_ROUTES },
	{ path: 'components/tabset', redirectTo: 'components/nav' },
	{ path: 'components/toast', children: TOAST_ROUTES },
	{ path: 'components/timepicker', children: TIMEPICKER_ROUTES },
	{ path: 'components/tooltip', children: TOOLTIP_ROUTES },
	{ path: 'components/typeahead', children: TYPEAHEAD_ROUTES },
	{ path: '**', redirectTo: 'home' },
];
