import { NgModule } from '@angular/core';
import { NgbCarousel, NgbSlide } from './carousel';

export { NgbCarousel, NgbSlide, NgbSlideEvent, NgbSlideEventSource } from './carousel';
export { NgbSlideEventDirection } from './carousel-transition';
export { NgbCarouselConfig } from './carousel-config';

@NgModule({
	imports: [NgbCarousel, NgbSlide],
	exports: [NgbCarousel, NgbSlide],
})
export class NgbCarouselModule {}
