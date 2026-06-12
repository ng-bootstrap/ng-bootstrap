import { Service } from '@angular/core';

/**
 * A configuration service for the [`NgbRating`](#/components/rating/api#NgbRating) component.
 *
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the ratings used in the application.
 */
@Service()
export class NgbRatingConfig {
	max = 10;
	readonly = false;
	resettable = false;
	tabindex: number | string = 0;
}
