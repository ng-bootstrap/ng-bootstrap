import {NgbDateStruct} from './ngb-date-struct';
import {NgbDate} from './ngb-date';

/**
 * Abstract type serving as a DI token for the service parsing and formatting dates for the NgbInputDatepicker
 * directive. A default implementation using the ISO 8601 format is provided, but you can provide another implementation
 * to use an alternative format.
 */
export abstract class NgbDateModelAdapter {

  /**
   * Converts user-model date into an NgbDate for internal use in the library
   * @param  {any}     value any value that end user uses as the date model, ie: NgbDateStruct, Date, "yyyy-mm-dd"
   * @return {NgbDate}
   */
  abstract modelToNgbDate(value: any): NgbDate;

  /**
   * Converts internal date value NgbDate to user-model date
   * The returned type is suposed to be of the same type as modelToNgbDate() value param
   * @param  {NgbDate} date internal NgbDate date representation
   * @return {any}
   */
  abstract ngbDateToModel(date: NgbDate): any;
}

export class NgbDateModelStructAdapter extends NgbDateModelAdapter {

  /**
   * Converts a NgbDateStruct value into NgbDate value
   * @param  {NgbDateStruct} value
   * @return {NgbDate}
   */
  modelToNgbDate(value: NgbDateStruct): NgbDate {
    return value ? new NgbDate(value.year, value.month, value.day || 1) : null;
  }

  /**
   * Converts a NgbDate value into NgbDateStruct value
   * @param  {NgbDateStruct} value
   * @return {NgbDate}
   */
  ngbDateToModel(date: NgbDate): NgbDateStruct { return {year: date.year, month: date.month, day: date.day}; }
}
