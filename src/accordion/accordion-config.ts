import { inject, Injectable } from '@angular/core';
import { NgbConfig } from '../ngb-config';

/**
 * A configuration service for the [`NgbAccordionDirective`](#/components/accordion/api#NgbAccordionDirective).
 *
 * You can inject this service, typically in your root component, and customize its properties
 * to provide default values for all accordions used in the application.
 */
@Injectable({ providedIn: 'root' })
export class NgbAccordionConfig {
	private _ngbConfig = inject(NgbConfig);
	private _animation: boolean;

	closeOthers = false;
	destroyOnHide = true;

	/**
	 * @deprecated 14.1.0
	 */
	type: string;

	get animation(): boolean {
		return this._animation ?? this._ngbConfig.animation;
	}
	set animation(animation: boolean) {
		this._animation = animation;
	}
}
