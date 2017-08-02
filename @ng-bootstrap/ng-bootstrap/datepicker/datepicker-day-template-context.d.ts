import { NgbDateStruct } from './ngb-date-struct';
/**
 * Context for the datepicker 'day' template in case you want to override the default one
 */
export interface DayTemplateContext {
    /**
     * Month currently displayed by the datepicker
     */
    currentMonth: number;
    /**
     * Date that corresponds to the template
     */
    date: NgbDateStruct;
    /**
     * True if current date is disabled
     */
    disabled: boolean;
    /**
     * True if current date is selected
     */
    selected: boolean;
}
