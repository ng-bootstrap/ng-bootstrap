import {padNumber, toInteger, isNumber} from '../util/util';
import {NgbDateStruct} from './ngb-date-struct';

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
  abstract parse(value: string, format: string): NgbDateStruct;

  /**
   * Formats the given date to a string. Implementations should return an empty string if the given date is null,
   * and try their best to provide a partial result if the given date is incomplete or invalid.
   * @param date the date to format as a string
   */
  abstract format(date: NgbDateStruct, format: string): string;
}

export class NgbDateDefaultParserFormatter extends NgbDateParserFormatter {
  parse(value: string, format: string): NgbDateStruct {
    if (value && this.isValidFormat(format) && value.trim() && value.length <= format.length) {
      let result: NgbDateStruct = {day: null, month: null, year: null};

      let dayChars: Array<string> = [];
      let monthChars: Array<string> = [];
      let yearChars: Array<string> = [];

      for (let i = 0; i < value.length && i < format.length; i++) {
        switch (format.charAt(i)) {
          case 'd':
            if (isNumber(value.charAt(i))) {
              dayChars.push(value.charAt(i));
            } else {
              return null;
            }
            break;
          case 'm':
            if (isNumber(value.charAt(i))) {
              monthChars.push(value.charAt(i));
            } else {
              return null;
            }
            break;
          case 'y':
            if (isNumber(value.charAt(i))) {
              yearChars.push(value.charAt(i));
            } else {
              return null;
            }
            break;
          default:
            if (format.charAt(i) !== '/' && format.charAt(i) !== '-') {
              return null;
            }
        }
      }

      if (dayChars.length === 2 || dayChars.length === 1 && isNumber(dayChars.join(''))) {
        result.day = toInteger(dayChars.join(''));
      }
      if (monthChars.length === 2 || monthChars.length === 1 && isNumber(monthChars.join(''))) {
        result.month = toInteger(monthChars.join(''));
      }
      if (yearChars.length === 4 && isNumber(yearChars.join(''))) {
        result.year = toInteger(yearChars.join(''));
      }

      return result.day || result.month || result.year ? result : null;
    }

    return null;
  }

  format(date: NgbDateStruct, format: string): string {
    let result = '';
    if (date && format) {
      let dateString: string[] = [];
      result = format;
      result = result.replace('dd', isNumber(date.day) ? padNumber(date.day) : '');
      result = result.replace('mm', isNumber(date.month) ? padNumber(date.month) : '');
      result = result.replace('yyyy', isNumber(date.year) ? String(date.year) : '');
    }
    return result;
  }

  isValidFormat(format: string): boolean {
    if (format && format.length === 10) {
      let foundNumber = false;

      for (let i = 0; i < format.length; i++) {
        switch (format.charAt(i)) {
          case 'd':
            if (format.charAt(i + 1) === 'd' && !foundNumber) {
              i++;
              foundNumber = true;
            } else {
              return false;
            }
            break;
          case 'm':
            if (format.charAt(i + 1) === 'm' && !foundNumber) {
              i++;
              foundNumber = true;
            } else {
              return false;
            }
            break;
          case 'y':
            if (format.charAt(i + 1) === 'y' && format.charAt(i + 2) === 'y' && format.charAt(i + 3) === 'y' &&
                !foundNumber) {
              foundNumber = true;
              i = i + 3;
            } else {
              return false;
            }
            break;
          case '/':
            if (!foundNumber) {
              return false;
            }
            foundNumber = false;
            break;
          case '-':
            if (!foundNumber) {
              return false;
            }
            foundNumber = false;
            break;
          default:
            return false;
        }
      }
      return true;
    }
    return false;
  }
}
