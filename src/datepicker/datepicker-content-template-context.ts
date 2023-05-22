import { NgbDatepicker } from './datepicker';

/**
 * The context for the datepicker 'content' template.
 *
 * You can override the way content is displayed in the datepicker via the `[contentTemplate]` input.
 */
export interface ContentTemplateContext {
	/**
	 * The datepicker that corresponds to the template.
	 *
	 * Can be used for convenience as a default template key, ex. `let-d`.
	 */
	$implicit: NgbDatepicker;
}
