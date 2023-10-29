import { inject, Injectable } from '@angular/core';
import { PlacementArray } from '../util/positioning';
import { NgbConfig } from '../ngb-config';
import { Options } from '@popperjs/core';

/**
 * A configuration service for the [`NgbPopover`](#/components/popover/api#NgbPopover) component.
 *
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the popovers used in the application.
 */
@Injectable({ providedIn: 'root' })
export class NgbPopoverConfig {
	private _ngbConfig = inject(NgbConfig);
	private _animation: boolean;

	autoClose: boolean | 'inside' | 'outside' = true;
	placement: PlacementArray = 'auto';
	popperOptions = (options: Partial<Options>) => options;
	triggers = 'click';
	container: string;
	disablePopover = false;
	popoverClass: string;
	openDelay = 0;
	closeDelay = 0;

	get animation(): boolean {
		return this._animation ?? this._ngbConfig.animation;
	}
	set animation(animation: boolean) {
		this._animation = animation;
	}
}
