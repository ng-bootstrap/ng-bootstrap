import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NgbdTabsetDirectives } from './tabset-directives';

@NgModule({
  imports: [BrowserModule, NgbModule],
  declarations: [NgbdTabsetDirectives],
  exports: [NgbdTabsetDirectives],
  bootstrap: [NgbdTabsetDirectives]
})
export class NgbdTabsetDirectivesModule {}
