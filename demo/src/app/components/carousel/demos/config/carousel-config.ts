import { Component, inject } from '@angular/core';
import { NgbCarouselConfig, NgbCarousel, NgbSlide } from '@ng-bootstrap/ng-bootstrap/carousel';

@Component({
	selector: 'ngbd-carousel-config',
	imports: [NgbCarousel, NgbSlide],
	templateUrl: './carousel-config.html',
	providers: [NgbCarouselConfig],
})
export class NgbdCarouselConfig {
	images = [700, 533, 807, 124].map((n) => `https://picsum.photos/id/${n}/900/500`);

	constructor() {
		// customize default values of carousels used by this component tree
		const config = inject(NgbCarouselConfig);
		config.interval = 10000;
		config.wrap = false;
		config.keyboard = false;
		config.pauseOnHover = false;
	}
}
