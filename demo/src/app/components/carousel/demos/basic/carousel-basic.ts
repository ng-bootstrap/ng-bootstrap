import { Component } from '@angular/core';
import { NgbCarousel, NgbSlide } from '@ng-bootstrap/ng-bootstrap/carousel';

@Component({
	selector: 'ngbd-carousel-basic',
	imports: [NgbCarousel, NgbSlide],
	templateUrl: './carousel-basic.html',
})
export class NgbdCarouselBasic {
	images = [944, 1011, 984].map((n) => `https://picsum.photos/id/${n}/900/500`);
}
