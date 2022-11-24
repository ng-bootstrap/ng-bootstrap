import { Component } from '@angular/core';
import { NgbCarouselConfig, NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { NgFor, NgIf } from '@angular/common';

@Component({
	selector: 'ngbd-carousel-navigation',
	standalone: true,
	imports: [NgbCarouselModule, NgIf, NgFor],
	templateUrl: './carousel-navigation.html',
	providers: [NgbCarouselConfig], // add NgbCarouselConfig to the component providers
})
export class NgbdCarouselNavigation {
	showNavigationArrows = false;
	showNavigationIndicators = false;
	images = [1055, 194, 368].map((n) => `https://picsum.photos/id/${n}/900/500`);

	constructor(config: NgbCarouselConfig) {
		// customize default values of carousels used by this component tree
		config.showNavigationArrows = true;
		config.showNavigationIndicators = true;
	}
}
