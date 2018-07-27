import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NgbProgressbar} from './progressbar';

export {NgbProgressbar} from './progressbar';
export {NgbProgressbarConfig} from './progressbar-config';

@NgModule({declarations: [NgbProgressbar], exports: [NgbProgressbar], imports: [CommonModule]})
export class NgbProgressbarModule {
  /**
   * Importing with '.forRoot()' is no longer necessary, you can simply import the module.
   * Will be removed in 4.0.0.
   *
   * @deprecated 3.0.0
   */
  static forRoot(): ModuleWithProviders { return {ngModule: NgbProgressbarModule}; }
}
