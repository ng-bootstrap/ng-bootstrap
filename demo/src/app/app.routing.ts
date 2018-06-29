import {Routes, RouterModule} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {DefaultComponent} from './default';
import {GettingStarted} from './getting-started';
import {
  NgbdAccordion,
  NgbdAlert,
  NgbdButtons,
  NgbdCarousel,
  NgbdCollapse,
  NgbdDatepicker,
  NgbdDropdown,
  NgbdModal,
  NgbdPagination,
  NgbdPopover,
  NgbdProgressbar,
  NgbdRating,
  NgbdTabs,
  NgbdTimepicker,
  NgbdTooltip,
  NgbdTypeahead
} from './components';

const DEFAULT_API_PATH = {path: '', pathMatch: 'full', redirectTo: 'examples'};
const DEFAULT_API_PATH_OVERVIEW = {path: '', pathMatch: 'full', redirectTo: 'overview'};

const componentRoutes = [{
    path: 'components/accordion',
    children: [
      DEFAULT_API_PATH,
      {path: ':tab', component: NgbdAccordion}
    ]
  }, {
    path: 'components/alert',
    children: [
      DEFAULT_API_PATH,
      {path: ':tab', component: NgbdAlert}
    ]
  }, {
    path: 'components/buttons',
    children: [
      DEFAULT_API_PATH,
      {path: ':tab', component: NgbdButtons}
    ]
  }, {
    path: 'components/carousel',
    children: [
      DEFAULT_API_PATH,
      {path: ':tab', component: NgbdCarousel}
    ]
  }, {
    path: 'components/collapse',
    children: [
      DEFAULT_API_PATH,
      {path: ':tab', component: NgbdCollapse}
    ]
  }, {
    path: 'components/datepicker',
    children: [
      DEFAULT_API_PATH_OVERVIEW,
      {path: ':tab', component: NgbdDatepicker}
    ]
  }, {
    path: 'components/dropdown',
    children: [
      DEFAULT_API_PATH,
      {path: ':tab', component: NgbdDropdown}
    ]
  }, {
    path: 'components/modal',
    children: [
      DEFAULT_API_PATH,
      {path: ':tab', component: NgbdModal}
    ]
  }, {
    path: 'components/pagination',
    children: [
      DEFAULT_API_PATH,
      {path: ':tab', component: NgbdPagination}
    ]
  }, {
    path: 'components/popover',
    children: [
      DEFAULT_API_PATH,
      {path: ':tab', component: NgbdPopover}
    ]
  }, {
    path: 'components/progressbar',
    children: [
      DEFAULT_API_PATH,
      {path: ':tab', component: NgbdProgressbar}
    ]
  }, {
    path: 'components/rating',
    children: [
      DEFAULT_API_PATH,
      {path: ':tab', component: NgbdRating}
    ]
  }, {
    path: 'components/tabs',
    children: [
      DEFAULT_API_PATH,
      {path: ':tab', component: NgbdTabs}
    ]
  }, {
    path: 'components/timepicker',
    children: [
      DEFAULT_API_PATH,
      {path: ':tab', component: NgbdTimepicker}
    ]
  }, {
    path: 'components/tooltip',
    children: [
      DEFAULT_API_PATH,
      {path: ':tab', component: NgbdTooltip}
    ]
  }, {
    path: 'components/typeahead',
    children: [
      DEFAULT_API_PATH,
      {path: ':tab', component: NgbdTypeahead}
    ]
  }
];

const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'home'},
  {path: 'home', component: DefaultComponent},
  {path: 'getting-started', component: GettingStarted},
  {path: 'components', pathMatch: 'full', redirectTo: 'components/accordion' },
  ...componentRoutes,
  { path: '**', redirectTo: 'home' }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, {useHash: true});
