import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {JsonpModule} from '@angular/http';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {Angulartics2, Angulartics2On} from 'angulartics2';
import {Angulartics2GoogleAnalytics} from 'angulartics2/src/providers/angulartics2-google-analytics';
import {Angulartics} from './angulartics2.workaround';

import {ContentWrapper} from './content-wrapper/content-wrapper.component';
import {SideNavComponent} from './side-nav/side-nav.component';

@NgModule({
  imports: [CommonModule, RouterModule],
  exports: [
    CommonModule,
    RouterModule,
    ContentWrapper,
    SideNavComponent,
    Angulartics2On,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    JsonpModule
  ],
  declarations: [
    ContentWrapper,
    SideNavComponent,
    Angulartics2On
  ],
  providers: [
    {provide: Angulartics2, useClass: Angulartics},
    Angulartics2GoogleAnalytics
  ],
})
export class NgbdSharedModule {}
