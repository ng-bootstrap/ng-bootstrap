import {NgbDateStructAdapter} from './ngb-date-adapter';

describe('ngb-date model adapter', () => {
  let adapter: NgbDateStructAdapter;

  beforeEach(() => { adapter = new NgbDateStructAdapter(); });

  describe('fromModel', () => {

    it('should convert null undefined as null', () => {
      expect(adapter.fromModel(null)).toBeNull();
      expect(adapter.fromModel(undefined)).toBeNull();
    });

    it('should convert valid date',
       () => { expect(adapter.fromModel({year: 2016, month: 5, day: 1})).toEqual({year: 2016, month: 5, day: 1}); });

    it('should do its best parsing incomplete dates',
       () => { expect(adapter.fromModel({year: 2011, month: 5, day: null})).toEqual({year: 2011, month: 5, day: 1}); });
  });

  describe('toModel', () => {

    it('should convert null and undefined as null', () => {
      expect(adapter.toModel(null)).toBe(null);
      expect(adapter.toModel(undefined)).toBe(null);
    });

    it('should convert a valid date',
       () => { expect(adapter.toModel({year: 2016, month: 10, day: 15})).toEqual({year: 2016, month: 10, day: 15}); });

    it('should try its best with invalid dates',
       () => { expect(adapter.toModel({year: 2016, month: 10, day: null})).toEqual({year: 2016, month: 10, day: 1}); });
  });

});
