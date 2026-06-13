import { Component, signal, viewChild } from '@angular/core';
import { NgbCarousel, NgbSlide, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap/carousel';
import { FormsModule } from '@angular/forms';

@Component({
	selector: 'ngbd-carousel-pause',
	imports: [NgbCarousel, NgbSlide, FormsModule],
	templateUrl: './carousel-pause.html',
})
export class NgbdCarouselPause {
	images = [62, 83, 466, 965, 982, 1043, 738].map((n) => `https://picsum.photos/id/${n}/900/500`);

	readonly paused = signal(false);
	readonly unpauseOnArrow = signal(false);
	readonly pauseOnIndicator = signal(false);
	readonly pauseOnHover = signal(true);
	readonly pauseOnFocus = signal(true);

	readonly carousel = viewChild.required<NgbCarousel>('carousel');

	togglePaused() {
		if (this.paused()) {
			this.carousel().cycle();
		} else {
			this.carousel().pause();
		}
		this.paused.update((v) => !v);
	}

	onSlide(slideEvent: NgbSlideEvent) {
		if (
			this.unpauseOnArrow() &&
			slideEvent.paused &&
			(slideEvent.source === NgbSlideEventSource.ARROW_LEFT || slideEvent.source === NgbSlideEventSource.ARROW_RIGHT)
		) {
			this.togglePaused();
		}
		if (this.pauseOnIndicator() && !slideEvent.paused && slideEvent.source === NgbSlideEventSource.INDICATOR) {
			this.togglePaused();
		}
	}
}
