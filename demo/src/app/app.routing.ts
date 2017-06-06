import {Routes, RouterModule} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {DefaultComponent} from './default';

const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'home'},
  {path: 'home', component: DefaultComponent},
  {path: 'getting-started', loadChildren: 'demo/src/app/getting-started/index#GettingStartedModule'},
  {path: 'components', loadChildren: 'demo/src/app/components/index#NgbdDemoModule'}
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, {useHash: true});
