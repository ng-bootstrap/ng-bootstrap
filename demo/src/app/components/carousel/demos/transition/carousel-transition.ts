import { Component } from '@angular/core';
import { NgbCarouselConfig, NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'ngbd-carousel-transition',
	standalone: true,
	imports: [NgbCarouselModule],
	templateUrl: './carousel-transition.html',
	providers: [NgbCarouselConfig], // add NgbCarouselConfig to the component providers
})
export class NgbdCarouselTransition {
	fade = true;
	images = [1055, 194, 368].map((n) => `https://picsum.photos/id/${n}/900/500`);
}
