import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NGB_RATING_DIRECTIVES} from './rating';

@NgModule({declarations: NGB_RATING_DIRECTIVES, exports: NGB_RATING_DIRECTIVES, imports: [CommonModule]})
export class NgbRatingModule {
}
