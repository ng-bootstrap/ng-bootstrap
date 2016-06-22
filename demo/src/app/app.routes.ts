import { provideRouter, RouterConfig } from '@angular/router';

import { HomeComponent } from './home';
import { AccordionComponent } from './components/accordion';

export const routes: RouterConfig = [
  { path: '', component: HomeComponent },
  { path: 'components/accordion', component: AccordionComponent }
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];
