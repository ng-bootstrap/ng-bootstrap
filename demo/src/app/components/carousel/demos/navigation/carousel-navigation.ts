import { Component, inject, signal } from '@angular/core';
import { NgbCarouselConfig, NgbCarousel, NgbSlide } from '@ng-bootstrap/ng-bootstrap/carousel';

@Component({
	selector: 'ngbd-carousel-navigation',
	imports: [NgbCarousel, NgbSlide],
	templateUrl: './carousel-navigation.html',
	providers: [NgbCarouselConfig],
})
export class NgbdCarouselNavigation {
	readonly showNavigationArrows = signal(false);
	readonly showNavigationIndicators = signal(false);
	images = [1055, 194, 368].map((n) => `https://picsum.photos/id/${n}/900/500`);

	constructor() {
		// customize default values of carousels used by this component tree
		const config = inject(NgbCarouselConfig);
		config.showNavigationArrows = true;
		config.showNavigationIndicators = true;
	}
}
