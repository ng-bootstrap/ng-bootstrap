import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NgbdDatepickerBuddhist } from './datepicker-buddhist';

@NgModule({
	imports: [BrowserModule, FormsModule, NgbModule],
	declarations: [NgbdDatepickerBuddhist],
	exports: [NgbdDatepickerBuddhist],
	bootstrap: [NgbdDatepickerBuddhist],
})
export class NgbdDatepickerBuddhistModule {}
