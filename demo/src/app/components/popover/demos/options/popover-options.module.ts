import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NgbdPopoverOptions } from './popover-options';

@NgModule({
	imports: [BrowserModule, NgbModule],
	declarations: [NgbdPopoverOptions],
	exports: [NgbdPopoverOptions],
	bootstrap: [NgbdPopoverOptions],
})
export class NgbdPopoverOptionsModule {}
