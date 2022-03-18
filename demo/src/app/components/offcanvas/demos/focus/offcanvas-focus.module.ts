import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import {
  NgbdOffcanvasFirstFocus,
  NgbdOffcanvasAutoFocus,
  NgbdOffcanvasFocus
} from './offcanvas-focus';

@NgModule({
  imports: [BrowserModule, NgbModule],
  declarations: [NgbdOffcanvasFocus, NgbdOffcanvasFirstFocus, NgbdOffcanvasAutoFocus],
  exports: [NgbdOffcanvasFocus],
  bootstrap: [NgbdOffcanvasFocus]
})
export class NgbdOffcanvasFocusModule {}
