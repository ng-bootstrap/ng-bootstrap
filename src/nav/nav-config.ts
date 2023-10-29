import { inject, Injectable } from '@angular/core';
import { NgbConfig } from '../ngb-config';

/**
 * A configuration service for the [`NgbNav`](#/components/nav/api#NgbNav) component.
 *
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the navs used in the application.
 *
 * @since 5.2.0
 */
@Injectable({ providedIn: 'root' })
export class NgbNavConfig {
	private _ngbConfig = inject(NgbConfig);
	private _animation: boolean;

	destroyOnHide = true;
	orientation: 'horizontal' | 'vertical' = 'horizontal';
	roles: 'tablist' | false = 'tablist';
	keyboard: boolean | 'changeWithArrows' = false;

	get animation(): boolean {
		return this._animation ?? this._ngbConfig.animation;
	}
	set animation(animation: boolean) {
		this._animation = animation;
	}
}
