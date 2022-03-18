import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NgbdOffcanvasConfig } from './offcanvas-config';

@NgModule({
  imports: [BrowserModule, NgbModule],
  declarations: [NgbdOffcanvasConfig],
  exports: [NgbdOffcanvasConfig],
  bootstrap: [NgbdOffcanvasConfig]
})
export class NgbdOffcanvasConfigModule {}
