import {toInteger, toString, getValueInRange, isInteger, isString} from './util';

describe('util', () => {

  describe('toInteger', () => {

    it('should be noop for integers', () => {
      expect(toInteger(0)).toBe(0);
      expect(toInteger(10)).toBe(10);
    });

    it('should act as Math.floor for numbers', () => {
      expect(toInteger(0.1)).toBe(0);
      expect(toInteger(0.9)).toBe(0);
    });

    it('should parse strings', () => {
      expect(toInteger('0')).toBe(0);
      expect(toInteger('10')).toBe(10);
      expect(toInteger('10.1')).toBe(10);
      expect(toInteger('10.9')).toBe(10);
    });

  });

  describe('toString', () => {

    it('should be noop for strings', () => { expect(toString('foo')).toBe('foo'); });

    it('should return empty string for undefined values', () => {
      expect(toString(null)).toBe('');
      expect(toString(undefined)).toBe('');
    });

    it('should stringify non-string values', () => {
      expect(toString(10)).toBe('10');
      expect(toString(false)).toBe('false');
    });

  });

  describe('getValueInRange', () => {

    it('should be noop for numbers in range', () => { expect(getValueInRange(5, 10, 0)).toBe(5); });

    it('should do corrections in range', () => {
      expect(getValueInRange(11, 10, 0)).toBe(10);
      expect(getValueInRange(-1, 10, 0)).toBe(0);
    });

    it('should take 0 as a default min bound', () => {
      expect(getValueInRange(11, 10)).toBe(10);
      expect(getValueInRange(-1, 10)).toBe(0);
    });

  });

  describe('isInteger', () => {

    it('should recognize integers', () => {
      expect(isInteger(0)).toBeTruthy();
      expect(isInteger(10)).toBeTruthy();
      expect(isInteger(-110)).toBeTruthy();
    });

    it('should recognize non-integers', () => {
      expect(isInteger(null)).toBeFalsy();
      expect(isString([])).toBeFalsy();
      expect(isString(undefined)).toBeFalsy();
      expect(isInteger('2048')).toBeFalsy();
      expect(isInteger(14.1)).toBeFalsy();
      expect(isInteger(-14.1)).toBeFalsy();
    });

  });

  describe('isString', () => {

    it('should recognize strings', () => {
      expect(isString('string')).toBeTruthy();
      expect(isString('')).toBeTruthy();
    });

    it('should recognize non-strings', () => {
      expect(isString(null)).toBeFalsy();
      expect(isString(2048)).toBeFalsy();
      expect(isString([])).toBeFalsy();
      expect(isString(undefined)).toBeFalsy();
    });

  });

});
