/**
 * Created by mehrabisajad on 2017/03/28.
 */
import {NgbDate} from '../ngb-date';
import {NgbPeriod} from '../ngb-calendar';
import {Injectable} from '@angular/core';
import {NgbCalendarJalali} from './ngb-calendar-jalali';

function mod(a: number, b: number): number {
  return a - b * Math.floor(a / b);
}

function div(a: number, b: number) {
  return Math.floor(a / b);
}

@Injectable()
export class NgbCalendarPersian extends NgbCalendarJalali {

  /**
   * Returns the equivalent jalali date value for a give input Gregorian date.
   * `gdate` is a JS Date to be converted to jalali.
   * utc to local
   */
  fromGregorian(gdate: Date): NgbDate {
    let message: string[] = gdate.toLocaleDateString().split('/');

    const
      gYear = +message[2],
      gMonth = +message[0],
      gDay = +message[1];

    let g2d = this.gregorianToDay(gYear, gMonth, gDay);

    return this.dayToJalali(g2d);
  }

  /*
   Converts a date of the Jalali calendar to the Julian Day number.
   @param jy Jalali year (1 to 3100)
   @param jm Jalali month (1 to 12)
   @param jd Jalali day (1 to 29/31)
   @return Julian Day number
   */
  gregorianToDay(gy: number, gm: number, gd: number) {
    let d = div((gy + div(gm - 8, 6) + 100100) * 1461, 4)
      + div(153 * mod(gm + 9, 12) + 2, 5)
      + gd - 34840408;
    d = d - div(div(gy + 100100 + div(gm - 8, 6), 100) * 3, 4) + 752;
    return d;
  }

  /*
   Converts the Julian Day number to a date in the Jalali calendar.
   @param jdn Julian Day number
   @return
   jy: Jalali year (1 to 3100)
   jm: Jalali month (1 to 12)
   jd: Jalali day (1 to 29/31)
   */
  dayToJalali(jdn: number) {
    let gy = this.dayToGregorion(jdn).getFullYear() // Calculate Gregorian year (gy).
      , jy = gy - 621
      , r = this.jalCal(jy)
      , jdn1f = this.gregorianToDay(gy, 3, r.march)
      , jd
      , jm
      , k;

    // Find number of days that passed since 1 Farvardin.
    k = jdn - jdn1f;
    if (k >= 0) {
      if (k <= 185) {
        // The first 6 months.
        jm = 1 + div(k, 31);
        jd = mod(k, 31) + 1;
        return new NgbDate(jy, jm, jd);
      } else {
        // The remaining months.
        k -= 186;
      }
    } else {
      // Previous Jalali year.
      jy -= 1;
      k += 179;
      if (r.leap === 1) {
        k += 1;
      }
    }
    jm = 7 + div(k, 30);
    jd = mod(k, 30) + 1;

    return new NgbDate(jy, jm, jd);
  }


  /**
   * Returns the equivalent JS date value for a give input Jalali date.
   * `jalaliDate` is an Jalali date to be converted to Gregorian.
   */
  toGregorian(jalaliDate: NgbDate): Date {
    const hYear = jalaliDate.year;
    const hMonth = jalaliDate.month;
    const hDate = jalaliDate.day;

    let jdn = this.jalaliToDay(hYear, hMonth, hDate);
    let date = this.dayToGregorion(jdn);
    date.setHours(6, 30, 3, 200);
    return date;
  }

  /*
   Converts a date of the Jalali calendar to the Julian Day number.
   @param jy Jalali year (1 to 3100)
   @param jm Jalali month (1 to 12)
   @param jd Jalali day (1 to 29/31)
   @return Julian Day number
   */
  jalaliToDay(jy: number, jm: number, jd: number) {
    let r = this.jalCal(jy);
    return this.gregorianToDay(r.gy, 3, r.march) + (jm - 1) * 31 - div(jm, 7) * (jm - 7) + jd - 1;
  }

  /*
   Calculates Gregorian and Julian calendar dates from the Julian Day number
   (jdn) for the period since jdn=-34839655 (i.e. the year -100100 of both
   calendars) to some millions years ahead of the present.
   @param jdn Julian Day number
   @return
   gy: Calendar year (years BC numbered 0, -1, -2, ...)
   gm: Calendar month (1 to 12)
   gd: Calendar day of the month M (1 to 28/29/30/31)
   */
  dayToGregorion(jdn: number) {
    let j, i, gd, gm, gy;
    j = 4 * jdn + 139361631;
    j = j + div(div(4 * jdn + 183187720, 146097) * 3, 4) * 4 - 3908;
    i = div(mod(j, 1461), 4) * 5 + 308;
    gd = div(mod(i, 153), 5) + 1;
    gm = mod(div(i, 153), 12) + 1;
    gy = div(j, 1461) - 100100 + div(8 - gm, 6);

    return new Date(gy, gm - 1, gd);
  }

  /*
   This function determines if the Jalali (Persian) year is
   leap (366-day long) or is the common year (365 days), and
   finds the day in March (Gregorian calendar) of the first
   day of the Jalali year (jy).
   @param jy Jalali calendar year (-61 to 3177)
   @return
   leap: number of years since the last leap year (0 to 4)
   gy: Gregorian year of the beginning of Jalali year
   march: the March day of Farvardin the 1st (1st day of jy)
   @see: http://www.astro.uni.torun.pl/~kb/Papers/EMP/PersianC-EMP.htm
   @see: http://www.fourmilab.ch/documents/calendar/
   */
  jalCal(jy: number) {
    // Jalali years starting the 33-year rule.
    let breaks = [-61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210
      , 1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178
    ]
      , bl = breaks.length
      , gy = jy + 621
      , leapJ = -14
      , jp = breaks[0]
      , jm
      , jump
      , leap
      , leapG
      , march
      , n
      , i;

    if (jy < jp || jy >= breaks[bl - 1]) {
      throw new Error('Invalid Jalali year ' + jy);
    }

    // Find the limiting years for the Jalali year jy.
    for (i = 1; i < bl; i += 1) {
      jm = breaks[i];
      jump = jm - jp;
      if (jy < jm) {
        break;
      }
      leapJ = leapJ + div(jump, 33) * 8 + div(mod(jump, 33), 4);
      jp = jm;
    }
    n = jy - jp;

    // Find the number of leap years from AD 621 to the beginning
    // of the current Jalali year in the Persian calendar.
    leapJ = leapJ + div(n, 33) * 8 + div(mod(n, 33) + 3, 4);
    if (mod(jump, 33) === 4 && jump - n === 4) {
      leapJ += 1;
    }

    // And the same in the Gregorian calendar (until the year gy).
    leapG = div(gy, 4) - div((div(gy, 100) + 1) * 3, 4) - 150;

    // Determine the Gregorian date of Farvardin the 1st.
    march = 20 + leapJ - leapG;

    // Find how many years have passed since the last leap year.
    if (jump - n < 6) {
      n = n - jump + div(jump + 4, 33) * 33;
    }
    leap = mod(mod(n + 1, 33) - 1, 4);
    if (leap === -1) {
      leap = 4;
    }

    return {
      leap: leap
      , gy: gy
      , march: march
    };
  }


  /**
   * Returns the number of days in a specific jalali month.
   */
  getDaysInJalaliMonth(month: number, year: number): number {
    if (month <= 6) { return 31; }
    if (month <= 11) { return 30; }
    if (this.isLeapJalaliYear(year)) { return 30; }
    return 29;
  }

  isLeapJalaliYear(jy: number) {
    return this.jalCal(jy).leap === 0;
  }

  getNext(date: NgbDate, period: NgbPeriod = 'd', number = 1) {
    date = NgbDate.from(date);

    switch (period) {
      case 'y':
        date = this.setYear(date, date.year + number);
        date.month = 1;
        date.day = 1;
        return date;
      case 'm':
        date = this.setMonth(date, date.month + number);
        date.day = 1;
        return date;
      case 'd':
        return this.setDay(date, date.day + number);
      default:
        return date;
    }
  }

  getPrev(date: NgbDate, period: NgbPeriod = 'd', number = 1) {
    return this.getNext(date, period, -number);
  }

  getWeekday(date: NgbDate) {
    const day = this.toGregorian(date).getDay();
    // in JS Date Sun=0, in ISO 8601 Sun=7
    return day === 0 ? 7 : day;
  }

  getWeekNumber(week: NgbDate[], firstDayOfWeek: number) {
    // in JS Date Sun=0, in ISO 8601 Sun=7
    if (firstDayOfWeek === 7) {
      firstDayOfWeek = 0;
    }

    const thursdayIndex = (4 + 7 - firstDayOfWeek) % 7;
    const date = week[thursdayIndex];

    const jsDate = this.toGregorian(date);
    jsDate.setDate(jsDate.getDate() + 4 - (jsDate.getDay() || 7));  // Thursday
    const time = jsDate.getTime();
    const startDate = this.toGregorian(new NgbDate(date.year, 1, 1));
    return Math.floor(Math.round((time - startDate.getTime()) / 86400000) / 7) + 1;
  }

  getToday(): NgbDate {
    return this.fromGregorian(new Date());
  }
}
