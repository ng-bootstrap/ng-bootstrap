import { Injectable } from '@angular/core';

import { NgbMonthpickerConfig } from './monthpicker-config';
import { PlacementArray } from '../util/positioning';
import { Options } from '@popperjs/core';

/**
 * A configuration service for the [`NgbMonthpickerInput`](#/components/monthpicker/api#NgbMonthpicker) component.
 *
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the monthpicker inputs used in the application.
 */
@Injectable({ providedIn: 'root' })
export class NgbInputMonthpickerConfig extends NgbMonthpickerConfig {
	autoClose: boolean | 'inside' | 'outside' = true;
	container: null | 'body';
	positionTarget: string | HTMLElement;
	placement: PlacementArray = ['bottom-start', 'bottom-end', 'top-start', 'top-end'];
	popperOptions = (options: Partial<Options>) => options;
	restoreFocus: true | HTMLElement | string = true;
}
