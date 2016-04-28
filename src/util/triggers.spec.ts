import {
  iit,
  it,
  ddescribe,
  describe,
  expect,
  inject,
  injectAsync,
  beforeEach,
  beforeEachProviders
} from '@angular/core/testing';

import {parseTriggers} from './triggers';

describe('triggers', () => {

  describe('parseTriggers', () => {

    it('should parse single trigger', () => {
      const t = parseTriggers('foo');

      expect(t.length).toBe(1);
      expect(t[0].open).toBe('foo');
      expect(t[0].close).toBe('foo');
    });

    it('should parse open:close form', () => {
      const t = parseTriggers('foo:bar');

      expect(t.length).toBe(1);
      expect(t[0].open).toBe('foo');
      expect(t[0].close).toBe('bar');
    });

    it('should parse multiple triggers', () => {
      const t = parseTriggers('foo:bar bar:baz');

      expect(t.length).toBe(2);
      expect(t[0].open).toBe('foo');
      expect(t[0].close).toBe('bar');
      expect(t[1].open).toBe('bar');
      expect(t[1].close).toBe('baz');
    });

    it('should parse multiple triggers with mixed forms', () => {
      const t = parseTriggers('foo bar:baz');

      expect(t.length).toBe(2);
      expect(t[0].open).toBe('foo');
      expect(t[0].close).toBe('foo');
      expect(t[1].open).toBe('bar');
      expect(t[1].close).toBe('baz');
    });

    it('should properly trim excessive white-spaces', () => {
      const t = parseTriggers('foo   bar  \n baz ');

      expect(t.length).toBe(3);
      expect(t[0].open).toBe('foo');
      expect(t[0].close).toBe('foo');
      expect(t[1].open).toBe('bar');
      expect(t[1].close).toBe('bar');
      expect(t[2].open).toBe('baz');
      expect(t[2].close).toBe('baz');
    });

    it('should lookup and translate special aliases', () => {
      const t = parseTriggers('hover');

      expect(t.length).toBe(1);
      expect(t[0].open).toBe('mouseenter');
      expect(t[0].close).toBe('mouseleave');
    });

    it('should detect manual triggers', () => {
      const t = parseTriggers('manual');

      expect(t[0].isManual).toBeTruthy();
    });

    it('should ignore empty inputs', () => {
      expect(parseTriggers(null).length).toBe(0);
      expect(parseTriggers(undefined).length).toBe(0);
      expect(parseTriggers('').length).toBe(0);
    });

    it('should throw when more than one manual trigger detected', () => {
      expect(() => {
        parseTriggers('manual click manual');
      }).toThrow('Triggers parse error: only one manual trigger is allowed');
    });

    it('should throw when manual trigger is mixed with other triggers', () => {
      expect(() => {
        parseTriggers('click manual');
      }).toThrow(`Triggers parse error: manual trigger can\'t be mixed with other triggers`);
    });

  });
});
