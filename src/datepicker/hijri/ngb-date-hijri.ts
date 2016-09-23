import {NgbDate} from '../ngb-date';

/**
 * Base class for all the Hijri calendars.
 */
export abstract class NgbDateHijri extends NgbDate {
  constructor(year = null, month = 0, day = 1) {
    super(year, month, day);
    this.setYear(year);
    this.setMonth(month);
    this.setDay(day);
    if (!year) {
      this.fromGregorian(new Date());
    }
  }

  public setDay(dayValue: number): NgbDateHijri {
    dayValue = +dayValue;
    let mdays = this.getDaysInIslamicMonth(this.month, this.year);
    if (dayValue <= 0) {
      while (dayValue <= 0) {
        this.setMonth(this.month - 1);
        mdays = this.getDaysInIslamicMonth(this.month, this.year);
        dayValue += mdays;
      }
    } else if (dayValue > mdays) {
      while (dayValue > mdays) {
        dayValue -= mdays;
        this.setMonth(this.month + 1);
        mdays = this.getDaysInIslamicMonth(this.month, this.year);
      }
    }
    this.day = dayValue;
    return this;
  }

  public setMonth(month: number): NgbDateHijri {
    month = +month;
    this.year = this.year + Math.floor(month / 12);
    this.month = Math.floor((month % 12 + 12) % 12);
    return this;
  }

  public setYear(yearValue: number): NgbDateHijri {
    this.year = +yearValue;
    return this;
  }

  /**
  * Returns the equivelent JS Date.getTime() value.
  * Used to submit the calendar value to the back-end.
  */
  public getTime(): number { return this.toGregorian().getTime(); }

  /**
  * Returns the equivalent Hijri date value for a give input Gregorian date.
  * `gdate` is s JS Date to be converted to Hijri.
  */
  abstract fromGregorian(gdate: Date): NgbDateHijri;
  /**
  * Converts the current Hijri date to Gregorian.
  */
  abstract toGregorian(): Date;
  /**
  * Returns the number of days in a specific Hijri month.
  * `month` is 0 for Muharram, 1 for Safar, etc.
  * `year` is any Hijri year.
  */
  public abstract getDaysInIslamicMonth(month: number, year: number): number;

  protected _isIslamicLeapYear(year: number): boolean { return (14 + 11 * year) % 30 < 11; }
  /**
   * Returns the start of Hijri Month.
   * `month` is 0 for Muharram, 1 for Safar, etc.
   * `year` is any Hijri year.
   */
  protected _getMonthStart(year: number, month: number): number {
    return Math.ceil(29.5 * month) + (year - 1) * 354 + Math.floor((3 + 11 * year) / 30.0);
  }
  /**
   * Returns the start of Hijri year.
   * `year` is any Hijri year.
   */
  protected _getYearStart(year: number): number { return (year - 1) * 354 + Math.floor((3 + 11 * year) / 30.0); }
}
