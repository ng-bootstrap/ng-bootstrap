import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {JsonpModule} from '@angular/http';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {ComponentWrapper} from './component-wrapper/component-wrapper.component';
import {PageWrapper} from './page-wrapper/page-wrapper.component';
import {SideNavComponent} from './side-nav/side-nav.component';
import {Analytics} from './analytics/analytics';

export {componentsList} from './side-nav/side-nav.component';

@NgModule({
  imports: [CommonModule, RouterModule, NgbModule],
  exports: [
    CommonModule,
    RouterModule,
    ComponentWrapper,
    PageWrapper,
    SideNavComponent,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    JsonpModule
  ],
  declarations: [
    ComponentWrapper,
    PageWrapper,
    SideNavComponent,
  ],
  providers: [Analytics]
})
export class NgbdSharedModule {
}
