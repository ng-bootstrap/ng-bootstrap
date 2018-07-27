import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NGB_CAROUSEL_DIRECTIVES} from './carousel';

export {NgbCarousel, NgbSlide, NgbSlideEvent} from './carousel';
export {NgbCarouselConfig} from './carousel-config';

@NgModule({declarations: NGB_CAROUSEL_DIRECTIVES, exports: NGB_CAROUSEL_DIRECTIVES, imports: [CommonModule]})
export class NgbCarouselModule {
  /**
   * Importing with '.forRoot()' is no longer necessary, you can simply import the module.
   * Will be removed in 4.0.0.
   *
   * @deprecated 3.0.0
   */
  static forRoot(): ModuleWithProviders { return {ngModule: NgbCarouselModule}; }
}
