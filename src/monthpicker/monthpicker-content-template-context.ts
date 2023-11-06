import { NgbMonthpicker } from './monthpicker';

/**
 * The context for the monthpicker 'content' template.
 *
 * You can override the way content is displayed in the monthpicker via the `[contentTemplate]` input
 * or via the [`NgbMonthpickerContent`](#/components/monthpicker/api#NgbMonthpickerContent) directive.
 *
 * @since 14.2.0
 */
export interface ContentTemplateContext {
	/**
	 * The monthpicker that corresponds to the template.
	 *
	 * Can be used for convenience as a default template key, ex. `let-d`.
	 */
	$implicit: NgbMonthpicker;
}
