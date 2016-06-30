import {inject, addProviders} from '@angular/core/testing';

import {toBoolean, toInteger, getValueInRange} from './util';

describe('util', () => {

  describe('toBoolean', () => {

    it('should be noop for booleans', () => {
      expect(toBoolean(true)).toBeTruthy();
      expect(toBoolean(false)).toBeFalsy();
    });

    it('should parse an empty string as truthy', () => { expect(toBoolean('')).toBeTruthy(); });

    it('should parse any string as truthy', () => {
      expect(toBoolean('foo')).toBeTruthy();
      expect(toBoolean('true')).toBeTruthy();
      expect(toBoolean('false')).toBeTruthy();
    });

  });

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

});
