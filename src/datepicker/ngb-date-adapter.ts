import {NgbDateStruct} from './ngb-date-struct';
import {NgbDate} from './ngb-date';

/**
 * Abstract type serving as a DI token for the service converting from your application Date model to internal NgbDate
 * model.
 * A default implementation converting from and to NgbDateStruct is provided for retro-compatibility,
 * but you can provide another implementation to use an alternative format, ie for using with native Date Object.
 */
export abstract class NgbDateAdapter<T> {
  /**
   * Converts user-model date into an NgbDate for internal use in the library
   * @param  {any}     value any value that end user uses as the date model, ie: NgbDateStruct, Date, "yyyy-mm-dd"
   * @return {NgbDate}
   */
  abstract fromModel(value: T): NgbDate;

  /**
   * Converts internal date value NgbDate to user-model date
   * The returned type is suposed to be of the same type as fromModel() input-value param
   * @param  {NgbDate} date internal NgbDate date representation
   * @return {any}
   */
  abstract toModel(date: NgbDate): T;
}

export class NgbDateStructAdapter extends NgbDateAdapter<NgbDateStruct> {
  /**
   * Converts a NgbDateStruct value into NgbDate value
   * @param  {NgbDateStruct} value
   * @return {NgbDate}
   */
  fromModel(date: NgbDateStruct): NgbDate { return date ? new NgbDate(date.year, date.month, date.day || 1) : null; }

  /**
   * Converts a NgbDate value into NgbDateStruct value
   * @param  {NgbDateStruct} value
   * @return {NgbDate}
   */
  toModel(date: NgbDate): NgbDateStruct { return date ? {year: date.year, month: date.month, day: date.day} : null; }
}
