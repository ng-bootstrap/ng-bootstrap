import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {DefaultComponent} from './default';
import {GettingStarted} from './getting-started';
import {AppComponent} from './app.component';
import {routing} from './app.routing';
import {NgbdDemoModule} from './components';
import {NgbdSharedModule} from './shared';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    DefaultComponent,
    GettingStarted
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    routing,
    NgbModule.forRoot(),
    NgbdDemoModule,
    NgbdSharedModule
  ],
  bootstrap: [AppComponent]
})
export class NgbdModule {
}
