import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

/**
 * A configuration service for the [`NgbTimepicker`](#/components/timepicker/api#NgbTimepicker) component.
 *
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the timepickers used in the application.
 */
@Injectable({ providedIn: 'root' })
export class NgbTimepickerConfig {
	/**
	 * Stream to emit from when config is changed.
	 * Use this to notify components to trigger change detection
	 */
	readonly changes: Subject<void> = new Subject<void>();

	incrementHoursLabel = $localize`:@@ngb.timepicker.increment-hours:Increment hours`;
	decrementHoursLabel = $localize`:@@ngb.timepicker.decrement-hours:Decrement hours`;
	hoursShortLabel = $localize`:@@ngb.timepicker.HH:HH`;
	hoursLabel = $localize`:@@ngb.timepicker.hours:Hours`;

	incrementMinutesLabel = $localize`:@@ngb.timepicker.increment-minutes:Increment minutes`;
	decrementMinutesLabel = $localize`:@@ngb.timepicker.decrement-minutes:Decrement minutes`;
	minutesShortLabel = $localize`:@@ngb.timepicker.MM:MM`;
	minutesLabel = $localize`:@@ngb.timepicker.minutes:Minutes`;

	incrementSecondsLabel = $localize`:@@ngb.timepicker.increment-seconds:Increment seconds`;
	decrementSecondsLabel = $localize`:@@ngb.timepicker.decrement-seconds:Decrement seconds`;
	secondsShortLabel = $localize`:@@ngb.timepicker.SS:SS`;
	secondsLabel = $localize`:@@ngb.timepicker.seconds:Seconds`;

	meridian = false;
	spinners = true;
	seconds = false;
	hourStep = 1;
	minuteStep = 1;
	secondStep = 1;
	disabled = false;
	readonlyInputs = false;
	size: 'small' | 'medium' | 'large' = 'medium';
}
