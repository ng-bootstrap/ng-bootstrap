import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NgbdNavBasicWithButton } from './nav-basic-with-button';

@NgModule({
  imports: [BrowserModule, NgbModule],
  declarations: [NgbdNavBasicWithButton],
  exports: [NgbdNavBasicWithButton],
  bootstrap: [NgbdNavBasicWithButton]
})
export class NgbdNavBasicWithButtonModule {
}
