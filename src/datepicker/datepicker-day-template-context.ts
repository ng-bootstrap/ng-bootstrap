import {NgbDate} from './ngb-date';
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
  date: NgbDate;

  /**
   * True if current date is disabled
   */
  disabled: boolean;

  /**
   * True if current date is focused
   */
  focused: boolean;

  /**
   * True if current date is selected
   */
  selected: boolean;
}
