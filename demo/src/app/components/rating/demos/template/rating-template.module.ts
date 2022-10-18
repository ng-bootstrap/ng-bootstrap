import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NgbdRatingTemplate } from './rating-template';

@NgModule({
	imports: [BrowserModule, NgbModule],
	declarations: [NgbdRatingTemplate],
	exports: [NgbdRatingTemplate],
	bootstrap: [NgbdRatingTemplate],
})
export class NgbdRatingTemplateModule {}
