import {NgbDate} from './ngb-date';

describe('ngb-date', () => {

  describe('equals', () => {
    const date = new NgbDate(2016, 8, 18);

    it('should return true for the same dates', () => { expect(date.equals(new NgbDate(2016, 8, 18))).toBeTruthy(); });

    it('should return false different dates', () => {
      expect(date.equals(new NgbDate(0, 8, 18))).toBeFalsy();
      expect(date.equals(new NgbDate(2016, 0, 18))).toBeFalsy();
      expect(date.equals(new NgbDate(2016, 8, 0))).toBeFalsy();
    });

    it('should return false undefined and null values', () => {
      expect(date.equals(null)).toBeFalsy();
      expect(date.equals(undefined)).toBeFalsy();
    });
  });

  describe('before', () => {
    const date = new NgbDate(2016, 8, 18);

    it('should return false undefined and null values', () => {
      expect(date.before(null)).toBeFalsy();
      expect(date.before(undefined)).toBeFalsy();
    });

    it('should return true if current date is before the other one', () => {
      expect(date.before(new NgbDate(2016, 8, 19))).toBeTruthy();
      expect(date.before(new NgbDate(2016, 9, 18))).toBeTruthy();
      expect(date.before(new NgbDate(2017, 8, 18))).toBeTruthy();
    });

    it('should return false if current date is after the other one', () => {
      expect(date.before(new NgbDate(2016, 8, 17))).toBeFalsy();
      expect(date.before(new NgbDate(2016, 7, 18))).toBeFalsy();
      expect(date.before(new NgbDate(2015, 8, 18))).toBeFalsy();
    });
  });

  describe('after', () => {
    const date = new NgbDate(2016, 8, 18);

    it('should return false undefined and null values', () => {
      expect(date.after(null)).toBeFalsy();
      expect(date.after(undefined)).toBeFalsy();
    });

    it('should return true if current date is after the other one', () => {
      expect(date.after(new NgbDate(2016, 8, 17))).toBeTruthy();
      expect(date.after(new NgbDate(2016, 7, 18))).toBeTruthy();
      expect(date.after(new NgbDate(2015, 8, 18))).toBeTruthy();
    });

    it('should return false if current date is before the other one', () => {
      expect(date.after(new NgbDate(2016, 8, 19))).toBeFalsy();
      expect(date.after(new NgbDate(2016, 9, 18))).toBeFalsy();
      expect(date.after(new NgbDate(2017, 8, 18))).toBeFalsy();
    });
  });
});
