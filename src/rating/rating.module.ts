import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgbRatingConfig} from './rating-config';

import {NGB_RATING_DIRECTIVES} from './rating';

export {NgbRatingConfig} from './rating-config';

@NgModule({
  declarations: NGB_RATING_DIRECTIVES,
  exports: NGB_RATING_DIRECTIVES,
  imports: [CommonModule],
  providers: [NgbRatingConfig]
})
export class NgbRatingModule {
}
