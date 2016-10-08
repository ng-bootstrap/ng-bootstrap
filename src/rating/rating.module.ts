import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgbRatingConfig} from './rating-config';

import {NgbRating} from './rating';

export {NgbRating} from './rating';
export {NgbRatingConfig} from './rating-config';

@NgModule({declarations: [NgbRating], exports: [NgbRating], imports: [CommonModule]})
export class NgbRatingModule {
  static forRoot(): ModuleWithProviders { return {ngModule: NgbRatingModule, providers: [NgbRatingConfig]}; }
}
