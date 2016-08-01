import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NGB_CAROUSEL_DIRECTIVES} from './carousel';

@NgModule({declarations: NGB_CAROUSEL_DIRECTIVES, exports: NGB_CAROUSEL_DIRECTIVES, imports: [CommonModule]})
export class NgbCarouselModule {
}
