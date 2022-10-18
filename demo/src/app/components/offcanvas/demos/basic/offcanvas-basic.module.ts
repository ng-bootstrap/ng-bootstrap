import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NgbdOffcanvasBasic } from './offcanvas-basic';

@NgModule({
	imports: [BrowserModule, NgbModule],
	declarations: [NgbdOffcanvasBasic],
	exports: [NgbdOffcanvasBasic],
	bootstrap: [NgbdOffcanvasBasic],
})
export class NgbdOffcanvasBasicModule {}
