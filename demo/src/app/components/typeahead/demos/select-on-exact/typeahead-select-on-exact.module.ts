import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbdTypeaheadSelectOnExact } from './typeahead-select-on-exact';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
	imports: [BrowserModule, FormsModule, NgbModule],
	declarations: [NgbdTypeaheadSelectOnExact],
	exports: [NgbdTypeaheadSelectOnExact],
	bootstrap: [NgbdTypeaheadSelectOnExact],
})
export class NgbdTypeaheadSelectOnExactModule {}
