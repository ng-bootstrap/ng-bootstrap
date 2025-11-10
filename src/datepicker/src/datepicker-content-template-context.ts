import { NgbDatepicker } from './datepicker';

/**
 * The context for the datepicker 'content' template.
 *
 * You can override the way content is displayed in the datepicker via the `[contentTemplate]` input
 * or via the [`NgbDatepickerContent`](#/components/datepicker/api#NgbDatepickerContent) directive.
 *
 * @since 14.2.0
 */
export interface ContentTemplateContext {
	/**
	 * The datepicker that corresponds to the template.
	 *
	 * Can be used for convenience as a default template key, ex. `let-d`.
	 */
	$implicit: NgbDatepicker;
}
