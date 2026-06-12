import { inject, Injectable } from '@angular/core';
import { NgbConfig } from '@ng-bootstrap/ng-bootstrap/config';
import { Subject } from 'rxjs';

/**
 * A configuration service for the [NgbCarousel](#/components/carousel/api#NgbCarousel) component.
 *
 * You can inject this service, typically in your root component, and customize its properties
 * to provide default values for all carousels used in the application.
 */
@Injectable({ providedIn: 'root' })
export class NgbCarouselConfig {
	/**
	 * Stream to emit from when config is changed.
	 * Use this to notify components to trigger change detection
	 */
	readonly changes: Subject<void> = new Subject<void>();
	private _ngbConfig = inject(NgbConfig);
	private _animation: boolean;

	slideNumberLabel = $localize`:Currently selected slide number read by screen reader@@ngb.carousel.slide-number:Slide {{ i + 1 }} of {{ c }}`;
	previousLabel = $localize`:@@ngb.carousel.previous:Previous`;
	nextLabel = $localize`:@@ngb.carousel.next:Next`;

	interval = 5000;
	wrap = true;
	keyboard = true;
	pauseOnHover = true;
	pauseOnFocus = true;
	showNavigationArrows = true;
	showNavigationIndicators = true;

	/**
	 * @defaultValue `true`
	 */
	get animation(): boolean {
		return this._animation ?? this._ngbConfig.animation;
	}
	set animation(animation: boolean) {
		this._animation = animation;
	}
}
