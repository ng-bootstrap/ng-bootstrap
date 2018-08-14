import {NgbDateStruct} from './ngb-date-struct';
import {isInteger} from '../util/util';

/**
 * Simple class used for a date representation that datepicker also uses internally
 *
 * @since 3.0.0
 */
export class NgbDate implements NgbDateStruct {
  /**
   * The year, for example 2016
   */
  year: number;

  /**
   * The month, for example 1=Jan ... 12=Dec as in ISO 8601
   */
  month: number;

  /**
   * The day of month, starting with 1
   */
  day: number;

  /**
   * Static method. Creates a new date object from the NgbDateStruct, ex. NgbDate.from({year: 2000,
   * month: 5, day: 1}). If the 'date' is already of NgbDate, the method will return the same object
   */
  static from(date: NgbDateStruct): NgbDate {
    if (date instanceof NgbDate) {
      return date;
    }
    return date ? new NgbDate(date.year, date.month, date.day) : null;
  }

  constructor(year: number, month: number, day: number) {
    this.year = isInteger(year) ? year : null;
    this.month = isInteger(month) ? month : null;
    this.day = isInteger(day) ? day : null;
  }

  /**
   * Checks if current date is equal to another date
   */
  equals(other: NgbDate): boolean {
    return other && this.year === other.year && this.month === other.month && this.day === other.day;
  }

  /**
   * Checks if current date is before another date
   */
  before(other: NgbDate): boolean {
    if (!other) {
      return false;
    }

    if (this.year === other.year) {
      if (this.month === other.month) {
        return this.day === other.day ? false : this.day < other.day;
      } else {
        return this.month < other.month;
      }
    } else {
      return this.year < other.year;
    }
  }

  /**
   * Checks if current date is after another date
   */
  after(other: NgbDate): boolean {
    if (!other) {
      return false;
    }
    if (this.year === other.year) {
      if (this.month === other.month) {
        return this.day === other.day ? false : this.day > other.day;
      } else {
        return this.month > other.month;
      }
    } else {
      return this.year > other.year;
    }
  }
}
