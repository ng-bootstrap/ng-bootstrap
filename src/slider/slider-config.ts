import { Injectable } from '@angular/core';

/**
 * A configuration service for the [`NgbSlider`](#/components/slider/api#NgbSlider) component.
 *
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the sliders used in the application.
 */
@Injectable({ providedIn: 'root' })
export class NgbSliderConfig {
	minValue: number;
	maxValue: number;
	stepSize: number;
	sliderValues: number[];
	readonly: boolean;
	disabled: boolean;
	vertical: boolean;
}

/**
 * Default slider values
 */
export const NgbDefaultSliderConfig: NgbSliderConfig = {
	minValue: 0,
	maxValue: 100,
	stepSize: 1,
	sliderValues: [30],
	readonly: false,
	disabled: false,
	vertical: false,
};
