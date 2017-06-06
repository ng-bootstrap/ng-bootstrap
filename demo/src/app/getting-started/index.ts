export * from './getting-started.component';

import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {GettingStarted} from './getting-started.component';
import {NgbdSharedModule} from '../shared';

const routes: Routes = [
  {path: '', component: GettingStarted},
];

@NgModule({
  imports: [NgbdSharedModule, RouterModule.forChild(routes)],
  declarations: [GettingStarted]
})
export class GettingStartedModule {}
