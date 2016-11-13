import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {DefaultComponent} from './default';
import {AppComponent} from './app.component';
import {routing} from './app.routing';
import {NgbdSharedModule} from './shared';

@NgModule({
  declarations: [
    AppComponent,
    DefaultComponent
  ],
  imports: [
    BrowserModule,
    routing,
    NgbdSharedModule
  ],
  bootstrap: [AppComponent]
})
export class NgbdModule {}
