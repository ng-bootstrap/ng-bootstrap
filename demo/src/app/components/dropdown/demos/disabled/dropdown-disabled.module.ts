import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NgbdDropdownDisabled } from './dropdown-disabled';

@NgModule({
  imports: [BrowserModule, NgbModule],
  declarations: [NgbdDropdownDisabled],
  exports: [NgbdDropdownDisabled],
  bootstrap: [NgbdDropdownDisabled]
})
export class NgbdDropdownDisabledModule {}
