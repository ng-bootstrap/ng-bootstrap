import {NgbDate} from './ngb-date';
import {NgbDateISOParserFormatter} from './ngb-date-parser-formatter';

describe('ngb-date parsing and formatting', () => {
  let pf: NgbDateISOParserFormatter;

  beforeEach(() => { pf = new NgbDateISOParserFormatter(); });

  describe('parsing', () => {

    it('should parse null undefined and empty string as null', () => {
      expect(pf.parse(null)).toBeNull();
      expect(pf.parse(undefined)).toBeNull();
      expect(pf.parse('')).toBeNull();
      expect(pf.parse('   ')).toBeNull();
    });

    it('should parse valid date', () => { expect(pf.parse('2016-05-12')).toEqual(new NgbDate(2016, 4, 12)); });

    it('should parse non-date as null', () => {
      expect(pf.parse('foo-bar-baz')).toBeNull();
      expect(pf.parse('2014-bar')).toBeNull();
      expect(pf.parse('2014-11-12-15')).toBeNull();
    });

    it('should do its best parsing incomplete dates',
       () => { expect(pf.parse('2011-5')).toEqual(new NgbDate(2011, 4, null)); });
  });

  describe('formatting', () => {

    it('should format null and undefined as an empty string', () => {
      expect(pf.format(null)).toBe('');
      expect(pf.format(undefined)).toBe('');
    });

    it('should format a valid date', () => { expect(pf.format(new NgbDate(2016, 9, 15))).toBe('2016-10-15'); });

    it('should format a valid date with padding',
       () => { expect(pf.format(new NgbDate(2016, 9, 5))).toBe('2016-10-05'); });

    it('should try its best with invalid dates', () => {
      expect(pf.format(new NgbDate(2016, NaN, undefined))).toBe('2016--');
      expect(pf.format(new NgbDate(2016, null, 0))).toBe('2016--00');
    });
  });

});
