import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NgbProgressbar, NgbProgressbarStack} from './progressbar';
import {NgbProgressbarConfig} from './progressbar-config';

export {NgbProgressbar, NgbProgressbarStack} from './progressbar';
export {NgbProgressbarConfig} from './progressbar-config';

@NgModule({
  declarations: [NgbProgressbar, NgbProgressbarStack],
  exports: [NgbProgressbar, NgbProgressbarStack],
  imports: [CommonModule]
})
export class NgbProgressbarModule {
  static forRoot(): ModuleWithProviders { return {ngModule: NgbProgressbarModule, providers: [NgbProgressbarConfig]}; }
}
