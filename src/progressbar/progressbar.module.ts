import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NgbProgressbar, NgbProgressbarStack, NgbBar} from './progressbar';
import {NgbProgressbarConfig} from './progressbar-config';

export {NgbProgressbar, NgbProgressbarStack, NgbBar} from './progressbar';
export {NgbProgressbarConfig} from './progressbar-config';

@NgModule({
  declarations: [NgbProgressbar, NgbProgressbarStack, NgbBar],
  exports: [NgbProgressbar, NgbProgressbarStack, NgbBar],
  imports: [CommonModule]
})
export class NgbProgressbarModule {
  static forRoot(): ModuleWithProviders { return {ngModule: NgbProgressbarModule, providers: [NgbProgressbarConfig]}; }
}
