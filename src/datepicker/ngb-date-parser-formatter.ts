import {NgbDate} from './ngb-date';
import {padNumber, toInteger, isNumber} from '../util/util';

export abstract class NgbDateParserFormatter {
  abstract parse(value: string): NgbDate;
  abstract format(date: NgbDate): string;
}

export class NgbDateISOParserFormatter extends NgbDateParserFormatter {
  parse(value: string): NgbDate {
    if (value) {
      const dateParts = value.trim().split('-');
      if (dateParts.length === 1 && isNumber(dateParts[0])) {
        return new NgbDate(toInteger(dateParts[0]), null, null);
      } else if (dateParts.length === 2 && isNumber(dateParts[0]) && isNumber(dateParts[1])) {
        return new NgbDate(toInteger(dateParts[0]), toInteger(dateParts[1]) - 1, null);
      } else if (dateParts.length === 3 && isNumber(dateParts[0]) && isNumber(dateParts[1]) && isNumber(dateParts[2])) {
        return new NgbDate(toInteger(dateParts[0]), toInteger(dateParts[1]) - 1, toInteger(dateParts[2]));
      }
    }
    return null;
  }

  format(date: NgbDate): string {
    return date ?
        `${date.year}-${isNumber(date.month) ? padNumber(date.month + 1) : ''}-${isNumber(date.day) ? padNumber(date.day) : ''}` :
        '';
  }
}
