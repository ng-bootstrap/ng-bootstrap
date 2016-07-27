import {enableProdMode} from '@angular/core';
import {bootstrap} from '@angular/platform-browser-dynamic';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {Angulartics2} from 'angulartics2';
import {Angulartics2GoogleAnalytics} from 'angulartics2/src/providers/angulartics2-google-analytics';

import {APP_ROUTER_PROVIDERS} from './app/app.routes';
import {AppComponent} from './app/app.component';
import {Angulartics} from './angulartics2.workaround';

// depending on the env mode, enable prod mode or add debugging modules
if (process.env.ENV === 'build') {
  enableProdMode();
}

bootstrap(AppComponent, [
  // core dependencies
  APP_ROUTER_PROVIDERS,
  {provide: LocationStrategy, useClass: HashLocationStrategy},

  // google analytics dependencies
  {provide: Angulartics2, useClass: Angulartics},
  Angulartics2GoogleAnalytics
]).catch(err => console.error(err));
