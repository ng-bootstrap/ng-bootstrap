import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgbRatingConfig} from './rating-config';

import {NGB_RATING_DIRECTIVES} from './rating';

export {NgbRatingConfig} from './rating-config';

@NgModule({declarations: NGB_RATING_DIRECTIVES, exports: NGB_RATING_DIRECTIVES, imports: [CommonModule]})
export class NgbRatingModule {
  static forRoot(): ModuleWithProviders { return {ngModule: NgbRatingModule, providers: [NgbRatingConfig]}; }
}
