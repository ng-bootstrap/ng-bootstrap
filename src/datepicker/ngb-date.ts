import {NgbDateStruct} from './ngb-date-struct';
import {padNumber} from '../util/util';

/**
 * Simple class used for a date representation by the datepicker by default
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
   * Static method. Creates a new date object from the {year, month, day?} structure, ex. NgbDate.from({year: 2000,
   * month: 5, day: 1})
   */
  static from(date: {year: number, month: number, day?: number}): NgbDate {
    return date ? new NgbDate(date.year, date.month, date.day ? date.day : 1) : null;
  }

  constructor(year: number, month: number, day: number) {
    this.year = year;
    this.month = month;
    this.day = day;
  }

  /**
   * Checks if current date is equal to another date
   */
  equals(other: NgbDate): boolean {
    return other && this.year === other.year && this.month === other.month && this.day === other.day;
  }

  /**
   * Checks if current date is before to another date
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
   * Checks if current date is after to another date
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

  /**
   * Converts date to a {year, month, day} structure
   */
  toStruct(): {year: number, month: number, day: number} { return {year: this.year, month: this.month, day: this.day}; }

  /**
   * Converts date to a string as in ISO 8601, ex. 1984-01-01
   */
  toString(): string { return `${padNumber(this.year, 4)}-${padNumber(this.month)}-${padNumber(this.day)}`; }
}
