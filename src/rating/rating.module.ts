import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NgbRating} from './rating';

export {NgbRating} from './rating';
export {NgbRatingConfig} from './rating-config';

@NgModule({declarations: [NgbRating], exports: [NgbRating], imports: [CommonModule]})
export class NgbRatingModule {
  /**
   * Importing with '.forRoot()' is no longer necessary, you can simply import the module.
   * Will be removed in 4.0.0.
   *
   * @deprecated 3.0.0
   */
  static forRoot(): ModuleWithProviders { return {ngModule: NgbRatingModule}; }
}
