import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NgbdOffcanvasOptions } from './offcanvas-options';

@NgModule({
	imports: [BrowserModule, NgbModule],
	declarations: [NgbdOffcanvasOptions],
	exports: [NgbdOffcanvasOptions],
	bootstrap: [NgbdOffcanvasOptions],
})
export class NgbdOffcanvasOptionsModule {}
