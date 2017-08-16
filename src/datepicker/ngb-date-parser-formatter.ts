import {padNumber, toInteger, isNumber} from '../util/util';
import {NgbDateStruct} from './ngb-date-struct';
import {NgbDate} from './ngb-date';

/**
 * Abstract type serving as a DI token for the service parsing and formatting dates for the NgbInputDatepicker
 * directive. A default implementation using the ISO 8601 format is provided, but you can provide another implementation
 * to use an alternative format.
 */
export abstract class NgbDateParserFormatter {
  /**
   * Parses the given value to an NgbDateStruct. Implementations should try their best to provide a result, even
   * partial. They must return null if the value can't be parsed.
   * @param value the value to parse
   */
  abstract parse(value: string): NgbDateStruct;

  /**
   * Formats the given date to a string. Implementations should return an empty string if the given date is null,
   * and try their best to provide a partial result if the given date is incomplete or invalid.
   * @param date the date to format as a string
   */
  abstract format(date: NgbDateStruct): string;

  /**
   * Converts user-model date into an NgbDate for internal use in the library
   * @param  {any}     value any value that end user uses as the date model, ie: NgbDateStruct, Date, "yyyy-mm-dd"
   * @return {NgbDate}
   */
  abstract fromInput(value: any): NgbDate;

  /**
   * Converts internal date value NgbDate to user-model date
   * The returned type is suposed to be of the same type as fromInput() value param
   * @param  {NgbDate} date internal NgbDate date representation
   * @return {any}
   */
  abstract toOutput(date: NgbDate): any;
}

export class NgbDateISOParserFormatter extends NgbDateParserFormatter {
  parse(value: string): NgbDateStruct {
    if (value) {
      const dateParts = value.trim().split('-');
      if (dateParts.length === 1 && isNumber(dateParts[0])) {
        return {year: toInteger(dateParts[0]), month: null, day: null};
      } else if (dateParts.length === 2 && isNumber(dateParts[0]) && isNumber(dateParts[1])) {
        return {year: toInteger(dateParts[0]), month: toInteger(dateParts[1]), day: null};
      } else if (dateParts.length === 3 && isNumber(dateParts[0]) && isNumber(dateParts[1]) && isNumber(dateParts[2])) {
        return {year: toInteger(dateParts[0]), month: toInteger(dateParts[1]), day: toInteger(dateParts[2])};
      }
    }
    return null;
  }

  format(date: NgbDateStruct): string {
    return date ?
        `${date.year}-${isNumber(date.month) ? padNumber(date.month) : ''}-${isNumber(date.day) ? padNumber(date.day) : ''}` :
        '';
  }

  fromInput(value: NgbDateStruct): NgbDate {
    return value ? new NgbDate(value.year, value.month, value.day || 1) : null;
  }

  toOutput(date: NgbDate): NgbDateStruct { return {year: date.year, month: date.month, day: date.day}; }
}
