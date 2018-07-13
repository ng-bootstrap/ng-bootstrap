import { ModuleWithProviders } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { DefaultComponent } from './default';
import { GettingStarted } from './getting-started';

const DEFAULT_API_PATH = {
  path: '',
  pathMatch: 'full',
  redirectTo: 'examples'
};
const DEFAULT_API_PATH_OVERVIEW = {
  path: '',
  pathMatch: 'full',
  redirectTo: 'overview'
};

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: DefaultComponent },
  { path: 'getting-started', component: GettingStarted },
  { path: 'components', pathMatch: 'full', redirectTo: 'components/accordion' },
  {
    path: 'components/accordion',
    loadChildren: './components/accordion/accordion.module#NgbdAccordionModule'
  },
  {
    path: 'components/alert',
    loadChildren: './components/alert/alert.module#NgbdAlertModule'
  },
  {
    path: 'components/buttons',
    loadChildren: './components/buttons/buttons.module#NgbdButtonsModule'
  },
  {
    path: 'components/carousel',
    loadChildren: './components/carousel/carousel.module#NgbdCarouselModule'
  },
  {
    path: 'components/collapse',
    loadChildren: './components/collapse/collapse.module#NgbdCollapseModule'
  },
  {
    path: 'components/datepicker',
    loadChildren: './components/datepicker/datepicker.module#NgbdDatepickerModule'
  },
  {
    path: 'components/dropdown',
    loadChildren: './components/dropdown/dropdown.module#NgbdDropdownModule'
  },
  {
    path: 'components/modal',
    loadChildren: './components/modal/modal.module#NgbdModalModule'
  },
  {
    path: 'components/pagination',
    loadChildren: './components/pagination/pagination.module#NgbdPaginationModule'
  },
  {
    path: 'components/popover',
    loadChildren: './components/popover/popover.module#NgbdPopoverModule'
  },
  {
    path: 'components/progressbar',
    loadChildren: './components/progressbar/progressbar.module#NgbdProgressbarModule'
  },
  {
    path: 'components/rating',
    loadChildren: './components/rating/rating.module#NgbdRatingModule'
  },
  {
    path: 'components/tabs',
    loadChildren: './components/tabset/tabset.module#NgbdTabsetModule'
  },
  {
    path: 'components/timepicker',
    loadChildren: './components/timepicker/timepicker.module#NgbdTimepickerModule'
  },
  {
    path: 'components/tooltip',
    loadChildren: './components/tooltip/tooltip.module#NgbdTooltipModule'
  },
  {
    path: 'components/typeahead',
    loadChildren: './components/typeahead/typeahead.module#NgbdTypeaheadModule'
  },
  { path: '**', redirectTo: 'home' }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, {
  enableTracing: false,
  useHash: true,
  preloadingStrategy: PreloadAllModules
});
