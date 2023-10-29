import { inject, Injectable } from '@angular/core';
import { NgbConfig } from '../ngb-config';

/**
 * A configuration service for the [NgbCarousel](#/components/carousel/api#NgbCarousel) component.
 *
 * You can inject this service, typically in your root component, and customize its properties
 * to provide default values for all carousels used in the application.
 */
@Injectable({ providedIn: 'root' })
export class NgbCarouselConfig {
	private _ngbConfig = inject(NgbConfig);
	private _animation: boolean;

	interval = 5000;
	wrap = true;
	keyboard = true;
	pauseOnHover = true;
	pauseOnFocus = true;
	showNavigationArrows = true;
	showNavigationIndicators = true;

	get animation(): boolean {
		return this._animation ?? this._ngbConfig.animation;
	}
	set animation(animation: boolean) {
		this._animation = animation;
	}
}
