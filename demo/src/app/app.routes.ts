import { provideRouter, RouterConfig } from '@angular/router';

import { HomeComponent } from './home';
import { NgbdAccordion, NgbdAlert, NgbdButtons } from './components';

const routes: RouterConfig = [
  { path: '', redirectTo: 'home' },
  { path: 'home', component: HomeComponent },
  { path: 'components/accordion', component: NgbdAccordion },
  { path: 'components/alert', component: NgbdAlert },
  { path: 'components/buttons', component: NgbdButtons }
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];
