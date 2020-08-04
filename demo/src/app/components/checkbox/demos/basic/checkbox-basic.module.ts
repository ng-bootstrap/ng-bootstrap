import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgbdCheckboxBasic} from './checkbox-basic';


@NgModule({
  imports: [BrowserModule, NgbModule],
  declarations: [NgbdCheckboxBasic],
  exports: [NgbdCheckboxBasic],
  bootstrap: [NgbdCheckboxBasic]
})
export class NgbdCheckboxBasicModule {
}
