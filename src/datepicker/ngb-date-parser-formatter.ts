import {padNumber, toInteger, isNumber} from '../util/util';
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
  abstract parse(value: string): NgbDate;

  /**
   * Formats the given date to a string. Implementations should return an empty string if the given date is null,
   * and try their best to provide a partial result if the given date is incomplete or invalid.
   * @param date the date to format as a string
   */
  abstract format(date: NgbDate): string;
}

export class NgbDateISOParserFormatter extends NgbDateParserFormatter {
  parse(value: string): NgbDate {
    if (value) {
      const dateParts = value.trim().split('-');
      if (dateParts.length === 1 && isNumber(dateParts[0])) {
        return new NgbDate(toInteger(dateParts[0]), null, null);
      } else if (dateParts.length === 2 && isNumber(dateParts[0]) && isNumber(dateParts[1])) {
        return new NgbDate(toInteger(dateParts[0]), toInteger(dateParts[1]), null);
      } else if (dateParts.length === 3 && isNumber(dateParts[0]) && isNumber(dateParts[1]) && isNumber(dateParts[2])) {
        return new NgbDate(toInteger(dateParts[0]), toInteger(dateParts[1]), toInteger(dateParts[2]));
      }
    }
    return null;
  }

  format(date: NgbDate): string {
    return date ?
        `${date.year}-${isNumber(date.month) ? padNumber(date.month) : ''}-${isNumber(date.day) ? padNumber(date.day) : ''}` :
        '';
  }
}
