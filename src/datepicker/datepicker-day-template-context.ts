import {NgbDateStruct} from './ngb-date-struct';
/**
 * Context for the datepicker 'day' template in case you want to override the default one
 */
export interface DayTemplateContext {
  /**
   * Id to be used for the day (will be referenced by the aria-activedescendent attribute
   * of the datepicker when the day is focused). This can be undefined if no id has to be
   * used (for days outside the current month).
   */
  id: string;

  /**
   * Month currently displayed by the datepicker
   */
  currentMonth: number;

  /**
   * Day of the week
   * With default calendar we use ISO 8601: 'weekday' is 1=Mon ... 7=Sun
   */
  weekday: number;

  /**
   * Date that corresponds to the template
   */
  date: NgbDateStruct;

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
