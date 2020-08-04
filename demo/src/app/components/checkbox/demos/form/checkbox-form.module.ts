import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgbdCheckboxForm} from './checkbox-form';

@NgModule({
  imports: [BrowserModule, ReactiveFormsModule, NgbModule],
  declarations: [NgbdCheckboxForm],
  exports: [NgbdCheckboxForm],
  bootstrap: [NgbdCheckboxForm]
})
export class NgbdCheckboxFormModule {
}
