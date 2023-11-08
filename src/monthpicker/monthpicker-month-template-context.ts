import { NgbMonth } from './ngb-month';
/**
 * The context for the monthpicker 'month' template.
 *
 * You can override the way dates are displayed in the monthpicker via the `[monthTemplate]` input.
 */
export interface MonthTemplateContext {
	/**
	 * The month that corresponds to the template. Same as the `date` parameter.
	 *
	 * Can be used for convenience as a default template key, ex. `let-d`.
	 *
	 * @since 3.3.0
	 */
	$implicit: NgbMonth;

	/**
	 * The month currently displayed by the monthpicker.
	 */
	currentMonth: number;

	/**
	 * The year currently displayed by the monthpicker.
	 *
	 * @since 5.2.0
	 */
	currentYear: number;

	/**
	 * Any data you pass using the `[monthTemplateData]` input in the monthpicker.
	 *
	 * @since 3.3.0
	 */
	data?: any;

	/**
	 * The date that corresponds to the template.
	 */
	date: NgbMonth;

	/**
	 * `True` if the current date is disabled.
	 */
	disabled: boolean;

	/**
	 * `True` if the current date is focused.
	 */
	focused: boolean;

	/**
	 * `True` if the current date is selected.
	 */
	selected: boolean;

	/**
	 * `True` if the current date is today (equal to `NgbCalendar.getToday()`).
	 *
	 * @since 4.1.0
	 */
	today: boolean;
}
