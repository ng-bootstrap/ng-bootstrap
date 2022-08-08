import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {NgbdCollapseHorizontal} from './collapse-horizontal';

@NgModule({
  imports: [BrowserModule, NgbModule],
  declarations: [NgbdCollapseHorizontal],
  exports: [NgbdCollapseHorizontal],
  bootstrap: [NgbdCollapseHorizontal]
})
export class NgbdCollapseHorizontalModule {
}
