import {NgbDateDefaultParserFormatter} from './ngb-date-parser-formatter';

describe('ngb-date parsing and formatting', () => {
  let pf: NgbDateDefaultParserFormatter;

  beforeEach(() => { pf = new NgbDateDefaultParserFormatter(); });

  describe('parsing', () => {

    it('should parse null undefined and empty string as null', () => {
      expect(pf.parse(null, 'yyyy-mm-dd')).toBeNull();
      expect(pf.parse(undefined, 'yyyy-mm-dd')).toBeNull();
      expect(pf.parse('', 'yyyy-mm-dd')).toBeNull();
      expect(pf.parse('   ', 'yyyy-mm-dd')).toBeNull();
    });

    it('should throw an error with invalid date format', () => {
      expect(pf.parse('2016-03-23', 'yy-mm-dd')).toBeNull();
      expect(pf.parse('2016-03-23', 'yyyy-md-dd')).toBeNull();
    });

    it('should parse valid date',
       () => { expect(pf.parse('2016-05-12', 'yyyy-mm-dd')).toEqual({year: 2016, month: 5, day: 12}); });

    it('should parse non-date as null', () => {
      expect(pf.parse('foo-bar-baz', 'yyyy-mm-dd')).toBeNull();
      expect(pf.parse('2014-bar', 'yyyy-mm-dd')).toBeNull();
      expect(pf.parse('2014-11-12-15', 'yyyy-mm-dd')).toBeNull();
    });

    it('should do its best parsing incomplete dates',
       () => { expect(pf.parse('2011-5', 'yyyy-mm-dd')).toEqual({year: 2011, month: 5, day: null}); });
  });

  describe('validating', () => {
    it('should validate correct date format', () => {
      expect(pf.isValidFormat('yyyy-mm-dd')).toEqual(true);
      expect(pf.isValidFormat('dd/mm/yyyy')).toEqual(true);
      expect(pf.isValidFormat('mm/dd/yyyy')).toEqual(true);
      expect(pf.isValidFormat('yyyy/mm/dd')).toEqual(true);
    });

    it('should validate incorrect date format', () => {
      expect(pf.isValidFormat('yyy-mm-dd')).toEqual(false);
      expect(pf.isValidFormat('dd/mmyyyy')).toEqual(false);
      expect(pf.isValidFormat('dd/mmyy/yy')).toEqual(false);
      expect(pf.isValidFormat('ddmmyyyy')).toEqual(false);
      expect(pf.isValidFormat('yyyymmdd')).toEqual(false);
      expect(pf.isValidFormat('yyyy--mm--dd')).toEqual(false);
      expect(pf.isValidFormat('yyyy mm dd')).toEqual(false);
      expect(pf.isValidFormat('yyyy-md-dd')).toEqual(false);
    });
  });

  describe('formatting', () => {

    it('should format null and undefined as an empty string', () => {
      expect(pf.format(null, 'yyyy-mm-dd')).toBe('');
      expect(pf.format(undefined, 'yyyy-mm-dd')).toBe('');
    });

    it('should format a valid date',
       () => { expect(pf.format({year: 2016, month: 10, day: 15}, 'yyyy-mm-dd')).toBe('2016-10-15'); });

    it('should format a valid date with padding',
       () => { expect(pf.format({year: 2016, month: 10, day: 5}, 'yyyy-mm-dd')).toBe('2016-10-05'); });

    it('should try its best with invalid dates', () => {
      expect(pf.format({year: 2016, month: NaN, day: undefined}, 'yyyy-mm-dd')).toBe('2016--');
      expect(pf.format({year: 2016, month: null, day: 0}, 'yyyy-mm-dd')).toBe('2016--00');
    });
  });

});
