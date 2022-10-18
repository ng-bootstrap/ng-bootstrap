import { Injectable } from '@angular/core';
import { Options } from '@popperjs/core';
import { PlacementArray } from '../util/positioning';

/**
 * A configuration service for the [`NgbDropdown`](#/components/dropdown/api#NgbDropdown) component.
 *
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the dropdowns used in the application.
 */
@Injectable({ providedIn: 'root' })
export class NgbDropdownConfig {
	autoClose: boolean | 'outside' | 'inside' = true;
	placement: PlacementArray = ['bottom-start', 'bottom-end', 'top-start', 'top-end'];
	popperOptions = (options: Partial<Options>) => options;
	container: null | 'body';
}
