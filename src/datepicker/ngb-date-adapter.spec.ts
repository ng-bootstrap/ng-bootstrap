import {NgbDateStructAdapter} from './ngb-date-adapter';
import {NgbDate} from './ngb-date';

describe('ngb-date model adapter', () => {
  let adapter: NgbDateStructAdapter;

  beforeEach(() => { adapter = new NgbDateStructAdapter(); });

  describe('fromModel', () => {

    it('should convert null undefined as null', () => {
      expect(adapter.fromModel(null)).toBeNull();
      expect(adapter.fromModel(undefined)).toBeNull();
    });

    it('should convert valid date', () => {
      expect(adapter.fromModel({year: 2016, month: 5, day: 1})).toEqual(NgbDate.from({year: 2016, month: 5, day: 1}));
    });

    it('should do its best parsing incomplete dates', () => {
      expect(adapter.fromModel({year: 2011, month: 5, day: null}))
          .toEqual(NgbDate.from({year: 2011, month: 5, day: 1}));
    });
  });

  describe('toModel', () => {

    it('should convert null and undefined as null', () => {
      expect(adapter.toModel(null)).toBe(null);
      expect(adapter.toModel(undefined)).toBe(null);
    });

    it('should convert a valid date', () => {
      expect(JSON.stringify(adapter.toModel(NgbDate.from({year: 2016, month: 10, day: 15}))))
          .toBe(JSON.stringify({year: 2016, month: 10, day: 15}));
    });

    it('should try its best with invalid dates', () => {
      expect(JSON.stringify(adapter.toModel(NgbDate.from({year: 2016, month: 10, day: null}))))
          .toBe(JSON.stringify({year: 2016, month: 10, day: 1}));
    });
  });

});
