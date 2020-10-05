import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NgbdTypeaheadGrouping } from './typeahead-grouping';

@NgModule({
  imports: [BrowserModule, FormsModule, NgbModule],
  declarations: [NgbdTypeaheadGrouping],
  exports: [NgbdTypeaheadGrouping],
  bootstrap: [NgbdTypeaheadGrouping]
})
export class NgbdTypeaheadGroupingModule {}
